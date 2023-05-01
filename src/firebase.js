import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "realtor-react-38b48.firebaseapp.com",
  projectId: "realtor-react-38b48",
  storageBucket: "realtor-react-38b48.appspot.com",
  messagingSenderId: "470724830488",
  appId: "1:470724830488:web:a9a1ae64fa38d650242a6d"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()