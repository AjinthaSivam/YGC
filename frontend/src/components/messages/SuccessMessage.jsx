import React, { useState, useEffect } from 'react'
import { MdCheckCircle } from 'react-icons/md'

const SuccessMessage = ({ message, isPersistent=false }) => {
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
    <div className='fixed bottom-0 right-2 transform -translate-y-1/2 z-50 flex items-center gap-2 right-2 p-4 bg-green-200 text-xs sm:text-sm text-green-800 max-w-md text-center rounded-lg shadow-lg'>
        <MdCheckCircle size={24} />
        {message}
    </div>
  )
}

export default SuccessMessage