(()=>{
'use strict';
const $=id=>document.getElementById(id);
const STORE='passbit-sinumerik-cases-v1';
const common=[
'Kontrollera personsäkerhet, nödstopp, skydd och maskinens aktuella tillstånd innan någon åtgärd.',
'Notera tidpunkt, exakt alarmnummer och full alarmtext; ta gärna ett foto av HMI.',
'Kontrollera aktiv kanal, driftläge, programblock och berörda axlar utan att ändra maskindata.',
'Jämför alarmnumret med dokumentation för exakt SINUMERIK-version och maskintillverkare.',
'Följ endast godkänd serviceprocedur; dokumentera vad som kontrollerats och resultatet.'
];
const guides={
alarm:['Avgör om meddelandet kommer från NC, PLC, Drive eller maskintillverkarens HMI.','Kontrollera eventuella följdalarm och vilket alarm som uppträdde först.','Notera om felet återkommer och vid vilket maskintillstånd.'],
axis:['Notera berörd axel och om felet uppträder i JOG, AUTO eller vid referenskörning.','Kontrollera HMI-status för förreglingar, gränser och drivberedskap enligt maskinens rutiner.','Jämför ärposition och börposition utan att tvinga någon rörelse.'],
spindle:['Notera programmerat varvtal, visat ärvarvtal och eventuella drive-/PLC-alarm.','Kontrollera spindelberedskap, säkerhetsvillkor och relevanta statusmeddelanden.','Undvik upprepade startförsök innan mekaniska och elektriska risker bedömts.'],
program:['Dokumentera exakt NC-block och eventuellt alarm vid stopp.','Kontrollera programval, aktiv kanal, driftläge och om block-/matningsspärr är aktiv.','Kontrollera verktygs- och nollpunktsdata mot godkänd inställningslista.'],
tool:['Dokumentera verktygsnummer, D-korrigering, magasinposition och aktuell sekvens.','Kontrollera statusmeddelanden och förreglingar för verktygsväxling.','Manövrera inte verktygsväxlaren manuellt utan maskinbyggarens procedur.'],
comm:['Dokumentera vilka HMI-sidor eller tjänster som saknar data.','Kontrollera synliga kommunikations- och systemalarm, samt om NC/PLC fortsätter fungera.','Notera senaste mjukvaru-, nätverks- eller behörighetsändringar utan att ändra konfiguration.'],
quality:['Notera artikel, verktyg, mätmetod, temperatur och när avvikelsen började.','Kontrollera nollpunktsförskjutningar, verktygskorrigeringar och kompenseringar mot godkända värden.','Jämför maskinens visade positioner med oberoende mätning innan någon korrigering görs.']
};
let report='',current=null;
function field(id){return $(id).value.trim()}
function escapeHtml(v){return v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function generate(){
 const data={machine:field('sfa-machine'),alarm:field('sfa-alarm'),alarmText:field('sfa-text'),system:field('sfa-system'),symptom:field('sfa-symptom'),mode:field('sfa-mode'),axis:field('sfa-axis'),notes:field('sfa-notes'),date:new Date().toISOString()};
 const steps=[...common,...guides[data.symptom]];
 const head=['PASSBIT PRO · SINUMERIK ONE · SERVICEUNDERLAG','Skapad: '+new Date(data.date).toLocaleString('sv-SE'),'Maskin: '+(data.machine||'Ej angiven'),'Alarmnummer: '+(data.alarm||'Ej angivet'),'Alarmtext: '+(data.alarmText||'Ej angiven'),'Subsystem: '+data.system,'Symptom: '+$('sfa-symptom').selectedOptions[0].text,'Driftläge: '+data.mode,'Kanal/axel: '+(data.axis||'Ej angiven'),'Observationer: '+(data.notes||'Inga'),'', 'KONTROLLPLAN',...steps.map((s,i)=>(i+1)+'. '+s),'','OBS: Förslag till kontrollpunkter, inte en bekräftad diagnos. Verifiera med officiell Siemens- och OEM-dokumentation.'];
 report=head.join('\n');current=data;
 const target=$('sfa-plan');target.replaceChildren();target.hidden=false;
 const heading=document.createElement('h4');heading.textContent='Föreslagen kontrollplan';target.append(heading);
 const caution=document.createElement('p');caution.className='sinu-caution';caution.textContent='Inga alarmorsaker fastställs automatiskt. Ändra inte maskin-/drivdata, säkerhetsfunktioner eller referenspunkter utan rätt dokumentation och behörighet.';target.append(caution);
 const ol=document.createElement('ol');for(const step of steps){const li=document.createElement('li');li.textContent=step;ol.append(li)}target.append(ol);
 const context=document.createElement('p');context.className='fine';context.textContent='Alarm: '+(data.alarm||'ej angivet')+' · '+(data.alarmText||'ingen alarmtext')+' · '+data.system;target.append(context);
 ['sfa-copy','sfa-save','sfa-export'].forEach(id=>$(id).disabled=false);
 $('sfa-status').textContent='Plan skapad. Kontrollera uppgifterna innan du använder underlaget.';
}
function getSaved(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function renderSaved(){
 const target=$('sfa-saved');target.replaceChildren();const cases=getSaved();
 if(!cases.length){const p=document.createElement('p');p.className='fine';p.textContent='Inga sparade ärenden.';target.append(p);return}
 cases.forEach((item,i)=>{const row=document.createElement('div');row.className='sinu-saved-row';const label=document.createElement('span');label.textContent=(item.data.machine||'Okänd maskin')+' · '+(item.data.alarm||'utan alarm')+' · '+new Date(item.data.date).toLocaleDateString('sv-SE');const btn=document.createElement('button');btn.type='button';btn.textContent='Öppna';btn.addEventListener('click',()=>{for(const [key,id] of Object.entries({machine:'sfa-machine',alarm:'sfa-alarm',alarmText:'sfa-text',system:'sfa-system',symptom:'sfa-symptom',mode:'sfa-mode',axis:'sfa-axis',notes:'sfa-notes'}))$(id).value=item.data[key]||'';generate();$('sfa-plan').scrollIntoView({behavior:'smooth',block:'nearest'})});row.append(label,btn);target.append(row)});
}
$('sfa-generate').addEventListener('click',generate);
$('sfa-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(report);$('sfa-status').textContent='Serviceunderlaget kopierat.'}catch{$('sfa-status').textContent='Kopiering stöds inte här. Använd export i stället.'}});
$('sfa-save').addEventListener('click',()=>{if(!current)return;try{const saved=getSaved();saved.unshift({data:current,report});localStorage.setItem(STORE,JSON.stringify(saved.slice(0,100)));renderSaved();$('sfa-status').textContent='Ärendet sparat lokalt på enheten.'}catch{$('sfa-status').textContent='Kunde inte spara. Kontrollera webbläsarens lagringsutrymme.'}});
$('sfa-export').addEventListener('click',()=>{if(!report)return;const blob=new Blob([report],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sinumerik-service-'+new Date().toISOString().slice(0,10)+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('sfa-clear').addEventListener('click',()=>{if(!confirm('Radera alla sparade SINUMERIK-serviceärenden på denna enhet?'))return;localStorage.removeItem(STORE);renderSaved();$('sfa-status').textContent='Sparade ärenden raderade.'});
renderSaved();
})();