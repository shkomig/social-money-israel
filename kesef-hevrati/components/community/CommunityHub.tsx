'use client'

import { useState } from 'react'
import { Question } from '@/lib/community/types'
import QuestionSearch from '@/components/community/QuestionSearch'
import QuestionDetail from '@/components/community/QuestionDetail'
import NewQuestionForm from '@/components/community/NewQuestionForm'

type ViewMode = 'search' | 'detail' | 'new-question'

export default function CommunityHub() {
  const [viewMode, setViewMode] = useState<ViewMode>('search')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question)
    setViewMode('detail')
  }

  const handleBackToSearch = () => {
    setSelectedQuestion(null)
    setViewMode('search')
  }

  const handleNewQuestion = () => {
    setViewMode('new-question')
  }

  const handleQuestionSubmit = (questionData: {
    title: string
    content: string
    category: import('@/lib/community/types').QuestionCategory
    tags: string[]
    isAnonymous: boolean
  }) => {
    // Here you would submit to your backend
    console.log('New question:', questionData)
    alert('השאלה נשלחה בהצלחה! היא תעבור בדיקת מודרציה ותפורסם בקרוב.')
    setViewMode('search')
  }

  const handleCancelNewQuestion = () => {
    setViewMode('search')
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">קהילת שאלות ותשובות פיננסיות</h1>
              <p className="text-gray-600 mt-1">קבל עזרה מהקהילה ומומחים בנושאים פיננסיים בישראל</p>
            </div>
            {viewMode === 'search' && (
              <button
                onClick={handleNewQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                שאל שאלה חדשה
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'search' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-sm text-gray-600">שאלות בקהילה</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3,891</p>
                    <p className="text-sm text-gray-600">תשובות ניתנו</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                    <p className="text-sm text-gray-600">מומחים פעילים</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">89%</p>
                    <p className="text-sm text-gray-600">שאלות נענו</p>
                  </div>
                </div>
              </div>
            </div>

            <QuestionSearch onQuestionSelect={handleQuestionSelect} />
          </>
        )}

        {viewMode === 'detail' && selectedQuestion && (
          <QuestionDetail question={selectedQuestion} onBack={handleBackToSearch} />
        )}

        {viewMode === 'new-question' && (
          <NewQuestionForm onSubmit={handleQuestionSubmit} onCancel={handleCancelNewQuestion} />
        )}
      </div>

      {/* Community Guidelines Footer */}
      {viewMode === 'search' && (
        <div className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">איך זה עובד?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• שאל שאלות פיננסיות ברמה מקצועית</li>
                  <li>• קבל תשובות מומחים ומשתמשי הקהילה</li>
                  <li>• הצבע לתשובות טובות וחפש בקלות</li>
                  <li>• צבור מוניטין ובנה פרופיל קהילתי</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">נושאים פופולריים</h3>
                <div className="flex flex-wrap gap-2">
                  {['משכנתא', 'מס הכנסה', 'פנסיה', 'השקעות', 'מענק עבודה', 'ביטוח'].map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">כללי הקהילה</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• שמור על נימוס ויחס מכבד</li>
                  <li>• ספק מידע מדויק ומקורות אמינים</li>
                  <li>• הימנע מייעוץ פיננסי אישי ספציפי</li>
                  <li>• דווח על תוכן לא הולם למודרציה</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
