const header=document.querySelector('.site-header');
const btn=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeader(){
  if(!header) return;
  header.classList.toggle('scrolled',window.scrollY>24);
}
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});

if(reducedMotion.matches){
  document.querySelectorAll('video[autoplay]').forEach(video=>{
    video.pause();
    video.removeAttribute('autoplay');
  });
}

// Below-the-fold videos (and their posters) load only near the viewport and pause when out of view.
const lazyVideos=document.querySelectorAll('video[data-lazy-video]');
const setPoster=video=>{
  if(video.dataset.poster&&!video.getAttribute('poster')) video.setAttribute('poster',video.dataset.poster);
};
const loadVideo=video=>{
  setPoster(video);
  if(reducedMotion.matches||video.dataset.loaded) return;
  video.querySelectorAll('source[data-src]').forEach(source=>{source.src=source.dataset.src;});
  video.dataset.loaded='true';
  video.load();
};
const playVideo=video=>{
  if(reducedMotion.matches) return;
  const p=video.play();
  if(p&&p.catch) p.catch(()=>{});
};
if(lazyVideos.length){
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const video=entry.target;
        if(entry.isIntersecting){
          loadVideo(video);
          playVideo(video);
        }else if(video.dataset.loaded){
          video.pause();
        }
      });
    },{rootMargin:'600px 0px'});
    lazyVideos.forEach(video=>observer.observe(video));
  }else{
    lazyVideos.forEach(video=>{loadVideo(video);playVideo(video);});
  }
}

if(btn&&nav){
  const setMenuOpen=open=>{
    nav.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',String(open));
    btn.setAttribute('aria-label',open?'Navigation schließen':'Navigation öffnen');
    btn.textContent=open?'Schließen':'Menü';
  };
  btn.addEventListener('click',()=>{
    setMenuOpen(btn.getAttribute('aria-expanded')!=='true');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuOpen(false)));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){
      setMenuOpen(false);
      btn.focus();
    }
  });
  document.addEventListener('click',e=>{
    if(btn.getAttribute('aria-expanded')==='true'&&!header.contains(e.target)) setMenuOpen(false);
  });
}

// Smooth height animation for native <details>; without JS or with reduced motion they open instantly.
document.querySelectorAll('details.accordion').forEach(details=>{
  const summary=details.querySelector('summary');
  if(!summary||!details.animate) return;
  let animation=null;
  const finish=open=>{
    details.open=open;
    details.classList.remove('is-animating');
    details.style.height='';
    animation=null;
  };
  summary.addEventListener('click',e=>{
    if(reducedMotion.matches) return;
    e.preventDefault();
    const opening=animation?details.dataset.opening!=='true':!details.open;
    const start=details.offsetHeight;
    if(animation) animation.cancel();
    details.classList.add('is-animating');
    if(opening) details.open=true;
    const end=opening?details.scrollHeight:summary.offsetHeight;
    details.dataset.opening=String(opening);
    animation=details.animate({height:[start+'px',end+'px']},{duration:Math.min(480,Math.max(240,Math.abs(end-start)*.9)),easing:'cubic-bezier(.2,.7,.2,1)'});
    animation.onfinish=()=>finish(opening);
    animation.oncancel=()=>{details.classList.remove('is-animating');};
  });
});

// Mark the nav link of the section currently in view.
const navLinks=nav?[...nav.querySelectorAll('a[href^="#"]:not(.btn)')]:[];
if(navLinks.length&&'IntersectionObserver' in window){
  const byId=new Set(navLinks.map(a=>a.getAttribute('href').slice(1)));
  const sections=[...document.querySelectorAll('main > section')];
  const setCurrent=id=>navLinks.forEach(a=>{
    if(byId.has(id)&&a.getAttribute('href')==='#'+id) a.setAttribute('aria-current','true');
    else a.removeAttribute('aria-current');
  });
  const spy=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) setCurrent(entry.target.id); });
  },{rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(section=>spy.observe(section));
}