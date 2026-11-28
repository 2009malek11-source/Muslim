/* واجهة إضافية: طيّ الشريط الجانبي، توفير البيانات، اختصارات سريعة، ولوحة المفاتيح */
(function () {
    'use strict';
    var LSG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    var $ = function (id) { return document.getElementById(id); };
    var go = function (id, fn) { try { if (typeof window.show === 'function') window.show(id); if (fn && typeof window[fn] === 'function') window[fn](); } catch (e) { } };

    /* ---- الشريط الجانبي (الشاشات العريضة) ---- */
    function applySb(c) { document.body.classList.toggle('sbCollapsed', !!c); var b = document.querySelector('nav.nav .sbToggle'); if (b) { b.setAttribute('aria-expanded', c ? 'false' : 'true'); b.setAttribute('aria-label', c ? 'فتح الشريط الجانبي' : 'طيّ الشريط الجانبي'); var t = b.querySelector('b'); if (t) t.textContent = c ? 'فتح' : 'طيّ القائمة'; var i = b.querySelector('.sbI'); if (i) i.textContent = c ? '«' : '»'; } }
    function mountSb() {
        var nav = document.querySelector('nav.nav'); if (!nav) return false;
        if (nav.querySelector('.sbToggle')) return true;
        var b = document.createElement('button'); b.type = 'button'; b.className = 'sbToggle'; b.innerHTML = '<span class="sbI" aria-hidden="true">»</span><b>طيّ القائمة</b>';
        b.onclick = function () { var c = !document.body.classList.contains('sbCollapsed'); LSS('muslim-sb', c ? '1' : '0'); applySb(c); };
        nav.appendChild(b); applySb(LSG('muslim-sb') === '1'); return true;
    }

    /* ---- توفير البيانات ---- */
    function dsOn() { var v = LSG('muslim-datasaver'); if (v === null) { try { return !!(navigator.connection && navigator.connection.saveData); } catch (e) { return false; } } return v === '1'; }
    function applyDs() { document.body.classList.toggle('dataSaver', dsOn()); }
    function mountDs() {
        var g = document.querySelector('#stgcat-look .stgGroup'); if (!g) return false;
        if ($('plusDsRow')) return true;
        var l = document.createElement('label'); l.className = 'stgRow stgSw'; l.id = 'plusDsRow';
        l.innerHTML = '<div><b>توفير البيانات</b><small>يُخفي الصور والخلفيات ولا يحمّلها لتوفير الإنترنت وتسريع الموقع</small></div>';
        var i = document.createElement('input'); i.type = 'checkbox'; i.checked = dsOn(); i.onchange = function () { LSS('muslim-datasaver', i.checked ? '1' : '0'); applyDs(); };
        l.appendChild(i); g.appendChild(l); return true;
    }

    /* ---- الخصوصية: إحصاءات مجهولة + رسائل الإدارة (بموافقتك فقط) ---- */
    function mountPrivacy() {
        var g = document.querySelector('#stgcat-about .stgGroup'); if (!g) return false;
        if ($('plusPrivRow')) return true;
        function row(id, t, sub, on, fn) { var l = document.createElement('label'); l.className = 'stgRow stgSw'; l.id = id; l.innerHTML = '<div><b>' + t + '</b><small>' + sub + '</small></div>'; var i = document.createElement('input'); i.type = 'checkbox'; i.checked = on; i.onchange = function () { fn(i.checked); }; l.appendChild(i); g.appendChild(l); }
        row('plusPrivRow', 'إحصاءات مجهولة', 'بلا اسم ولا حساب. تُرسل للإدارة معلومات الجهاز والشبكة وIP ومنطقتك التقريبية وأسماء الأزرار ومدة الاستماع لحل المشكلات، وتُحذف بعد ٤ أيام. يمكنك إيقافها في أي وقت.', LSG('muslim-stats-off') !== '1', function (v) { LSS('muslim-stats-off', v ? '0' : '1'); });
        row('plusInboxRow', 'استقبال رسائل من إدارة المسلم', 'اختياري ومعطّل افتراضيًا. عند تفعيله يُنشأ معرّف عشوائي على جهازك فقط ليتمكن المدير من إرسال رسالة لك. لا يكشف هويتك.', LSG('muslim-inbox') === '1', function (v) { LSS('muslim-inbox', v ? '1' : '0'); if (!v) { try { localStorage.removeItem('muslim-vk'); } catch (e) { } } });
        return true;
    }

    /* ---- الاختصارات السريعة في الرئيسية ---- */
    function mountQuick() { var q = $('plusQuick'); if (q) q.remove(); return true; } /* أُزيل زر «تابع المصحف» بطلب المالك */

    /* ---- لوحة المفاتيح ---- */
    function kbd() {
        document.querySelectorAll('.tile:not([tabindex])').forEach(function (t) { t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button'); });
    }
    function help() {
        var o = $('plusKbd'); if (o) { o.remove(); return; }
        o = document.createElement('div'); o.id = 'plusKbd'; o.className = 'plusOv show'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'اختصارات لوحة المفاتيح');
        var rows = [['M', 'المصحف'], ['R', 'القراء'], ['A', 'الأذكار'], ['H', 'الرئيسية'], ['S', 'الإعدادات'], ['Q', 'القبلة'], ['← →', 'تقليب صفحات المصحف'], ['Tab / Enter', 'التنقل وفتح العناصر'], ['Esc', 'إغلاق النوافذ'], ['?', 'هذه القائمة']];
        var b = document.createElement('div'); b.className = 'plusBox'; b.innerHTML = '<div class="plusHd"><b>اختصارات لوحة المفاتيح</b><button type="button" aria-label="إغلاق">✕</button></div>' + rows.map(function (r) { return '<div class="rpRow"><kbd>' + r[0] + '</kbd><span>' + r[1] + '</span></div>'; }).join('');
        b.querySelector('button').onclick = function () { o.remove(); }; o.onclick = function (e) { if (e.target === o) o.remove(); };
        o.appendChild(b); document.body.appendChild(o); b.querySelector('button').focus();
    }
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target, tag = (t && t.tagName) || '';
        if (e.key === 'Escape') { var k = $('plusKbd'); if (k) k.remove(); return; }
        if ((e.key === 'Enter' || e.key === ' ') && t && t.classList && t.classList.contains('tile')) { e.preventDefault(); t.click(); return; }
        if (/INPUT|TEXTAREA|SELECT/.test(tag) || (t && t.isContentEditable)) return;
        var k = (e.key || '').toLowerCase();
        var map = { m: ['mushaf107'], r: ['readers'], a: ['adhkar', 'initAdhkarV27'], h: ['home'], s: ['settings'], q: ['qibla'] };
        if (e.key === '?' || e.key === '؟') { e.preventDefault(); help(); return; }
        if (map[k]) { e.preventDefault(); go(map[k][0], map[k][1]); }
    });

    function boot() {
        applyDs(); var n = 0;
        var iv = setInterval(function () { kbd(); var a = mountSb(), b = mountDs(), c = mountQuick(); mountPrivacy(); if ((a && b && c) || ++n > 80) clearInterval(iv); }, 500);
        var deb = 0; try { new MutationObserver(function () { clearTimeout(deb); deb = setTimeout(function () { kbd(); mountSb(); mountDs(); mountQuick(); mountPrivacy(); }, 200); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.MuslimUI = { toggleSidebar: function () { var b = document.querySelector('nav.nav .sbToggle'); if (b) b.click(); }, help: help };
})();

/* تشغيل الصوت في الخلفية: Media Session لعناصر الصوت (قرآن/أذكار/تسجيلات) كي يستمر التشغيل وتظهر أزرار التحكم عند قفل الشاشة */
(function () {
    'use strict';
    if (!('mediaSession' in navigator)) return;
    var ms = navigator.mediaSession, cur = null, lastPos = 0, was = null;
    function skip(a) { var s = String(a.currentSrc || a.src || ''); return !s || a.loop || /^data:|adhan|iqama|tone-|silence|keepalive/i.test(s); }
    function nm() {
        var t = document.getElementById('v43AudioTitle'), b = document.getElementById('v43AudioBar'), r = document.getElementById('readerTitle');
        var x = (t && b && b.classList.contains('show') && t.textContent) || (r && r.offsetParent && r.textContent) || document.title || 'المسلم';
        return String(x).replace(/\s+/g, ' ').trim().slice(0, 80);
    }
    function meta(a) {
        try {
            var sub = document.getElementById('v43AudioSub');
            ms.metadata = new MediaMetadata({ title: nm(), artist: (sub && sub.textContent && sub.textContent.trim().slice(0, 60)) || 'المسلم', album: 'المسلم', artwork: [{ src: 'ic-192.png', sizes: '192x192', type: 'image/png' }, { src: 'ic-512.png', sizes: '512x512', type: 'image/png' }] });
        } catch (e) { }
    }
    function pos(a) {
        try { var n = Date.now(); if (n - lastPos < 1000) return; lastPos = n; if (ms.setPositionState && isFinite(a.duration) && a.duration > 0) ms.setPositionState({ duration: a.duration, playbackRate: a.playbackRate || 1, position: Math.min(a.currentTime || 0, a.duration) }); } catch (e) { }
    }
    function handlers() {
        var H = {
            play: function () { if (cur) { var p = cur.play(); if (p && p.catch) p.catch(function () { }); } },
            pause: function () { was = null; if (cur) cur.pause(); },
            seekbackward: function (d) { if (cur) cur.currentTime = Math.max(0, cur.currentTime - ((d && d.seekOffset) || 10)); },
            seekforward: function (d) { if (cur) cur.currentTime = Math.min(cur.duration || 1e9, cur.currentTime + ((d && d.seekOffset) || 10)); },
            seekto: function (d) { if (cur && d && isFinite(d.seekTime)) cur.currentTime = d.seekTime; },
            stop: function () { was = null; if (cur) { cur.pause(); } }
        };
        Object.keys(H).forEach(function (k) { try { ms.setActionHandler(k, H[k]); } catch (e) { } });
    }
    function hook(a) {
        if (!a || a.__msx) return; a.__msx = 1;
        a.addEventListener('playing', function () { if (skip(a)) return; cur = a; meta(a); handlers(); try { ms.playbackState = 'playing'; } catch (e) { } });
        a.addEventListener('pause', function () { if (cur === a) { try { ms.playbackState = 'paused'; } catch (e) { } } });
        a.addEventListener('ended', function () { if (cur === a) { try { ms.playbackState = 'none'; } catch (e) { } } });
        a.addEventListener('timeupdate', function () { if (cur === a) pos(a); });
        a.addEventListener('loadedmetadata', function () { if (cur === a) { meta(a); pos(a); } });
    }
    var op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { try { hook(this); } catch (e) { } return op.apply(this, arguments); };
    document.addEventListener('play', function (e) { try { hook(e.target); } catch (x) { } }, true);
    /* لا نوقف الصوت عند إخفاء الصفحة؛ وإن أوقفه المتصفح بسبب الانتقال لتطبيق آخر يُستأنف عند العودة إن كان المستخدم يستمع */
    document.addEventListener('visibilitychange', function () {
        try {
            if (document.visibilityState === 'hidden') { was = (cur && !cur.paused && !cur.ended) ? cur : null; return; }
            if (was && was.paused && !was.ended && !was.__userPaused) { var p = was.play(); if (p && p.catch) p.catch(function () { }); }
            was = null;
        } catch (e) { }
    });
})();

/* ---- تهنئة ليلة الجمعة ويوم الجمعة + حقوق «المسلم كمصدر» ---- */
(function () {
    'use strict';
    var LSG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    function kind() { var d = new Date(), w = d.getDay(), h = d.getHours(); if (w === 5) return 'jum'; if (w === 4 && h >= 17) return 'eve'; return ''; }
    function dayKey() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function showGreet() { try { if (window.v107Occ) window.v107Occ.render(); } catch (e) { } }
    function rows() {
        var g = document.querySelector('#stgcat-about .stgGroup'); if (!g) return false; if (document.getElementById('friRow')) return true;
        var l = document.createElement('label'); l.className = 'stgRow stgSw'; l.id = 'friRow'; l.innerHTML = '<div><b>تهنئة المناسبات (الجمعة، الأشهر الهجرية، رمضان، الأعياد)</b><small>تظهر في الشاشة الرئيسية مع العمل المستحب ودليله.</small></div>';
        var i = document.createElement('input'); i.type = 'checkbox'; i.checked = LSG('muslim-fri-off') !== '1'; i.onchange = function () { LSS('muslim-fri-off', i.checked ? '0' : '1'); showGreet(); }; l.appendChild(i); g.appendChild(l);
        var r = document.createElement('div'); r.className = 'stgRow'; r.id = 'srcRow';
        var base = location.origin + location.pathname.replace(/[^\/]*$/, '');
        r.innerHTML = '<div><b>حقوق المحتوى — «المسلم» كمصدر</b><small></small></div>';
        r.querySelector('small').textContent = 'للجميع أخذ قائمة القرّاء (' + base + 'muslim-readers.json) والأحاديث والأذكار والأدعية والصور من موقع المسلم وإعادة استخدامها مجانًا دون الحاجة إلى التواصل معنا، بشرط ذكر «المصدر: موقع المسلم» بشكل ظاهر. الملفات الصوتية ملك لأصحابها وتُحمَّل من مصادرها الأصلية.';
        g.appendChild(r); return true;
    }
    var tries = 0, iv = setInterval(function () { if (rows() || ++tries > 40) clearInterval(iv); }, 500);
    setTimeout(showGreet, 1500); setTimeout(showGreet, 4000); setInterval(showGreet, 60000);
})();
