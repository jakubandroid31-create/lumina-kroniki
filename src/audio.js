// ===================== AUDIO (original chiptune, Web Audio synthesis) =====================
// All melodies are generated/hand-written for LUMINA. Royalty-free by construction.
const AU={ctx:null,comp:null,master:null,music:null,sfx:null,jing:null,noise:null,waves:{},cur:null,want:null,
  timer:null,custom:null,jingle:false,jTok:0,resumeKey:null,lastSfx:{},songs:{},listen:false};

const AU_SCALES={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],harm:[0,2,3,5,7,8,11],dorian:[0,2,3,5,7,9,10],
  mixo:[0,2,4,5,7,9,10],phrygdom:[0,1,4,5,7,8,10],lydian:[0,2,4,6,7,9,11]};
function auDegSemi(sc,deg){const n=sc.length,o=Math.floor(deg/n);return o*12+sc[((deg%n)+n)%n];}

// ---------- track definitions ----------
// prog: 8 bars of chord scale-degrees (0-based); [a,b] = two half-bar chords.
// hand: {A,A2,B} full hand-written phrases (4 bars each, "deg:len16ths", r=rest); motif: hand-written A only.
const MUSIC_DEFS={
  menu:{bpm:62,root:50,scale:'harm',prog:[0,3,4,0,5,3,4,[4,0]],seed:101,
    lead:{w:'tri',v:.2,vib:.35,leg:.96,att:.03,rel:.25},bass:'slow',bassV:.2,drum:'none',
    pad:'tri',padV:.035,padOct:[0,12],padA:.35,bells:1,bellV:.035,echo:.5,
    hand:{A:'0:6 1:2 2:4 4:4  3:8 2:4 1:4  6:6 4:2 1:4 -1:4  0:12 r:4',
          A2:'5:6 4:2 2:4 0:4  3:6 4:2 5:4 3:4  4:8 6:4 8:4  7:4 6:4 7:8',
          B:'7:4 9:4 8:4 7:4  7:6 5:2 3:8  6:4 4:4 6:4 8:4  7:8 4:4 2:4'}},
  story:{bpm:84,root:53,scale:'major',prog:[0,5,3,4,0,2,3,[4,0]],seed:202,density:.42,
    lead:{w:'tri',v:.19,vib:.25,leg:.92,att:.02,rel:.15},bass:'slow',drum:'none',arp:2,arpW:'p12',arpV:.03,arpPat:[0,2,4,2],
    pad:'p50',padV:.018,padA:.4,echo:.3},
  lvl1:{bpm:118,root:48,leadOct:2,scale:'major',prog:[0,3,4,0,5,3,1,[4,0]],seed:311,density:.68,
    lead:{w:'p25',v:.1},bass:'walk',drum:'basic',pad:null},
  lvl2:{bpm:96,root:52,scale:'dorian',prog:[0,3,0,3,6,2,3,[4,0]],seed:422,density:.58,
    lead:{w:'tri',v:.21,vib:.6,leg:.94,att:.02,rel:.1},bass:'bounce',drum:'light',arp:2,arpW:'p12',arpV:.03,arpOct:2},
  lvl3:{bpm:70,root:45,scale:'minor',prog:[0,5,3,4,0,5,6,[4,0]],seed:533,density:.3,
    lead:{w:'p50',v:.075,leg:.8,rel:.2},bass:'slow',drum:'sparse',pad:'tri',padV:.04,padA:.6,echo:.6},
  lvl4:{bpm:126,root:55,scale:'mixo',prog:[0,6,3,0,0,6,4,[3,0]],seed:644,density:.7,swing:.22,
    lead:{w:'p25',v:.095,leg:.75},bass:'bounce',drum:'basic',arp:1,arpW:'p12',arpV:.025,arpPat:[0,4,2,4]},
  lvl5:{bpm:104,root:52,scale:'phrygdom',prog:[0,1,0,6,0,1,5,[1,0]],seed:755,density:.55,
    lead:{w:'p12',v:.1,vib:.45},bass:'pulse',drum:'tribal',echo:.25},
  lvl6:{bpm:150,root:49,scale:'minor',majV:1,prog:[0,5,6,0,0,5,3,[4,4]],seed:866,density:.74,
    lead:{w:'p25',v:.09,leg:.85},dbl:'p12',bass:'drive',drum:'drive',arp:1,arpW:'p12',arpV:.022},
  lvl7:{bpm:88,root:53,scale:'lydian',prog:[0,1,0,1,4,1,5,[1,0]],seed:977,density:.45,
    lead:{w:'tri',v:.2,vib:.25,leg:.9,rel:.2},bass:'slow',drum:'light',pad:'p50',padV:.02,padA:.5,bells:1,bellV:.04,echo:.4},
  lvl8:{bpm:78,root:47,scale:'harm',prog:[0,3,4,0,5,1,4,[4,0]],seed:1088,density:.38,
    lead:{w:'p12',v:.085,vib:.6,leg:.9,rel:.2},bass:'pulse',bassV:.16,drum:'sparse',pad:'tri',padV:.035,padA:.5,echo:.55},
  lvl9:{bpm:132,root:50,scale:'major',prog:[0,4,5,3,0,4,3,[4,0]],seed:1199,density:.6,
    lead:{w:'p50',v:.075},bass:'pulse',drum:'basic',arp:1,arpW:'p25',arpV:.022,arpOct:2,arpPat:[0,2,4,7,9,7,4,2],pad:'tri',padV:.03,echo:.2},
  lvl10:{bpm:108,root:43,leadOct:2,scale:'minor',majV:1,prog:[0,6,5,4,0,3,4,[4,0]],seed:1210,density:.6,
    lead:{w:'p25',v:.09},dbl:'p50',bass:'pulse',drum:'march',pad:'p50',padV:.018},
  battle:{bpm:160,root:45,leadOct:2,scale:'minor',majV:1,prog:[0,5,6,0,3,5,4,[4,4]],seed:1321,density:.8,
    lead:{w:'p25',v:.09,leg:.85},bass:'drive',drum:'drive',arp:1,arpW:'p12',arpV:.022},
  trainer:{bpm:148,root:47,leadOct:2,scale:'dorian',prog:[0,3,0,6,0,3,5,[4,4]],seed:1432,density:.75,swing8:.3,
    lead:{w:'p12',v:.1,leg:.8},dbl:'p25',bass:'bounce',drum:'basic',arp:2,arpW:'p50',arpV:.02,arpOct:2},
  boss:{bpm:170,root:40,leadOct:2,scale:'harm',prog:[0,0,5,4,0,0,3,[4,4]],seed:1543,
    lead:{w:'p25',v:.1,leg:.85},dbl:'p12',bass:'drive',drum:'drive',arp:1,arpW:'p12',arpV:.022,arpOct:2,
    hand:{A:'7:2 7:2 6:2 7:2 4:4 2:2 4:2  0:2 2:2 4:2 7:2 9:4 8:2 7:2  5:4 7:2 9:2 12:4 9:2 7:2  6:6 4:2 3:2 2:2 1:2 -1:2',
          A2:'7:2 r:2 7:2 9:2 11:4 9:2 7:2  8:2 7:2 6:2 7:2 4:8  3:4 5:2 7:2 10:4 7:4  6:4 8:4 11:4 6:4',
          B:'4:3 4:3 4:2 7:3 6:3 4:2  2:3 2:3 2:2 4:3 2:3 1:2  5:3 5:3 5:2 9:3 7:3 5:2  4:4 6:4 8:4 6:2 4:2'}},
  final:{bpm:156,root:36,leadOct:2,scale:'minor',majV:1,seed:1654,density:.78,
    lead:{w:'p25',v:.1,leg:.88},dbl:'p12',bass:'drive',arp:1,arpW:'p12',arpV:.02,arpOct:2,pad:'p50',padV:.015,
    parts:[{prog:[0,5,6,4,0,5,3,[4,4]],drum:'drive',motif:'4:4 7:4 9:6 8:2  7:6 5:2 2:4 0:4  6:4 8:4 10:4 8:2 6:2  4:6 6:2 8:8'},
           {root:38,seed:1765,prog:[5,6,0,0,5,6,4,[4,0]],drum:'march',bass:'walk',density:.7,
            motif:'5:4 7:4 9:8  6:4 8:4 10:6 9:2  7:2 9:2 11:4 9:4 7:4  11:12 r:4'}]},
  ending:{bpm:76,root:51,scale:'major',prog:[0,5,3,4,0,2,3,[4,0]],seed:1876,density:.45,
    lead:{w:'tri',v:.21,vib:.3,leg:.94,att:.02,rel:.2},bass:'slow',drum:'light',arp:2,arpW:'p12',arpV:.028,
    pad:'p50',padV:.02,padA:.5,echo:.3}
};

