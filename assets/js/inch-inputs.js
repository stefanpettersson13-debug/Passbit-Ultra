
// 5.8: Safe inch input through explicit per-field entry; all existing formulas continue to receive mm.
(function(){
 const sel=document.getElementById('inputUnit');if(!sel)return;
 let mode='mm';try{mode=localStorage.getItem('passbit_input_unit')==='in'?'in':'mm'}catch(e){}sel.value=mode;
 const fields=[...document.querySelectorAll('input')].filter(el=>{
  if(!['text','number',''].includes(el.getAttribute('type')||''))return false;
  if(!/decimal|numeric/.test(el.getAttribute('inputmode')||''))return false;
  const label=document.querySelector('label[for="'+el.id+'"]');
  return !!label && /\(mm\)|\(mm\)|millimeter/i.test(label.textContent) && !/mm\//.test(label.textContent);
 });
 function decimal(v){return Number(String(v).trim().replace(/\s/g,'').replace(',','.'))}
 function update(){for(const el of fields){const b=el.nextElementSibling;if(b&&b.classList.contains('inch-entry'))b.hidden=mode!=='in'}}
 for(const el of fields){
  const b=document.createElement('button');b.type='button';b.className='inch-entry';b.textContent='↔ Ange i inch';b.hidden=mode!=='in';
  b.setAttribute('aria-label','Ange '+(document.querySelector('label[for="'+el.id+'"]')?.textContent||'mått')+' i tum');
  b.addEventListener('click',()=>{
   const current=decimal(el.value);const initial=Number.isFinite(current)?String(Number((current/25.4).toFixed(8))):'';
   const entry=prompt('Ange mått i inch (in).\nOmvandlas till mm för beräkning:',initial);
   if(entry===null)return;
   const inch=decimal(entry);
   if(!Number.isFinite(inch)){alert('Ogiltigt mått. Använd exempelvis 0,34315.');return}
   const mm=inch*25.4;
   if(!Number.isFinite(mm)){alert('Måttet är för stort.');return}
   el.value=String(Number(mm.toPrecision(13))).replace('.',',');
   el.dispatchEvent(new Event('input',{bubbles:true}));
   el.dispatchEvent(new Event('change',{bubbles:true}));
  });
  el.insertAdjacentElement('afterend',b);
 }
 sel.addEventListener('change',()=>{mode=sel.value;try{localStorage.setItem('passbit_input_unit',mode)}catch(e){}update()});
 update();
})();

