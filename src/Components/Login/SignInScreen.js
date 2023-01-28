import React, { useState } from 'react'
import styles from '../../CSS/loginCss/signInScreen.module.css'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import useSignIn from '../../customs/useSignIn'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfinity, faSpinner } from '@fortawesome/free-solid-svg-icons'

function SignInScreen({ showPassword, setShowPassword }) {
  const initialValues = {
    email: '',
    password: '',
  }

  const [values, setValues] = useState(initialValues)
  const handleSignIn = useSignIn()
  const { isLoadingAuth } = useSelector((state) => state.userAuth)
  const handleChanges = (e) => {
    let { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  return (
    <div className={styles.signInScreen}>
      <header className={styles.header__img}>
        <Link to='/'>
          <FontAwesomeIcon icon={faInfinity} size='3x' color='#0a66c2' />
        </Link>
      </header>
      <section className={styles.section}>
        <form
          className={styles.form}
          onSubmit={(e) => handleSignIn(e, values.email, values.password)}>
          <h1>Sign in</h1>
          <p>Connect the World</p>
          <div className={styles.forEmail}>
            <label
              htmlFor='email'
              className={values.email.length >= 1 ? styles.active__label : ''}>
              Email Address
            </label>
            <input
              type='text'
              name='email'
              id='email'
              className={styles.email__phone}
              required
              value={values.email}
              onChange={handleChanges}
            />
          </div>
          <div className={styles.forPassword}>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              className={styles.password}
              value={values.password}
              required
              onChange={handleChanges}
            />
            <label
              htmlFor='password'
              className={
                values.password.length >= 1 ? styles.active__label : ''
              }>
              Password
            </label>
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          <Link to={`/reset`} className={styles.forgot}>
            Forgot password?
          </Link>
          <button
            type='submit'
            className={isLoadingAuth ? styles.gray : styles.signInBtn}
            onSubmit={(e) => handleSignIn(e, values.email, values.password)}
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
