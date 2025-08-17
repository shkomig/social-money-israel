'use client'

import { useState } from 'react'
import { Question, Answer } from '@/lib/community/types'
import { getAnswersByQuestionId } from '@/lib/community/data'
import {
  UserDisplay,
  VoteButtons,
  TagsDisplay,
  StatsDisplay,
  RelativeTime,
} from './SharedComponents'

interface QuestionDetailProps {
  question: Question
  onBack: () => void
  className?: string
}

export default function QuestionDetail({ question, onBack, className = '' }: QuestionDetailProps) {
  const [answers] = useState<Answer[]>(getAnswersByQuestionId(question.id))
  const [newAnswer, setNewAnswer] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)
  const [isAnonymousAnswer, setIsAnonymousAnswer] = useState(false)

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAnswer.trim().length < 50) {
      alert('התשובה חייבת להיות באורך של לפחות 50 תווים')
      return
    }

    // Here you would submit the answer to your backend
    console.log('New answer:', {
      questionId: question.id,
      content: newAnswer.trim(),
      isAnonymous: isAnonymousAnswer,
    })

    // Reset form
    setNewAnswer('')
    setIsAnonymousAnswer(false)
    setIsAnswering(false)
    alert('התשובה נשלחה בהצלחה!')
  }

  const handleVote = (targetId: string, value: 1 | -1) => {
    // Here you would handle voting logic
    console.log('Vote:', { targetId, value })
  }

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      {/* Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          חזרה לתוצאות החיפוש
        </button>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start gap-4">
          <VoteButtons
            votes={question.votes}
            onUpvote={() => handleVote(question.id, 1)}
            onDownvote={() => handleVote(question.id, -1)}
          />

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {question.title}
              </h1>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full shrink-0 mr-4">
                {question.category === 'mortgage'
                  ? 'משכנתא'
                  : question.category === 'taxes'
                    ? 'מסים'
                    : question.category === 'benefits'
                      ? 'הטבות'
                      : question.category === 'pension'
                        ? 'פנסיה'
                        : 'כללי'}
              </span>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {question.content}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <UserDisplay
                  authorId={question.authorId}
                  authorName={question.authorName}
                  badges={
                    question.authorId === 'expert1'
                      ? ['expert']
                      : question.authorId === 'expert2'
                        ? ['verified']
                        : []
                  }
                />
                <RelativeTime timestamp={question.createdAt} />
              </div>
              <StatsDisplay
                views={question.views}
                answers={question.answersCount}
                votes={question.votes}
              />
            </div>

            {question.tags.length > 0 && (
              <div className="pt-4 border-t">
                <TagsDisplay tags={question.tags} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{answers.length} תשובות</h2>
          <button
            onClick={() => setIsAnswering(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            הוסף תשובה
          </button>
        </div>

        {/* New Answer Form */}
        {isAnswering && (
          <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={isAnonymousAnswer}
                    onChange={(e) => setIsAnonymousAnswer(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-900">ענה באופן אנונימי</span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="new-answer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  התשובה שלך
                </label>
                <textarea
                  id="new-answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="כתוב תשובה מפורטת ומועילה. כלול הסברים, דוגמאות וקישורים רלוונטיים..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                  maxLength={3000}
                />
                <p className="text-xs text-gray-500 mt-1">{newAnswer.length}/3000 תווים</p>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsAnswering(false)
                    setNewAnswer('')
                    setIsAnonymousAnswer(false)
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={newAnswer.trim().length < 50}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  פרסם תשובה
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Answers List */}
        <div className="space-y-6">
          {answers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">אין תשובות עדיין</h3>
              <p className="text-gray-600 mb-4">היה הראשון לענות על השאלה הזו!</p>
              <button
                onClick={() => setIsAnswering(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                כתוב תשובה
              </button>
            </div>
          ) : (
            answers.map((answer, index) => (
              <div
                key={answer.id}
                className={`flex items-start gap-4 ${index > 0 ? 'pt-6 border-t' : ''}`}
              >
                <VoteButtons
                  votes={answer.votes}
                  onUpvote={() => handleVote(answer.id, 1)}
                  onDownvote={() => handleVote(answer.id, -1)}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {answer.isAccepted && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        תשובה מקובלת
                      </span>
                    )}
                    {answer.isBestAnswer && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        התשובה הטובה ביותר
                      </span>
                    )}
                  </div>

                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <UserDisplay
                      authorId={answer.authorId}
                      authorName={answer.authorName}
                      badges={
                        answer.authorId === 'expert1'
                          ? ['expert']
                          : answer.authorId === 'expert2'
                            ? ['verified']
                            : answer.authorId === 'expert3'
                              ? ['expert']
                              : []
                      }
                    />
                    <RelativeTime timestamp={answer.createdAt} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
