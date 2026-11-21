# LUMINA: Kroniki Dziesięciu Krain — kontrakt modułów (ENGINE CONTRACT)

Gra: JRPG 2D z widokiem z góry, grafika pixel‑art w stylu klasycznych gier o łapaniu potworów (Pokémon GBA),
ale WSZYSTKO jest oryginalne (nazwy, stworzenia, melodie). Nie kopiujemy żadnych postaci ani utworów z istniejących gier.
10 krain odblokowywanych po kolei, bossowie, trenerzy, sklep, kapliczki (ogniska w klimacie Dark Souls: leczą i zapisują).
Menu, ustawienia i ekrany HTML są w stylu Dark Souls (czarne tło, złote cienkie linie, serif Cinzel, wielkie litery z odstępami).
Okna wewnątrz gry (dialogi, walka, menu pauzy) są w stylu Pokémona (jasne zaokrąglone ramki, font pixel "Press Start 2P").
Język: polski i angielski (przełączany w ustawieniach). Platformy: przeglądarka PC, telefon Android/iOS (dotyk), pad, mysz.

Całość jest sklejana do JEDNEGO pliku `web/index.html` przez `build.py`: kolejno wkleja `src/shell.html` i pliki JS
w kolejności: core.js, data.js, gfx.js, mapgen.js, audio.js, input.js, ui.js, party.js, battle.js, world.js, menus.js, main.js.
Wszystkie pliki to zwykły skrypt (bez modułów ES, bez import/export), wspólny zakres globalny, `'use strict'` nie dodawać (jest w core.js).
Używaj `function` lub `const` na najwyższym poziomie. NIE nadpisuj nazw z innych modułów. Żadnych zewnętrznych bibliotek,
żadnych plików graficznych/dźwiękowych — wszystko rysowane i syntezowane kodem.
Kod pisz po angielsku (identyfikatory), komentarze mogą być krótkie.

## Logiczna rozdzielczość
`W=480, H=270, TS=16` (kafelek 16 px). Main ustawia przed każdym renderem `ctx.setTransform(RS,0,0,RS,0,0)` i
`ctx.imageSmoothingEnabled=false`. Rysuj zawsze w jednostkach logicznych 480×270. Po narysowaniu przywracaj stan (`ctx.save/restore`).

## Globalne z core.js (gotowe — używaj)
- `W,H,TS`, `LANG` ('pl'|'en'), `RNG(seed)→()=>[0,1)`, `hashStr(s)`, `ri(a,b,r?)`, `pick(arr,r?)`, `clamp`, `lerp`,
  `L2(x)` — jeśli x to tablica `[pl,en]` zwraca wersję w bieżącym języku, inaczej x.
- `t(key,...args)` — tłumaczenie, `{0}`,`{1}` zastępowane argumentami. Brak klucza → angielski → sam klucz.
- `addStrings(plObj,enObj)` — każdy moduł rejestruje SWOJE teksty na początku pliku. Prefiksy kluczy:
  data `d_`, gfx `g_`, mapgen `mg_`, audio `a_`, input `i_`, ui `u_`, party `p_`, battle `b_`, world `w_`, menus `m_`.
- `addCSS(cssString)` — dokleja <style>.
- `shade(hex,f)` (f −1..1 ciemniej/jaśniej), `hueShift(hex,deg,satDelta)`, `mtof(midi)`.
- `sleep(ms)→Promise`, `until(condFn)→Promise` (sprawdza co klatkę), `vibrate(ms)`.
- `cvs`, `ctx` (główny canvas), `RS` (skala renderu), `now()` (czas w sekundach od startu, rośnie co klatkę), `DT` ostatnia delta.
- `scene` — 'splash'|'title'|'story'|'world'|'battle'|'ending'. Zmieniaj przypisaniem `scene='world'`.
- `SET` — ustawienia (patrz niżej), `saveSettings()`, `applySettings()` (wywołuje wszystkie funkcje zarejestrowane przez
  `onApply(fn)`; moduły rejestrują swoje reakcje, np. audio głośność).
