/* =====================================================================
   المسلم v112 — القبلة (إعادة بناء كاملة)
   أسباب عدم الدقة في النسخ القديمة وما عالجناه:
   1) البوصلة تقيس الشمال المغناطيسي لا الحقيقي ⇒ نصحّح بالانحراف المغناطيسي (WMM) عند توفره.
   2) حساب الاتجاه من زاوية alpha فقط يخطئ عند ميلان الهاتف ⇒ نحسب الاتجاه من مصفوفة الدوران كاملة
      (alpha,beta,gamma) مع تعويض الميلان ودوران الشاشة.
   3) السهم كان يهتزّ بلا تنعيم ⇒ مرشّح تمرير منخفض دائري.
   4) لا طريقة لتصحيح ما يبقى من خطأ (حديد/جهاز) ⇒ معايرة بالشمس أو باتجاه قبلة معروف (محراب).
   5) الاتجاه الجغرافي يُحسب على المجسّم الإهليلجي WGS84 (Vincenty) لا على كرة تقريبية.
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
var LS=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var R=Math.PI/180,KAABA={lat:21.422487,lon:39.826206};
var K_OFF='muslim-v112-qibla-off',K_DECL='muslim-v112-decl';
function norm(d){d=d%360;return d<0?d+360:d}
function delta(a,b){var d=norm(b-a);return d>180?d-360:d}

/* ---------- 1) اتجاه القبلة والمسافة (Vincenty على WGS84) ---------- */
function inverse(lat1,lon1,lat2,lon2){
  var a=6378137,f=1/298.257223563,b=(1-f)*a;
  var L=(lon2-lon1)*R,U1=Math.atan((1-f)*Math.tan(lat1*R)),U2=Math.atan((1-f)*Math.tan(lat2*R));
  var sU1=Math.sin(U1),cU1=Math.cos(U1),sU2=Math.sin(U2),cU2=Math.cos(U2),lam=L,it=0,sl,cl,ss,cs,sig,sa,c2a,c2sm,C;
  do{
    sl=Math.sin(lam);cl=Math.cos(lam);
    ss=Math.sqrt((cU2*sl)*(cU2*sl)+(cU1*sU2-sU1*cU2*cl)*(cU1*sU2-sU1*cU2*cl));
    if(ss===0)return{bearing:0,dist:0};
    cs=sU1*sU2+cU1*cU2*cl;sig=Math.atan2(ss,cs);sa=cU1*cU2*sl/ss;c2a=1-sa*sa;
    c2sm=c2a?cs-2*sU1*sU2/c2a:0;C=f/16*c2a*(4+f*(4-3*c2a));
    var lp=lam;lam=L+(1-C)*f*sa*(sig+C*ss*(c2sm+C*cs*(-1+2*c2sm*c2sm)));
    if(Math.abs(lam-lp)<1e-12)break;
  }while(++it<100);
  if(it>=100)return sphere(lat1,lon1,lat2,lon2);
  var u2=c2a*(a*a-b*b)/(b*b),A=1+u2/16384*(4096+u2*(-768+u2*(320-175*u2))),B=u2/1024*(256+u2*(-128+u2*(74-47*u2)));
  var ds=B*ss*(c2sm+B/4*(cs*(-1+2*c2sm*c2sm)-B/6*c2sm*(-3+4*ss*ss)*(-3+4*c2sm*c2sm)));
  var s=b*A*(sig-ds);
  var az=Math.atan2(cU2*sl,cU1*sU2-sU1*cU2*cl)/R;
  return{bearing:norm(az),dist:s/1000};
}
function sphere(la1,lo1,la2,lo2){
  var y=Math.sin((lo2-lo1)*R)*Math.cos(la2*R),x=Math.cos(la1*R)*Math.sin(la2*R)-Math.sin(la1*R)*Math.cos(la2*R)*Math.cos((lo2-lo1)*R);
  var d=Math.acos(Math.min(1,Math.sin(la1*R)*Math.sin(la2*R)+Math.cos(la1*R)*Math.cos(la2*R)*Math.cos((lo2-lo1)*R)));
  return{bearing:norm(Math.atan2(y,x)/R),dist:d*6371.0088};
}
function qiblaFrom(lat,lon){return inverse(lat,lon,KAABA.lat,KAABA.lon)}

