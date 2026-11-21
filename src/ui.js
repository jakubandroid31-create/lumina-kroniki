// ===================== UI (canvas widgets, Pokémon-style) =====================
addStrings({
  u_yes:'Tak',u_no:'Nie',u_pick:'Wybierz swojego towarzysza',u_pick_hint:'< > wybierz    OK zatwierdź',
  u_type:'Typ',u_lv:'Poz.',u_hp:'PŻ',u_qty:'Ilość',u_cancel:'Anuluj',u_back:'Wróć'
},{
  u_yes:'Yes',u_no:'No',u_pick:'Choose your companion',u_pick_hint:'< > choose    OK confirm',
  u_type:'Type',u_lv:'Lv.',u_hp:'HP',u_qty:'Qty',u_cancel:'Cancel',u_back:'Back'
});

const FONT='8px "Press Start 2P", monospace';
const UI_LH=14;
const UI_COL={text:'#383840',shadow:'#d0d0c8',dtext:'#e8f0ff',dshadow:'#020614',dgold:'#f3d27a',dgray:'#6a7898',gray:'#a8a8a8',
  navy:'#203050',blue:'#88b0e0',cream:'#fcfcf4',sel:'#e8f0ff',gold:'#d8b860'};
function _usfx(n){if(typeof sfx==='function'){try{sfx(n);}catch(e){}}}

// ---------- primitives ----------
function txt(s,x,y,col,align,font,sh){
  ctx.save();ctx.font=font||FONT;ctx.textAlign=align||'left';ctx.textBaseline='top';s=String(s);
  if(sh){ctx.fillStyle=sh===true?UI_COL.shadow:sh;ctx.fillText(s,x+1,y+1);}
  ctx.fillStyle=col||UI_COL.text;ctx.fillText(s,x,y);ctx.restore();
}
function rr(x,y,w,h,r){
  r=Math.max(0,Math.min(r==null?4:r,w/2,h/2));ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}
