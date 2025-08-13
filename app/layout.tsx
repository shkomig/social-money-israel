import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { LOGO_VERSION } from '@/lib/constants'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'כסף חברתי - מחשבונים פיננסיים וזכויות סוציאליות',
  description:
    'פלטפורמה מתקדמת למחשבונים פיננסיים בישראל: החזר מס, מענק עבודה, מחזור משכנתאות וזכויות סוציאליות. כלים מדויקים ומעודכנים לשנת 2024-2025.',
  keywords:
    'החזר מס, מענק עבודה, מחזור משכנתא, זכויות נכות, פנסיה, קופת גמל, מחשבונים פיננסיים',
  authors: [{ name: 'כסף חברתי' }],
  robots: 'index, follow',
  openGraph: {
    title: 'כסף חברתי - מחשבונים פיננסיים וזכויות סוציאליות',
    description: 'מחשבונים מדויקים להחזר מס, מענק עבודה ומחזור משכנתאות בישראל',
    url: 'https://social-money.vercel.app',
    siteName: 'כסף חברתי',
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'כסף חברתי - מחשבונים פיננסיים',
    description: 'מחשבונים מדויקים להחזר מס, מענק עבודה ומחזור משכנתאות בישראל',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href={`/favicon.svg?v=${LOGO_VERSION}`} type="image/svg+xml" />
        <link rel="alternate icon" href={`/favicon.ico?v=${LOGO_VERSION}`} />
        <link rel="apple-touch-icon" href={`/favicon.svg?v=${LOGO_VERSION}`} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="כסף חברתי" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          דלג לתוכן הראשי
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  )
}
