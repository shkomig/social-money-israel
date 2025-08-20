'use client'

import { useState } from 'react'
import { QuestionCategory, CATEGORIES } from '@/lib/community/types'
import { SUGGESTED_TAGS } from '@/lib/community/data'

interface NewQuestionFormProps {
  onSubmit: (question: {
    title: string
    content: string
    category: QuestionCategory
    tags: string[]
    isAnonymous: boolean
  }) => void
  onCancel: () => void
  className?: string
}

export default function NewQuestionForm({
  onSubmit,
  onCancel,
  className = '',
}: NewQuestionFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<QuestionCategory>('general')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) newErrors.title = 'כותרת השאלה חובה'
    else if (title.length < 10) newErrors.title = 'כותרת השאלה חייבת להיות באורך של לפחות 10 תווים'
    else if (title.length > 150) newErrors.title = 'כותרת השאלה לא יכולה להיות ארוכה מ-150 תווים'

    if (!content.trim()) newErrors.content = 'תוכן השאלה חובה'
    else if (content.length < 50)
      newErrors.content = 'תוכן השאלה חייב להיות באורך של לפחות 50 תווים'
    else if (content.length > 5000) newErrors.content = 'תוכן השאלה לא יכול להיות ארוך מ-5000 תווים'

    if (tags.length === 0) newErrors.tags = 'יש להוסיף לפחות תג אחד'
    else if (tags.length > 5) newErrors.tags = 'ניתן להוסיף עד 5 תגים בלבד'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
        isAnonymous,
      })
    }
  }

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase()
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 5) {
      setTags([...tags, cleanTag])
      setNewTag('')
      setErrors((prev) => ({ ...prev, tags: '' }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      addTag(newTag)
    }
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`} dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">שאל שאלה חדשה</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 p-2"
          aria-label="סגור"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Anonymous Option */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-blue-900">שאל באופן אנונימי</span>
              <p className="text-xs text-blue-700 mt-1">
                השאלה תפורסם ללא חשיפת שמך. השם יוצג כ"משתמש אנונימי"
              </p>
            </div>
          </label>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="question-title" className="block text-sm font-medium text-gray-700 mb-2">
            כותרת השאלה *
          </label>
          <input
            id="question-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="כתוב כותרת תמציתית וברורה לשאלה שלך..."
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={150}
          />
          {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
          <p className="text-xs text-gray-500 mt-1">{title.length}/150 תווים</p>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="question-category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            קטגוריה *
          </label>
          <select
            id="question-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as QuestionCategory)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="question-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            תוכן השאלה *
          </label>
          <textarea
            id="question-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="פרט את שאלתך בצורה ברורה. כלול כל הפרטים הרלוונטיים כמו סכומים, תאריכים, מצב אישי וכו'..."
            rows={8}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y ${
              errors.content ? 'border-red-300' : 'border-gray-300'
            }`}
            maxLength={5000}
          />
          {errors.content && <p className="text-red-600 text-xs mt-1">{errors.content}</p>}
          <p className="text-xs text-gray-500 mt-1">{content.length}/5000 תווים</p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תגים * ({tags.length}/5)
          </label>

          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label={`הסר תג ${tag}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add Tag Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="הוסף תג חדש..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={tags.length >= 5}
            />
            <button
              type="button"
              onClick={() => addTag(newTag)}
              disabled={!newTag.trim() || tags.length >= 5}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              הוסף
            </button>
          </div>

          {/* Suggested Tags */}
          <div>
            <p className="text-xs text-gray-600 mb-2">תגים מוצעים:</p>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_TAGS.filter((tag) => !tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={tags.length >= 5}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>

          {errors.tags && <p className="text-red-600 text-xs mt-1">{errors.tags}</p>}
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">הנחיות לשאלה טובה:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• כתוב כותרת ברורה ותמציתית</li>
            <li>• פרט את המצב הספציפי שלך</li>
            <li>• כלול סכומים, תאריכים ופרטים רלוונטיים</li>
            <li>• בחר תגים רלוונטיים לנושא</li>
            <li>• הימנע משאלות כפולות או רחבות מדי</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            פרסם שאלה
          </button>
        </div>
      </form>
    </div>
  )
}
