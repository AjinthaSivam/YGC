import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Historical from '../components/historical/Historical'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const Legend = () => {
  return (
    <PremiumProvider>
      <div className='bg-white h-screen flex flex-col'>
        <div className='z-50'>
          <NavBar />
        </div>
        <div className='flex-1 flex overflow-hidden'>
          <SideBar />
          <div className='flex-1 overflow-auto z-30'> {/* Added z-30 for Chat */}
            <Historical />
          </div>
        </div>
      </div>
    </PremiumProvider>
    
  )
}

export default Legend