// ===================== INPUT (keyboard, gamepad, touch, mouse) =====================
addStrings({i_space:'Spacja',i_none:'—',i_esc:'Esc',i_del:'Delete',i_press:'Naciśnij klawisz…',i_pressPad:'Naciśnij przycisk pada…',
  i_menu:'Menu',i_rotL:'Obróć w lewo',i_rotR:'Obróć w prawo',i_zoomIn:'Przybliż',i_zoomOut:'Oddal',i_camReset:'Reset kamery'},
 {i_space:'Space',i_none:'—',i_esc:'Esc',i_del:'Delete',i_press:'Press a key…',i_pressPad:'Press a pad button…',
  i_menu:'Menu',i_rotL:'Rotate left',i_rotR:'Rotate right',i_zoomIn:'Zoom in',i_zoomOut:'Zoom out',i_camReset:'Reset camera'});

const ACTIONS=['up','down','left','right','ok','back','menu','run','rotL','rotR','zoomIn','zoomOut','camReset'];
const DEFAULT_KEYS={up:['ArrowUp','KeyW'],down:['ArrowDown','KeyS'],left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],
  ok:['Enter','KeyZ'],back:['Backspace','KeyX'],menu:['Escape','KeyC'],run:['ShiftLeft','ShiftRight'],
  rotL:['KeyQ',''],rotR:['KeyE',''],zoomIn:['Equal','NumpadAdd'],zoomOut:['Minus','NumpadSubtract'],camReset:['KeyR','']};
const DEFAULT_PAD={up:[12,-1],down:[13,-1],left:[14,-1],right:[15,-1],ok:[0,-1],back:[1,-1],menu:[9,3],run:[2,-1],
  rotL:[4,-1],rotR:[5,-1],zoomIn:[7,-1],zoomOut:[6,-1],camReset:[10,8]};
const _DIR_ACTS=['up','down','left','right'];

let lastDevice='keyboard';
const _keysDown=new Set();      // held KeyboardEvent.code
const _keySuppress=new Set();   // codes ignored until released (used by capture)
const _touchHeld={};            // action -> count of pointers
const _padHeld={};              // action -> bool (from last poll)
const _prevHeld={};             // action -> bool (last poll)
const _tapped=new Set();        // pressed since last poll
const _released=new Set();      // released since last poll
const _repT={};
let _padPrevBtn=[],_padSuppress=new Set(),_padIdx=-1,_padAxes=[0,0,0,0];
let _capture=null;

function _codeActions(code){const r=[];if(!code||!SET.keys)return r;
  for(const a of ACTIONS){const k=SET.keys[a];if(k&&(k[0]===code||k[1]===code))r.push(a);}
  if(code==='Space'&&!r.length)r.push('ok');return r;}
function _keyLive(a){const k=SET.keys&&SET.keys[a];if(k)for(const c of k)if(c&&_keysDown.has(c)&&!_keySuppress.has(c))return true;
  if(a==='ok'&&_keysDown.has('Space')&&!_keySuppress.has('Space')&&!_spaceBound())return true;
  return false;}
function _spaceBound(){if(!SET.keys)return false;for(const b of ACTIONS){const k=SET.keys[b];if(k&&(k[0]==='Space'||k[1]==='Space'))return true;}return false;}
function isHeld(a){return _keyLive(a)||(_touchHeld[a]>0)||!!_padHeld[a];}
function isCapturing(){return !!_capture;}
function inputClear(){_keysDown.clear();_keySuppress.clear();for(const a of ACTIONS){_touchHeld[a]=0;_padHeld[a]=false;_prevHeld[a]=false;_repT[a]=0;}
  _tapped.clear();_released.clear();if(typeof _touchReleaseAll==='function')_touchReleaseAll();}

function _isTextTarget(el){if(!el||!el.tagName)return false;const tg=el.tagName;
  if(tg==='TEXTAREA'||el.isContentEditable)return true;
  if(tg==='INPUT'){const ty=(el.type||'text').toLowerCase();return !['range','checkbox','radio','button','submit','reset','color','file'].includes(ty);}
  return false;}

