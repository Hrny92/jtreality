'use client'

export default function ResetCookiesButton() {
  const handleReset = () => {
    try { localStorage.removeItem('jt_cookie_consent') } catch { /* */ }
    window.location.reload()
  }

  return (
    <button
      onClick={handleReset}
      className="mt-2 inline-flex border border-gold/40 text-gold px-6 py-2.5 text-xs tracking-[0.18em] uppercase hover:bg-gold hover:text-dark transition-all duration-300"
    >
      Resetovat souhlas s cookies
    </button>
  )
}