const AU_RH=[
  [[16],[8,8],[12,4],[4,4,8],[8,4,4],[6,2,8]],
  [[4,4,4,4],[6,2,4,4],[4,2,2,8],[8,4,4],[4,4,8],[2,2,4,8],[6,2,6,2]],
  [[2,2,2,2,4,4],[4,2,2,4,2,2],[2,2,4,2,2,4],[3,3,2,4,4],[4,2,2,2,2,4],[3,3,2,2,2,4]]];
const AU_CAD=[[8,8],[4,12],[6,2,8],[4,4,8],[2,2,4,8]];
const AU_DRUMS={
  none:{},
  light:{k:'x.......x.......',h:'..o...o...o...o.'},
  sparse:{k:'x...............',s2:'........o.......',h:'......o.........'},
  basic:{k:'x.......x.x.....',s:'....x.......x...',h:'o.o.o.o.o.o.o.o.',fill:'....x.......x.xx'},
  drive:{k:'x...x...x...x.x.',s:'....x.......x...',h:'oxoxoxoxoxoxoxox',fill:'....x...x.x.xxxx'},
  tribal:{k:'x..x..x...x..x..',t:'....x..x.x....x.',h:'o.o.o.o.o.o.o.o.',fill:'x.x.x.xxx.x.xxxx'},
  march:{k:'x...x...x...x...',s:'....x..o....x.oo',h:'o.......o.......',fill:'x.x.x.x.xxxxxxxx'}};

function auParseHand(str,bar0){const out=[];let s=bar0*16;
  for(const tk of str.trim().split(/\s+/)){const[a,b]=tk.split(':');const len=+b;out.push({s,len,deg:a==='r'?null:+a});s+=len;}return out;}

