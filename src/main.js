// ===================== MAIN (loop, resize, boot) =====================
let _fpsT=0,_fpsN=0,_fps=0,_last=0,_dispW=W,_dispH=H;
function resize(){
  const vw=window.innerWidth,vh=window.innerHeight;let cw,ch;
  if(SET.scaleMode==='stretch'){cw=vw;ch=vh;}
  else{let s=Math.min(vw/W,vh/H);if(SET.scaleMode==='integer'&&s>=1)s=Math.floor(s);cw=Math.round(W*s);ch=Math.round(H*s);}
  _dispW=cw;_dispH=ch;
  const portrait=vh>vw*1.1;const top=portrait?Math.max(0,Math.min((vh-ch)/2,vh*0.04)):Math.round((vh-ch)/2);
  for(const el of [cvs,document.getElementById('scan')]){el.style.width=cw+'px';el.style.height=ch+'px';el.style.left=Math.round((vw-cw)/2)+'px';el.style.top=top+'px';}
  const dpr=window.devicePixelRatio||1;
  RS=SET.res>0?SET.res:clamp(Math.ceil(cw*dpr/W),1,4);
  if(cvs.width!==W*RS){cvs.width=W*RS;cvs.height=H*RS;}
  if(typeof updateTouch==='function')updateTouch();
}
onApply(()=>{if(!cvs)return;resize();cvs.style.filter=SET.brightness!==100?`brightness(${SET.brightness}%)`:'';
  document.getElementById('scan').style.display=SET.scanlines?'block':'none';});
function canvasRect(){return cvs.getBoundingClientRect();}

function frame(ts){
  const tsec=ts/1000;let dt=_last?Math.min(0.05,tsec-_last):0.016;_last=tsec;DT=dt;_now+=dt;
  try{
    if(typeof inputPoll==='function')inputPoll(dt);
    if(typeof uiUpdate==='function')uiUpdate(dt);
    if(!topOverlay()){
      if(scene==='world'&&typeof worldUpdate==='function')worldUpdate(dt);
      else if(scene==='battle'&&typeof battleUpdate==='function')battleUpdate(dt);
    }
    if(game&&(scene==='world'||scene==='battle')&&!topOverlay())game.time+=dt;
    render();
  }catch(e){console.error(e);}
  _fpsN++;_fpsT+=dt;if(_fpsT>=0.5){_fps=Math.round(_fpsN/_fpsT);_fpsN=0;_fpsT=0;}
  requestAnimationFrame(frame);
}
function render(){
  ctx.setTransform(RS,0,0,RS,0,0);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.save();
  if(fx.shake>0&&SET.shake){ctx.translate((Math.random()-.5)*fx.shake,(Math.random()-.5)*fx.shake);}
  fx.shake=Math.max(0,fx.shake-DT*30);
  if(scene==='world'&&typeof worldRender==='function')worldRender();
  else if(scene==='battle'&&typeof battleRender==='function')battleRender();
  else if((scene==='story'||scene==='ending')&&typeof storyRender==='function')storyRender();
  else if((scene==='title'||scene==='splash')&&typeof titleRender==='function')titleRender();
  ctx.restore();
  if(typeof uiRender==='function')uiRender();
  if(SET.showFps){ctx.font='8px monospace';ctx.textAlign='right';ctx.textBaseline='top';ctx.fillStyle='#000a';ctx.fillRect(W-40,0,40,11);ctx.fillStyle='#7f7';ctx.fillText(_fps+' FPS',W-3,2);}
}
function boot(){
  cvs=document.getElementById('c');ctx=cvs.getContext('2d');
  loadSettings();
  window.addEventListener('resize',resize);
  window.addEventListener('orientationchange',()=>setTimeout(resize,200));
  document.addEventListener('visibilitychange',()=>{if(typeof applyAudio==='function')applyAudio();});
  if(typeof setupInput==='function')setupInput();
  if(typeof setupTouch==='function')setupTouch();
  applySettings();resize();
  if('serviceWorker' in navigator&&location.protocol.startsWith('http')){navigator.serviceWorker.register('sw.js').catch(()=>{});}
  const go=()=>{if(typeof showSplash==='function')showSplash();requestAnimationFrame(frame);};
  if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,sleep(2500)]).then(go);}else go();
}
window.addEventListener('load',boot);
