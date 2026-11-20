/* nova.js — الواجهة الجديدة: رأس، شريط سفلي/قائمة جانبية، بطل الصفحة الرئيسية بصور واقعية، بطاقات الأقسام، أوقات الصلاة وآية اليوم، مركز الإشعارات.
 * يُبنى فوق الأقسام الموجودة دون تغيير وظائفها. */
(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

    /* ---------- الأيقونات ---------- */
    var F = ' class="f"';
    var beads = (function () { var o = ''; for (var i = 0; i < 9; i++) { var a = (i / 9) * Math.PI * 2 - Math.PI / 2; o += '<circle cx="' + (12 + 6.4 * Math.cos(a)).toFixed(2) + '" cy="' + (10.5 + 6.4 * Math.sin(a)).toFixed(2) + '" r="1.55"' + F + '/>'; } return o + '<path d="M12 17.6v2.1"/><path d="M12 19.7c-1 .9-1 1.8 0 1.8s1-.9 0-1.8z"' + F + '/>'; })();
    var IC = {
        home: '<path d="M4 11.2 12 4l8 7.2V19a1.5 1.5 0 0 1-1.5 1.5h-3.2v-5H8.7v5H5.5A1.5 1.5 0 0 1 4 19z"' + F + '/><path d="M9.6 20.5v-4.8"/>',
        quran: '<path d="M12 6.4C10 4.9 7 4.5 4 4.9v13c3-.4 6 0 8 1.6 2-1.6 5-2 8-1.6v-13c-3-.4-6 0-8 1.5z"' + F + '/><path d="M12 6.4v13.1M6.8 8.5c1.2 0 2.3.2 3.3.7M6.8 11.9c1.2 0 2.3.2 3.3.7M17.2 8.5c-1.2 0-2.3.2-3.3.7M17.2 11.9c-1.2 0-2.3.2-3.3.7"/>',
        prayer: '<circle cx="12" cy="12" r="8.6"' + F + '/><path d="M12 7.3V12l3.2 2"/><path d="M12 2.6v1.5M12 19.9v1.5M2.6 12h1.5M19.9 12h1.5"/>',
        qibla: '<circle cx="12" cy="12" r="8.8"/><path d="m15.9 8.1-2.3 5.5-5.5 2.3 2.3-5.5z"' + F + '/><circle cx="12" cy="12" r=".9" fill="currentColor"/>',
        mosques: '<path d="M7.2 20v-6.3c0-3 2-5.1 4.8-6.9 2.8 1.8 4.8 3.9 4.8 6.9V20z"' + F + '/><path d="M12 3.6v3.2M10.9 4.9h2.2"/><path d="M3.8 20V11l1.3-2.1L6.4 11v9M17.6 20v-9l1.3-2.1 1.3 2.1v9"/><path d="M2.8 20h18.4M10.3 20v-2.8a1.7 1.7 0 0 1 3.4 0V20"/>',
        qtest: '<rect x="4.8" y="4.4" width="14.4" height="16.6" rx="3.2"' + F + '/><path d="M9 3.2h6v3.2H9z"/><path d="m8.4 11 1.2 1.2 2.1-2.3M8.4 16.2l1.2 1.2 2.1-2.3M14 11.6h2.6M14 16.8h2.6"/>',
        adhkar: beads,
        readers: '<path d="M4.2 14.2V12a7.8 7.8 0 0 1 15.6 0v2.2"/><rect x="3.4" y="13.4" width="4.2" height="6.6" rx="2"' + F + '/><rect x="16.4" y="13.4" width="4.2" height="6.6" rx="2"' + F + '/><path d="M12 9.2v5.2M9.8 10.6v2.4M14.2 10.6v2.4"/>',
        khatmah: '<circle cx="12" cy="12" r="8.6"' + F + '/><path d="M8.4 12.4l2.5 2.5 4.7-5.1"/><path d="M12 3.4a8.6 8.6 0 0 1 8.2 6" stroke-dasharray="1.2 2.4"/>',
        ruqyah: '<path d="M12 3.2 19 5.8v5.5c0 4.4-2.8 8.2-7 9.7-4.2-1.5-7-5.3-7-9.7V5.8z"' + F + '/><path d="M12 8.4l1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4-1.8-1.7 2.4-.3z"/>',
        hadith: '<path d="M6.8 3.8h9.9a2.3 2.3 0 0 1 2.3 2.3v11.8a2.6 2.6 0 0 1-2.6 2.6H8.1a2.6 2.6 0 0 1-2.6-2.6V5.1a1.3 1.3 0 0 1 1.3-1.3z"' + F + '/><path d="M9 8.6h7M9 12.2h7M9 15.8h4.2"/>',
        children: '<circle cx="12" cy="12.6" r="7.6"' + F + '/><path d="M8.9 14.6c.8 1.2 1.9 1.8 3.1 1.8s2.3-.6 3.1-1.8"/><circle cx="9.5" cy="11" r=".9" fill="currentColor"/><circle cx="14.5" cy="11" r=".9" fill="currentColor"/><path d="M12 2.2l.9 1.8 2 .3-1.4 1.4.3 2L12 6.7l-1.8.9.3-2-1.4-1.4 2-.3z"/>',
        repeat: '<path d="M5 11.6a7 7 0 0 1 11.8-4.3L19 9.4"/><path d="M19 12.4a7 7 0 0 1-11.8 4.3L5 14.6"/><path d="M19 4.8v4.6h-4.6M5 19.2v-4.6h4.6"/><circle cx="12" cy="12" r="1.6"' + F + '/>',
        modes: '<path d="M4.6 6.4h14.8M4.6 12h14.8M4.6 17.6h14.8"/><circle cx="9" cy="6.4" r="2.1"' + F + '/><circle cx="15.4" cy="12" r="2.1"' + F + '/><circle cx="8" cy="17.6" r="2.1"' + F + '/>',
        manasik: '<rect x="4" y="5.4" width="16" height="15.2" rx="3.6"' + F + '/><path d="M8 3.4v4M16 3.4v4M4 10.2h16"/><path d="M13.7 13.1a2.7 2.7 0 1 0 1.9 4.6 3.5 3.5 0 0 1-1.9-4.6z"/>',
        daily: '<path d="M3.6 17.4h16.8"/><path d="M7.4 17.4a4.6 4.6 0 0 1 9.2 0"' + F + '/><path d="M12 6.2v2.3M5.6 9l1.7 1.5M18.4 9l-1.7 1.5M3.4 13.2H5M19 13.2h1.6M8.2 20.6h7.6"/>',
        settings: '<circle cx="12" cy="12" r="3.1"' + F + '/><circle cx="12" cy="12" r="6.7"/><path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.8 5.8l1.5 1.5M16.7 16.7l1.5 1.5M5.8 18.2l1.5-1.5M16.7 7.3l1.5-1.5"/>',
        bell: '<path d="M6 16.6V11a6 6 0 0 1 12 0v5.6l1.6 2.1H4.4z"' + F + '/><path d="M10 20.6a2.2 2.2 0 0 0 4 0"/>',
        moon: '<path d="M19.6 14.3A8 8 0 1 1 9.7 4.4a6.3 6.3 0 0 0 9.9 9.9z"' + F + '/>',
        sun: '<circle cx="12" cy="12" r="4.2"' + F + '/><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5 7 7M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5"/>',
        search: '<circle cx="10.8" cy="10.8" r="6.6"' + F + '/><path d="m15.8 15.8 4.4 4.4"/>',
        assistant: '<path d="M12 3.4c1.2 3.8 2.8 5.4 6.6 6.6-3.8 1.2-5.4 2.8-6.6 6.6-1.2-3.8-2.8-5.4-6.6-6.6 3.8-1.2 5.4-2.8 6.6-6.6z"' + F + '/><path d="M18.6 15.8c.5 1.6 1.1 2.2 2.6 2.7-1.5.5-2.1 1.1-2.6 2.7-.5-1.6-1.1-2.2-2.7-2.7 1.6-.5 2.2-1.1 2.7-2.7z"/>',
        travel: '<path d="M21 4 3.6 10.4l6 2.4 2.4 6z"' + F + '/><path d="m9.6 12.8 4.4-4.2"/>',
        dua: '<path d="M12 20.4c-3.4 0-5.6-1.7-6.6-4.5l-1.4-4c-.3-.9.5-1.6 1.3-1.2l1.9 1V6.2c0-.9 1.3-1.2 1.6-.3l.8 2.4V4.6c0-1 1.4-1.2 1.7-.2L12 7l.7-2.6c.3-1 1.7-.8 1.7.2v3.8l.8-2.4c.3-.9 1.6-.6 1.6.3v6.9l1.9-1c.8-.4 1.6.3 1.3 1.2l-1.4 4c-1 2.8-3.2 4.5-6.6 4.5z"' + F + '/>',
        more: '<rect x="4" y="4" width="6.4" height="6.4" rx="1.8"' + F + '/><rect x="13.6" y="4" width="6.4" height="6.4" rx="1.8"' + F + '/><rect x="4" y="13.6" width="6.4" height="6.4" rx="1.8"' + F + '/><rect x="13.6" y="13.6" width="6.4" height="6.4" rx="1.8"' + F + '/>',
        user: '<circle cx="12" cy="8.4" r="3.6"' + F + '/><path d="M4.8 20c.6-3.8 3.4-5.8 7.2-5.8s6.6 2 7.2 5.8"' + F + '/>',
        arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
        chev: '<path d="M14.5 6.5 9 12l5.5 5.5"/>',
        pin: '<path d="M12 21s-6.4-5.7-6.4-11a6.4 6.4 0 0 1 12.8 0c0 5.3-6.4 11-6.4 11z"' + F + '/><circle cx="12" cy="10" r="2.3"/>',
        palette: '<path d="M12 3.4a8.6 8.6 0 1 0 0 17.2c1.3 0 2-.8 2-1.7 0-1.4-1.3-1.6-1.3-2.8 0-1 .8-1.7 1.9-1.7h2a3.6 3.6 0 0 0 3.6-3.6c0-4-3.8-7.4-8.2-7.4z"' + F + '/><circle cx="7.8" cy="11" r="1" fill="currentColor"/><circle cx="10.4" cy="7.6" r="1" fill="currentColor"/><circle cx="14.6" cy="7.8" r="1" fill="currentColor"/>',
        storage: '<ellipse cx="12" cy="6" rx="7.6" ry="2.8"' + F + '/><path d="M4.4 6v6c0 1.5 3.4 2.8 7.6 2.8s7.6-1.3 7.6-2.8V6M4.4 12v6c0 1.5 3.4 2.8 7.6 2.8s7.6-1.3 7.6-2.8v-6"/>',
        info: '<circle cx="12" cy="12" r="8.8"' + F + '/><path d="M12 11v5.4"/><circle cx="12" cy="7.9" r=".9" fill="currentColor"/>',
        go: '<path d="M14.5 6.5 9 12l5.5 5.5"/>',
        /* أوقات الصلاة */
        fajr: '<path d="M3.6 16.8h16.8"/><path d="M7.2 16.8a4.8 4.8 0 0 1 9.6 0"' + F + '/><path d="M12 4.4v-.2M12 7.2v2M6.4 8.4l1.2 1.4M17.6 8.4l-1.2 1.4"/><path d="m9.8 4.6 2.2-2 2.2 2"/>',
        sunrise: '<path d="M3.6 17.2h16.8"/><path d="M7.2 17.2a4.8 4.8 0 0 1 9.6 0"' + F + '/><path d="M12 6.2v2.4M5.7 9.2l1.6 1.5M18.3 9.2l-1.6 1.5"/><path d="m9.8 4.4 2.2-2 2.2 2"/>',
        dhuhr: '<circle cx="12" cy="12" r="4.4"' + F + '/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
        asr: '<circle cx="12" cy="13.2" r="4"' + F + '/><path d="M12 4.6v2.2M4.6 8.2l1.6 1.4M19.4 8.2l-1.6 1.4M3.4 13.2h2M18.6 13.2h2M7.2 20.6h9.6"/>',
        maghrib: '<path d="M3.6 16.8h16.8"/><path d="M7.4 16.8a4.6 4.6 0 0 1 9.2 0"' + F + '/><path d="m9.8 8.8 2.2 2 2.2-2M6.2 11.2l1.4 1.2M17.8 11.2l-1.4 1.2M8 20.2h8"/>',
        isha: '<path d="M18.8 14.6a7.6 7.6 0 1 1-9.4-9.4 6 6 0 0 0 9.4 9.4z"' + F + '/><path d="M17.4 4.2v2.4M16.2 5.4h2.4"/>'
    };
    function ic(n, c) { return '<svg class="nv ' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (IC[n] || IC.info) + '</svg>'; }
    window.v123Icon = ic;

    /* ---------- أيقونات ملوّنة لأوقات الصلاة (على البطاقة الفاتحة) ---------- */
    var PC = { fajr: '#70d8bb', sunrise: '#f0a030', dhuhr: '#f08c1e', asr: '#f29a2e', maghrib: '#ec7a3a', isha: '#62cfb0' };

    /* ---------- بيانات ---------- */
    var KEYS = [
        ['mushaf107', 'quran'], ['prayer', 'prayer'], ['qibla', 'qibla'], ['mosques', 'mosques'], ['quranTest', 'qtest'], ['adhkar', 'adhkar'],
        ['readers', 'readers'], ['khatmah', 'khatmah'], ['ruqyah', 'ruqyah'], ['hadith107', 'hadith'], ['children', 'children'], ['repeatAyah', 'repeat'],
        ['modes', 'modes'], ['manasik', 'manasik'], ['daily', 'daily']
    ];
    var FEAT = { quran: 1, prayer: 1, qibla: 1, mosques: 1, qtest: 1, adhkar: 1 };
    /* صور الأقسام الستة (مقصوصة من التصميم) + نصوص الشاشة العريضة (d) والضيقة (m) */
    var TL = {
        quran: ['book', 'القرآن الكريم', 'تلاوة وتدبر بلا حدود', 'بأصوات متعددة'],
        prayer: ['clock', 'مواقيت الصلاة', 'في وقتها دائماً', 'بدقة عالية'],
        qibla: ['qibla', 'القبلة', 'اتجه نحو القبلة بدقة', 'في أي مكان'],
        mosques: ['mosque', 'المساجد', 'ابحث عن أقرب مسجد', 'أقرب إليك'],
        qtest: ['quiz', 'اختبارك', 'اختبر معلوماتك في القرآن', ''],
        adhkar: ['dua', 'الأذكار والأدعية', 'أذكار وأدعية كثيرة', 'في حياتك']
    };
    var VERSES = [
        ['إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', 'سورة البقرة - الآية 153'],
        ['أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', 'سورة الرعد - الآية 28'],
        ['فَاذْكُرُونِي أَذْكُرْكُمْ', 'سورة البقرة - الآية 152'],
        ['إِنَّ مَعَ الْعُسْرِ يُسْرًا', 'سورة الشرح - الآية 6'],
        ['وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', 'سورة الطلاق - الآية 3'],
        ['وَقُل رَّبِّ زِدْنِي عِلْمًا', 'سورة طه - الآية 114'],
        ['وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', 'سورة النحل - الآية 127']
    ];
    var SLIDES = [
        ['مرحباً بك في', 'المسلم', 'موقع المسلم', 'رفيقك في رحلتك الإيمانية والمعرفية', 'اكتشف المزيد', null],
        ['القرآن الكريم', 'بين يديك', 'بين يديك', 'مصحف المدينة بالتشكيل الكامل، ويُقرأ دون إنترنت بعد التنزيل', 'افتح المصحف', 'mushaf107'],
        ['مواقيت الصلاة', 'بدقة', 'بدقة', 'بحسب موقعك مع تنبيه الأذان والإقامة', 'المواقيت', 'prayer'],
        ['أذكار', 'وأدعية', 'وأدعية', 'أذكار الصباح والمساء وغيرها بأصوات بشرية', 'الأذكار', 'adhkar']
    ];
    var PR = [['fajr', 'الفجر'], ['sunrise', 'الشروق'], ['dhuhr', 'الظهر'], ['asr', 'العصر'], ['maghrib', 'المغرب'], ['isha', 'العشاء']];
    var ID = { qtTile: 'qtest', v103Tile: 'assistant', travelTile: 'travel', v107TilePr: 'prayer' };

    function keyOf(t) {
        var o = t.getAttribute('onclick') || '', m; if (/QuranTest/.test(o)) return 'qtest'; m = o.match(/show\('([A-Za-z0-9]+)'\)/); if (!m) return null;
        for (var i = 0; i < KEYS.length; i++) if (KEYS[i][0] === m[1]) return KEYS[i][1];
        return null;
    }
    /* أيقونات الأقسام: رسوم SVG أصلية بتدرّج ذهبي (بلا صور ولا خلفيات) */
    var PIC = {
        book: '<path d="M32 17c-6-4-15-5-23-3v32c8-2 17-1 23 3 6-4 15-5 23-3V14c-8-2-17-1-23 3z" fill="url(#G)" stroke="#fff3c9" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 17v32" stroke="#8a5d17" stroke-width="1.8"/><path d="M14 22c4-.8 9-.4 13 1.2M14 30c4-.8 9-.4 13 1.2M14 38c4-.8 9-.4 13 1.2M50 22c-4-.8-9-.4-13 1.2M50 30c-4-.8-9-.4-13 1.2M50 38c-4-.8-9-.4-13 1.2" stroke="#8a5d17" stroke-width="1.5" stroke-linecap="round" opacity=".7"/><path d="M32 6l1.6 3.6 3.9.4-2.9 2.6.8 3.8-3.4-2-3.4 2 .8-3.8-2.9-2.6 3.9-.4z" fill="#fff3c9"/>',
        clock: '<circle cx="32" cy="33" r="23" fill="url(#G)" stroke="#fff3c9" stroke-width="2"/><circle cx="32" cy="33" r="18" fill="#0f4a3a" opacity=".92"/><path d="M32 19v4M32 43v4M18 33h4M42 33h4" stroke="#f6d78a" stroke-width="2.2" stroke-linecap="round"/><path d="M32 33V23M32 33l8 4.6" stroke="#fff3c9" stroke-width="2.6" stroke-linecap="round"/><circle cx="32" cy="33" r="2.4" fill="#f0c25a"/><path d="M45 9a7 7 0 1 0 8 8 5.5 5.5 0 0 1-8-8z" fill="#fff3c9"/>',
        qibla: '<circle cx="32" cy="32" r="25" fill="#0f4a3a" stroke="url(#G)" stroke-width="3.2"/><circle cx="32" cy="32" r="20" fill="none" stroke="#f6d78a" stroke-width="1" stroke-dasharray="1.5 3.2"/><path d="M32 9l5 23-5 23-5-23z" fill="url(#G)" transform="rotate(35 32 32)"/><path d="M32 9l5 23H27z" fill="#fff3c9" transform="rotate(35 32 32)"/><circle cx="32" cy="32" r="3.2" fill="#0f4a3a" stroke="#fff3c9" stroke-width="1.4"/><path d="M32 4v5M32 55v5M4 32h5M55 32h5" stroke="#fff3c9" stroke-width="2" stroke-linecap="round"/>',
        mosque: '<path d="M32 8c-9 5-13 11-13 18h26c0-7-4-13-13-18z" fill="url(#G)" stroke="#fff3c9" stroke-width="1.4" stroke-linejoin="round"/><path d="M32 3v6" stroke="#fff3c9" stroke-width="2" stroke-linecap="round"/><path d="M15 56V26l3-6 3 6v30zM43 56V26l3-6 3 6v30z" fill="url(#G)" stroke="#fff3c9" stroke-width="1.3" stroke-linejoin="round"/><rect x="21" y="26" width="22" height="30" fill="url(#G)" stroke="#fff3c9" stroke-width="1.3"/><path d="M28 56V43a4 4 0 0 1 8 0v13z" fill="#0f4a3a"/><circle cx="18" cy="35" r="1.6" fill="#0f4a3a"/><circle cx="46" cy="35" r="1.6" fill="#0f4a3a"/><path d="M8 56h48" stroke="#fff3c9" stroke-width="2.2" stroke-linecap="round"/>',
        quiz: '<rect x="12" y="9" width="40" height="48" rx="6" fill="url(#G)" stroke="#fff3c9" stroke-width="1.8"/><rect x="24" y="5" width="16" height="9" rx="3" fill="#0f4a3a" stroke="#fff3c9" stroke-width="1.6"/><path d="M19 25l3 3 5-6M19 38l3 3 5-6" stroke="#0f4a3a" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 26h14M32 39h14" stroke="#0f4a3a" stroke-width="2.6" stroke-linecap="round"/><path d="M19 50h26" stroke="#8a5d17" stroke-width="2" stroke-linecap="round" opacity=".6"/>',
        dua: '<path d="M32 10c1.4 7 4 10 10 12-6 2-8.6 5-10 12-1.4-7-4-10-10-12 6-2 8.6-5 10-12z" fill="url(#G)" stroke="#fff3c9" stroke-width="1.2" stroke-linejoin="round"/><path d="M8 40c3-2 7-1.4 10 1.6l8 8c1.4 1.4 3.4 2 6 2s4.6-.6 6-2l8-8c3-3 7-3.6 10-1.6-1 8-8 17-24 17S9 48 8 40z" fill="url(#G)" stroke="#fff3c9" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 52c-4 0-6-1-8-3M32 52c4 0 6-1 8-3" stroke="#8a5d17" stroke-width="1.6" stroke-linecap="round" fill="none" opacity=".7"/>'
    };
    function img(n) {
        var id = 'nvG' + n;
        return '<svg class="nvPic" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff4c8"/><stop offset=".55" stop-color="#f0c25a"/><stop offset="1" stop-color="#c8902f"/></linearGradient></defs>' + (PIC[n] || '').replace(/url\(#G\)/g, 'url(#' + id + ')') + '</svg>';
    }

    /* ---------- الأقسام ---------- */
    function tag() {
        var menu = document.querySelector('#home .menu'); if (!menu) return;
        [].forEach.call(menu.querySelectorAll(':scope > .tile'), function (t) {
            var k = keyOf(t) || ID[t.id] || 'info';
            if (t.dataset.nv === k && t.querySelector('.nvGo')) return;
            t.dataset.nv = k; t.classList.toggle('nf', !!FEAT[k]);
            var ico = t.querySelector('.ico'), tl = TL[k];
            if (ico) { ico.className = 'ico nvIco'; ico.innerHTML = tl ? img(tl[0]) : ic(k); }
            if (tl) {
                var b = t.querySelector('b'), s = t.querySelector('small');
                if (b) b.innerHTML = tl[1] + (k === 'qtest' ? '' : '');
                if (k === 'qtest' && b) b.innerHTML = '<span class="d">اختبارك</span><span class="m">اختبارات ومراجعات</span>';
                if (s) s.innerHTML = '<span class="d">' + tl[2] + '</span><span class="m">' + tl[3] + '</span>';
            }
            var go = t.querySelector('.nvGo'); if (!go) { go = document.createElement('span'); go.className = 'nvGo'; t.appendChild(go); } go.innerHTML = ic('arrow');
        });
    }
    function prayerCard() {
        var c = document.createElement('div'); c.className = 'nvCard nvPray'; c.id = 'nvPray';
        c.innerHTML = '<div class="nvCh"><h3>أوقات الصلاة اليوم</h3><span class="nvLoc" id="nvLoc"></span></div><div id="nvNextBox"></div><div class="nvTimes" id="nvTimes"></div><button type="button" class="nvMore" onclick="show(\'prayer\')">' + ic('arrow') + '<span>المزيد</span></button>';
        return c;
    }
    /* الآية تتبدّل كل ساعة (بحسب ساعة الجهاز) وتبقى ثابتة طوال الساعة */
    function verseIdx() { return Math.floor(Date.now() / 36e5) % VERSES.length; }
    var vShown = -1;
    function verseTick() {
        var i = verseIdx(); if (i === vShown) return; vShown = i;
        var box = document.querySelector('.nvVerse .nvV'), sm = document.querySelector('.nvVerse .nvVb small'); if (!box || !sm) return;
        box.innerHTML = '<i>﴿</i> ' + VERSES[i][0] + ' <i>﴾</i>'; sm.textContent = VERSES[i][1];
    }
    function verseCard() {
        var v = VERSES[verseIdx()];
        var c = document.createElement('div'); c.className = 'nvCard nvVerse';
        c.innerHTML = '<div class="nvQp" aria-hidden="true"></div><div class="nvVb"><div class="nvVh">' + ic('quran') + '<span>آيات من نور</span></div><div class="nvBs">بسم الله الرحمن الرحيم</div><div class="nvV"><i>﴿</i> ' + v[0] + ' <i>﴾</i></div><small>' + v[1] + '</small></div><button type="button" class="nvMore dk" onclick="show(\'mushaf107\')"><span>قراءة الآية</span>' + ic('go') + '</button>';
        return c;
    }
    function times() {
        var box = $('nvTimes'), P = window.v107Prayer; if (!box) return;
        var l = P && P.getLoc && P.getLoc(), nm = $('nvLoc');
        if (!l) { box.innerHTML = '<button type="button" class="nvSet" onclick="show(\'prayer\')">حدّد موقعك لعرض المواقيت</button>'; if (nm) nm.textContent = ''; return; }
        var now = new Date(), t = P.timesFor(now, l), cur = null;
        PR.forEach(function (x) { if (t[x[0]] && t[x[0]] <= now) cur = x[0]; });
        if (nm) nm.innerHTML = ic('pin', 'nvPin') + '<span>' + (l.name || l.city || l.label || '') + '</span>';
        box.innerHTML = PR.map(function (x) { return '<div class="' + (x[0] === cur ? 'cur' : '') + '"><span class="pi" style="color:' + PC[x[0]] + '">' + ic(x[0]) + '</span><small>' + x[1] + '</small><b>' + (t[x[0]] ? P.fmt(t[x[0]]) : '--:--') + '</b></div>'; }).join('');
    }
    function homeBuild() {
        var home = $('home'), menu = home && home.querySelector('.menu'); if (!home || !menu || $('nvHero')) return false;
        var hero = home.querySelector('.hero');
        var sec = document.createElement('section'); sec.id = 'nvHero'; sec.className = 'nvHero';
        sec.innerHTML = '<picture><source media="(min-width:560px)" srcset="nv-hero-l.webp"><img class="nvPh" id="nvPh" src="nv-hero-p.webp" alt="" draggable="false"></picture>' +
            '<svg class="nvCres" viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="nvCg"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="nvCm"><rect width="100" height="100" fill="#fff"/><circle cx="62" cy="40" r="30" fill="#000"/></mask></defs><circle cx="50" cy="50" r="48" fill="url(#nvCg)"/><circle cx="44" cy="52" r="30" fill="#fff8e4" mask="url(#nvCm)"/></svg>' +
            '<div class="nvHt"><div id="nvSl"></div><div class="nvDots" id="nvDots"></div></div>';
        if (hero) hero.parentNode.replaceChild(sec, hero); else home.insertBefore(sec, home.firstChild);
        var old = $('v107Home'), next = $('v107Next');
        menu.classList.add('nvMenu');
        var row = document.createElement('div'); row.className = 'nvRow'; row.appendChild(verseCard()); row.appendChild(prayerCard());
        if (old) old.style.display = 'none';
        var hd = document.createElement('div'); hd.className = 'nvHd'; hd.id = 'nvAll'; hd.innerHTML = '<span>كل الأقسام</span>';
        menu.appendChild(row); menu.appendChild(hd); if (next) $('nvNextBox').appendChild(next); tag();
        new MutationObserver(function () { tag(); }).observe(menu, { childList: true });
        slides(); times(); setInterval(times, 30000); verseTick(); setInterval(verseTick, 30000);
        fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(sec); else addEventListener('resize', fit);
        return true;
    }
    function fit() {
        var h = $('nvHero'), p = $('nvPh'); if (!h || !p) return;
        var w = h.clientWidth, ht = h.clientHeight; if (!w || !ht) return;
        var wide = w >= 560, ar = wide ? 2.26 : 0.968, ph = wide ? Math.min(ht * 0.9, w * 0.94 / ar) : Math.min(ht * 0.8, w * 1.02 / ar);
        h.style.setProperty('--ph', Math.round(ph) + 'px');
    }
    var si = 0, st = null;
    function slide(i, user) {
        si = (i + SLIDES.length) % SLIDES.length; var s = SLIDES[si], box = $('nvSl'); if (!box) return;
        box.classList.remove('in'); void box.offsetWidth;
        box.innerHTML = '<h1><span class="a">' + s[0] + '</span> <em class="m">' + s[1] + '</em><em class="d">' + s[2] + '</em></h1><p>' + s[3] + '</p><i class="nvDia"></i><button type="button" class="nvCta" id="nvCta"><span>' + s[4] + '</span><i>▶</i></button>';
        box.classList.add('in');
        $('nvCta').onclick = function () { if (s[5]) show(s[5]); else { var f = document.querySelector('#home .tile.nf'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };
        [].forEach.call($('nvDots').children, function (d, k) { d.classList.toggle('on', k === si); });
        if (user) { clearInterval(st); st = setInterval(function () { slide(si + 1); }, 8000); }
    }
    function slides() {
        var dots = $('nvDots'); dots.innerHTML = SLIDES.map(function (_, k) { return '<button type="button" aria-label="الشريحة ' + (k + 1) + '"></button>'; }).join('');
        dots.onclick = function (e) { var b = e.target.closest('button'); if (b) slide([].indexOf.call(dots.children, b), true); };
        slide(0);
        if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) st = setInterval(function () { if (!document.hidden && $('home').classList.contains('active')) slide(si + 1); }, 8000);
    }

    /* ---------- الإشعارات: آخر ما صدر (سجل فعلي + مواقيت اليوم) ---------- */
    var LK = 'nv-notif-log', SK = 'nv-notif-seen';
    function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
    function logGet() { try { return JSON.parse(ls(LK) || '[]') || []; } catch (e) { return []; } }
    function clean(s) { return String(s || '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim(); }
    function logAdd(e) {
        if (!e || e.kind === 'test') return;
        var a = logGet(); a.unshift({ t: Date.now(), k: e.kind || '', ti: clean(e.title), b: clean(e.body) });
        lsSet(LK, JSON.stringify(a.slice(0, 40)));
        badge();
    }
    function hookN() { var MN = window.MuslimNotify; if (MN && MN.on && !hookN.d) { hookN.d = 1; MN.on('fired', logAdd); } }
    function derived() {
        var P = window.v107Prayer, out = [], l = P && P.getLoc && P.getLoc(); if (!l) return out;
        var now = new Date();
        [new Date(now - 864e5), now].forEach(function (d) {
            var t; try { t = P.timesFor(d, l); } catch (e) { return; }
            [['fajr', 'الفجر'], ['dhuhr', 'الظهر'], ['asr', 'العصر'], ['maghrib', 'المغرب'], ['isha', 'العشاء']].forEach(function (x) {
                if (t[x[0]] && t[x[0]] <= now) out.push({ t: +t[x[0]], k: 'prayer', ti: 'صلاة ' + x[1], b: 'حان الآن موعد صلاة ' + x[1] + ' - ' + P.fmt(t[x[0]]) });
            });
            if (t.sunrise && t.sunrise <= now) out.push({ t: +t.sunrise, k: 'adhkar', ti: 'أذكار الصباح', b: 'وقت أذكار الصباح، ابدأ يومك بذكر الله' });
            if (t.asr && +t.asr + 6e4 <= +now) out.push({ t: +t.asr + 6e4, k: 'adhkar', ti: 'أذكار المساء', b: 'وقت أذكار المساء بعد العصر' });
        });
        return out;
    }
    function feed() {
        var all = logGet(), now = Date.now(), min = now - 36 * 36e5;
        derived().forEach(function (d) { if (!all.some(function (x) { return x.ti === d.ti && Math.abs(x.t - d.t) < 40 * 6e4; })) all.push(d); });
        return all.filter(function (x) { return x.t >= min && x.t <= now + 6e4 && x.ti; }).sort(function (a, b) { return b.t - a.t; }).slice(0, 10);
    }
    function when(t) {
        var d = new Date(t), P = window.v107Prayer, tm = P && P.fmt ? P.fmt(d) : d.toTimeString().slice(0, 5), n = new Date();
        return (d.toDateString() === n.toDateString() ? '' : 'أمس ') + tm;
    }
    function badge() {
        var seen = +ls(SK) || 0, n = feed().filter(function (x) { return x.t > seen; }).length;
        [].forEach.call(document.querySelectorAll('.nvBadge'), function (b) { b.textContent = n > 9 ? '9+' : n; b.hidden = !n; });
    }
    function closeAll() { [].forEach.call(document.querySelectorAll('#nvNotif.open,#nvMore.open,#nvBack.open'), function (e) { e.classList.remove('open'); }); }
    function openNotif() {
        var box = $('nvNotif'); if (!box) return;
        if (box.classList.contains('open')) { closeAll(); return; }
        closeAll(); hookN();
        var f = feed();
        $('nvNList').innerHTML = f.length ? f.map(function (x) {
            return '<div class="nvNi"><span class="ni ' + (x.k === 'adhkar' ? 'ad' : '') + '">' + ic(x.k === 'adhkar' ? 'adhkar' : 'mosques') + '</span><div><b>' + x.ti + '</b><small>' + x.b + '</small></div><time>' + when(x.t) + '</time></div>';
        }).join('') : '<div class="nvNe">لا توجد إشعارات بعد.<br>حدّد موقعك من «مواقيت الصلاة» لتظهر آخر الإشعارات هنا.</div>';
        box.classList.add('open'); $('nvBack').classList.add('open');
        lsSet(SK, String(Date.now())); badge();
    }
    function openMore() {
        var box = $('nvMore'); if (!box) return;
        if (box.classList.contains('open')) { closeAll(); return; }
        closeAll();
        var g = $('nvMGrid'); g.innerHTML = '';
        [].forEach.call(document.querySelectorAll('#home .menu > .tile'), function (t) {
            var k = t.dataset.nv || 'info', b = t.querySelector('b'), a = document.createElement('button');
            a.type = 'button'; a.innerHTML = '<span>' + ic(k === 'info' ? 'info' : k) + '</span><b>' + (b ? b.textContent.replace(/اختبارك|اختبارات ومراجعات/, 'اختبار القرآن') : '') + '</b>';
            a.onclick = function () { closeAll(); t.click(); }; g.appendChild(a);
        });
        box.classList.add('open'); $('nvBack').classList.add('open');
    }
    function overlays() {
        if ($('nvNotif')) return;
        var d = document.createElement('div'); d.id = 'nvBack'; d.onclick = closeAll; document.body.appendChild(d);
        var n = document.createElement('div'); n.id = 'nvNotif'; n.setAttribute('role', 'dialog'); n.setAttribute('aria-label', 'الإشعارات');
        n.innerHTML = '<div class="nvNh"><b>آخر الإشعارات</b><button type="button" id="nvNset">إعدادات التنبيهات</button></div><div id="nvNList"></div>';
        document.body.appendChild(n);
        $('nvNset').onclick = function () { closeAll(); window.v123Settings('alerts'); };
        var m = document.createElement('div'); m.id = 'nvMore'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', 'كل الأقسام');
        m.innerHTML = '<div class="nvMh"><i></i><b>كل الأقسام</b></div><div id="nvMGrid"></div>';
        document.body.appendChild(m);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
    }


    /* ---------- الإعدادات: بطاقات تفتح صفحات داخلية ---------- */
    var SI = { appearance: 'palette', prayer: 'prayer', alerts: 'bell', mushaf: 'quran', hadith: 'hadith', reader: 'readers', adhkar: 'dua', modes: 'ruqyah', repeat: 'repeat', calendar: 'manasik', daily: 'daily', place: 'travel', nav: 'search', storage: 'storage', about: 'info', aboutus: 'mosques', sources: 'hadith' };
    function setTitle(d) { var s = d.querySelector('summary'), t = ''; [].forEach.call(s.childNodes, function (n) { if (n.nodeType === 3) t += n.textContent; }); return t.trim(); }
    function closeSet() { var s = $('settings'); if (!s) return; delete s.dataset.sub; [].forEach.call(s.querySelectorAll('details.stgCat'), function (d) { d.removeAttribute('data-act'); }); }
    function openSet(id) {
        var s = $('settings'), d = $('stgcat-' + id); if (!s || !d) return;
        closeSet(); s.dataset.sub = id; d.setAttribute('data-act', '1'); d.open = true;
        var t = $('nvSetT'); if (t) t.textContent = setTitle(d);
        window.scrollTo(0, 0);
    }
    function settingsBuild() {
        var s = $('settings'); if (!s || s.dataset.nv) return; s.dataset.nv = 1;
        var cats = [].slice.call(s.querySelectorAll('details.stgCat')); if (!cats.length) return;
        var bar = document.createElement('div'); bar.className = 'nvSetBar';
        bar.innerHTML = '<button type="button" class="back" aria-label="رجوع">' + ic('arrow') + '</button><h2 id="nvSetT"></h2>';
        bar.firstChild.onclick = closeSet;
        var grid = document.createElement('div'); grid.className = 'nvSetGrid';
        cats.forEach(function (d) {
            var id = d.id.replace('stgcat-', ''), b = document.createElement('button');
            b.type = 'button'; b.innerHTML = '<span class="si">' + ic(SI[id] || 'info') + '</span><b>' + setTitle(d) + '</b><span class="sg">' + ic('go') + '</span>';
            b.onclick = function () { openSet(id); }; grid.appendChild(b); d.open = false;
        });
        cats[0].parentNode.insertBefore(bar, cats[0]); cats[0].parentNode.insertBefore(grid, cats[0]);
    }
    window.v123Settings = function (id) { window.show('settings'); settingsBuild(); openSet(id); };

    /* ---------- الرأس والتنقل ---------- */
    function isDark() { return document.body.classList.contains('dark'); }
    function logo() { return '<img class="nvLogo" src="ic-192.png" alt="" width="40" height="40" draggable="false">'; }
    function header() {
        var top = document.querySelector('header.top'); if (!top || top.dataset.nv) return; top.dataset.nv = 1;
        top.innerHTML =
            '<div class="nvBrand" onclick="show(\'home\')" role="button" tabindex="0">' + logo() + '<b>المسلم</b></div>' +
            '<button type="button" class="nvSearch" id="nvSearch">' + ic('search') + '<span>ابحث في موقع المسلم ...</span></button>' +
            '<div class="nvTools"><button type="button" class="nvBack" aria-label="الرئيسية" onclick="show(\'home\')">' + ic('chev') + '</button><div class="nvPill"><button type="button" class="nvBell" id="nvBell" aria-label="الإشعارات">' + ic('bell') + '<em class="nvBadge" hidden></em></button><button type="button" class="nvGear" aria-label="الإعدادات" onclick="show(\'settings\')">' + ic('settings') + '</button><button type="button" id="nvDark" class="nvMoon" aria-label="الوضع الليلي/النهاري"></button></div></div>';
        $('nvSearch').onclick = function () { show('assistant'); setTimeout(function () { var i = document.querySelector('#assistant input'); if (i) i.focus(); }, 250); };
        $('nvBell').onclick = openNotif;
        $('nvDark').onclick = function () { toggleDark(); paintDark(); };
        paintDark();
    }
    function paintDark() { var b = $('nvDark'); if (b) b.innerHTML = ic(isDark() ? 'moon' : 'sun'); }
    var NAV = [
        ['home', 'الرئيسية', 'home', "show('home')", 'home', ''],
        ['quran', 'القرآن الكريم', 'quran', "show('mushaf107')", 'mushaf107,quran,readers,khatmah,repeatAyah', 'dx'],
        ['prayer', 'مواقيت الصلاة', 'prayer', "show('prayer')", 'prayer', 'c'],
        ['qibla', 'القبلة', 'travel', "show('qibla')", 'qibla', 'dx mq'],
        ['mosques', 'المساجد', 'mosques', "show('mosques');initNearbyMosques()", 'mosques', 'dx'],
        ['manasik', 'التقويم الهجري', 'manasik', "show('manasik');initManasik()", 'manasik', 'dx'],
        ['adhkar', 'أذكار و أدعية', 'dua', "show('adhkar');initAdhkarV27()", 'adhkar,ruqyah,modes,daily', 'dx'],
        ['qtest', 'اختبارك', 'qtest', "v122QuranTest&&v122QuranTest.open()", 'quranTest', 'dx'],
        ['settings', 'الإعدادات', 'settings', "show('settings')", 'settings', 's'],
        ['more', 'المزيد', 'more', "window.v123More()", 'more', 'mo']
    ];
    window.v123More = openMore; window.v123Notif = openNotif;
    function nav() {
        var n = document.querySelector('nav.nav'); if (!n || n.dataset.nv) return; n.dataset.nv = 1;
        n.innerHTML = '<div class="nvSbBrand" onclick="show(\'home\')">' + logo() + '<b>المسلم</b></div>' +
            NAV.map(function (x) {
                var f = ' ' + x[5] + ' ';
                return '<button type="button" data-ids="' + x[4] + '" data-n="' + x[0] + '" class="' + (f.indexOf(' c ') > -1 ? 'nvC ' : '') + (f.indexOf(' dx ') > -1 ? 'nvDx ' : '') + (f.indexOf(' s ') > -1 ? 'nvS ' : '') + (f.indexOf(' mo ') > -1 ? 'nvMo ' : '') + (f.indexOf(' mq ') > -1 ? 'nvMq ' : '') + '" onclick="' + x[3] + '"><span class="nvIc">' + ic(x[2]) + (x[0] === 'prayer' ? img('mosque').replace('class="nvPic"', 'class="nvCi"') : '') + (x[0] === 'notif' ? '<em class="nvBadge" hidden></em>' : '') + '</span><b>' + x[1] + '</b></button>';
            }).join('') +
            '<div class="nvSbArt" aria-hidden="true"></div>';
        sync('home');
    }
    function sync(id) {
        var n = document.querySelector('nav.nav'); if (!n) return;
        [].forEach.call(n.querySelectorAll('button'), function (b) { b.classList.toggle('on', (',' + b.dataset.ids + ',').indexOf(',' + id + ',') > -1); });
        document.body.dataset.pg = id; closeAll();
    }
    function wrapShow() {
        var s = window.show; if (typeof s !== 'function' || s.__nv) return;
        var w = function (id) { var r = s.apply(this, arguments); try { sync(id); if (id === 'settings') { settingsBuild(); if (!w.keep) closeSet(); } } catch (e) { } return r; }; w.__nv = 1; window.show = w;
    }

    function init() {
        document.body.classList.add('nova');
        if (ls('quran-m09-dark') === null) document.body.classList.toggle('dark', innerWidth < 1024);
        header(); nav(); overlays(); wrapShow(); homeBuild(); paintDark(); hookN(); badge(); setInterval(badge, 60000);
    }
    var n = 0, iv = setInterval(function () {
        if (document.body && document.querySelector('#home .menu') && window.show && document.querySelector('header.top') && document.querySelector('nav.nav') && $('v107Home')) { clearInterval(iv); setTimeout(init, 60); }
        else if (++n > 60) { clearInterval(iv); init(); }
    }, 150);
})();
