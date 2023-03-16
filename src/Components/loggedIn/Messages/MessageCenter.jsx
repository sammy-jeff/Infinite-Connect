import React from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import MessageBody from './MessageBody'
import MessageForm from './MessageForm'
import MessageHead from './MessageHead'

function MessageCenter() {
  const [ setImg,
    setText,
    handleSubmit,
    text,
    user1,
  
    msgLoad,
    imgLoad,
    msgImg,] = useOutletContext()
    const {msgId} = useParams()
  return (
    <>
      <MessageHead />
      <MessageBody user1={user1} imgLoad={imgLoad} msgId={msgId} />
      <MessageForm
        setImg={setImg}
        setText={setText}
        handleSubmit={handleSubmit}
        text={text}
        msgLoad={msgLoad}
        ImgLoad={imgLoad}
      />
    </>
  )
}

export default MessageCenter
