import * as firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyCHU5PKdx-iELCOKlNM6cZ8hUlvSxYkyYI",
    authDomain: "vue-firebase-4a963.firebaseapp.com",
    databaseURL: "https://vue-firebase-4a963.firebaseio.com",
    projectId: "vue-firebase-4a963",
    storageBucket: "vue-firebase-4a963.appspot.com",
    messagingSenderId: "123286171315",
    appId: "1:123286171315:web:89ebae2ef0e2c7787f8ac6",
    measurementId: "G-2M8PL7MXR3"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.analytics();
const storage = firebaseApp.storage();

export const db = firebaseApp.firestore();