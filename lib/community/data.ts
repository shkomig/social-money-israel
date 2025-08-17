import { Question, Answer, SearchFilters } from './types'

// Mock data for demonstration - in real app this would come from API/database
export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'האם כדאי לי לעשות מחזור משכנתא עכשיו?',
    content:
      'יש לי משכנתא של 800,000 ש״ח עם ריבית של 4.5%. הבנק מציע לי מחזור לריבית של 3.8%. האם זה כדאי? מה העלויות?',
    tags: ['משכנתא', 'מחזור', 'ריבית'],
    authorId: 'user1',
    authorName: 'דני כהן',
    createdAt: '2025-08-15T10:30:00Z',
    updatedAt: '2025-08-15T10:30:00Z',
    views: 156,
    votes: 8,
    answersCount: 3,
    isClosed: false,
    isModerated: true,
    category: 'mortgage',
  },
  {
    id: 'q2',
    title: 'זכאות למענק עבודה לעובד זר',
    content: 'אני עובד זר עם אשרת עבודה. האם אני זכאי למענק עבודה (מס הכנסה שלילי)? מה התנאים?',
    tags: ['מענק עבודה', 'עובד זר', 'זכאות'],
    authorId: null,
    authorName: 'משתמש אנונימי',
    createdAt: '2025-08-14T15:45:00Z',
    updatedAt: '2025-08-14T15:45:00Z',
    views: 89,
    votes: 5,
    answersCount: 2,
    isClosed: false,
    isModerated: true,
    category: 'benefits',
  },
  {
    id: 'q3',
    title: 'איך לחשב החזר מס על הוצאות רפואיות?',
    content:
      'יש לי הוצאות רפואיות גבוהות השנה. איך אני מחשב את זכאותי להחזר מס? האם יש מגבלה על הסכום?',
    tags: ['החזר מס', 'הוצאות רפואיות', 'זיכוי'],
    authorId: 'user2',
    authorName: 'מיכל לוי',
    createdAt: '2025-08-13T09:15:00Z',
    updatedAt: '2025-08-13T09:15:00Z',
    views: 234,
    votes: 12,
    answersCount: 4,
    isClosed: false,
    isModerated: true,
    category: 'taxes',
  },
  {
    id: 'q4',
    title: 'השקעה בקופת גמל להשלמת הכנסה vs חיסכון עצמאי',
    content:
      'אני בן 35 ורוצה להתחיל לחסוך לפנסיה. מה יותר כדאי - להגדיל את התשלום לקופת גמל או לחסוך בעצמי?',
    tags: ['קופת גמל', 'פנסיה', 'השקעות', 'חיסכון'],
    authorId: 'user3',
    authorName: 'יוסי אברמוביץ',
    createdAt: '2025-08-12T14:20:00Z',
    updatedAt: '2025-08-12T14:20:00Z',
    views: 178,
    votes: 15,
    answersCount: 6,
    isClosed: false,
    isModerated: true,
    category: 'pension',
  },
  {
    id: 'q5',
    title: 'פתיחת עסק - מה ההבדל בין עוסק מורשה לחברה?',
    content:
      'אני רוצה לפתוח עסק קטן. מה ההבדלים המעשיים בין רישום כעוסק מורשה לעומת הקמת חברה? מה יותר כדאי?',
    tags: ['עוסק מורשה', 'חברה', 'מיסוי', 'עסק'],
    authorId: 'user4',
    authorName: 'רחל גרין',
    createdAt: '2025-08-11T11:30:00Z',
    updatedAt: '2025-08-11T11:30:00Z',
    views: 312,
    votes: 18,
    answersCount: 8,
    isClosed: false,
    isModerated: true,
    category: 'business',
  },
]

