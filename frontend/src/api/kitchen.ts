import type { Difficulty, Dish, DishCategory, DishSourceType, IngredientGroupType, UserProfile } from '@/data/types'

const DEFAULT_API_BASE = 'http://localhost:3001'
const PLACEHOLDER_IMAGE = '/static/assets/placeholders/png/dish_cover_placeholder.png.png'

export const apiBase = (import.meta.env.VITE_API_BASE || DEFAULT_API_BASE).replace(/\/$/, '')

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
  difficulty: Difficulty
  estimatedMinutes: number
  servings: number
  tasteTags: string | string[]
  isFavorite: boolean
  sourceType?: DishSourceType
  sourceName?: string | null
  sourceUrl?: string | null
  sourceLicense?: string | null
  ingredients?: BackendIngredient[]
  steps?: BackendStep[]
}

type AuthResponse = {
  token: string
  user: BackendUser
}

function request<T>(url: string, options: RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${apiBase}${url}`,
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

function normalizeUser(user: BackendUser): UserProfile {
  return {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl || '/static/assets/illustrations/png/chef_avatar_256.png',
    email: user.email || undefined,
    role: user.role || 'user'
  }
}

export function normalizeDish(row: BackendDish): Dish {
  const coverImage = row.coverImage || PLACEHOLDER_IMAGE
  const steps = (row.steps || []).map((step) => ({
    id: step.id,
    stepNo: step.stepNo,
    title: step.title,
    description: step.description,
    image: step.image || coverImage,
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
    difficulty: row.difficulty,
    estimatedMinutes: row.estimatedMinutes,
    servings: row.servings,
    tasteTags: parseTags(row.tasteTags),
    rating: 0,
    ratingCount: 0,
    isFavorite: row.isFavorite,
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
  async loginWithWechat(openId: string) {
    const response = await request<AuthResponse>('/auth/login/wechat', {
      method: 'POST',
      data: { openId }
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
  async createDish(token: string, input: Pick<Dish, 'name' | 'category' | 'description' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
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
  async updateDish(token: string, id: string, input: Pick<Dish, 'name' | 'category' | 'description' | 'difficulty' | 'estimatedMinutes' | 'servings'>) {
    const row = await request<BackendDish>(`/dishes/${id}`, {
      method: 'PUT',
      token,
      data: input
    })
    return normalizeDish(row)
  }
}
