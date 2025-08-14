'use client'

import { useState } from 'react'

export type HowItWorksProps = {
  title: string
  subtitle?: string
  steps: Array<{ title: string; detail: string }>
  tips?: string[]
  sources?: Array<{ label: string; url: string }>
  triggerLabel?: string
}

export default function HowItWorks({
  title,
  subtitle,
  steps,
  tips,
  sources,
  triggerLabel = 'איך זה עובד?',
}: HowItWorksProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="w-full" dir="rtl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-right bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md"
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="mt-2 border rounded-md bg-white p-4 text-right">
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}

          <ol className="list-decimal pr-5 space-y-2">
            {steps.map((s, i) => (
              <li key={i}>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-gray-700">{s.detail}</p>
              </li>
            ))}
          </ol>

          {tips && tips.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">טיפים</h3>
              <ul className="list-disc pr-5 space-y-1">
                {tips.map((t, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sources && sources.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">מקורות</h3>
              <ul className="list-disc pr-5 space-y-1">
                {sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

