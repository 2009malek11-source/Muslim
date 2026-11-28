/* مركز تحكم المسلم — واجهة المدير الوحيد. لا يحتوي أي كلمة مرور أو سر. كل التحقق في الخادم (RLS + is_admin). */
(function () {
    'use strict';
    try { if (window.top !== window.self) { document.documentElement.style.display = 'none'; window.top.location = window.self.location.href; } } catch (e) { document.documentElement.style.display = 'none'; }
    var U = 'https://eriawmjzdfbiszklhfrx.supabase.co', K = 'sb_publishable_GMCG88gSNKyZMqRj1g2eWg_8qv2YDn9';
    var DOM = '@admin.almuslim.invalid', SK = 'al-admin-session';
    var app = document.getElementById('app'), S = null, view = 'dash', me = null;

    function h(tag, a, kids) {
        var e = document.createElement(tag);
        if (a) Object.keys(a).forEach(function (k) {
            if (k === 'text') e.textContent = a[k]; else if (k === 'cls') e.className = a[k];
            else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), a[k]); else if (a[k] !== false && a[k] != null) e.setAttribute(k, a[k] === true ? '' : a[k]);
        });
        (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
        return e;
    }
    function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
    function toast(m) { var t = h('div', { cls: 'toast', text: m }); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200); }
    function fmtB(n) { n = +n || 0; var u = ['B', 'KB', 'MB', 'GB']; var i = 0; while (n >= 1024 && i < 3) { n /= 1024; i++; } return n.toFixed(i ? 1 : 0) + ' ' + u[i]; }
    function ar(n) { return (+n || 0).toLocaleString('ar-EG'); }
    function ago(t) { var s = (Date.now() - new Date(t)) / 1000; return s < 90 ? 'الآن' : s < 3600 ? 'قبل ' + Math.round(s / 60) + ' د' : s < 86400 ? 'قبل ' + Math.round(s / 3600) + ' س' : new Date(t).toLocaleDateString('ar'); }
    function confirmBox(msg, danger) { return new Promise(function (res) { var ov = h('div', { cls: 'ov' }, [h('div', { cls: 'box' }, [h('b', { text: msg }), h('div', { cls: 'row' }, [h('button', { cls: 'btn alt', text: 'إلغاء', onclick: function () { ov.remove(); res(false); } }), h('button', { cls: 'btn' + (danger ? ' bad' : ''), text: 'تأكيد', onclick: function () { ov.remove(); res(true); } })])])]); document.body.appendChild(ov); }); }

    /* ---------- الجلسة ---------- */
    function save() { try { if (S) localStorage.setItem(SK, JSON.stringify(S)); else localStorage.removeItem(SK); } catch (e) { } }
    function jwt(t) { try { return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch (e) { return {}; } }
    function raw(path, o) {
        o = o || {}; var hd = { apikey: K, 'Content-Type': 'application/json' }; if (o.tok) hd.Authorization = 'Bearer ' + o.tok; else hd.Authorization = 'Bearer ' + K;
        if (o.prefer) hd.Prefer = o.prefer;
        return fetch(U + path, { method: o.method || 'GET', headers: hd, body: o.body ? JSON.stringify(o.body) : undefined, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer' });
    }
    function refresh() {
        if (!S || !S.refresh) return Promise.reject(new Error('no'));
        return raw('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: S.refresh } }).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('expired')); }).then(function (j) { S = { access: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in - 30) * 1000 }; save(); });
    }
    function api(path, o) {
        o = o || {};
        var go = function () { o.tok = S.access; return raw(path, o); };
        var p = (S && S.exp < Date.now()) ? refresh().then(go) : go();
        return p.then(function (r) {
            if (r.status === 401 || r.status === 403 && /JWT|session/i.test('')) return refresh().then(go).then(chk);
            return chk(r);
        });
        function chk(r) { if (r.status === 401) { S = null; save(); boot(); return Promise.reject(new Error('انتهت الجلسة')); } if (r.status === 204) return null; return r.text().then(function (t) { var j; try { j = t ? JSON.parse(t) : null; } catch (e) { j = null; } if (!r.ok) throw new Error((j && (j.message || j.msg || j.error_description)) || ('خطأ ' + r.status)); return j; }); }
    }
    var rest = function (q, o) { return api('/rest/v1/' + q, o); };
    var rpc = function (n, a) { return api('/rest/v1/rpc/' + n, { method: 'POST', body: a || {} }); };
    function log(a, d) { return rpc('log_activity', { p_action: a, p_detail: d || {} }).catch(function () { }); }

    /* ---------- الدخول ---------- */
    function loginView(msg) {
        clear(app);
        var u = h('input', { id: 'u', autocomplete: 'username', autocapitalize: 'none', spellcheck: 'false', 'aria-label': 'اسم المستخدم', dir: 'ltr' });
        var p = h('input', { id: 'p', type: 'password', autocomplete: 'current-password', 'aria-label': 'كلمة المرور', dir: 'ltr' });
        var er = h('div', { cls: 'err', text: msg || '' }), btn = h('button', { cls: 'btn', type: 'submit', text: 'دخول' });
        var f = h('form', { cls: 'box' }, [h('h1', { text: 'مركز تحكم المسلم' }), h('div', { cls: 'mut', text: 'دخول المدير فقط' }), h('label', null, ['اسم المستخدم', u]), h('label', null, ['كلمة المرور', p]), er, btn]);
        f.addEventListener('submit', function (ev) {
            ev.preventDefault(); btn.disabled = true; er.textContent = '';
            raw('/auth/v1/token?grant_type=password', { method: 'POST', body: { email: u.value.trim().toLowerCase() + DOM, password: p.value } })
                .then(function (r) { return r.ok ? r.json() : r.json().then(function () { throw new Error('بيانات الدخول غير صحيحة'); }); })
                .then(function (j) { S = { access: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in - 30) * 1000 }; save(); p.value = ''; return recheck(); })
                .catch(function (e) { S = null; save(); er.textContent = e.message || 'تعذّر الدخول'; btn.disabled = false; });
        });
        app.appendChild(h('div', { cls: 'login' }, [f]));
    }
    function recheck() {
        return rpc('admin_recheck').then(function (r) {
            return rest('admin_profiles?select=username,role,must_change_password').then(function (a) {
                if (!a || !a[0]) throw new Error('هذا الحساب لا يملك صلاحية المدير');
                me = a[0]; if (me.must_change_password) return forceChange(); shell();
            });
        }).catch(function (e) { S = null; save(); loginView(e.message); });
    }
    function forceChange() {
        clear(app);
        var c = h('input', { type: 'password', autocomplete: 'current-password', dir: 'ltr' }), n = h('input', { type: 'password', autocomplete: 'new-password', dir: 'ltr' }), n2 = h('input', { type: 'password', autocomplete: 'new-password', dir: 'ltr' }), er = h('div', { cls: 'err' });
        var f = h('form', { cls: 'box' }, [h('h1', { text: 'غيّر كلمة المرور الآن' }), h('div', { cls: 'mut', text: 'كلمة المرور الحالية مؤقتة. اختر كلمة قوية (12 حرفًا فأكثر) لا تستخدمها في موقع آخر.' }), h('label', null, ['كلمة المرور الحالية', c]), h('label', null, ['كلمة المرور الجديدة', n]), h('label', null, ['تأكيد الجديدة', n2]), er, h('button', { cls: 'btn', type: 'submit', text: 'حفظ ومتابعة' })]);
        f.addEventListener('submit', function (ev) { ev.preventDefault(); if (n.value !== n2.value) { er.textContent = 'التأكيد لا يطابق'; return; } if (n.value.length < 12) { er.textContent = 'يجب ألا تقل عن 12 حرفًا'; return; }
            rpc('admin_change_password', { p_current: c.value, p_new: n.value }).then(function () { me.must_change_password = false; toast('تم تغيير كلمة المرور'); shell(); }).catch(function (e) { er.textContent = e.message; }); });
        app.appendChild(h('div', { cls: 'login' }, [f]));
    }
    function logoutLocal() { var t = S && S.access; S = null; save(); if (t) raw('/auth/v1/logout?scope=local', { method: 'POST', tok: t }).catch(function () { }); loginView(); }

    /* ---------- الهيكل ---------- */
    var TABS = [['dash', 'الإحصاءات'], ['feat', 'مركز الميزات'], ['ann', 'الإعلانات'], ['msg', 'رسائل الزوار'], ['gen', 'إعدادات عامة'], ['usage', 'استهلاك الخطة المجانية'], ['health', 'الصحة والأخطاء'], ['log', 'سجل النشاط'], ['acc', 'إعدادات الحساب'], ['ver', 'النسخ والإصدارات']];
    function shell() {
        clear(app); var main = h('section', { cls: 'main', id: 'main' });
        var X = (window.__admX && window.__admX.tabs) || [], API = { h: h, clear: clear, toast: toast, ar: ar, ago: ago, confirmBox: confirmBox, rest: rest, rpc: rpc, raw: raw, card: card, stat: stat, list: list, sw: sw, reload: function () { shell(); }, token: function () { return S && S.access; }, K: K, U: U };
        var ALL = TABS.concat(X.map(function (x) { return [x[0], x[1]]; }));
        var nav = h('nav', null, [h('h2', { text: 'مركز تحكم المسلم' })].concat(ALL.map(function (t) { return h('button', { type: 'button', cls: view === t[0] ? 'on' : '', text: t[1], onclick: function () { view = t[0]; shell(); } }); }), [h('div', { cls: 'sp' }), h('button', { type: 'button', cls: 'refresh', text: '🔄 تحديث البيانات الآن', title: 'لا يوجد تحديث تلقائي حفاظًا على الرصيد؛ اضغط هنا عند الحاجة', onclick: function () { shell(); } }), h('button', { type: 'button', text: 'تبديل السمة', onclick: function () { var r = document.documentElement; r.setAttribute('data-t', r.getAttribute('data-t') === 'dark' ? 'light' : 'dark'); } }), h('button', { type: 'button', text: 'خروج من هذا الجهاز', onclick: logoutLocal })]));
        app.appendChild(h('div', { cls: 'shell' }, [nav, main]));
        var V = { dash: dash, feat: feat, ann: ann, msg: msgs, gen: gen, usage: usage, health: health, log: actlog, acc: acc, ver: ver }[view];
        if (!V) X.forEach(function (x) { if (x[0] === view) V = function () { return x[2](API); }; });
        if (!V) { view = 'dash'; V = dash; }
        try { if (window.__admX && window.__admX.after) window.__admX.after(API, nav); } catch (e) { }
        main.appendChild(h('div', { cls: 'mut', text: 'جارٍ التحميل…' }));
        Promise.resolve().then(function () { return V(); }).then(function (el) { clear(main); main.appendChild(el); try { var tp = (window.__admX && window.__admX.tips || {})[view]; if (tp) main.insertBefore(h('details', { cls: 'hint' }, [h('summary', { text: 'ℹ️ شرح هذه الصفحة' }), h('div', { cls: 'mut pre', text: tp })]), main.firstChild); } catch (e) { } }).catch(function (e) { clear(main); main.appendChild(h('div', { cls: 'card err', text: 'تعذّر التحميل: ' + e.message })); });
    }
    function sw(on, fn) { var i = h('input', { type: 'checkbox' }); i.checked = !!on; i.addEventListener('change', function () { fn(i.checked, i); }); return h('label', { cls: 'sw' }, [i, h('i')]); }
    function card(title, kids) { return h('div', { cls: 'card' }, [title ? h('h3', { text: title }) : null].concat(kids)); }
    function stat(n, l) { return h('div', { cls: 'card stat' }, [h('b', { text: n }), h('span', { text: l })]); }
    function list(map, lab) { var ks = Object.keys(map).sort(function (a, b) { return map[b] - map[a]; }).slice(0, 12), mx = ks.length ? map[ks[0]] : 1; if (!ks.length) return h('div', { cls: 'mut', text: 'لا بيانات بعد' });
        return h('div', null, ks.map(function (k) { var b = h('div', { cls: 'bar' }, [h('i')]); b.firstChild.style.width = Math.max(3, 100 * map[k] / mx) + '%'; return h('div', null, [h('div', { cls: 'row' }, [h('span', { text: (lab && lab[k]) || k }), h('b', { text: ar(map[k]) })]), b]); })); }

    /* ---------- الإحصاءات ---------- */
    var SEC = { home: 'الرئيسية', mushaf107: 'المصحف', quran: 'القرآن', readers: 'القراء', adhkar: 'الأذكار', khatmah: 'الختمة', ruqyah: 'الرقية', hadith107: 'الأحاديث', stories: 'السيرة والأنبياء', children: 'الأطفال', qibla: 'القبلة', mosques: 'المساجد', settings: 'الإعدادات', repeatAyah: 'تكرار الآيات' };
    var DEV = { mobile: 'جوال', tablet: 'لوحي', desktop: 'حاسوب', tv: 'تلفاز', other: 'أخرى' };
    function dash() {
        var from = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10), since = new Date(Date.now() - 3 * 60e3).toISOString();
        return Promise.all([rest('stats_daily?select=day,metric,dim,value&day=gte.' + from + '&limit=5000'), rest('live_visitors?select=sid,section,country&last_seen=gte.' + since + '&limit=1000')]).then(function (r) {
            var rows = r[0] || [], live = r[1] || [], T = {}, byDay = {}, M = function (m) { return T[m] || (T[m] = {}); };
            rows.forEach(function (x) { M(x.metric)[x.dim] = (M(x.metric)[x.dim] || 0) + (+x.value); if (x.metric === 'visits') byDay[x.day] = +x.value; });
            var tot = function (m) { var s = 0; Object.keys(M(m)).forEach(function (k) { s += M(m)[k]; }); return s; };
            var visits = tot('visits'), days = []; for (var i = 29; i >= 0; i--) days.push(new Date(Date.now() - i * 864e5).toISOString().slice(0, 10));
            var mx = Math.max.apply(null, days.map(function (d) { return byDay[d] || 0; }).concat(1)), hist = h('div', { cls: 'hist', role: 'img', 'aria-label': 'الزيارات اليومية آخر 30 يومًا' }, days.map(function (d) { var b = h('div', { title: d + ': ' + (byDay[d] || 0) }); b.style.height = Math.max(2, 100 * (byDay[d] || 0) / mx) + '%'; return b; }));
            var avg = tot('dur_n') ? Math.round(tot('dur_sum') / tot('dur_n')) : 0, hours = {}; Object.keys(M('hour')).forEach(function (k) { hours[k + ':00'] = M('hour')[k]; });
            var cc = new Intl.DisplayNames(['ar'], { type: 'region' }), cl = {}; Object.keys(M('country')).forEach(function (k) { try { cl[k] = k === 'ZZ' ? 'غير معروف' : cc.of(k); } catch (e) { cl[k] = k; } });
            var secsLive = {}; live.forEach(function (v) { secsLive[v.section || 'home'] = (secsLive[v.section || 'home'] || 0) + 1; });
            var sl = {}; Object.keys(SEC).forEach(function (k) { sl[k] = SEC[k]; });
            var dl = {}; Object.keys(DEV).forEach(function (k) { dl[k] = DEV[k]; });
            return h('div', null, [h('h3', { text: 'الإحصاءات (آخر 30 يومًا، مجهولة بالكامل)' }), h('div', { cls: 'grid' }, [stat(ar(live.length), 'متصلون الآن'), stat(ar(visits), 'إجمالي الزيارات'), stat(ar(tot('new')), 'زوار جدد'), stat(ar(tot('returning')), 'زوار عائدون'), stat(avg ? Math.round(avg / 60) + ' د' : '—', 'متوسط مدة الجلسة')]), card('الزيارات اليومية', [hist]),
                h('div', { cls: 'grid' }, [card('الدول', [list(M('country'), cl)]), card('الأجهزة', [list(M('device'), dl)]), card('الأنظمة', [list(M('os'))]), card('المتصفحات', [list(M('browser'))]), card('الأقسام الأكثر فتحًا', [list(M('section'), sl)]), card('الميزات الأكثر استخدامًا', [list(M('feature'), sl)]), card('ساعات الذروة (UTC)', [list(hours)]), card('المتصلون الآن حسب القسم', [list(secsLive, sl)])]),
                h('div', { cls: 'mut', text: 'تُجمع أعداد يومية فقط بلا هوية ولا بصمة جهاز. الدولة تُستخرج من ترويسة الشبكة في الخادم ولا يُحفظ العنوان.' })]);
        });
    }

    /* ---------- الميزات ---------- */
    function feat() {
        return rest('features?select=*&order=sort_order,key').then(function (rows) {
            var body = rows.map(function (f) {
                return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: f.label || f.key }), h('div', { cls: 'mut', text: f.key })]), h('div', { cls: 'row' }, [h('span', { cls: 'mut', text: 'ظاهرة في الرئيسية' }), sw(f.show_on_home, function (v, i) { upd(f, { show_on_home: v }, i); }), h('span', { cls: 'mut', text: 'مفعّلة' }), sw(f.enabled, function (v, i) { if (v) return upd(f, { enabled: true }, i); confirmBox('تعطيل «' + (f.label || f.key) + '» سيخفيها عن كل الزوار. متابعة؟', true).then(function (ok) { if (ok) upd(f, { enabled: false }, i); else i.checked = true; }); })])]);
            });
            function upd(f, patch, i) { rest('features?key=eq.' + encodeURIComponent(f.key), { method: 'PATCH', body: patch, prefer: 'return=minimal' }).then(function () { toast('تم الحفظ'); log('feature.update', { key: f.key, patch: patch }); }).catch(function (e) { toast(e.message); if (i) i.checked = !i.checked; }); }
            return h('div', null, [h('h3', { text: 'مركز التحكم بالميزات' }), card(null, body), h('div', { cls: 'mut', text: 'يطبّق الموقع التغيير خلال دقائق عند أول فتح أو عودة للاتصال. الميزات غير المذكورة تبقى كما هي.' })]);
        });
    }

    /* ---------- الإعلانات ---------- */
    function ann() {
        return rest('announcements?select=*&order=created_at.desc&limit=100').then(function (rows) {
            var t = h('input', { maxlength: 120 }), b = h('textarea', { maxlength: 1000 }), k = h('select', null, [['info', 'معلومة'], ['feature', 'ميزة جديدة'], ['update', 'تحديث'], ['maintenance', 'صيانة'], ['welcome', 'ترحيب']].map(function (x) { return h('option', { value: x[0], text: x[1] }); })), e = h('input', { type: 'datetime-local' }), msg = h('div', { cls: 'err' });
            var add = h('button', { cls: 'btn', type: 'button', text: 'نشر الإعلان', onclick: function () { if (!t.value.trim() || !b.value.trim()) { msg.textContent = 'العنوان والنص مطلوبان'; return; } rest('announcements', { method: 'POST', prefer: 'return=minimal', body: { title: t.value.trim(), body: b.value.trim(), kind: k.value, placement: 'banner', active: true, starts_at: new Date().toISOString(), ends_at: e.value ? new Date(e.value).toISOString() : null } }).then(function () { log('announcement.create', { title: t.value.trim() }); toast('نُشر'); shell(); }).catch(function (x) { msg.textContent = x.message; }); } });
            return h('div', null, [h('h3', { text: 'الإعلانات والرسائل العامة' }), card('إعلان جديد', [h('label', null, ['العنوان', t]), h('label', null, ['النص', b]), h('label', null, ['النوع', k]), h('label', null, ['ينتهي في (اختياري)', e]), msg, add]),
                card('الإعلانات السابقة', rows.length ? rows.map(function (a) { return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: a.title }), h('div', { cls: 'mut', text: a.body.slice(0, 140) })]), h('div', { cls: 'row' }, [sw(a.active, function (v) { rest('announcements?id=eq.' + a.id, { method: 'PATCH', body: { active: v }, prefer: 'return=minimal' }).then(function () { toast('تم'); }).catch(function (x) { toast(x.message); }); }), h('button', { cls: 'btn bad sm', type: 'button', text: 'حذف', onclick: function () { confirmBox('حذف هذا الإعلان نهائيًا؟', true).then(function (ok) { if (ok) rest('announcements?id=eq.' + a.id, { method: 'DELETE', prefer: 'return=minimal' }).then(function () { log('announcement.delete', { title: a.title }); shell(); }); }); } })])]); }) : [h('div', { cls: 'mut', text: 'لا إعلانات' })])]);
        });
    }

    /* ---------- رسائل الزوار (بموافقتهم فقط) ---------- */
    function msgs() {
        return Promise.all([rest('visitor_messages?select=*&order=created_at.desc&limit=100'), rest('live_visitors?select=vkey,country,device,last_seen&vkey=not.is.null&order=last_seen.desc&limit=50')]).then(function (r) {
            var rows = r[0], vis = r[1], to = h('select', null, vis.map(function (v) { return h('option', { value: v.vkey, text: (v.device || '') + ' · ' + (v.country || '') + ' · ' + ago(v.last_seen) + ' · ' + v.vkey.slice(0, 8) }); })), t = h('input', { maxlength: 120 }), b = h('textarea', { maxlength: 1000 }), er = h('div', { cls: 'err' });
            if (!vis.length) to.appendChild(h('option', { value: '', text: 'لا زوار فعّلوا صندوق الرسائل حاليًا' }));
            return h('div', null, [h('h3', { text: 'التواصل الفردي مع الزوار' }), h('div', { cls: 'mut', text: 'تظهر هنا فقط أجهزة الزوار الذين فعّلوا «استقبال رسائل المسلم» من الإعدادات. المعرّف عشوائي محلي ولا يكشف هوية.' }),
                card('رسالة جديدة', [h('label', null, ['إلى', to]), h('label', null, ['العنوان', t]), h('label', null, ['الرسالة', b]), er, h('button', { cls: 'btn', type: 'button', text: 'إرسال', onclick: function () { if (!to.value) { er.textContent = 'اختر زائرًا'; return; } if (!t.value.trim() || !b.value.trim()) { er.textContent = 'العنوان والرسالة مطلوبان'; return; } rest('visitor_messages', { method: 'POST', prefer: 'return=minimal', body: { vkey: to.value, title: t.value.trim(), body: b.value.trim() } }).then(function () { log('visitor.message', {}); toast('أُرسلت'); shell(); }).catch(function (x) { er.textContent = x.message; }); } })]),
                card('المرسلة', rows.length ? rows.map(function (m) { return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: m.title }), h('div', { cls: 'mut', text: m.body.slice(0, 100) + ' · ' + m.vkey.slice(0, 8) })]), h('div', { cls: 'row' }, [h('span', { cls: 'tag ' + (m.read_at ? 'ok' : m.delivered_at ? 'warn' : ''), text: m.read_at ? 'مقروءة' : m.delivered_at ? 'وصلت' : 'بالانتظار' }), h('button', { cls: 'btn alt sm', type: 'button', text: m.archived ? 'استعادة' : 'أرشفة', onclick: function () { rest('visitor_messages?id=eq.' + m.id, { method: 'PATCH', body: { archived: !m.archived }, prefer: 'return=minimal' }).then(shell); } }), h('button', { cls: 'btn bad sm', type: 'button', text: 'حذف', onclick: function () { confirmBox('حذف الرسالة؟', true).then(function (ok) { if (ok) rest('visitor_messages?id=eq.' + m.id, { method: 'DELETE', prefer: 'return=minimal' }).then(shell); }); } })])]); }) : [h('div', { cls: 'mut', text: 'لا رسائل' })])]);
        });
    }

    /* ---------- الإعدادات العامة ---------- */
    function gen() {
        return rest('site_settings?select=*').then(function (rows) {
            var S_ = {}; rows.forEach(function (r) { S_[r.key] = r; });
            function put(k, v) { return rest('site_settings?key=eq.' + k, { method: 'PATCH', body: { value: v, updated_at: new Date().toISOString() }, prefer: 'return=minimal' }).then(function () { toast('تم الحفظ'); log('settings.update', { key: k }); }).catch(function (e) { toast(e.message); }); }
            var mm = S_.maintenance ? S_.maintenance.value : {}, mt = h('input', { value: mm.message || '', maxlength: 300 }), wl = S_.welcome ? S_.welcome.value : {}, wt = h('input', { value: wl.title || '', maxlength: 120 }), wb = h('textarea', { maxlength: 400 }); wb.value = wl.body || ''; var nm = h('input', { value: (S_.site_name && S_.site_name.value) || '', maxlength: 40 });
            return h('div', null, [h('h3', { text: 'الإعدادات العامة' }),
                card('وضع الصيانة', [h('div', { cls: 'row' }, [h('span', { text: 'تفعيل شريط الصيانة للزوار' }), sw(mm.on, function (v, i) { confirmBox(v ? 'سيظهر شريط الصيانة لكل الزوار. متابعة؟' : 'إيقاف شريط الصيانة؟', v).then(function (ok) { if (ok) put('maintenance', { on: v, message: mt.value }); else i.checked = !v; }); })]), h('label', null, ['رسالة الصيانة', mt]), h('button', { cls: 'btn alt', type: 'button', text: 'حفظ الرسالة', onclick: function () { put('maintenance', { on: !!mm.on, message: mt.value }); } })]),
                card('رسالة الترحيب', [h('label', null, ['العنوان', wt]), h('label', null, ['النص', wb]), h('div', { cls: 'row' }, [h('span', { text: 'تفعيل' }), sw(wl.on, function (v) { put('welcome', { on: v, title: wt.value, body: wb.value }); })]), h('button', { cls: 'btn alt', type: 'button', text: 'حفظ', onclick: function () { put('welcome', { on: !!wl.on, title: wt.value, body: wb.value }); } })]),
                card('اسم الموقع', [h('label', null, ['الاسم', nm]), h('button', { cls: 'btn alt', type: 'button', text: 'حفظ', onclick: function () { put('site_name', nm.value.trim()); } })]),
                card('إعدادات محمية (لا تُعدَّل من هنا)', [h('div', { cls: 'row' }, [h('span', { text: 'وضع توفير الموارد' }), h('span', { cls: 'tag ' + (S_.low_resource_mode && S_.low_resource_mode.value === true ? 'warn' : 'ok'), text: S_.low_resource_mode && S_.low_resource_mode.value === true ? 'مفعّل تلقائيًا' : 'غير مفعّل' })]), h('div', { cls: 'row' }, [h('span', { text: 'فاصل الإحصاءات' }), h('span', { text: ((S_.telemetry_interval_s || {}).value || 120) + ' ثانية' })])])]);
        });
    }

    /* ---------- استهلاك الخطة ---------- */
    function usage() {
        return rpc('admin_usage_snapshot').then(function (s) {
            var rows = (s.items || []).map(function (i) {
                if (i.available === false) return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: i.label }), h('div', { cls: 'mut', text: i.note })]), h('span', { cls: 'tag', text: 'غير متاح للمراقبة المباشرة' })]);
                var bar = h('div', { cls: 'bar' }, [h('i', { cls: i.level })]); bar.firstChild.style.width = Math.min(100, i.percent) + '%';
                var fmt = i.unit === 'bytes' ? fmtB : ar;
                return h('div', { cls: 'card' }, [h('div', { cls: 'row' }, [h('b', { text: i.label }), h('span', { cls: 'tag ' + (i.level === 'ok' ? 'ok' : i.level === 'warn' ? 'warn' : 'bad'), text: ar(i.percent) + '%' })]), bar, h('div', { cls: 'mut', text: fmt(i.used) + ' من ' + fmt(i.limit) + (i.source === 'self_counted' ? ' (عدّاد ذاتي)' : ' (قراءة مباشرة)') }), i.note ? h('div', { cls: 'mut', text: i.note }) : null]);
            });
            var alert = s.max_percent >= 95 ? 'تحذير حرج: اقتربت من حد الخطة المجانية' : s.max_percent >= 85 ? 'تنبيه مرتفع: فُعّل وضع توفير الموارد تلقائيًا' : s.max_percent >= 70 ? 'تنبيه: تجاوزت 70% من أحد الحدود' : 'كل شيء ضمن الحدود المجانية';
            return h('div', null, [h('h3', { text: 'مراقب استهلاك الخطة المجانية' }), h('div', { cls: 'card' }, [h('b', { text: alert }), h('div', { cls: 'mut', text: 'آخر فحص: ' + new Date(s.checked_at).toLocaleString('ar') + ' · لا يُفعَّل أي مدفوع تلقائيًا. عند 85% يخفّض الموقع عمليات التتبع الاختيارية دون المساس بالأمان.' })])].concat(rows, [card('أحجام الجداول', [h('table', null, [h('tr', null, [h('th', { text: 'الجدول' }), h('th', { text: 'الحجم' }), h('th', { text: 'الصفوف تقريبًا' })])].concat((s.tables || []).map(function (t) { return h('tr', null, [h('td', { text: t.t }), h('td', { text: fmtB(t.bytes) }), h('td', { text: ar(t.rows) })]); })))]), h('div', { cls: 'mut', text: 'تنبيه: مشروع Supabase المجاني يُوقَف تلقائيًا بعد أسبوع دون نشاط؛ يكفي فتح هذه اللوحة أو الموقع مرة أسبوعيًا.' })]));
        });
    }

    /* ---------- الصحة والأخطاء ---------- */
    function health() {
        var from = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10), t0 = performance.now();
        return Promise.all([rest('errors_daily?select=*&day=gte.' + from + '&order=count.desc&limit=60'), raw('/functions/v1/collect', { method: 'OPTIONS' }).then(function (r) { return r.status < 500; }).catch(function () { return false; })]).then(function (r) {
            var rows = r[0], ms = Math.round(performance.now() - t0);
            return h('div', null, [h('h3', { text: 'الصحة ومراقبة الأخطاء' }), h('div', { cls: 'grid' }, [stat(ms + ' ms', 'زمن استجابة قاعدة البيانات'), stat(r[1] ? 'يعمل' : 'لا يستجيب', 'دالة جمع الإحصاءات'), stat(ar(rows.reduce(function (a, x) { return a + x.count; }, 0)), 'أخطاء واجهة (7 أيام)')]),
                card('أخطاء الواجهة المجمّعة', rows.length ? [h('table', null, [h('tr', null, ['اليوم', 'القسم', 'النوع', 'الرسالة', 'العدد'].map(function (x) { return h('th', { text: x }); }))].concat(rows.map(function (x) { return h('tr', null, [x.day, x.section, x.kind, x.msg, ar(x.count)].map(function (c) { return h('td', { text: String(c) }); })); })))] : [h('div', { cls: 'mut', text: 'لا أخطاء مسجّلة' })])]);
        });
    }
    function actlog() {
        return rest('activity_log?select=*&order=at.desc&limit=150').then(function (rows) {
            return h('div', null, [h('h3', { text: 'سجل النشاط' }), card(null, [h('table', null, [h('tr', null, ['الوقت', 'الإجراء', 'النتيجة', 'تفاصيل'].map(function (x) { return h('th', { text: x }); }))].concat(rows.map(function (x) { return h('tr', null, [h('td', { text: new Date(x.at).toLocaleString('ar') }), h('td', { text: x.action }), h('td', null, [h('span', { cls: 'tag ' + (x.ok ? 'ok' : 'bad'), text: x.ok ? 'نجح' : 'فشل' })]), h('td', { text: JSON.stringify(x.detail || {}).slice(0, 120) })]); })))])]);
        });
    }

    /* ---------- الحساب والجلسات ---------- */
    function acc() {
        var cur = jwt(S.access).session_id;
        return rpc('admin_list_sessions').then(function (ss) {
            var u = h('input', { value: me.username, dir: 'ltr', autocomplete: 'off' }), pw = h('input', { type: 'password', autocomplete: 'current-password', dir: 'ltr' }), er = h('div', { cls: 'err' });
            var c1 = h('input', { type: 'password', autocomplete: 'current-password', dir: 'ltr' }), n1 = h('input', { type: 'password', autocomplete: 'new-password', dir: 'ltr' }), n2 = h('input', { type: 'password', autocomplete: 'new-password', dir: 'ltr' }), er2 = h('div', { cls: 'err' });
            return h('div', null, [h('h3', { text: 'إعدادات الحساب' }),
                card('الأجهزة المسجَّل دخولها', (ss || []).map(function (s) { var isMe = s.id === cur; return h('div', { cls: 'row' }, [h('div', null, [h('b', { text: (isMe ? 'هذا الجهاز · ' : '') + (s.user_agent || 'جهاز غير معروف').slice(0, 70) }), h('div', { cls: 'mut', text: 'آخر نشاط: ' + ago(s.refreshed_at || s.updated_at || s.created_at) })]), isMe ? h('span', { cls: 'tag ok', text: 'الحالية' }) : h('button', { cls: 'btn bad sm', type: 'button', text: 'إنهاء هذه الجلسة', onclick: function () { confirmBox('تسجيل الخروج من هذا الجهاز؟', true).then(function (ok) { if (ok) rpc('admin_revoke_session', { p_id: s.id }).then(function () { log('session.revoke', {}); toast('أُنهيت'); shell(); }).catch(function (e) { toast(e.message); }); }); } })]); }).concat([h('div', { cls: 'row' }, [
                    h('button', { cls: 'btn alt', type: 'button', text: 'خروج من هذا الجهاز', onclick: logoutLocal }),
                    h('button', { cls: 'btn alt', type: 'button', text: 'خروج من الأجهزة الأخرى', onclick: function () { confirmBox('إنهاء كل الجلسات الأخرى؟', true).then(function (ok) { if (ok) rpc('admin_revoke_others').then(function () { toast('تم'); shell(); }); }); } }),
                    h('button', { cls: 'btn bad', type: 'button', text: 'خروج من جميع الأجهزة', onclick: function () { confirmBox('سيُنهى الدخول على كل الأجهزة بما فيها هذا. متابعة؟', true).then(function (ok) { if (ok) rpc('admin_revoke_all').then(function () { S = null; save(); loginView('أُنهيت كل الجلسات'); }); }); } }),
                    h('button', { cls: 'btn alt', type: 'button', text: 'إعادة التحقق من الصلاحيات', onclick: function () { rpc('admin_recheck').then(function () { toast('الصلاحيات سليمة ✔'); }).catch(function (e) { toast(e.message); }); } })])])),
                card('تغيير اسم المستخدم', [h('label', null, ['اسم المستخدم الجديد (حروف لاتينية وأرقام و _ . -)', u]), h('label', null, ['كلمة المرور الحالية للتأكيد', pw]), er, h('button', { cls: 'btn', type: 'button', text: 'حفظ الاسم', onclick: function () { rpc('admin_change_username', { p_new: u.value.trim(), p_password: pw.value }).then(function () { me.username = u.value.trim(); pw.value = ''; toast('تم التغيير'); }).catch(function (e) { er.textContent = e.message; }); } })]),
                card('تغيير كلمة المرور', [h('label', null, ['الحالية', c1]), h('label', null, ['الجديدة (12 حرفًا فأكثر؛ أحرف إنجليزية وأرقام ورموز)', n1]), h('label', null, ['تأكيد كلمة المرور الجديدة', n2]), er2, h('button', { cls: 'btn', type: 'button', text: 'حفظ كلمة المرور', onclick: function () { er2.className = 'err'; if (n1.value.length < 12) { er2.textContent = 'يجب ألا تقل عن 12 حرفًا'; return; } if (n1.value !== n2.value) { er2.textContent = 'التأكيد لا يطابق كلمة المرور الجديدة'; return; } rpc('admin_change_password', { p_current: c1.value, p_new: n1.value }).then(function () { c1.value = n1.value = n2.value = ''; er2.className = 'ok'; er2.textContent = '✔ تم تغيير كلمة المرور بنجاح. بقيت جلسة هذا الجهاز، وأُنهيت الجلسات الأخرى.'; toast('تم التغيير'); }).catch(function (e) { er2.textContent = e.message; }); } })])]);
        });
    }

    /* ---------- النسخ والإصدارات ---------- */
    function ver() {
        return fetch('version.json', { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }).then(function (v) {
            function exp(name, q) { return h('button', { cls: 'btn alt', type: 'button', text: 'تصدير ' + name + ' (JSON)', onclick: function () { rest(q).then(function (d) { var a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' })), download: 'almuslim-' + name + '-' + new Date().toISOString().slice(0, 10) + '.json' }); document.body.appendChild(a); a.click(); a.remove(); log('export', { name: name }); }).catch(function (e) { toast(e.message); }); } }); }
            return h('div', null, [h('h3', { text: 'النسخ الاحتياطي والإصدارات' }),
                card('النسخ الاحتياطي — ما هو متاح فعلًا', [h('div', { cls: 'mut', text: 'الخطة المجانية في Supabase لا توفّر نسخًا قابلة للتنزيل ولا استرجاعًا لنقطة زمنية، ولن يُفعَّل أي شيء مدفوع. البديل المجاني: تصدير بيانات الإعدادات إلى ملف JSON تحفظه عندك.' }), h('div', { cls: 'row' }, [exp('الميزات', 'features?select=*'), exp('الإعدادات', 'site_settings?select=*'), exp('الإعلانات', 'announcements?select=*'), exp('الإحصاءات', 'stats_daily?select=*&limit=10000')])]),
                card('إصدار الموقع المنشور', [h('div', { cls: 'row' }, [h('span', { text: 'الإصدار' }), h('b', { text: String(v.version || v.v || v.build || 'غير متاح') })]), h('div', { cls: 'row' }, [h('span', { text: 'معرّف البناء' }), h('b', { text: String(v.build || v.id || v.bid || '—').slice(0, 24) })]), h('div', { cls: 'mut', text: 'ينشر المدير إصدارًا جديدًا برفع ملفات الموقع إلى GitHub؛ يكتشفه المستخدمون ويظهر لهم «يتوفر تحديث جديد لموقع المسلم». للتراجع: أعد رفع ملفات الإصدار السابق (احتفظ بنسخة من كل ملف zip).' })])]);
        });
    }

    function boot() { try { S = JSON.parse(localStorage.getItem(SK) || 'null'); } catch (e) { S = null; } if (S && S.access) recheck(); else loginView(); }
    boot();
})();
