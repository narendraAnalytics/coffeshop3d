import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

const FRAME_COUNT     = 300
const FRAME_COUNT_ESP = 208
const BLAST_AT        = 0.47  // scroll progress (0→1) when cup explodes — adjust to match visual
const BEANS_AT        = 0.52  // beans scatter on table just after the blast

function framePath(n: number) {
  return `/frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`
}

function framePath1(n: number) {
  return `/frames1/ezgif-frame-${String(n).padStart(3, '0')}.jpg`
}

// Draw image filling the canvas while maintaining aspect (like CSS object-fit: cover)
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  if (!img.complete || img.naturalWidth === 0) return
  const iAspect = img.naturalWidth / img.naturalHeight
  const cAspect = cw / ch
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight

  if (cAspect > iAspect) {
    sh = img.naturalWidth / cAspect
    sy = (img.naturalHeight - sh) / 2
  } else {
    sw = img.naturalHeight * cAspect
    sx = (img.naturalWidth - sw) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
}

// --- Web Audio noise buffer generators ---

function makeBrownNoise(actx: AudioContext, seconds = 2): AudioBuffer {
  const sr  = actx.sampleRate
  const buf = actx.createBuffer(1, sr * seconds, sr)
  const d   = buf.getChannelData(0)
  let last  = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    d[i]  = (last + 0.02 * w) / 1.02
    last  = d[i]
    d[i] *= 3.5
  }
  return buf
}

function makeWhiteNoise(actx: AudioContext, seconds = 2): AudioBuffer {
  const sr  = actx.sampleRate
  const buf = actx.createBuffer(1, sr * seconds, sr)
  const d   = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

// One-shot beans-on-table — 5 staggered short taps, each a single bean hitting the surface
function playBeansFalling(actx: AudioContext) {
  const t    = actx.currentTime
  const taps = [0, 0.05, 0.11, 0.18, 0.27]
  taps.forEach((offset) => {
    const src  = actx.createBufferSource()
    src.buffer = makeWhiteNoise(actx, 0.07)

    const bpf = actx.createBiquadFilter()
    bpf.type            = 'bandpass'
    bpf.frequency.value = 900 + Math.random() * 500  // 900–1400 Hz per bean
    bpf.Q.value         = 2.5

    const gain = actx.createGain()
    const vol  = 0.45 + Math.random() * 0.25          // slight volume variation
    gain.gain.setValueAtTime(vol, t + offset)
    gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.055)

    src.connect(bpf)
    bpf.connect(gain)
    gain.connect(actx.destination)
    src.start(t + offset)
    src.stop(t + offset + 0.07)
  })
}

