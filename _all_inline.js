



const audio=document.getElementById('audio');
const audioSeek=document.getElementById('audioSeek'),audioPlayBtn=document.getElementById('audioPlayBtn'),audioTime=document.getElementById('audioTime'),audioTitle=document.getElementById('audioTitle');
function fmtTime(v){if(!Number.isFinite(v))return '0:00';const m=Math.floor(v/60),s=Math.floor(v%60);return m+':'+String(s).padStart(2,'0')}
function updateAudioUI(){if(!audio)return;const playing=!audio.paused;audioPlayBtn.textContent=playing?'⏸ إيقاف':'▶ تشغيل';audioSeek.value=audio.duration?audio.currentTime/audio.duration*100:0;audioTime.textContent=fmtTime(audio.currentTime)+' / '+fmtTime(audio.duration);const bar=document.getElementById('globalAudioBar'),gp=document.getElementById('globalAudioPlayBtn'),gm=document.getElementById('globalAudioMuteBtn'),gt=document.getElementById('globalAudioTitle'),gr=document.getElementById('globalAudioReciter');if(bar){bar.classList.toggle('show',!!audio.src);if(gp)gp.textContent=playing?'⏸ إيقاف':'▶ تشغيل';if(gm)gm.textContent=audio.muted?'🔇 مكتوم':'🔊 الصوت';if(gt)gt.textContent=audioTitle?.textContent||'تلاوة القرآن';if(gr)gr.textContent=playerReciter?.textContent||'القارئ'}}
function syncGlobalMiniPlayer(){const bar=document.getElementById('globalMiniPlayer');if(!bar)return;if(!audio.src){bar.style.display='none';bar.classList.remove('show');return}if(document.getElementById('readerDetail')?.classList.contains('active')){bar.style.display='none';bar.classList.remove('show');return}bar.style.display='flex';bar.classList.add('show');const title=document.getElementById('miniPlayerTitle'),reader=document.getElementById('miniPlayerReader'),play=document.getElementById('miniPlayBtn'),mute=document.getElementById('miniMuteBtn');if(title)title.textContent=audioTitle?.textContent||now?.textContent||'تلاوة';if(reader)reader.textContent=currentReader?.name||'القارئ';if(play)play.textContent=audio.paused?'▶ تشغيل':'⏸ إيقاف';if(mute)mute.textContent=audio.muted?'🔇 مكتوم':'🔊 صوت'}
audio.addEventListener('play',syncGlobalMiniPlayer);audio.addEventListener('pause',syncGlobalMiniPlayer);audio.addEventListener('volumechange',syncGlobalMiniPlayer);audio.addEventListener('loadedmetadata',syncGlobalMiniPlayer);audio.addEventListener('emptied',syncGlobalMiniPlayer);
function openCurrentReaderFromMini(ev){if(ev?.target?.closest('.miniPlayerActions'))return;if(!currentReader)return;show('readerDetail');document.getElementById('readerTitle').textContent=currentReader.name||'القارئ';document.getElementById('readerDetailSubtitle').textContent='صفحة القارئ • اختر سورة واستمع';renderSongs(document.getElementById('songSearch')?.value||'');}
function toggleAudio(){if(!audio.src)return;if(audio.paused)audio.play().catch(()=>{});else audio.pause()}
function stopAudio(){audio.pause();audio.currentTime=0;updateAudioUI()}
function toggleMute(){audio.muted=!audio.muted;document.getElementById('audioMuteBtn').textContent=audio.muted?'🔇 مكتوم':'🔊 الصوت';updateAudioUI()}
audio.addEventListener('timeupdate',updateAudioUI);audio.addEventListener('loadedmetadata',updateAudioUI);audio.addEventListener('play',updateAudioUI);audio.addEventListener('pause',updateAudioUI);audio.addEventListener('ended',updateAudioUI);audioSeek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=Number(audioSeek.value)/100*audio.duration});

