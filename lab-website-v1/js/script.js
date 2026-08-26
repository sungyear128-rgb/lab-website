const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');
if(menuBtn && navMenu){
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });
}
document.querySelectorAll('.nav-menu a').forEach(a=>{
  a.addEventListener('click', ()=>navMenu?.classList.remove('open'));
});