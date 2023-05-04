import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsLoadingAuth, setIsprofileCompleted } from '../features/userAuth'
import { auth, db } from '../firebase'

function useSignIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignIn = async (email, password) => {
 
    if (!email || !password) return
    try {
      dispatch(setIsLoadingAuth(true))

      await signInWithEmailAndPassword(auth, email, password)
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: true,
      })

      dispatch(setIsLoadingAuth(false))
      navigate('/home', { replace: true })
    } catch (error) {
      dispatch(setIsLoadingAuth(false))
      alert(error)
    }
  }
  return handleSignIn
}

export default useSignIn
