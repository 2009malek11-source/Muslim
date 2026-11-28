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
    var BASE = 'https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/';
    var BASE2 = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_book/the_9_books/';
    var NAME = { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم', abudawud: 'سنن أبي داود', tirmidhi: 'جامع الترمذي', nasai: 'سنن النسائي', ibnmajah: 'سنن ابن ماجه', malik: 'موطأ الإمام مالك', ahmed: 'مسند الإمام أحمد', darimi: 'سنن الدارمي' };
    var XB = { abudawud: 1, tirmidhi: 1, nasai: 1, ibnmajah: 1, malik: 1, ahmed: 1, darimi: 1 }, XT = {};
    Object.keys(XB).forEach(function (b) { try { var a = JSON.parse(localStorage.getItem('muslim-hdxt-' + b) || 'null'); if (a && a.length) XT[b] = a.map(function (x) { return { id: x[0], title: x[1] }; }); } catch (e) { } });
    function tTitle(c) { var a = c && (c.arabic !== undefined ? c.arabic : c.title); if (a && typeof a === 'object') a = a.title || a.text || a.name || ''; return String(a || '').trim(); }
    var CACHE = 'muslim-hadith-v107';
    var K = 'muslim-v107-hadith';
    var DEF = { fs: 22, showCh: true };
    function cfg() { return Object.assign({}, DEF, LG(K, {})); }
    var books = {}, state = { book: 'bukhari', view: 'chapters', ch: null, q: '' }, shown = 0, PAGE = 25, cur = [];
    function norm(x) { return String(x || '').normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g, '').replace(/[إأآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/\s+/g, ' ').trim(); }
    function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
    function textOf(h) { var a = h.arabic; if (a && typeof a === 'object') {
        return ((a.narrator ? a.narrator + ' ' : '') + (a.text || '')).trim();
    } return String(a || h.text || h.text_ar || ''); }
    function ensure() {
        if ($('hadith107'))
            return;
        var s = document.createElement('section');
        s.id = 'hadith107';
        s.className = 'page';
        s.innerHTML = '<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>📜 الأحاديث</h2><p>الصحيحان بالمصادر وأرقام الأحاديث</p></div></div>' +
            '<div class="hdTabs"><button data-b="bukhari" class="on">📗 صحيح البخاري</button><button data-b="muslim">📘 صحيح مسلم</button><button data-b="abudawud">📙 سنن أبي داود</button><button data-b="tirmidhi">📕 جامع الترمذي</button><button data-b="nasai">📒 سنن النسائي</button><button data-b="ibnmajah">📓 سنن ابن ماجه</button><button data-b="malik">📔 موطأ مالك</button><button data-b="ahmed">📚 مسند أحمد</button><button data-b="darimi">📖 سنن الدارمي</button></div>' +
            '<input id="hdSearch" class="search" placeholder="🔎 ابحث بأي كلمة أو رقم حديث أو اسم راوٍ…" autocomplete="off">' +
            '<div id="hdBody"></div>';
        var ref = $('settings');
        (ref && ref.parentNode ? ref.parentNode : document.body).insertBefore(s, ref || null);
        s.querySelectorAll('.hdTabs button').forEach(function (b) { b.onclick = function () { state.book = b.dataset.b; state.view = 'chapters'; state.q = ''; $('hdSearch').value = ''; s.querySelectorAll('.hdTabs button').forEach(function (x) { x.classList.toggle('on', x === b); }); render(); }; });
        var t = null;
        $('hdSearch').oninput = function () { var v = this.value; clearTimeout(t); t = setTimeout(function () { state.q = v; state.view = v.trim() ? 'search' : 'chapters'; render(); }, 350); };
    }
    var BUK = ["كتاب بدء الوحى","كتاب الإيمان","كتاب العلم","كتاب الوضوء","كتاب الغسل","كتاب الحيض","كتاب التيمم","كتاب الصلاة","كتاب مواقيت الصلاة","كتاب الأذان","كتاب الجمعة","كتاب صلاة الخوف","كتاب العيدين","كتاب الوتر","كتاب الاستسقاء","كتاب الكسوف","كتاب سجود القرآن","كتاب التقصير","كتاب التهجد","كتاب فضل الصلاة فى مسجد مكة والمدينة","كتاب العمل فى الصلاة","كتاب السهو","كتاب الجنائز","كتاب الزكاة","كتاب الحج","كتاب العمرة","كتاب المحصر","كتاب جزاء الصيد","كتاب فضائل المدينة","كتاب الصوم","كتاب صلاة التراويح","كتاب فضل ليلة القدر","كتاب الاعتكاف","كتاب البيوع","كتاب السلم","كتاب الشفعة","كتاب الإجارة","كتاب الحوالات","كتاب الكفالة","كتاب الوكالة","كتاب المزارعة","كتاب المساقاة","كتاب فى الاستقراض","كتاب الخصومات","كتاب فى اللقطة","كتاب المظالم","كتاب الشركة","كتاب الرهن","كتاب العتق","كتاب المكاتب","كتاب الهبة وفضلها والتحريض عليها","كتاب الشهادات","كتاب الصلح","كتاب الشروط","كتاب الوصايا","كتاب الجهاد والسير","كتاب فرض الخمس","كتاب الجزية والموادعة","كتاب بدء الخلق","كتاب أحاديث الأنبياء","كتاب المناقب","كتاب فضائل أصحاب النبى صلى الله عليه وسلم","كتاب مناقب الأنصار","كتاب المغازى","كتاب التفسير","كتاب فضائل القرآن","كتاب النكاح","كتاب الطلاق","كتاب النفقات","كتاب الأطعمة","كتاب العقيقة","كتاب الذبائح والصيد","كتاب الأضاحي","كتاب الأشربة","كتاب المرضى","كتاب الطب","كتاب اللباس","كتاب الأدب","كتاب الاستئذان","كتاب الدعوات","كتاب الرقاق","كتاب القدر","كتاب الأيمان والنذور","كتاب كفارات الأيمان","كتاب الفرائض","كتاب الحدود","كتاب الديات","كتاب استتابة المرتدين والمعاندين وقتالهم","كتاب الإكراه","كتاب الحيل","كتاب التعبير","كتاب الفتن","كتاب الأحكام","كتاب التمنى","كتاب أخبار الآحاد","كتاب الاعتصام بالكتاب والسنة","كتاب التوحيد"];
    var MUS = ["كتاب الإيمان","كتاب الطهارة","كتاب الحيض","كتاب الصلاة","كتاب الْمَسَاجِدِ وَمَوَاضِعِ الصَّلاَةِ","كتاب صلاة المسافرين وقصرها","كتاب الجمعة","كتاب صلاة العيدين","كتاب صلاة الاستسقاء","كتاب الكسوف","كتاب الجنائز","كتاب الزكاة","كتاب الصيام","كتاب الاعتكاف","كتاب الحج","كتاب النكاح","كتاب الرضاع","كتاب الطلاق","كتاب اللعان","كتاب العتق","كتاب البيوع","كتاب المساقاة","كتاب الفرائض","كتاب الهبات","كتاب الوصية","كتاب النذر","كتاب الأيمان","كتاب القسامة والمحاربين والقصاص والديات","كتاب الحدود","كتاب الأقضية","كتاب اللقطة","كتاب الجهاد والسير","كتاب الإمارة","كتاب الصيد والذبائح وما يؤكل من الحيوان","كتاب الأضاحى","كتاب الأشربة","كتاب اللباس والزينة","كتاب الآداب","كتاب السلام","كتاب الألفاظ من الأدب وغيرها","كتاب الشعر","كتاب الرؤيا","كتاب الفضائل","كتاب فضائل الصحابة رضى الله تعالى عنهم","كتاب البر والصلة والآداب","كتاب القدر","كتاب العلم","كتاب الذكر والدعاء والتوبة والاستغفار","كتاب الرقاق","كتاب التوبة","كتاب صفات المنافقين وأحكامهم","كتاب صفة القيامة والجنة والنار","كتاب الجنة وصفة نعيمها وأهلها","كتاب الفتن وأشراط الساعة","كتاب الزهد والرقائق","كتاب التفسير"];
    function chList(b) { if (XB[b]) return XT[b] || []; var l = (b === 'bukhari' ? BUK : MUS).map(function (t, i) { return { id: i + 1, title: t }; }); if (b === 'muslim') l.push({ id: 0, title: 'المقدمة' }); return l; }
    var BASE_CH = 'https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_chapter/the_9_books/';
    var BASE_CH2 = 'https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_chapter/the_9_books/';
    var mem = {}, full = {}, have = {}, busy = {}, stopAll = false;
    function chUrl(b, id, alt) { return (alt ? BASE_CH2 : BASE_CH) + b + '/' + id + '.json'; }
    function fetchT(u, ms) { var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function () { ac.abort(); }, ms || 20000) : 0; return fetch(u, ac ? { signal: ac.signal } : undefined).then(function (r) { clearTimeout(t); return r; }, function (e) { clearTimeout(t); throw e; }); }
    async function scanHave() {
        have = {};
        try { var ca = await caches.open(CACHE), ks = await ca.keys(); ks.forEach(function (r) { var m = /\/([a-z]+)\/(\d+)\.json$/.exec(r.url); if (m) have[m[1] + ':' + m[2]] = 1; var f = /\/([a-z]+)\.json$/.exec(r.url); if (f) have[f[1] + ':all'] = 1; }); } catch (e) { }
    }
    function isHave(b, id) { return !!(have[b + ':' + id] || have[b + ':all']); }
    function prepCh(j, id) {
        return (j.hadiths || []).map(function (h, i) { var t = textOf(h); return { id: Number(h.idInBook || h.id || i + 1), ch: Number(h.chapterId != null ? h.chapterId : id), t: t, n: norm(t) }; });
    }
    var hmap = {}, CM = {};
    function chMap(b) { return CM[b] || (CM[b] = cmap(b)); }
    // يعيد أحاديث كتاب واحد: من الجهاز إن كان محمّلًا، وإلا من الإنترنت (بلا حفظ إلا إذا طلب المستخدم التحميل)
    async function getChapter(b, id, save) {
        var k = b + ':' + id;
        if (mem[k]) return mem[k];
        var ca = null, j = null;
        try { ca = await caches.open(CACHE); } catch (e) { }
        if (ca) {
            try { var hit = await ca.match(chUrl(b, id)); if (hit) j = await hit.json(); } catch (e) { }
            if (!j) { try { var fb = await ca.match(BASE + b + '.json') || await ca.match(BASE2 + b + '.json'); if (fb) { var fj = await fb.json(); mem[k] = prepCh({ hadiths: (fj.hadiths || []).filter(function (h) { return Number(h.chapterId != null ? h.chapterId : h.chapter_id) === id; }) }, id); return mem[k]; } } catch (e) { } }
        }
        if (!j) {
            var ids = [id]; if (b === 'muslim' && id === 0) ids.push(57);
            var last = null;
            outer: for (var q = 0; q < ids.length; q++) for (var alt = 0; alt < 2; alt++) {
                try { var r = await fetchT(chUrl(b, ids[q], alt)); if (r && r.ok) { var txt = await r.text(); j = JSON.parse(txt); if (ca && save) { try { await ca.put(chUrl(b, id), new Response(txt, { headers: { 'Content-Type': 'application/json' } })); have[b + ':' + id] = 1; } catch (e) { } } break outer; } last = r && r.status; } catch (e) { last = e; }
            }
            if (!j && XB[b]) { var fl = await loadFull(b); mem[k] = fl.filter(function (h) { return h.ch === id; }); return mem[k]; }
            if (!j) throw new Error('fetch ' + last);
        } else if (save === 'keep') { }
        mem[k] = prepCh(j, id);
        return mem[k];
    }
    async function dlChapter(b, id) {
        var ca = await caches.open(CACHE);
        if (have[b + ':' + id]) return true;
        delete mem[b + ':' + id];
        await getChapter(b, id, true);
        return !!have[b + ':' + id];
    }
    async function rmChapter(b, id) { try { var ca = await caches.open(CACHE); await ca.delete(chUrl(b, id)); } catch (e) { } delete have[b + ':' + id]; }
    function ingestFull(b, j) {
        full[b] = prepFull(j);
        if (XB[b]) {
            var have2 = {}; full[b].forEach(function (h) { have2[h.ch] = 1; }); var tl = {}; (j.chapters || []).forEach(function (c) { tl[Number(c.id)] = tTitle(c); });
            XT[b] = Object.keys(have2).map(Number).sort(function (a, c) { return a - c; }).map(function (id) { return { id: id, title: tl[id] || ('الباب ' + id) }; }); CM[b] = null;
            try { localStorage.setItem('muslim-hdxt-' + b, JSON.stringify(XT[b].map(function (c) { return [c.id, c.title]; }))); } catch (e) { }
        }
    }
    async function loadFull(b, progress) {
        if (full[b]) return full[b];
        var url = BASE + b + '.json', res = null, ca = null;
        try { ca = await caches.open(CACHE); var hit = await ca.match(url) || await ca.match(BASE2 + b + '.json'); if (hit) { ingestFull(b, await hit.json()); return full[b]; } } catch (e) { }
        try { res = await fetchT(url, 60000); } catch (e) { }
        if (!res || !res.ok) { res = await fetchT(BASE2 + b + '.json', 60000); if (!res.ok) throw new Error('HTTP ' + res.status); }
        var total = +res.headers.get('content-length') || 0, reader = res.body && res.body.getReader ? res.body.getReader() : null, chunks = [], got = 0;
        if (reader) { for (;;) { var r = await reader.read(); if (r.done) break; chunks.push(r.value); got += r.value.length; if (progress) progress(got, total); } }
        var txt = await (reader ? new Blob(chunks) : await res.blob()).text();
        ingestFull(b, JSON.parse(txt));       // في الذاكرة لهذه الجلسة فقط، لا نحفظه
        return full[b];
    }
    function prepFull(j) { return (j.hadiths || []).map(function (h, i) { var t = textOf(h); return { id: Number(h.idInBook || h.id || i + 1), ch: Number(h.chapterId || h.chapter_id || 0), t: t, n: norm(t) }; }); }
    function cmap(b) { var m = {}; chList(b).forEach(function (c) { m[c.id] = c; }); return m; }
    /* تسجيلات بشرية للأحاديث: تُقرأ من الملف hadith-audio.json بصيغة {"bukhari:1":"https://.../1.mp3"}؛ إن لم يوجد تسجيل يظهر زر الصوت الآلي فقط */
    window.__hdAudio = window.__hdAudio || null;
    if (!window.HADITH_AUDIO) { window.HADITH_AUDIO = function (b, id) { var m = window.__hdAudio; return (m && m[b + ':' + id]) || ''; }; try { fetch('hadith-audio.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && typeof j === 'object') window.__hdAudio = j; }).catch(function () { }); } catch (e) { } }
    function card(b, h) {
        hmap[b + ':' + h.id] = h; var c = cfg(), ch = chMap(b)[h.ch], aud = window.HADITH_AUDIO && window.HADITH_AUDIO(b, h.id);
        return '<article class="hdCard"><div class="hdSrc"><span>' + NAME[b] + '</span><span>حديث رقم ' + h.id + '</span>' + (c.showCh && ch ? '<span>' + esc(ch.title) + '</span>' : '') + '' + (b === 'bukhari' || b === 'muslim' ? '<span>الدرجة: صحيح</span>' : '<span>الدرجة: راجع كتب التخريج</span>') + '</div><div class="hdTxt" style="--hd-fs:' + c.fs + 'px">' + esc(h.t) + '</div>' +
            '<div class="controls" style="margin-top:8px"><button data-copy="' + b + ':' + h.id + '">📋 نسخ مع المصدر</button><button data-fav="' + b + ':' + h.id + '">⭐ مفضلة</button>' + (aud ? '' : '<button data-tts="' + b + ':' + h.id + '" aria-pressed="false">🔊 استماع (صوت آلي)</button>') + (aud ? '<button class="primary" data-aud="' + esc(aud) + '" data-t="' + esc(NAME[b] + ' — حديث ' + h.id) + '">▶ استماع</button>' : '') + '</div></article>';
    }
    function bindCards(box) {
        box.querySelectorAll('[data-copy]').forEach(function (b) { b.onclick = function () { var p = b.dataset.copy.split(':'), h = hmap[p[0] + ':' + p[1]]; var t = h.t + '\n— ' + NAME[p[0]] + '، حديث رقم ' + h.id; try {
            navigator.clipboard.writeText(t);
            toast('تم النسخ مع المصدر');
        }
        catch (e) { } }; });
        box.querySelectorAll('[data-fav]').forEach(function (b) {
            var k = b.dataset.fav, id = 'hb-' + k;
            function mark() { var on = false; try { on = window.readFavStore().hadiths.some(function (a) { return String(a.id) === id; }); } catch (e) { } b.classList.toggle('active', on); b.textContent = on ? '⭐ في المفضلة' : '☆ أضف للمفضلة'; return on; }
            mark();
            b.onclick = function () {
                var p = k.split(':'), h = hmap[p[0] + ':' + p[1]];
                try {
                    if (mark()) window.favRemove('hadiths', id);
                    else window.favAdd('hadiths', { id: id, text: h.t, source: NAME[p[0]] + ' — حديث ' + h.id, grade: 'صحيح', category: NAME[p[0]] });
                    mark();
                    var fv = document.getElementById('favorites');
                    if (fv && fv.classList.contains('active') && window.renderFavorites) window.renderFavorites('hadiths');
                } catch (e) { toast('تعذّر حفظ المفضلة'); }
            };
        });
        box.querySelectorAll('[data-tts]').forEach(function (b) { b.onclick = function () {
            var ss = window.speechSynthesis; if (!ss) { toast('جهازك لا يدعم القراءة الصوتية'); return; }
            var on = b.getAttribute('aria-pressed') === 'true'; ss.cancel(); document.querySelectorAll('[data-tts]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); x.textContent = '🔊 استماع (صوت آلي)'; });
            if (on) return; var p = b.dataset.tts.split(':'), h = hmap[p[0] + ':' + p[1]]; if (!h) return;
            var u = new SpeechSynthesisUtterance(h.t); u.lang = 'ar-SA'; u.rate = .85;
            try { var vs = ss.getVoices().filter(function (v) { return /^ar/i.test(v.lang); }); if (vs[0]) u.voice = vs[0]; else toast('لا يوجد صوت عربي على جهازك؛ قد يختلف النطق'); } catch (e) { }
            u.onend = u.onerror = function () { b.setAttribute('aria-pressed', 'false'); b.textContent = '🔊 استماع (صوت آلي)'; };
            b.setAttribute('aria-pressed', 'true'); b.textContent = '⏹ إيقاف'; ss.speak(u); }; });
        box.querySelectorAll('[data-aud]').forEach(function (b) { b.onclick = function () { var a = new Audio(b.dataset.aud); a.setAttribute('data-v107title', '📜 ' + b.dataset.t); a.onerror = function () { toast('تعذّر تشغيل التسجيل الآن.'); }; a.play().catch(function () { }); }; });
    }
    function toast(m) { if (window.showToast)
        window.showToast(m); }
    function more(box) {
        var part = cur.slice(shown, shown + PAGE), b = state.book;
        var old = box.querySelector('.hdMore');
        if (old)
            old.remove();
        box.insertAdjacentHTML('beforeend', part.map(function (h) { return card(b, h); }).join(''));
        shown += part.length;
        if (shown < cur.length) {
            box.insertAdjacentHTML('beforeend', '<button class="hdCh hdMore" style="justify-content:center">عرض المزيد (' + (cur.length - shown) + ' متبقٍّ)</button>');
            box.querySelector('.hdMore').onclick = function () { more(box); };
        }
        bindCards(box);
    }
    function pgTxt(g, t) { return t ? Math.round(g / t * 100) + '%' : (g / 1048576).toFixed(1) + ' م.ب'; }
    async function render() {
        ensure();
        var box = $('hdBody'), b = state.book;
        if (!box) return;
        await scanHave();
        if (state.book !== b) return;
        box.setAttribute('data-ex', '0');
        if (XB[b] && !XT[b]) {
            box.innerHTML = '<div class="notice">⏳ جارٍ تجهيز قائمة أبواب ' + NAME[b] + ' لأول مرة (مرة واحدة فقط، يلزم إنترنت). بعدها تحمّل الباب الذي تريد وتقرؤه دون إنترنت… <span id="hdPg"></span></div>';
            try { await loadFull(b, function (g, t) { var e = $('hdPg'); if (e) e.textContent = pgTxt(g, t); }); }
            catch (e) { if (state.book === b) { box.innerHTML = '<div class="notice">تعذّر تحميل الكتاب. تحقّق من الإنترنت ثم <button id="hdRetry0">أعد المحاولة</button></div>'; $('hdRetry0').onclick = render; } return; }
            if (state.book !== b) return;
        }
        if (state.view === 'search') return renderSearch(box, b);
        if (state.view === 'chapter') return renderChapter(box, b);
        var L = chList(b), nHave = L.filter(function (c) { return isHave(b, c.id); }).length;
        box.innerHTML = '<div class="card"><b>' + NAME[b] + '</b><div class="mini">' + L.length + ' كتابًا (أبوابًا كبيرة). المحمَّل للقراءة دون إنترنت: <span id="hdHave">' + nHave + '</span></div>' +
            '<div class="controls" style="margin-top:8px"><button type="button" id="hdAll">⬇ تحميل كل الكتب</button><button type="button" id="hdStop" style="display:none">⏹ إيقاف</button></div><div class="mini" id="hdAllSt"></div></div>' +
            L.map(function (c) { var h = isHave(b, c.id); return '<div class="hdRow"><button class="hdCh" data-c="' + c.id + '"><i>' + c.id + '</i><b style="flex:1">' + esc(c.title) + '</b></button><button type="button" class="hdDl' + (h ? ' on' : '') + '" data-dl="' + c.id + '" aria-label="' + (h ? 'محمّل — اضغط للحذف' : 'تحميل للقراءة دون إنترنت') + '">' + (h ? '✓ محمّل' : '⬇ تحميل') + '</button></div>'; }).join('');
        box.querySelectorAll('[data-c]').forEach(function (x) { x.onclick = function () { state.view = 'chapter'; state.ch = +x.dataset.c; render(); }; });
        function refreshCount() { var e = $('hdHave'); if (e) e.textContent = chList(b).filter(function (c) { return isHave(b, c.id); }).length; }
        box.querySelectorAll('[data-dl]').forEach(function (x) {
            x.onclick = async function () {
                var id = +x.dataset.dl;
                if (isHave(b, id) && !have[b + ':all'] || (have[b + ':' + id])) {
                    if (confirm('حذف هذا الكتاب من الجهاز؟')) { await rmChapter(b, id); x.classList.remove('on'); x.textContent = '⬇ تحميل'; refreshCount(); }
                    return;
                }
                if (isHave(b, id)) { toast('هذا الكتاب محفوظ ضمن نسخة كاملة قديمة على جهازك.'); return; }
                x.disabled = true; x.textContent = '⏳ …';
                try { await dlChapter(b, id); x.classList.add('on'); x.textContent = '✓ محمّل'; refreshCount(); }
                catch (e) { x.textContent = '⬇ أعد المحاولة'; toast('تعذّر التحميل. تحقّق من الإنترنت.'); }
                x.disabled = false;
            };
        });
        $('hdAll').onclick = async function () {
            stopAll = false; $('hdAll').style.display = 'none'; $('hdStop').style.display = '';
            var todo = chList(b).filter(function (c) { return !isHave(b, c.id); }), done = 0, fail = 0, st = $('hdAllSt');
            var q = todo.slice();
            async function worker() { while (q.length && !stopAll) { var c = q.shift(); try { await dlChapter(b, c.id); var btn = box.querySelector('[data-dl="' + c.id + '"]'); if (btn) { btn.classList.add('on'); btn.textContent = '✓ محمّل'; } done++; } catch (e) { fail++; } if (st) st.textContent = 'تم تحميل ' + done + ' من ' + todo.length + (fail ? ' • تعذّر ' + fail : ''); refreshCount(); } }
            await Promise.all([worker(), worker(), worker()]);
            if (st) st.textContent = stopAll ? 'أُوقف التحميل. المحمَّل محفوظ.' : (fail ? 'انتهى مع تعذّر ' + fail + ' — اضغط تحميل مرة أخرى.' : 'اكتمل التحميل ✅');
            $('hdAll').style.display = ''; $('hdStop').style.display = 'none';
        };
        $('hdStop').onclick = function () { stopAll = true; };
    }
    async function renderChapter(box, b) {
        var id = state.ch, ct = chMap(b)[id];
        box.innerHTML = '<div class="notice">⏳ جارٍ فتح الكتاب… <span id="hdPg"></span></div>';
        var list;
        try { list = await getChapter(b, id, false); }
        catch (e) { box.innerHTML = '<div class="notice">تعذّر فتح هذا الكتاب. تحقّق من الإنترنت (أو حمّله من قائمة الكتب وهو متصل ليعمل دون إنترنت) ثم <button id="hdRetry">أعد المحاولة</button> <button id="hdBack2">رجوع</button></div>'; $('hdRetry').onclick = render; $('hdBack2').onclick = function () { state.view = 'chapters'; render(); }; return; }
        if (state.book !== b || state.view !== 'chapter') return;
        cur = list; shown = 0;
        var saved = isHave(b, id);
        box.innerHTML = '<div class="card"><button id="hdBack">← الكتب</button> <b>' + esc(ct ? ct.title : 'الكتاب') + '</b><div class="mini">' + cur.length + ' حديثًا' + (saved ? ' • محمّل للقراءة دون إنترنت ✓' : '') + '</div>' + (saved ? '' : '<div class="controls" style="margin-top:8px"><button type="button" id="hdSaveHere">⬇ تحميل هذا الكتاب للقراءة دون إنترنت</button></div>') + '</div>';
        $('hdBack').onclick = function () { state.view = 'chapters'; render(); };
        var sv = $('hdSaveHere'); if (sv) sv.onclick = async function () { sv.disabled = true; sv.textContent = '⏳ …'; try { await dlChapter(b, id); sv.parentNode.remove(); toast('تم التحميل ✓'); } catch (e) { sv.disabled = false; sv.textContent = '⬇ أعد المحاولة'; } };
        more(box);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    async function renderSearch(box, b) {
        var q = norm(state.q), num = /^\d+$/.test(q) ? +q : 0, terms = q.split(' ').filter(Boolean);
        var pool = [], cm = chMap(b), ids = chList(b).filter(function (c) { return isHave(b, c.id); });
        if (full[b]) pool = full[b];
        else { box.innerHTML = '<div class="notice">⏳ أبحث في الكتب المحمّلة…</div>'; for (var i = 0; i < ids.length; i++) { try { pool = pool.concat(await getChapter(b, ids[i].id, false)); } catch (e) { } } }
        if (state.book !== b || state.view !== 'search') return;
        cur = pool.filter(function (h) { if (num && h.id === num) return true; return terms.every(function (t) { return h.n.indexOf(t) >= 0 || (cm[h.ch] && norm(cm[h.ch].title).indexOf(t) >= 0); }); });
        var scope = full[b] ? 'كل الكتاب' : (ids.length + ' كتابًا محمّلًا');
        box.innerHTML = '<div class="card"><b>نتائج البحث</b><div class="mini">' + cur.length + ' حديثًا في ' + NAME[b] + ' (البحث في: ' + scope + ')</div>' +
            (full[b] ? '' : '<div class="controls" style="margin-top:8px"><button type="button" id="hdSearchAll">🔎 ابحث في الكتاب كله (يحتاج إنترنت ولا يُحفظ)</button></div><div class="mini" id="hdSaSt"></div>') + '</div>';
        var sa = $('hdSearchAll'); if (sa) sa.onclick = async function () { sa.disabled = true; try { await loadFull(b, function (g, t) { var e = $('hdSaSt'); if (e) e.textContent = 'جارٍ التحميل… ' + pgTxt(g, t); }); render(); } catch (e) { sa.disabled = false; var e2 = $('hdSaSt'); if (e2) e2.textContent = 'تعذّر الاتصال.'; } };
        shown = 0;
        if (!cur.length) box.insertAdjacentHTML('beforeend', '<div class="notice">لا نتائج' + (ids.length || full[b] ? '' : ' — لا توجد كتب محمّلة بعد') + '. جرّب كلمة أخرى أو رقم الحديث.</div>');
        else more(box);
    }
    window.v107Hadith = { render: render, open: function () { ensure(); render(); }, cfg: cfg, count: function () { return Object.keys(have).length; } };
    function bind() {
        var c = cfg();
        var f = $('hd107Fs');
        if (f) {
            f.value = String(c.fs);
            f.onchange = function () { var x = cfg(); x.fs = +f.value; LS(K, x); };
        }
        var s = $('hd107Ch');
        if (s) {
            s.checked = !!c.showCh;
            s.onchange = function () { var x = cfg(); x.showCh = s.checked; LS(K, x); };
        }
    }
    var _show = window.show;
    window.show = function (id) { var r = _show.apply(this, arguments); if (id === 'hadith107') {
        ensure();
        render();
    } return r; };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { ensure(); bind(); }, 400); });
    else
        setTimeout(function () { ensure(); bind(); }, 400);
})();
