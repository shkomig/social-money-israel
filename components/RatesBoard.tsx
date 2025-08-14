import ratesData from '@/data/rates.json'

interface RatesData {
  lastUpdated: string
  boiRate: number
  primeRate?: number
  avgMortgage: {
    linked: { short: number; mid: number; long: number }
    unlinked: { short: number; mid: number; long: number }
  }
}

const fmtPct = (n: number) => `${n.toFixed(2)}%`
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('he-IL', { dateStyle: 'medium' })

export default function RatesBoard() {
  const data = ratesData as RatesData
  const prime = data.primeRate ?? data.boiRate + 1.5

  return (
    <section dir="rtl" className="mx-auto max-w-screen-md">
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900">ריביות משכנתא</h2>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
            עדכון אחרון: {fmtDate(data.lastUpdated)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-100 p-4">
            <div className="text-sm text-gray-600">ריבית בנק ישראל</div>
            <div className="text-2xl font-bold text-gray-900">{fmtPct(data.boiRate)}</div>
            <div className="mt-2 text-sm text-gray-600">פריים (BOI + 1.5%)</div>
            <div className="text-xl font-semibold text-gray-900">{fmtPct(prime)}</div>
          </div>

          <div className="rounded-lg border border-gray-100 p-4">
            <div className="mb-2 text-sm font-medium text-gray-700">ממוצע מסלולים צמודים (מדד)</div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded bg-gray-50 p-2 text-center">
                <dt className="text-gray-600">קצר</dt>
                <dd className="font-semibold text-gray-900">{fmtPct(data.avgMortgage.linked.short)}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2 text-center">
                <dt className="text-gray-600">בינוני</dt>
                <dd className="font-semibold text-gray-900">{fmtPct(data.avgMortgage.linked.mid)}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2 text-center">
                <dt className="text-gray-600">ארוך</dt>
                <dd className="font-semibold text-gray-900">{fmtPct(data.avgMortgage.linked.long)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-gray-100 p-4 md:col-span-2">
            <div className="mb-2 text-sm font-medium text-gray-700">ממוצע מסלולים לא צמודים</div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded bg-gray-50 p-2 text-center">
                <dt className="text-gray-600">קצר</dt>
                <dd className="font-semibold text-gray-900">{fmtPct(data.avgMortgage.unlinked.short)}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2 text-center">
                <dt className="text-gray-600">בינוני</dt>
                <dd className="font-semibold text-gray-900">{fmtPct(data.avgMortgage.unlinked.mid)}</dd>
              </div>
              <div className="rounded bg-gray-50 p-2 text-center">
                <dt className="text-gray-600">ארוך</dt>
                <dd className="font-semibold text-gray-900">{fmtPct(data.avgMortgage.unlinked.long)}</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-2 text-xs text-gray-600">
            המידע אינפורמטיבי בלבד ואינו מהווה ייעוץ פיננסי. מומלץ לאמת מול מקורות רשמיים.
          </div>
        </div>

        <div className="px-4 pb-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-800">מקורות רשמיים</h3>
          <ul className="list-disc pr-5 space-y-1 text-sm text-blue-700">
            <li>
              <a
                href="https://www.boi.org.il/he/Markets/DocLib/Pages/InterestRate.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                ריבית בנק ישראל (BOI)
              </a>
            </li>
            <li>
              <a
                href="https://www.boi.org.il/he/NewsAndPublications/PressReleases/Pages/Default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                הודעות בנק ישראל
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
