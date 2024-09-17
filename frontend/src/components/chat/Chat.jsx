import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useChat } from './ChatContext';
import { MdOutlineKeyboardVoice, MdKeyboardVoice, MdArrowUpward } from "react-icons/md";
import { FaEraser } from "react-icons/fa";
import { CgSearch } from "react-icons/cg";
import '../styles/custom.css'
import { marked } from 'marked'
import BotLogo from './bot.png'

const formatBotResponse = (response) => {
    return marked(response)
}


const Chat = () => {
    const { messages, setMessages, chatId, setChatId } = useChat();
    const [chatHistory, setChatHistory] = useState([]);
    const [input, setInput] = React.useState('');
    const [listening, setListening] = React.useState(false);
    const [recognition, setRecognition] = React.useState(null);
    const [showOptionalQuestions, setShowOptionalQuestions] = React.useState(false);
    const textareaRef = useRef(null); // Ref for the textarea

    useEffect(() => {
        // window.location.reload()
    }, [])

    const [error, setError] = useState('')

    const max_input_length = 800

    // Handle textarea resize
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
        "What is the difference between past simple and present perfect?",
        "Can you explain the use of articles in English?",
        "How do you form conditional sentences?",
    ]

    const chatContainerRef = useRef(null);

    const handleQuestionClick = (question) => {
        setShowOptionalQuestions(false)
        sendMessage(question);
        
    };

    useEffect(() => {
        const storedChatId = localStorage.getItem('chat_id');

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
            const response = await axios.get(`http://127.0.0.1:8001/api/chat/history/?chat_id=${existing_chat_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
    
            if (response.data && Array.isArray(response.data.history)) {
                const previousMessages = response.data.history.flatMap(entry => ([
                    { sender: 'user', text: entry.message, time: new Date(entry.timestamp) },
                    { sender: 'bot', text: entry.response, time: new Date(entry.timestamp) }
                ]));

                const currentMessagesText = messages.map(msg => msg.text);
                const filteredMessages = previousMessages.filter(
                    msg => !messages.some(m => m.text === msg.text && m.time.getTime() === msg.time.getTime())
                );

                if (filteredMessages.length > 0) {
                    setMessages(prevMessages => [
                        // ...prevMessages,
                        ...filteredMessages
                    ]);
                }
                setShowOptionalQuestions(false)
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    }
    

    useEffect(() => {
        const initialBotMessage = {
            sender: 'bot', 
            text: `Hey ${localStorage.getItem('username')}! 😊🌟\n\n👋 Welcome! I can help with grammar, essays, letters, and articles. Ask me anything or request practice exercises. 📝 \n\n`,
            time: new Date()
        }
        if (messages.length === 0 && chatHistory.length === 0) {
            setMessages([initialBotMessage])
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
        
    }, [messages, chatHistory, setMessages]);

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
                const response = await axios.post('http://127.0.0.1:8001/api/chat/', {
                    user_input: message,
                    new_chat: chatId === null,
                    chat_id: chatId
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });

                if (response.data.error) {
                    setError(response.data.error)
                }
                else {
                    const botResponse = response.data.response;

                    const botMessage = { sender: 'bot', text: botResponse, time: new Date() };
                    setMessages(prevMessages => [...prevMessages, botMessage]);

                    if (chatId === null) {
                        setChatId(response.data.chat_id);
                    }
                    setError('')
                    // Hide optional questions after user interacts
                    setShowOptionalQuestions(false);
                }
                localStorage.setItem('chat_id', response.data.chat_id) 
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }

    const handleSend = () => {
        // if (input.length > max_input_length) {
        //     setError(`Your message is too long. Please limit your message to ${max_input_length} characters.`)
        // }
        sendMessage(input)
        setShowOptionalQuestions(false)

        // Reset textarea height
        const textarea = textareaRef.current;
        textarea.style.height = 'auto'; // Reset height to auto
    }

    
    return (
        <div className='flex flex-col h-full p-6 w-full max-w-5xl mx-auto'>
            <div className='flex justify-end'></div>
            <div className='flex-grow overflow-auto mt-8 mb-4 px-3' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex mt-4 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-3xl p-4 text-sm rounded-lg ${message.sender === 'user' ? 'pt-2 bg-[#04aaa2] text-[#fbfafb]' : 'bg-[#e6fbfa] text-[#2d3137]'}`}>
                            {message.sender === 'bot' && (
                                <img src={BotLogo} alt="Bot Logo" className="absolute left-2 -top-5 h-8 w-8" />
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
                                    className='p-2 bg-white text-left text-sm text-[#04aaa2] border border-[#04aaa2] rounded-lg hover:bg-[#e6fbfa]'
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

            <div className='flex px-3 items-end'>
                <button onClick={listening ? stopVoiceRecognition : startVoiceRecognition} className='p-2 text-[#04aaa2] rounded-full mr-2 hover:bg-[#e6fbfa] w-10 h-10 flex-shrink-0'>
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
                    className={`flex-grow p-2 pl-4 text-sm border ${input ? 'rounded-lg' : 'rounded-full'} focus:outline-none resize-none`}
                    placeholder='Type your message...'
                    rows={1}
                />
                <button onClick={handleSend} className='p-2 bg-[#04aaa2] text-[#fbfafb] rounded-full ml-2 hover:bg-[#04bdb4] w-10 h-10 flex-shrink-0'>
                    <MdArrowUpward size={25} />
                </button>
            </div>
        </div>
    )
}

function formatTime(time) {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default Chat
