import React, { useEffect, useState } from 'react'
import styles from '../../../CSS/loggedInCss/homenav.module.css'
import {
  faCaretDown,
  faCommentDots,
  faDoorOpen,
  faHome,
  faInfinity,
  faSearch,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../../firebase'
import { collection, doc, updateDoc } from 'firebase/firestore'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SearchResults from './SearchResults'
import { setUser } from '../../../features/userSlice'

function HomeNav({ showInput, setShowInput }) {
  const { user } = useSelector((state) => state.user.value)

  const breakPoint = 801
  const [width, setWidth] = useState(window.innerWidth)
  // const [badgeCount, setBadgeCount] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const handleSignOut = async () => {
    const confirm = window.confirm('Log out?')
    if (confirm) {
      setLoading(true)

      await signOut(auth)
      await updateDoc(doc(db, 'users', user?.id), {
        isOnline: false,
      })
      dispatch(setUser(null))
      setLoading(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return (
    <nav className={styles.nav}>
      <div className={styles.header__container}>
        <header className={styles.header}>
          <Link to='/home'>
            <FontAwesomeIcon icon={faInfinity} size='3x' color='#0a66c2' />
          </Link>
        </header>
        {width >= breakPoint && (
          <div className={styles.big__screen}>
            <input
              type='text'
              placeholder='search'
              onFocus={() => setShowInput(true)}
              onBlur={() => {
                setShowInput(false)
              }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <FontAwesomeIcon icon={faSearch} />
          </div>
        )}

        {searchText && (
          <div className={styles.searchres}>
            <SearchResults
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </div>
        )}
      </div>
      {width < breakPoint && (
        <input
          id='nav_search'
          type='text'
          className={showInput ? styles.extend : styles.normal}
          onFocus={() => setShowInput(true)}
          onBlur={() => {
            setShowInput(false)
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )}

      <ul
        className={
          showInput && width < breakPoint ? styles.no_list : styles.lists
        }>
        {width < breakPoint && (
          <div className={styles.small__screen}>
            <label htmlFor='nav_search'>
              <FontAwesomeIcon icon={faSearch} />
            </label>
          </div>
        )}{' '}
        <li className={styles.icons__container}>
          <NavLink
            to='/home'
            className={({ isActive }) =>
              isActive ? styles.active__link : styles.icons__container
            }>
            <FontAwesomeIcon icon={faHome} />
            <span className={styles.icon__titles}>Home</span>
          </NavLink>
        </li>{' '}
        <li className={styles.icons__container}>
          <NavLink
            to='/messaging'
            // onClick={clearbadge}
            className={({ isActive }) =>
              isActive ? styles.active__link : styles.icons__container
            }>
            <FontAwesomeIcon icon={faCommentDots} />
            <span className={styles.icon__titles}>Messaging</span>
          </NavLink>
        </li>
        <li className={styles.icons__container}>
          <div className={styles.signOut__container}>
            {loading ? (
              <FontAwesomeIcon className={styles.spinner} icon={faSpinner} />
            ) : (
              <FontAwesomeIcon icon={faDoorOpen} onClick={handleSignOut} />
            )}
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default HomeNav
