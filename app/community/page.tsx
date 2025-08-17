import CommunityHub from '@/components/community/CommunityHub'
import Layout from '@/components/Layout'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'קהילת שאלות ותשובות פיננסיות | כסף חברתי',
  description:
    'קבל עזרה מקהילת המומחים בנושאים פיננסיים בישראל. שאל שאלות, קבל תשובות מקצועיות ושתף ידע פיננסי.',
  keywords: 'שאלות ותשובות, פיננסים, ייעוץ פיננסי, קהילה, מומחים, ישראל, מס, משכנתא, פנסיה',
}

export default function CommunityPage() {
  return (
    <Layout>
      <CommunityHub />
    </Layout>
  )
}
