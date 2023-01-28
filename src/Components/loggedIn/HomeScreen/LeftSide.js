import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from '../../../CSS/loggedInCss/leftSide.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBookmark,
  faCalendarAlt,
  faCamera,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faPlus,
  faSpinner,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { db } from '../../../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import useProfilePicUpload from '../../../customs/useProfilePicUpload'
import Moment from 'react-moment'
import useDeleteProfilePic from '../../../customs/useDeleteProfilePic'
function LeftSide() {
  const [lessMore, setLessMore] = useState(false)
  const { user } = useSelector((state) => state.user.value)
  const [width, setWidth] = useState(window.innerWidth)
  const q = query(collection(db, 'users'), where('isOnline', '==', true))

  const [activeUsers, setActiveUsers] = useState(0)
  const breakPoint = 768

  useEffect(() => {
    const getSnapshot = onSnapshot(q, (snapShot) => {
      setActiveUsers(snapShot.docs.length)
    })
    return () => getSnapshot()
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return (
    <section className={styles.LeftSide}>
      <div className={styles.identity__container}>
        <div className={styles.user}>
          <div className={styles.back__img}></div>
          <div className={styles.profile__container}>
            <div className={styles.profilePic__container}>
              <img src={user?.avatar || `user.png`} alt='' />
            </div>
            <Link to={`/about/${user?.id}`}>
              <p className={styles.name}>
                {user?.name}{' '}
                <span>
                  {user?.owner && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color='#0a66c2'
                      size='xs'
                    />
                  )}
                </span>
              </p>
            </Link>
          </div>
        </div>

        <div
          className={
            width < breakPoint && lessMore ? styles.invisible : styles.visible
          }>
          <div className={styles.grow__network}>
            <p>Active Users</p>
            <p>{activeUsers}</p>
            <Link to='/messaging'>Get to know yourselves</Link>
          </div>
          <div className={styles.exclusives}>
            <p>Joined On</p>
            <p className={styles.access}>
              <span>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </span>
              <Moment interval>{user?.createdAt.toDate()}</Moment>
            </p>
          </div>
          <div className={styles.items}>
            <span>
              <FontAwesomeIcon icon={faBookmark} />
            </span>
            <p>My Items</p>
          </div>
        </div>
      </div>
      <div
        className={
          width < breakPoint && lessMore ? styles.invisible : styles.events
        }>
        <p>Groups</p>
        <p>
          Events{' '}
          <span>
            <FontAwesomeIcon icon={faPlus} />
          </span>
        </p>
        <p>Followed Hashtags</p>
        <div className={styles.discover}>
          <Link to='#'>Discover more</Link>
        </div>
      </div>

      {width < breakPoint && (
        <div className={styles.hide} onClick={() => setLessMore(!lessMore)}>
          {lessMore ? (
            <>
              <button>Show More</button>
              <FontAwesomeIcon icon={faChevronDown} />
            </>
          ) : (
            <>
              <button>Show Less</button>
              <FontAwesomeIcon icon={faChevronUp} />
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default LeftSide
