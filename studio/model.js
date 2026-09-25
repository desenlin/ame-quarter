(function(global){
  'use strict';
  const premises=[
    {id:'mart',unit:'01',name:'Ame Mart',use:'Neighborhood market',area:750,rent:42,bump:.025,start:'2025-01-01',expiry:'2030-12-31',recovery:'NNN',x:-12,z:-8,w:10,d:7,angle:0,frontage:'South · plaza',note:'Daily-needs tenant at the northwest end of the retail row. Evaluate delivery access and the relationship with plaza circulation.'},
    {id:'cafe',unit:'02',name:'Kissa Ao',use:'Coffee shop',area:675,rent:48,bump:.03,start:'2025-01-01',expiry:'2029-12-31',recovery:'CAM only',x:0,z:-8,w:9,d:7,angle:0,frontage:'South · covered terrace',note:'Covered outdoor seating and interior sofas support a place to linger. The terrace is common area, excluded from rentable area; no separate patio rent is assumed.'},
    {id:'bakery',unit:'03',name:'Komugi',use:'Bakery',area:600,rent:40,bump:.03,start:'2026-01-01',expiry:'2028-12-31',recovery:'NNN',x:10,z:-8,w:8,d:7,angle:0,frontage:'South · plaza',note:'Baking ventilation is visible on the roof. Cooking and exhaust equipment are tenant-maintained in this exercise.'},
    {id:'books',unit:'04',name:'Tsuki Books',use:'Bookstore',area:525,rent:32,bump:.02,start:'2024-01-01',expiry:'2028-12-31',recovery:'Gross',x:-14,z:3,w:7,d:7,angle:1,frontage:'East · plaza',note:'Quiet retail use along the western edge. The landlord bears the operating expenses allocated to this gross lease.'},
    {id:'ramen',unit:'05',name:'Yoru Ramen',use:'Restaurant',area:600,rent:46,bump:.03,start:'2026-01-01',expiry:'2031-12-31',recovery:'NNN',x:-14,z:10.8,w:8,d:7,angle:1,frontage:'East · plaza; south glazing',note:'A corner food use with street-facing glazing and roof exhaust. Tenant utilities and cooking equipment are outside the landlord operating budget.'},
    {id:'florist',unit:'06',name:'Midori',use:'Florist',area:450,rent:36,bump:.03,start:'2025-01-01',expiry:'2027-12-31',recovery:'NNN',x:10,z:4,w:7,d:6,angle:1,frontage:'West · plaza; east glazing',note:'The next lease expiration. Compare a renewal with re-leasing the same space, keeping the physical premise and expense allocation constant.'}
  ];
  const budget={tax:12000,insurance:3600,cam:10800,owner:2400};
  const totalArea=premises.reduce((a,p)=>a+p.area,0);
  const operating=Object.values(budget).reduce((a,b)=>a+b,0);
  function recovery(p){const recoverable=p.recovery==='NNN'?budget.tax+budget.insurance+budget.cam:p.recovery==='CAM only'?budget.cam:0;return recoverable*p.area/totalArea;}
  function summary(){const base=premises.reduce((a,p)=>a+p.area*p.rent,0),recoveries=premises.reduce((a,p)=>a+recovery(p),0);return {area:totalArea,base,recoveries,operating,noi:base+recoveries-operating};}
  const defaults={discount:8,renew:{rent:38,growth:3,downtime:0,free:0,ti:8,commission:2},replace:{rent:46,growth:3,downtime:4,free:2,ti:35,commission:6}};
  const rules={rent:[0,150],growth:[0,10],downtime:[0,24],free:[0,12],ti:[0,200],commission:[0,15],discount:[0,25]};
  function validate(o){for(const key of ['rent','growth','downtime','free','ti','commission']){const [lo,hi]=rules[key];if(!Number.isFinite(o[key])||o[key]<lo||o[key]>hi||(['downtime','free'].includes(key)&&!Number.isInteger(o[key])))throw Error('Invalid '+key);} }
  // Common 60-month decision window, starting January 2028. End-of-month operating
  // flows; TI + LC paid at the start of occupancy. No terminal/residual value.
  function offer(o,discount=8){
    validate(o);if(!Number.isFinite(discount)||discount<0||discount>25)throw Error('Invalid discount');
    const p=premises.find(p=>p.id==='florist'),monthlyRate=Math.pow(1+discount/100,1/12)-1;
    const expense=operating*p.area/totalArea/12,reimb=recovery(p)/12,term=60-o.downtime;
    const contracted=Array.from({length:term},(_,i)=>p.area*o.rent/12*Math.pow(1+o.growth/100,Math.floor(i/12))).reduce((a,b)=>a+b,0);
    const ti=p.area*o.ti,commission=contracted*o.commission/100,cost=ti+commission;
    const rows=Array.from({length:5},(_,i)=>({year:2028+i,base:0,recovery:0,expense:0,noi:0,leasing:0,cash:0}));
    const months=[];let npv=-cost/Math.pow(1+monthlyRate,o.downtime),cash=-cost;
    rows[Math.min(4,Math.floor(o.downtime/12))].leasing=cost;
    for(let m=1;m<=60;m++){
      const age=m-o.downtime-1,occupied=age>=0;
      const base=occupied&&age>=o.free?p.area*o.rent/12*Math.pow(1+o.growth/100,Math.floor(age/12)):0;
      const rec=occupied?reimb:0,noi=base+rec-expense;
      npv+=noi/Math.pow(1+monthlyRate,m);cash+=noi;
      const row=rows[Math.floor((m-1)/12)];row.base+=base;row.recovery+=rec;row.expense+=expense;row.noi+=noi;
      months.push({month:m,base,recovery:rec,expense,noi});
    }
    rows.forEach(r=>r.cash=r.noi-r.leasing);
    return {npv,cash,ti,commission,cost,contracted,term,rows,months};
  }
  function compare(s){const renew=offer(s.renew,s.discount),replace=offer(s.replace,s.discount);return {renew,replace,delta:replace.npv-renew.npv};}
  global.CRE={premises,budget,totalArea,operating,recovery,summary,defaults,rules,offer,compare};
  if(typeof module!=='undefined'&&module.exports)module.exports=global.CRE;
})(typeof window==='undefined'?globalThis:window);
