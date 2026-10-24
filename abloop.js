/* =====================================================================
   المسلم v111 — تكرار مقطع من التلاوة (من نقطة إلى نقطة)
   الاستخدام: داخل صفحة القارئ اضغط «✂ تحديد مقطع» ثم المس شريط التلاوة عند
   نقطة البداية، ثم عند نقطة النهاية (أو استعمل أزرار «من هنا / إلى هنا»).
   يبدأ التكرار فورًا ويستمر إلى أن تضغط «⏹ إيقاف التكرار».
   - لا يتعارض مع «تكرار السورة/الكل»: التكرار داخل المقطع أقوى ما دام فعّالًا.
   - يُلغى تلقائيًا عند تغيير السورة أو القارئ (ملف صوت جديد).
   ===================================================================== */
(function(){
'use strict';
var $=function(i){return document.getElementById(i)};
var au,seek,box,state='idle',A=null,B=null,raf=0,src='';
function toast(m){if(window.showToast)window.showToast(m)}
function fmt(t){t=Math.max(0,Math.round(t));var m=Math.floor(t/60),s=t%60;return m+':'+(s<10?'0':'')+s}
function dur(){return isFinite(au.duration)&&au.duration>0?au.duration:0}
function isRtl(){return getComputedStyle(seek).direction==='rtl'}

function build(){
  au=$('audio');seek=$('audioSeek');box=$('customAudio');
  if(!au||!seek||!box||$('abPanel'))return;
  box.style.position='relative';
  /* شريط يظهر فوق شريط التلاوة ويبيّن المقطع المحدد */
  var tr=document.createElement('div');tr.id='abTrack';tr.innerHTML='<i id="abSeg"></i><b id="abA"></b><b id="abB"></b>';
  seek.insertAdjacentElement('afterend',tr);
  /* طبقة التقاط اللمس أثناء التحديد (حتى لا ينتقل التشغيل) */
  var ov=document.createElement('div');ov.id='abCatch';ov.setAttribute('role','button');
  seek.insertAdjacentElement('afterend',ov);
  var p=document.createElement('div');p.id='abPanel';
  p.innerHTML='<div class="controls"><button type="button" id="abStart">✂ تحديد مقطع</button></div><div id="abHint" class="mini"></div>'+
   '<div class="controls" id="abPick" style="display:none"><button type="button" id="abHereA">📍 من هنا</button><button type="button" id="abHereB">📍 إلى هنا</button><button type="button" id="abCancel">إلغاء</button></div>'+
   '<div class="controls" id="abActive" style="display:none"><button type="button" class="primary" id="abStop">⏹ إيقاف التكرار</button><button type="button" id="abEdit">✎ تعديل</button></div>';
  box.appendChild(p);
  $('abStart').onclick=begin;
  $('abCancel').onclick=cancel;
  $('abStop').onclick=function(){stopLoop(true)};
  $('abEdit').onclick=begin;
  $('abHereA').onclick=function(){setPoint(au.currentTime)};
  $('abHereB').onclick=function(){if(A===null){toast('حدّد البداية أولًا');return}setPoint(au.currentTime)};
  ov.addEventListener('click',function(e){
    var d=dur();if(!d){toast('شغّل التلاوة أولًا ثم حدّد المقطع');return}
    var r=seek.getBoundingClientRect(),f=isRtl()?(r.right-e.clientX)/r.width:(e.clientX-r.left)/r.width;
    setPoint(Math.max(0,Math.min(1,f))*d);
  });
  ov.addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
  render();
}
function begin(){
  if(!dur()){toast('شغّل التلاوة أولًا ثم اضغط «تحديد مقطع»');return}
  stopLoop(false);A=B=null;state='pickA';render();
}
function cancel(){stopLoop(false);A=B=null;state='idle';render()}
function setPoint(t){
  var d=dur();t=Math.max(0,Math.min(d,t));
  if(state==='pickA'){A=t;state='pickB';render();return}
  if(state==='pickB'){
    B=t;if(B<A){var x=A;A=B;B=x}
    if(B-A<1){toast('المقطع قصير جدًا؛ اختر نقطة أبعد (ثانية على الأقل)');B=null;return}
    if(B>d-0.25)B=d-0.25;           /* نبقى قبل نهاية الملف حتى لا يعمل «تكرار السورة» */
    state='loop';render();
    try{au.currentTime=A;var pr=au.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}
    tick();
  }
}
function stopLoop(toastIt){
  if(state==='loop'&&toastIt)toast('أُوقف تكرار المقطع');
  if(state==='loop'){state='idle';A=B=null}
  cancelAnimationFrame(raf);raf=0;render();
}
/* قياس دقيق بواسطة requestAnimationFrame بدل timeupdate (الذي يصل كل ~250ms) */
function tick(){
  cancelAnimationFrame(raf);
  if(state!=='loop')return;
  if(!au.paused&&B!==null&&au.currentTime>=B-0.03){try{au.currentTime=A}catch(e){}}
  raf=requestAnimationFrame(tick);
}
function pct(t){var d=dur();return d?Math.max(0,Math.min(100,t/d*100)):0}
function render(){
  if(!$('abPanel'))return;
  var rtl=isRtl(),side=rtl?'right':'left',tr=$('abTrack'),seg=$('abSeg'),ma=$('abA'),mb=$('abB');
  /* مواضع الشريط فوق عنصر المدى */
  tr.style.cssText='left:'+seek.offsetLeft+'px;top:'+seek.offsetTop+'px;width:'+seek.offsetWidth+'px;height:'+seek.offsetHeight+'px';
  $('abCatch').style.cssText='left:'+seek.offsetLeft+'px;top:'+(seek.offsetTop-10)+'px;width:'+seek.offsetWidth+'px;height:'+(seek.offsetHeight+20)+'px;display:'+((state==='pickA'||state==='pickB')?'block':'none');
  [seg,ma,mb].forEach(function(e){e.style.left=e.style.right='';e.style.display='none'});
  if(A!==null){ma.style.display='block';ma.style[side]=pct(A)+'%';ma.textContent='A'}
  if(B!==null){mb.style.display='block';mb.style[side]=pct(B)+'%';mb.textContent='B';seg.style.display='block';seg.style[side]=pct(A)+'%';seg.style.width=(pct(B)-pct(A))+'%'}
  var hint=$('abHint');
  $('abStart').style.display=state==='idle'?'':'none';
  $('abPick').style.display=(state==='pickA'||state==='pickB')?'':'none';
  $('abActive').style.display=state==='loop'?'':'none';
  $('abHereB').style.display=state==='pickB'?'':'none';
  $('abHereA').style.display=state==='pickA'?'':'none';
  hint.textContent=state==='pickA'?'① المس الشريط عند نقطة البداية':state==='pickB'?'② المس الشريط عند نقطة النهاية (البداية '+fmt(A)+')':state==='loop'?'🔁 تكرار من '+fmt(A)+' إلى '+fmt(B)+' — يستمر حتى تضغط إيقاف':'';
}
/* تغيّر الملف الصوتي ⇒ إلغاء المقطع القديم */
function watch(){
  var s=au.currentSrc||au.src||'';
  if(src&&s&&s!==src&&state!=='idle'){state='idle';A=B=null;cancelAnimationFrame(raf)}
  src=s;render();
}
function boot(){
  build();if(!au)return;
  au.addEventListener('loadedmetadata',watch);au.addEventListener('emptied',function(){state='idle';A=B=null;render()});
  au.addEventListener('play',function(){if(state==='loop')tick()});
  au.addEventListener('seeked',render);
  window.addEventListener('resize',render);
  var _s=window.show;
  window.show=function(id){var r=_s.apply(this,arguments);if(id==='readerDetail')setTimeout(render,80);return r};
}
window.v107AB={get:function(){return{state:state,A:A,B:B}},_set:setPoint,_begin:begin};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,500)});else setTimeout(boot,500);
})();
