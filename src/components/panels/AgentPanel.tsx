import { MessageSquare, Pause, Play, UserCheck, UserX } from 'lucide-react'
import { AGENTS } from '../../data/worldData'
import { DESKS } from '../../world/layout'
import { useAppStore } from '../../state/useAppStore'
import { useSimSnapshot } from '../../simulation/engine'
import type { ActivityKind } from '../../types'

const ACTIVITY_LABELS: Record<ActivityKind, string> = {
  idle: 'Diam',
  walking: 'Berjalan',
  sitting: 'Duduk di meja',
  typing: 'Mengetik',
  thinking: 'Berpikir',
  talking: 'Berbicara',
  meeting: 'Rapat',
  break: 'Istirahat',
  lounging: 'Santai',
  inLift: 'Di lift',
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2.5 last:border-b-0">
      <span className="text-sm text-inksoft">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  )
}

export default function AgentPanel({ id }: { id: string }) {
  const def = AGENTS.find((a) => a.id === id)
  const snapshots = useSimSnapshot()
  const followId = useAppStore((s) => s.followId)
  const setFollowId = useAppStore((s) => s.setFollowId)
  const setFloor = useAppStore((s) => s.setFloor)
  const setCameraMode = useAppStore((s) => s.setCameraMode)
  const playing = useAppStore((s) => s.playing)
  const togglePlaying = useAppStore((s) => s.togglePlaying)

  if (!def) {
    return <p className="text-sm text-inksoft">Agent tidak ditemukan.</p>
  }

  const snapshot = snapshots.find((s) => s.id === id)
  const following = followId === id

  function handleFollow() {
    setFollowId(following ? null : id)
  }

  function handleWorkspace() {
    const desk = DESKS.find((d) => d.id === def?.deskId)
    setFloor(desk?.floor ?? 1)
    setFollowId(null)
    setCameraMode('focus')
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 rounded-full"
            style={{ backgroundColor: def.color }}
          />
          <h2 className="text-lg font-bold leading-tight">{def.name}</h2>
        </div>
        <p className="mt-1 text-sm text-inksoft">
          {def.role} · Tim {def.team}
        </p>
        <p className="mt-3 text-sm leading-relaxed">{def.personality}</p>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Aktivitas saat ini
        </h3>
        <p className="mt-1.5 text-sm font-semibold">
          {snapshot ? ACTIVITY_LABELS[snapshot.activity] : 'Belum ada data simulasi'}
        </p>
        {snapshot?.label ? <p className="mt-0.5 text-sm text-inksoft">{snapshot.label}</p> : null}
        <p className="mt-2 text-sm leading-relaxed text-inksoft">{def.demoTask}.</p>
        <p className="mt-1 text-[13px] leading-relaxed text-inksoft">
          Aktivitas ini bagian dari simulasi visual, bukan pekerjaan AI nyata.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-cream/50 p-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Model AI
        </h3>
        <p className="mt-1.5 text-sm font-semibold">Model AI: belum terhubung</p>
        <p className="mt-1 text-[13px] leading-relaxed text-inksoft">
          Fase 3: konfigurasi provider dan eksekusi.
        </p>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">
          Ringkasan demo
        </h3>
        <div className="mt-1">
          <StatRow label="Tugas selesai (demo)" value="0" />
          <StatRow label="Biaya API hari ini (demo)" value="Rp 0" />
        </div>
      </section>

      <section className="space-y-2.5">
        <button
          type="button"
          onClick={handleFollow}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          {following ? <UserX size={17} /> : <UserCheck size={17} />}
          {following ? 'Berhenti mengikuti' : 'Follow Agent'}
        </button>
        <button
          type="button"
          onClick={handleWorkspace}
          className="w-full rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
        >
          Buka Workspace
        </button>
        <button
          type="button"
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-inksoft opacity-60"
        >
          <MessageSquare size={17} />
          Chat dengan Agent
        </button>
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-inksoft opacity-60"
        >
          Beri Tugas
        </button>
        <p className="text-center text-[13px] text-inksoft">Butuh backend Fase 3</p>
        <button
          type="button"
          onClick={togglePlaying}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
        >
          {playing ? <Pause size={17} /> : <Play size={17} />}
          {playing ? 'Jeda simulasi' : 'Lanjutkan simulasi'}
        </button>
        <p className="text-center text-[13px] text-inksoft">
          Jeda dan lanjut berlaku untuk semua karakter.
        </p>
      </section>
    </div>
  )
}
