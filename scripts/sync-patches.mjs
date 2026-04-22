/**
 * Syncs patched package dist builds into node_modules.
 *
 * Run after `yarn install` whenever you've made changes in a local fork
 * and want to test them in this POC without waiting for upstream PRs to land.
 *
 * Usage: yarn sync-patches
 */

import { cpSync, copyFileSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const mfViteTransform = (content) => {
  const pkg = JSON.parse(content)
  delete pkg.packageManager
  return JSON.stringify(pkg, null, 2) + '\n'
}

const patches = [
  {
    name: '@tanstack/start-plugin-core',
    src: resolve(root, '../tanstack-router/packages/start-plugin-core/dist'),
    dest: resolve(root, 'node_modules/@tanstack/start-plugin-core/dist'),
  },
  // Host app has its own hoisted copy — patch it too.
  {
    name: '@tanstack/start-plugin-core (apps/host)',
    src: resolve(root, '../tanstack-router/packages/start-plugin-core/dist'),
    dest: resolve(root, 'apps/host/node_modules/@tanstack/start-plugin-core/dist'),
  },
  {
    name: '@module-federation/vite',
    src: resolve(root, '../mf-vite/lib'),
    dest: resolve(root, 'node_modules/@module-federation/vite/lib'),
    // Also sync package.json so subpath exports (e.g. ./ssrEntryLoader) are available.
    extra: [
      {
        src: resolve(root, '../mf-vite/package.json'),
        dest: resolve(root, 'node_modules/@module-federation/vite/package.json'),
        // Strip packageManager field so yarn doesn't treat this as a pnpm project.
        transform: mfViteTransform,
      },
    ],
  },
  // The remote app and host app may have their own hoisted copies of
  // @module-federation/vite. Patch all discovered copies.
  ...['apps/remote', 'apps/host'].flatMap(appDir => {
    const dest = resolve(root, appDir, 'node_modules/@module-federation/vite/lib')
    const destPkg = resolve(root, appDir, 'node_modules/@module-federation/vite/package.json')
    if (!existsSync(dest)) return []
    return [{
      name: `@module-federation/vite (${appDir})`,
      src: resolve(root, '../mf-vite/lib'),
      dest,
      extra: [{
        src: resolve(root, '../mf-vite/package.json'),
        dest: destPkg,
        transform: mfViteTransform,
      }],
    }]
  }),
]

for (const { name, src, dest, extra = [] } of patches) {
  if (!existsSync(src)) {
    console.warn(`⚠ Skipping ${name} — source not found: ${src}`)
    continue
  }
  if (!existsSync(dest)) {
    console.warn(`⚠ Skipping ${name} — dest not found (run yarn install first): ${dest}`)
    continue
  }
  cpSync(src, dest, { recursive: true })
  for (const { src: eSrc, dest: eDest, transform } of extra) {
    if (!existsSync(eSrc)) continue
    if (transform) {
      const content = readFileSync(eSrc, 'utf8')
      writeFileSync(eDest, transform(content))
    } else {
      copyFileSync(eSrc, eDest)
    }
  }
  console.log(`✓ Synced ${name}`)
}
