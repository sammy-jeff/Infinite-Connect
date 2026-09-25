import {
  faArrowLeft,
  faCheckCircle,
  faCircleNotch,
  faComment,
  faShare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import React, { memo, useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v4 } from 'uuid'
import styles from '../../../CSS/loggedInCss/mainPostContent.module.css'
import useInfiniteScroll from '../../../customs/useInfiniteScroll'
import useLikeModal from '../../../customs/useLikeModal'
import useLiveQuery from '../../../customs/useLiveQuery'
import usePostLike from '../../../customs/usePostLike'
import useTruncation from '../../../customs/useTruncation'
import { setActiveUpdateId, setUpdateFlag } from '../../../features/comments'
import { auth, db } from '../../../firebase'
import { sharePost } from '../../../helpers/posts'
import TimeAgo from '../../TimeAgo'
import Comments from './Comments'
import PostMedia from './PostMedia'
const CommentMemo = memo(Comments)
const COMMENTS_PAGE = 5

function MainPostContent() {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [postLoading, setPostLoading] = useState(true)
  const [commentPostLoad, setCommentPostLoad] = useState(false)
  const [comment_text, setComment_text] = useState('')
  const { user } = useSelector((state) => state.user.value)
  const { updateFlag, activeUpdateId } = useSelector((state) => state.comments)
  const dispatch = useDispatch()
  const truncateText = useTruncation()
  const handleLikedByList = useLikeModal()
  const docRef = doc(db, 'posts', postId)
  const { liked, toggleLike } = usePostLike(post, docRef)

  // the snapshot already carries the post, no extra getDoc needed
  useEffect(() => {
    setPostLoading(true)
    return onSnapshot(doc(db, 'posts', postId), (snapshot) => {
      setPost(snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null)
      setPostLoading(false)
    })
  }, [postId])

  const {
    items: comments,
    loading,
    hasMore,
    loadMore,
  } = useLiveQuery(
    `posts/${postId}/comments`,
    () =>
      query(
        collection(db, 'posts', postId, 'comments'),
        orderBy('createdAt', 'desc')
      ),
    COMMENTS_PAGE
  )
  const target = useRef()
  const rootElem = useRef()
  useInfiniteScroll(target, loadMore, {
    enabled: hasMore && !loading,
    rootRef: rootElem,
    rootMargin: '200px',
  })

  const handleKeyDownComments = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment_text.trim()) return
    setCommentPostLoad(true)
    try {
      if (updateFlag) {
        const editing = comments.find(
          (commt) => commt.updateFlag_id === activeUpdateId
        )
        if (editing) {
          await updateDoc(doc(docRef, 'comments', editing.id), {
            body: comment_text,
          })
        }
        dispatch(setActiveUpdateId(null))
        dispatch(setUpdateFlag(false))
      } else {
        const {
          isOnline,
          avatarPath,
          createdAt,
          email,
          friendsList,
          avatar,
          name,
          id,
          ...others
        } = user
        await Promise.all([
          addDoc(collection(docRef, 'comments'), {
            ...others,
            author_name: user?.name,
            author_id: auth.currentUser.uid,
            parent_id: postId,
            avatar: user?.avatar,
            avatarPath: user?.avatarPath,
            createdAt: Timestamp.fromDate(new Date()),
            reactions: [],
            reaction_count: 0,
            likedBy: [],
            replies_count: 0,
            body: comment_text,
            updateFlag_id: v4(),
          }),
          updateDoc(docRef, { comment_count: increment(1) }),
        ])
      }
      setComment_text('')
    } catch (error) {
      toast.error('Could not post comment, please try again', {
        position: 'bottom-right',
      })
    } finally {
      setCommentPostLoad(false)
    }
  }

  return (
    <section className={styles.main_thread}>
      <div className={styles.post_container}>
        <div className={styles.header}>
          <Link to={`/home`}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <h3>{post && `${post?.author_name}'s post`}</h3>
        </div>
        <div className={styles.post_proper} ref={rootElem}>
          {postLoading ? (
            <div className={styles.thread_skeleton}>
              <Skeleton circle width={50} height={50} />
              <Skeleton count={3} />
              <Skeleton height={200} />
            </div>
          ) : !post ? (
            <div className={styles.nil}>
              <FontAwesomeIcon icon={faComment} />
              <p>This post is no longer available</p>
              <p>it may have been deleted by its author</p>
            </div>
          ) : (
            <>
              <div className={styles.user}>
                <img src={post?.avatar || `/user.png`} alt='profile__pics' />

                <div className={styles.name__time}>
                  <Link to={`/about/${post?.author_id}`}>
                    {post?.author_name}{' '}
                    <span>
                      {post?.owner && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          color='#0a66c2'
                          size='xs'
                        />
                      )}
                    </span>
                  </Link>
                  <small>
                    <TimeAgo value={post?.createdAt} />
                  </small>
                </div>
              </div>
              {post?.body ? (
                <div className={styles.post__msg}>
                  <p>{truncateText(post?.body, 400)}</p>
                </div>
              ) : null}
              <PostMedia media={post?.media} />
              <div className={styles.like__comment__count}>
                <p onClick={() => handleLikedByList(post?.likedBy)}>
                  {post?.reaction_count > 0 ? (
                    <>
                      {' '}
                      {post?.reaction_count}{' '}
                      <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
                    </>
                  ) : null}
                </p>
                {post?.comment_count > 0 ? (
                  <p>
                    {post.comment_count}{' '}
                    {post.comment_count > 1 ? 'comments' : 'comment'}
                  </p>
                ) : null}
              </div>
              <div className={styles.cta}>
                <ul className={styles.cta__list}>
                  <li
                    onClick={toggleLike}
                    className={liked ? styles.liked : undefined}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <p>{liked ? 'Liked' : 'Like'}</p>
                  </li>
                  <li>
                    <label htmlFor='post_comment'>
                      <FontAwesomeIcon icon={faComment} />
                      <p>Comment</p>
                    </label>
                  </li>
                  <li onClick={() => sharePost({ ...post, id: postId })}>
                    <FontAwesomeIcon icon={faShare} />
                    <p>Share</p>
                  </li>
                </ul>
              </div>

              {comments.length ? (
                comments.map((commt) => (
                  <div
                    key={commt?.id}
                    className={commentPostLoad ? styles.comment_opaque : ''}>
                    {' '}
                    <CommentMemo
                      commt={commt}
                      setComment_text={setComment_text}
                      post={post}
                      commentPostLoad={commentPostLoad}
                      postId={postId}
                    />
                  </div>
                ))
              ) : loading ? null : (
                <div className={styles.nil}>
                  <FontAwesomeIcon icon={faComment} />
                  <p>No comments yet</p>
                  <p>be the first to comment</p>
                </div>
              )}
              {loading && comments.length ? (
                <div className={styles.more_comments}>
                  getting more comments..
                </div>
              ) : null}
            </>
          )}
          <div ref={target} aria-hidden='true' style={{ height: 1 }} />
        </div>

        <div className={styles.post__comment}>
          <div className={styles.img__container__comments}>
            <img src={user?.avatar || `/user.png`} alt='' />
          </div>
          <form onSubmit={handleCommentSubmit}>
            <div className={styles.text__area__container}>
              <textarea
                placeholder={updateFlag ? 'Edit your comment' : 'Add a Comment'}
                value={comment_text}
                name='comment'
                id='post_comment'
                onKeyDown={handleKeyDownComments}
                onChange={(e) => setComment_text(e.target.value)}></textarea>
            </div>

            {comment_text.trim().length > 0 && (
              <button
                type='submit'
                className={styles.button__blue}
                disabled={commentPostLoad}>
                {commentPostLoad ? (
                  <FontAwesomeIcon
                    className={styles.spinner}
                    icon={faCircleNotch}
                  />
                ) : updateFlag ? (
                  `Save`
                ) : (
                  `Post`
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default MainPostContent