// opt: {dark, alpha, r, fill, border, line}
function panel(x,y,w,h,opt){
  opt=opt||{};x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
  const dk=!!opt.dark,r=opt.r==null?5:opt.r;
  ctx.save();if(opt.alpha!=null)ctx.globalAlpha*=opt.alpha;
  ctx.fillStyle='rgba(0,0,0,0.25)';rr(x+1,y+2,w,h,r);ctx.fill();               // drop shadow
  if(dk){ // JRPG navy translucent window, silver-blue border
    const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'rgba(16,32,80,0.93)');g.addColorStop(1,'rgba(6,12,36,0.95)');
    ctx.fillStyle=opt.fill||g;rr(x,y,w,h,r);ctx.fill();
    ctx.strokeStyle=opt.border||'rgba(188,212,255,0.6)';ctx.lineWidth=1;rr(x+0.5,y+0.5,w-1,h-1,r);ctx.stroke();
    ctx.strokeStyle='rgba(188,212,255,0.18)';rr(x+2.5,y+2.5,w-5,h-5,Math.max(0,r-2));ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(x+3,y+3,w-6,Math.min(8,h/3));
    ctx.restore();return;
  }
  ctx.fillStyle=opt.border||UI_COL.navy;rr(x,y,w,h,r);ctx.fill();  // outer border
  ctx.fillStyle=opt.line||UI_COL.blue;rr(x+2,y+2,w-4,h-4,r-1);ctx.fill(); // light inner line
  ctx.fillStyle=opt.fill||UI_COL.cream;rr(x+3,y+3,w-6,h-6,r-2);ctx.fill();
  if(!opt.fill){ctx.fillStyle='#eeeee4';ctx.fillRect(x+4,y+h-6,w-8,2);}      // soft bottom tint
  ctx.restore();
}
function wrap(s,maxW){
  ctx.save();ctx.font=FONT;const out=[];
  for(const para of String(s==null?'':s).split('\n')){
    const words=para.split(' ');let line='';
    for(let wd of words){
      const test=line?line+' '+wd:wd;
      if(ctx.measureText(test).width<=maxW){line=test;continue;}
      if(line)out.push(line);
      // hard-break overlong words
      while(ctx.measureText(wd).width>maxW&&wd.length>1){let k=wd.length;while(k>1&&ctx.measureText(wd.slice(0,k)).width>maxW)k--;out.push(wd.slice(0,k));wd=wd.slice(k);}
      line=wd;
    }
    out.push(line);
  }
  ctx.restore();return out;
}
function textW(s,font){ctx.save();ctx.font=font||FONT;const w=ctx.measureText(String(s)).width;ctx.restore();return w;}
function hpBar(x,y,w,h,ratio){
  ratio=clamp(ratio||0,0,1);h=h||4;
  ctx.save();
  ctx.fillStyle='#283030';rr(x-1,y-1,w+2,h+2,2);ctx.fill();
  ctx.fillStyle='#506060';ctx.fillRect(x,y,w,h);
  const c=ratio>0.5?'#58d080':ratio>0.2?'#f8c030':'#f05040';
  const fw=Math.round(w*ratio);
  if(fw>0){ctx.fillStyle=c;ctx.fillRect(x,y,fw,h);ctx.fillStyle=shade(c,0.45);ctx.fillRect(x,y,fw,Math.max(1,Math.floor(h/3)));
    ctx.fillStyle=shade(c,-0.25);ctx.fillRect(x,y+h-1,fw,1);}
  ctx.restore();
}
function typeBadge(type,x,y){
  const name=(typeof TYPE_N!=='undefined'&&TYPE_N[type])?L2(TYPE_N[type]):String(type||'?');
  const col=(typeof TYPE_COL!=='undefined'&&TYPE_COL[type])||'#888888';
  const lab=name.toUpperCase();const w=Math.ceil(textW(lab))+10,h=12;
  ctx.save();
  ctx.fillStyle=shade(col,-0.5);rr(x,y,w,h,5);ctx.fill();
  ctx.fillStyle=col;rr(x+1,y+1,w-2,h-2,4);ctx.fill();
  ctx.fillStyle=shade(col,0.3);ctx.fillRect(x+4,y+2,w-8,1);
  ctx.restore();
  txt(lab,x+w/2,y+2,'#ffffff','center',FONT,shade(col,-0.55));
  return w;
}
function drawMonMini(spId,x,y,size){
  size=size||24;if(typeof monSprite!=='function')return;let c;try{c=monSprite(spId);}catch(e){return;}if(!c)return;
  ctx.save();ctx.imageSmoothingEnabled=false;
  const s=Math.max(c.width,c.height);let k=size/s;if(k>=1)k=Math.floor(k);
  const dw=c.width*k,dh=c.height*k;ctx.drawImage(c,Math.round(x+(size-dw)/2),Math.round(y+(size-dh)/2),dw,dh);
  ctx.restore();
}
function _cursor(x,y,col){
  if(typeof drawCursorTri==='function'){drawCursorTri(ctx,x,y,col||UI_COL.text);return;}
  ctx.save();ctx.fillStyle=col||UI_COL.text;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+5,y+3.5);ctx.lineTo(x,y+7);ctx.closePath();ctx.fill();ctx.restore();
}
function _arrow(x,y,up,col){ctx.save();ctx.fillStyle=col||UI_COL.text;ctx.beginPath();
  if(up){ctx.moveTo(x-4,y+4);ctx.lineTo(x+4,y+4);ctx.lineTo(x,y);}else{ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.lineTo(x,y+4);}
  ctx.closePath();ctx.fill();ctx.restore();}
function _inside(ev,x,y,w,h){return ev.x>=x&&ev.x<x+w&&ev.y>=y&&ev.y<y+h;}

// ---------- widget stack ----------
function pushWidget(w){return new Promise(res=>{w._res=res;ui.push(w);});}
function closeWidget(w,value){const i=ui.indexOf(w);if(i>=0)ui.splice(i,1);if(w.onClose)try{w.onClose(value);}catch(e){console.error(e);}
  if(w._res){const r=w._res;w._res=null;r(value);}}
function closeAllWidgets(){while(ui.length)closeWidget(ui[ui.length-1],-1);}

