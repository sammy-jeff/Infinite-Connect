import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  posts: [],
  isLoading: false,
}

const posts = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload
    },
  },
})
export const { setPosts, setIsLoading } = posts.actions
export default posts.reducer
