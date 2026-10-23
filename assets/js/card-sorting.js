
/* Long-press sorting for the visible five-category home screen. */
(()=>{
const grid=document.getElementById('pb-category-grid');if(!grid)return;
const KEY='passbit-category-order-v1';
const cards=()=>[...grid.querySelectorAll('.pb-category-card[data-category]')];
try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(saved)){const byId=new Map(cards().map(el=>[el.dataset.category,el]));saved.forEach(id=>{if(byId.has(id)){grid.append(byId.get(id));byId.delete(id)}});byId.forEach(el=>grid.append(el))}}catch{}
let pending=null,active=null,ghost=null,timer=null,suppress=false;
const hint=document.createElement('p');hint.className='pb67-sort-hint';hint.textContent='Håll och dra för att ändra ordning';grid.after(hint);
function cancelTimer(){clearTimeout(timer);timer=null}
function begin(){if(!pending)return;const {el,x,y}=pending,rect=el.getBoundingClientRect();active={el,dx:x-rect.left,dy:y-rect.top};ghost=el.cloneNode(true);ghost.classList.add('pb67-drag-ghost');Object.assign(ghost.style,{width:rect.width+'px',height:rect.height+'px',pointerEvents:'none'});document.body.append(ghost);el.classList.add('pb67-dragging');document.body.classList.add('pb67-sorting');move(x,y);hint.textContent='Dra kortet till önskad plats och släpp'}
function move(x,y){if(!active)return;ghost.style.left=x-active.dx+'px';ghost.style.top=y-active.dy+'px';const hit=document.elementFromPoint(x,y)?.closest('.pb-category-card[data-category]');if(hit&&hit!==active.el&&grid.contains(hit)){const items=cards(),from=items.indexOf(active.el),to=items.indexOf(hit);grid.insertBefore(active.el,from<to?hit.nextSibling:hit)}}
function finish(){cancelTimer();pending=null;if(!active)return;active.el.classList.remove('pb67-dragging');ghost?.remove();ghost=null;active=null;document.body.classList.remove('pb67-sorting');try{localStorage.setItem(KEY,JSON.stringify(cards().map(el=>el.dataset.category)))}catch{}hint.textContent='Håll fingret på ett kort för att flytta det';suppress=true;setTimeout(()=>suppress=false,600)}
grid.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false}},true);
grid.addEventListener('contextmenu',e=>{if(pending||active)e.preventDefault()},true);
grid.addEventListener('touchstart',e=>{if(e.touches.length!==1||active)return;const el=e.target.closest('.pb-category-card[data-category]');if(!el)return;const t=e.touches[0];pending={el,x:t.clientX,y:t.clientY};cancelTimer();timer=setTimeout(begin,450)},{passive:true});
grid.addEventListener('touchmove',e=>{const t=e.touches[0];if(!t)return;if(active){e.preventDefault();move(t.clientX,t.clientY)}else if(pending&&Math.hypot(t.clientX-pending.x,t.clientY-pending.y)>10){cancelTimer();pending=null}},{passive:false});
grid.addEventListener('touchend',finish,{passive:true});grid.addEventListener('touchcancel',finish,{passive:true});
grid.addEventListener('mousedown',e=>{if(e.button!==0||active||('ontouchstart' in window))return;const el=e.target.closest('.pb-category-card[data-category]');if(!el)return;pending={el,x:e.clientX,y:e.clientY};cancelTimer();timer=setTimeout(begin,450)});
window.addEventListener('mousemove',e=>{if(active)move(e.clientX,e.clientY);else if(pending&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)>10){cancelTimer();pending=null}});
window.addEventListener('mouseup',finish);window.addEventListener('blur',finish);
})();
