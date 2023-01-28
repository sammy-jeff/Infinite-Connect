import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function PublicRoutes() {
  const { userAuth } = useSelector((state) => state.userAuth)
  return userAuth === null ? <Outlet /> : <Navigate to='home' replace />
}

export default PublicRoutes
