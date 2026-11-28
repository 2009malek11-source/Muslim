/* المظهر والألوان — إعداد واحد لكل ميزة، ولون التطبيق يغيّر كل ما هو أخضر في الواجهة */
(function () {
    'use strict';
    var root = document.documentElement;
    var LSG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    var LSD = function (k) { try { localStorage.removeItem(k); } catch (e) { } };
    var $ = function (id) { return document.getElementById(id); };
    var BASE_SAT = 0.55;

    /* ---------- لون التطبيق: يُحوَّل إلى (درجة اللون + كثافته) فتتبعه كل الألوان الخضراء ---------- */
    function hexToHsl(hex) {
        var n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
        var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
        if (d) {
            s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
            if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
            else if (mx === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h *= 60;
        }
        return { h: h, s: s, l: l };
    }
    function applyHue(hex) {
        if (!/^#[0-9a-f]{6}$/i.test(hex || '')) { root.style.removeProperty('--ah'); root.style.removeProperty('--as'); return; }
        var c = hexToHsl(hex);
        root.style.setProperty('--ah', c.h.toFixed(1));
        root.style.setProperty('--as', Math.max(0, Math.min(1.7, c.s / BASE_SAT)).toFixed(3));
    }
    var PRESETS = [
        ['#1d624f', 'أخضر'], ['#0f766e', 'فيروزي'], ['#1d5a9c', 'أزرق'], ['#6b3fa0', 'بنفسجي'], ['#8a5230', 'بني'], ['#a3365a', 'وردي داكن'], ['#b8860b', 'ذهبي']
    ];
    function currentAccent() { var v = LSG('muslim-v107-color'); try { v = v && JSON.parse(v); } catch (e) { } return /^#[0-9a-f]{6}$/i.test(v || '') ? v : ''; }
    function setAccent(hex) {
        if (typeof window.v107SetColor === 'function') window.v107SetColor(hex);
        else { LSS('muslim-v107-color', JSON.stringify(hex)); }
        applyHue(hex);
        paintSwatches();
    }
    function resetAccent() {
        LSD('muslim-v107-color');
        if (typeof window.v107ApplyColor === 'function') window.v107ApplyColor('');
        applyHue('');
        var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = '#1d624f';
        paintSwatches();
        if (window.toast) window.toast('أُعيد لون التطبيق الافتراضي');
    }
    applyHue(currentAccent());

    /* ---------- الوضع الدافئ (ألوان أدفأ لتقليل إجهاد العين) ---------- */
    function applyWarm(on) { document.body && document.body.classList.toggle('warmMode', !!on); }
    function warmOn() { return LSG('muslim-warm') === '1'; }

    /* ---------- تقليل الحركة / تكبير العناصر: كانت تُحفظ ولا تُستعاد بعد إعادة فتح الموقع ---------- */
    function restoreFlags() {
        ['reduceMotion', 'largeUI'].forEach(function (k) {
            var on = LSG('quran-m09-setting-' + k) === '1';
            if (document.body) document.body.classList.toggle(k, on);
        });
        applyWarm(warmOn());
    }

    /* ---------- بناء صفوف الإعدادات ---------- */
    function rowByTitle(t) {
        var rows = document.querySelectorAll('#settings .stgRow');
        for (var i = 0; i < rows.length; i++) { var b = rows[i].querySelector('b'); if (b && b.textContent.trim() === t) return rows[i]; }
        return null;
    }
    function mkRow(cls, id, title, sub, ctl) {
        var d = document.createElement(cls === 'stgSw' ? 'label' : 'div');
        d.className = 'stgRow ' + cls; if (id) d.id = id;
        d.innerHTML = '<div><b>' + title + '</b><small>' + sub + '</small></div>';
        d.appendChild(ctl); return d;
    }
    function paintSwatches() {
        var box = $('plusAccent'); if (!box) return;
        var cur = currentAccent().toLowerCase();
        box.querySelectorAll('button[data-c]').forEach(function (b) { var on = (b.getAttribute('data-c') === cur) || (!cur && b.getAttribute('data-c') === '#1d624f'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        var inp = $('plusAccentIn'), hx = $('plusAccentHex');
        if (inp) inp.value = cur || '#1d624f';
        if (hx) hx.value = cur || '';
    }
    function buildAccentRow() {
        if ($('plusAccentRow')) return $('plusAccentRow');
        var wrap = document.createElement('div'); wrap.className = 'stgRow'; wrap.id = 'plusAccentRow';
        wrap.innerHTML = '<div><b>لون التطبيق</b><small>يغيّر لون الأزرار والعناوين وكل ما هو أخضر في التطبيق</small></div>' +
            '<div class="plusAccent" id="plusAccent" role="group" aria-label="لون التطبيق">' +
            PRESETS.map(function (p) { return '<button type="button" data-c="' + p[0] + '" aria-label="' + p[1] + '" title="' + p[1] + '" style="background:' + p[0] + '"></button>'; }).join('') +
            '</div><div class="plusAccentCustom"><label>لون تختاره بنفسك <input type="color" id="plusAccentIn" value="#1d624f" aria-label="اختيار لون مخصص"></label>' +
            '<input id="plusAccentHex" class="field" placeholder="#1d624f" maxlength="7" dir="ltr" aria-label="رمز اللون"><button type="button" class="stgBtn" id="plusAccentReset">افتراضي</button></div>';
        wrap.querySelector('#plusAccent').onclick = function (e) { var b = e.target.closest('button[data-c]'); if (b) setAccent(b.getAttribute('data-c')); };
        wrap.querySelector('#plusAccentIn').oninput = function () { setAccent(this.value); };
        wrap.querySelector('#plusAccentHex').onchange = function () { var v = this.value.trim(); if (v && v[0] !== '#') v = '#' + v; if (/^#[0-9a-f]{6}$/i.test(v)) setAccent(v.toLowerCase()); else if (window.toast) window.toast('اكتب اللون بصيغة #RRGGBB'); };
        wrap.querySelector('#plusAccentReset').onclick = resetAccent;
        return wrap;
    }
    function mkCat(id, icon, title, sub) {
        var d = document.createElement('details'); d.className = 'stgCat'; d.id = id;
        d.innerHTML = '<summary><span class="ci">' + icon + '</span>' + title + '<span class="cs">▾</span></summary><div class="stgCatBody"><div class="stgGroup open"></div></div>';
        return d;
    }
    function regroup() {
        var st = $('settings'); if (!st || $('stgcat-look')) return !!$('stgcat-look');
        var old = $('stgcat-appearance'); if (!old || !rowByTitle('الوضع الليلي')) return false;
        var look = mkCat('stgcat-look', '🖌️', 'المظهر والعرض'), col = mkCat('stgcat-colors', '🎨', 'الألوان والحركة');
        var lg = look.querySelector('.stgGroup'), cg = col.querySelector('.stgGroup');
        ['الوضع الليلي', 'حجم الخط', 'استدارة الحواف', 'الأرقام', 'نظام الساعة', 'اللغة', 'تكبير عناصر الواجهة'].forEach(function (t) { var r = rowByTitle(t); if (r) lg.appendChild(r); });
        /* لون التطبيق: صف واحد يجمع «لون التطبيق» و«لون مخصص» */
        var oldAcc = rowByTitle('لون التطبيق'), oldCus = rowByTitle('لون مخصص');
        if (oldAcc) { oldAcc.classList.add('stgHide'); cg.appendChild(oldAcc); }
        if (oldCus) { oldCus.classList.add('stgHide'); cg.appendChild(oldCus); }
        cg.appendChild(buildAccentRow()); paintSwatches();
        var tc = $('v105TcRow'); if (tc) cg.appendChild(tc);
        /* الوضع الدافئ — يعمل فعلًا الآن */
        var w = document.createElement('input'); w.type = 'checkbox'; w.id = 'plusWarm'; w.checked = warmOn();
        w.onchange = function () { LSS('muslim-warm', this.checked ? '1' : '0'); applyWarm(this.checked); };
        cg.appendChild(mkRow('stgSw', 'plusWarmRow', 'الوضع الدافئ', 'ألوان أدفأ لتقليل إجهاد العين ليلًا', w));
        /* حركة واحدة: «تقليل الحركة» و«إيقاف حركات الواجهة» كانا ميزة واحدة بإسمين */
        var rm = rowByTitle('تقليل الحركة');
        if (rm) { var s = rm.querySelector('small'); if (s) s.textContent = 'إيقاف الحركات والانتقالات لواجهة أخف وأسرع'; var ck = rm.querySelector('input'); if (ck) ck.checked = LSG('quran-m09-setting-reduceMotion') === '1'; cg.appendChild(rm); }
        ['إيقاف حركات الواجهة', 'استدارة البطاقات'].forEach(function (t) { var r = rowByTitle(t); if (r) r.remove(); });
        /* التشخيص: ليس من المظهر — يُنقل لقسم النسخة والتحديث */
        var dg = $('v105DiagRow'), ver = $('stgcat-ver');
        if (dg && ver) { var g = ver.querySelector('.stgGroup'); if (g) g.appendChild(dg); }
        var lgl = lg.querySelector('#largeUI'); void lgl;
        var anchor = $('stgcat-bg') || old;
        anchor.parentNode.insertBefore(look, anchor.id === 'stgcat-bg' ? anchor : old);
        look.parentNode.insertBefore(col, $('stgcat-bg') ? $('stgcat-bg') : old);
        if ($('stgcat-bg') && col.nextSibling !== $('stgcat-bg')) col.parentNode.insertBefore($('stgcat-bg'), col.nextSibling);
        var dw = $('stgWarm'); if (dw && dw.closest('.stgRow')) dw.closest('.stgRow').remove();
        if (!old.querySelector('.stgRow')) old.remove();
        /* إن كانت بطاقات الإعدادات قد بُنيت قبل التقسيم فتُبنى من جديد */
        if (st.dataset.nv) { delete st.dataset.nv; var g = st.querySelector('.nvSetGrid'), br = st.querySelector('.nvSetBar'); if (g) g.remove(); if (br) br.remove(); if (typeof window.v123Settings === 'function' && st.dataset.sub === undefined) { /* تُبنى عند فتح الإعدادات */ } }
        look.open = true;
        return true;
    }
    /* القسم القديم لا يُعاد: إن ظهر فارغًا يُحذف هو وبطاقته */
    function dropOld() {
        var st = $('settings'); if (!st) return;
        var o = $('stgcat-appearance'); if (o && !o.querySelector('.stgRow')) o.remove();
        st.querySelectorAll('.nvSetGrid > button').forEach(function (b) { var t = b.querySelector('b'); if (t && t.textContent.trim() === 'المظهر والعرض والألوان') b.remove(); });
    }
    function watch() {
        var st = $('settings'); if (!st || st.dataset.plusWatch) return; st.dataset.plusWatch = '1';
        new MutationObserver(function () { dropOld(); }).observe(st, { childList: true, subtree: true });
        dropOld();
    }
    function boot() {
        restoreFlags();
        var w = setInterval(function () { watch(); if ($('settings') && $('settings').dataset.plusWatch) clearInterval(w); }, 400);
        var n = 0, iv = setInterval(function () { restoreFlags(); if (regroup() || ++n > 80) clearInterval(iv); }, 400);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.MuslimTheme = { setAccent: setAccent, resetAccent: resetAccent, presets: PRESETS };
})();

/* ===== نظام المظهر Premium: تلقائي (حسب النظام) • نهاري • ليلي • أسود OLED • تلقائي حسب الوقت ===== */
(function () {
    'use strict';
    var KM = 'muslim-theme-mode', MODES = [['auto', 'تلقائي', 'يتبع نظام الجهاز'], ['light', 'نهاري', 'فاتح مريح'], ['dark', 'ليلي', 'داكن أنيق'], ['black', 'أسود', 'OLED يوفّر البطارية'], ['time', 'بالوقت', 'ليلي من ٦م إلى ٥ص']];
    var LG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    function mode() { var m = LG(KM); if (/^(auto|light|dark|black|time)$/.test(m || '')) return m; var o = LG('quran-m09-dark'); return o === '1' ? 'dark' : o === '0' ? 'light' : 'auto'; }
    function sysDark() { try { return matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; } }
    function timeDark() { var h = new Date().getHours(); return h >= 18 || h < 5; }
    function wantDark(m) { return m === 'dark' || m === 'black' || (m === 'auto' && sysDark()) || (m === 'time' && timeDark()); }
    var first = true;
    function apply(swap) {
        var b = document.body; if (!b) return; var m = mode(), d = wantDark(m), h = document.documentElement;
        if (swap && !first) { h.classList.add('themeSwap'); setTimeout(function () { h.classList.remove('themeSwap'); }, 450); }
        first = false;
        b.classList.toggle('dark', d); b.classList.toggle('oled', d && m === 'black'); h.style.colorScheme = d ? 'dark' : 'light';
        LS('quran-m09-dark', d ? '1' : '0');
        try { var tc = document.querySelector('meta[name=theme-color]'); if (tc) { var acc = LG('muslim-v107-color'); try { acc = acc && JSON.parse(acc); } catch (e) { } tc.content = d ? (m === 'black' ? '#000000' : '#0b1713') : (/^#[0-9a-f]{6}$/i.test(acc || '') ? acc : '#1d624f'); } } catch (e) { }
        paint();
    }
    function setMode(m) { if (!/^(auto|light|dark|black|time)$/.test(m)) return; LS(KM, m); apply(true); }
    function paint() { var box = document.getElementById('plusThemeChips'); if (box) box.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-m') === mode()); x.setAttribute('aria-pressed', x.getAttribute('data-m') === mode() ? 'true' : 'false'); }); var s = document.getElementById('nvDark'); if (s) s.setAttribute('aria-pressed', document.body.classList.contains('dark') ? 'true' : 'false'); }
    /* زر القمر السريع: يبدّل نهاري ↔ ليلي صراحةً */
    window.toggleDark = function () { setMode(document.body.classList.contains('dark') ? 'light' : 'dark'); };
    function row() {
        var st = document.getElementById('settings'); if (!st || document.getElementById('plusThemeRow')) return !!document.getElementById('plusThemeRow');
        var rows = st.querySelectorAll('.stgRow'), old = null; for (var i = 0; i < rows.length; i++) { var b = rows[i].querySelector('b'); if (b && b.textContent.trim() === 'الوضع الليلي') { old = rows[i]; break; } }
        if (!old) return false;
        var r = document.createElement('div'); r.className = 'stgRow'; r.id = 'plusThemeRow';
        r.innerHTML = '<div><b>المظهر</b><small>نهاري أو ليلي أو أسود (OLED)، أو تلقائي حسب جهازك أو الوقت</small></div>';
        var box = document.createElement('div'); box.id = 'plusThemeChips'; box.className = 'plusThemeChips'; box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'المظهر');
        MODES.forEach(function (x) { var bt = document.createElement('button'); bt.type = 'button'; bt.setAttribute('data-m', x[0]); bt.title = x[2]; bt.textContent = x[1]; bt.onclick = function () { setMode(x[0]); }; box.appendChild(bt); });
        r.appendChild(box); old.parentNode.replaceChild(r, old); paint(); return true;
    }
    function boot() {
        apply(false);
        try { var mq = matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { if (mode() === 'auto') apply(true); }); } catch (e) { }
        setInterval(function () { if (mode() === 'time') apply(true); }, 60000);
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && (mode() === 'time' || mode() === 'auto')) apply(false); });
        var n = 0, iv = setInterval(function () { if (row() || ++n > 120) clearInterval(iv); }, 500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.MuslimMode = { set: setMode, mode: mode };
})();
