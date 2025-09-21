// Import the functions you need from the SDKs you need 
import { initializeApp } from "firebase/app"; 
import { getAnalytics } from "firebase/analytics"; 
// TODO: Add SDKs for Firebase products that you want to use 
// https://firebase.google.com/docs/web/setup#available-libraries 
// Your web app's Firebase configuration 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 
const firebaseConfig = { 
apiKey: "AIzaSyB6giBCaqmfJpsqhC0CQjSj9qTBUIVtBPo", 
authDomain: "painterguyspros.firebaseapp.com", 
projectId: "painterguyspros", 
storageBucket: "painterguyspros.firebasestorage.app", 
messagingSenderId: "891319185619", 
appId: "1:891319185619:web:e29afd7c8d42a4502de426", 
measurementId: "G-V6B37STFH9" 
}; 
// Initialize Firebase 
const app = initializeApp(firebaseConfig); 
const analytics = getAnalytics(app); 

export { app };



