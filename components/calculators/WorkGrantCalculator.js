'use client'

import { useState } from 'react'

export default function WorkGrantCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [spouseIncome, setSpouseIncome] = useState('')
  const [dependents, setDependents] = useState('')
  const [result, setResult] = useState(null)
  const [isEligible, setIsEligible] = useState(false)

  const calculateGrant = () => {
    const monthly = parseFloat(monthlyIncome) || 0
    const spouseMonthly = parseFloat(spouseIncome) || 0
    const numDependents = parseInt(dependents) || 0

    // Annual income calculation
    const annualIncome = monthly * 12
    const spouseAnnualIncome = spouseMonthly * 12
    const totalAnnualIncome = annualIncome + spouseAnnualIncome

    // Basic eligibility threshold (8,000₪ + 2,000₪ per dependent)
    const eligibilityThreshold = 8000 + numDependents * 2000

    if (totalAnnualIncome > eligibilityThreshold) {
      setIsEligible(false)
      setResult({
        eligible: false,
        threshold: eligibilityThreshold,
        totalIncome: totalAnnualIncome,
        excess: totalAnnualIncome - eligibilityThreshold,
      })
      return
    }

    // Calculate grant amount
    let grantAmount = 0

    // Base grant calculation (simplified Israeli negative income tax model)
    const incomeDeficit = eligibilityThreshold - totalAnnualIncome
    grantAmount = Math.min(incomeDeficit * 0.5, 5000) // Maximum 5,000₪ per year

    // Adjust for dependents
    if (numDependents > 0) {
      grantAmount += Math.min(numDependents * 500, 2000) // Additional bonus for dependents
    }

    // Final grant amount (capped at 5,000₪)
    grantAmount = Math.min(Math.round(grantAmount), 5000)

    setIsEligible(true)
    setResult({
      eligible: true,
      grantAmount,
      threshold: eligibilityThreshold,
      totalIncome: totalAnnualIncome,
      monthlyGrant: Math.round(grantAmount / 12),
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8" dir="rtl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">מחשבון מענק עבודה</h2>
        <div className="text-sm">
          {isEligible ? (
            <span className="inline-block rounded bg-green-100 text-green-800 px-2 py-1">
              כנראה זכאי
            </span>
          ) : (
            <span className="inline-block rounded bg-gray-100 text-gray-800 px-2 py-1">
              בדוק זכאות
            </span>
          )}
        </div>
        <p className="text-gray-600">
          מענק עבודה (מס הכנסה שלילי) הוא מענק שמטרתו לעודד עבודה ולהגדיל את ההכנסה הזמינה למשפחות
          עובדות בעלות הכנסה נמוכה.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
              הכנסה חודשית ברוטו (₪)
            </label>
            <input
              type="number"
              id="monthlyIncome"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הכנס הכנסה חודשית"
              min="0"
              step="100"
            />
          </div>

          <div>
            <label htmlFor="spouseIncome" className="block text-sm font-medium text-gray-700 mb-2">
              הכנסה חודשית של בן/בת זוג (₪) - אופציונלי
            </label>
            <input
              type="number"
              id="spouseIncome"
              value={spouseIncome}
              onChange={(e) => setSpouseIncome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="הכנס הכנסה חודשית של בן/בת זוג"
              min="0"
              step="100"
            />
          </div>

          <div>
            <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-2">
              מספר ילדים/תלויים
            </label>
            <input
              type="number"
              id="dependents"
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="מספר ילדים או תלויים"
              min="0"
              max="10"
            />
          </div>

          <button
            onClick={calculateGrant}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            חשב זכאות למענק
          </button>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-lg p-6">
          {result ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {result.eligible ? 'זכאי למענק! 🎉' : 'לא זכאי למענק 😔'}
              </h3>

              {result.eligible ? (
                <div className="space-y-4">
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <div className="text-lg font-bold text-green-800">
                      מענק שנתי: {formatCurrency(result.grantAmount)}
                    </div>
                    <div className="text-sm text-green-600">
                      מענק חודשי: {formatCurrency(result.monthlyGrant)}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <div>הכנסה שנתית: {formatCurrency(result.totalIncome)}</div>
                    <div>סף זכאות: {formatCurrency(result.threshold)}</div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">איך לקבל את המענק?</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. הגש בקשה לרשות המסים</li>
                      <li>2. צרף אישורי הכנסה ומעסיק</li>
                      <li>3. המענק יועבר ישירות לחשבון הבנק</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <div className="text-sm text-red-800">
                      ההכנסה השנתית ({formatCurrency(result.totalIncome)}) עולה על סף הזכאות (
                      {formatCurrency(result.threshold)})
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      עודף של {formatCurrency(result.excess)}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">טיפים לזכאות:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• בדוק אם יש לך זכאות לזיכויים נוספים</li>
                      <li>• בחן אפשרויות הפחתת הכנסה חייבת</li>
                      <li>• התייעץ עם יועץ מס מוסמך</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">💼</div>
              <p>הכנס פרטים לבדיקת זכאות למענק עבודה</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">מידע חשוב על מענק עבודה</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• המענק מיועד למשפחות עובדות בעלות הכנסה נמוכה</p>
          <p>• הסכום המקסימלי הוא 5,000₪ לשנה</p>
          <p>• המענק נקבע לפי הכנסת המשפחה ומספר הילדים</p>
          <p>• יש להגיש בקשה לרשות המסים עם אישורי הכנסה</p>
          <p>• המענק משולם בדרך כלל בתשלומים חודשיים</p>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            * החישוב הוא הערכה בלבד. לפרטים מדויקים יש לפנות לרשות המסים או ליועץ מס מוסמך.
          </p>
        </div>
      </div>
    </div>
  )
}
