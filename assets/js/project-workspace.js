
(()=>{'use strict';
const $=id=>document.getElementById(id), KEY='passbit-ultra-projects-v1';
let projects=[],active='';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=x=>{if(String(x).trim()==='')return null;const n=Number(String(x).trim().replace(',','.'));return Number.isFinite(n)?n:null};
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');projects=Array.isArray(v)?v.filter(p=>p&&typeof p.id==='string').slice(0,1000):[]}catch{projects=[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(projects));return true}catch{status('Lagringen är full eller blockerad. Exportera projekt som JSON.');return false}}
function status(msg){$('pj-status').textContent=msg}
function selected(){return projects.find(p=>p.id===active)}
function fields(p){$('pj-name').value=p?.name||'';$('pj-client').value=p?.client||'';$('pj-machine').value=p?.machine||'';$('pj-type').value=p?.type||'Service';$('pj-date').value=p?.date||new Date().toLocaleDateString('sv-SE');$('pj-tech').value=p?.tech||'';$('pj-notes').value=p?.notes||''}
function draw(){
 const sel=$('pj-select');sel.replaceChildren(new Option('Välj ett projekt',''));
 projects.forEach(p=>sel.add(new Option(p.name+' · '+(p.client||p.date||'Utan kund'),p.id)));
 sel.value=active;
 const p=selected();fields(p);
 $('pj-measures').replaceChildren();
 (p?.measurements||[]).forEach((m,i)=>{
  const tr=document.createElement('tr');
  const status=m.min!==null&&m.value<m.min||m.max!==null&&m.value>m.max?'Utanför':m.min===null&&m.max===null?'Ej bedömd':'Inom gräns';
  for(const val of [m.point,`${m.value} ${m.unit}`,`${m.min??'–'} – ${m.max??'–'}`,status]){
   const td=document.createElement('td');td.textContent=val;tr.append(td);
  }
  const td=document.createElement('td'),btn=document.createElement('button');btn.type='button';btn.textContent='Ta bort';btn.className='pb-pj-remove';btn.addEventListener('click',()=>{p.measurements.splice(i,1);save();draw()});td.append(btn);tr.append(td);$('pj-measures').append(tr);
 });
}
function upsert(){let p=selected();if(!p){p={id:uid(),measurements:[]};projects.unshift(p);active=p.id}
 for(const [prop,id] of [['name','pj-name'],['client','pj-client'],['machine','pj-machine'],['type','pj-type'],['date','pj-date'],['tech','pj-tech'],['notes','pj-notes']])p[prop]=$(id).value.trim();
 p.updated=new Date().toISOString();save();draw();status('Projektet sparades på denna enhet.');return p}
function download(name,contents,mime){const url=URL.createObjectURL(new Blob([contents],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
const filename=p=>String(p.name||'projekt').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,50)||'projekt';
function report(p){
 const rows=(p.measurements||[]).map(m=>{const result=m.min!==null&&m.value<m.min||m.max!==null&&m.value>m.max?'Utanför gräns':m.min===null&&m.max===null?'Ej bedömd':'Inom gräns';return `<tr><td>${esc(m.point)}</td><td>${esc(m.value)} ${esc(m.unit)}</td><td>${esc(m.min??'–')}</td><td>${esc(m.max??'–')}</td><td>${result}</td></tr>`}).join('');
 const doc=`<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(p.name)} · PassBit</title><style>body{font:14px/1.55 system-ui,Arial;max-width:850px;margin:45px auto;padding:0 22px;color:#172b33}h1{font-size:28px}h2{margin-top:32px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #b6c8c7;padding:9px;text-align:left}th{background:#eaf2f1}pre{white-space:pre-wrap;font:inherit}small{color:#567}button{padding:10px}@media print{button{display:none}}</style></head><body><small>PASSBIT PRO · PROJEKTRAPPORT · ${esc(new Date().toLocaleDateString('sv-SE'))}</small><h1>${esc(p.name)}</h1><table><tr><th>Kund</th><td>${esc(p.client)}</td></tr><tr><th>Maskin / serienummer</th><td>${esc(p.machine)}</td></tr><tr><th>Uppdrag</th><td>${esc(p.type)}</td></tr><tr><th>Datum</th><td>${esc(p.date)}</td></tr><tr><th>Tekniker</th><td>${esc(p.tech)}</td></tr></table><h2>Arbetsbeskrivning</h2><pre>${esc(p.notes)}</pre><h2>Mätprotokoll</h2><table><thead><tr><th>Mätpunkt</th><th>Värde</th><th>Min</th><th>Max</th><th>Bedömning</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Inga mätpunkter registrerade</td></tr>'}</tbody></table><p><small>Bedömningen gäller enbart de gränser som matats in. Ingen automatisk FAT/SAT-certifiering. Kontrollera mätmetod, kalibrering, acceptanskriterier och behörig signering.</small></p><p>Signatur: _______________________________ &nbsp; Datum: ______________</p><button onclick="window.print()">Skriv ut / Spara som PDF</button></body></html>`;
 download(filename(p)+'-rapport.html',doc,'text/html;charset=utf-8');
}
window.passbitProjectsRender=()=>{const allowed=window.passbitPreviewEdition==='ultra';$('pj-lock').hidden=allowed;$('pj-main').hidden=!allowed;if(allowed)draw()};
$('pj-try').addEventListener('click',()=>{if(typeof setPreviewEdition==='function')setPreviewEdition('ultra');window.passbitProjectsRender()});
$('pj-new').addEventListener('click',()=>{if(window.passbitPreviewEdition!=='ultra')return;active='';draw();status('Ange projektuppgifter och tryck Spara projekt.')});
$('pj-select').addEventListener('change',e=>{active=e.target.value;draw();status('')});
$('pj-form').addEventListener('submit',e=>{e.preventDefault();if(window.passbitPreviewEdition==='ultra')upsert()});
$('pj-delete').addEventListener('click',()=>{const p=selected();if(!p||!confirm('Radera projektet och alla mätvärden permanent från den här enheten?'))return;projects=projects.filter(x=>x.id!==p.id);active='';save();draw();status('Projektet raderades.')});
$('pj-add-measure').addEventListener('click',()=>{
 if(window.passbitPreviewEdition!=='ultra')return;
 const point=$('pj-mpoint').value.trim(),value=num($('pj-mvalue').value),min=num($('pj-mmin').value),max=num($('pj-mmax').value);
 if(!point||value===null||min!==null&&max!==null&&min>max){status('Ange mätpunkt och ett giltigt värde. Min får inte överstiga max.');return}
 let p=selected();if(!p){if(!$('pj-name').value.trim()){status('Skriv projektnamn och spara projektet först.');return}p=upsert()}
 p.measurements=p.measurements||[];p.measurements.push({point,value,min,max,unit:$('pj-munit').value.trim()});save();draw();$('pj-mpoint').value='';$('pj-mvalue').value='';status('Mätpunkten sparades.');
});
$('pj-report').addEventListener('click',()=>{const p=selected();if(!p){status('Välj och spara ett projekt först.');return}report(p)});
$('pj-export').addEventListener('click',()=>{const p=selected();if(!p){status('Välj ett projekt först.');return}download(filename(p)+'.json',JSON.stringify({format:'passbit-project-v1',project:p},null,2),'application/json')});
$('pj-import').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{
 if(f.size>1024*1024)throw Error('Filen är för stor (max 1 MB).');
 const v=JSON.parse(await f.text());if(v.format!=='passbit-project-v1'||!v.project||typeof v.project.name!=='string'||!Array.isArray(v.project.measurements))throw Error('Ogiltigt projektformat.');
 const q=v.project;
 const p={id:uid(),name:q.name.slice(0,100),client:String(q.client||'').slice(0,100),machine:String(q.machine||'').slice(0,120),type:String(q.type||'Service').slice(0,50),date:String(q.date||'').slice(0,20),tech:String(q.tech||'').slice(0,100),notes:String(q.notes||'').slice(0,12000),measurements:q.measurements.slice(0,2000).map(m=>({point:String(m.point||'').slice(0,100),unit:String(m.unit||'').slice(0,20),value:num(m.value),min:num(m.min),max:num(m.max)})).filter(m=>m.point&&m.value!==null)};
 projects.unshift(p);active=p.id;save();draw();status('Projekt importerat.');
 }catch(err){status('Import misslyckades: '+err.message)}e.target.value=''});
load();draw();
})();
