// @ts-nocheck -- faithful integration of the standalone v12 runtime; typed semantic data lives in data.ts.
import { applyEssayOperationMetadata, ESSAY_STATIONS } from './data';

const CONFIG={linkedin:"https://www.linkedin.com/in/YOUR-HANDLE/",email:"you@bridge-work.ai",
  subject:"The frame problem in agent threads"};
const T='#1a7a6d',P='#3d1f47',R='#d4416b';

/* ===== dial ===== */
const STEPS=ESSAY_STATIONS.map(({name,description})=>({n:name,d:description}));
const track=document.getElementById('track'),fill=document.getElementById('fill');
STEPS.forEach((s,i)=>{
  const b=document.createElement('button');
  b.className='step';b.dataset.i=i;
  b.innerHTML='<span class="pip"></span><span class="nm">'+i+' '+s.n+'</span>';
  b.onclick=()=>setLevel(i);
  track.appendChild(b);
});
let LEVEL=0, BOOTED=false;
function setLevel(n){
  LEVEL=Math.max(0,Math.min(8,n));
  const b=document.body;
  b.className='';
  for(let i=0;i<=LEVEL;i++)b.classList.add('ge'+i);
  b.dataset.level=LEVEL;
  document.querySelectorAll('.step').forEach((s,i)=>{
    s.classList.toggle('on',i===LEVEL);s.classList.toggle('done',i<LEVEL);});
  fill.style.width=(LEVEL/(STEPS.length-1)*100)+'%';
  document.getElementById('dialCur').textContent=STEPS[LEVEL].n;
  document.getElementById('dialDesc').textContent=STEPS[LEVEL].d;
  
  if(BOOTED){buildFolds();applyFolds(LEVEL===7);renderSpread();}
  setTimeout(layoutNotes,430);
}

/* ===== glyphs ===== */
const GLYPHS={
 1:'<circle cx="19" cy="24" r="11" fill="'+T+'" opacity=".9"/><circle cx="29" cy="24" r="11" fill="'+P+'" opacity=".85"/><circle cx="24" cy="24" r="3.2" fill="'+R+'"/>',
 2:'<rect x="7" y="14" width="15" height="20" rx="2" fill="'+T+'"/><path d="M28 34 Q28 16 42 16" stroke="'+R+'" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="28" cy="34" r="3" fill="'+P+'"/>',
 3:'<rect x="10" y="12" width="28" height="6" rx="3" fill="'+T+'"/><rect x="10" y="21" width="28" height="6" rx="3" fill="'+P+'"/><rect x="10" y="30" width="17" height="6" rx="3" fill="'+R+'"/>',
 4:'<rect x="6" y="17" width="11" height="14" rx="2" fill="'+T+'"/><rect x="18.5" y="17" width="11" height="14" rx="2" fill="'+R+'"/><rect x="31" y="17" width="11" height="14" rx="2" fill="'+P+'"/>',
 5:'<rect x="8" y="28" width="6" height="10" rx="2" fill="'+T+'" opacity=".55"/><rect x="17" y="22" width="6" height="16" rx="2" fill="'+T+'" opacity=".75"/><rect x="26" y="15" width="6" height="23" rx="2" fill="'+T+'"/><rect x="35" y="31" width="6" height="7" rx="2" fill="'+R+'"/>',
 6:'<rect x="8" y="8" width="32" height="32" rx="3" fill="none" stroke="'+T+'" stroke-width="2.5"/><rect x="17" y="17" width="14" height="14" rx="2" fill="'+P+'"/><circle cx="24" cy="24" r="3.2" fill="'+R+'"/>',
 7:'<rect x="5" y="12" width="12" height="24" rx="2" fill="'+P+'" opacity=".5"/><rect x="21" y="8" width="22" height="32" rx="3" fill="none" stroke="'+T+'" stroke-width="2.5"/><path d="M17 24 L21 24" stroke="'+R+'" stroke-width="2.5" stroke-linecap="round"/>',
 8:'<circle cx="24" cy="24" r="15" fill="none" stroke="'+T+'" stroke-width="2.5"/><circle cx="24" cy="9" r="3.4" fill="'+R+'"/><circle cx="24" cy="24" r="4" fill="'+P+'"/>',
 9:'<rect x="7" y="7" width="15" height="15" rx="1.5" fill="'+T+'"/><rect x="26" y="7" width="15" height="15" rx="1.5" fill="'+P+'"/><rect x="7" y="26" width="15" height="15" rx="1.5" fill="'+P+'"/><path d="M26 41 Q26 26 41 26 L41 41 Z" fill="'+R+'"/>'};
