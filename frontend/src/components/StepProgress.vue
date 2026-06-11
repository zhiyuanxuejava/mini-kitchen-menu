<template>
  <view class="step-progress">
    <view
      v-for="step in steps"
      :key="step.id"
      :class="['step-node', step.stepNo < current ? 'done' : '', step.stepNo === current ? 'active' : '']"
    >
      <view class="circle">{{ step.stepNo < current ? '✓' : step.stepNo }}</view>
      <text class="label line-clamp-1">{{ step.title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { DishStep } from '@/data/types'

defineProps<{
  steps: DishStep[]
  current: number
}>()
</script>

<style scoped lang="scss">
.step-progress {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(112rpx, 1fr));
  gap: 8rpx;
  margin: 22rpx 0 34rpx;
}

.step-progress::before {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  top: 34rpx;
  height: 6rpx;
  background: #e4e2df;
}

.step-node {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  min-width: 0;
}

.circle {
  width: 68rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid #dedbd8;
  border-radius: 50%;
  background: $page-bg;
  color: #9b9692;
  font-size: 28rpx;
  font-weight: 900;
}

.step-node.done .circle {
  border-color: $success;
  color: #fff;
  background: $success;
}

.step-node.active .circle {
  border-color: $primary;
  color: #fff;
  background: linear-gradient(135deg, $primary-2, $primary);
}

.label {
  max-width: 100%;
  color: $text-main;
  font-size: 25rpx;
  font-weight: 800;
}
</style>
