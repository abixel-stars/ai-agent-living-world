import { Crown } from 'lucide-react'
import { AGENTS, OWNER } from '../../data/worldData'
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

export default function AgentsListPanel() {
  const select = useAppStore((s) => s.select)
  const selection = useAppStore((s) => s.selection)
  const snapshots = useSimSnapshot()

  const ownerSnapshot = snapshots.find((s) => s.id === 'owner')

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-lg font-bold leading-tight">Agents (demo)</h2>
        <p className="mt-1 text-sm text-inksoft">
          13 agent dan pemilik {OWNER.displayName}.
        </p>
      </section>

      <button
        type="button"
        onClick={() => select({ kind: 'owner' })}
        className={`w-full rounded-2xl border-l-4 border-amber-400 bg-white p-4 text-left shadow-sm ${
          selection?.kind === 'owner' ? 'ring-2 ring-ink/20' : ''
        }`}
      >
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: OWNER.color }}
          />
          <span className="text-sm font-bold">{OWNER.displayName}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold tracking-wide text-amber-900">
            <Crown size={12} />
            OWNER
          </span>
        </span>
        <span className="mt-1 block text-[13px] text-inksoft">{OWNER.role}</span>
        {ownerSnapshot ? (
          <span className="mt-0.5 block text-[13px] text-inksoft">
            {ACTIVITY_LABELS[ownerSnapshot.activity]}
          </span>
        ) : null}
      </button>

      <ul className="space-y-2">
        {AGENTS.map((agent) => {
          const snapshot = snapshots.find((s) => s.id === agent.id)
          const active = selection?.kind === 'agent' && selection.id === agent.id
          return (
            <li key={agent.id}>
              <button
                type="button"
                onClick={() => select({ kind: 'agent', id: agent.id })}
                className={`w-full rounded-2xl bg-white p-4 text-left shadow-sm ${
                  active ? 'ring-2 ring-ink/20' : ''
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: agent.color }}
                  />
                  <span className="text-sm font-bold">{agent.name}</span>
                </span>
                <span className="mt-1 block text-[13px] text-inksoft">{agent.role}</span>
                {snapshot ? (
                  <span className="mt-0.5 block text-[13px] text-inksoft">
                    {ACTIVITY_LABELS[snapshot.activity]}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
