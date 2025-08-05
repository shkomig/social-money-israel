import Layout from '@/components/Layout'
import WorkGrantCalculator from '@/components/calculators/WorkGrantCalculator'

export default function WorkGrantPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון מענק עבודה
          </h1>
          <p className="text-lg text-gray-600">
            בדיקת זכאות למענק עבודה (מס הכנסה שלילי) למשפחות עובדות בעלות הכנסה
            נמוכה
          </p>
        </div>

        <WorkGrantCalculator />
      </div>
    </Layout>
  )
}
