'use strict';
// ===================== CORE (shared globals) =====================
const W=480,H=270,TS=16;
let LANG='pl';
function RNG(a){a=(a>>>0)||1;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
const ri=(a,b,r=Math.random)=>a+Math.floor(r()*(b-a+1));
const pick=(arr,r=Math.random)=>arr[Math.floor(r()*arr.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,k)=>a+(b-a)*k;
const L2=p=>Array.isArray(p)?(LANG==='pl'?p[0]:(p[1]!=null?p[1]:p[0])):p;
const I18N={pl:{},en:{}};
function addStrings(pl,en){Object.assign(I18N.pl,pl||{});Object.assign(I18N.en,en||{});}
function t(k,...a){let s=I18N[LANG]&&I18N[LANG][k];if(s==null)s=I18N.en[k];if(s==null)s=k;s=String(s);a.forEach((v,i)=>{s=s.split('{'+i+'}').join(v);});return s;}
function addCSS(css){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);}
function hexToRgb(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255];}
function rgbToHex(r,g,b){return'#'+((1<<24)|(clamp(r|0,0,255)<<16)|(clamp(g|0,0,255)<<8)|clamp(b|0,0,255)).toString(16).slice(1);}
function shade(h,f){let[r,g,b]=hexToRgb(h);if(f>=0){r+=(255-r)*f;g+=(255-g)*f;b+=(255-b)*f;}else{r*=1+f;g*=1+f;b*=1+f;}return rgbToHex(r,g,b);}
function hueShift(h,deg,sat=0){let[r,g,b]=hexToRgb(h).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let hh=0,s=0;const l=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);hh=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;hh*=60;}
  hh=((hh+deg)%360+360)%360;s=clamp(s+sat,0,1);const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((hh/60)%2-1)),m=l-c/2;
  const[R,G,B]=hh<60?[c,x,0]:hh<120?[x,c,0]:hh<180?[0,c,x]:hh<240?[0,x,c]:hh<300?[x,0,c]:[c,0,x];return rgbToHex((R+m)*255,(G+m)*255,(B+m)*255);}
const mtof=m=>440*Math.pow(2,(m-69)/12);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function until(cond){return new Promise(r=>{const f=()=>{if(cond())r();else requestAnimationFrame(f);};f();});}
function vibrate(ms){if(SET&&SET.vibrate&&navigator.vibrate){try{navigator.vibrate(ms);}catch(e){}}}

let cvs=null,ctx=null,RS=1,DT=0,_now=0;
function now(){return _now;}
let scene='splash';
const fx={shake:0};
const ui=[];
const ovStack=[];
function topOverlay(){return ovStack.length?ovStack[ovStack.length-1]:null;}
function pushOverlay(o){ovStack.push(o);if(o.el&&!o.el.parentNode)document.getElementById('ovroot').appendChild(o.el);return o;}
function popOverlay(o){const i=ovStack.indexOf(o);if(i>=0)ovStack.splice(i,1);if(o&&o.el&&o.el.parentNode)o.el.parentNode.removeChild(o.el);if(o&&o.onClose)o.onClose();}

// tiles
const T_FLOOR=0,T_WALL=1,T_GRASS=2,T_PATH=3,T_CHEST=4,T_CHEST_OPEN=5,T_SHRINE=6,T_DECO=7,T_BLOCK=8,T_PORTAL=9;
function passable(tl){return tl===T_FLOOR||tl===T_GRASS||tl===T_PATH||tl===T_DECO||tl===T_PORTAL;}
const DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};

// ===================== SETTINGS =====================
const DEFAULT_SET={lang:(navigator.language||'pl').toLowerCase().startsWith('pl')?'pl':'en',
  textSpeed:2,autoText:true,difficulty:1,encounter:1,battleAnim:true,autosave:true,
  res:0,scaleMode:'fit',brightness:100,shake:true,scanlines:false,showFps:false,particles:true,
  master:80,music:70,sfx:80,bgMute:true,customMusic:true,
  touch:'auto',touchSize:100,touchOpacity:60,leftHanded:false,vibrate:true,
  keys:null,pad:null,padDeadzone:30,padVibrate:true,
  mouseMove:true,mouseCam:true,invertZoom:false,camRelative:true,rotSpeed:2,controlHints:'auto'};
