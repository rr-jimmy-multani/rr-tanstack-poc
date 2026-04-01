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
```

### Run both apps

```bash
yarn dev
```

This starts both the remote (port 5001) and host (port 3000) in parallel.

### Run individually

```bash
yarn dev:remote   # remote only
yarn dev:host     # host only
```

### Build

```bash
yarn build        # builds remote first, then host (topological order)
yarn build:remote
yarn build:host
```

### Sync local fork patches (after making changes in tanstack-router fork)

```bash
yarn sync-patches
```

## Status

| Scenario | Status |
|---|---|
| Dev server (SSR) | ✅ Working |
| Production build (client + SSR bundles) | ✅ Working |
| Production server | ❌ Blocked — Nitro SSR entry detection conflict (see below) |

## Known Issues

### Layer 1: TanStack manifest scanner — fixed (PR open)

`@tanstack/start-plugin-core`'s `scanClientChunks` throws when it encounters multiple `isEntry` chunks — `@module-federation/vite` injects `hostInit` and `remoteEntry` as entry chunks alongside the real app entry. Fix: skip entries whose `facadeModuleId` matches `__mf__virtual` or `virtual:mf-`.

- **Issue:** [TanStack/router#7032](https://github.com/TanStack/router/issues/7032)
- **PR:** [TanStack/router#7089](https://github.com/TanStack/router/pull/7089)

### Layer 2: Nitro SSR entry detection — under investigation

After fixing Layer 1, the production server (`node .output/server/index.mjs`) starts but crashes on the first request with `TypeError: mod.fetch is not a function`. Nitro detects the SSR entry by reading `environments.ssr.build.rollupOptions.input` — because `@module-federation/vite` injects `hostInit` into the SSR Rollup environment, Nitro picks it up as the SSR handler instead of the real TanStack Start handler.

**Root cause:** `@module-federation/vite` injects entry chunks into all build environments unconditionally, not just the client environment. The same pattern as the manifest scanner issue but one layer deeper in the Nitro SSR entry detection.

This is a new finding and has not yet been reported upstream.

## Related PRs

- **`@module-federation/vite`** — [module-federation/vite#586](https://github.com/module-federation/vite/pull/586): Fixes CJS virtual modules in SSR serve mode. This repo uses the canary build from that PR via `pkg.pr.new`.
- **`@tanstack/start-plugin-core`** — [TanStack/router#7089](https://github.com/TanStack/router/pull/7089): Skip plugin-injected entry chunks in the manifest scanner.

## How it works

The host SSR-renders the page shell server-side. Remote modules cannot be fetched server-side (they live on a separate server), so they are wrapped in `<ClientOnly>` — the server renders the fallback, and the real component hydrates on the client once the MF runtime initialises.

See the [Confluence doc](https://rakutenrewards.atlassian.net/wiki/spaces/~jimmy.multani/pages/44320325662) for full findings.
