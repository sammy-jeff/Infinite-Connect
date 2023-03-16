import React, { useState, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import useStateChange from '../customs/useStateChange'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import styles from '../CSS/loggedInCss/home.module.css'
import MainPostContent from '../Components/loggedIn/HomeScreen/MainPostContent'
import MessageCenter from '../Components/loggedIn/Messages/MessageCenter'

const Home = lazy(() => import('../Components/loggedIn/HomeScreen/Home'))
const Messages = lazy(() => import('../Components/loggedIn/Messages/Messages'))
const About = lazy(() => import('../Components/loggedIn/About/About'))
const MainLogin = lazy(() => import('../Components/Login/MainLogin'))
const SignUpScreen = lazy(() => import('../Components/Login/SignUpScreen'))
const SignInScreen = lazy(() => import('../Components/Login/SignInScreen'))
const ResetPage = lazy(() => import('../Components/Login/ResetPage'))
const ProtectedRoutes = lazy(() => import('./ProtectedRoutes'))
const PublicRoutes = lazy(() => import('./PublicRoutes'))
function RoutesContainer() {
  const [showPassword, setShowPassword] = useState(false)
  const { userAuth } = useSelector((state) => state.userAuth)

  const { user } = useSelector((state) => state.user.value)
  useStateChange()

  if (userAuth === undefined) {
    return (
      <div className={styles.spinner}>
        <FontAwesomeIcon icon={faSpinner} size='3x' color='#0a66c2' />
      </div>
    )
  }

  return (
    <>
      <div>
        <Suspense
          fallback={
            <Skeleton
              count={10}
              style={{
                backgroundColor: 'transparent',
                width: '100%',
                height: '100%',
                margin: 'auto auto',
              }}
            />
          }>
          <Routes>
            <>
              <Route element={<PublicRoutes />}>
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
                  path='signIn'
                  element={
                    <SignInScreen
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  }
                />
                <Route
                  path='signUp'
                  element={
                    <SignUpScreen
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  }
                />
                <Route path='reset' element={<ResetPage />} />
              </Route>
            </>

            <>
              <Route element={<ProtectedRoutes />}>
                {user ? (
                  <>
                    <Route path='home' element={<Home />}>
                      <Route path=':nameId/thread/:postId' element={<MainPostContent/>}/>
                    </Route>
                      
                    <Route path='messaging' element={<Messages />}>
                      <Route path=':msgId' element={<MessageCenter/>}/>
                    </Route>
                    <Route path='about/:id' element={<About />}></Route>
                  </>
                ) : (
                  <Route
                    path='*'
                    element={
                      <div className={styles.spinner}>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          size='3x'
                          color='#0a66c2'
                        />
                      </div>
                    }
                  />
                )}
              </Route>
            </>
            <Route path='*' element={<h1>Page not found</h1>} />
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default RoutesContainer
