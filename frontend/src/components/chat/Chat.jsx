import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useChat } from './ChatContext';
import { MdOutlineKeyboardVoice, MdKeyboardVoice, MdArrowUpward, MdAdd } from "react-icons/md";
import { HiMiniPencilSquare } from "react-icons/hi2";
import '../styles/custom.css'
import BotLogo from './bot.png'
import { usePremium } from '../contexts/PremiumContext';
import { FaBolt } from 'react-icons/fa6';
import { useParams, useNavigate } from 'react-router-dom';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL


const Chat = () => {
    const { isPremium, setIsPremium } = usePremium();

    const [isLoading, setIsLoading] = useState(false)

    const { chatId: urlChatId } = useParams();

    const [isThinking, setIsThinking] = useState(false)

    const { messages, setMessages, chatId, setChatId, updateChatSessions } = useChat();
    const [chatHistory, setChatHistory] = useState([]);
    const [input, setInput] = React.useState('');
    const [listening, setListening] = React.useState(false);
    const [recognition, setRecognition] = React.useState(null);
    const [showOptionalQuestions, setShowOptionalQuestions] = React.useState(false);
    const textareaRef = useRef(null); // Ref for the textarea

    const [remainingQuota, setRemainingQuota] = useState(null);
    const [showUpgradeButton, setShowUpgradeButton] = useState(false);

    const initialBotMessage = {
        sender: 'bot', 
        text: `Hey ${localStorage.getItem('username')}! 😊🌟\n\n👋 I'm here to help you with your questions and requests. How can I assist you today? 📝 \n\n`,
        time: new Date()
    }

    const navigate = useNavigate();

    const checkPremiumStatus = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/learner/check_premium`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            console.log('Premium status:', response.data.is_premium)
            setIsPremium(response.data.is_premium)
            return response.data.is_premium
        } catch (error) {
            console.error('Error checking premium status:', error)
        }
    }

    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true)
            try {
                const isPremiumLearner = await checkPremiumStatus()
                setIsPremium(isPremiumLearner)
                if (!isPremiumLearner) {
                    await getLearnerQuota()
                }

                if (urlChatId) {
                    setChatId(urlChatId);
                    await getChatHistory(urlChatId);
                    setShowOptionalQuestions(false)
                } else {
                    const storedChatId = localStorage.getItem('chat_id');
                    if (storedChatId) {
                        setChatId(storedChatId);
                        await getChatHistory(storedChatId);
                        setShowOptionalQuestions(false)
                    } else {
                        setMessages([initialBotMessage])
                        setShowOptionalQuestions(true)
                    }
                }
            } catch (error) {
                console.error('Error initializing chat:', error)
            } finally {
                setIsLoading(false)
            }
        }
        initializeChat()
    }, [urlChatId])

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
        "How do I write a good introduction for an essay?",
        "What’s the best way to practice writing formal and informal letters?",
        "How do I use linking words to make my writing flow better?",
    ]

    const chatContainerRef = useRef(null);

    const handleQuestionClick = (question) => {
        setShowOptionalQuestions(false)
        sendMessage(question);
        
    };

    const getChatHistory = async (existing_chat_id) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/chat/history/?chat_id=${existing_chat_id}`, {
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
        
    }, [isLoading, messages, chatHistory, setMessages]);

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

            // Add thinking message
            setIsThinking(true);
            const thinkingMessage = { sender: 'bot', text: 'Thinking.....', time: new Date(), isThinking: true };
            setMessages(prevMessages => [...prevMessages, thinkingMessage]);

            console.log(message, chatId)

            try {
                const response = await axios.post(`${apiBaseUrl}/api/chat/`, {
                    user_input: message,
                    new_chat: chatId === null,
                    chat_id: chatId
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                });

                if (response.data.error) {
                    setError(response.data.error);
                    if (response.data.remaining_quota === 0) {
                        setShowUpgradeButton(true);
                    }
                } else {
                    const botResponse = response.data.response;
                    setMessages(prevMessages => prevMessages.filter(msg => !msg.isThinking));
                    const botMessage = { sender: 'bot', text: botResponse, time: new Date() };
                    setMessages(prevMessages => [...prevMessages, botMessage]);

                    if (chatId === null) {
                        setChatId(response.data.chat_id);
                        updateChatSessions()
                    }
                    setError('');
                    setShowOptionalQuestions(false);
                    
                    // Update remaining quota
                    setRemainingQuota(response.data.remaining_quota);
                }
                localStorage.setItem('chat_id', response.data.chat_id);
            } catch (error) {
                console.error('Error sending message:', error);
                setError("An error occurred while sending your message. Please try again.");
            }finally{
                setIsThinking(false);
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

    const handleUpgrade = () => {
        // Implement your upgrade logic here
        console.log("Upgrade to EduTech Plus")
    }

    const getLearnerQuota = async () => {
        try {
            await resetQuota()
            const response = await axios.get(`${apiBaseUrl}/api/learner/get_learner_quota`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            });
            const remaining = response.data.general_bot_quota
            setRemainingQuota(remaining);
        } catch (error) {
            console.error('Error fetching learner quota:', error);
        }
    }

    const resetQuota = async () => {
        try {
            const access = localStorage.getItem('access')
            const response = await axios.post(`${apiBaseUrl}/api/learner/reset_quota/`, {}, {
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });
            console.log('Quota reset response:', response.data)
        } catch (error) {
            console.error('Error resetting quota:', error)
        }
    }
    
    const handleNewChat = (e) => {
        e.preventDefault()
        setChatId(null)
        setMessages([])
        setShowOptionalQuestions(true)
        localStorage.removeItem('chat_id')
        navigate(`/generalchat`)
    }
    
    return (
        <div className='flex flex-col h-screen p-2 max-w-4xl sm:mx-auto'>
            <div className='flex justify-between mt-16 sm:mt-16 pt-2 items-center mb-4'>
                <div className='relative group'>
                    <button onClick={handleNewChat} className='flex items-center text-[#04aaa2] hover:bg-[#e6fbfa] hover:rounded-full p-2 hover:text-[#04bdb4]' aria-label='New Chat'>
                        <HiMiniPencilSquare size={25} />
                    </button>
                    <span className="absolute left-0 top-full mt-2 w-max bg-gray-800 text-[#e6fbfa] text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        New Chat
                    </span>
                </div>
                {!isPremium && remainingQuota !== null && (
                    <div className='flex items-center text-transparent bg-clip-text bg-gradient-to-r from-[#00568D] to-[#04aaa2] font-semibold'>
                        {remainingQuota === 0 ? (
                            <span className="font-semibold">Daily limit reached. Try again tomorrow!</span>
                        ) : (
                            <>
                                <span className="font-semibold">{remainingQuota}</span>
                                <span className="ml-1">Chats Left!</span>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            <div className='flex-grow overflow-auto mb-4 px-3' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex mt-4 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-3xl p-4 sm:text-sm text-xs rounded-lg ${message.sender === 'user' ? 'pt-2 bg-[#04aaa2] text-[#fbfafb]' : 'bg-[#e6fbfa] text-[#2d3137]'}`}>
                            {message.sender === 'bot' && (
                                <img src={BotLogo} alt="Bot Logo" className="absolute left-2 -top-5 h-8 w-8" />
                            )}
                            {message.sender === 'bot' ? (
                                <div className='whitespace-pre-line space-y-4' dangerouslySetInnerHTML={{ __html: message.text }} />
                            ) : (message.text)}
                            {
                                !message.isThinking && (
                                    <p className={`absolute bottom-1 right-2 text-xs ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>{formatTime(message.time)}</p>
                                )
                            }
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
                        {showUpgradeButton && (
                            <button
                                onClick={handleUpgrade}
                                className='mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                            >
                                Get EduTech Plus
                            </button>
                        )}
                    </div>
                </div>
            )}

            {
                !isPremium && remainingQuota === 0 && (
                    <div className='mb-4 flex justify-center'>
                        <button className='flex items-center justify-center bg-gradient-to-r from-[#00568D] to-[#04aaa2] text-white shadow-lg py-2 px-4 rounded-full inline-block animate-bounce'>
                            <FaBolt className='mr-2 text-yellow-300' />
                            <span className='font-bold mr-2'>Upgrade to continue</span>

                        </button>

                    </div>
                )
            }
            <div className='flex flex-col sm:flex-row px-2 sm:px-3 items-end mt-auto'>
                <div className='flex w-full mb-2'>
                    <button 
                        onClick={listening ? stopVoiceRecognition : startVoiceRecognition} 
                        className='flex items-center justify-center px-0 sm:p-2 text-[#04aaa2] rounded-full sm:mr-2 hover:bg-[#e6fbfa] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'
                        disabled={remainingQuota === 0}
                    >
                        {listening ? <MdKeyboardVoice size={20} className='sm:w-6 sm:h-6' /> : <MdOutlineKeyboardVoice size={20} className='sm:w-6 sm:h-6' />}
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
                        placeholder={!isPremium && remainingQuota === 0 ? 'Daily limit reached' : 'Type your message...'}
                        rows={1}
                        disabled={!isPremium && remainingQuota === 0}
                    />
                    <button 
                        onClick={handleSend} 
                        className='flex items-center justify-center px-0 sm:p-2 bg-[#04aaa2] text-[#fbfafb] rounded-full ml-2 hover:bg-[#04bdb4] w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'
                        disabled={!isPremium && remainingQuota === 0}
                    >
                        <MdArrowUpward size={20} className='sm:w-6 sm:h-6' />
                    </button>
                </div>
            </div>
        </div>
    )
}

function formatTime(time) {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default Chat