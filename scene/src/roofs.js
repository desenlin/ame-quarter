/* Roof surfaces, drainage and the restaurant's continuous extraction duct. */
AME.buildRoof=function(K,s,roof){
 const {T,M,box,cyl,rod,mesh,surface,basic}=K,{w,d,kind}=s;
 const finish=surface(s.roofColor,'wet'),edge=surface('#536371','metal');s.roofSurfaces=[];
 function hip(cx,cz,width,depth,eave,rise){
  const a=width/2,b=depth/2,inset=Math.min(a,b)*.78,ridge=a-inset;
  const A=[cx-a,eave,cz-b],B=[cx+a,eave,cz-b],C=[cx+a,eave,cz+b],D=[cx-a,eave,cz+b],L=[cx-ridge,eave+rise,cz],R=[cx+ridge,eave+rise,cz];
  const pos=[];function tri(a,b,c){const n=new T.Vector3().subVectors(new T.Vector3(...b),new T.Vector3(...a)).cross(new T.Vector3().subVectors(new T.Vector3(...c),new T.Vector3(...a)));pos.push(...a,...(n.y<0?c:b),...(n.y<0?b:c));}
  tri(A,B,R);tri(A,R,L);tri(B,C,R);tri(C,D,L);tri(C,L,R);tri(D,A,L);
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.computeVertexNormals();mesh(geo,finish,0,0,0,1,1,1,roof);
  box(cx,eave-.12,cz,width,.24,depth,edge,false,roof);
  for(const [a,b] of [[A,L],[B,R],[C,R],[D,L],[L,R]])rod(a.map((v,i)=>v+(i===1?.038:0)),b.map((v,i)=>v+(i===1?.038:0)),.045,edge,roof);
  // Tile courses follow all four slopes, including the narrowing hip faces.
  for(let row=1;row<9;row++){const t=row/9,x0=cx-a+inset*t,x1=cx+a-inset*t,z0=cz-b+b*t,z1=cz+b-b*t,y=eave+rise*t+.012;
   for(const [p,q]of [[[x0,y,z0],[x1,y,z0]],[[x0,y,z1],[x1,y,z1]],[[x0,y,z0],[x0,y,z1]],[[x1,y,z0],[x1,y,z1]]])rod(p,q,.011,edge,roof);
  }
  for(const z of [cz-b,cz+b])box(cx,eave-.018,z,width+.10,.07,.09,M.metal,false,roof);
  const spec={type:'hip',cx,cz,width,depth,eave,rise,height(x,z){return eave+rise*Math.max(0,Math.min(1,(a-Math.abs(x-cx))/inset,(b-Math.abs(z-cz))/b));}};s.roofSurfaces.push(spec);return spec;
 }
 const mainHip=kind==='bakery'||kind==='florist';
 if(mainHip){hip(0,0,w+.48,d+.50,3.91,kind==='bakery'?1.35:1.18);s.roofType='hip';}
 else{
  box(0,3.83,0,w+.35,.20,d+.42,finish,true,roof);s.roofType='flat';
  for(let x=-w/2+.3;x<w/2;x+=.65)box(x,3.941,0,.018,.018,d+.2,edge,false,roof);
  for(const z of [-d/2-.18,d/2+.18])box(0,4.0,z,w+.42,.14,.075,edge,false,roof);
  s.roofSurfaces.push({type:'flat',cx:0,cz:0,width:w+.35,depth:d+.42,height:()=>3.95});
 }
 if(kind==='mart'||kind==='cafe'){
  const x=kind==='mart'?-w*.26:w*.32;box(x,4.18,-d*.25,1.35,.46,.96,M.metal,true,roof);
  for(let i=0;i<8;i++)box(x-.56+i*.16,4.421,-d*.25,.04,.022,.78,M.dark,false,roof);
 }
 if(kind==='cafe'||kind==='books'){
  const wall=surface(s.wall),cx=-w*.20,cz=-.8,ww=w*.59,dd=d*.63;
  box(cx,4.8,cz,ww,1.65,dd,wall,true,roof);
  for(const x of [-w*.37,-w*.08]){box(x,4.90,dd/2-.79,.97,.92,.045,M.dark,true,roof);box(x,4.90,dd/2-.76,.84,.8,.018,basic('#ecc394'),false,roof);box(x,4.9,dd/2-.745,.036,.82,.025,M.wood,false,roof);}
  for(const x of [-w*.37,-w*.08]){box(x,4.90,cz-dd/2-.027,.97,.92,.045,M.dark,false,roof);box(x,4.90,cz-dd/2-.057,.84,.8,.018,basic('#c8b891'),false,roof);box(x,4.90,cz-dd/2-.073,.036,.82,.025,M.wood,false,roof);}
  if(kind==='books'){hip(cx,cz,ww+.42,dd+.42,5.68,.94);s.roofType='upper-hip';}
  else{box(cx,5.66,cz,ww+.35,.18,dd+.35,finish,true,roof);for(const z of [cz-dd/2-.14,cz+dd/2+.14])box(cx,5.80,z,ww+.38,.14,.07,edge,false,roof);s.roofSurfaces.push({type:'flat',cx,cz,width:ww+.35,depth:dd+.35,height:()=>5.84});}
 }
 for(const x of [-w/2+.08,w/2-.08]){cyl(x,1.97,-d/2-.24,.046,3.59,M.metal,s.group);rod([x,3.82,-d/2-.24],[x,3.88,-d/2-.12],.048,M.metal,roof);}
 if(kind==='ramen'){
  // Directly aligned with the hood and duct below: no disconnected roof vent.
  const x=1.9,z=-2.88;box(x,3.97,z,.76,.09,.72,edge,false,roof);box(x,4.30,z,.54,.77,.48,M.metal,true,roof);
  cyl(x,4.79,z,.235,.28,M.metal,roof);cyl(x,4.939,z,.206,.009,M.black,roof);
  const lip=K.ring(x,4.95,z,.23,M.metal,roof);lip.rotation.x=Math.PI/2;
  s.exhaust={x,y:4.96,z,radius:.21};
 }else if(kind==='bakery'){
  const x=-1.5,z=-2.94;box(x,2.65,z,3.82,.22,.83,M.metal,true,s.group);cyl(x,3.25,z,.17,.99,M.metal,s.group);cyl(x,4.65,z,.17,1.91,M.metal,roof);
  const positions=[];for(const [dx,dz]of [[-.34,-.33],[.34,-.33],[.34,.33],[-.34,.33]])positions.push(x+dx,s.roofSurfaces[0].height(x+dx,z+dz)+.025,z+dz);
  const flashing=new T.BufferGeometry();flashing.setAttribute('position',new T.Float32BufferAttribute(positions,3));flashing.setIndex([0,2,1,0,3,2]);flashing.computeVertexNormals();mesh(flashing,edge,0,0,0,1,1,1,roof);
  cyl(x,5.60,z,.215,.10,M.metal,roof);cyl(x,5.652,z,.17,.01,M.black,roof);const rim=K.ring(x,5.66,z,.195,M.metal,roof);rim.rotation.x=Math.PI/2;
  s.exhaust={x,y:5.67,z,radius:.17};
 }else if(!mainHip){cyl(w*.31,4.1,d*.15,.14,.30,M.metal,roof);cyl(w*.31,4.27,d*.15,.23,.07,M.dark,roof);}
 s.coverHeight=function(x,z){let h=0;for(const r of s.roofSurfaces)if(Math.abs(x-r.cx)<=r.width/2&&Math.abs(z-r.cz)<=r.depth/2)h=Math.max(h,r.height(x,z));return h;};
};
