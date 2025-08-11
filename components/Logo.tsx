"use client"

import React, { useState, useCallback } from 'react'

export default function Logo() {
  const fallbacks = ['/images/logo.png', '/images/social-money-logo.png', '/images/social-money-logo-new.png']
  const [srcIdx, setSrcIdx] = useState(0)

  const handleError = useCallback(() => {
    setSrcIdx((i) => Math.min(i + 1, fallbacks.length - 1))
  }, [])

  return (
    <img
      src={fallbacks[srcIdx]}
      alt="כסף חברתי — הלוגו הרשמי"
      className="h-10 w-auto select-none"
      draggable="false"
      onError={handleError}
    />
  )
}
