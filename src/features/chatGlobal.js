import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chat: null,
  chatLoading: false,
  showMsg: false,
  id: null,
  badge: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat(state, { payload }) {
      state.chat = payload
    },
    setChatLoading(state, { payload }) {
      state.chatLoading = payload
    },
    setShowMsg(state, { payload }) {
      state.showMsg = payload
    },
    setId(state, { payload }) {
      state.id = payload
    },
    setBadge(state, { payload }) {
      state.badge = payload
    },
  },
})
export const { setChat, setChatLoading, setShowMsg, setId, setBadge } =
  chatSlice.actions
export default chatSlice.reducer