export const MOCK_ANSWERS: Answer[] = [
  {
    id: 'a1',
    questionId: 'q1',
    content:
      'מחזור משכנתא יכול להיות כדאי אם החיסכון החודשי מצדיק את העלויות. עליך לחשב: 1) עלות המחזור (בדיקת משכנתא, שמאות, עמלות) 2) החיסכון החודשי 3) תקופת החזר השקעה. במקרה שלך, הפרש של 0.7% על 800,000 ש״ח זה בערך 467 ש״ח חיסכון חודשי. אם העלויות הן סביב 8,000-15,000 ש״ח, זה יחזור לך תוך 18-32 חודשים.',
    authorId: 'expert1',
    authorName: 'יועץ משכנתאות מוסמך',
    createdAt: '2025-08-15T11:00:00Z',
    updatedAt: '2025-08-15T11:00:00Z',
    votes: 12,
    isAccepted: true,
    isModerated: true,
    isBestAnswer: true,
  },
  {
    id: 'a2',
    questionId: 'q2',
    content:
      'עובדים זרים עם אשרת עבודה זכאים למענק עבודה בתנאים מסוימים. התנאים העיקריים: 1) אשרת עבודה בתוקף 2) הכנסה מתחת לסף הקבוע 3) תושבות במשך חלק מהשנה. מומלץ לפנות לרשות המסים או לייעוץ מס לבדיקה מדויקת של המקרה הספציפי.',
    authorId: 'expert2',
    authorName: 'רואה חשבון',
    createdAt: '2025-08-14T16:15:00Z',
    updatedAt: '2025-08-14T16:15:00Z',
    votes: 8,
    isAccepted: false,
    isModerated: true,
    isBestAnswer: false,
  },
  {
    id: 'a3',
    questionId: 'q3',
    content:
      'החזר מס על הוצאות רפואיות כפוף למגבלות וחוקים מדויקים. אתה יכול לקבל זיכוי על: 1) הוצאות על רופא פרטי מעל הסכום השנתי המותר 2) תרופות מעל השיתוף העצמי 3) טיפולים שאינם בסל הבריאות. חשוב לשמור על כל הקבלות ולוודא שהרופאים מוכרים על ידי משרד הבריאות.',
    authorId: 'expert3',
    authorName: 'יועץ מס',
    createdAt: '2025-08-13T10:30:00Z',
    updatedAt: '2025-08-13T10:30:00Z',
    votes: 15,
    isAccepted: true,
    isModerated: true,
    isBestAnswer: true,
  },
]

export const COMMON_KEYWORDS = [
  'משכנתא',
  'מס הכנסה',
  'החזר מס',
  'פנסיה',
  'קופת גמל',
  'מענק עבודה',
  'ביטוח לאומי',
  'זכאות',
  'הטבות',
  'עוסק מורשה',
  'חברה',
  'השקעות',
  'ריבית',
  'מחזור',
  'זיכוי מס',
  'הוצאות רפואיות',
  'ארנונה',
  'מעמ',
]

export const SUGGESTED_TAGS = [
  'משכנתא',
  'מס-הכנסה',
  'פנסיה',
  'קופת-גמל',
  'מענק-עבודה',
  'החזר-מס',
  'השקעות',
  'ביטוח',
  'עוסק-מורשה',
  'חברה',
  'זכאות',
  'הטבות',
  'ריבית',
  'מחזור',
  'זיכוי',
  'הוצאות-רפואיות',
  'בנקאות',
  'ארנונה',
]

export function searchQuestions(query: string, filters: SearchFilters = {}): Question[] {
  let results = [...MOCK_QUESTIONS]

  // Text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ')
    results = results.filter((q) =>
      searchTerms.some(
        (term) =>
          q.title.toLowerCase().includes(term) ||
          q.content.toLowerCase().includes(term) ||
          q.tags.some((tag) => tag.toLowerCase().includes(term)),
      ),
    )
  }

  // Category filter
  if (filters.category) {
    results = results.filter((q) => q.category === filters.category)
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((q) => filters.tags!.some((tag) => q.tags.includes(tag)))
  }

  // Has answers filter
  if (filters.hasAnswers !== undefined) {
    results = results.filter((q) =>
      filters.hasAnswers ? q.answersCount > 0 : q.answersCount === 0,
    )
  }

  // Sort
  const sortBy = filters.sortBy || 'newest'
  results.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'votes':
        return b.votes - a.votes
      case 'views':
        return b.views - a.views
      case 'activity':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      default:
        return 0
    }
  })

  return results
}

export function getQuestionById(id: string): Question | undefined {
  return MOCK_QUESTIONS.find((q) => q.id === id)
}

export function getAnswersByQuestionId(questionId: string): Answer[] {
  return MOCK_ANSWERS.filter((a) => a.questionId === questionId).sort((a, b) => {
    // Accepted answers first, then by votes
    if (a.isAccepted && !b.isAccepted) return -1
    if (!a.isAccepted && b.isAccepted) return 1
    return b.votes - a.votes
  })
}

export function highlightKeywords(text: string, keywords: string[]): string {
  if (!keywords.length) return text

  const regex = new RegExp(`(${keywords.join('|')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}
