<template>
  <view class="summary card" @tap="goMenu">
    <view class="summary-head">
      <view class="head-left">
        <view class="head-icon">
          <image :src="icons.calendar" mode="aspectFit" />
        </view>
        <text>今日点菜单</text>
      </view>
      <text class="detail">查看详情 ›</text>
    </view>
    <view class="summary-grid">
      <view class="summary-item">
        <image :src="icons.plus" mode="aspectFit" />
        <view>
          <text class="label">已选</text>
          <text class="value">{{ count }} 道菜</text>
        </view>
      </view>
      <view class="summary-item">
        <image :src="icons.people" mode="aspectFit" />
        <view>
          <text class="label">用餐人数</text>
          <text class="value">{{ servings }} 人</text>
        </view>
      </view>
      <view class="summary-item">
        <image :src="icons.clockOrange" mode="aspectFit" />
        <view>
          <text class="label">预计耗时</text>
          <text class="value">{{ minutes }} 分钟</text>
        </view>
      </view>
    </view>
    <image class="basket" :src="icons.basket" mode="aspectFit" />
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'

defineProps<{
  count: number
  servings: number
  minutes: number
}>()

function goMenu() {
  uni.reLaunch({ url: '/pages/menu/index' })
}
</script>

<style scoped lang="scss">
.summary {
  position: relative;
  overflow: hidden;
  padding: 28rpx 24rpx 30rpx;
}

.summary-head,
.head-left,
.summary-item {
  display: flex;
  align-items: center;
}

.summary-head {
  justify-content: space-between;
  margin-bottom: 28rpx;
}

.head-left {
  gap: 16rpx;
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.head-icon {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: linear-gradient(135deg, $primary-2, $primary);
}

.head-icon image {
  width: 34rpx;
  height: 34rpx;
}

.detail {
  color: $primary;
  font-size: 26rpx;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rpx;
  padding-right: 58rpx;
}

.summary-item {
  gap: 8rpx;
  min-width: 0;
  justify-content: center;
  border-right: 1rpx solid $border;
}

.summary-item:last-child {
  border-right: 0;
}

.summary-item image {
  width: 50rpx;
  height: 50rpx;
  flex: 0 0 auto;
}

.label,
.value {
  display: block;
}

.label {
  color: $text-sub;
  font-size: 20rpx;
}

.value {
  white-space: nowrap;
  margin-top: 4rpx;
  color: $text-main;
  font-size: 26rpx;
  font-weight: 900;
}

.basket {
  position: absolute;
  right: -8rpx;
  bottom: -14rpx;
  width: 106rpx;
  height: 106rpx;
}
</style>
