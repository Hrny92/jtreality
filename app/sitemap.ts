import { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity'

const BASE_URL = 'https://www.jtreality.cz'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all property slugs from Sanity
  const properties: { slug: string; updatedAt: string }[] = await sanityClient.fetch(`
    *[_type == "property"] {
      "slug": slug.current,
      "updatedAt": _updatedAt
    }
  `).catch(() => [])

  const propertyUrls: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE_URL}/projekty/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/projekty`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gdpr`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...propertyUrls,
  ]
}
