import { useState } from 'react'
import { useTheme } from '@rr-framework/shared'

export default function Widget() {
  const [count, setCount] = useState(0)
  const theme = useTheme()

  return (
    <div style={{ border: `2px solid ${theme.primaryColour}`, borderRadius: 8, padding: 24, maxWidth: 320 }}>
      <h2 style={{ margin: '0 0 8px', color: theme.primaryColour }}>Remote Widget</h2>
      <p style={{ margin: '0 0 4px', fontSize: 14, color: '#555' }}>
        This component is served from the remote app via Module Federation.
      </p>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: '#999' }}>
        Theme from host context: <strong>{theme.label}</strong> ({theme.primaryColour})
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
