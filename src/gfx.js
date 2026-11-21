// ===================== GFX (sprites, tiles, battle backdrops) =====================
addStrings({},{});

function _gxCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g];}
function _gxP(g,x,y,col,w,h){g.fillStyle=col;g.fillRect(x,y,w||1,h||1);}
function _gxMix(a,b,k){const A=hexToRgb(a),B=hexToRgb(b);return rgbToHex(A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k,A[2]+(B[2]-A[2])*k);}
function _gxRgba(hex,a){const c=hexToRgb(hex);return'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}
// pixel ellipse (row scan, crisp)
function _gxEll(g,cx,cy,rx,ry,col){g.fillStyle=col;const R=Math.ceil(ry);for(let y=-R;y<=R;y++){const k=1-(y*y)/(ry*ry);if(k<0)continue;const w=Math.round(rx*Math.sqrt(k));if(w<=0)continue;g.fillRect(Math.round(cx-w),Math.round(cy+y),w*2,1);}}
// pixel disc tested per pixel centre
function _gxDisc(g,ox,oy,cx,cy,r,col){g.fillStyle=col;const x0=Math.floor(cx-r),x1=Math.ceil(cx+r),y0=Math.floor(cy-r),y1=Math.ceil(cy+r);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const dx=x+0.5-cx,dy=y+0.5-cy;if(dx*dx+dy*dy<=r*r)g.fillRect(ox+x,oy+y,1,1);}}
const _gxDefTheme={floor:'#78c850',floor2:'#68b040',path:'#d8c890',wall:'tree',wallA:'#307830',wallB:'#58a848',trunk:'#7a5030',
  grass:'#48a038',grass2:'#2f7a2a',water:'#4890e0',deco:['flower'],bg:['#88c8f8','#d8f0ff'],dark:false,particles:'none',voidCol:'#0b0a24'};
function _gxTheme(th){if(typeof th==='string')return(typeof THEMES!=='undefined'&&THEMES[th])||_gxDefTheme;return th||_gxDefTheme;}
function _gxThemeKey(th){if(typeof th==='string')return th;
  if(typeof THEMES!=='undefined')for(const k in THEMES)if(THEMES[k]===th)return k;
  if(!th)return'meadow';const d=th.deco||[];
  if(th.wall==='tree')return th.particles==='firefly'?'forest':'meadow';
  if(th.wall==='rock')return d.indexOf('cactus')>=0?'desert':'cave';
  return{pine:'snow',lavarock:'volcano',water:'coast',void:'sky',brick:'citadel',deadtree:'mire'}[th.wall]||'meadow';}

// ===================== CHARACTERS =====================
const CHAR_PALS=[
  {name:'player',cap:'#e03838',logo:'#ffffff',hair:'#5a3420',skin:'#f8c8a0',shirt:'#3a70e0',pants:'#2c3a68',shoes:'#c83028',acc:'#f0c040'},
  {name:'girl',cap:null,hair:'#f0c850',skin:'#f8d0b0',shirt:'#f070a0',pants:'#5050a0',shoes:'#803040',acc:'#ffffff'},
  {name:'elder',cap:null,hair:'#d0d0d8',skin:'#e8b890',shirt:'#8a5a30',pants:'#4a3a30',shoes:'#302020',acc:'#c0a060'},
  {name:'ranger',cap:'#3a9a40',logo:'#f8e060',hair:'#2a2018',skin:'#e8b088',shirt:'#f0c030',pants:'#405030',shoes:'#503020',acc:'#80c040'},
  {name:'mage',cap:'#7040b0',logo:'#f8e060',hair:'#303040',skin:'#f8d0b0',shirt:'#9050c8',pants:'#402060',shoes:'#281838',acc:'#f0c040'},
  {name:'merchant',cap:'#a06830',logo:'#f0d080',hair:'#3a2818',skin:'#f0c098',shirt:'#f0f0e8',pants:'#5a4030',shoes:'#3a2818',acc:'#40a050',apron:'#3c9c48'},
  {name:'knight',cap:'#2c2438',logo:'#2c2438',hair:'#1c1626',skin:'#141018',eye:'#ff3040',shirt:'#3a3048',pants:'#241c30',shoes:'#141018',acc:'#6a5a80',hood:true,outline:'#08060c'},
  {name:'sailor',cap:'#f8f8f8',logo:'#3060c0',hair:'#202838',skin:'#e0a880',shirt:'#283c80',pants:'#f0f0f0',shoes:'#202838',acc:'#e04040'},
  {name:'redhead',cap:null,hair:'#e06830',skin:'#f8d0b0',shirt:'#30b0a8',pants:'#304060',shoes:'#6a3020',acc:'#ffffff'},
  {name:'scholar',cap:'#304080',logo:'#e0c060',hair:'#6a4a30',skin:'#f0c8a0',shirt:'#e8e0c0',pants:'#4a3a60',shoes:'#2a2030',acc:'#a06040'}
];
const CHAR_PAL_IDX={player:0,merchant:5,knight:6};
// left halves (8 cols, mirrored) for down/up, rows 0..12
const _GX_CH_DOWN=['........','.....ooo','....occc','...occcc','...occcw','..oCCCCC','..ohhsss','..ohsess','..ohsess','...ossss','..otTttt','..otTttt','..osoppp'];
const _GX_CH_UP=['........','.....ooo','....occc','...occcc','...occcc','..occccc','..ohhhhh','..ohhhhh','..ohhhhh','...ohhhh','..otTaaa','..otTaaa','..osoppp'];
const _GX_CH_SIDE=[
  '................',
  '.....ooooo......',
  '....occccco.....',
  '...ocwccccco....',
  '...occcccccoo...',
  '...ohhCCCCCCCo..',
  '...ohhhsssso....',
  '...ohhsssseso...',
  '...ohhsssseso...',
  '....ohssssso....',
  '.....otttTo.....',
  '.....otaTTo.....',
  '.....oppppo.....'];
const _GX_LEGS={
  down:[['....oppppppo....','....oppooppo....','....obboobbo....'],
        ['....oppppppo....','....obbooppo....','........obbo....'],
        ['....oppppppo....','....oppoobbo....','....obbo........']],
  side:[['.....oppppo.....','......oppo......','......obbbo.....'],
        ['.....oppppo.....','....opo..opo....','...obbo..obbbo..'],
        ['.....oppppo.....','.....opoopo.....','....obbbobbo....']]};
const _gxCharCache=new Map();
function _gxCharCol(p,ch){
  switch(ch){
    case'o':return p.outline||'#1c1424';
    case'c':return p.cap||p.hair;
    case'C':return p.cap?shade(p.cap,-0.32):shade(p.hair,-0.18);
    case'w':return p.cap?(p.logo||'#fff'):shade(p.hair,0.3);
    case'h':return p.hair;
    case's':return p.skin;
    case'e':return p.eye||'#201828';
    case't':return p.shirt;
    case'T':return shade(p.shirt,-0.25);
    case'a':return p.acc;
    case'p':return p.pants;
    case'b':return p.shoes;
  }
  return null;
}
function _gxCharRows(dir,frame){
  let head;
  if(dir==='side')head=_GX_CH_SIDE.slice();
  else head=(dir==='up'?_GX_CH_UP:_GX_CH_DOWN).map(s=>s+s.split('').reverse().join(''));
  const legs=_GX_LEGS[dir==='side'?'side':'down'][frame%3];
  return head.concat(legs);
}
function charSprite(pal,dir,frame){
  if(typeof pal==='number')pal=CHAR_PALS[((pal%CHAR_PALS.length)+CHAR_PALS.length)%CHAR_PALS.length];
  pal=pal||CHAR_PALS[0];frame=(frame|0)%3;dir=DIRS[dir]?dir:'down';
  const key=JSON.stringify(pal)+dir+frame;
  let c=_gxCharCache.get(key);if(c)return c;
  const vd=dir==='left'||dir==='right'?'side':dir;
  const rows=_gxCharRows(vd,frame);
  let g;[c,g]=_gxCanvas(16,16);
  // walk bob: shift upper body down 1 on step frames
  const bob=frame?1:0;
  for(let y=0;y<16;y++){const s=rows[y]||'';for(let x=0;x<16;x++){
    let ch=s[x]||'.';if(ch==='.')continue;
    let col=_gxCharCol(pal,ch);
    if(pal.apron&&y>=10&&y<=13&&(ch==='t'||ch==='T'||ch==='p'||ch==='a')&&(vd==='down'?(x>=5&&x<=10):vd==='side'?(x>=8&&x<=9):false))col=y===10&&vd==='down'?shade(pal.apron,0.2):pal.apron;
    if(!col)continue;
    const yy=y<=12?y+bob:y;
    g.fillStyle=col;g.fillRect(x,yy,1,1);
  }}
  if(bob){// fill gap row between body and legs
    for(let x=0;x<16;x++){const ch=rows[12][x];if(ch&&ch!=='.'){const d=g.getImageData(x,13,1,1).data;if(!d[3]){g.fillStyle=_gxCharCol(pal,ch);g.fillRect(x,13,1,1);}}}}
  if(dir==='left'){const[m,mg]=_gxCanvas(16,16);mg.translate(16,0);mg.scale(-1,1);mg.drawImage(c,0,0);c=m;}
  _gxCharCache.set(key,c);return c;
}

