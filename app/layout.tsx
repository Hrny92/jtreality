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

export const metadata: Metadata = {
  title: 'JT Reality – Development, pozemky, nemovitosti',
  description:
    'JT Reality – 5 let zkušeností v developmentu, vyhledávání lukrativních pozemků a zajištění kompletní administrativy. Vaše vize měníme v realitu.',
  keywords: 'reality, development, pozemky, nemovitosti, Jura Temer, JT Reality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans bg-dark text-white antialiased">
        {children}
        <CookieBanner />
        <ChatWidget />
      </body>
    </html>
  )
}
