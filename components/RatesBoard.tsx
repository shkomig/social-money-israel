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

export default function RatesBoard() {
  const data = ratesData as RatesData
  const prime = data.primeRate ?? data.boiRate + 1.5

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow" dir="rtl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">לוח ריביות משכנתא</h2>
        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
          עודכן לאחרונה: {data.lastUpdated}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">ריבית בנק ישראל</p>
          <p className="text-lg font-semibold">{data.boiRate.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">פריים</p>
          <p className="text-lg font-semibold">{prime.toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="mb-1 font-medium">מקושרות למדד</p>
          <ul className="space-y-1">
            <li>קצר: {data.avgMortgage.linked.short}%</li>
            <li>בינוני: {data.avgMortgage.linked.mid}%</li>
            <li>ארוך: {data.avgMortgage.linked.long}%</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 font-medium">לא מקושרות</p>
          <ul className="space-y-1">
            <li>קצר: {data.avgMortgage.unlinked.short}%</li>
            <li>בינוני: {data.avgMortgage.unlinked.mid}%</li>
            <li>ארוך: {data.avgMortgage.unlinked.long}%</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-xs font-medium">מקורות רשמיים:</p>
        <ul className="list-disc pr-4 text-xs text-gray-600">
          <li>
            <a href="https://www.boi.org.il" target="_blank" rel="noreferrer">
              בנק ישראל
            </a>
          </li>
          <li>
            <a href="https://www.gov.il" target="_blank" rel="noreferrer">
              gov.il
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
