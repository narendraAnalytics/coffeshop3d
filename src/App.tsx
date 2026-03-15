import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Contact from './components/Contact'

function App() {
  return (
    <main style={{ background: '#1a0f0a', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Menu />
      <About />
      <Contact />
    </main>
  )
}

export default App
