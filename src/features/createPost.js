import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	postModal: false,
}

const postSlice = createSlice({
	name: 'postModal',
	initialState,
	reducers: {
		showPost: (state, action) => {
			state.postModal = action.payload
		},
	},
})
export const { showPost } = postSlice.actions
export default postSlice.reducer
