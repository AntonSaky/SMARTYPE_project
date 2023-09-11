import { Rating } from "./Rating/Rating.js";
import { UserLevels as Levels } from "./UserLevels/UserLevels.js";
import { Tests } from "./UserTests/Tests.js";
import { db } from "../../firestore.js";
import { doc, getDoc } from "firebase/firestore";
import { Loader } from "../Loader/Loader.js";

const routes = {
    'user-levels': Levels,
    'user-tests': Tests,
    'user-rating': Rating,
}
class Model{
    view = null;
    init(view){
        this.view = view
    }
    updateState(hashPageName){
        this.view.render(hashPageName);
    }
    logout(){
        localStorage.removeItem('__STP_username__');
        location.hash = '#login';
        history.pushState(null, null, location.href);
        window.onpopstate = function(event) {
            history.go(1);
        };       
    }
}

class Controller{
    container = null;
    model = null
    init(container, model){
        this.container = container;
        this.model = model;

        this.new_updateState = this.updateState.bind(this);
        window.addEventListener("hashchange", this.new_updateState);
        this.logOutBtn = this.container.querySelector('.log-out');

        this.new_logout = this.logout.bind(this)
        this.logOutBtn.addEventListener('click', this.new_logout);

        this.updateState(); //первая отрисовка
    }

    updateState = function() {
        const hashPageName = location.hash.slice(1).toLowerCase();
        this.model.updateState(hashPageName);
    }
    logout(e){
        this.model.logout();
    }
    removeListeners(){
        window.removeEventListener("hashchange", this.new_updateState);
        this.logOutBtn.removeEventListener('click', this.new_logout);
    }
}

class View{
    container = null;
    init(container){
        this.container = container;
        this.profileContent = this.container.querySelector('#profile-nav-content')
    }
    async render(hashPageName){
        let routeName = '';

        if(hashPageName !== 'profile'){
            if (hashPageName.length > 0) {
                routeName = hashPageName in routes ? hashPageName : "error";
            }
        }        

        switch (routeName) {
            case 'user-tests':
            case 'user-rating':
            case 'user-levels':
                this.updateButtons(routeName);
                this.profileContent.innerHTML = Loader.render();
                document.body.style.setProperty('--ring-height', 60 + 'px');
                document.body.style.setProperty('--ring-mt', 0 + 'px');
                document.body.style.setProperty('--ring-div-height', 40 + 'px');
                const html = await routes[routeName].render();
                this.profileContent.innerHTML = html;              
                break;
            default:
                break;
        }
            
    }
    updateButtons = function(currentPage) {
        const menuLinks = document.querySelectorAll(".profile-nav-link");
        const state = `#${currentPage}`;
  
        for (let link of menuLinks) {
          state === link.getAttribute("href") ? link.classList.add("curr") : link.classList.remove("curr");
        }
    }       
}
const view = new View();
const controller = new Controller();
const model = new Model();

function start(){
    const container = document.querySelector('.profile-main');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}
function removeListeners(){
    controller.removeListeners();
}

const Profile = {
    title: 'Профиль',
    start: start,
    removeListeners: removeListeners,
    async render(){
        const username = localStorage.getItem(`__STP_username__`);
        const testsRef = doc(db, `${username}/`, 'tests');
        let snap = await getDoc(testsRef);
        const tests = snap.data().testsArr; 
        let speed = 0;
        let accuracy = 0;
        for (let i = 0; i < tests.length; i++) {
            if(tests[i].speed > speed){
                speed = tests[i].speed;
            }
            if(tests[i].accuracy > accuracy){
                accuracy = tests[i].accuracy;
            }
        }

        const levelsRef = doc(db, `${username}/`, 'progress');
        snap = await getDoc(levelsRef);
        const levels = snap.data().passed; 
        const count = levels.length;
        const hash = location.hash.toLocaleLowerCase().slice(1);
        let Component = null;
        switch (hash) {
            case 'user-tests':
                Component = Tests;
                break
            case 'user-rating':
                Component = Rating;
                break;
            case 'user-levels':
                Component = Levels;
                break;
            default:
                Component = Levels;
                break;
        }
        return`
            <div class='container js-profile-container'>
                <main class="profile-main">
                    <div class='log-out'>
                        <i class="fa-solid fa-arrow-right-from-bracket fa-rotate-180"></i>
                        <p>Выйти</p>
                    </div>
                    <div class="profile-header">
                        <div class="user-img">
                            <img src="./img/profile_icon.jpg" alt="">
                        </div>
                        <div class="user-info">
                            <h2 class="user-name">${username}</h2>
                            <div class="user-best-stats">
                                <div class="stats-item">
                                    <div class="stats-item-icon progress">
                                        <i class="fa-solid fa-list-check"></i>
                                    </div>
                                    <div class="stats-item-descr">
                                        <div class="stats-item-title">Уровней</div>
                                        <span>${count}</span> 
                                    </div>
                                </div>
                                <div class="stats-item">
                                    <div class="stats-item-icon speed">
                                        <i class="fa-regular fa-gauge-high"></i>
                                    </div>
                                    <div class="stats-item-descr">
                                        <div class="stats-item-title">Скорость</div>
                                        <span>${speed}</span> зн/мин
                                    </div>
                                </div>
                                <div class="stats-item">
                                    <div class="stats-item-icon accuracy">
                                        <i class="fa-regular fa-bullseye"></i>
                                    </div>
                                    <div class="stats-item-descr">
                                        <div class="stats-item-title">Точность</div>
                                        <span>${accuracy}%</span> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav class="profile-nav">
                        <a class="profile-nav-link curr" href="#user-levels">Уровни</a>
                        <a class="profile-nav-link" href="#user-tests">Тесты</a>
                        <a class="profile-nav-link" href="#user-rating">Рейтинг</a>
                    </nav>
                    <div id="profile-nav-content">
                        ${await Component.render()}
                    </div>
                </main>
            </div>
        `;
    }
}

export {Profile}