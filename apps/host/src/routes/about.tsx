import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>About</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        This is a plain host-only route with no remote components. Navigate back to the home page
        to confirm remote components re-mount correctly after client-side navigation.
      </p>
      <Link to="/" style={{ color: '#e2001a' }}>
        &larr; Back to home
      </Link>
    </main>
  )
}
