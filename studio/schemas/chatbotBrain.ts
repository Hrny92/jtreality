import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatbotBrain',
  title: 'AI Chatbot — Mozek',
  type: 'document',
  fields: [
    defineField({
      name: 'botName',
      title: 'Jméno chatbota',
      type: 'string',
      initialValue: 'JT Asistent',
      description: 'Jak se chatbot představí návštěvníkovi.',
    }),
    defineField({
      name: 'systemPrompt',
      title: 'Systémový prompt — chování a role',
      type: 'text',
      rows: 8,
      description: 'Hlavní instrukce pro AI. Definuj roli, tón, co má a nemá říkat.',
      initialValue:
        'Jsi přátelský realitní asistent JT Reality. Pomáháš návštěvníkům webu najít vhodnou nemovitost, odpovídáš na otázky o nabídce a službách. Vždy odpovídej česky, stručně a profesionálně. Pokud nevíš odpověď, navrhni kontakt na Juru Temera.',
    }),
    defineField({
      name: 'companyInfo',
      title: 'Informace o firmě',
      type: 'text',
      rows: 6,
      description: 'Popis firmy, zakladatele, kontaktní údaje, adresa — chatbot to použije při odpovídání.',
    }),
    defineField({
      name: 'faqs',
      title: 'Časté otázky a odpovědi',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Otázka & Odpověď',
          fields: [
            defineField({ name: 'question', title: 'Otázka',   type: 'string' }),
            defineField({ name: 'answer',   title: 'Odpověď', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),
    defineField({
      name: 'extraKnowledge',
      title: 'Dodatečné znalosti',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Libovolné informace navíc — postupy, ceníky, oblasti pokrytí, podmínky…',
    }),
    defineField({
      name: 'active',
      title: 'Chatbot aktivní',
      type: 'boolean',
      initialValue: true,
      description: 'Pokud vypneš, chatbot se na webu nezobrazí.',
    }),
  ],
})
