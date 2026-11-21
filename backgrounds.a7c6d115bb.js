/* backgrounds.js — خلفيات الموقع الزجاجية + خلفية التلاوة
 * 1) الإعدادات ▸ «الخلفية والمظهر الزجاجي»: اختيار صورة => يصبح الموقع زجاجياً والصورة خلف الأزرار والبطاقات.
 * 2) زر 🖼️ داخل شريط التلاوة المصغّر (والأذكار): لا يظهر إلا أثناء وجود تلاوة. يعرض الصور مع مقاساتها؛
 *    الضغط على صورة => تصبح خلفية الشاشة كلها (بلا أي كتابة) والصوت مستمر؛ لمستان متتاليتان => تخرج الصورة.
 * لإضافة صورة: ارفع bg-N.jpg و bg-N-t.jpg (مصغّرة) وأضف سطراً في IMAGES.
 */
(function () {
    'use strict';
    var IMAGES = [
        { id: 'bg-1', name: 'داخل المسجد', w: 714, h: 1280 },
        { id: 'bg-2', name: 'المسجد ليلاً', w: 714, h: 1280 },
        { id: 'bg-3', name: 'المنارة عند الغروب', w: 714, h: 1280 },
        { id: 'bg-4', name: 'المسجد عند الغسق', w: 1280, h: 714 },
        { id: 'bg-5', name: 'ثريا المسجد', w: 1280, h: 714 },
        { id: 'bg-6', name: 'الحرم المكي', w: 714, h: 1280 },
        { id: 'bg-7', name: 'الحرم المكي — بانوراما', w: 1280, h: 714 },
        { id: 'bg-8', name: 'كسوة الكعبة', w: 714, h: 1280 },
        { id: 'bg-9', name: 'الكعبة المشرفة', w: 1280, h: 714 },
        { id: 'bg-10', name: 'القبة والمحراب', w: 714, h: 1280 },
        { id: 'bg-11', name: 'فانوس ومصحف', w: 1280, h: 698 },
        { id: 'bg-12', name: 'الكعبة ليلاً — قريباً', w: 714, h: 1280 },
        { id: 'bg-13', name: 'الكعبة ليلاً — واسعة', w: 1280, h: 714 },
        { id: 'bg-14', name: 'باب المقرنصات', w: 714, h: 1280 },
        { id: 'bg-15', name: 'المسجد الكبير عند الغروب', w: 1280, h: 714 },
        { id: 'bg-16', name: 'الطواف عند الغروب', w: 1280, h: 714 }
    ];
    IMAGES.forEach(function (m) { m.file = m.id + '.jpg'; m.thumb = m.id + '-t.jpg'; });
    var KEY = 'muslim-bg-site';
    function $(id) { return document.getElementById(id); }
    function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { } return null; }
    function find(id) { for (var i = 0; i < IMAGES.length; i++) if (IMAGES[i].id === id) return IMAGES[i]; return null; }
    function dim(m) { return m.w + ' × ' + m.h + ' بكسل'; }

    var GLASS = '.card,.tile,.setting,.reader,.section,.top,.nav,.topbar,.stgCat,.stgGroup,.stgRow,.mushafToolbar,.quranAyahs,.globalMiniPlayer,.v43AudioBar,.v50HubRow,.detailHero,#v107Drawer,.field,.search,select,input,textarea,button';
    function scope(prefix, extra) { return GLASS.split(',').map(function (s) { return prefix + s; }).join(',') + (extra || ''); }
    var CSS = [
        '#siteBg{position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;height:100dvh;z-index:-1;background-size:cover;background-position:center;background-repeat:no-repeat;display:none}',
        '#siteBg:after{content:"";position:absolute;inset:0;background:rgba(255,255,255,.18)}',
        'html.bgDark #siteBg:after{background:rgba(0,0,0,.38)}',
        'html.bgOn #siteBg{display:block}',
        'html.bgOn,html.bgOn body,html.bgOn .dark,html.bgOn .dark body{background:transparent!important;background-image:none!important}',
        'html.bgOn .app,html.bgOn main,html.bgOn .page,html.bgOn .stgCatBody{background:transparent!important}',
        scope('html.bgOn ') + '{background:rgba(255,255,255,.6)!important;-webkit-backdrop-filter:blur(14px) saturate(1.35);backdrop-filter:blur(14px) saturate(1.35);border-color:rgba(255,255,255,.4)!important;box-shadow:0 4px 18px rgba(0,0,0,.12)!important}',
        scope('html.bgOn.bgDark ') + '{background:rgba(12,22,20,.52)!important;border-color:rgba(255,255,255,.14)!important}',
        'html.bgOn .stgRow,html.bgOn .stgRow button,html.bgOn .stgRow select,html.bgOn .stgRow input{box-shadow:none!important}',
        '.bgGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px;margin:8px 0}',
        '.bgOpt{border:2px solid var(--line,#ccc);border-radius:14px;overflow:hidden;cursor:pointer;background:var(--card,#fff);padding:0;text-align:center;font:inherit;color:inherit}',
        '.bgOpt.sel{border-color:var(--gold,#c9a227);box-shadow:0 0 0 2px var(--gold,#c9a227)}',
        '.bgOpt img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;background:#222}',
        '.bgOpt b{display:block;font-size:12px;padding:5px 4px 0}.bgOpt small{display:block;font-size:11px;opacity:.8;padding:0 4px 6px;direction:ltr;unicode-bidi:plaintext}',
        '.bgNone{display:flex;align-items:center;justify-content:center;aspect-ratio:3/4;font-size:13px}',
        '.bgMiniBtn{display:none;flex:0 0 auto;min-width:34px;white-space:nowrap}.bgMiniBtn.on{display:inline-block}',
        '#bgSheet{position:fixed;inset:0;z-index:9500;display:none;background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}',
        '#bgSheet.on{display:flex;align-items:flex-end;justify-content:center}',
        '#bgSheet .bgBox{width:min(560px,100%);max-height:88vh;overflow:auto;background:var(--card,#fff);color:var(--text,#111);border-radius:20px 20px 0 0;padding:14px 14px calc(18px + env(safe-area-inset-bottom,0px))}',
        '#bgSheet h3{margin:0 0 4px;font-size:16px}#bgSheet p{margin:0 0 6px;font-size:12px;opacity:.75}',
        '#bgFull{position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;height:100dvh;z-index:9800;display:none;background:#000 center center/cover no-repeat;touch-action:manipulation;-webkit-user-select:none;user-select:none}',
        '#bgFull.on{display:block}',
        '#bgFull .bgL{position:absolute;inset:0;background:#000 center center/cover no-repeat;opacity:0;transition:opacity 1.8s ease-in-out;will-change:opacity}',
        '#bgFull .bgL.show{opacity:1}',
        '#bgFull .bgL.zoom{animation:bgKb 16s ease-out forwards}',
        '@keyframes bgKb{from{transform:scale(1)}to{transform:scale(1.07)}}',
        '@media (prefers-reduced-motion:reduce){#bgFull .bgL{transition-duration:.4s}}',
        '#bgFull .bgPP{position:absolute;left:50%;bottom:calc(26px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.5)!important;background:rgba(0,0,0,.45)!important;color:#fff!important;font-size:20px;cursor:pointer;box-shadow:none!important}',
        '#bgFull .bgProg{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.25)}#bgFull .bgProg i{display:block;height:100%;width:0;background:#fff}'
    ].join('\n');

    /* ---------- خلفية الموقع ---------- */
    function syncDark() { document.documentElement.classList.toggle('bgDark', document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')); }
    function applySite() {
        var id = ls(KEY), m = id && find(id), bg = $('siteBg');
        if (!bg) { bg = document.createElement('div'); bg.id = 'siteBg'; document.body.insertBefore(bg, document.body.firstChild); }
        bg.style.backgroundImage = m ? 'url("' + m.file + '")' : '';
        document.documentElement.classList.toggle('bgOn', !!m);
        syncDark();
        var tc = document.querySelector('meta[name=theme-color]');
        if (tc) { if (!tc.dataset.o) tc.dataset.o = tc.content; tc.content = m ? '#10201c' : tc.dataset.o; }
        [].forEach.call(document.querySelectorAll('#bgGrid .bgOpt'), function (b) { b.classList.toggle('sel', (b.getAttribute('data-id') || '') === (m ? m.id : '')); });
    }
    function optHtml(m, attr) { return '<button type="button" class="bgOpt" ' + attr + '="' + m.id + '"><img loading="lazy" alt="' + m.name + '" src="' + m.thumb + '"><b>' + m.name + '</b><small>' + dim(m) + '</small></button>'; }
    function mountSettings() {
        if ($('stgcat-bg')) return true;
        var set = $('settings'); if (!set) return false;
        var d = document.createElement('details'); d.className = 'stgCat'; d.id = 'stgcat-bg';
        d.innerHTML = '<summary><span class="ci">🖼️</span>الخلفية والمظهر الزجاجي<span class="cs">▾</span></summary><div class="stgCatBody"><div class="stgGroup open"><div class="stgRow"><div class="mini">اختر صورة لتصبح خلفية الموقع كله: يتحول الموقع إلى مظهر <b>زجاجي</b> وتظهر الصورة خلف الأزرار والبطاقات. تُحفظ على جهازك.</div></div><div class="bgGrid" id="bgGrid"><button type="button" class="bgOpt" data-id=""><div class="bgNone">بدون خلفية</div><b>افتراضي</b><small>—</small></button>' + IMAGES.map(function (m) { return optHtml(m, 'data-id'); }).join('') + '</div></div></div>';
        var ref = $('stgcat-appearance'), host = set.querySelector('.stgCat');
        if (ref) ref.parentNode.insertBefore(d, ref.nextSibling); else if (host) host.parentNode.insertBefore(d, host); else set.appendChild(d);
        d.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.bgOpt'); if (!b) return; ls(KEY, b.getAttribute('data-id') || null); applySite(); });
        applySite(); return true;
    }

    /* ---------- خلفية التلاوة ---------- */
    var cur = null, sheet, full, idleSince = 0;
    var els = [];
    function real(el) { var u = el && (el.currentSrc || el.src) || ''; return !!u && u.indexOf('data:') !== 0; }   /* تُتجاهل مقاطع الصمت التي يشغّلها التطبيق لفتح الصوت */
    function playingEl() { for (var i = 0; i < els.length; i++) { var e = els[i]; if (real(e) && !e.ended && !e.paused) return e; } return null; }
    function active() { var p = playingEl(); if (p) { cur = p; return true; } return !!cur && real(cur) && !cur.ended && cur.currentTime > 0; }
    function track(el) {
        if (!el._bgT) {
            el._bgT = 1; els.push(el);
            ['pause', 'ended', 'emptied', 'play', 'playing', 'error'].forEach(function (ev) { el.addEventListener(ev, function () { if ((ev === 'play' || ev === 'playing') && real(el)) cur = el; refresh(); }); });
        }
        if (real(el)) cur = el; refresh();
    }
    function patchPlay() {
        var P = HTMLMediaElement.prototype, o = P.play; if (!o || o._bg) return;
        P.play = function () { if (this instanceof HTMLAudioElement) track(this); return o.apply(this, arguments); };
        P.play._bg = 1;
    }
    function injectButtons() {
        [['#globalMiniPlayer .miniPlayerActions', '#miniCloseBtn'], ['#v43AudioBar .miniPlayerActions', '#v43AudioClose']].forEach(function (p) {
            var host = document.querySelector(p[0]); if (!host || host.querySelector('.bgMiniBtn')) return;
            var b = document.createElement('button'); b.type = 'button'; b.className = 'bgMiniBtn'; b.title = 'خلفية التلاوة'; b.setAttribute('aria-label', 'خلفية التلاوة'); b.innerHTML = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/></svg>';
            var ref = host.querySelector(p[1]); if (ref) host.insertBefore(b, ref); else host.appendChild(b);
        });
    }
    function refresh() {
        var on = active();
        [].forEach.call(document.querySelectorAll('.bgMiniBtn'), function (b) { b.classList.toggle('on', on); });
        // الخلفية تبقى عند انتقال المقطع/التكرار؛ لا تُغلق إلا إذا انتهى الصوت فعلاً (أكثر من 10 ثوانٍ دون تشغيل)
        if (on) idleSince = 0; else if (!idleSince) idleSince = Date.now();
        if (!on && full && full.classList.contains('on') && idleSince && Date.now() - idleSince > 10000) closeFull();
        updFull();
    }
    /* الصور المناسبة لاتجاه الشاشة الحالي فقط: شاشة طولية ← صور طولية، وشاشة عرضية ← صور عرضية */
    function fits() {
        var port = window.innerHeight > window.innerWidth;
        var l = IMAGES.filter(function (m) { return port ? m.h > m.w : m.w >= m.h; });
        return l.length ? l : IMAGES.slice();
    }
    var PLAY = 'muslim-bg-play', slide = null;
    function openSheet() {
        var pool = fits(), sel = ls(PLAY) || '';
        var rnd = '<button type="button" class="bgOpt bgRnd' + (sel === 'random' ? ' sel' : '') + '" data-pick="random" style="grid-column:1/-1"><b style="font-size:15px;padding:12px 4px 2px">🔀 انتقال عشوائي</b><small style="direction:rtl;padding-bottom:10px">تتبدّل الصور بنعومة كل ١٢ ثانية، ومن المناسب لشاشتك فقط</small></button>';
        sheet.innerHTML = '<div class="bgBox"><h3>🖼️ خلفية التلاوة</h3><p>تظهر هنا الصور المناسبة لشاشتك فقط (' + pool.length + ' صورة). اضغط صورة لتصبح خلفية الشاشة والتلاوة مستمرة. للخروج منها المس الشاشة لمستين متتاليتين.</p><div class="bgGrid">' + rnd + pool.map(function (m) { return optHtml(m, 'data-pick'); }).join('') + '</div><button type="button" class="bgOpt" data-close="1" style="width:100%;padding:10px;margin-top:4px">إغلاق</button></div>';
        sheet.classList.add('on');
    }
    /* عرض شرائح احترافي: طبقتان متراكبتان، تحميل مسبق للصورة التالية قبل الظهور، تلاشٍ ناعم مع تقريب بطيء جدًا،
       ترتيب عشوائي بلا تكرار متتالٍ، ويتوقف عند إخفاء الصفحة (توفيرًا للبطارية) ويحترم «تقليل الحركة». */
    function stopSlide() { if (slide) { clearTimeout(slide.t); slide.dead = 1; window.removeEventListener('resize', slide.rs); document.removeEventListener('visibilitychange', slide.vc); slide = null; } }
    function startSlide() {
        stopSlide();
        var S = slide = { dead: 0, bag: [], last: '', front: 0, t: 0 };
        var calm = false; try { calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
        full.style.backgroundImage = 'none';
        full.innerHTML = '<div class="bgL" data-l="0"></div><div class="bgL" data-l="1"></div><button type="button" class="bgPP" aria-label="تشغيل/إيقاف"></button><div class="bgProg"><i></i></div>';
        var L = [full.querySelector('[data-l="0"]'), full.querySelector('[data-l="1"]')];
        function next() {
            var pool = fits();
            if (!S.bag.length) {
                S.bag = pool.map(function (m) { return m.id; });
                for (var i = S.bag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = S.bag[i]; S.bag[i] = S.bag[j]; S.bag[j] = t; }
                if (S.bag.length > 1 && S.bag[S.bag.length - 1] === S.last) S.bag.unshift(S.bag.pop());
            }
            var id = S.bag.pop(); return find(id) || pool[0];
        }
        function step(first) {
            if (S.dead) return;
            if (document.hidden) { S.t = setTimeout(function () { step(first); }, 4000); return; }
            var m = next(), im = new Image();
            im.onload = im.onerror = function () {
                if (S.dead) return;
                var back = L[1 - S.front], fr = L[S.front];
                back.style.backgroundImage = 'url("' + m.file + '")';
                back.className = 'bgL' + (calm ? '' : ' zoom');
                void back.offsetWidth;
                back.classList.add('show'); if (!first) fr.classList.remove('show');
                S.front = 1 - S.front; S.last = m.id;
                S.t = setTimeout(function () { step(false); }, 12000);
            };
            im.src = m.file;
        }
        S.rs = function () { S.bag = []; };      // عند تدوير الجهاز تُعاد تعبئة الصور من الاتجاه الجديد
        S.vc = function () { };
        window.addEventListener('resize', S.rs);
        step(true);
    }
    function showFull(id) {
        stopSlide();
        if (id === 'random') { ls(PLAY, 'random'); sheet.classList.remove('on'); full.classList.add('on'); document.body.style.overflow = 'hidden'; startSlide(); updFull(); return; }
        var m = find(id); if (!m) return;
        ls(PLAY, id);
        full.style.backgroundImage = 'url("' + m.file + '")';
        full.innerHTML = '<button type="button" class="bgPP" aria-label="تشغيل/إيقاف"></button><div class="bgProg"><i></i></div>';
        sheet.classList.remove('on'); full.classList.add('on'); document.body.style.overflow = 'hidden'; updFull();
    }
    function closeFull() { stopSlide(); full.classList.remove('on'); full.innerHTML = ''; full.style.backgroundImage = ''; document.body.style.overflow = ''; }
    function updFull() {
        if (!full || !full.classList.contains('on') || !cur) return;
        var pp = full.querySelector('.bgPP'), p = full.querySelector('.bgProg i');
        if (pp) pp.textContent = cur.paused ? '▶' : '⏸';
        if (p && cur.duration > 0 && isFinite(cur.duration)) p.style.width = (cur.currentTime / cur.duration * 100) + '%';
    }
    function initPlayer() {
        sheet = document.createElement('div'); sheet.id = 'bgSheet'; full = document.createElement('div'); full.id = 'bgFull';
        document.body.appendChild(sheet); document.body.appendChild(full);
        // تفويض الأحداث: يعمل الزر حتى لو تغيّر عرض الشريط (نص تشغيل/إيقاف) بين لحظتي الضغط والرفع
        var downT = 0;
        document.addEventListener('pointerdown', function (e) { downT = e.target.closest && e.target.closest('.bgMiniBtn') ? Date.now() : 0; }, true);
        document.addEventListener('click', function (e) {
            var c = e.target.closest ? e.target : e.target.parentNode;
            var hit = c.closest('.bgMiniBtn') || (downT && Date.now() - downT < 900 && c.closest('.miniPlayerActions'));
            downT = 0; if (hit) { e.stopPropagation(); openSheet(); }
        }, true);
        sheet.addEventListener('click', function (e) {
            var pk = e.target.closest && e.target.closest('[data-pick]');
            if (pk) showFull(pk.getAttribute('data-pick'));
            else if (e.target === sheet || (e.target.closest && e.target.closest('[data-close]'))) sheet.classList.remove('on');
        });
        var last = 0;                                              // لمستان متتاليتان (≤ 450ms) => خروج
        full.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('.bgPP')) { if (cur) { if (cur.paused) { var r = cur.play(); if (r && r.catch) r.catch(function () { }); } else cur.pause(); } updFull(); last = 0; return; }
            var t = Date.now(); if (t - last < 450) { last = 0; closeFull(); } else last = t;
        });
        setInterval(function () { if (document.hidden) return; updFull(); injectButtons(); refresh(); }, 2000);
        [].forEach.call(document.querySelectorAll('audio'), function (a) { if (!a.paused) track(a); });
        injectButtons();
    }

    function init() {
        var st = document.createElement('style'); st.id = 'bgCss'; st.textContent = CSS; document.head.appendChild(st);
        applySite(); initPlayer();
        var n = 0, iv = setInterval(function () { if (mountSettings() || ++n > 100) clearInterval(iv); }, 600);
        var mo = new MutationObserver(syncDark);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] }); mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }
    patchPlay();
    window.MuslimBg = { images: IMAGES, set: function (id) { ls(KEY, id || null); applySite(); }, get: function () { return ls(KEY) || ''; } };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
