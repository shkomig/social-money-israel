/**
 * @fileoverview Enhanced Navigation component with comprehensive accessibility, RTL support, and mobile optimization
 * 
 * This component provides the main navigation for the Social Money platform with:
 * - Comprehensive accessibility compliance (WCAG 2.1 AA)
 * - RTL layout support for Hebrew interface
 * - Mobile-first responsive design with touch optimization
 * - Keyboard navigation and screen reader support
 * - ARIA landmarks and proper focus management
 * - Active state indication with visual and semantic cues
 * 
 * @author Social Money Development Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Navigation item type definition
interface NavigationItem {
  href: string
  label: string
  description: string
  icon: string
  category: 'main' | 'tools' | 'resources'
}

// Navigation data with Hebrew labels and accessibility descriptions
const navigationItems: NavigationItem[] = [
  {
    href: '/',
    label: 'בית',
    description: 'עמוד הבית הראשי',
    icon: '🏠',
    category: 'main'
  },
  {
    href: '/calculators',
    label: 'מחשבונים',
    description: 'כלי חישוב פיננסיים לישראל',
    icon: '🧮',
    category: 'tools'
  },
  {
    href: '/calculators/tax-refund',
    label: 'החזר מס',
    description: 'חישוב החזר מס הכנסה',
    icon: '💰',
    category: 'tools'
  },
  {
    href: '/calculators/mortgage-refinance',
    label: 'מחזור משכנתא',
    description: 'בדיקת כדאיות מחזור משכנתא',
    icon: '🏡',
    category: 'tools'
  },
  {
    href: '/calculators/work-grant',
    label: 'מענק עבודה',
    description: 'חישוב מענק עבודה ונקודות זכות',
    icon: '💼',
    category: 'tools'
  },
  {
    href: '/resources',
    label: 'משאבים',
    description: 'מדריכים ומשאבים פיננסיים',
    icon: '📚',
    category: 'resources'
  },
  {
    href: '/goals',
    label: 'יעדי חיסכון',
    description: 'מעקב ותכנון יעדי חיסכון',
    icon: '🎯',
    category: 'resources'
  },
  {
    href: '/community',
    label: 'קהילה',
    description: 'שאלות ותשובות בקהילה הפיננסית',
    icon: '👥',
    category: 'resources'
  },
  {
    href: '/benefits',
    label: 'הטבות',
    description: 'בדיקת זכאות להטבות ממשלתיות',
    icon: '🎁',
    category: 'main'
  }
]

/**
 * Enhanced Navigation Component
 * 
 * Provides accessible navigation with mobile support and proper RTL layout
 */
export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Check if a navigation item is currently active
  const isActiveLink = useCallback((href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }, [pathname])

  // Handle mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
    setFocusedIndex(-1)
  }, [])

  // Close mobile menu when clicking outside or on a link
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
    setFocusedIndex(-1)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const visibleItems = navigationItems
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev < visibleItems.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : visibleItems.length - 1
        )
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(visibleItems.length - 1)
        break
      case 'Escape':
        if (isMobileMenuOpen) {
          closeMobileMenu()
        }
        break
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu()
  }, [pathname, closeMobileMenu])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className="hidden lg:flex items-center space-x-reverse space-x-6 xl:space-x-8"
        role="navigation"
        aria-label="ניווט ראשי"
      >
        {navigationItems.slice(0, 6).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-3 py-2 text-sm xl:text-base font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isActiveLink(item.href)
                ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
            }`}
            aria-current={isActiveLink(item.href) ? 'page' : undefined}
            aria-label={`${item.label} - ${item.description}`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            
            {/* Active indicator */}
            {isActiveLink(item.href) && (
              <span 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                aria-hidden="true"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden" data-mobile-menu>
        <button
          onClick={toggleMobileMenu}
          onKeyDown={handleKeyDown}
          className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
          type="button"
        >
          <span className="sr-only">
            {isMobileMenuOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
          </span>
          
          {/* Hamburger Icon */}
          <div className="relative w-6 h-6">
            <span 
              className={`absolute block h-0.5 w-6 bg-current transform transition-transform duration-300 ${
                isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'
              }`}
              aria-hidden="true"
            />
            <span 
              className={`absolute block h-0.5 w-6 bg-current transform transition-opacity duration-300 top-3 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            />
            <span 
              className={`absolute block h-0.5 w-6 bg-current transform transition-transform duration-300 ${
                isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'
              }`}
              aria-hidden="true"
            />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              aria-hidden="true"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu Panel */}
            <div
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-80 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
              data-mobile-menu
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 
                  id="mobile-menu-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  תפריט ניווט
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="סגור תפריט"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 py-4 overflow-y-auto" dir="rtl">
                <nav
                  role="navigation"
                  aria-label="ניווט נייד"
                  onKeyDown={handleKeyDown}
                >
                  {/* Group by category */}
                  {['main', 'tools', 'resources'].map(category => {
                    const categoryItems = navigationItems.filter(item => item.category === category)
                    const categoryLabels = {
                      main: 'דפים ראשיים',
                      tools: 'כלי חישוב',
                      resources: 'משאבים וקהילה'
                    }
                    
                    return (
                      <div key={category} className="mb-6">
                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </h3>
                        <ul role="list" className="space-y-1">
                          {categoryItems.map((item) => {
                            const globalIndex = navigationItems.indexOf(item)
                            const isFocused = focusedIndex === globalIndex
                            
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={closeMobileMenu}
                                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                                    isActiveLink(item.href)
                                      ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                                      : isFocused
                                      ? 'text-gray-900 bg-gray-100'
                                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                  }`}
                                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                                  aria-describedby={`mobile-desc-${item.href.replace(/\//g, '-')}`}
                                  tabIndex={isFocused ? 0 : -1}
                                >
                                  <span className="text-xl flex-shrink-0" aria-hidden="true">
                                    {item.icon}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-base font-medium">
                                      {item.label}
                                    </div>
                                    <div 
                                      id={`mobile-desc-${item.href.replace(/\//g, '-')}`}
                                      className="text-sm text-gray-500"
                                    >
                                      {item.description}
                                    </div>
                                  </div>
                                  
                                  {/* Active indicator */}
                                  {isActiveLink(item.href) && (
                                    <svg 
                                      className="w-5 h-5 text-blue-600 flex-shrink-0" 
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                    >
                                      <path 
                                        fillRule="evenodd" 
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                        clipRule="evenodd" 
                                      />
                                    </svg>
                                  )}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                </nav>
              </div>

              {/* Mobile Menu Footer */}
              <div className="border-t border-gray-200 p-4">
                <div className="text-xs text-gray-500 text-center">
                  Social Money - פלטפורמה פיננסית לישראל
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
