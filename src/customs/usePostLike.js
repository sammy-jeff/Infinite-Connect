import { arrayRemove, arrayUnion, increment, updateDoc } from 'firebase/firestore'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

// Toggles the current user's like on a post, comment or reply with a single write.
// Firestore's latency compensation updates every listener immediately, so the
// like shows up instantly without waiting for the server round-trip.
function usePostLike(article, docRef) {
  const { user } = useSelector((state) => state.user.value)
  const busy = useRef(false)
  const likedBy = article?.likedBy || []
  const liked = likedBy.some((element) => element.uid === user?.id)

  const toggleLike = async () => {
    if (!user || !article || busy.current) return
    busy.current = true
    try {
      const mine = likedBy.filter((element) => element.uid === user.id)
      if (mine.length) {
        await updateDoc(docRef, {
          likedBy: arrayRemove(...mine),
          reaction_count: increment(-mine.length),
        })
      } else {
        await updateDoc(docRef, {
          likedBy: arrayUnion({ act_name: user.name, uid: user.id }),
          reaction_count: increment(1),
        })
      }
    } catch (error) {
      toast.error('Could not update like, please try again', {
        position: 'bottom-right',
      })
    } finally {
      busy.current = false
    }
  }

  return { liked, toggleLike }
}

export default usePostLike
