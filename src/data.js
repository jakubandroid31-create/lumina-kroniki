// ===================== DATA (types, moves, species, items, levels, themes) =====================
addStrings({}, {});

const TYPES=['normal','fire','water','grass','volt','ice','earth','shadow','light'];
const TYPE_COL={normal:'#a8a29a',fire:'#f0703a',water:'#4a8ff0',grass:'#5cc04a',volt:'#f4d03a',ice:'#8fe0f0',earth:'#b88a4a',shadow:'#6a4a9a',light:'#fff0a0'};
const TYPE_N={normal:['Zwykły','Normal'],fire:['Ogień','Fire'],water:['Woda','Water'],grass:['Roślina','Grass'],volt:['Wolt','Volt'],
  ice:['Lód','Ice'],earth:['Ziemia','Earth'],shadow:['Cień','Shadow'],light:['Światło','Light']};
const _EFF={
  fire:{grass:2,ice:2,water:0.5,earth:0.5,fire:0.5},
  water:{fire:2,earth:2,grass:0.5,water:0.5},
  grass:{water:2,earth:2,fire:0.5,grass:0.5,ice:0.5},
  volt:{water:2,earth:0.5,volt:0.5},
  ice:{grass:2,earth:2,fire:0.5,ice:0.5},
  earth:{fire:2,volt:2,water:0.5,grass:0.5},
  shadow:{light:2,shadow:0.5},
  light:{shadow:2,light:0.5}
};
function effOf(a,d){const r=_EFF[a];return (r&&r[d])||1;}
const STG=[0.5,0.67,1,1.5,2];

// ---------- MOVES ----------
const MOVES={
  tackle:{n:['Szarża','Tackle'],t:'normal',p:40,a:100,ep:0},
  quick:{n:['Błysk','Quick Dash'],t:'normal',p:35,a:100,ep:3,prio:1},
  slam:{n:['Taran','Slam'],t:'normal',p:75,a:95,ep:5},
  megaslam:{n:['Megataran','Mega Slam'],t:'normal',p:110,a:85,ep:9},
  ember:{n:['Iskra Żaru','Ember'],t:'fire',p:40,a:100,ep:3,st:['burn',10]},
  flameburst:{n:['Wybuch Płomieni','Flame Burst'],t:'fire',p:65,a:100,ep:5,st:['burn',15]},
  inferno:{n:['Piekło','Inferno'],t:'fire',p:95,a:90,ep:9,st:['burn',20]},
  bubble:{n:['Bąbelki','Bubble'],t:'water',p:40,a:100,ep:3},
  aquajet:{n:['Wodny Strumień','Aqua Jet'],t:'water',p:65,a:100,ep:5},
  tidalwave:{n:['Fala Przypływu','Tidal Wave'],t:'water',p:95,a:90,ep:9},
  leafcut:{n:['Cięcie Liściem','Leaf Cut'],t:'grass',p:40,a:100,ep:3},
  vinelash:{n:['Smagnięcie Pnączem','Vine Lash'],t:'grass',p:65,a:100,ep:5},
  solarblade:{n:['Słoneczne Ostrze','Solar Blade'],t:'grass',p:95,a:90,ep:9},
  spark:{n:['Iskra','Spark'],t:'volt',p:40,a:100,ep:3,st:['para',10]},
  voltbolt:{n:['Grom Wolt','Volt Bolt'],t:'volt',p:65,a:100,ep:5,st:['para',15]},
  thunderclap:{n:['Huk Gromu','Thunderclap'],t:'volt',p:95,a:85,ep:9,st:['para',20]},
  frostbite:{n:['Odmrożenie','Frostbite'],t:'ice',p:40,a:100,ep:3,st:['frz',8]},
  icelance:{n:['Lodowa Włócznia','Ice Lance'],t:'ice',p:65,a:100,ep:5,st:['frz',10]},
  blizzard:{n:['Zamieć','Blizzard'],t:'ice',p:95,a:85,ep:9,st:['frz',15]},
  pebble:{n:['Rzut Kamykiem','Pebble Toss'],t:'earth',p:40,a:100,ep:3},
  mudslide:{n:['Lawina Błota','Mudslide'],t:'earth',p:65,a:95,ep:5},
  quake:{n:['Wstrząs','Quake'],t:'earth',p:95,a:90,ep:9},
  shade:{n:['Muśnięcie Cienia','Shade Touch'],t:'shadow',p:40,a:100,ep:3},
  nightclaw:{n:['Nocny Pazur','Night Claw'],t:'shadow',p:65,a:100,ep:5},
  darkpulse:{n:['Mroczny Puls','Dark Pulse'],t:'shadow',p:95,a:90,ep:9,st:['poison',15]},
  glint:{n:['Błysk Światła','Glint'],t:'light',p:40,a:100,ep:3},
  radiant:{n:['Promienistość','Radiance'],t:'light',p:65,a:100,ep:5},
  sunflare:{n:['Rozbłysk Słońca','Sunflare'],t:'light',p:95,a:90,ep:9,st:['burn',10]},
  focus:{n:['Skupienie','Focus'],t:'normal',p:0,ep:3,buff:['atk',1]},
  harden:{n:['Utwardzenie','Harden'],t:'normal',p:0,ep:3,buff:['def',1]},
  roar:{n:['Ryk','Roar'],t:'normal',p:0,a:100,ep:3,debuff:['def',-1]},
  spore:{n:['Usypiające Zarodniki','Sleep Spore'],t:'grass',p:0,a:75,ep:5,st:['sleep',100]},
  toxin:{n:['Toksyna','Toxin'],t:'shadow',p:0,a:90,ep:5,st:['poison',100]},
  mend:{n:['Uleczenie','Mend'],t:'light',p:0,ep:6,heal:0.5},
  eclipse:{n:['Zaćmienie','Eclipse'],t:'shadow',p:120,a:90,ep:10}
};
const TYPE_MOVES={normal:['quick','slam','megaslam'],fire:['ember','flameburst','inferno'],water:['bubble','aquajet','tidalwave'],
  grass:['leafcut','vinelash','solarblade'],volt:['spark','voltbolt','thunderclap'],ice:['frostbite','icelance','blizzard'],
  earth:['pebble','mudslide','quake'],shadow:['shade','nightclaw','darkpulse'],light:['glint','radiant','sunflare']};

