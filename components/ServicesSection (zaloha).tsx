'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    number: '01',
    title: 'Development\n& Projektové řízení',
    description:
      'Zajišťuji kompletní proces přípravy a realizace developerských projektů. Od prvního výkopu až po marketing prodeje.',
    side: 'left' as const,   // text LEFT  → cube RIGHT
  },
  {
    number: '02',
    title: 'Vyhledávání\npozemků',
    description:
      'Najdu pro vás ideální místo pro bydlení nebo investici, které má skutečný potenciál – dříve, než se dostane na veřejné portály.',
    side: 'right' as const,  // text RIGHT → cube LEFT
  },
  {
    number: '03',
    title: 'Inženýring\na úřady',
    description:
      'Papírování nechte na mně. Vyřídím veškerá povolení, komunikaci s úřady a administrativní zátěž spojenou s výstavbou.',
    side: 'left' as const,
  },
  {
    number: '04',
    title: 'Prodej a pronájem\nnemovitostí',
    description:
      'Profesionální prezentace a prodej vaší nemovitosti s důrazem na maximální tržní cenu.',
    side: 'right' as const,
  },
]

// ─── Cube face images ────────────────────────────────────────────────────────
// BoxGeometry material indices: 0=+X, 1=-X, 2=+Y(top), 3=-Y(btm), 4=+Z(front), 5=-Z(back)
//
//  rotation.y =  0:    +Z front (idx 4) faces camera  → Service 1
//  rotation.y = -π/2:  +X right (idx 0) faces camera  → Service 2
//  rotation.y = -π:    -Z back  (idx 5) faces camera  → Service 3
//  rotation.y = -3π/2: -X left  (idx 1) faces camera  → Service 4
//
// Replace these URLs with your own square images (e.g. /cube/s1.jpg etc.)
const CUBE_FACES: (string | null)[] = [
  // idx 0  (+X right)  → Service 2 – Pozemky
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=512&q=80',
  // idx 1  (-X left)   → Service 4 – Prodej
  'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=512&q=80',
  // idx 2  (+Y top)
  null,
  // idx 3  (-Y bottom)
  null,
  // idx 4  (+Z front)  → Service 1 – Development
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=512&q=80',
  // idx 5  (-Z back)   → Service 3 – Inženýring
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=512&q=80',
]

// Target Y-rotation of cubeMesh for each service
const SERVICE_ROT_Y = [
  0,                  // S1 → front face
  -Math.PI / 2,       // S2 → right face
  -Math.PI,           // S3 → back face
  -(Math.PI * 3) / 2, // S4 → left face
]

// Cube X position in the 3D scene
// side='left'  → text on left  → cube on RIGHT (+)
// side='right' → text on right → cube on LEFT  (-)
const cubeX = (side: 'left' | 'right') => (side === 'left' ? 1.35 : -1.35)

