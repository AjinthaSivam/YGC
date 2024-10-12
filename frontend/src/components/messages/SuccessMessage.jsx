import React from 'react'
import { MdCheckCircle } from 'react-icons/md'
const SuccessMessage = ({ message }) => {
  return (
    <div className='relative flex items-center gap-2 right-2 p-4 bg-green-200 text-xs sm:text-sm text-green-800 max-w-md text-center rounded-lg shadow-lg'>
        <MdCheckCircle size={24} />
        {message}
    </div>
  )
}

export default SuccessMessage