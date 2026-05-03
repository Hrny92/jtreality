'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('jt_cookie_consent')
      if (!consent) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('jt_cookie_consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('jt_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] bg-dark-100/98 backdrop-blur-md border-t border-white/8"
      role="dialog"
      aria-label="Souhlas s cookies"
    >
      {/* Gold accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="container mx-auto px-6 md:px-10 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-sm leading-relaxed">
              Tento web používá cookies ke zlepšení uživatelského zážitku a analýze návštěvnosti.{' '}
              <a
                href="/gdpr#cookies"
                className="text-gold hover:underline"
              >
                Více informací
              </a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={reject}
              className="px-6 py-2.5 text-xs tracking-[0.18em] uppercase text-white/40 border border-white/12 hover:border-white/25 hover:text-white/60 transition-all duration-300"
            >
              Odmítnout
            </button>
            <button
              onClick={accept}
              className="px-6 py-2.5 text-xs tracking-[0.18em] uppercase bg-gold text-dark font-bold hover:bg-gold-light transition-colors duration-300"
            >
              Přijmout vše
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
