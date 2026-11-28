/* seo.js — ظهور المحرّكات والروابط العميقة: canonical + JSON-LD + روابط الأقسام والقرّاء + ‎?reciter= */
(function () {
    'use strict';
    var NAME = 'المسلم', AUTHOR = 'عبدالمالك عادل العرعود';
    var base = 'https://2009malek11-source.github.io/Muslim/';
    var SKIP = { home: 1, readerDetail: 1, quranDetail: 1, hadithDetail: 1, hadithCollection: 1 };   /* صفحات تفاصيل لا تُفتح بلا اختيار سابق */
    function el(t, a) { var e = document.createElement(t); for (var k in a) e.setAttribute(k, a[k]); return e; }
    function meta() {
        var h = document.head;
        if (!document.querySelector('link[rel=canonical]')) h.appendChild(el('link', { rel: 'canonical', href: base }));
        [['og:type', 'website'], ['og:site_name', NAME], ['og:locale', 'ar_AR'], ['og:title', document.title],
         ['og:description', (document.querySelector('meta[name=description]') || {}).content || ''], ['og:url', base]].forEach(function (p) {
            if (!document.querySelector('meta[property="' + p[0] + '"]')) h.appendChild(el('meta', { property: p[0], content: p[1] }));
        });
    }
    function pages() {
        var out = [];
        [].forEach.call(document.querySelectorAll('section.page'), function (s) {
            var h2 = s.querySelector('h2'), t = h2 ? h2.textContent.replace(/\s+/g, ' ').trim() : '';
            if (s.id && !SKIP[s.id] && t.length > 1 && t.length < 40) out.push({ id: s.id, t: t });
        });
        return out;
    }
    function reciters() {
        try { if (typeof RECITERS !== 'undefined') return RECITERS.map(function (r) { return r.name; }).filter(Boolean); } catch (e) { }
        return [];
    }
    function ld(ps) {
        var j = {
            '@context': 'https://schema.org', '@type': 'WebApplication', name: NAME, url: base, inLanguage: 'ar',
            applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: (document.querySelector('meta[name=description]') || {}).content || '',
            author: { '@type': 'Person', name: AUTHOR }, publisher: { '@type': 'Person', name: AUTHOR },
            copyrightHolder: { '@type': 'Person', name: AUTHOR }, copyrightYear: 2026,
            creditText: 'المسلم — ' + AUTHOR,
            featureList: ps.map(function (p) { return p.t; }),
            hasPart: ps.map(function (p) { return { '@type': 'WebPage', name: p.t, url: base + '?open=' + p.id }; })
        };
        var s = el('script', { type: 'application/ld+json' }); s.textContent = JSON.stringify(j); document.head.appendChild(s);
    }
    /* روابط قابلة للزحف تُوضع في مكانها: الإعدادات ← «عن المسلم» (لا في الصفحة الرئيسية) */
    function links(ps, rs) {
        var host = document.querySelector('#stgcat-aboutus .stgCatBody'); if (!host || document.getElementById('seoLinks')) return;
        var f = el('div', { id: 'seoLinks', class: 'seoLinks' });
        var h = '<b>أقسام ' + NAME + '</b><nav aria-label="الأقسام">' + ps.map(function (p) { return '<a href="?open=' + p.id + '">' + p.t + '</a>'; }).join('') + '</nav>';
        if (rs.length) h += '<details><summary>القرّاء (' + rs.length + ')</summary><nav aria-label="القرّاء">' + rs.map(function (n) { return '<a href="?reciter=' + encodeURIComponent(n) + '">' + n + '</a>'; }).join('') + '</nav></details>';
        h += '<small>© ' + AUTHOR + ' — جميع الحقوق محفوظة. يجوز الاقتباس مع ذكر المصدر «' + NAME + '» ورابط الموقع.</small>';
        f.innerHTML = h; host.appendChild(f);
    }
    function deep() {
        var q = new URLSearchParams(location.search), r = q.get('reciter');
        if (!r || r.length > 60 || typeof window.show !== 'function') return;
        window.show('readers');
        var i = document.getElementById('readerSearch');
        if (i) { i.value = r; i.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    function run() { var ps = pages(); meta(); ld(ps); links(ps, reciters()); deep(); }
    if (document.readyState === 'complete') setTimeout(run, 400); else window.addEventListener('load', function () { setTimeout(run, 400); });
})();
