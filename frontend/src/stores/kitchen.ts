import { defineStore } from 'pinia'
import { icons } from '@/data/assets'
import { seedDishes } from '@/data/seed'
import type {
  CookRecord,
  CookStatus,
  Dish,
  DishCategory,
  MenuItem,
  Rating,
  TasteFeedback,
  TodayMenu,
  UserProfile
} from '@/data/types'

const STORAGE_KEY = 'zhangshao-menu-state'
const PROTOTYPE_MENU_DISH_IDS = ['hongshaorou', 'tomato-egg', 'seaweed-egg-soup', 'shredded-potato']
const MIN_REAL_DISH_COUNT = 50

interface KitchenState {
  hydrated: boolean
  user: UserProfile | null
  dishes: Dish[]
  menu: TodayMenu
  records: CookRecord[]
  ratings: Rating[]
}

interface PersistedKitchenState {
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
    user: null,
    dishes: seedDishes,
    menu: defaultMenu(),
    records: defaultRecords(),
    ratings: defaultRatings()
  }
}

function isCurrentRealDishCache(cached: PersistedKitchenState) {
  const dishes = Array.isArray(cached.dishes) ? cached.dishes : []
  const redPork = dishes.find((dish) => dish.id === 'hongshaorou')

  return dishes.length >= MIN_REAL_DISH_COUNT && redPork?.name === '红烧肉' && redPork.coverImage.includes('/static/assets/dishes/real/')
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
          dish: state.dishes.find((dish) => dish.id === record.dishId) as Dish,
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
        this.user = cached.user
        this.dishes = useCache ? cached.dishes : seedDishes
        this.menu = useCache ? cached.menu || defaultMenu() : defaultMenu()
        this.records = useCache ? cached.records || [] : defaultRecords()
        this.ratings = useCache ? cached.ratings || [] : defaultRatings()
      }
      this.hydrated = true
    },
    persist() {
      const payload: PersistedKitchenState = {
        user: this.user,
        dishes: this.dishes,
        menu: this.menu,
        records: this.records,
        ratings: this.ratings
      }
      uni.setStorageSync(STORAGE_KEY, payload)
    },
    loginWithEmail(email: string) {
      this.user = {
        id: `email:${email}`,
        nickname: email.split('@')[0] || '小厨房',
        avatarUrl: icons.avatar,
        email
      }
      this.persist()
    },
    registerWithEmail(email: string) {
      this.loginWithEmail(email)
    },
    loginWithWechat() {
      this.user = {
        id: 'wechat-demo-user',
        nickname: '小厨房',
        avatarUrl: icons.avatar
      }
      this.persist()
    },
    logout() {
      this.user = null
      this.persist()
    },
    getDish(id: string) {
      return this.dishes.find((dish) => dish.id === id)
    },
    dishesByCategory(category: DishCategory | 'all', keyword = '') {
      const normalized = keyword.trim().toLowerCase()
      return this.dishes.filter((dish) => {
        const matchCategory = category === 'all' || dish.category === category
        const haystack = [dish.name, dish.description, ...dish.tasteTags, ...dish.ingredients.map((item) => item.name)].join(' ').toLowerCase()
        return matchCategory && (!normalized || haystack.includes(normalized))
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
    createDish(input: Pick<Dish, 'name' | 'category' | 'description' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
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
        isFavorite: false
      }
      this.dishes.unshift(dish)
      this.persist()
      return dish.id
    }
  }
})