// 5.9: Information buttons for statistical capability indicators.
(()=>{
 const info={
 Cp:{title:'Cp – potentiell processduglighet',desc:'Cp jämför toleransfältets bredd med processens uppskattade korttidsvariation. Det tar inte hänsyn till om medelvärdet ligger i mitten av toleransfältet.',formula:'Cp = (USL − LSL) / (6 × σinom)',example:'Exempel: toleransbredd 0,060 mm och σinom 0,010 mm ger Cp = 1,00.'},
 Cpk:{title:'Cpk – processduglighet med centrering',desc:'Cpk visar hur väl processen ryms inom toleransgränserna med hänsyn till medelvärdets läge. Ett högt Cp men lågt Cpk betyder ofta att processen inte är centrerad.',formula:'Cpk = min[(USL − medelvärde) / (3 × σinom), (medelvärde − LSL) / (3 × σinom)]',example:'Exempel: LSL = 19,98, USL = 20,02, medelvärde = 20,01 och σinom = 0,005 mm ger Cpk ≈ 0,67.'},
 Pp:{title:'Pp – övergripande processprestanda',desc:'Pp jämför toleransfältet med den totala observerade variationen i mätserien, inte bara den kortsiktiga variationen. Det tar inte hänsyn till centreringen.',formula:'Pp = (USL − LSL) / (6 × s)',example:'s är stickprovsstandardavvikelsen beräknad från alla observationer.'},
 Ppk:{title:'Ppk – processprestanda med centrering',desc:'Ppk mäter processens observerade prestanda mot närmaste toleransgräns med total variation. Skillnaden mellan Cpk och Ppk kan indikera förändringar över tid.',formula:'Ppk = min[(USL − medelvärde) / (3 × s), (medelvärde − LSL) / (3 × s)]',example:'Ppk använder hela mätseriens standardavvikelse s.'},
 'σ total':{title:'Total standardavvikelse',desc:'Visar hur utspridda mätvärdena är kring medelvärdet. Appen använder stickprovsstandardavvikelse med n−1 i nämnaren.',formula:'s = √[Σ(xᵢ − medelvärde)² / (n − 1)]',example:'Enheten är densamma som mätvärdena, normalt mm.'},
 'Min / max':{title:'Minsta och största mätvärde',desc:'Visar lägsta respektive högsta uppmätta värde i den valda serien.',formula:'Spridning = max − min',example:'Användbart för att snabbt se om något mätvärde avviker kraftigt.'},
 sin:{title:'Sinuslinjal – mätprincip',desc:'En sinuslinjal använder ett känt centrumavstånd mellan rullarna och passbitshöjden för att ställa in eller kontrollera en vinkel.',formula:'h = L × sin(α)   |   α = arcsin(h/L)',example:'L = 100 mm och α = 5° ger h ≈ 8,7156 mm. Kontrollera alltid om din uppställning kräver ytterligare korrektion.'},
 blocks:{title:'Passbitskombination – mätprincip',desc:'Passbitar kombineras till en önskad höjd. Appen söker en kombination utifrån ditt registrerade set och dess nominella mått.',formula:'H = summa av valda passbitars nominella längder',example:'Nominell summa är inte samma sak som garanterad verklig höjd. Kontrollera kalibrering, temperatur, anliggning och rengöring.'},
 fits:{title:'ISO 286 – tolerans och passning',desc:'ISO 286 behandlar toleranssystem för linjära mått, inklusive toleransgrader och grundavvikelser för hål och axlar. Appen visar endast de klasser och intervall som stöds av beräkningen.',formula:'Minsta spel = hål min − axel max. Största spel = hål max − axel min.',example:'Negativt spel innebär övermått (presspassning). Kontrollera alltid aktuellt standardunderlag och ritning innan tillverkning.'},
 holes:{title:'Borrning och brotschning',desc:'Förborrningsdiameter och bearbetningsmån beror på material, verktyg, håldjup och tillverkarens rekommendationer.',formula:'Diametral bearbetningsmån = färdig håldiameter − förborrad håldiameter',example:'Använd värdena som planeringsstöd och kontrollera verktygstillverkarens data.'},
 screws:{title:'Skruv och nyckelvidd',desc:'Referensmått för skruvskallar och verktygsstorlekar. Standard, skruvtyp och utförande kan påverka måtten.',formula:'Välj rätt standard och skruvtyp för förbandet.',example:'En nominell gängdimension bestämmer inte ensam nyckelvidden för alla skruvtyper.'},
 convert:{title:'mm och inch – omräkning',desc:'En internationell tum är definierad exakt som 25,4 millimeter.',formula:'inch = mm / 25,4   |   mm = inch × 25,4',example:'1 inch = 25,4 mm exakt. Visad decimalprecision är avrundad.'},
 thermal:{title:'Längdutvidgning',desc:'Material ändrar längd med temperaturen. Enkel linjär utvidgning använder en konstant värmeutvidgningskoefficient.',formula:'ΔL = α × L₀ × ΔT',example:'α varierar med material och temperatur. Vid precisionsmätning används ofta referenstemperaturen 20 °C.'},
 cutting:{title:'Varvtal och matning',desc:'Beräkna teoretiskt varvtal från skärhastighet och diameter. Matningen påverkas av tandantal och matning per tand.',formula:'n = (1000 × Vc)/(π × D)   |   Vf = n × z × fz',example:'Kontrollera maskinens begränsningar, verktyg, material och säkerhetsdata.'},
 grinding:{title:'Slipteknik – periferihastighet',desc:'Periferihastigheten är den tangentiella hastigheten vid en roterande skivas ytterdiameter. Använd aldrig beräknat varvtal över skivans märkta maxhastighet.',formula:'v (m/s) = π × D(mm) × n(rpm) / 60000',example:'D = 400 mm och n = 1800 rpm ger cirka 37,70 m/s. Kontrollera alltid skivans märkning och maskinens gränser.'},
 runout:{title:'Kast och excentricitet',desc:'TIR är hela mätklockans utslag mellan max och min under en rotation. Det kan bero på excentricitet, formfel, uppspänning eller andra fel.',formula:'TIR = största avläsning − minsta avläsning',example:'Excentricitet ≈ TIR/2 gäller bara för idealiserad cirkulär detalj med ren excentricitet, inte generellt.'},
 chain:{title:'Toleranskedja – värsta fall',desc:'En toleranskedja summerar bidragande mått med riktning. Värsta-fall-beräkning antar att alla mått kan nå sina gränsvärden samtidigt.',formula:'Total min = summa av min/max beroende på måttets tecken. Total max beräknas omvänt.',example:'Statistisk toleransanalys (RSS) är en annan metod och kräver antaganden om variation och oberoende.'},
 shrink:{title:'Krymp- och presspassning',desc:'Termisk montering bygger på skillnaden i utvidgning mellan hål och axel. Beräkningen är en förenklad geometrisk uppskattning.',formula:'ΔD = α × D₀ × ΔT',example:'Tar inte automatiskt hänsyn till kontakttryck, spänningar, ytfinhet, värmeöverföring eller materialets tillåtna temperatur.'},
 measure:{title:'Mätprotokoll och SPC',desc:'Registrera mätvärden, toleransgränser och mätordning. Cp/Cpk avser skattad processduglighet och Pp/Ppk övergripande prestanda.',formula:'Cp = (USL−LSL)/(6σinom); Pp = (USL−LSL)/(6s)',example:'Kräver ett tillräckligt stort representativt datamaterial, dugligt mätsystem och stabil process för säkra slutsatser.'}
 };
 let overlay=null,lastFocus=null;
 function close(){if(overlay){overlay.remove();overlay=null;lastFocus?.focus();}}
 function show(key){const d=info[key];if(!d)return;close();lastFocus=document.activeElement;overlay=document.createElement('div');overlay.className='spc-help-overlay';overlay.innerHTML='<section class="spc-help-card" role="dialog" aria-modal="true" aria-labelledby="spcHelpTitle"><button type="button" class="spc-help-close">Stäng ✕</button><h3 id="spcHelpTitle"></h3><p class="spc-desc"></p><p class="spc-formula"></p><p class="spc-example"></p><p><small>USL = övre toleransgräns, LSL = undre toleransgräns. I PassBit Pro skattas σinom från successiva rörliga spann (MR̄/1,128). Minst fem värden krävs för visning, men betydligt fler mätningar och en stabil process behövs för tillförlitliga slutsatser. Kontrollera mätordning, styrdiagram och mätsystem innan index används för beslut.</small></p></section>';const card=overlay.firstElementChild;card.querySelector('h3').textContent=d.title;card.querySelector('.spc-desc').textContent=d.desc;card.querySelector('.spc-formula').textContent=d.formula;card.querySelector('.spc-example').textContent=d.example;const caveat=card.querySelector('p:last-child');if(!['Cp','Cpk','Pp','Ppk','σ total','Min / max'].includes(key))caveat.remove();card.querySelector('.spc-help-close').addEventListener('click',close);overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.body.appendChild(overlay);card.querySelector('button').focus();}
 document.addEventListener('keydown',e=>{if(overlay&&e.key==='Escape')close()});
 document.addEventListener('click',e=>{const b=e.target.closest?.('[data-spc-info]');if(b)show(b.dataset.spcInfo)});
 // Help buttons are attached to tool headings, not the uncluttered home dashboard.
 const topicNames={sin:'Sinuslinjal',blocks:'Passbitsbyggare',fits:'ISO 286',holes:'Borr & brotsch',screws:'Skruv & nycklar',convert:'Omvandling',thermal:'Temperatur',cutting:'Skärdata',grinding:'Slipteknik',runout:'Kast',chain:'Toleranskedjor',shrink:'Krymppassning',measure:'Mätprotokoll',metrology:'Mätteknik',alignment:'Maskingeometri',cncpro:'CNC-teknik',grindpro:'Slipteknik',field:'Fältservice & SAT/FAT',assistant:'Precision Assistant'};
 for(const [id,name] of Object.entries(topicNames)){
   const section=document.getElementById(id);if(!section)continue;
   const heading=section.querySelector('.panel h2');if(!heading||heading.querySelector('.spc-info')||!info[id])continue;
   const button=document.createElement('button');button.type='button';button.className='spc-info tool-help';button.dataset.spcInfo=id;button.setAttribute('aria-label','Information om '+name);button.title='Förklaring av '+name;button.textContent='i';heading.appendChild(button);
 }
 const target=document.getElementById('mpStats');if(!target)return;
 function decorate(){for(const metric of target.querySelectorAll('.metric')){const small=metric.querySelector('small');if(!small||metric.querySelector('.spc-info'))continue;const label=small.textContent.trim();const key=Object.keys(info).find(k=>label===k||label.startsWith(k+' ·'));if(!key)continue;const b=document.createElement('button');b.type='button';b.className='spc-info';b.dataset.spcInfo=key;b.setAttribute('aria-label','Information om '+key);b.title='Vad betyder '+key+'?';b.textContent='i';small.insertAdjacentElement('afterend',b);}}
 decorate(); // no subtree-wide observer
})();
