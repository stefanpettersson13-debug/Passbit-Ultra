
/* Development preview only. NOT a subscription or payment authorization system. */
window.passbitToolTier=function(id){
 if(['abbrobot','sinumerik','pneumatics','cylinders','field'].includes(id))return 'ultra';
 if(id==='fittings')return 'free';
 if(['grinding','grindpro','shrink','thermal','diagnostic10','fits','blocks','runout','chain','measure','metrology','alignment','analysis10','reports10','assistant','stock'].includes(id))return 'pro';
 return 'free';
};
window.passbitCanUse=function(id){
 const rank={free:0,pro:1,ultra:2};
 return rank[window.passbitPreviewEdition||'ultra']>=rank[window.passbitToolTier(id)];
};
