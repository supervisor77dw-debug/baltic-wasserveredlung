const header=document.querySelector('.site-header');
const btn=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');

function updateHeader(){
  if(!header) return;
  header.classList.toggle('scrolled',window.scrollY>24);
}
updateHeader();
window.addEventListener('scroll',updateHeader,{passive:true});

if(btn&&nav){
  btn.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }));
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      btn.focus();
    }
  });
}