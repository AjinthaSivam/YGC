import React, {useState, useEffect, useRef} from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { useLocation, useNavigate } from 'react-router-dom'
import BotLogo from '../components/chat/bot.png'
import { MdArrowUpward, MdOutlineKeyboardVoice, MdKeyboardVoice } from 'react-icons/md';
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from 'axios'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const PastpaperChat = () => {
  const location = useLocation()

  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selected_year = location.state || { year: '' }
  const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [listening, setListening] = useState(false);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    const handleInputChange = (e) => setInput(e.target.value);

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
        }
    }

    const handleSend = () => {
        sendMessage(input)
    };

    const handleBack = (e) => {
      e.preventDefault()
      navigate(`/pastpaper/${selected_year}`)
    }

    const startVoiceRecognition = () => setListening(true);
    const stopVoiceRecognition = () => setListening(false);

    const formatTime = (time) => time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
            <button onClick={handleBack} className='mt-16 sm:mt-0 top-4 left-4 text-gray-500 hover:rounded-full hover:bg-[#e6fbfa] duration-300 p-3'>
                <MdOutlineArrowBackIos size={20} />
            </button>
              <div className='flex-grow overflow-auto mb-4 px-3' ref={chatContainerRef}>
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
              <div className='flex flex-col sm:flex-row px-2 sm:px-3 items-end mt-auto'>
              <div className='flex w-full mb-2'>
                  
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
            </div>
            
          </div>
        </div>
    </div>
    </PremiumProvider>
  )
}

export default PastpaperChat