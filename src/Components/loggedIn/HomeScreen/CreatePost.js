import React, { useEffect, useRef, useState } from 'react'
import styles from '../../../CSS/loggedInCss/createPost.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faImage,
  faPlay,
  faTimes,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { showPost } from '../../../features/createPost'
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore'
import { storage, db, auth } from '../../../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'
import { setIsLoading } from '../../../features/posts'
function CreatePost() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.value)
  const { isLoading } = useSelector((state) => state.posts)
  const [post__text, setPost__text] = useState('')
  const handleKeyDown = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  const [img, setImg] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    alert(
      'User is only allowed to upload up to nine(9) images(only the first nine selected images will be uploaded)'
    )
  }, [])
  useEffect(() => {
    const uploadImg = async () => {
      let media = []
      let url

      try {
        if (img) {
          setLoading(true)
          for (let i = 0; i < img.length; i++) {
            const imgRef = ref(storage, `postImg/${img[i]?.name + v4()}`)

            const snap = await uploadBytes(imgRef, img[i])

            const dUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
            url = dUrl
            media.push({ url, type: snap.metadata.contentType })

            if (i === 8) {
              break
            }
          }
          setImages(media)
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
        alert(error)
      }
    }
    if (isMounted.current) uploadImg()
    isMounted.current = true
  }, [img])

  const handleSubmit__post = async (e) => {
    e.preventDefault()
    // if (post__text.length < 2 || post__text === ' ') return
    dispatch(setIsLoading(true))
    const getUser = await (
      await getDoc(doc(db, 'users', auth.currentUser.uid))
    ).data()
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
    } = getUser

    await addDoc(collection(db, 'posts'), {
      ...others,
      author_name: user?.name,
      avatar: user?.avatar,
      avatarPath: user?.avatarPath,
      author_id: id,
      body: post__text,
      media: [...images] || [],
      reaction_count: 0,
      comment_count: 0,
      createdAt: Timestamp.fromDate(new Date()),
      likedBy: [],
    })
    setPost__text('')
    setImg(null)
    dispatch(setIsLoading(false))
    dispatch(showPost(false))
  }

  return (
    <div className={styles.postModal}>
      <div className={styles.postCreate}>
        <div className={styles.headline}>
          <h3>Create a Post</h3>
          <h3 onClick={() => dispatch(showPost(false))}>
            {' '}
            <FontAwesomeIcon icon={faTimes} />
          </h3>
        </div>
        <div className={styles.user}>
          <div className={styles.img__container}>
            {' '}
            <img src={user?.avatar || `user.png`} alt='profile__pics' />
          </div>
          <p>
            {user?.name}{' '}
            <span>
              {user?.owner && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color='#0a66c2'
                  size='xs'
                />
              )}
            </span>
          </p>
        </div>
        <div className={styles.storageImg}>
          {loading ? (
            <>
              <FontAwesomeIcon icon={faUpload} size='1x' />{' '}
              <span>Please wait...</span>
            </>
          ) : (
            <>
              {' '}
              {images?.map((image, index) => (
                <div key={index}>{image.url}</div>
              ))}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit__post}>
          <div className={styles.post__text}>
            <textarea
              name='post'
              value={post__text}
              placeholder='What do you want to talk about '
              onKeyDown={handleKeyDown}
              onChange={(e) => setPost__text(e.target.value)}></textarea>
          </div>
          <div className={styles.bottom}>
            <ul className={styles.post__types}>
              <li>
                <label htmlFor='post__img'>
                  <FontAwesomeIcon icon={faImage} />
                </label>
                <input
                  type='file'
                  name='image'
                  id='post__img'
                  multiple
                  accept='image/*'
                  style={{ display: 'none' }}
                  onChange={(e) => setImg(e.target.files)}
                />
              </li>
              <li>
                <label htmlFor='post_video'>
                  {' '}
                  <FontAwesomeIcon icon={faPlay} />
                </label>
                <input
                  type='file'
                  name='video'
                  id='post_video'
                  accept='video/*'
                  style={{ display: 'none' }}
                  onChange={(e) => setImg(e.target.files)}
                />
              </li>
              {/* <li>
							<FontAwesomeIcon icon={faFile} />
						</li> */}
            </ul>
            <button
              className={
                post__text.length < 2
                  ? styles.button__gray
                  : styles.button__blue
              }
              disabled={post__text.length > 2 || img ? false : true}>
              {isLoading ? `Posting..` : `Post`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
