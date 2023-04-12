import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCep3u5rBdtTBpmZae5hrTx9jQQx9hS3Q8",
    authDomain: "lighthall-counter-a6acd.firebaseapp.com",
    projectId: "lighthall-counter-a6acd",
    storageBucket: "lighthall-counter-a6acd.appspot.com",
    messagingSenderId: "1093689879164",
    appId: "1:1093689879164:web:c51999e4677684d953b7f9"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();


export { app, db }
