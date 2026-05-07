'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface ChatHistory {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDot, setShowDot] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
      setShowDot(false)
    }
  }, [open])

  const buildHistory = (msgs: Message[]): ChatHistory[] =>
    msgs.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }))

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: buildHistory(messages),
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const reply = data.reply ?? 'Omlouvám se, zkuste to prosím znovu.'
      setMessages([...newMessages, { role: 'assistant', text: reply }])
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Chyba připojení.'
      setMessages([...newMessages, { role: 'assistant', text: `⚠️ ${msg}` }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat window */}
      <div
        className={`
          fixed bottom-24 right-4 md:right-6 z-[90]
          w-[calc(100vw-2rem)] max-w-sm
          flex flex-col
          bg-[#0e0e0e] border border-white/10
          shadow-[0_8px_48px_rgba(0,0,0,0.7)]
          transition-all duration-300 origin-bottom-right
          ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'}
        `}
        style={{ height: '480px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 shrink-0">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f9b233" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium leading-tight">JT Asistent</p>
            <p className="text-white/30 text-[11px]">Realitní poradce JT Reality</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
            aria-label="Zavřít chat"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
          {/* Welcome message */}
          {messages.length === 0 && (
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f9b233" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
                <p className="text-white/75 text-sm leading-relaxed">
                  Dobrý den! Jsem JT Asistent. Mohu vám pomoci s výběrem nemovitosti nebo odpovědět na vaše otázky. Jak vám mohu pomoci?
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f9b233" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
              )}
              <div
                className={`
                  rounded-2xl px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-gold/15 border border-gold/20 text-white/85 rounded-tr-sm'
                    : 'bg-white/5 border border-white/8 text-white/75 rounded-tl-sm'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f9b233" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-white/8 shrink-0">
          <div className="flex gap-2 items-center bg-white/5 border border-white/8 rounded-xl px-3 py-2 focus-within:border-gold/30 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Napište zprávu…"
              className="flex-1 bg-transparent text-white/80 text-sm placeholder:text-white/25 outline-none"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-lg bg-gold/90 hover:bg-gold disabled:bg-white/10 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              aria-label="Odeslat"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={!input.trim() || loading ? '#ffffff40' : '#000'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-white/15 text-[10px] text-center mt-2">Powered by JT Reality AI · Google Gemini</p>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`
          fixed bottom-6 right-4 md:right-6 z-[90]
          w-14 h-14 rounded-full
          bg-gold hover:bg-gold/90
          shadow-[0_4px_24px_rgba(249,178,51,0.35)]
          flex items-center justify-center
          transition-all duration-300
          ${open ? 'rotate-0' : ''}
        `}
        aria-label={open ? 'Zavřít chat' : 'Otevřít chat'}
      >
        {/* Notification dot */}
        {showDot && !open && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-white border-2 border-[#0e0e0e]" />
        )}

        {/* Icon — chat or close */}
        <div className={`transition-all duration-200 ${open ? 'scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className={`transition-all duration-200 ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0 absolute'}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </button>
    </>
  )
}
