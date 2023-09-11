const symbols = 'мить';
let str = [];
while(str.length < 200) {
    const len = Math.floor(1 + Math.random() * (7 + 1 - 1));
    // console.log(len);
    for (let i = 0; i < len; i++) {
        const ind = Math.floor(0 + Math.random() * (3 + 1 - 0));
        str.push(symbols[ind]);
    }
    str.push(' ');
}


str = str.join('').trim();
console.log(str);
console.log(str.length);