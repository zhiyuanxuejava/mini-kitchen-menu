export function startVersionCheck(): void {
  // #ifdef H5
  startH5VersionCheck()
  // #endif
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
  uni.showModal({
    title: '发现新版本',
    content: '页面已更新，需要刷新才能使用新版本',
    confirmText: '立即更新',
    cancelText: '稍后',
    success: (res) => {
      if (res.confirm) {
        window.location.reload()
        return
      }
      enterSnooze()
    },
    fail: () => {
      enterSnooze()
    }
  })
}

function enterSnooze(): void {
  state = 'outdated_snoozed'
  snoozedUntil = Date.now() + SNOOZE_MS
}

// #endif
