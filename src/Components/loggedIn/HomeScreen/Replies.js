import { faCheckCircle, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteDoc, doc, increment, updateDoc } from 'firebase/firestore'
import React from 'react'

import { useDispatch } from 'react-redux'
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
import TimeAgo from '../../TimeAgo'

function Replies({ repl, setReply_text, setReply, post, commt, postId }) {
  const dispatch = useDispatch()
  const commentRef = doc(doc(db, 'posts', postId), `comments`, commt?.id)
  const replyRef = doc(commentRef, 'replies', repl.id)
  const { liked, toggleLike } = usePostLike(repl, replyRef)
  const truncateText = useTruncation()
  const handleLikedByList = useLikeModal()
  const handleReplyUpdate = () => {
    setReply(true)
    dispatch(setUpdateFlagRepl(true))
    dispatch(setActiveUpdateIdRepl(repl.updateFlag_id_repl))
    setReply_text(repl?.body)
  }
  const handleDeleteReplies = async () => {
    if (!window.confirm('Delete reply?')) return
    try {
      await Promise.all([
        deleteDoc(replyRef),
        updateDoc(commentRef, {
          replies_count: commt.replies_count > 0 ? increment(-1) : 0,
        }),
      ])
      toast.success('Reply deleted successfully', {
        delay: 1000,
        position: 'bottom-right',
      })
    } catch (error) {
      toast.error('Could not delete reply', {
        delay: 1000,
        position: 'bottom-right',
      })
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
        <img src={repl?.avatar || `/user.png`} alt='' />
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
          <small>
            <TimeAgo value={repl.createdAt} />
          </small>
        </div>
        <p className={styles.comment__proper}>{truncateText(repl.body, 80)}</p>
      </div>
      <div className={styles.replies__actions}>
        <ul className={styles.actions__lists}>
          <li>
            <button
              onClick={toggleLike}
              className={liked ? styles.liked : undefined}
                  aria-pressed={liked}>
              {liked ? 'liked' : 'like'}
            </button>
          </li>
          <li>
            <button onClick={handleTag}>reply</button>
          </li>
          {auth.currentUser.uid === repl.author_id && (
            <>
              <li>
                <button onClick={handleReplyUpdate}>Update</button>
              </li>
              <li>
                <button onClick={handleDeleteReplies}>Delete</button>
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
