import React from 'react'
import { useState } from 'react'
import styles from '../../CSS/loggedInCss/layout.module.css'
import HomeNav from './HomeScreen/HomeNav'
function Layout({ children }) {
  const [showInput, setShowInput] = useState(false)

  return (
    <div className={showInput ? styles.opaque : styles.layout}>
      <HomeNav showInput={showInput} setShowInput={setShowInput} />
      {children}
    </div>
  )
}

export default Layout
