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
  apiKey: 'AIzaSyCKw_ul9CP5i8eGk3vx-Aka6T7YKZcvvRU',
  authDomain: 'linkedin-clone-58371.firebaseapp.com',
  projectId: 'linkedin-clone-58371',
  storageBucket: 'linkedin-clone-58371.appspot.com',
  messagingSenderId: '120498568172',
  appId: '1:120498568172:web:1242026eee5973d1f29ec9',
  measurementId: 'G-YRSWK82BR7',
}
// ********************************
// For development***********
// const firebaseConfig = {
//   apiKey: 'AIzaSyDHwPewsvmqxMv45AEpkwHVQetjrIGchzU',
//   authDomain: 'linked-in-test.firebaseapp.com',
//   projectId: 'linked-in-test',
//   storageBucket: 'linked-in-test.appspot.com',
//   messagingSenderId: '495861820872',
//   appId: '1:495861820872:web:fa68766f833ab47027e4fd',
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
