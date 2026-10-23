
const $=id=>document.getElementById(id);
const number=s=>Number(String(s).trim().replace(',','.'));
const valid=s=>String(s).trim()!=='' && Number.isFinite(number(s));
const f=(n,d=3)=>n.toLocaleString('sv-SE',{minimumFractionDigits:d,maximumFractionDigits:d});
const defaultSet=()=>{
 const a=[];for(let i=1;i<=9;i++)a.push(1+i/1000);
 for(let i=1;i<=49;i++)a.push(1+i/100);
 for(let i=1;i<=19;i++)a.push(i/2);
 for(let i=1;i<=10;i++)a.push(i*10);
 return a;
};
const stored=()=>{try{return localStorage.getItem('passbit-inventory')}catch(e){return null}};
const persist=s=>{try{localStorage.setItem('passbit-inventory',s)}catch(e){}};
$('inventory').value=stored()??defaultSet().map(x=>f(x,3)).join('\n');
function parseStock(){
 const pieces=$('inventory').value.split(/[;\n]+/).map(s=>s.trim()).filter(Boolean);
 if(!pieces.length||pieces.some(s=>!valid(s)||number(s)<=0||Math.abs(number(s)*1000-Math.round(number(s)*1000))>1e-7))throw Error('Setet måste innehålla positiva mått i steg om 0,001 mm.');
 return pieces.map(number);
}
function syncSliders(){for(const id of ["angle","length"]){const v=number($(id).value),r=$(id+"Slider");if(Number.isFinite(v))r.value=Math.max(Number(r.min),Math.min(Number(r.max),v));$(id+"Label").textContent=(valid($(id).value)?$(id).value:"–")+(id==="angle"?"°":" mm")}}
function sinCalc(){
 syncSliders();
 const l=number($('length').value),a=number($('angle').value);
 if(!valid($('length').value)||!valid($('angle').value)||l<=0||a<0||a>=90){$('sinResults').innerHTML='<p class="error">Ange en positiv längd och en vinkel från 0° till under 90°.</p>';return}
 const rad=a*Math.PI/180,s=l*Math.sin(rad),t=l*Math.tan(rad);
 $('sinResults').innerHTML=`<div class="result"><small>Passbitshöjd • SIN</small><div class="big">${f(s)} mm</div><button class="btn outline" id="sendBlocks" style="margin-top:10px">Bygg med passbitar →</button></div>
 <div class="row" style="margin-top:12px"><div class="metric"><small>Höjd • TAN</small><strong>${f(t)} mm</strong></div><div class="metric"><small>Lutning</small><strong>${f(100*Math.tan(rad),2)} %</strong></div></div>
 <p class="note">SIN använder ${f(l)} mm längs sinuslinjalen. TAN använder ${f(l)} mm horisontellt.</p>`;
 $('sendBlocks').onclick=()=>{const rounded=Math.round(s*1000)/1000;setTab('blocks');$('target').value=rounded.toFixed(3).replace('.',',');findBlocks();const delta=(rounded-s)*1000;const info=document.createElement('p');info.className='pb-round-note';info.textContent='Beräknad höjd: '+s.toFixed(6).replace('.',',')+' mm · passbitsmål: '+rounded.toFixed(3).replace('.',',')+' mm · avrundningsavvikelse: '+(delta>=0?'+':'')+delta.toFixed(3).replace('.',',')+' µm.';$('blockResults').prepend(info);window.scrollTo({top:0,behavior:'instant'})};
}
const toolNames={sin:'Sinuslinjal',blocks:'Passbitsbyggare',fits:'ISO-passningar',holes:'Borr & brotsch',screws:'Skruv & nycklar',convert:'mm ↔ inch',thermal:'Temperatur',cutting:'Skärdata',grinding:'Slipdata',stock:'Mitt passbitsset',runout:'Kast & excentricitet',chain:'Toleranskedjor',shrink:'Krymp- och presspassning',measure:'Mätprotokoll',metrology:'Mätteknik',alignment:'Maskingeometri',cncpro:'CNC-teknik',grindpro:'Slipteknik',field:'Fältservice & SAT/FAT',assistant:'Precision Assistant',analysis10:'Rundhetsanalys',diagnostic10:'Diagnostik · Slipning & spindel',fittings:'KOPPLINGSDATABAS · Sök & bygg',workshop10:'Verkstadsreferens',reports10:'Kontrollrapporter',sinumerik:'SINUMERIK ONE',abbrobot:'ABB Robotar',pneumatics:'Pneumatik · Festo',cylinders:'Cylindrar & sensorer',drawings:'Ritningsläsning',electrical:'Elscheman'};
function showHome(){
 document.body.classList.add('home-view');
 window.fromSettingsGauge=false;
 $('homeButton').querySelector('span').textContent='Alla verktyg';
 $('settingsPanel').classList.add('hidden');
 $('upgradePanel').classList.add('hidden');
 $('editionPanel').classList.remove('hidden');
 document.querySelector('.dashboard').classList.remove('hidden');
 $('homeTitle').classList.remove('hidden');
 $('toolBar').classList.add('hidden');
 $('currentTool').classList.add('hidden');
 $('utilityStatus').classList.add('hidden');
 ['sin','blocks','fits','holes','screws','convert','thermal','cutting','grinding','stock','runout','chain','shrink','measure','metrology','alignment','cncpro','grindpro','field','assistant','analysis10','diagnostic10','workshop10','reports10','sinumerik','abbrobot','pneumatics','cylinders','drawings','electrical','fittings'].forEach(id=>$(id).classList.add('hidden'));
 window.scrollTo({top:0,behavior:'smooth'});
}
function setTab(id){
 const projectPane=document.getElementById('pb-project-workspace');if(projectPane)projectPane.hidden=true;
 window.passbitCurrentTool=id;
 document.body.classList.remove('home-view');
 if(id!=='stock')window.fromSettingsGauge=false;
 $('settingsPanel').classList.add('hidden');
 $('editionPanel').classList.add('hidden');
 $('upgradePanel').classList.toggle('hidden',!(!window.passbitCanUse(id)));
 if(!window.passbitCanUse(id)){
   $('upgradeTitle').textContent=toolNames[id]+' · '+(window.passbitToolTier(id)==='ultra'?'Ultra':'Pro');
   $('upgradeText').textContent='Det här verktyget kräver '+(window.passbitToolTier(id)==='ultra'?'Ultra':'Pro')+'-testläge.';
 }
 document.querySelector('.dashboard').classList.add('hidden');
 $('homeTitle').classList.add('hidden');
 $('toolBar').classList.remove('hidden');
 $('currentTool').classList.remove('hidden');
 $('utilityStatus').classList.remove('hidden');
 $('currentTool').textContent=toolNames[id]||'Verktyg';
 document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));const locked=!window.passbitCanUse(id);['sin','blocks','fits','holes','screws','convert','thermal','cutting','grinding','stock','runout','chain','shrink','measure','metrology','alignment','cncpro','grindpro','field','assistant','analysis10','diagnostic10','workshop10','reports10','sinumerik','abbrobot','pneumatics','cylinders','drawings','electrical','fittings'].forEach(x=>$(x).classList.toggle('hidden',locked||x!==id));window.scrollTo({top:0,behavior:'instant'})}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{setTab(b.dataset.tab);window.scrollTo({top:0,behavior:'instant'})});