// ===================== MONSTERS =====================
const _gxMonCache={};
function monSprite(id){
  if(_gxMonCache[id])return _gxMonCache[id];
  const sp=(typeof SPECIES!=='undefined'&&SPECIES[id])||{t:'normal',c:null};
  const boss=!!sp.boss,S=boss?32:24,h=S/2;
  const r=RNG(hashStr('mon:'+id));
  const m=new Uint8Array(S*S),part=new Uint8Array(S*S);
  const idx=(x,y)=>y*S+x;
  const inb=(x,y)=>x>=1&&x<S-1&&y>=1&&y<S-1;
  const set=(x,y,p)=>{x=Math.floor(x);y=Math.floor(y);if(inb(x,y)&&x<h){m[idx(x,y)]=1;if(!part[idx(x,y)]||p>part[idx(x,y)])part[idx(x,y)]=p;}};
  const blob=(cx,cy,rx,ry,p)=>{for(let y=0;y<S;y++)for(let x=0;x<h;x++){const dx=(x+0.5-cx)/rx,dy=(y+0.5-cy)/ry;if(dx*dx+dy*dy<=1)set(x,y,p);}};
  const tri=(ax,ay,bx,by,cx,cy,p)=>{const x0=Math.floor(Math.min(ax,bx,cx)),x1=Math.ceil(Math.max(ax,bx,cx)),y0=Math.floor(Math.min(ay,by,cy)),y1=Math.ceil(Math.max(ay,by,cy));
    const sg=(px,py,qx,qy,rx2,ry2)=>(px-rx2)*(qy-ry2)-(qx-rx2)*(py-ry2);
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const px=x+0.5,py=y+0.5;const d1=sg(px,py,ax,ay,bx,by),d2=sg(px,py,bx,by,cx,cy),d3=sg(px,py,cx,cy,ax,ay);
      const neg=d1<0||d2<0||d3<0,pos=d1>0||d2>0||d3>0;if(!(neg&&pos))set(x,y,p);}};
  const sc=S/24;
  const ak=r(),arch=ak<0.4?'biped':ak<0.65?'blob':ak<0.85?'floaty':'beast';
  const hasHead=arch==='biped'||arch==='beast'||(arch==='floaty'&&r()<0.3);
  const feet=arch!=='floaty'&&(arch!=='blob'||r()<0.7);
  const bottom=S-2-(feet?2*sc:arch==='floaty'?2*sc:0);
  let rx,ry,cy,hr=0,hcy=0;
  if(arch==='biped'){rx=S*(0.17+r()*0.06);ry=S*(0.15+r()*0.05);cy=bottom-ry;hr=S*(0.2+r()*0.05);hcy=cy-ry*0.55-hr*0.6;}
  else if(arch==='beast'){rx=S*(0.3+r()*0.08);ry=S*(0.15+r()*0.04);cy=bottom-ry;hr=S*(0.18+r()*0.04);hcy=cy-ry*0.6-hr*0.5;}
  else if(arch==='floaty'){rx=S*(0.22+r()*0.06);ry=S*(0.22+r()*0.05);cy=bottom-ry-1;if(hasHead){ry*=0.8;hr=S*0.18;hcy=cy-ry*0.7-hr*0.4;}}
  else{rx=S*(0.24+r()*0.1);ry=S*(0.26+r()*0.07);cy=bottom-ry;}
  blob(h,cy,rx,ry,1);
  if(hasHead)blob(h,hcy,hr*(1.05+r()*0.2),hr,2);
  const top=hasHead?hcy-hr:cy-ry;
  // appendages
  const apps=[];
  if(arch==='biped')apps.push('arm');if(arch==='floaty')apps.push('wing');if(arch==='beast')apps.push('leg');
  const extra=Math.floor(r()*2)+(arch==='blob'?1:0);
  for(let i=0;i<extra;i++)apps.push(pick(['arm','wing','tuft','tail','tuft'],r));
  for(const k of apps){
    if(k==='arm')blob(h-rx*0.95,cy-ry*0.1+r()*ry*0.4,(1.5+r()*0.8)*sc,(1.8+r()*0.8)*sc,3);
    else if(k==='wing'){const wy=cy-ry*(0.3+r()*0.4);blob(h-rx-0.2*sc,wy,(2.2+r()*1.2)*sc,(1.6+r()*1)*sc,3);if(r()<0.5)blob(h-rx-1.6*sc,wy-1.4*sc,1.4*sc,1.3*sc,3);}
    else if(k==='tuft')blob(h-rx*0.55,cy-ry*0.9,(1.5+r()*1.2)*sc,(1.3+r()*0.8)*sc,3);
    else if(k==='tail')blob(h-rx-0.3*sc,cy+ry*0.4,(1.6+r()*1.2)*sc,(1.3+r()*0.8)*sc,3);
    else if(k==='leg'){blob(h-rx*0.75,bottom-0.5,1.8*sc,2.2*sc,7);}
  }
  // noise on boundary
  for(let y=1;y<S-1;y++)for(let x=1;x<h;x++){let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)n+=m[idx(x+dx,y+dy)];
    if(n>2&&n<7&&r()<0.1){m[idx(x,y)]^=1;if(m[idx(x,y)]&&!part[idx(x,y)])part[idx(x,y)]=1;}}
  // mirror
  const mirror=()=>{for(let y=0;y<S;y++)for(let x=h;x<S;x++){m[idx(x,y)]=m[idx(S-1-x,y)];part[idx(x,y)]=part[idx(S-1-x,y)];}};
  mirror();
  // cellular smoothing
  for(let it=0;it<2;it++){const n2=new Uint8Array(m);for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy)n+=m[idx(x+dx,y+dy)];
      if(n>=5)n2[idx(x,y)]=1;else if(n<=2)n2[idx(x,y)]=0;if(n2[idx(x,y)]&&!part[idx(x,y)])part[idx(x,y)]=1;}m.set(n2);}
  for(let y=0;y<S;y++)for(let x=0;x<S;x++)if(!inb(x,y))m[idx(x,y)]=0;
  // thin features after smoothing (left half then mirror again)
  const htop=hasHead?hcy-hr+1:cy-ry+1, hx=hasHead?hr:rx;
  const earK=r();
  if(earK<0.4){// pointy ears
    const bx=h-hx*0.75,bw=(1.6+r()*1.2)*sc,ht=(3+r()*2.5)*sc,lean=(r()*2.5)*sc;
    tri(bx-bw,htop+1.5*sc,bx+bw,htop+0.5*sc,bx-lean,htop-ht,4);}
  else if(earK<0.6){// round ears
    blob(h-hx*0.7,htop,1.8*sc,1.8*sc,4);}
  else if(earK<0.75){// antenna
    const ax=h-hx*0.35,len=Math.round(3*sc);for(let i=0;i<len;i++)set(ax-i*0.4,htop-i,4);blob(ax-len*0.4,htop-len,1.3,1.3,4);}
  else if(earK<0.88){// leaf/flame tuft on top centre
    tri(h-2*sc,htop+1,h,htop+1,h-0.5,htop-3.5*sc,4);}
  if(boss){// horns + crown spikes
    const bx=h-hx*0.55;tri(bx-2.2,htop+2,bx+1.4,htop+1,bx-3.5,htop-6,5);
    for(let i=0;i<2;i++){const sx=h-1-i*3;tri(sx-1.2,htop+1,sx+1.2,htop+1,sx,htop-2.5-(i?0:1.5),6);}}
  if(feet){const fx=h-rx*0.55;blob(fx,bottom+0.6*sc,2.2*sc,1.6*sc,7);}
  mirror();
  for(let y=0;y<S;y++)for(let x=0;x<S;x++)if(!inb(x,y))m[idx(x,y)]=0;
  // eyes
  const eyeH=boss?3:2;
  const ey=Math.round(hasHead?hcy-hr*0.1:cy-ry*0.35)-1;
  const ex=clamp(Math.round(hx*0.45),2,boss?6:5);
  const eL=h-ex-1;// left eye cols eL,eL+1
  for(let y=ey-1;y<=ey+eyeH+2;y++)for(let x=eL-1;x<=h;x++)if(inb(x,y)){m[idx(x,y)]=1;m[idx(S-1-x,y)]=1;if(!part[idx(x,y)]){part[idx(x,y)]=hasHead?2:1;part[idx(S-1-x,y)]=part[idx(x,y)];}}
  // colors
  const tc=(typeof TYPE_COL!=='undefined'&&TYPE_COL[sp.t])||'#a8a878';
  const base=hueShift(tc,(r()-0.5)*44,(r()-0.5)*0.15);
  const acc=(sp.c&&typeof TYPE_COL!=='undefined'&&TYPE_COL[sp.c])?TYPE_COL[sp.c]:hueShift(base,r()<0.5?30:-30,0.05);
  const outline=shade(base,-0.72);
  const belly=_gxMix(shade(base,0.6),'#fff4d8',0.4);
  const hornCol=sp.t==='shadow'?'#e8e0f0':r()<0.5?'#f0e6c8':shade(acc,0.25);
  const crown='#f8d040';
  const appCol=r()<0.5?base:acc;
  // y extents
  let y0=S,y1=0;for(let y=0;y<S;y++)for(let x=0;x<S;x++)if(m[idx(x,y)]){if(y<y0)y0=y;if(y>y1)y1=y;}
  const hasBelly=r()<0.75, bcy=cy+ry*0.3, brx=rx*0.55, bry=ry*0.6;
  // spots (left half, mirrored)
  const spots=new Uint8Array(S*S);
  if(r()<0.7){const ns=2+Math.floor(r()*3);for(let i=0;i<ns;i++){const sx=Math.floor(h-rx*(0.3+r()*0.6)),sy=Math.floor(cy-ry*(0.6-r()*1.0));const big=r()<0.5;
    for(let dy=0;dy<(big?2:1);dy++)for(let dx=0;dx<(big?2:1);dx++){const x=sx+dx,y=sy+dy;if(inb(x,y)){spots[idx(x,y)]=1;spots[idx(S-1-x,y)]=1;}}}}
  let [c,g]=_gxCanvas(S,S);
  const Q=[0.32,0.14,0,-0.18,-0.34];
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const i=idx(x,y);
    if(!m[i]){// outline
      if((x>0&&m[i-1])||(x<S-1&&m[i+1])||(y>0&&m[i-S])||(y<S-1&&m[i+S]))_gxP(g,x,y,outline);
      continue;}
    const p=part[i];
    let col=base;
    if(p===3)col=appCol;else if(p===4)col=sp.t==='fire'||r()<0?acc:(earK<0.6?base:acc);else if(p===5)col=hornCol;else if(p===6)col=crown;else if(p===7)col=shade(base,-0.2);
    if(spots[i]&&(p===1||p===2))col=acc;
    const bx=(x+0.5-h)/brx,by=(y+0.5-bcy)/bry;
    const inBelly=hasBelly&&p===1&&bx*bx+by*by<=1;
    if(inBelly)col=belly;
    let f=0.25-(y-y0)/Math.max(1,y1-y0)*0.55;
    if(y>0&&!m[i-S])f+=0.18;
    if(y<S-1&&!m[i+S])f-=0.16;
    if(inBelly)f=f*0.4;
    // quantize
    let q=Q[0];for(const v of Q)if(Math.abs(v-f)<Math.abs(q-f))q=v;
    _gxP(g,x,y,shade(col,q));
  }
  // eyes
  const eyeCol='#1a1428',eR=S-1-(eL+1);
  for(const exx of[eL,eR]){_gxP(g,exx,ey,eyeCol,2,eyeH);_gxP(g,exx,ey,'#ffffff');if(boss)_gxP(g,exx+1,ey+eyeH-1,sp.t==='shadow'?'#ff4060':'#504870');}
  if(sp.t==='shadow'||boss){_gxP(g,eL-1,ey-1,outline,2,1);_gxP(g,eR+1,ey-1,outline,2,1);}
  // blush
  if(r()<0.55){const bc=_gxMix(base,'#ff7090',0.55);_gxP(g,eL-1,ey+eyeH,bc);_gxP(g,eR+2,ey+eyeH,bc);}
  // mouth
  const my=ey+eyeH+1, mk=Math.floor(r()*3);
  if(mk===0){_gxP(g,h-1,my,outline,2,1);}
  else if(mk===1){_gxP(g,h-2,my,outline);_gxP(g,h+1,my,outline);_gxP(g,h-1,my+1,outline,2,1);}
  else{_gxP(g,h-1,my,outline,2,2);_gxP(g,h-1,my+1,'#e05060',2,1);}
  if(boss||sp.t==='shadow'){_gxP(g,h-2,my+1,'#ffffff');_gxP(g,h+1,my+1,'#ffffff');}
  _gxMonCache[id]=c;return c;
}

