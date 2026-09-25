/* Maple silhouettes, rooted foliage sway, intermittent leaf fall and warm exhaust. */
AME.buildMaples=function(K,scene){
 const {T,M,mesh,rod,cyl,rand,surface}=K,shape=new T.Shape();
 const outline=[[0,-.51],[-.035,-.19],[-.31,-.25],[-.23,-.09],[-.51,.02],[-.40,.08],[-.55,.31],[-.30,.23],[-.32,.43],[-.16,.28],[-.18,.57],[-.07,.49],[0,.82],[.07,.49],[.18,.57],[.16,.28],[.32,.43],[.30,.23],[.55,.31],[.40,.08],[.51,.02],[.23,-.09],[.31,-.25],[.035,-.19]];
 outline.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 const leafGeometry=new T.ShapeGeometry(shape),p=leafGeometry.attributes.position;
 for(let i=0;i<p.count;i++)p.setZ(i,.09*Math.abs(p.getX(i))+.012*Math.sin(p.getY(i)*9));leafGeometry.computeVertexNormals();
 const colors=['#d87628','#b65322','#e38a36','#c86522','#e4a24a'],materials=colors.map(c=>{const m=surface(c,'matte');m.side=T.DoubleSide;return m;});
 const trees=[],dummy=new T.Object3D(),bark=surface('#705241','matte');
 for(const [x,z,scale] of [[-1.15,7.45,1],[.95,7.45,.88]]){
  const root=new T.Group();root.position.set(x,.617,z);root.scale.setScalar(scale);scene.add(root);
  cyl(0,.77,0,.105,1.54,bark,root);for(let j=0;j<5;j++){const a=j*Math.PI*.4;rod([0,.13,0],[Math.cos(a)*.23,0,Math.sin(a)*.23],.046,bark,root);}
  const crown=new T.Group();crown.position.y=1.22;crown.userData.dynamic=true;root.add(crown);crown.name='Wind-swept pumpkin maple';
  rod([0,0,0],[.04,1.74,0],.074,bark,crown);
  const branchTips=[];
  for(let j=0;j<11;j++){const a=j*2.399,r=.64+(j%3)*.18,y=.62+(j%4)*.27,tip=[Math.cos(a)*r,y,Math.sin(a)*r];branchTips.push(new T.Vector3(...tip));rod([0,.18+j*.05,0],tip,.036,bark,crown);
   for(let k=0;k<3;k++){const b=a+(k-1)*.52;rod(tip,[tip[0]+Math.cos(b)*.37,tip[1]+.24,tip[2]+Math.sin(b)*.37],.013,bark,crown);}}
  for(let color=0;color<materials.length;color++){
   const leaves=new T.InstancedMesh(leafGeometry,materials[color],190);leaves.castShadow=leaves.receiveShadow=true;
   for(let j=0;j<190;j++){const tip=branchTips[(j+color*3)%branchTips.length],a=rand()*Math.PI*2,r=Math.sqrt(rand())*.56;
    dummy.position.set(tip.x+Math.cos(a)*r,tip.y+.04+(rand()-.25)*.70,tip.z+Math.sin(a)*r);dummy.rotation.set(-.5-rand()*1.8,rand()*6.28,rand()*6.28);dummy.scale.setScalar(.20+rand()*.12);dummy.updateMatrix();leaves.setMatrixAt(j,dummy.matrix);}
   crown.add(leaves);
  }
  K.batchRoof(crown);K.obstacle(x,z,.28,.28,scene,'maple trunk');trees.push({root,crown,x,z,scale,phase:trees.length*1.9});
 }
 const litter=[];
 for(let i=0;i<46;i++){const x=-2.27+rand()*3.94,z=5.88+rand()*2.99,o=mesh(leafGeometry,materials[i%5],x,.637,z);o.rotation.set(-Math.PI/2,0,rand()*6.28);o.scale.setScalar(.15+rand()*.12);o.castShadow=false;litter.push(o);}
 return {items:trees,leafGeometry,materials,litter,soilY:.636,bounds:{minX:-2.25,maxX:1.65,minZ:5.88,maxZ:8.87}};
};

