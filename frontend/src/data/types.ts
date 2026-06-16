export type DishCategory = 'meat' | 'vegetable' | 'soup' | 'staple' | 'aquatic' | 'breakfast' | 'dessert' | 'drink' | 'condiment' | 'semi_finished' | 'other'
export type DishSourceType = 'system_sync' | 'user_created'
export type Difficulty = '简单' | '中等' | '较难'
export type IngredientGroupType = 'main' | 'side' | 'seasoning'
export type CookStatus = 'pending' | 'cooking' | 'done'
export type TasteFeedback = '刚好' | '偏淡' | '偏咸' | '偏甜'
export type KitchenTimerStatus = 'idle' | 'running' | 'paused' | 'finished'
export type KitchenTimerContextType = 'manual' | 'step'

export interface UserProfile {
  id: string
  nickname: string
  avatarUrl?: string
  email?: string
  wechatOpenId?: string
  role?: 'user' | 'admin'
}

export interface MeStats {
  dishCount: number
  visibleDishCount: number
  learnedDishCount: number
  recordCount: number
  averageRating: number
}

export interface Ingredient {
  id: string
  groupType: IngredientGroupType
  name: string
  amount: string
  sortOrder: number
}

export interface DishStep {
  id: string
  stepNo: number
  title: string
  description: string
  image: string
  heat: string
  minutes: number
  timeLabel?: string
  tips: string
}

export interface EditableIngredientInput {
  groupType: IngredientGroupType
  name: string
  amount: string
}

export interface EditableDishStepInput {
  title: string
  description: string
  image: string
  heat: string
  minutes: number
  tips: string
}

export interface EditableDishInput {
  name: string
  category: DishCategory
  coverImage: string
  description: string
  remark?: string
  difficulty: Difficulty
  estimatedMinutes: number
  servings: number
  tasteTags?: string[]
  ingredients: EditableIngredientInput[]
  steps: EditableDishStepInput[]
}

export interface Dish {
  id: string
  name: string
  emoji: string
  category: DishCategory
  coverImage: string
  squareImage: string
  detailImage: string
  description: string
  remark?: string
  difficulty: Difficulty
  estimatedMinutes: number
  servings: number
  tasteTags: string[]
  rating: number
  ratingCount: number
  isFavorite: boolean
  learnedAt?: string
  sourceType?: DishSourceType
  sourceName?: string
  sourceUrl?: string
  sourceLicense?: string
  ownerUserId?: string
  ingredients: Ingredient[]
  steps: DishStep[]
  tips: string[]
  createdAt?: string
}

export interface MenuItem {
  id: string
  dishId: string
  quantity: number
  note: string
  sortOrder: number
  cookStatus: CookStatus
  currentStep: number
  startedAt?: string
  finishedAt?: string
}

export interface TodayMenu {
  id: string
  menuDate: string
  servings: number
  status: 'draft' | 'submitted'
  items: MenuItem[]
}

export interface CookRecord {
  id: string
  dishId: string
  menuItemId?: string
  startedAt: string
  finishedAt: string
  actualMinutes: number
  photos: string[]
  tasteFeedback: TasteFeedback
  note: string
  includeInHistory: boolean
}

export interface Rating {
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

export interface LearnedDishEntry {
  id: string
  learnedAt: string
  dish: Dish
}

export interface FavoriteDishEntry {
  id: string
  favoritedAt: string
  dish: Dish
}

export interface KitchenTimer {
  id: string
  scopeKey: string
  status: KitchenTimerStatus
  durationMs: number
  remainingMs: number
  endAt?: number
  lastFinishedAt?: number
  alertPending?: boolean
  createdAt: number
  updatedAt: number
  context: {
    type: KitchenTimerContextType
    itemId?: string
    dishId?: string
    dishName?: string
    stepNo?: number
    stepTitle?: string
  }
}
