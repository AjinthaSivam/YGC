import React from 'react'
import { RiDeleteBin7Line } from "react-icons/ri";

const DeleteButton = ({ onClick }) => {
  return (
    <div className='relative group'>
        <button onClick={onClick} className='flex items-center text-primary hover:bg-primary hover:text-light_gray hover:rounded-full p-2 hover:text-light_gray' aria-label='New Chat'>
            <RiDeleteBin7Line size={18} />
        </button>
        <span className="absolute -left-3 top-full mt-2 w-max bg-gray-800 text-secondary text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            Delete
        </span>
    </div>
  )
}

export default DeleteButton