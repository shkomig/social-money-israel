import React from 'react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav
      className="hidden md:flex items-center space-x-reverse space-x-8"
      role="navigation"
    >
      <Link
        href="/"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        בית
      </Link>
      <Link
        href="/calculators"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        מחשבונים
      </Link>
      <Link
        href="/calculators/tax-refund"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        החזר מס
      </Link>
      <Link
        href="/calculators/mortgage-refinance"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        מחזור משכנתא
      </Link>
      <Link
        href="/calculators/work-grant"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        מענק עבודה
      </Link>
      <Link
        href="/resources"
        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
      >
        משאבים
      </Link>
    </nav>
  )
}
