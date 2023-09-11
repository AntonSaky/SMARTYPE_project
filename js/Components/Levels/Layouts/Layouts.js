import { renderLevels } from "../Levels";
class Model{
    view = null;

    init(view){
        this.view = view;
    }
    async updateLang(lang){
        localStorage.setItem('__STP_lang__', lang);        
        const levelsContainer = document.querySelector('.levels-wrap');
        const lvlsArr = await renderLevels();
        this.view.updateLang(lang);
        levelsContainer.innerHTML = lvlsArr.join('');
        
    }
}

class Controller{
    container = null;
    model = null;
    
    init(container, model){
        this.container = container;
        this.model = model;

        const liArr = this.container.querySelectorAll('li');
        for (let i = 0; i < liArr.length; i++) {
            liArr[i].addEventListener('click', (e)=>{
                e.preventDefault();
                this.model.updateLang(e.currentTarget.dataset.lang);
            });            
        }
    }
}

class View{
    container = null;

    init(container){
        this.container = container;
    }
    updateLang(lang) {
        const languages = this.container.querySelectorAll("li");
  
        for (let language of languages) {
            lang === language.dataset.lang ? language.classList.add("selected") : language.classList.remove("selected");
        }
    }  
}
const view = new View();
const controller = new Controller();
const model = new Model();

function start(){
    const container = document.querySelector('.choose-lang');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}

const Layouts = {
    start: start,
    render(){
        setTimeout(()=>this.start(), 0);
        const lang = localStorage.getItem('__STP_lang__') ? localStorage.getItem('__STP_lang__') : 'ru';
        return`
        <div class='choose-lang-container'>
            <ul class="choose-lang">
                <li class="lang-item ${lang === 'ru' ? 'selected' : ''}" data-lang="ru"><a href="#">Русский</a></li>
                <li class="lang-item ${lang === 'en' ? 'selected' : ''}" data-lang="en"><a href="#">Английский</a></li>
            </ul>
        </div>
        `;
    }
}
export {Layouts};