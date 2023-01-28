import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  likedByList: [],
  isModalOpen: false,
}
const likedBySlice = createSlice({
  name: 'likedByModal',
  initialState,
  reducers: {
    setLikedByList(state, { payload }) {
      state.likedByList = payload
    },
    setIsModalOpen(state, { payload }) {
      state.isModalOpen = payload
    },
  },
})
export const { setIsModalOpen, setLikedByList } = likedBySlice.actions
export default likedBySlice.reducer
