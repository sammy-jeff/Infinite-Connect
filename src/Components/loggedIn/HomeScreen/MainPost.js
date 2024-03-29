import React, { memo, useEffect, useMemo, useState } from 'react'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faCircleNotch,
  faComment,
  faImage,
  faPaperPlane,
  faShare,
  faSpinner,
  faThumbsUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import useTruncation from '../../../customs/useTruncation'
import ReactPlayer from 'react-player/lazy'
import Comments from './Comments'
import {
  addDoc,
  collection,
  collectionGroup,
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
import { auth, db, storage } from '../../../firebase'
import { setActiveUpdateId, setUpdateFlag } from '../../../features/comments'
import usePostLike from '../../../customs/usePostLike'
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import { deleteObject, ref } from 'firebase/storage'
import usePagination from '../../../customs/usePagination'
import Gallery from './Gallery'
import moment from 'moment'
import useLikeModal from '../../../customs/useLikeModal'
import { toast } from 'react-toastify'
import { msgIds } from '../../../helpers/msgIds'
import useSelectUser from '../../../customs/useSelectUser'
const CommentMemo = memo(Comments)
function MainPost({ post }) {
  const [comment, setComment] = useState(false)
  const [comment_text, setComment_text] = useState('')
  const [likeLoad, setLikeLoad] = useState(false)
  const [galleryImg, setGalleryImg] = useState(null)
  const [commentPostLoad, setCommentPostLoad] = useState(false)
  const [loading, setLoading] = useState(false)
  const { updateFlag, activeUpdateId } = useSelector((state) => state.comments)
  const { user } = useSelector((state) => state.user.value)
  const [showGallery, setShowGallery] = useState(false)

  const handleChange = (e) => {
    setComment_text(e.target.value)
  }

  const [comments, setComments] = useState([])
  const commtMemo = useMemo(() => comments, [comments])
  const [hasMorePages, setHasMorePages] = useState(false)
  const dispatch = useDispatch()
  usePagination(
    `/posts/${post.id}/comments`,
    setHasMorePages,
    setComments,
    commtMemo,
    3,
    'desc',
    setLoading
  )
  const paginatedFunc = usePagination(
    `/posts/${post.id}/comments`,
    setHasMorePages,
    setComments,
    commtMemo,
    3,
    'desc',
    setLoading
  )

  const postRef = collection(db, 'posts')
  const handleLike = usePostLike(
    post,
    `posts`,
    post.id,
    doc(db, 'posts', post?.id),
    setLikeLoad
  )
  const pageSize = 3
  let q = query(
    collection(db, `/posts/${post.id}/comments`),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  )

  const truncateText = useTruncation()
  const handleLikedByList = useLikeModal()
  

  const filterIds = post?.likedBy.map((element) => {
    return element.uid
  })
  const deletePost = async () => {
    const confirm = window.confirm('Delete Post??')
    if (confirm) {
      try {
        await deleteDoc(doc(db, `/posts/${post.id}`))
        await getDocs(q).then((snap) => {
          snap.forEach(async (docSnap) => {
            deleteDoc(doc(doc(db, 'posts', post.id), 'comments', docSnap.id))
            await getDocs(collectionGroup(db, 'replies')).then((snap) => {
              snap.forEach(async (docSnap1) => {
                deleteDoc(
                  doc(
                    doc(doc(db, 'posts', post.id), 'comments', docSnap.id),
                    'replies',
                    docSnap1.id
                  )
                )
              })
            })
          })
        })
        post?.media.map(async (med) => {
          await deleteObject(ref(storage, med.url))
        })
        toast.success('Post deleted successfully', {
          delay: 1000,
          position: 'bottom-right',
        })
      } catch (error) {
        toast.error(error, { delay: 1000, position: 'bottom-right' })
      }
    }
  }

  const handleGallery = (index) => {
    // if (position === 0) setShowLeft(false)
    setShowGallery(true)

    setGalleryImg(post?.media[index])
  }
  const sliceMedia = post?.media.slice(0, 4)
  const selectUser = useSelectUser()
  return (
    <article className={styles.main__post}>
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
          <small>{moment(post?.createdAt.toDate()).fromNow(true)}</small>
        </div>

        {post.author_id === auth.currentUser?.uid && (
          <FontAwesomeIcon icon={faTimes} onClick={deletePost} />
        )}
      </div>
      <div className={styles.post__msg}>
        <p>{truncateText(post?.body, 80)}</p>
      </div>
      {post.media.length ? (
        <div className={styles.gallery__container}>
          <div
            className={
              post.media.length >= 4
                ? styles.post__img
                : styles.post__img__three__col
            }>
            {sliceMedia.map((media, i) =>
              media.type === 'video/mp4' ? (
                <ReactPlayer
                  url={media.url}
                  controls
                  key={i}
                  autoPlay={false}
                  width={`100%`}
                  height={`100%`}
                />
              ) : (
                <img
                  key={i}
                  src={media.url}
                  alt='post__img'
                  loading='lazy'
                  onClick={() => handleGallery(i)}
                />
              )
            )}
          </div>
          {post?.media.length - sliceMedia.length > 0 ? (
            <p className={styles.more_imgs}>
              +{post?.media.length - sliceMedia.length}
            </p>
          ) : null}
        </div>
      ) : null}

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
          <Link to={`${post.author_name}/thread/${post.id}`} style={{color:"#00000099"}}>
            <p onClick={() => setComment(true)}>
            {post.comment_count}{' '}
            {post.comment_count > 1 ? 'comments' : 'comment'}
          </p>
          </Link>
        ) : null}
      </div>
      <div className={styles.cta}>
        <ul className={styles.cta__list}>
          <li onClick={handleLike}>
            {likeLoad ? (
              <div className={styles.comment__load}>
                <FontAwesomeIcon icon={faSpinner} />
              </div>
            ) : filterIds.includes(user?.id) ? (
              <>
                <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
              </>
            ) : (
              <>
                {' '}
                <FontAwesomeIcon icon={faThumbsUp} />
                <p>Like</p>
              </>
            )}
          </li>
          <Link to={`${post.author_name}/thread/${post.id}`}>
          <li>
            <FontAwesomeIcon icon={faComment} />
            <p>Comments</p>
          </li>
          </Link>
          {/* <li>
            <FontAwesomeIcon icon={faShare} />
            <p>Share</p>
          </li> */}
        
        </ul>
      </div>
      {showGallery && (
        <Gallery
          setShowGallery={setShowGallery}
          galleryImg={galleryImg}
          post={post}
          setGalleryImg={setGalleryImg}
        />
      )}
   
    </article>
  )
}

export default MainPost
