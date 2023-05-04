import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../../CSS/loginCss/callToaction.module.css'
import useSignIn from '../../../customs/useSignIn'

import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
function CallToAction() {
  const initialValues = {
    email: '',
    password: '',
  }
  const handleSignIn = useSignIn()
 const formik = useFormik({
  initialValues,
  onSubmit:({email,password})=>handleSignIn(email,password)
 })

  
  const { isLoadingAuth } = useSelector((state) => state.userAuth)
 
  const [showPassword, setShowPassword] = useState(false)

  return (
    <section className={styles.action}>
      <div>
        <h1>Connect The World</h1>
        <form
          className={styles.form}
          onSubmit={formik.handleSubmit}>
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
              {...formik.getFieldProps("email")}
              required
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
          <Link to={`reset`} className={styles.forgot}>
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
        </form>
      </div>
      <div className={styles.imgContainer}>
        <img src='hero.svg' className={styles.hero} alt='hero' />
      </div>
    </section>
  )
}

export default CallToAction
