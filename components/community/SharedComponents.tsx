'use client'

import { UserBadge, BADGE_LABELS, BADGE_COLORS } from '@/lib/community/types'

interface UserBadgeProps {
  badge: UserBadge
  size?: 'sm' | 'md'
}

export function UserBadgeComponent({ badge, size = 'sm' }: UserBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${BADGE_COLORS[badge]} ${sizeClasses}`}
    >
      {BADGE_LABELS[badge]}
    </span>
  )
}

interface UserDisplayProps {
  authorId: string | null
  authorName: string
  badges?: UserBadge[]
  showBadges?: boolean
  className?: string
}

export function UserDisplay({
  authorId,
  authorName,
  badges = [],
  showBadges = true,
  className = '',
}: UserDisplayProps) {
  const isAnonymous = !authorId

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {isAnonymous ? (
          <span className="text-gray-500 text-sm">👤 {authorName}</span>
        ) : (
          <span className="text-gray-900 text-sm font-medium">{authorName}</span>
        )}
      </div>
      {showBadges && badges.length > 0 && (
        <div className="flex gap-1">
          {badges.map((badge) => (
            <UserBadgeComponent key={badge} badge={badge} />
          ))}
        </div>
      )}
    </div>
  )
}

interface VoteButtonsProps {
  votes: number
  onUpvote: () => void
  onDownvote: () => void
  userVote?: 1 | -1 | null
  disabled?: boolean
}

export function VoteButtons({
  votes,
  onUpvote,
  onDownvote,
  userVote = null,
  disabled = false,
}: VoteButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onUpvote}
        disabled={disabled}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          userVote === 1 ? 'text-green-600' : 'text-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="הצבע למעלה"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <span
        className={`text-sm font-medium ${votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-500'}`}
      >
        {votes}
      </span>
      <button
        onClick={onDownvote}
        disabled={disabled}
        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
          userVote === -1 ? 'text-red-600' : 'text-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="הצבע למטה"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

interface TagsDisplayProps {
  tags: string[]
  onTagClick?: (tag: string) => void
  className?: string
}

export function TagsDisplay({ tags, onTagClick, className = '' }: TagsDisplayProps) {
  if (!tags.length) return null

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

interface StatsDisplayProps {
  views: number
  answers: number
  votes: number
  className?: string
}

export function StatsDisplay({ views, answers, votes, className = '' }: StatsDisplayProps) {
  return (
    <div className={`flex items-center gap-4 text-sm text-gray-500 ${className}`}>
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span>{views}</span>
      </div>
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>{answers}</span>
      </div>
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{votes}</span>
      </div>
    </div>
  )
}

interface RelativeTimeProps {
  timestamp: string
  className?: string
}

export function RelativeTime({ timestamp, className = '' }: RelativeTimeProps) {
  const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'עכשיו'
    if (diffMins < 60) return `לפני ${diffMins} דקות`
    if (diffHours < 24) return `לפני ${diffHours} שעות`
    if (diffDays === 1) return 'אתמול'
    if (diffDays < 7) return `לפני ${diffDays} ימים`

    return date.toLocaleDateString('he-IL')
  }

  return (
    <time className={`text-sm text-gray-500 ${className}`} dateTime={timestamp}>
      {formatRelativeTime(timestamp)}
    </time>
  )
}
