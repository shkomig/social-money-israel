'use client'

import { useState, useMemo } from 'react'
import { Question, QuestionCategory, SearchFilters, CATEGORIES } from '@/lib/community/types'
import { searchQuestions, SUGGESTED_TAGS, highlightKeywords } from '@/lib/community/data'
import { UserDisplay, TagsDisplay, StatsDisplay, RelativeTime } from './SharedComponents'

interface QuestionSearchProps {
  onQuestionSelect: (question: Question) => void
  className?: string
}

export default function QuestionSearch({ onQuestionSelect, className = '' }: QuestionSearchProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const searchResults = useMemo(() => {
    return searchQuestions(query, { ...filters, tags: selectedTags })
  }, [query, filters, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleCategoryChange = (category: QuestionCategory | '') => {
    setFilters((prev) => ({ ...prev, category: category || undefined }))
  }

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  const clearFilters = () => {
    setQuery('')
    setFilters({})
    setSelectedTags([])
  }

  const searchKeywords = query.split(' ').filter((k) => k.length > 1)

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      {/* Search Header */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">חיפוש שאלות פיננסיות</h2>

        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
            חפש שאלות
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="חפש לפי מילות מפתח, תגים או נושא..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              קטגוריה
            </label>
            <select
              id="category-filter"
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value as QuestionCategory | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">כל הקטגוריות</option>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
              מיון
            </label>
            <select
              id="sort-filter"
              value={filters.sortBy || 'newest'}
              onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">החדשות ביותר</option>
              <option value="votes">הכי מצוייות</option>
              <option value="views">הכי נצפות</option>
              <option value="activity">פעילות אחרונה</option>
            </select>
          </div>

          {/* Answer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס תשובות</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, hasAnswers: undefined }))}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.hasAnswers === undefined
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                הכל
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, hasAnswers: true }))}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.hasAnswers === true
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                יש תשובות
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, hasAnswers: false }))}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filters.hasAnswers === false
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                ללא תשובות
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">תגים פופולריים</label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters & Clear */}
        {(query ||
          filters.category ||
          selectedTags.length > 0 ||
          filters.hasAnswers !== undefined) && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600">נמצאו {searchResults.length} תוצאות</div>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              נקה כל הסינונים
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {searchResults.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">לא נמצאו תוצאות</h3>
            <p className="text-gray-600">נסו להרחיב את הקריטריונים או לנסח את השאלה אחרת</p>
          </div>
        ) : (
          searchResults.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onQuestionSelect(question)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3
                    className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywords(question.title, searchKeywords),
                    }}
                  />
                  <div
                    className="text-gray-600 text-sm mb-3 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeywords(
                        question.content.substring(0, 200) + '...',
                        searchKeywords,
                      ),
                    }}
                  />
                </div>
                <div className="text-right ml-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      question.answersCount > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {CATEGORIES[question.category]}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-4">
                  <StatsDisplay
                    views={question.views}
                    answers={question.answersCount}
                    votes={question.votes}
                  />
                </div>
              </div>

              {question.tags.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <TagsDisplay tags={question.tags} onTagClick={handleTagToggle} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
