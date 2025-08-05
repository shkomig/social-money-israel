import React from 'react'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export default function Logo({
  className = '',
  width = 120,
  height = 60,
}: LogoProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        {/* Community circle with people around dollar symbol */}
        <g className="community-circle">
          {/* Background circle */}
          <circle
            cx="60"
            cy="30"
            r="28"
            fill="#f0f9ff"
            stroke="#0284c7"
            strokeWidth="2"
          />

          {/* Central dollar symbol */}
          <text
            x="60"
            y="38"
            textAnchor="middle"
            className="fill-green-600 text-2xl font-bold"
          >
            ₪
          </text>

          {/* People around the circle - colorful diverse representation */}
          {/* Person 1 - Top */}
          <circle cx="60" cy="8" r="4" fill="#ef4444" opacity="0.8" />
          <rect
            x="58"
            y="12"
            width="4"
            height="6"
            rx="2"
            fill="#ef4444"
            opacity="0.8"
          />

          {/* Person 2 - Top Right */}
          <circle cx="80" cy="15" r="4" fill="#f59e0b" opacity="0.8" />
          <rect
            x="78"
            y="19"
            width="4"
            height="6"
            rx="2"
            fill="#f59e0b"
            opacity="0.8"
          />

          {/* Person 3 - Right */}
          <circle cx="88" cy="30" r="4" fill="#10b981" opacity="0.8" />
          <rect
            x="86"
            y="34"
            width="4"
            height="6"
            rx="2"
            fill="#10b981"
            opacity="0.8"
          />

          {/* Person 4 - Bottom Right */}
          <circle cx="80" cy="45" r="4" fill="#3b82f6" opacity="0.8" />
          <rect
            x="78"
            y="49"
            width="4"
            height="6"
            rx="2"
            fill="#3b82f6"
            opacity="0.8"
          />

          {/* Person 5 - Bottom */}
          <circle cx="60" cy="52" r="4" fill="#8b5cf6" opacity="0.8" />
          <rect
            x="58"
            y="56"
            width="4"
            height="6"
            rx="2"
            fill="#8b5cf6"
            opacity="0.8"
          />

          {/* Person 6 - Bottom Left */}
          <circle cx="40" cy="45" r="4" fill="#ec4899" opacity="0.8" />
          <rect
            x="38"
            y="49"
            width="4"
            height="6"
            rx="2"
            fill="#ec4899"
            opacity="0.8"
          />

          {/* Person 7 - Left */}
          <circle cx="32" cy="30" r="4" fill="#06b6d4" opacity="0.8" />
          <rect
            x="30"
            y="34"
            width="4"
            height="6"
            rx="2"
            fill="#06b6d4"
            opacity="0.8"
          />

          {/* Person 8 - Top Left */}
          <circle cx="40" cy="15" r="4" fill="#84cc16" opacity="0.8" />
          <rect
            x="38"
            y="19"
            width="4"
            height="6"
            rx="2"
            fill="#84cc16"
            opacity="0.8"
          />
        </g>

        {/* Brand text */}
        <text
          x="60"
          y="75"
          textAnchor="middle"
          className="fill-gray-700 text-xs font-semibold"
        >
          Social Money
        </text>
      </svg>
    </div>
  )
}
