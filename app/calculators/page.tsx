import Link from 'next/link'
import Layout from '@/components/Layout'

export default function CalculatorsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            מחשבונים פיננסיים
          </h1>
          <p className="text-lg text-gray-600">
            בחרו מהמחשבונים המדויקים שלנו לקבלת חישובים מבוססי חוקי המס
            הישראליים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tax Refund Calculator */}
          <Link href="/calculators/tax-refund" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-gray-200 hover:border-blue-300">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                מחשבון החזר מס
              </h2>
              <p className="text-gray-600 mb-6">
                חישוב מדויק של החזר המס המגיע לכם, כולל זיכויים על ילדים, נכות
                ונקודות זיכוי נוספות. המחשבון מבוסס על טבלאות המס העדכניות לשנת
                2024-2025.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-blue-600 font-medium group-hover:text-blue-700">
                  חשב החזר מס ←
                </div>
                <div className="text-sm text-gray-500">כולל זכויות נכות</div>
              </div>
            </div>
          </Link>

          {/* Work Grant Calculator */}
          <Link href="/calculators/work-grant" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-gray-200 hover:border-green-300">
              <div className="text-5xl mb-4">💼</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                מחשבון מענק עבודה
              </h2>
              <p className="text-gray-600 mb-6">
                בדיקת זכאות ומחשבון מדויק למענק עבודה (מס הכנסה שלילי). המענק
                יכול להגיע לעד 5,000₪ לשנה למשפחות עובדות עם הכנסה נמוכה.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-green-600 font-medium group-hover:text-green-700">
                  בדוק זכאות למענק ←
                </div>
                <div className="text-sm text-gray-500">עד 5,000₪ לשנה</div>
              </div>
            </div>
          </Link>

          {/* Mortgage Refinance Calculator */}
          <Link href="/calculators/mortgage-refinance" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-gray-200 hover:border-purple-300">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                מחשבון מחזור משכנתא
              </h2>
              <p className="text-gray-600 mb-6">
                חישוב החיסכון הפוטנציאלי ממחזור משכנתא קיימת לתנאים טובים יותר.
                המחשבון כולל עלויות מחזור וחישוב תקופת החזר השקעה.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-purple-600 font-medium group-hover:text-purple-700">
                  חשב חיסכון ממחזור ←
                </div>
                <div className="text-sm text-gray-500">כולל גרפים מתקדמים</div>
              </div>
            </div>
          </Link>

          {/* Pension Calculator */}
          <Link href="/calculators/pension-provident" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-gray-200 hover:border-orange-300">
              <div className="text-5xl mb-4">🏦</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                מחשבון פנסיה וקופת גמל
              </h2>
              <p className="text-gray-600 mb-6">
                תכנון פנסיוני מתקדם וחישוב תשואות קופות גמל להשלמת הכנסה.
                המחשבון כולל הטבות מס וחישוב גמלאות צפויה.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-orange-600 font-medium group-hover:text-orange-700">
                  תכנן פנסיה ←
                </div>
                <div className="text-sm text-gray-500">הטבות מס עד 38,412₪</div>
              </div>
            </div>
          </Link>

          {/* Teacher Benefits Calculator */}
          <Link href="/calculators/teacher-benefits" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 border border-gray-200 hover:border-indigo-300">
              <div className="text-5xl mb-4">🎓</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                מחשבון זכויות מורים
              </h2>
              <p className="text-gray-600 mb-6">
                חישוב זכויות מיוחדות למורים ועובדי הוראה, כולל הטבות מס מיוחדות,
                זכויות פנסיוניות משופרות ומענקי השתלמות.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-indigo-600 font-medium group-hover:text-indigo-700">
                  חשב זכויות מורים ←
                </div>
                <div className="text-sm text-gray-500">הטבות מיוחדות</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200">
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              טיפ פיננסי חשוב
            </h3>
            <p className="text-blue-800 leading-relaxed max-w-2xl mx-auto">
              כל המחשבונים שלנו מבוססים על החוקים העדכניים לשנת המס 2024-2025.
              אנו ממליצים לעדכן את החישובים תקופתית ולהתייעץ עם רואה חשבון מוסמך
              לפני קבלת החלטות פיננסיות משמעותיות.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