function setupInput(){
  for(const a of ACTIONS){_touchHeld[a]=0;_padHeld[a]=false;_prevHeld[a]=false;_repT[a]=0;}
  window.addEventListener('keydown',e=>{
    const code=e.code||'';
    if(code==='F5'||code==='F11'||code==='F12')return;
    if(_isTextTarget(e.target)&&code!=='Enter'&&code!=='NumpadEnter'&&code!=='Escape')return;
    if(_capture){e.preventDefault();if(e.repeat)return;_captureKey(code);return;}
    if(e.ctrlKey||e.metaKey){return;} // browser shortcuts
    const acts=_codeActions(code);
    if(acts.length||code==='Space'||code==='Tab')e.preventDefault();
    lastDevice='keyboard';
    if(e.repeat||_keysDown.has(code))return; // ignore browser auto-repeat
    _keysDown.add(code);
    if(!_keySuppress.has(code))for(const a of acts)_tapped.add(a);
  },{capture:true});
  window.addEventListener('keyup',e=>{
    const code=e.code||'';
    _keySuppress.delete(code);
    if(!_keysDown.has(code))return;
    _keysDown.delete(code);
    for(const a of _codeActions(code))if(!isHeld(a))_released.add(a);
  },{capture:true});
  window.addEventListener('blur',inputClear);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)inputClear();});
  window.addEventListener('gamepadconnected',e=>{_padIdx=e.gamepad.index;});
  window.addEventListener('gamepaddisconnected',e=>{if(_padIdx===e.gamepad.index)_padIdx=-1;});
  _setupMouse();
}

// ---------- gamepad ----------
function _getPad(){if(!navigator.getGamepads)return null;let pads;try{pads=navigator.getGamepads();}catch(e){return null;}
  if(!pads)return null;if(_padIdx>=0&&pads[_padIdx]&&pads[_padIdx].connected)return pads[_padIdx];
  for(const p of pads)if(p&&p.connected){_padIdx=p.index;return p;}return null;}
function padConnected(){const p=_getPad();return p?p.id:null;}
function padRumble(ms){if(!SET.padVibrate)return;const p=_getPad();if(!p)return;
  try{if(p.vibrationActuator&&p.vibrationActuator.playEffect)p.vibrationActuator.playEffect('dual-rumble',{startDelay:0,duration:ms||120,weakMagnitude:0.5,strongMagnitude:0.7});
  else if(p.hapticActuators&&p.hapticActuators[0])p.hapticActuators[0].pulse(0.7,ms||120);}catch(e){}}
function _dz(){return clamp((SET.padDeadzone||30)/100,0.05,0.9);}
function _axisDz(x,y){const m=Math.hypot(x,y),d=_dz();if(m<d)return{x:0,y:0};const k=Math.min(1,(m-d)/(1-d))/m;return{x:x*k,y:y*k};}
function axisMove(){return _axisDz(_padAxes[0],_padAxes[1]);}
function axisCam(){return _axisDz(_padAxes[2],_padAxes[3]);}
function _pollPad(){
  const p=_getPad();
  for(const a of ACTIONS)_padHeld[a]=false;
  if(!p){_padAxes=[0,0,0,0];_padPrevBtn=[];return;}
  const btn=p.buttons.map(b=>!!(b&&(b.pressed||b.value>0.5)));
  const ax=p.axes||[];_padAxes=[ax[0]||0,ax[1]||0,ax[2]||0,ax[3]||0];
  let active=false;
  for(let i=0;i<btn.length;i++){if(!btn[i])_padSuppress.delete(i);else active=true;}
  // capture
  if(_capture&&_capture.dev==='pad'){for(let i=0;i<btn.length;i++)if(btn[i]&&!_padPrevBtn[i]){_padSuppress.add(i);_captureAssign(i);break;}}
  for(const a of ACTIONS){const m=SET.pad&&SET.pad[a];if(!m)continue;for(const i of m)if(i>=0&&btn[i]&&!_padSuppress.has(i))_padHeld[a]=true;}
  const d=_dz(),lx=_padAxes[0],ly=_padAxes[1];
  if(Math.hypot(lx,ly)>d){active=true;if(Math.abs(lx)>Math.abs(ly))_padHeld[lx<0?'left':'right']=true;else _padHeld[ly<0?'up':'down']=true;}
  const rx=_padAxes[2],ry=_padAxes[3];
  if(Math.abs(rx)>d){active=true;_padHeld[rx<0?'rotL':'rotR']=true;}
  if(Math.abs(ry)>d){active=true;_padHeld[ry<0?'zoomIn':'zoomOut']=true;}
  if(active)lastDevice='pad';
  _padPrevBtn=btn;
}

