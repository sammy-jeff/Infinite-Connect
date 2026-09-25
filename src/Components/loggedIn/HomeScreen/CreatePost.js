import React, { useEffect, useRef, useState } from 'react'
import styles from '../../../CSS/loggedInCss/createPost.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheckCircle,
  faCircleNotch,
  faImage,
  faPlay,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { showPost } from '../../../features/createPost'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { storage, db, auth } from '../../../firebase'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { v4 } from 'uuid'
import { setIsLoading } from '../../../features/posts'
import { isVideo } from '../../../helpers/posts'

const MAX_MEDIA = 9

function CreatePost() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.value)
  const { isLoading } = useSelector((state) => state.posts)
  const [post__text, setPost__text] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(0)
  const textRef = useRef()

  const canPost =
    (post__text.trim().length > 0 || images.length > 0) &&
    !uploading &&
    !isLoading
  const isDirty = post__text.trim().length > 0 || images.length > 0

  const close = () => dispatch(showPost(false))

  useEffect(() => {
    textRef.current?.focus()
  }, [])

  // Escape closes the composer, unless that would throw away a draft
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isDirty) dispatch(showPost(false))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDirty, dispatch])

  const handleKeyDown = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  // uploads all selected files in parallel instead of one after another
  const handleFiles = async (fileList) => {
    const selected = Array.from(fileList || [])
    const files = selected.slice(0, MAX_MEDIA - images.length)
    if (files.length < selected.length) {
      toast.info(`You can attach up to ${MAX_MEDIA} files per post`, {
        position: 'bottom-right',
      })
    }
    if (!files.length) return
    setUploading(files.length)
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const snap = await uploadBytes(
            ref(storage, `postImg/${file.name + v4()}`),
            file
          )
          const url = await getDownloadURL(snap.ref)
          return { url, type: snap.metadata.contentType }
        })
      )
      setImages((prev) => [...prev, ...uploaded].slice(0, MAX_MEDIA))
    } catch (error) {
      toast.error('Upload failed, please try again', {
        position: 'bottom-right',
      })
    } finally {
      setUploading(0)
    }
  }

  const removeMedia = (media) => {
    setImages((prev) => prev.filter((item) => item.url !== media.url))
    deleteObject(ref(storage, media.url)).catch(() => {})
  }

  const handleSubmit__post = async (e) => {
    e.preventDefault()
    if (!canPost) return
    dispatch(setIsLoading(true))
    try {
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

      await addDoc(collection(db, 'posts'), {
        ...others,
        author_name: user?.name,
        avatar: user?.avatar,
        avatarPath: user?.avatarPath,
        author_id: auth.currentUser.uid,
        body: post__text,
        media: images,
        reaction_count: 0,
        comment_count: 0,
        createdAt: Timestamp.fromDate(new Date()),
        likedBy: [],
      })
      setPost__text('')
      setImages([])
      dispatch(showPost(false))
      toast.success('Your post is live', { position: 'bottom-right' })
    } catch (error) {
      toast.error('Could not publish post, please try again', {
        position: 'bottom-right',
      })
    } finally {
      dispatch(setIsLoading(false))
    }
  }

  const onFileInput = (e) => {
    const files = Array.from(e.target.files || [])
    // reset so selecting the same file again still fires onChange
    e.target.value = ''
    handleFiles(files)
  }

  return (
    <div
      className={styles.postModal}
      onClick={(e) => e.target === e.currentTarget && !isDirty && close()}>
      <div className={styles.postCreate} role='dialog' aria-modal='true'>
        <div className={styles.headline}>
          <h3>Create a Post</h3>
          <h3 onClick={close} title='Close'>
            {' '}
            <FontAwesomeIcon icon={faTimes} />
          </h3>
        </div>
        <div className={styles.user}>
          <div className={styles.img__container}>
            {' '}
            <img src={user?.avatar || `/user.png`} alt='profile__pics' />
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

        <form onSubmit={handleSubmit__post}>
          <div className={styles.post__text}>
            <textarea
              ref={textRef}
              name='post'
              value={post__text}
              placeholder='What do you want to talk about?'
              onKeyDown={handleKeyDown}
              onChange={(e) => setPost__text(e.target.value)}></textarea>
          </div>

          {images.length || uploading ? (
            <div className={styles.previews}>
              {images.map((media) => (
                <div key={media.url} className={styles.preview}>
                  {isVideo(media) ? (
                    <video src={media.url} muted playsInline preload='metadata' />
                  ) : (
                    <img src={media.url} alt='' />
                  )}
                  <button
                    type='button'
                    className={styles.remove}
                    onClick={() => removeMedia(media)}
                    aria-label='Remove attachment'>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
              {Array.from({ length: uploading }, (_, i) => (
                <div
                  key={`uploading-${i}`}
                  className={`${styles.preview} ${styles.uploading}`}>
                  <FontAwesomeIcon icon={faCircleNotch} spin />
                </div>
              ))}
            </div>
          ) : null}

          <div className={styles.bottom}>
            <ul className={styles.post__types}>
              <li title='Add photos'>
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
                  onChange={onFileInput}
                />
              </li>
              <li title='Add a video'>
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
                  onChange={onFileInput}
                />
              </li>
              <li className={styles.hint}>
                {images.length}/{MAX_MEDIA}
              </li>
            </ul>
            <button
              className={canPost ? styles.button__blue : styles.button__gray}
              disabled={!canPost}>
              {isLoading ? `Posting..` : uploading ? `Uploading..` : `Post`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
