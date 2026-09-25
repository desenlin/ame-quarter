/* Four-way intersection with right-hand approaches and independently animated U.S.-style heads. */
AME.buildTraffic=function(K,scene,layout){
 const {T,M,box,cyl,ball,rod,sign,obstacle}=K;K.use(scene);
 const heads=[],beacons=[],poles=[],arrows=[],stopBars=[],colors=['#69e9b7','#ffd057','#ff695f'],off=['#193e37','#4a401f','#4a2930'];
 function post(x,z,height,label){cyl(x,height/2+.18,z,.072,height,M.dark);box(x,.21,z,.29,.08,.29,M.metal,false);obstacle(x,z,.30,.30,scene,label);poles.push({x,z,height,label});}
 function head(x,z,angle,axis,from,postX,postZ){
  const y=5.65,g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;g.userData.dynamic=true;g.name=axis+' traffic signal';scene.add(g);
  rod([postX,6.40,postZ],[x,6.40,z],.067,M.dark);rod([postX,5.80,postZ],[(postX+x)/2,6.40,(postZ+z)/2],.037,M.dark);
  box(0,0,0,.46,1.24,.28,M.dark,false,g);rod([0,.55,0],[0,.75,0],.037,M.dark,g);const lamps=[];
  for(let j=0;j<3;j++){const yy=-.36+j*.36,o=ball(0,yy,.174,.139,K.basic(off[j]),g);o.scale.z*=.42;box(0,yy+.145,.20,.30,.03,.25,M.dark,false,g);lamps.push(o);}
  heads.push({group:g,lamps,axis,state:0,from,normal:new T.Vector3(Math.sin(angle),0,Math.cos(angle))});
 }
 // The east/south roads end at the outer crossing edge; their incoming stop bars lie beyond this cutaway.
 // Far-side heads face the four incoming lanes. Every supporting mast stands on pavement.
 const corners=[[16.5,12.4],[24.8,12.4],[14.5,22.65],[24.8,22.65]];corners.forEach(([x,z])=>post(x,z,6.30,'traffic signal post'));
 head(24.8,20.15,-Math.PI/2,'east-west',new T.Vector3(10,0,20.15),24.8,22.65);
 head(16.5,16.85,Math.PI/2,'east-west',new T.Vector3(25.9,0,16.85),16.5,12.4);
 head(22.15,12.4,0,'north-south',new T.Vector3(22.15,0,25.9),24.8,12.4);
 head(18.85,22.65,Math.PI,'north-south',new T.Vector3(18.85,0,8),14.5,22.65);
 for(const [x,z,w,d] of [[14.70,20.15,.24,2.96],[18.85,12.35,2.96,.24]]){box(x,.047,z,w,.016,d,M.white,false);stopBars.push({x,z,w,d});}
 const crossings=[{id:'south',x:-6.5,z:18.5,axis:'z',min:15.2,max:21.8},{id:'east',x:20.5,z:-2.9,axis:'x',min:17.2,max:23.8}];
 const junctionCrossings=[{id:'west-arm',x:16.25,z:18.5,axis:'z',min:15.2,max:21.8},{id:'east-arm',x:25.0,z:18.5,axis:'z',min:15.2,max:21.8},{id:'north-arm',x:20.5,z:13.95,axis:'x',min:17.2,max:23.8},{id:'south-arm',x:20.5,z:25.0,axis:'x',min:17.2,max:23.8}];
 for(const c of junctionCrossings)for(let t=c.min+.25;t<c.max-.1;t+=.48)box(c.axis==='x'?t:c.x,.044,c.axis==='z'?t:c.z,c.axis==='x'?.27:1.6,.016,c.axis==='z'?.27:1.6,M.white,false);
 // Yellow separates opposing traffic; white crossing and stop markings stay clear of the center.
 const yellow=K.surface('#d4ae55','matte');
 function center(a,b,c,alongX,skip){for(let t=a;t<b;t+=.8){if(skip&&skip(t))continue;for(const side of [-1,1])box(alongX?t:c+side*.085,.038,alongX?c+side*.085:t,alongX?.78:.045,.012,alongX?.045:.78,yellow,false);}}
 center(-18,25.8,18.5,true,t=>Math.abs(t+6.5)<1.8||(t>14.9&&t<26.6));center(-13.5,25.8,20.5,false,t=>Math.abs(t+2.9)<1.8||(t>12.6&&t<26.6));center(-18,16,-17.5,true);center(-13,14,-22.5,false);
 function arrow(x,z,angle){const g=new T.Group();g.position.set(x,.045,z);g.rotation.y=angle;scene.add(g);box(0,0,.36,.16,.014,1.13,M.white,false,g);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([-.43,0,-.13,.43,0,-.13,0,0,-.83],3));geo.setIndex([0,1,2]);geo.computeVertexNormals();K.mesh(geo,M.white,0,0,0,1,1,1,g);arrows.push({x,z,dx:-Math.sin(angle),dz:-Math.cos(angle)});}
 for(const x of [-12,10]){arrow(x,16.85,Math.PI/2);arrow(x,20.15,-Math.PI/2);}
 for(const z of [6]){arrow(18.85,z,Math.PI);arrow(22.15,z,0);}
 arrow(-24.15,2,Math.PI);arrow(-20.85,2,0);arrow(0,-19.15,Math.PI/2);arrow(0,-15.85,-Math.PI/2);
 // Street names are readable from both public approaches.
 sign('AME WAY',24.8,4.25,22.73,1.27,.27,'#35655b','#eee8d7');sign('MAPLE AVE',24.8,4.25,12.48,1.43,.27,'#35655b','#eee8d7');
 function beacon(x,z,angle,crossing){post(x,z,3.38,'crossing beacon');
  // Two-sided yellow crossing board and paired lamps visible on both approaches.
  const g=new T.Group();g.position.set(x,2.65,z);g.rotation.y=angle;scene.add(g);box(0,0,0,.78,.82,.11,M.yellow,false,g);
  for(const side of [-1,1]){const front=new T.Group();front.rotation.y=side<0?Math.PI:0;g.add(front);
   // A small pedestrian symbol is built in the model, keeping the sign legible at street scale.
   ball(0,.20,.072,.063,M.dark,front);rod([0,.13,.077],[-.045,-.08,.077],.026,M.dark,front);rod([-.035,-.05,.077],[-.19,-.25,.077],.023,M.dark,front);rod([-.035,-.05,.077],[.14,-.24,.077],.023,M.dark,front);rod([-.01,.08,.077],[.18,-.025,.077],.022,M.dark,front);rod([-.01,.08,.077],[-.17,.01,.077],.022,M.dark,front);
   for(const xx of [-.20,0,.20])box(xx,-.32,.072,.13,.023,.016,M.dark,false,front);
  }
  const dynamic=new T.Group();dynamic.position.set(x,3.29,z);dynamic.rotation.y=angle;dynamic.userData.dynamic=true;scene.add(dynamic);const lamps=[];
  box(0,0,0,.98,.31,.19,M.dark,false,dynamic);
  for(const side of [-1,1])for(let j=0;j<2;j++){const bulb=ball(-.30+j*.60,0,side*.122,.109,K.basic('#ffca45'),dynamic);bulb.scale.z*=.45;lamps.push({object:bulb,index:j});}
  beacons.push({x,z,group:dynamic,lamps,crossing});
 }
 beacon(-8.30,14.43,Math.PI/2,crossings[0]);beacon(-4.67,22.62,Math.PI/2,crossings[0]);
 beacon(16.37,-4.65,0,crossings[1]);beacon(24.73,-1.04,0,crossings[1]);
 let time=0;function update(t){time=t;const phase=t%28,ew=phase<10?0:phase<12?1:2,ns=phase>=14&&phase<24?0:phase>=24&&phase<26?1:2;
  for(const h of heads){h.state=h.axis==='east-west'?ew:ns;h.lamps.forEach((lamp,j)=>lamp.material=K.basic(j===h.state?colors[j]:off[j]));}
  // Alternating amber pairs repeat once per second, at both ends of each zebra crossing.
  const flash=Math.floor(t*2)%2;for(const b of beacons)b.lamps.forEach(l=>l.object.material=K.basic(l.index===flash?'#ffce4f':'#59481f'));
 }
 update(0);return {heads,beacons,poles,arrows,stopBars,crossings,junctionCrossings,update,get time(){return time;},cycleSeconds:28};
};
