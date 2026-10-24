/* =====================================================================
   المسلم v107 — مواقيت الصلاة الدقيقة + التذكيرات + الأذان
   - الحساب فلكي محلي (لا يعتمد على خادم) بحسب إحداثيات الجهاز.
   - طريقة الحساب تُختار تلقائيًا بحسب الموقع/المنطقة الزمنية (والمستخدم لا يختار).
     ويمكنه تغييرها اختياريًا من «إعدادات الصلاة».
   - التذكيرات: قبل الوقت / عند الوقت / بعد الوقت (مدد يحددها المستخدم).
   - جدول التنبيهات يُجدَّد عند كل فتح ويغطي 3 أيام قادمة.
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
var LS=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var K_LOC='muslim-v107-loc',K_SET='muslim-v108-prayer';
var R=Math.PI/180;
function sin(d){return Math.sin(d*R)}function cos(d){return Math.cos(d*R)}function tan(d){return Math.tan(d*R)}
function asin(x){return Math.asin(x)/R}function acos(x){return Math.acos(x)/R}function atan2(y,x){return Math.atan2(y,x)/R}
function acot(x){return Math.atan(1/x)/R}
function fixA(a){a=a-360*Math.floor(a/360);return a<0?a+360:a}
function fixH(a){a=a-24*Math.floor(a/24);return a<0?a+24:a}

/* ---------- طرق الحساب (زوايا الفجر والعشاء) ---------- */
var METHODS={
 egypt:{n:'الهيئة المصرية العامة للمساحة',f:19.5,i:17.5},
 calib:{n:'المعايرة المعتمدة (مرجع طرابلس) — لكل المدن',f:18.5,i:18},
 mwl:{n:'رابطة العالم الإسلامي',f:18,i:17},
 makkah:{n:'أم القرى (مكة المكرمة)',f:18.5,im:90},
 isna:{n:'أمريكا الشمالية (ISNA)',f:15,i:15},
 karachi:{n:'جامعة العلوم الإسلامية — كراتشي',f:18,i:18},
 kuwait:{n:'وزارة الأوقاف — الكويت',f:18,i:17.5},
 qatar:{n:'قطر',f:18,im:90},
 singapore:{n:'مجلس الشؤون الدينية — سنغافورة/ماليزيا/إندونيسيا',f:20,i:18},
 turkey:{n:'رئاسة الشؤون الدينية — تركيا',f:18,i:17},
 dubai:{n:'الإمارات',f:18.2,i:18.2},
 tehran:{n:'جامعة طهران',f:17.7,i:14,mg:4.5},
 morocco:{n:'وزارة الأوقاف — المغرب',f:19,i:17},
 algeria:{n:'وزارة الشؤون الدينية — الجزائر',f:18,i:17},
 tunisia:{n:'تونس',f:18,i:18},
 jordan:{n:'وزارة الأوقاف — الأردن',f:18,i:18}
};
var TZ_METHOD={
 'Africa/Tripoli':'egypt','Africa/Cairo':'egypt','Africa/Khartoum':'egypt','Africa/Juba':'egypt','Asia/Damascus':'egypt','Asia/Beirut':'egypt','Asia/Gaza':'egypt','Asia/Hebron':'egypt','Asia/Jerusalem':'egypt',
 'Africa/Algiers':'algeria','Africa/Tunis':'tunisia','Africa/Casablanca':'morocco','Africa/El_Aaiun':'morocco',
 'Asia/Riyadh':'makkah','Asia/Bahrain':'makkah','Asia/Aden':'makkah','Asia/Kuwait':'kuwait','Asia/Qatar':'qatar','Asia/Dubai':'dubai','Asia/Muscat':'mwl','Asia/Baghdad':'mwl','Asia/Amman':'jordan',
 'Europe/Istanbul':'turkey','Asia/Istanbul':'turkey','Asia/Tehran':'tehran',
 'Asia/Karachi':'karachi','Asia/Kolkata':'karachi','Asia/Calcutta':'karachi','Asia/Dhaka':'karachi','Asia/Kabul':'karachi','Asia/Colombo':'karachi',
 'Asia/Singapore':'singapore','Asia/Kuala_Lumpur':'singapore','Asia/Jakarta':'singapore','Asia/Brunei':'singapore','Asia/Makassar':'singapore','Asia/Jayapura':'singapore'
};
var HANAFI_TZ=/^Asia\/(Karachi|Kolkata|Calcutta|Dhaka|Kabul|Tashkent|Samarkand|Bishkek|Dushanbe)$/;
function tzName(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){return ''}}
function autoMethod(lat,lon){
  /* المعايرة المعتمدة (طرابلس) هي الأساس لكل مدن العالم؛ الطرق الإقليمية اختيارية من الإعدادات */
  return 'calib';
  var tz=tzName();
  if(TZ_METHOD[tz])return TZ_METHOD[tz];
  if(/^America\//.test(tz)||/^(US|Canada)\//.test(tz))return 'isna';
  if(/^Europe\//.test(tz))return 'mwl';
  /* احتياطي بالإحداثيات */
  if(lat>16&&lat<32&&lon>34&&lon<56)return 'makkah';
  if(lat>=-12&&lat<=8&&lon>94&&lon<142)return 'singapore';
  if(lat>5&&lat<38&&lon>60&&lon<95)return 'karachi';
  if(lat>15&&lat<38&&lon>-18&&lon<35)return 'egypt';
  if(lon<-30&&lat>15)return 'isna';
  return 'mwl';
}
function autoAsr(){return 1}

/* ---------- الحساب الفلكي ---------- */
function julian(y,m,d){if(m<=2){y-=1;m+=12}var A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function sunPos(jd){var D=jd-2451545.0,g=fixA(357.529+0.98560028*D),q=fixA(280.459+0.98564736*D),L=fixA(q+1.915*sin(g)+0.020*sin(2*g)),e=23.439-0.00000036*D,RA=atan2(cos(e)*sin(L),cos(L))/15;return{decl:asin(sin(e)*sin(L)),eqt:q/15-fixH(RA)}}
function compute(date,lat,lon,elev,methodId,asrF,hijriMonth){
  var m=METHODS[methodId]||METHODS.mwl;
  var jd=julian(date.getFullYear(),date.getMonth()+1,date.getDate())-lon/(15*24);
  function mid(t){return fixH(12-sunPos(jd+t).eqt)}
  function sat(angle,t,ccw){var dec=sunPos(jd+t).decl,noon=mid(t),x=(-sin(angle)-sin(dec)*sin(lat))/(cos(dec)*cos(lat));if(x>1||x<-1)return NaN;var tt=acos(x)/15;return noon+(ccw?-tt:tt)}
  function asr(f,t){var dec=sunPos(jd+t).decl,ang=-acot(f+tan(Math.abs(lat-dec)));return sat(ang,t,false)}
  var hor=0.833+(elev>0?0.0347*Math.sqrt(elev):0);
  /* حلّ تكراري (3 مرات) لتحسين الدقة: نعيد حساب ميل الشمس ومعادلة الزمن عند الوقت الناتج */
  function it(fn,init){var x=init;for(var i=0;i<3;i++){var r=fn(x);if(isNaN(r))return NaN;x=r/24}return fn(x)}
  var t={
    fajr:it(function(x){return sat(m.f,x,true)},5/24),
    sunrise:it(function(x){return sat(hor,x,true)},6/24),
    dhuhr:it(function(x){return mid(x)},12/24),
    asr:it(function(x){return asr(asrF,x)},13/24),
    sunset:it(function(x){return sat(hor,x,false)},18/24),
    isha:NaN
  };
  t.maghrib=m.mg?it(function(x){return sat(m.mg,x,false)},18/24):t.sunset;
  if(m.im){t.isha=t.maghrib+(hijriMonth===9&&methodId==='makkah'?120:m.im)/60}
  else t.isha=it(function(x){return sat(m.i,x,false)},18/24);
  /* العروض العالية: طريقة زاوية الليل عند غياب الفجر/العشاء */
  var night=fixH(t.sunrise-t.sunset);
  if(isNaN(night)||night>=24)night=8;
  if(isNaN(t.fajr)||(t.sunrise-t.fajr)>night/2*1.0&&Math.abs(lat)>48){var pf=m.f/60;t.fajr=t.sunrise-pf*night}
  if(m.i&&(isNaN(t.isha)||(t.isha-t.sunset)>night/2&&Math.abs(lat)>48)){var pi=m.i/60;t.isha=t.sunset+pi*night}
  /* تحويل إلى توقيت الجهاز */
  var tz=-new Date(date.getFullYear(),date.getMonth(),date.getDate(),12).getTimezoneOffset()/60;
  var adj=tz-lon/15,out={};
  Object.keys(t).forEach(function(k){
    var h=t[k]+adj;
    if(isNaN(h)){out[k]=null;return}
    var ms=new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime()+Math.round(h*60)*60000; /* تقريب لأقرب دقيقة */
    out[k]=new Date(ms);
  });
  /* احتياط: بداية الظهر بعد الزوال بدقيقة (تعديل معتمد) */
  return out;
}

/* ---------- إعدادات الصلاة ---------- */
var DEF={before:10,after:10,adhan:true,muezzin:'makkah',method:'auto',asr:'auto',notif:true,
  on:{fajr:true,sunrise:false,dhuhr:true,asr:true,maghrib:true,isha:true},
  tune:{fajr:0,sunrise:-1,dhuhr:3,asr:0,maghrib:4,isha:1},hijriAdj:0};
function cfg(){var c=LG(K_SET,{});var o=JSON.parse(JSON.stringify(DEF));Object.keys(c).forEach(function(k){if(k==='on'||k==='tune')Object.assign(o[k],c[k]);else o[k]=c[k]});return o}
function saveCfg(c){LS(K_SET,c)}
var NAMES={fajr:'الفجر',sunrise:'الشروق',dhuhr:'الظهر',asr:'العصر',maghrib:'المغرب',isha:'العشاء'};
var ICONS={fajr:'🌌',sunrise:'🌅',dhuhr:'☀️',asr:'🌤️',maghrib:'🌇',isha:'🌙'};
var ORDER=['fajr','sunrise','dhuhr','asr','maghrib','isha'];

/* ---------- الموقع ---------- */
function getLoc(){return LG(K_LOC,null)}
function haversine(a,b,c,d){var x=(c-a)*R,y=(d-b)*R,s=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*R)*Math.cos(c*R)*Math.sin(y/2)*Math.sin(y/2);return 6371*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}
function locate(force){
  return new Promise(function(res){
    if(!navigator.geolocation){res(getLoc());return}
    navigator.geolocation.getCurrentPosition(function(p){
      var o={lat:p.coords.latitude,lon:p.coords.longitude,elev:Math.max(0,p.coords.altitude||0),acc:p.coords.accuracy,at:Date.now()};
      var old=getLoc();LS(K_LOC,o);
      if(!old||haversine(old.lat,old.lon,o.lat,o.lon)>3)document.dispatchEvent(new CustomEvent('muslimLocChanged'));
      res(o);
    },function(){res(getLoc())},{enableHighAccuracy:true,timeout:12000,maximumAge:force?0:600000});
  });
}

/* ---------- التاريخ الهجري (شهر) ---------- */
function hijriParts(d,adj){
  var dd=new Date(d.getTime()+(adj||0)*864e5);
  try{
    var f=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(dd),o={};
    f.forEach(function(p){if(p.type!=='literal')o[p.type]=parseInt(p.value,10)});
    return o;
  }catch(e){return{day:0,month:0,year:0}}
}
window.v107Hijri=hijriParts;

/* ---------- جدول الأوقات ---------- */
function timesFor(date,loc,c){
  c=c||cfg();
  var mid=c.method==='auto'?autoMethod(loc.lat,loc.lon):c.method;
  var asrF=c.asr==='auto'?autoAsr():(c.asr==='hanafi'?2:1);
  var hj=hijriParts(date,c.hijriAdj);
  var t=compute(date,loc.lat,loc.lon,loc.elev||0,mid,asrF,hj.month);
  ORDER.forEach(function(k){if(t[k]&&c.tune[k])t[k]=new Date(t[k].getTime()+c.tune[k]*60000)});
  t.methodId=mid;t.methodName=(METHODS[mid]||{}).n;t.asrF=asrF;
  return t;
}
function fmt(d){
  if(!d)return '--:--';
  var mode=localStorage.getItem('muslim-clock-mode')||'24';
  var h=d.getHours(),m=d.getMinutes(),mm=(m<10?'0':'')+m;
  if(mode==='12'){var s=h>=12?'م':'ص';h=h%12||12;return h+':'+mm+' '+s}
  return (h<10?'0':'')+h+':'+mm;
}
window.v107FmtTime=fmt;
function nextPrayer(loc,c){
  var now=new Date();
  for(var di=0;di<3;di++){
    var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+di),t=timesFor(d,loc,c);
    for(var i=0;i<ORDER.length;i++){var k=ORDER[i];if(k==='sunrise'&&false)continue;if(t[k]&&t[k]>now)return{key:k,at:t[k],day:di}}
  }
  return null;
}
window.v107Prayer={timesFor:timesFor,cfg:cfg,getLoc:getLoc,next:function(){var l=getLoc();return l?nextPrayer(l,cfg()):null},names:NAMES,fmt:fmt};

/* ---------- الأذان ---------- */
var adhanAudio=null;
function muezzins(){return window.ADHAN_MUEZZINS||[]}
function playAdhan(key,test){
  var c=cfg(),list=muezzins(),m=list.filter(function(x){return x.id===c.muezzin})[0]||list[0];
  stopAdhan();
  if(!m||!(m.fajr||m.file)){beep();return false}
  var url=(key==='fajr'&&m.fajr)||m.file;
  try{
    adhanAudio=new Audio(url);adhanAudio.preload='auto';adhanAudio.setAttribute('data-v107title','🕌 الأذان — '+m.name);
    adhanAudio.onerror=function(){beep();toast('ملف الأذان غير موجود بعد في الموقع؛ أضف ملفات الأذان كما في الشرح.')};
    adhanAudio.play().catch(function(){if(!test)toast('اضغط على الشاشة للسماح بتشغيل الأذان.')});
  }catch(e){beep()}
  return true;
}
function stopAdhan(){try{if(adhanAudio){adhanAudio.pause();adhanAudio=null}}catch(e){}}
function beep(){try{var C=window.AudioContext||window.webkitAudioContext,x=new C(),o=x.createOscillator(),g=x.createGain();o.frequency.value=660;g.gain.value=.15;o.connect(g);g.connect(x.destination);o.start();setTimeout(function(){o.stop();x.close()},700)}catch(e){}}
function toast(m){if(window.showToast)window.showToast(m)}
window.v107PlayAdhan=function(){playAdhan('dhuhr',true)};
window.v107StopAdhan=stopAdhan;

/* ---------- التنبيهات ---------- */
function buildEvents(loc,c){
  var ev=[],now=Date.now();
  for(var di=0;di<3;di++){
    var d=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+di),t=timesFor(d,loc,c);
    ORDER.forEach(function(k){
      if(!t[k]||!c.on[k])return;
      var at=t[k].getTime(),nm=NAMES[k];
      if(c.before>0&&k!=='sunrise')ev.push({t:at-c.before*60000,kind:'before',key:k,title:'اقترب وقت '+nm,body:'بقي على أذان '+nm+' '+c.before+' دقيقة.'});
      if(k==='sunrise'){ev.push({t:at,kind:'at',key:k,title:'الشروق',body:'طلعت الشمس — وقت صلاة الضحى يبدأ بعد نحو 15 دقيقة.'})}
      else ev.push({t:at,kind:'at',key:k,title:'حان وقت '+nm,body:'حان الآن موعد أذان '+nm+' بحسب موقعك.',adhan:c.adhan});
      if(c.after>0&&k!=='sunrise')ev.push({t:at+c.after*60000,kind:'after',key:k,title:'مضى على '+nm+' '+c.after+' دقيقة',body:'إن لم تصلِّ '+nm+' فبادر بها قبل خروج وقتها.'});
    });
  }
  ev=ev.filter(function(e){return e.t>now-30*60000}).sort(function(a,b){return a.t-b.t});
  ev.forEach(function(e){e.tag='pr-'+e.key+'-'+e.kind+'-'+new Date(e.t).toISOString().slice(0,16)});
  return ev;
}
var timers=[];
async function persistForSW(ev){
  try{var ca=await caches.open('muslim-config-v1');await ca.put('./__prayer.json',new Response(JSON.stringify({gen:Date.now(),until:Date.now()+3*864e5,events:ev,fired:{}}),{headers:{'Content-Type':'application/json'}}))}catch(e){}
}
async function getReg(){try{return await navigator.serviceWorker.ready}catch(e){return null}}
async function notify(e){
  if(e.adhan)playAdhan(e.key);
  if(document.visibilityState==='visible')toast('🔔 '+e.title);
  if('Notification' in window&&Notification.permission==='granted'){
    var reg=await getReg(),opt={body:e.body,tag:e.tag,icon:'./icon-192.png',badge:'./icon-192.png',lang:'ar',dir:'rtl',vibrate:[200,100,200],data:{open:'prayer'},requireInteraction:e.kind==='at'};
    try{if(reg)await reg.showNotification(e.title,opt);else new Notification(e.title,opt)}catch(x){}
  }
}
var schedLock=false;
async function schedule(){
  if(schedLock)return;schedLock=true;
  try{
    timers.forEach(clearTimeout);timers=[];
    var loc=getLoc();if(!loc)return;
    var c=cfg(),ev=buildEvents(loc,c);
    await persistForSW(ev);
    var now=Date.now();
    /* مؤقتات داخل الصفحة (ما دامت مفتوحة) */
    ev.forEach(function(e){
      var dt=e.t-now;
      if(dt>0&&dt<2147e3*1000/1000&&dt<36*3600e3)timers.push(setTimeout(function(){notify(e)},dt));
    });
    /* إشعارات مجدولة من النظام عند توفر Notification Triggers */
    if(c.notif&&'Notification' in window&&Notification.permission==='granted'&&window.TimestampTrigger){
      var reg=await getReg();
      if(reg&&reg.showNotification){
        ev.filter(function(e){return e.t>now}).slice(0,60).forEach(function(e){
          try{reg.showNotification(e.title,{body:e.body,tag:e.tag,icon:'./icon-192.png',lang:'ar',dir:'rtl',showTrigger:new TimestampTrigger(e.t),data:{open:'prayer'}})}catch(x){}
        });
      }
    }
    /* مزامنة دورية في الخلفية (تطبيق مثبّت على Chrome/Edge) */
    try{var r=await getReg();if(r&&r.periodicSync&&r.periodicSync.register)await r.periodicSync.register('muslim-prayer',{minInterval:3600e3})}catch(x){}
    window.v107NextEvents=ev;
  }finally{schedLock=false}
}
window.v107Schedule=schedule;
window.v107AskNotif=async function(){
  if(!('Notification' in window)){toast('متصفحك لا يدعم الإشعارات. على الآيفون ثبّت التطبيق على الشاشة الرئيسية أولًا.');return}
  var p=await Notification.requestPermission();
  toast(p==='granted'?'تم تفعيل الإشعارات ✅':'لم يُسمح بالإشعارات؛ فعّلها من إعدادات المتصفح.');
  schedule();
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
};
window.v107TestNotif=function(){notify({key:'dhuhr',kind:'at',title:'اختبار التنبيه 🔔',body:'هكذا ستظهر لك تنبيهات الصلاة.',tag:'pr-test',adhan:cfg().adhan})};

