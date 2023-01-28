import { faBullseye, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import styles from '../../../CSS/loggedInCss/aboutForm.module.css'
import { setIsprofileCompleted } from '../../../features/userAuth'
import { db } from '../../../firebase'
function AboutForm() {
  const { user } = useSelector((state) => state.user.value)
  const [data, setData] = useState({
    education: '',
    work: '',
    about: '',
  })
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateDoc(doc(db, `users/${user?.id}`), {
        education: data?.education,
        work: data?.work,
        about: data?.about,
      })
      setLoading(false)
      dispatch(setIsprofileCompleted(false))
    } catch (error) {
      toast.error(error)
      setLoading(faBullseye)
      dispatch(setIsprofileCompleted(false))
    }
  }

  return (
    <div className={styles.profile__modal}>
      <div
        className={styles.cancel}
        onClick={() => dispatch(setIsprofileCompleted(false))}>
        {' '}
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <form className={styles.profile__form} onSubmit={handleSubmit}>
        <div className={styles.for__education}>
          <label htmlFor='educationId'>Education</label>
          <input
            type='text'
            id='educationId'
            required
            name='education'
            value={data.education}
            onChange={handleChange}
          />
        </div>
        <div className={styles.for__work}>
          <label htmlFor='workId'>Work</label>
          <input
            type='text'
            id='workId'
            required
            name='work'
            value={data.work}
            onChange={handleChange}
          />
        </div>
        <div className={styles.for__about}>
          <label htmlFor='aboutId'>About</label>
          <textarea
            type='text'
            id='aboutId'
            required
            name='about'
            value={data.about}
            onChange={handleChange}
          />
        </div>
        <button disabled={loading ? true : false}>
          {loading ? `please wait...` : `Complete Profile`}
        </button>
      </form>
    </div>
  )
}

export default AboutForm
