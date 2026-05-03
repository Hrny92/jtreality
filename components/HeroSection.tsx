'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useMemo } from 'react'
import arrowRaw from '@/public/Arrow 1.json'

// Load Lottie client-side only (no SSR)
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// ── Recolour the arrow to our gold (#f9b233 = 0.976, 0.698, 0.2) ────────────
function recolor(data: object): object {
  const gold = [0.9765625, 0.6980392156862745, 0.2, 1]

  function walk(obj: unknown): void {
    if (!obj || typeof obj !== 'object') return
    if (Array.isArray(obj)) { obj.forEach(walk); return }

    const o = obj as Record<string, unknown>
    // Lottie stroke / fill colour node: { ty:'st'|'fl', c: { k:[r,g,b,a] } }
    if ((o.ty === 'st' || o.ty === 'fl') && o.c) {
      const c = o.c as Record<string, unknown>
      if (Array.isArray(c.k) && c.k.length === 4) c.k = [...gold]
    }
    Object.values(o).forEach(walk)
  }

  const clone = JSON.parse(JSON.stringify(data))
  walk(clone)
  return clone
}

export default function HeroSection() {
  const goldArrow = useMemo(() => recolor(arrowRaw), [])

  return (
    <section
      className="sticky top-0 flex flex-col justify-center overflow-hidden bg-dark"
      style={{ height: '100dvh', minHeight: '620px', zIndex: 0 }}
    >
      {/* ── Background video ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        src="/bg-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      {/* ── Dark overlay + dot grid + gold glow — sits on top of video ── */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          backgroundImage: [
            'linear-gradient(to bottom, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0.72) 60%, rgba(8,8,8,0.88) 100%)',
            'radial-gradient(ellipse 70% 60% at 52% 38%, rgba(249,178,51,0.06) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(249,178,51,0.14) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '100% 100%, 100% 100%, 28px 28px',
        }}
      />

      

      

      {/* ── Thin gold vertical accent (left edge) ── */}
      <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent z-10" />
      {/* ── Thin top line ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/4 z-10" />

      {/* ── Main content ── */}
      <div className="relative z-20 px-8 md:px-14 lg:px-20 pt-24 flex flex-col items-center">

        {/* Heading */}
        <h1
          className="font-display font-black text-white text-center"
          style={{
            fontSize: 'clamp(3.2rem, 8.5vw, 9rem)',
            lineHeight: 1.01,
            letterSpacing: '-0.025em',
            animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.15s both',
          }}
        >
          Od pozemku
          <br />
          <em className="not-italic text-gold">až po&nbsp;klíče</em>
          <br />
          od nového domova.
        </h1>

        {/* Sub */}
        <p
          className="text-white/45 max-w-xl mt-8 mb-12 leading-relaxed text-center"
          style={{
            fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
            animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.38s both',
          }}
        >
          5 let zkušeností v developmentu, vyhledávání lukrativních pozemků
          a&nbsp;zajištění kompletní administrativy. Vaše vize měníme v realitu.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center gap-4"
          style={{ animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both' }}
        >
          {/* Arrow + primary CTA */}
          <div className="relative">
            {/* Lottie arrow — floats above-left, arrowhead curves toward the button */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-68px',
                left: '-100px',
                width: 52,
                height: 74,
                transform: 'scaleX(-1) rotate(-8deg)',
              }}
            >
              <Lottie
                animationData={goldArrow}
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <a
              href="#projekty"
              className="bg-gold text-dark px-9 py-4 font-display font-bold text-xs tracking-[0.18em] uppercase hover:bg-gold-light transition-colors duration-300 inline-block"
            >
              Aktuální projekty
            </a>
          </div>

          <a
            href="#kontakt"
            className="border border-white/20 text-white/65 px-9 py-4 text-xs tracking-[0.18em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
          >
            Nezávazná konzultace
          </a>
        </div>
      </div>
    </section>
  )
}
