// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2_WS4wTlXPYCxO7QX3XEb2zKY4KGxdyc",
  authDomain: "test-node-with-firebase.firebaseapp.com",
  projectId: "test-node-with-firebase",
  storageBucket: "test-node-with-firebase.firebasestorage.app",
  messagingSenderId: "303483129418",
  appId: "1:303483129418:web:f10eef55a11aac4eaa20b3",
  measurementId: "G-9D8JHW5Q0Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
