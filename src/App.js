import './App.css'
import OneSignal from 'react-onesignal'
import RoutesContainer from './Routes/RoutesContainer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from 'react'

function App() {
  // push notifications are not needed for first paint, so load the OneSignal
  // SDK once the browser is idle instead of competing with the app's startup
  useEffect(() => {
    const init = () =>
      OneSignal.init({
        appId: 'a25068dd-0a24-4a05-84a2-1fd2ee3a84ef',
      }).catch(() => {})
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(init, { timeout: 5000 })
      return () => window.cancelIdleCallback(handle)
    }
    const handle = setTimeout(init, 3000)
    return () => clearTimeout(handle)
  }, [])
  return (
    <div className='App'>
      {' '}
      <RoutesContainer />
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        newestOnTop
        limit={3}
      />
    </div>
  )
}

export default App
