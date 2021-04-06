import Firebase from 'firebase';
import '@firebase/storage';
let config = {
    apiKey: "AIzaSyDjzjozbOpUfT_Y7W1opUZIus0BOUlDmHE",
    authDomain: "smart-garden-db.firebaseapp.com",
    projectId: "smart-garden-db",
    storageBucket: "smart-garden-db.appspot.com",
    messagingSenderId: "262810701383",
    appId: "1:262810701383:web:dc44370bc0bead9be82b62",
    measurementId: "G-0W2YBYSTZZ"
};
let app = Firebase.initializeApp(config);
export const db = app.database();
export const st = app.storage;