// ===================== MAP TILES =====================
function _gxIsWall(t){return t===T_WALL;}
function _gxAt(map,x,y){if(x<0||y<0||x>=map.w||y>=map.h)return T_WALL;return map.tiles[y*map.w+x];}
const _gxGrassCache={};
function _gxGrassBlades(th){
  const k=th.grass+th.grass2;if(_gxGrassCache[k])return _gxGrassCache[k];
  const[c,g]=_gxCanvas(16,16);
  const hi=shade(th.grass,0.3),md=th.grass,dk=th.grass2,dd=shade(th.grass2,-0.3);
  // two rows of GBA-like clumps
  const clump=(ox,oy)=>{const pat=['.h....h.','hgh..hgh','ggd.hggd','gdgdggdd','dgddgddg','ddddddd.'];
    for(let y=0;y<pat.length;y++)for(let x=0;x<8;x++){const ch=pat[y][x];if(ch==='.')continue;_gxP(g,ox+x,oy+y,ch==='h'?hi:ch==='g'?md:ch==='d'?dk:dd);}};
  clump(0,2);clump(8,2);clump(4,9);clump(-4,9);clump(12,9);
  for(let x=0;x<16;x++){if(x%3!==1)_gxP(g,x,15,dd);}
  _gxGrassCache[k]=c;return c;
}
function _gxFloor(g,ox,oy,th,r,key){
  _gxP(g,ox,oy,th.floor,16,16);
  const f2=th.floor2||shade(th.floor,-0.1),hl=shade(th.floor,0.18);
  if(key==='citadel'){_gxP(g,ox,oy+15,f2,16,1);_gxP(g,ox+15,oy,f2,1,16);_gxP(g,ox,oy,hl,15,1);_gxP(g,ox+7,oy+8,f2,1,7);_gxP(g,ox,oy+7,f2,15,1);
    if(r()<0.3)_gxP(g,ox+ri(2,12,r),oy+ri(2,12,r),f2,2,1);return;}
  const n=2+Math.floor(r()*4);
  for(let i=0;i<n;i++){const x=ri(1,13,r),y=ri(1,13,r);
    if(key==='meadow'||key==='forest'){_gxP(g,ox+x,oy+y,f2);_gxP(g,ox+x+2,oy+y,f2);_gxP(g,ox+x+1,oy+y+1,f2);if(r()<0.4)_gxP(g,ox+x+1,oy+y-1,hl);}
    else if(key==='desert'||key==='coast'){if(r()<0.5){_gxP(g,ox+x,oy+y,f2,3,1);_gxP(g,ox+x+1,oy+y-1,hl,2,1);}else _gxP(g,ox+x,oy+y,f2);}
    else if(key==='snow'){_gxP(g,ox+x,oy+y,r()<0.5?'#ffffff':f2);}
    else if(key==='sky'){_gxP(g,ox+x,oy+y,hl,2,1);_gxP(g,ox+x,oy+y+1,f2,2,1);}
    else{_gxP(g,ox+x,oy+y,f2);if(r()<0.5)_gxP(g,ox+x+1,oy+y,hl);}}
}
function _gxPath(g,ox,oy,th,r,map,x,y){
  _gxP(g,ox,oy,th.path,16,16);
  const dk=shade(th.path,-0.15),lt=shade(th.path,0.15);
  for(let i=0;i<4;i++){const px=ri(1,14,r),py=ri(1,14,r);_gxP(g,ox+px,oy+py,r()<0.5?dk:lt);}
  const np=(t)=>t===T_PATH||t===T_SHRINE||t===T_PORTAL;
  if(!np(_gxAt(map,x,y-1)))_gxP(g,ox,oy,dk,16,1);
  if(!np(_gxAt(map,x,y+1)))_gxP(g,ox,oy+15,dk,16,1);
  if(!np(_gxAt(map,x-1,y)))_gxP(g,ox,oy,dk,1,16);
  if(!np(_gxAt(map,x+1,y)))_gxP(g,ox+15,oy,dk,1,16);
}
function _gxWall(g,ox,oy,th,r,map,x,y,key){
  const W_=_gxIsWall;
  const up=W_(_gxAt(map,x,y-1)),dn=W_(_gxAt(map,x,y+1)),lf=W_(_gxAt(map,x-1,y)),rt=W_(_gxAt(map,x+1,y));
  const A=th.wallA,B=th.wallB,ol=shade(A,-0.55);
  const d=(px,py,col,w,h)=>_gxP(g,ox+px,oy+py,col,w,h);
  switch(th.wall){
  case'tree':{
    if(!dn){_gxFloor(g,ox,oy,th,r,key);
      d(4,14,_gxRgba('#000000',0.18),8,2);
      d(6,10,ol,4,5);d(7,10,th.trunk||'#7a5030',2,5);d(7,10,shade(th.trunk||'#7a5030',0.2),1,4);
      _gxDisc(g,ox,oy,8,6.5,7.5,ol);_gxDisc(g,ox,oy,8,6.3,6.5,A);_gxDisc(g,ox,oy,8,8.6,4.8,shade(A,-0.15));_gxDisc(g,ox,oy,8,6.3,4.6,A);
      _gxDisc(g,ox,oy,6,4.2,2.6,B);_gxDisc(g,ox,oy,10.5,3.6,1.6,B);d(5,3,shade(B,0.3),2,1);d(10,2,shade(B,0.3));
    }else{
      if(!up||!lf||!rt)_gxFloor(g,ox,oy,th,r,key);
      d(lf?0:3,up?0:3,shade(A,-0.25),16-(lf?0:3)-(rt?0:3),16-(up?0:3));
      const bumps=[[4,4.5],[12,4.5],[4,12.5],[12,12.5]];
      for(const[bx,by]of bumps)_gxDisc(g,ox,oy,bx,by,5,ol);
      for(const[bx,by]of bumps){_gxDisc(g,ox,oy,bx,by,4.2,A);_gxDisc(g,ox,oy,bx-1,by-1.2,2.3,B);d(Math.round(bx-2),Math.round(by-3),shade(B,0.3));}
      if(r()<0.4)d(ri(3,12,r),ri(3,12,r),shade(B,0.25));
    }break;}
  case'pine':{
    _gxFloor(g,ox,oy,th,r,key);
    const off=dn?3:0;
    if(!dn){d(5,13,_gxRgba('#000000',0.15),7,2);d(7,12,th.trunk||'#6a4028',2,3);}
    const tiers=[[0,5,3.5],[3,9,5.5],[6,12,7.5]];
    for(const[t0,t1,hw]of tiers){for(let yy=t0;yy<=t1;yy++){const w=Math.max(1,Math.round(hw*(yy-t0+1)/(t1-t0+1)));const Y=yy+off;if(Y>15)continue;
        d(8-w-1,Y,ol,w*2+2,1);d(8-w,Y,A,w*2,1);d(8-w,Y,B,Math.max(1,w-1),1);}
      const Y0=t0+off;d(7,Y0,'#ffffff',2,1);if(Y0+1<=15){d(6,Y0+1,'#f0f8ff',4,1);}if(t1+off<=15)d(8-Math.round(hw),t1+off,shade(A,-0.3),Math.round(hw)*2,1);}
    break;}
  case'rock':case'lavarock':{
    const top=B,face=A;
    if(!dn){d(0,0,shade(face,-0.1),16,9);for(const lx of[4,12]){const jx=lx+ri(-1,1,r),rr=3.4+r();_gxDisc(g,ox,oy,jx+0.6,5,rr,shade(face,-0.35));_gxDisc(g,ox,oy,jx,4.4,rr,top);_gxDisc(g,ox,oy,jx-0.8,3.4,rr*0.45,shade(top,0.18));}
      d(0,9,face,16,7);d(0,9,shade(face,0.2),16,1);d(0,15,shade(face,-0.35),16,1);
      const vx=ri(3,6,r);d(vx,10,shade(face,-0.25),1,5);d(vx+ri(5,7,r),10,shade(face,-0.25),1,5);d(0,12,shade(face,-0.12),16,1);}
    else{d(0,0,shade(face,-0.1),16,16);
      const lumps=[[4,4],[12,4],[8,9],[4,13],[12,13]];
      for(const[lx,ly]of lumps){const jx=lx+ri(-1,1,r),jy=ly+ri(-1,1,r),rr=3.2+r()*1.2;
        _gxDisc(g,ox,oy,jx+0.6,jy+0.8,rr,shade(face,-0.35));_gxDisc(g,ox,oy,jx,jy,rr,top);_gxDisc(g,ox,oy,jx-0.8,jy-0.9,rr*0.45,shade(top,0.18));}}
    const cr=shade(top,-0.22);
    if(r()<0.7){const cx=ri(2,10,r),cy=ri(2,dn?11:5,r);d(cx,cy,cr,3,1);d(cx+2,cy+1,cr,1,2);}
    if(r()<0.5)d(ri(1,13,r),ri(1,dn?13:6,r),shade(top,0.15),2,1);
    if(th.wall==='lavarock'&&up&&dn&&lf&&rt&&r()<0.32){
      let lx=ri(2,6,r),ly=ri(2,6,r);for(let i=0;i<7;i++){d(lx,ly,'#ff6a10',2,1);d(lx,ly,'#ffd040');lx+=1;ly+=r()<0.6?1:0;if(lx>14||ly>14)break;}
      d(lx,ly,'#ff9020');}
    if(!up){d(0,0,ol,16,1);d(0,1,shade(top,0.22),16,1);}
    if(!lf)d(0,0,ol,1,16);if(!rt)d(15,0,ol,1,16);
    if(!up&&!lf)d(0,0,th.floor,1,1);if(!up&&!rt)d(15,0,th.floor,1,1);
    break;}
  case'water':{
    const wc=th.water||'#4890e0';d(0,0,wc,16,16);
    const lt=shade(wc,0.28),dk=shade(wc,-0.12);
    for(let i=0;i<2;i++){const wx=ri(1,10,r),wy=ri(2,13,r);d(wx,wy,lt);d(wx+1,wy-1,lt,2,1);d(wx+3,wy,lt);d(wx+1,wy+1,dk,2,1);}
    const foam='#eef8ff',f2=shade(wc,0.45);
    if(!up){d(0,0,foam,16,1);d(0,1,f2,16,1);for(let i=0;i<16;i+=3)d(i,2,f2);}
    if(!dn){d(0,15,foam,16,1);d(0,14,f2,16,1);}
    if(!lf){d(0,0,foam,1,16);d(1,0,f2,1,16);}
    if(!rt){d(15,0,foam,1,16);d(14,0,f2,1,16);}
    break;}
  case'void':{
    d(0,0,th.voidCol||'#0b0a24',16,16);
    const ns=1+Math.floor(r()*3);
    for(let i=0;i<ns;i++){const sx=ri(1,14,r),sy=ri(up?1:7,14,r);const bright=r()<0.3;d(sx,sy,bright?'#ffffff':'#8890c8');
      if(bright&&r()<0.5){const sc='#6870b0';d(sx-1,sy,sc);d(sx+1,sy,sc);d(sx,sy-1,sc);d(sx,sy+1,sc);}}
    if(!up){// cloud underside hanging from land above
      const cl='#eceefa',cs='#a8acd8',cd='#6a6ea8';
      for(let xx=0;xx<16;xx++){const hh=3+Math.round(1.6*Math.sin((x*16+xx)*0.55)+1.2*Math.sin((x*16+xx)*1.3+1));
        d(xx,0,cl,1,hh);d(xx,hh,cs,1,1);d(xx,hh+1,cd,1,1);}}
    break;}
  case'brick':{
    const mo=shade(A,-0.4),hl=shade(A,0.18);
    if(!dn){d(0,0,B,16,4);d(0,3,shade(B,-0.3),16,1);d(0,0,shade(B,0.2),16,1);
      d(0,4,A,16,12);
      for(let row=0;row<3;row++){const yy=4+row*4;d(0,yy+3,mo,16,1);const sh=(row+x)%2?4:0;for(let bx=sh;bx<16;bx+=8){d(bx,yy,mo,1,3);d(bx+1,yy,hl,3,1);}}
      d(0,15,shade(A,-0.55),16,1);}
    else{const rf=shade(A,-0.35),rl=shade(rf,-0.4),rh=shade(rf,0.12);d(0,0,rf,16,16);d(0,7,rl,16,1);d(0,15,rl,16,1);
      const sh=(y%2)?4:0;d(sh,0,rl,1,7);d(sh+8,8,rl,1,7);d(0,0,rh,16,1);d(0,8,rh,16,1);if(r()<0.3)d(ri(2,12,r),ri(2,12,r),rl,2,1);}
    if(!up){d(0,0,ol,16,1);}if(!lf)d(0,0,ol,1,16);if(!rt)d(15,0,ol,1,16);
    break;}
  case'deadtree':{
    const wc=th.water||'#3a4a38';d(0,0,wc,16,16);
    const lt=shade(wc,0.18),dk=shade(wc,-0.2);
    d(ri(1,9,r),ri(2,13,r),lt,4,1);d(ri(1,9,r),ri(2,13,r),dk,3,1);
    const mud=shade(th.floor,-0.25);
    if(!up)d(0,0,mud,16,2);if(!lf)d(0,0,mud,2,16);if(!rt)d(14,0,mud,2,16);if(!dn)d(0,14,dk,16,2);
    if(r()<0.6){// gnarled dead tree
      const tk=th.trunk||'#5a4a40',tl=shade(tk,0.25),to=shade(tk,-0.55);
      const bx=ri(5,9,r);
      d(bx-2,14,_gxRgba('#000000',0.2),6,2);
      let cx=bx;for(let yy=14;yy>=4;yy--){if(yy%3===0)cx+=r()<0.5?-1:1;cx=clamp(cx,3,12);d(cx-1,yy,to,4,1);d(cx,yy,tk,2,1);d(cx,yy,tl);}
      // branches
      const by=ri(5,8,r);for(let i=0;i<4;i++){d(cx-1-i,by-i,to,2,2);d(cx-1-i,by-i,tk);}
      for(let i=0;i<3;i++){d(cx+2+i,by+2-i,to,2,2);d(cx+2+i,by+2-i,tk);}
      d(cx-4,by-4,to);d(cx+4,by-1,to);
    }else if(r()<0.5){// reeds
      for(let i=0;i<3;i++){const rx=ri(3,12,r);const hh=ri(4,7,r);d(rx,14-hh,'#5a6a30',1,hh);d(rx,14-hh,'#a08a50',1,2);}}
    else{// lily
      const lx=ri(3,10,r),ly=ri(4,11,r);_gxDisc(g,ox,oy,lx+2,ly+1,2.4,'#4a7a3a');d(lx+2,ly+1,wc);d(lx+1,ly,'#6a9a4a');}
    break;}
  default:d(0,0,A,16,16);
  }
}
function _gxDeco(g,ox,oy,th,r,kind){
  const d=(px,py,col,w,h)=>_gxP(g,ox+px,oy+py,col,w,h);
  const ox2=ri(-2,2,r),oy2=ri(-1,1,r);
  const D=(px,py,col,w,h)=>d(px+ox2,py+oy2,col,w,h);
  switch(kind){
  case'flower':{const cols=['#f04060','#f8d030','#ffffff','#b070f0','#ff8a40'];const n=1+Math.floor(r()*3);
    for(let i=0;i<n;i++){const fx=ri(3,12,r),fy=ri(3,11,r),pc=pick(cols,r);d(fx,fy+2,shade(th.floor,-0.35));d(fx-1,fy,pc);d(fx+1,fy,pc);d(fx,fy-1,pc);d(fx,fy+1,pc);d(fx,fy,pc===('#f8d030')?'#f07020':'#f8e060');}break;}
  case'mushroom':{const cap=r()<0.6?'#d83830':'#c070e0',o='#3a1818';
    D(4,5,o,8,1);D(3,6,o,10,3);D(4,6,cap,8,3);D(5,5,cap,6,1);D(5,6,'#ffffff',2,1);D(9,7,'#ffffff');D(4,8,shade(cap,-0.3),8,1);
    D(6,9,o,4,4);D(7,9,'#f4ecd8',2,3);D(6,13,_gxRgba('#000000',0.2),4,1);break;}
  case'crystal':{const pal=r()<0.5?['#70e0ff','#d8fbff','#3070c0']:['#c080ff','#f0d8ff','#6030a0'];
    const shard=(sx,sy,hh)=>{for(let i=0;i<hh;i++){const w=i<2?1+i:i>hh-3?Math.max(1,hh-i):3;d(sx-Math.floor(w/2)-1,sy+i,pal[2],w+2,1);d(sx-Math.floor(w/2),sy+i,pal[0],w,1);d(sx-Math.floor(w/2),sy+i,pal[1]);}};
    shard(7+ox2,3,10);shard(11+ox2,7,6);d(5+ox2,13,_gxRgba('#000000',0.2),8,1);break;}
  case'pebble':{for(let i=0;i<2+Math.floor(r()*2);i++){const px=ri(2,11,r),py=ri(4,12,r);d(px,py,'#5a5a60',4,3);d(px+1,py-1,'#5a5a60',2,1);d(px+1,py,'#a8a8b0',2,1);d(px,py+1,'#80808a',4,1);d(px+3,py,'#80808a');}break;}
  case'shell':{const sc=r()<0.5?'#f8b8c8':'#f8e0b0',sd=shade(sc,-0.3);
    D(5,7,sd,6,1);D(4,8,sd,8,3);D(5,8,sc,6,2);D(6,11,sd,4,1);D(7,10,sc,2,1);D(6,8,sd,1,2);D(9,8,sd,1,2);D(7,7,'#ffffff');break;}
  case'cactus':{const c='#40a048',cd='#246a30',ch='#78d070',o='#183a20';
    D(6,2,o,4,13);D(7,2,c,2,12);D(7,3,ch,1,10);
    D(2,5,o,4,5);D(3,6,c,2,3);D(4,8,c,3,1);
    D(10,7,o,4,4);D(11,8,c,2,2);D(9,9,c,2,1);D(6,14,_gxRgba('#000000',0.2),5,1);D(8,5,cd);D(8,10,cd);break;}
  case'snowrock':{D(3,6,'#3a3a48',10,8);D(4,5,'#3a3a48',8,1);D(4,7,'#7a7a88',8,6);D(4,11,'#5a5a68',8,2);D(4,5,'#ffffff',8,2);D(3,7,'#e8f0ff',3,1);D(9,7,'#e8f0ff',4,1);break;}
  case'skull':{const b='#f0ead8',bs='#b8b0a0',o='#3a3028';
    D(4,4,o,8,8);D(5,4,b,6,6);D(4,5,b,8,4);D(5,10,b,6,1);D(6,6,o,2,2);D(9,6,o,2,2);D(8,8,o);D(6,11,bs,1,1);D(8,11,bs);D(10,11,bs);D(4,8,bs,1,1);
    if(r()<0.6){d(1,13,b,4,1);d(1,12,b);d(4,14,b);}break;}
  case'star':{const y='#ffe060',w='#ffffff';D(7,3,y,1,9);D(3,7,y,9,1);D(6,5,y,3,5);D(5,6,y,5,3);D(7,6,w,1,3);D(6,7,w,3,1);
    if(r()<0.5){d(12,3,y);d(3,12,y);}break;}
  case'candle':{const o='#3a2818';D(6,6,o,4,8);D(7,7,'#f0e8d0',2,6);D(7,7,'#ffffff',1,5);D(5,13,o,6,2);D(6,13,'#8a6a40',4,1);
    D(7,2,'#ff8a20',2,4);D(7,3,'#ffd060',2,2);D(7,1,'#ff5a10');D(4,0,_gxRgba('#ffc060',0.25),8,8);break;}
  default:d(7,7,shade(th.floor,-0.3),2,2);
  }
}
function _gxBlock(g,ox,oy,th,r,key){
  const d=(px,py,col,w,h)=>_gxP(g,ox+px,oy+py,col,w,h);
  d(2,13,_gxRgba('#000000',0.2),12,3);
  if(th.wall==='tree'||th.wall==='pine'||th.wall==='deadtree'){
    const c=th.wall==='deadtree'?'#5a7040':(th.grass||'#48a038'),o=shade(c,-0.6);
    _gxDisc(g,ox,oy,8,8.5,7,o);_gxDisc(g,ox,oy,8,8.3,6,shade(c,-0.15));
    _gxDisc(g,ox,oy,5.5,7.5,3.2,c);_gxDisc(g,ox,oy,10.5,7.5,3.2,c);_gxDisc(g,ox,oy,8,5,3,c);
    d(5,5,shade(c,0.35),2,1);d(9,3,shade(c,0.35),2,1);d(11,6,shade(c,0.3));
    if(th.wall==='pine'){d(5,2,'#ffffff',6,2);d(3,4,'#f0f8ff',3,1);d(10,4,'#f0f8ff',3,1);}
    else if(r()<0.5){d(5,10,'#e03040');d(10,11,'#e03040');d(8,8,'#e03040');}
  }else{
    let c=th.wall==='rock'||th.wall==='lavarock'?shade(th.wallB,0.05):'#9a948c';
    if(key==='sky')c='#a8a0c0';
    const o=shade(c,-0.6);
    _gxEll(g,ox+8,oy+9,7,6,o);_gxEll(g,ox+8,oy+9,6,5,shade(c,-0.2));_gxEll(g,ox+7,oy+8,5,4,c);
    d(4,5,shade(c,0.35),3,1);d(5,6,shade(c,0.2),2,1);d(9,9,shade(c,-0.35),2,1);d(10,8,shade(c,-0.35));
    if(key==='snow')d(4,3,'#ffffff',8,2);
  }
}
function _gxChest(g,ox,oy,open){
  const d=(px,py,col,w,h)=>_gxP(g,ox+px,oy+py,col,w,h);
  const o='#2a1808',w='#b06a28',wl='#d89040',wd='#7a4418',gd='#f0c040';
  d(2,14,_gxRgba('#000000',0.22),12,2);
  if(!open){
    d(2,4,o,12,11);d(3,5,wl,10,3);d(3,8,o,10,1);d(3,9,w,10,5);d(3,13,wd,10,1);
    d(5,5,gd,1,9);d(10,5,gd,1,9);d(3,5,shade(wl,0.25),10,1);
    d(7,7,o,2,4);d(7,8,'#fff0a0',2,2);
  }else{
    d(2,2,o,12,5);d(3,3,wd,10,3);d(5,3,gd,1,3);d(10,3,gd,1,3);
    d(2,7,o,12,8);d(3,8,'#140a04',10,2);d(3,10,w,10,4);d(3,13,wd,10,1);d(5,10,gd,1,4);d(10,10,gd,1,4);d(3,10,wl,10,1);
  }
}
function _gxShrineBase(g,ox,oy,th){
  const d=(px,py,col,w,h)=>_gxP(g,ox+px,oy+py,col,w,h);
  _gxEll(g,ox+8,oy+10,7,4,'#3a3438');_gxEll(g,ox+8,oy+10,6,3,'#5a5258');
  _gxEll(g,ox+8,oy+10,4,2,'#2a2228');d(6,10,'#7a2a10',1,1);d(9,9,'#a04018');d(8,11,'#6a6068');
  const st=[[2,9],[4,7],[7,6],[10,7],[12,9],[11,12],[8,13],[4,12]];
  for(const[sx,sy]of st){d(sx-1,sy-1,'#3a3640',3,3);d(sx-1,sy-1,'#a8a4a8',2,1);d(sx,sy,'#787078');}
}
function _gxTile(g,map,th,x,y,key){
  const ox=x*TS,oy=y*TS;
  const r=RNG(((map.seed||1)*2654435761)^(x*73856093)^(y*19349663));
  r();
  const t=map.tiles[y*map.w+x];
  g.save();g.beginPath();g.rect(ox,oy,16,16);g.clip();
  switch(t){
    case T_WALL:_gxWall(g,ox,oy,th,r,map,x,y,key);break;
    case T_PATH:_gxPath(g,ox,oy,th,r,map,x,y);break;
    case T_GRASS:_gxFloor(g,ox,oy,th,r,key);g.drawImage(_gxGrassBlades(th),ox,oy);break;
    case T_DECO:_gxFloor(g,ox,oy,th,r,key);_gxDeco(g,ox,oy,th,r,pick(th.deco&&th.deco.length?th.deco:['pebble'],r));break;
    case T_BLOCK:_gxFloor(g,ox,oy,th,r,key);_gxBlock(g,ox,oy,th,r,key);break;
    case T_CHEST:_gxFloor(g,ox,oy,th,r,key);_gxChest(g,ox,oy,false);break;
    case T_CHEST_OPEN:_gxFloor(g,ox,oy,th,r,key);_gxChest(g,ox,oy,true);break;
    case T_SHRINE:_gxFloor(g,ox,oy,th,r,key);_gxShrineBase(g,ox,oy,th);break;
    case T_PORTAL:_gxFloor(g,ox,oy,th,r,key);break;
    default:_gxFloor(g,ox,oy,th,r,key);
  }
  g.restore();
}
function paintMap(map,theme){
  const th=_gxTheme(theme),key=_gxThemeKey(theme);
  const[c,g]=_gxCanvas(map.w*TS,map.h*TS);
  for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++)_gxTile(g,map,th,x,y,key);
  return c;
}
function repaintTile(mc,map,theme,x,y){
  if(!mc||x<0||y<0||x>=map.w||y>=map.h)return;
  const g=mc.getContext('2d');g.imageSmoothingEnabled=false;
  _gxTile(g,map,_gxTheme(theme),x,y,_gxThemeKey(theme));
}
function drawChestIcon(c,x,y,open){c.save();_gxChest(c,x,y,!!open);c.restore();}
function drawGrassOverlay(c,x,y,theme){
  const bl=_gxGrassBlades(_gxTheme(theme));
  c.drawImage(bl,0,10,16,6,Math.round(x),Math.round(y)+10,16,6);
}