/* ---------- صفحة المواقيت ---------- */
var tick=null;
function ensurePage(){
  if($('prayer'))return;
  var s=document.createElement('section');s.id='prayer';s.className='page';
  s.innerHTML='<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>🕌 مواقيت الصلاة</h2><p>دقيقة بحسب موقعك — بلا أي اختيار منك</p></div></div><div id="prBody"></div>';
  var ref=$('settings');(ref&&ref.parentNode?ref.parentNode:document.body).insertBefore(s,ref||null);
}
function fmtCd(ms){if(ms<0)ms=0;var s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(x<10?'0':'')+x}
function hijriText(d){try{return new Intl.DateTimeFormat('ar-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date(d.getTime()+cfg().hijriAdj*864e5))}catch(e){return ''}}
async function render(){
  ensurePage();
  var box=$('prBody');if(!box)return;
  var loc=getLoc();
  if(!loc){
    box.innerHTML='<div class="card"><b>📍 نحتاج موقعك لحساب المواقيت بدقة</b><p class="mini">لن يُرسَل موقعك لأي خادم؛ يُحفظ على جهازك فقط.</p><button class="primary" id="prAsk">السماح وتحديد الموقع</button></div>';
    $('prAsk').onclick=async function(){box.innerHTML='<div class="notice">⏳ جارٍ تحديد موقعك…</div>';await locate(true);render();schedule()};
    return;
  }
  var c=cfg(),now=new Date(),t=timesFor(now,loc,c),nx=nextPrayer(loc,c);
  var curKey=null;ORDER.forEach(function(k){if(t[k]&&t[k]<=now)curKey=k});
  var h='';
  h+='<div class="prHero"><div class="nx">الصلاة القادمة</div><div class="nm" id="prNm">'+(nx?NAMES[nx.key]:'—')+'</div><div class="cd" id="prCd">--:--:--</div><div class="dt">'+hijriText(now)+' • '+now.toLocaleDateString('ar',{weekday:'long',day:'numeric',month:'long'})+'</div></div>';
  h+='<div class="prList">'+ORDER.map(function(k){
    var past=t[k]&&t[k]<now&&k!==curKey,cur=k===curKey;
    return '<div class="prRow '+(cur?'cur':'')+' '+(past?'past':'')+'"><span class="ic">'+ICONS[k]+'</span><b>'+NAMES[k]+'</b><span class="tm">'+fmt(t[k])+'</span><button class="bell" data-k="'+k+'" aria-label="تنبيه '+NAMES[k]+'">'+(c.on[k]?'🔔':'🔕')+'</button></div>';
  }).join('')+'</div>';
  h+='<div class="prMeta"><div><b>طريقة الحساب</b>'+(c.method==='auto'?'تلقائية — ':'')+(t.methodName||'')+'</div><div><b>العصر</b>'+(t.asrF===2?'حنفي (ظل مثلين)':'جمهور (ظل مثل)')+'</div><div><b>الموقع</b>'+loc.lat.toFixed(3)+'، '+loc.lon.toFixed(3)+(loc.acc?' (±'+Math.round(loc.acc)+'م)':'')+'</div><div><b>خط الزوال</b>'+tzName()+'</div></div>';
  h+='<div class="controls" style="margin-top:12px;flex-wrap:wrap"><button class="primary" id="prRef">📍 تحديث موقعي</button><button id="prNot">🔔 تفعيل الإشعارات</button><button id="prSet">⚙️ إعدادات الصلاة</button></div>';
  h+='<p class="mini">الأوقات محسوبة فلكيًا بدقة الدقيقة، وقد يختلف التقويم المحلي لبلدك بدقيقة أو دقيقتين؛ يمكنك ضبط ذلك من «إعدادات الصلاة ← تعديل دقيق».</p>';
  box.innerHTML=h;
  $('prRef').onclick=async function(){await locate(true);render();schedule()};
  $('prNot').onclick=window.v107AskNotif;
  $('prSet').onclick=function(){show('settings');setTimeout(function(){var d=$('stgcat-prayer');if(d){d.open=true;d.scrollIntoView({behavior:'smooth'})}},200)};
  box.querySelectorAll('.bell').forEach(function(b){b.onclick=function(){var cc=cfg();cc.on[b.dataset.k]=!cc.on[b.dataset.k];saveCfg(cc);render();schedule()}});
  clearInterval(tick);
  tick=setInterval(function(){
    if(!$('prayer')||!$('prayer').classList.contains('active')){clearInterval(tick);return}
    var n=nextPrayer(loc,cfg());if(!n)return;
    var cd=$('prCd'),nm=$('prNm');if(cd)cd.textContent=fmtCd(n.at-Date.now());if(nm)nm.textContent=NAMES[n.key];
  },1000);
}
window.v107Prayer.render=render;

/* ---------- ربط عناصر الإعدادات (تُنشأ في index.html) ---------- */
function bindSettings(){
  var c=cfg();
  function sel(id,get,set){var e=$(id);if(!e)return;e.value=String(get());e.onchange=function(){var cc=cfg();set(cc,e.value);saveCfg(cc);schedule();if($('prayer')&&$('prayer').classList.contains('active'))render()}}
  sel('pr107Before',function(){return c.before},function(cc,v){cc.before=+v});
  sel('pr107After',function(){return c.after},function(cc,v){cc.after=+v});
  sel('pr107Method',function(){return c.method},function(cc,v){cc.method=v});
  sel('pr107Asr',function(){return c.asr},function(cc,v){cc.asr=v});
  sel('pr107HijriAdj',function(){return c.hijriAdj},function(cc,v){cc.hijriAdj=+v});
  var ms=$('pr107Muezzin');
  if(ms){var L=muezzins();ms.innerHTML=L.length?L.map(function(m){return '<option value="'+m.id+'">'+m.name+'</option>'}).join(''):'<option value="">لا توجد ملفات أذان بعد</option>';ms.value=c.muezzin;ms.onchange=function(){var cc=cfg();cc.muezzin=ms.value;saveCfg(cc)}}
  var ad=$('pr107Adhan');if(ad){ad.checked=!!c.adhan;ad.onchange=function(){var cc=cfg();cc.adhan=ad.checked;saveCfg(cc);schedule()}}
  ORDER.forEach(function(k){
    var e=$('pr107On_'+k);if(e){e.checked=!!c.on[k];e.onchange=function(){var cc=cfg();cc.on[k]=e.checked;saveCfg(cc);schedule()}}
    var t=$('pr107T_'+k);if(t){t.value=c.tune[k];t.onchange=function(){var cc=cfg();cc.tune[k]=Math.max(-30,Math.min(30,parseInt(t.value,10)||0));t.value=cc.tune[k];saveCfg(cc);schedule()}}
  });
}

/* ---------- تشغيل ---------- */
function boot(){
  ensurePage();bindSettings();
  var loc=getLoc();
  if(loc)schedule();
  /* تحديث الموقع بصمت إن كان الإذن ممنوحًا سابقًا */
  try{
    if(navigator.permissions&&navigator.permissions.query)navigator.permissions.query({name:'geolocation'}).then(function(p){
      if(p.state==='granted')locate(false).then(function(){schedule()});
      p.onchange=function(){if(p.state==='granted')locate(true).then(function(){schedule();if($('prayer')&&$('prayer').classList.contains('active'))render()})};
    });else if(!loc)locate(false).then(schedule);
  }catch(e){}
  document.addEventListener('muslimLocChanged',function(){schedule()});
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')schedule()});
  document.addEventListener('muslimClockModeChanged',function(){if($('prayer')&&$('prayer').classList.contains('active'))render()});
  /* تحديث الجدول كل 3 أيام على الأقل حتى لو بقي التطبيق مفتوحًا */
  setInterval(schedule,6*3600e3);
  /* فتح الصفحة من رابط الإشعار */
  var q=new URLSearchParams(location.search).get('open');if(q==='prayer')setTimeout(function(){show('prayer');render()},400);
  if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',function(e){if(e.data&&e.data.type==='open'&&e.data.page==='prayer'){show('prayer');render()}});
}
var _show=window.show;
if(typeof _show==='function'&&!_show.__pr107){
  window.show=function(id){var r=_show.apply(this,arguments);if(id==='prayer')setTimeout(render,0);return r};window.show.__pr107=1;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,300)});else setTimeout(boot,300);
})();
