import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'

import { useLocation } from 'react-router-dom'
import MCQGenerator from '../components/quiz/Quiz'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const QuizContent = () => {
    const location = useLocation()

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { difficulty, category } = location.state || { difficulty: '', category: '' }
    return (
      <PremiumProvider>
        <div className='bg-white h-screen flex flex-col'>
          <div className='z-50'>
            <NavBar />
          </div>
          <div className='flex-1 flex overflow-hidden'>
            <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className={`flex-1 overflow-auto z-30 ${sidebarOpen ? 'sm:ml-80' : 'ml-16'} duration-300`}>
            <MCQGenerator difficulty={difficulty} category={category}  />
            </div>
          </div>
        </div>
      </PremiumProvider>
    )
}

export default QuizContent