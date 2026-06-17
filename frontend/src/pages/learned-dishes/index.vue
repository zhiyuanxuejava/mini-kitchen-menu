<template>
  <AppPage>
    <AppNavbar title="我已学会" back />

    <view class="summary card">
      <view>
        <text class="summary-title">已掌握 {{ entries.length }} 道菜</text>
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

    <view v-if="monthlyGroups.length" class="timeline">
      <TimelineGroup
        v-for="(group, index) in monthlyGroups"
        :key="group.monthKey"
        :month-label="group.monthLabel"
        :is-first="index === 0"
        :is-last="index === monthlyGroups.length - 1"
      >
        <view v-for="entry in group.items" :key="entry.id" class="timeline-row">
          <view class="timeline-day">
            <view class="timeline-day-dot" />
            <text class="timeline-day-label">{{ entry.dayLabel }}</text>
          </view>
          <view class="timeline-card card" @tap="viewDish(entry.dish.id)">
            <view class="timeline-head">
              <view>
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
      </TimelineGroup>
    </view>

    <EmptyState v-else title="还没有学会记录" />

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
import TimelineGroup from '@/components/TimelineGroup.vue'
import { groupByMonth } from '@/utils/timeline'
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

const monthlyGroups = computed(() => groupByMonth(entries.value, (entry) => entry.learnedAt))

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

.summary-title {
  display: block;
}

.summary-title {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
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
  display: block;
  padding-bottom: 18rpx;
}

.timeline-row {
  display: grid;
  grid-template-columns: 80rpx 1fr;
  align-items: flex-start;
  gap: 0;
}

.timeline-row:not(:last-child) {
  margin-bottom: 20rpx;
}

.timeline-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding-top: 14rpx;
}

.timeline-day-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: $primary;
  box-shadow: 0 0 0 3rpx #fff;
}

.timeline-day-label {
  color: $text-sub;
  font-size: 24rpx;
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

.timeline-title {
  display: block;
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
  grid-template-columns: 188rpx minmax(0, 1fr);
  gap: 18rpx;
  margin-top: 16rpx;
}

.timeline-body image {
  width: 188rpx;
  height: 152rpx;
  border-radius: 20rpx;
  background: #f8f1eb;
}

.timeline-copy {
  min-width: 0;
}

.timeline-desc {
  display: block;
  color: $text-sub;
  font-size: 24rpx;
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
}
</style>
