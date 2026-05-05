import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    federation({
      name: 'remote',
      filename: 'remoteEntry.js',
      exposes: {
        './Widget': './src/components/Widget',
        './Counter': './src/components/Counter',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@rr-framework/shared': { singleton: true, requiredVersion: '0.0.0' },
      },
    }),
    react(),
  ],
  build: {
    target: 'chrome89',
  },
  server: {
    port: 5001,
    cors: true,
    origin: 'http://localhost:5001',
  },
  preview: {
    port: 5001,
    cors: true,
  },
})
