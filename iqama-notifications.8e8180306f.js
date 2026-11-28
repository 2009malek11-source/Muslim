/* iqama-notifications.js — نظام الإقامة المستقل
 * موعد الإقامة = موعد الأذان + المدة التي حددها المستخدم لهذه الصلاة (تُحفظ لكل صلاة).
 * يُلغى تلقائياً (لا يُبنى له حدث) إذا أوقف المستخدم الإشعارات أو الإقامة أو الصلاة، أو غيّر مواقيت الصلاة؛
 * لأن الجدول كله يُعاد بناؤه من الصفر عند أي تغيير (MuslimNotify.reschedule) ويُستبدل بالقديم.
 * الصوت: تسجيل حقيقي فقط (iqama.mp3 أو ملف يضيفه المستخدم). لا صوت اصطناعي إطلاقاً.
 */
(function () {
    'use strict';
    var MN = window.MuslimNotify = window.MuslimNotify || {};
    var FIVE = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    MN.registerProvider('iqama', {
        build: function (ctx) {
            var s = ctx.settings, out = [], gate = (MN.oldCfg() || {}).on || {};
            if (!s.iqama.enabled || !MN.hasLocation()) return out;
            ctx.days.forEach(function (off) {
                var n = new Date(), date = new Date(n.getFullYear(), n.getMonth(), n.getDate() + off), t = MN.times(date); if (!t) return;
                var ymd = MN.ymd(date);
                FIVE.forEach(function (k) {
                    var cfg = s.iqama.perPrayer[k];
                    if (!t[k] || !cfg || !cfg.on || gate[k] === false) return;
                    var nm = (k === 'dhuhr' && date.getDay() === 5) ? 'الجمعة' : MN.NAMES[k];
                    out.push({
                        id: 'iqama:' + k + ':' + ymd + ':' + cfg.min, t: t[k].getTime() + cfg.min * 60000, kind: 'iqama', key: k, prayer: k,
                        title: 'إقامة صلاة ' + nm, body: 'قد قامت الصلاة، قد قامت الصلاة', open: 'prayer', audio: 'iqama'
                    });
                });
            });
            return out;
        }
    });
})();