// ---------- message box ----------
const MSG={x:4,y:H-62,w:W-8,h:58};
function _drawMsgBox(lines,chars,done,opt){
  opt=opt||{};const b=opt.box||MSG;panel(b.x,b.y,b.w,b.h,opt);
  const col=opt.dark?UI_COL.dtext:UI_COL.text,sh=opt.dark?UI_COL.dshadow:UI_COL.shadow;
  let left=chars==null?1e9:chars;
  for(let i=0;i<lines.length;i++){
    const s=lines[i];if(left<=0)break;const part=s.slice(0,left);left-=s.length;
    txt(part,b.x+12,b.y+10+i*UI_LH,col,'left',FONT,sh);
  }
  if(done&&opt.arrow!==false&&(now()*2.5|0)%2===0){
    ctx.save();ctx.fillStyle='#e05038';const ax=b.x+b.w-16,ay=b.y+b.h-14;
    ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+8,ay);ctx.lineTo(ax+4,ay+5);ctx.closePath();ctx.fill();ctx.restore();
  }
}
function say(text,o){
  o=o||{};
  const lines=wrap(text,MSG.w-28),pages=[];
  for(let i=0;i<lines.length;i+=3)pages.push(lines.slice(i,i+3));
  if(!pages.length)pages.push(['']);
  const w={pg:0,c:0,done:false,wait:0,snd:0,
    pageLen(){return pages[this.pg].reduce((a,s)=>a+s.length,0);},
    update(dt){
      if(this!==ui[ui.length-1]&&!o.bg)return;
      if(!this.done){
        const sp=[30,60,120,1e9][clamp(SET.textSpeed|0,0,3)];
        const prev=this.c|0;this.c+=sp*dt;const L=this.pageLen();
        if(this.c>=L){this.c=L;this.done=true;this.wait=0;}
        const cur=this.c|0;if(sp<1e8&&cur>prev){this.snd+=cur-prev;if(this.snd>=4){this.snd=0;_usfx('text');}}
      }else if(o.auto&&SET.autoText){this.wait+=dt;if(this.wait>=0.8)this.advance(true);}
    },
    advance(silent){
      if(!this.done){this.c=this.pageLen();this.done=true;this.wait=0;return;}
      if(this.pg<pages.length-1){this.pg++;this.c=0;this.done=false;this.wait=0;if(!silent)_usfx('ok');return;}
      closeWidget(this,true);
    },
    draw(){_drawMsgBox(pages[this.pg],this.c|0,this.done,o);},
    input(a,rep){if(rep)return;if(a==='ok'||a==='back')this.advance();},
    mouse(ev){if(ev.type==='click'||ev.type==='dblclick'){this.advance();return true;}if(ev.type==='down'||ev.type==='context')return true;return false;}
  };
  return pushWidget(w);
}

