import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'))

    const login = (token, username) => {
        localStorage.setItem('access', token.access)
        localStorage.setItem('refresh', token.refresh)
        localStorage.setItem('username', username)
        setIsAuthenticated(true)

    }
    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        localStorage.removeItem('chat_id')
        localStorage.removeItem('historical_chat_id')
        setIsAuthenticated(false);
      }
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    return useContext(AuthContext);
  };