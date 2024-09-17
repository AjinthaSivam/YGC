import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Historical from '../components/historical/Historical'

const Legend = () => {
  return (
    <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
            <SideBar />
            <Historical />
        </div>
        
    </div>
  )
}

export default Legend