// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBm2_-Z8m3s-5EhmqiJ1bjNwcw4R40vj4Q",
//   authDomain: "chatbot-database-cb6fe.firebaseapp.com",
//   projectId: "chatbot-database-cb6fe",
//   storageBucket: "chatbot-database-cb6fe.appspot.com",
//   messagingSenderId: "942949212643",
//   appId: "1:942949212643:web:226772e4f7cb91bc7300d6",
//   measurementId: "G-L651XGLJG2"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDmqGRl1yXVd5-UbVbSK3GqHFsExOgCTso",
  authDomain: "chatbot-954b3.firebaseapp.com",
  projectId: "chatbot-954b3",
  storageBucket: "chatbot-954b3.appspot.com",
  messagingSenderId: "984216850141",
  appId: "1:984216850141:web:e980e5c93fb538dc30d534",
  measurementId: "G-GRQLP2V1B2"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { firestore, auth };

//const analytics = getAnalytics(app);