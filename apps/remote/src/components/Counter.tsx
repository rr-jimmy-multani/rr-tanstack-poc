import { useRef, useState } from 'react'
import { useTheme } from '@rr-framework/shared'

export default function Counter() {
  const [count, setCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

  function focusInput() {
    inputRef.current?.focus()
  }

  return (
    <div style={{ border: `2px solid ${theme.primaryColour}`, borderRadius: 8, padding: 24, maxWidth: 320 }}>
      <h2 style={{ margin: '0 0 8px', color: theme.primaryColour }}>Remote Counter</h2>
      <p style={{ margin: '0 0 4px', fontSize: 14, color: '#555' }}>
        A second exposed component — tests multiple exposes + useRef DOM interaction.
      </p>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: '#999' }}>
        Theme from host context: <strong>{theme.label}</strong> ({theme.primaryColour})
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          ref={inputRef}
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{ width: 80, padding: '4px 8px' }}
        />
        <button onClick={() => setCount((c) => c + 1)} style={{ padding: '4px 12px', cursor: 'pointer' }}>
          +1
        </button>
        <button onClick={focusInput} style={{ padding: '4px 12px', cursor: 'pointer' }}>
          Focus
        </button>
      </div>
    </div>
  )
}
