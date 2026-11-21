import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { WORLD_NAME } from '../../data/worldData'
import { useAppStore } from '../../state/useAppStore'

type Quality = 'Low' | 'Medium' | 'High' | 'Auto'

const QUALITIES: Quality[] = ['Low', 'Medium', 'High', 'Auto']

export default function SettingsPanel() {
  const session = useAppStore((s) => s.session)
  const setSession = useAppStore((s) => s.setSession)
  const [quality, setQuality] = useState<Quality>('Auto')

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold leading-tight">Settings</h2>
        <p className="mt-1 text-sm text-inksoft">Dunia: {WORLD_NAME}</p>
      </section>

      <section>
        <label htmlFor="render-quality" className="mb-1.5 block text-[13px] font-semibold">
          Kualitas rendering
        </label>
        <select
          id="render-quality"
          value={quality}
          onChange={(e) => setQuality(e.target.value as Quality)}
          className="w-full rounded-full border border-line bg-white px-4 py-2.5 text-sm"
        >
          {QUALITIES.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[13px] leading-relaxed text-inksoft">
          Kualitas rendering, tersimpan lokal di sesi ini.
        </p>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">Mode</h3>
        {session?.mode === 'demo' ? (
          <p className="mt-1.5 text-sm leading-relaxed">
            Mode demo. Tanpa backend dan tanpa data nyata.
          </p>
        ) : (
          <p className="mt-1.5 text-sm leading-relaxed">
            Mode live. Akun terhubung lewat Supabase Auth.
          </p>
        )}
        <p className="mt-2 text-[13px] leading-relaxed text-inksoft">
          Tidak ada database terhubung di Fase 1.
        </p>
      </section>

      <section>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-inksoft">Akun</h3>
        <div className="mt-1 flex items-baseline justify-between gap-4 border-b border-line/70 py-2.5">
          <span className="text-sm text-inksoft">Nama</span>
          <span className="text-sm font-semibold">{session?.userName}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-line/70 py-2.5">
          <span className="text-sm text-inksoft">Email</span>
          <span className="text-sm font-semibold">{session?.email ?? 'Tanpa email (demo)'}</span>
        </div>
        <button
          type="button"
          onClick={() => setSession(null)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </section>
    </div>
  )
}
