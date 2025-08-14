import Layout from '@/components/Layout'
import MortgageRefinanceCalculator from '@/components/calculators/MortgageRefinanceCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function MortgageRefinancePage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">מחשבון מחזור משכנתא</h1>
          <p className="text-lg text-gray-600">בדיקה מהירה האם כדאי למחזר את המשכנתא</p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="איך ממחזרים משכנתא"
            subtitle="הסבר כללי"
            steps={[
              { title: 'בדיקת תנאים', detail: 'תיאור קצר' },
              { title: 'השוואת הצעות', detail: 'תיאור קצר' },
              { title: 'סגירת הלוואה', detail: 'תיאור קצר' },
            ]}
            tips={['השוו ריביות', 'בדקו עמלות']}
            sources={[{ label: 'בנק ישראל', url: 'https://www.boi.org.il' }]}
          />
        </div>

        <MortgageRefinanceCalculator />
      </div>
    </Layout>
  )
}

