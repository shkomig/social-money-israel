import Layout from '@/components/Layout'
import TaxRefundCalculator from '@/components/calculators/TaxRefundCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function TaxRefundPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון החזר מס
          </h1>
          <p className="text-lg text-gray-600">
            חישוב מדויק של החזר המס המגיע לכם על פי חוקי המס הישראליים לשנת
            2024-2025
          </p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="החזר מס – כך מגישים נכון"
            subtitle="בודקים זכאות, מכינים מסמכים, מגישים ועוקבים"
            steps={[
              { title: 'שלב 1 – בדיקת זכאות', detail: 'נקודות זיכוי, סטטוס משפחתי, תארים/לימודים, תרומות, קופות גמל ופנסיה.' },
              { title: 'שלב 2 – מסמכים', detail: 'טופס 106 מכל מעסיק, אישורי תרומה, אישורי ריבית משכנתא לזיכוי, אישורי לימודים.' },
              { title: 'שלב 3 – חישוב והצלבה', detail: 'בדיקת עודף ניכוי מול המס בפועל; השוואת נתונים בין מעסיקים.' },
              { title: 'שלב 4 – הגשה מקוונת', detail: 'מילוי טופס/דוח, העלאת מסמכים, שליחה ומעקב סטטוס.' },
              { title: 'שלב 5 – קבלת ההחזר', detail: 'וידוא פרטי בנק, המתנה לאישור וזיכוי לחשבון.' },
            ]}
            tips={[
              'שמרו עותקים דיגיטליים לכל מסמך.',
              'בדקו שנות מס קודמות — ניתן לבקש רטרואקטיבית בכפוף לכללים.',
            ]}
            sources={[
              { label: 'רשות המסים – הגשת דוחות ונקודות זיכוי', url: '' },
            ]}
          />
        </div>

        <TaxRefundCalculator />
      </div>
    </Layout>
  )
}
