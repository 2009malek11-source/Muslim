from __future__ import annotations
import ipaddress, json, os, re, shutil, socket, subprocess, tempfile, time, uuid
from pathlib import Path
from urllib.parse import urlparse
from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl

APP_DIR = Path(__file__).resolve().parent
WORK_DIR = Path(os.getenv("MEDIA_WORK_DIR", APP_DIR / "work")).resolve()
OUT_DIR = Path(os.getenv("MEDIA_OUTPUT_DIR", APP_DIR / "outputs")).resolve()
MAX_UPLOAD_MB = int(os.getenv("MEDIA_MAX_UPLOAD_MB", "500"))
API_KEY = os.getenv("MEDIA_API_KEY", "").strip()
ALLOWED_ORIGINS = [x.strip() for x in os.getenv("MEDIA_ALLOWED_ORIGINS", "*").split(",") if x.strip()]
WORK_DIR.mkdir(parents=True, exist_ok=True); OUT_DIR.mkdir(parents=True, exist_ok=True)
app = FastAPI(title="Muslim Audio/Video Processor", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=ALLOWED_ORIGINS, allow_credentials=False, allow_methods=["GET","POST","OPTIONS"], allow_headers=["Authorization","Content-Type"])

class LinkRequest(BaseModel):
    url: str
    platform: str | None = None
    mode: str = "remove_music"
    output_format: str = "mp3"

def authorize(auth: str | None):
    if API_KEY and auth != f"Bearer {API_KEY}":
        raise HTTPException(401, "Invalid or missing API key")

def validate_public_url(raw: str) -> str:
    try:
        u = urlparse(raw)
        if u.scheme not in ("http", "https") or not u.hostname:
            raise ValueError()
        host = u.hostname.encode("idna").decode("ascii")
        if host in ("localhost",) or host.endswith((".local", ".internal")):
            raise ValueError()
        # Avoid obvious private-network SSRF targets. Deploy this service behind normal egress controls too.
        try:
            infos = socket.getaddrinfo(host, u.port or (443 if u.scheme == "https" else 80), type=socket.SOCK_STREAM)
            for info in infos:
                ip = ipaddress.ip_address(info[4][0])
                if not ip.is_global:
                    raise ValueError()
        except socket.gaierror:
            raise ValueError()
        return raw
    except Exception:
        raise HTTPException(400, "رابط غير صالح أو غير عام. استخدم رابط HTTP/HTTPS لمحتوى تملك حق معالجته.")

def run(cmd: list[str], timeout: int = 3600):
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=timeout)
    if p.returncode:
        tail = (p.stdout or "")[-1800:]
        raise RuntimeError(tail or "Media processing command failed")
    return p.stdout

def separate_vocals(source: Path, work: Path) -> Path:
    wav = work / "source-audio.wav"
    run(["ffmpeg", "-y", "-i", str(source), "-vn", "-ac", "2", "-ar", "44100", str(wav)], timeout=900)
    out = work / "separated"
    run([os.getenv("PYTHON", "python"), "-m", "demucs.separate", "--two-stems=vocals", "-n", "htdemucs", "-o", str(out), str(wav)], timeout=7200)
    candidates = list(out.glob("**/vocals.wav"))
    if not candidates: raise RuntimeError("لم يُنتج نموذج فصل الصوت ملف الكلام/التلاوة المتوقع.")
    return candidates[0]

