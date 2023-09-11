const TestItem = {
    render({num, date, speed, accuracy}){
        return`
        <div class="profile-tests-item">
            <div class="user-test-info">
                <div class="profile-test-number">${num}.</div>
                <div class="profile-test-date">${date}</div>
            </div>                    
            <div class="stats-wrap">
                <div class="profile-test-speed stat">
                    <i class="fa-regular fa-gauge-high"></i>
                    <span>${speed}</span> зн/мин
                </div>
                <div class="profile-test-accuracy stat">
                    <i class="fa-regular fa-bullseye"></i>
                    <span>${accuracy}</span>%
                </div>
            </div>                                        
        </div>
        `;
    }
}
export {TestItem};