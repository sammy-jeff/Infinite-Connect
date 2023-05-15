import { sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { useDispatch, } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsLoadingAuth,} from '../features/userAuth'
import { auth, db } from '../firebase'

function useSignIn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignIn = async (email, password,setErrorMessage) => {
 
    if (!email || !password) return
    try {
      dispatch(setIsLoadingAuth(true))

      await signInWithEmailAndPassword(auth, email, password)
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: true,
      })

      dispatch(setIsLoadingAuth(false))
      if (!auth?.currentUser.emailVerified) {
        await sendEmailVerification(auth?.currentUser).then(()=>{
          alert("Check your email to verify account")
        })
        navigate(`/signIn`,{replace:true})
      }
      else{
        window.location.reload()
      }
      
    } catch (error) {
      dispatch(setIsLoadingAuth(false))
      setErrorMessage(error?.message)
    }
  }
  return handleSignIn
}

export default useSignIn
