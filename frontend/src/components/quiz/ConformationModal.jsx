import React from 'react'

const ConformationModal = ({ show, onConfirm, onCancel }) => {
    if (!show) return null
  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-60'>
        <div className='bg-white p-6 text-xs sm:text-sm rounded-lg shadow-lg'>
            <p>Are you sure you <br/> want to finish the quiz?</p>
            <div className='flex justify-center mt-4'>
                <button onClick={onCancel} className='px-4 py-2 mr-2 bg-white border border-primary text-primary rounded-full'>No</button>
                <button onClick={onConfirm} className='px-4 py-2 bg-primary text-light_gray rounded-full'>Yes</button>
            </div>
        </div>

    </div>
  )
}

export default ConformationModal