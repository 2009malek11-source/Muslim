/* مركز الدعم الفني: بلاغات واقتراحات مجهولة تصل إلى المدير مباشرة (بلا حسابات) + روابط التواصل الرسمية.
   لا يرسل اسمًا ولا موقعًا. يُستخدم معرّف عشوائي محلي فقط لمنع التكرار والإساءة. أي فشل لا يمسّ باقي الموقع. */
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    var ctl = function () { return window.MuslimCtl && window.MuslimCtl.rpc ? window.MuslimCtl : null; };
    function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
    var CATS = [['mushaf', 'خطأ في المصحف'], ['audio', 'مشكلة في الصوت'], ['reciter', 'قارئ لا يعمل'], ['prayer', 'خطأ في مواقيت الصلاة'], ['design', 'مشكلة في التصميم'], ['slow', 'بطء'], ['other', 'ميزة لا تعمل / أخرى']];
    var SECS = [['', 'غير محدد'], ['home', 'الرئيسية'], ['mushaf', 'المصحف'], ['readers', 'القرّاء والتلاوات'], ['prayer', 'مواقيت الصلاة'], ['adhkar', 'الأذكار'], ['hadith', 'الأحاديث'], ['qibla', 'القبلة'], ['settings', 'الإعدادات']];
    var SCATS = [['feature', 'ميزة جديدة'], ['design', 'تصميم'], ['content', 'محتوى'], ['audio', 'صوت وقرّاء'], ['other', 'أخرى']];
    var ST = { new: 'جديد', study: 'قيد الدراسة', accepted: 'مقبول', done: 'نُفّذ' };
    var LINKS = [['✉️', 'mailto:al.mislim.malek@gmail.com', 'البريد'], ['✈️', 'https://t.me/Almuslim09', 'تيليجرام'], ['📷', 'https://www.instagram.com/al_muslim0001', 'إنستغرام'], ['🎵', 'https://www.tiktok.com/@al_muslim0001', 'تيك توك']];

    function select(opts) { var s = el('select', 'supIn'); opts.forEach(function (o) { var p = el('option', '', o[1]); p.value = o[0]; s.appendChild(p); }); return s; }
    function msg(box, t, ok) { box.textContent = t; box.className = 'supMsg ' + (ok ? 'ok' : 'bad'); }
    function offline(box) { msg(box, 'تعذّر الإرسال الآن (تحقق من الإنترنت). يمكنك مراسلتنا مباشرة عبر الروابط أدناه.', false); }
    function mapErr(box, e) { if (e && e.err === 'rate') msg(box, 'أرسلت عددًا كبيرًا مؤخرًا، حاول لاحقًا.', false); else if (e && e.err === 'invalid') msg(box, 'تأكد من كتابة نص كافٍ (٥ أحرف على الأقل).', false); else offline(box); }

    function ch0() {
        var ch = el('div', 'supChips');
    LINKS.forEach(function (l) { var a = el('a', 'supChip', l[0] + ' ' + l[2]); a.href = l[1]; a.title = l[2]; if (l[1].indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } ch.appendChild(a); });
    return ch;
    }
    function build(body) {
        body.textContent = '';
        var intro = el('div', 'supIntro', 'أرسل بلاغًا أو اقتراحًا للإدارة مباشرةً بدون أي حساب. الرسالة تصلنا باسم «مجهول»، ولا يُرسل اسمك أو موقعك.');
        body.appendChild(ch0());
        body.appendChild(intro);
        var dv = el('div', 'supBox'); dv.appendChild(el('h5', '', 'جهازك'));
        var dn = el('div', 'supRow', 'رقم جهازك: …'), di = el('div', 'supRow'), cp = el('button', 'supLink', 'نسخ الرقم والمعرّف');
        dv.appendChild(dn); dv.appendChild(di); dv.appendChild(cp); body.appendChild(dv);
        (function () {
            var c = ctl(); if (!c) { dn.textContent = 'رقم جهازك غير متاح دون اتصال'; return; }
            var vid = c.vid(); di.textContent = 'المعرّف: ' + (vid || '—'); var ser = '';
            c.rpc('my_device', { p_vid: vid }).then(function (j) { if (j && j.ok) { ser = String(j.serial); dn.textContent = 'رقم جهازك: #' + ser; } else dn.textContent = 'رقم جهازك يظهر بعد أول زيارة مسجّلة (أعد فتح الصفحة بعد قليل).'; }).catch(function () { dn.textContent = 'تعذّر جلب رقم الجهاز الآن.'; });
            cp.onclick = function () { var t = (ser ? '#' + ser + ' ' : '') + (vid || ''); try { navigator.clipboard.writeText(t).then(function () { cp.textContent = 'تم النسخ ✔'; }); } catch (e) { cp.textContent = t; } };
        })();

        /* --- بلاغ --- */
        var r = el('div', 'supBox'); r.appendChild(el('h4', '', 'الإبلاغ عن مشكلة'));
        var cs = select(CATS), ss = select(SECS), tx = el('textarea', 'supIn'), sb = el('button', 'stgBtn', 'إرسال البلاغ'), rm = el('div', 'supMsg');
        tx.rows = 4; tx.maxLength = 600; tx.placeholder = 'اشرح المشكلة باختصار (مثال: الآية ٥ في الصفحة ٢٠ بها خلل)';
        sb.type = 'button';
        sb.onclick = function () {
            var c = ctl(); if (!c) return offline(rm);
            if (tx.value.trim().length < 5) return mapErr(rm, { err: 'invalid' });
            sb.disabled = true;
            c.rpc('submit_report', { p_vid: c.vid(), p_cat: cs.value, p_section: ss.value, p_msg: tx.value.trim() }).then(function (j) {
                sb.disabled = false; if (j && j.ok) { tx.value = ''; msg(rm, 'وصل بلاغك للإدارة. رقم المتابعة: ' + j.code + ' — احتفظ به لقراءة الرد.', true); keep(j.code); codeIn.value = j.code; } else mapErr(rm, j);
            }).catch(function () { sb.disabled = false; offline(rm); });
        };
        [lab('نوع المشكلة', cs), lab('القسم', ss), lab('التفاصيل', tx), sb, rm].forEach(function (x) { r.appendChild(x); }); body.appendChild(r);

        /* --- اقتراح --- */
        var g = el('div', 'supBox'); g.appendChild(el('h4', '', 'اقتراح تحسين'));
        var ti = el('input', 'supIn'), td = el('textarea', 'supIn'), sc = select(SCATS), sg = el('button', 'stgBtn', 'إرسال الاقتراح'), gm = el('div', 'supMsg'), list = el('div', 'supList');
        ti.maxLength = 120; ti.placeholder = 'عنوان الاقتراح'; td.rows = 3; td.maxLength = 600; td.placeholder = 'تفاصيل (اختياري)'; sg.type = 'button';
        sg.onclick = function () {
            var c = ctl(); if (!c) return offline(gm);
            if (ti.value.trim().length < 4) return mapErr(gm, { err: 'invalid' });
            sg.disabled = true;
            c.rpc('submit_suggestion', { p_vid: c.vid(), p_title: ti.value.trim(), p_body: td.value.trim(), p_cat: sc.value }).then(function (j) {
                sg.disabled = false; if (j && j.ok) { ti.value = ''; td.value = ''; msg(gm, j.merged ? 'اقتراح مشابه موجود، أضفنا صوتك إليه.' : 'وصل اقتراحك، شكرًا لك.', true); refresh(); } else mapErr(gm, j);
            }).catch(function () { sg.disabled = false; offline(gm); });
        };
        [lab('العنوان', ti), lab('التصنيف', sc), lab('التفاصيل', td), sg, gm, el('h5', '', 'اقتراحات الزوار — صوّت لما يعجبك'), list].forEach(function (x) { g.appendChild(x); }); body.appendChild(g);
        function refresh() {
            var c = ctl(); if (!c) return;
            c.rpc('list_suggestions', { p_vid: c.vid() }).then(function (a) {
                list.textContent = ''; if (!a || !a.length) { list.appendChild(el('small', '', 'لا اقتراحات بعد — كن أول من يقترح.')); return; }
                a.slice(0, 15).forEach(function (s) {
                    var row = el('div', 'supRow'), t = el('div', 'supT'); t.appendChild(el('b', '', s.t)); if (s.s && s.s !== 'new') t.appendChild(el('small', 'supSt', ST[s.s] || ''));
                    var v = el('button', 'supVote' + (s.m ? ' on' : ''), '▲ ' + s.v); v.type = 'button'; v.disabled = !!s.m; v.setAttribute('aria-label', 'تصويت');
                    v.onclick = function () { v.disabled = true; c.rpc('vote_suggestion', { p_vid: c.vid(), p_id: s.id }).then(function () { refresh(); }).catch(function () { v.disabled = false; }); };
                    row.appendChild(t); row.appendChild(v); list.appendChild(row);
                });
            }).catch(function () { list.textContent = ''; list.appendChild(el('small', '', 'تعذّر تحميل الاقتراحات الآن.')); });
        }
        body.__refresh = refresh; refresh();

        /* --- متابعة بلاغ برقمه --- */
        var tk = el('div', 'supBox'); tk.appendChild(el('h4', '', 'متابعة بلاغ'));
        var codeIn = el('input', 'supIn'), tb = el('button', 'stgBtn', 'عرض الحالة والردود'), tbox = el('div', 'supList'), tm = el('div', 'supMsg');
        codeIn.placeholder = 'رقم المتابعة (MS-XXXXXXXXXXXXXXXX)'; codeIn.dir = 'ltr'; codeIn.maxLength = 30; tb.type = 'button';
        var mine = codes(); if (mine.length) codeIn.value = mine[mine.length - 1];
        var STN = { new: 'جديد', reviewing: 'قيد المراجعة', waiting_user: 'بانتظار ردّك', fixing: 'قيد الإصلاح', fixed: 'تم الحل', rejected: 'مرفوض' };
        function track() {
            var c = ctl(); if (!c) return offline(tm); var code = codeIn.value.trim();
            if (code.length < 10) return msg(tm, 'أدخل رقم المتابعة كاملًا.', false);
            c.rpc('track_report', { p_code: code }).then(function (j) {
                tbox.textContent = ''; if (!j || !j.ok) return msg(tm, 'لا يوجد بلاغ بهذا الرقم.', false); tm.textContent = '';
                tbox.appendChild(el('div', 'supT', 'الحالة: ' + (STN[j.status] || j.status))); tbox.appendChild(el('small', 'supSt', 'بلاغك: ' + j.msg));
                if (j.sol) tbox.appendChild(el('div', 'supT', 'الحل: ' + j.sol));
                (j.thread || []).forEach(function (m) { tbox.appendChild(el('div', 'supBub ' + (m.a ? 'adm' : 'me'), (m.a ? 'الإدارة: ' : 'أنت: ') + m.b)); });
                var rb = el('textarea', 'supIn'), rs = el('button', 'stgBtn', 'إرسال رد'); rb.rows = 2; rb.maxLength = 800; rs.type = 'button';
                rs.onclick = function () { if (!rb.value.trim()) return; rs.disabled = true; c.rpc('reply_report', { p_code: code, p_body: rb.value.trim() }).then(function (r) { rs.disabled = false; if (r && r.ok) track(); else mapErr(tm, r); }).catch(function () { rs.disabled = false; offline(tm); }); };
                tbox.appendChild(rb); tbox.appendChild(rs);
            }).catch(function () { offline(tm); });
        }
        tb.onclick = track; [codeIn, tb, tm, tbox].forEach(function (x) { tk.appendChild(x); }); body.appendChild(tk);

        /* --- رسائل الإدارة (اختياري) --- */
        var ib = el('div', 'supBox'); ib.appendChild(el('h4', '', 'رسائل الإدارة لجهازي'));
        var on = el('button', 'stgBtn', ''), il = el('div', 'supList'), im = el('div', 'supMsg'), ri = el('textarea', 'supIn'), rsb = el('button', 'stgBtn', 'إرسال للإدارة');
        ri.rows = 2; ri.maxLength = 600; ri.placeholder = 'اكتب رسالة للإدارة'; on.type = 'button'; rsb.type = 'button';
        function inboxOn() { try { return localStorage.getItem('muslim-inbox') === '1'; } catch (e) { return false; } }
        function paint() { on.textContent = inboxOn() ? 'إيقاف استقبال رسائل الإدارة على هذا الجهاز' : 'السماح للإدارة بمراسلة هذا الجهاز'; }
        on.onclick = function () { try { localStorage.setItem('muslim-inbox', inboxOn() ? '0' : '1'); } catch (e) { } paint(); loadIn(); };
        function loadIn() {
            il.textContent = ''; var c = ctl(); if (!c || !inboxOn()) { il.appendChild(el('small', '', 'فعّل الاستقبال لتصلك رسائل الإدارة هنا. يُستخدم معرّف عشوائي لهذا الجهاز فقط، بلا اسم ولا حساب.')); return; }
            c.rpc('visitor_inbox', { p_vid: c.vid() }).then(function (a) { if (!a || !a.length) { il.appendChild(el('small', '', 'لا رسائل بعد.')); return; } a.forEach(function (m) { il.appendChild(el('div', 'supBub ' + (m.a ? 'adm' : 'me'), (m.a ? (m.t ? m.t + ' — ' : '') : 'أنت: ') + m.b)); }); }).catch(function () { il.appendChild(el('small', '', 'تعذّر التحميل الآن.')); });
        }
        rsb.onclick = function () { var c = ctl(); if (!c) return offline(im); if (ri.value.trim().length < 2) return mapErr(im, { err: 'invalid' }); rsb.disabled = true; c.rpc('visitor_send', { p_vid: c.vid(), p_body: ri.value.trim() }).then(function (j) { rsb.disabled = false; if (j && j.ok) { ri.value = ''; msg(im, 'وصلت رسالتك.', true); loadIn(); } else mapErr(im, j); }).catch(function () { rsb.disabled = false; offline(im); }); };
        paint(); [on, il, ri, rsb, im].forEach(function (x) { ib.appendChild(x); }); body.appendChild(ib); loadIn();

        body.appendChild(el('small', 'supPriv', 'الخصوصية: يُحفظ معرّف عشوائي في متصفحك فقط لمنع التكرار وتصويت الشخص مرة واحدة. لا اسم ولا حساب. لحل المشكلات تُسجَّل للإدارة معلومات جهازك (النوع والمتصفح والشبكة وعنوان IP ومنطقتك التقريبية بدقة نحو ١١ كم وليس موقعك الدقيق) وأسماء الأزرار التي تضغطها ومدة استماعك (وليس ما تكتبه)، وتُحذف تلقائيًا بعد ٤ أيام. يمكنك إيقاف ذلك من الإعدادات ← «إحصاءات مجهولة». أعطِ رقم جهازك للإدارة عند الحاجة. يُفقد المعرّف إن مسحت بيانات المتصفح أو غيّرت الجهاز.'));
    }
    function codes() { try { return JSON.parse(localStorage.getItem('muslim-rep-codes') || '[]'); } catch (e) { return []; } }
    function keep(c) { try { var a = codes().filter(function (x) { return x !== c; }); a.push(c); localStorage.setItem('muslim-rep-codes', JSON.stringify(a.slice(-10))); } catch (e) { } }
    function lab(t, x) { var d = el('label', 'supLab'); d.appendChild(el('span', '', t)); d.appendChild(x); return d; }

    function mount() {
        var s = $('settings'); if (!s) return;
        var d = $('stgcat-support');
        if (!d) {
            d = document.createElement('details'); d.className = 'stgCat'; d.id = 'stgcat-support';
            var sm = el('summary'); sm.appendChild(el('span', 'ci', '🛟')); sm.appendChild(document.createTextNode('مركز الدعم الفني')); sm.appendChild(el('span', 'cs', '▾'));
            var b = el('div', 'stgCatBody'), gr = el('div', 'stgGroup open'); b.appendChild(gr); d.appendChild(sm); d.appendChild(b);
            var anchor = $('v44SettingsCard'); if (anchor && anchor.parentNode === s) s.insertBefore(d, anchor); else s.appendChild(d);
            d.addEventListener('toggle', function () { if (d.open && !gr.__built) { gr.__built = 1; build(gr); } else if (d.open && gr.__refresh) gr.__refresh(); });
        }
    }
    var tm = 0;
    function sched() { clearTimeout(tm); tm = setTimeout(mount, 200); }
    function boot() { mount(); var s = $('settings'); if (s) { try { new MutationObserver(sched).observe(s, { childList: true }); } catch (e) { } } setInterval(mount, 3000); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.MuslimSupport = { open: function () { if (window.v123Settings) window.v123Settings('support'); } };
})();
