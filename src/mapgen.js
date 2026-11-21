// ===================== MAPGEN =====================
// Every realm has its own layout algorithm (_MG_LAY[theme]); a shared finisher (_mgFinish) enforces borders,
// connectivity and places interactables with a "simple point" test so blockers never cut a path.
// Optional per-cell masks on the map (Uint8Array w*h, values 0/1, always present):
//  water  - cell is water. On T_WALL: draw a water body. On T_PATH with bridge=1: plank bridge/pier/boardwalk over water.
//  lava   - cell is molten lava. On T_WALL: draw lava. On T_PATH with bridge=1: stone bridge over lava.
//  ice    - ground is ice: draw ice instead of the floor under any non-wall tile (FLOOR/DECO/CHEST/SHRINE/BLOCK...).
//  bridge - T_PATH cell that is a bridge over water/lava/void (if neither water nor lava: cloud bridge over void/sea).
//  ruin   - T_WALL that is man-made masonry (ruins, temple, pyramid, chapel, throne) instead of the theme's natural wall.
//  rock   - T_WALL that is natural rock/cliff (snow cliffs, sea rocks) instead of the theme's wall style.
// map.arena = {x,y,w,h,kind}: boss arena rectangle; kind per realm (see _MG_LAY).

function tileAt(map,x,y){if(x<0||y<0||x>=map.w||y>=map.h)return T_WALL;return map.tiles[y*map.w+x];}
function setTile(map,x,y,v){if(x<0||y<0||x>=map.w||y>=map.h)return;map.tiles[y*map.w+x]=v;}

const _MG_MASKS=['water','lava','ice','bridge','ruin','rock'];
const _MG_D4=[[1,0],[-1,0],[0,1],[0,-1]];
const _MG_RING=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];

function _mgHash(a,b,c){let n=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(c|0,1442695041))|0;
  n=Math.imul(n^(n>>>13),1274126177);n^=n>>>16;n=Math.imul(n^(n>>>15),-2048144777);n^=n>>>13;return(n>>>0)/4294967296;}

function _mgLoot(li,r){
  if(r()<0.38)return{gold:ri(20,60,r)*(li+1)};
  const pool=[['potion',0],['orb',0],['cure',0],['super',2],['ether',1],['gorb',3],['revive',4],['max',6],['uorb',7]];
  let ids=pool.filter(p=>li>=p[1]).map(p=>p[0]);
  if(typeof ITEMS!=='undefined'&&ITEMS){const f=ids.filter(id=>ITEMS[id]);if(f.length)ids=f;}
  const id=(li>=3&&r()<0.5)?ids[ids.length-1-ri(0,Math.min(2,ids.length-1),r)]:pick(ids,r);
  const n=/orb/.test(id)?ri(2,3,r):(id==='potion'||id==='super'?ri(1,3,r):1);
  return{item:id,n};
}

// ---------------- context with drawing helpers ----------------
function _mgCtx(li,w,h,theme,r,seed){
  const N=w*h,G={li,w,h,theme,r,seed,N};
  G.T=new Uint8Array(N).fill(T_WALL);
  for(const k of _MG_MASKS)G[k]=new Uint8Array(N);
  G.protect=new Uint8Array(N);G.keep=new Uint8Array(N);
  G.pois=[];G.blocks=[];G.rooms=[];G.start=null;G.boss=null;G.arena=null;
  G.tunnel=T_FLOOR;G.medium=false;G.minKeep=10;G.border=null;G.blockDens=0.01;G.decoDens=0.02;G.arenaIce=false;
  const I=G.I=(x,y)=>y*w+x;
  G.inn=(x,y)=>x>=1&&y>=1&&x<w-1&&y<h-1;
  G.get=(x,y)=>(x<0||y<0||x>=w||y>=h)?T_WALL:G.T[I(x,y)];
  G.clr=i=>{for(const k of _MG_MASKS)G[k][i]=0;};
  G.set=(x,y,v)=>{if(!G.inn(x,y))return false;const i=I(x,y);G.clr(i);G.T[i]=v;return true;};
  G.mark=(x,y,v,m)=>{if(G.set(x,y,v))G[m][I(x,y)]=1;};
  G.wet=(x,y)=>G.mark(x,y,T_WALL,'water');
  G.lavaAt=(x,y)=>G.mark(x,y,T_WALL,'lava');
  G.iceAt=(x,y)=>G.mark(x,y,T_FLOOR,'ice');
  G.ruinAt=(x,y)=>G.mark(x,y,T_WALL,'ruin');
  G.rockAt=(x,y)=>G.mark(x,y,T_WALL,'rock');
  G.isMed=(x,y)=>{const i=I(x,y);return G.T[i]===T_WALL&&(G.water[i]||G.lava[i]||G.medium);};
  G.bridgeAt=(x,y)=>{if(!G.inn(x,y))return;const i=I(x,y);const wa=G.water[i],la=G.lava[i];G.clr(i);G.T[i]=T_PATH;G.bridge[i]=1;G.water[i]=wa;G.lava[i]=la;};
  // make passable whatever is there; water/lava/void become bridges
  G.cross=(x,y,v)=>{if(!G.inn(x,y))return;const i=I(x,y);if(G.bridge[i])return;
    if(G.T[i]===T_WALL&&(G.water[i]||G.lava[i]||G.medium))G.bridgeAt(x,y);
    else if(G.T[i]===T_WALL||G.T[i]===T_BLOCK||v!=null)G.set(x,y,v==null?G.tunnel:v);};
  G.vn=(x,y,s,salt)=>{const fx=x/s,fy=y/s,x0=Math.floor(fx),y0=Math.floor(fy);let tx=fx-x0,ty=fy-y0;tx=tx*tx*(3-2*tx);ty=ty*ty*(3-2*ty);
    const S=seed+salt*7919,a=_mgHash(x0,y0,S),b=_mgHash(x0+1,y0,S),c=_mgHash(x0,y0+1,S),d=_mgHash(x0+1,y0+1,S);
    return lerp(lerp(a,b,tx),lerp(c,d,tx),ty);};
  G.fbm=(x,y,s,salt)=>G.vn(x,y,s,salt)*0.65+G.vn(x,y,s/2.5,salt+31)*0.35;
  G.disc=(cx,cy,rx,ry,fn,jit)=>{rx=Math.max(rx,0.5);ry=Math.max(ry,0.5);
    for(let y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++)for(let x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++){
      if(!G.inn(x,y))continue;const dx=(x-cx)/rx,dy=(y-cy)/ry;let d=dx*dx+dy*dy;if(jit)d+=(G.vn(x,y,2.2,77)-0.5)*jit;if(d<=1)fn(x,y,d);}};
  G.rect=(x0,y0,rw,rh,fn)=>{for(let y=y0;y<y0+rh;y++)for(let x=x0;x<x0+rw;x++)if(G.inn(x,y))fn(x,y);};
  G.trace=pts=>{const out=[];let px=null,py=null;
    const push=(x,y)=>{if(px!==null&&x!==px&&y!==py)out.push([x,py]);if(x!==px||y!==py){out.push([x,y]);px=x;py=y;}};
    for(let k=0;k+1<pts.length;k++){const[x0,y0]=pts[k],[x1,y1]=pts[k+1];const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*2));
      for(let s=0;s<=n;s++)push(Math.round(x0+(x1-x0)*s/n),Math.round(y0+(y1-y0)*s/n));}
    if(pts.length===1)push(Math.round(pts[0][0]),Math.round(pts[0][1]));return out;};
  G.meander=(a,b,amp,step)=>{step=step||5;const L=Math.hypot(b[0]-a[0],b[1]-a[1])||1;const n=Math.max(1,Math.round(L/step));
    const px=-(b[1]-a[1])/L,py=(b[0]-a[0])/L;const pts=[a];let o=0,v=0;
    for(let k=1;k<n;k++){v=v*0.5+(r()*2-1)*amp*0.8;o=o*0.7+v;const t=k/n,s=Math.sin(Math.PI*t);
      pts.push([clamp(lerp(a[0],b[0],t)+px*o*s,2,w-3),clamp(lerp(a[1],b[1],t)+py*o*s,2,h-3)]);}
    pts.push(b);return G.trace(pts);};
  G.fat=(cells,fn)=>{for(const[x,y]of cells){fn(x,y);fn(x+1,y);fn(x,y+1);fn(x+1,y+1);}};
  G.poi=(x,y,t)=>{x=Math.round(x);y=Math.round(y);G.pois.push({x,y,t});if(G.inn(x,y))G.keep[I(x,y)]=1;};
  G.room=(x,y,rw,rh)=>{G.rooms.push({x:Math.round(x),y:Math.round(y),w:Math.round(rw),h:Math.round(rh),cx:Math.round(x+rw/2),cy:Math.round(y+rh/2)});};
  G.setArena=(cx,cy,rw,rh,kind)=>{const x=Math.max(1,Math.round(cx-rw/2)),y=Math.max(1,Math.round(cy-rh/2));
    G.arena={x,y,w:Math.min(rw,w-1-x),h:Math.min(rh,h-1-y),kind};G.boss={x:Math.round(cx),y:Math.round(cy)};};
  G.inArena=(x,y,m)=>{const a=G.arena;m=m||0;return a&&x>=a.x-m&&y>=a.y-m&&x<a.x+a.w+m&&y<a.y+a.h+m;};
  G.fillInner=v=>{for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)G.set(x,y,v);};
  G.grassBlob=(cx,cy,rx,ry,p)=>G.disc(cx,cy,rx,ry,(x,y)=>{const i=I(x,y);if(G.T[i]===T_FLOOR&&!G.ice[i]&&r()<(p||0.92))G.T[i]=T_GRASS;},0.5);
  G.decoBlob=(cx,cy,rx,ry,p)=>G.disc(cx,cy,rx,ry,(x,y)=>{const i=I(x,y);if(G.T[i]===T_FLOOR&&r()<(p||0.5))G.T[i]=T_DECO;},0.5);
  return G;
}

