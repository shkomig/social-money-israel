import type { Metadata, Viewport } from 'next'
import { LOGO_VERSION } from '@/lib/constants'
import './globals.css'
import Providers from '@/components/Providers'
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'כסף חברתי - מחשבונים פיננסיים וזכויות סוציאליות',
  description:
    'פלטפורמה מתקדמת למחשבונים פיננסיים בישראל: החזר מס, מענק עבודה, מחזור משכנתאות וזכויות סוציאליות. כלים מדויקים ומעודכנים לשנת 2024-2025.',
  keywords: 'החזר מס, מענק עבודה, מחזור משכנתא, זכויות נכות, פנסיה, קופת גמל, מחשבונים פיננסיים',
  authors: [{ name: 'כסף חברתי' }],
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: `/favicon.svg?v=${LOGO_VERSION}`, type: 'image/svg+xml' },
      { url: `/favicon.ico?v=${LOGO_VERSION}` },
    ],
    apple: `/apple-touch-icon.png?v=${LOGO_VERSION}`,
  },
  openGraph: {
    title: 'כסף חברתי - מחשבונים פיננסיים וזכויות סוציאליות',
    description: 'מחשבונים מדויקים להחזר מס, מענק עבודה ומחזור משכנתאות בישראל',
    url: 'https://social-money-israel.netlify.app',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="כסף חברתי" />
        <link
          rel="preload"
          href={`/images/social-money-logo-official-256.avif?v=${LOGO_VERSION}`}
          as="image"
          type="image/avif"
        />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'כסף חברתי',
              url: 'https://social-money-israel.netlify.app',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  email: 'socialmoneyisrael@gmail.com',
                  contactType: 'customer support',
                  inLanguage: 'he',
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'כסף חברתי',
              url: 'https://social-money-israel.netlify.app',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://social-money-israel.netlify.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
          ])}
        </script>
      </head>
      <body className="font-sans antialiased bg-gray-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          דלג לתוכן הראשי
        </a>
        <div id="main-content">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
