import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const RemoteWidget = lazy(() => import('remote/Widget'))
const RemoteCounter = lazy(() => import('remote/Counter'))

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>TanStack Start + Module Federation POC</h1>
      <p>
        Components below are loaded from the remote app via Module Federation and server-rendered.
        Both consume <code>ThemeContext</code> provided by the host — if the React singleton is
        shared correctly, they'll render with the host theme instead of the grey default.
      </p>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
        <Suspense fallback={<div>Loading widget...</div>}>
          <RemoteWidget />
        </Suspense>

        <Suspense fallback={<div>Loading counter...</div>}>
          <RemoteCounter />
        </Suspense>
      </div>
    </main>
  )
}
