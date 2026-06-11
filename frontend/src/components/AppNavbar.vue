<template>
  <view class="navbar">
    <button v-if="back" class="nav-icon" hover-class="tap" @tap="goBack">
      <text class="back-mark">‹</text>
    </button>
    <view class="nav-center">
      <text class="nav-title">{{ title }}</text>
      <text v-if="subtitle" class="nav-subtitle">{{ subtitle }}</text>
    </view>
    <view class="nav-right">
      <slot name="right" />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  back?: boolean
}>()

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/home/index' })
  }
}
</script>

<style scoped lang="scss">
.navbar {
  min-height: 88rpx;
  display: grid;
  grid-template-columns: 88rpx 1fr 88rpx;
  align-items: center;
  margin-bottom: 26rpx;
}

.nav-icon {
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 10rpx 26rpx rgba(64, 38, 21, 0.08);
}

.back-mark {
  color: $text-main;
  font-size: 54rpx;
  font-weight: 400;
  line-height: 1;
}

.nav-center {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.nav-title {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 34rpx;
  font-weight: 900;
  color: $text-main;
}

.nav-subtitle {
  font-size: 24rpx;
  color: $text-sub;
}

.nav-right {
  display: flex;
  justify-content: flex-end;
}
</style>
