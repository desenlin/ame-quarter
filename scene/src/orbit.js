AME.Orbit=function(T,camera,canvas){
  this.domElement=canvas;this.target=new T.Vector3(-1,0,1);this.enabled=true;
  const pointers=new Map(),spherical=new T.Spherical(),offset=new T.Vector3();let rotateX=0,rotateY=0,panX=0,panY=0,zoom=1,lastPinch=0;
  canvas.addEventListener('contextmenu',e=>e.preventDefault());
  canvas.addEventListener('pointerdown',e=>{if(!this.enabled)return;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,button:e.button});lastPinch=0;});
  canvas.addEventListener('pointermove',e=>{if(!this.enabled||!pointers.has(e.pointerId))return;const p=pointers.get(e.pointerId),dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(pointers.size===2){const [a,b]=[...pointers.values()],dist=Math.hypot(a.x-b.x,a.y-b.y);if(lastPinch)zoom*=lastPinch/dist;lastPinch=dist;panX+=dx*.5;panY+=dy*.5;}else if(p.button===2||e.shiftKey){panX+=dx;panY+=dy;}else{rotateX-=dx*.005;rotateY-=dy*.005;}});
  const clear=e=>{pointers.delete(e.pointerId);lastPinch=0;};canvas.addEventListener('pointerup',clear);canvas.addEventListener('pointercancel',clear);
  canvas.addEventListener('wheel',e=>{if(!this.enabled)return;e.preventDefault();zoom*=Math.exp(e.deltaY*.001);},{passive:false});
  this.update=()=>{offset.copy(camera.position).sub(this.target);spherical.setFromVector3(offset);spherical.theta+=rotateX;spherical.phi=Math.max(.13,Math.min(1.49,spherical.phi+rotateY));spherical.radius=Math.max(4.0,Math.min(230,spherical.radius*zoom));const scale=spherical.radius*.0011;this.target.x+=(-Math.cos(spherical.theta)*panX-Math.sin(spherical.theta)*panY)*scale;this.target.z+=(Math.sin(spherical.theta)*panX-Math.cos(spherical.theta)*panY)*scale;this.target.x=Math.max(-25,Math.min(35,this.target.x));this.target.z=Math.max(-20,Math.min(34,this.target.z));camera.position.copy(this.target).add(offset.setFromSpherical(spherical));camera.lookAt(this.target);rotateX=rotateY=panX=panY=0;zoom=1;};
  this.dispose=()=>pointers.clear();
};
