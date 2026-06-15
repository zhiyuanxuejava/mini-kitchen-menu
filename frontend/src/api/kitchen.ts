import type {
  CookRecord,
  Difficulty,
  Dish,
  DishCategory,
  DishSourceType,
  IngredientGroupType,
  LearnedDishEntry,
  MeStats,
  Rating,
  TasteFeedback,
  TodayMenu,
  UserProfile
} from '@/data/types'

const DEFAULT_API_PORT = '3001'
const PLACEHOLDER_IMAGE = '/static/assets/placeholders/png/dish_cover_placeholder.png.png'
const DEFAULT_AVATAR = '/static/assets/illustrations/png/chef_avatar_256.png'

function normalizeConfiguredApiBase(value: string) {
  const next = value.trim()
  if (!next) return ''

  if (next.startsWith('/')) {
    if (typeof window === 'undefined') return ''
    return next.replace(/\/$/, '')
  }

  try {
    const url = new URL(next)
    if (import.meta.env.DEV) return url.toString().replace(/\/$/, '')
    return url.protocol === 'https:' ? url.toString().replace(/\/$/, '') : ''
  } catch {
    return ''
  }
}

function resolveApiBase() {
  const configured = import.meta.env.VITE_API_BASE
  if (configured) return normalizeConfiguredApiBase(configured)

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host && !['localhost', '127.0.0.1', '::1'].includes(host)) {
      return `http://${host}:${DEFAULT_API_PORT}`
    }
  }

  if (!import.meta.env.DEV) return ''
  return `http://localhost:${DEFAULT_API_PORT}`
}

export const apiBase = resolveApiBase()

function requireApiBase() {
  if (apiBase) return apiBase
  throw new Error('未配置正式 API 地址，请设置 VITE_API_BASE 为 HTTPS 域名或同域 /api')
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  token?: string
  data?: UniApp.RequestOptions['data']
}

type BackendUser = {
  id: string
  nickname: string
  avatarUrl?: string | null
  email?: string | null
  wechatOpenId?: string | null
  role?: 'user' | 'admin'
}

type BackendIngredient = {
  id: string
  groupType: IngredientGroupType
  name: string
  amount: string
  sortOrder: number
}

type BackendStep = {
  id: string
  stepNo: number
  title: string
  description: string
  image?: string | null
  heat: string
  minutes: number
  tips: string
}

type BackendDish = {
  id: string
  ownerUserId?: string | null
  name: string
  category: DishCategory
  coverImage: string
  description: string
  remark?: string | null
  difficulty: Difficulty
  estimatedMinutes: number
  servings: number
  tasteTags: string | string[]
  isFavorite: boolean
  sourceType?: DishSourceType
  sourceName?: string | null
  sourceUrl?: string | null
  sourceLicense?: string | null
  learnedAt?: string | null
  ingredients?: BackendIngredient[]
  steps?: BackendStep[]
}

type AuthResponse = {
  token: string
  user: BackendUser
}

type BackendMenuItem = {
  id: string
  dishId: string
  quantity: number
  note: string
  sortOrder: number
  cookStatus: 'pending' | 'cooking' | 'done'
  currentStep: number
  startedAt?: string | null
  finishedAt?: string | null
}

type BackendTodayMenu = {
  id: string
  menuDate: string
  servings: number
  status: 'draft' | 'submitted'
  items: BackendMenuItem[]
}

type BackendCookRecord = {
  id: string
  dishId: string
  menuItemId?: string | null
  startedAt: string
  finishedAt: string
  actualMinutes: number
  photos: string | string[]
  tasteFeedback: TasteFeedback
  note: string
  includeInHistory: boolean
  rating?: BackendRating | null
}

type BackendRating = {
  id: string
  cookRecordId: string
  tasteScore: number
  appearanceScore: number
  similarityScore: number
  heatScore: number
  satisfactionScore: number
  overallScore: number
  comment: string
  createdAt: string
}

type BackendStats = {
  dishCount: number
  visibleDishCount: number
  learnedDishCount: number
  recordCount: number
  averageRating: number
}

