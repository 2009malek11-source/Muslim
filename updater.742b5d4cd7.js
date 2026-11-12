/* updater.js — يضمن ظهور آخر نسخة حتى مع الإنترنت الضعيف + زر «فرض التحديث» في الإعدادات.
 * يقارن رقم النسخة الحالي بـ version.json (بلا كاش، مهلة 8 ثوانٍ). إن وُجدت نسخة أحدث: يطلب من الـ SW تنزيلها
 * (تدريجياً: يُنزَّل المتغيّر فقط) ويُظهر شريطاً يتيح «تحديث الآن». عند عدم وجود إنترنت يبقى آخر نسخة محمّلة تعمل كما هي. */
(function () {
    'use strict';
    var cur = window.__b || '';
    function $(id) { return document.getElementById(id); }
    function fetchVer() {
        var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function () { ac.abort(); }, 8000) : 0;
        return fetch('version.json?t=' + Date.now(), { cache: 'no-store', signal: ac ? ac.signal : undefined }).then(function (r) { clearTimeout(t); return r.ok ? r.json() : null; }).catch(function () { clearTimeout(t); return null; });
    }
    function bar(msg, btn) {
        var b = $('updBar');
        if (!b) {
            b = document.createElement('div'); b.id = 'updBar';
            b.style.cssText = 'position:fixed;z-index:9990;left:10px;right:10px;top:calc(8px + env(safe-area-inset-top,0px));background:#1d624f;color:#fff;border-radius:14px;padding:10px 12px;display:flex;gap:10px;align-items:center;justify-content:space-between;font:600 13px/1.4 inherit;box-shadow:0 8px 24px rgba(0,0,0,.35);direction:rtl';
            document.body.appendChild(b);
        }
        b.innerHTML = '<span></span><span style="display:flex;gap:6px"></span>';
        b.firstChild.textContent = msg;
        if (btn) { var x = document.createElement('button'); x.textContent = btn; x.style.cssText = 'border:0;border-radius:10px;padding:7px 12px;background:#fff;color:#1d624f;font:700 13px inherit;cursor:pointer'; x.onclick = force; b.lastChild.appendChild(x); }
        var c = document.createElement('button'); c.textContent = '✕'; c.setAttribute('aria-label', 'إغلاق'); c.style.cssText = 'border:0;background:transparent;color:#fff;font-size:16px;cursor:pointer'; c.onclick = function () { b.remove(); }; b.lastChild.appendChild(c);
    }
    function force() {
        var go = function () { location.replace(location.pathname + '?v=' + Date.now()); };
        var ps = [];
        try { ps.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); })); } catch (e) { }
        try { ps.push(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^muslim-shell-|^muslim-fonts/.test(k); }).map(function (k) { return caches.delete(k); })); })); } catch (e) { }
        Promise.all(ps).then(go, go);
    }
    /* تحديث تلقائي دون استئذان: يُجرَّب التحديث الهادئ عبر الـ SW (يعيد التحميل وحده)، فإن لم يحدث خلال 20 ثانية يُفرض التحديث.
       لا يُنفَّذ أثناء تشغيل صوت (ينتظر توقفه)، ولا يتكرر لنفس النسخة أكثر من مرة في الجلسة منعاً للحلقات. */
    var autoTimer = 0;
    function autoApply(b) {
        if (autoTimer) return;
        try { if (sessionStorage.getItem('muslim-auto-upd') === b) { bar('تتوفر نسخة أحدث من التطبيق', 'تحديث الآن'); return; } } catch (_) { }
        if (playing()) { bar('سيُحدَّث التطبيق تلقائياً عند توقف الصوت'); return; }
        autoTimer = setTimeout(function () {
            autoTimer = 0;
            if (playing()) return;
            try { sessionStorage.setItem('muslim-auto-upd', b); } catch (_) { }
            force();
        }, 20000);
    }
    var busy = false;
    function check(manual) {
        if (busy) return Promise.resolve(); busy = true;
        return fetchVer().then(function (v) {
            busy = false;
            if (!v || !v.b) { if (manual) status('تعذّر الاتصال الآن — النسخة المحمّلة تعمل كما هي.'); return; }
            if (v.b === cur) { if (manual) status('أنت على آخر نسخة ✅'); return; }
            status('تتوفر نسخة أحدث. جارٍ تحديثها تلقائياً…');
            try { navigator.serviceWorker.getRegistration().then(function (r) { if (r) r.update(); }); } catch (e) { }
            autoApply(v.b);
        });
    }
    function status(t) { var e = $('updStatus'); if (e) e.textContent = t; }
    var mounted = false;
    function mount() {
        if (mounted || $('stgcat-ver')) return true;
        var set = $('settings'); if (!set) return false;
        var d = document.createElement('details'); d.className = 'stgCat'; d.id = 'stgcat-ver';
        d.innerHTML = '<summary><span class="ci">🔄</span>النسخة والتحديث<span class="cs">▾</span></summary><div class="stgCatBody"><div class="stgGroup open"><div class="stgRow"><div class="mini">رقم النسخة الحالية: <b style="direction:ltr;unicode-bidi:plaintext">' + (cur || '—') + '</b><br>إن ظهرت لك نسخة قديمة اضغط «فرض التحديث» (يلزم اتصال بالإنترنت؛ بياناتك وإعداداتك تبقى).</div></div><div class="stgRow"><button type="button" id="updCheck" class="btn">🔍 فحص التحديث</button> <button type="button" id="updForce" class="btn">⚡ فرض التحديث</button></div><div class="stgRow"><div class="mini" id="updStatus"></div></div></div></div>';
        var ref = $('stgcat-about') || set.querySelector('.stgCat'); if (ref && ref.parentNode) ref.parentNode.insertBefore(d, ref); else set.appendChild(d);
        $('updCheck').onclick = function () { status('جارٍ الفحص…'); check(true); };
        $('updForce').onclick = function () { if (confirm('سيُعاد تنزيل التطبيق بالكامل. متابعة؟')) { status('جارٍ التحديث…'); force(); } };
        mounted = true; return true;
    }
    function playing() { return [].some.call(document.querySelectorAll('audio'), function (x) { return !x.paused && !x.ended; }); }
    function reloadOnce() { if (window.__mReloading) return; window.__mReloading = 1; location.reload(); }
    function swUpdate() { try { navigator.serviceWorker.getRegistration('./').then(function (r) { if (r) r.update(); }).catch(function () { }); } catch (e) { } }
    function init() {
        var n = 0, iv = setInterval(function () { if (mount() || ++n > 100) clearInterval(iv); }, 700);
        setTimeout(function () { check(); swUpdate(); }, 2500);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) { check(); swUpdate(); } });
        window.addEventListener('online', function () { check(); swUpdate(); });
        setInterval(function () { check(); swUpdate(); }, 600000);
        if (!('serviceWorker' in navigator)) return;
        var had = !!navigator.serviceWorker.controller;
        navigator.serviceWorker.addEventListener('controllerchange', function () { if (had && !playing()) reloadOnce(); had = true; });
        navigator.serviceWorker.addEventListener('message', function (e) {
            var d = e.data || {};
            if (d.t === 'updated' && d.b && d.b !== cur) { if (playing()) bar('تم تحديث التطبيق', 'إعادة التحميل'); else reloadOnce(); }
            if (d.t === 'bid' && d.b && d.b !== cur) {                 // الصفحة أقدم من الـ SW الفعّال => أعد تحميلها مرة واحدة
                try { if (sessionStorage.getItem('muslim-bid-fix') === d.b) return; sessionStorage.setItem('muslim-bid-fix', d.b); } catch (_) { }
                if (!playing()) reloadOnce(); else bar('تتوفر نسخة أحدث من التطبيق', 'تحديث الآن');
            }
        });
        navigator.serviceWorker.ready.then(function (r) { if (r.active) r.active.postMessage({ type: 'get-bid' }); }).catch(function () { });
    }
    window.MuslimUpdater = { check: check, force: force };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
