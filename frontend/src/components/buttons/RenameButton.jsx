import React from 'react'
import { FiEdit2 } from "react-icons/fi";

const RenameButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className='cursor-pointer text-gray-500'>
        <FiEdit2 size={17} />
    </button>
  )
}

export default RenameButton