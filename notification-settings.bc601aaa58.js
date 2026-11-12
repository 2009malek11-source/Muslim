/* notification-settings.js — إعدادات الإشعارات (التخزين) + قسم «الإشعارات والتنبيهات» في الإعدادات (الواجهة)
 * الحفظ: localStorage (قراءة فورية) + IndexedDB (نسخة يقرؤها Service Worker وتُستعاد منها الإعدادات).
 */
(function () {
    'use strict';
    var MN = window.MuslimNotify = window.MuslimNotify || {};
    var LSK = 'muslim-notify-settings-v1';
    var PR = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    var NAMES = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };

    function defaults() {
        return {
            v: 2, master: false, notify: true, migrated: false, keepAlive: false,
            sound: { enabled: true, volume: 1, maxSeconds: 0, vibrate: true },
            adhan: { enabled: true, muezzin: 'libya', mode: 'full' },
            iqama: { enabled: true, mode: 'full', perPrayer: { fajr: { on: true, min: 20 }, dhuhr: { on: true, min: 15 }, asr: { on: true, min: 15 }, maghrib: { on: true, min: 10 }, isha: { on: true, min: 15 } } },
            before: { enabled: true, minutes: 10 }
        };
    }
    function clamp(n, a, b, d) { n = parseInt(n, 10); return isFinite(n) ? Math.max(a, Math.min(b, n)) : d; }
    function validate(s) {
        var d = defaults(), o = d;
        function merge(t, src) { for (var k in t) { if (src && src[k] !== undefined) { if (t[k] && typeof t[k] === 'object' && !Array.isArray(t[k])) merge(t[k], src[k]); else t[k] = src[k]; } } }
        merge(o, s || {});
        o.sound.volume = Math.max(0.05, Math.min(1, +o.sound.volume || 1));
        o.sound.maxSeconds = [0, 15, 30, 60, 120, 180].indexOf(+o.sound.maxSeconds) >= 0 ? +o.sound.maxSeconds : 0;
        o.before.minutes = clamp(o.before.minutes, 1, 60, 10);
        PR.forEach(function (k) { o.iqama.perPrayer[k].min = clamp(o.iqama.perPrayer[k].min, 1, 60, 15); });
        if (o.adhan.mode !== 'takbeer') o.adhan.mode = 'full';
        if (o.iqama.mode !== 'short') o.iqama.mode = 'full';
        if (!(window.ADHAN_MUEZZINS || []).some(function (m) { return m.id === o.adhan.muezzin; })) o.adhan.muezzin = 'libya';
        return o;
    }

    var cur = null, subs = [];
    function load() {
        try { var raw = localStorage.getItem(LSK); if (raw) return validate(JSON.parse(raw)); } catch (e) { }
        return validate(null);
    }
    cur = load();

    function migrateFromOld() {
        // مرة واحدة: نقل اختيارات الإعدادات القديمة (التذكير قبل/الإقامة/المؤذن) دون المساس بها
        if (cur.migrated) return;
        try {
            var c = MN.oldCfg ? MN.oldCfg() : {};
            if (c && typeof c === 'object') {
                if (c.before > 0) cur.before.minutes = clamp(c.before, 1, 60, 10); else if (c.before === 0) cur.before.enabled = false;
                if (c.iqama > 0) PR.forEach(function (k) { cur.iqama.perPrayer[k].min = clamp(c.iqama, 1, 60, 15); });
                else if (c.iqama === 0) cur.iqama.enabled = false;
                if (c.adhan === false) cur.adhan.enabled = false;
                var ids = (window.ADHAN_MUEZZINS || []).map(function (m) { return m.id; });
                if (c.muezzin && ids.indexOf(c.muezzin) >= 0) cur.adhan.muezzin = c.muezzin;
            }
        } catch (e) { }
        cur.migrated = true;
        persist();
    }
    function persist() {
        try { localStorage.setItem(LSK, JSON.stringify(cur)); } catch (e) { }
        try { if (MN.db) MN.db.set('settings', cur).catch(function () { }); } catch (e) { }
    }
    MN.settings = {
        get: function () { return cur; },
        set: function (fn, quiet) {
            var c = JSON.parse(JSON.stringify(cur));
            if (typeof fn === 'function') fn(c); else for (var k in fn) c[k] = fn[k];
            cur = validate(c);
            persist();
            subs.forEach(function (f) { try { f(cur); } catch (e) { } });
            if (!quiet && MN.reschedule) MN.reschedule('settings');
            return cur;
        },
        subscribe: function (f) { subs.push(f); },
        reset: function () { var m = cur.master; cur = validate(null); cur.master = m; cur.migrated = true; persist(); if (MN.reschedule) MN.reschedule('reset', true); render(); },
        restore: async function () {
            try {
                if (!localStorage.getItem(LSK) && MN.db) { var s = await MN.db.get('settings'); if (s) { cur = validate(s); localStorage.setItem(LSK, JSON.stringify(cur)); } }
            } catch (e) { }
            migrateFromOld();
        }
    };

    /* ================== الواجهة (الربط بعناصر القسم الثابت في الصفحة) ================== */
    function $(id) { return document.getElementById(id); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function toast(m) { try { if (window.showToast) window.showToast(m); } catch (e) { } }
    var CSS = '.mnBox{font-size:13px;line-height:1.9;padding:10px 12px;border-radius:12px;background:rgba(127,127,127,.1);border:1px solid rgba(127,127,127,.18);width:100%;box-sizing:border-box}' +
        '.mnBox .ok{color:#1d8a5a}.mnBox .no{color:#c0392b}.mnBox .wn{color:#b9770e}.mnH{margin:14px 0 4px;font-size:15px;padding-top:8px;border-top:1px solid rgba(127,127,127,.2)}' +
        '.mnAdv{margin-top:12px;border-top:1px solid rgba(127,127,127,.2);padding-top:8px}.mnAdv>summary{cursor:pointer;font-weight:700;padding:8px 0}';
    var mounted = false;
    function mount() {
        if (mounted) return true;
        if (!$('mnMaster')) return false;
        if (!$('mnCss')) { var st = document.createElement('style'); st.id = 'mnCss'; st.textContent = CSS; document.head.appendChild(st); }
        var m = $('mnMuezzin');
        if (m && window.MuslimAudio) m.innerHTML = MuslimAudio.muezzins().map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(x.name) + '</option>'; }).join('');
        mounted = true; bind(); render();
        return true;
    }
    function ck(id, v) { var e = $(id); if (e) e.checked = !!v; }
    function val(id, v) { var e = $(id); if (e) e.value = String(v); }
    function render() {
        if (!mounted) return;
        var s = cur;
        ck('mnMaster', s.master); ck('mnAdhanOn', s.adhan.enabled); ck('mnIqamaOn', s.iqama.enabled); ck('mnBeforeOn', s.before.enabled);
        ck('mnSound', s.sound.enabled); ck('mnVib', s.sound.vibrate); ck('mnKeep', s.keepAlive);
        val('mnMuezzin', s.adhan.muezzin); val('mnAdhanMode', s.adhan.mode); val('mnIqamaMode', s.iqama.mode); val('mnVol', s.sound.volume); val('mnMax', s.sound.maxSeconds);
        PR.forEach(function (k) { val('mnIqMin_' + k, s.iqama.perPrayer[k].min); });
        var std = [3, 5, 7, 10, 15].indexOf(s.before.minutes) >= 0;
        val('mnBeforeSel', std ? s.before.minutes : 'custom'); val('mnBeforeCustom', s.before.minutes);
        var cr = $('mnBeforeCustomRow'); if (cr) cr.style.display = std ? 'none' : '';
        refreshStatus(); refreshAudio();
        try { if (window.MuslimAdhkar) MuslimAdhkar.renderInto($('mnAdhkar')); } catch (e) { }
    }
    async function refreshStatus() {
        var el = $('mnStatus'), cp = $('mnCaps'); if (!el || !MN.caps) return;
        var c = await MN.caps(), lines = [], r = [];
        var perm = c.permission === 'granted' ? '<span class="ok">✔ مسموح</span>' : c.permission === 'denied' ? '<span class="no">✖ محظور — فعّله من إعدادات المتصفح أو النظام</span>' : c.permission === 'unsupported' ? '<span class="no">✖ غير مدعوم في هذا المتصفح</span>' : '<span class="wn">لم يُطلب بعد</span>';
        lines.push('إذن الإشعارات: ' + perm);
        lines.push('الموقع: ' + (MN.hasLocation() ? '<span class="ok">✔ محدد</span>' : '<span class="no">✖ غير محدد — حدّده من صفحة مواقيت الصلاة</span>'));
        lines.push('التنبيهات: ' + (MN.settings.get().master ? '<span class="ok">مفعّلة — ' + (MN.events ? MN.events.length : 0) + ' تنبيه خلال 48 ساعة</span>' : '<span class="wn">متوقفة</span>'));
        el.innerHTML = lines.join('<br>');
        if (c.platform === 'ios') {
            r.push('<span class="wn">⚠ آيفون/آيباد:</span> الإشعارات تحتاج إضافة التطبيق إلى الشاشة الرئيسية ونظام 16.4 فأحدث' + (c.iosVersion && c.iosVersion < 16.4 ? ' — <b>نظامك (' + c.iosVersion + ') لا يدعمها</b>' : '') + '.');
            r.push('<span class="no">✖</span> الأذان بصوته الحقيقي يعمل والتطبيق مفتوح فقط. عند الإغلاق استخدم <b>تقويم الهاتف</b>.');
        } else if (c.platform === 'android') {
            r.push('<span class="ok">✔</span> التطبيق مفتوح: أذان وإقامة بصوت حقيقي مع إشعارات.');
            r.push('<span class="wn">⚠</span> في الخلفية: قد يصلك إشعار بصوت النظام إن لم يوقف الجهاز الصفحة.');
            r.push('<span class="no">✖</span> عند الإغلاق التام: استخدم <b>تقويم الهاتف</b>.');
        } else {
            r.push('<span class="ok">✔</span> الكمبيوتر: يعمل ما دام التطبيق أو التبويب مفتوحاً (ولو مصغّراً).');
            r.push('<span class="no">✖</span> إغلاق المتصفح بالكامل يوقف التنبيهات.');
        }
        r.push('<span class="ok">✔</span> إعداداتك تُحفظ على الجهاز، وكل شيء يعمل دون إنترنت بعد تنزيل الأصوات.');
        if (cp) cp.innerHTML = r.join('<br>');
    }
    async function refreshAudio() {
        if (!window.MuslimAudio) return;
        var st = await MuslimAudio.status(), a = $('mnAudioState');
        var need = MuslimAudio.muezzins().reduce(function (n, m) { return n.concat([m.file, m.takbeer].filter(Boolean)); }, MuslimAudio.IQAMA_FILES.slice());
        var have = need.filter(function (u) { return st.files[u]; }).length;
        if (a) a.innerHTML = have === need.length ? '<span style="color:#1d8a5a">✔ كل الأصوات محفوظة وتعمل دون إنترنت</span>' : 'محفوظ ' + have + ' من ' + need.length + ' — اضغط «تنزيل الأصوات» مع الإنترنت';
    }
    function bind() {
        function on(id, ev, fn) { var e = $(id); if (e) e.addEventListener(ev, fn); }
        function chg(id, fn) { on(id, 'change', function (ev) { MN.settings.set(function (s) { fn(s, ev.target); }); render(); }); }
        on('mnMaster', 'change', async function (ev) { if (ev.target.checked) { var r = await MN.enable(); noteFor(r); } else { await MN.disable(); } render(); });
        on('mnEnable', 'click', async function () { var r = await MN.enable(); noteFor(r); render(); });
        on('mnLoc', 'click', function () { try { if (typeof show === 'function') show('prayer'); } catch (e) { } });
        chg('mnAdhanOn', function (s, e) { s.adhan.enabled = e.checked; });
        chg('mnMuezzin', function (s, e) { s.adhan.muezzin = e.value; });
        chg('mnAdhanMode', function (s, e) { s.adhan.mode = e.value; });
        chg('mnIqamaOn', function (s, e) { s.iqama.enabled = e.checked; });
        chg('mnIqamaMode', function (s, e) { s.iqama.mode = e.value; });
        chg('mnBeforeOn', function (s, e) { s.before.enabled = e.checked; });
        chg('mnSound', function (s, e) { s.sound.enabled = e.checked; });
        chg('mnVib', function (s, e) { s.sound.vibrate = e.checked; });
        chg('mnMax', function (s, e) { s.sound.maxSeconds = +e.value; });
        on('mnVol', 'change', function (ev) { MN.settings.set(function (s) { s.sound.volume = +ev.target.value; }, true); });
        chg('mnKeep', function (s, e) { s.keepAlive = e.checked; });
        on('mnKeep', 'change', function (ev) { try { if (ev.target.checked) { MuslimAudio.keepAlive.start(); toast('تم التفعيل — قد يزيد استهلاك البطارية.'); } else MuslimAudio.keepAlive.stop(); } catch (e) { } });
        PR.forEach(function (k) { chg('mnIqMin_' + k, function (s, e) { s.iqama.perPrayer[k].min = e.value; }); });
        chg('mnBeforeSel', function (s, e) { if (e.value !== 'custom') s.before.minutes = +e.value; });
        on('mnBeforeSel', 'change', function (ev) { var c = $('mnBeforeCustomRow'); if (c) c.style.display = ev.target.value === 'custom' ? '' : 'none'; });
        chg('mnBeforeCustom', function (s, e) { s.before.minutes = e.value; });
        on('mnAudioDl', 'click', async function () {
            var b = $('mnAudioDl'); b.disabled = true; b.textContent = '⏳ جارٍ التنزيل…';
            try { var r = await MuslimAudio.ensureOffline(function (i, n) { b.textContent = '⏳ ' + i + '/' + n; }); toast(r.missing.length ? 'تعذّر تنزيل بعض الأصوات — تحقق من الإنترنت.' : 'الأصوات جاهزة دون إنترنت ✅'); } catch (e) { toast('تعذّر التنزيل.'); }
            b.disabled = false; b.textContent = '⬇ تنزيل الأصوات'; refreshAudio();
        });
        on('mnTestAdhan', 'click', function () { playTest(cur.adhan.mode === 'takbeer' ? 'takbeer' : 'adhan'); });
        on('mnTestIqama', 'click', function () { playTest('iqama'); });
        on('mnStop', 'click', function () { MuslimAudio.stop(); });
        on('mnTestNow', 'click', async function () { var ok = await MN.testNow(); if (!ok) toast(MN.permission() === 'granted' ? 'تعذّر عرض الإشعار.' : 'الإذن غير ممنوح — يظهر التنبيه داخل التطبيق فقط.'); });
        on('mnTest15', 'click', function () { schedTest(15); });
        on('mnTest60', 'click', function () { schedTest(60); });
        on('mnNextBtn', 'click', showNext);
        on('mnReset', 'click', function () { if (confirm('إعادة إعدادات التنبيهات إلى الافتراضي؟')) MN.settings.reset(); });
        MuslimAudio && MuslimAudio.on(function (t) { if (t === 'cache') refreshAudio(); });
        MN.on('scheduled', function () { refreshStatus(); var n = $('mnNext'); if (n && n.style.display !== 'none') showNext(); });
    }
    async function playTest(kind) {
        var s = cur, r = await MuslimAudio.play(kind, { muezzin: s.adhan.muezzin, prayer: 'dhuhr', volume: s.sound.volume, maxSeconds: s.sound.maxSeconds, short: s.iqama.mode === 'short' });
        if (!r.ok) toast(r.reason === 'no-file' ? 'الصوت غير محفوظ بعد — اضغط «تنزيل الأصوات» مع الإنترنت.' : r.reason === 'blocked' ? 'منع المتصفح التشغيل — اضغط مرة أخرى.' : 'تعذّر تشغيل الصوت.');
    }
    async function schedTest(sec) {
        if (!cur.master) { var r0 = await MN.enable(); noteFor(r0); }
        await MN.scheduleTest(sec, false);
        toast('سيصلك اختبار بعد ' + sec + ' ثانية — انتقل لتطبيق آخر الآن لترى هل يصل.');
    }
    function noteFor(r) {
        if (!r) return;
        if (r.note === 'ios-install') toast('على آيفون: أضف التطبيق إلى الشاشة الرئيسية وافتحه من أيقونته ثم فعّل الإشعارات.');
        else if (r.note === 'unsupported') toast('هذا المتصفح لا يدعم الإشعارات؛ ستظهر التنبيهات داخل التطبيق فقط.');
        else if (r.note === 'denied') toast('الإشعارات محظورة — فعّلها من إعدادات المتصفح أو النظام.');
        else toast('تم التفعيل ✅');
    }
    function showNext() {
        var el = $('mnNext'); if (!el) return;
        var list = MN.nextEvents(10);
        el.style.display = '';
        if (!MN.hasLocation()) { el.innerHTML = '<span class="no">حدّد موقعك أولاً من صفحة مواقيت الصلاة.</span>'; return; }
        el.innerHTML = list.length ? list.map(function (e) {
            var d = new Date(e.t);
            return '<div>' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ' — ' + esc(e.title) + (e.audio ? ' 🔊' : '') + '</div>';
        }).join('') : '<span class="wn">لا توجد تنبيهات قادمة — فعّل «تفعيل التنبيهات».</span>';
    }
    function tryMount() { if (!mount()) setTimeout(tryMount, 500); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryMount); else tryMount();
    document.addEventListener('click', function (e) { if (e.target && e.target.closest && e.target.closest('#stgcat-alerts summary')) setTimeout(function () { refreshStatus(); refreshAudio(); }, 50); }, true);
    MN.settingsUI = { render: render, mount: mount };
})();
