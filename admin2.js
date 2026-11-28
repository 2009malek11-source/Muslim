/* مراكز الإدارة المتقدمة: الزوار، رحلة الزائر، المهام، المصادر، المطوّر، التنبيهات، الصيانة، البلاغات، الاقتراحات.
   لا أسرار هنا. كل بناء الواجهة بـ textContent. يُحمَّل قبل admin.js ويسجّل تبويباته فقط. */
(function () {
    'use strict';
    var SECN = { home: 'الرئيسية', mushaf107: 'المصحف', quran: 'القرآن', readers: 'القراء', adhkar: 'الأذكار', khatmah: 'الختمة', ruqyah: 'الرقية', hadith107: 'الأحاديث', stories: 'السيرة والأنبياء', children: 'الأطفال', qibla: 'القبلة', mosques: 'المساجد', settings: 'الإعدادات', repeatAyah: 'تكرار الآيات', prayer: 'مواقيت الصلاة', exit: 'خروج من الموقع' };
    var DEVN = { mobile: 'جوال', tablet: 'لوحي', desktop: 'حاسوب', tv: 'تلفاز', other: 'أخرى' };
    var sn = function (k) { return SECN[k] || k || '—'; };
    function iso(d) { return d ? new Date(d).toISOString() : null; }
    function cname(cc) { if (!cc || cc === 'ZZ') return 'غير معروف'; try { return new Intl.DisplayNames(['ar'], { type: 'region' }).of(cc) || cc; } catch (e) { return cc; } }
    function dt(t) { return t ? new Date(t).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }) : '—'; }
    function tbl(h, heads, rows) { var t = h('table'); t.appendChild(h('tr', null, heads.map(function (x) { return h('th', { text: x }); }))); rows.forEach(function (r) { t.appendChild(h('tr', null, r.map(function (c) { return h('td', null, [c == null ? '' : (typeof c === 'object' ? c : String(c))]); }))); }); var w = h('div', { cls: 'ovx' }); w.appendChild(t); return w; }
    function sel(h, opts, val, fn) { var s = h('select', null, opts.map(function (o) { var p = h('option', { value: o[0], text: o[1] }); if (String(o[0]) === String(val)) p.selected = true; return p; })); if (fn) s.addEventListener('change', function () { fn(s.value); }); return s; }
    var tag = function (h, t, c) { return h('span', { cls: 'tag ' + (c || ''), text: t }); };

    /* ============ خريطة العالم ============ */
    var topo = null;
    function loadTopo() { if (topo) return Promise.resolve(topo); return fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json', { cache: 'force-cache', credentials: 'omit' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { topo = j; return j; }); }
    function decode(t, objName) {
        var tr = t.transform || { scale: [1, 1], translate: [0, 0] }, arcs = t.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (p) { x += p[0]; y += p[1]; return [x * tr.scale[0] + tr.translate[0], y * tr.scale[1] + tr.translate[1]]; }); });
        function ring(ix) { var pts = []; ix.forEach(function (i) { var a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; a.forEach(function (p, k) { if (k || !pts.length) pts.push(p); }); }); return pts; }
        return t.objects[objName].geometries.map(function (g) { var polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []; return { name: (g.properties || {}).name, rings: [].concat.apply([], polys.map(function (p) { return p.map(ring); })) }; });
    }
    var ALIAS = { 'United States of America': 'US', 'Russia': 'RU', 'Czechia': 'CZ', 'Dem. Rep. Congo': 'CD', 'Congo': 'CG', 'Dominican Rep.': 'DO', 'Bosnia and Herz.': 'BA', 'Central African Rep.': 'CF', 'Eq. Guinea': 'GQ', 'eSwatini': 'SZ', 'S. Sudan': 'SS', 'W. Sahara': 'EH', "Côte d'Ivoire": 'CI', 'Solomon Is.': 'SB', 'Falkland Is.': 'FK', 'North Macedonia': 'MK', 'Palestine': 'PS', 'Myanmar': 'MM', 'Fr. S. Antarctic Lands': 'TF', 'Timor-Leste': 'TL', 'Turkey': 'TR', 'Syria': 'SY', 'Iran': 'IR', 'South Korea': 'KR', 'North Korea': 'KP', 'Laos': 'LA', 'Vietnam': 'VN', 'Tanzania': 'TZ', 'Moldova': 'MD', 'Bolivia': 'BO', 'Venezuela': 'VE', 'Brunei': 'BN', 'Kosovo': 'XK', 'Somaliland': 'SO', 'N. Cyprus': 'CY' };
    var nameMap = null;
    function names() { if (nameMap) return nameMap; nameMap = {}; try { var dn = new Intl.DisplayNames(['en'], { type: 'region' }), A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; for (var i = 0; i < 26; i++) for (var j = 0; j < 26; j++) { var c = A[i] + A[j], n = dn.of(c); if (n && n !== c) nameMap[n] = c; } } catch (e) { } Object.keys(ALIAS).forEach(function (k) { nameMap[k] = ALIAS[k]; }); return nameMap; }
    function mapView(h, counts, onPick) {
        var wrap = h('div', { cls: 'mapw' }), tip = h('div', { cls: 'mut', text: 'جارٍ تحميل الخريطة…' });
        wrap.appendChild(tip);
        loadTopo().then(function (t) {
            var key = Object.keys(t.objects).indexOf('countries') > -1 ? 'countries' : Object.keys(t.objects)[0], geo = decode(t, key), NS = 'http://www.w3.org/2000/svg', nm = names();
            var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 360 180'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'خريطة توزّع الزوار'); svg.setAttribute('class', 'map');
            var mx = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; }).concat(1));
            geo.forEach(function (g) {
                var cc = nm[g.name] || '', n = counts[cc] || 0, p = document.createElementNS(NS, 'path');
                p.setAttribute('d', g.rings.map(function (r) { return 'M' + r.map(function (q) { return (q[0] + 180).toFixed(1) + ',' + (90 - q[1]).toFixed(1); }).join('L') + 'Z'; }).join(''));
                p.setAttribute('class', 'ctry' + (n ? ' has' : '')); if (n) p.style.fillOpacity = String(0.35 + 0.65 * n / mx);
                var ti = document.createElementNS(NS, 'title'); ti.textContent = cname(cc) + (n ? ' — ' + n + ' زائر' : ''); p.appendChild(ti);
                if (n) p.addEventListener('click', function () { onPick(cc); });
                svg.appendChild(p);
            });
            var vb = [0, 0, 360, 180];
            function setvb() { svg.setAttribute('viewBox', vb.join(' ')); }
            function zoom(f) { var cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2; vb[2] = Math.min(360, Math.max(30, vb[2] * f)); vb[3] = vb[2] / 2; vb[0] = Math.max(0, Math.min(360 - vb[2], cx - vb[2] / 2)); vb[1] = Math.max(0, Math.min(180 - vb[3], cy - vb[3] / 2)); setvb(); }
            var drag = null; svg.addEventListener('pointerdown', function (e) { drag = [e.clientX, e.clientY, vb[0], vb[1]]; }); window.addEventListener('pointerup', function () { drag = null; });
            svg.addEventListener('pointermove', function (e) { if (!drag || vb[2] >= 360) return; var r = svg.getBoundingClientRect(), k = vb[2] / r.width; vb[0] = Math.max(0, Math.min(360 - vb[2], drag[2] - (e.clientX - drag[0]) * k)); vb[1] = Math.max(0, Math.min(180 - vb[3], drag[3] - (e.clientY - drag[1]) * k)); setvb(); });
            var ctl = h('div', { cls: 'row' }, [h('button', { cls: 'btn alt sm', type: 'button', text: '＋ تكبير', onclick: function () { zoom(0.6); } }), h('button', { cls: 'btn alt sm', type: 'button', text: '－ تصغير', onclick: function () { zoom(1.6); } }), h('button', { cls: 'btn alt sm', type: 'button', text: 'إعادة', onclick: function () { vb = [0, 0, 360, 180]; setvb(); } })]);
            wrap.textContent = ''; wrap.appendChild(svg); wrap.appendChild(ctl); wrap.appendChild(h('div', { cls: 'mut', text: 'اضغط على دولة ملوّنة لتصفية الجدول. الموقع تقريبي من عنوان الاتصال (دولة ومدينة فقط).' }));
        }).catch(function () { wrap.textContent = ''; wrap.appendChild(h('div', { cls: 'mut', text: 'تعذّر تحميل الخريطة (تحتاج اتصالًا بـ cdn.jsdelivr.net). القائمة أدناه تعمل بدونها.' })); });
        return wrap;
    }

    /* ============ الزوار ============ */
    function visitors(A) {
        var h = A.h, F = { cc: '', dev: '', st: '', q: '' };
        var out = h('div'), body = h('div'), chartBox = h('div');
        A.rest('stats_daily?select=day,value&metric=eq.visits&order=day.desc&limit=14').then(function (z) { z = (z || []).reverse(); chartBox.appendChild(z.length ? chart(h, z.map(function (x) { return { l: x.day.slice(5), v: +x.value }; }), 'الزيارات اليومية') : h('div', { cls: 'mut', text: 'لا بيانات بعد' })); }).catch(function () { });
        function load() {
            var q = 'visitors?select=*&order=last_seen.desc&limit=200';
            if (F.cc) q += '&country=eq.' + encodeURIComponent(F.cc); if (F.dev) q += '&device=eq.' + encodeURIComponent(F.dev);
            if (F.st === 'on') q += '&last_seen=gte.' + iso(Date.now() - 180000); if (F.st === 'off') q += '&last_seen=lt.' + iso(Date.now() - 180000);
            return A.rest(q);
        }
        return Promise.all([A.rpc('admin_visitor_summary'), load()]).then(function (r) {
            var S = r[0], rows = r[1] || [], counts = {}; (S.countries || []).forEach(function (c) { counts[c.c] = c.n; });
            var cs = sel(h, [['', 'كل الدول']].concat((S.countries || []).map(function (c) { return [c.c, cname(c.c) + ' (' + c.n + ')']; })), F.cc, function (v) { F.cc = v; shellReload(); });
            var ds = sel(h, [['', 'كل الأجهزة']].concat(Object.keys(DEVN).map(function (k) { return [k, DEVN[k]]; })), F.dev, function (v) { F.dev = v; shellReload(); });
            var st = sel(h, [['', 'كل الحالات'], ['on', 'متصل الآن'], ['off', 'غير متصل']], F.st, function (v) { F.st = v; shellReload(); });
            function shellReload() { load().then(function (rs) { draw(rs); }); }
            var tblBox = h('div');
            function draw(rs) {
                tblBox.textContent = '';
                var qv = (F.q || '').toLowerCase(); if (qv) rs = rs.filter(function (v) { return (v.vid + ' ' + (v.city || '') + ' ' + cname(v.country) + ' ' + (v.last_section || '')).toLowerCase().indexOf(qv) > -1; });
                tblBox.appendChild(tbl(h, ['المعرّف', 'الحالة', 'آخر ظهور', 'أول زيارة', 'زيارات', 'جلسات', 'الدولة', 'المدينة', 'الجهاز', 'القسم الحالي', 'مدة الجلسة', 'آخر الأقسام'], rs.map(function (v) {
                    var on = Date.now() - new Date(v.last_seen) < 180000, dur = v.cur_started ? Math.max(0, Math.round((new Date(v.last_seen) - new Date(v.cur_started)) / 60000)) : 0;
                    return [v.vid.slice(0, 8), tag(h, on ? 'متصل' : 'غير متصل', on ? 'ok' : ''), A.ago(v.last_seen), dt(v.first_seen), A.ar(v.visits), A.ar(v.sessions), cname(v.country), v.city || '—', (DEVN[v.device] || '') + ' · ' + (v.os || '') + ' · ' + (v.browser || ''), sn(v.last_section), '≈ ' + A.ar(dur) + ' د', (v.recent || []).map(sn).join(' ‹ ')];
                })));
                if (!rs.length) tblBox.appendChild(h('div', { cls: 'mut', text: 'لا زوار مطابقون.' }));
            }
            var qi = h('input', { placeholder: 'بحث: معرّف / مدينة / قسم' }); qi.addEventListener('input', function () { F.q = qi.value; draw(rows); });
            body.appendChild(h('div', { cls: 'grid' }, [A.stat(A.ar(S.online), 'متصل الآن'), A.stat(A.ar(S.total), 'إجمالي الزوار (معرّفات)'), A.stat(A.ar(S.new24), 'جدد آخر ٢٤ ساعة'), A.stat(A.ar(S.ret24), 'عائدون آخر ٢٤ ساعة')]));
            body.appendChild(A.card('الزيارات — آخر 14 يومًا', [chartBox]));
            body.appendChild(A.card('خريطة الزوار حسب الدولة', [mapView(h, counts, function (cc) { F.cc = cc; cs.value = cc; shellReload(); })]));
            var bs = {}; (S.bySection || []).forEach(function (x) { bs[x.s] = x.n; });
            body.appendChild(A.card('الزوار المتصلون الآن حسب القسم', [A.list(bs, SECN)]));
            body.appendChild(A.card('الزوار', [h('div', { cls: 'filters' }, [cs, ds, st, qi]), tblBox]));
            body.appendChild(A.card('ملاحظات مهمة', [h('div', { text: '• «آخر ظهور» تقريبي: عند انقطاع مفاجئ (إغلاق المتصفح أو انقطاع الشبكة) يُحتسب الزائر متصلًا حتى ٣ دقائق بعد آخر نبضة.\n• المعرّف عشوائي مجهول يُحفظ في متصفح الزائر فقط؛ يضيع بمسح بيانات المتصفح أو بتغيير الجهاز فيُحتسب زائرًا جديدًا.\n• الدولة والمدينة تقريبيتان من عنوان الاتصال وقت بدء الجلسة، ولا يُخزَّن العنوان نفسه. الزائر الذي أوقف الإحصاءات لا يظهر هنا.', cls: 'pre mut' })]));
            draw(rows); out.appendChild(h('h3', { text: 'مركز ذكاء الزوار' })); out.appendChild(body); return out;
        });
    }

    /* ============ رحلة الزائر ============ */
    function journey(A) {
        var h = A.h, days = 14, out = h('div'), box = h('div');
        function run() {
            return A.rpc('admin_flow_stats', { p_days: days }).then(function (d) {
                box.textContent = '';
                var P = d.paths || [], find = function (a, b) { var r = 0; P.forEach(function (x) { if (x.s === a && x.d === b) r += x.n; }); return r; };
                var pm = {}; P.filter(function (x) { return x.d !== 'exit'; }).slice(0, 12).forEach(function (x) { pm[sn(x.s) + ' ← ' + sn(x.d)] = x.n; });
                var fixed = [['home', 'mushaf107'], ['mushaf107', 'readers'], ['home', 'prayer']];
                box.appendChild(h('div', { cls: 'grid' }, fixed.map(function (f) { return A.stat(A.ar(find(f[0], f[1])), sn(f[0]) + ' ← ' + sn(f[1])); })));
                var ex = {}; (d.exits || []).forEach(function (x) { ex[x.s] = x.n; }); var ct = {}; (d.cont || []).forEach(function (x) { ct[x.s] = x.n; });
                box.appendChild(A.card('أكثر المسارات شيوعًا (من ← إلى)', [A.list(pm)]));
                box.appendChild(A.card('الأقسام التي يخرج منها الزوار سريعًا (آخر قسم قبل المغادرة)', [A.list(ex, SECN)]));
                box.appendChild(A.card('الأقسام التي تقود إلى متابعة التصفح', [A.list(ct, SECN)]));
                box.appendChild(h('div', { cls: 'mut', text: 'إحصاءات تجميعية فقط: أزواج (قسم ← قسم) بلا ربط بشخص ولا سجل تفصيلي لأي زائر. تُحذف بعد ٤٥ يومًا.' }));
            });
        }
        out.appendChild(h('h3', { text: 'مركز رحلة الزائر' }));
        out.appendChild(h('div', { cls: 'row' }, [h('span', { text: 'الفترة' }), sel(h, [[7, 'آخر ٧ أيام'], [14, 'آخر ١٤ يومًا'], [30, 'آخر ٣٠ يومًا']], days, function (v) { days = +v; run(); })]));
        out.appendChild(box); return run().then(function () { return out; });
    }

    /* ============ المهام التلقائية ============ */
    var KINDS = [['announce_publish', 'نشر إعلان'], ['announce_stop', 'إيقاف إعلان'], ['maint_on', 'تفعيل الصيانة'], ['maint_off', 'إيقاف الصيانة'], ['welcome_on', 'تفعيل رسالة الترحيب'], ['welcome_off', 'إيقاف رسالة الترحيب']];
    function tasks(A) {
        var h = A.h;
        return Promise.all([A.rest('scheduled_tasks?select=*&order=run_at.asc&limit=100'), A.rest('task_runs?select=*&order=at.desc&limit=40'), A.rest('announcements?select=id,title&order=created_at.desc&limit=50')]).then(function (r) {
            var T = r[0] || [], R = r[1] || [], An = r[2] || [], kl = {}; KINDS.forEach(function (k) { kl[k[0]] = k[1]; });
            var title = h('input', { maxlength: 120, placeholder: 'عنوان المهمة' }), kind = sel(h, KINDS, 'announce_publish'), ann = sel(h, An.map(function (a) { return [a.id, a.title]; }), ''), when = h('input', { type: 'datetime-local' }), rep = h('input', { type: 'number', min: 1, max: 8760, placeholder: 'تكرار كل كم ساعة (اختياري)' }), mm = h('input', { maxlength: 300, placeholder: 'رسالة الصيانة (لمهمة التفعيل)' }), er = h('div', { cls: 'err' });
            var add = h('button', { cls: 'btn', type: 'button', text: 'إضافة المهمة', onclick: function () {
                er.textContent = ''; if (!title.value.trim() || !when.value) { er.textContent = 'اكتب العنوان وحدد الوقت'; return; }
                var pl = {}; if (/^announce/.test(kind.value)) { if (!ann.value) { er.textContent = 'اختر إعلانًا'; return; } pl.ann_id = ann.value; } if (kind.value === 'maint_on') pl.message = mm.value.trim();
                A.rest('scheduled_tasks', { method: 'POST', body: { title: title.value.trim(), kind: kind.value, payload: pl, run_at: iso(when.value), repeat_hours: rep.value ? +rep.value : null }, prefer: 'return=minimal' }).then(function () { A.toast('أُضيفت المهمة'); A.reload(); }).catch(function (e) { er.textContent = e.message; });
            } });
            var rows = T.map(function (t) {
                return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: t.title }), h('div', { cls: 'mut', text: kl[t.kind] + ' · الموعد: ' + dt(t.run_at) + (t.repeat_hours ? ' · تتكرر كل ' + t.repeat_hours + ' ساعة' : '') }), t.last_result ? h('div', { cls: 'mut', text: 'آخر نتيجة: ' + t.last_result + ' (' + A.ago(t.last_run) + ')' }) : null]),
                    h('div', { cls: 'row' }, [tag(h, t.active ? 'نشطة' : 'متوقفة', t.active ? 'ok' : ''),
                        h('button', { cls: 'btn alt sm', type: 'button', text: t.active ? 'إيقاف مؤقت' : 'استئناف', onclick: function () { A.rest('scheduled_tasks?id=eq.' + t.id, { method: 'PATCH', body: { active: !t.active }, prefer: 'return=minimal' }).then(function () { A.reload(); }); } }),
                        h('button', { cls: 'btn alt sm', type: 'button', text: 'تنفيذ الآن', onclick: function () { A.confirmBox('تنفيذ المهمة الآن؟').then(function (ok) { if (ok) A.rpc('admin_run_task', { p_id: t.id }).then(function () { A.toast('نُفّذت'); A.reload(); }).catch(function (e) { A.toast(e.message); }); }); } }),
                        h('button', { cls: 'btn alt sm', type: 'button', text: 'تعديل الموعد', onclick: function () { var v = prompt('الموعد الجديد (YYYY-MM-DD HH:MM) بتوقيتك المحلي', ''); if (!v) return; var d = new Date(v.replace(' ', 'T')); if (isNaN(d)) { A.toast('صيغة غير صحيحة'); return; } A.rest('scheduled_tasks?id=eq.' + t.id, { method: 'PATCH', body: { run_at: d.toISOString(), active: true }, prefer: 'return=minimal' }).then(function () { A.reload(); }); } }),
                        h('button', { cls: 'btn bad sm', type: 'button', text: 'حذف', onclick: function () { A.confirmBox('حذف المهمة نهائيًا؟', true).then(function (ok) { if (ok) A.rest('scheduled_tasks?id=eq.' + t.id, { method: 'DELETE', prefer: 'return=minimal' }).then(function () { A.reload(); }); }); } })])]);
            });
            return h('div', null, [h('h3', { text: 'مركز المهام التلقائية' }),
                A.card('مهمة جديدة', [h('label', null, ['العنوان', title]), h('label', null, ['النوع', kind]), h('label', null, ['الإعلان (للنشر/الإيقاف)', ann]), h('label', null, ['رسالة الصيانة', mm]), h('label', null, ['وقت التنفيذ', when]), h('label', null, ['التكرار', rep]), er, add, h('div', { cls: 'mut', text: 'تُنفَّذ تلقائيًا كل ٥ دقائق تقريبًا (مجدول Supabase المجاني). الأنواع المسموحة آمنة فقط: نشر/إيقاف إعلان، تفعيل/إيقاف الصيانة ورسالة الترحيب. لا حذف بيانات ولا عمليات خطرة.' })]),
                A.card('المهام', rows.length ? rows : [h('div', { cls: 'mut', text: 'لا مهام.' })]),
                A.card('سجل التنفيذ', R.length ? [tbl(h, ['الوقت', 'المهمة', 'النتيجة', 'التفاصيل'], R.map(function (x) { return [dt(x.at), x.title, tag(h, x.ok ? 'نجحت' : 'فشلت', x.ok ? 'ok' : 'bad'), x.result]; }))] : [h('div', { cls: 'mut', text: 'لم تُنفَّذ مهام بعد.' })])]);
        });
    }

    /* ============ مصادر المحتوى ============ */
    function health(A, body) { return fetch(A.U + '/functions/v1/health', { method: 'POST', headers: { apikey: A.K, Authorization: 'Bearer ' + A.token(), 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store', credentials: 'omit' }).then(function (r) { return r.json(); }); }
    var STN = { ok: ['سليم', 'ok'], slow: ['بطيء', 'warn'], degraded: ['متذبذب', 'warn'], down: ['متوقف', 'bad'], unknown: ['لم يُفحص', ''], local: ['محلي', 'ok'] };
    function sources(A) {
        var h = A.h;
        return A.rest('content_sources?select=*&order=critical.desc,key').then(function (S) {
            var rows = S.map(function (s) {
                var st = STN[s.local ? 'local' : s.status] || STN.unknown, fb = h('input', { value: s.fallback_url || '', placeholder: 'رابط بديل موثوق (اختياري)', dir: 'ltr' }), res = h('div', { cls: 'mut' });
                return h('div', { cls: 'card' }, [h('div', { cls: 'row' }, [h('div', null, [h('b', { text: s.label }), h('div', { cls: 'mut', text: s.note || '' })]), tag(h, st[0], st[1])]),
                    s.local ? h('div', { cls: 'mut', text: 'تُحسب داخل التطبيق ولا تعتمد على خدمة خارجية، فلا تتأثر بانقطاع الإنترنت عن مصدر.' }) : h('div', null, [
                        h('div', { cls: 'mut', text: 'زمن الاستجابة: ' + (s.last_ms != null ? s.last_ms + ' ms' : '—') + ' · آخر نجاح: ' + (s.last_ok ? dt(s.last_ok) : '—') + ' · آخر فحص: ' + (s.last_check ? A.ago(s.last_check) : '—') + ' · إخفاقات متتالية: ' + s.fails }),
                        s.last_err ? h('div', { cls: 'err', text: 'آخر خطأ: ' + s.last_err }) : null,
                        h('label', null, ['المصدر البديل', fb]), res,
                        h('div', { cls: 'row' }, [
                            h('button', { cls: 'btn alt sm', type: 'button', text: 'اختبر الآن', onclick: function () { res.textContent = 'جارٍ الاختبار…'; health(A, { force: true, key: s.key }).then(function () { A.reload(); }).catch(function () { res.textContent = 'تعذّر الاختبار'; }); } }),
                            h('button', { cls: 'btn alt sm', type: 'button', text: 'اختبر البديل', onclick: function () { if (!fb.value.trim()) { res.textContent = 'أدخل رابطًا'; return; } res.textContent = 'جارٍ الاختبار…'; health(A, { url: fb.value.trim() }).then(function (j) { res.textContent = j.ok ? 'البديل يعمل (' + j.ms + ' ms) — لن يُستبدل المصدر تلقائيًا؛ تحقق من محتواه يدويًا قبل اعتماده.' : 'البديل لا يعمل: ' + (j.err || ''); }).catch(function () { res.textContent = 'تعذّر الاختبار'; }); } }),
                            h('button', { cls: 'btn alt sm', type: 'button', text: 'حفظ البديل', onclick: function () { var v = fb.value.trim(); if (v && !/^https:\/\//.test(v)) { A.toast('يجب أن يبدأ بـ https://'); return; } A.rest('content_sources?key=eq.' + s.key, { method: 'PATCH', body: { fallback_url: v || null }, prefer: 'return=minimal' }).then(function () { A.toast('حُفظ'); }); } }),
                            h('div', { cls: 'row' }, [h('span', { text: 'حرج' }), A.sw(s.critical, function (v) { A.rest('content_sources?key=eq.' + s.key, { method: 'PATCH', body: { critical: v }, prefer: 'return=minimal' }); })]),
                            h('div', { cls: 'row' }, [h('span', { text: 'مفعّل' }), A.sw(s.enabled, function (v) { A.rest('content_sources?key=eq.' + s.key, { method: 'PATCH', body: { enabled: v }, prefer: 'return=minimal' }); })])])])]);
            });
            return h('div', null, [h('h3', { text: 'مركز مصادر المحتوى' }), h('div', { cls: 'row' }, [h('div', { cls: 'mut', text: 'يُفحص تلقائيًا كل ١٥ دقيقة. يُعدّ المصدر «متوقفًا» بعد فحصين فاشلين متتاليين ويصدر تنبيه. لا يُستبدل أي مصدر قرآن/رواية تلقائيًا أبدًا.' }), h('button', { cls: 'btn', type: 'button', text: 'اختبار كل المصادر الآن', onclick: function () { health(A, { force: true }).then(function () { A.reload(); }).catch(function () { A.toast('تعذّر الاختبار'); }); } })])].concat(rows));
        });
    }

    /* ============ وضع المطوّر ============ */
    function dev(A) {
        var h = A.h, t0 = performance.now();
        return Promise.all([A.rpc('admin_dev_snapshot'), A.raw('/auth/v1/health').then(function (r) { return r.status; }).catch(function () { return 0; }), A.raw('/functions/v1/collect', { method: 'OPTIONS' }).then(function (r) { return r.status; }).catch(function () { return 0; }), fetch('version.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })]).then(function (r) {
            var D = r[0], ms = Math.round(performance.now() - t0), nav = (performance.getEntriesByType('navigation')[0] || {}), E = D.errors || [], v = r[3];
            var byKind = {}; E.forEach(function (e) { byKind[e.k] = (byKind[e.k] || 0) + e.n; });
            var ok = function (c) { return tag(h, c ? 'يعمل' : 'لا يعمل', c ? 'ok' : 'bad'); };
            return h('div', null, [h('h3', { text: 'وضع المطوّر' }),
                h('div', { cls: 'grid' }, [A.stat(D.db_ms + ' ms', 'استعلام قاعدة البيانات'), A.stat(ms + ' ms', 'زمن الرحلة الكاملة'), A.stat(A.ar(D.db_mb) + ' MB', 'حجم قاعدة البيانات (الحد المجاني 500)'), A.stat(A.ar(D.conns), 'اتصالات DB'), A.stat(A.ar(D.err_today), 'أخطاء اليوم')]),
                A.card('حالة الخدمات', [h('div', { cls: 'row' }, [h('span', { text: 'قاعدة البيانات / PostgREST' }), ok(true)]), h('div', { cls: 'row' }, [h('span', { text: 'المصادقة Auth' }), ok(r[1] === 200)]), h('div', { cls: 'row' }, [h('span', { text: 'دوال الحافة (collect)' }), ok(r[2] > 0 && r[2] < 500)]),
                    h('div', { cls: 'row' }, [h('span', { text: 'المجدول pg_cron' }), ok((D.cron || []).some(function (c) { return c.active; }))])]),
                A.card('المهام الدورية', (D.cron_last || []).length ? [tbl(h, ['المهمة', 'الحالة', 'الوقت'], D.cron_last.map(function (c) { return [c.job, c.status, dt(c.at)]; }))] : [h('div', { cls: 'mut', text: 'لا سجل بعد.' })]),
                A.card('الإصدار والأداء', [h('div', { cls: 'row' }, [h('span', { text: 'إصدار الموقع' }), h('b', { text: String(v.version || v.v || v.build || 'غير متاح') })]), h('div', { cls: 'row' }, [h('span', { text: 'معرّف البناء' }), h('b', { text: String(v.build || v.bid || '—') })]), h('div', { cls: 'row' }, [h('span', { text: 'تحميل هذه الصفحة' }), h('b', { text: nav.duration ? Math.round(nav.duration) + ' ms' : '—' })]), h('div', { cls: 'row' }, [h('span', { text: 'ذاكرة JS' }), h('b', { text: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB' : 'غير متاح في هذا المتصفح' })])]),
                A.card('الأخطاء حسب النوع', [A.list(byKind, { js: 'JavaScript', promise: 'وعود مرفوضة', load: 'فشل تحميل ملفات', network: 'شبكة' })]),
                A.card('سجل الأخطاء (آخر ٤٠)', E.length ? [tbl(h, ['الوقت', 'القسم', 'النوع', 'الرسالة', 'العدد'], E.map(function (e) { return [dt(e.at), sn(e.s), e.k, e.m, e.n]; }))] : [h('div', { cls: 'mut', text: 'لا أخطاء 🎉' })]),
                h('div', { cls: 'mut', text: 'لا تُعرض هنا كلمات مرور ولا مفاتيح سرية ولا رموز جلسات. الأخطاء مجمّعة ومقتطعة بلا بيانات شخصية.' })]);
        });
    }

    /* ============ التنبيهات ============ */
    var ALK = { quran_down: 'مصدر القرآن', audio_down: 'مصدر الصوت', source_down: 'مصدر', error_rate: 'معدل الأخطاء', slow: 'بطء', db: 'قاعدة البيانات', quota: 'حدود الخطة', report: 'بلاغ جديد', suggestion: 'اقتراح جديد', task_failed: 'مهمة فاشلة' };
    function alerts(A) {
        var h = A.h, F = (window.__alF = window.__alF || { view: 'open', sort: 'imp' });
        var q = 'admin_alerts?select=*&limit=150&archived=eq.' + (F.view === 'arch') + (F.view === 'unread' ? '&read=eq.false' : '') + '&order=' + (F.sort === 'imp' ? 'severity.desc,at.desc' : 'at.desc');
        return A.rest(q).then(function (L) {
            var sev = { 3: ['حرج', 'bad'], 2: ['متوسط', 'warn'], 1: ['معلومة', ''] };
            return h('div', null, [h('h3', { text: 'مركز التنبيهات' }),
                h('div', { cls: 'filters' }, [sel(h, [['open', 'الكل'], ['unread', 'غير المقروء'], ['arch', 'المؤرشف']], F.view, function (v) { F.view = v; A.reload(); }), sel(h, [['imp', 'الأهمية أولًا'], ['time', 'الأحدث أولًا']], F.sort, function (v) { F.sort = v; A.reload(); }),
                    h('button', { cls: 'btn alt sm', type: 'button', text: 'تعليم الكل كمقروء', onclick: function () { A.rest('admin_alerts?read=eq.false', { method: 'PATCH', body: { read: true }, prefer: 'return=minimal' }).then(function () { A.reload(); }); } })]),
                A.card(null, L.length ? L.map(function (a) {
                    return h('div', { cls: 'row' }, [h('div', null, [h('div', null, [tag(h, sev[a.severity][0], sev[a.severity][1]), ' ', tag(h, ALK[a.kind] || a.kind), a.read ? null : tag(h, 'جديد', 'warn')]), h('b', { text: a.title }), a.detail ? h('div', { cls: 'mut', text: a.detail }) : null, h('div', { cls: 'mut', text: dt(a.at) })]),
                        h('div', { cls: 'row' }, [a.read ? null : h('button', { cls: 'btn alt sm', type: 'button', text: 'مقروء', onclick: function () { A.rest('admin_alerts?id=eq.' + a.id, { method: 'PATCH', body: { read: true }, prefer: 'return=minimal' }).then(function () { A.reload(); }); } }), h('button', { cls: 'btn alt sm', type: 'button', text: a.archived ? 'إلغاء الأرشفة' : 'أرشفة', onclick: function () { A.rest('admin_alerts?id=eq.' + a.id, { method: 'PATCH', body: { archived: !a.archived, read: true }, prefer: 'return=minimal' }).then(function () { A.reload(); }); } })])]);
                }) : [h('div', { cls: 'mut', text: 'لا تنبيهات.' })])]);
        });
    }

    /* ============ الصيانة المتقدمة ============ */
    function maint(A) {
        var h = A.h;
        return A.rest('site_settings?select=value&key=eq.maint_plan').then(function (r) {
            var plan = r[0] && Array.isArray(r[0].value) ? r[0].value : [];
            function put(p) { return A.rest('site_settings?key=eq.maint_plan', { method: 'PATCH', body: { value: p, updated_at: new Date().toISOString() }, prefer: 'return=minimal' }).then(function () { A.toast('حُفظ'); A.reload(); }); }
            var scope = sel(h, [['all', 'الموقع كله']].concat(Object.keys(SECN).filter(function (k) { return k !== 'exit' && k !== 'prayer'; }).map(function (k) { return [k, 'قسم: ' + SECN[k]]; })), 'all'), msg = h('textarea', { maxlength: 300, placeholder: 'رسالة تظهر للزوار' }), mode = sel(h, [['manual', 'يدوي (أفعّله وأوقفه بنفسي)'], ['auto', 'تلقائي (بداية ونهاية)']], 'manual'), st = h('input', { type: 'datetime-local' }), en = h('input', { type: 'datetime-local' }), er = h('div', { cls: 'err' }), prev = h('div');
            function preview() { prev.textContent = ''; var all = scope.value === 'all'; prev.appendChild(h('div', { cls: 'pv' }, [h('b', { text: 'معاينة ما سيراه الزائر' }), h('div', { cls: 'pvbar', text: msg.value.trim() || 'الموقع تحت صيانة قصيرة.' }), h('div', { cls: 'mut', text: all ? 'شريط أعلى كل الصفحات؛ القرآن والصوت ومواقيت الصلاة تبقى تعمل.' : 'بطاقة قسم «' + sn(scope.value) + '» تُعتَّم وتظهر الرسالة عند فتحه؛ بقية الموقع يعمل كالمعتاد.' })])); }
            var add = h('button', { cls: 'btn', type: 'button', text: 'حفظ نافذة الصيانة', onclick: function () {
                er.textContent = ''; if (mode.value === 'auto' && !st.value) { er.textContent = 'حدد وقت البداية'; return; } if (st.value && en.value && new Date(en.value) <= new Date(st.value)) { er.textContent = 'النهاية قبل البداية'; return; }
                put(plan.concat([{ id: String(Date.now()), scope: scope.value, message: msg.value.trim() || 'قيد الصيانة وسيعود قريبًا', mode: mode.value, on: false, start: st.value ? iso(st.value) : '', end: en.value ? iso(en.value) : '' }]).slice(-30)); } });
            var rows = plan.map(function (m) {
                var live = (m.mode === 'manual' && m.on) || (m.mode === 'auto' && m.start && new Date(m.start) <= new Date() && (!m.end || new Date(m.end) > new Date()));
                return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: (m.scope === 'all' ? 'الموقع كله' : 'قسم: ' + sn(m.scope)) + ' — ' + (m.mode === 'auto' ? 'تلقائي' : 'يدوي') }), h('div', { cls: 'mut', text: m.message }), m.mode === 'auto' ? h('div', { cls: 'mut', text: 'من ' + dt(m.start) + ' إلى ' + (m.end ? dt(m.end) : 'غير محدد') }) : null]),
                    h('div', { cls: 'row' }, [tag(h, live ? 'مفعّلة الآن' : 'غير مفعّلة', live ? 'warn' : ''), m.mode === 'manual' ? A.sw(m.on, function (v) { put(plan.map(function (x) { return x.id === m.id ? Object.assign({}, x, { on: v }) : x; })); }) : null,
                        h('button', { cls: 'btn bad sm', type: 'button', text: 'حذف', onclick: function () { put(plan.filter(function (x) { return x.id !== m.id; })); } })])]);
            });
            return h('div', null, [h('h3', { text: 'الصيانة المتقدمة' }),
                A.card('نافذة صيانة جديدة', [h('label', null, ['النطاق', scope]), h('label', null, ['الرسالة', msg]), h('label', null, ['النوع', mode]), h('label', null, ['البداية (للتلقائي)', st]), h('label', null, ['النهاية (اختياري)', en]), er, h('div', { cls: 'row' }, [h('button', { cls: 'btn alt', type: 'button', text: 'معاينة قبل النشر', onclick: preview }), add]), prev]),
                A.card('النوافذ الحالية', rows.length ? rows : [h('div', { cls: 'mut', text: 'لا نوافذ.' })]),
                A.card('إعادة التشغيل بعد الصيانة', [h('div', { cls: 'mut', text: 'النوافذ التلقائية تنتهي وحدها في موعدها. هذا الزر يوقف كل النوافذ اليدوية وشريط الصيانة العام فورًا ليعود الموقع طبيعيًا؛ يلتقط الزوار ذلك عند فتح الموقع أو عودتهم للاتصال.' }), h('button', { cls: 'btn', type: 'button', text: 'إنهاء كل الصيانة وإعادة تفعيل الموقع', onclick: function () { A.confirmBox('إنهاء كل الصيانة الآن؟').then(function (ok) { if (!ok) return; var now = new Date().toISOString(); A.rest('site_settings?key=eq.maint_plan', { method: 'PATCH', body: { value: plan.map(function (x) { return x.mode === 'manual' ? Object.assign({}, x, { on: false }) : Object.assign({}, x, { end: now }); }), updated_at: now }, prefer: 'return=minimal' }).then(function () { return A.rest('site_settings?key=eq.maintenance', { method: 'PATCH', body: { value: { on: false, message: '' }, updated_at: now }, prefer: 'return=minimal' }); }).then(function () { A.toast('عاد الموقع طبيعيًا'); A.reload(); }); }); } })])]);
        });
    }

    /* ============ البلاغات ============ */
    var RC = { mushaf: 'المصحف', audio: 'الصوت', reciter: 'قارئ لا يعمل', prayer: 'مواقيت الصلاة', design: 'التصميم', slow: 'بطء', other: 'أخرى' }, RS = { new: 'جديد', reviewing: 'قيد المراجعة', waiting_user: 'بانتظار رد المستخدم', fixing: 'قيد الإصلاح', fixed: 'تم الحل', rejected: 'مرفوض' };
    function copy(A, text) { var done = function () { A.toast('نُسخ'); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { A.toast('تعذّر النسخ'); }); else { var t = A.h('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) { A.toast('تعذّر النسخ'); } t.remove(); } }
    function diag(r, dv, ev, ver) {
        var L = ['# تقرير تشخيص — موقع المسلم', '(منظَّم ليُلصق في ChatGPT يدويًا؛ لا يحوي أسرارًا)', '', '## البلاغ', 'الرقم: ' + r.code, 'النوع: ' + (RC[r.category] || r.category), 'القسم: ' + sn(r.section), 'الحالة: ' + (RS[r.status] || r.status), 'الوقت: ' + dt(r.at), 'النص: ' + r.message, ''];
        if (r.solution) L.push('الحل المطبّق سابقًا: ' + r.solution, '');
        L.push('## الجهاز');
        if (dv) L.push('الرقم التسلسلي: #' + dv.serial, 'الجهاز/النظام/المتصفح: ' + [DEVN[dv.device] || dv.device, dv.os, dv.browser].join(' / '), 'الشاشة: ' + (dv.scr || '—'), 'الموقع التقريبي: ' + cname(dv.country) + (dv.city ? ' - ' + dv.city : ''), 'زيارات: ' + dv.visits + ' | أول ظهور: ' + dt(dv.first_seen)); else L.push('غير متوفر');
        L.push('', '## إصدار الموقع', String((ver && (ver.version || ver.build)) || 'غير متاح'), '', '## آخر الأخطاء والأحداث (4 أيام)');
        (ev || []).slice(0, 25).forEach(function (e) { L.push('- ' + dt(e.at) + ' [' + e.kind + '] ' + (e.section ? sn(e.section) + ' ' : '') + (e.detail || '')); });
        if (!(ev || []).length) L.push('لا أحداث مسجّلة');
        L.push('', '## المطلوب', 'حلّل السبب المحتمل للمشكلة، واقترح خطوات تحقق مرتبة، ثم الإصلاح المقترح للكود أو الإعداد، مع التنبيه لأي معلومة ناقصة.');
        return L.join('\n');
    }
    function reports(A) {
        var h = A.h, F = (window.__rpF = window.__rpF || { st: '', cat: '', arch: 'false', q: '' });
        var q = 'reports?select=*&order=priority.desc,at.desc&limit=150&archived=eq.' + F.arch + (F.st ? '&status=eq.' + F.st : '') + (F.cat ? '&category=eq.' + F.cat : '');
        return A.rest(q).then(function (L) {
            var ids = L.map(function (r) { return r.id; }), vids = L.map(function (r) { return r.vid; }).filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
            return Promise.all([ids.length ? A.rest('report_messages?select=*&order=at.asc&report_id=in.(' + ids.join(',') + ')') : [], vids.length ? A.rest('visitors?select=vid,serial,device,os,browser,country,city,scr,visits,first_seen&vid=in.(' + vids.join(',') + ')') : [], fetch('version.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })]).then(function (x) {
                var M = {}; (x[0] || []).forEach(function (m) { (M[m.report_id] = M[m.report_id] || []).push(m); }); var V = {}, ver = x[2]; (x[1] || []).forEach(function (v) { V[v.vid] = v; });
                function up(id, p) { return A.rest('reports?id=eq.' + id, { method: 'PATCH', body: Object.assign({ updated_at: new Date().toISOString() }, p), prefer: 'return=minimal' }); }
                var qs = (F.q || '').toLowerCase(); var rows = L.filter(function (r) { return !qs || (r.code + ' ' + r.message + ' ' + (V[r.vid] ? '#' + V[r.vid].serial : '')).toLowerCase().indexOf(qs) > -1; });
                var cards = rows.map(function (r) {
                    var dv = V[r.vid], sol = h('textarea', { maxlength: 500, placeholder: 'الحل المطبّق' }), rep = h('textarea', { maxlength: 800, placeholder: 'ردّ على صاحب البلاغ (يراه بصفحة المتابعة)' }), rst = sel(h, [['waiting_user', 'بانتظار رد المستخدم'], ['reviewing', 'قيد المراجعة'], ['fixing', 'قيد الإصلاح'], ['fixed', 'تم الحل'], ['rejected', 'مرفوض']], 'waiting_user'); sol.value = r.solution || '';
                    var th = (M[r.id] || []).map(function (m) { return h('div', { cls: 'bub ' + (m.from_admin ? 'adm' : 'usr'), text: (m.from_admin ? 'الإدارة: ' : 'صاحب البلاغ: ') + m.body + ' — ' + dt(m.at) }); });
                    return h('div', { cls: 'card' }, [h('div', { cls: 'row' }, [h('div', null, [tag(h, RC[r.category] || r.category), ' ', tag(h, 'القسم: ' + sn(r.section)), ' ', tag(h, RS[r.status], r.status === 'fixed' ? 'ok' : r.status === 'new' ? 'warn' : '')]), h('span', { cls: 'mut', text: r.code + ' · ' + dt(r.at) })]),
                        h('div', { text: r.message, cls: 'pre' }),
                        dv ? h('div', { cls: 'mut', text: 'الجهاز #' + dv.serial + ' — ' + (DEVN[dv.device] || '') + ' · ' + dv.os + ' · ' + dv.browser + ' · ' + cname(dv.country) }) : h('div', { cls: 'mut', text: 'لا ملف جهاز مرتبط (ربما حُذف لقدمه).' })].concat(th, [
                        h('div', { cls: 'filters' }, [sel(h, Object.keys(RC).map(function (k) { return [k, RC[k]]; }), r.category, function (v) { up(r.id, { category: v }); }), sel(h, [[3, 'أولوية عالية'], [2, 'متوسطة'], [1, 'منخفضة']], r.priority, function (v) { up(r.id, { priority: +v }); }), sel(h, Object.keys(RS).map(function (k) { return [k, RS[k]]; }), r.status, function (v) { up(r.id, { status: v }).then(function () { A.toast('حُدّثت الحالة'); }); })]),
                        h('label', null, ['الرد على صاحب البلاغ', rep]), h('div', { cls: 'row' }, [rst, h('button', { cls: 'btn sm', type: 'button', text: 'إرسال الرد', onclick: function () { if (!rep.value.trim()) { A.toast('اكتب الرد'); return; } A.rpc('admin_reply_report', { p_id: r.id, p_body: rep.value.trim(), p_status: rst.value }).then(function () { A.toast('أُرسل الرد'); A.reload(); }).catch(function (e) { A.toast(e.message); }); } })]),
                        h('label', null, ['الحل المطبّق', sol]),
                        h('div', { cls: 'row' }, [h('button', { cls: 'btn alt sm', type: 'button', text: 'حفظ الحل', onclick: function () { up(r.id, { solution: sol.value.trim() }).then(function () { A.toast('حُفظ'); }); } }),
                            h('button', { cls: 'btn alt sm', type: 'button', text: 'نسخ تقرير التشخيص (لـ ChatGPT)', onclick: function () { (r.vid ? A.rest('device_events?select=*&order=at.desc&limit=25&vid=eq.' + r.vid) : Promise.resolve([])).then(function (ev) { copy(A, diag(r, dv, ev, ver)); }); } }),
                            h('button', { cls: 'btn alt sm', type: 'button', text: r.archived ? 'إلغاء الأرشفة' : 'أرشفة', onclick: function () { up(r.id, { archived: !r.archived }).then(function () { A.reload(); }); } })])]));
                });
                var qi = h('input', { placeholder: 'بحث: رقم المتابعة / نص / #جهاز', value: F.q }); qi.addEventListener('change', function () { F.q = qi.value; A.reload(); });
                return h('div', null, [h('h3', { text: 'مركز البلاغات' }), h('div', { cls: 'filters' }, [qi, sel(h, [['', 'كل الحالات']].concat(Object.keys(RS).map(function (k) { return [k, RS[k]]; })), F.st, function (v) { F.st = v; A.reload(); }), sel(h, [['', 'كل الأنواع']].concat(Object.keys(RC).map(function (k) { return [k, RC[k]]; })), F.cat, function (v) { F.cat = v; A.reload(); }), sel(h, [['false', 'النشطة'], ['true', 'المؤرشفة']], F.arch, function (v) { F.arch = v; A.reload(); })])].concat(cards.length ? cards : [h('div', { cls: 'mut', text: 'لا بلاغات.' })]));
            });
        });
    }

    /* ============ الاقتراحات ============ */
    var SS = { new: 'جديد', study: 'قيد الدراسة', accepted: 'مقبول', rejected: 'مرفوض', done: 'تم التنفيذ' }, SC = { feature: 'ميزة', design: 'تصميم', content: 'محتوى', audio: 'صوت', other: 'أخرى' };
    function suggestions(A) {
        var h = A.h, F = (window.__sgF = window.__sgF || { st: '', arch: 'false' });
        return A.rest('suggestions?select=*&dup_of=is.null&order=votes.desc,at.desc&limit=150&archived=eq.' + F.arch + (F.st ? '&status=eq.' + F.st : '')).then(function (L) {
            function up(id, p) { return A.rest('suggestions?id=eq.' + id, { method: 'PATCH', body: p, prefer: 'return=minimal' }); }
            var cards = L.map(function (s) {
                return h('div', { cls: 'card' }, [h('div', { cls: 'row' }, [h('div', null, [h('b', { text: s.title }), h('div', { cls: 'mut', text: (SC[s.category] || s.category) + ' · ' + dt(s.at) })]), h('div', null, [tag(h, '▲ ' + A.ar(s.votes) + ' صوت', 'ok'), ' ', tag(h, SS[s.status], s.status === 'new' ? 'warn' : '')])]),
                    s.body ? h('div', { text: s.body, cls: 'pre' }) : null,
                    h('div', { cls: 'filters' }, [sel(h, Object.keys(SS).map(function (k) { return [k, SS[k]]; }), s.status, function (v) { up(s.id, { status: v }).then(function () { A.toast('حُدّثت'); }); }), sel(h, Object.keys(SC).map(function (k) { return [k, SC[k]]; }), s.category, function (v) { up(s.id, { category: v }); }),
                        h('button', { cls: 'btn alt sm', type: 'button', text: 'دمج في اقتراح آخر', onclick: function () { var v = prompt('رقم الاقتراح الأساسي'); if (!v || isNaN(+v) || +v === s.id) return; A.rest('suggestions?id=eq.' + s.id, { method: 'PATCH', body: { dup_of: +v, archived: true }, prefer: 'return=minimal' }).then(function () { A.toast('دُمج (رقم هذا الاقتراح ' + s.id + ')'); A.reload(); }); } }),
                        h('span', { cls: 'mut', text: '#' + s.id }), h('button', { cls: 'btn alt sm', type: 'button', text: s.archived ? 'إلغاء الأرشفة' : 'أرشفة', onclick: function () { up(s.id, { archived: !s.archived }).then(function () { A.reload(); }); } })])]);
            });
            return h('div', null, [h('h3', { text: 'مركز اقتراحات الزوار' }), h('div', { cls: 'mut', text: 'تُكشف الاقتراحات المتشابهة تلقائيًا (نفس العنوان بعد التنظيف) وتُدمج أصواتها. الأصوات مجهولة، صوت واحد لكل معرّف.' }), h('div', { cls: 'filters' }, [sel(h, [['', 'كل الحالات']].concat(Object.keys(SS).map(function (k) { return [k, SS[k]]; })), F.st, function (v) { F.st = v; A.reload(); }), sel(h, [['false', 'النشطة'], ['true', 'المؤرشفة']], F.arch, function (v) { F.arch = v; A.reload(); })])].concat(cards.length ? cards : [h('div', { cls: 'mut', text: 'لا اقتراحات.' })]));
        });
    }

    /* ============ رسم بياني بسيط (SVG) ============ */
    function chart(h, data, title) {
        var NS = 'http://www.w3.org/2000/svg', W = 320, H = 120, P = 18, mx = Math.max.apply(null, data.map(function (d) { return d.v; }).concat(1)), bw = (W - P * 2) / Math.max(data.length, 1);
        var s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 ' + W + ' ' + (H + 22)); s.setAttribute('class', 'chart'); s.setAttribute('role', 'img'); s.setAttribute('aria-label', title || 'رسم بياني');
        data.forEach(function (d, i) {
            var bh = Math.round((H - 14) * d.v / mx), r = document.createElementNS(NS, 'rect'); r.setAttribute('x', P + i * bw + 2); r.setAttribute('y', H - bh); r.setAttribute('width', Math.max(bw - 4, 2)); r.setAttribute('height', bh); r.setAttribute('rx', 3); r.setAttribute('class', 'bar');
            var tt = document.createElementNS(NS, 'title'); tt.textContent = d.l + ': ' + d.v; r.appendChild(tt); s.appendChild(r);
            if (data.length <= 16 || i % 2 === 0) { var x = document.createElementNS(NS, 'text'); x.setAttribute('x', P + i * bw + bw / 2); x.setAttribute('y', H + 14); x.setAttribute('text-anchor', 'middle'); x.setAttribute('class', 'lbl'); x.textContent = d.l; s.appendChild(x); }
        });
        return s;
    }

    /* ============ مركز الأجهزة الذكي ============ */
    function devices(A) {
        var h = A.h, F = (window.__dvF = window.__dvF || { q: '', cc: '', dev: '' }), since = iso(Date.now() - 4 * 86400000);
        var q = 'visitors?select=*&order=last_seen.desc&limit=150' + (F.cc ? '&country=eq.' + F.cc : '') + (F.dev ? '&device=eq.' + F.dev : '');
        return Promise.all([A.rest(q), A.rest('device_events?select=vid,detail,at&kind=eq.error&at=gte.' + since + '&order=at.desc&limit=500'), A.rest('devices_saved?select=*&limit=500'), A.rest('visitors?select=device,os,browser,country,net,info&last_seen=gte.' + since + '&limit=1000'), A.rest('device_events?select=detail,section,vid&kind=eq.act&at=gte.' + since + '&order=at.desc&limit=1500')]).then(function (r) {
            var SV = {}; (r[2] || []).forEach(function (z) { SV[z.vid] = z; });
            function ser(v) { return (SV[v.vid] && SV[v.vid].serial) || v.serial; } function nm(v) { return SV[v.vid] && SV[v.vid].name ? ' · ' + SV[v.vid].name : ''; }
            var D = r[0] || [], E = r[1] || [], errCnt = {}, lastErr = {}, rep = {}; E.forEach(function (e) { errCnt[e.vid] = (errCnt[e.vid] || 0) + 1; if (!lastErr[e.vid]) lastErr[e.vid] = (e.detail || '').slice(0, 80); var k = (e.detail || '').slice(0, 90); rep[k] = rep[k] || { n: 0, v: {} }; rep[k].n++; rep[k].v[e.vid] = 1; });
            var repeated = {}; Object.keys(rep).filter(function (k) { return rep[k].n >= 3; }).forEach(function (k) { repeated[k + ' (' + Object.keys(rep[k].v).length + ' جهاز)'] = rep[k].n; });
            var qs = (F.q || '').toLowerCase(), rows = D.filter(function (v) { return !qs || (v.vid + ' #' + ser(v) + nm(v) + ' ' + (v.city || '') + ' ' + cname(v.country) + ' ' + (v.ip_mask || '') + ' ' + (v.ip || '') + ' ' + (v.net || '')).toLowerCase().indexOf(qs) > -1; });
            var detail = h('div');
            function open(v) {
                detail.textContent = '';
                Promise.all([A.rest('device_events?select=*&order=at.desc&limit=250&vid=eq.' + v.vid), A.rest('reports?select=id,code,category,status,at&order=at.desc&limit=20&vid=eq.' + v.vid), A.rest('visitor_messages?select=*&order=created_at.desc&limit=30&vkey=eq.' + v.vid)]).then(function (x) {
                    var ev = x[0] || [], rp = x[1] || [], ms = x[2] || [], ti = h('input', { maxlength: 100, placeholder: 'عنوان الرسالة' }), bo = h('textarea', { maxlength: 800, placeholder: 'نص الرسالة' }), on = Date.now() - new Date(v.last_seen) < 180000;
                    detail.appendChild(A.card('ملف الجهاز #' + ser(v) + nm(v), [
                        h('div', { cls: 'grid' }, [A.stat('#' + ser(v), 'الرقم التسلسلي'), A.stat(on ? 'متصل' : 'غير متصل', 'الحالة'), A.stat(A.ar(v.visits), 'الزيارات'), A.stat(A.ar(v.sessions), 'الجلسات')]),
                        h('div', { cls: 'mut', text: 'المعرّف الثابت: ' + v.vid }), h('div', { cls: 'mut', text: [DEVN[v.device] || '', v.os, v.browser, 'شاشة ' + (v.scr || '—')].join(' · ') }),
                        h('div', { cls: 'mut', text: 'الموقع التقريبي: ' + cname(v.country) + (v.city ? ' - ' + v.city : '') + ' · IP: ' + (v.ip || v.ip_mask || 'غير متوفر') }), h('div', { cls: 'mut', text: 'أول ظهور: ' + dt(v.first_seen) + ' · آخر ظهور: ' + dt(v.last_seen) }),
                        h('h4', { text: 'مراسلة هذا الجهاز' }), h('div', { cls: 'mut', text: 'تصل الرسالة فقط إن كان الزائر فعّل «السماح للإدارة بمراسلة هذا الجهاز» من مركز الدعم.' }), ti, bo,
                        h('button', { cls: 'btn sm', type: 'button', text: 'إرسال', onclick: function () { if (!ti.value.trim() || !bo.value.trim()) { A.toast('اكتب العنوان والنص'); return; } A.rpc('admin_broadcast', { p_country: '', p_device: '', p_vids: [v.vid], p_title: ti.value.trim(), p_body: bo.value.trim() }).then(function () { A.toast('أُرسلت'); open(v); }).catch(function (e) { A.toast(e.message); }); } })]));
                    var sv = SV[v.vid] || {}, nmI = h('input', { maxlength: 60, placeholder: 'اسم الجهاز مثل: جهازي، جهاز أمي', value: sv.name || '' }), srI = h('input', { type: 'number', min: 1, placeholder: 'الرقم التسلسلي', value: String(ser(v)), dir: 'ltr' }), noI = h('input', { maxlength: 300, placeholder: 'ملاحظة (اختياري)', value: sv.note || '' });
                    detail.appendChild(A.card('حفظ الجهاز باسم', [h('div', { cls: 'mut', text: 'الجهاز المحفوظ يبقى (اسمه ورقمه وبياناته الأساسية) ولا يُحذف بعد ٤ أيام كبقية الأجهزة. الزائر يرى رقم جهازه في «مركز الدعم الفني»، وتستطيع تغيير الرقم هنا.' }), h('label', null, ['الاسم', nmI]), h('label', null, ['الرقم التسلسلي', srI]), h('label', null, ['ملاحظة', noI]),
                        h('div', { cls: 'row' }, [h('button', { cls: 'btn sm', type: 'button', text: 'حفظ', onclick: function () { A.rpc('admin_save_device', { p_vid: v.vid, p_name: nmI.value.trim(), p_serial: srI.value ? +srI.value : null, p_note: noI.value.trim() }).then(function () { A.toast('تم حفظ الجهاز'); A.reload(); }).catch(function (e) { A.toast(e.message || 'تعذّر الحفظ'); }); } }),
                            sv.vid ? h('button', { cls: 'btn alt sm', type: 'button', text: 'إلغاء الحفظ', onclick: function () { A.confirmBox('سيُعامل الجهاز كبقية الأجهزة ويُحذف بعد ٤ أيام من آخر ظهور. متابعة؟', true).then(function (ok) { if (!ok) return; A.rpc('admin_unsave_device', { p_vid: v.vid }).then(function () { A.toast('أُلغي الحفظ'); A.reload(); }); }); } }) : null])]));

                    var I = v.info || {}, cn = I.cn || {}, bt = I.bat, sg = I.st;
                    function kv(k, val) { if (val === undefined || val === null || val === '' || val === 0 || val === '0x0') return null; return h('tr', null, [h('th', { text: k }), h('td', { text: String(val) })]); }
                    var locOk = /^-?\d{1,2}(\.\d)?,-?\d{1,3}(\.\d)?$/.test(v.loc || ''), ll = locOk ? v.loc.split(',') : null;
                    var rowsKV = [kv('عنوان IP', v.ip || (v.ip_mask ? v.ip_mask + ' (مُقنَّع)' : '')), kv('مزوّد الشبكة · المنطقة الزمنية', v.net), kv('الدولة / المدينة (من IP)', cname(v.country) + (v.city ? ' - ' + v.city : '')), kv('إحداثيات تقريبية (من IP)', v.iploc),
                        kv('نوع الاتصال', [cn.t, cn.ty, cn.d ? cn.d + ' Mbps' : '', cn.r ? 'تأخير ' + cn.r + ' ms' : '', cn.sd ? 'توفير البيانات مفعّل' : ''].filter(Boolean).join(' · ')),
                        kv('المتصفح (UA كامل)', I.ua), kv('النظام / المنصة', [v.os, I.pl].filter(Boolean).join(' · ')), kv('الشاشة', [I.sc, I.vp ? 'النافذة ' + I.vp : '', I.dpr ? 'كثافة ' + I.dpr : '', I.cd ? I.cd + ' بت لون' : '', I.ori].filter(Boolean).join(' · ')),
                        kv('الذاكرة / المعالج', [I.mem ? I.mem + ' GB' : '', I.cores ? I.cores + ' أنوية' : ''].filter(Boolean).join(' · ')), kv('نقاط اللمس', I.tp), kv('اللغة', [I.lg, I.lgs].filter(Boolean).join(' · ')), kv('المنطقة الزمنية للجهاز', I.tz),
                        kv('البطارية', bt ? bt.l + '%' + (bt.c ? ' (تشحن)' : '') : ''), kv('تخزين الموقع', sg ? sg.u + ' MB من ' + sg.q + ' MB' : ''), kv('طريقة الفتح', I.sw === undefined ? '' : (I.pwa ? 'تطبيق مثبّت (PWA)' : 'داخل المتصفح')),
                        kv('إذن الإشعارات', I.np), kv('الوضع الداكن / تقليل الحركة', I.ver !== undefined || I.dark !== undefined ? (I.dark ? 'داكن' : 'فاتح') + ' / ' + (I.rm ? 'مفعّل' : 'لا') : ''), kv('العمل دون اتصال (Service Worker)', I.sw === undefined ? '' : (I.sw ? 'مفعّل' : 'غير مفعّل')),
                        kv('إصدار الموقع على الجهاز', I.ver), kv('زمن تحميل الصفحة', I.load ? I.load + ' ms' : ''), kv('واجهات مدعومة', I.api), kv('الكوكيز', I.ck === undefined ? '' : (I.ck ? 'مفعّلة' : 'معطّلة')), kv('أول ظهور / آخر ظهور', dt(v.first_seen) + ' / ' + dt(v.last_seen))].filter(Boolean);
                    var geoRow = locOk ? [h('div', { cls: 'mut', text: 'المنطقة الجغرافية (لمواقيت الصلاة/القبلة/المساجد، مقرّبة لنحو ١١ كم): ' + v.loc + ' ← خط العرض، الطول' }), h('a', { cls: 'btn alt sm', href: 'https://www.openstreetmap.org/?mlat=' + ll[0] + '&mlon=' + ll[1] + '#map=11/' + ll[0] + '/' + ll[1], target: '_blank', rel: 'noopener noreferrer', text: 'عرض المنطقة على الخريطة' })] : (function () { var ip = /^-?\d{1,2}(\.\d+)?,-?\d{1,3}(\.\d+)?$/.test(v.iploc || '') ? v.iploc.split(',') : null; return [h('div', { cls: 'mut', text: ip ? 'الموقع التقريبي من عنوان IP (بمستوى المدينة، غير دقيق): ' + v.iploc + (v.city ? ' — ' + v.city : '') + ' . لم يسمح هذا الجهاز بتحديد موقعه الدقيق داخل الموقع.' : 'لم يتوفر موقع لهذا الجهاز بعد (يظهر عند بدء جلسة جديدة).' })].concat(ip ? [h('a', { cls: 'btn alt sm', href: 'https://www.openstreetmap.org/?mlat=' + ip[0] + '&mlon=' + ip[1] + '#map=11/' + ip[0] + '/' + ip[1], target: '_blank', rel: 'noopener noreferrer', text: 'عرض على الخريطة' })] : []); })();
                    detail.appendChild(A.card('كل معلومات الهاتف/الجهاز', [h('table', null, rowsKV)].concat(geoRow, [h('div', { cls: 'mut', text: 'المصدر: IP ومزوّد الشبكة من الخادم؛ والباقي يرسله متصفح الجهاز عند بدء الجلسة. بعض الحقول (البطارية، نوع الاتصال، الذاكرة) لا يوفّرها متصفح آيفون/سفاري.' })])));
                    var notes = [];
                    if (/^(slow-2g|2g|3g)$/.test(cn.t || '')) notes.push('اتصال بطيء (' + cn.t + '): قد يتأخر تحميل الصوت والمصحف');
                    if (I.mem && I.mem <= 2) notes.push('ذاكرة قليلة (' + I.mem + ' GB): فعّل وضع الموارد المنخفضة إن شكا من البطء');
                    if (bt && bt.l < 20 && !bt.c) notes.push('بطارية منخفضة (' + bt.l + '%): قد يوقف النظام التشغيل في الخلفية');
                    if (sg && sg.q && sg.u / sg.q > 0.8) notes.push('مساحة تخزين الموقع على الجهاز شبه ممتلئة');
                    if (I.load && I.load > 4000) notes.push('تحميل الصفحة بطيء (' + I.load + ' ms)');
                    if (I.np === 'denied') notes.push('الإشعارات مرفوضة من المستخدم: لن تصله تنبيهات الأذان');
                    if (I.sw === 0) notes.push('الخدمة التي تتيح العمل دون اتصال غير مفعّلة على هذا الجهاز');
                    var cm = /Chrome\/(\d+)/.exec(I.ua || ''); if (cm && +cm[1] < 90) notes.push('إصدار متصفح قديم (Chrome ' + cm[1] + ') قد لا يدعم بعض الميزات');
                    if (I.ck === 0) notes.push('الكوكيز معطّلة');
                    if (I.on === 0) notes.push('كان بلا اتصال عند بدء الجلسة');
                    var errG = {}, secG = {}, btnG = {}, lis = [], lisSec = 0;
                    ev.forEach(function (e) {
                        var d = String(e.detail || '');
                        if (e.kind === 'error') { var g = errG[d] = errG[d] || { n: 0, s: e.section, at: e.at }; g.n++; }
                        else if (e.kind === 'nav' || e.kind === 'visit') { secG[e.section] = (secG[e.section] || 0) + 1; }
                        else if (e.kind === 'act') {
                            if (d.indexOf('🎧') === 0) { lis.push(e); var m1 = /(\d+) د/.exec(d), m2 = /(\d+) ث/.exec(d); lisSec += (m1 ? +m1[1] * 60 : 0) + (m2 ? +m2[1] : 0); }
                            else { var mx = /^(.*?)(?: x(\d+))?$/.exec(d), key = mx[1] || d; btnG[key] = (btnG[key] || 0) + (mx[2] ? +mx[2] : 1); }
                        }
                    });
                    var errRows = Object.keys(errG).sort(function (a, b) { return errG[b].n - errG[a].n; }).map(function (k) { return [k, sn(errG[k].s), A.ar(errG[k].n), dt(errG[k].at)]; });
                    var topB = Object.keys(btnG).sort(function (a, b) { return btnG[b] - btnG[a]; }).slice(0, 10).map(function (k) { return [k, A.ar(btnG[k])]; });
                    var topS = Object.keys(secG).sort(function (a, b) { return secG[b] - secG[a]; }).slice(0, 8).map(function (k) { return [sn(k), A.ar(secG[k])]; });
                    detail.appendChild(A.card('ملخص نشاط الجهاز وجودة الاستخدام', [
                        h('h4', { text: 'ملاحظات الجودة' }), notes.length ? h('ul', null, notes.map(function (n) { return h('li', { text: n }); })) : h('div', { cls: 'mut', text: 'لا ملاحظات: الجهاز والمتصفح والاتصال ضمن الحدود الطبيعية.' }),
                        h('h4', { text: 'الأخطاء الفعلية (نصّ الخطأ وعدد مرّاته)' }), errRows.length ? tbl(h, ['الخطأ', 'القسم', 'المرات', 'آخر مرة'], errRows) : h('div', { cls: 'mut', text: 'لا أخطاء خلال آخر 4 أيام ✅' }),
                        h('h4', { text: 'الأقسام الأكثر زيارة' }), topS.length ? tbl(h, ['القسم', 'مرات الدخول'], topS) : h('div', { cls: 'mut', text: '—' }),
                        h('h4', { text: 'الأزرار/الميزات الأكثر استخدامًا' }), topB.length ? tbl(h, ['الزر', 'المرات'], topB) : h('div', { cls: 'mut', text: '—' }),
                        h('h4', { text: 'الاستماع الصوتي' + (lis.length ? ' — الإجمالي ≈ ' + Math.round(lisSec / 60) + ' دقيقة' : '') }), lis.length ? tbl(h, ['الوقت', 'ماذا استمع'], lis.map(function (e) { return [dt(e.at), String(e.detail).replace(/^🎧\s*/, '')]; })) : h('div', { cls: 'mut', text: 'لم يُسجَّل استماع.' })]));
                    detail.appendChild(A.card('البلاغات المرتبطة', rp.length ? [tbl(h, ['الرقم', 'النوع', 'الحالة', 'الوقت'], rp.map(function (z) { return [z.code, RC[z.category] || z.category, RS[z.status] || z.status, dt(z.at)]; }))] : [h('div', { cls: 'mut', text: 'لا بلاغات.' })]));
                    detail.appendChild(A.card('الرسائل مع هذا الجهاز', ms.length ? ms.map(function (m) { return h('div', { cls: 'bub ' + (m.dir === 'in' ? 'usr' : 'adm'), text: (m.dir === 'in' ? 'الجهاز: ' : 'الإدارة: ') + m.body + ' — ' + dt(m.created_at) + (m.dir === 'out' ? (m.read_at ? ' (قُرئت)' : m.delivered_at ? ' (وصلت)' : ' (بانتظار الوصول)') : '') }); }) : [h('div', { cls: 'mut', text: 'لا رسائل.' })]));
                    detail.appendChild(A.card('سجل الاستخدام والتفاعل والأخطاء — آخر 4 أيام (الأحدث أولًا)', ev.length ? [tbl(h, ['الوقت', 'النوع', 'القسم', 'التفاصيل'], ev.map(function (e) { return [dt(e.at), { visit: 'زيارة', nav: 'تنقّل', error: 'خطأ', report: 'بلاغ', act: 'ضغطة/تفاعل' }[e.kind] || e.kind, sn(e.section), e.detail]; }))] : [h('div', { cls: 'mut', text: 'لا أحداث خلال 7 أيام (تُحذف التفاصيل تلقائيًا بعدها، وتبقى بيانات الجهاز الأساسية).' })]));
                    detail.scrollIntoView({ behavior: 'smooth' });
                });
            }
            var qi = h('input', { placeholder: 'بحث: #رقم / معرّف / مدينة / IP', value: F.q }); qi.addEventListener('change', function () { F.q = qi.value; A.reload(); });
            return h('div', null, [h('h3', { text: 'مركز الأجهزة الذكي' }), h('div', { cls: 'filters' }, [qi, sel(h, [['', 'كل الأجهزة']].concat(Object.keys(DEVN).map(function (k) { return [k, DEVN[k]]; })), F.dev, function (v) { F.dev = v; A.reload(); })]),
                A.card('مشكلات متكررة (آخر 4 أيام)', [A.list(repeated)]),

                (function () {
                    var AV = r[3] || [], AE = r[4] || [];
                    function cnt(fn) { var o = {}; AV.forEach(function (v) { var k = fn(v); if (k) o[k] = (o[k] || 0) + 1; }); return o; }
                    function top(o, n) { var t = {}; Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, n || 8).forEach(function (k) { t[k] = o[k]; }); return t; }
                    var nI = function (v) { return v.info || {}; };
                    var pwa = AV.filter(function (v) { return nI(v).pwa; }).length, known = AV.filter(function (v) { return v.info; }).length;
                    var lowMem = AV.filter(function (v) { return nI(v).mem && nI(v).mem <= 2; }).length, slow = AV.filter(function (v) { var t = (nI(v).cn || {}).t; return /^(slow-2g|2g|3g)$/.test(t || ''); }).length;
                    var loads = AV.map(function (v) { return nI(v).load; }).filter(Boolean), avgLoad = loads.length ? Math.round(loads.reduce(function (a, b) { return a + b; }, 0) / loads.length) : 0;
                    var lis = {}, btn = {}, secs = 0;
                    AE.forEach(function (e) { var d = String(e.detail || ''); if (d.indexOf('🎧') === 0) { var body = d.replace(/^🎧\s*/, ''), who = body.split(' — ')[0], m1 = /(\d+) د/.exec(d), m2 = /(\d+) ث/.exec(d), sec = (m1 ? +m1[1] * 60 : 0) + (m2 ? +m2[1] : 0); lis[who] = (lis[who] || 0) + sec; secs += sec; } else { var mx = /^(.*?)(?: x(\d+))?$/.exec(d), k = mx[1] || d; btn[k] = (btn[k] || 0) + (mx[2] ? +mx[2] : 1); } });
                    var lisMin = {}; Object.keys(lis).forEach(function (k) { lisMin[k + ' — ' + Math.max(1, Math.round(lis[k] / 60)) + ' د'] = lis[k]; });
                    var csvBtn = h('button', { cls: 'btn alt sm', text: 'تصدير الأجهزة CSV', onclick: function () {
                        function c(x) { x = String(x == null ? '' : x).replace(/"/g, '""'); if (/^[=+\-@]/.test(x)) x = "'" + x; return '"' + x + '"'; }
                        var L = [['الرقم', 'الاسم', 'المعرّف', 'أول ظهور', 'آخر ظهور', 'زيارات', 'الدولة', 'المدينة', 'IP', 'الشبكة', 'الجهاز', 'النظام', 'المتصفح', 'المنطقة'].map(c).join(',')];
                        (r[0] || []).forEach(function (v) { L.push([ser(v), (SV[v.vid] || {}).name || '', v.vid, v.first_seen, v.last_seen, v.visits, v.country, v.city, v.ip || v.ip_mask, v.net, v.device, v.os, v.browser, v.loc].map(c).join(',')); });
                        var b = new Blob(['﻿' + L.join('\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'almuslim-devices.csv'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
                        A.toast('تم تصدير الأجهزة الظاهرة');
                    } });
                    return h('div', null, [A.card('تحليلات الأجهزة (آخر 4 أيام) — ' + A.ar(AV.length) + ' جهاز', [
                        h('div', { cls: 'grid' }, [A.stat(known ? A.ar(pwa) + ' / ' + A.ar(known) : '—', 'تطبيق مثبّت (PWA)'), A.stat(A.ar(lowMem), 'ذاكرة ≤ 2GB'), A.stat(A.ar(slow), 'اتصال بطيء (3G وأقل)'), A.stat(avgLoad ? avgLoad + ' ms' : '—', 'متوسط زمن التحميل')]),
                        h('h4', { text: 'المتصفحات' }), A.list(top(cnt(function (v) { return v.browser; }))), h('h4', { text: 'أنظمة التشغيل' }), A.list(top(cnt(function (v) { return v.os; }))),
                        h('h4', { text: 'الدول' }), A.list(top(cnt(function (v) { return v.country; }))), h('h4', { text: 'مزوّدو الشبكة' }), A.list(top(cnt(function (v) { return v.net ? v.net.split(' · ')[0] : ''; }))),
                        h('h4', { text: 'نوع الاتصال' }), A.list(top(cnt(function (v) { return (nI(v).cn || {}).t; }))), h('h4', { text: 'إذن الإشعارات' }), A.list(top(cnt(function (v) { return nI(v).np; }))), csvBtn]),
                    (function () {
                        var box = h('div'), res = h('div', { cls: 'mut', text: 'اضغط على قسم لترى ما فتحه الزوار داخله (آخر ٤ أيام).' }), secsK = {};
                        AE.forEach(function (e) { if (e.section) secsK[e.section] = (secsK[e.section] || 0) + 1; });
                        var bs = Object.keys(secsK).sort(function (a, b) { return secsK[b] - secsK[a]; }).map(function (k) { return h('button', { cls: 'btn alt sm', type: 'button', text: sn(k) + ' (' + A.ar(secsK[k]) + ')', onclick: function () {
                            var c = {}; AE.forEach(function (e) { if (e.section === k) { var d = String(e.detail || '').replace(/ x\d+$/, '').replace(/\s*\(ص \d+\)$/, function (m) { return m; }); c[d] = (c[d] || 0) + 1; } });
                            var t = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }).slice(0, 40), o = {}; t.forEach(function (x) { o[x] = c[x]; });
                            res.textContent = ''; res.appendChild(h('h4', { text: 'داخل «' + sn(k) + '»: الأكثر ضغطًا وفتحًا' })); res.appendChild(t.length ? A.list(o) : h('div', { cls: 'mut', text: 'لا بيانات.' })); } }); });
                        box.appendChild(h('div', { cls: 'row' }, bs.length ? bs : [h('span', { cls: 'mut', text: 'لا نشاط مسجّل بعد.' })])); box.appendChild(res);
                        return A.card('ماذا فتح الزوار داخل كل قسم؟ (القرّاء، المصحف وصفحاته، الأحاديث، تكرار الآيات …)', [box]);
                    })(),
                    A.card('الأكثر استماعًا واستخدامًا (آخر 4 أيام)', [h('h4', { text: 'الاستماع: القرّاء/المقاطع (الإجمالي ≈ ' + Math.round(secs / 60) + ' دقيقة)' }), Object.keys(lisMin).length ? A.list(top(lisMin, 12)) : h('div', { cls: 'mut', text: 'لا استماع مسجّل بعد.' }), h('h4', { text: 'الأزرار والميزات الأكثر ضغطًا' }), Object.keys(btn).length ? A.list(top(btn, 15)) : h('div', { cls: 'mut', text: 'لا بيانات بعد.' })])]);
                })(),
                A.card('الأجهزة', [tbl(h, ['#', 'المعرّف', 'الحالة', 'آخر ظهور', 'زيارات', 'الدولة/المدينة', 'IP', 'الشبكة', 'الجهاز', 'أخطاء 4 أيام', 'آخر خطأ', ''], rows.map(function (v) { var on = Date.now() - new Date(v.last_seen) < 180000; return ['#' + ser(v) + nm(v), v.vid.slice(0, 8), tag(h, on ? 'متصل' : 'غير متصل', on ? 'ok' : ''), A.ago(v.last_seen), A.ar(v.visits), cname(v.country) + (v.city ? ' / ' + v.city : ''), v.ip || v.ip_mask || '—', (v.net || '—').slice(0, 40), (DEVN[v.device] || '') + ' · ' + v.os + ' · ' + v.browser, errCnt[v.vid] ? tag(h, String(errCnt[v.vid]), 'warn') : '0', lastErr[v.vid] || '—', h('button', { cls: 'btn alt sm', type: 'button', text: 'فتح الملف', onclick: function () { open(v); } })]; }))]),
                detail, h('div', { cls: 'mut pre', text: 'خصوصية: المعرّف عشوائي يُنشأ في متصفح الزائر؛ لا بصمة جهاز. يُحفظ عنوان IP ومزوّد الشبكة ومعلومات الجهاز لمساعدتك في حل المشكلات، وتُحذف مع كل أحداث الاستخدام والأخطاء بعد 4 أيام من آخر ظهور (إلا الأجهزة التي تحفظها باسم). يضيع المعرّف بمسح بيانات المتصفح أو تغيير الجهاز.' })]);
        });
    }

    /* ============ المراسلات ============ */
    function comms(A) {
        var h = A.h;
        return Promise.all([A.rest('visitor_messages?select=*&dir=eq.in&archived=eq.false&order=created_at.desc&limit=60'), A.rest('visitor_messages?select=*&dir=eq.out&order=created_at.desc&limit=40'), A.rest('visitors?select=vid,serial&order=serial.desc&limit=400'), A.rest('devices_saved?select=vid,serial&limit=500')]).then(function (r) {
            var IN = r[0] || [], OUT = r[1] || [], S = {}; (r[2] || []).forEach(function (v) { S[v.vid] = v.serial; }); (r[3] || []).forEach(function (z) { if (z.serial) S[z.vid] = z.serial; });
            var tt = h('input', { maxlength: 100, placeholder: 'عنوان الرسالة' }), bb = h('textarea', { maxlength: 800, placeholder: 'نص الرسالة' }), cc = h('input', { maxlength: 2, placeholder: 'رمز الدولة (اختياري) مثل LY', dir: 'ltr' }), dv = sel(h, [['', 'كل الأجهزة']].concat(Object.keys(DEVN).map(function (k) { return [k, DEVN[k]]; })), '');
            return h('div', null, [h('h3', { text: 'المراسلات' }),
                A.card('رسالة لمجموعة أجهزة', [h('div', { cls: 'mut', text: 'تصل فقط للأجهزة التي سمح أصحابها باستقبال رسائل الإدارة. الحد الأقصى 1000 جهاز للرسالة.' }), h('label', null, ['العنوان', tt]), h('label', null, ['النص', bb]), h('label', null, ['الدولة', cc]), h('label', null, ['نوع الجهاز', dv]), h('button', { cls: 'btn', type: 'button', text: 'إرسال', onclick: function () { if (!tt.value.trim() || !bb.value.trim()) { A.toast('اكتب العنوان والنص'); return; } A.confirmBox('إرسال الرسالة للمجموعة المحددة؟').then(function (ok) { if (ok) A.rpc('admin_broadcast', { p_country: cc.value.trim().toUpperCase(), p_device: dv.value, p_vids: null, p_title: tt.value.trim(), p_body: bb.value.trim() }).then(function (n) { A.toast('أُرسلت إلى ' + n + ' جهاز'); A.reload(); }).catch(function (e) { A.toast(e.message); }); }); } })]),
                A.card('الوارد من الأجهزة', IN.length ? IN.map(function (m) { var ri = h('input', { placeholder: 'اكتب ردًا', maxlength: 800 }); return h('div', { cls: 'card' }, [h('div', { cls: 'bub usr', text: 'الجهاز #' + (S[m.vkey] || '؟') + ': ' + m.body + ' — ' + dt(m.created_at) }), ri, h('div', { cls: 'row' }, [h('button', { cls: 'btn sm', type: 'button', text: 'ردّ', onclick: function () { if (!ri.value.trim()) return; A.rpc('admin_broadcast', { p_country: '', p_device: '', p_vids: [m.vkey], p_title: 'رد الإدارة', p_body: ri.value.trim() }).then(function () { A.rest('visitor_messages?id=eq.' + m.id, { method: 'PATCH', body: { archived: true }, prefer: 'return=minimal' }); A.toast('أُرسل الرد'); A.reload(); }).catch(function (e) { A.toast(e.message); }); } }), h('button', { cls: 'btn alt sm', type: 'button', text: 'أرشفة', onclick: function () { A.rest('visitor_messages?id=eq.' + m.id, { method: 'PATCH', body: { archived: true }, prefer: 'return=minimal' }).then(function () { A.reload(); }); } })])]); }) : [h('div', { cls: 'mut', text: 'لا رسائل واردة.' })]),
                A.card('الصادر', OUT.length ? [tbl(h, ['الوقت', 'الجهاز', 'العنوان', 'الحالة'], OUT.map(function (m) { return [dt(m.created_at), '#' + (S[m.vkey] || '؟'), m.title, m.read_at ? 'قُرئت' : m.delivered_at ? 'وصلت' : 'بانتظار']; }))] : [h('div', { cls: 'mut', text: 'لا رسائل صادرة.' })])]);
        });
    }

    /* ============ دليل الاستخدام ============ */
    var GUIDE = [['مركز الزوار', 'إحصاءات حية: المتصلون الآن، جدد/عائدون، خريطة الدول. «آخر ظهور» تقريبي عند الانقطاع المفاجئ.'], ['مركز الأجهزة', 'لكل جهاز رقم تسلسلي ومعرّف عشوائي ثابت في متصفحه. افتح ملف الجهاز لرؤية: IP ومزوّد الشبكة ونوع الاتصال والبطارية والذاكرة والمنطقة الجغرافية، ونصوص الأخطاء الفعلية، والأقسام والأزرار المستخدمة، ومدة الاستماع لكل قارئ، وملاحظات الجودة (آخر 4 أيام)، ومراسلته (تظهر رسالتك له أسفل شاشته). يضيع المعرّف بمسح بيانات المتصفح.'], ['رحلة الزائر', 'مسارات تجميعية (قسم ← قسم) بلا تتبع أشخاص.'], ['المراسلات', 'رسائل جماعية أو لجهاز محدد، ومحادثات مع الزوار الذين فعّلوا الاستقبال.'], ['البلاغات', 'لكل بلاغ رقم متابعة (MS-…). ردّك يظهر لصاحبه في «مركز الدعم الفني ← متابعة بلاغ» بلا حساب. زر «نسخ تقرير التشخيص» يجهّز نصًا منظمًا تلصقه يدويًا في ChatGPT.'], ['الاقتراحات', 'تُدمج المتشابهة تلقائيًا ويُرتَّب بالأصوات المجهولة.'], ['المهام التلقائية', 'جدولة آمنة فقط (نشر/إيقاف إعلان، صيانة، ترحيب) تُنفَّذ كل ~5 دقائق.'], ['مصادر المحتوى', 'فحص كل 15 دقيقة لخدمات القرآن والصوت والأحاديث والقبلة. لا يُستبدل أي مصدر تلقائيًا.'], ['الصيانة المتقدمة', 'للموقع كله أو لقسم واحد، يدوية أو بجدول، مع معاينة.'], ['التنبيهات', 'أعطال المصادر، ارتفاع الأخطاء، قرب حدود الخطة، بلاغات واقتراحات جديدة، مهام فاشلة.'], ['وضع المطوّر', 'حالة القواعد والخدمات والأخطاء دون أي أسرار.'], ['الخطة المجانية', 'حذف تلقائي لتفاصيل الاستخدام والأخطاء بعد 4 أيام، مع بقاء الملخصات اليومية وبيانات الأجهزة الأساسية. راقب «استهلاك الخطة المجانية».'], ['الأمان', 'لا تشارك كلمة المرور. بدّلها من «إعدادات الحساب». أنهِ الجلسات الغريبة من نفس الصفحة.']];
    function guide(A) { var h = A.h; return Promise.resolve(h('div', null, [h('h3', { text: 'دليل الاستخدام' })].concat(GUIDE.map(function (g) { return A.card(g[0], [h('div', { cls: 'pre', text: g[1] })]); })))); }

    /* ============ تقرير حالة الميزات ============ */
    function status(A) {
        var h = A.h, T = ['visitors', 'device_events', 'flow_daily', 'scheduled_tasks', 'task_runs', 'admin_alerts', 'reports', 'report_messages', 'suggestions', 'content_sources', 'source_checks', 'visitor_messages', 'features', 'announcements'];
        return Promise.all([Promise.all(T.map(function (n) { return A.rest(n + '?select=*&limit=1').then(function () { return [n, true]; }).catch(function () { return [n, false]; }); })), A.rpc('admin_dev_snapshot'), A.rest('content_sources?select=key,label,status,local,critical'), A.rest('source_checks?select=at&order=at.desc&limit=1')]).then(function (r) {
            var okT = r[0].filter(function (x) { return x[1]; }).length, D = r[1], S = r[2] || [], last = (r[3] || [])[0], rows = [];
            function add(n, ok, note) { rows.push([n, tag(h, ok === true ? 'يعمل' : ok === false ? 'لا يعمل' : 'غير منفَّذ', ok === true ? 'ok' : ok === false ? 'bad' : 'warn'), note || '']); }
            add('جداول النظام (' + T.length + ')', okT === T.length, okT + ' متاحة للمدير عبر RLS');
            add('المهام الدورية pg_cron', (D.cron || []).filter(function (c) { return c.active; }).length >= 4, (D.cron || []).map(function (c) { return c.name; }).join('، '));
            add('فحص مصادر المحتوى', !!last && Date.now() - new Date(last.at) < 40 * 60000, last ? 'آخر فحص ' + A.ago(last.at) : 'لم يُنفَّذ');
            S.filter(function (s) { return !s.local; }).forEach(function (s) { add('مصدر: ' + s.label, s.status === 'ok' ? true : s.status === 'unknown' ? null : false, s.status); });
            add('الحذف التلقائي بعد 4 أيام', (D.cron || []).some(function (c) { return c.name === 'almuslim-prune'; }), 'مهمة يومية 03:17 UTC');
            add('إشعارات Push', null, 'غير مفعّلة: تحتاج مفاتيح VAPID وإعدادًا إضافيًا (انظر التقرير)');
            add('القارئ عمير شميم', null, 'غير مضاف: لا تسجيلات مؤكدة كاملة/حقوق غير واضحة');
            return h('div', null, [h('h3', { text: 'تقرير حالة الميزات' }), A.card(null, [tbl(h, ['الميزة', 'الحالة', 'ملاحظة'], rows)]), h('div', { cls: 'mut', text: 'يُفحص حيًّا عند فتح الصفحة.' })]);
        });
    }


    var BK_EXPORT = ['devices_saved', 'features', 'site_settings', 'content_sources', 'scheduled_tasks', 'reports', 'report_messages', 'suggestions', 'stats_daily', 'flow_daily'];
    var BK_RESTORE = ['devices_saved', 'features', 'site_settings', 'content_sources', 'scheduled_tasks'];
    function backup(A) {
        var h = A.h, out = h('div', { cls: 'mut', text: '' });
        function save(name, obj) { var a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })), download: name }); document.body.appendChild(a); a.click(); a.remove(); }
        function exp() {
            out.textContent = 'جارٍ التصدير…'; var res = { _meta: { app: 'almuslim', at: new Date().toISOString(), note: 'بلا بيانات شخصية للزوار؛ للاسترجاع تُستعاد جداول الإعدادات فقط' } };
            return BK_EXPORT.reduce(function (p, t) { return p.then(function () { return A.rest(t + '?select=*&limit=5000').then(function (d) { res[t] = d || []; }).catch(function () { res[t] = null; }); }); }, Promise.resolve()).then(function () {
                save('almuslim-backup-' + new Date().toISOString().slice(0, 10) + '.json', res); out.textContent = 'تم التصدير: ' + BK_EXPORT.map(function (t) { return t + '(' + (res[t] ? res[t].length : 'تعذّر') + ')'; }).join('، ');
            });
        }
        var fi = h('input', { type: 'file', accept: 'application/json,.json' });
        function imp() {
            var f = fi.files && fi.files[0]; if (!f) { A.toast('اختر ملف نسخة احتياطية أولًا'); return; }
            f.text().then(function (t) {
                var d; try { d = JSON.parse(t); } catch (e) { A.toast('الملف ليس JSON صالحًا'); return; }
                if (!d || !d._meta || d._meta.app !== 'almuslim') { A.toast('ليس ملف نسخة احتياطية للمسلم'); return; }
                var todo = BK_RESTORE.filter(function (k) { return Array.isArray(d[k]) && d[k].length; });
                if (!todo.length) { A.toast('لا توجد جداول إعدادات في الملف'); return; }
                return A.confirmBox('سيتم دمج (تحديث/إضافة) صفوف الإعدادات: ' + todo.join('، ') + '. لا يُحذف أي شيء. متابعة؟', false).then(function (ok) {
                    if (!ok) return;
                    return todo.reduce(function (p, k) { return p.then(function () { return A.raw('/rest/v1/' + k, { method: 'POST', tok: A.token(), prefer: 'resolution=merge-duplicates,return=minimal', body: d[k].filter(function (r) { return !(k === 'site_settings' && r && r.protected); }) }).then(function (r) { if (!r.ok) throw new Error(k + ': ' + r.status); }); }); }, Promise.resolve()).then(function () { out.textContent = 'تم الاسترجاع (دمج) لـ: ' + todo.join('، '); A.toast('تم الاسترجاع'); }).catch(function (e) { out.textContent = 'فشل: ' + e.message; });
                });
            });
        }
        return Promise.resolve(h('div', null, [h('h3', { text: 'مركز النسخ الاحتياطي' }),
            A.card('تصدير نسخة (JSON)', [h('div', { cls: 'mut', text: 'تُنزَّل على جهازك: الإعدادات والميزات والمهام والمصادر والبلاغات والاقتراحات والإحصائيات اليومية. لا تحتوي أرقام IP ولا بيانات أجهزة الزوار. ننصح بنسخة أسبوعيًا (الخطة المجانية بلا نسخ تلقائية).' }), h('button', { cls: 'btn', type: 'button', text: 'تنزيل نسخة احتياطية الآن', onclick: exp }), out]),
            A.card('استرجاع (دمج آمن)', [h('div', { cls: 'mut', text: 'يدمج جداول الإعدادات فقط (الميزات، إعدادات الموقع، مصادر المحتوى، المهام). لا يحذف شيئًا ولا يمس بيانات الزوار والبلاغات.' }), fi, h('button', { cls: 'btn alt', type: 'button', text: 'استرجاع من الملف', onclick: imp })])]));
    }
    var TIPS = {
        dash: 'ملخص عام للموقع: الزيارات والأقسام الأكثر استخدامًا. الأرقام تجميعية ولا تكشف هوية أحد.',
        feat: 'شغّل/أوقف أو أخفِ أقسام الموقع. الإيقاف لا يحذف أي بيانات للزوار.',
        ann: 'إعلانات عامة تظهر لكل الزوار كشريط في أسفل الشاشة (فوق شريط التنقل) ويستطيع الزائر إغلاقها. حدّد وقت البدء والانتهاء.',
        msg: 'رسائل خاصة تظهر للزائر أسفل الشاشة إن فعّل الاستقبال (قديم). للمراسلة الأشمل استخدم «المراسلات».',
        gen: 'اسم الموقع، وضع الموارد المنخفضة، ورسالة الترحيب والصيانة السريعة.',
        usage: 'استهلاك الخطة المجانية في Supabase. عند القرب من الحدود ارفع «وضع الموارد المنخفضة».',
        health: 'الأخطاء المجمّعة من متصفحات الزوار حسب القسم.',
        log: 'كل عملية إدارية تُسجَّل بتاريخها ونتيجتها.',
        acc: 'غيّر كلمة المرور (الحالية + الجديدة + التأكيد) وأدر جلسات الأجهزة. تبقى جلستك الحالية بعد التغيير وتُنهى الأخرى.',
        ver: 'النسخ والإصدارات ونظام التحديث.'
    };
    function theme() { var m; try { m = localStorage.getItem('adm-t') || ''; } catch (e) { m = ''; } if (m) document.documentElement.setAttribute('data-t', m); }
    theme();
    var iv = 0;
    window.__admX = {
        tips: TIPS,
        tabs: [['vis', 'مركز الزوار', visitors], ['dev', 'مركز الأجهزة', devices], ['jour', 'رحلة الزائر', journey], ['comms', 'المراسلات', comms], ['rep', 'البلاغات', reports], ['sug', 'الاقتراحات', suggestions], ['tasks', 'المهام التلقائية', tasks], ['src', 'مصادر المحتوى', sources], ['alerts', 'التنبيهات', alerts], ['maint', 'الصيانة المتقدمة', maint], ['devmode', 'وضع المطوّر', dev], ['backup', 'النسخ الاحتياطي', backup], ['status', 'تقرير حالة الميزات', status], ['guide', 'دليل الاستخدام', guide]],
        after: function (A, nav) {
            var cur = ''; try { cur = localStorage.getItem('adm-t') || ''; } catch (e) { }
            A.rest('admin_alerts?select=id&read=eq.false&archived=eq.false&limit=100').then(function (r) { if (!r || !r.length) return; var b = [].slice.call(nav.querySelectorAll('button')).filter(function (x) { return x.textContent.indexOf('التنبيهات') === 0; })[0]; if (b) b.appendChild(A.h('span', { cls: 'badge', text: String(r.length) })); }).catch(function () { });
            clearInterval(iv); /* لا تحديث تلقائي: يُحدَّث فقط عند ضغط زر «تحديث» لتوفير رصيد Supabase */
        }
    };
})();
