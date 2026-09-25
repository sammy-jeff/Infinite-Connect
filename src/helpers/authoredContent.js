import {
  collection,
  collectionGroup,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

// Walks every post -> comment -> reply. Only used when the collection-group
// queries below are unavailable (they need a collection-group index exemption on
// `author_id` for `comments` and `replies` in the Firebase console).
async function scanAuthoredThreads(uid) {
  const posts = await getDocs(collection(db, 'posts'))
  const comments = (
    await Promise.all(
      posts.docs.map((post) => getDocs(collection(post.ref, 'comments')))
    )
  ).flatMap((snap) => snap.docs)
  const replies = (
    await Promise.all(
      comments.map((comment) => getDocs(collection(comment.ref, 'replies')))
    )
  ).flatMap((snap) => snap.docs)
  return [...comments, ...replies].filter(
    (docSnap) => docSnap.data().author_id === uid
  )
}

async function findAuthoredThreads(uid) {
  try {
    const [comments, replies] = await Promise.all(
      ['comments', 'replies'].map((group) =>
        getDocs(query(collectionGroup(db, group), where('author_id', '==', uid)))
      )
    )
    return [...comments.docs, ...replies.docs]
  } catch (error) {
    return scanAuthoredThreads(uid)
  }
}

// Copies `fields` (e.g. a new avatar) onto every post, comment and reply the user
// wrote. Lookups and writes run in parallel instead of one by one.
export async function updateAuthoredContent(uid, fields) {
  const [posts, threads] = await Promise.all([
    getDocs(query(collection(db, 'posts'), where('author_id', '==', uid))),
    findAuthoredThreads(uid),
  ])
  await Promise.allSettled(
    [...posts.docs, ...threads].map((docSnap) => updateDoc(docSnap.ref, fields))
  )
}
