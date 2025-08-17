export type FamilyStatus = 'single' | 'married' | 'singleParent'
export type Employment = 'employed' | 'selfEmployed' | 'student' | 'unemployed'
export type Region = 'center' | 'periphery' | 'priorityA' | 'priorityB'

export type UserAnswers = {
  age: number | null
  monthlyIncome: number | null
  familyStatus: FamilyStatus
  dependents: number
  region: Region
  city?: string
  employment: Employment
}

export type BenefitResult = {
  id: string
  title: string
  eligible: boolean
  estimatedAmount?: { min?: number; max?: number; approx?: number }
  confidence: 'low' | 'medium' | 'high'
  summary: string
  link?: { label: string; url: string }
  guide?: { label: string; url: string }
}

export type BenefitRule = {
  id: string
  title: string
  description?: string
  evaluate: (answers: UserAnswers) => BenefitResult
}

export type EligibilityEngine = {
  rules: BenefitRule[]
  evaluateAll: (answers: UserAnswers) => BenefitResult[]
}

export function makeEngine(rules: BenefitRule[]): EligibilityEngine {
  return {
    rules,
    evaluateAll: (answers) => rules.map((r) => r.evaluate(answers)),
  }
}
