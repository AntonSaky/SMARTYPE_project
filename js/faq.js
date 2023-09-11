const questions = [...document.querySelectorAll('.question-item')];
questions.forEach(element => {
    element.addEventListener('click', (e)=>{
        const elem = e.currentTarget;
        const questionElem = elem.querySelector('.question');
        let height = questionElem.offsetHeight;
        console.log(height);
        elem.style.height = `${height}px`;

        const answer = elem.querySelector('.answer');
        let flag = JSON.parse(e.target.getAttribute('aria-expanded'));
        if(flag){
            answer.style.position = 'absolute';
            answer.style.display = 'block';
            answer.style.visibility = 'hidden';
            answer.style.width = `${elem.offsetWidth}px`;
            const offsetHeight = answer.offsetHeight;
            // answer.style.height = `${offsetHeight}px`;

            height += offsetHeight+10;

            answer.style.position = '';
            answer.style.visibility = '';
            answer.style.display = '';
            setTimeout(()=> elem.style.height = `${height}px`, 0);
        }else{
            e.currentTarget.addEventListener('transitionend', (e)=>{
                answer.style.display ='';
            })
            answer.style.display = 'block';
            elem.style.height = `${height}px`;
            setTimeout(()=>{
                elem.style.height = '';
            }, 500);
        }
         e.target.setAttribute('aria-expanded', `${!flag}`);        
    });
});

