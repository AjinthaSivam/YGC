import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Historical from '../components/historical/Historical'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const Legend = () => {
  return (
    <PremiumProvider>
      <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
          <SideBar />
          <Historical />
        </div>
      </div>
    </PremiumProvider>
    
  )
}

export default Legend