import React from 'react'

const ConformationModal = ({ show, onConfirm, onCancel }) => {
    if (!show) return null
  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
        <div className='bg-white text-xs sm:text-sm p-6 rounded-lg shadow-lg'>
            <p>Do you want to try again?</p>
            <div className='flex justify-end mt-4'>
                <button onClick={onCancel} className='px-4 py-2 mr-2 bg-white border border-primary text-primary rounded-full'>No</button>
                <button onClick={onConfirm} className='px-4 py-2 bg-primary text-light_gray rounded-full'>Yes</button>
            </div>
        </div>

    </div>
  )
}

export default ConformationModal