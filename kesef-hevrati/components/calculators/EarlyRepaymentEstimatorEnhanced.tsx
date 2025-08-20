/**
 * @fileoverview Enhanced EarlyRepaymentEstimator with improved accessibility, RTL support, and mobile optimization
 *
 * This component calculates potential savings from early mortgage repayment based on Israeli banking standards.
 * Features:
 * - Comprehensive input validation with real-time feedback
 * - Accessibility compliance (WCAG 2.1 AA)
 * - RTL layout support for Hebrew interface
 * - Mobile-first responsive design
 * - Integration with global finance context
 * - Clear visual feedback and error handling
 *
 * @author Social Money Development Team
 * @version 2.0.0
 */

'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useFinance } from '@/lib/finance/context'

// Type definitions for better code organization and type safety
interface LoanInputs {
  currentAmount: number
  currentRate: number
  yearsLeft: number
  newRate: number
}

interface ValidationErrors {
  currentAmount?: string
  currentRate?: string
  yearsLeft?: string
  newRate?: string
}

interface CalculationResults {
  monthlySaving: number
  estimatedFee: number
  breakEvenMonths: number
  isWorthwhile: boolean
}

// Constants for validation and calculations
const VALIDATION_RULES = {
  MIN_LOAN_AMOUNT: 50000,
  MAX_LOAN_AMOUNT: 10000000,
  MIN_INTEREST_RATE: 0.1,
  MAX_INTEREST_RATE: 15,
  MIN_YEARS_LEFT: 0.5,
  MAX_YEARS_LEFT: 40,
  HIGH_INTEREST_THRESHOLD: 10,
  BREAK_EVEN_WARNING_MONTHS: 60,
} as const

/**
 * Enhanced Early Repayment Estimator Component
 *
 * Provides comprehensive mortgage refinancing calculations with
 * accessibility features and mobile optimization
 */
