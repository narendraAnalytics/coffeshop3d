import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logoSrc from '../../images/logoimage.png'
import './Navbar.css'

export default function Navbar() {
  const navRef         = useRef<HTMLElement>(null)
  const logoWrapperRef = useRef<HTMLAnchorElement>(null)
  const textLogoRef    = useRef<HTMLSpanElement>(null)
  const imgLogoRef     = useRef<HTMLImageElement>(null)
  const linksRef       = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const nav         = navRef.current
    const logoWrapper = logoWrapperRef.current
    const textLogo    = textLogoRef.current
    const imgLogo     = imgLogoRef.current
    const links       = linksRef.current
    if (!nav || !logoWrapper || !textLogo || !imgLogo || !links) return

    let rafId: number | null = null
    let rotY = 0

    const logoTrigger = ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onEnter: () => {
        const navRect = nav.getBoundingClientRect()
        const wRect   = logoWrapper.getBoundingClientRect()
        const centerX = navRect.width / 2 - (wRect.left - navRect.left) - wRect.width / 2

        // Fade links immediately
        gsap.to(links, { opacity: 0.35, duration: 0.4 })

        // Step 1 — flip text to edge
        gsap.to(textLogo, {
          rotationY: 90,
          duration: 0.28,
          ease: 'power2.in',
          transformPerspective: 700,
          onComplete() {
            // Step 2 — swap elements
            gsap.set(textLogo, { display: 'none' })
            gsap.set(imgLogo,  { display: 'block', rotationY: -90, transformPerspective: 700 })

            // Step 3 — flip image in
            gsap.to(imgLogo, {
              rotationY: 0,
              duration: 0.28,
              ease: 'power2.out',
              transformPerspective: 700,
            })

            // Step 3b — slide wrapper to center, then start spin on complete
            gsap.to(logoWrapper, {
              x: centerX,
              duration: 0.55,
              ease: 'power2.out',
              delay: 0.05,
              onComplete() {
                // Step 4 — continuous RAF coin spin
                rotY = 0
                const spin = () => {
                  rotY = (rotY + 1.5) % 360
                  gsap.set(imgLogo, { rotationY: rotY, transformPerspective: 700 })
                  rafId = requestAnimationFrame(spin)
                }
                rafId = requestAnimationFrame(spin)
              },
            })
          },
        })
      },

      onLeaveBack: () => {
        // Stop spin, snap to face-forward
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
        gsap.set(imgLogo, { rotationY: 0 })

        // Restore links and slide wrapper back simultaneously
        gsap.to(links, { opacity: 1, duration: 0.4 })
        gsap.to(logoWrapper, { x: 0, duration: 0.55, ease: 'power2.out' })

        // Flip image away, then swap to text
        gsap.to(imgLogo, {
          rotationY: 90,
          duration: 0.28,
          ease: 'power2.in',
          transformPerspective: 700,
          onComplete() {
            gsap.set(imgLogo,  { display: 'none' })
            gsap.set(textLogo, { display: 'inline-block', rotationY: -90, transformPerspective: 700 })
            gsap.to(textLogo, {
              rotationY: 0,
              duration: 0.28,
              ease: 'power2.out',
              transformPerspective: 700,
            })
          },
        })
      },
    })

    return () => {
      logoTrigger.kill()
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
    }
  }, [])

  return (
    <nav ref={navRef} className="navbar">

      {/* Logo wrapper — translates to center on scroll */}
      <a ref={logoWrapperRef} href="#" className="navbar-logo-wrapper">

        {/* TEXT logo — shown at page top */}
        <span ref={textLogoRef} className="navbar-text-logo">
          Sunrise<span className="navbar-text-logo-dot">.</span>
        </span>

        {/* IMAGE logo — hidden at top, appears after coin flip */}
        <img
          ref={imgLogoRef}
          src={logoSrc}
          alt="Sunrise"
          className="navbar-img-logo"
        />
      </a>

      {/* Nav links */}
      <ul ref={linksRef} className="navbar-links">
        {['Menu', 'Story', 'Contact'].map((link) => (
          <li key={link}>
            <a href={`#${link.toLowerCase()}`} className="navbar-link">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
