
/* Single blade navigation controller */
(()=>{'use strict';
const body=document.body,home=document.getElementById('homeButton'),categoryBack=document.getElementById('pb-category-back'),detail=document.getElementById('pb-category-detail'),gear=document.getElementById('settingsGear'),close=document.getElementById('settingsClose'),panel=document.getElementById('settingsPanel');
let internal=false,busy=false,touch=null;
const view=()=>body.classList.contains('pb-settings-view')?'settings':!body.classList.contains('home-view')?'tool':detail&&!detail.hidden?'category':'home';
function motion(){body.classList.remove('pb-blade-motion');void body.offsetWidth;body.classList.add('pb-blade-motion')}
function back(){if(busy)return;const v=view();if(v==='home')return;busy=true;
if(v==='settings'){body.classList.remove('pb-settings-view');panel?.classList.add('hidden')}
else if(v==='tool'){const key=window.passbitLastCategory;internal=true;home?.click();internal=false;if(key)window.passbitOpenCategory?.(key)}
else if(v==='category')categoryBack?.click();
motion();window.scrollTo(0,0);setTimeout(()=>busy=false,280)}
home?.addEventListener('click',e=>{if(internal)return;if(view()==='tool'){e.stopImmediatePropagation();e.preventDefault();back()}},true);
gear?.addEventListener('click',()=>{if(!body.classList.contains('pb-settings-view')){body.classList.add('pb-settings-view');panel?.classList.remove('hidden')}else{body.classList.remove('pb-settings-view');panel?.classList.add('hidden')}motion()});
close?.addEventListener('click',()=>{body.classList.remove('pb-settings-view');panel?.classList.add('hidden');motion()});
document.addEventListener('click',e=>{if(e.target.closest('[data-category],.pb-category-tool'))requestAnimationFrame(motion)});
document.addEventListener('touchstart',e=>{
 if(e.touches.length!==1||view()==='home')return;
 const t=e.touches[0];
 if(t.clientX>85||e.target.closest('input,textarea,select,[contenteditable="true"],[role="slider"]'))return;
 touch={x:t.clientX,y:t.clientY,active:false};
},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{
 if(!touch||e.touches.length!==1)return;
 const t=e.touches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;
 if(dx>18&&Math.abs(dx)>Math.abs(dy)*1.4)touch.active=true;
 if(touch.active&&e.cancelable)e.preventDefault();
},{passive:false,capture:true});
document.addEventListener('touchend',e=>{
 if(!touch)return;
 const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y,valid=touch.active&&dx>75&&Math.abs(dy)<dx*.65;
 touch=null;
 if(valid){e.stopImmediatePropagation();back()}
},{passive:true,capture:true});
document.addEventListener('touchcancel',()=>touch=null,{passive:true,capture:true});
})();
