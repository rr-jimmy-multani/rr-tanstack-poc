import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props {
  name: string
  children: ReactNode
}

interface State {
  error: Error | null
}

export class RemoteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            border: '2px solid #cc0000',
            borderRadius: 8,
            padding: 24,
            maxWidth: 320,
            background: '#fff5f5',
          }}
        >
          <h2 style={{ margin: '0 0 8px', color: '#cc0000' }}>
            {this.props.name} failed to load
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
            {this.state.error.message}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
