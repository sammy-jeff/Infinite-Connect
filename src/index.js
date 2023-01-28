import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import postReducer from './features/createPost'
import userAuthReducer from './features/userAuth'
import userReducer from './features/userSlice'
import messageReducer from './features/messages'
import appPostReducer from './features/posts'
import commentReducer from './features/comments'
import replyReducer from './features/replies'
import chatReducer from './features/chatGlobal'
import likedByReducer from './features/likedBy'

const store = configureStore({
  reducer: {
    postModal: postReducer,
    userAuth: userAuthReducer,
    user: userReducer,
    messages: messageReducer,
    posts: appPostReducer,
    comments: commentReducer,
    replies: replyReducer,
    chats: chatReducer,
    likedByFeature: likedByReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})
// replace console.* for disable log on production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,

  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
