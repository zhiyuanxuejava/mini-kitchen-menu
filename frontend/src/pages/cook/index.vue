<template>
  <AppPage>
    <view class="cook-head">
      <text class="title-xl">今日做菜台 👨‍🍳</text>
    </view>

    <view class="status-tabs">
      <button v-for="tab in tabs" :key="tab.key" :class="{ active: active === tab.key }" @tap="active = tab.key">
        {{ tab.label }}
      </button>
    </view>

    <CookStatusCard :pending="store.pendingCount" :cooking="store.cookingCount" :done="store.doneCount" />

    <view v-if="store.activeKitchenTimers.length" class="timer-board card">
      <view class="timer-board-head">
        <view>
          <text class="timer-board-title">当前计时看板</text>
          <text class="timer-board-sub">刷新后也会保留，支持多道菜同时计时</text>
        </view>
        <view class="timer-board-count">
          <text>{{ store.activeKitchenTimers.length }}</text>
          <text>个</text>
        </view>
      </view>

      <button
        v-for="timer in store.activeKitchenTimers.slice(0, 4)"
        :key="timer.id"
        class="timer-board-item"
        hover-class="tap"
        @tap="goTimer(timer.context.itemId)"
      >
        <view class="timer-board-copy">
          <text class="timer-board-item-title">{{ timer.context.dishName || '当前菜品' }}</text>
          <text class="timer-board-item-sub">第 {{ timer.context.stepNo || 1 }} 步 · {{ timer.context.stepTitle || '当前步骤' }}</text>
        </view>
        <view class="timer-board-meta">
          <text>{{ timer.status === 'paused' ? '已暂停' : formatDuration(store.kitchenTimerRemaining(timer.id)) }}</text>
          <text>{{ timer.status === 'paused' ? '继续处理' : '去步骤' }}</text>
        </view>
      </button>
    </view>

    <view class="cook-list">
      <CookDishCard
        v-for="item in visibleItems"
        :key="item.id"
        :item="item"
        :dish="item.dish"
        @action="handleAction"
      />
      <EmptyState v-if="!visibleItems.length" title="当前状态暂无菜品" />
    </view>

    <BottomTabbar active="cook" />
  </AppPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppPage from '@/components/AppPage.vue'
import BottomTabbar from '@/components/BottomTabbar.vue'
import CookDishCard from '@/components/CookDishCard.vue'
import CookStatusCard from '@/components/CookStatusCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { CookStatus } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const active = ref<CookStatus>('pending')
const tabs = [
  { key: 'pending', label: '待制作' },
  { key: 'cooking', label: '制作中' },
  { key: 'done', label: '已完成' }
] as const

onShow(async () => {
  store.hydrate()
  store.syncKitchenTimers()
  syncActiveTab()
  if (!store.user) {
    uni.reLaunch({ url: '/pages/login/index' })
    return
  }
  try {
    await store.refreshSessionData()
  } finally {
    syncActiveTab()
  }
})

const visibleItems = computed(() => store.menuDishes.filter((item) => item.cookStatus === active.value))

function handleAction(itemId: string, status: CookStatus) {
  if (status === 'done') {
    active.value = 'done'
    const item = store.menu.items.find((candidate) => candidate.id === itemId)
    const query = item ? `itemId=${itemId}&dishId=${item.dishId}` : `itemId=${itemId}`
    uni.navigateTo({ url: `/pages/upload/index?${query}` })
    return
  }
  active.value = 'cooking'
  if (status === 'pending') store.setCookStatus(itemId, 'cooking')
  uni.navigateTo({ url: `/pages/cook-step/index?itemId=${itemId}` })
}

function countByStatus(status: CookStatus) {
  if (status === 'pending') return store.pendingCount
  if (status === 'cooking') return store.cookingCount
  return store.doneCount
}

function syncActiveTab() {
  if (countByStatus(active.value) > 0) return
  if (store.pendingCount > 0) {
    active.value = 'pending'
    return
  }
  if (store.cookingCount > 0) {
    active.value = 'cooking'
    return
  }
  active.value = 'done'
}

function goTimer(itemId?: string) {
  if (!itemId) return
  uni.navigateTo({ url: `/pages/cook-step/index?itemId=${itemId}` })
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(durationMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.cook-head {
  display: flex;
  align-items: center;
  margin: 28rpx 0 28rpx;
}

.title-xl {
  font-size: 48rpx;
}

.status-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding: 8rpx;
  margin-bottom: 26rpx;
  border-radius: 999rpx;
  background: #fff3e8;
}

.status-tabs button {
  height: 72rpx;
  border-radius: 999rpx;
  color: $text-sub;
  font-size: 29rpx;
  font-weight: 800;
}

.status-tabs button.active {
  color: #fff;
  background: linear-gradient(135deg, $primary-2, $primary);
}

.cook-list {
  margin-top: 30rpx;
}

.timer-board {
  margin-top: 22rpx;
  padding: 24rpx 22rpx 20rpx;
  background:
    radial-gradient(circle at 94% 12%, rgba(255, 163, 98, 0.18), transparent 180rpx),
    linear-gradient(180deg, #fffefb 0%, #fff8f1 100%);
}

.timer-board-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
}

.timer-board-title,
.timer-board-sub,
.timer-board-count text,
.timer-board-item-title,
.timer-board-item-sub,
.timer-board-meta text {
  display: block;
}

.timer-board-title {
  color: $text-main;
  font-size: 30rpx;
  font-weight: 900;
}

.timer-board-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.55;
}

.timer-board-count {
  min-width: 96rpx;
  padding: 12rpx 0;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.92);
  text-align: center;
  box-shadow: inset 0 0 0 1rpx rgba(255, 220, 197, 0.92);
}

.timer-board-count text:first-child {
  color: $primary;
  font-size: 30rpx;
  font-weight: 900;
}

.timer-board-count text:last-child {
  margin-top: 2rpx;
  color: $text-sub;
  font-size: 20rpx;
}

.timer-board-item {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16rpx;
  align-items: center;
  margin-top: 16rpx;
  padding: 18rpx 18rpx 18rpx 20rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: inset 0 0 0 1rpx rgba(255, 226, 208, 0.9);
}

.timer-board-copy,
.timer-board-meta {
  min-width: 0;
}

.timer-board-item-title {
  color: $text-main;
  font-size: 27rpx;
  font-weight: 900;
}

.timer-board-item-sub {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 22rpx;
  line-height: 1.5;
}

.timer-board-meta {
  text-align: right;
}

.timer-board-meta text:first-child {
  color: $primary;
  font-size: 25rpx;
  font-weight: 900;
}

.timer-board-meta text:last-child {
  margin-top: 8rpx;
  color: $text-sub;
  font-size: 21rpx;
}

</style>
