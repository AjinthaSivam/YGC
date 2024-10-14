import React from 'react'

const SubmitButton = ({ text, onClick, disabled }) => {
  return (
    <button
        type='submit'
        className='bg-primary rounded-full text-light_gray py-2 mt-4 mb-4 hover:scale-105 duration-300'
        onClick={onClick}
        disabled={disabled}
    >
        {text}
    </button>
  )
}

export default SubmitButton