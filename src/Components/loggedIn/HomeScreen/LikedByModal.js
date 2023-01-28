import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../../../CSS/loggedInCss/likedByModal.module.css'
import { setIsModalOpen, setLikedByList } from '../../../features/likedBy'
// import LikedByList from './LikedByList'
const LazyComponent = React.lazy(() => import('./LikedByList'))
function LikedByModal() {
  const dispatch = useDispatch()
  const { likedByList } = useSelector((state) => state.likedByFeature)
  console.log(likedByList)
  const handleCancelModal = () => {
    dispatch(setIsModalOpen(false))
    dispatch(setLikedByList([]))
  }
  return (
    <div className={styles.likeModal}>
      <div className={styles.likedBy__container}>
        <div className={styles.top}>
          <p>Liked By</p>
          <div className={styles.cancel__container} onClick={handleCancelModal}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className={styles.likers}>
          <Suspense fallback={<div>Loading...</div>}>
            {likedByList.map((single) => (
              <LazyComponent key={single.uid} single={single} />
            ))}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default LikedByModal
