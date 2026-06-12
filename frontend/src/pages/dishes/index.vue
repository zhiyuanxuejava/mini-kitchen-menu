<template>
  <AppPage class="dishes-page">
    <view class="page-head">
      <text class="title-xl">我的<text class="accent">菜品库</text></text>
      <image :src="icons.basket" mode="aspectFit" />
    </view>
    <view class="search-box">
      <image :src="icons.search" class="icon-36" mode="aspectFit" />
      <input v-model="keyword" placeholder="搜索菜名 / 食材 / 做法" />
    </view>

    <view class="filter-row card">
      <picker :range="difficultyPickerNames" :value="activeDifficultyIndex" @change="onDifficultyChange">
        <view :class="['filter-control', { active: activeDifficulty !== 'all' }]">
          <text>{{ activeDifficultyLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>

      <button :class="['filter-control', { active: sortKey === 'time' }]" hover-class="tap" @tap="toggleSort('time')">
        <text>时间</text>
        <text class="filter-mark">{{ sortIndicator('time') }}</text>
      </button>

      <picker :range="categoryNames" :value="activeCategoryIndex" @change="onCategoryChange">
        <view :class="['filter-control', { active: activeCategory !== 'all' }]">
          <text>{{ activeCategoryLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>

      <button :class="['filter-control', { active: sortKey === 'rating' }]" hover-class="tap" @tap="toggleSort('rating')">
        <text>评分</text>
        <text class="filter-mark">{{ sortIndicator('rating') }}</text>
      </button>
    </view>

    <view v-if="activeFilters.length" class="active-filters">
      <view v-for="item in activeFilters" :key="item.key">
        <text>{{ item.label }}</text>
        <button hover-class="tap" @tap="item.clear">×</button>
      </view>
    </view>

    <button class="add-dish card" hover-class="tap" @tap="goCreate">
      <text class="plus-mark">+</text>
      <text>新增菜品</text>
      <image class="pot" :src="icons.pot" mode="aspectFit" />
    </button>

    <DishListItem
      v-for="dish in dishes"
      :key="dish.id"
      :dish="dish"
      @view="viewDish"
      @add="store.addToMenu"
    />
    <view v-if="store.loading" class="loading-card card">正在同步后台菜品...</view>
    <view v-if="store.apiError" class="api-error card">{{ store.apiError }}</view>
    <EmptyState v-if="!dishes.length" title="没有找到菜品" desc="换个关键词，或新增一道自己的拿手菜。" />

    <BottomTabbar active="dishes" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import DishListItem from '@/components/DishListItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import { icons } from '@/data/assets'
import { categoryLabels } from '@/data/seed'
import type { Difficulty, Dish, DishCategory } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

type DifficultyFilter = Difficulty | 'all'
type SortKey = 'default' | 'time' | 'rating'
type SortDirection = 'asc' | 'desc'

const store = useKitchenStore()
const keyword = ref('')
const activeCategory = ref<DishCategory | 'all'>('all')
const activeDifficulty = ref<DifficultyFilter>('all')
const sortKey = ref<SortKey>('default')
const sortDirection = ref<SortDirection>('asc')
const categories = (Object.keys(categoryLabels) as Array<DishCategory | 'all'>).map((key) => ({
  key,
  label: categoryLabels[key]
}))
const categoryNames = categories.map((item) => item.label)
const difficulties: DifficultyFilter[] = ['all', '简单', '中等', '较难']
const difficultyPickerNames = ['全部难度', '简单', '中等', '较难']

onLoad((query) => {
  if (query?.keyword && typeof query.keyword === 'string') keyword.value = query.keyword
})

onShow(async () => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else await store.ensureRemoteDishes()
})

const activeCategoryIndex = computed(() => Math.max(0, categories.findIndex((item) => item.key === activeCategory.value)))
const activeCategoryLabel = computed(() => categoryLabels[activeCategory.value])
const activeDifficultyIndex = computed(() => Math.max(0, difficulties.findIndex((item) => item === activeDifficulty.value)))
const activeDifficultyLabel = computed(() => (activeDifficulty.value === 'all' ? '难度' : activeDifficulty.value))
const activeFilters = computed(() => {
  const rows: Array<{ key: string; label: string; clear: () => void }> = []
  if (activeDifficulty.value !== 'all') rows.push({ key: 'difficulty', label: `难度：${activeDifficulty.value}`, clear: () => (activeDifficulty.value = 'all') })
  if (activeCategory.value !== 'all') rows.push({ key: 'category', label: `分类：${activeCategoryLabel.value}`, clear: () => (activeCategory.value = 'all') })
  if (sortKey.value !== 'default') rows.push({ key: 'sort', label: `${sortKey.value === 'time' ? '时间' : '评分'}${sortIndicator(sortKey.value)}`, clear: clearSort })
  return rows
})
const dishes = computed(() => {
  const rows = store
    .dishesByCategory(activeCategory.value, keyword.value, 'all')
    .filter((dish) => activeDifficulty.value === 'all' || dish.difficulty === activeDifficulty.value)

  return sortDishes(rows)
})

function onCategoryChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeCategory.value = categories[index]?.key || 'all'
}

function onDifficultyChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeDifficulty.value = difficulties[index] || 'all'
}

function toggleSort(key: Exclude<SortKey, 'default'>) {
  if (sortKey.value !== key) {
    sortKey.value = key
    sortDirection.value = key === 'time' ? 'asc' : 'desc'
    return
  }

  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

function clearSort() {
  sortKey.value = 'default'
  sortDirection.value = 'asc'
}

function sortIndicator(key: SortKey) {
  if (key === 'default') return ''
  if (sortKey.value !== key) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

function sortDishes(rows: Dish[]) {
  if (sortKey.value === 'default') return rows

  return [...rows].sort((left, right) => {
    const value = sortKey.value === 'time'
      ? compareNumber(left.estimatedMinutes, right.estimatedMinutes)
      : compareNumber(left.rating || 0, right.rating || 0)

    if (value !== 0) return value
    if (sortKey.value === 'rating' && left.ratingCount !== right.ratingCount) return compareNumber(left.ratingCount || 0, right.ratingCount || 0)
    if (left.estimatedMinutes !== right.estimatedMinutes) return left.estimatedMinutes - right.estimatedMinutes
    return left.name.localeCompare(right.name)
  })
}

function compareNumber(left: number, right: number) {
  const value = left - right
  return sortDirection.value === 'asc' ? value : -value
}

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function goCreate() {
  uni.navigateTo({ url: '/pages/dish-form/index' })
}
</script>

<style scoped lang="scss">
.dishes-page {
  padding-top: 34rpx;
  padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 10rpx 0 24rpx;
}

.page-head image {
  width: 146rpx;
  height: 116rpx;
  margin-top: 8rpx;
}

.search-box input {
  flex: 1;
  height: 68rpx;
  color: $text-main;
  font-size: 28rpx;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  height: 72rpx;
  padding: 0;
  margin: 24rpx 0 14rpx;
  border-radius: 22rpx;
  overflow: hidden;
}

.filter-row picker,
.filter-row uni-picker {
  min-width: 0;
  height: 72rpx;
}

.filter-control,
.filter-row button,
.filter-row uni-button {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  min-width: 0;
  margin: 0;
  padding: 0 8rpx;
  color: $text-main;
  font-size: 25rpx;
  font-weight: 500;
  line-height: 1;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.filter-control {
  box-sizing: border-box;
}

.filter-control text:first-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-control.active {
  color: $primary;
  font-weight: 900;
}

.filter-mark {
  flex: 0 0 auto;
  color: currentColor;
  font-size: 20rpx;
}

.filter-row button::after,
.filter-row uni-button::after {
  border: 0;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin: 0 0 18rpx;
}

.active-filters view {
  height: 48rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 0 10rpx 0 18rpx;
  border: 1rpx solid rgba(255, 123, 37, 0.22);
  border-radius: 999rpx;
  background: #fff7ef;
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
}

.active-filters button,
.active-filters uni-button {
  width: 30rpx;
  height: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 123, 37, 0.12);
  color: $primary;
  font-size: 24rpx;
  line-height: 1;
}

.active-filters button::after,
.active-filters uni-button::after {
  border: 0;
}

.add-dish {
  position: relative;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  overflow: hidden;
  margin-bottom: 22rpx;
  color: $primary;
  font-size: 31rpx;
  font-weight: 900;
}

.plus-mark {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-2 0%, $primary 100%);
  color: #fff;
  font-size: 42rpx;
  font-weight: 500;
  line-height: 1;
}

.add-dish .pot {
  position: absolute;
  right: 28rpx;
  bottom: -2rpx;
  width: 118rpx;
  height: 92rpx;
}

.loading-card,
.api-error {
  padding: 22rpx;
  margin-bottom: 18rpx;
  color: $text-sub;
  font-size: 25rpx;
  text-align: center;
}

.api-error {
  color: #d34b2f;
}
</style>
