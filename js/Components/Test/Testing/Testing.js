import { SmallScreen } from "../../SmallScreen/SmallScreen.js";
import { Testend } from "../TestEnd/Testend.js";
import { Loader } from "../../Loader/Loader.js";
import { db, storage } from "../../../firestore.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { Test } from "../Test.js";

class Model{
    view = null;
    canCalculateAccuracy = true;
    totalSeconds = 0;
    currAccuracy = 100;
    currSpeed = 0;
    delta = 0;
    textLength = 0;
    timerId = null;

    init(view){
        this.view = view;
        this.initialize();
        this.generateText();
        
    }
    initialize(){
        this.canCalculateAccuracy = true;
        this.totalSeconds = 0;
        this.currAccuracy = 100;
        this.currSpeed = 0;
        this.delta = 0;
        this.textLength = 0;
        this.timerId = null;
    }
    async generateText(){
        this.view.showLoader();
        // const n = Math.floor(1 + Math.random() * (10 + 1 - 1));
        const n = 1;
        const layout = localStorage.getItem('__STP_testing_layout__') ? localStorage.getItem('__STP_testing_layout__') : 'ru';
        const storageRef = ref(storage, `tests/${layout}/${n}.txt`);
        try {
            const url = await getDownloadURL(storageRef);
            const data = await fetch(url);
            const text = await data.text();
            this.textLength = text.length;
            this.delta =  +(1 / this.textLength * 100).toFixed(2);
            this.view.addText(text);
        } catch (error) {
            console.log(error.message);
        }
        
    }
    passText(ind){
        this.view.passText(ind);
        this.canCalculateAccuracy = true;
    }
    addRed(ind){
        this.view.addRed(ind);
    }
    startTimer(){
        if(this.timerId){
            clearTimeout(this.timerId);
        } 
        this.totalSeconds++;
        this.timerId = setTimeout(this.startTimer.bind(this), 1000);
    }
    stopTimer(){
        if(this.timerId){
            clearTimeout(this.timerId);
        }
    }
    calculateSpeed(totalSymbols){
        const minutes = this.totalSeconds / 60;
        const speed = Math.round(totalSymbols / minutes);
        this.currSpeed = speed;
        this.view.showSpeed(speed);
    }
    calculateAccuracy(){
        if(this.canCalculateAccuracy){
            this.currAccuracy -= this.delta;
            this.canCalculateAccuracy = false;
        }
        this.view.showAccuracy(this.currAccuracy.toFixed(2));
    }
    restart(){
        this.stopTimer();
        this.initialize();
        this.generateText();        
        this.view.restart();
    }
    showResults(){
        this.view.showResults(this.currSpeed, this.currAccuracy)
    }
    showLayouts(){
        this.view.showLayouts();
    }
    async updateDB(data){
        const username = localStorage.getItem('__STP_username__');
        //Обновление данных об уровне в пользователе
        const testsRef = doc(db, `${username}/`, 'tests');
        const snap = await getDoc(testsRef);
        const tests = snap.data().testsArr;
        tests.push(data);
        updateDoc(testsRef, {testsArr: tests});

        this.updateRating(data);
    }
    async updateRating(data){
        const username = localStorage.getItem('__STP_username__');
        //Обновление данных об уровне в пользователе
        let ratingRef = doc(db, `rating/`, 'rating');
        let snap = await getDoc(ratingRef);
        const results = snap.data().results;
        let isChanged = false;
        for (let i = 0; i < results.length; i++) {
            if(results[i].username === username){
                isChanged = true;
                if(+results[i].speed < +data.speed){
                    results[i].accuracy = data.accuracy;
                    results[i].speed= data.speed;
                }                    
            }
        }
        if(!isChanged){
            results.push({
                username: username,
                speed: data.speed,
                accuracy: data.accuracy, 
            })
        }
        updateDoc(ratingRef, {results: results});
    }
    changeLayout(layout){
        localStorage.setItem('__STP_testing_layout__', layout);
        this.view.rerenderLayout();
    }
}

class Controller{
    container = null;
    model = null;
    counterLetters = 1;
    counterWords = 1
    totalSymbols = 0;
    fistTouch = true;
    canCalcSpeed = false;
    timerId = null;

