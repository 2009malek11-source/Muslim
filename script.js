(function(){
'use strict';
try{var _st=document.createElement('style');_st.id='v105-css';_st.textContent='.v105flash{outline:2px solid var(--gold,#c8a15b);border-radius:12px}.controls button.primary,button.primary{background:linear-gradient(135deg,var(--green),var(--green2))!important;color:#fff!important}.adkDone{color:var(--green,#0a7a4b);font-weight:700;padding:6px 10px;display:inline-block}#modeCustom .adkChip{display:inline-flex;align-items:center;gap:4px;cursor:pointer}#modeCustom .adkChip input{margin:0}';document.head.appendChild(_st)}catch(e){}
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

/* ===== معلومات الإصدار + جامع الأخطاء + تقرير المشكلة ===== */
window.APP_BUILD='v106 • بناء 2026-10-22';
window.__v105Errs=[];
window.addEventListener('error',function(e){try{window.__v105Errs.push((e.message||'error')+' @'+String(e.filename||'').split('/').pop()+':'+(e.lineno||0))}catch(x){}if(window.__v105Errs.length>12)window.__v105Errs.shift()});
window.addEventListener('unhandledrejection',function(e){try{window.__v105Errs.push('promise: '+String((e.reason&&e.reason.message)||e.reason).slice(0,120))}catch(x){}if(window.__v105Errs.length>12)window.__v105Errs.shift()});
window.v105Report=async function(){
  var L=[];
  L.push('الإصدار: '+window.APP_BUILD);L.push('الوقت: '+new Date().toISOString());
  L.push('المتصفح: '+navigator.userAgent);
  L.push('نمط التطبيق (standalone): '+((window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone?'نعم':'لا'));
  L.push('الشاشة: '+innerWidth+'x'+innerHeight+' @'+(window.devicePixelRatio||1)+' | مقياس الخط: '+((localStorage.getItem('quran-m09-font-scale'))||'1'));
  L.push('متصل بالإنترنت: '+(navigator.onLine?'نعم':'لا'));
  try{L.push('Service Worker: '+((navigator.serviceWorker&&navigator.serviceWorker.controller)?'مفعّل':'غير مفعّل'))}catch(e){}
  try{if(navigator.permissions){var pm=await navigator.permissions.query({name:'geolocation'});L.push('إذن الموقع: '+pm.state)}}catch(e){L.push('إذن الموقع: غير معروف')}
  var P=window.__v105Pos;L.push('آخر موقع: '+(P?(P.lat.toFixed(4)+','+P.lon.toFixed(4)+' دقة '+Math.round(P.acc)+'م'):'—')+' | مصدر المساجد: '+(window.__v105Src||'—')+' | نصف القطر المبحوث: '+(window.__v105Searched||'—'));
  L.push('أخطاء Overpass: '+((window.__v105OvpErrs||[]).slice(-6).join(' ; ')||'—'));
  var D=$('v105Diag');L.push('آخر تشخيص صوت: '+(D?D.innerText.replace(/\s+/g,' '):'—'));
  L.push('أخطاء الصفحة: '+(window.__v105Errs.join(' ; ')||'—'));
  var txt=L.join('\n');
  try{await navigator.clipboard.writeText(txt);alert('تم نسخ التقرير ✅ الصقه في المحادثة.')}catch(e){
    var ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;inset:10% 5%;width:90%;height:70%;z-index:99999;background:#fff;color:#000;font-size:calc(14px*var(--v105-fs,1));direction:ltr';document.body.appendChild(ta);ta.select();
    var c=document.createElement('button');c.textContent='إغلاق';c.style.cssText='position:fixed;bottom:8%;left:50%;transform:translateX(-50%);z-index:100000;padding:10px 24px';c.onclick=function(){ta.remove();c.remove()};document.body.appendChild(c);
  }
  return txt;
};
(function(){
  /* صفّ في الإعدادات: الإصدار + التقرير + الفحص */
  function mount(){
    var acc=$('stgAccent');var host=acc&&acc.closest('.stgRow');if(!host||$('v105DiagRow'))return;
    var d=document.createElement('div');d.className='stgRow';d.id='v105DiagRow';d.style.flexWrap='wrap';
    d.innerHTML='<div><b>🩺 الإصدار والتشخيص</b><small>'+window.APP_BUILD+'</small></div><div style="display:flex;gap:6px;flex-wrap:wrap;width:100%;margin-top:6px"><button type="button" class="stgBtn" id="v105RepBtn">📋 نسخ تقرير المشكلة</button><button type="button" class="stgBtn" onclick="location.href=\'diag.html\'">🩺 فحص الاتصال والصوت</button><button type="button" class="stgBtn" id="v105ReloadBtn">🔄 تحديث التطبيق</button></div>';
    host.insertAdjacentElement('afterend',d);
    $('v105RepBtn').onclick=function(){window.v105Report()};
    $('v105ReloadBtn').onclick=function(){window.v105Reload()};
  }
  mount();document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[onclick*="settings"]'))setTimeout(mount,60)},true);
})();
window.v105Reload=async function(){
  try{var rs=await navigator.serviceWorker.getRegistrations();for(var i=0;i<rs.length;i++)await rs[i].update()}catch(e){}
  try{var ks=await caches.keys();for(var j=0;j<ks.length;j++){if(ks[j].indexOf('muslim-cache')===0)await caches.delete(ks[j])}}catch(e){}
  location.reload();
};

/* ===== iOS / أمان: لمس نظيف، مناطق الأمان، فتح الروابط الخارجية بأمان (بلا user-select:none على أي حقل) ===== */
(function(){
  try{
    var st=document.createElement('style');st.id='v105-ios';
    st.textContent='html{-webkit-text-size-adjust:100%;text-size-adjust:100%}body{-webkit-tap-highlight-color:transparent}button,.tile,.back,.chip,[role=button]{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;touch-action:manipulation}input,textarea,select,[contenteditable]{-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default}@supports (-webkit-touch-callout:none){input,select,textarea{font-size:16px!important}}.top{padding-top:env(safe-area-inset-top,0px)!important;height:calc(72px + env(safe-area-inset-top,0px))!important}@media(max-width:680px){.top{height:calc(64px + env(safe-area-inset-top,0px))!important}}.app{padding-left:max(0px,env(safe-area-inset-left));padding-right:max(0px,env(safe-area-inset-right))}';
    document.head.appendChild(st);
  }catch(e){}
  var pend=false;
  function safeRel(){pend=false;try{document.querySelectorAll('a[target="_blank"]').forEach(function(a){var r=(a.getAttribute('rel')||'');if(!/noopener/.test(r))a.setAttribute('rel',(r+' noopener noreferrer').trim())})}catch(e){}}
  safeRel();
  try{new MutationObserver(function(){if(pend)return;pend=true;setTimeout(safeRel,400)}).observe(document.body,{childList:true,subtree:true})}catch(e){}
  var _wo=window.open;
  window.open=function(u,t,f){
    try{
      var abs=new URL(u,location.href);
      if(abs.origin!==location.origin&&(!t||t==='_blank')&&!/noopener/.test(f||'')){_wo.call(window,u,'_blank',((f?f+',':'')+'noopener,noreferrer'));return null}
    }catch(e){}
    return _wo.apply(window,arguments);
  };
})();

/* =====================================================================
   1) قرّاء archive.org (أحمد خضر / عبد الرحمن مسعد / حسام الدين عبادي …) — الآيفون وغيره
   ===================================================================== */
var IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
var SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
function unlockAudio(a){
  if(!a||a.__v105u)return;a.__v105u=1;
  try{if(!a.getAttribute('src')){a.src=SILENT;var p=a.play();if(p&&p.catch)p.catch(function(){a.__v105u=0})}}catch(e){a.__v105u=0}
}
var AR_META={};
function arItem(server){var m=/archive\.org\/download\/([^\/]+)\/?(.*)$/.exec(String(server||''));return m?{id:m[1],prefix:m[2]||''}:null}
function hostOf(u){var m=/^https?:\/\/([^\/]+)/.exec(String(u));return m?m[1]:String(u).slice(0,30)}
async function arMeta(id){
  if(AR_META[id])return AR_META[id];
  var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort()},7000);
  try{
    var r=await fetch('https://archive.org/metadata/'+encodeURIComponent(id),{signal:ctl.signal});
    if(!r.ok)throw new Error('meta '+r.status);
    var j=await r.json();
    var files=(j.files||[]).filter(function(f){return /\.mp3$/i.test(f.name||'')}).map(function(f){return f.name});
    var meta={files:files,d1:j.d1||j.server||'',dir:j.dir||''};
    if(files.length)AR_META[id]=meta;
    return meta;
  }finally{clearTimeout(tm)}
}
/* الرقم الذي يتغيّر بين الملفات هو رقم السورة؛ الأرقام الثابتة تُهمل */
function arPick(files,num){
  var T=files.map(function(f){return {f:f,t:(f.split('/').pop().replace(/\.mp3$/i,'').match(/\d+/g)||[]).map(Number)}}).filter(function(x){return x.t.length});
  if(T.length<2)return null;
  var maxLen=Math.max.apply(null,T.map(function(x){return x.t.length}));
  for(var k=1;k<=maxLen;k++){
    var part=T.filter(function(x){return x.t.length>=k});
    var vals=part.map(function(x){return x.t[x.t.length-k]});
    if(new Set(vals).size<2)continue;
    var hit=part.filter(function(x){return x.t[x.t.length-k]===num});
    if(hit.length)return hit[0].f;
  }
  return null;
}
/* روابط مرشّحة بالترتيب: على الآيفون الرابط المباشر لخادم الملف أولًا (بلا إعادة توجيه) ثم /download/ ثم التخمين */
async function arCandidates(server,num,guess){
  var it=arItem(server),meta=null;
  if(it){try{meta=await Promise.race([arMeta(it.id),new Promise(function(r){setTimeout(function(){r(null)},2500)})])}catch(e){}}
  var name=(meta&&meta.files&&meta.files.length)?arPick(meta.files,num):null;
  var enc=name?name.split('/').map(encodeURIComponent).join('/'):null;
  var dl=enc?('https://archive.org/download/'+encodeURIComponent(it.id)+'/'+enc):null;
  var direct=(enc&&meta.d1&&meta.dir)?('https://'+meta.d1+meta.dir+'/'+enc):null;
  var list=IOS?[direct,dl,guess]:[dl,direct,guess];
  var uniq=[];list.forEach(function(u){if(u&&uniq.indexOf(u)<0)uniq.push(u)});
  if(window.AUDIO_PROXY&&IOS)uniq=uniq.map(function(u){return window.AUDIO_PROXY+'?u='+encodeURIComponent(u)}).concat(uniq);
  return uniq;
}
var _or=window.openReader;
if(typeof _or==='function'){window.openReader=async function(){var r=await _or.apply(this,arguments);try{var rc=(typeof currentReader!=='undefined')?currentReader:null;if(rc&&rc.server&&/archive\.org\/download\//.test(rc.server)){var it=arItem(rc.server);if(it)arMeta(it.id).catch(function(){})}}catch(e){}return r}}
var _res=window.resolveAudioUrl;
if(typeof _res==='function'){
  window.resolveAudioUrl=async function(num){
    var guess=await _res.apply(this,arguments);
    var rc=(typeof currentReader!=='undefined')?currentReader:null;
    if(rc&&rc.server&&/archive\.org\/download\//.test(rc.server)){var c=await arCandidates(rc.server,num,guess);return c[0]||guess}
    return guess;
  };
}
var _efr=window.ensureAudioUrlForReader;
if(typeof _efr==='function'){
  window.ensureAudioUrlForReader=async function(reader,num){
    var u=await _efr.apply(this,arguments);
    if(reader&&reader.server&&/archive\.org\/download\//.test(reader.server)){
      var c=await arCandidates(reader.server,num,u),r2=c[0]||u;
      try{reader._resolvedUrls=reader._resolvedUrls||{};reader._resolvedUrls[num]=r2}catch(e){}
      return r2;
    }
    return u;
  };
}
function diagShow(lines){
  var now=$('now');if(!now)return;var d=$('v105Diag');
  if(!d){d=document.createElement('div');d.id='v105Diag';d.className='mini';d.style.cssText='margin-top:6px;direction:ltr;text-align:left;word-break:break-all;font-size:calc(11px*var(--v105-fs,1));opacity:.85';now.parentNode.insertBefore(d,now.nextSibling)}
  d.innerHTML=lines.map(esc).join('<br>');
}
function tryDirect(a,url){
  return new Promise(function(res,rej){
    var done=false,t;
    function cl(){a.removeEventListener('playing',ok);a.removeEventListener('error',er);clearTimeout(t)}
    function ok(){if(done)return;done=true;cl();res()}
    function bad(m){if(done)return;done=true;cl();rej(new Error(m))}
    function er(){bad('خطأ وسائط '+(a.error?a.error.code:'?')+(a.error&&a.error.message?' '+a.error.message:''))}
    a.addEventListener('playing',ok);a.addEventListener('error',er);t=setTimeout(function(){bad('انتهت المهلة')},9000);
    a.src=url;var p=a.play();if(p&&p.catch)p.catch(function(e){if(e&&e.name==='NotAllowedError')bad('NotAllowedError')});
  });
}
async function blobPlay(a,url,nowEl,nm,rc){
  var ctl=new AbortController(),tm=setTimeout(function(){ctl.abort()},90000);
  try{
    var r=await fetch(url,{signal:ctl.signal});
    if(!r.ok)throw new Error('HTTP '+r.status);
    var len=+r.headers.get('content-length')||0;
    if(len>150*1024*1024)throw new Error('الملف كبير');
    var chunks=[],got=0;
    if(r.body&&r.body.getReader){var rd=r.body.getReader();for(;;){var x=await rd.read();if(x.done)break;chunks.push(x.value);got+=x.value.length;if(nowEl)nowEl.textContent='⏳ تحميل '+nm+' '+(len?Math.round(got/len*100)+'%':Math.round(got/1048576)+' م.ب')}}
    else chunks.push(new Uint8Array(await r.arrayBuffer()));
    if(got===0&&!len&&!chunks.length)throw new Error('ملف فارغ');
    var blob=new Blob(chunks,{type:'audio/mpeg'});
    if(window._v105Blob){try{URL.revokeObjectURL(window._v105Blob)}catch(e){}}
    window._v105Blob=URL.createObjectURL(blob);
    a.src=window._v105Blob;
    await a.play();
  }finally{clearTimeout(tm)}
}
var _ps2=window.playSurah;
if(typeof _ps2==='function'){
  window.playSurah=async function(num){
    var a=(typeof audio!=='undefined'&&audio)||$('audio');
    if(IOS)unlockAudio(a);                       /* داخل لمسة المستخدم قبل أي await */
    var rc=(typeof currentReader!=='undefined')?currentReader:null;
    var isAr=!!(rc&&rc.server&&/archive\.org\/download\//.test(rc.server));
    if(!(isAr&&(IOS||window.__v105ForceBlob)))return _ps2.apply(this,arguments);
    try{var off=await getOfflineBlob(num);if(off)return _ps2.apply(this,arguments)}catch(e){}
    window.__v105Busy=1;
    var nowEl=(typeof now!=='undefined'&&now)||$('now'),nm=(typeof S!=='undefined'&&S[num-1])||('سورة '+num);
    try{currentSurah=num}catch(e){}
    var diag=['iOS: '+((navigator.userAgent.match(/OS [\d_]+/)||[''])[0])];
    try{
      if(nowEl)nowEl.textContent='⏳ جاري تجهيز '+nm;
      var guess=null;try{guess=await _res.call(window,num)}catch(e){diag.push('guess: '+(e.message||e))}
      var cands=await arCandidates(rc.server,num,guess);
      if(!cands.length){diag.push('لا روابط');throw new Error('no-urls')}
      var ok=false;
      for(var i=0;i<cands.length&&!ok;i++){
        try{await blobPlay(a,cands[i],nowEl,nm,rc);ok=true}catch(e){diag.push('تحميل '+hostOf(cands[i])+': '+(e&&e.name==='AbortError'?'انتهت المهلة':(e.message||e)))}
      }
      for(var j=0;j<cands.length&&!ok;j++){
        try{if(nowEl)nowEl.textContent='⏳ محاولة تشغيل مباشر…';await tryDirect(a,cands[j]);ok=true}catch(e){diag.push('تشغيل '+hostOf(cands[j])+': '+(e.message||e))}
      }
      if(!ok)throw new Error('failed');
      if(nowEl)nowEl.textContent='▶ '+nm;
      var at=(typeof audioTitle!=='undefined'&&audioTitle)||$('audioTitle');if(at)at.textContent='🎙️ '+((rc&&rc.name)||'القارئ')+' — '+nm;
      try{updateAudioUI();syncGlobalMiniPlayer()}catch(e){}
      try{saveSettings()}catch(e){}
      var d0=$('v105Diag');if(d0)d0.remove();
    }catch(e){
      if(nowEl)nowEl.textContent='❌ تعذر تشغيل '+nm+' لهذا القارئ على جهازك الآن. التفاصيل بالأسفل (أرسلها لي لأصلحها).';
      diagShow(diag);
    }finally{window.__v105Busy=0}
  };
}
/* عند فشل الملف على غير iOS: جرّب مرة واحدة تحميله كـ Blob */
(function(){
  var a=$('audio');if(!a||a.__v105)return;a.__v105=1;var tried={};
  a.addEventListener('error',async function(){
    try{
      if(window.__v105Busy||IOS)return;
      var rc=(typeof currentReader!=='undefined')?currentReader:null;
      if(!rc||!rc.server||!/archive\.org\/download\//.test(rc.server))return;
      var src=a.currentSrc||a.src;if(!src||/^blob:|^data:/.test(src)||tried[src])return;tried[src]=1;
      var now0=$('now');if(now0)now0.textContent='⏳ إعادة المحاولة بطريقة بديلة…';
      await blobPlay(a,src,now0,'',rc);
    }catch(e){var n=$('now');if(n)n.textContent='❌ تعذّر تشغيل هذا القارئ الآن (الخادم الخارجي archive.org لا يستجيب). جرّب لاحقًا.'}
  });
})();
/* الأحاديث والتسميع: صفحات «مغلقة مؤقتًا» */
var _show=window.show;
if(typeof _show==='function'){
  window.show=function(id){
    if(id==='hadith'||id==='hadithDetail'||id==='hadithCollection'||id==='hadithBooks')id='hadithOff';
    else if(/^tasmee/i.test(String(id)))id='tasmeeOff';
    var args=[].slice.call(arguments);args[0]=id;
    return _show.apply(this,args);
  };
}

/* =====================================================================
   4) لون النص (نهاري/ليلي) + خيار في الإعدادات
   ===================================================================== */
var TC_KEY='muslim-v105-textcolor',TC_EXTRA='.notice,.downloadPanel,.timeBadge,#settings h3,#khatmah b,#daily b,#manasik .calIn,#manasik .calHeroIn{color:var(--v105-t)!important}';
function tcGet(){try{var j=JSON.parse(localStorage.getItem(TC_KEY)||'null');if(j&&j.m)return j}catch(e){}return {m:'auto',l:'#000000',d:'#ffffff'}}
function tcSet(o){try{localStorage.setItem(TC_KEY,JSON.stringify(o))}catch(e){}}
function tcApply(){
  var o=tcGet(),L,D;
  if(o.m==='black'){L=D='#000000'}else if(o.m==='white'){L=D='#ffffff'}else if(o.m==='custom'){L=o.l||'#000000';D=o.d||'#ffffff'}else{L='#000000';D='#ffffff'}
  var st=document.getElementById('v105-tc');if(!st){st=document.createElement('style');st.id='v105-tc';document.head.appendChild(st)}
  st.textContent='body{--text:'+L+';--muted:'+L+';--v105-t:'+L+'}body.dark{--text:'+D+';--muted:'+D+';--v105-t:'+D+'}'+TC_EXTRA;
}
function tcUI(){
  var acc=$('stgAccent');if(!acc||$('v105TcRow'))return;
  var row=acc.closest('.stgRow');if(!row)return;
  var o=tcGet();
  var d=document.createElement('div');d.className='stgRow';d.id='v105TcRow';
  d.innerHTML='<div><b>لون النص</b><small>تلقائي: أسود في الوضع النهاري وأبيض في الليلي، أو اختر لونك</small></div><div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"><select id="v105TcMode" class="field stgSel"><option value="auto">تلقائي (أسود نهارًا / أبيض ليلًا)</option><option value="black">أسود دائمًا</option><option value="white">أبيض دائمًا</option><option value="custom">مخصّص…</option></select><span id="v105TcCustom" style="display:none">نهاري <input type="color" id="v105TcL"> ليلي <input type="color" id="v105TcD"></span></div>';
  row.insertAdjacentElement('afterend',d);
  var m=$('v105TcMode'),l=$('v105TcL'),dk=$('v105TcD'),c=$('v105TcCustom');
  m.value=o.m;l.value=o.l||'#000000';dk.value=o.d||'#ffffff';c.style.display=o.m==='custom'?'':'none';
  var sv=function(){var n={m:m.value,l:l.value,d:dk.value};c.style.display=n.m==='custom'?'':'none';tcSet(n);tcApply()};
  m.onchange=sv;l.oninput=sv;dk.oninput=sv;
}
tcApply();tcUI();
document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('[onclick*="settings"]'))setTimeout(tcUI,50)},true);


/* =====================================================================
   5) الأحمال الكبيرة: تخزين قائمة القرّاء محليًا + تخفيف طلبات Supabase + إشعار التحديث
   ===================================================================== */
(function(){
  var URL_R='https://www.mp3quran.net/api/v3/reciters?language=ar',DAY=864e5;
  window.getMp3QuranReciters=function(){
    if(window.__v105RecP)return window.__v105RecP;
    window.__v105RecP=(async function(){
      var c=null,cached=null;
      try{c=await caches.open('muslim-data-v1');cached=await c.match(URL_R)}catch(e){}
      var age=cached?(Date.now()-(+cached.headers.get('x-saved')||0)):1e15;
      var fresh=async function(){
        var r=await fetch(URL_R);if(!r.ok)throw new Error('reciters '+r.status);
        var txt=await r.text(),j=JSON.parse(txt);
        if(c&&j&&Array.isArray(j.reciters)&&j.reciters.length){try{await c.put(URL_R,new Response(txt,{status:200,headers:{'content-type':'application/json','x-saved':String(Date.now())}}))}catch(e){}}
        return j.reciters||[];
      };
      if(cached&&age<7*DAY){
        if(age>DAY)setTimeout(function(){fresh().catch(function(){})},2000+Math.random()*20000);   /* تحديث خلفي بتوزيع عشوائي */
        try{return (await cached.json()).reciters||[]}catch(e){}
      }
      try{return await fresh()}catch(e){
        if(cached){try{return (await cached.json()).reciters||[]}catch(e2){}}
        window.__v105RecP=null;throw e;
      }
    })();
    return window.__v105RecP;
  };
  function wrapSB(c){
    if(!c||c.__v105)return c;c.__v105=1;
    try{var ag=c.auth.getUser.bind(c.auth);c.auth.getUser=async function(){try{var r=await c.auth.getSession();return {data:{user:(r&&r.data&&r.data.session)?r.data.session.user:null},error:null}}catch(e){return ag()}}}catch(e){}
    var of=c.from.bind(c),last='',pend=null,timer=null,lastSent=0;
    function flush(){timer=null;if(!pend)return;var x=pend;pend=null;lastSent=Date.now();last=x.js;try{of('user_settings').upsert(x.p,x.o).then(function(){},function(){})}catch(e){}}
    function sched(){if(timer)return;var wait=Math.max(0,120000-(Date.now()-lastSent))+Math.random()*30000;timer=setTimeout(flush,wait)}
    c.from=function(t){
      var q=of(t);
      if(t==='user_settings'&&q&&q.upsert){
        q.upsert=function(p,o){var js;try{js=JSON.stringify(p,function(k,v){return k==='updated_at'?undefined:v})}catch(e){js=String(Math.random())}
          if(js===last||(pend&&pend.js===js))return Promise.resolve({data:null,error:null});
          pend={p:p,o:o,js:js};sched();return Promise.resolve({data:null,error:null})};
      }
      return q;
    };
    document.addEventListener('visibilitychange',function(){if(document.hidden&&pend&&Date.now()-lastSent>20000){if(timer){clearTimeout(timer);timer=null}flush()}});
    return c;
  }
  try{if(typeof supabaseClient!=='undefined'&&supabaseClient)wrapSB(supabaseClient)}catch(e){}
  try{if(window.supabase&&typeof window.supabase.createClient==='function'&&!window.supabase.__v105){var cc=window.supabase.createClient;window.supabase.createClient=function(){return wrapSB(cc.apply(this,arguments))};window.supabase.__v105=1}}catch(e){}
  /* إشعار «تحديث جديد» بدل إعادة التحميل القسرية */
  try{
    var hadCtl=!!(navigator.serviceWorker&&navigator.serviceWorker.controller);
    if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',function(e){
      if(!hadCtl||!e.data||e.data.t!=='updated'||window.__v105Upd)return;window.__v105Upd=1;
      var b=document.createElement('div');b.style.cssText='position:fixed;left:10px;right:10px;bottom:84px;z-index:99999;background:#1d624f;color:#fff;padding:10px 14px;border-radius:14px;display:flex;gap:10px;align-items:center;justify-content:space-between;font-size:calc(14px*var(--v105-fs,1))';
      b.innerHTML='<span>🔄 يتوفر تحديث جديد للتطبيق</span><button type="button" style="background:#fff;color:#1d624f;border:0;border-radius:10px;padding:6px 12px;font-weight:700">تحديث الآن</button>';
      b.querySelector('button').onclick=function(){location.reload()};document.body.appendChild(b);
    });
  }catch(e){}
})();

/* =====================================================================
   2) مساعد المسلم: فهم السؤال كاملًا (سورة + آيات + قارئ + عدد + نية) وتنفيذه
   ===================================================================== */
var AD='٠١٢٣٤٥٦٧٨٩';
function norm(s){
  return String(s||'').replace(/[٠-٩]/g,function(d){return AD.indexOf(d)})
   .replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
   .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g,' ').toLowerCase().replace(/\s+/g,' ').trim();
}
function nameNorm(s){return norm(String(s||'').replace('⭐','')).replace(/عبد ?ال?(?=\S)/g,'عبد')}
function bare(w){return w.replace(/^(وال|بال|لل|ال)(?=.{3,})/,'')}
function lev(a,b){
  if(a===b)return 0;if(Math.abs(a.length-b.length)>2)return 9;
  var m=[],i,j;for(i=0;i<=a.length;i++)m[i]=[i];for(j=1;j<=b.length;j++)m[0][j]=j;
  for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return m[a.length][b.length];
}
function tokEq(a,b){return a===b||(a.length>=5&&b.length>=5&&lev(a,b)<=1)}
var STOPRAW='هل لديكم عندكم يوجد توجد موجود موجوده اريد ابحث عن ابي ابغي ابغا ابغى اين اجد الشيخ شيخ القارئ قارئ قاري الى في ممكن لو سمحت التطبيق الموقع هذا هذه لكم ما هو هي سوره سورة بصوت صوت اسمع استمع اسمعني شغل كرر تكرار اعيد اكرر مره مرات مرة من اية ايه الايه الايات ايات حتى كم لي انا ان احمل حمل تحميل تنزيل كيف وين فين اعرف اعطني افتح لدي قسم بدون انترنت نت ثم مع على عند بعد قبل كل حفظ احفظ تلاوه تلاوة قراءه قراءة لما عايز ابغى اود احتاج ارجو فضلك بارك الله فيك لو سمحت يا';
var STOP=new Set(STOPRAW.split(' ').map(function(w){return bare(norm(w))}));
var STOP2=new Set(STOP);

var SEC=[
['readers','القراء والتلاوات','قارئ قراء تلاوه تلاوات استماع سماع مقرئ شيخ'],
['repeatAyah','تكرار الآية','تكرار كرر اكرر حفظ احفظ ترديد'],
['adhkar','الأذكار والأدعية','ذكر اذكار دعاء ادعيه صباح مساء نوم استيقاظ'],
['ruqyah','الرقية الشرعية','رقيه رقي'],
['khatmah','الختمة','ختمه ختم ورد'],
['qibla','القبلة','قبله كعبه اتجاه'],
['mosques','المساجد القريبة','مسجد مساجد مصلي مصليات جامع قريب'],
['children','عالم الأطفال','طفل اطفال صغار قصص مسابقات'],
['manasik','المناسك والتقويم','مناسك حج عمره تقويم هجري مناسبه'],
['daily','أعمال اليوم','اعمال طاعات'],
['modes','الأوضاع','اوضاع وضع نوم'],
['settings','الإعدادات','اعدادات ضبط حساب نسخ سحابه تسجيل'],
['downloads','تنزيلاتي','تنزيلات تحميلات محمل']
];
SEC.forEach(function(s){s[2].split(' ').forEach(function(w){STOP.add(bare(w))})});
var INIT={
 adhkar:function(){window.initAdhkarV27&&window.initAdhkarV27()},mosques:function(){window.initNearbyMosques&&window.initNearbyMosques()},
 repeatAyah:function(){window.initRepeatAyah&&window.initRepeatAyah()},khatmah:function(){window.renderKhatmah&&window.renderKhatmah()},
 ruqyah:function(){window.renderRuqyah&&window.renderRuqyah()},hadith:function(){window.loadHadith&&window.loadHadith()},
 children:function(){window.initChildren&&window.initChildren()},modes:function(){window.initModes&&window.initModes()},
 manasik:function(){window.initManasik&&window.initManasik()},daily:function(){window.renderDaily&&window.renderDaily()}
};
var PRE=[
 [/ايه الكرسي/,2,255,255,'آية الكرسي'],[/خواتيم (سوره )?(ال)?بقره/,2,285,286,'خواتيم البقرة'],
 [/اول (سوره )?(ال)?كهف/,18,1,10,'أول سورة الكهف'],[/اخر (سوره )?(ال)?كهف/,18,101,110,'آخر سورة الكهف']
];
var COUNTW={'مرتين':2,'ثلاث':3,'اربع':4,'خمس':5,'ست':6,'سبع':7,'ثمان':8,'ثماني':8,'ثمانيه':8,'تسع':9,'عشر':10,'عشرين':20,'ثلاثين':30,'خمسين':50,'ميه':100,'مايه':100,'مئه':100};
function surahNames(){return (typeof S!=='undefined'&&S)||[]}
function recList(){return (typeof RECITERS!=='undefined'&&RECITERS)||[]}

function findSurah(n){
  var names=surahNames(),q=' '+n+' ',best=null;
  names.forEach(function(nm,i){
    var a=norm(nm),b=a.replace(/^ال/,'');
    if(b.length<3){if(q.indexOf(' سوره '+b+' ')>=0&&(!best||b.length+6>best.len))best={num:i+1,len:b.length+6};return}
    [a,b,'ال'+b].some(function(v){
      if(q.indexOf(' '+v+' ')>=0){if(!best||v.length>best.len)best={num:i+1,len:v.length};return true}
      return false;
    });
  });
  return best;
}
function findCount(n){
  var m=n.match(/(\d{1,4}) (?:مره|مرات)/);if(m)return {c:+m[1],rest:n.replace(m[0],' ')};
  if(/(^| )مرتين( |$)/.test(n))return {c:2,rest:n.replace('مرتين',' ')};
  m=n.match(/(?:^| )(ثلاثين|ثلاث|اربع|خمسين|خمس|ست|سبع|ثمانيه|ثماني|ثمان|تسع|عشرين|عشر|مايه|ميه|مئه) (?:مره|مرات)/);
  if(m)return {c:COUNTW[m[1]],rest:n.replace(m[0],' ')};
  return {c:null,rest:n};
}
function findRange(n){
  var m=n.match(/(\d{1,3}) ?(?:الي|حتي|-) ?(?:ايه )?(\d{1,3})/);
  if(m)return {f:+m[1],t:+m[2]};
  m=n.match(/(?:ايه|الايه|ايات|الايات) (\d{1,3})/);
  if(m)return {f:+m[1],t:+m[1]};
  return null;
}
var df=null;
function buildDf(){
  df={};var seen={};
  recList().forEach(function(r){var k=nameNorm(r.name);if(seen[k])return;seen[k]=1;new Set(k.split(' ').map(bare).filter(Boolean)).forEach(function(t){df[t]=(df[t]||0)+1})});
}
function findReciters(n){
  var list=recList();if(!list.length)return [];
  if(!df)buildDf();
  var toks=nameNorm(n).split(' ').map(bare).filter(function(w){return w.length>=3&&!STOP.has(w)});
  if(!toks.length)return [];
  var byName={};
  list.forEach(function(r,i){
    var k=nameNorm(r.name),nt=k.split(' ').map(bare).filter(Boolean),s=0;
    toks.forEach(function(w){if(nt.some(function(x){return tokEq(x,w)}))s+=1/Math.max(1,(df[w]||df[nt.find(function(x){return tokEq(x,w)})]||1))});
    if(s>0){(byName[k]=byName[k]||[]).push({r:r,i:i,s:s})}
  });
  var all=[];Object.keys(byName).forEach(function(k){byName[k].forEach(function(x){all.push(x)})});
  if(!all.length)return [];
  var top=all.reduce(function(m,x){return Math.max(m,x.s)},0);
  if(top<0.3)return [];
  return all.filter(function(x){return x.s>=top-1e-9}).slice(0,8);
}
function scoreSections(n){
  var toks=n.split(' ').map(bare).filter(Boolean);
  return SEC.map(function(s){
    var kws=s[2].split(' '),sc=0;
    toks.forEach(function(w){if(kws.some(function(k){return tokEq(k,w)||tokEq(k,bare(w))}))sc++});
    return {id:s[0],name:s[1],sc:sc};
  }).filter(function(x){return x.sc>0}).sort(function(a,b){return b.sc-a.sc});
}
function understand(q){
  var n0=norm(q),u={q:q,n:n0,surah:null,range:null,count:null,preset:null,reciters:[],sections:[],intent:{}};
  var em=n0.match(/كل ايه (\d{1,2}) (?:مره|مرات)/),em2=n0.match(/كل ايه مرتين/),n1=n0;u.each=null;
  if(em){u.each=+em[1];n1=n0.replace(em[0],' ')}else if(em2){u.each=2;n1=n0.replace(em2[0],' ')}
  var cnt=findCount(n1);u.count=cnt.c;var n=cnt.rest;
  u.intent.repeat=/(^| )(كرر|اكرر|تكرار|اعيد|اردد|ترديد)/.test(n)||/(^| )(احفظ|حفظ)( |$)/.test(n);
  u.intent.listen=/(اسمع|استمع|سماع|شغل|تلاوه|اسمعني)/.test(n);
  u.intent.download=/(حمل|تحميل|تنزيل|نزل|اوفلاين|بدون (انترنت|نت))/.test(n);
  u.intent.ask=/(^| )(هل|اين|وين|فين|كيف)( |$)/.test(n);
  PRE.forEach(function(p){if(!u.preset&&p[0].test(n))u.preset={s:p[1],f:p[2],t:p[3],label:p[4]}});
  var sc=scoreSections(n);
  var cue=/(سوره|ايه|ايات|كرر|اكرر|تكرار|اسمع|استمع|تلاوه|شغل|حفظ|احفظ)/.test(n);
  var sf=findSurah(n);
  if(sf&&(cue||!sc.some(function(x){return x.id!=='readers'&&x.id!=='repeatAyah'})))u.surah=sf.num;
  if(u.preset)u.surah=u.preset.s;
  u.range=u.preset?{f:u.preset.f,t:u.preset.t}:findRange(n);
  var rr=findReciters(n);
  /* اسم القارئ قد يطابق اسم سورة (يونس، هود…): القارئ أولى ما لم يُذكر ما يدل على السورة */
  if(rr.length&&u.surah&&!u.preset&&!/(سوره|اسمع|استمع|شغل|كرر|اكرر|تكرار|بصوت|ايه|ايات)/.test(n)){
    var sn=bare(norm(surahNames()[u.surah-1]||'')),rn=nameNorm(rr[0].r.name).split(' ').map(bare);
    if(rn.indexOf(sn)>=0){u.surah=null;u.range=null}
  }
  /* لا تعدّ كلمات القسم (مسجد/ذكر…) اسم قارئ */
  u.reciters=rr;
  u.sections=sc;
  return u;
}

function recGroups(rs){var g={},order=[];rs.forEach(function(h){var k=nameNorm(h.r.name);if(!g[k]){g[k]={name:String(h.r.name).replace('⭐ ',''),items:[]};order.push(k)}g[k].items.push(h.r)});return order.map(function(k){return g[k]})}
function reciterProfile(rs,surah,yes){
  var gs=recGroups(rs),g=gs[0],rw=[];
  g.items.forEach(function(r){var w=String(r.rewaya||'').trim();if(w&&rw.indexOf(w)<0)rw.push(w)});
  var n=g.items.length;
  var h=(yes?'✅ نعم، ':'')+'🎙️ <b>'+esc(g.name)+'</b> قارئ'+(rw.length?' يقرأ '+(rw.length>1?'بعدة روايات: ':'برواية ')+'<b>'+rw.map(esc).join('، ')+'</b>':'')+'. ولدينا له '+(n>1?'<b>مجموعة تلاوات ('+n+' تسجيلات)</b>':'<b>تلاوة</b>')+' في قسم القرّاء'+(surah?'، وسأفتح لك <b>'+esc(surahLabel(surah))+'</b> بصوته:':' — اختر ما تريد:');
  var bs=g.items.slice(0,6).map(function(r){
    var cnt=(r.surahList&&r.surahList.length)?' ('+r.surahList.length+' سورة)':'';
    return btn((surah?'▶ ':'🎧 ')+(String(r.rewaya||'التلاوة'))+cnt,{t:'reciter',id:r.id,nm:String(r.name).replace('⭐ ',''),s:surah||0});
  }).join('');
  var more='';
  if(gs.length>1)more='<div class="mini">قرّاء آخرون بأسماء قريبة:</div><div>'+gs.slice(1,5).map(function(x){return btn('🎧 '+x.name,{t:'reciter',id:x.items[0].id,nm:x.name,s:0})}).join('')+'</div>';
  return h+'<div>'+bs+'</div>'+more;
}
function surahInfo(num){
  var ay=(window.V100_REC&&window.V100_REC.AY&&window.V100_REC.AY[num-1])||null;
  return '📖 <b>'+esc(surahLabel(num))+'</b> — رقمها <b>'+num+'</b> في المصحف'+(ay?' وعدد آياتها <b>'+ay+'</b>':'')+'. يمكنك الاستماع إليها بأصوات قرّاء كثيرين أو تكرار آياتها للحفظ:<div>'+btn('🎧 افتح القرّاء',{t:'section',id:'readers'})+btn('🔁 كرّر آياتها',{t:'repeat',s:num,f:1,to:0,c:0,e:0,nm:'',go:0})+'</div>';
}
var WHO=/^(من هو|من هي|من يكون|من هذا|عرفني ب|عرفني علي|نبذه عن|معلومات عن|ماذا تعرف عن|هل تعرف|وش تعرف عن|ما هي|ما هو|ماذا تعني|ما معني|ما هيا) (.+)$/;
function whoIs(n){
  var m=WHO.exec(n);if(!m)return null;
  var sub=m[2].replace(/^(القارئ|قارئ|الشيخ|شيخ|الاستاذ|الدكتور|الامام|الحاج|السيد|سوره) /,'').trim();
  if(sub.length<3)return null;
  var rr=findReciters(sub);
  if(rr.length)return reciterProfile(rr,0,false);
  var sf=findSurah(' '+sub+' ');if(sf&&/(سوره|ما هي|ما هو)/.test(n))return surahInfo(sf.num);
  return null;
}
function externalReply(sub){
  return 'عذرًا، لم أجد «'+esc(String(sub).slice(0,60))+'» داخل التطبيق — هو خارج محتواه (قرّاء، تلاوات، أذكار، رقية…) ولا أريد أن أخمّن معلومة عنه. هذا مصدر قد تجد فيه الجواب:<div>'+urlBtn('ويكيبيديا',"https://ar.wikipedia.org/wiki/Special:Search?search="+encodeURIComponent(sub))+urlBtn('بحث Google','https://www.google.com/search?q='+encodeURIComponent(sub))+'</div>';
}
function appIndex(){
  var idx=[];
  document.querySelectorAll('#home .tile').forEach(function(t){var b=t.querySelector('b'),sm=t.querySelector('small');if(b)idx.push({title:b.textContent.trim(),text:sm?sm.textContent:'',kw:'',act:{t:'tile',k:b.textContent.trim()}})});
  document.querySelectorAll('#settings .stgRow').forEach(function(r){var b=r.querySelector('b'),sm=r.querySelector('small');if(b)idx.push({title:b.textContent.trim(),text:sm?sm.textContent:'',kw:'اعدادات',act:{t:'setting',k:b.textContent.trim()},ico:'⚙️ '})});
  var extra=[['الأوضاع','نوم صباح مساء سفر جمعة بقره استغفار تحصين منزل مسجد رقيه تشغيل متتالي مؤقت','modes'],['تكرار الآية','حفظ ترديد كرر تكرار اية سوره','repeatAyah'],['الأذكار والأدعية','اذكار دعاء صباح مساء نوم استيقاظ بعد الصلاه سفر استغفار','adhkar'],['الرقية الشرعية','رقيه رقي علاج عين حسد','ruqyah'],['التنزيلات','تنزيلاتي تحميلات محمله بدون انترنت اوفلاين','downloads'],['الختمة','ختمه ورد يومي قراءه','khatmah']];
  extra.forEach(function(x){idx.push({title:x[0],text:'',kw:x[1],act:{t:'section',id:x[2]}})});
  return idx;
}
function appSearch(n){
  var toks=n.split(' ').map(bare).filter(function(w){return w.length>=3&&!STOP2.has(w)});
  if(!toks.length)return null;
  var res=appIndex().map(function(e){
    var tt=nameNorm(e.title).split(' ').map(bare),bt=nameNorm(e.text+' '+e.kw).split(' ').map(bare),sc=0;
    toks.forEach(function(w){if(tt.some(function(x){return tokEq(x,w)}))sc+=2;else if(bt.some(function(x){return tokEq(x,w)}))sc+=1});
    return {e:e,sc:sc};
  }).filter(function(x){return x.sc>=2}).sort(function(a,b){return b.sc-a.sc}).slice(0,3);
  if(!res.length)return null;
  return 'وجدت هذا في التطبيق قد يكون ما تقصده:<div>'+res.map(function(x){return btn((x.e.ico||'')+x.e.title,x.e.act)}).join('')+'</div>';
}
var surahLabel=function(num){return 'سورة '+(surahNames()[num-1]||num)};
function btn(label,act){return '<button type="button" class="v103Go" data-v105="'+esc(JSON.stringify(act))+'">'+esc(label)+'</button>'}
function recButtons(rs,surah,play){
  var seen={},out=[];
  rs.forEach(function(h){
    var id=h.r.id||('i'+h.i);if(seen[id])return;seen[id]=1;
    var nm=String(h.r.name).replace('⭐ ','')+(h.r.rewaya?' — '+h.r.rewaya:'');
    out.push(btn((play&&surah?'▶ ':'🎧 ')+nm,{t:'reciter',id:h.r.id,nm:String(h.r.name).replace('⭐ ',''),s:play?surah:0}));
  });
  return '<div>'+out.slice(0,6).join('')+'</div>';
}
function reply(u){
  var parts=[],hasRec=u.reciters.length>0;
  var recName=hasRec?String(u.reciters[0].r.name).replace('⭐ ',''):'';
  var secScore=u.sections[0]?u.sections[0].sc:0;
  /* قارئ مطابق فقط إذا لم تكن الكلمات المطابقة مجرد كلمات قسم */
  if(hasRec&&u.sections.length&&secScore>=1&&!u.surah&&!u.intent.listen&&!u.intent.repeat&&u.reciters[0].s<0.5)hasRec=false;
  if(u.surah&&(u.intent.repeat||u.preset||u.range)&&u.intent.repeat!==false&&(u.intent.repeat||u.range||u.preset)){
    var tgt=u.preset?u.preset.label:surahLabel(u.surah)+(u.range?(u.range.f===u.range.t?' الآية '+u.range.f:' الآيات '+u.range.f+' إلى '+u.range.t):'');
    var cc='سأكررها بلا توقف حتى تضغط «إيقاف»'+(u.count?' (التكرار في التطبيق مفتوح دائمًا، فلن يتوقف عند '+u.count+' مرة)':'')+(u.each?'، وكل آية '+u.each+' مرات قبل الانتقال للتي بعدها':'');
    var say='فهمت أنك تريد <b>تكرار '+esc(tgt)+'</b>'+(hasRec?' بصوت <b>'+esc(recName)+'</b>':'')+' — '+cc+'.';
    var act={t:'repeat',s:u.surah,f:u.range?u.range.f:1,to:u.range?u.range.t:0,c:0,e:u.each||0,nm:hasRec?recName:'',go:1};
    parts.push(say+'<div>'+btn('▶ ابدأ التكرار الآن',act)+btn('⚙️ عدّل الإعدادات أولًا',Object.assign({},act,{go:0}))+'</div>'
      +(hasRec?'<div class="mini">إن لم يكن القارئ ضمن قرّاء «تكرار الآية» سأستخدم القارئ المحدد حاليًا وأخبرك.</div>':''));
    return parts.join('<hr class="v103hr">');
  }
  if(hasRec){
    var rs=u.reciters,names=[];var seenN={};rs.forEach(function(h){var k=nameNorm(h.r.name);if(!seenN[k]){seenN[k]=1;names.push(h)}});
    parts.push(reciterProfile(rs,u.surah,u.intent.ask));
    if(u.surah)parts.push('<div class="mini">'+btn('🔁 كرّر آيات '+surahLabel(u.surah),{t:'repeat',s:u.surah,f:1,to:0,c:0,nm:recName,go:0})+'</div>');
  }else if(u.surah){
    parts.push('🎧 <b>'+esc(surahLabel(u.surah))+'</b> موجودة بأصوات قرّاء كثيرين:<div>'+btn('🎧 افتح القرّاء',{t:'section',id:'readers'})+btn('🔁 كرّر آياتها',{t:'repeat',s:u.surah,f:1,to:0,c:u.count||0,nm:'',go:0})+'</div>');
  }
  if(!hasRec&&!u.surah&&u.sections.length){
    var top=u.sections.slice(0,2);
    parts.push('ستجد ذلك في '+(top.length>1?'هذه الأقسام':'قسم')+':<div>'+top.map(function(s){return btn('افتح «'+s.name+'»',{t:'section',id:s.id})}).join('')+'</div>');
  }else if(u.sections.length&&(hasRec||u.surah)&&u.sections[0].id!=='readers'&&u.sections[0].id!=='repeatAyah'){
    parts.push('<div class="mini">وإن كنت تقصد قسمًا آخر:</div><div>'+btn('افتح «'+u.sections[0].name+'»',{t:'section',id:u.sections[0].id})+'</div>');
  }
  if(u.intent.download&&(hasRec||u.surah))parts.push('<div class="mini">للتحميل وسماعه بلا إنترنت: افتح القارئ واختر السورة، وتجد كل ما حمّلته في «تنزيلاتي».</div><div>'+btn('📥 تنزيلاتي',{t:'section',id:'downloads'})+'</div>');
  return parts.length?parts.join('<hr class="v103hr">'):null;
}

/* ----- تنفيذ الأزرار ----- */
function recIndex(a){
  var L=recList();var i=-1;
  if(a.id)i=L.findIndex(function(r){return r.id===a.id});
  if(i<0&&a.nm){var k=nameNorm(a.nm);i=L.findIndex(function(r){return nameNorm(r.name)===k})}
  return i;
}
var URL_OK=/^https:\/\/([a-z0-9-]+\.)*(quran\.ksu\.edu\.sa|quran\.com|qurancomplex\.gov\.sa|dorar\.net|sunnah\.com|islamweb\.net|binbaz\.org\.sa|aladhan\.com|islamicfinder\.org|tarteel\.ai|islamstory\.com|wikipedia\.org|google\.com)(\/|$)/;
async function runAct(a){
  if(a.t==='fn'){if(a.f==='report')window.v105Report();else if(a.f==='reload')window.v105Reload();else if(a.f==='diag')location.href='diag.html';return}
  if(a.t==='tile'){var ts=[].slice.call(document.querySelectorAll('#home .tile')).filter(function(t){var b=t.querySelector('b');return b&&b.textContent.trim()===a.k})[0];if(ts)ts.click();return}
  if(a.t==='setting'){if(typeof show==='function')show('settings');setTimeout(function(){var rw=[].slice.call(document.querySelectorAll('#settings .stgRow')).filter(function(r){var b=r.querySelector('b');return b&&b.textContent.trim()===a.k})[0];if(rw){rw.scrollIntoView({behavior:'smooth',block:'center'});rw.classList.add('v105flash');setTimeout(function(){rw.classList.remove('v105flash')},2500)}},200);return}
  if(a.t==='url'){if(URL_OK.test(String(a.u||'')))window.open(a.u,'_blank','noopener');return}
  if(a.t==='section'){if(typeof show==='function')show(a.id);try{INIT[a.id]&&INIT[a.id]()}catch(e){console.warn(e)}return}
  if(a.t==='reciter'){
    var i=recIndex(a);if(i<0){show('readers');return}
    await window.openReader(i);
    if(a.s&&typeof window.playSurah==='function')window.playSurah(a.s);
    return;
  }
  if(a.t==='repeat'){
    show('repeatAyah');try{window.initRepeatAyah()}catch(e){}
    var s=$('repeatSurah');if(s)s.value=String(a.s);
    try{window.updateRepeatTo()}catch(e){}
    var f=$('repeatFrom'),t=$('repeatTo');
    if(f&&t){
      var max=+t.max||286,from=Math.max(1,Math.min(a.f||1,max)),to=a.to?Math.min(a.to,max):max;
      if(to-from+1>60)to=from+59;
      f.value=String(from);t.value=String(Math.max(from,to));
      try{window.updateRepeatTo()}catch(e){}
    }
    if(a.e){var ee=$('repeatEach');if(ee){var bv=null;Array.prototype.forEach.call(ee.options,function(o){if(+o.value<=a.e)bv=o.value});if(bv)ee.value=bv}}
    var note='';
    if(a.nm){
      var rs=$('repeatReciter');
      if(rs){
        var want=nameNorm(a.nm),opts=Array.prototype.slice.call(rs.options);
        var o=opts.find(function(x){return nameNorm(x.textContent)===want})||opts.find(function(x){var t2=nameNorm(x.textContent);return want.split(' ').some(function(w){return w.length>3&&t2.indexOf(w)>=0})});
        if(o)rs.value=o.value;else note='القارئ «'+a.nm+'» غير متاح في تكرار الآية؛ سأستخدم «'+(rs.options[rs.selectedIndex]||{}).textContent+'». ';
      }
    }
    var stt=$('repeatAyahStatus');if(stt&&note)stt.textContent=note;
    if(a.go&&typeof window.startAyahRepeat==='function'){await window.startAyahRepeat();if(stt&&note&&!/🔁/.test(stt.textContent))stt.textContent=note+stt.textContent}
  }
}
document.addEventListener('click',function(e){
  var b=e.target&&e.target.closest&&e.target.closest('[data-v105]');if(!b)return;
  var a;try{a=JSON.parse(b.getAttribute('data-v105'))}catch(x){return}
  runAct(a).catch(function(err){console.error('v105 action',err)});
});

/* ----- (اختياري) فهم حقيقي بنموذج ذكاء اصطناعي عبر Supabase Edge Function ----- */
async function askLLM(q){
  var sb=null;try{sb=(typeof supabaseClient!=='undefined')?supabaseClient:null}catch(e){}
  if(!sb||!sb.functions||!sb.functions.invoke)return null;
  var names=[],seen={};recList().forEach(function(r){var k=nameNorm(r.name);if(!seen[k]){seen[k]=1;names.push(String(r.name).replace('⭐ ',''))}});
  try{
    var res=await Promise.race([sb.functions.invoke('muslim-assistant',{body:{question:q,sections:SEC.map(function(s){return {id:s[0],name:s[1]}}),reciters:names.slice(0,160)}}),new Promise(function(_,rej){setTimeout(function(){rej(new Error('timeout'))},9000)})]);
    if(!res||res.error||!res.data||typeof res.data.answer!=='string')return null;
    return res.data;
  }catch(e){return null}
}
function renderLLM(d){
  var h='<div>'+esc(d.answer).replace(/\n/g,'<br>')+'</div>',bs=[];
  (d.actions||[]).slice(0,4).forEach(function(a){
    if(!a||typeof a!=='object')return;
    var label=String(a.label||'').slice(0,40);
    if(a.type==='section'&&SEC.some(function(s){return s[0]===a.id}))bs.push(btn(label||'افتح',{t:'section',id:a.id}));
    else if(a.type==='reciter'&&a.name){var rr=findReciters(String(a.name));if(rr.length){bs.push(btn(label||('🎧 '+a.name),{t:'reciter',id:rr[0].r.id,nm:String(rr[0].r.name).replace('⭐ ',''),s:Math.max(0,Math.min(114,+a.surah||0))}))}}
    else if(a.type==='url'&&URL_OK.test(String(a.url||'')))bs.push(btn(label||'🔗 فتح المصدر',{t:'url',u:a.url}));
    else if(a.type==='repeat'){var s=+a.surah;if(s>=1&&s<=114)bs.push(btn(label||'🔁 تكرار',{t:'repeat',s:s,f:Math.max(1,+a.from||1),to:Math.max(0,+a.to||0),c:Math.max(0,Math.min(1000,+a.count||0)),nm:a.reciter?String(a.reciter):'',go:0}))}
  });
  return h+(bs.length?'<div>'+bs.join('')+'</div>':'');
}

/* ---------- طبقة المحادثة والمصادر الخارجية ---------- */
function urlBtn(label,u){return btn('🔗 '+label,{t:'url',u:u})}
function secBtns(ids){return '<div>'+ids.map(function(id){var s=SEC.filter(function(x){return x[0]===id})[0];return s?btn(s[1],{t:'section',id:id}):''}).join('')+'</div>'}
var MAIN=['readers','repeatAyah','adhkar','ruqyah','modes','qibla','mosques','khatmah'];
function nowReply(){
  var d=new Date(),t='',g='',h='';
  try{t=d.toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'});g=d.toLocaleDateString('ar',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}catch(e){t=String(d)}
  try{h=new Intl.DateTimeFormat('ar-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(d)}catch(e){}
  return '🕐 الساعة الآن <b>'+esc(t)+'</b> بحسب ساعة جهازك.<br>📅 '+esc(g)+(h?'<br>🌙 الموافق تقريبًا: '+esc(h)+' <span class="mini">(حساب فلكي؛ قد يختلف يومًا عن رؤية الهلال)</span>':'')+secBtns(['manasik']);
}
function chat(n,q){
  var short=n.length<60;
  if(short&&/^(السلام عليكم|سلام عليكم|سلام|مرحبا|اهلا|هلا|صباح الخير|مساء الخير|هاي|هلو|السلام)( |$)/.test(n))
    return 'وعليكم السلام ورحمة الله وبركاته 🌿 أنا مساعد المسلم. كيف أخدمك اليوم؟'+secBtns(MAIN.slice(0,6));
  if(/(من انت|منو انت|مين انت|انت مين|انت من|ما انت|ما اسمك|اسمك ايه|شنو اسمك|عرفني بنفسك|عرف بنفسك|وش انت|ايش انت)/.test(n))
    return 'أنا <b>«مساعد المسلم»</b>، المساعد الموجود داخل تطبيق المسلم. أفهم طلبك وأوصلك إلى ما تريد: القرّاء والتلاوات، تكرار الآيات، الأذكار والأدعية، الرقية، الأوضاع، القبلة، المساجد القريبة، والختمة — وأُشغّلها لك بزر واحد. لا أُفتي في الأحكام الشرعية.'+secBtns(MAIN.slice(0,6));
  if(/(هل انت (انسان|بشر|روبوت|بوت|ذكاء)|انت (انسان|روبوت|بشر|بوت))/.test(n))
    return 'أنا برنامج آلي داخل التطبيق، لست إنسانًا. أفهم الأسئلة المتعلقة بالتطبيق وأوجّهك أو أُشغّل لك ما تطلب، وإن لم يكن عندي الجواب أعتذر وأدلّك على مصدر مناسب.';
  if(/(ماذا تفعل|ماذا تستطيع|ايش تقدر|شنو تقدر|ماذا يمكنك|وش تسوي|كيف تساعدني|كيف استخدمك|ماذا عندك|ماذا تعرف|^مساعده$|^help$)/.test(n))
    return 'يمكنني مثلًا:<br>• تشغيل سورة بصوت قارئ معيّن: «اسمع الكهف بصوت السديس»<br>• تكرار آيات بلا توقف: «كرر آية الكرسي»<br>• فتح الأذكار والرقية والأوضاع والقبلة والمساجد القريبة<br>• إخبارك بالوقت والتاريخ الهجري<br>وإن لم أجد ما تطلب أعتذر وأدلّك على مصدره.'+secBtns(MAIN);
  if(short&&/(كيف حالك|كيفك|شلونك|اخبارك|عامل ايه|شخبارك|كيف الحال)/.test(n))
    return 'الحمد لله، أنا بخير، شكرًا لسؤالك 🌿 وأنت كيف حالك؟ تفضّل بطلبك.';
  if(short&&/(شكرا|جزاك الله|بارك الله فيك|بارك الله|يعطيك العافيه|الله يعطيك|ممنون|تسلم)/.test(n))
    return 'وإياك، جزاك الله خيرًا وبارك فيك 🌿 أنا في خدمتك متى شئت.';
  if(short&&/(مع السلامه|في امان الله|وداعا|الي اللقاء|تصبح علي خير)/.test(n))
    return 'في أمان الله وحفظه 🌿 لا تنسَ أذكار اليوم.'+secBtns(['adhkar']);
  if(/(من صنعك|من صمم|من طورك|من برمجك|من صاحب (التطبيق|الموقع)|من مطور|من انشا|من صانع|من يملك)/.test(n))
    return 'عذرًا، لا توجد لديّ معلومات مؤكدة عن صاحب التطبيق أو مطوّره، فلا أريد أن أخمّن. يمكنك سؤال من شاركك رابط التطبيق، أو تفقّد صفحة الإعدادات إن وُجدت فيها وسيلة تواصل.'+secBtns(['settings']);
  if(/(ما هو (التطبيق|الموقع|المسلم)|ما هذا (التطبيق|الموقع)|عن (التطبيق|الموقع)|ما فائده (التطبيق|الموقع)|ماذا في (التطبيق|الموقع))/.test(n))
    return 'تطبيق «المسلم» يجمع: قرّاء وتلاوات بأصوات كثيرة، تكرار الآيات للحفظ، الأذكار والأدعية بتسجيلات بشرية، الرقية الشرعية، أوضاع تشغيل متتالية (نوم/صباح/مساء…)، ختمة القرآن، القبلة، المساجد القريبة، التقويم الهجري، وعالم الأطفال. ويعمل جزء كبير منه بلا إنترنت بعد التحميل.'+secBtns(MAIN);
  if(/(كم الساعه|الساعه كم|ما الوقت|الوقت الان|كم الوقت|ما التاريخ|تاريخ اليوم|اي يوم|ما هو اليوم|التاريخ الهجري|كم التاريخ|اليوم كم)/.test(n))return nowReply();
  return null;
}
var OUT=[
 {re:/(مصحف|اقرا (لي )?(ايه|سوره|القران)|اريد اقرا|ابغي اقرا|صفحه (رقم )?\d+|نص (الايه|السوره))/,not:/(اسمع|استمع|كرر|شغل|تلاوه|صوت)/,topic:'المصحف المكتوب',off:'ميزة المصحف مغلقة مؤقتًا في التطبيق وسنعيدها قريبًا بإذن الله.',inapp:['readers','repeatAyah','khatmah'],src:[['القرآن الكريم — quran.com','https://quran.com/ar'],['مجمع الملك فهد لطباعة المصحف','https://qurancomplex.gov.sa/']]},
 {re:/(حديث|احاديث|صحيح البخاري|صحيح مسلم|رياض الصالحين|سند الحديث|درجه الحديث)/,topic:'الأحاديث',off:'قسم الأحاديث غير متاح حاليًا في التطبيق وسيتوفر لاحقًا بإذن الله.',inapp:['adhkar'],src:[['الدرر السنية (الأحاديث وتخريجها)','https://dorar.net/hadith'],['Sunnah.com','https://sunnah.com/']]},
 {re:/(تسميع|سمع لي|اسمع لي حفظي|اختبر حفظي|راجع حفظي)/,topic:'تسميع القرآن',off:'ميزة تسميع القرآن غير متاحة الآن.',inapp:['repeatAyah'],src:[['Tarteel — مراجعة الحفظ','https://tarteel.ai/']],extra:'ويساعدك «تكرار الآية» على تثبيت الحفظ بالترديد خلف القارئ.'},
 {re:/(مواقيت|اوقات الصلاه|وقت (الفجر|الظهر|العصر|المغرب|العشاء)|متي (اذان|الفجر|الظهر|العصر|المغرب|العشاء)|موعد الاذان|الاذان)/,topic:'مواقيت الصلاة',inapp:['qibla','mosques'],src:[['مواقيت الصلاة — AlAdhan','https://aladhan.com/prayer-times'],['IslamicFinder','https://www.islamicfinder.org/']]},
 {re:/(تفسير|معني (ايه|الايه|كلمه)|اسباب نزول|اعراب)/,topic:'التفسير ومعاني الآيات',inapp:['readers'],src:[['التفسير — جامعة الملك سعود','https://quran.ksu.edu.sa/'],['إسلام ويب','https://www.islamweb.net/ar/']]},
 {re:/(سيره (النبي|الرسول)|السيره النبويه|غزوه|فتح مكه|تاريخ (الاسلام|اسلامي)|الصحابه|الخلفاء الراشدين)/,topic:'السيرة والتاريخ الإسلامي',inapp:['children'],src:[['قصة الإسلام','https://islamstory.com/']],extra:'وفي «عالم الأطفال» قصص الأنبياء.'},
 {re:/(سبحه|مسبحه|عداد تسبيح)/,topic:'السبحة',inapp:['adhkar'],src:[],extra:'في الأذكار عدّاد لكل ذكر: اضغط عند القراءة فيُحسب لك العدد.'}
];
function outReply(n){
  for(var i=0;i<OUT.length;i++){
    var o=OUT[i];
    if(!o.re.test(n)||(o.not&&o.not.test(n)))continue;
    var h=(o.off?'⏳ '+esc(o.off):'عذرًا، لم أجد «'+esc(o.topic)+'» داخل التطبيق.');
    if(o.extra)h+=' '+esc(o.extra);
    if(o.src.length)h+='<br>المصدر الذي ستجده فيه:<div>'+o.src.map(function(x){return urlBtn(x[0],x[1])}).join('')+'</div>';
    if(o.inapp&&o.inapp.length)h+='<div class="mini">المتاح داخل التطبيق:</div>'+secBtns(o.inapp);
    return h;
  }
  return null;
}
var FIQH=/(ما حكم|حكم |يجوز|لا يجوز|هل يجوز|حلال|حرام|فتوي|فتوى|افتني|يبطل|تبطل|كفاره|هل يصح|هل تصح|مباح|مكروه|يفطر|مفطر|نجس|طهاره|طلاق|ربا|زكاه|ميراث|نصاب|مذهب|شرعا)/;
function fiqhReply(){
  return 'هذا سؤال في الحكم الشرعي، ولا أستطيع الإفتاء فيه حتى لا أُخطئ في دين الله. الأولى أن تسأل عالمًا أو جهة إفتاء موثوقة، وهذه مصادر تجد فيها الفتاوى:<div>'+urlBtn('الفتاوى — إسلام ويب','https://www.islamweb.net/ar/fatwa/')+urlBtn('الشيخ ابن باز','https://binbaz.org.sa/')+'</div>';
}
function unknownReply(q){
  var g='https://www.google.com/search?q='+encodeURIComponent(q);
  return 'عذرًا، لم أجد ما يخصّ «'+esc(String(q).slice(0,80))+'» داخل التطبيق، ولا أريد أن أخمّن جوابًا. جرّب أن تذكر السورة أو القارئ أو القسم الذي تقصده، أو اختر من هنا:'+secBtns(MAIN)+'<div class="mini">وإن كان سؤالك عامًا فيمكنك البحث عنه:</div><div>'+urlBtn('ابحث في الإنترنت',g)+'</div>';
}
window.v105Ask=async function(q,legacy){
  var n=norm(q);
  var d=await askLLM(q);if(d)return renderLLM(d);
  var c=chat(n,q);if(c)return c;
  if(FIQH.test(n))return fiqhReply();
  var o=outReply(n);if(o)return o;
  var w=whoIs(n);if(w)return w;
  var u=understand(q),r=reply(u);
  if(r)return r;
  var as=appSearch(n);if(as)return as;
  var mw=WHO.exec(n);if(mw)return externalReply(mw[2]);
  if(typeof legacy==='function'){var l;try{l=legacy(q)}catch(e){l=null}if(l&&!/لم أجد «/.test(String(l)))return l}
  return unknownReply(q);
};
/* الأحاديث: مؤجّلة — لا تُفتح أي صفحة محتوى */
window.loadHadith=window.initHadith=window.openHadithCollection=function(){};
window.__v105={chat:chat,outReply:outReply,unknownReply:unknownReply,understand:understand,reply:reply,findReciters:findReciters,findSurah:findSurah,arPick:arPick,norm:norm};
})();

(function(){
'use strict';
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var LSget=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
var LSset=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
var AD='٠١٢٣٤٥٦٧٨٩';
function norm(s){return String(s||'').replace(/[٠-٩]/g,function(d){return AD.indexOf(d)}).replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g,' ').toLowerCase().replace(/\s+/g,' ').trim()}
function nf(n,d){try{return Number(n).toLocaleString('ar',{minimumFractionDigits:d||0,maximumFractionDigits:d==null?0:d})}catch(e){return String(n)}}

/* ===================== حجم الخط: ٧٠٪ – ٣٠٠٪ (يكبّر الخطوط فقط، بلا zoom حتى لا يتأثر الكيبورد على iOS) ===================== */
var FS_KEY='quran-m09-font-scale',FS_MIN=0.7,FS_MAX=3;
function fsGet(){var v=parseFloat(LSget(FS_KEY,'1'));return isFinite(v)?Math.min(FS_MAX,Math.max(FS_MIN,v)):1}
var fsCss=document.createElement('style');fsCss.id='v105-fs';fsCss.textContent='.v105FsPrev{padding:10px;border-radius:12px;background:var(--card,#fff);border:1px dashed rgba(127,127,127,.4);margin-top:8px;text-align:center;overflow:hidden}.v105FsBtns{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:8px}.v105FsBtns button{padding:6px 10px;border-radius:10px}';document.head.appendChild(fsCss);
function fsApply(v){
  v=Math.round(Math.min(FS_MAX,Math.max(FS_MIN,v))*100)/100;
  var h=document.documentElement;h.style.setProperty('--font-scale','1');h.style.setProperty('--v105-fs',String(v));h.style.removeProperty('--v105-zoom');LSset(FS_KEY,String(v));fsUI();return v;
}
window.setFontScale=function(v){fsApply(+v||1)};
function fsUI(){
  var v=fsGet(),r=$('v105FsRange');if(!r)return;
  r.value=String(Math.round(v*100));$('v105FsVal').textContent=nf(Math.round(v*100))+'٪';
  var pv=$('v105FsPrev');if(pv)pv.style.fontSize=(16*v)+'px';
}
function fsMount(){
  var row=[].slice.call(document.querySelectorAll('#settings .stgRow')).filter(function(r){return /حجم الخط/.test(r.textContent)})[0];
  if(!row||row.__v105)return;row.__v105=1;
  row.style.flexWrap='wrap';
  var seg=row.querySelector('.stgSeg');if(seg)seg.remove();
  var d=document.createElement('div');d.style.cssText='width:100%;margin-top:6px';
  d.innerHTML='<div style="display:flex;align-items:center;gap:8px"><button type="button" id="v105FsMinus" class="stgBtn" aria-label="تصغير">A−</button><input type="range" id="v105FsRange" min="70" max="300" step="5" style="flex:1"><button type="button" id="v105FsPlus" class="stgBtn" aria-label="تكبير">A+</button></div>'
   +'<div style="text-align:center;margin-top:4px"><b id="v105FsVal"></b> <span class="mini">(الافتراضي ١٠٠٪)</span></div>'
   +'<div class="v105FsBtns">'+[[80,'صغير جدًا'],[90,'صغير'],[100,'عادي'],[115,'متوسط+'],[130,'كبير'],[150,'كبير جدًا'],[175,'ضخم'],[200,'ضخم جدًا'],[250,'عملاق'],[300,'الأقصى']].map(function(x){return '<button type="button" class="stgBtn" data-fs="'+x[0]+'">'+x[1]+'</button>'}).join('')+'<button type="button" class="stgBtn" data-fs="100">↺ الافتراضي</button></div>'
   +'<div id="v105FsPrev" class="v105FsPrev">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — هذه معاينة لحجم النص</div>';
  row.appendChild(d);
  var rg=$('v105FsRange');
  rg.oninput=function(){$('v105FsVal').textContent=nf(+rg.value)+'٪';$('v105FsPrev').style.fontSize=(16*(+rg.value)/100)+'px'};
  rg.onchange=function(){fsApply((+rg.value)/100)};
  $('v105FsMinus').onclick=function(){fsApply(fsGet()-0.05)};
  $('v105FsPlus').onclick=function(){fsApply(fsGet()+0.05)};
  [].forEach.call(d.querySelectorAll('[data-fs]'),function(b){b.onclick=function(){fsApply((+b.getAttribute('data-fs'))/100)}});
  fsUI();
}
fsApply(fsGet());fsMount();

/* ===================== الوضع الليلي: لون نص كل زر بحسب خلفيته (قراءة مضمونة) ===================== */
(function(){
  function parse(c){var m=/rgba?\(([^)]+)\)/.exec(c||'');if(!m)return null;var v=m[1].split(',').map(parseFloat);return {r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1}}
  function lum(c){var f=function(x){x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)};return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b)}
  function bgLum(el){
    var base={r:8,g:18,b:15},layers=[],e=el;
    while(e&&e.nodeType===1){
      var cs=getComputedStyle(e),bi=cs.backgroundImage;
      if(/gradient/.test(bi)){var st=(bi.match(/rgba?\([^)]+\)/g)||[]).map(parse).filter(function(c){return c&&c.a>0.5});if(st.length){var avg=st.reduce(function(s,c){return s+lum(c)},0)/st.length;return avg}}
      var c=parse(cs.backgroundColor);if(c&&c.a>0){layers.push(c);if(c.a>=1)break}
      e=e.parentElement;
    }
    for(var i=layers.length-1;i>=0;i--){var c2=layers[i];base={r:c2.r*c2.a+base.r*(1-c2.a),g:c2.g*c2.a+base.g*(1-c2.a),b:c2.b*c2.a+base.b*(1-c2.a)}}
    return lum(base);
  }
  function fix(b){
    if(!b||b.nodeType!==1||b.tagName!=='BUTTON')return;
    if(!document.body.classList.contains('dark')){if(b.__v105c){b.style.removeProperty('color');b.__v105c=0}return}
    if(b.classList.contains('primary')||b.classList.contains('back'))return;
    if(!b.offsetParent&&getComputedStyle(b).position!=='fixed')return;
    var l=bgLum(b);
    b.style.setProperty('color',l<0.3?'var(--v105-t,#fff)':'#111','important');b.__v105c=1;
  }
  var pend=false,all=false,added=new Set();
  function flush(){pend=false;var list=all?[].slice.call(document.querySelectorAll('button')):Array.from(added);added.clear();all=false;list.forEach(fix)}
  function sched(){if(pend)return;pend=true;setTimeout(flush,120)}
  new MutationObserver(function(ms){
    ms.forEach(function(m){
      if(m.type==='attributes'&&m.target===document.body){all=true;return}
      if(m.type==='childList')m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.tagName==='BUTTON')added.add(n);else if(n.querySelectorAll)n.querySelectorAll('button').forEach(function(b){added.add(b)})});
    });sched();
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  var _sh=window.show;window.show=function(){var r=_sh.apply(this,arguments);all=true;sched();return r};
  all=true;sched();
})();


