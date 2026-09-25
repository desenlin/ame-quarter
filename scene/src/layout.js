/* Coordinates in metres. Shop fronts point along local +Z. */
window.AME = window.AME || {};
AME.layout = {
  bounds: { minX: -26, maxX: 26, minZ: -26, maxZ: 26 },
  road: { south: {minZ:15.2,maxZ:21.8,laneWidth:3.3,centers:[16.85,20.15]}, east:{minX:17.2,maxX:23.8}, west:{minX:-25.8,maxX:-19.2}, north:{minZ:-20.8,maxZ:-14.2} },
  ground: [[-26,26,-26,26]],
  walks: [[-25.8,17.2,21.8,25.8],[23.8,25.8,-20.8,15.2],[23.8,25.8,21.8,25.8],[15.4,17.2,9.5,15.2],[-25.8,25.8,-25.8,-20.8]],
  intersection: {minX:17.2,maxX:23.8,minZ:15.2,maxZ:21.8,eastEnd:26,southEnd:26},
  shops: [
    {id:'mart', name:'AME MART', jp:'雨まち', kind:'mart', x:-12,z:-8,w:10,d:7,angle:0,color:'#39bdaa',wall:'#ded7b7',roof:'#436780',subtitle:'24 HOURS · BENTO & RICE BALLS'},
    {id:'cafe', name:'KISSA AO', jp:'喫茶 青', kind:'cafe', x:0,z:-8,w:9,d:7,angle:0,color:'#597dab',wall:'#adc9c5',roof:'#485d79',subtitle:'COFFEE & SLOW EVENINGS'},
    {id:'bakery', name:'KOMUGI', jp:'こむぎ', kind:'bakery', x:10,z:-8,w:8,d:7,angle:0,color:'#e89870',wall:'#e3bd99',roof:'#ab756c',subtitle:'FRESHLY BAKED · BAKERY'},
    {id:'books', name:'TSUKI BOOKS', jp:'月の本棚', kind:'books', x:-14,z:3,w:7,d:7,angle:Math.PI/2,color:'#ad8cb9',wall:'#baadbc',roof:'#666d92',subtitle:'BOOKS · ZINES · STATIONERY'},
    {id:'ramen', name:'YORU RAMEN', jp:'夜らーめん', kind:'ramen', x:-14,z:10.8,w:8,d:7,angle:Math.PI/2,color:'#e16665',wall:'#ad9785',roof:'#5c627b',subtitle:'NOODLES & SOUP · OPEN LATE'},
    {id:'florist', name:'MIDORI', jp:'みどり花店', kind:'florist', x:10,z:4,w:7,d:6,angle:-Math.PI/2,color:'#87b792',wall:'#d7caae',roof:'#637f79',subtitle:'FLOWERS FOR EVERY DAY'}
  ]
};

AME.onGround=(x,z,pad=0)=>AME.layout.ground.some(([a,b,c,d])=>x>=a+pad&&x<=b-pad&&z>=c+pad&&z<=d-pad);
AME.onWalk=(x,z)=>AME.layout.walks.some(([a,b,c,d])=>x>=a&&x<=b&&z>=c&&z<=d);
