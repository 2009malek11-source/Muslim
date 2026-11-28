/* quran-test.js — اختبار القرآن: تُعرض آية ويحاول المستخدم تذكّر التي بعدها، ثم يكشفها ويحكم بنفسه (صحيح/خطأ).
 * بيانات الآيات من قاعدة api.alquran.cloud (نص عثماني، وأرقام الصفحات هي ترقيم مصحف المدينة 604 صفحة نفسه المعتمد في المصحف هنا)،
 * وتُحفظ في ذاكرة الجهاز بعد أول استخدام فتعمل دون إنترنت. الآية التالية تأتي دائمًا من القاعدة نفسها لا من أي توليد.
 * الصوت: نظام القرّاء الموجود (everyayah) — اختياري ولا يبدأ تلقائيًا. */
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var CN = 'muslim-qtest-v1', API = 'https://api.alquran.cloud/v1/';
    var HK = 'muslim-qt-history', WK = 'muslim-qt-weak', PK = 'muslim-qt-prefs';
    var COUNTS = [15, 20, 30, 40, 50, 100, 150, 200];
    var TYPES = { surah: 'نطاق السور', ayah: 'نطاق الآيات', page: 'نطاق الصفحات', weak: 'نقاط ضعفي' };
    function ld(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
    function sv(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function snames() { try { return S; } catch (e) { return []; } }
    function sname(n) { return snames()[n - 1] || ('سورة ' + n); }
    var P = ld(PK, { rec: 0, vol: 1, ctx: 1 });
    var V = { name: 'menu' };      // الشاشة الحالية
    var Q = null;                   // الاختبار الجاري
    var au = null, auBtn = null;

    /* ---------------- البيانات ---------------- */
    function jget(url) {
        if (!window.caches) return fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); });
        return caches.open(CN).then(function (c) {
            return c.match(url).then(function (m) {
                if (m) return m.json();
                return fetch(url).then(function (r) { if (!r.ok) throw 0; c.put(url, r.clone()).catch(function () { }); return r.json(); });
            });
        });
    }
    function norm(a, surah) {
        var t = String(a.text || '');
        if (a.numberInSurah === 1 && surah !== 1 && surah !== 9) { var w = t.split(' '); if (w.length > 4) t = w.slice(4).join(' '); }   // إزالة البسملة الملحقة بأول آية
        return { g: a.number, s: surah, n: a.numberInSurah, t: t, p: a.page };
    }
    function getSurah(n) { return jget(API + 'surah/' + n + '/quran-uthmani').then(function (j) { return j.data.ayahs.map(function (a) { return norm(a, n); }); }); }
    function getPage(p) { return jget(API + 'page/' + p + '/quran-uthmani').then(function (j) { return j.data.ayahs.map(function (a) { return norm(a, a.surah.number); }); }); }
    function pool(items, fn, cb) {
        var out = new Array(items.length), i = 0, done = 0, fail = null;
        return new Promise(function (res, rej) {
            function next() {
                if (fail) return;
                if (i >= items.length) { if (done === items.length) res(out); return; }
                var k = i++;
                fn(items[k]).then(function (r) { out[k] = r; done++; if (cb) cb(done, items.length); if (done === items.length) res(out); else next(); }, function (e) { fail = e; rej(e); });
            }
            for (var w = 0; w < 4 && w < items.length; w++) next();
            if (!items.length) res(out);
        });
    }
    function flat(arr) { var o = []; arr.forEach(function (x) { o = o.concat(x); }); o.sort(function (a, b) { return a.g - b.g; }); var u = [], last = -1; o.forEach(function (x) { if (x.g !== last) { u.push(x); last = x.g; } }); return u; }

    /* ---------------- الصوت ---------------- */
    function recs() { var L = (window.v122Rec && v122Rec.list) || []; var o = []; L.forEach(function (r, i) { if (!/^warsh\//.test(r[1])) o.push({ i: i, r: r }); }); return o; }
    function stopAudio() { if (au) { try { au.pause(); } catch (e) { } } if (auBtn) { auBtn.classList.remove('on'); auBtn.textContent = '🔊 استماع'; } auBtn = null; }
    function playAyah(a, btn) {
        if (auBtn === btn && au && !au.paused) { stopAudio(); return; }
        stopAudio();
        var L = recs(); if (!L.length || !window.v122Rec) { toast('الصوت غير متاح الآن.'); return; }
        var pick = L.filter(function (x) { return x.i === P.rec; })[0] || L[0];
        var urls = v122Rec.urls(pick.r, a.s, a.n), k = 0;
        try { var m = $('audio'); if (m && !m.paused) m.pause(); if (window.v100StopQueue) v100StopQueue(); } catch (e) { }
        if (!au) { au = new Audio(); au.preload = 'none'; au.setAttribute('playsinline', ''); }
        au.volume = +P.vol; auBtn = btn; btn.classList.add('on'); btn.textContent = '⏸ إيقاف';
        au.onended = function () { stopAudio(); };
        au.onerror = function () { if (++k < urls.length) { au.src = urls[k]; au.play().catch(function () { }); } else { stopAudio(); toast('تعذّر تشغيل التلاوة. تحقق من الإنترنت.'); } };
        au.src = urls[0]; var p = au.play(); if (p && p.catch) p.catch(function () { stopAudio(); });
    }
    function toast(t) { var e = $('qtToast'); if (!e) { e = document.createElement('div'); e.id = 'qtToast'; e.setAttribute('role', 'status'); document.body.appendChild(e); } e.textContent = t; e.className = 'on'; clearTimeout(toast.t); toast.t = setTimeout(function () { e.className = ''; }, 2400); }

    /* ---------------- مساعدات الواجهة ---------------- */
    function body() { return $('qtBody'); }
    function put(html, name) { stopAudio(); V.name = name; var b = body(); b.innerHTML = '<div class="qtView">' + html + '</div>'; window.scrollTo(0, 0); }
    function loc(a) { return 'سورة ' + sname(a.s) + ' — آية ' + a.n + (a.p ? ' — صفحة ' + a.p : ''); }
    function ayahBox(a, cls) { return '<div class="qtAyah ' + (cls || '') + '">﴿ ' + esc(a.t) + ' ﴾</div>'; }
    function listenBtn(id) { return '<button type="button" class="qtListen" data-listen="' + id + '">🔊 استماع</button>'; }
    function surahOpts(sel) { return snames().map(function (n, i) { return '<option value="' + (i + 1) + '"' + (sel === i + 1 ? ' selected' : '') + '>' + (i + 1) + '. ' + esc(n) + '</option>'; }).join(''); }
    function countBlock(max) {
        return '<div class="qtLbl">عدد الأسئلة</div><div class="qtCounts" id="qtCounts">' + COUNTS.map(function (c) { return '<button type="button" data-c="' + c + '"' + (c === 20 ? ' class="on"' : '') + '>' + c + '</button>'; }).join('') + '</div>' +
            '<div class="qtLbl">أو عدد مخصص</div><input id="qtCustom" class="field" type="number" min="1" max="1000" inputmode="numeric" placeholder="اكتب عددًا">';
    }
    function wantCount() {
        var c = +($('qtCustom') || {}).value; if (c >= 1) return Math.floor(c);
        var on = document.querySelector('#qtCounts .on'); return on ? +on.dataset.c : 20;
    }
    function bindCounts() {
        var box = $('qtCounts'); if (!box) return;
        box.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; [].forEach.call(box.children, function (x) { x.classList.toggle('on', x === b); }); $('qtCustom').value = ''; };
        $('qtCustom').oninput = function () { if (this.value) [].forEach.call(box.children, function (x) { x.classList.remove('on'); }); };
    }
    function ctxBlock() {
        return '<div class="qtLbl">إظهار ما قبل الآية (للتسهيل)</div><div class="qtCounts" id="qtCtx">' + [[0, 'بلا'], [1, 'آية قبلها'], [2, 'آيتان قبلها']].map(function (x) { return '<button type="button" data-x="' + x[0] + '"' + (+P.ctx === x[0] ? ' class="on"' : '') + '>' + x[1] + '</button>'; }).join('') + '</div>';
    }
    function bindCtx() { var box = $('qtCtx'); if (!box) return; box.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; [].forEach.call(box.children, function (x) { x.classList.toggle('on', x === b); }); P.ctx = +b.dataset.x; sv(PK, P); }; }
    function recBlock() {
        var L = recs(); if (!L.length) return '';
        if (!recs().some(function (x) { return x.i === P.rec; })) P.rec = L[0].i;
        return '<div class="qtLbl">القارئ عند الاستماع</div><select id="qtRec" class="field">' + L.map(function (x) { return '<option value="' + x.i + '"' + (x.i === P.rec ? ' selected' : '') + '>' + esc(v122Rec.label ? v122Rec.label(x.r) : x.r[0]) + '</option>'; }).join('') + '</select>' +
            '<div class="qtLbl">مستوى الصوت</div><input id="qtVol" type="range" min="0" max="1" step="0.05" value="' + P.vol + '" class="qtVol">';
    }
    function bindRec() {
        var s = $('qtRec'); if (s) s.onchange = function () { P.rec = +this.value; sv(PK, P); };
        var v = $('qtVol'); if (v) v.oninput = function () { P.vol = +this.value; sv(PK, P); if (au) au.volume = P.vol; };
    }

    /* ---------------- الشاشة الرئيسية ---------------- */
    var IC = {
        surah: '<svg viewBox="0 0 24 24" class="qtSvg"><path d="M4 5.5h16M4 10h16M4 14.5h10M4 19h7"/><circle cx="18" cy="17.5" r="2.6"/></svg>',
        ayah: '<svg viewBox="0 0 24 24" class="qtSvg"><path d="M8 4C5.5 6 5.5 18 8 20M16 4c2.5 2 2.5 14 0 16"/><path d="M10.5 9h3M10.5 12h3M10.5 15h3"/></svg>',
        page: '<svg viewBox="0 0 24 24" class="qtSvg"><path d="M6 3.5h9l3.5 3.5v13.5H6z"/><path d="M15 3.5V7h3.5M9 12h6M9 15.5h6"/></svg>',
        weak: '<svg viewBox="0 0 24 24" class="qtSvg"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/></svg>',
        hist: '<svg viewBox="0 0 24 24" class="qtSvg"><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 4v4.5H8M12 7.5V12l3 2"/></svg>'
    };
    function menu() {
        var wk = Object.keys(ld(WK, {})).length, hs = ld(HK, []).length;
        put('<div class="qtIntro"><h3>اختبر حفظك للقرآن الكريم</h3><p class="mini">تُعرض عليك آية، وتحاول تذكّر الآية التي بعدها، ثم تكشفها وتحكم بنفسك: صحيح أو خطأ. لا كتابة ولا تصحيح آلي.</p></div>' +
            '<div class="qtGrid">' +
            card('surah', 'نطاق السور', 'اختبار من سورة أو من مجموعة سور متتالية.') +
            card('ayah', 'نطاق الآيات', 'من آية إلى آية داخل سورة واحدة.') +
            card('page', 'نطاق الصفحات', 'من صفحة إلى صفحة في مصحف المدينة (604 صفحات).') +
            '</div><div class="qtGrid qtSmall">' +
            '<button type="button" class="qtCard sm" data-go="weak"' + (wk ? '' : ' disabled') + '><span class="qtIc">' + IC.weak + '</span><b>نقاط ضعفي</b><small>' + (wk ? wk + ' آية أخطأتَ فيها سابقًا' : 'تظهر هنا الآيات التي تُجيب فيها «خطأ»') + '</small></button>' +
            '<button type="button" class="qtCard sm" data-go="hist"><span class="qtIc">' + IC.hist + '</span><b>سجل اختباراتي</b><small>' + (hs ? hs + ' اختبار محفوظ على جهازك' : 'لا اختبارات بعد') + '</small></button></div>', 'menu');
        body().querySelector('.qtView').onclick = function (e) { var b = e.target.closest('[data-go]'); if (!b || b.disabled) return; go(b.dataset.go); };
    }
    function card(k, t, d) { return '<button type="button" class="qtCard" data-go="' + k + '"><span class="qtIc">' + IC[k] + '</span><b>' + t + '</b><small>' + d + '</small></button>'; }
    function go(k) { ({ surah: setupSurah, ayah: setupAyah, page: setupPage, weak: setupWeak, hist: history, menu: menu })[k](); }
    function back() { return '<button type="button" class="qtBack" data-go="menu">← رجوع</button>'; }
    function bindGo() { body().querySelector('.qtView').addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b && !b.disabled) go(b.dataset.go); }); }

    /* ---------------- إعداد الاختبارات ---------------- */
    function setupSurah() {
        put(back() + '<h3>نطاق السور</h3><div class="qtLbl">من سورة</div><select id="qtS1" class="field">' + surahOpts(2) + '</select><div class="qtLbl">إلى سورة</div><select id="qtS2" class="field">' + surahOpts(2) + '</select>' + countBlock() + ctxBlock() + recBlock() + '<button type="button" class="primary qtBig" id="qtStart">ابدأ الاختبار</button><div class="qtMsg" id="qtMsg"></div>', 'setup');
        bindGo(); bindCounts(); bindCtx(); bindRec();
        $('qtS1').onchange = function () { if (+$('qtS2').value < +this.value) $('qtS2').value = this.value; };
        $('qtS2').onchange = function () { if (+$('qtS1').value > +this.value) $('qtS1').value = this.value; };
        $('qtStart').onclick = function () {
            var a = +$('qtS1').value, b = +$('qtS2').value; if (b < a) { var t = a; a = b; b = t; }
            var ar = []; for (var i = a; i <= b; i++) ar.push(i);
            prepare('surah', a === b ? 'سورة ' + sname(a) : 'من ' + sname(a) + ' إلى ' + sname(b), function (cb) { return pool(ar, getSurah, cb).then(flat); });
        };
    }
    function setupAyah() {
        put(back() + '<h3>نطاق الآيات</h3><div class="qtLbl">السورة</div><select id="qtSS" class="field">' + surahOpts(1) + '</select><div class="qtRow"><div><div class="qtLbl">من الآية</div><input id="qtA1" class="field" type="number" min="1" value="1" inputmode="numeric"></div><div><div class="qtLbl">إلى الآية</div><input id="qtA2" class="field" type="number" min="1" value="7" inputmode="numeric"></div></div><div class="mini" id="qtMax"></div>' + countBlock() + ctxBlock() + recBlock() + '<button type="button" class="primary qtBig" id="qtStart">ابدأ الاختبار</button><div class="qtMsg" id="qtMsg"></div>', 'setup');
        bindGo(); bindCounts(); bindCtx(); bindRec();
        var max = 7;
        function upd() { getSurah(+$('qtSS').value).then(function (l) { max = l.length; $('qtMax').textContent = 'في هذه السورة ' + max + ' آية.'; $('qtA1').max = max; $('qtA2').max = max; if (+$('qtA2').value > max) $('qtA2').value = max; if (+$('qtA1').value > max) $('qtA1').value = max; }).catch(function () { $('qtMax').textContent = 'يلزم إنترنت مرة واحدة لتحميل نص هذه السورة.'; }); }
        $('qtSS').onchange = function () { $('qtA1').value = 1; $('qtA2').value = 1; upd(); }; upd();
        $('qtStart').onclick = function () {
            var s = +$('qtSS').value, a = Math.floor(+$('qtA1').value), b = Math.floor(+$('qtA2').value);
            if (!(a >= 1) || !(b >= a)) { $('qtMsg').textContent = 'اجعل آية البداية أقل من أو تساوي آية النهاية.'; return; }
            prepare('ayah', 'سورة ' + sname(s) + ' (' + a + '–' + b + ')', function (cb) { return getSurah(s).then(function (l) { if (b > l.length) { var e = new Error('range'); e.msg = 'السورة فيها ' + l.length + ' آية فقط.'; throw e; } return l.filter(function (x) { return x.n >= a && x.n <= b; }); }); });
        };
    }
    function setupPage() {
        put(back() + '<h3>نطاق الصفحات</h3><div class="qtRow"><div><div class="qtLbl">من الصفحة</div><input id="qtP1" class="field" type="number" min="1" max="604" value="1" inputmode="numeric"></div><div><div class="qtLbl">إلى الصفحة</div><input id="qtP2" class="field" type="number" min="1" max="604" value="20" inputmode="numeric"></div></div><div class="mini">ترقيم صفحات مصحف المدينة (1 إلى 604) نفسه المعتمد في المصحف هنا.</div>' + countBlock() + ctxBlock() + recBlock() + '<button type="button" class="primary qtBig" id="qtStart">ابدأ الاختبار</button><div class="qtMsg" id="qtMsg"></div>', 'setup');
        bindGo(); bindCounts(); bindCtx(); bindRec();
        $('qtStart').onclick = function () {
            var a = Math.floor(+$('qtP1').value), b = Math.floor(+$('qtP2').value);
            if (!(a >= 1) || !(b >= a) || b > 604) { $('qtMsg').textContent = 'أدخل صفحات صحيحة بين 1 و604، وصفحة البداية قبل النهاية.'; return; }
            var ar = []; for (var i = a; i <= b; i++) ar.push(i);
            prepare('page', 'الصفحات ' + a + '–' + b, function (cb) { return pool(ar, getPage, cb).then(flat); });
        };
    }
    function setupWeak() {
        var w = ld(WK, {}), ks = Object.keys(w);
        if (!ks.length) { menu(); return; }
        put(back() + '<h3>نقاط ضعفي</h3><p class="mini">هذه آيات اخترتَ فيها «خطأ» سابقًا (' + ks.length + ' آية). تُحذف الآية من القائمة عندما تُجيب عنها «صحيح».</p>' + countBlock() + ctxBlock() + recBlock() + '<button type="button" class="primary qtBig" id="qtStart">ابدأ مراجعة نقاط ضعفي</button><div class="qtMsg" id="qtMsg"></div>', 'setup');
        bindGo(); bindCounts(); bindCtx(); bindRec();
        $('qtStart').onclick = function () {
            var rows = ks.map(function (k) { return w[k]; });
            var want = Math.min(wantCount(), rows.length); shuffle(rows);
            start('weak', 'نقاط ضعفي', rows.slice(0, want).map(function (r) { return { q: r.q, a: r.a, ctx: [] }; }));
        };
    }
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    /* ---------------- تجهيز الأسئلة ---------------- */
    function prepare(type, label, fetcher) {
        var want = wantCount();
        $('qtStart').disabled = true; var m = $('qtMsg'); m.textContent = '⏳ جارٍ تجهيز الآيات…';
        fetcher(function (d, n) { m.textContent = '⏳ جارٍ تجهيز الآيات… ' + d + ' من ' + n; }).then(function (list) {
            var elig = []; for (var i = 0; i + 1 < list.length; i++) if (list[i + 1].g === list[i].g + 1) elig.push(i);   // لكل سؤال آية تالية مباشرة داخل النطاق
            if (!elig.length) { m.textContent = 'هذا النطاق لا يحتوي أسئلة صالحة (يلزم آيتان متتاليتان على الأقل).'; $('qtStart').disabled = false; return; }
            if (want > elig.length) {
                m.innerHTML = 'النطاق المحدد فيه <b>' + elig.length + '</b> ' + (elig.length >= 3 && elig.length <= 10 ? 'أسئلة' : 'سؤالًا') + ' صالحًا فقط، وأنت طلبت ' + want + '. لا تتكرر الأسئلة لإكمال العدد.<br><button type="button" class="primary" id="qtMax">ابدأ بـ ' + elig.length + ' ' + (elig.length >= 3 && elig.length <= 10 ? 'أسئلة' : 'سؤالًا') + '</button>';
                $('qtStart').disabled = false;
                $('qtMax').onclick = function () { build(type, label, list, elig, elig.length); };
                return;
            }
            build(type, label, list, elig, want);
        }).catch(function (e) { try { console.warn('qt', e); } catch (x) { } m.textContent = (e && e.msg) || 'تعذّر تحميل نص القرآن الآن. يلزم الإنترنت مرة واحدة لهذه السور، ثم تعمل دون إنترنت.'; $('qtStart').disabled = false; });
    }
    function build(type, label, list, elig, n) {
        shuffle(elig); var qs = elig.slice(0, n).map(function (i) {
            var ctx = []; for (var k = Math.min(+P.ctx, i); k >= 1; k--) ctx.push(list[i - k]);
            return { q: list[i], a: list[i + 1], ctx: ctx };
        });
        start(type, label, qs);
    }

    /* ---------------- الاختبار ---------------- */
    function start(type, label, qs) {
        if (!qs.length) { menu(); return; }
        Q = { type: type, label: label, qs: qs, i: 0, res: [], t0: Date.now(), streak: 0, best: 0, shown: false };
        show();
    }
    function show() {
        var q = Q.qs[Q.i], n = Q.qs.length, ok = Q.res.filter(function (r) { return r.ok; }).length, bad = Q.res.length - ok;
        var ctx = (q.ctx || []).map(function (a) { return '<div class="qtCtx">﴿ ' + esc(a.t) + ' ﴾</div>'; }).join('');
        put('<div class="qtTop"><span class="qtTag">' + TYPES[Q.type] + ' · ' + esc(Q.label) + '</span><button type="button" class="qtX" id="qtExit" aria-label="إنهاء">✕</button></div>' +
            '<div class="qtMeta"><b>السؤال ' + (Q.i + 1) + ' من ' + n + '</b><span>✔ ' + ok + ' &nbsp; ✖ ' + bad + (Q.streak >= 2 ? ' &nbsp; 🔥 ' + Q.streak : '') + '</span></div>' +
            '<div class="qtBar"><i style="width:' + Math.round(Q.i * 100 / n) + '%"></i></div><div class="mini qtPct">التقدم ' + Math.round(Q.i * 100 / n) + '%</div>' +
            '<div class="qtCardQ"><div class="qtLoc">' + loc(q.q) + '</div><div class="qtHint">حاول تذكّر الآية التالية:</div>' + ctx + ayahBox(q.q, 'cur') + listenBtn('q') + '</div>' +
            '<button type="button" class="primary qtBig" id="qtShow">إظهار الآية التالية</button><div id="qtAnsBox"></div>', 'quiz');
        var root = body();
        $('qtExit').onclick = function () { if (confirm('إنهاء الاختبار الآن؟ لن تُحفظ نتيجته.')) { Q = null; menu(); } };
        root.querySelector('[data-listen="q"]').onclick = function () { playAyah(q.q, this); };
        $('qtShow').onclick = function () {
            this.remove();
            $('qtAnsBox').innerHTML = '<div class="qtCardA"><div class="qtLoc">' + loc(q.a) + '</div>' + ayahBox(q.a, 'ans') + listenBtn('a') + '</div><div class="qtJudge"><div class="mini">هل كانت إجابتك صحيحة؟</div><div class="qtBtns"><button type="button" class="qtOk" id="qtYes">🟢 صحيح</button><button type="button" class="qtNo" id="qtNo">🔴 خطأ</button></div></div>';
            $('qtAnsBox').querySelector('[data-listen="a"]').onclick = function () { playAyah(q.a, this); };
            $('qtYes').onclick = function () { answer(true); }; $('qtNo').onclick = function () { answer(false); };
            $('qtAnsBox').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
    }
    function answer(ok) {
        var q = Q.qs[Q.i]; Q.res.push({ q: q.q, a: q.a, ok: ok });
        Q.streak = ok ? Q.streak + 1 : 0; Q.best = Math.max(Q.best, Q.streak);
        var w = ld(WK, {}), key = String(q.q.g);
        if (ok) delete w[key]; else w[key] = { q: q.q, a: q.a };
        var ks = Object.keys(w); if (ks.length > 300) delete w[ks[0]];
        sv(WK, w);
        Q.i++; if (Q.i >= Q.qs.length) finish(); else show();
    }
    function level(p) { return p >= 95 ? ['ممتاز جدًا', 'gold'] : p >= 85 ? ['ممتاز', 'green'] : p >= 70 ? ['جيد جدًا', 'teal'] : p >= 50 ? ['جيد', 'amber'] : ['يحتاج إلى مزيد من المراجعة', 'red']; }
    function dur(ms) { var s = Math.round(ms / 1000), m = Math.floor(s / 60); return (m ? m + ' د ' : '') + (s % 60) + ' ث'; }
    function finish() {
        var n = Q.qs.length, ok = Q.res.filter(function (r) { return r.ok; }).length, bad = n - ok, pct = Math.round(ok * 100 / n * 10) / 10;
        Q.done = { n: n, ok: ok, bad: bad, pct: pct, ms: Date.now() - Q.t0 };
        var h = ld(HK, []); h.unshift({ t: Date.now(), type: Q.type, label: Q.label, n: n, ok: ok, bad: bad, pct: pct, ms: Q.done.ms }); sv(HK, h.slice(0, 100));
        resultView();
    }
    function resultView(onlyBad) {
        var d = Q.done, lv = level(d.pct);
        var rows = Q.res.map(function (r, i) { return { r: r, i: i }; }).filter(function (x) { return !onlyBad || !x.r.ok; });
        put('<div class="qtResult"><div class="qtRing ' + lv[1] + '"><b>' + (d.pct % 1 ? d.pct.toFixed(1) : d.pct) + '%</b></div><h3 class="qtLv ' + lv[1] + '">' + lv[0] + '</h3>' +
            '<div class="qtStats"><div><b>' + d.ok + '</b><small>صحيحة</small></div><div><b>' + d.bad + '</b><small>خاطئة</small></div><div><b>' + d.n + '</b><small>إجمالي الأسئلة</small></div><div><b>' + dur(d.ms) + '</b><small>المدة</small></div></div>' +
            (Q.best >= 3 ? '<div class="mini">أطول سلسلة صحيحة متتالية: 🔥 ' + Q.best + '</div>' : '') +
            '<div class="qtBtns2"><button type="button" class="primary" id="qtAgain">🔁 إعادة الاختبار</button>' + (d.bad ? '<button type="button" id="qtRetryBad">↩ أعد الأخطاء فقط</button>' : '') + '<button type="button" id="qtShare">📤 مشاركة النتيجة</button><button type="button" data-go="hist">📊 سجل اختباراتي</button><button type="button" data-go="menu">🏠 الصفحة الرئيسية للميزة</button></div></div>' +
            '<div class="qtRevHd"><h3>مراجعة الأسئلة</h3>' + (d.bad ? '<label class="qtChk"><input type="checkbox" id="qtOnlyBad"' + (onlyBad ? ' checked' : '') + '> الأخطاء فقط</label>' : '') + '</div>' +
            '<div class="qtRev">' + rows.map(function (x) { var r = x.r; return '<div class="qtRow2 ' + (r.ok ? 'ok' : 'no') + '"><div class="qtRowTop"><b>' + (x.i + 1) + '</b><span class="qtBadge ' + (r.ok ? 'ok' : 'no') + '">' + (r.ok ? '🟢 صحيح' : '🔴 خطأ') + '</span></div><div class="qtLoc">' + loc(r.q) + '</div>' + ayahBox(r.q) + '<button type="button" class="qtListen" data-rv="' + x.i + 'q">🔊 استماع</button><div class="qtLoc">الآية التالية — ' + loc(r.a) + '</div>' + ayahBox(r.a, 'ans') + '<button type="button" class="qtListen" data-rv="' + x.i + 'a">🔊 استماع</button></div>'; }).join('') + '</div>', 'result');
        var root = body();
        root.querySelector('.qtView').onclick = function (e) {
            var g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
            var l = e.target.closest('[data-rv]'); if (l) { var i = parseInt(l.dataset.rv, 10), r = Q.res[i]; playAyah(l.dataset.rv.slice(-1) === 'q' ? r.q : r.a, l); }
        };
        $('qtAgain').onclick = function () { var t = Q.type, lb = Q.label, qs = Q.qs.map(function (x) { return x; }); shuffle(qs); start(t, lb, qs); };
        var rb = $('qtRetryBad'); if (rb) rb.onclick = function () { var qs = Q.res.filter(function (r) { return !r.ok; }).map(function (r) { return { q: r.q, a: r.a, ctx: [] }; }); shuffle(qs); start(Q.type, Q.label + ' — الأخطاء', qs); };
        $('qtShare').onclick = function () {
            var t = 'اختبار القرآن — ' + TYPES[Q.type] + ' (' + Q.label + ')\nالنتيجة: ' + d.pct + '% — ' + d.ok + ' صحيحة من ' + d.n + ' (' + lv[0] + ')\nتطبيق المسلم';
            if (navigator.share) navigator.share({ text: t }).catch(function () { }); else try { navigator.clipboard.writeText(t).then(function () { toast('تم نسخ النتيجة'); }); } catch (e) { }
        };
        var ob = $('qtOnlyBad'); if (ob) ob.onchange = function () { resultView(this.checked); };
    }

    /* ---------------- السجل ---------------- */
    function history() {
        var h = ld(HK, []);
        var tot = h.length ? Math.round(h.reduce(function (a, x) { return a + x.pct; }, 0) / h.length) : 0;
        put(back() + '<h3>سجل اختباراتي</h3>' + (h.length ? '<div class="mini">متوسط نتائجك: <b>' + tot + '%</b> في ' + h.length + ' اختبار — محفوظ على جهازك فقط.</div><div class="qtHist">' + h.map(function (x) {
            var lv = level(x.pct); var d = new Date(x.t);
            return '<div class="qtH"><div class="qtHTop"><b>' + TYPES[x.type] + '</b><span class="qtBadge ' + lv[1] + '">' + (x.pct % 1 ? x.pct.toFixed(1) : x.pct) + '%</span></div><div class="mini">' + esc(x.label) + '</div><div class="qtHRow"><span>🗓 ' + d.toLocaleDateString('ar') + ' ' + d.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }) + '</span><span>الأسئلة ' + x.n + '</span><span>✔ ' + x.ok + '</span><span>✖ ' + x.bad + '</span><span>' + lv[0] + '</span></div></div>';
        }).join('') + '</div><button type="button" id="qtClr" class="qtDanger">🗑 مسح السجل</button>' : '<div class="notice">لا توجد اختبارات محفوظة بعد. أكمل اختبارًا ليظهر هنا.</div>'), 'hist');
        bindGo();
        var c = $('qtClr'); if (c) c.onclick = function () { if (confirm('مسح كل سجل الاختبارات؟')) { sv(HK, []); history(); } };
    }

    /* ---------------- الصفحة والتسجيل في التطبيق ---------------- */
    function build0() {
        if ($('quranTest')) return;
        var s = document.createElement('section'); s.id = 'quranTest'; s.className = 'page';
        s.innerHTML = '<div class="section"><button class="back" id="qtHome" aria-label="رجوع">←</button><div><h2>اختبار القرآن الكريم</h2><p>اختبر حفظك واكتشف مدى إتقانك للآيات.</p></div></div><div id="qtBody"></div>';
        var ref = document.querySelector('section.page'); (ref ? ref.parentNode : document.body).appendChild(s);
        $('qtHome').onclick = function () { if (Q && V.name === 'quiz' && !confirm('إنهاء الاختبار الآن؟ لن تُحفظ نتيجته.')) return; Q = null; if (V.name !== 'menu') menu(); else show0('home'); };
    }
    function show0(id) { if (window.show) window.show(id); }
    function open() { build0(); menu(); show0('quranTest'); }
    function tile() {
        var t = $('qtTile'); if (t) return;
        var ref = document.querySelector('#home [onclick*="repeatAyah"]') || document.querySelector('#home .tile'); if (!ref || !ref.parentNode) return;
        t = document.createElement('div'); t.className = 'tile'; t.id = 'qtTile'; t.onclick = open;
        t.innerHTML = '<span class="ico">🧠</span><b>اختبار القرآن</b><small>اختبر حفظك: آية ثم التي بعدها</small>';
        ref.parentNode.insertBefore(t, ref.nextSibling);
    }
    function init() {
        build0(); tile();
        var _s = window.show;
        if (typeof _s === 'function' && !_s.__qt) {
            var w = function (id) { var r = _s.apply(this, arguments); if (id !== 'quranTest') stopAudio(); if (id === 'quranTest' && !body().firstChild) menu(); if (id === 'home') setTimeout(tile, 60); return r; };
            w.__qt = 1; window.show = w;
        }
        window.v122QuranTest = { open: open };
    }
    var n = 0, iv = setInterval(function () { if (document.querySelector('#home .tile') && window.show) { clearInterval(iv); init(); } else if (++n > 80) clearInterval(iv); }, 300);
})();
