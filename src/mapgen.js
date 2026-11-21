// ===================== MAPGEN =====================
const MG_OUTDOOR={meadow:1,forest:1,coast:1,desert:1,snow:1,sky:1};

function tileAt(map,x,y){if(x<0||y<0||x>=map.w||y>=map.h)return T_WALL;return map.tiles[y*map.w+x];}
function setTile(map,x,y,v){if(x<0||y<0||x>=map.w||y>=map.h)return;map.tiles[y*map.w+x]=v;}

function _mgBFS(tiles,w,h,sx,sy,blk){
  const d=new Int32Array(w*h).fill(-1);const q=new Int32Array(w*h);let qh=0,qt=0;
  d[sy*w+sx]=0;q[qt++]=sy*w+sx;
  while(qh<qt){const c=q[qh++],cx=c%w,cy=(c/w)|0;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;
      const n=ny*w+nx;if(d[n]>=0||!passable(tiles[n])||(blk&&blk[n]))continue;d[n]=d[c]+1;q[qt++]=n;}}
  return d;
}

function _mgLoot(li,r){
  if(r()<0.38)return{gold:ri(20,60,r)*(li+1)};
  const pool=[['potion',0],['orb',0],['cure',0],['super',2],['ether',1],['gorb',3],['revive',4],['max',6],['uorb',7]];
  let ids=pool.filter(p=>li>=p[1]).map(p=>p[0]);
  if(typeof ITEMS!=='undefined'&&ITEMS){const f=ids.filter(id=>ITEMS[id]);if(f.length)ids=f;}
  // later levels: prefer stronger items
  const id=(li>=3&&r()<0.5)?ids[ids.length-1-ri(0,Math.min(2,ids.length-1),r)]:pick(ids,r);
  const n=/orb/.test(id)?ri(2,3,r):(id==='potion'||id==='super'?ri(1,3,r):1);
  return{item:id,n};
}

