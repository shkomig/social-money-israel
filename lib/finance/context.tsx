'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type CalculatorsState = {
  earlyRepaymentMonthlySaving?: number
  earlyRepaymentEstimatedFee?: number
}

export type FinanceContextValue = {
  calculators: CalculatorsState
  setCalculators: (next: Partial<CalculatorsState>) => void
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [calculators, setCalc] = useState<CalculatorsState>({})
  const value = useMemo<FinanceContextValue>(
    () => ({
      calculators,
      setCalculators: (next) => setCalc((prev) => ({ ...prev, ...next })),
    }),
    [calculators],
  )
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
