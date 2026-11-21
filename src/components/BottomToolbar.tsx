import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Eye, EyeOff, LayoutGrid, Orbit, Pause, Play, UserCheck, Video } from 'lucide-react'
import { formatWorldClock, useAppStore } from '../state/useAppStore'

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

const SPEEDS: Array<1 | 2 | 4> = [1, 2, 4]

function IconButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        active ? 'bg-stone-200/80 text-ink' : 'text-inksoft hover:bg-stone-200/50 hover:text-ink'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

export default function BottomToolbar() {
  const playing = useAppStore((s) => s.playing)
  const togglePlaying = useAppStore((s) => s.togglePlaying)
  const speed = useAppStore((s) => s.speed)
  const setSpeed = useAppStore((s) => s.setSpeed)
  const cameraMode = useAppStore((s) => s.cameraMode)
  const setCameraMode = useAppStore((s) => s.setCameraMode)
  const followId = useAppStore((s) => s.followId)
  const setFollowId = useAppStore((s) => s.setFollowId)
  const roofHidden = useAppStore((s) => s.roofHidden)
  const toggleRoof = useAppStore((s) => s.toggleRoof)
  const ticker = useAppStore((s) => s.ticker)
  const setNav = useAppStore((s) => s.setNav)
  const select = useAppStore((s) => s.select)

  const latest = ticker[0]

  function goOrbit() {
    setFollowId(null)
  }

  function goTop() {
    setFollowId(null)
    setCameraMode('top')
  }

  function goFollow() {
    setCameraMode('follow')
  }

  function openActivity() {
    setNav('activity')
    select({ kind: 'phase', nav: 'activity' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="panel-glass flex max-w-[calc(100vw-1.5rem)] items-center gap-1 overflow-x-auto scroll-thin rounded-full px-2 py-1.5 shadow-float"
    >
      <IconButton
        label={playing ? 'Jeda simulasi' : 'Lanjutkan simulasi'}
        onClick={togglePlaying}
      >
        {playing ? <Pause size={17} /> : <Play size={17} />}
      </IconButton>

      <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-stone-200/50 p-0.5" role="group" aria-label="Kecepatan simulasi">
        {SPEEDS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={speed === value}
            onClick={() => setSpeed(value)}
            className={`rounded-full px-2.5 py-1 text-[13px] font-semibold tabular-nums ${
              speed === value ? 'bg-ink text-white' : 'text-inksoft'
            }`}
          >
            {value}x
          </button>
        ))}
      </div>

      <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />

      <IconButton label="Kamera orbit" active={cameraMode === 'orbit' && !followId} onClick={goOrbit}>
        <Orbit size={17} />
      </IconButton>
      <IconButton label="Kamera atas" active={cameraMode === 'top'} onClick={goTop}>
        <LayoutGrid size={17} />
      </IconButton>
      <IconButton label="Kamera ikuti" active={cameraMode === 'follow'} onClick={goFollow}>
        <Video size={17} />
      </IconButton>
      <IconButton
        label={roofHidden ? 'Tampilkan atap' : 'Sembunyikan atap'}
        active={roofHidden}
        onClick={toggleRoof}
      >
        {roofHidden ? <Eye size={17} /> : <EyeOff size={17} />}
      </IconButton>
      <IconButton
        label="Ikuti karakter yang dipilih"
        active={Boolean(followId)}
        disabled={!followId}
        onClick={() => setFollowId(null)}
      >
        <UserCheck size={17} />
      </IconButton>

      <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />

      <button
        type="button"
        onClick={openActivity}
        className="flex min-w-0 shrink items-center gap-2 rounded-full px-2 py-1 text-left hover:bg-stone-200/50"
        title="Buka Activity"
      >
        <span className="hidden max-w-[180px] truncate text-[13px] text-inksoft sm:block">
          {latest
            ? `${formatWorldClock(latest.atMinutes)} ${latest.text}`
            : 'Belum ada aktivitas.'}
        </span>
        <span className="shrink-0 rounded-full bg-stone-200/70 px-2 py-0.5 text-[11px] font-semibold tabular-nums">
          {ticker.length}
        </span>
      </button>
    </motion.div>
  )
}
