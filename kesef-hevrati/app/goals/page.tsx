import React from 'react'
import SavingsGoalTracker from '@/components/goals/SavingsGoalTracker'

export const metadata = {
  title: 'יעדי חיסכון',
  description: 'הגדרת יעדי חיסכון, מעקב התקדמות, וניתוח הוצאות כדי להאיץ את החיסכון',
}

export default function GoalsPage() {
  return <SavingsGoalTracker />
}
