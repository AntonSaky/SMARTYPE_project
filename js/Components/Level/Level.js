import{Keyboard} from '../Keyboard/Keyboard.js';
import { SmallScreen } from '../SmallScreen/SmallScreen.js';
import { LevelResults } from './LevelResults/LevelResults.js';
import { db, storage } from '../../firestore.js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { Loader } from '../Loader/Loader.js';

class Model{
    view = null;
    canCalculateAccuracy = true;
    currAccuracy = 100;
    totalSeconds = 0;
    minutes = 0;
    seconds = 0;
    timerId = null;

    init(view){
        this.view = view;
        this.initialize();
        this.generateText();
        
    }
    initialize(){
        this.canCalculateAccuracy = true;
        this.currAccuracy = 100;
        this.totalSeconds = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.textLength = 0;
        this.timerId = null;
    }
    async generateText(){
        this.view.showLoader();
        const levelData = JSON.parse(localStorage.getItem('__STP_level_data__'));
        const lang = localStorage.getItem('__STP_lang__') ? localStorage.getItem('__STP_lang__') : 'ru';
        const symbols = levelData.symbols;
        let storageRef = null;
        if (levelData.practice){
            const n = Math.floor(1 + Math.random() * (2 + 1 - 1));
            storageRef = ref(storage, `practice/${symbols}${n}.txt`);
        }else{            
            storageRef = ref(storage, `levels/${lang}/${symbols}.txt`);
        }
        try {
            const url = await getDownloadURL(storageRef);
            let data = await fetch(url);
            const text = await data.text();
            this.textLength = text.length;
            this.delta =  +(1 / this.textLength * 100).toFixed(2);
            this.view.addText(text);
            this.view.lightKey();
        } catch (error) {
            console.log(error.message);
        }        
    }

    eatLetter(key){
        this.view.eatLetter(key);
        this.canCalculateAccuracy = true;
    }

    showError(){
        this.view.showError();
    }
    addMistake(){
        this.view.addMistake();
    }
    calculateAccuracy(){
        if(this.canCalculateAccuracy){
            this.currAccuracy -= this.delta;
            this.canCalculateAccuracy = false;
        }
        this.view.showAccuracy(this.currAccuracy.toFixed(2));
    }
    startTimer(){  
        if(this.timerId){
            clearTimeout(this.timerId);
        }  
        this.calculateTime()
        this.view.showTime(this.seconds, this.minutes);
        this.timerId = setTimeout(this.startTimer.bind(this), 1000);
    }
    calculateTime(){
        this.seconds++
        this.totalSeconds++;
        if(this.seconds === 60){
            this.seconds = 0;
            this.minutes++;
        }
    }
    stopTimer(){
        if(this.timerId){
            clearTimeout(this.timerId);
        } 
    }
    calculateSpeed(totalSymbols){
        let minutes = this.totalSeconds / 60;
        let speed = Math.round(totalSymbols / minutes);
        this.view.showSpeed(speed);
    }
    showResults(){        
        this.view.showResults();
    }

    async updateDB(data){
        const username = localStorage.getItem('__STP_username__');
        const lang = localStorage.getItem('__STP_lang__') ? localStorage.getItem('__STP_lang__') : 'ru';
        if(!data.practice){
            //Обновление данных об уровне в пользователе
            const levelsRef = doc(db, `${username}/`, 'levels')
            const snap = await getDoc(levelsRef);
            const levels = snap.data()[lang];
            for (let i = 0; i < levels.length; i++) {
                if(levels[i].symb === data.symb){
                    levels[i].accuracy = data.accuracy;
                    levels[i].speed = data.speed;
                    levels[i].time = data.time;
                    levels[i].count = (+data.count) + 1;
                }
            }
            updateDoc(levelsRef, {[lang]: levels});
            this.updateProgress(username, data);
        }else{
            const practiceRef = doc(db, `${username}/`, 'practice')
            const snap = await getDoc(practiceRef);
            const levels = snap.data().practiceArr;
            for (let i = 0; i < levels.length; i++) {
                if(levels[i].lang === data.symb){
                    levels[i].accuracy = data.accuracy;
                    levels[i].speed = data.speed;
                    levels[i].time = data.time;
                }
            }
            updateDoc(practiceRef, {practiceArr: levels});
        }        

        
    }
    async updateProgress(username, data){
        //Обновление данных в прогрессе пользователя
        const progressRef = doc(db, `${username}/`, 'progress')
        const snap = await getDoc(progressRef);
        const passedLvls = snap.data().passed;
        let isChanged = false;
        for (let i = 0; i < passedLvls.length; i++) {
            if(passedLvls[i].symb === data.symb){
                isChanged = true;
                passedLvls[i].accuracy = data.accuracy;
                passedLvls[i].speed = data.speed;
                passedLvls[i].time = data.time;
                passedLvls[i].count = (+data.count) + 1;
                passedLvls[i].id = data.id;
            }
        }
        if(!isChanged){
            passedLvls.push({
                symb: data.symb,
                accuracy: data.accuracy,
                count: (+data.count) + 1,
                speed: data.speed,
                time: data.time,
                id: data.id,
            });
        }      
        updateDoc(progressRef, {passed: passedLvls});
    }
}

