import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { auth, db, storage } from '../firebase'
import { toast } from 'react-toastify'
function useProfilePicUpload(img, setImg, setLoading) {
  const { user } = useSelector((state) => state.user.value)
  const isMounted = useRef()

  useEffect(() => {
    isMounted.current = true

    if (isMounted.current && img) {
      const uploadImg = async () => {
        setLoading(true)

        const imgRef = ref(storage, `avatar/${img.name + new Date().getTime()}`)
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath))
          }
          await uploadBytes(imgRef, img).then(async (snap) => {
            const getDownloadLink = await getDownloadURL(
              ref(storage, snap.ref.fullPath)
            )
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
              avatar: getDownloadLink,
              avatarPath: snap.ref.fullPath,
            })

            await getDocs(collection(db, 'posts')).then((res) => {
              res.forEach(async (post) => {
                if (
                  post.data().author_id === auth.currentUser.uid &&
                  post.exists()
                ) {
                  await updateDoc(doc(db, `posts/${post.id}`), {
                    avatar: getDownloadLink,
                    avatarPath: snap.ref.fullPath,
                  })
                }
                await getDocs(collection(db, `posts/${post.id}/comments`)).then(
                  (resComm) => {
                    resComm.forEach(async (commt) => {
                      if (commt.data().author_id === auth.currentUser.uid) {
                        await updateDoc(
                          doc(db, `posts/${post.id}/comments/${commt.id}`),
                          {
                            avatar: getDownloadLink,
                            avatarPath: snap.ref.fullPath,
                          }
                        )
                      }
                      await getDocs(
                        collection(
                          db,
                          `posts/${post.id}/comments/${commt.id}/replies`
                        )
                      ).then((resRepl) => {
                        resRepl.forEach(async (repl) => {
                          if (
                            repl.data().author_id === auth.currentUser.uid &&
                            repl.exists()
                          ) {
                            await updateDoc(
                              doc(
                                db,
                                `posts/${post.id}/comments/${commt.id}/replies/${repl.id}`
                              ),
                              {
                                avatar: getDownloadLink,
                                avatarPath: snap.ref.fullPath,
                              }
                            )
                          }
                        })
                      })
                    })
                  }
                )
              })
            })
            // update avatar for post(user) Images here
            toast.success('Profile picture uploaded successfully', {
              delay: 2000,
              position: 'bottom-right',
            })
            setLoading(false)
            setImg(null)
          })
        } catch (error) {
          toast.error(error, { delay: 2000, position: 'bottom-right' })
          setLoading(false)
        }
      }
      uploadImg()
    }
    isMounted.current = false
    return ()=>isMounted.current
    // eslint-disable-next-line
  }, [img])
}

export default useProfilePicUpload
