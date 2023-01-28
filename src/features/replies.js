import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  replies: [],
  isLoading: false,
  updateFlagRepl: false,
  activeUpdateIdRepl: null,
}

const replies = createSlice({
  name: 'replies',
  initialState,
  reducers: {
    setReplies: (state, action) => {
      state.replies = action.payload
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload
    },
    setUpdateFlagRepl(state, { payload }) {
      state.updateFlagRepl = payload
    },
    setActiveUpdateIdRepl(state, { payload }) {
      state.activeUpdateIdRepl = payload
    },
  },
})
export const {
  setReplies,
  setIsLoading,
  setActiveUpdateIdRepl,
  setUpdateFlagRepl,
} = replies.actions
export default replies.reducer
