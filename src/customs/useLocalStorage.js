import { useEffect, useRef } from 'react'

function useLocalStorage(stateStr, state, disptch) {
  const isMounted = useRef(false)
  useEffect(() => {
    if (isMounted.current) localStorage.setItem(stateStr, JSON.stringify(state))
    isMounted.current = true
    // eslint-disable-next-line
  }, [state])
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(stateStr))
    if (data !== null) disptch(data)
    // eslint-disable-next-line
  }, [])
}

export default useLocalStorage
