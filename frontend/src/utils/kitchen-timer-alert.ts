type AudioContextCtor = new () => AudioContext

let audioContext: AudioContext | undefined

function resolveAudioContext() {
  if (typeof AudioContext !== 'undefined') return audioContext || (audioContext = new AudioContext())
  if (typeof window === 'undefined') return undefined

  const WebkitAudioContext = (window as typeof window & {
    webkitAudioContext?: AudioContextCtor
  }).webkitAudioContext
  if (!WebkitAudioContext) return undefined

  return audioContext || (audioContext = new WebkitAudioContext())
}

async function ensureAudioReady() {
  const context = resolveAudioContext()
  if (!context) return undefined
  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      return context
    }
  }
  return context
}

export async function primeKitchenTimerAlert() {
  const context = await ensureAudioReady()
  if (!context) return

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = 440
  gain.gain.setValueAtTime(0.0001, context.currentTime)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + 0.01)
}

export async function playKitchenTimerAlert() {
  try {
    uni.vibrateLong?.()
  } catch {
  }

  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate([260, 120, 260, 120, 420])
    } catch {
    }
  }

  const context = await ensureAudioReady()
  if (!context) return

  const startAt = context.currentTime
  const tones = [784, 1046, 1396, 1046]

  tones.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const toneStart = startAt + index * 0.2
    oscillator.type = index === tones.length - 1 ? 'triangle' : 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, toneStart)
    gain.gain.exponentialRampToValueAtTime(0.18, toneStart + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, toneStart + 0.18)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(toneStart)
    oscillator.stop(toneStart + 0.2)
  })
}
