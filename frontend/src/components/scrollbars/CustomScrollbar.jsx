import React from 'react'

const CustomScrollbar = ({ children, className = "" }) => {
  return (
    <div className={`overflow-auto ${className}`}>
      <div className="scrollbar-thin scrollbar-thumb-[#b4f2ef] scrollbar-track-[#e6fbfa] hover:scrollbar-thumb-[#7ee8e4]">
        {children}
      </div>
    </div>
  )
}

export default CustomScrollbar