- `game` — bieżący stan rozgrywki (obiekt zapisu, patrz niżej) albo null. `newSave()` tworzy pusty.
- Zapis: `SLOTS=5`; `saveToSlot(slot)`, `loadFromSlot(slot)→bool` (ustawia `game`), `slotMeta(slot)→meta|null`,
  `deleteSlot(slot)`, `latestSlot()→slot|0`, `autoSave()` (zapisuje do `game.slot` gdy `SET.autosave`),
  `exportSlot(slot)` (pobiera plik .json), `importToSlot(slot,file)→Promise<bool>`.
  meta = `{date:ms, li, lead:spId, lv, cleared:n, time:sekundy, name}`.
- `ui` — stos widżetów canvas (patrz ui.js). `ovStack` — stos nakładek HTML; `pushOverlay(o)`, `popOverlay(o)`, `topOverlay()`.
  Nakładka `o` = `{el:HTMLElement, input(action,repeat), onClose?}`; `pushOverlay` dokleja `o.el` do `#ovroot`.
- `dispatch(action,repeat)` — wołane przez input.js. Kolejność: splash → `splashAny()`; topOverlay().input; ui top .input;
  `scene==='world'` → `worldInput(action,repeat)`.
- `routeMouse(ev)` — wołane przez input.js dla zdarzeń canvas. Kolejność: jeśli jest nakładka HTML → ignoruj; jeśli ui top
  ma metodę `mouse(ev)` i zwróci true → koniec; jeśli `scene==='world'` → `worldMouse(ev)`; `'title'/'story'` → nic.
- `fx` — `{shake:0}` (main maleje i stosuje przesunięcie). Main rysuje FPS.
- Stałe kafelków: `T_FLOOR=0,T_WALL=1,T_GRASS=2,T_PATH=3,T_CHEST=4,T_CHEST_OPEN=5,T_SHRINE=6,T_DECO=7,T_BLOCK=8,T_PORTAL=9`,
  `passable(tile)` → true dla FLOOR, GRASS, PATH, DECO, PORTAL.
- `DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}`.

## SET (ustawienia, domyślne w core.js)
```
lang:'pl'|'en', textSpeed:0..3 (wolno,normalnie,szybko,natychmiast), autoText:true (auto‑przewijanie tekstu w walce),
difficulty:0..2 (łatwy,normalny,trudny), encounter:0..2 (rzadko,normalnie,często), battleAnim:true, autosave:true,
res:0..4 (0=auto,1=480x270,2=960x540,3=1440x810,4=1920x1080), scaleMode:'fit'|'integer'|'stretch', brightness:50..150,
shake:true, scanlines:false, showFps:false, particles:true,
master:80, music:70, sfx:80 (0..100), bgMute:true, customMusic:true,
touch:'auto'|'on'|'off', touchSize:100 (60..160), touchOpacity:60 (20..100), leftHanded:false, vibrate:true,
keys:{action:[code,code]}  (KeyboardEvent.code, '' = puste),
pad:{action:[btnIndex,btnIndex]} (indeksy przycisków Standard Gamepad, -1 = puste), padDeadzone:30 (10..60), padVibrate:true,
mouseMove:true (kliknij‑idź), mouseCam:true (przeciąganie/kółko/obrót), invertZoom:false, camRelative:true
(kierunki ruchu względem obróconej kamery), rotSpeed:2 (1..4), controlHints:'auto'|'keyboard'|'pad'|'touch'|'mouse'
```
ACTIONS = `['up','down','left','right','ok','back','menu','run','rotL','rotR','zoomIn','zoomOut','camReset']`.

## Obiekt zapisu `game`
```
{v:1, slot:1..5, name:'Ren', party:[mon], box:[mon], gold:300,
 items:{potion:5, ether:2, orb:5, cure:1},  // id→liczba
 unlocked:1 (ile krain dostępnych, 1..10), cleared:[li...],
 lv:{ [li]: {c:[indeksy otwartych skrzyń], tr:[indeksy pokonanych trenerów], boss:false} },
 cp:{li,x,y} (ostatnia kapliczka / start krainy), pos:{li,x,y} (aktualna pozycja), seen:{spId:true}, caught:{spId:true},
 won:false, time:0 (sekundy gry, main dolicza gdy scene==='world'||'battle')}
```
Mon (stworzenie): `{sp:'embrix', lv:5, exp:100, hp:20, ep:17, moves:['tackle','ember'], st:null|{k,n}, mul?:{hp,atk,def}}`
`st.k` ∈ 'burn','poison','para','sleep','frz'; `n` = pozostałe tury dla sleep/frz.

