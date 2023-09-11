import {UserLevel} from './UserLevel/UserLevel.js';
import { db } from '../../../firestore.js';
import { doc, getDoc } from 'firebase/firestore';

const UserLevels = {
    async render(){
        const items = [];
        const username = localStorage.getItem('__STP_username__');
        const levelsRef = doc(db, `${username}/`, 'progress');
        let snap = await getDoc(levelsRef);
        const levels = snap.data().passed; 
        levels.sort((a, b)=> a.id - b.id)
        for (let i = 0; i < levels.length; i++) {
            items.push(UserLevel.render({...levels[i], num: levels[i].id}));
        }
        return`
        <div class="profile-levels">
            ${
                items.length !== 0 ? items.join('') : '<div style="margin-top: 20px; text-align: center;">Вы ещё не проходили уровней</div>'
            }
        </div>
        `;
    }
}
export {UserLevels};