// ---------------- connectivity ----------------
function _mgLabel(G){
  const{w,h,T}=G,N=w*h,lab=new Int32Array(N).fill(-1),sizes=[],q=new Int32Array(N);
  for(let i=0;i<N;i++){if(lab[i]>=0||!passable(T[i]))continue;const id=sizes.length;let qh=0,qt=0;q[qt++]=i;lab[i]=id;
    while(qh<qt){const c=q[qh++],cx=c%w;
      if(cx>0&&lab[c-1]<0&&passable(T[c-1])){lab[c-1]=id;q[qt++]=c-1;}
      if(cx<w-1&&lab[c+1]<0&&passable(T[c+1])){lab[c+1]=id;q[qt++]=c+1;}
      if(c>=w&&lab[c-w]<0&&passable(T[c-w])){lab[c-w]=id;q[qt++]=c-w;}
      if(c<N-w&&lab[c+w]<0&&passable(T[c+w])){lab[c+w]=id;q[qt++]=c+w;}}
    sizes.push(qt);}
  return{lab,sizes};
}
function _mgFillWall(G,i){const x=i%G.w,y=(i/G.w)|0;
  if(G.border==='water')G.wet(x,y);else G.set(x,y,T_WALL);}
function _mgConnect(G){
  const{w,h,N}=G,s0=G.I(G.start.x,G.start.y),par=new Int32Array(N),q=new Int32Array(N);
  for(let it=0;it<300;it++){
    const{lab,sizes}=_mgLabel(G),m=lab[s0];
    const keepC=new Uint8Array(sizes.length);for(let i=0;i<N;i++)if(G.keep[i]&&lab[i]>=0)keepC[lab[i]]=1;
    keepC[lab[G.I(G.boss.x,G.boss.y)]]=1;
    let tgt=-1;
    for(let i=0;i<N;i++){const c=lab[i];if(c<0||c===m)continue;
      if(sizes[c]<G.minKeep&&!keepC[c]){_mgFillWall(G,i);continue;}
      if(tgt<0||sizes[c]>sizes[tgt])tgt=c;}
    if(tgt<0)return;
    par.fill(-2);let qh=0,qt=0,hit=-1;
    for(let i=0;i<N;i++)if(lab[i]===tgt){par[i]=-1;q[qt++]=i;}
    while(qh<qt&&hit<0){const c=q[qh++],cx=c%w,cy=(c/w)|0;
      for(const[dx,dy]of _MG_D4){const nx=cx+dx,ny=cy+dy;if(nx<1||ny<1||nx>w-2||ny>h-2)continue;const n=ny*w+nx;
        if(par[n]!==-2||G.protect[n])continue;par[n]=c;if(lab[n]===m){hit=n;break;}q[qt++]=n;}}
    if(hit<0){for(let i=0;i<N;i++)if(lab[i]===tgt)_mgFillWall(G,i);continue;}
    for(let c=par[hit];c>=0&&par[c]!==-1;c=par[c]){G.cross(c%w,(c/w)|0);}
    // last cell (par==-1) is inside the component already
  }
}

// =============================== LAYOUTS ===============================
const _MG_LAY={};

// I. Meadow: open rolling fields, tree clusters, winding river with bridges, flower meadows, village clearing.
_MG_LAY.meadow=G=>{
  const{w,h,r}=G;G.tunnel=T_PATH;G.blockDens=0.006;G.decoDens=0.025;
  G.fillInner(T_FLOOR);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const e=Math.min(x,y,w-1-x,h-1-y);
    if(e<2+G.fbm(x,y,6,1)*5||G.fbm(x,y,9,2)>0.68)G.set(x,y,T_WALL);}
  for(let k=0;k<w*h/240;k++){const cx=ri(3,w-4,r),cy=ri(3,h-4,r),rd=0.7+r()*1.7;G.disc(cx,cy,rd,rd*0.9,(x,y)=>G.set(x,y,T_WALL),0.5);}
  const vx=10,vy=ri(Math.floor(h*0.3),Math.ceil(h*0.7),r),ax=w-12,ay=ri(12,h-13,r);
  // river
  const rx0=Math.round(w*0.46)+ri(-3,3,r),rx1=Math.round(w*0.46)+ri(-3,3,r);
  const river=G.meander([rx0,1],[rx1,h-2],4,6);
  river.forEach(([x,y],k)=>{const rd=1.25+0.45*Math.sin(k*0.09);G.disc(x,y,rd,rd,(xx,yy)=>G.wet(xx,yy));});
  // pond fed by a stream
  const px=ri(Math.round(w*0.6),w-24,r),py=ay<h/2?ri(h-14,h-9,r):ri(8,13,r);
  G.disc(px,py,3.5,2.5,(x,y)=>G.wet(x,y),0.6);
  // clearings
  G.disc(vx,vy,9,7,(x,y)=>G.set(x,y,T_FLOOR),0.4);
  G.disc(ax,ay,9,9,(x,y)=>G.set(x,y,T_FLOOR),0.4);
  // flower meadows & tall grass
  for(let k=0;k<7;k++)G.decoBlob(ri(6,w-7,r),ri(5,h-6,r),3+r()*4,2+r()*3,0.45);
  for(let k=0;k<14+(w*h/700|0);k++)G.grassBlob(ri(5,w-6,r),ri(4,h-5,r),2.5+r()*4,2+r()*2.5);
  // secret glades in tree clusters
  for(let a=0,n=0;a<400&&n<5;a++){const x=ri(4,w-5,r),y=ri(4,h-5,r);
    if(G.get(x,y)!==T_WALL||G.water[G.I(x,y)]||Math.hypot(x-vx,y-vy)<14||Math.hypot(x-ax,y-ay)<12)continue;
    G.disc(x,y,2.4,2,(xx,yy)=>{if(!G.water[G.I(xx,yy)])G.set(xx,yy,T_FLOOR);},0.3);G.decoBlob(x,y,2,1.5,0.4);G.poi(x,y,'treasure');n++;}
  // main road with a bridge over the river
  const road=G.meander([vx,vy],[ax-9,ay],5,7).concat(G.trace([[ax-9,ay],[ax-6,ay]]));
  const rd=(x,y)=>{if(!G.inn(x,y))return;const i=G.I(x,y);if(G.bridge[i])return;if(G.water[i])G.bridgeAt(x,y);else G.set(x,y,T_PATH);};
  G.fat(road,rd);
  // extra wooden bridges + footpaths
  for(const f of[0.18,0.82]){const[bx,by]=river[Math.floor(f*(river.length-1))];
    for(let x=bx-5;x<=bx+5;x++){const i=G.I(x,by);if(G.water[i])G.bridgeAt(x,by);}
    for(const s of[-1,1]){let x=bx+s*2;while(G.inn(x,by)&&(G.water[G.I(x,by)]||G.bridge[G.I(x,by)]))x+=s;
      for(let k=0;k<4;k++)rd(x+s*k,by);}}
  // village: plaza, fences, huts, flower ring
  G.disc(vx,vy,2.6,2.2,(x,y)=>G.set(x,y,T_PATH));
  G.disc(vx,vy,5,4,(x,y,d)=>{if(d>0.7&&G.get(x,y)===T_FLOOR&&r()<0.5)G.T[G.I(x,y)]=T_DECO;});
  for(const[hx,hy]of[[vx-6,vy-4],[vx+4,vy-5],[vx-5,vy+3]])for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)G.blocks.push([hx+dx,hy+dy]);
  for(let x=vx-7;x<=vx-3;x+=2)G.blocks.push([x,vy+6]);
  G.start={x:vx,y:vy};G.shopSpot=[vx+3,vy-2];G.hintSpot=[vx-2,vy+2];G.room(vx-9,vy-7,18,14);
  // arena: stone circle
  G.setArena(ax,ay,19,19,'stonecircle');
  for(let k=0;k<12;k++){if(k%4===2)continue;const a=k/12*Math.PI*2;G.blocks.push([Math.round(ax+Math.cos(a)*5.5),Math.round(ay+Math.sin(a)*5.5)]);}
  G.disc(ax,ay,8,8,(x,y,d)=>{if(d>0.75&&G.get(x,y)===T_FLOOR&&r()<0.35)G.T[G.I(x,y)]=T_DECO;});
};

