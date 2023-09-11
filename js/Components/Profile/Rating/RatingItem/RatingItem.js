const RatingItem = {
    render({num, username, speed, accuracy, isMe}){
         let cl = 'profile-rating-item';
        if(isMe){
            cl += ' me';
        }
        return`
        <div class="${cl}">
            <div class="rating-user-info">
                <div class="profile-rating-position">${num}.</div>
                <div class="profile-rating-name">${username}</div>
            </div>
            <div class="stats-wrap">
                <div class="profile-rating-speed stat">
                    <i class="fa-regular fa-gauge-high"></i>
                    <span>${speed}</span> зн/мин
                </div>
                <div class="profile-rating-accuracy stat">
                    <i class="fa-regular fa-bullseye"></i>
                    <span>${accuracy}</span>%
                </div>         
            </div>
                                
        </div>
        `;
    }
}
export {RatingItem};