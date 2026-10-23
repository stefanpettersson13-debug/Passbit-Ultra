/* Optional entrance animations. No data mutation or navigation override. */
(()=>{'use strict';
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce)return;
 const cards=[...document.querySelectorAll('.dashboard .dashbtn')];
 cards.forEach((card,i)=>card.style.setProperty('--lux-order',String(i)));
 // Mark after style variables are in place; do not animate each navigation item repeatedly.
 document.body.classList.add('lux-ready');
 const sections=[...document.querySelectorAll('section[id]')];
 // Safari fix: recursive class observer removed; CSS transitions remain.
})();
