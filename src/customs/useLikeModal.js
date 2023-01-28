import { useDispatch } from 'react-redux'
import { setIsModalOpen, setLikedByList } from '../features/likedBy'
function useLikeModal() {
  const dispatch = useDispatch()
  const handleLikedByList = (list) => {
    if (list.length < 1) return
    dispatch(setIsModalOpen(true))
    dispatch(setLikedByList(list))
  }
  return handleLikedByList
}

export default useLikeModal
