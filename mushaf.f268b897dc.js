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
    var DEF = { paper: 'cream', scale: 1, frame: true, tapPlay: true, page: 1, reciter: 'Alafasy_128kbps' };
    function cfg() { return Object.assign({}, DEF, LG(K, {})); }
    function save(c) { LS(K, c); }
    var PAPERS = { cream: ['#fbf6e8', '#111', '#c8a15b'], white: ['#ffffff', '#000', '#9aa7a0'], sepia: ['#f1e4c7', '#2b1d0e', '#a37b3c'], night: ['#101714', '#e9efe9', '#7a6a3d'], gold: ['#fff3cf', '#1b1405', '#b8860b'] };
    var RIW = [['hafs', 'حفص عن عاصم', true], ['qalun', 'قالون عن نافع', false], ['warsh', 'ورش عن نافع', false], ['duri', 'الدوري عن أبي عمرو', false], ['susi', 'السوسي عن أبي عمرو', false], ['shuba', 'شعبة عن عاصم', false], ['bazzi', 'البزي عن ابن كثير', false], ['qunbul', 'قنبل عن ابن كثير', false]];
    var chapters = null, loadedFonts = {}, cache = {};
    var page = 1;
    function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
    var RECS = [['Alafasy_128kbps', 'مشاري العفاسي'], ['Husary_128kbps', 'محمود خليل الحصري'], ['Abdul_Basit_Murattal_192kbps', 'عبد الباسط (مرتل)'], ['Minshawy_Murattal_128kbps', 'المنشاوي (مرتل)'], ['Abdurrahmaan_As-Sudais_192kbps', 'عبد الرحمن السديس'], ['Saood_ash-Shuraym_128kbps', 'سعود الشريم']];
    var PNAME = { cream: 'كريمي', white: 'أبيض', sepia: 'سيبيا', gold: 'ذهبي', night: 'ليلي' };
