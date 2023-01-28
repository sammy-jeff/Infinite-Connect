import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'
import { setBadge, setChat, setId, setShowMsg } from '../features/chatGlobal'
import { auth, db } from '../firebase'

function useSelectUser() {
  const user1 = auth.currentUser.uid
  const dispatch = useDispatch()
  const breakPoint = 700
  const selectUser = async (user, width) => {
    dispatch(setId(user.id))
    if (width <= breakPoint) dispatch(setShowMsg(true))
    dispatch(setChat(user))
    const user2 = user.id
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    const docSnap = await getDoc(doc(db, 'lastMsg', id))
    if (docSnap.data()?.from !== user1 && docSnap.exists()) {
      await updateDoc(doc(db, 'lastMsg', id), {
        unread: false,
      })
    }
  }
  return selectUser
}

export default useSelectUser
