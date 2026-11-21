// ===================== WORLD (exploration, camera, interactions, story) =====================
addStrings({
  w_chapter:'KRAINA {0}', w_gold:'{0} zł', w_pause:'MENU',
  w_m_team:'Drużyna', w_m_bag:'Plecak', w_m_dex:'Bestiariusz', w_m_map:'Mapa', w_m_save:'Zapisz grę', w_m_load:'Wczytaj grę',
  w_m_set:'Ustawienia', w_m_title:'Menu główne',
  w_q_title:'Wrócić do menu głównego? Niezapisany postęp przepadnie.',
  w_shrine_q:'Odpocząć przy świętym płomieniu?', w_rest_done:'Płomień otula cię ciepłem. Drużyna odzyskała siły, a wędrówka została zapisana.',
  w_kindled:'PŁOMIEŃ ROZPALONY', w_sh_rest:'Odpocznij', w_sh_box:'Schowek', w_sh_travel:'Podróż', w_sh_leave:'Odejdź', w_shrine_t:'ŚWIĘTY PŁOMIEŃ',
  w_chest_gold:'W skrzyni leży {0} zł!', w_chest_item:'Znaleziono: {0} ×{1}!', w_chest_empty:'Skrzynia jest pusta.',
  w_died:'POLEGŁEŚ', w_died_sub:'Płomień przywołuje cię z powrotem...', w_lost_gold:'Straciłeś {0} zł.',
  w_purified:'KRAINA OCZYSZCZONA', w_crystal:'Kryształ Światła krainy {0} znów lśni! ({1}/10)',
  w_portal_open:'W miejscu strażnika otworzył się portal.', w_portal_q:'Wejść do portalu i ruszyć do następnej krainy?',
  w_portal_final:'Przejść przez ostatni portal, ku świtowi?', w_portal_sealed:'Portal jest uśpiony. Pokonaj strażnika krainy.',
  w_no_path:'Nie da się tam dojść.', w_shop_hi:'Witaj, wędrowcze! Rzuć okiem na mój towar.',
  w_map_t:'MAPA KRAINY', w_map_close:'Naciśnij dowolny klawisz',
  w_saved:'Zapisano grę.',
  w_hint_kb:'{0}: ruch  {1}: akcja  {2}: bieg  {3}/{4}: obrót  {5}: menu',
  w_hint_mouse:'Klik: idź  Przeciągnij: przesuń  PPM: obrót  Kółko: zoom',
  w_hint_touch:'Dotknij: idź  Przeciągnij: przesuń  2 palce: zoom/obrót',
  w_hint_pad:'Gałka: ruch  A: akcja  LB/RB: obrót  LT/RT: zoom  Start: menu',
  w_starter_q:'Wybierasz {0}?', w_starter_ok:'{0}! Doskonały wybór. Niech płomień was prowadzi.',
  w_aldo:'Aldo',
  w_pro1:'Aldo: Obudź się, dziecko... Jestem Aldo, ostatni ze Strażników Płomienia.',
  w_pro2:'Aldo: Niegdyś Dziesięć Krain lśniło blaskiem Kryształów Światła. Każda kraina strzegła jednego z nich.',
  w_pro3:'Aldo: Lecz nadeszło Zaćmienie. Ciemność pochłonęła kryształy, a ich strażnicy oszaleli i zamienili się w bestie.',
  w_pro4:'Aldo: Stworzenia, niegdyś łagodne, zdziczały. Tylko ten, kto zwiąże się z nimi więzią, zdoła przywrócić światło.',
  w_pro5:'Aldo: Nie pójdziesz sam. Wybierz jedno z tych trzech stworzeń — odtąd będzie twoim towarzyszem.',
  w_pro6:'Aldo: Odpoczywaj przy świętych płomieniach. Tam leczysz rany i zapisujesz swą wędrówkę. A jeśli polegniesz... płomień przywoła cię z powrotem.',
  w_pro7:'Aldo: Ruszaj, Strażniku. Odzyskaj dziesięć Kryształów Światła i rozprosz Zaćmienie.',
  w_epi1:'Ostatni Kryształ rozbłysnął i Zaćmienie pękło jak szkło. Nad Dziesięcioma Krainami po raz pierwszy od lat wzeszło słońce.',
  w_epi2:'Strażnicy krain odzyskali rozum, a dzikie stworzenia znów bawią się w trawie, nie znając strachu.',
  w_epi3:'Aldo: Dokonałeś tego. Płomień nie zgaśnie, dopóki ktoś taki jak ty o niego dba.',
  w_epi4:'Twoja kronika dobiega końca... lecz każda kraina wciąż czeka, by ją odwiedzić.',
  w_hint0:'Przy świętym płomieniu odzyskasz siły i zapiszesz grę. Gdy polegniesz, wrócisz do ostatniego płomienia.',
  w_hint1:'W wysokiej trawie czają się dzikie stworzenia. Osłab je, zanim rzucisz kulę światła.',
  w_hint2:'Mapę obrócisz o pełne 360°: Q/E, prawy przycisk myszy albo dwoma palcami. Kółko myszy przybliża.',
  w_hint3:'Kliknij albo dotknij kafelka, a sam tam dojdziesz. Kliknij postać, by z nią porozmawiać.',
  w_hint4:'Typy mają znaczenie: ogień pali rośliny, woda gasi ogień, rośliny piją wodę.',
  w_hint5:'Gdy pokonasz strażnika krainy, w jego miejscu otworzy się portal do następnej.',
  w_hint6:'Skrzynie kryją złoto i przedmioty. Warto zajrzeć w każdy kąt.',
  w_hint7:'W sklepie kupisz mikstury i kule. Im dalej zajdziesz, tym lepszy towar.'
},{
  w_chapter:'REALM {0}', w_gold:'{0} G', w_pause:'MENU',
  w_m_team:'Team', w_m_bag:'Bag', w_m_dex:'Bestiary', w_m_map:'Map', w_m_save:'Save game', w_m_load:'Load game',
  w_m_set:'Settings', w_m_title:'Title screen',
  w_q_title:'Return to the title screen? Unsaved progress will be lost.',
  w_shrine_q:'Rest at the sacred flame?', w_rest_done:'The flame wraps you in warmth. Your team is restored and your journey is saved.',
  w_kindled:'FLAME KINDLED', w_sh_rest:'Rest', w_sh_box:'Box', w_sh_travel:'Travel', w_sh_leave:'Leave', w_shrine_t:'SACRED FLAME',
  w_chest_gold:'The chest holds {0} G!', w_chest_item:'Found: {0} ×{1}!', w_chest_empty:'The chest is empty.',
  w_died:'YOU DIED', w_died_sub:'The flame calls you back...', w_lost_gold:'You lost {0} G.',
  w_purified:'REALM PURIFIED', w_crystal:'The Light Crystal of realm {0} shines again! ({1}/10)',
  w_portal_open:'A portal has opened where the guardian stood.', w_portal_q:'Enter the portal and travel to the next realm?',
  w_portal_final:'Step through the last portal, toward the dawn?', w_portal_sealed:'The portal is dormant. Defeat the realm\'s guardian.',
  w_no_path:'You can\'t get there.', w_shop_hi:'Welcome, traveller! Have a look at my wares.',
  w_map_t:'REALM MAP', w_map_close:'Press any key',
  w_saved:'Game saved.',
  w_hint_kb:'{0}: move  {1}: act  {2}: run  {3}/{4}: rotate  {5}: menu',
  w_hint_mouse:'Click: walk  Drag: pan  RMB: rotate  Wheel: zoom',
  w_hint_touch:'Tap: walk  Drag: pan  2 fingers: zoom/rotate',
  w_hint_pad:'Stick: move  A: act  LB/RB: rotate  LT/RT: zoom  Start: menu',
  w_starter_q:'Choose {0}?', w_starter_ok:'{0}! A fine choice. May the flame guide you both.',
  w_aldo:'Aldo',
  w_pro1:'Aldo: Wake up, child... I am Aldo, the last of the Flamekeepers.',
  w_pro2:'Aldo: Once, the Ten Realms shone with the light of the Light Crystals. Each realm guarded one of them.',
  w_pro3:'Aldo: But then came the Eclipse. Darkness swallowed the crystals, and their guardians went mad and turned into beasts.',
  w_pro4:'Aldo: Creatures that were once gentle have grown wild. Only one who bonds with them can bring back the light.',
  w_pro5:'Aldo: You will not go alone. Choose one of these three creatures — from now on it will be your companion.',
  w_pro6:'Aldo: Rest at the sacred flames. There you heal your wounds and record your journey. And should you fall... the flame will call you back.',
  w_pro7:'Aldo: Go now, Warden. Reclaim the ten Light Crystals and scatter the Eclipse.',
  w_epi1:'The last Crystal blazed and the Eclipse shattered like glass. For the first time in years, the sun rose over the Ten Realms.',
  w_epi2:'The guardians of the realms regained their minds, and wild creatures play in the grass again, knowing no fear.',
  w_epi3:'Aldo: You did it. The flame will never die while someone like you tends it.',
  w_epi4:'Your chronicle draws to a close... yet every realm still waits to be visited.',
  w_hint0:'At a sacred flame you regain strength and save. If you fall, you return to the last flame.',
  w_hint1:'Wild creatures lurk in tall grass. Weaken them before throwing a light orb.',
  w_hint2:'You can rotate the map a full 360°: Q/E, right mouse button or two fingers. The mouse wheel zooms.',
  w_hint3:'Click or tap a tile and you will walk there. Click a person to talk to them.',
  w_hint4:'Types matter: fire burns plants, water douses fire, plants drink water.',
  w_hint5:'Defeat a realm\'s guardian and a portal to the next one opens in its place.',
  w_hint6:'Chests hide gold and items. It pays to check every corner.',
  w_hint7:'The shop sells potions and orbs. The further you go, the better the stock.'
});

