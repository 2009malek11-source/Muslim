/* =====================================================================
   المسلم v107 — قسم الأحاديث: صحيح البخاري وصحيح مسلم
   - كل كتاب بأبوابه وأحاديثه كاملة (قاعدة AhmedBaset/hadith-json المثبّتة v1.2.0).
   - لكل حديث: الكتاب، الباب، رقم الحديث في الكتاب، والدرجة (صحيح).
   - بحث بأي كلمة أو معلومة (نص، راوٍ، باب، رقم الحديث) مع تجاهل التشكيل والهمزات.
   - التسجيلات الصوتية: تظهر أزرار التشغيل تلقائيًا عند توفير مصدر صوتي بشري موثّق
     عبر window.HADITH_AUDIO(book,id) في app-config.js (انظر الشرح).
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var LG=function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
var LS=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var BASE='https://raw.githubusercontent.com/AhmedBaset/hadith-json/v1.2.0/db/by_book/the_9_books/';
var BASE2='https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@v1.2.0/db/by_book/the_9_books/';
var NAME={bukhari:'صحيح البخاري',muslim:'صحيح مسلم'};
var CACHE='muslim-hadith-v107';
var K='muslim-v107-hadith';
var DEF={fs:22,showCh:true};
function cfg(){return Object.assign({},DEF,LG(K,{}))}
var books={},state={book:'bukhari',view:'chapters',ch:null,q:''},shown=0,PAGE=25,cur=[];

function norm(x){return String(x||'').normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g,'').replace(/[إأآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/\s+/g,' ').trim()}
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function textOf(h){var a=h.arabic;if(a&&typeof a==='object'){return ((a.narrator?a.narrator+' ':'')+(a.text||'')).trim()}return String(a||h.text||h.text_ar||'')}
function ensure(){
  if($('hadith107'))return;
  var s=document.createElement('section');s.id='hadith107';s.className='page';
  s.innerHTML='<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>📜 الأحاديث</h2><p>الصحيحان بالمصادر وأرقام الأحاديث</p></div></div>'+
   '<div class="hdTabs"><button data-b="bukhari" class="on">📗 صحيح البخاري</button><button data-b="muslim">📘 صحيح مسلم</button></div>'+
   '<input id="hdSearch" class="search" placeholder="🔎 ابحث بأي كلمة أو رقم حديث أو اسم راوٍ…" autocomplete="off">'+
   '<div id="hdBody"></div>';
  var ref=$('settings');(ref&&ref.parentNode?ref.parentNode:document.body).insertBefore(s,ref||null);
  s.querySelectorAll('.hdTabs button').forEach(function(b){b.onclick=function(){state.book=b.dataset.b;state.view='chapters';state.q='';$('hdSearch').value='';s.querySelectorAll('.hdTabs button').forEach(function(x){x.classList.toggle('on',x===b)});render()}});
  var t=null;$('hdSearch').oninput=function(){var v=this.value;clearTimeout(t);t=setTimeout(function(){state.q=v;state.view=v.trim()?'search':'chapters';render()},350)};
}
async function loadBook(b,progress){
  if(books[b])return books[b];
  var url=BASE+b+'.json',res=null;
  try{var ca=await caches.open(CACHE);var hit=await ca.match(url);if(hit){books[b]=prep(await hit.json());return books[b]}}catch(e){}
  try{res=await fetch(url)}catch(e){}
  if(!res||!res.ok){res=await fetch(BASE2+b+'.json');if(!res.ok)throw new Error('HTTP '+res.status);url=BASE2+b+'.json'}
  var total=+res.headers.get('content-length')||0,reader=res.body&&res.body.getReader?res.body.getReader():null,chunks=[],got=0;
  if(reader){for(;;){var r=await reader.read();if(r.done)break;chunks.push(r.value);got+=r.value.length;if(progress)progress(got,total)}}
  var blob=reader?new Blob(chunks):await res.blob();
  var txt=await blob.text(),j=JSON.parse(txt);
  try{var ca2=await caches.open(CACHE);await ca2.put(url,new Response(txt,{headers:{'Content-Type':'application/json'}}))}catch(e){}
  books[b]=prep(j);return books[b];
}
function prep(j){
  var chs=(j.chapters||[]).map(function(c,i){return{id:Number(c.id||i+1),title:(c.arabic&&c.arabic.title)||c.arabic||c.title||c.name||('الباب '+(i+1))}});
  var chMap={};chs.forEach(function(c){chMap[c.id]=c});
  var hs=(j.hadiths||[]).map(function(h,i){
    var t=textOf(h);
    return{id:Number(h.idInBook||h.id||i+1),ch:Number(h.chapterId||h.chapter_id||0),t:t,n:norm(t)};
  });
  return{chapters:chs,chMap:chMap,hadiths:hs,meta:j.metadata||{}};
}
function card(b,h){
  var c=cfg(),B=books[b],ch=B.chMap[h.ch],aud=window.HADITH_AUDIO&&window.HADITH_AUDIO(b,h.id);
  return '<article class="hdCard"><div class="hdSrc"><span>'+NAME[b]+'</span><span>حديث رقم '+h.id+'</span>'+(c.showCh&&ch?'<span>'+esc(ch.title)+'</span>':'')+'<span>الدرجة: صحيح</span></div><div class="hdTxt" style="--hd-fs:'+c.fs+'px">'+esc(h.t)+'</div>'+
   '<div class="controls" style="margin-top:8px"><button data-copy="'+b+':'+h.id+'">📋 نسخ مع المصدر</button><button data-fav="'+b+':'+h.id+'">⭐ مفضلة</button>'+(aud?'<button class="primary" data-aud="'+esc(aud)+'" data-t="'+esc(NAME[b]+' — حديث '+h.id)+'">▶ استماع</button>':'')+'</div></article>';
}
function bindCards(box){
  box.querySelectorAll('[data-copy]').forEach(function(b){b.onclick=function(){var p=b.dataset.copy.split(':'),h=books[p[0]].hadiths.filter(function(x){return x.id==+p[1]})[0];var t=h.t+'\n— '+NAME[p[0]]+'، حديث رقم '+h.id;try{navigator.clipboard.writeText(t);toast('تم النسخ مع المصدر')}catch(e){}}});
  box.querySelectorAll('[data-fav]').forEach(function(b){b.onclick=function(){var f=LG('muslim-v107-hdfav',[]),k=b.dataset.fav,i=f.indexOf(k);if(i<0)f.push(k);else f.splice(i,1);LS('muslim-v107-hdfav',f);toast(i<0?'أُضيف للمفضلة':'أُزيل من المفضلة')}});
  box.querySelectorAll('[data-aud]').forEach(function(b){b.onclick=function(){var a=new Audio(b.dataset.aud);a.setAttribute('data-v107title','📜 '+b.dataset.t);a.onerror=function(){toast('تعذّر تشغيل التسجيل الآن.')};a.play().catch(function(){})}});
}
function toast(m){if(window.showToast)window.showToast(m)}
function more(box){
  var part=cur.slice(shown,shown+PAGE),b=state.book;
  var old=box.querySelector('.hdMore');if(old)old.remove();
  box.insertAdjacentHTML('beforeend',part.map(function(h){return card(b,h)}).join(''));shown+=part.length;
  if(shown<cur.length){box.insertAdjacentHTML('beforeend','<button class="hdCh hdMore" style="justify-content:center">عرض المزيد ('+(cur.length-shown)+' متبقٍّ)</button>');box.querySelector('.hdMore').onclick=function(){more(box)}}
  bindCards(box);
}
async function render(){
  ensure();var box=$('hdBody'),b=state.book;
  box.innerHTML='<div class="notice">⏳ جارٍ تحميل '+NAME[b]+'… <span id="hdPg"></span><div class="mini">يُحمَّل مرة واحدة ثم يعمل بلا إنترنت.</div></div>';
  var B;try{B=await loadBook(b,function(g,t){var e=$('hdPg');if(e)e.textContent=t?Math.round(g/t*100)+'%':(g/1048576).toFixed(1)+' م.ب'})}catch(e){box.innerHTML='<div class="notice">تعذّر تحميل الكتاب. تحقّق من الإنترنت ثم <button id="hdRetry">أعد المحاولة</button></div>';$('hdRetry').onclick=render;return}
  if(state.book!==b)return;
  if(state.view==='search'){
    var q=norm(state.q),num=/^\d+$/.test(q)?+q:0,terms=q.split(' ').filter(Boolean);
    cur=B.hadiths.filter(function(h){if(num&&h.id===num)return true;return terms.every(function(t){return h.n.indexOf(t)>=0||(B.chMap[h.ch]&&norm(B.chMap[h.ch].title).indexOf(t)>=0)})});
    box.innerHTML='<div class="card"><b>نتائج البحث</b><div class="mini">'+cur.length+' حديثًا في '+NAME[b]+'</div></div>';shown=0;if(!cur.length)box.insertAdjacentHTML('beforeend','<div class="notice">لا نتائج. جرّب كلمة أخرى أو رقم الحديث.</div>');else more(box);
  }else if(state.view==='chapter'){
    cur=B.hadiths.filter(function(h){return h.ch===state.ch});shown=0;
    var ct=B.chMap[state.ch];
    box.innerHTML='<div class="card"><button id="hdBack">← الأبواب</button> <b>'+esc(ct?ct.title:'الباب')+'</b><div class="mini">'+cur.length+' حديثًا</div></div>';
    $('hdBack').onclick=function(){state.view='chapters';render()};more(box);window.scrollTo({top:0,behavior:'smooth'});
  }else{
    box.innerHTML='<div class="card"><b>'+NAME[b]+'</b><div class="mini">'+B.chapters.length+' بابًا • '+B.hadiths.length+' حديثًا (بحسب ترقيم الكتاب في قاعدة البيانات)</div></div>'+
     B.chapters.map(function(c){var n=B.hadiths.filter(function(h){return h.ch===c.id}).length;return '<button class="hdCh" data-c="'+c.id+'"><i>'+c.id+'</i><b style="flex:1">'+esc(c.title)+'</b><i>'+n+'</i></button>'}).join('');
    box.querySelectorAll('[data-c]').forEach(function(x){x.onclick=function(){state.view='chapter';state.ch=+x.dataset.c;render()}});
  }
}
window.v107Hadith={render:render,open:function(){ensure();render()},cfg:cfg};
function bind(){
  var c=cfg();
  var f=$('hd107Fs');if(f){f.value=String(c.fs);f.onchange=function(){var x=cfg();x.fs=+f.value;LS(K,x)}}
  var s=$('hd107Ch');if(s){s.checked=!!c.showCh;s.onchange=function(){var x=cfg();x.showCh=s.checked;LS(K,x)}}
}
var _show=window.show;
window.show=function(id){var r=_show.apply(this,arguments);if(id==='hadith107'){ensure();render()}return r};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){ensure();bind()},400)});else setTimeout(function(){ensure();bind()},400);
})();
