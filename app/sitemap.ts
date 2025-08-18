import { MetadataRoute } from 'next'

const now = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://social-money-israel.netlify.app'

  return [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/calculators`, lastModified: now },
    { url: `${baseUrl}/calculators/mortgage-refinance`, lastModified: now },
    { url: `${baseUrl}/calculators/tax-refund`, lastModified: now },
    { url: `${baseUrl}/calculators/work-grant`, lastModified: now },
    { url: `${baseUrl}/resources`, lastModified: now },
  ]
}
