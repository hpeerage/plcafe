import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: 실제 Firebase 설정 정보로 교체 필요
const firebaseConfig = {
  apiKey: "AIzaSyDcFgIlRA_yJQXfNO_YF4YTYs1UlIJdctU",
  authDomain: "plcafe.firebaseapp.com",
  projectId: "plcafe",
  storageBucket: "plcafe.firebasestorage.app",
  messagingSenderId: "922621501238",
  appId: "1:922621501238:web:466e5e66f36993d4611d97",
  measurementId: "G-SG1CVF9N0C"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
