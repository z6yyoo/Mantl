'use client'
import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function Disclaimer() {
  const [dismissed, setDismissed] = useState(true) // hidden by default until hydrated

  useEffect(() => {
    const val = localStorage.getItem('poly31-disclaimer')
    if (val !== 'dismissed') setDismissed(false)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('poly31-disclaimer', 'dismissed')
  }

  if (dismissed) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] glass-panel px-4 py-3 animate-slide-in">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[var(--accent-yellow)] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            <strong className="text-[var(--text-primary)]">Educational Tool Only.</strong>{' '}
            This visualization is for research and education. It does not constitute financial advice.
            Prediction market data may be delayed or estimated. Not available for trading in Thailand.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
          aria-label="Dismiss disclaimer"
        >
          <X className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>
    </div>
  )
}
