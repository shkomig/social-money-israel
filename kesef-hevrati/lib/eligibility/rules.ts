import { BenefitResult, BenefitRule, UserAnswers } from './types'

const shekels = (n: number) => Math.max(0, Math.round(n))

// Placeholder thresholds based on common Israeli benefits patterns; fine-tune from official tables annually
const LOW_INCOME_SINGLE = 7300
const LOW_INCOME_MARRIED = 10800
const WORK_GRANT_MIN_AGE = 23
const WORK_GRANT_MAX_AGE = 67

const rules: BenefitRule[] = [
  // 1) Work Grant (מענק עבודה – מס הכנסה שלילי)
  {
    id: 'work-grant',
    title: 'מענק עבודה (מס הכנסה שלילי)',
    evaluate: (a: UserAnswers): BenefitResult => {
      const inAge = a.age !== null && a.age >= WORK_GRANT_MIN_AGE && a.age <= WORK_GRANT_MAX_AGE
      const isWorking = a.employment === 'employed' || a.employment === 'selfEmployed'
      if (!inAge || !isWorking || a.monthlyIncome === null) {
        return {
          id: 'work-grant',
          title: 'מענק עבודה (מס הכנסה שלילי)',
          eligible: false,
          confidence: 'medium',
          summary: 'לא עומדים בתנאי גיל/העסקה או שהכנסה לא הוזנה',
          guide: {
            label: 'הגשת בקשה',
            url: 'https://www.gov.il/he/service/earned_income_tax_credit',
          },
        }
      }
      const income = a.monthlyIncome
      const base = Math.min(7500, Math.max(2500, income))
      const approx = base < 2500 || base > 9500 ? 0 : (200 + (7500 - Math.abs(6500 - base))) / 4
      return {
        id: 'work-grant',
        title: 'מענק עבודה (מס הכנסה שלילי)',
        eligible: approx > 0,
        estimatedAmount: { approx: shekels(approx) },
        confidence: 'low',
        summary: 'אומדן לפי הכנסה וחוק מענק עבודה (חישוב מקורב)',
        guide: {
          label: 'מדריך צעד‑אחר‑צעד',
          url: 'https://www.gov.il/he/Departments/Guides/earned_income_tax_credit',
        },
      }
    },
  },

  // 2) Tax refund potential (החזר מס)
  {
    id: 'tax-refund',
    title: 'החזר מס (בדיקה ראשונית)',
    evaluate: (a: UserAnswers): BenefitResult => {
      const works = a.employment === 'employed' || a.employment === 'selfEmployed'
      if (!works) {
        return {
          id: 'tax-refund',
          title: 'החזר מס (בדיקה ראשונית)',
          eligible: false,
          confidence: 'low',
          summary: 'אין הכנסה חייבת – קשה להעריך החזר מס',
          guide: {
            label: 'בדיקת זכאות',
            url: 'https://www.gov.il/he/Departments/Guides/income_tax_refund',
          },
        }
      }
      const approx = a.dependents > 0 ? 600 : 200
      return {
        id: 'tax-refund',
        title: 'החזר מס (בדיקה ראשונית)',
        eligible: true,
        estimatedAmount: { approx: shekels(approx) },
        confidence: 'low',
        summary: 'הערכה כללית לפי נקודות זיכוי והוצאות מוכרות נפוצות',
        guide: {
          label: 'מדריך מס הכנסה',
          url: 'https://www.gov.il/he/Departments/Guides/income_tax_refund',
        },
      }
    },
  },

  // 3) Property tax/arnona discount (הנחה בארנונה)
  {
    id: 'arnona-discount',
    title: 'הנחה בארנונה (רשויות מקומיות)',
    evaluate: (a: UserAnswers): BenefitResult => {
      const lowIncomeThreshold =
        a.familyStatus === 'married' ? LOW_INCOME_MARRIED : LOW_INCOME_SINGLE
      const lowIncome = a.monthlyIncome !== null && a.monthlyIncome <= lowIncomeThreshold
      const approx = lowIncome ? 300 : 0 // placeholder monthly discount estimate
      return {
        id: 'arnona-discount',
        title: 'הנחה בארנונה (רשויות מקומיות)',
        eligible: lowIncome,
        estimatedAmount: lowIncome ? { approx: shekels(approx) } : undefined,
        confidence: 'low',
        summary: lowIncome
          ? 'הכנסה נמוכה עשויה לזכות בהנחה בארנונה (הערכת גובה כללי)'
          : 'ייתכן שאינכם עומדים בסף הכנסה להנחה בארנונה',
        link: {
          label: 'בדיקת זכאות בעירייה',
          url: 'https://www.gov.il/he/Departments/General/property_tax_discounts',
        },
      }
    },
  },
]

export default rules
