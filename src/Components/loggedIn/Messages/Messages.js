import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
} from 'firebase/firestore'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from '../../../CSS/loggedInCss/messages.module.css'
import { auth, db, storage } from '../../../firebase'

import MessageThread from './MessageThread'
// import SharedLayout from '../../../SharedLayout'
import SharedLayout from '../../../Components/SharedLayout'

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

import Layout from '../../loggedIn/Layout'
import { toast } from 'react-toastify'
import MessageCenter from './MessageCenter'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { msgIds } from '../../../helpers/msgIds'
import { Outlet } from 'react-router-dom'

function Messages() {
  const { user } = useSelector((state) => state.user.value)
  const [usersFill, setusersFill] = useState([])
  const { chat, showMsg } = useSelector((state) => state.chats)
  
  const user1 = auth.currentUser.uid

  const q = query(
    collection(db, 'lastMsg'),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const [text, setText] = useState('')
  const [img, setImg] = useState(null)

  const breakPoint = 700
  const [width, setWidth] = useState(window.innerWidth)
  const [intersectionTracker, setIntersectionTracker] = useState(false)
  const pageEnd = useRef()
  const isMounted = useRef(false)
  const [lastVisible, setLastVisible] = useState()
  const [msgImg, setMsgImg] = useState('')
  const [imgLoad, setImgLoad] = useState(false)
  const userFillMemo = useMemo(() => usersFill, [usersFill])
  const [msgLoad, setMsgLoad] = useState(false)
  const rootElem = useRef()
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  useEffect(() => {
    const getSnapShot = onSnapshot(q, (usersSnapShot) => {
      const users = []
      // eslint-disable-next-line
      usersSnapShot.docs.filter((snap) => {
        const joinedStr = snap.id
        const reg = new RegExp(user1, 'g')
        const test = reg.test(joinedStr)
        if (test) users.push({ ...snap.data(), chat_id: snap.id })
      })
      setLastVisible(usersSnapShot.docs[usersSnapShot.docs.length - 1])
      setusersFill(users)
    })

    return () => getSnapShot()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const scroll = () => {
      const next = query(
        collection(db, 'lastMsg'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible?.data()?.createdAt || 0),
        limit(3)
      )
      const getSnapshot = onSnapshot(next, (usersSnapShot) => {
        const users = []
        if (!usersSnapShot.empty) {
          // eslint-disable-next-line
          usersSnapShot.docs.filter((snap) => {
            const joinedStr = snap.id
            const reg = new RegExp(user1, 'g')
            const test = reg.test(joinedStr)
            if (test) users.push({ ...snap.data(), chat_id: snap.id })
          })
          setusersFill([...usersFill, ...users])
          if (usersSnapShot.docs[usersSnapShot.docs.length - 1])
            setLastVisible(usersSnapShot.docs[usersSnapShot.docs.length - 1])
        }
        if (usersSnapShot.empty) observer.unobserve(pageEnd.current)
      })
      return () => getSnapshot()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (isMounted.current) {
          if (entries[0].isIntersecting) {
            setIntersectionTracker(true)
            scroll()
          } else {
            setIntersectionTracker(false)
          }
        }
      },
      { threshold: 0, root: rootElem.current }
    )
    observer.observe(pageEnd.current)
    isMounted.current = true
    // console.log(intersectionTracker)
    return () => observer.disconnect()
    // eslint-disable-next-line
  }, [intersectionTracker, userFillMemo])
  const isMounted__img = useRef(false)
  useEffect(() => {
    const uploadImg = async () => {
      try {
        if (img) {
          setImgLoad(true)
          const imgRef = ref(
            storage,
            `msgImg/${img.name + new Date().getTime()}`
          )
          const snap = await uploadBytes(imgRef, img)
          const durl = await getDownloadURL(ref(storage, snap.ref.fullPath))
          setMsgImg(durl)
          setImg(null)
          setImgLoad(false)
          toast.success('image ready for transmission', { delay: 1000 })
          // const dUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
        }
      } catch (error) {
        setImg(null)
        setImgLoad(false)
        toast.error(error, { delay: 1000 })
      }
    }
    if (isMounted__img.current) uploadImg()
    isMounted__img.current = true
    return () => isMounted.current
  }, [img])
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (text || msgImg) {
        setMsgLoad(true)
        const user2 = chat.id
        const id = msgIds(user1,user2)
        await addDoc(collection(db, 'messages', id, 'chat'), {
          text: text,
          from: user1,
          to: user2,
          createdAt: Timestamp.fromDate(new Date()),
          media: msgImg || '',
        })

        await setDoc(doc(db, 'lastMsg', id), {
          text: text,
          from: user1,
          to: user2,
          createdAt: Timestamp.fromDate(new Date()),
          media: msgImg || '',
          unread: true,
          unread_count: 0,
        })

        setMsgImg('')
        setMsgLoad(false)
        setText('')
      }
    } catch (error) {
      setMsgImg('')
      setMsgLoad(false)
      setText('')
      alert(error)
    }
  }
  console.log(chat)
  // const navigate = useNavigate()

  // const user2 = chat?.id
  // const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
  // // console.log(chat)
  return (
    <>
      <Layout>
        <div className={styles.messages__container}>
          <section className={styles.msg__center}>
            <section className={styles.users__section}>
              <div className={styles.user__header}>
                <header>Messaging</header>
                <img src={user?.avatar || `user.png`} alt='user_pics' />
              </div>{' '}
              <div ref={rootElem} className={styles.listUsers}>
                {userFillMemo.length > 0 ? (
                  userFillMemo.map((u) => (
                    <MessageThread
                      key={u.chat_id}
                      u={u}
                      user1={user1}
                      width={width}
                    />
                  ))
                ) : (
                  <div className={styles.no__chat}>
                    <FontAwesomeIcon icon={faCommentAlt} />
                    <p>No Chat(s) yet</p>
                    <p>
                      Search for other connecters to start a great conversation
                    </p>
                  </div>
                )}

                <div ref={pageEnd} className={styles.target}>
                  .
                </div>

                <div></div>
              </div>
            </section>
            <section
              className={
                width < breakPoint && showMsg
                  ? styles.small_screen
                  : styles.msg__section
              }>
              {chat ? (
                <>
                  {' '}
                  {/* <MessageCenter
                    setImg={setImg}
                    setText={setText}
                    handleSubmit={handleSubmit}
                    text={text}
                    user1={user1}
                    msgLoad={msgLoad}
                    imgLoad={imgLoad}
                    msgImg={msgImg}
                  /> */}
                  <Outlet context={[setImg,setText,handleSubmit,text,user1,msgLoad,imgLoad,msgImg]}/>
                </>

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
