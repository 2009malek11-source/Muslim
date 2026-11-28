/* updater.js — نظام التحديث (مبنيّ من الصفر).
 * القاعدة: ملف version.json هو المرجع {b: رقم النسخة, t: زمن البناء}. إن كان زمنه أحدث من النسخة المفتوحة فنحن قديمون.
 * 1) عند فتح التطبيق مباشرةً، وعند العودة إليه بعد غياب، يُقرأ version.json بلا كاش (مهلة 8 ثوانٍ).
 * 2) إن وُجدت نسخة أحدث: تُلغى الخدمة المخزَّنة وتُحذف كاشات الواجهة فقط (لا تُمس بيانات المستخدم ولا المصحف ولا الأحاديث ولا الصوتيات)
 *    ثم تُفتح الصفحة بعنوان فريد لهذه النسخة (?v=رقم النسخة) فتأتي من الشبكة لا من أي كاش.
 * 3) حماية من الحلقات: محاولتان كحدٍّ أقصى لكل نسخة، وبينهما 10 دقائق على الأقل؛ وإن فشلت لا يتغير شيء ويبقى التطبيق يعمل.
 * 4) لا يُعاد التحميل أثناء تشغيل صوت؛ ينتظر حتى يتوقف.
 * 5) بلا إنترنت: لا يحدث شيء إطلاقًا، وتعمل النسخة المحفوظة كما هي. */
