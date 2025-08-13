'use client'

import Image from 'next/image'
import React, { useCallback, useState } from 'react'

// All candidate logo paths
const sources = [
  // New official asset (please place the attached file at public/images/social-money-logo-official.png)
  '/images/social-money-logo-official.png?v=20250812',
  '/images/social-money-logo.png?v=20250812',
  '/images/social-money-logo-new.png?v=20250812',
  '/images/logo.png?v=20250812',
  '/images/logo-backup.svg?v=20250812',
] as const

export default function Logo() {
  // Try primary logo, then alternates; cache-bust to avoid stale cached zero-byte assets
  const [idx, setIdx] = useState(0)
  const handleError = useCallback(
    () => setIdx((i) => Math.min(i + 1, sources.length - 1)),
    [sources.length],
  )

  return (
    <Image
      src={sources[idx]}
      width={256}
      height={40}
      alt="כסף חברתי — הלוגו הרשמי"
      className="select-none h-10 w-auto"
      decoding="async"
      loading="eager"
      draggable={false}
      onError={handleError}
      priority
    />
  )
}
