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

    const renameChatSession = useCallback(async (chatId, newTitle) => {
        try {
            const response = await axios.put(`${apiBaseUrl}/api/chat/rename_chat_session/${chatId}/`, {
                new_title: newTitle
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            updateChatSessions();
        } catch (error) {
            console.error('Error renaming chat session:', error);
        }
    }, [updateChatSessions]);

    const softDeleteChatSession = useCallback(async (chatId) => {
        try {
            const response = await axios.delete(`${apiBaseUrl}/api/chat/soft_delete_chat_session/${chatId}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            updateChatSessions();
        } catch (error) {
            console.error('Error deleting chat session:', error);
        }
    }, [updateChatSessions]);


    return (
        <ChatContext.Provider value={{ messages, setMessages, chatId, setChatId, chatSession, updateChatSessions, renameChatSession, softDeleteChatSession }}>
            {children}
        </ChatContext.Provider>
    );
};
