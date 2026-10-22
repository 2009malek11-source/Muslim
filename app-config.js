// إعدادات اختيارية للتطبيق (لا تضع هنا أي مفتاح سري — هذا الملف علني).
// 1) وسيط Overpass (cloudflare-worker-overpass.js): يخفّف الحمل عن خرائط OSM المجانية. اتركه فارغًا لاستخدام الخوادم العامة.
window.OVERPASS_PROXY = '';
// 2) وسيط صوت archive.org (cloudflare-worker-audio.js): حلّ احتياطي لقرّاء archive.org على الآيفون. اتركه فارغًا إن عملوا بدونه.
window.AUDIO_PROXY = '';
