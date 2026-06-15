<template>
  <AppPage>
    <AppNavbar title="我已学会" subtitle="按时间线回看自己掌握的菜品" back />

    <view class="summary card">
      <view>
        <text class="summary-title">已掌握 {{ entries.length }} 道菜</text>
        <text class="summary-sub">支持按关键词、分类、难度筛选学会记录</text>
      </view>
      <text class="summary-mark">时间线</text>
    </view>

    <view class="search-box">
      <image :src="icons.search" class="icon-36" mode="aspectFit" />
      <input v-model="keyword" placeholder="搜索学会的菜名 / 食材 / 做法" />
    </view>

    <view class="filter-row card">
      <picker :range="difficultyPickerNames" :value="activeDifficultyIndex" @change="onDifficultyChange">
        <view :class="['filter-control', { active: activeDifficulty !== 'all' }]">
          <text>{{ activeDifficultyLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>

      <picker :range="categoryNames" :value="activeCategoryIndex" @change="onCategoryChange">
        <view :class="['filter-control', { active: activeCategory !== 'all' }]">
          <text>{{ activeCategoryLabel }}</text>
          <text class="filter-mark">⌄</text>
        </view>
      </picker>
    </view>

    <view v-if="entries.length" class="timeline">
      <view v-for="entry in entries" :key="entry.id" class="timeline-item">
        <view class="timeline-axis">
          <view class="timeline-dot" />
          <view class="timeline-line" />
        </view>
        <view class="timeline-card card" @tap="viewDish(entry.dish.id)">
          <view class="timeline-head">
            <view>
              <text class="timeline-date">{{ formatLearnedTime(entry.learnedAt) }}</text>
              <text class="timeline-title">{{ entry.dish.name }} {{ entry.dish.emoji }}</text>
            </view>
            <text class="timeline-badge">已学会</text>
          </view>
          <view class="timeline-body">
            <image :src="entry.dish.coverImage" mode="aspectFill" />
            <view class="timeline-copy">
              <text class="timeline-desc line-clamp-2">{{ entry.dish.description }}</text>
              <view class="timeline-meta">
                <text>{{ entry.dish.difficulty }}</text>
                <text>{{ entry.dish.estimatedMinutes }} 分钟</text>
                <text>{{ entry.dish.tasteTags.slice(0, 2).join(' / ') || '家常菜' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <EmptyState v-else title="还没有学会的菜品" desc="做完一道菜后，可以把它加入“我已学会”，这里会沉淀成时间线。" />

    <BottomTabbar active="mine" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
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
const difficultyPickerNames = ['全部难度', '简单', '中等', '较难']

onShow(async () => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  await store.fetchLearnedDishEntries()
})

const activeCategoryIndex = computed(() => Math.max(0, categories.findIndex((item) => item.key === activeCategory.value)))
const activeCategoryLabel = computed(() => categoryLabels[activeCategory.value])
const activeDifficultyIndex = computed(() => Math.max(0, difficulties.findIndex((item) => item === activeDifficulty.value)))
const activeDifficultyLabel = computed(() => (activeDifficulty.value === 'all' ? '难度' : activeDifficulty.value))

const entries = computed(() =>
  store
    .learnedDishEntries()
    .filter((entry) => activeCategory.value === 'all' || entry.dish.category === activeCategory.value)
    .filter((entry) => activeDifficulty.value === 'all' || entry.dish.difficulty === activeDifficulty.value)
    .filter((entry) => {
      const search = keyword.value.trim().toLowerCase()
      if (!search) return true
      return (
        entry.dish.name.toLowerCase().includes(search) ||
        entry.dish.description.toLowerCase().includes(search) ||
        entry.dish.ingredients.some((item) => item.name.toLowerCase().includes(search)) ||
        entry.dish.steps.some((step) => `${step.title}${step.description}`.toLowerCase().includes(search))
      )
    })
)

function onCategoryChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeCategory.value = categories[index]?.key || 'all'
}

function onDifficultyChange(event: { detail: { value: string | number } }) {
  const index = Number(event.detail.value)
  activeDifficulty.value = difficulties[index] || 'all'
}

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function formatLearnedTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  const h = `${date.getHours()}`.padStart(2, '0')
  const min = `${date.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}`
}
</script>

<style scoped lang="scss">
.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 24rpx;
  margin-bottom: 18rpx;
  background: linear-gradient(135deg, #fffef8 0%, #f5fbef 100%);
}

.summary-title,
.summary-sub {
  display: block;
}

.summary-title {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.summary-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 23rpx;
}

.summary-mark {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #fff;
  color: $success;
  font-size: 22rpx;
  font-weight: 900;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  height: 72rpx;
  padding: 0;
  margin: 18rpx 0 22rpx;
  border-radius: 22rpx;
  overflow: hidden;
}

.filter-row picker,
.filter-row uni-picker {
  min-width: 0;
  height: 72rpx;
}

.filter-control {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: 0 12rpx;
  color: $text-main;
  font-size: 25rpx;
}

.filter-control.active {
  color: $primary;
  font-weight: 900;
}

.filter-mark {
  font-size: 20rpx;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding-bottom: 18rpx;
}

.timeline-item {
  display: grid;
  grid-template-columns: 34rpx minmax(0, 1fr);
  gap: 16rpx;
}

.timeline-axis {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 18rpx;
  height: 18rpx;
  margin-top: 22rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-2 0%, $primary 100%);
}

.timeline-line {
  width: 4rpx;
  flex: 1;
  margin-top: 8rpx;
  border-radius: 999rpx;
  background: rgba(255, 144, 67, 0.18);
}

.timeline-item:last-child .timeline-line {
  opacity: 0;
}

.timeline-card {
  padding: 22rpx;
}

.timeline-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.timeline-date,
.timeline-title {
  display: block;
}

.timeline-date {
  color: $primary;
  font-size: 22rpx;
  font-weight: 800;
}

.timeline-title {
  margin-top: 8rpx;
  color: $text-main;
  font-size: 29rpx;
  font-weight: 900;
}

.timeline-badge {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #eef8e8;
  color: $success;
  font-size: 22rpx;
  font-weight: 900;
}

.timeline-body {
  display: grid;
  grid-template-columns: 160rpx minmax(0, 1fr);
  gap: 18rpx;
  margin-top: 18rpx;
  align-items: center;
}

.timeline-body image {
  width: 160rpx;
  height: 116rpx;
  border-radius: 18rpx;
}

.timeline-copy {
  min-width: 0;
}

.timeline-desc {
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.5;
}

.timeline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 12rpx;
}

.timeline-meta text {
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: #fff7ef;
  color: $text-main;
  font-size: 21rpx;
  font-weight: 700;
}
</style>
