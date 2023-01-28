import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	messages: [],
}

const messages = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		setMessages: (state, action) => {
			state.messages = action.payload
		},
	},
})
export const { setMessages } = messages.actions
export default messages.reducer
