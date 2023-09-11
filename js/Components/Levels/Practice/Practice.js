const Practice = {
    render({lang, short, time, speed, accuracy}){
        return`
        <a href="#level" class="level-wrap">
            <header>
                <p class="symbols">${lang}</p>
            </header>
            <main>                
                <div class="count-info">
                    <div class="circle">
                        <p class="count programming-lang">${short}</p>
                    </div>
                </div>
            </main>
            <footer>
                <div class="time">
                    <i class="fa-regular fa-clock"></i>
                    <span>${time}</span>
                </div>
                <div class="speed">
                    <i class="fa-regular fa-gauge-high"></i>
                    ${speed}<span>зн/мин</span>
                </div>
                <div class="accuracy">
                    <i class="fa-regular fa-bullseye"></i>
                    <span>${accuracy}%</span>
                </div>
            </footer>
        </a>
        `;
    }
}
export {Practice}