// ===================== ANIMATED TILE OBJECTS =====================
function drawShrine(c,px,py,time){
  time=time||0;px=Math.round(px);py=Math.round(py);
  c.save();
  const cx=px+8,by=py+10;
  const fl=0.85+0.15*Math.sin(time*7)+0.06*Math.sin(time*19);
  const gr=c.createRadialGradient(cx,by-4,1,cx,by-4,24*fl);
  gr.addColorStop(0,'rgba(255,180,70,0.42)');gr.addColorStop(0.5,'rgba(255,120,30,0.15)');gr.addColorStop(1,'rgba(255,100,20,0)');
  c.globalCompositeOperation='lighter';c.fillStyle=gr;c.fillRect(cx-26,by-30,52,52);c.globalCompositeOperation='source-over';
  for(let dx=-4;dx<=4;dx++){
    const base=1-Math.abs(dx)/5;
    const hh=Math.max(1,Math.round(base*12*(0.72+0.2*Math.sin(time*9+dx*1.7)+0.12*Math.sin(time*23+dx*3.1))));
    for(let k=0;k<hh;k++){const f=k/hh;let col='#ff6a14';
      if(Math.abs(dx)<=1&&f<0.55)col='#fff2b0';else if(Math.abs(dx)<=2&&f<0.75)col='#ffc040';else if(f>0.85)col='#d8400c';
      c.fillStyle=col;c.fillRect(cx+dx-0.5|0,by-k,1,1);}}
  // tips licking
  for(let i=0;i<3;i++){const ph=(time*1.6+i*0.37)%1;const sx=cx+Math.round(Math.sin(time*4+i*2.1)*3)-1;const sy=by-8-Math.round(ph*10);
    c.fillStyle=ph<0.5?'#ffd060':'#ff8030';c.fillRect(sx,sy,1,1);}
  // coiled sword silhouette
  c.fillStyle='#2a2028';c.fillRect(cx,by-15,1,4);c.fillRect(cx-2,by-12,5,1);
  c.fillStyle='#5a5060';c.fillRect(cx,by-11,1,10);c.fillStyle='#8a8090';c.fillRect(cx,by-11,1,1);
  c.restore();
}
function drawPortal(c,px,py,time,active){
  time=time||0;px=Math.round(px);py=Math.round(py);
  c.save();
  const cx=px+8,cy=py+6;
  // base stones
  _gxEll(c,cx,py+14,7,2,'rgba(0,0,0,0.25)');
  if(active){
    const gr=c.createRadialGradient(cx,cy,1,cx,cy,14);gr.addColorStop(0,'rgba(200,140,255,0.55)');gr.addColorStop(1,'rgba(120,80,255,0)');
    c.globalCompositeOperation='lighter';c.fillStyle=gr;c.fillRect(cx-16,cy-16,32,32);c.globalCompositeOperation='source-over';
    _gxEll(c,cx,cy,5,8,'rgba(40,10,80,0.75)');
    for(let i=0;i<18;i++){const a=time*3+i*0.7,rr=(i/18)*5;const x=cx+Math.cos(a)*rr*0.9,y=cy+Math.sin(a)*rr*1.5;
      c.fillStyle=i%3?'#a070ff':'#70e8ff';c.fillRect(Math.round(x),Math.round(y),1,1);}
  }else _gxEll(c,cx,cy,5,8,'rgba(20,20,40,0.45)');
  const N=24;
  for(let i=0;i<N;i++){const a=i/N*Math.PI*2+(active?time*1.8:time*0.3);const x=cx+Math.cos(a)*6,y=cy+Math.sin(a)*9;
    let col;if(active)col=i%4===0?'#ffffff':i%2?'#b080ff':'#60d8ff';else col=i%2?'#4a4a68':'#36364c';
    c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),i%4===0&&active?2:1,1);}
  c.restore();
}
function drawCursorTri(c,x,y,col){
  x=Math.round(x);y=Math.round(y);
  const ws=[2,3,4,5,4,3,2];
  c.save();c.fillStyle='rgba(0,0,0,0.35)';for(let i=0;i<7;i++)c.fillRect(x+1,y+i+1,ws[i],1);
  c.fillStyle=col||'#303030';for(let i=0;i<7;i++)c.fillRect(x,y+i,ws[i],1);c.restore();
}

