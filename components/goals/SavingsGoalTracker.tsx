'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Papa, { ParseResult } from 'papaparse'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useFinance } from '@/lib/finance/context'

type Goal = {
  id: string
  name: string
  target: number
  saved: number
  monthlyContribution: number
  term: 'short' | 'long'
  targetDate?: string | null // YYYY-MM-DD
}

type Txn = {
  id: string
  date: string // ISO date
  description: string
  amount: number // expense amount as positive ILS
  category: string
}

const ILS = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
})

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'מסעדות וקפה': [
    'cafe',
    'coffee',
    'מסעדה',
    'restaurant',
    'starbucks',
    'ארומה',
    'קפה',
    'מקדונלד',
    'בורגר',
  ],
  סופרמרקט: ['super', 'market', 'שופרסל', 'רמי לוי', 'ויקטורי', 'טיב טעם', 'סופר'],
  תחבורה: ['uber', 'gettaxi', 'gett', 'didi', 'bus', 'רכבת', 'אגד', 'מטרופולין', 'דלק', 'תחנת דלק'],
  מנויים: [
    'netflix',
    'spotify',
    'youtube',
    'apple',
    'microsoft',
    'dropbox',
    'adobe',
    'subscription',
    'מנוי',
  ],
  בידור: ['cinema', 'movie', 'סרט', 'בידור', 'תיאטרון', 'קונצרט'],
  תקשורת: ['cellcom', 'partner', 'pelephone', 'hot', 'yes', 'golan', '012', '013'],
  בריאות: ['pharmacy', 'סופר-פארם', 'קופת חולים', 'תרופות'],
  דיור: ['שכירות', 'ארנונה', 'ועד בית', 'חשמל', 'מים', 'גז'],
}

