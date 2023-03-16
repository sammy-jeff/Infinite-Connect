import { faArrowLeft, faCheckCircle, faCircleNotch, faComment, faPaperPlane,  faSpinner, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addDoc, collection, doc, getDoc, getDocs, increment, limit, onSnapshot, orderBy, query, startAfter, Timestamp, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { v4 } from 'uuid'
import styles from "../../../CSS/loggedInCss/mainPostContent.module.css"
import useInfiniteScroll_realtime from '../../../customs/useInfiniteScroll_realtime'
import useLikeModal from '../../../customs/useLikeModal'
import usePagination from '../../../customs/usePagination'
import usePostLike from '../../../customs/usePostLike'
import useTruncation from '../../../customs/useTruncation'
import { setActiveUpdateId, setUpdateFlag } from '../../../features/comments'
import { auth, db } from '../../../firebase'
import Comments from './Comments'
import Gallery from './Gallery'
const CommentMemo = memo(Comments)
function MainPostContent() {
    const {postId} = useParams()
  
    const [compLoad,setCompLoad] = useState(false)
    const [post,setPost] = useState(null)
    const [postLoad,setPostLoad] = useState(false)
    const [commentPostLoad, setCommentPostLoad] = useState(false)
    const [comment_text, setComment_text] = useState('')
    const [comments, setComments] = useState([])
  const commtMemo = useMemo(() => comments, [comments])
    const [galleryImg, setGalleryImg] = useState(null)
    const { user } = useSelector((state) => state.user.value)
    const [likeLoad, setLikeLoad] = useState(false)
    const [showGallery, setShowGallery] = useState(false)
    
    const [loading, setLoading] = useState(false)
    const [hasMorePages, setHasMorePages] = useState(false)
    
    const { updateFlag, activeUpdateId } = useSelector((state) => state.comments)
 
    const dispatch = useDispatch()
    const truncateText = useTruncation()
    const fetchPost = async ()=>{
      //  const req= await getDoc(doc(db,`posts/${postId}`))
      setCompLoad(true)
      const unSubscribe=onSnapshot(doc(db,`posts/${postId}`),(snapshot)=>{
        getDoc(doc(db,`posts/${snapshot.id}`)).then((res)=>{
          setPost(res.data())
          setCompLoad(false)
        })
      })
      return ()=>unSubscribe()
      //  setPost(req.data())
      }
      
    useEffect(()=>{
      fetchPost()
    },[])
    const target = useRef()
    const rootElem = useRef()
    const handleChange = (e) => {
      setComment_text(e.target.value)
    }
    let q = query(
      collection(db, `/posts/${postId}/comments`),
      orderBy('createdAt', "desc"),
      limit(3)
    )
    useEffect(() => {
      
      const getSnapshot = onSnapshot(q, (querySnapShot) => {
        if (!querySnapShot.empty) {
          const cmt = []
          querySnapShot.forEach((dat) => {
            cmt.push({ ...dat.data(), id: dat.id })
          })
          // setLastVisible(querySnapShot.docs[querySnapShot.docs.length - 1])
          setComments(cmt)
          // setLoading(false)
          // setHasMorePages(true)
        }
      })
      return ()=>getSnapshot()
    },
    [])

    const next = query(
      collection(db,`/posts/${postId}/comments` ),
      orderBy('createdAt', 'desc'),
      startAfter(comments[comments.length - 1]?.createdAt || 0),
      limit(3)
    )
    
      useInfiniteScroll_realtime(comments,target,setComments,next,rootElem?.current,commtMemo,setLoading)

  
    const sliceMedia = post?.media.slice(0, 4)
    const handleLike = usePostLike(
      post,
      `posts`,
      postId,
      doc(db, 'posts', postId),
      setLikeLoad
    )
    const handleLikedByList = useLikeModal()
    const handleGallery = (index) => {
      // if (position === 0) setShowLeft(false)
      setShowGallery(true)
  
      setGalleryImg(post?.media[index])
    }

    const handleKeyDownComments = (e) => {
      e.target.style.height = 'inherit'
      e.target.style.height = `${e.target.scrollHeight}px`
    }
    const postRef = collection(db, 'posts')
    const docRef = doc(db, 'posts', postId)
    const handleCommentSubmit = async (e) => {
      e.preventDefault()
      setCommentPostLoad(true)
      if (updateFlag) {
        comments.map(async (commt) => {
          if (commt.updateFlag_id === activeUpdateId) {
            await updateDoc(doc(docRef, 'comments', commt?.id), {
              body: comment_text,
            })
          }
          dispatch(setActiveUpdateId(null))
          dispatch(setUpdateFlag(false))
        })
        setComment_text('')
      } else {
        const {
          isOnline,
          avatarPath,
          createdAt,
          email,
          friendsList,
          avatar,
          name,
          id,
          ...others
        } = user
        await addDoc(collection(postRef, postId, 'comments'), {
          ...others,
          author_name: user?.name,
          author_id: auth.currentUser.uid,
          parent_id: postId,
          avatar: user?.avatar,
          avatarPath: user?.avatarPath,
          createdAt: Timestamp.fromDate(new Date()),
          reactions: [],
          reaction_count: 0,
          likedBy: [],
          replies_count: 0,
          body: comment_text,
          updateFlag_id: v4(),
        })
        await getDocs(collection(db, 'posts')).then((snapshot) => {
          snapshot.forEach(async (snap) => {
            if (snap.id === postId) {
              await updateDoc(doc(db, 'posts', snap.id), {
                comment_count: increment(1),
              })
            }
          })
        })
        setComment_text('')
      }
      setCommentPostLoad(false)
    }
    const filterIds = post?.likedBy.map((element) => {
      return element.uid
    })
    console.log(loading);
  return <section className={styles.main_thread}>
    <div className={styles.post_container}>
      
      <>
      <div className={styles.header}>
       <Link to={`/home`}>
           <FontAwesomeIcon icon={faArrowLeft}/>
       </Link>
       <h3>{post&&`${post?.author_name}'s post`}</h3>
       
   </div>
   <div className={styles.post_proper} ref={rootElem}>
            {compLoad?<h1>Loading...</h1>:<>
            <div className={styles.user}>
        <img src={post?.avatar || `/user.png`} alt='profile__pics' />

        <div className={styles.name__time}>
          <Link to={`/about/${post?.author_id}`}>
            {post?.author_name}{' '}
            <span>
              {post?.owner && (
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  color='#0a66c2'
                  size='xs'
                />
              )}
            </span>
          </Link>
          <small>{moment(post?.createdAt.toDate()).fromNow(true)}</small>
        </div>

      </div>
      {post?.body?<div className={styles.post__msg}>
    <p>{truncateText(post?.body,80)}</p>
   </div>:null}
   {post?.media.length ? (
        <div className={styles.gallery__container}>
          <div
            className={
              post?.media.length >= 4
                ? styles.post__img
                : styles.post__img__three__col
            }>
            {sliceMedia.map((media, i) =>
              media?.type === 'video/mp4' ? (
                <ReactPlayer
                  url={media.url}
                  controls
                  key={i}
                  autoPlay={false}
                  width={`100%`}
                  height={`100%`}
                />
              ) : (
                <img
                  key={i}
                  src={media?.url}
                  alt='post__img'
                  loading='lazy'
                  onClick={() => handleGallery(i)}
                />
              )
            )}
          </div>
          {post?.media.length - sliceMedia.length > 0 ? (
            <p className={styles.more_imgs}>
              +{post?.media.length - sliceMedia.length}
            </p>
          ) : null}
        </div>
      ) : null} 
      <div className={styles.like__comment__count}>
        <p onClick={() => handleLikedByList(post?.likedBy)}>
          {post?.reaction_count > 0 ? (
            <>
              {' '}
              {post?.reaction_count}{' '}
              <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
            </>
          ) : null}
        </p>
        {post?.comment_count > 0 ? (
          <p>
            {post.comment_count}{' '}
            {post.comment_count > 1 ? 'comments' : 'comment'}
          </p>
        ) : null}
      </div>
      <div className={styles.cta}>
        <ul className={styles.cta__list}>
          <li onClick={handleLike}>
            {likeLoad ? (
              <div className={styles.comment__load}>
                <FontAwesomeIcon icon={faSpinner} />
              </div>
            ) : filterIds?.includes(user?.id) ? (
              <>
                <FontAwesomeIcon icon={faThumbsUp} color='#0a66c2' />
              </>
            ) : (
              <>
                {' '}
                <FontAwesomeIcon icon={faThumbsUp} />
                <p>Like</p>
              </>
            )}
          </li>
          <li>
            <label htmlFor='post_comment'>
            <FontAwesomeIcon icon={faComment} />
            <p>Comment</p>
            </label>
          </li>
       
          <li>
            <FontAwesomeIcon icon={faPaperPlane} />
            <p>Send</p>
          </li>
        </ul>
      </div>
      
      {comments.length ? (
            comments?.map((commt) => (
              <div
                key={commt?.id}
                className={commentPostLoad ? styles.comment_opaque : ''}>
                {' '}
                <CommentMemo
                  commt={commt}
                  setComment_text={setComment_text}
                  post={post}
                  commentPostLoad={commentPostLoad}
                  postId={postId}
                />
              </div>
            ))
          ) : (
            <div className={styles.nil}>
              <FontAwesomeIcon icon={faComment} />
              <p>No comments yet</p>
              <p>be the first to comment</p>
            </div>
          )}
           {loading&&comments.length?<div className={styles.more_comments}>
                getting more comments..
              </div>:null}
            </>}
            {/* {loading?<div className={styles.spinner}>
                <FontAwesomeIcon icon={faSpinner} />
              </div>:null} */}
             
           <div ref={target} className={styles.target}>.</div>
   </div>
   
   
   <div className={styles.post__comment}>
            <div className={styles.img__container__comments}>
              <img src={user.avatar || `user.png`} alt='' />
            </div>
            <form onSubmit={handleCommentSubmit}>
              <div className={styles.text__area__container}>
                <textarea
                  placeholder='Add a Comment'
                  value={comment_text}
                  name='comment'
                  id='post_comment'
                  onKeyDown={handleKeyDownComments}   onChange={handleChange}
                  ></textarea>
                {/* <FontAwesomeIcon icon={faImage} /> */}
              </div>
              
              {comment_text.length > 1 && (
                <button
                  type='submit'
                  className={styles.button__blue}
                  disabled={commentPostLoad ? true : false}>
                  {commentPostLoad ? (
                    <FontAwesomeIcon
                      className={styles.spinner}
                      icon={faCircleNotch}
                    />
                  ) : (
                    `Post`
                  )}
                </button>
              )}
            </form>
          </div>
      </>
      {showGallery && (
        <Gallery
          setShowGallery={setShowGallery}
          galleryImg={galleryImg}
          post={post}
          setGalleryImg={setGalleryImg}
        />
      )}
     
    </div>
 </section>
 
}

export default MainPostContent