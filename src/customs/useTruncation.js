import React, { useState } from 'react'

function useTruncation() {
  const [isClicked, setisClicked] = useState(false)
  const truncateText = (string, n) => {
    if (isClicked) {
      return <span>{string}</span>
    } else {
      return (
        <>
          {string?.slice(0, n)}
          <span
            onClick={() => setisClicked(true)}
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
              display: 'inline-block',
              marginLeft: 5,
            }}>
            {string?.length > n ? `...See more` : null}
          </span>
        </>
      )
    }
  }
  return truncateText
}

export default useTruncation
