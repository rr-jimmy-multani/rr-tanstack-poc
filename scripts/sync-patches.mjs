/**
 * Syncs patched package dist builds into node_modules.
 *
 * Run after `yarn install` whenever you've made changes in a local fork
 * and want to test them in this POC without waiting for upstream PRs to land.
 *
 * Usage: yarn sync-patches
 */

import { cpSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const patches = [
  {
    name: '@tanstack/start-plugin-core',
    src: resolve(root, '../tanstack-router/packages/start-plugin-core/dist'),
    dest: resolve(root, 'node_modules/@tanstack/start-plugin-core/dist'),
  },
]

for (const { name, src, dest } of patches) {
  if (!existsSync(src)) {
    console.warn(`⚠ Skipping ${name} — source not found: ${src}`)
    continue
  }
  if (!existsSync(dest)) {
    console.warn(`⚠ Skipping ${name} — dest not found (run yarn install first): ${dest}`)
    continue
  }
  cpSync(src, dest, { recursive: true })
  console.log(`✓ Synced ${name}`)
}
