(async function(){
  const root=document.getElementById('ame-district');if(!root)return;
  if(!window.THREE){root.querySelector('[data-status]').textContent='The 3D renderer could not load. Open the complete project to use the bundled renderer.';return;}
  await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]);
  if(document.fonts.load)await Promise.race([document.fonts.load('500 32px "Noto Sans JP"','雨まち 喫茶 青 こむぎ 月の本棚 夜らーめん みどり花店'),new Promise(r=>setTimeout(r,1800))]);
  const T=THREE,scene=new T.Scene();scene.background=new T.Color('#111e30').convertSRGBToLinear();scene.fog=new T.FogExp2(new T.Color('#17283b').convertSRGBToLinear(),.0025);
  let renderer;try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(e){root.querySelector('[data-status]').textContent='WebGL is unavailable. Please open this model in a browser with hardware acceleration enabled.';return;}
  const balanced=window.AME_STUDIO_CONFIG?.quality!=='full';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,balanced?1:1.6));renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.LinearToneMapping;renderer.toneMappingExposure=1.0;renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;renderer.shadowMap.type=T.PCFSoftShadowMap;root.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-label','Ame Quarter: Japanese plaza with rainy night and post-rain dusk views');
  const camera=new T.PerspectiveCamera(40,1,.08,400);camera.position.set(38,34,47);
  const controls=new AME.Orbit(T,camera,renderer.domElement);controls.update();
  const sky=new T.HemisphereLight(0xffffff,0xffffff,.46);sky.color.set('#b5cef2').convertSRGBToLinear();sky.groundColor.set('#615878').convertSRGBToLinear();scene.add(sky);const moon=new T.DirectionalLight(new T.Color('#b2ccf1').convertSRGBToLinear(),1.05);moon.position.set(-13,26,16);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);Object.assign(moon.shadow.camera,{left:-30,right:30,top:27,bottom:-27,near:1,far:80});moon.shadow.bias=-.0003;moon.shadow.normalBias=.018;scene.add(moon);
  const K=AME.createKit(T,scene),shops=AME.buildShops(K,scene,AME.layout),street=AME.buildStreet(K,scene,AME.layout,shops),weather=AME.createWeather(K,scene,renderer,shops,street);
  if(balanced){moon.shadow.mapSize.set(1024,1024);shops.forEach(s=>s.spill.castShadow=false);weather.mirrors.forEach(m=>m.visible=false);}
  let environmentReady=false,environmentTarget=null,environmentCaptures=0,lightSweep=false,lightAngle=Math.atan2(16,-13);
  function captureEnvironment(){
    const target=environmentTarget||(environmentTarget=new T.WebGLCubeRenderTarget(128,{generateMipmaps:true,minFilter:T.LinearMipmapLinearFilter,encoding:T.sRGBEncoding}));
    const probe=new T.CubeCamera(.2,140,target);probe.position.set(-1,2.3,3);scene.add(probe);
    const hidden=[...weather.mirrors,weather.rain,weather.drips],visibility=hidden.map(o=>o.visible);hidden.forEach(o=>o.visible=false);
    // Exclude the old probe while recording the new sky and lights, then restore exact visibility.
    K.reflective.forEach(m=>{m.envMap=null;m.needsUpdate=true;});probe.update(renderer,scene);hidden.forEach((o,i)=>o.visible=visibility[i]);
    K.reflective.forEach(m=>{m.envMap=target.texture;m.needsUpdate=true;});scene.remove(probe);environmentReady=true;environmentCaptures++;
  }
  const environment=AME.createEnvironment(K,root,scene,renderer,moon,sky,shops,street,weather,()=>{environmentReady=false;lightSweep=false;root.dataset.light='fixed';lightAngle=Math.atan2(moon.position.z,moon.position.x);});
  AME.enrichShops(K,shops);shops.forEach(s=>K.batchRoof(s.roof));K.planters.forEach(p=>K.batchRoof(p.foliage));
  const batches=K.batchStatic(),nav=AME.createNavigation(T,root,camera,controls,K,shops,AME.layout);
  root.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='l'){lightSweep=!lightSweep;root.dataset.light=lightSweep?'sweep':'fixed';root.querySelector('[data-status]').textContent=lightSweep?'Light moving · L to hold this direction':'Light held · L to rotate';reveal(6);e.preventDefault();}});
  const status=root.querySelector('[data-status]'),help=root.querySelector('[data-help]');let hideAt=9,elapsed=0,visible=true,frame,suspended=false;
  function reveal(seconds=7){help.classList.remove('is-hidden');hideAt=elapsed+seconds;}
  root.addEventListener('ame-help',()=>help.classList.contains('is-hidden')?reveal(30):help.classList.add('is-hidden'));
  root.addEventListener('ame-mode',()=>{status.textContent=nav.mode==='mini'?'Drag to orbit · Scroll to zoom · Right-drag to pan':nav.mode==='walk'?'WASD to walk · Drag to look · Click the ground to walk there':'Guided tour · Space to pause · Drag to take over';reveal(8);});
  root.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{nav.setMode(b.dataset.mode);root.focus({preventScroll:true});}));
  function switchEnvironment(next){const label=environment.setMode(next);status.textContent=label+' · V to switch scene';renderer.domElement.setAttribute('aria-label','Ame Quarter — '+label);reveal(8);}
  root.querySelectorAll('[data-environment]').forEach(b=>b.addEventListener('click',()=>{switchEnvironment(b.dataset.environment);root.focus({preventScroll:true});}));
  root.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='v'){switchEnvironment(environment.mode==='night'?'dusk':'night');e.preventDefault();}});
  root.querySelector('[data-help-button]').addEventListener('click',()=>{root.querySelector('[data-keys]').hidden=!root.querySelector('[data-keys]').hidden;reveal(30);});
  root.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{root.dispatchEvent(new KeyboardEvent('keydown',{key:b.dataset.action==='light'?'l':'r'}));root.focus({preventScroll:true});}));
  let down=null;root.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY,time:elapsed});root.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<5&&elapsed-down.time<.6)reveal(8);down=null;});
  root.addEventListener('pointermove',e=>{if(e.clientY-root.getBoundingClientRect().top>root.clientHeight-62)reveal(5);});root.addEventListener('focusin',()=>reveal(15));
  function resize(){const w=root.clientWidth,h=root.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  const ro=new ResizeObserver(resize);ro.observe(root);resize();
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});io.observe(root);
  const clock=new T.Clock(),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick(){frame=requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.05);if(suspended||!visible||document.hidden)return;elapsed+=dt;nav.update(dt,elapsed);weather.update(reduce?0:dt,reduce?0:elapsed,nav.mode,camera);if(elapsed>hideAt&&!help.contains(document.activeElement))help.classList.add('is-hidden');if(!environmentReady&&elapsed>.25&&typeof renderer.getContext==='function')captureEnvironment();if(lightSweep){lightAngle+=dt*.36;const p=environment.profile,rad=Math.hypot(p.position[0],p.position[2]);moon.position.set(Math.cos(lightAngle)*rad,p.position[1],Math.sin(lightAngle)*rad);}renderer.shadowMap.needsUpdate=renderer.shadowMap.needsUpdate||lightSweep||nav.mode!=='mini'||Math.floor(elapsed*8)!==Math.floor((elapsed-dt)*8);renderer.render(scene,camera);}
  root.__district={scene,camera,moon,sky,renderer,controls,K,shops,street,weather,environment,nav,batches,setSuspended(value){suspended=Boolean(value);},get suspended(){return suspended;},get quality(){return balanced?'balanced':'full';},get environmentReady(){return environmentReady;},get environmentCaptures(){return environmentCaptures;},get time(){return elapsed;}};
  environment.setMode('night');nav.setMode('mini');tick();
  const cleanup=new MutationObserver(()=>{if(!root.isConnected){cancelAnimationFrame(frame);ro.disconnect();io.disconnect();controls.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});environmentTarget?.dispose();renderer.dispose();cleanup.disconnect();}});cleanup.observe(document.body,{childList:true,subtree:true});
})();
