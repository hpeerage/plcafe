import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: 실제 Firebase 설정 정보로 교체 필요
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "plcafe-placeholder.firebaseapp.com",
  projectId: "plcafe-placeholder",
  storageBucket: "plcafe-placeholder.appspot.com",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
