import {FAQ} from './FAQ/FAQ.js'
const Test = {
    title: 'Тестирование',
    render(){
        setTimeout(()=> FAQ.start(), 0);
        return`
        <div class="header-overlay"></div>
        <main class="main-test">
            <div class="container">
                <div class="main-test-wrap">
                    <div class="speed-img">
                        <img src="./img/certification-hand.png" alt="Скорость">
                    </div>
                    <div class="start-test-wrap">
                        <h1 class="main-test__title">Быстрый тест скорости печати</h1>
                        <p class="main-test__description">Набери небольшой текст. Проверь, сколько знаков в минуту ты печатаешь на русском, украинском или английском языке, и порази друзей или работодателей сертификатом скорости печати.</p>
                        <a href="#testing" class="main-test__btn">Начать тестирование</a>
                    </div>
                </div>
            </div>
        </main>
        <section class="about-test">
        <div class="container">
                <ul class="about-test-list">
                    <li class="about-test-list-item">
                        <h2 class="about-test-title">Зачем проходить тест скорости печати?</h2>
                        <p class="about-test-descr">Чтобы узнать свою скорость и точность печати, понять нужно ли что-то улучшить. Средняя скорость печати составляет 200 зн./мин, попробуй ее превзойти! Ты можешь пройти тест несколько раз и увидеть, как твоя скорость печати улучшается со временем.</p>
                        <p class="about-test-descr">После прохождения теста онлайн ты получишь сертификат скорости печати, который сможешь прикрепить к резюме, показать учителю или похвастаться друзьям.</p>
                    </li>
                    <li class="about-test-list-item">
                        <h2 class="about-test-title">Как мы измеряем скорость печати?</h2>
                        <p class="about-test-descr">Мы измеряем скорость печати в зн./мин  — сколько знаков в минуту без опечаток ты набрал. «Знаком» считается любой символ, включая пробелы. Мы учитываем только правильно набранные слова.</p>
                        <p class="about-test-descr">Поэтому, если сделана опечатка, подсчет символов останавливается, пока ты ее не исправишь.</p>
                    </li>
            </ul>
        </div>
        </section>
        <section class="start-test">
            <h2 class="start-test-title">Тест займет всего 2-3 минуты</h2>
            <p class="start-test-descr">Проходи тест, сколько хочешь. Ограничений нет.
                Хватай клавиатуру и измеряй свою скорость печати!</p>
            <a href="#testing" class="main-test__btn">Начать тестирование</a>
        </section>
        ${FAQ.render()}
        `
    }
}
export {Test};