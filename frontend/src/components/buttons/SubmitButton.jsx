import React from 'react'

const SubmitButton = ({ text, onClick, disabled, type }) => {
  return (
    <button
        type={type}
        className='bg-primary rounded-full text-light_gray py-2 px-4 mt-4 mb-4 hover:scale-105 duration-300'
        onClick={onClick}
        disabled={disabled}
    >
        {text}
    </button>
  )
}

export default SubmitButton