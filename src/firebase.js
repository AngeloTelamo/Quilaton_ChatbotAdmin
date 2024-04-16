// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
//personal dev databse 
const firebaseConfig = {
  apiKey: "AIzaSyBl-vUwQ4tnXIX3En_UCOCxEOfh5GggpUE",
  authDomain: "chatbot-3179e.firebaseapp.com",
  projectId: "chatbot-3179e",
  storageBucket: "chatbot-3179e.appspot.com",
  messagingSenderId: "897109517535",
  appId: "1:897109517535:web:22804e7bd7280fa3b8f56a"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { firestore, auth };

//const analytics = getAnalytics(app);