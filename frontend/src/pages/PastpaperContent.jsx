import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Paper from '../components/Paper'
import ToggleBot from '../components/ToggleBot'
import { useParams } from 'react-router-dom'

const PastpaperContent = () => {

    const { year } = useParams()
    const [pdfUrl, setPdfUrl] = useState(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    useEffect (() => {
        const fetchPdfUrl = async () => {
            const url = `/pastpapers/${year}.pdf`
            setPdfUrl(url)
        }

        fetchPdfUrl()
    }, [year])

    useEffect (() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)       
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    })
  return (
    <div className='bg-white'>
        <NavBar />
        <div className='h-screen flex pt-16'>
            <SideBar />
            <div className='w-full p-4'>
                <Paper 
                    pdfUrl={pdfUrl} 
                    isChatOpen={isChatOpen} 
                    toggleChat={toggleChat} 
                    selected_year={year}
                    isMobile={isMobile} 
                />
            </div>
        </div>
        
    </div>
  )
}

export default PastpaperContent