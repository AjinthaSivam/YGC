import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistoricalChat } from './HistoricalChatContext'; // Import new context
import { MdOutlineKeyboardVoice, MdKeyboardVoice, MdArrowUpward } from "react-icons/md";
import Kalaam from './kalaam.jpg'
import '../styles/custom.css';
import { marked } from 'marked';

const formatBotResponse = (response) => {
    return marked(response);
};

const Historical = () => {
    const { messages, setMessages, chatId, setChatId } = useHistoricalChat(); // Use new context
    const [input, setInput] = React.useState('');
    const [listening, setListening] = React.useState(false);
    const [recognition, setRecognition] = React.useState(null);
    const [showOptionalQuestions, setShowOptionalQuestions] = React.useState(false);
    const textareaRef = useRef(null); // Ref for the textarea

    const handleInputChange = (e) => {
        const { value } = e.target;
        setInput(value);
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
                const response = await axios.post('http://127.0.0.1:8000/api/historical/chat/', {
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
        <div className='flex flex-col h-full p-6 w-full max-w-5xl mx-auto'>
            {/* Heading Section */}
            <div className='text-center mt-3 mb-6'>
                <h1 className='text-2xl font-bold text-[#04aaa2]'>Inspire Your Mind with Dr. Kalam</h1>
                <p className='text-md text-gray-600 border-b pb-3 mt-2'>Engage in an enlightening conversation and discover wisdom that motivates and inspires.</p>
            </div>
            
            {/* Chat Container */}
            <div className='flex-grow overflow-auto mt-8 mb-4 px-3' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex mt-6 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-3xl p-4 rounded-lg ${message.sender === 'user' ? 'pt-2 bg-[#04aaa2] text-[#fbfafb]' : 'bg-[#e6fbfa] text-[#2d3137]'}`}>
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
                                    className='p-2 bg-white text-left text-[#04aaa2] border border-[#04aaa2] rounded-lg hover:bg-[#e6fbfa]'
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
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
                    className={`flex-grow p-2 pl-4 border ${input ? 'rounded-lg' : 'rounded-full'} focus:outline-none resize-none`}
                    placeholder='Type your message...'
                    rows={1}
                />
                <button onClick={handleSend} className='p-2 bg-[#04aaa2] text-[#fbfafb] rounded-full ml-2 hover:bg-[#04bdb4] w-10 h-10 flex-shrink-0'>
                    <MdArrowUpward size={25} />
                </button>
            </div>
        </div>
    );
};

function formatTime(time) {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default Historical;
