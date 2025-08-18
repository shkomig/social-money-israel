import Layout from '@/components/Layout'
import type { Metadata } from 'next'

export const generateMetadata = (): Metadata => ({
  title: 'משאבים והדרכה – כלים לקהילה',
  description: 'מאמרים, קישורים וכלים שיסייעו בקבלת החלטות כלכליות נכונות.',
  alternates: { canonical: 'https://social-money-israel.netlify.app/resources' },
})

export default function ResourcesPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            משאבים ומידע רשמי
          </h1>
          <p className="text-lg text-gray-600">
            קישורים למידע רשמי של רשויות המס והביטוח הלאומי בישראל
          </p>
        </div>

        <div className="space-y-8">
          {/* Tax Authority Resources */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl ml-3">🏛️</span>
              רשות המסים
            </h2>
            <div className="space-y-3">
              <a
                href="https://taxes.gov.il"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                אתר רשות המסים הרשמי ←
              </a>
              <a
                href="https://taxes.gov.il/about/taxesandbenefits/Pages/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                מדריך לנקודות זיכוי ←
              </a>
              <a
                href="https://taxes.gov.il/about/taxesandbenefits/Pages/TaxCredit.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                זיכוי מס על ילדים ←
              </a>
            </div>
          </div>

          {/* National Insurance Resources */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl ml-3">🛡️</span>
              הביטוח הלאומי
            </h2>
            <div className="space-y-3">
              <a
                href="https://www.gov.il/he/departments/national_insurance_institute"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                אתר הביטוח הלאומי ←
              </a>
              <a
                href="https://www.gov.il/he/service/grant-for-working-people"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                מענק עבודה (מס הכנסה שלילי) ←
              </a>
              <a
                href="https://www.gov.il/he/service/allowance-for-disabled-person"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                קצבת נכות ←
              </a>
            </div>
          </div>

          {/* Housing Ministry Resources */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl ml-3">🏠</span>
              משרד השיכון
            </h2>
            <div className="space-y-3">
              <a
                href="https://www.gov.il/he/departments/ministry_of_construction_and_housing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                אתר משרד השיכון ←
              </a>
              <a
                href="https://www.gov.il/he/service/mortgage-subsidized"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                משכנתא מסובסדת ←
              </a>
              <a
                href="https://www.gov.il/he/service/home-buyers-aid"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                סיוע לרוכשי דירה ←
              </a>
            </div>
          </div>

          {/* Legal and Consumer Protection */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl ml-3">⚖️</span>
              הגנת הצרכן ומידע משפטי
            </h2>
            <div className="space-y-3">
              <a
                href="https://www.gov.il/he/departments/consumers_protection_and_fair_trade_authority"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                רשות הגנת הצרכן ←
              </a>
              <a
                href="https://www.nevo.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                מאגר החקיקה הישראלית ←
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start">
            <span className="text-2xl ml-3">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                הסתמכות על מידע רשמי
              </h3>
              <p className="text-yellow-700 text-sm">
                המחשבונים באתר זה מיועדים לקבלת אומדן ראשוני בלבד. למידע מדויק
                ועדכני, יש להסתמך על המידע הרשמי באתרי הממשלה וליצור קשר עם
                הרשויות הרלוונטיות.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
