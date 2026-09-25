import React, { useEffect, useState, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import useStateChange from '../customs/useStateChange'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import styles from '../CSS/loggedInCss/home.module.css'

const loadHome = () => import('../Components/loggedIn/HomeScreen/Home')
const loadMessages = () => import('../Components/loggedIn/Messages/Messages')
const loadAbout = () => import('../Components/loggedIn/About/About')
const loadThread = () =>
  import('../Components/loggedIn/HomeScreen/MainPostContent')

const Home = lazy(loadHome)
const Messages = lazy(loadMessages)
const About = lazy(loadAbout)
const MainPostContent = lazy(loadThread)
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

  // once signed in, fetch the other pages' code in the background so
  // navigating to them is instant
  const signedIn = !!user
  useEffect(() => {
    if (!signedIn) return undefined
    const prefetch = () => {
      loadHome()
      loadMessages()
      loadAbout()
      loadThread()
    }
    if ('requestIdleCallback' in window) {
      const handle = window.requestIdleCallback(prefetch, { timeout: 4000 })
      return () => window.cancelIdleCallback(handle)
    }
    const handle = setTimeout(prefetch, 1500)
    return () => clearTimeout(handle)
  }, [signedIn])

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
            <div className={styles.spinner}>
              <FontAwesomeIcon icon={faSpinner} spin size='3x' color='#0a66c2' />
            </div>
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
                      <Route
                        path=':nameId/thread/:postId'
                        element={
                          <Suspense fallback={null}>
                            <MainPostContent />
                          </Suspense>
                        }
                      />
                    </Route>
                      
                    <Route path='messaging' element={<Messages />}/>
                     
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
