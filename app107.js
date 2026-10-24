/* =====================================================================
   المسلم v107 — طبقة الواجهة والسلوك
   1) القائمة الجانبية (همبرغر) + أقسام الصفحة الرئيسية + ظهور عند التمرير
   2) إصلاح نظام الساعة (12/24) وربطه بكل الأوقات
   3) إصلاح اللغة: لا يتغير الاتجاه وحده؛ الترجمة تتم فعليًا (مترجم المتصفح المحلي + قاموس)
   4) لون مخصص يختاره المستخدم
   5) شريط صوت مصغّر موحّد (تشغيل/إيقاف مؤقت/إيقاف نهائي ✕) لكل تسجيل خارج القارئ
   6) التنزيلات: الحذف من الإعدادات فقط
   7) طلب تثبيت التطبيق عند أول زيارة من المتصفح
   8) تهنئة بداية الأشهر الهجرية والأعياد
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
var LS=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function toast(m){if(window.showToast)window.showToast(m)}

/* ---------------------------------------------------------------
   2) نظام الساعة: يطبَّق على كل toLocaleTimeString داخل التطبيق
   --------------------------------------------------------------- */
(function(){
  var orig=Date.prototype.toLocaleTimeString;
  Date.prototype.toLocaleTimeString=function(loc,opt){
    try{
      var mode=localStorage.getItem('muslim-clock-mode')||'24';
      var o=Object.assign({},opt||{});
      if(o.hour12===undefined&&o.hourCycle===undefined){o.hour12=(mode==='12')}
      if(o.hour===undefined&&o.minute===undefined&&o.second===undefined&&o.timeStyle===undefined){o.hour='2-digit';o.minute='2-digit'}
      return orig.call(this,loc,o);
    }catch(e){return orig.call(this,loc,opt)}
  };
  /* أوضح تسميات خيارات الساعة والمؤقتات (كانت تلتبس: «90 ساعة») */
  function relabel(){
    var c=$('clockMode');
    if(c){c.options[0].text='نظام 24 ساعة (مثال 17:30)';c.options[1].text='نظام 12 ساعة (مثال 5:30 م)';c.value=localStorage.getItem('muslim-clock-mode')||'24'}
    var s=$('stgSleepMin');
    if(s){
      var labs={'0':'بدون','10':'10 دقائق','15':'15 دقيقة','20':'20 دقيقة','30':'30 دقيقة','45':'45 دقيقة','60':'60 دقيقة (ساعة)','90':'90 دقيقة (ساعة ونصف)','120':'120 دقيقة (ساعتان)'};
      if(!Array.prototype.some.call(s.options,function(o){return o.value==='120'})){var o=document.createElement('option');o.value='120';s.appendChild(o)}
      Array.prototype.forEach.call(s.options,function(o){if(labs[o.value])o.text=labs[o.value]});
    }
  }
  document.addEventListener('DOMContentLoaded',function(){setTimeout(relabel,400)});
  var sc=window.setClockMode;
  window.setClockMode=function(m){if(sc)sc(m);else localStorage.setItem('muslim-clock-mode',m);relabel();document.dispatchEvent(new CustomEvent('muslimClockModeChanged',{detail:m}));toast(m==='12'?'تم: نظام 12 ساعة':'تم: نظام 24 ساعة')};
})();

/* ---------------------------------------------------------------
   3) اللغة: ترجمة حقيقية بدل قلب الاتجاه
   - عند اختيار لغة غير العربية: نستخدم مترجم المتصفح المحلي (Translator API) إن وُجد،
     وإلا القاموس الموجود. إن لم تتوفر ترجمة نُبقي العربية ونخبر المستخدم.
   - الاتجاه يتبع اللغة فقط بعد نجاح الترجمة.
   --------------------------------------------------------------- */
