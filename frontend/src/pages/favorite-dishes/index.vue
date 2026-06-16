<template>
  <AppPage no-tab>
    <AppNavbar title="我的收藏" subtitle="集中查看你收藏过的菜谱" back />

    <view class="hero card">
      <view class="hero-copy">
        <text class="hero-title">收藏菜谱夹</text>
        <text class="hero-sub">喜欢的菜先收起来，后面做菜、加菜单和复做都会更快找到。</text>
      </view>
      <view class="hero-stat">
        <text class="hero-stat-label">当前收藏</text>
        <text class="hero-stat-value">{{ favoriteCount }} 道</text>
      </view>
    </view>

    <view class="search-wrap">
      <view class="search-box">
        <image :src="icons.search" class="icon-36" mode="aspectFit" />
        <input v-model="keyword" placeholder="搜索收藏的菜名 / 描述 / 食材" />
        <button v-if="keyword" class="clear-search" hover-class="tap" @tap="keyword = ''">×</button>
      </view>
    </view>

    <view class="toolbar card">
      <picker :range="categoryNames" :value="activeCategoryIndex" @change="onCategoryChange">
        <view :class="['filter-control', { active: activeCategory !== 'all' }]">
          <text>{{ activeCategoryLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>

      <picker :range="difficultyNames" :value="activeDifficultyIndex" @change="onDifficultyChange">
        <view :class="['filter-control', { active: activeDifficulty !== 'all' }]">
          <text>{{ activeDifficultyLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>
    </view>

    <view v-if="filteredEntries.length" class="favorite-list">
      <view v-for="entry in filteredEntries" :key="entry.id + entry.dish.id" class="favorite-card card">
        <image class="favorite-cover" :src="entry.dish.coverImage" mode="aspectFill" @tap="viewDish(entry.dish.id)" />
        <view class="favorite-copy" @tap="viewDish(entry.dish.id)">
          <view class="favorite-head">
            <text class="favorite-name line-clamp-1">{{ entry.dish.name }} {{ entry.dish.emoji }}</text>
            <text class="favorite-badge">已收藏</text>
          </view>
          <text class="favorite-desc line-clamp-2">{{ entry.dish.description || '暂无描述' }}</text>
          <text class="favorite-time">收藏时间：{{ favoriteTimeLabel(entry.favoritedAt) }}</text>
          <view class="favorite-meta">
            <text>{{ entry.dish.difficulty }}</text>
            <text>{{ entry.dish.estimatedMinutes }} 分钟</text>
            <text>{{ entry.dish.learnedAt ? '我已学会' : '待尝试' }}</text>
          </view>
        </view>
        <view class="favorite-actions">
          <button class="ghost-btn action-btn" hover-class="tap" @tap="store.addToMenu(entry.dish.id)">加入点菜单</button>
          <button class="ghost-btn action-btn delete-btn" hover-class="tap" @tap="toggleFavorite(entry.dish.id)">取消收藏</button>
        </view>
      </view>
    </view>

    <EmptyState
      v-else
      title="还没有收藏菜品"
      desc="在菜品库、首页推荐或菜品详情里点一下收藏，就会集中展示到这里。"
    />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import EmptyState from '@/components/EmptyState.vue'
import { icons } from '@/data/assets'
import { categoryLabels } from '@/data/labels'
import type { Difficulty, DishCategory } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

type DifficultyFilter = Difficulty | 'all'

const store = useKitchenStore()
const keyword = ref('')
const activeCategory = ref<DishCategory | 'all'>('all')
const activeDifficulty = ref<DifficultyFilter>('all')

const categories = (Object.keys(categoryLabels) as Array<DishCategory | 'all'>).map((key) => ({
  key,
  label: categoryLabels[key]
}))
const categoryNames = categories.map((item) => item.label)
const difficulties: DifficultyFilter[] = ['all', '简单', '中等', '较难']
const difficultyNames = ['全部难度', '简单', '中等', '较难']

onShow(async () => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  await store.fetchFavoriteDishEntries()
})

const entries = computed(() => store.favoriteDishEntries())
const favoriteCount = computed(() => store.favoriteDishCount)
const activeCategoryIndex = computed(() => Math.max(0, categories.findIndex((item) => item.key === activeCategory.value)))
const activeCategoryLabel = computed(() => categoryLabels[activeCategory.value])
const activeDifficultyIndex = computed(() => Math.max(0, difficulties.findIndex((item) => item === activeDifficulty.value)))
const activeDifficultyLabel = computed(() => (activeDifficulty.value === 'all' ? '全部难度' : activeDifficulty.value))

const filteredEntries = computed(() => {
  const search = keyword.value.trim().toLowerCase()
  return entries.value.filter((entry) => {
    const matchCategory = activeCategory.value === 'all' || entry.dish.category === activeCategory.value
    const matchDifficulty = activeDifficulty.value === 'all' || entry.dish.difficulty === activeDifficulty.value
    const matchSearch =
      !search ||
      [
        entry.dish.name,
        entry.dish.description,
        ...(entry.dish.ingredients || []).map((item) => item.name),
        ...(entry.dish.tasteTags || [])
      ]
        .join(' ')
        .toLowerCase()
        .includes(search)
    return matchCategory && matchDifficulty && matchSearch
  })
})

function onCategoryChange(event: { detail: { value: string | number } }) {
  activeCategory.value = categories[Number(event.detail.value)]?.key || 'all'
}

function onDifficultyChange(event: { detail: { value: string | number } }) {
  activeDifficulty.value = difficulties[Number(event.detail.value)] || 'all'
}

function favoriteTimeLabel(value?: string) {
  if (!value) return '刚刚'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

async function toggleFavorite(id: string) {
  try {
    const favorite = await store.toggleDishFavorite(id)
    uni.showToast({ title: favorite ? '已加入收藏' : '已取消收藏', icon: 'none' })
  } catch {
    uni.showToast({ title: store.apiError || '收藏状态更新失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 182rpx;
  gap: 20rpx;
  align-items: center;
  padding: 28rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 149, 93, 0.16), transparent 180rpx),
    linear-gradient(145deg, #fffef9 0%, #fff8f0 100%);
}

.hero-title,
.hero-sub,
.hero-stat-label,
.hero-stat-value {
  display: block;
}

.hero-title {
  color: $text-main;
  font-size: 38rpx;
  font-weight: 900;
}

.hero-sub {
  margin-top: 12rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.5;
}

.hero-stat {
  padding: 22rpx 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.84);
  text-align: center;
}

.hero-stat-label {
  color: $text-sub;
  font-size: 21rpx;
}

.hero-stat-value {
  margin-top: 10rpx;
  color: $primary;
  font-size: 34rpx;
  font-weight: 900;
}

.search-wrap {
  margin-top: 24rpx;
}

.clear-search,
.search-box .clear-search,
.search-box uni-button.clear-search {
  width: 42rpx;
  min-width: 42rpx;
  height: 42rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: rgba(163, 154, 147, 0.14);
  color: $text-sub;
  font-size: 28rpx;
  line-height: 1;
}

.clear-search::after,
.search-box .clear-search::after {
  border: 0;
}

.search-box input {
  flex: 1;
  height: 68rpx;
  color: $text-main;
  font-size: 28rpx;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  padding: 0;
  margin: 24rpx 0 18rpx;
  overflow: hidden;
}

.filter-control {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: $text-main;
  font-size: 24rpx;
  font-weight: 500;
}

.filter-control.active {
  color: $primary;
  font-weight: 900;
}

.filter-mark {
  font-size: 18rpx;
}

.favorite-list {
  display: grid;
  gap: 18rpx;
}

.favorite-card {
  overflow: hidden;
  padding: 18rpx;
}

.favorite-cover {
  width: 100%;
  height: 248rpx;
  border-radius: 24rpx;
  background: #f8f1eb;
}

.favorite-copy {
  margin-top: 18rpx;
}

.favorite-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.favorite-name {
  min-width: 0;
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.favorite-badge {
  flex: 0 0 auto;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 123, 37, 0.12);
  color: $primary;
  font-size: 20rpx;
  font-weight: 900;
}

.favorite-desc,
.favorite-time {
  display: block;
  margin-top: 12rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.5;
}

.favorite-time {
  color: $primary;
}

.favorite-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 14rpx;
}

.favorite-meta text {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #fff7ef;
  color: $text-main;
  font-size: 21rpx;
}

.favorite-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 20rpx;
}

.action-btn {
  height: 70rpx;
  font-size: 26rpx;
  border-radius: 20rpx;
}

.delete-btn {
  border-color: rgba(211, 75, 47, 0.28);
  color: #d34b2f;
  background: #fffaf8;
}
</style>
