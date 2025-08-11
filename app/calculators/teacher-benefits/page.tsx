'use client'

import Layout from '@/components/Layout'
import TeacherBenefitsCalculator from '@/components/calculators/TeacherBenefitsCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function TeacherBenefitsPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון זכויות מורים
          </h1>
          <p className="text-lg text-gray-600">
            חישוב זכויות וטבות ייחודיות למורים בישראל
          </p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="איך זה עובד – זכויות מורים"
            subtitle="שלבים לקבלת ההטבות והזכויות"
            steps={[
              { title: 'ממפים זכויות', detail: 'בדקו הסכמים קיבוציים ותנאי העסקה' },
              { title: 'אוספים מסמכים', detail: 'תלושי שכר, אישורי לימודים/הכשרות' },
              { title: 'מגישים בקשות', detail: 'פנו למעסיק/משרד החינוך לפי הנהלים' },
            ]}
            tips={[
              'בדקו ותק והשפעתו על השכר',
              'הציגו אישורים בזמן כדי לא לפספס הטבות',
              'היעזרו בוועד/ארגון המורים במקרה של אי-ודאות',
            ]}
            sources={[
              { label: 'משרד החינוך', url: 'https://education.gov.il' },
              { label: 'ארגון המורים', url: 'https://irgun.org.il' },
            ]}
          />
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
