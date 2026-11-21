import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error): void {
    console.error(error)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-ground p-6 text-ink">
          <div className="panel-glass w-full max-w-md rounded-[2rem] p-6 shadow-panel">
            <h1 className="text-lg font-bold">Terjadi kesalahan</h1>
            <p className="mt-2 text-sm leading-relaxed text-inksoft">
              Aplikasi tidak bisa dilanjutkan. Muat ulang halaman untuk mencoba lagi.
            </p>
            {this.state.message ? (
              <p className="mt-3 break-words rounded-xl bg-cream px-3 py-2 text-xs text-inksoft">
                {this.state.message}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 w-full rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              Muat ulang
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
