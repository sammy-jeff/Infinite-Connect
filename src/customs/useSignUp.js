import { applyActionCode, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth, db } from '../firebase';
import { setLoading } from '../features/userSlice';
import { setIsLoadingAuth, setIsprofileCompleted } from '../features/userAuth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function useSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const handleSignUp = async (name, email, password,setVerificationMessage,setErrorMessage) => {
    if (!name || !email || !password) return;

    try {
      dispatch(setIsLoadingAuth(true));
      dispatch(setLoading(true));

      const createUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(createUser.user)
      .then(async ()=>{
        setVerificationMessage("Verification link has been sent to your email")
        await setDoc(doc(db, 'users', createUser.user.uid), {
          name: name,
          email: email,
          friendsList: [createUser.user.uid],
          id: createUser.user.uid,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
          avatar: '',
          avatarPath: '',
        });
  
        dispatch(setIsLoadingAuth(false));
      }).catch(error=>{
        throw new Error(error)
      })
    
      
      // dispatch(setLoading(false));
      // navigate('/home', { replace: true });
      // dispatch(setIsprofileCompleted(true));
    } catch (error) {
      dispatch(setIsLoadingAuth(false));
      setErrorMessage(error?.message)
      dispatch(setLoading(false));
    }
  };

  return handleSignUp;
}

export default useSignUp;