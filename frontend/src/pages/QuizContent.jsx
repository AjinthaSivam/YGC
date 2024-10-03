import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'

import { useLocation } from 'react-router-dom'
import MCQGenerator from '../components/quiz/Quiz'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const QuizContent = () => {
    const location = useLocation()

    const { difficulty, category } = location.state || { difficulty: '', category: '' }
    return (
      <PremiumProvider>
        <div className='bg-white h-screen flex flex-col'>
          <div className='z-50'>
            <NavBar />
          </div>
          <div className='flex-1 flex overflow-hidden'>
            <SideBar />
            <MCQGenerator difficulty={difficulty} category={category} />
          </div>
        </div>
      </PremiumProvider>
    )
}

export default QuizContent