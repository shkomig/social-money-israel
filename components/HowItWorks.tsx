"use client"

import React, {useEffect, useId, useMemo, useRef, useState} from "react"

// Keyboard helpers (exported for minimal unit tests and reuse)
export function isToggleKey(key: string) {
  return key === "Enter" || key === " " || key === "Spacebar"
}

export function getNextIndex(current: number, maxExclusive: number, delta: 1 | -1) {
  if (maxExclusive <= 0) return 0
  const next = (current + delta + maxExclusive) % maxExclusive
  return next
}

type Step = { title: string; detail: string }
type Source = { label: string; url: string }

export interface HowItWorksProps {
  title: string
  subtitle?: string
  steps: Step[]
  tips?: string[]
  sources?: Source[]
  triggerLabel?: string
  className?: string
}

/**
 * HowItWorks: Accessible, RTL-first accordion for explaining flows.
 * - Fully keyboard-navigable: Enter/Space toggles, Arrow keys move focus within lists (steps/tips/sources)
 * - No external libs. Pure React + Tailwind.
 * - Compact trigger, then structured sections with strong contrast and good spacing.
 *
 * Example usage:
 *
 * import HowItWorks from "@/components/HowItWorks"
 *
 * export default function SomePage() {
 *   return (
 *     <HowItWorks
 *       title="איך זה עובד"
 *       subtitle="שלושה צעדים פשוטים"
 *       steps={[
 *         { title: "ממלאים פרטים", detail: "הזינו נתונים בסיסיים על מצבכם" },
 *         { title: "מקבלים חישוב", detail: "נחשב עבורכם את התוצאה" },
 *         { title: "פועלים", detail: "עקבו אחרי ההנחיות לביצוע בפועל" },
 *       ]}
 *       tips={["שמרו תיעוד", "השוו בין מקורות", "וודאו זכאות"]}
 *       sources={[{ label: "רשות המסים", url: "https://tax.gov.il" }]}
 *     />
 *   )
 * }
 */
export default function HowItWorks({
  title,
  subtitle,
  steps,
  tips,
  sources,
  triggerLabel = "איך זה עובד?",
  className,
}: HowItWorksProps) {
  const [open, setOpen] = useState(false)
  const triggerId = useId()
  const panelId = useMemo(() => `${triggerId}-panel`, [triggerId])

  const stepsRef = useRef<HTMLUListElement | null>(null)
  const tipsRef = useRef<HTMLUListElement | null>(null)
  const sourcesRef = useRef<HTMLUListElement | null>(null)

  // Close on Escape when focus is inside the panel
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isToggleKey(e.key)) {
      e.preventDefault()
      setOpen((v) => !v)
    }
  }

  // Roving focus within lists by ArrowUp/ArrowDown (and ArrowRight/Left for convenience on RTL)
  const makeRovingHandler = (listRef: React.RefObject<HTMLUListElement | null>) =>
    (e: React.KeyboardEvent) => {
      const list = listRef.current
      if (!list) return
      const items = Array.from(list.querySelectorAll<HTMLElement>("[data-roving-item]"))
      if (items.length === 0) return

      const currentIndex = items.findIndex((el) => el === document.activeElement)
      if (currentIndex === -1) return

      const goPrev = () => items[getNextIndex(currentIndex, items.length, -1)].focus()
      const goNext = () => items[getNextIndex(currentIndex, items.length, +1)].focus()

      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight": // RTL-friendly
          e.preventDefault()
          goPrev()
          break
        case "ArrowDown":
        case "ArrowLeft": // RTL-friendly
          e.preventDefault()
          goNext()
          break
        case "Home":
          e.preventDefault()
          items[0]?.focus()
          break
        case "End":
          e.preventDefault()
          items[items.length - 1]?.focus()
          break
      }
    }

  return (
    <section dir="rtl" className={"w-full max-w-screen-md " + (className ?? "") }>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          id={triggerId}
          aria-controls={panelId}
          aria-expanded={open ? 'true' : 'false'}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onTriggerKeyDown}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span className="truncate">{triggerLabel}</span>
          <span
            aria-hidden="true"
            className={"transition-transform duration-200 inline-block " + (open ? "rotate-180" : "rotate-0")}
          >
            ▼
          </span>
        </button>

        {open && (
          <div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            className="border-t border-gray-200 px-4 py-5"
          >
            <header className="mb-5">
              <h2 className="text-xl font-bold leading-7 text-gray-900">{title}</h2>
              {subtitle && (
                <p className="mt-1 text-sm leading-6 text-gray-600">{subtitle}</p>
              )}
            </header>

            {/* Steps */}
            <section className="mb-6">
              <h3 className="mb-3 text-base font-semibold text-gray-900">שלבים לביצוע</h3>
              <ul
                ref={stepsRef}
                role="list"
                className="space-y-3"
                onKeyDown={makeRovingHandler(stepsRef)}
              >
                {steps.map((s, i) => (
                  <li
                    key={i}
                    tabIndex={0}
                    data-roving-item
                    className="rounded-md border border-gray-200 bg-gray-50 p-3 leading-relaxed text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label={`שלב ${i + 1}: ${s.title}`}
                  >
                    <div className="font-medium">{i + 1}. {s.title}</div>
                    <p className="mt-1 text-sm text-gray-700">{s.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Tips */}
            {tips && tips.length > 0 && (
              <section className="mb-6">
                <h3 className="mb-3 text-base font-semibold text-gray-900">טיפים חשובים</h3>
                <ul
                  ref={tipsRef}
                  role="list"
                  className="space-y-2"
                  onKeyDown={makeRovingHandler(tipsRef)}
                >
                  {tips.map((t, i) => (
                    <li
                      key={i}
                      tabIndex={0}
                      data-roving-item
                      className="rounded-md border border-gray-200 bg-white p-3 leading-relaxed text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      • {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Sources */}
            {sources && sources.length > 0 && (
              <section>
                <h3 className="mb-3 text-base font-semibold text-gray-900">מקורות רשמיים</h3>
                <ul
                  ref={sourcesRef}
                  role="list"
                  className="space-y-2"
                  onKeyDown={makeRovingHandler(sourcesRef)}
                >
                  {sources.map((s, i) => (
                    <li key={i} className="leading-relaxed">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={0}
                        data-roving-item
                        className="text-blue-700 underline hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ---------------------------------------------------------
// Minimal in-file tests for helpers (no external test runner)
// These only run if NODE_ENV === 'test'
function runMinimalHelperTests() {
  // isToggleKey
  console.assert(isToggleKey("Enter") === true, "Enter should toggle")
  console.assert(isToggleKey(" ") === true, "Space should toggle")
  console.assert(isToggleKey("Spacebar") === true, "Legacy Spacebar should toggle")
  console.assert(isToggleKey("A") === false, "A should not toggle")

  // getNextIndex wrap-around
  console.assert(getNextIndex(0, 5, -1) === 4, "wrap prev from 0 -> 4")
  console.assert(getNextIndex(4, 5, +1) === 0, "wrap next from 4 -> 0")
  console.assert(getNextIndex(2, 5, +1) === 3, "2 + 1 -> 3")
  console.assert(getNextIndex(2, 5, -1) === 1, "2 - 1 -> 1")
}

if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "test") {
  // eslint-disable-next-line no-console
  runMinimalHelperTests()
}
