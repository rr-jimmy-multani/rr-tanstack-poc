import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'
import { nitro } from 'nitro/vite'
export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {
        remote: {
          type: 'module',
          name: 'remote',
          entry: 'http://localhost:5001/remoteEntry.js',
        },
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
      },
    }),
    tanstackStart(),
    react(),
    nitro(),
  ],
  ssr: {
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  build: {
    target: 'chrome89',
  },
  server: {
    port: 3000,
  },
})
