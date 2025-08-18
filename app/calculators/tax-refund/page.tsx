import Layout from '@/components/Layout'
import TaxRefundCalculator from '@/components/calculators/TaxRefundCalculator'
import HowItWorks from '@/components/HowItWorks'
import type { Metadata } from 'next'

export const generateMetadata = (): Metadata => ({
  title: 'החזר מס – מחשבון והסבר',
  description: 'מי זכאי, אילו מסמכים צריך, ודוגמה מספרית פשוטה.',
  alternates: { canonical: 'https://social-money-israel.netlify.app/calculators/tax-refund' },
})

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
            title="איך זה עובד – החזר מס"
            subtitle="שלבים פשוטים לקבלת ההחזר"
            steps={[
              {
                title: 'אוספים מסמכים',
                detail: 'טופסי 106, אישורי תרומות, לימודים והפקדות',
              },
              {
                title: 'ממלאים פרטים',
                detail: 'הכנסות, נקודות זיכוי וזיכויים רלוונטיים',
              },
              {
                title: 'מגישים בקשה',
                detail: 'הגשה לרשות המסים וקבלת ההחזר לחשבון',
              },
            ]}
            tips={[
              'שמרו קבלות ואישורים',
              'בדקו זכאות לנקודות זיכוי מיוחדות',
              'אפשר להגיש עבור עד 6 שנים אחורה',
            ]}
            sources={[{ label: 'רשות המסים', url: 'https://tax.gov.il' }]}
          />
        </div>

        <TaxRefundCalculator />
      </div>
    </Layout>
  )
}
