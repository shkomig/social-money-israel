import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import EarlyRepaymentEstimator from '@/components/calculators/EarlyRepaymentEstimator'

// Mock the finance context
jest.mock('@/lib/finance/context', () => ({
  useFinance: () => ({
    setCalculators: jest.fn()
  })
}))

describe('EarlyRepaymentEstimator', () => {
  it('renders the component', () => {
    render(<EarlyRepaymentEstimator />)
    expect(screen.getByText('אומדן עמלת פירעון מוקדם')).toBeInTheDocument()
  })

  it('has RTL direction', () => {
    render(<EarlyRepaymentEstimator />)
    const container = document.querySelector('[dir="rtl"]')
    expect(container).toBeInTheDocument()
  })

  it('displays form elements', () => {
    render(<EarlyRepaymentEstimator />)
    expect(screen.getByLabelText('יתרת קרן (₪)')).toBeInTheDocument()
    expect(screen.getByLabelText('ריבית נוכחית (%)')).toBeInTheDocument()
  })
})
