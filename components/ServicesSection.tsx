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
    side: 'left' as const,
  },
  {
    number: '02',
    title: 'Vyhledávání\npozemků',
    description:
      'Najdu pro vás ideální místo pro bydlení nebo investici, které má skutečný potenciál – dříve, než se dostane na veřejné portály.',
    side: 'right' as const,
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

// BoxGeometry face indices: 0=+X(right), 1=-X(left), 2=+Y(top), 3=-Y(btm), 4=+Z(front), 5=-Z(back)
// rotation.y:  0      → +Z front faces camera → Service 1 (DEVELOPMENT)
//             -π/2    → +X right faces camera → Service 2 (POZEMKY)
//             -π      → -Z back  faces camera → Service 3 (URADY)
//             -3π/2   → -X left  faces camera → Service 4 (REALITY)
const CUBE_FACES = [
  '/CUBE/POZEMKY.png',     // idx 0  +X right  → S2
  '/CUBE/REALITY.jpg',     // idx 1  -X left   → S4
  '/CUBE/DEVELOPMENT.png', // idx 2  +Y top    → S1 (repeat, all sides covered)
  '/CUBE/POZEMKY.png',     // idx 3  -Y bottom → S2 (repeat, all sides covered)
  '/CUBE/DEVELOPMENT.png', // idx 4  +Z front  → S1
  '/CUBE/URADY.png',       // idx 5  -Z back   → S3
]

const SERVICE_ROT_Y = [
  0,                    // S1 → front face
  -Math.PI / 2,         // S2 → right face
  -Math.PI,             // S3 → back face
  -(Math.PI * 3) / 2,   // S4 → left face
]

// Cube X position: side='left' → text left, cube RIGHT (+); side='right' → cube LEFT (-)
const cubeX = (side: 'left' | 'right') => (side === 'left' ? 1.5 : -1.5)

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
      renderer.outputColorSpace = THREE.SRGBColorSpace

      // ── Scene & camera ────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100)
      camera.position.set(0, 0, 5.5)

      // ── Lighting (needed for MeshStandardMaterial) ────────────
      scene.add(new THREE.AmbientLight(0xfff5e0, 1.1))
      const key = new THREE.DirectionalLight(0xffffff, 1.6)
      key.position.set(3, 4, 5)
      scene.add(key)
      const fill = new THREE.DirectionalLight(0xfff0d0, 0.4)
      fill.position.set(-4, -2, 3)
      scene.add(fill)

      // ── Cube group (position.x driven by scroll) ───────────────
      const cubeGroup = new THREE.Group()
      cubeGroup.position.x = cubeX(services[0].side)
      cubeGroup.position.y = 0   // vertically centred — aligns with the service texts (top:50%)
      scene.add(cubeGroup)

      // ── Textured cube mesh ─────────────────────────────────────
      const SIZE   = 1.75
      const boxGeo = new THREE.BoxGeometry(SIZE, SIZE, SIZE)

      const loader = new THREE.TextureLoader()
      const mats   = CUBE_FACES.map(url => {
        const tex = loader.load(url)
        tex.colorSpace = THREE.SRGBColorSpace
        return new THREE.MeshStandardMaterial({
          map:       tex,
          roughness: 0.72,
          metalness: 0.08,
        })
      })

      const cubeMesh = new THREE.Mesh(boxGeo, mats)
      cubeMesh.rotation.x = 0              // straight-on view — only the active face visible
      cubeMesh.rotation.y = SERVICE_ROT_Y[0]
      cubeGroup.add(cubeMesh)

      // ── Gold wireframe overlay (child of cubeMesh → rotates with it) ──
      const edgesGeo  = new THREE.EdgesGeometry(boxGeo)
      const edgesMat  = new THREE.LineBasicMaterial({
        color: 0xf9b233, transparent: true, opacity: 0.55,
      })
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat)
      cubeMesh.add(edgesMesh)

      // ── Gold dust particles ────────────────────────────────────
      const COUNT = 120
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
        new THREE.PointsMaterial({ color: 0xf9b233, size: 0.03, transparent: true, opacity: 0.22 }),
      )
      scene.add(particles)

      // ── Breathing scale ───────────────────────────────────────
      const breathTween = gsap.to(cubeGroup.scale, {
        x: 1.055, y: 1.055, z: 1.055,
        duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      })

      // ── Master scroll timeline ────────────────────────────────
      //
      //  Section = N*100vh (N=4, 400vh) → scroll range = (N-1)*100vh = 300vh.
      //  Text i (top: i*100vh) centres at progress = i/(N-1) = i/3.
      //  Text centres: 0, 1/3, 2/3, 1.0
      //
      //  3 legs — no dead zones, cube moves & rotates the full segment:
      //   Leg 0→1: progress 0.000–0.333  (cube moves right→left, face 0→1)
      //   Leg 1→2: progress 0.333–0.667  (cube moves left→right, face 1→2)
      //   Leg 2→3: progress 0.667–1.000  (cube moves right→left, face 2→3)
      //
      //  At progress 1.0: text 4 at centre AND section unpins. ✓

      const LEGS = services.length - 1   // 3
      const SEG  = 1 / LEGS              // 1/3

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   0.6,
          onUpdate(self) {
            setActiveIdx(
              Math.min(Math.round(self.progress * LEGS), services.length - 1)
            )
          },
        },
      })

      services.forEach((service, i) => {
        if (i === 0) return
        const segStart = (i - 1) * SEG   // 0, 1/3, 2/3

        // Cube travels left ↔ right
        tl.to(cubeGroup.position, {
          x:        cubeX(service.side),
          ease:     'power2.inOut',
          duration: SEG,
        }, segStart)

        // Cube rotates to show the image for this service
        tl.to(cubeMesh.rotation, {
          y:        SERVICE_ROT_Y[i],
          ease:     'power2.inOut',
          duration: SEG,
        }, segStart)

        // Particles drift subtly
        tl.to(particles.rotation, {
          y:        i * 0.55,
          x:        i * 0.12,
          ease:     'power1.inOut',
          duration: SEG,
        }, segStart)
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
        tl.kill()
        boxGeo.dispose()
        edgesGeo.dispose()
        edgesMat.dispose()
        mats.forEach(m => { m.map?.dispose(); m.dispose() })
        pGeo.dispose()
        renderer.dispose()
      })
    })()

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      cleanups.forEach(fn => fn())
    }
  }, [])

  // ── JSX ──────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id="sluzby"
      className="relative bg-dark-100"
      style={{ height: `${services.length * 100}vh` }}
    >

      {/* ══ 1. STICKY CANVAS ══ */}
      <div className="sticky top-0 h-screen z-10 pointer-events-none overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Progress bar */}
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

      {/* ══ 2. TEXTS + HEADING (scroll naturally) ══ */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        {/* Service text blocks */}
        {services.map((service, i) => {
          const isLeft   = service.side === 'left'
          const isActive = i === activeIdx

          return (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top:        `${i * 100}vh`,
                height:     '100vh',
                
              }}
            >
              <div
                className="pointer-events-auto"
                style={{
                  position:  'absolute',
                  top:       '50%',
                  transform: 'translateY(-50%)',
                  ...(isLeft
                    ? { left:  'max(1.5rem, calc((100vw - 80rem) / 2 + 2.5rem))', maxWidth: '36vw', minWidth: '220px' }
                    : { right: 'max(1.5rem, calc((100vw - 80rem) / 2 + 2.5rem))', maxWidth: '36vw', minWidth: '220px', textAlign: 'right' }),
                  opacity:    isActive ? 1 : 0.25,
                  transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Number + line */}
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
                    color:    isActive ? '#f5f5f5' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="leading-relaxed transition-colors duration-500"
                  style={{
                    fontSize:   '1rem',
                    maxWidth:   '300px',
                    marginLeft: isLeft ? 0 : 'auto',
                    color:      isActive ? 'rgba(245,245,245,0.52)' : 'rgba(255,255,255,0.14)',
                  }}
                >
                  {service.description}
                </p>

                {/* CTA */}
                <a
                  href="#kontakt"
                  className="group inline-flex items-center gap-2 mt-8 border-b pb-0.5"
                  style={{
                    fontSize:      '10px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color:         isActive ? 'rgba(249,178,51,0.55)' : 'transparent',
                    borderColor:   isActive ? 'rgba(249,178,51,0.2)'  : 'transparent',
                    flexDirection: isLeft ? 'row' : 'row-reverse',
                    opacity:       isActive ? 1 : 0,
                    transition:    'opacity 0.65s ease, color 0.3s, border-color 0.3s',
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
