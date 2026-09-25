import { doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { auth, db, storage } from '../firebase'
import { updateAuthoredContent } from '../helpers/authoredContent'

function useDeleteProfilePic() {
  const { user } = useSelector((state) => state.user.value)
  const deleteProfilePics = async () => {
    if (!user?.avatar || !window.confirm('Delete image?')) return
    try {
      const fields = { avatar: '', avatarPath: '' }
      await updateDoc(doc(db, 'users', auth.currentUser.uid), fields)
      await updateAuthoredContent(auth.currentUser.uid, fields)
      if (user.avatarPath) {
        deleteObject(ref(storage, user.avatarPath)).catch(() => {})
      }
      toast.success('Image Deleted Successfully', {
        delay: 2000,
        position: 'bottom-right',
      })
    } catch (error) {
      toast.error('Could not delete image', {
        delay: 2000,
        position: 'bottom-right',
      })
    }
  }
  return deleteProfilePics
}

export default useDeleteProfilePic
