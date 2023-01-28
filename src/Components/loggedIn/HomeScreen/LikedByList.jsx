import React, { useEffect, useState } from 'react'
import styles from '../../../CSS/loggedInCss/likedByModal.module.css'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import useSelectUser from '../../../customs/useSelectUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { faCheckCircle, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { setIsModalOpen } from '../../../features/likedBy'
function LikedByList({ single }) {
  const [userData, setUserData] = useState(null)
  const { isModalOpen } = useSelector((state) => state.likedByFeature)
  const dispatch = useDispatch()
  const [width, setWidth] = useState(window.innerWidth)
  const selectUser = useSelectUser()
  const handleChat = () => {
    dispatch(setIsModalOpen(false))
    selectUser(userData, width)
  }
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])
  useEffect(() => {
    getDoc(doc(db, 'users', single.uid)).then((res) => setUserData(res.data()))
    // eslint-disable-next-line
  }, [])
  return (
    <div className={styles.single}>
      <p>
        {single.act_name}{' '}
        <span>
          {userData?.owner && (
            <FontAwesomeIcon icon={faCheckCircle} color='#0a66c2' size='xs' />
          )}
        </span>
      </p>
      <Link to={`/messaging`} onClick={handleChat}>
        {single.uid !== auth.currentUser.uid ? (
          <FontAwesomeIcon icon={faPaperPlane} />
        ) : null}
      </Link>
    </div>
  )
}

export default LikedByList