/* ---------- 2) اتجاه الهاتف مع تعويض الميلان ودوران الشاشة ---------- */
function mul(A,B){var C=[[0,0,0],[0,0,0],[0,0,0]];for(var i=0;i<3;i++)for(var j=0;j<3;j++)for(var k=0;k<3;k++)C[i][j]+=A[i][k]*B[k][j];return C}
function rot(alpha,beta,gamma){
  var a=alpha*R,b=beta*R,g=gamma*R,ca=Math.cos(a),sa=Math.sin(a),cb=Math.cos(b),sb=Math.sin(b),cg=Math.cos(g),sg=Math.sin(g);
  return mul(mul([[ca,-sa,0],[sa,ca,0],[0,0,1]],[[1,0,0],[0,cb,-sb],[0,sb,cb]]),[[cg,0,sg],[0,1,0],[-sg,0,cg]]);
}
/* screenAngle: 0/90/180/270 (screen.orientation.angle) ⇒ متجه «أعلى الشاشة» في إحداثيات الجهاز */
function headingFromEuler(alpha,beta,gamma,screenAngle){
  var M=rot(alpha,beta,gamma),ang=((screenAngle%360)+360)%360;
  var u=ang===90?[1,0,0]:ang===180?[0,-1,0]:ang===270?[-1,0,0]:[0,1,0];
  /* اتجاه أعلى الشاشة + اتجاه الكاميرا الخلفية (-z) في إحداثيات الأرض: x شرق، y شمال */
  var eu=[M[0][0]*u[0]+M[0][1]*u[1]+M[0][2]*u[2],M[1][0]*u[0]+M[1][1]*u[1]+M[1][2]*u[2]];
  var ez=[-M[0][2],-M[1][2]];
  /* نعتمد اتجاه أعلى الشاشة ما دام الهاتف قريبًا من الأفقي (لا يتأثر بالالتفاف الجانبي)،
     وننتقل تدريجيًا إلى اتجاه الكاميرا الخلفية عندما يصير الهاتف عموديًا */
  var m=Math.hypot(eu[0],eu[1]),w=Math.max(0,Math.min(1,(0.5-m)/0.5));
  var x=eu[0]+w*ez[0],y=eu[1]+w*ez[1];
  if(Math.hypot(x,y)<0.05)return null;           /* لا اتجاه معتبر */
  return norm(Math.atan2(x,y)/R);
}
function screenAngle(){
  try{if(screen.orientation&&typeof screen.orientation.angle==='number')return screen.orientation.angle}catch(e){}
  return typeof window.orientation==='number'?norm(window.orientation):0;
}

/* ---------- 3) الانحراف المغناطيسي (WMM) ---------- */
var decl=null,declSrc='';
async function loadDecl(lat,lon){
  var key=Math.round(lat*2)/2+','+Math.round(lon*2)/2,month=new Date().toISOString().slice(0,7),c=LG(K_DECL,null);
  if(c&&c.key===key&&c.month===month&&isFinite(c.v)){decl=c.v;declSrc='WMM';return}
  try{
    var m=await import('https://cdn.jsdelivr.net/npm/geomagnetism@0.2.0/+esm');
    var g=m.default||m;
    var model=g.model(new Date(),{allowOutOfBoundsModel:true});
    var info=model.point([lat,lon]);
    if(info&&isFinite(info.decl)){decl=info.decl;declSrc='WMM';LS(K_DECL,{key:key,month:month,v:decl})}
  }catch(e){if(c&&isFinite(c.v)&&c.key===key){decl=c.v;declSrc='WMM (محفوظ)'}}
}

