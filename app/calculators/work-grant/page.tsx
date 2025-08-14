import Layout from '@/components/Layout'
import WorkGrantCalculator from '@/components/calculators/WorkGrantCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function WorkGrantPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מחשבון מענק עבודה</h1>
          <p className="text-lg text-gray-600">בדיקת זכאות למענק עבודה</p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="מענק עבודה – איך זה עובד"
            subtitle="דוגמה קצרה"
            steps={[
              { title: 'בדיקת זכאות', detail: 'תיאור קצר' },
              { title: 'הגשת בקשה', detail: 'תיאור קצר' },
              { title: 'קבלת תשלום', detail: 'תיאור קצר' },
            ]}
            tips={['שמרו תלושי שכר', 'בדקו פרטי חשבון בנק']}
            sources={[{ label: 'רשות המסים', url: 'https://tax.gov.il' }]}
          />
        </div>

        <WorkGrantCalculator />
      </div>
    </Layout>
  )
}

