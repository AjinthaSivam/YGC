import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { GrResources } from "react-icons/gr";
import { MdOutlineQuiz, MdOutlineChatBubbleOutline, MdEdit, MdDelete } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import CustomScrollbar from './scrollbars/CustomScrollbar';
import { useChat } from './chat/ChatContext';

const SideBar = ({ open, setOpen }) => {
    const [selectedMenu, setSelectedMenu] = useState('');
    const [showChatSubmenu, setShowChatSubmenu] = useState(false);
    const [editChatSession, setEditChatSession] = useState(null);

    const { chatSession, updateChatSessions, renameChatSession, softDeleteChatSession } = useChat();

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

    const handleRenameChatSession = (e, chatId) => {
        e.stopPropagation();
        setEditChatSession(chatId);
    };

    const handleRename = async (chatId, newTitle) => {
        console.log('Renaming chat:', chatId, 'to:', newTitle);
        if (newTitle.trim() !== '') {
            try {
                await renameChatSession(chatId, newTitle);
                console.log('Rename successful');
                setEditChatSession(null);
                updateChatSessions();
            } catch (error) {
                console.error('Error renaming chat:', error);
            }
        } else {
            console.log('New title is empty, not renaming');
        }
    };

    const handleDeleteChatSession = async (e, chatId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this chat session?')) {
            await softDeleteChatSession(chatId);
            updateChatSessions();
        }
    };

    return (
        <div className='bg-[#F5F5F5] fixed h-full top-0 left-0 mt-16 z-40'>
            <CustomScrollbar className={`bg-[#e6fbfa] h-full ${open ? "w-80" : "w-16"} duration-500 text-[#2d3137] px-4 absolute top-0 left-0 ${
                    open ? 'shadow-lg' : ''
                }`}>
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
                                        <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-[#b4f2ef] rounded-md cursor-pointer">
                                            <div onClick={() => handleChatSessionClick(session.chat_id)}>
                                    {editChatSession === session.chat_id ? (
                                        <input
                                            type="text"
                                            defaultValue={session.chat_title}
                                            onBlur={(e) => handleRename(session.chat_id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleRename(session.chat_id, e.target.value);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                        />
                                    ) : (
                                        session.chat_title
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <MdEdit
                                        size={18}
                                        className="cursor-pointer text-gray-500 hover:text-gray-700 mr-2"
                                        onClick={(e) => handleRenameChatSession(e, session.chat_id)}
                                    />
                                    <MdDelete
                                        size={18}
                                        className="cursor-pointer text-gray-500 hover:text-red-500"
                                        onClick={(e) => handleDeleteChatSession(e, session.chat_id)}
                                    />
                                </div>
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
