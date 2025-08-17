'use client'

import { useEffect, useMemo, useState } from 'react'
import { makeEngine } from '@/lib/eligibility/types'
import FinancialDashboard from '@/components/FinancialDashboard'
import ChecklistWidget from '@/components/eligibility/ChecklistWidget'
import rules from '@/lib/eligibility/rules'
import type { Employment, FamilyStatus, Region, UserAnswers } from '@/lib/eligibility/types'

const currencyFmt = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
})

const defaultAnswers: UserAnswers = {
  age: null,
  monthlyIncome: null,
  familyStatus: 'single',
  dependents: 0,
  region: 'center',
  city: '',
  employment: 'employed',
}

export default function Questionnaire() {
  const [answers, setAnswers] = useState<UserAnswers>(defaultAnswers)
  const [selected, setSelected] = useState<string[]>([])
  const engine = useMemo(() => makeEngine(rules), [])
  const results = useMemo(() => engine.evaluateAll(answers), [engine, answers])

  // Persist selected benefit IDs across sessions
  useEffect(() => {
    try {
      const raw =
        typeof window !== 'undefined' ? localStorage.getItem('eligibility:selectedIds') : null
      if (raw) {
        const ids = JSON.parse(raw)
        if (Array.isArray(ids)) setSelected(ids.filter((x) => typeof x === 'string'))
      }
    } catch {
      // ignore localStorage errors
    }
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('eligibility:selectedIds', JSON.stringify(selected))
      }
    } catch {
      // ignore localStorage errors
    }
  }, [selected])

  return (
    <section dir="rtl" className="max-w-screen-lg mx-auto p-4 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h1 className="text-xl font-semibold text-gray-900">בדיקת זכאות להטבות ומענקים</h1>
          <p className="text-sm text-gray-600">
            התוצאות הן הערכה חינוכית ואינן מחליפות בדיקה רשמית.
          </p>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label htmlFor="q-age" className="block text-sm text-gray-700 mb-1">
                גיל
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={18}
                max={120}
                id="q-age"
                placeholder="למשל: 32"
                aria-describedby="q-age-hint"
                title="נא להזין גיל בין 18 ל-120"
                value={answers.age ?? ''}
                onChange={(e) =>
                  setAnswers((s) => ({ ...s, age: e.target.value ? Number(e.target.value) : null }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p id="q-age-hint" className="mt-1 text-xs text-gray-500">
                מינימום 18
              </p>
            </div>

            <div>
              <label htmlFor="q-income" className="block text-sm text-gray-700 mb-1">
                הכנסה חודשית (נטו)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="100"
                id="q-income"
                placeholder="למשל: 8200"
                title="נא להזין הכנסה חודשית נטו"
                value={answers.monthlyIncome ?? ''}
                onChange={(e) =>
                  setAnswers((s) => ({
                    ...s,
                    monthlyIncome: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="q-family" className="block text-sm text-gray-700 mb-1">
                מצב משפחתי
              </label>
              <select
                id="q-family"
                title="בחרו מצב משפחתי"
                value={answers.familyStatus}
                onChange={(e) =>
                  setAnswers((s) => ({ ...s, familyStatus: e.target.value as FamilyStatus }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="single">רווק/ה</option>
                <option value="married">נשוי/אה</option>
                <option value="singleParent">הורה יחיד</option>
              </select>
            </div>

            <div>
              <label htmlFor="q-dependents" className="block text-sm text-gray-700 mb-1">
                מספר תלויים (ילדים וכו')
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                id="q-dependents"
                placeholder="0"
                title="מספר תלויים"
                value={answers.dependents}
                onChange={(e) =>
                  setAnswers((s) => ({
                    ...s,
                    dependents: Math.max(0, Number(e.target.value || 0)),
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="q-region" className="block text-sm text-gray-700 mb-1">
                אזור מגורים
              </label>
              <select
                id="q-region"
                title="בחרו אזור מגורים"
                value={answers.region}
                onChange={(e) => setAnswers((s) => ({ ...s, region: e.target.value as Region }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="center">מרכז</option>
                <option value="periphery">פריפריה</option>
                <option value="priorityA">עדיפות א'</option>
                <option value="priorityB">עדיפות ב'</option>
              </select>
            </div>

            <div>
              <label htmlFor="q-employment" className="block text-sm text-gray-700 mb-1">
                תעסוקה
              </label>
              <select
                id="q-employment"
                title="בחרו סוג תעסוקה"
                value={answers.employment}
                onChange={(e) =>
                  setAnswers((s) => ({ ...s, employment: e.target.value as Employment }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="employed">שכיר/ה</option>
                <option value="selfEmployed">עצמאי/ת</option>
                <option value="student">סטודנט/ית</option>
                <option value="unemployed">בלתי מועסק/ת</option>
              </select>
            </div>
          </div>

          {/* Results with include toggles */}
          <div className="space-y-3" aria-live="polite" aria-atomic="true" role="status">
            {/* Bulk selection controls */}
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                className="rounded border px-2 py-1 bg-white hover:bg-gray-50"
                onClick={() => {
                  const allEligible = results.filter((r) => r.eligible).map((r) => r.id)
                  setSelected(allEligible)
                }}
                aria-label="בחר/י את כל ההטבות הזכאותיות"
              >
                בחר הכל
              </button>
              <button
                type="button"
                className="rounded border px-2 py-1 bg-white hover:bg-gray-50"
                onClick={() => setSelected([])}
                aria-label="נקה בחירות"
              >
                נקה
              </button>
            </div>
            {results.map((r) => (
              <div
                key={r.id}
                className={`rounded-lg border p-4 ${r.eligible ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{r.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${r.eligible ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-800'}`}
                  >
                    {r.eligible ? 'ייתכן זכאות' : 'לא נמצא'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{r.summary}</p>
                {r.estimatedAmount && (
                  <div className="mt-2 text-sm text-gray-900">
                    סכום משוער:{' '}
                    {r.estimatedAmount.approx
                      ? currencyFmt.format(r.estimatedAmount.approx)
                      : r.estimatedAmount.min || r.estimatedAmount.max
                        ? `${currencyFmt.format(r.estimatedAmount.min ?? 0)}–${currencyFmt.format(r.estimatedAmount.max ?? 0)}`
                        : '—'}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs items-center">
                  {r.eligible && (
                    <label className="inline-flex items-center gap-1 select-none">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selected.includes(r.id)}
                        onChange={(e) =>
                          setSelected((prev) =>
                            e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id),
                          )
                        }
                        aria-label="כלול בסכום הכולל"
                      />
                      כלול בסכום הכולל
                    </label>
                  )}
                  {r.link && (
                    <a
                      className="inline-flex items-center rounded bg-white border px-2 py-1 hover:bg-gray-50"
                      href={r.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {r.link.label}
                    </a>
                  )}
                  {r.guide && (
                    <a
                      className="inline-flex items-center rounded bg-white border px-2 py-1 hover:bg-gray-50"
                      href={r.guide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {r.guide.label}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial dashboard summary */}
      <FinancialDashboard
        results={results}
        selectedIds={selected}
        calculators={
          {
            /* can be wired from refinance estimator via context if needed */
          }
        }
      />

      <ChecklistWidget results={results} />
    </section>
  )
}
