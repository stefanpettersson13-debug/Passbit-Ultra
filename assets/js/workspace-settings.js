

/* 6.3 workspace settings. Standalone, no dependencies on module-scoped variables. */
(()=>{
const $=id=>document.getElementById(id), dashboard=document.querySelector('.dashboard');
const ORDER_KEY='passbit-menu-order-v63';
const getJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
const save=(key,value)=>{try{localStorage.setItem(key,typeof value==='string'?value:JSON.stringify(value));return true}catch{return false}};
const original=[...dashboard.querySelectorAll('.dashbtn[data-go]')].map(b=>b.dataset.go);
const allButtons=()=>[...dashboard.querySelectorAll('.dashbtn[data-go]')];
const orderList=$('pb64orderlist');
function renderOrder(){
 const buttons=allButtons();
 orderList.replaceChildren();
 buttons.forEach((b,i)=>{
  const item=document.createElement('div');item.className='pb64-order-row';
  const name=document.createElement('span');name.textContent=b.querySelector('strong')?.textContent||b.dataset.go;
  const up=document.createElement('button');up.type='button';up.textContent='↑';up.setAttribute('aria-label','Flytta '+name.textContent+' upp');up.disabled=i===0;
  const down=document.createElement('button');down.type='button';down.textContent='↓';down.setAttribute('aria-label','Flytta '+name.textContent+' ned');down.disabled=i===buttons.length-1;
  up.addEventListener('click',()=>move(b,-1));down.addEventListener('click',()=>move(b,1));
  item.append(name,up,down);orderList.append(item);
 });
}
function move(b,delta){
 const buttons=allButtons(),i=buttons.indexOf(b),other=buttons[i+delta];if(!other)return;
 if(delta<0)dashboard.insertBefore(b,other);else dashboard.insertBefore(other,b);
 save(ORDER_KEY,allButtons().map(x=>x.dataset.go));renderOrder();
 $('pb63status').textContent='Menyordningen sparad.';
}
function applyOrder(){
 const saved=getJSON(ORDER_KEY,[]);if(!Array.isArray(saved))return;
 const map=new Map(allButtons().map(b=>[b.dataset.go,b]));
 saved.forEach(id=>{if(map.has(id)){dashboard.append(map.get(id));map.delete(id)}});
 map.forEach(b=>dashboard.append(b));renderOrder();
}
applyOrder();
$('pb63reorder').addEventListener('click',()=>{
 const opening=orderList.classList.contains('hidden');
 orderList.classList.toggle('hidden',!opening);
 $('pb63reorder').setAttribute('aria-expanded',String(opening));
 renderOrder();if(opening)orderList.scrollIntoView({block:'nearest',behavior:'smooth'});
});
$('pb63resetorder').addEventListener('click',()=>{
 const map=new Map(allButtons().map(b=>[b.dataset.go,b]));
 original.forEach(id=>dashboard.append(map.get(id)));
 save(ORDER_KEY,[]);renderOrder();$('pb63status').textContent='Menyordningen återställd.';
});
$('pb63done').addEventListener('click',()=>{orderList.classList.add('hidden');$('settingsPanel').classList.add('hidden')});
// Projects are a read-only index of the actual saved measurements and service jobs.
const projectList=$('pb63projectlist');
function safe(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderProjects(){const rows=getJSON('passbit_measurements_v54',[]),jobs=getJSON('passbit-pro-service-jobs-v1',[]);const counts=new Map();if(Array.isArray(rows))rows.forEach(r=>{const k=String(r.project||'Utan projektnamn');counts.set(k,(counts.get(k)||0)+1)});let html='<p class="fine">Projektöversikt från lokalt sparade mätningar och servicejobb. Ingen molnsynk.</p>';
if(!counts.size&&(!Array.isArray(jobs)||!jobs.length))html+='<p class="fine">Inga sparade projekt ännu.</p>';
for(const [name,count] of counts){html+='<div class="pb63-project-card"><strong>'+safe(name)+'</strong><small>'+count+' mätningar</small><div><button type="button" data-open-project="measure">Öppna mätprotokoll</button></div></div>'}
if(Array.isArray(jobs))jobs.forEach(j=>{html+='<div class="pb63-project-card"><strong>'+safe(j.customer||'Servicejobb')+'</strong><small>'+safe(j.machine||'')+' · '+safe(j.order||'')+'</small><div><button type="button" data-open-project="field">Öppna servicejobb</button></div></div>'});projectList.innerHTML=html}
$('pb63projects').onclick=()=>{const opening=projectList.classList.contains('hidden');projectList.classList.toggle('hidden',!opening);if(opening)renderProjects()};
projectList.addEventListener('click',e=>{const b=e.target.closest('[data-open-project]');if(!b)return;const target=document.querySelector('.dashboard .dashbtn[data-go="'+b.dataset.openProject+'"]');$('settingsPanel').classList.add('hidden');target?.click()});
$('pb63backup').onclick=()=>{const keys=['passbit-inventory','passbit_measurements_v54','passbit-pro-service-jobs-v1','passbit_language','passbit_theme','passbit_display_unit','passbit_input_unit',ORDER_KEY,'passbit-temperature-unit-v63','passbit-precision-v63','pb10-series','pb10-reports'];const data={format:'PassBitProBackup',version:1,created:new Date().toISOString(),data:{}};for(const k of keys){try{data.data[k]=localStorage.getItem(k)}catch{data.data[k]=null}}const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='PassBit_komplett_backup.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);$('pb63status').textContent='Säkerhetskopia skapad. Spara filen på en säker plats.'};
$('pb63precision').value=localStorage.getItem('passbit-precision-v63')||'auto';$('pb63precision').onchange=e=>save('passbit-precision-v63',e.target.value);
// Fahrenheit is a presentation layer: underlying inputs remain Celsius for legacy formulas.
const tempIDs=['thermalStart','thermalEnd','shHoleTemp','shShaftTemp','pb6tempT'];
const F=c=>c*9/5+32,C=f=>(f-32)*5/9;
const fields=tempIDs.map(id=>{const orig=$(id);if(!orig)return null;const alt=document.createElement('input');alt.type='text';alt.inputMode='decimal';alt.className='pb63-fahrenheit hidden';alt.setAttribute('aria-label','Temperatur i Fahrenheit');orig.insertAdjacentElement('afterend',alt);const label=orig.closest('label');const labelText=label?label.childNodes[0]:null;const base=labelText&&labelText.nodeType===3?labelText.textContent:null;alt.addEventListener('input',()=>{const val=Number(alt.value.replace(',','.'));if(alt.value.trim()!==''&&Number.isFinite(val)){orig.value=String(C(val));orig.dispatchEvent(new Event('input',{bubbles:true}));orig.dispatchEvent(new Event('change',{bubbles:true}))}});orig.addEventListener('input',()=>{if(document.activeElement!==alt){const c=Number(orig.value.replace(',','.'));if(Number.isFinite(c))alt.value=F(c).toFixed(2).replace('.',',')}});return {orig,alt,labelText,base}}).filter(Boolean);
function renderTemperature(){const isF=$('pb63tempunit').value==='F';for(const {orig,alt,labelText,base} of fields){orig.classList.toggle('hidden',isF);alt.classList.toggle('hidden',!isF);if(labelText&&base)labelText.textContent=isF?base.replace('°C','°F'):base;const c=Number(orig.value.replace(',','.'));if(Number.isFinite(c)&&document.activeElement!==alt)alt.value=F(c).toFixed(2).replace('.',',')}}
$('pb63tempunit').value=localStorage.getItem('passbit-temperature-unit-v63')==='F'?'F':'C';$('pb63tempunit').onchange=e=>{save('passbit-temperature-unit-v63',e.target.value);renderTemperature()};renderTemperature();
})();

