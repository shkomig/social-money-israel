'use client'

import { useState } from 'react'

export default function MortgageRefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState('')
  const [currentRate, setCurrentRate] = useState('')
  const [newRate, setNewRate] = useState('')
  const [remainingYears, setRemainingYears] = useState('')
  const [refinancingCosts, setRefinancingCosts] = useState('')
  const [results, setResults] = useState<{
    currentMonthlyPayment: number
    newMonthlyPayment: number
    monthlySavings: number
    totalSavings: number
    breakEvenMonths: number
    isWorthwhile: boolean
  } | null>(null)

  const calculateMortgagePayment = (principal: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12
    const numberOfPayments = years * 12

    if (monthlyRate === 0) {
      return principal / numberOfPayments
    }

    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }

  const calculateRefinancing = () => {
    const balance = parseFloat(currentBalance)
    const currentR = parseFloat(currentRate)
    const newR = parseFloat(newRate)
    const years = parseFloat(remainingYears)
    const costs = parseFloat(refinancingCosts) || 0

    if (!balance || !currentR || !newR || !years) return

    const currentMonthlyPayment = calculateMortgagePayment(balance, currentR, years)
    const newMonthlyPayment = calculateMortgagePayment(balance, newR, years)
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment
    const totalSavings = monthlySavings * years * 12 - costs
    const breakEvenMonths = costs > 0 ? costs / monthlySavings : 0
    const isWorthwhile = monthlySavings > 400 && totalSavings > 0

    setResults({
      currentMonthlyPayment,
      newMonthlyPayment,
      monthlySavings,
      totalSavings,
      breakEvenMonths,
      isWorthwhile,
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Mortgage Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">פרטי המשכנתא הנוכחית</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">יתרת קרן (₪)</label>
            <input
              type="number"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="למשל: 800000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ריבית נוכחית (%)</label>
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
              שנים שנותרו לפירעון
            </label>
            <input
              type="number"
              value={remainingYears}
              onChange={(e) => setRemainingYears(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="למשל: 15"
            />
          </div>
        </div>

        {/* New Mortgage Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">פרטי המשכנתא החדשה</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ריבית חדשה (%)</label>
            <input
              type="number"
              step="0.01"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="למשל: 3.8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">עלויות מחזור (₪)</label>
            <input
              type="number"
              value={refinancingCosts}
              onChange={(e) => setRefinancingCosts(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="למשל: 15000"
            />
            <p className="text-xs text-gray-500 mt-1">כולל עמלות בנק, שמאי, עו"ד וביטוח</p>
          </div>

          <button
            onClick={calculateRefinancing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            חשב חיסכון
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">תוצאות החישוב</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-sm text-red-600 font-medium mb-1">תשלום נוכחי</div>
              <div className="text-xl font-bold text-red-700">
                {formatCurrency(results.currentMonthlyPayment)}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-green-600 font-medium mb-1">תשלום חדש</div>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(results.newMonthlyPayment)}
              </div>
            </div>

            <div
              className={`rounded-lg p-4 text-center ${
                results.monthlySavings > 0 ? 'bg-blue-50' : 'bg-red-50'
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  results.monthlySavings > 0 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                חיסכון חודשי
              </div>
              <div
                className={`text-xl font-bold ${
                  results.monthlySavings > 0 ? 'text-blue-700' : 'text-red-700'
                }`}
              >
                {formatCurrency(Math.abs(results.monthlySavings))}
              </div>
            </div>

            <div
              className={`rounded-lg p-4 text-center ${
                results.totalSavings > 0 ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  results.totalSavings > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                חיסכון כולל
              </div>
              <div
                className={`text-xl font-bold ${
                  results.totalSavings > 0 ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {formatCurrency(Math.abs(results.totalSavings))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>התקדמות החיסכון</span>
              <span>
                {Math.round((results.monthlySavings / results.currentMonthlyPayment) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  results.monthlySavings > 0
                    ? 'bg-gradient-to-r from-green-400 to-blue-500'
                    : 'bg-red-400'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.abs((results.monthlySavings / results.currentMonthlyPayment) * 100),
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Break Even Analysis */}
          {results.breakEvenMonths > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-800 mb-2">נקודת איזון</h4>
              <p className="text-yellow-700">
                החיסכון יכסה את עלויות המחזור תוך{' '}
                <strong>{Math.ceil(results.breakEvenMonths)} חודשים</strong>
              </p>
            </div>
          )}

          {/* Recommendation */}
          <div
            className={`rounded-lg p-4 ${
              results.isWorthwhile
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl ml-3">{results.isWorthwhile ? '✅' : '❌'}</span>
              <div>
                <h4
                  className={`font-semibold ${
                    results.isWorthwhile ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {results.isWorthwhile ? 'מומלץ לבצע מחזור!' : 'לא מומלץ לבצע מחזור'}
                </h4>
                <p
                  className={`text-sm ${results.isWorthwhile ? 'text-green-700' : 'text-red-700'}`}
                >
                  {results.isWorthwhile
                    ? `החיסכון החודשי של ${formatCurrency(results.monthlySavings)} מצדיק את המחזור`
                    : results.monthlySavings <= 400
                      ? 'החיסכון החודשי נמוך מ-400₪ - לא מומלץ'
                      : 'החיסכון הכולל שלילי בגלל עלויות המחזור'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
