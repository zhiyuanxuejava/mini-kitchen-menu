import { defineConfig, Plugin } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const uni = typeof uniPlugin === 'function' ? uniPlugin : uniPlugin.default

const versionFile = fileURLToPath(new URL('./.h5-version.json', import.meta.url))
let version = 'unknown'
let buildAt = 'unknown'
if (existsSync(versionFile)) {
  try {
    const parsed = JSON.parse(readFileSync(versionFile, 'utf8'))
    if (typeof parsed.version === 'string' && parsed.version) version = parsed.version
    if (typeof parsed.buildAt === 'string' && parsed.buildAt) buildAt = parsed.buildAt
  } catch {
    /* ignore malformed file */
  }
}

function writeH5VersionJsonPlugin(): Plugin {
  return {
    name: 'write-h5-version-json',
    apply: 'build',
    writeBundle() {
      if (process.env.UNI_PLATFORM !== 'h5') return
      const outDir =
        process.env.UNI_OUTPUT_DIR ||
        resolve(fileURLToPath(new URL('./dist/build/h5', import.meta.url)))
      mkdirSync(outDir, { recursive: true })
      const file = resolve(outDir, 'version.json')
      writeFileSync(file, JSON.stringify({ version, buildAt }) + '\n', 'utf8')
      console.log(`[write-h5-version-json] wrote ${file}`)
    }
  }
}

export default defineConfig({
  plugins: [uni(), writeH5VersionJsonPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_BUILD_AT__: JSON.stringify(buildAt)
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
