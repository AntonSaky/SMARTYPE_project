const ruLayout = {
    layout: {
        firstrow: ['Ё', '1','2','3','4','5','6','7','8','9','0','-','=','←'],
        secondrow: ['TAB','Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ','\\'],
        thirdrow : ['CAPS','Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э','ENTER'],
        fourthrow : ['SHIFT','Я','Ч','С','М','И','Т','Ь','Б','Ю','.','SHIFT'],
    },
    altLayout: {
        firstrow: ['Ё', '!','"','№',';','%',':','?','*','(',')','_','+','←'],
        secondrow: ['TAB','Й','Ц','У','К','Е','Н','Г','Ш','Щ','З','Х','Ъ','/'],
        thirdrow : ['CAPS','Ф','Ы','В','А','П','Р','О','Л','Д','Ж','Э','ENTER'],
        fourthrow : ['SHIFT','Я','Ч','С','М','И','Т','Ь','Б','Ю',',','SHIFT'],
    },    
    colors: {
        darkblue: ['Ё', 'TAB', 'CAPS', 'SHIFT', 'ENTER', '←'],
        green: ['1','2','!','"','Й','Ф','Я','0','-','=',')','_','+','З','Х','Ъ','\\','/', 'Ж','Э','.',','],
        blue: ['3','№','Ц','Ы','Ч','9','(','Щ','Д','Ю'],
        pink: ['4', ';','У', 'В','С','8','*','Ш','Л','Б', 'E'],
        orange: ['5','6','%',':','К','Е','А','П','М','И'],
        yellow: ['7','?','Н','Г','Р','О','Т','Ь'],
    },
}

const enLayout = {
    layout: {
        firstrow: ['`', '1','2','3','4','5','6','7','8','9','0','-','=','←'],
        secondrow: ['TAB','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
        thirdrow: ['CAPS','A','S','D','F','G','H','J','K','L',';','\'','ENTER'],
        fourthrow: ['SHIFT','Z','X','C','V','B','N','M',',','.','/','SHIFT'],
    },
    altLayout: {
        firstrow: ['~', '!','@','#','$','%','^','&','*','(',')','_','+','←'],
        secondrow: ['TAB','Q','W','E','R','T','Y','U','I','O','P','{','}','|'],
        thirdrow: ['CAPS','A','S','D','F','G','H','J','K','L',':','"','ENTER'],
        fourthrow: ['SHIFT','Z','X','C','V','B','N','M','<','>','?','SHIFT'],
    },
    colors: {
        darkblue: ['Ё', 'TAB', 'CAPS', 'SHIFT', 'ENTER', '←', '`', '~'],
        green: ['1','2','!','@','0','-','=',')','_','+', 'Q', 'A', 'Z', 'P', ';',':', '\\','/', '[', '\'', '"', ']', '{','}','|', '?'],
        blue: ['3','#','9','(','W', 'S', 'X', 'O', 'L', '.', '>'],
        pink: ['4', '8','D', 'C', 'E', 'I', 'K', ',', '$', '*', '<'],
        orange: ['5','6','%',,'R', 'F', 'B', 'V', 'T', 'G', 'V', '^'],
        yellow: ['7','&', 'Y', 'H', 'N', 'U', 'J', 'M'],
    },
}

class Model{
    view = null;
    init(view){
        this.view = view
    }
    showNormKeyboard(){
        this.view.showNormKeyboard();
    }
    showAltKeyboard(){
        this.view.showAltKeyboard();
    }
    scale(element){
        this.view.scale(element);
    }
    removeScale(element){
        this.view.removeScale(element);
    }
}

class Controller{
    container = null;
    model = null
    init(container, model){
        this.container = container;
        this.model = model;

        this.new_keyDownHandler = this.keyDownHandler.bind(this)
        window.addEventListener('keydown', this.new_keyDownHandler);

        this.new_keyUpHandler = this.keyUpHandler.bind(this)
        window.addEventListener('keyup', this.new_keyUpHandler)
    }
    keyDownHandler(e){
        e.preventDefault();
        const key = e.key;
        const location = e.location;
        // const keyboardNorm = this.container.querySelector('#keyboard');
        // const keyboardAlt = this.container.querySelector('#keyboard-alt');

        if(e.key.toLowerCase() === 'shift'){
            this.model.showAltKeyboard();
        }

        const keyboard = this.container.querySelector('.keyboard[data-visible = true]');

        const rows = keyboard.querySelectorAll('.row');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowItems = row.querySelectorAll('.row-item');
            for (let j = 0; j < rowItems.length; j++) {
                const element = rowItems[j];

                if(element.dataset.value.toLowerCase() == key.toLowerCase()){
                    if(key.toLowerCase() === 'shift'){
                        if(element.dataset.location == location){
                            this.model.scale(element);
                        }
                    }else{
                        this.model.scale(element);
                    }
                }
                if(key.toLowerCase() === 'capslock' && element.dataset.value.toLowerCase() === 'caps'){
                    this.model.scale(element);
                }
            }
        }  
    }
    keyUpHandler(e){
        const key = e.key;
        const location = e.location;
            // const keyboardNorm = document.querySelector('#keyboard');
            // const keyboardAlt = document.querySelector('#keyboard-alt');
            
        const keyboard = this.container.querySelector('.keyboard[data-visible = true]');
        const rows = keyboard.querySelectorAll('.row');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowItems = row.querySelectorAll('.row-item');
            for (let j = 0; j < rowItems.length; j++) {
                const element = rowItems[j];
                if(element.dataset.value.toLowerCase() == key.toLowerCase()){
                    if(key.toLowerCase() === 'shift'){
                        if(element.dataset.location == location){
                            this.model.removeScale(element);
                        }
                    }else{
                        this.model.removeScale(element);
                    }
                }
                if(key.toLowerCase() === 'capslock' && element.dataset.value.toLowerCase() === 'caps'){
                    this.model.removeScale(element);
                }
            }
        }
        if(e.key.toLowerCase() === 'shift'){
            this.model.showNormKeyboard();
        }
    }
    removeListeners(){
        window.removeEventListener('keydown', this.new_keyDownHandler);
        window.removeEventListener('keyup', this.new_keyUpHandler);
    }
}

