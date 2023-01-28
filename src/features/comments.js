import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  comments: [],
  isLoading: false,
  updateFlag: false,
  activeUpdateId: null,
}

const comments = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload
    },
    setIsLoading(state, { payload }) {
      state.isLoading = payload
    },
    setUpdateFlag(state, { payload }) {
      state.updateFlag = payload
    },
    setActiveUpdateId(state, { payload }) {
      state.activeUpdateId = payload
    },
  },
})
export const { setComments, setIsLoading, setUpdateFlag, setActiveUpdateId } =
  comments.actions
export default comments.reducer
