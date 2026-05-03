export default {
  name: 'property',
  title: 'Nemovitosti',
  type: 'document',
  fields: [
    { name: 'title', title: 'Název nemovitosti', type: 'string' },
    { 
      name: 'slug', 
      title: 'Slug (URL adresa)', 
      type: 'slug', 
      options: { source: 'title', maxLength: 200 } 
    },
    { 
      name: 'transactionType',
      title: 'Typ transakce',
      type: 'string',
      options: {
        list: [
          { title: 'Prodej', value: 'prodej' },
          { title: 'Pronájem', value: 'pronajem' }
        ],
        layout: 'radio'
      },
      initialValue: 'prodej'
    },
    {
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Byt', value: 'byt' },
          { title: 'Dům', value: 'dum' },
          { title: 'Pozemek', value: 'pozemek' },
          { title: 'Komerce', value: 'komerce' }
        ]
      },
      initialValue: 'byt'
    },
    { name: 'location', title: 'Lokalita', type: 'string' },
    { name: 'price', title: 'Cena', type: 'string' },
    { name: 'area', title: 'Plocha (m2)', type: 'string' },
    { name: 'layout', title: 'Dispozice', type: 'string' },
    { 
      name: 'status',
      title: 'Stav nabídky',
      type: 'string',
      options: {
        list: [
          {title: 'Aktivní', value: 'active'},
          {title: 'Rezervováno', value: 'reserved'},
          {title: 'Prodáno', value: 'sold'}
        ],
        layout: 'radio'
      },
      initialValue: 'active'
    },
    { name: 'mainImage', title: 'Hlavní obrázek', type: 'image', options: { hotspot: true } },
    { name: 'gallery', title: 'Galerie', type: 'array', of: [{ type: 'image' }], options: {
        layout: 'grid' // <--- Toto z tvé galerie udělá velkou přehlednou dlaždicovou mřížku
      } },
    { name: 'videoUrl', title: 'Odkaz na YouTube', type: 'url' },
    { 
      name: 'matterportUrl', 
      title: 'Odkaz na 3D prohlídku (Matterport)', 
      type: 'url',
      description: 'Vložte odkaz na 3D model (např. https://my.matterport.com/show/?m=xyz)'
    },
    { 
      name: 'description', 
      title: 'Popis nemovitosti', 
      type: 'array', 
      of: [{ type: 'block' }] 
    },
    // Technická sekce
    { name: 'accessories', title: 'Příslušenství', type: 'string', description: 'Např. Výtah, garáž, parkovací místo' },
    { name: 'energyEfficiency', title: 'Energetická náročnost', type: 'string', description: 'Např. Třída B' },
    { name: 'buildingInfo', title: 'Stavba a podlaží', type: 'string' },
    { name: 'infrastructure', title: 'Infrastruktura', type: 'string' },
    { name: 'mapLink', title: 'Odkaz na mapu (Embed/Link)', type: 'string' },
    { name: 'history', title: 'Historie / Rekonstrukce', type: 'text' },
  ]
}