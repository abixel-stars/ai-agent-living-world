import { useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import BottomToolbar from './BottomToolbar'
import RightPanel from './RightPanel'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import WorldCanvas from './WorldCanvas'
import { useAppStore } from '../state/useAppStore'

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

export default function AppShell() {
  const panelOpen = useAppStore((s) => s.panelOpen)
  const selection = useAppStore((s) => s.selection)
  const panelWidth = useAppStore((s) => s.panelWidth)
  const [worldReady, setWorldReady] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-ground text-ink">
      <aside className="hidden w-[232px] shrink-0 border-r border-line lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.div
              key="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] border-r border-line lg:hidden"
            >
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-inksoft hover:bg-white/70 hover:text-ink"
              >
                <X size={18} />
              </button>
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setDrawerOpen(true)} />

        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            <WorldCanvas onCreated={() => setWorldReady(true)} />
          </div>

          {!worldReady ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ground/80">
              <Loader2 size={22} className="animate-spin text-inksoft" />
              <p className="text-sm text-inksoft">Memuat dunia 3D</p>
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
            <div className="pointer-events-auto">
              <BottomToolbar />
            </div>
          </div>
        </div>
      </div>

      {panelOpen && selection ? (
        <div
          className="fixed inset-x-0 bottom-0 z-30 h-[55dvh] shrink-0 lg:static lg:z-auto lg:h-auto lg:w-[var(--panel-w)]"
          style={{ '--panel-w': `${panelWidth}px` } as CSSProperties}
        >
          <RightPanel />
        </div>
      ) : null}
    </div>
  )
}
