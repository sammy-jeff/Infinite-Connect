// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Production************************
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID ,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// }
// ********************************
// For development***********

const firebaseConfig =process.env.NODE_ENV==="production"?{
  apiKey: process.env.REACT_APP_API_KEY_PROD,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN_PROD,
  projectId: process.env.REACT_APP_PROJECT_ID_PROD ,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET_PROD,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_PROD,
  appId: process.env.REACT_APP_APP_ID_PROD ,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID_PROD
}:{
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID ,
}
// ***********************************
// Initialize Firebase
const app = initializeApp(firebaseConfig)
// create db
const db = getFirestore(app)
// create auth
const auth = getAuth(app)
// create push notification
const messaging = getMessaging(app)
export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};
 const getFirebaseToken = () =>
  getOrRegisterServiceWorker()
    .then((serviceWorkerRegistration) =>
      getToken(messaging, { vapidKey:process.env.NODE_ENV==="production"?"BPzE8xZxuqOOjAK-bLMUtVbqjsnj5eTsFQfn_i5ZhFU2YUWHOy1soqcEb_Q-yG3qyL0aADf_cjbs9KYYaQcAOuE":"BLSE9S7wJhe_YL4XomjTcD00vTAGrLha_8cDBJPK2gkMnAO20TIVpA0vV56fVDKb_MeY7v2EyFZll2G652CEV_Q", serviceWorkerRegistration }));

 const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));
// create storage
const storage = getStorage(app)

export { auth, db, storage,onForegroundMessage,getFirebaseToken }
