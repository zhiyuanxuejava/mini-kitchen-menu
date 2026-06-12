<template>
  <AppPage>
    <view class="cook-head">
      <text class="title-xl">今日做菜台 👨‍🍳</text>
      <button class="timer" hover-class="tap" @tap="timerToast">
        <image :src="icons.timer" mode="aspectFit" />
        <text>厨房计时器</text>
      </button>
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
import { icons } from '@/data/assets'
import type { CookStatus } from '@/data/types'
import { useKitchenStore } from '@/stores/kitchen'

const store = useKitchenStore()
const active = ref<CookStatus>('cooking')
const tabs = [
  { key: 'pending', label: '待制作' },
  { key: 'cooking', label: '制作中' },
  { key: 'done', label: '已完成' }
] as const

onShow(() => {
  store.hydrate()
  if (!store.user) uni.reLaunch({ url: '/pages/login/index' })
  else store.refreshSessionData()
})

const visibleItems = computed(() => store.menuDishes)

function handleAction(itemId: string, status: CookStatus) {
  if (status === 'done') {
    uni.navigateTo({ url: `/pages/upload/index?itemId=${itemId}` })
    return
  }
  if (status === 'pending') store.setCookStatus(itemId, 'cooking')
  uni.navigateTo({ url: `/pages/cook-step/index?itemId=${itemId}` })
}

function timerToast() {
  uni.showToast({ title: '计时器入口已预留', icon: 'none' })
}
</script>

<style scoped lang="scss">
.cook-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  margin: 28rpx 0 28rpx;
}

.title-xl {
  font-size: 48rpx;
}

.timer {
  height: 62rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ffd0b7;
  border-radius: 999rpx;
  background: #fff6ef;
  color: $primary;
  font-size: 24rpx;
  font-weight: 800;
}

.timer image {
  width: 34rpx;
  height: 34rpx;
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
