/* player-bar.js — شريط التشغيل السفلي الموحّد
 * كل صوت في التطبيق (رقية، أذكار، أدعية، أوضاع، تكرار…) يظهر في نفس شريط القرّاء:
 * [أيقونة + الاسم + نوع المحتوى] [تشغيل/إيقاف] [الخلفية] [إغلاق ✕].
 * يعتمد على اعتراض HTMLMediaElement.play فيشمل العناصر الظاهرة وكائنات new Audio() غير الظاهرة.
 * لا يتدخل في: أذان/إقامة، صوت المصحف، اختبار القرآن، تجارب الإعدادات، وتلاوة القرّاء (لها شريطها).
 */
(function () {
    'use strict';
    var SKIP_PAGES = { prayer: 1, settings: 1, readers: 1, readerDetail: 1, quranDetail: 1 };   /* الصلاة والإعدادات: أذان/تجارب. القرّاء: لهم شريطهم. غير ذلك (المصحف، الاختبار، الأحاديث…) يظهر شريط الصوت */
    var SKIP_SRC = /^data:|adhan|iqama|takbeer|notify/i;
    var cur = null, lastTap = null;
    var ICON = { play: '▶ تشغيل', pause: '⏸ إيقاف' };
    function $(id) { return document.getElementById(id); }
    function page() { return document.body && document.body.dataset.pg || ''; }
    function pageTitle() { var s = document.querySelector('section.page.active h2'); return s ? s.textContent.replace(/\s+/g, ' ').trim() : ''; }
    document.addEventListener('pointerdown', function (e) { lastTap = e.target; }, true);
    function ctxTitle(a) {
        var from = (a && a.parentNode && a.isConnected) ? a : lastTap, n = from && from.closest ? from.closest('.card,.item,.tile,li,details,.mqItem,.reader,[data-title]') : null, t = '';
        if (n) { var h = n.querySelector('b,h3,h4,strong,summary'); t = h ? h.textContent.replace(/\s+/g, ' ').trim() : ''; }
        return t.length > 2 && t.length < 70 ? t : (pageTitle() || 'تسجيل صوتي');
    }
    function setMuteText(a) { var m = $('v43AudioMute'); if (m) m.textContent = a && a.muted ? '🔇 مكتوم' : '🔊 صوت'; }
    function setPlayText(playing) { var p = $('v43AudioPlay'); if (p) p.textContent = playing ? ICON.pause : ICON.play; }
    function attach(a) {
        if (!a || a.id === 'audio' || a.id === 'v43AudioElement') { if (a && a.id === 'v43AudioElement') cur = null; return; }
        var src = a.currentSrc || a.src || ''; if (!src || SKIP_SRC.test(src) || SKIP_PAGES[page()]) return;
        var bar = $('v43AudioBar'); if (!bar) return;
        if (cur && cur !== a) { try { cur.pause(); } catch (e) { } }
        var main = window.audio || $('audio'); if (main && !main.paused) { try { main.pause(); } catch (e) { } }
        var v = $('v43AudioElement'); if (v && !v.paused) { try { v.pause(); } catch (e) { } }
        cur = a;
        var t = $('v43AudioTitle'), s = $('v43AudioSub');
        var own = a.getAttribute && a.getAttribute('data-v107title');
        if (t) t.textContent = own || ctxTitle(a); if (s) s.textContent = a.getAttribute && a.getAttribute('data-v107sub') || pageTitle() || 'تسجيل صوتي'; setMuteText(a);
        bar.classList.add('show'); setPlayText(true);
        if (!a.__pb) { a.__pb = 1; a.addEventListener('pause', function () { if (cur === a) setPlayText(false); }); a.addEventListener('play', function () { if (cur === a) setPlayText(true); }); }
    }
    var op = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { try { attach(this); } catch (e) { } return op.apply(this, arguments); };
    function bind() {
        var p = $('v43AudioPlay'), c = $('v43AudioClose'); if (!p || !c) return;
        var mu = $('v43AudioMute'); if (mu && !mu.__pb) { mu.__pb = 1; mu.onclick = function (e) { e.stopPropagation(); if (cur) { cur.muted = !cur.muted; setMuteText(cur); } }; }
        var legacyP = p.onclick, legacyC = c.onclick;
        p.onclick = function (e) { if (cur) { if (cur.paused) cur.play().catch(function () { }); else cur.pause(); } else if (legacyP) legacyP.call(p, e); };
        c.onclick = function (e) { if (cur) { try { cur.pause(); } catch (x) { } cur = null; var b = $('v43AudioBar'); if (b) b.classList.remove('show'); setPlayText(false); } else if (legacyC) legacyC.call(c, e); };
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
