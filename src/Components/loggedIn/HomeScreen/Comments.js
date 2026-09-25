import {
  faCheckCircle,
  faCircleNotch,
  faSpinner,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import styles from '../../../CSS/loggedInCss/mainPostContent.module.css'
import useLikeModal from '../../../customs/useLikeModal'
import { Link } from 'react-router-dom'
import useLiveQuery from '../../../customs/useLiveQuery'
import usePostLike from '../../../customs/usePostLike'
import useTruncation from '../../../customs/useTruncation'
import { setActiveUpdateId, setUpdateFlag } from '../../../features/comments'

import {
  setActiveUpdateIdRepl,
  setUpdateFlagRepl,
} from '../../../features/replies'
import { auth, db } from '../../../firebase'
import TimeAgo from '../../TimeAgo'
import Replies from './Replies'
import { toast } from 'react-toastify'
function Comments({ commt, setComment_text, post,postId }) {
  const [reply, setReply] = useState(false)
  const [reply_text, setReply_text] = useState('')
  const { user } = useSelector((state) => state.user.value)
  const [replyPostLoad, setReplyPostLoad] = useState(false)
  const { updateFlagRepl, activeUpdateIdRepl } = useSelector(
    (state) => state.replies
  )
  const dispatch = useDispatch()

  const postRef = doc(db, 'posts', postId)
  const commentRef = doc(postRef, 'comments', commt?.id)
  const pageSize = 2

  const truncateText = useTruncation()
  const handleKeyDownComments = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  const {
    items: replies,
    loading: repliesLoad,
    hasMore: hasMorePages_replies,
    loadMore: loadMoreReplies,
  } = useLiveQuery(
    `posts/${postId}/comments/${commt?.id}/replies`,
    () => query(collection(commentRef, 'replies'), orderBy('createdAt', 'asc')),
    pageSize
  )
  const { liked, toggleLike } = usePostLike(commt, commentRef)
  const handleLikedByList = useLikeModal()
  // reply submit functionality
  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!reply_text.trim()) return
    setReplyPostLoad(true)
    try {
      if (updateFlagRepl) {
        const editing = replies.find(
          (repl) => repl.updateFlag_id_repl === activeUpdateIdRepl
        )
        if (editing) {
          await updateDoc(doc(commentRef, 'replies', editing.id), {
            body: reply_text,
          })
        }
        dispatch(setActiveUpdateIdRepl(null))
        dispatch(setUpdateFlagRepl(false))
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
          addDoc(collection(commentRef, 'replies'), {
            ...others,
            author_name: user?.name,
            author_id: auth.currentUser.uid,
            parent_id: commt?.id,
            avatar: user?.avatar,
            avatarPath: user?.avatarPath,
            createdAt: Timestamp.fromDate(new Date()),
            reactions: [],
            reaction_count: 0,
            likedBy: [],
            body: reply_text,
            updateFlag_id_repl: v4(),
          }),
          updateDoc(commentRef, { replies_count: increment(1) }),
        ])
      }
      setReply(false)
      setReply_text('')
    } catch (error) {
      toast.error('Could not post reply, please try again', {
        position: 'bottom-right',
      })
    } finally {
      setReplyPostLoad(false)
    }
  }
  const handleCommentUpdate = () => {
    dispatch(setUpdateFlag(true))
    dispatch(setActiveUpdateId(commt.updateFlag_id))
    setComment_text(commt?.body)
  }
  const handleDeleteComment = async () => {
    if (!window.confirm('Delete comment?')) return
    try {
      const allReplies = await getDocs(collection(commentRef, 'replies'))
      await Promise.allSettled(
        allReplies.docs.map((snap) => deleteDoc(snap.ref))
      )
      await Promise.all([
        deleteDoc(commentRef),
        updateDoc(postRef, {
          comment_count: post?.comment_count > 0 ? increment(-1) : 0,
        }),
      ])
      toast.success('comment deleted successfully', {
        delay: 1000,
        position: 'bottom-right',
      })
    } catch (error) {
      toast.error('Could not delete comment', {
        delay: 1000,
        position: 'bottom-right',
      })
    }
  }
  // Tag users that are interacting on the same reply thread
  const handleTag = () => {
    setReply(true)
    setReply_text(
      commt?.author_id === auth.currentUser.uid ? '' : `@${commt?.author_name}`
    )
  }
  return (
    <div>
      <>
        <div className={styles.comments}>
          <div className={styles.img__container__comments}>
            <img
              src={commt?.avatar || `/user.png`}
              alt=''
              loading='lazy'
              decoding='async'
            />
          </div>
          <div className={styles.comment__body}>
            <div className={styles.user__comment}>
              <Link to={`/about/${commt?.author_id}`}>
                {commt?.author_name}{' '}
                <span>
                  {commt?.owner && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color='#0a66c2'
                      size='xs'
                    />
                  )}
                </span>{' '}
                {post?.author_id === commt?.author_id && (
                  <small className={styles.author__indicator}>author</small>
                )}
              </Link>
              <small>
                <TimeAgo value={commt?.createdAt} />
              </small>
            </div>
            <p className={styles.comment__proper}>
              {truncateText(commt?.body, 80)}
            </p>
          </div>
          <div className={styles.comment__actions}>
            <ul className={styles.actions__lists}>
              <li>
                <button
                  onClick={toggleLike}
                  className={liked ? styles.liked : undefined}
                  aria-pressed={liked}>
                  {liked ? 'liked' : 'like'}
                </button>
              </li>
              {commt.reaction_count > 0 && (
                <>
                  {' '}
                  <li
                    className={styles.like__count}
                    style={{ display: 'flex' }}
                    onClick={() => handleLikedByList(commt.likedBy)}>
                    <span className={styles.rxns}>
                      <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
                    </span>
                    <p>{commt?.reaction_count}</p>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleTag}>Reply</button>
              </li>

              {commt.author_id === auth.currentUser.uid ? (
                <li>
                  <button onClick={handleCommentUpdate}>Update</button>
                </li>
              ) : null}
              {commt.author_id === auth.currentUser.uid ? (
                <li>
                  <button onClick={handleDeleteComment}>Delete</button>
                </li>
              ) : null}
              <li>
                {commt.replies_count ? (
                  <p>
                    {commt.replies_count}{' '}
                    {commt?.replies_count > 1 ? `replies` : `reply`}
                  </p>
                ) : null}
              </li>
            </ul>
          </div>
          <div className={styles.replies}>
            {replies?.map((repl) => (
              <Replies
                repl={repl}
                key={repl?.id}
                setReply_text={setReply_text}
                setReply={setReply}
                post={post}
                commt={commt}
                postId={postId}
              />
            ))}

            {hasMorePages_replies ? (
              <button
                className={styles.comment__load}
                onClick={loadMoreReplies}
                disabled={repliesLoad}>
                load more replies{' '}
                {repliesLoad && <FontAwesomeIcon icon={faSpinner} />}
              </button>
            ) : null}

            {reply && (
              <div className={styles.post__comment}>
                <div className={styles.img__container__comments}>
                  <img src={user?.avatar || `/user.png`} alt='' />
                </div>
                <form
                  className={styles.reply_body}
                  onSubmit={handleReplySubmit}>
                  <div className={styles.text__area__container}>
                    <textarea
                      placeholder='Add a reply'
                      value={reply_text}
                      name='reply'
                      onChange={(e) => setReply_text(e.target.value)}
                      onKeyDown={handleKeyDownComments}></textarea>
                    {/* <FontAwesomeIcon icon={faImage} /> */}
                  </div>
                  {reply_text.length > 1 && (
                    <button
                      type='submit'
                      className={styles.button__blue}
                      disabled={replyPostLoad ? true : false}>
                      {replyPostLoad ? (
                        <FontAwesomeIcon
                          className={styles.spinner}
                          icon={faCircleNotch}
                        />
                      ) : (
                        `Post`
                      )}
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  )
}

export default Comments
