/* =====================================================================
   المسلم v107 — المصحف على هيئة صفحات (مصحف المدينة النبوية 1441هـ — حفص عن عاصم)
   المصدر: بيانات وخطوط QCF4 الصادرة عن مجمع الملك فهد لطباعة المصحف الشريف
   (الحزمة المفتوحة quran-qcf4 عبر jsDelivr/GitHub). كل صفحة تُعرض بنفس أسطرها
   الخمسة عشر وبنفس مواضع الآيات والوقوف وعلامات الضبط كما في المصحف المطبوع،
   لأن الخط يرسم الكلمة كاملة بأشكالها (وليس نصًّا عاديًّا يُعاد تشكيله).
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
var LS=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var RAW='https://raw.githubusercontent.com/MohamadHajjRabee/quran-qcf4/main/';
var JSD='https://cdn.jsdelivr.net/gh/MohamadHajjRabee/quran-qcf4@main/';
var K='muslim-v107-mushaf';
var DEF={paper:'cream',scale:1,frame:true,tapPlay:true,page:1,reciter:'Alafasy_128kbps'};
function cfg(){return Object.assign({},DEF,LG(K,{}))}
function save(c){LS(K,c)}
var PAPERS={cream:['#fbf6e8','#111','#c8a15b'],white:['#ffffff','#000','#9aa7a0'],sepia:['#f1e4c7','#2b1d0e','#a37b3c'],night:['#101714','#e9efe9','#7a6a3d'],gold:['#fff3cf','#1b1405','#b8860b']};
var RIW=[['hafs','حفص عن عاصم',true],['qalun','قالون عن نافع',false],['warsh','ورش عن نافع',false],['duri','الدوري عن أبي عمرو',false],['susi','السوسي عن أبي عمرو',false],['shuba','شعبة عن عاصم',false],['bazzi','البزي عن ابن كثير',false],['qunbul','قنبل عن ابن كثير',false]];
var chapters=null,loadedFonts={},cache={};
var page=1;

function ensure(){
  if($('mushaf107'))return;
  var s=document.createElement('section');s.id='mushaf107';s.className='page';s.setAttribute('translate','no');
  s.innerHTML='<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>📖 مصحف المدينة</h2><p>صفحات المصحف كما هي — حفص عن عاصم</p></div></div>'+
   '<div class="card"><b>الرواية</b><div class="riwChips" id="mpRiw"></div><div class="mini" id="mpRiwNote"></div></div>'+
   '<div class="mbar"><button id="mpPrev" aria-label="الصفحة السابقة">→</button><input id="mpNum" type="number" min="1" max="604" style="width:84px;text-align:center"><span class="mini">/ 604</span><button id="mpNext" aria-label="الصفحة التالية">←</button><select id="mpSurah" style="flex:1;min-width:130px"></select><select id="mpJuz"></select></div>'+
   '<div class="mpWrap"><div class="mpPage" id="mpPage"><div class="mpLoad">⏳ جارٍ تحميل الصفحة…</div></div></div>'+
   '<div class="mbar" style="justify-content:center"><button id="mpMinus" aria-label="تصغير">A−</button><span id="mpZv" class="mini" style="min-width:44px;text-align:center">100%</span><button id="mpPlus" aria-label="تكبير">A+</button><select id="mpPaper"><option value="cream">ورق كريمي</option><option value="white">أبيض</option><option value="sepia">سيبيا</option><option value="gold">ذهبي</option><option value="night">ليلي</option></select><button id="mpFrame">🖼️ الإطار</button><button id="mpRead" class="primary">⛶ وضع القراءة</button></div>'+
   '<div class="mpSheet" id="mpSheet"><b id="mpSheetT"></b><button class="primary" id="mpPlay">▶ استماع للآية</button><button id="mpCopy">📋 نسخ</button><button id="mpClose">✕</button></div>';
  var ref=$('settings');(ref&&ref.parentNode?ref.parentNode:document.body).insertBefore(s,ref||null);
  /* في الواجهة العربية: الزر الأيمن = الصفحة السابقة (→)، والأيسر = التالية (←) */
  $('mpPrev').onclick=function(){go(page-1)};
  $('mpNext').onclick=function(){go(page+1)};
  $('mpPrev').textContent='→';$('mpNext').textContent='←';
  $('mpNum').onchange=function(){go(parseInt(this.value,10)||1)};
  $('mpSurah').onchange=function(){var c=chapters&&chapters.chapters[+this.value-1];if(c)go(c.pages[0])};
  $('mpJuz').onchange=function(){var p=JUZ_PAGES[+this.value];if(p)go(p)};
  $('mpMinus').onclick=function(){var c=cfg();c.scale=Math.max(.6,+(c.scale-.1).toFixed(2));save(c);fit()};
  $('mpPlus').onclick=function(){var c=cfg();c.scale=Math.min(2,+(c.scale+.1).toFixed(2));save(c);fit()};
  $('mpPaper').onchange=function(){var c=cfg();c.paper=this.value;save(c);paper()};
  $('mpFrame').onclick=function(){var c=cfg();c.frame=!c.frame;save(c);paper()};
  $('mpClose').onclick=function(){$('mpSheet').classList.remove('show');unhl()};
  $('mpRead').onclick=function(){reading(true)};
  /* عناصر التحكم العائمة داخل وضع القراءة */
  var ov=document.createElement('div');ov.id='mpOv';
  ov.innerHTML='<button id="mpOvMinus" aria-label="تصغير">A−</button><button id="mpOvPlus" aria-label="تكبير">A+</button><button id="mpOvPrev" aria-label="الصفحة السابقة">→</button><span id="mpOvNum"></span><button id="mpOvNext" aria-label="الصفحة التالية">←</button><button id="mpOvExit" aria-label="خروج من وضع القراءة">✕ خروج</button>';
  document.body.appendChild(ov);
  $('mpOvMinus').onclick=function(e){e.stopPropagation();$('mpMinus').click()};
  $('mpOvPlus').onclick=function(e){e.stopPropagation();$('mpPlus').click()};
  $('mpOvPrev').onclick=function(e){e.stopPropagation();go(page-1)};
  $('mpOvNext').onclick=function(e){e.stopPropagation();go(page+1)};
  $('mpOvExit').onclick=function(e){e.stopPropagation();reading(false)};
  document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&document.body.classList.contains('mpReading'))reading(false,true)});
  /* سحب أفقي لتقليب الصفحات */
  var sx=null;var pg=$('mpPage');
  pg.addEventListener('click',function(e){
    if(!document.body.classList.contains('mpReading'))return;
    if(e.target.closest('.w'))return;
    document.body.classList.toggle('mpShowBars');
  });
  pg.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  pg.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>60){go(dx>0?page+1:page-1)}},{passive:true});
  document.addEventListener('keydown',function(e){if(!$('mushaf107').classList.contains('active'))return;if(e.key==='ArrowLeft')go(page+1);if(e.key==='ArrowRight')go(page-1)});
  window.addEventListener('resize',function(){if($('mushaf107').classList.contains('active'))fit()});
  riw();
  var jz=$('mpJuz');jz.innerHTML='<option value="">الجزء</option>'+Array.from({length:30},function(_,i){return '<option value="'+(i+1)+'">الجزء '+(i+1)+'</option>'}).join('');
}
/* بدايات الأجزاء في مصحف المدينة (صفحات) */
var JUZ_PAGES={1:1,2:22,3:42,4:62,5:82,6:102,7:121,8:142,9:162,10:182,11:201,12:222,13:242,14:262,15:282,16:302,17:322,18:342,19:362,20:382,21:402,22:422,23:442,24:462,25:482,26:502,27:522,28:542,29:562,30:582};
function riw(){
  var b=$('mpRiw');b.innerHTML=RIW.map(function(r){return '<button data-r="'+r[0]+'" class="'+(r[2]?'on':'')+'" '+(r[2]?'':'disabled')+'>'+r[1]+(r[2]?'':' (قريبًا)')+'</button>'}).join('');
  $('mpRiwNote').textContent='المتاح الآن بصفحات المصحف الكاملة: حفص عن عاصم. بقية الروايات تحتاج مصدر صفحات موثّق لكل رواية قبل إضافتها حتى لا تظهر أخطاء؛ وسنضيفها حال توثيق مصدرها.';
}
function paper(){
  var c=cfg(),p=PAPERS[c.paper]||PAPERS.cream,el=$('mpPage');if(!el)return;
  el.style.setProperty('--mp-bg',p[0]);el.style.setProperty('--mp-fg',p[1]);el.style.setProperty('--mp-frame',p[2]);
  el.classList.toggle('noFrame',!c.frame);$('mpPaper').value=c.paper;
}
function getJSON(path){
  if(cache[path])return Promise.resolve(cache[path]);
  return fetch(RAW+path).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return fetch(JSD+path).then(function(r){if(!r.ok)throw 0;return r.json()})}).then(function(j){cache[path]=j;return j});
}
function loadFont(name){
  if(loadedFonts[name])return loadedFonts[name];
  var url=JSD+'fonts-woff2/'+name+(name==='QCF4_QBSML'?'':'_W')+'.woff2';
  var ff=new FontFace(name,'url('+url+')',{display:'block'});
  loadedFonts[name]=ff.load().then(function(f){document.fonts.add(f);return f});
  return loadedFonts[name];
}
function surahName(id){var c=chapters&&chapters.chapters[id-1];return c?c.name_arabic:''}
/* وضع القراءة: الضغط على الزر يملأ الشاشة بالمصحف وحده.
   لمسة على هامش الصفحة تُظهر/تُخفي الشريط العلوي والسفلي وأزرار التنقل، ولمسة أخرى تُخفيها. */