(function(){
  var RTL={ar:1,ur:1,fa:1};
  var cache=LG('muslim-v107-trcache',{});
  function nodes(){
    var out=[],w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      var p=n.parentElement;if(!p)return NodeFilter.FILTER_REJECT;
      if(/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT)$/.test(p.tagName))return NodeFilter.FILTER_REJECT;
      if(p.closest('.quranAyahs,.mpPage,.hdTxt,[translate=no],#quran,#quranDetail,.ayah'))return NodeFilter.FILTER_REJECT;
      if(!/[\u0600-\u06FF]/.test(n.nodeValue))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT}});
    var n;while((n=w.nextNode()))out.push(n);return out;
  }
  async function makeTranslator(lang){
    if(typeof self.Translator==='undefined')return null;
    try{
      var av=await self.Translator.availability({sourceLanguage:'ar',targetLanguage:lang});
      if(av==='unavailable')return null;
      return await self.Translator.create({sourceLanguage:'ar',targetLanguage:lang});
    }catch(e){return null}
  }
  function restore(){
    document.querySelectorAll('[data-v107o]').forEach(function(el){/* عناصر مولّدة سابقًا */});
    nodes().forEach(function(n){});
    (window.__v107Orig||[]).forEach(function(p){if(p.n.isConnected)p.n.nodeValue=p.o});window.__v107Orig=[];
  }
  window.setAppLanguage=async function(lang){
    try{localStorage.setItem('quran-m09-language',lang)}catch(e){}
    var sel=$('appLanguage');if(sel)sel.value=lang;
    restore();
    if(lang==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';return}
    toast('⏳ جارٍ ترجمة الواجهة…');
    var tr=await makeTranslator(lang),list=nodes(),ok=0;window.__v107Orig=[];
    var dict=(window.UI_TRANSLATIONS_V107||{})[lang]||{};
    for(var i=0;i<list.length;i++){
      var n=list[i],raw=n.nodeValue.trim(),key=lang+'|'+raw,t=cache[key]||dict[raw]||null;
      if(!t&&tr){try{t=await tr.translate(raw);if(t)cache[key]=t}catch(e){}}
      if(t&&t!==raw){window.__v107Orig.push({n:n,o:n.nodeValue});n.nodeValue=n.nodeValue.replace(raw,t);ok++}
    }
    LS('muslim-v107-trcache',cache);
    if(ok>0){document.documentElement.lang=lang;document.documentElement.dir=RTL[lang]?'rtl':'ltr';toast('تمت الترجمة ✅ (نص القرآن والأحاديث يبقى بالعربية)')}
    else{document.documentElement.lang='ar';document.documentElement.dir='rtl';if(sel)sel.value='ar';localStorage.setItem('quran-m09-language','ar');toast('تعذّرت ترجمة هذه اللغة على جهازك الآن. جرّب Chrome حديث أو لغة أخرى؛ بقيت العربية.')}
  };
  window.initAppLanguage=function(){var l=localStorage.getItem('quran-m09-language')||'ar';if(l!=='ar')setTimeout(function(){window.setAppLanguage(l)},1500)};
})();

/* ---------------------------------------------------------------
   4) لون مخصص
   --------------------------------------------------------------- */
