import React from 'react'

const UserMessage = ({ text, time }) => {
    const formatTime = (time) => {
        if (!(time instanceof Date)) return '';
        return time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      };
  return (
    <div className="flex justify-end mt-4 mb-6">
      <div className="relative max-w-3xl p-4 rounded-lg sm:text-sm text-xs bg-primary text-light_gray">
        <div className='whitespace-pre-line'>{text}</div>
        <p className="absolute bottom-1 right-2 text-xs text-gray-300">
          {formatTime(time)}
        </p>
      </div>
    </div>
  )
}

export default UserMessage