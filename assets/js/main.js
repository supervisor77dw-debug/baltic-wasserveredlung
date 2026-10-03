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