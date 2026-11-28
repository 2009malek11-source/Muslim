(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var LG = function (k, d) { try {
        var v = localStorage.getItem(k);
        return v === null ? d : JSON.parse(v);
    }
    catch (e) {
        return d;
    } };
    var LS = function (k, v) { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch (e) { } };
    var RAW = 'https://raw.githubusercontent.com/MohamadHajjRabee/quran-qcf4/5130511027e769f0a8f4eeb7f00f46bde3788d60/';
    var JSD = 'https://cdn.jsdelivr.net/gh/MohamadHajjRabee/quran-qcf4@5130511027e769f0a8f4eeb7f00f46bde3788d60/';
    var K = 'muslim-v107-mushaf';
    var DEF = { paper: 'cream', scale: 1, frame: true, tapPlay: true, page: 1, reciter: 'Alafasy_128kbps', mode: 'page' };
    function cfg() { return Object.assign({}, DEF, LG(K, {})); }
    function save(c) { LS(K, c); }
    var PAPERS = { cream: ['#fbf6e8', '#111', '#c8a15b'], white: ['#ffffff', '#000', '#9aa7a0'], sepia: ['#f1e4c7', '#2b1d0e', '#a37b3c'], night: ['#101714', '#e9efe9', '#7a6a3d'], gold: ['#fff3cf', '#1b1405', '#b8860b'] };
    var RIW = [['hafs', 'حفص عن عاصم', true], ['qalun', 'قالون عن نافع', false], ['warsh', 'ورش عن نافع', false], ['duri', 'الدوري عن أبي عمرو', false], ['susi', 'السوسي عن أبي عمرو', false], ['shuba', 'شعبة عن عاصم', false], ['bazzi', 'البزي عن ابن كثير', false], ['qunbul', 'قنبل عن ابن كثير', false]];
    var chapters = null, loadedFonts = {}, cache = {};
    var page = 1;
    function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
    var RECS = [['Alafasy_128kbps', 'مشاري العفاسي'], ['Husary_128kbps', 'محمود خليل الحصري'], ['Abdul_Basit_Murattal_192kbps', 'عبد الباسط (مرتل)'], ['Minshawy_Murattal_128kbps', 'المنشاوي (مرتل)'], ['Abdurrahmaan_As-Sudais_192kbps', 'عبد الرحمن السديس'], ['Saood_ash-Shuraym_128kbps', 'سعود الشريم']];
    var PNAME = { cream: 'كريمي', white: 'أبيض', sepia: 'سيبيا', gold: 'ذهبي', night: 'ليلي' };
var IC = { x: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>', r: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>', l: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>', bm: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>', bmOn: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>', gear: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', full: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>' };
    var XK = 'muslim-mp-extra';
    function xget() { var o = {}; try { o = JSON.parse(localStorage.getItem(XK) || '{}') || {}; } catch (e) { } var t = new Date(), d = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate(); if (o.day !== d) { o.day = d; o.read = []; } o.bm = Array.isArray(o.bm) ? o.bm : []; o.read = Array.isArray(o.read) ? o.read : []; o.goal = +o.goal > 0 ? +o.goal : 5; return o; }
    function xsave(o) { try { localStorage.setItem(XK, JSON.stringify(o)); } catch (e) { } }
    function markRead(n) { var o = xget(); if (o.read.indexOf(n) < 0) { o.read.push(n); xsave(o); } }
    function bmToggle() { var o = xget(), i = o.bm.indexOf(page); if (i < 0) o.bm.push(page); else o.bm.splice(i, 1); o.bm.sort(function (a, b) { return a - b; }); xsave(o); bmMark(); }
    function bmMark() { var b = $('mpBm'); if (!b) return; var on = xget().bm.indexOf(page) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.innerHTML = on ? IC.bmOn : IC.bm; }
    function wirdUI() {
        var box = $('mpWird'); if (!box) return; var o = xget(), n = o.read.length, pct = Math.min(100, Math.round(n / o.goal * 100));
        box.innerHTML = '<div class="mpWirdHd"><b>وِردي اليوم</b><span class="mini">' + n + ' من ' + o.goal + ' صفحات' + (n >= o.goal ? ' — بارك الله فيك' : '') + '</span></div><div class="mpDlTrack"><i style="width:' + pct + '%"></i></div><div class="mpStep"><button type="button" id="mpGoalM" aria-label="تقليل الهدف">−</button><span class="mini">الهدف اليومي: ' + o.goal + ' صفحات</span><button type="button" id="mpGoalP" aria-label="زيادة الهدف">+</button></div>' +
            (o.bm.length ? '<div class="mpWirdHd" style="margin-top:10px"><b>العلامات</b></div><div class="mpBms">' + o.bm.map(function (p) { return '<span class="mpBmChip"><button type="button" data-go="' + p + '">صفحة ' + p + '</button><button type="button" data-rm="' + p + '" aria-label="حذف العلامة">✕</button></span>'; }).join('') + '</div>' : '');
        $('mpGoalM').onclick = function () { var x = xget(); x.goal = Math.max(1, x.goal - 1); xsave(x); wirdUI(); };
        $('mpGoalP').onclick = function () { var x = xget(); x.goal = Math.min(100, x.goal + 1); xsave(x); wirdUI(); };
        box.querySelectorAll('[data-go]').forEach(function (b) { b.onclick = function () { view('read'); go(+b.getAttribute('data-go')); }; });
        box.querySelectorAll('[data-rm]').forEach(function (b) { b.onclick = function () { var x = xget(), i = x.bm.indexOf(+b.getAttribute('data-rm')); if (i >= 0) x.bm.splice(i, 1); xsave(x); wirdUI(); }; });
    }
    function view(v) { var s = $('mushaf107'); if (s) { s.setAttribute('data-view', v); } if (v === 'pick') { setSet(false); reading(false); pickInfo(); } else { setTimeout(fit, 30); } }
    function setSet(on) { var p = $('mpSet'); if (p) p.classList.toggle('show', !!on); }
    function pickInfo() { wirdUI(); var b = $('mpContinue'); if (b) b.textContent = 'متابعة القراءة — صفحة ' + (cfg().page || 1); }
    function ensure() {
        if ($('mushaf107'))
            return;
        var s = document.createElement('section');
        s.id = 'mushaf107';
        s.className = 'page';
        s.setAttribute('translate', 'no');
        s.setAttribute('data-view', 'pick');
        s.innerHTML =
            '<div class="mpPick">' +
            '<div class="mpTopBar"><button class="mpBack" id="mpHomeBack" aria-label="رجوع">' + IC.r + '</button><span></span><span></span></div>' +
            '<div class="mpHero"><div class="mpOrn" aria-hidden="true">﷽</div><h1>القرآن الكريم</h1><p>اختر المصحف الذي تريد قراءته</p></div>' +
            '<div class="mpEds" id="mpEds"></div>' +
            '<button class="mpContinue" id="mpContinue"></button>' +
            '<div class="mpWird" id="mpWird"></div>' +
            '</div>' +
            '<div class="mpRead">' +
            '<div class="mpTopBar"><button class="mpBack" id="mpBack" aria-label="رجوع">' + IC.r + '</button><b id="mpTitle">القرآن الكريم</b><span class="mpTbBtns"><button class="mpGear" id="mpRepTop" aria-label="تكرار الآية أو الصفحة">↻</button><button class="mpGear" id="mpBm" aria-label="علامة على هذه الصفحة"></button><button class="mpGear" id="mpGear" aria-label="إعدادات المصحف">' + IC.gear + '</button></span></div>' +
            '<div class="mpNav"><button id="mpPrev" aria-label="الصفحة السابقة">' + IC.r + '</button><div class="mpPn"><input id="mpNum" type="number" min="1" max="604" inputmode="numeric" aria-label="رقم الصفحة"><span class="mini">/ 604</span></div><button id="mpNext" aria-label="الصفحة التالية">' + IC.l + '</button></div>' +
            '<div class="mpSel"><select id="mpSurah" aria-label="السورة"></select><select id="mpJuz" aria-label="الجزء"></select><button id="mpRead" aria-label="وضع القراءة">' + IC.full + '</button></div>' +
            '<div class="mpInfo" id="mpInfo" aria-live="polite"></div>' +
            '<div class="mpWrap"><div class="mpPage" id="mpPage"><div class="mpLoad">جارٍ تحميل الصفحة…</div></div></div>' +
            '<div class="mpSheet" id="mpSheet"><b id="mpSheetT"></b><button class="primary" id="mpPlay">استماع</button><button id="mpCopy">نسخ</button><button id="mpShare">مشاركة كصورة</button><button id="mpRep">تكرار الآية</button><button id="mpClose" aria-label="إغلاق">' + IC.x + '</button></div>' +
            '<div class="mpSet" id="mpSet" role="dialog" aria-label="إعدادات المصحف"><div class="mpSetIn">' +
            '<div class="mpSetHd"><b>إعدادات المصحف</b><button id="mpSetX" aria-label="إغلاق">' + IC.x + '</button></div>' +
            '<div class="mpSetRow"><b>الرواية</b><div class="riwChips" id="mpRiw"></div><div class="mini" id="mpRiwNote"></div></div>' +
            '<div class="mpSetRow"><b>نمط العرض</b><div class="mpMode" id="mpModeSw" role="group" aria-label="نمط العرض"><button type="button" data-m="page">صفحة</button><button type="button" data-m="text">نص</button></div><div class="mini" id="mpModeNote"></div></div>' +
            '<div class="mpSetRow"><b>حجم الخط</b><div class="mpStep"><button id="mpMinus" aria-label="تصغير">A−</button><span id="mpZv" class="mini">100%</span><button id="mpPlus" aria-label="تكبير">A+</button></div></div>' +
            '<div class="mpSetRow"><b>سرعة النزول التلقائي</b><div class="mini">في وضع «نص السورة»: كلما كبّرت الخط (A+) زادت السرعة. اضغط ▶ داخل المصحف للبدء.</div><div class="mpAutoSet"><span class="mini">أبطأ</span><input type="range" id="mpAutoR" min="1" max="10" step="1" aria-label="سرعة النزول التلقائي"><span class="mini">أسرع</span><b id="mpAutoV">3</b></div></div>' +
            '<div class="mpSetRow"><b>لون الورق</b><div class="mpSw" id="mpSw"></div></div>' +
            '<label class="mpSetRow mpInline"><b>الإطار الذهبي</b><input type="checkbox" id="mpFrameCk"></label>' +
            '<div class="mpSetRow"><b>القراءة بلا إنترنت</b><div class="mini">احفظ المصحف على جهازك مرة واحدة ليعمل دون إنترنت (حجم كبير نسبيًا — يُفضّل الواي فاي). الصفحات التي تقرؤها تُحفظ تلقائيًا أيضًا.</div><div class="mpDlTrack"><i id="mpDlBar"></i></div><div class="mini" id="mpDlTxt"></div><button type="button" class="primary" id="mpDlBtn">⬇ حفظ المصحف كاملًا (صفحات + نص)</button><button type="button" id="mpDlTxtBtn">⬇ حفظ نص السور فقط (أخف: نحو ٤ م.ب)</button><div class="mini" id="mpDlTx2"></div><b class="mpJuzHd">أو احفظ جزءًا واحدًا فقط</b><div class="mpJuzList" id="mpJuzList"></div></div>' +
            '<div class="mpSetRow"><b>قارئ الآية عند اللمس</b><select id="mpRec"></select></div>' +
            '</div></div>' +
            '</div>';
        var ref = $('settings');
        (ref && ref.parentNode ? ref.parentNode : document.body).insertBefore(s, ref || null);
        $('mpEds').innerHTML = '<button class="mpEd on" id="mpEdHafs"><span class="mpEdT">مصحف المدينة النبوية</span><span class="mpEdS">رواية حفص عن عاصم • ٦٠٤ صفحة</span></button>';
        $('mpEdHafs').onclick = function () { view('read'); go(cfg().page || 1); };
        $('mpContinue').onclick = $('mpEdHafs').onclick;
        $('mpHomeBack').onclick = function () { show('home'); };
        $('mpBack').onclick = function () { if (document.body.classList.contains('mpReading')) { reading(false); return; } view('pick'); };
        $('mpBm').onclick = bmToggle; bmMark();
        $('mpGear').onclick = function () { setSet(!$('mpSet').classList.contains('show')); };
        $('mpSetX').onclick = function () { setSet(false); };
        $('mpSet').onclick = function (e) { if (e.target === this) setSet(false); };
        $('mpPrev').onclick = function () { if (cfg().mode === 'text') stepSurah(-1); else go(page - 1); };
        $('mpNext').onclick = function () { if (cfg().mode === 'text') stepSurah(1); else go(page + 1); };
        $('mpNum').onchange = function () { go(parseInt(this.value, 10) || 1); };
        $('mpSurah').onchange = function () { var c = chapters && chapters.chapters[+this.value - 1]; if (c)
            go(c.pages[0]); };
        $('mpJuz').onchange = function () { var p = JUZ_PAGES[+this.value]; if (p)
            go(p); };
        $('mpMinus').onclick = function () { var c = cfg(); c.scale = Math.max(.6, +(c.scale - .1).toFixed(2)); save(c); fit(); };
        $('mpPlus').onclick = function () { var c = cfg(); c.scale = Math.min(2, +(c.scale + .1).toFixed(2)); save(c); fit(); };
        $('mpSw').innerHTML = Object.keys(PAPERS).map(function (k) { return '<button type="button" data-p="' + k + '" aria-label="' + PNAME[k] + '" title="' + PNAME[k] + '" style="background:' + PAPERS[k][0] + ';border-color:' + PAPERS[k][2] + '"></button>'; }).join('');
        $('mpModeSw').onclick = function (e) { var b = e.target.closest('button[data-m]'); if (!b) return; var c = cfg(); c.mode = b.getAttribute('data-m') === 'text' ? 'text' : 'page'; save(c); syncSet(); if ($('mushaf107').getAttribute('data-view') === 'read') go(page); };
        $('mpSw').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; var c = cfg(); c.paper = b.getAttribute('data-p'); save(c); paper(); };
        $('mpAutoR').oninput = function () { var c = cfg(); c.autoLvl = +this.value; save(c); autoBtn(); }; $('mpFrameCk').onchange = function () { var c = cfg(); c.frame = this.checked; save(c); paper(); };
        $('mpRec').innerHTML = RECS.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + '</option>'; }).join('');
        $('mpRec').onchange = function () { var c = cfg(); c.reciter = this.value; save(c); };
        $('mpClose').onclick = function () { $('mpSheet').classList.remove('show'); unhl(); };
        $('mpRepTop').onclick = function () { if (window.MushafPlus) MushafPlus.repeat(null); };
        $('mpRead').onclick = function () { setSet(false); reading(true); };
        var ov = document.createElement('div');
        ov.id = 'mpOv';
        ov.innerHTML = '<button id="mpOvMinus" aria-label="تصغير">A−</button><button id="mpOvPlus" aria-label="تكبير">A+</button><button id="mpOvPrev" aria-label="الصفحة السابقة">' + IC.r + '</button><span id="mpOvNum"></span><button id="mpOvNext" aria-label="الصفحة التالية">' + IC.l + '</button><button id="mpOvExit" aria-label="خروج من وضع القراءة">' + IC.x + '<span>خروج</span></button>';
        document.body.appendChild(ov);
        $('mpOvMinus').onclick = function (e) { e.stopPropagation(); $('mpMinus').click(); };
        $('mpOvPlus').onclick = function (e) { e.stopPropagation(); $('mpPlus').click(); };
        $('mpOvPrev').onclick = function (e) { e.stopPropagation(); if (cfg().mode === 'text') stepSurah(-1); else go(page - 1); };
        $('mpOvNext').onclick = function (e) { e.stopPropagation(); if (cfg().mode === 'text') stepSurah(1); else go(page + 1); };
        $('mpOvExit').onclick = function (e) { e.stopPropagation(); reading(false); };
        document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && document.body.classList.contains('mpReading'))
            reading(false, true); });
        var sx = null;
        var pg = $('mpPage');
        pg.addEventListener('click', function (e) {
            if (!document.body.classList.contains('mpReading'))
                return;
            if (e.target.closest('.w'))
                return;
            document.body.classList.toggle('mpShowBars');
        });
        pg.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
        pg.addEventListener('touchend', function (e) { if (sx === null)
            return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 60) {
            go(dx > 0 ? page + 1 : page - 1);
        } }, { passive: true });
        document.addEventListener('keydown', function (e) { if (!$('mushaf107').classList.contains('active') || $('mushaf107').getAttribute('data-view') !== 'read')
            return; if (e.key === 'ArrowLeft')
            go(page + 1); if (e.key === 'ArrowRight')
            go(page - 1); if (e.key === 'Escape') setSet(false); });
        window.addEventListener('resize', function () { if ($('mushaf107').classList.contains('active'))
            fit(); });
        riw();
        var jz = $('mpJuz');
        jz.innerHTML = '<option value="">الجزء</option>' + Array.from({ length: 30 }, function (_, i) { return '<option value="' + (i + 1) + '">الجزء ' + (i + 1) + '</option>'; }).join('');
        $('mpDlBtn').onclick = startDl; $('mpDlTxtBtn').onclick = startTextOnly; textSet().then(function (o) { var k = Object.keys(o).length, t = $('mpDlTx2'); if (t) t.textContent = k ? 'نص السور المحفوظ: ' + k + ' من 114' : ''; }); bindJuz();
        syncSet();
        pickInfo();
    }
    function syncSet() { var c = cfg(); try { autoBtn(); } catch (e) { } document.querySelectorAll('#mpModeSw button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-m') === (c.mode === 'text' ? 'text' : 'page')); }); var mn = $('mpModeNote'); if (mn) mn.textContent = c.mode === 'text' ? 'كل سورة كاملة في صفحة واحدة تنزل بالتمرير للأسفل، مع زر «النزول التلقائي» الذي تزيد سرعته كلما كبّرت الخط (A+). يحتاج إنترنت أول مرة لكل سورة ثم تُحفظ.' : 'صفحات المصحف المطبوعة بخط المصحف الشريف.'; var f = $('mpFrameCk'); void f; var f = $('mpFrameCk'); if (f) f.checked = !!c.frame; var r = $('mpRec'); if (r) r.value = c.reciter; }
    var JUZ_PAGES = { 1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 121, 8: 142, 9: 162, 10: 182, 11: 201, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382, 21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582 };
    function riw() {
        var b = $('mpRiw');
        b.innerHTML = RIW.map(function (r) { return '<button data-r="' + r[0] + '" class="' + (r[2] ? 'on' : '') + '" ' + (r[2] ? '' : 'disabled') + '>' + esc(r[1]) + (r[2] ? '' : ' (قريبًا)') + '</button>'; }).join('');
        $('mpRiwNote').textContent = 'المتاح الآن: حفص عن عاصم. لا تُضاف رواية إلا بعد توفّر مصحف موثّق لها حتى لا تظهر أخطاء.';
    }
    function paper() {
        var c = cfg(), p = PAPERS[c.paper] || PAPERS.cream, el = $('mpPage');
        if (!el)
            return;
        el.style.setProperty('--mp-bg', p[0]);
        el.style.setProperty('--mp-fg', p[1]);
        el.style.setProperty('--mp-frame', p[2]);
        el.classList.toggle('noFrame', !c.frame);
        document.querySelectorAll('#mpSw button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-p') === c.paper); });
        if ($('mpFrameCk')) $('mpFrameCk').checked = !!c.frame;
        var h = document.getElementById('mushaf107'); if (h) h.style.setProperty('--mp-bg', p[0]);
    }
    var MC = 'muslim-mushaf-v1';
    function cget(url) { return window.caches ? caches.open(MC).then(function (c) { return c.match(url); }).catch(function () { return null; }) : Promise.resolve(null); }
    /* علامة «تمّ حفظ الصفحة كاملة» (نصها + خطها) — لا تُحسب الصفحة محفوظة بمجرد وجود نصها */
    var MK = 'https://muslim.local/mushaf-ok/';
    function cput(url, res) { if (!window.caches) return Promise.resolve(); try { return caches.open(MC).then(function (c) { return c.put(url, res); }).catch(function () { }); } catch (e) { return Promise.resolve(); } }
    function mark(n) { return cput(MK + pad3(n), new Response('1')); }
    function netGet(url) { return fetch(url).then(function (r) { if (!r.ok) throw 0; var c = r.clone(); return cput(url, c).then(function () { return r; }); }); }
    function getJSON(path) {
        if (cache[path])
            return Promise.resolve(cache[path]);
        return cget(RAW + path).then(function (hit) { return hit || cget(JSD + path); }).then(function (hit) { return hit || netGet(RAW + path).catch(function () { return netGet(JSD + path); }); }).then(function (r) { return r.json(); }).then(function (j) { cache[path] = j; return j; });
    }
    function fontUrl(name) { return JSD + 'fonts-woff2/' + name + (name === 'QCF4_QBSML' ? '' : '_W') + '.woff2'; }
    function fontUrlAlt(name) { return RAW + 'fonts-woff2/' + name + (name === 'QCF4_QBSML' ? '' : '_W') + '.woff2'; }
    /* الخط: من الذاكرة بأي من المصدرين، وإلا من الشبكة (jsDelivr ثم GitHub إن حُجب أحدهما) */
    function getFont(name) {
        var a = fontUrl(name), b = fontUrlAlt(name);
        return cget(a).then(function (h) { return h || cget(b); }).then(function (h) { return h || netGet(a).catch(function () { return netGet(b); }); });
    }
    function loadFont(name) {
        if (loadedFonts[name])
            return loadedFonts[name];
        if (!/^QCF4_[A-Za-z0-9_]{1,24}$/.test(name)) return Promise.reject(0);
        loadedFonts[name] = getFont(name).then(function (r) { return r.arrayBuffer(); }).then(function (buf) { var ff = new FontFace(name, buf, { display: 'block' }); return ff.load(); }).then(function (f) { document.fonts.add(f); return f; }).catch(function (e) { delete loadedFonts[name]; throw e; });
        return loadedFonts[name];
    }
    /* حفظ المصحف كاملًا على الجهاز ليُقرأ بلا إنترنت */
    var dl = { run: false };
    function pad3(n) { return ('00' + n).slice(-3); }
    function savedSet() { if (!window.caches) return Promise.resolve({}); return caches.open(MC).then(function (c) { return c.keys(); }).then(function (ks) { var o = {}; ks.forEach(function (k) { var m = /mushaf-ok\/(\d{3})$/.exec(k.url); if (m) o[+m[1]] = 1; }); return o; }).catch(function () { return {}; }); }
    function savedCount() { return savedSet().then(function (o) { return Object.keys(o).length; }); }
    function juzRange(n) { return [JUZ_PAGES[n], n < 30 ? JUZ_PAGES[n + 1] - 1 : 604]; }
    function updDl(n, txt) { var b = $('mpDlBar'), t = $('mpDlTxt'); if (b) b.style.width = Math.round(n / 6.04) + '%'; if (t) t.textContent = txt; }
    function paintJuz(have, busy) {
        var box = $('mpJuzList'); if (!box) return;
        var h = '';
        for (var n = 1; n <= 30; n++) {
            var r = juzRange(n), tot = r[1] - r[0] + 1, got = 0, p;
            for (p = r[0]; p <= r[1]; p++) if (have[p]) got++;
            var full = got >= tot, run = busy === n;
            h += '<div class="mpJuzRow"><span>الجزء ' + n + '</span><span class="mini">' + (full ? 'محفوظ' : (got ? got + ' من ' + tot : tot + ' صفحة')) + '</span>' +
                (full ? '<button type="button" data-jr="' + n + '" aria-label="حذف الجزء ' + n + '">حذف</button>' : '<button type="button" data-jd="' + n + '"' + (busy && !run ? ' disabled' : '') + ' aria-label="حفظ الجزء ' + n + '">' + (run ? 'إيقاف' : 'تنزيل') + '</button>') + '</div>';
        }
        box.innerHTML = h;
    }
    function refreshJuz(busy) { return savedSet().then(function (o) { paintJuz(o, busy); return o; }); }
    function dlRange(from, to, juz) {
        if (dl.run) { dl.run = false; return; }
        if (!window.caches) { updDl(0, 'هذا المتصفح لا يدعم الحفظ دون إنترنت.'); return; }
        if (navigator.onLine === false) { updDl(0, 'يلزم اتصال بالإنترنت لإتمام التحميل.'); return; }
        dl.run = true; $('mpDlBtn').textContent = 'إيقاف'; $('mpDlBtn').disabled = !!juz;
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
        var i = from, done = 0, fail = 0, total = to - from + 1, last = 0;
        getJSON('index.json').then(function (j) { chapters = j; fillSurahs(); }).catch(function () { });
        loadFont('QCF4_QBSML').catch(function () { });
        refreshJuz(juz || 0);
        function retry(n) { var f = pad3(n); return new Promise(function (ok) { setTimeout(ok, 700); }).then(function () { delete cache['pages/' + f + '.json']; return getJSON('pages/' + f + '.json'); }).then(function (d) { return getFont(d.font); }).then(function () { return mark(n); }); }
        function one() {
            if (!dl.run || i > to) return Promise.resolve();
            var n = i++, f = pad3(n);
            return getJSON('pages/' + f + '.json').then(function (d) { return getFont(d.font); }).then(function () { return mark(n); }).then(function () { done++; }).catch(function () { return retry(n).then(function () { done++; }).catch(function () { fail++; }); }).then(function () {
                var pc = Math.round((done + fail) * 100 / total);
                var b = $('mpDlBar'), t = $('mpDlTxt'); if (b) b.style.width = pc + '%'; if (t) t.textContent = 'تم حفظ ' + done + ' من ' + total + (fail ? ' — تعثّر ' + fail : '');
                return one();
            });
        }
        Promise.all([one(), one(), one(), one()]).then(function () { return (!juz && dl.run) ? dlText().catch(function () { }) : null; }).then(function () {
            var ok = dl.run; dl.run = false; $('mpDlBtn').textContent = 'حفظ المصحف كاملًا'; $('mpDlBtn').disabled = false;
            refreshJuz(0).then(function (o) {
                var k = Object.keys(o).length;
                if (juz) { var r = juzRange(juz), g = 0, p; for (p = r[0]; p <= r[1]; p++) if (o[p]) g++; updDl(g * 604 / (r[1] - r[0] + 1), g >= r[1] - r[0] + 1 ? 'تم حفظ الجزء ' + juz : (ok ? 'تم حفظ ' + g + ' صفحة — أعد الضغط لإكمال الباقي' : 'أُوقف التحميل')); }
                else updDl(k, k >= 604 && !fail ? 'المصحف محفوظ بالكامل — يعمل بلا إنترنت' : (ok ? 'تم حفظ ' + k + ' من 604 — أعد الضغط لإكمال الباقي' : 'أُوقف عند ' + k + ' من 604'));
            });
        });
    }
    /* نص السور (وضع «نص السورة») يُحفظ مع المصحف ليُقرأ دون إنترنت */
    var TK = 'https://muslim.local/mushaf-text-ok/';
    function textSet() { if (!window.caches) return Promise.resolve({}); return caches.open(MC).then(function (c) { return c.keys(); }).then(function (ks) { var o = {}; ks.forEach(function (k) { var m = /mushaf-text-ok\/(\d{3})$/.exec(k.url); if (m) o[+m[1]] = 1; }); return o; }).catch(function () { return {}; }); }
    function dlText() {
        if (!window.caches) return Promise.resolve(false);
        return textSet().then(function (have) {
            var todo = [], n; for (n = 1; n <= 114; n++) if (!have[n]) todo.push(n);
            var done = 114 - todo.length, fail = 0, t = $('mpDlTx2');
            function say() { if (t) t.textContent = 'نص السور: ' + done + ' من 114' + (fail ? ' — تعثّر ' + fail : ''); }
            say();
            function one() {
                if (!todo.length || !dl.run) return Promise.resolve();
                var sn = todo.shift();
                return surahApi(sn).then(function () { return cput(TK + pad3(sn), new Response('1')); }).then(function () { done++; }).catch(function () { return new Promise(function (ok) { setTimeout(ok, 600); }).then(function () { return surahApi(sn); }).then(function () { return cput(TK + pad3(sn), new Response('1')); }).then(function () { done++; }).catch(function () { fail++; }); }).then(function () { say(); return one(); });
            }
            return Promise.all([one(), one(), one()]).then(function () { return done >= 114; });
        });
    }
    function startTextOnly() {
        if (dl.run) { dl.run = false; return; }
        if (navigator.onLine === false) { updDl(0, 'يلزم اتصال بالإنترنت.'); return; }
        dl.run = true; var b = $('mpDlTxtBtn'); if (b) b.textContent = 'إيقاف';
        dlText().then(function (ok) { dl.run = false; if (b) b.textContent = '⬇ حفظ نص السور فقط (أخف: نحو ٤ م.ب)'; var t = $('mpDlTx2'); if (t && ok) t.textContent = 'نص السور الـ114 محفوظ — يعمل بلا إنترنت ✅'; });
    }
    function startDl() { dlRange(1, 604, 0); }
    function rmJuz(n) {
        if (!window.caches || dl.run) return;
        var r = juzRange(n);
        caches.open(MC).then(function (c) { return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { var m = /(?:pages\/(\d{3})\.json|mushaf-ok\/(\d{3}))$/.exec(k.url); var q = m && +(m[1] || m[2]); return q >= r[0] && q <= r[1]; }).map(function (k) { return c.delete(k); })); }); }).then(function () { Object.keys(cache).forEach(function (k) { var m = /pages\/(\d{3})\.json$/.exec(k); if (m && +m[1] >= r[0] && +m[1] <= r[1]) delete cache[k]; }); return refreshJuz(0); }).then(function () { updDl(0, 'تم حذف الجزء ' + n + ' من الجهاز'); }).catch(function () { });
    }
    /* ترحيل ما حُفظ بالنسخ السابقة: الصفحة التي نصها وخطها في الذاكرة تُعلَّم محفوظة (مرة واحدة) */
    function migrate() {
        if (!window.caches) return Promise.resolve();
        try { if (localStorage.getItem('mp-mig-2')) return Promise.resolve(); } catch (e) { }
        return caches.open(MC).then(function (c) {
            return c.keys().then(function (ks) {
                var have = {}, js = [];
                ks.forEach(function (k) { var m = /mushaf-ok\/(\d{3})$/.exec(k.url), q = /pages\/(\d{3})\.json$/.exec(k.url); if (m) have[+m[1]] = 1; else if (q && /raw\.githubusercontent|cdn\.jsdelivr/.test(k.url)) js.push([+q[1], k]); });
                return js.reduce(function (pr, x) {
                    return pr.then(function () {
                        if (have[x[0]]) return;
                        return c.match(x[1]).then(function (r) { return r.json(); }).then(function (d) { return c.match(fontUrl(d.font)).then(function (f1) { return f1 || c.match(fontUrlAlt(d.font)); }); }).then(function (f) { if (f) return c.put(MK + pad3(x[0]), new Response('1')); }).catch(function () { });
                    });
                }, Promise.resolve());
            });
        }).then(function () { try { localStorage.setItem('mp-mig-2', '1'); } catch (e) { } }).catch(function () { });
    }
    function bindJuz() {
        var box = $('mpJuzList'); if (!box) return;
        box.onclick = function (e) {
            var b = e.target.closest && e.target.closest('button'); if (!b) return;
            if (b.dataset.jd) { var n = +b.dataset.jd, r = juzRange(n); dlRange(r[0], r[1], n); }
            else if (b.dataset.jr) rmJuz(+b.dataset.jr);
        };
        migrate().then(function () { refreshJuz(0); savedCount().then(function (k) { updDl(k, k ? 'محفوظ على الجهاز: ' + k + ' من 604 صفحة' : 'لم يُحفظ شيء بعد'); if (k) try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { } }); });
    }
    function surahName(id) { var c = chapters && chapters.chapters[id - 1]; return c ? c.name_arabic : ''; }
    function reading(on, fromFs) {
        document.body.classList.toggle('mpReading', on);
        document.body.classList.remove('mpShowBars');
        if (on) {
            try {
                var r = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
                if (r)
                    r.call(document.documentElement).catch(function () { });
            }
            catch (e) { }
        }
        else if (!fromFs) {
            try {
                if (document.fullscreenElement)
                    document.exitFullscreen();
            }
            catch (e) { }
        }
        setTimeout(fit, 60);
        setTimeout(fit, 350);
    }
    window.addEventListener('orientationchange', function () { setTimeout(fit, 300); });
    function go(n) {
        var sec0 = $('mushaf107'); if (sec0 && sec0.getAttribute('data-view') !== 'read') sec0.setAttribute('data-view', 'read');
        n = Math.max(1, Math.min(604, n | 0 || 1));
        page = n;
        var c = cfg();
        c.page = n;
        save(c);
        $('mpNum').value = n;
        $('mpSheet').classList.remove('show');
        var el = $('mpPage');
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
        el.innerHTML = '<div class="mpLoad">جارٍ تحميل الصفحة ' + n + '…</div>';
        var f = ('00' + n).slice(-3);
        if (cfg().mode === 'text') {
            autoStop();
            (chapters ? Promise.resolve() : getJSON('index.json').then(function (j) { chapters = j; fillSurahs(); })).then(function () { return loadSurah(surahOfPage(n), n); }).catch(function () {
                el.innerHTML = '<div class="mpLoad" style="text-align:center;padding:20px">تعذّر تحميل نص السورة. تحقّق من الإنترنت ثم <button onclick="v107Mushaf.go(' + n + ')">أعد المحاولة</button></div>';
            });
            return;
        }
        autoUI(false);
        Promise.all([getJSON('pages/' + f + '.json'), chapters ? 0 : getJSON('index.json').then(function (j) { chapters = j; fillSurahs(); })]).then(function (r) {
            var d = r[0];
            return Promise.all([loadFont(d.font), loadFont('QCF4_QBSML')]).then(function () { return d; });
        }).then(function (d) { if (d.page === page)
            draw(d); }).catch(function () {
            el.innerHTML = '<div class="mpLoad" style="text-align:center;padding:20px">تعذّر تحميل الصفحة. تحقّق من الإنترنت ثم <button onclick="v107Mushaf.go(' + n + ')">أعد المحاولة</button></div>';
        });
        if (n < 604)
            getJSON('pages/' + ('00' + (n + 1)).slice(-3) + '.json').catch(function () { });
    }
    function fillSurahs() {
        var s = $('mpSurah');
        if (!s || !chapters)
            return;
        s.innerHTML = chapters.chapters.map(function (c) { return '<option value="' + c.id + '">' + c.id + '. ' + esc(c.name_arabic) + '</option>'; }).join('');
        syncSurah();
    }
    function syncSurah() {
        if (!chapters)
            return;
        var cur = 1;
        chapters.chapters.forEach(function (c) { if (c.pages[0] <= page)
            cur = c.id; });
        var s = $('mpSurah');
        if (s)
            s.value = cur;
    }
    function juzOf(p) { var j = 1; Object.keys(JUZ_PAGES).forEach(function (k) { if (JUZ_PAGES[k] <= p)
        j = +k; }); return j; }
    function arNum(x) { try { return Number(x).toLocaleString('ar-EG', { useGrouping: false }); } catch (e) { return String(x); } }
    var BSM = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
    function stripBsm(t, sn, an) { if (an !== 1 || sn === 1 || sn === 9) return t; var w = String(t).split(' '); return /^بِسْمِ/.test(w[0] || '') && w.length > 4 ? w.slice(4).join(' ') : t; }

    /* ===== نمط «نص»: سورة كاملة في صفحة واحدة بتمرير عمودي متصل + نزول تلقائي ===== */
    var curSur = 0, auto = { on: false, raf: 0, last: 0, pos: 0, nextT: 0 };
    function surahOfPage(n) { var r = 1; if (chapters) chapters.chapters.forEach(function (c) { if (c.pages[0] <= n) r = c.id; }); return r; }
    function surahApi(sn) {
        var url = 'https://api.alquran.cloud/v1/surah/' + sn + '/quran-uthmani';
        return cget(url).then(function (hit) { return hit || netGet(url); }).then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.data || !Array.isArray(j.data.ayahs) || !j.data.ayahs.length) throw 0; return j.data; });
    }
    function scroller() { var w = $('mpPage') && $('mpPage').parentElement; if (w && w.scrollHeight > w.clientHeight + 4 && /(auto|scroll)/.test(getComputedStyle(w).overflowY)) return w; return document.scrollingElement || document.documentElement; }
    function loadSurah(sn, wantPage) {
        sn = Math.max(1, Math.min(114, sn | 0 || 1)); var tok = ++loadTok;
        return surahApi(sn).then(function (d) { if (tok !== loadTok) return; drawSurah(sn, d, wantPage); });
    }
    var loadTok = 0;
    function drawSurah(sn, d, wantPage) {
        curSur = sn; var el = $('mpPage'), ays = d.ayahs, html = '', pages = [], first = ays[0], ch = chapters && chapters.chapters[sn - 1];
        var title = surahName(sn) || String(d.name || '').replace(/^سُورَةُ\s*/, '');
        html += '<div class="mpLine center mpHdLine"><div class="mpSH"><i>' + sn + '</i><b>سورة ' + esc(title) + '</b><i></i></div></div>';
        if (sn !== 1 && sn !== 9) html += '<div class="mpBsm">' + BSM + '</div>';
        html += '<p class="mpTxtP mpSurahP">';
        ays.forEach(function (a, i) {
            var an = i + 1, pg = +a.page || 0;
            html += '<span class="w mpTv" data-vk="' + sn + ':' + an + '" data-pg="' + pg + '">' + esc(stripBsm(a.text, sn, an)) + ' <span class="mpEnd" aria-hidden="true">﴿' + arNum(an) + '﴾</span></span> ';
        });
        html += '</p>';
        var prev = sn > 1 ? '<button type="button" id="mpSurPrev">◀ ' + esc(surahName(sn - 1)) + '</button>' : '<span></span>';
        var next = sn < 114 ? '<button type="button" id="mpSurNext">' + esc(surahName(sn + 1)) + ' ▶</button>' : '<span></span>';
        var p0 = +first.page || (ch ? ch.pages[0] : 1);
        var head = '<div class="mpHead"><span>الجزء ' + (+first.juz || juzOf(p0)) + '</span><span>سورة ' + esc(title) + ' • ' + arNum(ays.length) + ' آية</span></div>';
        el.classList.add('txtMode'); el.classList.add('surMode');
        el.innerHTML = head + '<div class="mpLines mpTxtMode mpSurahMode" id="mpLines">' + html + '</div><div class="mpSurNav">' + prev + next + '</div>';
        paper(); fit(); syncSurah(); autoUI(true);
        $('mpLines').onclick = function (e) { var w = e.target.closest('.w'); if (!w || !w.dataset.vk) return; pick(w.dataset.vk); };
        var b1 = $('mpSurPrev'), b2 = $('mpSurNext'); if (b1) b1.onclick = function () { stepSurah(-1); }; if (b2) b2.onclick = function () { stepSurah(1); };
        page = wantPage && wantPage >= p0 ? wantPage : p0; $('mpNum').value = page; $('mpOvNum').textContent = 'سورة ' + title;
        var tt = $('mpTitle'); if (tt) tt.textContent = 'سورة ' + title + ' • الجزء ' + (+first.juz || juzOf(p0));
        var c = cfg(); c.page = page; save(c); markRead(page); bmMark();
        var sc = scroller(); sc.scrollTop = 0; auto.pos = 0;
        if (wantPage && wantPage > p0) { var t = el.querySelector('.w[data-pg="' + wantPage + '"]'); if (t) setTimeout(function () { var r = t.getBoundingClientRect(), b = sc === document.scrollingElement || sc === document.documentElement ? 0 : sc.getBoundingClientRect().top; sc.scrollTop = Math.max(0, sc.scrollTop + r.top - b - 80); auto.pos = sc.scrollTop; }, 60); }
        try { document.dispatchEvent(new CustomEvent('mushaf:page', { detail: { page: page, surahs: [{ id: sn, name_arabic: title }] } })); } catch (e) { }
        if (sn < 114) surahApi(sn + 1).catch(function () { });
        if (auto.resume) { auto.resume = false; setTimeout(autoStart, 900); }
    }
    function stepSurah(d) { var t = Math.max(1, Math.min(114, (curSur || surahOfPage(page)) + d)); var ch = chapters && chapters.chapters[t - 1]; if (ch) go(ch.pages[0]); }
    function trackPage() {
        if (cfg().mode !== 'text') return; var ws = document.querySelectorAll('#mpLines .w[data-pg]'); if (!ws.length) return;
        var sc = scroller(), top = (sc === document.scrollingElement || sc === document.documentElement) ? 0 : sc.getBoundingClientRect().top, y = top + 120, hit = null;
        for (var i = 0; i < ws.length; i++) { var r = ws[i].getBoundingClientRect(); if (r.bottom > y) { hit = ws[i]; break; } }
        var p = hit ? +hit.getAttribute('data-pg') : 0; if (p && p !== page) { page = p; $('mpNum').value = p; markRead(p); var c = cfg(); c.page = p; save(c); bmMark(); }
    }
    /* النزول التلقائي: السرعة (px/ث) = مستوى × ٦ × معامل حجم الخط، فتزيد السرعة كلما كبّرت الخط A+ */
    function autoSpeed() { var c = cfg(); return Math.max(1, Math.min(10, +c.autoLvl || 3)) * 6 * zoomVal(); }
    function autoTick(t) {
        if (!auto.on) return; var sc = scroller();
        if (auto.last) { var dt = Math.min(.1, (t - auto.last) / 1000); auto.pos += autoSpeed() * dt; if (Math.abs(sc.scrollTop - Math.round(auto.pos)) > 3 && Math.abs(sc.scrollTop - auto.pos) > 40) auto.pos = sc.scrollTop + autoSpeed() * dt; sc.scrollTop = auto.pos; }
        auto.last = t; trackPage();
        if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2) {
            if (curSur < 114) { auto.on = false; auto.resume = true; autoBtn(); setTimeout(function () { if (auto.resume) stepSurah(1); }, 1800); return; }
            autoStop(); return;
        }
        auto.raf = requestAnimationFrame(autoTick);
    }
    function autoBtn() { var b = $('mpAutoGo'); if (b) { b.textContent = auto.on ? '⏸' : '▶'; b.setAttribute('aria-pressed', auto.on ? 'true' : 'false'); b.setAttribute('aria-label', auto.on ? 'إيقاف النزول التلقائي' : 'بدء النزول التلقائي'); } var v = $('mpAutoV'); if (v) v.textContent = String(cfg().autoLvl || 3); var r = $('mpAutoR'); if (r) r.value = cfg().autoLvl || 3; }
    function autoStart() { if (auto.on || cfg().mode !== 'text') return; var sc = scroller(); auto.pos = sc.scrollTop; auto.on = true; auto.last = 0; autoBtn(); auto.raf = requestAnimationFrame(autoTick); }
    function autoStop() { auto.on = false; auto.resume = false; if (auto.raf) cancelAnimationFrame(auto.raf); auto.raf = 0; auto.last = 0; autoBtn(); }
    function autoUI(on) {
        var sec = $('mushaf107'); if (sec) sec.setAttribute('data-txt', on ? '1' : '0');
        if (!on) { autoStop(); return; }
        if ($('mpAuto')) { autoBtn(); return; }
        var rd = document.querySelector('#mushaf107 .mpRead'); if (!rd) return;
        var bar = document.createElement('div'); bar.id = 'mpAuto'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'النزول التلقائي');
        bar.innerHTML = '<button type="button" id="mpAutoGo" aria-pressed="false">▶</button><span class="mpAutoL">نزول تلقائي — السرعة من ⚙️ الإعدادات</span>';
        rd.appendChild(bar);
        $('mpAutoGo').onclick = function () { if (auto.on) autoStop(); else autoStart(); };
        ['touchstart', 'wheel', 'mousedown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, function (e) { if (auto.on && !(e.target && e.target.closest && e.target.closest('#mpAuto'))) autoStop(); }, { passive: true, capture: true }); });
        var sc2 = function () { if (!auto.on) trackPage(); }; window.addEventListener('scroll', sc2, { passive: true }); rd.addEventListener('scroll', sc2, { passive: true, capture: true });
        autoBtn();
    }
    function draw(d) {
        var el = $('mpPage');
        var head = '<div class="mpHead"><span>الجزء ' + juzOf(d.page) + '</span><span>' + (d.surahs && d.surahs[0] ? 'سورة ' + esc(d.surahs[0].name_arabic) : '') + '</span></div>';
        var lines = d.lines.map(function (l) {
            var ws = l.words || [], only = ws.length === 1 && (ws[0].type === 'surah_header' || ws[0].type === 'bismillah');
            if (ws.length === 1 && ws[0].type === 'surah_header') {
                var sn = +ws[0].sura || 0, nm = surahName(sn);
                if (!nm && d.surahs) d.surahs.forEach(function (x) { if (+x.id === sn) nm = x.name_arabic; });
                return '<div class="mpLine center mpHdLine" data-ln="' + (+l.line || 0) + '"><div class="mpSH"><i>' + (sn || '') + '</i><b>سورة ' + esc(nm || '') + '</b><i></i></div></div>';
            }
            var html = ws.map(function (w) {
                var attr = /^\d{1,3}:\d{1,3}$/.test(w.verse_key || '') ? ' data-vk="' + w.verse_key + '"' : '';
                var style = 'font-family:\'' + (/^QCF4_[A-Za-z0-9_]{1,24}$/.test(w.font || '') ? w.font : 'QCF4_QBSML') + '\'';
                return '<span class="w"' + attr + ' style="' + style + '">' + esc(w.char || '') + '</span>';
            }).join(only ? '' : '');
            return '<div class="mpLine' + (only ? ' center' : '') + '" data-ln="' + (+l.line || 0) + '">' + html + '</div>';
        }).join('');
        el.classList.remove('txtMode');
        el.innerHTML = head + '<div class="mpLines" id="mpLines">' + lines + '</div><div class="mpFoot">' + d.page + '</div>';
        paper();
        fit();
        syncSurah();
        $('mpLines').onclick = function (e) { var w = e.target.closest('.w'); if (!w || !w.dataset.vk)
            return; pick(w.dataset.vk); };
        $('mpOvNum').textContent = 'الجزء ' + juzOf(d.page) + ' • صفحة ' + d.page;
        markRead(d.page); bmMark();
        try { document.dispatchEvent(new CustomEvent('mushaf:page', { detail: { page: d.page, surahs: d.surahs || [] } })); } catch (e) { }
        var tt = $('mpTitle'); if (tt) tt.textContent = (d.surahs && d.surahs[0] ? 'سورة ' + d.surahs[0].name_arabic : 'القرآن الكريم') + ' • الجزء ' + juzOf(d.page);
        var c = cfg();
        c.page = d.page;
        save(c);
    }
    function gfs() { var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v105-fs')); return isFinite(v) && v > 0 ? v : 1; }
    function zoomVal() { return Math.max(.6, Math.min(2.4, cfg().scale * gfs())); }
    function fit() {
        var box = $('mpLines'), pg = $('mpPage');
        if (!box || !pg)
            return;
        pg.style.setProperty('--mpZ', zoomVal());
        if (box.classList.contains('mpTxtMode')) { box.style.setProperty('--mpLh', '46px'); box.style.fontSize = Math.round(Math.max(15, Math.min(34, box.clientWidth * 0.058)) * zoomVal()) + 'px'; var z0 = $('mpZv'); if (z0) z0.textContent = Math.round(cfg().scale * 100) + '%'; return; }
        var W = box.clientWidth, H = box.clientHeight;
        if (!W)
            return;
        var reading = document.body.classList.contains('mpReading');
        var fs = W * 0.095;
        box.style.fontSize = fs + 'px';
        var lines = box.querySelectorAll('.mpLine:not(.center)'), guard = 0;
        function widest() { var m = 0; lines.forEach(function (l) { var s = 0; l.querySelectorAll('.w').forEach(function (w) { s += w.offsetWidth; }); if (s > m)
            m = s; }); return m; }
        while (guard++ < 20) {
            var m = widest();
            if (!m || Math.abs(m - W * 0.99) < W * 0.004)
                break;
            fs *= (W * 0.99) / m;
            box.style.fontSize = fs + 'px';
        }
        var lh = H / 15;
        if (fs > lh * 0.95) {
            fs = lh * 0.95;
            box.style.fontSize = fs + 'px';
        }
        box.style.setProperty('--mpLh', lh + 'px');
        box.querySelectorAll('.mpLine.center .w').forEach(function (w) {
            w.style.fontSize = (fs * 0.95) + 'px';
            var ww = w.offsetWidth; if (ww > W * 0.97) w.style.fontSize = (fs * 0.95 * W * 0.97 / ww) + 'px';
        });
        var z = $('mpZv');
        if (z)
            z.textContent = Math.round(cfg().scale * 100) + '%';
    }
    new MutationObserver(function () { if ($('mpPage'))
        fit(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    var curVK = null;
    function unhl() { document.querySelectorAll('#mpLines .w.hl').forEach(function (w) { w.classList.remove('hl'); }); curVK = null; }
    function pick(vk) {
        unhl();
        curVK = vk;
        document.querySelectorAll('#mpLines .w[data-vk="' + vk + '"]').forEach(function (w) { w.classList.add('hl'); });
        var p = vk.split(':');
        $('mpSheetT').textContent = 'سورة ' + surahName(+p[0]) + ' — آية ' + p[1];
        $('mpSheet').classList.add('show');
        $('mpPlay').onclick = function () { playAyah(+p[0], +p[1]); };
        $('mpCopy').onclick = function () { if (window.MushafPlus) MushafPlus.copy(vk); };
        $('mpShare').onclick = function () { if (window.MushafPlus) MushafPlus.share(vk); };
        $('mpRep').onclick = function () { if (window.MushafPlus) MushafPlus.repeat(vk); };
    }
    var ay = null;
    function playAyah(s, a) {
        var c = cfg(), pad = function (n, l) { return ('000' + n).slice(-l); };
        try {
            if (ay) {
                ay.pause();
            }
        }
        catch (e) { }
        ay = new Audio('https://everyayah.com/data/' + c.reciter + '/' + pad(s, 3) + pad(a, 3) + '.mp3'); ay.setAttribute('data-v107sub', 'المصحف');
        ay.setAttribute('data-v107title', '📖 ' + surahName(s) + ' — آية ' + a);
        ay.onerror = function () { if (window.showToast)
            showToast('تعذّر تشغيل الآية الآن.'); };
        ay.play().catch(function () { });
    }
    function ayahWords(vk) {
        var ps = [page - 1, page, page + 1].filter(function (p) { return p >= 1 && p <= 604; });
        return Promise.all(ps.map(function (p) { return getJSON('pages/' + pad3(p) + '.json').catch(function () { return null; }); })).then(function (ds) {
            var out = [];
            ds.forEach(function (d) { if (!d) return; d.lines.forEach(function (l) { (l.words || []).forEach(function (w) { if (w.verse_key === vk) out.push(w); }); }); });
            var fonts = {}; out.forEach(function (w) { if (/^QCF4_[A-Za-z0-9_]{1,24}$/.test(w.font || '')) fonts[w.font] = 1; });
            return Promise.all(Object.keys(fonts).map(function (f) { return loadFont(f); })).then(function () { return out; });
        });
    }
    function pageKeys(n) {
        return getJSON('pages/' + pad3(n) + '.json').then(function (d) {
            var seen = {}, keys = [];
            d.lines.forEach(function (l) { (l.words || []).forEach(function (w) { var k = w.verse_key; if (/^\d{1,3}:\d{1,3}$/.test(k || '') && !seen[k]) { seen[k] = 1; keys.push(k); } }); });
            return keys;
        });
    }
    function hlVerse(vk) { unhl(); if (!vk) return; curVK = vk; document.querySelectorAll('#mpLines .w[data-vk="' + vk + '"]').forEach(function (w) { w.classList.add('hl'); }); }
    document.addEventListener('muslim:mushaf-cfg', function () { try { syncSet(); } catch (e) { } try { paper(); } catch (e) { } try { fit(); } catch (e) { } });
    window.v107Mushaf = { ayahWords: ayahWords, pageKeys: pageKeys, hlVerse: hlVerse, surahName: surahName, chapters: function () { return chapters; }, page: function () { return page; }, recs: RECS, go: go, open: function () { ensure(); view('read'); go(cfg().page || 1); }, cfg: cfg, save: save, refit: function () { fit(); } };
    function bind() { syncSet(); }
    var _show = window.show;
    window.show = function (id) { if (id !== 'mushaf107' && document.body.classList.contains('mpReading'))
        reading(false); var r = _show.apply(this, arguments); if (id === 'mushaf107') {
        ensure();
        view('pick');
    } return r; };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { ensure(); bind(); }, 400); });
    else
        setTimeout(function () { ensure(); bind(); }, 400);
})();
