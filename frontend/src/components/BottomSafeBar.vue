<template>
  <view class="safe-bar">
    <slot />
  </view>
</template>

<style scoped lang="scss">
.safe-bar {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 18;
  width: 100%;
  max-width: 430px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
  padding: 20rpx 32rpx calc(22rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 251, 0.94);
  box-shadow: 0 -12rpx 30rpx rgba(70, 42, 24, 0.06);
  transform: translateX(-50%);
}
</style>
