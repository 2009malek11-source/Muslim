(function () {
    'use strict';
    // متابعة صلاتي — داخل «عالم الأطفال». تُحفظ على الجهاز فقط، للتشجيع والمتابعة لا للحساب.
    var KEY = 'muslim-kids-salah';
    var PR = [['fajr', 'الفجر', '🌅'], ['dhuhr', 'الظهر', '☀️'], ['asr', 'العصر', '🌤️'], ['maghrib', 'المغرب', '🌇'], ['isha', 'العشاء', '🌙']];
    function $(i) { return document.getElementById(i); }
    function dkey(d) { d = d || new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
    function save(o) { try { var k = Object.keys(o); if (k.length > 120) delete o[k[0]]; localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } }
    function count(x) { return PR.filter(function (p) { return x && x[p[0]]; }).length; }
    function streak(o) { var n = 0, d = new Date(); if (count(o[dkey(d)]) < 5) d.setDate(d.getDate() - 1); while (count(o[dkey(d)]) === 5 && n < 3650) { n++; d.setDate(d.getDate() - 1); } return n; }
    var MSG = ['ابدأ بنية صافية، وبسم الله 🤍', 'أحسنت! أكمل 🌟', 'ما شاء الله، أنت في الطريق ✨', 'رائع جدًا! بقي القليل 💪', 'ما شاء الله! بقيت صلاة واحدة 🌈', 'بارك الله فيك! أتممتَ صلواتك اليوم 🏆'];
    function render() {
        var box = $('kidsSalah'); if (!box) return;
        var o = load(), t = o[dkey()] || {}, c = count(t), w = '';
        for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var n = count(o[dkey(d)]); w += '<div class="ksDay"><i style="height:' + (n * 20) + '%"></i><small>' + ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'][d.getDay()] + '</small></div>'; }
        box.innerHTML = '<h3>🕌 متابعة صلاتي</h3><p class="mini">اضغط على الصلاة التي صلّيتها اليوم. للمتابعة والتشجيع فقط.</p><div class="ksRow">' +
            PR.map(function (p) { return '<button type="button" class="ksBtn' + (t[p[0]] ? ' on' : '') + '" data-ks="' + p[0] + '" aria-pressed="' + (t[p[0]] ? 'true' : 'false') + '"><span>' + (t[p[0]] ? '⭐' : p[2]) + '</span>' + p[1] + '</button>'; }).join('') +
            '</div><div class="ksMsg">' + MSG[c] + '</div><div class="ksWeek">' + w + '</div><p class="mini">أيام متتالية أتممتَ فيها الخمس: <b>' + streak(o) + '</b></p>';
        box.querySelectorAll('[data-ks]').forEach(function (b) { b.onclick = function () { var x = load(), k = dkey(), p = b.getAttribute('data-ks'); x[k] = x[k] || {}; x[k][p] = !x[k][p]; save(x); render(); }; });
    }
    function mount() {
        var ch = $('children'); if (!ch) return false;
        if (!$('kidsSalah')) { var hero = ch.querySelector('.childHero'); var card = document.createElement('div'); card.id = 'kidsSalah'; card.className = 'card'; if (hero && hero.nextSibling) hero.parentNode.insertBefore(card, hero.nextSibling); else ch.appendChild(card); }
        render(); return true;
    }
    var n = 0, iv = setInterval(function () { if (mount() || ++n > 40) clearInterval(iv); }, 400);
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[onclick*="children"]')) setTimeout(mount, 80); }, true);
})();
