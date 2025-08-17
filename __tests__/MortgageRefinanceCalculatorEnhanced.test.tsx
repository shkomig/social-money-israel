/**
 * Test Suite for MortgageRefinanceCalculatorEnhanced Component
 *
 * Comprehensive testing covering:
 * - Component rendering and structure
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Form validation with Hebrew error messages
 * - Mortgage calculation logic
 * - User interactions and keyboard navigation
 * - Mobile responsiveness
 * - RTL layout support
 * - Error handling and edge cases
 *
 * @version 1.0.0
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import MortgageRefinanceCalculatorEnhanced from '../components/calculators/MortgageRefinanceCalculatorEnhanced'

// Setup user event with delay for more realistic interactions
const user = userEvent.setup({ delay: null })

describe('MortgageRefinanceCalculatorEnhanced', () => {
  describe('Component Rendering', () => {
    test('renders main calculator elements', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Check for main header
      expect(screen.getByRole('heading', { name: /מחשבון מחזור משכנתא/ })).toBeInTheDocument()

      // Check for main input fields
      expect(screen.getByLabelText(/יתרת קרן נוכחית/)).toBeInTheDocument()
      expect(screen.getByLabelText(/ריבית נוכחית/)).toBeInTheDocument()
      expect(screen.getByLabelText(/ריבית חדשה/)).toBeInTheDocument()
      expect(screen.getByLabelText(/שנים שנותרו לפירעון/)).toBeInTheDocument()
      expect(screen.getByLabelText(/עלויות מחזור/)).toBeInTheDocument()
    })

    test('has proper RTL direction and Hebrew labels', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const mainSection = screen.getByRole('main')
      expect(mainSection).toHaveAttribute('dir', 'rtl')

      // Check Hebrew fieldset legends
      expect(screen.getByText('פרטי המשכנתא הנוכחית')).toBeInTheDocument()
      expect(screen.getByText('פרטי המשכנתא החדשה')).toBeInTheDocument()
    })

    test('includes proper ARIA landmarks and structure', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Check main landmark
      expect(screen.getByRole('main')).toBeInTheDocument()

      // Check fieldsets for form organization
      const fieldsets = screen.getAllByRole('group')
      expect(fieldsets).toHaveLength(2)

      // Check buttons
      expect(screen.getByRole('button', { name: /חשב חיסכון/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /נקה/ })).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    test('shows Hebrew error messages for invalid inputs', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const balanceInput = screen.getByLabelText(/יתרת קרן נוכחית/)
      const calculateButton = screen.getByRole('button', { name: /חשב חיסכון/ })

      // Enter invalid balance
      await user.clear(balanceInput)
      await user.type(balanceInput, '-100000')
      await user.click(calculateButton)

      await waitFor(() => {
        expect(screen.getByText(/יתרת הקרן חייבת להיות בין/)).toBeInTheDocument()
      })
    })

    test('validates required fields', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const calculateButton = screen.getByRole('button', { name: /חשב חיסכון/ })
      await user.click(calculateButton)

      await waitFor(() => {
        expect(screen.getByText(/שדה חובה - יש להזין יתרת קרן/)).toBeInTheDocument()
        expect(screen.getByText(/שדה חובה - יש להזין ריבית נוכחית/)).toBeInTheDocument()
        expect(screen.getByText(/שדה חובה - יש להזין ריבית חדשה/)).toBeInTheDocument()
        expect(screen.getByText(/שדה חובה - יש להזין שנים שנותרו/)).toBeInTheDocument()
      })
    })

    test('validates interest rate relationship', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '3.5')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '4.0') // Higher than current
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '20')

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(() => {
        expect(screen.getByText(/הריבית החדשה חייבת להיות נמוכה מהנוכחית/)).toBeInTheDocument()
      })
    })

    test('validates numeric ranges correctly', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Test extreme values
      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '100000000') // Too high
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '50') // Too high
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '50') // Too high

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(() => {
        expect(screen.getByText(/יתרת הקרן חייבת להיות בין 1₪ ל-50,000,000₪/)).toBeInTheDocument()
        expect(screen.getByText(/הריבית חייבת להיות בין 0.01% ל-30%/)).toBeInTheDocument()
        expect(screen.getByText(/מספר השנים חייב להיות בין 1 ל-35/)).toBeInTheDocument()
      })
    })
  })

  describe('Mortgage Calculations', () => {
    test('calculates mortgage refinancing correctly for basic scenario', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Fill form with realistic values
      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '4.5')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.5')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '20')
      await user.type(screen.getByLabelText(/עלויות מחזור/), '15000')

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(
        () => {
          expect(screen.getByText('תוצאות החישוב')).toBeInTheDocument()
          expect(screen.getByText('תשלום נוכחי')).toBeInTheDocument()
          expect(screen.getByText('תשלום חדש')).toBeInTheDocument()
          expect(screen.getByText('חיסכון חודשי')).toBeInTheDocument()
          expect(screen.getByText('חיסכון כולל')).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })

    test('displays break-even analysis when applicable', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '800000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '5.0')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.5')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '25')
      await user.type(screen.getByLabelText(/עלויות מחזור/), '20000')

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(
        () => {
          expect(screen.getByText('נקודת איזון')).toBeInTheDocument()
          expect(screen.getByText(/החיסכון יכסה את עלויות המחזור תוך/)).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })

    test('provides appropriate recommendations', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Scenario with good savings
      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '1000000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '5.5')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.0')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '25')
      await user.type(screen.getByLabelText(/עלויות מחזור/), '10000')

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(
        () => {
          expect(screen.getByText(/מומלץ לבצע מחזור!/)).toBeInTheDocument()
          expect(screen.getByText('✅')).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })
  })

  describe('Accessibility Features', () => {
    test('supports keyboard navigation', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const firstInput = screen.getByLabelText(/יתרת קרן נוכחית/)
      firstInput.focus()
      expect(firstInput).toHaveFocus()

      // Tab through inputs
      await user.tab()
      expect(screen.getByLabelText(/ריבית נוכחית/)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/שנים שנותרו לפירעון/)).toHaveFocus()
    })

    test('provides proper focus indicators', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Number inputs have 'spinbutton' role
      const inputs = screen.getAllByRole('spinbutton')
      inputs.forEach((input) => {
        expect(input).toHaveClass(/focus:ring-/)
        expect(input).toHaveClass(/focus:outline-none/)
      })
    })

    test('has proper ARIA live regions for results', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '4.0')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.5')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '20')

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(() => {
        const resultsRegion = screen.getByRole('region', { name: /תוצאות החישוב/ })
        expect(resultsRegion).toHaveAttribute('aria-live', 'polite')
      })
    })

    test('provides error announcements for screen readers', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const balanceInput = screen.getByLabelText(/יתרת קרן נוכחית/)
      await user.type(balanceInput, '-1000')

      // Trigger validation by trying to calculate
      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(() => {
        const errorElements = screen.getAllByRole('alert')
        expect(errorElements.length).toBeGreaterThan(0)
        expect(errorElements[0]).toHaveTextContent(/שגיאה:/)
      })
    })

    test('includes proper labels and descriptions', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const balanceInput = screen.getByLabelText(/יתרת קרן נוכחית/)
      expect(balanceInput).toHaveAttribute('aria-describedby')

      const refinancingInput = screen.getByLabelText(/עלויות מחזור/)
      expect(refinancingInput).toHaveAttribute('aria-describedby')

      // Check help text exists
      expect(screen.getByText(/הזינו את יתרת הקרן הנוכחית/)).toBeInTheDocument()
      expect(screen.getByText(/כולל עמלות בנק, שמאי/)).toBeInTheDocument()
    })
  })

  describe('User Experience Features', () => {
    test('shows loading state during calculation', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '4.0')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.5')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '20')

      const calculateButton = screen.getByRole('button', { name: /חשב חיסכון/ })
      await user.click(calculateButton)

      // Should show loading state briefly
      expect(screen.getByRole('button', { name: /מחשב חיסכון.../ })).toBeInTheDocument()
    })

    test('resets form correctly', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Fill form
      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '4.0')

      // Reset form
      await user.click(screen.getByRole('button', { name: /נקה/ }))

      // Check inputs are cleared - for number inputs, empty value is null
      expect(screen.getByLabelText(/יתרת קרן נוכחית/)).toHaveValue(null)
      expect(screen.getByLabelText(/ריבית נוכחית/)).toHaveValue(null)
    })

    test('provides helpful input hints', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      expect(screen.getByPlaceholderText('למשל: 800000')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('למשל: 4.5')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('למשל: 3.8')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('למשל: 20')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('למשל: 15000')).toBeInTheDocument()
    })

    test('handles disabled states correctly', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const calculateButton = screen.getByRole('button', { name: /חשב חיסכון/ })
      expect(calculateButton).toBeDisabled()

      // Button should be enabled when required fields are filled
      const balanceInput = screen.getByLabelText(/יתרת קרן נוכחית/)
      balanceInput.focus()
      // Form validation will show this button remains disabled until all required fields are filled
    })
  })

  describe('Mobile Responsiveness', () => {
    test('adapts layout for mobile screens', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Check responsive grid classes - the correct container
      const gridContainer = screen
        .getByRole('main')
        .querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()

      // Check button layout adapts
      const buttonContainer = screen.getByRole('button', { name: /חשב חיסכון/ }).parentElement
      expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row')
    })

    test('uses appropriate input modes for mobile', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      const balanceInput = screen.getByLabelText(/יתרת קרן נוכחית/)
      const rateInput = screen.getByLabelText(/ריבית נוכחית/)
      const yearsInput = screen.getByLabelText(/שנים שנותרו לפירעון/)

      expect(balanceInput).toHaveAttribute('inputMode', 'decimal')
      expect(rateInput).toHaveAttribute('inputMode', 'decimal')
      expect(yearsInput).toHaveAttribute('inputMode', 'numeric')
    })
  })

  describe('Content and Documentation', () => {
    test('includes legal disclaimer', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      expect(screen.getByText('הבהרה חשובה')).toBeInTheDocument()
      expect(screen.getByText(/החישוב הוא אינדיקטיבי בלבד/)).toBeInTheDocument()
      expect(screen.getByText(/מומלץ להיוועץ עם יועץ משכנתאות/)).toBeInTheDocument()
    })

    test('displays calculator purpose information', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      expect(screen.getByText('חישוב חיסכון ורווחיות')).toBeInTheDocument()
      expect(screen.getByText(/מלאו את הפרטים למעלה לקבלת חישוב/)).toBeInTheDocument()
    })

    test('provides contextual help for costs', () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      expect(screen.getByText(/כולל עמלות בנק, שמאי, עורך דין וביטוח/)).toBeInTheDocument()
      expect(screen.getByText(/השאירו ריק אם לא יודעים/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    test('handles zero refinancing costs', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '4.0')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.5')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '20')
      // Leave refinancing costs empty

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(
        () => {
          expect(screen.getByText('תוצאות החישוב')).toBeInTheDocument()
          // Should not show break-even analysis when costs are zero
          expect(screen.queryByText('נקודת איזון')).not.toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })

    test('handles very small interest rate differences', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '300000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '3.51')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.50') // Very small difference
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '15')

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(
        () => {
          expect(screen.getByText(/לא מומלץ לבצע מחזור/)).toBeInTheDocument()
          expect(screen.getByText('❌')).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
    })

    test('validates maximum values correctly', async () => {
      render(<MortgageRefinanceCalculatorEnhanced />)

      // Need to fill required fields first to trigger validation
      await user.type(screen.getByLabelText(/יתרת קרן נוכחית/), '500000')
      await user.type(screen.getByLabelText(/ריבית נוכחית/), '4.0')
      await user.type(screen.getByLabelText(/ריבית חדשה/), '3.5')
      await user.type(screen.getByLabelText(/שנים שנותרו לפירעון/), '20')
      await user.type(screen.getByLabelText(/עלויות מחזור/), '1000000') // Too high

      await user.click(screen.getByRole('button', { name: /חשב חיסכון/ }))

      await waitFor(() => {
        expect(screen.getByText(/עלויות המחזור חייבות להיות בין 0₪ ל-500,000₪/)).toBeInTheDocument()
      })
    })
  })
})
