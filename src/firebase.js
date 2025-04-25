import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "نسخ من Firebase",
  authDomain: "نسخ من Firebase",
  projectId: "نسخ من Firebase",
  storageBucket: "نسخ من Firebase",
  messagingSenderId: "نسخ من Firebase",
  appId: "نسخ من Firebase"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };