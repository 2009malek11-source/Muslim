/* updater.js — يضمن ظهور آخر نسخة حتى مع الإنترنت الضعيف + زر «فرض التحديث» في الإعدادات.
 * يقارن رقم النسخة الحالي بـ version.json (بلا كاش، مهلة 8 ثوانٍ). إن وُجدت نسخة أحدث: يطلب من الـ SW تنزيلها
 * (تدريجياً: يُنزَّل المتغيّر فقط) ويُظهر شريطاً يتيح «تحديث الآن». عند عدم وجود إنترنت يبقى آخر نسخة محمّلة تعمل كما هي. */
(function () {
    'use strict';
    var cur = window.__b || '', curT = +window.__t || 0;
    function $(id) { return document.getElementById(id); }
    function fetchVer(ms) {
        var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function () { ac.abort(); }, ms || 12000) : 0;
        return fetch('version.json?t=' + Date.now(), { cache: 'no-store', signal: ac ? ac.signal : undefined }).then(function (r) { clearTimeout(t); return r.ok ? r.json() : null; }).catch(function () { clearTimeout(t); return null; });
    }
    function force() {
        var go = function () { location.replace(location.pathname + '?v=' + Date.now()); };
        var ps = [];
        try { ps.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); })); } catch (e) { }
        try { ps.push(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^muslim-shell-|^muslim-fonts/.test(k); }).map(function (k) { return caches.delete(k); })); })); } catch (e) { }
        Promise.all(ps).then(go, go);
    }
    /* تحديث تلقائي واحد فقط، داخل أول 3 ثوانٍ (شاشة الترحيب) وبلا أي حلقات:
       - مرة واحدة لكل جلسة، ولا أكثر من مرة كل دقيقة.
       - يقرأ version.json بلا كاش، ثم يجلب index.html الخاص بتلك النسخة نفسها ويتحقق أن زمن بنائه أحدث من الحالي ومطابق لما أُعلن؛
         فإن كان الخادم أو الـ CDN يعيد نسخة أقدم لا يحدث شيء (فلا يتنقل المستخدم بين نسخ قديمة).
       - عند التأكد يُلغي الـ SW ويفتح العنوان نفسه الذي جُلب وتحقق منه (فيُقدَّم من الكاش المحلي لا من حافة أخرى)، فتظهر النسخة الأخيرة فقط.
       - لا شيء يعيد التحميل تلقائيًا بعد ذلك (لا فحص دوري ولا عند العودة للتطبيق ولا عند تبدّل الـ SW). */
    function early() { try { return performance.now() < 3300; } catch (e) { return true; } }
    function base() { return location.pathname.replace(/[^\/]*$/, ''); }
    function goLatest(b) {
        if (window.__mReloading) return; window.__mReloading = 1;
        try { sessionStorage.setItem('muslim-auto', b); localStorage.setItem('muslim-auto-ts', String(Date.now())); } catch (_) { }
        var go = function () { location.replace(base() + 'index.html?v=' + encodeURIComponent(b)); };
        try { navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); }).then(go, go); } catch (e) { go(); }
    }
    function autoUpdate() {
        if (!window.fetch) return;
        try { if (sessionStorage.getItem('muslim-auto')) return; if (Date.now() - (+localStorage.getItem('muslim-auto-ts') || 0) < 60000) return; } catch (_) { }
        fetchVer(2200).then(function (v) {
            if (!v || !v.b || v.b === cur || !v.t || v.t <= curT || !early()) return;
            var ac = window.AbortController ? new AbortController() : null, tm = ac ? setTimeout(function () { ac.abort(); }, 1800) : 0;
            return fetch('index.html?v=' + encodeURIComponent(v.b), { cache: 'reload', signal: ac ? ac.signal : undefined }).then(function (r) { clearTimeout(tm); return r.ok ? r.text() : ''; }).then(function (html) {
                var m = /window\.__t\s*=\s*(\d+)/.exec(html), n = m ? +m[1] : 0;
                if (n && n >= v.t && n > curT && early() && !playing()) goLatest(v.b);
            });
        }).catch(function () { });
    }
    /* الزر اليدوي «فحص التحديث»: إن وُجدت نسخة أحدث يُنفَّذ «فرض التحديث» */
    function check(manual) {
        return fetchVer(12000).then(function (v) {
            if (!v || !v.b) { status('تعذّر الاتصال الآن — النسخة المحمّلة تعمل كما هي.'); return; }
            if (v.b === cur || (v.t && curT && v.t <= curT)) { status('أنت على آخر نسخة ✅'); return; }
            status('تتوفر نسخة أحدث. جارٍ تحديثها…'); force();
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
    function init() {
        var n = 0, iv = setInterval(function () { if (mount() || ++n > 100) clearInterval(iv); }, 700);
    }
    window.MuslimUpdater = { check: check, force: force };
    autoUpdate();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