// II. Forest: dense maze of narrow trails (spanning-tree maze + organic erosion), hidden glades, ancient grove.
_MG_LAY.forest=G=>{
  const{w,h,r}=G;G.blockDens=0.008;G.decoDens=0.03;
  const cs=6,cols=Math.floor((w-4)/cs),rows=Math.floor((h-4)/cs),mc=cols-3;
  const nodes=[];for(let j=0;j<rows;j++)for(let i=0;i<mc;i++)nodes.push([2+cs*i+3+ri(-1,1,r),2+cs*j+3+ri(-1,1,r)]);
  const id=(i,j)=>j*mc+i,adj=nodes.map(()=>[]),sj=ri(1,rows-2,r);
  const vis=new Uint8Array(nodes.length),stack=[id(0,sj)];vis[stack[0]]=1;const edges=[];
  while(stack.length){const c=stack[stack.length-1],ci=c%mc,cj=(c/mc)|0;
    const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[ci+a,cj+b]).filter(([a,b])=>a>=0&&b>=0&&a<mc&&b<rows&&!vis[id(a,b)]);
    if(!nb.length){stack.pop();continue;}const[a,b]=pick(nb,r),n=id(a,b);vis[n]=1;edges.push([c,n]);adj[c].push(n);adj[n].push(c);stack.push(n);}
  for(let k=0;k<nodes.length*0.12;k++){const c=ri(0,nodes.length-1,r),ci=c%mc,cj=(c/mc)|0;const[a,b]=pick([[ci+1,cj],[ci,cj+1]],r);
    if(a<mc&&b<rows){const n=id(a,b);if(!adj[c].includes(n)){edges.push([c,n]);adj[c].push(n);adj[n].push(c);}}}
  for(const[a,b]of edges){const cells=G.meander(nodes[a],nodes[b],1.3,3);if(r()<0.35)G.fat(cells,(x,y)=>G.set(x,y,T_FLOOR));else cells.forEach(([x,y])=>G.set(x,y,T_FLOOR));}
  // organic erosion
  const snap=G.T.slice();
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){if(snap[G.I(x,y)]!==T_WALL)continue;let n=0;for(const[dx,dy]of _MG_RING)if(snap[G.I(x+dx,y+dy)]!==T_WALL)n++;
    if(n>=5&&r()<0.6)G.set(x,y,T_FLOOR);}
  // glades
  nodes.forEach(([x,y],k)=>{if(k===id(0,sj))return;const deg=adj[k].length;
    if(deg===1){G.disc(x,y,2.6+r(),2.2+r(),(xx,yy)=>G.set(xx,yy,T_FLOOR),0.4);G.decoBlob(x,y,2.5,2,0.25);G.poi(x,y,'treasure');G.room(x-3,y-3,6,6);}
    else if(r()<0.12){G.disc(x,y,3.5+r()*1.5,3+r(),(xx,yy)=>G.set(xx,yy,T_FLOOR),0.5);G.grassBlob(x,y,3,2.5);G.poi(x,y,'lore');G.room(x-4,y-3,8,6);}
    else G.disc(x,y,1.2,1.2,(xx,yy)=>G.set(xx,yy,T_FLOOR));});
  // undergrowth
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=G.I(x,y);if(G.T[i]===T_FLOOR&&G.fbm(x,y,5,5)>0.52)G.T[i]=T_GRASS;}
  const[sx,sy]=nodes[id(0,sj)];G.disc(sx,sy,3,2.6,(x,y)=>G.set(x,y,T_FLOOR));G.start={x:sx,y:sy};
  // ancient grove
  const x0=2+cs*mc,ax=Math.round((x0+w-3)/2),ay=ri(11,h-12,r);
  G.disc(ax,ay,8.5,8,(x,y)=>G.set(x,y,T_FLOOR),0.5);
  G.disc(ax,ay-5.2,2.2,1.6,(x,y)=>G.set(x,y,T_WALL)); // the ancient tree
  G.setArena(ax,ay,19,17,'grove');
  for(let k=0;k<14;k++){if(k%5===0)continue;const a=k/14*Math.PI*2+0.2;G.blocks.push([Math.round(ax+Math.cos(a)*6.5),Math.round(ay+Math.sin(a)*6)]);}
  G.disc(ax,ay,4.5,4,(x,y,d)=>{if(d>0.6&&G.get(x,y)===T_FLOOR&&r()<0.5)G.T[G.I(x,y)]=T_DECO;});
  // deepest maze node of the last column leads to the grove
  const dep=new Int32Array(nodes.length).fill(-1),qq=[id(0,sj)];dep[qq[0]]=0;
  while(qq.length){const c=qq.shift();for(const n of adj[c])if(dep[n]<0){dep[n]=dep[c]+1;qq.push(n);}}
  let best=id(mc-1,0);for(let j=0;j<rows;j++)if(dep[id(mc-1,j)]>dep[best])best=id(mc-1,j);
  G.meander(nodes[best],[ax-8,ay],1.5,3).forEach(([x,y])=>G.set(x,y,T_FLOOR));
};

// III. Cave: cellular-automata caverns + carved chambers linked by tunnels, crystal clusters, treasure dead ends.
_MG_LAY.cave=G=>{
  const{w,h,r,N}=G;G.minKeep=14;G.blockDens=0.012;G.decoDens=0.035;
  let m=new Uint8Array(N);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)m[G.I(x,y)]=(x<3||y<3||x>w-4||y>h-4)?1:(r()<0.57?1:0);
  for(let it=0;it<5;it++){const n2=m.slice();
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){let n=0;for(const[dx,dy]of _MG_RING)n+=m[G.I(x+dx,y+dy)];
      n2[G.I(x,y)]=(x<3||y<3||x>w-4||y>h-4)?1:(n>=5||(it<2&&n<=1))?1:0;}m=n2;}
  for(let i=0;i<N;i++)if(!m[i])G.T[i]=T_FLOOR;
  const sx=7,sy=ri(8,h-9,r),ax=w-14,ay=ri(12,h-13,r);
  const ch=[{x:sx,y:sy,rx:4.5,ry:3.5,k:'start'}];
  for(let a=0;a<600&&ch.length<9+(G.li>>1);a++){const x=ri(14,w-24,r),y=ri(6,h-7,r);
    if(ch.some(c=>Math.hypot(c.x-x,c.y-y)<13))continue;ch.push({x,y,rx:3.5+r()*3,ry:2.8+r()*2,k:''});}
  ch.push({x:ax,y:ay,rx:10,ry:7,k:'arena'});
  for(const c of ch)if(c.k!=='arena'){G.disc(c.x,c.y,c.rx,c.ry,(x,y)=>G.set(x,y,T_FLOOR),0.6);G.room(c.x-c.rx,c.y-c.ry,c.rx*2,c.ry*2);}
  // MST of chambers (arena only via its nearest chamber)
  const inT=[0],tun=(a,b)=>{const cells=G.meander([a.x,a.y],[b.x,b.y],2.2,4);if(r()<0.4)G.fat(cells,(x,y)=>G.set(x,y,T_FLOOR));else cells.forEach(([x,y])=>G.set(x,y,T_FLOOR));};
  const rest=ch.map((_,i)=>i).filter(i=>i>0&&ch[i].k!=='arena');
  while(rest.length){let bi=-1,bj=-1,bd=1e9;for(const i of inT)for(const j of rest){const d=Math.hypot(ch[i].x-ch[j].x,ch[i].y-ch[j].y);if(d<bd){bd=d;bi=i;bj=j;}}
    tun(ch[bi],ch[bj]);inT.push(bj);rest.splice(rest.indexOf(bj),1);}
  for(let k=0;k<3;k++){const a=pick(inT,r),b=pick(inT,r);if(a!==b)tun(ch[a],ch[b]);}
  const A=ch[ch.length-1];let near=ch[0];for(const c of ch)if(c!==A&&c.x>near.x)near=c;tun(near,{x:A.x-9,y:A.y});
  // dead-end treasure pockets
  const mids=ch.filter(c=>!c.k);
  for(let k=0;k<6&&mids.length;k++){const c=pick(mids,r),an=r()*Math.PI*2,L=7+r()*5;
    const ex=clamp(Math.round(c.x+Math.cos(an)*(c.rx+L)),3,w-4),ey=clamp(Math.round(c.y+Math.sin(an)*(c.ry+L*0.7)),3,h-4);
    G.meander([c.x,c.y],[ex,ey],1.2,3).forEach(([x,y])=>G.set(x,y,T_FLOOR));G.disc(ex,ey,1.7,1.5,(x,y)=>G.set(x,y,T_FLOOR));G.poi(ex,ey,'treasure');}
  // underground pools, crystal clusters, glowing moss
  for(let k=0;k<2&&mids.length;k++){const c=mids[(k*3+1)%mids.length];G.disc(c.x+ri(-1,1,r),c.y,Math.max(1.5,c.rx*0.35),Math.max(1.2,c.ry*0.35),(x,y)=>G.wet(x,y),0.3);}
  for(const c of mids){for(let n=ri(1,2,r);n>0;n--){const cx=Math.round(c.x+(r()*2-1)*c.rx*0.6),cy=Math.round(c.y+(r()*2-1)*c.ry*0.6);
    G.blocks.push([cx,cy]);for(let k=0;k<3;k++)G.blocks.push([cx+ri(-1,1,r),cy+ri(-1,1,r)]);G.decoBlob(cx,cy,2.5,2,0.45);}}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=G.I(x,y);if(G.T[i]===T_FLOOR&&G.fbm(x,y,6,4)>0.56)G.T[i]=T_GRASS;}
  G.disc(sx,sy,2.5,2,(x,y)=>G.set(x,y,T_FLOOR));G.start={x:sx,y:sy};
  // crystal hall
  G.disc(ax,ay,10,7,(x,y)=>G.set(x,y,T_FLOOR));
  G.setArena(ax,ay,21,15,'crystalhall');
  for(const[dx,dy]of[[6,3],[-6,3],[6,-3],[-6,-3],[3,5],[-3,5],[3,-5],[-3,-5],[8,0]])G.blocks.push([ax+dx,ay+dy]);
  G.disc(ax,ay,10,7,(x,y,d)=>{if(d>0.72&&r()<0.4)G.T[G.I(x,y)]=T_DECO;});
};

