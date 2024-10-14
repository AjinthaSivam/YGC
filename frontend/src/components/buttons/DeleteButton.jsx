import React from 'react'
import { RiDeleteBin7Line } from "react-icons/ri";

const DeleteButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className='cursor-pointer text-gray-500 hover:text-red-500'>
        <RiDeleteBin7Line size={18} />
    </button>
  )
}

export default DeleteButton