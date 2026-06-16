<template>
  <view :class="['timeline-group', { 'is-first': isFirst, 'is-last': isLast }]">
    <view class="timeline-rail" />
    <view class="timeline-month">
      <view class="timeline-month-dot" />
      <text class="timeline-month-label">{{ monthLabel }}</text>
    </view>
    <view class="timeline-month-items">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  monthLabel: string
  isFirst?: boolean
  isLast?: boolean
}>()
</script>

<style scoped lang="scss">
.timeline-group {
  position: relative;
  padding-left: 0;
}

.timeline-group:not(:last-child) {
  margin-bottom: 40rpx;
}

.timeline-rail {
  position: absolute;
  left: 32rpx;
  top: 0;
  bottom: 0;
  width: 2rpx;
  background: rgba(255, 123, 37, 0.18);
}

.timeline-group.is-first .timeline-rail {
  top: 32rpx;
}

.timeline-group.is-last .timeline-rail {
  bottom: 16rpx;
}

.timeline-month {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 24rpx;
}

.timeline-month-dot {
  width: 28rpx;
  height: 28rpx;
  margin-left: 19rpx;
  border-radius: 50%;
  background: $primary;
  box-shadow: 0 0 0 4rpx #fff, 0 4rpx 12rpx rgba(255, 123, 37, 0.24);
}

.timeline-month-label {
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.timeline-month-items {
  padding-left: 80rpx;
}
</style>
