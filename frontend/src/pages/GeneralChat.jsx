import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Chat from '../components/chat/Chat'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const GeneralChat = () => {
  return (
    <PremiumProvider>
      <div className='bg-white'>
          <NavBar />
          <div className='h-screen flex pt-16'>
              <SideBar />
              <Chat />
          </div>
          
      </div>
    </PremiumProvider>
  )
}

export default GeneralChat