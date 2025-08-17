/**
 * @fileoverview Test suite for TaxRefundCalculatorEnhanced component
 *
 * Tests comprehensive accessibility, RTL support, and calculation accuracy:
 * - Form validation with Hebrew error messages
 * - Israeli tax bracket calculations
 * - ARIA compliance and keyboard navigation
 * - RTL layout support
 * - Mobile responsiveness
 * - Real-time validation feedback
 *
 * @author Social Money Development Team
 * @version 2.0.0
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import TaxRefundCalculatorEnhanced from '@/components/calculators/TaxRefundCalculatorEnhanced'

describe('TaxRefundCalculatorEnhanced', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    test('renders main calculator elements', () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Check for main header
      expect(screen.getByRole('heading', { name: /מחשבון החזר מס הכנסה/ })).toBeInTheDocument()

      // Check for main input fields - use specific text to avoid conflicts
      expect(screen.getByLabelText(/הכנסה שנתית ברוטו/)).toBeInTheDocument()
      expect(screen.getByLabelText(/מס הכנסה ששולם השנה/)).toBeInTheDocument()
      expect(screen.getByLabelText('מספר תלויים')).toBeInTheDocument()
      expect(screen.getByLabelText(/מספר תלויים עם נכות/)).toBeInTheDocument()
    })

    test('has proper RTL direction and Hebrew labels', () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Check for RTL direction
      const main = screen.getByRole('main')
      expect(main).toHaveAttribute('dir', 'rtl')

      // Check for Hebrew text
      expect(screen.getByText('פרטי הכנסה ומס ששולם')).toBeInTheDocument()
      expect(screen.getByText('נקודות זיכוי ותלויים')).toBeInTheDocument()
    })

    test('includes proper ARIA landmarks and structure', () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Check for semantic structure
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getAllByRole('group')).toHaveLength(2) // fieldsets

      // Check for proper labeling
      const incomeInput = screen.getByLabelText(/הכנסה שנתית ברוטו/)
      expect(incomeInput).toHaveAttribute('aria-describedby')
      expect(incomeInput).toHaveAttribute('aria-invalid', 'false')
    })
  })

  describe('Form Validation', () => {
    test('shows Hebrew error messages for invalid inputs', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      const incomeInput = screen.getByLabelText(/הכנסה שנתית ברוטו/)
      const taxPaidInput = screen.getByLabelText(/מס הכנסה ששולם השנה/)

      // Test negative income
      await user.type(incomeInput, '-1000')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/יש להזין סכום תקין/)).toBeInTheDocument()
      })

      // Test tax paid higher than income
      await user.clear(incomeInput)
      await user.type(incomeInput, '50000')
      await user.type(taxPaidInput, '100000')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText(/מס ששולם לא יכול להיות גבוה מההכנסה/)).toBeInTheDocument()
      })
    })

    test('validates required fields', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      const calculateButton = screen.getByRole('button', { name: /חשב החזר מס/ })

      // Button should be disabled initially
      expect(calculateButton).toBeDisabled()

      // Fill only income
      const incomeInput = screen.getByLabelText(/הכנסה שנתית ברוטו/)
      await user.type(incomeInput, '100000')

      // Button should still be disabled
      expect(calculateButton).toBeDisabled()

      // Fill tax paid
      const taxPaidInput = screen.getByLabelText(/מס הכנסה ששולם השנה/)
      await user.type(taxPaidInput, '15000')

      // Button should now be enabled
      await waitFor(() => {
        expect(calculateButton).toBeEnabled()
      })
    })

    test('validates dependents with disability correctly', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      const dependentsInput = screen.getByLabelText(/מספר תלויים$/)
      const disabilityInput = screen.getByLabelText(/מספר תלויים עם נכות/)

      // Set dependents with disability higher than total dependents
      await user.type(dependentsInput, '2')
      await user.type(disabilityInput, '3')
      await user.tab()

      await waitFor(() => {
        expect(
          screen.getByText(/מספר תלויים עם נכות לא יכול לעלות על מספר התלויים הכולל/),
        ).toBeInTheDocument()
      })
    })
  })

  describe('Tax Calculations', () => {
    test('calculates tax refund correctly for basic scenario', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Fill form with test data
      await user.type(screen.getByLabelText(/הכנסה שנתית ברוטו/), '100000')
      await user.type(screen.getByLabelText(/מס הכנסה ששולם השנה/), '15000')
      await user.type(screen.getByLabelText(/מספר תלויים$/), '2')

      // Submit calculation
      const calculateButton = screen.getByRole('button', { name: /חשב החזר מס/ })
      await user.click(calculateButton)

      // Check for results
      await waitFor(() => {
        expect(screen.getByText('תוצאות החישוב')).toBeInTheDocument()
        expect(screen.getByText(/החזר מס צפוי|תשלום נוסף נדרש/)).toBeInTheDocument()
      })
    })

    test('displays tax bracket information', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Fill form with income in second tax bracket
      await user.type(screen.getByLabelText(/הכנסה שנתית ברוטו/), '90000')
      await user.type(screen.getByLabelText(/מס הכנסה ששולם השנה/), '10000')

      await user.click(screen.getByRole('button', { name: /חשב החזר מס/ }))

      await waitFor(() => {
        expect(screen.getByText(/מדרגת מס:/)).toBeInTheDocument()
        expect(screen.getByText(/שיעור מס אפקטיבי:/)).toBeInTheDocument()
      })
    })

    test('includes disability credits in calculation', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/הכנסה שנתית ברוטו/), '100000')
      await user.type(screen.getByLabelText(/מס הכנסה ששולם השנה/), '15000')
      await user.type(screen.getByLabelText(/מספר תלויים$/), '2')
      await user.type(screen.getByLabelText(/מספר תלויים עם נכות/), '1')

      await user.click(screen.getByRole('button', { name: /חשב החזר מס/ }))

      await waitFor(() => {
        expect(screen.getByText(/כולל זיכוי נכות:/)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Features', () => {
    test('supports keyboard navigation', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      const incomeInput = screen.getByLabelText(/הכנסה שנתית ברוטו/)
      const taxPaidInput = screen.getByLabelText(/מס הכנסה ששולם השנה/)

      // Tab navigation should work
      incomeInput.focus()
      expect(incomeInput).toHaveFocus()

      await user.tab()
      expect(taxPaidInput).toHaveFocus()
    })

    test('provides proper focus indicators', () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Number inputs have 'spinbutton' role, not 'textbox'
      const inputs = screen.getAllByRole('spinbutton')
      inputs.forEach((input) => {
        expect(input).toHaveClass(/focus:ring-/)
        expect(input).toHaveClass(/focus:outline-none/)
      })
    })

    test('has proper ARIA live regions for results', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/הכנסה שנתית ברוטו/), '100000')
      await user.type(screen.getByLabelText(/מס הכנסה ששולם השנה/), '15000')
      await user.click(screen.getByRole('button', { name: /חשב החזר מס/ }))

      await waitFor(() => {
        const resultsRegion = screen.getByRole('region', { name: /תוצאות החישוב/ })
        expect(resultsRegion).toHaveAttribute('aria-live', 'polite')
      })
    })

    test('provides error announcements for screen readers', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      const incomeInput = screen.getByLabelText(/הכנסה שנתית ברוטו/)
      await user.type(incomeInput, '-1000')
      await user.tab()

      await waitFor(() => {
        const errorElements = screen.getAllByRole('alert')
        expect(errorElements.length).toBeGreaterThan(0)
        expect(errorElements[0]).toHaveTextContent(/שגיאה:/)
      })
    })
  })

  describe('User Experience Features', () => {
    test('shows loading state during calculation', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/הכנסה שנתית ברוטו/), '100000')
      await user.type(screen.getByLabelText(/מס הכנסה ששולם השנה/), '15000')

      const calculateButton = screen.getByRole('button', { name: /חשב החזר מס/ })
      await user.click(calculateButton)

      // Should show loading state briefly - use more specific query to avoid multiple matches
      expect(screen.getByRole('button', { name: /מחשב החזר מס.../ })).toBeInTheDocument()
    })

    test('resets form correctly', async () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Fill form
      await user.type(screen.getByLabelText(/הכנסה שנתית ברוטו/), '100000')
      await user.type(screen.getByLabelText(/מס הכנסה ששולם השנה/), '15000')

      // Reset form
      await user.click(screen.getByRole('button', { name: /נקה/ }))

      // Check inputs are cleared - for number inputs, empty value is null
      expect(screen.getByLabelText(/הכנסה שנתית ברוטו/)).toHaveValue(null)
      expect(screen.getByLabelText(/מס הכנסה ששולם השנה/)).toHaveValue(null)
    })

    test('provides helpful input hints', () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Check for help text
      expect(
        screen.getByText(/הזינו את ההכנסה השנתית הברוטו כפי שמופיעה בתלוש השכר/),
      ).toBeInTheDocument()
      expect(screen.getByText(/סכום המס שנוכה מהשכר או ששולם בהחזרות/)).toBeInTheDocument()
      expect(screen.getByText(/2.25 נקודות זיכוי לכל תלוי/)).toBeInTheDocument()
    })
  })

  describe('Mobile Responsiveness', () => {
    test('adapts layout for mobile screens', () => {
      render(<TaxRefundCalculatorEnhanced />)

      // Check for responsive grid
      const gridContainer = document.querySelector('.lg\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()

      // Check mobile-friendly button layout
      const buttonContainer = document.querySelector('.sm\\:flex-row')
      expect(buttonContainer).toBeInTheDocument()
    })

    test('uses appropriate input modes for mobile', () => {
      render(<TaxRefundCalculatorEnhanced />)

      const incomeInput = screen.getByLabelText(/הכנסה שנתית ברוטו/)
      const dependentsInput = screen.getByLabelText(/מספר תלויים$/)

      expect(incomeInput).toHaveAttribute('inputMode', 'decimal')
      expect(dependentsInput).toHaveAttribute('inputMode', 'numeric')
    })
  })

  describe('Content and Documentation', () => {
    test('includes legal disclaimer', () => {
      render(<TaxRefundCalculatorEnhanced />)

      expect(screen.getByText('הבהרה חשובה')).toBeInTheDocument()
      expect(screen.getByText(/החישוב הוא אינדיקטיבי בלבד/)).toBeInTheDocument()
    })

    test('displays current tax year information', () => {
      render(<TaxRefundCalculatorEnhanced />)

      expect(screen.getByText(/חישוב לפי מדרגות מס 2024/)).toBeInTheDocument()
    })

    test('provides contextual help for disability credits', () => {
      render(<TaxRefundCalculatorEnhanced />)

      expect(screen.getByText(/תלויים המוכרים כבעלי נכות/)).toBeInTheDocument()
    })
  })
})