const SECTIONS=[{n:1,t:'The claim, and the concession'},{n:2,t:'Intent and state'},{n:3,t:'Why the list wins'},
 {n:4,t:'Colour as convention'},{n:5,t:'Borrowed apparatus'},{n:6,t:'Textrahmen'},
 {n:7,t:'Where context lives'},{n:8,t:'Five failures'},{n:9,t:'What this page does'}];
const glyphSvg=n=>'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">'+GLYPHS[n]+'</svg>';
const spine=document.getElementById('spine');
SECTIONS.forEach(s=>{
  const b=document.createElement('button');
  b.className='gl';b.dataset.sec=s.n;
  b.innerHTML=glyphSvg(s.n)+'<span class="tip">'+String(s.n).padStart(2,'0')+' · '+s.t+'</span>';
  b.onclick=()=>goto('sec-'+s.n);
  spine.appendChild(b);
});
document.querySelectorAll('.badge[data-glyph]').forEach(el=>el.innerHTML=glyphSvg(el.dataset.glyph));

document.getElementById('themeSeg').onclick=function(e){
  const b=e.target.closest('button');if(!b)return;
  document.documentElement.setAttribute('data-theme',b.dataset.theme);
  b.parentNode.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));};
(function(){
  const seq=['teal','purple','teal-d','purple','teal','purple-m','teal-d','purple','rose','purple','teal','teal-d','purple','teal-d'];
  const strip=document.getElementById('strip');
  seq.forEach((c,i)=>{const s=document.createElement('i');
    s.style.background='var(--'+c+')';s.style.opacity=(i===8)?.45:.18;strip.appendChild(s);});
})();

/* ===== sources ===== */
const SOURCES={
 treisman:{kind:'Perception',title:'Treisman &amp; Gelade 1980',body:'&ldquo;A feature-integration theory of attention,&rdquo; Cognitive Psychology 12. Single features — colour, orientation, size — are registered in parallel across the visual field. Conjunctions of features require serial search.',cav:'Caveat: the parallel/serial boundary is contested at the margins. The coarse asymmetry is not.'},
 fitts:{kind:'Motor cost',title:'Fitts 1954',body:'&ldquo;The information capacity of the human motor system,&rdquo; Journal of Experimental Psychology 47. Time to acquire a target is a predictable function of distance and target size.',cav:'Used here only for the claim that pointing has a modellable cost. Describing a spatial adjustment has no comparable model.'},
 cowan:{kind:'Working memory',title:'Cowan 2001',body:'&ldquo;The magical number 4 in short-term memory,&rdquo; Behavioral and Brain Sciences 24. Capacity without rehearsal or chunking is closer to four items than to Miller&rsquo;s seven.',cav:'Caveat: estimates vary by task and by how a chunk is operationalised.'},
 mayer:{kind:'Instructional design',title:'Mayer — signalling principle',body:'From the cognitive theory of multimedia learning: cues that highlight organisation improve learning from the same underlying material.',cav:'Caveat: effect sizes vary and are largest for lower-prior-knowledge readers — the same pattern as syntax colour.'},
 nielsen:{kind:'Reading behaviour',title:'Nielsen Norman Group, 2006 onward',body:'Eye-tracking across hundreds of users: web reading tends to follow an F-shaped scan, heavy on the first lines and the left edge, sparse below.',cav:'Caveat: NN/g are explicit that the F-pattern is a symptom of unstructured content, not a layout to design toward.'},
 sarkar:{kind:'Syntax colour',title:'Sarkar 2015 (PPIG 26)',body:'&ldquo;The impact of syntax colouring on program comprehension.&rdquo; Eye-tracked, randomised, within-subjects. Highlighting significantly reduced task completion time — about 8.4 seconds on average — and the effect weakened as programming experience increased.',cav:'Caveat: n = 10. Small. Reported here alongside the null result, not instead of it.'},
 hakala:{kind:'Syntax colour · null result',title:'Hakala et al. 2006 (PPIG 18)',body:'&ldquo;An experiment on the effects of program code highlighting on visual search for local patterns.&rdquo; No significant effect on visual-search speed — and participants preferred highlighted code regardless.',cav:'This is the load-bearing citation for the convention argument: the preference persisted without a measured benefit.'},
 dembeck:{kind:'Theory',title:'Till Dembeck — Texte rahmen',body:'Grenzregionen literarischer Werke im 18. Jahrhundert. Paratextual frames as the site where a text is bound into its cultural and communicative context. The historical shift: frames stop attaching the text to a pre-existing, metaphysically grounded order and start embedding it in a world of its own. Cases: Gottsched and Moritz on theory; Wieland, Sterne, Jean Paul on the literary side.',cav:'German, no English edition. The reading offered here is mine and is applied well outside its original field.'},
 deltadb:{kind:'Architecture',title:'Zed — Software Is Made Between Commits (2026)',body:'Announcement of DeltaDB: work is broken into a stream of fine-grained deltas. Where Git captures a snapshot at each commit, DeltaDB captures every operation in between and gives each a stable identity, so any moment of the code can be addressed even as it keeps changing — versioning a worktree together with the conversation driving it.',cav:'Read the primary source before repeating this. The reading offered here — file tree as projection over the operation log — is my inference about interface consequences, not a claim Zed has made in those terms.'},
 genette:{kind:'Theory',title:'Gérard Genette — Seuils (1987)',body:'Translated as Paratexts: Thresholds of Interpretation. The peritext/epitext distinction: apparatus inside the object versus apparatus outside it.',cav:'Genette is describing books and authorial intent, not software artefacts. The transfer is deliberate and arguable.'}};

