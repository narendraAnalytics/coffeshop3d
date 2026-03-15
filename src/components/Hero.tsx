import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FRAME_COUNT = 75
const BLAST_AT    = 0.47  // scroll progress (0→1) when cup explodes — adjust to match visual

function framePath(n: number) {
  return `/frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`
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

// One-shot blast — deep thump + sharp crack, nodes self-dispose after playback
function playBlast(actx: AudioContext) {
  const t = actx.currentTime

  // Layer 1 — deep thump (sine oscillator, fast pitch drop + decay)
  const osc     = actx.createOscillator()
  const oscGain = actx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(90, t)
  osc.frequency.exponentialRampToValueAtTime(28, t + 0.18)
  oscGain.gain.setValueAtTime(1.0, t)
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
  noiseGain.gain.setValueAtTime(0.6, t)
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
  const imagesRef  = useRef<HTMLImageElement[]>([])
  const frameObj   = useRef({ frame: 0 })

  // Audio refs
  const audioCtxRef  = useRef<AudioContext | null>(null)
  const rollGainRef  = useRef<GainNode | null>(null)
  const musicGainRef = useRef<GainNode | null>(null)
  const bpfRef       = useRef<BiquadFilterNode | null>(null)
  const scrollingRef  = useRef(false)
  const fadeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFrameRef  = useRef(0)
  const blastFiredRef = useRef(false)

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

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      const ctx    = canvas?.getContext('2d')
      if (!canvas || !ctx) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const img = imagesRef.current[Math.round(frameObj.current.frame)]
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
    }

    const render = () => {
      const idx = Math.round(frameObj.current.frame)
      const img = imagesRef.current[idx]
      if (img?.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawImageCover(ctx, img, canvas.width, canvas.height)
      }
      updateAudio(frameObj.current.frame / (FRAME_COUNT - 1))
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

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#1a0f0a',
      }}
    >
      {/* Full-bleed canvas */}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {/* Overlay headline — fades in after explosion frames */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: 0,
          zIndex: 10,
          pointerEvents: 'none',
          width: '90%',
          maxWidth: '700px',
        }}
      >
        <p
          style={{
            color: '#c49a3c',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            fontWeight: 500,
          }}
        >
          Sunrise Brew House
        </p>
        <h1
          style={{
            color: '#f5e6d3',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.1,
            margin: '0 0 1.5rem',
          }}
        >
          Crafted with<br />
          <span style={{ color: '#c4622d', fontStyle: 'italic' }}>Passion.</span>
        </h1>
        <a
          href="#menu"
          style={{
            display: 'inline-block',
            padding: '0.875rem 2.5rem',
            border: '1px solid #c49a3c',
            color: '#c49a3c',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = '#c49a3c'
            el.style.color = '#1a0f0a'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'transparent'
            el.style.color = '#c49a3c'
          }}
        >
          View Menu
        </a>
      </div>

      {/* Bottom gradient blend into next section */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, #1a0f0a)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </section>
  )
}
