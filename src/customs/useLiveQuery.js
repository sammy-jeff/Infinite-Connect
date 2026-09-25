import { limit, onSnapshot, query } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

// Realtime, paginated Firestore query.
//
// Keeps a single listener on `buildQuery()` limited to the current window size and
// grows the window by `pageSize` on every loadMore(). Because there is only ever one
// listener, new, edited and deleted documents are always reflected in place, with no
// duplicates and no leaked listeners. Documents that did not change keep their
// object identity between snapshots, so memoized rows skip re-rendering.
//
// `key` identifies the query (e.g. its path); pass a falsy key to disable it.
function useLiveQuery(key, buildQuery, pageSize) {
  const [windowSize, setWindowSize] = useState({ key, size: pageSize })
  const size = windowSize.key === key ? windowSize.size : pageSize
  const [result, setResult] = useState({
    key: null,
    size: 0,
    items: [],
    hasMore: false,
  })

  useEffect(() => {
    if (!key) return undefined
    return onSnapshot(
      query(buildQuery(), limit(size)),
      (snap) => {
        const changed = new Set(snap.docChanges().map((c) => c.doc.id))
        setResult((prev) => {
          const sameKey = prev.key === key
          const prevById = new Map(
            sameKey ? prev.items.map((item) => [item.id, item]) : []
          )
          const items = snap.docs.map(
            (d) =>
              (!changed.has(d.id) && prevById.get(d.id)) || {
                ...d.data(),
                id: d.id,
              }
          )
          // A cache-only snapshot may be missing documents the server has, so it
          // should not settle the page or decide whether more pages exist.
          const settled = !snap.metadata.fromCache || snap.size >= size
          return {
            key,
            items,
            size: settled ? size : sameKey ? prev.size : 0,
            hasMore: settled ? snap.size >= size : sameKey && prev.hasMore,
          }
        })
      },
      (error) => {
        console.error(error)
        setResult((prev) => ({ ...prev, key, size, hasMore: false }))
      }
    )
    // buildQuery is expected to change only when key does
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, size])

  const loadMore = useCallback(() => {
    setWindowSize((w) => ({
      key,
      size: (w.key === key ? w.size : pageSize) + pageSize,
    }))
  }, [key, pageSize])

  const fresh = !!key && result.key === key
  return {
    items: fresh ? result.items : [],
    initialLoading: !!key && !fresh,
    loading: !!key && (!fresh || result.size !== size),
    hasMore: fresh && result.hasMore,
    loadMore,
  }
}

export default useLiveQuery
