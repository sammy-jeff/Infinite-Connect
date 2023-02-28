
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDHwPewsvmqxMv45AEpkwHVQetjrIGchzU",
  authDomain: "linked-in-test.firebaseapp.com",
  projectId: "linked-in-test",
  storageBucket: "linked-in-test.appspot.com",
  messagingSenderId: "495861820872",
  appId:"1:495861820872:web:fa68766f833ab47027e4fd"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };

  self.registration.showNotification(notificationTitle, notificationOptions);
});