import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../../../CSS/loggedInCss/messages.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import { db } from '../../../firebase'
import { setMessages } from '../../../features/messages'
import useInfiniteScroll_realtime from '../../../customs/useInfiniteScroll_realtime'
import useTruncation from '../../../customs/useTruncation'
import moment from 'moment'
function MessageBody({ user1, imgLoad }) {
  const { messages } = useSelector((state) => state.messages)
  const { chat } = useSelector((state) => state.chats)

  const msgMemo = useMemo(() => messages, [messages])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const user2 = chat?.id
  const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
  const q = query(
    collection(db, `/messages/${id}/chat`),
    orderBy('createdAt', 'desc'),
    limit(8)
  )
  const rootElem = useRef()
  const target = useRef()
  const truncateMessage = useTruncation()
  useEffect(() => {
    const getSnapshot = onSnapshot(q, (querySnapshot) => {
      const msgs = []
      querySnapshot.forEach((snapshot) => {
        msgs.push({ ...snapshot.data(), id: snapshot.id })
      })
      dispatch(setMessages(msgs))
    })
    return () => getSnapshot()
    // eslint-disable-next-line
  }, [chat])
  const next = query(
    collection(db, `/messages/${id}/chat`),
    orderBy('createdAt', 'desc'),
    startAfter(messages[messages.length - 1]?.createdAt || 0),
    limit(4)
  )
  useInfiniteScroll_realtime(
    messages,
    target,
    setMessages,
    next,
    rootElem.current,
    msgMemo,
    setLoading
  )
  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [])
  // console.log(messages)
  useEffect(() => {
    setLoading(true)
  }, [messages.length])
  return (
    <div className={styles.messagebody}>
      {' '}
      {imgLoad && <p className={styles.imgLoad__indicator}>Loading...</p>}
      <div ref={rootElem} className={styles.body}>
        <div ref={bottomRef} />
        {messages.map((message) => {
          return (
            <div key={message.id}>
              {' '}
              {message?.from + message?.to === id ||
              message?.to + message?.from === id ? (
                <div
                  className={
                    message.from === user1 ? styles.wrapper : styles.own
                  }>
                  <p
                    className={
                      message.from === user1 ? styles.me : styles.friend
                    }>
                    {message.media ? (
                      <img src={message.media} alt={message.text} />
                    ) : null}
                    {truncateMessage(message.text, 150)}
                    <small>
                      {moment(message.createdAt.toDate()).fromNow(true)}
                    </small>
                  </p>
                </div>
              ) : null}
            </div>
          )
        })}
        {loading && messages.length ? (
          <div className={styles.spinner}>
            <FontAwesomeIcon icon={faSpinner} />
          </div>
        ) : null}
        <div ref={target} className={styles.msg_target}>
          .
        </div>
      </div>
    </div>
  )
}

export default MessageBody
