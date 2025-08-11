import Layout from '@/components/Layout'
import MortgageRefinanceCalculator from '@/components/calculators/MortgageRefinanceCalculator'
import HowItWorks from '@/components/HowItWorks'

export default function MortgageRefinancePage() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-screen-md mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבון מחזור משכנתא
          </h1>
          <p className="text-lg text-gray-600">
            בדקו אם כדאי לכם לבצע מחזור משכנתא וכמה תוכלו לחסוך
          </p>
        </div>

        <div className="mb-6">
          <HowItWorks
            title="מחזור משכנתה – איך עושים את זה לבד"
            subtitle="ממיפוי ההלוואה ועד סגירה בבנק, צעד‑אחר‑צעד"
            steps={[
              { title: 'שלב 1 – מיפוי ההלוואה', detail: 'אסוף מסמכי הלוואה, יתרות במסלולים, ריביות, קישור למדד/פריים, תקופה ותמהיל.' },
              { title: 'שלב 2 – עמלות יציאה', detail: 'בדוק עמלת פירעון מוקדם/היוון (כאשר ריבית השוק נמוכה מהחוזה), עמלת פתיחת תיק למחזור, שמאי, רישום/שעבוד.' },
              { title: 'שלב 3 – הצעת תמהיל חדש', detail: 'חשב ריביות עדכניות, החזר חודשי, עלות כוללת, ותרחישים (עליית ריבית/מדד).' },
              { title: 'שלב 4 – השוואת הצעות', detail: 'אסוף 2–3 הצעות מבנקים. בקש הצעה כתובה ומפורטת (‘שובר הצעה’) להשוואה הוגנת.' },
              { title: 'שלב 5 – החלטה וביצוע', detail: 'חשבן חיסכון נטו אחרי כל העלויות. תאם שמאי ורישומים, בצע מעבר מסודר.' },
            ]}
            tips={[
              'נהלו מו"מ: ריביות ועמלת פתיחת תיק ניתנות להפחתה בהתאם לפרופיל הלקוח ושווי הנכס.',
              'אל תאריכו תקופה בלי בדיקת עלות ריבית כוללת לעומת הקלה תזרימית.',
              'בצעו שתי סימולציות: יציבות ריבית מול עליית ריבית/מדד.',
            ]}
            sources={[
              { label: 'בנק ישראל – מדריכי משכנתאות', url: '' },
              { label: 'טאבו/מרשם מקרקעין – טפסים ורישומים', url: '' },
            ]}
          />
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