let world=null;
let _wBusy=0;
const _wDirOpp={up:'down',down:'up',left:'right',right:'left'};
function _wSfx(n){try{if(typeof sfx==='function')sfx(n);}catch(e){}}
function _wHeld(a){try{return typeof isHeld==='function'&&isHeld(a);}catch(e){return false;}}
function _wLv(li){if(!game.lv)game.lv={};let s=game.lv[li];if(!s){s=game.lv[li]={c:[],tr:[],boss:false};}
  if(!s.c)s.c=[];if(!s.tr)s.tr=[];if(!s.sh)s.sh=[];return s;}
function _wMul(){const d=(typeof DIFF!=='undefined'&&DIFF[SET.difficulty|0])||{mul:1};return d.mul||1;}
function _wMon(sp,lv){const m=createMon(sp,lv);const k=_wMul();if(k!==1){m.mul={hp:k,atk:k,def:k};healMon(m);}return m;}
function _wHealAll(){if(game&&game.party)for(const m of game.party)healMon(m);}
async function _wAct(fn){if(_wBusy)return;_wBusy++;try{await fn();}catch(e){console.error(e);}finally{_wBusy--;}}
function _wSay(s){return say(s);}

// ---------------- camera ----------------
function _wNewCam(){return{zoom:1,tzoom:1,rot:0,targetRot:0,panX:0,panY:0,recenter:false,fx:0,fy:0};}
function _wRotSpd(){return[0,1.1,1.9,2.9,4.2][clamp(SET.rotSpeed|0,1,4)];}
function _wFocus(){const w=world,p=w.p,c=w.cam;const px=lerp(p.x,p.tx,p.moving?p.prog:0)*TS+TS/2,py=lerp(p.y,p.ty,p.moving?p.prog:0)*TS+TS/2;
  let fx=px+c.panX,fy=py+c.panY;
  if(Math.abs(Math.sin(c.rot))<0.002&&Math.cos(c.rot)>0){const q=c.zoom*(RS||1);fx=Math.round(fx*q)/q;fy=Math.round(fy*q)/q;}
  c.fx=fx;c.fy=fy;return[fx,fy];}
function worldToScreen(wx,wy){const c=world.cam,co=Math.cos(c.rot),si=Math.sin(c.rot),dx=wx-c.fx,dy=wy-c.fy;
  return[W/2+c.zoom*(co*dx-si*dy),H/2+c.zoom*(si*dx+co*dy)];}
function screenToWorld(x,y){const c=world.cam,co=Math.cos(c.rot),si=Math.sin(c.rot),dx=x-W/2,dy=y-H/2;
  return[(co*dx+si*dy)/c.zoom+c.fx,(-si*dx+co*dy)/c.zoom+c.fy];}
function screenToTile(x,y){const[wx,wy]=screenToWorld(x,y);return[Math.floor(wx/TS),Math.floor(wy/TS)];}
function _wZoomBy(f,ax,ay){const c=world.cam;const nz=clamp(c.tzoom*f,0.5,3);
  if(ax==null){c.tzoom=nz;return;}
  const[w0x,w0y]=screenToWorld(ax,ay);c.zoom=c.tzoom=nz;const[w1x,w1y]=screenToWorld(ax,ay);
  c.panX+=w0x-w1x;c.panY+=w0y-w1y;c.recenter=false;}
function camReset(){if(!world)return;const c=world.cam;c.tzoom=1;c.targetRot=Math.round(c.rot/(2*Math.PI))*2*Math.PI;c.recenter=true;}
function _wCamUpdate(dt){
  const c=world.cam,sp=_wRotSpd();
  if(!ui.length||scene==='world'){
    if(_wHeld('rotL'))c.targetRot-=sp*dt;
    if(_wHeld('rotR'))c.targetRot+=sp*dt;
    if(typeof axisCam==='function'){const a=axisCam()||{x:0,y:0};if(Math.abs(a.x)>0.15)c.targetRot+=a.x*sp*dt;
      if(Math.abs(a.y)>0.15)c.tzoom=clamp(c.tzoom*Math.exp(-a.y*dt*1.6),0.5,3);}
  }
  c.rot+=(c.targetRot-c.rot)*Math.min(1,dt*12);if(Math.abs(c.targetRot-c.rot)<1e-4)c.rot=c.targetRot;
  c.zoom+=(c.tzoom-c.zoom)*Math.min(1,dt*10);if(Math.abs(c.tzoom-c.zoom)<1e-4)c.zoom=c.tzoom;
  if(c.recenter){const k=Math.exp(-dt*6);c.panX*=k;c.panY*=k;if(Math.hypot(c.panX,c.panY)<0.3){c.panX=c.panY=0;c.recenter=false;}}
  // keep rotation numbers bounded (only when settled)
  if(c.rot===c.targetRot&&Math.abs(c.rot)>Math.PI*8){const k=Math.round(c.rot/(2*Math.PI))*2*Math.PI;c.rot-=k;c.targetRot-=k;}
}