/* ===== sidenotes ===== */
const NOTES={
 n1:{t:'Not a storage claim',b:'Git already stores everything. What it does not store is the reasoning that made one diff preferable to another — and that is the part that decays first.'},
 n2:{t:'Why close to flat',b:'Not perfectly flat. Pop-out holds for a single distinguishing feature; conjunctions of two features return to serial search.'},
 n3:{t:'The listicle&rsquo;s bad reputation',b:'Deserved on content grounds, undeserved on form grounds. The newspaper invented the same devices in 1850 and got called a public service.'},
 n4:{t:'Test on yourself',b:'Open a large file with highlighting off. The discomfort is real, and it is trained. That is precisely what a convention feels like from the inside.'},
 n5:{t:'Sterne, seriously',b:'Tristram Shandy has a black page, a marbled page, a blank page for the reader to draw on, and a preface arriving several chapters late. Apparatus as the work itself.'}};
const notecol=document.getElementById('notecol');
document.querySelectorAll('.anchor').forEach(a=>{
  const n=NOTES[a.dataset.note];if(!n)return;
  const el=document.createElement('aside');
  el.className='sidenote';el.dataset.for=a.dataset.note;
  el.innerHTML='<b>'+n.t+'</b>'+n.b;
  notecol.appendChild(el);
});
function layoutNotes(){
  if(LEVEL<3||window.innerWidth<=1180){
    document.querySelectorAll('.sidenote').forEach(el=>{el.style.top='';el.hidden=false;});return;}
  const top0=notecol.getBoundingClientRect().top+window.scrollY;
  let cursor=0;
  document.querySelectorAll('.sidenote').forEach(el=>{
    const a=document.querySelector('.anchor[data-note="'+el.dataset.for+'"]');
    const vis=a&&a.offsetParent!==null;
    el.hidden=!vis;if(!vis)return;
    const y=a.getBoundingClientRect().top+window.scrollY-top0;
    const t=Math.max(y,cursor);
    el.style.top=t+'px';cursor=t+el.offsetHeight+18;});
}
window.addEventListener('resize',layoutNotes);

/* ===== panes ===== */
const panesEl=document.getElementById('panes'),trailEl=document.getElementById('trail'),scrim=document.getElementById('scrim');
let stack=[];
function paint(){
  panesEl.querySelectorAll('.pane').forEach(p=>p.remove());
  const top=stack[stack.length-1];
  if(top){
    const p=document.createElement('div');
    p.className='pane';
    p.innerHTML='<div class="pane-head"><div><div class="kind">'+top.kind+'</div><h4>'+top.title+
      '</h4></div><button class="x" aria-label="Close">&#10005;</button></div><div class="pane-body">'+top.html+'</div>';
    p.querySelector('.x').onclick=closePane;
    panesEl.appendChild(p);
    requestAnimationFrame(()=>p.classList.add('in'));
  }
  trailEl.innerHTML='';
  const older=stack.slice(0,-1);
  trailEl.hidden=older.length===0;
  older.forEach((item,i)=>{
    const b=document.createElement('button');b.textContent=item.title;
    b.onclick=()=>{stack=stack.slice(0,i+1);paint();};
    trailEl.appendChild(b);});
  scrim.classList.toggle('in',stack.length>0);
}
function openPane(item){
  if(stack.length&&stack[stack.length-1].title===item.title)return;
  stack.push(item);paint();}
