import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useHistoricalChat } from './HistoricalChatContext'; // Import new context
import Kalaam from './kalaam.jpg'
import '../styles/custom.css';
import SendButton from '../buttons/SendButton';
import VoiceButton from '../buttons/VoiceButton';
import InputBox from '../InputBox';
import BotMessage from '../messages/BotMessage';
import UserMessage from '../messages/UserMessage';
import ThinkingMessage from '../messages/thinkingMessage/ThinkingMessage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const Historical = () => {
    const { messages, setMessages, chatId, setChatId } = useHistoricalChat(); // Use new context
    const [input, setInput] = React.useState('');
    const [showOptionalQuestions, setShowOptionalQuestions] = React.useState(false);
    const [error, setError] = useState("")
    const [isThinking, setIsThinking] = useState(false)

    const handleTranscript = (transcript) => {
        setInput(transcript)
        sendMessage(transcript)
    }

    useEffect(() => {
        const storedChatId = localStorage.getItem('historical_chat_id');

        if (storedChatId) {
            setChatId(storedChatId);  // Use the existing chat ID
            getChatHistory(storedChatId);  // Fetch and load chat history
        } else {
            console.log('No chat ID found in localStorage');
            // Optionally: Inform the user that they need to start a chat
        }
    }, []);

    const getChatHistory = async (existing_chat_id) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/historical_chat_history/?chat_id=${existing_chat_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
    
            if (response.data && response.data.length > 0) {
                const chatHistory = response.data[0].history;  // Access the history array from the first object in the response
    
                const previousMessages = chatHistory.flatMap(entry => ([
                    { sender: 'user', text: entry.message, time: new Date(entry.timestamp) },
                    { sender: 'bot', text: entry.response, time: new Date(entry.timestamp) }
                ]));
    
                const filteredMessages = previousMessages.filter(
                    msg => !messages.some(m => m.text === msg.text && m.time.getTime() === msg.time.getTime())
                );
    
                if (filteredMessages.length > 0) {
                    setMessages(prevMessages => [
                        ...filteredMessages
                    ]);
                }
                setShowOptionalQuestions(false);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    }

    const optionalQuestions = [
        "What is the key to success in life?",
        "How can I stay motivated through challenges?",
        "What are some ways to set and achieve goals?",
        "How can I maintain a positive attitude?",
        "What is the importance of perseverance?"
    ]

    const chatContainerRef = useRef(null);

    const handleQuestionClick = (question) => {
        setShowOptionalQuestions(false)
        sendMessage(question);
        
    };

    useEffect(() => {
        const initialBotMessage = {
            sender: 'bot',
            text:`Hello! I am Dr. A.P.J. Abdul Kalam, 🌟 I'm here to offer you guidance and inspiration. Whether you have questions about science, motivation, or life, I'm here to help you on your journey! 💡🚀`,
            time: new Date()
        };
        if (messages.length === 0) {
            setMessages([initialBotMessage]);
            setShowOptionalQuestions(true);
        }
    }, [messages, setMessages]);

    const sendMessage = async (message) => {
        if (message.trim()) {
            const newMessage = { sender: 'user', text: message, time: new Date() };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInput('');
            // Hide optional questions after user interacts
            setShowOptionalQuestions(false);
            setIsThinking(true)

            try {
                const response = await axios.post(`${apiBaseUrl}/api/historical/chat/`, {
                    user_input: message,
                    new_chat: chatId === null,
                    chat_id: chatId
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });

                if (response && response.data && response.data.response) {
                    const botResponse = response.data.response;

                    const botMessage = { sender: 'bot', text: botResponse, time: new Date() };
                    setMessages(prevMessages => [...prevMessages, botMessage]);

                    if (chatId === null) {
                        setChatId(response.data.chat_id);
                    }

                     
                     localStorage.setItem('historical_chat_id', response.data.chat_id)
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsThinking(false)
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    const handleSend = () => {
        sendMessage(input);
    };

    return (
        <div className='flex flex-col h-screen p-2 max-w-4xl sm:mx-auto'>
            {/* Heading Section */}
            <div className='hidden sm:block'>
                <div className='text-center mt-3 sm:mt-16 mb-6 p-4'>
                    <h1 className='text-2xl font-bold text-primary'>Inspire Your Mind with Dr. Kalam</h1>
                    <p className='text-md text-dark_gray border-b pb-3 mt-2'>Engage in an enlightening conversation and discover wisdom that motivates and inspires.</p>
                </div>
            </div>
            
            {/* Chat Container */}
            <div className='flex-grow overflow-auto mb-4 px-3 sm:mt-6 pt-2 sm:pt-0 mt-16' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    message.sender === 'bot' ? (
                        <BotMessage key={index} text={message.text} time={message.time} speaker={Kalaam} />
                    ) : (
                        <UserMessage key={index} text={message.text} time={message.time} />
                    )
                ))}
                {isThinking && <ThinkingMessage />}
                {showOptionalQuestions && (
                    <div className='mt-4'>
                        <div className='justify-start flex flex-col gap-2 max-w-lg'>
                            {optionalQuestions.map((question, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleQuestionClick(question)} 
                                    className='p-2 bg-white text-sm text-left text-primary border border-primary rounded-lg hover:bg-secondary'
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50'>
                    <div className='relative max-w-md p-4 bg-red-200 text-sm text-red-800 rounded-lg shadow-lg'>
                        <button 
                            onClick={() => setError('')} 
                            className='absolute top-2 right-2 text-md text-red-800 hover:text-red-600 focus:outline-none'
                        >
                            &times;
                        </button>
                        {error}
                    </div>
                </div>
            )}
            <div className='flex flex-col sm:flex-row px-2 sm:px-3 items-end mt-auto'>
            <div className='flex w-full mb-2'>
                <VoiceButton onTranscript={handleTranscript} />
                <InputBox 
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                />
                <SendButton onClick={handleSend} disabled={!input.trim()} />
            </div>
            </div>
        </div>
    );
};

export default Historical;
