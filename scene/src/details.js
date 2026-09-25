/* Close-range furnishing recipes. All placements use each shop's local coordinates. */
AME.enrichShops=function(K,shops){
  const {T,M,use,box,cyl,ball,ring,rod,sign,glass,mesh,mat,surface,pack,bottle,rand}=K;
  const linen=surface('#d8cba9','matte'),brass=surface('#b69a50','metal'),steel=M.metal;
  const bread=surface('#c88736','matte'),crust=surface('#ead08e','matte'),soil=surface('#44362c','matte');
  const petals=['#c84e77','#e69a76','#e5bd52','#b892cc','#e9dfc2'].map(c=>surface(c,'matte'));
  const paper=['#d6a1b8','#b5c9a1','#e7d4a6','#a9bed4'].map(c=>surface(c,'matte'));
  function plate(x,y,z,r=.17){cyl(x,y,z,r,.025,M.white);const rim=ring(x,y+.016,z,r*.91,M.white);rim.rotation.x=Math.PI/2;}
  function jar(x,y,z,color='#7e5943'){cyl(x,y+.11,z,.079,.22,surface(color,'ceramic'));cyl(x,y+.234,z,.082,.035,brass);}
  function bag(x,y,z,k=0){box(x,y+.13,z,.18,.25,.11,paper[k%4],false);const a=ring(x,y+.28,z,.055,linen);a.scale.y*=1.15;}
  function croissant(x,y,z,scale=1){const geo=new T.TorusGeometry(.10,.041,7,12,Math.PI*1.6),o=mesh(geo,bread,x,y,z,scale,scale,scale);o.rotation.x=Math.PI/2;for(let i=0;i<5;i++){const a=i*.7;const o=ball(x+Math.cos(a)*.09*scale,y+.02*scale,z+Math.sin(a)*.09*scale,.038*scale,crust);o.scale.y*=.32;}}
  function chalk(x,y,z,lines,w=1.15,h=.7){box(x,y,z,w+.10,h+.1,.065,M.wood);sign(lines,x,y,z+.041,w,h,'#213c39','#e4d7b6');}
  function handle(x,y,z,w=.2){rod([x-w/2,y,z],[x+w/2,y,z],.016,steel);}
  function smallPoster(x,y,z,w,h,title,bg){box(x,y,z,w+.04,h+.04,.025,M.wood,false);sign([title,'AME QUARTER'],x,y,z+.019,w,h,bg,'#f1e8cc');}
  for(const s of shops){use(s.group);const f=s.d/2;
    // Wainscot, baseboards, electrical fittings, window locks and a clock.
    box(0,.35,-s.d/2+.12,s.w-.15,.30,.06,M.wood,false);
    for(const side of [-1,1])box(side*(s.w/2-.12),.25,0,.04,.09,s.d-.2,M.dark,false);
    for(let z=-s.d/2+.8;z<f;z+=1.25){box(s.w/2-.03,1.18,z,.05,.17,.045,brass,false);}
    cyl(s.w*.30,2.85,-s.d/2+.16,.19,.055,M.dark).rotation.x=Math.PI/2;
    const clock=K.plane(s.w*.30,2.85,-s.d/2+.2,.33,.33,new T.MeshBasicMaterial({map:K.texture((c,w,h)=>{c.fillStyle='#e6debf';c.beginPath();c.arc(w/2,h/2,w*.49,0,Math.PI*2);c.fill();c.strokeStyle='#283f4a';c.lineWidth=5;for(let i=0;i<12;i++){const a=i*Math.PI/6;c.beginPath();c.moveTo(w/2+Math.sin(a)*w*.36,h/2+Math.cos(a)*h*.36);c.lineTo(w/2+Math.sin(a)*w*.43,h/2+Math.cos(a)*h*.43);c.stroke();}c.lineWidth=8;c.beginPath();c.moveTo(w*.5,h*.5);c.lineTo(w*.32,h*.34);c.moveTo(w*.5,h*.5);c.lineTo(w*.75,h*.32);c.stroke();},128,128),transparent:true,toneMapped:false}));
    // Wall-mounted extinguisher, outlet and staff notice add believable service detail.
    cyl(s.w*.41,.54,-s.d/2+.29,.09,.56,mat('#b7414a'));cyl(s.w*.41,.855,-s.d/2+.29,.035,.08,steel);box(s.w*.41,.57,-s.d/2+.385,.10,.19,.01,M.white,false);
    smallPoster(s.kind==='florist'?1.48:-s.w*.39,s.kind==='ramen'?1.72:2.11,-s.d/2+.17,.40,.53,'RAINY DAYS','#8d687d');
    for(let x=-s.w/2+.7;x<s.w/2;x+=2.1){box(x,.57,-s.d/2+.15,.11,.15,.04,M.white,false);box(x-.023,.57,-s.d/2+.173,.008,.045,.008,M.dark,false);box(x+.023,.57,-s.d/2+.173,.008,.045,.008,M.dark,false);}
    // Timber facade detail and illuminated hanging blade signs distinguish street silhouettes.
    if(s.kind!=='mart')for(let i=0;i<6;i++)box(-s.w/2+.12+i*.13,1.94,f+.11,.033,2.40,.08,M.wood,false);
    const blade=new T.Group();blade.position.set(s.w/2+.23,2.83,f-.45);s.group.add(blade);box(0,0,0,.13,.83,.63,surface(s.color),true,blade);sign(s.jp, .075,0,0,.54,.66,s.color,'#fff0ce',Math.PI/2,blade);sign(s.jp,-.075,0,0,.54,.66,s.color,'#fff0ce',-Math.PI/2,blade);rod([0,.48,0],[-.30,.48,0],.035,steel,blade);
    // The low rail and glazing on display islands expose actual 3D merchandise.
    if(s.kind==='mart'){
      for(let n=0;n<5;n++){const x=-s.w/2+.75+n*1.25,z=-s.d/2+.43;for(let r=0;r<4;r++){const y=.38+r*.49;box(x,y+.044,z+.719,1.04,.066,.024,M.white,false);for(let j=0;j<3;j++)sign(['$2.50','$3.00','$3.50'][j],x-.33+j*.33,y+.045,z+.735,.25,.038,'#f2e8ce','#3a4e50');}}
      for(let r=0;r<3;r++)for(let j=0;j<4;j++){const x=-3.10+j*.52,z=-.3,y=.44+r*.33;cyl(x,y+.12,z,.075,.19,paper[j%4]);cyl(x,y+.223,z,.085,.02,M.yellow);sign('NOODLE',x,y+.13,z+.08,.12,.055,null,'#43535d');}
      for(let r=0;r<2;r++)for(let j=0;j<4;j++){const x=1.65+j*.53,z=-.39+r*.28;box(x,1.575,z,.43,.045,.24,M.black,false);box(x-.09,1.615,z,.18,.025,.19,M.cream,false);for(let q=0;q<4;q++)ball(x+.06+(q%2)*.07,1.637,z-.05+Math.floor(q/2)*.08,.031,q%2?M.green:bread);}
      // Payment terminal, receipt roll, impulse sweets and basket stack.
      box(-2.12,1.48,2.00,.30,.26,.25,M.dark);const pos=box(-2.12,1.67,1.99,.29,.09,.25,M.black);pos.rotation.x=-.35;sign('TAP / IC',-2.12,1.49,2.131,.24,.065,'#3b6366');
      for(let i=0;i<4;i++){pack(-3.45+i*.20,1.35,2.26,i,.15,.18);box(-4.42,.29+i*.085,2.98,.5,.075,.38,surface('#267565'),true);}
      for(let r=0;r<3;r++)for(let j=0;j<2;j++){const x=3.94+j*.25,y=.43+r*.34,z=2.03;const cover=sign(['TRAVEL','TOKYO','LIFE','HOME','CAFE','STORY'][r*2+j],x,y+.15,z,.22,.30,['#bd6072','#55958e','#577eaf'][r],'#f5e5bd');cover.rotation.x=-.14;}
      for(let j=0;j<3;j++){jar(-4.24+j*.16,1.35,1.51,'#967248');}
    }else if(s.kind==='cafe'){
      // Multi-group espresso machine, grinder and drippers with glass carafes.
      box(-2.72,1.68,-1.50,1.03,.58,.57,steel);box(-2.72,1.60,-1.18,.92,.22,.055,M.dark);for(let j=0;j<3;j++){cyl(-3.03+j*.29,1.91,-1.50,.06,.035,brass);rod([-3.03+j*.29,1.63,-1.17],[-3.03+j*.29,1.54,-1.02],.016,steel);K.cup(-3.03+j*.29,1.41,-1.02);}box(-2.72,1.395,-1.23,.97,.03,.6,steel,false);
      cyl(-2.67,1.42,-2.34,.18,.08,steel);cyl(-2.67,1.65,-2.34,.14,.40,M.dark);cyl(-2.67,1.98,-2.34,.16,.24,surface('#78604b','ceramic'));cyl(-2.67,2.12,-2.34,.17,.026,steel);
      for(const z of [-.60,-.12]){cyl(-2.42,1.54,z,.10,.26,M.white);const cone=mesh(new T.ConeGeometry(.14,.16,14),brass,-2.42,1.75,z);cone.rotation.x=Math.PI;plate(-2.42,1.395,z,.15);}
      for(const z of [-1.8,1.45]){plate(2.25,.95,z);box(2.25,1.01,z,.15,.08,.15,mat('#ecd0a0'),false);box(2.25,1.06,z,.15,.025,.15,mat('#713f34'),false);ball(2.25,1.10,z,.036,petals[0]);box(2.57,.945,z+.3,.25,.016,.16,linen,false);}
      chalk(.8,2.10,-3.35,['SINGLE ORIGIN','Ethiopia / washed','Floral · citrus'],1.5,.80);
      for(let i=0;i<7;i++)bag(-.35+i*.18,1.55,-2.37,i);
      for(const x of [-2.7,2.25]){const shade=mesh(new T.ConeGeometry(.40,.23,16,1,true),surface('#bda065','metal'),x,3.23,.6);shade.rotation.x=Math.PI;}
      smallPoster(-.4,2.90,-3.34,1.15,.60,'JAZZ & COFFEE','#345f77');
    }else if(s.kind==='bakery'){
      // Five small batches have visibly different silhouettes, crusts and toppings.
      s.breads=[];const crusts=['#c88736','#b77630','#d69d52','#bd8448'].map(c=>surface(c,'matte'));
      for(let r=0;r<5;r++)for(let j=0;j<4;j++){
        const x=-3.18+j*.43,z=-.70+r*.62,k=j%2,base=1.375,skin=crusts[(j+r)%4];let type;
        if(r===0){type='croissant';const scale=.94+(j%3)*.08;croissant(x,base+.041*scale,z,scale);}
        else if(r===1&&k===0){type='chocolate roll';const o=ball(x,base+.075,z,.11,skin);o.scale.multiply(new T.Vector3(1.15,.68,.85));for(const dx of [-.05,.05])box(x+dx,base+.06,z+.095,.037,.045,.028,surface('#674330','matte'),false);}
        else if(r===1){type='cinnamon swirl';cyl(x,base+.047,z,.123,.094,skin);const curve=[];for(let n=0;n<48;n++){const t=n/47*5*Math.PI,rr=.007+n/47*.095;curve.push(new T.Vector3(x+Math.cos(t)*rr,base+.098,z+Math.sin(t)*rr));}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(curve),48,.009,5,false),surface('#87572f','matte'),0,0,0);}
        else if(r===2&&k===0){type='melon pan';const o=ball(x,base+.070,z,.129,crust);o.scale.y*=.58;for(let n=-1;n<=1;n++){const line=box(x+n*.054,base+.137,z,.012,.008,.18,skin,false);line.rotation.y=.40;const line2=box(x,base+.138,z+n*.05,.18,.008,.012,skin,false);line2.rotation.y=.40;}}
        else if(r===2){type='sourdough boule';const o=ball(x,base+.078,z,.129,skin);o.scale.y*=.64;for(const dx of [-.045,.025]){const score=box(x+dx,base+.158,z,.018,.01,.15,crust,false);score.rotation.y=-.3;}}
        else if(r===3){type='baguette';const o=ball(x,base+.060,z,.12,skin);o.scale.multiply(new T.Vector3(.72,.5,2.33));for(let k=0;k<4;k++){const score=box(x,base+.119,z-.17+k*.11,.112,.010,.022,crust,false);score.rotation.y=.35;}}
        else if(k===0){type='berry tart';cyl(x,base+.03,z,.13,.06,skin);cyl(x,base+.065,z,.112,.018,M.cream);for(let k=0;k<7;k++){const a=k*2.4;ball(x+Math.cos(a)*.069,base+.091,z+Math.sin(a)*.069,.03,petals[0]);}}
        else{type='custard danish';box(x,base+.04,z,.23,.08,.23,skin,false);box(x,base+.086,z,.14,.015,.14,M.yellow,false);const apricot=ball(x,base+.114,z,.055,surface('#df953e','matte'));apricot.scale.y*=.45;}
        s.breads.push({type,x,z});
      }
      for(let r=0;r<5;r++)sign(['CROISSANT $4.25','CHOCOLATE $4.50 / CINNAMON $4.00','MELON PAN $3.50 / SOURDOUGH $5.00','BAGUETTE $5.50','BERRY $5.25 / CUSTARD $4.75'][r],-2.50,1.36,-.91+r*.62,1.46,.07,'#f3e2bb','#6d4c37');
      glass(-3.48,1.70,.65,3.44,.70,Math.PI/2);glass(-1.50,1.70,.65,3.44,.70,Math.PI/2);box(-2.50,2.065,.65,2.05,.033,3.44,M.glass,false);
      for(let i=0;i<3;i++){bag(2.1+i*.30,1.46,2.16,i);plate(2.44,1.485,2.40,.27);}rod([2.35,1.52,2.42],[2.63,1.52,2.42],.018,steel);rod([2.35,1.52,2.44],[2.60,1.52,2.49],.016,steel);
      for(let i=0;i<4;i++){box(-2.79+i*.71,.22,-2.45,.55,.04,.27,steel,false);handle(-2.79+i*.71,.30,-2.24,.26);}
      chalk(1.32,2.09,-3.33,['TODAY\'S BAKE','Sourdough · 11:00','Milk bread · 14:00'],1.14,.60);
    }else if(s.kind==='books'){
      const titles=['RAIN','TOKYO','GARDENS','KIN FOLK','WALK','JAPAN','COFFEE','DESIGN'];
      const coverTones=['#477877','#b58b50','#a4606f','#738bad','#8e7e9c','#8e9b66'];
      function coverArt(x,y,z,w,h,idx,flat=false){const cover=sign(titles[idx%8],x,y,z,w,h*.18,null,idx%2?'#e9dcbd':'#243e43');if(flat)cover.rotation.x=-Math.PI/2;
        if(!flat){if(idx%3===0){const disc=cyl(x,y-h*.27,z-.003,w*.22,.008,surface('#d4b477','matte'));disc.rotation.x=Math.PI/2;}else if(idx%3===1){for(let k=0;k<3;k++)box(x-w*.27+k*w*.26,y-h*.28,z,w*.15,h*.18,.007,paper[(idx+k)%4],false);}else {for(let k=0;k<4;k++)box(x,y-h*.19-k*h*.08,z,w*.68,.012,.007,linen,false);}}
      }
      for(let row=0;row<4;row++)for(let j=0;j<6;j++){const idx=j+row*3,w=.29+(j%3)*.045,h=.29+((j+row)%3)*.045,x=[-2.35,-.5,1.42][Math.floor(j/2)]+(j%2?1:-1)*.31,y=.325+row*.60+h/2;box(x,y,-2.03,w,h,.055,surface(coverTones[(j+row)%6]),false);coverArt(x,y+h*.27,-1.998,w*.89,h,idx);}
      for(let j=0;j<6;j++){const x=1.65+j%2*.56,z=-.34+Math.floor(j/2)*.45;sign(titles[j],x,1.023,z,.32+(j%3)*.022,.17,['#397477','#98657e','#bc9553'][Math.floor(j/2)],'#eadfc3').rotation.x=-Math.PI/2;}
      for(let i=0;i<4;i++){box(-1.64,1.39+i*.045,2.27,.38,.04,.44,paper[i],false);}
      cyl(-2.68,1.34,2.19,.13,.03,brass);rod([-2.68,1.36,2.19],[-2.68,1.79,2.19],.018,brass);rod([-2.68,1.79,2.19],[-2.52,1.82,2.19],.018,brass);mesh(new T.ConeGeometry(.15,.13,12,1,true),brass,-2.51,1.78,2.19).rotation.x=Math.PI;
      for(let i=0;i<3;i++){const r=box(2.2,.32+i*.10,2.5,.55,.09,.46,paper[i]);r.rotation.y=i*.06;}
      smallPoster(0,2.45,-3.34,.80,.72,'LOCAL WRITERS','#827199');
    }else if(s.kind==='ramen'){
      // Curved bowls, noodles, egg halves, chashu, nori, scallions, condiments.
      const bowl=new T.LatheGeometry([new T.Vector2(.06,0),new T.Vector2(.105,.02),new T.Vector2(.19,.12),new T.Vector2(.195,.15),new T.Vector2(.17,.15),new T.Vector2(.135,.065),new T.Vector2(.055,.03)],20);
      for(let j=0;j<4;j++){const z=-1.78+j*1.03,x=-1.83;mesh(bowl,petals[4],x,1.36,z);for(let n=0;n<5;n++){const noodle=ring(x+(n%2-.5)*.048,1.525,z+(Math.floor(n/2)-1)*.045,.064,crust);noodle.rotation.x=Math.PI/2;noodle.scale.y*=.62;}const egg=ball(x+.1,1.54,z+.04,.059,M.cream);egg.scale.y*=.38;const yolk=ball(x+.1,1.559,z+.04,.030,M.yellow);yolk.scale.y*=.4;const meat=cyl(x-.04,1.542,z-.075,.063,.02,petals[1]);box(x-.1,1.60,z+.055,.088,.17,.01,surface('#254839','matte'),false).rotation.z=-.24;
        for(let n=0;n<2;n++)jar(-2.89,1.41,z-.15+n*.27,n?'#954a3c':'#4a3c2d');cyl(-2.86,1.50,z+.35,.065,.18,M.wood);for(let n=0;n<5;n++)rod([-2.9+n*.02,1.46,z+.35],[-2.9+n*.02,1.87,z+.37],.008,crust);
      }
      for(let j=0;j<3;j++){cyl(1.18+j*.72,1.57,-2.65,.075,.06,M.dark);rod([.99+j*.72,1.52,-2.65],[.84+j*.72,1.52,-2.65],.018,steel);}
      for(let i=0;i<4;i++){const x=-2.62+i*.63;box(x,2.35,-3.33,.59,.62,.04,linen);sign([['SHOYU','$14.50'],['MISO','$15.50'],['GYOZA','$6.50'],['TEA','$2.50']][i],x,2.35,-3.299,.53,.43,null,'#4d3837');}
      box(2.06,.846,.64,.41,.03,.21,linen,false);jar(1.69,.85,.64,'#4c392f');
    }else{
      // Bouquets of separately modeled petals; vessels sit on the display benches.
      for(let j=0;j<4;j++){const x=1.27+j*.43;cyl(x,1.775,-1.65,.11,.32,paper[j]);cyl(x,1.947,-1.65,.115,.025,brass);}
      for(let j=0;j<3;j++){const o=box(1.72+j*.16,1.505,1.57,.56,.014,.47,paper[j],false);o.rotation.y=j*.18;}
      ring(2.46,1.515,1.79,.059,steel).rotation.x=Math.PI/2;rod([2.43,1.52,1.74],[2.26,1.52,1.48],.012,steel);rod([2.49,1.52,1.74],[2.37,1.52,1.46],.012,steel);
      for(let j=0;j<4;j++)sign(['ROSE $4 / TULIP $3','DAISY $2 / LAVENDER $4','SUNFLOWER $5','BOUQUETS FROM $24'][j],-2.18,.85,-1.07+j*.76,1.16,.09,'#dfcfb1','#4e6858');
      smallPoster(1.30,2.44,-2.84,.75,.75,'SEASONAL STEMS','#729b78');
    }
  }
};
