import { faInfinity } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../CSS/loginCss/footer.module.css'
function Footer() {
  const date = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <ul className={styles.li__footer}>
        <li className={styles.logo}>
          <FontAwesomeIcon icon={faInfinity} size='1x' color='#0a66c2' />
          <span>© {date}</span>
        </li>
        <li>
          <Link to='accessibility'>Accessibility</Link>
        </li>
        <li>
          <Link to='privacy'>Privacy Policy</Link>
        </li>
        <li>
          <Link to='copyright'>Copyright Policy</Link>
        </li>
        <li>
          <Link to='guest'>Guest Controls</Link>
        </li>
        <li>
          <Link to='/language'>Language</Link>
        </li>
        <li>
          <Link to='/about'>About</Link>
        </li>
        <li>
          <Link to='/agreement'>User Agreement</Link>
        </li>
        <li>
          <Link to='/cookie'>Cookie Policy</Link>
        </li>
        <li>
          <Link to='policy'>Brand Policy</Link>
        </li>
        <li>
          <Link to='/community'>Community Guidelines</Link>
        </li>
      </ul>
    </footer>
  )
}

export default Footer
