import React from 'react'

const Heading2 = ({ text }) => {
  return (
    <div className='p-2 border-b border-primary max-w-xl mb-8'>
        <h2 className='text-2xl text-dark_gray font-bold my-4'>
            {text}
        </h2>
    </div>
  )
}

export default Heading2