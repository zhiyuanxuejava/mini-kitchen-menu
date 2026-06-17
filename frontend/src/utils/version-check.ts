import { reactive } from 'vue'

export const versionUpdateState = reactive({
  visible: false
})

const AUTH_STORAGE_KEY = 'zhangshao-menu-auth'
const CACHE_STORAGE_KEYS = ['zhangshao-menu-cache', 'zhangshao-menu-state']
const APP_STORAGE_PREFIX = 'zhangshao-menu-'

export function startVersionCheck(): void {
  // #ifdef H5
  startH5VersionCheck()
  // #endif
}

export function snoozeVersionUpdate(): void {
  // #ifdef H5
  enterSnooze()
  // #endif
}

export async function clearRuntimeCache(options?: { preserveAuth?: boolean }): Promise<void> {
  removeAppStorageCache(options)
  await clearCacheStorage()
}

export async function forceReloadToHash(hash = '', options?: { preserveAuth?: boolean }): Promise<void> {
  // #ifdef H5
  await clearRuntimeCache(options)
  const targetHash = hash || window.location.hash || '#/pages/home/index'
  window.location.replace(buildForcedReloadUrl(targetHash))
  // #endif
}

export async function reloadToLatestVersion(): Promise<void> {
  versionUpdateState.visible = false
  await forceReloadToHash(window.location.hash, { preserveAuth: true })
}

// #ifdef H5

const SNOOZE_MS = 30 * 60 * 1000
const POLL_MS = 5 * 60 * 1000
const MIN_CHECK_GAP_MS = 30 * 1000
const BOOT_DELAY_MS = 2000

type State = 'idle' | 'checking' | 'outdated_pending' | 'outdated_snoozed'

let state: State = 'idle'
let snoozedUntil = 0
let lastCheckedAt = 0
let started = false

function startH5VersionCheck(): void {
  if (started) return
  if (typeof __APP_VERSION__ === 'undefined' || __APP_VERSION__ === 'unknown') return
  started = true
  setTimeout(() => { void checkVersion() }, BOOT_DELAY_MS)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void checkVersion()
    })
  }
  setInterval(() => { void checkVersion() }, POLL_MS)
}

async function fetchServerVersion(): Promise<string | null> {
  try {
    const res = await fetch(`/version.json?_=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    if (!data || typeof data.version !== 'string' || !data.version) return null
    return data.version
  } catch {
    return null
  }
}

function buildForcedReloadUrl(hash: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set('_reload', String(Date.now()))
  url.hash = hash.startsWith('#') ? hash : `#${hash}`
  return url.toString()
}

function removeStorageKey(key: string, preserveAuth: boolean): void {
  if (preserveAuth && key === AUTH_STORAGE_KEY) return
  try {
    uni.removeStorageSync(key)
  } catch {}
  try {
    window.localStorage?.removeItem(key)
  } catch {}
  try {
    window.sessionStorage?.removeItem(key)
  } catch {}
}

function removeAppStorageCache(options?: { preserveAuth?: boolean }): void {
  const preserveAuth = options?.preserveAuth !== false
  for (const key of CACHE_STORAGE_KEYS) removeStorageKey(key, preserveAuth)

  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      for (let index = storage.length - 1; index >= 0; index -= 1) {
        const key = storage.key(index)
        if (key && key.startsWith(APP_STORAGE_PREFIX) && (!preserveAuth || key !== AUTH_STORAGE_KEY)) {
          storage.removeItem(key)
        }
      }
    } catch {}
  }
}

async function clearCacheStorage(): Promise<void> {
  if (!('caches' in window)) return
  try {
    const cacheKeys = await window.caches.keys()
    await Promise.all(
      cacheKeys
        .filter((key) => /zhangshao|mini-kitchen|uni-app|vite/i.test(key))
        .map((key) => window.caches.delete(key))
    )
  } catch {}
}

async function checkVersion(): Promise<void> {
  if (state === 'checking' || state === 'outdated_pending') return
  if (state === 'outdated_snoozed') {
    if (Date.now() < snoozedUntil) return
    state = 'idle'
  }
  const now = Date.now()
  if (now - lastCheckedAt < MIN_CHECK_GAP_MS) return
  lastCheckedAt = now
  state = 'checking'
  const serverVersion = await fetchServerVersion()
  if (state !== 'checking') return
  state = 'idle'
  if (!serverVersion) return
  if (serverVersion === __APP_VERSION__) return
  promptUpdate()
}

function promptUpdate(): void {
  state = 'outdated_pending'
  versionUpdateState.visible = true
}

function enterSnooze(): void {
  versionUpdateState.visible = false
  state = 'outdated_snoozed'
  snoozedUntil = Date.now() + SNOOZE_MS
}

// #endif
