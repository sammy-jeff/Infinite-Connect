import React from 'react'
import MessageBody from './MessageBody'
import MessageForm from './MessageForm'
import MessageHead from './MessageHead'

function MessageCenter({
  setImg,
  setText,
  handleSubmit,
  text,
  user1,

  msgLoad,
  imgLoad,
  msgImg,
}) {
  return (
    <>
      <MessageHead />
      <MessageBody user1={user1} imgLoad={imgLoad} />
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
