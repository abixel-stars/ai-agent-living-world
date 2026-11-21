import { formatWorldClock, useAppStore } from '../../state/useAppStore'
import type { TickerItem } from '../../types'

const KIND_LABELS: Record<TickerItem['kind'], string> = {
  info: 'Info',
  move: 'Perpindahan',
  work: 'Kerja',
  owner: 'Pemilik',
}

export default function ActivityPanel() {
  const ticker = useAppStore((s) => s.ticker)

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-lg font-bold leading-tight">Activity</h2>
        <p className="mt-1 text-sm leading-relaxed text-inksoft">
          Jejak simulasi visual, bukan log kerja AI.
        </p>
      </section>

      {ticker.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-inksoft">Belum ada aktivitas.</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {ticker.map((item) => (
            <li
              key={item.id}
              className="flex items-baseline gap-3 border-b border-line/70 py-2.5 last:border-b-0"
            >
              <span className="shrink-0 text-[13px] font-semibold tabular-nums">
                {formatWorldClock(item.atMinutes)}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed">{item.text}</span>
              <span className="shrink-0 text-[11px] font-semibold text-inksoft">
                {KIND_LABELS[item.kind]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
