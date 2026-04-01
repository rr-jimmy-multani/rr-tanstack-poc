# TanStack Start + Module Federation — SSR POC

A proof-of-concept monorepo demonstrating TanStack Start (SSR) working with `@module-federation/vite` on Vite 8.

## Apps

| App | Description | Port |
|---|---|---|
| `apps/host` | TanStack Start SSR host, consumes remote Widget via Module Federation | 3000 |
| `apps/remote` | Plain Vite + React remote, exposes `Widget` component | 5001 |

## Prerequisites

- Node 24 (see `.nvmrc`)
- Yarn 4

## Getting started

```bash
nvm use
yarn install

# Terminal 1 — start remote
cd apps/remote && yarn dev

# Terminal 2 — start host
cd apps/host && yarn dev
```

## Status

| Scenario | Status |
|---|---|
| Dev server (SSR) | ✅ Working |
| Production build | ⚠️ Requires a pending fix in TanStack Router ([#7032](https://github.com/TanStack/router/issues/7032)) |

## Related PRs

- **`@module-federation/vite`** — [module-federation/vite#586](https://github.com/module-federation/vite/pull/586): Fixes CJS virtual modules being generated in SSR serve mode. This repo uses the canary build from that PR via `pkg.pr.new`.
- **`@tanstack/start-plugin-core`** — [TanStack/router#7032](https://github.com/TanStack/router/issues/7032): The manifest scanner needs to skip plugin-injected entry chunks (e.g. `hostInit` from MF) to allow production builds to succeed.

## How it works

The host SSR-renders the page shell server-side. Remote modules cannot be fetched server-side (they live on a separate server), so they are wrapped in `<ClientOnly>` — the server renders the fallback, and the real component hydrates on the client once the MF runtime initialises.

See the [Confluence doc](https://rakutenrewards.atlassian.net/wiki/spaces/~jimmy.multani/pages/44320325662) for full findings.
