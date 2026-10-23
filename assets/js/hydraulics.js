/* Integrate hydraulics with the existing fixed-list legacy navigation. */
if(typeof toolNames!=='undefined')toolNames.hydraulics='Hydraulik · Parker';
if(typeof setTab==='function'){
 const originalSetTab=setTab;
 setTab=function(id){
  originalSetTab(id);
  const section=document.getElementById('hydraulics');
  if(section)section.classList.toggle('hidden',id!=='hydraulics'||!window.passbitCanUse(id));
 };
}
if(typeof showHome==='function'){
 const originalShowHome=showHome;
 showHome=function(){
  originalShowHome();
  document.getElementById('hydraulics')?.classList.add('hidden');
 };
}
const originalTier=window.passbitToolTier;
window.passbitToolTier=function(id){return id==='hydraulics'?'ultra':originalTier(id)};
(()=>{'use strict';
const root=document.getElementById('hydraulics');if(!root)return;
const $=id=>document.getElementById(id);
const fmt=(n,d=1)=>Number.isFinite(n)?n.toLocaleString('sv-SE',{maximumFractionDigits:d,minimumFractionDigits:d}):'–';
const num=id=>{const raw=String($(id)?.value??'').replace(',','.').trim();return raw===''?NaN:Number(raw)};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const families=[
['EO 24°','Rörkoppling','Parker Ermeto Original (EO) 24°','Metriska stålrör, mutter och skärring; rak, vinkel, T, reducering och inskruvningskoppling.','Kontrollera rör-OD, serie L/S, material, tätningsvariant och artikelnummer.'],
['EO-2','Rörkoppling','EO-2 funktionsmutter','Parker EO-2 är en separat tätnings-/montagelösning för 24° rörkopplingar.','Blanda inte komponenter utan Parker-godkänd kompatibilitet.'],
['Triple-Lok 37°','Rörkoppling','JIC 37° flare','Konisk metallisk tätning mot flänsad anslutning, vanlig i hydrauliska slang- och rörsystem.','37° JIC är inte samma tätgeometri som EO 24°.'],
['O-Lok ORFS','Rörkoppling','O-ring face seal','Plan tätyta med O-ring för rör-/slanganslutning.','Kontrollera O-ring, gänga och anliggningsyta.'],
['BSPP / G','Gänga','Parallell Whitworth-rörgänga','G-gänga används ofta som anslutningsgänga med separat tätning.','Gängan tätar normalt inte ensam: kontrollera planpackning, ED-tätning eller annan föreskriven lösning.'],
['NPT / NPTF','Gänga','Konisk rörgänga','Konisk amerikansk rörgänga i vissa hydraulanslutningar.','Inte utbytbar mot BSPP; tätning och åtdragning beror på utförande.'],
['SAE ORB','Gänga','O-ring boss','Rak SAE-gänga med O-ring i portanslutningen.','Kräver rätt portgeometri och O-ring.'],
['ISO 6162 / SAE-fläns','Fläns','4-bultsfläns','Flänsanslutningar för större dimensioner och flöden; vanligt med olika tryckklasser.','Kontrollera exakt flänsserie, dimension och tryckklass.'],
['Hydraulslang','Slang','Parker hydraulslang','Flexibel ledning för rörliga delar och vibrationsupptagning.','Välj efter tryck, impuls, böjradie, temperatur, medium och tillhörande presskoppling.'],
['Slangkoppling','Slang','Press- och slangändkoppling','Parker har slangändar med olika tätgeometrier och gängor.','Slang och presshylsa måste vara godkända som komplett system.'],
['Rörklammer','Rör','Rörinfästning','Fixerar rör och minskar rörelse och vibration.','Avstånd och klammermaterial dimensioneras efter installation.'],
['Sömlöst precisionsrör','Rör','Hydraulrör','Rör med definierad ytterdiameter och väggtjocklek för högtrycksinstallationer.','Verifiera materialcertifikat, toleranser, tryckklass och böjning.'],
['Reduceringskoppling','Rörkoppling','Reducer / övergång','Förbinder olika rördimensioner eller anslutningsstorlekar.','Kontrollera båda sidorna separat: dimension, serie, gänga och tätning.'],
['T-koppling','Rörkoppling','T-förgrening','Fördelar flödet mellan tre anslutningar.','Olika portstorlekar kan kräva T-reducering eller flera adaptrar.'],
['Banjo / svivel','Rörkoppling','Banjo- och vridbar koppling','Används där riktning eller montageutrymme kräver särskild anslutning.','Vridbar vid montage betyder inte alltid avsedd för kontinuerlig rotation.'],
['Tryckbegränsningsventil','Ventil','Relief valve','Begränsar tryck genom att avleda flöde när inställt tryck nås.','Får inte ersättas av enbart tryckmätare; inställning och avledning måste dimensioneras.'],
['Riktningsventil','Ventil','4/3 eller 4/2','Styr oljans flödesväg till cylinder eller motor.','Ventilens mittläge och portbeteckningar avgör funktionen.'],
['Stryp-/flödesventil','Ventil','Flow control','Styr flödet och därmed rörelsehastigheten.','Tryckkompensering och lastens påverkan måste beaktas.'],
['Backventil','Ventil','Check valve','Tillåter normalt flöde i en riktning och spärrar den andra.','Pil och öppningstryck ska kontrolleras.'],
['Filter','System','Hydraulfilter','Tar bort partiklar och skyddar komponenter.','Filtergrad, β-värde, differenstryck och bypass måste matcha systemet.'],
['Ackumulator','System','Hydraulackumulator','Lagrar energi med komprimerad gas och hydraulvätska.','Hög lagrad energi: kräver säker avstängning, avlastning och korrekt gasförtryck.']
];
function symbol(type){
const start='<svg viewBox="0 0 240 126" role="img" aria-label="Förenklad teknisk illustration" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hmetal" x1="0" x2="1"><stop stop-color="#617b90"/><stop offset=".28" stop-color="#dce7ed"/><stop offset=".58" stop-color="#819cae"/><stop offset="1" stop-color="#314b5d"/></linearGradient></defs><g fill="none" stroke="#c4d8e6" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">';
let body='';
if(type==='Rörkoppling')body='<path d="M10 63H230" stroke="#4c9ab7" stroke-width="12"/><path d="M32 45h47l15 18-15 18H32zM208 45h-47l-15 18 15 18h47z" fill="url(#hmetal)"/><path d="M110 63V15" stroke="#4c9ab7" stroke-width="11"/><path d="M94 37h32v22H94z" fill="url(#hmetal)"/><path d="M43 49v28m10-28v28m134-28v28m10-28v28"/>';
else if(type==='Gänga')body='<path d="M24 43h190v40H24z" fill="url(#hmetal)"/>'+Array.from({length:12},(_,i)=>'<path d="M'+(40+i*14)+' 43l10 40"/>').join('')+'<path d="M24 63H214" stroke="#163142" stroke-dasharray="5 6"/>';
else if(type==='Slang')body='<path d="M15 72C56 12 110 111 162 49S220 60 225 62" stroke="#5d94b0" stroke-width="21"/><path d="M15 72C56 12 110 111 162 49S220 60 225 62" stroke="#d8e9f0" stroke-width="3" stroke-dasharray="7 8"/>';
else if(type==='Rör')body='<path d="M12 45H228V80H12z" fill="url(#hmetal)"/><path d="M12 55H228M12 70H228" stroke="#36586a"/>';
else if(type==='Fläns')body='<rect x="43" y="29" width="154" height="70" rx="8" fill="url(#hmetal)"/><circle cx="120" cy="64" r="27" fill="#0b1d2b"/>'+[[62,45],[178,45],[62,83],[178,83]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="7" fill="#142e40"/>').join('');
else if(type==='Ventil')body='<rect x="63" y="27" width="114" height="72" fill="#193b51"/><path d="M120 27V99M82 80l25-35m-13 3 13-3-2 13m28 22 23-34m-10 3 10-3-1 12"/><path d="M90 99v20m60-20v20M90 27V9m60 18V9"/>';
else body='<rect x="48" y="33" width="144" height="61" rx="12" fill="url(#hmetal)"/><path d="M120 33V94M48 63H192"/>';
return start+body+'</g></svg>';
}
let active=0;
function renderCatalog(){
 const query=$('hyd-search').value.toLocaleLowerCase('sv-SE').trim(),filter=$('hyd-filter').value;
 const matches=families.map((f,i)=>({f,i})).filter(({f})=>(filter==='Alla'||f[1]===filter)&&(!query||f.join(' ').toLocaleLowerCase('sv-SE').includes(query)));
 $('hyd-count').textContent=matches.length+' träffar';
 $('hyd-list').innerHTML=matches.map(({f,i})=>'<button type="button" class="hyd-item" data-i="'+i+'"><span class="hyd-thumb">'+symbol(f[1])+'</span><span><strong>'+escape(f[0])+'</strong><small>'+escape(f[2])+'</small></span><span aria-hidden="true">›</span></button>').join('')||'<p class="fine">Inga träffar. Prova exempelvis EO, ORFS, JIC, slang eller ventil.</p>';
 $('hyd-list').querySelectorAll('button[data-i]').forEach(b=>b.addEventListener('click',()=>{active=Number(b.dataset.i);showDetail()}));
 if(!matches.some(m=>m.i===active)&&matches.length)active=matches[0].i;
 if(matches.length)showDetail();else $('hyd-detail').innerHTML='';
}
function showDetail(){
 const f=families[active];$('hyd-detail').innerHTML='<div class="hyd-hero">'+symbol(f[1])+'</div><div class="hyd-kicker">'+escape(f[1])+' · PARKER-INSPIRERAD TEKNIKGUIDE</div><h3>'+escape(f[0])+'</h3><p><strong>'+escape(f[2])+'</strong></p><p>'+escape(f[3])+'</p><p class="hyd-note"><strong>Att kontrollera:</strong> '+escape(f[4])+'</p><p class="fine">Illustrationen visar principen, inte en verifierad Parker-produkt eller ett artikelnummer.</p>';
}
function updateCalc(){
 const p=num('hyd-pressure'),q=num('hyd-flow'),d=num('hyd-id'),len=num('hyd-length'),nu=num('hyd-visc'),rho=num('hyd-density'),eta=num('hyd-eff')/100;
 const box=$('hyd-results');
 if(![p,q,d,len,nu,rho,eta].every(Number.isFinite)||p<0||q<0||d<=0||len<0||nu<=0||rho<=0||eta<=0||eta>1){box.innerHTML='<p class="hyd-warn">Ange giltiga värden: diameter, viskositet, densitet och verkningsgrad måste vara positiva.</p>';return}
 const Q=q/60000,A=Math.PI*(d/1000)**2/4,v=Q/A,Re=v*(d/1000)/(nu*1e-6),f=Re<2300?64/Math.max(Re,1):(-1.8*Math.log10((0.0015/1000)/(3.7*(d/1000))+6.9/Math.max(Re,1)))**-2;
 const dp=f*(len/(d/1000))*(rho*v*v/2)/1e5;
 const power=p*q/600,shaft=power/eta;
 const regime=Re<2300?'Laminärt':Re>4000?'Turbulent':'Övergångsområde';
 box.innerHTML='<div class="hyd-metrics"><div><small>Flödeshastighet</small><strong>'+fmt(v,2)+' m/s</strong></div><div><small>Reynoldstal</small><strong>'+fmt(Re,0)+'</strong></div><div><small>Rörfriktion Δp</small><strong>'+fmt(dp,3)+' bar</strong></div><div><small>Hydraulisk effekt</small><strong>'+fmt(power,2)+' kW</strong></div><div><small>Axeleffekt, teoretisk</small><strong>'+fmt(shaft,2)+' kW</strong></div><div><small>Flödesregim</small><strong>'+regime+'</strong></div></div><p class="fine">Δp: Darcy–Weisbach, rak ledning, antagen absolut råhet 0,0015 mm. Friktionsfaktor: 64/Re laminärt; Haaland turbulent (övergångsområdet osäkert). Exkluderar böjar, kopplingar, ventiler, temperaturförändring och tryckstötar. Effekt: p × Q / 600. Kontrollera alltid komponenternas verkliga tryckklass.</p>';
 const w=320,h=100,x=15,y=42,pipe=Math.min(52,Math.max(12,d*0.8));$('hyd-pipe-svg').innerHTML='<svg viewBox="0 0 350 125" role="img" aria-label="Illustration av rördiameter och flödesriktning"><defs><linearGradient id="hpipe" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#d3e6ef"/><stop offset=".45" stop-color="#526c80"/><stop offset="1" stop-color="#9db3c2"/></linearGradient></defs><rect x="'+x+'" y="'+(y-pipe/2)+'" width="'+w+'" height="'+pipe+'" rx="4" fill="url(#hpipe)" stroke="#d2e4ee"/><rect x="'+x+'" y="'+(y-pipe*.29)+'" width="'+w+'" height="'+pipe*.58+'" fill="#175b7d" opacity=".8"/><path d="M65 42h200m-14-10 14 10-14 10" stroke="#b8f2ff" stroke-width="3" fill="none"/><path d="M336 '+(y-pipe/2)+'v'+pipe+'" stroke="#f0f7fa" stroke-width="2"/><text x="175" y="98" text-anchor="middle" fill="#d6e5ee" font-size="12">Innerdiameter Ø '+fmt(d,1)+' mm · '+fmt(v,2)+' m/s</text><text x="175" y="116" text-anchor="middle" fill="#8fb0c4" font-size="10">Schematisk – ej skalenlig</text></svg>';
}
function gauge(){
 const max=num('hyd-gauge-range'),reading=num('hyd-gauge-reading'),accuracy=num('hyd-gauge-accuracy'),out=$('hyd-gauge-info');
 if(![max,reading,accuracy].every(Number.isFinite)||max<=0||reading<0||reading>max||accuracy<0){out.textContent='Ange giltigt mätområde, visat tryck och noggrannhetsklass.';return}
 const angle=-130+260*reading/max,rad=angle*Math.PI/180,xx=120+68*Math.cos(rad),yy=114+68*Math.sin(rad);
 let ticks='';for(let i=0;i<=10;i++){const a=(-130+i*26)*Math.PI/180;const x1=120+83*Math.cos(a),y1=114+83*Math.sin(a),x2=120+93*Math.cos(a),y2=114+93*Math.sin(a);ticks+='<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" stroke="#adc8d8" stroke-width="2"/>';}
 $('hyd-gauge-svg').innerHTML='<svg viewBox="0 0 240 220" role="img" aria-label="Tryckmätare med visare vid '+fmt(reading)+' bar"><defs><radialGradient id="hgd"><stop stop-color="#243e50"/><stop offset="1" stop-color="#091c2a"/></radialGradient></defs><circle cx="120" cy="114" r="105" fill="#718da0" stroke="#d3e5ef" stroke-width="4"/><circle cx="120" cy="114" r="96" fill="url(#hgd)" stroke="#16364a" stroke-width="3"/>'+ticks+'<path d="M120 114L'+xx+' '+yy+'" stroke="#f2b46c" stroke-width="4" stroke-linecap="round"/><circle cx="120" cy="114" r="7" fill="#e8f2f6"/><text x="120" y="74" text-anchor="middle" font-size="13" fill="#9fbccc">bar</text><text x="120" y="158" text-anchor="middle" font-size="22" fill="#fff">'+fmt(reading)+'</text><text x="120" y="188" text-anchor="middle" font-size="11" fill="#b4d1e0">0 – '+fmt(max,0)+' bar</text></svg>';
 out.innerHTML='<strong>Visning: '+fmt(reading)+' bar</strong><p>Fullskala (FS): '+fmt(max,0)+' bar. Klass '+fmt(accuracy,1)+' innebär normalt maximal avvikelse ±'+fmt(max*accuracy/100,2)+' bar räknat på fullskalan, under specificerade referensförhållanden.</p><p class="fine">Exempel: 0–250 bar, klass 1,0 → ±2,5 bar. Pulsationer, övertryck och vibration kräver lämpligt instrument och skydd.</p>';
}
function flowmeter(){
 const q=num('hyd-meter-flow'),range=num('hyd-meter-range'),pct=num('hyd-meter-accuracy'),typ=$('hyd-meter-type').value;
 const out=$('hyd-meter-info');if(![q,range,pct].every(Number.isFinite)||range<=0||q<0||pct<0){out.textContent='Ange giltiga värden.';return}
 const val=typ==='fs'?range*pct/100:q*pct/100;
 const fill=Math.max(0,Math.min(100,q/range*100));
 $('hyd-meter-svg').innerHTML='<svg viewBox="0 0 340 126" role="img" aria-label="Schematisk flödesmätare"><rect x="12" y="41" width="316" height="44" rx="9" fill="#29495f" stroke="#9cb9cc" stroke-width="2"/><rect x="18" y="47" width="'+(304*fill/100)+'" height="32" rx="5" fill="#4ca5c4"/><path d="M35 63H300m-12-9 12 9-12 9" fill="none" stroke="#e2f6ff" stroke-width="2"/><text x="170" y="25" fill="#e2f0f8" font-size="15" text-anchor="middle">'+fmt(q,1)+' l/min</text><text x="170" y="111" fill="#9bb8ca" font-size="11" text-anchor="middle">'+fmt(fill,0)+' % av mätområdet</text></svg>';
 out.innerHTML='<strong>'+fmt(q,1)+' l/min · ±'+fmt(val,2)+' l/min</strong><p>Felmodell: '+(typ==='fs'?'procent av fullskala (FS)':'procent av avläst värde')+'. Detta är ett beräkningsexempel; verkliga instrument kan ha fler feltermer.</p><p class="fine">Turbin: kräver lämplig renhet/viskositet. Kugghjul/positiv deplacement: bra för vissa oljor. Variabel area: avläsning beror på kalibrering och medium. Ultraljud: montage och vätskeegenskaper spelar roll.</p>';
}
root.querySelectorAll('.hyd-tabs button').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('.hyd-tabs button').forEach(x=>x.classList.toggle('active',x===b));root.querySelectorAll('.hyd-page').forEach(p=>p.hidden=p.dataset.page!==b.dataset.tab);window.scrollTo({top:0,behavior:'smooth'})}));
$('hyd-search').addEventListener('input',renderCatalog);$('hyd-filter').addEventListener('change',renderCatalog);
root.querySelectorAll('[data-hyd-preset]').forEach(b=>b.addEventListener('click',()=>{$('hyd-search').value=b.dataset.hydPreset;$('hyd-filter').value='Alla';renderCatalog()}));
['hyd-pressure','hyd-flow','hyd-id','hyd-length','hyd-visc','hyd-density','hyd-eff'].forEach(id=>$(id).addEventListener('input',updateCalc));
['hyd-gauge-range','hyd-gauge-reading','hyd-gauge-accuracy'].forEach(id=>$(id).addEventListener('input',gauge));
['hyd-meter-flow','hyd-meter-range','hyd-meter-accuracy','hyd-meter-type'].forEach(id=>$(id).addEventListener('input',flowmeter));
renderCatalog();updateCalc();gauge();flowmeter();
})();