// إعدادات اختيارية للتطبيق (لا تضع هنا أي مفتاح سري — هذا الملف علني).
window.OVERPASS_PROXY = '';
window.AUDIO_PROXY = '';
/* تسجيلات الأحاديث البشرية: عرّف الدالة عند توفر مصدر صوتي بشري موثّق، وتظهر أزرار «استماع» تلقائيًا.
   مثال (يحتاج مصدرًا حقيقيًا تملك حق استخدامه):
   window.HADITH_AUDIO = function(book,id){ return 'https://example.org/hadith/'+book+'/'+id+'.mp3'; };
*/
/* ميزة «تواصل معنا» مخفية الآن. عند وضع بريد الاستلام هنا يظهر نموذج التواصل في الرئيسية تلقائيًا:
   window.CONTACT_EMAIL = 'name@example.com'; */
/* خرائط Google كمصدر داخل قائمة المساجد (اختياري): ضع مفتاح Places API (New) هنا وقيّده بنطاق موقعك من Google Cloud.
   window.GOOGLE_PLACES_KEY = 'YOUR_KEY'; */

/* ===== إشعارات الخلفية (Web Push) — v115 =====
   PUSH_API: رابط خادم الإشعارات بعد نشره على Cloudflare (بدون / في الآخر)، مثال: https://al-muslim-push.اسمك.workers.dev
   اتركه فارغًا إن لم تنشر الخادم بعد (تعمل الإشعارات والتطبيق مفتوح فقط).
   VAPID_PUBLIC_KEY: المفتاح العام (علني بطبيعته). المفتاح الخاص لا يوضع هنا أبدًا — يوضع في Cloudflare كـ Secret. */
window.PUSH_API = '';
window.VAPID_PUBLIC_KEY = 'BKkq9ca9Anr6RNYACEMgC_1VlBUBxDKLv4lmpma8_WKFJgQk2P6wWBHioTsyqV5CqXJ_oTTDFk-1Ms-dEtEJ_EY';
