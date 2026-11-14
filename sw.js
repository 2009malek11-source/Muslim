/* sw.js — Service Worker «المسلم»  (يُولَّد من _dev/sw.template.js بواسطة _dev/build.py — لا تعدّله يدوياً)
 * سياسة التحديث (واحدة وواضحة):
 *  1) التثبيت لا يكتمل حتى تُنزَّل كل ملفات النسخة الجديدة بنجاح؛ وإلا يبقى القديم سليماً ويُعاد المحاولة لاحقاً.
 *  2) عند التفعيل: تُحذف الكاشات القديمة، ويستولي الـ SW على الصفحات، فتُعاد الصفحة مرة واحدة إلى النسخة الجديدة.
 *  3) صفحة التنقّل (index.html): الشبكة أولاً (إعادة تحقق دائماً) مع مهلة 3 ثوانٍ ثم نسخة هذا الإصدار نفسه فقط.
 *     لا يُعاد أبداً أي إصدار أقدم (أُزيلت دالة legacyShell التي كانت تُظهر نسخاً قديمة بلا مصحف).
 */
const BID = '23a96d8591', BT = 1794631645;
const CACHE = 'muslim-shell-' + BID;
const FONTS = 'muslim-fonts-v1';
const CORE = ["./", "./index.html", "./manifest.json", "./app-config.5438345603.js?h=5438345603", "./style.782c53b7fb.css?h=782c53b7fb", "./script.09b8869e46.js?h=09b8869e46", "./assistant-cmd.2559bdf697.js?h=2559bdf697", "./travel.29a9f31f1a.js?h=29a9f31f1a", "./reciters-nationality.0f368e57f8.js?h=0f368e57f8", "./playlist.29cb6d27a9.js?h=29cb6d27a9", "./app107.382beae071.css?h=382beae071", "./adhan-config.409fbf9787.js?h=409fbf9787", "./prayer.c5beb1abed.js?h=c5beb1abed", "./push-client.4214f64b48.js?h=4214f64b48", "./audio-manager.6c123ab5bd.js?h=6c123ab5bd", "./notifications.ccce094b18.js?h=ccce094b18", "./notification-settings.bc601aaa58.js?h=bc601aaa58", "./prayer-notifications.610021a76a.js?h=610021a76a", "./iqama-notifications.8e8180306f.js?h=8e8180306f", "./adhkar-notifications.a924207814.js?h=a924207814", "./backgrounds.23ef74adcf.js?h=23ef74adcf", "./updater.7398951739.js?h=7398951739", "./calendar.abb99a59d5.js?h=abb99a59d5", "./mushaf.16e40563ce.js?h=16e40563ce", "./hadith107.d369358c44.js?h=d369358c44", "./mosques.23a604f42d.js?h=23a604f42d", "./abloop.aa1b7fb463.js?h=aa1b7fb463", "./qibla.07d4df4660.js?h=07d4df4660", "./app107.e899836125.js?h=e899836125", "./ic-192.png", "./ic-512.png"];
const KEEP = ['muslim-audio', 'muslim-files', 'muslim-config', 'muslim-hadith', 'muslim-human-audio', 'muslim-adhkar-audio', 'muslim-data', 'muslim-v80-ruqyah', 'muslim-fonts', 'muslim-notify'];
const keepName = k => k === CACHE || KEEP.some(p => k.indexOf(p) === 0);
const cm = (req, opt) => caches.open(CACHE).then(c => c.match(req, opt));

const SOFT = ["./bg-1-t.jpg", "./bg-2-t.jpg", "./bg-3-t.jpg", "./bg-4-t.jpg", "./bg-5-t.jpg", "./bg-6-t.jpg", "./bg-7-t.jpg", "./bg-8-t.jpg", "./bg-9-t.jpg", "./bg-10-t.jpg", "./bg-11-t.jpg", "./bg-12-t.jpg", "./bg-13-t.jpg", "./bg-14-t.jpg", "./bg-15-t.jpg", "./bg-16-t.jpg", "./adhan-libya-takbeer.mp3", "./adhan-makkah-takbeer.mp3", "./adhan-qatami-takbeer.mp3"];
function fetchT(u, ms) {
    const ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const t = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(new Request(u, { cache: 'reload' }), ac ? { signal: ac.signal } : undefined).finally(() => clearTimeout(t));
}
/* تنزيل تدريجي: الملفات التي لم يتغير محتواها (نفس ?h=) تُنسخ من الكاش السابق بلا تنزيل؛ ينزَّل المتغيّر فقط.
   هذا ما يجعل التحديث ممكناً مع الإنترنت الضعيف. */
