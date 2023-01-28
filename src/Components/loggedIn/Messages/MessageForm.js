import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from '../../../CSS/loggedInCss/messages.module.css'

function MessageForm({
  setText,
  setImg,
  handleSubmit,
  text,
  msgLoad,
  ImgLoad,
}) {
  const handleKeyDown = (e) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  return (
    <form className={styles.messageform__container} onSubmit={handleSubmit}>
      <textarea
        placeholder='Write a message'
        autoCorrect='true'
        onKeyDown={handleKeyDown}
        value={text}
        onChange={(e) => setText(e.target.value)}></textarea>
      <div className={styles.attachment}>
        <label htmlFor='msg__attachment'>
          <FontAwesomeIcon icon={faPaperclip} />
        </label>
        <input
          type='file'
          id='msg__attachment'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <button
          className={msgLoad || ImgLoad || !text ? styles.button__grey : ''}
          type='submit'
          disabled={msgLoad || ImgLoad ? true : false}>
          {msgLoad ? 'sending' : 'send'}
        </button>
      </div>
    </form>
  )
}

export default MessageForm
