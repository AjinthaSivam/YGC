import React, { useState, useEffect } from 'react'
import { MdError } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

const ErrorMessage = ({ message, isPersistent = false, onReload=false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const duration = 5000;

  useEffect(() => {
    if (!isPersistent) {
      setTimeout(() => {
        setIsVisible(false);
        if (onReload){
          window.location.reload();
        }
        
      }, duration);
    }
  }, [duration, isPersistent]);


  const handleClose = () => {
    setIsVisible(false)
    if (onReload){
      window.location.reload();
    }
  }

  return (
    <>
    {
      isVisible && (
        <div className='fixed bottom-0 right-2 transform -translate-y-1/2 z-50 flex flex-col p-4 bg-red-200 text-xs sm:text-sm text-red-800 max-w-md text-center rounded-lg shadow-lg'>
          <div className='flex justify-end '>
          <button className='p-1 hover:bg-red-800 hover:text-light_gray hover:rounded-full' onClick={handleClose}>
              <IoIosClose size={18} />
            </button>
          </div>
            
            <div className='flex items-center gap-2 right-2'>
              <MdError size={24} />
              {message} 
            </div>
        </div>
      )
    }
    </>
    
  )
}

export default ErrorMessage