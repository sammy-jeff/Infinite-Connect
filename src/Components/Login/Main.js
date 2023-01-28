import React, { useState } from 'react'
import MainLogin from './MainLogin'
import { Routes, Route } from 'react-router-dom'
import SignInScreen from './SignInScreen'
import SignUpScreen from './SignUpScreen'
function Main() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div>
      <Routes>
        <Route
          path='/'
          element={
            <MainLogin
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          }
        />
        <Route
          path='/signIn'
          element={
            <SignInScreen
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          }
        />
        <Route
          path='/signUp'
          element={
            <SignUpScreen
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default Main
