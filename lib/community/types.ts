export type UserBadge = 'expert' | 'superuser' | 'verified' | 'community_star'

export interface User {
  id: string
  username: string
  badges: UserBadge[]
  reputation: number
  joinDate: string
  isAnonymous?: boolean
}

export interface Question {
  id: string
  title: string
  content: string
  tags: string[]
  authorId: string | null // null for anonymous
  authorName: string // display name or "משתמש אנונימי"
  createdAt: string
  updatedAt: string
  views: number
  votes: number
  answersCount: number
  isClosed: boolean
  isModerated: boolean
  category: QuestionCategory
}

export interface Answer {
  id: string
  questionId: string
  content: string
  authorId: string | null
  authorName: string
  createdAt: string
  updatedAt: string
  votes: number
  isAccepted: boolean
  isModerated: boolean
  isBestAnswer: boolean
}

export interface Vote {
  id: string
  userId: string
  targetId: string // question or answer ID
  targetType: 'question' | 'answer'
  value: 1 | -1
  createdAt: string
}

export type QuestionCategory =
  | 'taxes' // מסים
  | 'mortgage' // משכנתא
  | 'pension' // פנסיה
  | 'investments' // השקעות
  | 'benefits' // הטבות
  | 'banking' // בנקאות
  | 'insurance' // ביטוח
  | 'business' // עסקים
  | 'general' // כללי

export interface SearchFilters {
  category?: QuestionCategory
  tags?: string[]
  hasAnswers?: boolean
  isAnswered?: boolean
  sortBy?: 'newest' | 'oldest' | 'votes' | 'views' | 'activity'
  dateRange?: {
    start: string
    end: string
  }
}

export interface ModerationAction {
  id: string
  moderatorId: string
  targetId: string
  targetType: 'question' | 'answer'
  action: 'approve' | 'reject' | 'edit' | 'delete' | 'close'
  reason?: string
  createdAt: string
}

export const CATEGORIES: Record<QuestionCategory, string> = {
  taxes: 'מסים',
  mortgage: 'משכנתא',
  pension: 'פנסיה וקופת גמל',
  investments: 'השקעות',
  benefits: 'הטבות ותמיכות',
  banking: 'בנקאות',
  insurance: 'ביטוח',
  business: 'עסקים וחברות',
  general: 'כללי',
}

export const BADGE_LABELS: Record<UserBadge, string> = {
  expert: 'מומחה',
  superuser: 'משתמש על',
  verified: 'מאומת',
  community_star: 'כוכב הקהילה',
}

export const BADGE_COLORS: Record<UserBadge, string> = {
  expert: 'bg-purple-100 text-purple-800',
  superuser: 'bg-blue-100 text-blue-800',
  verified: 'bg-green-100 text-green-800',
  community_star: 'bg-yellow-100 text-yellow-800',
}
