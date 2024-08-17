import React, { useState } from 'react';

const pastPaperYears = [2023, 2022, 2021, 2020, 2019, 2018];

const PastPapers = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleCardClick = (year) => {
        setSelectedYear(year);
        setIsChatOpen(true); // Automatically open chat when a year is selected
    };

    const handleChatbotClick = (event, year) => {
        event.stopPropagation(); // Prevent triggering card click

        setSelectedYear(year);
        setIsChatOpen(true);

        // Initialize the chat with the selected year
        fetch(`/chatbot/start/${year}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // If authentication is required
            },
            body: JSON.stringify({ user_input: '', new_chat: true })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Chatbot started:', data);
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className='flex mt-6 p-4 h-full w-full max-w-5xl mx-auto flex-grow overflow-auto'>
            {!selectedYear ? (
                <div className='w-full max-w-5xl'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-4'>
                        {pastPaperYears.map(year => (
                            <div
                                key={year}
                                className='relative bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300 group'
                                onClick={() => handleCardClick(year)}
                            >
                                <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg'></div>
                                <img
                                    src={`/pastpapers/thumbnails/${year}.jpg`}
                                    alt={`Past paper ${year}`}
                                    className='w-full h-36 object-cover rounded-t-lg'
                                />
                                <div className='p-2'>
                                    <h2 className='text-md text-gray-800 z-10 relative group-hover:text-white transition-colors duration-300'>
                                        G.C.E O/L English Language Past Paper <span className='text-xl font-semibold'>{year}</span>
                                    </h2>
                                    <button
                                        onClick={(e) => handleChatbotClick(e, year)}
                                        className='absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg'
                                    >
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='flex w-full'>
                    <div className='w-1/2 p-4'>
                        <iframe
                            src={`/pastpapers/${selectedYear}.pdf`}
                            title={`Past Paper ${selectedYear}`}
                            className='w-full h-full'
                        />
                    </div>
                    {isChatOpen && (
                        <div className='w-1/2 p-4'>
                            <div className='border rounded-lg p-4 h-full'>
                                <h2 className='text-xl font-semibold'>Chat for {selectedYear} Paper</h2>
                                <ChatbotUI year={selectedYear} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ChatbotUI component
const ChatbotUI = ({ year }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add user message to chat
        setMessages([...messages, { role: 'user', content: input }]);

        // Send user input to the backend
        fetch(`/chatbot/start/${year}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // If authentication is required
            },
            body: JSON.stringify({ user_input: input, new_chat: false })
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.response }]);
                setInput('');
            } else {
                console.error('Chatbot response error:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="chatbox">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default PastPapers;
