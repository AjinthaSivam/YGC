import React, { useEffect, useState } from 'react';
import Bot from './chat/bot.png';
import ToggleBot from './ToggleBot';

const Paper = ({ pdfUrl, isChatOpen, toggleChat, selected_year }) => {
    // const [isChatOpen, setIsChatOpen] = useState(false);

    // const toggleChatOpen = () => {
    //     setIsChatOpen(!isChatOpen);
    // };
    useEffect(() => {
        console.log(selected_year)
    }, [selected_year])

    if (!pdfUrl) return null;

    return (
        <>
            <div className='relative w-full h-full max-w-4xl flex justify-center items-center p-4 mx-auto'>
                <iframe src={pdfUrl} title='Past Paper' className='w-full h-full' />
            </div>

            {/* Chat Button */}
            <div className='flex-shrink-0'>
                {/* Chatbot Container - Always rendered */}
                <div
                    className={`absolute bottom-4 right-12 mb-10 mr-4 bg-[#04aaa2] rounded-md shadow-lg pt-2 transition-all duration-300 transform ${
                        isChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    } ${
                        isChatOpen ? 'visible' : 'invisible'
                    } w-full h-full md:w-custom-lg md:h-custom-lg md:bottom-4 md:right-12`}
                >
                    <ToggleBot selected_year={selected_year} />
                </div>

                {/* Toggle Button */}
                <button
                    className='absolute bottom-4 mt-2 right-8 p-3 cursor-pointer'
                    onClick={toggleChat}
                >
                    <img src={Bot} alt="Bot" className="h-12 w-12" />
                </button>
            </div>
        </>
    );
};

export default Paper;
