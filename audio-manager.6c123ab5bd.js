/* audio-manager.js — إدارة الأصوات الحقيقية للأذان والإقامة (محلياً ودون إنترنت)
 *
 * ما يفعله:
 *  - يحفظ ملفات mp3 الحقيقية في Cache API ("muslim-notify-audio-v1") لتعمل دون اتصال.
 *  - يشغّل الأذان الكامل أو «أول تكبيرتين» أو الإقامة عبر عنصر <audio> (لا عبر Service Worker).
 *  - لا يولّد أي صوت اصطناعي: إن لم يوجد تسجيل حقيقي لا يُشغَّل شيء (ويُظهر الإشعار النصي فقط).
 *
 * ما لا يستطيعه (قيود المنصات، موثّقة في التقرير):
 *  - لا يمكن لصفحة ويب أن تشغّل صوتاً والتطبيق مغلق أو الشاشة مقفلة (إلا بحيلة الصوت الصامت التجريبية).
 *  - لا يمكن للويب قراءة وضع الصامت/عدم الإزعاج في الجهاز.
 */
(function () {
    'use strict';
    var CACHE = 'muslim-notify-audio-v1';
    var IQ = window.IQAMA_CONFIG || { file: 'iqama.mp3', short: null };
    var IQAMA_FILES = [IQ.file];
    var SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
    var A = null, curUrl = null, capTimer = null, unlocked = false, listeners = [];
    var KA = null, kaOn = false;
    var NAMES = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };

    function emit(t, d) { listeners.forEach(function (f) { try { f(t, d || {}); } catch (e) { } }); }
    function muezzins() { return (window.ADHAN_MUEZZINS || []).slice(); }
    function byId(id) { return muezzins().filter(function (m) { return m.id === id; })[0] || null; }

    /* ---------- التخزين دون إنترنت ---------- */
    function cacheOpen(name) { return window.caches ? caches.open(name || CACHE) : Promise.reject(new Error('no-cache-api')); }
    function allUrls() {
        var out = [];
        muezzins().forEach(function (m) { [m.file, m.takbeer].forEach(function (f) { if (f && out.indexOf(f) < 0) out.push(f); }); });
        return out;
    }
    function isAudioResponse(r) {
        if (!r || !r.ok) return false;
        var ct = (r.headers.get('content-type') || '').toLowerCase();
        return ct.indexOf('audio') >= 0 || ct.indexOf('octet') >= 0 || ct.indexOf('video') >= 0 || ct === '';
    }
    async function fetchToCache(url) {
        var c = await cacheOpen();
        if (await c.match(url)) return true;
        var r = await fetch(url, { cache: 'no-cache' });
        if (!isAudioResponse(r)) return false;
        await c.put(url, r.clone());
        return true;
    }
    /** ينزّل الملفات الناقصة (الصغيرة أولاً) ويحفظها. يُستدعى مرة بعد أول تحميل وعند الضغط على «تنزيل». */
    async function ensureOffline(onProgress) {
        var urls = allUrls().concat(IQAMA_FILES), res = { ok: [], missing: [] };
        urls.sort(function (a, b) { return (/takbeer/.test(a) ? 0 : 1) - (/takbeer/.test(b) ? 0 : 1); });
        for (var i = 0; i < urls.length; i++) {
            var ok = false;
            try { ok = await fetchToCache(urls[i]); } catch (e) { ok = false; }
            (ok ? res.ok : res.missing).push(urls[i]);
            if (onProgress) try { onProgress(i + 1, urls.length, urls[i], ok); } catch (e) { }
        }
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
        emit('cache', res);
        return res;
    }
    async function status() {
        var out = { files: {}, iqama: false };
        try {
            var c = await cacheOpen();
            var urls = allUrls().concat(IQAMA_FILES);
            for (var i = 0; i < urls.length; i++) out.files[urls[i]] = !!(await c.match(urls[i]));
            out.iqama = IQAMA_FILES.some(function (f) { return out.files[f]; });
        } catch (e) { }
        return out;
    }

    /* ---------- اختيار الملف المناسب ---------- */
    async function blobUrlFrom(cacheName, key) {
        try {
            var c = await cacheOpen(cacheName), r = await c.match(key);
            if (!r) return null;
            var b = await r.blob();
            return URL.createObjectURL(b);
        } catch (e) { return null; }
    }
    /** يرجع {url, revoke:boolean, label} أو null إن لم يوجد تسجيل حقيقي. */
    async function resolve(kind, o) {
        o = o || {};
        var m = byId(o.muezzin), u;
        if (kind === 'iqama') {
            for (var i = 0; i < IQAMA_FILES.length; i++) {
                u = await blobUrlFrom(CACHE, IQAMA_FILES[i]);
                if (!u) { try { if (await fetchToCache(IQAMA_FILES[i])) u = await blobUrlFrom(CACHE, IQAMA_FILES[i]); } catch (e) { } }
                if (u) return { url: u, revoke: true, label: 'الإقامة', seg: o.short && IQ.short ? IQ.short : null };
            }
            return null;
        }
        // أذان: كامل أو أول تكبيرتين
        var order = [m].concat(muezzins().filter(function (x) { return !m || x.id !== m.id; })).filter(Boolean);
        for (var k = 0; k < order.length; k++) {
            var mm = order[k], f = null;
            if (kind === 'takbeer') f = mm.takbeer || null;
            else f = mm.file;
            if (!f) continue;
            u = await blobUrlFrom(CACHE, f);
            if (!u) {                                            // لم يُحفظ بعد: جرّب الشبكة ثم احفظ
                try { if (await fetchToCache(f)) u = await blobUrlFrom(CACHE, f); } catch (e) { }
            }
            if (u) return { url: u, revoke: true, label: mm.name };
            if (kind === 'takbeer') {                            // احتياط: الأذان الكامل بدل التكبيرتين لنفس المؤذن
                var f2 = mm.file; u = f2 && await blobUrlFrom(CACHE, f2);
                if (u) return { url: u, revoke: true, label: mm.name, full: true };
            }
        }
        return null;
    }

    /* ---------- التشغيل ---------- */
    function el() {
        if (A) return A;
        A = new Audio();
        A.preload = 'auto';
        A.setAttribute('playsinline', '');
        A.addEventListener('ended', function () { cleanup(); emit('ended'); });
        A.addEventListener('error', function () { emit('error'); });
        return A;
    }
    function cleanup() {
        clearTimeout(capTimer); capTimer = null;
        if (curUrl) { try { URL.revokeObjectURL(curUrl); } catch (e) { } curUrl = null; }
        try { if (navigator.mediaSession) { navigator.mediaSession.metadata = null; } } catch (e) { }
    }
    function pauseQuran() {
        try { var q = document.getElementById('audio'); if (q && !q.paused) { q.pause(); return true; } } catch (e) { }
        return false;
    }
    function media(title) {
        try {
            if (!navigator.mediaSession || !window.MediaMetadata) return;
            navigator.mediaSession.metadata = new MediaMetadata({ title: title, artist: 'المسلم', album: 'الأذان', artwork: [{ src: 'ic-192.png', sizes: '192x192', type: 'image/png' }, { src: 'ic-512.png', sizes: '512x512', type: 'image/png' }] });
            navigator.mediaSession.setActionHandler('stop', function () { stop(); });
            navigator.mediaSession.setActionHandler('pause', function () { stop(); });
        } catch (e) { }
    }
    /**
     * kind: 'adhan' | 'takbeer' | 'iqama'
     * o: {muezzin, prayer, volume(0-1), maxSeconds(0=كامل), title}
     * يرجع {ok, reason, label}. reason: 'no-file' | 'blocked' | 'error'
     */
    async function play(kind, o) {
        o = o || {};
        stop(true);
        var r = await resolve(kind, o);
        if (!r) return { ok: false, reason: 'no-file' };
        var a = el();
        pauseQuran();
        curUrl = r.url;
        a.src = r.url;
        a.volume = Math.max(0.05, Math.min(1, o.volume == null ? 1 : o.volume));
        if (r.seg) {
            var seg = r.seg;
            a.addEventListener('loadedmetadata', function once() { a.removeEventListener('loadedmetadata', once); try { a.currentTime = seg[0]; } catch (e) { } });
            capTimer = setTimeout(function () { fadeStop(300); }, Math.max(1, seg[1] - seg[0]) * 1000);
        }
        media(o.title || (kind === 'iqama' ? 'الإقامة' : 'الأذان') + (o.prayer ? ' — ' + NAMES[o.prayer] : ''));
        try {
            await a.play();
        } catch (e) {
            var blocked = e && (e.name === 'NotAllowedError');
            cleanup();
            return { ok: false, reason: blocked ? 'blocked' : 'error', label: r.label };
        }
        if (!r.seg && o.maxSeconds > 0) capTimer = setTimeout(function () { fadeStop(1500); }, o.maxSeconds * 1000);
        emit('play', { kind: kind, label: r.label, prayer: o.prayer });
        return { ok: true, label: r.label };
    }
    function fadeStop(ms) {
        if (!A || A.paused) { stop(); return; }
        var v0 = A.volume, t0 = Date.now();
        (function step() {
            var k = Math.min(1, (Date.now() - t0) / ms);
            try { A.volume = Math.max(0, v0 * (1 - k)); } catch (e) { }
            if (k < 1) setTimeout(step, 80); else { stop(); try { A.volume = v0; } catch (e) { } }
        })();
    }
    function stop(silent) {
        try { if (A) { A.pause(); A.removeAttribute('src'); A.load(); } } catch (e) { }
        cleanup();
        if (!silent) emit('stop');
    }
    function playing() { return !!(A && !A.paused && !A.ended); }

    /* فتح قفل الصوت بأول لمسة (شرط iOS وبعض المتصفحات) */
    function unlock() {
        if (unlocked) return;
        unlocked = true;
        try {
            var a = el();
            a.src = SILENT;
            var p = a.play();
            if (p && p.then) p.then(function () { a.pause(); a.removeAttribute('src'); }, function () { unlocked = false; });
        } catch (e) { unlocked = false; }
    }
    ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (ev) {
        document.addEventListener(ev, function once() { unlock(); if (unlocked) document.removeEventListener(ev, once, true); }, true);
    });

    /* ---------- وضع الاستعداد الصوتي (تجريبي، اختياري، يستهلك بطارية) ---------- */
    function keepAliveStart() {
        if (kaOn) return true;
        try {
            if (!KA) { KA = new Audio(SILENT); KA.loop = true; KA.setAttribute('playsinline', ''); KA.volume = 0.01; }
            var p = KA.play();
            if (p && p.catch) p.catch(function () { kaOn = false; emit('keepalive', { on: false }); });
            kaOn = true;
            try {
                if (navigator.mediaSession && window.MediaMetadata) {
                    navigator.mediaSession.metadata = new MediaMetadata({ title: 'المسلم — في انتظار موعد الأذان', artist: 'وضع الاستعداد الصوتي', artwork: [{ src: 'ic-192.png', sizes: '192x192', type: 'image/png' }] });
                    navigator.mediaSession.setActionHandler('pause', function () { keepAliveStop(); });
                }
            } catch (e) { }
            emit('keepalive', { on: true });
            return true;
        } catch (e) { kaOn = false; return false; }
    }
    function keepAliveStop() {
        try { if (KA) KA.pause(); } catch (e) { }
        kaOn = false;
        try { if (navigator.mediaSession) navigator.mediaSession.metadata = null; } catch (e) { }
        emit('keepalive', { on: false });
    }

    window.MuslimAudio = {
        play: play, stop: stop, playing: playing, unlock: unlock, status: status, ensureOffline: ensureOffline,
        muezzins: muezzins, resolve: resolve,
        keepAlive: { start: keepAliveStart, stop: keepAliveStop, active: function () { return kaOn; } },
        on: function (f) { listeners.push(f); },
        NAMES: NAMES, IQAMA_FILES: IQAMA_FILES
    };

    // تنزيل الملفات الصوتية بهدوء بعد أول تحميل (مرة واحدة، دون تعطيل الواجهة)
    function idle() {
        if (!navigator.onLine) return;
        try { if (localStorage.getItem('muslim-notify-audio-warm') === (window.__b || '1')) return; } catch (e) { }
        ensureOffline().then(function (r) { if (!r.missing.length) { try { localStorage.setItem('muslim-notify-audio-warm', window.__b || '1'); } catch (e) { } } }).catch(function () { });
    }
    window.addEventListener('load', function () { setTimeout(function () { if (window.requestIdleCallback) requestIdleCallback(idle, { timeout: 8000 }); else idle(); }, 4000); });
})();
