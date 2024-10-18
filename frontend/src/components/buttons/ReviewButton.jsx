import React from 'react'
import { MdOutlineReviews } from "react-icons/md";

const ReviewButton = ({ onClick }) => {
  return (
    <div className='relative group'>
        <button onClick={onClick} className='flex items-center text-primary hover:bg-primary hover:text-light_gray hover:rounded-full p-2' aria-label='New Chat'>
            <MdOutlineReviews size={18} />
        </button>
        <span className="absolute left-0 top-full mt-2 w-max bg-gray-800 text-secondary text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            Review
        </span>
    </div>
  )
}

export default ReviewButton