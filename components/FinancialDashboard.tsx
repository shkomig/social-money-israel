'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { BenefitResult, UserAnswers } from '@/lib/eligibility/types'
import { useFinance } from '@/lib/finance/context'

// Simple currency formatter (ILS, no fractions)
const currency = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
})

export type DashboardProps = {
  results: BenefitResult[]
  answers?: UserAnswers
  selectedIds?: string[]
  // Optional calculator metrics (e.g., mortgage refinance)
  calculators?: {
    earlyRepaymentMonthlySaving?: number // ILS/month
    earlyRepaymentEstimatedFee?: number // ILS one-time
  }
}

// Map deadlines by benefit id with sensible defaults (heuristics)
function getDeadlines(results: BenefitResult[]) {
  const now = new Date()
  const y = now.getFullYear()

  const makeFuture = (d: Date) =>
    d.getTime() > now.getTime() ? d : new Date(d.getFullYear() + 1, d.getMonth(), d.getDate())

  const deadlines: { id: string; title: string; date: string; details?: string }[] = []

  for (const r of results) {
    if (!r.eligible) continue
    if (r.id === 'work-grant') {
      // Typical window to apply for previous tax year: aim for June 30
      const base = new Date(y, 5, 30) // June 30
      const d = makeFuture(base)
      deadlines.push({
        id: r.id,
        title: 'הגשת מענק עבודה',
        date: d.toISOString(),
        details: 'מומלץ להגיש עד סוף יוני',
      })
    } else if (r.id === 'tax-refund') {
      // Suggest a reminder one month from now
      const d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      deadlines.push({
        id: r.id,
        title: 'בדיקת החזר מס',
        date: d.toISOString(),
        details: 'ניתן לבדוק עד 6 שנים אחורה',
      })
    } else if (r.id === 'arnona-discount') {
      // Many municipalities have early-year windows; suggest Jan 31
      const base = new Date(y, 0, 31) // Jan 31
      const d = makeFuture(base)
      deadlines.push({
        id: r.id,
        title: 'בקשה להנחה בארנונה',
        date: d.toISOString(),
        details: 'בדקו מועדים באתר העירייה',
      })
    }
  }
  return deadlines.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function sumPotential(
  results: BenefitResult[],
  calculators?: DashboardProps['calculators'],
  selectedIds?: string[],
) {
  const bySelection =
    selectedIds && selectedIds.length > 0
      ? results.filter((r) => selectedIds.includes(r.id))
      : results

  const benefits = bySelection
    .filter((r) => r.eligible && r.estimatedAmount)
    .map((r) => r.estimatedAmount!)
    .reduce((acc, a) => acc + (a.approx ?? (a.min ?? 0) + (a.max ?? 0)) / 2, 0)

  const yearlySavingsFromMortgage = calculators?.earlyRepaymentMonthlySaving
    ? calculators.earlyRepaymentMonthlySaving * 12
    : 0

  return Math.max(0, Math.round(benefits + yearlySavingsFromMortgage))
}

// Build Google Calendar link (UTC-less basic all-day event)
function googleLink(title: string, dateIso: string, details?: string) {
  const d = new Date(dateIso)
  const fmt = (n: number) => String(n).padStart(2, '0')
  const y = d.getUTCFullYear()
  const m = fmt(d.getUTCMonth() + 1)
  const day = fmt(d.getUTCDate())
  const dates = `${y}${m}${day}/${y}${m}${day}`
  const u = new URL('https://calendar.google.com/calendar/render')
  u.searchParams.set('action', 'TEMPLATE')
  u.searchParams.set('text', title)
  u.searchParams.set('dates', dates)
  if (details) u.searchParams.set('details', details)
  return u.toString()
}

// Minimal ICS file (all-day event)
function buildICS(title: string, dateIso: string, description?: string) {
  const d = new Date(dateIso)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const dt = `${yyyy}${mm}${dd}`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Social Money//Financial Dashboard//HE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${dt}`,
    `DTEND;VALUE=DATE:${dt}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description.replace(/\n/g, '\\n')}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  return lines.join('\r\n')
}

// Simple client-side reminder scheduler (best effort; not background push)
function useLocalReminder() {
  const timers = useRef<Record<string, number>>({})

  const schedule = (id: string, when: string, title: string, body?: string) => {
    const ts = new Date(when).getTime()
    const now = Date.now()
    if (ts <= now) return false

    const ask = async () => {
      if (!('Notification' in window)) return false
      if (Notification.permission === 'granted') return true
      if (Notification.permission !== 'denied') {
        const p = await Notification.requestPermission()
        return p === 'granted'
      }
      return false
    }

    ask().then((ok) => {
      if (!ok) return
      const ms = ts - Date.now()
      if (timers.current[id]) window.clearTimeout(timers.current[id])
      timers.current[id] = window.setTimeout(() => {
        new Notification(title, { body })
      }, ms)
      const saved = JSON.parse(localStorage.getItem('reminders') || '{}')
      saved[id] = { when: ts, title, body }
      localStorage.setItem('reminders', JSON.stringify(saved))
    })
    return true
  }

  useEffect(() => {
    // Re-arm on mount
    const saved: Record<string, { when: number; title: string; body?: string }> = JSON.parse(
      localStorage.getItem('reminders') || '{}',
    )
    const now = Date.now()
    for (const [id, r] of Object.entries(saved)) {
      if (r.when > now) {
        const ms = r.when - now
        timers.current[id] = window.setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(r.title, { body: r.body })
          }
        }, ms)
      }
    }
    return () => {
      for (const t of Object.values(timers.current)) window.clearTimeout(t)
    }
  }, [])

  return { schedule }
}

export default function FinancialDashboard({ results, calculators, selectedIds }: DashboardProps) {
  const { calculators: calcCtx } = useFinance()
  const mergedCalc = { ...calcCtx, ...calculators }
  const deadlines = useMemo(() => getDeadlines(results), [results])
  const total = useMemo(
    () => sumPotential(results, mergedCalc, selectedIds),
    [results, mergedCalc, selectedIds],
  )
  const { schedule } = useLocalReminder()

  const exportPDF = async () => {
    const jsPDF = (await import('jspdf')).jsPDF
    const doc = new jsPDF({ unit: 'pt' })

    let y = 40
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('דוח פיננסי אישי', 40, y)

    y += 24
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(`חיסכון פוטנציאלי כולל: ${currency.format(total)}`, 40, y)

    if (calculators?.earlyRepaymentMonthlySaving) {
      y += 18
      doc.text(
        `חיסכון חודשי במשכנתא: ${currency.format(
          calculators.earlyRepaymentMonthlySaving,
        )} (שנתי: ${currency.format(calculators.earlyRepaymentMonthlySaving * 12)})`,
        40,
        y,
      )
    }

    y += 24
    doc.setFont('helvetica', 'bold')
    doc.text('הטבות והערכות:', 40, y)
    doc.setFont('helvetica', 'normal')

    for (const r of results.filter((r) => r.eligible)) {
      y += 18
      const amount = r.estimatedAmount ? amountToText(r.estimatedAmount) : '—'
      doc.text(`• ${r.title} — ${amount}`, 54, y)
      if (y > 740) {
        doc.addPage()
        y = 40
      }
    }

    y += 24
    doc.setFont('helvetica', 'bold')
    doc.text('תזכורות ומועדים:', 40, y)
    doc.setFont('helvetica', 'normal')
    for (const d of deadlines) {
      y += 18
      doc.text(`• ${d.title} — ${new Date(d.date).toLocaleDateString('he-IL')}`, 54, y)
      if (y > 740) {
        doc.addPage()
        y = 40
      }
    }

    doc.save('financial-report.pdf')
  }

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 border-b bg-gradient-to-l from-blue-50 to-indigo-50 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">לוח פיננסי מרכז</h2>
        <button
          onClick={exportPDF}
          className="text-xs rounded bg-blue-600 text-white px-3 py-1 hover:bg-blue-700"
        >
          הורד דוח PDF
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-600">חיסכון פוטנציאלי כולל</div>
          <div className="text-2xl font-bold text-gray-900">{currency.format(total)}</div>
          {(mergedCalc?.earlyRepaymentMonthlySaving ?? 0) > 0 ? (
            <div className="mt-1 text-xs text-gray-600">
              כולל חיסכון משכנתא חודשי ≈ {currency.format(mergedCalc.earlyRepaymentMonthlySaving!)}
            </div>
          ) : null}
        </div>

        <div className="md:col-span-2 rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">משימות מומלצות</h3>
            <span className="text-xs text-gray-600">{deadlines.length} משימות</span>
          </div>
          <ul className="mt-2 space-y-2">
            {deadlines.length === 0 && <li className="text-sm text-gray-600">אין משימות כרגע</li>}
            {deadlines.map((d) => (
              <li
                key={d.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded border p-3"
              >
                <div>
                  <div className="font-medium text-gray-900">{d.title}</div>
                  <div className="text-xs text-gray-600">
                    עד {new Date(d.date).toLocaleDateString('he-IL')} • {d.details ?? ''}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={googleLink(d.title, d.date, 'תזכורת מהמערכת')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
                  >
                    הוסף ליומן Google
                  </a>
                  <button
                    onClick={() => {
                      const blob = new Blob([buildICS(d.title, d.date, d.details)], {
                        type: 'text/calendar;charset=utf-8',
                      })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'reminder.ics'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
                  >
                    הורד ICS
                  </button>
                  <button
                    onClick={() => schedule(`reminder-${d.id}`, d.date, d.title, d.details)}
                    className="text-xs rounded bg-emerald-600 text-white px-2 py-1 hover:bg-emerald-700"
                  >
                    תזכורת בדפדפן
                  </button>
                  <a
                    href={`mailto:?subject=${encodeURIComponent('תזכורת: ' + d.title)}&body=${encodeURIComponent(
                      `${d.title} עד ${new Date(d.date).toLocaleDateString('he-IL')}\n${d.details ?? ''}`,
                    )}`}
                    className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
                  >
                    שלח למייל
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-4 pb-4 text-xs text-gray-500">
        מידע זה הינו הערכה חינוכית בלבד. לשירות התראות Push אמיתידרוש שרת ושירות Push (VAPID) והתקנת
        Service Worker.
      </div>
    </section>
  )
}

function amountToText(a: NonNullable<BenefitResult['estimatedAmount']>) {
  if (typeof a.approx === 'number') return currency.format(a.approx)
  const min = a.min ?? 0
  const max = a.max ?? 0
  if (min || max) return `${currency.format(min)}–${currency.format(max)}`
  return '—'
}
