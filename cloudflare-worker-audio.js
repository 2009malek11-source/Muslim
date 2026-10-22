// وسيط صوت لملفات archive.org (يدعم Range + CORS) — حلّ احتياطي للآيفون إن رفض Safari التشغيل المباشر.
// النشر: Cloudflare Workers ← Create Worker ← الصق الملف ← ضع الرابط في app-config.js (AUDIO_PROXY).
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'range,content-type','Access-Control-Expose-Headers':'content-length,content-range,accept-ranges'};
const ALLOW=/^https:\/\/([a-z0-9-]+\.)*archive\.org\//;
export default{
  async fetch(req){
    if(req.method==='OPTIONS')return new Response(null,{status:204,headers:CORS});
    const u=new URL(req.url).searchParams.get('u');
    if(!u||!ALLOW.test(u))return new Response('bad request',{status:400,headers:CORS});
    const h=new Headers();const rg=req.headers.get('range');if(rg)h.set('range',rg);
    const up=await fetch(u,{headers:h,redirect:'follow'});
    const out=new Headers(up.headers);
    Object.keys(CORS).forEach(k=>out.set(k,CORS[k]));
    out.set('content-type','audio/mpeg');out.delete('content-disposition');out.set('accept-ranges','bytes');
    return new Response(up.body,{status:up.status,headers:out});
  }
};
