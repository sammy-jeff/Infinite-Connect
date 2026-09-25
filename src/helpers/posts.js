import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { toast } from 'react-toastify'
import { db, storage } from '../firebase'

export const isVideo = (media) => !!media?.type?.startsWith('video/')

export const threadPath = (post) =>
  `/home/${encodeURIComponent(post.author_name || 'post')}/thread/${post.id}`

// Uses the native share sheet on mobile, falls back to copying the link.
export async function sharePost(post) {
  const url = `${window.location.origin}${threadPath(post)}`
  const title = `${post.author_name}'s post on Infinite-Connect`
  try {
    if (navigator.share) {
      await navigator.share({ title, text: post.body?.slice(0, 100), url })
      return
    }
    await navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard', { position: 'bottom-right' })
  } catch (error) {
    if (error?.name !== 'AbortError') {
      toast.error('Could not share this post', { position: 'bottom-right' })
    }
  }
}

// Deletes a post, then (best effort) its comments, their replies and its media.
export async function deletePostThread(post) {
  const postRef = doc(db, 'posts', post.id)
  await deleteDoc(postRef)

  const comments = await getDocs(collection(postRef, 'comments'))
  const replies = await Promise.all(
    comments.docs.map((comment) => getDocs(collection(comment.ref, 'replies')))
  )
  await Promise.allSettled([
    ...replies.flatMap((snap) => snap.docs.map((d) => deleteDoc(d.ref))),
    ...comments.docs.map((d) => deleteDoc(d.ref)),
    ...(post.media || []).map((media) => deleteObject(ref(storage, media.url))),
  ])
}
