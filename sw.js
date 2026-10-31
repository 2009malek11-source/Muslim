const BID = '6618fa17f0';
const APPFILE = 'a-6618fa17f0.html';
const CACHE = 'muslim-shell-' + BID;
const FONTS = 'muslim-fonts-v1';
const CORE = ["./", "./index.html", "./a-6618fa17f0.html", "./manifest.json", "./app-config.js?h=6618fa17f0", "./script.js?h=6618fa17f0", "./assistant-cmd.js?h=6618fa17f0", "./travel.js?h=6618fa17f0", "./adhan-config.js?h=6618fa17f0", "./prayer.js?h=6618fa17f0", "./mushaf.js?h=6618fa17f0", "./hadith107.js?h=6618fa17f0", "./mosques.js?h=6618fa17f0", "./abloop.js?h=6618fa17f0", "./qibla.js?h=6618fa17f0", "./app107.js?h=6618fa17f0", "./style.css?h=6618fa17f0", "./app107.css?h=6618fa17f0"];
self.addEventListener('install', e => {
    e.waitUntil(Promise.race([precache().catch(() => { }), new Promise(r => setTimeout(r, 8000))]).then(() => self.skipWaiting()));
});
async function shellReady() { const c = await caches.open(CACHE); return !!(await c.match('./index.html')) && !!(await c.match('./' + APPFILE)); }
async function cleanup() {
    if (!(await shellReady()))
        return false;
    const keys = await caches.keys(), stale = keys.filter(k => !keepName(k));
    await Promise.all(stale.map(k => caches.delete(k)));
    return stale;
}
self.addEventListener('activate', e => {
    e.waitUntil((async () => {
        if (self.registration.navigationPreload)
            try {
                await self.registration.navigationPreload.disable();
            }
            catch (_) { }
        const before = (await caches.keys()).filter(k => !keepName(k));
        await cleanup();
        await self.clients.claim();
        if (before.some(k => !/^muslim-shell-/.test(k))) {
            const cs = await self.clients.matchAll({ type: 'window' });
            cs.forEach(c => { try {
                c.navigate(c.url);
            }
            catch (_) { } });
        }
    })());
});
async function precache() {
    const c = await caches.open(CACHE);
    const todo = [];
    for (const u of CORE) {
        if (!(await c.match(u)))
            todo.push(u);
    }
    todo.sort((a, b) => (/index\.html|app-|\.\/$/.test(a) ? 0 : 1) - (/index\.html|app-|\.\/$/.test(b) ? 0 : 1));
    for (let i = 0; i < todo.length; i += 3) {
        await Promise.all(todo.slice(i, i + 3).map(u => fetch(new Request(u, { cache: 'reload' })).then(r => { if (r && r.status === 200)
            return c.put(u === './' ? './index.html' : u, r); }).catch(() => { })));
    }
    await cleanup();
}
self.addEventListener('message', e => {
    const d = e.data || {};
    if (d.type === 'skip-waiting')
        self.skipWaiting();
    if (d.type === 'warm')
        e.waitUntil(precache());
});
async function legacyShell() {
    for (const k of await caches.keys()) {
        if (k === CACHE || keepName(k))
            continue;
        const r = await (await caches.open(k)).match('./index.html');
        if (r)
            return r;
    }
    return new Response('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="font-family:sans-serif;background:#0b3a2f;color:#fff;text-align:center;padding:40px;direction:rtl"><h2>المسلم</h2><p>لا يوجد اتصال، وهذه أول مرة تُفتح فيها هذه النسخة.<br>افتح التطبيق مرة واحدة مع الإنترنت ليُحفظ للعمل بلا اتصال.</p><button onclick="location.reload()" style="padding:10px 24px;font-size:16px;border:0;border-radius:10px">إعادة المحاولة</button>', { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
const cm = (req, opt) => caches.open(CACHE).then(c => c.match(req, opt));
const KEEP = ['muslim-audio', 'muslim-files', 'muslim-config', 'muslim-hadith', 'muslim-human-audio', 'muslim-adhkar-audio', 'muslim-data', 'muslim-v80-ruqyah', 'muslim-fonts'];
const keepName = k => k === CACHE || KEEP.some(p => k.indexOf(p) === 0);
function put(cache, key, res) { if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
    const c = res.clone();
    caches.open(cache).then(ca => ca.put(key, c)).catch(() => { });
} return res; }
function cacheFirst(e) {
    const req = e.request;
    return cm(req).then(h => h || fetch(req).then(r => put(CACHE, req, r)).catch(() => Response.error()));
}
function netFirst(e) {
    const req = e.request, nav = req.mode === 'navigate', isQr = /\/qr\.png$/.test(new URL(req.url).pathname);
    const key = nav ? new Request(new URL('./index.html', self.registration.scope).href) : (isQr ? new Request(new URL('./qr.png', self.registration.scope).href) : req);
    const opt = {};
    const wait = nav ? 4500 : 3000;
    return new Promise(res => {
        let done = false, stale = null;
        const find = () => cm(key, opt);
        const t = setTimeout(() => { find().then(h => { if (h && !done) {
            done = true;
            stale = h;
            res(h);
        } }); }, wait);
        fetch(req, { cache: 'no-cache' }).then(r => {
            clearTimeout(t);
            if (r && r.status === 200) {
                if (done && stale) {
                    const a = r.headers.get('etag') || r.headers.get('last-modified'), b = stale.headers.get('etag') || stale.headers.get('last-modified');
                    if (!a || !b || a !== b)
                        self.clients.matchAll({ type: 'window' }).then(cs => cs.forEach(c => c.postMessage({ t: 'updated' }))).catch(() => { });
                }
                put(CACHE, key, r);
            }
            if (!done) {
                done = true;
                res(r);
            }
        }).catch(() => {
            clearTimeout(t);
            if (done)
                return;
            find().then(h => { done = true; (h ? Promise.resolve(h) : (nav ? cm('./index.html').then(x => x || legacyShell()) : Promise.resolve(Response.error()))).then(res); });
        });
    });
}
function swr(e) {
    const req = e.request;
    return cm(req).then(hit => {
        const net = fetch(req, { cache: 'no-cache' }).then(r => put(CACHE, req, r)).catch(() => null);
        if (hit) {
            e.waitUntil(net);
            return hit;
        }
        return net.then(r => r || Response.error());
    });
}
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET')
        return;
    if (req.headers.has('range') || req.destination === 'audio' || req.destination === 'video')
        return;
    const url = new URL(req.url), d = req.destination;
    if (url.origin === self.location.origin) {
        const p = url.pathname;
        if (p.endsWith('/sw.js') || p.endsWith('/service-worker.js') || p.endsWith('/build.json'))
            return;
        if (/\/a-[0-9a-f]+\.html$/.test(p) || ((d === 'script' || d === 'style' || d === '') && url.searchParams.has('h'))) {
            e.respondWith(cacheFirst(e));
            return;
        }
        if (req.mode === 'navigate' || d === 'document' || d === 'script' || d === 'style' || d === 'manifest' || p.endsWith('manifest.json') || /\/qr\.png$/.test(p)) {
            e.respondWith(netFirst(e));
            return;
        }
        e.respondWith(swr(e));
        return;
    }
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        e.respondWith(caches.open(FONTS).then(c => c.match(req)).then(hit => { const net = fetch(req).then(r => put(FONTS, req, r)).catch(() => null); if (hit) {
            e.waitUntil(net);
            return hit;
        } return net.then(r => r || Response.error()); }));
    }
});
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
        const c = await caches.open('muslim-config-v1');
        await fireFile(c, './__prayer.json', 25 * 60000);
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
self.addEventListener('periodicsync', e => { if (e.tag === 'muslim-reminders' || e.tag === 'muslim-prayer')
    e.waitUntil(checkReminders()); });
