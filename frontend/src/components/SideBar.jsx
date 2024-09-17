import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { GrResources } from "react-icons/gr";
import { MdOutlineQuiz, MdOutlineChatBubbleOutline } from "react-icons/md";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const SideBar = ({ setSelectedComponent, setSelectedQuizDifficulty }) => {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('');

    const navigate = useNavigate()

    const menus = [
        { name: "Chat Bot", key: 'chatbot', icon: MdOutlineChatBubbleOutline, path: '/generalchat' },
        { name: "Past Papers", key: 'pastpapers', icon: GrResources, path: '/pastpapercard' },
        { name: "Quiz", key: 'quiz', icon: MdOutlineQuiz, path: '/quizstart'},
        { name: "Historical Character", key: 'historicalCharacter', icon: FaUserAstronaut, path: '/legend' },
    ];

    const handleMenuClick = (menu) => {
            navigate(menu.path)
            // setSelectedComponent(menu.key);
            // setSelectedMenu(menu.key);  // Update selected menu
        
    };

    const handleSubmenuClick = (submenu) => {
        setSelectedQuizDifficulty(submenu.key);
        setSelectedComponent('quizIntro');
        setSelectedMenu('quiz'); // Set menu as selected when a submenu item is clicked
    };

    return (
        <div className='bg-[#F5F5F5]'>
            <div className={`bg-[#e6fbfa] h-full ${open ? "w-72" : "w-16"} duration-500 text-[#2d3137] px-4`}>
                <div className='py-5 flex justify-end'>
                    <HiMenuAlt3 size={26} className='cursor-pointer' onClick={() => setOpen(!open)} />
                </div>
                <div className='mt-4 flex flex-col gap-4 relative z-1000'>
                    {
                        menus.map((menu, i) => (
                            <div key={i}>
                                <div
                                    onClick={() => handleMenuClick(menu)}
                                    className={`group ${menu.margin && 'mt-5'} flex items-center gap-3.5 font-medium p-2 hover:bg-[#b4f2ef] rounded-md cursor-pointer ${selectedMenu === menu.key ? 'bg-[#b4f2ef]' : ''}`}
                                >
                                    <div>
                                        {React.createElement(menu.icon, { size: '20' })}
                                    </div>
                                    <h2 className={`whitespace-pre ${!open && 'opacity-0 overflow-hidden'}`}>{menu.name}</h2>
                                    <h2
                                        className={`${open && 'hidden'} absolute whitespace-pre left-48 bg-[#F5F5F5] text-sm font-semibold text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                                    >
                                        {menu.name}
                                    </h2>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default SideBar;
