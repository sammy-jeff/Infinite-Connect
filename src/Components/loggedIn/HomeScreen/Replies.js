import {
  faCheckCircle,
  faSpinner,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  updateDoc,
} from 'firebase/firestore'
import moment from 'moment'
import React, { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'
import useLikeModal from '../../../customs/useLikeModal'

import usePostLike from '../../../customs/usePostLike'
import useTruncation from '../../../customs/useTruncation'

import {
  setActiveUpdateIdRepl,
  setUpdateFlagRepl,
} from '../../../features/replies'
import { auth, db } from '../../../firebase'

function Replies({ repl, setReply_text, setReply, post, commt,postId }) {
  const [likeLoad, setLikeLoad] = useState(false)
  const { user } = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const commentRef = doc(doc(db, 'posts', postId), `comments`, commt?.id)
  const handleLike = usePostLike(
    repl,
    `/posts/${postId}/comments/${commt?.id}/replies`,
    repl.data_id,
    doc(commentRef, 'replies', repl.data_id),
    setLikeLoad
  )
  const truncateText = useTruncation()
  const handleLikedByList = useLikeModal()
  const filterIds = repl.likedBy.map((element) => {
    return element.uid
  })
  const handleReplyUpdate = () => {
    setReply(true)
    dispatch(setUpdateFlagRepl(true))
    dispatch(setActiveUpdateIdRepl(repl.updateFlag_id_repl))
    setReply_text(repl?.body)
  }
  const handleDeleteReplies = async () => {
    const confirm = window.confirm('Delete reply?')
    if (confirm) {
      try {
        await deleteDoc(doc(commentRef, 'replies', repl.data_id))
        await getDocs(collection(db, `/posts/${postId}/comments`)).then(
          (snapshot) => {
            snapshot.forEach(async (snap) => {
              if (snap.id === commt?.id) {
                await updateDoc(commentRef, {
                  replies_count: commt.replies_count > 0 ? increment(-1) : 0,
                })
              }
            })
          }
        )
        toast.success('Reply deleted successfully', {
          delay: 1000,
          position: 'bottom-right',
        })
      } catch (error) {
        toast.error(error, {
          delay: 1000,
          position: 'bottom-right',
        })
      }
    }
  }
  const handleTag = () => {
    setReply(true)
    setReply_text(
      repl.author_id === auth.currentUser.uid ? '' : `@${repl.author_name}`
    )
  }

  return (
    <>
      <div className={styles.img__container__comments}>
        <img src={repl?.avatar || `user.png`} alt='' />
      </div>
      <div className={styles.comment__body}>
        <div className={styles.user__comment}>
          <Link to={`/about/${repl?.author_id}`}>
            {repl?.author_name}{' '}
            <span>
              {repl?.owner && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color='#0a66c2'
                  size='xs'
                />
              )}
            </span>{' '}
            {post.author_id === repl.author_id && (
              <small className={styles.author__indicator}>author</small>
            )}
          </Link>
          <small>{moment(repl.createdAt.toDate()).fromNow(true)}</small>
        </div>
        <p className={styles.comment__proper}>{truncateText(repl.body, 80)}</p>
      </div>
      <div className={styles.replies__actions}>
        <ul className={likeLoad ? styles.opaque : styles.actions__lists}>
          <li>
            {likeLoad ? (
              <div className={styles.comment__load}>
                <FontAwesomeIcon className={styles.spin} icon={faSpinner} />
              </div>
            ) : filterIds?.indexOf(user?.id) !== -1 ? (
              <button
                style={{ color: '#0a66c2' }}
                onClick={handleLike}
                disabled={likeLoad ? true : false}>
                liked
              </button>
            ) : (
              <button onClick={handleLike} disabled={likeLoad ? true : false}>
                like
              </button>
            )}
          </li>
          <li>
            <button onClick={handleTag} disabled={likeLoad ? true : false}>
              reply
            </button>
          </li>
          {auth.currentUser.uid === repl.author_id && (
            <>
              <li>
                <button
                  onClick={handleReplyUpdate}
                  disabled={likeLoad ? true : false}>
                  Update
                </button>
              </li>
              <li>
                <button
                  onClick={handleDeleteReplies}
                  disabled={likeLoad ? true : false}>
                  Delete
                </button>
              </li>
            </>
          )}
          {repl.reaction_count > 0 && (
            <>
              <li
                style={{ display: 'flex', marginLeft: '7px' }}
                onClick={() => handleLikedByList(repl.likedBy)}>
                <span className={styles.rxns}>
                  <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
                </span>
                <p>{repl.reaction_count}</p>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  )
}

export default Replies
