import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../../CSS/loggedInCss/messages.module.css'
import { auth, db, storage } from '../../../firebase'

import MessageThread from './MessageThread'
import SharedLayout from '../../../Components/SharedLayout'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import Layout from '../../loggedIn/Layout'
import { toast } from 'react-toastify'
import MessageCenter from './MessageCenter'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { msgIds } from '../../../helpers/msgIds'
import useInfiniteScroll from '../../../customs/useInfiniteScroll'
import useLiveQuery from '../../../customs/useLiveQuery'
import useWindowWidth from '../../../customs/useWindowWidth'

const lastMsgQuery = () =>
  query(collection(db, 'lastMsg'), orderBy('createdAt', 'desc'))

function Messages() {
  const { user } = useSelector((state) => state.user.value)
  const { chat, showMsg } = useSelector((state) => state.chats)

  const user1 = auth.currentUser.uid

  const [text, setText] = useState('')
  const [img, setImg] = useState(null)

  const breakPoint = 700
  const width = useWindowWidth()
  const pageEnd = useRef()
  const rootElem = useRef()
  const [msgImg, setMsgImg] = useState('')
  const [imgLoad, setImgLoad] = useState(false)
  const [msgLoad, setMsgLoad] = useState(false)

  const { items, loading, hasMore, loadMore } = useLiveQuery(
    'lastMsg',
    lastMsgQuery,
    20
  )
  // conversation ids are both participants' uids joined together
  const usersFill = useMemo(
    () =>
      items
        .filter((item) => item.id.includes(user1))
        .map((item) => ({ ...item, chat_id: item.id })),
    [items, user1]
  )
  useInfiniteScroll(pageEnd, loadMore, {
    enabled: hasMore && !loading,
    rootRef: rootElem,
    rootMargin: '100px',
  })

  useEffect(() => {
    if (!img) return
    const uploadImg = async () => {
      try {
        setImgLoad(true)
        const imgRef = ref(storage, `msgImg/${img.name + new Date().getTime()}`)
        const snap = await uploadBytes(imgRef, img)
        setMsgImg(await getDownloadURL(snap.ref))
        toast.success('image ready for transmission', { delay: 1000 })
      } catch (error) {
        toast.error('Could not upload image', { delay: 1000 })
      } finally {
        setImg(null)
        setImgLoad(false)
      }
    }
    uploadImg()
  }, [img])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const message = text.trim()
    if (!chat || (!message && !msgImg)) return
    const media = msgImg
    const user2 = chat.id
    const id = msgIds(user1, user2)
    const createdAt = Timestamp.fromDate(new Date())
    // clear the composer right away; the message shows instantly through the
    // listener's latency compensation while the write is confirmed
    setText('')
    setMsgImg('')
    setMsgLoad(true)
    try {
      await Promise.all([
        addDoc(collection(db, 'messages', id, 'chat'), {
          text: message,
          from: user1,
          to: user2,
          createdAt,
          media: media || '',
        }),
        setDoc(doc(db, 'lastMsg', id), {
          text: message,
          from: user1,
          to: user2,
          createdAt,
          media: media || '',
          unread: true,
          unread_count: 0,
        }),
      ])
    } catch (error) {
      setText(message)
      setMsgImg(media)
      toast.error('Message not sent, please try again', { delay: 1000 })
    } finally {
      setMsgLoad(false)
    }
  }

  return (
    <>
      <Layout>
        <div className={styles.messages__container}>
          <section className={styles.msg__center}>
            <section className={styles.users__section}>
              <div className={styles.user__header}>
                <header>Messaging</header>
                <img src={user?.avatar || `/user.png`} alt='user_pics' />
              </div>{' '}
              <div ref={rootElem} className={styles.listUsers}>
                {usersFill.length > 0 ? (
                  usersFill.map((u) => (
                    <MessageThread
                      key={u.chat_id}
                      u={u}
                      user1={user1}
                      width={width}
                    />
                  ))
                ) : loading ? null : (
                  <div className={styles.no__chat}>
                    <FontAwesomeIcon icon={faCommentAlt} />
                    <p>No Chat(s) yet</p>
                    <p>
                      Search for other connecters to start a great conversation
                    </p>
                  </div>
                )}

                <div ref={pageEnd} aria-hidden='true' style={{ height: 1 }} />
              </div>
            </section>
            <section
              className={
                width < breakPoint && showMsg
                  ? styles.small_screen
                  : styles.msg__section
              }>
              {chat ? (
                <MessageCenter
                  setImg={setImg}
                  setText={setText}
                  handleSubmit={handleSubmit}
                  text={text}
                  user1={user1}
                  msgLoad={msgLoad}
                  imgLoad={imgLoad}
                  msgImg={msgImg}
                />
              ) : (
                <h1 className={styles.gray}>
                  Please select a user, to start conversation
                </h1>
              )}
            </section>
          </section>

          <SharedLayout />
        </div>
      </Layout>
    </>
  )
}

export default Messages
