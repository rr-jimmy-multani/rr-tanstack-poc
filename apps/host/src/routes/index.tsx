import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

// Remote component loaded via Module Federation.
// With full SSR support, the server fetches and renders this component
// directly — no ClientOnly wrapper needed.
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
        With full SSR, the server renders this component and the HTML is present
        in the initial response.
      </p>

      <Suspense fallback={<div>Loading remote widget...</div>}>
        <RemoteWidget />
      </Suspense>
    </main>
  )
}
