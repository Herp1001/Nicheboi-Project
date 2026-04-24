import type { ScoreCard as ScoreCardType, ScoreLevel } from '../types/report'

interface ScoreCardProps {
  scoreCard: ScoreCardType
}

const levelStyles: Record<ScoreLevel, string> = {
  高: 'border-slate-950 bg-slate-950 text-white',
  中: 'border-amber-200 bg-amber-50 text-amber-900',
  低: 'border-slate-200 bg-slate-100 text-slate-700',
}

export default function ScoreCard({ scoreCard }: ScoreCardProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5 text-sm leading-6 text-sky-900">
        {scoreCard.summary}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {scoreCard.items.map((item) => (
          <article
            key={item.dimension}
            className="rounded-3xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-base font-semibold text-slate-950">
                {item.dimension}
              </h4>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelStyles[item.level]}`}
              >
                {item.level}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {item.explanation}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
