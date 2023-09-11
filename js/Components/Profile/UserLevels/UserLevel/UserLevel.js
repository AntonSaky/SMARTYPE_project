const UserLevel = {
    render({num, symb, count, time, speed, accuracy}){
        return`
        <div class="profile-levels-item">
            <div class="profile-level-name">Уровень ${num}(${symb})</div>
            <div class="level-stats-wrap">
                <div class="profile-level-count stat">Кол-во: <span>${count}</span> р</div>
                <div class="profile-level-time stat">
                    <i class="fa-regular fa-clock"></i>
                    <span>${time}</span>
                </div>
                <div class="profile-level-speed stat">
                    <i class="fa-regular fa-gauge-high"></i>
                    <span>${speed}</span> зн/мин
                </div>
                <div class="profile-level-accuracy stat">
                    <i class="fa-regular fa-bullseye"></i>
                    <span>${accuracy}</span>%
                </div> 
            </div>                    
        </div>
        `;
    }
}

export {UserLevel};