// ---------------- level entry ----------------
function _wBuild(li){
  const L=LEVELS[li],th=THEMES[L.theme]||THEMES.meadow||{};
  const map=genLevel(li),st=_wLv(li);
  st.c.forEach(ci=>{const ch=map.chests[ci];if(ch)setTile(map,ch.x,ch.y,T_CHEST_OPEN);});
  const portals=[];for(let y=0;y<map.h;y++)for(let x=0;x<map.w;x++)if(tileAt(map,x,y)===T_PORTAL)portals.push({x,y});
  const bossAlive=!st.boss;
  if(!bossAlive){setTile(map,map.boss.x,map.boss.y,T_PORTAL);portals.push({x:map.boss.x,y:map.boss.y});}
  const mc=paintMap(map,th);
  const npcs=(map.npcs||[]).map((n,i)=>Object.assign({i},n));
  let spr=null;try{spr=monSprite(L.boss);}catch(e){}
  const old=world&&world.cam;
  return{li,L,th,map,mc,npcs,st,
    p:{x:map.start.x,y:map.start.y,tx:map.start.x,ty:map.start.y,moving:false,prog:0,dir:'down',walkT:0},
    boss:{x:map.boss.x,y:map.boss.y,alive:bossAlive,sp:L.boss,spr},
    portalActive:!bossAlive,portals,
    cam:old?Object.assign(old,{panX:0,panY:0,recenter:false}):_wNewCam(),
    path:[],pathAct:null,target:null,hover:null,parts:[],steps:0,encSteps:0,
    heldDir:null,turnWait:0,chain:false,bumpT:0,drag:null,dark:null,mapView:null};
}
function _wValidPos(w,x,y){return x>=0&&y>=0&&x<w.map.w&&y<w.map.h&&passable(tileAt(w.map,x,y))&&!_wNpcAt(x,y,w)&&!(w.boss.alive&&w.boss.x===x&&w.boss.y===y);}
async function enterLevel(li,o){
  o=o||{};_wBusy++;
  try{
    if(scene==='world'||scene==='story'||scene==='battle')await transition('in');
    li=clamp(li|0,0,LEVELS.length-1);
    world=_wBuild(li);
    const w=world,p=w.p;
    if(o.pos&&o.pos.li===li&&_wValidPos(w,o.pos.x,o.pos.y)){p.x=p.tx=o.pos.x;p.y=p.ty=o.pos.y;}
    game.pos={li,x:p.x,y:p.y};
    if(!o.pos||!game.cp||game.cp.x<0)game.cp={li,x:w.map.start.x,y:w.map.start.y};
    if(o.heal)_wHealAll();
    scene='world';
    try{playMusic(w.L.music);}catch(e){}
    autoSave();
    await transition('out');
    const first=!w.st.intro;
    const bn=banner(t('w_chapter',w.L.roman),L2(w.L.name));
    if(first){await bn;w.st.intro=true;await say(L2(w.L.intro));autoSave();}
  }catch(e){console.error(e);}
  finally{_wBusy--;}
}
function resumeGame(){if(!game)return Promise.resolve();const ps=game.pos||{li:0,x:-1,y:-1};return enterLevel(ps.li|0,{pos:Object.assign({},ps)});}

async function startNewGame(slot){
  game=newSave();game.slot=slot||1;scene='story';world=null;
  try{playMusic('story');}catch(e){}
  _wBusy++;
  try{
    await sleep(400);
    for(const k of['w_pro1','w_pro2','w_pro3','w_pro4','w_pro5'])await say(t(k));
    let id;
    for(;;){const i=await pickStarter(STARTERS);id=STARTERS[clamp(i|0,0,STARTERS.length-1)];
      if(await ask(t('w_starter_q',L2(SPECIES[id]?SPECIES[id].name:id))))break;}
    const m=createMon(id,5);game.party=[m];game.seen[id]=true;game.caught[id]=true;
    _wSfx('ok');
    await say(t('w_starter_ok',monName(m)));
    await say(t('w_pro6'));await say(t('w_pro7'));
    saveToSlot(game.slot);
  }catch(e){console.error(e);}
  finally{_wBusy--;}
  await enterLevel(0,{});
}

// ---------------- queries ----------------
function _wNpcAt(x,y,w){w=w||world;for(const n of w.npcs)if(n.x===x&&n.y===y)return n;return null;}
function _wBlocked(x,y){const w=world,m=w.map;if(x<0||y<0||x>=m.w||y>=m.h)return true;
  if(!passable(tileAt(m,x,y)))return true;if(_wNpcAt(x,y))return true;if(w.boss.alive&&w.boss.x===x&&w.boss.y===y)return true;return false;}
function _wIsPortal(x,y){return world.portals.some(q=>q.x===x&&q.y===y);}
function _wInteractable(x,y){const w=world;if(_wNpcAt(x,y))return true;if(w.boss.alive&&w.boss.x===x&&w.boss.y===y)return true;
  const tl=tileAt(w.map,x,y);return tl===T_CHEST||tl===T_CHEST_OPEN||tl===T_SHRINE;}
function _wFindPath(sx,sy,goal,maxN){
  const m=world.map,Wd=m.w,N=m.w*m.h,prev=new Int32Array(N).fill(-2),q=new Int32Array(N);let h=0,tl=0;
  const s=sy*Wd+sx;prev[s]=-1;q[tl++]=s;let found=-1,cnt=0;maxN=maxN||N;
  while(h<tl&&cnt++<maxN){const c=q[h++],cx=c%Wd,cy=(c/Wd)|0;if(goal(cx,cy)){found=c;break;}
    for(const k in DIRS){const nx=cx+DIRS[k][0],ny=cy+DIRS[k][1];if(nx<0||ny<0||nx>=m.w||ny>=m.h)continue;const ni=ny*Wd+nx;
      if(prev[ni]!==-2||_wBlocked(nx,ny))continue;prev[ni]=c;q[tl++]=ni;}}
  if(found<0)return null;const out=[];for(let c=found;c!==s;c=prev[c])out.push([c%Wd,(c/Wd)|0]);return out.reverse();}
