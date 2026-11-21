import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Building2, Bot, Check, Loader2, Lock, Mail, MonitorPlay } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './supabaseClient'
import { useAppStore } from '../state/useAppStore'
import { WORLD_NAME } from '../data/worldData'

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]

const BULLETS = [
  {
    icon: MonitorPlay,
    text: 'Simulasi visual dunia 3D, gedung dan ruang kerja yang bisa dijelajahi.',
  },
  {
    icon: Bot,
    text: '10 agent dan pemilik yang bergerak mengikuti jadwal visual harian.',
  },
  {
    icon: Check,
    text: 'Mode demo tanpa backend. Tidak ada pekerjaan AI nyata di dalam simulasi ini.',
  },
]

export default function LoginScreen() {
  const setSession = useAppStore((s) => s.setSession)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleLiveLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setSubmitting(true)
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) {
        setError(`Login live gagal. ${authError.message}`)
        return
      }
      if (!data.user) {
        setError('Login live gagal. Tidak ada pengguna yang dikembalikan.')
        return
      }
      const prefix = email.trim().split('@')[0] || email.trim()
      setSession({ userName: prefix, mode: 'live', email: email.trim() })
    } catch (err) {
      setError(`Login live gagal. ${err instanceof Error ? err.message : 'Terjadi kesalahan tak terduga.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  function handleDemo() {
    setSession({ userName: 'Abi', mode: 'demo', email: null })
  }

  return (
    <div className="flex min-h-dvh bg-ground text-ink">
      <section className="hidden w-[46%] flex-col justify-between bg-cream p-10 lg:flex xl:p-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tang text-white">
              <Building2 size={22} />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-inksoft">
              Kantor Pusat
            </span>
          </div>
          <h1 className="mt-10 text-5xl font-extrabold leading-[1.05] tracking-tight">
            {WORLD_NAME}
          </h1>
          <p className="mt-3 text-lg font-medium text-inksoft">Living World 3D</p>
          <ul className="mt-10 space-y-4">
            {BULLETS.map((item) => (
              <li key={item.text} className="flex items-start gap-3 text-[15px] leading-relaxed">
                <item.icon size={18} className="mt-0.5 shrink-0 text-tangdeep" />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <p className="max-w-md text-[13px] leading-relaxed text-inksoft">
          Simulasi visual ini bukan pekerjaan AI nyata. Agent di dalam dunia 3D
          bergerak dan tampil bekerja, tetapi belum menjalankan tugas sungguhan
          dan belum terhubung ke model atau provider apa pun.
        </p>
      </section>

      <section className="flex flex-1 items-center justify-center p-5 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-md"
        >
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tang text-white">
              <Building2 size={22} />
            </span>
            <div>
              <p className="text-base font-extrabold leading-tight">{WORLD_NAME}</p>
              <p className="text-[13px] text-inksoft">Living World 3D</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-black/5 p-1.5">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 shadow-panel sm:p-7">
              <h2 className="text-xl font-bold">Masuk ke dunia 3D</h2>
              <p className="mt-1 text-sm text-inksoft">
                Pilih mode demo, atau login live bila sudah dikonfigurasi.
              </p>

              <form onSubmit={handleLiveLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-semibold">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-inksoft/70"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="login-password" className="mb-1.5 block text-[13px] font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-inksoft" />
                    <input
                      id="login-password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password akun live"
                      className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-inksoft/70"
                    />
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-red-800">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={!isSupabaseConfigured || submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? <Loader2 size={17} className="animate-spin" /> : null}
                  Masuk (live)
                </button>
                {!isSupabaseConfigured ? (
                  <p className="text-[13px] leading-relaxed text-inksoft">
                    Login live belum dikonfigurasi. Atur VITE_SUPABASE_URL dan
                    VITE_SUPABASE_ANON_KEY di .env, lihat .env.example.
                  </p>
                ) : null}
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-inksoft">
                <span className="h-px flex-1 bg-line" />
                <span>atau</span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <span className="mb-3 inline-flex rounded-full bg-cream px-3 py-1 text-xs font-semibold text-inksoft">
                Demo, bukan live. Tanpa backend dan tanpa data nyata.
              </span>
              <button
                type="button"
                onClick={handleDemo}
                className="w-full rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink"
              >
                Masuk Mode Demo
              </button>
              <p className="mt-3 text-[13px] leading-relaxed text-inksoft">
                Mode demo membuka dunia 3D lengkap untuk dilihat dan dijelajahi,
                tanpa akun dan tanpa menyimpan data.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