// ---------- SPECIES ----------
const SPECIES={};
function _sp(id,t,c,b,x,cr,evo,boss){SPECIES[id]={id,name:id.charAt(0).toUpperCase()+id.slice(1),t,c:c||null,b,x,cr,evo:evo||null,boss:!!boss};}
// starters
_sp('embrix','fire','earth',[44,52,40,50],62,0.2,[16,'pyrhound']);
_sp('pyrhound','fire','earth',[62,72,56,66],142,0.15,[34,'infernyx']);
_sp('infernyx','fire','earth',[82,98,74,86],240,0.1);
_sp('aquapup','water','ice',[50,46,48,42],62,0.2,[16,'tidalisk']);
_sp('tidalisk','water','ice',[70,64,68,58],142,0.15,[34,'leviathorn']);
_sp('leviathorn','water','ice',[94,86,90,76],240,0.1);
_sp('leafin','grass','light',[47,48,46,48],62,0.2,[16,'thornwing']);
_sp('thornwing','grass','light',[66,66,64,64],142,0.15,[34,'sylvagon']);
_sp('sylvagon','grass','light',[88,90,86,82],240,0.1);
// wild
_sp('pipkit','normal',null,[38,42,34,52],42,0.65);
_sp('fluffet','normal','light',[46,36,40,38],45,0.6,[18,'fluffaroo']);
_sp('fluffaroo','normal','light',[74,66,62,58],140,0.35);
_sp('buzzle','volt',null,[36,44,32,56],48,0.6,[20,'voltbuzz']);
_sp('voltbuzz','volt','grass',[58,72,52,80],145,0.35);
_sp('sproutle','grass',null,[42,40,44,36],46,0.6);
_sp('mossnake','grass','earth',[54,58,50,56],62,0.5);
_sp('shroomy','grass','shadow',[56,48,56,34],64,0.5);
_sp('gemmite','earth','light',[50,54,72,38],68,0.45);
_sp('rocklet','earth',null,[52,58,68,30],62,0.5,[25,'bouldron']);
_sp('bouldron','earth','fire',[80,86,98,40],150,0.3);
_sp('batwing','shadow',null,[44,48,38,62],52,0.55);
_sp('crabbit','water','earth',[54,64,66,44],68,0.5);
_sp('gullip','water','volt',[52,56,46,70],66,0.5);
_sp('shellby','water','ice',[62,50,78,36],70,0.45);
_sp('sandvip','earth','shadow',[60,74,58,70],70,0.45);
_sp('sunbeak','light','fire',[58,68,54,74],70,0.45);
_sp('cactoon','grass','earth',[70,66,74,40],70,0.45);
_sp('magmole','fire','earth',[64,72,66,48],70,0.45);
_sp('cindrake','fire','shadow',[70,84,64,76],150,0.3);
_sp('ashling','fire','light',[60,70,58,72],70,0.4);
_sp('frostel','ice','water',[66,72,64,74],70,0.4);
_sp('snowpaw','ice',null,[72,76,66,62],70,0.4);
_sp('glacieron','ice','earth',[90,90,96,50],160,0.3);
_sp('wispyre','shadow','fire',[64,82,60,84],72,0.4);
_sp('ghoulip','shadow','water',[78,76,72,60],72,0.4);
_sp('bogtoad','water','shadow',[82,74,76,56],72,0.4);
_sp('zephyra','light','volt',[74,82,70,92],74,0.35);
_sp('stormane','volt','water',[80,92,74,90],160,0.3);
_sp('nimbo','water','volt',[84,78,80,70],74,0.35);
_sp('duskknight','shadow','earth',[86,96,92,72],165,0.25);
_sp('haloth','light','ice',[84,88,86,80],160,0.3);
_sp('voidling','shadow',null,[80,98,78,96],165,0.25);
// bosses
_sp('tuskor','normal','earth',[100,62,56,44],200,0,null,true);
_sp('elderoak','grass','earth',[108,66,70,40],220,0,null,true);
_sp('crystalisk','earth','light',[110,74,88,46],240,0,null,true);
_sp('krakenna','water','shadow',[116,82,80,58],260,0,null,true);
_sp('pharaxis','light','fire',[118,88,84,70],280,0,null,true);
_sp('volcanox','fire','earth',[124,96,90,62],300,0,null,true);
_sp('yetiron','ice','earth',[132,100,96,64],320,0,null,true);
_sp('mirequeen','shadow','water',[134,104,98,80],340,0,null,true);
_sp('tempestra','volt','light',[136,110,98,96],360,0,null,true);
_sp('eclipsor','shadow','light',[150,116,108,92],380,0,null,true);
_sp('eclipsor2','light','shadow',[170,124,114,100],400,0,null,true);
SPECIES.eclipsor2.name='Eclipsor';
const STARTERS=['embrix','aquapup','leafin'];

