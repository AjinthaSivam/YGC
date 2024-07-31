import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext.jsx'
import { ChatProvider } from './components/ChatContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      
    <ChatProvider> {/* Wrap your App component with ChatProvider */}
        <App />
      </ChatProvider>
      
    </AuthProvider>    
  </React.StrictMode>,
)
