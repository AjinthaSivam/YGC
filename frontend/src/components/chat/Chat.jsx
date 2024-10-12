import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useChat } from './ChatContext';
import SendButton from '../buttons/SendButton';
import VoiceButton from '../buttons/VoiceButton';
import '../styles/custom.css'
import BotLogo from '../../assets/images/bot.png'
import { usePremium } from '../contexts/PremiumContext';
import { FaBolt } from 'react-icons/fa6';
import { useParams, useNavigate } from 'react-router-dom';
import InputBox from '../InputBox'
import NewChatButton from '../NewChatButton';
import CustomScrollbar from '../scrollbars/CustomScrollbar';
import ErrorMessage from '../messages/ErrorMessage';
import BotMessage from '../messages/BotMessage';
import UserMessage from '../messages/UserMessage';
import ThinkingMessage from '../messages/thinkingMessage/ThinkingMessage';


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL


const Chat = () => {
    const { isPremium, setIsPremium } = usePremium();

    const [isLoading, setIsLoading] = useState(false)

    const { chatId: urlChatId } = useParams();

    const [isThinking, setIsThinking] = useState(false)

    const { messages, setMessages, chatId, setChatId, updateChatSessions } = useChat();
    const [chatHistory, setChatHistory] = useState([]);
    const [input, setInput] = React.useState('');
    const [showOptionalQuestions, setShowOptionalQuestions] = React.useState(false);
    
    const [remainingQuota, setRemainingQuota] = useState(null);
    const [showUpgradeButton, setShowUpgradeButton] = useState(false);

    const initialBotMessage = {
        sender: 'bot', 
        text: `Hey ${localStorage.getItem('username')}! 😊🌟\n\n👋 I'm here to help you with your questions and requests. How can I assist you today? 📝 \n\n`,
        time: new Date()
    }

    const navigate = useNavigate();

    const handleTranscript = (transcript) => {
        setInput(transcript)
        sendMessage(transcript)
    }

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

    const sendMessage = async (message) => {
        if (message.trim()) {
            const newMessage = { sender: 'user', text: message, time: new Date() };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInput('');
            setShowOptionalQuestions(false)

            // Add thinking message
            setIsThinking(true);

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
        sendMessage(input)
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
                <NewChatButton handleNewChat={handleNewChat} />
                {error && (
                    <div className="flex-grow flex justify-center mx-2">
                        <ErrorMessage message={error} isPersistent={false} />
                    </div>
                )}
                {!isPremium && remainingQuota !== null && (
                    <div className='flex items-center text-transparent bg-clip-text bg-gradient-to-r from-strong_cyan to-primary font-semibold'>
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
            
            <CustomScrollbar className='flex-grow mb-4 overflow-y-auto' containerClassName='px-3 bg-white' trackColor='white'>
                <div ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        message.sender === 'bot' ? (
                            <BotMessage key={index} text={message.text} time={message.time} speaker={BotLogo} />
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
                                    className='p-2 bg-white text-left text-sm text-primary border border-primary rounded-lg hover:bg-secondary'
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </CustomScrollbar>
            {
                !isPremium && remainingQuota === 0 && (
                    <div className='mb-4 flex justify-center'>
                        <button className='flex items-center justify-center bg-gradient-to-r from-strong_cyan to-primary text-white shadow-lg py-2 px-4 rounded-full inline-block animate-bounce'>
                            <FaBolt className='mr-2 text-yellow-300' />
                            <span className='font-bold mr-2'>Upgrade to continue</span>

                        </button>

                    </div>
                )
            }
            <div className='flex flex-col sm:flex-row px-2 sm:px-3 items-end mt-auto'>
                <div className='flex w-full mb-2'>
                    <VoiceButton onTranscript={handleTranscript} disabled={!isPremium && remainingQuota === 0} />
                    <InputBox 
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                        disabled={!isPremium && remainingQuota === 0}
                    />
                    <SendButton onClick={handleSend} disabled={!isPremium && remainingQuota === 0} />
                </div>
            </div>
        </div>
    )
}

export default Chat