// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBm2_-Z8m3s-5EhmqiJ1bjNwcw4R40vj4Q",
  authDomain: "chatbot-database-cb6fe.firebaseapp.com",
  projectId: "chatbot-database-cb6fe",
  storageBucket: "chatbot-database-cb6fe.appspot.com",
  messagingSenderId: "942949212643",
  appId: "1:942949212643:web:226772e4f7cb91bc7300d6",
  measurementId: "G-L651XGLJG2"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { firestore, auth };

//const analytics = getAnalytics(app);