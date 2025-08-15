'use client'

import React, { useEffect, useRef, useState } from 'react'

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
          aria-label="וידאו פתיח המציג את כסף חברתי"
          className="w-full h-auto object-contain"
        />
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-3 left-3 md:bottom-4 md:left-4 rounded-full bg-white/80 hover:bg-white text-gray-900 backdrop-blur px-3 py-1.5 text-xs md:text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isMuted ? 'הפעל קול' : 'השתק וידאו'}
        >
          {isMuted ? 'הפעל קול' : 'השתק'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center">
        הווידאו מושמע אוטומטית ללא תמונת פתיחה. ניתן להדליק קול מהכפתור.
      </p>
    </div>
  )
}
