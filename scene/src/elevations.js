AME.windowPosterTexture=function(K,kind){const s={kind};
 return K.texture((c,w,h)=>{
  const flower=s.kind==='florist';c.fillStyle=flower?'#e5dbc0':'#eed8b8';c.fillRect(0,0,w,h);c.fillStyle=flower?'#466f59':'#8e463e';c.fillRect(18,18,w-36,7);
  c.textAlign='center';c.font='500 25px sans-serif';c.fillText(flower?'SEASONAL':'SLOW',w/2,66);c.fillText(flower?'STEMS':'SIMMER',w/2,99);
  if(flower){for(let j=0;j<5;j++){const x=78+j*40,y=205+(j%2)*36;c.strokeStyle='#47704e';c.lineWidth=5;c.beginPath();c.moveTo(w/2,350);c.lineTo(x,y);c.stroke();for(let k=0;k<6;k++){const a=k*Math.PI/3;c.fillStyle=j%2?'#ba7585':'#cf925b';c.beginPath();c.ellipse(x+Math.cos(a)*14,y+Math.sin(a)*14,13,9,a,0,Math.PI*2);c.fill();}c.fillStyle='#e3b152';c.beginPath();c.arc(x,y,8,0,Math.PI*2);c.fill();}}
  else{c.fillStyle='#ad5f48';c.beginPath();c.moveTo(61,246);c.quadraticCurveTo(160,409,259,246);c.closePath();c.fill();c.fillStyle='#e7b55a';c.beginPath();c.ellipse(160,246,99,24,0,0,Math.PI*2);c.fill();c.strokeStyle='#faf0d7';c.lineWidth=5;for(let j=0;j<5;j++){c.beginPath();c.ellipse(123+j*18,246,22,10,j*.18,0,Math.PI*2);c.stroke();}c.strokeStyle='#8e463e';c.lineWidth=4;for(let j=0;j<3;j++){c.beginPath();c.moveTo(119+j*37,203);c.bezierCurveTo(101+j*37,180,137+j*37,169,119+j*37,149);c.stroke();}}
  c.fillStyle='#354e49';c.font='500 18px sans-serif';c.fillText(flower?'FLOWERS FOR EVERY DAY':'BROTH MADE DAILY',w/2,405);c.font='500 24px sans-serif';c.fillText(flower?'MIDORI':'YORU RAMEN',w/2,445);
 },320,480);
};
/* Street display windows and the north row's service-lane elevations. */
AME.buildSideGlazing=function(K,s,wall){
 const {T,M,box,glass,obstacle,mesh}=K,x=-s.w/2,g=s.group,panes=[];
 obstacle(x,0,.18,s.d,g,'street display glazing');
 box(x,.40,0,.18,.55,s.d,wall);box(x,3.42,0,.18,.51,s.d,wall);
 const n=Math.ceil((s.d-.20)/1.28),step=(s.d-.20)/n;
 for(let j=0;j<n;j++){const z=-s.d/2+.10+(j+.5)*step;panes.push(glass(x-.015,1.92,z,step-.045,2.46,-Math.PI/2));}
 for(let j=0;j<=n;j++)box(x,1.92,-s.d/2+.10+j*step,.11,2.52,.045,M.metal,false);
 for(const y of [.68,3.16])box(x,y,0,.14,.065,s.d,M.metal,false);
 // A small illustrated poster, mounted on the glass with corner pads.
 const tex=AME.windowPosterTexture(K,s.kind);
 const material=new T.MeshBasicMaterial({map:tex,side:T.FrontSide,toneMapped:false}),poster=K.plane(x-.078,1.95,s.d/2-1.16,.64,.96,material,-Math.PI/2);
 poster.name=s.id+' street-window poster';for(const y of [1.51,2.39])for(const z of [s.d/2-1.43,s.d/2-.89])box(x-.076,y,z,.012,.035,.035,M.metal,false);
 s.streetGlazing={panes,poster,localX:x,minY:.69,maxY:3.15,viewPoint:s.world(x-1.15,0)};
};