function closePane(){if(stack.length){stack=[];paint();}}
scrim.onclick=closePane;
document.addEventListener('click',function(e){
  const chip=e.target.closest('.chip');
  if(chip){
    const s=SOURCES[chip.dataset.src];if(!s)return;
    document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c===chip));
    openPane({kind:s.kind,title:s.title,html:'<p>'+s.body+'</p><p class="cav">'+s.cav+'</p>'});
    return;}
  const x=e.target.closest('.xlink');if(x){goto(x.dataset.goto);return;}
  const a=e.target.closest('.anchor');
  if(a){
    const el=document.querySelector('.sidenote[data-for="'+a.dataset.note+'"]');if(!el)return;
    document.querySelectorAll('.sidenote').forEach(x=>x.classList.remove('lit'));
    el.classList.add('lit');
    if(window.innerWidth<=1180)el.scrollIntoView({behavior:'smooth',block:'center'});}
});
function goto(id){
  const el=document.getElementById(id);if(!el)return;
  if(document.body.dataset.frame!=='essay')render('essay');
  closePane();
  setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),70);}

/* ===== figures ===== */
(function(){
  const q=document.getElementById('quad');
  [{x:78,y:26,c:'var(--teal)',t:'Language',s:'intent, ambiguity, critique'},
   {x:30,y:76,c:'var(--rose)',t:'Direct manipulation',s:'select, drag, adjust'},
   {x:34,y:26,c:'var(--purple-m)',t:'Visual structure',s:'hierarchy, comparison'}].forEach(p=>{
    const d=document.createElement('div');d.className='dot';
    d.style.left=p.x+'%';d.style.bottom=p.y+'%';
    d.innerHTML='<span class="d" style="background:'+p.c+'"></span><span class="t">'+p.t+'</span><span class="s">'+p.s+'</span>';
    q.appendChild(d);});
})();
const ERAS=[
 {yr:'c.1200',nm:'Glossed page',v:6,app:'marginalia · interlinear gloss · rubrication · running head · initials · quire mark',d:'The scholastic page is already multi-frame: main text in the centre, commentary wrapped around it, a second and third hand answering the first. Reading means moving between registers, not down a stream.'},
 {yr:'c.1500',nm:'Print',v:9,app:'paragraph · title page · footnote · pagination · index · running head · whitespace · colophon · errata',d:'Print regularises the apparatus. Dembeck&rsquo;s shift happens inside this settlement: frames stop hooking the text to an inherited order and start building one for it.'},
 {yr:'c.1850',nm:'Newspaper',v:11,app:'column · headline hierarchy · deck · byline · dateline · lead · section · rule · caption · jump line · standing head',d:'The first medium designed for scanning rather than reading. Everything the listicle is accused of was invented here and considered a public service.'},
 {yr:'1980s',nm:'Terminal',v:7,app:'monospace grid · ANSI colour · prompt · pager · pipe · exit code · man page',d:'Colour arrives as pure convention: nothing about a keyword is blue. Within a generation the profession cannot comfortably read code without it — while the measured benefit stays modest.'},
 {yr:'1990s',nm:'GUI / hypertext',v:13,app:'window · panel · link · anchor · table of contents · sidebar · breadcrumb · tab · tooltip · scrollbar · syntax colour · fold · minimap',d:'Code compiles into interface. The link makes text non-linear; the sidebar and table of contents make a long document navigable. Wikipedia is the high-water mark.'},
 {yr:'2010s',nm:'Feed',v:5,app:'card · infinite scroll · timestamp · avatar · engagement chrome',d:'Apparatus becomes decorative. The card frames for delivery, not comprehension; the scroll has no end, so nothing can close.'},
 {yr:'now',nm:'Agent thread',v:2,app:'speaker label · timestamp',d:'Eight centuries of accumulation, and the medium where we now do our hardest thinking has two devices. No addressing, no supersession, no register separation, no closure, no colophon.'}];
