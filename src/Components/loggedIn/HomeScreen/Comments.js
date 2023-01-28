import {
  faCheckCircle,
  faCircleNotch,
  faImage,
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
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import moment from 'moment'

import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'
import useLikeModal from '../../../customs/useLikeModal'
import { Link } from 'react-router-dom'
import usePagination from '../../../customs/usePagination'
import usePostLike from '../../../customs/usePostLike'
import useTruncation from '../../../customs/useTruncation'
import { setActiveUpdateId, setUpdateFlag } from '../../../features/comments'

import {
  setActiveUpdateIdRepl,
  setUpdateFlagRepl,
} from '../../../features/replies'
import { auth, db } from '../../../firebase'
import Replies from './Replies'
import { toast } from 'react-toastify'
function Comments({ commt, setComment_text, post }) {
  const [reply, setReply] = useState(false)
  const [reply_text, setReply_text] = useState('')
  const [repliesLoad, setRepliesLoad] = useState(false)
  const [replies, setReplies1] = useState([])
  const { user } = useSelector((state) => state.user.value)
  const [likeLoad, setLikeLoad] = useState(false)
  const [replyPostLoad, setReplyPostLoad] = useState(false)
  const { updateFlagRepl, activeUpdateIdRepl } = useSelector(
    (state) => state.replies
  )

  const [hasMorePages_replies, setHasMorePages_replies] = useState(false)

  const colRef = collection(collection(db, 'posts'), post.id, 'comments')
  const commentRef = doc(doc(db, 'posts', post.id), 'comments', commt.data_id)
  const pageSize = 2

  const truncateText = useTruncation()
  const handleKeyDownComments = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  usePagination(
    `/posts/${post.id}/comments/${commt.data_id}/replies`,
    setHasMorePages_replies,
    setReplies1,
    replies,
    2,
    'asc',
    setRepliesLoad
  )
  const paginatedData = usePagination(
    `/posts/${post.id}/comments/${commt.data_id}/replies`,
    setHasMorePages_replies,
    setReplies1,
    replies,
    2,
    'asc',
    setRepliesLoad
  )
  const dispatch = useDispatch()
  const handleLike = usePostLike(
    commt,
    `/posts/${post.id}/comments`,
    commt.data_id,
    commentRef,
    setLikeLoad
  )
  const handleLikedByList = useLikeModal()
  const q = query(
    collection(db, `/posts/${post.id}/comments/${commt.data_id}/replies`),
    orderBy('createdAt', 'asc'),
    limit(pageSize)
  )
  const handleReplySubmit = async (e) => {
    e.preventDefault()
    setReplyPostLoad(true)
    if (updateFlagRepl) {
      replies.map(async (repl) => {
        if (repl.updateFlag_id_repl === activeUpdateIdRepl) {
          await updateDoc(doc(commentRef, 'replies', repl?.data_id), {
            body: reply_text,
          })
        }
        dispatch(setActiveUpdateIdRepl(null))
        dispatch(setUpdateFlagRepl(false))
      })
      setReply(false)
      setReply_text('')
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
      await addDoc(collection(colRef, commt.data_id, 'replies'), {
        ...others,
        author_name: user?.name,
        author_id: auth.currentUser.uid,
        parent_id: commt.data_id,
        avatar: user?.avatar,
        avatarPath: user?.avatarPath,
        createdAt: Timestamp.fromDate(new Date()),
        reactions: [],
        reaction_count: 0,
        likedBy: [],
        body: reply_text,
        updateFlag_id_repl: v4(),
      })
      await getDocs(collection(db, `/posts/${post.id}/comments`)).then(
        (snapshot) => {
          snapshot.forEach(async (snap) => {
            if (snap.id === commt.data_id) {
              await updateDoc(commentRef, {
                replies_count: commt.replies_count + 1,
              })
            }
          })
        }
      )
      setReply_text('')
      setReply(false)
    }
    setReplyPostLoad(false)
  }
  const handleCommentUpdate = () => {
    dispatch(setUpdateFlag(true))
    dispatch(setActiveUpdateId(commt.updateFlag_id))
    setComment_text(commt?.body)
  }
  const handleDeleteComment = async () => {
    const confirm = window.confirm('Delete comment?')
    if (confirm) {
      try {
        await getDocs(q).then((res) => {
          res.forEach(async (snap) => {
            if (snap.data().parent_id === commt.data_id)
              await deleteDoc(doc(commentRef, 'replies', snap.id))
          })
        })
        await deleteDoc(commentRef)
        await getDocs(collection(db, 'posts')).then((snapshot) => {
          snapshot.forEach(async (snap) => {
            if (snap.id === post.id) {
              await updateDoc(doc(db, 'posts', snap.id), {
                comment_count: post.comment_count > 0 ? increment(-1) : 0,
              })
            }
          })
        })
        toast.success('comment deleted successfully', {
          delay: 1000,
          position: 'bottom-right',
        })
      } catch (error) {
        toast.error(error, { delay: 1000, position: 'bottom-right' })
      }
    }
  }
  const handleTag = () => {
    setReply(true)
    setReply_text(
      commt.author_id === auth.currentUser.uid ? '' : `@${commt.author_name}`
    )
  }
  const filterIds = commt.likedBy.map((element) => {
    return element.uid
  })

  return (
    <div>
      <>
        <div className={styles.comments}>
          <div className={styles.img__container__comments}>
            <img src={commt?.avatar || `user.png`} alt='' />
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
                {post.author_id === commt.author_id && (
                  <small className={styles.author__indicator}>author</small>
                )}
              </Link>
              <small>{moment(commt.createdAt.toDate()).fromNow(true)}</small>
            </div>
            <p className={styles.comment__proper}>
              {truncateText(commt.body, 80)}
            </p>
          </div>
          <div className={styles.comment__actions}>
            <ul className={likeLoad ? styles.opaque : styles.actions__lists}>
              <li>
                {likeLoad ? (
                  <div className={styles.comment__load}>
                    <FontAwesomeIcon className={styles.spin} icon={faSpinner} />
                  </div>
                ) : filterIds.includes(user?.id) ? (
                  <button
                    style={{ color: '#0a66c2' }}
                    onClick={handleLike}
                    disabled={likeLoad ? true : false}>
                    liked
                  </button>
                ) : (
                  <button
                    onClick={handleLike}
                    disabled={likeLoad ? true : false}>
                    like
                  </button>
                )}
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
                <button onClick={handleTag} disabled={likeLoad ? true : false}>
                  Reply
                </button>
              </li>

              {commt.author_id === auth.currentUser.uid ? (
                <li>
                  <button onClick={handleCommentUpdate}>Update</button>
                </li>
              ) : null}
              {commt.author_id === auth.currentUser.uid ? (
                <li>
                  <button
                    onClick={handleDeleteComment}
                    disabled={likeLoad ? true : false}>
                    Delete
                  </button>
                </li>
              ) : null}
              <li>
                {commt.replies_count ? (
                  <p>
                    {commt.replies_count}
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
                key={repl?.data_id}
                setReply_text={setReply_text}
                setReply={setReply}
                post={post}
                commt={commt}
              />
            ))}

            {hasMorePages_replies && replies.length >= pageSize ? (
              <button
                className={styles.comment__load}
                onClick={() => paginatedData(3)}
                disabled={repliesLoad ? true : false}>
                load more replies{' '}
                {repliesLoad && <FontAwesomeIcon icon={faSpinner} />}
              </button>
            ) : null}

            {reply && (
              <div className={styles.post__comment}>
                <div className={styles.img__container__comments}>
                  <img src={user?.avatar || `user.png`} alt='' />
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