AME.buildRearGlazing=function(K,s,wall){
 const {T,M,box,glass,rod,obstacle}=K,z=-s.d/2,panes=[],left=-s.w/2+.10,right=1.08,step=(right-left)/4;
 obstacle(0,z,s.w,.18,s.group,'east display glazing');box(0,.40,z,s.w,.55,.18,wall);box(0,3.42,z,s.w,.51,.18,wall);box((1.1+s.w/2)/2,1.92,z,s.w/2-1.1,2.49,.18,wall);
 for(let j=0;j<4;j++){const x=left+(j+.5)*step;panes.push(glass(x,1.92,z-.015,step-.04,2.46,Math.PI));}
 for(let j=0;j<=4;j++)box(left+j*step,1.92,z,.042,2.52,.12,M.metal,false);for(const y of [.68,3.16])box((left+right)/2,y,z,right-left,.065,.14,M.metal,false);
 const material=new T.MeshBasicMaterial({map:AME.windowPosterTexture(K,s.kind),side:T.FrontSide,toneMapped:false}),poster=K.plane(-2.1,1.95,z-.078,.64,.96,material,Math.PI);poster.name='florist east-window poster';for(const x of [-2.37,-1.83])for(const y of [1.51,2.39])box(x,y,z-.076,.035,.035,.012,M.metal,false);
 // The existing interior banner now has a backboard and ceiling suspension.
 box(0,2.97,z+.09,3.5,.48,.05,M.wood,false);for(const x of [-1.4,1.4])rod([x,3.67,z+.09],[x,3.21,z+.09],.012,M.metal);
 s.streetGlazing={panes,poster,face:'rear',minY:.69,maxY:3.15,viewPoint:s.world(-.9,z-1.15)};
};

