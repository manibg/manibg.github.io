const body = document.body;
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.nav-toggle');
const panel = document.querySelector('.nav-panel');
const sections = [...document.querySelectorAll('[data-section]')];
const routeLinks = [...document.querySelectorAll('[data-route]')];
const navLinks = [...document.querySelectorAll('.nav-panel a[href^="#"]')];

function setNav(open){
  toggle?.setAttribute('aria-expanded', String(open));
  panel?.classList.toggle('open', open);
  body.classList.toggle('nav-open', open);
}
toggle?.addEventListener('click',()=>setNav(toggle.getAttribute('aria-expanded')!=='true'));
navLinks.forEach(a=>a.addEventListener('click',()=>setNav(false)));
window.addEventListener('keydown',e=>{if(e.key==='Escape')setNav(false)});

let lastY = window.scrollY;
function onScroll(){
  const y=window.scrollY;
  header?.classList.toggle('scrolled', y>18);
  const max=document.documentElement.scrollHeight-window.innerHeight;
  document.documentElement.style.setProperty('--progress', max>0 ? Math.min(1,y/max) : 0);
  lastY=y;
}
window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

const sectionObs=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  const id=visible.target.dataset.section;
  body.dataset.activeSection=id;
  routeLinks.forEach(a=>a.classList.toggle('active',a.dataset.route===id));
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${id}`));
},{rootMargin:'-32% 0px -50% 0px',threshold:[0,.2,.45,.7]});
sections.forEach(s=>sectionObs.observe(s));

const consoleData={
  client:['00 / CLIENT','Request enters the system'],
  api:['01 / REST API','Validation & contract boundary'],
  spring:['02 / SPRING BOOT','Business logic & orchestration'],
  kafka:['03 / KAFKA','Asynchronous event processing'],
  sql:['04 / SQL','Persistence & query execution']
};
document.querySelectorAll('[data-node]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-node]').forEach(n=>n.classList.remove('active'));
  btn.classList.add('active');
  const [idx,text]=consoleData[btn.dataset.node];
  document.querySelector('[data-console-index]').textContent=idx;
  document.querySelector('[data-console-text]').textContent=text;
}));

const techToNode={java:'spring',spring:'spring',messaging:'kafka',cloud:'sql'};
document.querySelectorAll('[data-tech]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-tech]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});
  btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
  const node=document.querySelector(`[data-node="${techToNode[btn.dataset.tech]}"]`); node?.click();
}));

document.querySelectorAll('[data-stack]').forEach(btn=>{
  const activate=()=>{document.querySelectorAll('[data-stack]').forEach(x=>x.classList.remove('active'));btn.classList.add('active')};
  btn.addEventListener('mouseenter',activate); btn.addEventListener('focus',activate); btn.addEventListener('click',activate);
});

document.querySelectorAll('.project-card').forEach(card=>card.addEventListener('pointermove',e=>{
  const r=card.getBoundingClientRect(); card.style.setProperty('--mx',`${e.clientX-r.left}px`); card.style.setProperty('--my',`${e.clientY-r.top}px`);
}));

const canvas=document.getElementById('field'); const ctx=canvas?.getContext('2d');
let points=[];
function resize(){if(!canvas||!ctx)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(70,Math.floor(innerWidth/18));points=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.25,v:(Math.random()*.18)+.05}))}
function draw(){if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);ctx.fillStyle='rgba(112,239,177,.25)';for(const p of points){p.y-=p.v;if(p.y<-5)p.y=innerHeight+5;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}
resize();window.addEventListener('resize',resize);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)draw();