function auMelody(d,r,chordAt){
  const dens=d.density==null?.6:d.density;
  const tier=()=>{const x=dens+(r()-.5)*.3;return x<.42?0:x<.72?1:2;};
  const pickR=()=>pick(AU_RH[tier()],r);
  const lo=d.lo==null?-2:d.lo,hi=d.hi==null?10:d.hi;
  const isCT=(g,c)=>{const x=((g-c)%7+7)%7;return x===0||x===2||x===4;};
  const snap=(g,c)=>{if(isCT(g,c))return g;for(let k=1;k<4;k++){const a=isCT(g+k,c),b=isCT(g-k,c);
    if(a&&b)return r()<.5?g+k:g-k;if(a)return g+k;if(b)return g-k;}return g;};
  const fold=g=>{if(g<lo)g=lo+(lo-g);if(g>hi)g=hi-(g-hi);return clamp(g,lo,hi);};
  let prev=d.start==null?4:d.start;
  const lastDeg=arr=>{for(let i=arr.length-1;i>=0;i--)if(arr[i].deg!=null)return arr[i].deg;return prev;};
  function bar(b,rh,target,mode){let s=0;const out=[];
    rh.forEach((len,k)=>{const last=k===rh.length-1,c=chordAt(b,s);let g;
      if(mode===2&&last){g=Math.abs(prev-7)<=Math.abs(prev)?7:0;}
      else if(s%8===0||(mode===1&&last)){const cand=[];let tw=0;
        for(let x=prev-4;x<=prev+4;x++){if(x<lo||x>hi||!isCT(x,c))continue;
          let w=1/(1+Math.abs(x-prev));if(x===prev)w*=.35;if((target-prev)*(x-prev)>0)w*=1.7;cand.push([x,w]);tw+=w;}
        g=prev;let q=r()*tw;for(const[x,w]of cand){q-=w;if(q<=0){g=x;break;}}if(!cand.length)g=snap(prev,c);}
      else{const mv=r()<.08?0:r()<.74?1:r()<.85?2:3;const up=target>prev?r()<.72:target<prev?r()<.28:r()<.5;g=fold(prev+(up?mv:-mv));}
      const rest=mode===0&&s%8!==0&&!last&&r()<(1-dens)*.22;
      out.push({s:b*16+s,len,deg:rest?null:g});if(!rest)prev=g;s+=len;});
    return out;}
  function refit(src,from,to,shift){const out=[];
    for(const n of src){if(Math.floor(n.s/16)!==from)continue;const st=n.s%16;let g=n.deg;
      if(g!=null){g=fold(g+(shift||0));if(st%8===0)g=snap(g,chordAt(to,st));}
      out.push({s:to*16+st,len:n.len,deg:g});}
    prev=lastDeg(out);return out;}
  if(d.hand){const A2=auParseHand(d.hand.A2,4);
    return [...auParseHand(d.hand.A,0),...A2,...auParseHand(d.hand.B,8),...auParseHand(d.hand.A2,12)];}
  let A;
  if(d.motif){A=auParseHand(d.motif,0);prev=lastDeg(A);}
  else{const r0=pickR(),r1=pickR();A=[...bar(0,r0,5,0),...bar(1,r1,6,0),...bar(2,r0,4,0),...bar(3,pick(AU_CAD,r),2,1)];}
  const Ap=[...refit(A,0,4),...refit(A,1,5)];Ap.push(...bar(6,pickR(),5,0));Ap.push(...bar(7,pick(AU_CAD,r),3,1));
  const b8=bar(8,pickR(),8,0);const B=[...b8,...bar(9,pickR(),7,0),...refit(b8,8,10,-1)];B.push(...bar(11,pick(AU_CAD,r),4,1));
  const A3=[...refit(Ap,4,12),...refit(Ap,5,13),...refit(Ap,6,14)];A3.push(...bar(15,pick(AU_CAD.slice(0,4).filter(x=>x[x.length-1]===8),r)||[8,8],0,2));
  return [...A,...Ap,...B,...A3];
}