let SET=JSON.parse(JSON.stringify(DEFAULT_SET));
const _applyFns=[];
function onApply(fn){_applyFns.push(fn);}
function loadSettings(){try{const s=JSON.parse(localStorage.getItem('lumina_settings')||'null');if(s)Object.assign(SET,s);}catch(e){}
  if(!SET.keys)SET.keys=JSON.parse(JSON.stringify(typeof DEFAULT_KEYS!=='undefined'?DEFAULT_KEYS:{}));
  if(!SET.pad)SET.pad=JSON.parse(JSON.stringify(typeof DEFAULT_PAD!=='undefined'?DEFAULT_PAD:{}));
  if(typeof ACTIONS!=='undefined')for(const a of ACTIONS){if(!SET.keys[a])SET.keys[a]=(DEFAULT_KEYS[a]||['','']).slice();if(!SET.pad[a])SET.pad[a]=(DEFAULT_PAD[a]||[-1,-1]).slice();}
  LANG=SET.lang;}
function saveSettings(){try{localStorage.setItem('lumina_settings',JSON.stringify(SET));}catch(e){}}
function applySettings(){LANG=SET.lang;document.documentElement.lang=LANG;for(const f of _applyFns){try{f();}catch(e){console.error(e);}}}
function resetSettings(){const k=SET.keys,p=SET.pad;SET=JSON.parse(JSON.stringify(DEFAULT_SET));SET.keys=null;SET.pad=null;saveSettings();loadSettings();applySettings();}

// ===================== SAVE SYSTEM =====================
const SLOTS=5;
let game=null;
function newSave(){return{v:1,slot:1,name:'Ren',party:[],box:[],gold:300,items:{potion:5,ether:2,orb:5,cure:1},
  unlocked:1,cleared:[],lv:{},cp:{li:0,x:-1,y:-1},pos:{li:0,x:-1,y:-1},seen:{},caught:{},won:false,time:0};}
const _sk=s=>'lumina_slot_'+s;
function slotMeta(s){try{const d=JSON.parse(localStorage.getItem(_sk(s))||'null');return d?d.meta:null;}catch(e){return null;}}
function saveToSlot(s){if(!game)return false;game.slot=s;const lead=game.party[0];
  const meta={date:Date.now(),li:game.pos.li,lead:lead?lead.sp:null,lv:lead?lead.lv:0,cleared:game.cleared.length,time:Math.floor(game.time),name:game.name};
  try{localStorage.setItem(_sk(s),JSON.stringify({meta,data:game}));localStorage.setItem('lumina_last',String(s));return true;}catch(e){return false;}}
function loadFromSlot(s){try{const d=JSON.parse(localStorage.getItem(_sk(s))||'null');if(!d||!d.data)return false;game=Object.assign(newSave(),d.data);game.slot=s;localStorage.setItem('lumina_last',String(s));return true;}catch(e){return false;}}
function deleteSlot(s){localStorage.removeItem(_sk(s));}
function latestSlot(){let best=0,bd=-1;for(let s=1;s<=SLOTS;s++){const m=slotMeta(s);if(m&&m.date>bd){bd=m.date;best=s;}}return best;}
function autoSave(){if(game&&SET.autosave&&game.slot)return saveToSlot(game.slot);return false;}
function exportSlot(s){const raw=localStorage.getItem(_sk(s));if(!raw)return false;const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([raw],{type:'application/json'}));a.download='lumina-save-'+s+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);return true;}
function importToSlot(s,file){return new Promise(res=>{const fr=new FileReader();fr.onload=()=>{try{const d=JSON.parse(fr.result);
  if(!d||!d.data||!Array.isArray(d.data.party))return res(false);localStorage.setItem(_sk(s),JSON.stringify(d));res(true);}catch(e){res(false);}};fr.onerror=()=>res(false);fr.readAsText(file);});}

// ===================== ROUTING =====================
function dispatch(a,rep){
  if(scene==='splash'){if(!rep&&typeof splashAny==='function')splashAny();return;}
  const o=topOverlay();if(o){o.input(a,rep);return;}
  if(ui.length){const w=ui[ui.length-1];if(w.input)w.input(a,rep);return;}
  if(scene==='world'&&typeof worldInput==='function')worldInput(a,rep);
}
function routeMouse(ev){
  if(topOverlay())return;
  if(ui.length){const w=ui[ui.length-1];if(w.mouse&&w.mouse(ev))return;if(scene!=='world')return;
    // dialog boxes swallow clicks
    if(ev.type==='click'||ev.type==='down')return;}
  if(scene==='world'&&typeof worldMouse==='function')worldMouse(ev);
}
