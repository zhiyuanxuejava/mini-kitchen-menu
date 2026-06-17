import { defineStore } from 'pinia'
import { ApiError, isDefaultUserAvatar, kitchenApi, normalizeUserAvatarUrl } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { seedDishes as prototypeSeedDishes } from '@/data/prototype-seed'
import type {
  CookRecord,
  CookStatus,
  Dish,
  DishCategory,
  DishSourceType,
  EditableDishInput,
  FavoriteDishEntry,
  KitchenTimer,
  KitchenTimerContextType,
  LearnedDishEntry,
  MeStats,
  MenuItem,
  Rating,
  TasteFeedback,
  TodayMenu,
  UserProfile
} from '@/data/types'
import { resolvedDishSteps } from '@/utils/dish-steps'
import { forceReloadToHash } from '@/utils/version-check'

const LEGACY_STORAGE_KEY = 'zhangshao-menu-state'
const AUTH_STORAGE_KEY = 'zhangshao-menu-auth'
const CACHE_STORAGE_KEY = 'zhangshao-menu-cache'
const LEGACY_PROTOTYPE_MENU_ITEMS: Array<Pick<MenuItem, 'dishId' | 'quantity' | 'note' | 'cookStatus' | 'currentStep'>> = [
  { dishId: 'hongshaorou', quantity: 1, note: '少甜、少油', cookStatus: 'pending', currentStep: 1 },
  { dishId: 'tomato-egg', quantity: 1, note: '多番茄', cookStatus: 'cooking', currentStep: 2 },
  { dishId: 'seaweed-egg-soup', quantity: 1, note: '清淡', cookStatus: 'pending', currentStep: 1 },
  { dishId: 'shredded-potato', quantity: 1, note: '少辣', cookStatus: 'done', currentStep: 4 }
]
const LEGACY_DISH_NAMES: Record<string, string> = {
  hongshaorou: '红烧肉',
  'mapo-tofu': '麻婆豆腐',
  'tomato-egg': '西红柿炒鸡蛋',
  'seaweed-egg-soup': '紫菜蛋花汤',
  'shredded-potato': '酸辣土豆丝'
}
const MIN_REAL_DISH_COUNT = 50
type DishSourceFilter = DishSourceType | 'all'
type DishSearchRow = { dish: Dish; score: number }
type DishSearchField = { text: string; weight: number }

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[\s\-_/|,.;:]+/g, '')
}

function splitSearchTokens(keyword: string) {
  return keyword
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((item) => normalizeSearchText(item))
    .filter(Boolean)
}

function isSubsequenceMatch(text: string, keyword: string) {
  let index = 0
  for (const char of text) {
    if (char !== keyword[index]) continue
    index += 1
    if (index >= keyword.length) return true
  }
  return false
}

function fieldMatchScore(text: string, keyword: string) {
  const normalizedText = normalizeSearchText(text)
  if (!normalizedText || !keyword) return 0
  if (normalizedText === keyword) return 120
  if (normalizedText.startsWith(keyword)) return 90
  if (normalizedText.includes(keyword)) return 70
  return isSubsequenceMatch(normalizedText, keyword) ? 36 : 0
}

function dishSearchFields(dish: Dish): DishSearchField[] {
  const steps = resolvedDishSteps(dish)
  return [
    { text: dish.name, weight: 5 },
    { text: dish.description, weight: 2 },
    ...dish.tasteTags.map((text) => ({ text, weight: 2 })),
    ...dish.ingredients.map((item) => ({ text: item.name, weight: 4 })),
    ...steps.flatMap((step) => [
      { text: step.title, weight: 2 },
      { text: step.description, weight: 1 }
    ]),
    ...dish.tips.map((text) => ({ text, weight: 1 }))
  ]
}

function dishSearchScore(dish: Dish, keyword: string) {
  const tokens = splitSearchTokens(keyword)
  if (!tokens.length) return 0

  const fields = dishSearchFields(dish)
  let total = 0
  for (const token of tokens) {
    let best = 0
    for (const field of fields) {
      const score = fieldMatchScore(field.text, token) * field.weight
      if (score > best) best = score
    }
    if (!best) return 0
    total += best
  }

  total += fieldMatchScore(dish.name, normalizeSearchText(keyword)) * 2
  total += Math.min(dish.ratingCount || 0, 20)
  return total
}

function compareDishSearchRows(left: DishSearchRow, right: DishSearchRow) {
  if (right.score !== left.score) return right.score - left.score
  if ((right.dish.rating || 0) !== (left.dish.rating || 0)) return (right.dish.rating || 0) - (left.dish.rating || 0)
  if ((right.dish.ratingCount || 0) !== (left.dish.ratingCount || 0)) return (right.dish.ratingCount || 0) - (left.dish.ratingCount || 0)
  if (left.dish.estimatedMinutes !== right.dish.estimatedMinutes) return left.dish.estimatedMinutes - right.dish.estimatedMinutes
  return left.dish.name.localeCompare(right.dish.name)
}

interface KitchenTimerTickerStore {
  kitchenTimers: KitchenTimer[]
  syncKitchenTimers: () => void
}

let kitchenTimerTicker: ReturnType<typeof setInterval> | undefined
let loginRedirecting = false

function ensureKitchenTimerTicker(store: KitchenTimerTickerStore) {
  if (kitchenTimerTicker) return

  kitchenTimerTicker = setInterval(() => {
    if (!store.kitchenTimers.some((timer) => timer.status === 'running' && timer.endAt)) return
    store.syncKitchenTimers()
  }, 1000)
}

interface KitchenState {
  hydrated: boolean
  loading: boolean
  apiError: string
  token: string
  user: UserProfile | null
  stats: MeStats
  dishes: Dish[]
  menu: TodayMenu
  records: CookRecord[]
  ratings: Rating[]
  kitchenTimers: KitchenTimer[]
}

interface PersistedAuthState {
  token?: string
  user: UserProfile | null
}

interface PersistedKitchenCache {
  stats?: MeStats
  dishes?: Dish[]
  menu?: TodayMenu
  records?: CookRecord[]
  ratings?: Rating[]
  kitchenTimers?: KitchenTimer[]
  kitchenTimer?: KitchenTimer
}

type PersistedKitchenState = PersistedAuthState & PersistedKitchenCache

const DEFAULT_KITCHEN_TIMER_DURATION_MS = 15 * 60 * 1000

function defaultKitchenTimerContext(): KitchenTimer['context'] {
  return { type: 'manual' }
}

