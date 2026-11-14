/* استدارة الحواف: شريط واحد في الإعدادات يتحكم بكل الحواف والأزرار (0 = حادة، 40 = دائرية جدًا). يُحفظ على الجهاز. */
(function () {
    'use strict';
    var KEY = 'muslim-radius', DEF = 20;
    function get() { try { var v = localStorage.getItem(KEY); var n = v === null ? DEF : parseInt(v, 10); return isFinite(n) ? Math.max(0, Math.min(40, n)) : DEF; } catch (e) { return DEF; } }
    function apply(n) { document.documentElement.style.setProperty('--rad', n + 'px'); }
    function save(n) { try { localStorage.setItem(KEY, String(n)); } catch (e) { } }
    function label(n) { return n === 0 ? 'حادة' : n <= 8 ? 'خفيفة' : n <= 24 ? 'متوسطة' : 'دائرية'; }
    apply(get());
    function bind() {
        var r = document.getElementById('radRange'), v = document.getElementById('radVal'), d = document.getElementById('radReset');
        if (!r) return false;
        var n = get(); r.value = n; if (v) v.textContent = label(n);
        r.oninput = function () { var x = +r.value; apply(x); if (v) v.textContent = label(x); };
        r.onchange = function () { save(+r.value); };
        if (d) d.onclick = function () { r.value = DEF; apply(DEF); save(DEF); if (v) v.textContent = label(DEF); };
        return true;
    }
    var t = 0, iv = setInterval(function () { if (bind() || ++t > 60) clearInterval(iv); }, 500);
    window.MuslimRadius = { set: function (n) { n = Math.max(0, Math.min(40, +n || 0)); apply(n); save(n); bind(); } };
})();