document.querySelectorAll('[data-angle]').forEach(b=>b.onclick=()=>{$('angle').value=b.dataset.angle;sinCalc()});
['angle','length'].forEach(id=>$(id+'Slider').addEventListener('input',()=>{$(id).value=$(id+'Slider').value.replace('.',',');sinCalc()}));
['angle','length'].forEach(id=>$(id).addEventListener('input',sinCalc));
$('reverse').onclick=()=>{
 const h=number($('knownHeight').value),l=number($('length').value);
 $('reverseResult').innerHTML=(!valid($('knownHeight').value)||!valid($('length').value)||l<=0||h<0||h>l)?'<span class="error">Höjden måste vara mellan 0 och centrumavståndet.</span>':`Vinkel: <strong>${f(Math.asin(h/l)*180/Math.PI,5)}°</strong>`;
};
function findCombinations(values,target,limit=12){
 // Values are integer micrometres; indexes distinguish physically separate pieces.
 const n=values.length,results=[],seen=new Set(),pairs=new Map();
 const add=indices=>{
   const vals=indices.map(i=>values[i]).sort((a,b)=>b-a);
   const key=vals.join(',');
   if(!seen.has(key)){seen.add(key);results.push(vals)}
 };
 for(let i=0;i<n;i++)if(values[i]===target)add([i]);
 if(results.length>=limit)return results.slice(0,limit);
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
   const sum=values[i]+values[j];
   if(sum===target)add([i,j]);
   if(sum<target){
     if(!pairs.has(sum))pairs.set(sum,[]);
     pairs.get(sum).push([i,j]);
   }
 }
 if(results.length>=limit)return results.slice(0,limit);
 for(let i=0;i<n;i++){
   const matches=pairs.get(target-values[i])||[];
   for(const [j,k] of matches)if(i!==j&&i!==k)add([i,j,k]);
 }
 if(results.length>=limit)return results.slice(0,limit);
 // Pair-pair combinations: distinct physical blocks only.
 for(const [sum,items] of pairs){
   const other=pairs.get(target-sum);
   if(!other)continue;
   for(const [i,j] of items)for(const [k,m] of other){
     if(i!==k&&i!==m&&j!==k&&j!==m)add([i,j,k,m]);
     if(results.length>=limit)break;
   }
   if(results.length>=limit)break;
 }
 results.sort((a,b)=>a.length-b.length||b[0]-a[0]);
 return results.slice(0,limit);
}
function findBlocks(){
 const box=$('blockResults'),raw=$('target').value,t=number(raw);
 if(!valid(raw)||t<=0){box.innerHTML='<p class="error">Ange en positiv målhöjd.</p>';return}
 let stock;try{stock=parseStock()}catch(e){box.innerHTML='<p class="error">'+e.message+'</p>';return}
 const target=Math.round(t*1000),rounded=Math.abs(t*1000-target)>1e-7;
 if(rounded){box.innerHTML='<p class="error">Målhöjden har finare upplösning än 0,001 mm. Ingen avrundning görs automatiskt. Ange ett mått i hela µm eller välj en annan beräkningsmetod.</p>';return;}
 const ints=stock.map(v=>Math.round(v*1000)),solutions=findCombinations(ints,target,12);
 if(!solutions.length){box.innerHTML=`<p class="error">Ingen exakt kombination med högst fyra passbitar hittades för ${f(target/1000)} mm i ditt set.</p><p class="note">Prova att uppdatera setet under ”Mitt set”.</p>`;return}
 box.innerHTML=`<div class="result"><small>Målhöjd • ${solutions.length} kombination${solutions.length===1?'':'er'} hittade</small><div class="big">${f(target/1000)} mm</div></div>
 <h2 style="margin-top:18px">Välj kombination</h2>
 ${solutions.map((selected,i)=>`<details ${i===0?'open':''} style="border:1px solid #38546d;border-radius:12px;margin:9px 0;padding:11px">
 <summary style="cursor:pointer;font-weight:700">Alternativ ${i+1} · ${selected.length} passbit${selected.length===1?'':'ar'}</summary>
 ${selected.map(v=>`<div class="block"><span>Passbit</span><strong>${f(v/1000)} mm</strong></div>`).join('')}
 <button class="btn outline copy-combo" data-copy="${selected.map(v=>f(v/1000)).join(' + ')} = ${f(target/1000)} mm">Kopiera kombination</button></details>`).join('')}
`;
 box.querySelectorAll('.copy-combo').forEach(b=>b.onclick=()=>{navigator.clipboard?.writeText(b.dataset.copy).then(()=>{b.textContent='Kopierat!' }).catch(()=>{b.textContent='Kopiera manuellt'})});
}
$('calcBlocks').onclick=findBlocks;
$('useSin').onclick=()=>{const l=number($('length').value),a=number($('angle').value);if(l>0&&a>=0&&a<90){const exact=l*Math.sin(a*Math.PI/180),rounded=Math.round(exact*1000)/1000;$('target').value=rounded.toFixed(3).replace('.',',');findBlocks();const p=document.createElement('p');p.className='pb-round-note';p.textContent='Sinushöjd '+exact.toFixed(6).replace('.',',')+' mm → '+rounded.toFixed(3).replace('.',',')+' mm (avvikelse '+((rounded-exact)*1000).toFixed(3).replace('.',',')+' µm).';$('blockResults').prepend(p)}};
$('saveStock').onclick=()=>{try{const arr=parseStock();persist($('inventory').value);$('stockStatus').textContent=`Sparat: ${arr.length} passbitar.`}catch(e){$('stockStatus').textContent=e.message}};
$('resetStock').onclick=()=>{$('inventory').value=defaultSet().map(x=>f(x,3)).join('\n');persist($('inventory').value);$('stockStatus').textContent='87-delars standardset återställt.'};
sinCalc();findBlocks();

// ISO 286: diameter step upper bounds (mm), IT5, IT6, IT7, IT8, IT9 in micrometres.
// First row (1-3) starts above 1 mm; 1 mm included as boundary for practical use.
const isoSteps=[
 [3,4,6,10,14,25],[6,5,8,12,18,30],[10,6,9,15,22,36],
 [18,8,11,18,27,43],[30,9,13,21,33,52],[50,11,16,25,39,62],
 [80,13,19,30,46,74],[120,15,22,35,54,87],[180,18,25,40,63,100],
 [250,20,29,46,72,115],[315,23,32,52,81,130],
 [400,25,36,57,89,140],[500,27,40,63,97,155]
];
function tolerance(d,grade){const row=isoSteps.find(r=>d<=r[0]);return row?row[grade-4]:NaN}
function fmt4(x){return f(x,4)}
// Shaft g: table-based upper deviations (µm) for ISO 286 nominal steps >1–500 mm.
// Cross-checked with independent g6 reference; applies also to g7.
const gUpper=[-2,-4,-5,-6,-7,-9,-10,-12,-14,-15,-17,-18,-20];
function isoFundamental(d,letter){
 const idx=isoSteps.findIndex(r=>d<=r[0]);
 if(idx<0)return NaN;
 if(letter==='g')return gUpper[idx];
 // f7 remains an approximate formula-based reference, not table verified.
 const lower=[1,3,6,10,18,30,50,80,120,180,250,315,400];
 const D=Math.sqrt(lower[idx]*isoSteps[idx][0]);
 return -Math.round(5.5*Math.pow(D,0.41));
}

function fitCalc(){
 const d=number($('fitDiameter').value),out=$('fitResult');
 if(!valid($('fitDiameter').value)||d<=1||d>500){out.innerHTML='<p class="error">Ange diameter över 1 och högst 500 mm.</p>';return}
 const hc=$('holeClass').value,sc=$('shaftClass').value;
 const holeIT=tolerance(d,Number(hc.slice(1))),shaftIT=tolerance(d,Number(sc.slice(sc.search(/[0-9]/)))) ;
 let ei,es;
 const letter=sc.match(/^[a-z]+/)[0];
 if(['k','m','p'].includes(letter)){
  out.innerHTML='<p class="iso-disclaimer"><strong>Ej verifierad ISO 286-tolerans:</strong> '+sc+' stöds inte i den här versionen. Tidigare ungefärliga värden har tagits bort för att undvika felaktiga produktionsmått. Välj h, g, f eller js och verifiera mot ISO 286-2.</p>';return;
 }
 else if(letter==='h'){es=0;ei=-shaftIT}
 else if(letter==='js'){ei=-shaftIT/2;es=shaftIT/2}
 else {es=isoFundamental(d,letter);ei=es-shaftIT}
 const hmin=d,hmax=d+holeIT/1000,smin=d+ei/1000,smax=d+es/1000;
 const minClearance=-es, maxClearance=holeIT-ei;
 const kind=minClearance>=0?'Spelpassning':maxClearance<=0?'Presspassning':'Övergångspassning';
 const chart=fitDiagram(holeIT,ei,es,hc,sc);
 const label=(v)=>`${v>0?'+':v<0?'−':''}${f(Math.abs(v),1)} µm`;
 out.innerHTML=`<div class="iso-result-tag">ISO 286 · KONTROLLERAT REFERENSVÄRDE FÖR H/h/g · ÖVRIGT PRELIMINÄRT</div><div class="result"><small>Hål ${hc} · gränsmått</small><div class="big">${f(hmin,3)} – ${f(hmax,3)} mm</div><p class="fine">EI = 0 µm · ES = +${holeIT} µm</p></div>
 <div class="result"><small>Axel ${sc} · gränsmått</small><div class="big">${f(smin,4)} – ${f(smax,4)} mm</div><p class="fine">ei = ${label(ei)} · es = ${label(es)}</p></div>
 <div class="kpi"><div class="metric"><small>Minsta spel (− = övermått)</small><strong>${f(minClearance/1000,4)} mm</strong></div><div class="metric"><small>Största spel (− = övermått)</small><strong>${f(maxClearance/1000,4)} mm</strong></div></div>
 <p class="fit-status ${minClearance<0?'warn':''}">${kind}</p>${chart}
 <p class="fine">${letter==='g'||letter==='f'?(letter==='g'?'Grundavvikelse g kontrollerad mot publicerad g6-tabell.':'Grundavvikelse f är formelberäknad och behöver tabellkontroll.'):letter==='js'?'js är symmetrisk kring nollinjen; halv-µm kan förekomma.':'Tabellvärden för IT-grad, grundavvikelse H/h = 0.'}</p>`;
}

