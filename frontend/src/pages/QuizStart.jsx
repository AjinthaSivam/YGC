import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import QuizIntro from '../components/quiz/QuizIntro'
import { useNavigate } from 'react-router-dom'
import { PremiumProvider } from '../components/contexts/PremiumContext'

const QuizStart = () => {
    const [difficulty, setDifficulty] = useState('')
    const [category, setCategory] = useState('')

    const navigate = useNavigate()

    const handleStartQuiz = (difficulty, category) => {
        setDifficulty(difficulty)
        setCategory(category)
        navigate('/quiz', { state: { difficulty, category } })
    }
  return (
    <PremiumProvider>
      <div className='bg-white h-screen flex flex-col'>
        <div className='z-50'> {/* Added z-50 for Navbar */}
          <NavBar />
        </div>
        <div className='flex-1 flex overflow-hidden'>
          <SideBar />
          <div className='flex-1 overflow-auto z-30'>
            <QuizIntro onStartQuiz={handleStartQuiz} difficulty={difficulty} category={category} />
          </div>
        </div>
      </div>
    </PremiumProvider>
    
  )
}

export default QuizStart