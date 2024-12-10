import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrIfo14AGOXtia0z2wjOamHPnjFCBkJ_4",
  authDomain: "local-5e9a4.firebaseapp.com",
  projectId: "local-5e9a4",
  storageBucket: "local-5e9a4.firebasestorage.app",
  messagingSenderId: "964689983524",
  appId: "1:964689983524:web:1366ff1b790decdc8d00b1"
};

// Initialize Firebase
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);
export const auth = getAuth(firebaseApp);