import { reactive } from 'vue'

type PrivacyResolvePayload = {
  buttonId?: string
  event: 'agree' | 'disagree'
}

type PrivacyEventInfo = {
  referrer?: string
}

type PrivacyState = {
  supported: boolean
  visible: boolean
  needAuthorization: boolean
  contractName: string
  referrer: string
}

type WechatPrivacyRuntime = {
  getPrivacySetting?: (options: {
    success?: (result: { needAuthorization?: boolean; privacyContractName?: string }) => void
    fail?: (error: { errMsg?: string }) => void
  }) => void
  openPrivacyContract?: (options?: {
    success?: () => void
    fail?: (error: { errMsg?: string }) => void
  }) => void
  onNeedPrivacyAuthorization?: (
    callback: (resolve: (payload: PrivacyResolvePayload) => void, eventInfo: PrivacyEventInfo) => void
  ) => void
} | undefined

const runtime = () => (globalThis as { wx?: WechatPrivacyRuntime }).wx

export const wechatPrivacyState = reactive<PrivacyState>({
  supported: false,
  visible: false,
  needAuthorization: false,
  contractName: '《用户隐私保护指引》',
  referrer: ''
})

let pendingResolver: ((payload: PrivacyResolvePayload) => void) | null = null
let initialized = false

function hasPrivacyApi() {
  const wx = runtime()
  return Boolean(wx?.getPrivacySetting && wx?.openPrivacyContract)
}

export function setupWechatPrivacy() {
  if (initialized) return
  initialized = true

  const wx = runtime()
  wechatPrivacyState.supported = hasPrivacyApi()

  if (!wx?.onNeedPrivacyAuthorization) return

  wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
    pendingResolver = resolve
    wechatPrivacyState.supported = true
    wechatPrivacyState.needAuthorization = true
    wechatPrivacyState.visible = true
    wechatPrivacyState.referrer = eventInfo.referrer || ''
  })
}

export function syncWechatPrivacySetting(prompt = false) {
  const wx = runtime()
  const getPrivacySetting = wx?.getPrivacySetting
  if (!getPrivacySetting) {
    wechatPrivacyState.supported = false
    wechatPrivacyState.needAuthorization = false
    if (!pendingResolver) wechatPrivacyState.visible = false
    return Promise.resolve(false)
  }

  wechatPrivacyState.supported = true

  return new Promise<boolean>((resolve, reject) => {
    getPrivacySetting({
      success(result) {
        wechatPrivacyState.needAuthorization = Boolean(result.needAuthorization)
        wechatPrivacyState.contractName = result.privacyContractName || '《用户隐私保护指引》'
        if (prompt && wechatPrivacyState.needAuthorization) {
          wechatPrivacyState.visible = true
        } else if (!wechatPrivacyState.needAuthorization && !pendingResolver) {
          wechatPrivacyState.visible = false
        }
        resolve(wechatPrivacyState.needAuthorization)
      },
      fail(error) {
        reject(new Error(error.errMsg || '读取隐私设置失败'))
      }
    })
  })
}

export async function ensureWechatPrivacyAuthorization(prompt = true) {
  const needAuthorization = await syncWechatPrivacySetting(prompt)
  return !needAuthorization
}

export function hideWechatPrivacyDialog() {
  wechatPrivacyState.visible = false
}

export function rejectWechatPrivacyAuthorization() {
  if (pendingResolver) pendingResolver({ event: 'disagree' })
  pendingResolver = null
  wechatPrivacyState.visible = false
}

export function resolveWechatPrivacyAuthorization() {
  if (pendingResolver) {
    pendingResolver({ buttonId: 'privacy-agree-btn', event: 'agree' })
    pendingResolver = null
  }
  wechatPrivacyState.needAuthorization = false
  wechatPrivacyState.visible = false
}

export function openWechatPrivacyContract() {
  const wx = runtime()
  const openPrivacyContract = wx?.openPrivacyContract
  if (!openPrivacyContract) {
    return Promise.reject(new Error('当前环境不支持查看隐私指引'))
  }

  return new Promise<void>((resolve, reject) => {
    openPrivacyContract({
      success: () => resolve(),
      fail: (error) => reject(new Error(error.errMsg || '打开隐私指引失败'))
    })
  })
}
