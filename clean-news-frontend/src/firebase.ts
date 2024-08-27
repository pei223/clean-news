// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";

import "firebase/compat/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/compat/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe7dD8uIcMYJJjNjt4URNkCrTd6rO2dIk",
  authDomain: "clean-news-dev.firebaseapp.com",
  projectId: "clean-news-dev",
  storageBucket: "clean-news-dev.appspot.com",
  messagingSenderId: "342691815715",
  appId: "1:342691815715:web:e52b7a5b970c24e07aac96",
  measurementId: "G-VWKGPQMBTX",
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const db = firebase.firestore();

export default firebase;