(function(){
  function shade(hex,p){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255,f=function(x){return Math.max(0,Math.min(255,Math.round(x+(p<0?x*p:(255-x)*p))))};return '#'+[f(r),f(g),f(b)].map(function(x){return ('0'+x.toString(16)).slice(-2)}).join('')}
  function lum(hex){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return (0.299*r+0.587*g+0.114*b)/255}
  window.v107ApplyColor=function(hex){
    var st=$('v107Color');if(!st){st=document.createElement('style');st.id='v107Color';document.head.appendChild(st)}
    if(!/^#[0-9a-f]{6}$/i.test(hex||'')){st.textContent='';return}
    var l=lum(hex),base=l>0.72?shade(hex,-0.35):hex;
    st.textContent=':root,body,body.dark{--green:'+base+'!important;--green2:'+shade(base,0.18)+'!important}body.dark{--green:'+(l<0.3?shade(base,0.45):base)+'!important}';
    var m=document.querySelector('meta[name=theme-color]');if(m)m.content=base;
  };
  window.v107SetColor=function(hex){LS('muslim-v107-color',hex);v107ApplyColor(hex);var i=$('v107ColorIn');if(i)i.value=hex;var s=$('stgAccent');if(s)s.value='custom'};
  window.v107ResetColor=function(){try{localStorage.removeItem('muslim-v107-color')}catch(e){}v107ApplyColor('');toast('أُعيد اللون الافتراضي')};
  var c=LG('muslim-v107-color','');if(c)v107ApplyColor(c);
  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(function(){
      var i=$('v107ColorIn');if(i){i.value=c||'#1d624f';i.oninput=function(){v107SetColor(i.value)}}
      var h=$('v107ColorHex');if(h){h.value=c||'';h.onchange=function(){var v=h.value.trim();if(v[0]!=='#')v='#'+v;if(/^#[0-9a-f]{6}$/i.test(v))v107SetColor(v);else toast('اكتب اللون بصيغة #RRGGBB')}}
      var s=$('stgAccent');if(s){if(!Array.prototype.some.call(s.options,function(o){return o.value==='custom'})){var o=document.createElement('option');o.value='custom';o.text='مخصص (اخترته أنت)';s.appendChild(o)}if(c)s.value='custom';
        s.addEventListener('change',function(){if(s.value!=='custom'){try{localStorage.removeItem('muslim-v107-color')}catch(e){}v107ApplyColor('')}})}
    },500);
  });
})();

/* ---------------------------------------------------------------
   1) القائمة الجانبية + أقسام الرئيسية
   --------------------------------------------------------------- */
function buildDrawer(){
  if($('v107Burger'))return;
  var b=document.createElement('button');b.id='v107Burger';b.setAttribute('aria-label','القائمة');b.innerHTML='<i></i>';
  var sc=document.createElement('div');sc.id='v107Scrim';
  var d=document.createElement('nav');d.id='v107Drawer';d.setAttribute('aria-label','القائمة الجانبية');
  var items=[['🏠','الرئيسية',"home"],['🕌','مواقيت الصلاة',"prayer"],['📖','المصحف',"mushaf107"],['🎧','القراء',"readers"],['📜','الأحاديث',"hadith107"],['🤲','الأذكار والأدعية',"adhkar"],['🕋','الرقية الشرعية',"ruqyah"],['🧭','القبلة',"qibla"],['🔁','تكرار الآية',"repeatAyah"],['📅','المناسك والتقويم',"manasik"],['📥','تنزيلاتي',"downloads"],['💬','مساعد المسلم',"assistant"],['📲','تثبيت ومشاركة',"install"],['⚙️','الإعدادات',"settings"]];
  d.innerHTML='<div class="dh"><img src="icon-192.png" alt=""><div><b>المسلم</b><br><small>AL-MUSLIM</small></div></div>'+items.map(function(x){return '<button class="dl" data-go="'+x[2]+'"><span>'+x[0]+'</span>'+x[1]+'</button>'}).join('');
  var hb=document.querySelector('header.top > div:last-child');
  if(hb){b.classList.add('inHeader');hb.style.display='flex';hb.style.gap='8px';hb.style.alignItems='center';hb.appendChild(b)}else document.body.appendChild(b);
  document.body.appendChild(sc);document.body.appendChild(d);
  function tog(o){document.body.classList.toggle('v107MenuOpen',o)}
  b.onclick=function(){tog(!document.body.classList.contains('v107MenuOpen'))};
  sc.onclick=function(){tog(false)};
  document.addEventListener('keydown',function(e){if(e.key==='Escape')tog(false)});
  d.addEventListener('click',function(e){
    var t=e.target.closest('[data-go]');if(!t)return;tog(false);var id=t.dataset.go;
    if(id==='prayer'){show('prayer')}else if(id==='mushaf107'){show('mushaf107')}else if(id==='hadith107'){show('hadith107')}
    else if(id==='adhkar'){show('adhkar');try{initAdhkarV27()}catch(x){}}
    else if(id==='ruqyah'){show('ruqyah');try{renderRuqyah()}catch(x){}}
    else if(id==='repeatAyah'){show('repeatAyah');try{initRepeatAyah()}catch(x){}}
    else if(id==='manasik'){show('manasik');try{initManasik()}catch(x){}}
    else show(id);
  });
  /* سحب من الحافة لفتح/إغلاق */
  var sx=null;document.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  document.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;var rtl=document.documentElement.dir!=='ltr';
    if(document.body.classList.contains('v107MenuOpen')&&Math.abs(dx)>70&&((rtl&&dx>0)||(!rtl&&dx<0)))tog(false)},{passive:true});
}