// IV. Coast: zig-zag chain of sandy islands in the sea linked by piers, lagoons, treasure islets, whirlpool arena.
_MG_LAY.coast=G=>{
  const{w,h,r}=G;G.medium=true;G.tunnel=T_PATH;G.border='water';G.minKeep=6;G.blockDens=0.008;G.decoDens=0.03;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)G.wet(x,y);
  const S=[9,h-10],A=[w-13,12];
  const wp=[S,[Math.round(w*0.22),Math.round(h*0.22)],[Math.round(w*0.5),Math.round(h*0.45)],[Math.round(w*0.72),h-10],A];
  const isl=[{x:S[0],y:S[1],rx:8,ry:6}];
  for(let s=0;s+1<wp.length;s++){const a=wp[s],b=wp[s+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/14));
    for(let k=1;k<=n;k++){if(s+1===wp.length-1&&k===n)break;const t=k/n,o=(r()*2-1)*4;
      isl.push({x:clamp(Math.round(lerp(a[0],b[0],t)-(b[1]-a[1])/L*o),8,w-9),y:clamp(Math.round(lerp(a[1],b[1],t)+(b[0]-a[0])/L*o),7,h-8),rx:4.5+r()*3.5,ry:3.5+r()*2.5});}}
  isl.push({x:A[0],y:A[1],rx:10,ry:10,arena:1});
  const land=c=>G.disc(c.x,c.y,c.rx,c.ry,(x,y,d)=>{G.set(x,y,T_FLOOR);if(d>0.75&&r()<0.12)G.T[G.I(x,y)]=T_DECO;},0.8);
  for(const c of isl){land(c);if(!c.arena)G.room(c.x-c.rx,c.y-c.ry,c.rx*2,c.ry*2);}
  // island interiors: grass and palms; lagoons in large islands
  isl.forEach((c,k)=>{if(c.arena)return;
    if(k>0&&c.rx>=6.2){G.disc(c.x,c.y,c.rx*0.38,c.ry*0.38,(x,y)=>G.wet(x,y),0.3);c.lagoon=1;}
    else if(k>0)G.grassBlob(c.x,c.y,c.rx*0.55,c.ry*0.55);
    if(k>0)for(let p=0;p<3;p++)G.blocks.push([Math.round(c.x+(r()*2-1)*c.rx*0.6),Math.round(c.y+(r()*2-1)*c.ry*0.6)]);
    if(c.lagoon)G.grassBlob(c.x,c.y,c.rx*0.8,c.ry*0.8,0.5);});
  const pier=(a,b,fat)=>{const cells=G.trace(r()<0.5?[[a.x,a.y],[b.x,a.y],[b.x,b.y]]:[[a.x,a.y],[a.x,b.y],[b.x,b.y]]);const f=(x,y)=>{if(G.isMed(x,y))G.bridgeAt(x,y);};
    if(fat)G.fat(cells,f);else cells.forEach(([x,y])=>f(x,y));};
  for(let k=0;k+1<isl.length;k++)pier(isl[k],isl[k+1],k===0);
  for(let k=1;k+2<isl.length-1;k++)if(Math.abs(isl[k].x-isl[k+2].x)+Math.abs(isl[k].y-isl[k+2].y)<26&&r()<0.6)pier(isl[k],isl[k+2]);
  // treasure islets
  for(let k=1,made=0;k<isl.length-1&&made<6;k++){const c=isl[k];
    for(let a=0;a<8;a++){const an=r()*Math.PI*2,d=Math.max(c.rx,c.ry)+5+r()*3,x=Math.round(c.x+Math.cos(an)*d),y=Math.round(c.y+Math.sin(an)*d);
      if(x<5||y<5||x>w-6||y>h-6)continue;if(isl.some(o=>o!==c&&Math.hypot(o.x-x,o.y-y)<Math.max(o.rx,o.ry)+5))continue;
      const it={x,y,rx:2+r(),ry:1.8+r()*0.8};land(it);pier(c,it);G.poi(x,y,'treasure');made++;break;}}
  // sea rocks
  for(let k=0;k<w*h/300;k++){const x=ri(3,w-4,r),y=ri(3,h-4,r);let ok=true;
    for(let yy=y-3;yy<=y+3&&ok;yy++)for(let xx=x-3;xx<=x+3;xx++)if(G.inn(xx,yy)&&G.T[G.I(xx,yy)]!==T_WALL){ok=false;break;}
    if(ok)G.disc(x,y,0.6+r()*0.8,0.6+r()*0.6,(xx,yy)=>G.rockAt(xx,yy));}
  G.start={x:S[0],y:S[1]};G.disc(S[0],S[1],2,2,(x,y)=>G.set(x,y,T_FLOOR));G.shopSpot=[S[0]+3,S[1]-2];
  // whirlpool arena: land disc, water annulus, central platform, two bridges
  const[ax,ay]=A;G.disc(ax,ay,10,10,(x,y)=>G.set(x,y,T_FLOOR),0.4);
  G.disc(ax,ay,6.4,6.4,(x,y,d)=>{if(d>0.56)G.wet(x,y);});
  const prev=isl[isl.length-2],a0=Math.atan2(prev.y-ay,prev.x-ax);
  for(const a of[a0,a0+Math.PI])G.trace([[ax+Math.cos(a)*3.5,ay+Math.sin(a)*3.5],[ax+Math.cos(a)*7.5,ay+Math.sin(a)*7.5]]).forEach(([x,y])=>{if(G.isMed(x,y))G.bridgeAt(x,y);});
  G.setArena(ax,ay,21,21,'whirlpool');
};

// V. Desert: open dunes, rock outcrops, BSP-walled temple ruins, oasis, concentric pyramid arena.
_MG_LAY.desert=G=>{
  const{w,h,r}=G;G.blockDens=0.006;G.decoDens=0.02;
  G.fillInner(T_FLOOR);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const e=Math.min(x,y,w-1-x,h-1-y);
    if(e<1.5+G.fbm(x,y,6,1)*4||G.fbm(x,y,8,3)>0.69)G.set(x,y,T_WALL);}
  const S=[8,h-9],PS=23,px0=w-PS-3,py0=3,ox=Math.round(w*0.45),oy=Math.round(h*0.52);
  const busy=[{x:px0-3,y:py0-3,w:PS+6,h:PS+6},{x:ox-11,y:oy-9,w:22,h:18},{x:S[0]-7,y:S[1]-7,w:15,h:14}];
  // dunes & dry grass
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=G.I(x,y);if(G.T[i]===T_FLOOR&&G.fbm(x,y,4,8)>0.66&&r()<0.3)G.T[i]=T_DECO;}
  for(let k=0;k<12+(w*h/900|0);k++)G.grassBlob(ri(5,w-6,r),ri(5,h-6,r),2+r()*3.5,1.5+r()*2.5,0.85);
  // ruins
  const leaves=[];const split=(x,y,rw,rh,d)=>{if(d<3&&(rw>=10||rh>=8)&&r()<0.85){
      if(rw>=rh*1.2||rh<8){const s=ri(4,rw-5,r);split(x,y,s+1,rh,d+1);split(x+s,y,rw-s,rh,d+1);}
      else{const s=ri(4,rh-5,r);split(x,y,rw,s+1,d+1);split(x,y+s,rw,rh-s,d+1);}}else leaves.push({x,y,w:rw,h:rh});};
  for(let a=0,n=0;a<200&&n<3;a++){const rw=ri(14,19,r),rh=ri(10,13,r),x=ri(4,w-rw-4,r),y=ri(4,h-rh-4,r),b={x,y,w:rw,h:rh};
    if(busy.some(o=>x<o.x+o.w+2&&x+rw+2>o.x&&y<o.y+o.h+2&&y+rh+2>o.y))continue;busy.push(b);n++;
    G.rect(x-1,y-1,rw+2,rh+2,(xx,yy)=>G.set(xx,yy,T_FLOOR));
    const lf0=leaves.length;split(x,y,rw,rh,0);
    for(let k=lf0;k<leaves.length;k++){const o=leaves[k];
      G.rect(o.x,o.y,o.w,o.h,(xx,yy)=>{const edge=xx===o.x||yy===o.y||xx===o.x+o.w-1||yy===o.y+o.h-1;if(edge)G.ruinAt(xx,yy);else G.set(xx,yy,T_PATH);});}
    for(let k=lf0;k<leaves.length;k++){const o=leaves[k];
      for(let d=0;d<2;d++){const side=ri(0,3,r);let dx0,dy0,ddx=0,ddy=0;
        if(side<2){dx0=o.x+ri(1,o.w-3,r);dy0=side?o.y:o.y+o.h-1;ddx=1;}else{dy0=o.y+ri(1,o.h-3,r);dx0=side===2?o.x:o.x+o.w-1;ddy=1;}
        G.set(dx0,dy0,T_FLOOR);G.set(dx0+ddx,dy0+ddy,T_FLOOR);}
      if(r()<0.6)G.poi(o.x+(o.w>>1),o.y+(o.h>>1),'treasure');G.room(o.x,o.y,o.w,o.h);}
    G.rect(x,y,rw,rh,(xx,yy)=>{const i=G.I(xx,yy);if(G.ruin[i]&&r()<0.1){G.set(xx,yy,T_DECO);}});}
  // oasis
  G.disc(ox,oy,10,8,(x,y)=>G.set(x,y,T_FLOOR),0.5);G.grassBlob(ox,oy,7.5,6,0.95);
  G.disc(ox,oy,4,2.6,(x,y)=>G.wet(x,y),0.3);
  for(let k=0;k<7;k++){const a=k/7*Math.PI*2;G.blocks.push([Math.round(ox+Math.cos(a)*6),Math.round(oy+Math.sin(a)*4.4)]);}
  G.poi(ox+7,oy+1,'lore');G.room(ox-8,oy-6,16,12);
  // camp
  G.disc(S[0],S[1],5,4,(x,y)=>G.set(x,y,T_FLOOR));G.blocks.push([S[0]-3,S[1]-2],[S[0]-2,S[1]-2],[S[0]+3,S[1]+2]);
  G.start={x:S[0],y:S[1]};G.room(S[0]-5,S[1]-4,10,8);
  // pyramid: 3 concentric masonry rings, gates alternate sides -> spiral walk
  const cxp=px0+11,cyp=py0+11;
  G.rect(px0-2,py0-1,PS+4,PS+3,(x,y)=>G.set(x,y,T_FLOOR));
  const ring=(o,gate)=>{for(let k=o;k<PS-o;k++)for(const[x,y]of[[px0+k,py0+o],[px0+k,py0+PS-1-o],[px0+o,py0+k],[px0+PS-1-o,py0+k]]){
      G.ruinAt(x,y);G.protect[G.I(x,y)]=1;}
    for(let k=-1;k<=1;k++){const x=cxp+k,y=gate?py0+o:py0+PS-1-o;G.set(x,y,T_PATH);G.protect[G.I(x,y)]=0;}};
  ring(0,0);ring(4,1);ring(8,0);
  G.rect(px0+1,py0+1,PS-2,3,(x,y)=>G.set(x,y,T_PATH));G.rect(px0+1,py0+PS-4,PS-2,3,(x,y)=>G.set(x,y,T_PATH));
  G.rect(px0+1,py0+1,3,PS-2,(x,y)=>G.set(x,y,T_PATH));G.rect(px0+PS-4,py0+1,3,PS-2,(x,y)=>G.set(x,y,T_PATH));
  G.rect(px0+5,py0+5,PS-10,3,(x,y)=>G.set(x,y,T_PATH));G.rect(px0+5,py0+PS-8,PS-10,3,(x,y)=>G.set(x,y,T_PATH));
  G.rect(px0+5,py0+5,3,PS-10,(x,y)=>G.set(x,y,T_PATH));G.rect(px0+PS-8,py0+5,3,PS-10,(x,y)=>G.set(x,y,T_PATH));
  G.rect(px0+9,py0+9,5,5,(x,y)=>G.set(x,y,T_FLOOR));
  for(const[x,y]of[[px0+2,py0+2],[px0+PS-3,py0+2],[px0+2,py0+PS-3],[px0+PS-3,py0+PS-3]])G.blocks.push([x,y]);
  G.setArena(cxp,cyp,PS,PS,'pyramid');G.arena.x=px0;G.arena.y=py0;
  // caravan road to the pyramid gate
  G.meander([S[0],S[1]],[cxp,py0+PS+1],5,7).forEach(([x,y])=>{const i=G.I(x,y);if(!G.ruin[i]&&(G.T[i]!==T_FLOOR||r()<0.75)&&!G.water[i])G.set(x,y,T_PATH);});
};

