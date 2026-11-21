import {
  Activity,
  BarChart3,
  Bot,
  Building2,
  ClipboardList,
  Globe,
  Hammer,
  LogOut,
  Settings,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react'
import { NAV_ITEMS, OWNER, WORLD_NAME, type NavItem } from '../data/worldData'
import { useAppStore } from '../state/useAppStore'
import type { NavKey } from '../types'

const NAV_ICONS: Record<NavKey, LucideIcon> = {
  world: Globe,
  agents: Bot,
  tasks: ClipboardList,
  teams: Users,
  meetings: Video,
  buildings: Building2,
  build: Hammer,
  analytics: BarChart3,
  activity: Activity,
  settings: Settings,
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const session = useAppStore((s) => s.session)
  const nav = useAppStore((s) => s.nav)
  const setNav = useAppStore((s) => s.setNav)
  const select = useAppStore((s) => s.select)
  const closePanel = useAppStore((s) => s.closePanel)
  const setCameraMode = useAppStore((s) => s.setCameraMode)
  const setFollowId = useAppStore((s) => s.setFollowId)
  const setSession = useAppStore((s) => s.setSession)

  function handleNav(item: NavItem) {
    setNav(item.key)
    if (item.key === 'world') {
      closePanel()
      setCameraMode('orbit')
      setFollowId(null)
    } else if (item.key === 'buildings') {
      select({ kind: 'building', id: 'hq' })
    } else {
      select({ kind: 'phase', nav: item.key })
    }
    onNavigate?.()
  }

  function handleLogout() {
    setSession(null)
    onNavigate?.()
  }

  const initial = (session?.userName || '?').slice(0, 1).toUpperCase()

  return (
    <div className="flex h-full flex-col bg-cream/60">
      <div className="px-4 pb-3 pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-tang text-white">
            <Building2 size={20} />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold leading-tight">{WORLD_NAME}</p>
            <p className="text-[13px] leading-tight text-inksoft">Kantor Pusat</p>
          </div>
        </div>
        {session?.mode === 'demo' ? (
          <span className="mt-3 inline-flex rounded-full bg-white/70 px-2.5 py-1 text-xs font-semibold text-inksoft">
            Demo, bukan live
          </span>
        ) : null}
      </div>

      <nav aria-label="Navigasi utama" className="scroll-thin flex-1 overflow-y-auto px-3 pb-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.key]
            const active = nav === item.key
            return (
              <li key={item.key}>
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => handleNav(item)}
                  className={`flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-left text-sm ${
                    active ? 'bg-stone-200/70 font-semibold text-ink' : 'text-inksoft hover:bg-white/60 hover:text-ink'
                  }`}
                >
                  <Icon size={17} className="shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.phase > 1 ? (
                    <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-inksoft">
                      Fase {item.phase}
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">{session?.userName}</p>
            <p className="truncate text-[13px] leading-tight text-inksoft">
              {session?.email ?? OWNER.role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Keluar"
            title="Keluar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-inksoft hover:bg-white/70 hover:text-ink"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
