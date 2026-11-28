(function () {
    'use strict';
    function $(i) { return document.getElementById(i); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function norm(s) { return String(s || '').replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ''); }
    function toast(m) { try {
        window.showToast ? window.showToast(m) : 0;
    }
    catch (e) { } }
    var K = 'muslim-v117-playlist';
    function LG(k, d) { try {
        var v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
    }
    catch (e) {
        return d;
    } }
    function LS(k, v) { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch (e) { } }
    function range(a, b, avail) {
        a = +a;
        b = +b;
        if (a > b) {
            var t = a;
            a = b;
            b = t;
        }
        var set = avail ? {} : null;
        if (avail)
            avail.forEach(function (x) { set[x] = 1; });
        var out = [];
        for (var i = a; i <= b; i++)
            if (!set || set[i])
                out.push(i);
        return out;
    }
    function chosen(order, avail) { var set = {}; avail.forEach(function (x) { set[x] = 1; }); var seen = {}, out = []; order.forEach(function (n) { n = +n; if (set[n] && !seen[n]) {
        seen[n] = 1;
        out.push(n);
    } }); return out; }
    var st = { on: false, seq: [], i: 0, reader: null, errs: 0, internal: false };
    function names() { try {
        return S;
    }
    catch (e) {
        return [];
    } }
    function availList() {
        var r = null;
        try {
            r = currentReader;
        }
        catch (e) { }
        return (r && r.surahList && r.surahList.length) ? r.surahList.slice() : Array.apply(null, { length: 114 }).map(function (_, i) { return i + 1; });
    }
    function curReader() { try {
        return currentReader;
    }
    catch (e) {
        return null;
    } }
    function sname(n) { return names()[n - 1] || ('سورة ' + n); }
    function playAt(i) {
        st.i = i;
        st.internal = true;
        try {
            if (typeof window.playSurah === 'function')
                window.playSurah(st.seq[i]);
        }
        finally {
            st.internal = false;
        }
        status();
    }
    function next() {
        if (!st.on)
            return;
        playAt((st.i + 1) % st.seq.length);
    }
    function start(seq) {
        if (!seq.length) {
            toast('اختر سورة واحدة على الأقل.');
            return;
        }
        st.on = true;
        st.seq = seq.slice();
        st.i = 0;
        st.reader = curReader();
        st.errs = 0;
        try {
            if (navigator.mediaSession)
                navigator.mediaSession.setActionHandler('nexttrack', next);
        }
        catch (e) { }
        playAt(0);
        status();
        toast('بدأ التشغيل المتتابع (' + seq.length + (seq.length === 1 ? ' سورة' : ' سورة') + ') — يتكرر حتى تضغط «إيقاف».');
    }
    function stop(silent) {
        if (!st.on)
            return;
        st.on = false;
        try {
            if (navigator.mediaSession)
                navigator.mediaSession.setActionHandler('nexttrack', null);
        }
        catch (e) { }
        status();
        if (!silent)
            toast('أُوقف التشغيل المتتابع.');
    }
    var css = '#v117Pl{margin:10px 0}#v117Pl .plBtn{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:12px 16px;font:inherit;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#176f7d,#1d8a5a);color:#fff}' +
        '#v117Pl .plPanel{display:none;margin-top:10px;padding:14px;border-radius:16px;background:rgba(127,127,127,.09);border:1px solid rgba(127,127,127,.18)}#v117Pl.open .plPanel{display:block}' +
        '#v117Pl .plTabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px}#v117Pl .plTab{border:0;border-radius:10px;padding:9px;font:inherit;cursor:pointer;background:rgba(127,127,127,.14);color:inherit}#v117Pl .plTab.on{background:#176f7d;color:#fff;font-weight:700}' +
        '#v117Pl .plRow{display:grid;grid-template-columns:1fr 1fr;gap:10px}#v117Pl label{font-size:13px;opacity:.85;display:block;margin-bottom:4px}#v117Pl select,#v117Pl input[type=search]{width:100%;font:inherit;padding:9px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:inherit;color:inherit}' +
        '#v117Pl .plGo{width:100%;margin-top:12px;border:0;border-radius:12px;padding:11px;font:inherit;font-weight:700;cursor:pointer;background:#c8a15b;color:#1b1405}' +
        '#v117Pl .plList{max-height:210px;overflow:auto;margin-top:8px;border-radius:10px;border:1px solid rgba(127,127,127,.18)}#v117Pl .plItem{display:flex;align-items:center;gap:8px;padding:8px 10px;border-bottom:1px solid rgba(127,127,127,.12);cursor:pointer}#v117Pl .plItem.sel{background:rgba(23,111,125,.15)}' +
        '#v117Pl .plChips{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 2px}#v117Pl .plChip{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;background:#176f7d;color:#fff;font-size:13px}#v117Pl .plChip b{opacity:.75;font-weight:400}#v117Pl .plChip button{border:0;background:none;color:#fff;cursor:pointer;font:inherit;padding:0}' +
        '#v117Pl .plNow{margin-top:10px;padding:10px 12px;border-radius:12px;background:rgba(29,138,90,.14);display:none;line-height:1.8}#v117Pl .plNow.on{display:block}#v117Pl .plNow button{border:0;border-radius:10px;padding:6px 12px;font:inherit;cursor:pointer;margin-inline-end:6px}' +
        '';
    var sel = [];
    var tab = 'range';
    function ensureCss() { if (document.getElementById('v117PlCss'))
        return; var s = document.createElement('style'); s.id = 'v117PlCss'; s.textContent = css; document.head.appendChild(s); }
    function build() {
        var host = $('readerProfile');
        if (!host || !host.parentNode)
            return;
        ensureCss();
        var box = $('v117Pl');
        if (!box) {
            box = document.createElement('div');
            box.id = 'v117Pl';
            host.parentNode.insertBefore(box, host.nextSibling);
        }
        var av = availList(), opts = av.map(function (n) { return '<option value="' + n + '">' + n + ' — ' + esc(sname(n)) + '</option>'; }).join('');
        var saved = LG(K, {}), r = curReader(), key = r && r.id != null ? String(r.id) : '';
        if (!sel.length && saved[key])
            sel = chosen(saved[key], av);
        box.innerHTML = '<button type="button" class="plBtn" id="v117PlToggle">🔁 تشغيل سور متتابعة</button>' +
            '<div class="plPanel"><div class="plTabs"><button type="button" class="plTab ' + (tab === 'range' ? 'on' : '') + '" data-t="range">نطاق سور</button><button type="button" class="plTab ' + (tab === 'pick' ? 'on' : '') + '" data-t="pick">سور أختارها</button></div>' +
            '<div id="v117PlRange" style="' + (tab === 'range' ? '' : 'display:none') + '"><div class="plRow"><div><label>من سورة</label><select id="v117PlFrom">' + opts + '</select></div><div><label>إلى سورة</label><select id="v117PlTo">' + opts + '</select></div></div><button type="button" class="plGo" id="v117PlGoRange">▶ ابدأ التشغيل المتكرر</button></div>' +
            '<div id="v117PlPick" style="' + (tab === 'pick' ? '' : 'display:none') + '"><input type="search" id="v117PlQ" placeholder="ابحث عن سورة…"><div class="plList" id="v117PlList"></div><div class="plChips" id="v117PlChips"></div><button type="button" class="plGo" id="v117PlGoPick">▶ ابدأ بهذا الترتيب</button><div style="text-align:left;margin-top:6px"><button type="button" id="v117PlClear" style="border:0;background:none;color:inherit;opacity:.7;cursor:pointer;font:inherit">مسح الاختيار</button></div></div>' +
            '<div class="plNow" id="v117PlNow"></div></div>';
        var to = $('v117PlTo');
        if (to && av.length)
            to.value = String(av[av.length - 1]);
        $('v117PlToggle').onclick = function () { box.classList.toggle('open'); };
        [].forEach.call(box.querySelectorAll('.plTab'), function (b) { b.onclick = function () { tab = b.getAttribute('data-t'); build(); box.classList.add('open'); }; });
        $('v117PlGoRange').onclick = function () { start(range($('v117PlFrom').value, $('v117PlTo').value, av)); };
        $('v117PlGoPick').onclick = function () { saveSel(av); start(chosen(sel, av)); };
        $('v117PlClear').onclick = function () { sel = []; drawPick(av); };
        $('v117PlQ').oninput = function () { drawPick(av); };
        drawPick(av);
        status();
    }
    function saveSel(av) { var r = curReader(), key = r && r.id != null ? String(r.id) : ''; if (!key)
        return; var s = LG(K, {}); s[key] = sel.slice(); LS(K, s); }
    function drawPick(av) {
        var q = norm(($('v117PlQ') || {}).value || ''), list = $('v117PlList'), chips = $('v117PlChips');
        if (!list)
            return;
        list.innerHTML = av.filter(function (n) { return !q || norm(sname(n)).indexOf(q) >= 0 || String(n) === q; }).map(function (n) {
            var on = sel.indexOf(n) >= 0;
            return '<div class="plItem ' + (on ? 'sel' : '') + '" data-n="' + n + '"><span style="opacity:.6;min-width:26px">' + n + '</span><b style="flex:1">' + esc(sname(n)) + '</b><span>' + (on ? '✓ ' + (sel.indexOf(n) + 1) : '＋') + '</span></div>';
        }).join('');
        [].forEach.call(list.querySelectorAll('.plItem'), function (el) { el.onclick = function () { var n = +el.getAttribute('data-n'), i = sel.indexOf(n); if (i >= 0)
            sel.splice(i, 1);
        else
            sel.push(n); drawPick(av); }; });
        chips.innerHTML = sel.map(function (n, i) { return '<span class="plChip"><b>' + (i + 1) + '</b>' + esc(sname(n)) + '<button type="button" data-r="' + i + '" aria-label="حذف">✕</button></span>'; }).join('') || '<span style="opacity:.6;font-size:13px">اضغط على السور بالترتيب الذي تريده (مثلًا: البقرة ثم الفاتحة ثم العلق).</span>';
        [].forEach.call(chips.querySelectorAll('button[data-r]'), function (b) { b.onclick = function () { sel.splice(+b.getAttribute('data-r'), 1); drawPick(av); }; });
    }
    function status() {
        var el = $('v117PlNow'), btn = $('v117PlToggle');
        if (btn)
            btn.textContent = st.on ? '⏹ التشغيل المتتابع يعمل الآن' : '🔁 تشغيل سور متتابعة';
        if (!el)
            return;
        if (!st.on) {
            el.className = 'plNow';
            el.innerHTML = '';
            return;
        }
        el.className = 'plNow on';
        el.innerHTML = '🔁 الآن: <b>' + esc(sname(st.seq[st.i])) + '</b> (' + (st.i + 1) + ' من ' + st.seq.length + ') — يعود للأولى بعد الأخيرة<br><button type="button" id="v117PlNext">⏭ التالية</button><button type="button" id="v117PlStop">⏹ إيقاف</button>';
        $('v117PlNext').onclick = next;
        $('v117PlStop').onclick = function () { stop(); };
    }
    function init() {
        var au = $('audio');
        if (!au)
            return;
        au.addEventListener('ended', function (e) {
            if (!st.on)
                return;
            e.stopImmediatePropagation();
            st.errs = 0;
            next();
        }, true);
        au.addEventListener('error', function () {
            if (!st.on || st.internal)
                return;
            st.errs++;
            if (st.errs >= st.seq.length) {
                toast('تعذّر تشغيل السور المختارة لهذا القارئ.');
                stop(true);
                return;
            }
            setTimeout(next, 700);
        });
        var ps = window.playSurah;
        if (typeof ps === 'function' && !ps.__pl) {
            var w = function () { if (!st.internal && st.on)
                stop(true); return ps.apply(this, arguments); };
            w.__pl = 1;
            window.playSurah = w;
        }
        var prof = $('readerProfile');
        if (prof) {
            var busy = false, mo = new MutationObserver(function () {
                if (busy)
                    return;
                busy = true;
                try {
                    if (st.on && st.reader && curReader() && curReader() !== st.reader)
                        stop(true);
                    if (!$('v117Pl') || !(curReader() && $('v117Pl').getAttribute('data-r') === String(curReader().id))) {
                        sel = [];
                        build();
                        var b = $('v117Pl');
                        if (b && curReader())
                            b.setAttribute('data-r', String(curReader().id));
                    }
                }
                catch (e) { }
                busy = false;
            });
            mo.observe(prof, { childList: true });
        }
    }
    window.v117Playlist = { range: range, chosen: chosen, start: start, stop: stop, next: next, state: function () { return st; }, norm: norm };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 700); });
    else
        setTimeout(init, 700);
})();
