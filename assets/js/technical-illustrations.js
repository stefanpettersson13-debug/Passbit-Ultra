
(()=>{'use strict';const ns='http://www.w3.org/2000/svg';const root=document.querySelectorAll('.pb36-visual');const get=id=>document.getElementById(id);const number=id=>{const n=Number(String(get(id)?.value||'').replace(',','.'));return Number.isFinite(n)?n:null};
function render(host){const kind=host.dataset.visual,scene=host.querySelector('.pb36-scene');if(!scene)return;scene.replaceChildren();
const shape=(tag,attrs={},parent=scene)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));parent.append(e);return e};
const line=(x1,y1,x2,y2,cls='')=>shape('line',{x1,y1,x2,y2,stroke:'#b9d9e9','stroke-width':2,class:cls});
const rect=(x,y,w,h,cls='pb36-steel',rx=3)=>shape('rect',{x,y,width:w,height:h,rx,class:cls});
const circle=(x,y,r,cls='pb36-steel')=>shape('circle',{cx:x,cy:y,r,class:cls});
const txt=(x,y,v,cls='')=>{const t=shape('text',{x,y,class:cls});t.textContent=v;return t};
const poly=(points,cls='pb36-steel')=>shape('polygon',{points,class:cls});
const arrow=(x,y,dir=1)=>{line(x,y,x+dir*32,y,'pb36-dim');poly((x+dir*32)+','+y+' '+(x+dir*23)+','+(y-5)+' '+(x+dir*23)+','+(y+5),'pb36-highlight')};
rect(10,10,580,208,'',15).setAttribute('fill','#0c1b27');
for(let i=60;i<600;i+=60)line(i,18,i,214,'pb36-grid');for(let i=55;i<230;i+=55)line(18,i,580,i,'pb36-grid');
if(kind==='screw'){
const m=number('screwSize')||8;
const chart={3:[2.5,5.5],4:[3,7],5:[4,8],6:[5,10],8:[6,13],10:[8,16],12:[10,18],14:[12,21],16:[14,24],18:[14,27],20:[17,30],22:[17,34],24:[19,36],27:[19,41],30:[22,46],36:[27,55]};
const data=chart[m],socket=data?.[0],hex=data?.[1];
txt(28,37,'M'+m+' · nominell gängdiameter');
txt(28,60,'INVÄNDIG SEXKANT · ISO 4762','pb36-muted');
const cx=160,cy=133,R=67;
circle(cx,cy,R);circle(cx,cy,Math.max(10,R*.18)).setAttribute('fill','#172c3a');
const r=42;const pts=Array.from({length:6},(_,i)=>{const ang=Math.PI/6+i*Math.PI/3;return [cx+r*Math.cos(ang),cy+r*Math.sin(ang)].join(',')}).join(' ');poly(pts,'pb36-highlight');
line(115,192,205,192,'pb36-dim');txt(90,211,socket?'Insexnyckel '+socket+' mm':'Kontrollera dimension');
txt(345,60,'UTVÄNDIG SEXKANT · ISO 4017','pb36-muted');
const hx=447,hy=132,hr=62;const hpts=Array.from({length:6},(_,i)=>{const ang=Math.PI/6+i*Math.PI/3;return [hx+hr*Math.cos(ang),hy+hr*Math.sin(ang)].join(',')}).join(' ');poly(hpts);
line(393,190,501,190,'pb36-dim');txt(365,211,hex?'Nyckelvidd '+hex+' mm':'Kontrollera dimension');
}
else if(kind==='thread'){
const d=number('threadSize'),pitch=number('threadPitch'),drill=d!==null&&pitch!==null?d-pitch:null;
txt(25,35,'M'+(d||'—')+' × '+(pitch||'—')+' · ISO metrisk gänga');
rect(95,78,410,112);rect(115,105,370,56,'',0).setAttribute('fill','#0c1b27');
const count=9,step=350/count;for(let i=0;i<count;i++){const x=125+i*step;poly(x+',105 '+(x+step/2)+',123 '+(x+step)+',105','pb36-highlight');poly(x+',161 '+(x+step/2)+',143 '+(x+step)+',161','pb36-highlight')}
line(125,65,125+step,65,'pb36-dim');line(125,59,125,72,'pb36-dim');line(125+step,59,125+step,72,'pb36-dim');txt(130,54,'P = '+(pitch||'—')+' mm');
line(115,199,485,199,'pb36-dim');txt(143,215,drill>0?'Gängborr ≈ Ø '+drill.toLocaleString('sv-SE',{maximumFractionDigits:2})+' mm':'Välj dimension och stigning');
txt(355,38,'Profilen är principiell','pb36-muted');
}
else if(kind==='sine'){const L=number('length')||100,deg=number('angle')||0,h=L*Math.sin(deg*Math.PI/180);line(105,184,490,184);line(135,172,135,188);line(450,172,450,188);const yy=Math.max(60,170-Math.min(90,Math.abs(h)*1.3));poly('135,168 450,'+yy+' 450,'+(yy+12)+' 135,180');rect(430,yy+12,40,184-yy-12);txt(260,210,'Centrumavstånd L = '+L+' mm');txt(475,120,'h ≈ '+h.toLocaleString('sv-SE',{maximumFractionDigits:3})+' mm');txt(230,65,'Vinkel '+deg+'°');}
else if(kind==='blocks'){line(80,187,510,187);const colors=['#55778c','#789aaf','#a9c4d2','#49697b'];for(let i=0;i<4;i++){const r=rect(185,168-i*32,225,30);r.setAttribute('fill',colors[i]);txt(420,186-i*32,'Passbit '+(i+1))}txt(105,45,'Passbitspaket · stapling');line(163,41,163,188,'pb36-dim');txt(174,60,'Total höjd');}
else if(kind==='fits'){circle(300,117,91);circle(300,117,48);circle(300,117,39).setAttribute('fill','#8aa8b9');line(209,117,391,117,'pb36-dim');txt(220,27,'Hål och axel · tvärsnitt');txt(399,110,'Hål');txt(310,122,'Axel');}
else if(kind==='runout'){circle(295,115,78);circle(305,112,6).setAttribute('fill','#eebf7d');line(295,35,295,195,'pb36-dim');line(215,115,375,115,'pb36-dim');rect(375,55,65,28);line(406,83,373,100);txt(450,75,'Mätklocka');txt(25,40,'Excentricitet och kast');txt(25,203,'Rotationscentrum ≠ geometriskt centrum');}
else if(kind==='chain'){for(let i=0;i<4;i++){rect(70+i*110,90,100,52);txt(101+i*110,120,(i%2?'-':'+')+' L'+(i+1))}line(70,168,500,168,'pb36-dim');txt(178,190,'Resultat = algebraisk måttkedja');}
else if(kind==='thermal'){rect(95,95,370,45);rect(95,155,415,45);arrow(470,118);txt(115,83,'L vid referenstemperatur');txt(115,215,'L + ΔL vid uppvärmning');txt(485,112,'ΔL');}
else if(kind==='cutting'){circle(245,115,75);circle(245,115,16).setAttribute('fill','#10202c');rect(320,101,130,45);poly('320,101 300,115 320,146');arrow(205,30);txt(290,40,'Rotation n');txt(385,91,'Matning f');arrow(380,164);txt(25,40,'Verktyg och skärdata');}
else if(kind==='grinding'){circle(235,120,90);circle(415,120,90).setAttribute('fill','#9eb8c7');circle(325,120,5).setAttribute('fill','#f7c383');txt(135,40,'Slipskiva');txt(415,40,'Detalj');txt(256,219,'Kontaktzon');}
else if(kind==='ruler'){rect(65,97,470,50);for(let i=0;i<=20;i++){let x=80+i*22;line(x,97,x,97+(i%5===0?28:14),'pb36-dim');if(i%5===0)txt(x-5,87,String(i*5))}txt(155,180,'Referensmått och avläsning');}
}
root.forEach(host=>{const section=host.closest('section');section?.addEventListener('input',()=>render(host));section?.addEventListener('change',()=>render(host));render(host)});
})();
