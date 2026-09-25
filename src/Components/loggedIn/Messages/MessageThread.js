import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import styles from '../../../CSS/loggedInCss/messages.module.css'

import {
  faCamera,
  faCheck,
  faCheckCircle,
  faDotCircle,
} from '@fortawesome/free-solid-svg-icons'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase'

import useSelectUser from '../../../customs/useSelectUser'
import { useSelector } from 'react-redux'
import TimeAgo from '../../TimeAgo'

function MessageThread({ u, user1, width }) {
  const { chat } = useSelector((state) => state.chats)
  
  const [data, setData] = useState(null)
  
  const mainStr = u.chat_id
  const lastChat_id = mainStr.split(user1).join('')

  // the snapshot already carries the profile, no extra getDoc needed
  useEffect(
    () =>
      onSnapshot(doc(db, 'users', lastChat_id), (snapShot) =>
        setData(snapShot.data())
      ),
    [lastChat_id]
  )
  const selectUser = useSelectUser()
  return (
    <div
   
      className={chat?.id === data?.id ? styles.active_chat : styles.user}
      onClick={() => data && selectUser(data, width, lastChat_id)}>
      <div className={styles.userPics__container}>
        <img
          src={data?.avatar || `/user.png`}
          alt='user_pics'
          loading='lazy'
          decoding='async'
        />{' '}
        <FontAwesomeIcon
          icon={faDotCircle}
          color={data?.isOnline === true ? 'green' : 'red'}
        />
      </div>
      <div className={styles.user__msg}>
        <h3>
          {data?.name}{' '}
          <span>
            {data?.owner && (
              <FontAwesomeIcon icon={faCheckCircle} color='#0a66c2' size='xs' />
            )}
          </span>
        </h3>
        <p>
          {u?.from === user1 ? (
            <FontAwesomeIcon
              className={u?.unread ? styles.unread : styles.read}
              icon={faCheck}
            />
          ) : null}
          {u?.media ? (
            <FontAwesomeIcon className={styles.camera} icon={faCamera} />
          ) : u?.from === user1 ? (
            `you: ${u?.text}`
          ) : (
            u?.text && `${data?.name || 'loading'}: ${u?.text}`
          )}
        </p>
      </div>
      <div className={styles.time__count}>
        <p>
          <TimeAgo value={u?.createdAt} />
        </p>
        <p className={u?.from !== user1 && u?.unread ? styles.new : ''}>
          {u?.from !== user1 && u?.unread ? `n` : null}
        </p>
      </div>
    </div>
  )
}

export default MessageThread
