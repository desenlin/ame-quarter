/* Street fixtures, each with an explicit public-facing local +Z side. */
AME.createProps=function(K,scene){
 const {T,M,box,cyl,ball,ring,rod,mesh,sign,surface,obstacle}=K;
 const metadata={vending:[],bins:[],umbrellas:[],cars:[],tactile:[]};
 function group(x,y,z,angle=0,parent=scene){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;parent.add(g);return g;}
 function vending(x,z,color){
  const g=group(x,.17,z);g.name='Public-facing drinks machine';const paint=surface(color),oldUse=K.use;K.use(g);
  box(0,.96,-.33,1.03,1.87,.06,paint);for(const xx of [-.48,.48])box(xx,.96,0,.07,1.87,.72,paint);box(0,.4075,0,.96,.765,.72,paint);box(0,1.83,0,.96,.13,.72,paint);
  box(0,1.27,.17,.89,1.04,.025,M.dark);box(0,1.28,.19,.84,.96,.015,K.basic('#abdace'),false);
  for(let row=0;row<3;row++){const y=.84+row*.29;box(-.035,y+.0025,.282,.80,.025,.18,M.white,false);box(0,y-.032,.37,.87,.05,.025,M.dark,false);for(let j=0;j<4;j++){K.bottle(-.31+j*.18,y,.282,j+row);cyl(-.31+j*.18,y-.034,.396,.017,.018,K.basic('#efc978')).rotation.x=Math.PI/2;}}
  K.glass(0,1.285,.384,.87,.95);for(const xx of [-.445,.445])box(xx,1.285,.37,.022,.98,.036,M.metal,false);
  box(-.08,.34,.379,.66,.27,.022,M.black);box(-.08,.218,.445,.69,.018,.16,M.metal,false);box(.35,.61,.402,.20,.32,.026,M.dark);sign('IC',.35,.70,.42,.16,.07,'#4e9387');box(.35,.57,.424,.12,.022,.016,M.black,false);
  sign('COLD DRINKS',0,1.78,.382,.88,.15,color,'#f7efdd');sign('$2.50',-.12,.66,.413,.30,.09,null);for(const xx of [-.38,.38])box(xx,.015,0,.10,.035,.49,M.black,false);
  obstacle(0,0,1.08,.8,g,'vending');metadata.vending.push({object:g,x,z,front:{x,z:z+.9}});K.use(scene);return g;
 }
 function bins(x,z){
  const colors=['#416f81','#487d66','#a17c48'],names=['CANS','BOTTLES','PAPER'];
  for(let j=0;j<3;j++){const g=group(x+j*.78,.17,z);g.name=names[j]+' plaza bin';K.use(g);box(0,.48,0,.64,.91,.61,surface('#b5b9ad'));box(0,.97,0,.68,.09,.65,surface(colors[j]));box(0,.71,.315,.49,.24,.025,M.dark);sign(names[j],0,.41,.324,.50,.14,null,'#304a50');
    for(const xx of [-.23,.23])box(xx,.035,0,.07,.07,.45,M.dark,false);box(0,.78,.349,.51,.035,.09,surface(colors[j]),false);obstacle(0,0,.7,.68,g,'plaza bin');metadata.bins.push({object:g,x:x+j*.78,z});}K.use(scene);
 }
 function umbrella(shop){
  const x=shop.kind==='cafe'?-4.05:-1.65,z=shop.d/2+(shop.kind==='cafe'?.75:.60),g=group(x,.17,z,0,shop.group);g.name=shop.id+' umbrella rack';K.use(g);const width=.58,depth=.37;
  box(0,.055,0,width,.07,depth,M.dark);box(0,.099,0,width-.07,.012,depth-.07,surface('#374d57'),false);
  for(const xx of [-width/2,width/2])for(const zz of [-depth/2,depth/2]){rod([xx,.02,zz],[xx,.56,zz],.015,M.metal,g);box(xx,.012,zz,.05,.024,.05,M.dark,false,g);}
  for(const y of [.24,.54]){rod([-width/2,y,-depth/2],[width/2,y,-depth/2],.012,M.metal,g);rod([-width/2,y,depth/2],[width/2,y,depth/2],.012,M.metal,g);rod([-width/2,y,-depth/2],[-width/2,y,depth/2],.012,M.metal,g);rod([width/2,y,-depth/2],[width/2,y,depth/2],.012,M.metal,g);}
  for(let i=0;i<4;i++){const xx=-.21+i*.14,yy=.95+(i%2)*.10;rod([xx,.12,0],[xx,yy,0],.009,M.metal,g);const cover=mesh(new T.ConeGeometry(.046,.51,7),K.packs[(i+shopsIndex(shop))%8],xx,.51,0,1,1,1,g);cover.rotation.z=.025*(i-1.5);
    const points=[[xx,yy,0],[xx,yy+.07,0],[xx+.046,yy+.105,0],[xx+.088,yy+.074,0],[xx+.083,yy+.024,0]].map(p=>new T.Vector3(...p));mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),12,.013,6,false),M.dark,0,0,0,1,1,1,g);}
  sign('UMBRELLAS',0,.35,.195,.51,.075,null,'#dae1d3',0,g);obstacle(0,0,.62,.42,g,'umbrella rack');metadata.umbrellas.push({object:g,shop:shop.id});K.use(scene);return g;
 }
 function shopsIndex(s){return ['mart','cafe','bakery','books','ramen','florist'].indexOf(s.id);}
 function car(x,z){
  const g=group(x,.17,z);g.name='Compact hatchback';const paint=surface('#cfa24d','wet'),glass=surface('#294354','metal'),trim=surface('#28323c','matte');
  function loft(sections,material,cabin=false){const pos=[],indices=[];for(const [zz,bottom,shoulder,width]of sections){const lower=cabin?.755:width;const ring=[[-lower*.80,bottom],[-lower,bottom+.06],[-width,shoulder-.08],[-width*.83,shoulder],[-width*.45,shoulder+.027],[width*.45,shoulder+.027],[width*.83,shoulder],[width,shoulder-.08],[lower,bottom+.06],[lower*.80,bottom]];for(const [xx,yy]of ring)pos.push(xx,yy,zz);}
    for(let k=0;k<sections.length-1;k++)for(let j=0;j<10;j++){const a=k*10+j,b=k*10+(j+1)%10,c=b+10,d=a+10;indices.push(a,d,b,b,d,c);}for(const side of [0,sections.length-1])for(let j=1;j<9;j++)indices.push(side*10,side*10+(side?j+1:j),side*10+(side?j:j+1));const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(indices);geo.computeVertexNormals();return mesh(geo,material,0,0,0,1,1,1,g);
  }
  loft([[-1.60,.31,.70,.57],[-1.46,.29,.78,.71],[-.95,.29,.83,.75],[-.5,.29,.85,.76],[.58,.29,.85,.76],[1.18,.30,.83,.73],[1.48,.34,.76,.66]],paint);
  loft([[-.402,1.22,1.37,.596],[-.14,1.30,1.45,.58],[.72,1.29,1.44,.57],[1.08,1.17,1.32,.60]],paint);
  function pane(v,mat=glass){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(v.flat(),3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();const material=mat.clone();material.side=T.DoubleSide;K.reflective.push(material);mesh(geo,material,0,0,0,1,1,1,g);}
  pane([[-.634,.947,-.809],[.634,.947,-.809],[.539,1.336,-.413],[-.539,1.336,-.413]]);
  pane([[-.575,1.267,1.10],[.575,1.267,1.10],[.616,.950,1.329],[-.616,.950,1.329]]);
  for(const side of [-1,1]){
    rod([side*.652,.924,-.79],[side*.577,1.366,-.40],.033,paint,g);rod([side*.764,.912,.275],[side*.602,1.37,.275],.027,paint,g);rod([side*.688,.924,1.27],[side*.590,1.33,1.05],.036,paint,g);rod([side*.64,1.365,-.39],[side*.60,1.385,.77],.021,paint,g);
    pane([[side*.674,.958,-.724],[side*.606,1.337,-.374],[side*.603,1.35,.25],[side*.761,.948,.25]]);
    pane([[side*.761,.948,.30],[side*.603,1.35,.30],[side*.607,1.306,.90],[side*.687,.948,1.21]]);
    rod([side*.765,.88,.28],[side*.765,.39,.28],.007,trim,g);rod([side*.703,.88,-.71],[side*.75,.4,-.49],.006,trim,g);
    rod([side*.762,.4,-.48],[side*.762,.4,1.05],.009,trim,g);for(const zz of [.13,.96])box(side*.769,.858,zz,.034,.035,.15,M.metal,false,g);
    rod([side*.674,1.02,-.62],[side*.87,1.045,-.66],.021,trim,g);const mirror=ball(side*.88,1.055,-.66,.10,paint,g);mirror.scale.multiply(new T.Vector3(.83,.56,1.2));
    for(const zz of [-.97,.99]){
      const well=cyl(side*.759,.33,zz,.35,.025,trim,g);well.rotation.z=Math.PI/2;
      const tire=mesh(new T.TorusGeometry(.235,.076,10,28),M.black,side*.783,.322,zz,1,1,1,g);tire.rotation.y=Math.PI/2;
      const hub=cyl(side*.856,.322,zz,.171,.026,M.metal,g);hub.rotation.z=Math.PI/2;for(let k=0;k<6;k++){const a=k*Math.PI/3;rod([side*.875,.322,zz],[side*.875,.322+Math.cos(a)*.14,zz+Math.sin(a)*.14],.017,trim,g);}const cap=cyl(side*.89,.322,zz,.047,.023,M.metal,g);cap.rotation.z=Math.PI/2;
      const arc=mesh(new T.TorusGeometry(.348,.014,6,20,Math.PI),paint,side*.780,.33,zz,1,1,1,g);arc.rotation.y=Math.PI/2;
    }
    box(side*.465,.677,-1.622,.245,.125,.037,K.basic('#e0e6d1'),false,g);box(side*.595,.759,1.43,.15,.26,.035,surface('#b43e4c'),false,g);
  }
  box(0,.48,-1.61,1.04,.18,.034,trim,false,g);for(let i=0;i<4;i++)box(0,.43+i*.035,-1.632,.75,.009,.01,M.metal,false,g);
  box(0,.38,1.48,1.12,.10,.035,trim,false,g);box(0,1.40,.94,1.12,.045,.15,paint,false,g);
  sign('AME 28-16',0,.49,1.499,.43,.13,'#edce77','#263b44',0,g);sign('28-16',0,.44,-1.645,.36,.12,'#edce77','#263b44',Math.PI,g);
  rod([-.38,.965,-.812],[-.10,1.09,-.676],.011,trim,g);rod([.10,.965,-.812],[.39,1.09,-.676],.011,trim,g);rod([-.26,.957,1.343],[.17,1.014,1.299],.01,trim,g);
  rod([0,1.444,.83],[0,1.68,1.02],.012,trim,g);obstacle(0,0,1.84,3.30,g,'car');metadata.cars.push({object:g,x,z});return g;
 }
 return {vending,bins,umbrella,car,metadata};
};
