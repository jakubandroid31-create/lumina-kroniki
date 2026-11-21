// ===================== BOSS ARENAS (unique battle stages per realm) =====================
// Drawn at half resolution (240x135) and upscaled x2 for a chunky pixel-art look.
const _AR={buf:null,g:null,stat:{}};
const AW=240,AH=135;
function _arBuf(){if(!_AR.buf){_AR.buf=document.createElement('canvas');_AR.buf.width=AW;_AR.buf.height=AH;_AR.g=_AR.buf.getContext('2d');_AR.g.imageSmoothingEnabled=false;}return _AR.g;}
function _arCanvas(){const c=document.createElement('canvas');c.width=AW;c.height=AH;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g];}
function _arV(g,y0,y1,cols,x0=0,x1=AW){const gr=g.createLinearGradient(0,y0,0,y1);cols.forEach((c,i)=>gr.addColorStop(i/(cols.length-1),c));g.fillStyle=gr;g.fillRect(x0,y0,x1-x0,y1-y0);}
function _arPoly(g,pts,col){g.fillStyle=col;g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();g.fill();}
function _arEll(g,cx,cy,rx,ry,col){g.fillStyle=col;g.beginPath();g.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);g.fill();}
function _arR(x,y,w,h,col,g){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function _arGlow(g,x,y,r,col,a=1){const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.save();g.globalAlpha=a;g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.restore();}
function _arStars(g,n,r,ymax,col='#fff'){for(let i=0;i<n;i++){g.globalAlpha=.3+r()*.7;_arR(r()*AW,r()*ymax,1,1,col,g);}g.globalAlpha=1;}
// standing surfaces: enemy (170,59) rx36 ry7 ; ally (60,103) rx43 ry8
function _arPlat(g,cx,cy,rx,ry,top,side,rim){_arEll(g,cx,cy+3,rx,ry,side);_arEll(g,cx,cy,rx,ry,top);if(rim){g.strokeStyle=rim;g.lineWidth=1;g.beginPath();g.ellipse(cx,cy,rx-1,ry-1,0,Math.PI*1.05,Math.PI*1.95);g.stroke();}}
function _arPlats(g,top,side,rim){_arPlat(g,170,59,36,7,top,side,rim);_arPlat(g,60,103,43,8,top,side,rim);}

// ---------- static layers ----------
const _AR_STATIC=[
// 0 Tuskor — stone circle on a hill at sunset
(g,r)=>{_arV(g,0,80,['#3a2a6a','#a24a6a','#f08a4a','#ffd27a']);_arEll(g,120,74,22,22,'#fff0b0');_arGlow(g,120,74,60,'rgba(255,200,120,.5)');
  _arPoly(g,[0,70,40,58,90,66,140,56,190,64,240,54,240,90,0,90],'#5a3a5a');_arPoly(g,[0,80,60,70,120,76,180,68,240,74,240,135,0,135],'#4f7a3a');
  _arV(g,80,135,['#5f8a40','#3f6a2a']);
  const stone=(x,y,w,h,c)=>{_arR(x,y,w,h,c,g);_arR(x,y,2,h,shade(c,.25),g);_arR(x+w-2,y,2,h,shade(c,-.3),g);_arR(x,y+h-2,w,2,'rgba(0,0,0,.25)',g);};
  [[118,38,6,22],[134,36,7,24],[198,36,7,24],[214,38,6,22]].forEach(s=>stone(s[0],s[1],s[2],s[3],'#7a7488'));_arR(132,33,74,4,'#6a6478',g);_arR(132,33,74,1,'#9a94a8',g);
  stone(10,40,14,60,'#8a8498');stone(212,52,12,46,'#8a8498');stone(30,62,8,30,'#6a6478');
  _arPlats(g,'#6a9a4a','#3f5a2a','#9aca6a');_arR(150,56,40,2,'rgba(0,0,0,.15)',g);},
// 1 Elderoak — inside a colossal hollow tree
(g,r)=>{_arV(g,0,AH,['#1a0f08','#3a2414','#2a1a0c']);
  for(let i=0;i<14;i++){const x=i*18+ri(-4,4,r);_arPoly(g,[x,0,x+14,0,x+10+ri(-3,3,r),AH,x-6,AH],i%2?'#4a2e18':'#3c2412');_arR(x+3,0,1,AH,'rgba(255,220,160,.06)',g);}
  _arPoly(g,[95,0,145,0,175,135,65,135],'rgba(255,240,170,.10)');_arPoly(g,[108,0,132,0,150,135,90,135],'rgba(255,240,170,.10)');_arEll(g,120,0,28,8,'#ffe9a0');
  for(let i=0;i<5;i++){g.strokeStyle='#5a3a20';g.lineWidth=5;g.beginPath();const y=95+i*8;g.moveTo(-10,y);g.quadraticCurveTo(120,y-40+i*6,250,y+4);g.stroke();}
  _arPlats(g,'#6a4a2a','#3a2412','#8a6a3a');_arEll(g,170,58,24,4,'#4a7a3a');_arEll(g,60,102,28,5,'#4a7a3a');},
// 2 Crystalisk — crystal cathedral
(g,r)=>{_arV(g,0,AH,['#120a2a','#2a1a4a','#1a1030']);_arStars(g,40,r,90,'#b8a0ff');
  const cry=(x,y,w,h,c)=>{_arPoly(g,[x,y+h,x,y+w*.6,x+w/2,y,x+w,y+w*.6,x+w,y+h],c);_arPoly(g,[x+w/2,y,x+w,y+w*.6,x+w,y+h,x+w/2,y+h],shade(c,-.3));_arR(x+2,y+w*.6,1,h-w*.6-4,'rgba(255,255,255,.5)',g);};
  [[4,10,22,110,'#6a5ad8'],[30,30,16,80,'#9a6ae8'],[196,4,24,120,'#5ab8e8'],[220,30,18,90,'#8a5ad8'],[84,20,12,50,'#7ad8f8'],[140,14,14,56,'#c87ae8']].forEach(c=>cry(...c));
  _arV(g,95,135,['#2a2050','#140c28']);for(let i=0;i<20;i++){_arR(r()*AW,96+r()*38,ri(2,8,r),1,'rgba(160,200,255,.25)',g);}
  _arPlats(g,'#5a4a9a','#2a1a5a','#a8a0ff');},
// 3 Krakenna — stormy sea at night, shipwreck
(g,r)=>{_arV(g,0,70,['#05081a','#14203a','#24344a']);for(let i=0;i<8;i++)_arEll(g,r()*AW,10+r()*30,30+r()*30,6+r()*5,'rgba(40,50,70,.8)');
  _arV(g,62,AH,['#1a3a5a','#0a1a30']);
  // hull pieces
  _arPoly(g,[120,64,222,60,214,74,130,76],'#4a2e1a');for(let i=0;i<6;i++)_arR(124+i*16,62,1,13,'#2a1a0c',g);_arR(196,20,3,42,'#3a2414',g);_arPoly(g,[199,22,226,34,199,44],'#c8c0a0');
  _arPoly(g,[8,98,112,96,104,114,16,116],'#5a3a20');for(let i=0;i<7;i++)_arR(12+i*14,97,1,17,'#2a1a0c',g);
  _arPlats(g,'#6a4628','#3a2414','#8a6a40');},
// 4 Pharaxis — pyramid throne chamber
(g,r)=>{_arV(g,0,AH,['#3a2410','#7a5428','#5a3a18']);
  for(let x=0;x<AW;x+=12)for(let y=0;y<90;y+=6){_arR(x+(y/6%2)*6,y,11,5,'#8a6230',g);}
  // original glyph reliefs
  const gl=['circle','tri','wave','sun','bar'];for(let i=0;i<26;i++){const x=8+(i%13)*18,y=14+Math.floor(i/13)*26,k=gl[i%5];g.fillStyle='#5a3a18';
    if(k==='circle'){g.beginPath();g.arc(x,y,3,0,7);g.fill();}else if(k==='tri')_arPoly(g,[x-3,y+3,x,y-3,x+3,y+3],'#5a3a18');else if(k==='wave'){for(let j=0;j<6;j++)_arR(x-3+j,y+Math.round(Math.sin(j)*2),1,1,'#5a3a18',g);}else if(k==='sun'){g.beginPath();g.arc(x,y,2,0,7);g.fill();_arR(x-4,y,8,1,'#5a3a18',g);_arR(x,y-4,1,8,'#5a3a18',g);}else _arR(x-3,y-1,7,2,'#5a3a18',g);}
  [[20,6],[60,6],[200,6],[160,6]].forEach(([x,w])=>{_arR(x,0,w+6,96,'#c89a48',g);_arR(x,0,2,96,'#f0c870',g);_arR(x+w+4,0,2,96,'#8a6228',g);for(let y=8;y<96;y+=20)_arR(x,y,w+6,3,'#3a7ab8',g);});
  _arPoly(g,[100,0,140,0,180,96,60,96],'rgba(255,240,180,.16)');
  _arV(g,90,AH,['#a87a3a','#6a4820']);for(let s=0;s<3;s++)_arR(130+s*4,66-s*4,80-s*8,4,shade('#c89a48',-.1*s),g);
  _arR(160,24,20,30,'#d8a838',g);_arR(162,26,16,26,'#3a7ab8',g);
  _arPlats(g,'#d8b058','#8a6228','#ffe090');},
// 5 Volcanox — volcano crater, lava lake
(g,r)=>{_arV(g,0,60,['#1a0505','#4a0f08','#8a2a10']);_arGlow(g,120,70,90,'rgba(255,120,40,.35)');
  _arPoly(g,[0,0,30,0,50,60,40,135,0,135],'#1a1010');_arPoly(g,[240,0,205,0,190,62,200,135,240,135],'#1a1010');
  _arPoly(g,[0,40,60,50,90,62,0,70],'#2a1814');_arPoly(g,[240,36,180,52,150,62,240,70],'#2a1814');
  _arV(g,62,AH,['#ff8a2a','#d84a10','#8a1a08']);for(let i=0;i<40;i++){_arR(r()*AW,64+r()*70,ri(6,20,r),1,'rgba(60,10,0,.6)',g);}
  _arPlats(g,'#2a2030','#100a14','#7a5ab0');},
// 6 Yetiron — frozen throne cavern with aurora crack
(g,r)=>{_arV(g,0,AH,['#0a1a30','#2a4a6a','#9ac8e8']);
  _arPoly(g,[90,0,150,0,138,14,104,16],'#04101e');
  for(let x=0;x<AW;x+=8){const h=ri(8,30,r);_arPoly(g,[x,0,x+8,0,x+4,h],x%16?'#bfe4ff':'#8ac0e8');_arR(x+3,0,1,h-4,'rgba(255,255,255,.6)',g);}
  _arPoly(g,[0,40,30,30,40,135,0,135],'#6a9ac0');_arPoly(g,[240,30,212,44,206,135,240,135],'#6a9ac0');
  _arR(150,18,40,36,'#a8d8f8',g);_arR(146,14,6,40,'#d8f0ff',g);_arR(188,14,6,40,'#d8f0ff',g);_arR(156,24,28,28,'#7ab0d8',g);_arR(150,18,40,2,'#ffffff',g);
  _arV(g,92,AH,['#c8e8ff','#8ab8d8']);for(let i=0;i<12;i++)_arR(r()*AW,96+r()*36,ri(10,30,r),1,'rgba(255,255,255,.6)',g);
  _arPlats(g,'#d8f0ff','#7aa8c8','#ffffff');},
// 7 Mirequeen — swamp altar under a crimson moon
(g,r)=>{_arV(g,0,90,['#0a0a14','#2a1424','#4a2a30']);_arEll(g,180,28,18,18,'#c8484a');_arEll(g,184,25,15,15,'#e0686a');_arGlow(g,180,28,50,'rgba(200,70,70,.35)');
  const tree=(x,h,c)=>{_arR(x,90-h,4,h,c,g);g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.moveTo(x+2,95-h*.7);g.lineTo(x-10,85-h);g.moveTo(x+2,96-h*.5);g.lineTo(x+14,88-h*.8);g.stroke();};
  tree(14,60,'#10101a');tree(46,40,'#1a1a24');tree(226,55,'#10101a');tree(206,34,'#1a1a24');
  const arch=(x,c)=>{_arR(x,38,6,52,c,g);_arR(x+30,46,6,44,c,g);g.strokeStyle=c;g.lineWidth=5;g.beginPath();g.arc(x+18,40,15,Math.PI,Math.PI*1.75);g.stroke();};
  arch(80,'#3a3a48');arch(128,'#34343f');
  _arV(g,84,AH,['#1a2a24','#0a1410']);for(let i=0;i<15;i++)_arR(r()*AW,88+r()*44,ri(8,24,r),1,'rgba(120,160,140,.2)',g);
  _arPlats(g,'#4a4a50','#24242a','#7a7a88');_arR(146,50,48,4,'#3a3a44',g);},
// 8 Tempestra — top of the sky spire inside a storm
(g,r)=>{_arV(g,0,AH,['#0a0a24','#2a2a5a','#5a5a8a']);
  _arV(g,96,AH,['#d8d8f0','#9a9ac8']);for(let i=0;i<14;i++)_arEll(g,r()*AW,98+r()*20,20+r()*20,7+r()*4,i%2?'#e8e8ff':'#b8b8e0');
  _arR(132,64,76,40,'#5a5470',g);_arR(132,64,76,2,'#8a84a0',g);for(let x=136;x<208;x+=10)_arR(x,52,3,12,'#6a6480',g);_arR(132,52,76,2,'#8a84a0',g);
  _arPlats(g,'#7a7490','#3a3450','#b8b0d0');},
// 9 Eclipsor — citadel throne room with eclipsed sun rose window
(g,r)=>{_arV(g,0,AH,['#0a0414','#1e0c30','#120820']);
  _arEll(g,120,42,40,40,'#2a1440');_arEll(g,120,42,36,36,'#3a1e58');g.strokeStyle='#8a6a2a';g.lineWidth=1;
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.moveTo(120,42);g.lineTo(120+Math.cos(a)*36,42+Math.sin(a)*36);g.stroke();}
  g.beginPath();g.arc(120,42,24,0,7);g.stroke();g.beginPath();g.arc(120,42,36,0,7);g.stroke();
  [[20,'#3a2a50'],[52,'#34244a'],[176,'#34244a'],[208,'#3a2a50']].forEach(([x,c])=>{_arR(x,0,12,100,c,g);_arR(x,0,2,100,shade(c,.3),g);_arR(x-2,96,16,6,shade(c,-.2),g);});
  [[38,'#5a1e7a'],[194,'#5a1e7a']].forEach(([x,c])=>{_arPoly(g,[x,0,x+12,0,x+12,46,x+6,40,x,46],c);_arR(x,4,12,2,'#d8a838',g);_arR(x+4,14,4,10,'#d8a838',g);});
  _arV(g,96,AH,['#2a1a3a','#140a20']);_arPoly(g,[100,135,140,135,132,62,108,62],'#5a1424');_arR(118,62,4,73,'#d8a838',g);
  _arR(156,26,28,30,'#2a1a3a',g);_arR(152,22,4,34,'#d8a838',g);_arR(184,22,4,34,'#d8a838',g);
  _arPlats(g,'#3a2a4a','#1a1024','#9a7ac8');},
// 10 Eclipsor phase 2 — radiant light dimension
(g,r)=>{const gr=g.createRadialGradient(120,50,4,120,50,170);gr.addColorStop(0,'#ffffff');gr.addColorStop(.25,'#fff2b8');gr.addColorStop(.6,'#f0b860');gr.addColorStop(1,'#8a4a9a');g.fillStyle=gr;g.fillRect(0,0,AW,AH);
  _arPlats(g,'#fff8e0','#d8b060','#ffffff');}
];

