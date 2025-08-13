'use client'

import React, { useCallback, useState } from 'react'
import { LOGO_VERSION } from '@/lib/constants'

export default function Logo() {
  // Try primary logo, then alternates; cache-bust to avoid stale cached zero-byte assets
  const sources = [
    // New official asset (please place the attached file at public/images/social-money-logo-official.png)
    `/images/social-money-logo-official.png?v=${LOGO_VERSION}`,
    `/images/social-money-logo.png?v=${LOGO_VERSION}`,
    `/images/social-money-logo-new.png?v=${LOGO_VERSION}`,
    `/images/logo.png?v=${LOGO_VERSION}`,
    `/images/logo-backup.svg?v=${LOGO_VERSION}`,
  ] as const

  const [idx, setIdx] = useState(0)
  const handleError = useCallback(() => setIdx((i) => Math.min(i + 1, sources.length - 1)), [])

  return (
    <img
      src={sources[idx]}
      alt="כסף חברתי — הלוגו הרשמי"
      className="select-none h-10 w-auto"
      decoding="async"
      loading="eager"
      draggable="false"
      onError={handleError}
    />
  )
}
