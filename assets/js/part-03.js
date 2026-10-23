
// 5.6: unit presentation only. Core computations and saved measurements stay in millimetres.
(function(){
 const select=document.getElementById('displayUnit');
 if(!select)return;
 let unit='mm';try{unit=localStorage.getItem('passbit_display_unit')==='in'?'in':'mm'}catch(e){}
 select.value=unit;
 const targets='.result .big,.metric strong';
 const numberPattern=String.raw`[+−-]?(?:\d{1,3}(?:[ \u00a0\u202f]\d{3})+|\d+)(?:[.,]\d+)?`;
 // Parse each complete mm-marked measurement; a range such as 20,000–20,021 mm is converted on both sides.
 const mmRegex=new RegExp('('+numberPattern+')'+String.raw`(\s*[–-]\s*(`+numberPattern+String.raw`))?\s*mm(?![\w/])`,'g');
 function convert(original){
  return original.replace(mmRegex,(full,left,range,right)=>{
   const cv=v=>{const num=Number(v.replace(/[ \u00a0\u202f]/g,'').replace(',','.').replace('−','-'));
    if(!Number.isFinite(num))return v;
    const decimals=(v.split(/[.,]/)[1]||'').length;
    const digits=Math.min(7,Math.max(5,decimals+2));
    return (num/25.4).toLocaleString(document.documentElement.lang==='en'?'en-US':'sv-SE',{minimumFractionDigits:digits,maximumFractionDigits:digits});
   };
   return cv(left)+(range?' – '+cv(right):'')+' in';
  });
 }
 function refreshUnits(){
  document.querySelectorAll(targets).forEach(el=>{
   const visible=el.textContent;
   if(el.dataset.unitRendered!==visible){el.dataset.unitSource=visible;el.dataset.unitRendered=visible}
   const source=el.dataset.unitSource||'';
   const next=unit==='in'?convert(source):source;
   if(visible!==next)el.textContent=next;
   el.dataset.unitRendered=next;
  });
 }
 select.addEventListener('change',()=>{unit=select.value;try{localStorage.setItem('passbit_display_unit',unit)}catch(e){}refreshUnits()});
 // Performance: units refresh when the user changes display units.
 refreshUnits();
})();
