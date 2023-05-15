import React, { useState } from 'react'
import styles from '../../CSS/loginCss/signUpScreen.module.css'
import { Link } from 'react-router-dom'
import Footer from './Footer'
import useSignUp from '../../customs/useSignUp'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faInfinity, faSpinner } from '@fortawesome/free-solid-svg-icons'
import {useFormik} from "formik"
import { signUpValidation } from '../../helpers/validation'
function SignUpScreen({ showPassword, setShowPassword }) {
  const [errorMessage,setErrorMessage]= useState('')
  const error_holder = errorMessage.toString().substring(10,errorMessage.toString().length-1)
  const initialValues = {
    username: '',
    email: '',
    password: '',
  }
  const handleSubmit =useSignUp()
  const [verificationMessage,setVerificationMessage] = useState("")
  const onSubmit = (values)=>{
    handleSubmit(values.username,values.email,values.password,setVerificationMessage,setErrorMessage)
  }
  const formik = useFormik({
    initialValues,
    onSubmit,
    validate:signUpValidation,
  })

  
  const { isLoadingAuth } = useSelector((state) => state.userAuth)

  return (
    <div className={styles.signUpScreen}>
      <header>
        <Link to='/'>
          <FontAwesomeIcon icon={faInfinity} size='3x' color='#0a66c2' />
        </Link>
      </header>
      <h1>Meet New Friends</h1>
      {verificationMessage&&<p className={styles.verification}>{verificationMessage}</p>}
      {errorMessage&&<p className={styles.errorMessage}>{error_holder}</p>}
      <form
        className={styles.form}
        onSubmit={
          formik.handleSubmit
        }>
        <div className={styles.email__phone}>
          <label>Name</label>
          <input
            type='text'
            name='username'
            className={
              formik.errors.username&&formik.touched.username?styles.invalid:styles.input
            }
            {...formik.getFieldProps("username")}
          />
          {formik.errors.username&&formik.touched.username?<span className={styles.error}>{formik.errors.username}</span>:null}
        </div>
        
        <div className={styles.email__phone}>
          <label>Email Address</label>
          <input
            type='email'
            name='email'
            className={
              formik.errors.email&&formik.touched.email?styles.invalid:styles.input
            }
            {...formik.getFieldProps("email")}
            required
          
          />
       {formik.errors.email&&formik.touched.email?<span className={styles.error}>{formik.errors.email}</span>:null}
        </div>

        <div className={styles.password}>
          <label>Password (6 or more characters)</label>
          <div>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              className={
                formik.errors.password&&formik.touched.password?styles.invalid:styles.input
              }
              required
              {...formik.getFieldProps("password")}
            />
            <span
              className={styles.show}
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ?<FontAwesomeIcon icon={faEyeSlash}/>: <FontAwesomeIcon icon={faEye}/>}
            </span>
           
          </div>
          
          {formik.errors.password&&formik.touched.password?<span className={styles.error}>{formik.errors.password}</span>:null}
        </div>
        <p className={styles.cookie}>
          By clicking Agree & Join, you agree to the Infinite-connect{' '}
          <span>User Agreement, Privacy Policy</span>, and{' '}
          <span>Cookie Policy</span>
        </p>
        <button
          type='submit'
          disabled={isLoadingAuth?true:false}
          className={
           isLoadingAuth?styles.signUpBtn__gray:styles.signUpBtn
          }
        >
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
