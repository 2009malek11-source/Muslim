(function () {
    'use strict';
    // شبكة أمان للتنقل: بعد أي ضغطة على قسم نتأكد أن القسم المطلوب هو الظاهر فعلًا، وإلا نُظهره فورًا.
    function install() {
        var os = window.show;
        if (typeof os !== 'function' || os.__perf) return false;
        var seq = 0;
        var w = function (id) {
            var my = ++seq, r;
            try { r = os.apply(this, arguments); } catch (e) { console.warn('show', id, e); }
            setTimeout(function () {
                if (my !== seq) return;           // ضغطة أحدث حلّت محلها
                var el = id && document.getElementById(id);
                if (el && el.classList.contains('page') && !el.classList.contains('active')) {
                    document.querySelectorAll('.page.active').forEach(function (p) { p.classList.remove('active'); });
                    el.classList.add('active');
                    try { window.scrollTo(0, 0); } catch (e) { }
                }
            }, 300);
            return r;
        };
        w.__perf = 1; window.show = w; return true;
    }
    var n = 0, iv = setInterval(function () { if (install() || ++n > 40) clearInterval(iv); }, 500);
    // لا نترك المراقبات تعمل والتبويب مخفي
    document.addEventListener('visibilitychange', function () { document.documentElement.classList.toggle('tabHidden', document.hidden); });
})();
