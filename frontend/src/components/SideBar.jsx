import React, { useState, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { GrResources } from "react-icons/gr";
import { MdOutlineQuiz, MdOutlineChatBubbleOutline, MdEdit, MdDelete } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useChat } from './chat/ChatContext';
import ConfimationModal from './ConfimationModal';
import DeleteButton from './buttons/DeleteButton';
import RenameButton from './buttons/RenameButton';
import { MdHistory } from "react-icons/md";
import SuccessMessage from './messages/SuccessMessage';
import NewChatButton from './buttons/NewChatButton'


const SideBar = ({ open, setOpen }) => {
    const [selectedMenu, setSelectedMenu] = useState('');
    const [showChatSubmenu, setShowChatSubmenu] = useState(false);
    const [showQuizSubmenu, setShowQuizSubmenu] = useState(false)
    const [editChatSession, setEditChatSession] = useState(null);
    const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [success, setSuccess] = useState('')
    const { chatSession, updateChatSessions, renameChatSession, softDeleteChatSession } = useChat();

    const navigate = useNavigate()

    useEffect(() => {
        updateChatSessions();
    }, [updateChatSessions]);

    const menus = [
        { name: "General English", key: 'chatbot', icon: MdOutlineChatBubbleOutline, path: '/generalchat' },
        { name: "Past Papers", key: 'pastpapers', icon: GrResources, path: '/pastpapercard' },
        { name: "Quiz", key: 'quiz', icon: MdOutlineQuiz, path: '/quiz/start'},
        { name: "Idol Talks", key: 'historicalCharacter', icon: FaUserAstronaut, path: '/legend' },
    ];

    const handleMenuClick = (menu) => {
        if (menu.key === 'chatbot') {
            setShowChatSubmenu(!showChatSubmenu);
            setOpen(true);
        } 
        else if (menu.key === 'quiz') {
            setOpen(true);
            // Only toggle the quiz submenu if it's not already open
            if (!showQuizSubmenu) {
                setShowQuizSubmenu(true);
            }
            else {
                setShowQuizSubmenu(!showQuizSubmenu)
            }
            navigate(menu.path);
        }
        else {
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
                setSuccess('Successfully renamed')
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
        setChatToDelete(chatId);
        setIsDeleteChatModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (chatToDelete) {
                await softDeleteChatSession(chatToDelete);
                updateChatSessions();
            }
            setChatToDelete(null);
            setIsDeleteChatModalOpen(false);
            setSuccess("Chat session deleted successfully")
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    };

    const handleDeleteCancel = () => {
        setChatToDelete(null);
        setIsDeleteChatModalOpen(false);
    };

    const handleQuizChronicle = (e) => {
        e.preventDefault()
        navigate('/quiz/history/table')
    }

    const handleNewChat = (e) => {
        e.preventDefault()
        navigate('/generalchat')
    }
    

    return (
        <div className='fixed h-full top-0 left-0 mt-16 z-40'>
            {
                success && (
                    <SuccessMessage message={success} />
                )
            }
            <div className={`bg-secondary h-full ${open ? "w-80" : "w-16"} duration-500 text-dark_gray px-4 absolute top-0 left-0 ${
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
                                    className={`group flex items-center gap-3.5 text-sm p-2 hover:bg-soft_cyan rounded-md cursor-pointer ${selectedMenu === menu.key ? 'bg-soft_cyan' : ''}`}
                                >
                                    {
                                        menu.key === 'chatbot' ? (
                                            <div className='flex justify-between w-full items-center'>
                                                <div className='flex items-center gap-3.5'>
                                                    <div className='font-semibold'>
                                                        {React.createElement(menu.icon, { size: '18' })}
                                                    </div>
                                                    <h2 className={`font-semibold whitespace-pre ${!open && 'opacity-0 overflow-hidden'}`}>{menu.name}</h2>
                                                </div>
                                                {open && <NewChatButton handleNewChat={handleNewChat} />}
                                            </div>   
                                        ) : (
                                            <>
                                                <div className='font-semibold'>
                                                    {React.createElement(menu.icon, { size: '18' })}
                                                </div>
                                                <h2 className={`font-semibold whitespace-pre ${!open && 'opacity-0 overflow-hidden'}`}>{menu.name}</h2>
                                            </>
                                        )
                                    }
                                    <h2
                                        className={`${open && 'hidden'} absolute whitespace-pre left-48 bg-gray-800 text-xs text-secondary rounded-md px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit z-60`}
                                    >
                                        {menu.name}
                                    </h2>
                                </div>
                                {menu.key === 'chatbot' && showChatSubmenu && open && (
                                    <div className='mt-3 max-h-80 overflow-y-auto'>
                                        {chatSession.map((session, index) => (
                                            <div key={index} className="flex items-center justify-between text-sm p-2 hover:bg-soft_cyan rounded-md cursor-pointer">
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
                                                <div className="flex items-center justify-between gap-1">
                                                    <RenameButton onClick={(e) => handleRenameChatSession(e, session.chat_id)} />
                                                    <DeleteButton onClick={(e) => handleDeleteChatSession(e, session.chat_id)} />
                                                </div>
                                            </div>
                                        ))}
                    
                                    </div>
                                )}
                                {
                                    menu.key === 'quiz' && showQuizSubmenu && open && (
                                        <div className='mt-3 ml-5 max-h-80 overflow-y-auto'>
                                            <div className="flex items-center text-sm p-2 hover:bg-soft_cyan rounded-md cursor-pointer" onClick={handleQuizChronicle}>
                                                <MdHistory size={18} className="mr-2" />
                                                Quiz History
                                            </div>
                                        </div>
                                    )   
                                }
                {
                    isDeleteChatModalOpen && (
                    <ConfimationModal
                        isOpen={isDeleteChatModalOpen}
                        onClose = {() => setIsDeleteChatModalOpen(false)}
                        onConfirm = {handleDeleteConfirm}
                        message = "Are you sure you want to delete this chat session?"
                        confirmText = "yes"
                        cancelText = "No"
                    />
                    )
                }
                
            </div>
        ))
        }
        </div>
            </div>
        </div>
    );
};

export default SideBar;
