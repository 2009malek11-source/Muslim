/* =====================================================================
   Service Worker — المسلم (V115)
   - الصفحة: الشبكة أولًا (no-cache) بمهلة ثم المحفوظ؛ ملفات JS/CSS بإصدار ثابت ?v= من الكاش فورًا؛ تثبيت فوري.
   - الخطوط (Google Fonts): تُخزَّن بعد أول تحميل لتعمل بلا إنترنت.
   - الصوت/الفيديو/الـ API الخارجي: لا نتدخل (يمنع مشاكل Range وiOS).
   - الإشعارات: Web Push حقيقي من الخادم (حدث push) يظهر والموقع مغلق + فتح القسم الصحيح عند النقر
     + تجديد الاشتراك تلقائيًا (pushsubscriptionchange) + احتياط محلي (Periodic Sync) يتوقف حين يكون الخادم فعّالًا.
   - لا تُحذف مخازن muslim-audio / muslim-files / muslim-config (تنزيلات المستخدم وإعداداته).
   ===================================================================== */
const VER='115.5';
const CACHE='muslim-cache-v'+VER;
const FONTS='muslim-fonts-v1';
/* ملفات الواجهة بإصدار ثابت في الرابط (?v=): كل إصدار جديد = روابط جديدة، فلا يختلط قديم بجديد أبدًا */
const CORE=['./','./index.html','./manifest.json','./app-config.js?v=115.5','./script.js?v=115.5','./adhan-config.js?v=115.5','./prayer.js?v=115.5','./push-client.js?v=115.5','./mushaf.js?v=115.5','./hadith107.js?v=115.5','./mosques.js?v=115.5','./abloop.js?v=115.5','./qibla.js?v=115.5','./app107.js?v=115.5','./style.css?v=115.5','./app107.css?v=115.5'];
/* ---- أسباب «ظهور النسخة القديمة» سابقًا وعلاجها ----
   1) التثبيت كان ينتظر تنزيل كل الملفات (أكثر من ميغابايت) قبل التسلّم ⇒ يبقى القديم 30–120 ثانية مع الإنترنت الضعيف.
      الآن: التثبيت والتفعيل فوريان، والتخزين المسبق يجري لاحقًا في الخلفية (رسالة warm).
   2) طلبات الصفحة كانت تمرّ على كاش المتصفح (GitHub Pages يحدّد 10 دقائق) فتعود نسخة وسطى.
      الآن: كل الطلبات تُرسَل بـ cache:'no-cache' (تحقق سريع 304 إن لم يتغير شيء).
   3) ثلاث آليات تحديث/إعادة تحميل متداخلة. الآن: آلية واحدة (controllerchange + رسالة updated) بحارس واحد. */
self.addEventListener('install',e=>{e.waitUntil(self.skipWaiting())});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.indexOf('muslim-cache')===0&&k!==CACHE).map(k=>caches.delete(k)));
    if(self.registration.navigationPreload)try{await self.registration.navigationPreload.disable()}catch(_){}
    await self.clients.claim();
  })());
});
/* تخزين مسبق هادئ بعد فتح الصفحة (لا يؤخر التحديث ولا عرض الصفحة) */
async function precache(){
  const c=await caches.open(CACHE);
  const todo=[];
  for(const u of CORE){if(!(await c.match(u)))todo.push(u)}
  for(let i=0;i<todo.length;i+=3){
    await Promise.all(todo.slice(i,i+3).map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(r&&r.status===200)return c.put(u==='./'?'./index.html':u,r)}).catch(()=>{})));
  }
}
self.addEventListener('message',e=>{
  const d=e.data||{};
  if(d.type==='skip-waiting')self.skipWaiting();
  if(d.type==='warm')e.waitUntil(precache());
});
function put(cache,key,res){if(res&&res.status===200&&(res.type==='basic'||res.type==='cors')){const c=res.clone();caches.open(cache).then(ca=>ca.put(key,c)).catch(()=>{})}return res}
/* ملف بإصدار ثابت: من الكاش فورًا، وإلا من الشبكة ثم يُخزَّن */
function cacheFirst(e){
  const req=e.request;
  return caches.match(req).then(h=>h||fetch(req).then(r=>put(CACHE,req,r)).catch(()=>Response.error()));
}
/* الصفحة وما قد يتغير بلا إصدار (manifest، qr.png): الشبكة أولًا بتحقق no-cache.
   إن تأخرت الشبكة نعرض المحفوظ ثم نُبلغ الصفحة بوجود تحديث عند وصول الجديد (دون تحويل قسري مزدوج). */
