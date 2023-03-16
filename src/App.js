import './App.css'
// import 'react-toastify/dist/ReactToastify.css'
// import { ToastContainer } from 'react-toastify'
import OneSignal from 'react-onesignal';
import RoutesContainer from './Routes/RoutesContainer'
import {  ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from 'react';

function App() {
  useEffect(()=>{
    OneSignal.init({
      appId:"a25068dd-0a24-4a05-84a2-1fd2ee3a84ef"
    })
  },[])
  return (
    <div className='App'>
      {' '}
      <RoutesContainer />
      <ToastContainer />
    </div>
  )
}

export default App
