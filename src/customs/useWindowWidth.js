import { useEffect, useState } from 'react'

// Tracks window.innerWidth, throttled to one update per animation frame.
// The listener is removed on unmount (the inline arrow-function listeners this
// replaces could never be removed and leaked on every mount).
function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth)

  useEffect(() => {
    let frame
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setWidth(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return width
}

export default useWindowWidth