## data.js (agent DATA)
Eksportuje: `TYPES` (9: normal,fire,water,grass,volt,ice,earth,shadow,light), `TYPE_COL{type:hex}`, `TYPE_N{type:[pl,en]}`,
`effOf(atkType,defType)→0.5|1|2`, `STG=[0.5,0.67,1,1.5,2]` (mnożnik dla etapu −2..+2 → indeks+2),
`MOVES{id:{n:[pl,en],t,p (moc, 0=statusowy),a (celność %, undefined=zawsze),ep,st?:[k,szansa],buff?:['atk'|'def',+1],
 debuff?:['atk'|'def',-1],heal?:0.5,prio?:1}}`,
`ITEMS{id:{n:[pl,en],d:[pl,en],price,heal?,ep?,revive?:0.5,cure?:true,catch?:mnożnik,minLv (od której krainy w sklepie, 0..9)}}`
 (id: potion, super, max, ether, revive, cure, orb, gorb, uorb),
`SPECIES{id:{id,name,t,c (typ ataków dodatkowych lub null),b:[hp,atk,def,spd],x (bazowe exp),cr (szansa złapania 0..1),
 evo:[lv,idDocelowy]|null,boss:bool}}` (~45 gatunków, w tym 3 startowe z 2 ewolucjami każdy, 10 bossów + eclipsor2),
`STARTERS=['embrix','aquapup','leafin']`, `learnset(spId)→[[lv,moveId]...]`, `expFor(lv)` (=floor(0.8*lv^3)),
`createMon(spId,lv,mul?)→mon` (zna ostatnie ≤4 ruchy z learnsetu, pełne HP/EP), `stats(mon)→{hp,atk,def,spd,ep}`
 (uwzględnia mon.mul), `learnMove(mon,moveId)→{learned:bool,forgot:moveId|null}`, `monName(mon)`, `healMon(mon)`,
`DIFF=[{mul:0.85,xp:1.4,gold:1.2},{mul:1,xp:1,gold:1},{mul:1.15,xp:0.9,gold:0.9}]`, `shopStock(li)→[itemId]`,
`LEVELS[10]`: `{id, roman:'I', name:[pl,en], intro:[pl,en], theme, pool:[spId], lv:[min,max], boss, bossLv, boss2?, boss2Lv?,
 bossLine:[pl,en], trainers:[{name:[pl,en], team:[spId], lv, pre:[pl,en], post:[pl,en]}] (2 na krainę),
 lore:[[pl,en],[pl,en],[pl,en]], music:'lvl1'..'lvl10', size:[w,h]}`,
`THEMES{key:{floor,floor2,path,wall,wallA,wallB,trunk,grass,grass2,water,deco:[...],bg:[gora,dol],dark:bool,particles,voidCol}}`
 klucze: meadow, forest, cave, coast, desert, volcano, snow, mire, sky, citadel. `wall` ∈ tree|pine|rock|lavarock|water|void|brick|deadtree.
 `particles` ∈ petal|firefly|dust|ember|snow|fog|spark|none. `deco` ∈ flower|mushroom|crystal|pebble|shell|cactus|snowrock|skull|star|candle.

## gfx.js (agent GFX)
`CHAR_PALS` (tablica palet postaci; 0 = gracz, czapka czerwona), `charSprite(pal,dir,frame)→canvas16x16`
 (pal = indeks lub obiekt palety; dir up/down/left/right; frame 0 stoi,1,2 krok), `monSprite(spId)→canvas` (24×24, boss 32×32,
 generowane proceduralnie z ziarna id, symetryczne, z oczami, kolory z TYPE_COL; deterministyczne, w cache),
