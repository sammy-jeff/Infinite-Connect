import React from 'react'
import styles from '../../../CSS/loggedInCss/middleTop.module.css'

import { useDispatch, useSelector } from 'react-redux'
import { showPost } from '../../../features/createPost'
function MiddleTop() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.value)
  return (
    <div className={styles.start__post}>
      <div className={styles.img__container}>
        <img src={user?.avatar || `user.png`} alt='profile__pics' />
      </div>
      <div
        className={styles.post__action}
        onClick={() => dispatch(showPost(true))}>
        <p>Start a post</p>
      </div>

      {/* <div className={styles.bottom__part}>
        <ul className={styles.icons}>
          <li>
            <FontAwesomeIcon color='#378fe9' icon={faPhotoVideo} />
            <p>Photo</p>
          </li>
          <li>
            <FontAwesomeIcon color='#5f9b41' icon={faVideo} />
            <p>Video</p>
          </li>
          <li>
            <FontAwesomeIcon color='#c37d16' icon={faCalendar} />
            <p>Events</p>
          </li>
        </ul>
      </div> */}
    </div>
  )
}

export default MiddleTop
