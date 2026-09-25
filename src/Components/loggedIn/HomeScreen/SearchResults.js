import {
  faCheckCircle,
  faPaperPlane,
  faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from '../../../CSS/loggedInCss/searchResults.module.css'
import useSelectUser from '../../../customs/useSelectUser'
import useWindowWidth from '../../../customs/useWindowWidth'
import { setUsers } from '../../../features/userSlice'
import { auth, db } from '../../../firebase'

const MAX_RESULTS = 8

function SearchResults({ searchText, setSearchText }) {
  const { users } = useSelector((state) => state.user.value)
  const width = useWindowWidth()
  const dispatch = useDispatch()

  // the user directory is fetched once per session and reused for every search
  useEffect(() => {
    if (users.length) return
    getDocs(collection(db, 'users'))
      .then((snapShot) =>
        dispatch(
          setUsers(snapShot.docs.map((snap) => ({ ...snap.data(), id: snap.id })))
        )
      )
      .catch(() => {})
    // eslint-disable-next-line
  }, [])

  const term = searchText.trim().toLowerCase()
  const filteredSearch = useMemo(() => {
    if (!term) return []
    return users
      .filter((user) => user?.name?.toLowerCase().includes(term))
      .sort(
        (a, b) =>
          a.name.toLowerCase().indexOf(term) - b.name.toLowerCase().indexOf(term)
      )
      .slice(0, MAX_RESULTS)
  }, [users, term])

  const selectUser = useSelectUser()
  const handleSend = (res) => {
    selectUser(res, width, res.id)
    setSearchText('')
  }

  const highlight = (name) => {
    const start = name.toLowerCase().indexOf(term)
    if (start < 0) return name
    return (
      <>
        {name.slice(0, start)}
        <mark>{name.slice(start, start + term.length)}</mark>
        {name.slice(start + term.length)}
      </>
    )
  }

  return (
    <div className={styles.searchResults}>
      {!term || !filteredSearch.length ? (
        <div className={styles.no_result}>
          <FontAwesomeIcon icon={faSearch} />{' '}
          <span>{users.length || !term ? 'No Match Found' : 'Searching…'}</span>
        </div>
      ) : (
        filteredSearch.map((res) => {
          return (
            <div key={res?.id} className={styles.singleResult}>
              <Link
                to={`/about/${res.id}`}
                className={styles.person}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setSearchText('')}>
                <img
                  src={res?.avatar || '/user.png'}
                  alt=''
                  loading='lazy'
                  decoding='async'
                />
                <span>
                  {highlight(res?.name)}{' '}
                  {res?.owner && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      color='#0a66c2'
                      size='xs'
                    />
                  )}
                </span>
              </Link>
              {res?.id !== auth.currentUser.uid ? (
                <Link
                  to='/messaging'
                  title={`Message ${res?.name}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSend(res)}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Link>
              ) : null}
            </div>
          )
        })
      )}
    </div>
  )
}

export default SearchResults
