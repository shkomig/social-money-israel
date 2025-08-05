'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import MortgageRefinanceCalculator from '@/components/calculators/MortgageRefinanceCalculator'

export default function MortgageRefinancePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון מחזור משכנתא
          </h1>
          <p className="text-lg text-gray-600">
            בדקו אם כדאי לכם לבצע מחזור משכנתא וכמה תוכלו לחסוך
          </p>
        </div>

        <MortgageRefinanceCalculator />

        {/* Educational Content */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            💡 מתי כדאי לבצע מחזור משכنתא?
          </h2>
          <div className="space-y-3 text-blue-800">
            <p>• כאשר הריבית בשוק ירדה משמעותית מהריבית הנוכחית שלכם</p>
            <p>• כאשר החיסכון החודשי עולה על 400₪</p>
            <p>• כאשר עדיין נותרו לכם לפחות 5 שנים לסיום המשכנתא</p>
            <p>• כאשר עמלות המחזור נמוכות מהחיסכון הצפוי</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