class View{
    container = null;
    init(container){
        this.container = container;

        this.keyboardNorm = this.container.querySelector('#keyboard');
        this.keyboardAlt = this.container.querySelector('#keyboard-alt');
    }    
    showAltKeyboard(){
        this.keyboardNorm.classList.add('none');
        this.keyboardNorm.dataset.visible = false;
        this.keyboardAlt.classList.remove('none');
        this.keyboardAlt.dataset.visible = true;
        this.lightKey(pressedKey);
    }  
    showNormKeyboard(){
        this.keyboardNorm.classList.remove('none');
        this.keyboardNorm.dataset.visible = true;
        this.keyboardAlt.classList.add('none');
        this.keyboardAlt.dataset.visible = false;
        this.lightKey(pressedKey);
    }
    scale(element){
        element.style.transform = 'scale(0.85)';
    }
    removeScale(element){
        element.style.transform = '';
    }
    lightKey(key){
        pressedKey = key;
        const keyboard = this.container.querySelector('.keyboard[data-visible = true]');
        const rows = keyboard.querySelectorAll('.row');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowItems = row.querySelectorAll('.row-item');
            for (let j = 0; j < rowItems.length; j++) {
                const element = rowItems[j];
                if(element.dataset.value.toLowerCase() == key.toLowerCase()){
                    element.classList.add('current');
                }else{
                    element.classList.remove('current');
                }
            }
        }
    }
}
const view = new View();
const controller = new Controller();
const model = new Model();
let pressedKey = null;

function start(){
    const container = document.querySelector('.keyboards');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}

