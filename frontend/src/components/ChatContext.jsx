import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);

    return (
        <ChatContext.Provider value={{ messages, setMessages, chatId, setChatId }}>
            {children}
        </ChatContext.Provider>
    );
};
