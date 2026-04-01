import { createFileRoute } from '@tanstack/react-router'
import { ClientOnly } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const RemoteWidget = lazy(() => import('remote/Widget'))

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>TanStack Start + Module Federation POC</h1>
      <p>
        The component below is loaded from the remote app via Module Federation.
        On the server, the Suspense fallback is rendered. On the client, the
        real component hydrates.
      </p>

      <ClientOnly fallback={<div>Loading remote widget...</div>}>
        <Suspense fallback={<div>Loading remote widget...</div>}>
          <RemoteWidget />
        </Suspense>
      </ClientOnly>
    </main>
  )
}
