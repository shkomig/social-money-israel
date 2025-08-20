'use client'

import { useEffect, useMemo, useState } from 'react'
import ratesJson from '@/data/rates.json'
import { useFinance } from '@/lib/finance/context'

type Track = 'linked' | 'unlinked'

type Rates = {
  lastUpdated: string
  boiRate: number
  primeRate: number
  avgMortgage: {
    linked: { short: number; mid: number; long: number }
    unlinked: { short: number; mid: number; long: number }
  }
}

const rates = ratesJson as Rates

function toNumber(v: string) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function pmt(P: number, rMonthly: number, n: number) {
  if (n <= 0) return 0
  if (rMonthly === 0) return P / n
  const pow = Math.pow(1 + rMonthly, -n)
  return (P * rMonthly) / (1 - pow)
}

function pvOfAnnuity(payment: number, rMonthly: number, n: number) {
  if (n <= 0) return 0
  if (rMonthly === 0) return payment * n
  const pow = Math.pow(1 + rMonthly, -n)
  return (payment * (1 - pow)) / rMonthly
}

function bucketByYearsLeft(years: number): 'short' | 'mid' | 'long' {
  if (years <= 5) return 'short'
  if (years <= 12) return 'mid'
  return 'long'
}

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)))
const fmtInt = (n: number) => new Intl.NumberFormat('he-IL').format(Math.max(0, Math.ceil(n)))

export default function EarlyRepaymentEstimator() {
  const { setCalculators } = useFinance()
  const [principal, setPrincipal] = useState('')
  const [currentRate, setCurrentRate] = useState('') // %
  const [yearsLeft, setYearsLeft] = useState('')
  const [track, setTrack] = useState<Track>('linked')
  const [newOfferRate, setNewOfferRate] = useState('') // %

  const result = useMemo(() => {
    const P = toNumber(principal)
    const rCurYear = toNumber(currentRate) / 100
    const rNewYear = toNumber(newOfferRate) / 100
    const years = toNumber(yearsLeft)
    const n = Math.round(years * 12)

    if (P <= 0 || rCurYear < 0 || rNewYear < 0 || years <= 0 || n <= 0) {
      return null
    }

    const bucket = bucketByYearsLeft(years)
    const rMarketYear = (rates.avgMortgage[track][bucket] ?? 0) / 100

    const rCur = rCurYear / 12
    const rNew = rNewYear / 12
    const rMkt = rMarketYear / 12

    // תשלום חודשי נוכחי (לפי יתרה, ריבית חוזית ותקופה נותרת)
    const pmtCurrent = pmt(P, rCur, n)
    // תשלום חודשי בהצעה החדשה (אותה תקופה)
    const pmtNew = pmt(P, rNew, n)

    // אומדן עמלת היוון (BOI, פישוט): PV של הזרם הקיים בהיוון ריבית שוק פחות היתרה
    const pvAtMarket = pvOfAnnuity(pmtCurrent, rMkt, n)
    const estimatedFee = Math.max(0, pvAtMarket - P)

    const monthlySaving = Math.max(0, pmtCurrent - pmtNew)
    const breakEvenMonths = monthlySaving > 0 ? Math.ceil(estimatedFee / monthlySaving) : Infinity

    return {
      bucket,
      marketRatePct: rates.avgMortgage[track][bucket],
      pmtCurrent,
      pmtNew,
      estimatedFee,
      monthlySaving,
      breakEvenMonths,
    }
  }, [principal, currentRate, yearsLeft, track, newOfferRate])

  // Publish refinance metrics to global context so dashboard can include in totals
  useEffect(() => {
    if (result) {
      setCalculators({
        earlyRepaymentMonthlySaving: result.monthlySaving,
        earlyRepaymentEstimatedFee: result.estimatedFee,
      })
    }
  }, [result, setCalculators])

  const updatedAt = useMemo(() => {
    try {
      return new Date(rates.lastUpdated).toLocaleDateString('he-IL', { dateStyle: 'medium' })
    } catch {
      return rates.lastUpdated
    }
  }, [])

  return (
    <section dir="rtl" className="mx-auto max-w-screen-md">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-l from-blue-50 to-indigo-50">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            אומדן עמלת פירעון מוקדם
          </h2>
          <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs text-gray-700 border border-gray-200">
            מבוסס על ממוצעי בנק ישראל • עדכון: {updatedAt}
          </span>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="ere-principal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                יתרת קרן (₪)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                id="ere-principal"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="למשל: 650000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="ere-currentRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ריבית נוכחית (%)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(e.target.value)}
                  id="ere-currentRate"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="למשל: 5.2"
                />
              </div>
              <div>
                <label
                  htmlFor="ere-yearsLeft"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  שנים נותרו
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step="0.5"
                  value={yearsLeft}
                  onChange={(e) => setYearsLeft(e.target.value)}
                  id="ere-yearsLeft"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="למשל: 18"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ere-track" className="block text-sm font-medium text-gray-700 mb-1">
                  מסלול
                </label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  id="ere-track"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="linked">צמוד מדד</option>
                  <option value="unlinked">לא צמוד</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="ere-newOfferRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ריבית בהצעה חדשה (%)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={newOfferRate}
                  onChange={(e) => setNewOfferRate(e.target.value)}
                  id="ere-newOfferRate"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="למשל: 4.1"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              החישוב אינדיקטיבי להמחשה בלבד. בפועל הבנק מחשב לפי עוגנים ותנאי הסכם.
            </p>
          </div>

          {/* Outputs */}
          <div className="space-y-4">
            <div className="rounded-lg border border-rose-100 bg-rose-50 p-4">
              <div className="text-sm text-rose-700 mb-1">עמלת פירעון משוערת</div>
              <div className="text-2xl font-bold text-rose-800">
                {result ? fmtCurrency(result.estimatedFee) : '—'}
              </div>
              {result && (
                <div className="mt-1 text-xs text-rose-700/80">
                  ריבית שוק: {result.marketRatePct.toFixed(2)}% • סל:{' '}
                  {result.bucket === 'short' ? 'קצר' : result.bucket === 'mid' ? 'בינוני' : 'ארוך'}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-sm text-emerald-700 mb-1">חיסכון חודשי</div>
              <div className="text-xl font-semibold text-emerald-800">
                {result ? fmtCurrency(result.monthlySaving) : '—'}
              </div>
              {result && (
                <div className="mt-1 text-xs text-emerald-700/80">
                  תשלום נוכחי ≈ {fmtCurrency(result.pmtCurrent)} • תשלום חדש ≈{' '}
                  {fmtCurrency(result.pmtNew)}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
              <div className="text-sm text-amber-700 mb-1">חודשי איזון</div>
              <div className="text-xl font-semibold text-amber-800">
                {result
                  ? result.breakEvenMonths === Infinity
                    ? '—'
                    : fmtInt(result.breakEvenMonths)
                  : '—'}
              </div>
              <div className="mt-1 text-xs text-amber-700/80">
                מספר חודשים משוער לכיסוי העמלה באמצעות החיסכון
              </div>
            </div>

            <div className="text-xs text-gray-500">מבוסס על ממוצעי בנק ישראל (BOI)</div>
          </div>
        </div>
      </div>
    </section>
  )
}
