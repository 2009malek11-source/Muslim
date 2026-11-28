/* ربط الموقع بلوحة التحكم (Supabase المجاني): أعلام الميزات، الصيانة، الإعلانات، وإحصاءات مجهولة خفيفة.
   - لا حسابات للزوار. لا بصمة جهاز. المفتاح العام (publishable) آمن بطبيعته؛ لا يوجد هنا أي سر.
   - يعمل دون اتصال: يُستخدم آخر إعداد محفوظ، وأي فشل لا يعطّل الموقع. */
(function () {
    'use strict';
    var URL_ = 'https://eriawmjzdfbiszklhfrx.supabase.co';
    var KEY = 'sb_publishable_GMCG88gSNKyZMqRj1g2eWg_8qv2YDn9';
    var LSG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    var CK = 'muslim-ctl-cache', DK = 'muslim-ann-dismissed';
    var cfg = null, low = false, interval = 120, sid = uuid();
    var flows = [], ack = [], secs = {}, uses = {}, errs = [], acts = [], cur = 'home', t0 = Date.now(), lastTick = Date.now(), started = false;

    function uuid() { try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) { } var h = '0123456789abcdef', o = ''; for (var i = 0; i < 36; i++) o += (i === 8 || i === 13 || i === 18 || i === 23) ? '-' : h[Math.floor(Math.random() * 16)]; return o; }
    function hdr() { return { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json' }; }
    function timeout(ms) { var c = new AbortController(); setTimeout(function () { try { c.abort(); } catch (e) { } }, ms); return c.signal; }

    /* ---------- الإعدادات ---------- */
    function load() {
        if (!URL_) return;
        try { cfg = JSON.parse(LSG(CK) || 'null'); } catch (e) { cfg = null; }
        if (cfg) apply();
        if (navigator.onLine === false) return;
        fetch(URL_ + '/rest/v1/rpc/public_config', { method: 'POST', headers: hdr(), body: '{}', signal: timeout(8000), cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (j) { if (j && j.features) { j._t = Date.now(); cfg = j; LSS(CK, JSON.stringify(j)); apply(); } })
            .catch(function () { });
    }
    function setting(k, d) { return cfg && cfg.settings && cfg.settings[k] != null ? cfg.settings[k] : d; }

    function apply() {
        if (!cfg) return;
        low = setting('low_resource_mode', false) === true; interval = Math.max(60, +setting('telemetry_interval_s', 120) || 120);
        /* الميزات المعطّلة: تُخفى بطاقاتها من الرئيسية */
        var f = cfg.features || {};
        document.querySelectorAll('.tile[onclick], .nvDx[onclick]').forEach(function (t) {
            var m = (t.getAttribute('onclick') || '').match(/show\('([A-Za-z0-9_]+)'\)/); if (!m) return;
            var s = f[m[1]]; if (!s) return;
            if (s.on === false || s.home === false) { t.style.setProperty('display', 'none', 'important'); t.setAttribute('data-ctl-hid', '1'); } else if (t.hasAttribute('data-ctl-hid')) { t.style.removeProperty('display'); t.removeAttribute('data-ctl-hid'); }
        });
        maintenance(); announce();
    }
    function bar(id, cls) {
        var e = document.getElementById(id);
        if (!e) { e = document.createElement('div'); e.id = id; e.className = 'ctlBar ' + (cls || ''); e.setAttribute('role', 'status'); if (cls === 'ctlInfo') { var bx = document.getElementById('ctlBottom'); if (!bx) { bx = document.createElement('div'); bx.id = 'ctlBottom'; document.body.appendChild(bx); } bx.appendChild(e); } else document.body.insertBefore(e, document.body.firstChild); }
        return e;
    }
    /* نوافذ الصيانة: تُقيَّم عند القراءة (بداية/نهاية)، ولا تُصدَّق نسخة قديمة محفوظة */
    function windows() {
        if (!cfg || !cfg.maint || !cfg.maint.length) return [];
        var fresh = cfg._t && Date.now() - cfg._t < 6 * 3600e3, now = Date.now();
        if (!fresh) return [];
        return cfg.maint.filter(function (m) { return !m.until || Date.parse(m.until) > now; });
    }
    function secMaint(id) { var w = windows().filter(function (m) { return m.scope === id; }); return w.length ? w[0] : null; }
    function maintenance() {
        var m = setting('maintenance', {}), e = document.getElementById('ctlMaint'), all = windows().filter(function (x) { return x.scope === 'all'; })[0], msg = null;
        if (m && m.on) msg = m.message || 'الموقع تحت صيانة قصيرة.'; else if (all) msg = all.msg || 'الموقع تحت صيانة قصيرة.';
        if (msg) { e = bar('ctlMaint', 'ctlWarn'); e.textContent = String(msg).slice(0, 300); } else if (e) e.remove();
        /* الأقسام تحت الصيانة: تُخفى بطاقاتها فقط، وباقي الموقع يعمل */
        document.querySelectorAll('.tile[onclick], .nvDx[onclick]').forEach(function (t) {
            var q = (t.getAttribute('onclick') || '').match(/show\('([A-Za-z0-9_]+)'\)/); if (!q || !secMaint(q[1])) return;
            t.style.setProperty('opacity', '.45', 'important'); t.setAttribute('data-ctl-mt', '1');
        });
    }
    function dismissed() { try { return JSON.parse(LSG(DK) || '[]'); } catch (e) { return []; } }
    function announce() {
        var old = document.getElementById('ctlAnn'); if (old) old.remove();
        var d = dismissed(), list = (cfg.ann || []).filter(function (a) { return d.indexOf(a.id) < 0; });
        if (!list.length) return;
        var a = list[0], e = bar('ctlAnn', 'ctlInfo');
        var b = document.createElement('b'); b.textContent = String(a.t || '').slice(0, 120);
        var s = document.createElement('span'); s.textContent = ' ' + String(a.b || '').slice(0, 400);
        var x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'إغلاق'); x.textContent = '✕';
        x.onclick = function () { d.push(a.id); LSS(DK, JSON.stringify(d.slice(-50))); e.remove(); announce(); };
        e.appendChild(b); e.appendChild(s); e.appendChild(x);
    }

    /* ---------- الإحصاءات المجهولة (حدّ أدنى من الكتابة) ---------- */
    function tick() { var n = Date.now(); if (document.visibilityState === 'visible') secs[cur] = (secs[cur] || 0) + Math.round((n - lastTick) / 1000); lastTick = n; }
    function device() {
        var u = navigator.userAgent || '', w = innerWidth;
        return {
            dev: w < 700 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop',
            os: /Android/i.test(u) ? 'Android' : /iPhone|iPad|iPod/i.test(u) ? 'iOS' : /Windows/i.test(u) ? 'Windows' : /Mac/i.test(u) ? 'macOS' : /Linux/i.test(u) ? 'Linux' : 'other',
            br: /Edg\//.test(u) ? 'Edge' : /OPR\//.test(u) ? 'Opera' : /Chrome\//.test(u) ? 'Chrome' : /Firefox\//.test(u) ? 'Firefox' : /Safari\//.test(u) ? 'Safari' : 'other',
            scr: w < 480 ? 'xs' : w < 768 ? 'sm' : w < 1024 ? 'md' : w < 1440 ? 'lg' : 'xl'
        };
    }

    var infoObj = null, SCV = (function () { try { var m = /site-control\.([0-9a-f]+)\.js/.exec(document.currentScript && document.currentScript.src || ''); return m ? m[1] : ''; } catch (e) { return ''; } })();
    function collectInfo() {
        try {
            var n = navigator, c = n.connection || n.mozConnection || n.webkitConnection || {}, mm = function (q) { try { return matchMedia(q).matches ? 1 : 0; } catch (e) { return 0; } };
            var o = { ua: String(n.userAgent || '').slice(0, 200), pl: String(n.platform || '').slice(0, 30), lg: String(n.language || '').slice(0, 12), lgs: (n.languages || []).slice(0, 4).join(','), tz: '', sc: screen.width + 'x' + screen.height, vp: innerWidth + 'x' + innerHeight, dpr: +(window.devicePixelRatio || 1).toFixed(2), cd: screen.colorDepth, cores: n.hardwareConcurrency || 0, mem: n.deviceMemory || 0, tp: n.maxTouchPoints || 0, pwa: (mm('(display-mode: standalone)') || n.standalone) ? 1 : 0, dark: mm('(prefers-color-scheme: dark)'), rm: mm('(prefers-reduced-motion: reduce)'), ori: (screen.orientation && screen.orientation.type) || '', ck: n.cookieEnabled ? 1 : 0, on: n.onLine === false ? 0 : 1, sw: (n.serviceWorker && n.serviceWorker.controller) ? 1 : 0, ver: SCV, cn: { t: c.effectiveType || '', ty: c.type || '', d: c.downlink || 0, r: c.rtt || 0, sd: c.saveData ? 1 : 0 } };
            try { o.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
            try { o.np = window.Notification ? Notification.permission : 'na'; } catch (e) { }
            try { var wr = []; ['audio', 'serviceWorker', 'share', 'wakeLock', 'geolocation', 'mediaSession', 'vibrate', 'storage'].forEach(function (k) { if (k in n) wr.push(k); }); o.api = wr.join(','); } catch (e) { }
            infoObj = o;
            var jobs = [];
            if (n.getBattery) jobs.push(n.getBattery().then(function (b) { o.bat = { l: Math.round(b.level * 100), c: b.charging ? 1 : 0 }; }).catch(function () { }));
            if (n.storage && n.storage.estimate) jobs.push(n.storage.estimate().then(function (e) { o.st = { u: Math.round((e.usage || 0) / 1048576), q: Math.round((e.quota || 0) / 1048576) }; }).catch(function () { }));
            if (window.performance && performance.getEntriesByType) { try { var nv = performance.getEntriesByType('navigation')[0]; if (nv) o.load = Math.round(nv.loadEventEnd || nv.domContentLoadedEventEnd || 0); } catch (e) { } }
            return Promise.all(jobs);
        } catch (e) { return Promise.resolve(); }
    }
    function locStr() { try { var l = JSON.parse(LSG('muslim-v107-loc') || 'null'); if (l && isFinite(l.lat) && isFinite(l.lon)) return (Math.round(l.lat * 10) / 10).toFixed(1) + ',' + (Math.round(l.lon * 10) / 10).toFixed(1); } catch (e) { } return ''; }
    function visitorId() { if (LSG('muslim-stats-off') === '1') return null; var v = LSG('muslim-vid'); if (!v) { v = uuid(); LSS('muslim-vid', v); } return v; }
    function rpc(name, args) { if (!URL_) return Promise.reject(new Error('no-backend')); return fetch(URL_ + '/rest/v1/rpc/' + name, { method: 'POST', headers: hdr(), body: JSON.stringify(args || {}), signal: timeout(10000), cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); }); }
    function send(ev, beacon) {
        if (!URL_) return;
        if (LSG('muslim-stats-off') === '1' || navigator.onLine === false) return;
        tick();
        var p = Object.assign({ sid: sid, ev: ev, ret: LSG('muslim-ctl-seen') ? 1 : 0, sec: String(cur).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'home', secs: secs, uses: uses, dur: Math.round((Date.now() - t0) / 1000), errs: errs.splice(0, 5) }, device()); if (acts.length) p.acts = acts.splice(0, 12); audFlush(true); var lc = locStr(); if (lc) p.loc = lc; if (ev === 'start' && infoObj) { try { if (!infoObj.load && window.performance && performance.getEntriesByType) { var nv2 = performance.getEntriesByType('navigation')[0]; if (nv2 && nv2.loadEventEnd) infoObj.load = Math.round(nv2.loadEventEnd); } } catch (e) { } p.info = infoObj; }
        var vid = visitorId(); if (vid) p.vid = vid; if (flows.length) p.flow = flows.splice(0, 8); if (ev === 'end' && cur) { (p.flow = p.flow || []).push([cur, 'exit']); }
        if (LSG('muslim-inbox') === '1') { p.vk = LSG('muslim-vid') || (function () { var v = uuid(); LSS('muslim-vid', v); return v; })(); p.inbox = 1; if (ack.length) { p.ack = ack.splice(0, 20); } }
        secs = {}; uses = {};
        var body = JSON.stringify(p);
        try {
            if (beacon && navigator.sendBeacon) { navigator.sendBeacon(URL_ + '/functions/v1/collect?apikey=' + KEY, new Blob([body], { type: 'text/plain' })); return; }
            fetch(URL_ + '/functions/v1/collect', { method: 'POST', headers: hdr(), body: body, signal: timeout(8000), keepalive: true })
                .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) { if (typeof j.low === 'boolean') low = j.low; if (j.next) interval = Math.max(60, +j.next); if (j.msgs && j.msgs.length) inbox(j.msgs); } }).catch(function () { });
        } catch (e) { }
        LSS('muslim-ctl-seen', '1');
    }
    function inbox(ms) { /* رسائل فردية بموافقة الزائر فقط */
        var ids = []; ms.filter(function (m) { return !m.read; }).slice(0, 3).forEach(function (m) { var e = bar('ctlMsg' + m.id, 'ctlInfo'); e.textContent = String(m.body || m.title || '').slice(0, 400); var x = document.createElement('button'); x.textContent = '✕'; x.type = 'button'; x.onclick = function () { e.remove(); }; e.appendChild(x); ids.push(m.id); });
        if (ids.length) ack = ack.concat(ids);
    }
    function loop() {
        if (started) return; started = true; send('start');
        (function again() { setTimeout(function () { if (document.visibilityState === 'visible') send('hb'); again(); }, (low ? interval * 4 : interval) * 1000); })();
    }
    /* تتبّع القسم الحالي واستخدام الميزات بلا مسّ بباقي الشيفرة */
    function hook() {
        var s = window.show; if (typeof s !== 'function' || s.__ctl) return;
        var w = function (id) { try { var fs = cfg && cfg.features && cfg.features[id]; if (fs && fs.on === false) { if (window.toast) window.toast('هذه الميزة متوقفة مؤقتًا من الإدارة'); return; } } catch (e) { } var mt = secMaint(String(id)); if (mt) { if (window.toast) window.toast(String(mt.msg || 'هذا القسم تحت الصيانة مؤقتًا').slice(0, 160)); return; } try { tick(); var nid = String(id); if (nid !== cur && flows.length < 8) flows.push([cur, nid]); cur = nid; uses[cur] = (uses[cur] || 0) + 1; } catch (e) { } return s.apply(this, arguments); };
        w.__ctl = 1; window.show = w;
    }

    /* تفاعلات الجهاز: اسم الزر/العنصر الذي ضُغط عليه فقط (بلا قراءة أي نص يكتبه الزائر)، وتُحذف بعد ٤ أيام */
    document.addEventListener('click', function (e) {
        try {
            if (LSG('muslim-stats-off') === '1') return;
            var t = e.target; if (!t || !t.closest) return;
            if (t.closest('textarea,input[type=text],input[type=password],input[type=search],input[type=email],input:not([type])')) return;
            var el = t.closest('button,a,[role=button],summary,.tile,select,input'); if (!el) return;
            var l = el.getAttribute('aria-label') || el.getAttribute('data-label') || (el.innerText || '').trim() || el.id || el.title || '';
            var hk = el.getAttribute && (el.getAttribute('data-copy') || el.getAttribute('data-fav') || el.getAttribute('data-tts')); if (hk) l = 'حديث ' + hk.replace('bukhari', 'البخاري').replace('muslim', 'مسلم') + ' — ' + l;
            l = String(l).replace(/\s+/g, ' ').trim().slice(0, 40); if (!l) return;
            if (/^mushaf/.test(String(cur))) { try { var pg = window.v107Mushaf && window.v107Mushaf.page && window.v107Mushaf.page(); if (pg) l += ' (ص ' + pg + ')'; } catch (e2) { } }
            var s2 = String(cur).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'home', last = acts[acts.length - 1];
            if (last && last[0] === s2 && last[1] === l) { last[2] = Math.min(999, (last[2] || 1) + 1); return; }
            if (acts.length >= 40) acts.shift(); acts.push([s2, l, 1]);
        } catch (e) { }
    }, true);

    /* صفحات المصحف المقروءة: تُسجَّل الصفحة التي يبقى عليها القارئ أكثر من ٥ ثوانٍ */
    (function () { var pt = 0, lastP = 0; document.addEventListener('mushaf:page', function (e) { try { if (LSG('muslim-stats-off') === '1') return; var p = e.detail && (e.detail.page || e.detail); if (typeof p === 'object') p = p.page; p = +p; if (!p) return; clearTimeout(pt); pt = setTimeout(function () { if (p === lastP) return; lastP = p; if (acts.length >= 40) acts.shift(); acts.push(['mushaf107', '📖 قرأ صفحة ' + p, 1]); }, 5000); } catch (x) { } }); })();

    /* مدة الاستماع: القارئ/المقطع ومدة الاستماع الفعلية (تُرسل كتفاعل «🎧»، وتُحذف بعد ٤ أيام) */
    var aud = null;
    function audLabel(a) {
        try {
            var u = String(a.currentSrc || a.src || ''); if (!u || /^(data|blob):/.test(u)) return '';
            var x = new URL(u, location.href), seg = x.pathname.split('/').filter(Boolean), file = (seg.pop() || '').replace(/\.[a-z0-9]+$/i, ''), who = decodeURIComponent(seg.pop() || x.host).replace(/[_-]+/g, ' ').slice(0, 28);
            if (/adhan|iqama|tone-|silence|keep/i.test(u)) return '';
            var ttl = ''; try { var t = document.getElementById('v43AudioTitle'); if (t && t.textContent && document.getElementById('v43AudioBar') && document.getElementById('v43AudioBar').classList.contains('show')) ttl = t.textContent.trim().slice(0, 30); } catch (e) { }
            if (/^\d{3}$/.test(file)) return who + ' · سورة ' + (+file);
            if (/^\d{6}$/.test(file)) return who + ' · سورة ' + (+file.slice(0, 3)) + ' آية ' + (+file.slice(3));
            return (ttl || who + ' · ' + file).slice(0, 48);
        } catch (e) { return ''; }
    }
    function audFlush(keep) {
        if (!aud) return; var n = Date.now(), d = Math.round((n - aud.t) / 1000);
        if (d >= (keep ? 45 : 5)) {
            var m = d >= 60 ? Math.floor(d / 60) + ' د' + (d % 60 ? ' ' + (d % 60) + ' ث' : '') : d + ' ث', l = '🎧 ' + aud.l + ' — ' + m;
            if (acts.length >= 40) acts.shift(); acts.push([aud.s, l.slice(0, 90), 1]); aud.t = n;
        } else if (!keep) { aud = null; return; }
        if (!keep) aud = null; else if (d < 45) { /* يستمر العدّ */ }
    }
    function audStop() { if (aud) { var t = aud.t; audFlush(false); aud = null; } }
    function audHook(a) {
        if (!a || a.__ctlA) return; a.__ctlA = 1;
        a.addEventListener('playing', function () { try { if (LSG('muslim-stats-off') === '1') return; var l = audLabel(a); if (!l) return; if (aud && aud.el !== a) audFlush(false); aud = { el: a, l: l, t: Date.now(), s: String(cur).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'home' }; } catch (e) { } });
        ['pause', 'ended', 'emptied', 'abort'].forEach(function (k) { a.addEventListener(k, function () { if (aud && aud.el === a) audStop(); }); });
        a.addEventListener('error', function () { try { var l = audLabel(a); if (l) errs.push({ s: cur, k: 'audio', m: ('تعذّر تشغيل: ' + l).slice(0, 160) }); } catch (e) { } });
    }
    try { var opl = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { try { audHook(this); } catch (e) { } return opl.apply(this, arguments); }; } catch (e) { }
    document.addEventListener('play', function (e) { try { audHook(e.target); } catch (x) { } }, true);
    window.addEventListener('pagehide', function () { if (aud) audFlush(false); });
    window.addEventListener('error', function (e) { errs.push({ s: cur, k: 'js', m: (String(e.message || '').slice(0, 105) + (e.filename ? ' @' + String(e.filename).split('/').pop().split('?')[0].slice(0, 30) + ':' + (e.lineno || 0) + ':' + (e.colno || 0) : '')).slice(0, 160) }); });
    window.addEventListener('error', function (e) { var t = e.target; if (t && t !== window && t.tagName && /^(SCRIPT|LINK|IMG|AUDIO|SOURCE)$/.test(t.tagName)) { var u = String(t.src || t.href || ''); try { u = new URL(u, location.href); u = u.host + u.pathname; } catch (x) { } errs.push({ s: cur, k: 'load', m: String(u).slice(0, 120) }); } }, true);
    window.addEventListener('unhandledrejection', function (e) { errs.push({ s: cur, k: 'promise', m: String((e.reason && e.reason.message) || e.reason || '').slice(0, 160) }); });
    window.addEventListener('pagehide', function () { send('end', true); });
    document.addEventListener('visibilitychange', function () { lastTick = Date.now(); });
    window.addEventListener('online', load);

    var css = document.createElement('style');
    css.textContent = '.ctlBar{position:sticky;top:0;z-index:99000;padding:8px 14px;font-size:.92em;display:flex;gap:8px;align-items:center;justify-content:center;text-align:center}.ctlWarn{background:#b45309;color:#fff}.ctlInfo{background:var(--green,#1d624f);color:#fff}#ctlBottom{position:fixed;left:12px;right:12px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:99000;display:flex;flex-direction:column;gap:6px;max-width:640px;margin-inline:auto;pointer-events:none}#ctlBottom .ctlBar{position:static;border-radius:14px;box-shadow:0 6px 22px rgba(0,0,0,.28);pointer-events:auto;text-align:start;justify-content:space-between}#ctlBottom:empty{display:none}.ctlBar button{background:rgba(255,255,255,.18);color:inherit;border:0;border-radius:50%;width:28px;height:28px;cursor:pointer}';
    document.head.appendChild(css);
    window.MuslimCtl = { rpc: rpc, vid: function () { var v = LSG('muslim-vid'); if (!v) { v = uuid(); LSS('muslim-vid', v); } return v; }, reload: load, stats: function (on) { LSS('muslim-stats-off', on ? '0' : '1'); }, inbox: function (on) { LSS('muslim-inbox', on ? '1' : '0'); } };
    var deb = 0;
    function watch() { try { new MutationObserver(function () { clearTimeout(deb); deb = setTimeout(function () { if (cfg) apply(); }, 250); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { } }
    function boot() { collectInfo(); hook(); watch(); load(); setTimeout(loop, 4000); setTimeout(hook, 2500); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
