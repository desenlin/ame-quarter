/* Circle-versus-AABB walking and grid routing; no pointer lock is required. */
AME.createNavigation=function(T,root,camera,controls,K,shops,layout){
  const radius=.27,bounds=layout.bounds,colliders=K.colliders;
  let mode='mini',yaw=0,pitch=0,tourIndex=0,hold=0,paused=false,route=[],keys=new Set(),pointer=null;
  const temp=new T.Vector3(),ray=new T.Raycaster(),floor=new T.Plane(new T.Vector3(0,1,0),-.19),mouse=new T.Vector2();
  const stops=shops.flatMap(s=>[{p:s.entry,look:s.world(0,s.d/2-1),name:s.name},{p:s.inside,look:s.look,name:s.name},{p:s.entry,look:s.world(0,s.d/2+2),name:s.name}]);
  let transition=null,roofHidden=false;
  function blocked(x,z,doors=true){if(!AME.onGround(x,z))return true;if(x<bounds.minX+.65||x>bounds.maxX-.65||z<bounds.minZ+.65||z>bounds.maxZ-.65)return true;
    for(const o of colliders){const dx=Math.max(Math.abs(x-o.x)-o.w/2,0),dz=Math.max(Math.abs(z-o.z)-o.d/2,0);if(dx*dx+dz*dz<radius*radius)return true;}
    if(doors)for(const s of shops){if(s.open>.78)continue;const p=new T.Vector3(x-s.x,0,z-s.z).applyAxisAngle(new T.Vector3(0,1,0),-s.angle);if(Math.abs(p.x)<1.1&&Math.abs(p.z-s.d/2)<radius+.06)return true;}
    return false;
  }
  function lineClear(a,b){const dist=a.distanceTo(b),n=Math.max(1,Math.ceil(dist/.16));for(let i=1;i<=n;i++){const f=i/n;if(blocked(a.x+(b.x-a.x)*f,a.z+(b.z-a.z)*f,false))return false;}return true;}
  const step=.35,minX=bounds.minX+.7,minZ=bounds.minZ+.7,nx=Math.floor((bounds.maxX-minX-.7)/step)+1,nz=Math.floor((bounds.maxZ-minZ-.7)/step)+1;
  const grid=new Uint8Array(nx*nz);for(let j=0;j<nz;j++)for(let i=0;i<nx;i++)grid[j*nx+i]=blocked(minX+i*step,minZ+j*step,false)?1:0;
  function point(id){return new T.Vector3(minX+id%nx*step,0,minZ+Math.floor(id/nx)*step);}
  function nearest(p){let i=Math.round((p.x-minX)/step),j=Math.round((p.z-minZ)/step);i=Math.max(0,Math.min(nx-1,i));j=Math.max(0,Math.min(nz-1,j));let best=-1,dist=Infinity;for(let dz=-4;dz<=4;dz++)for(let dx=-4;dx<=4;dx++){const a=i+dx,b=j+dz,id=b*nx+a;if(a<0||a>=nx||b<0||b>=nz||grid[id])continue;const q=point(id),d=q.distanceToSquared(p);if(d<dist&&lineClear(p,q)){best=id;dist=d;}}return best;}
  function findPath(from,to){const a=from.clone();a.y=0;const b=to.clone();b.y=0;if(blocked(b.x,b.z,false))return [];if(lineClear(a,b))return [b];const start=nearest(a),end=nearest(b);if(start<0||end<0)return [];
    const g=new Float32Array(nx*nz);g.fill(Infinity);g[start]=0;const prev=new Int32Array(nx*nz);prev.fill(-1);const done=new Uint8Array(nx*nz),open=[start],inOpen=new Uint8Array(nx*nz);inOpen[start]=1;
    const heuristic=id=>Math.hypot(id%nx-end%nx,Math.floor(id/nx)-Math.floor(end/nx));let iter=0;
    while(open.length&&iter++<16000){let at=0;for(let i=1;i<open.length;i++)if(g[open[i]]+heuristic(open[i])<g[open[at]]+heuristic(open[at]))at=i;const id=open.splice(at,1)[0];inOpen[id]=0;if(id===end){const out=[b];let n=id;while(n!==start){out.push(point(n));n=prev[n];if(n<0)return [];}out.push(a);out.reverse();const simple=[];let k=0;while(k<out.length-1){let j=out.length-1;while(j>k+1&&!lineClear(out[k],out[j]))j--;simple.push(out[j]);k=j;}return simple;}
      done[id]=1;const x=id%nx,z=Math.floor(id/nx);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){const xx=x+dx,zz=z+dz,n=zz*nx+xx;if(xx<0||xx>=nx||zz<0||zz>=nz||grid[n]||done[n])continue;if(dx&&dz&&(grid[z*nx+xx]||grid[zz*nx+x]))continue;const score=g[id]+Math.hypot(dx,dz);if(score<g[n]){g[n]=score;prev[n]=id;if(!inOpen[n]){open.push(n);inOpen[n]=1;}}}}
    return [];
  }
  function orient(){camera.rotation.set(pitch,yaw,0,'YXZ');}
  function readAngles(){const e=new T.Euler().setFromQuaternion(camera.quaternion,'YXZ');yaw=e.y;pitch=e.x;}
  function display(){root.dataset.mode=mode;root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));root.dispatchEvent(new CustomEvent('ame-mode',{detail:mode}));}
  function setMode(next,shop){keys.clear();route=[];hold=0;paused=false;transition=null;mode=next;controls.enabled=mode==='mini';
    if(mode==='mini'){camera.fov=40;const scale=Math.max(1,Math.min(2.8,1.30/camera.aspect));camera.position.set(46*scale,38*scale,57*scale);controls.target.set(0,.5,2);controls.update();}
    else{camera.fov=62;const s=shop||shops[0],p=s.entry;camera.position.set(p.x,1.86,p.z);camera.lookAt(s.inside.x,1.6,s.inside.z);readAngles();if(mode==='tour'){tourIndex=shop?shops.indexOf(shop)*3:0;hold=3;}}
    camera.updateProjectionMatrix();display();
  }
  function doorUpdate(dt,time){for(const s of shops){const local=new T.Vector3(camera.position.x-s.x,0,camera.position.z-s.z).applyAxisAngle(new T.Vector3(0,1,0),-s.angle);const near=mode!=='mini'&&Math.abs(local.x)<1.65&&Math.abs(local.z-s.d/2)<2.25;const idle=mode==='mini'&&(time+shops.indexOf(s)*4)%23<3.4;const target=near||idle?1:0;s.open+=(target-s.open)*(1-Math.exp(-dt*7));s.doors[0].position.x=-.46-s.open*.94;s.doors[1].position.x=.46+s.open*.94;}}
  function move(dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.10));for(let i=0;i<n;i++){if(!blocked(camera.position.x+dx/n,camera.position.z))camera.position.x+=dx/n;if(!blocked(camera.position.x,camera.position.z+dz/n))camera.position.z+=dz/n;}}
  function lookToward(p,dt,rate=3){const desired=Math.atan2(camera.position.x-p.x,camera.position.z-p.z);yaw+=Math.atan2(Math.sin(desired-yaw),Math.cos(desired-yaw))*(1-Math.exp(-dt*rate));pitch+=(.025-pitch)*(1-Math.exp(-dt*2));orient();}
  function update(dt,time){doorUpdate(dt,time);if(mode==='mini'){controls.update();return;}if(paused)return;
    const forward=(keys.has('w')||keys.has('arrowup')?1:0)-(keys.has('s')||keys.has('arrowdown')?1:0),strafe=(keys.has('d')?1:0)-(keys.has('a')?1:0);
    if(keys.has('arrowleft'))yaw+=dt*1.1;if(keys.has('arrowright'))yaw-=dt*1.1;
    if(mode==='walk'&&(forward||strafe)){route=[];const norm=Math.hypot(forward,strafe),speed=keys.has('shift')?3.7:2.25;move((-Math.sin(yaw)*forward+Math.cos(yaw)*strafe)*dt*speed/norm,(-Math.cos(yaw)*forward-Math.sin(yaw)*strafe)*dt*speed/norm);orient();}
    if(mode==='tour'&&hold>0){hold-=dt;lookToward(stops[tourIndex].look,dt,.75);if(hold<=0){tourIndex=(tourIndex+1)%stops.length;route=findPath(camera.position,stops[tourIndex].p);}return;}
    if(route.length){const q=route[0],dist=Math.hypot(q.x-camera.position.x,q.z-camera.position.z);if(dist<.10){route.shift();if(!route.length&&mode==='tour')hold=tourIndex%3===1?5:2;}else{const speed=mode==='tour'?1.65:2.3,len=Math.min(dist,dt*speed);lookToward(q,dt,mode==='tour'?2.2:4);move((q.x-camera.position.x)/dist*len,(q.z-camera.position.z)/dist*len);}}
    else if(mode==='tour'&&hold<=0){route=findPath(camera.position,stops[tourIndex].p);if(!route.length)hold=2;}
    camera.position.y=1.86;orient();
  }
  function ground(event){const r=root.getBoundingClientRect();mouse.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);return ray.ray.intersectPlane(floor,temp)?temp.clone().setY(0):null;}
  root.addEventListener('keydown',e=>{if(e.target.tagName==='BUTTON'&&[' ','Enter'].includes(e.key))return;const k=e.key.toLowerCase();if(['1','2','3','escape','r','h',' ','w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(k))e.preventDefault();if(k==='1'||k==='escape')setMode('mini');else if(k==='2')setMode('walk');else if(k==='3')setMode('tour');else if(k==='r'){roofHidden=!roofHidden;shops.forEach(s=>s.roof.visible=!roofHidden);}else if(k===' '){paused=!paused;}else if(k==='h')root.dispatchEvent(new CustomEvent('ame-help'));else{if(mode==='tour'&&['w','a','s','d'].includes(k)){mode='walk';route=[];display();}keys.add(k);}});
  root.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  root.addEventListener('blur',()=>keys.clear());window.addEventListener('blur',()=>keys.clear());
  const canvas=controls.domElement;
  canvas.addEventListener('pointerdown',e=>{root.focus({preventScroll:true});pointer={x:e.clientX,y:e.clientY,moved:0,id:e.pointerId};if(mode!=='mini'){canvas.setPointerCapture(e.pointerId);if(mode==='tour'){mode='walk';route=[];display();}}});
  canvas.addEventListener('pointermove',e=>{if(!pointer||mode==='mini')return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer.moved+=Math.abs(dx)+Math.abs(dy);pointer.x=e.clientX;pointer.y=e.clientY;yaw-=dx*.004;pitch=Math.max(-1.0,Math.min(1.1,pitch-dy*.003));orient();});
  canvas.addEventListener('pointerup',e=>{if(pointer&&pointer.moved<6&&mode==='walk'){const p=ground(e);if(p&&!blocked(p.x,p.z,false))route=findPath(camera.position,p);}pointer=null;});canvas.addEventListener('pointercancel',()=>pointer=null);
  canvas.addEventListener('dblclick',e=>{if(mode!=='mini')return;const p=ground(e);if(!p)return;const s=shops.reduce((best,s)=>s.entry.distanceToSquared(p)<best.entry.distanceToSquared(p)?s:best,shops[0]);setMode('walk',s);});
  return {update,setMode,blocked,findPath,lineClear,move,shops,stops,get mode(){return mode;},get route(){return route;},get tourIndex(){return tourIndex;},get paused(){return paused;}};
};