function auGenPart(song,d,pi){
  const r=RNG((d.seed||hashStr(song.key))+pi*7919);
  const off=song.steps,BARS=16;
  const sc=AU_SCALES[d.scale]||AU_SCALES.major,prog=d.prog;
  const chordAt=(bar,st)=>{const c=prog[((bar%prog.length)+prog.length)%prog.length];return Array.isArray(c)?(st<8?c[0]:c[1]):c;};
  const scFor=c=>{if(d.majV&&((c%7)+7)%7===4&&sc[6]===10){const s=sc.slice();s[6]=11;return s;}return sc;};
  const semi=(deg,c)=>auDegSemi(scFor(c),deg);
  const add=(step,ev)=>{const s=off+step;(song.ev[s]||(song.ev[s]=[])).push(ev);};
  const echo=!!d.echo;
  // lead (+ optional harmony a diatonic third below)
  const L=Object.assign({w:'p25',v:.1,vib:0,leg:.88,att:.006,rel:.06},d.lead);
  const lb=d.root+12*(d.leadOct==null?1:d.leadOct);
  for(const n of auMelody(d,r,chordAt)){if(n.deg==null)continue;const st=n.s%16,c=chordAt(Math.floor(n.s/16),st);
    const acc=st%4===0?1:.82;
    add(n.s,{i:L.w,m:lb+semi(n.deg,c),d:n.len*L.leg,v:L.v*acc,a:L.att,r:L.rel,vib:L.vib,e:echo});
    if(d.dbl)add(n.s,{i:d.dbl,m:lb+semi(n.deg-2,c),d:n.len*L.leg,v:L.v*.45*acc,a:L.att,r:L.rel,vib:0,e:false});}
  // bass
  const bw=d.bassW||'tri',bv=d.bassV||.24;
  const bassNote=c=>{const s=((semi(c,c)%12)+12)%12;let m=d.root-12+s;if(s>7)m-=12;while(m<33)m+=12;return m;};
  const iv=(c,k)=>semi(c+k,c)-semi(c,c);
  const B=(st,len,m,v)=>add(st,{i:bw,m,d:len,v:bv*(v||1),a:.004,r:.04,vib:0,e:false});
  for(let b=0;b<BARS;b++){const o=b*16,st=d.bass||'slow';
    if(st==='slow'){const c0=chordAt(b,0),c1=chordAt(b,8);
      if(c0!==c1){B(o,7.6,bassNote(c0));B(o+8,7.6,bassNote(c1));}else B(o,15.5,bassNote(c0));}
    else if(st==='pulse'){for(let s=0;s<16;s+=2){const c=chordAt(b,s);B(o+s,1.4,bassNote(c),s%4===0?1:.7);}}
    else if(st==='drive'){const pat=[0,0,12,0,0,0,12,'5'];for(let j=0;j<8;j++){const s=j*2,c=chordAt(b,s),p=pat[j];
      B(o+s,1.5,bassNote(c)+(p==='5'?iv(c,4):p),j%2?.75:1);}}
    else if(st==='bounce'){for(const[s,k,l]of[[0,0,3],[4,12,1.5],[6,'5',1.5],[8,0,3],[12,12,1.5],[14,'5',1.5]]){
      const c=chordAt(b,s);B(o+s,l,bassNote(c)+(k==='5'?iv(c,4):k),s%8===0?1:.75);}}
    else if(st==='walk'){let pc=null;for(let j=0;j<4;j++){const s=j*4,c=chordAt(b,s),rt=bassNote(c);let m;
      if(j===0||c!==pc)m=rt;else if(j===1)m=rt+iv(c,2);else if(j===2)m=rt+iv(c,4);
      else{const nm=bassNote(chordAt(b+1,0));m=nm+(nm>rt+iv(c,4)?-1:nm===rt?7:1);}
      pc=c;B(o+s,3.2,m,j===0?1:.8);}}
  }
  // arpeggio
  if(d.arp){const stp=d.arp===1?1:2,pat=d.arpPat||[0,2,4,7,4,2],ab=d.root+12*(d.arpOct==null?1:d.arpOct);
    for(let s=0,j=0;s<BARS*16;s+=stp,j++){const c=chordAt(Math.floor(s/16),s%16);
      add(s,{i:d.arpW||'p12',m:ab+semi(c+pat[j%pat.length],c),d:stp*.7,v:(d.arpV||.025)*(s%4===0?1:.75),a:.003,r:.03,vib:0,e:echo});}}
  // pad
  if(d.pad){const offs=d.padOct||[0];
    for(let b=0;b<BARS;b++){const c0=chordAt(b,0),c1=chordAt(b,8),regs=c0===c1?[[0,16,c0]]:[[0,8,c0],[8,8,c1]];
      for(const[s,len,c]of regs)for(const k of[0,2,4])for(const oo of offs){
        let m=d.root+semi(c+k,c);if(m>d.root+14)m-=12;
        add(b*16+s,{i:d.pad,m:m+oo,d:len-.3,v:(d.padV||.03),a:d.padA||.25,r:.35,vib:0,e:false});}}}
  // bells
  if(d.bells){for(let s=0;s<BARS*16;s+=8){if(r()>.72)continue;const c=chordAt(Math.floor(s/16),s%16);
    add(s,{i:'bell',m:d.root+24+semi(c+pick([0,2,4,7],r),c),d:8,v:d.bellV||.04,a:.002,r:.3,vib:0,e:echo});}}
  // drums
  const P=AU_DRUMS[d.drum||'none']||{};
  for(let b=0;b<BARS;b++){const fill=b%8===7&&P.fill;
    for(const k of['k','s','s2','h','t']){let pat=P[k];if(k==='s'&&fill)pat=P.fill;if(k==='t'&&fill&&!P.s)pat=P.fill;
      if(!pat)continue;if(k==='s2'&&b%2===0)continue;
      for(let s=0;s<16;s++){const ch=pat[s];if(ch==='.')continue;
        add(b*16+s,{i:k==='s2'?'s':k,v:ch==='x'?1:.55});}}
    if(b===0&&(d.drum==='drive'||d.drum==='march'))add(0,{i:'c',v:.7});}
  song.steps+=BARS*16;song.bars+=BARS;
}

function auGenSong(key){
  if(AU.songs[key])return AU.songs[key];
  const base=MUSIC_DEFS[key];if(!base)return null;
  const parts=base.parts?base.parts.map(p=>Object.assign({},base,p,{parts:null})):[base];
  const song={key,bpm:base.bpm,stepDur:60/base.bpm/4,bars:0,steps:0,ev:[],swing:base.swing||0,swing8:base.swing8||0,echo:base.echo||0};
  parts.forEach((p,i)=>auGenPart(song,p,i));
  for(let i=0;i<song.steps;i++)if(!song.ev[i])song.ev[i]=[];
  AU.songs[key]=song;return song;
}

// ---------- synthesis primitives ----------
function _auPulse(c,duty){const N=48,re=new Float32Array(N+1),im=new Float32Array(N+1);
  for(let n=1;n<=N;n++){re[n]=Math.sin(2*Math.PI*n*duty)/(Math.PI*n);im[n]=(1-Math.cos(2*Math.PI*n*duty))/(Math.PI*n);}
  return c.createPeriodicWave(re,im);}
function _auSetup(c){
  AU.ctx=c;
  AU.comp=c.createDynamicsCompressor();AU.comp.threshold.value=-14;AU.comp.knee.value=12;AU.comp.ratio.value=4;
  AU.comp.attack.value=.004;AU.comp.release.value=.2;AU.comp.connect(c.destination);
  AU.master=c.createGain();AU.master.connect(AU.comp);
  for(const k of['music','sfx','jing']){AU[k]=c.createGain();AU[k].connect(AU.master);}
  const len=c.sampleRate|0,buf=c.createBuffer(1,len,c.sampleRate),dd=buf.getChannelData(0);
  for(let i=0;i<len;i++)dd[i]=Math.random()*2-1;AU.noise=buf;
  AU.waves={p12:_auPulse(c,.125),p25:_auPulse(c,.25),p50:_auPulse(c,.5)};
}
function _auOsc(w,f,t){const c=AU.ctx,o=c.createOscillator();
  if(w==='tri')o.type='triangle';else if(w==='sine')o.type='sine';else if(w==='saw')o.type='sawtooth';
  else o.setPeriodicWave(AU.waves[w]||AU.waves.p50);
  o.frequency.setValueAtTime(f,t);return o;}