// ---------- LEARNSETS ----------
const _lsCache={};
function learnset(id){
  if(_lsCache[id])return _lsCache[id];
  const s=SPECIES[id];if(!s)return[[1,'tackle']];
  const m=TYPE_MOVES[s.t]||TYPE_MOVES.normal,c=s.c?TYPE_MOVES[s.c]:null;
  const extra=s.t==='grass'?'spore':s.t==='shadow'?'toxin':s.t==='light'?'mend':'roar';
  const raw=[[1,'tackle'],[1,m[0]],[6,s.b[1]>=s.b[2]?'focus':'harden'],[12,m[1]],[19,c?c[0]:'roar'],[26,extra],[33,m[2]],
    [40,c?c[1]:'slam'],[48,c?c[2]:'megaslam']];
  if(id==='eclipsor'||id==='eclipsor2')raw.push([50,'eclipse']);
  const seen={},out=[];
  for(const e of raw){if(seen[e[1]])continue;seen[e[1]]=1;out.push(e);}
  return(_lsCache[id]=out);
}
function _mvScore(id){const m=MOVES[id];if(!m)return 0;if(id==='tackle')return 30;if(m.heal)return 70;if(!m.p)return 45;return m.p;}
function learnMove(mon,id){
  if(!MOVES[id]||mon.moves.indexOf(id)>=0)return{learned:false,forgot:null};
  if(mon.moves.length<4){mon.moves.push(id);return{learned:true,forgot:null};}
  let wi=0;for(let i=1;i<mon.moves.length;i++)if(_mvScore(mon.moves[i])<_mvScore(mon.moves[wi]))wi=i;
  if(_mvScore(id)>_mvScore(mon.moves[wi])){const f=mon.moves[wi];mon.moves[wi]=id;return{learned:true,forgot:f};}
  return{learned:false,forgot:null};
}
function expFor(l){return Math.floor(0.8*l*l*l);}
function stats(mon){
  const s=SPECIES[mon.sp],b=s?s.b:[40,40,40,40],lv=mon.lv,mu=mon.mul||{};
  const st={hp:Math.floor(b[0]*lv/50)+lv+10,atk:Math.floor(b[1]*lv/50)+5,def:Math.floor(b[2]*lv/50)+5,spd:Math.floor(b[3]*lv/50)+5,ep:12+lv};
  if(mu.hp)st.hp=Math.max(1,Math.floor(st.hp*mu.hp));
  if(mu.atk)st.atk=Math.max(1,Math.floor(st.atk*mu.atk));
  if(mu.def)st.def=Math.max(1,Math.floor(st.def*mu.def));
  return st;
}
function createMon(id,lv,mul){
  lv=clamp(lv|0,1,100);
  const mon={sp:id,lv,exp:expFor(lv),hp:1,ep:1,moves:[],st:null};
  if(mul)mon.mul=mul;
  for(const[l,m]of learnset(id)){if(l<=lv)learnMove(mon,m);}
  const s=stats(mon);mon.hp=s.hp;mon.ep=s.ep;
  return mon;
}
function monName(mon){if(!mon)return'';if(mon.nick)return mon.nick;const s=SPECIES[mon.sp];return s?s.name:String(mon.sp);}
function healMon(mon){const s=stats(mon);mon.hp=s.hp;mon.ep=s.ep;mon.st=null;}