AME.createLife=function(K,scene,shops,street){
 const {T}=K,trees=street.trees,falling=[],exhausts=[];
 for(let i=0;i<8;i++){
  const tree=trees.items[i%2],a=i*2.399,land=new T.Vector3(Math.max(trees.bounds.minX,Math.min(trees.bounds.maxX,tree.x+Math.cos(a)*.66+.18)),trees.soilY,tree.z+Math.sin(a)*.70);
  const start=new T.Vector3(tree.x+Math.cos(a)*.56,tree.root.position.y+tree.scale*(2.05+(i%3)*.26),tree.z+Math.sin(a)*.56);
  const o=K.mesh(trees.leafGeometry,trees.materials[i%5],...start.toArray());o.scale.setScalar(.21);o.userData.dynamic=true;o.castShadow=false;
  falling.push({object:o,start,land,duration:5.2+(i%3)*.5,offset:i*2.65,period:24,spin:i*.9});
 }
 const steamMap=K.texture((ctx,w,h)=>{const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.48);g.addColorStop(0,'rgba(225,230,225,.75)');g.addColorStop(.28,'rgba(225,230,225,.55)');g.addColorStop(.65,'rgba(225,230,225,.18)');g.addColorStop(1,'rgba(225,230,225,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);},64,64);
 for(const shop of shops.filter(s=>s.exhaust)){
  const source=shop.world(shop.exhaust.x,shop.exhaust.z);source.y=shop.exhaust.y;const plume=new T.Group();plume.userData.dynamic=true;plume.name=shop.id+' warm exhaust';scene.add(plume);const puffs=[];
  for(let i=0;i<15;i++){const material=new T.MeshBasicMaterial({map:steamMap,color:K.linear('#dae0da'),transparent:true,opacity:.18,depthWrite:false,side:T.DoubleSide,toneMapped:false});const o=K.mesh(new T.PlaneGeometry(1,1),material,0,0,0,1,1,1,plume);o.castShadow=o.receiveShadow=false;o.onBeforeRender=(r,sc,c)=>{o.quaternion.copy(c.quaternion);o.updateMatrixWorld();};puffs.push(o);}
  exhausts.push({shop,source,plume,puffs,phase:shop.kind==='bakery'?.36:0,opacity:shop.kind==='bakery'?.25:.34});
 }
 function update(time,camera){
  const gust=.65+.35*Math.sin(time*.37),wx=Math.sin(time*.82)*gust,wz=Math.sin(time*.59+.7)*gust;
  for(const tree of trees.items){tree.crown.rotation.z=wx*.028+Math.sin(time*1.27+tree.phase)*.012;tree.crown.rotation.x=wz*.018;}
  for(let i=0;i<K.planters.length;i++){const p=K.planters[i];p.foliage.rotation.z=(wx*.042+Math.sin(time*1.65+i*1.7)*.022)*p.exposure;p.foliage.rotation.x=(wz*.022+Math.cos(time*1.18+i)*.012)*p.exposure;}
  for(const tree of K.streetTrees||[]){tree.crown.rotation.z=wx*.019;tree.crown.rotation.x=wz*.012;}
  for(let i=0;i<(K.vines||[]).length;i++){K.vines[i].rotation.z=wx*.014+Math.sin(time*1.4+i)*.008;}
  for(const leaf of falling){const age=(time+leaf.offset)%leaf.period,o=leaf.object;o.visible=age<leaf.duration+10;const t=Math.min(1,age/leaf.duration);o.position.lerpVectors(leaf.start,leaf.land,t);o.position.x+=Math.sin(age*2.3+leaf.spin)*.14*Math.sin(Math.PI*t);o.position.z+=Math.cos(age*1.8+leaf.spin)*.12*Math.sin(Math.PI*t);
   if(t<1)o.rotation.set(-Math.PI/2+Math.sin(age*3+leaf.spin)*.75,age*.7+leaf.spin,age*1.3);else o.rotation.set(-Math.PI/2,0,leaf.spin);
  }
  for(const e of exhausts){e.plume.visible=e.shop.roof.visible;for(let i=0;i<e.puffs.length;i++){const t=((time*.23+i/e.puffs.length+e.phase)%1),o=e.puffs[i],size=.26+t*1.02;o.position.set(e.source.x+t*t*1.5+Math.sin(time*.8+i)*.06*t,e.source.y+.08+t*2.65,e.source.z+t*t*.46);o.scale.set(size,size*1.2,1);o.material.opacity=e.opacity*Math.sin(Math.PI*t)*Math.pow(1-t,.45);if(camera)o.quaternion.copy(camera.quaternion);}}
 }
 const primary=exhausts.find(e=>e.shop.kind==='ramen');update(0);return {update,falling,exhausts,puffs:primary.puffs,plume:primary.plume,source:primary.source};
};

/* Two narrow ginkgo-like street trees frame the shelter without closing storefront sightlines. */
AME.buildBusTrees=function(K,scene){
 const {T,M,box,cyl,rod,mesh}=K;K.use(scene);const trees=[];
 const leaf=new T.Shape();leaf.moveTo(0,-.11);leaf.lineTo(-.17,.03);leaf.quadraticCurveTo(-.13,.19,0,.14);leaf.quadraticCurveTo(.13,.19,.17,.03);leaf.lineTo(0,-.11);const geo=new T.ShapeGeometry(leaf),gold=K.surface('#c2a84c','matte'),olive=K.surface('#a6a552','matte');gold.side=olive.side=T.DoubleSide;
 for(const [i,x] of [-1.5,10.25].entries()){
  const z=24.40,planter=K.surface('#697e75','matte');box(x,.405,z,1.04,.45,1.04,planter,false);box(x,.635,z,.92,.025,.92,K.soil,false);for(const side of [-1,1]){box(x+side*.49,.67,z,.06,.10,1.04,planter,false);box(x,.67,z+side*.49,.98,.10,.06,planter,false);}K.obstacle(x,z,1.05,1.05,scene,'bus-stop tree planter');
  cyl(x,1.86,z,.065,2.46,M.wood);const crown=new T.Group();crown.position.set(x,2.75,z);crown.userData.dynamic=true;scene.add(crown);
  for(let branch=0;branch<7;branch++){const a=branch*2.4,y=.1+branch*.13,xx=Math.cos(a)*.45,zz=Math.sin(a)*.45;rod([0,-.15,0],[xx,y+.68,zz],.021,M.wood,crown);for(let k=0;k<17;k++){const t=k/17*2*Math.PI,rr=.15+K.rand()*.2;const o=mesh(geo,k%3?gold:olive,xx*.7+Math.cos(t)*rr,y+.35+K.rand()*.52,zz*.7+Math.sin(t)*rr,.69,.69,.69,crown);o.rotation.set(-.7+K.rand()*1.4,K.rand()*6.28,K.rand()*.9);}}
  K.batchRoof(crown);trees.push({x,z,crown,soilTop:.6475,rimTop:.72});
 }
 K.streetTrees=trees;return trees;
};
