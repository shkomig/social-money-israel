'use client'

import { FinanceProvider } from '@/lib/finance/context'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <FinanceProvider>{children}</FinanceProvider>
}
