'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ServicesTitleSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.svc-title-item', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="pt-28 md:pt-36 bg-dark-100 relative"
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="container mx-auto px-6 md:px-10 flex flex-col items-center text-center">
        {/* Label row */}
        <div className="svc-title-item flex items-center gap-3 mb-6">
          <span className="text-gold text-[10px] tracking-[0.4em] uppercase">03</span>
          <span className="block w-8 h-px bg-white/15" />
          <span className="text-white/30 text-[10px] tracking-[0.22em] uppercase">Služby</span>
        </div>

        {/* Heading */}
        <h2
          className="svc-title-item font-display font-bold leading-tight mb-6"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)', color: '#f5f5f5' }}
        >
          Komplexní servis
          <br />
          <span className="text-gold">v oblasti realit</span>
        </h2>

        {/* Subtle description */}
        <p className="svc-title-item text-white/35 max-w-sm text-sm leading-relaxed">
          Od vyhledání pozemku přes povolení až po prodej — vše pod jednou střechou.
        </p>

        {/* Decorative line */}
        <div className="svc-title-item w-8 h-px bg-gold/35 mt-8" />
      </div>
    </section>
  )
}
