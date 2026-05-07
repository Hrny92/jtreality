import Image from 'next/image'

const navLinks = [
  { href: '/#o-mne',    label: 'O mně' },
  { href: '/#sluzby',   label: 'Služby' },
  { href: '/#projekty', label: 'Projekty' },
  { href: '/#reference',label: 'Reference' },
  { href: '/#kontakt',  label: 'Kontakt' },
  { href: '/projekty',  label: 'Celá nabídka' },
]

const contactItems = [
  { label: 'Telefon', value: '+420 704 011 022',           href: 'tel:+420704011022' },
  { label: 'E-mail',  value: 'info@jtreality.cz',          href: 'mailto:info@jtreality.cz' },
  { label: 'Web',     value: 'www.jtreality.cz',           href: 'https://www.jtreality.cz' },
  { label: 'Sídlo',   value: 'Všehlušická 1665, 274 01 Slaný', href: null },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-dark border-t border-white/6" style={{ zIndex: 10 }}>

      {/* ── Main footer grid ── */}
      <div className="container mx-auto px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

        {/* Col 1 — Brand */}
        <div className="lg:col-span-1">
          <a href="/" className="inline-block mb-6">
            <Image src="/logo.svg" alt="JT Reality" width={120} height={36} className="h-9 w-auto" />
          </a>
          <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xs">
            Komplexní realitní a developerský servis. Od vyhledání pozemku přes povolení až po prodej — vše pod jednou střechou.
          </p>
          <div>
            <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase mb-1">Zakladatel</p>
            <p className="font-display font-bold text-white text-lg">Jura Temer</p>
          </div>
        </div>

        {/* Col 2 — Navigace */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold mb-6">Navigace</h4>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-white/45 text-sm hover:text-gold transition-colors duration-300 tracking-wide"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Kontakt */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold mb-6">Kontakt</h4>
          <ul className="space-y-4">
            {contactItems.map((item) => (
              <li key={item.label}>
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-0.5">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="text-sm text-white/55 hover:text-gold transition-colors duration-300">
                    {item.value}
                  </a>
                ) : (
                  <span className="text-sm text-white/55">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Právní */}
        <div>
          <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold mb-6">Právní info</h4>
          <ul className="space-y-3 mb-8">
            <li>
              <a href="/gdpr" className="text-white/45 text-sm hover:text-gold transition-colors duration-300">
                Ochrana osobních údajů (GDPR)
              </a>
            </li>
            <li>
              <a href="/gdpr#cookies" className="text-white/45 text-sm hover:text-gold transition-colors duration-300">
                Zásady cookies
              </a>
            </li>
          </ul>

          {/* Licence / registrace makléře */}
          <div className="border border-white/8 p-4">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/20 mb-1">Podnikatel</p>
            <p className="text-xs text-white/35 leading-relaxed">
              Juraj Temer, OSVČ<br />
              IČO: 87390523<br />
              Finanční úřad ve Slaném
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/18 text-xs tracking-wide text-center sm:text-left">
            © {year} JT Reality — Jura Temer. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-6">
            <a href="/gdpr" className="text-white/18 text-xs hover:text-white/40 transition-colors duration-300">
              GDPR
            </a>
            <a href="/gdpr#cookies" className="text-white/18 text-xs hover:text-white/40 transition-colors duration-300">
              Cookies
            </a>
            <span className="text-white/10 text-xs">www.jtreality.cz</span>
          </div>
        </div>
      </div>

    </footer>
  )
}
