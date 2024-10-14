import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IoCloseOutline } from "react-icons/io5";
import SendButton from '../buttons/SendButton';
import VoiceButton from '../buttons/VoiceButton';
import InputBox from '../InputBox';
import BotMessage from '../messages/BotMessage';
import UserMessage from '../messages/UserMessage';
import ThinkingMessage from '../messages/thinkingMessage/ThinkingMessage';

const ToggleBot = ({ selected_year, handleClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatContainerRef = useRef(null);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    const handleTranscript = (transcript) => {
        setInput(transcript)
        sendMessage(transcript)
    }

    useEffect(() => {
        getChatHistory()
    }, [])

    const getChatHistory = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/pastpaper/history/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            })

            // console.log(response.data[0])

            if (response.data && Array.isArray(response.data)) {

                const previousMessages = response.data.map(entry => ([
                    { sender: 'user', text: entry.message, time: new Date(entry.timestamp) },
                    { sender: 'bot', text: entry.response, time: new Date(entry.timestamp) }
                ])).flat();
    
                const filteredMessages = previousMessages.filter(
                    msg => !messages.some(m => m.text === msg.text && m.time.getTime() === msg.time.getTime())
                );
    
                if (filteredMessages.length > 0) {
                    setMessages(prevMessages => [
                        ...filteredMessages
                    ]);
                }
            } else {
                console.error('Unexpected response format:', response.data)
            }
        
        }
        catch (error) {
            console.error('Error fetching chat history:', error)

        }
    }

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
            setIsThinking(true)

            const data_to_send = {
                user_input: message,
                selected_year: selected_year
            }

            console.log(data_to_send)

            try {
                const response = await axios.post(`${apiBaseUrl}/pastpaper/api/`, {
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
            finally {
                setIsThinking(false)
            }
        }
    }

    const handleSend = () => {
        sendMessage(input)
    };

    return (
        <div className='flex flex-col h-full w-full px-4 pb-3 w-full bg-white rounded-b-md'>
            <button onClick={handleClose} className='absolute top-4 right-4 p-1 text-gray-500 rounded-full hover:bg-soft_cyan hover:text-primary duration-300'>
            <IoCloseOutline size={24} />
            </button>
            <div className='flex-grow overflow-auto mt-12 mb-4 px-3' ref={chatContainerRef}>
                {messages.map((message, index) => (
                    message.sender === 'bot' ? (
                        <BotMessage key={index} text={message.text} time={message.time} />
                    ) : (
                        <UserMessage key={index} text={message.text} time={message.time} />
                    )
                ))}
                {isThinking && <ThinkingMessage />}
            </div>
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

export default ToggleBot;
