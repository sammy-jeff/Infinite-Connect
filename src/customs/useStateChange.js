import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setChat } from '../features/chatGlobal'
import { setIsprofileCompleted, setUserAuth } from '../features/userAuth'
import { setUser } from '../features/userSlice'
import { auth, db } from '../firebase'

function useStateChange() {
  const dispatch = useDispatch()

  useEffect(() => {
    let unsubscribeUser = () => {}
    const unsubscribeAuth = onAuthStateChanged(auth, (cUser) => {
      // drop the previous account's profile listener before starting a new one
      unsubscribeUser()
      unsubscribeUser = () => {}

      if (cUser && cUser?.emailVerified) {
        dispatch(setUserAuth(cUser))
        // the snapshot already carries the profile, no extra getDoc needed
        unsubscribeUser = onSnapshot(doc(db, 'users', cUser.uid), (snapShot) => {
          const data = snapShot.data()
          dispatch(setUser({ ...data, id: snapShot.id }))
          dispatch(
            setIsprofileCompleted(!data?.education && !data?.work && !data?.about)
          )
        })
      } else {
        dispatch(setUser(null))
        dispatch(setChat(null))
        dispatch(setUserAuth(null))
      }
    })
    return () => {
      unsubscribeAuth()
      unsubscribeUser()
    }
  }, [dispatch])
}

export default useStateChange
