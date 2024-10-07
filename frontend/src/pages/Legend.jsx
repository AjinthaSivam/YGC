import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Historical from '../components/historical/Historical'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const Legend = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <PremiumProvider>
      <div className='bg-white h-screen flex flex-col'>
        <div className='z-50'>
          <NavBar />
        </div>
        <div className='flex-1 flex overflow-hidden'>
          <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className={`flex-1 overflow-auto z-30 ${sidebarOpen ? 'sm:ml-80' : 'ml-16'} duration-300`}> {/* Added z-30 for Chat */}
            <Historical />
          </div>
        </div>
      </div>
    </PremiumProvider>
    
  )
}

export default Legend