import { doc, updateDoc } from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { auth, db, storage } from '../firebase'
import { toast } from 'react-toastify'
import { updateAuthoredContent } from '../helpers/authoredContent'

function useProfilePicUpload(img, setImg, setLoading) {
  const { user } = useSelector((state) => state.user.value)

  useEffect(() => {
    if (!img) return
    const uploadImg = async () => {
      setLoading(true)
      const imgRef = ref(storage, `avatar/${img.name + new Date().getTime()}`)
      try {
        const snap = await uploadBytes(imgRef, img)
        const avatar = await getDownloadURL(snap.ref)
        const fields = { avatar, avatarPath: snap.ref.fullPath }
        const previousPath = user?.avatarPath

        await updateDoc(doc(db, 'users', auth.currentUser.uid), fields)
        await updateAuthoredContent(auth.currentUser.uid, fields)
        if (previousPath) {
          deleteObject(ref(storage, previousPath)).catch(() => {})
        }
        toast.success('Profile picture uploaded successfully', {
          delay: 2000,
          position: 'bottom-right',
        })
      } catch (error) {
        toast.error('Could not upload profile picture', {
          delay: 2000,
          position: 'bottom-right',
        })
      } finally {
        setLoading(false)
        setImg(null)
      }
    }
    uploadImg()
    // eslint-disable-next-line
  }, [img])
}

export default useProfilePicUpload
