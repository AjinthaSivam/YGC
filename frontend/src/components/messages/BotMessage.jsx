import React from 'react'
import BotLogo from '../../assets/images/bot.png'

const BotMessage = ({ text, time, speaker }) => {
    const formatTime = (time) => {
        if (!(time instanceof Date)) return '';
        return time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      };
  return (
    <div className="flex justify-start mt-4 mb-6">
      <div className="relative max-w-3xl p-4 rounded-lg sm:text-sm text-xs bg-secondary text-dark_gray">
        <img src={speaker || BotLogo} alt="speaker" className="absolute left-2 rounded-full -top-4 h-8 w-8" />
        <div className='whitespace-pre-line space-y-4' dangerouslySetInnerHTML={{ __html: text }} />
        <p className="absolute bottom-1 right-2 text-xs text-gray-500">
          {formatTime(time)}
        </p>
      </div>
    </div>
  )
}

export default BotMessage