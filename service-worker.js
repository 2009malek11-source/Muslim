const CACHE='muslim-cache-v104';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./splash-program.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k.indexOf('muslim-cache')===0).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  /* الصوت والفيديو وطلبات Range تذهب مباشرة للشبكة (لا تُخزَّن) */
  if(req.headers.has('range')||req.destination==='audio'||req.destination==='video')return;
  e.respondWith(
    fetch(req).then(r=>{
      if(r&&r.status===200&&(r.type==='basic'||r.type==='cors')){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}
      return r;
    }).catch(()=>caches.match(req).then(x=>x||(req.mode==='navigate'?caches.match('./index.html'):undefined)))
  );
});
