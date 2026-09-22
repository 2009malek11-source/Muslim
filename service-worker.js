const CACHE='muslim-shell-v53';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const u=new URL(e.request.url);if(u.origin===location.origin&&r.ok){const copy=r.clone();caches.open(CACHE).then(x=>x.put(e.request,copy)).catch(()=>{});}return r}).catch(()=>caches.match('./index.html'))));});
