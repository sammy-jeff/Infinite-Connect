import { onSnapshot } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

function useInfiniteScroll_realtime(
  data,
  pageEnd,
  setData,
  next,
  rootElem,
  article,
  setLoading
) {
  const [intersectionTracker, setIntersectionTracker] = useState(false)

  const isMounted = useRef(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const scroll = (observer) => {
      setLoading(true)
      const getSnapshot = onSnapshot(next, (querySnapShot) => {
        let dataAdd = []
        if (!querySnapShot?.empty) {
          querySnapShot.forEach((snapshot) => {
            dataAdd.push({ ...snapshot.data(), id: snapshot.id })
          })
          dispatch(setData([...data, ...dataAdd]))
          // setPostSnapShot(postSnapShot.docs.length)
        }
        if (querySnapShot.empty) {
          setLoading(false)
          observer?.unobserve(pageEnd?.current)
        }
      })

      return () => getSnapshot()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (isMounted.current) {
          if (entries[0].isIntersecting) {
            setIntersectionTracker(true)
            scroll(observer)
          } else {
            setIntersectionTracker(false)
          }
        }
      },
      { threshold: 0.4, root: rootElem || null }
    )
      if (!pageEnd?.current) {
        return
      }
    observer?.observe(pageEnd?.current)
    isMounted.current = true

    return () => observer.disconnect()
    // eslint-disable-next-line
  }, [intersectionTracker, article,pageEnd])
}

export default useInfiniteScroll_realtime
