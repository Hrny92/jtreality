import { sanityClient } from './sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Property {
  _id: string
  title: string
  slug: { current: string }
  transactionType: 'prodej' | 'pronajem'
  category: 'byt' | 'dum' | 'pozemek' | 'komerce'
  location: string
  price: string
  area: string
  layout: string
  status: 'active' | 'reserved' | 'sold'
  mainImage: object | null
  description?: unknown[]
  gallery?: object[]
  videoUrl?: string
  matterportUrl?: string
  accessories?: string
  energyEfficiency?: string
  buildingInfo?: string
  infrastructure?: string
  mapLink?: string
  history?: string
}

// ── Card projection (lightweight — for listings) ──────────────────────────────

const CARD_PROJECTION = `{
  _id, title, slug,
  transactionType, category, location,
  price, area, layout, status,
  mainImage
}`

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getLatestProperties(count = 3): Promise<Property[]> {
  return sanityClient.fetch(
    `*[_type == "property"] | order(_createdAt desc) [0...$count] ${CARD_PROJECTION}`,
    { count: count - 1 }   // Sanity slice [0...$n] is inclusive
  )
}

export async function getAllProperties(): Promise<Property[]> {
  return sanityClient.fetch(
    `*[_type == "property"] | order(_createdAt desc) ${CARD_PROJECTION}`
  )
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  return sanityClient.fetch(
    `*[_type == "property" && slug.current == $slug][0] {
      _id, title, slug,
      transactionType, category, location,
      price, area, layout, status,
      mainImage, gallery, description,
      videoUrl, matterportUrl,
      accessories, energyEfficiency, buildingInfo, infrastructure, mapLink, history
    }`,
    { slug }
  )
}