// VI. Volcano: Voronoi plateaus split by lava rivers, stone bridges, ash fields, spiral ascent up the crater.
_MG_LAY.volcano=G=>{
  const{w,h,r}=G;G.blockDens=0.012;G.decoDens=0.025;
  G.fillInner(T_FLOOR);
  const mx=Math.round(w*0.62),my=Math.round(h*0.46),R=16.8,S=[7,h-8];
  const seeds=[[S[0]+2,S[1]-2]];
  for(let a=0;a<800&&seeds.length<14;a++){const x=ri(5,w-6,r),y=ri(5,h-6,r);
    if(Math.hypot(x-mx,y-my)<R+4)continue;if(seeds.some(s=>Math.hypot(s[0]-x,s[1]-y)<11))continue;seeds.push([x,y]);}
  const pairs=new Map();
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(Math.hypot(x-mx,y-my)<=R)continue;
    let d1=1e9,d2=1e9,a=-1,b=-1;const jx=x+(G.vn(x,y,5,11)-0.5)*5,jy=y+(G.vn(x,y,5,12)-0.5)*5;
    for(let k=0;k<seeds.length;k++){const d=Math.hypot(jx-seeds[k][0],jy-seeds[k][1]);
      if(d<d1){d2=d1;b=a;d1=d;a=k;}else if(d<d2){d2=d;b=k;}}
    if(d2-d1<1.9){G.lavaAt(x,y);const key=Math.min(a,b)*64+Math.max(a,b);if(!pairs.has(key))pairs.set(key,[]);pairs.get(key).push([x,y]);}}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(Math.hypot(x-mx,y-my)<=R+1)continue;const e=Math.min(x,y,w-1-x,h-1-y);
    if(e<1.5+G.fbm(x,y,6,2)*3||G.fbm(x,y,7,5)>0.71)G.set(x,y,T_WALL);else if(G.fbm(x,y,6,9)>0.73)G.lavaAt(x,y);}
  // bridges: MST over plateau adjacency + extra loops
  const par=seeds.map((_,i)=>i),fd=i=>par[i]===i?i:(par[i]=fd(par[i]));
  const keys=[...pairs.keys()].filter(k=>pairs.get(k).length>=3);for(let i=keys.length-1;i>0;i--){const j=ri(0,i,r);[keys[i],keys[j]]=[keys[j],keys[i]];}
  const bridge=key=>{const a=(key/64)|0,b=key%64,cells=pairs.get(key);const c=cells[Math.floor(cells.length*(0.3+r()*0.4))];
    const ends=[a,b].map(s=>{const[tx,ty]=seeds[s];const L=Math.hypot(tx-c[0],ty-c[1])||1;let x=c[0],y=c[1];
      for(let st=0;st<24;st++){x+=(tx-c[0])/L*0.5;y+=(ty-c[1])/L*0.5;const i=G.I(Math.round(x),Math.round(y));if(!G.lava[i]&&st>1)break;}return[x,y];});
    const cells2=G.trace([ends[0],ends[1]]);const f=(x,y)=>{const i=G.I(x,y);if(G.lava[i]&&G.T[i]===T_WALL)G.bridgeAt(x,y);};
    if(r()<0.5)G.fat(cells2,f);else cells2.forEach(([x,y])=>f(x,y));};
  for(const k of keys){const a=fd((k/64)|0),b=fd(k%64);if(a!==b){par[a]=b;bridge(k);}else if(r()<0.3)bridge(k);}
  // ash fields
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=G.I(x,y);if(G.T[i]===T_FLOOR&&G.fbm(x,y,5,7)>0.55)G.T[i]=T_GRASS;}
  // crater mountain with spiral ascent (ring walls with alternating gates)
  const a0=Math.atan2(S[1]-my,S[0]-mx);
  const gap=(x,y,rr,ga)=>{let d=Math.atan2(y-my,x-mx)-ga;d=Math.atan2(Math.sin(d),Math.cos(d));return Math.abs(d)*rr<1.8;};
  for(let y=my-18;y<=my+18;y++)for(let x=mx-18;x<=mx+18;x++){if(!G.inn(x,y))continue;const rr=Math.hypot(x-mx,y-my);if(rr>R)continue;const i=G.I(x,y);
    if(rr>15.6){if(gap(x,y,rr,a0))G.set(x,y,T_PATH);else{G.set(x,y,T_WALL);G.protect[i]=1;}}
    else if(rr>=12&&rr<=13.2){if(gap(x,y,rr,a0+Math.PI))G.set(x,y,T_PATH);else{G.set(x,y,T_WALL);G.protect[i]=1;}}
    else if(rr>=8.4&&rr<=9.6){if(gap(x,y,rr,a0))G.set(x,y,T_PATH);else{G.lavaAt(x,y);G.protect[i]=1;}}
    else if(rr>=4.8&&rr<=6){if(gap(x,y,rr,a0+Math.PI))G.bridgeAt(x,y),G.lava[i]=1;else{G.lavaAt(x,y);G.protect[i]=1;}}
    else if(rr<4.8)G.set(x,y,T_FLOOR);else G.set(x,y,T_PATH);}
  for(let k=0;k<8;k++){const a=a0+Math.PI/2+k/8*Math.PI*2,rr=k%2?10.8:14.4;G.blocks.push([Math.round(mx+Math.cos(a)*rr),Math.round(my+Math.sin(a)*rr)]);}
  // foot of the mountain: the gate opens onto solid ground
  for(let k=0;k<4;k++){const x=Math.round(mx+Math.cos(a0)*(R+0.5+k)),y=Math.round(my+Math.sin(a0)*(R+0.5+k));G.disc(x,y,1.3,1.3,(xx,yy)=>G.cross(xx,yy,T_PATH));}
  G.setArena(mx,my,11,11,'crater');
  G.disc(S[0],S[1],3,3,(x,y)=>G.set(x,y,T_FLOOR));G.start={x:S[0],y:S[1]};
  seeds.forEach((s,k)=>{if(k)G.room(s[0]-3,s[1]-3,6,6);if(k&&r()<0.4)G.poi(s[0],s[1],'treasure');});
};

// VII. Snow: stacked terraces separated by rock cliffs, switchback ramps, pine forests, frozen lakes, cliff caves.
_MG_LAY.snow=G=>{
  const{w,h,r}=G;G.blockDens=0.01;G.decoDens=0.025;G.arenaIce=true;
  const K=5,sep=5,bh=Math.floor((h-4-(K-1)*sep)/K);const bands=[];let y1=h-3;
  for(let k=0;k<K;k++){const y0=k===K-1?2:y1-bh+1;bands.push({y0,y1});y1=y0-sep-1;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(!bands.some(b=>y>=b.y0-1&&y<=b.y1+1)){G.rockAt(x,y);G.protect[G.I(x,y)]=1;}}
  const rampX=[];for(let k=0;k<K-1;k++)rampX.push(k%2===0?w-9:8);
  bands.forEach((b,k)=>{
    for(let y=b.y0;y<=b.y1;y++)for(let x=2;x<w-2;x++){const edge=(y===b.y0||y===b.y1)&&G.vn(x,y,3,40+k)>0.55;
      const end=x<2+G.vn(x,y,3,50+k)*3||x>w-3-G.vn(x,y,3,60+k)*3;if(!edge&&!end)G.set(x,y,T_FLOOR);}
    for(let y=b.y0;y<=b.y1;y++)for(let x=2;x<w-2;x++)if(G.fbm(x,y,6,3+k)>0.63)G.set(x,y,T_WALL);
    const my=(b.y0+b.y1)>>1,ex=k===0?6:rampX[k-1],xx=k<K-1?rampX[k]:(rampX[K-2]>w/2?16:w-17);
    const path=G.meander([ex,k===0?my:b.y1],[xx,k<K-1?b.y0:my],2.2,6);
    for(const[x,y]of path){G.disc(x,y,1.4,1.4,(a,c)=>{if(G.get(a,c)===T_WALL&&!G.protect[G.I(a,c)])G.set(a,c,T_FLOOR);});}
    for(const[x,y]of path)if(!G.protect[G.I(x,y)])G.set(x,y,T_PATH);
    for(let n=0;n<3+(w/40|0);n++)G.grassBlob(ri(4,w-5,r),ri(b.y0+1,b.y1-1,r),2.5+r()*4,1.5+r()*1.5,0.9);
    if(k===1||k===3){const lx=ri(Math.round(w*0.3),Math.round(w*0.7),r);G.disc(lx,my,9+r()*4,(b.y1-b.y0)/2,(x,y)=>G.iceAt(x,y),0.5);
      for(let n=0;n<3;n++)G.blocks.push([lx+ri(-6,6,r),my+ri(-1,1,r)]);G.room(lx-10,b.y0,20,b.y1-b.y0);}
    // caves in the cliff above
    if(k<K-1)for(let n=0,a=0;n<2&&a<30;a++){const cx=ri(8,w-9,r);if(Math.abs(cx-rampX[k])<10)continue;
      for(let y=b.y0-2;y<=b.y0+1;y++){G.set(cx,y,T_FLOOR);G.protect[G.I(cx,y)]=0;}
      G.rect(cx-2,b.y0-3,5,2,(x,y)=>{G.set(x,y,T_FLOOR);G.protect[G.I(x,y)]=0;});G.poi(cx,b.y0-3,'treasure');n++;}
    G.room(2,b.y0,w-4,b.y1-b.y0+1);});
  // switchback ramps through the cliffs
  for(let k=0;k<K-1;k++){const rx=rampX[k],yb=bands[k].y0,yt=bands[k+1].y1,s=rx>w/2?-1:1;
    const cells=G.trace([[rx,yb+1],[rx+3*s,yb-2],[rx,yb-4],[rx+3*s,yt],[rx+2*s,yt-1]]);
    G.fat(cells,(x,y)=>{if(!G.inn(x,y))return;G.set(x,y,T_PATH);G.protect[G.I(x,y)]=0;});}
  const b0=bands[0],sy=(b0.y0+b0.y1)>>1;G.disc(6,sy,2.5,2,(x,y)=>G.set(x,y,T_FLOOR));G.start={x:6,y:sy};
  // frozen throne on the summit terrace
  const tb=bands[K-1],ax=rampX[K-2]>w/2?16:w-17,ah=tb.y1-tb.y0+1;
  G.rect(ax-12,tb.y0,25,ah,(x,y)=>G.iceAt(x,y));
  const by=tb.y0+3;G.setArena(ax,by,25,ah,'frozenthrone');G.arena.y=tb.y0;G.arena.h=ah;
  for(let y=by+3;y<=tb.y1-1;y+=2)for(const dx of[-5,5])G.blocks.push([ax+dx,y]);
  for(const dx of[-9,9])G.blocks.push([ax+dx,tb.y0+1],[ax+dx,tb.y1-1]);
  G.rect(ax,by+2,1,tb.y1-by-1,(x,y)=>{G.set(x,y,T_PATH);G.ice[G.I(x,y)]=1;});
};

