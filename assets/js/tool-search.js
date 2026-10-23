(()=>{'use strict';
const host=document.getElementById('pb5-command');if(!host)return;
const input=document.getElementById('pb5-command-input'),results=document.getElementById('pb5-command-results'),recent=document.getElementById('pb5-recent');
const buttons=[...document.querySelectorAll('.dashboard .dashbtn[data-go]')];
const list=buttons.map(b=>({id:b.dataset.go,label:(b.querySelector('strong')?.textContent||b.dataset.go).trim(),button:b}));
const key='passbit5.recent';
function read(){try{const a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string').slice(0,6):[]}catch(e){return []}}
function save(id){try{const next=[id,...read().filter(x=>x!==id)].slice(0,6);localStorage.setItem(key,JSON.stringify(next));showRecent()}catch(e){}}
function normalize(s){return s.toLocaleLowerCase('sv-SE').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
function create(item){const b=document.createElement('button');b.type='button';b.className='pb5-command-hit';const name=document.createElement('strong');name.textContent=item.label;const arrow=document.createElement('span');arrow.textContent='↗';b.append(name,arrow);b.addEventListener('click',()=>{save(item.id);input.value='';results.hidden=true;item.button.click()});return b}
function search(){const q=normalize(input.value);results.replaceChildren();if(!q){results.hidden=true;return}const tokens=q.split(/\s+/).filter(Boolean);const matches=list.filter(x=>tokens.every(t=>normalize(x.label+' '+x.id).includes(t))).slice(0,12);if(!matches.length){const p=document.createElement('p');p.className='fine';p.textContent='Inga verktyg hittades.';results.append(p)}else matches.forEach(x=>results.append(create(x)));results.hidden=false}
function showRecent(){recent.replaceChildren();const items=read().map(id=>list.find(x=>x.id===id)).filter(Boolean);recent.hidden=!items.length;items.forEach(x=>recent.append(create(x)))}
input.addEventListener('input',search);input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';search();input.blur()}if(e.key==='Enter'){const first=results.querySelector('button');if(first){e.preventDefault();first.click()}}});
buttons.forEach(b=>b.addEventListener('click',()=>save(b.dataset.go)));
showRecent();
})();