// ---------- poll ----------
function inputPoll(dt){
  _pollPad();
  if(_capture&&_capture.dev==='pad'&&now()>_capture.until)_captureEnd(false);
  const cap=!!_capture;
  for(const a of ACTIONS){
    const live=isHeld(a),tap=_tapped.has(a);
    const edge=(live||tap)&&(!_prevHeld[a]||(tap&&_released.has(a)));
    _prevHeld[a]=live;
    if(cap)continue;
    if(edge){_repT[a]=0.35;try{dispatch(a,false);}catch(e){console.error(e);}}
    else if(live&&_DIR_ACTS.includes(a)){_repT[a]-=dt;if(_repT[a]<=0){_repT[a]=Math.max(0.02,_repT[a]+0.11);try{dispatch(a,true);}catch(e){console.error(e);}}}
  }
  _tapped.clear();_released.clear();
  _touchVisCheck();
}

// ---------- rebinding ----------
function startCapture(dev,action,slot,done){
  if(_capture)_captureEnd(false);
  _capture={dev,action,slot:slot|0,done,until:now()+6};
  if(dev==='pad'){const p=_getPad();_padPrevBtn=p?p.buttons.map(b=>!!(b&&(b.pressed||b.value>0.5))):[];}
}
function _captureEnd(ok,val){const c=_capture;_capture=null;if(c&&c.done){try{c.done(ok,val);}catch(e){console.error(e);}}}
function _captureKey(code){
  const c=_capture;_keySuppress.add(code);_keysDown.add(code);
  if(code==='Escape'){_captureEnd(false);return;}
  if(code==='Delete'){const map=c.dev==='key'?SET.keys:SET.pad;map[c.action][c.slot]=c.dev==='key'?'':-1;saveSettings();_captureEnd(true,map[c.action][c.slot]);return;}
  if(c.dev!=='key')return; // pad capture: keyboard only cancels/clears
  _captureAssign(code);
}
function _captureAssign(val){
  const c=_capture;if(!c)return;
  const key=c.dev==='key',map=key?SET.keys:SET.pad,empty=key?'':-1;
  if(!map[c.action])map[c.action]=[empty,empty];
  const old=map[c.action][c.slot];
  if(old!==val){
    for(const b of ACTIONS){const m=map[b];if(!m)continue;for(let j=0;j<m.length;j++){
      if(b===c.action&&j===c.slot)continue;
      if(m[j]===val){m[j]=(old!==empty&&!m.includes(old))?old:empty;}}}
    map[c.action][c.slot]=val;
  }
  saveSettings();_captureEnd(true,val);
}
function resetBindings(dev){if(dev!=='pad')SET.keys=JSON.parse(JSON.stringify(DEFAULT_KEYS));if(dev!=='key')SET.pad=JSON.parse(JSON.stringify(DEFAULT_PAD));saveSettings();}

const _KEYN={ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→',Enter:'Enter',NumpadEnter:'Num Enter',Backspace:'Backspace',
  Escape:'Esc',Tab:'Tab',CapsLock:'Caps',ShiftLeft:'L-Shift',ShiftRight:'R-Shift',ControlLeft:'L-Ctrl',ControlRight:'R-Ctrl',
  AltLeft:'L-Alt',AltRight:'R-Alt',MetaLeft:'L-Meta',MetaRight:'R-Meta',Delete:'Del',Insert:'Ins',Home:'Home',End:'End',
  PageUp:'PgUp',PageDown:'PgDn',Equal:'=',Minus:'-',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",
  Comma:',',Period:'.',Slash:'/',Backquote:'`',IntlBackslash:'\\',ContextMenu:'Menu',
  NumpadAdd:'Num +',NumpadSubtract:'Num −',NumpadMultiply:'Num *',NumpadDivide:'Num /',NumpadDecimal:'Num .'};