function _auVoice(dst,send,w,f,t,dur,v,a,rel,vib){
  const c=AU.ctx;
  if(w==='bell'){const g=c.createGain(),o=_auOsc('tri',f,t),g2=c.createGain(),o2=_auOsc('sine',f*2,t);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.003);g.gain.setTargetAtTime(0,t+.003,.4);
    g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(v*.4,t+.002);g2.gain.setTargetAtTime(0,t+.002,.12);
    o.connect(g);o2.connect(g2);g.connect(dst);g2.connect(dst);if(send){g.connect(send);}
    o.start(t);o2.start(t);o.stop(t+2.2);o2.stop(t+.8);return;}
  const o=_auOsc(w,f,t),g=c.createGain();a=Math.max(.002,a||.005);rel=Math.max(.02,rel||.05);
  const end=t+Math.max(dur,a+.01);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setTargetAtTime(v*.72,t+a,Math.max(.04,dur*.4));
  g.gain.setTargetAtTime(0,end,rel/3);
  if(vib&&dur>.22){const l=c.createOscillator(),lg=c.createGain();l.frequency.value=5.2;
    lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,t+.14);lg.gain.linearRampToValueAtTime(f*.011*vib,t+.38);
    l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(end+rel+.05);}
  o.connect(g);g.connect(dst);if(send)g.connect(send);
  o.start(t);o.stop(end+rel+.05);
}
function _auNoise(dst,t,dur,v,type,freq,q,f1){const c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
  s.buffer=AU.noise;fl.type=type||'lowpass';fl.frequency.setValueAtTime(freq||2000,t);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+dur);
  fl.Q.value=q||.7;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  s.connect(fl);fl.connect(g);g.connect(dst);s.start(t,Math.random()*.5);s.stop(t+dur+.02);}
function _auSweep(dst,w,f0,f1,t,dur,v,att){const c=AU.ctx,o=_auOsc(w,f0,t),g=c.createGain();
  o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);att=att||.004;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  o.connect(g);g.connect(dst);o.start(t);o.stop(t+dur+.02);}
function _auDrum(dst,k,t,v){
  if(k==='k'){_auSweep(dst,'sine',160,42,t,.2,.42*v,.002);_auSweep(dst,'tri',90,40,t,.08,.18*v,.002);}
  else if(k==='s'){_auNoise(dst,t,.13,.16*v,'bandpass',1900,.8);_auSweep(dst,'tri',200,130,t,.07,.13*v);}
  else if(k==='h'){_auNoise(dst,t,.035,.05*v,'highpass',7000,.7);}
  else if(k==='t'){_auSweep(dst,'tri',140,72,t,.18,.26*v,.002);_auNoise(dst,t,.05,.05*v,'lowpass',1400,.7);}
  else if(k==='c'){_auNoise(dst,t,.9,.06*v,'highpass',5000,.5);}
}

// ---------- music tracks ----------
function _auCustomUrl(key){if(!SET.customMusic||!AU.custom)return null;const f=AU.custom[key];if(!f||typeof f!=='string')return null;
  return /^(https?:|\/|music\/|\.)/.test(f)?f:'music/'+f;}
