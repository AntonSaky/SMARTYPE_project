import { Navbar } from './Components/NavBar/Navbar.js';
import { Footer } from './Components/Footer/Footer.js';
import { Error } from './Components/Error/Error.js';
import { Levels } from './Components/Levels/Levels.js';
import { Level } from './Components/Level/Level.js';//with keyboard
import { Theory } from './Components/Theory/Theory.js'
import { Test } from './Components/Test/Test.js';
import { Testing } from './Components/Test/Testing/Testing.js';
import { Profile } from './Components/Profile/Profile.js';
import { LoginForm } from './Components/Forms/LoginForm/LoginForm.js';
import { RegisterForm } from './Components/Forms/RegisterForm/RegisterForm.js';
import { Testend } from './Components/Test/TestEnd/Testend.js';
import { Loader } from './Components/Loader/Loader.js';

import  '../css/style.css';  

const SPA = function (){
    const routes = {
        navbar: Navbar,
        footer: Footer,
        levels: Levels,//главная страница, выбор уровня
        level: Level,//С клавиатурой
        theory: Theory,
        test: Test,
        testing: Testing,
        profile: Profile,
        login: LoginForm,
        registration: RegisterForm,
        testend: Testend,
        error: Error,
    }
    const notGlobalRoutes = ['user-tests', 'user-levels', 'user-rating'];
    let prevPage = null;

    class Model{
        view = null;
        init(view){
            this.view = view;
        }
        updateState(hashPageName){
            this.view.showPage(hashPageName);
        }
    }

    class Controller{
        model = null;
        container= null;
        init(model, container){
            this.model = model;
            this.container = container;

            window.addEventListener("hashchange", this.updateState.bind(this));

            this.updateState(); //первая отрисовка
        }

        updateState = function() {
            // console.log(document.referrer);
            const hashPageName = location.hash.slice(1).toLowerCase();
            this.model.updateState(hashPageName);
        }


    }

    class View{
        container = null;
        init(container){
            this.container = container;
        }
        async showPage(hashPageName){
            let routeName = 'levels';
            let canUpdateuttons = true;

            // hashPageName === 'user-tests' ||
            //   hashPageName === 'user-levels' ||
            //   hashPageName === 'user-rating'
            if(notGlobalRoutes.includes(hashPageName)){
                routeName = hashPageName;
            }else{
                if (hashPageName.length > 0) {
                    routeName = hashPageName in routes ? hashPageName : "error";
                }                
            }
            if(prevPage !== null ){
                if(notGlobalRoutes.includes(hashPageName) && prevPage === 'profile'){
                    
                }else{
                    if(routes[prevPage]?.hasOwnProperty('removeListeners')){
                        routes[prevPage].removeListeners();
                    }
                }
                
                if(routes[prevPage]?.hasOwnProperty('stopTimers')){
                    routes[prevPage].stopTimers();
                }
            }
            if(!localStorage.getItem('__STP_username__')){
                if(hashPageName === 'registration'){
                    routeName = 'registration';
                    location.hash = '#registration';
                    
                }else{
                    routeName = 'login';
                    location.hash = '#login';
                }
            }
            
            switch(routeName){
                case 'login':
                case 'registration': 
                    document.body.style.backgroundColor = 'var(--bg-body-blue)';
                    window.document.title = routes[routeName].title;
                    this.container.innerHTML = routes[routeName].render();                    
                    break;
                case 'level':
                case 'testing':
                    document.body.style.backgroundColor = 'var(--bg-body-blue)'; 
                    this.container.innerHTML = routes.navbar.render();
                    this.container.innerHTML += await routes[routeName].render();
                    routes.navbar.start();
                    break;
                case 'levels':
                case 'theory':
                case 'test':
                case 'profile':
                    document.body.style.backgroundColor = '';
                    window.document.title = routes[routeName].title;
                    this.container.innerHTML = routes.navbar.render();
                    this.container.innerHTML += Loader.render();
                    document.body.style.setProperty('--ring-height', 100 + 'px');
                    document.body.style.setProperty('--ring-mt', 0 + 'px');
                    document.body.style.setProperty('--ring-div-height', 84 + 'px');
                    const html = await routes[routeName].render();
                    const loader = this.container.querySelector('.lds-ring');
                    loader.remove();
                    this.container.innerHTML += html;
                    this.container.innerHTML += routes.footer.render();
                    if(routes[routeName].hasOwnProperty('start')){
                        routes[routeName].start();
                    }
                    routes.navbar.start();
                    break;
                case 'user-tests':
                case 'user-levels':
                case 'user-rating':
                    canUpdateuttons = false;
                    if(prevPage !== 'user-tests' &&
                    prevPage !== 'user-levels' &&
                    prevPage !== 'user-rating' &&
                    prevPage !== 'profile'){
                        this.container.innerHTML = routes.navbar.render();
                        this.container.innerHTML += Loader.render();
                        document.body.style.setProperty('--ring-height', 100 + 'px');
                        document.body.style.setProperty('--ring-mt', 0 + 'px');
                        document.body.style.setProperty('--ring-div-height', 84 + 'px');
                        const html = await routes.profile.render();
                        const loader = this.container.querySelector('.lds-ring');
                        loader.remove();
                        this.container.innerHTML += html;
                        this.container.innerHTML += routes.footer.render();
                        routes.profile.start();
                        routes.navbar.start();
                    }                    
                    break;
                case 'error':
                    window.document.title = 'Ошибка';
                    this.container.innerHTML = routes[routeName].render();
                    break;
                default:
                    break;

            }
            prevPage = routeName;

            if(canUpdateuttons) this.updateButtons(routeName);
        }
        updateButtons = function(currentPage) {
            const menuLinks = document.querySelectorAll(".nav__navigation-item a");
            const state = `#${currentPage}`;
      
            for (let link of menuLinks) {
              state === link.getAttribute("href") ? link.classList.add("active") : link.classList.remove("active");
            }
        }   
    }
    return{
        init(){
            const root = document.querySelector('#root');
            const model = new Model();
            const controller = new Controller();
            const view  = new View();
            view.init(root);
            model.init(view);
            controller.init(model, root);
        }
    }
}();
document.addEventListener('DOMContentLoaded', SPA.init());