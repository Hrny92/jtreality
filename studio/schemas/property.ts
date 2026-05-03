import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Nemovitosti',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Název nemovitosti', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug (URL adresa)',
      type: 'slug',
      options: { source: 'title', maxLength: 200 },
    }),
    defineField({
      name: 'transactionType',
      title: 'Typ transakce',
      type: 'string',
      options: {
        list: [
          { title: 'Prodej',    value: 'prodej' },
          { title: 'Pronájem', value: 'pronajem' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Byt',        value: 'byt' },
          { title: 'Dům',        value: 'dum' },
          { title: 'Pozemek',    value: 'pozemek' },
          { title: 'Komerční',   value: 'komerce' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'location',    title: 'Lokalita',           type: 'string' }),
    defineField({ name: 'price',       title: 'Cena (Kč)',          type: 'number' }),
    defineField({ name: 'area',        title: 'Plocha (m²)',        type: 'number' }),
    defineField({ name: 'layout',      title: 'Dispozice',          type: 'string',
      description: 'Např. 3+kk, 4+1, 800 m²' }),
    defineField({
      name: 'status',
      title: 'Stav inzerátu',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Aktivní',     value: 'active' },
          { title: 'Rezervováno', value: 'reserved' },
          { title: 'Prodáno',     value: 'sold' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Hlavní fotografie',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Fotogalerie',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'description',
      title: 'Popis nemovitosti',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'videoUrl',      title: 'Video URL (YouTube/Vimeo)', type: 'url' }),
    defineField({ name: 'matterportUrl', title: 'Matterport 3D prohlídka URL', type: 'url' }),
    defineField({
      name: 'features',
      title: 'Parametry a vybavení',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title:    'title',
      location: 'location',
      status:   'status',
      media:    'mainImage',
    },
    prepare({ title, location, status, media }) {
      const statusLabel = { active: '🟢', reserved: '🟡', sold: '🔴' }[status as string] ?? ''
      return { title: `${statusLabel} ${title}`, subtitle: location, media }
    },
  },
})
