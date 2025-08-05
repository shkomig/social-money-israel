import Layout from '@/components/Layout'
import TaxRefundCalculator from '@/components/calculators/TaxRefundCalculator'

export default function TaxRefundPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון החזר מס
          </h1>
          <p className="text-lg text-gray-600">
            חישוב מדויק של החזר המס המגיע לכם על פי חוקי המס הישראליים לשנת
            2024-2025
          </p>
        </div>

        <TaxRefundCalculator />
      </div>
    </Layout>
  )
}