function keyName(code){
  if(!code)return t('i_none');
  if(code==='Space')return t('i_space');
  if(_KEYN[code])return _KEYN[code];
  let m;
  if((m=/^Key([A-Z])$/.exec(code)))return m[1];
  if((m=/^Digit(\d)$/.exec(code)))return m[1];
  if((m=/^Numpad(\d)$/.exec(code)))return 'Num '+m[1];
  return code;
}
const _PADN=['A','B','X','Y','LB','RB','LT','RT','Select','Start','L3','R3','D↑','D↓','D←','D→','Home'];
function padBtnName(i){if(i==null||i<0)return t('i_none');return _PADN[i]||('B'+i);}

// ---------- touch controls ----------
let _touchRoot=null,_touchVis=false;
const _touchPtrs=new Map(); // pointerId -> {acts:[...], el}
let _coarse=null;
function _touchEnabled(){
  if(SET.touch==='on')return true;if(SET.touch==='off')return false;
  if(_coarse===null){try{_coarse=window.matchMedia&&matchMedia('(pointer:coarse)').matches;}catch(e){_coarse=false;}
    _coarse=_coarse||('ontouchstart' in window)||(navigator.maxTouchPoints>0&&!(window.matchMedia&&matchMedia('(pointer:fine)').matches));}
  return _coarse||lastDevice==='touch';
}
function _touchDown(a){_touchHeld[a]=(_touchHeld[a]||0)+1;_tapped.add(a);}
function _touchUp(a){_touchHeld[a]=Math.max(0,(_touchHeld[a]||0)-1);if(!_touchHeld[a])_released.add(a);}
function _touchReleaseAll(){for(const [id,p] of _touchPtrs){for(const a of p.acts)_touchUp(a);}
  _touchPtrs.clear();if(_touchRoot)_touchRoot.querySelectorAll('.on').forEach(e=>e.classList.remove('on'));
  for(const a of ACTIONS)_touchHeld[a]=0;}

addCSS(`
#touch .tc{position:absolute;inset:0;display:none;font-size:10px;font-family:"Press Start 2P",monospace;color:#fff;
 -webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
#touch.vis .tc{display:block}
#touch .tc>*{pointer-events:auto;touch-action:none;position:absolute;box-sizing:border-box}
#touch .tb{border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.38),rgba(255,255,255,.12) 60%,rgba(0,0,0,.18));
 border:.2em solid rgba(255,255,255,.7);box-shadow:0 .25em 0 rgba(0,0,0,.35),inset 0 -.25em 0 rgba(0,0,0,.18);
 display:flex;align-items:center;justify-content:center;text-shadow:0 .12em 0 rgba(0,0,0,.6);transition:transform .05s}
#touch .tb.on{transform:translateY(.2em) scale(.95);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.75),rgba(255,255,255,.35));box-shadow:0 .05em 0 rgba(0,0,0,.35)}
#touch .tA{width:6.4em;height:6.4em;background:radial-gradient(circle at 35% 30%,rgba(255,170,180,.6),rgba(220,60,84,.42) 62%,rgba(110,20,40,.45))}
#touch .tB{width:5.4em;height:5.4em;background:radial-gradient(circle at 35% 30%,rgba(170,200,255,.6),rgba(60,100,220,.42) 62%,rgba(20,30,110,.45))}
#touch .tA.on,#touch .tB.on{filter:brightness(1.6)}
#touch .tA span{font-size:2em}#touch .tB span{font-size:1.6em}
#touch .tM{width:4em;height:4em;border-radius:1em;background:rgba(40,44,60,.45)}
#touch .tM span{font-size:1.9em;font-family:sans-serif;font-weight:bold}
#touch .tCam{display:flex;flex-direction:column;gap:.5em;pointer-events:none!important}
#touch .tCam>div{pointer-events:auto;touch-action:none;width:3.6em;height:3.6em;border-radius:1em;position:relative;background:rgba(40,44,60,.45)}
#touch .tCam span{font-size:1.7em;font-family:sans-serif;font-weight:bold}
#touch .tD{width:14em;height:14em;border-radius:50%;background:rgba(255,255,255,.07);border:.15em solid rgba(255,255,255,.18)}
#touch .tD .arm{position:absolute;background:rgba(40,44,60,.55);border:.2em solid rgba(255,255,255,.65);box-shadow:0 .25em 0 rgba(0,0,0,.35)}
#touch .tD .arm.on{background:rgba(255,255,255,.55)}
#touch .tD .u,#touch .tD .d{left:35%;width:30%;height:38%}
#touch .tD .l,#touch .tD .r{top:35%;height:30%;width:38%}
#touch .tD .u{top:2%;border-radius:.9em .9em .2em .2em;border-bottom:none}
#touch .tD .d{bottom:2%;border-radius:.2em .2em .9em .9em;border-top:none}
#touch .tD .l{left:2%;border-radius:.9em .2em .2em .9em;border-right:none}
#touch .tD .r{right:2%;border-radius:.2em .9em .9em .2em;border-left:none}
#touch .tD .ctr{position:absolute;left:34%;top:34%;width:32%;height:32%;background:rgba(40,44,60,.55);border-radius:.3em}
#touch .tD .ctr::after{content:'';position:absolute;left:30%;top:30%;width:40%;height:40%;border-radius:50%;background:rgba(0,0,0,.25)}
#touch .tD .arm::after{content:'';position:absolute;left:50%;top:50%;width:0;height:0;border:.7em solid transparent;transform:translate(-50%,-50%)}
#touch .tD .u::after{border-bottom-color:rgba(255,255,255,.8);margin-top:-.35em}
#touch .tD .d::after{border-top-color:rgba(255,255,255,.8);margin-top:.35em}
#touch .tD .l::after{border-right-color:rgba(255,255,255,.8);margin-left:-.35em}
#touch .tD .r::after{border-left-color:rgba(255,255,255,.8);margin-left:.35em}
`);

