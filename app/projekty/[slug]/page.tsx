import { notFound } from 'next/navigation'
import { getPropertyBySlug, getAllProperties } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import Navigation from '@/components/Navigation'

// Simple portable text → plain paragraphs (no extra dependency needed)
function BlockText({ value }: { value: unknown[] }) {
  return (
    <div className="space-y-4">
      {value.map((block: unknown, i: number) => {
        const b = block as { _type: string; children?: { text: string }[] }
        if (b._type !== 'block') return null
        const text = (b.children ?? []).map((c) => c.text).join('')
        return <p key={i} className="text-white/60 leading-relaxed">{text}</p>
      })}
    </div>
  )
}

export const revalidate = 60

// ── Static params (optional — for SSG) ───────────────────────────────────────

export async function generateStaticParams() {
  const props = await getAllProperties()
  return props.map((p) => ({ slug: p.slug?.current })).filter(Boolean)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
  active: 'Aktivní', reserved: 'Rezervováno', sold: 'Prodáno',
}
const STATUS_CLASS: Record<string, string> = {
  active:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  reserved: 'bg-gold/15 text-gold border-gold/30',
  sold:     'bg-white/10 text-white/40 border-white/15',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PropertyDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const property = await getPropertyBySlug(params.slug)
  if (!property) notFound()

  const gallery = property.gallery ?? []

  return (
    <main className="bg-dark min-h-screen">
      <Navigation />

      {/* Hero image */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {property.mainImage ? (
          <img
            src={urlFor(property.mainImage).width(1600).height(900).url()}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-dark-200 flex items-center justify-center">
            <span className="text-white/10 text-8xl font-display font-bold">JT</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />

        {/* Back */}
        <a
          href="/projekty"
          className="absolute top-24 left-8 md:left-14 flex items-center gap-2 text-xs text-white/50 tracking-[0.2em] uppercase hover:text-gold transition-colors"
        >
          ← Zpět na nabídku
        </a>

        {/* Status badge */}
        <div className="absolute top-24 right-8 md:right-14">
          <span className={`text-[10px] tracking-[0.25em] uppercase px-4 py-2 font-medium border ${STATUS_CLASS[property.status] ?? STATUS_CLASS.active}`}>
            {STATUS_LABEL[property.status] ?? property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Left — main info */}
          <div className="lg:col-span-2">
            {property.location && (
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3">{property.location}</p>
            )}
            <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-tight mb-10">
              {property.title}
            </h1>

            {/* Description */}
            {property.description && (
              <div className="mb-12">
                <BlockText value={property.description as unknown[]} />
              </div>
            )}

            {/* Video */}
            {property.videoUrl && (
              <div className="mb-12">
                <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Video prohlídka</h3>
                <div className="aspect-video">
                  <iframe
                    src={property.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Matterport */}
            {property.matterportUrl && (
              <div className="mb-12">
                <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">3D prohlídka</h3>
                <div className="aspect-video">
                  <iframe
                    src={property.matterportUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Galerie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((img: object, i: number) => (
                    <img
                      key={i}
                      src={urlFor(img).width(600).height(400).url()}
                      alt={`Foto ${i + 1}`}
                      className="w-full aspect-[3/2] object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — parametry + CTA */}
          <div className="lg:col-span-1">
            <div className="border border-white/8 p-8 sticky top-28">

              {/* Price */}
              {property.price && (
                <div className="mb-8 pb-8 border-b border-white/8">
                  <p className="text-xs tracking-[0.25em] uppercase text-white/30 mb-1">Cena</p>
                  <p className="font-display text-3xl font-bold text-gold">{property.price}</p>
                </div>
              )}

              {/* Parameters */}
              <div className="space-y-4 mb-10">
                {[
                  ['Plocha',     property.area   ? `${property.area} m²` : null],
                  ['Dispozice',  property.layout],
                  ['Typ',        property.category === 'byt' ? 'Byt' : property.category === 'dum' ? 'Dům' : property.category === 'pozemek' ? 'Pozemek' : property.category === 'komerce' ? 'Komerční' : property.category],
                  ['Transakce',  property.transactionType === 'prodej' ? 'Prodej' : 'Pronájem'],
                  ['Energetika', property.energyEfficiency],
                  ['Stavba',     property.buildingInfo],
                  ['Příslušenství', property.accessories],
                  ['Infrastruktura', property.infrastructure],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string} className="flex justify-between gap-4">
                    <span className="text-xs text-white/30 tracking-wide">{label}</span>
                    <span className="text-xs text-white/70 text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="/#kontakt"
                className="block w-full bg-gold text-dark text-center py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-gold-light transition-colors duration-300"
              >
                Mám zájem
              </a>
              <a
                href="/#kontakt"
                className="block w-full mt-3 border border-white/15 text-white/50 text-center py-4 text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
              >
                Sjednat prohlídku
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