/* ===================== المساعد: ذكاء إضافي ===================== */
var ctx={surah:null,rec:null};
function B(label,act){return '<button type="button" class="v103Go" data-v105="'+esc(JSON.stringify(act))+'">'+esc(label)+'</button>'}
function open_(id,label){return '<div>'+B(label,{t:'section',id:id})+'</div>'}
var BUILD=window.APP_BUILD||'';
function reportBtns(){return '<div>'+B('📋 نسخ تقرير المشكلة',{t:'fn',f:'report'})+B('🩺 فحص الاتصال والصوت',{t:'fn',f:'diag'})+B('🔄 تحديث التطبيق',{t:'fn',f:'reload'})+'</div>'}

function hijriParts(d){try{var f=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'}).formatToParts(d),o={};f.forEach(function(p){if(p.type!=='literal')o[p.type]=+p.value});return o}catch(e){return null}}
function daysUntilHijri(month,day){
  var start=new Date();start.setHours(12,0,0,0);
  for(var i=0;i<=400;i++){var d=new Date(start.getTime()+i*86400000),h=hijriParts(d);if(!h)return null;if(h.month===month&&h.day===day)return {days:i,date:d}}
  return null;
}
function eventAnswer(n){
  var ev=null;
  if(/(رمضان)/.test(n))ev=['رمضان',9,1];
  else if(/(عيد الفطر)/.test(n))ev=['عيد الفطر',10,1];
  else if(/(عيد الاضحي|عيد الاضحى|الاضحي)/.test(n))ev=['عيد الأضحى',12,10];
  else if(/(راس السنه الهجريه|السنه الهجريه الجديده|راس السنه)/.test(n))ev=['رأس السنة الهجرية',1,1];
  else if(/(عاشوراء)/.test(n))ev=['عاشوراء',1,10];
  else if(/(يوم عرفه)/.test(n))ev=['يوم عرفة',12,9];
  else if(/(المولد النبوي|مولد النبي)/.test(n))ev=['المولد النبوي',3,12];
  if(!ev||!/(متي|كم باقي|باقي|موعد|متي يبدا|كم يوم)/.test(n))return null;
  var r=daysUntilHijri(ev[1],ev[2]);if(!r)return null;
  var ds=r.date.toLocaleDateString('ar',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  return '📅 '+ev[0]+': '+(r.days===0?'<b>اليوم</b>':'بعد <b>'+nf(r.days)+'</b> يومًا')+' — الموافق تقريبًا '+esc(ds)+'.<div class="mini">حساب فلكي (أم القرى)؛ قد يختلف يومًا عن إعلان رؤية الهلال في بلدك.</div>'+open_('manasik','📅 التقويم والمناسك');
}
function fontAnswer(n){
  if(!/(خط|الخط|الكتابه|النص|الحروف)/.test(n))return null;
  var up=/(كبر|اكبر|زود|زيد|كبّر|تكبير|اضخم)/.test(n),dn=/(صغر|اصغر|قلل|انقص|تصغير)/.test(n),rs=/(الافتراضي|عادي|رجع|اعد|اعاده)/.test(n);
  if(!(up||dn||rs))return null;
  var cur=fsGet(),nv=rs?1:(up?cur+0.15:cur-0.15);nv=fsApply(nv);
  return '🔠 '+(rs?'أعدت الخط للحجم الافتراضي':(up?'كبّرت الخط':'صغّرت الخط'))+' — الحجم الآن <b>'+nf(Math.round(nv*100))+'٪</b>. يمكنك الضبط الدقيق من الإعدادات.'+open_('settings','⚙️ الإعدادات');
}
/* أسئلة «كيف» عن التطبيق نفسه — إجابات ثابتة صحيحة */
var HOW=[
 {re:/(ثبت|تثبيت|انزل|اضيف).*(الشاشه الرئيسيه|التطبيق|الايفون|الجوال|الهاتف)|كيف.*(اثبت|تثبيت)/,a:'📲 <b>على الآيفون:</b> افتح الموقع في Safari ← اضغط زر المشاركة ⬆️ ← «إضافة إلى الشاشة الرئيسية».<br><b>على الأندرويد (Chrome):</b> القائمة ⋮ ← «تثبيت التطبيق».'},
 {re:/(يعمل|يشتغل|اشتغل|استخدم).*(بدون انترنت|بلا انترنت|اوفلاين|بدون نت)|بدون انترنت/,a:'📴 نعم، جزء كبير يعمل بلا إنترنت بعد فتحه مرة: الواجهة والنصوص والأذكار المحفوظة وما حمّلته من تلاوات وأذكار ورقية. أما الخرائط وأصوات القرّاء غير المحمّلة فتحتاج اتصالًا.'},
 {re:/كيف.*(احمل|تحميل|انزل)|اين.*(المحمل|التنزيلات|المحمله)/,a:'⬇️ اضغط زر «تحميل» بجانب الذكر أو في بطاقة الرقية أو السورة. بعد اكتمال التحميل يختفي الزر، وتجد كل ما حمّلته في «تنزيلاتي» ويبقى بعد إغلاق التطبيق.'},
 {re:/كيف.*(اضيف|اضع|احفظ).*(المفضل|مفضله)|المفضله.*كيف/,a:'☆ في بطاقة القارئ اضغط «مفضل» فيُحفظ في قائمتك.'},
 {re:/كيف.*(اوقف|ايقاف|اقف).*(التكرار|الصوت)/,a:'⏹ في صفحة «تكرار الآية» اضغط «إيقاف». التكرار مفتوح دائمًا حتى تضغطه.'},
 {re:/كيف.*(مؤقت|اطفاء تلقائي|تايمر)|مؤقت النوم/,a:'⏲️ في «الأوضاع» اختر وضعًا (مثل وضع النوم) ثم حدّد المؤقت قبل التشغيل، وسيتوقف الصوت تلقائيًا عند انتهائه.'},
 {re:/كيف.*(احذف|مسح|امسح).*(التحميلات|المحمل)/,a:'🗑 من «تنزيلاتي» أو من «الإعدادات» توجد أزرار حذف الملفات الصوتية المحمّلة.'}
];
function howAnswer(n){for(var i=0;i<HOW.length;i++)if(HOW[i].re.test(n))return HOW[i].a;return null}
/* بلاغات الأعطال: خطوات تشخيص + زر نسخ تقرير */
function troubleAnswer(n){
  if(!/(لا يعمل|لا يشتغل|ما يشتغل|ما يعمل|مو شغال|مش شغال|لا تعمل|لا تشتغل|ما تشتغل|ما تعمل|تعطل|تعطّل|مشكله|عطل|يعلق|بطيء|لا يظهر|لا تظهر|ما يظهر|ما تظهر|لا اقدر|ما اقدر|ما يفتح|لا يفتح|توقف)/.test(n))return null;
  var topic=/(كيبورد|لوحه المفاتيح|اكتب|الكتابه)/.test(n)?'kb':/(صوت|قارئ|القراء|تشغيل|سوره|تلاوه|ايفون)/.test(n)?'audio':/(مسجد|مساجد|موقع|gps)/.test(n)?'loc':'gen';
  var steps={
   kb:'⌨️ <b>الكيبورد لا يظهر:</b><br>1) أغلق التطبيق تمامًا وافتحه من جديد (لتحميل آخر نسخة).<br>2) اضغط على خانة الكتابة مباشرة (لا يظهر الكيبورد إلا بلمسة منك).<br>3) إن بقيت المشكلة: الإعدادات ← عام ← لوحة المفاتيح، وتأكد أنها مفعّلة.',
   audio:'🎧 <b>التلاوة لا تعمل:</b><br>1) تأكد من الاتصال وارفع صوت الجهاز.<br>2) أغلق التطبيق وافتحه من جديد.<br>3) جرّب قارئًا آخر لتعرف هل المشكلة في قارئ بعينه.<br>4) اضغط «فحص الاتصال والصوت» وأرسل لي لقطة النتيجة.',
   loc:'🕌 <b>المساجد/الموقع:</b><br>1) فعّل الموقع الدقيق: على الآيفون الإعدادات ← الخصوصية والأمان ← خدمات الموقع ← Safari ← «الموقع الدقيق».<br>2) اضغط «تحديث موقعي بدقة» في صفحة المساجد وانتظر حتى تظهر الدقة بالأمتار.<br>3) إن فشل البحث ستظهر أسباب الفشل أسفل الحالة.',
   gen:'🛠️ <b>خطوات عامة:</b><br>1) أغلق التطبيق وافتحه من جديد لتحميل آخر نسخة.<br>2) تأكد من الاتصال.<br>3) اضغط «نسخ تقرير المشكلة» وأرسله لي ليتبيّن السبب بدقة.'
  };
  return steps[topic]+'<div class="mini">إصدارك: '+esc(BUILD||'—')+'</div>'+reportBtns();
}
/* لهجات: تحويل كلمات شائعة إلى الفصحى قبل الفهم */
function dialect(q){
  var map={'وين':'اين','فين':'اين','شن':'ما','شنو':'ما','ايش':'ما','وش':'ما','شنهي':'ما هي','نبي':'اريد','نبغي':'اريد','نبغى':'اريد','نبغا':'اريد','ابغى':'اريد','ابغي':'اريد','عايز':'اريد','عاوز':'اريد','ودي':'اريد','هلق':'الان','دلوقتي':'الان','هسه':'الان','توا':'الان','برشا':'كثير','كيفاش':'كيف','كيفاه':'كيف','علاش':'لماذا','ليش':'لماذا'};
  return String(q).split(/\s+/).map(function(w){return map[w]||w}).join(' ');
}
/* «هل تقصد…؟» عند وجود خطأ إملائي */
function lev(a,b){if(a===b)return 0;var m=[],i,j;for(i=0;i<=a.length;i++)m[i]=[i];for(j=1;j<=b.length;j++)m[0][j]=j;for(i=1;i<=a.length;i++)for(j=1;j<=b.length;j++)m[i][j]=Math.min(m[i-1][j]+1,m[i][j-1]+1,m[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return m[a.length][b.length]}
function didYouMean(q){
  var n=norm(q).replace(/(^| )ال/g,'$1');if(n.length<3||n.split(' ').length>3)return null;
  var cands=[];
  try{(typeof S!=='undefined'&&S||[]).forEach(function(s,i){cands.push({l:'سورة '+s,key:norm(s).replace(/^ال/,''),act:{t:'section',id:'readers'}})})}catch(e){}
  try{var seen={};(typeof RECITERS!=='undefined'&&RECITERS||[]).forEach(function(r){var k=norm(r.name);if(seen[k])return;seen[k]=1;cands.push({l:r.name,key:k.replace(/(^| )ال/g,'$1'),act:{t:'reciter',id:r.id,nm:r.name,s:0}})})}catch(e){}
  document.querySelectorAll('#home .tile b').forEach(function(b){cands.push({l:b.textContent.trim(),key:norm(b.textContent).replace(/(^| )ال/g,'$1'),act:{t:'tile',k:b.textContent.trim()}})});
  var best=null,bd=99;
  cands.forEach(function(c){var d=lev(n,c.key),lim=Math.max(1,Math.floor(Math.max(n.length,c.key.length)*0.25));if(d<=lim&&d<bd){bd=d;best=c}});
  if(!best)return null;
  return 'هل تقصد <b>«'+esc(best.l)+'»</b>؟<div>'+B('نعم، افتح «'+best.l+'»',best.act)+'</div>';
}
var _ask=window.v105Ask,SURAHS=function(){return (typeof S!=='undefined'&&S)||[]};
function updCtx(u){try{if(u&&u.surah)ctx.surah=u.surah;if(u&&u.reciters&&u.reciters.length)ctx.rec=String(u.reciters[0].r.name)}catch(e){}}
window.v105Ask=async function(q,legacy){
  var n=norm(dialect(q)),r;
  if(/(ما الجديد|اي اصدار|ما اصدار|رقم الاصدار|نسخه التطبيق|اصدار التطبيق)/.test(n))return '🔖 إصدار تطبيقك: <b>'+esc(BUILD||'—')+'</b>. إن لم يكن الأحدث، أغلق التطبيق وافتحه من جديد.'+reportBtns();
  r=troubleAnswer(n);if(r)return r;
  r=howAnswer(n);if(r)return r;
  r=fontAnswer(n);if(r)return r;
  r=eventAnswer(n);if(r)return r;
  var q2=dialect(q);
  var sn=/(?:سوره|السوره)\s*(?:رقم\s*)?(\d{1,3})(?!\s*(?:مره|مرات))/.exec(n);
  if(sn&&+sn[1]>=1&&+sn[1]<=114&&SURAHS()[+sn[1]-1])q2=q2+' سورة '+SURAHS()[+sn[1]-1];
  else if(/(السوره التاليه|السوره الي بعدها|التي بعدها)/.test(n)&&ctx.surah&&ctx.surah<114)q2=q2+' سورة '+SURAHS()[ctx.surah];
  else if(/(السوره السابقه|السوره الي قبلها|التي قبلها)/.test(n)&&ctx.surah>1)q2=q2+' سورة '+SURAHS()[ctx.surah-2];
  else if(/(نفس(ها)?|ذاتها|اسمعها|كررها|وبصوت|بصوت|اسمعنيها|شغلها)/.test(n)&&ctx.surah&&!(window.__v105&&window.__v105.understand(q2).surah))q2=q2+' سورة '+SURAHS()[ctx.surah-1];
  try{updCtx(window.__v105.understand(q2))}catch(e){}
  var out=_ask?await _ask(q2,legacy):null;
  if(typeof out==='string'&&/^عذرًا، لم أجد ما يخصّ/.test(out)){var dm=didYouMean(q);if(dm)return dm}
  return out;
};
window.__v105F={hijriParts:hijriParts,daysUntilHijri:daysUntilHijri,dialect:dialect,didYouMean:didYouMean};
})();

(function(){
'use strict';
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var LSget=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
var LSset=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
var IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function standalone(){return !!(navigator.standalone||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||(window.matchMedia&&matchMedia('(display-mode: fullscreen)').matches))}
if(standalone())document.documentElement.classList.add('standalone');

/* ===================== تسجيل الـ Service Worker (sw.js) ===================== */
if('serviceWorker' in navigator){
  var reg=function(){navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(function(){})};
  if(document.readyState==='complete')reg();else window.addEventListener('load',reg);
}

/* ===================== أيقونات SVG مخصصة (مدمجة، بلا مكتبات خارجية) ===================== */
function gear(){
  var pts=[],n=8,R=9.4,r=7.3;
  for(var k=0;k<n;k++){var a=k*2*Math.PI/n;[[-0.27,r],[-0.17,R],[0.17,R],[0.27,r]].forEach(function(o){var t=a+o[0];pts.push((12+o[1]*Math.cos(t)).toFixed(2)+' '+(12+o[1]*Math.sin(t)).toFixed(2))})}
  return '<path d="M'+pts.join('L')+'Z"/><circle cx="12" cy="12" r="3.1"/><circle class="shield" cx="12" cy="12" r="5.4" stroke-dasharray="2 2.2"/>';
}
var P={
 home:'<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.8 9.8V20h12.4V9.8"/><path d="M9.8 20v-5.4h4.4V20"/>',
 settings:gear(),
 install:'<path d="M12 3.5v11"/><path d="m7.6 10.2 4.4 4.4 4.4-4.4"/><path d="M4.5 17v2.3A1.7 1.7 0 0 0 6.2 21h11.6a1.7 1.7 0 0 0 1.7-1.7V17"/>',
 share:'<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2z"/>',
 doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h6M9.5 15.5h6M9.5 8.5h2.5"/>',
 penpaper:'<path d="M6 3.5h8l3 3V10"/><path d="M6 3.5v17h6"/><path d="M9 9h5M9 12.5h3"/><path d="m19.2 12.8-6.2 6.2-.8 2.8 2.8-.8 6.2-6.2a1.8 1.8 0 0 0-2-2z"/>',
 book:'<path d="M12 6.2C10.3 5 8 4.5 4.5 4.5v14c3.5 0 5.8.6 7.5 1.8 1.7-1.2 4-1.8 7.5-1.8v-14C16 4.5 13.7 5 12 6.2z"/><path d="M12 6.2v14"/>',
 headphones:'<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="14.5" width="4" height="6" rx="1.6"/><rect x="16.5" y="14.5" width="4" height="6" rx="1.6"/>',
 repeat:'<path d="M17 3.5 20.5 7 17 10.5"/><path d="M3.5 11V9.5A2.5 2.5 0 0 1 6 7h14.5"/><path d="M7 20.5 3.5 17 7 13.5"/><path d="M20.5 13v1.5A2.5 2.5 0 0 1 18 17H3.5"/>',
 mosque:'<path d="M5 20v-7.5a7 7 0 0 1 14 0V20"/><path d="M12 2.8v2.4"/><path d="M3.5 20h17"/><path d="M10 20v-3.2a2 2 0 0 1 4 0V20"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/>',
 sparkle:'<path d="M12 3.2 14 9l5.8 2L14 13l-2 5.8L10 13l-5.8-2L10 9z"/><path d="M19 3.5v3M17.5 5h3"/>',
 kids:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.2a4.2 4.2 0 0 0 7 0"/><path d="M9 9.6h.01M15 9.6h.01"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h3M11 17h9"/><circle cx="16" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
 chat:'<path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3.5V17h-2A1.5 1.5 0 0 1 3 15.5V7a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M8 10h8M8 13h5"/>',
 bookmark:'<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/><path d="m9.5 9 1.8 1.8L15 7.2"/>',
 shield:'<path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
 pin:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
 qr:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18.5 14H21M18.5 18H21M16.5 20.5V18"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2.4"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
 desktop:'<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
 plussq:'<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/>',
 shareios:'<path d="M12 15V3.5"/><path d="m8 7.2 4-3.7 4 3.7"/><path d="M6.5 10.5H6A1.5 1.5 0 0 0 4.5 12v7A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-.5"/>',
 dots:'<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>'
};
function svg(name,cls){return '<svg class="vi vi-'+name+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(P[name]||'')+'</svg>'}
window.v105Icon=svg;
var MAP=[[/مصحف/,'book'],[/مساعد/,'chat'],[/القراء/,'headphones'],[/تسميع/,'mic'],[/الأذكار/,'sparkle'],[/الختمة/,'bookmark'],[/الرقية/,'shield'],[/الأحاديث/,'doc'],[/الأطفال/,'kids'],[/القبلة/,'compass'],[/تكرار/,'repeat'],[/المساجد/,'mosque'],[/الأوضاع/,'sliders'],[/المناسك|التقويم/,'calendar'],[/أعمال/,'sun'],[/تثبيت|مشاركة/,'install']];
function iconize(){
  document.querySelectorAll('#home .tile').forEach(function(t){
    var ico=t.querySelector('.ico'),b=t.querySelector('b');if(!ico||!b||ico.__v)return;
    var tt=b.textContent;for(var i=0;i<MAP.length;i++)if(MAP[i][0].test(tt)){ico.innerHTML=svg(MAP[i][1]);ico.__v=1;ico.classList.add('vIco');return}
  });
  document.querySelectorAll('.nav button').forEach(function(b){
    if(b.__v)return;var t=b.textContent;
    if(/الرئيسية/.test(t)){b.innerHTML=svg('home')+' <span>الرئيسية</span>';b.__v=1}
    else if(/الإعدادات/.test(t)){b.innerHTML=svg('settings')+' <span>الإعدادات</span>';b.__v=1}
  });
}

/* ===================== صفحة «تثبيت التطبيق والمشاركة» ===================== */
function appUrl(){try{var u=new URL('./',location.href);u.search='';u.hash='';return u.href}catch(e){return location.href}}
var SHARE_TXT='تطبيق «المسلم» — قرّاء وتلاوات، أذكار ورقية، قبلة، مساجد قريبة، تكرار الآيات للحفظ، ويعمل بلا إنترنت.';
function mkPage(id,title,sub,body){
  if($(id))return $(id);
  var host=($('hadithOff')||$('home')).parentNode;
  var s=document.createElement('section');s.id=id;s.className='page';
  s.innerHTML='<div class="section"><button class="back" onclick="show(\'home\')" aria-label="رجوع">←</button><div><h2>'+title+'</h2><p>'+sub+'</p></div></div>'+body;
  host.appendChild(s);return s;
}
var deferred=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;refreshInstall()});
window.addEventListener('appinstalled',function(){deferred=null;LSset('muslim-v105-installed','1');refreshInstall()});
function steps(list){return '<ol class="vSteps">'+list.map(function(x){return '<li><span>'+x+'</span></li>'}).join('')+'</ol>'}
function buildInstall(){
  if($('install'))return;
  var body=''
  +'<div class="card vHero"><div class="vHeroIc">'+svg('install')+'</div><h3>ثبّت «المسلم» كتطبيق حقيقي</h3><p class="mini">يفتح بملء الشاشة بلا شريط المتصفح، وبأيقونة على شاشتك الرئيسية، ويعمل بلا إنترنت.</p>'
  +'<div id="vInstStatus" class="notice" hidden></div>'
  +'<button type="button" class="primary vBtn" id="vInstallNow" hidden>'+svg('install')+' <span>تثبيت الآن</span></button></div>'
  +'<div class="card"><h3>'+svg('phone')+' الآيفون (iOS Safari)</h3>'+steps([
     'افتح الموقع في <b>Safari</b> (وليس من داخل تطبيق آخر).',
     'اضغط زر المشاركة '+svg('shareios','vInline')+' أسفل المتصفح.',
     'مرّر لأسفل واختر <b>«إضافة إلى الشاشة الرئيسية»</b> '+svg('plussq','vInline')+'.',
     'اضغط <b>«إضافة»</b> أعلى الشاشة ← يظهر «المسلم» على شاشتك ويعمل بملء الشاشة.'])+'<p class="mini">على iOS 16.4 فما فوق يمكن أيضًا من Chrome وEdge عبر قائمة المشاركة.</p></div>'
  +'<div class="card"><h3>'+svg('phone')+' سامسونج وأندرويد (Chrome)</h3>'+steps([
     'اضغط قائمة النقاط الثلاث '+svg('dots','vInline')+' أعلى المتصفح.',
     'اختر <b>«تثبيت التطبيق»</b> أو <b>«إضافة إلى الشاشة الرئيسية»</b>.',
     'أكّد بالضغط على <b>«تثبيت»</b>.'])+'<p class="mini">في متصفح سامسونج: القائمة ☰ ← «إضافة الصفحة إلى» ← «الشاشة الرئيسية».</p></div>'
  +'<div class="card"><h3>'+svg('desktop')+' الكمبيوتر (PC / Mac)</h3>'+steps([
     'في Chrome أو Edge: اضغط أيقونة التثبيت '+svg('install','vInline')+' في شريط العنوان.',
     'اضغط <b>«تثبيت / Install»</b>.',
     'على Mac (Safari 17+): ملف ← <b>«إضافة إلى Dock»</b>.'])+'</div>'
  +'<div class="card vShare"><h3>'+svg('share')+' مشاركة التطبيق</h3><p class="mini">شاركه مع من تحب — صدقة جارية بإذن الله.</p>'
  +'<button type="button" class="primary vBtn" id="vShareBtn">'+svg('share')+' <span>مشاركة التطبيق</span></button>'
  +'<button type="button" class="vBtn" id="vCopyBtn">'+svg('copy')+' <span>نسخ الرابط</span></button>'
  +'<div id="vShareMsg" class="mini" role="status" aria-live="polite"></div>'
  +'<div class="vSocial" id="vSocial"></div></div>'
  +'<div class="card vQr"><h3>'+svg('qr')+' رمز QR للتطبيق</h3>'
  +'<img id="vQrImg" src="qr.png" alt="رمز QR لفتح تطبيق المسلم مباشرة" width="220" height="220" decoding="async">'
  +'<p>امسح الرمز بكاميرا هاتفك لفتح التطبيق مباشرة.</p><p id="vQrMissing" class="mini" hidden>ضع صورة الرمز باسم <b>qr.png</b> في المجلد الرئيسي للموقع.</p></div>';
  mkPage('install','تثبيت التطبيق والمشاركة','ثبّته كتطبيق مستقل وشاركه بسهولة',body);
  var img=$('vQrImg');
  img.addEventListener('error',function(){if(img.getAttribute('src')!=='qr-muslim-site.png'){img.setAttribute('src','qr-muslim-site.png')}else{img.hidden=true;$('vQrMissing').hidden=false}});
  var url=appUrl(),enc=encodeURIComponent;
  $('vSocial').innerHTML=[['واتساب','https://wa.me/?text='+enc(SHARE_TXT+' '+url)],['تليجرام','https://t.me/share/url?url='+enc(url)+'&text='+enc(SHARE_TXT)],['فيسبوك','https://www.facebook.com/sharer/sharer.php?u='+enc(url)],['X','https://twitter.com/intent/tweet?text='+enc(SHARE_TXT)+'&url='+enc(url)]]
    .map(function(x){return '<a class="vSoc" href="'+esc(x[1])+'" target="_blank" rel="noopener noreferrer">'+esc(x[0])+'</a>'}).join('');
  $('vShareBtn').onclick=function(){
    var data={title:'تطبيق المسلم',text:SHARE_TXT,url:url};
    if(navigator.share){navigator.share(data).catch(function(e){if(e&&e.name!=='AbortError')copy()})}else{copy('الرابط منسوخ — اختر تطبيق المشاركة من الأزرار أدناه.')}
  };
  function copy(msg){
    var done=function(){$('vShareMsg').textContent=msg||'✅ تم نسخ الرابط'};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,function(){fallback()})}else fallback();
    function fallback(){var ta=document.createElement('textarea');ta.value=url;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;opacity:0;top:0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e){$('vShareMsg').textContent=url}ta.remove()}
  }
  $('vCopyBtn').onclick=function(){copy()};
  $('vInstallNow').onclick=function(){
    if(!deferred)return;deferred.prompt();
    deferred.userChoice.then(function(c){if(c&&c.outcome==='accepted')LSset('muslim-v105-installed','1');deferred=null;refreshInstall()}).catch(function(){});
  };
  refreshInstall();
}
function refreshInstall(){
  var st=$('vInstStatus'),btn=$('vInstallNow');if(!st||!btn)return;
  if(standalone()){st.hidden=false;st.innerHTML=svg('check','vInline')+' التطبيق مثبّت ويعمل الآن كتطبيق مستقل.';btn.hidden=true}
  else if(deferred){st.hidden=true;btn.hidden=false}
  else{st.hidden=true;btn.hidden=true}
}
window.v105OpenInstall=function(){if(typeof show==='function')show('install')};
var _sh3=window.show;
if(typeof _sh3==='function'){window.show=function(id){if(id==='install')buildInstall();var r=_sh3.apply(this,arguments);if(id==='install')refreshInstall();return r}}

