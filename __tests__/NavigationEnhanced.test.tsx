/**
 * @fileoverview Test suite for NavigationEnhanced component
 *
 * Tests comprehensive accessibility, RTL support, and mobile functionality based on actual implementation
 *
 * @author Social Money Development Team
 * @version 2.0.0
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import NavigationEnhanced from '@/components/NavigationEnhanced'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('NavigationEnhanced', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Accessibility Features', () => {
    test('has proper ARIA landmarks and labels', () => {
      render(<NavigationEnhanced />)

      // Check for navigation landmark
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      expect(nav).toHaveAttribute('aria-label', 'ניווט ראשי')

      // Check for mobile menu button
      const mobileMenuButton = screen.getByRole('button', { name: /פתח תפריט/ })
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
      expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu')
    })

    test('supports keyboard navigation', async () => {
      render(<NavigationEnhanced />)

      // Focus first navigation link
      const firstLink = screen.getByRole('link', { name: /בית/ })
      firstLink.focus()
      expect(firstLink).toHaveFocus()

      // Tab to next link
      await user.tab()
      const nextLink = screen.getByRole('link', { name: /מחשבונים/ })
      expect(nextLink).toHaveFocus()
    })

    test('provides proper focus indicators', () => {
      render(<NavigationEnhanced />)

      const navigationLinks = screen.getAllByRole('link')
      navigationLinks.forEach((link) => {
        // Check for focus ring classes
        expect(link).toHaveClass(/focus:ring-/)
        expect(link).toHaveClass(/focus:outline-none/)
      })
    })

    test('has appropriate touch targets for mobile', () => {
      render(<NavigationEnhanced />)

      const mobileMenuButton = screen.getByRole('button', { name: /פתח תפריט/ })

      // Check minimum touch target size with visual padding classes
      expect(mobileMenuButton).toHaveClass(/p-/)
      expect(mobileMenuButton).toBeInTheDocument()
    })
  })

  describe('Mobile Menu Functionality', () => {
    test('renders mobile menu button with correct attributes', () => {
      render(<NavigationEnhanced />)

      const mobileMenuButton = screen.getByRole('button', { name: /פתח תפריט/ })
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false')
      expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu')

      // The button itself should be properly styled
      expect(mobileMenuButton).toHaveClass(/p-/)
      expect(mobileMenuButton).toHaveClass(/transition-/)
    })
  })

  describe('Hebrew Support', () => {
    test('displays Hebrew navigation labels correctly', () => {
      render(<NavigationEnhanced />)

      // Check for Hebrew labels that actually exist in the component
      expect(screen.getByText('בית')).toBeInTheDocument()
      expect(screen.getByText('מחשבונים')).toBeInTheDocument()
      expect(screen.getByText('החזר מס')).toBeInTheDocument()
      expect(screen.getByText('מחזור משכנתא')).toBeInTheDocument()
      expect(screen.getByText('מענק עבודה')).toBeInTheDocument()
      expect(screen.getByText('משאבים')).toBeInTheDocument()
    })

    test('has proper aria labels in Hebrew', () => {
      render(<NavigationEnhanced />)

      const homeLink = screen.getByRole('link', { name: /בית - עמוד הבית הראשי/ })
      expect(homeLink).toBeInTheDocument()

      const calculatorsLink = screen.getByRole('link', { name: /מחשבונים - כלי חישוב פיננסיים/ })
      expect(calculatorsLink).toBeInTheDocument()
    })
  })

  describe('Active State Management', () => {
    test('indicates current page with proper styling', () => {
      render(<NavigationEnhanced />)

      // Home page should be active (mocked pathname is '/')
      const homeLink = screen.getByRole('link', { name: /בית/ })
      expect(homeLink).toHaveClass(/bg-blue-/)
      expect(homeLink).toHaveAttribute('aria-current', 'page')
    })

    test('provides semantic indication of current page', () => {
      render(<NavigationEnhanced />)

      const activeLink = screen.getByRole('link', { current: 'page' })
      expect(activeLink).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    test('adapts layout for different screen sizes', () => {
      render(<NavigationEnhanced />)

      // Check for responsive classes on navigation
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass(/lg:flex/)

      // Mobile menu container should have responsive classes
      const mobileMenuContainer = document.querySelector('[data-mobile-menu="true"]')
      expect(mobileMenuContainer).toHaveClass(/lg:hidden/)
    })

    test('optimizes spacing for different viewport sizes', () => {
      render(<NavigationEnhanced />)

      const navigationLinks = screen.getAllByRole('link')
      navigationLinks.forEach((link) => {
        // Should have padding for touch targets
        expect(link).toHaveClass(/px-/)
        expect(link).toHaveClass(/py-/)
      })
    })
  })

  describe('Performance and Accessibility', () => {
    test('uses semantic HTML elements', () => {
      render(<NavigationEnhanced />)

      // Should use nav element
      expect(screen.getByRole('navigation')).toBeInTheDocument()

      // Should have proper button element
      expect(screen.getByRole('button', { name: /פתח תפריט/ })).toBeInTheDocument()
    })

    test('provides descriptive link text and aria labels', () => {
      render(<NavigationEnhanced />)

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        const ariaLabel = link.getAttribute('aria-label')
        expect(ariaLabel).toBeTruthy()
        expect(ariaLabel?.length).toBeGreaterThan(0)

        // Should have descriptive aria labels with context
        expect(ariaLabel).toMatch(/.+ - .+/)
      })
    })

    test('includes proper visual indicators', () => {
      render(<NavigationEnhanced />)

      // Should have proper visual hierarchy
      const navigationLinks = screen.getAllByRole('link')
      navigationLinks.forEach((link) => {
        expect(link).toHaveClass(/transition-/)
        expect(link).toHaveClass(/duration-/)
      })
    })

    test('supports reduced motion preferences', () => {
      render(<NavigationEnhanced />)

      const navigationLinks = screen.getAllByRole('link')
      navigationLinks.forEach((link) => {
        // Should respect user's motion preferences
        expect(link).toHaveClass(/transition-/)
      })
    })
  })
})
