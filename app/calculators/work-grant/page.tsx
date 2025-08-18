import Layout from '@/components/Layout'
import WorkGrantCalculator from '@/components/calculators/WorkGrantCalculator'
import HowItWorks from '@/components/HowItWorks'
import type { Metadata } from 'next'
import Script from 'next/script'

export const generateMetadata = (): Metadata => ({
  title: 'מענק עבודה – מחשבון זכאות',
  description: 'כלי מהיר לבדיקת זכאות למענק עבודה והשפעה על ההכנסה החודשית.',
  alternates: { canonical: 'https://social-money-israel.netlify.app/calculators/work-grant' },
  openGraph: {
    title: 'מענק עבודה – מחשבון זכאות',
    description: 'בדקו אם אתם זכאים למענק עבודה וכיצד להגיש בקשה.',
    url: 'https://social-money-israel.netlify.app/calculators/work-grant',
    images: [{ url: 'https://social-money-israel.netlify.app/logo.png', alt: 'מענק עבודה' }],
    locale: 'he-IL',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'מענק עבודה – כסף חברתי',
    description: 'בדקו זכאות למענק עבודה',
    images: ['https://social-money-israel.netlify.app/logo.png'],
  },
})

export default function WorkGrantPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מחשבון מענק עבודה</h1>
          <p className="text-lg text-gray-600">
            בדיקת זכאות למענק עבודה (מס הכנסה שלילי) למשפחות עובדות בעלות הכנסה נמוכה
          </p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="איך זה עובד – מענק עבודה"
            subtitle="בדיקת זכאות והגשה"
            steps={[
              { title: 'בודקים הכנסה', detail: 'הזן הכנסות שנתיות ומשפחתיות' },
              {
                title: 'מחשבים זכאות',
                detail: 'קבלו אומדן מענק לפי הקריטריונים',
              },
              {
                title: 'מגישים בקשה',
                detail: 'הגישו באתר הרשמי וקבלו העברה לחשבון',
              },
            ]}
            tips={[
              'בדקו מצב משפחתי מעודכן',
              'שמרו תלושי שכר וטפסי 106',
              'ודאו פרטי חשבון בנק נכונים',
            ]}
            sources={[{ label: 'רשות המסים – מענק עבודה', url: 'https://tax.gov.il' }]}
          />
        </div>

        <WorkGrantCalculator />
        {/* Related links */}
        <nav aria-label="קישורים רלוונטיים" dir="rtl" className="mt-6 border-t pt-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/calculators/mortgage-refinance"
                className="text-sm opacity-80 hover:underline"
              >
                מחשבון מחזור משכנתא
              </a>
            </li>
            <li>
              <a href="/calculators/tax-refund" className="text-sm opacity-80 hover:underline">
                מחשבון החזר מס
              </a>
            </li>
            <li>
              <a href="/resources" className="text-sm opacity-80 hover:underline">
                משאבים ומידע רשמי
              </a>
            </li>
          </ul>
        </nav>
        {/* JSON-LD: FAQ for Work Grant */}
        <Script id="faq-workgrant-jsonld" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'מי זכאי למענק עבודה?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'מי שעומד בתנאי ההכנסה והקריטריונים שנקבעו, לפי סטטוס משפחתי.',
                },
              },
              {
                '@type': 'Question',
                name: 'איך בודקים ומגישים?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'מבצעים בדיקה מהירה באתר וקושרים לשירות ההגשה הרשמי.',
                },
              },
            ],
          })}
        </Script>
      </div>
    </Layout>
  )
}
