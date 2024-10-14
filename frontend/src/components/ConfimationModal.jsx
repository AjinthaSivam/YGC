import React from 'react'

const ConfimationModal = ({ isOpen, onClose, onConfirm, message, confirmText, cancelText }) => {
    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-secondary text-xs sm:text-sm p-6 rounded-lg shadow-lg">
        <p className="mb-4 text-dark_gray">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-primary border border-primary rounded-full hover:bg-soft_cyan"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-primary text-light_gray rounded-full hover:bg-soft_cyan hover:text-primary"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfimationModal