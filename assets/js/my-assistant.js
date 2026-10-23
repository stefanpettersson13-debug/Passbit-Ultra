/* My – PassBit 5.1. On-device assistant, no remote AI backend. */
(()=>{'use strict';
const panel=document.getElementById('my-panel'),toggle=document.getElementById('my-toggle'),close=document.getElementById('my-close'),feed=document.getElementById('my-feed'),input=document.getElementById('my-input'),form=document.getElementById('my-form'),chips=document.getElementById('my-suggestions');
if(!panel||!toggle)return;
const tools=[...document.querySelectorAll('.dashboard .dashbtn[data-go]')].map(button=>({id:button.dataset.go,name:(button.querySelector('strong')?.textContent||button.dataset.go).trim(),button}));
const norm=s=>String(s).toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const aliases={hydraulik:'hydraulics',hydraul:'hydraulics',koppling:'fittings',ermeto:'fittings',parker:'hydraulics',cylinder:'hydcyl',pump:'hydpump',ackumulator:'hydacc',tryckmatare:'hydraulics',flodesmatare:'hydraulics',flode:'hydraulics',slang:'hydraulics',ror:'hydpipe',pneumatik:'pneumatics',sensor:'cylinders',lager:'mechbearing',lagerlivslangd:'mechbearing',skruv:'screws',passning:'fits',tolerans:'fits',passbit:'blocks',sinus:'sin',slip:'grinding',slipskiva:'grindwheel',vibration:'servicevib',el:'electrical',motor:'elec3',kugg:'mechgear',rem:'belt',temperatur:'metrotemp',matosakerhet:'metrounc',robot:'abbrobot',cnc:'cncpro',projekt:'field',fat:'field',sat:'field'};
const answers=[
{terms:['bar','mpa','psi'],text:'1 bar = 0,1 MPa ≈ 14,504 psi. Tryckmätare visar oftast övertryck; ackumulatorberäkningar använder absoluttryck.'},
{terms:['hydraulisk effekt','effekt hydraulik','kw hydraulik'],text:'Hydraulisk effekt i kW = tryck (bar) × flöde (l/min) / 600. För verklig axeleffekt måste du även ta hänsyn till verkningsgrader.'},
{terms:['eo','24','ermeto'],text:'Parker EO använder en 24° tätningsgeometri. Kontrollera L/S-serie, rördiameter, material och rätt mutter/skärring. EO, JIC och ORFS får inte blandas bara för att gängor verkar passa.'},
{terms:['orfs'],text:'ORFS står för O-Ring Face Seal och tätar med O-ring mot en plan tätningsyta. Kontrollera O-ring, gängstorlek, anslutning och tryckklass.'},
{terms:['jic'],text:'JIC använder 37° kona. Det är inte samma tätningsgeometri som EO 24°. Välj anslutning efter båda sidornas specifikation.'},
{terms:['l min','liter per minut'],text:'1 l/min = 1/60 000 m³/s. Rörhastighet = volymflöde / rörets fria tvärsnittsarea.'},
{terms:['tryckfall'],text:'Tryckfall Δp beror på flöde, rördiameter, längd, viskositet och lokala motstånd. Mät gärna före och efter filter eller strypning.'},
{terms:['l10'],text:'L10 är nominell statistisk lagerlivslängd, normalt uttryckt vid 90 % överlevnad enligt grundmodellen. Smörjning, renhet och lastvariation påverkar verklig livslängd.'},
{terms:['sinuslinjal'],text:'För en sinuslinjal: passbitshöjd h = L × sin(vinkel). Exempel: L = 100 mm och 5° ger ungefär 8,716 mm.'},
{terms:['sakerhet','lackage','injektion'],text:'Hydraulolja under tryck kan tränga in under huden. Sök aldrig läckage med handen. Avlasta tryck och säkra laster innan demontering.'}
];
let greeted=false;
function bubble(text,who='my'){const b=document.createElement('div');b.className='my-bubble '+who;b.textContent=text;feed.append(b);feed.scrollTop=feed.scrollHeight;return b}
function action(label,fn){const b=document.createElement('button');b.type='button';b.className='my-action';b.textContent=label;b.addEventListener('click',fn);feed.append(b);feed.scrollTop=feed.scrollHeight}
function openTool(t){panel.hidden=true;toggle.setAttribute('aria-expanded','false');t.button.click()}
function matchTools(q){const n=norm(q),words=n.split(' ').filter(w=>w.length>2),scores=tools.map(t=>{const title=norm(t.name+' '+t.id);let score=title.includes(n)&&n.length>2?20:0;for(const word of words){if(title.includes(word))score+=3;for(const [alias,id] of Object.entries(aliases))if((word===alias||word.startsWith(alias)&&alias.length>4)&&t.id===id)score+=12}return{...t,score}});return scores.filter(t=>t.score>0).sort((a,b)=>b.score-a.score).slice(0,4)}
function reply(raw){
const q=norm(raw);if(!q)return;
bubble(raw,'user');
if(/^(hej|hejsan|tjena|hall[aå]|vem ar du)/.test(q)){bubble('Hej! Jag är My 🌸 Din lilla verkstadskompis. Jag hjälper dig att hitta verktyg, förstå teknik och komma igång med beräkningar. Vad jobbar du med?');return}
if(/(vad kan du|hjalp|funktioner)/.test(q)){bubble('Jag kan guida dig till rätt blad, förklara hydraulik, mätteknik och maskinteknik samt visa formler och begrepp. Jag arbetar lokalt i appen och har ingen uppkopplad AI-chatt ännu.');action('Visa hydraulik',()=>{const t=tools.find(x=>x.id==='hydraulics');if(t)openTool(t)});return}
const barValue=q.match(/(\d+(?:[.,]\d+)?)\s*bar\b/),flowValue=q.match(/(\d+(?:[.,]\d+)?)\s*(?:l\s*\/\s*min|liter\s*(?:per|\/)\s*minut)/);
if(barValue&&flowValue){const p=Number(barValue[1].replace(',','.')),f=Number(flowValue[1].replace(',','.'));bubble('Med '+p.toLocaleString('sv-SE')+' bar och '+f.toLocaleString('sv-SE')+' l/min blir den teoretiska hydrauliska effekten '+(p*f/600).toLocaleString('sv-SE',{maximumFractionDigits:3})+' kW. Formeln är p × Q / 600. Pumpens verkliga axeleffekt blir högre på grund av förluster.');const t=tools.find(x=>x.id==='hydpump');if(t)action('↗ Öppna Hydraulpump',()=>openTool(t));return}
const sin=q.match(/(\d+(?:[.,]\d+)?)\s*(?:mm)?\s*(?:sinuslinjal|sinuslinjalen).*?(\d+(?:[.,]\d+)?)\s*(?:grader|grad|°)/);
if(sin){const length=Number(sin[1].replace(',','.')),degrees=Number(sin[2].replace(',','.'));bubble('Passbitshöjd = '+(length*Math.sin(degrees*Math.PI/180)).toLocaleString('sv-SE',{maximumFractionDigits:4})+' mm för '+length+' mm sinuslinjal vid '+degrees+'°.');return}
if(/(rakna|berakna|hur mycket|hur manga)/.test(q)&&q.includes('bar')&&q.includes('l min')){bubble('Hydraulisk effekt: P (kW) = p (bar) × Q (l/min) / 600. Öppna Hydraulpump eller Hydraulik för att ange dina värden.')}
else{const found=answers.find(a=>a.terms.some(t=>q.includes(norm(t))));if(found)bubble(found.text)}
const matches=matchTools(q);
if(matches.length){bubble('Jag hittade verktyg som kan passa:');matches.forEach(t=>action('↗ '+t.name,()=>openTool(t)))}
else if(!answers.some(a=>a.terms.some(t=>q.includes(norm(t))))){bubble('Jag kan inte tolka den frågan säkert ännu. Prova ett teknikord, till exempel ”ORFS”, ”tryckfall”, ”lager” eller ”sinuslinjal”. Du kan också söka bland alla verktyg på startsidan.')}
}
function show(){panel.hidden=false;toggle.setAttribute('aria-expanded','true');if(!greeted){bubble('Hej! Jag heter My 🌸 Jag kan hjälpa dig hitta rätt verktyg och förklara tekniska begrepp. Vad behöver du hjälp med?');greeted=true}input.focus()}
function hide(){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}
toggle.addEventListener('click',()=>panel.hidden?show():hide());
close.addEventListener('click',hide);
form.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim();if(!value)return;input.value='';reply(value)});
chips.querySelectorAll('[data-my-question]').forEach(b=>b.addEventListener('click',()=>reply(b.dataset.myQuestion)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)hide()});

