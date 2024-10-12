import React from 'react'
import './ThinkingMessage.css';

const ThinkingMessage = () => {
  return (
    <div className="flex justify-start mt-2 mb-2">
        <div className="thinking-container">
            <div className="dot-flashing"></div>
        </div>
    </div>  
  )
}

export default ThinkingMessage