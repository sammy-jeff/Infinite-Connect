import React, { memo } from 'react'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faComment,
  faShare,
  faThumbsUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { doc } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { auth, db } from '../../../firebase'
import useTruncation from '../../../customs/useTruncation'
import usePostLike from '../../../customs/usePostLike'
import useLikeModal from '../../../customs/useLikeModal'
import { deletePostThread, sharePost, threadPath } from '../../../helpers/posts'
import TimeAgo from '../../TimeAgo'
import PostMedia from './PostMedia'

function MainPost({ post }) {
  const truncateText = useTruncation()
  const handleLikedByList = useLikeModal()
  const { liked, toggleLike } = usePostLike(post, doc(db, 'posts', post.id))

  const deletePost = async () => {
    if (!window.confirm('Delete Post??')) return
    try {
      await deletePostThread(post)
      toast.success('Post deleted successfully', {
        delay: 1000,
        position: 'bottom-right',
      })
    } catch (error) {
      toast.error('Could not delete post', {
        delay: 1000,
        position: 'bottom-right',
      })
    }
  }

  return (
    <article className={styles.main__post}>
      <div className={styles.user}>
        <img
          src={post?.avatar || `/user.png`}
          alt='profile__pics'
          loading='lazy'
          decoding='async'
        />

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

        {post.author_id === auth.currentUser?.uid && (
          <FontAwesomeIcon
            icon={faTimes}
            onClick={deletePost}
            title='Delete post'
            className={styles.delete__post}
          />
        )}
      </div>
      {post?.body ? (
        <div className={styles.post__msg}>
          <p>{truncateText(post.body, 180)}</p>
        </div>
      ) : null}

      <PostMedia media={post.media} />

      <div className={styles.like__comment__count}>
        <p onClick={() => handleLikedByList(post.likedBy)}>
          {post.reaction_count > 0 ? (
            <>
              {' '}
              {post?.reaction_count}{' '}
              <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
            </>
          ) : null}
        </p>
        {post.comment_count > 0 ? (
          <Link to={threadPath(post)} style={{ color: '#00000099' }}>
            <p>
              {post.comment_count}{' '}
              {post.comment_count > 1 ? 'comments' : 'comment'}
            </p>
          </Link>
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
          <Link to={threadPath(post)}>
            <li>
              <FontAwesomeIcon icon={faComment} />
              <p>Comment</p>
            </li>
          </Link>
          <li onClick={() => sharePost(post)}>
            <FontAwesomeIcon icon={faShare} />
            <p>Share</p>
          </li>
        </ul>
      </div>
    </article>
  )
}

// Rows only re-render when their own post changes (useLiveQuery keeps unchanged
// posts referentially stable between snapshots).
export default memo(MainPost)