const S=["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
const RECITERS=[
{name:'إبراهيم الأخضر',edition:'mp3quran',search:['إبراهيم الأخضر','Ibrahim Al-Akdar']},
{name:'أحمد بن علي العجمي',edition:'mp3quran',search:['أحمد بن علي العجمي','Ahmad Al-Ajmy']},
{name:'إدريس أبكر',edition:'mp3quran',search:['إدريس أبكر','Idrees Abkr','Idrees Abkar']},
{name:'أبو بكر الشاطري',edition:'mp3quran',search:['أبو بكر الشاطري','Abu Bakr Al Shatri']},
{name:'خالد الجليل',edition:'mp3quran',search:['خالد الجليل','Khalid Al-Jileel','Khalid Al Jileel']},
{name:'سعد الغامدي',edition:'mp3quran',search:['سعد الغامدي','Saad Al-Ghamdi']},
{name:'سعود الشريم',edition:'mp3quran',search:['سعود الشريم','Saud Al-Shuraim']},
{name:'صلاح بو خاطر',edition:'mp3quran',search:['صلاح بو خاطر','Slaah Bukhatir','Salah Bukhatir']},
{name:'عبدالباسط عبدالصمد',edition:'mp3quran',search:['عبدالباسط عبدالصمد','Abdulbasit Abdulsamad']},
{name:'عبدالرحمن السديس',edition:'mp3quran',search:['عبدالرحمن السديس','Abdulrahman Alsudaes']},
{name:'ناصر القطامي',edition:'mp3quran',search:['ناصر القطامي','Nasser Al Qatami']},
{name:'ياسر الدوسري',edition:'mp3quran',search:['ياسر الدوسري','Yasser Al-Dossary']},
{name:'هزاع البلوشي',edition:'mp3quran',search:['هزاع البلوشي','Hazza Al-Balushi']},
{name:'أحمد النفيس',edition:'mp3quran',search:['أحمد النفيس','Ahmad Al Nufais']},
{name:'مشاري راشد العفاسي',edition:'mp3quran',search:['مشاري راشد العفاسي','مشاري العفاسي','Mishary Rashid Alafasy']},
{name:'فارس عباد',edition:'mp3quran',search:['فارس عباد','Fares Abbad']},
{name:'صلاح البدير',edition:'mp3quran',search:['صلاح البدير','Salah Albudair']},
{name:'أحمد سعود',edition:'mp3quran',search:['أحمد سعود','Ahmad Saud']},
{name:'خليفة الطنيجي',edition:'mp3quran',search:['خليفة الطنيجي','Khalifa Altunaiji']},
{name:'صالح آل طالب',edition:'mp3quran',search:['صالح آل طالب','Saleh Al-Talib']}
];
RECITERS.forEach((r,i)=>{r.id=r.id||('reader-'+i)});
let currentReader=null,currentSurah=1,repeat='none',n=0,supabaseClient=null,currentUser=null,readerToken=0;
function show(id){
 document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
 const el=document.getElementById(id); if(!el)return;
 el.classList.add('active'); scrollTo(0,0);
 const back=document.getElementById('globalBackBtn');
 if(back) back.style.display=(id==='home')?'none':'block';
 const bar=document.getElementById('globalMiniPlayer');
 if(bar && audio && audio.src){
   bar.classList.toggle('show', id!=='readerDetail');
   bar.style.display=(id!=='readerDetail')?'flex':'none';
 }
} 
function goBackFromCurrent(){
 const active=document.querySelector('.page.active');
 if(!active || active.id==='home'){return;}
 if(active.id==='readerDetail'){show('readers');return;}
 if(active.id==='quranDetail'){show('quran');return;}
 show('home');
}
function toggleDark(){document.body.classList.toggle('dark');saveSettings()}
function authMode(m){loginTab.classList.toggle('active',m==='login');signupTab.classList.toggle('active',m==='signup');name.style.display=m==='signup'?'block':'none';name.required=m==='signup';authMsg.textContent=m==='signup'?'أنشئ حسابًا جديدًا باسمك وبريدك وكلمة مرورك.':'أدخل بيانات حسابك.';document.querySelector('#auth form').dataset.mode=m}
async function submitAuth(e){e.preventDefault();if(!supabaseClient){authMsg.textContent='أولًا أنشئ supabase-config.js من الملف النموذجي وضع بيانات مشروعك.';return}const mode=document.querySelector('#auth form').dataset.mode||'login';const email=document.getElementById('email').value.trim();const password=document.getElementById('password').value;authMsg.textContent='جارٍ التنفيذ...';let r;if(mode==='signup'){r=await supabaseClient.auth.signUp({email,password,options:{data:{name:name.value.trim()}}});}else{r=await supabaseClient.auth.signInWithPassword({email,password});}if(r.error){authMsg.textContent=r.error.message;return}authMsg.textContent=mode==='signup'?'تم إنشاء الحساب. إذا طُلب تأكيد البريد، افتح رسالة التأكيد ثم عد للموقع.':'تم تسجيل الدخول.';await refreshUser()}
async function logout(){if(supabaseClient)await supabaseClient.auth.signOut();currentUser=null;document.body.classList.remove('admin');updateUserUI()}
async function refreshUser(){if(!supabaseClient)return;const {data:{user}}=await supabaseClient.auth.getUser();currentUser=user;if(!user){updateUserUI();return}const {data:p}=await supabaseClient.from('profiles').select('name,role').eq('id',user.id).maybeSingle();document.body.classList.toggle('admin',p?.role==='admin');welcomeName.textContent=p?.name||user.email;welcomeState.textContent='تم تسجيل الدخول وحفظ بياناتك.';homeAuthBtn.textContent='حسابي';settingsAccount.textContent=user.email+(p?.role==='admin'?' • مالك':'');logoutBtn.style.display='block';await loadSettings()}
function updateUserUI(){welcomeName.textContent='زائر';welcomeState.textContent='سجّل دخولك لحفظ تقدمك وإعداداتك.';homeAuthBtn.textContent='تسجيل الدخول';settingsAccount.textContent='غير مسجل الدخول';logoutBtn.style.display='none'}
async function saveSettings(){localStorage.setItem('quran-m09-dark',document.body.classList.contains('dark')?'1':'0');if(!supabaseClient||!currentUser)return;await supabaseClient.from('user_settings').upsert({user_id:currentUser.id,dark_mode:document.body.classList.contains('dark'),last_surah:currentSurah,last_reciter:currentReader?.id||currentReader?.name||null,last_listened_surah:currentSurah,updated_at:new Date().toISOString()})}
async function loadSettings(){if(!currentUser)return;const {data}=await supabaseClient.from('user_settings').select('*').eq('user_id',currentUser.id).maybeSingle();if(data?.dark_mode)document.body.classList.add('dark');if(data?.last_surah)currentSurah=data.last_surah}
let selectedRewaya='حفص عن عاصم';
const REWAYA_OPTIONS=['حفص عن عاصم','قالون عن نافع','ورش عن نافع','الدوري عن أبي عمرو','السوسي عن أبي عمرو','شعبة عن عاصم','البزي عن ابن كثير','قنبل عن ابن كثير','خلف عن حمزة','خلاد عن حمزة','أخرى'];
function initRewayaChooser(){const box=document.getElementById('rewayaChooser');if(!box)return;box.innerHTML=REWAYA_OPTIONS.map(r=>`<button class="rewayaBtn ${r===selectedRewaya?'active':''}" onclick="selectRewaya('${r}')">${r}</button>`).join('');document.getElementById('selectedRewaya').textContent='الرواية المختارة: '+selectedRewaya;}
function selectRewaya(r){selectedRewaya=r;localStorage.setItem('quran-m09-rewaya',r);initRewayaChooser();renderSurahs();}
async function loadSurah(num){try{const edition=selectedRewaya.includes('ورش')?'warsh':selectedRewaya.includes('قالون')?'qalon':'quran-uthmani';const r=await fetch(`https://api.alquran.cloud/v1/surah/${num}/${edition}`);const j=await r.json();const d=j.data;if(!d)throw new Error('تعذر تحميل السورة');document.getElementById('surahs').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><div><b>${d.number}. ${d.name}</b><div class="mini">الرواية: ${xSafe(selectedRewaya)}</div></div><button class="back" onclick="renderSurahs()">رجوع</button></div><div class="card">${d.ayahs.map(a=>`<div class="ayah">${a.text} <span class="mini">﴿${a.numberInSurah}﴾</span></div>`).join('')}</div>`;currentSurah=num;saveSettings()}catch(e){document.getElementById('surahs').innerHTML='<div class="notice">تعذر تحميل هذه الرواية من المصدر الحالي. جرّب رواية أخرى.</div>'}}
async function openSurahDetail(num){try{const edition=selectedRewaya.includes('ورش')?'warsh':selectedRewaya.includes('قالون')?'qalon':'quran-uthmani';const r=await fetch(`https://api.alquran.cloud/v1/surah/${num}/${edition}`);const j=await r.json();const d=j.data;if(!d)throw new Error('تعذر تحميل السورة');currentSurah=num;document.getElementById('quranDetailTitle').textContent=`📖 ${d.name}`;document.getElementById('quranDetailSubtitle').textContent=`السورة ${d.number} • ${selectedRewaya}`;document.getElementById('quranDetailBox').innerHTML=`<div class="mushafToolbar"><div class="group"><button onclick="changeMushafFont(-1)">A−</button><button onclick="changeMushafFont(1)">A+</button></div><div class="group"><button onclick="toggleMushafFocus()">📖 وضع القراءة</button><button class="favBtn ${isFavQuran(num)?'active':''}" onclick="toggleFavQuran(${num});openSurahDetail(${num})">${isFavQuran(num)?'★ في المفضلة':'☆ إضافة للمفضلة'}</button></div></div><div class="mushafHeader"><h2>${xSafe(d.name)}</h2><div class="mini">${d.numberOfAyahs} آية • ${xSafe(selectedRewaya)}</div><div class="basmala">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div></div><div class="quranAyahs" id="mushafText">${d.ayahs.map(a=>`<div class="ayah"><span class="ayahNum">${a.numberInSurah}</span>${xSafe(a.text)}</div>`).join('')}</div>`;saveSettings();show('quranDetail')}catch(e){document.getElementById('quranDetailBox').innerHTML='<div class="notice">تعذر تحميل السورة من المصدر الحالي. جرّب رواية أخرى.</div>';show('quranDetail')}}
let mushafFont=28;function changeMushafFont(delta){mushafFont=Math.max(20,Math.min(38,mushafFont+delta));document.querySelectorAll('#mushafText .ayah').forEach(x=>x.style.fontSize=mushafFont+'px');localStorage.setItem('quran-m09-mushaf-font',String(mushafFont))}function toggleMushafFocus(){document.body.classList.toggle('mushafFocus');localStorage.setItem('quran-m09-mushaf-focus',document.body.classList.contains('mushafFocus')?'1':'0')}

function isFavQuran(num){return readFavStore().quran.some(a=>Number(a.number)===Number(num))}
function toggleFavQuran(num){const id=`q-${num}`,x=readFavStore();if(x.quran.some(a=>a.id===id))favRemove('quran',id);else favAdd('quran',{id,number:Number(num),name:S[num-1]||'سورة',rewaya:selectedRewaya});renderSurahs(document.getElementById('qsearch')?.value||'');if(document.getElementById('favorites')?.classList.contains('active'))renderFavorites('quran')}
function renderSurahs(q=''){surahs.innerHTML=S.map((x,i)=>({x,i})).filter(o=>o.x.includes(q)).map(o=>`<div class="listrow" onclick="openSurahDetail(${o.i+1})"><span class="num">${o.i+1}</span><b>${o.x}</b><span class="mini">${selectedRewaya}</span><button class="favBtn ${isFavQuran(o.i+1)?'active':''}" onclick="event.stopPropagation();toggleFavQuran(${o.i+1})">${isFavQuran(o.i+1)?'★':'☆'}</button></div>`).join('')}
qsearch.oninput=e=>renderSurahs(e.target.value);selectedRewaya=localStorage.getItem('quran-m09-rewaya')||selectedRewaya;initRewayaChooser();renderSurahs();
async function loadReciters(){readerList.innerHTML='<div class="notice">⏳ جارٍ تحميل القراء والروايات…</div>';try{const rs=await getMp3QuranReciters();const all=[];for(const r of rs){for(const m of (r.moshaf||[])){if(!m?.server)continue;const list=String(m.surah_list||'').split(',').filter(Boolean).map(Number);all.push({id:`mp3-${r.id}-${m.id}`,mp3Id:r.id,name:r.name,edition:'mp3quran',server:m.server,moshafId:m.id,surahList:list,rewaya:m.name||'رواية غير محددة',search:[r.name,m.name||'']});}}all.sort((a,b)=>a.name.localeCompare(b.name,'ar')||a.rewaya.localeCompare(b.rewaya,'ar'));RECITERS.splice(0,RECITERS.length,...all);migrateOldFavorites();buildReaderFilters();loadReciterCards();initRepeatAyah();}catch(e){readerList.innerHTML='<div class="notice">❌ تعذر تحميل قائمة القراء الآن. أعد المحاولة.</div>';console.error(e)}}
async function openReader(i){readerToken++;currentReader=RECITERS[i];if(!currentReader)return;readerTitle.textContent=currentReader.name;document.getElementById('readerDetailSubtitle').textContent='صفحة القارئ • اختر سورة واستمع';const readerIndex=RECITERS.indexOf(currentReader);const photo=await getReciterPhoto(currentReader);document.getElementById('readerProfile').innerHTML=`<div class="profilePhotoWrap">${photo?`<img class="profileReciterPhoto" src="${xSafe(photo)}" alt="${xSafe(currentReader.name)}" referrerpolicy="no-referrer">`:'<div class="profileReciterPhoto placeholder">صورة القارئ</div>'}</div><h3>${xSafe(currentReader.name)}</h3><p class="mini">الرواية: ${xSafe(currentReader.rewaya||'غير محددة')} • ${currentReader.surahList?.length||0} سورة متاحة</p><button class="favBtn ${isFavReader(currentReader)?'active':''}" onclick="toggleFavReader(${readerIndex})">${isFavReader(currentReader)?'★ في المفضلة':'☆ إضافة للمفضلة'}</button></div>`;playerReciter.textContent='🎙️ '+currentReader.name+' • '+currentReader.rewaya;const st=document.getElementById('downloadStatus');st.style.display='block';st.innerHTML='⏳ جارٍ التحقق من التلاوة…';renderSongs();show('readerDetail');try{await ensureAudioUrl((currentReader.surahList||[1])[0]);st.style.display='none';st.innerHTML='';}catch(e){st.innerHTML='❌ هذه القراءة غير متاحة حاليًا. اختر قراءة أخرى.';}}
let readerFilter='الكل';
function buildReaderFilters(){const box=document.getElementById('readerFilters');if(!box)return;const cats=['الكل','حفص','قالون','ورش','الدوري','شعبة','البزي','قنبل','خلف','خلاد','أخرى'];box.innerHTML=cats.map(c=>`<button class="favBtn ${readerFilter===c?'active':''}" onclick="readerFilter='${c}';buildReaderFilters();loadReciterCards(document.getElementById('readerSearch')?.value||'')">${c}</button>`).join('')}
function readerMatchesFilter(r){if(readerFilter==='الكل')return true;const x=(r.rewaya||'')+' '+(r.name||'');if(readerFilter==='أخرى')return !/حفص|قالون|ورش|الدوري|شعبة|البزي|قنبل|خلف|خلاد/i.test(x);return x.includes(readerFilter)}
let mp3QuranRecitersPromise=null;
async function getMp3QuranReciters(){
  if(!mp3QuranRecitersPromise) mp3QuranRecitersPromise=fetch('https://www.mp3quran.net/api/v3/reciters?language=ar').then(r=>{if(!r.ok)throw new Error('reciters');return r.json()}).then(j=>j.reciters||[]);
  return mp3QuranRecitersPromise;
}
async function resolveAudioUrl(num){
  if(currentReader.edition!=='mp3quran'){
    const bitrate=currentReader.bitrate||128;
    return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${currentReader.edition}/${String(num)}.mp3`;
  }
  if(currentReader.server) return `${currentReader.server}${String(num).padStart(3,'0')}.mp3`;
  throw new Error('reciter_not_found');
}
function audioUrl(num){
  if(currentReader?.edition==='mp3quran') return currentReader._resolvedUrls?.[num] || '';
  const bitrate=currentReader?.bitrate||128;
  return `https://cdn.islamic.network/quran/audio-surah/${bitrate}/${currentReader.edition}/${String(num)}.mp3`;
}
async function ensureAudioUrl(num){
  if(currentReader?.edition!=='mp3quran') return audioUrl(num);
  currentReader._resolvedUrls=currentReader._resolvedUrls||{};
  if(currentReader._resolvedUrls[num]) return currentReader._resolvedUrls[num];
  const u=await resolveAudioUrl(num); currentReader._resolvedUrls[num]=u; return u;
}
const FAV_KEY='quran-m09-favorites-v26';
function favDefaults(){return {readers:[],hadiths:[],adhkar:[],quran:[]}}
function favScope(){return 'local'}
function readFavStore(){try{const x=JSON.parse(localStorage.getItem(FAV_KEY)||'null');if(x&&typeof x==='object')return {...favDefaults(),...x}}catch{}return favDefaults()}
function writeFavStore(x){localStorage.setItem(FAV_KEY,JSON.stringify(x))}
function normalizeFavId(v){return String(v??'').trim()}
function favAdd(type,item){const x=readFavStore();x[type]=Array.isArray(x[type])?x[type]:[];const id=normalizeFavId(item.id);if(!id)return;if(!x[type].some(a=>normalizeFavId(a.id)===id))x[type].push(item);writeFavStore(x)}
function favRemove(type,id){const x=readFavStore();x[type]=(x[type]||[]).filter(a=>normalizeFavId(a.id)!==normalizeFavId(id));writeFavStore(x)}
function migrateOldFavorites(){
  const x=readFavStore();
  try{
    const old=(type)=>JSON.parse(localStorage.getItem(`quran-m09-favorites:guest:${type}`)||'[]');
    for(const id of old('readers')){const r=RECITERS.find(r=>readerFavId(r)===String(id));if(r)favAdd('readers',{id:readerFavId(r),name:r.name,rewaya:r.rewaya||'',mp3Id:r.mp3Id||'',server:r.server||'',edition:r.edition||'mp3quran',surahList:r.surahList||[]})}
    for(const i of old('hadiths')){const h=HADITHS[Number(i)];if(h)favAdd('hadiths',{id:`h-${i}`,text:h.text,source:h.source,grade:h.grade,category:h.category})}
    for(const id of old('adhkar')){const [kind,i]=String(id).split(':');const z=(ADHKAR[kind]||[])[Number(i)];if(z)favAdd('adhkar',{id:`z-${kind}-${i}`,kind,index:Number(i),text:z.text,count:z.count,source:z.source})}
    for(const id of old('quran')){const n=Number(id);if(S[n-1])favAdd('quran',{id:`q-${n}`,number:n,name:S[n-1],rewaya:selectedRewaya})}
  }catch(e){console.warn('favorite migration',e)}
  // Also recover items from the previous experimental store if present.
  try{const legacy=JSON.parse(localStorage.getItem('quran_m09alaroud_favorites_v2510')||'null');if(legacy){for(const r of legacy.reciters||[]){if(r?.name)favAdd('readers',{id:readerFavId(r),name:r.name,rewaya:r.rewaya||'',mp3Id:r.mp3Id||''})}for(const h of legacy.hadiths||[]){if(h?.text)favAdd('hadiths',{id:normalizeFavId(h.id)||`h-${Date.now()}-${Math.random()}`,text:h.text,source:h.source||'',grade:h.grade||'',category:h.category||''})}for(const z of legacy.adhkar||[]){if(z?.text)favAdd('adhkar',{id:normalizeFavId(z.id)||`z-${Date.now()}-${Math.random()}`,text:z.text,count:z.count||1,source:z.source||'',kind:z.kind||''})}for(const q of legacy.quran||[]){const n=Number(q.number||q.id);if(S[n-1])favAdd('quran',{id:`q-${n}`,number:n,name:S[n-1],rewaya:q.rewaya||selectedRewaya})}}}catch(e){}
}
function readFavs(type){const x=readFavStore();return (x[type]||[]).map(a=>a.id)}
function writeFavs(type,arr){const x=readFavStore();const old=x[type]||[];x[type]=arr.map(id=>old.find(a=>String(a.id)===String(id))||({id:String(id)}));writeFavStore(x)}
function toggleFavHadith(i){const h=HADITHS[Number(i)];if(!h)return;const id=`h-${i}`,x=readFavStore();if((x.hadiths||[]).some(a=>a.id===id))favRemove('hadiths',id);else favAdd('hadiths',{id,text:h.text,source:h.source,grade:h.grade,category:h.category});renderHadith();renderFavorites('hadiths')}
function toggleFavAdhkar(kind,i){const z=(ADHKAR[kind]||[])[Number(i)];if(!z)return;const id=`z-${kind}-${i}`,x=readFavStore();if((x.adhkar||[]).some(a=>a.id===id))favRemove('adhkar',id);else favAdd('adhkar',{id,kind,index:Number(i),text:z.text,count:z.count,source:z.source});renderAdhkar(currentAdhkarKind||'صباح');renderFavorites('adhkar')}
function isFavHadith(i){return readFavStore().hadiths.some(a=>a.id===`h-${i}`)}
function isFavAdhkar(kind,i){return readFavStore().adhkar.some(a=>a.id===`z-${kind}-${i}`)}
function reciterPhotoSearchUrl(r){
  const name=String(r?.name||'').trim();
  return 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent('"'+name+'"')+'&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=320&format=json&origin=*';
}
const photoCache=new Map();
function photoNameScore(title,name){
  const t=String(title||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ');
  const n=String(name||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').split(' ').filter(Boolean);
  if(!n.length)return 0;
  let score=0; for(const part of n){if(part.length>2&&t.includes(part))score++;}
  return score/n.length;
}
async function getReciterPhoto(r){
  const key=String(r?.id||r?.name||''); if(photoCache.has(key)) return photoCache.get(key);
  const p=(async()=>{try{
    const j=await (await fetch(reciterPhotoSearchUrl(r),{cache:'force-cache'})).json();
    const pages=Object.values(j?.query?.pages||{});
    pages.sort((a,b)=>photoNameScore(b?.title,r?.name)-photoNameScore(a?.title,r?.name));
    const best=pages.find(x=>photoNameScore(x?.title,r?.name)>=0.45 && x?.imageinfo?.[0]?.thumburl);
    return best?.imageinfo?.[0]?.thumburl || best?.imageinfo?.[0]?.url || '';
  }catch(e){return ''}})(); photoCache.set(key,p); return p;
}
function reciterAvatar(r,i){const id='reciter-photo-'+i;return `<div class="reciterAvatar" id="${id}" aria-label="صورة ${xSafe(r.name)}"><span class="photoFallback">صورة القارئ</span></div>`}
async function hydrateReciterPhotos(){document.querySelectorAll('[data-reciter-index]').forEach(async el=>{const i=Number(el.dataset.reciterIndex),r=RECITERS[i];if(!r)return;const url=await getReciterPhoto(r);const box=el.querySelector('.reciterAvatar');if(!box)return;if(url){box.innerHTML=`<img src="${xSafe(url)}" alt="${xSafe(r.name)}" loading="lazy" referrerpolicy="no-referrer">`;box.classList.add('hasPhoto')}else{box.innerHTML='<span class="photoFallback">لا توجد صورة</span>';box.classList.add('noPhoto')}})}
function loadReciterCards(q=''){const query=(q||'').trim().toLowerCase();const items=RECITERS.map((r,i)=>({r,i})).filter(o=>readerMatchesFilter(o.r)&&(!query||o.r.name.toLowerCase().includes(query)||(o.r.search||[]).some(x=>String(x).toLowerCase().includes(query))));readerList.innerHTML=items.map(o=>`<div class="reader" data-reciter-index="${o.i}" onclick="openReader(${o.i})"><div class="readerTop"><div>${reciterAvatar(o.r,o.i)}</div><button class="favBtn ${isFavReader(o.r)?'active':''}" onclick="event.stopPropagation();toggleFavReader(${o.i})">${isFavReader(o.r)?'★ مفضل':'☆ مفضل'}</button></div><b>${xSafe(o.r.name)}</b><small>${xSafe(o.r.rewaya)} • ${o.r.surahList.length} سورة</small></div>`).join('')||'<div class="favEmpty" style="grid-column:1/-1">لا يوجد قارئ/رواية مطابقة.</div>';hydrateReciterPhotos()}
function renderFavorites(type='readers'){
 const box=document.getElementById('favoritesList');if(!box)return;
 document.querySelectorAll('.favCategoryBtn').forEach(b=>b.classList.toggle('active',b.dataset.fav===type));
 const x=readFavStore();
 if(type==='readers'){
  const arr=x.readers||[];
  box.innerHTML=`<div class="favCategoryCard"><h3>🎙️ المشايخ والقراء</h3>${arr.length?arr.map(r=>`<div class="favItem"><div class="main"><b>${xSafe(r.name||'قارئ')}</b><small class="mini">${xSafe(r.rewaya||'')}</small></div><div class="controls">${favActionBtn('فتح','openFavoriteReader(\''+String(r.id).replaceAll("'","\\'")+'\')','primary')}${favActionBtn('إزالة','toggleFavReaderById(\''+String(r.id).replaceAll("'","\\'")+'\')','favBtn active')}</div></div>`).join(''):'<div class="v2510-empty">لم تضف أي شيخ أو قارئ بعد.</div>'}</div>`;
 }else if(type==='hadiths'){
  const arr=x.hadiths||[];
  box.innerHTML=`<div class="favCategoryCard"><h3>📜 الأحاديث</h3>${arr.length?arr.map(h=>`<div class="favItem"><div class="main"><b>${xSafe(h.text||'حديث')}</b><small class="mini">${xSafe(h.source||'')} • ${xSafe(h.grade||'')}</small></div><div class="controls">${favActionBtn('فتح','openFavoriteHadith(\''+String(h.id).replaceAll("'","\\'")+'\')','primary')}${favActionBtn('إزالة','removeFavorite(\'hadiths\',\''+String(h.id).replaceAll("'","\\'")+'\')','favBtn active')}</div></div>`).join(''):'<div class="v2510-empty">لم تضف أي حديث بعد.</div>'}</div>`;
 }else if(type==='adhkar'){
  const arr=x.adhkar||[];
  box.innerHTML=`<div class="favCategoryCard"><h3>🤲 الأذكار</h3>${arr.length?arr.map(z=>`<div class="favItem"><div class="main"><b>${xSafe(z.text||'ذكر')}</b><small class="mini">${xSafe(z.kind||'')} • ${z.count||1} مرات • ${xSafe(z.source||'')}</small></div><div class="controls">${favActionBtn('فتح','openFavoriteAdhkar(\''+String(z.kind||'صباح').replaceAll("'","\\'")+'\','+Number(z.index??0)+')','primary')}${favActionBtn('إزالة','removeFavorite(\'adhkar\',\''+String(z.id).replaceAll("'","\\'")+'\')','favBtn active')}</div></div>`).join(''):'<div class="v2510-empty">لم تضف أي ذكر بعد.</div>'}</div>`;
 }else{
  const arr=x.quran||[];
  box.innerHTML=`<div class="favCategoryCard"><h3>📖 القرآن والسور</h3>${arr.length?arr.map(q=>`<div class="favItem"><div class="main"><b>${q.number||''}. ${xSafe(q.name||'سورة')}</b><small class="mini">${xSafe(q.rewaya||'')}</small></div><div class="controls">${favActionBtn('فتح','openSurahDetail('+Number(q.number)+')','primary')}${favActionBtn('إزالة','removeFavorite(\'quran\',\''+String(q.id).replaceAll("'","\\'")+'\')','favBtn active')}</div></div>`).join(''):'<div class="v2510-empty">لم تضف أي سورة بعد.</div>'}</div>`;
 }
}
function openFavoriteReader(id){const r=RECITERS.find(r=>readerFavId(r)===String(id));if(r){openReader(RECITERS.indexOf(r));return}const saved=readFavStore().readers.find(r=>String(r.id)===String(id));if(saved){currentReader={...saved,edition:'mp3quran',server:saved.server||'',surahList:saved.surahList||[]};readerTitle.textContent=saved.name;playerReciter.textContent='🎙️ '+saved.name+' • '+(saved.rewaya||'');document.getElementById('readerProfile').innerHTML=`<div class="detailIcon">🎙️</div><h3>${xSafe(saved.name)}</h3><p class="mini">الرواية: ${xSafe(saved.rewaya||'')}</p>`;renderSongs();show('readerDetail')}}
function openFavoriteHadith(id){
 const h=readFavStore().hadiths.find(x=>String(x.id)===String(id));if(!h)return;
 const idx=(HADITHS||[]).findIndex(x=>String(x.id||'')===String(h.originalId||'') || x.text===h.text);
 document.getElementById('hadithDetailBox').innerHTML=`<div class="detailHero card"><div class="detailIcon">📜</div><h2>الحديث</h2><div class="detailText">${xSafe(h.text||'')}</div><p class="mini">📚 ${xSafe(h.source||'')} • الدرجة: ${xSafe(h.grade||'')}</p><div class="controls" style="justify-content:center"><button class="favBtn active" onclick="removeFavorite('hadiths','${String(h.id).replaceAll("'","\\'")}');show('hadithDetail')">إزالة من المفضلة</button><button onclick="playHumanHadith(${idx>=0?idx:0})">🔊 استماع بصوت بشري</button></div></div>`;
 show('hadithDetail');
}
function openFavoriteAdhkar(kind,i){openAdhkarDetail(kind,i)}
function removeFavorite(type,id){favRemove(type,id);renderFavorites(document.getElementById('favoritesType')?.value||type);if(type==='hadiths')renderHadith();if(type==='adhkar')renderAdhkar(currentAdhkarKind||'صباح');if(type==='quran')renderSurahs(document.getElementById('qsearch')?.value||'');if(type==='readers')loadReciterCards(document.getElementById('readerSearch')?.value||'')}
function readerFavId(r){return String(r?.id||r?.mp3Id||r?.name||'').trim()}
function isFavReader(r){return readFavStore().readers.some(a=>String(a.id)===readerFavId(r))}
function toggleFavReader(i){const r=RECITERS[i];if(!r)return;const id=readerFavId(r),x=readFavStore();if(x.readers.some(a=>String(a.id)===id))favRemove('readers',id);else favAdd('readers',{id,name:r.name,rewaya:r.rewaya||'',mp3Id:r.mp3Id||'',server:r.server||'',edition:r.edition||'mp3quran',surahList:r.surahList||[]});loadReciterCards(document.getElementById('readerSearch')?.value||'');if(document.getElementById('favorites')?.classList.contains('active'))renderFavorites('readers')}
function toggleFavReaderById(id){if(readFavStore().readers.some(a=>String(a.id)===String(id)))favRemove('readers',id);else{const r=RECITERS.find(r=>readerFavId(r)===String(id));if(r)favAdd('readers',{id:readerFavId(r),name:r.name,rewaya:r.rewaya||'',mp3Id:r.mp3Id||'',server:r.server||'',edition:r.edition||'mp3quran',surahList:r.surahList||[]})}renderFavorites('readers');loadReciterCards(document.getElementById('readerSearch')?.value||'')}
function downloadedKey(num){return `quran-m09-download:${currentReader?.id||'unknown'}:${num}`}
function downloadLabel(num){return isDownloaded(num)?'✓ محفوظ':'⬇ تحميل'}
function isDownloaded(num){return localStorage.getItem(downloadedKey(num))==='1'}
function renderSongs(q=''){const avail=new Set(currentReader?.surahList?.length?currentReader.surahList:Array.from({length:114},(_,i)=>i+1));songList.innerHTML=S.map((x,i)=>({x,i})).filter(o=>avail.has(o.i+1)&&o.x.includes(q)).map(o=>{const num=o.i+1;const done=isDownloaded(num);return `<div class="listrow" onclick="playSurah(${num})"><div class="rowMain"><span class="num">${num}</span><b>${xSafe(o.x)}</b></div><button class="downloadBtn" onclick="event.stopPropagation();playSurah(${num})">▶ استماع</button><button class="downloadBtn ${done?'downloaded':''}" onclick="event.stopPropagation();downloadSurah(${num})">${downloadLabel(num)}</button></div>`}).join('')}
function xSafe(v){return v.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}
const DB_NAME='quran-m09-offline-v2',DB_STORE='audio';
function openAudioDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(DB_STORE);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function saveBlob(key,blob){const db=await openAudioDB();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put(blob,key);tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)}})}
async function getBlob(key){const db=await openAudioDB();return new Promise((resolve,reject)=>{const tx=db.transaction(DB_STORE,'readonly');const r=tx.objectStore(DB_STORE).get(key);r.onsuccess=()=>{db.close();resolve(r.result||null)};r.onerror=()=>{db.close();reject(r.error)}})}
async function downloadSurah(num){
  if(!currentReader)return;
  const token=readerToken; const status=document.getElementById('downloadStatus');status.style.display='block';status.innerHTML='جارٍ تحديد ملف السورة…';
  let url;try{url=await ensureAudioUrl(num)}catch(e){status.innerHTML='❌ تعذر العثور على تلاوة هذا القارئ الآن.';return}
  if(token!==readerToken)return;
  status.innerHTML=`جارٍ تحميل <b>${xSafe(S[num-1])}</b>…<div class="progress"><span id="downloadProgress"></span></div><div class="mini" id="downloadText">0%</div><div class="controls" style="margin-top:10px"><button id="pauseDownloadBtn" onclick="pauseDownload()">⏸ إيقاف مؤقت</button><button id="resumeDownloadBtn" onclick="resumeDownload()" style="display:none">▶ استئناف</button><button onclick="cancelDownload()">✕ إلغاء</button></div>`;
  try{
    if(window.downloadTask) cancelDownload(true);
    const task=window.downloadTask={num,url,token,chunks:[],received:0,total:0,type:'audio/mpeg',paused:false,cancelled:false,reader:null};
    await continueDownload(task);
  }catch(e){
    if(window.downloadTask && window.downloadTask.token===token && !window.downloadTask.cancelled){status.innerHTML='❌ تعذر تنزيل السورة. جرّب مرة أخرى مع اتصال إنترنت ثابت.';console.error(e)}
  }
}
async function continueDownload(task){
  const status=document.getElementById('downloadStatus');
  const headers={mode:'cors',cache:'no-store'};
  if(task.received>0) headers.headers={'Range':`bytes=${task.received}-`};
  const response=await fetch(task.url,headers);
  if(!response.ok && !(task.received>0 && response.status===416)) throw new Error('network');
  if(task.received>0 && response.status===200){
    task.chunks=[];task.received=0;task.total=Number(response.headers.get('Content-Length'))||0;
  }else if(!task.total){
    const length=Number(response.headers.get('Content-Length'))||0;
    task.total=task.received+length;
  }
  task.type=response.headers.get('Content-Type')||task.type;
  const reader=response.body?.getReader();task.reader=reader;
  if(!reader){const blob=await response.blob();task.chunks=[blob];task.received+=blob.size;task.total=task.total||task.received;return finishDownload(task)}
  while(true){
    const part=await reader.read();
    if(part.done)break;
    task.chunks.push(part.value);task.received+=part.value.byteLength;
    if(task.cancelled)return;
    if(task.paused){try{await reader.cancel()}catch(e){};task.reader=null;return updateDownloadUI(task)}
    updateDownloadUI(task);
  }
  task.reader=null;
  if(task.total && task.received>=task.total) return finishDownload(task);
  if(!task.total) return finishDownload(task);
  throw new Error('incomplete');
}
function updateDownloadUI(task){
  const bar=document.getElementById('downloadProgress'),txt=document.getElementById('downloadText'),pause=document.getElementById('pauseDownloadBtn'),resume=document.getElementById('resumeDownloadBtn');
  const pct=task.total?Math.min(100,Math.round(task.received/task.total*100)):0;
  if(bar&&task.total)bar.style.width=pct+'%';
  if(txt)txt.textContent=task.total?`${pct}% — ${ (task.received/1024/1024).toFixed(1)} MB`:`تم تنزيل ${(task.received/1024/1024).toFixed(1)} MB`;
  if(pause)pause.style.display=task.paused?'none':'inline-block';
  if(resume)resume.style.display=task.paused?'inline-block':'none';
  if(task.paused && txt)txt.textContent='⏸ متوقف مؤقتًا — '+(task.total?`${Math.round(task.received/task.total*100)}%`:`${(task.received/1024/1024).toFixed(1)} MB`);
}
function pauseDownload(){const t=window.downloadTask;if(!t)return;t.paused=true;updateDownloadUI(t)}
async function resumeDownload(){const t=window.downloadTask;if(!t||!t.paused)return;t.paused=false;updateDownloadUI(t);try{await continueDownload(t)}catch(e){if(!t.cancelled){document.getElementById('downloadStatus').innerHTML='❌ تعذر استئناف التنزيل. جرّب مرة أخرى.';console.error(e)}}}
function cancelDownload(silent=false){const t=window.downloadTask;if(!t)return;t.cancelled=true;t.paused=false;try{t.reader?.cancel()}catch(e){};window.downloadTask=null;if(!silent){const status=document.getElementById('downloadStatus');status.innerHTML='تم إلغاء التنزيل.';renderSongs(songSearch.value)}}
async function finishDownload(task){
  if(task.cancelled)return;
  const blob=new Blob(task.chunks,{type:task.type});
  await saveBlob(downloadedKey(task.num),blob);
  localStorage.setItem(downloadedKey(task.num),'1');
  const bar=document.getElementById('downloadProgress');if(bar)bar.style.width='100%';
  const txt=document.getElementById('downloadText');if(txt)txt.textContent='100%';
  const status=document.getElementById('downloadStatus');status.innerHTML=`✅ تم حفظ <b>${xSafe(S[task.num-1])}</b> للاستماع بدون إنترنت.`;
  window.downloadTask=null;renderSongs(songSearch.value);
}
async function getOfflineBlob(num){try{return await getBlob(downloadedKey(num))}catch(e){return null}}
songSearch.oninput=e=>renderSongs(e.target.value);
async function playSurah(num){if(!currentReader)return;currentSurah=num;now.textContent='⏳ جاري تجهيز '+S[num-1];try{const blob=await getOfflineBlob(num);if(blob){if(window._offlineObjectUrl)URL.revokeObjectURL(window._offlineObjectUrl);window._offlineObjectUrl=URL.createObjectURL(blob);audio.src=window._offlineObjectUrl}else{const url=await ensureAudioUrl(num);audio.src=url}now.textContent='▶ '+S[num-1];audioTitle.textContent='🎙️ '+(currentReader.name||'القارئ')+' — '+S[num-1];await audio.play();updateAudioUI();syncGlobalMiniPlayer()}catch(e){now.textContent='❌ تعذر تشغيل '+S[num-1]+' لهذا القارئ الآن';console.error(e)}saveSettings()}
function nextSurah(){const a=currentReader?.surahList?.length?currentReader.surahList:Array.from({length:114},(_,i)=>i+1),k=a.indexOf(currentSurah),n=a[k<0?0:(k+1)%a.length];playSurah(n)}function previousSurah(){const a=currentReader?.surahList?.length?currentReader.surahList:Array.from({length:114},(_,i)=>i+1),k=a.indexOf(currentSurah),n=a[k<=0?a.length-1:k-1];playSurah(n)}
function repeatMode(m){repeat=repeat===m?'none':m;repeatOne.classList.toggle('active',repeat==='one');repeatAll.classList.toggle('active',repeat==='all')}
audio.addEventListener('ended',()=>{if(repeat==='one'){audio.currentTime=0;audio.play()}else if(repeat==='all'){nextSurah()}});
let qiblaBearing=null,qiblaHeading=null,qiblaListening=false,qiblaLastHeading=null;
function screenAngle(){return (screen.orientation&&typeof screen.orientation.angle==='number')?screen.orientation.angle:(typeof window.orientation==='number'?window.orientation:0)}
function normalizeDeg(v){return (v%360+360)%360}
function shortestDelta(a,b){return ((b-a+540)%360)-180}
async function enableCompass(){
  try{
    if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
      const p=await DeviceOrientationEvent.requestPermission();
      if(p!=='granted')throw new Error('permission');
    }
  }catch(e){
    const t=document.getElementById('qiblaText');if(t)t.textContent='اسمح بالوصول إلى اتجاه الحركة/البوصلة من إعدادات الهاتف ثم اضغط تشغيل القبلة مرة أخرى.';
    return false;
  }
  if(!qiblaListening){
    window.addEventListener('deviceorientationabsolute',handleOrientation,true);
    window.addEventListener('deviceorientation',handleOrientation,true);
    qiblaListening=true;
  }
  return true;
}
function extractHeading(e){
  // iPhone/iPad: webkitCompassHeading is already a compass heading measured clockwise from true north.
  if(typeof e.webkitCompassHeading==='number'&&Number.isFinite(e.webkitCompassHeading)) return normalizeDeg(e.webkitCompassHeading);
  // Android/other browsers with an absolute orientation event: alpha 0 means the device's top is toward north.
  if(e.absolute===true&&typeof e.alpha==='number'&&Number.isFinite(e.alpha)) return normalizeDeg(360-e.alpha);
  // Fallback for browsers that only expose relative orientation. This is approximate and is not used as a fake fixed bearing.
  if(typeof e.alpha==='number'&&Number.isFinite(e.alpha)) return normalizeDeg(360-e.alpha+screenAngle());
  return null;
}
function handleOrientation(e){
  const raw=extractHeading(e);if(raw==null||qiblaBearing==null)return;
  // Smooth the compass and avoid the 359° -> 0° jump.
  if(qiblaLastHeading==null)qiblaLastHeading=raw;
  qiblaLastHeading=normalizeDeg(qiblaLastHeading+shortestDelta(qiblaLastHeading,raw)*0.22);
  qiblaHeading=qiblaLastHeading;
  const rel=shortestDelta(qiblaHeading,qiblaBearing);
  const pointer=document.getElementById('qiblaPointer');
  if(pointer)pointer.style.transform=`translate(-50%,-100%) rotate(${rel}deg)`;
  const dial=document.getElementById('qiblaDial');
  // Rotate the compass face with the real heading, as on physical compass apps.
  if(dial)dial.style.transform=`rotate(${-qiblaHeading}deg)`;
  const qt=document.getElementById('qiblaText');if(qt)qt.textContent=`القبلة أمامك بزاوية ${Math.round(normalizeDeg(qiblaBearing-qiblaHeading))}°`;
  const qh=document.getElementById('qiblaHeading');if(qh)qh.textContent=`اتجاه الهاتف: ${Math.round(qiblaHeading)}° • اتجاه مكة: ${Math.round(qiblaBearing)}°`;
}
async function locateQibla(){
  if(!navigator.geolocation){qiblaText.textContent='المتصفح لا يدعم تحديد الموقع';return}
  qiblaText.textContent='جارٍ تحديد موقعك وتشغيل البوصلة…';
  navigator.geolocation.getCurrentPosition(async p=>{
    const lat=p.coords.latitude,lon=p.coords.longitude,kaabaLat=21.422487,kaabaLon=39.826206,rad=Math.PI/180;
    const y=Math.sin((kaabaLon-lon)*rad)*Math.cos(kaabaLat*rad);
    const x=Math.cos(lat*rad)*Math.sin(kaabaLat*rad)-Math.sin(lat*rad)*Math.cos(kaabaLat*rad)*Math.cos((kaabaLon-lon)*rad);
    qiblaBearing=normalizeDeg(Math.atan2(y,x)/rad);qiblaLastHeading=null;
    const ok=await enableCompass();
    if(!ok){qiblaText.textContent='تم تحديد القبلة، لكن يلزم السماح بحساس اتجاه الهاتف لتصبح البوصلة متحركة.';return}
    qiblaText.textContent='حرّك الهاتف ببطء حتى يستقر السهم على اتجاه القبلة.';
  },()=>qiblaText.textContent='تعذر الحصول على موقع الجهاز. اسمح بالموقع من إعدادات المتصفح.',{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
}
function openQiblaMap(){if(qiblaBearing==null){locateQibla();return}navigator.geolocation.getCurrentPosition(p=>{const u=`https://www.google.com/maps/dir/?api=1&origin=${p.coords.latitude},${p.coords.longitude}&destination=21.422487,39.826206`;window.open(u,'_blank')},()=>alert('اسمح بالموقع أولًا.'))}
function tasbeehKey(){return 'quran-m09-tasbeeh:'+encodeURIComponent(document.getElementById('tasbeehType')?.value||'سبحان الله')} function syncTasbeeh(){n=Number(localStorage.getItem(tasbeehKey())||0);count.textContent=n;document.getElementById('tasbeehLabel').textContent=document.getElementById('tasbeehType')?.value||'سبحان الله'} function selectTasbeeh(v){syncTasbeeh()} function inc(){n++;count.textContent=n;localStorage.setItem(tasbeehKey(),String(n))}function resetCount(){n=0;count.textContent=0;localStorage.setItem(tasbeehKey(),'0')}
const ADHKAR={
'صباح':[
{text:'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.',count:1,source:'حصن المسلم'},
{text:'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد صلى الله عليه وسلم نبيًا.',count:3,source:'حصن المسلم'},
{text:'سبحان الله وبحمده.',count:100,source:'صحيح مسلم'}],
'مساء':[
{text:'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.',count:1,source:'حصن المسلم'},
{text:'رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد صلى الله عليه وسلم نبيًا.',count:3,source:'حصن المسلم'},
{text:'سبحان الله وبحمده.',count:100,source:'صحيح مسلم'}],
'نوم':[
{text:'باسمك اللهم أموت وأحيا.',count:1,source:'صحيح البخاري'},
{text:'سبحان الله.',count:33,source:'صحيح البخاري ومسلم'},
{text:'الحمد لله.',count:33,source:'صحيح البخاري ومسلم'},
{text:'الله أكبر.',count:34,source:'صحيح البخاري ومسلم'}],
'صلاة':[
{text:'سبحان ربي العظيم.',count:3,source:'ذكر مشروع في الركوع'},
{text:'سبحان ربي الأعلى.',count:3,source:'ذكر مشروع في السجود'},
{text:'رب اغفر لي.',count:3,source:'من أذكار الصلاة'}],
'طعام':[
{text:'بسم الله.',count:1,source:'من هدي النبي صلى الله عليه وسلم'},
{text:'الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة.',count:1,source:'سنن أبي داود والترمذي'}]
};
ADHKAR['بعد الصلاة']=[
{text:'أستغفر الله.',count:3,source:'صحيح مسلم'},
{text:'اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.',count:1,source:'صحيح مسلم'},
{text:'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.',count:1,source:'صحيح مسلم'}];
ADHKAR['استيقاظ']=[
{text:'الحمد لله الذي أحيانا بعدما أماتنا وإليه النشور.',count:1,source:'صحيح البخاري'},
{text:'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، الحمد لله وسبحان الله والله أكبر.',count:1,source:'صحيح البخاري'}];
ADHKAR['منزل']=[
{text:'بسم الله ولجنا، وبسم الله خرجنا، وعلى ربنا توكلنا.',count:1,source:'سنن أبي داود'},
{text:'اللهم إني أسألك خير المولج وخير المخرج، بسم الله ولجنا وبسم الله خرجنا وعلى الله ربنا توكلنا.',count:1,source:'سنن أبي داود'}];
ADHKAR['مسجد']=[
{text:'اللهم افتح لي أبواب رحمتك.',count:1,source:'صحيح مسلم'},
{text:'اللهم إني أسألك من فضلك.',count:1,source:'صحيح مسلم'}];
ADHKAR['سفر']=[
{text:'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون.',count:1,source:'القرآن الكريم، الزخرف 13-14'},
{text:'اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى.',count:1,source:'صحيح مسلم'}];
ADHKAR['استغفار']=[
{text:'أستغفر الله وأتوب إليه.',count:100,source:'صحيح البخاري'},
{text:'رب اغفر لي وتب علي إنك أنت التواب الرحيم.',count:100,source:'سنن أبي داود والترمذي'}];
ADHKAR['صباح'].push(
{text:'اللهم إني أسألك العفو والعافية في الدنيا والآخرة.',count:1,source:'سنن أبي داود وابن ماجه'},
{text:'اللهم فاطر السماوات والأرض، عالم الغيب والشهادة، رب كل شيء ومليكه، أعوذ بك من شر نفسي ومن شر الشيطان وشركه.',count:1,source:'سنن أبي داود والترمذي'}
);
ADHKAR['مساء'].push(
{text:'اللهم إني أسألك العفو والعافية في الدنيا والآخرة.',count:1,source:'سنن أبي داود وابن ماجه'},
{text:'أعوذ بكلمات الله التامات من شر ما خلق.',count:3,source:'صحيح مسلم'}
);
ADHKAR['نوم'].push(
{text:'اللهم قني عذابك يوم تبعث عبادك.',count:3,source:'سنن أبي داود والترمذي'},
{text:'اللهم باسمك أموت وأحيا.',count:1,source:'صحيح البخاري'}
);
ADHKAR['بعد الصلاة'].push(
{text:'سبحان الله والحمد لله والله أكبر، ثلاثًا وثلاثين، ويختم المائة بلا إله إلا الله وحده لا شريك له.',count:1,source:'صحيح مسلم'}
);
let currentAdhkarKind='صباح';
function renderAdhkar(kind='صباح'){currentAdhkarKind=kind;const box=document.getElementById('adhkarList');if(!box)return;box.innerHTML=(ADHKAR[kind]||[]).map((z,i)=>`<div class="card clickableDetail" onclick="openAdhkarDetail('${kind}',${i})"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><div><b>${xSafe(z.text)}</b><p class="mini">${z.count} مرات • ${xSafe(z.source)}</p></div><button class="favBtn ${isFavAdhkar(kind,i)?'active':''}" onclick="event.stopPropagation();toggleFavAdhkar('${kind}',${i})">${isFavAdhkar(kind,i)?'★':'☆'}</button></div><div class="controls"><button class="primary" onclick="event.stopPropagation();openAdhkarDetail('${kind}',${i})">فتح الذكر</button><button onclick="event.stopPropagation();playHumanAdhkar('${kind}',${i})">🔊 استماع بصوت بشري</button></div></div>`).join('')}
function showHumanAudioNotice(kind){
 if(kind==='hadith'){const hn=document.getElementById('humanHadithNotice');if(hn){hn.style.display='block';window.scrollTo({top:0,behavior:'smooth'});return;}}
 const box=document.getElementById('humanAudioSource'),txt=document.getElementById('humanAudioSourceText');
 if(!box||!txt)return;
 txt.textContent=kind==='hadith'?'هذه الميزة ليست موجودة الآن لهذا الحديث؛ لن يتم تشغيل صوت آلي أو تسجيل لحديث آخر.':'هذه الميزة ليست موجودة الآن لهذا الذكر؛ لن يتم تشغيل صوت آلي أو تسجيل لذكر آخر.';
 box.style.display='block';
 window.scrollTo({top:0,behavior:'smooth'});
}
function playHumanAdhkar(kind,i){const z=(ADHKAR[kind]||[])[Number(i)];if(!z)return;showHumanAudioNotice('adhkar')}
function playHumanHadith(i){const h=(HADITHS||[])[Number(i)];if(!h)return;showHumanAudioNotice('hadith')}
const HADITHS=[
{text:'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.',source:'صحيح البخاري، حديث 1؛ وصحيح مسلم، حديث 1907',grade:'صحيح',category:'عام'},
{text:'من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخلاق'},
{text:'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخلاق'},
{text:'المسلم من سلم المسلمون من لسانه ويده.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخلاق'},
{text:'خيركم من تعلم القرآن وعلمه.',source:'صحيح البخاري، حديث 5027',grade:'صحيح',category:'القرآن'},
{text:'من صام رمضان إيمانًا واحتسابًا غفر له ما تقدم من ذنبه.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الصيام'},
{text:'بني الإسلام على خمس.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'العبادات'},
{text:'إن الصدق يهدي إلى البر، وإن البر يهدي إلى الجنة.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخلاق'},
{text:'من يرد الله به خيرًا يفقهه في الدين.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'العلم'},
{text:'الدين النصيحة.',source:'صحيح مسلم',grade:'صحيح',category:'الآداب'},
{text:'من لا يرحم لا يرحم.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الرحمة'},
{text:'المؤمن للمؤمن كالبنيان يشد بعضه بعضًا.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخوة'},
{text:'يسروا ولا تعسروا، وبشروا ولا تنفروا.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الآداب'},
{text:'الطهور شطر الإيمان.',source:'صحيح مسلم',grade:'صحيح',category:'الطهارة'},
{text:'أحب الأعمال إلى الله أدومها وإن قل.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'العبادات'},
{text:'من قام رمضان إيمانًا واحتسابًا غفر له ما تقدم من ذنبه.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الصيام'},
{text:'من حج هذا البيت فلم يرفث ولم يفسق رجع كيوم ولدته أمه.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الحج'},
{text:'الصدقة لا تنقص المال.',source:'صحيح مسلم',grade:'صحيح',category:'الصدقة'},
{text:'من سلك طريقًا يلتمس فيه علمًا سهل الله له به طريقًا إلى الجنة.',source:'صحيح مسلم',grade:'صحيح',category:'العلم'},
{text:'الكلمة الطيبة صدقة.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الصدقة'},
{text:'من كان يؤمن بالله واليوم الآخر فليكرم ضيفه.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الآداب'},
{text:'ليس الشديد بالصرعة، إنما الشديد الذي يملك نفسه عند الغضب.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخلاق'},
{text:'تبسمك في وجه أخيك لك صدقة.',source:'سنن الترمذي',grade:'حسن',category:'الأخلاق'},
{text:'اتقوا النار ولو بشق تمرة، فمن لم يجد فبكلمة طيبة.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الصدقة'},
{text:'الدين النصيحة.',source:'صحيح مسلم',grade:'صحيح',category:'الدين'},
{text:'يسروا ولا تعسروا، وبشروا ولا تنفروا.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخلاق'},
{text:'من لا يرحم لا يرحم.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الرحمة'},
{text:'المؤمن للمؤمن كالبنيان يشد بعضه بعضًا.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الأخوة'},
{text:'الطهور شطر الإيمان.',source:'صحيح مسلم',grade:'صحيح',category:'الطهارة'},
{text:'الكلمة الطيبة صدقة.',source:'صحيح البخاري وصحيح مسلم',grade:'صحيح',category:'الصدقة'}
];
let currentHadithCategory='الكل';
function renderHadith(){const q=(document.getElementById('hadithSearch')?.value||'').trim();const list=HADITHS.map((h,i)=>({h,i})).filter(o=>(currentHadithCategory==='الكل'||o.h.category===currentHadithCategory)&&(!q||o.h.text.includes(q)||o.h.source.includes(q)||o.h.category.includes(q)));const box=document.getElementById('hadithList');box.innerHTML=list.length?list.map(o=>`<div class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div style="font-size:21px;line-height:1.95">${xSafe(o.h.text)}</div><button class="favBtn ${isFavHadith(o.i)?'active':''}" onclick="toggleFavHadith(${o.i})">${isFavHadith(o.i)?'★':'☆'}</button></div><p class="mini">📚 ${xSafe(o.h.source)} • الدرجة: ${xSafe(o.h.grade)} • التصنيف: ${xSafe(o.h.category)}</p><div class="controls"><button class="humanAudioBtn" onclick="playHumanHadith(${o.i})">🔊 استماع بصوت بشري</button></div></div>`).join(''):'<div class="card favEmpty">لا توجد نتائج.</div>'}
function initHadithCategories(){const cats=['الكل',...new Set(HADITHS.map(h=>h.category))];document.getElementById('hadithCategories').innerHTML=cats.map(c=>`<button class="${c==='الكل'?'active':''}" onclick="currentHadithCategory='${c}';initHadithCategories();renderHadith()">${c}</button>`).join('')}
function loadHadith(){initHadithCategories();renderHadith()}
function restoreTasbeeh(){syncTasbeeh();}
async function initRepeatAyah(){
  const s=document.getElementById('repeatSurah'),r=document.getElementById('repeatReciter');
  if(!s||!r)return;
  s.innerHTML=S.map((name,i)=>`<option value="${i+1}">${i+1}. ${xSafe(name)}</option>`).join('');
  r.innerHTML=RECITERS.map((x,i)=>`<option value="${i}">${xSafe(x.name)} — ${xSafe(x.rewaya)}</option>`).join('');document.getElementById('repeatReaderSearch')?.addEventListener('input',filterRepeatReaders);
  const saved=Number(localStorage.getItem('quran-m09-repeat-surah')||1);s.value=saved;
  updateRepeatTo();
}
async function updateRepeatTo(){
  const from=document.getElementById('repeatFrom'),to=document.getElementById('repeatTo'),surah=document.getElementById('repeatSurah');
  if(!from||!to||!surah)return;
  const n=Number(surah.value||1); try{const j=await fetch(`https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`);const d=await j.json();const max=d.data?.numberOfAyahs||1;from.max=max;to.max=max;if(Number(from.value)>max)from.value=max;if(Number(to.value)>max)to.value=max;to.value=Math.max(Number(to.value||1),Number(from.value||1));}catch(e){}
}
let repeatAyahState=null;
function filterRepeatReaders(){const q=(document.getElementById('repeatReaderSearch')?.value||'').toLowerCase();const r=document.getElementById('repeatReciter');if(!r)return;const keep=RECITERS.map((x,i)=>({x,i})).filter(o=>!q||o.x.name.toLowerCase().includes(q)||String(o.x.rewaya).toLowerCase().includes(q));r.innerHTML=keep.map(o=>`<option value="${o.i}">${xSafe(o.x.name)} — ${xSafe(o.x.rewaya)}</option>`).join('')}
const AYAH_AUDIO_EDITIONS={
  'ماهر المعيقلي':'ar.mahermuaiqly','مشاري راشد العفاسي':'ar.alafasy','مشاري العفاسي':'ar.alafasy','عبدالرحمن السديس':'ar.sudais','سعود الشريم':'ar.shuraim','أحمد بن علي العجمي':'ar.ahmedajamy','أحمد العجمي':'ar.ahmedajamy','أبو بكر الشاطري':'ar.shaatree','عبدالباسط عبدالصمد':'ar.abdulbasit','عبد الباسط عبدالصمد':'ar.abdulbasit','هاني الرفاعي':'ar.hanirifai','محمد أيوب':'ar.muhammadayyoub','محمد جبريل':'ar.muhammadjibreel','الحصري':'ar.husary'
};
const SURAH_AYAH_OFFSETS=[0,7,286,493,669,789,954,1160,1235,1364,1473,1596,1705,1750,1802,1900,2029,2140,2250,2348,2483,2595,2673,2791,2855,2935,3159,3252,3340,3409,3469,3503,3533,3606,3660,3705,3788,3876,3945,3994,4058,4133,4218,4272,4325,4414,4473,4517,4545,4583,4612,4630,4675,4722,4774,4799,4841,4885,4945,4983,5076,5104,5150,5168,5187,5209,5223,5264,5316,5375,5414,5455,5493,5531,5596,5622,5672,5692,5710,5731,5758,5800,5831,5851,5864,5881,5893,5909,5930,5948,5967,5993,6016,6043,6058,6073,6083,6090,6098,6106,6115,6124,6130,6138,6146,6154,6161,6168,6176,6183,6190,6197,6204,6211,6218,6225,6232];
function ayahEditionForReader(r){const name=String(r?.name||'');for(const k of Object.keys(AYAH_AUDIO_EDITIONS)){if(name.includes(k))return AYAH_AUDIO_EDITIONS[k]}return null}
async function startAyahRepeat(){
  stopAyahRepeat(true);
  const surah=Number(document.getElementById('repeatSurah').value),from=Number(document.getElementById('repeatFrom').value),to=Number(document.getElementById('repeatTo').value),ri=Number(document.getElementById('repeatReciter').value);const r=RECITERS[ri];const status=document.getElementById('repeatAyahStatus');
  if(!r||from<1||to<from){status.textContent='اختر نطاقًا صحيحًا.';return}
  status.textContent='⏳ جارٍ تجهيز تكرار الآيات…';
  try{
    const edition=ayahEditionForReader(r);
    if(edition){
      const urls=[];for(let a=from;a<=to;a++){const global=(SURAH_AYAH_OFFSETS[surah-1]||0)+a;urls.push(`https://cdn.islamic.network/quran/audio/128/${edition}/${global}.mp3`)}
      repeatAyahState={mode:'ayah-cdn',surah,from,to,index:0,urls,reader:r};
      audio.src=urls[0];await audio.play();status.textContent=`🔁 يكرر الآيات ${from}–${to} من ${S[surah-1]} بصوت ${r.name}`;localStorage.setItem('quran-m09-repeat-surah',String(surah));
      audio.onended=async()=>{const st=repeatAyahState;if(!st)return;st.index=(st.index+1)%st.urls.length;audio.src=st.urls[st.index];try{await audio.play()}catch(e){}};
      return;
    }
    const j=await fetch(`https://www.mp3quran.net/api/v3/ayat_timing?surah=${surah}&read=${encodeURIComponent(r.mp3Id||r.id)}`);if(!j.ok)throw new Error('timing');const timings=await j.json();
    const valid=timings.filter(x=>Number(x.ayah)>0);const selected=valid.filter(x=>Number(x.ayah)>=from&&Number(x.ayah)<=to);if(selected.length!==to-from+1)throw new Error('no-range');
    const url=await ensureAudioUrlForReader(r,surah);audio.pause();audio.src=url;await audio.play();repeatAyahState={mode:'timing',surah,from,to,index:0,timings:selected,reader:r};audio.currentTime=Number(selected[0].start_time)/1000;status.textContent=`🔁 يكرر الآيات ${from}–${to} من ${S[surah-1]} بصوت ${r.name}`;localStorage.setItem('quran-m09-repeat-surah',String(surah));
    audio.ontimeupdate=()=>{const st=repeatAyahState;if(!st||st.mode!=='timing')return;const cur=st.timings[st.index],t=audio.currentTime*1000;if(t>=Number(cur.end_time)-80){st.index++;if(st.index>=st.timings.length)st.index=0;audio.currentTime=Number(st.timings[st.index].start_time)/1000;audio.play().catch(()=>{})}};
  }catch(e){status.textContent='❌ تعذر تشغيل تكرار الآيات لهذا القارئ حاليًا. اختر قارئًا آخر أو جرّب بعد قليل.';console.error(e)}
}
function stopAyahRepeat(silent=false){repeatAyahState=null;audio.ontimeupdate=null;audio.onended=null;audio.pause();if(!silent)document.getElementById('repeatAyahStatus').textContent='⏹ تم إيقاف التكرار والتلاوة نهائيًا.'}
async function ensureAudioUrlForReader(reader,num){if(reader._resolvedUrls?.[num])return reader._resolvedUrls[num];if(reader.server){reader._resolvedUrls=reader._resolvedUrls||{};reader._resolvedUrls[num]=`${reader.server}${String(num).padStart(3,'0')}.mp3`;return reader._resolvedUrls[num]}throw new Error('no-audio')}
function minsFromHHMM(v){const [h,m]=String(v||'').split(':').map(Number);return Number.isFinite(h)&&Number.isFinite(m)?h*60+m:null}
function updateHomePrayerCard(){const t=window._prayerTimes;if(!t)return;const now=new Date();const nowMin=now.getHours()*60+now.getMinutes();const arr=[['الفجر','Fajr'],['الظهر','Dhuhr'],['العصر','Asr'],['المغرب','Maghrib'],['العشاء','Isha']].map(x=>[x[0],minsFromHHMM(t[x[1]])]).filter(x=>x[1]!=null);let next=arr.find(x=>x[1]>nowMin);let prev=[...arr].reverse().find(x=>x[1]<=nowMin);if(!next){next=[arr[0][0],arr[0][1]+1440]}if(!prev)prev=[arr[arr.length-1][0],arr[arr.length-1][1]-1440];const diff=next[1]-nowMin;const elapsed=nowMin-prev[1];const cd=`${Math.floor(diff/60)} ساعة و ${diff%60} دقيقة`;const el=`${Math.floor(elapsed/60)} ساعة و ${elapsed%60} دقيقة`;document.getElementById('homeNextPrayer').textContent=next[0];document.getElementById('homeNextCountdown').textContent=`متبقٍ ${cd}`;document.getElementById('homeElapsedPrayer').textContent=el;document.getElementById('homePrayerPrev').textContent=`منذ ${prev[0]}`}
setInterval(updateHomePrayerCard,30000);
async function loadPrayerTimes(useLocation=false){
  const status=document.getElementById('prayerStatus'),list=document.getElementById('prayerList');if(!status||!list)return;status.textContent='⏳ جارٍ تحميل مواقيت الصلاة…';
  try{
    let url='';
    if(useLocation){const pos=await new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res,rej,{enableHighAccuracy:true,timeout:10000}));const p=pos.coords;url=`https://api.aladhan.com/v1/timings?latitude=${p.latitude}&longitude=${p.longitude}&method=${document.getElementById('prayerMethod').value}`}
    else{const city=encodeURIComponent(document.getElementById('prayerCity').value||'Tripoli'),country=encodeURIComponent(document.getElementById('prayerCountry').value||'Libya'),method=document.getElementById('prayerMethod').value;url=`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`}
    const j=await fetch(url);if(!j.ok)throw new Error('prayer');const d=await j.json();const t=d.data?.timings;if(!t)throw new Error('no-data');
    const items=[['الفجر','Fajr','🌅'],['الشروق','Sunrise','☀️'],['الظهر','Dhuhr','🌞'],['العصر','Asr','🌤️'],['المغرب','Maghrib','🌇'],['العشاء','Isha','🌙']];const fmt12=v=>{const [hh,mm]=String(v||'—').split(':').map(Number);if(!Number.isFinite(hh))return v;const ap=hh>=12?'م':'ص',h=hh%12||12;return `${h}:${String(mm).padStart(2,'0')} ${ap}`};list.innerHTML=items.map(x=>`<div class="prayerCard"><span>${x[2]}</span><small>${x[0]}</small><b>${fmt12(t[x[1]])}</b></div>`).join('');window._prayerTimes={...t};updateHomePrayerCard();status.textContent=`📅 ${d.data?.date?.readable||'اليوم'} • ${useLocation?'حسب موقع الجهاز':(document.getElementById('prayerCity').value||'Tripoli')}`;
  }catch(e){status.textContent='❌ تعذر تحميل المواقيت. تحقق من المدينة أو اسمح للموقع عند اختيار استخدام موقعي.';console.error(e)}
}
readerSearch.oninput=e=>loadReciterCards(e.target.value);
function renderDaily(){const box=document.getElementById('dailyList');if(!box)return;const items=[['🌅','أذكار الصباح','بعد الفجر إلى الظهر',()=>{show('adhkar');renderAdhkar('صباح')}],['🌇','أذكار المساء','بعد العصر والمغرب',()=>{show('adhkar');renderAdhkar('مساء')}],['📖','ورد القرآن','اقرأ ما تيسر اليوم',()=>show('quran')],['🕌','السنن الرواتب','تذكير بأداء السنن',()=>show('prayer')],['📜','حديث اليوم','حديث صحيح مختار',()=>{show('hadith');loadHadith()}],['🌙','الثلث الأخير','راجع وقته في قسم أوقات الليل',()=>{show('night');renderNightInfo()}],['☀️','صلاة الضحى','بعد ارتفاع الشمس وقبل الزوال',()=>show('prayer')],['📖','سورة الكهف','يمكن تذكيرك بها يوم الجمعة',()=>show('quran')]];box.innerHTML=items.map((x,i)=>`<div class="extraCard"><div style="font-size:28px">${x[0]}</div><h3>${x[1]}</h3><p class="mini">${x[2]}</p><button class="primary" onclick="dailyOpen(${i})">فتح</button></div>`).join('');window._dailyActions=items.map(x=>x[3])}
function dailyOpen(i){try{window._dailyActions?.[i]?.()}catch(e){console.error(e)}}

async function findMosques(){const st=document.getElementById('mosqueStatus'),list=document.getElementById('mosqueList');if(!st||!list)return;if(!navigator.geolocation){st.textContent='المتصفح لا يدعم الموقع.';return}st.textContent='⏳ جارٍ البحث عن المساجد القريبة…';navigator.geolocation.getCurrentPosition(async p=>{try{const {latitude,longitude}=p.coords;const q=`[out:json];(node[amenity=place_of_worship](around:5000,${latitude},${longitude});way[amenity=place_of_worship](around:5000,${latitude},${longitude}););out center tags;`;const r=await fetch('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q));if(!r.ok)throw 0;const j=await r.json();const arr=(j.elements||[]).filter(e=>(e.tags?.religion||'').toLowerCase()==='muslim'||(e.tags?.name||'').includes('مسجد')||(e.tags?.name||'').toLowerCase().includes('mosque')).slice(0,20);if(!arr.length){st.textContent='لم نجد مساجد مسجلة في المصدر حولك.';list.innerHTML='';return}const dist=(e)=>{const lat2=e.lat??e.center?.lat,lon2=e.lon??e.center?.lon;if(lat2==null)return 99999;const R=6371,rad=Math.PI/180,a=Math.sin((lat2-latitude)*rad/2)**2+Math.cos(latitude*rad)*Math.cos(lat2*rad)*Math.sin((lon2-longitude)*rad/2)**2;return 2*R*Math.asin(Math.sqrt(a))};arr.sort((a,b)=>dist(a)-dist(b));list.innerHTML=arr.map(e=>{const name=e.tags?.name||'مسجد';const d=dist(e);const lat=e.lat??e.center?.lat,lon=e.lon??e.center?.lon;return `<div class="mosqueItem"><div><b>🕌 ${xSafe(name)}</b><div class="mini">${d.toFixed(2)} كم</div></div><button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}','_blank')">الاتجاهات</button></div>`}).join('');st.textContent=`وجدنا ${arr.length} مسجدًا قريبًا.`}catch(e){st.textContent='تعذر البحث عن المساجد الآن. تحقق من الإنترنت.'}},()=>st.textContent='اسمح للموقع للبحث عن المساجد.',{enableHighAccuracy:true,timeout:12000,maximumAge:60000})}
function hijriToGregorianDay(hy,hm,hd){return null}
async function renderCalendarInfo(){const box=document.getElementById('dateInfo'),occ=document.getElementById('occasionsList');if(!box)return;box.textContent='⏳ جارٍ جلب التاريخ الهجري…';try{const d=new Date(),g=`${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;const r=await fetch(`https://api.aladhan.com/v1/gToH?date=${g}`);const j=await r.json();const h=j.data?.hijri;box.innerHTML=`<div style="font-size:22px">${d.toLocaleDateString('ar-LY',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div><div style="font-size:26px;margin-top:8px">${h?`${h.day} ${h.month.ar} ${h.year} هـ`:'—'}</div>`;const occasions=[['1','محرم','رأس السنة الهجرية'],['10','محرم','عاشوراء'],['12','ربيع الأول','المولد النبوي'],['27','رجب','الإسراء والمعراج'],['15','شعبان','ليلة النصف من شعبان'],['1','رمضان','بداية رمضان'],['1','شوال','عيد الفطر'],['9','ذو الحجة','يوم عرفة'],['10','ذو الحجة','عيد الأضحى']];occ.innerHTML=occasions.map(o=>`<div class="mosqueItem"><b>${o[0]} ${o[1]}</b><span>${o[2]}</span></div>`).join('')}catch(e){box.textContent='تعذر جلب التاريخ الهجري.'}}
async function convertTodayToHijri(){const d=new Date(),g=`${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;try{const j=await (await fetch(`https://api.aladhan.com/v1/gToH?date=${g}`)).json();const h=j.data?.hijri;document.getElementById('conversionResult').textContent=h?`${g} ميلادي = ${h.day} ${h.month.ar} ${h.year} هجري`:'تعذر التحويل'}catch(e){document.getElementById('conversionResult').textContent='تعذر التحويل الآن.'}}
async function convertHijriToday(){try{const d=new Date(),g=`${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;const h=(await (await fetch(`https://api.aladhan.com/v1/gToH?date=${g}`)).json()).data?.hijri;if(!h)throw 0;const r=await (await fetch(`https://api.aladhan.com/v1/hToG?date=${h.day}-${h.month.number}-${h.year}`)).json();const x=r.data?.gregorian;document.getElementById('conversionResult').textContent=x?`${h.day} ${h.month.ar} ${h.year} هجري = ${x.day} ${x.month.en} ${x.year} ميلادي`:'تعذر التحويل'}catch(e){document.getElementById('conversionResult').textContent='تعذر التحويل الآن.'}}
function renderNightInfo(){const box=document.getElementById('nightInfo');const t=window._prayerTimes;if(!box||!t){if(box)box.innerHTML='<div class="extraCard">حمّل مواقيت الصلاة أولًا.</div>';return}const mag=minsFromHHMM(t.Maghrib),faj=minsFromHHMM(t.Fajr);if(mag==null||faj==null){box.innerHTML='<div class="extraCard">لا تتوفر بيانات الليل.</div>';return}let nextF=faj;if(nextF<=mag)nextF+=1440;const dur=nextF-mag,mid=mag+dur/2,last=nextF-dur/3;const fmt=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mm=Math.floor(m%60),ap=h>=12?'م':'ص';return `${h%12||12}:${String(mm).padStart(2,'0')} ${ap}`};box.innerHTML=`<div class="extraCard"><h3>منتصف الليل</h3><b>${fmt(mid)}</b><p class="mini">بين المغرب والفجر.</p></div><div class="extraCard"><h3>الثلث الأخير</h3><b>يبدأ ${fmt(last)}</b><p class="mini">ينتهي عند الفجر.</p></div>`}
function sharePrayerCard(){const t=window._prayerTimes;if(!t){alert('حمّل مواقيت الصلاة أولًا.');return}const fmt=v=>{const [h,m]=String(v).split(':').map(Number);const ap=h>=12?'م':'ص';return `${h%12||12}:${String(m).padStart(2,'0')} ${ap}`};const text=`🕌 مواقيت الصلاة اليوم\nالفجر ${fmt(t.Fajr)}\nالظهر ${fmt(t.Dhuhr)}\nالعصر ${fmt(t.Asr)}\nالمغرب ${fmt(t.Maghrib)}\nالعشاء ${fmt(t.Isha)}\n\nQuran M09alaroud`;if(navigator.share)navigator.share({title:'مواقيت الصلاة',text}).catch(()=>{});else navigator.clipboard?.writeText(text).then(()=>alert('تم نسخ بطاقة المواقيت.'))}

const FATWA_API_URL="https://late-salad-73d2.2009malek11.workers.dev/api/fatwa";
async function askFatwaAI(){
  const q=(document.getElementById('fatwaQuestion')?.value||'').trim();
  const box=document.getElementById('fatwaAnswer');

  if(!q){
    box.textContent='اكتب السؤال أولًا.';
    return;
  }

  box.innerHTML='⏳ جارٍ البحث عن الفتوى الموثوقة…';

  const FATWA_URL =
    'https://late-salad-73d2.2009malek11.workers.dev/api/fatwa';

  try{
    const r=await fetch(FATWA_URL,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        question:q
      }),
      cache:'no-store'
    });

    const text=await r.text();

    let j={};

    try{
      j=JSON.parse(text);
    }catch{
      throw new Error('استجابة غير صالحة من خادم الفتوى.');
    }

    if(!r.ok){
      throw new Error(j.error||'تعذر الوصول إلى خادم الفتوى.');
    }

    const answer=xSafe(
      j.answer||'لم يصل نص الفتوى.'
    );

    const sources=
      Array.isArray(j.sources)
        ? j.sources
        : [];

    box.innerHTML=`
      <div class="fatwaBadge">
        🔎 فتوى من مصدر موثوق
      </div>

      <div style="white-space:pre-wrap;line-height:1.9;margin-top:8px">
        ${answer}
      </div>

      ${
        sources.length
        ? `
          <hr>
          <b>المصدر:</b>
          <ul>
            ${
              sources.map(x=>`
                <li>
                  <a
                    href="${xSafe(x.url||'#')}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${xSafe(x.title||'عرض المصدر الأصلي')}
                  </a>
                </li>
              `).join('')
            }
          </ul>
        `
        : `
          <p class="mini">
            لم يُرفق مصدر مباشر لهذه الإجابة.
          </p>
        `
      }

      <div class="fatwaWarning">
        تنبيه: هذا مساعد للبحث في المصادر وليس مفتيًا.
        راجع المصدر الأصلي وأهل العلم في المسائل المهمة.
      </div>
    `;

  }catch(e){

    console.error('FATWA ERROR:',e);

    box.innerHTML=`
      <div class="fatwaWarning">
        تعذر جلب الفتوى حاليًا.
        تأكد من اتصال الإنترنت ثم حاول مرة أخرى.
      </div>
    `;
  }
}
  box.innerHTML='حدث خطأ: ' + xSafe(e?.message || String(e));
}

function saveLocalSetting(k,v){localStorage.setItem('quran-m09-setting-'+k,v?'1':'0')}
function setFontScale(v){document.documentElement.style.setProperty('--font-scale',String(v));localStorage.setItem('quran-m09-font-scale',String(v))}
function clearLocalAppData(){if(confirm('هل تريد حذف المفضلة وإعدادات هذا الجهاز؟')){Object.keys(localStorage).filter(k=>k.startsWith('quran-m09')).forEach(k=>localStorage.removeItem(k));location.reload();}}
function boot(){const dark=localStorage.getItem('quran-m09-dark');if(dark==='1')document.body.classList.add('dark');const fs=localStorage.getItem('quran-m09-font-scale');if(fs)document.documentElement.style.setProperty('--font-scale',fs);const pr=localStorage.getItem('quran-m09-setting-prayerReminders');const oc=localStorage.getItem('quran-m09-setting-occasions');const a=document.getElementById('settingPrayerReminders'),b=document.getElementById('settingOccasions');if(a)a.checked=pr==='1';if(b)b.checked=oc!=='0';initRewayaChooser();renderSurahs();}

renderAdhkar('صباح');restoreTasbeeh();loadReciters();loadPrayerTimes(false);document.getElementById('readerSearch')?.addEventListener('input',e=>loadReciterCards(e.target.value));document.getElementById('hadithSearch')?.addEventListener('input',renderHadith);loadHadith();renderDaily();renderCalendarInfo();renderNightInfo();boot();

/* V26 reader profile photo enhancement */
const _v26OpenReader = window.openReader;
window.openReader = async function(i){
  await _v26OpenReader(i);
  const r=RECITERS[i]; const box=document.getElementById('readerProfile'); if(!r||!box)return;
  const url=await getReciterPhoto(r);
  const photo=url?`<img class="profileReciterPhoto" src="${xSafe(url)}" alt="${xSafe(r.name)}" loading="eager" referrerpolicy="no-referrer">`:`<div class="profileReciterPhoto placeholder">🎙️</div>`;
  box.innerHTML=`<div class="profilePhotoWrap">${photo}</div><h3>${xSafe(r.name)}</h3><p class="mini">الرواية: ${xSafe(r.rewaya||'غير محددة')} • ${r.surahList?.length||0} سورة متاحة</p><button class="favBtn ${isFavReader(r)?'active':''}" onclick="toggleFavReader(${RECITERS.indexOf(r)})">${isFavReader(r)?'★ في المفضلة':'☆ إضافة للمفضلة'}</button>`;
}

mushafFont=Number(localStorage.getItem('quran-m09-mushaf-font')||28);if(localStorage.getItem('quran-m09-mushaf-focus')==='1')document.body.classList.add('mushafFocus');migrateOldFavorites();renderFavorites('readers');
const RUQYAH_READERS=[
 {name:'ناصر القطامي',desc:'الرقية الشرعية المطولة من القرآن الكريم والسنة النبوية',source:'موسوعة المحتوى الإسلامي',url:'https://islamcontent.com/ar/single-content/88858'},
 {name:'حمزة بوديب',desc:'تسجيلات الرقية الشرعية المنسوبة إليه متاحة عبر مصادر خارجية؛ نفتح المصدر فقط للتحقق من التسجيل',source:'مصدر خارجي — تحقق قبل الاستخدام',url:'https://apkcombo.com/ar/%D8%AD%D9%85%D8%B2%D8%A9-%D8%A8%D9%88%D8%AF%D9%8A%D8%A8-mp3/com.jam.hamzabodeeb/'}
];
function renderRuqyah(q=''){const box=document.getElementById('ruqyahList');if(!box)return;const x=(q||document.getElementById('ruqyahSearch')?.value||'').trim();const arr=RUQYAH_READERS.filter(r=>!x||r.name.includes(x));box.innerHTML=arr.map((r,i)=>`<div class="ruqyahCard"><div class="title">🎙️ ${xSafe(r.name)}</div><div class="ruqyahMeta">${xSafe(r.desc)}</div><div class="ruqyahMeta">المصدر: ${xSafe(r.source)}</div><div class="controls"><button class="primary" onclick="openRuqyah(${i})">فتح والاستماع</button><a class="sourceLink" href="${r.url}" target="_blank" rel="noopener">المصدر</a></div></div>`).join('')||'<div class="card favEmpty">لا توجد نتائج.</div>';}
function openRuqyah(i){const r=RUQYAH_READERS[i];if(!r)return;const box=document.getElementById('ruqyahPlayer');box.style.display='block';box.innerHTML=`<div class="detailHero"><h3>🕋 الرقية الشرعية — ${xSafe(r.name)}</h3><p class="mini">${xSafe(r.desc)}</p><div class="notice" style="margin-top:12px">🎙️ هذا تسجيل بشري. سيتم فتح صفحة المصدر الأصلية للاستماع، لأننا لا نضع تسجيلات صوتية منسوخة داخل التطبيق دون التحقق من حقوق استخدامها.</div><div class="controls"><a class="primary" href="${r.url}" target="_blank" rel="noopener">▶ فتح التسجيل والاستماع</a></div></div>`;box.scrollIntoView({behavior:'smooth',block:'start'});}
const rqSearch=document.getElementById('ruqyahSearch');if(rqSearch)rqSearch.oninput=e=>renderRuqyah(e.target.value);
