import Link from 'next/link'
import Layout from '@/components/Layout'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <Layout>
      <div className="text-center" dir="rtl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <Logo className="h-24 md:h-28 lg:h-32" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            כסף חברתי - פלטפורמה לחישובים פיננסיים
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מחשבונים מדויקים להחזרי מס, מענקי עבודה, מחזור משכנתאות וזכויות סוציאליות בישראל
          </p>
        </div>

        {/* Calculator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Tax Refund Calculator */}
          <Link href="/calculators/tax-refund" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">מחשבון החזר מס</h3>
              <p className="text-gray-600 text-sm">
                חישוב מדויק של החזר המס המגיע לכם, כולל זיכויים על ילדים, נכות ונקודות זיכוי נוספות
              </p>
              <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                חשב עכשיו ←
              </div>
            </div>
          </Link>

          {/* Work Grant Calculator */}
          <Link href="/calculators/work-grant" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-green-300">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">מחשבון מענק עבודה</h3>
              <p className="text-gray-600 text-sm">
                בדיקת זכאות ומחשבון למענק עבודה (מס הכנסה שלילי) - עד 5,000₪ לשנה למשפחות עובדות
              </p>
              <div className="mt-4 text-green-600 font-medium group-hover:text-green-700">
                בדוק זכאות ←
              </div>
            </div>
          </Link>

          {/* Mortgage Refinance Calculator */}
          <Link href="/calculators/mortgage-refinance" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-purple-300">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">מחשבון מחזור משכנתא</h3>
              <p className="text-gray-600 text-sm">
                חישוב החיסכון הפוטנציאלי ממחזור משכנתא קיימת לתנאים טובים יותר
              </p>
              <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700">
                חשב חיסכון ←
              </div>
            </div>
          </Link>

          {/* Pension Calculator */}
          <Link href="/calculators/pension-provident" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-orange-300">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">מחשבון פנסיה וקופת גמל</h3>
              <p className="text-gray-600 text-sm">
                תכנון פנסיוני וחישוב תשואות קופות גמל להשלמת הכנסה
              </p>
              <div className="mt-4 text-orange-600 font-medium group-hover:text-orange-700">
                תכנן פנסיה ←
              </div>
            </div>
          </Link>

          {/* Teacher Benefits Calculator */}
          <Link href="/calculators/teacher-benefits" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-indigo-300">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">מחשבון זכויות מורים</h3>
              <p className="text-gray-600 text-sm">
                חישוב זכויות מיוחדות למורים ועובדי הוראה, כולל הטבות מס ופנסיה
              </p>
              <div className="mt-4 text-indigo-600 font-medium group-hover:text-indigo-700">
                חשב זכויות ←
              </div>
            </div>
          </Link>

          {/* Resources */}
          <Link href="/resources" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-teal-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">משאבים וזכויות</h3>
              <p className="text-gray-600 text-sm">
                מידע מקיף על זכויות סוציאליות, טבלאות מס וקישורים לאתרים ממשלתיים
              </p>
              <div className="mt-4 text-teal-600 font-medium group-hover:text-teal-700">
                צפה במשאבים ←
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">למה לבחור בכסף חברתי?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-900 mb-2">מחשבונים מדויקים</h3>
              <p className="text-gray-600 text-sm">
                כל החישובים מבוססים על חוקי המס הישראליים העדכניים לשנת 2024-2025
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">פרטיות מלאה</h3>
              <p className="text-gray-600 text-sm">
                כל החישובים מתבצעים במכשיר שלכם - המידע לא נשמר או נשלח לשרתים חיצוניים
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🆓</div>
              <h3 className="font-semibold text-gray-900 mb-2">שירות חינמי</h3>
              <p className="text-gray-600 text-sm">
                כל המחשבונים והמידע זמינים בחינם ללא צורך ברישום או תשלום
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/calculators"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-lg"
          >
            התחל לחשב עכשיו
          </Link>
        </div>
      </div>
    </Layout>
  )
}
