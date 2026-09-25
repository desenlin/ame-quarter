AME.buildFacade=function(K,s){
 const {T,M,box,cyl,ball,ring,rod,mesh,sign,surface,basic}=K,{w,d,kind}=s,f=d/2,g=s.group;
 const colors={mart:['#d9decf','#245e5b'],cafe:['#3e6272','#e7d9b5'],bakery:['#dfc79e','#825232'],books:['#544d66','#dfca96'],ramen:['#974f45','#f2dbb1'],florist:['#ded7ba','#3d7355']};
 const [panelColor,ink]=colors[kind],accent=surface(panelColor),letterMat=surface(ink,'matte',.09);
 box(0,3.46,f+.34,w+.40,.47,1.02,accent,true,g);box(0,3.75,f+.34,w+.54,.14,1.09,surface(s.roofColor,'wet'),true,g);
 box(0,3.175,f+.49,w*.87,.026,.20,basic('#ffe1a1'),false,g);
 if(kind==='cafe'){
  const near=f+.11,far=f+2.23,slope=.13,mid=(near+far)/2,awning=new T.Group();awning.position.set(0,3.10,mid);awning.rotation.x=slope;g.add(awning);
  const length=(far-near)/Math.cos(slope);box(0,0,0,w+.34,.075,length,surface('#527c81'),false,awning);
  for(let x=-w/2+.14;x<w/2;x+=.42)box(x,.042,0,.17,.012,length,surface('#b9c8b5'),false,awning);
  const frontY=3.10-Math.sin(slope)*length/2;box(0,frontY-.045,far,w+.4,.14,.11,M.metal,false,g);
  for(const x of [-w/2+.04,-.96,.96,w/2-.04]){rod([x,3.17,near],[x,frontY-.045,far-.05],.030,M.metal,g);rod([x,2.32,f+.06],[x,frontY-.08,far-.20],.031,M.metal,g);box(x,2.34,f+.078,.11,.22,.024,M.metal,false,g);}
  cyl(w/2+.10,1.56,f+.07,.04,2.77,M.metal,g);rod([w/2+.10,frontY-.03,far],[w/2+.10,2.89,f+.07],.043,M.metal,g);
  s.canopy={minX:-w/2-.17,maxX:w/2+.17,near,far,height:z=>3.10-(z-mid)*Math.tan(slope)};s.eave={z:far,y:frontY-.10,width:w+.32};
 }else if(kind==='bakery'){
  const awning=new T.Group();awning.position.set(0,3.17,f+.61);awning.rotation.x=.13;g.add(awning);box(0,0,0,w+.34,.13,.64,surface(s.color),false,awning);
  for(let x=-w/2+.12;x<w/2;x+=.40)box(x,-.004,.015,.16,.136,.62,surface(kind==='bakery'?'#dbc397':'#a9bebb'),false,awning);
 }
 if(kind==='mart'){box(0,3.67,f+.866,w+.41,.055,.02,basic('#3ca591'),false,g);box(0,3.21,f+.866,w+.41,.045,.02,basic('#dcab47'),false,g);sign('24 H',w*.39,3.46,f+.868,.66,.25,'#287970','#eee6cb',0,g);}
 function raisedName(txt,x,y,z,height,maxWidth){
  const cap=1493,total=[...txt].reduce((sum,c)=>sum+AME.lettering[c].advance,0),scale=Math.min(height/cap,maxWidth/total),path=new T.ShapePath();let cursor=-total*scale/2;
  for(const ch of txt){for(const c of AME.lettering[ch].commands){const q=[];for(let i=1;i<c.length;i+=2)q.push(c[i]*scale+cursor,c[i+1]*scale);if(c[0]==='M')path.moveTo(...q);else if(c[0]==='L')path.lineTo(...q);else if(c[0]==='Q')path.quadraticCurveTo(...q);else if(c[0]==='C')path.bezierCurveTo(...q);else if(c[0]==='Z')path.currentPath.closePath();}cursor+=AME.lettering[ch].advance*scale;}
  const geometry=new T.ExtrudeGeometry(path.toShapes(false),{depth:.045,bevelEnabled:true,bevelThickness:.003,bevelSize:.003,bevelSegments:1,curveSegments:5});const o=mesh(geometry,letterMat,x,y-cap*scale/2,z,1,1,1,g);o.name=s.id+' raised letters';s.raisedName=o;
 }
 raisedName(s.name,.25,3.49,f+.86,.29,w*.64);
 sign(s.jp+' · '+({mart:'CONVENIENCE',cafe:'COFFEE & CAKE',bakery:'FRESHLY BAKED',books:'BOOKS & STATIONERY',ramen:'NOODLES & SOUP',florist:'FLOWERS & GIFTS'})[kind],.25,3.274,f+.87,w*.60,.096,null,ink,0,g);
 const logo=new T.Group();logo.name=s.id+' sculpted logo';logo.position.set(-w*.35,3.44,f+.92);g.add(logo);s.logo=logo;
 const gold=surface('#c8a65d','metal'),white=surface('#e7dcc0','ceramic');
 if(kind==='cafe'){
  const profile=[new T.Vector2(.11,-.14),new T.Vector2(.15,-.11),new T.Vector2(.19,.13),new T.Vector2(.16,.13),new T.Vector2(.10,-.10)];mesh(new T.LatheGeometry(profile,18),white,0,0,0,1,1,1,logo);ring(.19,0,0,.085,white,logo);cyl(0,-.15,0,.23,.025,gold,logo);cyl(0,.095,0,.155,.009,surface('#564335'),logo);
 }else if(kind==='bakery'){
  const loaf=ball(0,0,0,.20,surface('#bd8546'),logo);loaf.scale.multiply(new T.Vector3(1.65,.65,.7));for(const x of [-.16,0,.16])rod([x-.025,.055,.14],[x+.035,.12,.12],.020,white,logo);
 }else if(kind==='books'){
  const shape=new T.Shape();shape.moveTo(.15,.23);shape.bezierCurveTo(-.30,.31,-.35,-.28,.15,-.24);shape.bezierCurveTo(-.12,-.1,-.12,.13,.15,.23);mesh(new T.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:false,curveSegments:14}),gold,0,0,0,1,1,1,logo);
  for(const side of [-1,1]){const page=box(side*.16,-.13,.035,.27,.13,.045,white,false,logo);page.rotation.z=side*.16;}
 }else if(kind==='ramen'){
  const profile=[new T.Vector2(.08,-.17),new T.Vector2(.14,-.12),new T.Vector2(.24,.08),new T.Vector2(.21,.09),new T.Vector2(.07,-.12)];mesh(new T.LatheGeometry(profile,18),white,0,0,0,1,1,1,logo);rod([-.22,.14,.02],[.25,.17,.02],.016,gold,logo);rod([-.22,.18,-.015],[.25,.21,-.015],.016,gold,logo);
 }else if(kind==='florist'){
  for(let i=0;i<6;i++){const a=i*Math.PI/3;const petal=ball(Math.cos(a)*.14,Math.sin(a)*.14,0,.105,surface('#c7919b'),logo);petal.scale.z*=.40;}ball(0,0,.04,.085,gold,logo);rod([0,-.13,0],[.01,-.31,0],.015,surface('#3c7355'),logo);
 }else{
  const drop=new T.Shape();drop.moveTo(0,.23);drop.bezierCurveTo(-.08,.08,-.22,-.08,-.11,-.19);drop.bezierCurveTo(.10,-.35,.27,-.09,0,.23);mesh(new T.ExtrudeGeometry(drop,{depth:.08,bevelEnabled:true,bevelSize:.012,bevelThickness:.01,bevelSegments:2}),surface('#3d9d92','ceramic'),0,0,0,1,1,1,logo);
 }
};
