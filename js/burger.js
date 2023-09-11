const burger = document.querySelector('.burger');
const list = document.querySelector('.nav__navigation-list');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
burger.addEventListener('click', (e)=>{

    list.classList.toggle('opac');
    header.classList.toggle('heightAlign');
    nav.classList.toggle('mt');
    
    burger.children[0].classList.toggle('first');
    burger.children[1].classList.toggle('second');
    burger.children[2].classList.toggle('third');

});

window.onresize = (e)=>{
    if(window.innerWidth > 851){ 
        list.classList.remove('opac');
        header.classList.remove('heightAlign');
        nav.classList.remove('mt');

    
        burger.children[0].classList.remove('first');
        burger.children[1].classList.remove('second');
        burger.children[2].classList.remove('third');
    }
}