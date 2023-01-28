import { sendPasswordResetEmail } from 'firebase/auth'

import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

function useResetPassword() {
  const navigate = useNavigate()
  const resetPassword = async (e, email, setEmail) => {
    e.preventDefault()
    if (!email) return
    try {
      await sendPasswordResetEmail(auth, email)
      setEmail('')
      alert(
        'Password reset email sent, check your inbox or spam folder for reset code'
      )
      navigate('/')
    } catch (error) {
      alert(error)
    }
  }
  return resetPassword
}

export default useResetPassword
