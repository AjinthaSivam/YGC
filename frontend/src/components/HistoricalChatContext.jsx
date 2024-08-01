import React, { createContext, useState, useContext } from 'react';

const HistoricalChatContext = createContext();

export const HistoricalChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [chatId, setChatId] = useState(null);

    return (
        <HistoricalChatContext.Provider value={{ messages, setMessages, chatId, setChatId }}>
            {children}
        </HistoricalChatContext.Provider>
    );
};

export const useHistoricalChat = () => useContext(HistoricalChatContext);