function reading(on,fromFs){
  document.body.classList.toggle('mpReading',on);
  document.body.classList.remove('mpShowBars');
  if(on){try{var r=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;if(r)r.call(document.documentElement).catch(function(){})}catch(e){}}
  else if(!fromFs){try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}
  setTimeout(fit,60);setTimeout(fit,350);
}
window.addEventListener('orientationchange',function(){setTimeout(fit,300)});
function go(n){
  n=Math.max(1,Math.min(604,n|0||1));page=n;var c=cfg();c.page=n;save(c);
  $('mpNum').value=n;$('mpSheet').classList.remove('show');
  var el=$('mpPage');el.style.animation='none';void el.offsetWidth;el.style.animation='';
  el.innerHTML='<div class="mpLoad">⏳ جارٍ تحميل الصفحة '+n+'…</div>';
  var f=('00'+n).slice(-3);
  Promise.all([getJSON('pages/'+f+'.json'),chapters?0:getJSON('index.json').then(function(j){chapters=j;fillSurahs()})]).then(function(r){
    var d=r[0];return Promise.all([loadFont(d.font),loadFont('QCF4_QBSML')]).then(function(){return d})
  }).then(function(d){if(d.page===page)draw(d)}).catch(function(){
    el.innerHTML='<div class="mpLoad" style="text-align:center;padding:20px">تعذّر تحميل الصفحة. تحقّق من الإنترنت ثم <button onclick="v107Mushaf.go('+n+')">أعد المحاولة</button></div>';
  });
  /* تحميل مسبق للصفحة التالية */
  if(n<604)getJSON('pages/'+('00'+(n+1)).slice(-3)+'.json').catch(function(){});
}
function fillSurahs(){
  var s=$('mpSurah');if(!s||!chapters)return;
  s.innerHTML=chapters.chapters.map(function(c){return '<option value="'+c.id+'">'+c.id+'. '+c.name_arabic+'</option>'}).join('');
  syncSurah();
}
function syncSurah(){
  if(!chapters)return;var cur=1;
  chapters.chapters.forEach(function(c){if(c.pages[0]<=page)cur=c.id});
  var s=$('mpSurah');if(s)s.value=cur;
}
function juzOf(p){var j=1;Object.keys(JUZ_PAGES).forEach(function(k){if(JUZ_PAGES[k]<=p)j=+k});return j}
function draw(d){
  var el=$('mpPage');
  var head='<div class="mpHead"><span>الجزء '+juzOf(d.page)+'</span><span>'+(d.surahs&&d.surahs[0]?'سورة '+d.surahs[0].name_arabic:'')+'</span></div>';
  var lines=d.lines.map(function(l){
    var ws=l.words||[],only=ws.length===1&&(ws[0].type==='surah_header'||ws[0].type==='bismillah');
    var html=ws.map(function(w){
      var attr=w.verse_key?' data-vk="'+w.verse_key+'"':'';
      var style='font-family:\''+w.font+'\'';
      return '<span class="w"'+attr+' style="'+style+'">'+(w.char||'')+'</span>';
    }).join(only?'':'');
    return '<div class="mpLine'+(only?' center':'')+'" data-ln="'+l.line+'">'+html+'</div>';
  }).join('');
  el.innerHTML=head+'<div class="mpLines" id="mpLines">'+lines+'</div><div class="mpFoot">'+d.page+'</div>';
  paper();fit();syncSurah();
  $('mpLines').onclick=function(e){var w=e.target.closest('.w');if(!w||!w.dataset.vk)return;pick(w.dataset.vk)};
  $('mpOvNum').textContent=d.page;
  var c=cfg();c.page=d.page;save(c);
}
/* التكبير: يُضرب مقياس المصحف في مقياس خط التطبيق العام (--v105-fs) فيكبّر المصحف عند تكبير الخط من الإعدادات.
   الصفحة نفسها هي التي تكبر/تصغر (كلمات وأسطر معًا) فتبقى أسطر المصحف سليمة، ويمكن تحريكها بالتمرير إذا زادت عن الشاشة. */
