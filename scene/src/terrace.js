/* Two bistro settings with a central entrance and clear public footway. */
AME.buildTerrace=function(K,s){
 const {T,M,box,cyl,rod,obstacle,surface}=K,g=s.group,z=s.d/2+.95;
 const tables=[],chairs=[],teal=surface('#476f72','matte'),timber=surface('#bd956a','wood');K.use(g);
 for(const x of [-2.65,2.65]){
  cyl(x,.936,z,.41,.055,timber);cyl(x,.553,z,.047,.71,M.dark);cyl(x,.194,z,.24,.043,M.dark);obstacle(x,z,.85,.85,g,'terrace table');tables.push({x,z,radius:.41,top:.9635});
  for(const side of [-1,1]){
   const chair=new T.Group();chair.position.set(x+side*.71,.172,z);chair.rotation.y=side<0?Math.PI/2:-Math.PI/2;g.add(chair);
   for(let j=0;j<4;j++)box(0,.43,-.18+j*.12,.44,.048,.093,timber,false,chair);
   for(const xx of [-.19,.19])for(const zz of [-.18,.18])rod([xx*1.13,0,zz*1.14],[xx,.415,zz],.020,M.dark,chair);
   for(const xx of [-.20,.20])rod([xx,.36,-.205],[xx,.88,-.24],.020,M.dark,chair);
   for(const y of [.63,.77,.87])box(0,y,-.235,.44,.075,.043,teal,false,chair);
   obstacle(0,0,.50,.54,chair,'terrace chair');chairs.push({object:chair,x:x+side*.71,z});
  }
  K.cup(x-.13,.965,z);cyl(x+.15,.976,z+.07,.08,.012,M.cream);box(x+.11,.972,z-.15,.18,.012,.13,M.cream,false);
 }
 K.use(g.parent);s.terrace={tables,chairs,canopy:s.canopy};return s.terrace;
};
