
/* Pointer-responsive light, deliberately limited to desktop hover devices. */
(()=>{'use strict';if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
const cards=document.getElementById('pb-category-grid');if(!cards)return;
cards.addEventListener('pointermove',e=>{const card=e.target.closest('.pb-category-card');if(!card)return;const rect=card.getBoundingClientRect();card.style.setProperty('--ti-x',((e.clientX-rect.left)/rect.width*100).toFixed(1)+'%');card.style.setProperty('--ti-y',((e.clientY-rect.top)/rect.height*100).toFixed(1)+'%')},{passive:true});
})();
