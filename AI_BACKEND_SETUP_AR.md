# تشغيل مساعد الفتوى الذكي

الموقع نفسه ثابت ويُستضاف على GitHub Pages، لذلك لا نضع مفتاح الذكاء الاصطناعي داخله.
هذا المجلد يحتوي `worker.js` لخادم Cloudflare Workers.

1. أنشئ Worker جديدًا في Cloudflare والصق محتوى `worker.js`.
2. أضف Secret باسم `OPENAI_API_KEY` وضع مفتاح API في Secrets، وليس في GitHub.
3. انشر Worker ليكون مثلًا: `https://YOUR-WORKER.example.workers.dev/api/fatwa`.
4. افتح الموقع ثم من أدوات المطور نفّذ مرة واحدة:
   `localStorage.setItem('quran-m09-fatwa-api','https://YOUR-WORKER.example.workers.dev/api/fatwa')`
   ثم أعد تحميل الصفحة.
5. بعد ذلك زر "اسأل المساعد" يرسل السؤال إلى الخادم، والخادم يستدعي Responses API ويعيد الجواب والمصادر.

مهم: لا تضع مفتاح API في `index.html` أو في مستودع GitHub العام.


## النسخة V25.12 — ربط الواجهة بخادم الذكاء الاصطناعي
الملف `worker.js` هو خادم الفتوى، و`ai-config.js` هو المكان الوحيد الذي يحدد عنوان الخادم. لا تضع مفتاح OpenAI داخل `index.html` أو GitHub. بعد نشر الـ Worker، ضع عنوانه في `ai-config.js` بهذا الشكل:
`window.QM09_AI_ENDPOINT = 'https://اسم-العامل.workers.dev/api/fatwa';`
ثم ارفع الملفات إلى GitHub Pages. الخادم نفسه يحتفظ بالمفتاح كـ Secret.