function _wDirTo(ax,ay,bx,by){const dx=bx-ax,dy=by-ay;return Math.abs(dx)>=Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');}

// ---------------- movement ----------------
function _wWantDir(){
  let ix=0,iy=0;
  if(_wHeld('left'))ix-=1;if(_wHeld('right'))ix+=1;if(_wHeld('up'))iy-=1;if(_wHeld('down'))iy+=1;
  if(!ix&&!iy&&typeof axisMove==='function'){const a=axisMove()||{x:0,y:0};if(Math.hypot(a.x,a.y)>0.35){ix=a.x;iy=a.y;}}
  if(!ix&&!iy)return null;
  let wx=ix,wy=iy;
  if(SET.camRelative){const r=world.cam.rot,c=Math.cos(r),s=Math.sin(r);wx=c*ix+s*iy;wy=-s*ix+c*iy;}
  const ax=Math.abs(wx),ay=Math.abs(wy),cur=world.p.dir;
  if(Math.abs(ax-ay)<0.05){const[cx,cy]=DIRS[cur];if((cx&&Math.sign(cx)===Math.sign(wx))||(cy&&Math.sign(cy)===Math.sign(wy)))return cur;}
  return ax>ay?(wx>0?'right':'left'):(wy>0?'down':'up');
}
function _wTryStep(d){
  const w=world,p=w.p;p.dir=d;const nx=p.x+DIRS[d][0],ny=p.y+DIRS[d][1];
  if(_wBlocked(nx,ny)){if(w.bumpT<=0){_wSfx('bump');w.bumpT=0.38;}return false;}
  p.tx=nx;p.ty=ny;p.moving=true;p.prog=0;p.walkT^=1;
  if(w.cam.panX||w.cam.panY)w.cam.recenter=true;
  return true;
}
function _wOnStep(){
  const w=world,p=w.p;w.steps++;w.encSteps++;
  game.pos={li:w.li,x:p.x,y:p.y};
  if(w.target&&w.target.x===p.x&&w.target.y===p.y&&!w.path.length)w.target=null;
  if(w.steps%50===0)autoSave();
  if(_wIsPortal(p.x,p.y)){w.path.length=0;w.pathAct=null;_wAct(_wPortal);return;}
  if(tileAt(w.map,p.x,p.y)===T_GRASS&&w.encSteps>=3){
    const rate=0.09*[0.5,1,1.7][clamp(SET.encounter|0,0,2)];
    if(Math.random()<rate){w.encSteps=0;w.path.length=0;w.pathAct=null;w.target=null;_wAct(_wWild);}
  }
}
async function _wWild(){
  const L=world.L;const sp=pick(L.pool);const lv=ri(L.lv[0],L.lv[1]);
  _wSfx('enc');
  const r=await runBattle({kind:'wild',team:[_wMon(sp,lv)]});
  if(r==='lose')await _wDie();
}
function worldUpdate(dt){
  const w=world;if(!w)return;
  _wCamUpdate(dt);_wParticles(dt);
  w.bumpT-=dt;
  const p=w.p;
  if(p.moving){
    const spd=(_wHeld('run')||_wHeld('back'))?8:4.5;
    p.prog+=spd*dt;
    if(p.prog>=1){p.x=p.tx;p.y=p.ty;p.moving=false;p.prog=0;w.chain=true;_wOnStep();}
    else return;
  }
  const free=!_wBusy&&!ui.length&&scene==='world';
  if(!free){w.chain=false;w.heldDir=null;return;}
  const d=_wWantDir();
  if(d){
    if(w.path.length||w.pathAct){w.path.length=0;w.pathAct=null;w.target=null;}
    if(d!==w.heldDir){w.heldDir=d;if(d!==p.dir&&!w.chain){p.dir=d;w.turnWait=0.09;}}
    if(w.turnWait>0){w.turnWait-=dt;w.chain=false;return;}
    _wTryStep(d);w.chain=false;return;
  }
  w.heldDir=null;w.turnWait=0;w.chain=false;
  if(w.path.length){const[nx,ny]=w.path.shift();
    if(Math.abs(nx-p.x)+Math.abs(ny-p.y)!==1||_wBlocked(nx,ny)){w.path.length=0;w.pathAct=null;w.target=null;return;}
    _wTryStep(_wDirTo(p.x,p.y,nx,ny));return;}
  if(w.pathAct){const a=w.pathAct;w.pathAct=null;w.target=null;
    if(Math.abs(a.x-p.x)+Math.abs(a.y-p.y)===1){p.dir=_wDirTo(p.x,p.y,a.x,a.y);_wAct(()=>_wInteractAt(a.x,a.y));}}
}

// ---------------- interactions ----------------
function _wFacing(){const p=world.p;return[p.x+DIRS[p.dir][0],p.y+DIRS[p.dir][1]];}
async function _wInteractAt(x,y){
  const w=world,m=w.map,li=w.li,L=w.L;
  const n=_wNpcAt(x,y);
  if(n)return _wTalk(n);
  if(w.boss.alive&&w.boss.x===x&&w.boss.y===y)return _wBoss();
  const tl=tileAt(m,x,y);
  if(tl===T_CHEST)return _wChest(x,y);
  if(tl===T_CHEST_OPEN)return say(t('w_chest_empty'));
  if(tl===T_SHRINE)return _wShrine();
  if(_wIsPortal(x,y))return _wPortal();
}
function _wNm(nm,s){return nm?nm+': '+s:s;}
async function _wTalk(n){
  const w=world,L=w.L,p=w.p;n.dir=_wDirOpp[p.dir];
  if(n.kind==='lore'){const l=L.lore&&L.lore[n.idx%(L.lore.length||1)];await say(l?L2(l):'...');return;}
  if(n.kind==='hint'){await say(t('w_hint'+((n.idx+w.li*3)%8)));return;}
  if(n.kind==='shop'){if(typeof shopMenu==='function')await shopMenu(w.li);else await say(t('w_shop_hi'));return;}
  if(n.kind==='trainer'){
    const tr=L.trainers&&L.trainers[n.idx];if(!tr){await say('...');return;}
    const nm=L2(tr.name);
    if(w.st.tr.includes(n.idx)){await say(_wNm(nm,L2(tr.post)));return;}
    await say(_wNm(nm,L2(tr.pre)));
    const team=tr.team.map((sp,i)=>_wMon(sp,(tr.lv|0)+(i===tr.team.length-1&&tr.team.length>1?1:0)));
    const r=await runBattle({kind:'trainer',team,tname:nm,reward:Math.round((tr.lv|0)*35+50)});
    if(r==='lose'){await _wDie();return;}
    if(r==='win'){if(!w.st.tr.includes(n.idx))w.st.tr.push(n.idx);await say(_wNm(nm,L2(tr.post)));autoSave();}
    return;
  }
  await say('...');
}
async function _wChest(x,y){
  const w=world,m=w.map;const ci=m.chests.findIndex(c=>c.x===x&&c.y===y);
  setTile(m,x,y,T_CHEST_OPEN);try{repaintTile(w.mc,m,w.th,x,y);}catch(e){}
  _wSfx('chest');
  if(ci>=0&&!w.st.c.includes(ci))w.st.c.push(ci);
  const lt=(ci>=0&&m.chests[ci].loot)||{gold:50};
  if(lt.item&&typeof ITEMS!=='undefined'&&ITEMS[lt.item]){const k=lt.n||1;game.items[lt.item]=(game.items[lt.item]||0)+k;
    await say(t('w_chest_item',L2(ITEMS[lt.item].n),k));}
  else{const g=lt.gold||50;game.gold+=g;await say(t('w_chest_gold',g));}
  autoSave();
}
async function _wShrine(){
  const w=world,p=w.p;
  if(!(await ask(t('w_shrine_q'))))return;
  const shi=w.map.shrines.findIndex(s=>Math.abs(s.x-p.x)+Math.abs(s.y-p.y)<=1);
  _wHealAll();game.cp={li:w.li,x:p.x,y:p.y};game.pos={li:w.li,x:p.x,y:p.y};saveToSlot(game.slot||1);
  _wSfx('shrine');fx.shake=Math.max(fx.shake,2);
  if(shi>=0&&!w.st.sh.includes(shi)){w.st.sh.push(shi);saveToSlot(game.slot||1);await bigText(t('w_kindled'),{color:'#f3c060',dur:2.6});}
  await say(t('w_rest_done'));
  let idx=0;
  for(;;){
    const r=await menu({items:[t('w_sh_rest'),t('w_sh_box'),t('w_sh_travel'),t('w_sh_leave')],x:W-128,y:8,w:120,idx,title:t('w_shrine_t')});
    if(r<0||r===3)return;idx=r;
    if(r===0){_wHealAll();saveToSlot(game.slot||1);_wSfx('heal');toast(t('w_saved'));}
    else if(r===1){if(typeof boxMenu==='function')await boxMenu();}
    else if(r===2&&typeof openLevelSelect==='function'){const li=await openLevelSelect();
      if(li!=null&&li>=0&&li!==w.li){_wSfx('door');await enterLevel(li,{});return;}}
  }
}
async function _wBoss(){
  const w=world,L=w.L,li=w.li;w.p.dir=_wDirTo(w.p.x,w.p.y,w.boss.x,w.boss.y);
  await say(L2(L.bossLine));
  const team=[_wMon(L.boss,L.bossLv)];
  const b2=L.boss2||(li===9&&SPECIES.eclipsor2?'eclipsor2':null);
  if(b2)team.push(_wMon(b2,L.boss2Lv||L.bossLv+2));
  let tname=L2(L.boss);try{tname=monName(team[0]);}catch(e){}
  const r=await runBattle({kind:'boss',team,final:li===9,reward:(L.bossLv|0)*60,tname});
  if(r==='lose'){await _wDie();return;}
  if(r!=='win')return;
  w.st.boss=true;w.boss.alive=false;w.portalActive=true;
  setTile(w.map,w.boss.x,w.boss.y,T_PORTAL);try{repaintTile(w.mc,w.map,w.th,w.boss.x,w.boss.y);}catch(e){}
  if(!_wIsPortal(w.boss.x,w.boss.y))w.portals.push({x:w.boss.x,y:w.boss.y});
  game.unlocked=Math.min(10,Math.max(game.unlocked||1,li+2));
  if(!game.cleared.includes(li))game.cleared.push(li);
  autoSave();
  try{playJingle('clear');}catch(e){}
  fx.shake=6;
  await bigText(t('w_purified'),{color:'#ffd36b',dur:4});
  await say(t('w_crystal',L.roman,game.cleared.length));
  await say(t('w_portal_open'));
}
async function _wPortal(){
  const w=world;
  if(!w.portalActive){toast(t('w_portal_sealed'));return;}
  if(w.li>=9){if(await ask(t('w_portal_final'))){_wSfx('door');await playEnding();}return;}
  if(await ask(t('w_portal_q'))){_wSfx('door');await enterLevel(w.li+1,{});}
}
async function _wDie(){
  fx.shake=10;vibrate(200);_wSfx('death');
  try{playJingle('died');}catch(e){}
  await bigText(t('w_died'),{color:'#b01818',dur:4,sub:t('w_died_sub')});
  const lost=Math.floor((game.gold||0)/2);game.gold-=lost;
  _wHealAll();
  const cp=game.cp&&game.cp.x>=0?game.cp:{li:world?world.li:0,x:-1,y:-1};
  await enterLevel(cp.li,{pos:Object.assign({},cp)});
  if(lost>0)await say(t('w_lost_gold',lost));
}

// ---------------- pause / map ----------------
function _wPause(){
  _wAct(async()=>{
    let idx=0;
    for(;;){
      const items=[t('w_m_team'),t('w_m_bag'),t('w_m_dex'),t('w_m_map'),t('w_m_save'),t('w_m_load'),t('w_m_set'),t('w_m_title')];
      _wSfx('ok');
      const r=await menu({items,x:W-124,y:6,w:118,idx,title:t('w_pause')});
      if(r<0)return;idx=r;
      if(r===0)await teamMenu({mode:'world'});
      else if(r===1)await bagMenu({});
      else if(r===2)await bestiaryMenu();
      else if(r===3)await _wMapView();
      else if(r===4)await openSaveLoad('save');
      else if(r===5){const s=await openSaveLoad('load');if(s){await resumeGame();return;}}
      else if(r===6)await openSettings();
      else if(r===7){if(await confirmDS(t('w_q_title'))){world=null;showTitle();return;}}
    }
  });
}
function _wMapCanvas(){
  const w=world,m=w.map,th=w.th;
  const c=document.createElement('canvas');c.width=m.w;c.height=m.h;const g=c.getContext('2d');
  const col={};col[T_FLOOR]=th.floor;col[T_PATH]=th.path;col[T_GRASS]=th.grass;col[T_DECO]=th.floor2||th.floor;
  col[T_WALL]=th.wallB||th.wallA;col[T_BLOCK]=th.wallA||th.trunk;col[T_CHEST]=th.floor;col[T_CHEST_OPEN]=th.floor;col[T_SHRINE]=th.floor;col[T_PORTAL]=th.floor;
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){g.fillStyle=col[tileAt(m,x,y)]||'#222';g.fillRect(x,y,1,1);}
  return c;
}
function _wMapView(){
  const w=world;let mc=null;try{mc=_wMapCanvas();}catch(e){}
  const wd={t:0,update(dt){this.t+=dt;},
    draw(){
      const m=w.map;ctx.save();ctx.fillStyle='rgba(4,7,15,0.86)';ctx.fillRect(0,0,W,H);
      panel(8,6,W-16,H-12,{dark:true,r:8});
      _wText(t('w_map_t')+'  —  '+w.L.roman+'. '+L2(w.L.name),W/2,13,'#f3d27a','center');
      const s=Math.min((W-40)/m.w,(H-56)/m.h),ox=Math.round(W/2-m.w*s/2),oy=Math.round(30+(H-56-m.h*s)/2);
      ctx.imageSmoothingEnabled=false;if(mc)ctx.drawImage(mc,ox,oy,m.w*s,m.h*s);
      ctx.strokeStyle='rgba(190,215,255,0.6)';ctx.strokeRect(ox-0.5,oy-0.5,m.w*s+1,m.h*s+1);
      const dot=(x,y,c,r)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(ox+(x+0.5)*s-r/2),Math.round(oy+(y+0.5)*s-r/2),r,r);};
      const r=Math.max(3,Math.round(s));
      m.chests.forEach((c,i)=>{if(!w.st.c.includes(i))dot(c.x,c.y,'#e8b040',r);});
      w.npcs.forEach(n=>dot(n.x,n.y,n.kind==='trainer'?'#e05050':n.kind==='shop'?'#50b0ff':'#e8e8e8',r));
      m.shrines.forEach(sh=>{dot(sh.x,sh.y,'#ff8a2a',r+1);dot(sh.x,sh.y,'#ffe090',Math.max(1,r-2));});
      if(w.boss.alive){const bx=ox+(w.boss.x+0.5)*s,by=oy+(w.boss.y+0.5)*s;_wSkull(bx,by);}
      w.portals.forEach(q=>dot(q.x,q.y,w.portalActive?'#c080ff':'#605070',r+1));
      if((this.t*3|0)%2===0){dot(w.p.x,w.p.y,'#ffffff',r+2);dot(w.p.x,w.p.y,'#e03030',r);}
      _wText(t('w_map_close'),W/2,H-20,'#9fb3d6','center');
      ctx.restore();},
    input(){closeWidget(this,0);},
    mouse(ev){if(ev.type==='click'||ev.type==='down'||ev.type==='context'){if(ev.type!=='down')closeWidget(this,0);return true;}return true;}};
  return pushWidget(wd);
}
function _wSkull(x,y){ctx.save();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(x,y-1,4.5,0,7);ctx.fill();ctx.fillRect(x-3,y+1,6,4);
  ctx.fillStyle='#f0e8e0';ctx.beginPath();ctx.arc(x,y-1,3.5,0,7);ctx.fill();ctx.fillRect(x-2,y+1,4,3);
  ctx.fillStyle='#000';ctx.fillRect(x-2,y-2,1.5,1.5);ctx.fillRect(x+0.5,y-2,1.5,1.5);ctx.restore();}
