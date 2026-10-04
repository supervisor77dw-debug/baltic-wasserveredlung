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