'use client'

import Layout from '@/components/Layout'
import PensionProvidentCalculator from '@/components/calculators/PensionProvidentCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function PensionProvidentPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון פנסיה וקופת גמל
          </h1>
          <p className="text-lg text-gray-600">
            חישוב תכנון פרישה והפרשות לעתיד פיננסי בטוח
          </p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="איך זה עובד – פנסיה וקופת גמל"
            subtitle="תכנון, בדיקה, וביצוע"
            steps={[
              { title: 'בודקים הפקדות', detail: 'שיעורי הפרשה, שכר מבוטח ותקרות' },
              { title: 'ממפים מוצרים', detail: 'קופות קיימות, דמי ניהול וביצועים' },
              { title: 'מתכננים פרישה', detail: 'קצבה צפויה, הטבות מס, ופיזור אפיקים' },
            ]}
            tips={[
              'השוו דמי ניהול באופן קבוע',
              'בדקו שינוי מסלול השקעה לפי גיל וסיכון',
              'נצלו הטבות מס להפקדות עצמאיות',
            ]}
            sources={[
              { label: 'מסלקה פנסיונית', url: 'https://pensuni.com' },
              { label: 'הר הכסף', url: 'https://itur.mof.gov.il' },
            ]}
          />
        </div>

        <PensionProvidentCalculator />

        {/* Educational Content */}
        <div className="mt-12 bg-purple-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">
            🏦 מידע חשוב על פנסיה בישראל
          </h2>
          <div className="space-y-3 text-purple-800">
            <p>
              • <strong>גיל פרישה:</strong> 67 לגברים, 62 לנשים (עם שינויים
              צפויים)
            </p>
            <p>
              • <strong>הפרשות חובה:</strong> 6% עובד + 6.5% מעביד = 12.5% מהשכר
            </p>
            <p>
              • <strong>תקרת הפרשה:</strong> פי 2.5 מהשכר הממוצע במשק
            </p>
            <p>
              • <strong>זכאות לקצבה:</strong> לאחר 10 שנות הפרשה מינימום
            </p>
            <p>
              • <strong>קופת גמל:</strong> הפרשה נוספת ל-6% מהשכר
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
