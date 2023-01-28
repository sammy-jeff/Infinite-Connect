import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userAuth: undefined,
  isLoadingAuth: false,
  isProfileCompleted: false,
}

const userAuth = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUserAuth: (state, action) => {
      state.userAuth = action.payload
    },
    setIsLoadingAuth: (state, action) => {
      state.isLoadingAuth = action.payload
    },
    setIsprofileCompleted: (state, action) => {
      state.isProfileCompleted = action.payload
    },
  },
})
export const { setUserAuth, setIsLoadingAuth, setIsprofileCompleted } =
  userAuth.actions
export default userAuth.reducer