function gfs(){var v=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v105-fs'));return isFinite(v)&&v>0?v:1}
function zoomVal(){return Math.max(.6,Math.min(2.4,cfg().scale*gfs()))}
function fit(){
  var box=$('mpLines'),pg=$('mpPage');if(!box||!pg)return;
  pg.style.setProperty('--mpZ',zoomVal());
  var W=box.clientWidth,H=box.clientHeight;if(!W)return;
  var reading=document.body.classList.contains('mpReading');
  /* نبدأ بحجم كبير ثم نصغّره حتى يملأ أطول سطر العرض تمامًا */
  var fs=W*0.095;box.style.fontSize=fs+'px';
  var lines=box.querySelectorAll('.mpLine:not(.center)'),guard=0;
  function widest(){var m=0;lines.forEach(function(l){var s=0;l.querySelectorAll('.w').forEach(function(w){s+=w.offsetWidth});if(s>m)m=s});return m}
  while(guard++<20){var m=widest();if(!m||Math.abs(m-W*0.99)<W*0.004)break;fs*=(W*0.99)/m;box.style.fontSize=fs+'px'}
  /* لا يتجاوز الخط ارتفاع السطر (15 سطرًا) حتى لا تتداخل الأسطر */
  var lh=H/15;if(fs>lh*0.95){fs=lh*0.95;box.style.fontSize=fs+'px'}
  box.querySelectorAll('.mpLine.center .w').forEach(function(w){w.style.fontSize=(fs*1.1)+'px'});
  var z=$('mpZv');if(z)z.textContent=Math.round(cfg().scale*100)+'%';
}
new MutationObserver(function(){if($('mpPage'))fit()}).observe(document.documentElement,{attributes:true,attributeFilter:['style']});
var curVK=null;
function unhl(){document.querySelectorAll('#mpLines .w.hl').forEach(function(w){w.classList.remove('hl')});curVK=null}
function pick(vk){
  unhl();curVK=vk;document.querySelectorAll('#mpLines .w[data-vk="'+vk+'"]').forEach(function(w){w.classList.add('hl')});
  var p=vk.split(':');$('mpSheetT').textContent='سورة '+surahName(+p[0])+' — آية '+p[1];
  $('mpSheet').classList.add('show');
  $('mpPlay').onclick=function(){playAyah(+p[0],+p[1])};
  $('mpCopy').onclick=function(){
    var t=Array.from(document.querySelectorAll('#mpLines .w[data-vk="'+vk+'"]')).map(function(w){return w.textContent}).join('');
    var txt='سورة '+surahName(+p[0])+' آية '+p[1];
    try{navigator.clipboard.writeText(txt);if(window.showToast)showToast('نُسخ: '+txt)}catch(e){}
  };
}
var ay=null;
function playAyah(s,a){
  var c=cfg(),pad=function(n,l){return ('000'+n).slice(-l)};
  try{if(ay){ay.pause()}}catch(e){}
  ay=new Audio('https://everyayah.com/data/'+c.reciter+'/'+pad(s,3)+pad(a,3)+'.mp3');
  ay.setAttribute('data-v107title','📖 '+surahName(s)+' — آية '+a);
  ay.onerror=function(){if(window.showToast)showToast('تعذّر تشغيل الآية الآن.')};
  ay.play().catch(function(){});
}
window.v107Mushaf={go:go,open:function(){ensure();var c=cfg();go(c.page||1)},cfg:cfg,save:save,refit:function(){fit()}};

/* ---- ربط إعدادات المصحف في صفحة الإعدادات ---- */
function bind(){
  var c=cfg();
  var p=$('mp107Paper');if(p){p.value=c.paper;p.onchange=function(){var x=cfg();x.paper=p.value;save(x);paper()}}
  var f=$('mp107Frame');if(f){f.checked=!!c.frame;f.onchange=function(){var x=cfg();x.frame=f.checked;save(x);paper()}}
  var s=$('mp107Scale');if(s){s.value=String(c.scale);if(s.value!==String(c.scale))s.value='1';s.onchange=function(){var x=cfg();x.scale=+s.value;save(x);fit()}}
  var r=$('mp107Reciter');if(r){r.value=c.reciter;r.onchange=function(){var x=cfg();x.reciter=r.value;save(x)}}
}
var _show=window.show;
window.show=function(id){if(id!=='mushaf107'&&document.body.classList.contains('mpReading'))reading(false);var r=_show.apply(this,arguments);if(id==='mushaf107'){ensure();setTimeout(function(){go(cfg().page||1)},0)}return r};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){ensure();bind()},400)});else setTimeout(function(){ensure();bind()},400);
})();
