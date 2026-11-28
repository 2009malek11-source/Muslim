/* خلفية من صورك: اختر صورة من معرض جهازك لتصبح خلفية الموقع. تُحفظ على جهازك فقط (IndexedDB) ولا تُرفع لأي مكان. */
(function () {
    'use strict';
    var DB = 'muslim-bg-user', ST = 'imgs', MAXSIDE = 1600, MAXN = 12;
    var $ = function (id) { return document.getElementById(id); };
    function toast(m) { if (window.toast) window.toast(m); }
    function open() {
        return new Promise(function (ok, no) {
            if (!window.indexedDB) return no(new Error('idb'));
            var q = indexedDB.open(DB, 1);
            q.onupgradeneeded = function () { q.result.createObjectStore(ST, { keyPath: 'id' }); };
            q.onsuccess = function () { ok(q.result); }; q.onerror = function () { no(q.error); };
        });
    }
    function tx(mode, fn) { return open().then(function (db) { return new Promise(function (ok, no) { var t = db.transaction(ST, mode), s = t.objectStore(ST), r = fn(s); t.oncomplete = function () { ok(r && r.result); }; t.onerror = t.onabort = function () { no(t.error); }; }); }); }
    var all = function () { return tx('readonly', function (s) { return s.getAll(); }); };
    var put = function (rec) { return tx('readwrite', function (s) { return s.put(rec); }); };
    var del = function (id) { return tx('readwrite', function (s) { return s.delete(id); }); };

    function decode(file) {
        if (window.createImageBitmap) return createImageBitmap(file).catch(function () { return viaImg(file); });
        return viaImg(file);
    }
    function viaImg(file) { return new Promise(function (ok, no) { var u = URL.createObjectURL(file), im = new Image(); im.onload = function () { URL.revokeObjectURL(u); ok(im); }; im.onerror = function () { URL.revokeObjectURL(u); no(new Error('decode')); }; im.src = u; }); }
    function shrink(file) {
        return decode(file).then(function (im) {
            var w = im.width || im.naturalWidth, h = im.height || im.naturalHeight, k = Math.min(1, MAXSIDE / Math.max(w, h)), W = Math.round(w * k), H = Math.round(h * k);
            var c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').drawImage(im, 0, 0, W, H);
            return new Promise(function (ok, no) { c.toBlob(function (b) { b ? ok({ blob: b, w: W, h: H }) : no(new Error('blob')); }, 'image/jpeg', 0.82); });
        });
    }
    function reg(rec, n) {
        var B = window.MuslimBg; if (!B) return null;
        var url = URL.createObjectURL(rec.blob);
        var m = { id: rec.id, name: rec.name || ('صورتي ' + n), w: rec.w, h: rec.h, file: url, thumb: url, user: 1 };
        B.images.push(m); return m;
    }
    function optEl(m) {
        var w = document.createElement('div'); w.className = 'bgWrap';
        var b = document.createElement('button'); b.type = 'button'; b.className = 'bgOpt'; b.setAttribute('data-id', m.id);
        var im = document.createElement('img'); im.alt = m.name; im.src = m.thumb;
        var t = document.createElement('b'); t.textContent = m.name; var s = document.createElement('small'); s.textContent = m.w + ' × ' + m.h + ' بكسل';
        b.appendChild(im); b.appendChild(t); b.appendChild(s);
        var x = document.createElement('div'); x.className = 'bgDel'; x.setAttribute('role', 'button'); x.setAttribute('tabindex', '0'); x.setAttribute('aria-label', 'حذف الصورة'); x.setAttribute('data-del', m.id); x.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg><span>حذف</span>';
        w.appendChild(b); w.appendChild(x); return w;
    }
    function mount() {
        var g = $('bgGrid'); if (!g) return false;
        if ($('bgAddBtn')) return true;
        var add = document.createElement('label'); add.className = 'bgOpt bgAdd'; add.id = 'bgAddBtn';
        add.innerHTML = '<div class="bgNone">＋<br>أضف صورة من جهازك</div><b>صوري</b><small>تبقى على جهازك فقط</small>';
        var f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*'; f.multiple = true; f.hidden = true; add.appendChild(f);
        f.onchange = function () { var fs = [].slice.call(f.files || []); f.value = ''; addFiles(fs); };
        g.insertBefore(add, g.children[1] || null);
        g.addEventListener('click', function (e) {
            var d = e.target.closest && e.target.closest('.bgDel'); if (!d) return;
            e.stopPropagation(); e.preventDefault(); remove(d.getAttribute('data-del'));
        }, true);
        g.addEventListener('keydown', function (e) { var d = e.target.closest && e.target.closest('.bgDel'); if (d && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); remove(d.getAttribute('data-del')); } });
        (window.MuslimBg.images || []).filter(function (m) { return m.user; }).forEach(function (m) { g.appendChild(optEl(m)); });
        if (window.MuslimBg) window.MuslimBg.set(window.MuslimBg.get());
        return true;
    }
    function count() { return (window.MuslimBg.images || []).filter(function (m) { return m.user; }).length; }
    function addFiles(fs) {
        fs = fs.filter(function (f) { return /^image\//.test(f.type) && f.size < 25 * 1048576; });
        if (!fs.length) { toast('اختر صورة صالحة (حتى 25 ميغابايت)'); return; }
        var last = null, chain = Promise.resolve();
        fs.forEach(function (f) {
            chain = chain.then(function () {
                if (count() >= MAXN) { toast('الحد الأقصى ' + MAXN + ' صورة. احذف صورة لإضافة أخرى.'); return; }
                return shrink(f).then(function (r) {
                    var rec = { id: 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), blob: r.blob, w: r.w, h: r.h, name: 'صورتي ' + (count() + 1) };
                    return put(rec).then(function () { var m = reg(rec, count() + 1); if (m && $('bgGrid')) $('bgGrid').appendChild(optEl(m)); last = rec.id; });
                }).catch(function () { toast('تعذّرت إضافة إحدى الصور'); });
            });
        });
        chain.then(function () { if (last) { window.MuslimBg.set(last); toast('تم تعيين الصورة كخلفية للموقع'); } });
    }
    function remove(id) {
        var B = window.MuslimBg; if (!B) return;
        var i = B.images.findIndex(function (m) { return m.id === id; }); if (i < 0) return;
        if (B.get() === id) B.set('');
        try { URL.revokeObjectURL(B.images[i].file); } catch (e) { }
        B.images.splice(i, 1); del(id).catch(function () { });
        var el = document.querySelector('#bgGrid .bgDel[data-del="' + id + '"]'); if (el && el.parentNode) el.parentNode.remove();
        toast('حُذفت الصورة');
    }
    function boot() {
        if (!window.MuslimBg) return;
        all().then(function (list) {
            (list || []).sort(function (a, b) { return a.id < b.id ? -1 : 1; }).forEach(function (r, i) { reg(r, i + 1); });
            window.MuslimBg.set(window.MuslimBg.get());
        }).catch(function () { });
        var n = 0, iv = setInterval(function () { if (mount() || ++n > 120) clearInterval(iv); }, 600);
        try { new MutationObserver(function () { mount(); }).observe(document.body, { childList: true, subtree: true }); } catch (e) { }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
