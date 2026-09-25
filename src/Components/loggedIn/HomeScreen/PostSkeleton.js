import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'

function PostSkeleton() {
  return (
    <article className={styles.main__post} aria-busy='true'>
      <div className={styles.user}>
        <Skeleton circle width={50} height={50} />
        <div className={styles.name__time}>
          <Skeleton width='40%' />
          <Skeleton width='20%' />
        </div>
      </div>
      <Skeleton count={3} />
      <Skeleton height={180} />
    </article>
  )
}

export default PostSkeleton
