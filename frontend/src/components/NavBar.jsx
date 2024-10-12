import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";
import { useAuth } from '../AuthContext';
import { usePremium } from './contexts/PremiumContext';
import { FaCrown, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const NavBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isPremium, setIsPremium } = usePremium();
  const [isDropDown, setIsDropDown] = useState(false);

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      setIsLoading(true)
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
      } finally {
        setIsLoading(false)
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
    <nav className='fixed flex top-0 left-0 right-0 shadow-md bg-primary py-4 px-6 items-center'>
      <div className='w-1/3'> {/* Left spacer */}
      <div className='hidden sm:block'>
        {!isLoading && (
          
            isPremium ? (
              <div className="relative inline-block">
                <span className="bg-white text-dark_gray px-4 py-2 rounded-full font-semibold flex items-center">
                  <FaCrown className="mr-2 text-dark_gray" />
                  Elite Member
                </span>
              </div>
            ) : (
              <div className="relative inline-block">
                <span className="bg-dark_gray text-white px-4 py-2 rounded-full font-semibold flex items-center">
                  <FaShieldAlt className="mr-2 text-white" />
                  Standard Learner
                </span>
              </div>
              
            )
          
        )}
        </div>
        
      </div>
      
      <div className='w-1/3 flex justify-center'> {/* Center title */}
        <p className='text-md sm:text-2xl font-bold text-white'>
          E D U T E C H
        </p>
      </div>
      
      <div className='w-1/3 flex justify-end'> {/* Right-aligned user menu */}
        <div className='relative'>
          <div onClick={toggleDropDown} className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-secondary'>
            {initials}
          </div>
          {isDropDown && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50'>
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href='#'
                  onClick={item.action}
                  className='flex items-center px-4 py-2 text-base text-gray-700 hover:bg-gray-200'
                >
                  <span className='mr-2'>{item.icon}</span>
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
