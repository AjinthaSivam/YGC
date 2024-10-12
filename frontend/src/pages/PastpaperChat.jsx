import React, {useState, useEffect, useRef} from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from 'axios'
import { PremiumProvider } from '../components/contexts/PremiumContext'
import SendButton from '../components/buttons/SendButton';
import VoiceButton from '../components/buttons/VoiceButton';
import InputBox from '../components/InputBox'
import BotMessage from '../components/messages/BotMessage'
import UserMessage from '../components/messages/UserMessage'
import ThinkingMessage from '../components/messages/thinkingMessage/ThinkingMessage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const PastpaperChat = () => {
  const location = useLocation()

  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selected_year = location.state || { year: '' }
  const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatContainerRef = useRef(null);

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

    const handleBack = (e) => {
      e.preventDefault()
      navigate(`/pastpaper/${selected_year}`)
    }

  return (
    <PremiumProvider>
    <div className='bg-white h-screen flex flex-col'>
        <div className='z-50'>
        <NavBar />
        </div>
        
        <div className='flex-1 flex overflow-hidden'>
            <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className={`flex-1 overflow-auto z-30 ${sidebarOpen ? 'sm:ml-80' : 'ml-16'} duration-300`}>
            <div className='flex flex-col h-screen p-2 max-w-5xl sm:mx-auto relative'>
            <button onClick={handleBack} className='mt-16 sm:mt-0 top-4 left-4 w-10 h-10 items-center text-gray-500 rounded-full hover:text-primary duration-300 p-3'>
                <MdOutlineArrowBackIos size={20} />
            </button>
              <div className='flex-grow overflow-auto mb-4 px-3' ref={chatContainerRef}>
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
            
          </div>
        </div>
    </div>
    </PremiumProvider>
  )
}

export default PastpaperChat