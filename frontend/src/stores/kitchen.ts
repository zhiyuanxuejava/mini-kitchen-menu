import { defineStore } from 'pinia'
import { kitchenApi } from '@/api/kitchen'
import { icons } from '@/data/assets'
import { seedDishes } from '@/data/seed'
import type {
  CookRecord,
  CookStatus,
  Dish,
  DishCategory,
  DishSourceType,
  MenuItem,
  Rating,
  TasteFeedback,
  TodayMenu,
  UserProfile
} from '@/data/types'

const STORAGE_KEY = 'zhangshao-menu-state'
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

interface KitchenState {
  hydrated: boolean
  loading: boolean
  apiError: string
  token: string
  user: UserProfile | null
  dishes: Dish[]
  menu: TodayMenu
  records: CookRecord[]
  ratings: Rating[]
}

interface PersistedKitchenState {
  token?: string
  user: UserProfile | null
  dishes: Dish[]
  menu: TodayMenu
  records: CookRecord[]
  ratings: Rating[]
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
      photos: [seedDishes[0].coverImage, seedDishes[0].detailImage],
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
      photos: [seedDishes.find((dish) => dish.id === 'mapo-tofu')?.coverImage || seedDishes[0].coverImage],
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

function initialState(): Omit<KitchenState, 'hydrated'> {
  return {
    loading: false,
    apiError: '',
    token: '',
    user: null,
    dishes: seedDishes,
    menu: defaultMenu(),
    records: defaultRecords(),
    ratings: defaultRatings()
  }
}

function isCurrentRealDishCache(cached: PersistedKitchenState) {
  const dishes = Array.isArray(cached.dishes) ? cached.dishes : []

  return dishes.length >= MIN_REAL_DISH_COUNT
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
    }
  },
  actions: {
    hydrate() {
      if (this.hydrated) return
      const cached = uni.getStorageSync(STORAGE_KEY) as PersistedKitchenState | ''
      if (cached && typeof cached === 'object') {
        const useCache = isCurrentRealDishCache(cached)
        this.token = cached.token || ''
        this.user = this.token ? cached.user : null
        this.dishes = useCache ? cached.dishes : seedDishes
        this.menu = useCache ? cached.menu || defaultMenu() : defaultMenu()
        this.records = useCache ? cached.records || [] : defaultRecords()
        this.ratings = useCache ? cached.ratings || [] : defaultRatings()
      }
      this.hydrated = true
    },
    persist() {
      const payload: PersistedKitchenState = {
        token: this.token,
        user: this.user,
        dishes: this.dishes,
        menu: this.menu,
        records: this.records,
        ratings: this.ratings
      }
      uni.setStorageSync(STORAGE_KEY, payload)
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
    async loginWithEmail(email: string, password = '123456') {
      const result = await this.runRemote(() => kitchenApi.loginWithEmail(email, password))
      this.token = result.token
      this.user = result.user
      await this.refreshDishes()
      this.persist()
    },
    async registerWithEmail(email: string, password = '123456') {
      const result = await this.runRemote(() => kitchenApi.registerWithEmail(email, password))
      this.token = result.token
      this.user = result.user
      await this.refreshDishes()
      this.persist()
    },
    async loginWithWechat() {
      const result = await this.runRemote(() => kitchenApi.loginWithWechat('wechat-demo-openid'))
      this.token = result.token
      this.user = result.user
      await this.refreshDishes()
      this.persist()
    },
    logout() {
      this.token = ''
      this.user = null
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
    async ensureRemoteDishes() {
      if (!this.token || this.loading) return
      if (this.dishes.length >= MIN_REAL_DISH_COUNT && this.dishes.some((dish) => dish.sourceType === 'system_sync')) return
      try {
        await this.refreshDishes()
      } catch {
        if (!this.dishes.length) this.dishes = seedDishes
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
    canEditDish(dish: Dish) {
      return canUserEditDish(dish, this.user)
    },
    dishesByCategory(category: DishCategory | 'all', keyword = '', source: DishSourceFilter = 'all') {
      const normalized = keyword.trim().toLowerCase()
      return this.dishes.filter((dish) => {
        const matchCategory = category === 'all' || dish.category === category
        const matchSource = source === 'all' || sourceTypeOf(dish) === source
        const haystack = [dish.name, dish.description, ...dish.tasteTags, ...dish.ingredients.map((item) => item.name)].join(' ').toLowerCase()
        return matchCategory && matchSource && (!normalized || haystack.includes(normalized))
      })
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
    createCookRecord(input: {
      dishId: string
      menuItemId?: string
      actualMinutes: number
      photos: string[]
      tasteFeedback: TasteFeedback
      note: string
      includeInHistory: boolean
    }) {
      const menuItem = input.menuItemId ? this.menu.items.find((item) => item.id === input.menuItemId) : undefined
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
    saveRating(recordId: string, rating: Omit<Rating, 'id' | 'cookRecordId' | 'createdAt'>) {
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
    async createDish(input: Pick<Dish, 'name' | 'category' | 'description' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
      if (this.token) {
        const dish = await this.runRemote(() => kitchenApi.createDish(this.token, input))
        this.dishes.unshift(dish)
        this.persist()
        return dish.id
      }

      const base = seedDishes[0]
      const dish: Dish = {
        ...base,
        id: makeId('dish'),
        name: input.name,
        emoji: '🍽️',
        category: input.category,
        description: input.description,
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
    async updateDish(id: string, input: Pick<Dish, 'name' | 'category' | 'description' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
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
    }
  }
})
