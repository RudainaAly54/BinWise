import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'
import RecyclingMatters from '../components/RecyclingMatters'
import RecyclingProgram from '../components/RecyclingProgram'
import Features from '../components/Features'
import Testmonials from '../components/Testmonials'
import Footer from '../components/Footer'
import Contact from '../components/Contact'

const Home = () => {
  return (
    <div >
      <NavBar/>
      <div className='flex flex-col min-h-screen overflow-x-hidden'>
        <Header/>
        <RecyclingMatters/>
        <RecyclingProgram/>
        <Testmonials/>
        <Features/>
        <Contact/>
        <Footer/>
      </div>
    </div>
  )
}

export default Home
