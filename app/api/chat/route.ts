import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

interface GeminiResponse {
  candidates?: {
    content: { parts: { text: string }[] }
    finishReason: string
  }[]
  error?: { message: string }
}

// ── Sanity fetchers ───────────────────────────────────────────────────────────

async function fetchBrain() {
  return sanityClient.fetch(`
    *[_type == "chatbotBrain" && active == true][0] {
      botName, systemPrompt, companyInfo,
      faqs[]{ question, answer },
      extraKnowledge
    }
  `)
}

async function fetchProperties() {
  return sanityClient.fetch(`
    *[_type == "property" && status != "sold"] | order(_createdAt desc) {
      title, transactionType, category, location, price, area, layout, status,
      "slug": slug.current
    }
  `)
}

// ── Build system instruction ──────────────────────────────────────────────────

function buildSystemInstruction(brain: Record<string, unknown>, properties: Record<string, unknown>[]): string {
  const lines: string[] = []

  lines.push(String(brain?.systemPrompt ?? 'Jsi přátelský realitní asistent JT Reality.'))
  lines.push('')

  if (brain?.companyInfo) {
    lines.push('## Informace o firmě')
    lines.push(String(brain.companyInfo))
    lines.push('')
  }

  if (properties.length > 0) {
    lines.push('## Aktuální nabídka nemovitostí')
    lines.push('Toto jsou nemovitosti, které JT Reality aktuálně nabízí:')
    properties.forEach((p, i) => {
      const type = p.transactionType === 'prodej' ? 'Prodej' : 'Pronájem'
      const cat  = { byt: 'Byt', dum: 'Dům', pozemek: 'Pozemek', komerce: 'Komerční' }[p.category as string] ?? String(p.category)
      const status = { active: 'Aktivní', reserved: 'Rezervováno' }[p.status as string] ?? String(p.status)
      lines.push(
        `${i + 1}. ${p.title} — ${type}, ${cat}, ${p.location ?? '—'}, ` +
        `Cena: ${p.price ?? 'na dotaz'}, Plocha: ${p.area ?? '—'} m², ` +
        `Dispozice: ${p.layout ?? '—'}, Stav: ${status}, ` +
        `Detail: /projekty/${p.slug}`
      )
    })
    lines.push('')
  } else {
    lines.push('## Nabídka')
    lines.push('Aktuálně nejsou k dispozici žádné aktivní nabídky. Navrhni kontakt.')
    lines.push('')
  }

  const faqs = brain?.faqs as { question: string; answer: string }[] | undefined
  if (faqs && faqs.length > 0) {
    lines.push('## Časté otázky')
    faqs.forEach(faq => {
      lines.push(`Otázka: ${faq.question}`)
      lines.push(`Odpověď: ${faq.answer}`)
    })
    lines.push('')
  }

  lines.push('## Pravidla chování')
  lines.push('- Vždy odpovídej česky.')
  lines.push('- Buď stručný, přátelský a profesionální.')
  lines.push('- Pokud se ptají na konkrétní nemovitost, odkazuj na /projekty/[slug].')
  lines.push('- Pokud nevíš, doporuč kontakt na Juru Temera přes sekci Kontakt.')
  lines.push('- Nikdy nevymýšlej informace o nemovitostech, které ti nebyly předány.')

  return lines.join('\n')
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json() as {
      message: string
      history: ChatMessage[]
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Prázdná zpráva' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json({ error: 'GEMINI_API_KEY není nastaven v .env.local' }, { status: 500 })
    }

    // Fetch context from Sanity
    const [brain, properties] = await Promise.all([fetchBrain(), fetchProperties()])
    const systemInstruction = buildSystemInstruction(brain ?? {}, properties ?? [])

    // Build Gemini request
    const model = process.env.GEMINI_MODEL ?? 'gemini-3.0-flash'
    const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const contents: ChatMessage[] = [
      ...history.slice(-10),  // keep last 10 turns for context window
      { role: 'user', parts: [{ text: message }] },
    ]

    const geminiRes = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature:     0.7,
          maxOutputTokens: 1024,
          topP:            0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    })

    const data = await geminiRes.json() as GeminiResponse

    if (!geminiRes.ok || data.error) {
      console.error('Gemini error:', JSON.stringify(data.error))
      console.error('Gemini HTTP status:', geminiRes.status, '| model:', model)
      const msg = data.error?.message ?? `Gemini HTTP ${geminiRes.status}`
      return NextResponse.json({ error: msg }, { status: 500 })
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Omlouvám se, zkuste to prosím znovu.'

    return NextResponse.json({ reply })

  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Interní chyba serveru' }, { status: 500 })
  }
}
