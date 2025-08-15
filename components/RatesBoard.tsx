'use client'

import { useState } from 'react'
import ratesData from '@/data/rates.json'

interface RatesData {
  lastUpdated: string
  boiRate: number
  primeRate?: number
  avgMortgage: {
    linked: { short: number; mid: number; long: number }
    unlinked: { short: number; mid: number; long: number }
  }
}

const fmtPct = (n: number) => `${n.toFixed(2)}%`
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('he-IL', { dateStyle: 'medium' })

type RatesBoardProps = {
  initialCompact?: boolean
  className?: string
}

export default function RatesBoard({ initialCompact = false, className }: RatesBoardProps) {
  const data = ratesData as RatesData
  const prime = data.primeRate ?? data.boiRate + 1.5
  const [compact, setCompact] = useState(initialCompact)

  return (
    <section dir="rtl" className={`mx-auto max-w-screen-md ${className ?? ''}`}>
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-l from-indigo-50 to-blue-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-lg">
              💹
            </span>
            <h2 className="text-base font-semibold text-gray-900">ריביות משכנתא</h2>
            <span className="hidden text-xs text-gray-500 md:inline">
              ({fmtDate(data.lastUpdated)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 md:hidden">
              עדכון: {fmtDate(data.lastUpdated)}
            </span>
            <button
              type="button"
              onClick={() => setCompact((v) => !v)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              aria-pressed={compact}
              aria-label={compact ? 'הצג תצוגה מלאה' : 'הצג תצוגה קומפקטית'}
            >
              {compact ? 'תצוגה מלאה' : 'תצוגה קומפקטית'}
            </button>
          </div>
        </div>

        {!compact ? (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-100 p-4">
              <div className="text-sm text-gray-600">ריבית בנק ישראל</div>
              <div className="text-3xl font-bold text-gray-900">{fmtPct(data.boiRate)}</div>
              <div className="mt-2 text-sm text-gray-600">פריים (BOI + 1.5%)</div>
              <div className="text-2xl font-semibold text-gray-900">{fmtPct(prime)}</div>
            </div>

            <div className="rounded-lg border border-gray-100 p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">
                ממוצע מסלולים צמודים (מדד)
              </div>
              <dl className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded bg-gray-50 p-2 text-center">
                  <dt className="text-gray-600">קצר</dt>
                  <dd className="font-semibold text-gray-900">
                    {fmtPct(data.avgMortgage.linked.short)}
                  </dd>
                </div>
                <div className="rounded bg-gray-50 p-2 text-center">
                  <dt className="text-gray-600">בינוני</dt>
                  <dd className="font-semibold text-gray-900">
                    {fmtPct(data.avgMortgage.linked.mid)}
                  </dd>
                </div>
                <div className="rounded bg-gray-50 p-2 text-center">
                  <dt className="text-gray-600">ארוך</dt>
                  <dd className="font-semibold text-gray-900">
                    {fmtPct(data.avgMortgage.linked.long)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-gray-100 p-4 md:col-span-2">
              <div className="mb-2 text-sm font-medium text-gray-700">ממוצע מסלולים לא צמודים</div>
              <dl className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded bg-gray-50 p-2 text-center">
                  <dt className="text-gray-600">קצר</dt>
                  <dd className="font-semibold text-gray-900">
                    {fmtPct(data.avgMortgage.unlinked.short)}
                  </dd>
                </div>
                <div className="rounded bg-gray-50 p-2 text-center">
                  <dt className="text-gray-600">בינוני</dt>
                  <dd className="font-semibold text-gray-900">
                    {fmtPct(data.avgMortgage.unlinked.mid)}
                  </dd>
                </div>
                <div className="rounded bg-gray-50 p-2 text-center">
                  <dt className="text-gray-600">ארוך</dt>
                  <dd className="font-semibold text-gray-900">
                    {fmtPct(data.avgMortgage.unlinked.long)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="md:col-span-2 text-xs text-gray-600">
              המידע אינפורמטיבי בלבד ואינו מהווה ייעוץ פיננסי. מומלץ לאמת מול מקורות רשמיים.
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800 ring-1 ring-inset ring-blue-200">
                <span>🏦</span>
                <span>BOI {fmtPct(data.boiRate)}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-800 ring-1 ring-inset ring-indigo-200">
                <span>📈</span>
                <span>Prime {fmtPct(prime)}</span>
              </span>
              <span className="ml-auto text-xs text-gray-500">
                עודכן: {fmtDate(data.lastUpdated)}
              </span>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2 font-medium">מסלול</th>
                    <th className="px-3 py-2 font-medium">קצר</th>
                    <th className="px-3 py-2 font-medium">בינוני</th>
                    <th className="px-3 py-2 font-medium">ארוך</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-2 text-gray-700">צמוד מדד</td>
                    <td className="px-3 py-2">{fmtPct(data.avgMortgage.linked.short)}</td>
                    <td className="px-3 py-2">{fmtPct(data.avgMortgage.linked.mid)}</td>
                    <td className="px-3 py-2">{fmtPct(data.avgMortgage.linked.long)}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-gray-700">לא צמוד</td>
                    <td className="px-3 py-2">{fmtPct(data.avgMortgage.unlinked.short)}</td>
                    <td className="px-3 py-2">{fmtPct(data.avgMortgage.unlinked.mid)}</td>
                    <td className="px-3 py-2">{fmtPct(data.avgMortgage.unlinked.long)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-[11px] text-gray-500">
              מידע אינפורמטיבי בלבד; לא ייעוץ פיננסי.
            </p>
          </div>
        )}

        <div className="px-4 pb-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">מקורות רשמיים</h3>
          <ul className="list-disc pr-5 space-y-1 text-sm text-blue-700">
            <li>
              <a
                href="https://www.boi.org.il/he/Markets/DocLib/Pages/InterestRate.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                ריבית בנק ישראל (BOI)
              </a>
            </li>
            <li>
              <a
                href="https://www.boi.org.il/he/NewsAndPublications/PressReleases/Pages/Default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                הודעות בנק ישראל
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
