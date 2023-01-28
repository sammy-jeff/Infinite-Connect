import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
  user: null,
  isLoading: false,
}
const userSlice = createSlice({
  name: 'user',
  initialState: { value: initialState },
  reducers: {
    setUsers(state, { payload }) {
      state.value.users = payload
    },
    setUser(state, { payload }) {
      state.value.user = payload
    },
    setLoading(state, { payload }) {
      state.value.isLoading = payload
    },
  },
})
export const { setUser, setLoading, setUsers } = userSlice.actions
export default userSlice.reducer
