class Model{
    view = null;
    init(view){
        this.view = view;
    }
    navigationCollapse(){
        this.view.navigationCollapse();
    }
    windowResize(){
        this.view.windowResize();
    }
    
}
class Controller{
    container = null;
    model = null
    init(container, model){
        this.container = container;
        this.model = model;

        const burger = this.container.querySelector('.burger');
        window.burger = burger;
        burger.addEventListener('click', (e)=>{
            console.log('rararararr');
            this.model.navigationCollapse();
        });

        window.onresize = (e)=>{
            this.model.windowResize();
        }
    }
}
class View{
    container = null;
    init(container){
        this.container = container;
        this.burger = this.container.querySelector('.burger');
        this.list = this.container.querySelector('.nav__navigation-list');
        this.nav = this.container.querySelector('.nav');
    }
    navigationCollapse(){
        this.list.classList.toggle('opac');
        this.container.classList.toggle('heightAlign');
        this.nav.classList.toggle('mt');
        
        this.burger.children[0].classList.toggle('first');
        this.burger.children[1].classList.toggle('second');
        this.burger.children[2].classList.toggle('third');
    }
    windowResize(){
        if(window.innerWidth > 851){ 
            this.list.classList.remove('opac');
            this.container.classList.remove('heightAlign');
            this.nav.classList.remove('mt');

            this.burger.children[0].classList.remove('first');
            this.burger.children[1].classList.remove('second');
            this.burger.children[2].classList.remove('third');
        }
    }
}
const view = new View();
const controller = new Controller();
const model = new Model();

function start() {
    const container = document.querySelector('.header');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}

const Navbar = {
    start: start,
    render(){
        // setTimeout(this.start, 0);
        return`
        <div class='container'>
            <header class="header">
                <nav class="nav">
                    <div class="logo">
                        <a href="#levels">SmarType</a>
                        <div class="burger">
                            <span class="burger-item"></span>
                            <span class="burger-item"></span>
                            <span class="burger-item"></span>
                        </div>
                    </div>
                    <ul class="nav__navigation-list">
                        <li class="nav__navigation-item"><a href="#levels">уровни</a></li>
                        <li class="nav__navigation-item"><a href="#test">тестирование</a></li>
                        <li class="nav__navigation-item"><a href="#theory">теория</a></li>
                        <li class="nav__navigation-item"><a href="#profile">профиль</a></li>
                    </ul>
                </nav>
            </header>
        </div>
        `;
    },
}
export { Navbar };