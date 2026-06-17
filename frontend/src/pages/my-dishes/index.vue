<template>
  <AppPage no-tab>
    <AppNavbar title="我创建的菜品" back />

    <view class="hero card">
      <view class="hero-copy">
        <text class="hero-title">我的菜品库</text>
      </view>
      <view class="hero-stat">
        <text class="hero-stat-label">当前数量</text>
        <text class="hero-stat-value">{{ myDishes.length }} 道</text>
      </view>
    </view>

    <view class="search-wrap">
      <view class="search-box">
        <image :src="icons.search" class="icon-36" mode="aspectFit" />
        <input v-model="keyword" placeholder="搜索我创建的菜名 / 描述 / 备注" />
        <button v-if="keyword" class="clear-search" hover-class="tap" @tap="keyword = ''">×</button>
      </view>
    </view>

    <view class="toolbar">
      <view class="toolbar-copy">
        <text class="toolbar-title">我的管理区</text>
      </view>
      <button class="primary-btn add-btn" hover-class="tap" @tap="createDish">＋ 新增菜品</button>
    </view>

    <view v-if="monthlyGroups.length" class="timeline">
      <TimelineGroup
        v-for="(group, index) in monthlyGroups"
        :key="group.monthKey"
        :month-label="group.monthLabel"
        :is-first="index === 0"
        :is-last="index === monthlyGroups.length - 1"
      >
        <view v-for="dish in group.items" :key="dish.id" class="timeline-row">
          <view class="timeline-day">
            <view class="timeline-day-dot" />
            <text class="timeline-day-label">{{ dish.dayLabel }}</text>
          </view>
          <view class="timeline-card dish-card card">
            <image class="dish-cover" :src="dish.coverImage" mode="aspectFill" @tap="viewDish(dish.id)" />
            <view class="dish-copy" @tap="viewDish(dish.id)">
              <view class="dish-head">
                <text class="dish-name line-clamp-1">{{ dish.name }} {{ dish.emoji }}</text>
                <text class="dish-badge">我的菜品</text>
              </view>
              <text class="dish-desc line-clamp-2">{{ dish.description || '暂无描述' }}</text>
              <text v-if="dish.remark" class="dish-remark line-clamp-2">备注：{{ dish.remark }}</text>
              <view class="dish-meta">
                <text>{{ dish.difficulty }}</text>
                <text>{{ dish.estimatedMinutes }} 分钟</text>
                <text>{{ dish.servings }} 人份</text>
              </view>
            </view>
            <view class="dish-actions">
              <button class="ghost-btn action-btn" hover-class="tap" @tap="editDish(dish.id)">编辑</button>
              <button class="ghost-btn action-btn delete-btn" hover-class="tap" @tap="removeDish(dish.id)">删除</button>
            </view>
          </view>
        </view>
      </TimelineGroup>
    </view>

    <EmptyState v-else title="还没有我的菜品" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppNavbar from '@/components/AppNavbar.vue'
import AppPage from '@/components/AppPage.vue'
import EmptyState from '@/components/EmptyState.vue'
import { icons } from '@/data/assets'
import TimelineGroup from '@/components/TimelineGroup.vue'
import { useKitchenStore } from '@/stores/kitchen'
import { groupByMonth } from '@/utils/timeline'

const store = useKitchenStore()
const keyword = ref('')

onShow(async () => {
  store.hydrate()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  await store.ensureRemoteDishes()
})

const myDishes = computed(() =>
  store
    .myCreatedDishes()
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
)
const filteredDishes = computed(() => {
  const search = keyword.value.trim().toLowerCase()
  if (!search) return myDishes.value
  return myDishes.value.filter((dish) =>
    [dish.name, dish.description, dish.remark || '', ...(dish.tasteTags || [])]
      .join(' ')
      .toLowerCase()
      .includes(search)
  )
})

const monthlyGroups = computed(() => groupByMonth(filteredDishes.value, (dish) => dish.createdAt))

function createDish() {
  uni.navigateTo({ url: '/pages/dish-form/index' })
}

function viewDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-detail/index?id=${id}` })
}

function editDish(id: string) {
  uni.navigateTo({ url: `/pages/dish-form/index?id=${id}` })
}

function removeDish(id: string) {
  const dish = store.getDish(id)
  if (!dish || !store.canEditDish(dish)) return
  uni.showModal({
    title: '删除菜品',
    content: `确认删除“${dish.name}”吗？删除后将同步清理相关点菜单和记录。`,
    confirmColor: '#d34b2f',
    success: async (result) => {
      if (!result.confirm) return
      try {
        await store.deleteDish(id)
        uni.showToast({ title: '已删除菜品', icon: 'success' })
      } catch {
        uni.showToast({ title: store.apiError || '删除失败', icon: 'none' })
      }
    }
  })
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
    radial-gradient(circle at top right, rgba(135, 191, 115, 0.14), transparent 180rpx),
    linear-gradient(145deg, #fffef9 0%, #f8fcf3 100%);
}

.hero-copy,
.hero-stat {
  min-width: 0;
}

.hero-title,
.hero-stat-label,
.hero-stat-value {
  display: block;
}

.hero-title {
  color: $text-main;
  font-size: 38rpx;
  font-weight: 900;
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
  color: $success;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin: 24rpx 0 18rpx;
}

.toolbar-copy {
  min-width: 0;
}

.toolbar-title {
  display: block;
}

.toolbar-title {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.add-btn {
  width: 220rpx;
  height: 72rpx;
  flex: 0 0 auto;
  font-size: 26rpx;
  border-radius: 22rpx;
}

.dish-list {
  display: grid;
  gap: 18rpx;
}

.dish-card {
  overflow: hidden;
  padding: 18rpx;
}

.dish-cover {
  width: 100%;
  height: 248rpx;
  border-radius: 24rpx;
  background: #f8f1eb;
}

.dish-copy {
  margin-top: 18rpx;
}

.dish-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.dish-name {
  min-width: 0;
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.dish-badge {
  flex: 0 0 auto;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 123, 37, 0.12);
  color: $primary;
  font-size: 20rpx;
  font-weight: 900;
}

.dish-desc,
.dish-remark {
  display: block;
  margin-top: 12rpx;
  color: $text-sub;
  font-size: 24rpx;
  line-height: 1.5;
}

.dish-remark {
  color: $primary;
}

.dish-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 14rpx;
}

.dish-meta text {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #fff7ef;
  color: $text-main;
  font-size: 21rpx;
}

.dish-actions {
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
</style>
