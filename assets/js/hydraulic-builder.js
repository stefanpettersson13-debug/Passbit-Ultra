(()=>{'use strict';
const root=document.getElementById('hyd-builder');if(!root)return;
const $=id=>document.getElementById(id);
const options={
source:[['pump','Hydraulpump'],['existing','Befintligt tryckuttag']],
line:[['tube','Stålrör'],['hose','Hydraulslang']],
seal:[['eo','Parker EO 24° (metriskt rör)'],['orfs','Parker O-Lok ORFS'],['jic','Parker Triple-Lok JIC 37°'],['bspp','BSPP / G-port'],['orb','SAE ORB-port']],
destination:[['cylinder','Dubbelverkande cylinder'],['motor','Hydraulmotor'],['test','Test- / mätuttag']],
instrument:[['both','Tryck + flöde'],['pressure','Endast tryck'],['flow','Endast flöde'],['none','Inga mätare']]
};
const sizes=[6,8,10,12,15,16,18,20,22,25,28,30,35,38,42];
const diameter={6:4,8:6,10:7,12:9,15:12,16:12,18:14,20:16,22:18,25:20,28:23,30:25,35:29,38:32,42:35};
const fill=(id,values)=>{$(id).innerHTML=values.map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('')};
Object.entries(options).forEach(([k,v])=>fill('hb-'+k,v));
fill('hb-od',sizes.map(n=>[n,'Ø '+n+' mm']));
$('hb-od').value='12';
const num=id=>{const n=Number(String($(id).value).replace(',','.'));return String($(id).value).trim()!==''&&Number.isFinite(n)?n:NaN};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
function render(){
 const source=$('hb-source').value,line=$('hb-line').value,seal=$('hb-seal').value,dest=$('hb-destination').value,inst=$('hb-instrument').value;
 const od=num('hb-od'),wall=num('hb-wall'),length=num('hb-length'),pressure=num('hb-pressure'),flow=num('hb-flow'),hoseId=num('hb-hose-id');
 const id=line==='tube'?od-2*wall:hoseId;
 const valid=[length,pressure,flow,id].every(Number.isFinite)&&id>0&&length>0&&pressure>=0&&flow>=0&&(line==='tube'?[od,wall].every(Number.isFinite)&&wall>0&&wall<od/2:hoseId>0);
 const lines=[],warnings=[],parts=[];
 function part(qty,name,reason){parts.push({qty,name,reason})}
 const eo=seal==='eo';
 part(1,source==='pump'?'Pumpanslutning / portadapter':'Adapter för befintligt tryckuttag','Verifiera verklig portgänga, tätning och tillåtet arbetstryck');
 if(source==='pump')part(1,'Tryckbegränsningsventil och säker retur till tank','Tryckbegränsning dimensioneras för pumpens maxflöde; separat från mätutrustning');
 if(eo){
  part(line==='tube'?2:0,'Parker EO 24° ändkoppling, rör-OD '+od+' mm','Välj rätt L/S-serie, material, mutter och skärring/EO-2');
  if(line==='hose')part(2,'Slangändar som passar EO 24° anslutning','Slang och presskoppling måste vara ett godkänt Parker-system');
 }else{
  part(2,({orfs:'Parker O-Lok ORFS',jic:'Parker Triple-Lok JIC 37°',bspp:'BSPP G',orb:'SAE ORB'})[seal]+' ändadapter','Kontrollera gängstorlek och motpartens tätningsgeometri');
 }
 part(1,line==='tube'?'Hydraulrör Ø'+od+' × '+wall+' mm, '+length+' m':'Hydraulslang ID '+hoseId+' mm, '+length+' m','Material, böjradie, pulsationer, temperatur och arbetstryck måste verifieras');
 if(line==='tube')part(2,'Rörklammer / rörstöd (principantal)','Verkligt antal och avstånd beror på installationen');
 else part(2,'Parker-kompatibla presskopplingar + hylsor','Matcha slangserie, koppling och pressdata från tillverkaren');
 if(inst==='both'||inst==='pressure'){
  part(1,'T-förgrening eller dedikerat mätuttag','Välj rätt huvudledning, grenstorlek och anslutningsstandard');
  part(1,'Tryckmätare eller tryckgivare','Mätområde, noggrannhet, vibration och pulsation');
  part(1,'Mätuttag / manometeradapter','Avstängning och säkert serviceuttag vid behov');
 }
 if(inst==='both'||inst==='flow'){
  part(1,'Hydraulisk flödesmätare','Välj mätområde, viskositet, tryckklass och tillåtet tryckfall');
  part(2,'Flödesmätaradaptrar','Matcha mätarens portar mot vald ledningsstandard');
 }
 if(dest==='cylinder'){
  part(1,'4/3-riktningsventil för dubbelverkande cylinder','Mittläge, flöde och tryckklass bestäms av funktionen');
  part(2,'Cylinderportadaptrar, A och B','Cylinderportar kan ha annan gänga än huvudledningen');
  part(1,'Returledning till tank','Separat returväg och eventuellt filter');
 }else if(dest==='motor'){
  part(1,'Riktnings-/flödesventil till hydraulmotor','Kontrollera rotationsriktning, överlast och bromsfunktion');
  part(1,'Returledning samt eventuell läckoljeledning','Motorleverantörens krav avgör dränering');
 }else{
  part(1,'Testkoppling / säker mätport','Provning kräver avlastning och lämplig avstängning');
 }
 if(eo)warnings.push('EO 24°-kopplingar kräver rätt rör-OD och korrekt L/S-serie. Denna byggare väljer inte verifierat artikelnummer.');
 if(seal==='jic')warnings.push('JIC 37° är inte kompatibel med EO 24° enbart för att gängan verkar passa.');
 if(seal==='bspp'||seal==='orb')warnings.push('Portgängan behöver specificerad tätning; gängbeteckning ensam räcker inte.');
 if(line==='hose')warnings.push('Hydraulslangens tryckklass gäller komplett monterad slangledning, inte bara slangen.');
 if(source==='existing')warnings.push('Befintlig anslutnings porttyp och tryckbegränsning måste identifieras före montage.');
 warnings.push('Schemat visar en konceptuell anslutningskedja, inte ett komplett ISO 1219-kretsschema eller en monteringsanvisning.');
 const label=x=>({pump:'Pump',existing:'Tryckuttag',tube:'Rör',hose:'Slang',cylinder:'Cylinder',motor:'Motor',test:'Testport'})[x]||x;
 const stages=[label(source),'Adapter',label(line),inst==='none'?'Skarv':'Mätpunkt',label(dest)];
 const colors=['#86b4c9','#b2cbd7','#6eafc8','#d8bc83','#8db9d0'];
 const svg='<svg viewBox="0 0 340 208" role="img" aria-label="Hydraulisk principskiss från tryckkälla till förbrukare" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hb-metal" x1="0" x2="1"><stop stop-color="#486578"/><stop offset=".5" stop-color="#c7dce7"/><stop offset="1" stop-color="#49677c"/></linearGradient></defs><path d="M29 85H311" stroke="#376a85" stroke-width="13" stroke-linecap="round"/><path d="M29 85H311" stroke="#8bd4ed" stroke-width="2" stroke-dasharray="9 8"/>'+stages.map((v,i)=>{const x=33+i*68;return '<rect x="'+(x-24)+'" y="58" width="49" height="54" rx="10" fill="url(#hb-metal)" stroke="'+colors[i]+'" stroke-width="2"/><text x="'+x+'" y="89" font-size="14" font-weight="700" text-anchor="middle" fill="#102d40">'+(i+1)+'</text><text x="'+x+'" y="137" font-size="10" text-anchor="middle" fill="#d6eaf2">'+escape(v)+'</text>'}).join('')+'<path d="M270 85l-9-7v14z" fill="#b6f0ff"/><text x="170" y="24" font-size="13" text-anchor="middle" fill="#d9ecf4">HYDRAULIK · PRINCIPFLÖDE</text><text x="170" y="177" font-size="11" text-anchor="middle" fill="#a6c4d4">'+(valid?'Ø inv. '+id.toLocaleString('sv-SE')+' mm · '+flow.toLocaleString('sv-SE')+' l/min':'Kontrollera dimensioner')+'</text><text x="170" y="196" font-size="10" text-anchor="middle" fill="#91b0c2">Ej installationsritning · ej skalenlig</text></svg>';
 $('hb-svg').innerHTML=svg;
 if(!valid){$('hb-result').innerHTML='<p class="hyd-warn">Kontrollera inmatningen: alla aktiva dimensioner måste vara positiva. För rör måste väggtjockleken vara mindre än halva ytterdiametern.</p>';return}
 const velocity=flow/60000/(Math.PI*(id/1000)**2/4);
 const power=pressure*flow/600;
 const summary='<div class="hyd-metrics"><div><small>Invändig diameter</small><strong>'+id.toLocaleString('sv-SE')+' mm</strong></div><div><small>Flödeshastighet</small><strong>'+velocity.toLocaleString('sv-SE',{maximumFractionDigits:2})+' m/s</strong></div><div><small>Hydraulisk effekt</small><strong>'+power.toLocaleString('sv-SE',{maximumFractionDigits:2})+' kW</strong></div><div><small>Antal poster</small><strong>'+parts.length+'</strong></div></div>';
 const table='<div class="hb-parts">'+parts.filter(p=>p.qty>0).map((p,i)=>'<div class="hb-part"><span class="hb-num">'+(i+1)+'</span><div><strong>'+p.qty+' × '+escape(p.name)+'</strong><small>'+escape(p.reason)+'</small></div></div>').join('')+'</div>';
 $('hb-result').innerHTML=summary+'<h3>Förslag till komponentlista</h3>'+table+'<h3>Kontroll före beställning</h3>'+warnings.map(w=>'<p class="hyd-note">'+escape(w)+'</p>').join('')+'<p class="fine">Alla kvantiteter är principiella och måste stämmas av mot ett riktigt hydraulschema. Inga Parker-artikelnummer eller tryckklasser är verifierade.</p>';
 $('hb-copy').onclick=async()=>{const text='HYDRAULIK · PRELIMINÄR KOMPONENTLISTA\n'+parts.filter(p=>p.qty>0).map(p=>p.qty+' × '+p.name+' — '+p.reason).join('\n')+'\n\n'+warnings.join('\n');try{await navigator.clipboard.writeText(text);$('hb-copy').textContent='Kopierat ✓';setTimeout(()=>$('hb-copy').textContent='Kopiera komponentlista',1800)}catch(e){$('hb-copy').textContent='Kopiering stöds inte här';}};
}
root.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',render));
root.querySelectorAll('[data-hb-preset]').forEach(b=>b.addEventListener('click',()=>{const mode=b.dataset.hbPreset;$('hb-source').value='pump';$('hb-line').value=mode==='hose'?'hose':'tube';$('hb-seal').value=mode==='hose'?'orfs':'eo';$('hb-destination').value='cylinder';$('hb-instrument').value='both';$('hb-pressure').value=mode==='hose'?'210':'160';$('hb-flow').value=mode==='hose'?'45':'30';render()}));
render();
})();