    someArr = ['Tab', 'CapsLock', 'Shift', 'Backspace' ,'Control', 'Alt', 'Enter', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
    someMoreArr = ['Escape', 'AudioVolumeMute', 'AudioVolumeDown', 'AudioVolumeUp', 'Meta', 'Insert', 'Delete'];
    insignificantKeys = new Set([...this.someArr, ...this.someMoreArr]);

    
    init(container, model){
        this.container = container;
        this.model = model;

        this.testText = this.container.querySelector('.test-text');

        this.restartBtn = this.container.querySelector('.restart');
        this.new_restart = this.restart.bind(this);
        this.restartBtn.addEventListener('click', this.new_restart);

        this.speed = this.container.querySelector('.js-speed-res');
        this.accuracy = this.container.querySelector('.js-accuracy-res');

        this.layoutSelectWrap = this.container.querySelector('.layout-select-wrap');
        this.layoutSelect = this.layoutSelectWrap.querySelector('.layout-select');
        this.layoutLiArr = this.layoutSelectWrap.querySelectorAll('.layout-li');

        this.new_showLayouts = this.showLayouts.bind(this);
        this.layoutSelect.addEventListener('click', this.new_showLayouts)

        this.new_changeLayout = this.changeLayout.bind(this)
        for (let i = 0; i < this.layoutLiArr.length; i++) {
            this.layoutLiArr[i].addEventListener('click', this.new_changeLayout);          
        }

        this.initialize();

        this.new_writeText = this.writeText.bind(this);
        window.addEventListener('keydown', this.new_writeText);
    }
    changeLayout(e){
        const layout = e.target.dataset.layout;
        this.removeAllListeners();
        this.model.changeLayout(layout);
    }
    showLayouts(){
        this.model.showLayouts();
    }
    initialize(){
        this.counterLetters = 1;
        this.counterWords = 1;
        this.totalSymbols = 0;
        this.fistTouch = true;
        this.canCalcSpeed = false;
        this.timerId = null;
    }
    restart(e){
        e.preventDefault();
        this.model.restart();
        this.stopTimer();
        this.initialize();
    }
    writeText(e){
        e.preventDefault(); 
        if(this.testText.querySelectorAll('span').length === this.totalSymbols) return;
        const key = e.key;
        if (!this.insignificantKeys.has(key)){
            if(this.fistTouch){
                this.fistTouch = false;
                setTimeout(()=>{
                    this.model.startTimer();
                    this.canCalcSpeed = true;
                }, 1000);
            }
            const currLetter = this.testText.querySelector(`span[data-num="${this.totalSymbols+1}"]`).textContent;
            if(key === currLetter){
                this.model.passText(this.totalSymbols+1);
                if(this.canCalcSpeed){
                    this.calcSpeed();
                    this.canCalcSpeed = false;
                }                
                if(this.testText.querySelectorAll('span').length === this.totalSymbols + 1 ){//counterLetters
                    this.model.stopTimer();
                    clearTimeout(this.timerId);
                    this.removeAllListeners();
                    this.model.showResults();
                    const date = new Date();
                    const dateString = `${String(date.getDate()).length === 1 ? ('0'+date.getDate()) : date.getDate()}.${(String(date.getMonth()+1)).length === 1 ? ('0' + (date.getMonth()+1)) : date.getMonth()+1}.${date.getFullYear()}`
                    const data = {
                        speed: this.speed.textContent,
                        accuracy: this.accuracy.textContent,
                        date: dateString,
                    }
                    this.model.updateDB(data)
                }          
                this.totalSymbols++;   
            }else{
                this.model.addRed(this.totalSymbols+1);
                this.model.calculateAccuracy()
            }
        }
    }
    calcSpeed(){
        this.stopTimer();
        this.model.calculateSpeed(this.totalSymbols);
        this.timerId = setTimeout(()=>{
            this.calcSpeed();
        }, 900);
    }
    removeAllListeners(){
        this.restartBtn.removeEventListener('click', this.new_restart);

         for (let i = 0; i < this.layoutLiArr.length; i++) {
            this.layoutLiArr[i].removeEventListener('click', this.new_changeLayout);          
        }

        this.layoutSelect.removeEventListener('click', this.new_showLayouts);
        window.removeEventListener('keydown', this.new_writeText);
    }
    stopTimer(){
        if(this.timerId){
            clearTimeout(this.timerId);
        }
    }
}

class View{
    container = null;

