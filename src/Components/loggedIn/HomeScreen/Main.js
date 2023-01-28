import React from 'react'

import styles from '../../../CSS/loggedInCss/main.module.css'
import LeftSide from './LeftSide'
import Middle from './Middle'
import RightSide from './RightSide'
function Main() {
  return (
    <main className={styles.main}>
      <LeftSide />
      <Middle />
      <RightSide />
    </main>
  )
}

export default Main
