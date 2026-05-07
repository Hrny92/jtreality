import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import CookieBanner from '@/components/CookieBanner'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const BASE_URL = 'https://www.jtreality.cz'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'JT Reality – Realitní makléř Slaný | Development, pozemky, nemovitosti',
    template: '%s | JT Reality',
  },
  description:
    'Juraj Temer – zkušený realitní makléř a developer se sídlem ve Slaném. Prodej a pronájem nemovitostí, vyhledávání pozemků, development a inženýring v Středočeském kraji a okolí Prahy. Kontakt: +420 704 011 022.',
  keywords: [
    'realitní makléř Slaný', 'JT Reality', 'Juraj Temer', 'Jura Temer',
    'nemovitosti Kladno', 'pozemky Středočeský kraj', 'development nemovitosti',
    'prodej domů Slaný', 'pronájem bytů Kladno', 'realitní kancelář Slaný',
    'inženýring stavební povolení', 'vyhledávání pozemků Praha',
    'nemovitosti Středočeský kraj', 'reality Kladno',
  ],
  authors: [{ name: 'Juraj Temer', url: BASE_URL }],
  creator: 'Juraj Temer',
  publisher: 'JT Reality',

  // Canonical
  alternates: {
    canonical: BASE_URL,
    languages: { 'cs-CZ': BASE_URL },
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: BASE_URL,
    siteName: 'JT Reality',
    title: 'JT Reality – Realitní makléř Slaný | Development, pozemky, nemovitosti',
    description:
      'Juraj Temer – zkušený realitní makléř a developer se sídlem ve Slaném. Prodej, pronájem, development a inženýring v Středočeském kraji.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JT Reality – Juraj Temer, realitní makléř Slaný',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: 'JT Reality – Realitní makléř Slaný',
    description: 'Prodej, pronájem, development a inženýring nemovitostí v Středočeském kraji.',
    images: ['/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Verification (doplňte po přidání do Google Search Console)
  // verification: {
  //   google: 'VÁŠ_VERIFICATION_TOKEN',
  // },
}

// JSON-LD structured data — LocalBusiness + RealEstateAgent
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'RealEstateAgent'],
      '@id': `${BASE_URL}/#business`,
      name: 'JT Reality',
      alternateName: 'Juraj Temer – JT Reality',
      description:
        'Realitní makléř a developer Juraj Temer nabízí prodej a pronájem nemovitostí, vyhledávání pozemků, development a inženýring v Středočeském kraji a okolí Prahy.',
      url: BASE_URL,
      telephone: '+420704011022',
      email: 'info@jtreality.cz',
      foundingDate: '2010-10-22',
      taxID: '87390523',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Všehlušická 1665',
        addressLocality: 'Slaný',
        postalCode: '27401',
        addressRegion: 'Středočeský kraj',
        addressCountry: 'CZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 50.22872,
        longitude: 14.08457,
      },
      areaServed: [
        { '@type': 'State', name: 'Středočeský kraj' },
        { '@type': 'City',  name: 'Slaný' },
        { '@type': 'City',  name: 'Kladno' },
        { '@type': 'City',  name: 'Praha' },
      ],
      serviceType: [
        'Prodej nemovitostí',
        'Pronájem nemovitostí',
        'Development',
        'Vyhledávání pozemků',
        'Inženýring a stavební povolení',
        'Projektové řízení',
      ],
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      sameAs: [
        BASE_URL,
      ],
    },
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: 'Juraj Temer',
      alternateName: 'Jura Temer',
      jobTitle: 'Realitní makléř a developer',
      worksFor: { '@id': `${BASE_URL}/#business` },
      url: BASE_URL,
      telephone: '+420704011022',
      email: 'info@jtreality.cz',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Slaný',
        addressRegion: 'Středočeský kraj',
        addressCountry: 'CZ',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'JT Reality',
      inLanguage: 'cs-CZ',
      publisher: { '@id': `${BASE_URL}/#business` },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-dark text-white antialiased">
        {children}
        <CookieBanner />
        <ChatWidget />
      </body>
    </html>
  )
}
