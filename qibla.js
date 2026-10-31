(function () {
    'use strict';
    var $ = function (i) { return document.getElementById(i); };
    var LG = function (k, d) { try {
        var v = localStorage.getItem(k);
        return v === null ? d : JSON.parse(v);
    }
    catch (e) {
        return d;
    } };
    var LS = function (k, v) { try {
        localStorage.setItem(k, JSON.stringify(v));
    }
    catch (e) { } };
    var R = Math.PI / 180, KAABA = { lat: 21.422487, lon: 39.826206 };
    var K_OFF = 'muslim-v115-qibla-off', K_DECL = 'muslim-v112-decl';
    function norm(d) { d = d % 360; return d < 0 ? d + 360 : d; }
    function delta(a, b) { var d = norm(b - a); return d > 180 ? d - 360 : d; }
    function inverse(lat1, lon1, lat2, lon2) {
        var a = 6378137, f = 1 / 298.257223563, b = (1 - f) * a;
        var L = (lon2 - lon1) * R, U1 = Math.atan((1 - f) * Math.tan(lat1 * R)), U2 = Math.atan((1 - f) * Math.tan(lat2 * R));
        var sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2), lam = L, it = 0, sl, cl, ss, cs, sig, sa, c2a, c2sm, C;
        do {
            sl = Math.sin(lam);
            cl = Math.cos(lam);
            ss = Math.sqrt((cU2 * sl) * (cU2 * sl) + (cU1 * sU2 - sU1 * cU2 * cl) * (cU1 * sU2 - sU1 * cU2 * cl));
            if (ss === 0)
                return { bearing: 0, dist: 0 };
            cs = sU1 * sU2 + cU1 * cU2 * cl;
            sig = Math.atan2(ss, cs);
            sa = cU1 * cU2 * sl / ss;
            c2a = 1 - sa * sa;
            c2sm = c2a ? cs - 2 * sU1 * sU2 / c2a : 0;
            C = f / 16 * c2a * (4 + f * (4 - 3 * c2a));
            var lp = lam;
            lam = L + (1 - C) * f * sa * (sig + C * ss * (c2sm + C * cs * (-1 + 2 * c2sm * c2sm)));
            if (Math.abs(lam - lp) < 1e-12)
                break;
        } while (++it < 100);
        if (it >= 100)
            return sphere(lat1, lon1, lat2, lon2);
        var u2 = c2a * (a * a - b * b) / (b * b), A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))), B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
        var ds = B * ss * (c2sm + B / 4 * (cs * (-1 + 2 * c2sm * c2sm) - B / 6 * c2sm * (-3 + 4 * ss * ss) * (-3 + 4 * c2sm * c2sm)));
        var s = b * A * (sig - ds);
        var az = Math.atan2(cU2 * sl, cU1 * sU2 - sU1 * cU2 * cl) / R;
        return { bearing: norm(az), dist: s / 1000 };
    }
    function sphere(la1, lo1, la2, lo2) {
        var y = Math.sin((lo2 - lo1) * R) * Math.cos(la2 * R), x = Math.cos(la1 * R) * Math.sin(la2 * R) - Math.sin(la1 * R) * Math.cos(la2 * R) * Math.cos((lo2 - lo1) * R);
        var d = Math.acos(Math.min(1, Math.sin(la1 * R) * Math.sin(la2 * R) + Math.cos(la1 * R) * Math.cos(la2 * R) * Math.cos((lo2 - lo1) * R)));
        return { bearing: norm(Math.atan2(y, x) / R), dist: d * 6371.0088 };
    }
    function qiblaFrom(lat, lon) { return inverse(lat, lon, KAABA.lat, KAABA.lon); }
    function mul(A, B) { var C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            for (var k = 0; k < 3; k++)
                C[i][j] += A[i][k] * B[k][j]; return C; }
    function rot(alpha, beta, gamma) {
        var a = alpha * R, b = beta * R, g = gamma * R, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cg = Math.cos(g), sg = Math.sin(g);
        return mul(mul([[ca, -sa, 0], [sa, ca, 0], [0, 0, 1]], [[1, 0, 0], [0, cb, -sb], [0, sb, cb]]), [[cg, 0, sg], [0, 1, 0], [-sg, 0, cg]]);
    }
    function blendHeading(eu, ez, cam) {
        var x, y, m, w;
        if (cam) {
            m = Math.hypot(ez[0], ez[1]);
            w = Math.max(0, Math.min(1, (0.5 - m) / 0.5));
            x = ez[0] + w * eu[0];
            y = ez[1] + w * eu[1];
        }
        else {
            m = Math.hypot(eu[0], eu[1]);
            w = Math.max(0, Math.min(1, (0.5 - m) / 0.5));
            x = eu[0] + w * ez[0];
            y = eu[1] + w * ez[1];
        }
        if (Math.hypot(x, y) < 0.05)
            return null;
        return norm(Math.atan2(x, y) / R);
    }
    function headingFromEuler(alpha, beta, gamma, screenAngle, cam) {
        var M = rot(alpha, beta, gamma), ang = ((screenAngle % 360) + 360) % 360;
        var u = ang === 90 ? [1, 0, 0] : ang === 180 ? [0, -1, 0] : ang === 270 ? [-1, 0, 0] : [0, 1, 0];
        var eu = [M[0][0] * u[0] + M[0][1] * u[1] + M[0][2] * u[2], M[1][0] * u[0] + M[1][1] * u[1] + M[1][2] * u[2]];
        var ez = [-M[0][2], -M[1][2]];
        return blendHeading(eu, ez, cam);
    }
    function screenAngle() {
        try {
            if (screen.orientation && typeof screen.orientation.angle === 'number')
                return screen.orientation.angle;
        }
        catch (e) { }
        return typeof window.orientation === 'number' ? norm(window.orientation) : 0;
    }
    var CARD = ['شمال', 'شمال شمال شرق', 'شمال شرق', 'شرق شمال شرق', 'شرق', 'شرق جنوب شرق', 'جنوب شرق', 'جنوب جنوب شرق', 'جنوب', 'جنوب جنوب غرب', 'جنوب غرب', 'غرب جنوب غرب', 'غرب', 'غرب شمال غرب', 'شمال غرب', 'شمال شمال غرب'];
    function cardinal(b) { return CARD[Math.round(norm(b) / 22.5) % 16]; }
    function headingFromQuat(q, cam) {
        var x = q[0], y = q[1], z = q[2], w = q[3];
        return blendHeading([2 * (x * y - z * w), 1 - 2 * (x * x + z * z)], [-2 * (x * z + y * w), -2 * (y * z - x * w)], cam);
    }
    var decl = null, declSrc = '';
    async function loadDecl(lat, lon) {
        var key = Math.round(lat * 2) / 2 + ',' + Math.round(lon * 2) / 2, month = new Date().toISOString().slice(0, 7), c = LG(K_DECL, null);
        if (c && c.key === key && c.month === month && isFinite(c.v)) {
            decl = c.v;
            declSrc = 'WMM';
            return;
        }
        try {
            var m = await import('https://cdn.jsdelivr.net/npm/geomagnetism@0.2.0/+esm');
            var g = m.default || m;
            var model = g.model(new Date(), { allowOutOfBoundsModel: true });
            var info = model.point([lat, lon]);
            if (info && isFinite(info.decl)) {
                decl = info.decl;
                declSrc = 'WMM';
                LS(K_DECL, { key: key, month: month, v: decl });
            }
        }
        catch (e) {
            if (c && isFinite(c.v) && c.key === key) {
                decl = c.v;
                declSrc = 'WMM (محفوظ)';
            }
        }
    }
    function sunAz(lat, lon, date) {
        var jd = date.getTime() / 86400000 + 2440587.5, n = jd - 2451545.0, L = (280.460 + 0.9856474 * n) % 360, g = ((357.528 + 0.9856003 * n) % 360) * R;
        var lam = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * R, eps = (23.439 - 0.0000004 * n) * R;
        var ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam)), dec = Math.asin(Math.sin(eps) * Math.sin(lam));
        var gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360, H = ((gmst + lon) * R - ra);
        var alt = Math.asin(Math.sin(lat * R) * Math.sin(dec) + Math.cos(lat * R) * Math.cos(dec) * Math.cos(H));
        var az = Math.atan2(-Math.sin(H) * Math.cos(dec), Math.cos(lat * R) * Math.sin(dec) - Math.sin(lat * R) * Math.cos(dec) * Math.cos(H));
        return { az: norm(az / R), alt: alt / R };
    }
    var S = { loc: null, bearing: null, dist: null, raw: null, smooth: null, camSmooth: null, src: '', acc: null, running: false, off: LG(K_OFF, 0), tol: 3, locked: false, evts: 0, hist: [], jit: 0, tilt: 0, noSensor: false, gen: null };
    function trueHeading(cam) {
        var v = cam ? S.camSmooth : S.smooth;
        if (v == null)
            return null;
        var d = (decl != null) ? decl : 0;
        return norm(v + d + S.off);
    }
    function smoothTo(prev, h) { if (prev == null)
        return h; var d = delta(prev, h); return norm(prev + d * (Math.abs(d) > 25 ? 0.5 : 0.14)); }
    function onOrient(e) {
        var h = null, hc = null, sa = screenAngle();
        if (typeof e.webkitCompassHeading === 'number' && isFinite(e.webkitCompassHeading)) {
            h = norm(e.webkitCompassHeading + sa);
            hc = h;
            S.src = 'iOS';
            S.acc = e.webkitCompassAccuracy;
        }
        else if (e.absolute === true || e.type === 'deviceorientationabsolute') {
            if (e.alpha == null || e.beta == null || e.gamma == null)
                return;
            h = headingFromEuler(e.alpha, e.beta, e.gamma, sa, false);
            hc = headingFromEuler(e.alpha, e.beta, e.gamma, sa, true);
            S.src = 'Android';
        }
        else
            return;
        if (h != null) {
            S.raw = h;
            S.smooth = smoothTo(S.smooth, h);
            S.evts++;
            S.noSensor = false;
            track(h);
        }
        if (hc != null)
            S.camSmooth = smoothTo(S.camSmooth, hc);
        if (typeof e.beta === 'number' && typeof e.gamma === 'number')
            S.tilt = Math.max(Math.abs(e.beta), Math.abs(e.gamma));
    }
    function track(h) {
        S.hist.push(h);
        if (S.hist.length > 20)
            S.hist.shift();
        if (S.hist.length < 8)
            return;
        var sx = 0, sy = 0;
        S.hist.forEach(function (v) { sx += Math.cos(v * R); sy += Math.sin(v * R); });
        var r = Math.hypot(sx, sy) / S.hist.length;
        S.jit = Math.sqrt(Math.max(0, -2 * Math.log(Math.max(r, 1e-6)))) / R;
    }
    function startGeneric() {
        if (S.gen || !('AbsoluteOrientationSensor' in window))
            return;
        try {
            var s = new window.AbsoluteOrientationSensor({ frequency: 30, referenceFrame: 'screen' });
            s.addEventListener('reading', function () {
                var q = s.quaternion;
                if (!q)
                    return;
                var h = headingFromQuat(q, false), hc = headingFromQuat(q, true);
                if (h != null) {
                    S.src = 'Android (Sensor API)';
                    S.raw = h;
                    S.smooth = smoothTo(S.smooth, h);
                    S.evts++;
                    S.noSensor = false;
                    track(h);
                }
                if (hc != null)
                    S.camSmooth = smoothTo(S.camSmooth, hc);
            });
            s.addEventListener('error', function () { });
            s.start();
            S.gen = s;
        }
        catch (e) { }
    }
    function listen() {
        if (S.running)
            return;
        window.addEventListener('deviceorientationabsolute', onOrient, true);
        window.addEventListener('deviceorientation', onOrient, true);
        S.running = true;
        setTimeout(function () { if (!S.evts)
            startGeneric(); }, 1500);
        setTimeout(function () { if (!S.evts) {
            S.noSensor = true;
            say('هذا الجهاز لا يوفّر بوصلة (شائع في الكمبيوتر). يوضّح السهم اتجاه القبلة بالنسبة للشمال الثابت.');
        } }, 4000);
    }
    async function startSensors() {
        var D = window.DeviceOrientationEvent;
        if (D && typeof D.requestPermission === 'function') {
            try {
                var p = await D.requestPermission();
                if (p !== 'granted') {
                    say('لم يُسمح بحساس الاتجاه. فعّله من إعدادات المتصفح ثم أعد المحاولة.');
                    return false;
                }
            }
            catch (e) {
                say('تعذّر طلب إذن البوصلة.');
                return false;
            }
        }
        listen();
        return true;
    }
    function getPos() {
        function once(opt) {
            return new Promise(function (res) {
                if (!navigator.geolocation) {
                    res(null);
                    return;
                }
                navigator.geolocation.getCurrentPosition(function (p) { res({ lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, alt: p.coords.altitude }); }, function () { res(null); }, opt);
            });
        }
        return once({ enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }).then(function (p) { return p || once({ enableHighAccuracy: false, timeout: 9000, maximumAge: 600000 }); });
    }
    async function locate() {
        say('📍 جارٍ تحديد موقعك بدقة…');
        var p = await getPos();
        if (!p) {
            var sv = window.v107Prayer && window.v107Prayer.getLoc && window.v107Prayer.getLoc();
            if (sv)
                p = { lat: sv.lat, lon: sv.lon, acc: sv.acc };
        }
        if (!p) {
            say('تعذّر تحديد الموقع. فعّل GPS وأذن للموقع ثم أعد المحاولة.');
            return false;
        }
        S.loc = p;
        var q = qiblaFrom(p.lat, p.lon);
        S.bearing = q.bearing;
        S.dist = q.dist;
        loadDecl(p.lat, p.lon).then(info);
        info();
        return true;
    }
    function say(t) { var e = $('qbText'); if (e)
        e.textContent = t; }
    function build() {
        var s = $('qibla');
        if (!s || s.dataset.v112)
            return;
        s.dataset.v112 = '1';
        s.innerHTML = '<div class="section"><button class="back" onclick="show(\'home\')">←</button><div><h2>🧭 القبلة</h2><p>السهم يتحرك نحو القبلة بدقة — بتصحيح الانحراف المغناطيسي</p></div></div>' +
            '<div class="card qbCard"><div class="qbStage"><i class="qbTick t0"></i><i class="qbTick t1"></i><i class="qbTick t2"></i><i class="qbTick t3"></i><span class="qbNorth" id="qbNorth" title="الشمال">N</span>' +
            '<div class="qbArrow" id="qbArrow" aria-label="سهم القبلة"><svg viewBox="0 0 100 200" width="100%" height="100%"><defs><linearGradient id="qbg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--green)"/><stop offset="1" stop-color="var(--green2,var(--green))"/></linearGradient></defs><path d="M50 4 L88 70 L60 70 L60 190 L40 190 L40 70 L12 70 Z" fill="url(#qbg)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg><span class="qbTip">🕋</span></div><span class="qbHub"></span></div>' +
            '<div class="qbReadout"><b id="qbText">اضغط «تشغيل البوصلة»</b><span id="qbSub" class="mini"></span></div>' +
            '<div class="controls" style="flex-wrap:wrap"><button class="primary" id="qbStart">🧭 تشغيل البوصلة</button><button id="qbCamBtn">📷 القبلة بالكاميرا</button><button id="qbLoc">📍 تحديث موقعي</button></div>' +
            '<div id="qbInfo" class="qbInfo mini"></div></div>' +
            '<div class="card"><b>🎯 معايرة الدقة</b><p class="mini">إن شعرتَ أن السهم لا يطابق القبلة، عايِر مرة واحدة فتُحفظ:</p>' +
            '<div class="controls" style="flex-wrap:wrap"><button id="qbKnown">🕌 أنا أواجه قبلة معروفة (محراب)</button><button id="qbSun">☀️ معايرة بالشمس</button><button id="qbReset">↺ إلغاء المعايرة</button></div>' +
            '<div id="qbCalNote" class="mini" style="margin-top:6px"></div></div>' +
            '<div class="card mini">للدقة: ابتعد عن الحديد والمغانط والسماعات، وحرّك الهاتف بشكل «8» في الهواء لمعايرة الحساس. الانحراف المغناطيسي يُحسب من نموذج WMM تلقائيًا.<br><button class="qbLink" id="qbMap">🗺️ فتح اتجاه الكعبة على الخريطة</button></div>';
        $('qbStart').onclick = async function () { if (!S.loc)
            await locate(); var ok = await startSensors(); if (ok) {
            say('حرّك الهاتف ببطء…');
            tick();
        } };
        $('qbCamBtn').onclick = openCam;
        $('qbLoc').onclick = locate;
        $('qbKnown').onclick = calKnown;
        $('qbSun').onclick = calSun;
        $('qbReset').onclick = function () { S.off = 0; LS(K_OFF, 0); note('أُلغيت المعايرة.'); info(); };
        $('qbMap').onclick = function () { var p = S.loc; window.open('https://www.google.com/maps/dir/?api=1&' + (p ? 'origin=' + p.lat + ',' + p.lon + '&' : '') + 'destination=' + KAABA.lat + ',' + KAABA.lon, '_blank', 'noopener'); };
        note();
        setInterval(function () { if (S.loc && $('qibla') && $('qibla').classList.contains('active'))
            info(); }, 60000);
    }
    function note(t) { var e = $('qbCalNote'); if (e)
        e.textContent = t || (S.off ? 'معايرة محفوظة: ' + (S.off > 0 ? '+' : '') + S.off.toFixed(1) + '°' : ''); }
    function info() {
        var e = $('qbInfo');
        if (!e)
            return;
        var p = S.loc;
        if (!p) {
            e.textContent = 'الموقع غير محدد بعد.';
            return;
        }
        e.innerHTML = 'الموقع: ' + p.lat.toFixed(5) + '، ' + p.lon.toFixed(5) + (p.acc ? ' (±' + Math.round(p.acc) + ' م)' : '') +
            '<br>اتجاه القبلة (من الشمال الحقيقي): <b>' + S.bearing.toFixed(1) + '°</b> • المسافة إلى الكعبة: <b>' + Math.round(S.dist).toLocaleString('ar') + ' كم</b>' +
            '<br>الجهة: <b>' + cardinal(S.bearing) + '</b> (الزاوية مقاسة مع عقارب الساعة من الشمال)' +
            '<br>الانحراف المغناطيسي: <b>' + (decl == null ? 'غير متاح (استخدم المعايرة)' : (decl >= 0 ? '+' : '') + decl.toFixed(1) + '° ' + declSrc) + '</b>' + (S.src ? ' • الحساس: ' + S.src : '') + sunHint();
    }
    function sunHint() {
        try {
            var p = S.loc;
            if (!p || S.bearing == null)
                return '';
            var s = sunAz(p.lat, p.lon, new Date());
            if (s.alt < 3)
                return '<br>☀️ الشمس تحت الأفق الآن — يعمل التحقق بالشمس نهارًا.';
            var rel = delta(s.az, S.bearing), ar = Math.round(Math.abs(rel));
            return '<br>☀️ <b>تحقق بالشمس:</b> الشمس الآن في اتجاه ' + Math.round(s.az) + '° (' + cardinal(s.az) + '). إن واجهتَ الشمس فالقبلة ' + (ar <= 2 ? '<b>في اتجاه الشمس تقريبًا</b>' : (ar >= 178 ? '<b>عكس الشمس تقريبًا</b>' : 'على <b>' + (rel > 0 ? 'يمينك' : 'يسارك') + '</b> بزاوية ' + ar + '°')) + '.';
        }
        catch (e) {
            return '';
        }
    }
    var lastBuzz = 0, raf = 0;
    function tick() {
        cancelAnimationFrame(raf);
        var th = trueHeading(false), arrow = $('qbArrow');
        if (arrow && th == null && S.noSensor && S.bearing != null) {
            arrow.style.transform = 'rotate(' + S.bearing + 'deg)';
            var n0 = $('qbNorth');
            if (n0)
                n0.style.transform = 'translateY(calc(var(--qbR) * -1))';
            var tp = arrow.querySelector('.qbTip');
            if (tp)
                tp.style.transform = 'translateX(-50%) rotate(' + (-S.bearing) + 'deg)';
            var t0 = $('qbText'), sb0 = $('qbSub');
            if (t0)
                t0.textContent = 'القبلة ' + Math.round(S.bearing) + '° من الشمال (' + cardinal(S.bearing) + ')';
            if (sb0)
                sb0.textContent = 'الشمال للأعلى. حدّد الشمال بخريطة أو بوصلة حقيقية، أو تحقّق بالشمس أدناه.';
        }
        if (arrow && th != null && S.bearing != null) {
            var d = delta(th, S.bearing), ad = Math.abs(d), st = $('qbText'), stage = document.querySelector('.qbStage');
            arrow.style.transform = 'rotate(' + d + 'deg)';
            var nn = $('qbNorth');
            if (nn)
                nn.style.transform = 'rotate(' + (-th) + 'deg) translateY(calc(var(--qbR) * -1))';
            var tip = arrow.querySelector('.qbTip');
            if (tip)
                tip.style.transform = 'translateX(-50%) rotate(' + (-d) + 'deg)';
            var ok = ad <= S.tol;
            stage.classList.toggle('on', ok);
            st.textContent = ok ? '✅ أنت تواجه القبلة' : (d > 0 ? 'دُر يمينًا ' : 'دُر يسارًا ') + Math.round(ad) + '°';
            var sub = $('qbSub'), warn = (S.acc != null && S.acc > 25) ? ' ⚠️ البوصلة تحتاج معايرة: حرّكها بشكل 8' : '';
            if (S.jit > 12)
                warn += ' ⚠️ القراءة غير مستقرة (ابتعد عن المعادن والمغانط وحرّك الهاتف بشكل 8)';
            if (S.src !== 'iOS' && S.tilt > 50)
                warn += ' ⚠️ أمسك الهاتف أفقيًا للدقة';
            if (Math.abs(S.off) > 25)
                warn += ' ⚠️ معايرتك كبيرة (' + S.off.toFixed(0) + '°)، اضغط «إلغاء المعايرة» إن كانت قديمة';
            if (sub)
                sub.textContent = 'اتجاه الهاتف: ' + Math.round(th) + '° • اتجاه القبلة: ' + Math.round(S.bearing) + '°' + warn;
            if (ok && Date.now() - lastBuzz > 4000) {
                lastBuzz = Date.now();
                try {
                    navigator.vibrate && navigator.vibrate(60);
                }
                catch (e) { }
            }
        }
        if (($('qibla') && $('qibla').classList.contains('active')) || camOn)
            raf = requestAnimationFrame(tick);
    }
    var camOn = false, camStream = null;
    async function openCam() {
        if (!S.loc && !(await locate()))
            return;
        var ok = await startSensors();
        if (!ok)
            return;
        var ov = $('qbCam');
        if (!ov) {
            ov = document.createElement('div');
            ov.id = 'qbCam';
            ov.innerHTML = '<video id="qbVid" playsinline muted autoplay></video><div class="qbCamTop"><b id="qbCamTxt">وجّه الكاميرا أمامك</b><button id="qbCamX" aria-label="إغلاق">✕</button></div>' +
                '<div class="qbCamGuide"></div><div class="qbCamMark" id="qbCamMark"><span>🕋</span><i></i></div><div class="qbCamArrow" id="qbCamArrow">➤</div><div class="qbCamBot" id="qbCamBot"></div>';
            document.body.appendChild(ov);
            $('qbCamX').onclick = closeCam;
        }
        ov.classList.add('show');
        document.body.classList.add('qbCamOpen');
        camOn = true;
        try {
            camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
            var v = $('qbVid');
            v.srcObject = camStream;
            await v.play().catch(function () { });
            ov.classList.remove('nocam');
        }
        catch (e) {
            ov.classList.add('nocam');
            $('qbCamBot').textContent = 'الكاميرا غير متاحة — يعمل السهم بدون خلفية. اسمح بالكاميرا من إعدادات المتصفح.';
        }
        camLoop();
    }
    function closeCam() {
        camOn = false;
        document.body.classList.remove('qbCamOpen');
        var ov = $('qbCam');
        if (ov)
            ov.classList.remove('show');
        try {
            camStream && camStream.getTracks().forEach(function (t) { t.stop(); });
        }
        catch (e) { }
        camStream = null;
    }
    function camLoop() {
        if (!camOn)
            return;
        var th = trueHeading(true), mark = $('qbCamMark'), ar = $('qbCamArrow'), tx = $('qbCamTxt');
        if (th != null && S.bearing != null) {
            var d = delta(th, S.bearing), ad = Math.abs(d), HF = 62;
            var vis = ad < HF / 2;
            mark.style.display = vis ? 'flex' : 'none';
            if (vis)
                mark.style.left = (50 + d / HF * 100) + '%';
            ar.style.display = vis ? 'none' : 'block';
            ar.style.transform = 'translate(-50%,-50%) rotate(' + (d > 0 ? 0 : 180) + 'deg)';
            ar.style.left = d > 0 ? '88%' : '12%';
            var ok = ad <= S.tol;
            document.getElementById('qbCam').classList.toggle('on', ok);
            tx.textContent = ok ? '✅ هذا اتجاه القبلة' : (d > 0 ? '↻ أدر الهاتف يمينًا ' : '↺ أدر الهاتف يسارًا ') + Math.round(ad) + '°';
            if (ok && Date.now() - lastBuzz > 4000) {
                lastBuzz = Date.now();
                try {
                    navigator.vibrate && navigator.vibrate([120, 50, 120]);
                }
                catch (e) { }
            }
            $('qbCamBot').textContent = 'اتجاه الكاميرا ' + Math.round(th) + '° • القبلة ' + Math.round(S.bearing) + '°' + (decl != null ? ' • انحراف ' + (decl >= 0 ? '+' : '') + decl.toFixed(1) + '°' : '');
        }
        requestAnimationFrame(camLoop);
    }
    function calKnown() {
        if (S.smooth == null || S.bearing == null) {
            note('شغّل البوصلة وحدّد موقعك أولًا.');
            return;
        }
        var off = delta(norm(S.smooth + (decl || 0)), S.bearing);
        S.off = Math.max(-60, Math.min(60, off));
        LS(K_OFF, S.off);
        note('✅ عُدّل الاتجاه بمقدار ' + S.off.toFixed(1) + '° اعتمادًا على القبلة التي تواجهها.');
    }
    function calSun() {
        if (S.smooth == null || !S.loc) {
            note('شغّل البوصلة وحدّد موقعك أولًا.');
            return;
        }
        var s = sunAz(S.loc.lat, S.loc.lon, new Date());
        if (s.alt < 5) {
            note('الشمس منخفضة أو تحت الأفق الآن؛ جرّب نهارًا.');
            return;
        }
        if (s.alt > 75) {
            note('الشمس شبه عمودية فلا تصلح للمعايرة؛ جرّب صباحًا أو عصرًا.');
            return;
        }
        if (!confirm('وجّه أعلى الهاتف نحو الشمس بدقة (دون النظر إليها مباشرة؛ استعمل ظلّ إصبعك على الهاتف الأفقي ليتساوى طرفاه)، ثم اضغط موافق.'))
            return;
        var off = delta(norm(S.smooth + (decl || 0)), s.az);
        S.off = Math.max(-60, Math.min(60, off));
        LS(K_OFF, S.off);
        note('✅ عُدّل الاتجاه بمقدار ' + S.off.toFixed(1) + '° بالاعتماد على اتجاه الشمس (' + s.az.toFixed(1) + '°).');
    }
    window.locateQibla = async function () { build(); show('qibla'); if (!S.loc)
        await locate(); var ok = await startSensors(); if (ok)
        tick(); };
    window.enableCompass = startSensors;
    window.openQiblaMap = function () { var b = $('qbMap'); if (b)
        b.click(); };
    window.v107Qibla = { openCam: openCam, closeCam: closeCam, bearingFrom: qiblaFrom, headingFromEuler: headingFromEuler, headingFromQuat: headingFromQuat, sunAz: sunAz, cardinal: cardinal, onOrient: onOrient, tick: tick, state: S };
    var _show = window.show;
    window.show = function (id) { if (id !== 'qibla' && camOn)
        closeCam(); var r = _show.apply(this, arguments); if (id === 'qibla') {
        build();
        if (!S.loc)
            locate();
        tick();
    } return r; };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', build);
    else
        build();
})();
