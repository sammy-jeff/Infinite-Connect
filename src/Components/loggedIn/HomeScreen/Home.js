import { useSelector } from 'react-redux'

import CreatePost from './CreatePost'
import styles from '../../../CSS/loggedInCss/home.module.css'
import Main from './Main'
import Layout from '../Layout'
import LikedByModal from './LikedByModal'
import AboutForm from './AboutForm'
import { useState } from 'react'
import { useEffect } from 'react'
function Home() {
  const { postModal } = useSelector((state) => state.postModal)

  const { isProfileCompleted } = useSelector((state) => state.userAuth)
  const { isModalOpen } = useSelector((state) => state.likedByFeature)

  return (
    <div className={styles.home}>
      <Layout>
        <Main />
        {postModal && <CreatePost />}
        {isModalOpen && <LikedByModal />}
        {isProfileCompleted && <AboutForm />}
      </Layout>
    </div>
  )
}

export default Home
