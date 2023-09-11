class Model{
    view = null;

    init(view){
        this.view = view;
        const textLength = 63;
        this.delta =  +(1 / textLength * 100).toFixed(2);
    }
    again(){
        this.view.again();
    }
}

class Controller{
    container = null;
    model = null;

    init(container,model){
        this.container = container;
        this.model = model;

        this.againBtn = this.container.querySelector('.again-btn');

        this.new_again = this.again.bind(this);
        this.againBtn.addEventListener('click', this.new_again);
    }
    again(e){
        e.preventDefault();
        this.removeListeners();
        this.model.again();
    }
    removeListeners(){
        this.againBtn.removeEventListener('click', this.new_again);
    }
}

class View{
    container = null;
    init(container){
        this.container = container;
    }
    async again(){
        const ovelray = this.container.previousElementSibling;
        ovelray.remove();
        this.container.remove();
        const ModuleLevel = await import('../Level.js');
        ModuleLevel.Level.restart();
    }
}

const view = new View();
const controller = new Controller();
const model = new Model();

function start(){
    const container = document.querySelector('.level-end-container');
    view.init(container);
    model.init(view);
    controller.init(container, model);
}
const LevelResults = {
    start: start,
    render(time, misses, accuracy, speed){
        setTimeout(this.start, 0);
        return`
        <div class="overlay"></div>
        <div class="level-end-container">
            <h2 class="level-end-title">Упражнение завершено!</h2>
            <div class="results">
                <div class="results-stat results__stats-time">
                    <span>${time}</span> мин
                </div>
                <div class="results-stat results__stats-misses">
                    <span>${misses}</span> ошибок
                </div>
                <div class="results-stat results__stats-speed">
                    <span>${speed}</span> зн/мин
                </div>
                <div class="results-stat results__stats-accuracy">
                    <span>${accuracy}%</span> точность
                </div>
            </div>
            <div class="buttons">
                <a href="#" class="again-btn">Ещё раз</a>
                <a href="#levels" class="exit-btn">Выйти</a>
            </div>
        </div>
        `
    }
}
export { LevelResults };