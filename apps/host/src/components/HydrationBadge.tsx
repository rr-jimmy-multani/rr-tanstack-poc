import { useEffect, useState } from 'react'

export function HydrationBadge() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <span
      style={{
        display: 'inline-block',
        marginTop: 8,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: hydrated ? '#e6f4ea' : '#f5f5f5',
        color: hydrated ? '#1e7e34' : '#999',
        border: `1px solid ${hydrated ? '#a8d5b5' : '#ddd'}`,
      }}
    >
      {hydrated ? 'hydrated' : 'ssr'}
    </span>
  )
}