// ---------- ITEMS ----------
const ITEMS={
  potion:{n:['Mikstura','Potion'],d:['Przywraca 50 PŻ.','Restores 50 HP.'],price:30,heal:50,minLv:0},
  super:{n:['Supermikstura','Super Potion'],d:['Przywraca 150 PŻ.','Restores 150 HP.'],price:90,heal:150,minLv:2},
  max:{n:['Eliksir Pełni','Max Elixir'],d:['W pełni przywraca PŻ i PE.','Fully restores HP and EP.'],price:300,heal:9999,ep:9999,minLv:6},
  ether:{n:['Eter','Ether'],d:['Przywraca 15 PE.','Restores 15 EP.'],price:60,ep:15,minLv:0},
  revive:{n:['Wskrzeszenie','Revive'],d:['Przywraca omdlałe stworzenie z połową PŻ.','Revives a fainted creature with half HP.'],price:200,revive:0.5,minLv:2},
  cure:{n:['Panaceum','Cure-All'],d:['Leczy wszystkie dolegliwości.','Cures any status ailment.'],price:40,cure:true,minLv:0},
  orb:{n:['Kula Lumen','Lumen Orb'],d:['Służy do łapania dzikich stworzeń.','Used to catch wild creatures.'],price:40,catch:1,minLv:0},
  gorb:{n:['Wielka Kula','Great Orb'],d:['Łapie łatwiej niż zwykła kula.','Catches better than a regular orb.'],price:120,catch:1.75,minLv:3},
  uorb:{n:['Kula Zenitu','Zenith Orb'],d:['Najlepsza kula. Rzadko zawodzi.','The finest orb. Rarely fails.'],price:250,catch:2.5,minLv:6}
};
function shopStock(li){return Object.keys(ITEMS).filter(k=>ITEMS[k].minLv<=li);}
const DIFF=[{mul:0.85,xp:1.4,gold:1.2},{mul:1,xp:1,gold:1},{mul:1.15,xp:0.9,gold:0.9}];

// ---------- THEMES ----------
const THEMES={
  meadow:{floor:'#88d070',floor2:'#78c060',path:'#e0c890',wall:'tree',wallA:'#2f8a3a',wallB:'#1e6028',trunk:'#7a5030',
    grass:'#4aa83a',grass2:'#3a9030',water:'#58a8f0',deco:['flower','pebble'],bg:['#a8e0ff','#e8f8d0'],dark:false,particles:'petal',voidCol:'#1e6028'},
  forest:{floor:'#4a8a40',floor2:'#3f7a36',path:'#a08a58',wall:'tree',wallA:'#1f5a2a',wallB:'#123c1a',trunk:'#5a3a20',
    grass:'#2f7a2a',grass2:'#256622',water:'#3a78a8',deco:['mushroom','flower'],bg:['#5a9a70','#c0e0a0'],dark:false,particles:'firefly',voidCol:'#0c2a12'},
  cave:{floor:'#4a3c62',floor2:'#3e3256',path:'#6a5a82',wall:'rock',wallA:'#2a2040',wallB:'#18122a',trunk:'#3a2c50',
    grass:'#5a4a7a',grass2:'#4c3e6c',water:'#3a5aa0',deco:['crystal','pebble'],bg:['#1a1230','#4a3a6a'],dark:true,particles:'dust',voidCol:'#0c0818'},
  coast:{floor:'#f0e0a8',floor2:'#e6d498',path:'#d8c088',wall:'water',wallA:'#3a90d8',wallB:'#2a70b8',trunk:'#8a6a40',
    grass:'#7ac060',grass2:'#68ac50',water:'#3a90d8',deco:['shell','pebble'],bg:['#88d0ff','#f0f0d0'],dark:false,particles:'none',voidCol:'#2060a8'},
  desert:{floor:'#e8c880',floor2:'#dcb870',path:'#c8a060',wall:'rock',wallA:'#b07840',wallB:'#80542a',trunk:'#6a4a28',
    grass:'#b8b050',grass2:'#a49c44',water:'#48a8c0',deco:['cactus','skull','pebble'],bg:['#ffd890','#ffe8c0'],dark:false,particles:'dust',voidCol:'#6a4420'},
  volcano:{floor:'#4a3a36',floor2:'#3e302c',path:'#6a4a3a',wall:'lavarock',wallA:'#2a1e1c',wallB:'#e04a1a',trunk:'#1a1210',
    grass:'#5a4a2a',grass2:'#4a3c22',water:'#f06020',deco:['pebble','skull'],bg:['#3a1210','#c04a20'],dark:false,particles:'ember',voidCol:'#140a08'},
  snow:{floor:'#eef4fa',floor2:'#dde8f2',path:'#c8d4e0',wall:'pine',wallA:'#2a5a4a',wallB:'#1a3c32',trunk:'#5a4030',
    grass:'#b8d8e0',grass2:'#a4c8d4',water:'#88c0e8',deco:['snowrock','pebble'],bg:['#b8d0f0','#f4f8ff'],dark:false,particles:'snow',voidCol:'#1a3c32'},
  mire:{floor:'#4a5038',floor2:'#3e4430',path:'#5e5a40',wall:'deadtree',wallA:'#3a3028',wallB:'#221c18',trunk:'#2e2620',
    grass:'#4a6030',grass2:'#3c5028',water:'#3a4a3a',deco:['skull','mushroom','candle'],bg:['#2a3028','#5a6048'],dark:true,particles:'fog',voidCol:'#121410'},
  sky:{floor:'#f4f6ff',floor2:'#e2e8fa',path:'#ffe8a8',wall:'void',wallA:'#6a88d0',wallB:'#3a5098',trunk:'#c0c8e0',
    grass:'#c8e0ff',grass2:'#b4d0f8',water:'#8ab0f0',deco:['star','pebble'],bg:['#5a80e0','#d8e8ff'],dark:false,particles:'spark',voidCol:'#4a70c8'},
  citadel:{floor:'#4a4258',floor2:'#3e384c',path:'#6a5a72',wall:'brick',wallA:'#2e2838',wallB:'#1a1622',trunk:'#2a2230',
    grass:'#5a3a5a',grass2:'#4c304c',water:'#4a2a6a',deco:['candle','skull','star'],bg:['#140c22','#4a2a5a'],dark:true,particles:'ember',voidCol:'#08060c'}
};

