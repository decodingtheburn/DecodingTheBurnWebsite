import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_WYkumpyxxb-HetTq3PJtlnh30qYTDOc",
  authDomain: "decodingtheburn-website.firebaseapp.com",
  projectId: "decodingtheburn-website",
  storageBucket: "decodingtheburn-website.firebasestorage.app",
  messagingSenderId: "614303940829",
  appId: "1:614303940829:web:cdd9ad694a2818a8505b34",
  measurementId: "G-0HVH5WH5EZ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
