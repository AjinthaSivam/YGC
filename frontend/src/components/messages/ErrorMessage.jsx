import React, { useState, useEffect } from 'react'
import { MdError } from "react-icons/md";

const ErrorMessage = ({ message, isPersistent = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  const duration = 5000;

  useEffect(() => {
    if (!isPersistent) {
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
  }, [duration, isPersistent]);

  if (!isVisible) return null;

  return (
    <div className='relative flex items-center gap-2 right-2 p-4 bg-red-200 text-xs sm:text-sm text-red-800 max-w-md text-center rounded-lg shadow-lg'>
      <MdError size={24} />
      {message}      
    </div>
  )
}

export default ErrorMessage