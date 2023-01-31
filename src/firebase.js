// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, getToken } from 'firebase/messaging'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Production************************
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN ,
  projectId: process.env.REACT_APP_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET ,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}
// ********************************
// For development***********
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN ,
//   projectId: process.env.REACT_APP_PROJECT_ID ,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET ,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// }
// ***********************************
// Initialize Firebase
const app = initializeApp(firebaseConfig)
// create db
const db = getFirestore(app)
// create auth
const auth = getAuth(app)

// create storage
const storage = getStorage(app)

export { auth, db, storage }
