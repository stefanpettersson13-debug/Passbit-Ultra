/* PassBit 5.1 – navigation taxonomy. One canonical home for every tool. */
(()=>{'use strict';
const taxonomy={
workshop:{title:'Verkstadsteknik',tier:'FREE',groups:[
['Snabbberäkningar',['holes','screws','sin','convert','cutting']],
['Maskiner & CNC',['cncpro','workshop10','drawings']],
['El & drivteknik',['electrical','elec3','mechgear','belt']],
['Mekanik & montage',['mechbearing','mechbolt']]]},
grinding:{title:'Slipteknik',tier:'PRO',groups:[
['Slipprocess',['grinding','grindpro','grindwheel']],
['Termik & krympning',['shrink','thermal']],
['Felsökning & kontroll',['diagnostic10']]]},
metrology:{title:'Mätteknik',tier:'PRO',groups:[
['Passningar & mått',['fits','blocks','chain','measure']],
['Geometri & uppriktning',['runout','metrology','alignment']],
['Analys & rapporter',['analysis10','reports10','assistant','metrotemp','metrounc']]]},
advanced:{title:'Avancerat',tier:'ULTRA',groups:[
['Hydraulik & kopplingar',['hydraulics','fittings','hydcyl','hydpump','hydpipe','hydacc']],
['Pneumatik & sensorer',['pneumatics','cylinders','pneucyl']],
['Diagnostik',['servicevib']],
['Styrsystem & robotar',['abbrobot','sinumerik']]]},
projects:{title:'Projekt',tier:'ULTRA',groups:[]}
};
const root=document.getElementById('pb-category-root');if(!root)return;
const grid=document.getElementById('pb-category-grid'),detail=document.getElementById('pb-category-detail'),tools=document.getElementById('pb-category-tools'),homeTitle=document.getElementById('homeTitle'),project=document.getElementById('pb-project-workspace');
const all=[...document.querySelectorAll('.dashboard .dashbtn[data-go]')];
const originals=new Map(all.map(b=>[b.dataset.go,b]));
const assigned=new Set(Object.values(taxonomy).flatMap(cat=>cat.groups.flatMap(g=>g[1])));
const extras=all.filter(b=>!assigned.has(b.dataset.go)&&b.dataset.go!=='field').map(b=>b.dataset.go);
if(extras.length)taxonomy.workshop.groups.push(['Övriga befintliga verktyg',extras]);
let current=null,filter='all';
function scrollTop(){window.scrollTo({top:0,behavior:'instant'})}
function reset(){current=null;filter='all';grid.hidden=false;detail.hidden=true;project.hidden=true;tools.replaceChildren();homeTitle.textContent='Välj område'}
function makeTool(id){
const original=originals.get(id);if(!original)return null;
const name=(original.querySelector('strong')?.textContent||id).trim();
const b=document.createElement('button');b.type='button';b.className='pb-category-tool';b.dataset.toolId=id;
const ico=document.createElement('span');ico.className='pb-tool-icon';ico.textContent=original.querySelector('.glyph')?.textContent.trim()||'◇';
const label=document.createElement('span');label.className='pb-category-tool-name';label.textContent=name;
const arrow=document.createElement('span');arrow.className='pb-category-tool-arrow';arrow.textContent='›';
b.append(ico,label,arrow);b.addEventListener('click',()=>original.click());return b
}
function open(key,chosen='all'){
const cat=taxonomy[key];if(!cat)return;
current=key;filter=chosen;window.passbitLastCategory=key;
grid.hidden=true;detail.hidden=false;homeTitle.textContent='';
document.getElementById('pb-category-title').textContent=cat.title;
document.getElementById('pb-category-tier').textContent=cat.tier;
project.hidden=key!=='projects';tools.hidden=key==='projects';
detail.querySelectorAll('.pb-blade-tabs,.pb-category-summary,.pb51-group-heading,.pb51-category-intro').forEach(x=>x.remove());
tools.replaceChildren();
if(key==='projects'){window.passbitProjectsRender?.();scrollTop();return}
const total=cat.groups.reduce((n,g)=>n+g[1].filter(id=>originals.has(id)).length,0);
const summary=document.createElement('p');summary.className='pb-category-summary';summary.textContent=total+' verktyg · Sorterade efter arbetsområde';
const bar=document.createElement('div');bar.className='pb-blade-tabs pb51-submenu';bar.setAttribute('role','group');bar.setAttribute('aria-label','Underkategorier');
const tabs=[['Alla','all'],...cat.groups.map((g,i)=>[g[0],String(i)])];
for(const [name,id] of tabs){const b=document.createElement('button');b.type='button';b.dataset.filter=id;b.textContent=name;b.classList.toggle('active',id===chosen);b.setAttribute('aria-pressed',String(id===chosen));b.addEventListener('click',()=>open(key,id));bar.append(b)}
tools.before(summary,bar);
const selected=chosen==='all'?cat.groups:cat.groups.filter((_,i)=>String(i)===chosen);
for(const [name,ids] of selected){
 const items=ids.map(makeTool).filter(Boolean);if(!items.length)continue;
 const heading=document.createElement('h3');heading.className='pb51-group-heading';heading.textContent=name;tools.append(heading);
 const group=document.createElement('div');group.className='pb51-tool-group';items.forEach(item=>group.append(item));tools.append(group);
}
scrollTop();
}
root.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.category)));
document.getElementById('pb-category-back')?.addEventListener('click',()=>{reset();scrollTop()});
document.getElementById('homeButton')?.addEventListener('click',()=>{if(document.body.classList.contains('home-view'))reset()});
window.passbitOpenCategory=open;
window.passbitCategoryForTool=id=>Object.entries(taxonomy).find(([,v])=>v.groups.some(([,ids])=>ids.includes(id)))?.[0]||null;
window.passbitToolTaxonomy=taxonomy;
})();