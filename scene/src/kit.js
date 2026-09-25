/* Reusable geometry, materials, furnishing and batching. */
AME.createKit = function(T, scene) {
  // Linear working colors; sRGB is applied once at the renderer output.
  const cache=new Map(), basicCache=new Map(),signCache=new Map(),reflective=[],planters=[],boards=[],signs=[],books=[],coffeeMachines=[];
  const linear=c=>new T.Color(c).convertSRGBToLinear();
  function surface(color,finish='paint',emission=0){
    const key=color+finish+emission;if(cache.has(key))return cache.get(key);
    const profiles={paint:[26,'#404044'],matte:[8,'#17191c'],metal:[90,'#8193a5'],wet:[80,'#465565'],wood:[24,'#594537'],ceramic:[65,'#829199']};
    const [shininess,specular]=profiles[finish]||profiles.paint;
    const m=new T.MeshPhongMaterial({color:linear(color),specular:linear(specular),shininess,emissive:linear(color),emissiveIntensity:emission});
    // Four broad diffuse bands preserve cel shading. Specular remains continuous and view-dependent.
    m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <lights_phong_pars_fragment>',T.ShaderChunk.lights_phong_pars_fragment.replace('vec3 irradiance = dotNL * directLight.color;', 'float bands = 0.10 + 0.29 * smoothstep(0.05,0.13,dotNL) + 0.32 * smoothstep(0.39,0.49,dotNL) + 0.29 * smoothstep(0.76,0.86,dotNL); vec3 irradiance = mix(dotNL,bands,0.65) * directLight.color;'));};
    m.customProgramCacheKey=()=> 'ame-cel-specular-v2';m.userData.finish=finish;
    if(['metal','wet','ceramic'].includes(finish)){reflective.push(m);m.combine=T.AddOperation;m.reflectivity=finish==='wet'?.23:.13;}
    cache.set(key,m);return m;
  }
  // Legacy glow values are deliberately capped: shelves and walls must respond to light.
  function mat(color,glow=.02){return surface(color,'paint',Math.min(.025,glow*.035));}
  function basic(color){if(!basicCache.has(color))basicCache.set(color,new T.MeshBasicMaterial({color:linear(color),toneMapped:false}));return basicCache.get(color);}
  const M={cream:surface('#e8d8b8','matte'),floor:surface('#decaa7','ceramic'),wood:surface('#a86f45','wood'),dark:surface('#253444','matte'),metal:surface('#8198a4','metal'),white:surface('#e6e8df','ceramic'),black:surface('#14202c','matte'),yellow:surface('#e8b844'),green:surface('#40866a','matte'),road:surface('#202f42','wet'),paving:surface('#566474','wet'),glass:new T.MeshPhongMaterial({color:linear('#c6e8ed'),transparent:true,opacity:.13,shininess:155,specular:linear('#d5e7ef'),depthWrite:false,side:T.DoubleSide,combine:T.AddOperation,reflectivity:.35})};
  reflective.push(M.glass);
  function texture(draw,w=256,h=256){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;tx.anisotropy=4;return tx;}
  // Shared atlas: only one texture/material for the complete range of printed packages.
  const atlas=texture((ctx,w,h)=>{const cs=['#cf455d','#daaa38','#368d8a','#3a6bba','#679534','#91519b','#df733c','#6655a2'];for(let n=0;n<8;n++){const x=n%4*128,y=Math.floor(n/4)*128;ctx.fillStyle=cs[n];ctx.fillRect(x,y,128,128);ctx.fillStyle='#f6e9cb';ctx.fillRect(x+7,y+12,114,27);ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.fillStyle='#263d49';ctx.fillText(['POTATO','BUTTER','GREEN TEA','SODA','MATCHA','BERRY','BISCUIT','COCOA'][n],x+64,y+32);ctx.fillStyle='#fff6df';ctx.beginPath();ctx.ellipse(x+64,y+76,31,23,-.3,0,Math.PI*2);ctx.fill();ctx.fillStyle=cs[(n+3)%8];ctx.beginPath();ctx.arc(x+64,y+76,13,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f7e7cb';for(let i=0;i<9;i++)ctx.fillRect(x+25+i*8,y+110,3,8);}},512,256);
  const labelMaterial=new T.MeshPhongMaterial({map:atlas,color:0xffffff,shininess:18,specular:linear('#242b32')});
  const labelGeometry=Array.from({length:8},(_,n)=>{const geo=new T.PlaneGeometry(1,1),uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(n%4+uv.getX(i))/4,(1-Math.floor(n/4)+uv.getY(i))/2);return geo;});
  const geom={plane:new T.PlaneGeometry(1,1),box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(1,1,1,12),ball:new T.SphereGeometry(1,10,7),ring:new T.TorusGeometry(1,.085,6,24)};
  const edges=new T.EdgesGeometry(geom.box),edgeMat=new T.LineBasicMaterial({color:linear('#142233'),transparent:true,opacity:.48});
  let parent=scene,seed=2616;const colliders=[];
  function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
  function use(p){parent=p;}
  function mesh(g,m,x,y,z,sx=1,sy=1,sz=1,p=parent){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=!m.transparent;o.receiveShadow=true;p.add(o);return o;}
  function box(x,y,z,w,h,d,m=M.cream,outline=true,p=parent){const o=mesh(geom.box,m,x,y,z,w,h,d,p);if(outline)o.add(new T.LineSegments(edges,edgeMat));return o;}
  function cyl(x,y,z,r,h,m=M.metal,p=parent){return mesh(geom.cyl,m,x,y,z,r,h,r,p);}
  function ball(x,y,z,r,m=M.green,p=parent){return mesh(geom.ball,m,x,y,z,r,r,r,p);}
  function ring(x,y,z,r,m=M.metal,p=parent){return mesh(geom.ring,m,x,y,z,r,r,r,p);}
  function rod(a,b,r,m=M.metal,p=parent){const aa=new T.Vector3(...a),bb=new T.Vector3(...b),v=bb.clone().sub(aa),o=cyl(0,0,0,r,v.length(),m,p);o.position.copy(aa.add(bb).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;}
  function wire(points,r=.023,m=M.black){const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(c,28,r,5,false),m,0,0,0);}
  function plane(x,y,z,w,h,m,rot=0,p=parent){const o=mesh(geom.plane,m,x,y,z,w,h,1,p);o.rotation.y=rot;o.castShadow=false;return o;}
  function textTexture(lines,bg,fg,w=768,h=192){
    const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');
    if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);}ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';
    const rows=Array.isArray(lines)?lines:[lines];let size=h/(rows.length*1.5);const font=n=>`500 ${n}px "Noto Sans JP",sans-serif`;
    ctx.font=font(size);const widest=Math.max(...rows.map(t=>ctx.measureText(t).width),1);size*=Math.min(1,w*.91/widest);ctx.font=font(size);
    rows.forEach((t,i)=>ctx.fillText(t,w/2,h*(i+.5)/rows.length));
    const tx=new T.CanvasTexture(c);tx.encoding=T.sRGBEncoding;tx.anisotropy=8;return tx;
  }
  function sign(txt,x,y,z,w,h,bg,fg='#fff0d4',rot=0,p=parent){
    const aspect=w/h,th=Math.max(8,Math.min(Math.max(32,Math.min(256,Math.round(h*300))),Math.round(2048/aspect))),tw=Math.max(8,Math.round(th*aspect));
    const key=JSON.stringify([txt,bg,fg,tw,th]);let m=signCache.get(key);
    if(!m){m=new T.MeshBasicMaterial({map:textTexture(txt,bg,fg,tw,th),transparent:!bg,side:T.FrontSide,toneMapped:false});signCache.set(key,m);}
    const o=plane(x,y,z,w,h,m,rot,p);o.userData.text=txt;signs.push({object:o,width:w,height:h,textureWidth:tw,textureHeight:th});return o;
  }

  function glass(x,y,z,w,h,rot=0,p=parent){return plane(x,y,z,w,h,M.glass,rot,p);}
  function obstacle(x,z,w,d,p=parent,label='furnishing'){p.updateWorldMatrix(true,false);const a=new T.Vector3(x,0,z).applyMatrix4(p.matrixWorld),q=new T.Quaternion();p.getWorldQuaternion(q);const e=new T.Euler().setFromQuaternion(q);const c=Math.abs(Math.cos(e.y)),s=Math.abs(Math.sin(e.y));colliders.push({x:a.x,z:a.z,w:w*c+d*s,d:w*s+d*c,label});}
  function solid(x,y,z,w,h,d,m=M.wood,p=parent){const o=box(x,y,z,w,h,d,m,true,p);obstacle(x,z,w,d,p);return o;}
  const colors=['#f77981','#eabc5f','#77cfc1','#769bde','#9fc76a','#dfb5e1','#f39e6d','#c5a5e7'];
  const packs=colors.map(c=>mat(c,.36));
  function pack(x,y,z,k=0,w=.15,h=.23){box(x,y+h/2,z,w,h,.12,packs[k%8],false);mesh(labelGeometry[k%8],labelMaterial,x,y+h/2,z+.061,w*.94,h*.94,1);}
  function bottle(x,y,z,k=0){cyl(x,y+.12,z,.055,.21,packs[k%8]);cyl(x,y+.245,z,.027,.05,M.white);box(x,y+.12,z+.052,.07,.08,.012,M.cream,false);}
  function shelf(x,z,w,kind='snacks',height=1.6){box(x,height/2+.17,z-.17,w,height,.055,M.wood);for(const side of [-1,1])box(x+side*(w/2-.028),height/2+.17,z+.07,.055,height,.54,M.metal);obstacle(x,z,w,.48);box(x,height+.17,z+.08,w+.10,.05,.6,M.wood);for(let s=0;s<4;s++){const y=.3+s*(height-.15)/4;box(x,y,z+.28,w+.1,.045,.52,M.wood);for(let j=0;j<Math.floor(w/.20);j++){const xx=x-w/2+.13+j*.20;if(kind==='books'){const style=(j+s*2)%7;
      if(style===3)continue;
      if(style===2){for(let k=0;k<3;k++){const bw=.31-k*.016,bd=.25+k*.02,yy=y+.025+k*.055;box(xx+.09,yy+.023,z+.31,bw,.045,bd,M.cream,false);for(const sy of [yy,yy+.047])box(xx+.09,sy,z+.31,bw+.01,.006,bd+.014,packs[(j+s+k)%8],false);books.push({style:'stack',width:bw,height:.052,depth:bd});}}
      else{const h=.24+rand()*.20,bw=.075+((j+s)%4)*.018,bd=.20+((j*2+s)%3)*.038,g=new T.Group();g.position.set(xx,y+.026,z+.31);g.rotation.z=style===5?.075:style===6?-.055:0;parent.add(g);box(0,h/2,0,bw,h,bd,M.cream,false,g);for(const side of [-1,1])box(side*(bw/2+.005),h/2,0,.010,h+.012,bd+.014,packs[(j+s*2)%8],false,g);box(0,h/2,bd/2+.01,bw+.02,h+.012,.018,packs[(j+s*2)%8],false,g);for(const yy of [.07,h-.065])box(0,yy,bd/2+.021,bw*.75,.012,.007,M.cream,false,g);books.push({style:style>=5?'leaning':'upright',width:bw,height:h,depth:bd});}}else if(kind==='bento'){box(xx,y+.09,z+.28,.18,.10,.25,M.dark,false);box(xx,y+.147,z+.30,.16,.015,.2,M.cream,false);ball(xx+.03,y+.165,z+.31,.035,M.green);}else if(kind==='coffee'||kind==='pantry'){box(xx,y+.19,z+.32,.16,.30,.15,kind==='coffee'?M.wood:M.cream,false);box(xx,y+.34,z+.32,.14,.018,.15,M.dark,false);sign(kind==='coffee'?'BEANS':'FLOUR',xx,y+.21,z+.399,.14,.060,kind==='coffee'?'#d0b68c':'#ad784d',kind==='coffee'?'#35494b':'#f5e6ca');}else if(kind==='flowers'){if((j+s)%2){cyl(xx,y+.19,z+.30,.074,.3,packs[(j+s)%8]);cyl(xx,y+.343,z+.30,.063,.016,M.dark);}else{cyl(xx,y+.14,z+.30,.08,.20,M.cream);cyl(xx,y+.248,z+.30,.085,.016,M.wood);}}else pack(xx,y+.04,z+.32,(j+s*3)%8);}
  box(x,y+.016,z+.56,w,.07,.025,kind==='snacks'||kind==='bento'?M.yellow:M.wood,false);}obstacle(x,z+.16,w+.10,.86);sign(({books:'BOOKS & LIFE',bento:'BENTO BOXES',coffee:'COFFEE BEANS',pantry:'BAKING PANTRY',flowers:'VASES & RIBBONS'})[kind]||'SNACKS',x,height+.24,z+.30,w*.65,.16,'#5d8d82');}
  function stool(x,z,color='#bc8463'){cyl(x,.69,z,.24,.12,mat(color));cyl(x,.39,z,.045,.52,M.metal);cyl(x,.18,z,.25,.04,M.dark);obstacle(x,z,.48,.48);}
  function cup(x,y,z){cyl(x,y+.075,z,.075,.15,M.cream);ring(x+.087,y+.08,z,.045,M.cream);cyl(x,y+.155,z,.065,.004,mat('#60442f'));}
  function coffeeMachine(x,z,base=1.35){
    const g=new T.Group();g.position.set(x,base,z);g.name='Counter-supported coffee maker';parent.add(g);
    for(const xx of [-.25,.25])for(const zz of [-.27,.27])box(xx,.022,zz,.065,.044,.065,M.dark,false,g);
    box(0,.060,0,.61,.032,.65,M.metal,false,g);box(0,.41,-.115,.58,.66,.37,M.dark,true,g);
    box(0,.65,.079,.45,.10,.025,M.metal,false,g);box(0,.43,.083,.36,.24,.025,M.black,false,g);
    box(0,.093,.19,.56,.025,.29,M.metal,false,g);for(let j=0;j<6;j++)box(-.22+j*.088,.108,.19,.012,.009,.23,M.dark,false,g);
    sign('COFFEE',0,.64,.096,.40,.072,null,'#e6deca',0,g);cyl(0,.81,-.12,.19,.14,surface('#78604b','ceramic'),g);cyl(0,.892,-.12,.20,.026,M.metal,g);
    cyl(0,.185,.21,.075,.15,M.cream,g);ring(.087,.19,.21,.045,M.cream,g);cyl(0,.264,.21,.065,.007,surface('#60442f'),g);
    coffeeMachines.push({object:g,x,z,base,width:.61,depth:.65});return g;
  }
  function flowerStem(x,base,z,height,kind='daisy',variant=0,size=1){
    const g=new T.Group();g.position.set(x,base,z);g.name=kind+' stem';parent.add(g);
    const bend=Math.sin(variant*2.3)*.045;rod([0,0,0],[bend,height,0],.009*size,M.green,g);
    for(const [side,level] of [[-1,.38],[1,.61]]){const leaf=ball(side*.061*size,height*level,0,.07*size,M.green,g);leaf.scale.multiply(new T.Vector3(1.4,.20,.42));leaf.rotation.z=side*.35;rod([bend*level,height*level,0],[side*.064*size,height*level,0],.007,M.green,g);}
    const head=new T.Group();head.position.set(bend,height,0);head.rotation.x=.28;head.rotation.z=Math.sin(variant)*.17;g.add(head);
    const tone=kind==='rose'?['#b94f6e','#d98d91','#e1b28f'][variant%3]:kind==='tulip'?['#df766a','#eac981','#bba0cf'][variant%3]:kind==='lavender'?'#9b83bd':kind==='sunflower'?'#dfad42':variant%3===0?'#e8c1cd':'#eee2c8',petal=surface(tone,'matte');
    if(kind==='tulip'){
      for(let k=0;k<6;k++){const a=k*Math.PI/3,o=ball(Math.cos(a)*.032*size,.01,Math.sin(a)*.032*size,.055*size,petal,head);o.scale.multiply(new T.Vector3(.65,1.65,.65));o.rotation.z=-Math.cos(a)*.22;} 
    }else if(kind==='rose'){
      for(let row=0;row<3;row++)for(let k=0;k<7-row;k++){const a=k*2*Math.PI/(7-row)+row*.65,r=(.05-row*.014)*size,o=ball(Math.cos(a)*r,row*.025*size,Math.sin(a)*r,.048*size,petal,head);o.scale.multiply(new T.Vector3(1,.62,.70));o.rotation.y=-a;}
    }else if(kind==='lavender'){
      rod([0,-.05,0],[0,.22*size,0],.007,M.green,head);for(let row=0;row<7;row++)for(let k=0;k<3;k++){const a=k*2.094+row*.7,r=(.033-row*.003)*size,o=ball(Math.cos(a)*r,row*.029*size,Math.sin(a)*r,.029*size,petal,head);o.scale.y*=.65;}
    }else{
      const n=kind==='sunflower'?14:11,r=kind==='sunflower'?.09:.064;
      for(let k=0;k<n;k++){const a=k*2*Math.PI/n,o=ball(Math.cos(a)*r*size,0,Math.sin(a)*r*size,.055*size,petal,head);o.scale.multiply(new T.Vector3(1.10,.26,.37));o.rotation.y=-a;}
      const center=ball(0,.018*size,0,(kind==='sunflower'?.06:.028)*size,kind==='sunflower'?surface('#65462c','matte'):M.yellow,head);center.scale.y*=.35;
    }
    return g;
  }
  const soil=surface('#42392e','matte');
  const soilMap=texture((c,w,h)=>{c.fillStyle='#493c2c';c.fillRect(0,0,w,h);for(let i=0;i<950;i++){c.fillStyle=i%3?'#5b4a34':'#30291f';c.fillRect((i*61)%w,(i*97)%h,2+i%3,2);}},128,128);soil.map=soilMap;
  function plant(x,z,r=.35,flower=false,base=.17,register=true){
    const old=parent,g=new T.Group();g.position.set(x,base,z);old.add(g);parent=g;const h=.40;
    const profile=[new T.Vector2(r*.73,0),new T.Vector2(r*.78,.035),new T.Vector2(r,h),new T.Vector2(r*.84,h),new T.Vector2(r*.71,.065)];
    mesh(new T.LatheGeometry(profile,20),surface('#ad7960','matte'),0,0,0);
    const rim=ring(0,h,0,r*.92,M.cream);rim.rotation.x=Math.PI/2;rim.scale.z*=.6;
    const dirt=cyl(0,h-.038,0,r*.85,.025,soil);dirt.name='Recessed soil';
    for(let i=0;i<10;i++){const a=i*2.4,rr=r*.64*Math.sqrt(rand());const pebble=ball(Math.cos(a)*rr,h-.020,Math.sin(a)*rr,.014,mat(i%2?'#8c7860':'#665948'));pebble.scale.y*=.5;}
    const foliage=new T.Group();foliage.userData.dynamic=true;foliage.position.y=h-.02;g.add(foliage);parent=foliage;
    const species=flower?(typeof flower==='string'?flower:['daisy','tulip','rose','lavender','sunflower'][planters.length%5]):null;
    if(species){const count=species==='sunflower'?4:species==='lavender'?11:7;for(let j=0;j<count;j++){const a=j*2.4,rr=r*.60*Math.sqrt((j+.5)/count),height=(species==='sunflower'?.67:species==='lavender'?.42:.35)+(j%3)*.065;flowerStem(Math.cos(a)*rr,h-.02,Math.sin(a)*rr,height,species,j,Math.max(.80,r*2.75));}}
    else for(let j=0;j<9;j++){const xx=(rand()-.5)*r*1.5,zz=(rand()-.5)*r*1.5,yy=h+.23+rand()*.32;rod([0,h-.02,0],[xx,yy,zz],.012,M.green);const leaf=ball(xx,yy-.12,zz,r*.39,mat(j%2?'#47886d':'#73a779'));leaf.scale.multiply(new T.Vector3(1,.30,1.5));}
    for(const child of foliage.children)child.position.y-=h-.02;
    parent=old;if(register)obstacle(x,z,r*2,r*2,old,'planter');planters.push({object:g,foliage,species,exposure:old===scene||z>2.9?1:.07,base,soilHeight:base+h-.025,rimHeight:base+h,r});return g;
  }

  function bench(x,z,angle=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=angle;parent.add(g);for(let n=0;n<4;n++){box(0,.62,-.23+n*.15,1.8,.075,.12,M.wood,true,g);box(0,.93+n*.13,-.30,1.8,.09,.065,M.wood,true,g);}for(const a of [-.68,.68]){rod([a,.18,-.3],[a,1.32,-.3],.04,M.metal,g);rod([a,.18,.28],[a,.64,.28],.04,M.metal,g);}obstacle(0,0,1.8,.7,g);g.userData.approach=new T.Vector3(0,0,1.0).applyAxisAngle(new T.Vector3(0,1,0),angle).add(new T.Vector3(x,0,z));return g;}
  function lantern(x,y,z,color='#ff9a73'){const o=ball(x,y,z,.30,basic(color));o.scale.y*=1.35;for(let i=0;i<6;i++){const a=ring(x,y-.3+i*.12,z,.29,mat('#b3624e'));a.rotation.x=Math.PI/2;}cyl(x,y+.42,z,.12,.045,M.dark);cyl(x,y-.42,z,.12,.045,M.dark);rod([x,y+.45,z],[x,y+.72,z],.015,M.dark);return o;}
  function board(x,z,txt,bg='#365653'){
    const g=new T.Group();g.position.set(x,.17,z);parent.add(g);g.name='Two-sided public A-board';
    for(const side of [-1,1]){const panel=new T.Group();panel.position.set(0,.67,side*.145);panel.rotation.y=side<0?Math.PI:0;panel.rotateX(-.24);g.add(panel);
      box(0,0,0,.82,1.09,.055,M.wood,true,panel);sign(txt,0,.03,.035,.68,.89,bg,'#fff1d0',0,panel);
      for(const xx of [-.35,.35])box(xx,-.59,0,.055,.18,.06,M.wood,false,panel);
    }
    rod([-.43,1.21,0],[.43,1.21,0],.022,M.metal,g);for(const xx of [-.31,.31])rod([xx,.50,-.22],[xx,.50,.22],.012,M.metal,g);
    obstacle(0,0,.86,.70,g,'A-board');boards.push(g);return g;
  }

  function ac(x,z,rot=0){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rot;parent.add(g);box(0,.7,0,1.1,.8,.52,M.white,true,g);ring(0,.7,.28,.29,M.metal,g);for(let i=0;i<7;i++)box(0,.48+i*.075,.295,.72,.018,.025,M.metal,false,g);obstacle(0,0,1.1,.55,g);}
  function batchRoof(root){
    root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert(),groups=new Map(),lines=[],remove=[];
    root.traverse(o=>{if(o===root||o.isInstancedMesh)return;if(o.isLineSegments&&o.geometry===edges){const matrix=inverse.clone().multiply(o.matrixWorld),pos=o.geometry.attributes.position;for(let i=0;i<pos.count;i++){const v=new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(matrix);lines.push(v.x,v.y,v.z);}remove.push(o);}
      else if(o.isMesh&&!o.material.transparent){const key=o.geometry.uuid+o.material.uuid;if(!groups.has(key))groups.set(key,{geo:o.geometry,mat:o.material,matrices:[]});groups.get(key).matrices.push(inverse.clone().multiply(o.matrixWorld));remove.push(o);}});
    remove.forEach(o=>o.parent&&o.parent.remove(o));for(const g of groups.values()){const o=new T.InstancedMesh(g.geo,g.mat,g.matrices.length);g.matrices.forEach((m,i)=>o.setMatrixAt(i,m));o.castShadow=o.receiveShadow=true;root.add(o);}if(lines.length){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(lines,3));root.add(new T.LineSegments(g,edgeMat));}
  }
  function batchStatic(){scene.updateMatrixWorld(true);const groups=new Map(),linePositions=[];const toRemove=[];scene.traverse(o=>{let animated=false;for(let p=o;p;p=p.parent)if(p.userData.dynamic)animated=true;if(animated||o.isReflector)return;if(o.isLineSegments&&o.geometry===edges){const pos=o.geometry.attributes.position;for(let i=0;i<pos.count;i++){const v=new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);linePositions.push(v.x,v.y,v.z);}toRemove.push(o);}
  else if(o.isMesh&&!o.material.transparent&&[...Object.values(geom),...labelGeometry].includes(o.geometry)){const key=o.geometry.uuid+o.material.uuid;if(!groups.has(key))groups.set(key,{geo:o.geometry,mat:o.material,matrices:[]});groups.get(key).matrices.push(o.matrixWorld.clone());toRemove.push(o);}});
  for(const o of toRemove)if(o.parent)o.parent.remove(o);for(const g of groups.values()){const o=new T.InstancedMesh(g.geo,g.mat,g.matrices.length);g.matrices.forEach((m,i)=>o.setMatrixAt(i,m));o.castShadow=true;o.receiveShadow=true;scene.add(o);}if(linePositions.length){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(linePositions,3));scene.add(new T.LineSegments(g,edgeMat));}return groups.size;}
  return {T,M,mat,surface,linear,texture,reflective,basic,use,mesh,box,cyl,ball,ring,rod,wire,plane,sign,glass,obstacle,solid,rand,pack,bottle,shelf,stool,cup,coffeeMachine,flowerStem,plant,bench,lantern,board,ac,colliders,planters,boards,signs,books,coffeeMachines,soil,batchRoof,batchStatic,packs};
};
