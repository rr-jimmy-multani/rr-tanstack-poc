import { createFileRoute, Link } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { RemoteErrorBoundary } from '../components/RemoteErrorBoundary'

const RemoteWidget = lazy(() => import('remote/Widget'))
const RemoteCounter = lazy(() => import('remote/Counter'))

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/" style={{ marginRight: 16, color: '#e2001a' }}>Home</Link>
        <Link to="/about" style={{ color: '#e2001a' }}>About</Link>
      </nav>

      <h1>TanStack Start + Module Federation POC</h1>
      <p>
        Components below are loaded from the remote app via Module Federation and server-rendered.
        Both consume <code>ThemeContext</code> provided by the host — if the React singleton is
        shared correctly, they'll render with the host theme instead of the grey default.
        The <strong>hydrated</strong> badge appears after client-side hydration completes.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
        <RemoteErrorBoundary name="Widget">
          <Suspense fallback={<div>Loading widget...</div>}>
            <RemoteWidget />
          </Suspense>
        </RemoteErrorBoundary>

        <RemoteErrorBoundary name="Counter">
          <Suspense fallback={<div>Loading counter...</div>}>
            <RemoteCounter />
          </Suspense>
        </RemoteErrorBoundary>
      </div>
    </main>
  )
}
