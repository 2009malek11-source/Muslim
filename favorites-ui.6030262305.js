/* مظهر موحّد لأزرار المفضلة: نجمة فضية ممتلئة عند الإضافة، مفرغة عند عدمها، مع رسالة قصيرة عند كل تبديل. */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';
    function star(on) {
        return '<svg class="favSvg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><defs><linearGradient id="favG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".55" stop-color="#c5ccd4"/><stop offset="1" stop-color="#8f99a5"/></linearGradient></defs><path d="M12 2.8l2.8 5.9 6.4.9-4.7 4.5 1.1 6.4L12 17.4 6.4 20.5l1.1-6.4L2.8 9.6l6.4-.9z" stroke-linejoin="round" ' + (on ? 'fill="url(#favG)" stroke="#7d8793" stroke-width="1.2"' : 'fill="none" stroke="currentColor" stroke-width="1.8"') + '/></svg>';
    }
    function decorate(root) {
        (root || document).querySelectorAll('.favBtn:not(.rwFilter)').forEach(function (b) {
            var raw = (b.getAttribute('data-ft') !== null ? b.getAttribute('data-ft') : b.textContent).replace(/\s+/g, ' ').trim();
            var onNow = b.classList.contains('active');
            if (b.getAttribute('data-fd') === (onNow ? '1' : '0') && b.getAttribute('data-ft') === raw.replace(/[★☆⭐]/g, '').trim()) return;
            var rest = raw.replace(/[★☆⭐]/g, '').trim();
            var iconOnly = rest === '';
            var isRemove = /^إزالة/.test(rest);
            if (isRemove) { b.setAttribute('data-fd', '1'); b.setAttribute('data-ft', rest); return; }
            if (!iconOnly && !/المفضلة|مفضل/.test(rest)) { b.setAttribute('data-fd', onNow ? '1' : '0'); b.setAttribute('data-ft', rest); return; }
            b.setAttribute('data-ft', rest);
            b.setAttribute('data-fd', onNow ? '1' : '0');
            b.setAttribute('aria-pressed', onNow ? 'true' : 'false');
            b.innerHTML = star(onNow) + (iconOnly ? '' : '<span class="favTx">' + (onNow ? 'في المفضلة' : 'أضف للمفضلة') + '</span>');
            if (!b.getAttribute('aria-label')) b.setAttribute('aria-label', onNow ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة');
        });
    }
    var tm = 0;
    function toast(t) {
        var d = document.getElementById('favToast');
        if (!d) { d = document.createElement('div'); d.id = 'favToast'; d.setAttribute('role', 'status'); document.body.appendChild(d); }
        d.textContent = t; d.classList.add('show'); clearTimeout(tm); tm = setTimeout(function () { d.classList.remove('show'); }, 1800);
    }
    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('.favBtn:not(.rwFilter)'); if (!b) return;
        var before = b.classList.contains('active');
        setTimeout(function () {
            var now = b.isConnected ? b.classList.contains('active') : !before;
            if (b.isConnected && now === before) now = !before;   // بعض الأزرار لا تبدّل الصنف بنفسها
            toast(now ? '★ تمت الإضافة إلى المفضلة' : 'أُزيلت من المفضلة');
            if (b.isConnected) { b.classList.toggle('active', now); b.classList.add('favPop'); setTimeout(function () { b.classList.remove('favPop'); }, 400); }
            decorate(document);
        }, 140);
    }, true);
    var pend = 0;
    new MutationObserver(function () { if (pend) return; pend = requestAnimationFrame(function () { pend = 0; decorate(document); }); }).observe(document.documentElement, { childList: true, subtree: true });
    decorate(document);
})();
