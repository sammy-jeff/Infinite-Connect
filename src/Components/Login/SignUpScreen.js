import React, { useState } from 'react'
import styles from '../../CSS/loginCss/signUpScreen.module.css'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import useSignUp from '../../customs/useSignUp'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfinity, faSpinner } from '@fortawesome/free-solid-svg-icons'
function SignUpScreen({ showPassword, setShowPassword }) {
  let initialState = {
    username: '',
    email: '',
    password: '',
  }
  const { isLoadingAuth } = useSelector((state) => state.userAuth)
  const [text, setText] = useState(initialState)
  const [testRegex, setTestRegex] = useState({ email: false, password: false })
  const [val1, setVal1] = useState(false)
  const [val2, setVal2] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target
    setText({ ...text, [name]: value })
  }
  //Start validating Email
  const regexes = {
    email:
      /^([a-z0-9\.-]+)@([a-z|\d]+)\.([a-z]{3,8})(\.[a-z]{2,8})?$|(^[\d]{11,11}$)/,
    password: /^[A-Za-z0-9]{8,}$/,
  }

  const validateEmail = (e) => {
    const { name } = e.target
    if (text.email.length < 1) {
      setVal1(true)
    } else if (!regexes.email.test(text.email)) {
      setTestRegex({ ...testRegex, [name]: true })
    } else {
      setTestRegex({ ...testRegex, [name]: false })
    }
  }
  const validatePassword = (e) => {
    const { name } = e.target
    if (text.password.length < 1) {
      setVal2(true)
    } else if (!regexes.password.test(text.password)) {
      setTestRegex({ ...testRegex, [name]: true })
    } else {
      setTestRegex({ ...testRegex, [name]: false })
    }
  }
  // End Validating user
  // Start Authenticating User
  const handleSignUp = useSignUp()
  // End Authenticating User
  return (
    <div className={styles.signUpScreen}>
      <header>
        <Link to='/'>
          <FontAwesomeIcon icon={faInfinity} size='3x' color='#0a66c2' />
        </Link>
      </header>
      <h1>Meet New Friends</h1>
      <form
        className={styles.form}
        onSubmit={(e) =>
          handleSignUp(e, text.username, text.email, text.password)
        }>
        <div className={styles.email__phone}>
          <label>Name</label>
          <input
            type='text'
            name='username'
            // className={val1 ? styles.invalid__input : testRegex.email ? styles.invalid__input : ''}
            value={text.username}
            onChange={handleChange}
          />
        </div>

        <div className={styles.email__phone}>
          <label>Email Address</label>
          <input
            type='email'
            name='email'
            className={
              val1
                ? styles.invalid__input
                : testRegex.email
                ? styles.invalid__input
                : ''
            }
            value={text.email}
            required
            onChange={handleChange}
            onBlur={validateEmail}
            onFocus={() => {
              setVal1(false)
              setTestRegex(false)
            }}
          />
          {val1 && (
            <p className={styles.invalid}>
              Please enter your email address or phone number
            </p>
          )}
          {testRegex.email && (
            <p className={styles.invalid}>
              Please enter a valid email or mobile number
            </p>
          )}
        </div>

        <div className={styles.password}>
          <label>Password (6 or more characters)</label>
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              className={
                val2
                  ? styles.invalid__input
                  : testRegex.password
                  ? styles.invalid__input
                  : ''
              }
              required
              value={text.password}
              onChange={handleChange}
              onBlur={validatePassword}
              onFocus={() => {
                setVal2(false)
                setTestRegex(false)
              }}
            />
            <span
              className={styles.show}
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          {val2 && <p className={styles.invalid}>Please enter your password</p>}
          {testRegex.password && (
            <p className={styles.invalid}>
              Password must be 6 characters or more
            </p>
          )}
        </div>
        <p className={styles.cookie}>
          By clicking Agree & Join, you agree to the Infinite-connect{' '}
          <span>User Agreement, Privacy Policy</span>, and{' '}
          <span>Cookie Policy</span>
        </p>
        <button
          type='submit'
          className={
            testRegex.email ||
            testRegex.password ||
            isLoadingAuth ||
            val1 ||
            val2
              ? styles.signUpBtn__gray
              : styles.signUpBtn
          }
          disabled={
            testRegex.email ||
            testRegex.password ||
            isLoadingAuth ||
            val1 ||
            val2
              ? true
              : false
          }>
          {isLoadingAuth ? (
            <p>
              Creating...{' '}
              <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
            </p>
          ) : (
            `			Agree & Join`
          )}
        </button>
      </form>
      <p className={styles.signIn}>
        Already on Infinite-Connect? <Link to='/signIn'>Sign in</Link>
      </p>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  )
}

export default SignUpScreen