function homeSections(){
  var home=$('home');if(!home||$('v107Home'))return;
  var menu=home.querySelector('.menu');
  /* بطاقة الصلاة القادمة */
  var wrap=document.createElement('div');wrap.id='v107Home';
  wrap.innerHTML=
   '<div class="v107HeroNext v107Rv" id="v107Next" role="button" tabindex="0"><div><small>الصلاة القادمة</small><b id="v107NextName">حدّد موقعك</b><small id="v107NextTime">اضغط لعرض مواقيت الصلاة</small></div><div class="cd" id="v107NextCd">--:--:--</div></div><div class="v107Strip" id="v107Strip"></div>';
  if(menu)menu.parentNode.insertBefore(wrap,menu);else home.appendChild(wrap);
  $('v107Next').onclick=function(){show('prayer')};
  /* التواصل: ميزة مخفية حتى يوضع بريد الاستلام في app-config.js (window.CONTACT_EMAIL) */
  if(window.CONTACT_EMAIL){
    var c=document.createElement('div');c.className='v107Sec v107Rv';
    c.innerHTML='<h3>✉️ تواصل معنا</h3><form class="v107Contact" id="v107ContactForm"><input name="n" placeholder="الاسم" required><textarea name="m" rows="3" placeholder="رسالتك" required></textarea><button class="primary" type="submit">إرسال</button></form>';
    home.appendChild(c);
    $('v107ContactForm').onsubmit=function(e){e.preventDefault();var f=e.target;location.href='mailto:'+window.CONTACT_EMAIL+'?subject='+encodeURIComponent('رسالة من تطبيق المسلم — '+f.n.value)+'&body='+encodeURIComponent(f.m.value)};
  }
  /* ظهور عند التمرير */
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12}):null;
  document.querySelectorAll('#home .v107Rv,#home .tile').forEach(function(el){if(io){el.classList.add('v107Rv');io.observe(el)}else el.classList.add('in')});
}
function homeTiles(){
  var menu=document.querySelector('#home .menu');if(!menu||$('v107TilePr'))return;
  /* تحويل بطاقة المصحف والأحاديث إلى الصفحات الجديدة */
  menu.querySelectorAll('.tile').forEach(function(t){
    var oc=t.getAttribute('onclick')||'';
    if(/show\('quran'\)|show\('quranOff'\)/.test(oc)){t.setAttribute('onclick',"show('mushaf107')");var s=t.querySelector('small');if(s)s.textContent='صفحات مصحف المدينة بالتشكيل الكامل';t.classList.remove('v103Off')}
    if(/show\('hadithOff'\)|show\('hadith'\)/.test(oc)){t.setAttribute('onclick',"show('hadith107')");var s2=t.querySelector('small');if(s2)s2.textContent='صحيح البخاري وصحيح مسلم مع بحث';t.classList.remove('v103Off')}
  });
  var tile=document.createElement('div');tile.className='tile';tile.id='v107TilePr';tile.setAttribute('onclick',"show('prayer')");
  tile.innerHTML='<span class="ico">🕌</span><b>مواقيت الصلاة</b><small>دقيقة بحسب موقعك مع تذكير وأذان</small>';
  menu.insertBefore(tile,menu.firstChild);
}
var stripKey='';
function strip(){
  var P=window.v107Prayer,el=$('v107Strip'),l=P&&P.getLoc&&P.getLoc();if(!el||!l)return;
  var now=new Date(),t=P.timesFor(now,l),k=now.getDate()+':'+now.getHours()+':'+now.getMinutes();if(k===stripKey)return;stripKey=k;
  var cur=null,O=['fajr','sunrise','dhuhr','asr','maghrib','isha'];O.forEach(function(x){if(t[x]&&t[x]<=now)cur=x});
  el.innerHTML=O.map(function(x){return '<div class="'+(x===cur?'cur':'')+'"><small>'+P.names[x]+'</small><b>'+P.fmt(t[x])+'</b></div>'}).join('');
}
setInterval(function(){
  strip();
  var P=window.v107Prayer;if(!P||!P.next||!$('v107NextCd'))return;
  var n=P.next();if(!n){return}
  var ms=n.at-Date.now(),s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;
  $('v107NextName').textContent=P.names[n.key];$('v107NextTime').textContent='الساعة '+P.fmt(n.at);
  $('v107NextCd').textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(x<10?'0':'')+x;
},1000);

/* ---------------------------------------------------------------
   5) شريط الصوت المصغّر الموحّد
   --------------------------------------------------------------- */
