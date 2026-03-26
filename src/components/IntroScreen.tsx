import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import './IntroScreen.css'

interface IntroScreenProps {
  onComplete: () => void
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [isExiting, setIsExiting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', delay: 0.8 }
    )
  }, [])

  const handleWelcomeClick = () => {
    if (isExiting) return
    setIsExiting(true)
    sessionStorage.setItem('intro_seen', '1')

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: onComplete,
    })
  }

  return (
    <div ref={containerRef} className="intro-container">
      <video
        className="intro-video"
        src="/videos/openingmedia.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <div className="intro-gradient" />

      <div ref={overlayRef} className="intro-overlay">
        <button
          className={`intro-btn${isExiting ? ' intro-btn--exiting' : ''}`}
          onClick={handleWelcomeClick}
          disabled={isExiting}
        >
          Welcome
        </button>
      </div>
    </div>
  )
}
