/* repeat-plus.js — تكرار الآية: بحث عن القارئ + حفظ آخر النطاقات + مؤقت إيقاف تلقائي. (لا سرعة تلاوة ولا قرّاء إضافيون: التلاوة بسرعتها الأصلية.) */
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var RK = 'muslim-rp-recent', LK = 'muslim-rp-last';
    function ld(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
    function sv(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
    function status(t) { var e = $('repeatAyahStatus'); if (e) e.textContent = t; }
    function sname(s) { try { return (typeof S !== 'undefined' && S[s - 1]) || ('سورة ' + s); } catch (e) { return 'سورة ' + s; } }
    function val(id) { var e = $(id); return e ? e.value : ''; }

    /* ---------- حفظ آخر النطاقات ---------- */
    function snap() { return { s: +val('repeatSurah'), f: +val('repeatFrom'), t: +val('repeatTo'), r: val('repeatReciter'), e: val('repeatEach'), g: val('repeatGapSel') }; }
    function remember() {
        var x = snap(); if (!x.s || !(x.f >= 1) || !(x.t >= x.f)) return;
        sv(LK, x);
        var l = ld(RK, []).filter(function (y) { return !(y.s === x.s && y.f === x.f && y.t === x.t && y.r === x.r); });
        l.unshift(x); sv(RK, l.slice(0, 8)); paintRecent();
    }
    function apply(x) {
        var s = $('repeatSurah'); if (!s) return;
        s.value = String(x.s); if (window.updateRepeatTo) updateRepeatTo();
        $('repeatFrom').value = x.f; $('repeatTo').value = x.t; if (window.updateRepeatTo) updateRepeatTo();
        var r = $('repeatReciter'); if (r && x.r != null && [].some.call(r.options, function (o) { return o.value === x.r; })) r.value = x.r;
        if (x.e && $('repeatEach')) $('repeatEach').value = x.e; if (x.g != null && $('repeatGapSel')) $('repeatGapSel').value = x.g;
    }
    function paintRecent() {
        var b = $('rpRecent'); if (!b) return;
        var l = ld(RK, []);
        if (!l.length) { b.innerHTML = '<div class="mini">لا توجد نطاقات محفوظة بعد؛ يُحفظ تلقائيًا كل نطاق تبدأ تكراره.</div>'; return; }
        b.innerHTML = '<div class="rpChips">' + l.map(function (x, i) {
            var rn = ''; var r = $('repeatReciter'); if (r) { var o = [].filter.call(r.options, function (q) { return q.value === x.r; })[0]; if (o) rn = o.textContent.split('—')[0].trim(); }
            return '<button type="button" data-rp="' + i + '">' + sname(x.s) + ' ' + x.f + (x.t > x.f ? '–' + x.t : '') + (rn ? ' · ' + rn : '') + '</button>';
        }).join('') + '</div><button type="button" class="rpClr" id="rpClr">مسح القائمة</button>';
        b.querySelectorAll('[data-rp]').forEach(function (n) { n.onclick = function () { apply(l[+n.dataset.rp]); status('تم ضبط النطاق. اضغط «بدء التكرار».'); }; });
        $('rpClr').onclick = function () { sv(RK, []); paintRecent(); };
    }
    /* ---------- مؤقت ---------- */
    var tmr = 0;
    function armTimer() {
        clearTimeout(tmr); var m = +val('rpTimer'); if (!m) return;
        tmr = setTimeout(function () { window.stopAyahRepeat && stopAyahRepeat(true); status('⏱️ انتهى المؤقت وتوقّف التكرار.'); }, m * 60000);
    }
    /* ---------- بحث القارئ ---------- */
    var all = null;
    function snapAll() { var sel = $('repeatReciter'); all = [].slice.call(sel.querySelectorAll('option')).map(function (o) { return { v: o.value, t: o.textContent }; }); }
    function filt() {
        var sel = $('repeatReciter'), q = (window.v120F ? v120F.norm(val('rpSearch')) : val('rpSearch').toLowerCase()).trim(); if (!sel || !all) return;
        var keep = sel.value, qs = q ? q.split(/\s+/) : [];
        var hit = all.filter(function (o) { var t = window.v120F ? v120F.norm(o.t) : o.t.toLowerCase(); return qs.every(function (w) { return t.indexOf(w) >= 0; }); });
        if (!hit.length && q && window.v120F) hit = all.filter(function (o) { return v120F.score(v120F.toks(q), [o.t]) > 0; });
        sel.innerHTML = hit.map(function (o) { return '<option value="' + o.v + '">' + o.t.replace(/</g, '&lt;') + '</option>'; }).join('') || '<option value="">لا نتائج</option>';
        if (hit.some(function (o) { return o.v === keep; })) sel.value = keep;
        var n = $('rpFound'); if (n) n.textContent = q ? hit.length + ' نتيجة' : '';
    }
    /* ---------- بناء الواجهة ---------- */
    function mount() {
        var sel = $('repeatReciter'), page = $('repeatAyah'); if (!sel || !page) return false;
        if (page.dataset.rp) return true;
        page.dataset.rp = '1';
        snapAll();
        var lab = sel.previousElementSibling;
        var sb = document.createElement('div'); sb.className = 'rpSearch';
        sb.innerHTML = '<input id="rpSearch" class="field" type="search" placeholder="🔍 ابحث عن قارئ…" autocomplete="off"><span class="mini" id="rpFound"></span>';
        sel.parentNode.insertBefore(sb, lab || sel);
        $('rpSearch').addEventListener('input', filt);
        var rc = document.createElement('div'); rc.className = 'rpBox';
        rc.innerHTML = '<div class="mini">⏱️ آخر ما كررتَه (اضغط للعودة إليه بسرعة)</div><div id="rpRecent"></div>';
        var pre = $('repeatPresets'); pre.parentNode.insertBefore(rc, pre.nextSibling);
        var ex = document.createElement('div'); ex.className = 'rpBox';
        ex.innerHTML = '<label class="mini">إيقاف تلقائي بعد</label><select id="rpTimer" class="field"><option value="0">بلا مؤقت</option><option value="5">5 دقائق</option><option value="10">10 دقائق</option><option value="15">15 دقيقة</option><option value="30">30 دقيقة</option><option value="60">ساعة</option></select>';
        var ctr = page.querySelector('.controls'); ctr.parentNode.insertBefore(ex, ctr);
        $('rpTimer').value = String(ld('muslim-rp-timer', 0));
        $('rpTimer').onchange = function () { sv('muslim-rp-timer', +this.value); };
        var L = ld(LK, null);
        if (L && L.r != null && [].some.call(sel.options, function (o) { return o.value === L.r; })) sel.value = L.r;
        paintRecent();
        return true;
    }
    /* ---------- التفاف على البدء والإيقاف ---------- */
    var _start = window.startAyahRepeat, _stop = window.stopAyahRepeat;
    window.startAyahRepeat = async function () {
        if (_stop) _stop(true); clearTimeout(tmr);
        remember();
        var r = _start ? await _start.apply(this, arguments) : null;
        armTimer();
        return r;
    };
    window.stopAyahRepeat = function (silent) { clearTimeout(tmr); if (_stop) _stop.apply(this, arguments); else if (!silent) status('⏹ تم إيقاف التكرار.'); };
    var n = 0, iv = setInterval(function () { if (mount() || ++n > 80) clearInterval(iv); }, 500);
    var _show = window.show;
    if (typeof _show === 'function') window.show = function (id) { var r = _show.apply(this, arguments); if (id === 'repeatAyah') setTimeout(function () { mount(); paintRecent(); }, 80); return r; };
})();