function normalizeKitchenTimerContext(context?: KitchenTimer['context'] | null): KitchenTimer['context'] {
  const type: KitchenTimerContextType = context?.type === 'step' ? 'step' : 'manual'
  const stepNo = Number(context?.stepNo)
  return {
    type,
    itemId: typeof context?.itemId === 'string' && context.itemId ? context.itemId : undefined,
    dishId: typeof context?.dishId === 'string' && context.dishId ? context.dishId : undefined,
    dishName: typeof context?.dishName === 'string' && context.dishName ? context.dishName : undefined,
    stepNo: Number.isFinite(stepNo) && stepNo > 0 ? Math.round(stepNo) : undefined,
    stepTitle: typeof context?.stepTitle === 'string' && context.stepTitle ? context.stepTitle : undefined
  }
}

function makeKitchenTimerScopeKey(context: KitchenTimer['context']) {
  if (context.type === 'step' && context.dishId) return `step:${context.dishId}`
  if (context.type === 'manual' && context.dishId) return `manual:${context.dishId}`
  return `${context.type}:global`
}

function defaultKitchenTimer(timer?: Partial<KitchenTimer>): KitchenTimer {
  const now = Date.now()
  const context = normalizeKitchenTimerContext(timer?.context)
  const durationMs = Math.max(60 * 1000, Number(timer?.durationMs) || DEFAULT_KITCHEN_TIMER_DURATION_MS)
  return {
    id: typeof timer?.id === 'string' && timer.id ? timer.id : makeId('timer'),
    scopeKey: typeof timer?.scopeKey === 'string' && timer.scopeKey ? timer.scopeKey : makeKitchenTimerScopeKey(context),
    status: timer?.status === 'running' || timer?.status === 'paused' || timer?.status === 'finished' ? timer.status : 'idle',
    durationMs,
    remainingMs: Math.max(0, Math.min(durationMs, Number(timer?.remainingMs) || durationMs)),
    endAt: typeof timer?.endAt === 'number' ? timer.endAt : undefined,
    lastFinishedAt: typeof timer?.lastFinishedAt === 'number' ? timer.lastFinishedAt : undefined,
    alertPending: Boolean(timer?.alertPending),
    createdAt: typeof timer?.createdAt === 'number' ? timer.createdAt : now,
    updatedAt: typeof timer?.updatedAt === 'number' ? timer.updatedAt : now,
    context
  }
}

function normalizeKitchenTimer(timer?: Partial<KitchenTimer> | null, now = Date.now()): KitchenTimer | null {
  if (!timer || typeof timer !== 'object') return null

  const fallback = defaultKitchenTimer(timer)
  const durationMs = Math.max(60 * 1000, Number(timer.durationMs) || fallback.durationMs)
  const endAt = typeof timer.endAt === 'number' ? timer.endAt : undefined
  const remainingMs = Math.max(0, Math.min(durationMs, Number(timer.remainingMs) || durationMs))
  const context = normalizeKitchenTimerContext(timer.context)
  const base: KitchenTimer = {
    id: typeof timer.id === 'string' && timer.id ? timer.id : fallback.id,
    scopeKey: typeof timer.scopeKey === 'string' && timer.scopeKey ? timer.scopeKey : makeKitchenTimerScopeKey(context),
    status: fallback.status,
    durationMs,
    remainingMs,
    lastFinishedAt: typeof timer.lastFinishedAt === 'number' ? timer.lastFinishedAt : undefined,
    alertPending: Boolean(timer.alertPending),
    createdAt: typeof timer.createdAt === 'number' ? timer.createdAt : fallback.createdAt,
    updatedAt: typeof timer.updatedAt === 'number' ? timer.updatedAt : now,
    context
  }

  if (fallback.status === 'running' && endAt) {
    const nextRemainingMs = Math.max(0, endAt - now)
    if (nextRemainingMs > 0) {
      return {
        ...base,
        status: 'running',
        remainingMs: nextRemainingMs,
        endAt
      }
    }

    return {
      ...base,
      status: 'finished',
      remainingMs: 0,
      endAt: undefined,
      lastFinishedAt: base.lastFinishedAt || now,
      updatedAt: now,
      alertPending: true
    }
  }

  if (fallback.status === 'paused') {
    return {
      ...base,
      status: 'paused',
      endAt: undefined,
      alertPending: false
    }
  }

  if (fallback.status === 'finished') {
    return {
      ...base,
      status: 'finished',
      remainingMs: 0,
      endAt: undefined,
      lastFinishedAt: base.lastFinishedAt || now
    }
  }

  return {
    ...base,
    status: 'idle',
    endAt: undefined,
    alertPending: false
  }
}

function timerStatusPriority(status: KitchenTimer['status']) {
  if (status === 'running') return 4
  if (status === 'paused') return 3
  if (status === 'finished') return 2
  return 1
}

function sortKitchenTimers(left: KitchenTimer, right: KitchenTimer) {
  const statusGap = timerStatusPriority(right.status) - timerStatusPriority(left.status)
  if (statusGap) return statusGap
  const leftTime = left.status === 'finished' ? left.lastFinishedAt || 0 : left.endAt || left.updatedAt || 0
  const rightTime = right.status === 'finished' ? right.lastFinishedAt || 0 : right.endAt || right.updatedAt || 0
  return rightTime - leftTime
}

function timerStateSignature(timer: KitchenTimer) {
  return [
    timer.id,
    timer.scopeKey,
    timer.status,
    timer.durationMs,
    timer.remainingMs,
    timer.endAt || 0,
    timer.lastFinishedAt || 0,
    timer.alertPending ? 1 : 0,
    timer.createdAt,
    timer.updatedAt,
    timer.context.type,
    timer.context.itemId || '',
    timer.context.dishId || '',
    timer.context.dishName || '',
    timer.context.stepNo || 0,
    timer.context.stepTitle || ''
  ].join('|')
}

function normalizeKitchenTimers(
  timers: Array<Partial<KitchenTimer> | null | undefined> | undefined,
  menuItems: MenuItem[],
  dishes: Dish[]
) {
  const now = Date.now()
  const menuItemMap = new Map(menuItems.map((item) => [item.id, item]))
  const dishMap = new Map(dishes.map((dish) => [dish.id, dish]))
  const deduped = new Map<string, KitchenTimer>()

  for (const rawTimer of timers || []) {
    const normalized = normalizeKitchenTimer(rawTimer, now)
    if (!normalized) continue

    const item = normalized.context.itemId ? menuItemMap.get(normalized.context.itemId) : undefined
    const dishId = item?.dishId || normalized.context.dishId
    if (normalized.context.type === 'step' && (!dishId || !dishMap.has(dishId))) continue
    if (normalized.context.type === 'step' && normalized.context.itemId && !item) continue

    const dish = dishId ? dishMap.get(dishId) : undefined
    const stepNo = Math.max(1, normalized.context.stepNo || item?.currentStep || 1)
    const stepTitle = dish?.steps?.find((step) => step.stepNo === stepNo)?.title || normalized.context.stepTitle
    const context: KitchenTimer['context'] = {
      ...normalized.context,
      dishId,
      dishName: dish?.name || normalized.context.dishName,
      itemId: item?.id || normalized.context.itemId,
      stepNo,
      stepTitle
    }

    const nextTimer: KitchenTimer = {
      ...normalized,
      scopeKey: makeKitchenTimerScopeKey(context),
      context
    }

    if (nextTimer.status === 'idle' && !nextTimer.alertPending) continue
    if (nextTimer.status === 'finished' && !nextTimer.alertPending) continue

    const existed = deduped.get(nextTimer.scopeKey)
    if (!existed) {
      deduped.set(nextTimer.scopeKey, nextTimer)
      continue
    }

    const shouldReplace =
      timerStatusPriority(nextTimer.status) > timerStatusPriority(existed.status) ||
      (timerStatusPriority(nextTimer.status) === timerStatusPriority(existed.status) && nextTimer.updatedAt >= existed.updatedAt)

    if (shouldReplace) deduped.set(nextTimer.scopeKey, nextTimer)
  }

  return [...deduped.values()].sort(sortKitchenTimers)
}

