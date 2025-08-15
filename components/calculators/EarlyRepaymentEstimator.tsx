'use client'

import { useMemo, useState } from 'react'
import rates from '@/data/rates.json'

type RatesJson = {
  lastUpdated?: string
  avgMortgage?: {
    linked?: { short?: number; mid?: number; long?: number }
    unlinked?: { short?: number; mid?: number; long?: number }
  }
}

type Track = 'linked' | 'unlinked'
type Bucket = 'short' | 'mid' | 'long'
type BucketOverride = 'auto' | Bucket

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

function fmtPct(pct: number, digits = 2) {
  return `${pct.toFixed(digits)}%`
}

function pmtMonthly(rateAnnualPct: number, nYears: number, principal: number) {
  const r = rateAnnualPct / 100 / 12
  const n = Math.max(1, Math.round(nYears * 12))
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

function selectMarketAvg(
  yearsLeft: number,
  track: Track,
  override: BucketOverride,
  data: RatesJson,
): { marketAvg: number; bucket: Bucket } {
  const group = data.avgMortgage?.[track]
  const fallback = 0
  if (override !== 'auto') {
    const v = group?.[override]
    return { marketAvg: typeof v === 'number' ? v : fallback, bucket: override }
  }
  if (yearsLeft <= 5 && typeof group?.short === 'number')
    return { marketAvg: group.short, bucket: 'short' }
  if (yearsLeft <= 12 && typeof group?.mid === 'number')
    return { marketAvg: group.mid, bucket: 'mid' }
  if (typeof group?.long === 'number') return { marketAvg: group.long, bucket: 'long' }
  return { marketAvg: fallback, bucket: 'long' }
}

// Detailed NPV-based indicative early-repayment fee
function estimateFeeDetailed(
  principal: number,
  currentRate: number,
  yearsLeft: number,
  track: Track,
  override: BucketOverride,
  data: RatesJson,
) {
  const { marketAvg, bucket } = selectMarketAvg(yearsLeft, track, override, data)
  const n = Math.max(1, Math.round(yearsLeft * 12))
  const rContractMonthly = currentRate / 100 / 12
  const rMarketMonthly = marketAvg / 100 / 12
  const P_old =
    rContractMonthly === 0
      ? principal / n
      : (principal * rContractMonthly) / (1 - Math.pow(1 + rContractMonthly, -n))
  const pvOldAtMarket =
    rMarketMonthly === 0
      ? P_old * n
      : (P_old * (1 - Math.pow(1 + rMarketMonthly, -n))) / rMarketMonthly
  const fee = Math.max(0, pvOldAtMarket - principal)
  return { fee, marketAvg, bucket, n, P_old, rContractMonthly, rMarketMonthly, pvOldAtMarket }
}

export default function EarlyRepaymentEstimator() {
  const [principal, setPrincipal] = useState('300000')
  const [currentRate, setCurrentRate] = useState('5.0')
  const [yearsLeft, setYearsLeft] = useState('12')
  const [track, setTrack] = useState<Track>('linked')
  const [newOfferRate, setNewOfferRate] = useState('3.8')
  const [advanced, setAdvanced] = useState(false)
  const [bucketOverride, setBucketOverride] = useState<BucketOverride>('auto')

  const parsed: Inputs = {
    principal: Math.max(0, Number(principal) || 0),
    currentRate: Math.max(0, Number(currentRate) || 0),
    yearsLeft: Math.max(0.5, Number(yearsLeft) || 0),
    track,
    newOfferRate: Math.max(0, Number(newOfferRate) || 0),
  }

  const data: RatesJson = rates as RatesJson

  const result = useMemo(() => {
    const det = estimateFeeDetailed(
      parsed.principal,
      parsed.currentRate,
      parsed.yearsLeft,
      parsed.track,
      bucketOverride,
      data,
    )
    const oldPmt = pmtMonthly(parsed.currentRate, parsed.yearsLeft, parsed.principal)
    const newPmt = pmtMonthly(parsed.newOfferRate, parsed.yearsLeft, parsed.principal)
    const monthlySaving = Math.max(0, oldPmt - newPmt)
    const breakEvenMonths = monthlySaving > 0 ? Math.ceil(det.fee / monthlySaving) : Infinity
    return { ...det, monthlySaving, breakEvenMonths, oldPmt, newPmt }
  }, [parsed, bucketOverride, data])

  const lastUpdated = data?.lastUpdated

  return (
    <section dir="rtl" className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">משבון עמלות פירעון מוקדם (הערכה)</h2>
        <span className="text-xs text-gray-500">
          מבוסס על ממוצעי בנק ישראל · עדכון: {lastUpdated}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label htmlFor="principal" className="block text-sm text-gray-700 mb-1">
            יתרת קרן (₪)
          </label>
          <input
            id="principal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            inputMode="numeric"
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label htmlFor="currentRate" className="block text-sm text-gray-700 mb-1">
            ריבית נוכחית (% שנתי)
          </label>
          <input
            id="currentRate"
            value={currentRate}
            onChange={(e) => setCurrentRate(e.target.value)}
            inputMode="decimal"
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label htmlFor="yearsLeft" className="block text-sm text-gray-700 mb-1">
            שנים נותרו
          </label>
          <input
            id="yearsLeft"
            value={yearsLeft}
            onChange={(e) => setYearsLeft(e.target.value)}
            inputMode="decimal"
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label htmlFor="track" className="block text-sm text-gray-700 mb-1">
            מסלול
          </label>
          <select
            id="track"
            value={track}
            onChange={(e) => setTrack(e.target.value as Track)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="linked">צמוד מדד</option>
            <option value="unlinked">לא צמוד</option>
          </select>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 md:col-span-2">
          <label htmlFor="newOfferRate" className="block text-sm text-gray-700 mb-1">
            הצעה חדשה (% שנתי)
          </label>
          <input
            id="newOfferRate"
            value={newOfferRate}
            onChange={(e) => setNewOfferRate(e.target.value)}
            inputMode="decimal"
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={advanced}
            onChange={(e) => setAdvanced(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          מצב מתקדם (פירוט חישוב וגזירת שוק)
        </label>
      </div>

      {advanced && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label htmlFor="bucket" className="block text-xs text-blue-900 mb-1">
                בחירת טווח שוק
              </label>
              <select
                id="bucket"
                value={bucketOverride}
                onChange={(e) => setBucketOverride(e.target.value as BucketOverride)}
                className="w-full rounded-md border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="auto">אוטומטי לפי יתרת שנים</option>
                <option value="short">קצר (≤ 5)</option>
                <option value="mid">בינוני (≤ 12)</option>
                <option value="long">ארוך</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-blue-900 mb-1">ריבית שוק ממוצעת</div>
              <div className="text-sm font-medium text-blue-800">
                {fmtPct(result.marketAvg)} ·{' '}
                {result.bucket === 'short' ? 'קצר' : result.bucket === 'mid' ? 'בינוני' : 'ארוך'}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-900 mb-1">מס׳ חודשי יתרה</div>
              <div className="text-sm font-medium text-blue-800">{fmtNum(result.n)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div className="rounded-md bg-white/70 p-3">
              <div className="text-xs text-gray-600">תשלום חודשי נוכחי</div>
              <div className="text-base font-semibold text-gray-900">₪{fmtNum(result.P_old)}</div>
            </div>
            <div className="rounded-md bg-white/70 p-3">
              <div className="text-xs text-gray-600">ריבית חוזה חודשית</div>
              <div className="text-base font-semibold text-gray-900">
                {fmtPct(result.rContractMonthly * 100, 3)}
              </div>
            </div>
            <div className="rounded-md bg-white/70 p-3">
              <div className="text-xs text-gray-600">ריבית שוק חודשית</div>
              <div className="text-base font-semibold text-gray-900">
                {fmtPct(result.rMarketMonthly * 100, 3)}
              </div>
            </div>
            <div className="rounded-md bg-white/70 p-3">
              <div className="text-xs text-gray-600">PV של תשלומים בשוק</div>
              <div className="text-base font-semibold text-gray-900">
                ₪{fmtNum(result.pvOldAtMarket)}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-blue-900">
            נוסחה: עמלה ≈ max(0, PV<sub>שוק</sub>(זרם תשלומים קיים) − יתרת קרן). אין חישוב של
            מדד/פריים משתנים.
          </p>
        </div>
      )}

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
          <div className="text-2xl font-bold text-indigo-700">
            {result.breakEvenMonths === Infinity ? '—' : fmtNum(result.breakEvenMonths)}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-600">
        הערה: הערכה חינוכית בלבד; החישוב אינו מחליף הצעת בנק רשמית.
      </p>
    </section>
  )
}
