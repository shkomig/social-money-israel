'use client'

/**
 * Enhanced Mortgage Refinance Calculator Component
 *
 * Features:
 * - Full WCAG 2.1 AA accessibility compliance
 * - Hebrew language support with RTL layout
 * - Comprehensive form validation with Hebrew error messages
 * - Keyboard navigation support
 * - Screen reader friendly ARIA attributes
 * - Mobile-first responsive design
 * - Real-time calculation with loading states
 * - Israeli banking context and terminology
 *
 * @component MortgageRefinanceCalculatorEnhanced
 * @version 1.0.0
 * @author Kesef Hevrati Development Team
 */

import { useState, useCallback } from 'react'

// Types for component state and validation
interface MortgageResults {
  currentMonthlyPayment: number
  newMonthlyPayment: number
  monthlySavings: number
  totalSavings: number
  breakEvenMonths: number
  isWorthwhile: boolean
  savingsPercentage: number
}

interface ValidationErrors {
  currentBalance?: string
  currentRate?: string
  newRate?: string
  remainingYears?: string
  refinancingCosts?: string
}

type FocusedField =
  | 'currentBalance'
  | 'currentRate'
  | 'newRate'
  | 'remainingYears'
  | 'refinancingCosts'
  | null

/**
 * Enhanced Mortgage Refinance Calculator Component
 * Provides comprehensive mortgage refinancing calculations with full accessibility support
 */
