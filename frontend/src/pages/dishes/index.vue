<template>
  <AppPage class="dishes-page">
    <view class="page-head">
      <view class="head-copy">
        <text class="title-xl">{{ libraryPrefix }}<text class="accent">菜品库</text></text>
      </view>
      <button class="library-toggle" hover-class="tap" @tap="toggleSource">
        <image :src="icons.basket" mode="aspectFit" />
      </button>
    </view>
    <view class="search-wrap">
      <view class="search-box" :class="{ active: showSuggestions }">
        <image :src="icons.search" class="icon-36" mode="aspectFit" />
        <input
          v-model="keyword"
          placeholder="搜索菜名 / 食材 / 做法"
          confirm-type="search"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
          @input="onKeywordInput"
          @confirm="onSearchConfirm"
        />
        <button v-if="keyword" class="clear-search" hover-class="tap" @tap="clearKeyword">×</button>
      </view>
      <view v-if="selectedSuggestion" class="selected-tip">
        <text>已选择：{{ selectedSuggestion.name }}</text>
        <button hover-class="tap" @tap="clearSelectedSuggestion">重新搜索</button>
      </view>
      <view v-else-if="showSuggestions" class="search-suggestions card">
        <button
          v-for="dish in searchSuggestions"
          :key="dish.id"
          class="suggestion-item"
          hover-class="tap"
          @mousedown.prevent
          @tap="selectSuggestion(dish)"
        >
          <image class="suggestion-thumb" :src="dish.coverImage" mode="aspectFill" />
          <view class="suggestion-copy">
            <text class="suggestion-name line-clamp-1">{{ dish.name }}</text>
            <text class="suggestion-meta line-clamp-1">{{ dish.description || `${dish.estimatedMinutes} 分钟 · ${dish.difficulty}` }}</text>
          </view>
          <text class="suggestion-action">选择</text>
        </button>
      </view>
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

      <picker :range="learnedStatusNames" :value="activeLearnedStatusIndex" @change="onLearnedStatusChange">
        <view :class="['filter-control', { active: activeLearnedStatus !== 'all' }]">
          <text>{{ activeLearnedStatusLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>
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
      @favorite="toggleFavorite"
      @copy="copyDishToMine"
    />
    <view v-if="store.loading" class="loading-card card">菜品同步中</view>
    <view v-if="store.apiError" class="api-error card">{{ store.apiError }}</view>
    <EmptyState v-if="!dishes.length" title="没有找到菜品" />

    <BottomTabbar active="dishes" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import DishListItem from '@/components/DishListItem.vue'
import EmptyState from '@/components/EmptyState.vue'
import { icons } from '@/data/assets'
import { categoryLabels } from '@/data/labels'
import type { Difficulty, Dish, DishCategory, DishSourceType } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

type DifficultyFilter = Difficulty | 'all'
type LearnedStatusFilter = 'all' | 'learned' | 'unlearned'
type SortKey = 'default' | 'time' | 'rating'
type SortDirection = 'asc' | 'desc'
type DishSourceFilter = DishSourceType | 'all'

const store = useKitchenStore()
const keyword = ref('')
const searchFocused = ref(false)
const selectedSuggestionId = ref('')
const activeSource = ref<DishSourceFilter>('system_sync')
const activeCategory = ref<DishCategory | 'all'>('all')
const activeDifficulty = ref<DifficultyFilter>('all')
const activeLearnedStatus = ref<LearnedStatusFilter>('all')
const sortKey = ref<SortKey>('default')
const sortDirection = ref<SortDirection>('asc')
const sourceOptions: Array<{ key: DishSourceFilter; label: string }> = [
  { key: 'system_sync', label: '公共菜品' },
  { key: 'user_created', label: '我的菜品' }
]
const categories = (Object.keys(categoryLabels) as Array<DishCategory | 'all'>).map((key) => ({
  key,
  label: categoryLabels[key]
}))
const categoryNames = categories.map((item) => item.label)
const difficulties: DifficultyFilter[] = ['all', '简单', '中等', '较难']
const difficultyPickerNames = ['全部难度', '简单', '中等', '较难']
const learnedStatuses: LearnedStatusFilter[] = ['all', 'learned', 'unlearned']
const learnedStatusNames = ['全部状态', '我已学会', '未学会']

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
const activeLearnedStatusIndex = computed(() => Math.max(0, learnedStatuses.findIndex((item) => item === activeLearnedStatus.value)))
const activeLearnedStatusLabel = computed(() => {
  if (activeLearnedStatus.value === 'learned') return '我已学会'
  if (activeLearnedStatus.value === 'unlearned') return '未学会'
  return '状态'
})
const libraryPrefix = computed(() => (activeSource.value === 'user_created' ? '我的' : '公共'))
const selectedSuggestion = computed(() => (selectedSuggestionId.value ? store.getDish(selectedSuggestionId.value) : undefined))
const searchSuggestions = computed(() => {
  if (!keyword.value.trim() || selectedSuggestionId.value) return []
  return store.dishSearchCandidates(keyword.value, activeSource.value)
})
const showSuggestions = computed(() => searchFocused.value && !selectedSuggestionId.value && searchSuggestions.value.length > 0)
const activeFilters = computed(() => {
  const rows: Array<{ key: string; label: string; clear: () => void }> = []
  if (activeDifficulty.value !== 'all') rows.push({ key: 'difficulty', label: `难度：${activeDifficulty.value}`, clear: () => (activeDifficulty.value = 'all') })
  if (activeCategory.value !== 'all') rows.push({ key: 'category', label: `分类：${activeCategoryLabel.value}`, clear: () => (activeCategory.value = 'all') })
  if (activeLearnedStatus.value !== 'all') rows.push({ key: 'learned', label: `状态：${activeLearnedStatusLabel.value}`, clear: () => (activeLearnedStatus.value = 'all') })
  if (sortKey.value !== 'default') rows.push({ key: 'sort', label: `${sortKey.value === 'time' ? '时间' : '评分'}${sortIndicator(sortKey.value)}`, clear: clearSort })
  return rows
})
const dishes = computed(() => {
  if (selectedSuggestion.value) {
    const matchSource = (selectedSuggestion.value.sourceType || 'system_sync') === activeSource.value
    const matchDifficulty = activeDifficulty.value === 'all' || selectedSuggestion.value.difficulty === activeDifficulty.value
    const matchCategory = activeCategory.value === 'all' || selectedSuggestion.value.category === activeCategory.value
    const matchLearned =
      activeLearnedStatus.value === 'all' ||
      (activeLearnedStatus.value === 'learned' && Boolean(selectedSuggestion.value.learnedAt)) ||
      (activeLearnedStatus.value === 'unlearned' && !selectedSuggestion.value.learnedAt)
    return matchSource && matchDifficulty && matchCategory && matchLearned ? [selectedSuggestion.value] : []
  }

  const rows = store
    .dishesByCategory(activeCategory.value, keyword.value, activeSource.value)
    .filter((dish) => activeDifficulty.value === 'all' || dish.difficulty === activeDifficulty.value)
    .filter((dish) => {
      if (activeLearnedStatus.value === 'learned') return Boolean(dish.learnedAt)
      if (activeLearnedStatus.value === 'unlearned') return !dish.learnedAt
      return true
    })

  return sortDishes(rows)
})

watch(keyword, (value, oldValue) => {
  if (selectedSuggestionId.value && value !== selectedSuggestion.value?.name && value !== oldValue) {
    selectedSuggestionId.value = ''
  }
})

watch(activeSource, () => {
  const selected = selectedSuggestion.value
  if (!selected) return
  if ((selected.sourceType || 'system_sync') !== activeSource.value) {
    selectedSuggestionId.value = ''
  }
})

function onCategoryChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeCategory.value = categories[index]?.key || 'all'
}

function onDifficultyChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeDifficulty.value = difficulties[index] || 'all'
}

function onLearnedStatusChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeLearnedStatus.value = learnedStatuses[index] || 'all'
}

function onSearchFocus() {
  searchFocused.value = true
}

function onSearchBlur() {
  setTimeout(() => {
    searchFocused.value = false
  }, 120)
}

function onKeywordInput() {
  if (!keyword.value.trim()) selectedSuggestionId.value = ''
}

function onSearchConfirm() {
  const first = searchSuggestions.value[0]
  if (first) selectSuggestion(first)
}

function selectSuggestion(dish: Dish) {
  selectedSuggestionId.value = dish.id
  keyword.value = dish.name
  searchFocused.value = false
}

function clearKeyword() {
  keyword.value = ''
  selectedSuggestionId.value = ''
}

function clearSelectedSuggestion() {
  selectedSuggestionId.value = ''
  searchFocused.value = true
}

function toggleSource() {
  activeSource.value = activeSource.value === 'system_sync' ? 'user_created' : 'system_sync'
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

async function toggleFavorite(id: string) {
  try {
    const favorite = await store.toggleDishFavorite(id)
    uni.showToast({ title: favorite ? '已加入收藏' : '已取消收藏', icon: 'none' })
  } catch {
    uni.showToast({ title: store.apiError || '收藏状态更新失败', icon: 'none' })
  }
}

async function copyDishToMine(id: string) {
  const dish = store.getDish(id)
  if (!dish) return
  try {
    await store.copyDishToMine(id)
    uni.showToast({ title: '已添加到我的菜品', icon: 'success' })
  } catch {
    uni.showToast({ title: store.apiError || '添加失败', icon: 'none' })
  }
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

.head-copy {
  min-width: 0;
}

.library-toggle,
.page-head .library-toggle,
.page-head uni-button.library-toggle {
  position: relative;
  width: 146rpx;
  height: 116rpx;
  margin: 0;
  padding: 0;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #fff8ef 0%, #fff2e3 100%);
  box-shadow: 0 12rpx 24rpx rgba(255, 123, 37, 0.1);
}

.library-toggle::after,
.page-head .library-toggle::after {
  border: 0;
}

.library-toggle image {
  width: 146rpx;
  height: 116rpx;
  margin-top: 8rpx;
}

.search-wrap {
  position: relative;
  z-index: 3;
}

.search-box {
  position: relative;
}

.search-box.active {
  border-color: rgba(255, 123, 37, 0.32);
  box-shadow: 0 14rpx 28rpx rgba(255, 123, 37, 0.12);
}

.search-box input {
  flex: 1;
  height: 68rpx;
  color: $text-main;
  font-size: 28rpx;
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

.search-suggestions {
  position: absolute;
  top: calc(100% + 12rpx);
  left: 0;
  right: 0;
  padding: 10rpx 0;
  border-radius: 24rpx;
}

.suggestion-item,
.search-suggestions .suggestion-item,
.search-suggestions uni-button.suggestion-item {
  width: 100%;
  min-height: 108rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin: 0;
  padding: 18rpx 22rpx;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  text-align: left;
}

.suggestion-item::after,
.search-suggestions .suggestion-item::after {
  border: 0;
}

.suggestion-item + .suggestion-item {
  border-top: 1rpx solid rgba(231, 223, 218, 0.9);
}

.suggestion-thumb {
  width: 72rpx;
  height: 72rpx;
  flex: 0 0 auto;
  border-radius: 18rpx;
  background: #f6efe9;
}

.suggestion-copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.suggestion-name {
  color: $text-main;
  font-size: 28rpx;
  font-weight: 800;
}

.suggestion-meta {
  color: $text-sub;
  font-size: 22rpx;
}

.suggestion-action {
  flex: 0 0 auto;
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
}

.selected-tip {
  margin: 14rpx 8rpx 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  color: $text-sub;
  font-size: 22rpx;
}

.selected-tip button,
.selected-tip uni-button {
  min-width: 0;
  height: 46rpx;
  margin: 0;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #fff7ef;
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
}

.selected-tip button::after,
.selected-tip uni-button::after {
  border: 0;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
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
  gap: 2rpx;
  min-width: 0;
  margin: 0;
  padding: 0 6rpx;
  color: $text-main;
  font-size: 24rpx;
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
  font-size: 18rpx;
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