function fitDiagram(holeIT,ei,es,hc,sc){
 const low=Math.min(0,ei)-7,high=Math.max(holeIT,es)+7,span=high-low;
 const px=v=>Math.round(70+(v-low)/span*460),z=px(0);
 return `<div class="fitdiagram"><h3>Toleransfält · avvikelse från nominellt mått</h3>
 <svg viewBox="0 0 570 175" role="img" aria-label="Hål och axel, toleransfält">
 <line x1="${z}" y1="17" x2="${z}" y2="145" stroke="#e4edf6" stroke-dasharray="5 4" stroke-width="2"/>
 <text x="${Math.min(z+5,515)}" y="14" fill="#cdd9e5" font-size="11">0 µm</text>
 <text x="8" y="55" fill="#9ed6ff" font-size="13">Hål</text>
 <rect x="${px(0)}" y="34" width="${Math.max(2,px(holeIT)-px(0))}" height="36" rx="4" fill="#4aa8e8"/>
 <text x="8" y="118" fill="#9cf4c4" font-size="13">Axel</text>
 <rect x="${px(ei)}" y="97" width="${Math.max(2,px(es)-px(ei))}" height="36" rx="4" fill="#59d69d"/>
 <line x1="70" y1="145" x2="530" y2="145" stroke="#567084"/>
 <text x="70" y="164" fill="#b5c5d2" font-size="11">${low} µm</text>
 <text x="530" y="164" text-anchor="end" fill="#b5c5d2" font-size="11">${high} µm</text>
 </svg><p class="fine">Blå: hål ${hc} · Grön: axel ${sc}. Streckad linje: nominellt mått.</p></div>`;
}
document.querySelectorAll('[data-fit]').forEach(b=>b.addEventListener('click',()=>{
 $('fitDiameter').value='20';$('holeClass').value='H7';$('shaftClass').value=b.dataset.fit;fitCalc();
}));
['fitDiameter','holeClass','shaftClass'].forEach(id=>$(id).addEventListener('input',fitCalc));
// Coarse ISO metric pitch, with selected fine pitches.
const threads={3:[0.5],4:[0.7,0.5],5:[0.8,0.5],6:[1,0.75,0.5],8:[1.25,1,0.75],10:[1.5,1.25,1],12:[1.75,1.5,1.25],14:[2,1.5],16:[2,1.5,1],18:[2.5,1.5],20:[2.5,2,1.5],22:[2.5,1.5],24:[3,2,1.5],27:[3,2],30:[3.5,2],36:[4,3,2]};
$('threadSize').innerHTML=Object.keys(threads).map(d=>`<option value="${d}" ${d==='8'?'selected':''}>M${d}</option>`).join('');
function pitchOptions(){const d=Number($('threadSize').value);$('threadPitch').innerHTML=threads[d].map(p=>`<option value="${p}">${f(p,2)} mm</option>`).join('');threadCalc()}
function threadCalc(){const d=Number($('threadSize').value),p=Number($('threadPitch').value),b=d-p;
 $('threadResult').innerHTML=`<div class="result"><small>Riktvärde gängborr · M${d} × ${f(p,2)}</small><div class="big">Ø ${f(b,2)} mm</div></div><p class="note">Beräknat: ${d} − ${f(p,2)} = ${f(b,2)} mm. Välj närmaste lämpliga borr utifrån tillverkarens rekommendation.</p>`}
$('threadSize').addEventListener('change',pitchOptions);$('threadPitch').addEventListener('change',threadCalc);
function reamCalc(){const d=number($('reamDiameter').value),out=$('reamResult');if(!valid($('reamDiameter').value)||d<2||d>50){out.innerHTML='<p class="error">Ange färdig diameter mellan 2 och 50 mm.</p>';return}
 const mat=$('reamMaterial').value;
 // Broad machining starting ranges, diametral stock, deliberately not portrayed as universal.
 let low,high;
 if(d<=6){low=0.10;high=0.20}else if(d<=12){low=0.15;high=0.30}else if(d<=25){low=0.20;high=0.40}else{low=0.30;high=0.50}
 if(mat==='aluminium'){low*=0.8;high*=0.8}
 if(mat==='cast'){low*=1.1;high*=1.1}
 out.innerHTML=`<div class="result"><small>Förslag på förborrat hål</small><div class="big">Ø ${f(d-high,2)}–${f(d-low,2)} mm</div></div><div class="kpi"><div class="metric"><small>Diametralt brotschmån</small><strong>${f(low,2)}–${f(high,2)} mm</strong></div><div class="metric"><small>Färdigt hål</small><strong>Ø ${f(d,2)} mm</strong></div></div>`;
}
['reamDiameter','reamMaterial'].forEach(id=>$(id).addEventListener('input',reamCalc));
// Common ISO 4762 hex socket sizes and ISO 4014/4017 across-flats sizes.
const screws=[[3,2.5,5.5],[4,3,7],[5,4,8],[6,5,10],[8,6,13],[10,8,16],[12,10,18],[14,12,21],[16,14,24],[18,14,27],[20,17,30],[22,17,34],[24,19,36],[27,19,41],[30,22,46],[36,27,55]];
$('screwSize').innerHTML=screws.map(s=>`<option value="${s[0]}" ${s[0]===8?'selected':''}>M${s[0]}</option>`).join('');
$('screwTable').innerHTML=screws.map(s=>`<tr><td>M${s[0]}</td><td>${f(s[1],1)} mm</td><td>${f(s[2],1)} mm</td></tr>`).join('');
function screwCalc(){const s=screws.find(s=>s[0]===Number($('screwSize').value));$('screwResult').innerHTML=`<div class="kpi"><div class="metric"><small>Insexnyckel ISO 4762</small><strong>${f(s[1],1)} mm</strong></div><div class="metric"><small>Fast nyckel ISO 4017</small><strong>${f(s[2],1)} mm</strong></div></div><p class="note">M${s[0]} anger gängdiameter, inte nyckelvidd. Kontrollera skruvtyp och märkning.</p>`}
$('screwSize').addEventListener('change',screwCalc);
fitCalc();pitchOptions();reamCalc();screwCalc();


// 4.0: quick navigation and copy of visible result (no external dependencies).
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>{setTab(b.dataset.go);window.scrollTo({top:0,behavior:'instant'});}));
document.getElementById('homeButton').addEventListener('click',()=>{
 const backToSettings=window.fromSettingsGauge;
 showHome();
 if(backToSettings){$('settingsPanel').classList.remove('hidden');window.scrollTo({top:0,behavior:'instant'});}
});
$('settingsGaugeSet').addEventListener('click',()=>{
 window.fromSettingsGauge=true;
 setTab('stock');
 $('homeButton').querySelector('span').textContent='Inställningar';
});

document.getElementById('copyResult').addEventListener('click',async()=>{
 const active=['sin','blocks','fits','holes','screws','convert','thermal','cutting','grinding','stock'].find(id=>!document.getElementById(id).classList.contains('hidden'));
 const panel=document.getElementById(active);
 const result=panel.querySelector('#sinResults,#blockResults,#fitResult,#threadResult,#screwResult,#convertResult,#thermalResult,#cutResult,#reverseResult');
 const content=result && result.innerText.trim();
 const status=document.getElementById('utilityStatus');
 if(!content){status.textContent='Inget beräknat resultat att kopiera ännu.';return;}
 try{await navigator.clipboard.writeText('PassBit Pro 6.2 – '+active+'\n'+content);status.textContent='Resultatet kopierat.'}
 catch(e){status.textContent='Kopiering stöds inte här. Markera resultatet manuellt.'}
});

