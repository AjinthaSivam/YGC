import React from 'react'
import { MdOutlineHistory } from "react-icons/md";

const HistotyButton = ({ onClick }) => {
  return (
    <div className='relative group'>
        <button onClick={onClick} className='flex items-center text-primary hover:bg-secondary hover:rounded-full p-2 hover:text-light_gray hover:bg-primary' aria-label='New Chat'>
            <MdOutlineHistory size={25} />
        </button>
        <span className="absolute left-0 top-full mt-2 w-max bg-gray-800 text-secondary text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            Quiz History
        </span>
    </div>
  )
}

export default HistotyButton