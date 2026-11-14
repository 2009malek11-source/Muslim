(function () {
    'use strict';
    var ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    var NAMES = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function utc(d) { return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z'; }
    function floating(y, m, d, hh, mm) { return y + pad(m) + pad(d) + 'T' + pad(hh) + pad(mm) + '00'; }
    function esc(s) { return String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
    function fold(line) {
        var enc = new TextEncoder(), dec = new TextDecoder(), b = enc.encode(line);
        if (b.length <= 75)
            return line;
        var out = [], i = 0, first = true;
        while (i < b.length) {
            var lim = first ? 75 : 74, end = Math.min(b.length, i + lim);
            if (end < b.length) {
                while (end > i && (b[end] & 0xC0) === 0x80)
                    end--;
            }
            out.push((first ? '' : ' ') + dec.decode(b.subarray(i, end)));
            i = end;
            first = false;
        }
        return out.join('\r\n');
    }
    function vevent(o) {
        var L = ['BEGIN:VEVENT', 'UID:' + o.uid, 'DTSTAMP:' + o.stamp, 'DTSTART' + (o.floating ? ':' : ':') + o.start, 'DTEND:' + o.end,
            'SUMMARY:' + esc(o.summary), 'DESCRIPTION:' + esc(o.desc || o.summary), 'CATEGORIES:المسلم', 'TRANSP:TRANSPARENT', 'STATUS:CONFIRMED',
            'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(o.summary), 'TRIGGER:PT0S', 'END:VALARM', 'END:VEVENT'];
        return L.map(fold).join('\r\n');
    }
    function build(opt) {
        var days = Math.max(1, Math.min(90, opt.days || 30)), c = opt.cfg, now = opt.now || new Date(), stamp = utc(now), ev = [];
        var base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        for (var di = 0; di < days; di++) {
            var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + di), ds = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()), t = opt.timesFor(d);
            ORDER.forEach(function (k) {
                if (!t || !t[k] || !c.on[k])
                    return;
                var at = t[k].getTime(), nm = NAMES[k];
                function add(kind, ms, summary, desc, len) {
                    var s = new Date(ms), e = new Date(ms + (len || 5) * 60000);
                    ev.push(vevent({ uid: 'muslim-' + kind + '-' + k + '-' + ds + '@muslim', stamp: stamp, start: utc(s), end: utc(e), summary: summary, desc: desc }));
                }
                if (k === 'sunrise') {
                    add('at', at, 'الشروق', 'طلعت الشمس — وقت صلاة الضحى يبدأ بعد نحو 15 دقيقة.');
                    return;
                }
                if (c.before > 0)
                    add('before', at - c.before * 60000, 'اقترب وقت ' + nm, 'بقي على أذان ' + nm + ' ' + c.before + ' دقيقة.');
                add('at', at, 'حان وقت ' + nm, 'حان الآن موعد أذان ' + nm + ' بحسب موقعك.');
                var iq = c.iqamaOf ? c.iqamaOf(k) : c.iqama;
                if (iq > 0)
                    add('iqama', at + iq * 60000, 'إقامة صلاة ' + nm, 'حان وقت إقامة صلاة ' + nm + '.');
                if (c.after > 0)
                    add('after', at + c.after * 60000, 'مضى على ' + nm + ' ' + c.after + ' دقيقة', 'إن لم تصلِّ ' + nm + ' فبادر بها قبل خروج وقتها.');
            });
            (opt.deeds || []).forEach(function (z) {
                if (z.days && z.days.length && z.days.indexOf(d.getDay()) < 0)
                    return;
                var p = String(z.time || '').split(':'), hh = +p[0], mm = +p[1];
                if (!(hh >= 0 && hh < 24 && mm >= 0 && mm < 60))
                    return;
                var e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm + 5);
                ev.push(vevent({ uid: 'muslim-deed-' + String(z.id).replace(/[^\w-]/g, '') + '-' + ds + '@muslim', stamp: stamp, floating: true,
                    start: floating(d.getFullYear(), d.getMonth() + 1, d.getDate(), hh, mm), end: floating(e.getFullYear(), e.getMonth() + 1, e.getDate(), e.getHours(), e.getMinutes()),
                    summary: 'حان وقت: ' + (z.t || 'تذكير'), desc: z.b || '' }));
            });
        }
        return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Muslim//Prayer Times//AR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
            'X-WR-CALNAME:مواقيت الصلاة — المسلم', 'X-WR-TIMEZONE:' + (opt.tz || 'UTC')].map(fold).concat(ev, ['END:VCALENDAR']).join('\r\n') + '\r\n';
    }
    function toast(m) { try {
        window.showToast ? window.showToast(m) : alert(m);
    }
    catch (e) { } }
    function download(text, name) {
        var blob = new Blob([text], { type: 'text/calendar;charset=utf-8' });
        var file = null;
        try {
            file = new File([blob], name, { type: 'text/calendar' });
        }
        catch (e) { }
        var ios = /iPad|iPhone|iPod/.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        var standalone = !!(navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches));
        if (ios && !standalone) {            // آيفون داخل Safari: افتح الملف مباشرة فتظهر شاشة «إضافة أحداث» من النظام نفسه
            var u = URL.createObjectURL(blob);
            var w = null; try { w = window.open(u, '_blank'); } catch (e) { }
            if (!w) location.href = u;
            return Promise.resolve();
        }
        if (ios && file && navigator.canShare && navigator.canShare({ files: [file] })) {
            return navigator.share({ files: [file], title: 'مواقيت الصلاة — المسلم' }).catch(function () { });
        }
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
        return Promise.resolve();
    }
    function generate(days) {
        var P = window.v107Prayer;
        if (!P || !P.timesFor) {
            toast('افتح «مواقيت الصلاة» أولًا.');
            return null;
        }
        var loc = null;
        try {
            loc = P.getLoc();
        }
        catch (e) { }
        if (!loc || !isFinite(loc.lat)) {
            toast('حدّد موقعك من صفحة «مواقيت الصلاة» أولًا ثم أعد المحاولة.');
            return null;
        }
        var cfg = P.cfg(), tz = 'UTC';
        try {
            tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        }
        catch (e) { }
        var ns = window.MuslimNotify && MuslimNotify.settings && MuslimNotify.settings.get();
        var pcfg = Object.assign({}, cfg);                      // نفس إعدادات «الأذان والإشعارات» حتى يطابق التقويم ما اخترته
        if (ns) { pcfg.before = ns.before.enabled ? ns.before.minutes : 0; pcfg.iqamaOf = function (k) { var q = ns.iqama.perPrayer[k]; return ns.iqama.enabled && q && q.on ? q.min : 0; }; }
        return build({ days: days, tz: tz, cfg: pcfg, deeds: window.__v115Deeds || [], timesFor: function (d) { return P.timesFor(d, { lat: loc.lat, lon: loc.lon, elev: loc.elev || 0 }, cfg); } });
    }
    function open() {
        var old = document.getElementById('v117CalBox');
        if (old)
            old.remove();
        var el = document.createElement('div');
        el.id = 'v117CalBox';
        el.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);display:grid;place-items:center;padding:16px;direction:rtl';
        el.innerHTML = '<div style="background:#fff;color:#17342c;border-radius:18px;padding:18px;max-width:460px;width:100%;max-height:92vh;overflow:auto;line-height:1.9;font-size:15px">' +
            '<b style="font-size:18px">📅 المواقيت والتنبيهات في تقويم هاتفك</b>' +
            '<p style="margin:8px 0">تصلك التنبيهات (الأذان، قبله، الإقامة، بعد الصلاة، وتذكير أعمالك) <b>حتى والتطبيق مغلق والجهاز مقفل</b> وبلا إنترنت، لأنها تُضاف إلى تقويم الجهاز نفسه.</p>' +
            '<label>عدد الأيام: <select id="v117CalDays" style="font:inherit;padding:4px 8px"><option value="7">7 أيام</option><option value="14">14 يومًا</option><option value="30" selected>30 يومًا</option><option value="60">60 يومًا</option></select></label>' +
            '<div style="display:flex;gap:8px;margin-top:10px"><button type="button" id="v117CalGo" style="flex:1;border:0;border-radius:12px;padding:10px;font:inherit;font-weight:700;background:#176f7d;color:#fff;cursor:pointer">🔗 ربط بالتقويم الآن</button><button type="button" id="v117CalX" style="border:0;border-radius:12px;padding:10px 16px;font:inherit;cursor:pointer">إغلاق</button></div>' +
            '<div id="v117Now" style="margin:12px 0;padding:10px 12px;border-radius:12px;background:#eef6f4;font-size:14px"></div>' +
            '<details><summary style="cursor:pointer;font-weight:700;padding:6px 0">شرح مفصّل لكل جهاز</summary><div id="v117Tabs" style="display:flex;gap:6px;margin:10px 0 6px;flex-wrap:wrap"></div><div id="v117Steps" style="font-size:14px"></div></details></div>';
        var STEPS = {
            ios: ['🍎 آيفون / آيباد', [
                'اضغط «تنزيل الملف» أعلاه. إن ظهرت ورقة مشاركة فاختر «حفظ في الملفات».',
                'افتح تطبيق <b>الملفات</b> ← <b>التنزيلات</b> (أو اضغط أيقونة التنزيل في Safari) ← اضغط الملف <b>muslim-prayer-times</b>.',
                'تظهر شاشة «إضافة أحداث». اضغط <b>إضافة الكل</b> أسفل الشاشة.',
                'اختر تقويماً. الأفضل <b>تقويم جديد</b> باسم «المسلم» لتحذفه بسهولة لاحقاً، ثم اضغط <b>تم</b>.',
                'فعّل الإشعارات: <b>الإعدادات ← الإشعارات ← التقويم ← السماح بالإشعارات</b> (وفعّل «الأصوات» وشاشة القفل).',
                'اختر الصوت: <b>الإعدادات ← الأصوات والاهتزاز ← تنبيهات التقويم</b> ثم اختر نغمة واضحة.',
                'تأكد أن وضع <b>التركيز / عدم الإزعاج</b> لا يكتم التقويم وقت الصلاة، وأن الجهاز ليس على الصامت (مفتاح الجانب).',
                'للتأكد: افتح تطبيق <b>التقويم</b> وانظر يوم اليوم، يجب أن ترى الأذان والإقامة. لحذفها: التقويم ← التقويمات ← زر (i) بجانب «المسلم» ← حذف التقويم.']],
            android: ['🤖 أندرويد', [
                'اضغط «تنزيل الملف» أعلاه، ثم افتحه من إشعار التنزيل أو من تطبيق <b>الملفات ← التنزيلات</b>.',
                'اختر <b>تقويم Google</b> (أو «تقويم Samsung» في أجهزة سامسونج) ثم اضغط <b>إضافة / استيراد</b>.',
                'إن لم يظهر خيار التقويم: افتح <b>calendar.google.com</b> من متصفح الجهاز بوضع «نسخة الكمبيوتر» ← الإعدادات ← <b>استيراد وتصدير</b> ← <b>استيراد</b> ← اختر الملف ← اختر التقويم ← <b>استيراد</b>.',
                'فعّل الإشعارات: <b>إعدادات الهاتف ← التطبيقات ← تقويم Google ← الإشعارات</b> ← فعّل «تذكيرات الأحداث» واجعل الأهمية <b>عالية مع صوت</b>.',
                'أندرويد 12 فأحدث: <b>إعدادات ← التطبيقات ← تقويم Google ← المنبهات والتذكيرات ← السماح</b>.',
                'لضمان وصولها والجهاز مقفل: <b>التطبيقات ← تقويم Google ← البطارية ← غير مقيّد</b> (أو «بلا قيود»).',
                'تأكد أن وضع <b>عدم الإزعاج</b> يسمح بتنبيهات التقويم، وأن صوت «المنبهات/التنبيهات» غير مكتوم.',
                'للتأكد: افتح تقويم Google على يوم اليوم، يجب أن ترى الأذان والإقامة.']],
            pc: ['💻 كمبيوتر', [
                'اضغط «تنزيل الملف» أعلاه واحفظه.',
                '<b>Windows (Outlook):</b> انقر الملف مرتين ← اختر التقويم ← <b>حفظ وإغلاق</b>. أو من Outlook: ملف ← فتح وتصدير ← استيراد/تصدير ← «استيراد ملف iCalendar».',
                '<b>Mac:</b> انقر الملف مرتين ← يفتح تطبيق التقويم ← اختر تقويماً ← <b>إضافة</b>.',
                '<b>تقويم Google:</b> افتح calendar.google.com ← ⚙ الإعدادات ← <b>استيراد وتصدير</b> ← استيراد ← اختر الملف.',
                'فعّل إشعارات المتصفح أو تطبيق التقويم من إعدادات النظام حتى تظهر التنبيهات.']]
        };
        var ua = navigator.userAgent || '', plat = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : /Android/i.test(ua) ? 'android' : 'pc';
        var NOW = {
            ios: '<b>بعد الضغط على «ربط بالتقويم الآن»:</b><br>١) تظهر شاشة من آيفون نفسه عنوانها <b>«إضافة أحداث»</b> (إن ظهرت ورقة مشاركة فاختر «التقويم» إن وُجد، وإلا «حفظ في الملفات» ثم اضغط الملف).<br>٢) اضغط <b>«إضافة الكل»</b> أسفل الشاشة ثم اختر التقويم ثم <b>«تم»</b>.<br>وبعدها يُنبّهك الآيفون بنفسه وقت كل صلاة.',
            android: '<b>بعد الضغط على «ربط بالتقويم الآن»:</b><br>١) يُنزَّل ملف ويظهر إشعار «اكتمل التنزيل» — اضغط عليه (أو افتحه من «الملفات ← التنزيلات»).<br>٢) اختر <b>تقويم Google</b> ثم اضغط <b>«إضافة»</b> أو <b>«استيراد»</b>.<br>وبعدها يُنبّهك الهاتف بنفسه وقت كل صلاة.',
            pc: '<b>بعد الضغط على «ربط بالتقويم الآن»:</b><br>١) يُنزَّل ملف؛ انقر عليه مرتين.<br>٢) يفتح تطبيق التقويم (Outlook أو تقويم Mac) فاختر <b>إضافة / حفظ</b>.'
        };
        function showSteps(k) {
            var t = document.getElementById('v117Tabs'), st = document.getElementById('v117Steps');
            t.innerHTML = ''; Object.keys(STEPS).forEach(function (id) {
                var b = document.createElement('button'); b.type = 'button'; b.textContent = STEPS[id][0];
                b.style.cssText = 'border:1px solid #176f7d;border-radius:10px;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer;' + (id === k ? 'background:#176f7d;color:#fff' : 'background:#fff;color:#176f7d');
                b.onclick = function () { showSteps(id); }; t.appendChild(b);
            });
            st.innerHTML = '<ol style="margin:6px 0;padding-inline-start:22px">' + STEPS[k][1].map(function (x) { return '<li style="margin:5px 0">' + x + '</li>'; }).join('') + '</ol>' +
                '<p style="font-size:13px;opacity:.85;margin:6px 0">• تُحسب المواقيت لموقعك الحالي؛ جدّد الملف بعد انتهاء الأيام أو عند تغيير الموقع أو إعدادات الصلاة.<br>• صوت التنبيه هو صوت تنبيهات التقويم في جهازك، لذلك اضبطه كما في الخطوات.</p>';
        }
        document.body.appendChild(el);
        showSteps(plat);
        document.getElementById('v117Now').innerHTML = NOW[plat];
        document.getElementById('v117CalX').onclick = function () { el.remove(); };
        document.getElementById('v117CalGo').onclick = function () {
            var ics = generate(+document.getElementById('v117CalDays').value);
            if (!ics)
                return;
            var nd = +document.getElementById('v117CalDays').value;
            try { localStorage.setItem('muslim-cal-until', String(Date.now() + nd * 86400000)); } catch (e) { }
            download(ics, 'muslim-prayer-times.ics').then(function () { toast('تم تجهيز التقويم — أكمل الخطوتين الظاهرتين في هاتفك.'); });
        };
    }
    /* تذكير بالتجديد قبل انتهاء أيام التقويم بثلاثة أيام */
    setTimeout(function () { try { var u = +localStorage.getItem('muslim-cal-until'); if (u && u - Date.now() < 3 * 86400000) toast(u < Date.now() ? 'انتهت تنبيهات التقويم — جدّدها من الإعدادات ← الأذان والإشعارات.' : 'ستنتهي تنبيهات التقويم قريباً — جدّدها من الإعدادات.'); } catch (e) { } }, 6000);
    window.v117Cal = { build: build, fold: fold, generate: generate, open: open, esc: esc };
})();
