export default {
  name: 'chatbotBrain',
  title: 'AI Chatbot — Mozek',
  type: 'document',
  // Singleton — jen jeden dokument
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'name',
      title: 'Název (interní)',
      type: 'string',
      initialValue: 'Mozek chatbota',
      description: 'Interní název — nezobrazuje se na webu.',
    },
    {
      name: 'botName',
      title: 'Jméno chatbota',
      type: 'string',
      initialValue: 'JT Asistent',
      description: 'Jak se chatbot představí návštěvníkovi.',
    },
    {
      name: 'systemPrompt',
      title: 'Systémový prompt — chování a role',
      type: 'text',
      rows: 8,
      description: 'Hlavní instrukce pro AI. Definuj roli, tón, co má a nemá říkat.',
      initialValue:
        'Jsi přátelský realitní asistent JT Reality. Pomáháš návštěvníkům webu najít vhodnou nemovitost, odpovídáš na otázky o nabídce a službách. Vždy odpovídej česky, stručně a profesionálně. Pokud nevíš odpověď, navrhni kontakt na Juru Temera.',
    },
    {
      name: 'companyInfo',
      title: 'Informace o firmě',
      type: 'text',
      rows: 6,
      description: 'Popis firmy, zakladatele, kontaktní údaje, adresa — chatbot to použije při odpovídání.',
    },
    {
      name: 'faqs',
      title: 'Časté otázky a odpovědi',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Otázka & Odpověď',
          fields: [
            { name: 'question', title: 'Otázka', type: 'string' },
            { name: 'answer',   title: 'Odpověď', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    },
    {
      name: 'extraKnowledge',
      title: 'Dodatečné znalosti',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Libovolné informace navíc — postupy, ceníky, oblasti pokrytí, podmínky…',
    },
    {
      name: 'active',
      title: 'Chatbot aktivní',
      type: 'boolean',
      initialValue: true,
      description: 'Pokud vypneš, chatbot se na webu nezobrazí.',
    },
  ],
}