(function(){
  const chart=document.getElementById('chart'),band=document.getElementById('band');
  const det=document.getElementById('eraDetail'),count=document.getElementById('eraCount');
  const max=Math.max.apply(null,ERAS.map(e=>e.v));
  function select(i){
    chart.querySelectorAll('.bar').forEach((b,j)=>b.classList.toggle('on',j===i));
    band.querySelectorAll('.era').forEach((b,j)=>b.classList.toggle('on',j===i));
    const e=ERAS[i];
    det.innerHTML='<b>'+e.nm+' · '+e.yr+'</b> — '+e.d+'<span class="app">'+e.app+'</span>';
    count.textContent=e.v+' devices';}
  ERAS.forEach((e,i)=>{
    const b=document.createElement('div');
    b.className='bar'+(i===ERAS.length-1?' cliff':'');
    b.style.height=(18+(e.v/max)*82)+'%';
    b.innerHTML='<span class="v">'+e.v+'</span>';
    b.onclick=()=>select(i);chart.appendChild(b);
    const t=document.createElement('div');t.className='era';
    t.innerHTML='<div class="yr">'+e.yr+'</div><div class="nm">'+e.nm+'</div>';
    t.onclick=()=>select(i);band.appendChild(t);});
  select(ERAS.length-1);
})();

/* ===== instrument 01 ===== */
const KINDS=['k','n','s'];
const WORDS=['let','val','fn','ret','idx','ptr','buf','map','key','arg','def','env','opt','tmp','row','ctx'];
let t0=null,phase=0,tPlainMs=0,targetIdx=33;
function buildField(el){
  el.innerHTML='';
  for(let i=0;i<48;i++){
    const s=document.createElement('span');
    s.className='tok'+(i===targetIdx?' target':'');
    s.dataset.kind=KINDS[i%3];
    s.textContent=(i===targetIdx)?'ERR':WORDS[(i*7)%WORDS.length];
    el.appendChild(s);}}
function shuffleF(){
  targetIdx=8+Math.floor(Math.random()*38);
  buildField(document.getElementById('gridPlain'));
  buildField(document.getElementById('gridCoded'));
  document.getElementById('tPlain').textContent='—';
  document.getElementById('tCoded').textContent='—';
  phase=0;
  document.getElementById('searchResult').innerHTML='Press <b>Start</b>, then click ERR on the left, then on the right.';}
shuffleF();
document.getElementById('shuffleBtn').onclick=shuffleF;
document.getElementById('startBtn').onclick=function(){shuffleF();phase=1;t0=performance.now();
  document.getElementById('searchResult').innerHTML='Timing. Click <b>ERR</b> in the uncoded field.';};
document.getElementById('gridPlain').onclick=function(e){
  if(phase!==1||!e.target.classList.contains('target'))return;
  tPlainMs=performance.now()-t0;
  document.getElementById('tPlain').textContent=(tPlainMs/1000).toFixed(2)+'s';
  e.target.classList.add('hit');phase=2;t0=performance.now();
  document.getElementById('searchResult').innerHTML='Now click <b>ERR</b> in the coded field.';};
document.getElementById('gridCoded').onclick=function(e){
  if(phase!==2||!e.target.classList.contains('target'))return;
  const tc=performance.now()-t0;
  document.getElementById('tCoded').textContent=(tc/1000).toFixed(2)+'s';
  e.target.classList.add('hit');phase=0;
  const r=tPlainMs/tc;
  document.getElementById('searchResult').innerHTML=r>1.3
   ?'Uncoded <b>'+(tPlainMs/1000).toFixed(2)+'s</b> · coded <b>'+(tc/1000).toFixed(2)+'s</b> — about <b>'+r.toFixed(1)+'&times;</b> faster. You did not read the coded field. You saw it.'
   :'Uncoded <b>'+(tPlainMs/1000).toFixed(2)+'s</b> · coded <b>'+(tc/1000).toFixed(2)+'s</b> — roughly level, and you already knew where to look. Shuffle and try again.';};


/* ===== specimen: one thread, three framings ===== */

