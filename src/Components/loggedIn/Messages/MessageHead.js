import { faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from '../../../CSS/loggedInCss/messages.module.css'
import { setShowMsg } from '../../../features/chatGlobal'
function MessageHead() {
  const { chat, showMsg } = useSelector((state) => state.chats)
  const dispatch = useDispatch()
  return (
    <div className={styles.message__head}>
      {showMsg && (
        <Link to='/messaging'>
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={() => dispatch(setShowMsg(false))}
          />
        </Link>
      )}
      <img src={chat?.avatar || `/user.png`} alt='user_pic' />
      <div className={styles.msg__username}>
        <h3>
          {chat?.name}{' '}
          <span>
            {chat?.owner && (
              <FontAwesomeIcon icon={faCheckCircle} color='#0a66c2' size='xs' />
            )}
          </span>
        </h3>

        <small>{chat.isOnline ? 'online' : ''}</small>
      </div>
    </div>
  )
}

export default MessageHead
