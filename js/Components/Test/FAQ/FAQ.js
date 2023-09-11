class Model{
    view = null;
    init(view){
        this.view = view;
    }
    expand(e){
        this.view.expand(e);
    }
}
class Controller{
    container = null;
    model = null
    init(container, model){
        this.container = container;
        this.model = model;

        const questions = [...this.container.querySelectorAll('.question-item')];
        questions.forEach(element => {
            element.addEventListener('click', this.model.expand.bind(this.model));
            
        });
    }
}
class View{
    container = null;
    init(container){
        this.container = container;
    }
    expand(e){
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
    }
}
const view = new View();
const constroller = new Controller();
const model = new Model();

function start() {
    const container = document.querySelector('.FAQ');
    view.init(container);
    model.init(view);
    constroller.init(container, model);
}

const FAQ = {
    start: start,
    render(){
        return`
        <section class="FAQ-section">
            <div class="container">
                <div class="FAQ">
                    <div class="FAQ-header">
                        <h1 class="FAQ-title">Популярные и часто задаваемые вопросы</h1>
                        <img src="./img/faq2.png" alt="FAQ">
                    </div>
                    
                    <div class="question-item" >
                        <p class="question" aria-expanded="true">Какая скорость считается хорошей?</p>
                        <div class="answer">
                            <p>На этот вопрос нет однозначного ответа. Но если посмотреть на среднюю скорость печати на клавиатуре, которая составляет 207 зн./мин, то можно сказать, что хорошая скорость печати — это выше средней.</p>
                            <p>Для детей нормы скорости печати отличаются:</p>
                            <ul class="list">
                                <li class="list-item">начальная школа — 40-75 зн./мин;</li>
                                <li class="list-item">средняя — 75-125 зн./мин;</li>
                                <li class="list-item">старшая — 100-175 зн./мин;</li>
                                <li class="list-item">студенты — более 150 зн./мин.</li>
                            </ul>
                        </div>
                    </div>
                    <div class="question-item">
                        <p class="question" aria-expanded="true">Какая самая большая скорость печати?</p>
                        <div class="answer">
                            <img class="img" src="./img/champion.png" alt="Частота">
                            <p>1080 знаков за одну минуту на электрической пишущей машинке IBM — рекорд по скорости набора текста, установленный Стеллой Паджунас в 1946 году. Сейчас чемпионкой по набору текста на клавиатуре на английском языке является Барбара Блэкборн. Во время теста в 2005 году она развила скорость печати до 1060 знаков в минуту на клавиатуре Дворака — упрощенном варианте привычной нам раскладки QWERTY.</p>
                            <p>Шон Врона установил очередной рекорд на чемпионате Ultimate Typing Championship — 1280 знаков в минуту. Врона также неофициально побил рекорд Блэкборн по скорости набора текста, поддерживая скорость 870 знаков в минуту в течение 50 минут. Хотя этот рекорд не признан Гиннессом, потому что команда его не отслеживала.</p>
                            <p>Попробуй <a href="#">установить новый рекорд печати</a> установить новый рекорд печати вместе с SmarType, проверка скорости печати займет всего пару минут.</p>
                            
                        </div>
                    </div>
                    <div class="question-item">
                        <p class="question" aria-expanded="true">Как научиться печатать быстрее 500 зн./мин?</p>
                        <div class="answer">
                            <p>Рекордсмены печатают со скоростью 1000 зн./мин и выше, исходя из этого, 500 зн./мин — вполне достижимая цель.</p>
                            <p>Залог успеха любого занятия — регулярная тренировка. Как только ты пропускаешь урок — ты теряешь время, которое уже потратил на обучение. Поэтому постарайся выделить 2-4 недели для регулярных тренировок — каждый день по 30 минут.</p>
                        </div>
                    </div>
                    <div class="question-item">
                        <p class="question" aria-expanded="true">Может ли тестирование помочь улучшить скорость печати?</p>
                        <div class="answer">
                            <p>Конечно, да! Чем больше практики, тем выше скорость. А тестирование скорости печати — это тоже практика. </p>
                            <p>Чтобы твои пальцы как можно скорее запомнили расположение клавиш на клавиатуре, печатай как можно больше: пиши письма друзьям, набирай рефераты или просто проходи тестирование скорости печати. </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
    }
}
export { FAQ }