function _arStatic(k){if(!_AR.stat[k]){const[c,g]=_arCanvas();try{_AR_STATIC[k](g,RNG(9100+k*37));}catch(e){console.error(e);}_AR.stat[k]=c;}return _AR.stat[k];}

// ---------- animated layers ----------
function _arAnim(g,k,tm){
  const T=tm,rr=RNG(77+k);
  switch(k){
  case 0:{ // drifting clouds, swaying grass, birds
    for(let i=0;i<3;i++){const x=((i*90+T*6)%300)-30;_arEll(g,x,20+i*8,18,3,'rgba(255,200,180,.35)');}
    for(let i=0;i<40;i++){const x=(i*6.1)%AW,y=118+(i%5)*3,s=Math.sin(T*2+i)*1.5;g.fillStyle='#7aaa4a';g.fillRect(x+s,y,1,4);}
    for(let i=0;i<3;i++){const x=((T*14+i*40)%280)-20,y=30+i*6+Math.sin(T*3+i)*2;_arR(x,y,2,1,'#2a1a2a',g);_arR(x+2,y-1,1,1,'#2a1a2a',g);_arR(x-1,y-1,1,1,'#2a1a2a',g);}break;}
  case 1:{ // glowing spores + vines
    for(let i=0;i<24;i++){const x=(i*37+Math.sin(T+i)*6)%AW,y=AH-((T*8+i*23)%AH);_arGlow(g,x,y,3,'rgba(180,255,140,.9)',.8);}
    for(let i=0;i<6;i++){const x=20+i*40,l=30+(i%3)*15,s=Math.sin(T*1.5+i)*3;g.strokeStyle='#3a6a2a';g.lineWidth=1;g.beginPath();g.moveTo(x,0);g.quadraticCurveTo(x+s,l/2,x+s*1.5,l);g.stroke();}break;}
  case 2:{ // prismatic beams + sparkles
    const cols=['255,80,80','255,200,80','120,255,120','80,180,255','200,120,255'];
    cols.forEach((c,i)=>{g.save();g.globalAlpha=.10+.06*Math.sin(T*1.3+i);_arPoly(g,[10+i*6,0,22+i*6,0,190+i*8,135,170+i*8,135],'rgb('+c+')');g.restore();});
    for(let i=0;i<14;i++){const x=(i*53)%AW,y=(i*29)%100,a=Math.max(0,Math.sin(T*3+i*1.7));g.globalAlpha=a;_arR(x,y-2,1,5,'#fff',g);_arR(x-2,y,5,1,'#fff',g);}g.globalAlpha=1;break;}
  case 3:{ // whirlpool, waves, rain, lightning
    for(let i=0;i<5;i++){g.strokeStyle='rgba(160,200,230,'+(0.25+i*.08)+')';g.lineWidth=1;g.beginPath();g.ellipse(70,78,40-i*7,7-i*1.2,0,T*(1+i*.3),T*(1+i*.3)+Math.PI*1.4);g.stroke();}
    for(let y=70;y<AH;y+=8){g.strokeStyle='rgba(120,170,220,.35)';g.beginPath();for(let x=0;x<=AW;x+=6)g.lineTo(x,y+Math.sin(x*.08+T*2+y)*1.5);g.stroke();}
    g.strokeStyle='rgba(170,190,220,.4)';for(let i=0;i<40;i++){const x=(i*31+T*120)%AW,y=(i*17+T*260)%AH;g.beginPath();g.moveTo(x,y);g.lineTo(x-2,y+5);g.stroke();}
    if((T%5)<0.18){g.fillStyle='rgba(220,230,255,.35)';g.fillRect(0,0,AW,AH);g.strokeStyle='#eef';g.lineWidth=1;g.beginPath();let x=40+((T*7|0)%140),y=0;g.moveTo(x,y);while(y<60){x+=ri(-6,6,rr);y+=ri(5,10,rr);g.lineTo(x,y);}g.stroke();}break;}
  case 4:{ // falling sand + sunbeam shimmer
    g.save();g.globalAlpha=.06+.04*Math.sin(T*2);_arPoly(g,[106,0,134,0,160,96,80,96],'#fff8d0');g.restore();
    for(let i=0;i<30;i++){const x=90+(i*13)%70,y=(T*30+i*19)%96;_arR(x,y,1,1,'rgba(255,230,160,.8)',g);}break;}
  case 5:{ // bubbles + embers
    for(let i=0;i<6;i++){const ph=(T*.7+i*.37)%1,x=20+i*38,y=120-ph*6;_arEll(g,x,y,2+ph*4,1+ph*2,'rgba(255,200,80,'+(1-ph)+')');}
    for(let i=0;i<30;i++){const x=(i*29+Math.sin(T+i)*8)%AW,y=AH-((T*20+i*17)%AH);_arR(x,y,1,1,i%3?'#ffb040':'#ff5020',g);}
    g.save();g.globalAlpha=.08+.05*Math.sin(T*3);g.fillStyle='#ff6a20';g.fillRect(0,60,AW,75);g.restore();break;}
  case 6:{ // aurora through crack + blizzard
    g.save();g.beginPath();g.rect(98,0,46,14);g.clip();for(let i=0;i<3;i++){g.strokeStyle=['rgba(120,255,180,.8)','rgba(160,120,255,.7)','rgba(120,220,255,.7)'][i];g.lineWidth=2;g.beginPath();for(let x=96;x<146;x+=3)g.lineTo(x,4+i*3+Math.sin(x*.15+T*1.5+i)*2);g.stroke();}g.restore();
    for(let i=0;i<60;i++){const x=(i*41+T*(40+i%5*8))%AW,y=(i*23+T*(18+i%4*6))%AH;_arR(x,y,i%7?1:2,1,'rgba(255,255,255,.85)',g);}break;}
  case 7:{ // wisps + fog
    for(let i=0;i<5;i++){const x=30+i*45+Math.sin(T*.8+i)*10,y=60+Math.sin(T*1.3+i*2)*8;_arGlow(g,x,y,8,'rgba(120,255,230,.8)',.7);_arR(x,y,1,1,'#eaffff',g);}
    for(let i=0;i<4;i++){const x=((T*6*(i%2?1:-1)+i*70)%340+340)%340-60;_arEll(g,x,92+i*10,60,5,'rgba(160,190,180,.13)');}
    for(const[x,y] of [[154,48],[186,48]]){_arR(x,y,2,4,'#e8e0d0',g);_arGlow(g,x+1,y-2,4,'rgba(255,200,120,.9)',.6+.3*Math.sin(T*9+x));}break;}
  case 8:{ // storm vortex, debris, lightning
    for(let i=0;i<6;i++){g.strokeStyle='rgba(180,180,255,'+(.15+i*.05)+')';g.lineWidth=1;g.beginPath();g.ellipse(120,28,70-i*10,14-i*2,0,-T*(.8+i*.2),-T*(.8+i*.2)+Math.PI*1.3);g.stroke();}
    for(let i=0;i<5;i++){const x=20+i*48,y=40+Math.sin(T*1.2+i*1.7)*5;_arPoly(g,[x,y,x+8,y-2,x+10,y+4,x+2,y+6],'#4a4460');_arR(x+1,y,6,1,'#7a7490',g);}
    if((T%3.2)<0.15||((T+1.1)%4.7)<0.1){g.fillStyle='rgba(230,230,255,.3)';g.fillRect(0,0,AW,AH);g.strokeStyle='#fffbd0';g.lineWidth=2;g.beginPath();let x=30+((T*13|0)%180),y=0;g.moveTo(x,y);while(y<90){x+=ri(-8,8,rr);y+=ri(6,12,rr);g.lineTo(x,y);}g.stroke();}break;}
  case 9:{ // eclipse corona pulse + void cracks
    const p=.6+.4*Math.sin(T*1.5);_arGlow(g,120,42,36,'rgba(255,210,120,'+(.5*p)+')');_arEll(g,120,42,15,15,'#f8d880');_arEll(g,120,42,13,13,'#05020a');
    const cracks=[[30,110,6],[210,100,5],[90,20,4],[160,120,5]];g.strokeStyle='rgba(190,120,255,'+(0.5+0.4*Math.sin(T*4))+')';g.lineWidth=1;
    for(const[x,y,n] of cracks){g.beginPath();let cx=x,cy=y;g.moveTo(cx,cy);for(let j=0;j<n;j++){cx+=((j*7+x)%9)-4;cy+=((j*5+y)%7)-3;g.lineTo(cx,cy);}g.stroke();}
    for(let i=0;i<16;i++){const x=(i*47+T*5)%AW,y=AH-((T*10+i*21)%AH);_arR(x,y,1,1,'rgba(200,150,255,.8)',g);}break;}
  case 10:{ // rotating light rays + floating hall shards
    g.save();g.translate(120,50);g.rotate(T*.15);for(let i=0;i<12;i++){g.rotate(Math.PI/6);g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.moveTo(0,0);g.lineTo(200,-12);g.lineTo(200,12);g.closePath();g.fill();}g.restore();
    for(let i=0;i<10;i++){const x=(i*29)%AW,y=20+(i*17)%80+Math.sin(T+i)*4,a=T*.5+i;g.save();g.translate(x,y);g.rotate(a);_arPoly(g,[-6,-3,6,-4,4,4,-5,3],i%2?'#3a2a4a':'#5a1e7a');g.fillStyle='#d8a838';g.fillRect(-5,-1,10,1);g.restore();}
    _arEll(g,120,50,10,10,'#ffffff');break;}
  }
}
function drawBossArena(ctx,li,time,phase){
  const k=(li===9&&phase===2)?10:clamp(li|0,0,9);
  const g=_arBuf();g.clearRect(0,0,AW,AH);g.drawImage(_arStatic(k),0,0);_arAnim(g,k,time||0);
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(_AR.buf,0,0,AW,AH,0,0,W,H);ctx.restore();
}