function _wText(s,x,y,col,align,sh){ctx.save();ctx.font=typeof FONT!=='undefined'?FONT:'8px monospace';ctx.textBaseline='top';ctx.textAlign=align||'left';
  ctx.fillStyle=sh||'#020614';ctx.fillText(s,x+1,y+1);ctx.fillStyle=col||'#fff';ctx.fillText(s,x,y);ctx.restore();}

// ---------------- input ----------------
function worldInput(a,rep){
  const w=world;if(!w)return;
  if(a==='zoomIn'){_wZoomBy(1.25);return;}
  if(a==='zoomOut'){_wZoomBy(1/1.25);return;}
  if(a==='camReset'){if(!rep)camReset();return;}
  if(_wBusy||ui.length)return;
  if(a==='up'||a==='down'||a==='left'||a==='right'){if(w.path.length||w.pathAct){w.path.length=0;w.pathAct=null;w.target=null;}return;}
  if(rep)return;
  if(a==='menu'){_wPause();return;}
  if(a==='ok'&&!w.p.moving){const[x,y]=_wFacing();_wAct(()=>_wInteractAt(x,y));}
}
const _wHudBtns=[{k:'menu',x:W-20,y:14},{k:'in',x:W-20,y:32},{k:'out',x:W-20,y:50},{k:'reset',x:W-20,y:68}];
function _wHudVisible(){return typeof lastDevice!=='undefined'&&lastDevice==='mouse';}
function _wHudHit(ev){if(!_wHudVisible())return null;for(const b of _wHudBtns)if(ev.x>=b.x&&ev.x<b.x+16&&ev.y>=b.y&&ev.y<b.y+16)return b.k;return null;}
function worldMouse(ev){
  const w=world;if(!w)return;
  const cam=SET.mouseCam!==false,c=w.cam;
  switch(ev.type){
    case'move':{const[tx,ty]=screenToTile(ev.x,ev.y);w.hover={x:tx,y:ty};w.hoverHud=_wHudHit(ev);break;}
    case'wheel':if(!cam)break;{let d=ev.delta||0;if(SET.invertZoom)d=-d;_wZoomBy(Math.pow(1.15,-d),ev.x,ev.y);}break;
    case'pinch':if(!cam)break;{const nz=clamp(c.tzoom*(ev.scale||1),0.5,3);c.zoom=c.tzoom=nz;c.rot+=ev.rot||0;c.targetRot=c.rot;}break;
    case'down':w.drag={button:ev.button|0,mode:null,moved:false,fresh:!_wBusy&&!ui.length};break;
    case'drag':{if(!cam)break;const dr=w.drag||(w.drag={button:ev.button|0,mode:null});dr.moved=true;
      if(!dr.mode)dr.mode=(dr.button===2||(dr.button===0&&(ev.ctrl||ev.shift)))?'rot':'pan';
      if(dr.mode==='rot'){// rotate: horizontal drag, or angular grab when far from centre
        const px=ev.x-ev.dx,py=ev.y-ev.dy,r0=Math.hypot(px-W/2,py-H/2);
        let da=ev.dx*0.012;
        if(r0>40&&dr.button===2){const a0=Math.atan2(py-H/2,px-W/2),a1=Math.atan2(ev.y-H/2,ev.x-W/2);let q=a1-a0;while(q>Math.PI)q-=2*Math.PI;while(q<-Math.PI)q+=2*Math.PI;da=Math.abs(ev.dx)>=Math.abs(ev.dy)?ev.dx*0.012:q;}
        c.rot+=da;c.targetRot=c.rot;
      }else{const co=Math.cos(c.rot),si=Math.sin(c.rot);c.panX-=(co*ev.dx+si*ev.dy)/c.zoom;c.panY-=(-si*ev.dx+co*ev.dy)/c.zoom;c.recenter=false;}
    }break;
    case'up':{const dr=w.drag;w.drag=null;
      if(ev.button===2&&dr&&dr.fresh&&!dr.moved&&!_wBusy&&!ui.length)_wPause();}break;
    case'dblclick':if(!_wHudHit(ev))camReset();break;
    case'click':{
      const hb=_wHudHit(ev);
      if(hb){if(hb==='menu'){if(!_wBusy&&!ui.length)_wPause();}else if(hb==='in')_wZoomBy(1.25);else if(hb==='out')_wZoomBy(1/1.25);else camReset();break;}
      if(_wBusy||ui.length||!SET.mouseMove)break;
      const[tx,ty]=screenToTile(ev.x,ev.y);_wClickTile(tx,ty);
    }break;
  }
}
function _wClickTile(tx,ty){
  const w=world,p=w.p,m=w.map;
  if(tx<0||ty<0||tx>=m.w||ty>=m.h)return;
  const sx=p.moving?p.tx:p.x,sy=p.moving?p.ty:p.y;
  if(tx===sx&&ty===sy){w.path.length=0;w.pathAct=null;w.target=null;return;}
  if(_wInteractable(tx,ty)){
    if(!p.moving&&Math.abs(tx-p.x)+Math.abs(ty-p.y)===1){p.dir=_wDirTo(p.x,p.y,tx,ty);w.path.length=0;_wAct(()=>_wInteractAt(tx,ty));return;}
    const path=_wFindPath(sx,sy,(x,y)=>Math.abs(x-tx)+Math.abs(y-ty)===1);
    if(!path){_wSfx('deny');w.target={x:tx,y:ty,t:now(),bad:true};return;}
    w.path=path;w.pathAct={x:tx,y:ty};w.target={x:tx,y:ty,t:now()};_wSfx('move');return;
  }
  if(_wBlocked(tx,ty)){_wSfx('deny');w.target={x:tx,y:ty,t:now(),bad:true};return;}
  const path=_wFindPath(sx,sy,(x,y)=>x===tx&&y===ty);
  if(!path){_wSfx('deny');toast(t('w_no_path'));w.target={x:tx,y:ty,t:now(),bad:true};return;}
  w.path=path;w.pathAct=null;w.target={x:tx,y:ty,t:now()};
}

