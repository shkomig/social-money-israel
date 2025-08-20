'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { BenefitResult } from '@/lib/eligibility/types'

export type ChecklistWidgetProps = {
  results: BenefitResult[]
}

type Task = {
  id: string
  title: string
  details?: string
  dueDate?: string
  benefitId: string
  completed: boolean
  completedAt?: number | null
  reminderAt?: number | null
}

const STORAGE_KEY = 'checklist-tasks-v1'

function useLocalReminder() {
  const timers = useRef<Record<string, number>>({})

  const schedule = (id: string, when: number, title: string, body?: string) => {
    const now = Date.now()
    if (when <= now) return false

    const ask = async () => {
      if (!('Notification' in window)) return false
      if (Notification.permission === 'granted') return true
      if (Notification.permission !== 'denied') {
        const p = await Notification.requestPermission()
        return p === 'granted'
      }
      return false
    }

    ask().then((ok) => {
      if (!ok) return
      const ms = when - Date.now()
      if (timers.current[id]) window.clearTimeout(timers.current[id])
      timers.current[id] = window.setTimeout(() => {
        new Notification(title, { body })
      }, ms)
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Task[]
      const next = saved.map((t) => (t.id === id ? { ...t, reminderAt: when } : t))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    })
    return true
  }

  useEffect(() => {
    // Re-arm pending reminders on mount
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Task[]
    const now = Date.now()
    for (const t of saved) {
      if (t.reminderAt && t.reminderAt > now && !t.completed) {
        const ms = t.reminderAt - now
        timers.current[t.id] = window.setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(t.title, { body: t.details })
          }
        }, ms)
      }
    }
    return () => {
      for (const h of Object.values(timers.current)) window.clearTimeout(h)
    }
  }, [])

  return { schedule }
}

function deriveTasks(results: BenefitResult[]): Task[] {
  const now = new Date()
  const y = now.getFullYear()
  const makeFuture = (d: Date) =>
    d.getTime() > now.getTime() ? d : new Date(d.getFullYear() + 1, d.getMonth(), d.getDate())

  const tasks: Task[] = []
  for (const r of results) {
    if (!r.eligible) continue
    if (r.id === 'work-grant') {
      const base = new Date(y, 5, 30)
      const d = makeFuture(base)
      tasks.push({
        id: `task-${r.id}`,
        title: 'הגשת מענק עבודה',
        details: 'בדקו והגישו בקשה למענק עבודה (מס הכנסה שלילי) עד סוף יוני',
        dueDate: d.toISOString(),
        benefitId: r.id,
        completed: false,
        completedAt: null,
        reminderAt: null,
      })
    } else if (r.id === 'tax-refund') {
      const d = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      tasks.push({
        id: `task-${r.id}`,
        title: 'בדיקת החזר מס',
        details: 'בצעו בדיקה להחזרי מס (ניתן לבדוק עד 6 שנים אחורה)',
        dueDate: d.toISOString(),
        benefitId: r.id,
        completed: false,
        completedAt: null,
        reminderAt: null,
      })
    } else if (r.id === 'arnona-discount') {
      const base = new Date(y, 0, 31)
      const d = makeFuture(base)
      tasks.push({
        id: `task-${r.id}`,
        title: 'בקשה להנחה בארנונה',
        details: 'בדקו מועדי הגשה בעירייה והגישו בקשה להנחה',
        dueDate: d.toISOString(),
        benefitId: r.id,
        completed: false,
        completedAt: null,
        reminderAt: null,
      })
    }
  }
  // Unique by id (in case of reruns)
  const map = new Map<string, Task>()
  for (const t of tasks) map.set(t.id, t)
  return Array.from(map.values())
}

export default function ChecklistWidget({ results }: ChecklistWidgetProps) {
  const baseTasks = useMemo(() => deriveTasks(results), [results])
  const [tasks, setTasks] = useState<Task[]>([])
  const { schedule } = useLocalReminder()

  // Load and merge with saved state
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Task[]
    const byId = new Map(saved.map((t) => [t.id, t]))
    const merged = baseTasks.map((t) => ({ ...t, ...(byId.get(t.id) ?? {}) }))
    setTasks(merged)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  }, [baseTasks])

  const progress = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.completed).length
    return { total, done }
  }, [tasks])

  const toggle = (id: string, checked: boolean) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: checked, completedAt: checked ? Date.now() : null } : t,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const remind = (id: string, offsetDays: number) => {
    const at = Date.now() + offsetDays * 24 * 60 * 60 * 1000
    const t = tasks.find((x) => x.id === id)
    if (!t) return
    schedule(id, at, t.title, t.details)
    setTasks((prev) => {
      const next = prev.map((x) => (x.id === id ? { ...x, reminderAt: at } : x))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <section
      dir="rtl"
      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 border-b bg-gradient-to-l from-emerald-50 to-teal-50 flex items-center justify-between">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">צ'ק‑ליסט חיסכון</h2>
        <div className="text-xs text-gray-700">
          הושלם {progress.done}/{progress.total}
        </div>
      </div>

      <ul className="p-3 space-y-2">
        {tasks.length === 0 && <li className="text-sm text-gray-600 px-2 py-3">אין משימות כרגע</li>}
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start justify-between gap-2 rounded-lg border p-3">
            <label className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300"
                checked={t.completed}
                onChange={(e) => toggle(t.id, e.target.checked)}
                aria-label={`סימון משימה: ${t.title}`}
              />
              <div>
                <div
                  className={`font-medium ${t.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                >
                  {t.title}
                </div>
                <div className="text-xs text-gray-600">
                  {t.details}
                  {t.dueDate ? ` • עד ${new Date(t.dueDate).toLocaleDateString('he-IL')}` : ''}
                  {t.completedAt
                    ? ` • הושלם ${new Date(t.completedAt).toLocaleDateString('he-IL')}`
                    : ''}
                </div>
              </div>
            </label>
            {!t.completed && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => remind(t.id, 1)}
                  className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
                >
                  הזכר מחר
                </button>
                <button
                  onClick={() => remind(t.id, 7)}
                  className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
                >
                  הזכר בעוד שבוע
                </button>
                <button
                  onClick={() => remind(t.id, 30)}
                  className="text-xs rounded border px-2 py-1 hover:bg-gray-50"
                >
                  הזכר בעוד חודש
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="px-4 pb-4 text-xs text-gray-500">
        שמירה מקומית בלבד (במכשיר שלכם). להודעות פוש אמיתיות יש צורך ב-Service Worker ושרת Push.
      </div>
    </section>
  )
}
