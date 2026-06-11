<template>
  <view class="section-title">
    <view class="mark" />
    <text>{{ title }}</text>
    <slot />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">
.section-title {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin: 36rpx 0 20rpx;
  color: $text-main;
  font-size: 32rpx;
  font-weight: 900;
}

.mark {
  width: 8rpx;
  height: 34rpx;
  border-radius: 999rpx;
  background: $primary;
}

.section-title :deep(.section-extra) {
  margin-left: auto;
  color: $success;
  font-size: 25rpx;
  font-weight: 700;
}
</style>