// ---------- menu ----------
function _norm(it){return typeof it==='object'&&it!==null?it:{label:String(it)};}
function menu(o){
  o=Object.assign({cols:1,rowH:14,idx:0,cancel:true},o||{});
  const cols=Math.max(1,o.cols|0);
  const titleH=o.title?16:0;
  const items=()=>(o.items||[]).map(_norm);
  // geometry
  let its=items();
  const nRowsAll=Math.max(1,Math.ceil(its.length/cols));
  let maxRows=o.maxRows||(o.h?Math.max(1,Math.floor((o.h-12-titleH)/o.rowH)):Math.min(nRowsAll,Math.floor((H-30-titleH)/o.rowH)));
  let w=o.w;
  if(!w){let mw=0;for(const it of its){const lw=textW(L2(it.label))+(it.r!=null?textW(L2(it.r))+16:0);if(lw>mw)mw=lw;}
    if(o.title)mw=Math.max(mw,textW(L2(o.title)));w=Math.min(W-8,Math.ceil(mw*cols+(cols-1)*12+30));}
  const h=o.h||(maxRows*o.rowH+12+titleH+(nRowsAll>maxRows?6:0));
  const x=o.x!=null?o.x:W-w-4;
  const y=o.y!=null?o.y:(o.prompt?H-h-4:H-h-4);
  const cellW=(w-20)/cols;
  const m={o,idx:clamp(o.idx|0,0,Math.max(0,its.length-1)),top:0,dragAcc:0,x,y,w,h,
    get items(){return items();},
    ensure(){const n=items().length;this.idx=clamp(this.idx,0,Math.max(0,n-1));const r=Math.floor(this.idx/cols);
      if(r<this.top)this.top=r;if(r>=this.top+maxRows)this.top=r-maxRows+1;
      const nr=Math.ceil(n/cols);this.top=clamp(this.top,0,Math.max(0,nr-maxRows));},
    setIdx(i,snd){const n=items().length;if(!n)return;i=clamp(i,0,n-1);if(i===this.idx)return;this.idx=i;this.ensure();
      if(snd!==false)_usfx('move');if(o.onMove)o.onMove(i);},
    choose(){const it=items()[this.idx];if(!it)return;if(it.disabled){_usfx('deny');return;}_usfx('ok');closeWidget(this,this.idx);},
    cancelMenu(){if(!o.cancel)return;_usfx('back');closeWidget(this,-1);},
    input(a,rep){
      const n=items().length;if(!n){if(a==='back')this.cancelMenu();return;}
      const r=Math.floor(this.idx/cols),c=this.idx%cols,nr=Math.ceil(n/cols);
      if(a==='up'){if(r>0)this.setIdx(this.idx-cols);else if(cols===1&&!rep&&n>1)this.setIdx(n-1);}
      else if(a==='down'){if(this.idx+cols<n)this.setIdx(this.idx+cols);else if(cols>1&&r<nr-1)this.setIdx(n-1);else if(cols===1&&!rep&&n>1)this.setIdx(0);}
      else if(a==='left'){if(cols>1){if(c>0)this.setIdx(this.idx-1);}else if(maxRows<n)this.setIdx(this.idx-maxRows);}
      else if(a==='right'){if(cols>1){if(c<cols-1&&this.idx+1<n)this.setIdx(this.idx+1);}else if(maxRows<n)this.setIdx(this.idx+maxRows);}
      else if(a==='ok'&&!rep)this.choose();
      else if(a==='back'&&!rep)this.cancelMenu();
    },
    hit(ev){const its=items();const oy=this.y+6+titleH,ox=this.x+10;
      if(!_inside(ev,ox,oy,this.w-20,maxRows*o.rowH))return -1;
      const r=Math.floor((ev.y-oy)/o.rowH)+this.top,c=clamp(Math.floor((ev.x-ox)/cellW),0,cols-1),i=r*cols+c;return i<its.length?i:-1;},
    mouse(ev){
      const inBox=_inside(ev,this.x,this.y,this.w,this.h);
      if(ev.type==='move'){const i=this.hit(ev);if(i>=0)this.setIdx(i);return inBox;}
      if(ev.type==='click'){const i=this.hit(ev);if(i>=0){this.setIdx(i,false);this.choose();return true;}
        // click on scroll arrows
        if(inBox){if(ev.y<this.y+12+titleH)this.scroll(-1);else if(ev.y>this.y+this.h-10)this.scroll(1);}return true;}
      if(ev.type==='wheel'){this.scroll(ev.delta>0?1:-1);return true;}
      if(ev.type==='drag'&&inBox){this.dragAcc+=ev.dy||0;while(this.dragAcc>o.rowH){this.dragAcc-=o.rowH;this.scroll(-1);}while(this.dragAcc<-o.rowH){this.dragAcc+=o.rowH;this.scroll(1);}return true;}
      if(ev.type==='context'){if(o.cancel)this.cancelMenu();return true;}
      if(ev.type==='down')return true;
      return inBox;
    },
    scroll(d){const n=items().length,nr=Math.ceil(n/cols);if(nr<=maxRows){this.setIdx(this.idx+d*cols);return;}
      const nt=clamp(this.top+d,0,nr-maxRows);if(nt===this.top)return;this.top=nt;const r=Math.floor(this.idx/cols);
      let ni=this.idx;if(r<nt)ni=this.idx+(nt-r)*cols;else if(r>=nt+maxRows)ni=this.idx-(r-nt-maxRows+1)*cols;
      ni=clamp(ni,0,n-1);if(ni!==this.idx){this.idx=ni;_usfx('move');if(o.onMove)o.onMove(ni);}},
    draw(){
      const its=items();this.ensure();
      const dark=o.dark!==false,col=dark?UI_COL.dtext:UI_COL.text,sh=dark?UI_COL.dshadow:UI_COL.shadow;
      if(o.prompt){
        let pw=o.promptW;if(!pw){const overl=this.y+this.h>MSG.y&&this.x>W*0.35;pw=overl?this.x-MSG.x-22:MSG.w-28;}
        _drawMsgBox(wrap(L2(o.prompt),pw).slice(0,3),null,false,{dark:o.promptDark,arrow:false});
      }
      if(!o.noBox)panel(this.x,this.y,this.w,this.h,{dark});
      if(o.title){txt(L2(o.title),this.x+10,this.y+7,dark?UI_COL.dgold:col,'left',FONT,sh);
        ctx.fillStyle=dark?'rgba(188,212,255,0.4)':UI_COL.blue;ctx.fillRect(this.x+6,this.y+titleH+3,this.w-12,1);}
      const oy=this.y+6+titleH,ox=this.x+10;
      for(let r=0;r<maxRows;r++){for(let c=0;c<cols;c++){
        const i=(this.top+r)*cols+c;if(i>=its.length)break;const it=its[i];
        const rx=ox+c*cellW,ry=oy+r*o.rowH,sel=i===this.idx;
        if(o.drawRow){o.drawRow(o.items[i],i,rx,ry,cellW,o.rowH,sel);if(sel&&o.cursor)_cursor(rx,ry+(o.rowH-7)/2|0,col);continue;}
        const ty=ry+Math.floor((o.rowH-8)/2);
        const gr=dark?UI_COL.dgray:UI_COL.gray,tc=it.disabled?gr:(it.col||col);
        txt(L2(it.label),rx+9,ty,tc,'left',FONT,it.disabled?null:sh);
        if(it.r!=null)txt(L2(it.r),rx+cellW-4,ty,it.disabled?gr:col,'right',FONT,it.disabled?null:sh);
        if(sel){if(dark){ctx.fillStyle='rgba(243,210,122,0.12)';ctx.fillRect(rx+5,ry,cellW-6,o.rowH);}_cursor(rx,ty,dark?UI_COL.dgold:col);}
      }}
      const nr=Math.ceil(its.length/cols);
      if(this.top>0)_arrow(this.x+this.w/2,this.y+titleH+3+Math.sin(now()*6),true,dark?UI_COL.dgold:'#e05038');
      if(this.top+maxRows<nr)_arrow(this.x+this.w/2,this.y+this.h-9-Math.sin(now()*6)*0.8,false,dark?UI_COL.dgold:'#e05038');
      if(o.info)o.info(this.idx);
    }
  };
  m.ensure();
  if(o.onMove)o.onMove(m.idx);
  o._w=m;
  return pushWidget(m);
}
function ask(q,o){
  o=o||{};const items=[t('u_yes'),t('u_no')];
  const w=Math.ceil(Math.max(textW(items[0]),textW(items[1])))+30,h=2*14+12;
  return menu({items,prompt:q,x:W-w-4,y:MSG.y-h-2,w,h,idx:o.idx||0,cancel:o.cancel!==false}).then(i=>i===0);
}
// numberPicker({min,max,val,x,y,w,label,fmt(n)}) → Promise<n|-1>
function numberPicker(o){
  o=Object.assign({min:1,max:99,val:1},o||{});
  const w=o.w||96,h=o.label?40:26,x=o.x!=null?o.x:W-w-4,y=o.y!=null?o.y:MSG.y-h-2;
  const p={v:clamp(o.val,o.min,o.max),
    set(v){v=clamp(v,o.min,o.max);if(v!==this.v){this.v=v;_usfx('move');}},
    input(a,rep){
      if(a==='up')this.set(this.v>=o.max&&!rep?o.min:this.v+1);else if(a==='down')this.set(this.v<=o.min&&!rep?o.max:this.v-1);
      else if(a==='right')this.set(this.v+10);else if(a==='left')this.set(this.v-10);
      else if(a==='ok'&&!rep){_usfx('ok');closeWidget(this,this.v);}else if(a==='back'&&!rep){_usfx('back');closeWidget(this,-1);}},
    mouse(ev){if(ev.type==='wheel'){this.set(this.v+(ev.delta>0?-1:1));return true;}
      if(ev.type==='click'){if(_inside(ev,x,y,w,h)){if(ev.y<y+h/2-4&&o.label)return true;if(ev.x<x+22)this.set(this.v-1);else if(ev.x>x+w-22)this.set(this.v+1);else{_usfx('ok');closeWidget(this,this.v);}}return true;}
      if(ev.type==='context'){_usfx('back');closeWidget(this,-1);return true;}return ev.type==='down';},
    draw(){panel(x,y,w,h,{dark:true});let yy=y+9;if(o.label){txt(L2(o.label),x+10,yy,UI_COL.dgold,'left',FONT,UI_COL.dshadow);yy+=14;}
      const s=o.fmt?o.fmt(this.v):'×'+String(this.v).padStart(2,'0');
      txt(s,x+w/2,yy,UI_COL.dtext,'center',FONT,UI_COL.dshadow);
      const b=Math.sin(now()*6)*0.8;_arrow(x+12,yy+2-b,true,UI_COL.dgold);_arrow(x+w-12,yy+2+b,false,UI_COL.dgold);}
  };
  return pushWidget(p);
}

