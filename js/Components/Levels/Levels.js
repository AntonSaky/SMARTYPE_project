import {LevelBlock} from './LevelBlock/LevelBlock.js';
import { Layouts } from './Layouts/Layouts.js';
import { Practice } from './Practice/Practice.js';
import { db } from '../../firestore.js';
import { doc, getDoc } from 'firebase/firestore';

class Model{
    view = null;
    init(view){
        this.view = view;
    }
}
class Controller{
    containerLvls = null;
    containerPractice = null;
    model = null;

    init(containerLvls, containerPractice, model){
        this.containerLvls = containerLvls;
        this.containerPractice = containerPractice;
        this.model = model;
        this.containerLvls.addEventListener('click', this.startLevel.bind(this));
        this.containerPractice.addEventListener('click', this.startLevel.bind(this));
    }
    startLevel(e){
        const elem = e.target.closest('.level-wrap');
        const symbols = elem.querySelector('.symbols').textContent;
        const count = elem.querySelector('.count').textContent;
        const practice = elem.querySelector('.programming-lang') ? true : false;
        const id = elem.querySelector('.main-info-title')?.dataset.lvlId;
        const levelData = {
            symbols,
            count,
            practice,
            lvlId: id,
        }
        localStorage.setItem('__STP_level_data__', JSON.stringify(levelData));
    }
}
class View{
    containerLvls = null;
    containerPractice = null;

    init(containerLvls, containerPractice){
        this.containerLvls = containerLvls;
        this.containerPractice = containerPractice;
    }
}


function start(){
    const model = new Model();
    const controller = new Controller();
    const view = new View();

    const containerLevels = document.querySelector('.levels-wrap');
    const containerPractice = document.querySelector('.practise-levels-wrap');
    view.init(containerLevels, containerPractice);
    model.init(view);
    controller.init(containerLevels, containerPractice, model);

}

async function renderLevels(){
    let levelsArr = [];
    const username = localStorage.getItem('__STP_username__');
    const lang = localStorage.getItem('__STP_lang__') ? localStorage.getItem('__STP_lang__') : 'ru';
    const levelsRef = doc(db, `${username}/`, 'levels');
    const snap = await getDoc(levelsRef);
    const levels = snap.data()[lang]; 
    for (let i = 0; i < levels.length; i++) {
        const obj = {
            ...levels[i],
            num: i+1,
        }
        levelsArr.push(LevelBlock.render(obj))          
    }
    return levelsArr;
}
async function renderPractice() {
    let practiceArr = [];
    const username = localStorage.getItem('__STP_username__');
    const practiceRef = doc(db, `${username}/`, 'practice');
    const snap = await getDoc(practiceRef);
    const practiceLvls = snap.data().practiceArr;
    for (let i = 0; i < practiceLvls.length; i++) {
        const obj = {
            ...practiceLvls[i],
        }
        practiceArr.push(Practice.render(obj))           
    }
    return practiceArr;
}

const Levels = {
    title: 'Уровни',
    start,
    async render() {
        const levelsArr = await renderLevels();
        const practiceArr = await renderPractice()
        // setTimeout(this.start, 0);
        
        return`
        <div class='container'>
            <main class="main">
                ${
                    Layouts.render()
                }
                <div>
                    <div class="main__levels-wrap">
                        <h2 class="main-title">Тренировочные уровни</h2>
                        <div class="levels-wrap">
                        ${
                            levelsArr.join('')
                        }
                        </div>                    
                    </div>
                    <hr class='practise-delimiter'>
                    <div class="practise__levels-wrap">
                        <h2 class="main-title">Практика</h2>
                        <div class="practise-levels-wrap">
                        ${
                            practiceArr.join('')
                        }
                        </div>
                    </div>
                </div>
            </main>
        </div>
        `;
    }
}
export {Levels, renderLevels}