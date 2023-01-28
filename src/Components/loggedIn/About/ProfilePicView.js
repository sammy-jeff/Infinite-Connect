import {
  faCamera,
  faSpinner,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useMemo, useState } from 'react'
import styles from '../../../CSS/loggedInCss/profilePicView.module.css'
import useDeleteProfilePic from '../../../customs/useDeleteProfilePic'
import useProfilePicUpload from '../../../customs/useProfilePicUpload'
import { auth } from '../../../firebase'
function ProfilePicView({ user, setViewProfilePic }) {
  const [img, setImg] = useState(null)
  const [imgUploadLoading, setImgUploadLoading] = useState(false)
  const img1 = useMemo(() => img, [img])
  const setImg1 = useCallback(() => setImg(), [])
  useProfilePicUpload(img1, setImg1, setImgUploadLoading)
  const deleteProfilePics = useDeleteProfilePic()
  return (
    <div className={styles.profilePicModal}>
      <div
        className={
          user?.id === auth.currentUser.uid
            ? styles.profile__pic__container__own
            : styles.profile__pic__container
        }>
        <div className={styles.top}>
          <h2>Profile photo</h2>
          <button onClick={() => setViewProfilePic(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles.grid_2}>
          {imgUploadLoading ? (
            <FontAwesomeIcon className={styles.imgSpinner} icon={faSpinner} />
          ) : (
            <img src={user?.avatar || `/user.png`} alt={user?.name} />
          )}
        </div>
        {user?.id === auth.currentUser.uid && (
          <div className={styles.controls}>
            <div className={styles.add__photo}>
              <label htmlFor='profile_picId'>
                <FontAwesomeIcon icon={faCamera} />
              </label>
              <input
                type='file'
                accept='image/*'
                id='profile_picId'
                style={{ display: 'none' }}
                onChange={(e) => setImg(e.target.files[0])}
              />
              <span>Add photo</span>
            </div>
            {user?.avatar ? (
              <div className={styles.delete__photo} onClick={deleteProfilePics}>
                <FontAwesomeIcon icon={faTrash} />
                <span>Delete</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePicView
