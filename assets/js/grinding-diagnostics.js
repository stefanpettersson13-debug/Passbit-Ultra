
/* Slip diagnostics: deterministic, non-prescriptive troubleshooting and illustrative waveforms */
(()=>{'use strict';const root=document.getElementById('pb-dx-lab');if(!root)return;
const data={
chatter:{causes:['Obalans eller skivans tillstånd','Resonans i spindel, uppspänning eller maskinkonstruktion','Instabil kontakt eller otillräcklig styvhet'],checks:['Kontrollera skivans skick, märkning och balansering enligt maskinrutinen.','Kontrollera uppspänning, dubbar, lagerglapp och eventuell resonans.','Jämför vibrationsspektrum mot skiv- och arbetsstyckesvarvtal med riktig mätutrustning.']},
burn:{causes:['För hög termisk belastning i slipzonen','Otillräcklig eller felriktad kylvätsketillförsel','Slö eller igensatt skiva'],checks:['Inspektera ytan och kontrollera risk för brännmärken med lämplig verifieringsmetod.','Kontrollera kylvätskans flöde, riktning, filtrering och koncentration.','Granska skivans tillstånd och dokumentera verkliga processparametrar.']},
taper:{causes:['Felaktig uppriktning mellan spindel, dubb och arbetsstycke','Termisk drift under slipcykeln','Elastisk deformation eller ojämn uppspänning'],checks:['Mät diameter på flera positioner längs detaljen.','Kontrollera uppriktning, geometri och stöd med lämplig mätmetod.','Följ temperatur och dimension över flera cykler.']},
finish:{causes:['Skivans kornstruktur eller skärptillstånd','Vibrationer eller främmande partiklar i kylvätskan','Felaktig kontakt- eller matningssituation'],checks:['Mät Ra/Rz med ytprofilometer och dokumentera mätsträcka.','Kontrollera skiva, skärpverktyg och kylvätskefiltrering.','Undersök om reporna är periodiska, axiella eller slumpmässiga.']},
round:{causes:['Uppspännings- eller centreringsfel','Flerlobig formpåverkan från stöd eller centerless-geometri','Vibrationer synkroniserade med rotation'],checks:['Mät rundhetsprofil, inte bara tvåpunktsdiameter.','Kontrollera centrering, stödpunkter och uppspänning.','Jämför antalet lober med rotationsordningar och verkliga mätningar.']},
load:{causes:['Material som fastnar i skivans porer','Otillräcklig skärpfunktion eller olämpligt skivtillstånd','Kylvätskeproblem och ökad friktion'],checks:['Inspektera skivan enligt säkra rutiner med maskinen stoppad.','Kontrollera skärpverktygets skick och dokumenterad skärpsekvens.','Granska kylvätska, spåntransport och materialkombination.']}
};
const q=id=>root.querySelector('#'+id),sym=q('pb-dx-symptom'),rpm=q('pb-dx-rpm'),lobes=q('pb-dx-lobes'),method=q('pb-dx-method'),wave=q('pb-dx-wave');
function render(){const type=sym.value,d=data[type],r=Number(rpm.value),n=Number(lobes.value);q('pb-dx-causes').replaceChildren(...d.causes.map(v=>{const el=document.createElement('div');el.className='pb-dx-cause';el.textContent=v;return el}));q('pb-dx-checks').replaceChildren(...d.checks.map(v=>{const el=document.createElement('li');el.textContent=v;return el}));
const valid=Number.isFinite(r)&&r>0&&Number.isInteger(n)&&n>=1&&n<=50;
q('pb-dx-frequency').textContent=valid?'Skivrotation: '+(r/60).toFixed(2)+' Hz · '+n+'× ordning: '+(r*n/60).toFixed(2)+' Hz':'Ange positivt varvtal och 1–50 märken/varv.';
let path='';for(let i=0;i<=180;i++){const x=35+i*430/180,t=i/180,periods=type==='round'?Math.min(12,Math.max(2,n||3)):type==='chatter'?12:type==='finish'?24:type==='load'?7:4;let y=116;
if(type==='chatter')y+=20*Math.sin(t*Math.PI*2*periods)+5*Math.sin(t*Math.PI*2*31);
else if(type==='burn')y+=10*Math.sin(t*Math.PI*2*periods)+18*Math.exp(-Math.pow((t-.65)/.14,2));
else if(type==='taper')y+=-29+58*t+3*Math.sin(t*18);
else if(type==='finish')y+=5*Math.sin(t*Math.PI*2*periods)+9*Math.pow(Math.sin(t*Math.PI*2*7),12);
else if(type==='round')y+=23*Math.sin(t*Math.PI*2*periods);
else y+=7*Math.sin(t*Math.PI*2*periods)+14*Math.pow(Math.sin(t*Math.PI*2*17),8);
path+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '}
wave.setAttribute('d',path);wave.setAttribute('stroke',type==='burn'?'#f3ad76':type==='taper'?'#f3d18c':'#a7e4fa');root.dataset.method=method.value}
root.addEventListener('input',render);root.addEventListener('change',render);render();
})();
