/* cards.js — بطاقات المشاركة (آية/حديث/ذكر/مناسبة) + آية الساعة بعِبَرها + حديث اليوم + ذكر/دعاء اليوم */
(function () {
    'use strict';
    var SHARE_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2"/></svg>';
    var $ = function (id) { return document.getElementById(id); };
    var LSG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    var SN = { 2: 'البقرة', 3: 'آل عمران', 5: 'المائدة', 8: 'الأنفال', 11: 'هود', 12: 'يوسف', 13: 'الرعد', 14: 'إبراهيم', 16: 'النحل', 17: 'الإسراء', 28: 'القصص', 29: 'العنكبوت', 31: 'لقمان', 33: 'الأحزاب', 39: 'الزمر', 40: 'غافر', 41: 'فصّلت', 49: 'الحجرات', 65: 'الطلاق', 94: 'الشرح', 99: 'الزلزلة', 103: 'العصر' };
    /* آيات فيها عبرة: [سورة, آية, العبرة] — يُجلب نصها العثماني من alquran.cloud مرة واحدة ويُحفظ على الجهاز */
    var L = [
        [2, 286, 'الله لا يكلّفك فوق طاقتك'], [65, 3, 'التوكّل على الله كفاية'], [39, 53, 'لا يأس مع رحمة الله'], [13, 11, 'التغيير يبدأ من النفس'],
        [2, 216, 'قد يكون المكروه خيرًا لك'], [3, 139, 'لا تضعف ولا تحزن'], [31, 18, 'التواضع وترك الكِبر'], [49, 11, 'احترام الناس وترك السخرية'],
        [49, 12, 'اجتنب سوء الظن والغيبة'], [49, 13, 'التقوى هي ميزان التفاضل'], [2, 45, 'الصبر والصلاة عون المؤمن'], [11, 115, 'الله لا يضيع أجر المحسنين'],
        [16, 90, 'العدل والإحسان أساس الأخلاق'], [41, 34, 'ادفع السيئة بالحسنى'], [3, 159, 'اللين والرحمة في التعامل'], [17, 36, 'لا تقل ما لا تعلم'],
        [99, 7, 'الخير مهما صغر محسوب'], [103, 2, 'الإنسان في خسارة إلا بالإيمان والعمل والحق والصبر'], [29, 2, 'الابتلاء سنّة الله ليظهر الصادق'], [8, 46, 'الصبر يجلب معية الله'],
        [12, 87, 'لا تيأس من فرج الله'], [14, 7, 'الشكر سبب الزيادة'], [33, 70, 'قل قولًا سديدًا'], [5, 2, 'التعاون على الخير فقط'],
        [28, 77, 'اطلب الآخرة ولا تنسَ نصيبك من الدنيا'], [40, 60, 'ادعُ الله يستجب لك'], [2, 186, 'الله قريب يجيب الدعاء'], [94, 6, 'مع الشدة فرج'],
        [13, 28, 'الذكر طمأنينة القلب'], [2, 152, 'اذكر الله يذكرك']
    ];
    var FRI = { key: 'fri', text: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا', ref: 'سورة الأحزاب - الآية 56', lesson: 'أكثِروا من الصلاة على النبي ﷺ يوم الجمعة' };
    var inflight = {};
    function cached(i) { var c = LSG('muslim-vc-' + L[i][0] + '-' + L[i][1]); return c || ''; }
    function fetchV(i) {
        var k = L[i][0] + ':' + L[i][1]; if (inflight[k] || cached(i)) return; inflight[k] = 1;
        try {
            fetch('https://api.alquran.cloud/v1/ayah/' + k + '/quran-uthmani', { cache: 'force-cache' }).then(function (r) { return r.json(); }).then(function (j) {
                var t = j && j.data && j.data.text; if (t && t.length > 5) { LSS('muslim-vc-' + L[i][0] + '-' + L[i][1], t); document.dispatchEvent(new Event('muslim:verse')); }
            }).catch(function () { });
        } catch (e) { }
    }
    function now() {
        var d = new Date();
        if (d.getDay() === 5) return FRI;               /* يوم الجمعة: هذه الآية فقط */
        var i = Math.floor(Date.now() / 36e5) % L.length, t = cached(i);
        if (!t) { fetchV(i); return null; }              /* إلى أن يصل النص تبقى آيات الواجهة الأصلية */
        return { key: 'l' + i, text: t, ref: 'سورة ' + SN[L[i][0]] + ' - الآية ' + L[i][1], lesson: L[i][2] };
    }
    window.v107Verse = { now: now, list: L };

    /* ---------- الأحاديث والأذكار ---------- */
    var H = [
        ['إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى', 'متفق عليه', 'الإخلاص وتصحيح النية يجعلان العادة عبادة'],
        ['الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', 'متفق عليه', 'احفظ لسانك ويدك عن أذى الناس'],
        ['لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', 'متفق عليه', 'كمال الإيمان في محبة الخير للناس'],
        ['مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', 'متفق عليه', 'الصمت خير من كلمة لا نفع فيها'],
        ['الدِّينُ النَّصِيحَةُ', 'رواه مسلم', 'النصح الصادق من أصل الدين'],
        ['تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ', 'رواه الترمذي وصححه الألباني', 'أبسط الأعمال قد تكون صدقة'],
        ['أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ', 'متفق عليه', 'القليل الدائم خير من الكثير المنقطع'],
        ['لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ', 'متفق عليه', 'القوة الحقيقية في ضبط النفس'],
        ['الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ', 'متفق عليه', 'الكلمة الطيبة تُؤجر عليها'],
        ['مَنْ لَا يَرْحَمْ لَا يُرْحَمْ', 'متفق عليه', 'الرحمة بالخلق سبب لرحمة الله'],
        ['خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', 'رواه البخاري', 'شرف تعلّم القرآن وتعليمه'],
        ['اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ', 'رواه الترمذي وحسّنه الألباني', 'الحسنة تمحو السيئة وحسن الخلق جامع للخير'],
        ['مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ', 'رواه مسلم', 'طلب العلم طريق إلى الجنة'],
        ['الطُّهُورُ شَطْرُ الْإِيمَانِ', 'رواه مسلم', 'النظافة والطهارة من الإيمان'],
        ['مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ', 'رواه مسلم', 'الصدقة لا تنقص المال بل تباركه'],
        ['لَا تَغْضَبْ', 'رواه البخاري', 'وصية نبوية جامعة لمن طلب الوصية'],
        ['الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا', 'متفق عليه', 'المسلمون يتعاونون كالبنيان المتماسك'],
        ['مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ', 'رواه مسلم', 'الدلالة على الخير تُؤجر كفعله'],
        ['إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ', 'رواه مسلم', 'العبرة بالقلب والعمل لا بالمظهر'],
        ['عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ، إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ، وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ', 'رواه مسلم', 'شكر في الرخاء وصبر في الشدة'],
        ['كُلُّكُمْ رَاعٍ وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ', 'متفق عليه', 'كل إنسان مسؤول عمّن تحت يده'],
        ['مَنْ غَشَّنَا فَلَيْسَ مِنَّا', 'رواه مسلم', 'الأمانة والصدق في المعاملة'],
        ['إِيَّاكُمْ وَالظَّنَّ فَإِنَّ الظَّنَّ أَكْذَبُ الْحَدِيثِ', 'متفق عليه', 'سوء الظن يفسد القلوب'],
        ['مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ', 'رواه الترمذي وحسّنه الألباني', 'اشتغل بما ينفعك ودع ما لا يعنيك'],
        ['الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى', 'متفق عليه', 'العطاء أشرف من الأخذ'],
        ['مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ', 'متفق عليه', 'فضل المحافظة على الفجر والعصر'],
        ['اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ', 'متفق عليه', 'لا تحتقر القليل من الصدقة']
    ];
    var D = [
        ['سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان — متفق عليه'],
        ['لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', 'كنز من كنوز الجنة — متفق عليه'],
        ['أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', 'كان النبي ﷺ يستغفر في اليوم أكثر من سبعين مرة — رواه البخاري'],
        ['اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', 'رواه أبو داود والنسائي وصححه الألباني'],
        ['رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', 'سورة البقرة - الآية 201'],
        ['رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', 'سورة طه - الآيتان 25 و26'],
        ['اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', 'رواه أبو داود وابن ماجه وصححه الألباني'],
        ['يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', 'رواه الترمذي وصححه الألباني'],
        ['حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', 'سورة التوبة - الآية 129'],
        ['رَبِّ زِدْنِي عِلْمًا', 'سورة طه - الآية 114'],
        ['لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', 'دعاء يونس عليه السلام — سورة الأنبياء 87'],
        ['اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', 'من صلّى عليه ﷺ صلّى الله عليه بها عشرًا — رواه مسلم'],
        ['سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ', 'أحبّ الكلام إلى الله — رواه مسلم'],
        ['بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', 'ثلاثًا صباحًا ومساءً — رواه أبو داود والترمذي وصححه الألباني'],
        ['رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', 'سورة الأعراف - الآية 23'],
        ['رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا', 'سورة الفرقان - الآية 74'],
        ['رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', 'دعاء للوالدين — سورة الإسراء - الآية 24'],
        ['اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا', 'رواه مسلم'],
        ['يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', 'رواه الترمذي وحسّنه الألباني']
    ];
    var SAL = ['اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', 'من صلّى عليّ صلاة صلّى الله عليه بها عشرًا — رواه مسلم. وفي الجمعة: «أكثروا الصلاة عليّ يوم الجمعة» — رواه أبو داود وصححه الألباني'];
    function dayN() { var d = new Date(); return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5); }
    var BGS = ['brand', 'nv-hero-p', 'bg-18', 'bg-21', 'bg-34', 'bg-30', 'bg-19', 'bg-22', 'bg-28', 'bg-17'];

    /* ---------- رسم البطاقة (Canvas) وتحويلها لصورة ---------- */
    var W = 1080, Ht = 1350, cur = null, bgI = 0;
    function loadImg(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
    function wrap(ctx, text, maxW) {
        var words = String(text).split(/\s+/), lines = [], line = '';
        words.forEach(function (w) { var t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
        if (line) lines.push(line); return lines;
    }
    function drawBrand(o) {
        var cv = document.createElement('canvas'); cv.width = W; cv.height = Ht; var c = cv.getContext('2d');
        var FF = '"Amiri Quran","Amiri","Traditional Arabic","Noto Naskh Arabic",serif', G = '#e3b94f';
        return Promise.all([loadImg('qr.png'), loadImg('ic-192.png'), document.fonts && document.fonts.load ? document.fonts.load('40px "Amiri Quran"').catch(function () { }) : 0]).then(function (a) {
            var QR = a[0], LG = a[1];
            var g = c.createLinearGradient(0, 0, W, Ht); g.addColorStop(0, '#0e3f31'); g.addColorStop(1, '#082a20'); c.fillStyle = g; c.fillRect(0, 0, W, Ht);
            c.strokeStyle = 'rgba(255,255,255,.045)'; c.lineWidth = 2; var st = 90;
            for (var y = -st; y < Ht + st; y += st) for (var x = -st; x < W + st; x += st) { c.beginPath(); c.moveTo(x, y - st / 2); c.lineTo(x + st / 2, y); c.lineTo(x, y + st / 2); c.lineTo(x - st / 2, y); c.closePath(); c.stroke(); }
            c.strokeStyle = G; c.lineWidth = 4; c.strokeRect(44, 44, W - 88, Ht - 88); c.lineWidth = 1.6; c.strokeRect(66, 66, W - 132, Ht - 132);
            c.fillStyle = G; [[44, 44], [W - 44, 44], [44, Ht - 44], [W - 44, Ht - 44]].forEach(function (p) { c.beginPath(); c.moveTo(p[0], p[1] - 18); c.lineTo(p[0] + 18, p[1]); c.lineTo(p[0], p[1] + 18); c.lineTo(p[0] - 18, p[1]); c.closePath(); c.fill(); });
            c.direction = 'rtl'; c.textAlign = 'center'; c.textBaseline = 'middle';
            if (LG) { c.save(); c.beginPath(); c.arc(W / 2, 200, 62, 0, 7); c.clip(); c.drawImage(LG, W / 2 - 62, 138, 124, 124); c.restore(); c.strokeStyle = G; c.lineWidth = 4; c.beginPath(); c.arc(W / 2, 200, 63, 0, 7); c.stroke(); }
            c.fillStyle = G; c.font = '700 54px ' + FF; c.fillText('المسلم', W / 2, 322);
            if (o.kicker) { c.fillStyle = 'rgba(227,185,79,.85)'; c.font = '700 38px ' + FF; c.fillText(o.kicker, W / 2, 400); }
            var size = 70, lines, lh, maxH = 520;
            for (; size >= 30; size -= 4) { c.font = '700 ' + size + 'px ' + FF; lines = wrap(c, o.body, W - 260); lh = size * 1.8; if (lines.length * lh <= maxH) break; }
            c.fillStyle = '#fff'; var y0 = 440 + (maxH - lines.length * lh) / 2 + lh / 2 + 20;
            lines.forEach(function (ln, i) { c.fillText(ln, W / 2, y0 + i * lh); });
            c.strokeStyle = G; c.lineWidth = 2; c.beginPath(); c.moveTo(W / 2 - 330, 1040); c.lineTo(W / 2 + 330, 1040); c.stroke();
            c.fillStyle = G; c.beginPath(); c.moveTo(W / 2, 1030); c.lineTo(W / 2 + 10, 1040); c.lineTo(W / 2, 1050); c.lineTo(W / 2 - 10, 1040); c.closePath(); c.fill();
            c.font = '700 46px ' + FF; c.fillText(o.source || '', W / 2, 1100);
            if (o.note) { c.fillStyle = 'rgba(255,255,255,.88)'; c.font = '400 32px ' + FF; wrap(c, o.note, 700).slice(0, 2).forEach(function (ln, i) { c.fillText(ln, W / 2, 1160 + i * 44); }); }
            c.fillStyle = 'rgba(255,255,255,.65)'; c.font = '400 30px ' + FF; c.fillText('تطبيق المسلم — قرآن وأذكار ومواقيت الصلاة', W / 2, 1250);
            if (QR) { var q = 150, qx = 96, qy = 96; c.fillStyle = '#fff'; c.beginPath(); if (c.roundRect) c.roundRect(qx - 7, qy - 7, q + 14, q + 14, 12); else c.rect(qx - 7, qy - 7, q + 14, q + 14); c.fill(); c.imageSmoothingEnabled = false; c.drawImage(QR, 30, 30, QR.width - 60, QR.height - 60, qx, qy, q, q); c.imageSmoothingEnabled = true; c.fillStyle = 'rgba(255,255,255,.8)'; c.font = '400 24px ' + FF; c.fillText('امسح للدخول', qx + q / 2, qy + q + 30); }
            return cv;
        });
    }
    function draw(o, bgId) {
        if (bgId === 'brand') return drawBrand(o);
        var cv = document.createElement('canvas'); cv.width = W; cv.height = Ht; var c = cv.getContext('2d');
        var FF = '"Amiri Quran","Amiri","Traditional Arabic","Noto Naskh Arabic",serif';
        return loadImg('qr.png').then(function (qr) { return Promise.resolve(document.fonts && document.fonts.load ? document.fonts.load('40px "Amiri Quran"').catch(function () { }) : 0).then(function () { return loadImg(bgId + '.webp'); }).then(function (im) {
            var QR = qr;
            c.fillStyle = '#0f2a24'; c.fillRect(0, 0, W, Ht);
            if (im) { var r = Math.max(W / im.width, Ht / im.height), w = im.width * r, h = im.height * r; c.drawImage(im, (W - w) / 2, (Ht - h) / 2, w, h); }
            var g = c.createLinearGradient(0, 0, 0, Ht); g.addColorStop(0, 'rgba(6,20,17,.72)'); g.addColorStop(.5, 'rgba(6,20,17,.62)'); g.addColorStop(1, 'rgba(6,20,17,.82)'); c.fillStyle = g; c.fillRect(0, 0, W, Ht);
            c.strokeStyle = 'rgba(240,200,110,.85)'; c.lineWidth = 4; c.strokeRect(36, 36, W - 72, Ht - 72); c.lineWidth = 1.5; c.strokeRect(52, 52, W - 104, Ht - 104);
            c.direction = 'rtl'; c.textAlign = 'center'; c.textBaseline = 'middle';
            c.fillStyle = '#f0c86e'; c.font = '700 44px ' + FF; c.fillText(o.kicker || '', W / 2, 140);
            var size = 66, lines, lh, maxH = 540;
            for (; size >= 30; size -= 4) { c.font = '700 ' + size + 'px ' + FF; lines = wrap(c, o.body, W - 220); lh = size * 1.75; if (lines.length * lh <= maxH) break; }
            c.fillStyle = '#ffffff'; c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 8;
            var y0 = 250 + (maxH - lines.length * lh) / 2 + lh / 2 + 40;
            lines.forEach(function (ln, i) { c.fillText(ln, W / 2, y0 + i * lh); });
            c.shadowBlur = 0;
            var y = 250 + maxH + 80;
            c.fillStyle = '#f0c86e'; c.font = '700 40px ' + FF; c.fillText(o.source || '', W / 2, y);
            if (o.note) { c.fillStyle = 'rgba(255,255,255,.88)'; c.font = '400 34px ' + FF; var nl = wrap(c, o.note, W - 240).slice(0, 3); nl.forEach(function (ln, i) { c.fillText(ln, W / 2, y + 64 + i * 50); }); }
            c.fillStyle = 'rgba(255,255,255,.8)'; c.font = '700 36px ' + FF; c.fillText('المسلم — Al-Muslim', W / 2, Ht - 96);
            if (QR) { var q = 200, qx = W - 86 - q, qy = Ht - 86 - q; c.fillStyle = '#fff'; c.beginPath(); if (c.roundRect) c.roundRect(qx - 8, qy - 8, q + 16, q + 16, 14); else c.rect(qx - 8, qy - 8, q + 16, q + 16); c.fill(); c.imageSmoothingEnabled = false; c.drawImage(QR, 30, 30, QR.width - 60, QR.height - 60, qx, qy, q, q); c.imageSmoothingEnabled = true; c.fillStyle = 'rgba(255,255,255,.85)'; c.font = '400 26px ' + FF; c.fillText('امسح للدخول', qx + q / 2, qy - 26); }
            return cv;
        }); });
    }
    function blobOf(cv) { return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, 'image/png'); }); }
    function ui() {
        if ($('vcModal')) return;
        var st = document.createElement('style');
        st.textContent = '#vcModal{position:fixed;inset:0;z-index:9990;display:none;background:rgba(0,0,0,.72);align-items:center;justify-content:center;padding:12px}#vcModal.on{display:flex}#vcModal .vcBox{background:var(--card,#fff);color:var(--text,#111);border-radius:18px;padding:12px;max-width:440px;width:100%;max-height:96vh;overflow:auto;text-align:center}#vcModal canvas{width:100%;height:auto;max-height:62vh;object-fit:contain;border-radius:12px;background:#0f2a24}#vcModal .vcAct{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}#vcModal .vcAct button{flex:1 1 110px;min-height:44px;border-radius:12px;border:1px solid var(--line,#ccc);background:var(--card,#fff);color:inherit;font:inherit;cursor:pointer}#vcModal .vcAct .ok{background:var(--green,#0f4a3a);color:#fff;border-color:transparent;font-weight:700}#vcModal small{display:block;opacity:.75;margin-top:6px;min-height:1em}' +
            '.nvShare,.vcSh{border:1px solid rgba(240,200,110,.7);background:rgba(240,200,110,.16);color:#f0c86e;width:34px;height:34px;min-width:34px;border-radius:50%;padding:0;cursor:pointer;margin-inline-start:auto;display:inline-grid;place-items:center}.nvShare svg,.vcSh svg{display:block}' +
            '#vcDaily{grid-column:1/-1;order:8;display:grid;gap:10px;grid-template-columns:1fr}@media(min-width:700px){#vcDaily{grid-template-columns:1fr 1fr}}' +
            '.vcC{position:relative;border-radius:18px;overflow:hidden;color:#fff;padding:14px 16px;min-height:150px;background:#0f2a24 center/cover no-repeat;display:flex;flex-direction:column;gap:6px}.vcC:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(6,20,17,.66),rgba(6,20,17,.78))}.vcC>*{position:relative}.vcC h3{margin:0;font-size:14px;color:#f0c86e;display:flex;align-items:center;gap:8px}.vcC p{margin:0;font-size:calc(19px*var(--v105-fs,1));line-height:1.9;font-family:"Amiri Quran","Amiri",serif}.vcC small{opacity:.9;font-size:12.5px;line-height:1.6}';
        document.head.appendChild(st);
        var m = document.createElement('div'); m.id = 'vcModal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
        m.innerHTML = '<div class="vcBox"><div id="vcPrev"></div><small id="vcNote"></small><div class="vcAct"><button type="button" class="ok" id="vcShare">مشاركة</button><button type="button" id="vcSave">حفظ الصورة</button><button type="button" id="vcBg">تغيير الخلفية</button><button type="button" id="vcX">إغلاق</button></div></div>';
        document.body.appendChild(m);
        m.addEventListener('click', function (e) { if (e.target === m) close(); });
        $('vcX').onclick = close; $('vcBg').onclick = function () { bgI = (bgI + 1) % BGS.length; render(); };
        $('vcSave').onclick = function () { save(); }; $('vcShare').onclick = share;
    }
    function close() { var m = $('vcModal'); if (m) m.classList.remove('on'); }
    var blob = null;
    function render() {
        var o = cur; blob = null; $('vcPrev').innerHTML = '<span>جارٍ تجهيز البطاقة…</span>';
        draw(o, BGS[bgI]).then(function (cv) { $('vcPrev').innerHTML = ''; cv.setAttribute('aria-label', o.kicker || 'بطاقة'); $('vcPrev').appendChild(cv); return blobOf(cv); }).then(function (b) { blob = b; }).catch(function () { $('vcPrev').textContent = 'تعذّر تجهيز البطاقة'; });
    }
    function fname() { return 'almuslim-card-' + Date.now() + '.png'; }
    function save() {
        if (!blob) { $('vcNote').textContent = 'البطاقة قيد التجهيز'; return; }
        var a = document.createElement('a'), u = URL.createObjectURL(blob); a.href = u; a.download = fname(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
        $('vcNote').textContent = 'إن لم يبدأ التنزيل: اضغط مطولًا على الصورة واختر «حفظ الصورة».';
    }
    function share() {
        if (!blob) { $('vcNote').textContent = 'البطاقة قيد التجهيز'; return; }
        var f; try { f = new File([blob], fname(), { type: 'image/png' }); } catch (e) { f = null; }
        if (f && navigator.canShare && navigator.canShare({ files: [f] }) && navigator.share) navigator.share({ files: [f], title: (cur && cur.kicker) || 'المسلم' }).catch(function (e) { if (e && e.name !== 'AbortError') save(); });
        else { save(); $('vcNote').textContent = 'المشاركة المباشرة غير متاحة في هذا المتصفح — تم حفظ الصورة بدلًا منها.'; }
    }
    function open(o) {
        ui(); cur = o; var sc = ''; try { var SS = JSON.parse(LSG('muslim-bg-studio') || '{}') || {}; sc = o.kind === 'had' ? (SS.hbg || '') : o.kind === 'dhk' ? (SS.dbg || '') : ''; } catch (e) { } var i = BGS.indexOf(sc || 'brand'); bgI = i >= 0 ? i : 0; $('vcNote').textContent = ''; $('vcModal').classList.add('on'); render();
    }
    window.v107Card = { open: open, draw: draw, hadith: H, dhikr: D };

    /* ---------- حديث اليوم + ذكر/دعاء اليوم على الشاشة الرئيسية ---------- */
    function dailyRow() {
        var row = document.querySelector('#home .nvRow'); if (!row || $('vcDaily')) return !!$('vcDaily');
        ui();
        var n = dayN(), h = H[n % H.length], isFri = new Date().getDay() === 5, d = isFri ? SAL : D[(n + 3) % D.length];
        var wrapEl = document.createElement('div'); wrapEl.id = 'vcDaily';
        function card(title, bg, body, src, note, kicker, kind) {
            var c = document.createElement('div'); c.className = 'vcC ' + kind; c.style.backgroundImage = 'url(' + bg + '-t.webp)';
            var t = document.createElement('h3'), sp = document.createElement('span'), b = document.createElement('button'), p = document.createElement('p'), s = document.createElement('small');
            sp.textContent = title; b.type = 'button'; b.className = 'vcSh'; b.innerHTML = SHARE_SVG; b.title = 'مشاركة كبطاقة'; b.setAttribute('aria-label', 'مشاركة ' + title + ' كبطاقة');
            t.appendChild(sp); t.appendChild(b); p.textContent = body; s.textContent = src + (note ? ' — ' + note : '');
            b.onclick = function () { open({ kicker: kicker, body: body, source: src, note: note, bg: bg, kind: kind }); };
            c.appendChild(t); c.appendChild(p); c.appendChild(s); return c;
        }
        wrapEl.appendChild(card('حديث اليوم', BGS[n % 3 === 0 ? 1 : n % 3 === 1 ? 3 : 2], '«' + h[0] + '»', h[1], h[2], 'حديث اليوم', 'had'));
        wrapEl.appendChild(card(isFri ? 'الصلاة على النبي ﷺ' : 'ذكر ودعاء اليوم', BGS[4 + (n % 3)], d[0], d[1], '', isFri ? 'الصلاة على النبي ﷺ' : 'ذكر ودعاء', 'dhk'));
        row.parentNode.insertBefore(wrapEl, row.nextSibling); return true;
    }
    var tries = 0, iv = setInterval(function () { if (dailyRow() || ++tries > 60) clearInterval(iv); }, 500);
})();
