import { faInfinity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../CSS/loginCss/resetPage.module.css'
import useResetPassword from '../../customs/useResetPassword'
function ResetPage() {
  const [email, setEmail] = useState('')
  const resetPassword = useResetPassword()
  return (
    <div className={styles.resetPage}>
      <header>
        <Link to='/'>
          <FontAwesomeIcon icon={faInfinity} size='3x' color='#0a66c2' />
        </Link>
      </header>
      <h1>Reset Password</h1>
      <form
        className={styles.form}
        onSubmit={(e) => resetPassword(e, email, setEmail)}>
        <label htmlFor='reset-email'>Email</label>
        <input
          type='text'
          id='reset-email'
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type='submit'>Send Reset Email</button>
      </form>
    </div>
  )
}

export default ResetPage
