// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
//personal dev databse 
const firebaseConfig = {
  apiKey: "AIzaSyD14i99ALP0ihoNvMNNt4dfGH8epGCh98g",
  authDomain: "quilaton-chatbot.firebaseapp.com",
  projectId: "quilaton-chatbot",
  storageBucket: "quilaton-chatbot.appspot.com",
  messagingSenderId: "104233240385",
  appId: "1:104233240385:web:31ca9007a06e176b6e83c0",
  measurementId: "G-N8HHMNRBE1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { firestore, auth };

//const analytics = getAnalytics(app);