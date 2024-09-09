import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import PastPaper from '../components/PastPaper'

const PastpaperCard = () => {
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [selectedYear, setSelectedYear] = useState('')

  const handleSelectPaper = (paperUrl) => {
    setSelectedPaper(paperUrl)
  }

  const handleSelectYear = (year) => {
    setSelectedYear(year)
  }
  return (
    <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
            <SideBar />
            <PastPaper  onSelectPaper={handleSelectPaper} onSelectYear={handleSelectYear}/>
        </div>
        
    </div>
  )
}

export default PastpaperCard