import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ServicesTitleSection from '@/components/ServicesTitleSection'
import ServicesSection from '@/components/ServicesSection'
import ProjectsSection from '@/components/ProjectsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { getLatestProperties } from '@/lib/queries'

export default async function Home() {
  const properties = await getLatestProperties(3)

  return (
    <main className="bg-dark">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesTitleSection />
      <ServicesSection />
      <ProjectsSection properties={properties} />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