/* ===== 07 layering: fold the argument beneath its thesis ===== */
function buildFolds(){
  if(document.querySelector('.fold'))return;
  var groups={};
  ORIGINAL.forEach(function(n){
    if(!n.dataset || !n.dataset.label) return;
    var sec=n.dataset.inSec; if(!sec)return;
    (groups[sec]=groups[sec]||[]).push(n);
  });
  Object.keys(groups).forEach(function(sec){
    var head=document.getElementById('sec-'+sec); if(!head)return;
    var members=groups[sec];
    var fold=document.createElement('div');
    fold.className='fold'; fold.dataset.sec=sec;
    fold.innerHTML='<button class="fold-btn"><span class="cv">&rsaquo;</span>'+
      '<span>Read section '+String(sec).padStart(2,'0')+'</span>'+
      '<span class="n">'+members.length+' claims</span></button><div class="wrap"></div>';
    head.parentNode.insertBefore(fold, head.nextSibling);
    fold.querySelector('.fold-btn').onclick=function(){fold.classList.toggle('open');setTimeout(layoutNotes,60);};
  });
}
function applyFolds(on){
  document.querySelectorAll('.fold').forEach(function(f){
    var wrap=f.querySelector('.wrap'); var sec=f.dataset.sec;
    ORIGINAL.forEach(function(n){
      if(!n.dataset||n.dataset.inSec!==sec)return;
      if(n.classList.contains('sechead'))return;
      if(on){ if(n.parentNode!==wrap) wrap.appendChild(n); }
      else if(n.parentNode===wrap){ stream.appendChild(n); }
    });
  });
  if(!on) render(document.body.dataset.frame||'essay');
}


/* ===== 08 the spread: one opening carrying the whole essay =====
   Regions are derived, never hand-placed. A node's data-type decides which
   leaf it lands on; data-in-sec decides its order. Nothing is redrawn: the
   gloss renders the real node's own innerHTML. */
var spreadBuilt=false;
var SEC_TITLES={1:'Position',2:'Distinction',3:'Mechanism',4:'Evidence',5:'History',
                6:'Theory',7:'Diagnosis',8:'Specification',9:'Demonstration'};
function renderSpread(){
  if(LEVEL<8||spreadBuilt)return;
  var block=document.getElementById('spreadBlock'),
      appar=document.getElementById('spreadApparat');
  if(!block||!appar)return;

  /* recto — claims, concessions and the superseded line, in section order */
  var bySec={};
  ORIGINAL.forEach(function(n){
    if(!n.dataset||!n.dataset.label)return;
    var k=n.dataset.inSec||'0';
    (bySec[k]=bySec[k]||[]).push(n);
  });
  var html='';
  Object.keys(bySec).sort(function(a,b){return a-b;}).forEach(function(sec){
    html+='<div class="sq"><span class="sn">'+String(sec).padStart(2,'0')+
          ' &middot; '+(SEC_TITLES[sec]||'')+'</span>';
    bySec[sec].forEach(function(n){
      var t=n.dataset.type||'claim';
      var lead=n.classList.contains('pull')?' lead':'';
      var rep=n.dataset.superseded?'<span class="rep">replaced by &sect;'+n.dataset.superseded+'</span>':'';
      html+='<button class="sitem '+t+lead+'" data-ref="'+n.dataset.id+'">'+
            n.dataset.label+rep+'</button>';
    });
    html+='</div>';
  });
  block.innerHTML=html;

  /* verso — the apparatus: what grounds the argument */
  var a='<div class="ahead">Sources</div>';
  Object.keys(SOURCES).forEach(function(id){
    var src=SOURCES[id];
    a+='<button class="aitem" data-src2="'+id+'"><span class="mk">'+src.kind+
       '</span>'+src.title+'</button>';
  });
  a+='<div class="ahead">Evidence in the text</div>';
  ORIGINAL.forEach(function(n){
    if(n.dataset&&n.dataset.type==='evidence')
      a+='<button class="aitem" data-ref="'+(n.dataset.id||'')+'"><span class="mk">quoted</span>'+
         n.textContent.trim().slice(0,88)+'&hellip;</button>';
  });
  a+='<div class="ahead">Still open</div>'+
     '<button class="aitem q" data-open="1"><span class="mk">question</span>'+
     'Which of the five failures are real for people who build these tools?</button>'+
     '<button class="aitem q" data-open="2"><span class="mk">question</span>'+
     'Does the argument still land at station 0, with no apparatus to carry it?</button>';
  appar.innerHTML=a;

  /* one handler; the gloss is the only reader */
  var g=document.getElementById('gloss');
  document.getElementById('spread').addEventListener('click',function(e){
    var line=e.target.closest('.sitem,.aitem');
    if(!line){return;}
    document.querySelectorAll('.sitem,.aitem').forEach(function(x){x.classList.toggle('on',x===line);});
    var kind='', sec='', body='';
    if(line.dataset.src2){
      var src=SOURCES[line.dataset.src2];
      kind=src.kind; sec=src.title;
      body='<p>'+src.body+'</p><p style="color:var(--rose);font-family:var(--mono);font-size:9.5px;line-height:1.7;margin-top:11px">'+src.cav+'</p>';
    } else if(line.dataset.open){
      kind='open question'; sec='unresolved';
      body='<p>'+line.textContent.replace(/^question/i,'').trim()+'</p>';
    } else {
      var node=ORIGINAL.filter(function(n){return n.dataset&&n.dataset.id===line.dataset.ref;})[0];
      if(!node)return;
      kind=node.dataset.type||'claim';
      sec='section '+String(node.dataset.inSec||'').padStart(2,'0')+
          (node.dataset.superseded?' &middot; superseded by \u00a7'+node.dataset.superseded:'');
      body=node.innerHTML;
    }
    document.getElementById('glossKind').textContent=kind;
    document.getElementById('glossSec').innerHTML=sec;
    document.getElementById('glossBody').innerHTML=body;
    g.classList.add('in');
  });
  document.getElementById('glossX').onclick=function(){
    g.classList.remove('in');
    document.querySelectorAll('.sitem,.aitem').forEach(function(x){x.classList.remove('on');});
  };
  spreadBuilt=true;
}

