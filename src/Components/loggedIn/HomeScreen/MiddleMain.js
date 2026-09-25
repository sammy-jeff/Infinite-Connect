import { faPenAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { collection, orderBy, query } from 'firebase/firestore'
import React, { useRef } from 'react'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'
import useInfiniteScroll from '../../../customs/useInfiniteScroll'
import useLiveQuery from '../../../customs/useLiveQuery'
import { db } from '../../../firebase'
import MainPost from './MainPost'
import PostSkeleton from './PostSkeleton'

const PAGE_SIZE = 5
const postsQuery = () =>
  query(collection(db, 'posts'), orderBy('createdAt', 'desc'))

function MiddleMain() {
  const {
    items: posts,
    initialLoading,
    loading,
    hasMore,
    loadMore,
  } = useLiveQuery('posts', postsQuery, PAGE_SIZE)
  const pageEnd = useRef()
  useInfiniteScroll(pageEnd, loadMore, { enabled: hasMore && !loading })

  if (initialLoading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
      </>
    )
  }

  return (
    <>
      {posts.length === 0 ? (
        <div className={styles.no_post}>
          <FontAwesomeIcon icon={faPenAlt} size={'3x'} color='#0a66c2' />
          <p>Start A New Post</p>
        </div>
      ) : (
        posts.map((post) => <MainPost key={post.id} post={post} />)
      )}

      {loading && posts.length ? (
        <div className={styles.load_posts}>
          <div className={styles.spinner}>
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p>Getting more posts</p>
        </div>
      ) : null}

      {!hasMore && posts.length > PAGE_SIZE ? (
        <p className={styles.feed_end}>You're all caught up 🎉</p>
      ) : null}

      <div ref={pageEnd} aria-hidden='true' className={styles.sentinel} />
    </>
  )
}

export default MiddleMain
