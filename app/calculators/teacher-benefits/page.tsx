'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import TeacherBenefitsCalculator from '@/components/calculators/TeacherBenefitsCalculator'

export default function TeacherBenefitsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון זכויות מורים
          </h1>
          <p className="text-lg text-gray-600">
            חישוב זכויות וטבות ייחודיות למורים בישראל
          </p>
        </div>

        <TeacherBenefitsCalculator />

        {/* Educational Content */}
        <div className="mt-12 bg-green-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">
            🍎 זכויות ייחודיות למורים
          </h2>
          <div className="space-y-3 text-green-800">
            <p>
              • <strong>שכר לימודים מסובסד:</strong> החזר עד 75% מעלות לימודי
              תואר
            </p>
            <p>
              • <strong>חופשת קיץ מוארכת:</strong> זכאות לחופשה ללא תשלום
            </p>
            <p>
              • <strong>קצבת נסיעות:</strong> החזר הוצאות נסיעה לעבודה
            </p>
            <p>
              • <strong>ביטוח מקצועי:</strong> כיסוי ביטוחי מורחב
            </p>
            <p>
              • <strong>פנסיה מרבית:</strong> הפרשות גבוהות יותר לפנסיה
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