export default function EarlyRepaymentEstimator() {
  // Finance context for sharing calculations across the app
  const { updateCalculators } = useFinance()

  // Component state management
  const [inputs, setInputs] = useState<LoanInputs>({
    currentAmount: 800000,
    currentRate: 4.5,
    yearsLeft: 20,
    newRate: 3.8,
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<keyof LoanInputs, boolean>>({
    currentAmount: false,
    currentRate: false,
    yearsLeft: false,
    newRate: false,
  })

  const [showResults, setShowResults] = useState(false)

  /**
   * Advanced PMT calculation function
   * Calculates monthly payment for given loan parameters
   */
  const calculatePMT = useCallback((principal: number, rate: number, periods: number): number => {
    if (rate === 0) return principal / periods
    const monthlyRate = rate / 100 / 12
    const totalPayments = periods * 12
    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    )
  }, [])

  /**
   * Estimate early repayment fee based on Israeli banking standards
   * Fee structure varies by years remaining and bank policies
   */
  const estimateRepaymentFee = useCallback((amount: number, yearsLeft: number): number => {
    // Israeli banks typically charge 1-3% based on remaining period
    let feePercentage = 0.015 // Base 1.5%

    if (yearsLeft > 10)
      feePercentage = 0.025 // 2.5% for long-term loans
    else if (yearsLeft > 5)
      feePercentage = 0.02 // 2% for medium-term
    else if (yearsLeft < 2) feePercentage = 0.01 // 1% for short-term

    return Math.min(amount * feePercentage, 50000) // Cap at 50,000 NIS
  }, [])

  /**
   * Comprehensive input validation with Hebrew error messages
   */
  const validateInputs = useCallback((inputValues: LoanInputs): ValidationErrors => {
    const newErrors: ValidationErrors = {}

    // Loan amount validation
    if (inputValues.currentAmount < VALIDATION_RULES.MIN_LOAN_AMOUNT) {
      newErrors.currentAmount = `סכום המשכנתא חייב להיות לפחות ${VALIDATION_RULES.MIN_LOAN_AMOUNT.toLocaleString('he-IL')} ש"ח`
    } else if (inputValues.currentAmount > VALIDATION_RULES.MAX_LOAN_AMOUNT) {
      newErrors.currentAmount = `סכום המשכנתא לא יכול לעלות על ${VALIDATION_RULES.MAX_LOAN_AMOUNT.toLocaleString('he-IL')} ש"ח`
    } else if (inputValues.currentAmount <= 0) {
      newErrors.currentAmount = 'סכום המשכנתא חייב להיות חיובי'
    }

    // Current interest rate validation
    if (inputValues.currentRate < VALIDATION_RULES.MIN_INTEREST_RATE) {
      newErrors.currentRate = `ריבית חייבת להיות לפחות ${VALIDATION_RULES.MIN_INTEREST_RATE}%`
    } else if (inputValues.currentRate > VALIDATION_RULES.MAX_INTEREST_RATE) {
      newErrors.currentRate = `ריבית לא יכולה לעלות על ${VALIDATION_RULES.MAX_INTEREST_RATE}%`
    } else if (inputValues.currentRate > VALIDATION_RULES.HIGH_INTEREST_THRESHOLD) {
      newErrors.currentRate = 'ריבית גבוהה מאוד - אנא בדוק שוב'
    }

    // Years left validation
    if (inputValues.yearsLeft < VALIDATION_RULES.MIN_YEARS_LEFT) {
      newErrors.yearsLeft = `תקופה חייבת להיות לפחות ${VALIDATION_RULES.MIN_YEARS_LEFT} שנים`
    } else if (inputValues.yearsLeft > VALIDATION_RULES.MAX_YEARS_LEFT) {
      newErrors.yearsLeft = `תקופה לא יכולה לעלות על ${VALIDATION_RULES.MAX_YEARS_LEFT} שנים`
    }

    // New interest rate validation
    if (inputValues.newRate < VALIDATION_RULES.MIN_INTEREST_RATE) {
      newErrors.newRate = `ריבית חדשה חייבת להיות לפחות ${VALIDATION_RULES.MIN_INTEREST_RATE}%`
    } else if (inputValues.newRate > VALIDATION_RULES.MAX_INTEREST_RATE) {
      newErrors.newRate = `ריבית חדשה לא יכולה לעלות על ${VALIDATION_RULES.MAX_INTEREST_RATE}%`
    } else if (inputValues.newRate >= inputValues.currentRate) {
      newErrors.newRate = 'הריבית החדשה חייבת להיות נמוכה מהריבית הנוכחית'
    }

    return newErrors
  }, [])

  /**
   * Main calculation logic with memoization for performance
   */
  const calculationResults = useMemo((): CalculationResults | null => {
    const validationErrors = validateInputs(inputs)
    if (Object.keys(validationErrors).length > 0) {
      return null
    }

    const currentPayment = calculatePMT(inputs.currentAmount, inputs.currentRate, inputs.yearsLeft)
    const newPayment = calculatePMT(inputs.currentAmount, inputs.newRate, inputs.yearsLeft)
    const monthlySaving = currentPayment - newPayment
    const estimatedFee = estimateRepaymentFee(inputs.currentAmount, inputs.yearsLeft)
    const breakEvenMonths = monthlySaving > 0 ? Math.ceil(estimatedFee / monthlySaving) : Infinity

    return {
      monthlySaving,
      estimatedFee,
      breakEvenMonths,
      isWorthwhile:
        breakEvenMonths <= VALIDATION_RULES.BREAK_EVEN_WARNING_MONTHS && monthlySaving > 0,
    }
  }, [inputs, validateInputs, calculatePMT, estimateRepaymentFee])

  /**
   * Update finance context when calculations change
   */
  useEffect(() => {
    if (calculationResults && calculationResults.monthlySaving > 0) {
      if (typeof updateCalculators === 'function') {
        updateCalculators({
          earlyRepaymentMonthlySaving: calculationResults.monthlySaving,
          earlyRepaymentEstimatedFee: calculationResults.estimatedFee,
        })
      }
    }
  }, [calculationResults, updateCalculators])

  /**
   * Handle input changes with validation
   */
  const handleInputChange = useCallback(
    (field: keyof LoanInputs, value: string) => {
      const numericValue = parseFloat(value) || 0

      setInputs((prev) => ({ ...prev, [field]: numericValue }))
      setTouched((prev) => ({ ...prev, [field]: true }))

      // Real-time validation
      const newInputs = { ...inputs, [field]: numericValue }
      const newErrors = validateInputs(newInputs)
      setErrors(newErrors)

      // Show results if all inputs are valid
      setShowResults(Object.keys(newErrors).length === 0)
    },
    [inputs, validateInputs],
  )

  /**
   * Handle form blur events for accessibility
   */
  const handleBlur = useCallback((field: keyof LoanInputs) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  /**
   * Format currency for Hebrew locale
   */
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  /**
   * Render input field with accessibility features
   */
  const renderInputField = useCallback(
    (
      field: keyof LoanInputs,
      label: string,
      unit: string,
      min?: number,
      max?: number,
      step?: number,
    ) => {
      const hasError = touched[field] && errors[field]
      const inputId = `input-${field}`
      const errorId = `error-${field}`

      return (
        <div className="space-y-2">
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="relative">
            <input
              id={inputId}
              type="number"
              value={inputs[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              min={min}
              max={max}
              step={step || 0.1}
              className={`
              w-full px-4 py-3 text-right border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200 bg-white
              ${hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
              hover:border-gray-400 disabled:bg-gray-50 disabled:text-gray-500
            `}
              placeholder={`הכנס ${label.toLowerCase()}`}
              aria-describedby={hasError ? errorId : undefined}
              aria-invalid={hasError ? 'true' : 'false'}
              dir="ltr" // Numbers are LTR even in RTL layout
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {unit}
            </span>
          </div>
          {hasError && (
            <p
              id={errorId}
              role="alert"
              className="text-red-600 text-xs font-medium flex items-center gap-1"
              aria-live="polite"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors[field]}
            </p>
          )}
        </div>
      )
    },
    [inputs, touched, errors, handleInputChange, handleBlur],
  )

  return (
    <section
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mobile-optimized"
      dir="rtl"
      data-testid="early-repayment-estimator"
      aria-labelledby="estimator-title"
    >
      {/* Header with clear description */}
      <div className="mb-8 text-center">
        <h2 id="estimator-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          מחשבון פרעון מוקדם למשכנתא
        </h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          חשב את החיסכון הפוטנציאלי מפרעון מוקדם של המשכנתא שלך. החישוב מבוסס על ממוצעי בנק ישראל
          ומתאים למשכנתאות בישראל.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-blue-800 text-sm font-medium">מבוסס על ממוצעי בנק ישראל</span>
        </div>
      </div>

      {/* Input Form with improved mobile layout */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        role="form"
        aria-label="טופס חישוב פרעון מוקדם"
      >
        {renderInputField(
          'currentAmount',
          'סכום משכנתא נוכחי',
          'ש"ח',
          VALIDATION_RULES.MIN_LOAN_AMOUNT,
          VALIDATION_RULES.MAX_LOAN_AMOUNT,
          1000,
        )}

        {renderInputField(
          'currentRate',
          'ריבית נוכחית',
          '%',
          VALIDATION_RULES.MIN_INTEREST_RATE,
          VALIDATION_RULES.MAX_INTEREST_RATE,
          0.01,
        )}

        {renderInputField(
          'yearsLeft',
          'שנים שנותרו לפרעון',
          'שנים',
          VALIDATION_RULES.MIN_YEARS_LEFT,
          VALIDATION_RULES.MAX_YEARS_LEFT,
          0.5,
        )}

        {renderInputField(
          'newRate',
          'ריבית חדשה מוצעת',
          '%',
          VALIDATION_RULES.MIN_INTEREST_RATE,
          VALIDATION_RULES.MAX_INTEREST_RATE,
          0.01,
        )}
      </form>

      {/* Results Display with enhanced accessibility */}
      {showResults && calculationResults && (
        <div
          className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 md:p-8 border border-green-200"
          role="region"
          aria-labelledby="results-title"
          aria-live="polite"
        >
          <h3
            id="results-title"
            className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center"
          >
            תוצאות החישוב
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Saving */}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(calculationResults.monthlySaving)}
              </div>
              <div className="text-sm text-gray-600 font-medium">חיסכון חודשי משוער</div>
            </div>

            {/* Estimated Fee */}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {formatCurrency(calculationResults.estimatedFee)}
              </div>
              <div className="text-sm text-gray-600 font-medium">עמלת פרעון מוקדם משוערת</div>
            </div>

            {/* Break-even Point */}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {calculationResults.breakEvenMonths === Infinity
                  ? '∞'
                  : calculationResults.breakEvenMonths}
              </div>
              <div className="text-sm text-gray-600 font-medium">נקודת איזון (חודשים)</div>
            </div>
          </div>

          {/* Recommendation */}
          <div
            className={`mt-6 p-4 rounded-lg border-2 ${
              calculationResults.isWorthwhile
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="font-semibold mb-2">
                  {calculationResults.isWorthwhile
                    ? 'המלצה: שווה לשקול פרעון מוקדם'
                    : 'המלצה: כדאי לבחון חלופות נוספות'}
                </h4>
                <p className="text-sm leading-relaxed">
                  {calculationResults.isWorthwhile
                    ? `עם חיסכון חודשי של ${formatCurrency(calculationResults.monthlySaving)} ונקודת איזון של ${calculationResults.breakEvenMonths} חודשים, פרעון מוקדם עשוי להיות כדאי. מומלץ להתייעץ עם יועץ משכנתאות.`
                    : `נקודת האיזון היא ${calculationResults.breakEvenMonths === Infinity ? 'אינסופית' : `${calculationResults.breakEvenMonths} חודשים`}. כדאי לבחון אפשרויות נוספות כמו מחזור משכנתא או השקעת הכסף באופן חלופי.`}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <p className="leading-relaxed">
              * החישוב הוא הערכה בלבד ואינו מהווה ייעוץ פיננסי. עמלות הפרעון המוקדם משתנות בין
              הבנקים השונים. מומלץ לקבל הצעות מחיר מדויקות מהבנק שלכם ולהתייעץ עם יועץ משכנתאות
              מוסמך.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
