<template>
  <view v-if="privacy.visible" class="privacy-mask">
    <view class="privacy-card card">
      <text class="privacy-eyebrow">合规提醒</text>
      <text class="privacy-title">先确认隐私指引，再继续使用微信资料能力</text>
      <text class="privacy-copy">
        当前页面会使用微信头像、昵称等资料能力。请先阅读并同意
        {{ privacy.contractName || '《用户隐私保护指引》' }}。
      </text>
      <text v-if="privacy.referrer" class="privacy-scene">触发场景：{{ privacy.referrer }}</text>

      <view class="privacy-actions">
        <button class="ghost-btn action-btn" hover-class="tap" @tap="viewContract">查看指引</button>
        <button class="ghost-muted action-btn" hover-class="tap" @tap="disagree">暂不使用</button>
      </view>

      <button
        id="privacy-agree-btn"
        class="primary-btn agree-btn"
        hover-class="tap"
        open-type="agreePrivacyAuthorization"
        @agreeprivacyauthorization="agree"
      >
        同意并继续
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { wechatPrivacyState, openWechatPrivacyContract, rejectWechatPrivacyAuthorization, resolveWechatPrivacyAuthorization } from '@/utils/wechat-privacy'

const privacy = wechatPrivacyState

async function viewContract() {
  try {
    await openWechatPrivacyContract()
  } catch (error) {
    const message = error instanceof Error ? error.message : '打开失败'
    uni.showToast({ title: message, icon: 'none' })
  }
}

function disagree() {
  rejectWechatPrivacyAuthorization()
  uni.showToast({ title: '未同意前将无法使用微信头像昵称能力', icon: 'none' })
}

function agree() {
  resolveWechatPrivacyAuthorization()
}
</script>

<style scoped lang="scss">
.privacy-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 28rpx 24rpx calc(28rpx + env(safe-area-inset-bottom));
  background: rgba(34, 24, 18, 0.42);
  backdrop-filter: blur(8rpx);
}

.privacy-card {
  width: 100%;
  max-width: 430px;
  padding: 34rpx 30rpx 30rpx;
  border-radius: 32rpx;
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 151, 87, 0.16), transparent 180rpx),
    linear-gradient(180deg, rgba(255, 253, 251, 0.98) 0%, rgba(255, 247, 239, 0.98) 100%);
}

.privacy-eyebrow,
.privacy-title,
.privacy-copy,
.privacy-scene {
  display: block;
}

.privacy-eyebrow {
  color: $primary;
  font-size: 22rpx;
  font-weight: 900;
  letter-spacing: 2rpx;
}

.privacy-title {
  margin-top: 16rpx;
  color: $text-main;
  font-size: 36rpx;
  line-height: 1.35;
  font-weight: 900;
}

.privacy-copy {
  margin-top: 16rpx;
  color: $text-sub;
  font-size: 25rpx;
  line-height: 1.7;
}

.privacy-scene {
  margin-top: 12rpx;
  color: $primary;
  font-size: 22rpx;
  font-weight: 700;
}

.privacy-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 28rpx;
}

.action-btn,
.agree-btn {
  width: 100%;
}

.ghost-muted {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 78rpx;
  border: 2rpx solid #e9ddd4;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  color: $text-sub;
  font-size: 28rpx;
  font-weight: 800;
}

.agree-btn {
  margin-top: 16rpx;
}
</style>
