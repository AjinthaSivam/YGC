import React from 'react'
import '../styles/custom.css'


const CustomScrollbar = ({ children, className = "", containerClassName = "", trackColor = "white" }) => {
  return (
    <div 
      className={`custom-scrollbar ${className}`} 
      style={{ '--scrollbar-track': trackColor, maxHeight: '100%', overflowY: 'auto' }}
    >
      <div className={containerClassName}>
        {children}
      </div>
    </div>
  )
}

export default CustomScrollbar