/* ---------- 4) الشمس (للمعايرة) ---------- */
function sunAz(lat,lon,date){
  var jd=date.getTime()/86400000+2440587.5,n=jd-2451545.0,L=(280.460+0.9856474*n)%360,g=((357.528+0.9856003*n)%360)*R;
  var lam=(L+1.915*Math.sin(g)+0.020*Math.sin(2*g))*R,eps=(23.439-0.0000004*n)*R;
  var ra=Math.atan2(Math.cos(eps)*Math.sin(lam),Math.cos(lam)),dec=Math.asin(Math.sin(eps)*Math.sin(lam));
  var gmst=(280.46061837+360.98564736629*(jd-2451545.0))%360,H=((gmst+lon)*R-ra);
  var alt=Math.asin(Math.sin(lat*R)*Math.sin(dec)+Math.cos(lat*R)*Math.cos(dec)*Math.cos(H));
  var az=Math.atan2(-Math.sin(H)*Math.cos(dec),Math.cos(lat*R)*Math.sin(dec)-Math.sin(lat*R)*Math.cos(dec)*Math.cos(H));
  return{az:norm(az/R),alt:alt/R};
}

/* ---------- الحالة والحساسات ---------- */
var S={loc:null,bearing:null,dist:null,raw:null,smooth:null,src:'',acc:null,running:false,off:LG(K_OFF,0),tol:3,locked:false};
function trueHeading(){            /* الاتجاه الحقيقي بعد التصحيحات */
  if(S.smooth==null)return null;
  var d=(decl!=null)?decl:0;
  return norm(S.smooth+d+S.off);
}
function onOrient(e){
  var h=null,sa=screenAngle();
  if(typeof e.webkitCompassHeading==='number'&&isFinite(e.webkitCompassHeading)){
    /* iOS: اتجاه أعلى الجهاز (مغناطيسي) — نضيف دوران الشاشة */
    h=norm(e.webkitCompassHeading+sa);S.src='iOS';S.acc=e.webkitCompassAccuracy;
  }else if(e.absolute===true||e.type==='deviceorientationabsolute'){
    if(e.alpha==null||e.beta==null||e.gamma==null)return;
    h=headingFromEuler(e.alpha,e.beta,e.gamma,sa);S.src='Android';
  }else return;           /* حدث نسبي (لا يعرف الشمال) ⇒ نتجاهله */
  if(h==null)return;
  S.raw=h;
  if(S.smooth==null)S.smooth=h;
  else{var d=delta(S.smooth,h);S.smooth=norm(S.smooth+d*(Math.abs(d)>25?0.5:0.14))}   /* تنعيم دائري */
}
function listen(){
  if(S.running)return;
  window.addEventListener('deviceorientationabsolute',onOrient,true);
  window.addEventListener('deviceorientation',onOrient,true);
  S.running=true;
}
async function startSensors(){
  var D=window.DeviceOrientationEvent;
  if(D&&typeof D.requestPermission==='function'){
    try{var p=await D.requestPermission();if(p!=='granted'){say('لم يُسمح بحساس الاتجاه. فعّله من إعدادات المتصفح ثم أعد المحاولة.');return false}}catch(e){say('تعذّر طلب إذن البوصلة.');return false}
  }
  listen();return true;
}

/* ---------- الموقع ---------- */
function getPos(){
  function once(opt){return new Promise(function(res){
    if(!navigator.geolocation){res(null);return}
    navigator.geolocation.getCurrentPosition(function(p){res({lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy,alt:p.coords.altitude})},function(){res(null)},opt);
  })}
  /* محاولة دقيقة أولًا ثم أخف (بعض الأجهزة لا تعطي GPS داخل المباني) */
  return once({enableHighAccuracy:true,timeout:9000,maximumAge:30000}).then(function(p){return p||once({enableHighAccuracy:false,timeout:9000,maximumAge:600000})});
}
async function locate(){
  say('📍 جارٍ تحديد موقعك بدقة…');
  var p=await getPos();
  if(!p){var sv=window.v107Prayer&&window.v107Prayer.getLoc&&window.v107Prayer.getLoc();if(sv)p={lat:sv.lat,lon:sv.lon,acc:sv.acc}}
  if(!p){say('تعذّر تحديد الموقع. فعّل GPS وأذن للموقع ثم أعد المحاولة.');return false}
  S.loc=p;var q=qiblaFrom(p.lat,p.lon);S.bearing=q.bearing;S.dist=q.dist;
  loadDecl(p.lat,p.lon).then(info);
  info();return true;
}