function genLevel(li){
  const seed=1000+li*7919;const r=RNG(seed);
  const lv=(typeof LEVELS!=='undefined'&&LEVELS[li])||{size:[40,30],theme:'meadow'};
  const w=lv.size[0],h=lv.size[1];const theme=lv.theme;const outdoor=!!MG_OUTDOOR[theme];
  const tiles=new Uint8Array(w*h).fill(T_WALL);
  const I=(x,y)=>y*w+x;
  const inner=(x,y)=>x>=1&&y>=1&&x<w-1&&y<h-1;
  const map={w,h,tiles,rooms:[],start:{x:0,y:0},boss:{x:0,y:0},shrines:[],chests:[],npcs:[],seed,li,theme};

  // ---- rooms
  const want=7+li;const rooms=[];
  for(let a=0;a<1500&&rooms.length<want;a++){
    const rw=ri(5,10,r),rh=ri(4,8,r);if(rw+4>w||rh+4>h)continue;
    const x=ri(2,w-rw-2,r),y=ri(2,h-rh-2,r);
    let ok=true;for(const o of rooms){if(x<o.x+o.w+2&&x+rw+2>o.x&&y<o.y+o.h+2&&y+rh+2>o.y){ok=false;break;}}
    if(ok)rooms.push({x,y,w:rw,h:rh,cx:x+(rw>>1),cy:y+(rh>>1)});
  }
  rooms.sort((a,b)=>(a.cx+a.cy*0.25)-(b.cx+b.cy*0.25));
  map.rooms=rooms;
  for(const o of rooms)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++)tiles[I(x,y)]=T_FLOOR;

  // ---- corridors
  const ct=outdoor?T_PATH:T_FLOOR;
  const carve=(x,y)=>{if(inner(x,y)&&tiles[I(x,y)]===T_WALL)tiles[I(x,y)]=ct;};
  const corridor=(a,b)=>{
    const wd=outdoor?2:(r()<0.5?1:2);const hf=r()<0.5;
    const hseg=(x0,x1,y)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++){carve(x,y);if(wd>1)carve(x,y+1);}};
    const vseg=(y0,y1,x)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1)+(wd>1?1:0);y++){carve(x,y);if(wd>1)carve(x+1,y);}};
    if(hf){hseg(a.cx,b.cx,a.cy);vseg(a.cy,b.cy,b.cx);}else{vseg(a.cy,b.cy,a.cx);hseg(a.cx,b.cx,b.cy);}
  };
  for(let i=0;i+1<rooms.length;i++)corridor(rooms[i],rooms[i+1]);
  const loops=ri(2,3,r);
  for(let k=0,tries=0;k<loops&&tries<50&&rooms.length>3;tries++){
    const i=ri(0,rooms.length-1,r),j=ri(0,rooms.length-1,r);if(Math.abs(i-j)<2)continue;corridor(rooms[i],rooms[j]);k++;
  }

  // ---- organic erosion (outdoor)
  if(outdoor){const snap=tiles.slice();
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(snap[I(x,y)]!==T_WALL)continue;
      if((snap[I(x+1,y)]===T_FLOOR||snap[I(x-1,y)]===T_FLOOR||snap[I(x,y+1)]===T_FLOOR||snap[I(x,y-1)]===T_FLOOR)&&r()<0.25)tiles[I(x,y)]=T_FLOOR;}
  }
  for(let x=0;x<w;x++){tiles[I(x,0)]=T_WALL;tiles[I(x,h-1)]=T_WALL;}
  for(let y=0;y<h;y++){tiles[I(0,y)]=T_WALL;tiles[I(w-1,y)]=T_WALL;}

  // ---- start, distance, boss
  const r0=rooms[0];map.start={x:r0.cx,y:r0.cy};tiles[I(r0.cx,r0.cy)]=T_FLOOR;
  let dist=_mgBFS(tiles,w,h,r0.cx,r0.cy);
  for(let i=0;i<w*h;i++)if(dist[i]<0&&passable(tiles[i]))tiles[i]=T_WALL; // safety: no isolated pockets
  const rd=o=>dist[I(o.cx,o.cy)];
  let bossRoom=rooms[0];for(const o of rooms)if(rd(o)>rd(bossRoom))bossRoom=o;
  map.boss={x:bossRoom.cx,y:bossRoom.cy};
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(inner(bossRoom.cx+dx,bossRoom.cy+dy))tiles[I(bossRoom.cx+dx,bossRoom.cy+dy)]=T_FLOOR;
  dist=_mgBFS(tiles,w,h,r0.cx,r0.cy);
  const byDist=rooms.slice().sort((a,b)=>rd(a)-rd(b));
  const near=(x,y,p,rad)=>Math.abs(x-p.x)<=rad&&Math.abs(y-p.y)<=rad;
  const reservedG=(x,y)=>near(x,y,map.start,2)||near(x,y,map.boss,2);

  // ---- grass
  const grassProb=Math.min(0.85,0.55+li*0.03);
  const blob=(cx,cy,rx,ry,okT)=>{for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
    if(!inner(x,y)||reservedG(x,y))continue;const ex=(x-cx)/rx,ey=(y-cy)/ry;if(ex*ex+ey*ey>1+r()*0.3)continue;
    if(okT(tiles[I(x,y)]))tiles[I(x,y)]=T_GRASS;}};
  for(const o of rooms){if(o===r0||o===bossRoom||r()>grassProb)continue;
    const n=ri(1,2+Math.floor(li/3),r);
    for(let k=0;k<n;k++)blob(o.x+r()*o.w,o.y+r()*o.h,1.5+r()*2.5,1.2+r()*2,t0=>t0===T_FLOOR);}
  const cg=0.012+li*0.003;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    if(tiles[I(x,y)]!==ct)continue;if(rooms.some(o=>x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h))continue;
    if(r()<cg)blob(x,y,1+r()*1.5,1+r()*1.5,t0=>t0===T_FLOOR||t0===T_PATH);}

  // ---- blocker placement (never cuts paths: full passable 8-ring, ring stays passable)
  const blk=new Uint8Array(w*h); // npcs / blockers
  const isFree=(x,y)=>inner(x,y)&&passable(tiles[I(x,y)])&&!blk[I(x,y)];
  const canBlock=(x,y)=>{if(!inner(x,y))return false;const t0=tiles[I(x,y)];if((t0!==T_FLOOR&&t0!==T_PATH)||blk[I(x,y)])return false;
    if(near(x,y,map.start,1)||near(x,y,map.boss,2))return false;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;if(!isFree(x+dx,y+dy))return false;}
    return true;};
  const roomCells=o=>{const c=[];for(let y=o.y-1;y<=o.y+o.h;y++)for(let x=o.x-1;x<=o.x+o.w;x++)if(canBlock(x,y))c.push([x,y]);return c;};
  // pick spot in room, optionally nearest to (px,py) with jitter; fallback to any cell with similar distance
  const spotIn=(o,px,py,minD)=>{let c=roomCells(o);
    if(px!=null){c=c.filter(([x,y])=>Math.max(Math.abs(x-px),Math.abs(y-py))>=(minD||0));
      c.sort((a,b)=>(Math.hypot(a[0]-px,a[1]-py)+r()*1.5)-(Math.hypot(b[0]-px,b[1]-py)+r()*1.5));
      if(c.length)return c[0];}
    else if(c.length)return c[Math.floor(r()*c.length)];
    const tgt=rd(o);let best=null,bd=1e9;
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(!canBlock(x,y))continue;const s=Math.abs(dist[I(x,y)]-tgt)+r()*3;if(s<bd){bd=s;best=[x,y];}}
    return best;};
  const faceDir=(x,y)=>{let bd='down',bv=1e9;for(const k of['down','left','right','up']){const[dx,dy]=DIRS[k];const n=I(x+dx,y+dy);
    if(dist[n]>=0&&dist[n]<bv&&passable(tiles[n])){bv=dist[n];bd=k;}}return bd;};
  const shrine=s=>{if(!s)return;tiles[I(s[0],s[1])]=T_SHRINE;map.shrines.push({x:s[0],y:s[1]});};
  const npc=(s,kind,idx,dir)=>{if(!s)return;blk[I(s[0],s[1])]=1;map.npcs.push({x:s[0],y:s[1],kind,idx,pal:ri(1,8,r),dir:dir||faceDir(s[0],s[1])});};
  const rank=f=>byDist[clamp(Math.round(f*(byDist.length-1)),1,Math.max(1,byDist.length-2))]||byDist[0];

  shrine(spotIn(r0,r0.cx+ri(-2,2,r),r0.cy-2,2));
  npc(spotIn(r0,r0.cx+2,r0.cy+1,2),'hint',0);
  const shopRoom=byDist[1]||r0;npc(spotIn(shopRoom,shopRoom.cx,shopRoom.cy,0),'shop',0,'down');
  shrine(spotIn(rank(0.5),rank(0.5).cx,rank(0.5).cy,0));
  if(li>=4&&byDist.length>2){const pb=byDist[byDist.length-2];shrine(spotIn(pb,pb.cx,pb.cy,0));}
  npc(spotIn(rank(0.4),rank(0.4).cx,rank(0.4).cy,0),'trainer',0);
  npc(spotIn(rank(0.75),rank(0.75).cx,rank(0.75).cy,0),'trainer',1);
  const others=rooms.filter(o=>o!==r0&&o!==bossRoom);
  for(let k=0;k<3;k++){const o=others.length?pick(others,r):r0;const s=spotIn(o);npc(s,'lore',k,s?pick(['down','left','right','up'],r):null);}
  const nCh=3+Math.floor(li/2);const cr=rooms.filter(o=>o!==r0);
  for(let k=0;k<nCh;k++){const o=cr[(k*3+ri(0,cr.length-1,r))%cr.length]||r0;const s=spotIn(o);if(!s)continue;
    tiles[I(s[0],s[1])]=T_CHEST;map.chests.push({x:s[0],y:s[1],loot:_mgLoot(li,r)});}

  // ---- obstacles and decorations
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(tiles[I(x,y)]===T_FLOOR&&r()<0.03&&canBlock(x,y))tiles[I(x,y)]=T_BLOCK;}
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=I(x,y);
    if(tiles[i]===T_FLOOR&&!blk[i]&&!near(x,y,map.start,0)&&!near(x,y,map.boss,1)&&r()<0.07)tiles[i]=T_DECO;}
  return map;
}