(function(){
  var cur=null;
  var bar;
  function build(){
    if(bar)return;
    bar=document.createElement('div');bar.id='v107Bar';
    bar.innerHTML='<button id="v107Pp" aria-label="تشغيل/إيقاف مؤقت">⏸</button><div class="tt" id="v107Tt">—</div><button class="x" id="v107X" aria-label="إيقاف نهائي">✕</button><div class="pg"><i id="v107Pg"></i></div>';
    document.body.appendChild(bar);
    $('v107Pp').onclick=function(e){e.stopPropagation();if(!cur)return;if(cur.paused)cur.play().catch(function(){});else cur.pause()};
    $('v107X').onclick=function(e){e.stopPropagation();stopCur()};
  }
  function isMain(a){return a&&(a.id==='audio'||(a.closest&&a.closest('#readerInlinePlayer')))}
  function allowed(a){
    if(a.getAttribute&&a.getAttribute('data-v107title'))return true;
    var p=document.querySelector('.page.active');return !!p&&/^(adhkar|ruqyah|hadith107|hadith|hadithDetail|hadithCollection|modes|daily|children)$/.test(p.id);
  }
  function titleOf(a){
    var t=a.getAttribute&&a.getAttribute('data-v107title');if(t)return t;
    try{var c=a.closest&&a.closest('.card,.adkCard,.hdCard,article,.v27audio');var h=c&&c.querySelector('h3,h2,b');if(h)return '🎙️ '+h.textContent.trim().slice(0,60)}catch(e){}
    return '🎙️ تسجيل صوتي';
  }
  function stopCur(){if(!cur)return;try{cur.pause();cur.currentTime=0}catch(e){}if(window._humanRuqyahAudio===cur&&window.stopSpeech)try{stopSpeech()}catch(e){}cur=null;sync()}
  function sync(){
    build();
    var sb=$('speechMiniBar');if(sb)sb.style.display='none'; /* شريط الرقية القديم يُستبدل بالموحّد */
    if(!cur||cur.ended){bar.classList.remove('show');return}
    bar.classList.add('show');$('v107Tt').textContent=titleOf(cur);$('v107Pp').textContent=cur.paused?'▶':'⏸';
    var gm=$('globalMiniPlayer');if(gm&&gm.classList.contains('show')){bar.style.bottom='calc(116px + env(safe-area-inset-bottom))'}else bar.style.bottom='';
  }
  /* تتبّع كل عناصر الصوت (حتى المُنشأة برمجيًا وغير المضافة للصفحة) عبر تغليف play */
  var op=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){
    var a=this;
    if(a.tagName==='AUDIO'&&!isMain(a)&&a.id!=='v107-ignore'&&allowed(a)){
      if(!a.__v107){a.__v107=1;
        a.addEventListener('pause',function(){if(a===cur)sync()});
        a.addEventListener('ended',function(){if(a===cur){cur=null;sync()}});
        a.addEventListener('timeupdate',function(){if(a===cur&&a.duration){var p=$('v107Pg');if(p)p.style.width=(a.currentTime/a.duration*100)+'%'}});
      }
      if(cur&&cur!==a&&!cur.paused)try{cur.pause()}catch(x){}
      cur=a;setTimeout(sync,0);
    }
    return op.apply(this,arguments);
  };
  document.addEventListener('DOMContentLoaded',build);
})();

/* ---------------------------------------------------------------
   6) التنزيلات: الحذف من الإعدادات فقط
   --------------------------------------------------------------- */
window.v107ManageDownloads=function(){document.body.classList.add('dlManage');show('downloads');if(window.v106RenderDownloads)setTimeout(window.v106RenderDownloads,50)};
(function(){
  var os=window.show;
  window.show=function(id){if(id!=='downloads')document.body.classList.remove('dlManage');return os.apply(this,arguments)};
  /* على صفحة القارئ: الضغط على «محفوظ» لا يحذف */
  var ds=window.downloadSurah;
  if(typeof ds==='function'){window.downloadSurah=function(n){try{if(window.isDownloaded&&isDownloaded(n)){toast('التلاوة محفوظة. لحذف التنزيلات: الإعدادات ← التخزين والتنزيلات.');return}}catch(e){}return ds.apply(this,arguments)}}
})();

/* ---------------------------------------------------------------
   7) طلب التثبيت عند أول زيارة من المتصفح
   --------------------------------------------------------------- */
