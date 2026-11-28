(function () {
    'use strict';
    // أدوات مطابقة تتسامح مع الأخطاء الإملائية والتشكيل واختلاف الهمزات والتاء المربوطة
    var AD = '٠١٢٣٤٥٦٧٨٩';
    function norm(s) {
        return String(s || '').replace(/[٠-٩]/g, function (d) { return AD.indexOf(d); })
            .replace(/[ً-ٰٟـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/(.)\1{2,}/g, '$1$1').replace(/[^؀-ۿa-zA-Z0-9\s]/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim();
    }
    // تقريب الحروف المتشابهة نطقًا لتخفيف أخطاء الكتابة الشائعة (ذ/ز، ض/ظ، ث/س، ط/ت …)
    function phon(s) {
        return norm(s).replace(/[ذز]/g, 'ز').replace(/[ضظ]/g, 'ض').replace(/[ثس]/g, 'س').replace(/ص/g, 'س').replace(/ط/g, 'ت').replace(/ق/g, 'ك').replace(/غ/g, 'خ').replace(/ء/g, '');
    }
    function bare(w) { return w.replace(/^(وال|بال|لل|فال|كال|ال|و)(?=.{3,})/, ''); }
    function lev(a, b, max) {
        if (a === b) return 0;
        if (Math.abs(a.length - b.length) > max) return max + 1;
        var prev = [], cur = [], i, j;
        for (j = 0; j <= b.length; j++) prev[j] = j;
        for (i = 1; i <= a.length; i++) {
            cur = [i]; var best = i;
            for (j = 1; j <= b.length; j++) {
                var c = a[i - 1] === b[j - 1] ? 0 : 1;
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
                if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev[j - 2] + 1);
                if (cur[j] < best) best = cur[j];
            }
            if (best > max) return max + 1;
            prev = cur;
        }
        return prev[b.length];
    }
    function toks(q) { return phon(q).split(' ').map(bare).filter(function (w) { return w.length >= 2; }); }
    // درجة تطابق كلمة مع نص: 3 تطابق تام، 2 احتواء، 1.5 خطأ إملائي، 0 لا شيء
    function wordScore(w, words) {
        var best = 0;
        for (var i = 0; i < words.length; i++) {
            var x = words[i];
            if (x === w) return 3;
            if (w.length >= 3 && (x.indexOf(w) === 0 || w.indexOf(x) === 0 && x.length >= 3)) best = Math.max(best, 2.4);
            else if (w.length >= 4 && x.indexOf(w) >= 0) best = Math.max(best, 2);
            else {
                var m = w.length >= 7 ? 2 : (w.length >= 4 ? 1 : 0);
                if (m && lev(w, x, m) <= m) best = Math.max(best, 1.5);
            }
        }
        return best;
    }
    function score(tk, text) {
        var words = phon(text).split(' ').map(bare), s = 0;
        tk.forEach(function (w) { s += wordScore(w, words); });
        return s;
    }
    window.v120F = { norm: norm, phon: phon, bare: bare, lev: lev, toks: toks, score: score };
})();