function _auMusicVol(){return Math.pow(clamp(SET.master,0,100)/100,1.6)*Math.pow(clamp(SET.music,0,100)/100,1.6);}
function _auMakeSynth(key){
  const c=AU.ctx,song=auGenSong(key);if(!song)return null;
  const tr={key,song,html:null,paused:false,step:0,nextT:c.currentTime+.08,out:c.createGain(),send:null,nodes:[]};
  tr.out.gain.setValueAtTime(0,c.currentTime);tr.out.gain.linearRampToValueAtTime(1,c.currentTime+.25);tr.out.connect(AU.music);
  if(song.echo){const s=c.createGain(),dl=c.createDelay(1.5),fb=c.createGain(),lp=c.createBiquadFilter(),wet=c.createGain();
    dl.delayTime.value=Math.min(1.2,song.stepDur*3);fb.gain.value=.28+song.echo*.25;lp.type='lowpass';lp.frequency.value=2600;
    wet.gain.value=song.echo*.55;s.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(wet);wet.connect(tr.out);
    tr.send=s;tr.nodes=[s,dl,fb,lp,wet];}
  return tr;
}
function _auStep(tr,step,t){
  const song=tr.song,sd=song.stepDur;
  if(step%2===1)t+=song.swing*sd;if(step%4===2)t+=song.swing8*sd*2;
  for(const e of song.ev[step]){
    if(e.m==null)_auDrum(tr.out,e.i,t,e.v);
    else _auVoice(tr.out,e.e?tr.send:null,e.i,mtof(e.m),t,e.d*sd,e.v,e.a,e.r,e.vib);}
}
function _auTick(){
  const c=AU.ctx,tr=AU.cur;if(!c||!tr||tr.paused||tr.html||c.state!=='running')return;
  const sd=tr.song.stepDur,now=c.currentTime;
  if(tr.nextT<now-.05){const n=Math.ceil((now+.03-tr.nextT)/sd);tr.step=(tr.step+n)%tr.song.steps;tr.nextT+=n*sd;}
  let guard=0;
  while(tr.nextT<now+.15&&guard++<64){try{_auStep(tr,tr.step,tr.nextT);}catch(e){}tr.step=(tr.step+1)%tr.song.steps;tr.nextT+=sd;}
}
function _auFadeOut(tr,dur){
  if(!tr)return;tr.dead=true;const c=AU.ctx;
  if(tr.html){const el=tr.html,v0=el.volume,t0=performance.now();
    const f=()=>{const k=(performance.now()-t0)/(dur*1000);if(k>=1){try{el.pause();el.src='';}catch(e){}return;}
      try{el.volume=clamp(v0*(1-k),0,1);}catch(e){}setTimeout(f,30);};f();return;}
  const t=c.currentTime;tr.out.gain.cancelScheduledValues(t);tr.out.gain.setValueAtTime(tr.out.gain.value,t);
  tr.out.gain.linearRampToValueAtTime(0,t+dur);
  setTimeout(()=>{try{tr.out.disconnect();for(const n of tr.nodes)n.disconnect();}catch(e){}},(dur+1.5)*1000);
}
function _auStartHtml(key,url){
  const el=new Audio();const tr={key,html:el,paused:false};
  el.loop=true;el.preload='auto';el.volume=clamp(_auMusicVol(),0,1);
  el.onerror=()=>{if(AU.cur===tr&&!tr.dead){tr.dead=true;AU.cur=_auMakeSynth(key);if(AU.cur&&AU.jingle)_auPause(AU.cur);}};
  el.src=url;if(!(document.hidden&&SET.bgMute))el.play().catch(()=>{});
  return tr;
}
function _auStart(key){
  if(AU.cur)_auFadeOut(AU.cur,.4);AU.cur=null;
  if(!MUSIC_DEFS[key]&&!_auCustomUrl(key))return;
  const url=_auCustomUrl(key);
  AU.cur=url?_auStartHtml(key,url):_auMakeSynth(key);
}
function _auPause(tr){if(!tr||tr.paused)return;tr.paused=true;
  if(tr.html){try{tr.html.pause();}catch(e){}return;}
  const c=AU.ctx,t=c.currentTime;tr.out.gain.cancelScheduledValues(t);tr.out.gain.setValueAtTime(tr.out.gain.value,t);tr.out.gain.linearRampToValueAtTime(0,t+.12);}
function _auUnpause(tr){if(!tr||!tr.paused)return;tr.paused=false;
  if(tr.html){if(!(document.hidden&&SET.bgMute))tr.html.play().catch(()=>{});return;}
  const c=AU.ctx,t=c.currentTime;tr.nextT=t+.1;tr.out.gain.cancelScheduledValues(t);tr.out.gain.setValueAtTime(0,t);tr.out.gain.linearRampToValueAtTime(1,t+.4);}

function playMusic(key){
  AU.want=key;
  if(!AU.ctx)return;
  if(AU.jingle){AU.resumeKey=key;return;}
  if(AU.cur&&AU.cur.key===key&&!AU.cur.dead){if(AU.cur.paused)_auUnpause(AU.cur);return;}
  _auStart(key);
}
function stopMusic(){AU.want=null;AU.resumeKey=null;if(!AU.ctx)return;if(AU.cur)_auFadeOut(AU.cur,.4);AU.cur=null;}

// ---------- SFX ----------
const AU_SFX_GAP={text:.035,step:.07,move:.025,shake:.1};
function sfx(name){
  const c=AU.ctx;if(!c||c.state!=='running')return;
  const t=c.currentTime+.005,gap=AU_SFX_GAP[name]||.03;
  if(AU.lastSfx[name]&&t-AU.lastSfx[name]<gap)return;AU.lastSfx[name]=t;
  const D=AU.sfx,S=(w,f0,f1,dt,dur,v,a)=>_auSweep(D,w,f0,f1,t+dt,dur,v,a),N=(dt,dur,v,ty,f,q,f1)=>_auNoise(D,t+dt,dur,v,ty,f,q,f1);
  const V=(w,m,dt,dur,v,a,r)=>_auVoice(D,null,w,mtof(m),t+dt,dur,v,a||.003,r||.05,0);
  try{switch(name){
    case'move':S('p50',880,860,0,.04,.07);break;
    case'text':S('p50',1250,1250,0,.018,.025);break;
    case'step':N(0,.03,.06,'lowpass',420);break;
    case'ok':V('p25',84,0,.05,.08);V('p25',91,.055,.08,.08);break;
    case'back':V('p25',86,0,.05,.07);V('p25',79,.055,.08,.07);break;
    case'deny':S('p50',160,150,0,.08,.1);S('p50',160,140,.1,.12,.1);break;
    case'bump':S('tri',110,60,0,.08,.22);N(0,.05,.04,'lowpass',500);break;
    case'hit':N(0,.14,.24,'bandpass',1300,.9,500);S('tri',240,60,0,.12,.25);break;
    case'crit':N(0,.2,.3,'bandpass',1600,.8,400);S('tri',300,50,0,.16,.3);S('p12',1900,500,.02,.18,.07);break;
    case'weak':N(0,.1,.12,'lowpass',700);S('tri',150,100,0,.09,.16);break;
    case'heal':[72,76,79,84,88].forEach((m,i)=>V(i%2?'p12':'tri',m,i*.06,.1,i%2?.05:.13));break;
    case'buff':S('p25',380,1200,0,.22,.06);S('p25',500,1500,.12,.22,.06);break;
    case'debuff':S('p25',1100,320,0,.25,.06);S('p25',900,260,.12,.25,.05);break;
    case'status':for(let i=0;i<6;i++)V('p12',i%2?74:79,i*.05,.045,.06);break;
    case'enc':for(let i=0;i<3;i++){S('p25',220,1700,i*.16,.15,.07);}S('p50',1600,200,.5,.3,.07);N(0,.75,.06,'bandpass',600,1,4000);break;
    case'chest':[79,83,86,91].forEach((m,i)=>V('p25',m,i*.07,.1,.07));V('bell',98,.3,.6,.05);V('bell',103,.38,.6,.04);break;
    case'catch':N(0,.25,.08,'highpass',1500,.7,6000);S('p50',1300,300,.05,.25,.07);S('tri',200,80,.28,.1,.2);break;
    case'shake':S('tri',320,240,0,.06,.2);N(0,.03,.06,'highpass',3000);break;
    case'faint':S('p50',800,90,0,.55,.07);S('tri',300,50,.1,.5,.15);break;
    case'death':S('sine',75,26,0,2.2,.48,.01);S('tri',55,30,0,1.8,.35,.01);N(0,2.2,.3,'lowpass',380,.8,60);break;
    case'shrine':N(0,.9,.08,'lowpass',300,.7,2400);V('bell',81,.15,1,.06);V('bell',88,.35,1,.05);V('bell',93,.55,1,.04);break;
    case'buy':V('p25',83,0,.06,.07);V('p25',88,.065,.22,.07,.003,.12);break;
    case'save':[64,68,71,76].forEach((m,i)=>V('p12',m,i*.1,.16,.06,.005,.1));break;
    case'door':N(0,.16,.12,'lowpass',450,.7,150);S('tri',130,80,0,.12,.18);break;
    case'evolve':S('p25',300,1500,0,.9,.05,.05);S('p12',450,2200,.1,.8,.03,.05);N(0,.9,.04,'highpass',3000,.5,9000);break;
  }}catch(e){}
}

