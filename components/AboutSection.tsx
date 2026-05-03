'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// SAFE PATTERN: gsap.from() — elements start at CSS default (visible).
// If ScrollTrigger never fires → text stays visible. No hidden flash.

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 72%' }

      // Heading lines: slide up out of overflow:hidden wrappers
      gsap.from('.abt-line', {
        yPercent: 108,
        duration: 1.25,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: trigger,
      })

      // Body paragraphs: fade + slide
      gsap.from('.abt-body', {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { ...trigger, start: 'top 68%' },
      })

      // Image: dark overlay lifts upward, revealing photo beneath
      gsap.to('.abt-wipe', {
        yPercent: -100,
        duration: 1.6,
        ease: 'power4.inOut',
        scrollTrigger: { ...trigger, start: 'top 65%' },
      })

      // Stats
      gsap.from('.abt-stat', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.abt-stats', start: 'top 80%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="o-mne"
      className="relative py-28 md:py-44 bg-dark overflow-hidden"
      style={{ zIndex: 10, }}
    >
      {/* Subtle gold gradient right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(249,178,51,0.04) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-8 md:px-14">

        {/* Label */}
        <div className="flex items-center gap-3 mb-16 md:mb-24">
          <span className="block w-8 h-px bg-gold" />
          <span className="text-white/30 text-[10px] tracking-[0.22em] uppercase">O mně</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">

          {/* ── LEFT: text ── */}
          <div>
            {/* Each heading line wrapped in overflow:hidden for the reveal */}
            <div className="mb-14">
              <div className="overflow-hidden pb-2">
                <span
                  className="abt-line block font-display font-bold text-white"
                  style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', lineHeight: 1.04 }}
                >
                  Kdo stojí za
                </span>
              </div>
              <div className="overflow-hidden pb-2">
                <span
                  className="abt-line block font-display font-bold text-gold"
                  style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', lineHeight: 1.04 }}
                >
                  JT Reality?
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="space-y-5 mb-14">
              <p className="abt-body text-white/65 leading-relaxed text-[1.05rem]">
                Jmenuji se <strong className="text-white font-semibold">Jura Temer</strong> a realitnímu
                trhu se intenzivně věnuju posledních 5 let. Moje specializací a vášní je development
                a příprava pozemků.
              </p>
              <p className="abt-body text-white/50 leading-relaxed">
                Vím, jak efektivně procházet labyrintem úřadů, vytěžit z pozemku maximum
                a dotáhnout developerský projekt do úspěšného konce.
              </p>
              <p className="abt-body text-gold/75 leading-relaxed font-medium">
                Stavím na férovém jednání, detailní znalosti trhu
                a výsledcích, které za mnou zůstávají.
              </p>
            </div>

            {/* CTA */}
            <a
              href="#kontakt"
              className="abt-body inline-flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase text-white/35 hover:text-gold border-b border-white/10 hover:border-gold pb-1 transition-all duration-300 group"
            >
              Domluvit konzultaci
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>

            {/* Stats */}
            <div className="abt-stats grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/8">
              {[
                { v: '5+', l: 'let praxe' },
                { v: '50+', l: 'projektů' },
                { v: '100%', l: 'férový přístup' },
              ].map((s) => (
                <div key={s.l} className="abt-stat">
                  <div
                    className="font-display font-bold text-gold"
                    style={{ fontSize: '2.3rem' }}
                  >
                    {s.v}
                  </div>
                  <div className="text-white/30 text-[10px] tracking-widest uppercase mt-1.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: image with wipe reveal ── */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
            {/* Photo */}
            <img
              src="https://images.unsplash.com/photo-1560250097-0dc05888afa4?w=900&q=80"
              alt="Jura Temer – JT Reality"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />

            {/* Dark wipe overlay — GSAP lifts it up to reveal photo */}
            <div
              className="abt-wipe absolute inset-0 z-10"
              style={{ backgroundColor: '#080808' }}
            />

            {/* Gold corner accents (above wipe) */}
            <div className="absolute top-0 left-0 w-14 h-14 border-t border-l border-gold/40 z-20" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b border-r border-gold/40 z-20" />

            {/* Name tag */}
            <div className="absolute bottom-8 left-8 z-20">
              <div className="font-display font-bold text-white text-xl">Jura Temer</div>
              <div className="text-gold/70 text-xs tracking-widest uppercase mt-1">Zakladatel JT Reality</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