// ===================== BATTLE BACKDROPS =====================
const _gxBBCache={};
function _gxGrad(g,y0,y1,c0,c1){const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,c0);gr.addColorStop(1,c1);g.fillStyle=gr;g.fillRect(0,y0,W,y1-y0);}
function _gxRidge(g,base,amp,fr,ph,col,yb){g.fillStyle=col;for(let x=0;x<W;x++){const y=Math.round(base+Math.sin(x*fr+ph)*amp+Math.sin(x*fr*2.7+ph*1.3)*amp*0.4);g.fillRect(x,y,1,(yb||H)-y);}}
function _gxPeaks(g,r,base,n,hMin,hMax,col,snow){
  for(let i=0;i<n;i++){const px=ri(-20,W+20,r),ph=ri(hMin,hMax,r),hw=ph*(0.9+r()*0.6);
    for(let yy=0;yy<=base-(base-ph);yy++){}
    const top=base-ph;
    for(let y=top;y<=base;y++){const k=(y-top)/ph;const w=Math.round(hw*k);g.fillStyle=col;g.fillRect(px-w,y,w*2,1);
      if(snow&&k<0.28){g.fillStyle=k<0.2||((px+y)%3)?'#f4f8ff':col;g.fillRect(px-w,y,w*2,1);g.fillStyle='#c8d4ec';g.fillRect(px,y,w,1);}}}
}
function _gxPlatform(g,cx,cy,rx,ry,top){
  _gxEll(g,cx,cy+4,rx+1,ry+1,'rgba(0,0,0,0.22)');
  _gxEll(g,cx,cy+3,rx,ry,shade(top,-0.45));
  _gxEll(g,cx,cy,rx,ry,shade(top,-0.28));
  _gxEll(g,cx,cy-1,rx-3,ry-2,shade(top,-0.08));
  _gxEll(g,cx,cy-1,rx-6,ry-3.5,top);
  _gxEll(g,cx,cy-2,rx*0.55,ry*0.45,shade(top,0.08));
  const hl=shade(top,0.38);g.fillStyle=hl;
  for(let x=-rx+2;x<=rx-2;x++){const k=1-(x*x)/(rx*rx);const y=-ry*Math.sqrt(Math.max(0,k));g.fillRect(Math.round(cx+x),Math.round(cy+y),1,1);}
  g.fillStyle=shade(top,-0.3);
  for(let x=-rx+3;x<=rx-3;x+=3){const k=1-(x*x)/((rx-4)*(rx-4));if(k<0)continue;const y=(ry-2.5)*Math.sqrt(k);g.fillRect(Math.round(cx+x),Math.round(cy-1+y),2,1);}
}
function _gxCloud(g,x,y,s,col,sh){_gxEll(g,x,y+2*s,14*s,4*s,sh);_gxEll(g,x-7*s,y+1*s,7*s,4*s,col);_gxEll(g,x+5*s,y,9*s,6*s,col);_gxEll(g,x-1*s,y+2*s,13*s,4*s,col);}
function _gxBattleStatic(key,th){
  const[back,bg]=_gxCanvas(W,H),[front,fg]=_gxCanvas(W,H);
  const r=RNG(hashStr('bb:'+key));
  const s0=(th.bg&&th.bg[0])||'#88c8f8',s1=(th.bg&&th.bg[1])||'#e0f0ff';
  const HZ=98;
  _gxGrad(bg,0,HZ+10,s0,s1);
  const far=_gxMix(th.wallA,s1,0.55),near=_gxMix(th.wallA,s1,0.25);
  switch(key){
  case'meadow':
    _gxRidge(fg,70,8,0.012,1,_gxMix(th.wallB,s1,0.5),HZ+2);
    _gxRidge(fg,84,6,0.02,3,_gxMix(th.wallB,s1,0.2),HZ+2);
    for(let i=0;i<14;i++){const x=ri(0,W,r),y=ri(82,92,r);_gxDisc(fg,0,0,x,y,ri(4,7,r),_gxMix(th.wallA,s1,0.3));}
    break;
  case'forest':
    for(let layer=0;layer<3;layer++){const col=_gxMix(shade(th.wallA,-0.1*layer),s1,0.6-layer*0.25);const by=64+layer*12;
      for(let x=-10;x<W+10;x+=ri(10,18,r)){const rr=ri(9,15,r);fg.fillStyle=_gxMix(th.trunk||'#5a3a20',s1,0.5-layer*0.2);fg.fillRect(x-1,by,3,HZ-by+4);_gxDisc(fg,0,0,x,by-rr*0.4,rr,col);_gxDisc(fg,0,0,x-rr*0.3,by-rr*0.8,rr*0.5,shade(col,0.08));}}
    fg.fillStyle=_gxMix(th.wallA,s1,0.1);fg.fillRect(0,HZ-6,W,10);
    break;
  case'cave':{
    for(let i=0;i<60;i++){const x=ri(0,W,r),hh=ri(6,46,r),w=ri(3,9,r);const col=i%2?shade(s0,0.06):shade(s0,0.12);
      for(let y=0;y<hh;y++){const ww=Math.round(w*(1-y/hh));bg.fillStyle=col;bg.fillRect(x-ww,y,ww*2,1);}}
    _gxRidge(fg,80,10,0.03,2,shade(th.wallA,-0.2),HZ+2);
    for(let i=0;i<9;i++){const x=ri(10,W-10,r),y=ri(82,96,r),hh=ri(10,26,r);const pal=i%2?['#70e0ff','#3070c0','#d8fbff']:['#c080ff','#6030a0','#f0d8ff'];
      const gr=fg.createRadialGradient(x,y-hh/2,1,x,y-hh/2,hh*1.4);gr.addColorStop(0,_gxRgba(pal[0],0.35));gr.addColorStop(1,_gxRgba(pal[0],0));fg.fillStyle=gr;fg.fillRect(x-hh*1.5,y-hh*2,hh*3,hh*3);
      for(let yy=0;yy<hh;yy++){const w=Math.max(1,Math.round(4*Math.min(1,yy/4)));fg.fillStyle=pal[1];fg.fillRect(x-w-1,y-hh+yy,w*2+2,1);fg.fillStyle=pal[0];fg.fillRect(x-w,y-hh+yy,w*2,1);fg.fillStyle=pal[2];fg.fillRect(x-w,y-hh+yy,1,1);}}
    break;}
  case'coast':{
    const sea=th.water||'#4890e0';
    _gxGrad(fg,62,HZ+2,shade(sea,0.15),shade(sea,-0.1));
    for(let i=0;i<70;i++){fg.fillStyle=_gxRgba('#ffffff',0.35+r()*0.3);fg.fillRect(ri(0,W,r),ri(64,HZ,r),ri(3,10,r),1);}
    for(let x=350;x<430;x++){const y=Math.round(62-Math.sin((x-350)/80*Math.PI)*10);fg.fillStyle=_gxMix(th.wallA,s1,0.45);fg.fillRect(x,y,1,62-y);}
    _gxEll(fg,240,HZ,W/2+20,8,shade(th.floor,0.15));
    break;}
  case'desert':
    _gxDisc(bg,0,0,380,46,26,_gxRgba('#fff4c0',0.35));_gxDisc(bg,0,0,380,46,20,'#fff0b0');_gxDisc(bg,0,0,380,46,17,'#ffe080');
    _gxRidge(fg,74,9,0.009,0.5,_gxMix(th.floor2||th.floor,s1,0.45),HZ+2);
    _gxRidge(fg,86,7,0.014,2.4,_gxMix(th.floor,s1,0.2),HZ+2);
    for(let i=0;i<4;i++){const x=ri(30,W-30,r),y=ri(72,84,r);fg.fillStyle=_gxMix('#2a6a30',s1,0.45);fg.fillRect(x,y-10,2,10);fg.fillRect(x-3,y-7,1,4);fg.fillRect(x-3,y-4,3,1);fg.fillRect(x+3,y-8,1,3);fg.fillRect(x+2,y-5,2,1);}
    break;
  case'volcano':{
    const vc=shade(th.wallA,-0.3);
    _gxRidge(fg,78,8,0.02,1,_gxMix(vc,s1,0.4),HZ+2);
    for(let y=22;y<=HZ;y++){const k=(y-22)/(HZ-22);const w=Math.round(18+k*150);fg.fillStyle=vc;fg.fillRect(300-w,y,w*2,1);}
    const gr=bg.createRadialGradient(300,18,2,300,18,70);gr.addColorStop(0,'rgba(255,140,40,0.85)');gr.addColorStop(1,'rgba(255,60,0,0)');bg.fillStyle=gr;bg.fillRect(200,0,200,100);
    fg.fillStyle='#ff7020';fg.fillRect(284,22,32,2);fg.fillStyle='#ffd040';fg.fillRect(290,22,20,1);
    for(const[sx,len,dir]of[[292,60,-1],[306,70,1],[300,40,0.3]]){let x=sx;for(let y=24;y<24+len;y++){x+=dir*(0.4+Math.sin(y*0.3)*0.3);fg.fillStyle=y%5?'#ff5a10':'#ffb030';fg.fillRect(Math.round(x),y,2,1);}}
    break;}
  case'snow':
    _gxPeaks(fg,r,HZ-6,7,40,70,_gxMix('#7088b0',s1,0.45),true);
    _gxPeaks(fg,r,HZ+2,8,22,40,_gxMix('#5a70a0',s1,0.2),true);
    for(let x=0;x<W;x+=ri(8,14,r)){const by=HZ+2,hh=ri(10,18,r);for(let y=0;y<hh;y++){const w=Math.round((y/hh)*5)+1;fg.fillStyle=_gxMix(th.wallA,s1,0.2);fg.fillRect(x-w,by-hh+y,w*2,1);}fg.fillStyle='#ffffff';fg.fillRect(x-1,by-hh,2,2);}
    break;
  case'mire':{
    _gxRidge(fg,84,4,0.02,1,_gxMix(th.wallA,s1,0.5),HZ+2);
    const tree=(x,by,hh,col)=>{fg.fillStyle=col;let cx=x;for(let y=0;y<hh;y++){if(y%6===0)cx+=r()<0.5?-1:1;fg.fillRect(cx-1,by-y,3,1);}
      for(let b=0;b<4;b++){let bx=cx,byy=by-hh*0.4-b*hh*0.15,d=b%2?1:-1;for(let k=0;k<hh*0.3;k++){bx+=d;byy-=r()<0.5?1:0;fg.fillRect(Math.round(bx),Math.round(byy),2,1);}}};
    for(let i=0;i<7;i++)tree(ri(0,W,r),HZ,ri(30,55,r),_gxMix(th.trunk||'#3a3028',s1,0.55));
    for(let i=0;i<6;i++)tree(ri(0,W,r),HZ+4,ri(45,70,r),_gxMix(th.trunk||'#3a3028',s1,0.25));
    break;}
  case'sky':{
    _gxDisc(bg,0,0,90,40,16,_gxRgba('#ffffff',0.5));_gxDisc(bg,0,0,90,40,12,'#fff8e0');
    for(let i=0;i<4;i++){const x=ri(40,W-40,r),y=ri(40,70,r),w=ri(16,30,r);fg.fillStyle=_gxMix(th.wallA||'#8070a0',s1,0.45);fg.fillRect(x-w,y,w*2,3);for(let k=0;k<8;k++){const ww=Math.round(w*(1-k/8));fg.fillRect(x-ww,y+3+k,ww*2,1);}fg.fillStyle=_gxMix(th.floor,s1,0.3);fg.fillRect(x-w,y-1,w*2,2);}
    for(let i=0;i<22;i++)_gxCloud(fg,ri(-20,W+20,r),ri(84,96,r),1+r()*0.8,'#f4f4ff','#c8c8e8');
    break;}
  case'citadel':{
    for(let i=0;i<70;i++){bg.fillStyle=r()<0.3?'#ffffff':'#a8a0d0';bg.fillRect(ri(0,W,r),ri(0,80,r),1,1);}
    _gxDisc(bg,0,0,400,34,13,'#f0ecd8');_gxDisc(bg,0,0,405,31,11,s0);
    const col=_gxMix(th.wallA,s0,0.3);
    const spire=(x,w,top)=>{fg.fillStyle=col;fg.fillRect(x-w,top,w*2,HZ-top+2);for(let k=0;k<w+6;k++){const ww=Math.max(0,w+1-k*((w+1)/(w+6)));fg.fillRect(Math.round(x-ww),top-k,Math.round(ww*2),1);}
      for(let wy=top+8;wy<HZ-6;wy+=12){fg.fillStyle=r()<0.6?'#ffd070':'#3a3050';fg.fillRect(x-1,wy,2,3);fg.fillStyle=col;}};
    fg.fillStyle=col;fg.fillRect(120,62,240,HZ-60);
    for(let x=120;x<360;x+=8)fg.fillRect(x,58,5,4);
    for(const[x,w,t]of[[130,8,40],[180,6,48],[240,12,18],[300,6,46],[350,8,36],[60,5,60],[420,5,58]])spire(x,w,t);
    break;}
  default:_gxRidge(fg,80,8,0.015,1,far,HZ+2);
  }
  // ground band
  const gTop=HZ;
  const gc=key==='meadow'||key==='forest'?th.grass||th.floor:th.floor;
  _gxGrad(fg,gTop,H,shade(gc,-0.12),shade(gc,0.05));
  for(let y=gTop+3,step=3;y<H;y+=step,step+=1){fg.fillStyle=_gxRgba(shade(gc,-0.25),0.35);fg.fillRect(0,y,W,1);}
  for(let i=0;i<80;i++){const y=ri(gTop+4,H-2,r),x=ri(0,W,r);fg.fillStyle=_gxRgba(r()<0.5?shade(gc,0.25):shade(gc,-0.25),0.7);fg.fillRect(x,y,2,1);}
  if(key==='coast'||key==='mire'){fg.fillStyle=_gxRgba(shade(gc,0.3),0.5);fg.fillRect(0,gTop,W,1);}
  // platforms
  const top=key==='meadow'||key==='forest'?shade(th.grass||th.floor,0.2):key==='sky'?'#f0f0ff':shade(th.floor,0.2);
  _gxPlatform(fg,340,118,72,14,top);
  _gxPlatform(fg,120,206,86,16,top);
  return{back,front};
}
function drawBattleBg(c,theme,time){
  const th=_gxTheme(theme),key=_gxThemeKey(theme);time=time||0;
  let L=_gxBBCache[key];if(!L)L=_gxBBCache[key]=_gxBattleStatic(key,th);
  c.save();
  c.drawImage(L.back,0,0);
  // behind-silhouette animation
  if(key==='meadow'||key==='coast'||key==='desert'||key==='sky'||key==='snow'){
    for(let i=0;i<4;i++){const x=((i*137+time*(4+i*1.5))%(W+80))-40;const y=14+i*13;_gxCloud(c,Math.round(x),y,0.8+(i%2)*0.5,key==='desert'?'#fff8e8':'#ffffff',key==='desert'?'#f0d8b0':'#d8e4f4');}}
  if(key==='cave'||key==='citadel'){for(let i=0;i<10;i++){const a=0.3+0.3*Math.sin(time*2+i*1.7);c.fillStyle='rgba(255,255,255,'+a.toFixed(2)+')';c.fillRect((i*53)%W,(i*29)%70+5,1,1);}}
  c.drawImage(L.front,0,0);
  if(key==='volcano'){for(let i=0;i<22;i++){const ph=(time*0.25+i*0.137)%1;const x=(i*97)%W+Math.sin(time*2+i)*6;const y=H-ph*(H+10);c.fillStyle=ph<0.6?'#ffb040':'#ff5a10';c.fillRect(Math.round(x),Math.round(y),1+(i%3===0),1);}}
  if(key==='snow'){for(let i=0;i<40;i++){const ph=(time*0.12+i*0.071)%1;const x=((i*83)%W+Math.sin(time+i)*8+ph*30)%W;c.fillStyle='rgba(255,255,255,0.85)';c.fillRect(Math.round(x),Math.round(ph*H),i%4?1:2,i%4?1:2);}}
  if(key==='mire'){for(let i=0;i<5;i++){const y=80+i*16;const x=((time*(6+i*2)+i*120)%(W+200))-200;c.fillStyle='rgba(200,220,200,0.10)';_gxEll(c,x+100,y,140,7,'rgba(200,215,200,0.10)');_gxEll(c,x+100-W-200,y,140,7,'rgba(200,215,200,0.10)');}}
  if(key==='forest'){for(let i=0;i<10;i++){const a=0.5+0.5*Math.sin(time*3+i*2);c.fillStyle='rgba(230,255,120,'+(a*0.8).toFixed(2)+')';c.fillRect(Math.round((i*61+Math.sin(time*0.7+i)*20)%W),Math.round(60+(i*37)%90+Math.cos(time+i)*6),1,1);}}
  if(key==='coast'){for(let i=0;i<12;i++){const a=Math.sin(time*2+i*1.3);if(a>0.6){c.fillStyle='#ffffff';c.fillRect((i*41)%W,66+(i*7)%30,2,1);}}}
  c.restore();
}
