'use client'

import { useMemo, useState } from 'react'
import rates from '@/data/rates.json'

type Track = 'linked' | 'unlinked'

type Inputs = {
  principal: number
  currentRate: number // annual %
  yearsLeft: number
  track: Track
  newOfferRate: number // annual %
}

function fmtNum(n: number) {
  return new Intl.NumberFormat('he-IL').format(Math.round(n))
}

function pmtMonthly(rateAnnualPct: number, nYears: number, principal: number) {
  const r = rateAnnualPct / 100 / 12
  const n = Math.max(1, Math.round(nYears * 12))
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

// Indicative early-repayment fee (simplified):
// If currentRate > marketAvg for the track, fee ~= NPV of interest delta over remaining term with BOI discount (approx).
// We approximate by: fee = principal * max(0, (currentRate - marketAvg)) * discountFactor
// discountFactor derived from remaining duration: shorter terms → smaller factor.
function estimateFee(principal: number, currentRate: number, yearsLeft: number, track: Track) {
  const data: any = rates
  const marketAvg = (() => {
    const avg = data?.avgMortgage?.[track]
    if (!avg) return currentRate
    const y = yearsLeft
    if (y <= 5) return avg.short
    if (y <= 12) return avg.mid
    return avg.long
  })()
  const delta = Math.max(0, currentRate - marketAvg)
  if (delta <= 0) return 0
  const factor = Math.min(0.25, 0.08 * Math.ceil(yearsLeft / 5))
  return principal * (delta / 100) * factor
}

export default function EarlyRepaymentEstimator() {
  const [principal, setPrincipal] = useState('300000')
  const [currentRate, setCurrentRate] = useState('5.0')
  const [yearsLeft, setYearsLeft] = useState('12')
  const [track, setTrack] = useState<Track>('linked')
  const [newOfferRate, setNewOfferRate] = useState('3.8')

  const parsed: Inputs = {
    principal: Math.max(0, Number(principal) || 0),
    currentRate: Math.max(0, Number(currentRate) || 0),
    yearsLeft: Math.max(0.5, Number(yearsLeft) || 0),
    track,
    newOfferRate: Math.max(0, Number(newOfferRate) || 0),
  }

  const result = useMemo(() => {
    const fee = estimateFee(parsed.principal, parsed.currentRate, parsed.yearsLeft, parsed.track)
    const oldPmt = pmtMonthly(parsed.currentRate, parsed.yearsLeft, parsed.principal)
    const newPmt = pmtMonthly(parsed.newOfferRate, parsed.yearsLeft, parsed.principal)
    const monthlySaving = Math.max(0, oldPmt - newPmt)
    const breakEvenMonths = monthlySaving > 0 ? Math.ceil(fee / monthlySaving) : Infinity
    return { fee, monthlySaving, breakEvenMonths, oldPmt, newPmt }
  }, [parsed])

  const lastUpdated = (rates as any)?.lastUpdated

  return (
    <section dir="rtl" className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">מחשבון עמלת פירעון מוקדם (הערכה)</h2>
        <span className="text-xs text-gray-500">מבוסס על ממוצעי בנק ישראל · עדכון: {lastUpdated}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label className="block text-sm text-gray-700 mb-1">יתרת קרן (₪)</label>
          <input value={principal} onChange={(e)=>setPrincipal(e.target.value)} inputMode="numeric" className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label className="block text-sm text-gray-700 mb-1">ריבית נוכחית (% שנתי)</label>
          <input value={currentRate} onChange={(e)=>setCurrentRate(e.target.value)} inputMode="decimal" className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label className="block text-sm text-gray-700 mb-1">שנים נותרו</label>
          <input value={yearsLeft} onChange={(e)=>setYearsLeft(e.target.value)} inputMode="decimal" className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label className="block text-sm text-gray-700 mb-1">מסלול</label>
          <select value={track} onChange={(e)=>setTrack(e.target.value as Track)} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
            <option value="linked">צמוד מדד</option>
            <option value="unlinked">לא צמוד</option>
          </select>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">הצעה חדשה (% שנתי)</label>
          <input value={newOfferRate} onChange={(e)=>setNewOfferRate(e.target.value)} inputMode="decimal" className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-600">Estimated fee</div>
          <div className="text-2xl font-bold text-gray-900">₪{fmtNum(result.fee)}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-600">Monthly saving</div>
          <div className="text-2xl font-bold text-green-700">₪{fmtNum(result.monthlySaving)}</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-600">Break-even months</div>
          <div className="text-2xl font-bold text-indigo-700">{result.breakEvenMonths === Infinity ? '—' : fmtNum(result.breakEvenMonths)}</div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-600">מקור: Based on BOI published averages</p>
    </section>
  )
}
