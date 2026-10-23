(()=>{
'use strict';
const groups={
 workshop:{title:'Verkstadsteknik',tier:'FREE',tools:['holes','screws','sin','convert','cutting','cncpro','workshop10','fittings','drawings','electrical']},
 grinding:{title:'Slipteknik',tier:'PRO',tools:['grinding','grindpro','shrink','thermal','diagnostic10']},
 metrology:{title:'Mätteknik',tier:'PRO',tools:['fits','blocks','runout','chain','measure','metrology','alignment','analysis10','reports10','assistant']},
 advanced:{title:'Avancerat',tier:'ULTRA',tools:['abbrobot','sinumerik','pneumatics','cylinders']},
 projects:{title:'Projekt',tier:'ULTRA',tools:[]}
};
const root=document.getElementById('pb-category-root'),grid=document.getElementById('pb-category-grid'),detail=document.getElementById('pb-category-detail'),tools=document.getElementById('pb-category-tools'),homeTitle=document.getElementById('homeTitle');
if(!root)return;
const all=[...document.querySelectorAll('.dashboard .dashbtn[data-go]')];
const used=new Set(Object.values(groups).flatMap(g=>g.tools));
// Do not silently lose tools when the original application grows.
for(const b of all)if(!used.has(b.dataset.go)){const id=b.dataset.go;if(id==='field')groups.projects.tools.push(id);else groups.workshop.tools.push(id)}
let current=null;
function reset(){current=null;grid.hidden=false;detail.hidden=true;document.getElementById('pb-project-workspace').hidden=true;tools.hidden=false;homeTitle.textContent='Välj område'}
function open(key){
 const group=groups[key];if(!group)return;
 current=key;window.passbitLastCategory=key;tools.hidden=key==='projects';
 document.getElementById('pb-project-workspace').hidden=key!=='projects';
 grid.hidden=true;detail.hidden=false;homeTitle.textContent='';
 document.getElementById('pb-category-title').textContent=group.title;
 document.getElementById('pb-category-tier').textContent=group.tier;
 tools.replaceChildren();
 detail.querySelector('.pb-blade-tabs')?.remove();
 const seen=new Set();
 for(const id of group.tools){
  const original=all.find(x=>x.dataset.go===id);if(!original)continue;
  const name=(original.querySelector('strong')?.textContent||id).trim();
  const normalized=name.toLocaleLowerCase('sv-SE').replace(/\\s+/g,' ');
  if(seen.has(normalized))continue;seen.add(normalized);
  const b=document.createElement('button');b.type='button';b.className='pb-category-tool';
  const icon=document.createElement('span');icon.className='pb-tool-icon';
  const glyph=original.querySelector('.glyph');
  icon.textContent=glyph?.textContent.trim()||'◇';
  const label=document.createElement('span');label.className='pb-category-tool-name';label.textContent=name;
  const arrow=document.createElement('span');arrow.className='pb-category-tool-arrow';arrow.textContent='›';
  b.append(icon,label,arrow);
  b.dataset.toolId=id;b.addEventListener('click',()=>original.click());tools.append(b);
 }
 if(key!=='projects'){
 const defs={
 workshop:[['Alla','all',[]],['Beräkningar','calc',['holes','screws','sin','convert','cutting']],['Maskin & ritning','machine',['cncpro','workshop10','fittings','drawings','electrical']]],
 grinding:[['Alla','all',[]],['Slipprocess','process',['grinding','grindpro','shrink']],['Kontroll','quality',['diagnostic10','thermal']]],
 metrology:[['Alla','all',[]],['Mått & passning','dim',['fits','blocks','chain','measure']],['Analys','analysis',['runout','metrology','alignment','analysis10','reports10','assistant']]],
 advanced:[['Alla','all',[]],['Styrsystem','control',['abbrobot','sinumerik']],['Pneumatik','air',['pneumatics','cylinders']]]};
 const options=defs[key]||[['Alla','all',[]]],bar=document.createElement('div');bar.className='pb-blade-tabs';bar.setAttribute('role','tablist');
 function choose(tab){bar.querySelectorAll('button').forEach(b=>{const active=b.dataset.filter===tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))});tools.querySelectorAll('.pb-category-tool').forEach(b=>b.hidden=tab!=='all'&&!options.find(x=>x[1]===tab)?.[2].includes(b.dataset.toolId))}
 for(const [name,id] of options){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.filter=id;b.setAttribute('role','tab');b.addEventListener('click',()=>choose(id));bar.append(b)}
 tools.before(bar);choose('all');
 }
 if(key!=='projects'){
  const summary=document.createElement('p');summary.className='pb-category-summary';
  summary.textContent=seen.size+' verktyg · Välj ett verktyg för att öppna det';
  tools.before(summary);
  detail.querySelectorAll('.pb-category-summary').forEach((el,i)=>{if(i>0)el.remove()});
 }else{
  detail.querySelectorAll('.pb-category-summary').forEach(el=>el.remove());
  window.passbitProjectsRender?.();
 }
 window.scrollTo({top:0,behavior:'instant'});
}
root.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.category)));
window.passbitOpenCategory=open;
document.getElementById('pb-category-back').addEventListener('click',()=>{reset();window.scrollTo({top:0,behavior:'instant'})});
// Home button is managed by existing application; restore category overview on next home visit.
// Home reset is handled by the existing Home button.
// Also reset when the existing Home control is explicitly pressed.
document.getElementById('homeButton')?.addEventListener('click',()=>{if(!document.body.classList.contains('home-view'))return;reset()});
})();