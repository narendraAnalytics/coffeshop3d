import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Contact from './components/Contact'
import IntroScreen from './components/IntroScreen'

function App() {
  const [showIntro, setShowIntro] = useState(
    () => sessionStorage.getItem('intro_seen') !== '1'
  )

  return (
    <>
      {showIntro && (
        <IntroScreen onComplete={() => setShowIntro(false)} />
      )}
      <main style={{ background: '#1a0f0a', overflowX: 'hidden' }}>
        <Navbar />
        <Hero />
        <Menu />
        <About />
        <Contact />
      </main>
    </>
  )
}

export default App
