/* notifications.js — نواة نظام الإشعارات والتنبيهات (محلي بالكامل، بلا خادم)
 *
 * المسؤوليات:
 *  - IndexedDB لحفظ الإعدادات والجدول والأحداث التي أُطلقت (يقرؤها Service Worker أيضاً).
 *  - طلب إذن الإشعارات (Notification API) وكشف قدرات الجهاز الفعلية (iOS / Android / كمبيوتر).
 *  - بناء جدول التنبيهات لـ 48 ساعة قادمة من «مزوّدين» (الصلاة، الإقامة، الأذكار) وحفظه.
 *  - إطلاق التنبيه عند موعده (مؤقت واحد للحدث التالي، لا polling دائم → أقل استهلاكاً للبطارية).
 *  - استعادة الجدول عند فتح التطبيق/العودة إليه/تغيّر المنطقة الزمنية، وتعويض ما فات ضمن مهلة سماح.
 *  - Notification Triggers (إن وُجدت) و Periodic Background Sync (إن وُجدت) كطبقات إضافية.
 *
 * ما لا يفعله (قيد حقيقي لا حل وهمي له): جدولة إشعار بصوت أذان مخصص والتطبيق مغلق دون خادم Push.
 */
(function () {
    'use strict';
    var MN = window.MuslimNotify = window.MuslimNotify || {};
    var DB = 'muslim-notify', VER = 1;
    var providers = {}, events = [], fired = {}, timer = null, rebuildT = null, built = 0, tzSig = '';
    var HORIZON = 48 * 3600e3, listeners = {};
    var GRACE = { before: 3 * 60e3, adhan: 6 * 60e3, iqama: 4 * 60e3, after: 10 * 60e3, sunrise: 10 * 60e3, adhkar: 90 * 60e3, quran: 90 * 60e3, test: 5 * 60e3 };
    var AUDIO_WINDOW = 120e3;      // الصوت يُشغَّل فقط إن تأخر الإطلاق أقل من دقيقتين عن الموعد

    /* ---------------- IndexedDB ---------------- */
    function idb() {
        return new Promise(function (res, rej) {
            if (!window.indexedDB) return rej(new Error('no-idb'));
            var r = indexedDB.open(DB, VER);
            r.onupgradeneeded = function () {
                var d = r.result;
                if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv');
                if (!d.objectStoreNames.contains('events')) d.createObjectStore('events', { keyPath: 'id' });
                if (!d.objectStoreNames.contains('fired')) d.createObjectStore('fired');
            };
            r.onsuccess = function () { res(r.result); };
            r.onerror = function () { rej(r.error); };
        });
    }
    function run(stores, mode, fn) {
        return idb().then(function (db) {
            return new Promise(function (res, rej) {
                var t = db.transaction(stores, mode), out;
                try { out = fn(t); } catch (e) { db.close(); rej(e); return; }
                t.oncomplete = function () { db.close(); res(out && typeof out === 'object' && ('result' in out) ? out.result : out); };
                t.onerror = t.onabort = function () { db.close(); rej(t.error); };
            });
        });
    }
    var db = {
        get: function (k) { return run('kv', 'readonly', function (t) { return t.objectStore('kv').get(k); }); },
        set: function (k, v) { return run('kv', 'readwrite', function (t) { t.objectStore('kv').put(v, k); }); },
        events: function () { return run('events', 'readonly', function (t) { return t.objectStore('events').getAll(); }); },
        replaceEvents: function (list) { return run('events', 'readwrite', function (t) { var s = t.objectStore('events'); s.clear(); list.forEach(function (e) { s.put(e); }); }); },
        fired: function () {
            return run('fired', 'readonly', function (t) {
                var o = {}, s = t.objectStore('fired'), req = s.openCursor();
                req.onsuccess = function () { var c = req.result; if (c) { o[c.key] = c.value; c.continue(); } };
                return { get result() { return o; } };
            });
        },
        markFired: function (id, ts) { return run('fired', 'readwrite', function (t) { t.objectStore('fired').put(ts || Date.now(), id); }); },
        pruneFired: function (before) {
            return run('fired', 'readwrite', function (t) {
                var s = t.objectStore('fired'), req = s.openCursor();
                req.onsuccess = function () { var c = req.result; if (c) { if (c.value < before) c.delete(); c.continue(); } };
            });
        }
    };
    MN.db = db;

    /* ---------------- أحداث داخلية بسيطة ---------------- */
    MN.on = function (t, f) { (listeners[t] = listeners[t] || []).push(f); };
    function emit(t, d) { (listeners[t] || []).forEach(function (f) { try { f(d); } catch (e) { } }); try { document.dispatchEvent(new CustomEvent('muslimNotify:' + t, { detail: d })); } catch (e) { } }
    MN.emit = emit;

    /* ---------------- قدرات الجهاز (كشف فعلي لا افتراضي) ---------------- */
    function iosVersion() {
        var m = /OS (\d+)[_.](\d+)/.exec(navigator.userAgent || '');
        return m ? parseFloat(m[1] + '.' + m[2]) : 0;
    }
    function isIOS() { var u = navigator.userAgent || ''; return /iPad|iPhone|iPod/.test(u) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
    function standalone() { try { return !!(navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches)); } catch (e) { return false; } }
    MN.caps = async function () {
        var c = {
            platform: isIOS() ? 'ios' : (/Android/i.test(navigator.userAgent || '') ? 'android' : 'desktop'),
            iosVersion: iosVersion(), standalone: standalone(),
            notification: 'Notification' in window,
            permission: 'Notification' in window ? Notification.permission : 'unsupported',
            sw: 'serviceWorker' in navigator,
            push: 'PushManager' in window,
            triggers: false, periodicSync: false, mediaSession: 'mediaSession' in navigator
        };
        try { c.triggers = typeof window.TimestampTrigger !== 'undefined' && 'showTrigger' in Notification.prototype; } catch (e) { }
        try { var reg = await swReady(1500); c.periodicSync = !!(reg && 'periodicSync' in reg); c.swActive = !!reg; } catch (e) { }
        // iOS: الإشعارات لا تعمل إلا في تطبيق مثبّت على الشاشة الرئيسية ونظام 16.4 فأحدث
        c.iosNotifOk = c.platform !== 'ios' || (c.standalone && c.notification);
        return c;
    };

    function swReady(ms) {
        if (!('serviceWorker' in navigator)) return Promise.resolve(null);
        return Promise.race([navigator.serviceWorker.ready, new Promise(function (r) { setTimeout(function () { r(null); }, ms || 3000); })]).catch(function () { return null; });
    }

    /* ---------------- الإذن ---------------- */
    MN.permission = function () { return 'Notification' in window ? Notification.permission : 'unsupported'; };
    /** يُستدعى من ضغطة مستخدم. يفعّل المنظومة حتى لو رُفض الإذن (تبقى التنبيهات داخل التطبيق). */
    MN.enable = async function () {
        var res = { permission: MN.permission(), master: true, note: '' };
        if ('Notification' in window && Notification.permission === 'default') {
            try { res.permission = await Notification.requestPermission(); } catch (e) { res.permission = MN.permission(); }
        }
        var c = await MN.caps();
        if (c.platform === 'ios' && !c.standalone) res.note = 'ios-install';
        else if (!c.notification) res.note = 'unsupported';
        else if (res.permission === 'denied') res.note = 'denied';
        MN.settings.set(function (s) { s.master = true; });
        try { if (window.MuslimAudio) MuslimAudio.unlock(); } catch (e) { }
        await MN.reschedule('enable', true);
        return res;
    };
    MN.disable = async function () {
        MN.settings.set(function (s) { s.master = false; });
        await MN.reschedule('disable', true);
    };

    /* ---------------- مواقيت الصلاة (من النظام الحالي دون تعديله) ---------------- */
    var NAMES = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    MN.NAMES = NAMES;
    MN.ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    MN.hasLocation = function () { try { return !!(window.v107Prayer && v107Prayer.getLoc()); } catch (e) { return false; } };
    /** يرجع مواقيت يوم (Date) كما يحسبها prayer.js بالضبط (بما فيها التعديل الدقيق بالدقائق). */
    MN.times = function (date) {
        try {
            var P = window.v107Prayer; if (!P) return null;
            var loc = P.getLoc(); if (!loc) return null;
            return P.timesFor(date, loc, P.cfg());
        } catch (e) { return null; }
    };
    MN.oldCfg = function () { try { return window.v107Prayer ? v107Prayer.cfg() : {}; } catch (e) { return {}; } };
    MN.ymd = function (d) { d = new Date(d); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
    MN.arMin = function (n) {
        n = Math.round(n);
        if (n === 1) return 'دقيقة واحدة';
        if (n === 2) return 'دقيقتان';
        if (n >= 3 && n <= 10) return n + ' دقائق';
        return n + ' دقيقة';
    };
    MN.registerProvider = function (name, p) { providers[name] = p; };
    MN.grace = GRACE;

    /* ---------------- بناء الجدول ---------------- */
    function tzNow() { var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { } return tz + '|' + new Date().getTimezoneOffset(); }

    MN.reschedule = function (reason, immediate) {
        clearTimeout(rebuildT);
        return new Promise(function (resolve) {
            rebuildT = setTimeout(function () { rebuild(reason).then(resolve, resolve); }, immediate ? 0 : 350);
        });
    };
    var building = false, again = false;
    async function rebuild(reason) {
        if (building) { again = true; return; }
        building = true;
        try {
            var s = MN.settings.get(), now = Date.now(), list = [];
            if (!fired || !Object.keys(fired).length) { try { fired = await db.fired(); } catch (e) { fired = fired || {}; } }
            if (s.master) {
                var ctx = { settings: s, now: now, to: now + HORIZON, days: [-1, 0, 1, 2] };
                for (var name in providers) {
                    try { list = list.concat(await providers[name].build(ctx) || []); } catch (e) { try { console.warn('[notify] provider', name, e); } catch (_) { } }
                }
                list = list.concat(await testEvents(now));
            }
            var seen = {};
            list = list.filter(function (e) {
                if (!e || !isFinite(e.t) || seen[e.id]) return false;
                seen[e.id] = 1;
                e.grace = e.grace || GRACE[e.kind] || 5 * 60e3;
                return e.t > now - e.grace && e.t < now + HORIZON;
            }).sort(function (a, b) { return a.t - b.t; });
            events = list; built = now; tzSig = tzNow();
            MN.events = list;
            try { await db.replaceEvents(list); await db.set('settings', s); await db.set('builtAt', now); await db.pruneFired(now - 4 * 864e5); } catch (e) { }
            if (s.master) { scheduleTriggers(list).catch(function () { }); registerPeriodic().catch(function () { }); }
            else { cancelTriggers([]).catch(function () { }); }
            swPing('notify-sync');
            tick();
            emit('scheduled', { count: list.length, reason: reason });
        } finally {
            building = false;
            if (again) { again = false; MN.reschedule('again', true); }
        }
    }
    MN.nextEvents = function (n) { var now = Date.now(); return events.filter(function (e) { return e.t > now; }).slice(0, n || 10); };

    /* اختبار الجدولة الفعلي: حدث مؤقت بعد N ثانية، يُحفظ ويُطلق حتى لو انتقل التطبيق للخلفية */
    var tests = [];
    MN.scheduleTest = async function (seconds, withAudio) {
        var t = Date.now() + seconds * 1000, id = 'test:' + t;
        tests.push({ id: id, t: t, kind: 'test', key: 'test', title: 'اختبار الجدولة ✅', body: 'وصل هذا التنبيه في موعده المجدول (' + seconds + ' ثانية) — الجدولة تعمل.', open: 'home', audio: withAudio ? 'takbeer' : null, grace: GRACE.test });
        try { await db.set('tests', tests); } catch (e) { }
        await MN.reschedule('test', true);
        return id;
    };
    async function testEvents(now) {
        try { if (!tests.length) tests = (await db.get('tests')) || []; } catch (e) { }
        tests = tests.filter(function (e) { return e.t > now - 10 * 60e3; });
        return tests.slice();
    }

    /* ---------------- الإطلاق ---------------- */
    function dueNow() {
        var now = Date.now(), out = [];
        events.forEach(function (e) { if (!fired[e.id] && e.t <= now && now - e.t <= e.grace) out.push(e); });
        return out;
    }
    async function tick() {
        clearTimeout(timer);
        try {
            if (building) { timer = setTimeout(tick, 400); return; }
            if (built && tzSig && tzNow() !== tzSig) { MN.reschedule('timezone', true); return; }   // تغيّرت المنطقة/التوقيت الصيفي
            var due = dueNow();
            for (var i = 0; i < due.length; i++) await fire(due[i]);
            var now = Date.now(), next = Infinity;
            events.forEach(function (e) { if (!fired[e.id] && e.t > now && e.t < next) next = e.t; });
            var delay = next === Infinity ? 10 * 60e3 : Math.max(next - now, 0);
            // نوقظ المؤقت عند الحدث التالي تماماً، وبحدٍّ أقصى 5 دقائق لتصحيح الانجراف بعد نوم الجهاز
            delay = delay < 1500 ? delay + 40 : Math.min(delay, 5 * 60e3);
            timer = setTimeout(tick, delay);
        } catch (e) { timer = setTimeout(tick, 30e3); }
    }
    MN.tick = tick;

    function visible() { return document.visibilityState === 'visible'; }
    async function fire(e) {
        fired[e.id] = Date.now();
        db.markFired(e.id, fired[e.id]).catch(function () { });
        var s = MN.settings.get(), now = Date.now(), vis = visible(), played = null;
        var wantAudio = e.audio && s.sound.enabled && (now - e.t) <= AUDIO_WINDOW;
        if (wantAudio) {
            var canPlay = vis || (window.MuslimAudio && MuslimAudio.keepAlive.active());
            if (canPlay && window.MuslimAudio) {
                var kind = e.audio === 'adhan' ? (s.adhan.mode === 'takbeer' ? 'takbeer' : 'adhan') : e.audio;
                played = await MuslimAudio.play(kind, { muezzin: s.adhan.muezzin, prayer: e.prayer, volume: s.sound.volume, maxSeconds: s.sound.maxSeconds, title: e.title, short: s.iqama.mode === 'short' });
                if (!played.ok && played.reason === 'blocked') MN.ui.banner(e, { play: true });
            }
        }
        var audioOk = played && played.ok;
        var perm = MN.permission();
        if (!vis && perm === 'granted' && s.notify !== false) {
            await MN.show(e, { silent: false });
        } else if (vis) {
            // التطبيق مفتوح: لافتة داخل التطبيق (+ إشعار نظام فقط إن لم يُشغَّل صوت وكان الإذن ممنوحاً ولم تكن لافتة كافية)
            MN.ui.banner(e, { stop: audioOk, noFile: wantAudio && played && played.reason === 'no-file' });
            if (!audioOk && perm === 'granted' && s.notify !== false && e.kind !== 'test') MN.show(e, { silent: false }).catch(function () { });
            if (s.sound.vibrate && navigator.vibrate && !audioOk) { try { navigator.vibrate([200, 100, 200]); } catch (x) { } }
        } else if (perm !== 'granted') {
            // لا إذن: نحاول على الأقل لافتة عند العودة للتطبيق (تُعرض عند visibilitychange لأحداث ضمن السماح)
            e._pendingBanner = true;
        }
        emit('fired', e);
    }

    /* ---------------- عرض الإشعار (عبر Service Worker لثبات العمل) ---------------- */
    MN.payload = function (e, o) {
        o = o || {};
        var s = MN.settings.get();
        return {
            title: e.title,
            opts: {
                body: e.body || '', tag: e.id, icon: './ic-192.png', badge: './ic-192.png', lang: 'ar', dir: 'rtl',
                vibrate: s.sound.vibrate ? [250, 120, 250] : undefined, silent: !!o.silent,
                requireInteraction: e.kind === 'adhan' || e.kind === 'iqama',
                data: { open: e.open || 'prayer', adhan: e.kind === 'adhan', key: e.prayer || e.key || '', t: e.t, id: e.id, kind: e.kind }
            }
        };
    };
    MN.show = async function (e, o) {
        if (MN.permission() !== 'granted') return false;
        var p = MN.payload(e, o), reg = await swReady(3500);
        try {
            if (reg && reg.showNotification) { await reg.showNotification(p.title, p.opts); return true; }
            new Notification(p.title, p.opts); return true;
        } catch (x) { try { new Notification(p.title, { body: p.opts.body, tag: p.opts.tag, icon: p.opts.icon }); return true; } catch (y) { return false; } }
    };
    MN.testNow = async function () {
        var e = { id: 'test-now:' + Date.now(), t: Date.now(), kind: 'test', key: 'test', title: 'اختبار الإشعار 🔔', body: 'هكذا ستظهر تنبيهات المسلم على جهازك.', open: 'home', grace: 60e3 };
        var ok = await MN.show(e, {});
        if (!ok) MN.ui.banner(e, {});
        return ok;
    };

    /* ---------------- Notification Triggers (إن دعمها المتصفح) ---------------- */
    async function scheduleTriggers(list) {
        var c = await MN.caps();
        if (!c.triggers || c.permission !== 'granted') return;
        var reg = await swReady(2500); if (!reg) return;
        var now = Date.now(), keep = [];
        list.filter(function (e) { return e.t > now + 5000; }).slice(0, 40).forEach(function (e) {
            keep.push(e.id);
            var p = MN.payload(e, {});
            try { p.opts.showTrigger = new TimestampTrigger(e.t); reg.showNotification(p.title, p.opts); } catch (x) { }
        });
        await cancelTriggers(keep);
    }
    async function cancelTriggers(keepIds) {
        try {
            var reg = await swReady(1500); if (!reg || !reg.getNotifications) return;
            var all = await reg.getNotifications({ includeTriggered: true });
            all.forEach(function (n) { if (n.showTrigger && keepIds.indexOf(n.tag) < 0) n.close(); });
        } catch (e) { }
    }
    async function registerPeriodic() {
        try {
            var reg = await swReady(2000);
            if (!reg || !reg.periodicSync) return;
            await reg.periodicSync.register('muslim-notify-check', { minInterval: 15 * 60 * 1000 });
        } catch (e) { }
    }
    function swPing(type) {
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: type });
        } catch (e) { }
    }

    /* ---------------- لافتة داخل التطبيق ---------------- */
    MN.ui = {
        banner: function (e, o) {
            o = o || {};
            try {
                var old = document.getElementById('mnBanner'); if (old) old.remove();
                var b = document.createElement('div');
                b.id = 'mnBanner'; b.setAttribute('role', 'status'); b.dir = 'rtl';
                b.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:100000;max-width:92vw;min-width:260px;background:#176f7d;color:#fff;border-radius:18px;padding:12px 16px;box-shadow:0 8px 30px rgba(0,0,0,.4);font-family:inherit;line-height:1.7';
                var h = '<div style="font-weight:700">🔔 ' + esc(e.title) + '</div>' + (e.body ? '<div style="opacity:.9;font-size:14px">' + esc(e.body) + '</div>' : '');
                if (o.noFile) h += '<div style="font-size:12px;opacity:.85;margin-top:4px">لا يوجد تسجيل صوتي لهذا التنبيه بعد — أضِفه من الإعدادات ← الإشعارات والتنبيهات.</div>';
                h += '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">';
                if (o.play) h += '<button type="button" data-a="play" style="all:unset;cursor:pointer;background:#f0c969;color:#0b3a2f;border-radius:10px;padding:6px 14px;font-weight:700">▶ تشغيل الأذان</button>';
                if (o.stop) h += '<button type="button" data-a="stop" style="all:unset;cursor:pointer;background:#fff;color:#176f7d;border-radius:10px;padding:6px 14px;font-weight:700">⏹ إيقاف الصوت</button>';
                h += '<button type="button" data-a="x" style="all:unset;cursor:pointer;opacity:.85;padding:6px 8px">إغلاق ✕</button></div>';
                b.innerHTML = h;
                b.onclick = function (ev) {
                    var a = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-a');
                    if (a === 'stop') { try { MuslimAudio.stop(); } catch (x) { } b.remove(); }
                    else if (a === 'play') {
                        var s = MN.settings.get();
                        MuslimAudio.play(e.audio === 'iqama' ? 'iqama' : (s.adhan.mode === 'takbeer' ? 'takbeer' : 'adhan'), { muezzin: s.adhan.muezzin, prayer: e.prayer, volume: s.sound.volume, maxSeconds: s.sound.maxSeconds, short: s.iqama.mode === 'short' });
                        b.remove();
                    } else if (a === 'x') b.remove();
                };
                document.body.appendChild(b);
                setTimeout(function () { if (b.parentNode && !o.stop) b.remove(); }, 45000);
                if (window.MuslimAudio) MuslimAudio.on(function (t) { if (t === 'ended' || t === 'stop') { var x = document.getElementById('mnBanner'); if (x) x.remove(); } });
            } catch (x) { }
        }
    };
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

    /* ---------------- التشغيل والاستعادة ---------------- */
    async function init() {
        try { fired = await db.fired(); } catch (e) { fired = {}; }
        try { tests = (await db.get('tests')) || []; } catch (e) { tests = []; }
        try { if (MN.settings && MN.settings.restore) await MN.settings.restore(); } catch (e) { }
        MN.ready = true;
        await MN.reschedule('boot', true);
        if (MN.settings.get().keepAlive && window.MuslimAudio) { /* يتطلب لمسة مستخدم؛ يُستأنف عند أول لمسة */
            document.addEventListener('pointerdown', function once() { document.removeEventListener('pointerdown', once, true); try { MuslimAudio.keepAlive.start(); } catch (e) { } }, true);
        }
    }
    function resume(why) { if (!MN.ready) return; fired = fired || {}; tick(); if (Date.now() - built > 30 * 60e3) MN.reschedule(why, false); }
    document.addEventListener('visibilitychange', function () { if (visible()) resume('visible'); });
    window.addEventListener('focus', function () { resume('focus'); });
    window.addEventListener('pageshow', function () { resume('pageshow'); });
    window.addEventListener('online', function () { resume('online'); });
    document.addEventListener('muslimLocChanged', function () { MN.reschedule('location'); });
    if (navigator.serviceWorker) navigator.serviceWorker.addEventListener('message', function (ev) {
        var d = ev.data || {};
        if (d.type === 'notify-fired' && d.id) fired[d.id] = Date.now();
    });

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 900); });
    else setTimeout(init, 900);
})();