// ---------------- particles ----------------
function _wParticles(dt){
  const w=world,kind=w.th.particles;
  if(!SET.particles||!kind||kind==='none'){w.parts.length=0;return;}
  const max=kind==='fog'?10:kind==='snow'?60:36;
  while(w.parts.length<max){const q={x:Math.random()*W,y:Math.random()*H,ph:Math.random()*6.28,life:0,max:4+Math.random()*6,s:Math.random()};
    if(kind==='snow'||kind==='petal'){if(w.parts.length>max*0.6)q.y=-6;}
    if(kind==='ember'&&w.parts.length>max*0.6)q.y=H+4;
    w.parts.push(q);}
  const tt=now();
  for(let i=w.parts.length-1;i>=0;i--){const q=w.parts[i];q.life+=dt;
    switch(kind){
      case'petal':q.y+=(14+q.s*10)*dt;q.x+=Math.sin(tt*1.5+q.ph)*18*dt+6*dt;break;
      case'snow':q.y+=(16+q.s*22)*dt;q.x+=Math.sin(tt+q.ph)*10*dt;break;
      case'ember':q.y-=(14+q.s*20)*dt;q.x+=Math.sin(tt*2+q.ph)*8*dt;break;
      case'firefly':q.x+=Math.cos(tt*0.7+q.ph)*10*dt;q.y+=Math.sin(tt*0.9+q.ph*2)*8*dt;break;
      case'dust':q.x+=(4+q.s*6)*dt;q.y+=Math.sin(tt+q.ph)*3*dt;break;
      case'fog':q.x+=(5+q.s*5)*dt;break;
      case'spark':q.y-=4*dt;break;
    }
    if(q.life>q.max||q.y>H+10||q.y<-14||q.x>W+60||q.x<-60)w.parts.splice(i,1);}
}
function _wDrawParticles(){
  const w=world,kind=w.th.particles;if(!SET.particles||!w.parts.length)return;
  const tt=now();ctx.save();
  for(const q of w.parts){const a=clamp(Math.min(q.life/0.8,(q.max-q.life)/0.8),0,1);
    switch(kind){
      case'petal':ctx.globalAlpha=a*0.85;ctx.fillStyle=q.s>0.5?'#ffc0d8':'#fff0f4';ctx.fillRect(q.x|0,q.y|0,2+(Math.sin(tt*3+q.ph)>0?1:0),2);break;
      case'snow':ctx.globalAlpha=a*0.9;ctx.fillStyle='#ffffff';const s=q.s>0.7?2:1;ctx.fillRect(q.x|0,q.y|0,s,s);break;
      case'ember':ctx.globalAlpha=a*(0.6+0.4*Math.sin(tt*8+q.ph));ctx.fillStyle=q.s>0.5?'#ffb040':'#ff6020';ctx.fillRect(q.x|0,q.y|0,q.s>0.8?2:1,q.s>0.8?2:1);break;
      case'firefly':{const b=0.5+0.5*Math.sin(tt*3+q.ph*3);ctx.globalAlpha=a*b*0.35;ctx.fillStyle='#d8ff70';ctx.beginPath();ctx.arc(q.x,q.y,3,0,7);ctx.fill();
        ctx.globalAlpha=a*b;ctx.fillRect(q.x|0,q.y|0,1,1);}break;
      case'dust':ctx.globalAlpha=a*0.4;ctx.fillStyle='#e8dcc0';ctx.fillRect(q.x|0,q.y|0,1,1);break;
      case'fog':{ctx.globalAlpha=a*0.13;const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,60+q.s*50);g.addColorStop(0,'#c8d0b8');g.addColorStop(1,'rgba(200,208,184,0)');
        ctx.fillStyle=g;ctx.fillRect(q.x-120,q.y-120,240,240);}break;
      case'spark':{const b=Math.max(0,Math.sin(tt*4+q.ph*5));ctx.globalAlpha=a*b;ctx.fillStyle='#ffffff';ctx.fillRect(q.x|0,(q.y|0)-1,1,3);ctx.fillRect((q.x|0)-1,q.y|0,3,1);}break;
    }}
  ctx.restore();
}

