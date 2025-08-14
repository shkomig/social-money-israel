'use client'

import { useState } from 'react'
import rates from '@/data/rates.json'

type TrackType = 'linked' | 'unlinked'

export default function EarlyRepaymentEstimator() {
  const [remainingPrincipal, setRemainingPrincipal] = useState('')
  const [currentRate, setCurrentRate] = useState('')
  const [yearsLeft, setYearsLeft] = useState('')
  const [trackType, setTrackType] = useState<TrackType>('linked')
  const [newOfferRate, setNewOfferRate] = useState('')
  const [results, setResults] = useState<{
    earlyFee: number
    monthlySaving: number
    breakEvenMonths: number
  } | null>(null)

  const calculatePayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12
    const n = years * 12

    if (monthlyRate === 0) return principal / n

    return (
      principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1)
    )
  }

  const estimate = () => {
    const principal = parseFloat(remainingPrincipal)
    const curRate = parseFloat(currentRate)
    const yrs = parseFloat(yearsLeft)
    const offerRate = parseFloat(newOfferRate)
    const avgRate = rates[trackType]

    if (!principal || !curRate || !yrs || !offerRate) return

    const earlyFee = Math.max(0, ((curRate - avgRate) / 100) * principal * yrs * 0.1)
    const currentPayment = calculatePayment(principal, curRate, yrs)
    const newPayment = calculatePayment(principal, offerRate, yrs)
    const monthlySaving = currentPayment - newPayment
    const breakEvenMonths = monthlySaving > 0 ? earlyFee / monthlySaving : 0

    setResults({ earlyFee, monthlySaving, breakEvenMonths })
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
        מחשבון עמלת פירעון מוקדם
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            יתרת קרן (₪)
          </label>
          <input
            type="number"
            value={remainingPrincipal}
            onChange={(e) => setRemainingPrincipal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="למשל: 800000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ריבית נוכחית (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={currentRate}
            onChange={(e) => setCurrentRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="למשל: 4.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שנים שנותרו
          </label>
          <input
            type="number"
            value={yearsLeft}
            onChange={(e) => setYearsLeft(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="למשל: 15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            סוג מסלול
          </label>
          <select
            value={trackType}
            onChange={(e) => setTrackType(e.target.value as TrackType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="linked">צמוד מדד</option>
            <option value="unlinked">לא צמוד</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ריבית בהצעה חדשה (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={newOfferRate}
            onChange={(e) => setNewOfferRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="למשל: 3.8"
          />
        </div>
      </div>

      <button
        onClick={estimate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
      >
        חשב
      </button>

      {results && (
        <div className="mt-6 space-y-2 text-center">
          <div className="text-gray-700">
            עמלת פירעון מוקדם משוערת:{' '}
            <span className="font-semibold">
              {formatCurrency(results.earlyFee)}
            </span>
          </div>
          <div className="text-gray-700">
            חיסכון חודשי משוער:{' '}
            <span className="font-semibold">
              {formatCurrency(results.monthlySaving)}
            </span>
          </div>
          <div className="text-gray-700">
            חודשי איזון:{' '}
            <span className="font-semibold">
              {Math.ceil(results.breakEvenMonths)}
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        החישוב להמחשה בלבד ואינו מהווה ייעוץ.{' '}
        <a
          href="https://www.boi.org.il"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          מקור: פרסומי בנק ישראל
        </a>
      </p>
    </div>
  )
}

