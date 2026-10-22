// وسيط Overpass مع تخزين مؤقت 24 ساعة على شبكة Cloudflare.
// النشر: Workers & Pages ← Create Worker ← الصق هذا الملف ← انسخ الرابط إلى app-config.js (OVERPASS_PROXY).
// التطبيق يقرّب مركز البحث لشبكة 0.01° فتتكرر الطلبات نفسها بين المستخدمين ويُجاب معظمها من الذاكرة.
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST,OPTIONS','Access-Control-Allow-Headers':'content-type'};
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
export default{
  async fetch(req,env,ctx){
    if(req.method==='OPTIONS')return new Response(null,{status:204,headers:CORS});
    if(req.method!=='POST')return new Response('POST only',{status:405,headers:CORS});
    const body=await req.text();
    if(body.length>4000||!/^data=/.test(body))return new Response('bad request',{status:400,headers:CORS});
    const key=new Request('https://cache.local/ovp/'+await sha(body));
    const cache=caches.default;let hit=await cache.match(key);
    if(hit)return new Response(hit.body,{status:200,headers:{...CORS,'content-type':'application/json','x-cache':'HIT'}});
    const up=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body,headers:{'content-type':'application/x-www-form-urlencoded','user-agent':'muslim-app-proxy/1.0'}});
    if(!up.ok)return new Response('upstream '+up.status,{status:502,headers:CORS});
    const txt=await up.text();
    const res=new Response(txt,{status:200,headers:{'content-type':'application/json','cache-control':'public, max-age=86400'}});
    ctx.waitUntil(cache.put(key,res.clone()));
    return new Response(txt,{status:200,headers:{...CORS,'content-type':'application/json','x-cache':'MISS'}});
  }
};
