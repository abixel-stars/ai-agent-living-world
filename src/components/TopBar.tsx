import { Building2, Clock, Menu, Settings } from 'lucide-react'
import { AGENTS, WORLD_NAME } from '../data/worldData'
import { dayPhase, formatWorldClock, useAppStore } from '../state/useAppStore'
import { useSimSnapshot } from '../simulation/engine'

const PHASE_LABELS: Record<ReturnType<typeof dayPhase>, string> = {
  morning: 'pagi',
  midday: 'siang',
  afternoon: 'sore',
  evening: 'malam',
}

const ACTIVE_ACTIVITIES = ['sitting', 'typing', 'thinking', 'meeting', 'talking']

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const session = useAppStore((s) => s.session)
  const worldMinutes = useAppStore((s) => s.worldMinutes)
  const setNav = useAppStore((s) => s.setNav)
  const select = useAppStore((s) => s.select)
  const snapshots = useSimSnapshot()

  const agentIds = new Set(AGENTS.map((a) => a.id))
  const agentSnapshots = snapshots.filter((s) => agentIds.has(s.id))
  const activeCount = agentSnapshots.filter((s) => ACTIVE_ACTIVITIES.includes(s.activity)).length
  const runningCount = agentSnapshots.filter(
    (s) => s.activity === 'typing' || s.activity === 'meeting',
  ).length

  function openSettings() {
    setNav('settings')
    select({ kind: 'phase', nav: 'settings' })
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-white/70 px-3 backdrop-blur sm:px-4">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Buka menu"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink hover:bg-stone-200/60 lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="hidden min-w-0 items-center gap-2 sm:flex">
        <Building2 size={17} className="shrink-0 text-tangdeep" />
        <span className="truncate text-[13px] font-bold">{WORLD_NAME}</span>
      </div>
      <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block" />

      <div className="flex items-center gap-2">
        <Clock size={17} className="shrink-0 text-inksoft" />
        <span className="text-[13px] font-semibold tabular-nums">
          {formatWorldClock(worldMinutes)}
        </span>
        <span className="text-[13px] capitalize text-inksoft">{PHASE_LABELS[dayPhase(worldMinutes)]}</span>
      </div>

      {session?.mode === 'demo' ? (
        <span className="hidden whitespace-nowrap rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-inksoft md:inline-flex">
          Demo, bukan live
        </span>
      ) : (
        <span className="hidden whitespace-nowrap rounded-full bg-cream px-2.5 py-1 text-xs font-semibold text-inksoft md:inline-flex">
          Live
        </span>
      )}

      <span aria-hidden="true" className="hidden h-5 w-px bg-line md:block" />

      <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5">
        <div className="hidden whitespace-nowrap text-right sm:block">
          <p className="text-[13px] font-semibold tabular-nums leading-tight">{activeCount}</p>
          <p className="text-[13px] leading-tight text-inksoft">Agent aktif (demo)</p>
        </div>
        <div className="hidden whitespace-nowrap text-right sm:block">
          <p className="text-[13px] font-semibold tabular-nums leading-tight">{runningCount}</p>
          <p className="text-[13px] leading-tight text-inksoft">Tugas berjalan (demo)</p>
        </div>
        <div className="hidden whitespace-nowrap text-right xl:block" title="Belum ada provider terhubung.">
          <p className="text-[13px] font-semibold tabular-nums leading-tight">Rp 0 (demo)</p>
          <p className="text-[13px] leading-tight text-inksoft">Biaya API hari ini</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white sm:flex">
            {(session?.userName || '?').slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden max-w-[120px] truncate text-[13px] font-semibold lg:block">
            {session?.userName}
          </span>
          <button
            type="button"
            onClick={openSettings}
            aria-label="Buka pengaturan"
            title="Pengaturan"
            className="flex h-9 w-9 items-center justify-center rounded-full text-inksoft hover:bg-stone-200/60 hover:text-ink"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
    </header>
  )
}
