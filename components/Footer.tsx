import React from 'react'
import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              כסף חברתי - פלטפורמה לחישובים פיננסיים וזכויות סוציאליות בישראל.
              אנו מספקים כלים מדויקים לחישוב החזרי מס, מענקי עבודה, ומחזור
              משכנתאות.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              קישורים מהירים
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/calculators"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  מחשבונים
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/tax-refund"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  החזר מס
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators/work-grant"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  מענק עבודה
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  משאבים
                </Link>
              </li>
            </ul>
          </div>

          {/* Government Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              משאבים ממשלתיים
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.gov.il/he/departments/taxes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  רשות המסים
                </a>
              </li>
              <li>
                <a
                  href="https://www.btl.gov.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  ביטוח לאומי
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.il/he/departments/ministry_of_finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  משרד האוצר
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 כסף חברתי. כל הזכויות שמורות.
          </p>
          <div className="flex space-x-reverse space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              מדיניות פרטיות
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              תנאי שימוש
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
