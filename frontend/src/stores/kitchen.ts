import { defineStore } from 'pinia'
import { isDefaultUserAvatar, kitchenApi, normalizeUserAvatarUrl } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { seedDishes as prototypeSeedDishes } from '@/data/prototype-seed'
import type {
  CookRecord,
  CookStatus,
  Dish,
  DishCategory,
  DishSourceType,
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

const LEGACY_STORAGE_KEY = 'zhangshao-menu-state'
const AUTH_STORAGE_KEY = 'zhangshao-menu-auth'
const CACHE_STORAGE_KEY = 'zhangshao-menu-cache'
const PROTOTYPE_MENU_DISH_IDS = ['hongshaorou', 'tomato-egg', 'seaweed-egg-soup', 'shredded-potato']
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
  return [
    { text: dish.name, weight: 5 },
    { text: dish.description, weight: 2 },
    ...dish.tasteTags.map((text) => ({ text, weight: 2 })),
    ...dish.ingredients.map((item) => ({ text: item.name, weight: 4 })),
    ...dish.steps.flatMap((step) => [
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
  kitchenTimer: KitchenTimer
  finishKitchenTimer: () => void
}

let kitchenTimerTicker: ReturnType<typeof setInterval> | undefined

function ensureKitchenTimerTicker(store: KitchenTimerTickerStore) {
  if (kitchenTimerTicker) return

  kitchenTimerTicker = setInterval(() => {
    if (store.kitchenTimer.status !== 'running' || !store.kitchenTimer.endAt) return
    if (store.kitchenTimer.endAt > Date.now()) return
    store.finishKitchenTimer()
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
  kitchenTimer: KitchenTimer
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
  kitchenTimer?: KitchenTimer
}

type PersistedKitchenState = PersistedAuthState & PersistedKitchenCache

function defaultKitchenTimer(): KitchenTimer {
  return {
    status: 'idle',
    durationMs: 15 * 60 * 1000,
    remainingMs: 15 * 60 * 1000,
    alertPending: false,
    context: { type: 'manual' }
  }
}

function normalizeKitchenTimer(timer?: KitchenTimer | null): KitchenTimer {
  if (!timer || typeof timer !== 'object') return defaultKitchenTimer()

  const durationMs = Math.max(60 * 1000, Number(timer.durationMs) || defaultKitchenTimer().durationMs)
  const fallbackRemaining = Math.max(0, Math.min(durationMs, Number(timer.remainingMs) || durationMs))
  const endAt = typeof timer.endAt === 'number' ? timer.endAt : undefined

  if (timer.status === 'running' && endAt) {
    const remainingMs = Math.max(0, endAt - Date.now())
    if (remainingMs > 0) {
      return {
        status: 'running' as const,
        durationMs,
        remainingMs,
        endAt,
        lastFinishedAt: timer.lastFinishedAt,
        alertPending: Boolean(timer.alertPending),
        context: timer.context || { type: 'manual' }
      }
    }

    return {
      status: 'finished' as const,
      durationMs,
      remainingMs: 0,
      lastFinishedAt: Date.now(),
      alertPending: true,
      context: timer.context || { type: 'manual' }
    }
  }

  if (timer.status === 'paused') {
    return {
      status: 'paused',
      durationMs,
      remainingMs: fallbackRemaining,
      lastFinishedAt: timer.lastFinishedAt,
      alertPending: false,
      context: timer.context || { type: 'manual' }
    }
  }

  if (timer.status === 'finished') {
    return {
      status: 'finished',
      durationMs,
      remainingMs: 0,
      lastFinishedAt: timer.lastFinishedAt || Date.now(),
      alertPending: Boolean(timer.alertPending),
      context: timer.context || { type: 'manual' }
    }
  }

  return {
    status: 'idle',
    durationMs,
    remainingMs: durationMs,
    lastFinishedAt: timer.lastFinishedAt,
    alertPending: false,
    context: timer.context || { type: 'manual' }
  }
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

function sourceLabelOf(dish: Dish) {
  return sourceTypeOf(dish) === 'system_sync' ? '后台同步' : '用户录入'
}

function canUserEditDish(dish: Dish, user: UserProfile | null) {
  return sourceTypeOf(dish) === 'user_created' && Boolean(user?.id) && dish.ownerUserId === user?.id
}

function menuNeedsRepair(menu: TodayMenu, dishes: Dish[]) {
  if (!menu.items.length || !dishes.length) return false
  const ids = new Set(dishes.map((dish) => dish.id))
  return menu.items.some((item) => !ids.has(item.dishId))
}

function menuFromDishes(dishes: Dish[]) {
  const selected = dishes.slice(0, 4)
  return {
    ...defaultMenu(),
    items: selected.map((dish, index) => ({
      id: makeId('item'),
      dishId: dish.id,
      quantity: 1,
      note: '',
      sortOrder: index + 1,
      cookStatus: 'pending' as CookStatus,
      currentStep: 1
    }))
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
    items: [
      { id: makeId('item'), dishId: 'hongshaorou', quantity: 1, note: '少甜、少油', sortOrder: 1, cookStatus: 'pending', currentStep: 1 },
      { id: makeId('item'), dishId: 'tomato-egg', quantity: 1, note: '多番茄', sortOrder: 2, cookStatus: 'cooking', currentStep: 2, startedAt: nowText() },
      { id: makeId('item'), dishId: 'seaweed-egg-soup', quantity: 1, note: '清淡', sortOrder: 3, cookStatus: 'pending', currentStep: 1 },
      { id: makeId('item'), dishId: 'shredded-potato', quantity: 1, note: '少辣', sortOrder: 4, cookStatus: 'done', currentStep: 4, startedAt: nowText(), finishedAt: '10:20' }
    ]
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
    kitchenTimer: defaultKitchenTimer()
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
    estimatedMinutes(state): number {
      const menuIds = [...state.menu.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.dishId)
      const isPrototypeMenu =
        state.menu.servings === 3 &&
        menuIds.length === PROTOTYPE_MENU_DISH_IDS.length &&
        menuIds.every((id, index) => id === PROTOTYPE_MENU_DISH_IDS[index])
      if (isPrototypeMenu) return 75

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
    kitchenTimerRemaining(state) {
      if (state.kitchenTimer.status !== 'running' || !state.kitchenTimer.endAt) return state.kitchenTimer.remainingMs
      return Math.max(0, state.kitchenTimer.endAt - Date.now())
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
        kitchenTimer: this.kitchenTimer
      }
    },
    buildCompactCachePayload(): PersistedKitchenCache {
      return {
        stats: this.stats,
        dishes: this.token ? [] : prototypeSeedDishes,
        menu: this.menu,
        records: this.token ? [] : defaultRecords(),
        ratings: this.token ? [] : defaultRatings(),
        kitchenTimer: this.kitchenTimer
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
      this.kitchenTimer = next.kitchenTimer
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
        this.menu = cacheSource.menu || defaultMenu()
        this.records = Array.isArray(cacheSource.records) ? cacheSource.records : (this.token ? [] : defaultRecords())
        this.ratings = Array.isArray(cacheSource.ratings) ? cacheSource.ratings : (this.token ? [] : defaultRatings())
        this.kitchenTimer = normalizeKitchenTimer(cacheSource.kitchenTimer)
      }
      this.hydrated = true
      this.syncKitchenTimer()
      ensureKitchenTimerTicker(this)

      if (legacyCache) {
        removePersistedObject(LEGACY_STORAGE_KEY)
        this.persist()
      }
    },
    persist() {
      this.persistAuth()
      this.persistCache()
      removePersistedObject(LEGACY_STORAGE_KEY)
    },
    syncKitchenTimer() {
      const next = normalizeKitchenTimer(this.kitchenTimer)
      const changed =
        next.status !== this.kitchenTimer.status ||
        next.durationMs !== this.kitchenTimer.durationMs ||
        next.remainingMs !== this.kitchenTimer.remainingMs ||
        next.endAt !== this.kitchenTimer.endAt ||
        next.lastFinishedAt !== this.kitchenTimer.lastFinishedAt

      if (!changed) return
      this.kitchenTimer = next
      this.persist()
    },
    setKitchenTimerDuration(minutes: number) {
      const durationMs = Math.max(60 * 1000, Math.round(Number(minutes) || 0) * 60 * 1000)
      if (this.kitchenTimer.status === 'running') {
        this.kitchenTimer = {
          status: 'running',
          durationMs,
          remainingMs: durationMs,
          endAt: Date.now() + durationMs,
          alertPending: false,
          context: this.kitchenTimer.context || { type: 'manual' }
        }
        this.persist()
        return
      }

      const status = this.kitchenTimer.status === 'paused' ? 'paused' : 'idle'
      this.kitchenTimer = {
        status,
        durationMs,
        remainingMs: status === 'paused' ? Math.min(this.kitchenTimer.remainingMs, durationMs) : durationMs,
        lastFinishedAt: this.kitchenTimer.lastFinishedAt,
        alertPending: false,
        context: this.kitchenTimer.context || { type: 'manual' }
      }
      this.persist()
    },
    startKitchenTimer(
      minutes?: number,
      context: KitchenTimer['context'] = { type: 'manual' }
    ) {
      const durationMs = Math.max(
        60 * 1000,
        typeof minutes === 'number' ? Math.round(minutes) * 60 * 1000 : this.kitchenTimer.durationMs || defaultKitchenTimer().durationMs
      )
      this.kitchenTimer = {
        status: 'running',
        durationMs,
        remainingMs: durationMs,
        endAt: Date.now() + durationMs,
        alertPending: false,
        context
      }
      ensureKitchenTimerTicker(this)
      this.persist()
    },
    startStepKitchenTimer(itemId: string, minutes: number) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      const dish = item ? this.getDish(item.dishId) : undefined
      const step = item && dish ? dish.steps[(item.currentStep || 1) - 1] : undefined

      this.startKitchenTimer(minutes, {
        type: 'step',
        itemId,
        dishId: dish?.id,
        dishName: dish?.name,
        stepNo: step?.stepNo || item?.currentStep,
        stepTitle: step?.title
      })
    },
    pauseKitchenTimer() {
      if (this.kitchenTimer.status !== 'running') return
      const remainingMs = this.kitchenTimer.endAt ? Math.max(0, this.kitchenTimer.endAt - Date.now()) : this.kitchenTimer.remainingMs
      this.kitchenTimer = {
        status: remainingMs > 0 ? 'paused' : 'finished',
        durationMs: this.kitchenTimer.durationMs,
        remainingMs,
        lastFinishedAt: remainingMs > 0 ? this.kitchenTimer.lastFinishedAt : Date.now(),
        alertPending: remainingMs <= 0,
        context: this.kitchenTimer.context || { type: 'manual' }
      }
      this.persist()
    },
    resumeKitchenTimer() {
      const remainingMs = Math.max(0, this.kitchenTimer.remainingMs)
      if (this.kitchenTimer.status !== 'paused' || !remainingMs) return
      this.kitchenTimer = {
        status: 'running',
        durationMs: this.kitchenTimer.durationMs,
        remainingMs,
        endAt: Date.now() + remainingMs,
        lastFinishedAt: this.kitchenTimer.lastFinishedAt,
        alertPending: false,
        context: this.kitchenTimer.context || { type: 'manual' }
      }
      ensureKitchenTimerTicker(this)
      this.persist()
    },
    resetKitchenTimer() {
      this.kitchenTimer = {
        status: 'idle',
        durationMs: this.kitchenTimer.durationMs,
        remainingMs: this.kitchenTimer.durationMs,
        alertPending: false,
        context: this.kitchenTimer.context || { type: 'manual' }
      }
      this.persist()
    },
    finishKitchenTimer() {
      this.kitchenTimer = {
        status: 'finished',
        durationMs: this.kitchenTimer.durationMs,
        remainingMs: 0,
        lastFinishedAt: Date.now(),
        alertPending: true,
        context: this.kitchenTimer.context || { type: 'manual' }
      }
      this.persist()
    },
    acknowledgeKitchenTimerAlert() {
      if (!this.kitchenTimer.alertPending) return
      this.kitchenTimer = {
        ...this.kitchenTimer,
        alertPending: false
      }
      this.persist()
    },
    async runRemote<T>(task: () => Promise<T>) {
      this.loading = true
      this.apiError = ''
      try {
        return await task()
      } catch (error) {
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
      if (menuNeedsRepair(this.menu, this.dishes)) this.menu = menuFromDishes(this.dishes)
      const repaired = repairRecordsForDishes(this.records, this.dishes)
      if (repaired.changed) this.records = repaired.records
      this.persist()
    },
    async refreshDishes() {
      if (!this.token) return
      const dishes = await this.runRemote(() => kitchenApi.listDishes(this.token))
      this.dishes = dishes
      if (menuNeedsRepair(this.menu, this.dishes)) this.menu = menuFromDishes(this.dishes)
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
      if (!this.token) return filePaths
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
      const max = dish?.steps.length || 1
      item.currentStep = Math.min(Math.max(1, stepNo), max)
      item.cookStatus = item.currentStep >= max ? item.cookStatus : 'cooking'
      if (!item.startedAt) item.startedAt = nowText()
      this.persist()
    },
    completeDish(itemId: string) {
      const item = this.menu.items.find((candidate) => candidate.id === itemId)
      if (!item) return
      const dish = this.getDish(item.dishId)
      item.currentStep = dish?.steps.length || item.currentStep
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
    async createDish(input: Pick<Dish, 'name' | 'category' | 'description' | 'remark' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
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
        description: input.description,
        remark: input.remark,
        difficulty: input.difficulty,
        estimatedMinutes: input.estimatedMinutes,
        servings: input.servings,
        rating: 0,
        ratingCount: 0,
        isFavorite: false,
        sourceType: 'user_created',
        sourceName: '用户录入',
        ownerUserId: this.user?.id
      }
      this.dishes.unshift(dish)
      this.persist()
      return dish.id
    },
    async updateDish(id: string, input: Pick<Dish, 'name' | 'category' | 'description' | 'remark' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
      const existing = this.getDish(id)
      if (!existing || !this.canEditDish(existing)) throw new Error('当前用户无权编辑这道菜')

      if (this.token) {
        const dish = await this.runRemote(() => kitchenApi.updateDish(this.token, id, input))
        const index = this.dishes.findIndex((item) => item.id === id)
        if (index >= 0) this.dishes.splice(index, 1, dish)
        this.persist()
        return dish.id
      }

      Object.assign(existing, input)
      this.persist()
      return existing.id
    },
    async deleteDish(id: string) {
      const existing = this.getDish(id)
      if (!existing || !this.canEditDish(existing)) throw new Error('当前用户无权删除这道菜')

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
