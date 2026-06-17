#!/usr/bin/env node
// Generate frontend/.h5-version.json so Vite can bake the version into
// the H5 bundle and emit a matching /version.json into dist.

import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, '..')
const outFile = resolve(repoRoot, 'frontend', '.h5-version.json')

function resolveVersion() {
  try {
    const sha = execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (sha) return sha
  } catch {
    /* fall through */
  }
  try {
    return new Date().toISOString()
  } catch {
    return `dev-${Date.now()}`
  }
}

const version = resolveVersion()
const buildAt = new Date().toISOString()
const payload = { version, buildAt }

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8')

console.log(`[prepare-h5-version] version=${version} buildAt=${buildAt}`)
