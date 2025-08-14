'use client'

import React, { useCallback, useState } from 'react'
import { LOGO_VERSION } from '@/lib/constants'

type LogoProps = {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  // Try primary logo, then alternates; cache-bust to avoid stale cached zero-byte assets
  const sources = [
    `/images/social-money-logo-official.png?v=${LOGO_VERSION}`,
    `/logo.png?v=${LOGO_VERSION}`, // ← נוספה בדיקה ל-root /logo.png
    `/images/social-money-logo.png?v=${LOGO_VERSION}`,
    `/images/social-money-logo-new.png?v=${LOGO_VERSION}`,
    `/images/logo.png?v=${LOGO_VERSION}`,
    `/images/logo-backup.svg?v=${LOGO_VERSION}`,
  ] as const

  const [idx, setIdx] = useState(0)
  const handleError = useCallback(() => {
    setIdx((i) => (i < sources.length - 1 ? i + 1 : i))
  }, [])

  return (
    <img
      src={sources[idx]}
      alt="כסף חברתי — הלוגו הרשמי"
      className={`select-none h-10 w-auto ${className ?? ''}`}
      decoding="async"
      loading="eager"
      draggable={false}
      onError={handleError}
    />
  )
}
