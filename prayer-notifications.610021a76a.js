/* prayer-notifications.js — مزوّد أحداث الأذان والتذكير قبل الصلاة (والشروق والتذكير بعد الصلاة القديم)
 * يعتمد على prayer.js الحالي لحساب المواقيت (v107Prayer.timesFor) دون تعديل أي حساب.
 * الموعد = موعد الصلاة كما يظهر في صفحة المواقيت (بما فيه «التعديل الدقيق»).
 */
(function () {
    'use strict';
    var MN = window.MuslimNotify = window.MuslimNotify || {};
    var FIVE = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    function dayDate(off) { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate() + off); }
    function prayerName(k, date) { return (k === 'dhuhr' && date.getDay() === 5) ? 'الجمعة' : MN.NAMES[k]; }
    function fmt(d) { return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

    MN.registerProvider('prayer', {
        build: function (ctx) {
            var s = ctx.settings, out = [], old = MN.oldCfg() || {}, gate = old.on || {};
            if (!MN.hasLocation()) return out;
            ctx.days.forEach(function (off) {
                var date = dayDate(off), t = MN.times(date); if (!t) return;
                var ymd = MN.ymd(date);
                FIVE.forEach(function (k) {
                    var at = t[k]; if (!at) return;
                    if (gate[k] === false) return;                       // مفتاح «الصلوات المفعّلة للتنبيه» القديم يُحترم
                    var T = at.getTime(), nm = prayerName(k, date), label = k === 'dhuhr' && date.getDay() === 5 ? 'صلاة الجمعة' : 'صلاة ' + nm;
                    out.push({ id: 'adhan:' + k + ':' + ymd, t: T, kind: 'adhan', key: k, prayer: k, title: 'حان وقت ' + label, body: 'الأذان الآن حسب موقعك (' + fmt(at) + ')', open: 'prayer', audio: s.adhan.enabled ? 'adhan' : null });
                    if (s.before.enabled && s.before.minutes > 0) {
                        var n = s.before.minutes;
                        out.push({ id: 'before:' + k + ':' + ymd + ':' + n, t: T - n * 60000, kind: 'before', key: k, prayer: k, title: 'بقيت ' + MN.arMin(n) + ' على ' + label, body: 'اقترب موعد ' + label + ' (' + fmt(at) + ')', open: 'prayer', audio: null });
                    }
                    if (old.after > 0) {                                  // ميزة «تذكير بعد الصلاة» القديمة تبقى كما هي
                        out.push({ id: 'after:' + k + ':' + ymd + ':' + old.after, t: T + old.after * 60000, kind: 'after', key: k, prayer: k, title: 'مضى على ' + nm + ' ' + MN.arMin(old.after), body: 'إن لم تصلِّ ' + nm + ' فبادر بها قبل خروج وقتها.', open: 'prayer', audio: null });
                    }
                });
                if (gate.sunrise === true && t.sunrise) out.push({ id: 'sunrise:' + ymd, t: t.sunrise.getTime(), kind: 'sunrise', key: 'sunrise', title: 'الشروق', body: 'طلعت الشمس — وقت صلاة الضحى يبدأ بعد نحو 15 دقيقة.', open: 'prayer', audio: null });
            });
            return out;
        }
    });
})();