// Conversion uses the exact international inch definition (25.4 mm).
function parseMeasure(v){
 const s=String(v).trim().replace(',','.');
 if(!s)return NaN;
 const m=s.match(/^([+-]?\d+)\s+(\d+)\/(\d+)$/);
 if(m){const den=Number(m[3]);return den?Number(m[1])+(Number(m[1])<0?-1:1)*Number(m[2])/den:NaN;}
 const frac=s.match(/^([+-]?\d+)\/(\d+)$/);
 if(frac){return Number(frac[2])?Number(frac[1])/Number(frac[2]):NaN;}
 return Number(s);
}
function convertCalc(){
 const v=parseMeasure($('convertValue').value),unit=$('convertFrom').value,out=$('convertResult');
 if(!Number.isFinite(v)){out.innerHTML='<p class="error">Ange ett giltigt tal eller bråk, t.ex. 3/8.</p>';return}
 const mm=v*({mm:1,in:25.4,um:.001,mil:.0254}[unit]);
 const inch=mm/25.4;
 const fracs=[2,4,8,16,32,64,128];let nearest='';let best=Infinity;
 for(const den of fracs){const num=Math.round(Math.abs(inch)*den),delta=Math.abs(Math.abs(inch)-num/den);if(delta<best){best=delta;nearest=(inch<0?'-':'')+num+'/'+den}}
 out.innerHTML=`<div class="result"><small>Millimeter</small><div class="big">${f(mm,5)} mm</div></div><div class="kpi"><div class="metric"><small>Decimal inch</small><strong>${f(inch,6)} in</strong></div><div class="metric"><small>Mikrometer</small><strong>${f(mm*1000,2)} µm</strong></div><div class="metric"><small>Thou / mil</small><strong>${f(inch*1000,3)}</strong></div><div class="metric"><small>Närmsta 1/128 inch</small><strong>${nearest}</strong></div></div><p class="fine">Bråktum är avrundat till närmaste 1/128″. Decimaltum och mm beräknas med exakt omräkningsfaktor.</p>`;
}
const fractionRows=[[1,16,1,8],[3,16,1,4],[5,16,3,8],[7,16,1,2],[9,16,5,8],[11,16,3,4],[13,16,7,8],[15,16,1,1]];
$('fractionTable').innerHTML=fractionRows.map(([a,b,c,d])=>`<tr><td>${a}/${b}″</td><td>${f(25.4*a/b,4)}</td><td>${c}/${d}″</td><td>${f(25.4*c/d,4)}</td></tr>`).join('');
['convertValue','convertFrom'].forEach(id=>$(id).addEventListener('input',convertCalc));
$('swapUnits').addEventListener('click',()=>{const u=$('convertFrom').value;const v=parseMeasure($('convertValue').value);if(!Number.isFinite(v))return;if(u==='mm'){$('convertFrom').value='in';$('convertValue').value=String(v/25.4)}else{$('convertFrom').value='mm';$('convertValue').value=String(v*({in:25.4,um:.001,mil:.0254,mm:1}[u]))}convertCalc()});
function thermalCalc(){
 const custom=$('thermalMaterial').value==='custom';$('alphaCustom').classList.toggle('hidden',!custom);
 const alpha=custom?number($('thermalAlpha').value):Number($('thermalMaterial').value),L=number($('thermalLength').value),t0=number($('thermalStart').value),t1=number($('thermalEnd').value),out=$('thermalResult');
 if(![alpha,L,t0,t1].every(Number.isFinite)||alpha<=0||L<=0||L>1000000){out.innerHTML='<p class="error">Ange giltiga positiva längd- och materialvärden.</p>';return}
 const delta=L*alpha*1e-6*(t1-t0);
 out.innerHTML=`<div class="result"><small>Längdförändring</small><div class="big">${delta>=0?'+':''}${f(delta*1000,2)} µm</div></div><div class="kpi"><div class="metric"><small>Förändring i mm</small><strong>${delta>=0?'+':''}${f(delta,5)} mm</strong></div><div class="metric"><small>Ny längd</small><strong>${f(L+delta,5)} mm</strong></div></div><p class="fine">ΔT = ${f(t1-t0,1)} °C. Materialkoefficienter är typvärden och varierar med legering och temperatur.</p>`;
}
['thermalMaterial','thermalAlpha','thermalLength','thermalStart','thermalEnd'].forEach(id=>$(id).addEventListener('input',thermalCalc));
function cuttingCalc(){
 const D=number($('cutDiameter').value),Vc=number($('cutSpeed').value),z=number($('cutTeeth').value),fz=number($('cutFeed').value),out=$('cutResult');
 if(![D,Vc,z,fz].every(Number.isFinite)||D<=0||Vc<=0||z<=0||!Number.isInteger(z)||fz<=0){out.innerHTML='<p class="error">Ange positiva värden och helt antal skär.</p>';return}
 const rpm=1000*Vc/(Math.PI*D),vf=rpm*z*fz;
 out.innerHTML=`<div class="result"><small>Beräknat varvtal</small><div class="big">${f(rpm,0)} rpm</div></div><div class="kpi"><div class="metric"><small>Fräsmatning</small><strong>${f(vf,1)} mm/min</strong></div><div class="metric"><small>Matning per varv</small><strong>${f(z*fz,3)} mm/varv</strong></div></div>`;
}
['cutDiameter','cutSpeed','cutTeeth','cutFeed'].forEach(id=>$(id).addEventListener('input',cuttingCalc));
convertCalc();thermalCalc();cuttingCalc();

function grindingCalc(){
 const rawIds=['grindDiameter','grindRPM','workDiameter','workRPM'];
 const values=rawIds.map(id=>$(id).value.trim());
 const nums=values.map(number);
 const [d,rpm,wd,wrpm]=nums;
 const out=$('grindResult'),ratio=$('grindRatio'),table=$('grindTable'),rev=$('grindReverse');
 const fmt=(x,digits=3)=>f(x,digits);
 if(values.some(v=>v==='')||nums.some(x=>!Number.isFinite(x))||d<=0||wd<=0||d>10000||wd>10000||rpm<0||wrpm<0||rpm>1000000||wrpm>1000000){
  out.innerHTML='<p class="error">Ange positiva diametrar och giltiga varvtal (rpm). Noll rpm är tillåtet.</p>';
  ratio.innerHTML='';table.innerHTML='';rev.innerHTML='';return;
 }
 const vs=Math.PI*d*rpm/60000, vw=Math.PI*wd*wrpm/60000;
 out.innerHTML=`<div class="grind-readouts"><div class="grind-readout"><small>SLIPSKIVA / RING</small><div class="grind-value">${fmt(vs)} <span>m/s</span></div><small>${fmt(vs*60,1)} m/min</small></div><div class="grind-readout work"><small>ARBETSSTYCKE</small><div class="grind-value">${fmt(vw)} <span>m/s</span></div><small>${fmt(vw*60,1)} m/min</small></div></div>`;
 ratio.innerHTML=vw===0?'<p class="note">Arbetsstycket står stilla. Kvoten kan inte beräknas (division med noll).</p>':`<div class="result"><small>q = vs / vw</small><div class="big">${fmt(vs/vw,2)} : 1</div></div>`;
 const diameterSet=[50,75,100,125,150,175,200,250,300,350,400,450,500];
 const rows=[...new Set([...diameterSet,d])].sort((x,y)=>x-y).map(x=>`<tr${x===d?' class="active-diameter"':''}><td>Ø${fmt(x,0)} mm${x===d?' ★':''}</td><td>${fmt(Math.PI*x*rpm/60000,3)} m/s</td></tr>`).join('');
 table.innerHTML=`<div class="tablewrap"><table><thead><tr><th>Ringdiameter</th><th>Vid ${fmt(rpm,0)} rpm</th></tr></thead><tbody>${rows}</tbody></table></div>`;
 const targetRaw=$('grindTarget').value.trim(),ratedRaw=$('grindRated').value.trim();
 const target=number(targetRaw),rated=ratedRaw===''?null:number(ratedRaw);
 if(targetRaw===''||!Number.isFinite(target)||target<0||target>1000||(rated!==null&&(!Number.isFinite(rated)||rated<=0))){
  rev.innerHTML='<p class="error">Ange giltig önskad hastighet och eventuell positiv maxhastighet.</p>';return;
 }
 const targetRpm=60000*target/(Math.PI*d);
 const overRated=rated!==null&&(vs>rated||target>rated);
 rev.innerHTML=`<div class="result"><small>Varvtal för Ø${fmt(d,1)} mm vid ${fmt(target,2)} m/s</small><div class="big">${fmt(targetRpm,0)} rpm</div></div>${overRated?'<p class="error">⚠️ Aktuell eller önskad periferihastighet överstiger angiven märkhastighet.</p>':''}`;
}
['grindDiameter','grindRPM','workDiameter','workRPM','grindTarget','grindRated'].forEach(id=>$(id).addEventListener('input',grindingCalc));
grindingCalc();


