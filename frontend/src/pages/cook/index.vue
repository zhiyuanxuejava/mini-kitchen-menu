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

    <view class="cook-list">
      <CookDishCard
        v-for="item in visibleItems"
        :key="item.id"
        :item="item"
        :dish="item.dish"
        @action="handleAction"
      />
      <EmptyState v-if="!visibleItems.length" title="当前状态暂无菜品" desc="切换其他状态，或先提交今日点菜单。" />
    </view>

    <view class="tipbar">
      <text>💡 小贴士：</text>
      <text>按计划逐步完成，美味更有成就感哦～</text>
      <text class="arrow">›</text>
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
  store.syncKitchenTimer()
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
    uni.navigateTo({ url: `/pages/upload/index?itemId=${itemId}` })
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

.tipbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8rpx;
  min-height: 76rpx;
  margin-top: 22rpx;
  padding: 0 24rpx;
  border-radius: 28rpx;
  background: linear-gradient(90deg, #fff5e9, #fffdfb);
  color: $text-sub;
  font-size: 25rpx;
}

.tipbar text:first-child {
  color: $text-main;
  font-weight: 800;
}

.arrow {
  color: $primary;
  font-size: 42rpx;
}
</style>
