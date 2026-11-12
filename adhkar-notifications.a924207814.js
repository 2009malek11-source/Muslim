/* adhkar-notifications.js — جدول الأذكار المستقل + مزوّد أحداثه
 * كل صف: اسم التذكير، وقته، نوع الذكر، حالة التفعيل، تكرار الإشعار. ويظهر اسم الذكر الصحيح في الإشعار.
 * الحفظ: IndexedDB (مفتاح kv:adhkar) + نسخة localStorage.
 */
(function () {
    'use strict';
    var MN = window.MuslimNotify = window.MuslimNotify || {};
    var LSK = 'muslim-notify-adhkar-v1';
    var PRAYERS = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    var DAYS = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];                 // الأحد=0 … السبت=6
    var DAYN = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    var ALL = [0, 1, 2, 3, 4, 5, 6];
    // type → {نص الإشعار، الوجهة داخل التطبيق، فئة الأذكار في التطبيق}
    var TYPES = {
        morning: { label: 'أذكار الصباح', title: 'حان وقت أذكار الصباح', body: 'ابدأ يومك بذكر الله ﷻ', open: 'adhkar-morning', cat: 'صباح' },
        evening: { label: 'أذكار المساء', title: 'حان وقت أذكار المساء', body: 'اختم نهارك بذكر الله ﷻ', open: 'adhkar-evening', cat: 'مساء' },
        sleep: { label: 'أذكار النوم', title: 'حان وقت أذكار النوم', body: 'نم على ذكر الله ﷻ', open: 'adhkar-sleep', cat: 'نوم' },
        after: { label: 'أذكار ما بعد الصلاة', title: 'لا تنسَ أذكار ما بعد الصلاة', body: 'سبّح وحمّد وكبّر دبر كل صلاة', open: 'adhkar-after', cat: 'بعد الصلاة' },
        quran: { label: 'تذكير القرآن', title: 'حان وقت وردك من القرآن', body: 'اقرأ ولو صفحة من كتاب الله', open: 'quran', cat: null },
        wake: { label: 'أذكار الاستيقاظ', title: 'حان وقت أذكار الاستيقاظ', body: 'الحمد لله الذي أحيانا بعد ما أماتنا', open: 'adhkar-wake', cat: 'استيقاظ' },
        istighfar: { label: 'الاستغفار', title: 'حان وقت الاستغفار', body: 'أستغفر الله وأتوب إليه', open: 'adhkar-istighfar', cat: 'استغفار' },
        mosque: { label: 'دعاء المسجد', title: 'تذكير بأذكار المسجد', body: 'ادعُ بدعاء دخول المسجد والخروج منه', open: 'adhkar-mosque', cat: 'مسجد' },
        travel: { label: 'دعاء السفر', title: 'تذكير بدعاء السفر', body: 'سبحان الذي سخّر لنا هذا', open: 'adhkar-travel', cat: 'سفر' },
        custom: { label: 'تذكير مخصص', title: '', body: 'ذكّر نفسك بالله ﷻ', open: 'adhkar', cat: null }
    };
    function mk(id, name, type, when, enabled, extra) { var o = { id: id, name: name, type: type, when: when, enabled: enabled, repeat: { days: ALL.slice(), again: 0 } }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
    function defaults() {
        var l = [
            mk('morning', 'أذكار الصباح', 'morning', { mode: 'after', prayer: 'fajr', min: 30 }, true),
            mk('evening', 'أذكار المساء', 'evening', { mode: 'after', prayer: 'asr', min: 15 }, true),
            mk('sleep', 'أذكار النوم', 'sleep', { mode: 'fixed', hm: '22:30' }, true),
            mk('quran', 'تذكير القرآن', 'quran', { mode: 'fixed', hm: '21:00' }, true)
        ];
        Object.keys(PRAYERS).forEach(function (k) { l.push(mk('after-' + k, 'أذكار بعد صلاة ' + PRAYERS[k], 'after', { mode: 'after', prayer: k, min: 20 }, false, { prayer: k })); });
        return l;
    }

    var list = null;
    function sane(l) {
        if (!Array.isArray(l)) return null;
        return l.filter(function (x) { return x && x.id && x.when; }).map(function (x) {
            x.repeat = x.repeat || { days: ALL.slice(), again: 0 };
            if (!Array.isArray(x.repeat.days) || !x.repeat.days.length) x.repeat.days = ALL.slice();
            x.repeat.again = [0, 5, 10, 15, 30].indexOf(+x.repeat.again) >= 0 ? +x.repeat.again : 0;
            if (!TYPES[x.type]) x.type = 'custom';
            x.name = String(x.name || TYPES[x.type].label).slice(0, 60);
            if (x.when.mode === 'fixed') x.when.hm = /^\d{1,2}:\d{2}$/.test(x.when.hm || '') ? x.when.hm : '09:00';
            else { x.when.min = Math.max(0, Math.min(240, parseInt(x.when.min, 10) || 0)); if (!PRAYERS[x.when.prayer]) x.when.prayer = 'fajr'; }
            return x;
        });
    }
    function load() {
        try { var r = localStorage.getItem(LSK); if (r) { var l = sane(JSON.parse(r)); if (l && l.length) return l; } } catch (e) { }
        return defaults();
    }
    function save() {
        try { localStorage.setItem(LSK, JSON.stringify(list)); } catch (e) { }
        try { if (MN.db) MN.db.set('adhkar', list).catch(function () { }); } catch (e) { }
        if (MN.reschedule) MN.reschedule('adhkar');
    }
    list = load();

    function eventsFor(item, ctx) {
        var out = [], ty = TYPES[item.type] || TYPES.custom;
        ctx.days.forEach(function (off) {
            var n = new Date(), date = new Date(n.getFullYear(), n.getMonth(), n.getDate() + off);
            if (item.repeat.days.indexOf(date.getDay()) < 0) return;
            var T = null;
            if (item.when.mode === 'fixed') { var p = item.when.hm.split(':'); T = new Date(date.getFullYear(), date.getMonth(), date.getDate(), +p[0], +p[1], 0).getTime(); }
            else {
                var t = MN.times(date); if (!t || !t[item.when.prayer]) return;
                T = t[item.when.prayer].getTime() + (item.when.mode === 'before' ? -1 : 1) * item.when.min * 60000;
            }
            var pr = item.prayer ? PRAYERS[item.prayer] : '';
            var title = item.type === 'after' && pr ? 'لا تنسَ أذكار ما بعد صلاة ' + pr : (item.type === 'custom' ? 'حان وقت ' + item.name : ty.title);
            var body = item.type === 'custom' ? ty.body : ty.body;
            var ymd = MN.ymd(date), id = 'adhkar:' + item.id + ':' + ymd + ':' + Math.round(T / 60000);
            out.push({ id: id, t: T, kind: item.type === 'quran' ? 'quran' : 'adhkar', key: item.id, title: title, body: body, open: ty.open, audio: null });
            if (item.repeat.again > 0) out.push({ id: id + ':again', t: T + item.repeat.again * 60000, kind: item.type === 'quran' ? 'quran' : 'adhkar', key: item.id, title: 'تذكير: ' + title, body: body, open: ty.open, audio: null });
        });
        return out;
    }
    MN.registerProvider('adhkar', {
        build: function (ctx) {
            var out = [];
            list.forEach(function (it) {
                if (!it.enabled) return;
                if (it.when.mode !== 'fixed' && !MN.hasLocation()) return;
                out = out.concat(eventsFor(it, ctx));
            });
            return out;
        }
    });

    /* ----- واجهة القسم داخل الإعدادات ----- */
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function whenText(w) { return w.mode === 'fixed' ? 'الساعة ' + w.hm : (w.mode === 'before' ? 'قبل صلاة ' : 'بعد صلاة ') + PRAYERS[w.prayer] + ' بـ ' + w.min + ' دقيقة'; }
    function renderInto(box) {
        if (!box) return;
        var h = '<div class="mnAd">';
        list.forEach(function (it, i) {
            var w = it.when;
            h += '<div class="mnAdRow" data-i="' + i + '"><div class="mnAdTop"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-f="enabled"' + (it.enabled ? ' checked' : '') + '> <b>' + esc(it.name) + '</b></label>' +
                (it.id.indexOf('c-') === 0 ? '<button type="button" class="stgBtn" data-f="del">🗑</button>' : '') + '</div>' +
                '<small style="opacity:.8">' + esc((TYPES[it.type] || TYPES.custom).label) + ' — ' + esc(whenText(w)) + '</small>' +
                '<div class="line"><select data-f="mode"><option value="fixed"' + (w.mode === 'fixed' ? ' selected' : '') + '>وقت ثابت</option><option value="after"' + (w.mode === 'after' ? ' selected' : '') + '>بعد صلاة</option><option value="before"' + (w.mode === 'before' ? ' selected' : '') + '>قبل صلاة</option></select>' +
                (w.mode === 'fixed' ? '<input type="time" data-f="hm" value="' + esc(w.hm) + '">' :
                    '<select data-f="prayer">' + Object.keys(PRAYERS).map(function (k) { return '<option value="' + k + '"' + (w.prayer === k ? ' selected' : '') + '>' + PRAYERS[k] + '</option>'; }).join('') + '</select><input type="number" data-f="min" min="0" max="240" value="' + w.min + '" style="width:70px"> دقيقة') + '</div>' +
                '<div class="line"><span class="mnDays">' + DAYS.map(function (d, di) { return '<label title="' + DAYN[di] + '"><input type="checkbox" data-f="day" data-d="' + di + '"' + (it.repeat.days.indexOf(di) >= 0 ? ' checked' : '') + '><span>' + d + '</span></label>'; }).join('') + '</span>' +
                '<select data-f="again"><option value="0"' + (it.repeat.again === 0 ? ' selected' : '') + '>بلا إعادة</option>' + [5, 10, 15, 30].map(function (m) { return '<option value="' + m + '"' + (it.repeat.again === m ? ' selected' : '') + '>إعادة بعد ' + m + ' د</option>'; }).join('') + '</select></div></div>';
        });
        h += '<div class="mnAdRow"><b>＋ إضافة تذكير</b><div class="line"><input type="text" id="mnAdName" placeholder="اسم التذكير" maxlength="40"><select id="mnAdType">' + Object.keys(TYPES).map(function (k) { return '<option value="' + k + '">' + TYPES[k].label + '</option>'; }).join('') + '</select><input type="time" id="mnAdTime" value="09:00"><button type="button" class="stgBtn" id="mnAdAdd">إضافة</button></div></div></div>';
        box.innerHTML = h;
        box.onchange = function (ev) {
            var t = ev.target, row = t.closest && t.closest('.mnAdRow'); if (!row || row.getAttribute('data-i') == null) return;
            var it = list[+row.getAttribute('data-i')], f = t.getAttribute('data-f'); if (!it) return;
            if (f === 'enabled') it.enabled = t.checked;
            else if (f === 'mode') { it.when.mode = t.value; if (t.value === 'fixed') it.when.hm = it.when.hm || '09:00'; else { it.when.prayer = it.when.prayer || 'fajr'; it.when.min = it.when.min || 0; } }
            else if (f === 'hm') it.when.hm = t.value || '09:00';
            else if (f === 'prayer') it.when.prayer = t.value;
            else if (f === 'min') it.when.min = parseInt(t.value, 10) || 0;
            else if (f === 'day') { var d = +t.getAttribute('data-d'), a = it.repeat.days, ix = a.indexOf(d); if (t.checked && ix < 0) a.push(d); if (!t.checked && ix >= 0) a.splice(ix, 1); if (!a.length) a.push(d); }
            else if (f === 'again') it.repeat.again = +t.value;
            list = sane(list); save(); renderInto(box);
        };
        box.onclick = function (ev) {
            var t = ev.target;
            if (t.getAttribute && t.getAttribute('data-f') === 'del') { var row = t.closest('.mnAdRow'); list.splice(+row.getAttribute('data-i'), 1); save(); renderInto(box); }
            if (t.id === 'mnAdAdd') {
                var type = document.getElementById('mnAdType').value, nm = (document.getElementById('mnAdName').value || '').trim() || TYPES[type].label, tm = document.getElementById('mnAdTime').value || '09:00';
                list.push(mk('c-' + Date.now(), nm, type, { mode: 'fixed', hm: tm }, true));
                list = sane(list); save(); renderInto(box);
            }
        };
    }
    // فتح الوجهة داخل التطبيق عند النقر على إشعار الأذكار (adhkar-morning… إلخ)
    function openTarget(page) {
        var m = /^adhkar-(\w+)$/.exec(page || ''); if (!m) return false;
        var key = { morning: 'صباح', evening: 'مساء', sleep: 'نوم', after: 'بعد الصلاة', wake: 'استيقاظ', istighfar: 'استغفار', mosque: 'مسجد', travel: 'سفر' }[m[1]];
        try { if (typeof show === 'function') show('adhkar'); if (key && typeof renderAdhkar === 'function') renderAdhkar(key); return true; } catch (e) { return false; }
    }
    if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', function (ev) { var d = ev.data || {}; if (d.type === 'open' && d.page) openTarget(d.page); });
    window.addEventListener('load', function () {
        try { var o = new URLSearchParams(location.search).get('open'); if (o && /^adhkar-(evening|sleep|after|wake|istighfar|mosque|travel)$/.test(o)) setTimeout(function () { openTarget(o); }, 1500); } catch (e) { }
    });
    // استعادة من IndexedDB إن فُقدت نسخة localStorage
    window.addEventListener('load', function () { setTimeout(function () { try { if (!localStorage.getItem(LSK) && MN.db) MN.db.get('adhkar').then(function (l) { l = sane(l); if (l && l.length) { list = l; try { localStorage.setItem(LSK, JSON.stringify(list)); } catch (e) { } if (MN.reschedule) MN.reschedule('adhkar-restore'); } }).catch(function () { }); } catch (e) { } }, 1200); });

    window.MuslimAdhkar = { list: function () { return list; }, TYPES: TYPES, renderInto: renderInto, save: save, openTarget: openTarget };
})();
