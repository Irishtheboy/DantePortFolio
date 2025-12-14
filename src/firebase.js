import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCD-1hsXdPhMKOHnsOinBh_2PD-g-zQmGo",
  authDomain: "danteporft.firebaseapp.com",
  projectId: "danteporft",
  storageBucket: "danteporft.firebasestorage.app",
  messagingSenderId: "202979768268",
  appId: "1:202979768268:web:c797092801e0f97c190f69",
  measurementId: "G-2TXQ8J1XD4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;