// ─── Component ───────────────────────────────────────────────────────────────

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) return

    let rafId    = 0
    let disposed = false
    const cleanups: (() => void)[] = []

    ;(async () => {
      const THREE = await import('three')
      if (disposed) return

      const canvas = canvasRef.current!

      const size = () => ({
        w: canvas.parentElement?.clientWidth  ?? window.innerWidth,
        h: canvas.parentElement?.clientHeight ?? window.innerHeight,
      })
      const { w, h } = size()

      // ── Renderer ──────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = false

      // ── Scene & camera ────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100)
      camera.position.set(0, 0, 5.5)

      // ── Lights ────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xfff5e0, 0.55))
      const sun = new THREE.DirectionalLight(0xffffff, 0.9)
      sun.position.set(3, 4, 5)
      scene.add(sun)

      // ── Cube group (position.x drives left/right travel) ──────
      const cubeGroup = new THREE.Group()
      cubeGroup.position.x = cubeX(services[0].side)  // start RIGHT
      scene.add(cubeGroup)

      // ── Textured cube mesh ────────────────────────────────────
      const SIZE = 2.05
      const boxGeo  = new THREE.BoxGeometry(SIZE, SIZE, SIZE)
      const loader  = new THREE.TextureLoader()

      const mats = CUBE_FACES.map(url => {
        const mat = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.06 })
        if (url) mat.map = loader.load(url)
        else mat.color = new THREE.Color(0x0d0d0d)
        return mat
      })

      const cubeMesh = new THREE.Mesh(boxGeo, mats)
      cubeMesh.rotation.x = 0.22          // constant tilt to reveal 3-D nature
      cubeMesh.rotation.y = SERVICE_ROT_Y[0]
      cubeGroup.add(cubeMesh)

      // ── Gold wireframe edges (child of cubeMesh, rotates with it) ─
      const wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeo),
        new THREE.LineBasicMaterial({ color: 0xf9b233, transparent: true, opacity: 0.55 })
      )
      cubeMesh.add(wireframe)

      // ── Floating gold dust particles ──────────────────────────
      const COUNT = 100
      const pPos  = new Float32Array(COUNT * 3)
      for (let i = 0; i < COUNT; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 14
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 14
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 14
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      const particles = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ color: 0xf9b233, size: 0.028, transparent: true, opacity: 0.18 })
      )
      scene.add(particles)

      // ── Idle breathing ────────────────────────────────────────
      const breathTween = gsap.to(cubeGroup.scale, {
        x: 1.055, y: 1.055, z: 1.055,
        duration: 2.7, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      // ── Master scroll timeline ────────────────────────────────
      //
      //  Each service occupies 25% of total scroll (4 × 100vh section).
      //  Transitions are centred on the 25 / 50 / 75% marks.
      //  half = ±8% → transition covers 16% of scroll = 64vh
      //
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1.8,           // second of inertia → very fluid
          onUpdate(self) {
            setActiveIdx(
              Math.min(Math.floor(self.progress * services.length), services.length - 1)
            )
          },
        },
      })

      const HALF = 0.08  // half-width of each transition zone

      ;([1, 2, 3] as const).forEach((toIdx) => {
        const mid   = toIdx / services.length     // 0.25, 0.50, 0.75
        const start = mid - HALF                   // 0.17, 0.42, 0.67
        const dur   = HALF * 2                     // 0.16

        tl.to(cubeGroup.position, {
          x:    cubeX(services[toIdx].side),
          ease: 'power3.inOut',
          duration: dur,
        }, start)

        tl.to(cubeMesh.rotation, {
          y:    SERVICE_ROT_Y[toIdx],
          ease: 'power3.inOut',
          duration: dur,
        }, start)

        // subtle particle drift
        tl.to(particles.rotation, {
          y:    toIdx * 0.55,
          x:    toIdx * 0.12,
          ease: 'none',
          duration: dur,
        }, start)
      })

      // ── Render loop ───────────────────────────────────────────
      const render = () => {
        if (disposed) return
        rafId = requestAnimationFrame(render)
        renderer.render(scene, camera)
      }
      render()

      // ── Resize ────────────────────────────────────────────────
      const onResize = () => {
        const { w: nw, h: nh } = size()
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
      }
      window.addEventListener('resize', onResize)

      cleanups.push(() => {
        window.removeEventListener('resize', onResize)
        breathTween.kill()
        tl.kill()          // also kills its own ScrollTrigger
        boxGeo.dispose()
        pGeo.dispose()
        mats.forEach(m => { m.map?.dispose(); m.dispose() })
        renderer.dispose()
      })
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      cleanups.forEach(fn => fn())
    }
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id="sluzby"
      className="relative"
      style={{ height: `${services.length * 100}vh` }}
    >

      {/* ══ 1. STICKY 3-D CANVAS (always in viewport) ══ */}
      <div className="sticky top-0 h-screen z-10 pointer-events-none overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Section label */}
        <div className="absolute top-8 left-8 md:left-14 flex items-center gap-3">
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase">03</span>
          <span className="block w-8 h-px bg-white/10" />
          <span className="text-white/28 text-[10px] tracking-[0.22em] uppercase">Služby</span>
        </div>

        {/* Sub-heading */}
        <div className="absolute top-16 md:top-20 left-8 md:left-14">
          <p className="font-display font-semibold text-white/40" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.3rem)' }}>
            Komplexní servis&nbsp;<span className="text-gold/70">v oblasti realit</span>
          </p>
        </div>

        {/* Progress bar + counter */}
        <div className="absolute bottom-8 left-8 md:left-14 right-8 md:right-14 flex items-center gap-4">
          {services.map((_, j) => (
            <div
              key={j}
              className="h-px flex-1 transition-all duration-700"
              style={{ backgroundColor: j === activeIdx ? '#f9b233' : 'rgba(255,255,255,0.10)' }}
            />
          ))}
          <span className="font-mono text-white/15 text-xs tracking-widest shrink-0">
            {String(activeIdx + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(services.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ══ 2. SERVICE TEXTS (absolute within section, always visible) ══ */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {services.map((service, i) => {
          const isLeft   = service.side === 'left'
          const isActive = i === activeIdx

          return (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top:    `${i * 100}vh`,
                height: '100vh',
                // Opaque dark panel on the TEXT side only — lets cube show through the other half
                background: isLeft
                  ? 'linear-gradient(90deg, rgba(8,8,8,0.93) 0%, rgba(8,8,8,0.93) 43%, rgba(8,8,8,0) 56%)'
                  : 'linear-gradient(270deg, rgba(8,8,8,0.93) 0%, rgba(8,8,8,0.93) 43%, rgba(8,8,8,0) 56%)',
              }}
            >
              {/* Text block — vertically centred */}
              <div
                className="pointer-events-auto"
                style={{
                  position:   'absolute',
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  ...(isLeft
                    ? { left: '6vw',  maxWidth: '40vw', minWidth: '240px' }
                    : { right: '6vw', maxWidth: '40vw', minWidth: '240px', textAlign: 'right' }),
                  opacity:    isActive ? 1 : 0.28,
                  transition: 'opacity 0.65s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Number + decorative line */}
                <div className={`flex items-center gap-3 mb-6 ${!isLeft ? 'justify-end' : ''}`}>
                  <span
                    className={`font-mono text-sm transition-colors duration-500 ${!isLeft ? 'order-2' : ''}`}
                    style={{ color: isActive ? '#f9b233' : 'rgba(255,255,255,0.22)' }}
                  >
                    {service.number}
                  </span>
                  <div
                    className="h-px w-12 transition-colors duration-500"
                    style={{ backgroundColor: isActive ? 'rgba(249,178,51,0.5)' : 'rgba(255,255,255,0.10)' }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="font-display font-bold leading-tight mb-5 whitespace-pre-line transition-colors duration-500"
                  style={{
                    fontSize: 'clamp(1.75rem, 2.8vw, 3rem)',
                    color: isActive ? '#f5f5f5' : 'rgba(255,255,255,0.28)',
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="leading-relaxed transition-colors duration-500"
                  style={{
                    fontSize:    '1rem',
                    maxWidth:    '300px',
                    marginLeft:  isLeft ? 0 : 'auto',
                    color: isActive ? 'rgba(245,245,245,0.52)' : 'rgba(255,255,255,0.15)',
                  }}
                >
                  {service.description}
                </p>

                {/* Subtle CTA */}
                <a
                  href="#kontakt"
                  className="group inline-flex items-center gap-2 mt-8 border-b pb-0.5 transition-all duration-300"
                  style={{
                    fontSize:       '10px',
                    letterSpacing:  '0.25em',
                    textTransform:  'uppercase',
                    color:          isActive ? 'rgba(249,178,51,0.55)' : 'transparent',
                    borderColor:    isActive ? 'rgba(249,178,51,0.2)' : 'transparent',
                    flexDirection:  isLeft ? 'row' : 'row-reverse',
                    opacity:        isActive ? 1 : 0,
                    transition:     'opacity 0.65s ease, color 0.3s, border-color 0.3s',
                  }}
                >
                  Zjistit více
                  <span className={`transition-transform duration-300 ${isLeft ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
                    {isLeft ? '→' : '←'}
                  </span>
                </a>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}
