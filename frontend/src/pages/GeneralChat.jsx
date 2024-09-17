import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Chat from '../components/chat/Chat'

const GeneralChat = () => {
  return (
    <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
            <SideBar />
            <Chat />
        </div>
        
    </div>
  )
}

export default GeneralChat