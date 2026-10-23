/* Optional My AI Cloudflare Worker. Never put API keys in GitHub Pages. */
const SYSTEM='Du är My, en vänlig och noggrann svensk teknikassistent i PassBit Titanium. Hjälp med verkstadsteknik, hydraulik, pneumatik, Parker/Ermeto-kopplingar, slipning, mätteknik, maskinfelsökning och FAT/SAT. Svara på svenska. Visa formler, enheter, antaganden och kontrollsteg. Hitta aldrig på Parker-artikelnummer, tryckklasser eller verifierade dimensioner. Skilj på bar(g) och bar(a), N och kN. Vid riskfyllt arbete: varna för lagrad energi, tryckavlastning och mekanisk lastsäkring. Du kan inte styra maskiner och saknar direkta mätvärden. Säg till om information saknas.';
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'',allowed=env.ALLOWED_ORIGIN||'';
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':allowed,'Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
 if(!allowed||origin!==allowed)return new Response(JSON.stringify({error:'Origin not allowed'}),{status:403,headers:{'Content-Type':'application/json'}});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return new Response(JSON.stringify({error:'Method not allowed'}),{status:405,headers});
 if(!env.OPENAI_API_KEY)return new Response(JSON.stringify({error:'Server secret missing'}),{status:503,headers});
 if(Number(request.headers.get('Content-Length')||0)>16000)return new Response(JSON.stringify({error:'Request too large'}),{status:413,headers});
 let data;try{data=await request.json()}catch{return new Response(JSON.stringify({error:'Invalid JSON'}),{status:400,headers})}
 const messages=Array.isArray(data?.messages)?data.messages:[];
 if(messages.length<1||messages.length>13||messages.some(m=>!['user','assistant'].includes(m?.role)||typeof m.content!=='string'||m.content.length>1200))return new Response(JSON.stringify({error:'Invalid conversation'}),{status:400,headers});
 try{
  const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENAI_MODEL||'gpt-4.1-mini',temperature:0.3,max_completion_tokens:700,messages:[{role:'system',content:SYSTEM},...messages]})});
  const json=await response.json();
  if(!response.ok)return new Response(JSON.stringify({error:'AI service unavailable'}),{status:502,headers});
  const answer=json?.choices?.[0]?.message?.content;
  if(typeof answer!=='string'||!answer.trim())return new Response(JSON.stringify({error:'Empty response'}),{status:502,headers});
  return new Response(JSON.stringify({answer:answer.slice(0,4500)}),{status:200,headers});
 }catch{return new Response(JSON.stringify({error:'Network or provider error'}),{status:502,headers})}
}};