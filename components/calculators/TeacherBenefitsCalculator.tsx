'use client'

import { useState } from 'react'

export default function TeacherBenefitsCalculator() {
  const [workingYears, setWorkingYears] = useState('')
  const [salary, setSalary] = useState('')
  const [teachingHours, setTeachingHours] = useState('')
  const [hasAcademicDegree, setHasAcademicDegree] = useState(false)
  const [degreeLevel, setDegreeLevel] = useState<'bachelor' | 'master' | 'phd'>('bachelor')
  const [results, setResults] = useState<{
    tuitionSubsidy: number
    vacationPay: number
    travelAllowance: number
    pensionContribution: number
    totalBenefits: number
    monthlyBenefits: number
  } | null>(null)

  // המרה בטוחה למספר
  const toNum = (v: string) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }

  const calculateBenefits = () => {
    const years = toNum(workingYears)
    const monthlySalary = toNum(salary)
    const hours = toNum(teachingHours)

    // ולידציה בסיסית
    if (years <= 0 || monthlySalary <= 0 || hours <= 0) {
      setResults(null)
      return
    }

    // Tuition subsidy (עד 75%) + תוספת רק אם יש תואר
    const maxSubsidy = 25_000
    let subsidyRate = Math.min(0.75, 0.3 + years * 0.05)
    if (hasAcademicDegree) {
      if (degreeLevel === 'master') subsidyRate = Math.min(0.8, subsidyRate + 0.1)
      if (degreeLevel === 'phd') subsidyRate = Math.min(0.9, subsidyRate + 0.2)
    }
    const tuitionSubsidy = maxSubsidy * subsidyRate

    // Vacation pay (הערכה לפי שכר וותק)
    const vacationDays = Math.min(60, Math.max(0, 45 + years)) // 0..60
    const dailySalary = monthlySalary / 22
    const vacationPay = dailySalary * vacationDays

    // Travel allowance (שנתי)
    const baseTravelMonthly = 150
    const travelAllowance = baseTravelMonthly * 12

    // Enhanced pension contribution (15% מול 12.5%)
    const regularPension = monthlySalary * 0.125 * 12
    const teacherPension = monthlySalary * 0.15 * 12
    const pensionContribution = Math.max(0, teacherPension - regularPension)

    const totalBenefits = tuitionSubsidy + vacationPay + travelAllowance + pensionContribution
    const monthlyBenefits = totalBenefits / 12

    setResults({
      tuitionSubsidy,
      vacationPay,
      travelAllowance,
      pensionContribution,
      totalBenefits,
      monthlyBenefits,
    })
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">פרטים אישיים</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שנות ותק בהוראה</label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step="1"
              value={workingYears}
              onChange={(e) => setWorkingYears(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="למשל: 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שכר חודשי ברוטו (₪)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="100"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="למשל: 12000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שעות הוראה שבועיות
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step="1"
              value={teachingHours}
              onChange={(e) => setTeachingHours(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="למשל: 24"
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">השכלה והכשרה</h3>

          <div>
            <label className="flex items-center space-x-reverse space-x-2">
              <input
                type="checkbox"
                checked={hasAcademicDegree}
                onChange={(e) => setHasAcademicDegree(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">יש לי תואר אקדמי</span>
            </label>
          </div>

          {hasAcademicDegree && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">רמת התואר</label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as 'bachelor' | 'master' | 'phd')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="bachelor">תואר ראשון (B.A/B.Ed)</option>
                <option value="master">תואר שני (M.A/M.Ed)</option>
                <option value="phd">תואר שלישי (Ph.D)</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={calculateBenefits}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            חשב זכויות
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="border-t border-gray-200 pt-6" aria-live="polite">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">זכויות והטבות שנתיות</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">📚</span>
                <div className="text-sm text-blue-600 font-medium">מלגת לימודים</div>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {formatCurrency(results.tuitionSubsidy)}
              </div>
              <div className="text-xs text-blue-600 mt-1">החזר שכר לימוד</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">🏖️</span>
                <div className="text-sm text-yellow-600 font-medium">דמי חופשה</div>
              </div>
              <div className="text-xl font-bold text-yellow-700">
                {formatCurrency(results.vacationPay)}
              </div>
              <div className="text-xs text-yellow-600 mt-1">חופשת קיץ מוארכת</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">🚗</span>
                <div className="text-sm text-purple-600 font-medium">קצבת נסיעות</div>
              </div>
              <div className="text-xl font-bold text-purple-700">
                {formatCurrency(results.travelAllowance)}
              </div>
              <div className="text-xs text-purple-600 mt-1">החזר נסיעה לעבודה</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">🏦</span>
                <div className="text-sm text-green-600 font-medium">פנסיה מוגברת</div>
              </div>
              <div className="text-xl font-bold text-green-700">
                {formatCurrency(results.pensionContribution)}
              </div>
              <div className="text-xs text-green-600 mt-1">הפרשה נוספת (15% vs 12.5%)</div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">💰</span>
                <div className="text-sm text-indigo-600 font-medium">סה"כ הטבות שנתיות</div>
              </div>
              <div className="text-2xl font-bold text-indigo-700">
                {formatCurrency(results.totalBenefits)}
              </div>
              <div className="text-sm text-indigo-600 mt-1">
                {formatCurrency(results.monthlyBenefits)} לחודש בממוצע
              </div>
            </div>
          </div>

          {/* Benefits Breakdown Chart */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">פירוט ההטבות</h4>
            <div className="space-y-2">
              {[
                { name: 'מלגת לימודים', value: results.tuitionSubsidy, color: 'bg-blue-500' },
                { name: 'דמי חופשה', value: results.vacationPay, color: 'bg-yellow-500' },
                { name: 'קצבת נסיעות', value: results.travelAllowance, color: 'bg-purple-500' },
                { name: 'פנסיה מוגברת', value: results.pensionContribution, color: 'bg-green-500' },
              ].map((benefit, index) => {
                const pct =
                  results.totalBenefits > 0
                    ? Math.max(0, Math.min(100, (benefit.value / results.totalBenefits) * 100))
                    : 0
                return (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600">{benefit.name}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3 relative overflow-hidden">
                      <div
                        className={`${benefit.color} h-4 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-800 text-left">
                      {formatCurrency(benefit.value)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-2xl ml-3">ℹ️</span>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">מידע נוסף</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• זכויות נוספות: ביטוח מקצועי, הנחות על פעילויות תרבות</li>
                  <li>• השתלמויות מסובסדות: עד 100% החזר לקורסים מאושרים</li>
                  <li>• יום מחלה נוסף: 15 ימי מחלה לשנה (במקום 12)</li>
                  <li>• פרישה מוקדמת: אפשרות לפרישה בגיל 60 עם ותק של 30 שנה</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
