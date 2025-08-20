'use client'

import { useState } from 'react'
import { DisabilityTip } from '@/components/EducationTip'

export default function TaxRefundCalculator() {
  const [income, setIncome] = useState('')
  const [taxPaid, setTaxPaid] = useState('')
  const [dependents, setDependents] = useState('')
  const [dependentsWithDisability, setDependentsWithDisability] = useState('')
  const [refund, setRefund] = useState<number | null>(null)
  const [disabilityCredit, setDisabilityCredit] = useState<number>(0)

  const calculateRefund = () => {
    const annualIncome = parseFloat(income)
    const paidTax = parseFloat(taxPaid)
    const numDependents = parseInt(dependents) || 0
    const numDependentsWithDisability = parseInt(dependentsWithDisability) || 0

    if (!annualIncome || !paidTax) return

    // Basic tax calculation for Israel (simplified)
    let expectedTax = 0
    if (annualIncome <= 75960) {
      expectedTax = annualIncome * 0.1
    } else if (annualIncome <= 108840) {
      expectedTax = 7596 + (annualIncome - 75960) * 0.14
    } else if (annualIncome <= 174840) {
      expectedTax = 12199.2 + (annualIncome - 108840) * 0.2
    } else {
      expectedTax = 25399.2 + (annualIncome - 174840) * 0.31
    }

    // Calculate tax credits
    let totalCredits = 0

    // Standard dependent credit (2.25 tax credit points per dependent = 6,510₪ per year)
    totalCredits += numDependents * 6510

    // Disability dependent credit (additional 2 tax credit points = 5,808₪ per year per disabled dependent)
    const disabilityCreditAmount = numDependentsWithDisability * 5808
    totalCredits += disabilityCreditAmount
    setDisabilityCredit(disabilityCreditAmount)

    // Apply credits to reduce expected tax
    expectedTax = Math.max(0, expectedTax - totalCredits)

    const calculatedRefund = paidTax - expectedTax
    setRefund(calculatedRefund)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-center">מחשבון החזר מס</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הכנסה שנתית (₪)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הכנס הכנסה שנתית"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מס ששולם (₪)
          </label>
          <input
            type="number"
            value={taxPaid}
            onChange={(e) => setTaxPaid(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הכנס סכום מס ששולם"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר ילדים/תלויים
          </label>
          <input
            type="number"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הכנס מספר תלויים"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר תלויים עם מוגבלות
          </label>
          <input
            type="number"
            value={dependentsWithDisability}
            onChange={(e) => setDependentsWithDisability(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="הכנס מספר תלויים עם מוגבלות"
            min="0"
          />
          <p className="text-sm text-gray-600 mt-1">
            תלויים עם מוגבלות זכאים לזיכוי מס נוסף של 2 נקודות זיכוי (5,808 ₪
            לשנה)
          </p>
        </div>

        <button
          onClick={calculateRefund}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200"
        >
          חשב החזר מס
        </button>

        {refund !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold mb-2">תוצאה:</h3>

            {/* Disability Credit Notification */}
            {parseInt(dependentsWithDisability) > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-600 font-medium">
                  💡 שימו לב: זכאים ל-2 נקודות זיכוי נוספות עבור{' '}
                  {dependentsWithDisability} תלויים עם מוגבלות
                </p>
                <p className="text-yellow-700 text-sm mt-1">
                  זיכוי נוסף: ₪{disabilityCredit.toLocaleString('he-IL')} לשנה
                </p>
              </div>
            )}

            {refund > 0 ? (
              <p className="text-green-600 text-xl font-bold">
                זכאי להחזר: ₪{refund.toLocaleString('he-IL')}
              </p>
            ) : refund < 0 ? (
              <p className="text-red-600 text-xl font-bold">
                חוב נוסף: ₪{Math.abs(refund).toLocaleString('he-IL')}
              </p>
            ) : (
              <p className="text-gray-600 text-xl font-bold">
                אין חוב ואין החזר
              </p>
            )}

            {/* Additional Information */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="font-medium text-blue-800 mb-2">פירוט זיכויים:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                {parseInt(dependents) > 0 && (
                  <li>
                    • זיכוי בסיסי עבור {dependents} תלויים: ₪
                    {(parseInt(dependents) * 6510).toLocaleString('he-IL')}
                  </li>
                )}
                {parseInt(dependentsWithDisability) > 0 && (
                  <li>
                    • זיכוי נוסף עבור מוגבלות: ₪
                    {disabilityCredit.toLocaleString('he-IL')}
                  </li>
                )}
                {parseInt(dependents) === 0 &&
                  parseInt(dependentsWithDisability) === 0 && (
                    <li>• לא הוגדרו תלויים - חישוב בסיסי</li>
                  )}
              </ul>
            </div>
          </div>
        )}

        {/* Educational Tip for Disability Tax Credits */}
        <DisabilityTip />
      </div>
    </div>
  )
}
