(function () {
    'use strict';
    try {
        var _st = document.createElement('style');
        _st.id = 'v105-css';
        _st.textContent = '.v105flash{outline:2px solid var(--gold,#c8a15b);border-radius:12px}.controls button.primary,button.primary{background:linear-gradient(135deg,var(--green),var(--green2))!important;color:#fff!important}.adkDone{color:var(--green,#0a7a4b);font-weight:700;padding:6px 10px;display:inline-block}#modeCustom .adkChip{display:inline-flex;align-items:center;gap:4px;cursor:pointer}#modeCustom .adkChip input{margin:0}';
        document.head.appendChild(_st);
    }
    catch (e) { }
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    window.APP_BUILD = '';
    window.__v105Errs = [];
    window.addEventListener('error', function (e) { try {
        window.__v105Errs.push((e.message || 'error') + ' @' + String(e.filename || '').split('/').pop() + ':' + (e.lineno || 0));
    }
    catch (x) { } if (window.__v105Errs.length > 12)
        window.__v105Errs.shift(); });
    window.addEventListener('unhandledrejection', function (e) { try {
        window.__v105Errs.push('promise: ' + String((e.reason && e.reason.message) || e.reason).slice(0, 120));
    }
    catch (x) { } if (window.__v105Errs.length > 12)
        window.__v105Errs.shift(); });
    window.v105Report = async function () {
        var L = [];
        L.push('الإصدار: ' + window.APP_BUILD);
        L.push('الوقت: ' + new Date().toISOString());
        L.push('المتصفح: ' + navigator.userAgent);
        L.push('نمط التطبيق (standalone): ' + ((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone ? 'نعم' : 'لا'));
        L.push('الشاشة: ' + innerWidth + 'x' + innerHeight + ' @' + (window.devicePixelRatio || 1) + ' | مقياس الخط: ' + ((localStorage.getItem('quran-m09-font-scale')) || '1'));
        L.push('متصل بالإنترنت: ' + (navigator.onLine ? 'نعم' : 'لا'));
        try {
            L.push('Service Worker: ' + ((navigator.serviceWorker && navigator.serviceWorker.controller) ? 'مفعّل' : 'غير مفعّل'));
        }
        catch (e) { }
        try {
            if (navigator.permissions) {
                var pm = await navigator.permissions.query({ name: 'geolocation' });
                L.push('إذن الموقع: ' + pm.state);
            }
        }
        catch (e) {
            L.push('إذن الموقع: غير معروف');
        }
        var P = window.__v105Pos;
        L.push('آخر موقع: ' + (P ? (P.lat.toFixed(4) + ',' + P.lon.toFixed(4) + ' دقة ' + Math.round(P.acc) + 'م') : '—') + ' | مصدر المساجد: ' + (window.__v105Src || '—') + ' | نصف القطر المبحوث: ' + (window.__v105Searched || '—'));
        L.push('أخطاء Overpass: ' + ((window.__v105OvpErrs || []).slice(-6).join(' ; ') || '—'));
        var D = $('v105Diag');
        L.push('آخر تشخيص صوت: ' + (D ? D.innerText.replace(/\s+/g, ' ') : '—'));
        L.push('أخطاء الصفحة: ' + (window.__v105Errs.join(' ; ') || '—'));
        var txt = L.join('\n');
        try {
            await navigator.clipboard.writeText(txt);
            alert('تم نسخ التقرير ✅ الصقه في المحادثة.');
        }
        catch (e) {
            var ta = document.createElement('textarea');
            ta.value = txt;
            ta.style.cssText = 'position:fixed;inset:10% 5%;width:90%;height:70%;z-index:99999;background:#fff;color:#000;font-size:calc(14px*var(--v105-fs,1));direction:ltr';
            document.body.appendChild(ta);
            ta.select();
            var c = document.createElement('button');
            c.textContent = 'إغلاق';
            c.style.cssText = 'position:fixed;bottom:8%;left:50%;transform:translateX(-50%);z-index:100000;padding:10px 24px';
            c.onclick = function () { ta.remove(); c.remove(); };
            document.body.appendChild(c);
        }
        return txt;
    };
    (function () {
        function mount() {
            var acc = $('stgAccent');
            var host = acc && acc.closest('.stgRow');
            if (!host || $('v105DiagRow'))
                return;
            var d = document.createElement('div');
            d.className = 'stgRow';
            d.id = 'v105DiagRow';
            d.style.flexWrap = 'wrap';
            d.innerHTML = '<div><b>🩺 الإصدار والتشخيص</b><small>' + window.APP_BUILD + '</small></div><div style="display:flex;gap:6px;flex-wrap:wrap;width:100%;margin-top:6px"><button type="button" class="stgBtn" id="v105RepBtn">📋 نسخ تقرير المشكلة</button><button type="button" class="stgBtn" id="v105ReloadBtn">🔄 تحديث التطبيق</button></div>';
            host.insertAdjacentElement('afterend', d);
            $('v105RepBtn').onclick = function () { window.v105Report(); };
            $('v105ReloadBtn').onclick = function () { window.v105Reload(); };
        }
        mount();
        document.addEventListener('click', function (e) { if (e.target && e.target.closest && e.target.closest('[onclick*="settings"]'))
            setTimeout(mount, 60); }, true);
    })();
    window.v105Reload = function () { if (window.MuslimUpdater) window.MuslimUpdater.force(); else location.reload(); };
    (function () {
        try {
            var st = document.createElement('style');
            st.id = 'v105-ios';
            st.textContent = 'html{-webkit-text-size-adjust:100%;text-size-adjust:100%}body{-webkit-tap-highlight-color:transparent}button,.tile,.back,.chip,[role=button]{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;touch-action:manipulation}input,textarea,select,[contenteditable]{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default}@supports (-webkit-touch-callout:none){input,select,textarea{font-size:16px!important}}.top{padding-top:env(safe-area-inset-top,0px)!important;height:calc(72px + env(safe-area-inset-top,0px))!important}@media(max-width:680px){.top{height:calc(64px + env(safe-area-inset-top,0px))!important}}.app{padding-left:max(0px,env(safe-area-inset-left));padding-right:max(0px,env(safe-area-inset-right))}';
            document.head.appendChild(st);
        }
        catch (e) { }
        var pend = false;
        function safeRel() { pend = false; try {
            document.querySelectorAll('a[target="_blank"]').forEach(function (a) { var r = (a.getAttribute('rel') || ''); if (!/noopener/.test(r))
                a.setAttribute('rel', (r + ' noopener noreferrer').trim()); });
        }
        catch (e) { } }
        safeRel();
        try {
            new MutationObserver(function () { if (pend)
                return; pend = true; setTimeout(safeRel, 400); }).observe(document.body, { childList: true, subtree: true });
        }
        catch (e) { }
        var _wo = window.open;
        window.open = function (u, t, f) {
            try {
                var abs = new URL(u, location.href);
                if (abs.origin !== location.origin && (!t || t === '_blank') && !/noopener/.test(f || '')) {
                    _wo.call(window, u, '_blank', ((f ? f + ',' : '') + 'noopener,noreferrer'));
                    return null;
                }
            }
            catch (e) { }
            return _wo.apply(window, arguments);
        };
    })();
    var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
    function unlockAudio(a) {
        if (!a || a.__v105u)
            return;
        a.__v105u = 1;
        try {
            if (!a.getAttribute('src')) {
                a.src = SILENT;
                var p = a.play();
                if (p && p.catch)
                    p.catch(function () { a.__v105u = 0; });
            }
        }
        catch (e) {
            a.__v105u = 0;
        }
    }
    var AR_META = {};
    function arItem(server) { var m = /archive\.org\/download\/([^\/]+)\/?(.*)$/.exec(String(server || '')); return m ? { id: m[1], prefix: m[2] || '' } : null; }
    function hostOf(u) { var m = /^https?:\/\/([^\/]+)/.exec(String(u)); return m ? m[1] : String(u).slice(0, 30); }
    function arMetaLS(id, v) {
        try {
            if (v === undefined) { var raw = localStorage.getItem('muslim-ar:' + id); return raw ? JSON.parse(raw) : null; }
            localStorage.setItem('muslim-ar:' + id, JSON.stringify(v));
        } catch (e) { } return null;
    }
    async function arMeta(id) {
        if (AR_META[id])
            return AR_META[id];
        var saved = arMetaLS(id);                                   // قائمة الملفات محفوظة من مرة سابقة → لا انتظار شبكة
        if (saved && saved.files && saved.files.length) { AR_META[id] = saved; return saved; }
        var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 15000);
        try {
            var r = await fetch('https://archive.org/metadata/' + encodeURIComponent(id), { signal: ctl.signal });
            if (!r.ok)
                throw new Error('meta ' + r.status);
            var j = await r.json();
            var files = (j.files || []).filter(function (f) { return /\.mp3$/i.test(f.name || ''); }).map(function (f) { return f.name; });
            var alts = [];
            try {
                (j.workable_servers || []).forEach(function (h) { if (h && alts.indexOf(h) < 0) alts.push(h); });
                ((j.alternate_locations && j.alternate_locations.servers) || []).forEach(function (o) { if (o && o.server && alts.indexOf(o.server) < 0) alts.push(o.server); });
            } catch (e) { }
            var meta = { files: files, d1: j.d1 || j.server || '', dir: j.dir || '', alts: alts.slice(0, 4) };
            if (files.length) {
                AR_META[id] = meta;
                arMetaLS(id, meta);
            }
            return meta;
        }
        finally {
            clearTimeout(tm);
        }
    }
    function arPick(files, num) {
        var T = files.map(function (f) { return { f: f, t: (f.split('/').pop().replace(/\.mp3$/i, '').match(/\d+/g) || []).map(Number) }; }).filter(function (x) { return x.t.length; });
        if (T.length < 2)
            return null;
        var maxLen = Math.max.apply(null, T.map(function (x) { return x.t.length; }));
        for (var k = 1; k <= maxLen; k++) {
            var part = T.filter(function (x) { return x.t.length >= k; });
            var vals = part.map(function (x) { return x.t[x.t.length - k]; });
            if (new Set(vals).size < 2)
                continue;
            var hit = part.filter(function (x) { return x.t[x.t.length - k] === num; });
            if (hit.length)
                return hit[0].f;
        }
        return null;
    }
    async function arCandidates(server, num, guess) {
        var it = arItem(server), meta = null;
        if (it) {
            try {
                meta = await Promise.race([arMeta(it.id), new Promise(function (r) { setTimeout(function () { r(null); }, 14000); })]);
            }
            catch (e) { }
        }
        var name = (meta && meta.files && meta.files.length) ? arPick(meta.files, num) : null;
        var enc = name ? name.split('/').map(encodeURIComponent).join('/') : null;
        var dl = enc ? ('https://archive.org/download/' + encodeURIComponent(it.id) + '/' + enc) : null;
        var direct = (enc && meta.d1 && meta.dir) ? ('https://' + meta.d1 + meta.dir + '/' + enc) : null;
        // عدة مضيفات لنفس الملف: بعض إصدارات iOS القديمة لا تتصل ببعض مضيفات archive.org فنجرّب غيرها
        var alts = (enc && meta && meta.dir && meta.alts) ? meta.alts.map(function (h) { return h && h !== meta.d1 ? 'https://' + h + meta.dir + '/' + enc : null; }) : [];
        var list = [dl, direct].concat(alts, [guess]);
        var uniq = [];
        list.forEach(function (u) { if (u && uniq.indexOf(u) < 0)
            uniq.push(u); });
        if (window.AUDIO_PROXY && IOS)
            uniq = uniq.map(function (u) { return window.AUDIO_PROXY + '?u=' + encodeURIComponent(u); }).concat(uniq);
        return uniq;
    }
    var _or = window.openReader;
    if (typeof _or === 'function') {
        window.openReader = async function () { var r = await _or.apply(this, arguments); try {
            var rc = (typeof currentReader !== 'undefined') ? currentReader : null;
            if (rc && rc.server && /archive\.org\/download\//.test(rc.server)) {
                var it = arItem(rc.server);
                if (it)
                    arMeta(it.id).catch(function () { });
            }
        }
        catch (e) { } return r; };
    }
    var _res = window.resolveAudioUrl;
    if (typeof _res === 'function') {
        window.resolveAudioUrl = async function (num) {
            var guess = await _res.apply(this, arguments);
            var rc = (typeof currentReader !== 'undefined') ? currentReader : null;
            if (rc && rc.server && /archive\.org\/download\//.test(rc.server)) {
                var c = await arCandidates(rc.server, num, guess);
                return c[0] || guess;
            }
            return guess;
        };
    }
    var _efr = window.ensureAudioUrlForReader;
    if (typeof _efr === 'function') {
        window.ensureAudioUrlForReader = async function (reader, num) {
            var u = await _efr.apply(this, arguments);
            if (reader && reader.server && /archive\.org\/download\//.test(reader.server)) {
                var c = await arCandidates(reader.server, num, u), r2 = c[0] || u;
                try {
                    reader._resolvedUrls = reader._resolvedUrls || {};
                    reader._resolvedUrls[num] = r2;
                }
                catch (e) { }
                return r2;
            }
            return u;
        };
    }
    function diagShow(lines) {
        var now = $('now');
        if (!now)
            return;
        var d = $('v105Diag');
        if (!d) {
            d = document.createElement('div');
            d.id = 'v105Diag';
            d.className = 'mini';
            d.style.cssText = 'margin-top:6px;direction:ltr;text-align:left;word-break:break-all;font-size:calc(11px*var(--v105-fs,1));opacity:.85';
            now.parentNode.insertBefore(d, now.nextSibling);
        }
        d.innerHTML = '<details><summary style="direction:rtl;cursor:pointer">تفاصيل (للدعم الفني)</summary>' + lines.map(esc).join('<br>') + '</details>';
    }
    function tryDirect(a, url) {
        return new Promise(function (res, rej) {
            var done = false, t;
            function cl() { a.removeEventListener('playing', ok); a.removeEventListener('error', er); clearTimeout(t); }
            function ok() { if (done)
                return; done = true; cl(); res(); }
            function bad(m) { if (done)
                return; done = true; cl(); rej(new Error(m)); }
            function er() { bad('خطأ وسائط ' + (a.error ? a.error.code : '?') + (a.error && a.error.message ? ' ' + a.error.message : '')); }
            a.addEventListener('playing', ok);
            a.addEventListener('error', er);
            t = setTimeout(function () { bad('انتهت المهلة'); }, 12000);
            a.src = url;
            var p = a.play();
            if (p && p.catch)
                p.catch(function (e) { if (e && e.name === 'NotAllowedError')
                    bad('NotAllowedError'); });
        });
    }
    async function blobPlay(a, url, nowEl, nm, rc) {
        var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 60000);
        try {
            var r = await fetch(url, { signal: ctl.signal });
            if (!r.ok)
                throw new Error('HTTP ' + r.status);
            var len = +r.headers.get('content-length') || 0;
            if (len > 70 * 1024 * 1024)                           // الأجهزة الأقدم (iOS 16 فما دون) تنهار ذاكرتها مع ملفات أكبر
                throw new Error('الملف كبير للتحميل الكامل');
            var chunks = [], got = 0;
            if (r.body && r.body.getReader) {
                var rd = r.body.getReader();
                for (;;) {
                    var x = await rd.read();
                    if (x.done)
                        break;
                    chunks.push(x.value);
                    got += x.value.length;
                    if (nowEl)
                        nowEl.textContent = '⏳ تحميل ' + nm + ' ' + (len ? Math.round(got / len * 100) + '%' : Math.round(got / 1048576) + ' م.ب');
                }
            }
            else
                chunks.push(new Uint8Array(await r.arrayBuffer()));
            if (got === 0 && !len && !chunks.length)
                throw new Error('ملف فارغ');
            var blob = new Blob(chunks, { type: 'audio/mpeg' });
            if (window._v105Blob) {
                try {
                    URL.revokeObjectURL(window._v105Blob);
                }
                catch (e) { }
            }
            window._v105Blob = URL.createObjectURL(blob);
            a.src = window._v105Blob;
            await a.play();
        }
        finally {
            clearTimeout(tm);
        }
    }
    var _ps2 = window.playSurah;
    if (typeof _ps2 === 'function') {
        window.playSurah = async function (num) {
            var a = (typeof audio !== 'undefined' && audio) || $('audio');
            if (IOS)
                unlockAudio(a);
            var rc = (typeof currentReader !== 'undefined') ? currentReader : null;
            var isAr = !!(rc && rc.server && /archive\.org\/download\//.test(rc.server));
            if (!(isAr && (IOS || window.__v105ForceBlob)))
                return _ps2.apply(this, arguments);
            try {
                var off = await getOfflineBlob(num);
                if (off)
                    return _ps2.apply(this, arguments);
            }
            catch (e) { }
            window.__v105Busy = 1;
            var nowEl = (typeof now !== 'undefined' && now) || $('now'), nm = (typeof S !== 'undefined' && S[num - 1]) || ('سورة ' + num);
            try {
                currentSurah = num;
            }
            catch (e) { }
            var diag = ['iOS: ' + ((navigator.userAgent.match(/OS [\d_]+/) || [''])[0])];
            try {
                if (nowEl)
                    nowEl.textContent = '⏳ جاري تجهيز ' + nm;
                var guess = null;
                try {
                    guess = await _res.call(window, num);
                }
                catch (e) {
                    diag.push('guess: ' + (e.message || e));
                }
                var cands = await arCandidates(rc.server, num, guess);
                if (!cands.length) {
                    diag.push('لا روابط');
                    throw new Error('no-urls');
                }
                var ok = false;
                // 1) بثّ مباشر أولاً (لا يحمّل الملف كله في الذاكرة → يعمل على iOS القديم)
                for (var j = 0; j < cands.length && !ok; j++) {
                    try {
                        if (nowEl)
                            nowEl.textContent = '⏳ جاري تجهيز ' + nm + '…';
                        await tryDirect(a, cands[j]);
                        ok = true;
                    }
                    catch (e) {
                        diag.push('تشغيل ' + hostOf(cands[j]) + ': ' + (e.message || e));
                    }
                }
                // 2) احتياط: تحميل كامل (بحدّ حجم) لأول رابطين فقط
                for (var i = 0; i < Math.min(2, cands.length) && !ok; i++) {
                    try {
                        await blobPlay(a, cands[i], nowEl, nm, rc);
                        ok = true;
                    }
                    catch (e) {
                        diag.push('تحميل ' + hostOf(cands[i]) + ': ' + (e && e.name === 'AbortError' ? 'انتهت المهلة' : (e.message || e)));
                    }
                }
                if (!ok)
                    throw new Error('failed');
                if (nowEl)
                    nowEl.textContent = '▶ ' + nm;
                var at = (typeof audioTitle !== 'undefined' && audioTitle) || $('audioTitle');
                if (at)
                    at.textContent = '🎙️ ' + ((rc && rc.name) || 'القارئ') + ' — ' + nm;
                try {
                    updateAudioUI();
                    syncGlobalMiniPlayer();
                }
                catch (e) { }
                try {
                    saveSettings();
                }
                catch (e) { }
                var d0 = $('v105Diag');
                if (d0)
                    d0.remove();
            }
            catch (e) {
                if (nowEl)
                    nowEl.textContent = '❌ تعذّر تشغيل ' + nm + ' الآن. قد يكون مصدر هذا القارئ بطيئاً أو محجوباً على شبكتك أو جهازك؛ جرّب شبكة أخرى أو قارئاً آخر.';
                diagShow(diag);
            }
            finally {
                window.__v105Busy = 0;
            }
        };
    }
    (function () {
        var a = $('audio');
        if (!a || a.__v105)
            return;
        a.__v105 = 1;
        var tried = {};
        a.addEventListener('error', async function () {
            try {
                if (window.__v105Busy || IOS)
                    return;
                var rc = (typeof currentReader !== 'undefined') ? currentReader : null;
                if (!rc || !rc.server || !/archive\.org\/download\//.test(rc.server))
                    return;
                var src = a.currentSrc || a.src;
                if (!src || /^blob:|^data:/.test(src) || tried[src])
                    return;
                tried[src] = 1;
                var now0 = $('now');
                if (now0)
                    now0.textContent = '⏳ إعادة المحاولة بطريقة بديلة…';
                await blobPlay(a, src, now0, '', rc);
            }
            catch (e) {
                var n = $('now');
                if (n)
                    n.textContent = '❌ تعذّر تشغيل هذا القارئ الآن (الخادم الخارجي archive.org لا يستجيب). جرّب لاحقًا.';
            }
        });
    })();
    var _show = window.show;
    if (typeof _show === 'function') {
        window.show = function (id) {
            if (id === 'hadith' || id === 'hadithDetail' || id === 'hadithCollection' || id === 'hadithBooks')
                id = 'hadith107';
            var args = [].slice.call(arguments);
            args[0] = id;
            return _show.apply(this, args);
        };
    }
    var TC_KEY = 'muslim-v105-textcolor', TC_EXTRA = '.notice,.downloadPanel,.timeBadge,#settings h3,#khatmah b,#daily b,#manasik .calIn,#manasik .calHeroIn{color:var(--v105-t)!important}';
    function tcGet() { try {
        var j = JSON.parse(localStorage.getItem(TC_KEY) || 'null');
        if (j && j.m)
            return j;
    }
    catch (e) { } return { m: 'auto', l: '#000000', d: '#ffffff' }; }
    function tcSet(o) { try {
        localStorage.setItem(TC_KEY, JSON.stringify(o));
    }
    catch (e) { } }
    function tcApply() {
        var o = tcGet(), L, D;
        if (o.m === 'black') {
            L = D = '#000000';
        }
        else if (o.m === 'white') {
            L = D = '#ffffff';
        }
        else if (o.m === 'custom') {
            L = o.l || '#000000';
            D = o.d || '#ffffff';
        }
        else {
            L = '#000000';
            D = '#ffffff';
        }
        var st = document.getElementById('v105-tc');
        if (!st) {
            st = document.createElement('style');
            st.id = 'v105-tc';
            document.head.appendChild(st);
        }
        st.textContent = 'body{--text:' + L + ';--muted:' + L + ';--v105-t:' + L + '}body.dark{--text:' + D + ';--muted:' + D + ';--v105-t:' + D + '}' + TC_EXTRA;
    }
    function tcUI() {
        var acc = $('stgAccent');
        if (!acc || $('v105TcRow'))
            return;
        var row = acc.closest('.stgRow');
        if (!row)
            return;
        var o = tcGet();
        var d = document.createElement('div');
        d.className = 'stgRow';
        d.id = 'v105TcRow';
        d.innerHTML = '<div><b>لون النص</b><small>تلقائي: أسود في الوضع النهاري وأبيض في الليلي، أو اختر لونك</small></div><div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><select id="v105TcMode" class="field stgSel"><option value="auto">تلقائي (أسود نهارًا / أبيض ليلًا)</option><option value="black">أسود دائمًا</option><option value="white">أبيض دائمًا</option><option value="custom">مخصّص…</option></select><span id="v105TcCustom" style="display:none">نهاري <input type="color" id="v105TcL"> ليلي <input type="color" id="v105TcD"></span></div>';
        row.insertAdjacentElement('afterend', d);
        var m = $('v105TcMode'), l = $('v105TcL'), dk = $('v105TcD'), c = $('v105TcCustom');
        m.value = o.m;
        l.value = o.l || '#000000';
        dk.value = o.d || '#ffffff';
        c.style.display = o.m === 'custom' ? '' : 'none';
        var sv = function () { var n = { m: m.value, l: l.value, d: dk.value }; c.style.display = n.m === 'custom' ? '' : 'none'; tcSet(n); tcApply(); };
        m.onchange = sv;
        l.oninput = sv;
        dk.oninput = sv;
    }
    tcApply();
    tcUI();
    document.addEventListener('click', function (e) { if (e.target && e.target.closest && e.target.closest('[onclick*="settings"]'))
        setTimeout(tcUI, 50); }, true);
    (function () {
        var URL_R = 'https://www.mp3quran.net/api/v3/reciters?language=ar', DAY = 864e5;
        window.getMp3QuranReciters = function () {
            if (window.__v105RecP)
                return window.__v105RecP;
            window.__v105RecP = (async function () {
                var c = null, cached = null;
                try {
                    c = await caches.open('muslim-data-v1');
                    cached = await c.match(URL_R);
                }
                catch (e) { }
                var age = cached ? (Date.now() - (+cached.headers.get('x-saved') || 0)) : 1e15;
                var fresh = async function () {
                    var r = await fetch(URL_R);
                    if (!r.ok)
                        throw new Error('reciters ' + r.status);
                    var txt = await r.text(), j = JSON.parse(txt);
                    if (c && j && Array.isArray(j.reciters) && j.reciters.length) {
                        try {
                            await c.put(URL_R, new Response(txt, { status: 200, headers: { 'content-type': 'application/json', 'x-saved': String(Date.now()) } }));
                        }
                        catch (e) { }
                    }
                    return j.reciters || [];
                };
                if (cached && age < 7 * DAY) {
                    if (age > DAY)
                        setTimeout(function () { fresh().catch(function () { }); }, 2000 + Math.random() * 20000);
                    try {
                        return (await cached.json()).reciters || [];
                    }
                    catch (e) { }
                }
                try {
                    return await fresh();
                }
                catch (e) {
                    if (cached) {
                        try {
                            return (await cached.json()).reciters || [];
                        }
                        catch (e2) { }
                    }
                    window.__v105RecP = null;
                    throw e;
                }
            })();
            return window.__v105RecP;
        };
        function wrapSB(c) {
            if (!c || c.__v105)
                return c;
            c.__v105 = 1;
            try {
                var ag = c.auth.getUser.bind(c.auth);
                c.auth.getUser = async function () { try {
                    var r = await c.auth.getSession();
                    return { data: { user: (r && r.data && r.data.session) ? r.data.session.user : null }, error: null };
                }
                catch (e) {
                    return ag();
                } };
            }
            catch (e) { }
            var of = c.from.bind(c), last = '', pend = null, timer = null, lastSent = 0;
            function flush() { timer = null; if (!pend)
                return; var x = pend; pend = null; lastSent = Date.now(); last = x.js; try {
                of('user_settings').upsert(x.p, x.o).then(function () { }, function () { });
            }
            catch (e) { } }
            function sched() { if (timer)
                return; var wait = Math.max(0, 120000 - (Date.now() - lastSent)) + Math.random() * 30000; timer = setTimeout(flush, wait); }
            c.from = function (t) {
                var q = of(t);
                if (t === 'user_settings' && q && q.upsert) {
                    q.upsert = function (p, o) {
                        var js;
                        try {
                            js = JSON.stringify(p, function (k, v) { return k === 'updated_at' ? undefined : v; });
                        }
                        catch (e) {
                            js = String(Math.random());
                        }
                        if (js === last || (pend && pend.js === js))
                            return Promise.resolve({ data: null, error: null });
                        pend = { p: p, o: o, js: js };
                        sched();
                        return Promise.resolve({ data: null, error: null });
                    };
                }
                return q;
            };
            document.addEventListener('visibilitychange', function () { if (document.hidden && pend && Date.now() - lastSent > 20000) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                flush();
            } });
            return c;
        }
        try {
            if (typeof supabaseClient !== 'undefined' && supabaseClient)
                wrapSB(supabaseClient);
        }
        catch (e) { }
        try {
            if (window.supabase && typeof window.supabase.createClient === 'function' && !window.supabase.__v105) {
                var cc = window.supabase.createClient;
                window.supabase.createClient = function () { return wrapSB(cc.apply(this, arguments)); };
                window.supabase.__v105 = 1;
            }
        }
        catch (e) { }
    })();
    var AD = '٠١٢٣٤٥٦٧٨٩';
    function norm(s) {
        return String(s || '').replace(/[٠-٩]/g, function (d) { return AD.indexOf(d); })
            .replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim();
    }
    function nameNorm(s) { return norm(String(s || '').replace('⭐', '')).replace(/عبد ?ال?(?=\S)/g, 'عبد'); }
    function bare(w) { return w.replace(/^(وال|بال|لل|ال)(?=.{3,})/, ''); }
    function lev(a, b) {
        if (a === b)
            return 0;
        if (Math.abs(a.length - b.length) > 2)
            return 9;
        var m = [], i, j;
        for (i = 0; i <= a.length; i++)
            m[i] = [i];
        for (j = 1; j <= b.length; j++)
            m[0][j] = j;
        for (i = 1; i <= a.length; i++)
            for (j = 1; j <= b.length; j++)
                m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        return m[a.length][b.length];
    }
    function tokEq(a, b) { return a === b || (a.length >= 5 && b.length >= 5 && lev(a, b) <= 1); }
    var STOPRAW = 'هل لديكم عندكم يوجد توجد موجود موجوده اريد ابحث عن ابي ابغي ابغا ابغى اين اجد الشيخ شيخ القارئ قارئ قاري الى في ممكن لو سمحت التطبيق الموقع هذا هذه لكم ما هو هي سوره سورة بصوت صوت اسمع استمع اسمعني شغل كرر تكرار اعيد اكرر مره مرات مرة من اية ايه الايه الايات ايات حتى كم لي انا ان احمل حمل تحميل تنزيل كيف وين فين اعرف اعطني افتح لدي قسم بدون انترنت نت ثم مع على عند بعد قبل كل حفظ احفظ تلاوه تلاوة قراءه قراءة لما عايز ابغى اود احتاج ارجو فضلك بارك الله فيك لو سمحت يا';
    var STOP = new Set(STOPRAW.split(' ').map(function (w) { return bare(norm(w)); }));
    var STOP2 = new Set(STOP);
    var SEC = [
        ['readers', 'القراء والتلاوات', 'قارئ قراء تلاوه تلاوات استماع سماع مقرئ شيخ'],
        ['repeatAyah', 'تكرار الآية', 'تكرار كرر اكرر حفظ احفظ ترديد'],
        ['adhkar', 'الأذكار والأدعية', 'ذكر اذكار دعاء ادعيه صباح مساء نوم استيقاظ'],
        ['ruqyah', 'الرقية الشرعية', 'رقيه رقي'],
        ['khatmah', 'الختمة', 'ختمه ختم ورد'],
        ['qibla', 'القبلة', 'قبله كعبه اتجاه'],
        ['mosques', 'المساجد القريبة', 'مسجد مساجد مصلي مصليات جامع قريب'],
        ['children', 'عالم الأطفال', 'طفل اطفال صغار قصص مسابقات'],
        ['manasik', 'المناسك والتقويم', 'مناسك حج عمره تقويم هجري مناسبه'],
        ['daily', 'أعمال اليوم', 'اعمال طاعات'],
        ['modes', 'الأوضاع', 'اوضاع وضع نوم'],
        ['settings', 'الإعدادات', 'اعدادات ضبط حساب نسخ سحابه تسجيل'],
        ['downloads', 'تنزيلاتي', 'تنزيلات تحميلات محمل']
    ];
    SEC.forEach(function (s) { s[2].split(' ').forEach(function (w) { STOP.add(bare(w)); }); });
    var INIT = {
        adhkar: function () { window.initAdhkarV27 && window.initAdhkarV27(); }, mosques: function () { window.initNearbyMosques && window.initNearbyMosques(); },
        repeatAyah: function () { window.initRepeatAyah && window.initRepeatAyah(); }, khatmah: function () { window.renderKhatmah && window.renderKhatmah(); },
        ruqyah: function () { window.renderRuqyah && window.renderRuqyah(); }, hadith: function () { window.loadHadith && window.loadHadith(); },
        children: function () { window.initChildren && window.initChildren(); }, modes: function () { window.initModes && window.initModes(); },
        manasik: function () { window.initManasik && window.initManasik(); }, daily: function () { window.renderDaily && window.renderDaily(); }
    };
    var PRE = [
        [/ايه الكرسي/, 2, 255, 255, 'آية الكرسي'], [/خواتيم (سوره )?(ال)?بقره/, 2, 285, 286, 'خواتيم البقرة'],
        [/اول (سوره )?(ال)?كهف/, 18, 1, 10, 'أول سورة الكهف'], [/اخر (سوره )?(ال)?كهف/, 18, 101, 110, 'آخر سورة الكهف']
    ];
    var COUNTW = { 'مرتين': 2, 'ثلاث': 3, 'اربع': 4, 'خمس': 5, 'ست': 6, 'سبع': 7, 'ثمان': 8, 'ثماني': 8, 'ثمانيه': 8, 'تسع': 9, 'عشر': 10, 'عشرين': 20, 'ثلاثين': 30, 'خمسين': 50, 'ميه': 100, 'مايه': 100, 'مئه': 100 };
    function surahNames() { return (typeof S !== 'undefined' && S) || []; }
    function recList() { return (typeof RECITERS !== 'undefined' && RECITERS) || []; }
    function findSurah(n) {
        var names = surahNames(), q = ' ' + n + ' ', best = null;
        names.forEach(function (nm, i) {
            var a = norm(nm), b = a.replace(/^ال/, '');
            if (b.length < 3) {
                if (q.indexOf(' سوره ' + b + ' ') >= 0 && (!best || b.length + 6 > best.len))
                    best = { num: i + 1, len: b.length + 6 };
                return;
            }
            [a, b, 'ال' + b].some(function (v) {
                if (q.indexOf(' ' + v + ' ') >= 0) {
                    if (!best || v.length > best.len)
                        best = { num: i + 1, len: v.length };
                    return true;
                }
                return false;
            });
        });
        return best;
    }
    function findCount(n) {
        var m = n.match(/(\d{1,4}) (?:مره|مرات)/);
        if (m)
            return { c: +m[1], rest: n.replace(m[0], ' ') };
        if (/(^| )مرتين( |$)/.test(n))
            return { c: 2, rest: n.replace('مرتين', ' ') };
        m = n.match(/(?:^| )(ثلاثين|ثلاث|اربع|خمسين|خمس|ست|سبع|ثمانيه|ثماني|ثمان|تسع|عشرين|عشر|مايه|ميه|مئه) (?:مره|مرات)/);
        if (m)
            return { c: COUNTW[m[1]], rest: n.replace(m[0], ' ') };
        return { c: null, rest: n };
    }
    function findRange(n) {
        var m = n.match(/(\d{1,3}) ?(?:الي|حتي|-) ?(?:ايه )?(\d{1,3})/);
        if (m)
            return { f: +m[1], t: +m[2] };
        m = n.match(/(?:ايه|الايه|ايات|الايات) (\d{1,3})/);
        if (m)
            return { f: +m[1], t: +m[1] };
        return null;
    }
    var df = null;
    function buildDf() {
        df = {};
        var seen = {};
        recList().forEach(function (r) { var k = nameNorm(r.name); if (seen[k])
            return; seen[k] = 1; new Set(k.split(' ').map(bare).filter(Boolean)).forEach(function (t) { df[t] = (df[t] || 0) + 1; }); });
    }
    function findReciters(n) {
        var list = recList();
        if (!list.length)
            return [];
        if (!df)
            buildDf();
        var toks = nameNorm(n).split(' ').map(bare).filter(function (w) { return w.length >= 3 && !STOP.has(w); });
        if (!toks.length)
            return [];
        var byName = {};
        list.forEach(function (r, i) {
            var k = nameNorm(r.name), nt = k.split(' ').map(bare).filter(Boolean), s = 0;
            toks.forEach(function (w) { if (nt.some(function (x) { return tokEq(x, w); }))
                s += 1 / Math.max(1, (df[w] || df[nt.find(function (x) { return tokEq(x, w); })] || 1)); });
            if (s > 0) {
                (byName[k] = byName[k] || []).push({ r: r, i: i, s: s });
            }
        });
        var all = [];
        Object.keys(byName).forEach(function (k) { byName[k].forEach(function (x) { all.push(x); }); });
        if (!all.length)
            return [];
        var top = all.reduce(function (m, x) { return Math.max(m, x.s); }, 0);
        if (top < 0.3)
            return [];
        return all.filter(function (x) { return x.s >= top - 1e-9; }).slice(0, 8);
    }
    function scoreSections(n) {
        var toks = n.split(' ').map(bare).filter(Boolean);
        return SEC.map(function (s) {
            var kws = s[2].split(' '), sc = 0;
            toks.forEach(function (w) { if (kws.some(function (k) { return tokEq(k, w) || tokEq(k, bare(w)); }))
                sc++; });
            return { id: s[0], name: s[1], sc: sc };
        }).filter(function (x) { return x.sc > 0; }).sort(function (a, b) { return b.sc - a.sc; });
    }
    function understand(q) {
        var n0 = norm(q), u = { q: q, n: n0, surah: null, range: null, count: null, preset: null, reciters: [], sections: [], intent: {} };
        var em = n0.match(/كل ايه (\d{1,2}) (?:مره|مرات)/), em2 = n0.match(/كل ايه مرتين/), n1 = n0;
        u.each = null;
        if (em) {
            u.each = +em[1];
            n1 = n0.replace(em[0], ' ');
        }
        else if (em2) {
            u.each = 2;
            n1 = n0.replace(em2[0], ' ');
        }
        var cnt = findCount(n1);
        u.count = cnt.c;
        var n = cnt.rest;
        u.intent.repeat = /(^| )(كرر|اكرر|تكرار|اعيد|اردد|ترديد)/.test(n) || /(^| )(احفظ|حفظ)( |$)/.test(n);
        u.intent.listen = /(اسمع|استمع|سماع|شغل|تلاوه|اسمعني)/.test(n);
        u.intent.download = /(حمل|تحميل|تنزيل|نزل|اوفلاين|بدون (انترنت|نت))/.test(n);
        u.intent.ask = /(^| )(هل|اين|وين|فين|كيف)( |$)/.test(n);
        PRE.forEach(function (p) { if (!u.preset && p[0].test(n))
            u.preset = { s: p[1], f: p[2], t: p[3], label: p[4] }; });
        var sc = scoreSections(n);
        var cue = /(سوره|ايه|ايات|كرر|اكرر|تكرار|اسمع|استمع|تلاوه|شغل|حفظ|احفظ)/.test(n);
        var sf = findSurah(n);
        if (sf && (cue || !sc.some(function (x) { return x.id !== 'readers' && x.id !== 'repeatAyah'; })))
            u.surah = sf.num;
        if (u.preset)
            u.surah = u.preset.s;
        u.range = u.preset ? { f: u.preset.f, t: u.preset.t } : findRange(n);
        var rr = findReciters(n);
        if (rr.length && u.surah && !u.preset && !/(سوره|اسمع|استمع|شغل|كرر|اكرر|تكرار|بصوت|ايه|ايات)/.test(n)) {
            var sn = bare(norm(surahNames()[u.surah - 1] || '')), rn = nameNorm(rr[0].r.name).split(' ').map(bare);
            if (rn.indexOf(sn) >= 0) {
                u.surah = null;
                u.range = null;
            }
        }
        u.reciters = rr;
        u.sections = sc;
        return u;
    }
    function recGroups(rs) { var g = {}, order = []; rs.forEach(function (h) { var k = nameNorm(h.r.name); if (!g[k]) {
        g[k] = { name: String(h.r.name).replace('⭐ ', ''), items: [] };
        order.push(k);
    } g[k].items.push(h.r); }); return order.map(function (k) { return g[k]; }); }
    function reciterProfile(rs, surah, yes) {
        var gs = recGroups(rs), g = gs[0], rw = [];
        g.items.forEach(function (r) { var w = String(r.rewaya || '').trim(); if (w && rw.indexOf(w) < 0)
            rw.push(w); });
        var n = g.items.length;
        var h = (yes ? '✅ نعم، ' : '') + '🎙️ <b>' + esc(g.name) + '</b> قارئ' + (rw.length ? ' يقرأ ' + (rw.length > 1 ? 'بعدة روايات: ' : 'برواية ') + '<b>' + rw.map(esc).join('، ') + '</b>' : '') + '. ولدينا له ' + (n > 1 ? '<b>مجموعة تلاوات (' + n + ' تسجيلات)</b>' : '<b>تلاوة</b>') + ' في قسم القرّاء' + (surah ? '، وسأفتح لك <b>' + esc(surahLabel(surah)) + '</b> بصوته:' : ' — اختر ما تريد:');
        var bs = g.items.slice(0, 6).map(function (r) {
            var cnt = (r.surahList && r.surahList.length) ? ' (' + r.surahList.length + ' سورة)' : '';
            return btn((surah ? '▶ ' : '🎧 ') + (String(r.rewaya || 'التلاوة')) + cnt, { t: 'reciter', id: r.id, nm: String(r.name).replace('⭐ ', ''), s: surah || 0 });
        }).join('');
        var more = '';
        if (gs.length > 1)
            more = '<div class="mini">قرّاء آخرون بأسماء قريبة:</div><div>' + gs.slice(1, 5).map(function (x) { return btn('🎧 ' + x.name, { t: 'reciter', id: x.items[0].id, nm: x.name, s: 0 }); }).join('') + '</div>';
        return h + '<div>' + bs + '</div>' + more;
    }
    function surahInfo(num) {
        var ay = (window.V100_REC && window.V100_REC.AY && window.V100_REC.AY[num - 1]) || null;
        return '📖 <b>' + esc(surahLabel(num)) + '</b> — رقمها <b>' + num + '</b> في المصحف' + (ay ? ' وعدد آياتها <b>' + ay + '</b>' : '') + '. يمكنك الاستماع إليها بأصوات قرّاء كثيرين أو تكرار آياتها للحفظ:<div>' + btn('🎧 افتح القرّاء', { t: 'section', id: 'readers' }) + btn('🔁 كرّر آياتها', { t: 'repeat', s: num, f: 1, to: 0, c: 0, e: 0, nm: '', go: 0 }) + '</div>';
    }
    var WHO = /^(من هو|من هي|من يكون|من هذا|عرفني ب|عرفني علي|نبذه عن|معلومات عن|ماذا تعرف عن|هل تعرف|وش تعرف عن|ما هي|ما هو|ماذا تعني|ما معني|ما هيا) (.+)$/;
    function whoIs(n) {
        var m = WHO.exec(n);
        if (!m)
            return null;
        var sub = m[2].replace(/^(القارئ|قارئ|الشيخ|شيخ|الاستاذ|الدكتور|الامام|الحاج|السيد|سوره) /, '').trim();
        if (sub.length < 3)
            return null;
        var rr = findReciters(sub);
        if (rr.length)
            return reciterProfile(rr, 0, false);
        var sf = findSurah(' ' + sub + ' ');
        if (sf && /(سوره|ما هي|ما هو)/.test(n))
            return surahInfo(sf.num);
        return null;
    }
    function externalReply(sub) {
        return 'عذرًا، لم أجد «' + esc(String(sub).slice(0, 60)) + '» داخل التطبيق — هو خارج محتواه (قرّاء، تلاوات، أذكار، رقية…) ولا أريد أن أخمّن معلومة عنه. هذا مصدر قد تجد فيه الجواب:<div>' + urlBtn('ويكيبيديا', "https://ar.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(sub)) + urlBtn('بحث Google', 'https://www.google.com/search?q=' + encodeURIComponent(sub)) + '</div>';
    }
    function appIndex() {
        var idx = [];
        document.querySelectorAll('#home .tile').forEach(function (t) { var b = t.querySelector('b'), sm = t.querySelector('small'); if (b)
            idx.push({ title: b.textContent.trim(), text: sm ? sm.textContent : '', kw: '', act: { t: 'tile', k: b.textContent.trim() } }); });
        document.querySelectorAll('#settings .stgRow').forEach(function (r) { var b = r.querySelector('b'), sm = r.querySelector('small'); if (b)
            idx.push({ title: b.textContent.trim(), text: sm ? sm.textContent : '', kw: 'اعدادات', act: { t: 'setting', k: b.textContent.trim() }, ico: '⚙️ ' }); });
        var extra = [['الأوضاع', 'نوم صباح مساء سفر جمعة بقره استغفار تحصين منزل مسجد رقيه تشغيل متتالي مؤقت', 'modes'], ['تكرار الآية', 'حفظ ترديد كرر تكرار اية سوره', 'repeatAyah'], ['الأذكار والأدعية', 'اذكار دعاء صباح مساء نوم استيقاظ بعد الصلاه سفر استغفار', 'adhkar'], ['الرقية الشرعية', 'رقيه رقي علاج عين حسد', 'ruqyah'], ['التنزيلات', 'تنزيلاتي تحميلات محمله بدون انترنت اوفلاين', 'downloads'], ['الختمة', 'ختمه ورد يومي قراءه', 'khatmah']];
        extra.forEach(function (x) { idx.push({ title: x[0], text: '', kw: x[1], act: { t: 'section', id: x[2] } }); });
        return idx;
    }
    function appSearch(n) {
        var toks = n.split(' ').map(bare).filter(function (w) { return w.length >= 3 && !STOP2.has(w); });
        if (!toks.length)
            return null;
        var res = appIndex().map(function (e) {
            var tt = nameNorm(e.title).split(' ').map(bare), bt = nameNorm(e.text + ' ' + e.kw).split(' ').map(bare), sc = 0;
            toks.forEach(function (w) { if (tt.some(function (x) { return tokEq(x, w); }))
                sc += 2;
            else if (bt.some(function (x) { return tokEq(x, w); }))
                sc += 1; });
            return { e: e, sc: sc };
        }).filter(function (x) { return x.sc >= 2; }).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 3);
        if (!res.length)
            return null;
        return 'وجدت هذا في التطبيق قد يكون ما تقصده:<div>' + res.map(function (x) { return btn((x.e.ico || '') + x.e.title, x.e.act); }).join('') + '</div>';
    }
    var surahLabel = function (num) { return 'سورة ' + (surahNames()[num - 1] || num); };
    function btn(label, act) { return '<button type="button" class="v103Go" data-v105="' + esc(JSON.stringify(act)) + '">' + esc(label) + '</button>'; }
    function recButtons(rs, surah, play) {
        var seen = {}, out = [];
        rs.forEach(function (h) {
            var id = h.r.id || ('i' + h.i);
            if (seen[id])
                return;
            seen[id] = 1;
            var nm = String(h.r.name).replace('⭐ ', '') + (h.r.rewaya ? ' — ' + h.r.rewaya : '');
            out.push(btn((play && surah ? '▶ ' : '🎧 ') + nm, { t: 'reciter', id: h.r.id, nm: String(h.r.name).replace('⭐ ', ''), s: play ? surah : 0 }));
        });
        return '<div>' + out.slice(0, 6).join('') + '</div>';
    }
    function reply(u) {
        var parts = [], hasRec = u.reciters.length > 0;
        var recName = hasRec ? String(u.reciters[0].r.name).replace('⭐ ', '') : '';
        var secScore = u.sections[0] ? u.sections[0].sc : 0;
        if (hasRec && u.sections.length && secScore >= 1 && !u.surah && !u.intent.listen && !u.intent.repeat && u.reciters[0].s < 0.5)
            hasRec = false;
        if (u.surah && (u.intent.repeat || u.preset || u.range) && u.intent.repeat !== false && (u.intent.repeat || u.range || u.preset)) {
            var tgt = u.preset ? u.preset.label : surahLabel(u.surah) + (u.range ? (u.range.f === u.range.t ? ' الآية ' + u.range.f : ' الآيات ' + u.range.f + ' إلى ' + u.range.t) : '');
            var cc = 'سأكررها بلا توقف حتى تضغط «إيقاف»' + (u.count ? ' (التكرار في التطبيق مفتوح دائمًا، فلن يتوقف عند ' + u.count + ' مرة)' : '') + (u.each ? '، وكل آية ' + u.each + ' مرات قبل الانتقال للتي بعدها' : '');
            var say = 'فهمت أنك تريد <b>تكرار ' + esc(tgt) + '</b>' + (hasRec ? ' بصوت <b>' + esc(recName) + '</b>' : '') + ' — ' + cc + '.';
            var act = { t: 'repeat', s: u.surah, f: u.range ? u.range.f : 1, to: u.range ? u.range.t : 0, c: 0, e: u.each || 0, nm: hasRec ? recName : '', go: 1 };
            parts.push(say + '<div>' + btn('▶ ابدأ التكرار الآن', act) + btn('⚙️ عدّل الإعدادات أولًا', Object.assign({}, act, { go: 0 })) + '</div>'
                + (hasRec ? '<div class="mini">إن لم يكن القارئ ضمن قرّاء «تكرار الآية» سأستخدم القارئ المحدد حاليًا وأخبرك.</div>' : ''));
            return parts.join('<hr class="v103hr">');
        }
        if (hasRec) {
            var rs = u.reciters, names = [];
            var seenN = {};
            rs.forEach(function (h) { var k = nameNorm(h.r.name); if (!seenN[k]) {
                seenN[k] = 1;
                names.push(h);
            } });
            parts.push(reciterProfile(rs, u.surah, u.intent.ask));
            if (u.surah)
                parts.push('<div class="mini">' + btn('🔁 كرّر آيات ' + surahLabel(u.surah), { t: 'repeat', s: u.surah, f: 1, to: 0, c: 0, nm: recName, go: 0 }) + '</div>');
        }
        else if (u.surah) {
            parts.push('🎧 <b>' + esc(surahLabel(u.surah)) + '</b> موجودة بأصوات قرّاء كثيرين:<div>' + btn('🎧 افتح القرّاء', { t: 'section', id: 'readers' }) + btn('🔁 كرّر آياتها', { t: 'repeat', s: u.surah, f: 1, to: 0, c: u.count || 0, nm: '', go: 0 }) + '</div>');
        }
        if (!hasRec && !u.surah && u.sections.length) {
            var top = u.sections.slice(0, 2);
            parts.push('ستجد ذلك في ' + (top.length > 1 ? 'هذه الأقسام' : 'قسم') + ':<div>' + top.map(function (s) { return btn('افتح «' + s.name + '»', { t: 'section', id: s.id }); }).join('') + '</div>');
        }
        else if (u.sections.length && (hasRec || u.surah) && u.sections[0].id !== 'readers' && u.sections[0].id !== 'repeatAyah') {
            parts.push('<div class="mini">وإن كنت تقصد قسمًا آخر:</div><div>' + btn('افتح «' + u.sections[0].name + '»', { t: 'section', id: u.sections[0].id }) + '</div>');
        }
        if (u.intent.download && (hasRec || u.surah))
            parts.push('<div class="mini">للتحميل وسماعه بلا إنترنت: افتح القارئ واختر السورة، وتجد كل ما حمّلته في «تنزيلاتي».</div><div>' + btn('📥 تنزيلاتي', { t: 'section', id: 'downloads' }) + '</div>');
        return parts.length ? parts.join('<hr class="v103hr">') : null;
    }
    function recIndex(a) {
        var L = recList();
        var i = -1;
        if (a.id)
            i = L.findIndex(function (r) { return r.id === a.id; });
        if (i < 0 && a.nm) {
            var k = nameNorm(a.nm);
            i = L.findIndex(function (r) { return nameNorm(r.name) === k; });
        }
        return i;
    }
    var URL_OK = /^https:\/\/([a-z0-9-]+\.)*(quran\.ksu\.edu\.sa|quran\.com|qurancomplex\.gov\.sa|dorar\.net|sunnah\.com|islamweb\.net|binbaz\.org\.sa|aladhan\.com|islamicfinder\.org|tarteel\.ai|islamstory\.com|wikipedia\.org|google\.com)(\/|$)/;
    async function runAct(a) {
        if (a.t === 'fn') {
            if (a.f === 'report')
                window.v105Report();
            else if (a.f === 'reload')
                window.v105Reload();
            return;
        }
        if (a.t === 'tile') {
            var ts = [].slice.call(document.querySelectorAll('#home .tile')).filter(function (t) { var b = t.querySelector('b'); return b && b.textContent.trim() === a.k; })[0];
            if (ts)
                ts.click();
            return;
        }
        if (a.t === 'setting') {
            if (typeof show === 'function')
                show('settings');
            setTimeout(function () { var rw = [].slice.call(document.querySelectorAll('#settings .stgRow')).filter(function (r) { var b = r.querySelector('b'); return b && b.textContent.trim() === a.k; })[0]; if (rw) {
                rw.scrollIntoView({ behavior: 'smooth', block: 'center' });
                rw.classList.add('v105flash');
                setTimeout(function () { rw.classList.remove('v105flash'); }, 2500);
            } }, 200);
            return;
        }
        if (a.t === 'url') {
            if (URL_OK.test(String(a.u || '')))
                window.open(a.u, '_blank', 'noopener');
            return;
        }
        if (a.t === 'section') {
            if (typeof show === 'function')
                show(a.id);
            try {
                INIT[a.id] && INIT[a.id]();
            }
            catch (e) {
                console.warn(e);
            }
            return;
        }
        if (a.t === 'reciter') {
            var i = recIndex(a);
            if (i < 0) {
                show('readers');
                return;
            }
            await window.openReader(i);
            if (a.s && typeof window.playSurah === 'function')
                window.playSurah(a.s);
            return;
        }
        if (a.t === 'repeat') {
            show('repeatAyah');
            try {
                window.initRepeatAyah();
            }
            catch (e) { }
            var s = $('repeatSurah');
            if (s)
                s.value = String(a.s);
            try {
                window.updateRepeatTo();
            }
            catch (e) { }
            var f = $('repeatFrom'), t = $('repeatTo');
            if (f && t) {
                var max = +t.max || 286, from = Math.max(1, Math.min(a.f || 1, max)), to = a.to ? Math.min(a.to, max) : max;
                if (to - from + 1 > 60)
                    to = from + 59;
                f.value = String(from);
                t.value = String(Math.max(from, to));
                try {
                    window.updateRepeatTo();
                }
                catch (e) { }
            }
            if (a.e) {
                var ee = $('repeatEach');
                if (ee) {
                    var bv = null;
                    Array.prototype.forEach.call(ee.options, function (o) { if (+o.value <= a.e)
                        bv = o.value; });
                    if (bv)
                        ee.value = bv;
                }
            }
            var note = '';
            if (a.nm) {
                var rs = $('repeatReciter');
                if (rs) {
                    var want = nameNorm(a.nm), opts = Array.prototype.slice.call(rs.options);
                    var o = opts.find(function (x) { return nameNorm(x.textContent) === want; }) || opts.find(function (x) { var t2 = nameNorm(x.textContent); return want.split(' ').some(function (w) { return w.length > 3 && t2.indexOf(w) >= 0; }); });
                    if (o)
                        rs.value = o.value;
                    else
                        note = 'القارئ «' + a.nm + '» غير متاح في تكرار الآية؛ سأستخدم «' + (rs.options[rs.selectedIndex] || {}).textContent + '». ';
                }
            }
            var stt = $('repeatAyahStatus');
            if (stt && note)
                stt.textContent = note;
            if (a.go && typeof window.startAyahRepeat === 'function') {
                await window.startAyahRepeat();
                if (stt && note && !/🔁/.test(stt.textContent))
                    stt.textContent = note + stt.textContent;
            }
        }
    }
    document.addEventListener('click', function (e) {
        var b = e.target && e.target.closest && e.target.closest('[data-v105]');
        if (!b)
            return;
        var a;
        try {
            a = JSON.parse(b.getAttribute('data-v105'));
        }
        catch (x) {
            return;
        }
        runAct(a).catch(function (err) { console.error('v105 action', err); });
    });
    async function askLLM(q) {
        var sb = null;
        try {
            sb = (typeof supabaseClient !== 'undefined') ? supabaseClient : null;
        }
        catch (e) { }
        if (!sb || !sb.functions || !sb.functions.invoke)
            return null;
        var names = [], seen = {};
        recList().forEach(function (r) { var k = nameNorm(r.name); if (!seen[k]) {
            seen[k] = 1;
            names.push(String(r.name).replace('⭐ ', ''));
        } });
        try {
            var res = await Promise.race([sb.functions.invoke('muslim-assistant', { body: { question: q, sections: SEC.map(function (s) { return { id: s[0], name: s[1] }; }), reciters: names.slice(0, 160) } }), new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, 9000); })]);
            if (!res || res.error || !res.data || typeof res.data.answer !== 'string')
                return null;
            return res.data;
        }
        catch (e) {
            return null;
        }
    }
    function renderLLM(d) {
        var h = '<div>' + esc(d.answer).replace(/\n/g, '<br>') + '</div>', bs = [];
        (d.actions || []).slice(0, 4).forEach(function (a) {
            if (!a || typeof a !== 'object')
                return;
            var label = String(a.label || '').slice(0, 40);
            if (a.type === 'section' && SEC.some(function (s) { return s[0] === a.id; }))
                bs.push(btn(label || 'افتح', { t: 'section', id: a.id }));
            else if (a.type === 'reciter' && a.name) {
                var rr = findReciters(String(a.name));
                if (rr.length) {
                    bs.push(btn(label || ('🎧 ' + a.name), { t: 'reciter', id: rr[0].r.id, nm: String(rr[0].r.name).replace('⭐ ', ''), s: Math.max(0, Math.min(114, +a.surah || 0)) }));
                }
            }
            else if (a.type === 'url' && URL_OK.test(String(a.url || '')))
                bs.push(btn(label || '🔗 فتح المصدر', { t: 'url', u: a.url }));
            else if (a.type === 'repeat') {
                var s = +a.surah;
                if (s >= 1 && s <= 114)
                    bs.push(btn(label || '🔁 تكرار', { t: 'repeat', s: s, f: Math.max(1, +a.from || 1), to: Math.max(0, +a.to || 0), c: Math.max(0, Math.min(1000, +a.count || 0)), nm: a.reciter ? String(a.reciter) : '', go: 0 }));
            }
        });
        return h + (bs.length ? '<div>' + bs.join('') + '</div>' : '');
    }
    function urlBtn(label, u) { return btn('🔗 ' + label, { t: 'url', u: u }); }
    function secBtns(ids) { return '<div>' + ids.map(function (id) { var s = SEC.filter(function (x) { return x[0] === id; })[0]; return s ? btn(s[1], { t: 'section', id: id }) : ''; }).join('') + '</div>'; }
    var MAIN = ['readers', 'repeatAyah', 'adhkar', 'ruqyah', 'modes', 'qibla', 'mosques', 'khatmah'];
    function nowReply() {
        var d = new Date(), t = '', g = '', h = '';
        try {
            t = d.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
            g = d.toLocaleDateString('ar', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        catch (e) {
            t = String(d);
        }
        try {
            h = new Intl.DateTimeFormat('ar-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        }
        catch (e) { }
        return '🕐 الساعة الآن <b>' + esc(t) + '</b> بحسب ساعة جهازك.<br>📅 ' + esc(g) + (h ? '<br>🌙 الموافق تقريبًا: ' + esc(h) + ' <span class="mini">(حساب فلكي؛ قد يختلف يومًا عن رؤية الهلال)</span>' : '') + secBtns(['manasik']);
    }
    function chat(n, q) {
        var short = n.length < 60;
        if (short && /^(السلام عليكم|سلام عليكم|سلام|مرحبا|اهلا|هلا|صباح الخير|مساء الخير|هاي|هلو|السلام)( |$)/.test(n))
            return 'وعليكم السلام ورحمة الله وبركاته 🌿 أنا مساعد المسلم. كيف أخدمك اليوم؟' + secBtns(MAIN.slice(0, 6));
        if (/(من انت|منو انت|مين انت|انت مين|انت من|ما انت|ما اسمك|اسمك ايه|شنو اسمك|عرفني بنفسك|عرف بنفسك|وش انت|ايش انت)/.test(n))
            return 'أنا <b>«مساعد المسلم»</b>، المساعد الموجود داخل تطبيق المسلم. أفهم طلبك وأوصلك إلى ما تريد: القرّاء والتلاوات، تكرار الآيات، الأذكار والأدعية، الرقية، الأوضاع، القبلة، المساجد القريبة، والختمة — وأُشغّلها لك بزر واحد. لا أُفتي في الأحكام الشرعية.' + secBtns(MAIN.slice(0, 6));
        if (/(هل انت (انسان|بشر|روبوت|بوت|ذكاء)|انت (انسان|روبوت|بشر|بوت))/.test(n))
            return 'أنا برنامج آلي داخل التطبيق، لست إنسانًا. أفهم الأسئلة المتعلقة بالتطبيق وأوجّهك أو أُشغّل لك ما تطلب، وإن لم يكن عندي الجواب أعتذر وأدلّك على مصدر مناسب.';
        if (/(ماذا تفعل|ماذا تستطيع|ايش تقدر|شنو تقدر|ماذا يمكنك|وش تسوي|كيف تساعدني|كيف استخدمك|ماذا عندك|ماذا تعرف|^مساعده$|^help$)/.test(n))
            return 'يمكنني مثلًا:<br>• تشغيل سورة بصوت قارئ معيّن: «اسمع الكهف بصوت السديس»<br>• تكرار آيات بلا توقف: «كرر آية الكرسي»<br>• فتح الأذكار والرقية والأوضاع والقبلة والمساجد القريبة<br>• إخبارك بالوقت والتاريخ الهجري<br>وإن لم أجد ما تطلب أعتذر وأدلّك على مصدره.' + secBtns(MAIN);
        if (short && /(كيف حالك|كيفك|شلونك|اخبارك|عامل ايه|شخبارك|كيف الحال)/.test(n))
            return 'الحمد لله، أنا بخير، شكرًا لسؤالك 🌿 وأنت كيف حالك؟ تفضّل بطلبك.';
        if (short && /(شكرا|جزاك الله|بارك الله فيك|بارك الله|يعطيك العافيه|الله يعطيك|ممنون|تسلم)/.test(n))
            return 'وإياك، جزاك الله خيرًا وبارك فيك 🌿 أنا في خدمتك متى شئت.';
        if (short && /(مع السلامه|في امان الله|وداعا|الي اللقاء|تصبح علي خير)/.test(n))
            return 'في أمان الله وحفظه 🌿 لا تنسَ أذكار اليوم.' + secBtns(['adhkar']);
        if (/(من صنعك|من صمم|من طورك|من برمجك|من صاحب (التطبيق|الموقع)|من مطور|من انشا|من صانع|من يملك)/.test(n))
            return 'عذرًا، لا توجد لديّ معلومات مؤكدة عن صاحب التطبيق أو مطوّره، فلا أريد أن أخمّن. يمكنك سؤال من شاركك رابط التطبيق، أو تفقّد صفحة الإعدادات إن وُجدت فيها وسيلة تواصل.' + secBtns(['settings']);
        if (/(ما هو (التطبيق|الموقع|المسلم)|ما هذا (التطبيق|الموقع)|عن (التطبيق|الموقع)|ما فائده (التطبيق|الموقع)|ماذا في (التطبيق|الموقع))/.test(n))
            return 'تطبيق «المسلم» يجمع: قرّاء وتلاوات بأصوات كثيرة، تكرار الآيات للحفظ، الأذكار والأدعية بتسجيلات بشرية، الرقية الشرعية، أوضاع تشغيل متتالية (نوم/صباح/مساء…)، ختمة القرآن، القبلة، المساجد القريبة، التقويم الهجري، وعالم الأطفال. ويعمل جزء كبير منه بلا إنترنت بعد التحميل.' + secBtns(MAIN);
        if (/(كم الساعه|الساعه كم|ما الوقت|الوقت الان|كم الوقت|ما التاريخ|تاريخ اليوم|اي يوم|ما هو اليوم|التاريخ الهجري|كم التاريخ|اليوم كم)/.test(n))
            return nowReply();
        return null;
    }
    var OUT = [
        { re: /(مواقيت|اوقات الصلاه|وقت (الفجر|الظهر|العصر|المغرب|العشاء)|متي (اذان|الفجر|الظهر|العصر|المغرب|العشاء)|موعد الاذان|الاذان)/, topic: 'مواقيت الصلاة', inapp: ['qibla', 'mosques'], src: [['مواقيت الصلاة — AlAdhan', 'https://aladhan.com/prayer-times'], ['IslamicFinder', 'https://www.islamicfinder.org/']] },
        { re: /(تفسير|معني (ايه|الايه|كلمه)|اسباب نزول|اعراب)/, topic: 'التفسير ومعاني الآيات', inapp: ['readers'], src: [['التفسير — جامعة الملك سعود', 'https://quran.ksu.edu.sa/'], ['إسلام ويب', 'https://www.islamweb.net/ar/']] },
        { re: /(سيره (النبي|الرسول)|السيره النبويه|غزوه|فتح مكه|تاريخ (الاسلام|اسلامي)|الصحابه|الخلفاء الراشدين)/, topic: 'السيرة والتاريخ الإسلامي', inapp: ['children'], src: [['قصة الإسلام', 'https://islamstory.com/']], extra: 'وفي «عالم الأطفال» قصص الأنبياء.' },
        { re: /(سبحه|مسبحه|عداد تسبيح)/, topic: 'السبحة', inapp: ['adhkar'], src: [], extra: 'في الأذكار عدّاد لكل ذكر: اضغط عند القراءة فيُحسب لك العدد.' }
    ];
    function outReply(n) {
        for (var i = 0; i < OUT.length; i++) {
            var o = OUT[i];
            if (!o.re.test(n) || (o.not && o.not.test(n)))
                continue;
            var h = (o.off ? '⏳ ' + esc(o.off) : 'عذرًا، لم أجد «' + esc(o.topic) + '» داخل التطبيق.');
            if (o.extra)
                h += ' ' + esc(o.extra);
            if (o.src.length)
                h += '<br>المصدر الذي ستجده فيه:<div>' + o.src.map(function (x) { return urlBtn(x[0], x[1]); }).join('') + '</div>';
            if (o.inapp && o.inapp.length)
                h += '<div class="mini">المتاح داخل التطبيق:</div>' + secBtns(o.inapp);
            return h;
        }
        return null;
    }
    var FIQH = /(ما حكم|حكم |يجوز|لا يجوز|هل يجوز|حلال|حرام|فتوي|فتوى|افتني|يبطل|تبطل|كفاره|هل يصح|هل تصح|مباح|مكروه|يفطر|مفطر|نجس|طهاره|طلاق|ربا|زكاه|ميراث|نصاب|مذهب|شرعا)/;
    function fiqhReply() {
        return 'هذا سؤال في الحكم الشرعي، ولا أستطيع الإفتاء فيه حتى لا أُخطئ في دين الله. الأولى أن تسأل عالمًا أو جهة إفتاء موثوقة، وهذه مصادر تجد فيها الفتاوى:<div>' + urlBtn('الفتاوى — إسلام ويب', 'https://www.islamweb.net/ar/fatwa/') + urlBtn('الشيخ ابن باز', 'https://binbaz.org.sa/') + '</div>';
    }
    function unknownReply(q) {
        var g = 'https://www.google.com/search?q=' + encodeURIComponent(q);
        return 'عذرًا، لم أجد ما يخصّ «' + esc(String(q).slice(0, 80)) + '» داخل التطبيق، ولا أريد أن أخمّن جوابًا. جرّب أن تذكر السورة أو القارئ أو القسم الذي تقصده، أو اختر من هنا:' + secBtns(MAIN) + '<div class="mini">وإن كان سؤالك عامًا فيمكنك البحث عنه:</div><div>' + urlBtn('ابحث في الإنترنت', g) + '</div>';
    }
    window.v105Ask = async function (q, legacy) {
        var n = norm(q);
        var d = await askLLM(q);
        if (d)
            return renderLLM(d);
        var c = chat(n, q);
        if (c)
            return c;
        if (FIQH.test(n))
            return fiqhReply();
        var o = outReply(n);
        if (o)
            return o;
        var w = whoIs(n);
        if (w)
            return w;
        var u = understand(q), r = reply(u);
        if (r)
            return r;
        var as = appSearch(n);
        if (as)
            return as;
        var mw = WHO.exec(n);
        if (mw)
            return externalReply(mw[2]);
        if (typeof legacy === 'function') {
            var l;
            try {
                l = legacy(q);
            }
            catch (e) {
                l = null;
            }
            if (l && !/لم أجد «/.test(String(l)))
                return l;
        }
        return unknownReply(q);
    };
    window.loadHadith = window.initHadith = window.openHadithCollection = function () { };
    window.__v105 = { chat: chat, outReply: outReply, unknownReply: unknownReply, understand: understand, reply: reply, findReciters: findReciters, findSurah: findSurah, arPick: arPick, norm: norm };
})();
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var LSget = function (k, d) { try {
        var v = localStorage.getItem(k);
        return v == null ? d : v;
    }
    catch (e) {
        return d;
    } };
    var LSset = function (k, v) { try {
        localStorage.setItem(k, v);
    }
    catch (e) { } };
    var AD = '٠١٢٣٤٥٦٧٨٩';
    function norm(s) { return String(s || '').replace(/[٠-٩]/g, function (d) { return AD.indexOf(d); }).replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim(); }
    function nf(n, d) { try {
        return Number(n).toLocaleString('ar', { minimumFractionDigits: d || 0, maximumFractionDigits: d == null ? 0 : d });
    }
    catch (e) {
        return String(n);
    } }
    var FS_KEY = 'quran-m09-font-scale', FS_MIN = 0.8, FS_MAX = 1.6;
    function fsGet() { var v = parseFloat(LSget(FS_KEY, '1')); return isFinite(v) ? Math.min(FS_MAX, Math.max(FS_MIN, v)) : 1; }
    var fsCss = document.createElement('style');
    fsCss.id = 'v105-fs';
    fsCss.textContent = '.v105FsPrev{padding:10px;border-radius:12px;background:var(--card,#fff);border:1px dashed rgba(127,127,127,.4);margin-top:8px;text-align:center;overflow:hidden}.v105FsBtns{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px}.v105FsBtns button{padding:6px 10px;border-radius:10px}';
    document.head.appendChild(fsCss);
    function fsApply(v) {
        v = Math.round(Math.min(FS_MAX, Math.max(FS_MIN, v)) * 100) / 100;
        var h = document.documentElement;
        h.style.setProperty('--font-scale', '1');
        h.style.setProperty('--v105-fs', String(v));
        h.style.removeProperty('--v105-zoom');
        LSset(FS_KEY, String(v));
        fsUI();
        return v;
    }
    window.setFontScale = function (v) { fsApply(+v || 1); };
    function fsUI() {
        var v = fsGet(), r = $('v105FsRange');
        if (!r)
            return;
        r.value = String(Math.round(v * 100));
        $('v105FsVal').textContent = nf(Math.round(v * 100)) + '٪';
        var pv = $('v105FsPrev');
        if (pv)
            pv.style.fontSize = (16 * v) + 'px';
    }
    function fsMount() {
        var row = [].slice.call(document.querySelectorAll('#settings .stgRow')).filter(function (r) { return /حجم الخط/.test(r.textContent); })[0];
        if (!row || row.__v105)
            return;
        row.__v105 = 1;
        row.style.flexWrap = 'wrap';
        var seg = row.querySelector('.stgSeg');
        if (seg)
            seg.remove();
        var d = document.createElement('div');
        d.style.cssText = 'width:100%;margin-top:6px';
        d.innerHTML = '<div style="display:flex;align-items:center;gap:8px"><button type="button" id="v105FsMinus" class="stgBtn" aria-label="تصغير">A−</button><input type="range" id="v105FsRange" min="80" max="160" step="5" style="flex:1"><button type="button" id="v105FsPlus" class="stgBtn" aria-label="تكبير">A+</button></div>'
            + '<div style="text-align:center;margin-top:4px"><b id="v105FsVal"></b> <span class="mini">(الافتراضي ١٠٠٪)</span></div>'
            + '<div class="v105FsBtns">' + [[80, 'صغير'], [90, 'أصغر قليلًا'], [100, 'عادي'], [115, 'كبير'], [130, 'أكبر'], [160, 'الأقصى']].map(function (x) { return '<button type="button" class="stgBtn" data-fs="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '<button type="button" class="stgBtn" data-fs="100">↺ الافتراضي</button></div>'
            + '<div id="v105FsPrev" class="v105FsPrev">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — هذه معاينة لحجم النص</div>';
        row.appendChild(d);
        var rg = $('v105FsRange');
        rg.oninput = function () { $('v105FsVal').textContent = nf(+rg.value) + '٪'; $('v105FsPrev').style.fontSize = (16 * (+rg.value) / 100) + 'px'; };
        rg.onchange = function () { fsApply((+rg.value) / 100); };
        $('v105FsMinus').onclick = function () { fsApply(fsGet() - 0.05); };
        $('v105FsPlus').onclick = function () { fsApply(fsGet() + 0.05); };
        [].forEach.call(d.querySelectorAll('[data-fs]'), function (b) { b.onclick = function () { fsApply((+b.getAttribute('data-fs')) / 100); }; });
        fsUI();
    }
    fsApply(fsGet());
    fsMount();
    (function () {
        function parse(c) { var m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m)
            return null; var v = m[1].split(',').map(parseFloat); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; }
        function lum(c) { var f = function (x) { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
        function bgLum(el) {
            var base = { r: 8, g: 18, b: 15 }, layers = [], e = el;
            while (e && e.nodeType === 1) {
                var cs = getComputedStyle(e), bi = cs.backgroundImage;
                if (/gradient/.test(bi)) {
                    var st = (bi.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(function (c) { return c && c.a > 0.5; });
                    if (st.length) {
                        var avg = st.reduce(function (s, c) { return s + lum(c); }, 0) / st.length;
                        return avg;
                    }
                }
                var c = parse(cs.backgroundColor);
                if (c && c.a > 0) {
                    layers.push(c);
                    if (c.a >= 1)
                        break;
                }
                e = e.parentElement;
            }
            for (var i = layers.length - 1; i >= 0; i--) {
                var c2 = layers[i];
                base = { r: c2.r * c2.a + base.r * (1 - c2.a), g: c2.g * c2.a + base.g * (1 - c2.a), b: c2.b * c2.a + base.b * (1 - c2.a) };
            }
            return lum(base);
        }
        function fix(b) {
            if (!b || b.nodeType !== 1 || b.tagName !== 'BUTTON')
                return;
            if (!document.body.classList.contains('dark')) {
                if (b.__v105c) {
                    b.style.removeProperty('color');
                    b.__v105c = 0;
                }
                return;
            }
            if (b.classList.contains('primary') || b.classList.contains('back') || b.closest('nav.nav,header.top,.nvHero,.nvCard,.nvMenu,#nvNotif,#nvMore'))
                return;
            if (!b.offsetParent && getComputedStyle(b).position !== 'fixed')
                return;
            var l = bgLum(b);
            b.style.setProperty('color', l < 0.3 ? 'var(--v105-t,#fff)' : '#111', 'important');
            b.__v105c = 1;
        }
        var pend = false, all = false, added = new Set();
        function flush() { pend = false; var list = all ? [].slice.call(document.querySelectorAll('button')) : Array.from(added); added.clear(); all = false; list.forEach(fix); }
        function sched() { if (pend)
            return; pend = true; setTimeout(flush, 120); }
        new MutationObserver(function (ms) {
            ms.forEach(function (m) {
                if (m.type === 'attributes' && m.target === document.body) {
                    all = true;
                    return;
                }
                if (m.type === 'childList')
                    m.addedNodes.forEach(function (n) { if (n.nodeType !== 1)
                        return; if (n.tagName === 'BUTTON')
                        added.add(n);
                    else if (n.querySelectorAll)
                        n.querySelectorAll('button').forEach(function (b) { added.add(b); }); });
            });
            sched();
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        var _sh = window.show;
        window.show = function () { var r = _sh.apply(this, arguments); all = true; sched(); return r; };
        all = true;
        sched();
    })();
    var ctx = { surah: null, rec: null };
    function B(label, act) { return '<button type="button" class="v103Go" data-v105="' + esc(JSON.stringify(act)) + '">' + esc(label) + '</button>'; }
    function open_(id, label) { return '<div>' + B(label, { t: 'section', id: id }) + '</div>'; }
    var BUILD = window.APP_BUILD || '';
    function reportBtns() { return '<div>' + B('📋 نسخ تقرير المشكلة', { t: 'fn', f: 'report' }) + B('🩺 فحص الاتصال والصوت', { t: 'fn', f: 'diag' }) + B('🔄 تحديث التطبيق', { t: 'fn', f: 'reload' }) + '</div>'; }
    function hijriParts(d) { try {
        var f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(d), o = {};
        f.forEach(function (p) { if (p.type !== 'literal')
            o[p.type] = +p.value; });
        return o;
    }
    catch (e) {
        return null;
    } }
    function daysUntilHijri(month, day) {
        var start = new Date();
        start.setHours(12, 0, 0, 0);
        for (var i = 0; i <= 400; i++) {
            var d = new Date(start.getTime() + i * 86400000), h = hijriParts(d);
            if (!h)
                return null;
            if (h.month === month && h.day === day)
                return { days: i, date: d };
        }
        return null;
    }
    function eventAnswer(n) {
        var ev = null;
        if (/(رمضان)/.test(n))
            ev = ['رمضان', 9, 1];
        else if (/(عيد الفطر)/.test(n))
            ev = ['عيد الفطر', 10, 1];
        else if (/(عيد الاضحي|عيد الاضحى|الاضحي)/.test(n))
            ev = ['عيد الأضحى', 12, 10];
        else if (/(راس السنه الهجريه|السنه الهجريه الجديده|راس السنه)/.test(n))
            ev = ['رأس السنة الهجرية', 1, 1];
        else if (/(عاشوراء)/.test(n))
            ev = ['عاشوراء', 1, 10];
        else if (/(يوم عرفه)/.test(n))
            ev = ['يوم عرفة', 12, 9];
        else if (/(المولد النبوي|مولد النبي)/.test(n))
            ev = ['المولد النبوي', 3, 12];
        if (!ev || !/(متي|كم باقي|باقي|موعد|متي يبدا|كم يوم)/.test(n))
            return null;
        var r = daysUntilHijri(ev[1], ev[2]);
        if (!r)
            return null;
        var ds = r.date.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        return '📅 ' + ev[0] + ': ' + (r.days === 0 ? '<b>اليوم</b>' : 'بعد <b>' + nf(r.days) + '</b> يومًا') + ' — الموافق تقريبًا ' + esc(ds) + '.<div class="mini">حساب فلكي (أم القرى)؛ قد يختلف يومًا عن إعلان رؤية الهلال في بلدك.</div>' + open_('manasik', '📅 التقويم والمناسك');
    }
    function fontAnswer(n) {
        if (!/(خط|الخط|الكتابه|النص|الحروف)/.test(n))
            return null;
        var up = /(كبر|اكبر|زود|زيد|كبّر|تكبير|اضخم)/.test(n), dn = /(صغر|اصغر|قلل|انقص|تصغير)/.test(n), rs = /(الافتراضي|عادي|رجع|اعد|اعاده)/.test(n);
        if (!(up || dn || rs))
            return null;
        var cur = fsGet(), nv = rs ? 1 : (up ? cur + 0.15 : cur - 0.15);
        nv = fsApply(nv);
        return '🔠 ' + (rs ? 'أعدت الخط للحجم الافتراضي' : (up ? 'كبّرت الخط' : 'صغّرت الخط')) + ' — الحجم الآن <b>' + nf(Math.round(nv * 100)) + '٪</b>. يمكنك الضبط الدقيق من الإعدادات.' + open_('settings', '⚙️ الإعدادات');
    }
    var HOW = [
        { re: /(ثبت|تثبيت|انزل|اضيف).*(الشاشه الرئيسيه|التطبيق|الايفون|الجوال|الهاتف)|كيف.*(اثبت|تثبيت)/, a: '📲 <b>على الآيفون:</b> افتح الموقع في Safari ← اضغط زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية».<br><b>على الأندرويد (Chrome):</b> القائمة ⋮ ← «تثبيت التطبيق».' },
        { re: /(يعمل|يشتغل|اشتغل|استخدم).*(بدون انترنت|بلا انترنت|اوفلاين|بدون نت)|بدون انترنت/, a: '📴 نعم، جزء كبير يعمل بلا إنترنت بعد فتحه مرة: الواجهة والنصوص والأذكار المحفوظة وما حمّلته من تلاوات وأذكار ورقية. أما الخرائط وأصوات القرّاء غير المحمّلة فتحتاج اتصالًا.' },
        { re: /كيف.*(احمل|تحميل|انزل)|اين.*(المحمل|التنزيلات|المحمله)/, a: '⬇️ اضغط زر «تحميل» بجانب الذكر أو في بطاقة الرقية أو السورة. بعد اكتمال التحميل يختفي الزر، وتجد كل ما حمّلته في «تنزيلاتي» ويبقى بعد إغلاق التطبيق.' },
        { re: /كيف.*(اضيف|اضع|احفظ).*(المفضل|مفضله)|المفضله.*كيف/, a: '☆ في بطاقة القارئ اضغط «مفضل» فيُحفظ في قائمتك.' },
        { re: /كيف.*(اوقف|ايقاف|اقف).*(التكرار|الصوت)/, a: '⏹ في صفحة «تكرار الآية» اضغط «إيقاف». التكرار مفتوح دائمًا حتى تضغطه.' },
        { re: /كيف.*(مؤقت|اطفاء تلقائي|تايمر)|مؤقت النوم/, a: '⏲️ في «الأوضاع» اختر وضعًا (مثل وضع النوم) ثم حدّد المؤقت قبل التشغيل، وسيتوقف الصوت تلقائيًا عند انتهائه.' },
        { re: /كيف.*(احذف|مسح|امسح).*(التحميلات|المحمل)/, a: '🗑 من «تنزيلاتي» أو من «الإعدادات» توجد أزرار حذف الملفات الصوتية المحمّلة.' }
    ];
    function howAnswer(n) { for (var i = 0; i < HOW.length; i++)
        if (HOW[i].re.test(n))
            return HOW[i].a; return null; }
    function troubleAnswer(n) {
        if (!/(لا يعمل|لا يشتغل|ما يشتغل|ما يعمل|مو شغال|مش شغال|لا تعمل|لا تشتغل|ما تشتغل|ما تعمل|تعطل|تعطّل|مشكله|عطل|يعلق|بطيء|لا يظهر|لا تظهر|ما يظهر|ما تظهر|لا اقدر|ما اقدر|ما يفتح|لا يفتح|توقف)/.test(n))
            return null;
        var topic = /(كيبورد|لوحه المفاتيح|اكتب|الكتابه)/.test(n) ? 'kb' : /(صوت|قارئ|القراء|تشغيل|سوره|تلاوه|ايفون)/.test(n) ? 'audio' : /(مسجد|مساجد|موقع|gps)/.test(n) ? 'loc' : 'gen';
        var steps = {
            kb: '⌨️ <b>الكيبورد لا يظهر:</b><br>1) أغلق التطبيق تمامًا وافتحه من جديد (لتحميل آخر نسخة).<br>2) اضغط على خانة الكتابة مباشرة (لا يظهر الكيبورد إلا بلمسة منك).<br>3) إن بقيت المشكلة: الإعدادات ← عام ← لوحة المفاتيح، وتأكد أنها مفعّلة.',
            audio: '🎧 <b>التلاوة لا تعمل:</b><br>1) تأكد من الاتصال وارفع صوت الجهاز.<br>2) أغلق التطبيق وافتحه من جديد.<br>3) جرّب قارئًا آخر لتعرف هل المشكلة في قارئ بعينه.<br>4) اضغط «فحص الاتصال والصوت» وأرسل لي لقطة النتيجة.',
            loc: '🕌 <b>المساجد/الموقع:</b><br>1) فعّل الموقع الدقيق: على الآيفون الإعدادات ← الخصوصية والأمان ← خدمات الموقع ← Safari ← «الموقع الدقيق».<br>2) اضغط «تحديث موقعي بدقة» في صفحة المساجد وانتظر حتى تظهر الدقة بالأمتار.<br>3) إن فشل البحث ستظهر أسباب الفشل أسفل الحالة.',
            gen: '🛠️ <b>خطوات عامة:</b><br>1) أغلق التطبيق وافتحه من جديد لتحميل آخر نسخة.<br>2) تأكد من الاتصال.<br>3) اضغط «نسخ تقرير المشكلة» وأرسله لي ليتبيّن السبب بدقة.'
        };
        return steps[topic] + '<div class="mini">إصدارك: ' + esc(BUILD || '—') + '</div>' + reportBtns();
    }
    function dialect(q) {
        var map = { 'وين': 'اين', 'فين': 'اين', 'شن': 'ما', 'شنو': 'ما', 'ايش': 'ما', 'وش': 'ما', 'شنهي': 'ما هي', 'نبي': 'اريد', 'نبغي': 'اريد', 'نبغى': 'اريد', 'نبغا': 'اريد', 'ابغى': 'اريد', 'ابغي': 'اريد', 'عايز': 'اريد', 'عاوز': 'اريد', 'ودي': 'اريد', 'هلق': 'الان', 'دلوقتي': 'الان', 'هسه': 'الان', 'توا': 'الان', 'برشا': 'كثير', 'كيفاش': 'كيف', 'كيفاه': 'كيف', 'علاش': 'لماذا', 'ليش': 'لماذا' };
        return String(q).split(/\s+/).map(function (w) { return map[w] || w; }).join(' ');
    }
    function lev(a, b) { if (a === b)
        return 0; var m = [], i, j; for (i = 0; i <= a.length; i++)
        m[i] = [i]; for (j = 1; j <= b.length; j++)
        m[0][j] = j; for (i = 1; i <= a.length; i++)
        for (j = 1; j <= b.length; j++)
            m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return m[a.length][b.length]; }
    function didYouMean(q) {
        var n = norm(q).replace(/(^| )ال/g, '$1');
        if (n.length < 3 || n.split(' ').length > 3)
            return null;
        var cands = [];
        try {
            (typeof S !== 'undefined' && S || []).forEach(function (s, i) { cands.push({ l: 'سورة ' + s, key: norm(s).replace(/^ال/, ''), act: { t: 'section', id: 'readers' } }); });
        }
        catch (e) { }
        try {
            var seen = {};
            (typeof RECITERS !== 'undefined' && RECITERS || []).forEach(function (r) { var k = norm(r.name); if (seen[k])
                return; seen[k] = 1; cands.push({ l: r.name, key: k.replace(/(^| )ال/g, '$1'), act: { t: 'reciter', id: r.id, nm: r.name, s: 0 } }); });
        }
        catch (e) { }
        document.querySelectorAll('#home .tile b').forEach(function (b) { cands.push({ l: b.textContent.trim(), key: norm(b.textContent).replace(/(^| )ال/g, '$1'), act: { t: 'tile', k: b.textContent.trim() } }); });
        var best = null, bd = 99;
        cands.forEach(function (c) { var d = lev(n, c.key), lim = Math.max(1, Math.floor(Math.max(n.length, c.key.length) * 0.25)); if (d <= lim && d < bd) {
            bd = d;
            best = c;
        } });
        if (!best)
            return null;
        return 'هل تقصد <b>«' + esc(best.l) + '»</b>؟<div>' + B('نعم، افتح «' + best.l + '»', best.act) + '</div>';
    }
    var _ask = window.v105Ask, SURAHS = function () { return (typeof S !== 'undefined' && S) || []; };
    function updCtx(u) { try {
        if (u && u.surah)
            ctx.surah = u.surah;
        if (u && u.reciters && u.reciters.length)
            ctx.rec = String(u.reciters[0].r.name);
    }
    catch (e) { } }
    window.v105Ask = async function (q, legacy) {
        var n = norm(dialect(q)), r;
        if (/(ما الجديد|اي اصدار|ما اصدار|رقم الاصدار|نسخه التطبيق|اصدار التطبيق)/.test(n))
            return '🔖 إصدار تطبيقك: <b>' + esc(BUILD || '—') + '</b>. إن لم يكن الأحدث، أغلق التطبيق وافتحه من جديد.' + reportBtns();
        r = troubleAnswer(n);
        if (r)
            return r;
        r = howAnswer(n);
        if (r)
            return r;
        r = fontAnswer(n);
        if (r)
            return r;
        r = eventAnswer(n);
        if (r)
            return r;
        var q2 = dialect(q);
        var sn = /(?:سوره|السوره)\s*(?:رقم\s*)?(\d{1,3})(?!\s*(?:مره|مرات))/.exec(n);
        if (sn && +sn[1] >= 1 && +sn[1] <= 114 && SURAHS()[+sn[1] - 1])
            q2 = q2 + ' سورة ' + SURAHS()[+sn[1] - 1];
        else if (/(السوره التاليه|السوره الي بعدها|التي بعدها)/.test(n) && ctx.surah && ctx.surah < 114)
            q2 = q2 + ' سورة ' + SURAHS()[ctx.surah];
        else if (/(السوره السابقه|السوره الي قبلها|التي قبلها)/.test(n) && ctx.surah > 1)
            q2 = q2 + ' سورة ' + SURAHS()[ctx.surah - 2];
        else if (/(نفس(ها)?|ذاتها|اسمعها|كررها|وبصوت|بصوت|اسمعنيها|شغلها)/.test(n) && ctx.surah && !(window.__v105 && window.__v105.understand(q2).surah))
            q2 = q2 + ' سورة ' + SURAHS()[ctx.surah - 1];
        try {
            updCtx(window.__v105.understand(q2));
        }
        catch (e) { }
        var out = _ask ? await _ask(q2, legacy) : null;
        if (typeof out === 'string' && /^عذرًا، لم أجد ما يخصّ/.test(out)) {
            var dm = didYouMean(q);
            if (dm)
                return dm;
        }
        return out;
    };
    window.__v105F = { hijriParts: hijriParts, daysUntilHijri: daysUntilHijri, dialect: dialect, didYouMean: didYouMean };
})();
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var LSget = function (k, d) { try {
        var v = localStorage.getItem(k);
        return v == null ? d : v;
    }
    catch (e) {
        return d;
    } };
    var LSset = function (k, v) { try {
        localStorage.setItem(k, v);
    }
    catch (e) { } };
    var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    function standalone() { return !!(navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || (window.matchMedia && matchMedia('(display-mode: fullscreen)').matches)); }
    if (standalone())
        document.documentElement.classList.add('standalone');
    if ('serviceWorker' in navigator) {
        var reg = function () {
            navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(function () { });
        };
        if (document.readyState === 'complete')
            reg();
        else
            window.addEventListener('load', reg);
    }
    function gear() {
        var pts = [], n = 8, R = 9.4, r = 7.3;
        for (var k = 0; k < n; k++) {
            var a = k * 2 * Math.PI / n;
            [[-0.27, r], [-0.17, R], [0.17, R], [0.27, r]].forEach(function (o) { var t = a + o[0]; pts.push((12 + o[1] * Math.cos(t)).toFixed(2) + ' ' + (12 + o[1] * Math.sin(t)).toFixed(2)); });
        }
        return '<path d="M' + pts.join('L') + 'Z"/><circle cx="12" cy="12" r="3.1"/><circle class="shield" cx="12" cy="12" r="5.4" stroke-dasharray="2 2.2"/>';
    }
    var P = {
        home: '<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.8 9.8V20h12.4V9.8"/><path d="M9.8 20v-5.4h4.4V20"/>',
        settings: gear(),
        install: '<path d="M12 3.5v11"/><path d="m7.6 10.2 4.4 4.4 4.4-4.4"/><path d="M4.5 17v2.3A1.7 1.7 0 0 0 6.2 21h11.6a1.7 1.7 0 0 0 1.7-1.7V17"/>',
        share: '<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4"/>',
        compass: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2z"/>',
        doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h6M9.5 15.5h6M9.5 8.5h2.5"/>',
        penpaper: '<path d="M6 3.5h8l3 3V10"/><path d="M6 3.5v17h6"/><path d="M9 9h5M9 12.5h3"/><path d="m19.2 12.8-6.2 6.2-.8 2.8 2.8-.8 6.2-6.2a1.8 1.8 0 0 0-2-2z"/>',
        book: '<path d="M12 6.2C10.3 5 8 4.5 4.5 4.5v14c3.5 0 5.8.6 7.5 1.8 1.7-1.2 4-1.8 7.5-1.8v-14C16 4.5 13.7 5 12 6.2z"/><path d="M12 6.2v14"/>',
        headphones: '<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="14.5" width="4" height="6" rx="1.6"/><rect x="16.5" y="14.5" width="4" height="6" rx="1.6"/>',
        repeat: '<path d="M17 3.5 20.5 7 17 10.5"/><path d="M3.5 11V9.5A2.5 2.5 0 0 1 6 7h14.5"/><path d="M7 20.5 3.5 17 7 13.5"/><path d="M20.5 13v1.5A2.5 2.5 0 0 1 18 17H3.5"/>',
        mosque: '<path d="M5 20v-7.5a7 7 0 0 1 14 0V20"/><path d="M12 2.8v2.4"/><path d="M3.5 20h17"/><path d="M10 20v-3.2a2 2 0 0 1 4 0V20"/>',
        mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/>',
        sparkle: '<path d="M12 3.2 14 9l5.8 2L14 13l-2 5.8L10 13l-5.8-2L10 9z"/><path d="M19 3.5v3M17.5 5h3"/>',
        kids: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.2a4.2 4.2 0 0 0 7 0"/><path d="M9 9.6h.01M15 9.6h.01"/>',
        calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
        sliders: '<path d="M4 7h10M18 7h2M4 17h3M11 17h9"/><circle cx="16" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
        chat: '<path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3.5V17h-2A1.5 1.5 0 0 1 3 15.5V7a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M8 10h8M8 13h5"/>',
        bookmark: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/><path d="m9.5 9 1.8 1.8L15 7.2"/>',
        shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
        pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
        qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18.5 14H21M18.5 18H21M16.5 20.5V18"/>',
        copy: '<rect x="8" y="8" width="12" height="12" rx="2.4"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
        phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
        desktop: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
        plussq: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/>',
        shareios: '<path d="M12 15V3.5"/><path d="m8 7.2 4-3.7 4 3.7"/><path d="M6.5 10.5H6A1.5 1.5 0 0 0 4.5 12v7A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-.5"/>',
        dots: '<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
        check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>'
    };
    function svg(name, cls) { return '<svg class="vi vi-' + name + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || '') + '</svg>'; }
    window.v105Icon = svg;
    var MAP = [[/مصحف/, 'book'], [/مساعد/, 'chat'], [/القراء/, 'headphones'], [/الأذكار/, 'sparkle'], [/الختمة/, 'bookmark'], [/الرقية/, 'shield'], [/الأحاديث/, 'doc'], [/الأطفال/, 'kids'], [/القبلة/, 'compass'], [/تكرار/, 'repeat'], [/المساجد/, 'mosque'], [/الأوضاع/, 'sliders'], [/المناسك|التقويم/, 'calendar'], [/أعمال/, 'sun'], [/تثبيت|مشاركة/, 'install']];
    function iconize() {
        document.querySelectorAll('#home .tile').forEach(function (t) {
            var ico = t.querySelector('.ico'), b = t.querySelector('b');
            if (!ico || !b || ico.__v)
                return;
            var tt = b.textContent;
            for (var i = 0; i < MAP.length; i++)
                if (MAP[i][0].test(tt)) {
                    ico.innerHTML = svg(MAP[i][1]);
                    ico.__v = 1;
                    ico.classList.add('vIco');
                    return;
                }
        });
    }
    function appUrl() { try {
        var u = new URL('./', location.href);
        u.search = '';
        u.hash = '';
        return u.href;
    }
    catch (e) {
        return location.href;
    } }
    var SHARE_TXT = 'تطبيق «المسلم» — قرّاء وتلاوات، أذكار ورقية، قبلة، مساجد قريبة، تكرار الآيات للحفظ، ويعمل بلا إنترنت.';
    function mkPage(id, title, sub, body) {
        if ($(id))
            return $(id);
        var host = $('home').parentNode;
        var s = document.createElement('section');
        s.id = id;
        s.className = 'page';
        s.innerHTML = '<div class="section"><button class="back" onclick="show(\'home\')" aria-label="رجوع">←</button><div><h2>' + title + '</h2><p>' + sub + '</p></div></div>' + body;
        host.appendChild(s);
        return s;
    }
    var deferred = null;
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; refreshInstall(); });
    window.addEventListener('appinstalled', function () { deferred = null; LSset('muslim-v105-installed', '1'); refreshInstall(); });
    function steps(list) { return '<ol class="vSteps">' + list.map(function (x) { return '<li><span>' + x + '</span></li>'; }).join('') + '</ol>'; }
    function buildInstall() {
        if ($('install'))
            return;
        var body = ''
            + '<div class="card vHero"><div class="vHeroIc">' + svg('install') + '</div><h3>ثبّت «المسلم» كتطبيق حقيقي</h3><p class="mini">يفتح بملء الشاشة بلا شريط المتصفح، وبأيقونة على شاشتك الرئيسية، ويعمل بلا إنترنت.</p>'
            + '<div id="vInstStatus" class="notice" hidden></div>'
            + '<button type="button" class="primary vBtn" id="vInstallNow" hidden>' + svg('install') + ' <span>تثبيت الآن</span></button></div>'
            + '<div class="card"><h3>' + svg('phone') + ' الآيفون (iOS Safari)</h3>' + steps([
            'افتح الموقع في <b>Safari</b> (وليس من داخل تطبيق آخر).',
            'اضغط زر المشاركة ' + svg('shareios', 'vInline') + ' أسفل المتصفح.',
            'مرّر لأسفل واختر <b>«إضافة إلى الشاشة الرئيسية»</b> ' + svg('plussq', 'vInline') + '.',
            'اضغط <b>«إضافة»</b> أعلى الشاشة ← يظهر «المسلم» على شاشتك ويعمل بملء الشاشة.'
        ]) + '<p class="mini">على iOS 16.4 فما فوق يمكن أيضًا من Chrome وEdge عبر قائمة المشاركة.</p></div>'
            + '<div class="card"><h3>' + svg('phone') + ' سامسونج وأندرويد (Chrome)</h3>' + steps([
            'اضغط قائمة النقاط الثلاث ' + svg('dots', 'vInline') + ' أعلى المتصفح.',
            'اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.',
            'أكّد بالضغط على <b>«تثبيت»</b>.'
        ]) + '<p class="mini">في متصفح سامسونج: القائمة ☰ ← «إضافة الصفحة إلى» ← «الشاشة الرئيسية».</p></div>'
            + '<div class="card"><h3>' + svg('desktop') + ' الكمبيوتر (PC / Mac)</h3>' + steps([
            'في Chrome أو Edge: اضغط أيقونة التثبيت ' + svg('install', 'vInline') + ' في شريط العنوان.',
            'اضغط <b>«تثبيت / Install»</b>.',
            'على Mac (Safari 17+): ملف ← <b>«إضافة إلى Dock»</b>.'
        ]) + '</div>'
            + '<div class="card vShare"><h3>' + svg('share') + ' مشاركة التطبيق</h3><p class="mini">شاركه مع من تحب — صدقة جارية بإذن الله.</p>'
            + '<button type="button" class="primary vBtn" id="vShareBtn">' + svg('share') + ' <span>مشاركة التطبيق</span></button>'
            + '<button type="button" class="vBtn" id="vCopyBtn">' + svg('copy') + ' <span>نسخ الرابط</span></button>'
            + '<div id="vShareMsg" class="mini" role="status" aria-live="polite"></div>'
            + '<div class="vSocial" id="vSocial"></div></div>'
            + '<div class="card vQr"><h3>' + svg('qr') + ' رمز QR للتطبيق</h3>'
            + '<img id="vQrImg" alt="رمز QR لفتح تطبيق المسلم مباشرة" width="220" height="220" decoding="async">'
            + '<p>امسح الرمز بكاميرا هاتفك لفتح التطبيق مباشرة، أو نزّل الصورة وشاركها.</p>'
            + '<a id="vQrDl" class="vBtn primary" href="qr.png" download="Muslim-QR.png" style="display:inline-flex;text-decoration:none;justify-content:center">⬇ تنزيل صورة الرمز</a>'
            + '<p id="vQrMissing" class="mini" hidden>صورة الرمز غير موجودة: ضع ملف <b>qr.png</b> في المجلد الرئيسي للمستودع على GitHub.</p></div>';
        mkPage('install', 'تثبيت التطبيق والمشاركة', 'ثبّته كتطبيق مستقل وشاركه بسهولة', body);
        var img = $('vQrImg');
        var qv = '?r=' + Math.floor(Date.now() / 600000), QRD = 'data:image/png;base64,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';
        img.src = QRD; /* الرمز مضمَّن في الكود فلا يعتمد ظهوره على رفع ملف qr.png */
        $('vQrDl').href = QRD; $('vQrMissing').hidden = true;
        var url = appUrl(), enc = encodeURIComponent;
        $('vSocial').innerHTML = [['واتساب', 'https://wa.me/?text=' + enc(SHARE_TXT + ' ' + url)], ['تليجرام', 'https://t.me/share/url?url=' + enc(url) + '&text=' + enc(SHARE_TXT)], ['فيسبوك', 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url)], ['X', 'https://twitter.com/intent/tweet?text=' + enc(SHARE_TXT) + '&url=' + enc(url)]]
            .map(function (x) { return '<a class="vSoc" href="' + esc(x[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(x[0]) + '</a>'; }).join('');
        $('vShareBtn').onclick = function () {
            var data = { title: 'تطبيق المسلم', text: SHARE_TXT, url: url };
            if (navigator.share) {
                navigator.share(data).catch(function (e) { if (e && e.name !== 'AbortError')
                    copy(); });
            }
            else {
                copy('الرابط منسوخ — اختر تطبيق المشاركة من الأزرار أدناه.');
            }
        };
        function copy(msg) {
            var done = function () { $('vShareMsg').textContent = msg || '✅ تم نسخ الرابط'; };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done, function () { fallback(); });
            }
            else
                fallback();
            function fallback() { var ta = document.createElement('textarea'); ta.value = url; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(ta); ta.select(); try {
                document.execCommand('copy');
                done();
            }
            catch (e) {
                $('vShareMsg').textContent = url;
            } ta.remove(); }
        }
        $('vCopyBtn').onclick = function () { copy(); };
        $('vInstallNow').onclick = function () {
            if (!deferred)
                return;
            deferred.prompt();
            deferred.userChoice.then(function (c) { if (c && c.outcome === 'accepted')
                LSset('muslim-v105-installed', '1'); deferred = null; refreshInstall(); }).catch(function () { });
        };
        refreshInstall();
    }
    function refreshInstall() {
        var st = $('vInstStatus'), btn = $('vInstallNow');
        if (!st || !btn)
            return;
        if (standalone()) {
            st.hidden = false;
            st.innerHTML = svg('check', 'vInline') + ' التطبيق مثبّت ويعمل الآن كتطبيق مستقل.';
            btn.hidden = true;
        }
        else if (deferred) {
            st.hidden = true;
            btn.hidden = false;
        }
        else {
            st.hidden = true;
            btn.hidden = true;
        }
    }
    window.v105OpenInstall = function () { if (typeof show === 'function')
        show('install'); };
    var _sh3 = window.show;
    if (typeof _sh3 === 'function') {
        window.show = function (id) { if (id === 'install')
            buildInstall(); var r = _sh3.apply(this, arguments); if (id === 'install')
            refreshInstall(); return r; };
    }
    function addInstallTile() {
        var old = $('v105InstTile');
        if (old)
            old.remove();
        return;
        if ($('v105InstTile'))
            return;
        var tiles = document.querySelectorAll('#home .tile');
        if (!tiles.length)
            return;
        var t = document.createElement('div');
        t.className = 'tile';
        t.id = 'v105InstTile';
        t.setAttribute('role', 'button');
        t.setAttribute('tabindex', '0');
        t.setAttribute('onclick', "show('install')");
        t.innerHTML = '<span class="ico"></span><b>تثبيت ومشاركة</b><small>أيقونة على شاشتك • مشاركة • QR</small>';
        var ref = tiles[Math.min(2, tiles.length - 1)];
        ref.parentNode.insertBefore(t, ref);
        t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            show('install');
        } });
    }
    function iosHint() {
        if (!IOS || standalone() || LSget('muslim-v105-ioshint', '0') === '1')
            return;
        setTimeout(function () {
            if ($('vIosHint'))
                return;
            var b = document.createElement('div');
            b.id = 'vIosHint';
            b.setAttribute('role', 'dialog');
            b.setAttribute('aria-label', 'تثبيت التطبيق');
            b.innerHTML = '<div>' + svg('shareios', 'vInline') + ' ثبّت «المسلم» كتطبيق: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».</div><div class="vHintBtns"><button type="button" id="vHintMore">التفاصيل</button><button type="button" id="vHintX" aria-label="إغلاق">✕</button></div>';
            document.body.appendChild(b);
            function close() { LSset('muslim-v105-ioshint', '1'); b.remove(); }
            $('vHintX').onclick = close;
            $('vHintMore').onclick = function () { close(); show('install'); };
        }, 6000);
    }
    function boot() {
        buildInstall();
        addInstallTile();
        iconize();
        try {
            var q = new URLSearchParams(location.search).get('open');
            if (q === 'install')
                show('install');
        }
        catch (e) { }
        iosHint();
    }
    boot();
    var pend = false;
    try {
        new MutationObserver(function () { if (pend)
            return; pend = true; setTimeout(function () { pend = false; iconize(); }, 250); }).observe(document.body, { childList: true, subtree: true });
    }
    catch (e) { }
    window.__v105C = { svg: svg, icons: Object.keys(P), buildInstall: buildInstall };
})();
(function () {
    'use strict';
    var D = {
        plus: '<path d="M12 5v14M5 12h14"/>',
        moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
        star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
        play: '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
        pause: '<rect width="5" height="18" x="14" y="3" rx="1"/><rect width="5" height="18" x="5" y="3" rx="1"/>',
        stop: '<rect width="16" height="16" x="4" y="4" rx="2.5"/>',
        trash: '<path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
        x: '<path d="M18 6 6 18M6 6l12 12"/>',
        folder: '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
        refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
        search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
        bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
        globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
        palette: '<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".6"/><circle cx="17.5" cy="10.5" r=".6"/><circle cx="6.5" cy="12.5" r=".6"/><circle cx="8.5" cy="7.5" r=".6"/>',
        volume: '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6m3.364 3.364a9 9 0 0 0 0-12.728"/>',
        mute: '<path d="M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298zm5.5 9.798 5-5m-5 0 5 5"/>',
        heart: '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
        clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
        sunrise: '<path d="M12 2v8m-7.07.93 1.41 1.41M2 18h2m16 0h2m-2.93-7.07-1.41 1.41M22 22H2M8 6l4-4 4 4m0 12a4 4 0 0 0-8 0"/>',
        sunset: '<path d="M12 10V2m-7.07 8.93 1.41 1.41M2 18h2m16 0h2m-2.93-7.07-1.41 1.41M22 22H2M16 6l-4 4-4-4m8 12a4 4 0 0 0-8 0"/>',
        rocket: '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>',
        loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
        check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
        checkc: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8 5.2-5.6"/>',
        alert: '<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.6h.01"/>',
        lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
        leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
        link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
        menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
        back: '<path d="m9 6 6 6-6 6"/>',
        target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
        trophy: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
        wifioff: '<path d="M2 2l20 20"/><path d="M8.5 16.5a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.7M10.7 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 5.2-2.7M16 11.2a10 10 0 0 1 3 1.7"/><path d="M12 20h.01"/>',
        skipb: '<path d="M19 20 9 12l10-8z"/><path d="M5 19V5"/>',
        skipf: '<path d="m5 4 10 8-10 8z"/><path d="M19 5v14"/>',
        info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>',
        disk: '<path d="M3 13h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m5.4 13 2.1-7.2A2 2 0 0 1 9.4 4.4h5.2a2 2 0 0 1 1.9 1.4L18.6 13"/><path d="M7 17h.01"/>',
        undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
        nav: '<path d="m3 11 19-9-9 19-2-8z"/>',
        home: '<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.8 9.8V20h12.4V9.8"/><path d="M9.8 20v-5.4h4.4V20"/>',
        download: '<path d="M12 3.5v11"/><path d="m7.6 10.2 4.4 4.4 4.4-4.4"/><path d="M4.5 17v2.3A1.7 1.7 0 0 0 6.2 21h11.6a1.7 1.7 0 0 0 1.7-1.7V17"/>',
        upload: '<path d="M12 15V3.5"/><path d="m8 7.2 4-3.7 4 3.7"/><path d="M6.5 10.5H6A1.5 1.5 0 0 0 4.5 12v7A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-.5"/>',
        share: '<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4"/>',
        compass: '<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2z"/>',
        doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h6M9.5 15.5h6M9.5 8.5h2.5"/>',
        book: '<path d="M12 6.2C10.3 5 8 4.5 4.5 4.5v14c3.5 0 5.8.6 7.5 1.8 1.7-1.2 4-1.8 7.5-1.8v-14C16 4.5 13.7 5 12 6.2z"/><path d="M12 6.2v14"/>',
        headphones: '<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="14.5" width="4" height="6" rx="1.6"/><rect x="16.5" y="14.5" width="4" height="6" rx="1.6"/>',
        repeat: '<path d="M17 3.5 20.5 7 17 10.5"/><path d="M3.5 11V9.5A2.5 2.5 0 0 1 6 7h14.5"/><path d="M7 20.5 3.5 17 7 13.5"/><path d="M20.5 13v1.5A2.5 2.5 0 0 1 18 17H3.5"/>',
        mosque: '<path d="M5 20v-7.5a7 7 0 0 1 14 0V20"/><path d="M12 2.8v2.4"/><path d="M3.5 20h17"/><path d="M10 20v-3.2a2 2 0 0 1 4 0V20"/>',
        mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/>',
        sparkle: '<path d="M12 3.2 14 9l5.8 2L14 13l-2 5.8L10 13l-5.8-2L10 9z"/><path d="M19 3.5v3M17.5 5h3"/>',
        kids: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.2a4.2 4.2 0 0 0 7 0"/><path d="M9 9.6h.01M15 9.6h.01"/>',
        calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
        sliders: '<path d="M4 7h10M18 7h2M4 17h3M11 17h9"/><circle cx="16" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
        chat: '<path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3.5V17h-2A1.5 1.5 0 0 1 3 15.5V7a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M8 10h8M8 13h5"/>',
        bookmark: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
        shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
        pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
        qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18.5 14H21M18.5 18H21M16.5 20.5V18"/>',
        copy: '<rect x="8" y="8" width="12" height="12" rx="2.4"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
        phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
        gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
    };
    (function () {
        var pts = [], n = 8, R = 9.4, r = 7.3;
        for (var k = 0; k < n; k++) {
            var a = k * 2 * Math.PI / n;
            [[-0.27, r], [-0.17, R], [0.17, R], [0.27, r]].forEach(function (o) { var t = a + o[0]; pts.push((12 + o[1] * Math.cos(t)).toFixed(2) + ' ' + (12 + o[1] * Math.sin(t)).toFixed(2)); });
        }
        D.gear = '<path d="M' + pts.join('L') + 'Z"/><circle cx="12" cy="12" r="3.1"/>';
    })();
    var M = {};
    function map(name, list) { list.split(' ').forEach(function (e) { if (e)
        M[e] = name; }); }
    map('book', '📖 📗 📘 📚 📕 📙 📒 📔');
    map('loader', '⏳ ⌛');
    map('mic', '🎙 🎤');
    map('play', '▶ 🎬 ⏵');
    map('sparkle', '🤲 ✨ ✦ 🌟 💫 🎉 🔥 ⚡');
    map('check', '✓ ✔ ✅ ☑');
    map('pin', '📍 🗺 📌');
    map('mosque', '🕋 🕌');
    map('repeat', '🔁 🔂');
    map('refresh', '🔄 ↺ ↻');
    map('download', '⬇ 📥 💾 ⬆');
    map('star', '☆ ★ ⭐');
    map('headphones', '🎧');
    map('x', '❌ ✕ ✖ ✗ ✘');
    map('target', '🎯 🎮');
    map('doc', '📜 📝 📋');
    map('moon', '🌙 ☾ ☪');
    map('pause', '⏸');
    map('stop', '⏹');
    map('sunrise', '🌅');
    map('sunset', '🌇');
    map('heart', '🤍 ♥ ❤ 💚');
    map('search', '🔎 🔍');
    map('compass', '🧭');
    map('sun', '☀ 🌞');
    map('trophy', '🏆 🎖 👑');
    map('volume', '🔊 🔉');
    map('mute', '🔇');
    map('leaf', '🌿 🌱 🌺 🌹 🌷');
    map('alert', '⚠ 🚧');
    map('copy', '📋');
    map('gear', '⚙');
    map('home', '🏠');
    map('calendar', '📅 🗓 📆');
    map('kids', '🧒 👶');
    map('trash', '🗑');
    map('sliders', '🎛 🛠 🧰 🖌');
    map('phone', '📱');
    map('install', '📲');
    map('globe', '🌐');
    map('share', '📤');
    map('palette', '🎨');
    map('bell', '🔔');
    map('shield', '🛡 🔒 🔐');
    map('bookmark', '🔖');
    map('chat', '💬');
    map('link', '🔗');
    map('rocket', '🚀');
    map('clock', '🕘 🕐 ⏱ ⏲ 🕑');
    map('wifioff', '📴');
    map('undo', '↩ ↶');
    map('skipb', '⏮');
    map('skipf', '⏭');
    map('menu', '☰');
    map('info', 'ℹ 💡');
    map('nav', '🚗');
    map('folder', '📂 🗂 🗄');
    map('disk', '💽');
    M['📿'] = 'sparkle';
    M['🩺'] = 'shield';
    M['🧹'] = 'trash';
    M['🧳'] = 'folder';
    D.brain = '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 2.8A3 3 0 0 0 5 15a3 3 0 0 0 4 4.5V4z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 2.8A3 3 0 0 1 19 15a3 3 0 0 1-4 4.5V4z"/><path d="M9 9.5h1.5M13.5 14.5H15"/>';
    M['🧠'] = 'brain';
    D.kaaba = '<path d="M4 8l8-3.5L20 8v10l-8 3.5L4 18z"/><path d="m4 8 8 3.5L20 8M12 11.5v10M4 12.5l8 3.5 8-3.5"/>';
    D.moonstar = '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/><path d="M16.5 4v3.5M14.75 5.75h3.5"/>';
    D.drop = '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2 2.5"/>';
    D.door = '<path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M4 21h16"/><circle cx="14.5" cy="12.5" r=".9"/>';
    D.mountain = '<path d="M3 19l6-11 4 6 2.5-4L21 19z"/><path d="M9 8l1.6 2.6"/>';
    D.flower = '<circle cx="12" cy="12" r="2.2"/><path d="M12 9.8C10 6 11 3.5 12 3c1 .5 2 3 0 6.8zM12 14.2c2 3.8 1 6.3 0 6.8-1-.5-2-3 0-6.8zM9.8 12C6 10 3.5 11 3 12c.5 1 3 2 6.8 0zM14.2 12c3.8 2 6.3 1 6.8 0-.5-1-3-2-6.8 0z"/>';
    D.scroll = '<path d="M7 4h11a2 2 0 0 1 2 2v1H9v11a2 2 0 0 1-2 2 2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M9 7v11a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-1"/>';
    D.layers = '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12.5 9 5 9-5M3 16.5l9 5 9-5"/>';
    D.library = '<path d="M4 4.5h4v15H4zM10 4.5h4v15h-4z"/><path d="m16.2 5.2 3.8-1 3 14.6-3.8 1z" transform="translate(-2 0)"/>';
    M['🕋'] = 'kaaba'; M['🌠'] = 'moonstar'; M['💧'] = 'drop'; M['🚪'] = 'door'; M['⛰'] = 'mountain'; M['🌸'] = 'flower'; M['🧾'] = 'scroll'; M['🔰'] = 'layers'; M['📚'] = 'library'; M['⏰'] = 'clock';
    D.install = D.download;
    var BACK_CLS = 'back';
    function sprite() {
        if (document.getElementById('v106Sprite'))
            return;
        var s = '<svg id="v106Sprite" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>';
        Object.keys(D).forEach(function (k) { s += '<symbol id="i-' + k + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + D[k] + '</symbol>'; });
        s += '</defs></svg>';
        var d = document.createElement('div');
        d.innerHTML = s;
        document.body.insertBefore(d.firstChild, document.body.firstChild);
    }
    function icon(name, extra) {
        if (!D[name])
            return '';
        return '<svg class="vi vi-' + name + (extra ? ' ' + extra : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
    }
    window.v106Icon = icon;
    window.v106Icons = D;
    var RX = /(?:[←-⇿⌀-⏿■-◿☀-➿⬀-⯿ℹⓂ⤴⤵〰〽]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[︎️]?(?:‍(?:[←-⇿⌀-➿⬀-⯿]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[︎️]?)*|[\uD83C][\uDFFB-\uDFFF]/g;
    var RX1 = new RegExp(RX.source);
    function norm(e) { return e.replace(/[︎️]/g, '').replace(/[\uD83C][\uDFFB-\uDFFF]/g, ''); }
    function lookup(e) { var n = norm(e); if (M[n])
        return M[n]; var f = Array.from(n)[0]; return M[f] || null; }
    var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, OPTION: 1, TITLE: 1, NOSCRIPT: 1, SVG: 1, svg: 1, INPUT: 1, CODE: 1 };
    function strip(s) { return s.replace(RX, '').replace(/ {2,}/g, ' '); }
    function sweepText(tn) {
        var s = tn.nodeValue;
        if (!s || !RX1.test(s))
            return;
        var p = tn.parentNode;
        if (!p || SKIP[p.nodeName] || (p.closest && p.closest('[data-noicon]')))
            return;
        var isBack = p.nodeType === 1 && p.classList && p.classList.contains(BACK_CLS);
        if (isBack && /^\s*[←→]\s*$/.test(s)) {
            var sp = document.createElement('span');
            sp.innerHTML = icon('back');
            p.replaceChild(sp.firstChild, tn);
            return;
        }
        var frag = document.createDocumentFragment(), last = 0, m;
        RX.lastIndex = 0;
        var any = false;
        while ((m = RX.exec(s))) {
            var nm = lookup(m[0]);
            if (m.index > last)
                frag.appendChild(document.createTextNode(s.slice(last, m.index)));
            if (nm) {
                var t = document.createElement('span');
                var fill = /[★⭐🌟]/.test(m[0]) ? 'vi-fill' : '';
                t.innerHTML = icon(nm, (nm === 'loader' ? 'vi-spin ' : '') + fill);
                frag.appendChild(t.firstChild);
                any = true;
            }
            last = m.index + m[0].length;
        }
        if (last < s.length)
            frag.appendChild(document.createTextNode(s.slice(last)));
        p.replaceChild(frag, tn);
    }
    function sweep(root) {
        if (!root)
            return;
        if (root.nodeType === 3) {
            sweepText(root);
            return;
        }
        if (root.nodeType !== 1 || SKIP[root.nodeName])
            return;
        var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var v = n.nodeValue; return (v && RX1.test(v)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; } });
        var list = [], n;
        while ((n = w.nextNode()))
            list.push(n);
        for (var i = 0; i < list.length; i++)
            sweepText(list[i]);
        var els = root.querySelectorAll ? root.querySelectorAll('[placeholder],[title],[aria-label]') : [];
        for (var j = 0; j < els.length; j++) {
            ['placeholder', 'title', 'aria-label'].forEach(function (a) { var v = els[j].getAttribute(a); if (v && RX1.test(v))
                els[j].setAttribute(a, strip(v).trim()); });
        }
        var opts = root.querySelectorAll ? root.querySelectorAll('option') : [];
        for (var k = 0; k < opts.length; k++) {
            var o = opts[k];
            if (RX1.test(o.textContent))
                o.textContent = strip(o.textContent).trim();
        }
    }
    window.v106Sweep = sweep;
    var q = [], sched = false;
    function flush() {
        sched = false;
        var items = q;
        q = [];
        for (var i = 0; i < items.length; i++) {
            var n = items[i];
            if (n.isConnected)
                sweep(n);
        }
    }
    function queue(n) { q.push(n); if (!sched) {
        sched = true;
        (window.requestAnimationFrame || setTimeout)(flush);
    } }
    function start() {
        sprite();
        try {
            if (RX1.test(document.title))
                document.title = strip(document.title).trim();
        }
        catch (e) { }
        var pages = [].slice.call(document.querySelectorAll('.page,.top,.nav,#v101Dock,#globalMiniPlayer'));
        var act = document.querySelector('.page.active');
        if (act) {
            sweep(act);
        }
        var i = 0;
        (function step() { var t = Date.now(); while (i < pages.length && Date.now() - t < 8) {
            sweep(pages[i++]);
        } if (i < pages.length)
            setTimeout(step, 16); })();
        try {
            new MutationObserver(function (ms) {
                for (var a = 0; a < ms.length; a++) {
                    var m = ms[a];
                    if (m.type === 'characterData') {
                        if (m.target.parentNode && RX1.test(m.target.nodeValue || ''))
                            queue(m.target);
                    }
                    else
                        for (var b = 0; b < m.addedNodes.length; b++) {
                            var n = m.addedNodes[b];
                            if (n.nodeType === 3) {
                                if (RX1.test(n.nodeValue || ''))
                                    queue(n);
                            }
                            else if (n.nodeType === 1 && n.id !== 'v106Sprite')
                                queue(n);
                        }
                }
            }).observe(document.body, { childList: true, subtree: true, characterData: true });
        }
        catch (e) { }
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', start);
    else
        start();
})();
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var LG = function (k, d) { try {
        var v = localStorage.getItem(k);
        return v == null ? d : v;
    }
    catch (e) {
        return d;
    } };
    var LS_ = function (k, v) { try {
        localStorage.setItem(k, v);
    }
    catch (e) { } };
    var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var ic = function (n, c) { return window.v106Icon ? window.v106Icon(n, c) : ''; };
    var DLP = 'quran-m09-download:', META = 'quran-m09-download-meta:';
    var REC_KEY = 'muslim-v106-rec', DLR_KEY = 'muslim-v106-dlr';
    var all114 = Array.from({ length: 114 }, function (_, i) { return i + 1; });
    var rng = function (a, b) { var o = []; for (var i = a; i <= b; i++)
        o.push(i); return o; };
    var AR = 'حفص عن عاصم - مرتل', KH = 'خلف عن حمزة - رواية خلاد';
    var QL = 'قالون عن نافع';
    var EXTRA = [
        { id: 'ia-masad', name: 'عبد الرحمن مسعد', rewaya: AR, server: 'https://archive.org/download/010_20221110/', surahList: [10, 19, 23, 29, 32, 49, 73, 78, 87, 88, 100, 107], search: ['عبد الرحمن مسعد', 'عبدالرحمن مسعد'] },
        { id: 'ia-abbadi', name: 'حسام الدين عبادي', rewaya: AR, server: 'https://archive.org/download/Abbadi-Houssem-Eddine/', surahList: [1, 12, 14, 15, 17, 18, 19, 31, 32, 36, 38, 44, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 72, 74, 75, 76, 77, 78, 81, 85, 86, 88, 93, 99], search: ['حسام الدين عبادي', 'حسام عبادي'] },
        { id: 'ia-khedr', name: 'أحمد خضر', rewaya: AR, server: 'https://archive.org/download/012_20221105_202211/', surahList: [1, 7, 12, 15, 18, 19, 20, 21, 22, 24, 25, 27, 29, 30, 31, 32, 36, 38, 43, 44, 45, 46, 47, 48, 49, 52, 53, 54, 55, 56, 61, 64, 67, 68, 69, 70, 71, 72, 75, 76, 78, 79, 80, 81, 83, 84, 86, 88, 89, 90, 91, 97, 110], search: ['أحمد خضر', 'احمد خضر'] },
        { id: 'ia-musalati', name: 'نور الدين المسلاتي', rewaya: QL, server: 'https://archive.org/download/20230906/', surahList: [2, 6, 7, 8, 11, 12, 14, 17, 18, 19, 20, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43, 44, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 60, 61, 62, 63, 64, 67, 70, 71, 72, 73, 76, 77, 87, 98, 109, 112, 113, 114], search: ['نور الدين المسلاتي', 'نورالدين المسلاتي', 'المسلاتي'] },
        { id: 'ia-baji', name: 'صلاح الباجي', rewaya: QL, server: 'https://archive.org/download/Salah-Al-Baji/', surahList: [8, 12, 15, 18, 19, 32, 46, 50, 54, 63, 71, 73, 74, 75, 76, 79, 82, 83, 87, 90, 98, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114], search: ['صلاح الباجي', 'صلاح باجي'] },
        { id: 'ia-saltani', name: 'مفتاح السلطني', rewaya: KH, server: 'https://archive.org/download/khalladsaltani/', surahList: rng(1, 79), search: ['مفتاح السلطني'] },
        { id: 'ia-ynouh', name: 'يوسف نوح أحمد', rewaya: KH, server: 'https://archive.org/download/reeding-of--khallad-an--hamzah----------------by_______yousef-nouh-ahmad-mp3--/Khallad_', surahList: rng(3, 57), search: ['يوسف نوح أحمد'] },
        { id: 'qa-0', name: 'نبيل الرفاعي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/nabil_rifa3i/', surahList: rng(1, 114), search: ['نبيل الرفاعي'] },
        { id: 'qa-1', name: 'عبد المحسن القاسم', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdul_muhsin_alqasim/', surahList: rng(1, 114), search: ['عبد المحسن القاسم'] },
        { id: 'qa-2', name: 'فارس عباد', rewaya: AR, server: 'https://download.quranicaudio.com/quran/fares/', surahList: rng(1, 114), search: ['فارس عباد'] },
        { id: 'qa-3', name: 'عبد الباري الثبيتي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/thubaity/', surahList: rng(1, 114), search: ['عبد الباري الثبيتي'] },
        { id: 'qa-4', name: 'سهل ياسين', rewaya: AR, server: 'https://download.quranicaudio.com/quran/sahl_yaaseen/', surahList: rng(1, 114), search: ['سهل ياسين'] },
        { id: 'qa-5', name: 'صلاح بو خاطر', rewaya: AR, server: 'https://download.quranicaudio.com/quran/salaah_bukhaatir/', surahList: rng(1, 114), search: ['صلاح بو خاطر'] },
        { id: 'qa-6', name: 'أحمد بن علي العجمي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ahmed_ibn_3ali_al-3ajamy/', surahList: rng(1, 114), search: ['أحمد بن علي العجمي'] },
        { id: 'qa-7', name: 'عبد العزيز الأحمد', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulazeez_al-ahmad/', surahList: rng(1, 114), search: ['عبد العزيز الأحمد'] },
        { id: 'qa-8', name: 'محمد أيوب', rewaya: AR, server: 'https://download.quranicaudio.com/quran/muhammad_ayyoob/', surahList: rng(1, 114), search: ['محمد أيوب'] },
        { id: 'qa-9', name: 'توفيق الصائغ', rewaya: AR, server: 'https://download.quranicaudio.com/quran/tawfeeq_bin_saeed-as-sawaaigh/', surahList: rng(1, 114), search: ['توفيق الصائغ'] },
        { id: 'qa-10', name: 'محمد المحيسني', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mehysni/', surahList: rng(1, 114), search: ['محمد المحيسني'] },
        { id: 'qa-11', name: 'هاني الرفاعي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/rifai/', surahList: rng(1, 114), search: ['هاني الرفاعي'] },
        { id: 'qa-12', name: 'إبراهيم الجبرين', rewaya: AR, server: 'https://download.quranicaudio.com/quran/jibreen/', surahList: rng(1, 114), search: ['إبراهيم الجبرين'] },
        { id: 'qa-13', name: 'صالح الطالب', rewaya: AR, server: 'https://download.quranicaudio.com/quran/saleh_al_taleb/', surahList: rng(1, 114), search: ['صالح الطالب'] },
        { id: 'qa-14', name: 'عبد الودود حنيف', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulwadood_haneef/', surahList: rng(1, 114), search: ['عبد الودود حنيف'] },
        { id: 'qa-15', name: 'صلاح البدير', rewaya: AR, server: 'https://download.quranicaudio.com/quran/salahbudair/', surahList: rng(1, 114), search: ['صلاح البدير'] },
        { id: 'qa-16', name: 'عزيز عليلي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/aziz_alili/', surahList: rng(1, 114), search: ['عزيز عليلي'] },
        { id: 'qa-17', name: 'محمد اللحيدان', rewaya: AR, server: 'https://download.quranicaudio.com/quran/muhammad_alhaidan/', surahList: rng(1, 114), search: ['محمد اللحيدان'] },
        { id: 'qa-18', name: 'حمد سنان', rewaya: AR, server: 'https://download.quranicaudio.com/quran/hamad_sinan/', surahList: rng(1, 114), search: ['حمد سنان'] },
        { id: 'qa-19', name: 'عبد الرزاق الدليمي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulrazaq_bin_abtan_al_dulaimi/', surahList: rng(1, 114), search: ['عبد الرزاق الدليمي'] },
        { id: 'qa-20', name: 'محمد عبد الكريم', rewaya: AR, server: 'https://download.quranicaudio.com/quran/muhammad_abdulkareem/', surahList: rng(1, 114), search: ['محمد عبد الكريم'] },
        { id: 'qa-21', name: 'مصطفى العزاوي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mustafa_al3azzawi/', surahList: rng(1, 114), search: ['مصطفى العزاوي'] },
        { id: 'qa-22', name: 'عبد الله خياط', rewaya: AR, server: 'https://download.quranicaudio.com/quran/khayat/', surahList: rng(1, 114), search: ['عبد الله خياط'] },
        { id: 'qa-23', name: 'صلاح الهاشم', rewaya: AR, server: 'https://download.quranicaudio.com/quran/salah_alhashim/', surahList: rng(1, 114), search: ['صلاح الهاشم'] },
        { id: 'qa-24', name: 'عادل الكلباني', rewaya: AR, server: 'https://download.quranicaudio.com/quran/adel_kalbani/', surahList: rng(1, 114), search: ['عادل الكلباني'] },
        { id: 'qa-25', name: 'حاتم فريد', rewaya: AR, server: 'https://download.quranicaudio.com/quran/hatem_farid/collection/', surahList: rng(1, 114), search: ['حاتم فريد'] },
        { id: 'qa-26', name: 'مصطفى إسماعيل', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mostafa_ismaeel/', surahList: rng(1, 114), search: ['مصطفى إسماعيل'] },
        { id: 'qa-27', name: 'محمد الطبلاوي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mohammad_altablawi/', surahList: rng(1, 114), search: ['محمد الطبلاوي'] },
        { id: 'qa-28', name: 'محمد إسماعيل المقدم', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mohammad_ismaeel_almuqaddim/', surahList: rng(1, 114), search: ['محمد إسماعيل المقدم'] },
        { id: 'qa-29', name: 'عماد زهير حافظ', rewaya: AR, server: 'https://download.quranicaudio.com/quran/imad_zuhair_hafez/', surahList: rng(1, 114), search: ['عماد زهير حافظ'] },
        { id: 'qa-30', name: 'ياسر الدوسري', rewaya: AR, server: 'https://download.quranicaudio.com/quran/yasser_ad-dussary/', surahList: rng(1, 114), search: ['ياسر الدوسري'] },
        { id: 'qa-31', name: 'إبراهيم الأخضر', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ibrahim_al_akhdar/', surahList: rng(1, 114), search: ['إبراهيم الأخضر'] },
        { id: 'qa-32', name: 'ناصر القطامي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/nasser_bin_ali_alqatami/', surahList: rng(1, 114), search: ['ناصر القطامي'] },
        { id: 'qa-33', name: 'خالد الغامدي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/khalid_alghamdi/', surahList: rng(1, 114), search: ['خالد الغامدي'] },
        { id: 'qa-34', name: 'عبد الكريم الحازمي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulkareem_al_hazmi/', surahList: rng(1, 114), search: ['عبد الكريم الحازمي'] },
        { id: 'qa-35', name: 'عبد المنعم عبد المبدي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulmun3im_abdulmubdi2/', surahList: rng(1, 114), search: ['عبد المنعم عبد المبدي'] },
        { id: 'qa-36', name: 'أحمد الحذيفي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ahmad_alhuthayfi/', surahList: rng(1, 114), search: ['أحمد الحذيفي'] },
        { id: 'qa-37', name: 'إدريس أبكر', rewaya: AR, server: 'https://download.quranicaudio.com/quran/idrees_abkar/', surahList: rng(1, 114), search: ['إدريس أبكر'] },
        { id: 'qa-38', name: 'بندر بليلة', rewaya: AR, server: 'https://download.quranicaudio.com/quran/bandar_baleela/complete/', surahList: rng(1, 114), search: ['بندر بليلة'] },
        { id: 'qa-39', name: 'محمد خليل', rewaya: AR, server: 'https://download.quranicaudio.com/quran/muhammad_khaleel/', surahList: rng(1, 114), search: ['محمد خليل'] },
        { id: 'qa-40', name: 'عبد الله مطرود', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdullah_matroud/', surahList: rng(1, 114), search: ['عبد الله مطرود'] },
        { id: 'qa-41', name: 'أحمد نعينع', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ahmad_nauina/', surahList: rng(1, 114), search: ['أحمد نعينع'] },
        { id: 'qa-42', name: 'أكرم العلاقمي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/akram_al_alaqmi/', surahList: rng(1, 114), search: ['أكرم العلاقمي'] },
        { id: 'qa-43', name: 'علي حجاج السويسي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ali_hajjaj_alsouasi/', surahList: rng(1, 114), search: ['علي حجاج السويسي'] },
        { id: 'qa-44', name: 'محمود علي البنا', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mahmood_ali_albana/', surahList: rng(1, 114), search: ['محمود علي البنا'] },
        { id: 'qa-45', name: 'وديع اليمني', rewaya: AR, server: 'https://download.quranicaudio.com/quran/wadee_hammadi_al-yamani/', surahList: rng(1, 114), search: ['وديع اليمني'] },
        { id: 'qa-46', name: 'عاصم عبد العليم', rewaya: AR, server: 'https://download.quranicaudio.com/quran/asim_abdulaleem/', surahList: rng(1, 114), search: ['عاصم عبد العليم'] },
        { id: 'qa-47', name: 'خليفة الطنيجي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/khalifah_taniji/', surahList: rng(1, 114), search: ['خليفة الطنيجي'] },
        { id: 'qa-48', name: 'عبد الرحمن الشحات', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulrahman_al_shahat/', surahList: rng(1, 114), search: ['عبد الرحمن الشحات'] },
        { id: 'qa-49', name: 'عبد العزيز الزهراني', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulaziz_bin_saleh_alzahrani/', surahList: rng(1, 114), search: ['عبد العزيز الزهراني'] },
        { id: 'qa-50', name: 'أبو بكر الشاطري', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abu_bakr_ash-shaatree/', surahList: rng(1, 114), search: ['أبو بكر الشاطري'] },
        { id: 'qa-51', name: 'سعد الغامدي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/sa3d_al-ghaamidi/complete/', surahList: rng(1, 114), search: ['سعد الغامدي'] },
        { id: 'qa-52', name: 'عبد الرشيد صوفي (السوسي)', rewaya: 'السوسي عن أبي عمرو', server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi_soosi_rec/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (السوسي)'] },
        { id: 'qa-53', name: 'عبد الرشيد صوفي (خلف)', rewaya: 'خلف عن حمزة', server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi_-_khalaf_3an_7amza_recitation/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (خلف)'] },
        { id: 'qa-54', name: 'عبد الرشيد صوفي (الدوري)', rewaya: 'الدوري عن أبي عمرو', server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi_doori/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (الدوري)'] },
        { id: 'qa-55', name: 'عبد الرشيد صوفي (شعبة)', rewaya: 'شعبة عن عاصم', server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi_shu3ba/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (شعبة)'] },
        { id: 'qa-56', name: 'عبد الرشيد صوفي (الكسائي)', rewaya: 'أبو الحارث عن الكسائي', server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi_abi_al7arith/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (الكسائي)'] },
        { id: 'qa-57', name: 'علي الحذيفي (قالون)', rewaya: QL, server: 'https://download.quranicaudio.com/quran/huthayfi_qaloon/', surahList: rng(1, 114), search: ['علي الحذيفي (قالون)'] },
        { id: 'qa-58', name: 'محمود خليل الحصري (الدوري)', rewaya: 'الدوري عن أبي عمرو', server: 'https://download.quranicaudio.com/quran/mahmood_khaleel_al-husaree_doori/', surahList: rng(1, 114), search: ['محمود خليل الحصري (الدوري)'] },
        { id: 'qa-59', name: 'عبد الباسط عبد الصمد (ورش)', rewaya: 'ورش عن نافع', server: 'https://download.quranicaudio.com/quran/abdulbaset_warsh/', surahList: rng(1, 114), search: ['عبد الباسط عبد الصمد (ورش)'] },
        { id: 'qa-60', name: 'نورين محمد صديق (الدوري)', rewaya: 'الدوري عن أبي عمرو', server: 'https://download.quranicaudio.com/quran/noreen_siddiq/', surahList: rng(1, 114), search: ['نورين محمد صديق (الدوري)'] },
        { id: 'qa-100', name: 'محمد حسان', rewaya: AR, server: 'https://download.quranicaudio.com/quran/mu7ammad_7assan/', surahList: rng(1, 114), search: ['محمد حسان'] },
        { id: 'qa-101', name: 'عبد الله علي جابر', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ali_jaber/', surahList: rng(1, 114), search: ['عبد الله علي جابر'] },
        { id: 'qa-102', name: 'ماهر المعيقلي (1440)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/maher_almu3aiqly/year1440/', surahList: rng(1, 114), search: ['ماهر المعيقلي (1440)'] },
        { id: 'qa-103', name: 'عبد الرشيد صوفي (حفص)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (حفص)'] },
        { id: 'qa-104', name: 'عبد الرشيد صوفي (السوسي 2020)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdurrashid_sufi_soosi_2020/', surahList: rng(1, 114), search: ['عبد الرشيد صوفي (السوسي 2020)'] },
        { id: 'qa-105', name: 'عبد الله عبدل', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdallah_abdal/', surahList: rng(1, 114), search: ['عبد الله عبدل'] },
        { id: 'qa-106', name: 'محمد سليمان باتيل', rewaya: AR, server: 'https://download.quranicaudio.com/quran/muhammad_patel/', surahList: rng(1, 114), search: ['محمد سليمان باتيل'] },
        { id: 'qa-107', name: 'محمود خليل الحصري (المعلّم)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/husary_muallim/', surahList: rng(1, 114), search: ['محمود خليل الحصري (المعلّم)'] },
        { id: 'qa-108', name: 'محمود خليل الحصري (مجوّد)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/generated/husary_mujawwad/', surahList: rng(1, 114), search: ['محمود خليل الحصري (مجوّد)'] },
        { id: 'qa-109', name: 'الحسيني العزازي (مع الأطفال)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/alhusaynee_al3azazee_with_children/', surahList: rng(1, 114), search: ['الحسيني العزازي (مع الأطفال)'] },
        { id: 'qa-110', name: 'د. شوقي حامد (مرتّل)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/dr.shawqy_7amed/murattal/', surahList: rng(1, 114), search: ['د. شوقي حامد (مرتّل)'] },
        { id: 'qa-111', name: 'د. شوقي حامد (مجوّد)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/dr.shawqy_7amed/mujawwad/', surahList: rng(1, 114), search: ['د. شوقي حامد (مجوّد)'] },
        { id: 'qa-112', name: 'محمد صديق المنشاوي (مجوّد)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/minshawi_mujawwad/', surahList: rng(1, 114), search: ['محمد صديق المنشاوي (مجوّد)'] },
        { id: 'qa-113', name: 'عبد الباسط عبد الصمد (مجوّد)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdulbaset_mujawwad/', surahList: rng(1, 114), search: ['عبد الباسط عبد الصمد (مجوّد)'] },
        { id: 'qa-114', name: 'عبد الباسط عبد الصمد (مرتّل)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdul_basit_murattal/', surahList: rng(1, 114), search: ['عبد الباسط عبد الصمد (مرتّل)'] },
        { id: 'qa-115', name: 'محمد جبريل', rewaya: AR, server: 'https://download.quranicaudio.com/quran/muhammad_jibreel/complete/', surahList: rng(1, 114), search: ['محمد جبريل'] },
        { id: 'qa-116', name: 'عبد الله علي جابر (استوديو)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/abdullaah_alee_jaabir_studio/', surahList: rng(1, 114), search: ['عبد الله علي جابر (استوديو)'] }
        ,{ id: 'qa-200', name: 'بدر التركي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/badr_al_turki/mp3/', surahList: rng(1, 114), search: ['بدر التركي'] }
        ,{ id: 'qa-201', name: 'أحمد طاهون', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ahmad_tahoun/mp3/', surahList: rng(1, 114), search: ['أحمد طاهون'] }
        ,{ id: 'qa-202', name: 'رعد محمد الكردي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/raad_mohammad_al_kurdi/mp3/', surahList: rng(1, 114), search: ['رعد محمد الكردي'] }
        ,{ id: 'qa-203', name: 'بيشوا قادر الكردي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/peshawa_qadir_al-kurdi/mp3/', surahList: rng(1, 114), search: ['بيشوا قادر الكردي'] }
        ,{ id: 'qa-204', name: 'فرمان شواني', rewaya: AR, server: 'https://download.quranicaudio.com/quran/farman_shawani/mp3/', surahList: rng(1, 114), search: ['فرمان شواني'] }
        ,{ id: 'qa-205', name: 'عليجون قاري', rewaya: AR, server: 'https://download.quranicaudio.com/quran/alijon_qari/mp3/', surahList: rng(1, 114), search: ['عليجون قاري'] }
        ,{ id: 'qa-206', name: 'بندر بليلة', rewaya: AR, server: 'https://download.quranicaudio.com/quran/bandar_baleela/', surahList: rng(1, 114), search: ['بندر بليلة'] }
        ,{ id: 'qa-207', name: 'صداقت علي', rewaya: AR, server: 'https://download.quranicaudio.com/quran/sadaqat_ali/', surahList: rng(1, 114), search: ['صداقت علي'] }
        ,{ id: 'qa-208', name: 'الحصري مع الأطفال (معلّم)', rewaya: AR, server: 'https://download.quranicaudio.com/quran/husary_muallim_kids_repeat/', surahList: rng(1, 114), search: ['الحصري مع الأطفال (معلّم)'] }
        ,{ id: 'qa-209', name: 'إبراهيم ووك', rewaya: AR, server: 'https://download.quranicaudio.com/quran/ibrahim_walk/', surahList: rng(1, 114), search: ['إبراهيم ووك'] }
    ];
    EXTRA.forEach(function (r) { r.edition = 'mp3quran'; r.ext = 1; });
    window.V106_EXTRA = EXTRA;
    function purgeOld() {
        if (LG('muslim-v106-purged', '0') === '1')
            return;
        var keys = [];
        try {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && (k.indexOf(DLP + 'x-') === 0 || k.indexOf(META + DLP + 'x-') === 0))
                    keys.push(k);
            }
        }
        catch (e) { }
        var idbDel = [];
        keys.forEach(function (k) { if (k.indexOf(META) !== 0)
            idbDel.push(k); try {
            localStorage.removeItem(k);
        }
        catch (e) { } });
        if (idbDel.length)
            openDB().then(function (db) { var tx = db.transaction('audio', 'readwrite'); idbDel.forEach(function (k) { tx.objectStore('audio').delete(k); }); tx.oncomplete = function () { db.close(); }; }).catch(function () { });
        try {
            var f = JSON.parse(LG('quran-m09-favorites-v26', 'null'));
            if (f && f.readers) {
                f.readers = f.readers.filter(function (r) { return String(r.id).indexOf('x-') !== 0; });
                LS_('quran-m09-favorites-v26', JSON.stringify(f));
            }
        }
        catch (e) { }
        LS_('muslim-v106-purged', '1');
    }
    function openDB() { return new Promise(function (res, rej) { var r = indexedDB.open('quran-m09-offline-v2', 1); r.onupgradeneeded = function () { r.result.createObjectStore('audio'); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; }); }
    function idbKeys() { return openDB().then(function (db) { return new Promise(function (res, rej) { var q = db.transaction('audio', 'readonly').objectStore('audio').getAllKeys(); q.onsuccess = function () { db.close(); res(q.result || []); }; q.onerror = function () { db.close(); rej(q.error); }; }); }); }
    function idbDel(k) { return openDB().then(function (db) { return new Promise(function (res, rej) { var tx = db.transaction('audio', 'readwrite'); tx.objectStore('audio').delete(k); tx.oncomplete = function () { db.close(); res(); }; tx.onerror = function () { db.close(); rej(tx.error); }; }); }); }
    function idbSize(k) { return openDB().then(function (db) { return new Promise(function (res) { var q = db.transaction('audio', 'readonly').objectStore('audio').get(k); q.onsuccess = function () { db.close(); res(q.result && q.result.size || 0); }; q.onerror = function () { db.close(); res(0); }; }); }).catch(function () { return 0; }); }
    function snapshot(list) {
        try {
            var a = list.filter(function (r) { return !r.ext; }).map(function (r) { return [r.id, r.mp3Id || 0, r.name, r.server, r.moshafId || 0, (r.surahList && r.surahList.length === 114) ? '*' : (r.surahList || []).join(','), r.rewaya || '']; });
            LS_(REC_KEY, JSON.stringify({ t: Date.now(), v: 2, a: a }));
        }
        catch (e) { }
    }
    function fromSnapshot() {
        try {
            var j = JSON.parse(LG(REC_KEY, 'null'));
            if (!j || j.v !== 2 || !j.a || !j.a.length)
                return null;
            return { t: j.t, list: j.a.map(function (x) { return { id: x[0], mp3Id: x[1] || undefined, name: x[2], edition: 'mp3quran', server: x[3], moshafId: x[4], surahList: x[5] === '*' ? all114 : String(x[5]).split(',').filter(Boolean).map(Number), rewaya: x[6] || 'رواية غير محددة', search: [x[2], x[6]] }; }) };
        }
        catch (e) {
            return null;
        }
    }
    function build(rs) {
        var out = [];
        rs.forEach(function (r) {
            (r.moshaf || []).forEach(function (m) {
                if (!m || !m.server)
                    return;
                out.push({ id: 'mp3-' + r.id + '-' + m.id, mp3Id: r.id, name: r.name, edition: 'mp3quran', server: String(m.server).replace(/^http:\/\//i, 'https://'), moshafId: m.id, surahList: String(m.surah_list || '').split(',').filter(Boolean).map(Number), rewaya: m.name || 'رواية غير محددة', search: [r.name, m.name || ''] });
            });
        });
        out.sort(function (a, b) { return a.name.localeCompare(b.name, 'ar') || a.rewaya.localeCompare(b.rewaya, 'ar'); });
        return out;
    }
    function finalize(list) {
        var nk = function (t) { return String(t || '').replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\bال/g, '').replace(/\s+/g, ''); };
        var have = {}; list.forEach(function (r) { have[nk(r.name)] = 1; });
        var ex = EXTRA.filter(function (x) { return !/^qa-/.test(x.id) || !have[nk(x.name)]; }).map(function (x) { return Object.assign({}, x); });
        var all = list.concat(ex);
        all.sort(function (a, b) { return String(a.name).localeCompare(String(b.name), 'ar') || String(a.rewaya).localeCompare(String(b.rewaya), 'ar'); });
        RECITERS.splice.apply(RECITERS, [0, RECITERS.length].concat(all));
    }
    var curReaderId = null;
    function renderAfterLoad() {
        try {
            buildReaderFilters();
        }
        catch (e) { }
        try {
            loadReciterCards(($('readerSearch') || {}).value || '');
        }
        catch (e) { }
        try {
            if (typeof initRepeatAyah === 'function')
                initRepeatAyah();
        }
        catch (e) { }
        decorateCards();
    }
    var loading = null;
    function fetchReciters() {
        var ctl = new AbortController(), t = setTimeout(function () { ctl.abort(); }, 15000);
        return fetch('https://www.mp3quran.net/api/v3/reciters?language=ar', { signal: ctl.signal }).then(function (r) { clearTimeout(t); if (!r.ok)
            throw new Error('http'); return r.json(); }).then(function (j) { return j.reciters || []; });
    }
    function loadRec(force) {
        if (loading)
            return loading;
        var snap = fromSnapshot(), host = $('readerList');
        if (snap) {
            finalize(snap.list);
            renderAfterLoad();
        }
        else if (host)
            host.innerHTML = '<div class="notice">' + ic('loader', 'vi-spin') + ' جارٍ تحميل القرّاء والروايات…</div>';
        var stale = !snap || force || (Date.now() - snap.t > 12 * 3600e3);
        if (!stale) {
            loading = Promise.resolve();
            return loading;
        }
        var go = function () {
            return fetchReciters().then(function (rs) { var l = build(rs); if (l.length > 20) {
                snapshot(l);
                finalize(l);
                renderAfterLoad();
            } })
                .catch(function () { if (!snap) {
                finalize([]);
                renderAfterLoad();
                if (host)
                    host.insertAdjacentHTML('afterbegin', '<div class="notice">' + ic('wifioff') + ' تعذّر تحميل بقية القرّاء. تحقق من الاتصال ثم <button type="button" class="primary" onclick="loadReciters(true)">أعد المحاولة</button></div>');
            } })
                .then(function () { loading = null; });
        };
        loading = snap ? new Promise(function (res) { (window.requestIdleCallback || function (f) { setTimeout(f, 2500); })(function () { go().then(res); }, { timeout: 6000 }); }) : go();
        return loading;
    }
    window.loadReciters = function (force) { return loadRec(force === true); };
    if (!fromSnapshot())
        finalize([]);
    var DL = new Set(), DLSIZE = {};
    function dlKey(rid, n) { return DLP + rid + ':' + n; }
    function refreshDL() {
        return idbKeys().then(function (ks) {
            DL = new Set(ks.map(String).filter(function (k) { return k.indexOf(DLP) === 0; }));
            try {
                renderSongs(($('songSearch') || {}).value || '');
            }
            catch (e) { }
            decorateCards();
            decorateProfile();
        }).catch(function () { });
    }
    window.isDownloaded = function (num) { return typeof currentReader !== 'undefined' && !!currentReader && DL.has(dlKey(currentReader.id, num)); };
    function readerObj(rid) {
        var r = RECITERS.find(function (x) { return String(x.id) === String(rid); });
        if (r)
            return r;
        try {
            var m = JSON.parse(LG(DLR_KEY, '{}'));
            if (m[rid])
                return m[rid];
        }
        catch (e) { }
        var mm = /^mp3-(\d+)-(\d+)$/.exec(String(rid));
        if (mm) {
            r = RECITERS.find(function (x) { return String(x.mp3Id) === mm[1] && String(x.moshafId) === mm[2]; });
            if (r)
                return r;
        }
        return null;
    }
    function metaFor(key) {
        var rid = key.slice(DLP.length).split(':');
        var n = Number(rid.pop());
        rid = rid.join(':');
        var m = null;
        try {
            m = JSON.parse(LG(META + key, 'null'));
        }
        catch (e) { }
        var r = readerObj(rid);
        var name = (m && m.readerName && m.readerName !== 'القارئ' && !/^mp3-/i.test(m.readerName) && m.readerName) || (r && r.name) || 'قارئ محفوظ';
        var rw = (m && m.readerRewaya) || (r && r.rewaya) || '';
        var sn = (m && m.surahName) || (typeof S !== 'undefined' && S[n - 1]) || ('سورة ' + n);
        return { key: key, rid: rid, n: n, reader: name, rewaya: rw, surah: sn };
    }
    var _fd = window.finishDownload;
    window.finishDownload = async function (task) {
        var rc = currentReader;
        var r = await _fd.apply(this, arguments);
        try {
            if (rc) {
                var m = JSON.parse(LG(DLR_KEY, '{}'));
                m[rc.id] = { id: rc.id, name: rc.name, rewaya: rc.rewaya || '', server: rc.server || '', surahList: rc.surahList || [], edition: rc.edition || 'mp3quran', mp3Id: rc.mp3Id || '', moshafId: rc.moshafId || '', search: rc.search || [rc.name] };
                LS_(DLR_KEY, JSON.stringify(m));
                DL.add(dlKey(rc.id, task.num));
                try {
                    if (navigator.storage && navigator.storage.persist)
                        navigator.storage.persist();
                }
                catch (e) { }
            }
        }
        catch (e) { }
        refreshDL();
        return r;
    };
    var _ds = window.downloadSurah;
    window.downloadSurah = function (num) {
        if (!navigator.onLine) {
            var st = $('downloadStatus');
            if (st) {
                st.style.display = 'block';
                st.innerHTML = ic('wifioff') + ' لا يوجد اتصال بالإنترنت الآن — التحميل يحتاج اتصالًا.';
            }
            return;
        }
        return _ds.apply(this, arguments);
    };
    window.v106DelSurah = function (num) {
        if (!currentReader)
            return;
        if (!confirm('حذف «' + (S[num - 1] || num) + '» المحمّلة من هذا الجهاز؟'))
            return;
        var k = dlKey(currentReader.id, num);
        idbDel(k).then(function () { try {
            localStorage.removeItem(k);
            localStorage.removeItem(META + k);
        }
        catch (e) { } DL.delete(k); renderSongs(($('songSearch') || {}).value || ''); decorateProfile(); decorateCards(); });
    };
    window.renderSongs = function (q) {
        q = q || '';
        var host = $('songList');
        if (!host || typeof currentReader === 'undefined' || !currentReader)
            return;
        var avail = new Set(currentReader.surahList && currentReader.surahList.length ? currentReader.surahList : all114);
        var h = '';
        for (var i = 0; i < S.length; i++) {
            var n = i + 1;
            if (!avail.has(n) || (q && S[i].indexOf(q) < 0))
                continue;
            var d = DL.has(dlKey(currentReader.id, n));
            h += '<div class="listrow songRow' + (d ? ' isDl' : '') + '" onclick="playSurah(' + n + ')"><div class="rowMain"><span class="num">' + n + '</span><b>' + E(S[i]) + '</b>' + (d ? '<span class="dlTag">' + ic('checkc') + ' محمّلة</span>' : '') + '</div>'
                + '<button type="button" class="downloadBtn" onclick="event.stopPropagation();playSurah(' + n + ')">' + ic('play') + ' ' + (d ? 'تشغيل' : 'استماع') + '</button>'
                + (d ? '<button type="button" class="downloadBtn danger" onclick="event.stopPropagation();v106DelSurah(' + n + ')" aria-label="حذف التنزيل">' + ic('trash') + ' حذف</button>'
                    : '<button type="button" class="downloadBtn" onclick="event.stopPropagation();downloadSurah(' + n + ')">' + ic('download') + ' تحميل</button>') + '</div>';
        }
        host.innerHTML = h || '<div class="notice">لا توجد سورة مطابقة.</div>';
    };
    function decorateProfile() {
        var p = $('readerProfile');
        if (!p || typeof currentReader === 'undefined' || !currentReader)
            return;
        var n = 0;
        DL.forEach(function (k) { if (k.indexOf(DLP + currentReader.id + ':') === 0)
            n++; });
        var el = p.querySelector('.dlSummary');
        if (!n) {
            if (el)
                el.remove();
            return;
        }
        if (!el) {
            el = document.createElement('div');
            el.className = 'dlSummary';
            p.appendChild(el);
        }
        el.innerHTML = ic('checkc') + ' ' + n + ' سورة محمّلة لهذا القارئ — تعمل بلا إنترنت';
    }
    function decorateCards() {
        var by = {};
        DL.forEach(function (k) { var rid = k.slice(DLP.length).split(':').slice(0, -1).join(':'); by[rid] = (by[rid] || 0) + 1; });
        document.querySelectorAll('#readerList .reader').forEach(function (c) {
            var i = +c.getAttribute('data-reciter-index'), r = RECITERS[i];
            if (!r)
                return;
            var n = by[r.id], b = c.querySelector('.dlBadge');
            if (!n) {
                if (b)
                    b.remove();
                return;
            }
            if (!b) {
                b = document.createElement('span');
                b.className = 'dlBadge';
                c.appendChild(b);
            }
            b.innerHTML = ic('download') + ' ' + n + ' محمّلة';
        });
    }
    var _lrc = window.loadReciterCards;
    window.loadReciterCards = function () { var r = _lrc.apply(this, arguments); decorateCards(); return r; };
    var _or = window.openReader;
    window.openReader = async function () { var r = await _or.apply(this, arguments); decorateProfile(); return r; };
    var _ps = window.playSurah;
    window.playSurah = async function (num) {
        var a = $('audio');
        try {
            if (a && IOS && !a.getAttribute('src')) {
                a.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
                var pp = a.play();
                if (pp && pp.catch)
                    pp.catch(function () { });
            }
            if (!navigator.onLine && currentReader && !DL.has(dlKey(currentReader.id, num))) {
                var n = $('now');
                if (n)
                    n.textContent = 'لا يوجد اتصال — هذه السورة غير محمّلة. حمّلها عند توفر الإنترنت.';
                return;
            }
        }
        catch (e) { }
        return _ps.apply(this, arguments);
    };
    (function () {
        var a = $('audio');
        if (!a || a.__v106w)
            return;
        a.__v106w = 1;
        var tm = null;
        a.addEventListener('loadstart', function () {
            clearTimeout(tm);
            tm = setTimeout(function () {
                if (a.paused || a.readyState >= 3 || !a.currentSrc || /^(blob|data):/.test(a.currentSrc))
                    return;
                try {
                    a.dispatchEvent(new Event('error'));
                }
                catch (e) { }
            }, 9000);
        });
        ['playing', 'canplay', 'pause', 'emptied'].forEach(function (ev) { a.addEventListener(ev, function () { clearTimeout(tm); }); });
    })();
    (function () {
        var a = $('audio');
        if (!a || a.__v106)
            return;
        a.__v106 = 1;
        var tried = {};
        a.addEventListener('error', function () {
            var src = a.currentSrc || a.src;
            if (!src || /^(blob|data):/.test(src) || tried[src] || !navigator.onLine)
                return;
            tried[src] = 1;
            var n = $('now');
            if (n)
                n.textContent = 'إعادة المحاولة بطريقة بديلة…';
            fetch(src).then(function (r) { if (!r.ok)
                throw 0; return r.blob(); }).then(function (b) {
                if (window._v106Blob)
                    URL.revokeObjectURL(window._v106Blob);
                window._v106Blob = URL.createObjectURL(b);
                a.src = window._v106Blob;
                return a.play();
            }).then(function () { if (n && typeof S !== 'undefined')
                n.textContent = '▶ ' + S[currentSurah - 1]; }).catch(function () { if (n)
                n.textContent = 'تعذّر تشغيل هذه التلاوة الآن (المصدر لا يستجيب). جرّب لاحقًا أو قارئًا آخر.'; });
        });
    })();
    window.v106OpenReader = async function (rid, num) {
        var r = readerObj(rid);
        if (!r) {
            alert('بيانات هذا القارئ غير متاحة الآن.');
            return;
        }
        var i = RECITERS.findIndex(function (x) { return String(x.id) === String(r.id); });
        if (i < 0) {
            RECITERS.push(r);
            i = RECITERS.length - 1;
        }
        await openReader(i);
        if (num)
            setTimeout(function () { playSurah(num); }, 120);
    };
    function fmt(b) { if (!b)
        return ''; return b >= 1048576 ? (b / 1048576).toFixed(1) + ' م.ب' : Math.max(1, Math.round(b / 1024)) + ' ك.ب'; }
    window.v106RenderDownloads = async function () {
        var box = $('v103DlList');
        if (!box)
            return;
        box.innerHTML = '<div class="notice">' + ic('loader', 'vi-spin') + ' جارٍ قراءة التنزيلات…</div>';
        var keys = [];
        try {
            keys = (await idbKeys()).map(String).filter(function (k) { return k.indexOf(DLP) === 0; });
        }
        catch (e) { }
        DL = new Set(keys);
        var groups = {}, order = [];
        keys.forEach(function (k) { var m = metaFor(k); if (!groups[m.rid]) {
            groups[m.rid] = { rid: m.rid, reader: m.reader, rewaya: m.rewaya, items: [] };
            order.push(m.rid);
        } groups[m.rid].items.push(m); });
        order.sort(function (a, b) { return groups[a].reader.localeCompare(groups[b].reader, 'ar'); });
        var h = '';
        if (order.length) {
            h += '<div class="dlHead">' + ic('headphones') + ' <b>التلاوات المحمّلة</b><span class="mini">' + keys.length + ' سورة</span></div>';
            for (var gi = 0; gi < order.length; gi++) {
                var g = groups[order[gi]];
                g.items.sort(function (a, b) { return a.n - b.n; });
                h += '<div class="card dlGroup"><div class="dlGroupHead"><div><b>' + E(g.reader) + '</b><div class="mini">' + E(g.rewaya) + '</div></div><button type="button" class="dlBtn" data-open-reader="' + E(g.rid) + '">' + ic('folder') + ' صفحة القارئ</button></div>';
                for (var ii = 0; ii < g.items.length; ii++) {
                    var it = g.items[ii];
                    h += '<div class="dlRow" data-key="' + E(it.key) + '"><div class="dlInfo"><b>' + E(it.surah) + '</b><small>' + E(g.reader) + (g.rewaya ? ' • ' + E(g.rewaya) : '') + '</small></div><div class="dlActs"><button type="button" class="dlBtn primary" data-open="' + E(it.rid) + '|' + it.n + '">' + ic('folder') + ' فتح</button><button type="button" class="dlBtn danger" data-del="' + E(it.key) + '">' + ic('trash') + ' حذف</button></div></div>';
                }
                h += '</div>';
            }
        }
        var reg = {};
        try {
            reg = JSON.parse(LG('muslim-v103-dlreg', '{}')) || {};
        }
        catch (e) { }
        var rk = Object.keys(reg).sort(function (a, b) { return reg[b].at - reg[a].at; });
        if (rk.length) {
            h += '<div class="dlHead">' + ic('sparkle') + ' <b>الأذكار والرقية المحمّلة</b><span class="mini">' + rk.length + '</span></div><div class="card dlGroup">';
            rk.forEach(function (k) {
                var r = reg[k];
                var rq = /رقية/.test(r.kind || '');
                h += '<div class="dlRow" data-reg="' + E(k) + '"><div class="dlInfo"><b>' + E(r.label) + '</b><small>' + E(r.kind || '') + '</small></div><div class="dlActs"><button type="button" class="dlBtn primary" data-go="' + (rq ? 'ruqyah' : 'adhkar') + '">' + ic('folder') + ' فتح</button><button type="button" class="dlBtn danger" data-delreg="' + E(k) + '">' + ic('trash') + ' حذف</button></div></div>';
            });
            h += '</div>';
        }
        var files = [];
        try {
            var c = await caches.open('muslim-files-v1');
            files = await c.keys();
        }
        catch (e) { }
        if (files.length) {
            h += '<div class="dlHead">' + ic('folder') + ' <b>ملفات محفوظة</b></div><div class="card dlGroup">';
            files.forEach(function (rq) { var nm = decodeURIComponent(rq.url.split('/').pop()); h += '<div class="dlRow"><div class="dlInfo"><b>' + E(nm.replace(/\.png$/i, '') === 'Muslim-QR' ? 'صورة رمز QR للتطبيق' : nm) + '</b></div><div class="dlActs"><button type="button" class="dlBtn danger" data-delfile="' + E(rq.url) + '">' + ic('trash') + ' حذف</button></div></div>'; });
            h += '</div>';
        }
        box.innerHTML = h || '<div class="card detailHero" style="text-align:center">' + ic('download', 'vi-big') + '<h3>لا توجد تنزيلات بعد</h3><p class="mini">افتح أي قارئ واضغط «تحميل» بجانب السورة، فتظهر هنا وتعمل بلا إنترنت.</p><button type="button" class="primary" onclick="show(\'readers\')">' + ic('headphones') + ' تصفّح القرّاء</button></div>';
        var info = $('v103DlInfo');
        if (info) {
            var q = '';
            try {
                var e = await navigator.storage.estimate();
                q = 'المستخدم ≈ ' + fmt(e.usage) + ' من ' + fmt(e.quota);
            }
            catch (x) { }
            var p = false;
            try {
                p = await navigator.storage.persisted();
            }
            catch (x) { }
            info.innerHTML = ic(p ? 'lock' : 'info') + ' ' + (p ? 'التخزين الدائم مفعّل — لن يمسح المتصفح تنزيلاتك تلقائيًا. ' : 'قد يمسح المتصفح التنزيلات عند امتلاء الجهاز؛ ثبّت التطبيق لتأمينها. ') + q;
        }
        box.onclick = async function (ev) {
            var b = ev.target.closest('button');
            if (!b)
                return;
            if (b.dataset.openReader) {
                v106OpenReader(b.dataset.openReader);
            }
            else if (b.dataset.open) {
                var p = b.dataset.open.split('|');
                v106OpenReader(p[0], +p[1]);
            }
            else if (b.dataset.del) {
                if (!confirm('حذف هذا التنزيل من الجهاز؟'))
                    return;
                var k = b.dataset.del;
                try {
                    await idbDel(k);
                    localStorage.removeItem(k);
                    localStorage.removeItem(META + k);
                }
                catch (e) { }
                v106RenderDownloads();
            }
            else if (b.dataset.go) {
                show(b.dataset.go);
            }
            else if (b.dataset.delreg) {
                var rg = JSON.parse(LG('muslim-v103-dlreg', '{}'));
                var r = rg[b.dataset.delreg];
                if (r) {
                    try {
                        var c = await caches.open('muslim-audio-v1');
                        for (var u of (r.urls || []))
                            for (var x of u)
                                await c.delete(x);
                    }
                    catch (e) { }
                    delete rg[b.dataset.delreg];
                    LS_('muslim-v103-dlreg', JSON.stringify(rg));
                }
                v106RenderDownloads();
            }
            else if (b.dataset.delfile) {
                try {
                    var c2 = await caches.open('muslim-files-v1');
                    await c2.delete(b.dataset.delfile);
                }
                catch (e) { }
                v106RenderDownloads();
            }
        };
    };
    purgeOld();
    function init() {
        loadRec();
        refreshDL();
        window.addEventListener('online', function () { loadRec(false); });
    }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();
})();
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var LG = function (k, d) { try {
        var v = localStorage.getItem(k);
        return v == null ? d : v;
    }
    catch (e) {
        return d;
    } };
    var LS_ = function (k, v) { try {
        localStorage.setItem(k, v);
    }
    catch (e) { } };
    var ic = function (n, c) { return window.v106Icon ? window.v106Icon(n, c) : ''; };
    var EPS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://overpass.openstreetmap.fr/api/interpreter'];
    var RADII = [1, 3, 5, 10, 25];
    var st = { type: LG('muslimMosqueType', 'mosques') === 'women' ? 'women' : 'mosques', rad: +LG('muslim-v106-mrad', '5') || 5, pos: null, items: [], seq: 0, busy: false };
    if (RADII.indexOf(st.rad) < 0)
        st.rad = 5;
    var R = Math.PI / 180;
    function hav(a, b, c, d) { var x = Math.sin((c - a) * R / 2) * Math.sin((c - a) * R / 2) + Math.cos(a * R) * Math.cos(c * R) * Math.sin((d - b) * R / 2) * Math.sin((d - b) * R / 2); return 12742 * Math.asin(Math.sqrt(x)); }
    function bearing(a, b, c, d) { var y = Math.sin((d - b) * R) * Math.cos(c * R), x = Math.cos(a * R) * Math.sin(c * R) - Math.sin(a * R) * Math.cos(c * R) * Math.cos((d - b) * R); return (Math.atan2(y, x) / R + 360) % 360; }
    var DIRS = ['شمالًا', 'شمال شرق', 'شرقًا', 'جنوب شرق', 'جنوبًا', 'جنوب غرب', 'غربًا', 'شمال غرب'];
    function dirName(b) { return DIRS[Math.round(b / 45) % 8]; }
    function fmtD(k) { return k < 1 ? Math.round(k * 1000 / 10) * 10 + ' م' : (k < 10 ? k.toFixed(1) : Math.round(k)) + ' كم'; }
    function walk(k) { var m = Math.round(k / 0.08); return m < 60 ? m + ' دقيقة مشيًا' : '≈ ' + Math.round(m / 60 * 10) / 10 + ' ساعة مشيًا'; }
    function isWomen(t) {
        var v = [t.female, t.women, t['female:access'], t['female:only'], t.gender].map(function (x) { return String(x || '').toLowerCase(); });
        if (v.some(function (x) { return x === 'yes' || x === 'only' || x === 'female' || x === 'women'; }))
            return true;
        var tx = [t.name, t['name:ar'], t['name:en'], t.description, t['description:ar'], t.note].join(' ').toLowerCase();
        return /مصلى\s*(ال)?نساء|مصلى\s*(ال)?سيدات|مصلى\s*النساء|للنساء|للسيدات|نسائي|women|ladies|female|sisters/.test(tx);
    }
    function pickName(t) {
        var ks = ['name:ar', 'name', 'alt_name:ar', 'alt_name', 'official_name:ar', 'official_name', 'short_name:ar', 'loc_name:ar', 'name:en', 'int_name'];
        for (var i = 0; i < ks.length; i++) {
            if (t[ks[i]]) {
                return String(t[ks[i]]).slice(0, 80);
            }
        }
        return '';
    }
    function parse(els, lat, lon) {
        var out = [];
        (els || []).forEach(function (e) {
            var la = e.lat != null ? e.lat : (e.center && e.center.lat), lo = e.lon != null ? e.lon : (e.center && e.center.lon);
            if (la == null || lo == null)
                return;
            var t = e.tags || {};
            var musalla = /musalla|prayer_room/i.test((t.building || '') + ' ' + (t.amenity || '')) || /مصلى|مصلّى|musalla/i.test(t.name || t['name:ar'] || '');
            var d = hav(lat, lon, la, lo);
            out.push({ id: e.type + e.id, lat: la, lon: lo, d: d, b: bearing(lat, lon, la, lo), name: pickName(t), women: isWomen(t), musalla: musalla,
                note: [t.denomination && ('المذهب: ' + t.denomination), t.opening_hours && ('الدوام: ' + t.opening_hours), t['addr:street'] && ('الشارع: ' + t['addr:street'])].filter(Boolean).join(' • ').slice(0, 160) });
        });
        out.sort(function (a, b) { return a.d - b.d; });
        var res = [];
        out.forEach(function (x) { if (!res.some(function (y) { return (y.name || '#') === (x.name || '#') && hav(y.lat, y.lon, x.lat, x.lon) < 0.06; }))
            res.push(x); });
        return res;
    }
    function query(lat, lon, rM) {
        var a = '(around:' + Math.round(rM) + ',' + lat.toFixed(5) + ',' + lon.toFixed(5) + ')';
        return '[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"]' + a + ';way["amenity"="place_of_worship"]["religion"="muslim"]' + a + ';relation["amenity"="place_of_worship"]["religion"="muslim"]' + a + ';node["building"="mosque"]' + a + ';way["building"="mosque"]' + a + ';node["amenity"="prayer_room"]' + a + ';);out center tags 150;';
    }
    function ovp(q, signal) {
        return Promise.any(EPS.map(function (ep) {
            var ctl = new AbortController();
            signal.addEventListener('abort', function () { ctl.abort(); });
            var t = setTimeout(function () { ctl.abort(); }, 22000);
            return fetch(ep, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctl.signal })
                .then(function (r) { clearTimeout(t); if (!r.ok)
                throw new Error('http ' + r.status); return r.json(); })
                .then(function (j) { if (!j || !Array.isArray(j.elements))
                throw new Error('bad'); return j.elements; });
        }));
    }
    function gps() {
        return new Promise(function (res, rej) {
            if (!navigator.geolocation)
                return rej({ code: 0 });
            var fin = false;
            function ok(p) { if (fin)
                return; fin = true; res(p); }
            navigator.geolocation.getCurrentPosition(ok, function (e1) {
                if (e1 && e1.code === 1) {
                    fin = true;
                    return rej(e1);
                }
                navigator.geolocation.getCurrentPosition(ok, function (e2) { if (!fin) {
                    fin = true;
                    rej(e2 || e1);
                } }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 });
            }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 });
        });
    }
    function geocode(q) {
        return fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=ar&q=' + encodeURIComponent(q)).then(function (r) { return r.json(); }).then(function (j) {
            if (!j || !j[0])
                throw new Error('nf');
            return { lat: +j[0].lat, lon: +j[0].lon, label: String(j[0].display_name || q).split(',').slice(0, 2).join('،') };
        });
    }
    function status(h, cls) { var s = $('m6Status'); if (s) {
        s.className = 'notice ' + (cls || '');
        s.innerHTML = h;
    } }
    function ui() {
        var sec = $('mosques');
        if (!sec || sec.getAttribute('data-v106'))
            return;
        sec.setAttribute('data-v106', '1');
        var head = sec.querySelector('.section');
        var title = head ? head.outerHTML : '';
        sec.innerHTML = title +
            '<div class="card m6Card">' +
            '<div class="m6Seg" role="tablist" aria-label="نوع المكان"><button type="button" role="tab" data-t="mosques">' + ic('mosque') + ' المساجد</button><button type="button" role="tab" data-t="women">' + ic('heart') + ' مصليات النساء</button></div>' +
            '<div class="m6Label">النطاق</div><div class="m6Chips" id="m6Rad" role="group" aria-label="نطاق البحث">' + RADII.map(function (r) { return '<button type="button" data-r="' + r + '">' + r + ' كم</button>'; }).join('') + '</div>' +
            '<button type="button" class="primary m6Go" id="m6Go">' + ic('pin') + ' <span>ابحث عن أقرب مسجد</span></button>' +
            '<div class="m6Manual"><input id="m6City" class="field" placeholder="أو اكتب اسم الحي / المدينة" autocomplete="off" maxlength="80" aria-label="اسم المدينة"><button type="button" id="m6CityGo" aria-label="بحث">' + ic('search') + '</button></div>' +
            '<div id="m6Status" class="notice" role="status" aria-live="polite">اضغط «ابحث» ليحدّد التطبيق موقعك مرة واحدة فقط ويعرض المساجد القريبة. لا يُرسَل موقعك لأي خادم غير خدمة الخرائط المفتوحة.</div></div>' +
            '<div id="m6Radar" class="card m6RadarCard" hidden></div><div id="m6List" aria-live="polite"></div>';
        sec.querySelector('.m6Seg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b)
            setType(b.dataset.t); });
        $('m6Rad').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b)
            return; st.rad = +b.dataset.r; LS_('muslim-v106-mrad', st.rad); mark(); if (st.pos)
            search(true); });
        $('m6Go').addEventListener('click', function () { find(); });
        $('m6CityGo').addEventListener('click', byCity);
        $('m6City').addEventListener('keydown', function (e) { if (e.key === 'Enter') {
            e.preventDefault();
            byCity();
        } });
        $('m6List').addEventListener('click', onList);
        mark();
    }
    function mark() {
        document.querySelectorAll('#mosques .m6Seg button').forEach(function (b) { var on = b.dataset.t === st.type; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
        document.querySelectorAll('#m6Rad button').forEach(function (b) { b.classList.toggle('on', +b.dataset.r === st.rad); });
    }
    function setType(t) { st.type = t === 'women' ? 'women' : 'mosques'; LS_('muslimMosqueType', st.type); mark(); draw(); }
    function onList(e) {
        var b = e.target.closest('button,a');
        if (!b)
            return;
        if (b.dataset.share) {
            var la = b.dataset.la, lo = b.dataset.lo, u = 'https://www.google.com/maps?q=' + la + ',' + lo, nm = b.dataset.n || 'مسجد';
            if (navigator.share)
                navigator.share({ title: nm, text: nm, url: u }).catch(function () { });
            else if (navigator.clipboard)
                navigator.clipboard.writeText(u).then(function () { b.textContent = 'تم نسخ الرابط'; });
        }
    }
    function visible() {
        return st.items.filter(function (x) { return st.type === 'women' ? x.women : true; });
    }
    function radar(list) {
        var box = $('m6Radar');
        if (!box)
            return;
        if (!list.length) {
            box.hidden = true;
            return;
        }
        var max = Math.max(0.5, Math.min(st.rad, list[Math.min(list.length, 12) - 1].d * 1.15));
        var s = '<svg viewBox="-100 -100 200 200" class="m6Svg" role="img" aria-label="رادار المساجد القريبة"><circle r="92" class="rg"/><circle r="61" class="rg"/><circle r="30" class="rg"/><path d="M-92 0H92M0-92V92" class="rg"/>' +
            '<text x="0" y="-94" class="rt">ش</text><text x="95" y="3" class="rt">شرق</text><text x="0" y="101" class="rt">ج</text><text x="-95" y="3" class="rt">غرب</text><circle r="4.5" class="me"/>';
        list.slice(0, 12).forEach(function (x, i) {
            var r = Math.min(1, x.d / max) * 88, a = x.b * R;
            s += '<circle cx="' + (Math.sin(a) * r).toFixed(1) + '" cy="' + (-Math.cos(a) * r).toFixed(1) + '" r="' + (i === 0 ? 5.5 : 3.6) + '" class="' + (i === 0 ? 'dot near' : 'dot') + '"><title>' + E(x.name || 'مسجد') + ' — ' + fmtD(x.d) + '</title></circle>';
        });
        box.innerHTML = '<div class="m6RadarIn">' + s + '</svg><div class="m6Legend"><span><i class="me"></i> أنت</span><span><i class="dot near"></i> الأقرب</span><span><i class="dot"></i> مساجد</span><small>الدائرة الكبرى ≈ ' + fmtD(max) + '</small></div></div>';
        box.hidden = false;
    }
    function draw(note) {
        var host = $('m6List');
        if (!host)
            return;
        var list = visible();
        radar(list);
        if (!st.items.length) {
            host.innerHTML = '';
            return;
        }
        if (!list.length) {
            host.innerHTML = '<div class="notice">لم نجد مصلى نساء موسومًا في الخرائط ضمن هذا النطاق. أغلب المساجد فيها قسم للنساء لكن بيانات الخرائط المفتوحة نادرًا ما تذكر ذلك — <button type="button" class="primary" id="m6All">اعرض كل المساجد</button></div>';
            var b = $('m6All');
            if (b)
                b.onclick = function () { setType('mosques'); };
            return;
        }
        host.innerHTML = (note || '') + list.slice(0, 80).map(function (x, i) {
            var nm = x.name || (x.musalla ? 'مصلى' : 'مسجد') + ' (بلا اسم مسجّل)';
            var dir = 'https://www.google.com/maps/dir/?api=1&destination=' + x.lat + ',' + x.lon + '&travelmode=walking';
            var map = 'https://www.openstreetmap.org/?mlat=' + x.lat + '&mlon=' + x.lon + '#map=18/' + x.lat + '/' + x.lon;
            return '<article class="card m6Item' + (i === 0 ? ' near' : '') + '"><div class="m6Top"><span class="m6Ic">' + ic(x.women ? 'heart' : 'mosque') + '</span><div class="m6Nm"><b>' + E(nm) + '</b>' +
                '<div class="mini">' + (i === 0 ? '<span class="m6Tag">الأقرب</span> ' : '') + (x.women ? '<span class="m6Tag w">مصلى نساء</span> ' : '') + (x.musalla ? '<span class="m6Tag">مصلى</span> ' : '') + E(dirName(x.b)) + ' • ' + walk(x.d) + '</div></div><div class="m6Dist">' + fmtD(x.d) + '</div></div>' +
                (x.note ? '<div class="mini m6Note">' + E(x.note) + '</div>' : '') +
                '<div class="m6Acts"><a class="m6Btn primary" href="' + dir + '" target="_blank" rel="noopener noreferrer">' + ic('nav') + ' اتجاهات</a><a class="m6Btn" href="' + map + '" target="_blank" rel="noopener noreferrer">' + ic('pin') + ' الخريطة</a><button type="button" class="m6Btn" data-share="1" data-la="' + x.lat + '" data-lo="' + x.lon + '" data-n="' + E(nm) + '">' + ic('share') + ' مشاركة</button></div></article>';
        }).join('');
    }
    var ctlMain = null;
    function key(lat, lon) { return 'muslim-v106-m:' + lat.toFixed(2) + ',' + lon.toFixed(2); }
    function saveCache(lat, lon, items, rad) { LS_(key(lat, lon), JSON.stringify({ t: Date.now(), rad: rad, lat: lat, lon: lon, items: items.slice(0, 120).map(function (x) { return [x.id, x.lat, x.lon, x.name, x.women ? 1 : 0, x.musalla ? 1 : 0, x.note]; }) })); LS_('muslim-v106-mlast', JSON.stringify({ lat: lat, lon: lon })); }
    function loadCache(lat, lon) {
        try {
            var j = JSON.parse(LG(key(lat, lon), 'null'));
            if (!j)
                return null;
            return { t: j.t, rad: j.rad, items: j.items.map(function (a) { var d = hav(lat, lon, a[1], a[2]); return { id: a[0], lat: a[1], lon: a[2], name: a[3], women: !!a[4], musalla: !!a[5], note: a[6] || '', d: d, b: bearing(lat, lon, a[1], a[2]) }; }).sort(function (a, b) { return a.d - b.d; }) };
        }
        catch (e) {
            return null;
        }
    }
    async function search(reuse) {
        if (!st.pos)
            return;
        var seq = ++st.seq;
        if (ctlMain)
            ctlMain.abort();
        ctlMain = new AbortController();
        var lat = st.pos.lat, lon = st.pos.lon, btn = $('m6Go');
        var cached = loadCache(lat, lon);
        if (cached && (!navigator.onLine || Date.now() - cached.t < 10 * 60e3) && cached.rad >= st.rad) {
            st.items = cached.items;
            draw();
            status(ic('checkc') + ' ' + (navigator.onLine ? 'نتائج حديثة محفوظة' : 'عرض آخر نتائج محفوظة (بلا إنترنت)') + ' — ' + visible().length + ' مكان ضمن ' + fmtD(st.rad), 'ok');
            return;
        }
        if (!navigator.onLine) {
            if (cached) {
                st.items = cached.items;
                draw();
                status(ic('wifioff') + ' لا يوجد اتصال — نعرض آخر نتائج محفوظة لهذه المنطقة.', 'warn');
            }
            else
                status(ic('wifioff') + ' لا يوجد اتصال بالإنترنت، ولا توجد نتائج محفوظة لهذه المنطقة.', 'warn');
            return;
        }
        st.busy = true;
        if (btn)
            btn.disabled = true;
        var radii = RADII.filter(function (r) { return r >= st.rad; }), found = null, usedR = st.rad, lastErr = null;
        for (var i = 0; i < radii.length; i++) {
            if (seq !== st.seq)
                return;
            usedR = radii[i];
            status(ic('loader', 'vi-spin') + ' أبحث ضمن ' + usedR + ' كم…' + (i ? ' (وسّعت النطاق لأنني لم أجد شيئًا)' : ''));
            try {
                var els = await ovp(query(lat, lon, usedR * 1000), ctlMain.signal);
                if (seq !== st.seq)
                    return;
                var items = parse(els, lat, lon);
                found = items;
                var need = st.type === 'women' ? items.filter(function (x) { return x.women; }) : items;
                if (need.length)
                    break;
            }
            catch (e) {
                lastErr = e;
                if (seq !== st.seq)
                    return;
                break;
            }
        }
        st.busy = false;
        if (btn)
            btn.disabled = false;
        if (found) {
            st.items = found;
            saveCache(lat, lon, found, usedR);
            draw();
            var n = visible().length;
            status(n ? ic('checkc') + ' وجدنا ' + n + ' ' + (st.type === 'women' ? 'مصلى نساء' : 'مكانًا') + ' ضمن ' + usedR + ' كم' + (st.pos.acc > 1000 ? ' — دقة موقعك ضعيفة (≈ ' + (st.pos.acc / 1000).toFixed(1) + ' كم)، فعّل «الموقع الدقيق».' : '') : 'لم نجد نتائج ضمن ' + usedR + ' كم. جرّب نطاقًا أكبر أو اكتب اسم مدينتك.', n ? 'ok' : 'warn');
        }
        else {
            var c2 = loadCache(lat, lon);
            if (c2) {
                st.items = c2.items;
                draw();
                status(ic('alert') + ' تعذّر الوصول لخدمة الخرائط الآن، نعرض آخر نتائج محفوظة. <button type="button" class="primary" id="m6Retry">إعادة المحاولة</button>', 'warn');
            }
            else
                status(ic('alert') + ' تعذّر الوصول لخدمة الخرائط (قد تكون مشغولة أو محجوبة على شبكتك). <button type="button" class="primary" id="m6Retry">إعادة المحاولة</button>', 'warn');
            var rb = $('m6Retry');
            if (rb)
                rb.onclick = function () { search(true); };
        }
    }
    async function find() {
        ui();
        var btn = $('m6Go');
        if (btn)
            btn.disabled = true;
        status(ic('loader', 'vi-spin') + ' أحدّد موقعك… اسمح للموقع عند ظهور الطلب.');
        try {
            var p = await gps();
            st.pos = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy || 0 };
            LS_('muslim-v106-mlast', JSON.stringify({ lat: st.pos.lat, lon: st.pos.lon }));
        }
        catch (e) {
            if (btn)
                btn.disabled = false;
            var msg = e && e.code === 1 ? 'لم يُسمح بالوصول للموقع. فعّله من إعدادات المتصفح للموقع، أو اكتب اسم مدينتك بالأسفل.' : e && e.code === 3 ? 'انتهت مهلة تحديد الموقع. اخرج لمكان مفتوح أو اكتب اسم مدينتك.' : 'تعذّر تحديد موقعك. اكتب اسم مدينتك بالأسفل.';
            status(ic('alert') + ' ' + msg, 'warn');
            return;
        }
        if (btn)
            btn.disabled = false;
        return search();
    }
    async function byCity() {
        var v = ($('m6City') || {}).value || '';
        v = v.trim();
        if (v.length < 2) {
            status('اكتب اسم الحي أو المدينة (حرفان على الأقل).', 'warn');
            return;
        }
        if (!navigator.onLine) {
            status(ic('wifioff') + ' البحث بالاسم يحتاج إنترنت.', 'warn');
            return;
        }
        status(ic('loader', 'vi-spin') + ' أبحث عن «' + E(v) + '»…');
        try {
            var g = await geocode(v);
            st.pos = { lat: g.lat, lon: g.lon, acc: 0 };
            search();
        }
        catch (e) {
            status(ic('alert') + ' لم أجد هذا المكان. جرّب كتابة المدينة والدولة.', 'warn');
        }
    }
    function init() {
        ui();
        mark();
        try {
            var l = JSON.parse(LG('muslim-v106-mlast', 'null'));
            if (l) {
                var c = loadCache(l.lat, l.lon);
                if (c && c.items.length) {
                    st.pos = { lat: l.lat, lon: l.lon, acc: 0 };
                    st.items = c.items;
                    draw();
                    status('آخر نتائج محفوظة' + (navigator.onLine ? '' : ' (بلا إنترنت)') + ' — اضغط «ابحث» لتحديث موقعك.');
                }
            }
        }
        catch (e) { }
    }
    window.findMosques = find;
    window.setMosqueType = setType;
    window.initNearbyMosques = init;
    window.refreshLiveLocation = window.refreshLiveLocation || function () { find(); };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', ui);
    else
        ui();
})();
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var ic = function (n, c) { return window.v106Icon ? window.v106Icon(n, c) : ''; };
    if (window.v106Icons && !window.v106Icons.plus)
        window.v106Icons.plus = '<path d="M12 5v14M5 12h14"/>';
    var KEY = 'muslim-v106-deeds', MAXC = 30;
    var BASE = [
        { id: 'qiyam', t: 'قيام الليل', d: 'ركعات في الثلث الأخير — وقت دعاء واستغفار', time: '03:30', ic: 'moon', go: "show('adhkar')" },
        { id: 'fajr-adhkar', t: 'أذكار الصباح', d: 'تحصين اليوم بالذكر بعد الفجر', time: '05:30', ic: 'sunrise', go: "show('adhkar');setTimeout(function(){window.renderAdhkar&&renderAdhkar('صباح')},80)" },
        { id: 'duha', t: 'صلاة الضحى', d: 'ركعتان فأكثر بعد ارتفاع الشمس', time: '09:30', ic: 'sun', go: "show('adhkar')" },
        { id: 'wird', t: 'ورد القرآن', d: 'تلاوة أو استماع لوردك اليومي', time: '20:00', ic: 'book', go: "show('quran')" },
        { id: 'istighfar', t: 'الاستغفار والتسبيح', d: 'مئة مرة أو ما تيسّر', time: '12:30', ic: 'sparkle', go: "show('adhkar')" },
        { id: 'sadaqa', t: 'صدقة اليوم', d: 'ولو بالقليل — صدقة تُطفئ الخطيئة', time: '10:30', ic: 'heart', go: null },
        { id: 'asr-adhkar', t: 'أذكار المساء', d: 'تحصين المساء بعد العصر', time: '17:00', ic: 'sunset', go: "show('adhkar');setTimeout(function(){window.renderAdhkar&&renderAdhkar('مساء')},80)" },
        { id: 'tadabbur', t: 'تدبّر آية', d: 'اقرأ آية وتأمّل معناها دقيقة واحدة', time: '21:00', ic: 'leaf', go: "show('quran')" },
        { id: 'mulk', t: 'سورة الملك', d: 'قبل النوم', time: '22:00', ic: 'book', go: "show('quran');setTimeout(function(){window.openSurahDetail&&openSurahDetail(67)},120)" },
        { id: 'sleep-adhkar', t: 'أذكار النوم', d: 'اختم يومك بالذكر على طهارة', time: '22:15', ic: 'moon', go: "show('adhkar')" },
        { id: 'witr', t: 'صلاة الوتر', d: 'اجعل آخر صلاتك بالليل وترًا', time: '22:30', ic: 'star', go: null },
        { id: 'muhasaba', t: 'محاسبة النفس', d: 'دقيقة تراجع فيها يومك وتجدّد النية', time: '22:45', ic: 'target', go: null },
        { id: 'kahf', t: 'سورة الكهف', d: 'من أعمال يوم الجمعة', time: '10:00', ic: 'book', days: [5], go: "show('quran');setTimeout(function(){window.openSurahDetail&&openSurahDetail(18)},120)" },
        { id: 'salawat', t: 'الإكثار من الصلاة على النبي ﷺ', d: 'يوم الجمعة', time: '14:00', ic: 'heart', days: [5], go: null },
        { id: 'fast-eve', t: 'تذكير صيام الاثنين والخميس', d: 'مساء الأحد والأربعاء', time: '19:30', ic: 'calendar', days: [0, 3], go: null },
        { id: 'silat', t: 'صلة الرحم', d: 'اتصال أو رسالة لقريب لم تسأل عنه', time: '18:00', ic: 'phone', days: [6], go: null }
    ];
    var DAYN = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    function load() { try {
        var j = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (j && typeof j === 'object')
            return { prefs: j.prefs || {}, custom: Array.isArray(j.custom) ? j.custom : [], done: j.done || {}, master: j.master !== false, fired: j.fired || {} };
    }
    catch (e) { } return { prefs: {}, custom: [], done: {}, master: true, fired: {} }; }
    var S = load();
    function save() {
        var ks = Object.keys(S.done).sort();
        while (ks.length > 60) {
            delete S.done[ks.shift()];
        }
        var fk = Object.keys(S.fired).sort();
        while (fk.length > 40) {
            delete S.fired[fk.shift()];
        }
        try {
            localStorage.setItem(KEY, JSON.stringify(S));
        }
        catch (e) { }
        pushConfig();
    }
    function today(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
    function all() { return BASE.concat(S.custom.map(function (c) { return { id: c.id, t: c.t, d: c.d || 'عمل أضفته أنت', time: c.time, ic: 'star', days: c.days && c.days.length && c.days.length < 7 ? c.days : null, go: null, custom: 1 }; })); }
    var DEF_ON = ['fajr-adhkar', 'asr-adhkar', 'sleep-adhkar', 'wird', 'kahf'];
    function pref(d) { var p = S.prefs[d.id] || {}; return { on: p.on === undefined ? DEF_ON.indexOf(d.id) >= 0 : !!p.on, time: /^([01]\d|2[0-3]):[0-5]\d$/.test(p.time || '') ? p.time : d.time }; }
    function appliesToday(d, day) { return !d.days || d.days.indexOf(day) >= 0; }
    function isDone(id, k) { return (S.done[k || today()] || []).indexOf(id) >= 0; }
    function toggleDone(id) { var k = today(), a = S.done[k] = S.done[k] || [], i = a.indexOf(id); if (i >= 0)
        a.splice(i, 1);
    else
        a.push(id); if (!a.length)
        delete S.done[k]; save(); }
    function streak() {
        var n = 0, d = new Date();
        if (!S.done[today(d)])
            d.setDate(d.getDate() - 1);
        for (;;) {
            if (S.done[today(d)] && S.done[today(d)].length) {
                n++;
                d.setDate(d.getDate() - 1);
            }
            else
                break;
        }
        return n;
    }
    function week() { var out = [], d = new Date(); for (var i = 6; i >= 0; i--) {
        var x = new Date(d);
        x.setDate(d.getDate() - i);
        out.push({ k: today(x), n: (S.done[today(x)] || []).length, dn: DAYN[x.getDay()].slice(0, 3) });
    } return out; }
    function fmt(t) { var p = t.split(':'), h = +p[0], m = p[1], ap = h >= 12 ? 'م' : 'ص'; h = h % 12 || 12; return h + ':' + m + ' ' + ap; }
    function pushConfig() {
        try {
            var OPEN = { 'fajr-adhkar': 'adhkar-morning', 'asr-adhkar': 'adhkar-evening', 'sleep-adhkar': 'adhkar', 'qiyam': 'adhkar', 'duha': 'adhkar', 'istighfar': 'adhkar', 'wird': 'quran', 'tadabbur': 'quran', 'mulk': 'quran', 'kahf': 'quran' };
            var list = all().map(function (d) { var p = pref(d); return p.on && S.master ? { id: d.id, t: d.t, b: d.d, time: p.time, days: d.days || null } : null; }).filter(Boolean);
            window.__v115Deeds = list.map(function (x) { return { id: x.id, t: x.t, b: x.b, time: x.time, days: x.days, o: OPEN[x.id] || 'daily' }; });
            try {
                if (window.v115PushSync)
                    window.v115PushSync();
            }
            catch (e) { }
            var body = JSON.stringify({ v: 1, list: list, fired: S.fired });
            if (window.caches)
                caches.open('muslim-config-v1').then(function (c) { return c.put('./__reminders.json', new Response(body, { headers: { 'Content-Type': 'application/json' } })); }).catch(function () { });
            if (navigator.serviceWorker && navigator.serviceWorker.controller)
                navigator.serviceWorker.controller.postMessage({ type: 'reminders-updated' });
        }
        catch (e) { }
    }
    function regPeriodic() {
        try {
            navigator.serviceWorker.ready.then(function (r) {
                if (r.periodicSync && navigator.permissions) {
                    navigator.permissions.query({ name: 'periodic-background-sync' }).then(function (p) { if (p.state === 'granted')
                        r.periodicSync.register('muslim-reminders', { minInterval: 15 * 60 * 1000 }).catch(function () { }); }).catch(function () { });
                }
            });
        }
        catch (e) { }
    }
    function perm() { return ('Notification' in window) ? Notification.permission : 'unsupported'; }
    function notify(title, body, tag) {
        if (perm() !== 'granted')
            return Promise.resolve(false);
        try {
            if (window.v115Chime)
                window.v115Chime();
        }
        catch (e) { }
        var opts = { body: body || '', tag: tag || 'muslim', icon: './ic-192.png', badge: './ic-192.png', lang: 'ar', dir: 'rtl', data: { open: 'daily' }, renotify: false };
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            return navigator.serviceWorker.ready.then(function (r) { return r.showNotification(title, opts); }).then(function () { return true; }).catch(function () { try {
                new Notification(title, opts);
                return true;
            }
            catch (e) {
                return false;
            } });
        }
        try {
            new Notification(title, opts);
            return Promise.resolve(true);
        }
        catch (e) {
            return Promise.resolve(false);
        }
    }
    function ask() {
        if (!('Notification' in window)) {
            toast('متصفحك لا يدعم الإشعارات.');
            return Promise.resolve('unsupported');
        }
        if (Notification.permission === 'denied') {
            toast('الإشعارات محظورة. فعّلها من إعدادات المتصفح للموقع ثم أعد المحاولة.');
            return Promise.resolve('denied');
        }
        return Notification.requestPermission().then(function (r) { regPeriodic(); pushConfig(); renderSettings(); if (r === 'granted' && window.v115Push)
            window.v115Push.enable(); return r; });
    }
    function toast(m) { try {
        window.showToast ? window.showToast(m) : alert(m);
    }
    catch (e) { } }
    var timer = null;
    function dueNow(since) {
        var now = new Date(), day = now.getDay(), k = today(now), out = [];
        all().forEach(function (d) {
            var p = pref(d);
            if (!p.on || !appliesToday(d, day))
                return;
            var hm = p.time.split(':'), at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hm[0], +hm[1], 0).getTime();
            if (at <= now.getTime() && at >= Math.max(since, now.getTime() - 2 * 3600e3) && S.fired[d.id] !== k && !isDone(d.id))
                out.push(d);
        });
        return out;
    }
    function tick() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        if (!S.master)
            return;
        var last = +(localStorage.getItem('muslim-v106-lasttick') || 0) || Date.now() - 5 * 60e3;
        var due = dueNow(last);
        due.forEach(function (d) { S.fired[d.id] = today(); notify('حان وقت: ' + d.t, d.d, 'deed-' + d.id); });
        if (due.length)
            save();
        try {
            localStorage.setItem('muslim-v106-lasttick', Date.now());
        }
        catch (e) { }
        var now = new Date(), nxt = Infinity;
        all().forEach(function (d) { var p = pref(d); if (!p.on || !appliesToday(d, now.getDay()))
            return; var hm = p.time.split(':'), at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hm[0], +hm[1], 0).getTime(); if (at > now.getTime() && at < nxt)
            nxt = at; });
        var wait = Math.min(nxt - Date.now(), 30 * 60e3);
        if (!isFinite(wait))
            wait = 30 * 60e3;
        timer = setTimeout(tick, Math.max(wait + 500, 15000));
    }
    function renderDaily() {
        var box = $('dailyList');
        if (!box)
            return;
        var now = new Date(), day = now.getDay(), k = today(now), h = now.getHours();
        var list = all().filter(function (d) { return appliesToday(d, day); }).sort(function (a, b) { return pref(a).time < pref(b).time ? -1 : 1; });
        var done = list.filter(function (d) { return isDone(d.id, k); }).length, pct = list.length ? Math.round(done / list.length * 100) : 0, st = streak(), wk = week(), mx = Math.max(1, Math.max.apply(null, wk.map(function (x) { return x.n; })));
        var cur = h < 5 ? 'قيام' : h < 11 ? 'صباح' : h < 15 ? 'ظهر' : h < 18 ? 'عصر' : 'مساء';
        var head = '<div class="card v6Sum"><div class="v6Ring" style="--p:' + pct + '" role="img" aria-label="' + pct + '٪ من أعمال اليوم"><b>' + pct + '٪</b></div><div class="v6SumTx"><b>' + done + ' من ' + list.length + ' أعمال اليوم</b><small>' + ic('trophy') + ' سلسلة ' + st + ' ' + (st === 1 ? 'يوم' : 'أيام') + ' متتالية</small></div><div class="v6Wk" aria-label="إنجازك آخر 7 أيام">' + wk.map(function (x) { return '<span title="' + E(x.dn) + ': ' + x.n + '"><i style="height:' + (8 + Math.round(x.n / mx * 30)) + 'px" class="' + (x.n ? 'on' : '') + '"></i><em>' + E(x.dn) + '</em></span>'; }).join('') + '</div></div>';
        var notif = perm() === 'granted' ? '' : '<div class="notice warn v6Notice">' + ic('bell') + ' فعّل الإشعارات ليذكّرك التطبيق بأعمالك. <button type="button" class="primary" data-v6="ask">تفعيل الإشعارات</button></div>';
        var rows = list.map(function (d) {
            var p = pref(d), dn = isDone(d.id, k);
            return '<div class="card dailyCard v6Row' + (dn ? ' done' : '') + '" data-id="' + E(d.id) + '"><button type="button" class="v6Chk" data-v6="done" aria-pressed="' + dn + '" aria-label="' + (dn ? 'إلغاء إنجاز' : 'تم إنجاز') + ' ' + E(d.t) + '">' + (dn ? ic('checkc') : '<span class="v6Ci"></span>') + '</button>' +
                '<span class="dailyIcon">' + ic(d.ic) + '</span><div class="v6Tx"><h3>' + E(d.t) + '</h3><p class="mini">' + E(d.d) + '</p><small class="timeBadge">' + ic('clock') + ' ' + fmt(p.time) + (d.days ? ' • ' + d.days.map(function (x) { return DAYN[x]; }).join('، ') : '') + '</small></div>' +
                '<div class="v6Acts">' + (d.go ? '<button type="button" class="v6Mini" data-v6="go" aria-label="فتح ' + E(d.t) + '">' + ic('book') + '</button>' : '') +
                '<button type="button" class="v6Mini' + (p.on ? ' on' : '') + '" data-v6="bell" aria-pressed="' + p.on + '" aria-label="' + (p.on ? 'إيقاف' : 'تفعيل') + ' التذكير">' + ic('bell') + '</button>' +
                (d.custom ? '<button type="button" class="v6Mini" data-v6="del" aria-label="حذف ' + E(d.t) + '">' + ic('trash') + '</button>' : '') + '</div></div>';
        }).join('');
        box.innerHTML = head + notif + '<div class="mini v6Hint">الوقت الحالي: ' + cur + ' — الجرس يفعّل/يوقف تذكير العمل، والدائرة لتسجيل إنجازه اليوم.</div>' + rows +
            '<div class="card v6Add"><h3>' + ic('plus') + ' أضف عملًا خاصًا بك</h3><div class="v6Form"><input id="v6T" class="field" maxlength="40" placeholder="اسم العمل (مثال: قراءة صفحة من كتاب)" aria-label="اسم العمل" autocomplete="off"><input id="v6Tm" class="field" type="time" value="08:00" aria-label="وقت التذكير"></div><div class="v6Days" role="group" aria-label="أيام العمل">' + DAYN.map(function (n, i) { return '<button type="button" class="on" data-d="' + i + '" aria-pressed="true">' + n.slice(0, 3) + '</button>'; }).join('') + '</div><button type="button" class="primary" data-v6="add">' + ic('plus') + ' إضافة</button><div class="mini" id="v6Err" role="alert"></div></div>';
    }
    function clean(s, n) { return String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n); }
    function add() {
        var t = clean(($('v6T') || {}).value, 40), tm = ($('v6Tm') || {}).value || '', err = $('v6Err');
        var days = [].slice.call(document.querySelectorAll('.v6Days button.on')).map(function (b) { return +b.dataset.d; });
        var msg = !t || t.length < 2 ? 'اكتب اسم العمل (حرفان على الأقل).' : !/^([01]\d|2[0-3]):[0-5]\d$/.test(tm) ? 'اختر وقتًا صحيحًا.' : !days.length ? 'اختر يومًا واحدًا على الأقل.' : S.custom.length >= MAXC ? 'وصلت للحد الأقصى (' + MAXC + ' عملًا).' : '';
        if (msg) {
            if (err)
                err.textContent = msg;
            return;
        }
        var id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
        S.custom.push({ id: id, t: t, time: tm, days: days.length === 7 ? null : days });
        S.prefs[id] = { on: true, time: tm };
        save();
        if (perm() === 'default')
            ask();
        renderDaily();
        renderSettings();
        tick();
        toast('أُضيف «' + t + '» وفُعّل تذكيره.');
    }
    function del(id) { S.custom = S.custom.filter(function (c) { return c.id !== id; }); delete S.prefs[id]; delete S.fired[id]; Object.keys(S.done).forEach(function (k) { S.done[k] = S.done[k].filter(function (x) { return x !== id; }); if (!S.done[k].length)
        delete S.done[k]; }); save(); renderDaily(); renderSettings(); }
    function setBell(id, on) { var d = all().filter(function (x) { return x.id === id; })[0]; if (!d)
        return; var p = S.prefs[id] = S.prefs[id] || {}; p.on = on; p.time = pref(d).time; save(); if (on && perm() === 'default')
        ask(); tick(); }
    function onDaily(e) {
        var b = e.target.closest('[data-v6],.v6Days button');
        if (!b)
            return;
        if (b.parentNode && b.parentNode.classList.contains('v6Days')) {
            var on = !b.classList.contains('on');
            b.classList.toggle('on', on);
            b.setAttribute('aria-pressed', on);
            return;
        }
        var row = b.closest('[data-id]'), id = row && row.dataset.id, a = b.dataset.v6;
        if (a === 'ask')
            ask().then(renderDaily);
        else if (a === 'add')
            add();
        else if (a === 'done') {
            toggleDone(id);
            renderDaily();
        }
        else if (a === 'bell') {
            var d = all().filter(function (x) { return x.id === id; })[0];
            setBell(id, !pref(d).on);
            renderDaily();
            renderSettings();
        }
        else if (a === 'del') {
            if (confirm('حذف هذا العمل؟'))
                del(id);
        }
        else if (a === 'go') {
            var d2 = all().filter(function (x) { return x.id === id; })[0];
            if (d2 && d2.go)
                try {
                    var gm = /^\s*show\('([A-Za-z0-9_-]{2,30})'\)\s*;?\s*$/.exec(String(d2.go));
                    if (gm && typeof show === 'function')
                        show(gm[1]);
                }
                catch (er) { }
        }
    }
    function renderSettings() {
        var box = $('dailyReminderSettingsBox');
        if (!box)
            return;
        var p = perm(), stx = p === 'granted' ? '<span class="v6Ok">' + ic('checkc') + ' الإشعارات مفعّلة</span>' : p === 'denied' ? '<span class="v6No">' + ic('alert') + ' محظورة من المتصفح</span>' : p === 'unsupported' ? '<span class="v6No">غير مدعومة في هذا المتصفح</span>' : '<button type="button" class="primary" data-s6="ask">' + ic('bell') + ' السماح بالإشعارات</button>';
        box.innerHTML = '<div class="v6SetTop">' + stx + (p === 'granted' ? '<button type="button" class="stgBtn" data-s6="test">اختبار إشعار</button>' : '') + '</div>' +
            '<label class="v6Master"><input type="checkbox" data-s6="master" ' + (S.master ? 'checked' : '') + '> <b>تشغيل كل التذكيرات</b></label>' +
            '<div class="v6Bulk"><button type="button" class="stgBtn" data-s6="allon">تفعيل الكل</button><button type="button" class="stgBtn" data-s6="alloff">إيقاف الكل</button></div>' +
            '<div class="v6SetList">' + all().map(function (d) { var q = pref(d); return '<div class="v6SetRow" data-id="' + E(d.id) + '"><label class="v6SetL"><input type="checkbox" data-s6="on" ' + (q.on ? 'checked' : '') + ' aria-label="تذكير ' + E(d.t) + '"><span><b>' + E(d.t) + '</b><small>' + (d.days ? d.days.map(function (x) { return DAYN[x]; }).join('، ') : 'كل يوم') + '</small></span></label><input type="time" class="field v6Time" data-s6="time" value="' + q.time + '" aria-label="وقت تذكير ' + E(d.t) + '"></div>'; }).join('') + '</div>' +
            '<p class="mini">التذكير يصلك والتطبيق مفتوح أو مثبَّت على الشاشة الرئيسية. تصل التذكيرات عند فتح التطبيق أو تثبيته.</p>';
        try {
            if (window.v115Push)
                window.v115Push.refreshUI();
        }
        catch (e) { }
    }
    function onSettings(e) {
        var t = e.target, a = t.getAttribute && t.getAttribute('data-s6');
        if (!a) {
            var bb = t.closest && t.closest('[data-s6]');
            if (!bb)
                return;
            t = bb;
            a = t.getAttribute('data-s6');
        }
        var row = t.closest('[data-id]'), id = row && row.dataset.id;
        if (a === 'ask')
            ask();
        else if (a === 'test' && e.type === 'click')
            notify('تجربة الإشعار', 'تعمل الإشعارات بنجاح — بارك الله فيك', 'test').then(function (ok) { if (!ok)
                toast('تعذّر إرسال الإشعار.'); });
        else if (a === 'master' && e.type === 'change') {
            S.master = t.checked;
            save();
            tick();
        }
        else if (a === 'allon' && e.type === 'click') {
            all().forEach(function (d) { S.prefs[d.id] = { on: true, time: pref(d).time }; });
            save();
            if (perm() === 'default')
                ask();
            renderSettings();
            tick();
        }
        else if (a === 'alloff' && e.type === 'click') {
            all().forEach(function (d) { S.prefs[d.id] = { on: false, time: pref(d).time }; });
            save();
            renderSettings();
        }
        else if (a === 'on' && e.type === 'change') {
            setBell(id, t.checked);
        }
        else if (a === 'time' && e.type === 'change') {
            if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(t.value)) {
                return;
            }
            var d = all().filter(function (x) { return x.id === id; })[0];
            if (!d)
                return;
            var q = S.prefs[id] = S.prefs[id] || { on: false };
            q.time = t.value;
            delete S.fired[id];
            save();
            tick();
        }
    }
    window.v101DailyInit = function () { var a = $('v101DailyBar'), b = $('v101Custom'); if (a)
        a.remove(); if (b)
        b.remove(); };
    window.v101MosquesInit = function () { };
    function migrate() {
        try {
            if (localStorage.getItem('muslim-v106-mig'))
                return;
            var old = JSON.parse(localStorage.getItem('muslim-v101-daily-custom') || '[]');
            if (Array.isArray(old))
                old.slice(0, MAXC).forEach(function (t) { t = clean(t, 40); if (t.length < 2 || S.custom.length >= MAXC)
                    return; var id = 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); S.custom.push({ id: id, t: t, time: '08:00', days: null }); S.prefs[id] = { on: false, time: '08:00' }; });
            localStorage.setItem('muslim-v106-mig', '1');
            save();
        }
        catch (e) { }
    }
    window.renderDaily = renderDaily;
    window.renderDailyReminderSettings = renderSettings;
    window.saveDailyReminderSettings = function () { renderSettings(); };
    window.v6Deeds = { ask: ask, notify: notify, tick: tick, all: all, state: function () { return S; } };
    function init() {
        var sb = $('dailyReminderSettingsBox');
        if (sb && !sb.getAttribute('data-v6')) {
            sb.setAttribute('data-v6', '1');
            sb.addEventListener('click', onSettings);
            sb.addEventListener('change', onSettings);
        }
        var dl = $('dailyList');
        if (dl && !dl.getAttribute('data-v6')) {
            dl.setAttribute('data-v6', '1');
            dl.addEventListener('click', onDaily);
        }
        if (!localStorage.getItem('muslim-v106-deeds-init')) {
            try {
                localStorage.setItem('muslim-v106-deeds-init', '1');
            }
            catch (e) { }
        }
        migrate();
        window.v101DailyInit();
        renderSettings();
        renderDaily();
        pushConfig();
        regPeriodic();
        tick();
    }
    if (navigator.serviceWorker)
        navigator.serviceWorker.addEventListener('message', function (e) { var m = e.data || {}; if (m.type === 'open' && m.page && window.show)
            try {
                show(m.page);
            }
            catch (er) { } });
    document.addEventListener('visibilitychange', function () { if (!document.hidden)
        tick(); });
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();
})();
(function () {
    'use strict';
    var ic = function (n, c) { return window.v106Icon ? window.v106Icon(n, c) : ''; };
    try {
        var ua = navigator.userAgent || '', low = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || /Android/i.test(ua) && !/Chrome\/(1[2-9]\d)/.test(ua);
        var pref = localStorage.getItem('muslim-v106-lite');
        if (pref === '1' || (pref !== '0' && low))
            document.documentElement.classList.add('v6lite');
    }
    catch (e) { }
    var _show = window.show;
    if (typeof _show === 'function') {
        window.show = function (id) {
            var r = _show.apply(this, arguments);
            try {
                window.scrollTo(0, 0);
            }
            catch (e) { }
            return r;
        };
    }
    function stg() { var i = document.querySelector('.ico-install'); if (i && !i.firstChild)
        i.innerHTML = ic('download'); }
    function hdr() { var b = document.querySelector('header.top button'); if (b && !b.getAttribute('aria-label')) {
        b.setAttribute('aria-label', 'تبديل الوضع الداكن');
        b.innerHTML = ic('sun');
    } }
    function alts() { document.querySelectorAll('img:not([alt])').forEach(function (i) { i.setAttribute('alt', ''); }); document.querySelectorAll('img[alt=""]:not([role])').forEach(function (i) { i.setAttribute('role', 'presentation'); }); }
    function openParam() { try {
        var q = new URLSearchParams(location.search).get('open');
        if (q && /^[a-zA-Z0-9_-]{2,24}$/.test(q) && document.getElementById(q) && window.show)
            show(q);
    }
    catch (e) { } }
    function init() { stg(); hdr(); alts(); if (window.v106Sweep)
        window.v106Sweep(document.body); }
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', init);
    else
        init();
    window.addEventListener('load', function () { init(); openParam(); });
})();
