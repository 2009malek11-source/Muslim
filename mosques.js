/* =====================================================================
   المسلم v108 — المساجد ومصليات النساء القريبة (إعادة بناء كاملة بدل الترقيعات القديمة)
   - مصدر البيانات: OpenStreetMap عبر Overpass (مفتوح، ويعتمد على ما سجّله المتطوعون).
   - مصليات النساء: لا تُعرض كـ«مؤكدة» إلا إذا دلّت الوسوم أو الاسم صراحةً على إتاحتها للنساء:
       female=yes|only|designated ، women=yes ، access:female=yes ، أو اسم يتضمن (نساء/سيدات/للنساء/women/ladies...)
     وما عداها يُعرض في قسم منفصل «غير مؤكد» ليتحقق منه المستخدم، حتى لا نخدعه بمعلومة غير مثبتة.
   - المسافة: هافرساين من موقعك الفعلي (مع ذكر دقة الموقع).
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var EP=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://overpass.private.coffee/api/interpreter'];
var RADII=[2000,5000,10000,25000];
var type=localStorage.getItem('muslimMosqueType')==='women'?'women':'mosques';
var run=0,loc=null;
var WOMEN_NAME=/نساء|النساء|للنساء|سيدات|السيدات|للسيدات|حريم|women|woman|ladies|lady|female|sisters/i;
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function hav(a,b,c,d){var R=Math.PI/180,x=Math.sin((c-a)*R/2),y=Math.sin((d-b)*R/2),h=x*x+Math.cos(a*R)*Math.cos(c*R)*y*y;return 12742*Math.asin(Math.sqrt(h))}
function bearing(a,b,c,d){var R=Math.PI/180,y=Math.sin((d-b)*R)*Math.cos(c*R),x=Math.cos(a*R)*Math.sin(c*R)-Math.sin(a*R)*Math.cos(c*R)*Math.cos((d-b)*R);return (Math.atan2(y,x)/R+360)%360}
function dir8(b){return['شمالًا','شمال شرق','شرقًا','جنوب شرق','جنوبًا','جنوب غرب','غربًا','شمال غرب'][Math.round(b/45)%8]}
function lc(v){return String(v==null?'':v).toLowerCase()}
/* تصنيف الوسوم */
function womenState(t){
  var f=[t.female,t.women,t['female:access'],t['access:female'],t['women:access']].map(lc);
  if(f.some(function(v){return v==='no'}))return 'no';
  if(f.some(function(v){return v==='yes'||v==='only'||v==='designated'||v==='permissive'}))return 'yes';
  var txt=[t.name,t['name:ar'],t['name:en'],t.description,t['description:ar'],t.note].join(' ');
  if(WOMEN_NAME.test(txt))return 'yes';
  return 'unknown';
}
function isWomenOnly(t){return ['only','designated'].indexOf(lc(t.female))>=0||WOMEN_NAME.test([t.name,t['name:ar']].join(' '))}
function isMusalla(t){return lc(t.place_of_worship)==='musalla'||/مصلى|مصلّى|musalla|mushalla/i.test([t.name,t['name:ar']].join(' '))}
function build(R,la,lo){
  var a='(around:'+R+','+la+','+lo+')';
  return '[out:json][timeout:25];('+
   'nwr["amenity"="place_of_worship"]["religion"="muslim"]'+a+';'+
   'nwr["building"="mosque"]'+a+';'+
   'nwr["place_of_worship"~"^(mosque|musalla)$"]'+a+';'+
   'nwr["amenity"="prayer_room"]["religion"="muslim"]'+a+';'+
   ');out center tags;';
}
function fetchOne(ep,q,ctl){return fetch(ep+'?data='+encodeURIComponent(q),{signal:ctl.signal,cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})}
function overpass(q){
  /* نأخذ أول خادم يرد بنجاح */
  return new Promise(function(res,rej){
    var ctl=new AbortController(),fail=0,done=false,to=setTimeout(function(){ctl.abort()},30000);
    EP.forEach(function(ep){fetchOne(ep,q,ctl).then(function(j){if(!done){done=true;clearTimeout(to);ctl.abort();res(j.elements||[])}}).catch(function(){fail++;if(fail===EP.length&&!done){clearTimeout(to);rej(new Error('all'))}})});
  });
}
function pos(force){
  return new Promise(function(res){
    if(!navigator.geolocation){res(null);return}
    navigator.geolocation.getCurrentPosition(function(p){res({lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy})},function(){res(null)},{enableHighAccuracy:true,timeout:15000,maximumAge:force?0:60000});
  });
}
function page(){
  var s=$('mosques');if(!s)return;
  if(s.dataset.v108)return;s.dataset.v108='1';
  s.innerHTML='<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>🕌 المساجد والمصليات القريبة</h2><p>الأقرب أولًا، بمسافة واتجاه ورابط للخريطة</p></div></div>'+
   '<div class="card"><div class="controls" id="mosqueTypeChooser"><button type="button" class="pill" data-mtype="mosques">🕌 المساجد</button><button type="button" class="pill" data-mtype="women">🤲 مصليات النساء</button></div>'+
   '<div class="notice" id="mosqueStatus">اضغط «البحث الآن».</div><div id="selectedLocationMosques" class="mini"></div>'+
   '<div class="controls"><button type="button" class="primary" id="mqGo">📍 البحث الآن</button><button type="button" id="mqLoc">🔄 تحديث موقعي</button></div></div>'+
   '<div id="mosqueList"></div><p class="mini" style="margin-top:10px">البيانات من OpenStreetMap ويحدّثها متطوعون؛ قد تنقص بعض الأماكن. لمصليات النساء نعرض «المؤكد» فقط ثم نفصل غير المؤكد صراحةً.</p>';
  s.querySelectorAll('[data-mtype]').forEach(function(b){b.onclick=function(){setType(b.dataset.mtype);go()}});
  $('mqGo').onclick=function(){go()};
  $('mqLoc').onclick=function(){loc=null;go(true)};
  mark();
}
function mark(){document.querySelectorAll('#mosqueTypeChooser .pill').forEach(function(b){b.classList.toggle('active',b.dataset.mtype===type)})}
function setType(t){type=t==='women'?'women':'mosques';localStorage.setItem('muslimMosqueType',type);mark()}
function card(x){
  var d=x.d<1?Math.round(x.d*1000)+' متر':x.d.toFixed(2)+' كم';
  var badge=x.w==='yes'?'<span class="mqB ok">✓ مخصص/متاح للنساء</span>':(x.w==='no'?'<span class="mqB no">للرجال فقط</span>':'<span class="mqB">قسم النساء غير مسجّل</span>');
  var addr=[x.t['addr:street'],x.t['addr:housenumber'],x.t['addr:city']].filter(Boolean).join('، ');
  return '<div class="mosqueItem mqItem"><div style="flex:1;min-width:0"><b>'+(x.musalla?'🤲 ':'🕌 ')+esc(x.name)+'</b>'+
   '<div class="mini">'+d+' • '+dir8(x.b)+'</div>'+(addr?'<div class="mini">'+esc(addr)+'</div>':'')+'<div style="margin-top:4px">'+badge+'</div></div>'+
   '<div class="controls" style="margin:0;flex:0 0 auto"><button type="button" onclick="window.open(\'https://www.google.com/maps/search/?api=1&query='+x.la+','+x.lo+'\',\'_blank\')">📍 الموقع</button><button type="button" onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination='+x.la+','+x.lo+'\',\'_blank\')">🧭 اتجاهات</button></div></div>';
}
function render(items,R,final){
  var list=$('mosqueList'),st=$('mosqueStatus');
  if(type==='women'){
    var yes=items.filter(function(x){return x.w==='yes'}),rest=items.filter(function(x){return x.w==='unknown'&&!x.musalla}).slice(0,10);
    var h='';
    h+=yes.length?yes.slice(0,40).map(card).join(''):'<div class="card mini">لم نجد حتى '+(R/1000)+' كم مكانًا <b>مؤكدًا</b> للنساء في بيانات الخريطة.</div>';
    if(final&&rest.length)h+='<details class="card" style="margin-top:8px"><summary><b>مساجد قريبة لم يُسجَّل فيها قسم النساء (غير مؤكد)</b></summary><div class="mini" style="margin:6px 0">قد يكون فيها مصلى للنساء لكنه غير مسجّل؛ يُنصح بالسؤال أو الاتصال قبل الذهاب.</div>'+rest.map(card).join('')+'</details>';
    list.innerHTML=h;
    st.textContent=yes.length?('✅ '+yes.length+' مكانًا مؤكدًا للنساء ضمن '+(R/1000)+' كم'+(final?'':' — يستمر البحث…')):(final?'لا يوجد مؤكد ضمن النطاق المبحوث.':'⏳ جارٍ التوسيع حتى '+(R/1000)+' كم…');
  }else{
    var m=items.filter(function(x){return x.w!=='only'}).slice(0,60);
    list.innerHTML=m.length?m.map(card).join(''):'<div class="card mini">لا نتائج بعد…</div>';
    st.textContent=m.length?('✅ '+m.length+' مكانًا ضمن '+(R/1000)+' كم'+(final?'':' — يستمر البحث…')):'⏳ جارٍ البحث…';
  }
}
async function go(force){
  page();var my=++run,st=$('mosqueStatus'),list=$('mosqueList');list.innerHTML='';
  if(!loc){st.textContent='📍 جارٍ تحديد موقعك بدقة…';loc=await pos(force);if(!loc){var sv=window.v107Prayer&&window.v107Prayer.getLoc&&window.v107Prayer.getLoc();if(sv)loc={lat:sv.lat,lon:sv.lon,acc:sv.acc}}}
  if(my!==run)return;
  if(!loc){st.textContent='تعذّر تحديد الموقع. فعّل خدمة الموقع وأذن للمتصفح ثم أعد المحاولة.';return}
  $('selectedLocationMosques').textContent='موقعك: '+loc.lat.toFixed(4)+'، '+loc.lon.toFixed(4)+(loc.acc?' (دقة ±'+Math.round(loc.acc)+' م'+(loc.acc>1000?' — ضعيفة، فعّل GPS':'')+')':'');
  var seen={},all=[];
  for(var i=0;i<RADII.length;i++){
    if(my!==run)return;var R=RADII[i];
    st.textContent='⏳ أبحث ضمن '+(R/1000)+' كم…';
    var els=[];try{els=await overpass(build(R,loc.lat,loc.lon))}catch(e){st.textContent='تعذّر الاتصال بخادم الخرائط. تحقق من الإنترنت وأعد المحاولة.';if(!all.length)return}
    els.forEach(function(e){
      var t=e.tags||{},la=e.lat!=null?e.lat:(e.center&&e.center.lat),lo=e.lon!=null?e.lon:(e.center&&e.center.lon);if(la==null||lo==null)return;
      var key=e.type+e.id;if(seen[key])return;seen[key]=1;
      var w=womenState(t);if(isWomenOnly(t)&&w==='yes'&&lc(t.female)==='only')w='yes';
      all.push({t:t,la:la,lo:lo,d:hav(loc.lat,loc.lon,la,lo),b:bearing(loc.lat,loc.lon,la,lo),name:t['name:ar']||t.name||(isMusalla(t)?'مصلى (بدون اسم)':'مسجد (بدون اسم)'),musalla:isMusalla(t),w:(lc(t.female)==='only'&&!WOMEN_NAME.test(t.name||''))?'yes':w});
    });
    all.sort(function(a,b){return a.d-b.d});
    var enough=type==='women'?all.filter(function(x){return x.w==='yes'}).length>=5:all.length>=8;
    render(all,R,enough||i===RADII.length-1);
    if(enough)return;
  }
}
/* نثبّت هذه الدوال بحيث لا تستطيع أي شيفرة قديمة استبدالها (كانت تُعاد كتابتها 5 مرات) */
function lock(name,fn){try{Object.defineProperty(window,name,{get:function(){return fn},set:function(){},configurable:false})}catch(e){window[name]=fn}}
lock('findMosques',function(){go()});
lock('setMosqueType',function(t){setType(t)});
lock('initNearbyMosques',function(){page();mark();var l=$('mosqueList');if(l&&!l.innerHTML)go()});
var _show=window.show;
window.show=function(id){var r=_show.apply(this,arguments);if(id==='mosques'){page();setTimeout(window.initNearbyMosques,60)}return r};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',page);else page();
})();
