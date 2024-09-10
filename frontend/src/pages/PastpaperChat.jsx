import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import ToggleBot from '../components/ToggleBot'
import { useLocation } from 'react-router-dom'

const PastpaperChat = () => {
  const location = useLocation()

  const year = location.state || { year: '' }
  return (
    <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
            <SideBar />
            <ToggleBot selected_year={year} />
        </div>
    </div>
  )
}

export default PastpaperChat