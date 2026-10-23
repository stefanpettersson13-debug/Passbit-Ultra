
(()=>{'use strict';const host=document.getElementById('pb37-list');if(!host)return;
const rows=[
['G','Rak skarvkoppling','rak','Rör till rör · EO 24°','straight'],
['GE-M','Rak inskruvningskoppling · metrisk','rak','Metrisk utvändig gänga · metalltätning','male'],
['GE-M-ED','Rak inskruvningskoppling · ED','rak','Metrisk utvändig gänga · ED-tätning','male'],
['GE-R','Rak inskruvningskoppling · BSPP','rak','G-gänga · metalltätning','male'],
['GE-R-ED','Rak inskruvningskoppling · BSPP/ED','rak','G-gänga · ED-tätning','male'],
['GE-NPT','Rak inskruvningskoppling · NPT','rak','Konisk NPT-gänga','male'],
['GEO','Rak inskruvningskoppling · O-ring','rak','Metrisk port · O-ring enligt ISO 6149','male'],
['GE-UNF/UN','Rak inskruvningskoppling · UNF/UN','rak','UNF/UN-gänga · O-ring','male'],
['GAI-M','Rak invändig gänganslutning · metrisk','rak','Invändig metrisk gänga','female'],
['GAI-R','Rak invändig gänganslutning · BSPP','rak','Invändig G-gänga','female'],
['GAI-NPT','Rak invändig gänganslutning · NPT','rak','Invändig NPT-gänga','female'],
['GZ','Rak koppling med svängmutter','rak','EO 24° / DKO-svänganslutning','straight'],
['EGEO','Svängbar rak inskruvningskoppling','rak','Metrisk gänga och svängbar anslutning','male'],
['EGE-R-ED','Svängbar rak inskruvningskoppling · ED','rak','G-gänga · ED-tätning','male'],
['W','Vinkelkoppling 90°','vinkel','Rör till rör · EO 24°','elbow'],
['WE-M','Vinkel · metrisk inskruvning','vinkel','Metrisk utvändig gänga','elbow'],
['WE-R','Vinkel · BSPP-inskruvning','vinkel','G-gänga · metalltätning','elbow'],
['WE-NPT','Vinkel · NPT-inskruvning','vinkel','NPT-gänga','elbow'],
['WEE','Ställbar vinkel · låsmutter','vinkel','EO 24° / ställbar gänganslutning','elbow'],
['EW-M-ED','Ställbar vinkel · metrisk ED','vinkel','Metrisk ED-tätning','elbow'],
['EW-R-ED','Ställbar vinkel · BSPP ED','vinkel','G-gänga · ED-tätning','elbow'],
['EV','45° vinkel med svängmutter','vinkel','EO 24° / svängmutter','elbow'],
['VEE','Ställbar 45° vinkel','vinkel','EO 24° / ställbar anslutning','elbow'],
['WSV','Skottgenomföringsvinkel','vinkel','Vinkel genom panel','elbow'],
['T','T-koppling','gren','Tre röranslutningar · EO 24°','tee'],
['TE-M','T-gren med metrisk inskruvning','gren','Metrisk utvändig gänga','tee'],
['TE-R','T-gren med BSPP-inskruvning','gren','G-gänga','tee'],
['TEE','Ställbar T-gren','gren','EO 24° / låsmutter','tee'],
['LE-M','T-genomgång med metrisk inskruvning','gren','Metrisk utvändig gänga','tee'],
['LE-R','T-genomgång med BSPP-inskruvning','gren','G-gänga','tee'],
['LEE','Ställbar T-genomgång','gren','EO 24° / låsmutter','tee'],
['EL','T-koppling med svängmutter','gren','EO 24° / DKO','tee'],
['EVT','T-gren med standpipe','gren','EO 24° / rörände','tee'],
['K','Korskoppling','gren','Fyra EO 24°-anslutningar','cross'],
['TR','T-reducering','reducer','T-koppling med olika rördimensioner','tee'],
['GR','Rak reducering','reducer','Rak reducering med EO 24°-konanslutningar','reducer'],
['RED','Rörändsreducering','reducer','EO 24° DKO / EO 24°','reducer'],
['KOR','Rörändsreducering med standpipe','reducer','Rörände / EO 24°','reducer'],
['GZR','Svängbar reducering','reducer','EO 24° DKO-svänganslutning','reducer'],
['RI','Gängreducering/-förstoring','reducer','BSPP utvändig / invändig gänga','reducer'],
['RI-ED','Gängreducering med ED-tätning','reducer','BSPP utvändig ED / invändig gänga','reducer'],
['SV','Rak skottgenomföring','adapter','EO 24° genom panel','straight'],
['DA','Distansadapter','adapter','EO 24° / DKO','straight'],
['MAV','Manometeranslutning','adapter','Invändig BSPP / EO 24°','male'],
['MAVE','Svängbar manometeranslutning','adapter','Invändig BSPP / EO 24° DKO','male'],
['WH-M','Banjo-vinkel · metrisk','adapter','Högtrycksbanjo · metrisk','elbow'],
['WH-R','Banjo-vinkel · BSPP','adapter','Högtrycksbanjo · G-gänga','elbow'],
['TH-M','Banjo-T · metrisk','adapter','Högtrycksbanjo · metrisk','tee'],
['TH-R','Banjo-T · BSPP','adapter','Högtrycksbanjo · G-gänga','tee'],
['SWVE-M','Banjo-vinkel · metrisk','adapter','Banjo med metrisk inskruvning','elbow'],
['SWVE-R','Banjo-vinkel · BSPP','adapter','Banjo med G-gänga','elbow'],
['M','Kopplingsmutter','komponent','EO 24°-mutter','nut'],
['PSR','Skärring','komponent','Progressiv skärring','ring'],
['FM','EO-2 funktionsmutter','komponent','EO-2-tätningssystem','nut'],
['FORM','EO2-FORM formningssats','komponent','Formad rörände','ring'],
['VH','Stödhylsa','komponent','För tunnväggiga metallrör','ring'],
['GM','Skottgenomföringsmutter','komponent','För SV / WSV','nut'],
['OR','O-ring','komponent','Elastomertätning','ring'],
['KDS','Mjuk tätningsring','komponent','För vissa banjokopplingar','ring'],
['VKA','Blindplugg för kona','komponent','EO 24° DKO','plug'],
['VKAM','Blindplugg med mutter','komponent','EO 24° DKO','plug'],
['VSTI M/R-ED','Portplugg med ED-tätning','komponent','Metrisk / BSPP','plug'],
['VSTI M-OR','Portplugg med O-ring','komponent','Metrisk ISO 6149','plug'],
['ROV','Blindplugg för rörände','komponent','EO 24°','plug']
];
const ns='http://www.w3.org/2000/svg',create=(tag,attrs,parent)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));parent.append(n);return n};
function picture(type){
 const svg=create('svg',{viewBox:'0 0 340 188',role:'img','aria-label':'Metallisk principskiss för '+type},document.createDocumentFragment());
 const defs=create('defs',{},svg),steel=create('linearGradient',{id:'eo-steel-'+type,x1:'0',y1:'0',x2:'0.9',y2:'1'},defs);
 [['0%','#d6e8ef'],['16%','#718d9e'],['48%','#354d60'],['76%','#91afbd'],['100%','#223746']].forEach(([offset,color])=>create('stop',{offset,'stop-color':color},steel));
 const glow=create('radialGradient',{id:'eo-glow-'+type},defs);create('stop',{offset:'0%','stop-color':'#294c61'},glow);create('stop',{offset:'100%','stop-color':'#0c1925'},glow);
 create('rect',{x:5,y:5,width:330,height:178,rx:16,fill:'url(#eo-glow-'+type+')',stroke:'#527387'},svg);
 const g=create('g',{},svg),fill='url(#eo-steel-'+type+')';
 const rect=(x,y,w,h)=>create('rect',{x,y,width:w,height:h,rx:Math.min(7,h/4),fill,stroke:'#c9dfe9','stroke-width':2},g);
 const path=(d,color='#e4b980',width=3)=>create('path',{d,fill:'none',stroke:color,'stroke-width':width,'stroke-linejoin':'round','stroke-linecap':'round'},g);
 const hex=(x,y,scale=1)=>create('polygon',{points:[[-24,0],[-12,-22],[12,-22],[24,0],[12,22],[-12,22]].map(([a,b])=>[x+a*scale,y+b*scale].join(',')).join(' '),fill,stroke:'#d9eaf0','stroke-width':2},g);
 const ring=(x,y,r)=>{create('circle',{cx:x,cy:y,r,fill,stroke:'#e0f0f5','stroke-width':2},g);create('circle',{cx:x,cy:y,r:r*.58,fill:'#0c1b28',stroke:'#e6c08b','stroke-width':2},g)};
 if(type==='tee'||type==='cross'){rect(46,80,248,28);rect(156,type==='cross'?28:28,28,type==='cross'?136:80);hex(78,94);hex(262,94);hex(170,53);if(type==='cross')hex(170,150)}
 else if(type==='elbow'){rect(72,78,111,29);rect(154,80,29,75);hex(86,92);hex(168,140);path('M152 78Q183 77 184 108','#d6edf7',2)}
 else if(type==='nut'||type==='ring'){ring(170,94,type==='ring'?57:61);if(type==='nut')hex(170,94,2.1)}
 else if(type==='plug'){rect(99,78,126,33);hex(113,94,1.3);path('M224 78v33')}
 else if(type==='reducer'){rect(49,78,136,34);rect(184,86,110,18);hex(97,95,1.25);hex(235,95,.85);path('M181 78l12 8m-12 26 12-8')}
 else if(type==='male'||type==='female'){rect(45,78,247,32);hex(104,94,1.25);for(let x=187;x<282;x+=14){path('M'+x+' 77l8 -8m-8 41 8 8','#d7b782',2)}if(type==='female')ring(269,94,20)}
 else{rect(45,78,250,32);hex(100,94,1.25);hex(245,94,1.25);path('M135 77l13 17-13 17m73-34-13 17 13 17')}
 const label=create('text',{x:170,y:168,'text-anchor':'middle',fill:'#b5d3e1','font-size':10,'letter-spacing':1.4,'font-family':'system-ui,sans-serif'},svg);label.textContent='ERMETO · PRINCIPVY';return svg
}
const input=document.getElementById('pb37-search'),buttons=[...document.querySelectorAll('#pb37-filters button')],counter=document.getElementById('pb37-count');let cat='alla';
const synonyms={ge:['ge koppling','rak inskruvningskoppling','rak gängkoppling','rak adapter','gängad rörkoppling'],g:['g koppling','rak skarv','skarvkoppling'],t:['t koppling','t-koppling','trevägskoppling'],tr:['t reducering','t-reducering'],red:['reducering','reducerare','övergång'],kor:['reducering','reducerare'],psr:['skärring','skarring','klämring'],m:['mutter','kopplingsmutter'],wh:['banjo','banjokoppling'],th:['banjo','banjokoppling'],vsti:['plugg','blindplugg'],vka:['plugg','blindpropp'],gz:['svivel','svängmutter'],eg:['svivel','svängbar'],ew:['vinkel','vinkelkoppling']};
const groupInfo={rak:'Raka anslutningar för skarvning eller inskruvning',vinkel:'Vinkelanslutningar för riktningsändring',gren:'T- och korskopplingar för förgreningar',reducer:'Reducerare och övergångar mellan dimensioner',adapter:'Specialadaptrar och skottgenomföringar',komponent:'Muttrar, skärringar, pluggar och tillbehör'};
const detail=document.getElementById('pb41-detail');let active=null;
function keywords(code,name,group,desc){const prefix=code.split('-')[0].toLowerCase();return [code,name,group,desc,...(synonyms[prefix]||[]),...(synonyms[code.toLowerCase()]||[])].join(' ').toLocaleLowerCase('sv-SE').replaceAll('-',' ')}
function info(code,name,group,desc){const prefix=code.split('-')[0];let notes=[];if(prefix==='GE'||prefix==='GEO')notes=['Rak inskruvningskoppling: en EO-röranslutning och en gängad portanslutning.','GE-M: metrisk port; GE-R: BSPP/G-port; GE-R-ED: variant med ED-tätning. Kontrollera exakt suffix.','Rörsidan dimensioneras efter ytterdiameter och L/S-serie. Portgängan anges separat.'];else if(group==='gren')notes=['Välj rätt anslutning på samtliga grenar.','En T-koppling med olika dimensioner kan kräva reducerad T-kropp eller separat reducering.'];else if(group==='reducer')notes=['Kontrollera båda dimensionerna och om övergången är rörände, kona eller gänga.','En reducering för EO 24° är inte automatiskt en gängreducering.'];else if(group==='komponent')notes=['Matcha komponenten mot kopplingskropp, rördimension och L/S-serie.','Blanda inte skärringssystem eller tätningar utan tillverkarens godkännande.'];else notes=['Kontrollera anslutningarnas standard och eventuella tätningar.','Matcha dimension, serie, material och tryckklass.'];return [desc,...notes]}
function showDetail(row){active=row[0];const [code,name,group,desc,type]=row;detail.replaceChildren();const top=document.createElement('div');top.className='pb41-detailtop';const visual=document.createElement('div');visual.className='pb41-hero';visual.append(picture(type));const body=document.createElement('div');const tag=document.createElement('div');tag.className='section-kicker';tag.textContent='ERMETO ORIGINAL · '+group.toUpperCase();const h=document.createElement('h3');h.textContent=code+' · '+name;const list=document.createElement('ul');for(const item of info(code,name,group,desc)){const li=document.createElement('li');li.textContent=item;list.append(li)}const caution=document.createElement('p');caution.className='fine';caution.textContent='Principskiss, inte produktfoto. Parker-artikelnummer och mått är inte verifierade i denna databas.';body.append(tag,h,list,caution);top.append(visual,body);detail.append(top);detail.hidden=false;detail.scrollIntoView({block:'nearest',behavior:'smooth'})}
function render(){host.replaceChildren();const q=input.value.trim().toLocaleLowerCase('sv-SE').replaceAll('-',' ');const words=q.split(/\s+/).filter(x=>x&&x!=='koppling'&&x!=='kopplingar'&&x!=='ermeto'&&x!=='parker');let count=0;const matches=[];for(const row of rows){const [code,name,group,desc,type]=row;if(cat!=='alla'&&cat!==group)continue;const hay=keywords(code,name,group,desc);if(words.some(w=>!hay.includes(w)))continue;matches.push(row)}
matches.sort((a,b)=>{const score=x=>{const c=x[0].toLowerCase();return (words.some(w=>c===w)?100:0)+(words.some(w=>c.startsWith(w))?30:0)+(words.some(w=>x[1].toLowerCase().includes(w))?10:0)};return score(b)-score(a)});
for(const row of matches){const [code,name,group,desc,type]=row;count++;const card=document.createElement('button');card.type='button';card.className='pb37-card pb41-result';card.append(picture(type));const h=document.createElement('h3');h.textContent=code+' · '+name;card.append(h);const p=document.createElement('p');p.textContent=desc;card.append(p);const small=document.createElement('small');small.textContent='Visa större bild och information →';card.append(small);card.addEventListener('click',()=>showDetail(row));host.append(card)}
counter.textContent=count+' av '+rows.length+' produktfamiljer visas';if(!count){const p=document.createElement('p');p.textContent='Inga träffar. Prova en beteckning som GE, G, T, RED eller ett svenskt namn.';host.append(p)}
if(q&&matches.length){if(!active||!matches.some(row=>row[0]===active))showDetail(matches[0]);else{const row=matches.find(row=>row[0]===active);if(row)showDetail(row)}}else if(!q){detail.hidden=true;active=null}}
buttons.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.cat;buttons.forEach(x=>x.classList.toggle('active',x===b));render()}));
document.querySelectorAll('.pb41-suggestions button').forEach(b=>b.addEventListener('click',()=>{cat='alla';buttons.forEach(x=>x.classList.toggle('active',x.dataset.cat==='alla'));input.value=b.dataset.q;active=null;render();input.focus()}));input.addEventListener('input',()=>{active=null;render()});render();
})();