`paintMap(map,theme)→canvas (map.w*16 × map.h*16)`, `repaintTile(mapCanvas,map,theme,x,y)`,
`drawShrine(ctx,x,y,time)` (x,y w pikselach lewy‑górny kafelka; płomień animowany — rysowany NA kafelku, podstawa już w paintMap),
`drawPortal(ctx,x,y,time,active)`, `drawGrassOverlay(ctx,x,y,theme)` (dolne ~6 px trawy na nogach gracza),
`drawBattleBg(ctx,theme,time)` (całe 480×270: niebo/tło, dwie platformy: wróg środek (340,118) rx72 ry14, gracz (120,206) rx86 ry16),
`drawChestIcon`, `typeIcon` nieobowiązkowe. `drawCursorTri(ctx,x,y,col)` mały trójkąt ▶ 5×7.

## mapgen.js (agent MAPGEN)
`genLevel(li)→map` deterministycznie (ziarno z li). map = `{w,h,tiles:Uint8Array(w*h), rooms:[{x,y,w,h,cx,cy}],
 start:{x,y}, boss:{x,y}, shrines:[{x,y}], chests:[{x,y,loot}], npcs:[{x,y,kind,idx,pal,dir}], seed}`.
`loot` = `{item:id,n}` albo `{gold:n}`. `kind` ∈ 'lore' (idx 0..2 → LEVELS[li].lore[idx]), 'shop', 'trainer' (idx 0..1), 'hint'.
Gwarantuje spójność (wszystko osiągalne z startu), kafelki blokujące nie odcinają przejść. `tileAt(map,x,y)`, `setTile(map,x,y,v)`.

## audio.js (agent AUDIO)
`audioInit()` (po pierwszym geście), `playMusic(key)` (płynne przejście, nie restartuje tego samego), `stopMusic()`,
`sfx(name)`, `playJingle(name)→Promise` ('victory','levelup','clear','caught','died','evolve'), `applyAudio()`.
Klucze muzyki: menu, story, lvl1..lvl10, battle, trainer, boss, final, ending. Każdy inny, oryginalny chiptune generowany Web Audio.
SFX: move, ok, back, deny, bump, hit, crit, weak, heal, buff, debuff, status, enc, chest, catch, shake, faint, death, shrine,
 buy, save, door, step, evolve, text.
Własne pliki: jeśli istnieje `music/tracks.json` (`{"menu":"menu.mp3",...}`) i SET.customMusic, odtwarza te pliki zamiast syntezy.

## input.js (agent INPUT)
`ACTIONS`, `DEFAULT_KEYS`, `DEFAULT_PAD`, `isHeld(action)`, `inputPoll(dt)` (emituje `dispatch` na zboczach + auto‑repeat
kierunków 0.35 s / 0.11 s), `startCapture(device,action,slot,doneCb)` device 'key'|'pad', `keyName(code)`, `padBtnName(i)`,
`setupTouch()`, `updateTouch()` (widoczność/rozmiar/przezroczystość/lewo‑ręczny), `padConnected()→name|null`,
`lastDevice` ('keyboard'|'mouse'|'touch'|'pad'), `axisMove()→{x,y}` (lewa gałka), `axisCam()→{x,y}` (prawa gałka), `padRumble(ms)`.
Mysz/dotyk na canvas → `routeMouse(ev)`: `ev={type:'down'|'up'|'move'|'click'|'drag'|'wheel'|'pinch'|'dblclick'|'context',
 x,y (logiczne 0..480/0..270), button (0 lewy,1 środek,2 prawy), dx,dy (dla drag, logiczne), delta (wheel: + = oddal),
 scale (pinch, mnożnik od poprzedniego), rot (pinch: obrót w radianach od poprzedniego), shift,ctrl,alt, pointer:'mouse'|'touch'}`.
'click' = down+up bez przesunięcia >4px. Dotyk dwoma palcami → 'pinch'. Menu kontekstowe przeglądarki wyłączone na canvas.

## ui.js (agent UI) — widżety canvas, styl Pokémon
`FONT='8px "Press Start 2P", monospace'`, `txt(s,x,y,col,align,font)`, `rr(x,y,w,h,r)`, `panel(x,y,w,h,opt)`, `wrap(s,maxW)`,
`hpBar(x,y,w,h,ratio)`, `typeBadge(type,x,y)→szerokość`, `drawMonMini(spId,x,y,size)`,
`pushWidget(w)→Promise` (w: `{update?(dt),draw(),input(a,rep),mouse?(ev)→bool}`; widżet kończy się `closeWidget(w,value)`),
`say(text,{auto})→Promise` (okno dialogowe na dole y=H-62, h=58; pisanie znak po znaku wg SET.textSpeed; ok/back przewija;
 auto + SET.autoText → samo przechodzi po 0.8 s; klik/tap też przewija),
