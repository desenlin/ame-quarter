AME.buildStreet=function(K,scene,layout,shops){
  const {T,M,mat,basic,use,box,cyl,ball,ring,rod,wire,sign,obstacle,solid,rand,bottle,plant,bench,packs}=K;use(scene);const props=AME.createProps(K,scene);
  for(const [a,b,c,d] of layout.ground){const x=(a+b)/2,z=(c+d)/2;box(x,-.57,z,b-a,1.10,d-c,mat('#344e68'),false);box(x,-1.13,z,b-a,.10,d-c,mat('#192e44'),false);box(x,.006,z,b-a,.032,d-c,M.road,false);}
  // Staggered stone pavers sit in narrow mortar joints; separate asphalt parking remains legible.
  box(-1,.078,-2.25,36,.15,23.5,mat('#55554f'),false);box(-5.65,.078,12.1,26.7,.15,5.8,mat('#55554f'),false);
  box(11.55,.142,12.1,7.7,.064,5.8,M.road,false);
  const stone=['#77776e','#737770','#7c7c72','#75786e','#808076','#747670'].map(c=>K.surface(c,'matte'));
  function shopFootprint(x,z){return shops.some(s=>{const p=new T.Vector3(x-s.x,0,z-s.z).applyAxisAngle(new T.Vector3(0,1,0),-s.angle);return Math.abs(p.x)<s.w/2+.04&&Math.abs(p.z)<s.d/2+.04;});}
  for(let row=0,z=-13.74;z<15;row++,z+=.50)for(let x=-18.70-(row%2)*.375;x<17;x+=.75){const left=Math.max(-19,x-.367),right=Math.min(z>9.5?7.7:17,x+.367);if(right-left<.03||shopFootprint((left+right)/2,z))continue;box((left+right)/2,.163,z,right-left,.018,.481,stone[(row+Math.floor((x+20)*3)+6)%6],false);}
  // Warm threshold strips and restrained charcoal borders distinguish the storefront aprons.
  for(const s of shops){use(s.group);for(let x=-s.w/2+.22;x<s.w/2;x+=.45)box(x,.171,s.d/2+.20,.433,.014,.33,mat('#938b75'),false);use(scene);}
  // Border curbs stop at the parking driveway and pedestrian crossings.
  box(-19.1,.16,.5,.20,.23,29.0,M.metal);box(-1,.16,-14.1,36.2,.23,.20,M.metal);
  box(-13.475,.16,15.10,11.05,.23,.2,M.metal);box(.975,.16,15.10,12.05,.23,.2,M.metal);box(17.1,.16,-9.1,.20,.23,9.8,M.metal);box(17.1,.16,3.2,.20,.23,9.6,M.metal);
  function ramp(x,z,angle=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=angle;scene.add(g);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([-1.38,.176,-.28,1.38,.176,-.28,1.38,.029,.28,-1.38,.029,.28],3));geo.setIndex([0,2,1,0,3,2]);geo.computeVertexNormals();K.mesh(geo,K.surface('#8a887b','matte'),0,0,0,1,1,1,g);}
  ramp(-6.5,15.13);ramp(17.2,-2.9,Math.PI/2);
  // Three parking bays; the former corner bay becomes a raised pedestrian verge.
  const parking=[];for(let j=0;j<3;j++){const x=9.0+j*2.55,z=12.25;parking.push({x,z,width:2.45,length:4.6});for(const xx of [x-1.225,x+1.225])box(xx,.186,z,.075,.018,4.6,M.white,false);box(x,.186,z-2.3,2.45,.018,.075,M.white,false);sign('P',x,.201,z+.22,.73,.90,null,'#e4e9d7').rotation.x=-Math.PI/2;sign('0'+(j+1),x,.201,z+1.75,.5,.33,null,'#c3d5d4').rotation.x=-Math.PI/2;for(const dx of [-.62,.62]){solid(x+dx,.23,z-1.96,.55,.15,.2,M.metal);box(x+dx,.309,z-1.96,.36,.012,.14,M.yellow,false);}}
  cyl(16.25,1.67,10.0,.06,3,M.metal);box(16.25,2.97,10,1.14,1.14,.17,M.dark);sign(['P','CUSTOMER PARKING'],16.25,2.97,10.10,.99,.98,'#326c94');obstacle(16.25,10,.20,.20,scene,'parking sign');
  const corner={minX:15.4,maxX:17.2,minZ:9.5,maxZ:15.2,approach:new T.Vector3(16.3,0,11.05)};
  props.car(9,12.15);
  // Continuous tactile route, with branches to entrances and warning fields at crossings.
  const tactileTile=K.surface('#bfa451','matte'),tactileRib=K.surface('#c9af60','matte');
  function tactile(a,b){const dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),steps=Math.ceil(length/.30);for(let j=0;j<=steps;j++){const t=j/steps,x=a[0]+dx*t,z=a[1]+dz*t;box(x,.193,z,.29,.026,.29,tactileTile,false);for(let k=0;k<3;k++){if(Math.abs(dx)>Math.abs(dz))box(x,.211,z-.09+k*.09,.24,.010,.022,tactileRib,false);else box(x-.09+k*.09,.211,z,.022,.010,.24,tactileRib,false);}props.metadata.tactile.push({x,z});}}
  tactile([-6.5,14.35],[-6.5,-2.45]);tactile([-12,-2.45],[10,-2.45]);
  for(const s of shops){const entry=s.entry;if(s.angle===0)tactile([entry.x,-2.45],[entry.x,entry.z+.15]);else if(s.kind==='florist')tactile([-6.5,4],[entry.x-.10,4]);else tactile([-6.5,entry.z],[entry.x+.12,entry.z]);}
  for(const z of [14.65,-2.45,3,4,10.8]){box(-6.5,.199,z,.60,.027,.60,tactileTile,false);for(let a=0;a<5;a++)for(let b=0;b<5;b++)cyl(-6.74+a*.12,.217,z-.24+b*.12,.024,.012,tactileRib);}
  for(let i=0;i<14;i++)box(-6.5,.042,15.48+i*.46,2.75,.027,.27,M.white,false);
  for(let i=0;i<14;i++)box(17.45+i*.46,.045,-2.9,.27,.027,2.25,M.white,false);
  // Service lane behind the shops, drains, crates and refuse bins.
  box(-1,.173,-12.70,35.4,.018,1.5,mat('#536b7c'),false);
  function drain(x,z,rot=0){const g=new T.Group();g.position.set(x,.046,z);g.rotation.y=rot;scene.add(g);box(0,0,0,1.05,.025,.29,M.black,true,g);for(let i=0;i<13;i++)box(-.47+i*.078,.023,0,.033,.018,.25,M.metal,false,g);}
  for(const x of [-13,-2,8,15])drain(x,15.3);drain(17.3,-4,Math.PI/2);drain(17.3,4,Math.PI/2);
  box(-1,.034,-14.3,36,.025,.12,M.black,false);box(-19.3,.034,.5,.12,.025,29,M.black,false);
  for(const s of shops){use(s.group);const x=s.serviceFacade?-s.w*.12-.68:-s.w/2+.52;for(let j=0;j<2;j++){box(x+j*.63,.43,-s.d/2-.49,.5,.50,.52,mat(j?'#b7a26c':'#648681'));for(let n=0;n<4;n++)box(x-.18+j*.63+n*.12,.45,-s.d/2-.212,.026,.25,.014,M.dark,false);}use(scene);}
  props.vending(-15.65,-3.80,'#397fa2');props.vending(-14.43,-3.80,'#ab586b');
  props.bins(3.90,10.1);shops.forEach(s=>props.umbrella(s));AME.buildTerrace(K,shops.find(s=>s.kind==='cafe'));use(scene);
  const bicycles=[];function bicycle(x,z,color,angle){const g=new T.Group();g.position.set(x,.18,z);g.rotation.y=angle;scene.add(g);bicycles.push({x,z,object:g});const paint=mat(color);for(const xx of [-.67,.67]){ring(xx,.40,0,.355,M.black,g);ring(xx,.4,.01,.322,M.metal,g);for(let j=0;j<10;j++){const a=j*Math.PI/5;rod([xx,.4,0],[xx+Math.cos(a)*.31,.4+Math.sin(a)*.31,0],.006,M.metal,g);}}
  const p=[[-.67,.4,0],[-.3,.92,0],[0,.4,0],[.43,.92,0],[.67,.4,0]];for(const [a,b] of [[0,1],[1,2],[2,0],[1,3],[3,2],[3,4]])rod(p[a],p[b],.024,paint,g);box(-.32,1.08,0,.3,.06,.2,M.dark,true,g);rod([-.3,.9,0],[-.32,1.08,0],.02,M.metal,g);rod([.43,.9,0],[.44,1.19,0],.02,M.metal,g);rod([.44,1.19,-.23],[.44,1.19,.23],.021,M.metal,g);box(.70,1.03,0,.36,.06,.37,M.metal,true,g);for(let n=0;n<5;n++){rod([.52+n*.09,1.06,-.2],[.52+n*.09,1.29,-.2],.011,M.metal,g);rod([.52+n*.09,1.06,.2],[.52+n*.09,1.29,.2],.011,M.metal,g);}for(const xx of [.52,.88]){for(let n=0;n<5;n++)rod([xx,1.06,-.2+n*.1],[xx,1.29,-.2+n*.1],.01,M.metal,g);for(const y of [1.13,1.21,1.29])rod([xx,y,-.2],[xx,y,.2],.011,M.metal,g);}
  for(const zz of [-.2,.2])for(const y of [1.13,1.21,1.29])rod([.52,y,zz],[.88,y,zz],.011,M.metal,g);
  for(let i=0;i<5;i++){rod([.52+i*.09,1.061,-.2],[.52+i*.09,1.061,.2],.008,M.metal,g);rod([.52,1.061,-.2+i*.1],[.88,1.061,-.2+i*.1],.008,M.metal,g);}rod([.58,1.05,-.14],[.43,.78,-.10],.016,M.metal,g);rod([.58,1.05,.14],[.43,.78,.10],.016,M.metal,g);
  ring(0,.40,.035,.11,M.metal,g);rod([-.67,.37,.03],[0,.29,.03],.009,M.dark,g);rod([-.67,.45,.03],[0,.51,.03],.009,M.dark,g);rod([0,.40,-.12],[.16,.27,-.12],.014,M.metal,g);box(.16,.27,-.12,.17,.045,.10,M.dark,false,g);
  rod([0,.4,0],[-.2,0,.18],.014,M.metal,g);obstacle(0,0,1.9,.50,g,'bicycle');}
  bicycle(9.1,8.50,'#f1ab79',0);bicycle(11.6,8.50,'#74c8b9',0);bicycle(14.95,3.7,'#ce98bd',Math.PI/2);
  for(const x of [9.1,11.6]){for(const dx of [-.40,.40])rod([x+dx,.175,8.26],[x+dx,.90,8.26],.025,M.metal);rod([x-.40,.90,8.26],[x+.40,.90,8.26],.025,M.metal);obstacle(x,8.26,.86,.09,scene,'cycle rack');for(const zz of [8.08,8.89])box(x,.189,zz,2.02,.013,.028,M.white,false);}
  // A small planted square leaves a complete walking loop around it.
  solid(-.3,.36,7.4,4.6,.44,3.7,mat('#627a83'));box(-.3,.596,7.4,4.3,.03,3.4,K.soil,false);for(let i=0;i<95;i++){const chip=box(-2.35+rand()*4.1,.617,5.82+rand()*3.13,.045+rand()*.055,.012,.03,mat(i%2?'#6c5340':'#80644d'),false);chip.rotation.y=rand()*Math.PI;}
  const trees=AME.buildMaples(K,scene);const benches=[bench(-.3,10.05,0),bench(-3.43,7.2,-Math.PI/2)];
  for(const [i,[x,z]] of [[-4,12.8],[4.5,12.8],[15,-1],[15,8.2]].entries())plant(x,z,.46,['daisy','tulip','lavender','sunflower'][i]);
  // Neighborhood notice board and directory are physical street objects.
  solid(1.3,1.47,12.35,1.32,1.88,.16,M.wood);const directory={x:1.3,z:12.35,panelBottom:.53,posts:[]};
  for(const x of [.73,1.87]){box(x,.193,12.35,.24,.042,.32,M.metal,false);const post=box(x,1.36,12.35,.085,2.376,.09,M.dark,false);directory.posts.push({object:post,bottom:.172,top:2.548});for(const dx of [-.075,.075])cyl(x+dx,.219,12.35,.015,.012,M.metal);}
  box(1.3,2.48,12.35,1.52,.075,.40,M.metal,false);sign(['雨まち商店街','AME QUARTER','COFFEE · BOOKS · FLOWERS'],1.3,1.95,12.453,1.14,.49,'#dbcaab','#516567');for(let j=0;j<3;j++)sign([['FALL','FESTIVAL'],['LIVE','MUSIC'],['PLAZA','NEWS']][j], .92+j*.39,1.24,12.454,.33,.59,['#e9c18b','#afbfbb','#c6a8c6'][j],'#645f66');
  const lampBulbs=[],lampLights=[],streetLamps=[];
  function lamp(x,z,dx,dz,label,sharedPole=false){
    const top=5.95,head=new T.Group();head.position.set(x+dx*1.12,5.87,z+dz*1.12);scene.add(head);
    const target=new T.Vector3(x+dx*3.60,.055,z+dz*3.60),direction=target.clone().sub(head.position).normalize();
    // A shielded underside lens and its real light share the same downward aiming direction.
    head.quaternion.setFromUnitVectors(new T.Vector3(0,-1,0),direction);head.rotateY(Math.atan2(dx,dz));
    if(!sharedPole){cyl(x,(.18+top)/2,z,.063,top-.18,M.dark);cyl(x,.31,z,.16,.26,M.metal);
    box(x,.202,z,.28,.046,.28,M.dark,false);for(const xx of [-.095,.095])for(const zz of [-.095,.095])cyl(x+xx,.234,z+zz,.014,.016,M.metal);}
    rod([x,top-.45,z],[x,top,z],.06,M.dark);rod([x,top,z],[head.position.x,head.position.y,head.position.z],.048,M.dark);
    box(0,0,0,.42,.14,.88,M.dark,false,head);box(0,-.079,0,.35,.03,.73,M.metal,false,head);
    const bulb=box(0,-.102,0,.30,.015,.65,basic('#ffe0b4'),false,head);lampBulbs.push(bulb);if(!sharedPole)obstacle(x,z,.32,.32,scene,'streetlight: '+label);
    const l=new T.SpotLight(K.linear('#ffdeb5'),1.55,18,.98,.50,1.3);l.position.copy(head.position).addScaledVector(direction,.13);l.target.position.copy(target);scene.add(l,l.target);lampLights.push(l);
    streetLamps.push({x,z,dx,dz,label,sharedPole,head,bulb,light:l,target,direction});
  }
  // Staggered curbside positions cover the perimeter, crossings, shelter and compact junction.
  lamp(-18,22.65,0,-1,'southwest approach');lamp(-10.7,14.25,0,1,'plaza crossing');lamp(-.05,22.40,0,-1,'bus stop west');lamp(9.0,22.40,0,-1,'bus stop east');
  lamp(-18.55,-5.0,-1,0,'west north');lamp(-18.55,9.0,-1,0,'west south');
  lamp(-8.4,-13.30,0,-1,'north west');lamp(5.2,-13.30,0,-1,'north east');
  lamp(24.70,-9.0,-1,0,'east north');lamp(24.70,5.0,-1,0,'east south');
  lamp(24.8,22.65,-Math.SQRT1_2,-Math.SQRT1_2,'junction southeast',true);lamp(15.0,23.4,1,0,'junction south');
  lamp(-18.5,-13.2,-Math.SQRT1_2,-Math.SQRT1_2,'northwest corner',true);lamp(16.7,-13.2,Math.SQRT1_2,-Math.SQRT1_2,'northeast corner',true);
  lamp(16.5,12.4,Math.SQRT1_2,Math.SQRT1_2,'junction north',true);
  function pole(x,z){cyl(x,3.9,z,.115,7.65,mat('#899692'));cyl(x,.90,z,.13,1.43,M.dark);box(x,7.1,z,1.8,.12,.12,M.dark);for(const dx of [-.7,0,.7]){cyl(x+dx,7.24,z,.09,.19,M.white);cyl(x+dx,7.39,z,.075,.09,M.metal);}cyl(x+.25,6.42,z,.28,.72,M.metal);obstacle(x,z,.28,.28);for(let j=0;j<6;j++)box(x,.5+j*.18,z+.138,.16,.09,.012,j%2?M.dark:M.yellow,false);}
  const poles=[[-18.5,-13.2],[16.7,-13.2],[16.40,8.95],[-18.45,13.85]];poles.forEach(p=>pole(...p));
  for(let n=0;n<4;n++){const a=poles[n],b=poles[(n+1)%4];for(let k=0;k<3;k++)wire([[a[0]+k*.13,7.43,a[1]],[(a[0]+b[0])/2,6.14-k*.1,(a[1]+b[1])/2],[b[0]+k*.13,7.43,b[1]]],.019);}
  sign(['AME WAY','JAPANESE PLAZA'],16.44,3.7,9.10,1.30,.38,'#4b8295');
  function guard(x,z,len,rot=0){const g=new T.Group();g.position.set(x,.18,z);g.rotation.y=rot;scene.add(g);for(const dx of [-len/2,len/2])cyl(dx,.48,0,.044,.96,M.white,g);rod([-len/2,.91,0],[len/2,.91,0],.045,M.white,g);rod([-len/2,.5,0],[len/2,.5,0],.034,M.white,g);obstacle(0,0,len,.10,g);}
  guard(-3.9,14.8,1.7);guard(-9,14.8,1.7);guard(16.8,.1,1.4,Math.PI/2);
  const transit=AME.buildTransit(K,scene);
  const traffic=AME.buildTraffic(K,scene,layout);
  return {parking,corner,utilityPoles:poles.map(([x,z])=>({x,z})),traffic,signals:traffic.heads,lampBulbs,lampLights,streetLamps,trees,benches,directory,bicycles,transit,props:props.metadata};
};
