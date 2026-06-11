<template>
  <div v-if="token" class="shell">
    <aside class="rail">
      <div class="brand">
        <span class="brand-mark">掌</span>
        <div>
          <strong>掌勺后台</strong>
          <small>Kitchen Ops</small>
        </div>
      </div>
      <nav class="nav">
        <button v-for="item in navItems" :key="item.key" :class="{ active: activeView === item.key }" @click="activeView = item.key">
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>
      <button class="rail-action" @click="logout">退出</button>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">{{ currentLabel }}</p>
          <h1>{{ currentTitle }}</h1>
        </div>
        <div class="top-actions">
          <span v-if="error" class="error-text">{{ error }}</span>
          <button class="icon-button" :disabled="loading" title="刷新" @click="loadAll">↻</button>
        </div>
      </header>

      <section v-if="overview" class="metric-grid">
        <article>
          <span>用户</span>
          <strong>{{ overview.userCount }}</strong>
        </article>
        <article>
          <span>菜品</span>
          <strong>{{ overview.dishCount }}</strong>
        </article>
        <article>
          <span>后台同步</span>
          <strong>{{ overview.systemDishCount }}</strong>
        </article>
        <article>
          <span>用户录入</span>
          <strong>{{ overview.userDishCount }}</strong>
        </article>
      </section>

      <section v-if="activeView === 'dishes'" class="panel">
        <div class="panel-head">
          <div class="field search">
            <span>搜索</span>
            <input v-model="dishSearch" placeholder="菜名 / 来源 URL" />
          </div>
          <div class="segmented">
            <button v-for="item in sourceFilters" :key="item.key" :class="{ active: dishSource === item.key }" @click="dishSource = item.key">
              {{ item.label }}
            </button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>菜品</th>
                <th>分类</th>
                <th>来源</th>
                <th>难度</th>
                <th>耗时</th>
                <th>结构</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dish in pagedDishes" :key="dish.id">
                <td>
                  <div class="dish-cell">
                    <img v-if="assetUrl(dish.coverImage)" :src="assetUrl(dish.coverImage)" alt="" />
                    <span v-else class="thumb-fallback">{{ dish.name.slice(0, 1) }}</span>
                    <div>
                      <strong>{{ dish.name }}</strong>
                      <small>{{ dish.sourceUrl || dish.owner?.email || dish.owner?.nickname || '-' }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ categoryName(dish.category) }}</td>
                <td><span :class="['status', dish.sourceType]">{{ sourceName(dish.sourceType) }}</span></td>
                <td>{{ dish.difficulty }}</td>
                <td>{{ dish.estimatedMinutes }} 分钟</td>
                <td>{{ dish._count.ingredients }} 食材 / {{ dish._count.steps }} 步</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pager">
          <span>{{ filteredDishes.length }} 道菜 · 第 {{ dishPage }} / {{ dishPageCount }} 页</span>
          <div>
            <button :disabled="dishPage <= 1" @click="dishPage -= 1">‹</button>
            <button :disabled="dishPage >= dishPageCount" @click="dishPage += 1">›</button>
          </div>
        </div>
      </section>

      <section v-else-if="activeView === 'users'" class="panel">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>用户</th>
                <th>角色</th>
                <th>邮箱 / OpenID</th>
                <th>菜品</th>
                <th>记录</th>
                <th>注册时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <div class="user-cell">
                    <span>{{ user.nickname.slice(0, 1).toUpperCase() }}</span>
                    <strong>{{ user.nickname }}</strong>
                  </div>
                </td>
                <td><span :class="['status', user.role]">{{ user.role }}</span></td>
                <td>{{ user.email || user.wechatOpenId || '-' }}</td>
                <td>{{ user._count.dishes }}</td>
                <td>{{ user._count.cookRecords }}</td>
                <td>{{ formatDate(user.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else-if="activeView === 'categories'" class="category-grid">
        <article v-for="category in categories" :key="category.id" class="category-card">
          <div>
            <span>{{ category.code }}</span>
            <strong>{{ category.name }}</strong>
          </div>
          <b>{{ category._count.dishes }}</b>
        </article>
      </section>

      <section v-else class="panel overview-panel">
        <div class="source-board">
          <article>
            <span>同步来源</span>
            <strong>HowToCook</strong>
          </article>
          <article>
            <span>分类数</span>
            <strong>{{ overview?.categoryCount || 0 }}</strong>
          </article>
          <article>
            <span>做菜记录</span>
            <strong>{{ overview?.recordCount || 0 }}</strong>
          </article>
        </div>
      </section>
    </main>
  </div>

  <main v-else class="login-screen">
    <form class="login-panel" @submit.prevent="login">
      <span class="brand-mark">掌</span>
      <h1>掌勺后台</h1>
      <label>
        邮箱
        <input v-model="loginForm.email" type="email" autocomplete="email" />
      </label>
      <label>
        密码
        <input v-model="loginForm.password" type="password" autocomplete="current-password" />
      </label>
      <button class="submit" :disabled="loading">{{ loading ? '登录中' : '登录' }}</button>
      <p v-if="error" class="error-text">{{ error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'
const TOKEN_KEY = 'zhangshao-admin-token'

type Overview = {
  userCount: number
  dishCount: number
  systemDishCount: number
  userDishCount: number
  categoryCount: number
  recordCount: number
}

type UserRow = {
  id: string
  nickname: string
  email?: string
  wechatOpenId?: string
  role: string
  createdAt: string
  _count: { dishes: number; menus: number; cookRecords: number }
}

type DishRow = {
  id: string
  name: string
  category: string
  coverImage: string
  difficulty: string
  estimatedMinutes: number
  sourceType: 'system_sync' | 'user_created'
  sourceUrl?: string
  owner?: { id: string; nickname: string; email?: string }
  _count: { ingredients: number; steps: number; cookRecords: number }
}

type CategoryRow = {
  id: string
  code: string
  name: string
  sortOrder: number
  enabled: boolean
  _count: { dishes: number }
}

const navItems = [
  { key: 'overview', label: '总览', icon: '⌁' },
  { key: 'dishes', label: '菜品', icon: '□' },
  { key: 'users', label: '用户', icon: '○' },
  { key: 'categories', label: '分类', icon: '◇' }
] as const

const sourceFilters = [
  { key: 'all', label: '全部' },
  { key: 'system_sync', label: '后台同步' },
  { key: 'user_created', label: '用户录入' }
] as const

const categoryLabels: Record<string, string> = {
  aquatic: '水产',
  breakfast: '早餐',
  condiment: '调料',
  dessert: '甜品',
  drink: '饮品',
  meat: '荤菜',
  semi_finished: '半成品',
  soup: '汤类',
  staple: '主食',
  vegetable: '素菜',
  other: '其他'
}

const token = ref(localStorage.getItem(TOKEN_KEY) || '')
const activeView = ref<(typeof navItems)[number]['key']>('overview')
const loading = ref(false)
const error = ref('')
const overview = ref<Overview | null>(null)
const users = ref<UserRow[]>([])
const dishes = ref<DishRow[]>([])
const categories = ref<CategoryRow[]>([])
const dishSearch = ref('')
const dishSource = ref<(typeof sourceFilters)[number]['key']>('all')
const dishPage = ref(1)
const dishPageSize = 40
const loginForm = reactive({ email: '', password: '' })

const currentLabel = computed(() => (activeView.value === 'overview' ? 'Operations' : 'Maintenance'))
const currentTitle = computed(() => navItems.find((item) => item.key === activeView.value)?.label || '总览')
const filteredDishes = computed(() => {
  const q = dishSearch.value.trim().toLowerCase()
  return dishes.value.filter((dish) => {
    const matchSource = dishSource.value === 'all' || dish.sourceType === dishSource.value
    const haystack = [dish.name, dish.sourceUrl, dish.owner?.email, dish.owner?.nickname].filter(Boolean).join(' ').toLowerCase()
    return matchSource && (!q || haystack.includes(q))
  })
})
const dishPageCount = computed(() => Math.max(1, Math.ceil(filteredDishes.value.length / dishPageSize)))
const pagedDishes = computed(() => filteredDishes.value.slice((dishPage.value - 1) * dishPageSize, dishPage.value * dishPageSize))

watch([dishSearch, dishSource], () => {
  dishPage.value = 1
})

async function api<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
      ...(options.headers || {})
    }
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(body.message || response.statusText)
  }
  return response.json() as Promise<T>
}

async function login() {
  error.value = ''
  loading.value = true
  try {
    const result = await fetch(`${API_BASE}/auth/login/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    }).then((response) => {
      if (!response.ok) throw new Error('登录失败')
      return response.json() as Promise<{ token: string }>
    })
    token.value = result.token
    localStorage.setItem(TOKEN_KEY, result.token)
    await loadAll()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '登录失败'
  } finally {
    loading.value = false
  }
}

async function loadAll() {
  error.value = ''
  loading.value = true
  try {
    const [overviewData, userRows, dishRows, categoryRows] = await Promise.all([
      api<Overview>('/admin/overview'),
      api<UserRow[]>('/admin/users'),
      api<DishRow[]>('/admin/dishes'),
      api<CategoryRow[]>('/admin/categories')
    ])
    overview.value = overviewData
    users.value = userRows
    dishes.value = dishRows
    categories.value = categoryRows
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败'
    if (error.value === 'Unauthorized') logout()
  } finally {
    loading.value = false
  }
}

function logout() {
  token.value = ''
  localStorage.removeItem(TOKEN_KEY)
}

function sourceName(sourceType: string) {
  return sourceType === 'system_sync' ? '后台同步' : '用户录入'
}

function categoryName(category: string) {
  return categoryLabels[category] || category
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function assetUrl(value: string) {
  if (!value) return ''
  if (/^https?:\/\//.test(value)) return value
  if (value.startsWith('/uploads/') || value.startsWith('/static/')) return `${API_BASE}${value}`
  return ''
}

onMounted(() => {
  if (token.value) loadAll()
})
</script>