// One-shot blast — deep thump + sharp crack, nodes self-dispose after playback
function playBlast(actx: AudioContext) {
  const t = actx.currentTime

  // Layer 1 — deep thump (sine oscillator, fast pitch drop + decay)
  const osc     = actx.createOscillator()
  const oscGain = actx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(90, t)
  osc.frequency.exponentialRampToValueAtTime(28, t + 0.18)
  oscGain.gain.setValueAtTime(1.8, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
  osc.connect(oscGain)
  oscGain.connect(actx.destination)
  osc.start(t)
  osc.stop(t + 0.45)

  // Layer 2 — sharp crack (white noise burst through bandpass)
  const noiseSrc  = actx.createBufferSource()
  noiseSrc.buffer = makeWhiteNoise(actx, 0.3)
  const bpf       = actx.createBiquadFilter()
  bpf.type             = 'bandpass'
  bpf.frequency.value  = 1200
  bpf.Q.value          = 0.8
  const noiseGain = actx.createGain()
  noiseGain.gain.setValueAtTime(1.1, t)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
  noiseSrc.connect(bpf)
  bpf.connect(noiseGain)
  noiseGain.connect(actx.destination)
  noiseSrc.start(t)
  noiseSrc.stop(t + 0.3)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imagesRef   = useRef<HTMLImageElement[]>([])
  const images1Ref  = useRef<HTMLImageElement[]>([])
  const frameObj    = useRef({ frame: 0 })
  const modeRef     = useRef<'flat' | 'espresso'>('flat')
  const [activeMode, setActiveMode] = useState<'flat' | 'espresso'>('flat')

  // Audio refs
  const audioCtxRef  = useRef<AudioContext | null>(null)
  const rollGainRef  = useRef<GainNode | null>(null)
  const musicGainRef = useRef<GainNode | null>(null)
  const bpfRef       = useRef<BiquadFilterNode | null>(null)
  const scrollingRef  = useRef(false)
  const fadeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFrameRef  = useRef(0)
  const blastFiredRef = useRef(false)
  const beansFiredRef = useRef(false)
  const sideBannerRef = useRef<HTMLImageElement>(null)
  const heroSTRef     = useRef<ScrollTrigger | null>(null)

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = framePath(i)
      img.onload = () => {
        // Render first frame as soon as it loads
        if (i === 1) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          if (canvas && ctx) {
            canvas.width  = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            drawImageCover(ctx, img, canvas.width, canvas.height)
          }
        }
      }
      images[i - 1] = img
    }

    imagesRef.current = images
  }, [])

  // Preload Espresso Coffee frames
  useEffect(() => {
    const images: HTMLImageElement[] = []
    for (let i = 1; i <= FRAME_COUNT_ESP; i++) {
      const img = new Image()
      img.src = framePath1(i)
      images[i - 1] = img
    }
    images1Ref.current = images
  }, [])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      const ctx    = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const progress = frameObj.current.frame / (FRAME_COUNT - 1)
      let img: HTMLImageElement | undefined
      if (modeRef.current === 'espresso') {
        img = images1Ref.current[Math.round(progress * (FRAME_COUNT_ESP - 1))]
      } else {
        img = imagesRef.current[Math.round(frameObj.current.frame)]
      }
      if (img?.complete) drawImageCover(ctx, img, canvas.width, canvas.height)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Web Audio setup — lazy-init on first scroll (browser autoplay policy)
  useEffect(() => {
    const initAudio = () => {
      if (audioCtxRef.current) return
      const actx = new AudioContext()
      audioCtxRef.current = actx

      const master = actx.createGain()
      master.gain.value = 0.7
      master.connect(actx.destination)

      // Cup roll — brown noise through bandpass filter
      const rollSrc = actx.createBufferSource()
      rollSrc.buffer = makeBrownNoise(actx)
      rollSrc.loop   = true
      const bpf = actx.createBiquadFilter()
      bpf.type           = 'bandpass'
      bpf.frequency.value = 120
      bpf.Q.value         = 1.5
      const rollGain = actx.createGain()
      rollGain.gain.value = 0
      rollSrc.connect(bpf)
      bpf.connect(rollGain)
      rollGain.connect(master)
      rollSrc.start()
      bpfRef.current      = bpf
      rollGainRef.current = rollGain

      // Pleasant music — Cmaj7 chord pad (4 triangle oscillators)
      const musicGain = actx.createGain()
      musicGain.gain.value = 0
      const notes = [
        { freq: 261.63, detune: -4 },
        { freq: 329.63, detune: -1 },
        { freq: 392.00, detune:  1 },
        { freq: 493.88, detune:  4 },
      ]
      notes.forEach(({ freq, detune }) => {
        const osc = actx.createOscillator()
        osc.type            = 'triangle'
        osc.frequency.value = freq
        osc.detune.value    = detune
        osc.connect(musicGain)
        osc.start()
      })
      musicGain.connect(master)
      musicGainRef.current = musicGain
    }

    window.addEventListener('scroll', initAudio, { once: true })
    return () => {
      window.removeEventListener('scroll', initAudio)
      audioCtxRef.current?.close()
    }
  }, [])

  // GSAP ScrollTrigger setup
  useEffect(() => {
    const canvas  = canvasRef.current
    const section = sectionRef.current
    const ctx     = canvas?.getContext('2d')
    if (!canvas || !section || !ctx) return

    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Banner: set initial off-screen state, then drive via frame progress
    gsap.set(sideBannerRef.current, { x: '-150%', opacity: 0 })
    const setBannerX       = gsap.quickSetter(sideBannerRef.current, 'x', '%')
    const setBannerOpacity = gsap.quickSetter(sideBannerRef.current, 'opacity')

    const updateBanner = (progress: number) => {
      const SLIDE_IN_END  = 0.04   // fully visible   (~frame 3)
      const HOLD_END      = 0.15   // starts leaving  (~frame 11)
      const SLIDE_OUT_END = 0.20   // fully gone      (~frame 15)

      if (progress <= SLIDE_IN_END) {
        const t = progress / SLIDE_IN_END
        const e = t * (2 - t)                  // ease-out
        setBannerX(-150 + 150 * e)
        setBannerOpacity(e)
      } else if (progress <= HOLD_END) {
        setBannerX(0)
        setBannerOpacity(1)
      } else if (progress <= SLIDE_OUT_END) {
        const t = (progress - HOLD_END) / (SLIDE_OUT_END - HOLD_END)
        const e = t * t                        // ease-in
        setBannerX(-150 * e)
        setBannerOpacity(1 - e)
      } else {
        setBannerX(-150)
        setBannerOpacity(0)
      }
    }

    // Drives both audio parameters based on scroll progress (0→1)
    const updateAudio = (progress: number) => {
      const actx      = audioCtxRef.current
      const rollGain  = rollGainRef.current
      const musicGain = musicGainRef.current
      const bpf       = bpfRef.current
      if (!actx || !rollGain || !musicGain || !bpf) return
      if (actx.state === 'suspended') actx.resume()

      // Detect scrolling by watching frame movement
      const currentFrame = frameObj.current.frame
      if (Math.abs(currentFrame - lastFrameRef.current) > 0.05) {
        scrollingRef.current = true
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
        fadeTimerRef.current = setTimeout(() => {
          scrollingRef.current = false
          rollGainRef.current?.gain.setTargetAtTime(0, actx.currentTime, 0.15)
          musicGainRef.current?.gain.setTargetAtTime(0, actx.currentTime, 0.15)
        }, 200)
      }
      lastFrameRef.current = currentFrame

      if (!scrollingRef.current) return

      const t = actx.currentTime

      // Roll: sin arc peaks at 40% progress, gone by 75%
      const rollVol = progress < 0.75
        ? Math.sin((progress / 0.75) * Math.PI) * 0.35
        : 0
      rollGain.gain.setTargetAtTime(rollVol, t, 0.05)
      bpf.frequency.setTargetAtTime(100 + progress * 200, t, 0.05)

      // Music: Cmaj7 chord pad swells in from 40% progress
      const musicVol = Math.max(0, (progress - 0.4) / 0.6) * 0.22
      musicGain.gain.setTargetAtTime(musicVol, t, 0.08)

      // One-shot blast at the explosion frame
      if (progress >= BLAST_AT && !blastFiredRef.current) {
        blastFiredRef.current = true
        playBlast(actx)
      } else if (progress < BLAST_AT) {
        blastFiredRef.current = false  // re-arm for next forward pass
      }

      // One-shot beans-on-table sound just after the blast
      if (progress >= BEANS_AT && !beansFiredRef.current) {
        beansFiredRef.current = true
        playBeansFalling(actx)
      } else if (progress < BEANS_AT) {
        beansFiredRef.current = false  // re-arm for next forward pass
      }
    }

    const render = () => {
      const progress = frameObj.current.frame / (FRAME_COUNT - 1)

      if (modeRef.current === 'espresso') {
        const espIdx = Math.round(progress * (FRAME_COUNT_ESP - 1))
        const img = images1Ref.current[espIdx]
        if (img?.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          drawImageCover(ctx, img, canvas.width, canvas.height)
        }
      } else {
        const idx = Math.round(frameObj.current.frame)
        const img = imagesRef.current[idx]
        if (img?.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          drawImageCover(ctx, img, canvas.width, canvas.height)
        }
      }

      updateAudio(progress)
      updateBanner(progress)
    }

    // Frame scrub animation — pinned for 300vh of scroll
    const frameTween = gsap.to(frameObj.current, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=300%',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
      },
    })
    heroSTRef.current = frameTween.scrollTrigger ?? null

    // Overlay text fades in after the explosion (mid-scroll)
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top+=150% top',
          end: 'top+=220% top',
          scrub: true,
        },
      }
    )


    return () => {
      frameTween.scrollTrigger?.kill()
      frameTween.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [])

  const handleModeSwitch = (mode: 'flat' | 'espresso') => {
    if (modeRef.current === mode) return
    modeRef.current = mode
    blastFiredRef.current = false
    beansFiredRef.current = false
    setActiveMode(mode)

    // Reset scroll to the start of the hero animation so it plays from frame 1
    const st = heroSTRef.current
    if (st) {
      window.scrollTo({ top: st.start, behavior: 'instant' as ScrollBehavior })
    }

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const img = mode === 'espresso' ? images1Ref.current[0] : imagesRef.current[0]
    if (img?.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawImageCover(ctx, img, canvas.width, canvas.height)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section"
    >
      {/* Full-bleed canvas */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
      />

      {/* Mode selector — top-center, visible before scrolling */}
      <div className="hero-mode-buttons">
        <button
          className={`hero-mode-btn${activeMode === 'flat' ? ' hero-mode-btn--active' : ''}`}
          onClick={() => handleModeSwitch('flat')}
        >
          Flat Coffee
        </button>
        <button
          className={`hero-mode-btn${activeMode === 'espresso' ? ' hero-mode-btn--active' : ''}`}
          onClick={() => handleModeSwitch('espresso')}
        >
          Espresso Coffee
        </button>
      </div>

      {/* Sidebanner — slides in from left on scroll start */}
      <img
        ref={sideBannerRef}
        src="/images/sidebanner.png"
        alt="side banner"
        className="hero-sidebanner"
      />

      {/* Overlay headline — fades in after explosion frames */}
      <div
        ref={overlayRef}
        className="hero-overlay"
      >
        <p className="hero-overlay-tagline">
          Sunrise Brew House
        </p>
        <h1 className="hero-overlay-title">
          Crafted with<br />
          <span className="hero-overlay-accent">Passion.</span>
        </h1>
        <a
          href="#menu"
          className="hero-menu-btn"
        >
          View Menu
        </a>
      </div>

      {/* Bottom gradient blend into next section */}
      <div className="hero-bottom-gradient" />
    </section>
  )
}