    init(container){
        this.container = container;
        
        this.testText = this.container.querySelector('.test-text');
        
        this.speed = this.container.querySelector('.js-speed-res');
        this.accuracy = this.container.querySelector('.js-accuracy-res');

        this.layoutSelectWrap = this.container.querySelector('.layout-select-wrap');
        this.layoutSelect = this.layoutSelectWrap.querySelector('.layout-select');
        this.layoutUl = this.layoutSelectWrap.querySelector('.layout-ul');
        this.layoutLi = this.layoutSelectWrap.querySelector('.layout-li');

        this.restart();

    }
    showLoader(){
        this.testText.innerHTML = Loader.render();
    }
    showLayouts(){
        this.layoutUl.classList.toggle('hide');
    }
    addText(text){
        this.testText.innerHTML = '';
        const words = text.split(' ');
        let num = 1;
        for (let i = 0; i < words.length; i++) {
            const div = document.createElement('div');
            for (let j = 0; j < words[i].length+1; j++) {
                if(num <= text.length){
                    const span = document.createElement('span');
                    if(i === 0 && j === 0){
                        span.classList.add('tgreen');
                    }
                    if(j === words[i].length && i !== words.length-1){
                        span.textContent = ' ';
                    }else{
                        span.textContent = words[i][j];
                    }
                    span.dataset.num = num;
                    num++;
                    div.append(span);
                }                
            }            
            this.testText.append(div);  
        }
    }
    
    addGreen(ind){
        const span = this.testText.querySelector(`span[data-num="${ind}"]`);
        if(span){
            span.classList.add('tgreen');
        }
    }
    addRed(ind){
        const span = this.testText.querySelector(`span[data-num="${ind}"]`);
        span.classList.add('tred');
        span.classList.remove('tgreen');
    }
    passText(ind){
        const span = this.testText.querySelector(`span[data-num="${ind}"]`);
        span.classList.add('passed-text');
        span.classList.remove('tgreen');
        span.classList.remove('tred');
        this.addGreen(ind+1);
    }
    showSpeed(speed){
        this.speed.textContent = speed;
    }
    showAccuracy(accuracy){
        this.accuracy.textContent = Number(accuracy).toFixed(2);
    }
    restart(){
        this.speed.textContent = 0;
        this.accuracy.textContent = 100;
    }
    async showResults(speed, accuracy){
        this.container.classList.add('hide');
        document.querySelector('#root').innerHTML += await Testend.render(speed, Number(accuracy).toFixed(2));
        Testend.start();
    }
    removeHide(){
        this.container.classList.remove('hide');
    }
    rerenderLayout(){        
        this.layoutUl.classList.add('hide');
        this.container.remove();
        const smscreen = document.querySelector('.small-screen');
        smscreen.remove();
        const root = document.querySelector('#root');
        root.innerHTML += Testing.render();
    }
}
const view = new View();
const controller = new Controller();
const model = new Model();

function start(){
    const container = document.querySelector('.js-test-container');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}

function stopTimers() {
    model.stopTimer();
    controller.stopTimer();
    
}
const Testing = {
    title: 'Тест печати',
    start: start,
    stopTimers: stopTimers,
    removeListeners: controller.removeAllListeners.bind(controller),
    render(){
        setTimeout(this.start, 0);
        let layoutName = null;
        const layout = localStorage.getItem('__STP_testing_layout__');
        switch(layout){
            case 'en':
                layoutName = 'English layout';
                break;
            case 'ru':                 
            default:
                layoutName = 'Русская раскладка';
                break;
        }
        return`
            <div class='container js-test-container'>
                <div class="layout-select-wrap">
                    <div class="layout-select">
                        ${layoutName} <i class="fa-solid fa-greater-than"></i>
                    </div>
                    <ul class="layout-ul hide">
                        <li class="layout-li" data-layout="ru">Русская раскладка</li>
                        <li class="layout-li" data-layout="en">English layout</li>
                    </ul>
                </div>                
                <section class="testing">
                    <div class="test-wrap">
                        <div class="test-text">
                            
                        </div>
                        <div class="right-side">
                            <div class="statistics">
                                <div class="characteristic">
                                    <div class="characteristic-header">
                                        <i class="fa-regular fa-gauge-high"></i>
                                        <div class="characteristic-title">Скорость</div>
                                    </div>
                                    <div class="characteristic-res">
                                        <span class='js-speed-res'>0</span>зн/мин
                                    </div>
                                </div>
                            
                                <div class="characteristic">
                                    <div class="characteristic-header">
                                        <i class="fa-regular fa-bullseye"></i>
                                        <div class="characteristic-title">Точность</div>
                                    </div>
                                    <div class="characteristic-res">
                                        <span class='js-accuracy-res'>100</span>%
                                    </div>
                                </div>
                            </div>
                            <a class="restart">Заново</a>
                        </div>
                    </div>
                </section>
            </div>
            ${SmallScreen.render()}
        `
    }
}

export {Testing};
// <select class="layout-select">
//                         <option value="ru">Русская раскладка</value>
//                         <option value="en">Английская раскладка</value>
//                     </select>