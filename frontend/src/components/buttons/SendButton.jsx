import React from 'react'
import { MdArrowUpward } from 'react-icons/md'

const SendButton = ({ onClick, disabled }) => {
  return (
    <button 
    onClick={onClick} 
    disabled={disabled} 
    className='flex items-center justify-center px-0 sm:p-2 bg-primary text-light_gray rounded-full ml-2 hover:bg-strong_cyan w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0'
    >
        <MdArrowUpward size={20} className='sm:w-6 sm:h-6' />
    </button>
  )
}

export default SendButton