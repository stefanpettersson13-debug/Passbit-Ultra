
/* Grinding process calculations; separate from legacy tools. */
(()=>{
const host=document.getElementById('pb-grinding-lab'),out=document.getElementById('pbg-results');if(!host||!out)return;
const val=id=>{const raw=document.getElementById(id).value.trim().replace(',','.');if(!raw)return NaN;const n=Number(raw);return Number.isFinite(n)?n:NaN};
const fmt=(n,d=2)=>Number.isFinite(n)?n.toLocaleString('sv-SE',{maximumFractionDigits:d}):'—';
const metric=(name,value)=>{const e=document.createElement('div');e.className='pb-grind-metric';const a=document.createElement('small');a.textContent=name;const b=document.createElement('strong');b.textContent=value;e.append(a,b);out.append(e)};
function calculate(){
 out.replaceChildren();
 const mode=document.getElementById('pbg-mode').value,D=val('pbg-wheel'),n=val('pbg-wrpm'),max=val('pbg-max'),d=val('pbg-work'),nw=val('pbg-workrpm'),L=val('pbg-length'),delta=val('pbg-delta'),f=val('pbg-feed'),bw=val('pbg-dresswidth'),fd=val('pbg-dressfeed'),ad=val('pbg-dressdepth'),passes=val('pbg-passes');
 const positive=[D,n,d,nw,L,delta,f,bw,fd,ad,passes].every(x=>Number.isFinite(x)&&x>0);
 if(!positive){const p=document.createElement('p');p.className='pb-grind-warning';p.textContent='Ange positiva tal i alla processfält för att beräkna.';out.append(p);return}
 const vs=Math.PI*D*n/60000,vw=Math.PI*d*nw/60000,finalD=mode==='od'?d-delta:d+delta;
 const vol=Math.PI*L*Math.abs(finalD*finalD-d*d)/4;
 const radial=delta/2,minutes=radial/f,rate=vol/minutes,qprime=rate/L;
 const ratio=vs/vw;
 const overlap=bw/fd,dressTotal=ad*passes,dressTraverse=fd*n;
 metric('Skivhastighet vs',fmt(vs,2)+' m/s');
 metric('Arbetsstyckets periferihastighet vw',fmt(vw,3)+' m/s');
 metric('Hastighetskvot |vs/vw|',fmt(ratio,2));
 metric(mode==='od'?'Slutdiameter OD':'Slutdiameter ID',fmt(finalD,3)+' mm');
 metric('Teoretisk avverkad volym',fmt(vol,1)+' mm³');
 metric('Teoretisk inmatningstid',fmt(minutes,2)+' min');
 metric('Medelavverkning Qw',fmt(rate,1)+' mm³/min');
 metric('Specifik avverkning Q′w',fmt(qprime,2)+' mm³/(mm·min)');
 metric('Skärp · överlappningskvot Ud',fmt(overlap,2));
 metric('Skärp · axiell hastighet',fmt(dressTraverse,1)+' mm/min');
 metric('Skärp · totalt radiellt djup',fmt(dressTotal,3)+' mm');
 if((Number.isFinite(max)&&max>0&&vs>max)||mode==='od'&&finalD<=0||mode==='id'&&D>=d){
  const p=document.createElement('p');p.className='pb-grind-warning';
  p.textContent=[Number.isFinite(max)&&max>0&&vs>max?'VARNING: Beräknad skivhastighet överstiger angiven märkgräns. Kör inte med dessa värden.':'',mode==='od'&&finalD<=0?'Ogiltig slutdiameter för OD.':'',mode==='id'&&D>=d?'ID: Skivdiametern är lika stor eller större än hålet; kontrollera åtkomst och frigång.':''].filter(Boolean).join(' ');
  out.prepend(p)
 }
 if(!Number.isFinite(max)||max<=0){const p=document.createElement('p');p.className='pb-grind-warning';p.textContent='Skivans märkta maxhastighet saknas. Kontrollera den före drift; appen kan inte verifiera säker hastighet.';out.prepend(p)}
}
host.addEventListener('input',calculate);host.addEventListener('change',calculate);calculate();
})();
