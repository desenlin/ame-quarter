/* Lighting, atmosphere and wet surfaces switch as one coherent environment. */
AME.createEnvironment=function(K,root,scene,renderer,key,sky,shops,street,weather,invalidate){
 const profiles={
  night:{label:'Rainy night',background:'#111e30',fog:'#17283b',density:.0025,sky:'#b5cef2',ground:'#615878',ambient:.46,key:'#b2ccf1',power:1.05,position:[-13,26,16],shop:2.1,spill:2.9,street:1.55,bulb:1},
  dusk:{label:'After rain · Dusk',background:'#b98479',fog:'#d3a087',density:.0032,sky:'#bdb5d0',ground:'#b8957a',ambient:.56,key:'#ffcd94',power:2.30,position:[-34,11,16],shop:1.12,spill:1.10,street:.32,bulb:.64}
 };
 // A world-oriented sky keeps the sunset, its reflections and the low sun in agreement while orbiting.
 const T=K.T,skyMaterial=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,fog:false,toneMapped:false,
  uniforms:{sunDirection:{value:key.position},zenith:{value:K.linear('#756a98')},horizon:{value:K.linear('#f3ba83')},lowerSky:{value:K.linear('#a97069')},sunColor:{value:K.linear('#ffe6b2')}},
  vertexShader:`varying vec3 vSkyDirection;void main(){vSkyDirection=position;vec4 clip=projectionMatrix*mat4(mat3(viewMatrix))*vec4(position,1.0);gl_Position=clip.xyww;}`,
  fragmentShader:`uniform vec3 sunDirection;uniform vec3 zenith;uniform vec3 horizon;uniform vec3 lowerSky;uniform vec3 sunColor;varying vec3 vSkyDirection;
   void main(){vec3 ray=normalize(vSkyDirection);float altitude=ray.y;vec3 color=mix(lowerSky,horizon,smoothstep(-.75,.02,altitude));
    color=mix(color,zenith,smoothstep(.04,.78,max(altitude,0.0)));
    float alignment=max(0.0,dot(ray,normalize(sunDirection)));float glow=pow(alignment,28.0)*.20;
    color=mix(color,sunColor,glow);float disk=smoothstep(.99972,.99985,alignment);color=mix(color,sunColor,disk*.9);
    gl_FragColor=vec4(color,1.0);
    #include <encodings_fragment>
   }`
 });
 const skyDome=new T.Mesh(new T.SphereGeometry(1,32,16),skyMaterial);skyDome.name='Dusk sunset sky';skyDome.frustumCulled=false;skyDome.renderOrder=-1000;skyDome.userData.dynamic=true;scene.add(skyDome);
 let mode='night',revision=0;
 const lampMaterials=[...new Set(street.lampBulbs.map(b=>b.material))],lampColors=lampMaterials.map(m=>m.color.clone());
 function setMode(next){if(!profiles[next])return;mode=next;const p=profiles[next];
  scene.background=K.linear(p.background);skyDome.visible=mode==='dusk';scene.fog.color.copy(K.linear(p.fog));scene.fog.density=p.density;
  sky.color.copy(K.linear(p.sky));sky.groundColor.copy(K.linear(p.ground));sky.intensity=p.ambient;
  key.color.copy(K.linear(p.key));key.intensity=p.power;key.position.fromArray(p.position);key.target.position.set(0,0,0);key.target.updateMatrixWorld();
  Object.assign(key.shadow.camera,{left:-45,right:45,top:40,bottom:-40,near:1,far:150});key.shadow.camera.updateProjectionMatrix();key.shadow.needsUpdate=true;
  shops.forEach(s=>{s.light.intensity=p.shop;s.light.userData.environmentIntensity=p.shop;s.spill.intensity=p.spill;s.spill.shadow.needsUpdate=true;});
  street.lampLights.forEach(l=>l.intensity=p.street);lampMaterials.forEach((m,i)=>m.color.copy(lampColors[i]).multiplyScalar(p.bulb));
  weather.setProfile(mode);renderer.toneMappingExposure=1;renderer.shadowMap.needsUpdate=true;root.dataset.environment=mode;
  root.querySelectorAll('[data-environment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.environment===mode)));
  revision++;invalidate();return p.label;
 }
 return {setMode,skyDome,get mode(){return mode;},get revision(){return revision;},get profile(){return profiles[mode];},profiles};
};
