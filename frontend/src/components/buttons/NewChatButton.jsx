import React from 'react'
import { HiMiniPencilSquare } from "react-icons/hi2"; 

const NewChatButton = ( {handleNewChat} ) => {
  return (
    <div className='relative group'>
        <button onClick={handleNewChat} className='flex items-center text-primary hover:bg-secondary hover:rounded-full p-2 hover:text-strong_cyan' aria-label='New Chat'>
            <HiMiniPencilSquare size={25} />
        </button>
        <span className="absolute left-0 top-full mt-2 w-max bg-gray-800 text-secondary text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            New Chat
        </span>
    </div>
  )
}

export default NewChatButton