function _mkBtn(cls,label,act){const b=document.createElement('div');b.className='tb '+cls;b.innerHTML='<span>'+label+'</span>';b.dataset.act=act;
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();try{b.setPointerCapture(e.pointerId);}catch(_){}
    if(_touchPtrs.has(e.pointerId))return;_touchPtrs.set(e.pointerId,{acts:[act],el:b});_touchDown(act);b.classList.add('on');
    lastDevice='touch';vibrate(12);});
  const up=e=>{const p=_touchPtrs.get(e.pointerId);if(!p||p.el!==b)return;_touchPtrs.delete(e.pointerId);for(const a of p.acts)_touchUp(a);
    let still=false;for(const q of _touchPtrs.values())if(q.el===b)still=true;if(!still)b.classList.remove('on');};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
  return b;}

function _mkDpad(){
  const d=document.createElement('div');d.className='tD';
  const arms={};for(const [k,a] of [['u','up'],['d','down'],['l','left'],['r','right']]){const e=document.createElement('div');e.className='arm '+k;d.appendChild(e);arms[a]=e;}
  const c=document.createElement('div');c.className='ctr';d.appendChild(c);
  const dirAt=(e)=>{const r=d.getBoundingClientRect();const x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);
    if(Math.hypot(x,y)<r.width*0.12)return null;return Math.abs(x)>Math.abs(y)?(x<0?'left':'right'):(y<0?'up':'down');};
  const setDir=(id,dir)=>{const p=_touchPtrs.get(id);if(!p)return;const cur=p.acts[0]||null;if(cur===dir)return;
    if(cur){_touchUp(cur);arms[cur].classList.remove('on');}
    p.acts=dir?[dir]:[];if(dir){_touchDown(dir);arms[dir].classList.add('on');vibrate(8);}};
  d.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();try{d.setPointerCapture(e.pointerId);}catch(_){}
    lastDevice='touch';_touchPtrs.set(e.pointerId,{acts:[],el:d});setDir(e.pointerId,dirAt(e));});
  d.addEventListener('pointermove',e=>{if(_touchPtrs.has(e.pointerId)&&_touchPtrs.get(e.pointerId).el===d){e.preventDefault();setDir(e.pointerId,dirAt(e));}});
  const up=e=>{const p=_touchPtrs.get(e.pointerId);if(!p||p.el!==d)return;setDir(e.pointerId,null);_touchPtrs.delete(e.pointerId);};
  d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up);d.addEventListener('lostpointercapture',up);
  return d;
}