`menu(o)→Promise<index|-1>`: o = `{items:[string|{label,r,disabled,col}], x,y,w,h, cols:1, rowH:14, maxRows, idx:0,
 cancel:true, title, prompt, promptW, drawRow(item,i,x,y,w,h,sel), info(idx), onMove(idx), noBox}` — obsługuje klawisze,
 scroll, mysz (najechanie zaznacza, klik wybiera, kółko przewija, prawy klik = anuluj),
`ask(q)→Promise<bool>` (Tak/Nie), `uiUpdate(dt)`, `uiRender()`, `transition(dir:'in'|'out')→Promise` (in = zasłania ekran),
`fadeOverlay` rysowany przez uiRender, `banner(top,main,{color,dur})→Promise` (napis krainy w stylu Dark Souls),
`bigText(text,{color,dur,sub})→Promise` (np. „POLEGŁEŚ” czerwony, „KRAINA OCZYSZCZONA” złoty), `pickStarter(ids)→Promise<idx>`,
`numberPicker`, `toast(text)` (krótki napis u góry na 2 s).

## party.js (agent PARTY)
`teamMenu(o)→Promise<idx|-1>` o.mode: 'world' (podmenu: podsumowanie, ustaw na prowadzącego, zamień kolejność, do schowka,
 użyj przedmiotu; zwraca -1), 'battle' (wybór do zmiany; zablokuj aktywnego `o.active` i omdlałe), 'forced' (bez anulowania),
 'item' (wybór celu dla `o.item`), `bagMenu({battle,wild})→Promise<null|{type:'item',id,target}>` (w świecie sam używa przedmiotów),
`applyItem(id,mon)→string|null` (komunikat albo null = brak efektu; zużywa sztukę), `showSummary(mon)`, `boxMenu()`,
`bestiaryMenu()`, `shopMenu(li)`, `drawMonRow(mon,x,y,w,h,sel)`.

## battle.js (agent BATTLE)
`runBattle(o)→Promise<'win'|'lose'|'run'|'caught'>`, o = `{kind:'wild'|'trainer'|'boss', team:[mon], tname, reward, final}`.
Ustawia `scene='battle'`, gra muzykę ('battle'/'trainer'/'boss'/'final'), na końcu wraca `scene='world'` i
`playMusic(LEVELS[world.li].music)`. Obsługuje exp, poziomy, nauki ruchów, ewolucje (po walce), łapanie (dzikie), ucieczkę,
statusy, nagrodę złota, `game.seen/caught`. Przy 'lose' NIE pokazuje ekranu śmierci (robi to world).
`battleUpdate(dt)`, `battleRender()`, globalny `battle`.

## world.js (agent WORLD)
`world` (stan krainy), `enterLevel(li,{pos,heal})→Promise`, `resumeGame()` (wejście w `game.pos`), `startNewGame(slot)`
(prolog, wybór startera, kraina 0), `worldUpdate(dt)`, `worldRender()`, `worldInput(a,rep)`, `worldMouse(ev)`,
`storyRender()` (tło dla scene 'story'/'ending'), `playEnding()`, kamera: zoom 0.5..3, obrót 0..2π (płynny, 360°), przesuwanie.
Pauza (menu), kapliczki (odpoczynek, schowek, podróż: `openLevelSelect()`), skrzynie, NPC, trenerzy, boss, portal, śmierć.

## menus.js (agent MENUS) — nakładki HTML w stylu Dark Souls
`splashAny()`, `showSplash()`, `showTitle()`, `openSettings()→Promise`, `openSaveLoad(mode:'save'|'load'|'new')→Promise<slot|0>`,
`openLevelSelect()→Promise<li|-1>`, `confirmDS(text)→Promise<bool>`, `showCredits({ending})→Promise`, `showHelp()→Promise`,
`titleRender()` (animowane tło canvas dla scene 'title'), `toggleFullscreen()`.
