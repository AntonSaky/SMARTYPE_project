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
        <div class="FAQ">
            <div class="FAQ-header">
                <h1 class="FAQ-title">Популярные и часто задаваемые вопросы</h1>
                <img src="./img/faq2.png" alt="FAQ">
            </div>
            
            <div class="question-item" >
                <p class="question" aria-expanded="true">Сколько времени надо, чтобы научиться печатать?</p>
                <div class="answer">
                    <img class="img" src="./img/time.png" alt="Время">
                    <p>Залог успеха любого занятия — регулярная тренировка. Как только ты пропускаешь урок — ты теряешь время, которое уже потратил на обучение. Поэтому постарайся выделить 2-4 недели для регулярных тренировок каждый день по 30 минут.</p>
                </div>
            </div>
            <div class="question-item">
                <p class="question" aria-expanded="true">Как часто следует проходить упражнения для улучшения печати?</p>
                <div class="answer">
                    <img class="img" src="./img/frequency.png" alt="Частота">
                    <p>Как и в любом деле, регулярность — залог успеха. Для закрепления мышечной памяти потребуется много практики и важно, чтобы занятия были регулярными.</p>
                    <p>Ежедневные упражнения по 15-30 минут принесут больше пользы, чем двухчасовые тренировки раз в неделю. Во время коротких тренировок проще удерживать концентрацию и выкроить время на них гораздо легче.</p>
                    <p>Практикуйся при любой возможности и не только с помощью Ratatype. Старайся отрабатывать навыки слепой печати во время общения в соцсетях или при выполнении не очень срочных рабочих задач.</p>
                    <p><a href="/test">Тестирование скорости печати</a> — это тоже практика. Проходи тест время от времени, чтобы знать насколько улучшилась твоя скорость. </p>
                </div>
            </div>
            <div class="question-item">
                <p class="question" aria-expanded="true">Как печатать, не глядя на клавиатуру?</p>
                <div class="answer">
                    <img class="img" src="./img/closed-eye-blue.png" alt="Глаз">
                    <p>Ты не сможешь научиться печатать вслепую, если будешь постоянно подглядывать. Поэтому старайся запомнить расположение букв на клавиатуре.</p>
                    <p>Сначала это кажется слишком медленным, но постепенно ты сможешь увеличить скорость печати. Проходи наши уровни минимум 3 раза для лучшего эффекта.</p>
                </div>
            </div>
            <div class="question-item">
                <p class="question" aria-expanded="true">Как печатать всеми пальцами?</p>
                <div class="answer">
                    <img class="img keyboard-img" src="./img/keyboard-large.png" alt="Клавиатура">
                    <p>Главная идея печати всеми пальцами в том, что за каждым из них закреплена своя зона клавиш. Это позволяет печатать быстрее и не глядя на клавиатуру.</p>
                    <p>Важно нажимать клавиши только тем пальцем, который для них предназначен. Цвет клавиш на клавиатуре поможет тебе понять и запомнить, каким пальцем на какую клавишу нужно нажимать.</p>
                </div>
            </div>
        </div>
        `;
    }
}
export { FAQ }