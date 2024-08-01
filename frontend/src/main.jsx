import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import { ChatProvider } from './components/ChatContext.jsx';
import { HistoricalChatProvider } from './components/HistoricalChatContext.jsx'; // Ensure this is the correct import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <HistoricalChatProvider>
            <App />
          </HistoricalChatProvider>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
