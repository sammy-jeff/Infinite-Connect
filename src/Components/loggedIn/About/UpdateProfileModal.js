import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import styles from '../../../CSS/loggedInCss/updateProfileModal.module.css'
import { auth, db } from '../../../firebase'
function UpdateProfileModal({ setShowUpdateFormModal, userAbout }) {
  const { name, education, work, about } = userAbout
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState({
    name,
    education,
    work,
    about,
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setText({ ...text, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}`), {
        name: text.name,
        education: text.education,
        work: text.work,
        about: text.about,
      }).then(() => {
        setLoading(false)
        setShowUpdateFormModal(false)
      })
    } catch (error) {
      setLoading(false)
      alert(error)
    }
  }
  return (
    <div className={styles.update__modal}>
      <div className={styles.update__form__container}>
        <div className={styles.top}>
          <h2>Edit Profile</h2>
          <div
            className={styles.cancel}
            onClick={() => setShowUpdateFormModal(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <form className={styles.update__form} onSubmit={handleSubmit}>
          <p className={styles.required}>* indicates required</p>
          <div className={styles.user__name}>
            <label htmlFor='nameId'>Name*</label>
            <input
              type='text'
              id='nameId'
              value={text?.name}
              name='name'
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.education}>
            <label htmlFor='educationId'>Education*</label>
            <input
              type='text'
              id='educationId'
              value={text?.education}
              name='education'
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.work}>
            <label htmlFor='workId'>Work*</label>
            <input
              type='text'
              id='workId'
              value={text?.work}
              name='work'
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.about}>
            <label htmlFor='aboutId'>About*</label>
            <textarea
              type='text'
              id='aboutId'
              value={text?.about}
              name='about'
              onChange={handleChange}
              required
            />
          </div>
          <button disabled={loading ? true : false}>
            {loading ? `Saving..` : `Save`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfileModal
