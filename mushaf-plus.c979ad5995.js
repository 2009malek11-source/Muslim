/* مصحف المسلم — إضافات: معلومات السورة، الانتقال لآية، تثبيت السورة، نسخ الآية، مشاركة الآية كصورة، تكرار الآية/الصفحات */
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var M = function () { return window.v107Mushaf; };
    function LG(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
    function LS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
    function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
    function toast(t) { try { if (window.showToast) return window.showToast(t); if (window.toast) return window.toast(t); } catch (e) { } }
    var AR = function (n) { try { return Number(n).toLocaleString('ar-EG', { useGrouping: false }); } catch (e) { return String(n); } };

    /* ---------- بيانات السور (عدد الآيات، مدنية/مكية) — برواية حفص، حسب تصنيف مشروع «تنزيل» ---------- */
    var AYAH = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];
    var MADANI = [2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49, 55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110];
    function place(s) { return MADANI.indexOf(s) >= 0 ? 'مدنية' : 'مكية'; }

    /* ---------- جلب نص الآية العادي (للنسخ فقط) من واجهة alquran.cloud بنص «تنزيل» العثماني ---------- */
    var CN = 'muslim-data-v1';
    function jget(url) {
        var net = function () { return fetch(url).then(function (r) { if (!r.ok) throw 0; return r; }); };
        if (!window.caches) return net().then(function (r) { return r.json(); });
        return caches.open(CN).then(function (c) {
            return c.match(url).then(function (m) { if (m) return m.json(); return net().then(function (r) { try { c.put(url, r.clone()); } catch (e) { } return r.json(); }); });
        });
    }
    function ayahInfo(s, a) {
        return jget('https://api.alquran.cloud/v1/ayah/' + s + ':' + a + '/quran-uthmani').then(function (j) {
            var d = j.data, t = String(d.text || '');
            if (d.numberInSurah === 1 && s !== 1 && s !== 9) { var w = t.split(' '); if (w.length > 4) t = w.slice(4).join(' '); }
            return { text: t, page: d.page };
        });
    }
    function sname(s) { var m = M(); return (m && m.surahName(s)) || ('سورة ' + s); }
    function ref(vk) { var p = vk.split(':'); return 'سورة ' + sname(+p[0]) + ' — الآية ' + p[1]; }

    /* ---------- النسخ ---------- */
    function copyText(t) {
        try { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t); } catch (e) { }
        return new Promise(function (ok, no) {
            var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;opacity:0';
            document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length);
            var done = false; try { done = document.execCommand('copy'); } catch (e) { } ta.remove(); done ? ok() : no();
        });
    }
    function copy(vk) {
        var p = vk.split(':'), s = +p[0], a = +p[1], r = '[' + 'سورة ' + sname(s) + ' : ' + a + ']';
        ayahInfo(s, a).then(function (x) { return copyText('﴿' + x.text + '﴾\n' + r); })
            .then(function () { toast('نُسخت الآية مع اسم السورة ورقمها'); })
            .catch(function () { copyText(r).then(function () { toast('تعذّر جلب نص الآية الآن (يلزم اتصال). نُسخ اسم السورة ورقم الآية فقط.'); }, function () { toast('تعذّر النسخ'); }); });
    }

    /* ---------- بطاقة الآية: صورة قابلة للمشاركة والحفظ ---------- */
    var STY = {
        green: { n: 'أخضر', bg: null, text: '#fbf4dc', gold: '#d9b765', soft: 'rgba(217,183,101,.55)' },
        cream: { n: 'كريمي', bg: ['#fbf5e3', '#efe1bf'], text: '#1d1a10', gold: '#a8802f', soft: 'rgba(168,128,47,.5)' },
        night: { n: 'ليلي', bg: ['#0c1424', '#142039'], text: '#f4f1e6', gold: '#d9b765', soft: 'rgba(217,183,101,.5)' }
    };
    var card = { vk: null, tokens: null, blob: null, style: LG('muslim-card-style', 'green') };
    var logoImg = null;
    function getLogo() { if (logoImg) return Promise.resolve(logoImg); return new Promise(function (ok) { var i = new Image(); i.onload = function () { logoImg = i; ok(i); }; i.onerror = function () { ok(null); }; i.src = 'ic-512.png'; }); }
    function hue() { var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ah')); return isFinite(v) ? v : 163; }
    function sat() { var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--as')); return isFinite(v) ? v : 1; }
    function bgColors(st) { if (st.bg) return st.bg; var h = hue(), s = Math.min(100, 52 * sat()); return ['hsl(' + h + ',' + s + '%,17%)', 'hsl(' + h + ',' + s + '%,9%)']; }
    function star(ctx, x, y, r) { ctx.beginPath(); for (var i = 0; i < 16; i++) { var a = Math.PI * i / 8, rr = i % 2 ? r * 0.62 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); }
    function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    var UIFONT = '"Cairo","Noto Sans Arabic","Segoe UI",Tahoma,Arial,sans-serif';
    function layout(ctx, tokens, size, maxW) {
        var lines = [], cur = [], w = 0;
        tokens.forEach(function (t) {
            ctx.font = size + 'px ' + t.f; var tw = ctx.measureText(t.t).width;
            if (cur.length && w + tw > maxW) { lines.push({ t: cur, w: w }); cur = []; w = 0; }
            cur.push({ t: t, w: tw }); w += tw;
        });
        if (cur.length) lines.push({ t: cur, w: w });
        return lines;
    }
    function renderCard(tokens, meta, styleKey) {
        return getLogo().then(function (logo) {
            var st = STY[styleKey] || STY.green, W = 1080, textTop = 430, bottomPad = 400, maxW = 800;
            var c = document.createElement('canvas'), ctx = c.getContext('2d');
            c.width = W; c.height = 1350; ctx = c.getContext('2d');
            var size = 84, lines, lh;
            for (; size >= 28; size -= 2) { lines = layout(ctx, tokens, size, maxW); lh = size * 1.95; if (lines.length * lh <= 560) break; }
            lines = layout(ctx, tokens, size, maxW); lh = size * 1.95;
            var H = Math.max(1350, Math.round(textTop + lines.length * lh + bottomPad));
            c.height = H; ctx = c.getContext('2d');
            var bg = bgColors(st), g = ctx.createLinearGradient(0, 0, W * 0.3, H); g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]);
            ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
            /* نقش نجمي خفيف */
            ctx.save(); ctx.globalAlpha = styleKey === 'cream' ? 0.07 : 0.06; ctx.strokeStyle = st.gold; ctx.lineWidth = 1.5;
            for (var y = 60; y < H; y += 150) for (var x = (Math.round(y / 150) % 2 ? 135 : 60); x < W; x += 150) { star(ctx, x, y, 46); ctx.stroke(); }
            ctx.restore();
            /* إطار مزدوج */
            ctx.strokeStyle = st.gold; ctx.lineWidth = 4; roundRect(ctx, 44, 44, W - 88, H - 88, 36); ctx.stroke();
            ctx.strokeStyle = st.soft; ctx.lineWidth = 1.6; roundRect(ctx, 66, 66, W - 132, H - 132, 24); ctx.stroke();
            [[66, 66], [W - 66, 66], [66, H - 66], [W - 66, H - 66]].forEach(function (p) { ctx.save(); ctx.fillStyle = st.gold; star(ctx, p[0], p[1], 22); ctx.fill(); ctx.restore(); });
            /* الشعار واسم التطبيق */
            if (logo) { ctx.save(); ctx.beginPath(); ctx.arc(W / 2, 178, 72, 0, 7); ctx.clip(); ctx.drawImage(logo, W / 2 - 72, 106, 144, 144); ctx.restore(); ctx.strokeStyle = st.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2, 178, 74, 0, 7); ctx.stroke(); }
            ctx.textAlign = 'center'; ctx.direction = 'rtl'; ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = st.gold; ctx.font = '700 58px ' + UIFONT; ctx.fillText('المسلم', W / 2, 324);
            ctx.strokeStyle = st.soft; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(W / 2 - 250, 370); ctx.lineTo(W / 2 - 24, 370); ctx.moveTo(W / 2 + 24, 370); ctx.lineTo(W / 2 + 250, 370); ctx.stroke();
            ctx.fillStyle = st.gold; star(ctx, W / 2, 370, 12); ctx.fill();
            /* نص الآية */
            ctx.textAlign = 'left'; ctx.direction = 'ltr'; ctx.fillStyle = st.text;
            lines.forEach(function (ln, i) {
                var yy = textTop + i * lh + size, xr = (W + ln.w) / 2;
                ln.t.forEach(function (it) { ctx.font = size + 'px ' + it.t.f; xr -= it.w; ctx.fillText(it.t.t, xr, yy); });
            });
            /* السورة ورقم الآية */
            var by = textTop + lines.length * lh + 70;
            ctx.textAlign = 'center'; ctx.direction = 'rtl';
            var label = meta.surah + '  •  الآية ' + AR(meta.ayah);
            ctx.font = '700 44px ' + UIFONT; var lw = ctx.measureText(label).width + 90;
            ctx.fillStyle = st.gold; roundRect(ctx, (W - lw) / 2, by, lw, 84, 42); ctx.fill();
            ctx.fillStyle = styleKey === 'cream' ? '#fff8e6' : '#0b2a22'; ctx.fillText(label, W / 2, by + 58);
            ctx.fillStyle = st.text; ctx.globalAlpha = 0.78; ctx.font = '500 30px ' + UIFONT;
            ctx.fillText('تطبيق المسلم  •  \u2066@al_muslim0001\u2069', W / 2, H - 112); ctx.globalAlpha = 1;
            return c;
        });
    }
    function textTokens(text) { return text.split(/\s+/).filter(Boolean).map(function (w) { return { t: w + ' ', f: '"Amiri Quran","KFGQPC Uthmanic Script HAFS","Amiri","Noto Naskh Arabic",serif' }; }); }
    function glyphTokens(words) { return words.map(function (w) { return { t: w.char || '', f: "'" + w.font + "'" }; }); }
    function ensureCardUI() {
        if ($('mpCard')) return;
        var d = document.createElement('div'); d.id = 'mpCard'; d.className = 'plusOv'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'مشاركة الآية كصورة');
        d.innerHTML = '<div class="plusBox"><div class="plusHd"><b>مشاركة الآية كصورة</b><button type="button" id="mpCardX" aria-label="إغلاق">✕</button></div>' +
            '<div class="cardStyles" id="mpCardSt" role="group" aria-label="نمط البطاقة">' + Object.keys(STY).map(function (k) { return '<button type="button" data-s="' + k + '">' + STY[k].n + '</button>'; }).join('') + '</div>' +
            '<div class="cardPrev" id="mpCardPrev"><span class="mini">جارٍ تجهيز البطاقة…</span></div>' +
            '<div class="cardAct"><button type="button" class="primary" id="mpCardShare">مشاركة</button><button type="button" id="mpCardSave">حفظ الصورة</button></div>' +
            '<div class="mini" id="mpCardNote"></div></div>';
        document.body.appendChild(d);
        d.onclick = function (e) { if (e.target === d) closeCard(); };
        $('mpCardX').onclick = closeCard;
        $('mpCardSt').onclick = function (e) { var b = e.target.closest('button[data-s]'); if (!b) return; card.style = b.getAttribute('data-s'); LS('muslim-card-style', card.style); drawCard(); };
        $('mpCardShare').onclick = shareCard;
        $('mpCardSave').onclick = saveCard;
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.classList.contains('show')) closeCard(); });
    }
    function closeCard() { var d = $('mpCard'); if (d) d.classList.remove('show'); }
    function fname() { return 'ayah-' + String(card.vk).replace(':', '-') + '.png'; }
    function drawCard() {
        var prev = $('mpCardPrev'); if (!card.tokens) return;
        document.querySelectorAll('#mpCardSt button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-s') === card.style); });
        var p = card.vk.split(':');
        renderCard(card.tokens, { surah: 'سورة ' + sname(+p[0]), ayah: +p[1] }, card.style).then(function (c) {
            prev.innerHTML = ''; c.setAttribute('aria-label', ref(card.vk)); c.className = 'cardCv'; prev.appendChild(c);
            c.toBlob(function (b) { card.blob = b; }, 'image/png');
        });
    }
    function share(vk) {
        ensureCardUI(); card.vk = vk; card.tokens = null; card.blob = null;
        $('mpCard').classList.add('show'); $('mpCardPrev').innerHTML = '<span class="mini">جارٍ تجهيز البطاقة…</span>'; $('mpCardNote').textContent = '';
        var m = M(), p = vk.split(':');
        m.ayahWords(vk).then(function (ws) {
            if (ws && ws.length) { card.tokens = glyphTokens(ws); return; }
            return ayahInfo(+p[0], +p[1]).then(function (x) { card.tokens = textTokens(x.text); });
        }).catch(function () {
            return ayahInfo(+p[0], +p[1]).then(function (x) { card.tokens = textTokens(x.text); });
        }).then(function () {
            var fl = (document.fonts && document.fonts.load) ? document.fonts.load('40px "Amiri Quran"').catch(function () { }) : null;
            return Promise.resolve(fl);
        }).then(drawCard).catch(function () { $('mpCardPrev').innerHTML = '<span class="mini">تعذّر تجهيز البطاقة الآن. تحقّق من الاتصال وأعد المحاولة.</span>'; });
    }
    function saveCard() {
        if (!card.blob) { toast('البطاقة قيد التجهيز'); return; }
        var a = document.createElement('a'), u = URL.createObjectURL(card.blob); a.href = u; a.download = fname(); document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
        $('mpCardNote').textContent = 'إن لم يبدأ التنزيل: اضغط مطولًا على الصورة واختر «حفظ الصورة».';
    }
    function shareCard() {
        if (!card.blob) { toast('البطاقة قيد التجهيز'); return; }
        var f; try { f = new File([card.blob], fname(), { type: 'image/png' }); } catch (e) { f = null; }
        if (f && navigator.canShare && navigator.canShare({ files: [f] }) && navigator.share) {
            navigator.share({ files: [f], title: ref(card.vk) }).catch(function (e) { if (e && e.name !== 'AbortError') saveCard(); });
        } else { saveCard(); toast('المشاركة المباشرة غير متاحة على هذا المتصفح — تم حفظ الصورة بدلًا منها'); }
    }

    /* ---------- تكرار الآية: بالآيات أو بالصفحات ---------- */
    var RK = 'muslim-mp-rep';
    var R = { run: false, keys: [], i: 0, each: 1, loops: 1, gap: 1, audio: null, doneEach: 0, doneLoop: 0, errs: 0, follow: true, pages: {} };
    function pad(n, l) { return ('000' + n).slice(-l); }
    function recOptions() {
        var m = M(), list = (m && m.recs) ? m.recs : [], cur = (m && m.cfg && m.cfg().reciter) || '';
        return list.map(function (r) { return '<option value="' + esc(r[0]) + '"' + (r[0] === cur ? ' selected' : '') + '>' + esc(r[1]) + '</option>'; }).join('');
    }
    function ensureRepUI() {
        if ($('mpRepP')) return;
        var d = document.createElement('div'); d.id = 'mpRepP'; d.className = 'plusOv'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'تكرار الآية');
        d.innerHTML = '<div class="plusBox"><div class="plusHd"><b>تكرار الآية</b><button type="button" id="rpX" aria-label="إغلاق">✕</button></div>' +
            '<div class="cardStyles" id="rpMode" role="group" aria-label="طريقة التكرار"><button type="button" data-m="ayah">بالآيات</button><button type="button" data-m="page">بالصفحات</button></div>' +
            '<div id="rpAyahF"><div class="rpRow"><span>السورة</span><b id="rpSurahN"></b></div>' +
            '<div class="rpRow"><label for="rpFrom">من الآية</label><input id="rpFrom" type="number" min="1" inputmode="numeric"><label for="rpTo">إلى الآية</label><input id="rpTo" type="number" min="1" inputmode="numeric"></div>' +
            '<div class="rpQuick"><button type="button" data-q="one">هذه الآية فقط</button><button type="button" data-q="ten">١٠ آيات</button><button type="button" data-q="end">حتى نهاية السورة</button></div></div>' +
            '<div id="rpPageF" hidden><div class="rpRow"><label for="rpP1">من صفحة</label><input id="rpP1" type="number" min="1" max="604" inputmode="numeric"><label for="rpP2">إلى صفحة</label><input id="rpP2" type="number" min="1" max="604" inputmode="numeric"></div>' +
            '<div class="rpQuick"><button type="button" data-q="this">هذه الصفحة</button><button type="button" data-q="next">هذه والتي بعدها</button></div></div>' +
            '<div class="rpRow"><label for="rpRec">القارئ</label><select id="rpRec" class="field"></select></div>' +
            '<div class="rpRow"><label for="rpEach">تكرار كل آية</label><select id="rpEach" class="field"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="5">5</option><option value="7">7</option><option value="10">10</option></select>' +
            '<label for="rpLoops">تكرار المقطع</label><select id="rpLoops" class="field"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="5">5</option><option value="10">10</option><option value="0">بلا نهاية</option></select></div>' +
            '<div class="rpRow"><label for="rpGap">فاصل بين الآيات</label><select id="rpGap" class="field"><option value="0">بلا فاصل</option><option value="1">ثانية</option><option value="2">ثانيتان</option><option value="3">٣ ثوانٍ</option></select></div>' +
            '<div class="cardAct"><button type="button" class="primary" id="rpGo">ابدأ التكرار</button><button type="button" id="rpStop">إيقاف</button></div><div class="mini" id="rpSt" role="status"></div></div>';
        document.body.appendChild(d);
        $('rpRec').innerHTML = recOptions();
        d.onclick = function (e) { if (e.target === d) d.classList.remove('show'); };
        $('rpX').onclick = function () { d.classList.remove('show'); };
        $('rpMode').onclick = function (e) { var b = e.target.closest('button[data-m]'); if (b) setMode(b.getAttribute('data-m')); };
        d.querySelector('#rpAyahF .rpQuick').onclick = function (e) {
            var b = e.target.closest('button[data-q]'); if (!b) return; var s = +R.s, f = +$('rpFrom').value || 1, max = AYAH[s - 1] || 1;
            $('rpTo').value = b.dataset.q === 'one' ? f : b.dataset.q === 'ten' ? Math.min(max, f + 9) : max;
        };
        d.querySelector('#rpPageF .rpQuick').onclick = function (e) {
            var b = e.target.closest('button[data-q]'); if (!b) return; var p = M() ? M().page() : 1;
            $('rpP1').value = p; $('rpP2').value = b.dataset.q === 'next' ? Math.min(604, p + 1) : p;
        };
        $('rpGo').onclick = startRep; $('rpStop').onclick = function () { stopRep(); };
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && d.classList.contains('show')) d.classList.remove('show'); });
        ['rpRec', 'rpEach', 'rpLoops', 'rpGap'].forEach(function (id) { $(id).onchange = saveRepPrefs; });
        var pr = LG(RK, {}); if (pr.rec && [].some.call($('rpRec').options, function (o) { return o.value === pr.rec; })) $('rpRec').value = pr.rec;
        ['each', 'loops', 'gap'].forEach(function (k) { if (pr[k] != null) $('rp' + k[0].toUpperCase() + k.slice(1)).value = String(pr[k]); });
    }
    function saveRepPrefs() { LS(RK, { rec: $('rpRec').value, each: $('rpEach').value, loops: $('rpLoops').value, gap: $('rpGap').value }); }
    function setMode(m) {
        R.mode = m; $('rpAyahF').hidden = m !== 'ayah'; $('rpPageF').hidden = m !== 'page';
        document.querySelectorAll('#rpMode button').forEach(function (b) { b.classList.toggle('on', b.dataset.m === m); });
    }
    function openRep(vk, mode) {
        ensureRepUI();
        var m = M(), p = m ? m.page() : 1, pr = LG(RK, {});
        void pr;
        var a = vk ? vk.split(':') : [curSurah(), 1];
        R.s = +a[0]; $('rpSurahN').textContent = sname(R.s) + ' (' + AR(AYAH[R.s - 1]) + ' آية)'; $('rpFrom').value = a[1]; $('rpTo').value = a[1]; $('rpFrom').max = $('rpTo').max = AYAH[R.s - 1];
        $('rpP1').value = p; $('rpP2').value = p;
        setMode(mode || (vk ? 'ayah' : 'page'));
        $('rpSt').textContent = R.run ? 'التكرار يعمل الآن.' : '';
        $('mpRepP').classList.add('show');
        var sh = $('mpSheet'); if (sh) sh.classList.remove('show');
    }
    function keysForAyahs(s, a, b) { var k = []; for (var i = a; i <= b; i++) k.push(s + ':' + i); return Promise.resolve(k); }
    function keysForPages(p1, p2) {
        var m = M(), out = [], seq = Promise.resolve();
        R.pages = {};
        for (var p = p1; p <= p2; p++) (function (p) {
            seq = seq.then(function () { return m.pageKeys(p).then(function (ks) { ks.forEach(function (k) { if (out[out.length - 1] !== k) { out.push(k); } if (!R.pages[k]) R.pages[k] = p; }); }); });
        })(p);
        return seq.then(function () { return out; });
    }
    function startRep() {
        var st = $('rpSt'), mode = R.mode, p;
        saveRepPrefs();
        if (mode === 'ayah') {
            var s = R.s, a = parseInt($('rpFrom').value, 10), b = parseInt($('rpTo').value, 10), max = AYAH[s - 1];
            if (!(a >= 1 && b >= a && b <= max)) { st.textContent = 'تأكد من الأرقام: الآية من ١ إلى ' + AR(max) + '، ونهاية المقطع ليست قبل بدايته.'; return; }
            if (b - a > 299) { st.textContent = 'المقطع طويل جدًا؛ اختر حتى ٣٠٠ آية.'; return; }
            p = keysForAyahs(s, a, b);
        } else {
            var p1 = parseInt($('rpP1').value, 10), p2 = parseInt($('rpP2').value, 10);
            if (!(p1 >= 1 && p2 >= p1 && p2 <= 604)) { st.textContent = 'أرقام الصفحات من ١ إلى ٦٠٤، ونهاية المقطع ليست قبل بدايته.'; return; }
            if (p2 - p1 > 29) { st.textContent = 'اختر حتى ٣٠ صفحة في المرة الواحدة.'; return; }
            st.textContent = 'جارٍ تجهيز الآيات…';
            p = keysForPages(p1, p2);
        }
        p.then(function (keys) {
            if (!keys.length) throw 0;
            stopRep(true);
            R.keys = keys; R.i = 0; R.doneEach = 0; R.doneLoop = 0; R.errs = 0; R.run = true;
            R.each = +$('rpEach').value || 1; R.loops = +$('rpLoops').value; R.gap = +$('rpGap').value || 0; R.rec = $('rpRec').value;
            R.follow = mode === 'page' || true;
            st.textContent = 'بدأ التكرار — ' + AR(keys.length) + ' آية.'; showBar(); playCur();
            $('mpRepP').classList.remove('show');
        }).catch(function () { st.textContent = 'تعذّر تجهيز الآيات. تحقّق من الاتصال وأعد المحاولة.'; });
    }
    function showBar() {
        var b = $('mpRepBar');
        if (!b) { b = document.createElement('div'); b.id = 'mpRepBar'; b.setAttribute('role', 'status'); b.innerHTML = '<span id="mpRepTxt"></span><button type="button" id="mpRepOpen" aria-label="خيارات التكرار">⚙</button><button type="button" id="mpRepStop" aria-label="إيقاف التكرار">■ إيقاف</button>'; document.body.appendChild(b); $('mpRepStop').onclick = function () { stopRep(); }; $('mpRepOpen').onclick = function () { openRep(null, R.mode); }; }
        b.classList.add('show'); paintBar();
    }
    function paintBar() {
        var t = $('mpRepTxt'); if (!t || !R.keys.length) return; var k = R.keys[R.i].split(':');
        t.textContent = '↻ ' + sname(+k[0]) + ' — الآية ' + AR(k[1]) + (R.each > 1 ? ' (' + AR(R.doneEach + 1) + '/' + AR(R.each) + ')' : '') + (R.loops !== 1 ? ' • الجولة ' + AR(R.doneLoop + 1) + (R.loops ? '/' + AR(R.loops) : '') : '');
    }
    function stopRep(silent) {
        R.run = false; clearTimeout(R.tm);
        try { if (R.audio) { R.audio.onended = null; R.audio.onerror = null; R.audio.pause(); } } catch (e) { }
        R.audio = null; var b = $('mpRepBar'); if (b) b.classList.remove('show');
        var m = M(); if (m && m.hlVerse) m.hlVerse(null);
        if (!silent && $('rpSt')) $('rpSt').textContent = 'أُوقف التكرار.';
    }
    function followPage(k) {
        var m = M(), sec = $('mushaf107'); if (!m || !sec || !sec.classList.contains('active') || sec.getAttribute('data-view') !== 'read') return;
        var want = R.pages[k], go = function (pg) { if (pg && pg !== m.page()) { m.go(pg); } setTimeout(function () { if (R.run && R.keys[R.i] === k) m.hlVerse(k); }, 600); };
        if (want) return go(want);
        var q = k.split(':'); ayahInfo(+q[0], +q[1]).then(function (x) { R.pages[k] = x.page; if (R.run && R.keys[R.i] === k) go(x.page); }).catch(function () { });
        m.hlVerse(k);
    }
    function playCur() {
        if (!R.run) return;
        var k = R.keys[R.i], q = k.split(':'), url = 'https://everyayah.com/data/' + R.rec + '/' + pad(q[0], 3) + pad(q[1], 3) + '.mp3';
        paintBar(); followPage(k);
        try { if (R.audio) { R.audio.onended = null; R.audio.pause(); } } catch (e) { }
        var a = new Audio(url); R.audio = a; a.setAttribute('data-v107title', '↻ ' + sname(+q[0]) + ' — آية ' + q[1]);
        a.onended = function () { R.errs = 0; R.tm = setTimeout(next, R.gap * 1000); };
        a.onerror = function () { if (!R.run) return; R.errs++; if (R.errs >= 3) { toast('تعذّر تشغيل التلاوة. تحقّق من الاتصال.'); stopRep(true); return; } R.tm = setTimeout(next, 600); };
        var pr = a.play(); if (pr && pr.catch) pr.catch(function () { if (R.run && !a.error) { /* منع التشغيل التلقائي: يلزم لمسة */ toast('اضغط تشغيل لبدء التلاوة'); } });
    }
    function next() {
        if (!R.run) return;
        R.doneEach++;
        if (R.doneEach < R.each) { return playCur(); }
        R.doneEach = 0; R.i++;
        if (R.i >= R.keys.length) { R.doneLoop++; if (R.loops && R.doneLoop >= R.loops) { toast('اكتمل التكرار'); stopRep(true); return; } R.i = 0; }
        playCur();
    }

    /* ---------- معلومات السورة + الانتقال لآية + تثبيت السورة ---------- */
    var PK = 'muslim-pin-surahs';
    function pins() { var p = LG(PK, []); return Array.isArray(p) ? p.filter(function (x) { return x >= 1 && x <= 114; }) : []; }
    function curSurah() { var s = $('mpSurah'); return s ? +s.value || 1 : 1; }
    function paintInfo(det) {
        var el = $('mpInfo'); if (!el) return;
        var ids = (det && det.surahs && det.surahs.length) ? det.surahs.map(function (x) { return +x.id; }) : [curSurah()];
        el.innerHTML = ids.map(function (id) { return '<span class="mpInfoS"><b>' + esc(sname(id)) + '</b> ' + place(id) + ' • ' + AR(AYAH[id - 1]) + ' آية</span>'; }).join('') +
            '<span class="mpGoA"><label for="mpAyahNo" class="mini">اذهب إلى آية</label><input id="mpAyahNo" type="number" min="1" inputmode="numeric" placeholder="رقم"><button type="button" id="mpAyahGo">اذهب</button></span>';
        $('mpAyahGo').onclick = goAyah; $('mpAyahNo').onkeydown = function (e) { if (e.key === 'Enter') goAyah(); };
        var s = $('mpSurah'); if (s) s.setAttribute('title', 'السورة');
        pinUI();
    }
    function goAyah() {
        var s = curSurah(), a = parseInt($('mpAyahNo').value, 10), max = AYAH[s - 1], m = M();
        if (!(a >= 1 && a <= max)) { toast('سورة ' + sname(s) + ' فيها ' + AR(max) + ' آية'); return; }
        var ch = m.chapters && m.chapters(), c = ch && ch.chapters && ch.chapters[s - 1];
        if (a === 1 && c && c.pages) { m.go(c.pages[0]); return; }
        ayahInfo(s, a).then(function (x) { m.go(x.page); setTimeout(function () { m.hlVerse(s + ':' + a); }, 700); }).catch(function () { toast('يلزم اتصال بالإنترنت للانتقال إلى آية محددة'); });
    }
    function pinUI() {
        var sel = $('mpSurah'); if (!sel || !sel.options.length) return;
        var cur = curSurah(), p = pins(), b = $('mpPin');
        if (!b) { b = document.createElement('button'); b.id = 'mpPin'; b.type = 'button'; b.onclick = function () { var q = pins(), c = curSurah(), i = q.indexOf(c); if (i < 0) q.unshift(c); else q.splice(i, 1); LS(PK, q); pinUI(); toast(i < 0 ? 'ثُبّتت السورة في أعلى القائمة' : 'أُلغي تثبيت السورة'); }; sel.parentNode.insertBefore(b, sel.nextSibling); }
        var on = p.indexOf(cur) >= 0; b.textContent = on ? '📌 مثبّتة' : '📍 تثبيت'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', on ? 'إلغاء تثبيت السورة' : 'تثبيت السورة في أعلى القائمة');
        var all = [].map.call(sel.querySelectorAll('option'), function (o) { return { v: +o.value, t: o.textContent.replace(/^\s*\d+\.\s*/, '') }; });
        if (!all.length) return;
        var seen = {}; all = all.filter(function (x) { if (seen[x.v]) return false; seen[x.v] = 1; return true; }).sort(function (x, y) { return x.v - y.v; });
        var key = p.join(',') + '|' + all.length;
        if (sel.dataset.pinKey !== key) {
            sel.dataset.pinKey = key;
            var mk = function (x) { return '<option value="' + x.v + '">' + x.v + '. ' + esc(x.t) + '</option>'; };
            var pinned = p.map(function (id) { return all.filter(function (x) { return x.v === id; })[0]; }).filter(Boolean);
            sel.innerHTML = (pinned.length ? '<optgroup label="📌 السور المثبّتة">' + pinned.map(mk).join('') + '</optgroup><optgroup label="كل السور">' : '') + all.map(mk).join('') + (pinned.length ? '</optgroup>' : '');
        }
        sel.value = cur;
    }
    document.addEventListener('mushaf:page', function (e) { paintInfo(e.detail); });
    /* بعد إعادة بناء قائمة السور (أول تحميل) نعيد ترتيبها */
    function watchSel() { var s = $('mpSurah'); if (!s || s.dataset.pw) return; s.dataset.pw = '1'; new MutationObserver(function () { if (!s.dataset.busy) { s.dataset.busy = '1'; try { pinUI(); } finally { delete s.dataset.busy; } } }).observe(s, { childList: true }); }

    /* ---------- زر «تكرار بالصفحات» داخل صفحة تكرار الآية ---------- */
    function mountRepeatPage() {
        var pg = $('repeatAyah'); if (!pg || pg.dataset.rpg) return !!(pg && pg.dataset.rpg);
        var ctr = pg.querySelector('.controls') || pg.firstElementChild; if (!ctr) return false; pg.dataset.rpg = '1';
        var box = document.createElement('div'); box.className = 'rpgBox';
        box.innerHTML = '<b>تكرار بالصفحات</b><p class="mini">اختر صفحة أو عدة صفحات من المصحف، أو كرّر الصفحة التي تقرؤها الآن.</p><button type="button" id="rpgOpen" class="primary">اختيار الصفحات</button>';
        ctr.parentNode.insertBefore(box, ctr);
        $('rpgOpen').onclick = function () { if (M()) { openRep(null, 'page'); } };
        return true;
    }
    function boot() {
        var n = 0, iv = setInterval(function () { watchSel(); mountRepeatPage(); if (++n > 120) clearInterval(iv); }, 700);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.MushafPlus = { copy: copy, share: share, repeat: openRep, stop: stopRep, info: { ayah: AYAH, madani: MADANI, place: place }, _render: renderCard };
})();

/* ---- إعدادات المصحف داخل الإعدادات > المصحف (تكتب في نفس إعدادات المصحف) ---- */
(function () {
    'use strict';
    var K = 'muslim-v107-mushaf';
    function rd() { try { return JSON.parse(localStorage.getItem(K) || '{}') || {}; } catch (e) { return {}; } }
    function wr(c) { try { localStorage.setItem(K, JSON.stringify(c)); } catch (e) { } try { document.dispatchEvent(new Event('muslim:mushaf-cfg')); } catch (e) { } }
    function set(k, v) { var c = rd(); c[k] = v; wr(c); }
    var PAP = [['cream', 'كريمي'], ['white', 'أبيض'], ['sepia', 'سيبيا'], ['gold', 'ذهبي'], ['night', 'ليلي']];
    function mount() {
        var g = document.querySelector('#stgcat-mushaf .stgGroup'); if (!g) return false; if (document.getElementById('mxSet')) return true;
        var c = rd(), w = document.createElement('div'); w.id = 'mxSet';
        function row(t, sub) { var r = document.createElement('div'); r.className = 'stgRow stgCol'; r.innerHTML = '<div><b></b><small></small></div>'; r.querySelector('b').textContent = t; r.querySelector('small').textContent = sub || ''; var x = document.createElement('div'); x.className = 'controls'; r.appendChild(x); w.appendChild(r); return x; }
        var x = row('نمط العرض', 'صفحة المصحف كما في المطبوع، أو نص السورة كاملًا بتمرير عمودي.');
        [['page', 'صفحة'], ['text', 'نص السورة']].forEach(function (o) { var b = document.createElement('button'); b.type = 'button'; b.className = 'stgBtn'; b.textContent = o[1]; b.setAttribute('aria-pressed', String((rd().mode || 'page') === o[0])); b.onclick = function () { set('mode', o[0]); [].forEach.call(x.children, function (y) { y.setAttribute('aria-pressed', String(y === b)); }); }; x.appendChild(b); });
        x = row('حجم الخط', 'يؤثر أيضًا على سرعة النزول التلقائي.');
        var mn = document.createElement('button'), pl = document.createElement('button'), zv = document.createElement('span'); mn.type = pl.type = 'button'; mn.className = pl.className = 'stgBtn'; mn.textContent = 'A−'; pl.textContent = 'A+'; zv.className = 'mini';
        function z() { zv.textContent = Math.round((+rd().scale || 1) * 100) + '%'; } z();
        mn.onclick = function () { set('scale', Math.max(.6, +((+rd().scale || 1) - .1).toFixed(2))); z(); }; pl.onclick = function () { set('scale', Math.min(2, +((+rd().scale || 1) + .1).toFixed(2))); z(); };
        x.appendChild(mn); x.appendChild(zv); x.appendChild(pl);
        x = row('سرعة النزول التلقائي', 'من بطيء (١) إلى سريع (١٠).');
        var rg = document.createElement('input'); rg.type = 'range'; rg.min = 1; rg.max = 10; rg.step = 1; rg.value = c.autoLvl || 3; rg.setAttribute('aria-label', 'سرعة النزول التلقائي'); var rv = document.createElement('b'); rv.textContent = rg.value; rg.oninput = function () { rv.textContent = rg.value; set('autoLvl', +rg.value); }; x.appendChild(rg); x.appendChild(rv);
        x = row('لون الورق', '');
        var sl = document.createElement('select'); PAP.forEach(function (p) { var o = document.createElement('option'); o.value = p[0]; o.textContent = p[1]; sl.appendChild(o); }); sl.value = c.paper || 'cream'; sl.onchange = function () { set('paper', sl.value); }; x.appendChild(sl);
        var l = document.createElement('label'); l.className = 'stgRow stgSw'; l.innerHTML = '<div><b>الإطار الذهبي</b><small>إطار زخرفي حول الصفحة</small></div>'; var ck = document.createElement('input'); ck.type = 'checkbox'; ck.checked = c.frame !== false; ck.onchange = function () { set('frame', ck.checked); }; l.appendChild(ck); w.appendChild(l);
        g.appendChild(w); return true;
    }
    var n = 0, iv = setInterval(function () { if (mount() || ++n > 40) clearInterval(iv); }, 500);
    document.addEventListener('click', function (e) { if (e.target && e.target.closest && e.target.closest('[onclick*="settings"]')) setTimeout(function () { var w = document.getElementById('mxSet'); if (w) w.remove(); mount(); }, 80); }, true);
})();
