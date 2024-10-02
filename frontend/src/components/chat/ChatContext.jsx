import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [chatSession, setChatSession] = useState([]);

    const updateChatSessions = useCallback(async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/get_general_chat_sessions`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            setChatSession(response.data);
        } catch (error) {
            console.error('Error fetching chat sessions:', error);
        }
    }, []);


    return (
        <ChatContext.Provider value={{ messages, setMessages, chatId, setChatId, chatSession, updateChatSessions }}>
            {children}
        </ChatContext.Provider>
    );
};
