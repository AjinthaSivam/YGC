import React, { useState, useRef, useEffect } from 'react';
import BotLogo from './chat/bot.png';
import { MdArrowUpward, MdOutlineKeyboardVoice, MdKeyboardVoice } from 'react-icons/md';
import axios from 'axios';

const ToggleBot = ({ selected_year }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [listening, setListening] = useState(false);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    const handleInputChange = (e) => setInput(e.target.value);

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }

    const sendMessage = async(message) => {
        if (message.trim()) {
            const newMessage = { sender: 'user', text: message, time: new Date() }
            setMessages(prevMessage => [...prevMessage, newMessage])
            setInput('')

            const data_to_send = {
                user_input: message,
                selected_year: selected_year
            }

            console.log(data_to_send)

            try {
                const response = await axios.post('http://127.0.0.1:8000/pastpaper/api/', {
                    user_input: message,
                    selected_year: selected_year
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`
                    }
                })

                if (response && response.data && response.data.response) {
                    const botResponse = response.data.response

                    const botMessage = { sender: 'bot', text: botResponse, time: new Date() }
                    setMessages(prevMessage => [...prevMessage, botMessage])


                }
                else {
                    console.error('Invalid response format:', response)
                }
            }
            catch (error) {
                console.error("Error sending message: ", error)
            }
        }
    }

    const handleSend = () => {
        sendMessage(input)
    };

    const startVoiceRecognition = () => setListening(true);
    const stopVoiceRecognition = () => setListening(false);

    const formatTime = (time) => time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className='flex flex-col h-full px-4 pb-3 w-full bg-white rounded-b-md'>
            <div className='flex-grow overflow-auto mt-8 mb-4 px-3' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`flex mt-4 mb-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-3xl p-4 rounded-lg text-sm ${message.sender === 'user' ? 'pt-2 bg-[#04aaa2] text-[#fbfafb]' : 'bg-[#e6fbfa] text-[#2d3137]'}`}>
                            {message.sender === 'bot' && (
                                <img src={BotLogo} alt="Bot Logo" className="absolute left-2 -top-5 h-8 w-8" />
                            )}
                            {message.sender === 'bot' ? (
                                <div className='whitespace-pre-line' dangerouslySetInnerHTML={{ __html: message.text }} />
                            ) : (<div className='whitespace-pre-line'>
                                {message.text}
                                </div>)}
                            <p className={`absolute bottom-1 right-2 text-xs ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                                {formatTime(message.time)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex px-3 items-end'>
                <button onClick={listening ? stopVoiceRecognition : startVoiceRecognition} className='p-2 text-[#04aaa2] rounded-full mr-1 hover:bg-[#e6fbfa] w-9 h-9 flex-shrink-0'>
                    {listening ? <MdKeyboardVoice size={20} /> : <MdOutlineKeyboardVoice size={20} />}
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
                    className={`flex-grow text-sm p-2 pl-4 border ${input ? 'rounded-lg' : 'rounded-full'} focus:outline-none resize-none`}
                    placeholder='Type your message...'
                    rows={1}
                />
                <button onClick={handleSend} className='p-2 bg-[#04aaa2] text-[#fbfafb] rounded-full ml-2 hover:bg-[#04bdb4] w-9 h-9 flex-shrink-0'>
                    <MdArrowUpward size={20} />
                </button>
            </div>
        </div>
    );
};

export default ToggleBot;