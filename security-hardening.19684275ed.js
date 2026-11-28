/* تحصين أمني للواجهة (طبقة دفاع إضافية) — يُحمَّل قبل كل السكربتات.
   1) تنظيف بيانات الجهات الخارجية (خرائط OSM، واجهات القرآن…) قبل وصولها للكود: لا يمكن لاسم مسجد مكتوب بشيفرة أن يُنفَّذ.
   2) منع تضمين الموقع داخل إطار موقع آخر (clickjacking).
   3) إضافة rel="noopener noreferrer" لكل رابط يفتح نافذة جديدة. */
(function () {
    'use strict';
    /* --- 2) منع التضمين في إطار --- */
    try { if (window.top !== window.self) { document.documentElement.style.display = 'none'; try { window.top.location = window.self.location.href; } catch (e) { } } } catch (e) { document.documentElement.style.display = 'none'; }

    /* --- 1) تنظيف JSON القادم من مضيفين خارجيين --- */
    var HOSTS = /^(overpass[a-z0-9.-]*|nominatim\.openstreetmap\.org|[a-z0-9.-]*openstreetmap\.[a-z]+|router\.project-osrm\.org|api\.alquran\.cloud|(www\.)?mp3quran\.net|places\.googleapis\.com|maps\.mail\.ru|[a-z0-9.-]*quran\.com|api\.aladhan\.com|api\.bigdatacloud\.net|ipapi\.co|ipwho\.is|api\.open-meteo\.com)$/i;
    function scrubStr(s) {
        if (s.indexOf('<') < 0 && s.indexOf('>') < 0 && s.indexOf('"') < 0 && s.indexOf("'") < 0 && s.indexOf('`') < 0 && s.indexOf('${') < 0 && s.toLowerCase().indexOf('javascript:') < 0) return s;
        return s.replace(/[<>`]/g, '').replace(/"/g, '”').replace(/'/g, '’').replace(/\$\{/g, '$ {').replace(/javascript\s*:/gi, '');
    }
    function scrub(v, depth) {
        if (depth > 40) return null;
        if (typeof v === 'string') return scrubStr(v);
        if (Array.isArray(v)) { for (var i = 0; i < v.length; i++) v[i] = scrub(v[i], depth + 1); return v; }
        if (v && typeof v === 'object') {
            Object.keys(v).forEach(function (k) {
                if (k === '__proto__' || k === 'constructor' || k === 'prototype') { delete v[k]; return; }
                v[k] = scrub(v[k], depth + 1);
            });
        }
        return v;
    }
    var _fetch = window.fetch;
    if (typeof _fetch === 'function') {
        window.fetch = function (input, init) {
            var url = ''; try { url = typeof input === 'string' ? input : (input && input.url) || ''; } catch (e) { }
            var host = ''; try { host = new URL(url, location.href).hostname; } catch (e) { }
            var p = _fetch.apply(this, arguments);
            if (!host || host === location.hostname || !HOSTS.test(host)) return p;
            return p.then(function (r) {
                var ct = (r.headers && r.headers.get && r.headers.get('content-type')) || '';
                if (!r.ok || ct.indexOf('json') < 0) return r;
                return r.clone().text().then(function (t) {
                    var j; try { j = JSON.parse(t); } catch (e) { return r; }
                    var hd = new Headers(r.headers); hd.delete('content-length'); hd.delete('content-encoding');
                    return new Response(JSON.stringify(scrub(j, 0)), { status: r.status, statusText: r.statusText, headers: hd });
                }).catch(function () { return r; });
            });
        };
    }

    /* --- 3) روابط النوافذ الجديدة --- */
    function fixLinks(root) {
        try {
            (root.querySelectorAll ? root.querySelectorAll('a[target="_blank"]') : []).forEach(function (a) {
                var rel = (a.getAttribute('rel') || '').toLowerCase();
                if (rel.indexOf('noopener') < 0 || rel.indexOf('noreferrer') < 0) a.setAttribute('rel', 'noopener noreferrer');
            });
        } catch (e) { }
    }
    function startObs() {
        fixLinks(document);
        try { new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('a[target="_blank"]')) fixLinks(n.parentNode || document); else fixLinks(n); } }); }); }).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) { }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startObs); else startObs();
    window.__muslimScrub = scrub;
})();