// ---------- jingles: [beat, lenBeats, midi, inst, vol] ----------
const AU_JINGLES={
  victory:{bpm:150,n:[[0,.5,67,'p25',.1],[.5,.5,72,'p25',.1],[1,.5,76,'p25',.1],[1.5,1.5,79,'p25',.11],[3,.5,77,'p25',.1],[3.5,.5,76,'p25',.1],
    [4,.5,74,'p25',.1],[4.5,.5,77,'p25',.1],[5,2.5,79,'p25',.11],
    [0,.5,64,'p12',.05],[.5,.5,67,'p12',.05],[1,.5,72,'p12',.05],[1.5,1.5,76,'p12',.05],[3,1,72,'p12',.05],[4,1,71,'p12',.05],[5,2.5,76,'p12',.05],
    [0,1.5,48,'tri',.25],[1.5,1.5,55,'tri',.22],[3,1,53,'tri',.25],[4,1,55,'tri',.25],[5,2.5,48,'tri',.25],
    [0,0,0,'k',1],[1.5,0,0,'s',.8],[3,0,0,'k',1],[4,0,0,'s',.7],[4.5,0,0,'s',.7],[5,0,0,'k',1],[5,0,0,'c',.8]]},
  levelup:{bpm:180,n:[[0,.25,72,'p25',.09],[.25,.25,76,'p25',.09],[.5,.25,79,'p25',.09],[.75,.25,84,'p25',.09],[1,.5,83,'p25',.09],[1.5,1.5,84,'p25',.1],
    [0,.25,64,'p12',.045],[.25,.25,67,'p12',.045],[.5,.25,72,'p12',.045],[.75,.25,76,'p12',.045],[1,.5,79,'p12',.045],[1.5,1.5,79,'p12',.045],
    [0,1,48,'tri',.2],[1,.5,55,'tri',.2],[1.5,1.5,60,'tri',.2],[1.5,1,96,'bell',.04]]},
  clear:{bpm:80,n:[[0,2,57,'p50',.025],[0,2,60,'p50',.025],[0,2,64,'p50',.025],[2,2,53,'p50',.025],[2,2,57,'p50',.025],[2,2,60,'p50',.025],
    [4,2,55,'p50',.025],[4,2,59,'p50',.025],[4,2,62,'p50',.025],[6,3,55,'p50',.03],[6,3,60,'p50',.03],[6,3,64,'p50',.03],[6,3,67,'p50',.03],
    [0,2,45,'tri',.22],[2,2,41,'tri',.22],[4,2,43,'tri',.22],[6,3,36,'tri',.25],
    [0,1,69,'tri',.2],[1,1,72,'tri',.2],[2,1.5,77,'tri',.2],[3.5,.5,76,'tri',.2],[4,1,74,'tri',.2],[5,1,79,'tri',.2],[6,3,84,'tri',.22],
    [6,1,88,'bell',.04],[6.25,1,91,'bell',.04],[6.5,1,96,'bell',.04],[6.75,1,100,'bell',.035],[7.5,1,96,'bell',.03],
    [0,0,0,'t',.6],[2,0,0,'t',.6],[4,0,0,'t',.6],[5,0,0,'t',.5],[5.5,0,0,'t',.5],[6,0,0,'k',1],[6,0,0,'c',1]]},
  caught:{bpm:160,n:[[0,.5,72,'p25',.1],[.5,.25,74,'p25',.1],[.75,.25,76,'p25',.1],[1,.5,79,'p25',.1],[1.5,.5,76,'p25',.1],[2,.5,81,'p25',.1],
    [2.5,.5,79,'p25',.1],[3,1.5,84,'p25',.11],[0,1,48,'tri',.22],[1,1,55,'tri',.22],[2,1,53,'tri',.22],[3,1.5,48,'tri',.22],
    [3,1.5,76,'p12',.05],[3,1.5,79,'p12',.04],[0,0,0,'k',1],[1,0,0,'s',.7],[2,0,0,'k',1],[2.5,0,0,'s',.6],[3,0,0,'k',1],[3,0,0,'c',.6]]},
  died:{bpm:60,n:[[0,0,0,'boom',1],[.5,1,57,'tri',.2],[1.5,1,56,'tri',.2],[2.5,1,55,'tri',.2],[3.5,2.5,50,'tri',.22],
    [.5,3,45,'p50',.02],[.5,3,48,'p50',.02],[.5,3,52,'p50',.02],[3.5,2.5,38,'tri',.22],[3.5,2.5,41,'p50',.02],[3.5,2.5,45,'p50',.02]]},
  evolve:{bpm:132,n:[[0,.25,60,'p12',.06],[.25,.25,64,'p12',.06],[.5,.25,67,'p12',.06],[.75,.25,72,'p12',.06],
    [1,.25,62,'p12',.06],[1.25,.25,65,'p12',.06],[1.5,.25,69,'p12',.06],[1.75,.25,74,'p12',.06],
    [2,.25,64,'p12',.06],[2.25,.25,67,'p12',.06],[2.5,.25,71,'p12',.06],[2.75,.25,76,'p12',.06],
    [3,3,72,'p25',.09],[3,3,76,'p50',.03],[3,3,79,'p50',.03],[3,1.5,96,'bell',.05],[3.5,1.5,100,'bell',.04],[4,1.5,103,'bell',.035],
    [0,1,48,'tri',.2],[1,1,50,'tri',.2],[2,1,52,'tri',.2],[3,3,48,'tri',.24],[3,0,0,'c',.8]]}
};
function playJingle(name){
  const J=AU_JINGLES[name],c=AU.ctx;
  if(name==='died')stopMusic();
  if(!J||!c)return Promise.resolve();
  const tok=++AU.jTok;
  if(name!=='died'&&!AU.jingle){if(AU.cur){AU.resumeKey=AU.cur.key;_auPause(AU.cur);}else AU.resumeKey=AU.want;}
  AU.jingle=true;
  const spb=60/J.bpm,t0=c.currentTime+.06;let end=0;
  for(const[b,l,m,ins,v]of J.n){const t=t0+b*spb;end=Math.max(end,(b+l)*spb);
    try{if(ins==='boom'){_auSweep(AU.jing,'sine',75,26,t,2.2,.6*v,.01);_auSweep(AU.jing,'tri',55,30,t,1.8,.35*v,.01);_auNoise(AU.jing,t,2.2,.3*v,'lowpass',380,.8,60);end=Math.max(end,2.2);}
      else if(m===0)_auDrum(AU.jing,ins,t,v);
      else _auVoice(AU.jing,null,ins,mtof(m),t,l*spb*.95,v,.005,.12,0);}catch(e){}}
  const ms=(end+.35)*1000;
  return new Promise(res=>setTimeout(()=>{
    if(tok===AU.jTok){AU.jingle=false;const k=AU.resumeKey;AU.resumeKey=null;
      if(k!=null){if(AU.cur&&AU.cur.key===k&&!AU.cur.dead)_auUnpause(AU.cur);else{AU.want=k;_auStart(k);}}}
    res();},ms));
}