(function(){
  var dp=null,bar;
  function standalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;maybeShow()});
  window.addEventListener('appinstalled',function(){LS('muslim-v107-installed',1);if(bar)bar.classList.remove('show')});
  function maybeShow(){
    if(standalone()||LG('muslim-v107-installed',0))return;
    var snooze=LG('muslim-v107-install-snooze',0);if(Date.now()<snooze)return;
    if(!bar){
      bar=document.createElement('div');bar.id='v107InstallBar';
      bar.innerHTML='<img src="icon-192.png" width="40" height="40" alt="" style="border-radius:10px"><div style="flex:1"><b>ثبّت تطبيق المسلم</b><br><small>يعمل بلا متصفح، ويصلك التذكير بسهولة</small></div><button class="primary" id="v107InstBtn">تثبيت</button><button class="x" id="v107InstX" aria-label="إغلاق">✕</button>';
      document.body.appendChild(bar);
      $('v107InstBtn').onclick=async function(){
        if(dp){dp.prompt();try{var r=await dp.userChoice;if(r.outcome==='accepted')LS('muslim-v107-installed',1)}catch(e){}dp=null;bar.classList.remove('show')}
        else{bar.classList.remove('show');show('install')} /* خطوات التثبيت (آيفون وغيره) */
      };
      $('v107InstX').onclick=function(){bar.classList.remove('show');LS('muslim-v107-install-snooze',Date.now()+86400e3)};
    }
    bar.classList.add('show');
  }
  window.addEventListener('load',function(){setTimeout(maybeShow,2500)});
})();

/* ---------------------------------------------------------------
   8) تهنئة بداية الأشهر والأعياد
   --------------------------------------------------------------- */
var MONTHS=['المحرّم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوّال','ذو القعدة','ذو الحجة'];
function greetingFor(h){
  var d=h.day,m=h.month;
  if(m===9&&d===1)return['🌙 حان شهر رمضان المبارك','تقبّل الله صيامكم وقيامكم. رمضان كريم!'];
  if(m===10&&d===1)return['🎉 عيد الفطر المبارك','عيدكم مبارك، تقبّل الله منا ومنكم صالح الأعمال.'];
  if(m===12&&d===10)return['🐑 عيد الأضحى المبارك','عيدكم مبارك، وكل عام وأنتم بخير.'];
  if(m===12&&d===9)return['⛰️ يوم عرفة','صيامه يكفّر سنتين؛ أكثروا من الدعاء.'];
  if(m===12&&d===1)return['🕋 حلّ شهر ذي الحجة','أيام العشر من أحب الأيام إلى الله فأكثروا من الذكر.'];
  if(m===1&&d===1)return['✨ رأس السنة الهجرية','كل عام وأنتم بخير، وعام هجري مبارك.'];
  if(m===1&&d===10)return['🌿 يوم عاشوراء','صيامه يكفّر السنة الماضية.'];
  if(d===1)return['🌙 حلّ شهر '+MONTHS[m-1],'أعاده الله علينا بالخير واليُمن والبركات.'];
  return null;
}
window.v107Greetings=function(){
  var P=window.v107Prayer,adj=P?P.cfg().hijriAdj:0;
  var h=window.v107Hijri?window.v107Hijri(new Date(),adj):null;if(!h||!h.month)return;
  var g=greetingFor(h);if(!g)return;
  var key=h.year+'-'+h.month+'-'+h.day;if(LG('muslim-v107-greeted','')===key)return;
  LS('muslim-v107-greeted',key);
  var el=document.createElement('div');el.className='v107Greet';el.innerHTML='<b>'+g[0]+'</b><span>'+g[1]+'</span><br><button class="primary" id="v107GrOk">آمين 🤲</button>';
  document.body.appendChild(el);$('v107GrOk').onclick=function(){el.remove()};setTimeout(function(){el.remove()},20000);
  try{if('Notification' in window&&Notification.permission==='granted')navigator.serviceWorker.ready.then(function(r){r.showNotification(g[0],{body:g[1],tag:'greet-'+key,icon:'./icon-192.png',lang:'ar',dir:'rtl'})})}catch(e){}
};
/* جدول التهاني للأيام القادمة (للخلفية) يُخزَّن مع جدول الصلاة */
window.v107GreetSchedule=async function(){
  var adj=window.v107Prayer?window.v107Prayer.cfg().hijriAdj:0,list=[];
  for(var i=0;i<4;i++){
    var d=new Date(Date.now()+i*864e5),h=window.v107Hijri(d,adj),g=greetingFor(h);
    if(g){var at=new Date(d.getFullYear(),d.getMonth(),d.getDate(),6,30).getTime();if(at>Date.now()-6*3600e3)list.push({t:at,kind:'greet',key:'gr',title:g[0],body:g[1],tag:'greet-'+h.year+'-'+h.month+'-'+h.day})}
  }
  try{var ca=await caches.open('muslim-config-v1');await ca.put('./__greet.json',new Response(JSON.stringify({events:list,fired:{}}),{headers:{'Content-Type':'application/json'}}))}catch(e){}
};

