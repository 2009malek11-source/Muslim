/* =====================================================================
   Service Worker — المسلم (V106)
   - الصفحات والملفات المحلية: stale-while-revalidate (فتح فوري + تحديث بالخلفية).
   - الخطوط (Google Fonts): تُخزَّن بعد أول تحميل لتعمل بلا إنترنت.
   - الصوت/الفيديو/الـ API الخارجي: لا نتدخل (يمنع مشاكل Range وiOS).
   - الإشعارات: عرض + فتح التطبيق عند النقر + فحص تذكيرات دوري (حيث يدعمه المتصفح).
   - لا تُحذف مخازن muslim-audio / muslim-files / muslim-config (تنزيلات المستخدم وإعداداته).
   ===================================================================== */
const CACHE='muslim-cache-v111';
const FONTS='muslim-fonts-v1';
const CORE=['./','./index.html','./manifest.json','./style.css','./script.js','./app-config.js','./icon.png','./icon-192.png','./icon-512.png','./splash-program.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.indexOf('muslim-cache')===0&&k!==CACHE).map(k=>caches.delete(k)));
    if(self.registration.navigationPreload)try{await self.registration.navigationPreload.enable()}catch(_){}
    await self.clients.claim();
    const cs=await self.clients.matchAll({type:'window'});cs.forEach(c=>c.postMessage({t:'updated'}));
  })());
});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='skip-waiting')self.skipWaiting()});
function put(cache,req,res){if(res&&res.status===200&&(res.type==='basic'||res.type==='cors')){const c=res.clone();caches.open(cache).then(ca=>ca.put(req,c)).catch(()=>{})}return res}
/* نسخة محفوظة فورًا + تحديث بالخلفية */
function swr(e,cache){
  const req=e.request;
  return caches.match(req,{ignoreSearch:req.mode==='navigate'}).then(hit=>{
    const net=fetch(req).then(r=>put(cache,req,r)).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return net.then(r=>r||(req.mode==='navigate'?caches.match('./index.html'):Response.error()));
  });
}
/* HTML/JS/CSS: الشبكة أولًا بمهلة قصيرة ثم النسخة المحفوظة — فيصلك أحدث إصدار فورًا ويعمل بلا إنترنت */
function netFirst(e){
  const req=e.request;
  return new Promise(res=>{
    let done=false;
    const t=setTimeout(()=>{caches.match(req,{ignoreSearch:req.mode==='navigate'}).then(h=>{if(h&&!done){done=true;res(h)}})},1800);
    fetch(req).then(r=>{clearTimeout(t);put(CACHE,req,r);if(!done){done=true;res(r)}}).catch(()=>{
      clearTimeout(t);if(done)return;
      caches.match(req,{ignoreSearch:req.mode==='navigate'}).then(h=>{done=true;res(h||(req.mode==='navigate'?caches.match('./index.html'):Response.error()))});
    });
  });
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  if(req.headers.has('range')||req.destination==='audio'||req.destination==='video')return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    if(url.pathname.endsWith('/sw.js')||url.pathname.endsWith('/service-worker.js'))return;
    const d=req.destination;
    if(req.mode==='navigate'||d==='script'||d==='style'||d==='document'){e.respondWith(netFirst(e));return}
    e.respondWith(swr(e,CACHE));return;
  }
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){e.respondWith(swr(e,FONTS))}
});
/* ---------- الإشعارات ---------- */
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const page=(e.notification.data&&e.notification.data.open)||'daily';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if('focus' in c){c.postMessage({type:'open',page});return c.focus()}}
    return self.clients.openWindow('./?open='+encodeURIComponent(page));
  }));
});
/* فحص التذكيرات في الخلفية (Periodic Background Sync — Chrome/Edge للتطبيق المثبّت) */
async function checkReminders(){
  try{
    const c=await caches.open('muslim-config-v1'),r=await c.match('./__reminders.json');if(!r)return;
    const cfg=await r.json(),now=new Date(),day=now.getDay(),k=now.getFullYear()+'-'+('0'+(now.getMonth()+1)).slice(-2)+'-'+('0'+now.getDate()).slice(-2);
    const fired=cfg.fired||{};let changed=false;
    for(const d of cfg.list||[]){
      if(d.days&&d.days.indexOf(day)<0)continue;
      const hm=String(d.time||'').split(':'),at=new Date(now.getFullYear(),now.getMonth(),now.getDate(),+hm[0],+hm[1],0).getTime();
      if(!(at<=now.getTime()&&at>=now.getTime()-2*3600e3)||fired[d.id]===k)continue;
      await self.registration.showNotification('حان وقت: '+d.t,{body:d.b||'',tag:'deed-'+d.id,icon:'./icon-192.png',badge:'./icon-192.png',lang:'ar',dir:'rtl',data:{open:'daily'}});
      fired[d.id]=k;changed=true;
    }
    if(changed){cfg.fired=fired;await c.put('./__reminders.json',new Response(JSON.stringify(cfg),{headers:{'Content-Type':'application/json'}}))}
  }catch(_){}
}
self.addEventListener('periodicsync',e=>{if(e.tag==='muslim-reminders')e.waitUntil(checkReminders())});
