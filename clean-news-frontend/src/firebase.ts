// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'

import 'firebase/compat/firestore'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/compat/analytics'
import { getAuth } from 'firebase/auth'
import firebaseConfigJson from './firebase-config.json'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = firebaseConfigJson

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)

export const db = firebase.firestore()
export const auth = getAuth(app)

export default firebase
