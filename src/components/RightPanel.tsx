import { motion } from 'framer-motion'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { X } from 'lucide-react'
import { AGENTS, NAV_ITEMS, OWNER } from '../data/worldData'
import { useAppStore } from '../state/useAppStore'
import type { PanelSelection } from '../types'
import AgentPanel from './panels/AgentPanel'
import AgentsListPanel from './panels/AgentsListPanel'
import ActivityPanel from './panels/ActivityPanel'
import BuildingPanel from './panels/BuildingPanel'
import OwnerPanel from './panels/OwnerPanel'
import PhasePanel from './panels/PhasePanel'
import SettingsPanel from './panels/SettingsPanel'

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

function panelTitle(selection: Exclude<PanelSelection, null>): {
  title: string
  subtitle?: string
} {
  switch (selection.kind) {
    case 'agent': {
      const def = AGENTS.find((a) => a.id === selection.id)
      return { title: def?.name ?? 'Agent', subtitle: def?.role }
    }
    case 'owner':
      return { title: OWNER.displayName, subtitle: OWNER.role }
    case 'building':
      return { title: 'Gedung Kantor Pusat', subtitle: 'Kantor Pusat' }
    case 'phase': {
      if (selection.nav === 'agents') return { title: 'Agents', subtitle: 'Demo' }
      if (selection.nav === 'activity') return { title: 'Activity', subtitle: 'Jejak simulasi' }
      if (selection.nav === 'settings') return { title: 'Settings', subtitle: 'Pengaturan' }
      const item = NAV_ITEMS.find((n) => n.key === selection.nav)
      return { title: item?.label ?? 'Menu', subtitle: `Fase ${item?.phase ?? 1}` }
    }
  }
}

export default function RightPanel() {
  const selection = useAppStore((s) => s.selection)
  const closePanel = useAppStore((s) => s.closePanel)
  const setPanelWidth = useAppStore((s) => s.setPanelWidth)

  if (!selection) return null

  function handleDragStart(e: ReactMouseEvent<HTMLDivElement>) {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = useAppStore.getState().panelWidth
    function onMove(ev: MouseEvent) {
      setPanelWidth(startWidth + (startX - ev.clientX))
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const { title, subtitle } = panelTitle(selection)

  return (
    <motion.aside
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      aria-label={title}
      className="panel-glass relative flex h-full w-full flex-col shadow-panel"
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Ubah lebar panel"
        onMouseDown={handleDragStart}
        className="absolute bottom-0 left-0 top-0 hidden w-2 cursor-ew-resize touch-none lg:block"
      />
      <div className="flex shrink-0 items-start gap-3 border-b border-line px-5 pb-4 pt-5">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold leading-tight">{title}</h2>
          {subtitle ? <p className="truncate text-[13px] text-inksoft">{subtitle}</p> : null}
        </div>
        <button
          type="button"
          onClick={closePanel}
          aria-label="Tutup panel"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-inksoft hover:bg-stone-200/60 hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {selection.kind === 'agent' ? <AgentPanel id={selection.id} /> : null}
        {selection.kind === 'owner' ? <OwnerPanel /> : null}
        {selection.kind === 'building' ? <BuildingPanel /> : null}
        {selection.kind === 'phase' && selection.nav === 'agents' ? <AgentsListPanel /> : null}
        {selection.kind === 'phase' && selection.nav === 'activity' ? <ActivityPanel /> : null}
        {selection.kind === 'phase' && selection.nav === 'settings' ? <SettingsPanel /> : null}
        {selection.kind === 'phase' &&
        selection.nav !== 'agents' &&
        selection.nav !== 'activity' &&
        selection.nav !== 'settings' ? (
          <PhasePanel nav={selection.nav} />
        ) : null}
      </div>
    </motion.aside>
  )
}