function setupTouch(){
  const host=document.getElementById('touch');if(!host)return;
  host.innerHTML='';
  const root=document.createElement('div');root.className='tc';_touchRoot=root;
  const dp=_mkDpad();dp.dataset.k='dpad';
  const A=_mkBtn('tA','A','ok'),B=_mkBtn('tB','B','back'),M=_mkBtn('tM','☰','menu');
  const cam=document.createElement('div');cam.className='tCam';
  for(const [l,a] of [['⟲','rotL'],['⟳','rotR'],['+','zoomIn'],['−','zoomOut'],['◎','camReset']]){const b=_mkBtn('',l,a);b.title=t('i_'+a);cam.appendChild(b);}
  root.append(dp,A,B,M,cam);host.appendChild(root);
  root._p={dp,A,B,M,cam};
  host.addEventListener('contextmenu',e=>e.preventDefault());
  onApply(updateTouch);
  updateTouch();
}
function updateTouch(){
  if(!_touchRoot)return;
  const {dp,A,B,M,cam}=_touchRoot._p;
  const vw=window.innerWidth,vh=window.innerHeight;
  // base em: scaled to the smaller screen dimension, then by touchSize
  const base=clamp(Math.min(vw,vh)/36,7,13)*clamp(SET.touchSize||100,40,200)/100;
  _touchRoot.style.fontSize=base.toFixed(2)+'px';
  _touchRoot.style.opacity=clamp(SET.touchOpacity==null?60:SET.touchOpacity,10,100)/100;
  const lh=!!SET.leftHanded;
  const sL='env(safe-area-inset-left,0px)',sR='env(safe-area-inset-right,0px)',sB='env(safe-area-inset-bottom,0px)',sT='env(safe-area-inset-top,0px)';
  const side=(el,near,em)=>{const s=near==='left'?sL:sR;el.style.left=el.style.right='';el.style[near]=`calc(${s} + ${em}em)`;};
  const dSide=lh?'right':'left',bSide=lh?'left':'right';
  side(dp,dSide,1.4);dp.style.bottom=`calc(${sB} + 1.4em)`;
  // camera column: below the menu button, shrinks to fit short screens
  const hEm=vh/base,avail=hEm-6.2-1.2;const k=clamp(avail/20,0.5,1);
  cam.style.fontSize=k+'em';side(cam,bSide,0.8/k);cam.style.top='';cam.style.bottom=`calc(${sB} + ${(1.2/k).toFixed(2)}em)`;
  const camW=0.8+3.6*k+0.6;
  // camera column sits at the edge; A/B shifted inward beside it (A outer/higher, B inner/lower)
  side(A,bSide,camW);A.style.bottom=`calc(${sB} + 6.4em)`;
  side(B,bSide,camW+7);B.style.bottom=`calc(${sB} + 2.0em)`;
  side(M,bSide,0.8);M.style.top=`calc(${sT} + 0.8em)`;
  _coarse=null;_touchVisCheck();
}
function _touchVisCheck(){
  if(!_touchRoot)return;
  const vis=_touchEnabled()&&(scene==='world'||scene==='battle')&&!topOverlay();
  if(vis!==_touchVis){if(!vis)_touchReleaseAll();_touchVis=vis;const host=_touchRoot.parentNode;if(host)host.classList.toggle('vis',vis);}
}

// ---------- mouse / touch on canvas ----------
const _ptrs=new Map(); // pointerId -> state
let _pinch=null,_lastClick={t:0,x:-99,y:-99};
function _toLogical(cx,cy){const r=(cvs||document.getElementById('c')).getBoundingClientRect();
  return{x:(cx-r.left)/(r.width||1)*W,y:(cy-r.top)/(r.height||1)*H,sx:W/(r.width||1),sy:H/(r.height||1)};}
function _mev(type,e,p,extra){const o={type,x:p.x,y:p.y,button:extra&&extra.button!=null?extra.button:(e.button>0?e.button:0),dx:0,dy:0,delta:0,scale:1,rot:0,
  shift:!!e.shiftKey,ctrl:!!(e.ctrlKey||e.metaKey),alt:!!e.altKey,pointer:e.pointerType==='touch'||e.pointerType==='pen'?'touch':'mouse'};
  if(extra)Object.assign(o,extra);try{routeMouse(o);}catch(err){console.error(err);}return o;}
