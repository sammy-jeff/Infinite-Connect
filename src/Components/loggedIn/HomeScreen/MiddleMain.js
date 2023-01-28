import { faPenAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import Skeleton from 'react-loading-skeleton'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'

import useInfiniteScroll_realtime from '../../../customs/useInfiniteScroll_realtime'
import { setPosts } from '../../../features/posts'
import { db } from '../../../firebase'

import MainPost from './MainPost'

function MiddleMain() {
  const { posts } = useSelector((state) => state.posts)
  const postMemo = useMemo(() => posts, [posts])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const PAGE_SIZE = 5
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(PAGE_SIZE)
  )
  const pageEnd = useRef()
  useEffect(() => {
    const getPosts = onSnapshot(q, (postSnapShot) => {
      let pst = []
      postSnapShot.forEach((snapshot) => {
        pst.push({ ...snapshot.data(), id: snapshot.id })
      })
      dispatch(setPosts(pst))
    })

    return () => getPosts()
    // eslint-disable-next-line
  }, [])
  const pageSize = 3
  const next = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    startAfter(posts[posts.length - 1]?.createdAt || 0),
    limit(pageSize)
  )
  useInfiniteScroll_realtime(
    posts,
    pageEnd,
    setPosts,
    next,
    null,
    postMemo,
    setLoading
  )
  useEffect(() => {
    setLoading(true)
  }, [posts.length])
  return (
    <>
      {posts.length === 0 ? (
        <div className={styles.no_post}>
          <FontAwesomeIcon icon={faPenAlt} size={'3x'} color='#0a66c2' />
          <p>Start A New Post</p>
        </div>
      ) : (
        <>
          {posts?.map((post) => (
            <MainPost key={post.id} post={post} />
          ))}
        </>
      )}

      {loading && posts.length ? (
        <div className={styles.load_posts}>
          <div className={styles.spinner}>
            <FontAwesomeIcon icon={faSpinner} />
          </div>
          <p>Getting more posts</p>
        </div>
      ) : null}

      <div ref={pageEnd} className={styles.target}>
        .
      </div>
    </>
  )
}

export default MiddleMain
