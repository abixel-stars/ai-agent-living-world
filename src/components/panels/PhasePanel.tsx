import { NAV_ITEMS } from '../../data/worldData'
import type { NavKey } from '../../types'

export default function PhasePanel({ nav }: { nav: NavKey }) {
  const item = NAV_ITEMS.find((n) => n.key === nav)
  const phaseOne = NAV_ITEMS.filter((n) => n.phase === 1)

  if (!item) {
    return <p className="text-sm text-inksoft">Menu tidak ditemukan.</p>
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold leading-tight">Fitur ini hadir di Fase {item.phase}</h2>
        <p className="mt-2 text-sm leading-relaxed text-inksoft">{item.note}.</p>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Yang sudah bisa dipakai sekarang
        </h3>
        <ul className="mt-2 space-y-1">
          {phaseOne.map((entry) => (
            <li
              key={entry.key}
              className="border-b border-line/70 py-2 text-sm last:border-b-0"
            >
              <span className="font-semibold">{entry.label}</span>
              <span className="text-inksoft">, {entry.note.toLowerCase()}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-relaxed text-inksoft">
          Semua yang terlihat sekarang adalah simulasi visual demo, bukan
          pekerjaan AI nyata.
        </p>
      </section>
    </div>
  )
}
