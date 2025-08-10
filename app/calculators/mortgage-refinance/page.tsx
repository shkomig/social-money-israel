export const revalidate = 0

import Layout from '@/components/Layout'
import MortgageRefinanceCalculator from '@/components/calculators/MortgageRefinanceCalculator'

export default function MortgageRefinancePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון מחזור משכנתא
          </h1>
          <p className="text-lg text-gray-600">
            בדקו אם כדאי לכם לבצע מחזור משכנתא וכמה תוכלו לחסוך
          </p>
        </div>

        <MortgageRefinanceCalculator />

        {/* Educational Content */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            💡 מתי כדאי לבצע מחזור משכנתא?
          </h2>
          <div className="space-y-3 text-blue-800">
            <p>• כאשר הריבית בשוק ירדה משמעותית מהריבית הנוכחית שלכם</p>
            <p>• כאשר החיסכון החודשי עולה על 400₪</p>
            <p>• כאשר עדיין נותרו לכם לפחות 5 שנים לסיום המשכנתא</p>
            <p>• כאשר עמלות המחזור נמוכות מהחיסכון הצפוי</p>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            💰 טיפים לחיסכון נוסף:
          </h3>
          <div className="space-y-2 text-green-800">
            <p>• השוו הצעות ממספר בנקים</p>
            <p>• בדקו אפשרות למשכנתא משולבת (ריבית קבועה + משתנה)</p>
            <p>• שקלו קיצור תקופת המשכנתא במקום הקטנת התשלום</p>
            <p>• התייעצו עם יועץ משכנתאות לפני החלטה</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