// ---------------- render ----------------
function _wDarkCanvas(){const w=world;if(!w.dark){w.dark=document.createElement('canvas');w.dark.width=W;w.dark.height=H;}return w.dark;}
function _wUpright(ax,ay,fn){ctx.save();ctx.translate(ax,ay);ctx.rotate(-world.cam.rot);fn();ctx.restore();}
function worldRender(){
  const w=world;if(!w)return;
  const c=w.cam,p=w.p,tt=now(),th=w.th,m=w.map;
  const[fx0,fy0]=_wFocus();
  ctx.save();
  ctx.fillStyle=th.voidCol||'#000';ctx.fillRect(-10,-10,W+20,H+20);
  ctx.translate(W/2,H/2);ctx.rotate(c.rot);ctx.scale(c.zoom,c.zoom);ctx.translate(-fx0,-fy0);
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(w.mc,0,0);
  // portals
  for(const q of w.portals){try{drawPortal(ctx,q.x*TS,q.y*TS,tt,w.portalActive);}catch(e){}}
  // hover / target markers
  if(w.hover&&_wHudVisible()&&SET.mouseMove&&!_wBusy&&!ui.length){ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=1/c.zoom;ctx.strokeRect(w.hover.x*TS+0.5,w.hover.y*TS+0.5,TS-1,TS-1);}
  if(w.target){const g=w.target,age=tt-g.t;if(g.bad&&age>0.6)w.target=null;else{
    const cx=g.x*TS+8,cy=g.y*TS+8,s=4+Math.sin(tt*6)*1.2;ctx.save();ctx.strokeStyle=g.bad?'#ff5050':'#ffe080';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(cx,cy-s);ctx.lineTo(cx+s,cy);ctx.lineTo(cx,cy+s);ctx.lineTo(cx-s,cy);ctx.closePath();ctx.stroke();
    ctx.globalAlpha=0.25;ctx.fillStyle=g.bad?'#ff5050':'#ffe080';ctx.fill();ctx.restore();}}
  // boss aura (ground)
  if(w.boss.alive){const bx=w.boss.x*TS+8,by=w.boss.y*TS+12,pr=16+Math.sin(tt*2.2)*3;
    const g=ctx.createRadialGradient(bx,by,2,bx,by,pr+8);g.addColorStop(0,'rgba(120,40,200,0.55)');g.addColorStop(1,'rgba(40,0,80,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,by,pr+8,0,7);ctx.fill();}
  // y-sorted upright sprites
  const list=[];
  const push=(ax,ay,fn)=>{const s=worldToScreen(ax,ay);list.push({k:s[1],ax,ay,fn});};
  for(const sh of m.shrines)push(sh.x*TS+8,sh.y*TS+14,()=>{try{drawShrine(ctx,-8,-14,tt);}catch(e){}});
  for(const n of w.npcs)push(n.x*TS+8,n.y*TS+16,()=>{ctx.fillStyle='rgba(0,0,0,0.25)';ctx.beginPath();ctx.ellipse(0,-1,5,2,0,0,7);ctx.fill();
    try{ctx.drawImage(charSprite(n.pal,n.dir,0),-8,-16);}catch(e){}
    if(n.kind==='trainer'&&!w.st.tr.includes(n.idx)&&Math.hypot(n.x-p.x,n.y-p.y)<4){ctx.fillStyle='#fff';ctx.fillRect(-1,-25,3,6);ctx.fillRect(-1,-18,3,2);ctx.fillStyle='#d02020';ctx.fillRect(0,-24,1,4);ctx.fillRect(0,-17,1,1);}});
  if(w.boss.alive&&w.boss.spr){const b=w.boss,spr=b.spr;push(b.x*TS+8,b.y*TS+15,()=>{const bob=Math.round(Math.sin(tt*2.4)*2);
    ctx.fillStyle='rgba(0,0,0,0.35)';ctx.beginPath();ctx.ellipse(0,-1,spr.width*0.32,3,0,0,7);ctx.fill();
    ctx.drawImage(spr,Math.round(-spr.width/2),-spr.height-2+bob);
    if((tt*1.7|0)%3===0){ctx.globalAlpha=0.2;ctx.globalCompositeOperation='lighter';ctx.drawImage(spr,Math.round(-spr.width/2),-spr.height-2+bob);}});}
  const ppx=lerp(p.x,p.tx,p.moving?p.prog:0)*TS,ppy=lerp(p.y,p.ty,p.moving?p.prog:0)*TS;
  push(ppx+8,ppy+16,()=>{
    const fr=p.moving&&p.prog>0.15&&p.prog<0.85?(p.walkT?1:2):0;
    ctx.fillStyle='rgba(0,0,0,0.28)';ctx.beginPath();ctx.ellipse(0,-1,5,2,0,0,7);ctx.fill();
    try{ctx.drawImage(charSprite(0,p.dir,fr),-8,-16-(fr?1:0));}catch(e){}
    const gx=Math.round(p.moving&&p.prog>0.5?p.tx:p.x),gy=Math.round(p.moving&&p.prog>0.5?p.ty:p.y);
    if(tileAt(m,gx,gy)===T_GRASS){try{drawGrassOverlay(ctx,-8,-16,th);}catch(e){}}});
  list.sort((a,b)=>a.k-b.k);
  for(const s of list)_wUpright(s.ax,s.ay,s.fn);
  ctx.restore();
  // darkness
  if(th.dark){const dk=_wDarkCanvas(),g=dk.getContext('2d');g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);
    g.fillStyle='rgba(2,2,10,0.86)';g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
    const hole=(x,y,r,a)=>{const gr=g.createRadialGradient(x,y,r*0.15,x,y,r);gr.addColorStop(0,'rgba(0,0,0,'+a+')');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();};
    const[sx,sy]=worldToScreen(ppx+8,ppy+8);hole(sx,sy,(78+Math.sin(tt*3)*2)*c.zoom,1);
    for(const sh of m.shrines){const[a,b]=worldToScreen(sh.x*TS+8,sh.y*TS+6);if(a>-80&&a<W+80&&b>-80&&b<H+80)hole(a,b,(44+Math.sin(tt*7+sh.x)*2)*c.zoom,0.9);}
    for(const q of w.portals)if(w.portalActive){const[a,b]=worldToScreen(q.x*TS+8,q.y*TS+8);hole(a,b,40*c.zoom,0.8);}
    if(w.boss.alive){const[a,b]=worldToScreen(w.boss.x*TS+8,w.boss.y*TS);hole(a,b,30*c.zoom,0.5);}
    g.globalCompositeOperation='source-over';ctx.drawImage(dk,0,0);}
  if(w.L.theme==='mire'&&!SET.particles){ctx.save();ctx.fillStyle='rgba(180,190,160,0.08)';ctx.fillRect(0,0,W,H);ctx.restore();}
  _wDrawParticles();
  _wHud();
}
function _wHud(){
  const w=world,c=w.cam;
  ctx.save();
  const name=w.L.roman+'. '+L2(w.L.name),gold=t('w_gold',game?game.gold:0);
  ctx.font=typeof FONT!=='undefined'?FONT:'8px monospace';
  const bw=Math.max(ctx.measureText(name).width,ctx.measureText(gold).width)+16;
  panel(4,4,bw,30,{dark:true,alpha:0.85,r:6});
  _wText(name,12,9,'#f3d27a');_wText(gold,12,21,'#e8f0ff');
  // compass when rotated
  const rr=((c.rot%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  if(rr>0.02&&rr<2*Math.PI-0.02){const cx=4+bw+14,cy=19;ctx.fillStyle='rgba(8,16,44,0.85)';ctx.beginPath();ctx.arc(cx,cy,10,0,7);ctx.fill();
    ctx.strokeStyle='rgba(190,215,255,0.6)';ctx.lineWidth=1;ctx.stroke();
    ctx.translate(cx,cy);ctx.rotate(c.rot);ctx.fillStyle='#e04040';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(3,0);ctx.lineTo(-3,0);ctx.closePath();ctx.fill();
    ctx.fillStyle='#e8f0ff';ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(3,0);ctx.lineTo(-3,0);ctx.closePath();ctx.fill();ctx.setTransform(RS,0,0,RS,0,0);}
  if(Math.abs(c.zoom-1)>0.02){_wText('×'+c.zoom.toFixed(1),4,37,'#9fb3d6');}
  // mouse HUD buttons
  if(_wHudVisible()){for(const b of _wHudBtns){const hv=w.hoverHud===b.k;
    ctx.fillStyle=hv?'rgba(60,110,200,0.9)':'rgba(8,16,44,0.75)';ctx.fillRect(b.x,b.y,16,16);ctx.strokeStyle='rgba(190,215,255,0.6)';ctx.strokeRect(b.x+0.5,b.y+0.5,15,15);
    ctx.fillStyle='#e8f0ff';const x=b.x,y=b.y;
    if(b.k==='menu'){ctx.fillRect(x+4,y+4,8,2);ctx.fillRect(x+4,y+7,8,2);ctx.fillRect(x+4,y+10,8,2);}
    else if(b.k==='in'){ctx.fillRect(x+4,y+7,8,2);ctx.fillRect(x+7,y+4,2,8);}
    else if(b.k==='out'){ctx.fillRect(x+4,y+7,8,2);}
    else{ctx.strokeStyle='#e8f0ff';ctx.beginPath();ctx.arc(x+8,y+8,4,0,7);ctx.stroke();ctx.fillRect(x+7,y+7,2,2);}}}
  // control hint on first realm
  if(w.li===0&&game&&!game.cleared.length&&!ui.length){
    const s=_wHintLine();ctx.font=typeof FONT!=='undefined'?FONT:'8px monospace';const tw=ctx.measureText(s).width,k=Math.min(1,(W-16)/(tw||1));
    ctx.fillStyle='rgba(4,7,15,0.6)';ctx.fillRect(W/2-tw*k/2-6,H-15,tw*k+12,13);
    ctx.save();ctx.translate(W/2,H-12);ctx.scale(k,1);_wText(s,0,0,'#e8f0ff','center');ctx.restore();}
  ctx.restore();
}
function _wHintLine(){
  let d=SET.controlHints&&SET.controlHints!=='auto'?SET.controlHints:(typeof lastDevice!=='undefined'?lastDevice:'keyboard');
  if(d==='mouse')return t('w_hint_mouse');if(d==='touch')return t('w_hint_touch');if(d==='pad')return t('w_hint_pad');
  const k=a=>{const c=SET.keys&&SET.keys[a]&&SET.keys[a].find(Boolean);if(!c)return'?';try{return typeof keyName==='function'?keyName(c):c;}catch(e){return c;}};
  const mv=SET.keys&&SET.keys.up&&SET.keys.up.includes('KeyW')?'WASD':'↑↓←→';
  return t('w_hint_kb',mv,k('ok'),k('run'),k('rotL'),k('rotR'),k('menu'));
}

// ---------------- story / ending ----------------
let _wStars=null;
function storyRender(){
  const tt=now();
  const g=ctx.createRadialGradient(W/2,H*0.35,10,W/2,H*0.4,W*0.7);
  g.addColorStop(0,scene==='ending'?'#3a4a8a':'#1b2f6b');g.addColorStop(0.5,'#0a1230');g.addColorStop(1,'#04070f');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(!_wStars){const r=RNG(777);_wStars=[];for(let i=0;i<110;i++)_wStars.push({x:r()*W,y:r()*H,s:r(),p:r()*6.28});}
  ctx.save();
  for(const s of _wStars){ctx.globalAlpha=0.35+0.65*Math.abs(Math.sin(tt*(0.6+s.s)+s.p));ctx.fillStyle=s.s>0.85?'#ffe8b0':'#dfe8ff';
    ctx.fillRect(s.x|0,s.y|0,s.s>0.9?2:1,s.s>0.9?2:1);}
  ctx.globalAlpha=1;
  // glowing crystal
  const cx=W/2,cy=88+Math.sin(tt*1.3)*4,pul=0.75+0.25*Math.sin(tt*2);
  const gl=ctx.createRadialGradient(cx,cy,2,cx,cy,70);gl.addColorStop(0,'rgba(170,220,255,'+(0.55*pul)+')');gl.addColorStop(0.4,'rgba(90,150,255,'+(0.22*pul)+')');gl.addColorStop(1,'rgba(40,60,160,0)');
  ctx.fillStyle=gl;ctx.beginPath();ctx.arc(cx,cy,70,0,7);ctx.fill();
  ctx.translate(cx,cy);
  const pts=[[0,-26],[11,-8],[8,16],[0,24],[-8,16],[-11,-8]];
  ctx.fillStyle='#7fc0ff';ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();
  ctx.fillStyle='#c8ecff';ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(11,-8);ctx.lineTo(0,-2);ctx.lineTo(-11,-8);ctx.closePath();ctx.fill();
  ctx.fillStyle='#4a84e0';ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(8,16);ctx.lineTo(0,24);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffffff';ctx.globalAlpha=0.5+0.5*Math.sin(tt*3);ctx.fillRect(-4,-16,2,6);
  ctx.globalAlpha=1;ctx.strokeStyle='rgba(230,245,255,0.8)';ctx.lineWidth=1;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.stroke();
  ctx.restore();
  // rising motes
  ctx.save();for(let i=0;i<14;i++){const ph=(tt*0.15+i/14)%1;ctx.globalAlpha=Math.sin(ph*Math.PI)*0.8;ctx.fillStyle='#bfe4ff';
    ctx.fillRect((cx+Math.sin(i*2.3+tt*0.5)*60)|0,(150-ph*120)|0,1,1);}ctx.restore();
}
async function playEnding(){
  _wBusy++;
  try{
    await transition('in');
    scene='ending';world=null;
    try{playMusic('ending');}catch(e){}
    await transition('out');
    for(const k of['w_epi1','w_epi2','w_epi3','w_epi4'])await say(t(k));
    game.won=true;autoSave();
    if(typeof showCredits==='function')await showCredits({ending:true});
    if(typeof showTitle==='function')showTitle();
  }catch(e){console.error(e);}
  finally{_wBusy--;}
}