/* بطاقة في الرئيسية */
function addInstallTile(){
  /* V106: لا بطاقة تثبيت في الرئيسية — التثبيت والمشاركة داخل الإعدادات فقط */
  var old=$('v105InstTile');if(old)old.remove();return;
  if($('v105InstTile'))return;
  var tiles=document.querySelectorAll('#home .tile');if(!tiles.length)return;
  var t=document.createElement('div');t.className='tile';t.id='v105InstTile';t.setAttribute('role','button');t.setAttribute('tabindex','0');
  t.setAttribute('onclick',"show('install')");
  t.innerHTML='<span class="ico"></span><b>تثبيت ومشاركة</b><small>أيقونة على شاشتك • مشاركة • QR</small>';
  var ref=tiles[Math.min(2,tiles.length-1)];ref.parentNode.insertBefore(t,ref);
  t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show('install')}});
}
/* تلميح مرة واحدة للآيفون (Safari غير مثبّت) */
function iosHint(){
  if(!IOS||standalone()||LSget('muslim-v105-ioshint','0')==='1')return;
  setTimeout(function(){
    if($('vIosHint'))return;
    var b=document.createElement('div');b.id='vIosHint';b.setAttribute('role','dialog');b.setAttribute('aria-label','تثبيت التطبيق');
    b.innerHTML='<div>'+svg('shareios','vInline')+' ثبّت «المسلم» كتطبيق: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».</div><div class="vHintBtns"><button type="button" id="vHintMore">التفاصيل</button><button type="button" id="vHintX" aria-label="إغلاق">✕</button></div>';
    document.body.appendChild(b);
    function close(){LSset('muslim-v105-ioshint','1');b.remove()}
    $('vHintX').onclick=close;$('vHintMore').onclick=function(){close();show('install')};
  },6000);
}
function boot(){
  buildInstall();addInstallTile();iconize();
  try{var q=new URLSearchParams(location.search).get('open');if(q==='install')show('install')}catch(e){}
  iosHint();
}
boot();
/* أيقونات العناصر المُنشأة لاحقًا */
var pend=false;
try{new MutationObserver(function(){if(pend)return;pend=true;setTimeout(function(){pend=false;iconize()},250)}).observe(document.body,{childList:true,subtree:true})}catch(e){}
window.__v105C={svg:svg,icons:Object.keys(P),buildInstall:buildInstall};
})();
/* =====================================================================
   V106 — 1) نظام الأيقونات: يستبدل كل الإيموجي بأيقونات SVG (Sprite خفيف)
   - لا مكتبات خارجية: المسارات مأخوذة بأسلوب Lucide ومدمجة هنا فقط بما نحتاجه.
   - الكاسح يعمل على النصوص المضافة ديناميكيًا (rAF) ويحذف أي إيموجي غير معروف.
   ===================================================================== */
