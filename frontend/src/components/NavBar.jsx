import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import { TbSettings } from "react-icons/tb";
import { useAuth } from '../AuthContext';
import { usePremium } from './contexts/PremiumContext';
import { BsStars } from "react-icons/bs";
import { FaCrown, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL


const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isPremium, setIsPremium } = usePremium();
  const [isDropDown, setIsDropDown] = useState(false);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/learner/check_premium`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
      });
      console.log('premium status', response.data)
      setIsPremium(response.data.is_premium);
      } catch (error) {
        console.error('Error fetching premium status:', error);
      }
    };

    fetchPremiumStatus();
  }, []);

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
    { name: 'Log Out', icon: <MdOutlineLogout size={20} />, action: handleLogout },
  ];

  const username = localStorage.getItem('username') || '';
  const initials = username.substring(0, 2).toUpperCase();

  return (
    <nav className='fixed flex top-0 left-0 right-0 shadow-md bg-[#04aaa2] py-4 px-6 justify-between items-center'>
      <div className='flex-1 flex justify-center'>
      <p className='text-2xl font-bold text-white'>
        E D U T E C H
      </p>
      </div>
      {isPremium ? (
      <div className="relative inline-block mr-2">
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
            <FaCrown className="mr-2 text-white" />
            Elite Member
        </span>
        <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
            PRO
          </span>
        </div>
      ) : (
        <div className="relative inline-block mr-2">
        <span className="bg-gradient-to-r from-[#D3D3D3] to-[#808080] text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center animate-pulse duration-300">
            <FaShieldAlt className="mr-2 text-white" />
            Standard Learner
        </span>
        </div>
      )}
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
