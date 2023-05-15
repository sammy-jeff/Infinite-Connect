import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChat } from '../features/chatGlobal'
import { setIsprofileCompleted, setUserAuth } from '../features/userAuth'
import { setUser } from '../features/userSlice'
import { auth, db } from '../firebase'

function useStateChange() {
  // const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (cUser) => {
      if (cUser&&cUser?.emailVerified) {
        dispatch(setUserAuth(cUser))
        onSnapshot(doc(db, 'users', cUser.uid), () => {
          getDoc(doc(db, 'users', cUser.uid))
            .then((snapShot) => {
              const data = snapShot.data()
              dispatch(setUser({ ...data, id: snapShot.id }))
              return snapShot
            })
            .then((res) => {
              if (!cUser) {
                return
              } else return res
            })
            .then((res) => {
              if (
                !res?.data()?.education &&
                !res?.data()?.work &&
                !res?.data()?.about
              ) {
                dispatch(setIsprofileCompleted(true))
              } else {
                dispatch(setIsprofileCompleted(false))
              }
            })
        })

        // navigate('/home', { replace: true })
      } else {
        dispatch(setUser(null))
        dispatch(setChat(null))
        dispatch(setUserAuth(null))
      }
      console.log(cUser)
    })
    return () => {
      return unSubscribe
    }
  }, [dispatch])
}

export default useStateChange
