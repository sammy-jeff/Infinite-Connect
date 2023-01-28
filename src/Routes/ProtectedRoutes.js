import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import styles from '../CSS/loggedInCss/home.module.css'
function ProtectedRoutes() {
  const { userAuth } = useSelector((state) => state.userAuth)

  if (userAuth === undefined) {
    return (
      <div className={styles.spinner}>
        <FontAwesomeIcon icon={faSpinner} size='3x' color='#0a66c2' />
      </div>
    )
  }
  return userAuth !== null ? <Outlet /> : <Navigate to='/' replace />
}

export default ProtectedRoutes
