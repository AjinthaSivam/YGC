import React, { useState } from 'react'
import QuizReview from '../components/quiz/QuizReview'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { PremiumProvider } from '../components/contexts/PremiumContext'


const QuizReviewPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
      <PremiumProvider>
          <div className='bg-white h-screen flex flex-col'>
              <div className='z-50'> {/* Added z-50 for Navbar */}
              <NavBar />
              </div>
              <div className='flex-1 flex overflow-hidden'>
                  <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
                  <div className={`flex-1 overflow-auto z-30 ${sidebarOpen ? 'sm:ml-80' : 'ml-16'} duration-300`}>
                      <QuizReview />
                  </div>
              </div>
          </div>
      </PremiumProvider>
    )
}

export default QuizReviewPage