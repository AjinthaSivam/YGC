import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'

import { useLocation } from 'react-router-dom'
import MCQGenerator from '../components/quiz/Quiz'

const QuizContent = () => {
    const location = useLocation()

    const { difficulty, category } = location.state || { difficulty: '', category: '' }
  return (
    <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
            <SideBar />
            <MCQGenerator difficulty={difficulty} category={category} />
        </div>
    </div>
  )
}

export default QuizContent