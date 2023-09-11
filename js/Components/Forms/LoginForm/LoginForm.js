import { name } from "file-loader";
import { db } from "../../../firestore";
import { doc, getDoc } from "firebase/firestore";

class Model{
    view = null;
    init(view){
        this.view = view;
    }
    async login(username, password){
        //запрос на сервер
        const docRef = doc(db, "users", username);
        const docSnap = await getDoc(docRef);   

        if (docSnap.exists()) {
        const userData =  docSnap.data();
            if(userData.password === password){
                console.log('allowed');
                localStorage.setItem(`__STP_username__`, username);
                this.view.clearInputs();
                location.hash = '#levels';
                window.onpopstate = null;                
            }else{
                this.view.showWarning('Неверный пароль')
            }
        }else {
            this.view.showWarning(`Пользователя с именем "${username}" не существует`);
        }
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
    model = null
    init(container, model){
        this.container = container;
        this.model = model;

        this.loginBtn = this.container.querySelector('.login-btn');
        this.new_login = this.login.bind(this);
        this.loginBtn.addEventListener('click', this.new_login);

        this.nameInput = this.container.querySelector('#username');
        this.passInput = this.container.querySelector('#userpass');

        this.new_checkInputs = this.checkInputs.bind(this);
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
    login(e){
        e.preventDefault();
        this.model.login(this.nameInput.value, this.passInput.value);
    }
    removeListeners(){
        this.loginBtn.removeEventListener('click', this.new_login);
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
        this.loginBtn = this.container.querySelector('.login-btn');
        this.eye = this.container.querySelector('.fa-eye');
    }
    clearInputs(){
        this.nameInput.value = '';
        this.passInput.value = '';
        this.setBtn(true);
    }
    clearWarning(){
        this.warning.textContent = '';
    }
    showWarning(text){
        this.warning.textContent = text;
        this.clearInputs();
    }
    setBtn(flag){
        this.loginBtn.disabled = flag;
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
function removeListeners(){
    controller.removeListeners();
}
const LoginForm = {
    title: 'Вход',
    start: start,
    removeListeners: removeListeners,
    render(){
        setTimeout(this.start, 0);
        return`
        <div class="form-container">
            <div class="form-wrap">
                <form class="form" method='post'>
                    <div>
                        <h2 class="form-title">Вход</h2>
                        <div class="input-box">
                            <i class="fa-regular fa-a"></i>
                            <input type="text" name="username" id="username" autocomplete="off" required>
                            <label for="username">Имя</label>
                        </div>
                        <div class="input-box">                            
                            <i class="fa-solid fa-eye"></i>
                            <input type="password" name="userpass" id="userpass" required>
                            <label for="userpass">Пароль</label>
                        </div>
                        
                        <button class="login-btn" type="submit" disabled>Войти</button>
                        <div class="register">
                            <p>Ещё нет аккаунта?<a href="#registration">Зарегистрироваться</a></p>
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
export {LoginForm};
// <i class="fa-regular fa-lock"></i>