// VIII. Mire: murky water with many noise islands, boardwalks (bridged by connectivity), ruins, ruined chapel altar.
_MG_LAY.mire=G=>{
  const{w,h,r}=G;G.border='water';G.minKeep=7;G.tunnel=T_FLOOR;G.blockDens=0.008;G.decoDens=0.04;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const v=G.fbm(x,y,7,1)*0.75+G.vn(x,y,2.5,2)*0.25;if(v>0.55)G.set(x,y,T_FLOOR);else G.wet(x,y);}
  const S=[8,ri(Math.round(h*0.3),Math.round(h*0.7),r)],ax=w-15,ay=ri(18,h-19,r);
  G.disc(S[0],S[1],5.5,4.5,(x,y)=>G.set(x,y,T_FLOOR),0.4);G.disc(ax-2,ay,14,12,(x,y)=>G.set(x,y,T_FLOOR),0.6);
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=G.I(x,y);if(G.T[i]!==T_FLOOR)continue;
    if(G.fbm(x,y,5,4)>0.67&&Math.hypot(x-S[0],y-S[1])>6)G.set(x,y,T_WALL);else if(G.fbm(x,y,4,6)>0.5)G.T[i]=T_GRASS;}
  // small ruined shrines with treasure
  for(let a=0,n=0;a<300&&n<2;a++){const x=ri(16,w-34,r),y=ri(7,h-8,r);if(G.pois.some(p=>Math.hypot(p.x-x,p.y-y)<20))continue;
    G.disc(x,y,4.5,4,(xx,yy)=>G.set(xx,yy,T_FLOOR),0.5);
    for(let k=-2;k<=2;k++)for(const[xx,yy]of[[x+k,y-2],[x+k,y+2],[x-2,y+k],[x+2,y+k]])if(r()<0.75&&!(xx===x||yy===y))G.ruinAt(xx,yy);
    G.poi(x,y,'treasure');G.room(x-2,y-2,5,5);n++;}
  // extra boardwalk loops (straight rays across water)
  for(let a=0,n=0;a<400&&n<10;a++){const x=ri(4,w-5,r),y=ri(4,h-5,r);if(G.T[G.I(x,y)]===T_WALL)continue;const[dx,dy]=pick(_MG_D4,r);
    let k=1;while(k<12&&G.inn(x+dx*k,y+dy*k)&&G.water[G.I(x+dx*k,y+dy*k)])k++;
    if(k<4||k>=12||!G.inn(x+dx*k,y+dy*k)||!passable(G.get(x+dx*k,y+dy*k)))continue;
    for(let j=1;j<k;j++)G.bridgeAt(x+dx*j,y+dy*j);n++;}
  G.start={x:S[0],y:S[1]};G.disc(S[0],S[1],2,2,(x,y)=>G.set(x,y,T_FLOOR));G.room(S[0]-5,S[1]-4,10,8);
  // ruined chapel: entrance west, pews, altar east
  const cw=21,chh=13,x0=ax-cw+5,y0=ay-6;
  G.rect(x0-2,y0-2,cw+4,chh+4,(x,y)=>G.set(x,y,T_FLOOR));
  G.rect(x0,y0,cw,chh,(x,y)=>{const edge=x===x0||y===y0||x===x0+cw-1||y===y0+chh-1;if(edge){G.ruinAt(x,y);G.protect[G.I(x,y)]=1;}});
  for(let y=ay-1;y<=ay+1;y++){G.set(x0,y,T_PATH);G.protect[G.I(x0,y)]=0;}
  for(let k=0;k<4;k++){const x=x0+ri(2,cw-9,r),y=r()<0.5?y0:y0+chh-1;G.set(x,y,T_DECO);G.protect[G.I(x,y)]=0;}
  G.rect(x0+1,ay,cw-6,1,(x,y)=>G.set(x,y,T_PATH));
  for(let x=x0+3;x<x0+cw-8;x+=3)for(const y of[ay-3,ay-2,ay+2,ay+3]){G.blocks.push([x,y]);G.blocks.push([x+1,y]);}
  for(const[x,y]of[[x0+1,y0+1],[x0+1,y0+chh-2],[x0+cw-2,y0+1],[x0+cw-2,y0+chh-2]])G.set(x,y,T_DECO);
  G.setArena(ax,ay,cw,chh,'altar');G.arena.x=x0;G.arena.y=y0;
};

// IX. Sky: floating platforms along a two-turn spiral, thin cloud bridges, treasure islets, storm peak at the centre.
_MG_LAY.sky=G=>{
  const{w,h,r}=G;G.medium=true;G.tunnel=T_PATH;G.minKeep=6;G.blockDens=0.01;G.decoDens=0.03;
  const cx=w/2,cy=h/2,sx=(w/2-7),sy=(h/2-6),turns=2.05,tmax=Math.PI*2*turns,re=0.37,th0=r()*Math.PI*2;
  const P=t=>{const rr=1-(1-re)*t/tmax;return[cx+Math.cos(t+th0)*rr*sx,cy+Math.sin(t+th0)*rr*sy,rr];};
  const plats=[];let last=P(0),acc=99;
  for(let t=0;t<tmax*0.97;t+=0.01){const p=P(t);acc+=Math.hypot(p[0]-last[0],p[1]-last[1]);last=p;
    if(acc>=12.5){acc=0;const s=(2.6+r()*1.8)*(0.65+0.35*p[2]);plats.push({x:Math.round(p[0]),y:Math.round(p[1]),rx:s*1.15,ry:s*0.85});}}
  plats[0].rx=6;plats[0].ry=4.5;
  const land=c=>G.disc(c.x,c.y,c.rx,c.ry,(x,y)=>G.set(x,y,T_FLOOR),0.6);
  const cloud=(a,b)=>G.trace(Math.abs(a.x-b.x)>Math.abs(a.y-b.y)?[[a.x,a.y],[(a.x+b.x)>>1,a.y],[(a.x+b.x)>>1,b.y],[b.x,b.y]]:[[a.x,a.y],[a.x,(a.y+b.y)>>1],[b.x,(a.y+b.y)>>1],[b.x,b.y]]).forEach(([x,y])=>{if(G.T[G.I(x,y)]===T_WALL)G.bridgeAt(x,y);});
  plats.forEach((c,k)=>{land(c);if(k&&r()<0.55)G.grassBlob(c.x,c.y,c.rx*0.7,c.ry*0.7);G.room(c.x-c.rx,c.y-c.ry,c.rx*2,c.ry*2);
    if(k&&c.rx>4&&r()<0.5)G.blocks.push([c.x+ri(-2,2,r),c.y+ri(-1,1,r)]);});
  for(let k=0;k+1<plats.length;k++)cloud(plats[k],plats[k+1]);
  // arena: storm peak at the centre
  const A={x:Math.round(cx),y:Math.round(cy),rx:8.5,ry:6.5};land(A);cloud(plats[plats.length-1],A);
  // side islets with treasure (only where they don't touch another ring)
  const all=plats.concat([A]);
  for(let k=2,made=0;k<plats.length-1&&made<7;k+=2){const c=plats[k];
    for(let a=0;a<10;a++){const an=r()*Math.PI*2,d=Math.max(c.rx,c.ry)+4+r()*2,x=Math.round(c.x+Math.cos(an)*d*1.2),y=Math.round(c.y+Math.sin(an)*d*0.9);
      if(x<4||y<4||x>w-5||y>h-5)continue;const it={x,y,rx:2+r()*0.8,ry:1.6+r()*0.6};
      if(all.some(o=>o!==c&&Math.hypot((o.x-x)/1.2,o.y-y)<Math.max(o.rx,o.ry)+5))continue;
      land(it);cloud(c,it);all.push(it);G.poi(x,y,'treasure');made++;break;}}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=G.I(x,y);if(G.T[i]===T_FLOOR&&G.fbm(x,y,4,9)>0.66&&r()<0.4)G.T[i]=T_DECO;}
  G.start={x:plats[0].x,y:plats[0].y};
  G.setArena(A.x,A.y,19,15,'stormpeak');
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2+Math.PI/8;G.blocks.push([Math.round(A.x+Math.cos(a)*5.6),Math.round(A.y+Math.sin(a)*4.2)]);}
};