/* ---------------------------------------------------------------
   3 (طلب المستخدم) تجديد التنبيهات كل 3 أيام مع بقائها كما هي
   --------------------------------------------------------------- */
async function refreshReminders(){
  var last=LG('muslim-v107-rem-refresh',0);
  if(Date.now()-last<3*864e5)return;
  LS('muslim-v107-rem-refresh',Date.now());
  try{
    /* إعادة كتابة إعدادات تذكيرات الأذكار/الأعمال في مخزن الخلفية مع إعادة حساب الأوقات المتغيرة */
    var ca=await caches.open('muslim-config-v1'),r=await ca.match('./__reminders.json');
    if(r){var cfg=await r.json();cfg.fired={};cfg.refreshed=Date.now();await ca.put('./__reminders.json',new Response(JSON.stringify(cfg),{headers:{'Content-Type':'application/json'}}))}
  }catch(e){}
  if(window.v107Schedule)window.v107Schedule();
}

/* ---------- مساعد المسلم: فهم أسئلة المواقيت والأحاديث والمصحف والإعدادات ---------- */
(function(){
  function nz(x){return String(x||'').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[إأآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/\s+/g,' ').trim()}
  function btn(label,js){return '<button type="button" class="primary v103Go" onclick="'+js+'">'+label+'</button>'}
  function answer(q){
    var n=nz(q),P=window.v107Prayer,names=P?P.names:{};
    var map=[['الفجر','fajr'],['الشروق','sunrise'],['الظهر','dhuhr'],['العصر','asr'],['المغرب','maghrib'],['العشاء','isha'],['العشا','isha']];
    var asks=/(متى|كم|وقت|موعد|اذان|اذن|باقي|بقي|مواقيت|ساعه)/.test(n);
    var which=null;map.forEach(function(m){if(n.indexOf(m[0])>=0&&!which)which=m[1]});
    if((asks&&(which||/صلا|مواقيت|اذان/.test(n)))||/^(مواقيت الصلاه|اوقات الصلاه)/.test(n)){
      var loc=P&&P.getLoc();
      if(!loc)return 'لحساب المواقيت بدقة أحتاج موقعك. اضغط الزر وسأحدده لك.<br>'+btn('🕌 فتح مواقيت الصلاة',"show('prayer')");
      var t=P.timesFor(new Date(),loc),nx=P.next(),now=new Date();
      if(which){var d=t[which];var past=d&&d<now;return '🕌 '+names[which]+' اليوم الساعة <b>'+P.fmt(d)+'</b>'+(past?' (مضى وقتها)':' (باقي '+Math.max(0,Math.round((d-now)/60000))+' دقيقة تقريبًا)')+'<br><span class="mini">بحسب موقعك وطريقة: '+t.methodName+'</span><br>'+btn('كل المواقيت',"show('prayer')")}
      return '🕌 الصلاة القادمة: <b>'+(nx?names[nx.key]+'</b> الساعة <b>'+P.fmt(nx.at)+'</b>':'—</b>')+'<br>'+btn('عرض كل مواقيت اليوم',"show('prayer')");
    }
    if(/(بخاري|صحيح مسلم|حديث|احاديث|الاحاديث)/.test(n)){
      var b=/مسلم/.test(n)&&!/بخاري/.test(n)?'muslim':'bukhari',kw=n.replace(/(ابحث|اريد|اعطني|هات|حديث|احاديث|الاحاديث|في|عن|عن|صحيح|البخاري|بخاري|مسلم|ما|هو|هل|يوجد)/g,' ').replace(/\s+/g,' ').trim();
      return '📜 يمكنك قراءة <b>صحيح البخاري</b> و<b>صحيح مسلم</b> كاملين والبحث بأي كلمة أو رقم حديث.'+(kw?'<br>سأبحث لك عن: <b>'+kw+'</b>':'')+'<br>'+btn('📜 فتح الأحاديث',"v107AssistHadith('"+b+"','"+kw.replace(/'/g,'')+"')");
    }
    if(/(مصحف|صفحه|صفحات|قران|المصحف)/.test(n)&&!/(استمع|اسمع|قاري|تلاوه|بصوت)/.test(n)){
      var m=n.match(/صفحه\s*(\d{1,3})/);var pg=m?+m[1]:0;
      return '📖 صفحات مصحف المدينة بالتشكيل والوقوف كما في المطبوع.'+(pg?'<br>سأفتح الصفحة '+pg+'.':'')+'<br>'+btn('📖 فتح المصحف',"show('mushaf107');"+(pg?"setTimeout(function(){v107Mushaf.go("+pg+")},300)":""));
    }
    if(/(لون|الوان|خط|حجم الخط|اللغه|الساعه|نظام الساعه|اعدادات)/.test(n)&&/(غير|تغيير|كيف|اين|اضبط|ضبط|اريد)/.test(n))
      return '⚙️ كل ذلك في الإعدادات: <b>المظهر والألوان واللغة</b> (لون مخصص، حجم الخط، نظام الساعة 12/24، اللغة).<br>'+btn('فتح الإعدادات',"show('settings');setTimeout(function(){var d=document.getElementById('stgcat-appearance');if(d)d.open=true},200)");
    if(/(الاشعارات|اشعار|تنبيه|تذكير)/.test(n))
      return '🔔 فعّل الإشعارات واختر مدة التذكير قبل/بعد الصلاة من إعدادات الصلاة.<br>'+btn('🔔 تفعيل الإشعارات',"v107AskNotif()")+btn('إعدادات الصلاة',"show('settings');setTimeout(function(){var d=document.getElementById('stgcat-prayer');if(d)d.open=true},200)");
    return null;
  }
  window.v107AssistHadith=function(book,kw){show('hadith107');setTimeout(function(){var H=window.v107Hadith;if(!H)return;var tabs=document.querySelectorAll('#hadith107 .hdTabs button');tabs.forEach(function(t){if(t.dataset.b===book)t.click()});if(kw){setTimeout(function(){var s=document.getElementById('hdSearch');if(s){s.value=kw;s.dispatchEvent(new Event('input'))}},400)}},200)};
  document.addEventListener('submit',function(e){
    if(!e.target||e.target.id!=='v103Form')return;
    var inp=document.getElementById('v103In'),q=inp&&inp.value.trim();if(!q)return;
    var r=answer(q);if(!r)return;
    e.preventDefault();e.stopImmediatePropagation();
    var box=document.getElementById('v103Msgs');if(!box)return;
    var me=document.createElement('div');me.className='v103Msg me';me.textContent=q;
    var bot=document.createElement('div');bot.className='v103Msg bot';bot.innerHTML=r;
    box.appendChild(me);box.appendChild(bot);inp.value='';box.scrollTop=box.scrollHeight;
  },true);
})();

/* نقل صفوف التشخيص/التحديث التي تُحقن وقت التشغيل إلى فئة «عن التطبيق» */
function moveDiag(){
  var about=document.querySelector('#stgcat-about .stgGroup');if(!about)return;
  var btn=Array.prototype.find.call(document.querySelectorAll('#settings button'),function(b){return /نسخ تقرير المشكلة|تحديث التطبيق/.test(b.textContent)});
  if(!btn)return;
  var el=btn;while(el.parentElement&&!el.parentElement.classList.contains('stgGroup'))el=el.parentElement;
  if(!el||el.parentElement===about)return;
  var prev=el.previousElementSibling;
  if(prev&&/الإصدار|التشخيص/.test(prev.textContent)&&prev.children.length<4)about.appendChild(prev);
  about.appendChild(el);
}
function boot(){
  setTimeout(moveDiag,300);setTimeout(moveDiag,2500);
  document.querySelectorAll('details.stgCat .stgGroup').forEach(function(g){g.classList.add('open')});
  buildDrawer();homeTiles();homeSections();
  window.v107Greetings();window.v107GreetSchedule();refreshReminders();
  if(window.initAppLanguage)window.initAppLanguage();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,700)});else setTimeout(boot,700);
})();
