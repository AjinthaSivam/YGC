import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Chat from '../components/chat/Chat'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const GeneralChat = () => {
  return (
    <PremiumProvider>
      <div className='bg-white h-screen flex flex-col'>
        <div className='z-50'> {/* Added z-50 for Navbar */}
          <NavBar />
        </div>
        <div className='flex-1 flex overflow-hidden'>
          <SideBar />
          <div className='flex-1 overflow-auto z-30'> {/* Added z-30 for Chat */}
            <Chat />
          </div>
        </div>
      </div>
    </PremiumProvider>
  )
}

export default GeneralChat