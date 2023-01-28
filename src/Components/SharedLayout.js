import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../CSS/loggedInCss/rightSide.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfinity } from '@fortawesome/free-solid-svg-icons'
function SharedLayout() {
  const date = new Date().getFullYear()
  return (
    <div className={styles.layout}>
      <div className={styles.ad__board}>
        <img src={`/ad__img.png`} alt='' />
      </div>
      <footer className={styles.footer}>
        <ul className={styles.footer__list}>
          <li>
            <Link to='#'>About</Link>
          </li>
          <li>
            <Link to='#'>Accessbility</Link>
          </li>
          <li>
            <Link to='#'>Help Center</Link>
          </li>
          <li>
            <Link to='#'>Privacy & Terms</Link>
          </li>
          <li>
            <Link to='#'>Ad Choices</Link>
          </li>
          <li>
            <Link to='#'>Advertising</Link>
          </li>
          <li>
            <Link to='#'>Business Services</Link>
          </li>
          <li>
            <Link to='#'>Get the LinkedIn app</Link>
          </li>
          <li>
            <Link to='#'>More</Link>
          </li>
        </ul>
        <div className={styles.copyright}>
          <FontAwesomeIcon icon={faInfinity} size='1x' color='#0a66c2' />
          <p>
            Infinite-Connect Corporation <span>© {date}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default SharedLayout
