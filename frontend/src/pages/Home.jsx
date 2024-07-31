import React from 'react'
import SideBar from '../components/SideBar'
import Chat from '../components/Chat'
import NavBar from '../components/NavBar'
import { Route, Routes } from 'react-router-dom'
import Quiz from '../components/Quiz'
import Main from '../components/Main'

const Home = () => {
  return (
    <div className='bg-white'>
      <NavBar />
      <Main />
        
    </div>
    
  )
}

export default Home