function createKeyboard(langLayout, isAlt){
    let layout = null;
    if(isAlt){
        layout = langLayout.altLayout;
    }else{
        layout = langLayout.layout;
    }
    const colors = langLayout.colors;

    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    if(!isAlt){
        keyboard.setAttribute('id','keyboard');
        keyboard.dataset.visible = true;
    }else{
        keyboard.setAttribute('id','keyboard-alt');
        keyboard.classList.add('none');
        keyboard.dataset.visible = false;
    }

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        if(i == 0){
            const first = layout.firstrow;
            for (let j = 0; j < first.length; j++) {
                const div = document.createElement('div');
                div.classList.add('row-item');
                if(first[j] == '←'){
                    div.classList.add('larr');  
                }
                
                if(first[j] == '←'){
                    div.dataset.value = 'backspace';
                }else{
                    div.dataset.value = first[j];
                }
                colors.darkblue.includes(first[j]) ? div.classList.add('dark-blue') : undefined;
                colors.green.includes(first[j]) ? div.classList.add('green') : undefined;
                colors.blue.includes(first[j]) ? div.classList.add('blue') : undefined;
                colors.pink.includes(first[j]) ? div.classList.add('pink') : undefined;
                colors.orange.includes(first[j]) ? div.classList.add('orange') : undefined;
                colors.yellow.includes(first[j]) ? div.classList.add('yellow') : undefined;

                div.textContent = first[j];
                row.append(div);
            }
            keyboard.append(row);
        }
        if(i == 1){
            const second = layout.secondrow;
            for (let j = 0; j < second.length; j++) {
                const div = document.createElement('div');
                div.classList.add('row-item');
                if(second[j] == 'TAB'){
                    div.classList.add('tab');  
                }
                colors.darkblue.includes(second[j]) ? div.classList.add('dark-blue') : undefined;
                colors.green.includes(second[j]) ? div.classList.add('green') : undefined;
                colors.blue.includes(second[j]) ? div.classList.add('blue') : undefined;
                colors.pink.includes(second[j]) ? div.classList.add('pink') : undefined;
                colors.orange.includes(second[j]) ? div.classList.add('orange') : undefined;
                colors.yellow.includes(second[j]) ? div.classList.add('yellow') : undefined;

                div.textContent = second[j];
                div.dataset.value = second[j];
                row.append(div);
            }
            keyboard.append(row);
        }
        if(i == 2){
            const third = layout.thirdrow;
            for (let j = 0; j < third.length; j++) {
                const div = document.createElement('div');
                div.classList.add('row-item');
                if(third[j] == 'CAPS'){
                    div.classList.add('caps');  
                }
                if(third[j] == 'ENTER'){
                    div.classList.add('enter');  
                }
                colors.darkblue.includes(third[j]) ? div.classList.add('dark-blue') : undefined;
                colors.green.includes(third[j]) ? div.classList.add('green') : undefined;
                colors.blue.includes(third[j]) ? div.classList.add('blue') : undefined;
                colors.pink.includes(third[j]) ? div.classList.add('pink') : undefined;
                colors.orange.includes(third[j]) ? div.classList.add('orange') : undefined;
                colors.yellow.includes(third[j]) ? div.classList.add('yellow') : undefined;

                div.textContent = third[j];
                div.dataset.value = third[j];
                row.append(div);
            }
            keyboard.append(row);
        }
        if(i == 3){
            const fourth = layout.fourthrow;
            for (let j = 0; j < fourth.length; j++) {
                const div = document.createElement('div');
                div.classList.add('row-item');
                if(j === 0){
                    div.classList.add('shiftl');  
                    div.dataset.location = 1
                }
                if(j === fourth.length-1){
                    div.classList.add('shiftr');  
                    div.dataset.location = 2;
                }
                colors.darkblue.includes(fourth[j]) ? div.classList.add('dark-blue') : undefined;
                colors.green.includes(fourth[j]) ? div.classList.add('green') : undefined;
                colors.blue.includes(fourth[j]) ? div.classList.add('blue') : undefined;
                colors.pink.includes(fourth[j]) ? div.classList.add('pink') : undefined;
                colors.orange.includes(fourth[j]) ? div.classList.add('orange') : undefined;
                colors.yellow.includes(fourth[j]) ? div.classList.add('yellow') : undefined;

                div.textContent = fourth[j];
                div.dataset.value = fourth[j];
                row.append(div);
            }
            keyboard.append(row);
        }
        if(i == 4){
            const space = document.createElement('div');
            space.classList.add('row-item');
            space.classList.add('space');
            space.classList.add('dark-blue')
            space.dataset.value = ' ';
            row.append(space);
            keyboard.append(row);
        }
    }
    // document.body.append(keyboard);
    return keyboard.outerHTML;
}
function removeListeners() {
    controller.removeListeners();
}

const Keyboard = {
    start: start,
    removeListeners: removeListeners,
    ruLayout: createKeyboard(ruLayout, false),
    ruAltLayout: createKeyboard(ruLayout, true),
    enLayout: createKeyboard(enLayout, false),
    enAltLayout: createKeyboard(enLayout, true),
    lightKey: view.lightKey.bind(view),
}
export {Keyboard};