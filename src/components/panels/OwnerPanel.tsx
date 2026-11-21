import { Crown, UserCheck, UserX } from 'lucide-react'
import { DAY_START_MINUTES, OWNER, SCHEDULES, WORLD_NAME } from '../../data/worldData'
import { formatWorldClock, useAppStore } from '../../state/useAppStore'

export default function OwnerPanel() {
  const followId = useAppStore((s) => s.followId)
  const setFollowId = useAppStore((s) => s.setFollowId)
  const setFloor = useAppStore((s) => s.setFloor)
  const setCameraMode = useAppStore((s) => s.setCameraMode)
  const ownerMoveMode = useAppStore((s) => s.ownerMoveMode)
  const setOwnerMoveMode = useAppStore((s) => s.setOwnerMoveMode)

  const following = followId === 'owner'
  const schedule = SCHEDULES.owner ?? []

  function handleFollow() {
    setFollowId(following ? null : 'owner')
  }

  function handleFocusCeo() {
    setFloor(1)
    setFollowId(null)
    setCameraMode('focus')
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold leading-tight">{OWNER.displayName}</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-900">
            <Crown size={13} />
            OWNER
          </span>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold text-inksoft">
            Demo, bukan live
          </span>
        </div>
        <p className="mt-1 text-sm text-inksoft">{OWNER.role}</p>
        <p className="mt-3 text-sm leading-relaxed">
          {OWNER.displayName} adalah pemilik {WORLD_NAME} dan manusia, bukan AI agent.
          Tidak ada model atau provider.
        </p>
      </section>

      <section className="space-y-2.5">
        <button
          type="button"
          onClick={handleFollow}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          {following ? <UserX size={17} /> : <UserCheck size={17} />}
          {following ? 'Berhenti mengikuti' : 'Follow Abi'}
        </button>
        <button
          type="button"
          onClick={handleFocusCeo}
          className="w-full rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
        >
          Fokus ruang CEO
        </button>
        <button
          type="button"
          aria-pressed={ownerMoveMode}
          onClick={() => setOwnerMoveMode(!ownerMoveMode)}
          className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold ${
            ownerMoveMode ? 'bg-tang text-white' : 'border border-ink/20 bg-white text-ink'
          }`}
        >
          {ownerMoveMode ? 'Gerakkan Abi: aktif' : 'Gerakkan Abi'}
        </button>
        {ownerMoveMode ? (
          <p className="text-center text-[13px] leading-relaxed text-inksoft">
            Klik lantai atau plaza untuk mengarahkan Abi.
          </p>
        ) : null}
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Jadwal hari ini
        </h3>
        <ul className="mt-2 space-y-1">
          {schedule.map((block) => (
            <li
              key={`${block.start}-${block.label}`}
              className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2 last:border-b-0"
            >
              <span className="text-sm">{block.label}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {formatWorldClock(DAY_START_MINUTES + block.start)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[13px] leading-relaxed text-inksoft">
          Jadwal visual simulasi, bukan agenda kerja nyata.
        </p>
      </section>
    </div>
  )
}
