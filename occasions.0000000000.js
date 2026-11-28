/* تهنئة المناسبات (الجمعة، الأشهر الهجرية، رمضان والعشر الأواخر، الأعياد) مع العمل المستحب ودليله — الشاشة الرئيسية */
(function () {
    'use strict';
    var LSG = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var LSS = function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } };
    var MN = ['', 'محرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'];
    function hijri() {
        try {
            var p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }).formatToParts(new Date()), o = {};
            p.forEach(function (x) { o[x.type] = parseInt(x.value, 10); });
            if (o.day >= 1 && o.month >= 1 && o.month <= 12) return o;
        } catch (e) { } return null;
    }
    var MONTH = {
        1: ['شهر الله المحرّم، وهو من الأشهر الحُرُم.', 'أكثِر من الصيام: «أفضل الصيام بعد رمضان شهر الله المحرّم» (رواه مسلم 1163).'],
        2: ['شهر صفر مبارك.', 'لا عدوى ولا طِيَرة ولا صفر — فلا تشاؤم بهذا الشهر (رواه البخاري 5757 ومسلم 2220). داوم على أورادك.'],
        3: ['حلّ شهر ربيع الأول؛ فيه هجرة النبي ﷺ ووفاته.', 'اقرأ في سيرته ﷺ، وصُم الاثنين: «ذاك يومٌ وُلدتُ فيه» (رواه مسلم 1162).'],
        4: ['حلّ شهر ربيع الآخر.', 'داوم على الأعمال الصالحة: «أحبّ الأعمال إلى الله أدومها وإن قلّ» (متفق عليه: البخاري 6464 ومسلم 783).'],
        5: ['حلّ شهر جمادى الأولى.', 'اجعل لك ورداً يوميًا من القرآن والذكر ولو قليلًا (البخاري 6464).'],
        6: ['حلّ شهر جمادى الآخرة.', 'واظب على صيام ثلاثة أيام من كل شهر (رواه البخاري 1979 ومسلم 721).'],
        7: ['حلّ شهر رجب، وهو من الأشهر الحُرُم.', '﴿منها أربعة حُرُم﴾ (التوبة 36) فاحذر الظلم فيه. ولم يصحّ تخصيصه بصلاة أو صيام معيّن.'],
        8: ['حلّ شهر شعبان، تهيّأ لرمضان.', 'كان النبي ﷺ يصوم أكثر شعبان (رواه البخاري 1969 ومسلم 1156)، وفيه تُرفع الأعمال إلى الله (رواه النسائي 2357 وحسّنه الألباني).'],
        9: ['رمضان مبارك! حلّ شهر الصيام والقرآن.', '﴿شهر رمضان الذي أُنزل فيه القرآن﴾ (البقرة 185). «من صام رمضان إيمانًا واحتسابًا غُفر له ما تقدّم من ذنبه» (رواه البخاري 38 ومسلم 760)، «ومن قام رمضان إيمانًا واحتسابًا غُفر له» (البخاري 37).'],
        10: ['حلّ شهر شوّال، تقبّل الله طاعتكم.', '«من صام رمضان ثم أتبعه ستًّا من شوّال كان كصيام الدهر» (رواه مسلم 1164).'],
        11: ['حلّ شهر ذي القعدة، وهو من الأشهر الحُرُم.', 'اعتمر النبي ﷺ أربع عُمَر كلها في ذي القعدة (رواه البخاري 1778 ومسلم 1253). فيه فرصة للعمرة وللتهيّؤ للحج.'],
        12: ['حلّ شهر ذي الحجة، شهر الحج.', '«ما من أيام العمل الصالح فيهن أحبّ إلى الله من هذه الأيام العشر» (رواه البخاري 969 وأبو داود 2438)، فأكثر من التكبير والتهليل والتحميد.']
    };
    function pick(h, wd, hr) {
        var out = [], d = h.day, m = h.month;
        if (m === 10 && d === 1) out.push(['🎉 عيد فطر مبارك', 'تقبّل الله منا ومنكم صالح الأعمال.', 'السنة: التكبير من غروب ليلة العيد حتى صلاة العيد ﴿ولتكمّلوا العدّة ولتكبّروا الله على ما هداكم﴾ (البقرة 185)، وإخراج زكاة الفطر قبل الصلاة (رواه البخاري 1503)، والأكل قبل الخروج (رواه البخاري 953)، والذهاب لصلاة العيد، ومخالفة الطريق (البخاري 986).']);
        else if (m === 12 && d === 10) out.push(['🐑 عيد أضحى مبارك', 'تقبّل الله منا ومنكم.', '﴿فصلّ لربك وانحر﴾ (الكوثر 2). السنة: صلاة العيد ثم الأضحية، وألا يأكل قبل الصلاة (رواه الترمذي 542 وصحّحه الألباني)، والتكبير حتى آخر أيام التشريق.']);
        else if (m === 12 && d === 9) out.push(['⛰ يوم عرفة', 'يوم المغفرة والعتق من النار.', 'صيامه لغير الحاج: «أحتسب على الله أن يكفّر السنة التي قبله والسنة التي بعده» (رواه مسلم 1162). وخير الدعاء دعاء يوم عرفة (رواه الترمذي 3585 وحسّنه الألباني).']);
        else if (m === 12 && d >= 11 && d <= 13) out.push(['أيام التشريق', 'أيام أكل وشرب وذكر.', '«أيام التشريق أيام أكلٍ وشربٍ وذكرٍ لله» (رواه مسلم 1141) ولا يُصام فيها. ﴿واذكروا الله في أيام معدودات﴾ (البقرة 203).']);
        else if (m === 12 && d < 9) out.push(['العشر الأوائل من ذي الحجة', 'أفضل أيام السنة للعمل الصالح.', 'الدليل: «ما من أيام العمل الصالح فيهن أحبّ إلى الله من هذه الأيام العشر… ولا الجهاد إلا رجل خرج بنفسه وماله فلم يرجع بشيء» (رواه البخاري 969). صُم التسع إن استطعت، وأكثر من التكبير (البقرة 203، الحج 28).']);
        else if (m === 9 && d >= 21) out.push(['🌙 العشر الأواخر من رمضان', 'اجتهد فيها فهي أعظم ليالي العام.', 'الدليل: «كان النبي ﷺ إذا دخل العشر أحيا الليل وأيقظ أهله وشدّ المئزر» (رواه البخاري 2024 ومسلم 1174). «تحرّوا ليلة القدر في الوتر من العشر الأواخر» (رواه البخاري 2017). ادعُ: «اللهم إنك عفوٌّ تحب العفو فاعفُ عني» (رواه الترمذي 3513 وصحّحه الألباني). وأخرج زكاة الفطر قبل العيد (البخاري 1503).']);
        else if (m === 9) out.push(['🌙 رمضان مبارك', MONTH[9][0], MONTH[9][1]]);
        else if (m === 1 && d === 10) out.push(['يوم عاشوراء', 'يوم نجّى الله فيه موسى عليه السلام.', 'صيامه يكفّر السنة الماضية (رواه مسلم 1162)، ويُستحب صيام التاسع معه (رواه مسلم 1134).']);
        else if (m === 1 && d === 9) out.push(['يوم تاسوعاء', 'يُستحب صيامه مع عاشوراء.', '«لئن بقيتُ إلى قابل لأصومنّ التاسع» (رواه مسلم 1134).']);
        else if (d <= 3) out.push(['🌙 ' + 'حلّ شهر ' + MN[m] + ' — كل عام وأنتم بخير', MONTH[m][0], MONTH[m][1]]);
        if ((d === 13 || d === 14 || d === 15) && m !== 9 && !(m === 12 && d === 13)) out.push(['الأيام البيض', 'يُستحب صيام ثلاثة أيام من كل شهر وأفضلها الأيام البيض (13 و14 و15).', '«يا أبا ذر إذا صمتَ من الشهر ثلاثة أيام فصُم ثلاث عشرة وأربع عشرة وخمس عشرة» (رواه الترمذي 761 والنسائي 2424 وحسّنه الألباني).']);
        if (wd === 5 || (wd === 4 && hr >= 17)) out.push([wd === 5 ? 'جمعة مباركة 🌙' : 'ليلة الجمعة مباركة 🌙', wd === 5 ? 'تقبّل الله طاعتك، وأكثِر من الصلاة على النبي ﷺ.' : 'أكثِر من الصلاة على النبي ﷺ في ليلة الجمعة ويومها.', 'من سنن الجمعة: الاغتسال «غُسل يوم الجمعة واجبٌ على كل محتلم» (البخاري 879 ومسلم 846)، والتطيّب والسواك (البخاري 880)، والتبكير إلى المسجد (البخاري 881)، وقراءة سورة الكهف: «من قرأ سورة الكهف يوم الجمعة أضاء له من النور ما بين الجمعتين» (رواه الحاكم 2/368 وصحّحه الألباني)، وساعة الإجابة (البخاري 935 ومسلم 852)، و«أكثروا عليّ من الصلاة يوم الجمعة» (رواه أبو داود 1047 وصحّحه الألباني).', 'sal']);
        return out;
    }
    function khatmah() {
        try { var s = JSON.parse(LSG('quran-m09-v27-khatmah') || 'null') || { surah: 1, ayah: 0 }; var off = (typeof SURAH_AYAH_OFFSETS !== 'undefined' && SURAH_AYAH_OFFSETS) ? Number(SURAH_AYAH_OFFSETS[Number(s.surah) - 1] || 0) : 0; return Math.min(100, Math.round((off + Number(s.ayah || 0)) / 6236 * 100)); } catch (e) { return 0; }
    }
    function dayKey() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function render() {
        try {
            var old = document.getElementById('occHome'); if (old) old.remove();
            if (LSG('muslim-fri-off') === '1') return;
            var home = document.getElementById('home'); if (!home) return; var hero = home.querySelector('.hero') || document.getElementById('nvHero'); if (!hero) return;
            var now = new Date(), h = hijri(), items = h ? pick(h, now.getDay(), now.getHours()) : pick({ day: 99, month: 1 }, now.getDay(), now.getHours());
            var wrap = document.createElement('div'); wrap.id = 'occHome';
            if (h && h.month === 9) {
                var p = khatmah(), want = Math.min(100, Math.round(h.day / 30 * 100)), c = document.createElement('div'); c.className = 'occC';
                c.innerHTML = '<b></b><span></span><button type="button" class="occB">متابعة الختمة</button>'; c.querySelector('b').textContent = '📖 ختمتك في رمضان: ' + p + '%';
                c.querySelector('span').textContent = p >= want ? 'أحسنت! أنت على الجدول (المطلوب اليوم نحو ' + want + '%). واصل حتى تختم.' : 'المطلوب اليوم نحو ' + want + '% لتختم في 30 يومًا. أكمل وردك اليوم بإذن الله.';
                c.querySelector('.occB').onclick = function () { if (window.show) window.show('khatmah'); }; wrap.appendChild(c);
            }
            items.slice(0, 3).forEach(function (it) {
                var c = document.createElement('div'); c.className = 'occC'; c.innerHTML = '<b></b><span></span><details><summary>العمل المستحب ودليله</summary><p></p></details>';
                c.querySelector('b').textContent = it[0]; c.querySelector('span').textContent = it[1]; c.querySelector('p').textContent = it[2];
                if (it[3] === 'sal') {
                    var n = +(LSG('muslim-sal-' + dayKey()) || 0), b = document.createElement('button'); b.type = 'button'; b.className = 'occB'; b.innerHTML = 'اللهم صلِّ وسلِّم على نبينا محمد <i></i>'; b.querySelector('i').textContent = String(n);
                    b.onclick = function () { n++; this.querySelector('i').textContent = String(n); LSS('muslim-sal-' + dayKey(), String(n)); }; c.insertBefore(b, c.querySelector('details'));
                }
                var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'occS'; sb.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2"/></svg> <span>مشاركة كبطاقة</span>';
                sb.onclick = function () { var fri = it[3] === 'sal' || /جمعة|الجمعة/.test(it[0]); var body = fri ? '﴿ إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا ﴾' : it[1]; if (window.v107Card) window.v107Card.open({ kicker: it[0].replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/gu, '').trim(), body: body, source: fri ? 'سورة الأحزاب - الآية 56' : '', note: fri ? 'جمعتكم مباركة — أكثروا من الصلاة على النبي ﷺ' : it[2], bg: 'brand' }); };
                c.appendChild(sb); wrap.appendChild(c);
            });
            if (h && !items.length && !(h.month === 9)) { /* لا مناسبة اليوم: لا شيء يُعرض كي لا نزعج المستخدم */ }
            if (wrap.children.length) { if (h) { var f = document.createElement('div'); f.className = 'occH'; f.textContent = h.day + ' ' + MN[h.month] + ' ' + h.year + 'هـ (بحسب تقويم أم القرى، وقد يختلف يومًا عن رؤية بلدك)'; wrap.insertBefore(f, wrap.firstChild); } hero.parentNode.insertBefore(wrap, hero.nextSibling); }
        } catch (e) { }
    }
    window.v107Occ = { render: render, pick: pick, hijri: hijri };
    setTimeout(render, 1200); setTimeout(render, 4000); setInterval(function () { if (!document.getElementById('occHome')) render(); }, 60000);
})();
