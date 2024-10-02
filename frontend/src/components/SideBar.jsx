import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { GrResources } from "react-icons/gr";
import { MdOutlineQuiz, MdOutlineChatBubbleOutline } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import CustomScrollbar from './scrollbars/CustomScrollbar';
import { useChat } from './chat/ChatContext';

const SideBar = () => {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('');
    const [showChatSubmenu, setShowChatSubmenu] = useState(false);

    const { chatSession, updateChatSessions } = useChat();

    const navigate = useNavigate()

    useEffect(() => {
        updateChatSessions();
    }, [updateChatSessions]);

    const menus = [
        { name: "Chat Bot", key: 'chatbot', icon: MdOutlineChatBubbleOutline, path: '/generalchat' },
        { name: "Past Papers", key: 'pastpapers', icon: GrResources, path: '/pastpapercard' },
        { name: "Quiz", key: 'quiz', icon: MdOutlineQuiz, path: '/quizstart'},
        { name: "Historical Character", key: 'historicalCharacter', icon: FaUserAstronaut, path: '/legend' },
    ];

    const handleMenuClick = (menu) => {
        if (menu.key === 'chatbot') {
            setShowChatSubmenu(!showChatSubmenu);
            setOpen(true);
        } else {
            navigate(menu.path);
            setSelectedMenu(menu.key);
            setShowChatSubmenu(false);
        }        
    };

    const handleChatSessionClick = (chatId) => {
        navigate(`/generalchat/${chatId}`);
        setSelectedMenu('chatbot');
    };

    return (
        <div className='bg-[#F5F5F5]'>
            <CustomScrollbar className={`bg-[#e6fbfa] h-full ${open ? "w-80" : "w-16"} duration-500 text-[#2d3137] px-4 z-50`}>
                <div className='py-5 flex justify-end'>
                    <HiMenuAlt3 size={24} className='cursor-pointer' onClick={() => setOpen(!open)} />
                </div>
                <div className='mt-4 flex flex-col gap-4 relative z-1000'>
                    {
                        menus.map((menu, i) => (
                            <div key={i}>
                                <div
                                    onClick={() => handleMenuClick(menu)}
                                    className={`group ${menu.margin && 'mt-5'} flex items-center gap-3.5 text-sm p-2 hover:bg-[#b4f2ef] rounded-md cursor-pointer ${selectedMenu === menu.key ? 'bg-[#b4f2ef]' : ''}`}
                                >
                                    <div className='font-semibold'>
                                        {React.createElement(menu.icon, { size: '18' })}
                                    </div>
                                    <h2 className={`font-semibold whitespace-pre ${!open && 'opacity-0 overflow-hidden'}`}>{menu.name}</h2>
                                    <h2
                                        className={`${open && 'hidden'} absolute whitespace-pre left-48 bg-gray-800 text-xs text-[#e6fbfa] rounded-md px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-50`}
                                    >
                                        {menu.name}
                                    </h2>
                                </div>
                                {menu.key === 'chatbot' && showChatSubmenu && open && (
                                <CustomScrollbar className="mt-3 max-h-80">
                                    {chatSession.map((session, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleChatSessionClick(session.chat_id)}
                                            className="text-sm p-2 hover:bg-[#b4f2ef] rounded-md cursor-pointer"
                                        >
                                            {session.chat_title}
                                        </div>
                                    ))}
                                </CustomScrollbar>
                            )}
                            </div>
                        ))
                    }
                </div>
            </CustomScrollbar>
        </div>
    );
};

export default SideBar;
