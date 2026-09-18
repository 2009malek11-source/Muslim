// Quran M09alaroud — secure fatwa backend for Cloudflare Workers.
// Set OPENAI_API_KEY as a Worker secret. Never put the key in index.html or GitHub.
const ALLOWED_ORIGINS = new Set([
  'https://2009malek11-source.github.io'
]);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://2009malek11-source.github.io',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response('', {headers:cors});
    const url = new URL(request.url);
    if (url.pathname !== '/api/fatwa' || request.method !== 'POST')
      return new Response(JSON.stringify({error:'Not found'}), {status:404,headers:{...cors,'Content-Type':'application/json'}});
    try {
      const body = await request.json();
      const question = String(body?.question || '').trim();
      if (!question || question.length > 4000)
        return new Response(JSON.stringify({error:'سؤال غير صالح'}), {status:400,headers:{...cors,'Content-Type':'application/json'}});
      if (!env.OPENAI_API_KEY) throw new Error('missing_key');
      const r = await fetch('https://api.openai.com/v1/responses', {
        method:'POST',
        headers:{'Authorization':`Bearer ${env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'gpt-5.6-luna',
          tools:[{type:'web_search'}],
          instructions:`أنت مساعد بحث فقهي للموقع Quran M09alaroud. لا تصدر حكمًا شرعيًا من عندك ولا تجزم بالحلال أو الحرام بلا دليل. ابحث أولًا في مصادر فقهية موثوقة، وخصوصًا مواقع العلماء والجهات العلمية المعروفة مثل binbaz.org.sa و islamweb.net، ثم لخّص ما وجدته مع بيان المصدر. إذا اختلفت الفتاوى فاذكر الاختلاف بوضوح. إذا لم تجد مصدرًا موثوقًا فقل ذلك. لا تدّعي أنك مفتٍ. أعد JSON فقط بالشكل: {"answer":"...","sources":[{"title":"...","url":"..."}]}.` ,
          input: question
        })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error?.message || 'openai_error');
      const text = data.output_text || data.output?.flatMap(x=>x.content||[]).map(x=>x.text||'').join('') || '';
      let parsed;
      try { parsed = JSON.parse(text); } catch { parsed = {answer:text, sources:[]}; }
      const out = {answer:String(parsed.answer||'').trim(), sources:Array.isArray(parsed.sources)?parsed.sources.slice(0,8):[]};
      return new Response(JSON.stringify(out), {headers:{...cors,'Content-Type':'application/json'}});
    } catch (e) {
      return new Response(JSON.stringify({error:'تعذر تشغيل مساعد الفتوى الآن.'}), {status:500,headers:{...cors,'Content-Type':'application/json'}});
    }
  }
};
