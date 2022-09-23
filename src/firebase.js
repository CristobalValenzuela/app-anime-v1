
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzLS-KKyX1KkZ1STvQhDaPI7c05lpiZr4",
  authDomain: "app-anime-v1.firebaseapp.com",
  projectId: "app-anime-v1",
  storageBucket: "app-anime-v1.appspot.com",
  messagingSenderId: "898127990549",
  appId: "1:898127990549:web:d71509005f3b510e38231c",
  measurementId: "G-VSQ58J6Z09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics}