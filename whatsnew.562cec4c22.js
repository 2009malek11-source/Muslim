/* whatsnew.js — إشعار «ميزة جديدة»: لكل ميزة معرّف، وتُعرض الميزات التي لم يرها المستخدم مرة واحدة فقط.
 * لإضافة ميزة جديدة مستقبلًا: أضف سطرًا إلى FEATURES بمعرّف جديد. المستخدم الجديد كليًا لا يُزعَج بما كان موجودًا قبل أول زيارة. */
(function () {
    'use strict';
    var SEEN = 'muslim-wn-seen', FIRST = 'muslim-wn-first';
    var FEATURES = [
        { id: 'nova-look', t: 'شكل جديد', d: 'شكل مختلف، نفس الهوية والمحتوى.', page: 'home' }
    ];
    function ld(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
    function sv(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
    function run() {
        var seen = ld(SEEN, null);
        if (seen === null) {
            // أول تشغيل لهذا الإشعار: إن كان المستخدم قديمًا (لديه بيانات سابقة) نعرض له الجديد، وإن كان جديدًا نعدّ كل شيء مرئيًا
            var old = false; try { old = localStorage.length > 3; } catch (e) { }
            seen = old ? [] : FEATURES.map(function (f) { return f.id; }); sv(SEEN, seen);
        }
        var fresh = FEATURES.filter(function (f) { return seen.indexOf(f.id) < 0; });
        if (!fresh.length || document.getElementById('wnCard')) return;
        var c = document.createElement('div'); c.id = 'wnCard'; c.setAttribute('role', 'dialog');
        c.innerHTML = '<b>تحديث جديد</b><ul>' + fresh.map(function (f) { return '<li><b style="display:inline">' + f.t + '</b> — ' + f.d + '</li>'; }).join('') + '</ul><div class="wnB"><button type="button" class="primary" id="wnGo">' + (fresh[0].open || fresh[0].page ? 'جرّبها الآن' : 'حسنًا') + '</button><button type="button" id="wnLater">حسنًا</button></div>';
        document.body.appendChild(c);
        function done() { sv(SEEN, seen.concat(fresh.map(function (f) { return f.id; }))); c.remove(); }
        document.getElementById('wnLater').onclick = done;
        document.getElementById('wnGo').onclick = function () { var f = fresh[0]; done(); try { if (f.open) f.open(); else if (f.page && window.show) window.show(f.page); } catch (e) { } };
    }
    setTimeout(run, 2500);
    window.v122WhatsNew = { features: FEATURES, run: run };
})();
