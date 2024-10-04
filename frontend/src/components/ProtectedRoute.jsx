import React from 'react'
import { Outlet, Navigate} from 'react-router-dom'
import { useAuth } from '../AuthContext'

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth()
    
  return (
    isAuthenticated ? <Outlet /> : <Navigate to='/land' />
  )
}

export default ProtectedRoute