(function () {
    'use strict';
    var cur = window.__b || '', curT = +window.__t || 0, KEY = 'muslim-upd-try', busy = false;
    function $(id) { return document.getElementById(id); }
    function base() { return location.pathname.replace(/[^\/]*$/, ''); }
    function fetchVer(ms) {
        var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function () { ac.abort(); }, ms || 8000) : 0;
        return fetch(base() + 'version.json?t=' + Date.now(), { cache: 'no-store', signal: ac ? ac.signal : undefined })
            .then(function (r) { clearTimeout(t); return r.ok ? r.json() : null; }).catch(function () { clearTimeout(t); return null; });
    }
    function playing() { return [].some.call(document.querySelectorAll('audio'), function (x) { return !x.paused && !x.ended; }); }
    function toast(t) {
        var e = $('updToast');
        if (!e) { e = document.createElement('div'); e.id = 'updToast'; e.setAttribute('role', 'status'); document.body.appendChild(e); }
        e.textContent = t; e.className = 'on';
    }
    /* يحذف الخدمة وكاشات الواجهة فقط ثم يفتح العنوان الفريد */
    function reloadTo(tag) {
        if (window.__mReloading) return; window.__mReloading = 1;
        var go = function () { location.replace(base() + 'index.html?v=' + encodeURIComponent(tag || Date.now())); };
        var ps = [];
        try { ps.push(navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.unregister(); })); })); } catch (e) { }
        try { ps.push(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return /^muslim-shell-/.test(k); }).map(function (k) { return caches.delete(k); })); })); } catch (e) { }
        var done = false, fin = function () { if (!done) { done = true; go(); } };
        Promise.all(ps).then(fin, fin); setTimeout(fin, 2500);
    }
    function allowed(b) {
        try {
            var s = JSON.parse(localStorage.getItem(KEY) || '{}');
            if (s.b !== b) return true;
            return (s.n || 0) < 2 && Date.now() - (s.ts || 0) > 600000;
        } catch (e) { return true; }
    }
    function note(b) {
        try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); localStorage.setItem(KEY, JSON.stringify({ b: b, n: (s.b === b ? s.n || 0 : 0) + 1, ts: Date.now() })); } catch (e) { }
    }
    function newer(v) { return !!(v && v.b && v.t && v.b !== cur && v.t > curT); }
    function apply(v) {
        if (busy) return; busy = true;
        var run = function () {
            if (playing()) { setTimeout(run, 3000); return; }
            note(v.b); toast('جارٍ التحديث إلى آخر نسخة…'); reloadTo(v.b);
        };
        run();
    }
    /* فحص تلقائي */
    function auto() {
        if (busy || !window.fetch || navigator.onLine === false) return;
        swUpdate(); fetchVer(8000).then(function (v) { if (newer(v)) pending(v); });
    }
    /* الأزرار اليدوية في الإعدادات */
    function status(t) { var e = $('updStatus'); if (e) e.textContent = t; }
    function check() {
        status('جارٍ الفحص…');
        return fetchVer(12000).then(function (v) {
            if (!v || !v.b) { status('تعذّر الاتصال الآن — النسخة المحمّلة تعمل كما هي.'); return; }
            if (!newer(v)) { status('أنت على آخر نسخة ✅'); return; }
            status('تتوفر نسخة أحدث ✨'); swUpdate(); showNotice(v);
        });
    }
    function force() { toast('جارٍ إعادة تنزيل التطبيق…'); busy = true; reloadTo(Date.now()); }
    var mounted = false;
    function mount() {
        if (mounted || $('stgcat-ver')) return true;
        var set = $('settings'); if (!set) return false;
        var d = document.createElement('details'); d.className = 'stgCat'; d.id = 'stgcat-ver';
        d.innerHTML = '<summary><span class="ci">🔄</span>النسخة والتحديث<span class="cs">▾</span></summary><div class="stgCatBody"><div class="stgGroup open"><div class="stgRow"><div class="mini">رقم النسخة الحالية: <b style="direction:ltr;unicode-bidi:plaintext">' + (cur || '—') + '</b><br>يتحدّث التطبيق تلقائيًا عند الفتح إن وُجدت نسخة أحدث. إن ظهرت لك نسخة قديمة اضغط «فرض التحديث» (يلزم إنترنت؛ بياناتك وإعداداتك تبقى).</div></div><div class="stgRow"><button type="button" id="updCheck" class="btn">🔍 فحص التحديث</button> <button type="button" id="updForce" class="btn">⚡ فرض التحديث</button></div><div class="stgRow"><div class="mini" id="updStatus"></div></div></div></div>';
        var ref = $('stgcat-about') || set.querySelector('.stgCat'); if (ref && ref.parentNode) ref.parentNode.insertBefore(d, ref); else set.appendChild(d);
        $('updCheck').onclick = check;
        $('updForce').onclick = function () { if (confirm('سيُعاد تنزيل التطبيق بالكامل. متابعة؟')) force(); };
        mounted = true; return true;
    }
    function init() { var n = 0, iv = setInterval(function () { if (mount() || ++n > 100) clearInterval(iv); }, 700); }
    var hiddenAt = 0;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) hiddenAt = Date.now();
        else if (hiddenAt && Date.now() - hiddenAt > 30 * 60000) { hiddenAt = 0; auto(); }
    });
    /* ===== إشعار التحديث: التنزيل في الخلفية، ولا إعادة تحميل إلا بموافقة المستخدم ===== */
    var waitingSW = null, shownFor = '', accepted = false, later = 0, trackedReg = null, pendTimer = 0;
    function track(reg) {
        if (!reg || trackedReg === reg) return; trackedReg = reg;
        if (reg.waiting && navigator.serviceWorker.controller) { waitingSW = reg.waiting; showNotice(); }
        reg.addEventListener('updatefound', function () {
            var w = reg.installing; if (!w) return;
            w.addEventListener('statechange', function () {
                if (w.state === 'installed' && navigator.serviceWorker.controller) { waitingSW = reg.waiting || w; showNotice(); }
            });
        });
    }
    function swUpdate() {
        try {
            if (!navigator.serviceWorker || navigator.onLine === false) return;
            navigator.serviceWorker.getRegistration().then(function (reg) { if (!reg) return; track(reg); reg.update().catch(function () { }); }).catch(function () { });
        } catch (e) { }
    }
    /* نسخة أحدث على الخادم: ننتظر اكتمال تنزيل الـ SW؛ وإن لم يكتمل خلال 90 ثانية نعرض الإشعار بمسار الاحتياط */
    function pending(v) {
        if (waitingSW) { showNotice(v); return; }
        var supported = !!(navigator.serviceWorker && navigator.serviceWorker.controller);
        if (!supported) { showNotice(v); return; }
        clearTimeout(pendTimer); pendTimer = setTimeout(function () { showNotice(v); }, 90000);
    }
    function showNotice(v) {
        if (accepted || $('updNotice')) return;
        if (Date.now() - later < 30 * 60000) return;
        var box = document.createElement('div'); box.id = 'updNotice'; box.setAttribute('role', 'alertdialog'); box.setAttribute('aria-label', 'تحديث جديد');
        var t = document.createElement('span'); t.textContent = 'يتوفر تحديث جديد لموقع المسلم';
        var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'updGo'; ok.textContent = 'تحديث الآن';
        var no = document.createElement('button'); no.type = 'button'; no.className = 'updLater'; no.textContent = 'لاحقًا'; no.setAttribute('aria-label', 'لاحقًا');
        ok.onclick = function () { accept(v); };
        no.onclick = function () { later = Date.now(); box.remove(); };
        box.appendChild(t); box.appendChild(ok); box.appendChild(no); document.body.appendChild(box);
    }
    function reloadGuard() { try { var l = +sessionStorage.getItem('muslim-upd-rl') || 0; if (Date.now() - l < 20000) return false; sessionStorage.setItem('muslim-upd-rl', String(Date.now())); } catch (e) { } return true; }
    function accept(v) {
        if (accepted) return; accepted = true; var b = $('updNotice'); if (b) { b.querySelector('span').textContent = 'جارٍ التحديث…'; b.querySelectorAll('button').forEach(function (x) { x.disabled = true; }); }
        var tag = (v && v.b) || Date.now();
        if (waitingSW) {
            var done = false, go = function () { if (done) return; done = true; if (reloadGuard()) location.replace(base() + 'index.html?v=' + encodeURIComponent(tag)); else location.reload(); };
            try { navigator.serviceWorker.addEventListener('controllerchange', go); waitingSW.postMessage({ type: 'skip-waiting' }); } catch (e) { reloadTo(tag); return; }
            setTimeout(function () { if (!done) { done = true; reloadTo(tag); } }, 5000);
        } else reloadTo(tag);
    }
    if (navigator.serviceWorker) {
        navigator.serviceWorker.getRegistration().then(track).catch(function () { });
        setInterval(function () { if (document.visibilityState === 'visible') swUpdate(); }, 30 * 60000);
    }
    window.addEventListener('online', function () { setTimeout(auto, 1500); });

    /* ===== تحديث إجباري صامت خلال أول ~٣ ثوانٍ (أثناء المقدمة) كي لا يلاحظه المستخدم =====
       يُنفَّذ فقط إن وُجدت نسخة أحدث، وبحماية من الحلقات (مرتان كحدٍّ أقصى لكل نسخة)، وقبل تشغيل أي صوت.
       ويحذف كاشات الواجهة القديمة المتبقية من إصدارات سابقة (لا يمسّ المصحف/الصوتيات/الأحاديث/الإعدادات). */
    function legacyClean() {
        try {
            if (localStorage.getItem('muslim-legacy-clean') === '1' || !window.caches) return;
            caches.keys().then(function (ks) {
                return Promise.all(ks.filter(function (k) { return !/^muslim-/.test(k) && /(shell|static|precache|runtime|workbox|app-?v?\d|^v\d|almuslim|cache-v)/i.test(k) && !/(audio|quran|files|data|font|mushaf|hadith)/i.test(k); }).map(function (k) { return caches.delete(k); }));
            }).then(function () { try { localStorage.setItem('muslim-legacy-clean', '1'); } catch (e) { } }).catch(function () { });
        } catch (e) { }
    }
    function early() {
        legacyClean();
        if (busy || !window.fetch || navigator.onLine === false) return;
        fetchVer(2800).then(function (v) {
            if (!newer(v)) return;
            var inWindow = (window.performance && performance.now ? performance.now() : 0) < 3600;
            if (inWindow && allowed(v.b) && !playing() && !busy) { busy = true; note(v.b); reloadTo(v.b); }
            else pending(v);
        });
    }
    window.MuslimUpdater = { check: check, force: force, auto: auto };
    early();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