export default function MortgageRefinanceCalculatorEnhanced() {
  // Form state management
  const [currentBalance, setCurrentBalance] = useState('')
  const [currentRate, setCurrentRate] = useState('')
  const [newRate, setNewRate] = useState('')
  const [remainingYears, setRemainingYears] = useState('')
  const [refinancingCosts, setRefinancingCosts] = useState('')

  // UI state management
  const [results, setResults] = useState<MortgageResults | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [focusedField, setFocusedField] = useState<FocusedField>(null)

  /**
   * Validates form inputs with Hebrew error messages
   * @param values - Object containing form values to validate
   * @returns Object containing validation errors
   */
  const validateInputs = useCallback(
    (values: {
      currentBalance: string
      currentRate: string
      newRate: string
      remainingYears: string
      refinancingCosts: string
    }): ValidationErrors => {
      const newErrors: ValidationErrors = {}

      // Current balance validation
      const balance = parseFloat(values.currentBalance)
      if (!values.currentBalance.trim()) {
        newErrors.currentBalance = 'שדה חובה - יש להזין יתרת קרן'
      } else if (balance <= 0 || balance > 50000000) {
        newErrors.currentBalance = 'יתרת הקרן חייבת להיות בין 1₪ ל-50,000,000₪'
      }

      // Current rate validation
      const currentR = parseFloat(values.currentRate)
      if (!values.currentRate.trim()) {
        newErrors.currentRate = 'שדה חובה - יש להזין ריבית נוכחית'
      } else if (currentR <= 0 || currentR > 30) {
        newErrors.currentRate = 'הריבית חייבת להיות בין 0.01% ל-30%'
      }

      // New rate validation
      const newR = parseFloat(values.newRate)
      if (!values.newRate.trim()) {
        newErrors.newRate = 'שדה חובה - יש להזין ריבית חדשה'
      } else if (newR <= 0 || newR > 30) {
        newErrors.newRate = 'הריבית חייבת להיות בין 0.01% ל-30%'
      } else if (newR >= currentR) {
        newErrors.newRate = 'הריבית החדשה חייבת להיות נמוכה מהנוכחית'
      }

      // Remaining years validation
      const years = parseFloat(values.remainingYears)
      if (!values.remainingYears.trim()) {
        newErrors.remainingYears = 'שדה חובה - יש להזין שנים שנותרו'
      } else if (years < 1 || years > 35) {
        newErrors.remainingYears = 'מספר השנים חייב להיות בין 1 ל-35'
      }

      // Refinancing costs validation (optional but if provided, must be valid)
      if (values.refinancingCosts.trim()) {
        const costs = parseFloat(values.refinancingCosts)
        if (costs < 0 || costs > 500000) {
          newErrors.refinancingCosts = 'עלויות המחזור חייבות להיות בין 0₪ ל-500,000₪'
        }
      }

      return newErrors
    },
    [],
  )

  /**
   * Calculates monthly mortgage payment using standard formula
   * @param principal - Loan principal amount
   * @param annualRate - Annual interest rate (percentage)
   * @param years - Loan term in years
   * @returns Monthly payment amount
   */
  const calculateMortgagePayment = useCallback(
    (principal: number, annualRate: number, years: number): number => {
      const monthlyRate = annualRate / 100 / 12
      const numberOfPayments = years * 12

      // Handle zero interest rate case
      if (monthlyRate === 0) {
        return principal / numberOfPayments
      }

      // Standard mortgage payment formula
      return (
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      )
    },
    [],
  )

  /**
   * Main calculation function for mortgage refinancing analysis
   */
  const calculateRefinancing = useCallback(async () => {
    const formValues = {
      currentBalance,
      currentRate,
      newRate,
      remainingYears,
      refinancingCosts,
    }

    // Validate inputs
    const validationErrors = validateInputs(formValues)
    setErrors(validationErrors)

    // Stop if validation fails
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    // Start calculation with loading state
    setIsCalculating(true)

    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Parse values
      const balance = parseFloat(currentBalance)
      const currentR = parseFloat(currentRate)
      const newR = parseFloat(newRate)
      const years = parseFloat(remainingYears)
      const costs = parseFloat(refinancingCosts) || 0

      // Calculate payments
      const currentMonthlyPayment = calculateMortgagePayment(balance, currentR, years)
      const newMonthlyPayment = calculateMortgagePayment(balance, newR, years)
      const monthlySavings = currentMonthlyPayment - newMonthlyPayment
      const totalSavings = monthlySavings * years * 12 - costs
      const breakEvenMonths = costs > 0 ? costs / monthlySavings : 0
      const savingsPercentage = (monthlySavings / currentMonthlyPayment) * 100

      // Israeli banking recommendation logic
      const isWorthwhile = monthlySavings > 500 && totalSavings > 0 && breakEvenMonths < 24

      const calculatedResults: MortgageResults = {
        currentMonthlyPayment,
        newMonthlyPayment,
        monthlySavings,
        totalSavings,
        breakEvenMonths,
        isWorthwhile,
        savingsPercentage,
      }

      setResults(calculatedResults)
    } catch (error) {
      console.error('Calculation error:', error)
    } finally {
      setIsCalculating(false)
    }
  }, [
    currentBalance,
    currentRate,
    newRate,
    remainingYears,
    refinancingCosts,
    validateInputs,
    calculateMortgagePayment,
  ])

  /**
   * Resets form to initial state
   */
  const resetForm = useCallback(() => {
    setCurrentBalance('')
    setCurrentRate('')
    setNewRate('')
    setRemainingYears('')
    setRefinancingCosts('')
    setResults(null)
    setErrors({})
    setFocusedField(null)
  }, [])

  /**
   * Handles keyboard navigation
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action?: () => void) => {
    if (e.key === 'Enter' && action) {
      e.preventDefault()
      action()
    }
  }, [])

  /**
   * Formats currency in Israeli Shekel format
   */
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  /**
   * Formats percentage values
   */
  const formatPercentage = useCallback((value: number): string => {
    return `${value.toFixed(1)}%`
  }, [])

  // Check if form can be calculated
  const canCalculate = currentBalance && currentRate && newRate && remainingYears

  return (
    <section
      className="mx-auto max-w-screen-xl"
      dir="rtl"
      role="main"
      aria-labelledby="mortgage-refinance-calculator-title"
    >
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-l from-blue-50 to-indigo-50">
          <h1
            className="text-lg md:text-xl font-semibold text-gray-900"
            id="mortgage-refinance-calculator-title"
          >
            מחשבון מחזור משכנתא
          </h1>
          <span
            className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs text-gray-700 border border-gray-200"
            aria-label="מידע על מחשבון מחזור המשכנתא"
          >
            חישוב חיסכון ורווחיות
          </span>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Current Mortgage Section */}
            <fieldset className="space-y-4">
              <legend className="text-base font-medium text-gray-900 mb-4">
                פרטי המשכנתא הנוכחית
              </legend>

              {/* Current Balance Input */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="mortgage-current-balance"
                >
                  יתרת קרן נוכחית (₪) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50000000"
                  step="1000"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  onFocus={() => setFocusedField('currentBalance')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, canCalculate ? calculateRefinancing : undefined)
                  }
                  id="mortgage-current-balance"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.currentBalance ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    ${focusedField === 'currentBalance' ? 'bg-blue-50' : 'bg-white'}
                  `}
                  placeholder="למשל: 800000"
                  aria-describedby={`${errors.currentBalance ? 'current-balance-error' : ''} current-balance-help`}
                  aria-invalid={errors.currentBalance ? 'true' : 'false'}
                  inputMode="decimal"
                  required
                />
                {errors.currentBalance && (
                  <p className="mt-1 text-sm text-red-600" id="current-balance-error" role="alert">
                    <span className="font-medium">שגיאה:</span> {errors.currentBalance}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500" id="current-balance-help">
                  הזינו את יתרת הקרן הנוכחית של המשכנתא
                </p>
              </div>

              {/* Current Rate Input */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="mortgage-current-rate"
                >
                  ריבית נוכחית (%) *
                </label>
                <input
                  type="number"
                  min="0.01"
                  max="30"
                  step="0.01"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(e.target.value)}
                  onFocus={() => setFocusedField('currentRate')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, canCalculate ? calculateRefinancing : undefined)
                  }
                  id="mortgage-current-rate"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.currentRate ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    ${focusedField === 'currentRate' ? 'bg-blue-50' : 'bg-white'}
                  `}
                  placeholder="למשל: 4.5"
                  aria-describedby={`${errors.currentRate ? 'current-rate-error' : ''} current-rate-help`}
                  aria-invalid={errors.currentRate ? 'true' : 'false'}
                  inputMode="decimal"
                  required
                />
                {errors.currentRate && (
                  <p className="mt-1 text-sm text-red-600" id="current-rate-error" role="alert">
                    <span className="font-medium">שגיאה:</span> {errors.currentRate}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500" id="current-rate-help">
                  הריבית השנתית הנוכחית של המשכנתא
                </p>
              </div>

              {/* Remaining Years Input */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="mortgage-remaining-years"
                >
                  שנים שנותרו לפירעון *
                </label>
                <input
                  type="number"
                  min="1"
                  max="35"
                  step="1"
                  value={remainingYears}
                  onChange={(e) => setRemainingYears(e.target.value)}
                  onFocus={() => setFocusedField('remainingYears')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, canCalculate ? calculateRefinancing : undefined)
                  }
                  id="mortgage-remaining-years"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.remainingYears ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    ${focusedField === 'remainingYears' ? 'bg-blue-50' : 'bg-white'}
                  `}
                  placeholder="למשל: 20"
                  aria-describedby={`${errors.remainingYears ? 'remaining-years-error' : ''} remaining-years-help`}
                  aria-invalid={errors.remainingYears ? 'true' : 'false'}
                  inputMode="numeric"
                  required
                />
                {errors.remainingYears && (
                  <p className="mt-1 text-sm text-red-600" id="remaining-years-error" role="alert">
                    <span className="font-medium">שגיאה:</span> {errors.remainingYears}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500" id="remaining-years-help">
                  מספר השנים שנותרו עד לסיום תקופת ההלוואה
                </p>
              </div>
            </fieldset>

            {/* New Mortgage Section */}
            <fieldset className="space-y-4">
              <legend className="text-base font-medium text-gray-900 mb-4">
                פרטי המשכנתא החדשה
              </legend>

              {/* New Rate Input */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="mortgage-new-rate"
                >
                  ריבית חדשה (%) *
                </label>
                <input
                  type="number"
                  min="0.01"
                  max="30"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  onFocus={() => setFocusedField('newRate')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, canCalculate ? calculateRefinancing : undefined)
                  }
                  id="mortgage-new-rate"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.newRate ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    ${focusedField === 'newRate' ? 'bg-green-50' : 'bg-white'}
                  `}
                  placeholder="למשל: 3.8"
                  aria-describedby={`${errors.newRate ? 'new-rate-error' : ''} new-rate-help`}
                  aria-invalid={errors.newRate ? 'true' : 'false'}
                  inputMode="decimal"
                  required
                />
                {errors.newRate && (
                  <p className="mt-1 text-sm text-red-600" id="new-rate-error" role="alert">
                    <span className="font-medium">שגיאה:</span> {errors.newRate}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500" id="new-rate-help">
                  הריבית השנתية המוצעת במחזור
                </p>
              </div>

              {/* Refinancing Costs Input */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  htmlFor="mortgage-refinancing-costs"
                >
                  עלויות מחזור (₪)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500000"
                  step="100"
                  value={refinancingCosts}
                  onChange={(e) => setRefinancingCosts(e.target.value)}
                  onFocus={() => setFocusedField('refinancingCosts')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, canCalculate ? calculateRefinancing : undefined)
                  }
                  id="mortgage-refinancing-costs"
                  className={`w-full rounded-lg border px-4 py-3 text-base transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    ${errors.refinancingCosts ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                    ${focusedField === 'refinancingCosts' ? 'bg-green-50' : 'bg-white'}
                  `}
                  placeholder="למשל: 15000"
                  aria-describedby={`${errors.refinancingCosts ? 'refinancing-costs-error' : ''} refinancing-costs-help`}
                  aria-invalid={errors.refinancingCosts ? 'true' : 'false'}
                  inputMode="decimal"
                />
                {errors.refinancingCosts && (
                  <p
                    className="mt-1 text-sm text-red-600"
                    id="refinancing-costs-error"
                    role="alert"
                  >
                    <span className="font-medium">שגיאה:</span> {errors.refinancingCosts}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500" id="refinancing-costs-help">
                  כולל עמלות בנק, שמאי, עורך דין וביטוח. השאירו ריק אם לא יודעים
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={calculateRefinancing}
                  disabled={!canCalculate || isCalculating}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-base transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${
                      canCalculate && !isCalculating
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  type="button"
                  aria-label={isCalculating ? 'מחשב חיסכון...' : 'חשב חיסכון'}
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      מחשב...
                    </span>
                  ) : (
                    'חשב חיסכון'
                  )}
                </button>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium text-base
                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                    transition-all duration-200"
                  type="button"
                  aria-label="נקה את הטופס"
                >
                  נקה
                </button>
              </div>
            </fieldset>
          </div>

          {/* Results Section */}
          {results ? (
            <div
              className="border-t border-gray-200 pt-6"
              role="region"
              aria-labelledby="mortgage-results-title"
              aria-live="polite"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4" id="mortgage-results-title">
                תוצאות החישוב
              </h2>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                  <div className="text-sm text-red-600 font-medium mb-1">תשלום נוכחי</div>
                  <div className="text-xl font-bold text-red-700" dir="ltr">
                    {formatCurrency(results.currentMonthlyPayment)}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                  <div className="text-sm text-green-600 font-medium mb-1">תשלום חדש</div>
                  <div className="text-xl font-bold text-green-700" dir="ltr">
                    {formatCurrency(results.newMonthlyPayment)}
                  </div>
                </div>

                <div
                  className={`rounded-lg p-4 text-center border-2 ${
                    results.monthlySavings > 0
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      results.monthlySavings > 0 ? 'text-blue-600' : 'text-red-600'
                    }`}
                  >
                    חיסכון חודשי
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      results.monthlySavings > 0 ? 'text-blue-700' : 'text-red-700'
                    }`}
                    dir="ltr"
                  >
                    {formatCurrency(Math.abs(results.monthlySavings))}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {formatPercentage(Math.abs(results.savingsPercentage))}
                  </div>
                </div>

                <div
                  className={`rounded-lg p-4 text-center border-2 ${
                    results.totalSavings > 0
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      results.totalSavings > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    חיסכון כולל
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      results.totalSavings > 0 ? 'text-emerald-700' : 'text-red-700'
                    }`}
                    dir="ltr"
                  >
                    {formatCurrency(Math.abs(results.totalSavings))}
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>אחוז החיסכון</span>
                  <span>{formatPercentage(Math.abs(results.savingsPercentage))}</span>
                </div>
                <div
                  className="w-full bg-gray-200 rounded-full h-3"
                  role="progressbar"
                  aria-valuenow={Math.abs(results.savingsPercentage)}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      results.monthlySavings > 0
                        ? 'bg-gradient-to-r from-green-400 to-blue-500'
                        : 'bg-red-400'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.abs(results.savingsPercentage))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Break Even Analysis */}
              {results.breakEvenMonths > 0 && results.monthlySavings > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2">נקודת איזון</h3>
                  <p className="text-yellow-700">
                    החיסכון יכסה את עלויות המחזור תוך{' '}
                    <strong>{Math.ceil(results.breakEvenMonths)} חודשים</strong>
                    {results.breakEvenMonths > 24 && (
                      <span className="block text-sm mt-1">
                        ⚠️ תקופת החזר ארוכה - שקלו בעיון את הרווחיות
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              <div
                className={`rounded-lg p-4 border-2 ${
                  results.isWorthwhile ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {results.isWorthwhile ? '✅' : '❌'}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold mb-2 ${
                        results.isWorthwhile ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {results.isWorthwhile ? 'מומלץ לבצע מחזור!' : 'לא מומלץ לבצע מחזור'}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        results.isWorthwhile ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {results.isWorthwhile
                        ? `החיסכון החודשי של ${formatCurrency(results.monthlySavings)} והחיסכון הכולל של ${formatCurrency(results.totalSavings)} מצדיקים את המחזור.`
                        : results.monthlySavings <= 500
                          ? 'החיסכון החודשי נמוך מ-500₪ - לא מומלץ למחזור עבור חיסכון קטן.'
                          : results.breakEvenMonths > 24
                            ? 'תקופת החזר של עלויות המחזור ארוכה מדי.'
                            : 'החיסכון הכולל שלילי בגלל עלויות המחזור.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500" role="status">
              <svg
                className="mx-auto h-12 w-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="text-sm">מלאו את הפרטים למעלה לקבלת חישוב חיסכון במחזור משכנתא</p>
            </div>
          )}

          {/* Important Disclaimer */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 mt-6">
            <h3 className="text-sm font-medium text-amber-800 mb-2">הבהרה חשובה</h3>
            <p className="text-xs text-amber-700 leading-relaxed">
              החישוב הוא אינדיקטיבי בלבד ומבוסס על נתונים בסיסיים. העלויות הסופיות עלולות להיות
              שונות בהתאם לתנאי הבנק, מצבכם האישי והשינויים בשוק. מומלץ להיוועץ עם יועץ משכנתאות
              מוסמך לפני קבלת החלטות פיננסיות.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
