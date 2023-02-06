import {
  faBriefcase,
  faCamera,
  faCheckCircle,
  faGraduationCap,
  faPencilAlt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { lazy, Suspense, useState } from 'react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { auth, db, storage } from '../../../firebase'
import Layout from '../Layout'
import styles from '../../../CSS/loggedInCss/about.module.css'
import useTruncation from '../../../customs/useTruncation'
import ProfilePicView from './ProfilePicView'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import useSelectUser from '../../../customs/useSelectUser'
import { useMemo } from 'react'

const UpdateProfileModal = lazy(() => import('./UpdateProfileModal'))
function About() {
  const { id } = useParams()
  const { user } = useSelector((state) => state.user.value)
  const [userAbout, setUserAbout] = useState(null)
  const [viewProfilePic, setViewProfilePic] = useState(false)
  const [img, setImg] = useState(null)
  const [imgUploadLoading, setImgUploadLoading] = useState(false)
  const [showUpdateFormModal, setShowUpdateFormModal] = useState(false)
  const userMemo = useMemo(() => user, [user])
  const isMounted = useRef()
  const trunctate = useTruncation()
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])
  const selectUser = useSelectUser()
  useEffect(() => {
    getDoc(doc(db, `users/${id}`))
      .then((res) => setUserAbout(res.data()))
      .catch((err) => toast.error(err))
  }, [userMemo])
  useEffect(() => {
    isMounted.current = true
    if (isMounted.current && img) {
      const uploadImg = async () => {
        setImgUploadLoading(true)

        const imgRef = ref(
          storage,
          `coverImage/${img.name + new Date().getTime()}`
        )
        try {
          if (user?.coverImg) {
            await deleteObject(ref(storage, user?.coverImgFullPath))
          }
          await uploadBytes(imgRef, img).then(async (snap) => {
            const getDownloadLink = await getDownloadURL(
              ref(storage, snap.ref.fullPath)
            )
            await updateDoc(doc(db, `users`,auth.currentUser.uid), {
              coverImg: getDownloadLink,
              coverImgFullPath: snap.ref.fullPath,
            })
          })
          setImgUploadLoading(false)

          toast.success('Cover image uploaded successfully!!')
          setImg(null)
        } catch (error) {
          toast.error('error')
          setImgUploadLoading(false)
        }
      }
      uploadImg()
      isMounted.current = false
      return ()=>isMounted.current
    }
  }, [img])
  return (
    <Layout>
      <div className={styles.about__container}>
        <div className={styles.user__container}>
          <div className={styles.cover_pics}>
            <img
              src={userAbout?.coverImg || '/default-background-image.png'}
              alt='default'
            />
            {userAbout?.id === auth.currentUser.uid && (
              <div className={styles.cover__upload__container}>
                <label htmlFor='coverId'>
                  <FontAwesomeIcon icon={faCamera} />
                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    id='coverId'
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </label>
              </div>
            )}

            {imgUploadLoading && (
              <FontAwesomeIcon className={styles.imgSpinner} icon={faSpinner} />
            )}
          </div>
          <div className={styles.flex_1}>
            <div
              className={styles.profile_pics_container}
              onClick={() => setViewProfilePic(true)}>
              <img
                src={userAbout?.avatar || `/user.png`}
                alt={userAbout?.name}
              />
            </div>
            {userAbout?.id === auth.currentUser.uid && (
              <div
                className={styles.edit__profile}
                onClick={() => setShowUpdateFormModal(true)}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </div>
            )}
          </div>

          <div className={styles.user_name}>
            <h2>
              {userAbout?.name}{' '}
              {userAbout?.owner && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color='#0a66c2'
                  size='xs'
                />
              )}
            </h2>
            {userAbout?.id !== auth.currentUser.uid ? (
              <Link
                to={`/messaging`}
                onClick={() => selectUser(userAbout, width)}>
                Message
              </Link>
            ) : null}
          </div>
          {userAbout?.education ? (
            <div className={styles.education}>
              <p>
                <FontAwesomeIcon icon={faGraduationCap} />{' '}
                <span>{userAbout?.education}</span>
              </p>
            </div>
          ) : null}
          {userAbout?.work ? (
            <div className={styles.work}>
              <p>
                <FontAwesomeIcon icon={faBriefcase} />

                <span>{userAbout?.work}</span>
              </p>
            </div>
          ) : null}
          {userAbout?.about ? (
            <div className={styles.about}>
              <h2>About</h2>
              <p>{trunctate(userAbout?.about, 150)}</p>
            </div>
          ) : null}
        </div>
        {viewProfilePic && (
          <ProfilePicView
            user={userAbout}
            setViewProfilePic={setViewProfilePic}
          />
        )}
      </div>
      {showUpdateFormModal && (
        <Suspense fallback={<h2>Loading...</h2>}>
          <UpdateProfileModal
            setShowUpdateFormModal={setShowUpdateFormModal}
            userAbout={userAbout}
          />
        </Suspense>
      )}
    </Layout>
  )
}

export default About
