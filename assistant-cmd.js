(function () {
    'use strict';
    var AD = '٠١٢٣٤٥٦٧٨٩';
    function norm(s) {
        return String(s || '').replace(/[٠-٩]/g, function (d) { return AD.indexOf(d); })
            .replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim();
    }
    function bare(w) { return w.replace(/^(وال|بال|لل|ال)(?=.{3,})/, ''); }
    function qsa(s) { return [].slice.call(document.querySelectorAll(s)); }
    var VERB = /(^| )(افتح|افتحي|افتحلي|اذهب|اذهبي|روح|خذني|ودني|وديني|وصلني|اعرض|اعرضلي|ابغي|ابغا|ابي|اريد|اريدها|اريده|عايز|عاوز|بدي|ودي|شغل|شغلي|اسمع|استمع|اسمعني|اقرا|ابدا|انتقل|انقلني|حولني)( |$)/;
    var PLAYV = /(^| )(شغل|شغلي|اسمع|استمع|اسمعني|ابدا)( |$)/;
    var STOP = {};
    ('الرقيه رقيه الشرعيه شرعيه للقاري القاري قاري لقاري للشيخ الشيخ شيخ بصوت صوت عن من في على الي لي فضلك لو سمحت ارجوك تفضل يا مساعد المسلم ابغي ابغا ابي اريد اريدها اريده عايز عاوز بدي ودي افتح افتحي افتحلي اذهب اذهبي روح خذني ودني وديني وصلني اعرض اعرضلي شغل شغلي اسمع استمع اسمعني اقرا ابدا انتقل انقلني حولني هذا هذه ال التي الذي مع بلا').split(' ').forEach(function (w) { STOP[w] = 1; });
    var SECTIONS = [
        ['qibla', /(^| )(القبله|قبله|اتجاه القبله)( |$)/, 'القبلة'],
        ['adhkar', /(^| )(الاذكار|اذكار|الادعيه|ادعيه|اذكار الصباح|اذكار المساء)( |$)/, 'الأذكار والأدعية'],
        ['mosques', /(^| )(المساجد|مساجد|مسجد قريب|اقرب مسجد|المساجد القريبه)( |$)/, 'المساجد القريبة'],
        ['khatmah', /(^| )(الختمه|ختمه|ختمتي)( |$)/, 'الختمة'],
        ['repeatAyah', /(^| )(تكرار الايه|تكرار الايات|تكرار ايه)( |$)/, 'تكرار الآية'],
        ['readers', /(^| )(القراء|قراء|التلاوات|تلاوات|المقرئين)( |$)/, 'القرّاء والتلاوات'],
        ['children', /(^| )(الاطفال|اطفال|عالم الاطفال)( |$)/, 'عالم الأطفال'],
        ['manasik', /(^| )(المناسك|مناسك|التقويم|تقويم هجري|الحج)( |$)/, 'المناسك والتقويم'],
        ['daily', /(^| )(اعمال اليوم|اعمالي|الطاعات)( |$)/, 'أعمال اليوم'],
        ['modes', /(^| )(الاوضاع|اوضاع|وضع النوم)( |$)/, 'الأوضاع'],
        ['downloads', /(^| )(تنزيلاتي|التنزيلات|التحميلات|تحميلاتي)( |$)/, 'تنزيلاتي'],
        ['settings', /(^| )(الاعدادات|اعدادات|الضبط)( |$)/, 'الإعدادات'],
        ['prayer', /(^| )(مواقيت الصلاه|اوقات الصلاه|المواقيت|مواقيت|اوقات الصلاه)( |$)/, 'مواقيت الصلاة'],
        ['install', /(^| )(التثبيت|تثبيت التطبيق|ثبت التطبيق)( |$)/, 'تثبيت التطبيق'],
        ['travel', /(^| )(وضع السفر|السفر|اذكار السفر|رحلتي|مسافر)( |$)/, 'وضع السفر'],
        ['home', /(^| )(الرئيسيه|الصفحه الرئيسيه|البدايه)( |$)/, 'الرئيسية']
    ];
    function surahNo(n) {
        try {
            var f = window.__v105 && window.__v105.findSurah ? window.__v105.findSurah(n) : null;
            if (f && f.num)
                return f.num;
        }
        catch (e) { }
        return 0;
    }
    function parse(q) {
        var n = norm(q);
        if (!n)
            return null;
        var hasVerb = VERB.test(n), isAsk = /(^| )(هل|كيف|ما|ماذا|لماذا|متى|اين|وين|كم)( |$)/.test(n) && !hasVerb;
        if (isAsk)
            return null;
        var mush = /(مصحف|المصحف|القران الكريم|قران)/.test(n);
        var m;
        m = /(?:^| )(?:الصفحه|صفحه|ص) ?(?:رقم )?(\d{1,4})(?: |$)/.exec(n);
        if (m && (mush || hasVerb) && !/(الرئيسيه|الاعدادات|التثبيت)/.test(n)) {
            var p = +m[1];
            if (p < 1 || p > 604)
                return { kind: 'badpage', page: p };
            return { kind: 'mushafPage', page: p };
        }
        m = /(?:^| )(?:الجزء|جزء) ?(\d{1,2})(?: |$)/.exec(n);
        if (m && (mush || hasVerb) && +m[1] >= 1 && +m[1] <= 30)
            return { kind: 'mushafJuz', juz: +m[1] };
        if (/رقي/.test(n) && (hasVerb || /للقاري|بصوت|للشيخ/.test(n))) {
            var toks = n.split(' ').filter(function (w) { return w && !STOP[w] && !/^\d+$/.test(w) && w.length >= 2; });
            return { kind: 'ruqyah', tokens: toks, play: PLAYV.test(n) };
        }
        if (!hasVerb)
            return null;
        var u = null;
        try {
            u = window.__v105 && window.__v105.understand ? window.__v105.understand(q) : null;
        }
        catch (e) { }
        var wantAudio = PLAYV.test(n) || /بصوت/.test(n);
        if (u && u.reciters && u.reciters.length && !u.intent.repeat && (wantAudio || /(^| )(القاري|قاري|الشيخ)( |$)/.test(n)) && !mush) {
            return { kind: 'reader', reciter: u.reciters[0].r, surah: wantAudio && u.surah ? u.surah : 0 };
        }
        var sNo = surahNo(n);
        if (mush || (sNo && /(^| )سوره( |$)/.test(n) && !wantAudio && /(^| )(افتح|افتحي|افتحلي|اقرا|اذهب|روح|خذني|ودني|وديني|وصلني|اعرض|اعرضلي)( |$)/.test(n))) {
            if (sNo)
                return { kind: 'mushafSurah', surah: sNo };
            return { kind: 'mushaf' };
        }
        for (var i = 0; i < SECTIONS.length; i++)
            if (SECTIONS[i][1].test(n))
                return { kind: 'section', id: SECTIONS[i][0], name: SECTIONS[i][2] };
        return null;
    }
    function flash(el) { if (!el)
        return; try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.outline = '3px solid #c8a15b';
        setTimeout(function () { el.style.outline = ''; }, 2600);
    }
    catch (e) { } }
    function runAction(a) {
        var b = document.createElement('button');
        b.style.display = 'none';
        b.setAttribute('data-v105', JSON.stringify(a));
        document.body.appendChild(b);
        b.click();
        setTimeout(function () { if (b.remove)
            b.remove(); }, 0);
    }
    function waitFor(test, ms, cb) {
        var t0 = Date.now();
        (function tick() { var v = test(); if (v)
            return cb(v); if (Date.now() - t0 > ms)
            return cb(null); setTimeout(tick, 150); })();
    }
    function openMushaf(then) {
        show('mushaf107');
        setTimeout(function () { then && then(); }, 120);
    }
    function ruqyahOpen(tokens, play) {
        show('ruqyah');
        if (window.renderRuqyah)
            window.renderRuqyah('');
        var cards = qsa('#ruqyahList article[data-rq-id]').filter(function (a) { return /^r\d+$/.test(a.getAttribute('data-rq-id')); });
        if (!tokens.length)
            return { found: null, count: cards.length };
        var best = null, bs = 0;
        cards.forEach(function (a) {
            var h = a.querySelector('h3'), title = h ? h.textContent : '', name = title.split('—').pop().trim();
            var words = norm(name).split(' ').map(bare);
            var sc = 0;
            tokens.forEach(function (t) { var tb = bare(t); if (words.some(function (w) { return w === tb || (tb.length >= 4 && (w.indexOf(tb) >= 0 || tb.indexOf(w) >= 0 && w.length >= 4)); }))
                sc++; });
            if (sc > bs) {
                bs = sc;
                best = { card: a, name: name };
            }
        });
        if (!best)
            return { found: null, count: cards.length };
        var inp = document.getElementById('ruqyahSearch');
        if (inp)
            inp.value = best.name;
        if (window.renderRuqyah)
            window.renderRuqyah(best.name);
        var card = document.querySelector('#ruqyahList article[data-rq-id^="r"]');
        flash(card);
        if (play && card) {
            var pb = card.querySelector('[data-rq="play"]');
            if (pb)
                pb.click();
        }
        return { found: best.name, count: 1 };
    }
    function execute(c, q) {
        if (c.kind === 'badpage')
            return 'المصحف فيه <b>604</b> صفحات، والصفحة ' + c.page + ' غير موجودة. اذكر رقمًا من 1 إلى 604.';
        if (c.kind === 'mushafPage') {
            openMushaf(function () { window.v107Mushaf && window.v107Mushaf.go(c.page); });
            return '📖 فتحتُ لك <b>المصحف على الصفحة ' + c.page + '</b>.';
        }
        if (c.kind === 'mushafJuz') {
            openMushaf(function () { waitFor(function () { var j = document.getElementById('mpJuz'); return j && j.options.length > 1 && j.onchange ? j : null; }, 6000, function (j) { if (j) {
                j.value = String(c.juz);
                j.onchange();
            } }); });
            return '📖 فتحتُ لك <b>المصحف عند الجزء ' + c.juz + '</b>.';
        }
        if (c.kind === 'mushafSurah') {
            openMushaf(function () { waitFor(function () { var s = document.getElementById('mpSurah'); return s && s.options.length >= 114 && s.onchange ? s : null; }, 8000, function (s) { if (s) {
                s.value = String(c.surah);
                s.onchange();
            } }); });
            return '📖 فتحتُ لك <b>المصحف عند السورة ' + c.surah + '</b>.';
        }
        if (c.kind === 'mushaf') {
            openMushaf();
            return '📖 فتحتُ لك <b>المصحف</b> عند آخر صفحة قرأتها.';
        }
        if (c.kind === 'ruqyah') {
            var r = ruqyahOpen(c.tokens, c.play);
            if (!c.tokens.length)
                return '🕋 فتحتُ لك <b>الرقية الشرعية</b>. اختر القارئ الذي تريده.';
            if (r.found)
                return '🕋 فتحتُ لك <b>الرقية الشرعية بصوت ' + r.found + '</b>' + (c.play ? ' وبدأ التشغيل.' : '. اضغط «▶ تشغيل متتالٍ» للبدء.');
            return '🕋 فتحتُ <b>الرقية الشرعية</b>، لكني لم أجد قارئًا بهذا الاسم ضمن قرّاء الرقية، فهذه القائمة كاملة لتختار منها.';
        }
        if (c.kind === 'reader') {
            var nm = String(c.reciter.name || '').replace('⭐ ', '');
            runAction({ t: 'reciter', id: c.reciter.id, nm: nm, s: c.surah || 0 });
            return '🎧 فتحتُ لك القارئ <b>' + nm + '</b>' + (c.surah ? ' وبدأتُ تشغيل السورة ' + c.surah + '.' : '.');
        }
        if (c.kind === 'section') {
            if (c.id === 'travel' && window.v116Travel) {
                window.v116Travel.open();
            }
            else if (c.id === 'prayer' || c.id === 'install' || c.id === 'home') {
                show(c.id);
            }
            else
                runAction({ t: 'section', id: c.id });
            return '✅ فتحتُ لك قسم <b>' + c.name + '</b>.';
        }
        return null;
    }
    function direct(q) { var c = parse(q); return c ? execute(c, q) : null; }
    function install() {
        var prev = window.v105Ask;
        if (typeof prev !== 'function' || prev.__cmd)
            return !!(prev && prev.__cmd);
        var w = async function (q, legacy) {
            var r = null;
            try {
                r = direct(q);
            }
            catch (e) {
                console.warn('assistant-cmd', e);
            }
            if (r)
                return r;
            return prev.call(this, q, legacy);
        };
        w.__cmd = 1;
        window.v105Ask = w;
        return true;
    }
    window.v115Cmd = { parse: parse, execute: execute, direct: direct, install: install, norm: norm };
    if (!install()) {
        document.addEventListener('DOMContentLoaded', install);
        window.addEventListener('load', install);
    }
})();