/* Optional remote AI, user-configured server endpoint only. */
const mode=document.getElementById('my-mode'),settings=document.getElementById('my-settings'),settingsPanel=document.getElementById('my-settings-panel'),endpoint=document.getElementById('my-endpoint'),saveEndpoint=document.getElementById('my-save-endpoint'),status=document.getElementById('my-status'),clear=document.getElementById('my-clear');
const history=[];
const endpointKey='passbit.my.endpoint';
let pending=false;
try{endpoint.value=localStorage.getItem(endpointKey)||''}catch(e){}
function endpointValid(url){try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash&&!u.search&&u.hostname.length>3}catch{return false}}
function setStatus(){const ai=mode.value==='ai';status.textContent=ai?(endpointValid(endpoint.value.trim())?'AI-läge · egen server':'AI-läge · serveradress saknas'):'Lokal guide · fungerar offline';status.dataset.mode=ai?'ai':'local'}
mode.addEventListener('change',()=>{setStatus();bubble(mode.value==='ai'?'AI-läge valt. Meddelanden skickas till din konfigurerade server när du trycker Skicka.':'Lokal guide aktiverad. Inga frågor skickas till en AI-server.')});
settings.addEventListener('click',()=>{settingsPanel.hidden=!settingsPanel.hidden;settings.setAttribute('aria-expanded',String(!settingsPanel.hidden))});
saveEndpoint.addEventListener('click',()=>{const url=endpoint.value.trim();if(url&&!endpointValid(url)){bubble('Ange en giltig HTTPS-adress till din egen AI-proxy. Ange aldrig en API-nyckel här.');return}try{if(url)localStorage.setItem(endpointKey,url);else localStorage.removeItem(endpointKey)}catch(e){}settingsPanel.hidden=true;settings.setAttribute('aria-expanded','false');setStatus();bubble(url?'Serveradressen är sparad på den här enheten.':'Serveradressen har tagits bort.')});
clear.addEventListener('click',()=>{history.length=0;feed.replaceChildren();bubble('Ny konversation! 🌸 Vad vill du undersöka?')});
async function askAI(question){
if(pending)return;
const url=endpoint.value.trim();
if(!endpointValid(url)){bubble('För att använda AI-läget behöver du först ansluta en säker server. Tryck på kugghjulet för att ange HTTPS-adressen. Ingen API-nyckel ska skrivas in i appen.');settingsPanel.hidden=false;return}
bubble(question,'user');
history.push({role:'user',content:question.slice(0,1200)});
if(history.length>12)history.splice(0,history.length-12);
pending=true;const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='Tänker…';
const wait=bubble('My funderar… ✨');
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
try{
const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history}),signal:controller.signal,mode:'cors',credentials:'omit'});
if(!response.ok)throw Error('Servern svarade med HTTP '+response.status);
const data=await response.json();
if(typeof data.answer!=='string'||!data.answer.trim())throw Error('Tomt svar');
wait.remove();bubble(data.answer.slice(0,4500));history.push({role:'assistant',content:data.answer.slice(0,1200)});
}catch(e){wait.remove();bubble('Jag kunde inte nå AI-servern just nu ('+(e.name==='AbortError'?'tidsgräns':e.message)+'). Kontrollera anslutningen eller välj Lokal guide.');history.pop()}
finally{clearTimeout(timer);pending=false;button.disabled=false;button.textContent='Skicka'}
}
form.addEventListener('submit',e=>{if(mode.value!=='ai')return;e.stopImmediatePropagation();e.preventDefault();const value=input.value.trim();if(!value||pending)return;input.value='';askAI(value)},true);
chips.querySelectorAll('[data-my-question]').forEach(b=>b.addEventListener('click',e=>{if(mode.value!=='ai')return;e.stopImmediatePropagation();askAI(b.dataset.myQuestion)},true));
setStatus();

window.passbitMy={open:show,ask:reply};
})();