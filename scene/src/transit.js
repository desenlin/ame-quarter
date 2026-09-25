/* A south-side bus stop, across the road from the plaza's recycling bins. */
AME.buildTransit=function(K,scene){
 const {T,M,box,cyl,rod,glass,sign,obstacle}=K;K.use(scene);
 const concrete=K.surface('#777c72','matte'),paver=K.surface('#8a8c7f','matte'),alt=K.surface('#838778','matte');
 const ramps=[{x:-6.5,z:21.8,nx:0,nz:1,w:2.75},{x:23.8,z:-2.9,nx:1,nz:0,w:2.74},
 {x:16.25,z:15.2,nx:0,nz:-1,w:1.60},{x:16.25,z:21.8,nx:0,nz:1,w:1.60},
 {x:25.0,z:15.2,nx:0,nz:-1,w:1.60},{x:25.0,z:21.8,nx:0,nz:1,w:1.60},
 {x:17.2,z:13.95,nx:-1,nz:0,w:1.60},{x:23.8,z:13.95,nx:1,nz:0,w:1.60},
 {x:17.2,z:25.0,nx:-1,nz:0,w:1.60},{x:23.8,z:25.0,nx:1,nz:0,w:1.60}];
 const cuts=ramps.map(r=>[r.x-(r.nx?.72:r.w/2),r.x+(r.nx?.72:r.w/2),r.z-(r.nz?.72:r.w/2),r.z+(r.nz?.72:r.w/2)]);
 function subtract(r,c){const [a,b,e,f]=r,[x,y,z,w]=c,lo=Math.max(a,x),hi=Math.min(b,y),near=Math.max(e,z),far=Math.min(f,w);if(lo>=hi||near>=far)return [r];return [[a,lo,e,f],[hi,b,e,f],[lo,hi,e,near],[lo,hi,far,f]].filter(q=>q[1]-q[0]>.005&&q[3]-q[2]>.005);}
 for(const rectangle of AME.layout.walks){let pieces=[rectangle];for(const cut of cuts)pieces=pieces.flatMap(r=>subtract(r,cut));for(const [a,b,c,d] of pieces){box((a+b)/2,.080,(c+d)/2,b-a,.16,d-c,concrete,false);for(let x=a;x<b-.01;x+=.66)for(let z=c;z<d-.01;z+=.66){const right=Math.min(b,x+.644),far=Math.min(d,z+.644);box((x+right)/2,.168,(z+far)/2,right-x,.019,far-z,(Math.round(x*10)+Math.round(z*10))%3?paver:alt,false);}}}
 // Curb segments omit ramp mouths on all four intersection corners.
 const curbs=[[-25.8,25.8,-20.8,-20.8],[-25.8,17.2,21.8,21.8],[23.8,25.8,21.8,21.8],[23.8,25.8,15.2,15.2],[23.8,23.8,-20.8,15.2],[23.8,23.8,21.8,25.8],[17.2,17.2,9.5,15.2],[17.2,17.2,21.8,25.8],[15.4,17.2,15.2,15.2]];
 for(const [a,b,c,d] of curbs){const horizontal=c===d;let intervals=[[horizontal?a:c,horizontal?b:d]];for(const r of ramps){if(Math.abs((horizontal?r.z:r.x)-(horizontal?c:a))>.02)continue;const center=horizontal?r.x:r.z,lo=center-r.w/2-.025,hi=center+r.w/2+.025;intervals=intervals.flatMap(([x,y])=>hi<=x||lo>=y?[[x,y]]:[[x,Math.min(y,lo)],[Math.max(x,hi),y]].filter(([l,h])=>h-l>.02));}for(const [lo,hi] of intervals)box(horizontal?(lo+hi)/2:a,.16,horizontal?c:(lo+hi)/2,horizontal?hi-lo:.16,.23,horizontal?.16:hi-lo,M.metal,false);}
 for(const r of ramps){const tangent=new T.Vector3(-r.nz,0,r.nx),normal=new T.Vector3(r.nx,0,r.nz),pts=[];for(const [side,t,y] of [[-1,-.22,.029],[1,-.22,.029],[1,.72,.178],[-1,.72,.178]])pts.push(r.x+t*r.nx+side*r.w/2*tangent.x,y,r.z+t*r.nz+side*r.w/2*tangent.z);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pts,3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();K.mesh(geo,K.surface('#989589','matte'),0,0,0);
  const x=r.x+.53*r.nx,z=r.z+.53*r.nz;box(x,.186,z,r.nx?.30:r.w-.12,.015,r.nz?.30:r.w-.12,K.surface('#bfa451','matte'),false);for(let t=-r.w/2+.14;t<r.w/2-.10;t+=.13)for(const n of [.44,.57])cyl(r.x+n*r.nx+t*tangent.x,.202,r.z+n*r.nz+t*tangent.z,.023,.012,K.surface('#c9af60','matte'));
 }
 const g=new T.Group();g.position.set(4.65,0,23.65);scene.add(g);g.name='Ame Quarter bus shelter';
 const frame=K.surface('#486970','metal'),roofMat=K.surface('#426b72','paint');
 for(const x of [-2.6,2.6])for(const z of [-.74,.85]){box(x,.20,z,.22,.055,.22,M.metal,false,g);box(x,1.56,z,.075,2.72,.075,frame,false,g);obstacle(x,z,.16,.16,g,'bus shelter post');}
 box(0,2.94,.01,5.65,.14,2.05,roofMat,false,g);box(0,2.84,-.93,5.63,.16,.10,frame,false,g);
 for(let x=-2.55;x<2.6;x+=.43)box(x,3.015,.01,.018,.024,2.00,M.metal,false,g);
 for(const x of [-1.93,-.64,.64,1.93]){glass(x,1.55,.86,1.20,2.37,0,g);box(x,1.02,.878,1.20,.055,.014,K.surface('#b5c8bf'),false,g);}obstacle(0,.86,5.2,.09,g,'bus shelter rear glazing');
 for(const x of [-2.6,2.6]){glass(x,1.56,.10,1.44,2.38,Math.PI/2,g);box(x,1.03,.1,.016,.055,1.42,K.surface('#b5c8bf'),false,g);obstacle(x,.1,.09,1.46,g,'bus shelter side glazing');}
 // Three seats face north, toward arriving buses; the eastern bay stays open.
 const seats=[];
 for(const x of [-1.75,-.93,-.11]){for(let j=0;j<4;j++)box(x,.66,.32+j*.115,.69,.055,.09,M.wood,false,g);for(const xx of [x-.25,x+.25]){rod([xx,.18,.32],[xx,.66,.32],.027,frame,g);rod([xx,.18,.68],[xx,1.30,.68],.027,frame,g);}for(const y of [.95,1.10,1.24])box(x,y,.69,.68,.095,.045,M.wood,false,g);obstacle(x,.5,.73,.68,g,'bus waiting seat');seats.push({x:x+4.65,z:24.15});}
 box(1.26,1.58,.805,.75,1.27,.065,frame,false,g);sign(['AME QUARTER','01  CENTRAL','02  RIVERSIDE','BUS INFORMATION'],1.26,1.58,.763,.64,1.10,'#e4dec9','#355b5c',Math.PI,g);
 sign('AME QUARTER  /  BUS STOP',0,2.84,-.991,3.43,.13,null,'#e7e2c9',Math.PI,g);
 cyl(1.45,1.84,22.26,.047,3.32,frame);box(1.45,3.26,22.26,.78,.79,.11,frame,false);sign(['BUS','01 · 02'],1.45,3.26,22.193,.68,.68,'#497c78','#eee4c6',Math.PI);obstacle(1.45,22.26,.18,.18,scene,'bus stop flag');
 box(0,2.82,.35,3.8,.025,.08,K.basic('#ebd8b3'),false,g);
 // Bus berth marking stays in the roadway, clear of the pedestrian crossing.
 for(const z of [18.91,21.45])for(let x=1.3;x<8;x+=.66)box(x,.047,z,.40,.014,.043,K.surface('#d9bd65','matte'),false);
 const roadLabel=sign('BUS',4.65,.060,20.17,1.46,.50,null,'#d9bd65');roadLabel.rotation.set(-Math.PI/2,0,-Math.PI/2);
 const trees=AME.buildBusTrees(K,scene);
 return {group:g,seats,ramps,trees,waiting:new T.Vector3(5.75,0,23.61),approach:new T.Vector3(4.65,0,22.39),crossing:new T.Vector3(-6.5,0,22.34),canopy:{minX:1.825,maxX:7.475,minZ:22.635,maxZ:24.685,y:3.02},southPavingY:.178};
};
