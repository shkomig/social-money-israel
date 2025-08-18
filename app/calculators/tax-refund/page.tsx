import Layout from '@/components/Layout'
import TaxRefundCalculator from '@/components/calculators/TaxRefundCalculator'
import HowItWorks from '@/components/HowItWorks'
import type { Metadata } from 'next'
import Script from 'next/script'

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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מחשבון החזר מס</h1>
          <p className="text-lg text-gray-600">
            חישוב מדויק של החזר המס המגיע לכם על פי חוקי המס הישראליים לשנת 2024-2025
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
        {/* Related links */}
        <nav aria-label="קישורים רלוונטיים" dir="rtl" className="mt-6 border-t pt-4">
          <ul className="space-y-2">
            <li>
              <a href="/calculators/mortgage-refinance" className="text-sm opacity-80 hover:underline">
                מחשבון מחזור משכנתא
              </a>
            </li>
            <li>
              <a href="/calculators/work-grant" className="text-sm opacity-80 hover:underline">
                מחשבון מענק עבודה
              </a>
            </li>
            <li>
              <a href="/resources" className="text-sm opacity-80 hover:underline">
                משאבים ומידע רשמי
              </a>
            </li>
          </ul>
        </nav>
        {/* JSON-LD: FAQ for Tax Refund */}
        <Script id="faq-taxrefund-jsonld" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'מי זכאי להחזר מס?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'שכירים ועצמאים במקרים שונים (שינויים בתעסוקה, נקודות זיכוי, תרומות ועוד).',
                },
              },
              {
                '@type': 'Question',
                name: 'איך מגישים?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'ממלאים טופס מקוון ומצרפים מסמכים רלוונטיים; יש קישור בעמוד.',
                },
              },
            ],
          })}
        </Script>
      </div>
    </Layout>
  )
}
