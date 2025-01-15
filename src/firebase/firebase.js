import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDdc8TSmd5NYWubP8Ohoi-3faKHcOCUbpM",
  authDomain: "cwallet-64b38.firebaseapp.com",
  projectId: "cwallet-64b38",
  storageBucket: "cwallet-64b38.firebasestorage.app",
  messagingSenderId: "340341159874",
  appId: "1:340341159874:web:b79949a800ff059728085b",
  measurementId: "G-KC7G40TJQ9"
};

// Firebase 초기화
let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { auth, db, analytics }; 