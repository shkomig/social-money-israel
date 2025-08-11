'use client'

import { useState } from 'react'

export default function PensionProvidentCalculator() {
  // Predefined Tailwind width classes in 5% increments to avoid inline styles
  const WIDTH_CLASSES = [
    'w-[0%]','w-[5%]','w-[10%]','w-[15%]','w-[20%]','w-[25%]','w-[30%]','w-[35%]','w-[40%]','w-[45%]',
    'w-[50%]','w-[55%]','w-[60%]','w-[65%]','w-[70%]','w-[75%]','w-[80%]','w-[85%]','w-[90%]','w-[95%]','w-[100%]'
  ] as const

  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('')
  const [monthlySalary, setMonthlySalary] = useState('')
  const [currentSavings, setCurrentSavings] = useState('')
  const [monthlyContribution, setMonthlyContribution] = useState('')
  const [expectedReturn, setExpectedReturn] = useState('5')
  const [calculationType, setCalculationType] = useState('pension')
  const [results, setResults] = useState<{
    totalSavings: number
    monthlyPension: number
    totalContributions: number
    investmentGain: number
    pensionYears: number
    replacementRatio: number
  } | null>(null)

  // Parse numbers safely from inputs (treat empty/invalid as 0)
  const toNumber = (v: string) => {
    const n = parseFloat((v ?? '').toString().replace(/,/g, ''))
    return Number.isFinite(n) ? n : 0
  }

  const calculatePension = () => {
    const age = toNumber(currentAge)
    const retirement = toNumber(retirementAge)
    const salary = toNumber(monthlySalary)
    const current = toNumber(currentSavings)
    const contributionInput = toNumber(monthlyContribution)
    const returnRate = toNumber(expectedReturn) / 100

    // Basic validations: require sensible age/retirement/salary, but allow 0 additional contribution
    if (!Number.isFinite(age) || !Number.isFinite(retirement) || !Number.isFinite(salary)) return
    if (age <= 0 || retirement <= 0 || salary <= 0) return
    if (retirement <= age) return

    const yearsToRetirement = retirement - age
    const monthsToRetirement = yearsToRetirement * 12
    const monthlyReturn = returnRate / 12

    // Calculate mandatory pension contributions (12.5% of salary)
    const mandatoryContribution = salary * 0.125
    // Additional contribution is optional (can be 0). For pension mode, add mandatory 12.5%.
    const totalMonthlyContribution =
      (calculationType === 'pension' ? mandatoryContribution : 0) + Math.max(0, contributionInput)

    // Future value calculation with compound interest
    let totalSavings = current

    // Add current savings growth
    totalSavings = current * Math.pow(1 + returnRate, yearsToRetirement)

    // Add monthly contributions with compound interest
    if (monthlyReturn > 0) {
      const futureValueAnnuity =
        totalMonthlyContribution *
        ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn)
      totalSavings += futureValueAnnuity
    } else {
      totalSavings += totalMonthlyContribution * monthsToRetirement
    }

  const totalContributions = current + totalMonthlyContribution * monthsToRetirement
    const investmentGain = totalSavings - totalContributions

    // Calculate monthly pension (assuming 4% withdrawal rate)
    const monthlyPension = (totalSavings * 0.04) / 12

    // Life expectancy in Israel (average 82 years)
    const pensionYears = Math.max(0, 82 - retirement)

    // Replacement ratio - what percentage of current salary the pension provides
    const replacementRatio = (monthlyPension / salary) * 100

    setResults({
      totalSavings,
      monthlyPension,
      totalContributions,
      investmentGain,
      pensionYears,
      replacementRatio,
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

  const widthClassFromRatio = (ratio: number) => {
    const percent = Math.min(100, Math.max(0, ratio))
    const idx = Math.round(percent / 5)
    return WIDTH_CLASSES[Math.min(WIDTH_CLASSES.length - 1, Math.max(0, idx))]
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <div className="flex justify-center space-x-reverse space-x-4 mb-6">
          <button
            onClick={() => setCalculationType('pension')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              calculationType === 'pension'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            פנסיה חובה
          </button>
          <button
            onClick={() => setCalculationType('provident')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              calculationType === 'provident'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            קופת גמל
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">פרטים אישיים</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל נוכחי</label>
            <input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="למשל: 35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">גיל פרישה מתוכנן</label>
            <input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="למשל: 67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי נוכחי (₪)
            </label>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="למשל: 15000"
            />
          </div>
        </div>

        {/* Savings Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">חיסכון והפרשות</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">חיסכון קיים (₪)</label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="למשל: 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {calculationType === 'pension' ? 'הפרשה חודשית נוספת (₪)' : 'הפרשה חודשית (₪)'}
            </label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={calculationType === 'pension' ? 'למשל: 500' : 'למשל: 1000'}
            />
            {calculationType === 'pension' && (
              <p className="text-xs text-gray-500 mt-1">
                הפרשה חובה של 12.5% מהשכר (
                {formatCurrency((parseFloat(monthlySalary) || 0) * 0.125)}) תתווסף אוטומטית
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תשואה שנתית צפויה (%)
            </label>
            <select
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              title="בחר תשואה שנתית צפויה"
            >
              <option value="3">3% - שמרני</option>
              <option value="5">5% - מאוזן</option>
              <option value="7">7% - אגרסיבי</option>
              <option value="4">4% - קונסרבטיבי</option>
              <option value="6">6% - צמיחה</option>
            </select>
          </div>

          <button
            type="button"
            onClick={calculatePension}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            חשב פנסיה
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">תחזית פרישה</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">🏦</span>
                <div className="text-sm text-purple-600 font-medium">סה"כ חיסכון בפרישה</div>
              </div>
              <div className="text-xl font-bold text-purple-700">
                {formatCurrency(results.totalSavings)}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">💰</span>
                <div className="text-sm text-green-600 font-medium">קצבה חודשית</div>
              </div>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(results.monthlyPension)}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {results.replacementRatio.toFixed(1)}% מהשכר הנוכחי
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">📈</span>
                <div className="text-sm text-blue-600 font-medium">רווח מהשקעות</div>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {formatCurrency(results.investmentGain)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                מתוך {formatCurrency(results.totalContributions)} הפרשות
              </div>
            </div>
          </div>

          {/* Replacement Ratio Gauge */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">יחס החלפת הכנסה</h4>
            <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className={`h-6 rounded-full transition-all duration-700 ${
                  results.replacementRatio >= 70
                    ? 'bg-green-500'
                    : results.replacementRatio >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                } ${widthClassFromRatio(results.replacementRatio)}`}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                {results.replacementRatio.toFixed(1)}% מהשכר הנוכחי
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0%</span>
              <span className="text-red-600">50% מינימום</span>
              <span className="text-yellow-600">70% מומלץ</span>
              <span>100%</span>
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">ציר זמן</h4>
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <div className="font-medium">עכשיו</div>
                <div className="text-gray-600">גיל {currentAge}</div>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-4 rounded"></div>
              <div className="text-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-1"></div>
                <div className="font-medium">פרישה</div>
                <div className="text-gray-600">גיל {retirementAge}</div>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-purple-500 to-green-500 mx-4 rounded"></div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                <div className="font-medium">תוחלת חיים</div>
                <div className="text-gray-600">גיל 82</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div
            className={`rounded-lg p-4 ${
              results.replacementRatio >= 70
                ? 'bg-green-50 border border-green-200'
                : results.replacementRatio >= 50
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-start">
              <span className="text-2xl ml-3">
                {results.replacementRatio >= 70
                  ? '✅'
                  : results.replacementRatio >= 50
                    ? '⚠️'
                    : '❌'}
              </span>
              <div>
                <h4
                  className={`font-semibold ${
                    results.replacementRatio >= 70
                      ? 'text-green-800'
                      : results.replacementRatio >= 50
                        ? 'text-yellow-800'
                        : 'text-red-800'
                  }`}
                >
                  {results.replacementRatio >= 70
                    ? 'מצוין! תכנון פרישה טוב'
                    : results.replacementRatio >= 50
                      ? 'חיסכון בסיסי - כדאי לשפר'
                      : 'חיסכון לא מספיק - דרוש שיפור משמעותי'}
                </h4>
                <p
                  className={`text-sm ${
                    results.replacementRatio >= 70
                      ? 'text-green-700'
                      : results.replacementRatio >= 50
                        ? 'text-yellow-700'
                        : 'text-red-700'
                  }`}
                >
                  {results.replacementRatio >= 70
                    ? 'החיסכון שלכם מספק רמת חיים נאותה בפרישה'
                    : results.replacementRatio >= 50
                      ? 'כדאי להגדיל את ההפרשה החודשית לשיפור רמת החיים בפרישה'
                      : 'מומלץ מאוד להגדיל את ההפרשה או להאריך את גיל הפרישה'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
