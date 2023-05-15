import React, { useState } from 'react'
import styles from '../../CSS/loginCss/signInScreen.module.css'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import useSignIn from '../../customs/useSignIn'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faInfinity, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'

function SignInScreen({ showPassword, setShowPassword }) {
  const [errorMessage,setErrorMessage]= useState('')
  const error_holder = errorMessage.toString().substring(10,errorMessage.toString().length-1)
  const initialValues = {
    email: '',
    password: '',
  }
  const handleSignIn = useSignIn()
  const formik= useFormik({
    initialValues,
    onSubmit:(values)=>handleSignIn(values.email,values.password,setErrorMessage)
  })
  const { isLoadingAuth } = useSelector((state) => state.userAuth)

  return (
    <div className={styles.signInScreen}>
      <header className={styles.header__img}>
        <Link to='/'>
          <FontAwesomeIcon icon={faInfinity} size='3x' color='#0a66c2' />
        </Link>
      </header>
      <section className={styles.section}>
      {errorMessage&&<p className={styles.errorMessage}>{error_holder}</p>}
        <form
          className={styles.form}
          onSubmit={formik.handleSubmit}>
          <h1>Sign in</h1>
          <p>Connect the World</p>
          <div className={styles.forEmail}>
            <label
              htmlFor='email'
              className={formik.values.email.length >= 1 ? styles.active__label : ''}>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              className={styles.email__phone}
              required
              {...formik.getFieldProps("email")}
            />
          </div>
          <div className={styles.forPassword}>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              className={styles.password}
              {...formik.getFieldProps("password")}
              required
             
            />
            <label
              htmlFor='password'
              className={
                formik.values.password.length >= 1 ? styles.active__label : ''
              }>
              Password
            </label>
            <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ?<FontAwesomeIcon icon={faEyeSlash}/>: <FontAwesomeIcon icon={faEye}/>}
            </span>
          </div>
          <Link to={`/reset`} className={styles.forgot}>
            Forgot password?
          </Link>
          <button
            type='submit'
            className={isLoadingAuth ? styles.gray : styles.signInBtn}
           
            disabled={isLoadingAuth ? true : false}>
            {isLoadingAuth ? (
              <p>
                Signing in{' '}
                <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
              </p>
            ) : (
              `Sign in`
            )}
          </button>
          {/* <span className={styles.or}>
            <p>or</p>
          </span>
          <button className={styles.googleSignIn}>
            <img src='20210313114223!Google__G__Logo.svg' alt='googleIcon' />
            <p>Sign in with Google</p>
          </button> */}
          {/* <button className={styles.googleSignIn}>
            <img src='Apple_logo_black.svg' alt='googleIcon' />
            <p>Sign in with Apple</p>
          </button> */}
        </form>
        <p className={styles.register}>
          New to Infinite-Connect?{' '}
          <span>
            <Link to='/signUp'>Join Now</Link>
          </span>
        </p>
      </section>
      <div className={styles.foot}>
        <Footer />
      </div>
    </div>
  )
}

export default SignInScreen
