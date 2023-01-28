import {
  faArrowLeft,
  faArrowRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

import styles from '../../../CSS/loggedInCss/gallery.module.css'
function Gallery({ setShowGallery, galleryImg, post, setGalleryImg }) {
  const [showLeft, setShowLeft] = useState(true)
  const [showRight, setShowRight] = useState(true)
  const [galleryLoad, setGalleryLoad] = useState(false)

  const position = post.media?.indexOf(galleryImg)
  useEffect(() => {
    if (position === 0) setShowLeft(false)
    else setShowLeft(true)
    if (position === post?.media.length - 1) setShowRight(false)
    else setShowRight(true)
    // eslint-disable-next-line
  }, [position])
  const navigateRight = async () => {
    setGalleryLoad(true)
    let currentPos = position
    currentPos++

    await setGalleryImg(post?.media[currentPos])
    setGalleryLoad(false)
  }
  const navigateLeft = async () => {
    setGalleryLoad(true)
    let currentPos = position
    currentPos--

    await setGalleryImg(post?.media[currentPos])
    setGalleryLoad(false)
  }
  console.log(galleryLoad)
  return (
    <div className={styles.galleryModal}>
      <div className={styles.cancel}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => setShowGallery(false)}
        />
      </div>
      <div className={styles.img__main}>
        {galleryLoad ? (
          <FontAwesomeIcon
            className={styles.spinner}
            icon={faSpinner}
            size='2x'
          />
        ) : (
          <img src={galleryImg.url} loading='lazy' alt='post_img' />
        )}
        {showLeft ? (
          <div className={styles.nav_container__left}>
            <FontAwesomeIcon icon={faArrowLeft} onClick={navigateLeft} />
          </div>
        ) : null}

        {showRight ? (
          <div className={styles.nav_container__right}>
            <FontAwesomeIcon icon={faArrowRight} onClick={navigateRight} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Gallery
