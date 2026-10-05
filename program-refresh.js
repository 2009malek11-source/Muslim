/* Muslim V80: presentation preferences, temporary unavailable pages, and a rebuilt children's world.
   Prayer calculations and account/auth code are intentionally not changed. */
(function(){
  'use strict';
  const $=s=>document.querySelector(s);
  if(typeof window.v57get!=='function')window.v57get=function(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch(e){return fallback}};
  if(typeof window.v57set!=='function')window.v57set=function(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}};
  if(typeof window.v57escape!=='function')window.v57escape=function(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const west=s=>String(s).replace(/[٠-٩۰-۹]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)>=0?'٠١٢٣٤٥٦٧٨٩'.indexOf(c):'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)));
  const east=s=>west(s).replace(/[0-9]/g,c=>'٠١٢٣٤٥٦٧٨٩'[Number(c)]);
  const digitKey='muslim-v80-digit-style',clockKey='muslim-v80-clock-style';
  const getPref=(key,fallback)=>{try{return localStorage.getItem(key)||fallback}catch(e){return fallback}};
  let digitStyle=getPref(digitKey,'en'),clockStyle=getPref(clockKey,'12');

  function formatTextNode(node){
    if(!node||node.nodeType!==Node.TEXT_NODE)return;
    const parent=node.parentElement;
    if(!parent||parent.closest('script,style,textarea,input,noscript,code,pre,#prayerList'))return;
    const original=west(node.nodeValue||'');
    const formatted=digitStyle==='ar'?east(original):original;
    if(node.nodeValue!==formatted)node.nodeValue=formatted;
  }
  function formatSubtree(root){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){formatTextNode(root);return}
    const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n;while((n=walk.nextNode()))formatTextNode(n);
  }
  function applyDigitStyle(){formatSubtree(document.body)}

  /* This formatter reads the already-returned prayer-time values and changes only visible text.
     It does not fetch, recalculate, offset, or write prayer times. */
  const prayerKeys={'الفجر':'Fajr','الظهر':'Dhuhr','العصر':'Asr','المغرب':'Maghrib','العشاء':'Isha','الشروق':'Sunrise'};
  function formatPrayerClock(){
    const list=$('#prayerList'),times=window._prayerTimes;
    if(!list||!times)return;
    list.querySelectorAll('.prayerRowV57,.prayerCard').forEach(row=>{
      const name=(row.querySelector('.pmain b')||row.querySelector('small'))?.textContent||'';
      const key=prayerKeys[west(name).trim()];
      const target=row.querySelector('.ptime')||row.querySelector('b');
      const raw=key&&times[key];
      const m=String(raw||'').match(/(\d{1,2}):(\d{2})/);
      if(!m||!target)return;
      const h=Number(m[1]),min=m[2];
      const baseText=clockStyle==='24'
        ?`${String(h).padStart(2,'0')}:${min}`
        :`${h%12||12}:${min} ${h>=12?'م':'ص'}`;
      const displayText=digitStyle==='ar'?east(baseText):baseText;
      if(target.textContent!==displayText)target.textContent=displayText;
    });
  }
  function updateDisplayPrefs(){
    digitStyle=$('#digitStyleV80')?.value||getPref(digitKey,'en');
    clockStyle=$('#clockStyleV80')?.value||getPref(clockKey,'12');
    try{localStorage.setItem(digitKey,digitStyle);localStorage.setItem(clockKey,clockStyle)}catch(e){}
    applyDigitStyle();formatPrayerClock();
  }
  function addDisplaySettings(){
    const grid=$('#settings .settingsGrid');if(!grid)return;
    if(!$('#displayPreferencesV80')){
      const card=document.createElement('div');card.className='setting';card.id='displayPreferencesV80';
      card.innerHTML='<b>🔢 الأرقام ونظام الساعة</b><p class="muted">تفضيلات عرض فقط؛ لا تغيّر حساب مواقيت الصلاة أو موقعك.</p><label for="digitStyleV80">شكل الأرقام</label><select id="digitStyleV80" class="field"><option value="en">الإنجليزية: 0123456789</option><option value="ar">العربية الشرقية: ٠١٢٣٤٥٦٧٨٩</option></select><label for="clockStyleV80">عرض وقت الصلاة</label><select id="clockStyleV80" class="field"><option value="12">12 ساعة (ص / م)</option><option value="24">24 ساعة</option></select>';
      grid.appendChild(card);
    }
    const digits=$('#digitStyleV80'),clock=$('#clockStyleV80');
    if(digits){digits.value=digitStyle;digits.onchange=updateDisplayPrefs}
    if(clock){clock.value=clockStyle;clock.onchange=updateDisplayPrefs}
    if(typeof window.organizeMuslimSettings==='function')window.organizeMuslimSettings();
  }

  const unavailableCopy={
    quran:{icon:'📖',title:'مصحف القرآن',back:'home',text:'ميزة المصحف غير متاحة الآن.'},
    quranDetail:{icon:'📖',title:'قراءة المصحف',back:'quran',text:'ميزة المصحف غير متاحة الآن.'},
    hadith:{icon:'📜',title:'الأحاديث',back:'home',text:'ميزة الأحاديث غير متاحة الآن.'},
    hadithDetail:{icon:'📜',title:'الحديث',back:'hadith',text:'ميزة الأحاديث غير متاحة الآن.'},
    hadithCollection:{icon:'📜',title:'الأحاديث',back:'hadith',text:'ميزة الأحاديث غير متاحة الآن.'}
  };
  function renderUnavailable(id){
    const page=document.getElementById(id),d=unavailableCopy[id];if(!page||!d)return;
    page.innerHTML=`<div class="section"><button class="back" type="button" onclick="show('${d.back}')">←</button><div><h2>${d.icon} ${d.title}</h2></div></div><div class="card unavailableCardV80"><span>${d.icon}</span><h2>${d.text}</h2><p class="muted">سيُعاد تفعيل هذا القسم في إصدار لاحق.</p><button class="primary" type="button" onclick="show('home')">العودة للرئيسية</button></div>`;
  }

  const stories=[
    {title:'نوح عليه السلام والصبر',icon:'⛵',ref:'سورة هود، الآيات 25–49',text:'دعا نوحٌ عليه السلام قومَه إلى عبادة الله، وصبر على دعوتهم زمنًا طويلًا. نتعلم من قصته الصبر والثبات وحسن التوكل على الله.'},
    {title:'يوسف عليه السلام والعفو',icon:'🌾',ref:'سورة يوسف',text:'مرّ يوسف عليه السلام بابتلاءات كثيرة، فصبر وأحسن، ثم مكّنه الله. وعندما اجتمع بأهله قابل إساءتهم بالعفو والإحسان.'},
    {title:'موسى عليه السلام والثقة بالله',icon:'🌊',ref:'سورتا طه والقصص',text:'أيّد الله موسى عليه السلام بالآيات، ونجّاه ومن معه. تذكرنا قصته أن نلجأ إلى الله ونأخذ بالأسباب ونثبت على الحق.'},
    {title:'إبراهيم عليه السلام والتوحيد',icon:'⭐',ref:'سورتا الأنبياء والصافات',text:'دعا إبراهيم عليه السلام قومه إلى عبادة الله وحده، وكان صادقًا ثابتًا. نتعلم أن نعبد الله وحده ونتحدث بالرفق والحكمة.'}
  ];
  const adhkar=[
    {text:'رَبِّ زِدْنِي عِلْمًا',source:'سورة طه، الآية 114',help:'دعاء جميل قبل التعلّم وطلب العلم.'},
    {text:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',source:'سورة البقرة، الآية 201',help:'نسأل الله الخير في الدنيا والآخرة.'},
    {text:'رَبِّ اشْرَحْ لِي صَدْرِي',source:'سورة طه، الآية 25',help:'دعاء موسى عليه السلام، نقوله عند طلب العون.'},
    {text:'رَبَّنَا اغْفِرْ لَنَا وَلِوَالِدِينَا',source:'معنى دعاء قرآني جامع',help:'ندعو لأنفسنا ولوالدينا بالخير والمغفرة.'}
  ];
  const questions=[
    {q:'كم عدد الصلوات المفروضة في اليوم والليلة؟',a:['ثلاث','خمس','سبع'],ok:1},
    {q:'في أي شهر نزل القرآن؟',a:['رمضان','شوال','محرم'],ok:0},
    {q:'ما أول سورة في المصحف؟',a:['سورة الناس','سورة الفاتحة','سورة الإخلاص'],ok:1},
    {q:'إلى أي مدينة يتجه المسلمون في الصلاة؟',a:['مكة المكرمة','القدس فقط','المدينة فقط'],ok:0},
    {q:'من خاتم الأنبياء؟',a:['موسى عليه السلام','عيسى عليه السلام','محمد ﷺ'],ok:2},
    {q:'ما الكلمة التي نقولها قبل الطعام؟',a:['بسم الله','إلى اللقاء','صباح الخير'],ok:0},
    {q:'من النبي الذي ابتلعه الحوت ثم نجّاه الله؟',a:['يونس عليه السلام','يوسف عليه السلام','إبراهيم عليه السلام'],ok:0},
    {q:'ما خُلُق المسلم مع الناس؟',a:['الرفق والصدق','السخرية','إيذاء الآخرين'],ok:0}
  ];
  let quizIndex=0,quizScore=0,answered=false;
  function kidsShell(){
    const page=$('#children');if(!page)return;
    page.innerHTML='<div class="section"><button class="back" type="button" onclick="show(\'home\')">←</button><div><h2>🧒 عالم الأطفال</h2><p>مساحة لطيفة للتعلّم والقصص والأذكار</p></div></div><div class="kidsHeroV80"><div class="kidsHeroOrbV80">🌙</div><div><span class="kidsEyebrowV80">نتعلّم ونكبر بالخير</span><h2>أهلًا بك في عالمك الصغير</h2><p>قصص قصيرة، أذكار من القرآن، وأسئلة ممتعة خطوةً خطوة.</p></div></div><div class="kidsTabsV80" role="tablist"><button type="button" data-kid-tab="stories">📖 القصص</button><button type="button" data-kid-tab="adhkar">🤲 أذكار ودعاء</button><button type="button" data-kid-tab="quiz">⭐ تحدّي المعرفة</button></div><div id="kidsContentV80"></div>';
    page.querySelectorAll('[data-kid-tab]').forEach(b=>b.onclick=()=>setKidsTab(b.dataset.kidTab));
    setKidsTab('stories');
  }
  function setKidsTab(tab){
    const host=$('#kidsContentV80');if(!host)return;
    document.querySelectorAll('#children [data-kid-tab]').forEach(b=>b.classList.toggle('active',b.dataset.kidTab===tab));
    if(tab==='stories'){
      host.innerHTML='<div class="kidsGridV80">'+stories.map((s,i)=>`<article class="kidsCardV80"><span class="kidsIconV80">${s.icon}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.ref)}</p></div><button type="button" class="primary" data-story="${i}">اقرأ القصة</button></article>`).join('')+'</div><div id="kidsDetailV80"></div>';
      host.querySelectorAll('[data-story]').forEach(b=>b.onclick=()=>{const s=stories[Number(b.dataset.story)],box=$('#kidsDetailV80');box.innerHTML=`<article class="card kidsDetailV80"><div class="kidsIconV80">${s.icon}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p><small class="mini">للمراجعة مع ولي الأمر: ${esc(s.ref)}</small></article>`;box.scrollIntoView({behavior:'smooth',block:'nearest'})});
    }else if(tab==='adhkar'){
      host.innerHTML='<div class="kidsGridV80">'+adhkar.map(a=>`<article class="kidsCardV80 kidsDhikrV80"><span class="kidsIconV80">🤲</span><div><h3>${esc(a.text)}</h3><p>${esc(a.help)}</p><small>${esc(a.source)}</small></div></article>`).join('')+'</div><p class="mini">هذه الأدعية آيات قرآنية، ويمكن قراءتها مع الأسرة والتعلّم عن معانيها.</p>';
    }else{
      quizIndex=0;quizScore=0;renderQuiz();
    }
  }
  function renderQuiz(){
    const host=$('#kidsContentV80');if(!host)return;
    if(quizIndex>=questions.length){
      host.innerHTML=`<div class="card kidsQuizV80"><div class="kidsIconV80">🏆</div><h2>أحسنت! انتهى التحدّي</h2><p>إجاباتك الصحيحة: <b>${quizScore} من ${questions.length}</b></p><button type="button" class="primary" id="kidsAgainV80">ابدأ من جديد</button></div>`;
      $('#kidsAgainV80').onclick=()=>{quizIndex=0;quizScore=0;renderQuiz()};return;
    }
    const item=questions[quizIndex];answered=false;
    host.innerHTML=`<div class="card kidsQuizV80"><div class="kidsQuizMetaV80"><span>السؤال ${quizIndex+1} من ${questions.length}</span><span>النقاط ${quizScore}</span></div><div class="kidsProgressV80"><span style="width:${Math.round(quizIndex/questions.length*100)}%"></span></div><h3>${esc(item.q)}</h3><div class="kidsOptionsV80">${item.a.map((a,i)=>`<button type="button" data-answer="${i}">${esc(a)}</button>`).join('')}</div><p id="kidsAnswerNoteV80" class="mini" aria-live="polite">اختر إجابة ثم تابع.</p><button type="button" class="primary" id="kidsNextV80" disabled>السؤال التالي</button></div>`;
    host.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
      if(answered)return;const chosen=Number(b.dataset.answer);answered=true;
      host.querySelectorAll('[data-answer]').forEach((x,i)=>{x.disabled=true;if(i===item.ok)x.classList.add('correct');else if(i===chosen)x.classList.add('wrong')});
      if(chosen===item.ok)quizScore++;
      const note=$('#kidsAnswerNoteV80');if(note)note.textContent=chosen===item.ok?'إجابة صحيحة، أحسنت!':'ليست هذه الإجابة؛ راجع الاختيار الملوّن وتعلّم منه.';
      const next=$('#kidsNextV80');if(next)next.disabled=false;
    });
    $('#kidsNextV80').onclick=()=>{if(!answered)return;quizIndex++;renderQuiz()};
  }
  window.kidWorldShowV80=setKidsTab;
  window.initChildren=kidsShell;
  window.startChildInteractiveV64=()=>{window.show('children');kidsShell();document.querySelector('#children [data-kid-tab="quiz"]')?.click()};
  window.nextChildrenQuiz=window.startChildInteractiveV64;
  window.startChildrenDuasV65=()=>{window.show('children');kidsShell();document.querySelector('#children [data-kid-tab="adhkar"]')?.click()};

  const priorShow=window.show;
  if(typeof priorShow==='function'){
    window.show=function(id){
      const result=priorShow.apply(this,arguments);
      if(unavailableCopy[id])renderUnavailable(id);
      if(id==='children')kidsShell();
      return result;
    };
  }
  function routeUnavailable(id){renderUnavailable(id);if(typeof window.show==='function')window.show(id)}
  ['initHadith','loadHadith','openHadithCollection','h67OpenBook','h67OpenChapter','h68OpenBook','h68OpenChapter','h69OpenBook','h69OpenChapter','v76OpenBook','v76OpenChapter','showHadith65','showHadithChapterV62','h66SearchTopic','renderHadith','initHadithCategories'].forEach(name=>{if(typeof window[name]==='function')window[name]=()=>{}});
  ['loadSurah','openSurahDetail','openSurahDirectV57','openKahfV57'].forEach(name=>{if(typeof window[name]==='function')window[name]=()=>routeUnavailable('quranDetail')});

  function installStyles(){
    if($('#programRefreshStylesV80'))return;
    const style=document.createElement('style');style.id='programRefreshStylesV80';
    style.textContent=`
      .heroIntroV80{display:grid!important;grid-template-columns:minmax(0,1fr) 190px;gap:25px;align-items:center;background:radial-gradient(circle at 15% 90%,rgba(221,190,120,.22),transparent 30%),linear-gradient(135deg,#0d3e31,#155b49 62%,#28785d)!important}
      .heroIntroV80 .introCopyV80{position:relative;z-index:1}.heroIntroV80 .introCopyV80 h1{font-family:inherit;font-size:clamp(30px,5vw,47px);line-height:1.35;margin:15px 0 9px}.heroIntroV80 .introCopyV80 p{max-width:560px;line-height:1.9;margin:0;color:#edf5ee}.introBismillahV80{display:block;margin-top:17px;color:#f0d99b;font-size:14px}.introActionsV80{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}.introActionsV80 button{border:1px solid #ffffff55;border-radius:13px;padding:10px 14px;color:white;background:#ffffff14;cursor:pointer}.introActionsV80 button:first-child{background:#e6d19b;color:#173c31;border-color:#e6d19b;font-weight:800}.introEmblemV80{display:grid;justify-items:center;gap:10px}.introEmblemV80 img{width:150px;height:150px;object-fit:cover;border-radius:34px;box-shadow:0 18px 40px #001b1760;border:1px solid #fff5}.introEmblemV80 small{font-size:11px;letter-spacing:3px;color:#f0d99b;font-weight:800}
      .settingsCategories{grid-template-columns:1fr!important}.settingsCategory{padding:16px}.settingsCategory.collapsedV80 .settingsCategoryGrid{display:none!important}.settingsCategoryTitle{font-size:17px;cursor:pointer;user-select:none}.settingsCategoryTitle:after{content:"⌄";margin-inline-start:auto;font-size:18px;transition:transform .18s}.settingsCategory.collapsedV80 .settingsCategoryTitle:after{content:"›";transform:rotate(180deg)}.settingsCategoryGrid{grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));align-items:stretch}.settingsCategoryGrid .setting{height:100%}#displayPreferencesV80 select{max-width:100%}
      .unavailableCardV80{min-height:44vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:34px}.unavailableCardV80>span{font-size:58px;filter:drop-shadow(0 8px 12px #0002)}.unavailableCardV80 h2{font-size:23px;margin:14px 0 4px}.unavailableCardV80 p{margin:4px 0 18px}
      #prayerList .adhanBtn{display:none!important}#prayerList .prayerRowV57{grid-template-columns:58px minmax(0,1fr) auto!important}#prayerList .prayerRowV57 .ptime{justify-self:end;white-space:nowrap}
      .kidsHeroV80{display:grid;grid-template-columns:76px 1fr;gap:16px;align-items:center;padding:21px;border-radius:23px;color:#f8f3e8;background:linear-gradient(135deg,#1b654f,#368366);box-shadow:var(--shadow)}.kidsHeroV80 h2{margin:6px 0;font-size:24px}.kidsHeroV80 p{margin:0;line-height:1.8;color:#e1eee6}.kidsHeroOrbV80{width:68px;height:68px;display:grid;place-items:center;border-radius:22px;background:#ffffff18;font-size:37px}.kidsEyebrowV80{font-size:12px;color:#f2d99c}.kidsTabsV80{display:flex;gap:8px;overflow:auto;margin:14px 0}.kidsTabsV80 button{flex:1;min-width:130px;padding:12px 14px;border:1px solid var(--line);border-radius:14px;background:var(--card);color:var(--text);font-weight:700;white-space:nowrap}.kidsTabsV80 button.active{background:var(--green);color:white}.kidsGridV80{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.kidsCardV80{display:flex;flex-direction:column;align-items:flex-start;gap:10px;min-height:175px;padding:17px;border-radius:19px;border:1px solid var(--line);background:var(--card);box-shadow:var(--glow)}.kidsCardV80 h3{margin:0;font-size:17px;line-height:1.7}.kidsCardV80 p{margin:4px 0;color:var(--muted);line-height:1.8}.kidsCardV80 small{color:var(--muted);line-height:1.7}.kidsCardV80 button{margin-top:auto}.kidsIconV80{font-size:31px}.kidsDhikrV80{min-height:160px}.kidsDhikrV80 h3{font-size:19px;line-height:2}.kidsDetailV80,.kidsQuizV80{text-align:center;padding:25px}.kidsDetailV80 p{font-size:18px;line-height:2}.kidsQuizMetaV80{display:flex;justify-content:space-between;color:var(--muted);font-size:13px}.kidsProgressV80{height:7px;background:var(--line);border-radius:10px;margin:12px 0 20px;overflow:hidden}.kidsProgressV80 span{display:block;height:100%;background:var(--green);transition:width .2s}.kidsOptionsV80{display:grid;gap:9px;margin:16px 0}.kidsOptionsV80 button{padding:12px;border:1px solid var(--line);border-radius:13px;background:var(--card);color:var(--text);cursor:pointer}.kidsOptionsV80 button.correct{border-color:#298451;background:#29845118}.kidsOptionsV80 button.wrong{border-color:#a94841;background:#a9484118}.kidsQuizV80>.primary{margin-top:10px}.kidsQuizV80>.primary:disabled{opacity:.5;cursor:not-allowed}
      @media(max-width:680px){.heroIntroV80{grid-template-columns:1fr!important;gap:15px;padding:23px!important}.introEmblemV80{grid-row:1;justify-items:start;grid-template-columns:58px auto;align-items:center}.introEmblemV80 img{width:58px;height:58px;border-radius:17px}.introEmblemV80 small{font-size:10px}.heroIntroV80 .introCopyV80 h1{font-size:31px}.kidsGridV80{grid-template-columns:1fr}.kidsHeroV80{grid-template-columns:58px 1fr;padding:16px}.kidsHeroOrbV80{width:52px;height:52px;font-size:29px;border-radius:17px}.kidsHeroV80 h2{font-size:19px}.settingsCategoryGrid{grid-template-columns:1fr}}
      @media(prefers-reduced-motion:reduce){.introEmblemV80 img,.kidsTabsV80 button,.kidsOptionsV80 button{transition:none!important}}
    `;document.head.appendChild(style);
  }

  installStyles();
  addDisplaySettings();
  applyDigitStyle();
  formatPrayerClock();
  const bodyObserver=new MutationObserver(records=>{
    for(const r of records){if(r.type==='characterData')formatTextNode(r.target);else r.addedNodes.forEach(formatSubtree)}
  });
  if(document.body)bodyObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
  const prayerList=$('#prayerList');
  if(prayerList){
    const removeRowAdhan=()=>{prayerList.querySelectorAll('.adhanBtn').forEach(button=>button.remove());formatPrayerClock()};
    removeRowAdhan();
    new MutationObserver(removeRowAdhan).observe(prayerList,{subtree:true,childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{addDisplaySettings();applyDigitStyle();formatPrayerClock()},{once:true});
})();
