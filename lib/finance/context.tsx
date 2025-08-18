'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type CalculatorsState = {
  earlyRepaymentMonthlySaving?: number
  earlyRepaymentEstimatedFee?: number
}

export type FinanceContextValue = {
  calculators: CalculatorsState
  setCalculators: (next: Partial<CalculatorsState>) => void
  // Accept either a partial update or an updater function
  updateCalculators?: (
    arg: Partial<CalculatorsState> | ((prev: CalculatorsState) => CalculatorsState)
  ) => void
  // Optional dashboard updater for consumers that need to trigger dashboard-level updates
  updateDashboard?: (payload: Record<string, unknown> | null) => void
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [calculators, setCalc] = useState<CalculatorsState>({})
  // placeholder for dashboard state or other global finance data
  type DashboardState = Record<string, unknown> | null
  const [dashboardState, setDashboardState] = useState<DashboardState>(null)
  const value = useMemo<FinanceContextValue>(
    () => ({
      calculators,
      setCalculators: (next) => setCalc((prev) => ({ ...prev, ...next })),
      updateCalculators: (arg) => {
        if (typeof arg === 'function') {
          setCalc((prev) => ({ ...arg(prev) }))
        } else {
          setCalc((prev) => ({ ...prev, ...arg }))
        }
      },
      updateDashboard: (payload) => setDashboardState(payload),
    }),
    [calculators, dashboardState],
  )
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
