'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { urlFor } from '@/lib/sanity'
import type { Property } from '@/lib/queries'

gsap.registerPlugin(ScrollTrigger)

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  active:   'Aktivní',
  reserved: 'Rezervováno',
  sold:     'Prodáno',
}
const STATUS_CLASS: Record<string, string> = {
  active:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  reserved: 'bg-gold/15 text-gold border-gold/30',
  sold:     'bg-white/10 text-white/40 border-white/15',
}
const TRANSACTION_LABEL: Record<string, string> = {
  prodej:   'Prodej',
  pronajem: 'Pronájem',
}
const CATEGORY_LABEL: Record<string, string> = {
  byt:     'Byt',
  dum:     'Dům',
  pozemek: 'Pozemek',
  komerce: 'Komerční',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  properties: Property[]
}

export default function ProjectsSection({ properties }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.proj-header', {
        y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      })
      gsap.from('.proj-card', {
        y: 80, opacity: 0, duration: 1.1, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: '.proj-grid', start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="projekty"
      className="py-28 md:py-40 bg-dark relative"
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="container mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 proj-header">
          <span className="text-gold text-xs tracking-[0.35em] uppercase">04</span>
          <span className="block w-10 h-[1px] bg-white/10" />
          <span className="text-white/30 text-xs tracking-[0.2em] uppercase">Projekty</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <h2 className="proj-header font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-tight">
            Aktuální
            <br />
            <span className="text-gold">nabídka</span>
          </h2>
          <p className="proj-header text-white/35 max-w-xs text-sm leading-relaxed">
            Nejnovější nemovitosti z naší nabídky. Zakládáme si na kvalitě a přidané hodnotě pro klienta.
          </p>
        </div>

        {/* Cards */}
        {properties.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/8">
            <p className="text-white/25 text-xs tracking-[0.3em] uppercase">
              Momentálně žádné nabídky · Brzy přidáme nové projekty
            </p>
          </div>
        ) : (
          <div className="proj-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {properties.map((p) => (
              <a
                key={p._id}
                href={`/projekty/${p.slug?.current}`}
                className="proj-card group relative overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative bg-dark-200">
                  {p.mainImage ? (
                    <img
                      src={urlFor(p.mainImage).width(640).height(480).url()}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white/10 text-6xl font-display font-bold">JT</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

                  {/* Status + transaction badges */}
                  <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                    <span className={`text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 font-medium border ${STATUS_CLASS[p.status] ?? STATUS_CLASS.active}`}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                    <span className="text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 font-medium border bg-dark/60 text-white/50 border-white/10">
                      {TRANSACTION_LABEL[p.transactionType] ?? p.transactionType}
                    </span>
                  </div>

                  {/* Category */}
                  <span className="absolute top-4 right-4 text-[10px] tracking-widest uppercase text-white/25 font-mono">
                    {CATEGORY_LABEL[p.category] ?? p.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col flex-1">
                  {p.location && (
                    <p className="text-gold text-[10px] tracking-[0.28em] uppercase mb-2">
                      {p.location}
                    </p>
                  )}
                  <h3 className="font-display text-xl font-bold mb-4 leading-snug">
                    {p.title}
                  </h3>

                  {/* Key stats */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mb-6">
                    {p.price && (
                      <span className="text-sm font-semibold text-gold">{p.price}</span>
                    )}
                    {p.area && (
                      <span className="text-sm text-white/40">{p.area} m²</span>
                    )}
                    {p.layout && (
                      <span className="text-sm text-white/40">{p.layout}</span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-gold/55 border-b border-gold/20 pb-1 w-fit group-hover:text-gold group-hover:border-gold/50 transition-all duration-300">
                    Zobrazit detail
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300 text-base">→</span>
                  </div>
                </div>

                {/* Hover corner accent */}
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-r-[40px] border-b-transparent border-r-gold/0 group-hover:border-r-gold/20 transition-all duration-500" />
              </a>
            ))}
          </div>
        )}

        {/* CTA — celá nabídka */}
        <div className="mt-14 flex justify-center">
          <a
            href="/projekty"
            className="group inline-flex items-center gap-4 border border-gold/40 text-gold px-10 py-4 text-xs tracking-[0.22em] uppercase hover:bg-gold hover:text-dark transition-all duration-300 font-medium"
          >
            Zobrazit celou nabídku
            <span className="transform group-hover:translate-x-2 transition-transform duration-300 text-base">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
