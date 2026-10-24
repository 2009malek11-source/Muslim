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
var EP=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://overpass.private.coffee/api/interpreter','https://overpass.openstreetmap.fr/api/interpreter','https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
var NOMI='https://nominatim.openstreetmap.org';
var RADII=[1500,4000,10000,25000];
var type=localStorage.getItem('muslimMosqueType')==='women'?'women':'mosques';
var run=0,loc=null,R_=Math.PI/180;
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
   'nwr["amenity"="prayer_room"]["religion"="muslim"]'+a+';'+
   ');out center tags 250;';
}
function fetchOne(ep,q,ctl){return fetch(ep,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:ctl.signal,cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).then(function(j){if(!j||!j.elements)throw new Error('bad');return j})}
/* نسأل كل الخوادم معًا ونأخذ أول ردّ سليم */
function overpass(q){
  return new Promise(function(res,rej){
    var ctl=new AbortController(),fail=0,done=false,to=setTimeout(function(){ctl.abort()},30000);
    EP.forEach(function(ep){fetchOne(ep,q,ctl).then(function(j){if(!done){done=true;clearTimeout(to);ctl.abort();res(j.elements||[])}}).catch(function(){fail++;if(fail===EP.length&&!done){clearTimeout(to);rej(new Error('overpass'))}})});
  });
}
/* المصدر الثاني: Nominatim (أسماء عربية جاهزة) — يعمل حتى لو تعطّلت خوادم Overpass */
function nominatim(la,lo,R,women){
  var d=R/111320,dl=d/Math.max(.2,Math.cos(la*R_)),vb=[lo-dl,la+d,lo+dl,la-d].join(',');
  var qs=women?['مصلى نساء','مصلى النساء','مصلى سيدات']:['مسجد','جامع'];
  return Promise.all(qs.map(function(q){
    return fetch(NOMI+'/search?format=jsonv2&limit=40&bounded=1&addressdetails=1&extratags=1&namedetails=1&accept-language=ar&viewbox='+vb+'&q='+encodeURIComponent(q)).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null});
  })).then(function(rs){
    var out=[],ok=false;rs.forEach(function(r){if(r){ok=true;r.forEach(function(x){out.push({type:'nom',id:x.place_id,lat:+x.lat,lon:+x.lon,tags:Object.assign({},x.extratags||{},{name:(x.namedetails&&(x.namedetails['name:ar']||x.namedetails.name))||x.name||'','addr:street':x.address&&x.address.road,'addr:city':x.address&&(x.address.suburb||x.address.city||x.address.town||x.address.village)},{amenity:'place_of_worship',religion:'muslim'})})})}});
    if(!ok)throw new Error('nominatim');return out;
  });
}
/* المصدر الثالث: خرائط Google. بلا مفتاح: روابط بحث مباشرة؛ ومع مفتاح Places في app-config.js: نتائج تُدمج هنا */
function google(la,lo,R,women){
  var key=window.GOOGLE_PLACES_KEY;if(!key)return Promise.reject(new Error('nokey'));
  var hdr={'Content-Type':'application/json','X-Goog-Api-Key':key,'X-Goog-FieldMask':'places.id,places.displayName,places.location,places.formattedAddress,places.types'};
  var circle={circle:{center:{latitude:la,longitude:lo},radius:Math.min(R,50000)}};
  var req=women?fetch('https://places.googleapis.com/v1/places:searchText',{method:'POST',headers:hdr,body:JSON.stringify({textQuery:'مصلى نساء',languageCode:'ar',maxResultCount:20,locationBias:circle})})
              :fetch('https://places.googleapis.com/v1/places:searchNearby',{method:'POST',headers:hdr,body:JSON.stringify({includedTypes:['mosque'],languageCode:'ar',maxResultCount:20,locationRestriction:circle})});
  return req.then(function(r){if(!r.ok)throw new Error('google');return r.json()}).then(function(j){
    return (j.places||[]).map(function(p){return{type:'goo',id:p.id,lat:p.location.latitude,lon:p.location.longitude,tags:{name:p.displayName&&p.displayName.text,'addr:street':p.formattedAddress,amenity:'place_of_worship',religion:'muslim',_google:'1',_womenq:women?'1':''}}});
  });
}
function gLink(la,lo,women){return 'https://www.google.com/maps/search/'+encodeURIComponent(women?'مصلى نساء':'مسجد')+'/@'+la+','+lo+',15z'}
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
/* ---------- الأسماء ---------- */
function nameOf(t,musalla){
  var n=t['name:ar']||t.name||t['official_name:ar']||t.official_name||t['alt_name:ar']||t.alt_name||t['name:en']||t['name:fr']||t.operator||'';
  if(n)return {n:n,real:true};
  var where=[t['addr:street'],t['addr:suburb']||t['addr:neighbourhood']||t['addr:city']].filter(Boolean).join('، ');
  return {n:(musalla?'مصلى':'مسجد')+(where?' — '+where:' (بلا اسم مسجّل في الخريطة)'),real:false};
}
function card(x){
  var d=x.d<1?Math.round(x.d*1000)+' متر':x.d.toFixed(2)+' كم';
  var badge=x.w==='yes'?'<span class="mqB ok">✓ مخصص/متاح للنساء</span>':(x.w==='no'?'<span class="mqB no">للرجال فقط</span>':'<span class="mqB">قسم النساء غير مسجّل</span>');
  var src=x.src.map(function(s){return '<span class="mqB">'+s+'</span>'}).join(' ');
  var addr=[x.t['addr:street'],x.t['addr:housenumber'],x.t['addr:city']].filter(Boolean).join('، ');
  return '<div class="mosqueItem mqItem" data-k="'+x.k+'"><div style="flex:1;min-width:0"><b class="mqName">'+(x.musalla?'🤲 ':'🕌 ')+esc(x.name)+'</b>'+
   '<div class="mini">'+d+' • '+dir8(x.b)+'</div>'+(addr&&x.name.indexOf(addr)<0?'<div class="mini">'+esc(addr)+'</div>':'')+'<div style="margin-top:4px">'+badge+' '+src+'</div></div>'+
   '<div class="controls" style="margin:0;flex:0 0 auto"><button type="button" onclick="window.open(\'https://www.google.com/maps/search/?api=1&query='+x.la+','+x.lo+'\',\'_blank\',\'noopener\')">📍 الموقع</button><button type="button" onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination='+x.la+','+x.lo+'\',\'_blank\',\'noopener\')">🧭 اتجاهات</button></div></div>';
}
function googleBar(){
  if(!loc)return '';
  return '<div class="card" style="margin-top:8px"><b>🗺️ خرائط Google</b><div class="mini">مصدر إضافي: افتح نتائج Google لنفس منطقتك.</div><div class="controls"><button type="button" onclick="window.open(\''+gLink(loc.lat,loc.lon,false)+'\',\'_blank\',\'noopener\')">🕌 مساجد قريبة</button><button type="button" onclick="window.open(\''+gLink(loc.lat,loc.lon,true)+'\',\'_blank\',\'noopener\')">🤲 مصليات النساء</button></div></div>';
}
function render(items,R,final,srcs){
  var list=$('mosqueList'),st=$('mosqueStatus'),via=srcs.length?' (المصادر: '+srcs.join('، ')+')':'';
  if(type==='women'){
    var yes=items.filter(function(x){return x.w==='yes'}),rest=items.filter(function(x){return x.w==='unknown'&&!x.musalla}).slice(0,10);
    var h='';
    h+=yes.length?yes.slice(0,40).map(card).join(''):'<div class="card mini">لم نجد حتى '+(R/1000)+' كم مكانًا <b>مؤكدًا</b> للنساء في المصادر المتاحة.</div>';
    if(final&&rest.length)h+='<details class="card" style="margin-top:8px"><summary><b>مساجد قريبة لم يُسجَّل فيها قسم النساء (غير مؤكد)</b></summary><div class="mini" style="margin:6px 0">قد يكون فيها مصلى للنساء لكنه غير مسجّل؛ يُنصح بالسؤال أو الاتصال قبل الذهاب.</div>'+rest.map(card).join('')+'</details>';
    list.innerHTML=h+(final?googleBar():'');
    st.textContent=yes.length?('✅ '+yes.length+' مكانًا مؤكدًا للنساء ضمن '+(R/1000)+' كم'+via+(final?'':' — يستمر البحث…')):(final?'لا يوجد مؤكد ضمن النطاق المبحوث.':'⏳ جارٍ التوسيع حتى '+(R/1000)+' كم…');
  }else{
    var m=items.filter(function(x){return x.w!=='only'}).slice(0,60);
    list.innerHTML=(m.length?m.map(card).join(''):'<div class="card mini">لا نتائج بعد…</div>')+(final?googleBar():'');
    st.textContent=m.length?('✅ '+m.length+' مكانًا ضمن '+(R/1000)+' كم'+via+(final?'':' — يستمر البحث…')):'⏳ جارٍ البحث…';
  }
}
/* دمج النتائج من عدة مصادر: نفس المكان إذا تقارب الموقع (<60م) وتشابه الاسم أو غاب أحدهما */
function sameName(a,b){a=String(a||'').replace(/\s|مسجد|جامع|مصلى/g,'');b=String(b||'').replace(/\s|مسجد|جامع|مصلى/g,'');return !a||!b||a.indexOf(b)>=0||b.indexOf(a)>=0}
function addItem(all,e,srcName,my){
  var t=e.tags||{},la=e.lat!=null?e.lat:(e.center&&e.center.lat),lo=e.lon!=null?e.lon:(e.center&&e.center.lon);if(la==null||lo==null)return;
  var mus=isMusalla(t),nm=nameOf(t,mus),w=womenState(t);
  if(lc(t.female)==='only'&&!WOMEN_NAME.test(t.name||''))w='yes';
  if(t._womenq&&w==='unknown')w='yes';
  var d=hav(my.lat,my.lon,la,lo);
  for(var i=0;i<all.length;i++){var o=all[i];
    if(hav(o.la,o.lo,la,lo)<0.06&&(sameName(o.rawName,nm.real?nm.n:'')||!o.real||!nm.real)){
      if(o.src.indexOf(srcName)<0)o.src.push(srcName);
      if(!o.real&&nm.real){o.name=nm.n;o.rawName=nm.n;o.real=true}
      if(o.w==='unknown'&&w!=='unknown')o.w=w;
      return}}
  all.push({k:e.type+e.id,t:t,la:la,lo:lo,d:d,b:bearing(my.lat,my.lon,la,lo),name:nm.n,rawName:nm.real?nm.n:'',real:nm.real,musalla:mus,w:w,src:[srcName]});
}
/* أسماء للأماكن بلا اسم: أقرب شارع/حي عبر Nominatim (مهلة 1.1ث بين الطلبات احترامًا لسياستهم) */
var revBusy=false;
async function nameUnnamed(items,my){
  if(revBusy)return;revBusy=true;
  var todo=items.filter(function(x){return !x.real&&!x.rev}).slice(0,6);
  for(var i=0;i<todo.length;i++){
    var x=todo[i];x.rev=1;
    try{
      var r=await fetch(NOMI+'/reverse?format=jsonv2&zoom=17&accept-language=ar&lat='+x.la+'&lon='+x.lo).then(function(r){return r.ok?r.json():null});
      var a=r&&r.address;if(a){var where=[a.road,a.suburb||a.neighbourhood||a.city_district||a.town||a.village||a.city].filter(Boolean).join('، ');
        if(where){x.name=(x.musalla?'مصلى':'مسجد')+' — '+where;var el=document.querySelector('[data-k="'+x.k+'"] .mqName');if(el)el.textContent=(x.musalla?'🤲 ':'🕌 ')+x.name}}
    }catch(e){}
    await new Promise(function(r){setTimeout(r,1100)});
  }
  revBusy=false;
}
async function go(force){
  page();var my=++run,st=$('mosqueStatus'),list=$('mosqueList');list.innerHTML='';
  if(!loc){st.textContent='📍 جارٍ تحديد موقعك بدقة…';loc=await pos(force);if(!loc){var sv=window.v107Prayer&&window.v107Prayer.getLoc&&window.v107Prayer.getLoc();if(sv)loc={lat:sv.lat,lon:sv.lon,acc:sv.acc}}}
  if(my!==run)return;
  if(!loc){st.textContent='تعذّر تحديد الموقع. فعّل خدمة الموقع وأذن للمتصفح ثم أعد المحاولة.';list.innerHTML='';return}
  $('selectedLocationMosques').textContent='موقعك: '+loc.lat.toFixed(4)+'، '+loc.lon.toFixed(4)+(loc.acc?' (دقة ±'+Math.round(loc.acc)+' م'+(loc.acc>1000?' — ضعيفة، فعّل GPS':'')+')':'');
  var all=[],used={},women=type==='women';
  for(var i=0;i<RADII.length;i++){
    if(my!==run)return;var Rr=RADII[i];
    st.textContent='⏳ أبحث ضمن '+(Rr/1000)+' كم…';
    var jobs=[['OpenStreetMap',overpass(build(Rr,loc.lat,loc.lon))],['Nominatim',nominatim(loc.lat,loc.lon,Rr,women)]];
    if(window.GOOGLE_PLACES_KEY)jobs.push(['Google',google(loc.lat,loc.lon,Rr,women)]);
    var rs=await Promise.all(jobs.map(function(j){return j[1].then(function(v){return{n:j[0],v:v}}).catch(function(){return{n:j[0],v:null}})}));
    if(my!==run)return;
    var okAny=false;
    rs.forEach(function(r){if(r.v){okAny=true;used[r.n]=1;r.v.forEach(function(e){addItem(all,e,r.n,loc)})}});
    if(!okAny&&!all.length&&i===RADII.length-1){
      st.textContent='تعذّر الوصول إلى مصادر الخرائط الآن (قد يكون الضغط على الخوادم المجانية). أعد المحاولة بعد لحظات، أو استعمل خرائط Google بالأسفل.';
      list.innerHTML='<div class="controls"><button type="button" class="primary" id="mqRetry">🔄 إعادة المحاولة</button></div>'+googleBar();
      $('mqRetry').onclick=function(){go()};return;
    }
    all.sort(function(a,b){return a.d-b.d});
    var enough=women?all.filter(function(x){return x.w==='yes'}).length>=5:all.length>=8;
    var fin=enough||i===RADII.length-1;
    render(all,Rr,fin,Object.keys(used));
    if(fin){nameUnnamed(all.filter(function(x){return women?x.w!=='no':true}),loc);return}
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
