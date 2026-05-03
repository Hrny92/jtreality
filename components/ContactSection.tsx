'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-anim', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section
      ref={sectionRef}
      id="kontakt"
      className="relative bg-dark-100 overflow-hidden"
    >
      {/* Decorative bg gradient */}
      <div className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none">
        <div className="w-full h-full bg-gradient-to-l from-gold/4 to-transparent" />
      </div>
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="container mx-auto px-6 md:px-10 pt-28 md:pt-40 pb-28 md:pb-40 relative z-10">
        {/* Label */}
        <div className="flex items-center gap-3 mb-6 contact-anim">
          <span className="text-gold text-xs tracking-[0.35em] uppercase">06</span>
          <span className="block w-10 h-[1px] bg-white/10" />
          <span className="text-white/30 text-xs tracking-[0.2em] uppercase">Kontakt</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
          {/* Left: info */}
          <div>
            <h2 className="contact-anim font-display text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.05] mb-8">
              Pojďme se potkat
              <br />
              <span className="text-gold">u vašeho projektu</span>
            </h2>

            <p className="contact-anim text-white/55 text-lg leading-relaxed">
              Máte pozemek na prodej, hledáte investiční příležitost nebo vás
              zajímá naše aktuální výstavba? Ozvěte se mi, probereme to u kávy.
            </p>
          </div>

          {/* Right: form */}
          <div className="contact-anim">
            {sent ? (
              <div className="flex flex-col items-start justify-center h-full min-h-[400px]">
                <div className="w-12 h-[1px] bg-gold mb-8" />
                <h3 className="font-display text-3xl font-bold mb-4">
                  Zpráva odeslána!
                </h3>
                <p className="text-white/50 leading-relaxed">
                  Děkuji za váš zájem. Ozvu se vám co nejdříve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {[
                  { name: 'name', label: 'Jméno a příjmení', type: 'text', placeholder: 'Jan Novák' },
                  { name: 'email', label: 'E-mailová adresa', type: 'email', placeholder: 'vas@email.cz' },
                  { name: 'phone', label: 'Telefon', type: 'tel', placeholder: '+420 xxx xxx xxx' },
                ].map((field) => (
                  <div key={field.name} className="group">
                    <label className="block text-white/30 text-[10px] tracking-[0.3em] uppercase mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/10 group-focus-within:border-gold py-3 text-white placeholder-white/15 outline-none transition-colors duration-300 text-sm"
                    />
                  </div>
                ))}

                <div className="group">
                  <label className="block text-white/30 text-[10px] tracking-[0.3em] uppercase mb-2">
                    Zpráva
                  </label>
                  <textarea
                    name="message"
                    placeholder="Popište váš záměr nebo dotaz..."
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-white/10 group-focus-within:border-gold py-3 text-white placeholder-white/15 outline-none transition-colors duration-300 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold text-dark py-4 font-display font-bold tracking-[0.15em] uppercase text-xs hover:bg-gold-light transition-colors duration-300 mt-2"
                >
                  Odeslat zprávu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}
