import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Contact from './components/Contact'
import IntroScreen from './components/IntroScreen'
import ProfilePage from './components/ProfilePage'
import ChatBot from './components/ChatBot'

function App() {
  const [showIntro, setShowIntro] = useState(
    () => sessionStorage.getItem('intro_seen') !== '1'
  )
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}
      <main className="app-main">
        <Navbar onProfileOpen={() => setShowProfile(true)} />
        <Hero />
        <Menu />
        <About />
        <Contact />
      </main>
      {showProfile && (
        <ProfilePage onClose={() => setShowProfile(false)} />
      )}
      <ChatBot />
    </>
  )
}

export default App