async function precache() {
    const c = await caches.open(CACHE);
    const olds = (await caches.keys()).filter(k => /^muslim-shell-/.test(k) && k !== CACHE);
    const bad = [];
    for (const u of CORE) {
        if (await c.match(u)) continue;
        let ok = false;
        if (/\?h=/.test(u)) {
            for (const k of olds) { try { const h = await (await caches.open(k)).match(u); if (h) { await c.put(u, h); ok = true; break; } } catch (_) { } }
        }
        for (let i = 0; i < 4 && !ok; i++) {
            try { const r = await fetchT(u, 30000); if (r && r.ok) { await c.put(u, r); ok = true; break; } } catch (_) { }
            await new Promise(r => setTimeout(r, 800 * (i + 1)));
        }
        if (!ok) bad.push(u);
    }
    if (bad.length) throw new Error('precache failed: ' + bad.join(','));
}
async function precacheSoft() {
    const c = await caches.open(CACHE);
    for (const u of SOFT) { try { if (await c.match(u)) continue; const r = await fetchT(u, 30000); if (r && r.ok) await c.put(u, r); } catch (_) { } }
}
self.addEventListener('install', e => {
    e.waitUntil(precache().then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil((async () => {
        const ks = await caches.keys();
        const hadOld = ks.some(k => /^muslim-shell-/.test(k) && k !== CACHE);
        await Promise.all(ks.filter(k => !keepName(k)).map(k => caches.delete(k)));
        try { const c = await caches.open('muslim-config-v1'); await c.delete('./__prayer.json'); } catch (_) { }
        await self.clients.claim();
        if (hadOld) {
            const cs = await self.clients.matchAll({ type: 'window' });
            cs.forEach(c => c.postMessage({ t: 'updated', type: 'updated', b: BID, bt: BT }));
        }
        precacheSoft();
        await checkDue('activate');
    })());
});
self.addEventListener('message', e => {
    const d = e.data || {};
    if (d.type === 'skip-waiting') self.skipWaiting();
    if (d.type === 'get-bid' && e.source) e.source.postMessage({ t: 'bid', b: BID, bt: BT });
    if (d.type === 'notify-sync' || d.type === 'wake') e.waitUntil(checkDue('message'));
    if (d.type === 'reminders-updated') e.waitUntil(checkReminders());
});
function put(cache, key, res) {
    if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        const copy = res.clone();
        return caches.open(cache).then(c => c.put(key, copy)).then(() => res).catch(() => res);
    }
    return Promise.resolve(res);
}
function cacheFirst(e) {
    return cm(e.request).then(hit => hit || fetch(e.request).then(r => put(CACHE, e.request, r)));
}
function navigate(e) {
    const req = e.request;
    const net = fetch(new Request(req.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'follow' }));
    const fallback = () => cm('./index.html').then(h => h || cm('./'));
    return new Promise(resolve => {
        let done = false;
        const t = setTimeout(() => { fallback().then(h => { if (h && !done) { done = true; resolve(h); } }); }, 3000);
        net.then(r => { if (!done) { done = true; clearTimeout(t); resolve(r.ok ? r : (fallback().then(h => h || r))); } },
            () => { clearTimeout(t); if (!done) fallback().then(h => { done = true; resolve(h || new Response('<meta charset=utf-8><body dir=rtl style="font-family:sans-serif;padding:2em">لا يوجد اتصال، ولم يُنزَّل التطبيق بعد. اتصل بالإنترنت مرة واحدة ثم أعد المحاولة.</body>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })); }); });
        e.waitUntil(net.catch(() => { }));
    });
}
function swr(e) {
    return cm(e.request).then(hit => {
        const net = fetch(e.request).then(r => put(CACHE, e.request, r)).catch(() => null);
        if (hit) { e.waitUntil(net); return hit; }
        return net.then(r => r || Response.error());
    });
}
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    if (req.headers.has('range') || req.destination === 'audio' || req.destination === 'video') return;
    const url = new URL(req.url), d = req.destination;
    if (url.origin === self.location.origin) {
        const p = url.pathname;
        if (p.endsWith('/sw.js') || p.endsWith('/service-worker.js') || p.endsWith('/build.json') || p.endsWith('/version.json')) return;
        if (req.mode === 'navigate' || d === 'document') {
            e.waitUntil(checkDue('navigate'));
            e.respondWith(navigate(e));
            return;
        }
        if (url.searchParams.has('h') && (d === 'script' || d === 'style' || d === '')) { e.respondWith(cacheFirst(e)); return; }
        if (/\.(mp3|m4a|ogg|wav)$/.test(p)) return;
        e.respondWith(swr(e));
        return;
    }
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        e.respondWith(caches.open(FONTS).then(c => c.match(req)).then(hit => { const net = fetch(req).then(r => put(FONTS, req, r)).catch(() => null); if (hit) { e.waitUntil(net); return hit; } return net.then(r => r || Response.error()); }));
    }
});

/* ===== جدول التنبيهات المحلي (يقرأ IndexedDB التي تكتبها الصفحة) ===== */
function idb() {
    return new Promise((res, rej) => {
        const r = indexedDB.open('muslim-notify', 1);
        r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv'); if (!d.objectStoreNames.contains('events')) d.createObjectStore('events', { keyPath: 'id' }); if (!d.objectStoreNames.contains('fired')) d.createObjectStore('fired'); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
}
function idbRun(db, stores, mode, fn) {
    return new Promise((res, rej) => { const t = db.transaction(stores, mode); let out; try { out = fn(t); } catch (e) { rej(e); return; } t.oncomplete = () => res(out && typeof out === 'object' && 'result' in out ? out.result : out); t.onerror = t.onabort = () => rej(t.error); });
}
let checking = false;
async function checkDue(src) {
    if (checking) return; checking = true;
    try {
        if (!('indexedDB' in self)) return;
        const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        if (cs.some(c => c.visibilityState === 'visible')) return;          // الصفحة المفتوحة تتولى الأمر بنفسها
        const db = await idb();
        try {
            const settings = await idbRun(db, 'kv', 'readonly', t => t.objectStore('kv').get('settings'));
            if (!settings || !settings.master || settings.notify === false) return;
            const events = await idbRun(db, 'events', 'readonly', t => t.objectStore('events').getAll());
            const fired = {};
            await idbRun(db, 'fired', 'readonly', t => { const rq = t.objectStore('fired').openCursor(); rq.onsuccess = () => { const c = rq.result; if (c) { fired[c.key] = c.value; c.continue(); } }; return { get result() { return fired; } }; });
            const now = Date.now();
            for (const ev of events) {
                if (fired[ev.id] || ev.t > now || now - ev.t > (ev.grace || 300000)) continue;
                const vib = !(settings.sound && settings.sound.vibrate === false);
                try {
                    await self.registration.showNotification(ev.title, { body: ev.body || '', tag: ev.id, icon: ICON, badge: ICON, lang: 'ar', dir: 'rtl', vibrate: vib ? [250, 120, 250] : undefined, requireInteraction: ev.kind === 'adhan' || ev.kind === 'iqama', data: { open: ev.open || 'prayer', adhan: ev.kind === 'adhan', key: ev.prayer || ev.key || '', t: ev.t, id: ev.id, kind: ev.kind } });
                    await idbRun(db, 'fired', 'readwrite', t => { t.objectStore('fired').put(Date.now(), ev.id); });
                } catch (_) { }
            }
        } finally { db.close(); }
    } catch (_) { } finally { checking = false; }
}
const ICON = './ic-192.png';
function safeOpen(o) { return /^[a-zA-Z0-9_-]{2,24}$/.test(o || '') ? o : 'daily'; }
self.addEventListener('notificationclick', e => {
    e.notification.close();
    const d = e.notification.data || {}, page = safeOpen(d.open), adhan = d.adhan && d.key ? String(d.key) : '';
    e.waitUntil((async () => {
        try {
            const scope = self.registration.scope;
            const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            for (const c of cs) {
                if (c.url.indexOf(scope) === 0 && 'focus' in c) {
                    c.postMessage({ type: 'open', page, adhan });
                    return await c.focus();
                }
            }
            return await self.clients.openWindow(scope + '?open=' + encodeURIComponent(page) + (adhan ? '&adhan=' + encodeURIComponent(adhan) : ''));
        }
        catch (_) { }
    })());
});
self.addEventListener('push', e => {
    let d = {};
    try {
        d = e.data ? e.data.json() : {};
    }
    catch (_) {
        try {
            d = { title: e.data.text() };
        }
        catch (__) {
            d = {};
        }
    }
    const opt = { body: String(d.body || ''), tag: String(d.tag || 'push'), icon: ICON, badge: ICON, lang: 'ar', dir: 'rtl', vibrate: [200, 100, 200], renotify: false,
        requireInteraction: d.kind === 'at', data: { open: safeOpen(d.open), adhan: !!d.adhan, key: String(d.key || ''), t: +d.t || 0, kind: String(d.kind || '') } };
    e.waitUntil((async () => {
        try {
            await self.registration.showNotification(String(d.title || 'المسلم'), opt);
        }
        catch (_) {
            try {
                await self.registration.showNotification('المسلم', { body: opt.body, tag: opt.tag, icon: ICON });
            }
            catch (__) { }
        }
        try {
            const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
            cs.forEach(c => { if (c.visibilityState === 'visible')
                c.postMessage({ type: 'push', adhan: !!d.adhan, key: String(d.key || ''), t: +d.t || 0, open: safeOpen(d.open) }); });
        }
        catch (_) { }
    })());
});
function b64u8(b) { b = String(b).replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4)
    b += '='; const s = atob(b), o = new Uint8Array(s.length); for (let i = 0; i < s.length; i++)
    o[i] = s.charCodeAt(i); return o; }
self.addEventListener('pushsubscriptionchange', e => {
    e.waitUntil((async () => {
        try {
            const c = await caches.open('muslim-config-v1'), r = await c.match('./__push.json');
            if (!r)
                return;
            const cfg = await r.json();
            if (!cfg.on || !cfg.api || !cfg.key)
                return;
            const sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u8(cfg.key) });
            const body = Object.assign({}, cfg.payload || {}, { subscription: sub.toJSON() });
            const res = await fetch(cfg.api + '/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) {
                cfg.syncedAt = Date.now();
                await c.put('./__push.json', new Response(JSON.stringify(cfg), { headers: { 'Content-Type': 'application/json' } }));
            }
        }
        catch (_) { }
    })());
});
async function pushActive() {
    try {
        const c = await caches.open('muslim-config-v1'), r = await c.match('./__push.json');
        if (!r)
            return false;
        const j = await r.json();
        if (!j.on || !j.api)
            return false;
        if (Date.now() - (j.syncedAt || 0) > 8 * 864e5)
            return false;
        return !!(await self.registration.pushManager.getSubscription());
    }
    catch (_) {
        return false;
    }
}
async function fireFile(cache, name, window_ms) {
    const r = await cache.match(name);
    if (!r)
        return;
    const cfg = await r.json(), now = Date.now(), fired = cfg.fired || {};
    let changed = false;
    for (const ev of cfg.events || []) {
        if (fired[ev.tag])
            continue;
        if (ev.t <= now && ev.t >= now - window_ms) {
            await self.registration.showNotification(ev.title, { body: ev.body || '', tag: ev.tag, icon: './ic-192.png', badge: './ic-192.png', lang: 'ar', dir: 'rtl', vibrate: [200, 100, 200], requireInteraction: ev.kind === 'at', data: { open: ev.kind === 'greet' ? 'home' : 'prayer' } });
            fired[ev.tag] = 1;
            changed = true;
        }
    }
    if (changed) {
        cfg.fired = fired;
        await cache.put(name, new Response(JSON.stringify(cfg), { headers: { 'Content-Type': 'application/json' } }));
    }
}
async function checkReminders() {
    try {
        if (await pushActive())
            return;
        const c = await caches.open('muslim-config-v1');
        await fireFile(c, './__greet.json', 6 * 3600e3);
        const r = await c.match('./__reminders.json');
        if (!r)
            return;
        const cfg = await r.json(), now = new Date(), day = now.getDay(), k = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
        const fired = cfg.fired || {};
        let changed = false;
        for (const d of cfg.list || []) {
            if (d.days && d.days.indexOf(day) < 0)
                continue;
            const hm = String(d.time || '').split(':'), at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hm[0], +hm[1], 0).getTime();
            if (!(at <= now.getTime() && at >= now.getTime() - 2 * 3600e3) || fired[d.id] === k)
                continue;
            await self.registration.showNotification('حان وقت: ' + d.t, { body: d.b || '', tag: 'deed-' + d.id, icon: './ic-192.png', badge: './ic-192.png', lang: 'ar', dir: 'rtl', data: { open: 'daily' } });
            fired[d.id] = k;
            changed = true;
        }
        if (changed) {
            cfg.fired = fired;
            await c.put('./__reminders.json', new Response(JSON.stringify(cfg), { headers: { 'Content-Type': 'application/json' } }));
        }
    }
    catch (_) { }
}
self.addEventListener('periodicsync', e => {
    if (e.tag === 'muslim-notify-check') e.waitUntil(Promise.all([checkDue('periodic'), checkReminders()]));
    else if (e.tag === 'muslim-reminders' || e.tag === 'muslim-prayer') e.waitUntil(checkReminders());
});