// New 5.4 workshop calculators and local inspection records
const numField=id=>valid($(id).value)?number($(id).value):NaN;
const finiteAll=arr=>arr.every(Number.isFinite);
const errMsg='Kontrollera inmatningen: ange giltiga numeriska värden.';
function runoutCalc(){
 const hi=numField('runMax'),lo=numField('runMin'),rad=$('runType').value==='radial';
 $('runResult').innerHTML=!finiteAll([hi,lo])||hi<lo?`<p class="error">${errMsg} Max måste vara minst lika med min.</p>`:`<div class="result"><small>${rad?'Radiellt':'Axiellt'} kast · TIR</small><div class="big">${f(hi-lo,4)} mm</div></div>${rad?`<div class="metric" style="margin-top:12px"><small>Excentricitet, endast ideal cirkel med centrumfel</small><strong>${f((hi-lo)/2,4)} mm</strong></div>`:''}`;
}
function chainCalc(){
 const lines=$('chainRows').value.trim().split(/\n/).map(x=>x.trim()).filter(Boolean);let nom=0,low=0,high=0;
 if(!lines.length||lines.length>40){$('chainResult').innerHTML='<p class="error">Ange 1–40 mått.</p>';return}
 for(const [i,line] of lines.entries()){
  const cells=line.split(';').map(x=>x.trim());if(cells.length!==4||!['+','-'].includes(cells[3])||!cells.slice(0,3).every(valid)){ $('chainResult').innerHTML=`<p class="error">Fel på rad ${i+1}. Format: 40;-0,02;0,02;+</p>`;return}
  const [v,a,b]=cells.slice(0,3).map(number);if(a>b){$('chainResult').innerHTML=`<p class="error">Undre avvikelse är större än övre på rad ${i+1}.</p>`;return}
  const sign=cells[3]==='+'?1:-1;nom+=sign*v;low+=sign===1?v+a:-(v+b);high+=sign===1?v+b:-(v+a);
 }
 $('chainResult').innerHTML=`<div class="result"><small>Nominellt totalmått</small><div class="big">${f(nom,4)} mm</div></div><div class="row" style="margin-top:12px"><div class="metric"><small>Minsta</small><strong>${f(low,4)} mm</strong></div><div class="metric"><small>Största</small><strong>${f(high,4)} mm</strong></div></div><p class="note">Total toleransbredd: ${f(high-low,4)} mm · avvikelse ${f(low-nom,4)} / +${f(high-nom,4)} mm</p>`;
}
function shrinkCalc(){
 const [dh,ds,ah,as,th,ts]=['shHole','shShaft','shHoleAlpha','shShaftAlpha','shHoleTemp','shShaftTemp'].map(numField);
 if(!finiteAll([dh,ds,ah,as,th,ts])||dh<=0||ds<=0||ah<0||as<0){$('shResult').innerHTML=`<p class="error">${errMsg} Diametrar måste vara positiva och α får inte vara negativt.</p>`;return}
 const h=dh*(1+ah*1e-6*(th-20)),shaft=ds*(1+as*1e-6*(ts-20));const cold=dh-ds,hot=h-shaft;
 $('shResult').innerHTML=`<div class="row"><div class="metric"><small>Spel vid 20 °C</small><strong>${f(cold,4)} mm</strong></div><div class="metric"><small>Spel vid angivna temperaturer</small><strong>${f(hot,4)} mm</strong></div></div><div class="result" style="margin-top:12px"><small>${hot>=0?'Teoretiskt diametralt spel':'Teoretiskt diametralt övermått'}</small><div class="big">${f(Math.abs(hot),4)} mm</div></div><p class="note">Hål: ${f(h,4)} mm (Δ ${f(h-dh,4)} mm). Axel: ${f(shaft,4)} mm (Δ ${f(shaft-ds,4)} mm).</p>`;
}
function grindMRRCalc(){const [a,b,v]=['grindDepth','grindWidth','grindTraverse'].map(numField);$('grindMRR').innerHTML=!finiteAll([a,b,v])||a<=0||b<=0||v<0?`<p class="error">${errMsg} Djup och bredd måste vara positiva.</p>`:`<div class="row"><div class="metric"><small>Volymavverkning Q</small><strong>${f(a*b*v,2)} mm³/min</strong></div><div class="metric"><small>Specifik avverkning Q′</small><strong>${f(a*v/60,3)} mm³/(mm·s)</strong></div></div>`}
const MP_KEY='passbit_measurements_v54';let mpRows=[];
try{const a=JSON.parse(localStorage.getItem(MP_KEY)||'[]');if(Array.isArray(a))mpRows=a.slice(0,5000).filter(x=>x&&typeof x==='object')}catch(e){}
const htmlEscape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mpValues(){const [nom,actual,lower,upper]=['mpNom','mpActual','mpLower','mpUpper'].map(numField);return {nom,actual,lower,upper,name:$('mpName').value.trim().slice(0,100),project:$('mpProject').value.trim().slice(0,100),ok:actual>=nom+lower-1e-10&&actual<=nom+upper+1e-10}}
function mpPreviewCalc(){const m=mpValues();$('mpPreview').innerHTML=!finiteAll([m.nom,m.actual,m.lower,m.upper])||m.lower>m.upper?`<p class="error">${errMsg} Undre avvikelse får inte överstiga övre.</p>`:`<div class="result"><small>Bedömning · ${f(m.nom+m.lower,4)}–${f(m.nom+m.upper,4)} mm</small><div class="big">${m.ok?'GODKÄND':'EJ GODKÄND'}</div><small>Avvikelse från nominellt: ${f(m.actual-m.nom,4)} mm</small></div>`}
function mpRender(){ $('mpList').innerHTML=mpRows.length?mpRows.map((m,i)=>`<div class="metric" style="margin-bottom:9px"><small>${htmlEscape(m.date||'')} · ${htmlEscape(m.project||'Utan order')} · ${htmlEscape(m.name||'Mätpunkt')}</small><strong>${f(m.actual,4)} mm · ${m.ok?'OK':'EJ OK'}</strong><div class="fine">${f(m.nom+m.lower,4)}–${f(m.nom+m.upper,4)} mm</div><button class="btn outline" style="margin-top:8px" type="button" data-delete-measure="${i}">Ta bort</button></div>`).join(''):'<p class="note">Inga sparade mätningar ännu.</p>'; }
function mpPersist(){try{localStorage.setItem(MP_KEY,JSON.stringify(mpRows));return true}catch(e){return false}}
function mpCSV(){const headers=['Tidpunkt','Projekt / order','Detalj','Nominellt mm','Undre avvikelse mm','Övre avvikelse mm','Uppmätt mm','Resultat'];const quote=x=>'"'+String(x).replace(/"/g,'""')+'"';const rows=mpRows.map(m=>[m.date,m.project||'',m.name,m.nom,m.lower,m.upper,m.actual,m.ok?'OK':'EJ OK'].map(quote).join(';'));const csv='\uFEFF'+[headers.map(quote).join(';'),...rows].join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PassBit_mätprotokoll.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
// v5.8: measured series statistics and offline spreadsheet export.
function mpSeriesKey(m){return JSON.stringify([m.project||'',m.name,m.nom,m.lower,m.upper])}
function mpSeriesRows(){const map=new Map();for(const m of mpRows){if(!Number.isFinite(m.actual)||!Number.isFinite(m.nom)||!Number.isFinite(m.lower)||!Number.isFinite(m.upper))continue;const key=mpSeriesKey(m);if(!map.has(key))map.set(key,[]);map.get(key).push(m)}return map}

/* 6.1: Offline SPC visualizations. Every SVG coordinate comes from validated numeric measurements. */
function mpPlotSvg(series,{title,lower=null,upper=null,center=null,lsl=null,usl=null,unit='mm',type='line'}={}){
 const vals=series.filter(Number.isFinite);if(!vals.length)return '';
 const W=700,H=255,L=63,R=18,T=28,B=39,iw=W-L-R,ih=H-T-B;
 const extras=[lower,upper,center,lsl,usl].filter(Number.isFinite);
 let mn=Math.min(...vals,...extras),mx=Math.max(...vals,...extras);
 let pad=(mx-mn)*.12;if(!(pad>0))pad=Math.max(Math.abs(mx)*.0001,.0001);
 mn-=pad;mx+=pad;
 const yy=v=>T+(mx-v)/(mx-mn)*ih,xx=i=>L+(vals.length===1?iw/2:i*iw/(vals.length-1));
 const fmt=v=>Number(v).toLocaleString('sv-SE',{maximumFractionDigits:4});
 let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}" xmlns="http://www.w3.org/2000/svg">`;
 for(let i=0;i<=4;i++){const v=mn+(mx-mn)*i/4,y=yy(v);svg+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="#355057" stroke-width="1"/><text x="${L-8}" y="${y+4}" text-anchor="end" fill="#9bb7b9" font-size="12">${fmt(v)}</text>`}
 const ref=(v,color,dash,label)=>{if(!Number.isFinite(v))return;const y=yy(v);svg+=`<line x1="${L}" y1="${y}" x2="${W-R}" y2="${y}" stroke="${color}" stroke-width="1.8" stroke-dasharray="${dash}"/><text x="${W-R-2}" y="${Math.max(13,y-5)}" text-anchor="end" fill="${color}" font-size="12">${label}</text>`};
 ref(lsl,'#e7b56e','5 4','LSL');ref(usl,'#e7b56e','5 4','USL');ref(lower,'#ee8390','7 5','LCL');ref(upper,'#ee8390','7 5','UCL');ref(center,'#83d9bb','4 4','CL');
 svg+=`<polyline fill="none" stroke="#c1ffdf" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${vals.map((v,i)=>`${xx(i)},${yy(v)}`).join(' ')}"/>`;
 vals.forEach((v,i)=>{const alert=(Number.isFinite(upper)&&v>upper)||(Number.isFinite(lower)&&v<lower);svg+=`<circle cx="${xx(i)}" cy="${yy(v)}" r="${alert?5:3.2}" fill="${alert?'#ff8e9a':'#b7ffe1'}"/>`});
 svg+=`<text x="${L}" y="${H-9}" fill="#a5bdc1" font-size="12">1</text><text x="${W-R}" y="${H-9}" text-anchor="end" fill="#a5bdc1" font-size="12">${vals.length} · mätordning</text></svg>`;
 return `<div class="spc-chart-card"><h3>${title}</h3>${svg}</div>`;
}
function mpHistogramSvg(x,lsl,usl){
 const n=x.length;if(!n)return '';
 const bins=Math.max(4,Math.min(12,Math.ceil(Math.sqrt(n))));
 let min=Math.min(...x,lsl),max=Math.max(...x,usl);if(min===max){min-=.001;max+=.001}
 const w=(max-min)/bins,counts=Array(bins).fill(0);for(const v of x)counts[Math.min(bins-1,Math.max(0,Math.floor((v-min)/w)))]++;
 const W=700,H=255,L=58,R=18,T=25,B=43,iw=W-L-R,ih=H-T-B,maxCount=Math.max(...counts,1);
 let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histogram över uppmätta värden" xmlns="http://www.w3.org/2000/svg">`;
 counts.forEach((c,i)=>{const bh=c/maxCount*ih,bw=iw/bins;svg+=`<rect x="${L+i*bw+1}" y="${T+ih-bh}" width="${Math.max(1,bw-2)}" height="${bh}" fill="#79d6b6" opacity=".86" rx="2"/>`});
 for(const [v,label] of [[lsl,'LSL'],[usl,'USL']]){if(!Number.isFinite(v))continue;const px=L+(v-min)/(max-min)*iw;svg+=`<line x1="${px}" y1="${T}" x2="${px}" y2="${T+ih}" stroke="#f5b87a" stroke-width="2" stroke-dasharray="5 4"/><text x="${px}" y="${T-7}" text-anchor="middle" font-size="12" fill="#f5b87a">${label}</text>`}
 const fmt=v=>v.toLocaleString('sv-SE',{maximumFractionDigits:4});svg+=`<text x="${L}" y="${H-11}" fill="#aac0c4" font-size="12">${fmt(min)} mm</text><text x="${W-R}" y="${H-11}" text-anchor="end" fill="#aac0c4" font-size="12">${fmt(max)} mm</text><text x="${L-8}" y="${T+8}" text-anchor="end" fill="#aac0c4" font-size="12">${maxCount}</text></svg>`;
 return `<div class="spc-chart-card"><h3>Histogram · ${n} mätningar</h3>${svg}</div>`;
}
function mpChartsRender(x,lsl,usl,mean,avgMR){
 const mr=x.slice(1).map((v,i)=>Math.abs(v-x[i]));
 const xU=Number.isFinite(avgMR)?mean+2.66*avgMR:null,xL=Number.isFinite(avgMR)?mean-2.66*avgMR:null;
 const mrU=Number.isFinite(avgMR)?3.267*avgMR:null;
 $('mpCharts').innerHTML=`<div class="spc-chart-heading">STYRKORT · LIVE DATA</div>${mpPlotSvg(x,{title:'X-diagram · individvärden',lower:xL,upper:xU,center:mean,lsl,usl})}${mr.length?mpPlotSvg(mr,{title:'MR-diagram · rörlig variationsbredd',lower:0,upper:mrU,center:avgMR}):''}${mpHistogramSvg(x,lsl,usl)}<p class="fine">X-gränser: medelvärde ± 2,66 × MR̄. MR-gränser: 0 till 3,267 × MR̄ (successiva par). Kräver tillräckligt många representativa observationer; få mätningar ger osäkra gränser.</p>`;
}
function mpStatsRender(){const series=mpSeriesRows(),sel=$('mpSeries'),old=sel.value;sel.innerHTML='<option value="">Välj mätserie</option>';let i=0;for(const [key,rows] of series){const m=rows[0],opt=document.createElement('option');opt.value=key;opt.textContent=`${m.project||'Utan order'} · ${m.name} · ${rows.length} mätningar`;sel.appendChild(opt);i++}if(series.has(old))sel.value=old;else if(i)sel.selectedIndex=1;const rows=series.get(sel.value)||[];if(!rows.length){$('mpStats').innerHTML='<p class="note">Spara mätningar för att se statistik.</p>';$('mpCharts').innerHTML='';return}const ordered=rows.slice().reverse(),x=ordered.map(m=>m.actual),n=x.length,m=ordered[0],mean=x.reduce((a,b)=>a+b,0)/n,lsl=m.nom+m.lower,usl=m.nom+m.upper,range=usl-lsl,pass=x.filter(v=>v>=lsl&&v<=usl).length;const avgMR=n>1?x.slice(1).reduce((a,v,i)=>a+Math.abs(v-x[i]),0)/(n-1):NaN;const sigmaWithin=avgMR/1.128;const sigmaOverall=n>1?Math.sqrt(x.reduce((a,v)=>a+(v-mean)**2,0)/(n-1)):NaN;const index=(sig)=>sig>1e-12&&range>0?[(range/(6*sig)),Math.min((usl-mean)/(3*sig),(mean-lsl)/(3*sig))]:[NaN,NaN];const [cp,cpk]=index(sigmaWithin),[pp,ppk]=index(sigmaOverall);const fmt=v=>Number.isFinite(v)?v.toFixed(3).replace('.',','):'—';const stats=n>=5?`<div class="spc-grid"><div class="metric"><small>Cp · inomvariation</small><strong>${fmt(cp)}</strong></div><div class="metric"><small>Cpk · inomvariation</small><strong>${fmt(cpk)}</strong></div><div class="metric"><small>Pp · totalvariation</small><strong>${fmt(pp)}</strong></div><div class="metric"><small>Ppk · totalvariation</small><strong>${fmt(ppk)}</strong></div></div>`:'<p class="note">Minst 5 mätvärden behövs för att visa duglighetsindex.</p>';$('mpStats').innerHTML=`<div class="result"><small>MEDELVÄRDE · ${n} MÄTNINGAR</small><div class="big">${fmt(mean)} mm</div><small>Godkända ${pass}/${n} · ${fmt(pass/n*100)} %</small></div><div class="spc-grid"><div class="metric"><small>Min / max</small><strong>${fmt(Math.min(...x))} / ${fmt(Math.max(...x))}</strong></div><div class="metric"><small>σ total</small><strong>${fmt(sigmaOverall)} mm</strong></div></div>${stats}<p class="fine">LSL ${fmt(lsl)} mm · USL ${fmt(usl)} mm. ${n>=5&&(!Number.isFinite(cpk)||!Number.isFinite(ppk))?'Otillräcklig variation för stabil indexberäkning.':''}</p>`;mpChartsRender(x,lsl,usl,mean,avgMR)}
function mpDownload(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
function mpJSON(){mpDownload(new Blob([JSON.stringify({format:'PassBit-Pro-measurements',version:1,rows:mpRows},null,2)],{type:'application/json'}),'PassBit_mätprotokoll_backup.json')}
function mpXML(s){return String(s??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]))}
// Minimal ZIP (stored entries) for a real, offline .xlsx without external libraries.
function mpZip(files){const te=new TextEncoder(),chunks=[],central=[];let offset=0;const u16=(n)=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];const crcTable=Array.from({length:256},(_,n)=>{for(let j=0;j<8;j++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0});const crc=data=>{let c=0xffffffff;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0};for(const [name,body] of files){const fn=te.encode(name),data=te.encode(body),check=crc(data),hdr=new Uint8Array([80,75,3,4,20,0,0,8,0,0,0,0,0,0,...u32(check),...u32(data.length),...u32(data.length),...u16(fn.length),0,0]);chunks.push(hdr,fn,data);central.push(new Uint8Array([80,75,1,2,20,0,20,0,0,8,0,0,0,0,0,0,...u32(check),...u32(data.length),...u32(data.length),...u16(fn.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(offset)]),fn);offset+=hdr.length+fn.length+data.length}const centralLen=central.reduce((a,c)=>a+c.length,0);chunks.push(...central,new Uint8Array([80,75,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(centralLen),...u32(offset),0,0]));return new Blob(chunks,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function mpXLSX(){const headers=['Tidpunkt','Projekt / order','Detalj / mätpunkt','Nominellt (mm)','Undre avvikelse (mm)','Övre avvikelse (mm)','Uppmätt (mm)','Resultat'];const data=[headers,...mpRows.map(m=>[m.date,m.project||'',m.name,m.nom,m.lower,m.upper,m.actual,m.ok?'OK':'EJ OK'])];const col=n=>{let s='';do{s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)-1}while(n>=0);return s};const rows=data.map((r,i)=>`<row r="${i+1}">${r.map((v,j)=>{const cell=col(j)+(i+1);return typeof v==='number'&&Number.isFinite(v)?`<c r="${cell}"><v>${v}</v></c>`:`<c r="${cell}" t="inlineStr"><is><t>${mpXML(v)}</t></is></c>`}).join('')}</row>`).join('');const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr defaultRowHeight="15"/><sheetData>${rows}</sheetData><autoFilter ref="A1:H${data.length}"/></worksheet>`;const files=[['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Mätprotokoll" sheetId="1" r:id="rId1"/></sheets></workbook>'],['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],['xl/worksheets/sheet1.xml',sheet]];mpDownload(mpZip(files),'PassBit_mätprotokoll.xlsx')}
function initNewTools(){
 ['runType','runMax','runMin'].forEach(id=>$(id).addEventListener('input',runoutCalc));$('chainRows').addEventListener('input',chainCalc);
 ['shHole','shShaft','shHoleAlpha','shShaftAlpha','shHoleTemp','shShaftTemp'].forEach(id=>$(id).addEventListener('input',shrinkCalc));
 ['grindDepth','grindWidth','grindTraverse'].forEach(id=>$(id).addEventListener('input',grindMRRCalc));
 ['mpProject','mpName','mpNom','mpActual','mpLower','mpUpper'].forEach(id=>$(id).addEventListener('input',mpPreviewCalc));
 $('mpSave').onclick=()=>{const m=mpValues();if(!finiteAll([m.nom,m.actual,m.lower,m.upper])||m.lower>m.upper||!m.name){$('mpStatus').textContent='Kontrollera namn och numeriska värden.';return}if(mpRows.length>=5000){$('mpStatus').textContent='Max 5000 mätningar. Exportera och radera gamla poster först.';return}m.date=new Date().toLocaleString('sv-SE');mpRows.unshift(m);const saved=mpPersist();mpRender();mpStatsRender();$('mpStatus').textContent=saved?'Mätningen sparad på enheten.':'Mätningen visas, men kunde inte lagras permanent. Exportera CSV.'};
 $('mpSeries').addEventListener('change',mpStatsRender);
 $('mpXLSX').onclick=()=>{if(!mpRows.length){$('mpStatus').textContent='Inga mätningar att exportera.';return}mpXLSX();$('mpStatus').textContent='Excel-fil skapad.'};
 $('mpJSON').onclick=()=>{mpJSON();$('mpStatus').textContent='Säkerhetskopia skapad.'};
 $('mpImport').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.format!=='PassBit-Pro-measurements'||!Array.isArray(data.rows)||data.rows.length>5000||!data.rows.every(m=>m&&typeof m.name==='string'&&[m.nom,m.actual,m.lower,m.upper].every(Number.isFinite)&&m.lower<=m.upper))throw Error('Ogiltigt format');if(!confirm('Ersätta alla nuvarande mätningar med säkerhetskopian?'))return;mpRows=data.rows.map(m=>({...m,ok:m.actual>=m.nom+m.lower-1e-10&&m.actual<=m.nom+m.upper+1e-10}));if(!mpPersist())throw Error('Kunde inte spara lokalt');mpRender();mpStatsRender();$('mpStatus').textContent='Säkerhetskopia importerad.'}catch(err){$('mpStatus').textContent='Import misslyckades: '+err.message}finally{e.target.value=''}});
 $('mpCSV').onclick=()=>{if(!mpRows.length){$('mpStatus').textContent='Inga mätningar att exportera.';return}mpCSV();$('mpStatus').textContent='CSV-export skapad.'};
 $('mpList').addEventListener('click',e=>{const btn=e.target.closest('[data-delete-measure]');if(!btn)return;mpRows.splice(Number(btn.dataset.deleteMeasure),1);mpPersist();mpRender();mpStatsRender()});
 $('mpClear').onclick=()=>{if(!mpRows.length)return;if(confirm('Radera alla sparade mätningar? Exportera CSV först om du vill behålla dem.')){mpRows=[];mpPersist();mpRender();mpStatsRender();$('mpStatus').textContent='Mätningarna är raderade.'}};
 runoutCalc();chainCalc();shrinkCalc();grindMRRCalc();mpPreviewCalc();mpRender();mpStatsRender();
}
function initPreferences(){
 const dict={"Kast & excentricitet":"Runout & eccentricity","TIR · radiellt och axiellt kast":"TIR · radial and axial runout","Toleranskedjor":"Tolerance stack-up","Min/max · worst case":"Min/max · worst case","Krymp & presspassning":"Shrink & interference fit","Temperatur · diameter · spel":"Temperature · diameter · clearance","Mätprotokoll":"Inspection log","Mätserier · Cpk · Excel":"Measurement · pass/fail · CSV","Välj verktyg": "Choose a tool", "VERKSTADSLÄGE": "WORKSHOP MODE", "Precisionsverktyg för verkstaden": "Precision tools for the workshop", "Inställningar": "Settings", "Språk": "Language", "Utseende": "Appearance", "Mörkt": "Dark", "Ljust": "Light", "Dina inställningar sparas på den här enheten.": "Your preferences are saved on this device.", "ISO-passningar": "ISO fits", "Hål · axel · spel och övermått": "Bore · shaft · clearance and interference", "Borr & brotsch": "Drilling & reaming", "Gängborr · förborrning": "Tap drill · predrilling", "Skruv & nycklar": "Screws & wrenches", "Insex · sexkant": "Hex socket · hex head", "Sinuslinjal": "Sine bar", "Vinkel · SIN · TAN": "Angle · SIN · TAN", "Passbitsbyggare": "Gauge block builder", "Exakta kombinationer": "Exact combinations", "Bråktum · µm · mil": "Fractions · µm · thou", "Temperatur": "Temperature", "Utvidgning och mätavvikelse": "Expansion and measurement error", "Skärdata": "Cutting data", "Varvtal · matning": "RPM · feed", "Slipdata": "Grinding data", "Skiva · arbetsstycke · hastighetskvot": "Wheel · workpiece · speed ratio", "Mitt passbitsset": "My gauge block set", "Spara egna mått": "Save custom sizes", "← Alla verktyg": "← All tools", "⧉ Kopiera resultat": "⧉ Copy result", "Beräkna vinkel och höjd": "Calculate angle and height", "Sinuslinjalens centrumavstånd (mm)": "Sine bar center distance (mm)", "Vinkel (grader)": "Angle (degrees)", "Dra reglaget eller skriv in exakt längd.": "Move the slider or enter the exact length.", "Reglage 0–45° i steg om 0,1°. Skriv in för högre precision.": "Slider 0–45° in steps of 0.1°. Type a value for higher precision.", "Räkna baklänges": "Reverse calculation", "Känd passbitshöjd (mm)": "Known gauge block height (mm)", "Beräkna vinkel": "Calculate angle", "Bygg en passbitshöjd": "Build a gauge block stack", "Önskad höjd (mm)": "Target height (mm)", "Hitta passbitar": "Find gauge blocks", "Hämta från sinus": "Use sine bar result", "ISO 286 – passningsväljare och toleransfält": "ISO 286 – fit selector and tolerance zones", "Nominell diameter (mm)": "Nominal diameter (mm)", "Hål": "Hole", "Axel": "Shaft", "Slipring vid olika diametrar": "Grinding wheel at different diameters", "Periferihastighet": "Peripheral speed", "SLIPSKIVA / RING": "GRINDING WHEEL / RING", "ARBETSSTYCKE": "WORKPIECE", "Diameter (mm)": "Diameter (mm)", "Varvtal (rpm)": "Speed (rpm)", "PROCESSFÖRHÅLLANDE": "PROCESS RATIO", "Hastighetsförhållande": "Speed ratio", "SNABBTABELL": "QUICK TABLE", "BAKLÄNGESBERÄKNING": "REVERSE CALCULATION", "Önskad periferihastighet": "Target peripheral speed", "Önskad hastighet (m/s)": "Target speed (m/s)", "Skivans max m/s (valfri)": "Wheel max m/s (optional)", "SLIPTEKNIK / GRINDING": "GRINDING TECHNOLOGY", "Ange diameter och varvtal för slipskiva och arbetsstycke. Alla resultat uppdateras direkt.": "Enter diameters and RPM for the wheel and workpiece. Results update instantly.", "Samma rpm som för slipskivan ovan. Se hur periferihastigheten ändras med ringdiametern.": "Uses the wheel RPM above. See how peripheral speed varies with diameter.", "Räkna baklänges – önskad m/s": "Reverse calculation – target m/s", "Skärdata – varvtal och matning": "Cutting data – RPM and feed", "Omvandla mått": "Convert units", "Temperaturutvidgning": "Thermal expansion", "Kopierat!": "Copied!", "Kopiera resultat": "Copy result"};
 const original=new WeakMap();
 const textFilter=['SCRIPT','STYLE','OPTION','TEXTAREA'];
 let currentLanguage='sv',busy=false;
 function translateNode(node){
  if(!node||!node.parentElement||textFilter.includes(node.parentElement.tagName))return;
  if(node.parentElement.closest('#languageSelect,#themeSelect'))return;
  let source=original.get(node);
  const now=node.nodeValue;
  if(source===undefined||(!busy&&now!==source&&now!==((dict[source]||source)))){source=now;original.set(node,source)}
  if(currentLanguage==='sv'){if(now!==source)node.nodeValue=source;return}
  const lead=source.match(/^\s*/)[0],trail=source.match(/\s*$/)[0],key=source.trim();
  const replacement=dict[key]||key;
  const output=lead+replacement+trail;
  if(now!==output)node.nodeValue=output;
 }
 function walk(root){
  if(root.nodeType===3){translateNode(root);return}
  if(root.nodeType!==1||textFilter.includes(root.tagName))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(translateNode);
 }
 function refresh(){busy=true;walk(document.body);busy=false;
  document.documentElement.lang=currentLanguage;
  $('settingsGear').setAttribute('aria-label',currentLanguage==='en'?'Settings':'Inställningar');
  $('settingsClose').setAttribute('aria-label',currentLanguage==='en'?'Close':'Stäng');
  document.title='PassBit Pro 6.2 – '+(currentLanguage==='en'?'Precision tools':'Precisionsverktyg');
  const names=currentLanguage==='en'?{sin:'Sine bar',blocks:'Gauge blocks',fits:'ISO fits',holes:'Drilling & reaming',screws:'Screws & wrenches',convert:'mm ↔ inch',thermal:'Temperature',cutting:'Cutting data',grinding:'Grinding data',stock:'My gauge blocks'}:toolNames;
  const shown=Array.from(document.querySelectorAll('section[id]')).find(e=>!e.classList.contains('hidden')&&e.id!=='settingsPanel');
  if(shown&&names[shown.id])$('currentTool').textContent=names[shown.id];
 }
 let savedLanguage='sv',savedTheme='dark';
 try{savedLanguage=localStorage.getItem('passbit_language')||'sv';savedTheme=localStorage.getItem('passbit_theme')||'dark'}catch(e){}
 currentLanguage=savedLanguage==='en'?'en':'sv';
 $('languageSelect').value=currentLanguage;
 $('themeSelect').value=savedTheme==='light'?'light':'dark';
 document.body.classList.toggle('light',$('themeSelect').value==='light');
 $('settingsGear').addEventListener('click',()=>{$('settingsPanel').classList.toggle('hidden');if(!$('settingsPanel').classList.contains('hidden'))window.scrollTo({top:0,behavior:'instant'})});
 $('settingsClose').addEventListener('click',()=>$('settingsPanel').classList.add('hidden'));
 $('languageSelect').addEventListener('change',e=>{currentLanguage=e.target.value;try{localStorage.setItem('passbit_language',currentLanguage)}catch(e){}refresh()});
 $('themeSelect').addEventListener('change',e=>{const theme=e.target.value;document.body.classList.toggle('light',theme==='light');try{localStorage.setItem('passbit_theme',theme)}catch(e){}});
 // Performance: language is refreshed explicitly, not on every DOM text mutation.
 refresh();
}


// Development-only Free/Pro preview. NEVER use this state as proof of purchase.
window.passbitPreviewEdition='ultra';
function setPreviewEdition(edition){
 window.passbitPreviewEdition=['free','pro','ultra'].includes(edition)?edition:'ultra';
 const isFree=window.passbitPreviewEdition==='free';
 $('previewFree').classList.toggle('active',isFree);
 $('previewPro').classList.toggle('active',window.passbitPreviewEdition==='pro');
 $('previewUltra')?.classList.toggle('active',window.passbitPreviewEdition==='ultra');
 $('editionName').textContent=isFree?'Free · Testläge':(window.passbitPreviewEdition==='ultra'?'Ultra · Utvecklingsläge':'Pro · Testläge');
 $('editionDesc').textContent=isFree?'Grundverktyg ingår. Pro-verktyg visas med märkning.':(window.passbitPreviewEdition==='ultra'?'Alla verktyg och projekt är tillgängliga i utvecklingsläget.':'Pro-verktyg är tillgängliga, Ultra kräver Ultra-testläge.');
 document.querySelectorAll('.dashbtn[data-go]').forEach(b=>b.classList.toggle('preview-locked',!window.passbitCanUse(b.dataset.go)));
 showHome();
}
$('previewFree').addEventListener('click',()=>setPreviewEdition('free'));
$('previewPro').addEventListener('click',()=>setPreviewEdition('pro'));
$('previewUltra')?.addEventListener('click',()=>setPreviewEdition('ultra'));
$('previewUnlock').addEventListener('click',()=>setPreviewEdition(window.passbitToolTier(window.passbitCurrentTool||'fits')==='ultra'?'ultra':'pro'));

setPreviewEdition('ultra');
initNewTools();
initPreferences();
