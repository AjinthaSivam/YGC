import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useHistoricalChat } from './HistoricalChatContext'; // Import new context
import { MdOutlineKeyboardVoice, MdKeyboardVoice, MdArrowUpward } from "react-icons/md";
import Kalaam from './kalaam.jpg'
import '../styles/custom.css';
import { marked } from 'marked';
import SendButton from '../buttons/SendButton';

const formatBotResponse = (response) => {
    return marked(response);
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const Historical = () => {
    const { messages, setMessages, chatId, setChatId } = useHistoricalChat(); // Use new context
    const [input, setInput] = React.useState('');
    const [listening, setListening] = React.useState(false);
    const [recognition, setRecognition] = React.useState(null);
    const [showOptionalQuestions, setShowOptionalQuestions] = React.useState(false);
    const [error, setError] = useState("")
    const textareaRef = useRef(null); // Ref for the textarea

    const max_input_length = 800

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

    const handleInputChange = (e) => {
        const { value } = e.target;
        setInput(value);
        // Check if the input length exceeds maximum limit
        if (value.length > max_input_length) {
            setError("Your message is too long. Please limit your message to 150 words.")
        } else {
            setError("")
        }
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    };

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

        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setListening(true);
            recognition.onend = () => setListening(false);
            recognition.onerror = (event) => console.error(event.error);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                sendMessage(transcript);
            };

            setRecognition(recognition);
        } else {
            console.warn('Webkit Speech Recognition is not supported in this browser.');
        }
    }, [messages, setMessages]);

    const startVoiceRecognition = () => {
        if (recognition) {
            recognition.start();
        }
    };

    const stopVoiceRecognition = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const sendMessage = async (message) => {
        if (message.trim()) {
            const newMessage = { sender: 'user', text: message, time: new Date() };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInput('');

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

                     // Hide optional questions after user interacts
                     setShowOptionalQuestions(false);
                     localStorage.setItem('historical_chat_id', response.data.chat_id)
                } else {
                    console.error('Invalid response format:', response);
                }
            } catch (error) {
                console.error('Error sending message:', error);
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
        // Reset textarea height
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset height to auto
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
            <div className='flex-grow overflow-auto mb-4 px-3 sm:mt-0 pt-2 sm:pt-0 mt-16' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex mt-6 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-3xl p-4 sm:text-sm text-xs rounded-lg ${message.sender === 'user' ? 'pt-2 bg-primary text-light_gray' : 'bg-secondary text-dark_gray'}`}>
                            {message.sender === 'bot' && (
                                <img src={Kalaam} alt="kalaam" className="absolute w-10 h-10 rounded-full left-2 -top-5 h-8 w-8" />
                            )}
                            {message.sender === 'bot' ? (
                                <div className='whitespace-pre-line' dangerouslySetInnerHTML={{ __html: message.text }} />
                            ) : (message.text)}
                            <p className={`absolute bottom-1 right-2 text-xs ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>{formatTime(message.time)}</p>
                        </div>
                    </div>
                ))}
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
                <button onClick={listening ? stopVoiceRecognition : startVoiceRecognition} className='flex items-center justify-center px-0 sm:p-2 text-primary rounded-full sm:mr-2 hover:bg-secondary w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'>
                    {listening ? <MdKeyboardVoice size={25} /> : <MdOutlineKeyboardVoice size={25} />}
                </button>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    className={`flex-grow p-2 pl-3 sm:pl-4 text-xs sm:text-sm border ${input ? 'rounded-lg' : 'rounded-full'} focus:outline-none resize-none`}
                    placeholder='Type your message...'
                    rows={1}
                />
                <SendButton onClick={handleSend} disabled={!input.trim()} />
            </div>
            </div>
        </div>
    );
};

function formatTime(time) {
    return time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default Historical;
