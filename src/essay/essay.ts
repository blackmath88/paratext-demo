// @ts-nocheck -- faithful integration of the standalone v12 runtime; typed semantic data lives in data.ts.
import { applyEssayOperationMetadata, ESSAY_STATIONS } from './data';

const CONFIG={linkedin:"https://www.linkedin.com/in/YOUR-HANDLE/",email:"you@bridge-work.ai",
  subject:"The frame problem in agent threads"};
const T='#1a7a6d',P='#3d1f47',R='#d4416b';

/* ===== station control ===== */
const STEPS=ESSAY_STATIONS.map(({name,description})=>({n:name,d:description}));
const BUILT_LEVEL=5;
const station=document.getElementById('station'),ticks=document.getElementById('stationTicks');
const ordinal=document.getElementById('stationOrdinal'),stationName=document.getElementById('stationName');
const capability=document.getElementById('stationCapability'),hint=document.getElementById('stationHint');
const prev=document.getElementById('stationPrev'),next=document.getElementById('stationNext');
STEPS.forEach((_,i)=>{const tick=document.createElement('i');tick.className='station-tick';tick.classList.toggle('is-future',i>BUILT_LEVEL);tick.dataset.i=i;ticks.appendChild(tick);});
let LEVEL=0,INTRO_ACTIVE=false,JUST_ABORTED=false,introTimers=[];
function setLevel(n){
  LEVEL=Math.max(0,Math.min(BUILT_LEVEL,n));
  const b=document.body;
  b.className='';
  for(let i=0;i<=LEVEL;i++)b.classList.add('ge'+i);
  b.dataset.level=LEVEL;
  ordinal.textContent=String(LEVEL).padStart(2,'0');stationName.textContent=STEPS[LEVEL].n;capability.textContent=STEPS[LEVEL].d;
  ticks.querySelectorAll('.station-tick').forEach((tick,i)=>{tick.classList.toggle('reached',i<=LEVEL);tick.classList.toggle('current',i===LEVEL);});
  prev.disabled=LEVEL===0;next.disabled=LEVEL===BUILT_LEVEL;updateReadingProgress();
}
function stopIntro(){introTimers.forEach(window.clearTimeout);introTimers=[];INTRO_ACTIVE=false;station.classList.remove('is-running');}
function abortIntro(){if(!INTRO_ACTIVE)return false;stopIntro();setLevel(5);JUST_ABORTED=true;window.setTimeout(()=>{JUST_ABORTED=false;},0);return true;}
prev.onclick=(event)=>{if(JUST_ABORTED||abortIntro()){event.preventDefault();return;}setLevel(LEVEL-1);};
next.onclick=(event)=>{if(JUST_ABORTED||abortIntro()){event.preventDefault();return;}setLevel(LEVEL+1);};
station.addEventListener('click',(event)=>{if(event.target.closest('button'))return;station.classList.toggle('is-expanded');});

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
const glyphSvg=n=>'<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">'+GLYPHS[n]+'</svg>';
document.querySelectorAll('.badge[data-glyph]').forEach(el=>el.innerHTML=glyphSvg(el.dataset.glyph));
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

/* ===== contextual notes and sources ===== */
const NOTES={
 n1:{t:'Not a storage claim',b:'Git already stores everything. What it does not store is the reasoning that made one diff preferable to another — and that is the part that decays first.'},
 n2:{t:'Why close to flat',b:'Not perfectly flat. Pop-out holds for a single distinguishing feature; conjunctions of two features return to serial search.'},
 n3:{t:'The listicle&rsquo;s bad reputation',b:'Deserved on content grounds, undeserved on form grounds. The newspaper invented the same devices in 1850 and got called a public service.'},
 n4:{t:'Test on yourself',b:'Open a large file with highlighting off. The discomfort is real, and it is trained. That is precisely what a convention feels like from the inside.'},
 n5:{t:'Sterne, seriously',b:'Tristram Shandy has a black page, a marbled page, a blank page for the reader to draw on, and a preface arriving several chapters late. Apparatus as the work itself.'}};
