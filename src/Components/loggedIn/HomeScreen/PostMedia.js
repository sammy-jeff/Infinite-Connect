import React, { useState } from 'react'
import styles from '../../../CSS/loggedInCss/middleMain.module.css'
import { isVideo } from '../../../helpers/posts'
import Gallery from './Gallery'

const VISIBLE = 4

function PostMedia({ media }) {
  const [galleryIndex, setGalleryIndex] = useState(null)
  if (!media?.length) return null

  const visible = media.slice(0, VISIBLE)
  const hidden = media.length - visible.length

  return (
    <div className={styles.gallery__container}>
      <div
        className={
          media.length >= VISIBLE ? styles.post__img : styles.post__img__three__col
        }>
        {visible.map((item, i) =>
          isVideo(item) ? (
            <video
              key={item.url}
              src={item.url}
              controls
              playsInline
              preload='metadata'
            />
          ) : (
            <img
              key={item.url}
              src={item.url}
              alt='post__img'
              loading='lazy'
              decoding='async'
              onClick={() => setGalleryIndex(i)}
            />
          )
        )}
      </div>
      {hidden > 0 ? (
        <button
          type='button'
          className={styles.more_imgs}
          onClick={() => setGalleryIndex(VISIBLE)}>
          +{hidden}
        </button>
      ) : null}
      {galleryIndex !== null && (
        <Gallery
          media={media}
          index={galleryIndex}
          setIndex={setGalleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
    </div>
  )
}

export default PostMedia