// ---------- timed effects (not in the stack) ----------
const _fx={trans:null,cover:0,banners:[],big:[],toasts:[]};
let fadeOverlay={a:0,col:'#000000',from:0,to:0,t:0,d:0,res:null};
function fadeTo(a,ms,col){return new Promise(res=>{const f=fadeOverlay;if(f.res)f.res();f.from=f.a;f.to=clamp(a,0,1);f.t=0;f.d=Math.max(0.001,(ms==null?400:ms)/1000);if(col)f.col=col;f.res=res;});}
const fadeOut=(ms,col)=>fadeTo(1,ms,col);
const fadeIn=ms=>fadeTo(0,ms);
function transition(dir,ms){
  return new Promise(res=>{if(_fx.trans&&_fx.trans.res)_fx.trans.res();
    _fx.trans={dir:dir==='out'?'out':'in',t:0,d:(ms||450)/1000,res};});
}
function banner(top,main,o){o=o||{};return new Promise(res=>{_fx.banners=[{top:L2(top)||'',main:L2(main)||'',col:o.color||'#e8d8a8',d:o.dur||3.6,t:0,res}];});}
function bigText(text,o){o=o||{};return new Promise(res=>{_fx.big.push({text:L2(text),col:o.color||'#b01818',sub:o.sub?L2(o.sub):'',d:o.dur||5,t:0,res});});}
function toast(text,dur){_fx.toasts.push({text:L2(text),t:0,d:dur||2});if(_fx.toasts.length>4)_fx.toasts.shift();}

