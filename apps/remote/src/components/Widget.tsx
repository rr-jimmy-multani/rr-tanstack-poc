import { useState } from 'react'

export default function Widget() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ border: '2px solid #e2001a', borderRadius: 8, padding: 24, maxWidth: 320 }}>
      <h2 style={{ margin: '0 0 8px', color: '#e2001a' }}>Remote Widget</h2>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#555' }}>
        This component is served from the remote app via Module Federation.
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Count: {count}
      </button>
    </div>
  )
}
