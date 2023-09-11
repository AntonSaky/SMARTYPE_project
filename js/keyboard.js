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

window.onkeydown = (e)=>{
    e.preventDefault();
    const key = e.key;
    console.log(key);
    const location = e.location;
    const keyboardNorm = document.querySelector('#keyboard-ru');
    const keyboardAlt = document.querySelector('#keyboard-ru-alt');
    
    if(e.key.toLowerCase() === 'shift'){
        keyboardNorm.classList.add('none');
        keyboardNorm.dataset.visible = false;
        keyboardAlt.classList.remove('none');
        keyboardAlt.dataset.visible = true;
    }
    const keyboard = document.querySelector('.keyboard[data-visible = true]');
 
    const rows = keyboard.querySelectorAll('.row');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowItems = row.querySelectorAll('.row-item');
        for (let j = 0; j < rowItems.length; j++) {
            const element = rowItems[j];

            if(element.dataset.value.toLowerCase() == key.toLowerCase()){
                if(key.toLowerCase() === 'shift'){
                    if(element.dataset.location == location){
                        console.log(element.dataset.location);
                        console.log(location);
                        element.style.transform = 'scale(0.85)';
                    }
                }else{
                    element.style.transform = 'scale(0.85)';
                }
            }
            if(key.toLowerCase() === 'capslock' && element.dataset.value.toLowerCase() === 'caps'){
                element.style.transform = 'scale(0.85)';
            }
        }
    }
}
window.onkeyup = (e)=> {
    const key = e.key;
    const location = e.location;
    console.log(key);
    const keyboardNorm = document.querySelector('#keyboard-ru');
    const keyboardAlt = document.querySelector('#keyboard-ru-alt');
    if(e.key.toLowerCase() === 'shift'){
        keyboardNorm.classList.remove('none');
        keyboardNorm.dataset.visible = true;
        keyboardAlt.classList.add('none');
        keyboardAlt.dataset.visible = false;
    }
    const keyboard = document.querySelector('.keyboard[data-visible = true]');
    
    const rows = keyboard.querySelectorAll('.row');
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowItems = row.querySelectorAll('.row-item');
        for (let j = 0; j < rowItems.length; j++) {
            const element = rowItems[j];
            if(element.dataset.value.toLowerCase() == key.toLowerCase()){
                if(key.toLowerCase() === 'shift'){
                    if(element.dataset.location == location){
                        element.style.transform = ''
                    }
                }else{
                    element.style.transform = '';
                }
            }
            if(key.toLowerCase() === 'capslock' && element.dataset.value.toLowerCase() === 'caps'){
                element.style.transform = '';
            }
        }
    }
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
        keyboard.setAttribute('id','keyboard-ru');
        keyboard.dataset.visible = true;
    }else{
        keyboard.setAttribute('id','keyboard-ru-alt');
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
    keyboards.append(keyboard);
}
const keyboards = document.querySelector('.keyboards');
console.log(keyboards);
createKeyboard(ruLayout, false);
// createKeyboard(ruLayout, true);

setTimeout(()=> console.log(1), 0);
console.log(2);
new Promise(res => {
    console.log(3);
    res()
}).then(()=> console.log(4));
console.log(5);