class Controller{
    container = null;
    model = null;
    fistTouch = true;
    canCalcSpeed = false;

    someArr = ['Tab', 'CapsLock', 'Shift', 'Backspace' ,'Control', 'Alt', 'Enter', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
    someMoreArr = ['Escape', 'AudioVolumeMute', 'AudioVolumeDown', 'AudioVolumeUp', 'Meta', 'Insert', 'Delete'];
    insignificantKeys = new Set([...this.someArr, ...this.someMoreArr]);

    init(container,model){
        this.container = container;
        this.model = model;

        this.visibleText = this.container.querySelector('.text-visible');
        this.writtenText = this.container.querySelector('.written-text');

        this.time = this.container.querySelector('.time-block span');
        this.misses = this.container.querySelector('.stats-misses span');
        this.speed = this.container.querySelector('.stats-speed span');
        this.accuracy = this.container.querySelector('.stats-accuracy span');

        this.initialize();

        this.new_writeText = this.writeText.bind(this);
        window.addEventListener('keydown', this.new_writeText);
    }
    initialize(){
        this.fistTouch = true;
        this.canCalcSpeed = false;
    }
    writeText(e){
        e.preventDefault();
        const text = this.visibleText.textContent;
        if(text.length === 0) return;
        const key = e.key;
        if (!this.insignificantKeys.has(key)){
            // document.querySelector('.hands').style.display = 'none';
            if(this.fistTouch){
                this.fistTouch = false;
                setTimeout(()=>{
                    this.model.startTimer();
                    this.canCalcSpeed = true;
                }, 1000);
            }
            if(key === text[0]){      
                this.model.eatLetter(key);
                if(this.canCalcSpeed){
                    this.calcSpeed();
                    this.canCalcSpeed = false;
                }
                if(text.length === 1){
                    this.model.stopTimer();
                    this.stopTimer();
                    this.model.showResults();
                    const levelData = JSON.parse(localStorage.getItem('__STP_level_data__'));
                    const data = {
                        symb: levelData.symbols,
                        count: levelData.count,
                        time: this.time.textContent,
                        speed: this.speed.textContent,
                        accuracy: parseFloat(this.accuracy.textContent),
                        practice: levelData.practice,
                        id: levelData.lvlId,
                    }
                    this.model.updateDB(data)
                }else{
                    Keyboard.lightKey(text[1]);
                }
            }else{
                this.model.showError();
                this.model.addMistake();
                this.model.calculateAccuracy()
            }
        }
    }
    calcSpeed(){
        this.stopTimer();
        this.model.calculateSpeed(this.writtenText.textContent.length);
        this.timerId = setTimeout(()=>{
            this.calcSpeed();
        }, 900);
    }
    removeListeners(){
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

        this.time = this.container.querySelector('.time-block span');
        this.misses = this.container.querySelector('.stats-misses span');
        this.speed = this.container.querySelector('.stats-speed span');
        this.accuracy = this.container.querySelector('.stats-accuracy span');

        this.visibleText = this.container.querySelector('.text-visible');
        this.writtenText = this.container.querySelector('.written-text');

        this.pacman = this.container.querySelector('.pacman');
        this.pacmanMouth = this.pacman.querySelector('.pacman-mouth');

        this.invisibleText = this.container.querySelector('.text-invisible');

        this.initialize()
    }
    initialize(){
        this.time.textContent = '0:00';
        this.speed.textContent = 0;
        this.misses.textContent = 0;
        this.accuracy.textContent = 100;
        this.writtenText.innerHTML = '';
    }
    showLoader(){
        this.visibleText.innerHTML = Loader.render();
        document.body.style.setProperty('--ring-height', 60 + 'px');
        document.body.style.setProperty('--ring-mt', -135 + 'px');
        document.body.style.setProperty('--ring-div-height', 40 + 'px');
    }
    openPacmanMouth(){     
        this.pacmanMouth.classList.add('open');
        setTimeout(()=> this.pacmanMouth.classList.remove('open'), 50);   
    }
    eatLetter(key){
        const text = this.visibleText.innerText;
        if(key !== ' '){
            this.openPacmanMouth();
        } 
        this.writtenText.textContent += key; 
        this.visibleText.innerText = text.slice(1);
    }
    showError(){
        this.pacman.classList.add('pred');
        setTimeout(()=> this.pacman.classList.remove('pred'), 100);
    }
    addMistake(){
        this.misses.textContent++;
    }
    showAccuracy(accuracy){
        this.accuracy.textContent = Number(accuracy).toFixed(2) +'%';
    }
    showTime(seconds, minutes){
        seconds = String(seconds).length === 1 ? `0${seconds}` : seconds;
        this.time.textContent = `${minutes}:${seconds}`;
    }
    showSpeed(speed){
        this.speed.textContent = speed;
    }
    showResults(){
        const time = this.time.textContent;
        const misses = this.misses.textContent;
        const accuracy = parseFloat(this.accuracy.textContent);
        const speed = this.speed.textContent;
        setTimeout(()=>{
            document.querySelector('#root').innerHTML += LevelResults.render(time, misses, accuracy, speed)
        }, 200);
    }
    addText(text){
        this.visibleText.innerHTML = '';
        this.visibleText.textContent = text;
    }
    lightKey(){
        Keyboard.lightKey(this.visibleText.textContent[0]);
    }
    
}
const view = new View();
const controller = new Controller();
const model = new Model();

function start(){
    const container = document.querySelector('.js-level-container');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}
function restart(){
    removeListeners();
    stopTimers();
    const container = document.querySelector('.js-level-container');
    view.init(container);
    model.init(view);
    controller.init(container, model);
    Keyboard.start();
}
function removeListeners(){
    controller.removeListeners();
    Keyboard.removeListeners();
}
function stopTimers(){
    model.stopTimer();
    controller.stopTimer();
}

const Level = {
    start: start,
    restart: restart, 
    stopTimers: stopTimers,  
    removeListeners: removeListeners,
    async render(){
        setTimeout(Keyboard.start, 0);
        setTimeout(Level.start, 0);
        const lang = localStorage.getItem('__STP_lang__') ? localStorage.getItem('__STP_lang__') : 'ru';
        const data = JSON.parse(localStorage.getItem('__STP_level_data__'));
        return`
        <div class='container js-level-container'>
            <div class="time-block">
                <span>0:00</span>
            </div>

            <div class="stats">
                <div class="stats-misses">
                    <span>0</span> ошибок
                </div>
                <div class="stats-speed">
                    <span>0</span> зн/мин
                </div>
                <div class="stats-accuracy">
                    <span>100%</span> точность
                </div>
            </div>

            <div class="level-text">
                <div class="level-text-wrap">
                    <div class="text-invisible">
                        <div class="written-text"></div>                    
                        <div class="pacman">
                            <div class="pacman-eye"></div>
                            <div class="pacman-mouth"></div>
                        </div>
                    </div>
                    <div class="text-visible"></div>
                </div>
            </div>
        </div>
        ${SmallScreen.render()}
        <div class='keyboards'>
            ${(function(){
                if(data.practice){
                    return Keyboard.enLayout;
                }
                return lang === 'ru' ? Keyboard.ruLayout : Keyboard.enLayout;

            })()}
            ${(function(){
                if(data.practice){
                    return Keyboard.enAltLayout;
                }
                return lang === 'ru' ? Keyboard.ruAltLayout : Keyboard.enAltLayout;

            })()}
            <img class="hands" src="../../../img/hands.png" alt="Пальцы"></img>
        </div>
    `
    }
}
export {Level}
// ${lang === 'ru' ? Keyboard.ruLayout : Keyboard.enLayout}
            // ${lang === 'ru' ? Keyboard.ruAltLayout : Keyboard.enAltLayout}