function netFirst(e){
  const req=e.request,nav=req.mode==='navigate',isQr=/\/qr\.png$/.test(new URL(req.url).pathname);
  /* مفتاح موحّد: الصفحة = index.html، والـ QR = qr.png بلا رقم (فلا تتراكم نسخ قديمة) */
  const key=nav?new Request(new URL('./index.html',self.registration.scope).href):(isQr?new Request(new URL('./qr.png',self.registration.scope).href):req);
  const opt={};
  const wait=nav?4500:3000;
  return new Promise(res=>{
    let done=false,stale=null;
    const find=()=>caches.match(key,opt);
    const t=setTimeout(()=>{find().then(h=>{if(h&&!done){done=true;stale=h;res(h)}})},wait);
    fetch(req,{cache:'no-cache'}).then(r=>{
      clearTimeout(t);
      if(r&&r.status===200){
        if(done&&stale){
          const a=r.headers.get('etag')||r.headers.get('last-modified'),b=stale.headers.get('etag')||stale.headers.get('last-modified');
          if(!a||!b||a!==b)self.clients.matchAll({type:'window'}).then(cs=>cs.forEach(c=>c.postMessage({t:'updated'}))).catch(()=>{});
        }
        put(CACHE,key,r);
      }
      if(!done){done=true;res(r)}
    }).catch(()=>{
      clearTimeout(t);if(done)return;
      find().then(h=>{done=true;res(h||(nav?caches.match('./index.html'):Response.error()))});
    });
  });
}
/* بقية الملفات المحلية (صور وأيقونات…): نسخة محفوظة فورًا + تحديث بالخلفية */
function swr(e){
  const req=e.request;
  return caches.match(req).then(hit=>{
    const net=fetch(req,{cache:'no-cache'}).then(r=>put(CACHE,req,r)).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return net.then(r=>r||Response.error());
  });
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  if(req.headers.has('range')||req.destination==='audio'||req.destination==='video')return;
  const url=new URL(req.url),d=req.destination;
  if(url.origin===self.location.origin){
    const p=url.pathname;
    if(p.endsWith('/sw.js')||p.endsWith('/service-worker.js'))return;
    if((d==='script'||d==='style')&&url.searchParams.has('v')){e.respondWith(cacheFirst(e));return}
    if(req.mode==='navigate'||d==='document'||d==='script'||d==='style'||d==='manifest'||p.endsWith('manifest.json')||/\/qr\.png$/.test(p)){e.respondWith(netFirst(e));return}
    e.respondWith(swr(e));return;
  }
  if(url.hostname==='fonts.googleapis.com'||url.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(req).then(hit=>{const net=fetch(req).then(r=>put(FONTS,req,r)).catch(()=>null);if(hit){e.waitUntil(net);return hit}return net.then(r=>r||Response.error())}));
  }
});
/* ---------- الإشعارات ---------- */
const ICON='./app-icon-v112-192.png';
function safeOpen(o){return /^[a-zA-Z0-9_-]{2,24}$/.test(o||'')?o:'daily'}
/* النقر على الإشعار: يفتح/يركّز التطبيق وينقله للقسم الصحيح (صلاة، أذكار صباح/مساء، ورد…) */
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const d=e.notification.data||{},page=safeOpen(d.open),adhan=d.adhan&&d.key?String(d.key):'';
  e.waitUntil((async()=>{
    try{
      const scope=self.registration.scope;
      const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      for(const c of cs){
        if(c.url.indexOf(scope)===0&&'focus' in c){
          c.postMessage({type:'open',page,adhan});
          return await c.focus();
        }
      }
      return await self.clients.openWindow(scope+'?open='+encodeURIComponent(page)+(adhan?'&adhan='+encodeURIComponent(adhan):''));
    }catch(_){}
  })());
});
/* ===== Web Push: يصل من خادم الإشعارات حتى والتطبيق مغلق =====
   userVisibleOnly: كل رسالة تُظهر إشعارًا. واستخدمنا waitUntil ليكمل المتصفح العرض قبل إيقاف العامل. */
