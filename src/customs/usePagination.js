import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebase'

function usePagination(
  path,
  setHasMorePages,
  setArticleChild,
  articleChild,
  pageSize,
  order,
  setLoading
) {
  const [lastVisible, setLastVisible] = useState(null)

  let q = query(
    collection(db, path),
    orderBy('createdAt', order),
    limit(pageSize)
  )

  useEffect(() => {
    setLoading(true)
    const getSnapshot = onSnapshot(q, (querySnapShot) => {
      if (!querySnapShot.empty) {
        const cmt = []
        querySnapShot.forEach((dat) => {
          cmt.push({ ...dat.data(), data_id: dat.id })
        })
        setLastVisible(querySnapShot.docs[querySnapShot.docs.length - 1])
        setArticleChild(cmt)
        setLoading(false)
        setHasMorePages(true)
      }
    })

    return () => getSnapshot()
    // eslint-disable-next-line
  }, [])
  const paginatedFunc = (pageSize_paginated) => {
    setLoading(true)
    const next = query(
      collection(db, path),
      orderBy('createdAt', order),
      startAfter(lastVisible || 0),
      limit(pageSize_paginated)
    )

    const getSnapshot = onSnapshot(
      next,
      { includeMetadataChanges: false },
      (docSnap) => {
        let cmt = []
        if (!docSnap.empty) {
          docSnap.forEach((snap) => {
            cmt.push({ ...snap.data(), data_id: snap.id })
          })

          setArticleChild([...articleChild, ...cmt])
          setLoading(false)
          if (docSnap?.docs[docSnap.docs.length - 1]) {
            setLastVisible(docSnap.docs[docSnap.docs.length - 1])
          }
        }
        if (docSnap.docs.length < pageSize_paginated) setHasMorePages(false)
        if (docSnap.empty) {
          setHasMorePages(false)
        }
      }
    )

    return () => getSnapshot()
  }
  return paginatedFunc
}

export default usePagination
