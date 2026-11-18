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
        fetchVer(8000).then(function (v) { if (newer(v) && allowed(v.b)) apply(v); });
    }
    /* الأزرار اليدوية في الإعدادات */
    function status(t) { var e = $('updStatus'); if (e) e.textContent = t; }
    function check() {
        status('جارٍ الفحص…');
        return fetchVer(12000).then(function (v) {
            if (!v || !v.b) { status('تعذّر الاتصال الآن — النسخة المحمّلة تعمل كما هي.'); return; }
            if (!newer(v)) { status('أنت على آخر نسخة ✅'); return; }
            status('تتوفر نسخة أحدث. جارٍ التحديث…'); busy = false; apply(v);
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
    window.MuslimUpdater = { check: check, force: force, auto: auto };
    auto();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
