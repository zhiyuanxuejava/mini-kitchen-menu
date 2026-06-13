<template>
  <view class="step-card card">
    <view class="step-title">
      <view class="badge">
        <image :src="icons.pot" mode="aspectFit" />
      </view>
      <text>步骤 {{ step.stepNo }}：{{ step.title }}</text>
    </view>
    <image class="step-image" :src="step.image" mode="aspectFill" />
    <text class="desc">{{ step.description }}</text>
    <view class="info-row heat">
      <view class="info-left">
        <image :src="icons.fire" mode="aspectFit" />
        <text>火候</text>
      </view>
      <text>{{ step.heat }}</text>
    </view>
    <view class="info-row time">
      <view class="info-left">
        <image :src="icons.clock" mode="aspectFit" />
        <text>时间</text>
      </view>
      <text class="time-value">{{ step.timeLabel || `${step.minutes} 分钟` }}</text>
    </view>
    <view class="tip">
      <view class="info-left">
        <image :src="icons.note" mode="aspectFit" />
        <text>注意事项</text>
      </view>
      <text>{{ step.tips }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'
import type { DishStep } from '@/data/types'

defineProps<{
  step: DishStep
}>()
</script>

<style scoped lang="scss">
.step-card {
  padding: 28rpx;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 18rpx;
  color: $text-main;
  font-size: 40rpx;
  font-weight: 900;
}

.badge {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22rpx;
  background: $primary-light;
}

.badge image {
  width: 44rpx;
  height: 44rpx;
}

.step-image {
  width: 100%;
  height: 360rpx;
  margin-top: 28rpx;
  border-radius: 24rpx;
}

.desc {
  display: block;
  margin: 28rpx 8rpx;
  color: $text-main;
  font-size: 30rpx;
  line-height: 1.6;
}

.info-row,
.tip {
  margin-top: 18rpx;
  padding: 22rpx 24rpx;
  border-radius: 22rpx;
  background: #fff9f4;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 29rpx;
  font-weight: 900;
}

.heat > text {
  color: $primary;
}

.time-value {
  color: $success;
  font-weight: 900;
}

.info-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: $text-main;
}

.info-left image {
  width: 40rpx;
  height: 40rpx;
}

.tip {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  color: $text-main;
  font-size: 28rpx;
  line-height: 1.5;
}
</style>