function normalizeCachedUser(user: UserProfile | null) {
  if (!user) return null
  return {
    ...user,
    avatarUrl: normalizeUserAvatarUrl(user.avatarUrl)
  }
}

function needsWechatProfileCompletion(user: UserProfile | null) {
  if (!user?.wechatOpenId) return false
  return !user.nickname?.trim() || user.nickname === '微信用户' || isDefaultUserAvatar(user.avatarUrl)
}

function todayText() {
  const date = new Date()
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function nowText() {
  const date = new Date()
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  const h = `${date.getHours()}`.padStart(2, '0')
  const min = `${date.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function sourceTypeOf(dish: Dish): DishSourceType {
  return dish.sourceType || 'system_sync'
}

function collectedTips(steps: EditableDishInput['steps']) {
  const tips = Array.from(new Set(steps.map((step) => step.tips.trim()).filter(Boolean))).slice(0, 4)
  return tips.length ? tips : ['出锅前尝味，根据口味微调盐分。']
}

function sourceLabelOf(dish: Dish) {
  return sourceTypeOf(dish) === 'system_sync' ? '后台同步' : '用户录入'
}

function canUserEditDish(dish: Dish, user: UserProfile | null) {
  return sourceTypeOf(dish) === 'user_created' && Boolean(user?.id) && dish.ownerUserId === user?.id
}

function normalizeCookStatus(status: unknown): CookStatus {
  return status === 'cooking' || status === 'done' ? status : 'pending'
}

function isLegacyPrototypeMenu(menu?: TodayMenu | null) {
  if (!menu || menu.servings !== 3 || menu.status !== 'draft' || menu.items.length !== LEGACY_PROTOTYPE_MENU_ITEMS.length) return false

  const items = [...menu.items].sort((left, right) => left.sortOrder - right.sortOrder)
  const matchesPrototypeItems = LEGACY_PROTOTYPE_MENU_ITEMS.every((legacyItem, index) => {
    const current = items[index]
    if (!current) return false
    return (
      current.dishId === legacyItem.dishId &&
      current.quantity === legacyItem.quantity &&
      current.note === legacyItem.note &&
      current.cookStatus === legacyItem.cookStatus &&
      current.currentStep === legacyItem.currentStep
    )
  })

  return matchesPrototypeItems && Boolean(items[1]?.startedAt) && Boolean(items[3]?.startedAt) && items[3]?.finishedAt === '10:20'
}

function normalizeMenu(menu?: TodayMenu | null, dishes: Dish[] = []): TodayMenu {
  const fallback = defaultMenu()
  if (!menu || typeof menu !== 'object' || isLegacyPrototypeMenu(menu)) return fallback

  const availableDishIds = dishes.length ? new Set(dishes.map((dish) => dish.id)) : null
  const items = (Array.isArray(menu.items) ? [...menu.items] : [])
    .filter((item): item is MenuItem => Boolean(item && typeof item === 'object' && typeof item.dishId === 'string' && item.dishId))
    .sort((left, right) => (Number(left.sortOrder) || 0) - (Number(right.sortOrder) || 0))
    .filter((item) => !availableDishIds || availableDishIds.has(item.dishId))
    .map<MenuItem>((item, index) => ({
      id: typeof item.id === 'string' && item.id ? item.id : makeId('item'),
      dishId: item.dishId,
      quantity: Math.max(1, Number(item.quantity) || 1),
      note: typeof item.note === 'string' ? item.note : '',
      sortOrder: index + 1,
      cookStatus: normalizeCookStatus(item.cookStatus),
      currentStep: Math.max(1, Number(item.currentStep) || 1),
      startedAt: typeof item.startedAt === 'string' ? item.startedAt : undefined,
      finishedAt: typeof item.finishedAt === 'string' ? item.finishedAt : undefined
    }))

  return {
    ...fallback,
    id: typeof menu.id === 'string' && menu.id ? menu.id : fallback.id,
    menuDate: typeof menu.menuDate === 'string' && menu.menuDate ? menu.menuDate : fallback.menuDate,
    servings: Math.max(1, Number(menu.servings) || fallback.servings),
    status: items.length && menu.status === 'submitted' ? 'submitted' : 'draft',
    items
  }
}

function dishByRecordId(dishes: Dish[], dishId: string) {
  const direct = dishes.find((dish) => dish.id === dishId)
  if (direct) return direct

  const legacyName = LEGACY_DISH_NAMES[dishId]
  if (!legacyName) return undefined
  return dishes.find((dish) => dish.name === legacyName || dish.name.includes(legacyName) || legacyName.includes(dish.name))
}

function repairRecordsForDishes(records: CookRecord[], dishes: Dish[]) {
  let changed = false
  const repaired = records.map((record) => {
    if (dishes.some((dish) => dish.id === record.dishId)) return record

    const dish = dishByRecordId(dishes, record.dishId)
    if (!dish) return record
    changed = true
    return {
      ...record,
      dishId: dish.id,
      photos: record.photos.length ? record.photos : [dish.coverImage]
    }
  })

  return { records: repaired, changed }
}

function defaultMenu(): TodayMenu {
  return {
    id: makeId('menu'),
    menuDate: todayText(),
    servings: 3,
    status: 'draft',
    items: []
  }
}

function defaultRecords(): CookRecord[] {
  return [
    {
      id: 'record-hongshaorou',
      dishId: 'hongshaorou',
      menuItemId: undefined,
      startedAt: '2024-05-24 18:40',
      finishedAt: '2024-05-24 19:35',
      actualMinutes: 55,
      photos: [prototypeSeedDishes[0].coverImage, prototypeSeedDishes[0].detailImage],
      tasteFeedback: '刚好',
      note: '五花肉炖得软糯入味，酱汁收得也刚好。下次可以再多炖 10 分钟。',
      includeInHistory: true
    },
    {
      id: 'record-mapo',
      dishId: 'mapo-tofu',
      menuItemId: undefined,
      startedAt: '2024-05-21 18:20',
      finishedAt: '2024-05-21 18:45',
      actualMinutes: 25,
      photos: [prototypeSeedDishes.find((dish) => dish.id === 'mapo-tofu')?.coverImage || prototypeSeedDishes[0].coverImage],
      tasteFeedback: '偏咸',
      note: '豆腐嫩，麻味够，盐可以少一点。',
      includeInHistory: true
    }
  ]
}

function defaultRatings(): Rating[] {
  return [
    {
      id: 'rating-hongshaorou',
      cookRecordId: 'record-hongshaorou',
      tasteScore: 4.6,
      appearanceScore: 4.4,
      similarityScore: 4.3,
      heatScore: 4.8,
      satisfactionScore: 4.2,
      overallScore: 4.5,
      comment: '味道很香，颜色很好，收汁可以再浓一点。',
      createdAt: '2024-05-24 19:45'
    }
  ]
}

function defaultStats(): MeStats {
  return {
    dishCount: 0,
    visibleDishCount: 0,
    learnedDishCount: 0,
    recordCount: 0,
    averageRating: 0
  }
}

function initialState(): Omit<KitchenState, 'hydrated'> {
  return {
    loading: false,
    apiError: '',
    token: '',
    user: null,
    stats: defaultStats(),
    dishes: prototypeSeedDishes,
    menu: defaultMenu(),
    records: defaultRecords(),
    ratings: defaultRatings(),
    kitchenTimers: []
  }
}

function readPersistedObject<T>(key: string) {
  try {
    const cached = uni.getStorageSync(key) as T | ''
    return cached && typeof cached === 'object' ? cached : null
  } catch {
    return null
  }
}

function writePersistedObject(key: string, payload: unknown) {
  try {
    uni.setStorageSync(key, payload)
    return true
  } catch (error) {
    console.warn(`[kitchen-store] failed to persist ${key}`, error)
    return false
  }
}

function removePersistedObject(key: string) {
  try {
    uni.removeStorageSync(key)
  } catch {}
}

function isTokenInvalidError(error: unknown) {
  return error instanceof ApiError && (
    error.code === 'TOKEN_INVALID' ||
    (error.status === 401 && error.message === 'Unauthorized')
  )
}

function redirectToLogin(message: string) {
  if (loginRedirecting) return
  loginRedirecting = true
  uni.showToast({ title: message, icon: 'none' })
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/index',
      complete: () => {
        loginRedirecting = false
      }
    })
  }, 300)
}

export const useKitchenStore = defineStore('kitchen', {
  state: (): KitchenState => ({
    hydrated: false,
    ...initialState()
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.user),
    sortedMenuItems: (state) => [...state.menu.items].sort((a, b) => a.sortOrder - b.sortOrder),
    menuDishes(state): Array<MenuItem & { dish: Dish }> {
      return [...state.menu.items]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => ({ ...item, dish: state.dishes.find((dish) => dish.id === item.dishId) as Dish }))
        .filter((item) => item.dish)
    },
    pendingCount: (state) => state.menu.items.filter((item) => item.cookStatus === 'pending').length,
    cookingCount: (state) => state.menu.items.filter((item) => item.cookStatus === 'cooking').length,
    doneCount: (state) => state.menu.items.filter((item) => item.cookStatus === 'done').length,
    menuDishCount: (state) => state.menu.items.reduce((sum, item) => sum + item.quantity, 0),
    myDishCount(state): number {
      if (state.token) return state.stats.dishCount
      if (!state.user?.id) return 0
      return state.dishes.filter((dish) => canUserEditDish(dish, state.user)).length
    },
    myRecordCount(state): number {
      return state.token ? state.stats.recordCount : state.records.filter((item) => item.includeInHistory).length
    },
    learnedDishCount(state): number {
      if (state.token) return state.stats.learnedDishCount
      return state.dishes.filter((dish) => Boolean(dish.learnedAt)).length
    },
    favoriteDishCount(state): number {
      return state.dishes.filter((dish) => dish.isFavorite).length
    },
    estimatedMinutes(state): number {
      return state.menu.items.reduce((sum, item) => {
        const dish = state.dishes.find((candidate) => candidate.id === item.dishId)
        return sum + (dish?.estimatedMinutes || 0)
      }, 0)
    },
    averageRating(state): number {
      if (state.token) return state.stats.averageRating
      if (!state.ratings.length) return 0
      const total = state.ratings.reduce((sum, item) => sum + item.overallScore, 0)
      return Number((total / state.ratings.length).toFixed(1))
    },
    historyRecords(state): Array<CookRecord & { dish: Dish; rating?: Rating }> {
      return state.records
        .filter((record) => record.includeInHistory)
        .map((record) => ({
          ...record,
          dish: dishByRecordId(state.dishes, record.dishId) as Dish,
          rating: state.ratings.find((rating) => rating.cookRecordId === record.id)
        }))
        .filter((record) => record.dish)
    },
    activeKitchenTimers(state) {
      return state.kitchenTimers
        .filter((timer) => timer.status === 'running' || timer.status === 'paused')
        .sort(sortKitchenTimers)
    },
    pendingKitchenTimerAlerts(state) {
      return state.kitchenTimers
        .filter((timer) => timer.alertPending)
        .sort((left, right) => (right.lastFinishedAt || 0) - (left.lastFinishedAt || 0))
    }
  },
  actions: {
    buildCachePayload(): PersistedKitchenCache {
      return {
        stats: this.stats,
        dishes: this.dishes,
        menu: this.menu,
        records: this.records,
        ratings: this.ratings,
        kitchenTimers: this.kitchenTimers
      }
    },
    buildCompactCachePayload(): PersistedKitchenCache {
      return {
        stats: this.stats,
        dishes: this.token ? [] : prototypeSeedDishes,
        menu: this.menu,
        records: this.token ? [] : defaultRecords(),
        ratings: this.token ? [] : defaultRatings(),
        kitchenTimers: this.kitchenTimers
      }
    },
    persistAuth() {
      if (!this.token || !this.user) {
        removePersistedObject(AUTH_STORAGE_KEY)
        return
      }

      writePersistedObject(AUTH_STORAGE_KEY, {
        token: this.token,
        user: this.user
      } satisfies PersistedAuthState)
    },
    persistCache() {
      const payload = this.buildCachePayload()
      if (writePersistedObject(CACHE_STORAGE_KEY, payload)) return

      removePersistedObject(CACHE_STORAGE_KEY)
      writePersistedObject(CACHE_STORAGE_KEY, this.buildCompactCachePayload())
    },
    resetLocalState() {
      const next = initialState()
      this.loading = next.loading
      this.apiError = next.apiError
      this.token = next.token
      this.user = next.user
      this.stats = next.stats
      this.dishes = next.dishes
      this.menu = next.menu
      this.records = next.records
      this.ratings = next.ratings
      this.kitchenTimers = next.kitchenTimers
    },
    expireSession(message = '登录已过期，请重新登录') {
      this.resetLocalState()
      this.hydrated = true
      this.apiError = message
      removePersistedObject(AUTH_STORAGE_KEY)
      removePersistedObject(CACHE_STORAGE_KEY)
      removePersistedObject(LEGACY_STORAGE_KEY)
      redirectToLogin(message)
    },
    requireSession() {
      if (this.token && this.user) return
      const message = '请先登录后再操作'
      this.expireSession(message)
      throw new Error(message)
    },
    cacheSession(token: string, user: UserProfile) {
      this.token = token
      this.user = user
      this.persistAuth()
    },
    async establishSession(token: string, user: UserProfile) {
      this.cacheSession(token, user)

      try {
        await this.refreshSessionData()
      } catch {
        this.persistCache()
      }
    },
    hydrate() {
      if (this.hydrated) return
      const authCache = readPersistedObject<PersistedAuthState>(AUTH_STORAGE_KEY)
      const cache = readPersistedObject<PersistedKitchenCache>(CACHE_STORAGE_KEY)
      const legacyCache = readPersistedObject<PersistedKitchenState>(LEGACY_STORAGE_KEY)
      const sessionSource = authCache || legacyCache
      const cacheSource = cache || legacyCache

      if (sessionSource) {
        this.token = sessionSource.token || ''
        this.user = this.token ? normalizeCachedUser(sessionSource.user) : null
      }

      if (cacheSource) {
        this.stats = cacheSource.stats || defaultStats()
        if (Array.isArray(cacheSource.dishes)) {
          this.dishes = cacheSource.dishes.length ? cacheSource.dishes : (this.token ? [] : prototypeSeedDishes)
        } else {
          this.dishes = prototypeSeedDishes
        }
        this.menu = normalizeMenu(cacheSource.menu, this.dishes)
        this.records = Array.isArray(cacheSource.records) ? cacheSource.records : (this.token ? [] : defaultRecords())
        this.ratings = Array.isArray(cacheSource.ratings) ? cacheSource.ratings : (this.token ? [] : defaultRatings())
        this.kitchenTimers = normalizeKitchenTimers(
          Array.isArray(cacheSource.kitchenTimers) ? cacheSource.kitchenTimers : cacheSource.kitchenTimer ? [cacheSource.kitchenTimer] : [],
          this.menu.items,
          this.dishes
        )
      }
      this.hydrated = true
      this.syncKitchenTimers()
      ensureKitchenTimerTicker(this)

      if (legacyCache) {
        removePersistedObject(LEGACY_STORAGE_KEY)
      }
      if (cacheSource || legacyCache) this.persist()
    },
    persist() {
      this.persistAuth()
      this.persistCache()
      removePersistedObject(LEGACY_STORAGE_KEY)
    },
    activeTimerForScope(scopeKey: string) {
      return this.kitchenTimers.find((timer) => timer.scopeKey === scopeKey)
    },
    getStepTimerByItem(itemId: string) {
      return this.kitchenTimers.find((timer) => timer.context.type === 'step' && timer.context.itemId === itemId)
    },
    kitchenTimerRemaining(timerId: string) {
      const timer = this.kitchenTimers.find((candidate) => candidate.id === timerId)
      if (!timer) return 0
      if (timer.status === 'running' && timer.endAt) return Math.max(0, timer.endAt - Date.now())
      return timer.remainingMs
    },
    upsertKitchenTimer(nextTimer: KitchenTimer) {
      const index = this.kitchenTimers.findIndex((timer) => timer.id === nextTimer.id)
      if (index >= 0) this.kitchenTimers.splice(index, 1, nextTimer)
      else this.kitchenTimers.unshift(nextTimer)
      this.kitchenTimers = [...this.kitchenTimers].sort(sortKitchenTimers)
    },
    removeKitchenTimer(timerId: string) {
      this.kitchenTimers = this.kitchenTimers.filter((timer) => timer.id !== timerId)
    },
    syncKitchenTimers() {
      const next = normalizeKitchenTimers(this.kitchenTimers, this.menu.items, this.dishes)
      const before = this.kitchenTimers.map(timerStateSignature).join('||')
      const after = next.map(timerStateSignature).join('||')
      if (before === after) return
      this.kitchenTimers = next
      this.persist()
    },
    buildStepTimerContext(itemId: string): KitchenTimer['context'] {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      const dish = item ? this.getDish(item.dishId) : undefined
      const steps = dish ? resolvedDishSteps(dish) : []
      const step = item ? steps[(item.currentStep || 1) - 1] || steps[0] : undefined
      return {
        type: 'step',
        itemId,
        dishId: dish?.id,
        dishName: dish?.name,
        stepNo: step?.stepNo || item?.currentStep,
        stepTitle: step?.title
      }
    },
    startKitchenTimer(minutes: number | undefined, context: KitchenTimer['context'] = defaultKitchenTimerContext()) {
      const normalizedContext = normalizeKitchenTimerContext(context)
      const scopeKey = makeKitchenTimerScopeKey(normalizedContext)
      const existed = this.activeTimerForScope(scopeKey)
      const durationMs = Math.max(
        60 * 1000,
        typeof minutes === 'number' ? Math.round(minutes) * 60 * 1000 : existed?.durationMs || DEFAULT_KITCHEN_TIMER_DURATION_MS
      )
      const now = Date.now()
      const nextTimer = defaultKitchenTimer({
        id: existed?.id,
        scopeKey,
        status: 'running',
        durationMs,
        remainingMs: durationMs,
        endAt: now + durationMs,
        lastFinishedAt: existed?.lastFinishedAt,
        alertPending: false,
        createdAt: existed?.createdAt || now,
        updatedAt: now,
        context: normalizedContext
      })
      this.upsertKitchenTimer(nextTimer)
      ensureKitchenTimerTicker(this)
      this.persist()
      return nextTimer
    },
    startStepKitchenTimer(itemId: string, minutes: number) {
      return this.startKitchenTimer(minutes, this.buildStepTimerContext(itemId))
    },
    pauseKitchenTimer(timerId: string) {
      const timer = this.kitchenTimers.find((candidate) => candidate.id === timerId)
      if (!timer || timer.status !== 'running') return
      const remainingMs = timer.endAt ? Math.max(0, timer.endAt - Date.now()) : timer.remainingMs
      this.upsertKitchenTimer({
        ...timer,
        status: remainingMs > 0 ? 'paused' : 'finished',
        remainingMs,
        endAt: undefined,
        lastFinishedAt: remainingMs > 0 ? timer.lastFinishedAt : Date.now(),
        updatedAt: Date.now(),
        alertPending: remainingMs <= 0
      })
      this.persist()
    },
    resumeKitchenTimer(timerId: string) {
      const timer = this.kitchenTimers.find((candidate) => candidate.id === timerId)
      if (!timer || timer.status !== 'paused') return
      const remainingMs = Math.max(0, timer.remainingMs)
      if (!remainingMs) return
      this.upsertKitchenTimer({
        ...timer,
        status: 'running',
        remainingMs,
        endAt: Date.now() + remainingMs,
        updatedAt: Date.now(),
        alertPending: false
      })
      ensureKitchenTimerTicker(this)
      this.persist()
    },
    resetKitchenTimer(timerId: string) {
      const timer = this.kitchenTimers.find((candidate) => candidate.id === timerId)
      if (!timer) return
      this.removeKitchenTimer(timerId)
      this.persist()
    },
    finishKitchenTimer(timerId: string) {
      const timer = this.kitchenTimers.find((candidate) => candidate.id === timerId)
      if (!timer) return
      this.upsertKitchenTimer({
        ...timer,
        status: 'finished',
        remainingMs: 0,
        endAt: undefined,
        lastFinishedAt: Date.now(),
        updatedAt: Date.now(),
        alertPending: true
      })
      this.persist()
    },
    acknowledgeKitchenTimerAlert(timerId: string) {
      const timer = this.kitchenTimers.find((candidate) => candidate.id === timerId)
      if (!timer?.alertPending) return
      this.removeKitchenTimer(timerId)
      this.persist()
    },
    async runRemote<T>(task: () => Promise<T>) {
      this.loading = true
      this.apiError = ''
      try {
        return await task()
      } catch (error) {
        if (isTokenInvalidError(error)) {
          this.expireSession('登录已过期，请重新登录')
          throw error
        }
        const message = error instanceof Error ? error.message : '网络请求失败'
        this.apiError = message
        throw error
      } finally {
        this.loading = false
      }
    },
    async loginWithEmail(email: string, password: string) {
      const result = await this.runRemote(() => kitchenApi.loginWithEmail(email, password))
      await this.establishSession(result.token, result.user)
    },
    async registerWithEmail(email: string, password: string) {
      const result = await this.runRemote(() => kitchenApi.registerWithEmail(email, password))
      await this.establishSession(result.token, result.user)
    },
    async loginWithWechat() {
      const loginResult = await new Promise<UniApp.LoginRes>((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: resolve,
          fail: (error) => reject(new Error(error.errMsg || '微信登录失败'))
        })
      })

      if (!loginResult.code) throw new Error('未获取到微信登录凭证')

      const result = await this.runRemote(() => kitchenApi.loginWithWechat(loginResult.code))
      await this.establishSession(result.token, result.user)
    },
    async bindEmail(email: string, password: string) {
      if (!this.token) throw new Error('当前未登录')
      const result = await this.runRemote(() => kitchenApi.bindEmail(this.token, email, password))
      await this.establishSession(result.token, result.user)
    },
    needsWechatProfileCompletion() {
      return needsWechatProfileCompletion(this.user)
    },
    logout() {
      this.resetLocalState()
      removePersistedObject(AUTH_STORAGE_KEY)
      removePersistedObject(CACHE_STORAGE_KEY)
      removePersistedObject(LEGACY_STORAGE_KEY)
    },
    async clearCacheAndForceRelogin() {
      this.logout()
      if (typeof window !== 'undefined') {
        await forceReloadToHash('#/pages/login/index', { preserveAuth: false })
        return
      }
      uni.reLaunch({ url: '/pages/login/index' })
    },
    async refreshSessionData() {
      if (!this.token) return
      const [dishes, records, ratings, stats] = await this.runRemote(() =>
        Promise.all([
          kitchenApi.listDishes(this.token),
          kitchenApi.listRecords(this.token),
          kitchenApi.listRatings(this.token),
          kitchenApi.getMyStats(this.token)
        ])
      )
      this.dishes = dishes
      this.records = records
      this.ratings = ratings
      this.stats = stats
      this.menu = normalizeMenu(this.menu, this.dishes)
      const repaired = repairRecordsForDishes(this.records, this.dishes)
      if (repaired.changed) this.records = repaired.records
      this.persist()
    },
    async refreshDishes() {
      if (!this.token) return
      const dishes = await this.runRemote(() => kitchenApi.listDishes(this.token))
      this.dishes = dishes
      this.menu = normalizeMenu(this.menu, this.dishes)
      const repaired = repairRecordsForDishes(this.records, this.dishes)
      if (repaired.changed) this.records = repaired.records
      this.persist()
    },
    async refreshStats() {
      if (!this.token) return
      this.stats = await this.runRemote(() => kitchenApi.getMyStats(this.token))
      this.persist()
    },
    async uploadFiles(filePaths: string[]) {
      this.requireSession()
      return this.runRemote(() => kitchenApi.uploadFiles(this.token, filePaths))
    },
    async refreshRecordsAndRatings() {
      if (!this.token) return
      const [records, ratings] = await this.runRemote(() =>
        Promise.all([kitchenApi.listRecords(this.token), kitchenApi.listRatings(this.token)])
      )
      this.records = records
      this.ratings = ratings
      const repaired = repairRecordsForDishes(this.records, this.dishes)
      if (repaired.changed) this.records = repaired.records
      this.persist()
    },
    async ensureRemoteDishes() {
      if (!this.token || this.loading) return
      if (this.dishes.length >= MIN_REAL_DISH_COUNT && this.dishes.some((dish) => dish.sourceType === 'system_sync')) return
      try {
        await this.refreshDishes()
      } catch {
        if (!this.dishes.length) this.dishes = prototypeSeedDishes
      }
    },
    async loadDish(id: string) {
      if (!this.token) return this.getDish(id)
      try {
        const dish = await this.runRemote(() => kitchenApi.getDish(this.token, id))
        const index = this.dishes.findIndex((item) => item.id === id)
        if (index >= 0) this.dishes.splice(index, 1, dish)
        else this.dishes.unshift(dish)
        this.persist()
        return dish
      } catch {
        return this.getDish(id)
      }
    },
    getDish(id: string) {
      return this.dishes.find((dish) => dish.id === id)
    },
    dishSourceType(dish: Dish) {
      return sourceTypeOf(dish)
    },
    dishSourceLabel(dish: Dish) {
      return sourceLabelOf(dish)
    },
    isDishLearned(dishId: string) {
      return Boolean(this.getDish(dishId)?.learnedAt)
    },
    learnedDishEntries(): LearnedDishEntry[] {
      return this.dishes
        .filter((dish) => Boolean(dish.learnedAt))
        .map((dish) => ({
          id: `learned-${dish.id}`,
          learnedAt: dish.learnedAt as string,
          dish
        }))
        .sort((left, right) => new Date(right.learnedAt).getTime() - new Date(left.learnedAt).getTime())
    },
    canEditDish(dish: Dish) {
      return canUserEditDish(dish, this.user)
    },
    myCreatedDishes() {
      return this.dishes.filter((dish) => this.canEditDish(dish))
    },
    favoriteDishEntries(): FavoriteDishEntry[] {
      return this.dishes
        .filter((dish) => dish.isFavorite)
        .map((dish) => ({
          id: `favorite-${dish.id}`,
          favoritedAt: '',
          dish
        }))
    },
    async setDishLearned(dishId: string, learned: boolean, learnedAt?: string) {
      const dish = this.getDish(dishId)
      if (!dish) throw new Error('菜品不存在')

      if (this.token) {
        const result = await this.runRemote(() => kitchenApi.updateLearnedDish(this.token, dishId, learned, learnedAt))
        dish.learnedAt = result.learnedAt || undefined
        await this.refreshStats()
        this.persist()
        return dish.learnedAt
      }

      dish.learnedAt = learned ? learnedAt || new Date().toISOString() : undefined
      this.persist()
      return dish.learnedAt
    },
    async toggleDishLearned(dishId: string) {
      const dish = this.getDish(dishId)
      if (!dish) throw new Error('菜品不存在')
      return this.setDishLearned(dishId, !dish.learnedAt, new Date().toISOString())
    },
    async fetchLearnedDishEntries() {
      if (!this.token) return this.learnedDishEntries()

      const entries = await this.runRemote(() => kitchenApi.listLearnedDishes(this.token))
      const learnedMap = new Map(entries.map((entry) => [entry.dish.id, entry.learnedAt]))
      for (const dish of this.dishes) {
        dish.learnedAt = learnedMap.get(dish.id) || undefined
      }
      this.stats.learnedDishCount = learnedMap.size
      this.persist()
      return entries
    },
    async setDishFavorite(dishId: string, favorite: boolean) {
      const dish = this.getDish(dishId)
      if (!dish) throw new Error('菜品不存在')

      if (this.token) {
        const result = await this.runRemote(() => kitchenApi.updateFavoriteDish(this.token, dishId, favorite))
        dish.isFavorite = result.isFavorite
        this.persist()
        return dish.isFavorite
      }

      dish.isFavorite = favorite
      this.persist()
      return dish.isFavorite
    },
    async toggleDishFavorite(dishId: string) {
      const dish = this.getDish(dishId)
      if (!dish) throw new Error('菜品不存在')
      return this.setDishFavorite(dishId, !dish.isFavorite)
    },
    async fetchFavoriteDishEntries() {
      if (!this.token) return this.favoriteDishEntries()

      const entries = await this.runRemote(() => kitchenApi.listFavoriteDishes(this.token))
      const favoriteSet = new Set(entries.map((entry) => entry.dish.id))
      for (const dish of this.dishes) {
        dish.isFavorite = favoriteSet.has(dish.id)
      }
      this.persist()
      return entries
    },
    async updateProfile(input: Pick<UserProfile, 'nickname' | 'avatarUrl'>) {
      if (this.token) {
        this.user = await this.runRemote(() => kitchenApi.updateProfile(this.token, input))
        this.persist()
        return this.user
      }
      if (!this.user) return null
      this.user = { ...this.user, ...input }
      this.persist()
      return this.user
    },
    dishesByCategory(category: DishCategory | 'all', keyword = '', source: DishSourceFilter = 'all') {
      const normalized = keyword.trim()
      const rows = this.dishes
        .filter((dish) => {
          const matchCategory = category === 'all' || dish.category === category
          const matchSource = source === 'all' || sourceTypeOf(dish) === source
          return matchCategory && matchSource
        })
        .map((dish) => ({
          dish,
          score: normalized ? dishSearchScore(dish, normalized) : 0
        }))
        .filter((row) => !normalized || row.score > 0)

      if (!normalized) return rows.map((row) => row.dish)
      return rows.sort(compareDishSearchRows).map((row) => row.dish)
    },
    dishSearchCandidates(keyword: string, source: DishSourceFilter = 'all', limit = 8) {
      const normalized = keyword.trim()
      if (!normalized) return [] as Dish[]

      return this.dishes
        .filter((dish) => source === 'all' || sourceTypeOf(dish) === source)
        .map((dish) => ({
          dish,
          score: dishSearchScore(dish, normalized)
        }))
        .filter((row) => row.score > 0)
        .sort(compareDishSearchRows)
        .slice(0, limit)
        .map((row) => row.dish)
    },
    addToMenu(dishId: string) {
      const existed = this.menu.items.find((item) => item.dishId === dishId)
      if (existed) {
        existed.quantity += 1
      } else {
        this.menu.items.push({
          id: makeId('item'),
          dishId,
          quantity: 1,
          note: '',
          sortOrder: this.menu.items.length + 1,
          cookStatus: 'pending',
          currentStep: 1
        })
      }
      this.persist()
      uni.showToast({ title: '已加入点菜单', icon: 'success' })
    },
    updateQuantity(itemId: string, delta: number) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      if (!item) return
      item.quantity = Math.max(1, item.quantity + delta)
      this.persist()
    },
    updateNote(itemId: string, note: string) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      if (!item) return
      item.note = note
      this.persist()
    },
    moveMenuItem(itemId: string, direction: -1 | 1) {
      const items = [...this.menu.items].sort((a, b) => a.sortOrder - b.sortOrder)
      const index = items.findIndex((item) => item.id === itemId)
      const target = index + direction
      if (index < 0 || target < 0 || target >= items.length) return
      const currentOrder = items[index].sortOrder
      items[index].sortOrder = items[target].sortOrder
      items[target].sortOrder = currentOrder
      this.persist()
    },
    submitMenu() {
      if (!this.menu.items.length) {
        uni.showToast({ title: '先加一道菜', icon: 'none' })
        return false
      }
      this.menu.status = 'submitted'
      this.persist()
      return true
    },
    setCookStatus(itemId: string, status: CookStatus) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      if (!item) return
      item.cookStatus = status
      if (status === 'cooking' && !item.startedAt) item.startedAt = nowText()
      if (status === 'done') item.finishedAt = nowText()
      this.persist()
    },
    setStep(itemId: string, stepNo: number) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      if (!item) return
      const dish = this.getDish(item.dishId)
      const max = dish ? resolvedDishSteps(dish).length : 1
      item.currentStep = Math.min(Math.max(1, stepNo), max)
      item.cookStatus = item.currentStep >= max ? item.cookStatus : 'cooking'
      if (!item.startedAt) item.startedAt = nowText()
      this.persist()
    },
    completeDish(itemId: string) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      if (!item) return
      const dish = this.getDish(item.dishId)
      item.currentStep = dish ? resolvedDishSteps(dish).length : item.currentStep
      item.cookStatus = 'done'
      item.finishedAt = nowText()
      this.persist()
    },
    async createCookRecord(input: {
      dishId: string
      menuItemId?: string
      actualMinutes: number
      photos: string[]
      tasteFeedback: TasteFeedback
      note: string
      includeInHistory: boolean
    }) {
      const menuItem = input.menuItemId ? this.menu.items.find((item) => item.id === input.menuItemId) : undefined
      this.requireSession()
      if (this.token) {
        const pendingUploads = input.photos.filter((photo) => !photo.startsWith('/static/') && !photo.startsWith('/uploads/') && !/^https?:\/\//.test(photo))
        let uploadedPhotos = pendingUploads
        if (pendingUploads.length) {
          uploadedPhotos = await this.runRemote(() => kitchenApi.uploadFiles(this.token, pendingUploads))
        }
        let uploadIndex = 0
        const normalizedPhotos = input.photos.map((photo) => {
          if (photo.startsWith('/static/') || photo.startsWith('/uploads/') || /^https?:\/\//.test(photo)) return photo
          const next = uploadedPhotos[uploadIndex]
          uploadIndex += 1
          return next || photo
        })
        const record = await this.runRemote(() =>
          kitchenApi.createRecord(this.token, {
            ...input,
            photos: normalizedPhotos
          })
        )
        this.records.unshift(record)
        if (input.menuItemId) this.completeDish(input.menuItemId)
        await this.refreshStats()
        this.persist()
        return record.id
      }
      const record: CookRecord = {
        id: makeId('record'),
        dishId: input.dishId,
        menuItemId: input.menuItemId,
        startedAt: menuItem?.startedAt || nowText(),
        finishedAt: nowText(),
        actualMinutes: input.actualMinutes,
        photos: input.photos,
        tasteFeedback: input.tasteFeedback,
        note: input.note,
        includeInHistory: input.includeInHistory
      }
      this.records.unshift(record)
      if (input.menuItemId) this.completeDish(input.menuItemId)
      this.persist()
      return record.id
    },
    async saveRating(recordId: string, rating: Omit<Rating, 'id' | 'cookRecordId' | 'createdAt'>) {
      this.requireSession()
      if (this.token) {
        const saved = await this.runRemote(() => kitchenApi.saveRating(this.token, recordId, rating))
        const existed = this.ratings.find((item) => item.cookRecordId === recordId)
        if (existed) Object.assign(existed, saved)
        else this.ratings.unshift(saved)
        await this.refreshStats()
        this.persist()
        return
      }
      const existed = this.ratings.find((item) => item.cookRecordId === recordId)
      if (existed) {
        Object.assign(existed, rating, { createdAt: nowText() })
      } else {
        this.ratings.unshift({
          id: makeId('rating'),
          cookRecordId: recordId,
          createdAt: nowText(),
          ...rating
        })
      }
      this.persist()
    },
    async createDish(input: EditableDishInput) {
      this.requireSession()
      if (this.token) {
        const dish = await this.runRemote(() => kitchenApi.createDish(this.token, input))
        this.dishes.unshift(dish)
        await this.refreshStats()
        this.persist()
        return dish.id
      }

      const base = prototypeSeedDishes[0]
      const dish: Dish = {
        ...base,
        id: makeId('dish'),
        name: input.name,
        emoji: '🍽️',
        category: input.category,
        coverImage: input.coverImage || base.coverImage,
        squareImage: input.coverImage || base.squareImage,
        detailImage: input.coverImage || base.detailImage,
        description: input.description,
        remark: input.remark,
        difficulty: input.difficulty,
        estimatedMinutes: input.estimatedMinutes,
        servings: input.servings,
        tasteTags: input.tasteTags?.length ? input.tasteTags : ['用户录入'],
        rating: 0,
        ratingCount: 0,
        isFavorite: false,
        sourceType: 'user_created',
        sourceName: '用户录入',
        ownerUserId: this.user?.id,
        ingredients: input.ingredients.map((item, index) => ({
          id: makeId('ingredient'),
          groupType: item.groupType,
          name: item.name,
          amount: item.amount,
          sortOrder: index
        })),
        steps: input.steps.map((item, index) => ({
          id: makeId('step'),
          stepNo: index + 1,
          title: item.title,
          description: item.description,
          image: item.image || input.coverImage || base.coverImage,
          heat: item.heat,
          minutes: item.minutes,
          tips: item.tips
        })),
        tips: collectedTips(input.steps)
      }
      this.dishes.unshift(dish)
      this.persist()
      return dish.id
    },
    async updateDish(id: string, input: EditableDishInput) {
      const existing = this.getDish(id)
      if (!existing || !this.canEditDish(existing)) throw new Error('当前用户无权编辑这道菜')
      this.requireSession()

      if (this.token) {
        const dish = await this.runRemote(() => kitchenApi.updateDish(this.token, id, input))
        const index = this.dishes.findIndex((item) => item.id === id)
        if (index >= 0) this.dishes.splice(index, 1, dish)
        this.persist()
        return dish.id
      }

      existing.name = input.name
      existing.category = input.category
      existing.coverImage = input.coverImage || existing.coverImage
      existing.squareImage = input.coverImage || existing.squareImage
      existing.detailImage = input.coverImage || existing.detailImage
      existing.description = input.description
      existing.remark = input.remark
      existing.difficulty = input.difficulty
      existing.estimatedMinutes = input.estimatedMinutes
      existing.servings = input.servings
      existing.tasteTags = input.tasteTags?.length ? input.tasteTags : existing.tasteTags
      existing.ingredients = input.ingredients.map((item, index) => ({
        id: existing.ingredients[index]?.id || makeId('ingredient'),
        groupType: item.groupType,
        name: item.name,
        amount: item.amount,
        sortOrder: index
      }))
      existing.steps = input.steps.map((item, index) => ({
        id: existing.steps[index]?.id || makeId('step'),
        stepNo: index + 1,
        title: item.title,
        description: item.description,
        image: item.image || existing.coverImage,
        heat: item.heat,
        minutes: item.minutes,
        tips: item.tips
      }))
      existing.tips = collectedTips(input.steps)
      this.persist()
      return existing.id
    },
    async deleteDish(id: string) {
      const existing = this.getDish(id)
      if (!existing || !this.canEditDish(existing)) throw new Error('当前用户无权删除这道菜')
      this.requireSession()

      const removedRecordIds = new Set(this.records.filter((record) => record.dishId === id).map((record) => record.id))

      if (this.token) {
        await this.runRemote(() => kitchenApi.deleteDish(this.token, id))
      }

      this.dishes = this.dishes.filter((dish) => dish.id !== id)
      this.menu.items = this.menu.items
        .filter((item) => item.dishId !== id)
        .map((item, index) => ({ ...item, sortOrder: index + 1 }))
      this.records = this.records.filter((record) => record.dishId !== id)
      this.ratings = this.ratings.filter((rating) => !removedRecordIds.has(rating.cookRecordId))

      if (this.token) await this.refreshStats()
      this.persist()
    }
  }
})
