import React from 'react'
import styles from '../../../CSS/loggedInCss/middle.module.css'
import MiddleMain from './MiddleMain'
import MiddleTop from './MiddleTop'
function Middle() {
  return (
    <section className={styles.middle}>
      <MiddleTop />
      <MiddleMain />
    </section>
  )
}

export default Middle
