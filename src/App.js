import './App.css'
// import 'react-toastify/dist/ReactToastify.css'
// import { ToastContainer } from 'react-toastify'
import RoutesContainer from './Routes/RoutesContainer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='App'>
      {' '}
      <RoutesContainer />
      <ToastContainer />
    </div>
  )
}

export default App
