import Layout from '@/components/Layout'
import WorkGrantCalculator from '@/components/calculators/WorkGrantCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function WorkGrantPage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון מענק עבודה
          </h1>
          <p className="text-lg text-gray-600">
            בדיקת זכאות למענק עבודה (מס הכנסה שלילי) למשפחות עובדות בעלות הכנסה
            נמוכה
          </p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="מענק עבודה – שלבים לקבלת המענק"
            subtitle="בדיקת הכנסה, סטטוס משפחתי, הגשה בזמן"
            steps={[
              { title: 'שלב 1 – זכאות', detail: 'בדקו שההכנסה והסטטוס במשפחה עומדים בתנאים התקפים לשנה.' },
              { title: 'שלב 2 – הגשה', detail: 'הגשה מקוונת במועדים שנקבעו; וידוא פרטים אישיים וחשבונית בנק.' },
              { title: 'שלב 3 – מעקב וקבלת תשלום', detail: 'בדיקת סטטוס עד העברה לחשבון.' },
            ]}
            tips={[
              'לא לפספס מועדי הגשה; בנו תזכורת.',
              'עקבו אחר עדכוני ספים שנתיים.',
            ]}
            sources={[
              { label: 'רשות המסים – מענק עבודה', url: '' },
            ]}
          />
        </div>

        <WorkGrantCalculator />
      </div>
    </Layout>
  )
}
