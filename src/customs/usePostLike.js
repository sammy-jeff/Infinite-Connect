import { collection, getDocs, increment, setDoc } from 'firebase/firestore'

import { useSelector } from 'react-redux'
import { auth, db } from '../firebase'

function usePostLike(article, articleStr, id, docLike, setLikeLoad) {
  const { user } = useSelector((state) => state.user.value)
  const filterIds = article.likedBy.map((element) => {
    return element.uid
  })
  const handleLike = async () => {
    const likedByArr = []
    setLikeLoad(true)
    if (!filterIds.includes(user?.id)) {
      await getDocs(collection(db, 'users')).then((snapShot) => {
        snapShot.forEach((snap) => {
          if (snap.data().id === auth.currentUser.uid)
            likedByArr.push({ act_name: snap.data().name, uid: snap.id })
        })
      })
      const index = likedByArr.findIndex((element) => {
        if (element.uid === user?.id) {
          return true
        }
        return false
      })

      if (!index) {
        await getDocs(collection(db, articleStr)).then((snapShot) => {
          snapShot.forEach(async (snap) => {
            if (id === snap.id) {
              await setDoc(
                docLike,
                {
                  reaction_count: increment(1),
                  likedBy: [...article.likedBy, ...likedByArr],
                },
                { merge: true }
              )
            }
          })
        })
      }
    } else {
      const removedLike = article.likedBy.filter(
        (liked) => liked.uid !== user?.id
      )
      await getDocs(collection(db, articleStr)).then((snapShot) => {
        snapShot.forEach(async (snap) => {
          if (id === snap.id) {
            await setDoc(
              docLike,
              {
                reaction_count: article.reaction_count > 0 ? increment(-1) : 0,
                likedBy: [...removedLike],
              },
              { merge: true }
            )
          }
        })
      })
    }
    setLikeLoad(false)
  }
  return handleLike
}

export default usePostLike
