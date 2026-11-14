/* updater.js — يضمن ظهور آخر نسخة حتى مع الإنترنت الضعيف + زر «فرض التحديث» في الإعدادات.
 * يقارن رقم النسخة الحالي بـ version.json (بلا كاش، مهلة 8 ثوانٍ). إن وُجدت نسخة أحدث: يطلب من الـ SW تنزيلها
 * (تدريجياً: يُنزَّل المتغيّر فقط) ويُظهر شريطاً يتيح «تحديث الآن». عند عدم وجود إنترنت يبقى آخر نسخة محمّلة تعمل كما هي. */
(function () {
    'use strict';
    var cur = window.__b || '', curT = +window.__t || 0;
    function $(id) { return document.getElementById(id); }
    function fetchVer() {
        var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function () { ac.abort(); }, 8000) : 0;
        return fetch('version.json?t=' + Date.now(), { cache: 'no-store', signal: ac ? ac.signal : undefined }).then(function (r) { clearTimeout(t); return r.ok ? r.json() : null; }).catch(function () { clearTimeout(t); return null; });
    }
    function force() {
        var go = function () { location.replace(location.pathname + '?v=' + Date.now()); };
        var ps = [];
        try { ps.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); })); } catch (e) { }
        try { ps.push(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^muslim-shell-|^muslim-fonts/.test(k); }).map(function (k) { return caches.delete(k); })); })); } catch (e) { }
        Promise.all(ps).then(go, go);
    }
    /* تحديث صامت: لا شريط ولا رسائل. يحدث أثناء المقدمة (3 ثوانٍ) فلا يلاحظه المستخدم.
       القاعدة: لا يُحدَّث إلا إلى نسخة زمن بنائها أحدث من الحالية (فنسخة أقدم يعطيها خادم متأخر لا تُعتبر تحديثاً → لا تذبذب).
       الأسلوب: يطلب من الـ SW تنزيل الجديد (يتحمل الإنترنت الضعيف ولا يمسح شيئاً)، فإن لم يعد التحميل وحده خلال 8 ثوانٍ
       يُحمَّل الرابط برقم جديد لتجاوز كاش المتصفح. حدّ أقصى محاولتان لكل نسخة خلال نصف ساعة. لا شيء أثناء تشغيل صوت. */
    var autoTimer = 0;
    function tries(b) { try { var o = JSON.parse(localStorage.getItem('muslim-upd') || '{}'); return o.b === b && Date.now() - o.ts < 1800000 ? o.n : 0; } catch (_) { return 0; } }
    function markTry(b) { try { localStorage.setItem('muslim-upd', JSON.stringify({ b: b, n: tries(b) + 1, ts: Date.now() })); } catch (_) { } }
    function autoApply(b) {
        if (playing()) { if (!autoTimer) autoTimer = setInterval(function () { if (!playing()) { clearInterval(autoTimer); autoTimer = 0; autoApply(b); } }, 3000); return; }
        if (tries(b) >= 2) return;
        markTry(b);
        swUpdate();
        setTimeout(function () {
            if (window.__mReloading || playing()) return;
            window.__mReloading = 1;
            location.replace(location.pathname + '?u=' + b);
        }, 8000);
    }
    var busy = false;
    function check(manual) {
        if (busy) return Promise.resolve(); busy = true;
        return fetchVer().then(function (v) {
            busy = false;
            if (!v || !v.b) { if (manual) status('تعذّر الاتصال الآن — النسخة المحمّلة تعمل كما هي.'); return; }
            if (v.b === cur || (v.t && curT && v.t <= curT)) { if (manual) status('أنت على آخر نسخة ✅'); return; }
            if (manual) status('تتوفر نسخة أحدث. جارٍ تحديثها…');
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
    function reloadOnce() {                                   // حدّ أقصى 3 إعادات تحميل تلقائية كل 5 دقائق: يقطع أي تذبذب مهما كان سببه
        if (window.__mReloading) return;
        try { var a = JSON.parse(sessionStorage.getItem('muslim-rl') || '[]').filter(function (t) { return Date.now() - t < 300000; }); if (a.length >= 3) return; a.push(Date.now()); sessionStorage.setItem('muslim-rl', JSON.stringify(a)); } catch (_) { }
        window.__mReloading = 1; location.reload();
    }
    function swUpdate() { try { navigator.serviceWorker.getRegistration('./').then(function (r) { if (r) r.update(); }).catch(function () { }); } catch (e) { } }
    function init() {
        var n = 0, iv = setInterval(function () { if (mount() || ++n > 100) clearInterval(iv); }, 700);
        setTimeout(function () { check(); swUpdate(); }, 400);                                   // فحص فوري عند كل دخول
        var lastChk = Date.now();
        function again() { if (Date.now() - lastChk < 15000) return; lastChk = Date.now(); check(); swUpdate(); }
        document.addEventListener('visibilitychange', function () { if (!document.hidden) again(); });  // عودة المستخدم للتطبيق (آيفون يُبقيه في الذاكرة)
        window.addEventListener('pageshow', function (e) { if (e.persisted) { lastChk = 0; again(); } });
        window.addEventListener('focus', again);
        window.addEventListener('online', function () { check(); swUpdate(); });
        setInterval(function () { check(); swUpdate(); }, 600000);
        if (!('serviceWorker' in navigator)) return;
        var had = !!navigator.serviceWorker.controller;
        navigator.serviceWorker.addEventListener('controllerchange', function () { if (had && !playing()) reloadOnce(); had = true; });
        navigator.serviceWorker.addEventListener('message', function (e) {
            var d = e.data || {};
            if (d.t === 'updated' && d.b && d.b !== cur && (!d.bt || !curT || d.bt > curT)) { if (!playing()) reloadOnce(); }
            if (d.t === 'bid' && d.b && d.b !== cur && d.bt && curT && d.bt > curT) {     // الصفحة أقدم من الـ SW الفعّال => أعد تحميلها مرة واحدة
                try { if (sessionStorage.getItem('muslim-bid-fix') === d.b) return; sessionStorage.setItem('muslim-bid-fix', d.b); } catch (_) { }
                if (!playing()) reloadOnce();
            }
        });
        navigator.serviceWorker.ready.then(function (r) { if (r.active) r.active.postMessage({ type: 'get-bid' }); }).catch(function () { });
    }
    window.MuslimUpdater = { check: check, force: force };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
