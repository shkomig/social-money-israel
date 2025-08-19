'use client'

import React, { useState } from 'react'
import { LOGO_VERSION } from '@/lib/constants'

type LogoProps = {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  // Try primary logo, then alternates; cache-bust to avoid stale cached zero-byte assets
  const fallback = `/images/social-money-logo-official-256.png?v=${LOGO_VERSION}`
  const srcsetPng = `/images/social-money-logo-official-64.png?v=${LOGO_VERSION} 64w, /images/social-money-logo-official-128.png?v=${LOGO_VERSION} 128w, /images/social-money-logo-official-256.png?v=${LOGO_VERSION} 256w, /images/social-money-logo-official-512.png?v=${LOGO_VERSION} 512w`
  const srcsetWebp = `/images/social-money-logo-official-64.webp?v=${LOGO_VERSION} 64w, /images/social-money-logo-official-128.webp?v=${LOGO_VERSION} 128w, /images/social-money-logo-official-256.webp?v=${LOGO_VERSION} 256w, /images/social-money-logo-official-512.webp?v=${LOGO_VERSION} 512w`
  const srcsetAvif = `/images/social-money-logo-official-64.avif?v=${LOGO_VERSION} 64w, /images/social-money-logo-official-128.avif?v=${LOGO_VERSION} 128w, /images/social-money-logo-official-256.avif?v=${LOGO_VERSION} 256w, /images/social-money-logo-official-512.avif?v=${LOGO_VERSION} 512w`

  const [errored, setErrored] = useState(false)

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcsetAvif} sizes="(max-width: 640px) 128px, 256px" />
      <source type="image/webp" srcSet={srcsetWebp} sizes="(max-width: 640px) 128px, 256px" />
      <img
        src={errored ? `/images/logo-backup.svg?v=${LOGO_VERSION}` : fallback}
        srcSet={srcsetPng}
        sizes="(max-width: 640px) 128px, 256px"
        alt="כסף חברתי — הלוגו הרשמי"
        className={`select-none h-10 w-auto ${className ?? ''}`}
        decoding="async"
        loading="eager"
        draggable={false}
        width={256}
        height={64}
        onError={() => setErrored(true)}
      />
    </picture>
  )
}
