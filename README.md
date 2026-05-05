# TanStack Start + Module Federation — SSR POC

A proof-of-concept monorepo demonstrating full SSR with `@module-federation/vite` on Vite 8 (Rolldown). Remote components are server-rendered on the host — no `ClientOnly` wrapper required.

## Apps

| App | Description | Port |
|---|---|---|
| `apps/host` | TanStack Start SSR host — consumes remote components via Module Federation | 3000 |
| `apps/remote` | Vite + React remote — exposes `Widget` and `Counter` components | 5001 |

## Packages

| Package | Description |
|---|---|
| `packages/shared` | Shared `ThemeContext` — validates React singleton across the MF boundary |

## Prerequisites

- Node 24 (see `.nvmrc`)
- Yarn 4

## Getting started

```bash
nvm use
yarn install
```

## Development

```bash
yarn dev          # starts both remote (5001) and host (3000) in parallel
yarn dev:remote   # remote only
yarn dev:host     # host only
```

## Production

Build remote first, then host (topological order is handled automatically):

```bash
yarn build
```

Serve the remote with CORS headers:

```bash
cd apps/remote && yarn vite preview   # serves on http://localhost:5001
```

Start the host production server:

```bash
node apps/host/.output/server/index.mjs   # serves on http://localhost:3000
```

## What this validates

| Scenario | Status |
|---|---|
| Remote components server-rendered (no ClientOnly) | ✅ Working |
| Shared context singleton across MF boundary | ✅ Working |
| Multiple exposes (`Widget` + `Counter`) | ✅ Working |
| `useRef` DOM interaction after hydration | ✅ Working |
| Hydration badge: `ssr` → `hydrated` after JS loads | ✅ Working |
| Client-side navigation (away and back) | ✅ Working |
| Error boundary when remote is unreachable | ✅ Working |
| Production build (client + SSR + Nitro bundles) | ✅ Working |

## How it works

`@module-federation/vite` (PR [#692](https://github.com/module-federation/vite/pull/692)) adds two things:

1. **`pluginSSRRemoteEntry`** — emits `remoteEntry.server.js` (ESM) alongside the browser `remoteEntry.js` during the remote's build. MF internal packages are marked as Node externals only within the SSR module graph, so the browser bundle is unaffected.

2. **`ssrEntryLoader`** — a MF runtime plugin auto-injected on the host. It intercepts the `loadEntry` lifecycle hook on the server, fetches the remote's `remoteEntry.server.js` via HTTP, rewrites relative imports and bare shared specifiers to `file://` paths, and writes temp `.mjs` files so Node can evaluate it natively.

The host's `ThemeContext` is provided at the root and consumed by both remote components. It crosses the MF boundary because `@rr-framework/shared` is declared as a singleton in both apps' MF config — the same module instance is shared across the boundary at runtime.

For Nitro-based hosts, `nitro: { traceDeps: ['react', 'react-dom'] }` is required in `vite.config.ts` to externalise React from Nitro's SSR bundle so all server-side code shares the same CJS React instance via Node's module cache.

## Related

- **`@module-federation/vite` PR:** [module-federation/vite#692](https://github.com/module-federation/vite/pull/692)
- **TanStack manifest scanner fix:** [TanStack/router#7089](https://github.com/TanStack/router/pull/7089)
