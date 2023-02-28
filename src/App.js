import './App.css'
// import 'react-toastify/dist/ReactToastify.css'
// import { ToastContainer } from 'react-toastify'
import RoutesContainer from './Routes/RoutesContainer'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react';
import { getFirebaseToken, onForegroundMessage } from './firebase';

function App() {
  const [showNotificationBanner, setShowNotificationBanner] = useState(Notification.permission === 'default');
  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log('Received foreground message: ', payload);
        const { notification: { title, body } } = payload;
        toast(`${title}: ${body}`,{delay:2000});
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));
  }, []);
  const handleGetFirebaseToken = () => {
    getFirebaseToken()
      .then((firebaseToken) => {
        console.log('Firebase token: ', firebaseToken);
        if (firebaseToken) {
          setShowNotificationBanner(false);
        }
      })
      .catch((err) => console.error('An error occured while retrieving firebase token. ', err))
  }
  return (
    <div className='App'>
      {' '}
      {showNotificationBanner && <div className="notification-banner">
        <span>The app needs permission to</span>
        <a
          href="#"
          className="notification-banner-link"
          onClick={handleGetFirebaseToken}
        >
          enable push notifications.
        </a>
      </div>}
      <RoutesContainer />
      <ToastContainer />
    </div>
  )
}

export default App
