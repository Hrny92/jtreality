'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote:
      'Spolupráce s Jurou pro nás byla klíčová při řešení stavebního povolení. To, co nám trvalo měsíce, on vyřešil díky svým zkušenostem neuvěřitelně rychle. Přístup naprosto profesionální.',
    author: 'Marek S.',
    role: 'Investor, Praha',
    initial: 'M',
  },
  {
    quote:
      'Hledali jsme pozemek pro náš projekt víc než rok. JT Reality nám našli přesně to, co jsme potřebovali — a to dřív, než se nabídka vůbec dostala na veřejné portály. Cena odpovídala realitě trhu.',
    author: 'Lucie T.',
    role: 'Soukromý investor, Brno',
    initial: 'L',
  },
  {
    quote:
      'Prodej rodinného domu jsme svěřili JT Reality a nelitujeme. Celý proces byl transparentní, rychlý a za cenu, která nás příjemně překvapila. Doporučuji každému, kdo chce prodat bez zbytečného stresu.',
    author: 'Tomáš & Jana K.',
    role: 'Prodávající, Středočeský kraj',
    initial: 'T',
  },
  {
    quote:
      'Jura má výjimečný přehled o trhu i o legislativě. Pomohl nám s inženýringem na developerském projektu a díky jeho kontaktům jsme ušetřili několik měsíců čekání na povolení.',
    author: 'Pavel N.',
    role: 'Developer',
    initial: 'P',
  },
]

// Shared card content — used in both mobile slider and desktop grid
function TestiCard({ t, className = '' }: { t: typeof testimonials[0]; className?: string }) {
  return (
    <div className={`testi-card relative p-8 border md:border-white/5 border-gold/20 overflow-hidden ${className}`}>

      {/* Decorative quote mark — inline, above text */}
      <div className="text-gold/30 md:text-gold/15 font-serif text-5xl leading-none mb-3 select-none">
        &ldquo;
      </div>

      {/* Quote */}
      <p className="text-white/60 text-base leading-relaxed mb-10">
        {t.quote}
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-gold text-sm">{t.initial}</span>
        </div>
        <div>
          <div className="font-display font-bold text-white text-sm">{t.author}</div>
          <div className="text-white/30 text-xs mt-0.5 tracking-wider">{t.role}</div>
        </div>
      </div>

      {/* Bottom gold accent — always visible on mobile, hidden on desktop */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-gold/0 via-gold/30 to-gold/0 md:opacity-0" />
    </div>
  )
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef  = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  // GSAP animations (desktop)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testi-header', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          invalidateOnRefresh: true,
        },
      })

      gsap.fromTo(
        '.testi-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.testi-grid',
            start: 'top 82%',
            invalidateOnRefresh: true,
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Track active slide via scroll position
  useEffect(() => {
    const el = sliderRef.current
    if (!el) return

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveSlide(index)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="reference"
      className="py-28 md:py-40 relative bg-dark"
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="container mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 testi-header">
          <span className="text-gold text-xs tracking-[0.35em] uppercase">05</span>
          <span className="block w-10 h-[1px] bg-white/10" />
          <span className="text-white/30 text-xs tracking-[0.2em] uppercase">Reference</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <h2 className="testi-header font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-tight">
            Řekli o spolupráci
            <br />
            <span className="text-gold">se mnou</span>
          </h2>
          <p className="testi-header text-white/35 max-w-xs text-sm leading-relaxed">
            Důvěra klientů je pro nás tím nejcennějším. Přečtěte si, jak hodnotí naši spolupráci.
          </p>
        </div>

        {/* ── Mobile: horizontal snap slider ── */}
        <div
          ref={sliderRef}
          className="testi-grid md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="snap-start shrink-0" style={{ width: 'calc(85vw)' }}>
              <TestiCard t={t} />
            </div>
          ))}
          {/* Trailing spacer so last card doesn't hug the edge */}
          <div className="shrink-0 w-6" />
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex md:hidden justify-center gap-2 mt-5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                sliderRef.current?.scrollTo({
                  left: i * (sliderRef.current.offsetWidth * 0.85 + 16),
                  behavior: 'smooth',
                })
              }}
              className={`rounded-full transition-all duration-300 ${
                activeSlide === i
                  ? 'w-5 h-1.5 bg-gold'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Přejít na referenci ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Desktop: 2×2 grid ── */}
        <div className="testi-grid hidden md:grid grid-cols-2 gap-7">
          {testimonials.map((t, i) => (
            <TestiCard key={i} t={t} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 md:mt-16 text-center">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-3 text-white/40 hover:text-gold text-xs tracking-[0.3em] uppercase transition-colors duration-300 group"
          >
            Chci se také podělit o zkušenost
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
