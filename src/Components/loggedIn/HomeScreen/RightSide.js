import React, { useEffect, useState } from 'react'
import styles from '../../../CSS/loggedInCss/rightSide.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCheckCircle,
  faInfo,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { collection, limit, onSnapshot, query, where } from 'firebase/firestore'
import { auth, db } from '../../../firebase'

import SharedLayout from '../../SharedLayout'

import useSelectUser from '../../../customs/useSelectUser'

function RightSide() {
  const [usersFill, setusersFill] = useState([])
  const [width, setWidth] = useState(window.innerWidth)

  const q = query(
    collection(db, 'users'),
    where('id', '!=', auth?.currentUser?.uid),
    limit(3)
  )
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  useEffect(() => {
    const getSnapshot = onSnapshot(q, (querySnapShot) => {
      let users = []
      querySnapShot.forEach((dat) => {
        users.push({ ...dat.data(), id: dat.id })
      })
      setusersFill(users)
    })
    return () => getSnapshot()
    // eslint-disable-next-line
  }, [])
  const selectUser = useSelectUser()

  return (
    <section className={styles.rightSide}>
      <div className={styles.add__feed}>
        <div className={styles.headline}>
          <p>Interact with other users</p>
          <div className={styles.info__container}>
            {' '}
            <FontAwesomeIcon icon={faInfo} />
          </div>
        </div>

        {usersFill.map((u) => {
          return (
            <div className={styles.suggestions} key={u.id}>
              <img src={u.avatar || `user.png`} alt='' />

              <div className={styles.sugs__info__container}>
                <Link to={`/about/${u.id}`}>
                  {u.name}{' '}
                  <span>
                    {u?.owner && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        color='#0a66c2'
                        size='xs'
                      />
                    )}
                  </span>
                </Link>
                <p>{u?.work || u?.email}</p>
                <Link
                  to={`/messaging`}
                  className={styles.follow}
                  onClick={() => selectUser(u, width)}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  message
                </Link>
              </div>
            </div>
          )
        })}

        <div className={styles.view__all}>
          <p>View all recommendations</p>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
      <SharedLayout />
    </section>
  )
}

export default RightSide
