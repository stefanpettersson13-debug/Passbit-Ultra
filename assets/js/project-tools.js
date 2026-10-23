(()=>{
'use strict';
const $=id=>document.getElementById(id),STORE='passbit-abb-service-v1';
const entries=[
['IRC5','Styrsystem','ABB:s robotstyrsystem som används med flera generationer industrirobotar.'],
['OmniCore','Styrsystem','ABB:s nyare styrplattform. Menyer och funktioner varierar med version.'],
['RobotWare','System','Programvaran i ABB:s robotstyrning; versionsnummer är viktigt vid felsökning.'],
['FlexPendant','HMI','Handenhet för manövrering, programmering och diagnostik.'],
['RobotStudio','Programvara','ABB:s programvara för offlineprogrammering, simulering och vissa onlinefunktioner.'],
['Event Log','Diagnos','Händelselogg med meddelanden och alarm. Läs kod, full text och tidsföljd.'],
['RAPID','Programmering','ABB:s programspråk för robotrörelser, logik och processer.'],
['MoveJ','RAPID','Ledinterpolerad robotrörelse till målposition.'],
['MoveL','RAPID','Linjär rörelse för TCP enligt aktiv verktygs- och arbetsobjektsdefinition.'],
['MoveC','RAPID','Cirkulär TCP-rörelse via mellanpunkt och mål.'],
['robtarget','RAPID','Datatyp för robotmål, inklusive position, orientering och konfiguration.'],
['jointtarget','RAPID','Datatyp för ledpositioner och externa axlar.'],
['tooldata','RAPID','Verktygsdefinition, bland annat TCP och belastningsdata.'],
['wobjdata','RAPID','Arbetsobjekt och dess koordinatsystem.'],
['TCP','Koordinater','Tool Center Point: verktygets referenspunkt. Felaktig TCP kan ge positionsfel.'],
['WorkObject','Koordinater','Arbetsobjekt som definierar koordinatsystem för programmerade mål.'],
['Base frame','Koordinater','Referensram för robotens bas; kontrollera aktuell kalibrering och installation.'],
['Motors On','Status','Tillstånd som avser aktiverad drivning enligt säkerhetsvillkor.'],
['Auto / Manual','Driftläge','Automatiskt respektive manuellt driftläge. Säkerhetsvillkor skiljer sig åt.'],
['Program Pointer','RAPID','Visar vilken programinstruktion som ska utföras.'],
['I/O','Signal','In- och utgångar som kopplar roboten till cellens övriga utrustning.'],
['EIO','Konfiguration','Konfiguration av I/O-system i tillämpliga RobotWare-versioner.'],
['PERS','RAPID','Persistent variabel vars värde kan behållas och uppdateras.'],
['VAR','RAPID','Variabeldeklaration för programmeringsdata.'],
['CONST','RAPID','Konstantdeklaration.'],
['TRAP','RAPID','Traprutin för hantering av avbrott i tillämpliga sammanhang.'],
['WaitDI','RAPID','Väntar på villkor för digital insignal.'],
['SetDO','RAPID','Sätter en digital utgång.'],
['StopMove','RAPID','Rörelsestopp i särskilda programsekvenser; ska inte förväxlas med säkerhetsstopp.'],
['Calibration','Service','Kalibrering av robotaxlar och referenser enligt modellspecifik ABB-procedur.'],
['Revolution counter','Service','Räknare kopplade till axelpositioner; felaktig uppdatering kan ge allvarliga positionsfel.'],
['SafeMove','Säkerhet','ABB:s säkerhetsfunktioner i tillämpliga system; konfiguration kräver behörig personal.']
];
const search=$('abb-search'),result=$('abb-results');
function render(){const q=search.value.toLocaleLowerCase('sv').trim();const filtered=entries.filter(x=>x.join(' ').toLocaleLowerCase('sv').includes(q));$('abb-count').textContent=filtered.length+' begrepp';result.replaceChildren();filtered.forEach(([name,cat,desc])=>{const el=document.createElement('article');el.className='sinu-entry';for(const [tag,content] of [['em',cat],['strong',name],['small',desc]]){const n=document.createElement(tag);n.textContent=content;el.append(n)}result.append(el)})}
search.addEventListener('input',render);render();
const common=[
'Säkra arbetsområdet och kontrollera personskydd, robotens driftläge och eventuella farliga energier.',
'Notera exakt eventnummer, full eventtext, tidsstämpel och eventsekvens från Event Log.',
'Notera robotmodell, styrsystem, RobotWare-version, program, modul och aktuell programpekare.',
'Kontrollera rätt ABB-manual och cellbyggarens dokumentation innan någon ändring.',
'Dokumentera observationer och genomförda kontroller utan att kringgå förreglingar eller säkerhetsfunktioner.'
];
const extra={
event:['Avgör om eventet avser styrning, robot, drivning, kommunikation eller cellintegration.','Notera det första relevanta eventet och vilka händelser som följde.'],
motion:['Notera vilka axlar som berörs och i vilket läge problemet uppstår.','Jämför visade positioner och status; försök inte tvinga rörelse.'],
program:['Notera RAPID-modul, rutin och programpekare vid stopp.','Kontrollera synliga felmeddelanden och förutsättningar för start utan att ändra programmet.'],
io:['Notera signalnamn, förväntat och faktiskt signaltillstånd.','Kontrollera I/O-status och kommunikationshändelser utan att forcera utgångar.'],
tool:['Kontrollera vilken tooldata och wobjdata som är aktiva enligt godkänd referens.','Verifiera TCP och koordinatsystem med behörig metod innan korrigering.'],
cal:['Kontrollera kalibreringsstatus och servicehistorik.','Ändra inte revolution counters eller kalibreringsdata utan ABB:s modellspecifika instruktion.'],
safety:['Notera exakt säkerhetsmeddelande och vilka skyddsvillkor som saknas.','Kringgå aldrig skydd, SafeMove, grindar eller nödstopp för att återstarta.']
};
const keys={machine:'abb-machine',controller:'abb-controller',version:'abb-version',code:'abb-code',event:'abb-event',symptom:'abb-symptom',mode:'abb-mode',notes:'abb-notes'};
let report='',record=null;
const val=id=>$(id).value.trim();
function get(){try{const a=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(a)?a:[]}catch{return []}}
function saved(){const host=$('abb-saved');host.replaceChildren();const items=get();if(!items.length){host.textContent='Inga sparade ärenden.';return}items.forEach(item=>{const row=document.createElement('div');row.className='sinu-saved-row';const label=document.createElement('span');label.textContent=(item.data.machine||'Okänd cell')+' · '+(item.data.code||'utan eventnummer')+' · '+new Date(item.data.date).toLocaleDateString('sv-SE');const btn=document.createElement('button');btn.type='button';btn.textContent='Öppna';btn.addEventListener('click',()=>{for(const [k,id] of Object.entries(keys))$(id).value=item.data[k]||'';generate()});row.append(label,btn);host.append(row)})}
function generate(){
 const data={};for(const [key,id] of Object.entries(keys))data[key]=val(id);data.date=new Date().toISOString();record=data;
 const steps=[...common,...extra[data.symptom]];
 report=['PASSBIT PRO · ABB ROBOTAR · SERVICEUNDERLAG','Datum: '+new Date(data.date).toLocaleString('sv-SE'),...Object.entries(keys).map(([k])=>k+': '+(data[k]||'Ej angivet')),'','KONTROLLPLAN',...steps.map((v,i)=>(i+1)+'. '+v),'','Ingen alarmspecifik diagnos har gjorts. Kontrollera officiell ABB-/OEM-dokumentation.'].join('\n');
 const host=$('abb-plan');host.hidden=false;host.replaceChildren();const h=document.createElement('h4');h.textContent='Föreslagen kontrollplan';host.append(h);const caution=document.createElement('p');caution.className='sinu-caution';caution.textContent='Återställ inte säkerhetsstopp, kalibrering, räknare eller styrdata utan behörighet och korrekt procedur.';host.append(caution);const ol=document.createElement('ol');for(const step of steps){const li=document.createElement('li');li.textContent=step;ol.append(li)}host.append(ol);
 ['abb-copy','abb-save','abb-export'].forEach(id=>$(id).disabled=false);$('abb-status').textContent='Kontrollplan skapad.';
}
$('abb-generate').addEventListener('click',generate);
$('abb-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(report);$('abb-status').textContent='Underlaget kopierat.'}catch{$('abb-status').textContent='Kopiering är inte tillgänglig. Använd export.'}});
$('abb-save').addEventListener('click',()=>{if(!record)return;try{const items=get();items.unshift({data:record,report});localStorage.setItem(STORE,JSON.stringify(items.slice(0,100)));saved();$('abb-status').textContent='Ärendet sparat lokalt.'}catch{$('abb-status').textContent='Lagring misslyckades.'}});
$('abb-export').addEventListener('click',()=>{if(!report)return;const url=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='abb-service-'+new Date().toISOString().slice(0,10)+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$('abb-clear').addEventListener('click',()=>{if(!confirm('Radera alla sparade ABB-serviceärenden på denna enhet?'))return;localStorage.removeItem(STORE);saved()});
saved();
})();