<template>
  <view v-if="versionUpdateState.visible" class="version-mask">
    <view class="version-card card">
      <view class="version-hero">
        <view>
          <text class="version-eyebrow">菜品库已更新</text>
          <text class="version-title">发现新版本</text>
        </view>
        <view class="version-illustration">
          <image :src="icons.basket" mode="aspectFit" />
        </view>
      </view>

      <text class="version-copy">
        页面内容已经更新，刷新后就能使用最新功能和修复。
      </text>

      <view class="version-note">
        <text class="note-dot"></text>
        <text>不会影响已登录状态和已保存的数据。</text>
      </view>

      <view class="version-actions">
        <button class="ghost-btn version-btn" hover-class="tap" @tap="snoozeVersionUpdate">稍后</button>
        <button class="primary-btn version-btn" hover-class="tap" @tap="reloadToLatestVersion">立即更新</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { icons } from '@/data/assets'
import { reloadToLatestVersion, snoozeVersionUpdate, versionUpdateState } from '@/utils/version-check'
</script>

<style scoped lang="scss">
.version-mask {
  position: fixed;
  inset: 0;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 36rpx 28rpx calc(36rpx + env(safe-area-inset-bottom));
  background: rgba(39, 28, 21, 0.42);
  backdrop-filter: blur(10rpx);
}

.version-card {
  width: 100%;
  max-width: 390px;
  padding: 34rpx 30rpx 30rpx;
  border-radius: 34rpx;
  overflow: hidden;
  background:
    radial-gradient(circle at 96% 0%, rgba(255, 138, 42, 0.2), transparent 184rpx),
    linear-gradient(180deg, rgba(255, 253, 251, 0.98) 0%, rgba(255, 247, 239, 0.98) 100%);
  box-shadow: 0 28rpx 64rpx rgba(72, 42, 24, 0.2);
}

.version-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22rpx;
}

.version-eyebrow,
.version-title,
.version-copy,
.version-note {
  display: block;
}

.version-eyebrow {
  color: $primary;
  font-size: 23rpx;
  font-weight: 900;
  letter-spacing: 2rpx;
}

.version-title {
  margin-top: 10rpx;
  color: $text-main;
  font-size: 42rpx;
  line-height: 1.22;
  font-weight: 900;
}

.version-illustration {
  width: 112rpx;
  height: 112rpx;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32rpx;
  background: rgba(255, 246, 237, 0.9);
  box-shadow: inset 0 0 0 1rpx rgba(255, 157, 87, 0.16);
}

.version-illustration image {
  width: 86rpx;
  height: 86rpx;
}

.version-copy {
  margin-top: 24rpx;
  color: $text-sub;
  font-size: 27rpx;
  line-height: 1.65;
}

.version-note {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 18rpx;
  border-radius: 20rpx;
  background: rgba(255, 244, 235, 0.9);
  color: $text-sub;
  font-size: 23rpx;
  line-height: 1.45;
}

.note-dot {
  width: 12rpx;
  height: 12rpx;
  flex: 0 0 auto;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 0 0 8rpx rgba(255, 106, 26, 0.12);
}

.version-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 28rpx;
}

.version-btn {
  width: 100%;
}
</style>