/* ---------- الواجهة ---------- */
function say(t){var e=$('qbText');if(e)e.textContent=t}
function build(){
  var s=$('qibla');if(!s||s.dataset.v112)return;s.dataset.v112='1';
  s.innerHTML='<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>🧭 القبلة</h2><p>بوصلة بتصحيح الانحراف المغناطيسي وتعويض الميلان</p></div></div>'+
   '<div class="card qbCard"><div class="qbStage"><div class="qbPointer" aria-hidden="true">▲</div><div class="qbDial" id="qbDial"><span class="qbN">N</span><span class="qbE">E</span><span class="qbS">S</span><span class="qbW">W</span><span class="qbKaaba" id="qbKaaba" aria-label="الكعبة">🕋</span></div></div>'+
   '<div class="qbReadout"><b id="qbText">اضغط «تشغيل البوصلة»</b><span id="qbSub" class="mini"></span></div>'+
   '<div class="controls" style="flex-wrap:wrap"><button class="primary" id="qbStart">🧭 تشغيل البوصلة</button><button id="qbLoc">📍 تحديث موقعي</button></div>'+
   '<div id="qbInfo" class="qbInfo mini"></div></div>'+
   '<div class="card"><b>🎯 معايرة الدقة</b><p class="mini">إن شعرتَ أن السهم لا يطابق القبلة، عايِر مرة واحدة فتُحفظ:</p>'+
   '<div class="controls" style="flex-wrap:wrap"><button id="qbKnown">🕌 أنا أواجه قبلة معروفة (محراب)</button><button id="qbSun">☀️ معايرة بالشمس</button><button id="qbReset">↺ إلغاء المعايرة</button></div>'+
   '<div id="qbCalNote" class="mini" style="margin-top:6px"></div></div>'+
   '<div class="card mini">للدقة: ابتعد عن الحديد والمغانط والسماعات، وحرّك الهاتف بشكل «8» في الهواء لمعايرة الحساس، ثم ثبّته أفقيًا أو عموديًا. الانحراف المغناطيسي يُحسب من نموذج WMM تلقائيًا.<br><button class="qbLink" id="qbMap">🗺️ فتح اتجاه الكعبة على الخريطة</button></div>';
  $('qbStart').onclick=async function(){if(!S.loc)await locate();var ok=await startSensors();if(ok){say('حرّك الهاتف ببطء…');tick()}};
  $('qbLoc').onclick=locate;
  $('qbKnown').onclick=calKnown;$('qbSun').onclick=calSun;
  $('qbReset').onclick=function(){S.off=0;LS(K_OFF,0);note('أُلغيت المعايرة.');info()};
  $('qbMap').onclick=function(){var p=S.loc;window.open('https://www.google.com/maps/dir/?api=1&'+(p?'origin='+p.lat+','+p.lon+'&':'')+'destination='+KAABA.lat+','+KAABA.lon,'_blank','noopener')};
  note();
}
function note(t){var e=$('qbCalNote');if(e)e.textContent=t||(S.off?'معايرة محفوظة: '+(S.off>0?'+':'')+S.off.toFixed(1)+'°':'')}
function info(){
  var e=$('qbInfo');if(!e)return;
  var p=S.loc;if(!p){e.textContent='الموقع غير محدد بعد.';return}
  e.innerHTML='الموقع: '+p.lat.toFixed(5)+'، '+p.lon.toFixed(5)+(p.acc?' (±'+Math.round(p.acc)+' م)':'')+
   '<br>اتجاه القبلة (من الشمال الحقيقي): <b>'+S.bearing.toFixed(1)+'°</b> • المسافة إلى الكعبة: <b>'+Math.round(S.dist).toLocaleString('ar')+' كم</b>'+
   '<br>الانحراف المغناطيسي: <b>'+(decl==null?'غير متاح (استخدم المعايرة)':(decl>=0?'+':'')+decl.toFixed(1)+'° '+declSrc)+'</b>'+(S.src?' • الحساس: '+S.src:'');
}
var lastBuzz=0,raf=0;
function tick(){
  cancelAnimationFrame(raf);
  var th=trueHeading(),dial=$('qbDial'),kb=$('qbKaaba');
  if(dial&&th!=null&&S.bearing!=null){
    dial.style.transform='rotate('+(-th)+'deg)';
    kb.style.transform='rotate('+S.bearing+'deg) translateY(calc(var(--qbR) * -1)) rotate('+(-S.bearing+th)+'deg)';
    var d=delta(th,S.bearing),ad=Math.abs(d),st=$('qbText'),stage=document.querySelector('.qbStage');
    var ok=ad<=S.tol;stage.classList.toggle('on',ok);
    st.textContent=ok?'✅ أنت تواجه القبلة':(d>0?'دُر يمينًا ':'دُر يسارًا ')+Math.round(ad)+'°';
    var sub=$('qbSub');
    var warn=(S.acc!=null&&S.acc>25)?' ⚠️ البوصلة تحتاج معايرة: حرّكها بشكل 8':'';
    if(sub)sub.textContent='اتجاه الهاتف: '+Math.round(th)+'° • اتجاه القبلة: '+Math.round(S.bearing)+'°'+warn;
    if(ok&&Date.now()-lastBuzz>4000){lastBuzz=Date.now();try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}}
  }
  if($('qibla')&&$('qibla').classList.contains('active'))raf=requestAnimationFrame(tick);
}
/* ---------- المعايرة ---------- */
function calKnown(){
  if(S.smooth==null||S.bearing==null){note('شغّل البوصلة وحدّد موقعك أولًا.');return}
  /* نريد: smooth + decl + off = bearing */
  var off=delta(norm(S.smooth+(decl||0)),S.bearing);
  S.off=Math.max(-60,Math.min(60,off));LS(K_OFF,S.off);note('✅ عُدّل الاتجاه بمقدار '+S.off.toFixed(1)+'° اعتمادًا على القبلة التي تواجهها.');
}
function calSun(){
  if(S.smooth==null||!S.loc){note('شغّل البوصلة وحدّد موقعك أولًا.');return}
  var s=sunAz(S.loc.lat,S.loc.lon,new Date());
  if(s.alt<5){note('الشمس منخفضة أو تحت الأفق الآن؛ جرّب نهارًا.');return}
  if(s.alt>75){note('الشمس شبه عمودية فلا تصلح للمعايرة؛ جرّب صباحًا أو عصرًا.');return}
  if(!confirm('وجّه أعلى الهاتف نحو الشمس بدقة (دون النظر إليها مباشرة؛ استعمل ظلّ إصبعك على الهاتف الأفقي ليتساوى طرفاه)، ثم اضغط موافق.'))return;
  var off=delta(norm(S.smooth+(decl||0)),s.az);
  S.off=Math.max(-60,Math.min(60,off));LS(K_OFF,S.off);note('✅ عُدّل الاتجاه بمقدار '+S.off.toFixed(1)+'° بالاعتماد على اتجاه الشمس ('+s.az.toFixed(1)+'°).');
}

/* ---------- ربط ---------- */
window.locateQibla=async function(){build();show('qibla');if(!S.loc)await locate();var ok=await startSensors();if(ok)tick()};
window.enableCompass=startSensors;
window.openQiblaMap=function(){var b=$('qbMap');if(b)b.click()};
window.v107Qibla={bearingFrom:qiblaFrom,headingFromEuler:headingFromEuler,sunAz:sunAz,state:S};
var _show=window.show;
window.show=function(id){var r=_show.apply(this,arguments);if(id==='qibla'){build();if(!S.loc)locate();tick()}return r};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
