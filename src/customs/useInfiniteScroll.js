import { useEffect, useRef } from 'react'

// Calls onLoadMore whenever the sentinel element comes within `rootMargin` of the
// scroll root. Re-observing after every page means a short list keeps filling
// until it overflows the viewport, and the generous margin prefetches the next
// page before the user actually reaches the end.
function useInfiniteScroll(
  sentinelRef,
  onLoadMore,
  { enabled = true, rootRef, rootMargin = '400px' } = {}
) {
  const callback = useRef(onLoadMore)
  callback.current = onLoadMore

  useEffect(() => {
    const el = sentinelRef.current
    if (!enabled || !el) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          callback.current()
        }
      },
      { root: rootRef?.current || null, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, sentinelRef, rootRef, rootMargin])
}

export default useInfiniteScroll