AME.buildNorthWall=function(K,s,wall){
 const {T,M,box,glass,sign,rod,cyl,obstacle}=K,{w,d}=s,z=-d/2;
 obstacle(0,z,w,.18,s.group,'rear service wall');box(0,1.64,z,w,3.03,.18,wall);box(0,3.62,z,w,.11,.18,wall);
 const openings=[-w*.29,0,w*.29].map(x=>({x,w:w*.19})),windows=[];let left=-w/2;
 for(const o of openings){const a=o.x-o.w/2,b=o.x+o.w/2;if(a>left)box((left+a)/2,3.36,z,a-left,.41,.18,wall,false);left=b;
  windows.push(glass(o.x,3.36,z-.015,o.w-.06,.37,Math.PI));for(const x of [a,b,o.x])box(x,3.36,z-.02,.035,.41,.13,M.metal,false);for(const y of [3.155,3.565])box(o.x,y,z-.02,o.w,.035,.13,M.metal,false);
 }if(left<w/2)box((left+w/2)/2,3.36,z,w/2-left,.41,.18,wall,false);
 const baseColors=s.kind==='books'?['#86768c','#9c879c','#8f7c90']:s.kind==='ramen'?['#9e705b','#b38466','#92654f']:s.kind==='bakery'?['#aa8770','#b49379','#a4816d']:s.kind==='cafe'?['#7f9690','#8b9f97','#779189']:['#b0aa91','#beb59d','#a9a58e'];
 const bricks=K.texture((c,ww,hh)=>{c.fillStyle='#777c72';c.fillRect(0,0,ww,hh);for(let row=0;row<15;row++)for(let j=-1;j<28;j++){c.fillStyle=baseColors[(row+j+30)%3];c.fillRect(j*40+(row%2)*20+1,row*22+1,38,20);}},1024,330);
 const brickMat=new T.MeshPhongMaterial({map:bricks,color:0xffffff,shininess:5,specular:K.linear('#1d211e')});K.plane(0,1.64,z-.101,w-.02,2.98,brickMat,Math.PI);
 const doorX=w*.35;box(doorX,1.44,z-.13,1.03,2.51,.08,M.dark,false);box(doorX,1.43,z-.181,.86,2.36,.024,K.surface('#59766e'),false);box(doorX-.29,1.35,z-.209,.035,.23,.035,M.metal,false);
 sign('STAFF / DELIVERY',doorX,2.18,z-.20,.76,.13,null,'#ede4c8',Math.PI);box(doorX,2.86,z-.38,1.33,.075,.75,M.metal,false);for(const x of [doorX-.5,doorX+.5])rod([x,2.44,z-.15],[x,2.81,z-.66],.022,M.metal);
 box(doorX,2.72,z-.16,.29,.11,.13,M.dark,false);box(doorX,2.66,z-.19,.24,.015,.12,K.basic('#ead3a2'),false);
 sign([s.name,'SERVICE LANE'],-.1*w,2.36,z-.124,w*.35,.58,null,'#e3dbc0',Math.PI);
 const tx=-w*.35,tz=z-.32,planter=K.surface('#687b6c');box(tx,.43,tz,1.35,.50,.38,planter,false);box(tx,.687,tz,1.25,.025,.30,K.soil,false);for(const xx of [tx-.65,tx+.65])box(xx,.713,tz,.035,.06,.40,planter,false);for(const zz of [tz-.175,tz+.175])box(tx,.713,zz,1.35,.06,.03,planter,false);obstacle(tx,tz,1.4,.43,s.group,'north planter');
 for(let j=0;j<6;j++)rod([tx-.57+j*.23,.70,z-.17],[tx-.57+j*.23,2.76,z-.17],.010,M.wood);for(let j=0;j<8;j++)rod([tx-.64,.80+j*.25,z-.17],[tx+.64,.80+j*.25,z-.17],.010,M.wood);
 for(let j=0;j<3;j++){const vine=new T.Group();vine.position.set(tx-.4+j*.4,.68,tz);vine.userData.dynamic=true;s.group.add(vine);rod([0,0,0],[.10,1.93,.10],.014,M.green,vine);for(let k=0;k<15;k++){const y=.16+k*.118,xx=Math.sin(k*2.3+j)*.18;rod([y*.05,y,0],[xx,y+.035,-.03],.008,M.green,vine);const leaf=K.ball(xx,y+.035,-.03,.11,K.surface(k%2?'#52765b':'#728c62','matte'),vine);leaf.scale.set(.14,.057,.095);leaf.rotation.z=k*.7;}
  K.batchRoof(vine);(K.vines??=[]).push(vine);
 }
 // Compact utility meters and exposed conduit give the rear a working purpose.
 for(const x of [w*.06,w*.15]){box(x,1.74,z-.19,.28,.37,.18,M.metal,false);const dial=cyl(x,1.78,z-.29,.071,.025,M.white);dial.rotation.x=Math.PI/2;rod([x,1.55,z-.18],[x,.24,z-.18],.012,M.metal);}
 s.serviceFacade={windows,doorX,approach:s.world(doorX,z-1.08),lanePoint:s.world(0,z-1.20)};
 if(s.angle===0)s.northFacade=s.serviceFacade;
 if(s.kind==='books'){
  // Weatherproof community display and a wall-mounted book-return slot.
  const x=-.16*w;box(x,1.55,z-.155,1.65,.78,.10,M.wood,false);sign(['TSUKI READING CLUB','FRIDAY EVENINGS'],x,1.72,z-.216,1.40,.24,'#e8d8b7','#68516f',Math.PI);
  for(let j=0;j<3;j++)sign(['POETRY','FICTION','LOCAL ZINES'][j],x-.48+j*.48,1.39,z-.218,.40,.27,['#c7a58d','#9daca4','#b2a1bc'][j],'#38454b',Math.PI);
  box(w*.17,1.25,z-.24,.74,.30,.24,M.metal,false);box(w*.17,1.28,z-.37,.57,.075,.02,M.dark,false);sign('BOOK RETURNS',w*.17,1.01,z-.14,.79,.11,null,'#ece2c9',Math.PI);
  s.serviceFacade.feature='community display and book return';
 }else if(s.kind==='ramen'){
  const x=-.13*w;box(x,1.42,z-.145,1.7,.74,.07,M.cream,false);sign(['YORU RAMEN','BROTH MADE DAILY'],x,1.42,z-.19,1.5,.56,'#d8b491','#894f3d',Math.PI);
  box(w*.12,2.92,z-.20,.65,.42,.20,M.dark,false);for(let j=0;j<5;j++)box(w*.12,2.77+j*.075,z-.31,.57,.034,.055,M.metal,false);
  s.serviceFacade.feature='kitchen louvre and painted wall panel';
 }
};
