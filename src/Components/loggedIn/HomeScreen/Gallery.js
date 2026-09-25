import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import styles from '../../../CSS/loggedInCss/gallery.module.css'
import { isVideo } from '../../../helpers/posts'

function Gallery({ media, index, setIndex, onClose }) {
  const current = media[index]
  const hasPrev = index > 0
  const hasNext = index < media.length - 1

  // keyboard navigation: arrows to browse, Escape to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1)
      if (e.key === 'ArrowRight' && index < media.length - 1)
        setIndex(index + 1)
    }
    window.addEventListener('keydown', onKeyDown)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [index, media.length, setIndex, onClose])

  // warm the cache for the next image so browsing feels instant
  useEffect(() => {
    const next = media[index + 1]
    if (next && !isVideo(next)) new Image().src = next.url
  }, [index, media])

  if (!current) return null

  return (
    <div className={styles.galleryModal} role='dialog' aria-modal='true'>
      <div className={styles.cancel}>
        <FontAwesomeIcon icon={faArrowLeft} onClick={onClose} />
        <span className={styles.counter}>
          {index + 1} / {media.length}
        </span>
      </div>
      <div className={styles.img__main}>
        {isVideo(current) ? (
          <video key={current.url} src={current.url} controls autoPlay playsInline />
        ) : (
          <img key={current.url} src={current.url} alt='post_img' />
        )}
        {hasPrev ? (
          <div className={styles.nav_container__left}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => setIndex(index - 1)}
            />
          </div>
        ) : null}

        {hasNext ? (
          <div className={styles.nav_container__right}>
            <FontAwesomeIcon
              icon={faArrowRight}
              onClick={() => setIndex(index + 1)}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Gallery
