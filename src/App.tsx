import ErrorBoundary from './components/ErrorBoundary'
import AppShell from './components/AppShell'
import LoginScreen from './auth/LoginScreen'
import { useAppStore } from './state/useAppStore'

export default function App() {
  const session = useAppStore((s) => s.session)

  return (
    <ErrorBoundary>
      {session ? <AppShell /> : <LoginScreen />}
    </ErrorBoundary>
  )
}
