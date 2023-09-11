import { db } from "../../../firestore";
import { doc, setDoc, getDoc, updateDoc,} from "firebase/firestore";

class Model{
    view = null;
    date = null; 

    init(view){
        this.view = view;
        this.date = new Date()
    }
    async registrtation(username, password){
        //запрос на сервер
        const userRef = doc(db, 'users/', username);
        const docSnap = await getDoc(userRef);  
        if(!docSnap.exists()){
            const userData = {
                name: username,
                password: password,
            }
            setDoc(userRef, userData);
            await this.initNewCollection(username);
            
            localStorage.setItem(`__STP_username__`,username);
            this.view.clearInputs();
            location.hash = '#levels';
            window.onpopstate = null;
        } else{
            this.view.showWarning(`Пользователь с именем "${username}" уже существует`);
        }       
    }
    async initNewCollection(username){
        //Добавление русских уровней
        const userRuLevelsRef = doc(db, `ruLessons/`, 'settings');
        const ruLevelsSnap = await getDoc(userRuLevelsRef);  
        const ruSymbols = ruLevelsSnap.data().symbols;
        let ref = doc(db, `${username}/`, 'levels');
        let levelsArr = [];
        for (let i = 0; i < ruSymbols.length; i++) {
            const obj = {
                symb: ruSymbols[i],
                count: 0,
                time: '0:00',
                speed: 0,
                accuracy: 0,
                id: i+1,
            }
            levelsArr.push(obj);            
        }        
        setDoc(ref, {ru: levelsArr});

        //Добавление английских уровней
        const userEnLevelsRef = doc(db, `enLessons/`, 'settings');
        const enLevelsSnap = await getDoc(userEnLevelsRef);  
        const enSymbols = enLevelsSnap.data().symbols;
        ref = doc(db, `${username}/`, 'levels');
        levelsArr = [];
        for (let i = 0; i < enSymbols.length; i++) {
            const obj = {
                symb: enSymbols[i],
                count: 0,
                time: '0:00',
                speed: 0,
                accuracy: 0,
                id: i+1,
            }
            levelsArr.push(obj);            
        }        
        updateDoc(ref, {en: levelsArr});

        //Добавление практики
        const userPracticeRef = doc(db, `practise/`, 'settings');
        const practiceSnap = await getDoc(userPracticeRef);  
        const prLevels = practiceSnap.data().levels;
        ref = doc(db, `${username}/`, 'practice');
        levelsArr = [];
        for (let i = 0; i < prLevels.length; i++) {
        const obj = {
                lang: prLevels[i].name,
                short: prLevels[i].short,
                time: '0:00',
                speed: 0,
                accuracy: 0,
            }
            levelsArr.push(obj);            
        }        
        setDoc(ref, {practiceArr: levelsArr});

        //Добавление тестов
        ref = doc(db, `${username}/`, 'tests');
        setDoc(ref, {testsArr: []});

        //Добавление прогресса по уровням
        ref = doc(db, `${username}/`, 'progress');             
        setDoc(ref, {passed: []});
    }    

    checkInputs(val1, val2){
        if(val1 && val2){
            this.view.setBtn(false);
        }else{
            this.view.setBtn(true);
        }
    }
    manipulateWithPass(flag){
        this.view.showAndHidePassword(flag)
    }
}

class Controller{
    container = null;
    model = null;
    init(container, model){
        this.container = container;
        this.model = model;

        this.registerBtn = this.container.querySelector('.register-btn');
        this.new_registration = this.registrtation.bind(this);
        this.registerBtn.addEventListener('click', this.new_registration);

        this.nameInput = this.container.querySelector('#username');
        this.passInput = this.container.querySelector('#userpass');

        this.new_checkInputs = this.checkInputs.bind(this)
        this.nameInput.addEventListener('input', this.new_checkInputs);
        this.passInput.addEventListener('input', this.new_checkInputs);

        this.eye = this.container.querySelector('.fa-eye');
        this.new_hidePass =  this.hidePassword.bind(this);
        this.new_showPass = this.showPassword.bind(this);
        this.eye.addEventListener('mousedown', this.new_showPass);
        this.eye.addEventListener('mouseup', this.new_hidePass);
    }
    showPassword(e){
        if(e.buttons === 1){
            this.model.manipulateWithPass(true);
        }
    }
    hidePassword(e){
        this.model.manipulateWithPass(false);
    }
    checkInputs(e){
        this.model.checkInputs(this.passInput.value, this.nameInput.value)
    }
    registrtation(e){
        e.preventDefault();
        this.model.registrtation(this.nameInput.value, this.passInput.value);
    }
    removeListeners(){
        this.registerBtn.removeEventListener('click', this.new_registration);
        this.nameInput.removeEventListener('input', this.new_checkInputs);
        this.passInput.removeEventListener('input', this.new_checkInputs);
        this.eye.removeEventListener('mousedown', this.new_showPass);
        this.eye.removeEventListener('mouseup', this.new_hidePass);
    }
}

class View{
    container = null;
    init(container){
        this.container = container;

        this.nameInput = this.container.querySelector('#username');
        this.passInput = this.container.querySelector('#userpass');
        this.warning = this.container.querySelector('.warning');
        this.registerBtn = this.container.querySelector('.register-btn');   
        this.eye = this.container.querySelector('.fa-eye');
    }
    clearInputs(){
        this.nameInput.value = '';
        this.passInput.value = '';
    }
    setBtn(flag){
        this.registerBtn.disabled = flag;
    }
    showAndHidePassword(isTextType){
        if(isTextType){
            this.eye.style.opacity = '0.8';
            this.passInput.type = 'text';
        }else{
            this.eye.style.opacity = '';
            this.passInput.type = 'password'
        }
    }
    showWarning(message){
        this.warning.textContent = message;
        this.clearInputs();
    }
}
const model = new Model();
const controller = new Controller();
const view  = new View();

function start(){
    const container = document.querySelector('.form-wrap');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}

function removeListeners() {
    controller.removeListeners();
}
const RegisterForm = {
    title: 'Регистрация',
    start: start,
    removeListeners: removeListeners,
    render(){
        setTimeout(this.start, 0);
        return`
        <div class="form-container">
            <div class="form-wrap">
                <form class="form" method='post'>
                    <div>
                        <h2 class="form-title">Регистрация</h2>
                        <div class="input-box">
                            <i class="fa-regular fa-a"></i>
                            <input type="text" name="username" id="username" autocomplete='off' required>
                            <label for="username">Имя</label>
                        </div>
                        <div class="input-box">
                            <i class="fa-solid fa-eye"></i>
                            <input type="password" name="userpass" id="userpass" autocomplete='off' required>
                            <label for="userpass">Пароль</label>
                        </div>
                        <button class="register-btn" type="submit" disabled>Зарегистрироваться</button>
                        <div class="register">
                            <p>Уже есть аккаунт?<a href="#login">Войти</a></p>
                        </div>
                        <div class="warning">

                        </div>
                    </div>
                </form>
            </div>       
        </div>
        `;
    }
}
export {RegisterForm};