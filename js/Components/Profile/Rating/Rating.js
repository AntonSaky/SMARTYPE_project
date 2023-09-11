import { RatingItem } from "./RatingItem/RatingItem.js"; 
import { db } from "../../../firestore.js";
import { doc, getDoc } from "firebase/firestore";

const Rating = {
    async render(){
        let items = [];
        const username =  localStorage.getItem('__STP_username__');
        const ratingRef = doc(db, 'rating/', 'rating');
        const snap = await getDoc(ratingRef);
        const results = snap.data().results;
        for (let i = 0; i < results.length; i++) {
            let isMe = username === results[i].username;
            items.push(RatingItem.render({num: i+1, ...results[i], isMe: isMe}));
        }
        return`
        <div class="profile-rating">
            ${
                items.length !== 0 ? items.join('') : '<div style="margin-top: 20px; text-align: center;">Результаты отсутствуют</div>'
            }
        </div>
        `;
        
    }
}
export {Rating};