function categorize(desc: string): string {
  const d = desc.toLowerCase()
  for (const [cat, keys] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keys.some((k) => d.includes(k))) return cat
  }
  return 'אחר'
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function monthKey(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function SavingsGoalTracker() {
  const { calculators } = useFinance() // may include refinance monthlySaving
  const [goals, setGoals] = useState<Goal[]>([])
  const [txns, setTxns] = useState<Txn[]>([])
  const [csvNegatives, setCsvNegatives] = useState(true)
  const [whatIf, setWhatIf] = useState<Record<string, number>>({})

  // Load/save state
  useEffect(() => {
    try {
      const g = localStorage.getItem('savings:goals')
      const t = localStorage.getItem('savings:txns')
      if (g)
        setGoals(
          (JSON.parse(g) as Partial<Goal>[]).map((x) => ({ term: 'short', ...x })) as Goal[],
        )
      if (t) setTxns(JSON.parse(t))
    } catch {
      // ignore
    }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem('savings:goals', JSON.stringify(goals))
    } catch {
      /* ignore */
    }
  }, [goals])
  useEffect(() => {
    try {
      localStorage.setItem('savings:txns', JSON.stringify(txns))
    } catch {
      /* ignore */
    }
  }, [txns])

  // Derived
  const monthlyByMonth = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of txns) {
      const k = monthKey(t.date)
      map.set(k, (map.get(k) || 0) + t.amount)
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([month, total]) => ({ month, total }))
  }, [txns])

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of txns) {
      map.set(t.category, (map.get(t.category) || 0) + t.amount)
    }
    return Array.from(map, ([name, value]) => ({ name, value }))
  }, [txns])

  const recurring = useMemo(() => {
    const counts = new Map<string, number>()
    for (const t of txns) {
      counts.set(t.description.toLowerCase(), (counts.get(t.description.toLowerCase()) || 0) + 1)
    }
    return Array.from(counts)
      .filter(([, c]) => c >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)
  }, [txns])

  // Tips
  const tips = useMemo(() => {
    const out: string[] = []
    const sum = txns.reduce((s, t) => s + t.amount, 0)
    const cats = Object.fromEntries(byCategory.map((c) => [c.name, c.value])) as Record<
      string,
      number
    >
    if ((cats['מנויים'] || 0) > 200)
      out.push("בדקו מנויים חודשיים וחשבו האם ניתן לבטל חלק מהם (נטפליקס, ספוטיפיי וכו' )")
    if ((cats['מסעדות וקפה'] || 0) / Math.max(1, sum) > 0.12)
      out.push('הוצאות על מסעדות/קפה גבוהות יחסית. נסו להגדיר תקציב שבועי לאוכל בחוץ')
    if ((cats['תחבורה'] || 0) > 350)
      out.push('עלויות תחבורה גבוהות. שקלו כרטיס חודשי/נסיעות משותפות')
    if (recurring.length)
      out.push(`זוהו חיובים חוזרים: ${recurring.slice(0, 3).join(', ')} — שווה בדיקה והפחתה`)

    // Use refinance monthly saving if available to suggest auto-transfer
    const refinanceMonthly = calculators?.earlyRepaymentMonthlySaving || 0
    if (refinanceMonthly > 0) {
      out.push(
        `מומלץ להגדיר הוראת קבע של ${ILS.format(refinanceMonthly)} לטובת אחד היעדים, כדי לממש את החיסכון מהמחזור`,
      )
    }

    // Goal-specific tips
    for (const g of goals) {
      if (g.targetDate && g.monthlyContribution > 0) {
        const need = requiredMonthlyForGoal(g)
        if (need > g.monthlyContribution) {
          out.push(
            `"${g.name}": כדי להגיע עד ${g.targetDate}, מומלץ להגדיל תרומה חודשית ב-${ILS.format(Math.ceil(need - g.monthlyContribution))}`,
          )
        }
      }
    }
    return out
  }, [txns, byCategory, recurring, calculators, goals])

  function requiredMonthlyForGoal(g: Goal): number {
    if (!g.targetDate) return 0
    const targetTime = new Date(g.targetDate).getTime()
    const now = Date.now()
    const monthsLeft = Math.max(1, Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24 * 30)))
    const remaining = Math.max(0, g.target - g.saved)
    return remaining / monthsLeft
  }

  // Handlers
  function addGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const g: Goal = {
      id: uid('goal'),
      name: String(fd.get('name') || 'יעד'),
      target: Number(fd.get('target') || 0),
      saved: Number(fd.get('saved') || 0),
      monthlyContribution: Number(fd.get('monthlyContribution') || 0),
      term: (String(fd.get('term')) as 'short' | 'long') || 'short',
      targetDate: String(fd.get('targetDate') || '') || null,
    }
    setGoals((s) => [...s, g])
    e.currentTarget.reset()
  }

  function addTxn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const desc = String(fd.get('description') || '')
    const amount = Math.max(0, Number(fd.get('amount') || 0))
    const date = String(fd.get('date') || new Date().toISOString().slice(0, 10))
    const cat = String(fd.get('category') || '') || categorize(desc)
    const t: Txn = { id: uid('txn'), date, description: desc, amount, category: cat }
    setTxns((s) => [t, ...s])
    e.currentTarget.reset()
  }

  type CsvRow = Record<string, unknown>
  function onCsv(files: FileList | null) {
    if (!files || !files[0]) return
    const f = files[0]
    Papa.parse<CsvRow>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res: ParseResult<CsvRow>) => {
        const rows = res.data as CsvRow[]
        const parsed: Txn[] = []
        for (const r of rows) {
          const keys = Object.keys(r).reduce<Record<string, string>>((m, k) => {
            m[k.toLowerCase().trim()] = String((r as Record<string, unknown>)[k] ?? '')
            return m
          }, {})
          const date = keys['date'] || keys['תאריך'] || keys['transaction date']
          const desc = keys['description'] || keys['details'] || keys['תיאור'] || keys['שם בית עסק']
          const amtRaw =
            keys['amount'] || keys['sum'] || keys['סכום'] || keys['debit'] || keys['credit']
          if (!date || !amtRaw) continue
          let v = Number(String(amtRaw).replace(/[^-\d.]/g, ''))
          if (Number.isNaN(v)) continue
          if (csvNegatives && v < 0) v = -v
          const tx: Txn = {
            id: uid('txn'),
            date: new Date(date).toISOString().slice(0, 10),
            description: String(desc || 'עסקה'),
            amount: Math.max(0, v),
            category: categorize(String(desc || '')),
          }
          parsed.push(tx)
        }
        if (parsed.length) setTxns((s) => [...parsed, ...s])
      },
      error: () => {},
    })
  }

  // Chart data for goals (projection vs target)
  const projectionData = useMemo(() => {
    // build per goal simple projection for 12 months
    const months = Array.from({ length: 12 }, (_, i) => i)
    const targetSeries: Record<string, { month: string; [k: string]: number | string }> = {}
    const out: { month: string; [k: string]: number | string }[] = months.map((i) => ({
      month: `חודש ${i + 1}`,
    }))
    goals.forEach((g) => {
      let acc = g.saved
      months.forEach((i) => {
        acc += g.monthlyContribution
        out[i][g.name] = Math.min(acc, g.target)
      })
      targetSeries[g.name] = { month: 'יעד', [g.name]: g.target }
    })
    return { out, targetSeries }
  }, [goals])

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']

  return (
    <section dir="rtl" className="max-w-screen-xl mx-auto p-4 space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">יעדי חיסכון אישיים</h1>
            <p className="text-sm text-gray-600">
              צרו מספר יעדים (קרן חירום, חופשה, פרעון מוקדם) ועקבו אחרי ההתקדמות.
            </p>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Create goal */}
          <form onSubmit={addGoal} className="space-y-3 rounded-lg border p-3 bg-gray-50">
            <h3 className="font-medium">הוספת יעד</h3>
            <div>
              <label htmlFor="g-name" className="text-sm">
                שם היעד
              </label>
              <input
                id="g-name"
                name="name"
                required
                className="w-full rounded border px-3 py-2"
                placeholder="קרן חירום"
              />
            </div>
            <div>
              <label htmlFor="g-term" className="text-sm">
                טווח היעד
              </label>
              <select
                id="g-term"
                name="term"
                className="w-full rounded border px-3 py-2"
                defaultValue="short"
              >
                <option value="short">קצר (עד שנה)</option>
                <option value="long">ארוך (מעל שנה)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="g-target" className="text-sm">
                  סכום יעד
                </label>
                <input
                  id="g-target"
                  name="target"
                  type="number"
                  min={0}
                  step="100"
                  required
                  className="w-full rounded border px-3 py-2"
                  placeholder="20000"
                />
              </div>
              <div>
                <label htmlFor="g-saved" className="text-sm">
                  נחסך עד כה
                </label>
                <input
                  id="g-saved"
                  name="saved"
                  type="number"
                  min={0}
                  step="100"
                  className="w-full rounded border px-3 py-2"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="g-monthly" className="text-sm">
                  תרומה חודשית
                </label>
                <input
                  id="g-monthly"
                  name="monthlyContribution"
                  type="number"
                  min={0}
                  step="50"
                  className="w-full rounded border px-3 py-2"
                  placeholder="500"
                />
              </div>
              <div>
                <label htmlFor="g-date" className="text-sm">
                  תאריך יעד (אופציונלי)
                </label>
                <input
                  id="g-date"
                  name="targetDate"
                  type="date"
                  className="w-full rounded border px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
            >
              הוסף יעד
            </button>
          </form>

          {/* Goals list */}
          <div className="lg:col-span-2 space-y-3">
            {goals.length === 0 ? (
              <p className="text-sm text-gray-600">עוד אין יעדים. הוסיפו אחד בטופס משמאל.</p>
            ) : (
              goals.map((g) => {
                const pct = g.target ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0
                const needMonthly = requiredMonthlyForGoal(g)
                const monthsToFinish =
                  g.monthlyContribution > 0
                    ? Math.ceil(Math.max(0, g.target - g.saved) / g.monthlyContribution)
                    : null
                const extra = whatIf[g.id] || 0
                const totalMonthly = g.monthlyContribution + extra
                const monthsWithExtra =
                  totalMonthly > 0
                    ? Math.ceil(Math.max(0, g.target - g.saved) / totalMonthly)
                    : null
                return (
                  <div key={g.id} className="rounded border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{g.name}</div>
                        <span className="text-xs text-gray-500">
                          {g.term === 'short' ? 'טווח קצר' : 'טווח ארוך'}
                        </span>
                        {g.saved >= g.target && (
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            הושלם
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {ILS.format(g.saved)} / {ILS.format(g.target)} ({pct}%)
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded mt-2">
                      <progress
                        className="w-full h-2"
                        value={pct}
                        max={100}
                        aria-label={`התקדמות ${g.name}`}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3 items-end">
                      <div>
                        <label htmlFor={`saved-${g.id}`} className="text-xs">
                          נחסך
                        </label>
                        <input
                          id={`saved-${g.id}`}
                          title="סכום שנחסך"
                          placeholder="0"
                          type="number"
                          min={0}
                          step="50"
                          value={g.saved}
                          onChange={(e) =>
                            setGoals((s) =>
                              s.map((x) =>
                                x.id === g.id ? { ...x, saved: Number(e.target.value) } : x,
                              ),
                            )
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                      <div>
                        <label htmlFor={`monthly-${g.id}`} className="text-xs">
                          תרומה חודשית
                        </label>
                        <input
                          id={`monthly-${g.id}`}
                          title="תרומה חודשית"
                          placeholder="0"
                          type="number"
                          min={0}
                          step="50"
                          value={g.monthlyContribution}
                          onChange={(e) =>
                            setGoals((s) =>
                              s.map((x) =>
                                x.id === g.id
                                  ? { ...x, monthlyContribution: Number(e.target.value) }
                                  : x,
                              ),
                            )
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                      <div>
                        <label htmlFor={`date-${g.id}`} className="text-xs">
                          תאריך יעד
                        </label>
                        <input
                          id={`date-${g.id}`}
                          title="תאריך יעד"
                          type="date"
                          value={g.targetDate || ''}
                          onChange={(e) =>
                            setGoals((s) =>
                              s.map((x) =>
                                x.id === g.id ? { ...x, targetDate: e.target.value || null } : x,
                              ),
                            )
                          }
                          className="w-full rounded border px-2 py-1"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          type="button"
                          onClick={() => setGoals((s) => s.filter((x) => x.id !== g.id))}
                          className="rounded border px-3 py-2"
                        >
                          מחק
                        </button>
                        {monthsToFinish !== null && (
                          <div className="text-xs text-gray-600">
                            השלמה בעוד ~{monthsToFinish} חודשים
                          </div>
                        )}
                        {g.targetDate && needMonthly > g.monthlyContribution ? (
                          <div className="text-xs text-amber-700">
                            נדרש חודשי: {ILS.format(Math.ceil(needMonthly))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-3">
                      <label htmlFor={`extra-${g.id}`} className="text-xs">
                        תוספת חודשית לסימולציה
                      </label>
                      <input
                        id={`extra-${g.id}`}
                        type="number"
                        min={0}
                        step="50"
                        placeholder="0"
                        value={extra}
                        onChange={(e) =>
                          setWhatIf((s) => ({ ...s, [g.id]: Number(e.target.value) }))
                        }
                        className="w-full rounded border px-2 py-1"
                      />
                      {monthsWithExtra !== null && monthsToFinish !== null &&
                      monthsWithExtra < monthsToFinish ? (
                        <div className="text-xs text-blue-700 mt-1">
                          עם התוספת תסיימו בעוד ~{monthsWithExtra} חודשים במקום ~
                          {monthsToFinish}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Transactions input */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">הוצאות ועסקאות</h2>
          <div className="flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={csvNegatives}
                onChange={(e) => setCsvNegatives(e.target.checked)}
              />
              קבצי CSV עם הוצאות כערכים שליליים
            </label>
            <label htmlFor="csv-file" className="sr-only">
              ייבוא CSV
            </label>
            <input
              id="csv-file"
              type="file"
              accept=".csv,text/csv"
              title="ייבוא CSV"
              onChange={(e) => onCsv(e.target.files)}
            />
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <form onSubmit={addTxn} className="space-y-2 rounded-lg border p-3 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="t-date" className="text-sm">
                  תאריך
                </label>
                <input
                  id="t-date"
                  name="date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="t-amount" className="text-sm">
                  סכום הוצאה
                </label>
                <input
                  id="t-amount"
                  name="amount"
                  type="number"
                  min={0}
                  step="1"
                  required
                  className="w-full rounded border px-3 py-2"
                  placeholder="120"
                />
              </div>
            </div>
            <div>
              <label htmlFor="t-desc" className="text-sm">
                תיאור
              </label>
              <input
                id="t-desc"
                name="description"
                className="w-full rounded border px-3 py-2"
                placeholder="מסעדה/דלק/שכירות"
              />
            </div>
            <div>
              <label htmlFor="t-cat" className="text-sm">
                קטגוריה (אופציונלי)
              </label>
              <input
                id="t-cat"
                name="category"
                className="w-full rounded border px-3 py-2"
                placeholder="יזוהה אוטומטית אם ריק"
              />
            </div>
            <button
              type="submit"
              className="rounded bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
            >
              הוסף הוצאה
            </button>
          </form>

          <div className="lg:col-span-2 space-y-6 min-h-[600px]">
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="h-64">
                <h3 className="text-sm font-medium mb-2">הוצאות חודשיות</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyByMonth}
                    margin={{ top: 8, right: 16, left: 0, bottom: 16 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" name='סה"כ הוצאות' fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <h3 className="text-sm font-medium mb-2">חלוקה לפי קטגוריה</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
                    <Pie
                      dataKey="value"
                      data={byCategory}
                      nameKey="name"
                      outerRadius={90}
                      labelLine={false}
                    >
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Projection */}
            <div className="h-80 mb-8">
              <h3 className="text-sm font-medium mb-2">תחזית התקדמות מול יעד</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectionData.out}
                  margin={{ top: 8, right: 16, left: 0, bottom: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {goals.map((g, i) => (
                    <Line
                      key={g.id}
                      type="monotone"
                      dataKey={g.name}
                      stroke={COLORS[i % COLORS.length]}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-600 mt-2">
                הקו מייצג תחזית של חסכון חודשי לפי ההגדרה מול סכום היעד.
              </div>
            </div>

            {/* Tips */}
            <div className="rounded border p-4 bg-emerald-50 border-emerald-200 mt-6 clear-both">
              <h3 className="font-medium text-emerald-900 mb-3 text-base">המלצות להאצת החיסכון</h3>
              {tips.length ? (
                <ul className="list-disc pr-6 mt-2 space-y-2 text-sm text-emerald-900 break-words leading-relaxed">
                  {tips.map((t, i) => (
                    <li key={i} className="pl-1">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-emerald-900">אין כרגע תובנות מיוחדות. המשיכו לעקוב.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">רשימת עסקאות</h2>
          {txns.length ? (
            <div className="text-xs text-gray-600">
              סה\"כ: {ILS.format(txns.reduce((s, t) => s + t.amount, 0))}
            </div>
          ) : null}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-3 py-2 text-right">תאריך</th>
                <th className="px-3 py-2 text-right">תיאור</th>
                <th className="px-3 py-2 text-right">קטגוריה</th>
                <th className="px-3 py-2 text-right">סכום</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {txns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                    אין נתונים עדיין
                  </td>
                </tr>
              ) : (
                txns.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{t.date}</td>
                    <td className="px-3 py-2">{t.description}</td>
                    <td className="px-3 py-2">
                      <input
                        value={t.category}
                        title="קטגוריה"
                        placeholder="קטגוריה"
                        aria-label="קטגוריה"
                        onChange={(e) =>
                          setTxns((s) =>
                            s.map((x) => (x.id === t.id ? { ...x, category: e.target.value } : x)),
                          )
                        }
                        className="rounded border px-2 py-1"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{ILS.format(t.amount)}</td>
                    <td className="px-3 py-2 text-left">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => setTxns((s) => s.filter((x) => x.id !== t.id))}
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
