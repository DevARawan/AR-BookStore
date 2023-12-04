// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBULKcXNNP5RUPKOt8EmZx9kNDpVcwC8h0",
  authDomain: "ar-works-dc18e.firebaseapp.com",
  databaseURL: "https://ar-works-dc18e.firebaseio.com",
  projectId: "ar-works-dc18e",
  storageBucket: "ar-works-dc18e.appspot.com",
  messagingSenderId: "729863592940",
  appId: "1:729863592940:web:c204d8ece7ff664030bec9",
  measurementId: "G-HZTK2QDK8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app;