function uiUpdate(dt){
  const ws=ui.slice();for(let i=ws.length-1;i>=0;i--){const w=ws[i];if(ui.indexOf(w)>=0&&w.update){try{w.update(dt);}catch(e){console.error(e);}}}
  const tr=_fx.trans;
  if(tr){tr.t+=dt;const p=clamp(tr.t/tr.d,0,1);_fx.cover=tr.dir==='in'?p:1-p;if(p>=1){_fx.trans=null;if(tr.res)tr.res();}}
  const f=fadeOverlay;if(f.res||f.t<f.d){f.t+=dt;const p=clamp(f.t/f.d,0,1);f.a=lerp(f.from,f.to,p);if(p>=1&&f.res){const r=f.res;f.res=null;r();}}
  for(const arr of [_fx.banners,_fx.big]){for(let i=arr.length-1;i>=0;i--){const b=arr[i];b.t+=dt;if(b.t>=b.d){arr.splice(i,1);if(b.res)b.res();}}}
  for(let i=_fx.toasts.length-1;i>=0;i--){const q=_fx.toasts[i];q.t+=dt;if(q.t>=q.d)_fx.toasts.splice(i,1);}
}
function _env(t,d,fi,fo){return clamp(Math.min(t/fi,(d-t)/fo),0,1);}
function _spaced(s,x,y,sp,align){ // letter-spaced text, current font/fill
  let tw=0;const ws=[];for(const ch of s){const cw=ctx.measureText(ch).width;ws.push(cw);tw+=cw+sp;}tw-=sp;
  let cx=align==='center'?x-tw/2:align==='right'?x-tw:x;ctx.textAlign='left';let k=0;
  for(const ch of s){ctx.fillText(ch,cx,y);cx+=ws[k++]+sp;}return tw;
}
function _drawTransition(p){
  if(p<=0)return;ctx.save();ctx.fillStyle='#000';
  const n=9,bh=H/n,sk=60;
  for(let i=0;i<n;i++){
    const q=clamp(p*1.6-(i%2?0.06:0)-Math.abs(i-(n-1)/2)*0.05,0,1);if(q<=0)continue;
    const ease=1-Math.pow(1-q,3);const len=(W+sk+4)*ease;const y0=i*bh-0.5,y1=(i+1)*bh+0.5;
    ctx.beginPath();
    if(i%2===0){ctx.moveTo(-sk,y0);ctx.lineTo(-sk+len,y0);ctx.lineTo(-sk+len+sk*0.5,y1);ctx.lineTo(-sk,y1);}
    else{ctx.moveTo(W+sk,y0);ctx.lineTo(W+sk-len-sk*0.5,y0);ctx.lineTo(W+sk-len,y1);ctx.lineTo(W+sk,y1);}
    ctx.closePath();ctx.fill();
  }
  if(p>=1)ctx.fillRect(0,0,W,H);
  ctx.restore();
}
function _band(cy,bh,a,lines){
  const g=ctx.createLinearGradient(0,cy-bh/2,0,cy+bh/2);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.22,'rgba(0,0,0,0.72)');g.addColorStop(0.78,'rgba(0,0,0,0.72)');g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(0,cy-bh/2,W,bh);
  if(lines){for(const ly of [cy-bh/2+bh*0.16,cy+bh/2-bh*0.16]){const lg=ctx.createLinearGradient(0,0,W,0);
    lg.addColorStop(0,'rgba(200,170,90,0)');lg.addColorStop(0.5,'rgba(230,200,120,0.9)');lg.addColorStop(1,'rgba(200,170,90,0)');
    ctx.fillStyle=lg;ctx.fillRect(W*0.12,Math.round(ly),W*0.76,1);}}
}
function _drawBanner(b){
  const a=_env(b.t,b.d,0.8,1.0);if(a<=0)return;ctx.save();
  const cy=Math.round(H*0.42),bh=74;_band(cy,bh,a,true);
  ctx.globalAlpha=a;ctx.textBaseline='middle';
  if(b.top){ctx.font='8px Cinzel, Georgia, serif';ctx.fillStyle='#b8a880';_spaced(b.top.toUpperCase(),W/2,cy-14,3,'center');}
  let fs=22;ctx.font=fs+'px Cinzel, Georgia, serif';while(fs>12&&ctx.measureText(b.main).width+b.main.length*1.5>W-60){fs--;ctx.font=fs+'px Cinzel, Georgia, serif';}
  ctx.shadowColor='rgba(0,0,0,0.9)';ctx.shadowBlur=6;ctx.fillStyle=b.col;
  _spaced(b.main,W/2,b.top?cy+7:cy,1.5,'center');
  ctx.restore();
}
function _drawBig(b){
  const a=_env(b.t,b.d,1.4,1.2);if(a<=0)return;ctx.save();
  const cy=Math.round(H*0.48),bh=96;_band(cy,bh,a*0.95,false);
  ctx.globalAlpha=a;ctx.textBaseline='middle';
  const sc=1+0.06*(b.t/b.d);ctx.translate(W/2,cy-(b.sub?6:0));ctx.scale(sc,sc);
  let fs=38;const fit=()=>{ctx.font=fs+'px Cinzel, Georgia, serif';let tw=0;for(const ch of b.text)tw+=ctx.measureText(ch).width+3;return tw;};
  while(fs>14&&fit()>W-56)fs-=2;ctx.shadowColor=b.col;ctx.shadowBlur=14;ctx.fillStyle=b.col;
  _spaced(b.text,0,0,3,'center');ctx.shadowBlur=0;ctx.globalAlpha=a*0.35;ctx.fillStyle='#000';
  ctx.restore();
  if(b.sub){ctx.save();ctx.globalAlpha=a*clamp((b.t-0.6)/1,0,1);ctx.textBaseline='middle';ctx.font='9px Cinzel, Georgia, serif';ctx.fillStyle='#c8b890';
    _spaced(b.sub.toUpperCase(),W/2,cy+26,2.5,'center');ctx.restore();}
}
function _drawToasts(){
  let y=6;for(const q of _fx.toasts){const a=_env(q.t,q.d,0.15,0.4);const w=Math.min(W-16,Math.ceil(textW(q.text))+20);
    ctx.save();ctx.globalAlpha=a;panel(W/2-w/2,y-(1-a)*6,w,20,{dark:true});ctx.restore();
    ctx.save();ctx.globalAlpha=a;txt(q.text,W/2,y+6-(1-a)*6,UI_COL.dtext,'center',FONT,UI_COL.dshadow);ctx.restore();y+=23;}
}
function uiRender(){
  ctx.save();ctx.imageSmoothingEnabled=false;
  for(const w of ui.slice()){try{ctx.save();w.draw();ctx.restore();}catch(e){ctx.restore();console.error(e);}}
  _drawTransition(_fx.cover);
  const f=fadeOverlay;if(f.a>0){ctx.globalAlpha=f.a;ctx.fillStyle=f.col;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  for(const b of _fx.banners)_drawBanner(b);
  for(const b of _fx.big)_drawBig(b);
  _drawToasts();
  ctx.restore();
}

// ---------- starter selection ----------
function pickStarter(ids){
  const n=ids.length,gap=Math.min(150,(W-40)/n),px=i=>W/2+(i-(n-1)/2)*gap,py=150;
  const spName=id=>{const s=typeof SPECIES!=='undefined'&&SPECIES[id];return s?L2(s.name):id;};
  const spType=id=>{const s=typeof SPECIES!=='undefined'&&SPECIES[id];return s?s.t:'normal';};
  const w={idx:0,t:0,
    update(dt){this.t+=dt;},
    set(i){i=(i+n)%n;if(i!==this.idx){this.idx=i;_usfx('move');}},
    input(a,rep){if(a==='left'||a==='up')this.set(this.idx-1);else if(a==='right'||a==='down')this.set(this.idx+1);
      else if(a==='ok'&&!rep){_usfx('ok');closeWidget(this,this.idx);}},
    hit(ev){for(let i=0;i<n;i++)if(Math.abs(ev.x-px(i))<gap/2&&ev.y>50&&ev.y<H-50)return i;return -1;},
    mouse(ev){const i=this.hit(ev);if(ev.type==='move'){if(i>=0)this.set(i);return true;}
      if(ev.type==='click'){if(i>=0){if(i!==this.idx)this.set(i);else{_usfx('ok');closeWidget(this,i);}}return true;}
      if(ev.type==='wheel'){this.set(this.idx+(ev.delta>0?1:-1));return true;}return true;},
    draw(){
      const g=ctx.createRadialGradient(W/2,H*0.55,20,W/2,H*0.55,W*0.6);g.addColorStop(0,'rgba(30,30,50,0.55)');g.addColorStop(1,'rgba(0,0,8,0.88)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      panel(W/2-130,10,260,24);txt(t('u_pick'),W/2,18,UI_COL.text,'center',FONT,true);
      for(let i=0;i<n;i++){
        const id=ids[i],sel=i===this.idx,x=px(i),tp=spType(id),tc=(typeof TYPE_COL!=='undefined'&&TYPE_COL[tp])||'#888';
        // light beam behind selected
        if(sel){const lg=ctx.createLinearGradient(0,40,0,py+10);lg.addColorStop(0,'rgba(255,240,200,0)');lg.addColorStop(1,'rgba(255,240,200,0.22)');
          ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(x-18,40);ctx.lineTo(x+18,40);ctx.lineTo(x+50,py+6);ctx.lineTo(x-50,py+6);ctx.closePath();ctx.fill();}
        // pedestal
        ctx.save();
        ctx.fillStyle='#2a2630';ctx.beginPath();ctx.ellipse(x,py+12,46,11,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#5a5466';ctx.fillRect(x-44,py,88,12);
        ctx.fillStyle=sel?shade(tc,-0.1):'#8a8496';ctx.beginPath();ctx.ellipse(x,py,44,10,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=sel?shade(tc,0.35):'#aaa4b6';ctx.beginPath();ctx.ellipse(x,py-1,36,7,0,0,Math.PI*2);ctx.fill();
        ctx.restore();
        // monster ×3
        let c=null;try{if(typeof monSprite==='function')c=monSprite(id);}catch(e){}
        if(c){const k=3,bob=sel?Math.round(Math.sin(this.t*5)*2.5)-2:0;ctx.save();ctx.imageSmoothingEnabled=false;if(!sel)ctx.globalAlpha=0.6;
          ctx.fillStyle='rgba(0,0,0,0.3)';ctx.beginPath();ctx.ellipse(x,py,c.width*k*0.32,5,0,0,Math.PI*2);ctx.fill();
          ctx.drawImage(c,Math.round(x-c.width*k/2),Math.round(py-c.height*k+4+bob),c.width*k,c.height*k);ctx.restore();}
        // name + type
        const nm=spName(id);txt(nm,x,py+28,sel?'#ffffff':'#9890a8','center',FONT,'#000');
        const bw=textW(L2((typeof TYPE_N!=='undefined'&&TYPE_N[tp])||tp).toUpperCase())+10;
        ctx.save();if(!sel)ctx.globalAlpha=0.6;typeBadge(tp,Math.round(x-bw/2),py+42);ctx.restore();
        if(sel)_cursor(x-textW(nm)/2-12,py+28,'#ffd860');
      }
      txt(t('u_pick_hint'),W/2,H-16,'#8880a0','center',FONT,'#000');
    }
  };
  return pushWidget(w);
}
