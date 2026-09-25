AME.createWeather=function(K,scene,renderer,shops,street){
  const {T,M,mat,basic,mesh,box,ball,rand}=K;K.use(scene);
  // Two height-correct transparent reflection layers. Road paint and parking paint remain above them.
  const mirrors=[];let profile='night';
  const inside=(r)=>`(world.x>=${r[0].toFixed(3)}&&world.x<=${r[1].toFixed(3)}&&world.z>=${r[2].toFixed(3)}&&world.z<=${r[3].toFixed(3)})`;
  const groundMask=AME.layout.ground.map(inside).join('||'),walkMask=AME.layout.walks.map(inside).join('||');
  const rampMask=(street.transit?.ramps||[]).map(r=>inside([r.x-(r.nx?.74:r.w/2),r.x+(r.nx?.74:r.w/2),r.z-(r.nz?.74:r.w/2),r.z+(r.nz?.74:r.w/2)])).join('||')||'false';
  const reflectionShader={
    uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null},rainTime:{value:0},rainStrength:{value:1},wetness:{value:1},eye:{value:new T.Vector3()},layer:{value:0}},
    vertexShader:`uniform mat4 textureMatrix;varying vec4 vUv;varying vec3 world;void main(){vUv=textureMatrix*vec4(position,1.0);world=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform sampler2D tDiffuse;uniform float rainTime;uniform float rainStrength;uniform float wetness;uniform float layer;uniform vec3 eye;varying vec4 vUv;varying vec3 world;
      void main(){
        if(!(${groundMask}))discard;
        bool plaza=world.x>=-19.0&&world.x<=17.0&&world.z>=-14.0&&world.z<=15.0;
        bool walk=${walkMask};bool ramp=${rampMask};
        if(layer>0.5&&((!plaza&&!walk)||ramp))discard;
        vec2 p=world.xz;float motion=rainTime*rainStrength;
        float n=sin(p.y*44.0+motion*1.3)*sin(p.x*31.0-motion);
        float distortion=mix(.12,1.0,rainStrength);
        vec4 q=vUv;q.x+=n*.00065*q.w*distortion;q.y+=sin(p.y*35.0-motion)*.00045*q.w*distortion;
        vec3 reflected=texture2DProj(tDiffuse,q).rgb;
        vec3 v=normalize(eye-world);float fresnel=.07+.63*pow(1.0-abs(v.y),3.0);
        float noise=sin(p.x*.63+sin(p.y*1.21))*sin(p.y*.77+sin(p.x*.88));float patch=.22+.78*smoothstep(-.12,.48,noise);
        gl_FragColor=vec4(reflected,(fresnel+.055)*patch*wetness);
      }`
  };
  for(const [y,layer] of [[.029,0],[.178,1]]){
    const mirror=new T.Reflector(new T.PlaneGeometry(51.8,51.8),{textureWidth:768,textureHeight:768,color:0xffffff,clipBias:.001,shader:reflectionShader});
    mirror.rotation.x=-Math.PI/2;mirror.position.set(0,y,0);mirror.userData.dynamic=true;mirror.material.transparent=true;mirror.material.depthWrite=false;mirror.material.toneMapped=false;mirror.renderOrder=2;
    mirror.material.uniforms.layer.value=layer;
    const renderReflection=mirror.onBeforeRender;
    mirror.onBeforeRender=function(r,sc,c){mirror.material.uniforms.eye.value.copy(c.position);const other=mirrors.filter(m=>m!==mirror);const previous=other.map(m=>m.visible);other.forEach(m=>m.visible=false);renderReflection.call(this,r,sc,c);other.forEach((m,i)=>m.visible=previous[i]);};
    mirrors.push(mirror);scene.add(mirror);
  }
  const mirror=mirrors[0];
  // Pavement color comes from its material, actual lights and reflections.
  const puddles=[],ripples=[];
  const onWalk=AME.onWalk;
  function underBusCover(x,z){const b=street.transit?.canopy;return b&&x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;}
  function outdoors(x,z){if(!AME.onGround(x,z)||underBusCover(x,z))return false;for(const s of shops){const p=new T.Vector3(x-s.x,0,z-s.z).applyAxisAngle(new T.Vector3(0,1,0),-s.angle),c=s.canopy;if(c&&p.x>=c.minX&&p.x<=c.maxX&&p.z>=c.near&&p.z<=c.far)return false;if(Math.abs(p.x)<s.w/2+.4&&p.z>-s.d/2-.3&&p.z<s.d/2+1)return false;}return true;}
  for(let i=0;i<90;i++){const x=rand()*50.8-25.4,z=rand()*50.8-25.4;if(!outdoors(x,z))continue;const y=onWalk(x,z)?.185:(Math.abs(x)>19||z>15.2||z<-14.2)?.07:.185;
    if(i<23){const m=new T.MeshBasicMaterial({color:'#7cabbc',transparent:true,opacity:.12,depthWrite:false,side:T.DoubleSide});const p=mesh(new T.CircleGeometry(.45+rand()*.4,22),m,x,y,z);p.rotation.x=-Math.PI/2;p.scale.y=.35+rand()*.4;p.userData.dynamic=true;puddles.push(p);}
    const r=mesh(new T.RingGeometry(.19,.205,22),new T.MeshBasicMaterial({color:'#a5cbd3',transparent:true,opacity:.25,depthWrite:false,side:T.DoubleSide}),x,y+.008,z);r.rotation.x=-Math.PI/2;r.userData.dynamic=true;r.userData.phase=rand()*2;r.userData.rate=.65+rand();ripples.push(r);
  }
  const rainCount=2300,rainPos=new Float32Array(rainCount*6),drops=[];
  for(let i=0;i<rainCount;i++){let x,z;do{x=rand()*50.8-25.4;z=rand()*50.8-25.4;}while(!AME.onGround(x,z));drops.push({x,z,y:rand()*14,speed:8+rand()*5});}
  const rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.BufferAttribute(rainPos,3).setUsage(T.DynamicDrawUsage));const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#b4d0df',transparent:true,opacity:.24,depthWrite:false}));rain.frustumCulled=false;rain.userData.dynamic=true;scene.add(rain);
  function cover(x,z){let h=underBusCover(x,z)?street.transit.canopy.y:onWalk(x,z)?.18:.08;for(const s of shops){const p=new T.Vector3(x-s.x,0,z-s.z).applyAxisAngle(new T.Vector3(0,1,0),-s.angle);h=Math.max(h,s.coverHeight(p.x,p.z));const c=s.canopy;if(c&&p.x>=c.minX&&p.x<=c.maxX&&p.z>=c.near&&p.z<=c.far)h=Math.max(h,c.height(p.z));else if(Math.abs(p.x)<s.w/2+.25&&p.z>s.d/2&&p.z<s.d/2+1)h=Math.max(h,3.35);}return h;}
  drops.forEach(p=>p.ground=cover(p.x,p.z));
  const dripGeo=new T.BufferGeometry(),dripPos=new Float32Array(shops.length*18*6);dripGeo.setAttribute('position',new T.BufferAttribute(dripPos,3).setUsage(T.DynamicDrawUsage));const drips=new T.LineSegments(dripGeo,new T.LineBasicMaterial({color:'#cae2df',transparent:true,opacity:.40,depthWrite:false}));drips.userData.dynamic=true;scene.add(drips);
  const droplets=[];for(const s of shops){const dg=new T.Group();dg.userData.dynamic=true;s.group.add(dg);for(let j=0;j<18;j++){const x=(j%2?1:-1)*(1.3+rand()*(s.w/2-1.5)),y=.95+rand()*2;const o=mesh(new T.SphereGeometry(1,5,4),new T.MeshBasicMaterial({color:'#c9e6dc',transparent:true,opacity:.25,depthWrite:false}),x,y,s.d/2+.055,.011,.048,.008,dg);o.userData.initial=y;o.userData.rate=.12+rand()*.2;droplets.push(o);}}
  const life=AME.createLife(K,scene,shops,street);
  function setProfile(next){profile=next;const raining=next==='night';rain.visible=drips.visible=raining;ripples.forEach(r=>r.visible=raining);mirrors.forEach(m=>{m.material.uniforms.rainStrength.value=raining?1:0;m.material.uniforms.wetness.value=raining?1:.78;});puddles.forEach(p=>p.material.opacity=raining?.12:.085);}
  setProfile('night');
  function update(dt,time,mode,camera){life.update(time,camera);mirrors.forEach(m=>m.material.uniforms.rainTime.value=time);for(let i=0;i<drops.length;i++){const p=drops[i];p.y-=dt*p.speed;if(p.y<p.ground)p.y=14;const n=i*6;rainPos[n]=p.x;rainPos[n+1]=p.y;rainPos[n+2]=p.z;rainPos[n+3]=p.x-.055-Math.sin(time*.82)*.025;rainPos[n+4]=p.y+.30;rainPos[n+5]=p.z-.025;}rainGeo.attributes.position.needsUpdate=true;
    ripples.forEach(r=>{const a=(time*r.userData.rate+r.userData.phase)%1;r.scale.setScalar(.15+a*2);r.material.opacity=(1-a)*.22;});
    let n=0;shops.forEach((s,j)=>{const e=s.eave||{z:s.d/2+.87,y:3.35,width:s.w-.3};for(let i=0;i<18;i++){const x=-e.width/2+i*e.width/17,p=s.world(x,e.z),y=e.y-((time*3.8+i*.37+j*.7)%(e.y-.22));dripPos[n++]=p.x;dripPos[n++]=y;dripPos[n++]=p.z;dripPos[n++]=p.x;dripPos[n++]=y+.11;dripPos[n++]=p.z;}});dripGeo.attributes.position.needsUpdate=true;
    if(profile==='night')droplets.forEach(o=>o.position.y=.81+((o.userData.initial-.81-time*o.userData.rate)%2.3+2.3)%2.3);
    if(shops[0])shops[0].light.intensity=(shops[0].light.userData.environmentIntensity??2.1)-((profile==='night'&&time%17>16.75&&Math.sin(time*78)>0)?.14:0);
    street.traffic.update(time);
  }
  return {update,setProfile,get profile(){return profile;},mirror,mirrors,rain,drips,ripples,droplets,puddles,life,cover};
};
