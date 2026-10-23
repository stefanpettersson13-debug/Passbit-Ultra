(()=>{
const terms=[
['HMI','Human Machine Interface','Operatörsgränssnittet för visning, manövrering och diagnos.'],
['SINUMERIK Operate','HMI','Siemens operatörsgränssnitt; utseende och tillgängliga funktioner kan vara maskinspecifika.'],
['JOG','Driftläge','Manuell axelrörelse och inställning. Följ maskinens säkerhetsrutiner.'],
['MDA','Driftläge','Manuell datainmatning för att köra enskilda NC-block enligt maskinens förutsättningar.'],
['AUTO','Driftläge','Automatisk programkörning. Kontrollera aktivt program och uppspänning.'],
['REF POINT','Driftläge','Referenspunktskörning; procedur och behov varierar mellan maskiner.'],
['NC / NCK','System','Numerisk styrning som tolkar och utför NC-program.'],
['PLC','System','Programmerbar logikstyrning för maskinens sekvenser, signaler och förreglingar.'],
['Drive','System','Drivsystem för motorer och axelreglering.'],
['Channel / Kanal','System','Logisk NC-kanal med eget programflöde; flerkanalsmaskiner kan ha flera samtidiga flöden.'],
['Machine data (MD)','Service','Maskindata som påverkar styrningens konfiguration. Ändra bara med rätt behörighet, backup och godkännande.'],
['Setting data (SD)','Service','Inställningsdata som påverkar olika styrfunktioner; betydelse beror på aktuell datapost.'],
['R-parameter','Programmering','Numeriska variabler som används i NC-program. Omfattning och livslängd beror på konfiguration.'],
['G54–G59','Nollpunkt','Vanliga val av inställbara arbetsstycksnollpunkter. Exakt tillämpning beror på aktivt system.'],
['G0 / G1','Programmering','Snabbförflyttning respektive linjär interpolering med programmerad matning.'],
['G2 / G3','Programmering','Cirkulär interpolering medurs respektive moturs i valt plan.'],
['G17 / G18 / G19','Programmering','Val av bearbetningsplan: XY, ZX respektive YZ i vanlig ISO-tillämpning.'],
['G90 / G91','Programmering','Absolut respektive inkrementell positionsprogrammering.'],
['G94 / G95','Programmering','Matning per minut respektive per varv i relevanta sammanhang.'],
['G96 / G97','Svarvning','Konstant skärhastighet respektive konstant spindelvarvtal i vanliga svarvkonfigurationer.'],
['M3 / M4 / M5','Spindel','Spindelstart medurs / moturs / stopp enligt maskinens implementation.'],
['M6','Verktyg','Verktygsbyte i många maskiner; maskinbyggaren bestämmer beteendet.'],
['T / D','Verktyg','Verktygsval och verktygskompensering; syntax och tilldelning varierar.'],
['Work offset','Nollpunkt','Förskjutning mellan maskinens koordinatsystem och arbetsstyckets referens.'],
['Actual value','HMI-data','Aktuellt avläst positionsvärde; kontrollera vilket koordinatsystem som visas.'],
['Distance-to-go','HMI-data','Återstående programmerad rörelse i aktuellt block, beroende på visningsläge.'],
['Feed override','HMI-data','Operatörens procentuella påverkan på programmerad matning.'],
['Spindle override','HMI-data','Operatörens procentuella påverkan på spindelvarvtal.'],
['Block search','Programkörning','Sökning efter programblock för återstart; kräver särskild försiktighet kring maskintillstånd.'],
['Single block','Programkörning','Programkörning block för block.'],
['Dry run','Programkörning','Provkörningsfunktion vars verkan och säkerhetsbegränsningar är maskinberoende.'],
['TRAORI','5-axligt','Siemens-funktion för verktygsorientering/transformering i tillämpliga maskinkinematiker; kräver maskinspecifik verifiering.'],
['CYCLE800','5-axligt','Orienterings-/svängcykel i tillämpliga Siemens-konfigurationer; parametrar och funktion beror på maskinen.'],
['ShopMill / ShopTurn','Programmering','Verkstadsorienterade programmeringsmiljöer för fräsning respektive svarvning.'],
['Alarm number','Diagnos','Unikt nummer i alarmvisningen. Sök alltid mot rätt manual och mjukvaruversion.'],
['Acknowledgement','Diagnos','Kvittering av alarm/meddelande; betyder inte nödvändigtvis att orsaken är åtgärdad.']
];
const input=document.getElementById('sinuSearch'),target=document.getElementById('sinuResults'),count=document.getElementById('sinuCount');
if(!input||!target)return;
function render(){const q=input.value.toLocaleLowerCase('sv').trim();const hits=terms.filter(row=>row.join(' ').toLocaleLowerCase('sv').includes(q));target.replaceChildren();count.textContent=hits.length+' begrepp';for(const [name,cat,desc] of hits){const box=document.createElement('article');box.className='sinu-entry';const em=document.createElement('em'),strong=document.createElement('strong'),small=document.createElement('small');em.textContent=cat;strong.textContent=name;small.textContent=desc;box.append(em,strong,small);target.append(box)}}
input.addEventListener('input',render);render();
})();