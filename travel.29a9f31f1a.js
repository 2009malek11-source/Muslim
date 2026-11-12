(function () {
    'use strict';
    var R = Math.PI / 180, K_ON = 'muslim-v116-travel-on', K_TRIP = 'muslim-v116-trip', K_OPT = 'muslim-v116-travel-opt', K_CHK = 'muslim-v116-travel-chk';
    function LGt(k, d) { try {
        var v = localStorage.getItem(k);
        return v == null ? d : JSON.parse(v);
    }
    catch (e) {
        return d;
    } }
    function LSt(k, v) { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch (e) { } }
    function $(id) { return document.getElementById(id); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    var AD = '٠١٢٣٤٥٦٧٨٩';
    function norm(s) { return String(s || '').replace(/[٠-٩]/g, function (d) { return AD.indexOf(d); }).replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/\s+/g, ' ').trim().toLowerCase(); }
    var CITIES = [
        ['طرابلس', 32.8872, 13.1913], ['بنغازي', 32.1167, 20.0667], ['مصراتة', 32.3754, 15.0925], ['الخمس', 32.6486, 14.2619], ['زليتن', 32.4674, 14.5687],
        ['سرت', 31.2089, 16.5887], ['سبها', 27.0377, 14.4283], ['الزاوية', 32.7571, 12.7276], ['صبراتة', 32.7937, 12.4846], ['صرمان', 32.7578, 12.5864],
        ['غريان', 32.1722, 13.0203], ['ترهونة', 32.4350, 13.6340], ['بني وليد', 31.7644, 13.9889], ['طبرق', 32.0836, 23.9764], ['البيضاء', 32.7627, 21.7551],
        ['درنة', 32.7650, 22.6368], ['المرج', 32.4900, 20.8300], ['اجدابيا', 30.7554, 20.2263], ['البريقة', 30.4167, 19.6000], ['راس لانوف', 30.5000, 18.5667],
        ['اوباري', 26.5900, 12.7800], ['غدامس', 30.1337, 9.5007], ['غات', 24.9647, 10.1728], ['مرزق', 25.9155, 13.9183], ['الكفرة', 24.1989, 23.2894],
        ['جالو', 29.0360, 21.5560], ['اوجله', 29.1333, 21.2833], ['هون', 29.1264, 15.9429], ['يفرن', 32.0610, 12.5340], ['جادو', 31.9526, 12.0215],
        ['نالوت', 31.8683, 10.9806], ['زوارة', 32.9312, 12.0820], ['العجيلات', 32.7615, 12.3660], ['تاجوراء', 32.8833, 13.3500], ['القره بوللي', 32.7500, 14.2167],
        ['العزيزيه', 32.5333, 13.0167], ['الرجبان', 31.3333, 12.2500], ['مزده', 31.4500, 12.2833], ['ككله', 31.9500, 13.1000],
        ['القاهره', 30.0444, 31.2357], ['الاسكندريه', 31.2001, 29.9187], ['تونس', 36.8065, 10.1815], ['القيروان', 35.6781, 10.0963], ['سوسه', 35.8256, 10.6369],
        ['صفاقس', 34.7406, 10.7603], ['الجزائر', 36.7538, 3.0588], ['الرباط', 34.0209, -6.8416], ['الدار البيضاء', 33.5731, -7.5898],
        ['مكه المكرمه', 21.4225, 39.8262], ['المدينه المنوره', 24.4686, 39.6142], ['جده', 21.4858, 39.1925], ['الرياض', 24.7136, 46.6753],
        ['دبي', 25.2048, 55.2708], ['ابوظبي', 24.4539, 54.3773], ['الدوحه', 25.2854, 51.5310], ['الكويت', 29.3759, 47.9774], ['المنامه', 26.2285, 50.5860],
        ['مسقط', 23.5880, 58.3829], ['عمان', 31.9454, 35.9284], ['دمشق', 33.5138, 36.2765], ['بيروت', 33.8938, 35.5018], ['بغداد', 33.3152, 44.3661],
        ['القدس', 31.7683, 35.2137], ['غزه', 31.5017, 34.4668], ['صنعاء', 15.3694, 44.1910], ['الخرطوم', 15.5007, 32.5599], ['نواكشوط', 18.0735, -15.9582],
        ['اسطنبول', 41.0082, 28.9784], ['انقره', 39.9334, 32.8597], ['لندن', 51.5074, -0.1278], ['باريس', 48.8566, 2.3522], ['روما', 41.9028, 12.4964],
        ['مدريد', 40.4168, -3.7038], ['برلين', 52.5200, 13.4050], ['نيويورك', 40.7128, -74.0060]
    ];
    var DISPLAY = { 'اجدابيا': 'أجدابيا', 'راس لانوف': 'رأس لانوف', 'اوباري': 'أوباري', 'اوجله': 'أوجلة', 'العزيزيه': 'العزيزية', 'مزده': 'مزدة', 'ككله': 'ككلة', 'القاهره': 'القاهرة', 'الاسكندريه': 'الإسكندرية', 'سوسه': 'سوسة', 'مكه المكرمه': 'مكة المكرمة', 'المدينه المنوره': 'المدينة المنورة', 'جده': 'جدة', 'الدوحه': 'الدوحة', 'المنامه': 'المنامة', 'عمان': 'عمّان', 'غزه': 'غزة', 'اسطنبول': 'إسطنبول', 'انقره': 'أنقرة', 'ابوظبي': 'أبوظبي' };
    function dispName(n) { return DISPLAY[n] || n; }
    function lev(a, b) { var m = a.length, n = b.length, d = [], i, j; for (i = 0; i <= m; i++) {
        d[i] = [i];
    } for (j = 1; j <= n; j++)
        d[0][j] = j; for (i = 1; i <= m; i++)
        for (j = 1; j <= n; j++)
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; }
    function findCities(q) {
        var n = norm(q).replace(/^ال/, '');
        if (!n)
            return [];
        var out = [], seen = {};
        CITIES.forEach(function (c) { var cn = c[0].replace(/^ال/, ''); if (cn === n || cn.indexOf(n) === 0 || c[0].indexOf(n) >= 0) {
            out.push({ name: dispName(c[0]), lat: c[1], lon: c[2], exact: cn === n });
            seen[c[0]] = 1;
        } });
        if (!out.length && n.length >= 3) {
            var sc = CITIES.map(function (c) { return { c: c, d: lev(c[0].replace(/^ال/, ''), n) }; }).filter(function (x) { return x.d <= (n.length <= 3 ? 2 : Math.max(1, Math.floor(n.length / 3))); }).sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
            sc.forEach(function (x) { out.push({ name: dispName(x.c[0]), lat: x.c[1], lon: x.c[2], fuzzy: true }); });
        }
        return out.slice(0, 6);
    }
    function hav(a, b, c, d) { var dl = (c - a) * R, dn = (d - b) * R, x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a * R) * Math.cos(c * R) * Math.sin(dn / 2) * Math.sin(dn / 2); return 12742 * Math.asin(Math.sqrt(x)); }
    function makeRoute(coords) {
        var cum = [0], i;
        for (i = 1; i < coords.length; i++)
            cum.push(cum[i - 1] + hav(coords[i - 1][0], coords[i - 1][1], coords[i][0], coords[i][1]));
        return { pts: coords, cum: cum, len: cum[cum.length - 1] };
    }
    function pointAt(route, km) {
        if (km <= 0)
            return { lat: route.pts[0][0], lon: route.pts[0][1] };
        if (km >= route.len) {
            var l = route.pts[route.pts.length - 1];
            return { lat: l[0], lon: l[1] };
        }
        var lo = 0, hi = route.cum.length - 1;
        while (hi - lo > 1) {
            var mid = (lo + hi) >> 1;
            if (route.cum[mid] <= km)
                lo = mid;
            else
                hi = mid;
        }
        var t = (km - route.cum[lo]) / Math.max(1e-9, route.cum[hi] - route.cum[lo]), a = route.pts[lo], b = route.pts[hi];
        return { lat: a[0] + (b[0] - a[0]) * t, lon: a[1] + (b[1] - a[1]) * t };
    }
    function sample(route, stepKm) { var out = [], k = 0; while (k < route.len) {
        var p = pointAt(route, k);
        out.push({ lat: p.lat, lon: p.lon, km: k });
        k += stepKm;
    } var e = pointAt(route, route.len); out.push({ lat: e.lat, lon: e.lon, km: route.len }); return out; }
    var LIMITS = [{ v: 77, t: 'نحو 77 كم (48 ميلًا) — اختيار بعض المعاصرين' }, { v: 80, t: 'نحو 80 كم — الأشيع عند جمهور الفقهاء (أربعة برد)' }, { v: 83, t: 'نحو 83 كم — بعض دور الإفتاء' }, { v: 89, t: 'نحو 89 كم — احتياطًا (مذهب الحنفية قريب منه)' }];
    function ruling(distKm, limitKm, stayDays) {
        var travel = distKm >= limitKm, o = { travel: travel, limit: limitKm, dist: distKm, notes: [] };
        o.qasr = travel;
        if (!travel) {
            o.headline = 'المسافة (' + Math.round(distKm) + ' كم) دون مسافة القصر (' + limitKm + ' كم)';
            o.notes.push('لا يثبت حكم السفر: تُصلّى الصلوات تامّة في وقتها، ولا قصر ولا جمع بسبب السفر.');
            return o;
        }
        o.headline = 'المسافة (' + Math.round(distKm) + ' كم) بلغت مسافة القصر (' + limitKm + ' كم) ✅';
        o.notes.push('تقصر الرباعية (الظهر والعصر والعشاء) إلى ركعتين؛ والفجر والمغرب بلا قصر. القصر سنة مؤكدة عند الجمهور وواجب عند الحنفية.');
        o.notes.push('يبدأ حكم السفر بمفارقة عمران البلد (آخر بيوتها) لا من باب البيت، وينتهي بدخول بلدك أو بنية الإقامة.');
        o.notes.push('الجمع بين الظهر والعصر وبين المغرب والعشاء رخصة للمسافر عند جمهور الفقهاء (المالكية والشافعية والحنابلة) ولا سيما إذا جدّ به السير؛ والحنفية لا يجيزونه إلا في عرفة ومزدلفة. والأفضل ألا تجمع إلا لحاجة إن تيسّر لك أداء كل صلاة في وقتها.');
        var d = Number(stayDays);
        if (isFinite(d)) {
            if (d < 4)
                o.stay = 'إقامتك في الوجهة (' + d + ' أيام) أقل من أربعة أيام: تبقى في حكم المسافر وتقصر هناك عند الجمهور.';
            else if (d < 15)
                o.stay = 'نيّتك الإقامة ' + d + ' أيام: عند الجمهور (المالكية والشافعية) إقامة أكثر من أربعة أيام تُنهي حكم السفر فتُتمّ الصلاة بعد وصولك؛ وعند الحنفية تقصر ما لم تنوِ خمسة عشر يومًا فأكثر. اختر ما تطمئن إليه من فتوى بلدك.';
            else
                o.stay = 'إقامتك ' + d + ' يومًا: تُتمّ الصلاة في الوجهة عند عامة الفقهاء لأنها إقامة.';
            o.stayLong = d >= 4;
        }
        o.notes.push('إن كنت صائمًا في رمضان فيجوز لك الفطر في السفر الطويل ثم القضاء، والصيام لمن لا يشقّ عليه أفضل عند كثير من أهل العلم.');
        o.notes.push('يمسح المسافر على الخفين ثلاثة أيام بلياليهن (رواه مسلم).');
        o.notes.push('السنّة للمسافر ترك الرواتب (سنن الصلوات) إلا ركعتي الفجر والوتر، ولا حرج في النوافل المطلقة.');
        return o;
    }
    var NAME = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    function fmt(d) { var h = d.getHours(), m = d.getMinutes(); return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
    function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function planPrayers(o) {
        var D = o.depart.getTime(), A = D + o.durMin * 60000, route = o.route, timesAt = o.timesAt;
        function posAt(t) { var f = A > D ? Math.max(0, Math.min(1, (t - D) / (A - D))) : 0; return pointAt(route, route.len * f); }
        function stateAt(t) { return t < D ? 'home' : (t > A ? 'dest' : 'road'); }
        var days = [dayStart(o.depart)], endDay = dayStart(new Date(A));
        if (endDay.getTime() !== days[0].getTime())
            days.push(endDay);
        days.push(new Date(endDay.getTime() + 86400000 + 3600000));
        var ev = [];
        days.forEach(function (day, di) {
            ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(function (k) {
                var p = posAt(day.getTime() + 43200000), T = timesAt(day, p.lat, p.lon)[k].getTime(), it;
                for (it = 0; it < 3; it++) {
                    var st = stateAt(T);
                    p = st === 'home' ? { lat: route.pts[0][0], lon: route.pts[0][1] } : (st === 'dest' ? { lat: route.pts[route.pts.length - 1][0], lon: route.pts[route.pts.length - 1][1] } : posAt(T));
                    T = timesAt(day, p.lat, p.lon)[k].getTime();
                }
                ev.push({ k: k, t: T, day: day, di: di, state: stateAt(T), lat: p.lat, lon: p.lon });
            });
        });
        ev.sort(function (a, b) { return a.t - b.t; });
        function find(k, di) { for (var i = 0; i < ev.length; i++)
            if (ev[i].k === k && ev[i].di === di)
                return ev[i]; return null; }
        function endOf(e) {
            var next = { fajr: 'dhuhr', dhuhr: 'asr', asr: 'maghrib', maghrib: 'isha', isha: null }[e.k];
            if (next) {
                var n = find(next, e.di);
                return n ? n.t : null;
            }
            var f = find('fajr', e.di + 1);
            return f ? f.t : e.t + 6 * 3600000;
        }
        var items = [];
        ev.forEach(function (e) {
            if (e.t < D - 5 * 3600000 || e.t > A + 5 * 3600000)
                return;
            if (e.di >= days.length - 1 && e.k !== 'fajr' && e.t > A + 5 * 3600000)
                return;
            items.push(e);
        });
        var out = [];
        items.forEach(function (e) {
            var rec, end = endOf(e), endTxt = end ? fmt(new Date(end)) : '', where = e.state === 'home' ? 'قبل الانطلاق' : (e.state === 'dest' ? 'بعد الوصول' : 'أثناء الطريق');
            var rk = (e.k === 'dhuhr' || e.k === 'asr' || e.k === 'isha') && o.qasr;
            var pairWith = e.k === 'dhuhr' ? 'asr' : (e.k === 'asr' ? 'dhuhr' : (e.k === 'maghrib' ? 'isha' : (e.k === 'isha' ? 'maghrib' : null)));
            var other = pairWith ? find(pairWith, e.di) : null;
            var first = (e.k === 'dhuhr' || e.k === 'maghrib');
            if (e.k === 'fajr') {
                rec = 'ركعتان في وقتها' + (e.state === 'road' ? ' عند أول استراحة، ولا تؤخّرها عن طلوع الشمس.' : '.');
            }
            else if (!o.qasr) {
                rec = 'تُصلّى تامّة في وقتها (المسافة دون حد القصر فلا جمع ولا قصر).';
            }
            else {
                var q = rk ? 'قصرًا (ركعتان)' : 'تامّة (ثلاث ركعات)';
                if (e.state === 'home')
                    rec = 'صلِّها في وقتها قبل الانطلاق تامّةً (لم يبدأ حكم السفر بعد).';
                else if (e.state === 'dest')
                    rec = 'في وجهتك في وقتها ' + q + (rk && o.stayLong ? ' — أما إن نويتَ إقامة طويلة فتُتمّ' : '') + '.';
                else {
                    var otherState = other ? other.state : null;
                    if (otherState === 'road') {
                        rec = first
                            ? 'صلِّها ' + q + ' في وقتها عند الاستراحة، أو اجمعها مع ' + NAME[pairWith] + ' جمعَ تقديم الآن (قبل ' + fmt(new Date(other.t)) + ') إن لم تجد توقفًا مناسبًا لاحقًا.'
                            : 'صلِّها ' + q + ' في وقتها، أو اجمعها مع ' + NAME[pairWith] + ' جمعَ تأخير في وقتها (من ' + fmt(new Date(e.t)) + ' إلى ' + endTxt + ') عند أول استراحة.';
                    }
                    else if (otherState === 'home') {
                        rec = 'صلِّها ' + q + ' في وقتها عند أول استراحة بعد مفارقة البلد.';
                    }
                    else {
                        rec = first ? 'صلِّها ' + q + ' في وقتها عند الاستراحة قبل الوصول، أو عند الوصول إن بقي وقتها (حتى ' + endTxt + ').' : 'صلِّها ' + q + ' في وقتها (قبل ' + endTxt + ') عند الاستراحة أو عند الوصول.';
                    }
                }
            }
            out.push({ k: e.k, name: NAME[e.k], time: fmt(new Date(e.t)), t: e.t, state: e.state, where: where, rec: rec, end: endTxt, lat: e.lat, lon: e.lon, dayLabel: e.day });
        });
        return out;
    }
    var DUAS = [
        { t: 'دعاء ركوب المركبة / بدء السفر', x: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، ﴿سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ﴾، اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الْأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ.', s: 'رواه مسلم' },
        { t: 'عند الرجوع من السفر (يُزاد على الدعاء السابق)', x: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ.', s: 'رواه مسلم' },
        { t: 'عند الصعود والنزول', x: 'كان الصحابة إذا صعدوا الأماكن العالية كبّروا (اللهُ أكبر)، وإذا هبطوا سبّحوا (سبحان الله).', s: 'رواه البخاري' },
        { t: 'عند النزول في منزل أو استراحة', x: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.', s: 'رواه مسلم' },
        { t: 'دعاء المقيم للمسافر', x: 'أَسْتَوْدِعُ اللَّهَ دِينَكَ وَأَمَانَتَكَ وَخَوَاتِيمَ عَمَلِكَ.', s: 'رواه أبو داود والترمذي' },
        { t: 'دعاء المسافر للمقيم', x: 'أَسْتَوْدِعُكُمُ اللَّهَ الَّذِي لَا تَضِيعُ وَدَائِعُهُ.', s: 'رواه أحمد وابن ماجه' },
        { t: 'دعاء لمن يودّع مسافرًا', x: 'زَوَّدَكَ اللَّهُ التَّقْوَى، وَغَفَرَ ذَنْبَكَ، وَيَسَّرَ لَكَ الْخَيْرَ حَيْثُمَا كُنْتَ.', s: 'رواه الترمذي' },
        { t: 'تذكير', x: 'دعوة المسافر من الدعوات المستجابة، فأكثر من الدعاء في طريقك.', s: 'رواه أبو داود والترمذي' }
    ];
    var CHECK = ['الهوية / جواز السفر والوثائق', 'المحفظة والنقود والبطاقات', 'الأدوية الشخصية وحقيبة إسعاف', 'الشاحن وبنك الطاقة', 'سجادة صلاة صغيرة وماء للوضوء', 'مصحف أو تطبيقه + سماعات', 'ملابس مناسبة للطقس وللصلاة', 'طعام خفيف وماء كافٍ', 'فحص السيارة: الإطارات والزيت والوقود والإطار الاحتياطي', 'أرقام الطوارئ وموقع الوجهة على الخريطة', 'إغلاق الغاز والكهرباء والأبواب في البيت', 'إبلاغ أهلك بموعد الانطلاق والوصول'];
    function fetchTimeout(url, opt, ms) {
        var c = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { c && c.abort(); }, ms || 15000);
        opt = Object.assign({}, opt || {});
        if (c)
            opt.signal = c.signal;
        return fetch(url, opt).then(function (r) { clearTimeout(tm); return r; }, function (e) { clearTimeout(tm); throw e; });
    }
    function geocode(q) {
        return fetchTimeout('https://nominatim.openstreetmap.org/search?format=json&limit=5&accept-language=ar&q=' + encodeURIComponent(q), { headers: { 'Accept': 'application/json' } }, 12000)
            .then(function (r) { return r.json(); }).then(function (a) { return (a || []).map(function (x) { return { name: String(x.display_name || '').split(',').slice(0, 3).join('،'), lat: +x.lat, lon: +x.lon }; }); });
    }
    function routeFor(a, b, mode) {
        var straight = hav(a.lat, a.lon, b.lat, b.lon);
        function fallback(why) {
            var d = mode === 'plane' ? straight : straight * 1.25, pts = [[a.lat, a.lon], [b.lat, b.lon]];
            return { route: makeRoute(pts), dist: d, estimated: true, why: why };
        }
        if (mode === 'plane')
            return Promise.resolve(fallback(''));
        var url = 'https://router.project-osrm.org/route/v1/driving/' + a.lon + ',' + a.lat + ';' + b.lon + ',' + b.lat + '?overview=simplified&geometries=geojson';
        return fetchTimeout(url, {}, 15000).then(function (r) { return r.json(); }).then(function (j) {
            if (!j || !j.routes || !j.routes[0])
                return fallback('no-route');
            var rt = j.routes[0], pts = rt.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
            var route = makeRoute(pts);
            return { route: route, dist: rt.distance / 1000, drivingMin: rt.duration / 60, estimated: false };
        }).catch(function () { return fallback('network'); });
    }
    var OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
    var KINDS = {
        mosque: { t: '🕌 مساجد ومصلّيات', f: '["amenity"="place_of_worship"]["religion"="muslim"]' },
        fuel: { t: '⛽ محطات وقود', f: '["amenity"="fuel"]' },
        food: { t: '🍽️ مطاعم وكافيهات', f: '["amenity"~"^(restaurant|cafe|fast_food)$"]' },
        health: { t: '⚕️ صيدليات ومستشفيات', f: '["amenity"~"^(pharmacy|hospital|clinic)$"]' },
        rest: { t: '🛑 استراحات الطريق', f: '["highway"~"^(rest_area|services)$"]' }
    };
    function poiQuery(pts, radius, kinds) {
        var line = pts.map(function (p) { return p.lat.toFixed(5) + ',' + p.lon.toFixed(5); }).join(',');
        var parts = [];
        kinds.forEach(function (k) { var f = KINDS[k].f; parts.push('node(around:' + radius + ',' + line + ')' + f + ';'); parts.push('way(around:' + radius + ',' + line + ')' + f + ';'); });
        return '[out:json][timeout:25];(' + parts.join('') + ');out center tags 400;';
    }
    function classify(tags) {
        if (tags.amenity === 'place_of_worship')
            return 'mosque';
        if (tags.amenity === 'fuel')
            return 'fuel';
        if (/^(restaurant|cafe|fast_food)$/.test(tags.amenity || ''))
            return 'food';
        if (/^(pharmacy|hospital|clinic)$/.test(tags.amenity || ''))
            return 'health';
        if (/^(rest_area|services)$/.test(tags.highway || ''))
            return 'rest';
        return null;
    }
    function placeAlong(els, samples) {
        var out = [], seen = {};
        els.forEach(function (e) {
            var la = e.lat != null ? e.lat : (e.center && e.center.lat), lo = e.lon != null ? e.lon : (e.center && e.center.lon), tags = e.tags || {};
            if (la == null || lo == null)
                return;
            var kind = classify(tags);
            if (!kind)
                return;
            var key = kind + ':' + la.toFixed(4) + ':' + lo.toFixed(4);
            if (seen[key])
                return;
            seen[key] = 1;
            var best = null, bd = 1e9;
            samples.forEach(function (s) { var d = hav(la, lo, s.lat, s.lon); if (d < bd) {
                bd = d;
                best = s;
            } });
            out.push({ kind: kind, name: tags['name:ar'] || tags.name || (kind === 'mosque' ? (tags.building === 'mosque' || tags.amenity ? 'مسجد' : 'مسجد') : KINDS[kind].t.replace(/^\S+\s/, '')), lat: la, lon: lo, alongKm: best ? best.km : 0, offKm: bd, named: !!(tags['name:ar'] || tags.name) });
        });
        out.sort(function (a, b) { return a.alongKm - b.alongKm; });
        return out;
    }
    function fetchPOIs(route, kinds, radius) {
        var samples = sample(route, 3), chunks = [], i, step = 60;
        if (route.len > 3000)
            return Promise.reject(new Error('long'));
        for (i = 0; i < samples.length; i += step)
            chunks.push(samples.slice(Math.max(0, i - 1), i + step));
        var all = [];
        function one(ch) {
            var q = poiQuery(ch, radius, kinds), idx = 0;
            function tryEp() {
                if (idx >= OVERPASS.length)
                    return Promise.resolve([]);
                var ep = OVERPASS[idx++];
                return fetchTimeout(ep, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 28000)
                    .then(function (r) { if (!r.ok)
                    throw new Error('http'); return r.json(); }).then(function (j) { return j.elements || []; }).catch(tryEp);
            }
            return tryEp();
        }
        return chunks.reduce(function (p, ch) { return p.then(function () { return one(ch).then(function (els) { all = all.concat(els); }); }); }, Promise.resolve()).then(function () { return placeAlong(all, samples); });
    }
    var SPEED = { car: 80, bus: 70, train: 100, plane: 700 };
    function defaultTimes(date, lat, lon) {
        var P = window.v107Prayer;
        if (!P || !P.timesFor)
            throw new Error('prayer-unavailable');
        return P.timesFor(date, { lat: lat, lon: lon, elev: 0 }, P.cfg());
    }
    function computeTrip(inp) {
        var rf = inp.routeFn || routeFor;
        return rf(inp.from, inp.to, inp.mode).then(function (rt) {
            var dist = rt.dist, speed = SPEED[inp.mode] || 80;
            var durMin = rt.drivingMin != null ? rt.drivingMin * (inp.mode === 'bus' ? 1.15 : 1) : (dist / speed * 60);
            if (inp.mode === 'plane')
                durMin += 90;
            else
                durMin *= 1.08;
            var rul = ruling(dist, inp.limit, inp.stay), plan = null, planErr = null;
            try {
                plan = planPrayers({ depart: inp.depart, durMin: durMin, route: rt.route, qasr: rul.qasr, timesAt: inp.timesAt || defaultTimes });
            }
            catch (e) {
                planErr = String(e.message || e);
            }
            var arrive = new Date(inp.depart.getTime() + durMin * 60000), q = null, dest = null;
            try {
                if (window.v107Qibla)
                    q = window.v107Qibla.bearingFrom(inp.to.lat, inp.to.lon);
            }
            catch (e) { }
            try {
                var ts = (inp.timesAt || defaultTimes)(dayStart(arrive), inp.to.lat, inp.to.lon);
                dest = { fajr: fmt(ts.fajr), dhuhr: fmt(ts.dhuhr), asr: fmt(ts.asr), maghrib: fmt(ts.maghrib), isha: fmt(ts.isha) };
            }
            catch (e) { }
            return { from: inp.from, to: inp.to, mode: inp.mode, dist: dist, straight: hav(inp.from.lat, inp.from.lon, inp.to.lat, inp.to.lon), estimated: !!rt.estimated, durMin: durMin, depart: inp.depart, arrive: arrive, route: rt.route, ruling: rul, plan: plan, planErr: planErr, qibla: q, destTimes: dest };
        });
    }
    var S = { from: null, to: null, res: null, pois: null, busy: false };
    function hm(min) { var h = Math.floor(min / 60), m = Math.round(min % 60); return (h ? h + ' ساعة ' : '') + (m || !h ? m + ' دقيقة' : ''); }
    function dtLocalValue(d) { var p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes()); }
    function build() {
        var s = $('travel');
        if (!s || s.getAttribute('data-built'))
            return;
        s.setAttribute('data-built', '1');
        var opt = LGt(K_OPT, { limit: 80, mode: 'car', stay: 3 });
        var soon = new Date(Date.now() + 30 * 60000);
        s.innerHTML = '<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>🧳 وضع السفر</h2><p>المسافة والقصر والجمع وأذكار السفر والمساجد على طريقك</p></div></div>' +
            '<div class="card" id="trForm">' +
            '<label class="mini">من</label><div style="display:flex;gap:6px"><input id="trFrom" class="field" placeholder="مثال: طرابلس" autocomplete="off" style="flex:1"><button type="button" class="primary" id="trFromGps" title="موقعي الحالي">📍</button></div><div id="trFromSug" class="mini"></div>' +
            '<label class="mini" style="margin-top:8px;display:block">إلى</label><input id="trTo" class="field" placeholder="مثال: الخمس" autocomplete="off"><div id="trToSug" class="mini"></div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">' +
            '<div><label class="mini">موعد الانطلاق</label><input id="trDepart" type="datetime-local" class="field" value="' + dtLocalValue(soon) + '"></div>' +
            '<div><label class="mini">وسيلة السفر</label><select id="trMode" class="field"><option value="car">🚗 سيارة</option><option value="bus">🚌 حافلة</option><option value="train">🚆 قطار</option><option value="plane">✈️ طائرة</option></select></div>' +
            '<div><label class="mini">مدة الإقامة في الوجهة (أيام)</label><input id="trStay" type="number" min="0" max="365" class="field" value="' + esc(opt.stay) + '"></div>' +
            '<div><label class="mini">حدّ مسافة القصر</label><select id="trLimit" class="field">' + LIMITS.map(function (l) { return '<option value="' + l.v + '">' + esc(l.t) + '</option>'; }).join('') + '</select></div>' +
            '</div>' +
            '<button type="button" class="primary" id="trGo" style="width:100%;margin-top:12px">🧮 احسب رحلتي</button><div id="trMsg" class="mini" style="margin-top:6px"></div></div>' +
            '<div id="trOut"></div>';
        $('trMode').value = opt.mode;
        $('trLimit').value = String(opt.limit);
        var trip = LGt(K_TRIP, null);
        if (trip) {
            if (trip.from) {
                S.from = trip.from;
                $('trFrom').value = trip.from.name;
            }
            if (trip.to) {
                S.to = trip.to;
                $('trTo').value = trip.to.name;
            }
        }
        bindPlace('trFrom', 'trFromSug', 'from');
        bindPlace('trTo', 'trToSug', 'to');
        $('trFromGps').onclick = function () {
            if (!navigator.geolocation) {
                msg('المتصفح لا يدعم تحديد الموقع.');
                return;
            }
            msg('⏳ جارٍ تحديد موقعك…');
            navigator.geolocation.getCurrentPosition(function (p) { S.from = { name: 'موقعي الحالي', lat: p.coords.latitude, lon: p.coords.longitude }; $('trFrom').value = 'موقعي الحالي'; $('trFromSug').innerHTML = ''; msg(''); }, function () { msg('تعذّر تحديد الموقع؛ اكتب اسم المدينة.'); }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 120000 });
        };
        $('trGo').onclick = go;
    }
    function msg(t) { var m = $('trMsg'); if (m)
        m.textContent = t || ''; }
    function bindPlace(inId, sugId, which) {
        var inp = $(inId), sug = $(sugId), tm = 0;
        function show(list, showMapsBtn) {
            sug.innerHTML = list.map(function (x, i) { return '<button type="button" class="stgBtn" data-i="' + i + '" style="margin:3px">' + esc(x.name) + (x.fuzzy ? ' ؟' : '') + '</button>'; }).join('') + (showMapsBtn ? '<button type="button" class="stgBtn" data-maps="1" style="margin:3px">🔎 بحث في الخرائط</button>' : '');
            [].forEach.call(sug.querySelectorAll('button'), function (b) {
                b.onclick = function () {
                    if (b.getAttribute('data-maps')) {
                        mapSearch();
                        return;
                    }
                    var x = list[+b.getAttribute('data-i')];
                    S[which] = { name: x.name, lat: x.lat, lon: x.lon };
                    inp.value = x.name;
                    sug.innerHTML = '';
                };
            });
        }
        function mapSearch() {
            var q = inp.value.trim();
            if (!q)
                return;
            sug.textContent = '⏳ جارٍ البحث في الخرائط…';
            geocode(q).then(function (r) { if (!r.length) {
                sug.textContent = 'لا نتائج؛ جرّب اسمًا آخر.';
                return;
            } show(r, false); }).catch(function () { sug.textContent = 'تعذّر البحث (تحقق من الإنترنت).'; });
        }
        inp.addEventListener('input', function () {
            S[which] = null;
            clearTimeout(tm);
            tm = setTimeout(function () {
                var q = inp.value;
                if (norm(q).length < 2) {
                    sug.innerHTML = '';
                    return;
                }
                var c = findCities(q);
                show(c, true);
                if (c.length === 1 && c[0].exact) {
                    S[which] = { name: c[0].name, lat: c[0].lat, lon: c[0].lon };
                }
            }, 200);
        });
    }
    function parseDepart() { var v = $('trDepart').value; var d = v ? new Date(v) : new Date(); return isNaN(d.getTime()) ? new Date() : d; }
    function resolvePlace(which) {
        if (S[which])
            return Promise.resolve(S[which]);
        var q = $(which === 'from' ? 'trFrom' : 'trTo').value;
        var c = findCities(q);
        if (c.length && c[0].exact) {
            S[which] = { name: c[0].name, lat: c[0].lat, lon: c[0].lon };
            return Promise.resolve(S[which]);
        }
        if (norm(q).length < 2)
            return Promise.resolve(null);
        return geocode(q).then(function (r) { if (r[0]) {
            S[which] = r[0];
            $(which === 'from' ? 'trFrom' : 'trTo').value = r[0].name;
            return r[0];
        } return null; }).catch(function () { return null; });
    }
    function go() {
        if (S.busy)
            return;
        S.busy = true;
        msg('⏳ جارٍ الحساب…');
        Promise.all([resolvePlace('from'), resolvePlace('to')]).then(function (pl) {
            if (!pl[0] || !pl[1]) {
                msg('حدّد مكان الانطلاق والوجهة (اختر من الاقتراحات أو اضغط «بحث في الخرائط»).');
                S.busy = false;
                return;
            }
            var opt = { limit: +$('trLimit').value, mode: $('trMode').value, stay: +$('trStay').value };
            LSt(K_OPT, opt);
            LSt(K_TRIP, { from: pl[0], to: pl[1] });
            return computeTrip({ from: pl[0], to: pl[1], depart: parseDepart(), mode: opt.mode, limit: opt.limit, stay: opt.stay }).then(function (res) { S.res = res; S.pois = null; render(); msg(''); S.busy = false; });
        }).catch(function (e) { msg('تعذّر الحساب: ' + String(e && e.message || e)); S.busy = false; });
    }
    function render() {
        var r = S.res, out = $('trOut');
        if (!r || !out)
            return;
        var modeIc = { car: '🚗', bus: '🚌', train: '🚆', plane: '✈️' }[r.mode], rl = r.ruling, h = '';
        h += '<div class="card"><h3>' + modeIc + ' ' + esc(r.from.name) + ' ← ' + esc(r.to.name) + '</h3>' +
            '<div class="mini" style="line-height:2">المسافة: <b>' + Math.round(r.dist) + ' كم</b>' + (r.estimated ? ' <span title="تقدير بخط مستقيم لتعذّر خدمة الطرق">(تقديرية)</span>' : '') +
            '<br>المدة التقريبية: <b>' + hm(r.durMin) + '</b><br>الانطلاق: <b>' + esc(fmtDT(r.depart)) + '</b> — الوصول المتوقع: <b>' + esc(fmtDT(r.arrive)) + '</b></div></div>';
        h += '<div class="card" style="border-inline-start:4px solid ' + (rl.travel ? '#1d8a5a' : '#b58a2a') + '"><h3>🕌 القصر والجمع</h3><p><b>' + esc(rl.headline) + '</b></p>' + (rl.stay ? '<p class="mini">' + esc(rl.stay) + '</p>' : '') +
            '<ul class="mini" style="padding-inline-start:18px;line-height:1.9">' + rl.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' +
            '<p class="mini">⚠️ هذه معلومات عامة والفتاوى تتفاوت؛ إن شككتَ فاسأل أهل العلم في بلدك.</p></div>';
        if (r.plan) {
            h += '<div class="card"><h3>🕋 صلواتك على الطريق</h3><div class="mini">الأوقات بتوقيت جهازك وبحسب موضعك المتوقع وقت كل صلاة.</div>' +
                r.plan.map(function (p) {
                    var st = { home: '🏠 قبل الانطلاق', road: '🛣️ على الطريق', dest: '📍 في الوجهة' }[p.state];
                    return '<div style="padding:8px 0;border-top:1px solid rgba(0,0,0,.08)"><b>' + esc(p.name) + ' — ' + esc(p.time) + '</b> <span class="mini">' + st + ' • ' + esc(fmtDay(p.dayLabel)) + '</span><div class="mini" style="line-height:1.9">' + esc(p.rec) + '</div></div>';
                }).join('') + '</div>';
        }
        else if (r.planErr) {
            h += '<div class="card mini">تعذّر حساب أوقات الصلاة على الطريق (' + esc(r.planErr) + '). افتح «مواقيت الصلاة» وحدّد موقعك أولًا.</div>';
        }
        if (r.destTimes || r.qibla) {
            h += '<div class="card"><h3>📍 في ' + esc(r.to.name) + '</h3><div class="mini" style="line-height:2">' + (r.qibla ? 'القبلة: <b>' + Math.round(r.qibla.bearing) + '°</b> من الشمال<br>' : '') +
                (r.destTimes ? 'الفجر ' + r.destTimes.fajr + ' • الظهر ' + r.destTimes.dhuhr + ' • العصر ' + r.destTimes.asr + ' • المغرب ' + r.destTimes.maghrib + ' • العشاء ' + r.destTimes.isha : '') + '</div></div>';
        }
        h += '<div class="card"><h3>🤲 أذكار السفر</h3>' + DUAS.map(function (d) { return '<div style="padding:8px 0;border-top:1px solid rgba(0,0,0,.08)"><b class="mini">' + esc(d.t) + '</b><div style="line-height:2.1;font-size:1.05em">' + esc(d.x) + '</div><div class="mini">' + esc(d.s) + '</div></div>'; }).join('') + '</div>';
        if (r.mode !== 'plane') {
            var kinds = LGt('muslim-v116-poikinds', ['mosque', 'fuel']);
            h += '<div class="card"><h3>🗺️ على طريقك</h3><div class="mini">اختر ما تريد البحث عنه حول الطريق ثم اضغط «ابحث».</div><div id="trKinds" style="margin:6px 0">' + Object.keys(KINDS).map(function (k) { return '<label style="display:inline-block;margin:3px 8px 3px 0"><input type="checkbox" data-k="' + k + '" ' + (kinds.indexOf(k) >= 0 ? 'checked' : '') + '> ' + esc(KINDS[k].t) + '</label>'; }).join('') + '</div><button type="button" class="primary" id="trPoi">🔎 ابحث على الطريق</button><div id="trPoiOut" class="mini" style="margin-top:8px"></div></div>';
        }
        var chk = LGt(K_CHK, {});
        h += '<div class="card"><h3>🎒 قائمة تجهيزات السفر</h3>' + CHECK.map(function (c, i) { return '<label style="display:block;padding:4px 0"><input type="checkbox" data-c="' + i + '" ' + (chk[i] ? 'checked' : '') + '> ' + esc(c) + '</label>'; }).join('') + '</div>';
        h += '<div class="mini" style="opacity:.75;margin:8px 0">الخرائط والأماكن: © مساهمو OpenStreetMap (ODbL) • التوجيه: OSRM • البحث: Nominatim. تُرسَل الإحداثيات لهذه الخدمات العامة عند الحساب أو البحث فقط.</div>';
        out.innerHTML = h;
        var pb = $('trPoi');
        if (pb)
            pb.onclick = searchPOIs;
        [].forEach.call(out.querySelectorAll('input[data-c]'), function (i) { i.onchange = function () { var c = LGt(K_CHK, {}); c[i.getAttribute('data-c')] = i.checked; LSt(K_CHK, c); }; });
        [].forEach.call(out.querySelectorAll('#trKinds input'), function (i) { i.onchange = function () { var ks = [].filter.call(out.querySelectorAll('#trKinds input'), function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-k'); }); LSt('muslim-v116-poikinds', ks); }; });
        try {
            out.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        catch (e) { }
    }
    function fmtDT(d) { try {
        return d.toLocaleString('ar', { weekday: 'short', hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' });
    }
    catch (e) {
        return d.toString();
    } }
    function fmtDay(d) { try {
        return d.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'short' });
    }
    catch (e) {
        return '';
    } }
    function searchPOIs() {
        var r = S.res, out = $('trPoiOut');
        if (!r || !out)
            return;
        var kinds = [].filter.call(document.querySelectorAll('#trKinds input'), function (x) { return x.checked; }).map(function (x) { return x.getAttribute('data-k'); });
        if (!kinds.length) {
            out.textContent = 'اختر نوعًا واحدًا على الأقل.';
            return;
        }
        out.textContent = '⏳ جارٍ البحث على طول الطريق (قد يستغرق دقيقة)…';
        fetchPOIs(r.route, kinds, kinds.length === 1 && kinds[0] === 'mosque' ? 2000 : 1500).then(function (list) {
            S.pois = list;
            if (!list.length) {
                out.innerHTML = 'لم نجد نتائج مسجّلة في خرائط OpenStreetMap على هذا الطريق. الخرائط تعتمد على إضافات المتطوعين وقد تكون ناقصة في بعض المناطق.';
                return;
            }
            out.innerHTML = 'وُجد <b>' + list.length + '</b> مكان — مرتبة حسب البعد عن نقطة الانطلاق:' + list.slice(0, 150).map(function (p) {
                var ic = KINDS[p.kind].t.split(' ')[0];
                return '<div style="padding:6px 0;border-top:1px solid rgba(0,0,0,.08)"><b>' + ic + ' ' + esc(p.name) + '</b><div class="mini">بعد ' + Math.round(p.alongKm) + ' كم من الانطلاق • يبعد ' + (p.offKm < 1 ? Math.round(p.offKm * 1000) + ' م' : p.offKm.toFixed(1) + ' كم') + ' عن الطريق • <a target="_blank" rel="noopener" href="https://www.openstreetmap.org/?mlat=' + p.lat + '&mlon=' + p.lon + '#map=16/' + p.lat + '/' + p.lon + '">الخريطة</a></div></div>';
            }).join('') + (list.length > 150 ? '<div class="mini">…وغيرها (أول 150).</div>' : '');
        }).catch(function (e) { out.textContent = e && e.message === 'long' ? 'الرحلة طويلة جدًا للبحث على كامل الطريق؛ قسّمها إلى مراحل.' : 'تعذّر الاتصال بخدمة الخرائط الآن. أعد المحاولة لاحقًا.'; });
    }
    function isOn() { return !!LGt(K_ON, 0); }
    function mountSettings() {
        if ($('stgcat-travel'))
            return;
        var anchor = $('stgcat-appearance');
        if (!anchor || !anchor.parentNode)
            return;
        var d = document.createElement('details');
        d.className = 'stgCat';
        d.id = 'stgcat-travel';
        d.innerHTML = '<summary><span class="ci">🧳</span>وضع السفر<span class="cs">▾</span></summary><div class="stgCatBody"><div class="stgGroup open"><label class="stgRow stgSw"><div><b>تفعيل وضع السفر</b><small>صفحة تحسب المسافة والقصر والجمع وتعرض أذكار السفر والمساجد على الطريق</small></div><input type="checkbox" id="stgTravel"></label></div></div>';
        anchor.parentNode.insertBefore(d, anchor);
        var cb = $('stgTravel');
        cb.checked = isOn();
        cb.onchange = function () { setMode(cb.checked); };
    }
    function homeTile() {
        var first = document.querySelector('#home .tile');
        if (!first || !first.parentNode)
            return;
        var t = $('travelTile');
        if (isOn()) {
            if (t)
                return;
            t = document.createElement('div');
            t.className = 'tile';
            t.id = 'travelTile';
            t.onclick = function () { openTravel(); };
            t.innerHTML = '<span class="ico">🧳</span><b>وضع السفر</b><small>القصر والجمع وأذكار السفر</small>';
            first.parentNode.insertBefore(t, first.parentNode.firstChild);
        }
        else if (t && t.parentNode)
            t.parentNode.removeChild(t);
    }
    function openTravel() { build(); if (window.show)
        window.show('travel'); }
    function setMode(on) {
        LSt(K_ON, on ? 1 : 0);
        homeTile();
        if (on) {
            openTravel();
        }
        else {
            var s = $('travel');
            if (s && s.classList.contains('active') && window.show)
                window.show('settings');
        }
    }
    function init() {
        mountSettings();
        homeTile();
        var _show = window.show;
        if (typeof _show === 'function' && !_show.__trv) {
            var w = function (id) { var r = _show.apply(this, arguments); if (id === 'travel')
                build(); if (id === 'settings' || id === 'home') {
                setTimeout(function () { mountSettings(); homeTile(); var cb = $('stgTravel'); if (cb)
                    cb.checked = isOn(); }, 50);
            } return r; };
            w.__trv = 1;
            window.show = w;
        }
    }
    window.v116Travel = { findCities: findCities, hav: hav, makeRoute: makeRoute, pointAt: pointAt, sample: sample, ruling: ruling, planPrayers: planPrayers, computeTrip: computeTrip, poiQuery: poiQuery, placeAlong: placeAlong, classify: classify, DUAS: DUAS, LIMITS: LIMITS, open: openTravel, setMode: setMode, norm: norm, routeFor: routeFor };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 600); });
    else
        setTimeout(init, 600);
})();