document.querySelectorAll('.anchor').forEach(a=>{
  const n=NOTES[a.dataset.note];if(!n)return;
  const el=document.createElement('aside');
  el.className='sidenote';el.dataset.for=a.dataset.note;
  el.innerHTML='<b>'+n.t+'</b>'+n.b;
  a.insertAdjacentElement('afterend',el);
  a.onclick=()=>el.classList.toggle('lit');
});
let openSource;
document.querySelectorAll('.chip[data-src]').forEach((chip)=>{
  const source=SOURCES[chip.dataset.src];if(!source)return;
  chip.setAttribute('aria-expanded','false');
  const detail=document.createElement('span');detail.className='source-detail';
  detail.innerHTML='<span class="source-kind">'+source.kind+'</span><strong>'+source.title+'</strong><span class="source-body">'+source.body+'</span><span class="source-caveat">'+source.cav+'</span>';
  chip.insertAdjacentElement('afterend',detail);
  chip.onclick=(event)=>{event.preventDefault();if(LEVEL<5)return;
    const closing=openSource===detail;
    document.querySelectorAll('.source-detail.is-open').forEach((item)=>item.classList.remove('is-open'));
    document.querySelectorAll('.chip[aria-expanded=true]').forEach((item)=>item.setAttribute('aria-expanded','false'));
    openSource=closing?undefined:detail;
    if(openSource){detail.classList.add('is-open');chip.setAttribute('aria-expanded','true');}
  };
});

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


const stream=document.getElementById('stream');
applyEssayOperationMetadata(stream);

/* ===== misc + boot ===== */
document.getElementById('fbLinkedIn').href=CONFIG.linkedin;
document.getElementById('fbMail').href='mailto:'+CONFIG.email+'?subject='+encodeURIComponent(CONFIG.subject);
document.getElementById('fbCopy').onclick=function(e){
  e.preventDefault();const t=e.currentTarget;
  if(navigator.clipboard)navigator.clipboard.writeText(location.href).then(function(){
    const o=t.textContent;t.textContent='Copied';setTimeout(function(){t.textContent=o;},1600);});};

document.getElementById('themeSeg').onclick=function(event){
  const button=event.target.closest('button[data-theme]');if(!button)return;
  document.documentElement.setAttribute('data-theme',button.dataset.theme);
  button.parentNode.querySelectorAll('button').forEach((item)=>item.classList.toggle('active',item===button));
};
function updateReadingProgress(){
  const progress=document.getElementById('readingProgress');
  if(LEVEL<5){progress.style.width='0%';return;}
  const article=document.getElementById('stream'),start=article.getBoundingClientRect().top+window.scrollY;
  const length=Math.max(1,article.offsetHeight-window.innerHeight);
  progress.style.width=(Math.max(0,Math.min(1,(window.scrollY-start)/length))*100)+'%';
}
let collapseTimer;
window.addEventListener('scroll',()=>{abortIntro();updateReadingProgress();station.classList.remove('is-expanded');window.clearTimeout(collapseTimer);collapseTimer=window.setTimeout(()=>station.classList.add('is-resting'),120);},{passive:true});
window.addEventListener('keydown',(event)=>{
  if(event.target instanceof HTMLInputElement||event.target instanceof HTMLTextAreaElement||event.target.isContentEditable)return;
  if(abortIntro()){event.preventDefault();return;}
  if(event.key==='ArrowRight'){event.preventDefault();setLevel(LEVEL+1);}
  if(event.key==='ArrowLeft'){event.preventDefault();setLevel(LEVEL-1);}
});
for(const type of ['wheel','touchstart','pointerdown'])window.addEventListener(type,()=>abortIntro(),{once:true,passive:true,capture:true});
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let visited=false;
try{visited=sessionStorage.getItem('frame-problem-visited')==='1';sessionStorage.setItem('frame-problem-visited','1');}catch{visited=false;}
if(reduce||visited){setLevel(5);if(reduce){hint.hidden=false;station.classList.add('is-expanded');}}
else{
  INTRO_ACTIVE=true;station.classList.add('is-running','is-expanded');setLevel(0);
  [[250,1],[500,2],[950,3],[1550,4],[2500,5]].forEach(([delay,level])=>introTimers.push(window.setTimeout(()=>{setLevel(level);if(level===5)stopIntro();},delay)));
}
window.addEventListener('load',updateReadingProgress);
