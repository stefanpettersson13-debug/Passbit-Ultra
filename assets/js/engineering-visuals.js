
/* Visual Engineering: render existing live inputs, never modify process parameters. */
(()=>{'use strict';const get=id=>document.getElementById(id),num=id=>Number(get(id)?.value),fmt=(v,u)=>Number.isFinite(v)?v.toFixed(2)+' '+u:'—';
const host=get('pb35-machine');if(!host)return;
const svgNS='http://www.w3.org/2000/svg';
function renderGeometry(D,d,mode){
 const group=get('pb35-geometry-shapes');if(!group)return;group.replaceChildren();
 const el=(tag,attrs,parent=group)=>{const node=document.createElementNS(svgNS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));parent.append(node);return node};
 const text=(x,y,value,opts={})=>{const node=el('text',{x,y,fill:'#d6e9f3','font-size':12,'font-family':'system-ui,sans-serif',...opts});node.textContent=value;return node};
 const valid=D>0&&d>0&&Number.isFinite(D)&&Number.isFinite(d)&&(mode==='od'||D<d);
 if(!valid){text(320,166,'Ogiltig geometri – kontrollera diametrarna',{'text-anchor':'middle',fill:'#f2bd94'});return}
 const cy=171;
 if(mode==='od'){
  const scale=Math.min(126/D,100/d,340/(D+d));const rw=D*scale/2,rd=d*scale/2;
  const total=rw+rd,cxw=320-total/2-rw/2,cxd=cxw+rw+rd,contact=cxw+rw;
  el('circle',{cx:cxd,cy,r:rd,fill:'url(#pb35-steel-fill)',stroke:'#c7dce6','stroke-width':2.5});
  el('circle',{cx:cxw,cy,r:rw,fill:'url(#pb35-wheel-fill)',stroke:'#c4dfe9','stroke-width':2.5});
  el('circle',{cx:cxw,cy,r:Math.max(4,rw*.15),fill:'#101e29',stroke:'#e0f0f7','stroke-width':2});
  el('circle',{cx:cxd,cy,r:Math.max(3,rd*.12),fill:'#12222e',stroke:'#d6e6ee','stroke-width':1.6});
  el('line',{x1:cxw,y1:cy,x2:cxd,y2:cy,stroke:'#e5eef3','stroke-dasharray':'5 6',opacity:.45});
  el('circle',{cx:contact,cy,r:5,fill:'#ffbd70',stroke:'#fff0cc','stroke-width':1.5});
  text(cxw,cy+rw+22,'SLIPSKIVA',{'text-anchor':'middle'});
  text(cxd,cy+rd+22,'DETALJ',{'text-anchor':'middle'});
  text(cxw,cy-rw-10,'Ø '+D.toLocaleString('sv-SE')+' mm',{'text-anchor':'middle',fill:'#a8cadc'});
  text(cxd,cy-rd-10,'Ø '+d.toLocaleString('sv-SE')+' mm',{'text-anchor':'middle',fill:'#a8cadc'});
 }else{
  // A section through the bore: the wheel sits entirely inside and touches the bore at one point.
  const boreR=109,outerR=137,rw=boreR*D/d;
  const cx=320,wx=cx+(boreR-rw),contact=cx+boreR;
  el('circle',{cx,cy,r:outerR,fill:'url(#pb35-steel-fill)',stroke:'#b8d0db','stroke-width':2.5});
  el('circle',{cx,cy,r:boreR,fill:'#0c1924',stroke:'#dceaf1','stroke-width':3});
  el('circle',{cx:wx,cy,r:rw,fill:'url(#pb35-wheel-fill)',stroke:'#b7d9e9','stroke-width':2.5});
  el('circle',{cx:wx,cy,r:Math.max(3,rw*.14),fill:'#0b1923',stroke:'#e0eef5','stroke-width':1.5});
  el('line',{x1:cx,y1:cy,x2:wx,y2:cy,stroke:'#d9ebf3','stroke-dasharray':'5 6',opacity:.6});
  el('circle',{cx:contact,cy,r:5,fill:'#ffbd70',stroke:'#fff0cc','stroke-width':1.5});
  text(cx,cy-outerR-9,'HÅL Ø '+d.toLocaleString('sv-SE')+' mm',{'text-anchor':'middle',fill:'#a8cadc'});
  text(wx,cy+rw+20,'SKIVA Ø '+D.toLocaleString('sv-SE')+' mm',{'text-anchor':'middle',fill:'#c6e6f5'});
  text(cx,cy+outerR+17,'ARBETsstycke · INNERDIAMETER',{'text-anchor':'middle','font-size':10});
 }
}
function draw(){const D=num('pbg-wheel'),d=num('pbg-work'),rpm=num('pbg-wrpm'),wrpm=num('pbg-workrpm'),max=num('pbg-max'),width=num('pbg-dresswidth'),feed=num('pbg-dressfeed'),mode=get('pbg-mode')?.value||'od';const vs=Math.PI*D*rpm/60000,vw=Math.PI*d*wrpm/60000;
get('pb35-vs').textContent=D>0&&rpm>=0?fmt(vs,'m/s'):'—';get('pb35-vw').textContent=d>0&&wrpm>=0?fmt(vw,'m/s'):'—';get('pb35-ud').textContent=width>0&&feed>0?fmt(width/feed,'Ud'):'—';
get('pb35-mode-label').textContent=mode==='id'?'ID · INVÄNDIG':'OD · UTVÄNDIG';
renderGeometry(D,d,mode);
get('pb35-alert').textContent=!(D>0&&d>0&&rpm>=0&&wrpm>=0)?'Ange giltiga positiva diametrar och icke-negativa varvtal.':max<=0?'Skivans märkta maxhastighet saknas – kan inte verifiera säker hastighet.':vs>max?'VARNING: Beräknad skivhastighet överstiger skivans märkta maxhastighet.':mode==='id'&&D>=d?'VARNING: Skivdiametern måste vara mindre än håldiametern.':'Visningen är schematisk. Kontrollera alltid maskin, skiva och säkerhetsgränser.'}
const lab=get('pb-grinding-lab');lab?.addEventListener('input',draw);lab?.addEventListener('change',draw);draw();
const diag=get('diagnostic10');function fft(){const rpm=Number(get('pb-dx-rpm')?.value),valid=Number.isFinite(rpm)&&rpm>0,bar=get('pb35-bars'),list=get('pb35-order-list');if(!bar||!list)return;bar.replaceChildren();list.replaceChildren();for(let i=1;i<=5;i++){const x=45+i*82,height=[0,72,121,55,97,43][i];const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('x',String(x));rect.setAttribute('y',String(185-height));rect.setAttribute('width','21');rect.setAttribute('height',String(height));rect.setAttribute('rx','4');rect.setAttribute('fill',i===1?'#c0eaf9':'#648ba2');bar.append(rect);const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',String(x+10));t.setAttribute('y','199');t.setAttribute('text-anchor','middle');t.setAttribute('font-size','11');t.setAttribute('fill','#b9d3e0');t.textContent=i+'×';bar.append(t);const chip=document.createElement('span');chip.textContent=valid?i+'×: '+(rpm*i/60).toFixed(2)+' Hz':i+'×: —';list.append(chip)}}
diag?.addEventListener('input',fft);fft();
get('pb35-report-export')?.addEventListener('click',()=>{const symptom=get('pb-dx-symptom'),mode=get('pb-dx-method'),causes=[...document.querySelectorAll('#pb-dx-causes .pb-dx-cause')].map(e=>'- '+e.textContent),checks=[...document.querySelectorAll('#pb-dx-checks li')].map((e,i)=>(i+1)+'. '+e.textContent);const lines=['PASSBIT TITANIUM · FELSÖKNINGSRAPPORT','Datum: '+new Date().toLocaleString('sv-SE'),'Maskin: '+(get('pb35-report-machine').value||'Ej angiven'),'Slipmetod: '+mode.selectedOptions[0].textContent,'Symptom: '+symptom.selectedOptions[0].textContent,'Skivvarvtal (angivet): '+get('pb-dx-rpm').value+' rpm','Observationer: '+(get('pb35-report-observation').value||'Ej angivna'),'','MÖJLIGA ORSAKER',...causes,'','KONTROLLORDNING',...checks,'','OBS: Förslag till felsökning, inte verifierad diagnos. Illustrationer är inte mätdata.'];const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='passbit-diagnostik-'+new Date().toISOString().slice(0,10)+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)});
})();