// ---------- LEVELS ----------
function _tr(npl,nen,team,lv,pre,post){return{name:[npl,nen],team,lv,pre,post};}
const LEVELS=[
 {id:0,roman:'I',name:['Łąki Świtu','Dawnlight Meadows'],theme:'meadow',
  intro:['Pierwsze promienie świtu kładą się na łąkach, lecz w trawie czai się niepokój. Strażnik krainy, Tuskor, ryczy w gniewie, którego nie rozumie.',
   'The first rays of dawn spill across the meadows, yet unease stirs in the grass. Tuskor, the land\'s guardian, bellows in a rage it cannot understand.'],
  pool:['pipkit','fluffet','buzzle','sproutle','batwing'],lv:[3,5],boss:'tuskor',bossLv:8,
  bossLine:['Tuskor ryje ziemię kłami. W jego oczach gaśnie światło Kryształu...','Tuskor gouges the earth with its tusks. The Crystal\'s light flickers in its eyes...'],
  trainers:[
   _tr('Młody Kuba','Youngster Kuba',['pipkit','buzzle'],5,['Hej! Każdy Strażnik musi zacząć od walki ze mną!','Hey! Every Warden has to start by fighting me!'],['Ech, jesteś lepszy, niż myślałem.','Aw, you\'re better than I thought.']),
   _tr('Zielarka Ola','Herbalist Ola',['sproutle','fluffet','pipkit'],6,['Zbieram zioła, ale chętnie sprawdzę twoją drużynę.','I gather herbs, but I\'d love to test your team.'],['Ogień pali rośliny... zapamiętam to na przyszłość.','Fire burns plants... I\'ll keep that in mind.'])],
  lore:[
   ['Mówią, że dziesięć Kryształów Światła strzeże równowagi świata. Zaćmienie zatruło ich strażników.','They say ten Light Crystals keep the world in balance. The Eclipse has poisoned their guardians.'],
   ['Kapliczki z płonącym ogniem leczą drużynę i zapisują twoją wędrówkę. Odpoczywaj przy nich, Strażniku.','Shrines of burning flame heal your team and record your journey. Rest at them, Warden.'],
   ['Osłab dzikie stworzenie, nim rzucisz Kulą Lumen. Im mniej ma sił, tym łatwiej je złapać.','Weaken a wild creature before throwing a Lumen Orb. The less strength it has left, the easier the catch.']],
  music:'lvl1'},
 {id:1,roman:'II',name:['Szepczący Las','Whispering Woods'],theme:'forest',
  intro:['Prastare drzewa szepczą między sobą o cieniu, który zakradł się do ich korzeni. Pradąb, ich opiekun, zamilkł.',
   'Ancient trees whisper of a shadow that crept into their roots. Elderoak, their keeper, has fallen silent.'],
  pool:['sproutle','mossnake','shroomy','buzzle','fluffet','batwing'],lv:[7,10],boss:'elderoak',bossLv:13,
  bossLine:['Gałęzie Elderoaka trzeszczą jak kości. Las nie pozwoli ci przejść!','Elderoak\'s branches creak like bones. The forest will not let you pass!'],
  trainers:[
   _tr('Leśniczy Marek','Ranger Marek',['mossnake','buzzle'],10,['Las jest niespokojny. Udowodnij, że możesz go ocalić.','The woods are restless. Prove you can save them.'],['Masz w sobie światło. Ruszaj dalej.','You carry the light. Go on.']),
   _tr('Grzybiarka Basia','Forager Basia',['shroomy','sproutle','batwing'],11,['Moje grzybki usypiają każdego! Uważaj na zarodniki!','My mushrooms put anyone to sleep! Beware the spores!'],['No proszę, nie zasnąłeś...','Well now, you didn\'t doze off...'])],
  lore:[
   ['Rośliny boją się ognia i lodu, ale woda i ziemia im nie straszne.','Plants fear fire and ice, but water and earth do them no harm.'],
   ['Kiedyś Elderoak śpiewał lasowi kołysanki. Od czasu Zaćmienia słychać tylko jęk.','Elderoak once sang lullabies to the forest. Since the Eclipse, there is only moaning.'],
   ['Skrzynie w gąszczu kryją mikstury i złoto. Warto zboczyć ze ścieżki.','Chests hidden in the thicket hold potions and gold. Straying from the path pays off.']],
  music:'lvl2'},
 {id:2,roman:'III',name:['Kryształowe Jaskinie','Crystal Caverns'],theme:'cave',
  intro:['W głębi skał kryształy pulsują chorym, fioletowym blaskiem. Ciemność oddycha tu razem z tobą.',
   'Deep within the rock, crystals pulse with a sickly violet glow. Here the darkness breathes along with you.'],
  pool:['gemmite','rocklet','batwing','magmole','shroomy'],lv:[11,14],boss:'crystalisk',bossLv:17,
  bossLine:['Crystalisk rozkłada lśniące łuski. Każda odbija twój strach.','Crystalisk spreads its glittering scales. Each one reflects your fear.'],
  trainers:[
   _tr('Górnik Staszek','Miner Staszek',['rocklet','gemmite'],14,['Kopię tu od lat, a takiego blasku nigdy nie widziałem!','I\'ve dug here for years and never seen such a glow!'],['Ziemia nie lubi wody, zapamiętaj.','Earth hates water, remember that.']),
   _tr('Grotołazka Ewa','Spelunker Ewa',['batwing','magmole','gemmite'],15,['W ciemności wygrywa ten, kto widzi więcej!','In the dark, whoever sees more wins!'],['Twoje oczy są bystrzejsze niż moje.','Your eyes are sharper than mine.'])],
  lore:[
   ['Ziemia gasi ogień i uziemia wolt, ale woda i rośliny ją kruszą.','Earth smothers fire and grounds volt, but water and plants wear it down.'],
   ['Górnicy szeptali, że Crystalisk strzeże trzeciego Kryształu od tysiąca lat.','Miners whispered that Crystalisk has guarded the third Crystal for a thousand years.'],
   ['W ciemnych korytarzach kapliczka to jedyne pewne światło. Nie pomijaj jej.','In dark tunnels a shrine is the only sure light. Do not pass it by.']],
  music:'lvl3'},
 {id:3,roman:'IV',name:['Wybrzeże Mew','Gullwing Coast'],theme:'coast',
  intro:['Fale biją o piaszczysty brzeg, a mewy krzyczą ostrzegawczo. Z głębin wynurza się coś ogromnego.',
   'Waves pound the sandy shore and gulls cry in warning. Something vast is rising from the deep.'],
  pool:['crabbit','gullip','shellby','voltbuzz','fluffaroo'],lv:[15,18],boss:'krakenna',bossLv:21,
  bossLine:['Macki Krakenny oplatają skały. Morze ryczy jej głosem!','Krakenna\'s tentacles coil around the rocks. The sea roars with her voice!'],
  trainers:[
   _tr('Rybak Zbyszek','Fisherman Zbyszek',['crabbit','shellby'],18,['Dziś nie biorą ryby, to chociaż powalczę!','The fish aren\'t biting, so let\'s battle instead!'],['Wolt i rośliny to zmora wodnych stworów.','Volt and plants are the bane of water creatures.']),
   _tr('Żeglarka Magda','Sailor Magda',['gullip','voltbuzz','crabbit'],19,['Wiatr mi sprzyja! Gotów na sztorm?','The wind is with me! Ready for a storm?'],['Uff, zmiotłeś mnie z pokładu.','Phew, you swept me off the deck.'])],
  lore:[
   ['Woda gasi ogień i podmywa ziemię, lecz nie znosi wolta ani roślin.','Water douses fire and erodes earth, but it cannot abide volt or plants.'],
   ['Rybacy mówią, że Krakenna kiedyś prowadziła statki do portu. Teraz je zatapia.','Fishermen say Krakenna once guided ships to harbor. Now she sinks them.'],
   ['Wielkie Kule łapią pewniej niż zwykłe. Szukaj ich w sklepach.','Great Orbs catch more reliably than plain ones. Look for them in shops.']],
  music:'lvl4'},
 {id:4,roman:'V',name:['Pustynia Słońca','Sunscar Desert'],theme:'desert',
  intro:['Słońce bezlitośnie pali piaski, a ruiny dawnych świątyń drżą w rozgrzanym powietrzu. Nawet światło może zbłądzić.',
   'The sun scorches the sands without mercy, and old temple ruins shimmer in the heat. Even light can lose its way.'],
  pool:['sandvip','sunbeak','cactoon','rocklet','bouldron'],lv:[19,23],boss:'pharaxis',bossLv:26,
  bossLine:['Pharaxis unosi złote skrzydła. Jego blask oślepia, ale serce ma czarne.','Pharaxis raises its golden wings. Its radiance blinds, but its heart is black.'],
  trainers:[
   _tr('Wędrowiec Józef','Wanderer Józef',['sandvip','cactoon'],23,['Pustynia testuje każdego. Teraz moja kolej.','The desert tests everyone. Now it\'s my turn.'],['Masz w sobie więcej wody niż oaza.','You hold more grit than an oasis holds water.']),
   _tr('Archeolożka Iza','Archaeologist Iza',['sunbeak','bouldron','sandvip'],24,['Te ruiny pamiętają Pierwszych Strażników!','These ruins remember the First Wardens!'],['Może i ty trafisz kiedyś na te freski.','Perhaps one day you too will appear in these murals.'])],
  lore:[
   ['Światło i cień ranią się nawzajem najmocniej. Każde z nich jest słabe wobec samego siebie.','Light and shadow wound each other most. Each is weak against its own kind.'],
   ['Na freskach widać Strażnika, który zgasił pierwsze Zaćmienie. Ma twoją twarz?','The murals show a Warden who quelled the first Eclipse. Do they bear your face?'],
   ['Gdy drużyna słabnie, wróć do kapliczki. Śmierć odbiera część złota.','When your team weakens, return to a shrine. Death takes a share of your gold.']],
  music:'lvl5'},
 {id:5,roman:'VI',name:['Wulkan Popiołów','Ashen Volcano'],theme:'volcano',
  intro:['Niebo zasnuł popiół, a ziemia pęka od żaru. Serce wulkanu bije coraz szybciej.',
   'Ash veils the sky and the ground cracks with heat. The volcano\'s heart beats ever faster.'],
  pool:['magmole','cindrake','ashling','bouldron','gemmite'],lv:[24,28],boss:'volcanox',bossLv:31,
  bossLine:['Volcanox wyłania się z lawy, a skały topnieją pod jego krokami!','Volcanox rises from the lava, and stone melts beneath its steps!'],
  trainers:[
   _tr('Kowal Bogdan','Smith Bogdan',['magmole','bouldron'],28,['Hartuję stal w lawie. Zobaczmy, czy ty też się nie złamiesz.','I temper steel in lava. Let\'s see if you crack.'],['Twarda z ciebie sztuka.','You\'re made of tough stuff.']),
   _tr('Ogniomistrzyni Kasia','Firedancer Kasia',['cindrake','ashling','magmole'],29,['Mój taniec płomieni spali twoją drużynę!','My flame dance will burn your team to cinders!'],['Zgasiłeś mój ogień... na razie.','You\'ve put out my fire... for now.'])],
  lore:[
   ['Ogień topi lód i spala rośliny, ale woda i ziemia go duszą.','Fire melts ice and burns plants, but water and earth smother it.'],
   ['Panaceum leczy oparzenia i trucizny. Weź ich kilka przed starciem z Volcanoxem.','A Cure-All heals burns and poison. Bring a few before facing Volcanox.'],
   ['Sześć Kryształów odzyskało blask. Zaćmienie czuje, że się zbliżasz.','Six Crystals shine again. The Eclipse can feel you drawing near.']],
  music:'lvl6'},
 {id:6,roman:'VII',name:['Mroźne Szczyty','Frostpeak Heights'],theme:'snow',
  intro:['Lodowy wiatr wyje między sosnami, a śnieg zasypuje dawne szlaki. Gdzieś na szczycie ryczy Yetiron.',
   'An icy wind howls among the pines, and snow buries the old trails. Somewhere on the summit, Yetiron roars.'],
  pool:['frostel','snowpaw','glacieron','shellby','haloth'],lv:[29,33],boss:'yetiron',bossLv:36,
  bossLine:['Yetiron uderza pięściami w lód. Lawina nadchodzi!','Yetiron pounds the ice with its fists. An avalanche is coming!'],
  trainers:[
   _tr('Alpinista Wojtek','Climber Wojtek',['snowpaw','frostel'],33,['Na tej wysokości liczy się tylko siła!','At this altitude, only strength matters!'],['Ogień to najlepszy przyjaciel w górach.','Fire is a climber\'s best friend.']),
   _tr('Pustelniczka Hania','Hermit Hania',['glacieron','haloth','shellby'],34,['Od lat medytuję w śniegu. Przerwałeś mi.','I\'ve meditated in the snow for years. You interrupted me.'],['Twój duch jest gorący jak płomień.','Your spirit burns like a flame.'])],
  lore:[
   ['Lód mrozi rośliny i ziemię, lecz ogień topi go bez trudu.','Ice freezes plants and earth, but fire melts it with ease.'],
   ['Zamrożone stworzenie nie ruszy się przez kilka tur. Panaceum je rozmrozi.','A frozen creature cannot move for a few turns. A Cure-All will thaw it.'],
   ['Kule Zenitu sprzedają tylko w najdalszych krainach. Są warte każdej monety.','Zenith Orbs are sold only in the farthest lands. They are worth every coin.']],
  music:'lvl7'},
 {id:7,roman:'VIII',name:['Nawiedzone Mokradła','Haunted Mire'],theme:'mire',
  intro:['Mgła kłębi się nad czarną wodą, a martwe drzewa wyciągają ku tobie gałęzie. Tu Zaćmienie jest najsilniejsze.',
   'Fog coils above black water, and dead trees reach for you with their branches. Here the Eclipse is strongest.'],
  pool:['wispyre','ghoulip','bogtoad','mossnake','shroomy','duskknight'],lv:[34,38],boss:'mirequeen',bossLv:41,
  bossLine:['Królowa Mokradeł unosi się z bagna w koronie z kości. „Dołącz do cienia...”','The Mire Queen rises from the bog in a crown of bone. "Join the shadow..."'],
  trainers:[
   _tr('Medium Lucjan','Medium Lucjan',['wispyre','ghoulip'],38,['Duchy szepczą mi twoje imię...','The spirits whisper your name to me...'],['Duchy... ucichły.','The spirits... have gone quiet.']),
   _tr('Wiedźma Jadwiga','Witch Jadwiga',['bogtoad','shroomy','duskknight'],39,['Moje mikstury są groźniejsze niż twoje!','My brews are deadlier than yours!'],['Hmpf. Światło wciąż w tobie płonie.','Hmph. The light still burns in you.'])],
  lore:[
   ['Cień ustępuje tylko przed światłem. Stworzenia światła są tu na wagę złota.','Shadow yields only to light. Creatures of light are worth their weight in gold here.'],
   ['Trucizna sączy siły co turę. Nie lekceważ jej w długiej walce.','Poison drains strength each turn. Never ignore it in a long fight.'],
   ['Królowa Mokradeł była niegdyś uzdrowicielką. Zaćmienie wykrzywiło jej dar.','The Mire Queen was once a healer. The Eclipse twisted her gift.']],
  music:'lvl8'},
 {id:8,roman:'IX',name:['Wieża Niebios','Skyward Spire'],theme:'sky',
  intro:['Kamienne mosty wiszą nad przepaścią chmur, a pioruny rozdzierają niebo. Burza nie ustaje od czasu Zaćmienia.',
   'Stone bridges hang above an abyss of clouds, and lightning tears the sky apart. The storm has raged since the Eclipse.'],
  pool:['zephyra','stormane','nimbo','gullip','voltbuzz','haloth'],lv:[39,43],boss:'tempestra',bossLv:46,
  bossLine:['Tempestra rozkłada skrzydła z błyskawic. Niebo drży!','Tempestra spreads wings of lightning. The heavens tremble!'],
  trainers:[
   _tr('Lotnik Tadeusz','Aviator Tadeusz',['zephyra','gullip'],43,['Z tej wysokości widać cały świat. I twoją porażkę!','From up here you can see the whole world. And your defeat!'],['Ziemia uziemia pioruny... sprytnie.','Earth grounds lightning... clever.']),
   _tr('Burzowa Zosia','Stormcaller Zosia',['stormane','nimbo','voltbuzz'],44,['Przywołam burzę, która cię zdmuchnie!','I\'ll summon a storm to blow you away!'],['Nawet burza musi kiedyś ucichnąć.','Even a storm must calm someday.'])],
  lore:[
   ['Wolt razi wodę, ale ziemia pochłania jego moc bez śladu.','Volt shocks water, but earth swallows its power without a trace.'],
   ['Ze szczytu wieży widać Cytadelę Zmierzchu. Tam narodziło się Zaćmienie.','From the spire\'s top you can see the Twilight Citadel. That is where the Eclipse was born.'],
   ['Sparaliżowane stworzenie czasem nie może się ruszyć. Lecz je, zanim będzie za późno.','A paralyzed creature sometimes cannot move. Cure it before it is too late.']],
  music:'lvl9'},
 {id:9,roman:'X',name:['Cytadela Zmierzchu','Twilight Citadel'],theme:'citadel',
  intro:['Czarne mury Cytadeli wchłaniają każdy promień. W jej sercu Eclipsor czeka na ostatniego Strażnika.',
   'The Citadel\'s black walls drink in every ray. At its heart, Eclipsor awaits the last Warden.'],
  pool:['duskknight','haloth','voidling','cindrake','glacieron','stormane'],lv:[44,48],boss:'eclipsor',bossLv:52,boss2:'eclipsor2',boss2Lv:54,
  bossLine:['„Dziewięć Kryształów... i co z tego? Ja JESTEM Zaćmieniem!” Eclipsor zasłania niebo.','"Nine Crystals... so what? I AM the Eclipse!" Eclipsor blots out the sky.'],
  trainers:[
   _tr('Rycerz Cienia Roch','Shadow Knight Roch',['duskknight','voidling'],48,['Przysięgałem bronić Cytadeli. Nawet przed tobą.','I swore to defend the Citadel. Even from you.'],['Może... to ty jesteś prawdziwym światłem.','Perhaps... you are the true light.']),
   _tr('Upadła Strażniczka Wanda','Fallen Warden Wanda',['haloth','cindrake','glacieron'],49,['Też kiedyś byłam Strażniczką. Zaćmienie było silniejsze.','I was a Warden once, too. The Eclipse was stronger.'],['Dziękuję... czuję znów ciepło. Pokonaj go.','Thank you... I feel warmth again. Defeat him.'])],
  lore:[
   ['Eclipsor ma dwie twarze: cień i światło. Gdy jedna upadnie, objawi się druga.','Eclipsor has two faces: shadow and light. When one falls, the other will reveal itself.'],
   ['Przygotuj drużynę różnych typów. Ostatnia walka nie wybacza błędów.','Prepare a team of many types. The final battle forgives no mistakes.'],
   ['Ostatnia kapliczka płonie tuż przed tronem. Odpocznij, Strażniku. Świat na ciebie czeka.','The last shrine burns just before the throne. Rest, Warden. The world is waiting for you.']],
  music:'lvl10'}
];
LEVELS.forEach((L,i)=>{L.size=[36+Math.round(28*i/9),26+2*i];});
