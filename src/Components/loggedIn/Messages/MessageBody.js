import React, { useEffect, useRef } from 'react'
import styles from '../../../CSS/loggedInCss/messages.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'

import {
  collection,
  doc,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from '../../../firebase'
import useInfiniteScroll from '../../../customs/useInfiniteScroll'
import useLiveQuery from '../../../customs/useLiveQuery'
import useTruncation from '../../../customs/useTruncation'
import { msgIds } from '../../../helpers/msgIds'
import TimeAgo from '../../TimeAgo'

function MessageBody({ imgLoad }) {
  const { chat } = useSelector((state) => state.chats)
  const user1 = auth.currentUser.uid
  const user2 = chat?.id
  const id = msgIds(user1, user2)
  const rootElem = useRef()
  const target = useRef()
  const truncateMessage = useTruncation()

  const {
    items: messages,
    loading,
    hasMore,
    loadMore,
  } = useLiveQuery(
    user2 ? `messages/${id}/chat` : null,
    () =>
      query(collection(db, 'messages', id, 'chat'), orderBy('createdAt', 'desc')),
    15
  )
  // the list is column-reversed, so the sentinel at the end sits at the top
  useInfiniteScroll(target, loadMore, {
    enabled: hasMore && !loading,
    rootRef: rootElem,
    rootMargin: '150px',
  })

  // mark the conversation read when a new message arrives while it is open
  const newest = messages[0]
  useEffect(() => {
    if (newest && newest.from === user2) {
      updateDoc(doc(db, 'lastMsg', id), { unread: false }).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newest?.id])

  return (
    <div className={styles.messagebody}>
      {' '}
      {imgLoad && <p className={styles.imgLoad__indicator}>Loading...</p>}
      <div ref={rootElem} className={styles.body}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.from === user1 ? styles.wrapper : styles.own}>
            <p className={message.from === user1 ? styles.me : styles.friend}>
              {message.media ? (
                <img src={message.media} alt={message.text} loading='lazy' />
              ) : null}
              {truncateMessage(message.text, 150)}
              <small>
                <TimeAgo value={message.createdAt} />
              </small>
            </p>
          </div>
        ))}
        {loading && messages.length ? (
          <div className={styles.spinner}>
            <FontAwesomeIcon icon={faSpinner} />
          </div>
        ) : null}
        <div ref={target} aria-hidden='true' style={{ minHeight: 1 }} />
      </div>
    </div>
  )
}

export default MessageBody
