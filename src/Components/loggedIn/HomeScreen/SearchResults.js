import {
  faCheckCircle,
  faPaperPlane,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from '../../../CSS/loggedInCss/searchResults.module.css'
import useSelectUser from '../../../customs/useSelectUser'
import { setUsers } from '../../../features/userSlice'
import { auth, db } from '../../../firebase'
function SearchResults({ searchText, setSearchText }) {
  const { users } = useSelector((state) => state.user.value)

  const [filteredSearch, setFilteredSearch] = useState([])
  const [width, setWidth] = useState(window.innerWidth)

  const dispatch = useDispatch()
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userArr = []
        const getSnapshot = await getDocs(collection(db, 'users'))
        getSnapshot.forEach((snap) => {
          userArr.push(snap.data())
        })
        dispatch(setUsers(userArr))
      } catch (error) {
        alert(error)
      }
    }
    getUsers()
    // eslint-disable-next-line
  }, [])
  const selectUser = useSelectUser()
  const handleSend = (res) => {
    selectUser(res, width)
    setSearchText('')
  }
  useEffect(() => {
    const fil = []
    const reg = new RegExp(searchText, 'gi')
    // eslint-disable-next-line
    users.filter((user) => {
      const test = reg.test(user?.name)
      if (test && searchText.length !== 0) fil.push(user)
    })
    setFilteredSearch(fil)
    // eslint-disable-next-line
  }, [searchText])

  return (
    <div className={styles.searchResults}>
      {searchText.length === 0 || !filteredSearch.length ? (
        <div className={styles.no_result}>
          <FontAwesomeIcon icon={faSearch} /> <span>No Match Found</span>
        </div>
      ) : (
        filteredSearch.map((res) => {
          return (
            <div key={res?.id} className={styles.singleResult}>
              <p>
                {res?.name}{' '}
                <span>
                  {res?.owner && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color='#0a66c2'
                      size='xs'
                    />
                  )}
                </span>
              </p>
              <Link to='/messaging'>
                {res?.id !== auth.currentUser.uid ? (
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    onClick={() => handleSend(res)}
                  />
                ) : null}
              </Link>
            </div>
          )
        })
      )}
    </div>
  )
}

export default SearchResults
