AME.buildShops = function(K,scene,layout){
  const {T,M,mat,surface,basic,use,box,cyl,ball,ring,rod,sign,glass,obstacle,solid,rand,pack,bottle,shelf,stool,cup,coffeeMachine,plant,lantern,board,ac,packs}=K;
  const shops=[];
  for(const data of layout.shops){
    const g=new T.Group();g.name=data.name;g.position.set(data.x,0,data.z);g.rotation.y=data.angle;scene.add(g);use(g);
    const {w,d,kind}=data,front=d/2,wall=mat(data.wall,.17),accent=mat(data.color,.23);
    const s={...data,roofColor:data.roof,group:g,doors:[],open:0,roof:null};shops.push(s);
    const world=(x,z)=>new T.Vector3(x,0,z).applyAxisAngle(new T.Vector3(0,1,0),data.angle).add(new T.Vector3(data.x,0,data.z));
    s.world=world;s.entry=world(0,front+.8);s.inside=world(0,front-1.5);s.look=world(-w*.28,front-1.6);
    box(0,.085,0,w,.17,d,wall);box(0,.183,0,w-.2,.026,d-.2,M.floor,false);
    for(let x=-w/2+.4;x<w/2;x+=.6)box(x,.200,0,.008,.005,d-.18,mat('#bda98c',.24),false);
    for(let z=-d/2+.4;z<d/2;z+=.6)box(0,.200,z,w-.18,.005,.008,mat('#bda98c',.24),false);
    if(data.angle===0||kind==='books'||kind==='ramen')AME.buildNorthWall(K,s,wall);else if(kind==='florist')AME.buildRearGlazing(K,s,wall);else solid(0,1.9,-d/2,w,3.55,.18,wall);
    if(kind==='ramen')AME.buildSideGlazing(K,s,wall);else solid(-w/2,1.9,0,.18,3.55,d,wall);
    // Glazed side elevation; collision extends down to the pavement.
    obstacle(w/2,0,.16,d);box(w/2,.49,0,.15,.60,d,wall);
    for(let z=-d/2+.1;z<d/2;z+=1.25){const len=Math.min(1.18,d/2-z);if(len>.08){glass(w/2+.014,1.95,z+len/2,len,2.32,Math.PI/2);box(w/2,1.95,z,.12,2.55,.06,M.metal);}}
    box(w/2,3.23,0,.13,.07,d,M.metal);
    // Front display windows and a 1.9 m unobstructed doorway.
    for(const side of [-1,1]){const wing=w/2-.95,cx=side*(.95+wing/2);solid(cx,.48,front,wing,.57,.15,wall);obstacle(cx,front,wing,.16,g,'window');glass(cx,1.95,front+.02,wing-.06,2.33);box(cx,3.15,front,wing,.07,.13,M.metal);box(cx,.79,front,wing,.065,.13,M.metal);box(side*.96,1.83,front,.065,3.0,.15,M.metal);box(side*(w/2-.02),1.83,front,.08,3.0,.15,M.metal);for(let i=1;i<wing/1.4;i++)box(side*(.95+i*1.4),1.97,front,.045,2.35,.08,M.metal);}
    for(let j=0;j<2;j++){const dg=new T.Group();dg.userData.dynamic=true;dg.position.set(j===0?-.46:.46,0,front+.09);g.add(dg);s.doors.push(dg);glass(0,1.62,0,.9,2.85,0,dg);box(-.455,1.64,0,.035,2.90,.07,M.metal,true,dg);box(.455,1.64,0,.035,2.90,.07,M.metal,true,dg);box(0,.2,0,.91,.045,.07,M.metal,true,dg);box(0,3.08,0,.91,.045,.07,M.metal,true,dg);box(0,1.2,.035,.91,.12,.015,accent,false,dg);sign('AUTOMATIC DOOR',0,1.2,.05,.57,.075,null,'#fff2d8',0,dg);}
    box(0,3.21,front,2.14,.22,.29,M.dark);box(0,3.19,front+.16,.20,.08,.045,M.black,false);
    box(0,.206,front+.42,1.8,.025,.67,mat('#49665e'));sign('WELCOME',0,.224,front+.45,1.14,.22,null,'#ccd6bc').rotation.x=-Math.PI/2;
    AME.buildFacade(K,s);
    // All roof parts can be hidden together for close inspection.
    const roof=new T.Group();roof.userData.dynamic=true;g.add(roof);s.roof=roof;
    AME.buildRoof(K,s,roof);
    // Ceiling strips, rear door and back room lockers.
    for(const x of [-w*.27,w*.27])box(x,3.67,0,w*.32,.035,.15,basic('#ffeabf'),false,roof);
    box(w*.35,1.37,-d/2+.107,.86,2.35,.035,mat('#77908b'));sign('STAFF',w*.35,1.95,-d/2+.132,.51,.13,'#c9d0b7','#44605e');box(w*.35+.28,1.35,-d/2+.155,.035,.2,.045,M.metal,false);
    ac(s.serviceFacade?w*.10:w/2-.7,-d/2-.45,Math.PI);cyl(-w/2+.06,1.9,-d/2-.12,.055,3.7,M.metal);
    // Warm local illumination; it has no expensive shadow map.
    const light=new T.PointLight(K.linear(kind==='mart'?'#fff0cd':kind==='cafe'?'#ffd399':'#ffe0af'),2.1,w*.85,1.3);light.position.set(0,2.8,.5);g.add(light);s.light=light;
    const spill=new T.SpotLight(K.linear('#ffdea5'),2.9,9,Math.PI*.34,.6,1.1);spill.position.set(0,3.05,front+.55);spill.target.position.set(0,.15,front+3.0);spill.castShadow=true;spill.shadow.mapSize.set(512,512);spill.shadow.bias=-.0005;spill.shadow.normalBias=.025;g.add(spill,spill.target);s.spill=spill;
    // Window promotions and a small outdoor display leave the central aisle open.
    sign(kind==='books'?['NEW','BOOKS']:kind==='florist'?['SEASONAL','FLOWERS']:['TODAY’S','SPECIALS'],w*.31,2.33,front+.043,.51,.64,kind==='ramen'?'#db6e61':'#e9c18c','#554c50');
    s.outdoorPlant=plant(kind==='cafe'?-w/2-.40:-w/2+.35,front+(kind==='mart'?1.40:.55),.27,kind==='florist');
    s.board=board(kind==='cafe'?w/2+.48:w/2-.55,front+.95,kind==='mart'?['COFFEE','$2.50','HOT SNACKS']:kind==='cafe'?['HAND DRIP','COFFEE','$4.50']:kind==='bakery'?['FRESH','MELON PAN','$3.50']:kind==='books'?['TAKE A','LITTLE','STORY']:kind==='ramen'?['HOT BOWLS','RAMEN','$14.50']:['FLOWERS','FOR YOU','MIDORI']);
    if(kind==='mart'){
      // Five drink coolers with four stocked rows each.
      for(let n=0;n<5;n++){const x=-w/2+.75+n*1.25,z=-d/2+.43;solid(x,1.45,z,1.16,2.50,.60,M.cream);box(x,1.48,z+.32,1.05,2.12,.024,mat('#7fb9af',.55),false);for(let row=0;row<4;row++){const y=.38+row*.49;box(x,y,z+.50,1.05,.05,.42,M.white);for(let j=0;j<6;j++)bottle(x-.44+j*.175,y+.03,z+.49,j+row+n);}glass(x,1.46,z+.76,1.09,2.2);box(x+.49,1.50,z+.78,.026,.51,.035,M.dark,false);sign('COLD DRINKS',x,2.69,z+.78,1.04,.15,'#669b98');}
      shelf(-2.25,-.60,2.5);shelf(2.5,-.60,2.6,'bento',1.35);
      solid(-3.22,.72,1.98,2.6,1.08,.70,M.wood);box(-3.22,1.30,1.98,2.72,.10,.85,M.cream);coffeeMachine(-4.03,1.98,1.35);
      box(-2.65,1.56,1.98,.4,.37,.1,M.dark);sign('$8.75',-2.65,1.57,2.038,.32,.20,'#628d82');
      box(-3.31,1.40,2.02,.58,.16,.46,M.metal);for(let n=0;n<4;n++)ball(-3.48+n%2*.27,1.5,1.89+Math.floor(n/2)*.22,.085,mat('#e5bd77',.4));sign('ODEN',-3.3,1.36,2.271,.48,.10,'#bc8559');
      solid(2.96,.68,2.13,1.72,.98,.61,M.white);box(2.96,1.19,2.13,1.75,.07,.67,mat('#b7d7c9',.5));sign('ICE CREAM',2.96,.86,2.447,1.25,.23,'#6caaad');shelf(4.16,1.63,.80,'books',1.5);
      for(const x of [-4.20,-2.0])rod([x,3.70,1.50],[x,3.10,1.50],.014,M.metal);
      sign(['A WARM MOMENT','COFFEE · RICE BALLS · BENTO'],-3.1,2.91,1.5,2.8,.38,'#f2d49a','#7d5f51');
      // Triangle rice balls in the open refrigerated island.
      const tri=new T.Shape();tri.moveTo(-.09,0);tri.lineTo(0,.17);tri.lineTo(.09,0);tri.closePath();const rg=new T.ExtrudeGeometry(tri,{depth:.08,bevelEnabled:false});
      for(let j=0;j<10;j++){K.mesh(rg,M.cream,1.6+(j%5)*.24,1.547,-.4+Math.floor(j/5)*.22);box(1.6+(j%5)*.24,1.65,-.306+Math.floor(j/5)*.22,.067,.083,.015,M.dark,false);}
      for(let i=0;i<3;i++)box(-1.60,.208,2.3-i*.42,.38,.01,.06,M.yellow,false);
    }else if(kind==='cafe'){
      solid(-2.7,.74,-.9,1.50,1.10,3.6,M.wood);box(-2.7,1.33,-.9,1.58,.10,3.72,M.cream);coffeeMachine(-2.85,.48,1.38);
      for(let i=0;i<3;i++){stool(-1.35,-1.8+i*1.0,'#538f98');cup(-2.03,1.39,-1.8+i*1.0);}
      sign(['KISSA AO','DRIP $4.50  ·  LATTE $5.50','CAKE & COFFEE $9.50'],-2.0,2.65,-3.37,2.8,.76,'#355e65');
      s.sofas=[];
      for(const z of [-1.8,1.45]){solid(2.15,.88,z,1.10,.09,1.10,M.wood);stool(1.28,z,'#7ba19e');cup(1.92,.93,z);cup(2.44,.93,z);cyl(2.15,.535,z,.07,.60,M.dark);cyl(2.15,.216,z,.26,.04,M.dark);
        const sofa=new T.Group();sofa.position.set(3.57,0,z);sofa.rotation.y=-Math.PI/2;sofa.name='Café window sofa';g.add(sofa);const fabric=surface(z<0?'#5f9291':'#a67e67','matte'),seam=surface(z<0?'#497877':'#8b6656','matte');
        for(const x of [-.65,.65])for(const zz of [-.29,.26])box(x,.30,zz,.07,.20,.07,M.wood,false,sofa);
        box(0,.48,0,1.62,.20,.81,fabric,false,sofa);box(0,.99,-.34,1.62,.90,.14,fabric,false,sofa);
        for(const x of [-.77,.77])box(x,.78,.02,.15,.55,.85,fabric,false,sofa);
        for(const x of [-.35,.35]){box(x,.64,.04,.67,.15,.62,fabric,false,sofa);box(x,.723,.04,.62,.012,.57,seam,false,sofa);box(x,1.04,-.235,.67,.54,.14,fabric,false,sofa);}
        const pillow=box(-.52,.91,-.06,.29,.29,.16,surface('#c8b792','matte'),false,sofa);pillow.rotation.z=.16;
        obstacle(0,0,1.79,.91,sofa,'café sofa');s.sofas.push({object:sofa,x:3.57,z,approach:world(2.91,z+1.18),floor:.20,seat:.721});
      }
      shelf(.25,-2.7,1.5,'coffee',1.35);sign('SLOW EVENINGS',2.5,2.58,-3.35,1.7,.34,'#d5bb88','#53666a');plant(3.96,2.87,.25);
      for(const x of [-2.7,2.25]){cyl(x,3.18,.6,.28,.18,basic('#f4c079'));rod([x,3.28,.6],[x,3.74,.6],.018,M.dark);}
    }else if(kind==='bakery'){
      solid(-2.5,.71,.65,1.95,1.05,3.35,M.wood);box(-2.5,1.28,.65,2.06,.09,3.45,M.cream);
      for(let row=0;row<5;row++)for(let j=0;j<4;j++){const x=-3.18+j*.43,z=-.7+row*.62;box(x,1.35,z,.38,.05,.45,M.wood,false);}
      glass(-2.5,1.61,2.36,1.93,.57);sign('FRESHLY BAKED',-2.5,1.03,2.381,1.5,.21,'#c88560');
      shelf(2.5,-.8,2,'pantry',1.5);solid(-1.50,1.33,-2.94,3.65,2.3,.66,M.metal);for(let n=0;n<3;n++){box(-1.5,.65+n*.65,-2.586,3.29,.46,.06,M.dark);box(-1.5,.65+n*.65,-2.542,2.99,.31,.025,mat('#bc8756',.6));box(-1.5,.87+n*.65,-2.51,2.35,.032,.07,M.metal,false);}
      sign(['KOMUGI','FLOUR · BUTTER · CARE'],1.1,2.95,-3.35,2.55,.46,'#f0c98b','#92604d');solid(2.50,.79,2.22,1.7,1.2,.7,M.wood);box(2.5,1.42,2.22,1.78,.07,.79,M.cream);box(2.5,1.64,2.2,.38,.36,.10,M.dark);
    }else if(kind==='books'){
      shelf(-2.35,-2.56,1.45,'books',2.55);shelf(-.5,-2.56,1.55,'books',2.55);shelf(1.42,-2.56,1.5,'books',2.55);shelf(-2.13,.12,1.70,'books',1.75);
      solid(2,.86,.15,1.35,.12,1.6,M.wood);for(const x of [1.5,2.5])for(const z of [-.48,.78])cyl(x,.50,z,.045,.60,M.dark);for(let j=0;j<6;j++){const o=box(1.63+j%2*.56,.97,-.35+Math.floor(j/2)*.45,.45,.10,.48,packs[j],true);o.rotation.y=(j%2?1:-1)*.10;}stool(2,1.65,'#8f729d');
      solid(-2.04,.72,2.31,1.93,1.07,.76,M.wood);box(-2.04,1.31,2.31,2.0,.10,.85,M.cream);box(-2.36,1.52,2.3,.39,.33,.10,M.dark);sign(['月の本棚','A LITTLE STORY FOR THE RAIN'],0,2.98,-3.37,3.8,.43,'#7b718d');
      box(2.02,1.59,-.445,1.24,.20,.035,M.wood);rod([1.60,.92,-.44],[1.60,1.49,-.44],.018,M.metal);rod([2.44,.92,-.44],[2.44,1.49,-.44],.018,M.metal);sign('NEW ARRIVALS',2.02,1.59,-.42,1.2,.16,'#b394aa');plant(2.7,2.53,.28);
    }else if(kind==='ramen'){
      solid(-2.25,.73,-.3,1.5,1.10,4.1,M.wood);box(-2.25,1.34,-.3,1.64,.12,4.20,mat('#cf8e65',.24));
      for(let j=0;j<4;j++){const z=-1.78+j*1.03;stool(-1.07,z,'#d07c63');cyl(-1.83,1.43,z,.17,.15,M.cream);cyl(-1.83,1.512,z,.145,.011,mat('#c99652',.45));for(let k=0;k<3;k++)ball(-1.87+k*.046,1.53,z,.028,M.green);rod([-1.69,1.55,z-.14],[-1.69,1.56,z+.19],.012,M.wood);}
      solid(1.91,.69,-2.7,2.10,1.0,.88,M.metal);for(let j=0;j<3;j++){cyl(1.18+j*.72,1.33,-2.65,.25,.39,M.metal);cyl(1.18+j*.72,1.54,-2.65,.27,.055,M.dark);}box(1.9,2.9,-2.8,2.55,.48,1.16,M.metal);box(1.9,3.45,-2.88,.54,.68,.48,M.metal);
      solid(2.06,.77,.64,1.42,.10,1.12,M.wood);for(const x of [1.49,2.63])for(const z of [.22,1.06])cyl(x,.46,z,.04,.52,M.dark);stool(2.06,-.22);stool(2.06,1.52);cup(2.27,.84,.62);
      sign('RAMEN MENU',-1.67,2.96,-3.38,2.38,.30,'#eac493','#714c41');
      for(const x of [-2.7,2.6])lantern(x,2.67,front+.49,'#ef9670');for(let i=0;i<4;i++){box(-.72+i*.48,2.72,front+.22,.44,.58,.03,mat('#c85855'));sign(['ら','ー','め','ん'][i],-.72+i*.48,2.72,front+.245,.34,.29,null);}
    }else{
      for(const [row,z] of [-1.4,.25,1.90].entries()){solid(-2.18,.55,z,1.42,.69,1.03,M.wood);for(const [col,x] of [-2.55,-1.91].entries())plant(x,z,.23,['rose','tulip','daisy','lavender','sunflower','rose'][row*2+col],.90,false);}
      shelf(1.95,-1.95,2.0,'flowers',1.4);solid(2.0,.79,1.6,1.74,1.18,.72,M.wood);box(2.0,1.43,1.6,1.81,.09,.80,M.cream);box(2,1.50,1.6,.52,.04,.40,mat('#e8ca9e'));
      for(let j=0;j<4;j++){const x=-2.5+j*1.12;plant(x,-2.55,.30,['rose','lavender','tulip','daisy'][j]);plant(x,-2.52,.19,false,2.53,false);for(const dx of [-.14,.14])rod([x+dx,2.93,-2.52],[x,3.68,-2.52],.010,M.metal);}

      sign(['みどり花店','FLOWERS FOR EVERY DAY'],0,2.97,-d/2+.14,3.4,.44,'#73a28a');plant(w/2-.25,front+1.54,.33,true);
    }
  }
  use(scene);return shops;
};
