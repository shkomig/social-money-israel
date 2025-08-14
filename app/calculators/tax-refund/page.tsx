import Layout from '@/components/Layout'
import TaxRefundCalculator from '@/components/calculators/TaxRefundCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function TaxRefundPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מחשבון החזר מס</h1>
          <p className="text-lg text-gray-600">הערכת החזר המס המגיע לכם</p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="איך זה עובד?"
            subtitle="דוגמה לתהליך החזר מס"
            steps={[
              { title: 'שלב ראשון', detail: 'תיאור שלב ראשון' },
              { title: 'שלב שני', detail: 'תיאור שלב שני' },
              { title: 'שלב שלישי', detail: 'תיאור שלב שלישי' },
            ]}
            tips={['טיפ ראשון', 'טיפ שני']}
            sources={[{ label: 'רשות המסים', url: 'https://tax.gov.il' }]}
          />
        </div>

        <TaxRefundCalculator />
      </div>
    </Layout>
  )
}