var IC = { r: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>', l: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>', bm: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>', bmOn: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>', gear: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>', full: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>' };
    var XK = 'muslim-mp-extra';
    function xget() { var o = {}; try { o = JSON.parse(localStorage.getItem(XK) || '{}') || {}; } catch (e) { } var t = new Date(), d = t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate(); if (o.day !== d) { o.day = d; o.read = []; } o.bm = Array.isArray(o.bm) ? o.bm : []; o.read = Array.isArray(o.read) ? o.read : []; o.goal = +o.goal > 0 ? +o.goal : 5; return o; }
    function xsave(o) { try { localStorage.setItem(XK, JSON.stringify(o)); } catch (e) { } }
    function markRead(n) { var o = xget(); if (o.read.indexOf(n) < 0) { o.read.push(n); xsave(o); } }
    function bmToggle() { var o = xget(), i = o.bm.indexOf(page); if (i < 0) o.bm.push(page); else o.bm.splice(i, 1); o.bm.sort(function (a, b) { return a - b; }); xsave(o); bmMark(); }
    function bmMark() { var b = $('mpBm'); if (!b) return; var on = xget().bm.indexOf(page) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.innerHTML = on ? IC.bmOn : IC.bm; }
    function wirdUI() {
        var box = $('mpWird'); if (!box) return; var o = xget(), n = o.read.length, pct = Math.min(100, Math.round(n / o.goal * 100));
        box.innerHTML = '<div class="mpWirdHd"><b>وِردي اليوم</b><span class="mini">' + n + ' من ' + o.goal + ' صفحات' + (n >= o.goal ? ' — بارك الله فيك ✅' : '') + '</span></div><div class="mpDlTrack"><i style="width:' + pct + '%"></i></div><div class="mpStep"><button type="button" id="mpGoalM" aria-label="تقليل الهدف">−</button><span class="mini">الهدف اليومي: ' + o.goal + ' صفحات</span><button type="button" id="mpGoalP" aria-label="زيادة الهدف">+</button></div>' +
            (o.bm.length ? '<div class="mpWirdHd" style="margin-top:10px"><b>🔖 العلامات</b></div><div class="mpBms">' + o.bm.map(function (p) { return '<span class="mpBmChip"><button type="button" data-go="' + p + '">صفحة ' + p + '</button><button type="button" data-rm="' + p + '" aria-label="حذف العلامة">✕</button></span>'; }).join('') + '</div>' : '');
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
            '<div class="mpTopBar"><button class="mpBack" id="mpHomeBack" aria-label="رجوع">→</button><span></span><span></span></div>' +
            '<div class="mpHero"><div class="mpOrn" aria-hidden="true">﷽</div><h1>القرآن الكريم</h1><p>اختر المصحف الذي تريد قراءته</p></div>' +
            '<div class="mpEds" id="mpEds"></div>' +
            '<button class="mpContinue" id="mpContinue"></button>' +
            '<div class="mpWird" id="mpWird"></div>' +
            '</div>' +
            '<div class="mpRead">' +
            '<div class="mpTopBar"><button class="mpBack" id="mpBack" aria-label="رجوع">' + IC.r + '</button><b id="mpTitle">القرآن الكريم</b><span class="mpTbBtns"><button class="mpGear" id="mpBm" aria-label="علامة على هذه الصفحة"></button><button class="mpGear" id="mpGear" aria-label="إعدادات المصحف">' + IC.gear + '</button></span></div>' +
            '<div class="mpNav"><button id="mpPrev" aria-label="الصفحة السابقة">' + IC.r + '</button><div class="mpPn"><input id="mpNum" type="number" min="1" max="604" inputmode="numeric" aria-label="رقم الصفحة"><span class="mini">/ 604</span></div><button id="mpNext" aria-label="الصفحة التالية">' + IC.l + '</button></div>' +
            '<div class="mpSel"><select id="mpSurah" aria-label="السورة"></select><select id="mpJuz" aria-label="الجزء"></select><button id="mpRead" aria-label="وضع القراءة">' + IC.full + '</button></div>' +
            '<div class="mpWrap"><div class="mpPage" id="mpPage"><div class="mpLoad">⏳ جارٍ تحميل الصفحة…</div></div></div>' +
            '<div class="mpSheet" id="mpSheet"><b id="mpSheetT"></b><button class="primary" id="mpPlay">▶ استماع للآية</button><button id="mpCopy">📋 نسخ</button><button id="mpClose">✕</button></div>' +
            '<div class="mpSet" id="mpSet" role="dialog" aria-label="إعدادات المصحف"><div class="mpSetIn">' +
            '<div class="mpSetHd"><b>إعدادات المصحف</b><button id="mpSetX" aria-label="إغلاق">✕</button></div>' +
            '<div class="mpSetRow"><b>الرواية</b><div class="riwChips" id="mpRiw"></div><div class="mini" id="mpRiwNote"></div></div>' +
            '<div class="mpSetRow"><b>حجم الخط</b><div class="mpStep"><button id="mpMinus" aria-label="تصغير">A−</button><span id="mpZv" class="mini">100%</span><button id="mpPlus" aria-label="تكبير">A+</button></div></div>' +
            '<div class="mpSetRow"><b>لون الورق</b><div class="mpSw" id="mpSw"></div></div>' +
            '<label class="mpSetRow mpInline"><b>الإطار الذهبي</b><input type="checkbox" id="mpFrameCk"></label>' +
            '<div class="mpSetRow"><b>القراءة بلا إنترنت</b><div class="mini">احفظ المصحف على جهازك مرة واحدة ليعمل دون إنترنت (حجم كبير نسبيًا — يُفضّل الواي فاي). الصفحات التي تقرؤها تُحفظ تلقائيًا أيضًا.</div><div class="mpDlTrack"><i id="mpDlBar"></i></div><div class="mini" id="mpDlTxt"></div><button type="button" class="primary" id="mpDlBtn">⬇ حفظ المصحف كاملًا</button><b class="mpJuzHd">أو احفظ جزءًا واحدًا فقط</b><div class="mpJuzList" id="mpJuzList"></div></div>' +
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
        $('mpPrev').onclick = function () { go(page - 1); };
        $('mpNext').onclick = function () { go(page + 1); };
        $('mpNum').onchange = function () { go(parseInt(this.value, 10) || 1); };
        $('mpSurah').onchange = function () { var c = chapters && chapters.chapters[+this.value - 1]; if (c)
            go(c.pages[0]); };
        $('mpJuz').onchange = function () { var p = JUZ_PAGES[+this.value]; if (p)
            go(p); };
        $('mpMinus').onclick = function () { var c = cfg(); c.scale = Math.max(.6, +(c.scale - .1).toFixed(2)); save(c); fit(); };
        $('mpPlus').onclick = function () { var c = cfg(); c.scale = Math.min(2, +(c.scale + .1).toFixed(2)); save(c); fit(); };
        $('mpSw').innerHTML = Object.keys(PAPERS).map(function (k) { return '<button type="button" data-p="' + k + '" aria-label="' + PNAME[k] + '" title="' + PNAME[k] + '" style="background:' + PAPERS[k][0] + ';border-color:' + PAPERS[k][2] + '"></button>'; }).join('');
        $('mpSw').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; var c = cfg(); c.paper = b.getAttribute('data-p'); save(c); paper(); };
        $('mpFrameCk').onchange = function () { var c = cfg(); c.frame = this.checked; save(c); paper(); };
        $('mpRec').innerHTML = RECS.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + '</option>'; }).join('');
        $('mpRec').onchange = function () { var c = cfg(); c.reciter = this.value; save(c); };
        $('mpClose').onclick = function () { $('mpSheet').classList.remove('show'); unhl(); };
        $('mpRead').onclick = function () { setSet(false); reading(true); };
        var ov = document.createElement('div');
        ov.id = 'mpOv';
        ov.innerHTML = '<button id="mpOvMinus" aria-label="تصغير">A−</button><button id="mpOvPlus" aria-label="تكبير">A+</button><button id="mpOvPrev" aria-label="الصفحة السابقة">' + IC.r + '</button><span id="mpOvNum"></span><button id="mpOvNext" aria-label="الصفحة التالية">' + IC.l + '</button><button id="mpOvExit" aria-label="خروج من وضع القراءة">✕ خروج</button>';
        document.body.appendChild(ov);
        $('mpOvMinus').onclick = function (e) { e.stopPropagation(); $('mpMinus').click(); };
        $('mpOvPlus').onclick = function (e) { e.stopPropagation(); $('mpPlus').click(); };
        $('mpOvPrev').onclick = function (e) { e.stopPropagation(); go(page - 1); };
        $('mpOvNext').onclick = function (e) { e.stopPropagation(); go(page + 1); };
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
        $('mpDlBtn').onclick = startDl; bindJuz();
        savedCount().then(function (k) { updDl(k, k ? 'محفوظ على الجهاز: ' + k + ' من 604 صفحة' : 'لم يُحفظ شيء بعد'); });
        syncSet();
        pickInfo();
    }
    function syncSet() { var c = cfg(); var f = $('mpFrameCk'); if (f) f.checked = !!c.frame; var r = $('mpRec'); if (r) r.value = c.reciter; }
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
    function cput(url, res) { if (!window.caches) return; try { caches.open(MC).then(function (c) { return c.put(url, res); }).catch(function () { }); } catch (e) { } }
    function netGet(url) { return fetch(url).then(function (r) { if (!r.ok) throw 0; cput(url, r.clone()); return r; }); }
    function getJSON(path) {
        if (cache[path])
            return Promise.resolve(cache[path]);
        return cget(RAW + path).then(function (hit) { return hit || netGet(RAW + path).catch(function () { return netGet(JSD + path); }); }).then(function (r) { return r.json(); }).then(function (j) { cache[path] = j; return j; });
    }
    function fontUrl(name) { return JSD + 'fonts-woff2/' + name + (name === 'QCF4_QBSML' ? '' : '_W') + '.woff2'; }
    function loadFont(name) {
        if (loadedFonts[name])
            return loadedFonts[name];
        if (!/^QCF4_[A-Za-z0-9_]{1,24}$/.test(name)) return Promise.reject(0);
        var url = fontUrl(name);
        loadedFonts[name] = cget(url).then(function (hit) { return hit || netGet(url); }).then(function (r) { return r.arrayBuffer(); }).then(function (buf) { var ff = new FontFace(name, buf, { display: 'block' }); return ff.load(); }).then(function (f) { document.fonts.add(f); return f; }).catch(function (e) { delete loadedFonts[name]; throw e; });
        return loadedFonts[name];
    }
    /* حفظ المصحف كاملًا على الجهاز ليُقرأ بلا إنترنت */
    var dl = { run: false };
    function pad3(n) { return ('00' + n).slice(-3); }
    function savedSet() { if (!window.caches) return Promise.resolve({}); return caches.open(MC).then(function (c) { return c.keys(); }).then(function (ks) { var o = {}; ks.forEach(function (k) { var m = /pages\/(\d{3})\.json$/.exec(k.url); if (m) o[+m[1]] = 1; }); return o; }).catch(function () { return {}; }); }
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
            h += '<div class="mpJuzRow"><span>الجزء ' + n + '</span><span class="mini">' + (full ? 'محفوظ ✓' : (got ? got + ' من ' + tot : tot + ' صفحة')) + '</span>' +
                (full ? '<button type="button" data-jr="' + n + '" aria-label="حذف الجزء ' + n + '">🗑</button>' : '<button type="button" data-jd="' + n + '"' + (busy && !run ? ' disabled' : '') + ' aria-label="حفظ الجزء ' + n + '">' + (run ? '⏸' : '⬇') + '</button>') + '</div>';
        }
        box.innerHTML = h;
    }
    function refreshJuz(busy) { return savedSet().then(function (o) { paintJuz(o, busy); return o; }); }
    function dlRange(from, to, juz) {
        if (dl.run) { dl.run = false; return; }
        if (!window.caches) { updDl(0, 'هذا المتصفح لا يدعم الحفظ دون إنترنت.'); return; }
        if (navigator.onLine === false) { updDl(0, 'يلزم اتصال بالإنترنت لإتمام التحميل.'); return; }
        dl.run = true; $('mpDlBtn').textContent = '⏸ إيقاف'; $('mpDlBtn').disabled = !!juz;
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }
        var i = from, done = 0, fail = 0, total = to - from + 1, last = 0;
        getJSON('index.json').then(function (j) { chapters = j; fillSurahs(); }).catch(function () { });
        loadFont('QCF4_QBSML').catch(function () { });
        refreshJuz(juz || 0);
        function one() {
            if (!dl.run || i > to) return Promise.resolve();
            var n = i++, f = pad3(n);
            return getJSON('pages/' + f + '.json').then(function (d) { return cget(fontUrl(d.font)).then(function (h) { return h || netGet(fontUrl(d.font)); }); }).then(function () { done++; }).catch(function () { fail++; }).then(function () {
                var pc = Math.round((done + fail) * 100 / total);
                var b = $('mpDlBar'), t = $('mpDlTxt'); if (b) b.style.width = pc + '%'; if (t) t.textContent = 'تم حفظ ' + done + ' من ' + total + (fail ? ' — تعثّر ' + fail : '');
                return one();
            });
        }
        Promise.all([one(), one(), one(), one()]).then(function () {
            var ok = dl.run; dl.run = false; $('mpDlBtn').textContent = '⬇ حفظ المصحف كاملًا'; $('mpDlBtn').disabled = false;
            refreshJuz(0).then(function (o) {
                var k = Object.keys(o).length;
                if (juz) { var r = juzRange(juz), g = 0, p; for (p = r[0]; p <= r[1]; p++) if (o[p]) g++; updDl(g * 604 / (r[1] - r[0] + 1), g >= r[1] - r[0] + 1 ? '✅ تم حفظ الجزء ' + juz : (ok ? 'تم حفظ ' + g + ' صفحة — أعد الضغط لإكمال الباقي' : 'أُوقف التحميل')); }
                else updDl(k, k >= 604 && !fail ? '✅ المصحف محفوظ بالكامل — يعمل بلا إنترنت' : (ok ? 'تم حفظ ' + k + ' من 604 — أعد الضغط لإكمال الباقي' : 'أُوقف عند ' + k + ' من 604'));
            });
        });
    }
    function startDl() { dlRange(1, 604, 0); }
    function rmJuz(n) {
        if (!window.caches || dl.run) return;
        var r = juzRange(n);
        caches.open(MC).then(function (c) { return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { var m = /pages\/(\d{3})\.json$/.exec(k.url); return m && +m[1] >= r[0] && +m[1] <= r[1]; }).map(function (k) { return c.delete(k); })); }); }).then(function () { Object.keys(cache).forEach(function (k) { var m = /pages\/(\d{3})\.json$/.exec(k); if (m && +m[1] >= r[0] && +m[1] <= r[1]) delete cache[k]; }); return refreshJuz(0); }).then(function () { updDl(0, 'تم حذف الجزء ' + n + ' من الجهاز'); }).catch(function () { });
    }
    function bindJuz() {
        var box = $('mpJuzList'); if (!box) return;
        box.onclick = function (e) {
            var b = e.target.closest && e.target.closest('button'); if (!b) return;
            if (b.dataset.jd) { var n = +b.dataset.jd, r = juzRange(n); dlRange(r[0], r[1], n); }
            else if (b.dataset.jr) rmJuz(+b.dataset.jr);
        };
        refreshJuz(0);
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
        el.innerHTML = '<div class="mpLoad">⏳ جارٍ تحميل الصفحة ' + n + '…</div>';
        var f = ('00' + n).slice(-3);
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
        el.innerHTML = head + '<div class="mpLines" id="mpLines">' + lines + '</div><div class="mpFoot">' + d.page + '</div>';
        paper();
        fit();
        syncSurah();
        $('mpLines').onclick = function (e) { var w = e.target.closest('.w'); if (!w || !w.dataset.vk)
            return; pick(w.dataset.vk); };
        $('mpOvNum').textContent = 'الجزء ' + juzOf(d.page) + ' • صفحة ' + d.page;
        markRead(d.page); bmMark();
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
        $('mpCopy').onclick = function () {
            var t = Array.from(document.querySelectorAll('#mpLines .w[data-vk="' + vk + '"]')).map(function (w) { return w.textContent; }).join('');
            var txt = 'سورة ' + surahName(+p[0]) + ' آية ' + p[1];
            try {
                navigator.clipboard.writeText(txt);
                if (window.showToast)
                    showToast('نُسخ: ' + txt);
            }
            catch (e) { }
        };
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
        ay = new Audio('https://everyayah.com/data/' + c.reciter + '/' + pad(s, 3) + pad(a, 3) + '.mp3');
        ay.setAttribute('data-v107title', '📖 ' + surahName(s) + ' — آية ' + a);
        ay.onerror = function () { if (window.showToast)
            showToast('تعذّر تشغيل الآية الآن.'); };
        ay.play().catch(function () { });
    }
    window.v107Mushaf = { go: go, open: function () { ensure(); view('read'); go(cfg().page || 1); }, cfg: cfg, save: save, refit: function () { fit(); } };
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
