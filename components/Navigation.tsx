'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '#o-mne',    label: 'O mně' },
  { href: '#sluzby',   label: 'Služby' },
  { href: '#projekty', label: 'Projekty' },
  { href: '#reference',label: 'Reference' },
  { href: '#kontakt',  label: 'Kontakt' },
]

export default function Navigation() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const pathname = usePathname()

  const isHome = pathname === '/'
  const href = (anchor: string) => isHome ? anchor : `/${anchor}`

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {/* Nav bar — always on top */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          menuOpen
            ? 'bg-dark'
            : scrolled
              ? 'bg-dark/95 backdrop-blur-md border-b border-white/5'
              : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 md:px-10 py-5 flex items-center justify-between md:grid md:grid-cols-3 md:items-center">

          {/* Logo — left */}
          <a href="/" className="flex items-center shrink-0 relative z-10">
            <img src="/logo.svg" alt="JT Reality" className="h-9 w-auto" />
          </a>

          {/* Desktop links — perfectly centered */}
          <ul className="hidden md:flex justify-center items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={href(link.href)}
                  className="text-xs font-medium text-white/50 hover:text-gold transition-colors duration-300 tracking-[0.18em] uppercase whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center justify-end">
            {/* Desktop CTA */}
            <a
              href={href('#kontakt')}
              className="hidden md:inline-flex items-center gap-2 border border-gold/60 text-gold px-5 py-2.5 text-xs tracking-[0.18em] uppercase hover:bg-gold hover:text-dark transition-all duration-300 font-medium"
            >
              Konzultace zdarma
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 relative z-10"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Zavřít menu' : 'Otevřít menu'}
            >
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`
          md:hidden fixed inset-0 z-40 bg-dark
          flex flex-col
          transition-all duration-400
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Spacer for nav bar height */}
        <div className="h-[72px] shrink-0 border-b border-white/5" />

        {/* Menu content — vertically centered */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10">

          {/* Links */}
          <ul className="space-y-6 mb-12">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{
                  transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                  transform: menuOpen ? 'translateX(0)' : 'translateX(-16px)',
                  opacity: menuOpen ? 1 : 0,
                  transition: 'transform 0.4s ease, opacity 0.4s ease',
                }}
              >
                <a
                  href={href(link.href)}
                  className="font-display text-[2rem] font-bold text-white/70 hover:text-gold transition-colors duration-200 tracking-tight leading-none"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div
            style={{
              transitionDelay: menuOpen ? `${navLinks.length * 60}ms` : '0ms',
              transform: menuOpen ? 'translateX(0)' : 'translateX(-16px)',
              opacity: menuOpen ? 1 : 0,
              transition: 'transform 0.4s ease, opacity 0.4s ease',
            }}
          >
            <a
              href={href('#kontakt')}
              className="inline-flex items-center gap-2 border border-gold/60 text-gold px-6 py-3 text-xs tracking-[0.18em] uppercase hover:bg-gold hover:text-dark transition-all duration-300 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Konzultace zdarma
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
