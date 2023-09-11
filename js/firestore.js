import {initializeApp} from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const config = {
    apiKey: "AIzaSyCewz7VJGjr2LC0EQJdmsy7To-v_1gMS6c",
    authDomain: "smartype-925c6.firebaseapp.com",
    projectId: "smartype-925c6",
    storageBucket: "smartype-925c6.appspot.com",
    messagingSenderId: "733657519457",
    appId: "1:733657519457:web:98e92fd7cb0a17f7e1a120"
}

const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);
export {db, storage};