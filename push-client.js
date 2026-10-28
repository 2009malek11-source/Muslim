/* =====================================================================
   المسلم v115 — الإشعارات في الخلفية (Web Push حقيقي)
   - ينشئ اشتراك Push عند ضغط المستخدم على «تفعيل الإشعارات» فقط (لا طلب إذن تلقائي).
   - يرسل للخادم (PUSH_API في app-config.js): الاشتراك + المنطقة الزمنية + الموقع التقريبي
     + إعدادات الصلاة + تذكيرات الأذكار والأعمال، ليحسب الخادم المواعيد ويرسل الإشعار والموقع مغلق.
   - يحفظ نسخة من الإعداد في مخزن الخلفية ليجدّد Service Worker الاشتراك تلقائيًا إن تغيّر.
   - لا يحتوي أي سر: المفتاح العام VAPID علني بطبيعته؛ المفتاح الخاص على الخادم فقط.
   ===================================================================== */
(function(){
'use strict';
var LSK='muslim-v115-push',CFG_CACHE='muslim-config-v1',CFG_KEY='./__push.json';
var timer=null,lastHash='',lastAt=0,busy=false;

function api(){return String(window.PUSH_API||'').replace(/\/+$/,'')}
function vkey(){return String(window.VAPID_PUBLIC_KEY||'')}
function toast(m){try{window.showToast?window.showToast(m):alert(m)}catch(e){}}
function st(){try{return JSON.parse(localStorage.getItem(LSK)||'{}')||{}}catch(e){return{}}}
function setSt(o){try{localStorage.setItem(LSK,JSON.stringify(o))}catch(e){}}
function isIOS(){var u=navigator.userAgent||'';return /iPad|iPhone|iPod/.test(u)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)}
function standalone(){try{return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}}
function supported(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window}
function u8(b64){b64=String(b64).replace(/-/g,'+').replace(/_/g,'/');while(b64.length%4)b64+='=';var s=atob(b64),o=new Uint8Array(s.length);for(var i=0;i<s.length;i++)o[i]=s.charCodeAt(i);return o}
function sameKey(sub,key){
  try{var k=sub.options&&sub.options.applicationServerKey;if(!k)return true;var a=new Uint8Array(k),b=u8(key);if(a.length!==b.length)return false;for(var i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true}catch(e){return true}
}
async function getSub(){
  if(!supported())return null;
  try{var reg=await navigator.serviceWorker.ready;return await reg.pushManager.getSubscription()}catch(e){return null}
}
function clock(ts){try{return new Date(ts).toLocaleString('ar',{hour:'numeric',minute:'2-digit',day:'numeric',month:'short'})}catch(e){return ''}}

/* ---------- حالة الجهاز الحالي ---------- */
async function status(){
  if(!supported()){
    if(isIOS()&&!standalone())return{code:'ios-install',text:'على الآيفون/الآيباد: ثبّت التطبيق على الشاشة الرئيسية (مشاركة ← إضافة إلى الشاشة الرئيسية) ثم افتحه من أيقونته لتفعيل الإشعارات في الخلفية (يلزم iOS 16.4 أو أحدث).'};
    return{code:'unsupported',text:'هذا المتصفح لا يدعم إشعارات الخلفية (Web Push). جرّب Chrome أو Edge أو Firefox، أو ثبّت التطبيق.'};
  }
  if(!api()||!vkey())return{code:'unconfigured',text:'الإشعارات تعمل والتطبيق مفتوح أو مثبَّت (تذكيرات احتياطية في Chrome/Edge). وصولها بعد إغلاق التطبيق كليًا غير مضمون بدون خادم، وغير متاح على الآيفون.'};
  if(Notification.permission==='denied')return{code:'denied',text:'الإشعارات محظورة لهذا الموقع. فعّلها من إعدادات المتصفح ثم أعد المحاولة.'};
  var sub=await getSub(),s=st();
  if(sub&&Notification.permission==='granted'&&s.on)return{code:'on',text:'✅ الإشعارات في الخلفية مفعّلة على هذا الجهاز'+(s.syncedAt?' — آخر مزامنة مع الخادم: '+clock(s.syncedAt):'')+(s.lastError?' (تنبيه: '+s.lastError+')':'')};
  if(sub&&Notification.permission==='granted')return{code:'needs-sync',text:'الاشتراك موجود لكن لم يُسجَّل على الخادم بعد — اضغط «تفعيل الإشعارات».'};
  return{code:'off',text:'الإشعارات في الخلفية غير مفعّلة على هذا الجهاز — اضغط «تفعيل الإشعارات».'};
}
async function refreshUI(){
  try{
    var s=await status(),els=document.querySelectorAll('[data-v115-state]');
    for(var i=0;i<els.length;i++){els[i].textContent=s.text;els[i].setAttribute('data-code',s.code)}
  }catch(e){}
}

/* ---------- جمع الإعدادات المطلوبة للخادم من التطبيق ---------- */
function round2(x){return Math.round(x*100)/100}
function collect(){
  var P=window.v107Prayer,c=null,loc=null;
  try{c=P&&P.cfg?P.cfg():null;loc=P&&P.getLoc?P.getLoc():null}catch(e){}
  var tz='UTC';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'}catch(e){}
  var prayer=c?{master:c.notif!==false,before:c.before,after:c.after,adhan:c.adhan!==false,method:c.method,asr:c.asr,hijriAdj:c.hijriAdj,on:c.on,tune:c.tune}:{master:false};
  return{tz:tz,
    loc:loc&&isFinite(loc.lat)&&isFinite(loc.lon)?{lat:round2(loc.lat),lon:round2(loc.lon),elev:Math.round(loc.elev||0)}:null,   /* موقع تقريبي (~1 كم) يكفي لحساب المواقيت */
    prefs:{master:true,greet:true,prayer:prayer,deeds:window.__v115Deeds||[]}};
}
function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return String(h)}
async function saveForSW(on,payload){
  try{
    if(!window.caches)return;var ca=await caches.open(CFG_CACHE),s=st();
    await ca.put(CFG_KEY,new Response(JSON.stringify({on:!!on,api:api(),key:vkey(),syncedAt:s.syncedAt||0,payload:payload||null}),{headers:{'Content-Type':'application/json'}}));
  }catch(e){}
}
async function post(path,body){
  var r=await fetch(api()+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  var j=null;try{j=await r.json()}catch(e){}
  return{status:r.status,json:j||{}};
}

/* ---------- مزامنة الإعدادات مع الخادم ---------- */
async function doSync(force,sub0){
  if(busy)return false;
  if(!api()||!vkey()||!supported())return false;
  if(Notification.permission!=='granted')return false;
  var sub=sub0||await getSub();if(!sub)return false;
  var payload=collect(),h=hash(JSON.stringify(payload)),s=st();
  /* لا نكرر الإرسال إن لم يتغير شيء (إلا كل 12 ساعة لتجديد حالة الاشتراك) */
  if(!force&&h===s.hash&&Date.now()-(s.syncedAt||0)<12*3600e3)return true;
  busy=true;
  try{
    var body=JSON.parse(JSON.stringify(payload));body.subscription=sub.toJSON();
    var r=await post('/subscribe',body);
    if(r.status===200&&r.json.ok){
      setSt({on:true,hash:h,syncedAt:Date.now(),needsLocation:!!r.json.needsLocation,lastError:r.json.needsLocation?'حدّد موقعك من صفحة المواقيت لتصل إشعارات الصلاة':''});
      await saveForSW(true,payload);refreshUI();return true;
    }
    var msg=r.json&&r.json.error?r.json.error:('HTTP '+r.status);
    var s2=st();s2.lastError=msg==='capacity'?'الخادم وصل لحده الأقصى من الأجهزة':msg;setSt(s2);refreshUI();
    return false;
  }catch(e){
    var s3=st();s3.lastError='تعذّر الاتصال بالخادم';setSt(s3);refreshUI();return false;
  }finally{busy=false}
}
/* يُستدعى من prayer.js وscript.js عند أي تغيير في الإعدادات (مؤجَّل لتجميع التغييرات) */
function schedSync(){
  if(!api()||!vkey())return;
  clearTimeout(timer);timer=setTimeout(function(){doSync(false)},2500);
}

/* ---------- تفعيل / إلغاء / اختبار ---------- */
async function enable(){
  if(!supported()){var s0=await status();toast(s0.text);refreshUI();return false}
  /* نطلب الإذن أولًا داخل نفس لحظة ضغط المستخدم */
  var perm=Notification.permission;
  if(perm==='default'){try{perm=await Notification.requestPermission()}catch(e){perm='default'}}
  if(perm!=='granted'){toast(perm==='denied'?'الإشعارات محظورة؛ فعّلها من إعدادات المتصفح للموقع.':'لم يُمنح إذن الإشعارات.');refreshUI();return false}
  if(!api()||!vkey()){toast('فُعّلت الإشعارات داخل التطبيق. لتصلك والتطبيق مغلق يلزم ربط خادم الإشعارات (انظر README).');refreshUI();return false}
  try{
    var reg=await navigator.serviceWorker.ready,sub=await reg.pushManager.getSubscription();
    if(sub&&!sameKey(sub,vkey())){try{await sub.unsubscribe()}catch(e){}sub=null}
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(vkey())});
    var ok=await doSync(true,sub);
    if(ok){toast(st().needsLocation?'تم الاشتراك ✅ — حدّد موقعك من صفحة المواقيت لتصلك إشعارات الصلاة.':'تم تفعيل الإشعارات في الخلفية ✅');return true}
    toast('تم إنشاء الاشتراك لكن تعذّر تسجيله على الخادم: '+(st().lastError||'تحقق من PUSH_API'));return false;
  }catch(e){
    toast('تعذّر تفعيل إشعارات الخلفية: '+String(e&&e.message||e).slice(0,120));refreshUI();return false;
  }
}
async function disable(){
  var sub=await getSub();
  try{if(sub&&api())await post('/unsubscribe',{subscription:sub.toJSON()})}catch(e){}
  try{if(sub)await sub.unsubscribe()}catch(e){}
  setSt({on:false});await saveForSW(false,null);refreshUI();
  toast('أُلغي اشتراك الإشعارات على هذا الجهاز وحُذفت بياناته من الخادم.');
}
async function test(){
  if(!api()||!vkey()){toast('خادم الإشعارات غير مربوط بعد.');return}
  var sub=await getSub();if(!sub||Notification.permission!=='granted'){toast('فعّل الإشعارات أولًا.');return}
  try{
    var r=await post('/test',{subscription:sub.toJSON()});
    if(r.status===404){await doSync(true,sub);r=await post('/test',{subscription:sub.toJSON()})}
    if(r.json&&r.json.ok)toast('أُرسل إشعار تجريبي من الخادم — يجب أن يظهر خلال ثوانٍ (جرّب إغلاق التطبيق وإعادة الاختبار).');
    else if(r.status===429)toast('انتظر بضع ثوانٍ قبل إعادة الاختبار.');
    else if(r.status===410){setSt({on:false});toast('انتهى الاشتراك؛ اضغط «تفعيل الإشعارات» من جديد.')}
    else toast('تعذّر الإرسال من الخادم (رمز '+(r.json&&r.json.status||r.status)+').');
  }catch(e){toast('تعذّر الاتصال بالخادم.')}
  refreshUI();
}

window.v115Push={enable:enable,disable:disable,test:test,status:status,sync:function(f){return doSync(!!f)},refreshUI:refreshUI,
  active:function(){var s=st();return !!(s.on&&Date.now()-(s.syncedAt||0)<8*864e5)}};
window.v115PushSync=schedSync;

/* مزامنة هادئة عند الفتح، وعند العودة للتطبيق */
function boot(){
  refreshUI();
  setTimeout(function(){status().then(function(s){if(s.code==='on'||s.code==='needs-sync')doSync(false)})},4000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){refreshUI();schedSync()}});
  document.addEventListener('muslimLocChanged',schedSync);
  setInterval(function(){doSync(false)},6*3600e3);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,500)});else setTimeout(boot,500);
})();
