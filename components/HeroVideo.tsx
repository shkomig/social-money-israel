'use client'

import React, { useEffect, useRef, useState } from 'react'
import { LOGO_VERSION } from '@/lib/constants'

type Props = {
  src: string
  className?: string
}

/**
 * HeroVideo
 * - Lazy-loads the video by assigning src only after it enters the viewport (IntersectionObserver).
 * - Autoplays (muted, loop, playsInline), no poster, preload=metadata.
 * - On Safari/iOS, attempts play() once canplay fires.
 * - RTL-friendly container with a small disclaimer below.
 */
export default function HeroVideo({ src, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Lazy-load using IntersectionObserver (~200px root margin)
  useEffect(() => {
    if (shouldLoad) return
    const el = containerRef.current
    if (!el) return

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setShouldLoad(true)
              observer.disconnect()
              break
            }
          }
        },
        { root: null, rootMargin: '200px', threshold: 0.01 },
      )
      observer.observe(el)
      return () => observer.disconnect()
    } else {
      setShouldLoad(true)
    }
  }, [shouldLoad])

  // Try to play on canplay (helps Safari/iOS)
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    const onCanPlay = async () => {
      try {
        vid.muted = isMuted
        await vid.play()
      } catch {
        // Ignore; may require user interaction
      }
    }

    vid.addEventListener('canplay', onCanPlay, { once: true })
    return () => vid.removeEventListener('canplay', onCanPlay)
  }, [shouldLoad, isMuted])

  // Keep DOM video.muted in sync with state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const toggleMute = async () => {
    const vid = videoRef.current
    if (!vid) return
    const next = !isMuted
    setIsMuted(next)
    try {
      vid.muted = next
      if (!next) {
        // user gesture allows sound; ensure playback
        vid.volume = vid.volume || 1
        await vid.play()
      }
    } catch {
      // ignore
    }
  }

  const handleError = () => {
    setHasError(true)
  }

  const retryLoad = () => {
    setHasError(false)
    // force reload the video src briefly to retry
    if (videoRef.current) {
      const vid = videoRef.current
      vid.src = ''
      // small timeout to allow reload
      setTimeout(() => {
        vid.src = shouldLoad ? src : ''
        try {
          vid.load()
        } catch {
          // ignore
        }
      }, 50)
    }
  }

  return (
    <div dir="rtl" ref={containerRef} className={`mx-auto max-w-screen-md ${className ?? ''}`}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-black relative">
        <video
          ref={videoRef}
          src={shouldLoad ? src : undefined}
          playsInline
          muted={isMuted}
          loop
          autoPlay
          preload="metadata"
          poster={`/images/social-money-logo-official-256.png?v=${LOGO_VERSION}`}
          onError={handleError}
          aria-label="וידאו פתיח המציג את כסף חברתי"
          className="w-full h-auto object-contain"
        >
          {/* Prefer WebM if available; keep MP4 as fallback */}
          <source src={shouldLoad ? src.replace(/\.mp4$/, '.webm') : undefined} type="video/webm" />
          <source src={shouldLoad ? src : undefined} type="video/mp4" />
          <track
            src="/video/social-money_intro_30s_1080x1920.he.vtt"
            kind="captions"
            srcLang="he"
            label="עברית"
            default
          />
        </video>
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-3 left-3 md:bottom-4 md:left-4 rounded-full bg-white/80 hover:bg-white text-gray-900 backdrop-blur px-3 py-1.5 text-xs md:text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isMuted ? 'הפעל קול' : 'השתק וידאו'}
        >
          {isMuted ? 'הפעל קול' : 'השתק'}
        </button>
      </div>
      {hasError && (
        <div className="mt-3 text-center">
          <div className="text-sm text-red-600 mb-2">הווידאו נכשל בטעינה.</div>
          <button
            type="button"
            onClick={retryLoad}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            נסה שוב
          </button>
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500 text-center">
        הווידאו מושמע אוטומטית ללא תמונת פתיחה. ניתן להדליק קול מהכפתור.
      </p>
    </div>
  )
}