def process(source: Path, mode: str, fmt: str, work: Path) -> Path:
    if mode not in ("remove_music", "extract_audio", "keep_video"):
        raise HTTPException(400, "وضع المعالجة غير معروف")
    if fmt not in ("mp3", "wav"):
        fmt = "mp3"
    if mode == "extract_audio":
        out = OUT_DIR / f"muslim-audio-{uuid.uuid4().hex}.{fmt}"
        run(["ffmpeg", "-y", "-i", str(source), "-vn", "-codec:a", "libmp3lame" if fmt == "mp3" else "pcm_s16le", str(out)])
        return out
    vocals = separate_vocals(source, work)
    # For video output, retain the original picture and replace its soundtrack with separated vocals.
    if mode == "keep_video":
        out = OUT_DIR / f"muslim-video-{uuid.uuid4().hex}.mp4"
        run(["ffmpeg", "-y", "-i", str(source), "-i", str(vocals), "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(out)], timeout=1800)
        return out
    out = OUT_DIR / f"muslim-vocals-{uuid.uuid4().hex}.{fmt}"
    run(["ffmpeg", "-y", "-i", str(vocals), "-codec:a", "libmp3lame" if fmt == "mp3" else "pcm_s16le", str(out)])
    return out

def download_link(url: str, work: Path) -> Path:
    validate_public_url(url)
    # yt-dlp handles public URLs it supports. Do not use this endpoint to bypass DRM or access controls.
    template = str(work / "source.%(ext)s")
    run(["yt-dlp", "--no-playlist", "--max-filesize", f"{MAX_UPLOAD_MB}M", "--restrict-filenames", "-o", template, url], timeout=1800)
    candidates = [p for p in work.glob("source.*") if p.is_file() and p.stat().st_size > 0]
    if not candidates: raise RuntimeError("لم يتم تنزيل ملف وسائط من الرابط. قد لا تدعم المنصة هذا الرابط.")
    return max(candidates, key=lambda p: p.stat().st_size)

@app.get("/health")
def health(): return {"ok": True, "service": "muslim-media-processor"}

@app.get("/api/files/{name}")
def get_file(name: str):
    if not re.fullmatch(r"[A-Za-z0-9_.-]+\.(?:mp3|wav|mp4)", name): raise HTTPException(404, "Not found")
    p = (OUT_DIR / name).resolve()
    if p.parent != OUT_DIR or not p.is_file(): raise HTTPException(404, "Not found")
    return FileResponse(p, filename=p.name)

@app.post("/api/process")
async def process_media(request: Request, authorization: str | None = Header(default=None)):
    authorize(authorization)
    # The browser sends multipart/form-data for uploads and JSON for pasted links.
    is_json = "application/json" in (request.headers.get("content-type") or "")
    url = None
    file = None
    mode = "remove_music"
    output_format = "mp3"
    if is_json:
        try:
            data = LinkRequest(**(await request.json())); url=data.url; mode=data.mode; output_format=data.output_format
        except Exception as e: raise HTTPException(400, "طلب الرابط غير مكتمل") from e
    else:
        form = await request.form()
        file = form.get("file")
        mode = str(form.get("mode") or mode)
        output_format = str(form.get("output_format") or output_format)
        source_url = form.get("source_url")
        if source_url and not file: url = str(source_url)
    if not file and not url: raise HTTPException(400, "اختر ملفًا أو أرسل رابطًا")
    work = Path(tempfile.mkdtemp(prefix="muslim-media-", dir=WORK_DIR))
    try:
        if file:
            suffix = Path(file.filename or "upload.bin").suffix.lower()[:12] or ".bin"
            source = work / ("upload" + suffix)
            size = 0
            with source.open("wb") as dst:
                while True:
                    chunk = await file.read(1024*1024)
                    if not chunk: break
                    size += len(chunk)
                    if size > MAX_UPLOAD_MB*1024*1024: raise HTTPException(413, f"الحد الأقصى للملف {MAX_UPLOAD_MB} MB")
                    dst.write(chunk)
        else:
            source = download_link(url, work)
        out = process(source, mode, output_format, work)
        return {"ok": True, "filename": out.name, "download_url": f"/api/files/{out.name}", "mode": mode}
    except HTTPException: raise
    except subprocess.TimeoutExpired: raise HTTPException(504, "انتهت مهلة المعالجة؛ جرّب ملفًا أقصر.")
    except Exception as e:
        detail = str(e)[-1200:] or "تعذرت المعالجة"
        raise HTTPException(500, detail)
    finally:
        shutil.rmtree(work, ignore_errors=True)
