/* reciters-nationality.js — جنسية القارئ على بطاقة القارئ وفي صفحته
* لا جنسية لأحمد خضر/الطرابلسي عمداً: المصادر متضاربة (تونسي/لبناني/ليبي) فلا تُعرض حتى تُؤكَّد.
 * القاعدة: لا تُعرض جنسية إلا إذا كان الاسم معروفاً في الجدول أدناه (لا تخمين). لإضافة قارئ: أضف سطراً [مفتاح_الاسم_بلا_مسافات, 'رمز الدولة'].
 * أو ضع الحقل nat:'LY' في تعريف القارئ نفسه.
 */
(function () {
    'use strict';
    var C = {
        SA: ['سعودي', '🇸🇦'], EG: ['مصري', '🇪🇬'], KW: ['كويتي', '🇰🇼'], LY: ['ليبي', '🇱🇾'], MA: ['مغربي', '🇲🇦'], DZ: ['جزائري', '🇩🇿'],
        AE: ['إماراتي', '🇦🇪'], TD: ['تشادي', '🇹🇩'], IQ: ['عراقي', '🇮🇶'], YE: ['يمني', '🇾🇪'], SD: ['سوداني', '🇸🇩'], TN: ['تونسي', '🇹🇳'], QA: ['قطري', '🇶🇦']
    };
    function norm(s) { return String(s || '').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/[^؀-ۿ0-9a-zA-Z]/g, ''); }
    // مفاتيح بعد التطبيع (بلا مسافات). الأطول أولاً تلقائياً.
    var T = {
        SA: ['عبدالرحمنالسديس', 'السديس', 'سعودالشريم', 'الشريم', 'ماهرالمعيقلي', 'المعيقلي', 'سعدالغامدي', 'ياسرالدوسري', 'عليالحذيفي', 'احمدالحذيفي', 'الحذيفي', 'صلاحالبدير', 'البدير', 'بندربليله', 'عليجابر', 'ناصرالقطامي', 'عبدالمحسنالقاسم', 'عبدالمحسنالحارثي', 'خالدالجليل', 'احمدالعجمي', 'عبداللهالجهني', 'عبداللهعوادالجهني', 'عبداللهبصفر', 'محمداللحيدان', 'محمدايوب', 'محمدالبراك', 'ابراهيمالاخضر', 'عبدالباريالثبيتي', 'صالحال طالب'.replace(' ', ''), 'خالدالقحطاني', 'عبداللهالموسي', 'اسامهخياط', 'عبداللهخياط', 'فيصلغزاوي', 'ماجدالزامل', 'عبدالعزيزالزهراني', 'محمدالمحيسني'],
        KW: ['مشاريراشدالعفاسي', 'مشاريالعفاسي', 'العفاسي', 'فهدالكندري', 'نبيلالرفاعي', 'عبداللهالكندري', 'صلاحالهاشم', 'ياسرالفيلكاوي'],
        EG: ['عبدالباسطعبدالصمد', 'عبدالباسط', 'محمودخليلالحصري', 'الحصري', 'المنشاوي', 'مصطفىاسماعيل', 'مصطفياسماعيل', 'محمودعليالبنا', 'الطبلاوي', 'محمدرفعت', 'الشعشاعي', 'ياسرسلامه', 'محمدجبريل', 'ابوالعينينشعيشع', 'شعيشع', 'السيدسعيد', 'الشحاتانور', 'احمدنعينع', 'نعينع', 'احمدعامر', 'راغبمصطفىغلوش', 'راغبمصطفيغلوش', 'طهالفشني', 'الفشني', 'كامليوسفالبهتيمي', 'البهتيمي', 'عليحجاجالسويسي', 'عبدالرحمنمسعد', 'عبدالعظيمزاهر', 'محمودالخشت', 'السيدمتولي'],
        LY: ['نورالدينالمسلاتي', 'المسلاتي', 'مصطفىالفرجاني', 'مصطفيالفرجاني', 'وليدالنائحي', 'النائحي'],
        MA: ['عمرالقزابري', 'القزابري'], DZ: ['ياسينالجزائري'],
        AE: ['هزاعالبلوشي', 'صلاحبوخاطر'], TD: ['ادريسابكر'], IQ: ['رعدالكردي', 'رعدمحمدالكردي'],
        YE: ['عبدالوليالاركاني', 'وديعاليمني'], SD: ['نورينمحمدصديق', 'الزينمحمداحمد']
    };
    var MORE = {
        SA: ['فارسعباد', 'عبدالباريالثبيتي', 'الثبيتي', 'صلاحالبدير', 'البدير', 'خالدالغامدي', 'ابراهيمالاخضر', 'عبدالعزيزالزهراني', 'عبداللهخياط', 'عبدالمحسنالقاسم', 'محمداللحيدان', 'احمدبنعليالعجمي', 'العجمي', 'عادلالكلباني', 'ناصرالقطامي', 'القطامي', 'توفيقالصائغ', 'سهلياسين', 'صالحالطالب', 'احمدالحذيفي', 'محمدالمحيسني', 'المحيسني', 'محمدايوب', 'هانيالرفاعي', 'ابراهيمالجبرين', 'بندربليله', 'عمادزهيرحافظ', 'عبدالكريمالحازمي', 'عبدالودودحنيف', 'محمدجبريل'],
        EG: ['محمدالطبلاوي', 'الطبلاوي', 'احمدنعينع', 'محمودعليالبنا', 'شوقيحامد', 'محمداسماعيلالمقدم', 'عبدالمنعمعبدالمبدي', 'محمدعبدالكريم', 'عليحجاجالسويسي', 'حاتمفريد'],
        IQ: ['مصطفىالعزاوي', 'عبدالرزاقالدليمي'], AE: ['خليفهالطنيجي']
    };
    Object.keys(MORE).forEach(function (c) { T[c] = (T[c] || []).concat(MORE[c]); });
    var ORDERED = [];
    Object.keys(T).forEach(function (c) { T[c].forEach(function (k) { ORDERED.push([k, c]); }); });
    ORDERED.sort(function (a, b) { return b[0].length - a[0].length; });
    function lookup(name, rec) {
        if (rec && rec.nat && C[rec.nat]) return C[rec.nat].concat([rec.nat]);
        var n = norm(String(name || '').replace('⭐', ''));
        if (!n) return null;
        for (var i = 0; i < ORDERED.length; i++) if (n.indexOf(ORDERED[i][0]) >= 0) { var c = ORDERED[i][1]; return C[c].concat([c]); }
        return null;
    }
    window.MuslimNat = { lookup: lookup, table: T, countries: C };

    function $(id) { return document.getElementById(id); }
    function chip(n) { var s = document.createElement('span'); s.className = 'mNat'; s.textContent = n[1] + ' ' + n[0]; return s; }
    function cards() {
        var list = $('readerList'); if (!list || typeof RECITERS === 'undefined') return;
        list.querySelectorAll('.reader').forEach(function (c) {
            if (c.querySelector('.mNat')) return;
            var i = +c.getAttribute('data-reciter-index'), r = RECITERS[i]; if (!r) return;
            var n = lookup(r.name, r); if (!n) return;
            var h = c.querySelector('h3,h4,b,strong') || c.firstElementChild;
            var host = (h && h.parentNode) || c, ch = chip(n);
            if (h && h.nextSibling) host.insertBefore(ch, h.nextSibling); else host.appendChild(ch);
        });
    }
    function profile() {
        var p = $('readerProfile'); if (!p || typeof currentReader === 'undefined' || !currentReader) return;
        var mine = p.querySelector('.mNatP');
        var n = lookup(currentReader.name, currentReader);
        if (!n) { if (mine) mine.remove(); return; }
        if (mine && mine.getAttribute('data-r') === String(currentReader.id)) return;
        if (mine) mine.remove();
        var d = document.createElement('div'); d.className = 'mNatP'; d.setAttribute('data-r', String(currentReader.id)); d.textContent = n[1] + ' ' + n[0] + ' — جنسية القارئ';
        var h = p.querySelector('h3') || p.firstElementChild;
        if (h && h.parentNode) h.parentNode.insertBefore(d, h.nextSibling); else p.appendChild(d);
    }
    function init() {
        var st = document.createElement('style');
        st.textContent = '.mNat{display:inline-block;margin:2px 6px;padding:1px 8px;border-radius:999px;font-size:12px;background:rgba(29,98,79,.12);color:inherit;white-space:nowrap}.mNatP{margin:4px 0;font-size:14px;opacity:.95}';
        document.head.appendChild(st);
        var busy = false;
        function run() { if (busy) return; busy = true; try { cards(); profile(); } catch (e) { } setTimeout(function () { busy = false; }, 60); }
        [$('readerList'), $('readerProfile')].forEach(function (el) { if (el) new MutationObserver(run).observe(el, { childList: true, subtree: true }); });
        run(); setTimeout(run, 1500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