/* ===== frames ===== */
const stream=document.getElementById('stream');
applyEssayOperationMetadata(stream);
const ORIGINAL=Array.prototype.slice.call(stream.children);
const TAIL=ORIGINAL.filter(n=>n.classList.contains('feedback')||n.classList.contains('colophon'));
const FRAMENOTES={
 essay:'Argument in intended order. Other frames re-sort these same nodes — no copies.',
 thread:'Chronological origin material: raw voice memos, transcription damage intact, and the abandoned version.',
 structure:'Prose stripped, apparatus exposed: claims, concessions, and the superseded claim.',
 spec:'Five observed failures, five paratextual devices.'};
const GROUPS={
 structure:[['claim','Claims'],['concession','Concessions'],['superseded','Superseded']],
 thread:[['voice memo · raw','Raw capture'],['note','Working out'],['wrong turn','Abandoned'],['detour','Where the theory came from'],['reframe','Reframe']],
 spec:[['spec','Thread failures &rarr; paratextual devices']]};
function inFrame(n,f){return (n.dataset.frames||'').split(/\s+/).indexOf(f)>=0;}
document.querySelectorAll('#frames button').forEach(b=>{
  b.querySelector('.n').textContent=ORIGINAL.filter(n=>inFrame(n,b.dataset.frame)).length;});
function render(frame){
  document.body.dataset.frame=frame;
  document.querySelectorAll('#frames button').forEach(b=>b.classList.toggle('active',b.dataset.frame===frame));
  document.getElementById('frameNote').textContent=FRAMENOTES[frame];
  var say=document.getElementById('frameSay');
  if(say){var vis=ORIGINAL.filter(function(n){return !n.hidden&&n.dataset&&n.dataset.frames;}).length;
    say.textContent=frame==='essay'?'the same nodes, bound four ways':
      vis+' of the same nodes, re-sorted \u2014 nothing copied';}
  stream.querySelectorAll('.grouphead').forEach(h=>h.remove());
  if(frame==='essay'){
    ORIGINAL.forEach(n=>{stream.appendChild(n);
      n.hidden=!(inFrame(n,'essay')||TAIL.indexOf(n)>=0||n.classList.contains('plain')||n.classList.contains('piece'));});
  }else{
    ORIGINAL.forEach(n=>n.hidden=true);
    const used=[];
    GROUPS[frame].forEach(function(g){
      const m=ORIGINAL.filter(n=>inFrame(n,frame)&&n.dataset.type===g[0]&&used.indexOf(n)<0);
      if(!m.length)return;
      const h=document.createElement('div');h.className='grouphead';h.innerHTML=g[1];
      stream.appendChild(h);
      m.forEach(n=>{used.push(n);n.hidden=false;stream.appendChild(n);});});
    TAIL.forEach(n=>{n.hidden=false;stream.appendChild(n);});}
  setTimeout(layoutNotes,80);
}
document.getElementById('frames').onclick=function(e){
  const b=e.target.closest('button');if(!b)return;
  render(b.dataset.frame);
  const top=document.querySelector('.framebar');
  if(top){const y=top.getBoundingClientRect().top+window.scrollY-6;
    if(window.scrollY>y)window.scrollTo({top:y,behavior:'smooth'});}
};

