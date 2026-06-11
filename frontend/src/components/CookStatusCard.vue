<template>
  <view class="status-card card">
    <view class="status-item">
      <image :src="icons.timer" mode="aspectFit" />
      <view>
        <text class="label">待制作</text>
        <text class="value">{{ pending }} 道</text>
      </view>
    </view>
    <view class="status-item">
      <image :src="icons.pot" mode="aspectFit" />
      <view>
        <text class="label">制作中</text>
        <text class="value">{{ cooking }} 道</text>
      </view>
    </view>
    <view class="status-item">
      <image :src="icons.check" mode="aspectFit" />
      <view>
        <text class="label">已完成</text>
        <text class="value">{{ done }} 道</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'

defineProps<{
  pending: number
  cooking: number
  done: number
}>()
</script>

<style scoped lang="scss">
.status-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 28rpx 18rpx;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  min-width: 0;
}

.status-item:not(:last-child) {
  border-right: 1rpx solid $border;
}

.status-item image {
  width: 62rpx;
  height: 62rpx;
}

.label,
.value {
  display: block;
}

.label {
  color: $text-sub;
  font-size: 24rpx;
}

.value {
  margin-top: 4rpx;
  color: $text-main;
  font-size: 34rpx;
  font-weight: 900;
}
</style>
