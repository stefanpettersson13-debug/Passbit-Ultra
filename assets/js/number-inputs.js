
(function(){
  function selectNumber(e){
    const t=e.target;
    if(!t.matches('input[inputmode="decimal"],input[inputmode="numeric"],input[type="number"]'))return;
    if(t.type==='number')return; // selection APIs are unsupported for number fields
    requestAnimationFrame(()=>{if(document.activeElement===t)try{t.select()}catch(_){}});
  }
  document.addEventListener('focusin',selectNumber);
  // Result displays must not show a computed value before meaningful input.
  // Only clear on initial load, and only where every numeric input in that calculator is zero/empty.
  function clearInitialResults(){
    document.querySelectorAll('.pb6-card').forEach(card=>{
      const inputs=[...card.querySelectorAll('input[inputmode="decimal"],input[inputmode="numeric"]')];
      if(!inputs.length||!inputs.every(i=>i.value.trim()===''||Number(i.value)===0))return;
      card.querySelectorAll('.pb6-result').forEach(out=>{out.textContent='—';});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clearInitialResults,{once:true});
  else clearInitialResults();
})();
