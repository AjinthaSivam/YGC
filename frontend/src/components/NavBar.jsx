import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { useAuth } from '../AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDropDown, setIsDropDown] = useState(false);

  const toggleDropDown = () => {
    setIsDropDown(!isDropDown);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      logout();
      navigate('/signin');
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = [
    // { name: 'Profile', icon: <FaRegCircleUser size={20} /> },
    // { name: 'Settings', icon: <TbSettings size={20} /> },
    { name: 'Log Out', icon: <MdOutlineLogout size={20} />, action: handleLogout },
  ];

  const username = localStorage.getItem('username') || '';
  const initials = username.substring(0, 2).toUpperCase();

  return (
    <nav className='fixed flex top-0 left-0 right-0 shadow-md bg-[#04aaa2] py-4 px-6 justify-between items-center'>
      <div className='flex-1 flex justify-center'>
        <h1 className='text-xl text-[#ffffff] font-bold'>E D U T E C H</h1>
      </div>
      <div className='flex-shrink-0'>
        <div onClick={toggleDropDown} className='w-10 h-10 rounded-full bg-[#ffffff] flex items-center justify-center text-[#04bdb4] font-bold cursor-pointer hover:bg-[#e6fbfa]'>
          {initials}
        </div>
        {isDropDown && (
          <div className='absolute right-0 mt-2 mr-4 w-48 bg-white rounded-md shadow-lg py-2'>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href='#'
                onClick={item.action}
                className='flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-100'
              >
                <span className='mr-2'>{item.icon}</span>
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