self.addEventListener('push',e=>{
  let d={};
  try{d=e.data?e.data.json():{}}catch(_){try{d={title:e.data.text()}}catch(__){d={}}}
  const opt={body:String(d.body||''),tag:String(d.tag||'push'),icon:ICON,badge:ICON,lang:'ar',dir:'rtl',vibrate:[200,100,200],renotify:false,
    requireInteraction:d.kind==='at',data:{open:safeOpen(d.open),adhan:!!d.adhan,key:String(d.key||''),t:+d.t||0,kind:String(d.kind||'')}};
  e.waitUntil((async()=>{
    try{await self.registration.showNotification(String(d.title||'المسلم'),opt)}
    catch(_){try{await self.registration.showNotification('المسلم',{body:opt.body,tag:opt.tag,icon:ICON})}catch(__){}}
    /* إن كان التطبيق مفتوحًا فأبلغه ليشغّل الأذان (مرة واحدة) */
    try{
      const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      cs.forEach(c=>{if(c.visibilityState==='visible')c.postMessage({type:'push',adhan:!!d.adhan,key:String(d.key||''),t:+d.t||0,open:safeOpen(d.open)})});
    }catch(_){}
  })());
});
/* تغيّر/انتهاء اشتراك Push (يحدث عند تدوير المفاتيح): نجدّده تلقائيًا ونسجّله بالخادم دون فتح التطبيق */
function b64u8(b){b=String(b).replace(/-/g,'+').replace(/_/g,'/');while(b.length%4)b+='=';const s=atob(b),o=new Uint8Array(s.length);for(let i=0;i<s.length;i++)o[i]=s.charCodeAt(i);return o}
self.addEventListener('pushsubscriptionchange',e=>{
  e.waitUntil((async()=>{
    try{
      const c=await caches.open('muslim-config-v1'),r=await c.match('./__push.json');if(!r)return;
      const cfg=await r.json();if(!cfg.on||!cfg.api||!cfg.key)return;
      const sub=await self.registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u8(cfg.key)});
      const body=Object.assign({},cfg.payload||{},{subscription:sub.toJSON()});
      const res=await fetch(cfg.api+'/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      if(res.ok){cfg.syncedAt=Date.now();await c.put('./__push.json',new Response(JSON.stringify(cfg),{headers:{'Content-Type':'application/json'}}))}
    }catch(_){}
  })());
});
/* هل الخادم هو المسؤول عن التذكيرات؟ (اشتراك فعّال ومزامنة حديثة) — عندها نوقف الاحتياط المحلي لتفادي التكرار */
async function pushActive(){
  try{
    const c=await caches.open('muslim-config-v1'),r=await c.match('./__push.json');if(!r)return false;
    const j=await r.json();if(!j.on||!j.api)return false;
    if(Date.now()-(j.syncedAt||0)>8*864e5)return false;
    return !!(await self.registration.pushManager.getSubscription());
  }catch(_){return false}
}
async function fireFile(cache,name,window_ms){
  const r=await cache.match(name);if(!r)return;
  const cfg=await r.json(),now=Date.now(),fired=cfg.fired||{};let changed=false;
  for(const ev of cfg.events||[]){
    if(fired[ev.tag])continue;
    if(ev.t<=now&&ev.t>=now-window_ms){
      await self.registration.showNotification(ev.title,{body:ev.body||'',tag:ev.tag,icon:'./app-icon-v112-192.png',badge:'./app-icon-v112-192.png',lang:'ar',dir:'rtl',vibrate:[200,100,200],requireInteraction:ev.kind==='at',data:{open:ev.kind==='greet'?'home':'prayer'}});
      fired[ev.tag]=1;changed=true;
    }
  }
  if(changed){cfg.fired=fired;await cache.put(name,new Response(JSON.stringify(cfg),{headers:{'Content-Type':'application/json'}}))}
}
/* فحص التذكيرات في الخلفية (Periodic Background Sync — Chrome/Edge للتطبيق المثبّت) */
async function checkReminders(){
  try{
    if(await pushActive())return;
    const c=await caches.open('muslim-config-v1');
    await fireFile(c,'./__prayer.json',25*60000);
    await fireFile(c,'./__greet.json',6*3600e3);
    const r=await c.match('./__reminders.json');if(!r)return;
    const cfg=await r.json(),now=new Date(),day=now.getDay(),k=now.getFullYear()+'-'+('0'+(now.getMonth()+1)).slice(-2)+'-'+('0'+now.getDate()).slice(-2);
    const fired=cfg.fired||{};let changed=false;
    for(const d of cfg.list||[]){
      if(d.days&&d.days.indexOf(day)<0)continue;
      const hm=String(d.time||'').split(':'),at=new Date(now.getFullYear(),now.getMonth(),now.getDate(),+hm[0],+hm[1],0).getTime();
      if(!(at<=now.getTime()&&at>=now.getTime()-2*3600e3)||fired[d.id]===k)continue;
      await self.registration.showNotification('حان وقت: '+d.t,{body:d.b||'',tag:'deed-'+d.id,icon:'./app-icon-v112-192.png',badge:'./app-icon-v112-192.png',lang:'ar',dir:'rtl',data:{open:'daily'}});
      fired[d.id]=k;changed=true;
    }
    if(changed){cfg.fired=fired;await c.put('./__reminders.json',new Response(JSON.stringify(cfg),{headers:{'Content-Type':'application/json'}}))}
  }catch(_){}
}
self.addEventListener('periodicsync',e=>{if(e.tag==='muslim-reminders'||e.tag==='muslim-prayer')e.waitUntil(checkReminders())});