type BackendLearnedDishEntry = {
  id: string
  learnedAt: string
  dish: BackendDish
}

function request<T>(url: string, options: RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    const base = requireApiBase()
    uni.request({
      url: `${base}${url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'content-type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      success: (response) => {
        const status = response.statusCode || 0
        if (status >= 200 && status < 300) {
          resolve(response.data as T)
          return
        }
        const body = response.data as { message?: string } | string
        reject(new Error(typeof body === 'object' && body?.message ? body.message : `请求失败 ${status}`))
      },
      fail: (error) => reject(new Error(error.errMsg || '网络请求失败'))
    })
  })
}

function parseTags(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return value.split(',').map((item) => item.trim()).filter(Boolean)
  }
}

function emojiFor(category: DishCategory, name: string) {
  if (category === 'aquatic' || /虾|鱼|蟹|鳝|蚝/.test(name)) return '🦐'
  if (/蛋/.test(name)) return '🍳'
  if (/鸡/.test(name)) return '🍗'
  if (/牛|羊|排骨|肉/.test(name)) return '🥩'
  if (category === 'soup') return '🍲'
  if (category === 'staple' || category === 'breakfast') return '🍚'
  if (category === 'dessert') return '🍮'
  if (category === 'drink') return '🥤'
  if (category === 'vegetable') return '🥬'
  return '🍽️'
}

function isAbsoluteMediaUrl(value: string) {
  return /^https?:\/\//.test(value) || value.startsWith('data:')
}

function normalizeMediaUrl(value?: string | null, fallback?: string) {
  const next = value?.trim()
  if (!next) return fallback || ''
  if (isAbsoluteMediaUrl(next)) return next
  if ((next.startsWith('/static/') || next.startsWith('/uploads/')) && apiBase) return `${apiBase}${next}`
  return next
}

export function normalizeUserAvatarUrl(value?: string | null) {
  const source = value?.trim() || DEFAULT_AVATAR
  return normalizeMediaUrl(source, DEFAULT_AVATAR)
}

export function isDefaultUserAvatar(value?: string | null) {
  return normalizeUserAvatarUrl(value) === normalizeUserAvatarUrl(DEFAULT_AVATAR)
}

export function isTemporaryFilePath(value?: string | null) {
  const next = value?.trim()
  if (!next) return false
  return !next.startsWith('/static/') && !next.startsWith('/uploads/') && !isAbsoluteMediaUrl(next)
}

function serializeUserAvatarUrl(value?: string | null) {
  const next = value?.trim()
  if (!next) return undefined
  if (!apiBase) return next
  const uploadBase = `${apiBase}/uploads/`
  const staticBase = `${apiBase}/static/`
  if (next.startsWith(uploadBase)) return next.slice(apiBase.length)
  if (next.startsWith(staticBase)) return next.slice(apiBase.length)
  return next
}

function normalizeUser(user: BackendUser): UserProfile {
  return {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: normalizeUserAvatarUrl(user.avatarUrl),
    email: user.email || undefined,
    wechatOpenId: user.wechatOpenId || undefined,
    role: user.role || 'user'
  }
}

function parsePhotos(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : []
  } catch {
    return []
  }
}

function normalizeRecord(row: BackendCookRecord): CookRecord {
  return {
    id: row.id,
    dishId: row.dishId,
    menuItemId: row.menuItemId || undefined,
    startedAt: row.startedAt,
    finishedAt: row.finishedAt,
    actualMinutes: row.actualMinutes,
    photos: parsePhotos(row.photos).map((photo) => normalizeMediaUrl(photo)).filter(Boolean),
    tasteFeedback: row.tasteFeedback,
    note: row.note,
    includeInHistory: row.includeInHistory
  }
}

function normalizeRating(row: BackendRating): Rating {
  return {
    id: row.id,
    cookRecordId: row.cookRecordId,
    tasteScore: row.tasteScore,
    appearanceScore: row.appearanceScore,
    similarityScore: row.similarityScore,
    heatScore: row.heatScore,
    satisfactionScore: row.satisfactionScore,
    overallScore: row.overallScore,
    comment: row.comment,
    createdAt: row.createdAt
  }
}

function normalizeMenu(row: BackendTodayMenu): TodayMenu {
  return {
    id: row.id,
    menuDate: row.menuDate,
    servings: row.servings,
    status: row.status,
    items: (row.items || []).map((item) => ({
      id: item.id,
      dishId: item.dishId,
      quantity: item.quantity,
      note: item.note,
      sortOrder: item.sortOrder,
      cookStatus: item.cookStatus,
      currentStep: item.currentStep,
      startedAt: item.startedAt || undefined,
      finishedAt: item.finishedAt || undefined
    }))
  }
}

export function normalizeDish(row: BackendDish): Dish {
  const coverImage = normalizeMediaUrl(row.coverImage, PLACEHOLDER_IMAGE)
  const steps = (row.steps || []).map((step) => ({
    id: step.id,
    stepNo: step.stepNo,
    title: step.title,
    description: step.description,
    image: normalizeMediaUrl(step.image, coverImage),
    heat: step.heat,
    minutes: step.minutes,
    tips: step.tips
  }))
  const tips = Array.from(new Set(steps.map((step) => step.tips).filter(Boolean))).slice(0, 4)

  return {
    id: row.id,
    name: row.name,
    emoji: emojiFor(row.category, row.name),
    category: row.category,
    coverImage,
    squareImage: coverImage,
    detailImage: coverImage,
    description: row.description,
    remark: row.remark || undefined,
    difficulty: row.difficulty,
    estimatedMinutes: row.estimatedMinutes,
    servings: row.servings,
    tasteTags: parseTags(row.tasteTags),
    rating: 0,
    ratingCount: 0,
    isFavorite: row.isFavorite,
    learnedAt: row.learnedAt || undefined,
    sourceType: row.sourceType || 'user_created',
    sourceName: row.sourceName || undefined,
    sourceUrl: row.sourceUrl || undefined,
    sourceLicense: row.sourceLicense || undefined,
    ownerUserId: row.ownerUserId || undefined,
    ingredients: (row.ingredients || []).map((item) => ({
      id: item.id,
      groupType: item.groupType,
      name: item.name,
      amount: item.amount,
      sortOrder: item.sortOrder
    })),
    steps,
    tips: tips.length ? tips : ['出锅前尝味，根据口味微调盐分。']
  }
}

export const kitchenApi = {
  async loginWithEmail(email: string, password: string) {
    const response = await request<AuthResponse>('/auth/login/email', {
      method: 'POST',
      data: { email, password }
    })
    return { token: response.token, user: normalizeUser(response.user) }
  },
  async registerWithEmail(email: string, password: string) {
    const response = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      data: { email, password }
    })
    return { token: response.token, user: normalizeUser(response.user) }
  },
  async loginWithWechat(code: string) {
    const response = await request<AuthResponse>('/auth/login/wechat', {
      method: 'POST',
      data: { code }
    })
    return { token: response.token, user: normalizeUser(response.user) }
  },
  async bindEmail(token: string, email: string, password: string) {
    const response = await request<AuthResponse>('/me/bind-email', {
      method: 'POST',
      token,
      data: { email, password }
    })
    return { token: response.token, user: normalizeUser(response.user) }
  },
  async listDishes(token: string) {
    const rows = await request<BackendDish[]>('/dishes', { token })
    return rows.map(normalizeDish)
  },
  async getDish(token: string, id: string) {
    const row = await request<BackendDish>(`/dishes/${id}`, { token })
    return normalizeDish(row)
  },
  async createDish(token: string, input: Pick<Dish, 'name' | 'category' | 'description' | 'remark' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
    const row = await request<BackendDish>('/dishes', {
      method: 'POST',
      token,
      data: {
        ...input,
        coverImage: PLACEHOLDER_IMAGE,
        tasteTags: ['用户录入'],
        ingredients: [{ groupType: 'main', name: '待补充食材', amount: '适量' }],
        steps: [{ title: '补充做法', description: '这道菜由用户录入，详细食材和步骤可在后续完整表单中补充。', heat: '无', minutes: input.estimatedMinutes, tips: '先保存核心信息，之后完善做法。' }]
      }
    })
    return normalizeDish(row)
  },
  async updateDish(token: string, id: string, input: Pick<Dish, 'name' | 'category' | 'description' | 'remark' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
    const row = await request<BackendDish>(`/dishes/${id}`, {
      method: 'PUT',
      token,
      data: input
    })
    return normalizeDish(row)
  },
  async deleteDish(token: string, id: string) {
    return request<{ ok: true }>(`/dishes/${id}`, {
      method: 'DELETE',
      token
    })
  },
  async getTodayMenu(token: string) {
    const row = await request<BackendTodayMenu>('/menus/today', { token })
    return normalizeMenu(row)
  },
  async getMyStats(token: string) {
    return request<MeStats>('/me/stats', { token })
  },
  async listLearnedDishes(token: string) {
    const rows = await request<BackendLearnedDishEntry[]>('/me/learned-dishes', { token })
    return rows.map((row): LearnedDishEntry => ({
      id: row.id,
      learnedAt: row.learnedAt,
      dish: normalizeDish(row.dish)
    }))
  },
  async updateLearnedDish(token: string, dishId: string, learned: boolean, learnedAt?: string) {
    return request<{ learnedAt: string | null }>(`/dishes/${dishId}/learn`, {
      method: 'POST',
      token,
      data: {
        learned,
        ...(learnedAt ? { learnedAt } : {})
      }
    })
  },
  async listRecords(token: string) {
    const rows = await request<BackendCookRecord[]>('/records', { token })
    return rows.map(normalizeRecord)
  },
  async listRatings(token: string) {
    const rows = await request<BackendRating[]>('/ratings/me', { token })
    return rows.map(normalizeRating)
  },
  async updateProfile(token: string, input: Pick<UserProfile, 'nickname' | 'avatarUrl'>) {
    const avatarUrl = serializeUserAvatarUrl(input.avatarUrl)
    const row = await request<BackendUser>('/me/profile', {
      method: 'PUT',
      token,
      data: {
        nickname: input.nickname,
        ...(avatarUrl ? { avatarUrl } : {})
      }
    })
    return normalizeUser(row)
  },
  async uploadFiles(token: string, filePaths: string[]) {
    const base = requireApiBase()
    return new Promise<string[]>((resolve, reject) => {
      const uploaded: string[] = []
      const files = filePaths.slice()

      const next = () => {
        const filePath = files.shift()
        if (!filePath) {
          resolve(uploaded)
          return
        }
        uni.uploadFile({
          url: `${base}/uploads`,
          filePath,
          name: 'files',
          header: { Authorization: `Bearer ${token}` },
          success: (response) => {
            try {
              const data = JSON.parse(response.data) as { files?: Array<{ url: string }> }
              const url = data.files?.[0]?.url
              if (!url) {
                reject(new Error('上传成功但未返回文件地址'))
                return
              }
              uploaded.push(url)
              next()
            } catch (error) {
              reject(error instanceof Error ? error : new Error('上传响应解析失败'))
            }
          },
          fail: (error) => reject(new Error(error.errMsg || '上传失败'))
        })
      }

      next()
    })
  },
  async createRecord(
    token: string,
    input: Pick<CookRecord, 'dishId' | 'menuItemId' | 'actualMinutes' | 'photos' | 'tasteFeedback' | 'note' | 'includeInHistory'>
  ) {
    const row = await request<BackendCookRecord>('/records', {
      method: 'POST',
      token,
      data: input
    })
    return normalizeRecord(row)
  },
  async saveRating(
    token: string,
    recordId: string,
    input: Omit<Rating, 'id' | 'cookRecordId' | 'createdAt' | 'overallScore'> & { overallScore?: number }
  ) {
    const row = await request<BackendRating>(`/records/${recordId}/rating`, {
      method: 'POST',
      token,
      data: input
    })
    return normalizeRating(row)
  }
}