// ---------- init / settings ----------
function applyAudio(){
  const c=AU.ctx;if(!c)return;
  const pw=x=>Math.pow(clamp(+x||0,0,100)/100,1.6),t=c.currentTime;
  AU.master.gain.setTargetAtTime(pw(SET.master),t,.03);
  AU.music.gain.setTargetAtTime(pw(SET.music)*.9,t,.03);
  AU.jing.gain.setTargetAtTime(Math.max(pw(SET.music),pw(SET.sfx)*.6),t,.03);
  AU.sfx.gain.setTargetAtTime(pw(SET.sfx)*.9,t,.03);
  const hide=typeof document!=='undefined'&&document.hidden&&SET.bgMute;
  if(hide&&c.state==='running')c.suspend().catch(()=>{});
  else if(!hide&&c.state==='suspended')c.resume().catch(()=>{});
  const tr=AU.cur;
  if(tr&&!tr.dead){
    const wantUrl=_auCustomUrl(tr.key);
    if(!!wantUrl!==!!tr.html&&!AU.jingle){_auStart(tr.key);return;}
    if(tr.html){try{tr.html.volume=clamp(_auMusicVol(),0,1);if(hide)tr.html.pause();else if(!tr.paused)tr.html.play().catch(()=>{});}catch(e){}}
  }
}
function audioInit(){
  if(typeof window==='undefined')return;
  if(AU.ctx){if(AU.ctx.state==='suspended'&&!(document.hidden&&SET.bgMute))AU.ctx.resume().catch(()=>{});return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  let c;try{c=new AC({latencyHint:'interactive'});}catch(e){try{c=new AC();}catch(e2){return;}}
  try{_auSetup(c);}catch(e){AU.ctx=null;return;}
  if(c.state==='suspended')c.resume().catch(()=>{});
  AU.timer=setInterval(_auTick,25);
  applyAudio();
  try{fetch('music/tracks.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{
    if(!j||typeof j!=='object')return;AU.custom=j;
    if(AU.cur&&!AU.cur.html&&!AU.jingle&&_auCustomUrl(AU.cur.key))_auStart(AU.cur.key);}).catch(()=>{});}catch(e){}
  if(AU.want&&!AU.cur)_auStart(AU.want);
}
onApply(applyAudio);
if(typeof window!=='undefined'&&typeof document!=='undefined'){
  const g=()=>audioInit();
  for(const ev of['pointerdown','keydown','touchend','mousedown'])window.addEventListener(ev,g,{capture:true,passive:true});
  document.addEventListener('visibilitychange',()=>applyAudio());
}
