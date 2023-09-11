import {TestItem} from './TestItem/TestItem.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firestore.js';


const Tests = {
    async render(){
        let items = [];
        const username = localStorage.getItem('__STP_username__');
        const testsRef = doc(db, `${username}/`, 'tests');
        let snap = await getDoc(testsRef);
        const tests = snap.data().testsArr; 
        for (let i = 0; i < tests.length; i++) {
            items.push(TestItem.render({...tests[i], num: i+1}));
        }
        return`
        <div class="profile-tests">
            ${
                items.length !== 0 ? items.join('') : '<div style="margin-top: 20px; text-align: center;">Вы ещё не проходили тестов</div>'
            }
        </div>
        `;
    }
}
export {Tests};