(function(){
'use strict';
var D={ /* المحتوى الداخلي لكل أيقونة (viewBox 24) */
 plus:'<path d="M12 5v14M5 12h14"/>',
 moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
 star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>',
 play:'<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>',
 pause:'<rect width="5" height="18" x="14" y="3" rx="1"/><rect width="5" height="18" x="5" y="3" rx="1"/>',
 stop:'<rect width="16" height="16" x="4" y="4" rx="2.5"/>',
 trash:'<path d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',
 folder:'<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
 refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
 search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
 bell:'<path d="M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
 palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".6"/><circle cx="17.5" cy="10.5" r=".6"/><circle cx="6.5" cy="12.5" r=".6"/><circle cx="8.5" cy="7.5" r=".6"/>',
 volume:'<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298zM16 9a5 5 0 0 1 0 6m3.364 3.364a9 9 0 0 0 0-12.728"/>',
 mute:'<path d="M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298zm5.5 9.798 5-5m-5 0 5 5"/>',
 heart:'<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 sunrise:'<path d="M12 2v8m-7.07.93 1.41 1.41M2 18h2m16 0h2m-2.93-7.07-1.41 1.41M22 22H2M8 6l4-4 4 4m0 12a4 4 0 0 0-8 0"/>',
 sunset:'<path d="M12 10V2m-7.07 8.93 1.41 1.41M2 18h2m16 0h2m-2.93-7.07-1.41 1.41M22 22H2M16 6l-4 4-4-4m8 12a4 4 0 0 0-8 0"/>',
 rocket:'<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>',
 loader:'<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 checkc:'<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8 5.2-5.6"/>',
 alert:'<path d="M12 3.5 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.6h.01"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
 leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 back:'<path d="m9 6 6 6-6 6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 trophy:'<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
 wifioff:'<path d="M2 2l20 20"/><path d="M8.5 16.5a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 4.2-2.7M10.7 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 5.2-2.7M16 11.2a10 10 0 0 1 3 1.7"/><path d="M12 20h.01"/>',
 skipb:'<path d="M19 20 9 12l10-8z"/><path d="M5 19V5"/>',
 skipf:'<path d="m5 4 10 8-10 8z"/><path d="M19 5v14"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>',
 disk:'<path d="M3 13h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m5.4 13 2.1-7.2A2 2 0 0 1 9.4 4.4h5.2a2 2 0 0 1 1.9 1.4L18.6 13"/><path d="M7 17h.01"/>',
 undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
 nav:'<path d="m3 11 19-9-9 19-2-8z"/>',
 /* من مجموعة V105 */
 home:'<path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M5.8 9.8V20h12.4V9.8"/><path d="M9.8 20v-5.4h4.4V20"/>',
 download:'<path d="M12 3.5v11"/><path d="m7.6 10.2 4.4 4.4 4.4-4.4"/><path d="M4.5 17v2.3A1.7 1.7 0 0 0 6.2 21h11.6a1.7 1.7 0 0 0 1.7-1.7V17"/>',
 upload:'<path d="M12 15V3.5"/><path d="m8 7.2 4-3.7 4 3.7"/><path d="M6.5 10.5H6A1.5 1.5 0 0 0 4.5 12v7A1.5 1.5 0 0 0 6 20.5h12a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-.5"/>',
 share:'<circle cx="18" cy="5.5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="m8.3 10.8 7.4-4M8.3 13.2l7.4 4"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2z"/>',
 doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h6M9.5 15.5h6M9.5 8.5h2.5"/>',
 book:'<path d="M12 6.2C10.3 5 8 4.5 4.5 4.5v14c3.5 0 5.8.6 7.5 1.8 1.7-1.2 4-1.8 7.5-1.8v-14C16 4.5 13.7 5 12 6.2z"/><path d="M12 6.2v14"/>',
 headphones:'<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="14.5" width="4" height="6" rx="1.6"/><rect x="16.5" y="14.5" width="4" height="6" rx="1.6"/>',
 repeat:'<path d="M17 3.5 20.5 7 17 10.5"/><path d="M3.5 11V9.5A2.5 2.5 0 0 1 6 7h14.5"/><path d="M7 20.5 3.5 17 7 13.5"/><path d="M20.5 13v1.5A2.5 2.5 0 0 1 18 17H3.5"/>',
 mosque:'<path d="M5 20v-7.5a7 7 0 0 1 14 0V20"/><path d="M12 2.8v2.4"/><path d="M3.5 20h17"/><path d="M10 20v-3.2a2 2 0 0 1 4 0V20"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3"/>',
 sparkle:'<path d="M12 3.2 14 9l5.8 2L14 13l-2 5.8L10 13l-5.8-2L10 9z"/><path d="M19 3.5v3M17.5 5h3"/>',
 kids:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.2a4.2 4.2 0 0 0 7 0"/><path d="M9 9.6h.01M15 9.6h.01"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h3M11 17h9"/><circle cx="16" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
 chat:'<path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H11l-4.5 3.5V17h-2A1.5 1.5 0 0 1 3 15.5V7a1.5 1.5 0 0 1 1.5-1.5z"/><path d="M8 10h8M8 13h5"/>',
 bookmark:'<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
 shield:'<path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.5 7.5-5 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
 pin:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
 qr:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18.5 14H21M18.5 18H21M16.5 20.5V18"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2.4"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
 gear:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
};
(function(){ /* ترس هندسي (8 أسنان) */
  var pts=[],n=8,R=9.4,r=7.3;
  for(var k=0;k<n;k++){var a=k*2*Math.PI/n;[[-0.27,r],[-0.17,R],[0.17,R],[0.27,r]].forEach(function(o){var t=a+o[0];pts.push((12+o[1]*Math.cos(t)).toFixed(2)+' '+(12+o[1]*Math.sin(t)).toFixed(2))})}
  D.gear='<path d="M'+pts.join('L')+'Z"/><circle cx="12" cy="12" r="3.1"/>';
})();
/* خريطة الإيموجي → اسم الأيقونة (ما لا يُذكر هنا يُحذف) */
var M={};
function map(name,list){list.split(' ').forEach(function(e){if(e)M[e]=name})}
map('book','📖 📗 📘 📚 📕 📙 📒 📔');map('loader','⏳ ⌛');map('mic','🎙 🎤');map('play','▶ 🎬 ⏵');
map('sparkle','🤲 ✨ ✦ 🌟 💫 🎉 🔥 ⚡');map('check','✓ ✔ ✅ ☑');map('pin','📍 🗺 📌');map('mosque','🕋 🕌');
map('repeat','🔁 🔂');map('refresh','🔄 ↺ ↻');map('download','⬇ 📥 💾 ⬆');map('star','☆ ★ ⭐');
map('headphones','🎧');map('x','❌ ✕ ✖ ✗ ✘');map('target','🎯 🎮');map('doc','📜 📝 📋');map('moon','🌙 ☾ ☪');
map('pause','⏸');map('stop','⏹');map('sunrise','🌅');map('sunset','🌇');map('heart','🤍 ♥ ❤ 💚');
map('search','🔎 🔍');map('compass','🧭');map('sun','☀ 🌞');map('trophy','🏆 🎖 👑');
map('volume','🔊 🔉');map('mute','🔇');map('leaf','🌿 🌱 🌺 🌹 🌷');map('alert','⚠ 🚧');map('copy','📋');
map('gear','⚙');map('home','🏠');map('calendar','📅 🗓 📆');map('kids','🧒 👶');map('trash','🗑');
map('sliders','🎛 🛠 🧰 🖌');map('phone','📱');map('install','📲');map('globe','🌐');map('share','📤');
map('palette','🎨');map('bell','🔔');map('shield','🛡 🔒 🔐');map('bookmark','🔖');map('chat','💬');
map('link','🔗');map('rocket','🚀');map('clock','🕘 🕐 ⏱ ⏲ 🕑');map('wifioff','📴');map('undo','↩ ↶');
map('skipb','⏮');map('skipf','⏭');map('menu','☰');map('info','ℹ 💡');map('nav','🚗');map('folder','📂 🗂 🗄');
map('disk','💽');
M['📿']='sparkle';M['🩺']='shield';M['🧹']='trash';M['🧳']='folder';
/* مرادفات الأدوات */
D.install=D.download;
var BACK_CLS='back';

/* الـ Sprite: يُحقن مرة واحدة */
function sprite(){
  if(document.getElementById('v106Sprite'))return;
  var s='<svg id="v106Sprite" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>';
  Object.keys(D).forEach(function(k){s+='<symbol id="i-'+k+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+D[k]+'</symbol>'});
  s+='</defs></svg>';
  var d=document.createElement('div');d.innerHTML=s;document.body.insertBefore(d.firstChild,document.body.firstChild);
}
function icon(name,extra){
  if(!D[name])return '';
  return '<svg class="vi vi-'+name+(extra?' '+extra:'')+'" aria-hidden="true" focusable="false"><use href="#i-'+name+'"/></svg>';
}
window.v106Icon=icon;window.v106Icons=D;
/* مطابقة الإيموجي: نطاقات الرموز + الأزواج البديلة (surrogates) + المُعدِّلات */
var RX=/(?:[←-⇿⌀-⏿■-◿☀-➿⬀-⯿ℹⓂ⤴⤵〰〽]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[︎️]?(?:‍(?:[←-⇿⌀-➿⬀-⯿]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])[︎️]?)*|[\uD83C][\uDFFB-\uDFFF]/g;
var RX1=new RegExp(RX.source);
function norm(e){return e.replace(/[︎️]/g,'').replace(/[\uD83C][\uDFFB-\uDFFF]/g,'')}
function lookup(e){var n=norm(e);if(M[n])return M[n];var f=Array.from(n)[0];return M[f]||null}
var SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,OPTION:1,TITLE:1,NOSCRIPT:1,SVG:1,svg:1,INPUT:1,CODE:1};
function strip(s){return s.replace(RX,'').replace(/ {2,}/g,' ')}
function sweepText(tn){
  var s=tn.nodeValue;if(!s||!RX1.test(s))return;
  var p=tn.parentNode;if(!p||SKIP[p.nodeName]||(p.closest&&p.closest('[data-noicon]')))return;
  var isBack=p.nodeType===1&&p.classList&&p.classList.contains(BACK_CLS);
  if(isBack&&/^\s*[←→]\s*$/.test(s)){var sp=document.createElement('span');sp.innerHTML=icon('back');p.replaceChild(sp.firstChild,tn);return}
  var frag=document.createDocumentFragment(),last=0,m;RX.lastIndex=0;var any=false;
  while((m=RX.exec(s))){
    var nm=lookup(m[0]);
    if(m.index>last)frag.appendChild(document.createTextNode(s.slice(last,m.index)));
    if(nm){
      var t=document.createElement('span');
      var fill=/[★⭐🌟]/.test(m[0])?'vi-fill':'';
      t.innerHTML=icon(nm,(nm==='loader'?'vi-spin ':'')+fill);
      frag.appendChild(t.firstChild);any=true;
    }
    last=m.index+m[0].length;
  }
  if(last<s.length)frag.appendChild(document.createTextNode(s.slice(last)));
  p.replaceChild(frag,tn);
}
function sweep(root){
  if(!root)return;
  if(root.nodeType===3){sweepText(root);return}
  if(root.nodeType!==1||SKIP[root.nodeName])return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var v=n.nodeValue;return (v&&RX1.test(v))?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  var list=[],n;while((n=w.nextNode()))list.push(n);
  for(var i=0;i<list.length;i++)sweepText(list[i]);
  /* خصائص نصية: placeholder / title / aria-label / value لأزرار */
  var els=root.querySelectorAll?root.querySelectorAll('[placeholder],[title],[aria-label]'):[];
  for(var j=0;j<els.length;j++){['placeholder','title','aria-label'].forEach(function(a){var v=els[j].getAttribute(a);if(v&&RX1.test(v))els[j].setAttribute(a,strip(v).trim())})}
  var opts=root.querySelectorAll?root.querySelectorAll('option'):[];
  for(var k=0;k<opts.length;k++){var o=opts[k];if(RX1.test(o.textContent))o.textContent=strip(o.textContent).trim()}
}
window.v106Sweep=sweep;
var q=[],sched=false;
function flush(){
  sched=false;var items=q;q=[];
  for(var i=0;i<items.length;i++){var n=items[i];if(n.isConnected)sweep(n)}
}
function queue(n){q.push(n);if(!sched){sched=true;(window.requestAnimationFrame||setTimeout)(flush)}}
function start(){
  sprite();
  try{if(RX1.test(document.title))document.title=strip(document.title).trim()}catch(e){}
  /* الكنس الأول على دفعات حتى لا يُجمَّد العرض */
  var pages=[].slice.call(document.querySelectorAll('.page,.top,.nav,#v101Dock,#globalMiniPlayer'));
  var act=document.querySelector('.page.active');if(act){sweep(act);}
  var i=0;(function step(){var t=Date.now();while(i<pages.length&&Date.now()-t<8){sweep(pages[i++])}if(i<pages.length)setTimeout(step,16)})();
  try{
    new MutationObserver(function(ms){
      for(var a=0;a<ms.length;a++){var m=ms[a];
        if(m.type==='characterData'){if(m.target.parentNode&&RX1.test(m.target.nodeValue||''))queue(m.target)}
        else for(var b=0;b<m.addedNodes.length;b++){var n=m.addedNodes[b];if(n.nodeType===3){if(RX1.test(n.nodeValue||''))queue(n)}else if(n.nodeType===1&&n.id!=='v106Sprite')queue(n)}}
    }).observe(document.body,{childList:true,subtree:true,characterData:true});
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
/* =====================================================================
   V106 — 2) القرّاء + التنزيلات + العمل بلا إنترنت
   - قائمة القرّاء تُحفظ محليًا (تظهر فورًا وبلا إنترنت) وتتحدّث بصمت.
   - القرّاء الخمسة من archive.org (ومنهم الثلاثة: مسعد / عبادي / خضر) أُعيد بناؤهم من مصدر واحد موثّق.
   - صفحة التنزيلات: اسم القارئ والرواية والسورة + «فتح» + «حذف».
   - صفحة القارئ: تُظهر السور المحمّلة وتشغّلها بلا إنترنت.
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
var LS_=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
var IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
var ic=function(n,c){return window.v106Icon?window.v106Icon(n,c):''};
var DLP='quran-m09-download:',META='quran-m09-download-meta:';
var REC_KEY='muslim-v106-rec',DLR_KEY='muslim-v106-dlr';
var all114=Array.from({length:114},function(_,i){return i+1});
var rng=function(a,b){var o=[];for(var i=a;i<=b;i++)o.push(i);return o};

/* ---------- 1) القرّاء من archive.org (روابط وأسماء ملفات متحقَّق منها) ---------- */
var AR='حفص عن عاصم - مرتل',KH='خلف عن حمزة - رواية خلاد';
var EXTRA=[
 {id:'ia-masad',pinned:1,name:'عبد الرحمن مسعد',rewaya:AR,server:'https://archive.org/download/010_20221110/',surahList:[10,19,23,29,32,49,73,78,87,88,100,107],search:['عبد الرحمن مسعد','عبدالرحمن مسعد']},
 {id:'ia-abbadi',pinned:1,name:'حسام الدين عبادي',rewaya:AR,server:'https://archive.org/download/Abbadi-Houssem-Eddine/',surahList:[1,12,14,15,17,18,19,31,32,36,38,44,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,72,74,75,76,77,78,81,85,86,88,93,99],search:['حسام الدين عبادي','حسام عبادي']},
 {id:'ia-khedr',pinned:1,name:'أحمد خضر',rewaya:AR,server:'https://archive.org/download/012_20221105_202211/',surahList:[1,7,12,15,18,19,20,21,22,24,25,27,29,30,31,32,36,38,43,44,45,46,47,48,49,52,53,54,55,56,61,64,67,68,69,70,71,72,75,76,78,79,80,81,83,84,86,88,89,90,91,97,110],search:['أحمد خضر','احمد خضر']},
 {id:'ia-saltani',name:'مفتاح السلطني',rewaya:KH,server:'https://archive.org/download/khalladsaltani/',surahList:rng(1,79),search:['مفتاح السلطني']},
 {id:'ia-ynouh',name:'يوسف نوح أحمد',rewaya:KH,server:'https://archive.org/download/reeding-of--khallad-an--hamzah----------------by_______yousef-nouh-ahmad-mp3--/Khallad_',surahList:rng(3,57),search:['يوسف نوح أحمد']}
];
EXTRA.forEach(function(r){r.edition='mp3quran';r.ext=1});
window.V106_EXTRA=EXTRA;

/* ترحيل لمرة واحدة: حذف القرّاء القدامى (x-*) وكل ما يتعلق بهم: تنزيلات، مفضلة، بيانات */
function purgeOld(){
  if(LG('muslim-v106-purged','0')==='1')return;
  var keys=[];try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k.indexOf(DLP+'x-')===0||k.indexOf(META+DLP+'x-')===0))keys.push(k)}}catch(e){}
  var idbDel=[];keys.forEach(function(k){if(k.indexOf(META)!==0)idbDel.push(k);try{localStorage.removeItem(k)}catch(e){}});
  if(idbDel.length)openDB().then(function(db){var tx=db.transaction('audio','readwrite');idbDel.forEach(function(k){tx.objectStore('audio').delete(k)});tx.oncomplete=function(){db.close()}}).catch(function(){});
  try{var f=JSON.parse(LG('quran-m09-favorites-v26','null'));if(f&&f.readers){f.readers=f.readers.filter(function(r){return String(r.id).indexOf('x-')!==0});LS_('quran-m09-favorites-v26',JSON.stringify(f))}}catch(e){}
  LS_('muslim-v106-purged','1');
}
function openDB(){return new Promise(function(res,rej){var r=indexedDB.open('quran-m09-offline-v2',1);r.onupgradeneeded=function(){r.result.createObjectStore('audio')};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
function idbKeys(){return openDB().then(function(db){return new Promise(function(res,rej){var q=db.transaction('audio','readonly').objectStore('audio').getAllKeys();q.onsuccess=function(){db.close();res(q.result||[])};q.onerror=function(){db.close();rej(q.error)}})})}
function idbDel(k){return openDB().then(function(db){return new Promise(function(res,rej){var tx=db.transaction('audio','readwrite');tx.objectStore('audio').delete(k);tx.oncomplete=function(){db.close();res()};tx.onerror=function(){db.close();rej(tx.error)}})})}
function idbSize(k){return openDB().then(function(db){return new Promise(function(res){var q=db.transaction('audio','readonly').objectStore('audio').get(k);q.onsuccess=function(){db.close();res(q.result&&q.result.size||0)};q.onerror=function(){db.close();res(0)}})}).catch(function(){return 0})}

/* ---------- 2) قائمة القرّاء: لقطة محلية + تحديث صامت ---------- */
function snapshot(list){
  try{
    var a=list.filter(function(r){return !r.ext}).map(function(r){return [r.id,r.mp3Id||0,r.name,r.server,r.moshafId||0,(r.surahList&&r.surahList.length===114)?'*':(r.surahList||[]).join(','),r.rewaya||'']});
    LS_(REC_KEY,JSON.stringify({t:Date.now(),v:2,a:a}));
  }catch(e){}
}
function fromSnapshot(){
  try{
    var j=JSON.parse(LG(REC_KEY,'null'));if(!j||j.v!==2||!j.a||!j.a.length)return null;
    return {t:j.t,list:j.a.map(function(x){return {id:x[0],mp3Id:x[1]||undefined,name:x[2],edition:'mp3quran',server:x[3],moshafId:x[4],surahList:x[5]==='*'?all114:String(x[5]).split(',').filter(Boolean).map(Number),rewaya:x[6]||'رواية غير محددة',search:[x[2],x[6]]}})};
  }catch(e){return null}
}
function build(rs){
  var out=[];
  rs.forEach(function(r){(r.moshaf||[]).forEach(function(m){
    if(!m||!m.server)return;
    out.push({id:'mp3-'+r.id+'-'+m.id,mp3Id:r.id,name:r.name,edition:'mp3quran',server:String(m.server).replace(/^http:\/\//i,'https://'),moshafId:m.id,surahList:String(m.surah_list||'').split(',').filter(Boolean).map(Number),rewaya:m.name||'رواية غير محددة',search:[r.name,m.name||'']});
  })});
  out.sort(function(a,b){return a.name.localeCompare(b.name,'ar')||a.rewaya.localeCompare(b.rewaya,'ar')});
  return out;
}
function finalize(list){
  var ex=EXTRA.map(function(x){return Object.assign({},x)});
  var all=list.concat(ex);
  var pin=all.filter(function(r){return r.pinned}),rest=all.filter(function(r){return !r.pinned});
  RECITERS.splice.apply(RECITERS,[0,RECITERS.length].concat(pin,rest));
}
var curReaderId=null;
function renderAfterLoad(){
  try{buildReaderFilters()}catch(e){}
  try{loadReciterCards(($('readerSearch')||{}).value||'')}catch(e){}
  try{if(typeof initRepeatAyah==='function')initRepeatAyah()}catch(e){}
  decorateCards();
}
var loading=null;
function fetchReciters(){
  var ctl=new AbortController(),t=setTimeout(function(){ctl.abort()},15000);
  return fetch('https://www.mp3quran.net/api/v3/reciters?language=ar',{signal:ctl.signal}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('http');return r.json()}).then(function(j){return j.reciters||[]});
}
function loadRec(force){
  if(loading)return loading;
  var snap=fromSnapshot(),host=$('readerList');
  if(snap){finalize(snap.list);renderAfterLoad()}
  else if(host)host.innerHTML='<div class="notice">'+ic('loader','vi-spin')+' جارٍ تحميل القرّاء والروايات…</div>';
  var stale=!snap||force||(Date.now()-snap.t>12*3600e3);
  if(!stale){loading=Promise.resolve();return loading}
  var go=function(){
    return fetchReciters().then(function(rs){var l=build(rs);if(l.length>20){snapshot(l);finalize(l);renderAfterLoad()}})
      .catch(function(){if(!snap){finalize([]);renderAfterLoad();if(host)host.insertAdjacentHTML('afterbegin','<div class="notice">'+ic('wifioff')+' تعذّر تحميل بقية القرّاء. تحقق من الاتصال ثم <button type="button" class="primary" onclick="loadReciters(true)">أعد المحاولة</button></div>')}})
      .then(function(){loading=null});
  };
  /* مع وجود لقطة: لا نزاحم التشغيل الأول — التحديث بعد الخمول */
  loading=snap?new Promise(function(res){(window.requestIdleCallback||function(f){setTimeout(f,2500)})(function(){go().then(res)},{timeout:6000})}):go();
  return loading;
}
window.loadReciters=function(force){return loadRec(force===true)};
if(!fromSnapshot())finalize([]);   /* فورًا: على الأقل القرّاء الخمسة */

/* ---------- 3) حالة التنزيلات ---------- */
var DL=new Set(),DLSIZE={};
function dlKey(rid,n){return DLP+rid+':'+n}
function refreshDL(){
  return idbKeys().then(function(ks){
    DL=new Set(ks.map(String).filter(function(k){return k.indexOf(DLP)===0}));
    try{renderSongs(($('songSearch')||{}).value||'')}catch(e){}
    decorateCards();decorateProfile();
  }).catch(function(){});
}
window.isDownloaded=function(num){return typeof currentReader!=='undefined'&&!!currentReader&&DL.has(dlKey(currentReader.id,num))};
function readerObj(rid){
  var r=RECITERS.find(function(x){return String(x.id)===String(rid)});if(r)return r;
  try{var m=JSON.parse(LG(DLR_KEY,'{}'));if(m[rid])return m[rid]}catch(e){}
  var mm=/^mp3-(\d+)-(\d+)$/.exec(String(rid));
  if(mm){r=RECITERS.find(function(x){return String(x.mp3Id)===mm[1]&&String(x.moshafId)===mm[2]});if(r)return r}
  return null;
}
function metaFor(key){
  var rid=key.slice(DLP.length).split(':');var n=Number(rid.pop());rid=rid.join(':');
  var m=null;try{m=JSON.parse(LG(META+key,'null'))}catch(e){}
  var r=readerObj(rid);
  var name=(m&&m.readerName&&m.readerName!=='القارئ'&&!/^mp3-/i.test(m.readerName)&&m.readerName)||(r&&r.name)||'قارئ محفوظ';
  var rw=(m&&m.readerRewaya)||(r&&r.rewaya)||'';
  var sn=(m&&m.surahName)||(typeof S!=='undefined'&&S[n-1])||('سورة '+n);
  return {key:key,rid:rid,n:n,reader:name,rewaya:rw,surah:sn};
}
/* تسجيل بيانات القارئ عند اكتمال أي تنزيل (يكفي لإعادة فتحه بلا إنترنت) */
var _fd=window.finishDownload;
window.finishDownload=async function(task){
  var rc=currentReader;
  var r=await _fd.apply(this,arguments);
  try{
    if(rc){
      var m=JSON.parse(LG(DLR_KEY,'{}'));
      m[rc.id]={id:rc.id,name:rc.name,rewaya:rc.rewaya||'',server:rc.server||'',surahList:rc.surahList||[],edition:rc.edition||'mp3quran',mp3Id:rc.mp3Id||'',moshafId:rc.moshafId||'',search:rc.search||[rc.name]};
      LS_(DLR_KEY,JSON.stringify(m));
      DL.add(dlKey(rc.id,task.num));
      try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
    }
  }catch(e){}
  refreshDL();return r;
};
var _ds=window.downloadSurah;
window.downloadSurah=function(num){
  if(!navigator.onLine){var st=$('downloadStatus');if(st){st.style.display='block';st.innerHTML=ic('wifioff')+' لا يوجد اتصال بالإنترنت الآن — التحميل يحتاج اتصالًا.'}return}
  return _ds.apply(this,arguments);
};
window.v106DelSurah=function(num){
  if(!currentReader)return;
  if(!confirm('حذف «'+(S[num-1]||num)+'» المحمّلة من هذا الجهاز؟'))return;
  var k=dlKey(currentReader.id,num);
  idbDel(k).then(function(){try{localStorage.removeItem(k);localStorage.removeItem(META+k)}catch(e){}DL.delete(k);renderSongs(($('songSearch')||{}).value||'');decorateProfile();decorateCards()});
};

/* ---------- 4) صفحة القارئ ---------- */
window.renderSongs=function(q){
  q=q||'';
  var host=$('songList');if(!host||typeof currentReader==='undefined'||!currentReader)return;
  var avail=new Set(currentReader.surahList&&currentReader.surahList.length?currentReader.surahList:all114);
  var h='';
  for(var i=0;i<S.length;i++){
    var n=i+1;if(!avail.has(n)||(q&&S[i].indexOf(q)<0))continue;
    var d=DL.has(dlKey(currentReader.id,n));
    h+='<div class="listrow songRow'+(d?' isDl':'')+'" onclick="playSurah('+n+')"><div class="rowMain"><span class="num">'+n+'</span><b>'+E(S[i])+'</b>'+(d?'<span class="dlTag">'+ic('checkc')+' محمّلة</span>':'')+'</div>'
     +'<button type="button" class="downloadBtn" onclick="event.stopPropagation();playSurah('+n+')">'+ic('play')+' '+(d?'تشغيل':'استماع')+'</button>'
     +(d?'<button type="button" class="downloadBtn danger" onclick="event.stopPropagation();v106DelSurah('+n+')" aria-label="حذف التنزيل">'+ic('trash')+' حذف</button>'
        :'<button type="button" class="downloadBtn" onclick="event.stopPropagation();downloadSurah('+n+')">'+ic('download')+' تحميل</button>')+'</div>';
  }
  host.innerHTML=h||'<div class="notice">لا توجد سورة مطابقة.</div>';
};
function decorateProfile(){
  var p=$('readerProfile');if(!p||typeof currentReader==='undefined'||!currentReader)return;
  var n=0;DL.forEach(function(k){if(k.indexOf(DLP+currentReader.id+':')===0)n++});
  var el=p.querySelector('.dlSummary');
  if(!n){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.className='dlSummary';p.appendChild(el)}
  el.innerHTML=ic('checkc')+' '+n+' سورة محمّلة لهذا القارئ — تعمل بلا إنترنت';
}
function decorateCards(){
  var by={};DL.forEach(function(k){var rid=k.slice(DLP.length).split(':').slice(0,-1).join(':');by[rid]=(by[rid]||0)+1});
  document.querySelectorAll('#readerList .reader').forEach(function(c){
    var i=+c.getAttribute('data-reciter-index'),r=RECITERS[i];if(!r)return;
    var n=by[r.id],b=c.querySelector('.dlBadge');
    if(!n){if(b)b.remove();return}
    if(!b){b=document.createElement('span');b.className='dlBadge';c.appendChild(b)}
    b.innerHTML=ic('download')+' '+n+' محمّلة';
  });
}
var _lrc=window.loadReciterCards;
window.loadReciterCards=function(){var r=_lrc.apply(this,arguments);decorateCards();return r};
var _or=window.openReader;
window.openReader=async function(){var r=await _or.apply(this,arguments);decorateProfile();return r};

/* ---------- 5) تشغيل السورة: لا اتصال + غير محمّلة = رسالة واضحة ---------- */
var _ps=window.playSurah;
window.playSurah=async function(num){
  var a=$('audio');
  try{
    if(a&&IOS&&!a.getAttribute('src')){a.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';var pp=a.play();if(pp&&pp.catch)pp.catch(function(){})}
    if(!navigator.onLine&&currentReader&&!DL.has(dlKey(currentReader.id,num))){
      var n=$('now');if(n)n.textContent='لا يوجد اتصال — هذه السورة غير محمّلة. حمّلها عند توفر الإنترنت.';return;
    }
  }catch(e){}
  return _ps.apply(this,arguments);
};
/* مراقب التعليق (Safari): إن لم يبدأ التشغيل خلال 9 ثوانٍ نجرّب التحميل كملف مرة واحدة */
(function(){
  var a=$('audio');if(!a||a.__v106w)return;a.__v106w=1;var tm=null;
  a.addEventListener('loadstart',function(){clearTimeout(tm);tm=setTimeout(function(){
    if(a.paused||a.readyState>=3||!a.currentSrc||/^(blob|data):/.test(a.currentSrc))return;
    try{a.dispatchEvent(new Event('error'))}catch(e){}
  },9000)});
  ['playing','canplay','pause','emptied'].forEach(function(ev){a.addEventListener(ev,function(){clearTimeout(tm)})});
})();
/* عند فشل مصدر خارجي: محاولة واحدة لتحميله كملف ثم تشغيله (يحلّ بعض شبكات الجوال) */
(function(){
  var a=$('audio');if(!a||a.__v106)return;a.__v106=1;var tried={};
  a.addEventListener('error',function(){
    var src=a.currentSrc||a.src;if(!src||/^(blob|data):/.test(src)||tried[src]||!navigator.onLine)return;tried[src]=1;
    var n=$('now');if(n)n.textContent='إعادة المحاولة بطريقة بديلة…';
    fetch(src).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){
      if(window._v106Blob)URL.revokeObjectURL(window._v106Blob);window._v106Blob=URL.createObjectURL(b);a.src=window._v106Blob;return a.play()
    }).then(function(){if(n&&typeof S!=='undefined')n.textContent='▶ '+S[currentSurah-1]}).catch(function(){if(n)n.textContent='تعذّر تشغيل هذه التلاوة الآن (المصدر لا يستجيب). جرّب لاحقًا أو قارئًا آخر.'});
  });
})();

/* ---------- 6) فتح قارئ + سورة من التنزيلات ---------- */
window.v106OpenReader=async function(rid,num){
  var r=readerObj(rid);
  if(!r){alert('بيانات هذا القارئ غير متاحة الآن.');return}
  var i=RECITERS.findIndex(function(x){return String(x.id)===String(r.id)});
  if(i<0){RECITERS.push(r);i=RECITERS.length-1}
  await openReader(i);
  if(num)setTimeout(function(){playSurah(num)},120);
};

/* ---------- 7) صفحة التنزيلات ---------- */
function fmt(b){if(!b)return '';return b>=1048576?(b/1048576).toFixed(1)+' م.ب':Math.max(1,Math.round(b/1024))+' ك.ب'}
window.v106RenderDownloads=async function(){
  var box=$('v103DlList');if(!box)return;
  box.innerHTML='<div class="notice">'+ic('loader','vi-spin')+' جارٍ قراءة التنزيلات…</div>';
  var keys=[];try{keys=(await idbKeys()).map(String).filter(function(k){return k.indexOf(DLP)===0})}catch(e){}
  DL=new Set(keys);
  var groups={},order=[];
  keys.forEach(function(k){var m=metaFor(k);if(!groups[m.rid]){groups[m.rid]={rid:m.rid,reader:m.reader,rewaya:m.rewaya,items:[]};order.push(m.rid)}groups[m.rid].items.push(m)});
  order.sort(function(a,b){return groups[a].reader.localeCompare(groups[b].reader,'ar')});
  var h='';
  if(order.length){
    h+='<div class="dlHead">'+ic('headphones')+' <b>التلاوات المحمّلة</b><span class="mini">'+keys.length+' سورة</span></div>';
    for(var gi=0;gi<order.length;gi++){
      var g=groups[order[gi]];g.items.sort(function(a,b){return a.n-b.n});
      h+='<div class="card dlGroup"><div class="dlGroupHead"><div><b>'+E(g.reader)+'</b><div class="mini">'+E(g.rewaya)+'</div></div><button type="button" class="dlBtn" data-open-reader="'+E(g.rid)+'">'+ic('folder')+' صفحة القارئ</button></div>';
      for(var ii=0;ii<g.items.length;ii++){var it=g.items[ii];
        h+='<div class="dlRow" data-key="'+E(it.key)+'"><div class="dlInfo"><b>'+E(it.surah)+'</b><small>'+E(g.reader)+(g.rewaya?' • '+E(g.rewaya):'')+'</small></div><div class="dlActs"><button type="button" class="dlBtn primary" data-open="'+E(it.rid)+'|'+it.n+'">'+ic('folder')+' فتح</button><button type="button" class="dlBtn danger" data-del="'+E(it.key)+'">'+ic('trash')+' حذف</button></div></div>';
      }
      h+='</div>';
    }
  }
  /* الرقية والأذكار والأدعية (سجل V103) */
  var reg={};try{reg=JSON.parse(LG('muslim-v103-dlreg','{}'))||{}}catch(e){}
  var rk=Object.keys(reg).sort(function(a,b){return reg[b].at-reg[a].at});
  if(rk.length){
    h+='<div class="dlHead">'+ic('sparkle')+' <b>الأذكار والرقية المحمّلة</b><span class="mini">'+rk.length+'</span></div><div class="card dlGroup">';
    rk.forEach(function(k){var r=reg[k];var rq=/رقية/.test(r.kind||'');
      h+='<div class="dlRow" data-reg="'+E(k)+'"><div class="dlInfo"><b>'+E(r.label)+'</b><small>'+E(r.kind||'')+'</small></div><div class="dlActs"><button type="button" class="dlBtn primary" data-go="'+(rq?'ruqyah':'adhkar')+'">'+ic('folder')+' فتح</button><button type="button" class="dlBtn danger" data-delreg="'+E(k)+'">'+ic('trash')+' حذف</button></div></div>'});
    h+='</div>';
  }
  /* ملفات (صور QR…) */
  var files=[];try{var c=await caches.open('muslim-files-v1');files=await c.keys()}catch(e){}
  if(files.length){
    h+='<div class="dlHead">'+ic('folder')+' <b>ملفات محفوظة</b></div><div class="card dlGroup">';
    files.forEach(function(rq){var nm=decodeURIComponent(rq.url.split('/').pop());h+='<div class="dlRow"><div class="dlInfo"><b>'+E(nm.replace(/\.png$/i,'')==='Muslim-QR'?'صورة رمز QR للتطبيق':nm)+'</b></div><div class="dlActs"><button type="button" class="dlBtn danger" data-delfile="'+E(rq.url)+'">'+ic('trash')+' حذف</button></div></div>'});
    h+='</div>';
  }
  box.innerHTML=h||'<div class="card detailHero" style="text-align:center">'+ic('download','vi-big')+'<h3>لا توجد تنزيلات بعد</h3><p class="mini">افتح أي قارئ واضغط «تحميل» بجانب السورة، فتظهر هنا وتعمل بلا إنترنت.</p><button type="button" class="primary" onclick="show(\'readers\')">'+ic('headphones')+' تصفّح القرّاء</button></div>';
  /* معلومات التخزين */
  var info=$('v103DlInfo');
  if(info){var q='';try{var e=await navigator.storage.estimate();q='المستخدم ≈ '+fmt(e.usage)+' من '+fmt(e.quota)}catch(x){}
    var p=false;try{p=await navigator.storage.persisted()}catch(x){}
    info.innerHTML=ic(p?'lock':'info')+' '+(p?'التخزين الدائم مفعّل — لن يمسح المتصفح تنزيلاتك تلقائيًا. ':'قد يمسح المتصفح التنزيلات عند امتلاء الجهاز؛ ثبّت التطبيق لتأمينها. ')+q}
  box.onclick=async function(ev){
    var b=ev.target.closest('button');if(!b)return;
    if(b.dataset.openReader){v106OpenReader(b.dataset.openReader)}
    else if(b.dataset.open){var p=b.dataset.open.split('|');v106OpenReader(p[0],+p[1])}
    else if(b.dataset.del){if(!confirm('حذف هذا التنزيل من الجهاز؟'))return;var k=b.dataset.del;try{await idbDel(k);localStorage.removeItem(k);localStorage.removeItem(META+k)}catch(e){}v106RenderDownloads()}
    else if(b.dataset.go){show(b.dataset.go)}
    else if(b.dataset.delreg){var rg=JSON.parse(LG('muslim-v103-dlreg','{}'));var r=rg[b.dataset.delreg];if(r){try{var c=await caches.open('muslim-audio-v1');for(var u of (r.urls||[]))for(var x of u)await c.delete(x)}catch(e){}delete rg[b.dataset.delreg];LS_('muslim-v103-dlreg',JSON.stringify(rg))}v106RenderDownloads()}
    else if(b.dataset.delfile){try{var c2=await caches.open('muslim-files-v1');await c2.delete(b.dataset.delfile)}catch(e){}v106RenderDownloads()}
  };
};

purgeOld();
function init(){
  loadRec();
  refreshDL();
  window.addEventListener('online',function(){loadRec(false)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
/* =====================================================================
   V106 — 3) المساجد القريبة (إعادة بناء كاملة)
   - طلب الموقع على مرحلتين (دقيق ثم تقريبي) + إدخال مدينة يدويًا كبديل.
   - Overpass: نطلب من عدة خوادم بالتوازي ونأخذ أول استجابة سليمة (Promise.any) ثم نُلغي الباقي.
   - توسيع النطاق تلقائيًا إن لم نجد شيئًا، وحفظ آخر نتيجة لعرضها بلا إنترنت.
   - رادار SVG بلا مكتبات ولا بلاطات خرائط (خفيف على الجوال).
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
var LS_=function(k,v){try{localStorage.setItem(k,v)}catch(e){}};
var ic=function(n,c){return window.v106Icon?window.v106Icon(n,c):''};
var EPS=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://overpass.private.coffee/api/interpreter','https://overpass.openstreetmap.fr/api/interpreter'];
var RADII=[1,3,5,10,25];
var st={type:LG('muslimMosqueType','mosques')==='women'?'women':'mosques',rad:+LG('muslim-v106-mrad','5')||5,pos:null,items:[],seq:0,busy:false};
if(RADII.indexOf(st.rad)<0)st.rad=5;

/* ---------- حسابات ---------- */
var R=Math.PI/180;
function hav(a,b,c,d){var x=Math.sin((c-a)*R/2)*Math.sin((c-a)*R/2)+Math.cos(a*R)*Math.cos(c*R)*Math.sin((d-b)*R/2)*Math.sin((d-b)*R/2);return 12742*Math.asin(Math.sqrt(x))}
function bearing(a,b,c,d){var y=Math.sin((d-b)*R)*Math.cos(c*R),x=Math.cos(a*R)*Math.sin(c*R)-Math.sin(a*R)*Math.cos(c*R)*Math.cos((d-b)*R);return (Math.atan2(y,x)/R+360)%360}
var DIRS=['شمالًا','شمال شرق','شرقًا','جنوب شرق','جنوبًا','جنوب غرب','غربًا','شمال غرب'];
function dirName(b){return DIRS[Math.round(b/45)%8]}
function fmtD(k){return k<1?Math.round(k*1000/10)*10+' م':(k<10?k.toFixed(1):Math.round(k))+' كم'}
function walk(k){var m=Math.round(k/0.08);return m<60?m+' دقيقة مشيًا':'≈ '+Math.round(m/60*10)/10+' ساعة مشيًا'}

/* ---------- تحليل نتائج Overpass ---------- */
function isWomen(t){
  var v=[t.female,t.women,t['female:access'],t['female:only'],t.gender].map(function(x){return String(x||'').toLowerCase()});
  if(v.some(function(x){return x==='yes'||x==='only'||x==='female'||x==='women'}))return true;
  var tx=[t.name,t['name:ar'],t['name:en'],t.description,t['description:ar'],t.note].join(' ').toLowerCase();
  return /مصلى\s*(ال)?نساء|مصلى\s*(ال)?سيدات|مصلى\s*النساء|للنساء|للسيدات|نسائي|women|ladies|female|sisters/.test(tx);
}
function pickName(t){
  var ks=['name:ar','name','alt_name:ar','alt_name','official_name:ar','official_name','short_name:ar','loc_name:ar','name:en','int_name'];
  for(var i=0;i<ks.length;i++){if(t[ks[i]]){return String(t[ks[i]]).slice(0,80)}}
  return '';
}
function parse(els,lat,lon){
  var out=[];
  (els||[]).forEach(function(e){
    var la=e.lat!=null?e.lat:(e.center&&e.center.lat),lo=e.lon!=null?e.lon:(e.center&&e.center.lon);
    if(la==null||lo==null)return;
    var t=e.tags||{};
    var musalla=/musalla|prayer_room/i.test((t.building||'')+' '+(t.amenity||''))||/مصلى|مصلّى|musalla/i.test(t.name||t['name:ar']||'');
    var d=hav(lat,lon,la,lo);
    out.push({id:e.type+e.id,lat:la,lon:lo,d:d,b:bearing(lat,lon,la,lo),name:pickName(t),women:isWomen(t),musalla:musalla,
      note:[t.denomination&&('المذهب: '+t.denomination),t.opening_hours&&('الدوام: '+t.opening_hours),t['addr:street']&&('الشارع: '+t['addr:street'])].filter(Boolean).join(' • ').slice(0,160)});
  });
  out.sort(function(a,b){return a.d-b.d});
  /* إزالة المكرّر: نفس الاسم وعلى بعد أقل من 60 م */
  var res=[];out.forEach(function(x){if(!res.some(function(y){return (y.name||'#')===(x.name||'#')&&hav(y.lat,y.lon,x.lat,x.lon)<0.06}))res.push(x)});
  return res;
}
function query(lat,lon,rM){
  var a='(around:'+Math.round(rM)+','+lat.toFixed(5)+','+lon.toFixed(5)+')';
  return '[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"]'+a+';way["amenity"="place_of_worship"]["religion"="muslim"]'+a+';relation["amenity"="place_of_worship"]["religion"="muslim"]'+a+';node["building"="mosque"]'+a+';way["building"="mosque"]'+a+';node["amenity"="prayer_room"]'+a+';);out center tags 150;';
}
function ovp(q,signal){
  return Promise.any(EPS.map(function(ep){
    var ctl=new AbortController();
    signal.addEventListener('abort',function(){ctl.abort()});
    var t=setTimeout(function(){ctl.abort()},22000);
    return fetch(ep,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:ctl.signal})
      .then(function(r){clearTimeout(t);if(!r.ok)throw new Error('http '+r.status);return r.json()})
      .then(function(j){if(!j||!Array.isArray(j.elements))throw new Error('bad');return j.elements});
  }));
}

/* ---------- الموقع ---------- */
function gps(){
  return new Promise(function(res,rej){
    if(!navigator.geolocation)return rej({code:0});
    var fin=false;
    function ok(p){if(fin)return;fin=true;res(p)}
    navigator.geolocation.getCurrentPosition(ok,function(e1){
      if(e1&&e1.code===1){fin=true;return rej(e1)}
      navigator.geolocation.getCurrentPosition(ok,function(e2){if(!fin){fin=true;rej(e2||e1)}},{enableHighAccuracy:false,timeout:15000,maximumAge:600000});
    },{enableHighAccuracy:true,timeout:9000,maximumAge:60000});
  });
}
function geocode(q){
  return fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=ar&q='+encodeURIComponent(q)).then(function(r){return r.json()}).then(function(j){
    if(!j||!j[0])throw new Error('nf');return {lat:+j[0].lat,lon:+j[0].lon,label:String(j[0].display_name||q).split(',').slice(0,2).join('،')};
  });
}

/* ---------- الواجهة ---------- */
function status(h,cls){var s=$('m6Status');if(s){s.className='notice '+(cls||'');s.innerHTML=h}}
function ui(){
  var sec=$('mosques');if(!sec||sec.getAttribute('data-v106'))return;
  sec.setAttribute('data-v106','1');
  var head=sec.querySelector('.section');
  var title=head?head.outerHTML:'';
  sec.innerHTML=title+
   '<div class="card m6Card">'+
   '<div class="m6Seg" role="tablist" aria-label="نوع المكان"><button type="button" role="tab" data-t="mosques">'+ic('mosque')+' المساجد</button><button type="button" role="tab" data-t="women">'+ic('heart')+' مصليات النساء</button></div>'+
   '<div class="m6Label">النطاق</div><div class="m6Chips" id="m6Rad" role="group" aria-label="نطاق البحث">'+RADII.map(function(r){return '<button type="button" data-r="'+r+'">'+r+' كم</button>'}).join('')+'</div>'+
   '<button type="button" class="primary m6Go" id="m6Go">'+ic('pin')+' <span>ابحث عن أقرب مسجد</span></button>'+
   '<div class="m6Manual"><input id="m6City" class="field" placeholder="أو اكتب اسم الحي / المدينة" autocomplete="off" maxlength="80" aria-label="اسم المدينة"><button type="button" id="m6CityGo" aria-label="بحث">'+ic('search')+'</button></div>'+
   '<div id="m6Status" class="notice" role="status" aria-live="polite">اضغط «ابحث» ليحدّد التطبيق موقعك مرة واحدة فقط ويعرض المساجد القريبة. لا يُرسَل موقعك لأي خادم غير خدمة الخرائط المفتوحة.</div></div>'+
   '<div id="m6Radar" class="card m6RadarCard" hidden></div><div id="m6List" aria-live="polite"></div>';
  sec.querySelector('.m6Seg').addEventListener('click',function(e){var b=e.target.closest('button');if(b)setType(b.dataset.t)});
  $('m6Rad').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;st.rad=+b.dataset.r;LS_('muslim-v106-mrad',st.rad);mark();if(st.pos)search(true)});
  $('m6Go').addEventListener('click',function(){find()});
  $('m6CityGo').addEventListener('click',byCity);
  $('m6City').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();byCity()}});
  $('m6List').addEventListener('click',onList);
  mark();
}
function mark(){
  document.querySelectorAll('#mosques .m6Seg button').forEach(function(b){var on=b.dataset.t===st.type;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  document.querySelectorAll('#m6Rad button').forEach(function(b){b.classList.toggle('on',+b.dataset.r===st.rad)});
}
function setType(t){st.type=t==='women'?'women':'mosques';LS_('muslimMosqueType',st.type);mark();draw()}
function onList(e){
  var b=e.target.closest('button,a');if(!b)return;
  if(b.dataset.share){
    var la=b.dataset.la,lo=b.dataset.lo,u='https://www.google.com/maps?q='+la+','+lo,nm=b.dataset.n||'مسجد';
    if(navigator.share)navigator.share({title:nm,text:nm,url:u}).catch(function(){});
    else if(navigator.clipboard)navigator.clipboard.writeText(u).then(function(){b.textContent='تم نسخ الرابط'});
  }
}
function visible(){
  return st.items.filter(function(x){return st.type==='women'?x.women:true});
}
function radar(list){
  var box=$('m6Radar');if(!box)return;
  if(!list.length){box.hidden=true;return}
  var max=Math.max(0.5,Math.min(st.rad,list[Math.min(list.length,12)-1].d*1.15));
  var s='<svg viewBox="-100 -100 200 200" class="m6Svg" role="img" aria-label="رادار المساجد القريبة"><circle r="92" class="rg"/><circle r="61" class="rg"/><circle r="30" class="rg"/><path d="M-92 0H92M0-92V92" class="rg"/>'+
   '<text x="0" y="-94" class="rt">ش</text><text x="95" y="3" class="rt">شرق</text><text x="0" y="101" class="rt">ج</text><text x="-95" y="3" class="rt">غرب</text><circle r="4.5" class="me"/>';
  list.slice(0,12).forEach(function(x,i){
    var r=Math.min(1,x.d/max)*88,a=x.b*R;
    s+='<circle cx="'+(Math.sin(a)*r).toFixed(1)+'" cy="'+(-Math.cos(a)*r).toFixed(1)+'" r="'+(i===0?5.5:3.6)+'" class="'+(i===0?'dot near':'dot')+'"><title>'+E(x.name||'مسجد')+' — '+fmtD(x.d)+'</title></circle>';
  });
  box.innerHTML='<div class="m6RadarIn">'+s+'</svg><div class="m6Legend"><span><i class="me"></i> أنت</span><span><i class="dot near"></i> الأقرب</span><span><i class="dot"></i> مساجد</span><small>الدائرة الكبرى ≈ '+fmtD(max)+'</small></div></div>';
  box.hidden=false;
}
function draw(note){
  var host=$('m6List');if(!host)return;
  var list=visible();radar(list);
  if(!st.items.length){host.innerHTML='';return}
  if(!list.length){
    host.innerHTML='<div class="notice">لم نجد مصلى نساء موسومًا في الخرائط ضمن هذا النطاق. أغلب المساجد فيها قسم للنساء لكن بيانات الخرائط المفتوحة نادرًا ما تذكر ذلك — <button type="button" class="primary" id="m6All">اعرض كل المساجد</button></div>';
    var b=$('m6All');if(b)b.onclick=function(){setType('mosques')};return;
  }
  host.innerHTML=(note||'')+list.slice(0,80).map(function(x,i){
    var nm=x.name||(x.musalla?'مصلى':'مسجد')+' (بلا اسم مسجّل)';
    var dir='https://www.google.com/maps/dir/?api=1&destination='+x.lat+','+x.lon+'&travelmode=walking';
    var map='https://www.openstreetmap.org/?mlat='+x.lat+'&mlon='+x.lon+'#map=18/'+x.lat+'/'+x.lon;
    return '<article class="card m6Item'+(i===0?' near':'')+'"><div class="m6Top"><span class="m6Ic">'+ic(x.women?'heart':'mosque')+'</span><div class="m6Nm"><b>'+E(nm)+'</b>'+
      '<div class="mini">'+(i===0?'<span class="m6Tag">الأقرب</span> ':'')+(x.women?'<span class="m6Tag w">مصلى نساء</span> ':'')+(x.musalla?'<span class="m6Tag">مصلى</span> ':'')+E(dirName(x.b))+' • '+walk(x.d)+'</div></div><div class="m6Dist">'+fmtD(x.d)+'</div></div>'+
      (x.note?'<div class="mini m6Note">'+E(x.note)+'</div>':'')+
      '<div class="m6Acts"><a class="m6Btn primary" href="'+dir+'" target="_blank" rel="noopener noreferrer">'+ic('nav')+' اتجاهات</a><a class="m6Btn" href="'+map+'" target="_blank" rel="noopener noreferrer">'+ic('pin')+' الخريطة</a><button type="button" class="m6Btn" data-share="1" data-la="'+x.lat+'" data-lo="'+x.lon+'" data-n="'+E(nm)+'">'+ic('share')+' مشاركة</button></div></article>';
  }).join('');
}

/* ---------- البحث ---------- */
var ctlMain=null;
function key(lat,lon){return 'muslim-v106-m:'+lat.toFixed(2)+','+lon.toFixed(2)}
function saveCache(lat,lon,items,rad){LS_(key(lat,lon),JSON.stringify({t:Date.now(),rad:rad,lat:lat,lon:lon,items:items.slice(0,120).map(function(x){return [x.id,x.lat,x.lon,x.name,x.women?1:0,x.musalla?1:0,x.note]})}));LS_('muslim-v106-mlast',JSON.stringify({lat:lat,lon:lon}))}
function loadCache(lat,lon){
  try{var j=JSON.parse(LG(key(lat,lon),'null'));if(!j)return null;
    return {t:j.t,rad:j.rad,items:j.items.map(function(a){var d=hav(lat,lon,a[1],a[2]);return {id:a[0],lat:a[1],lon:a[2],name:a[3],women:!!a[4],musalla:!!a[5],note:a[6]||'',d:d,b:bearing(lat,lon,a[1],a[2])}}).sort(function(a,b){return a.d-b.d})}}catch(e){return null}
}
async function search(reuse){
  if(!st.pos)return;
  var seq=++st.seq;if(ctlMain)ctlMain.abort();ctlMain=new AbortController();
  var lat=st.pos.lat,lon=st.pos.lon,btn=$('m6Go');
  var cached=loadCache(lat,lon);
  if(cached&&(!navigator.onLine||Date.now()-cached.t<10*60e3)&&cached.rad>=st.rad){
    st.items=cached.items;draw();status(ic('checkc')+' '+(navigator.onLine?'نتائج حديثة محفوظة':'عرض آخر نتائج محفوظة (بلا إنترنت)')+' — '+visible().length+' مكان ضمن '+fmtD(st.rad),'ok');return;
  }
  if(!navigator.onLine){
    if(cached){st.items=cached.items;draw();status(ic('wifioff')+' لا يوجد اتصال — نعرض آخر نتائج محفوظة لهذه المنطقة.','warn')}
    else status(ic('wifioff')+' لا يوجد اتصال بالإنترنت، ولا توجد نتائج محفوظة لهذه المنطقة.','warn');
    return;
  }
  st.busy=true;if(btn)btn.disabled=true;
  var radii=RADII.filter(function(r){return r>=st.rad}),found=null,usedR=st.rad,lastErr=null;
  for(var i=0;i<radii.length;i++){
    if(seq!==st.seq)return;
    usedR=radii[i];
    status(ic('loader','vi-spin')+' أبحث ضمن '+usedR+' كم…'+(i?' (وسّعت النطاق لأنني لم أجد شيئًا)':''));
    try{
      var els=await ovp(query(lat,lon,usedR*1000),ctlMain.signal);
      if(seq!==st.seq)return;
      var items=parse(els,lat,lon);
      found=items;
      var need=st.type==='women'?items.filter(function(x){return x.women}):items;
      if(need.length)break;
    }catch(e){lastErr=e;if(seq!==st.seq)return;break}
  }
  st.busy=false;if(btn)btn.disabled=false;
  if(found){
    st.items=found;saveCache(lat,lon,found,usedR);draw();
    var n=visible().length;
    status(n?ic('checkc')+' وجدنا '+n+' '+(st.type==='women'?'مصلى نساء':'مكانًا')+' ضمن '+usedR+' كم'+(st.pos.acc>1000?' — دقة موقعك ضعيفة (≈ '+(st.pos.acc/1000).toFixed(1)+' كم)، فعّل «الموقع الدقيق».':''):'لم نجد نتائج ضمن '+usedR+' كم. جرّب نطاقًا أكبر أو اكتب اسم مدينتك.',n?'ok':'warn');
  }else{
    var c2=loadCache(lat,lon);
    if(c2){st.items=c2.items;draw();status(ic('alert')+' تعذّر الوصول لخدمة الخرائط الآن، نعرض آخر نتائج محفوظة. <button type="button" class="primary" id="m6Retry">إعادة المحاولة</button>','warn')}
    else status(ic('alert')+' تعذّر الوصول لخدمة الخرائط (قد تكون مشغولة أو محجوبة على شبكتك). <button type="button" class="primary" id="m6Retry">إعادة المحاولة</button>','warn');
    var rb=$('m6Retry');if(rb)rb.onclick=function(){search(true)};
  }
}
async function find(){
  ui();
  var btn=$('m6Go');if(btn)btn.disabled=true;
  status(ic('loader','vi-spin')+' أحدّد موقعك… اسمح للموقع عند ظهور الطلب.');
  try{
    var p=await gps();
    st.pos={lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy||0};
    LS_('muslim-v106-mlast',JSON.stringify({lat:st.pos.lat,lon:st.pos.lon}));
  }catch(e){
    if(btn)btn.disabled=false;
    var msg=e&&e.code===1?'لم يُسمح بالوصول للموقع. فعّله من إعدادات المتصفح للموقع، أو اكتب اسم مدينتك بالأسفل.':e&&e.code===3?'انتهت مهلة تحديد الموقع. اخرج لمكان مفتوح أو اكتب اسم مدينتك.':'تعذّر تحديد موقعك. اكتب اسم مدينتك بالأسفل.';
    status(ic('alert')+' '+msg,'warn');return;
  }
  if(btn)btn.disabled=false;
  return search();
}
async function byCity(){
  var v=($('m6City')||{}).value||'';v=v.trim();if(v.length<2){status('اكتب اسم الحي أو المدينة (حرفان على الأقل).','warn');return}
  if(!navigator.onLine){status(ic('wifioff')+' البحث بالاسم يحتاج إنترنت.','warn');return}
  status(ic('loader','vi-spin')+' أبحث عن «'+E(v)+'»…');
  try{var g=await geocode(v);st.pos={lat:g.lat,lon:g.lon,acc:0};search()}
  catch(e){status(ic('alert')+' لم أجد هذا المكان. جرّب كتابة المدينة والدولة.','warn')}
}
function init(){
  ui();mark();
  /* عرض آخر نتائج محفوظة فورًا إن وُجدت */
  try{var l=JSON.parse(LG('muslim-v106-mlast','null'));if(l){var c=loadCache(l.lat,l.lon);if(c&&c.items.length){st.pos={lat:l.lat,lon:l.lon,acc:0};st.items=c.items;draw();status('آخر نتائج محفوظة'+(navigator.onLine?'':' (بلا إنترنت)')+' — اضغط «ابحث» لتحديث موقعك.')}}}catch(e){}
}
window.findMosques=find;
window.setMosqueType=setType;
window.initNearbyMosques=init;
window.refreshLiveLocation=window.refreshLiveLocation||function(){find()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
})();
/* =====================================================================
   V106 — 4) أعمال اليوم والليلة + التذكيرات والإشعارات
   - قائمة أعمال كاملة (صباح، ضحى، قيام، وتر…) + أعمال يضيفها المستخدم.
   - لكل عمل: تفعيل التذكير / وقت التذكير / أيام العمل / إنجاز اليوم / سلسلة الأيام.
   - الإشعارات: Notification API عبر Service Worker. التذكير يعمل والتطبيق مفتوح أو
     مُثبَّت (Periodic Sync حيث يدعمه المتصفح). الإشعار الدقيق والتطبيق مغلق تمامًا
     يحتاج خادم Push، وهذا غير ممكن في استضافة ثابتة (GitHub Pages) بدون خادم.
   - كل البيانات محلية على الجهاز (localStorage + Cache) ولا تُرسَل لأي جهة.
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var E=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var ic=function(n,c){return window.v106Icon?window.v106Icon(n,c):''};
if(window.v106Icons&&!window.v106Icons.plus)window.v106Icons.plus='<path d="M12 5v14M5 12h14"/>';
var KEY='muslim-v106-deeds',MAXC=30;
/* days: null = كل يوم، وإلا مصفوفة من getDay() (0 = الأحد) */
var BASE=[
 {id:'qiyam',t:'قيام الليل',d:'ركعات في الثلث الأخير — وقت دعاء واستغفار',time:'03:30',ic:'moon',go:"show('adhkar')"},
 {id:'fajr-adhkar',t:'أذكار الصباح',d:'تحصين اليوم بالذكر بعد الفجر',time:'05:30',ic:'sunrise',go:"show('adhkar');setTimeout(function(){window.renderAdhkar&&renderAdhkar('صباح')},80)"},
 {id:'duha',t:'صلاة الضحى',d:'ركعتان فأكثر بعد ارتفاع الشمس',time:'09:30',ic:'sun',go:"show('adhkar')"},
 {id:'wird',t:'ورد القرآن',d:'تلاوة أو استماع لوردك اليومي',time:'20:00',ic:'book',go:"show('quran')"},
 {id:'istighfar',t:'الاستغفار والتسبيح',d:'مئة مرة أو ما تيسّر',time:'12:30',ic:'sparkle',go:"show('adhkar')"},
 {id:'sadaqa',t:'صدقة اليوم',d:'ولو بالقليل — صدقة تُطفئ الخطيئة',time:'10:30',ic:'heart',go:null},
 {id:'asr-adhkar',t:'أذكار المساء',d:'تحصين المساء بعد العصر',time:'17:00',ic:'sunset',go:"show('adhkar');setTimeout(function(){window.renderAdhkar&&renderAdhkar('مساء')},80)"},
 {id:'tadabbur',t:'تدبّر آية',d:'اقرأ آية وتأمّل معناها دقيقة واحدة',time:'21:00',ic:'leaf',go:"show('quran')"},
 {id:'mulk',t:'سورة الملك',d:'قبل النوم',time:'22:00',ic:'book',go:"show('quran');setTimeout(function(){window.openSurahDetail&&openSurahDetail(67)},120)"},
 {id:'sleep-adhkar',t:'أذكار النوم',d:'اختم يومك بالذكر على طهارة',time:'22:15',ic:'moon',go:"show('adhkar')"},
 {id:'witr',t:'صلاة الوتر',d:'اجعل آخر صلاتك بالليل وترًا',time:'22:30',ic:'star',go:null},
 {id:'muhasaba',t:'محاسبة النفس',d:'دقيقة تراجع فيها يومك وتجدّد النية',time:'22:45',ic:'target',go:null},
 {id:'kahf',t:'سورة الكهف',d:'من أعمال يوم الجمعة',time:'10:00',ic:'book',days:[5],go:"show('quran');setTimeout(function(){window.openSurahDetail&&openSurahDetail(18)},120)"},
 {id:'salawat',t:'الإكثار من الصلاة على النبي ﷺ',d:'يوم الجمعة',time:'14:00',ic:'heart',days:[5],go:null},
 {id:'fast-eve',t:'تذكير صيام الاثنين والخميس',d:'مساء الأحد والأربعاء',time:'19:30',ic:'calendar',days:[0,3],go:null},
 {id:'silat',t:'صلة الرحم',d:'اتصال أو رسالة لقريب لم تسأل عنه',time:'18:00',ic:'phone',days:[6],go:null}
];
var DAYN=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
function load(){try{var j=JSON.parse(localStorage.getItem(KEY)||'null');if(j&&typeof j==='object')return {prefs:j.prefs||{},custom:Array.isArray(j.custom)?j.custom:[],done:j.done||{},master:j.master!==false,fired:j.fired||{}}}catch(e){}return {prefs:{},custom:[],done:{},master:true,fired:{}}}
var S=load();
function save(){
  /* تقليم سجلّ الإنجاز لآخر 60 يومًا */
  var ks=Object.keys(S.done).sort();while(ks.length>60){delete S.done[ks.shift()]}
  var fk=Object.keys(S.fired).sort();while(fk.length>40){delete S.fired[fk.shift()]}
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  pushConfig();
}
function today(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function all(){return BASE.concat(S.custom.map(function(c){return {id:c.id,t:c.t,d:c.d||'عمل أضفته أنت',time:c.time,ic:'star',days:c.days&&c.days.length&&c.days.length<7?c.days:null,go:null,custom:1}}))}
var DEF_ON=['fajr-adhkar','asr-adhkar','sleep-adhkar','wird','kahf'];
function pref(d){var p=S.prefs[d.id]||{};return {on:p.on===undefined?DEF_ON.indexOf(d.id)>=0:!!p.on,time:/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time||'')?p.time:d.time}}
function appliesToday(d,day){return !d.days||d.days.indexOf(day)>=0}
function isDone(id,k){return (S.done[k||today()]||[]).indexOf(id)>=0}
function toggleDone(id){var k=today(),a=S.done[k]=S.done[k]||[],i=a.indexOf(id);if(i>=0)a.splice(i,1);else a.push(id);if(!a.length)delete S.done[k];save()}
function streak(){
  /* عدد الأيام المتتالية التي أُنجز فيها عمل واحد على الأقل (اليوم يُحتسب إن أُنجز، وإلا يبدأ العدّ من أمس) */
  var n=0,d=new Date();if(!S.done[today(d)])d.setDate(d.getDate()-1);
  for(;;){if(S.done[today(d)]&&S.done[today(d)].length){n++;d.setDate(d.getDate()-1)}else break}
  return n;
}
function week(){var out=[],d=new Date();for(var i=6;i>=0;i--){var x=new Date(d);x.setDate(d.getDate()-i);out.push({k:today(x),n:(S.done[today(x)]||[]).length,dn:DAYN[x.getDay()].slice(0,3)})}return out}
function fmt(t){var p=t.split(':'),h=+p[0],m=p[1],ap=h>=12?'م':'ص';h=h%12||12;return h+':'+m+' '+ap}

/* ---------- إرسال الإعداد للـ Service Worker (للتذكير الخلفي حيث يُدعم) ---------- */
function pushConfig(){
  try{
    var list=all().map(function(d){var p=pref(d);return p.on&&S.master?{id:d.id,t:d.t,b:d.d,time:p.time,days:d.days||null}:null}).filter(Boolean);
    var body=JSON.stringify({v:1,list:list,fired:S.fired});
    if(window.caches)caches.open('muslim-config-v1').then(function(c){return c.put('./__reminders.json',new Response(body,{headers:{'Content-Type':'application/json'}}))}).catch(function(){});
    if(navigator.serviceWorker&&navigator.serviceWorker.controller)navigator.serviceWorker.controller.postMessage({type:'reminders-updated'});
  }catch(e){}
}
function regPeriodic(){
  try{navigator.serviceWorker.ready.then(function(r){
    if(r.periodicSync&&navigator.permissions){
      navigator.permissions.query({name:'periodic-background-sync'}).then(function(p){if(p.state==='granted')r.periodicSync.register('muslim-reminders',{minInterval:15*60*1000}).catch(function(){})}).catch(function(){});
    }
  })}catch(e){}
}

/* ---------- الإشعارات ---------- */
function perm(){return ('Notification' in window)?Notification.permission:'unsupported'}
function notify(title,body,tag){
  if(perm()!=='granted')return Promise.resolve(false);
  var opts={body:body||'',tag:tag||'muslim',icon:'./icon-192.png',badge:'./icon-192.png',lang:'ar',dir:'rtl',data:{open:'daily'},renotify:false};
  if(navigator.serviceWorker&&navigator.serviceWorker.ready){
    return navigator.serviceWorker.ready.then(function(r){return r.showNotification(title,opts)}).then(function(){return true}).catch(function(){try{new Notification(title,opts);return true}catch(e){return false}});
  }
  try{new Notification(title,opts);return Promise.resolve(true)}catch(e){return Promise.resolve(false)}
}
function ask(){
  if(!('Notification' in window)){toast('متصفحك لا يدعم الإشعارات.');return Promise.resolve('unsupported')}
  if(Notification.permission==='denied'){toast('الإشعارات محظورة. فعّلها من إعدادات المتصفح للموقع ثم أعد المحاولة.');return Promise.resolve('denied')}
  return Notification.requestPermission().then(function(r){regPeriodic();pushConfig();renderSettings();return r});
}
function toast(m){try{window.showToast?window.showToast(m):alert(m)}catch(e){}}

/* ---------- مجدول أثناء فتح التطبيق ---------- */
var timer=null;
function dueNow(since){
  /* الأعمال التي حان وقتها بين since و الآن (حتى ساعتين) ولم يُرسل لها إشعار اليوم */
  var now=new Date(),day=now.getDay(),k=today(now),out=[];
  all().forEach(function(d){
    var p=pref(d);if(!p.on||!appliesToday(d,day))return;
    var hm=p.time.split(':'),at=new Date(now.getFullYear(),now.getMonth(),now.getDate(),+hm[0],+hm[1],0).getTime();
    if(at<=now.getTime()&&at>=Math.max(since,now.getTime()-2*3600e3)&&S.fired[d.id]!==k&&!isDone(d.id))out.push(d);
  });
  return out;
}
function tick(){
  if(timer){clearTimeout(timer);timer=null}
  if(!S.master)return;
  var last=+(localStorage.getItem('muslim-v106-lasttick')||0)||Date.now()-5*60e3;
  var due=dueNow(last);
  due.forEach(function(d){S.fired[d.id]=today();notify('حان وقت: '+d.t,d.d,'deed-'+d.id)});
  if(due.length)save();
  try{localStorage.setItem('muslim-v106-lasttick',Date.now())}catch(e){}
  /* أقرب موعد قادم */
  var now=new Date(),nxt=Infinity;
  all().forEach(function(d){var p=pref(d);if(!p.on||!appliesToday(d,now.getDay()))return;var hm=p.time.split(':'),at=new Date(now.getFullYear(),now.getMonth(),now.getDate(),+hm[0],+hm[1],0).getTime();if(at>now.getTime()&&at<nxt)nxt=at});
  var wait=Math.min(nxt-Date.now(),30*60e3);if(!isFinite(wait))wait=30*60e3;
  timer=setTimeout(tick,Math.max(wait+500,15000));
}

/* ---------- صفحة أعمال اليوم ---------- */
function renderDaily(){
  var box=$('dailyList');if(!box)return;
  var now=new Date(),day=now.getDay(),k=today(now),h=now.getHours();
  var list=all().filter(function(d){return appliesToday(d,day)}).sort(function(a,b){return pref(a).time<pref(b).time?-1:1});
  var done=list.filter(function(d){return isDone(d.id,k)}).length,pct=list.length?Math.round(done/list.length*100):0,st=streak(),wk=week(),mx=Math.max(1,Math.max.apply(null,wk.map(function(x){return x.n})));
  var cur=h<5?'قيام':h<11?'صباح':h<15?'ظهر':h<18?'عصر':'مساء';
  var head='<div class="card v6Sum"><div class="v6Ring" style="--p:'+pct+'" role="img" aria-label="'+pct+'٪ من أعمال اليوم"><b>'+pct+'٪</b></div><div class="v6SumTx"><b>'+done+' من '+list.length+' أعمال اليوم</b><small>'+ic('trophy')+' سلسلة '+st+' '+(st===1?'يوم':'أيام')+' متتالية</small></div><div class="v6Wk" aria-label="إنجازك آخر 7 أيام">'+wk.map(function(x){return '<span title="'+E(x.dn)+': '+x.n+'"><i style="height:'+(8+Math.round(x.n/mx*30))+'px" class="'+(x.n?'on':'')+'"></i><em>'+E(x.dn)+'</em></span>'}).join('')+'</div></div>';
  var notif=perm()==='granted'?'':'<div class="notice warn v6Notice">'+ic('bell')+' فعّل الإشعارات ليذكّرك التطبيق بأعمالك. <button type="button" class="primary" data-v6="ask">تفعيل الإشعارات</button></div>';
  var rows=list.map(function(d){
    var p=pref(d),dn=isDone(d.id,k);
    return '<div class="card dailyCard v6Row'+(dn?' done':'')+'" data-id="'+E(d.id)+'"><button type="button" class="v6Chk" data-v6="done" aria-pressed="'+dn+'" aria-label="'+(dn?'إلغاء إنجاز':'تم إنجاز')+' '+E(d.t)+'">'+(dn?ic('checkc'):'<span class="v6Ci"></span>')+'</button>'+
     '<span class="dailyIcon">'+ic(d.ic)+'</span><div class="v6Tx"><h3>'+E(d.t)+'</h3><p class="mini">'+E(d.d)+'</p><small class="timeBadge">'+ic('clock')+' '+fmt(p.time)+(d.days?' • '+d.days.map(function(x){return DAYN[x]}).join('، '):'')+'</small></div>'+
     '<div class="v6Acts">'+(d.go?'<button type="button" class="v6Mini" data-v6="go" aria-label="فتح '+E(d.t)+'">'+ic('book')+'</button>':'')+
     '<button type="button" class="v6Mini'+(p.on?' on':'')+'" data-v6="bell" aria-pressed="'+p.on+'" aria-label="'+(p.on?'إيقاف':'تفعيل')+' التذكير">'+ic('bell')+'</button>'+
     (d.custom?'<button type="button" class="v6Mini" data-v6="del" aria-label="حذف '+E(d.t)+'">'+ic('trash')+'</button>':'')+'</div></div>';
  }).join('');
  box.innerHTML=head+notif+'<div class="mini v6Hint">الوقت الحالي: '+cur+' — الجرس يفعّل/يوقف تذكير العمل، والدائرة لتسجيل إنجازه اليوم.</div>'+rows+
   '<div class="card v6Add"><h3>'+ic('plus')+' أضف عملًا خاصًا بك</h3><div class="v6Form"><input id="v6T" class="field" maxlength="40" placeholder="اسم العمل (مثال: قراءة صفحة من كتاب)" aria-label="اسم العمل" autocomplete="off"><input id="v6Tm" class="field" type="time" value="08:00" aria-label="وقت التذكير"></div><div class="v6Days" role="group" aria-label="أيام العمل">'+DAYN.map(function(n,i){return '<button type="button" class="on" data-d="'+i+'" aria-pressed="true">'+n.slice(0,3)+'</button>'}).join('')+'</div><button type="button" class="primary" data-v6="add">'+ic('plus')+' إضافة</button><div class="mini" id="v6Err" role="alert"></div></div>';
}
function clean(s,n){return String(s||'').replace(/[\u0000-\u001f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,n)}
function add(){
  var t=clean(($('v6T')||{}).value,40),tm=($('v6Tm')||{}).value||'',err=$('v6Err');
  var days=[].slice.call(document.querySelectorAll('.v6Days button.on')).map(function(b){return +b.dataset.d});
  var msg=!t||t.length<2?'اكتب اسم العمل (حرفان على الأقل).':!/^([01]\d|2[0-3]):[0-5]\d$/.test(tm)?'اختر وقتًا صحيحًا.':!days.length?'اختر يومًا واحدًا على الأقل.':S.custom.length>=MAXC?'وصلت للحد الأقصى ('+MAXC+' عملًا).':'';
  if(msg){if(err)err.textContent=msg;return}
  var id='c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
  S.custom.push({id:id,t:t,time:tm,days:days.length===7?null:days});S.prefs[id]={on:true,time:tm};save();
  if(perm()==='default')ask();
  renderDaily();renderSettings();tick();toast('أُضيف «'+t+'» وفُعّل تذكيره.');
}
function del(id){S.custom=S.custom.filter(function(c){return c.id!==id});delete S.prefs[id];delete S.fired[id];Object.keys(S.done).forEach(function(k){S.done[k]=S.done[k].filter(function(x){return x!==id});if(!S.done[k].length)delete S.done[k]});save();renderDaily();renderSettings()}
function setBell(id,on){var d=all().filter(function(x){return x.id===id})[0];if(!d)return;var p=S.prefs[id]=S.prefs[id]||{};p.on=on;p.time=pref(d).time;save();if(on&&perm()==='default')ask();tick()}
function onDaily(e){
  var b=e.target.closest('[data-v6],.v6Days button');if(!b)return;
  if(b.parentNode&&b.parentNode.classList.contains('v6Days')){var on=!b.classList.contains('on');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);return}
  var row=b.closest('[data-id]'),id=row&&row.dataset.id,a=b.dataset.v6;
  if(a==='ask')ask().then(renderDaily);
  else if(a==='add')add();
  else if(a==='done'){toggleDone(id);renderDaily()}
  else if(a==='bell'){var d=all().filter(function(x){return x.id===id})[0];setBell(id,!pref(d).on);renderDaily();renderSettings()}
  else if(a==='del'){if(confirm('حذف هذا العمل؟'))del(id)}
  else if(a==='go'){var d2=all().filter(function(x){return x.id===id})[0];if(d2&&d2.go)try{(new Function(d2.go))()}catch(er){}}
}

/* ---------- إعدادات التذكيرات ---------- */
function renderSettings(){
  var box=$('dailyReminderSettingsBox');if(!box)return;
  var p=perm(),stx=p==='granted'?'<span class="v6Ok">'+ic('checkc')+' الإشعارات مفعّلة</span>':p==='denied'?'<span class="v6No">'+ic('alert')+' محظورة من المتصفح</span>':p==='unsupported'?'<span class="v6No">غير مدعومة في هذا المتصفح</span>':'<button type="button" class="primary" data-s6="ask">'+ic('bell')+' السماح بالإشعارات</button>';
  box.innerHTML='<div class="v6SetTop">'+stx+(p==='granted'?'<button type="button" class="stgBtn" data-s6="test">اختبار إشعار</button>':'')+'</div>'+
   '<label class="v6Master"><input type="checkbox" data-s6="master" '+(S.master?'checked':'')+'> <b>تشغيل كل التذكيرات</b></label>'+
   '<div class="v6Bulk"><button type="button" class="stgBtn" data-s6="allon">تفعيل الكل</button><button type="button" class="stgBtn" data-s6="alloff">إيقاف الكل</button></div>'+
   '<div class="v6SetList">'+all().map(function(d){var q=pref(d);return '<div class="v6SetRow" data-id="'+E(d.id)+'"><label class="v6SetL"><input type="checkbox" data-s6="on" '+(q.on?'checked':'')+' aria-label="تذكير '+E(d.t)+'"><span><b>'+E(d.t)+'</b><small>'+(d.days?d.days.map(function(x){return DAYN[x]}).join('، '):'كل يوم')+'</small></span></label><input type="time" class="field v6Time" data-s6="time" value="'+q.time+'" aria-label="وقت تذكير '+E(d.t)+'"></div>'}).join('')+'</div>'+
   '<p class="mini">التذكير يصلك والتطبيق مفتوح أو مثبَّت على الشاشة الرئيسية. إن أُغلق التطبيق كليًا قد يتأخر الإشعار بحسب نظام جهازك. بياناتك تبقى على جهازك فقط.</p>';
}
function onSettings(e){
  var t=e.target,a=t.getAttribute&&t.getAttribute('data-s6');if(!a){var bb=t.closest&&t.closest('[data-s6]');if(!bb)return;t=bb;a=t.getAttribute('data-s6')}
  var row=t.closest('[data-id]'),id=row&&row.dataset.id;
  if(a==='ask')ask();
  else if(a==='test'&&e.type==='click')notify('تجربة الإشعار','تعمل الإشعارات بنجاح — بارك الله فيك','test').then(function(ok){if(!ok)toast('تعذّر إرسال الإشعار.')});
  else if(a==='master'&&e.type==='change'){S.master=t.checked;save();tick()}
  else if(a==='allon'&&e.type==='click'){all().forEach(function(d){S.prefs[d.id]={on:true,time:pref(d).time}});save();if(perm()==='default')ask();renderSettings();tick()}
  else if(a==='alloff'&&e.type==='click'){all().forEach(function(d){S.prefs[d.id]={on:false,time:pref(d).time}});save();renderSettings()}
  else if(a==='on'&&e.type==='change'){setBell(id,t.checked)}
  else if(a==='time'&&e.type==='change'){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(t.value)){return}var d=all().filter(function(x){return x.id===id})[0];if(!d)return;var q=S.prefs[id]=S.prefs[id]||{on:false};q.time=t.value;delete S.fired[id];save();tick()}
}
/* نُلغي نظام v101 القديم (شريط الإنجاز + أعمالي الخاصة) لأن هذه الوحدة تحلّ محلّه، ونرحّل أعماله المخصّصة مرة واحدة */
window.v101DailyInit=function(){var a=$('v101DailyBar'),b=$('v101Custom');if(a)a.remove();if(b)b.remove()};
window.v101MosquesInit=function(){};
function migrate(){
  try{
    if(localStorage.getItem('muslim-v106-mig'))return;
    var old=JSON.parse(localStorage.getItem('muslim-v101-daily-custom')||'[]');
    if(Array.isArray(old))old.slice(0,MAXC).forEach(function(t){t=clean(t,40);if(t.length<2||S.custom.length>=MAXC)return;var id='c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);S.custom.push({id:id,t:t,time:'08:00',days:null});S.prefs[id]={on:false,time:'08:00'}});
    localStorage.setItem('muslim-v106-mig','1');save();
  }catch(e){}
}
window.renderDaily=renderDaily;
window.renderDailyReminderSettings=renderSettings;
window.saveDailyReminderSettings=function(){renderSettings()};
window.v6Deeds={ask:ask,notify:notify,tick:tick,all:all,state:function(){return S}};

function init(){
  var sb=$('dailyReminderSettingsBox');if(sb&&!sb.getAttribute('data-v6')){sb.setAttribute('data-v6','1');sb.addEventListener('click',onSettings);sb.addEventListener('change',onSettings)}
  var dl=$('dailyList');if(dl&&!dl.getAttribute('data-v6')){dl.setAttribute('data-v6','1');dl.addEventListener('click',onDaily)}
  /* الافتراضي: أذكار الصباح والمساء والنوم وورد القرآن والكهف فقط؛ ولا يصل أي إشعار قبل موافقة المستخدم */
  if(!localStorage.getItem('muslim-v106-deeds-init')){try{localStorage.setItem('muslim-v106-deeds-init','1')}catch(e){}}
  migrate();window.v101DailyInit();renderSettings();renderDaily();pushConfig();regPeriodic();tick();
}
if(navigator.serviceWorker)navigator.serviceWorker.addEventListener('message',function(e){var m=e.data||{};if(m.type==='open'&&m.page&&window.show)try{show(m.page)}catch(er){}});
document.addEventListener('visibilitychange',function(){if(!document.hidden)tick()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
/* =====================================================================
   V106 — 6) الهيكل العام: الشريط السفلي، حالة الصفحة النشطة، وضع الأداء، إخفاء المقدمة
   ===================================================================== */
(function(){
'use strict';
var ic=function(n,c){return window.v106Icon?window.v106Icon(n,c):''};
/* ---- وضع خفيف للأجهزة الضعيفة (أندرويد/ذاكرة قليلة/معالج قليل الأنوية) ---- */
try{
  var ua=navigator.userAgent||'',low=(navigator.deviceMemory&&navigator.deviceMemory<=4)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||/Android/i.test(ua)&&!/Chrome\/(1[2-9]\d)/.test(ua);
  var pref=localStorage.getItem('muslim-v106-lite');
  if(pref==='1'||(pref!=='0'&&low))document.documentElement.classList.add('v6lite');
}catch(e){}
/* ---- الشريط السفلي ---- */
function nav(){
  var m=document.querySelector('.nav .navMain'),s=document.querySelector('.nav .navSettings');
  if(m&&!m.getAttribute('data-v6')){m.setAttribute('data-v6','1');m.innerHTML=ic('home')+'<b>الرئيسية</b>';m.setAttribute('aria-label','الرئيسية')}
  if(s&&!s.getAttribute('data-v6')){s.setAttribute('data-v6','1');s.innerHTML=ic('gear')+'<b>الإعدادات</b>';s.setAttribute('aria-label','الإعدادات')}
  mark(document.querySelector('.page.active')&&document.querySelector('.page.active').id);
}
function mark(id){
  var m=document.querySelector('.nav .navMain'),s=document.querySelector('.nav .navSettings');
  if(m){var a=id==='home';m.classList.toggle('on',a);a?m.setAttribute('aria-current','page'):m.removeAttribute('aria-current')}
  if(s){var b=id==='settings';s.classList.toggle('on',b);b?s.setAttribute('aria-current','page'):s.removeAttribute('aria-current')}
}
var _show=window.show;
if(typeof _show==='function'){
  window.show=function(id){
    var r=_show.apply(this,arguments);
    try{mark(id);window.scrollTo(0,0);}catch(e){}
    return r;
  };
}
/* ---- أيقونة الإعدادات ---- */
function stg(){var i=document.querySelector('.ico-install');if(i&&!i.firstChild)i.innerHTML=ic('download')}
/* ---- زر الوضع الداكن في الترويسة: وصف وصول ---- */
function hdr(){var b=document.querySelector('header.top button');if(b&&!b.getAttribute('aria-label')){b.setAttribute('aria-label','تبديل الوضع الداكن');b.innerHTML=ic('sun')}}
/* ---- صور بلا وصف ---- */
function alts(){document.querySelectorAll('img:not([alt])').forEach(function(i){i.setAttribute('alt','')});document.querySelectorAll('img[alt=""]:not([role])').forEach(function(i){i.setAttribute('role','presentation')})}
function openParam(){try{var q=new URLSearchParams(location.search).get('open');if(q&&/^[a-zA-Z0-9_-]{2,24}$/.test(q)&&document.getElementById(q)&&window.show)show(q)}catch(e){}}
function init(){nav();stg();hdr();alts();if(window.v106Sweep)window.v106Sweep(document.body);if(window.v6IntroOut)window.v6IntroOut()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.addEventListener('load',function(){init();openParam()});
/* حماية: عند الرجوع للصفحة من الخلفية */
window.addEventListener('pageshow',function(){mark((document.querySelector('.page.active')||{}).id)});
})();