window.addEventListener('scroll',function(){
  if(LEVEL<6||document.body.dataset.frame!=='essay')return;
  const y=window.scrollY+160;let cur=1;
  SECTIONS.forEach(s=>{
    const el=document.getElementById('sec-'+s.n);
    if(el&&!el.hidden&&el.getBoundingClientRect().top+window.scrollY<=y)cur=s.n;});
  document.querySelectorAll('.gl').forEach(g=>g.classList.toggle('on',+g.dataset.sec===cur));
},{passive:true});

/* ===== palette ===== */
const pal=document.getElementById('pal'),palInput=document.getElementById('palInput'),palList=document.getElementById('palList');
const ITEMS=[].concat(
 STEPS.map((s,i)=>({l:i+' — '+s.n,k:'Structure',act:()=>setLevel(i)})),
 SECTIONS.map(s=>({l:String(s.n).padStart(2,'0')+' — '+s.t,k:'Section',g:s.n,act:()=>goto('sec-'+s.n)})),
 Object.keys(SOURCES).map(id=>{const s=SOURCES[id];
   return {l:s.title,k:'Source',act:function(){openPane({kind:s.kind,title:s.title,html:'<p>'+s.body+'</p><p class="cav">'+s.cav+'</p>'});}};}),
 ['essay','thread','structure','spec'].map(f=>({l:f[0].toUpperCase()+f.slice(1)+' frame',k:'Frame',
   act:function(){render(f);}})));
let sel=0,shown=[];
function palRender(){
  const q=palInput.value.toLowerCase().trim();
  shown=ITEMS.filter(i=>!q||i.l.toLowerCase().indexOf(q)>=0||i.k.toLowerCase().indexOf(q)>=0);
  sel=Math.min(sel,Math.max(0,shown.length-1));
  palList.innerHTML=shown.length?'':'<div class="pal-empty">Nothing matches</div>';
  shown.forEach((i,ix)=>{
    const d=document.createElement('div');
    d.className='pal-item'+(ix===sel?' sel':'');
    d.innerHTML='<span class="g">'+(i.g?glyphSvg(i.g):'')+'</span><span class="l">'+i.l+'</span><span class="k">'+i.k+'</span>';
    d.onclick=function(){palClose();i.act();};
    palList.appendChild(d);});}
function palOpen(){pal.classList.add('in');palInput.value='';sel=0;palRender();palInput.focus();}
function palClose(){pal.classList.remove('in');}
document.getElementById('palBtn').onclick=palOpen;
pal.onclick=function(e){if(e.target===pal)palClose();};
palInput.oninput=function(){sel=0;palRender();};
document.addEventListener('keydown',function(e){
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();
    pal.classList.contains('in')?palClose():palOpen();return;}
  if(pal.classList.contains('in')){
    if(e.key==='Escape')palClose();
    if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(sel+1,shown.length-1);palRender();}
    if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(sel-1,0);palRender();}
    if(e.key==='Enter'&&shown[sel]){palClose();shown[sel].act();}
    return;}
  if(e.key==='Escape'&&stack.length){closePane();return;}
  if(e.target.tagName==='INPUT')return;
  if(e.key==='ArrowRight'){e.preventDefault();setLevel(LEVEL+1);}
  if(e.key==='ArrowLeft'){e.preventDefault();setLevel(LEVEL-1);}
});

/* ===== misc + boot ===== */
document.getElementById('fbLinkedIn').href=CONFIG.linkedin;
document.getElementById('fbMail').href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent(CONFIG.subject);
document.getElementById('fbCopy').onclick=function(e){
  e.preventDefault();const t=e.currentTarget;
  if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){
    const o=t.textContent;t.textContent='Copied';setTimeout(function(){t.textContent=o;},1600);});};

const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
BOOTED=true;
if(reduce){setLevel(5);}
else{
  setLevel(0);
  let n=0;
  const climb=setInterval(function(){n++;setLevel(n);if(n>=5)clearInterval(climb);},420);
}
window.addEventListener('load',layoutNotes);
setTimeout(layoutNotes,900);