function _touchPtrList(){const a=[];for(const s of _ptrs.values())if(s.type!=='mouse')a.push(s);return a;}
function _pinchGeom(){const l=_touchPtrList();if(l.length<2)return null;const a=l[0],b=l[1];
  return{d:Math.hypot(b.x-a.x,b.y-a.y)||1,ang:Math.atan2(b.y-a.y,b.x-a.x),x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
function _setupMouse(){
  const c=cvs||document.getElementById('c');if(!c)return;
  c.addEventListener('contextmenu',e=>e.preventDefault());
  c.addEventListener('pointerdown',e=>{
    e.preventDefault();try{c.focus({preventScroll:true});}catch(_){}
    const p=_toLogical(e.clientX,e.clientY);const type=e.pointerType==='mouse'?'mouse':'touch';
    lastDevice=type==='mouse'?'mouse':'touch';
    try{c.setPointerCapture(e.pointerId);}catch(_){}
    const st={id:e.pointerId,type,x:p.x,y:p.y,sx:p.x,sy:p.y,lx:p.x,ly:p.y,button:e.button<0?0:e.button,moved:false};
    _ptrs.set(e.pointerId,st);
    if(type==='touch'&&_touchPtrList().length>=2){
      // second finger: cancel click/drag of the first, start pinch
      for(const s of _touchPtrList())s.moved=true;
      const g=_pinchGeom();_pinch=g;st.pinch=true;return;}
    _mev('down',e,p,{button:st.button});
    if(st.button===2)_mev('context',e,p,{button:2});
  });
  c.addEventListener('pointermove',e=>{
    const p=_toLogical(e.clientX,e.clientY);const st=_ptrs.get(e.pointerId);
    if(e.pointerType==='mouse'&&(e.movementX||e.movementY))lastDevice='mouse';
    if(!st){if(e.pointerType==='mouse')_mev('move',e,p,{button:-1});return;}
    st.x=p.x;st.y=p.y;
    if(_pinch&&st.type==='touch'){const g=_pinchGeom();if(!g)return;
      let dr=g.ang-_pinch.ang;while(dr>Math.PI)dr-=2*Math.PI;while(dr<-Math.PI)dr+=2*Math.PI;
      const sc=g.d/_pinch.d;if(Math.abs(sc-1)>0.001||Math.abs(dr)>0.0005){_mev('pinch',e,{x:g.x,y:g.y},{scale:sc,rot:dr,button:0});_pinch=g;}
      return;}
    if(!st.moved&&Math.hypot(p.x-st.sx,p.y-st.sy)>4){st.moved=true;st.lx=st.sx;st.ly=st.sy;}
    _mev('move',e,p,{button:st.button});
    if(st.moved){const dx=p.x-st.lx,dy=p.y-st.ly;if(dx||dy){_mev('drag',e,p,{button:st.button,dx,dy});st.lx=p.x;st.ly=p.y;}}
  });
  const end=(e,cancel)=>{
    const st=_ptrs.get(e.pointerId);if(!st)return;_ptrs.delete(e.pointerId);
    const p=_toLogical(e.clientX,e.clientY);
    if(st.type==='touch'&&_pinch){if(_touchPtrList().length<2)_pinch=null;
      // remaining fingers stay "moved" so lifting them doesn't click
      if(!st.pinch)_mev('up',e,p,{button:st.button});return;}
    if(st.pinch)return;
    _mev('up',e,p,{button:st.button});
    if(!cancel&&!st.moved&&st.button===0){
      _mev('click',e,p,{button:0});
      const tn=performance.now();
      if(tn-_lastClick.t<350&&Math.hypot(p.x-_lastClick.x,p.y-_lastClick.y)<10){_mev('dblclick',e,p,{button:0});_lastClick.t=0;}
      else _lastClick={t:tn,x:p.x,y:p.y};
    }
  };
  c.addEventListener('pointerup',e=>end(e,false));
  c.addEventListener('pointercancel',e=>end(e,true));
  c.addEventListener('wheel',e=>{
    e.preventDefault();lastDevice='mouse';
    let d=e.deltaY;if(!d&&e.deltaX&&e.shiftKey)d=e.deltaX;
    if(e.deltaMode===1)d/=3;else if(e.deltaMode===2)d*=1;else d/=100;
    d=clamp(d,-3,3);if(!d)return;
    const p=_toLogical(e.clientX,e.clientY);
    _mev('wheel',e,p,{delta:d,button:0,pointer:'mouse'});
  },{passive:false});
}