// X. Citadel: mirrored castle — bands of halls around carpeted corridors, gatehouses alternating sides,
// courtyards with fountains, throne hall with pillars and a long carpet at the far (north) end.
_MG_LAY.citadel=G=>{
  const{w,h,r}=G;G.blockDens=0.004;G.decoDens=0.015;
  const hw=w>>1,cxL=hw-2,TH=22,yT0=3,yT1=yT0+TH-1;
  const nb=3,avail=(h-4)-(yT1+3)+1,bh=Math.floor((avail-(nb-1)*3)/nb);
  const bands=[];let yb=h-4;for(let k=0;k<nb;k++){bands.push({y0:yb-bh+1,y1:yb});yb=yb-bh-3;}
  const F=(x,y,v)=>G.set(x,y,v==null?T_FLOOR:v),Wl=(x,y)=>G.ruinAt(x,y);
  const gateX=[8,cxL,8];// boundary k (band k -> k+1 / throne): side, centre, side
  // ---- bands (left half only, mirrored at the end)
  bands.forEach((b,k)=>{
    const c0=b.y0+Math.floor((bh-4)/2),c1=c0+3; // corridor rows
    G.rect(3,b.y0,hw-3,bh,(x,y)=>F(x,y));
    for(let x=3;x<hw;x++){Wl(x,c0-1);Wl(x,c1+1);}
    // rooms above/below the corridor
    for(const[ry0,ry1]of[[b.y0,c0-2],[c1+2,b.y1]]){let x=3;
      while(x<hw-4){const rw=Math.min(ri(7,12,r),hw-x);const x1=x+rw;if(x1<hw)for(let y=ry0;y<=ry1;y++)Wl(x1,y);
        const dx=ri(x+1,Math.min(x1-2,hw-1),r),dy=ry0===b.y0?c0-1:c1+1;F(dx,dy);F(dx+1,dy);
        const court=r()<0.28&&rw>=8&&ry1-ry0>=4;const mx=(x+x1)>>1,my=(ry0+ry1)>>1;
        if(court){G.grassBlob(mx+0.5,my,rw/2,(ry1-ry0)/2+0.5,0.9);G.rect(mx,my,2,1,(a,c)=>G.wet(a,c));G.poi(mx,my-1,'lore');}
        else{if(r()<0.55)G.poi(mx,my,'treasure');if(r()<0.5)for(let y=ry0+1;y<ry1;y+=2)G.blocks.push([x+1,y]);}
        if(x1<hw&&r()<0.5){F(x1,ri(ry0,ry1,r));}
        G.room(x,ry0,rw,ry1-ry0+1);x=x1+1;}}
    for(let x=4;x<hw;x+=4){G.set(x,c0,T_DECO);G.set(x,c1,T_DECO);}
  });
  // ---- throne band: antechamber corridor + throne hall + side treasuries
  const ac0=yT1-3;G.rect(3,ac0,hw-3,4,(x,y)=>F(x,y));
  const tx0=hw-16;G.rect(3,yT0,tx0-3,ac0-yT0-1,(x,y)=>F(x,y));for(let x=3;x<tx0;x++)Wl(x,ac0-1);
  for(let y=yT0;y<ac0;y++)Wl(tx0,y);for(let x=3;x<tx0;x+=9)if(x>3)for(let y=yT0;y<ac0-1;y++)Wl(x,y);
  for(let x=5;x<tx0;x+=9){F(x+1,ac0-1);F(x+2,ac0-1);G.poi(x+3,yT0+4,'treasure');G.room(x-1,yT0,9,ac0-yT0-1);}
  G.rect(tx0+1,yT0,hw-tx0-1,ac0-yT0-1,(x,y)=>F(x,y));for(let x=tx0;x<hw;x++)Wl(x,ac0-1);
  for(let x=cxL;x<hw;x++)F(x,ac0-1,T_PATH);
  for(let y=yT0+5;y<ac0-2;y+=3)G.blocks.push([hw-6,y],[hw-11,y]);
  for(let y=yT0+4;y<ac0-1;y++)for(let x=hw-2;x<hw;x++)F(x,y,T_PATH);
  for(let y=yT0;y<ac0-1;y++)G.set(tx0+1,y,T_DECO);
  // ---- gatehouses (3 thick walls between bands), passages through rooms
  const corr=b=>{const c0=b.y0+Math.floor((bh-4)/2);return[c0,c0+3];};
  const passage=(gx,ya,yb2)=>{for(let y=Math.min(ya,yb2);y<=Math.max(ya,yb2);y++){for(let x=gx-1;x<=gx+2;x++)if(x<hw)F(x,y,T_PATH);
      if(gx-2>=3)Wl(gx-2,y);if(gx+3<hw)Wl(gx+3,y);}};
  for(let k=0;k<nb;k++){const[c0]=corr(bands[k]);const top=k+1<nb?corr(bands[k+1])[1]:yT1;passage(gateX[k],c0,top);
    const wy=bands[k].y0-2;G.blocks.push([gateX[k]-1,wy+1],[gateX[k]+2,wy+1]);}
  // carpet along each corridor between the gates
  for(let k=0;k<nb;k++){const[c0,c1]=corr(bands[k]);const xa=k===0?cxL:gateX[k-1],xb=gateX[k];
    for(let x=Math.min(xa,xb);x<hw;x++)if(x<=Math.max(xa,xb)+1||x>=cxL)for(let y=c0+1;y<=c1-1;y++)F(x,y,T_PATH);}
  for(let x=Math.min(8,cxL);x<hw;x++)for(let y=ac0+1;y<=ac0+2;y++)F(x,y,T_PATH);
  // south gate & entry courtyard
  const[s0]=corr(bands[0]),sy=h-6;
  G.rect(cxL-6,corr(bands[0])[1]+2,hw-cxL+6,h-4-corr(bands[0])[1]-2,(x,y)=>F(x,y));
  for(let y=corr(bands[0])[1]+1;y<h-3;y++)Wl(cxL-7,y);
  G.grassBlob(cxL-4,sy-1,3,1.5,0.8);
  for(let y=corr(bands[0])[1]+1;y<h-3;y++)for(let x=hw-1;x<hw;x++)F(x,y,T_PATH);
  // ---- mirror left half onto right half
  for(let y=0;y<h;y++)for(let x=hw;x<w;x++){const s=G.I(w-1-x,y),d=G.I(x,y);G.T[d]=G.T[s];for(const m of _MG_MASKS)G[m][d]=G[m][s];G.protect[d]=G.protect[s];}
  for(const p of G.pois.slice())G.poi(w-1-p.x,p.y,p.t);
  for(const b of G.blocks.slice())G.blocks.push([w-1-b[0],b[1]]);
  for(const o of G.rooms.slice())G.room(w-o.x-o.w,o.y,o.w,o.h);
  G.start={x:hw,y:sy};G.shopSpot=[hw+3,sy-2];G.hintSpot=[hw-3,sy-1];
  G.setArena(hw-1,yT0+2,32,ac0-yT0-1,'throne');G.arena.x=tx0;G.arena.y=yT0;
  for(let y=yT0;y<ac0-1;y++)for(const x of[tx0,w-1-tx0])G.protect[G.I(x,y)]=1;
};

