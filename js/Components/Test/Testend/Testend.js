import { db } from "../../../firestore.js";
import { doc, getDoc } from "firebase/firestore";

class Model{
    view = null;

    init(view){
        this.view = view;
    }
    tryAgain(){
        this.view.tryAgain();
    }
}

class Controller{
    container = null;
    model = null;
    
    init(container, model){
        this.container = container;
        this.model = model;

        this.tryAgainBtn = this.container.querySelector('.try-again-btn');
        this.new_tryAgain = this.tryAgain.bind(this);
        this.tryAgainBtn.addEventListener('click', this.new_tryAgain);
    }
    tryAgain(e){
        e.preventDefault();
        removeListeners();
        this.model.tryAgain();
    }
    removeListeners(){
        this.tryAgainBtn.removeEventListener('click', this.new_tryAgain);
    }
}

class View{
    container = null;

    init(container){
        this.container = container;
    } 
    async tryAgain(){
        this.container.remove();
        const TestigModule = await import('../Testing/Testing.js')
        document.querySelector('.js-test-container').classList.remove('hide');
        TestigModule.Testing.start()
    }    
}
const view = new View();
const controller = new Controller();
const model = new Model();

function start(){
    const container = document.querySelector('.test-end-container');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}
function removeListeners() {
    console.log('removed');
}
const Testend = {
    start: start,
    removeListeners: removeListeners,
    async render(speed, accuracy){
        // setTimeout(this.start, 0);
        const username = localStorage.getItem(`__STP_username__`);
        const testsRef = doc(db, `${username}/`, 'tests');
        let snap = await getDoc(testsRef);
        const tests = snap.data().testsArr; 
        let speedrec = 0;
        let accuracyrec = 0;
        for (let i = 0; i < tests.length; i++) {
            if(tests[i].speed > speedrec){
                speedrec = tests[i].speed;
            }
            if(tests[i].accuracy > accuracyrec){
                accuracyrec = tests[i].accuracy;
            }
        }
        if(speedrec == 0 || speedrec < speed){
            speedrec = speed;
        }
        if(accuracy == 0 || accuracyrec < accuracy){
            accuracyrec = accuracy
        }

        return`
        <div class='test-end-container'>
            <div class="test-end-wrap">
                <h1 class="test-end-title">Поздравляем</h1>
                <div class="test-results-wrap">
                    <div class="test-speed-res">
                        <div class="test-res-title">
                            <i class="fa-regular fa-gauge-high"></i>
                            <span>Скорость</span>
                        </div>
                        <div class="test-speed">
                            <span>${speed}</span>зн/мин
                        </div>
                        <div class="test-speed-record">Твой рекорд <span>${speedrec}</span></div>
                    </div>
                    <div class="test-accuracy-res">
                        <div class="test-res-title">
                            <i class="fa-regular fa-bullseye"></i>
                            <span>Точность</span>
                        </div>
                        <div class="test-accuracy">
                            <span>${accuracy}</span>%
                        </div>
                        <div class="test-accuracy-record">Твой рекорд <span>${accuracyrec}</span></div>
                    </div>
                </div>
                <p class="test-description">
                    Но ты можешь научиться печатать быстрее.
                </p>
                <p class="test-description">
                    <a href='#levels'>Пройди уроки</a> на нашем тренажере.
                </p>
                <a href="#testing" class="try-again-btn">Ёще раз</a>
            </div>
        </div>
        `;
    }
}
export {Testend};