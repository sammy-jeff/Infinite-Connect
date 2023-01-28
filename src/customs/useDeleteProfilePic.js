import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { auth, db, storage } from '../firebase'

function useDeleteProfilePic() {
  const { user } = useSelector((state) => state.user.value)
  const deleteProfilePics = async () => {
    try {
      if (user?.avatar) {
        const confirm = window.confirm('Delete image?')
        if (confirm) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            avatar: '',
            avatarPath: '',
          })
          await getDocs(collection(db, 'posts')).then((res) => {
            res.forEach(async (post) => {
              if (
                post.data().author_id === auth.currentUser.uid &&
                post.exists()
              ) {
                await updateDoc(doc(db, `posts/${post.id}`), {
                  avatar: '',
                  avatarPath: '',
                })
              }
              await getDocs(collection(db, `posts/${post.id}/comments`)).then(
                (resComm) => {
                  resComm.forEach(async (commt) => {
                    if (
                      commt.data().author_id === auth.currentUser.uid &&
                      commt.exists()
                    ) {
                      await updateDoc(
                        doc(db, `posts/${post.id}/comments/${commt.id}`),
                        {
                          avatar: '',
                          avatarPath: '',
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
                        if (repl.data().author_id === auth.currentUser.uid) {
                          await updateDoc(
                            doc(
                              db,
                              `posts/${post.id}/comments/${commt.id}/replies/${repl.id}`
                            ),
                            {
                              avatar: '',
                              avatarPath: '',
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
          toast.success('Image Deleted Successfully', {
            delay: 2000,
            position: 'bottom-right',
          })
          await deleteObject(ref(storage, user.avatarPath))
        }
      }
    } catch (error) {
      toast.error(error, { delay: 2000, position: 'bottom-right' })
    }
  }
  return deleteProfilePics
}

export default useDeleteProfilePic