// =============================== FINISHER ===============================
function _mgFinish(G){
  const{w,h,T,I,r,N}=G;
  const sx=G.start.x,sy=G.start.y,bx=G.boss.x,by=G.boss.y;
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){G.set(bx+dx,by+dy,T_FLOOR);if(G.arenaIce)G.ice[I(bx+dx,by+dy)]=1;G.protect[I(bx+dx,by+dy)]=0;}
  if(!passable(T[I(sx,sy)])||T[I(sx,sy)]===T_PORTAL)G.set(sx,sy,T_FLOOR);
  for(let x=0;x<w;x++)for(const y of[0,h-1]){const i=I(x,y);G.clr(i);T[i]=T_WALL;if(G.border==='water')G.water[i]=1;}
  for(let y=0;y<h;y++)for(const x of[0,w-1]){const i=I(x,y);G.clr(i);T[i]=T_WALL;if(G.border==='water')G.water[i]=1;}
  _mgConnect(G);
  for(let i=0;i<N;i++){if(T[i]!==T_WALL){G.water[i]&=G.bridge[i];G.lava[i]&=G.bridge[i];G.ruin[i]=0;G.rock[i]=0;}if(T[i]!==T_PATH)G.bridge[i]=0;}
  // calm zones: no tall grass at the start, near the boss or inside the arena
  for(let i=0;i<N;i++)if(T[i]===T_GRASS&&G.inArena(i%w,(i/w)|0))T[i]=T_FLOOR;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=I(x,y);if(T[i]!==T_GRASS)continue;
    if(Math.max(Math.abs(x-sx),Math.abs(y-sy))<=2||Math.max(Math.abs(x-bx),Math.abs(y-by))<=2)T[i]=T_FLOOR;}
  const blk=new Uint8Array(N),inter=new Uint8Array(N);blk[I(bx,by)]=1;
  const open=i=>passable(T[i])&&!blk[i];
  const canBlock=(x,y)=>{
    if(x<2||y<2||x>w-3||y>h-3)return false;const i=I(x,y),t0=T[i];
    if(!(t0===T_FLOOR||t0===T_PATH||t0===T_GRASS||t0===T_DECO)||blk[i]||G.bridge[i])return false;
    if(Math.max(Math.abs(x-sx),Math.abs(y-sy))<=1||Math.max(Math.abs(x-bx),Math.abs(y-by))<=2)return false;
    const o=_MG_RING.map(([dx,dy])=>open(I(x+dx,y+dy)));
    if(!(o[0]||o[2]||o[4]||o[6]))return false;
    let first=-1;for(let k=0;k<8;k++)if(!o[k]){first=k;break;}
    if(first>=0){const run=[];let id=0,cur=-1;for(let s=1;s<=8;s++){const k=(first+s)%8;if(o[k]){if(cur<0)cur=++id;run[k]=cur;}else cur=-1;}
      let seen=-1;for(const k of[0,2,4,6])if(o[k]){if(seen<0)seen=run[k];else if(run[k]!==seen)return false;}}
    for(const[dx,dy]of _MG_D4){const j=I(x+dx,y+dy);if(!inter[j])continue;let c=0;
      for(const[ex,ey]of _MG_D4){const k=I(x+dx+ex,y+dy+ey);if(k!==i&&open(k))c++;}if(!c)return false;}
    return true;};
  // structural blockers from the layout (stone circles, pillars, palms, pews...)
  for(const[x,y]of G.blocks)if(G.inn(x,y)&&canBlock(x,y))T[I(x,y)]=T_BLOCK;
  // distances & main route (start -> boss)
  const dist=new Int32Array(N).fill(-1),par=new Int32Array(N).fill(-1),q=new Int32Array(N);let qh=0,qt=0;
  dist[I(sx,sy)]=0;q[qt++]=I(sx,sy);
  while(qh<qt){const c=q[qh++],cx=c%w,cy=(c/w)|0;for(const[dx,dy]of _MG_D4){const n=I(cx+dx,cy+dy);
    if(dist[n]>=0||!open(n))continue;dist[n]=dist[c]+1;par[n]=c;q[qt++]=n;}}
  let bn=-1;for(const[dx,dy]of _MG_D4){const n=I(bx+dx,by+dy);if(dist[n]>=0&&(bn<0||dist[n]<dist[bn]))bn=n;}
  const route=[];for(let c=bn;c>=0;c=par[c])route.push(c);route.reverse();
  const onRoute=new Uint8Array(N);route.forEach(c=>onRoute[c]=1);
  const bossD=bn>=0?dist[bn]:1;G.bossDist=bossD;
  const RP=f=>{const c=route[clamp(Math.floor(f*(route.length-1)),0,route.length-1)];return[c%w,(c/w)|0];};
  const cheb=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
  const nearest=(px,py,maxR,filt)=>{px=Math.round(px);py=Math.round(py);for(let rad=0;rad<=maxR;rad++){const c=[];
      for(let y=py-rad;y<=py+rad;y++)for(let x=px-rad;x<=px+rad;x++){if(Math.max(Math.abs(x-px),Math.abs(y-py))!==rad)continue;
        if(!G.inn(x,y)||dist[I(x,y)]<0||!canBlock(x,y)||(filt&&!filt(x,y)))continue;c.push([x,y]);}
      if(c.length)return c[Math.floor(r()*c.length)];}return null;};
  const anyCell=filt=>{const c=[];for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++)if(dist[I(x,y)]>=0&&(!filt||filt(x,y))&&canBlock(x,y))c.push([x,y]);
    return c.length?c[Math.floor(r()*c.length)]:null;};
  const adjRoute=(x,y)=>!onRoute[I(x,y)]&&_MG_D4.some(([dx,dy])=>onRoute[I(x+dx,y+dy)]);
  const shrines=[],chests=[],npcs=[];
  const faceDir=(x,y)=>{let bd='down',bv=1e9;for(const k of['down','left','right','up']){const[dx,dy]=DIRS[k];const n=I(x+dx,y+dy);
    if(open(n)&&dist[n]>=0&&dist[n]<bv){bv=dist[n];bd=k;}}return bd;};
  const shrine=s=>{if(!s)return;const i=I(s[0],s[1]);T[i]=T_SHRINE;inter[i]=1;shrines.push({x:s[0],y:s[1]});};
  const npc=(s,kind,idx,dir)=>{if(!s)return;const i=I(s[0],s[1]);blk[i]=1;inter[i]=1;npcs.push({x:s[0],y:s[1],kind,idx,pal:ri(1,8,r),dir:dir||faceDir(s[0],s[1])});};
  const chest=s=>{if(!s)return false;const i=I(s[0],s[1]);T[i]=T_CHEST;inter[i]=1;chests.push({x:s[0],y:s[1],loot:_mgLoot(G.li,r)});return true;};
  const farNpc=(x,y)=>npcs.every(n=>cheb(n,{x,y})>=4);
  // shrines: start, mid-route, before the arena
  shrine(nearest(sx+ri(-2,2,r),sy-3,6,(x,y)=>cheb({x,y},G.start)>=2));
  shrine(nearest(...RP(0.5),5,(x,y)=>!onRoute[I(x,y)])||nearest(...RP(0.5),6));
  let ai=route.length-1;while(ai>0&&G.inArena(route[ai]%w,(route[ai]/w)|0,1))ai--;
  const pb=route[Math.max(0,ai-4)];shrine(nearest(pb%w,(pb/w)|0,5,(x,y)=>!onRoute[I(x,y)]&&!G.inArena(x,y))||nearest(pb%w,(pb/w)|0,7));
  // npcs
  const hs=G.hintSpot||[sx+2,sy+1];npc(nearest(hs[0],hs[1],6,(x,y)=>cheb({x,y},G.start)>=2)||anyCell(farNpc),'hint',0);
  const ss=G.shopSpot||RP(Math.min(0.12,20/Math.max(1,route.length)));npc(nearest(ss[0],ss[1],7,farNpc)||anyCell(farNpc),'shop',0,'down');
  for(const[f,k]of[[0.32,0],[0.68,1]]){const p=RP(f);npc(nearest(p[0],p[1],5,(x,y)=>adjRoute(x,y)&&farNpc(x,y))||nearest(p[0],p[1],8,farNpc)||anyCell(),'trainer',k);}
  const lp=G.pois.filter(p=>p.t==='lore');
  for(let k=0;k<3;k++){const f=0.18+k*0.3;let s=null;
    const cand=lp.filter(p=>{const d=dist[I(p.x,p.y)];return d>=0&&Math.abs(d-f*bossD)<bossD*0.2;});
    if(cand.length){const p=pick(cand,r);s=nearest(p.x,p.y,3,farNpc);}
    if(!s)s=anyCell((x,y)=>!onRoute[I(x,y)]&&Math.abs(dist[I(x,y)]-f*bossD)<bossD*0.1&&farNpc(x,y)&&!G.inArena(x,y));
    if(!s)s=anyCell(farNpc);npc(s,'lore',k,s?pick(['down','left','right','up'],r):null);}
  // chests: layout treasure spots, then dead ends, then far-off-route cells
  const nC=4+Math.floor(G.li/2)+2,farC=(x,y,m)=>chests.every(c=>cheb(c,{x,y})>=m)&&!G.inArena(x,y)&&cheb({x,y},G.start)>3;
  const tp=G.pois.filter(p=>p.t==='treasure');for(let i=tp.length-1;i>0;i--){const j=ri(0,i,r);[tp[i],tp[j]]=[tp[j],tp[i]];}
  for(const p of tp){if(chests.length>=nC)break;chest(nearest(p.x,p.y,2,(x,y)=>farC(x,y,5)));}
  if(chests.length<nC){const de=[];for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const i=I(x,y);if(!open(i)||onRoute[i]||dist[i]<8)continue;
      let c=0;for(const[dx,dy]of _MG_D4)if(open(I(x+dx,y+dy)))c++;if(c===1)de.push([x,y]);}
    for(let i=de.length-1;i>0;i--){const j=ri(0,i,r);[de[i],de[j]]=[de[j],de[i]];}
    for(const[x,y]of de){if(chests.length>=nC)break;if(farC(x,y,8)&&canBlock(x,y))chest([x,y]);}}
  for(let a=0;a<40&&chests.length<nC;a++){const s=anyCell((x,y)=>!onRoute[I(x,y)]&&farC(x,y,a<20?10:4)&&dist[I(x,y)]>10);if(!s)break;chest(s);}
  // scatter obstacles and decoration
  for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){const i=I(x,y);if(T[i]===T_FLOOR&&!onRoute[i]&&r()<G.blockDens&&canBlock(x,y))T[i]=T_BLOCK;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=I(x,y);
    if(T[i]===T_FLOOR&&!blk[i]&&!G.ice[i]&&r()<G.decoDens&&Math.max(Math.abs(x-sx),Math.abs(y-sy))>0&&Math.max(Math.abs(x-bx),Math.abs(y-by))>1)T[i]=T_DECO;}
  return{shrines,chests,npcs};
}

// =============================== ENTRY ===============================
function genLevel(li){
  const seed=1000+li*7919;const r=RNG(seed);
  const lv=(typeof LEVELS!=='undefined'&&LEVELS[li])||{size:[70,50],theme:'meadow'};
  const w=Math.min(128,lv.size[0]),h=Math.min(96,lv.size[1]),theme=lv.theme;
  const G=_mgCtx(li,w,h,theme,r,seed);
  const order=['meadow','forest','cave','coast','desert','volcano','snow','mire','sky','citadel'];
  (_MG_LAY[theme]||_MG_LAY[order[li%10]])(G);
  if(!G.arena)G.setArena(G.boss.x,G.boss.y,9,9,'stonecircle');
  const pl=_mgFinish(G);
  const map={w,h,tiles:G.T,rooms:G.rooms,start:{x:G.start.x,y:G.start.y},boss:{x:G.boss.x,y:G.boss.y},
    shrines:pl.shrines,chests:pl.chests,npcs:pl.npcs,seed,li,theme,arena:G.arena,bossDist:G.bossDist};
  for(const k of _MG_MASKS)map[k]=G[k];
  map.rooms.unshift({x:G.arena.x,y:G.arena.y,w:G.arena.w,h:G.arena.h,cx:G.boss.x,cy:G.boss.y,arena:true});
  return map;
}
