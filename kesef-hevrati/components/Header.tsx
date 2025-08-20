import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import NavigationEnhanced from './NavigationEnhanced'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-reverse space-x-2">
            <Logo className="h-16 md:h-20" />
          </Link>

          {/* Enhanced Navigation with accessibility features */}
          <NavigationEnhanced />

          {/* Contact/Action Button */}
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            <Link
              href="/resources"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="עבור למשאבים פיננסיים"
            >
              משאבים
            </Link>
          </div>

          {/* Mobile menu button - handled by NavigationEnhanced */}
        </div>
      </div>
    </header>
  )
}
